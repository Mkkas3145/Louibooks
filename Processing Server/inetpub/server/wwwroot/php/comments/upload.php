<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $uid = null;
        if (isset($_POST["uid"])) {
            $uid = $_POST["uid"];
        }
        $content = $_POST["content"];
        $reply_number = null;
        if (isset($_POST["reply_number"])) {
            $reply_number = $_POST["reply_number"];
        }

        //커뮤니티 자격 박탈 여부
        if ($userInfo["community_permission"] == false) {
            echo 'no_community_permission';
            exit;
        }

        if ($content == '') {
            echo 'content is empty';
            exit;
        }

        $user_reply = null;
        if (isset($_POST["user_reply"]) && $_POST["user_reply"] != $userInfo["number"]) {
            $user_reply = $_POST["user_reply"];
        }

        $data = array(
            ':user_number' => $userInfo["number"],
            ':uid' => $uid,
            ':content' => $content,
            ':reply_number' => $reply_number,
            ':upload_date' => date("Y-m-d H:i:s"),
            ':user_reply' => $user_reply,
        );

        $sql = $pdo->prepare('insert into comments (uid, content, user_number, reply_number, upload_date, user_reply) values(:uid, :content, :user_number, :reply_number, :upload_date, :user_reply)');
        $sql->execute($data);
        $lastInsertId = $pdo->lastInsertId();

        echo json_encode(getCommentsInfo($lastInsertId)[0]);



        
        //답글이면
        if ($reply_number != null) {
            $sql = $pdo->prepare('UPDATE comments SET reply_count = reply_count + 1 WHERE number = :number');
            $sql->execute(array(
                ':number' => $reply_number,
            ));
        }




        //댓글 카운트
        if ($reply_number == null) {
            $stmt = $pdo->prepare("SELECT number FROM comments_count where uid = :uid");
            $stmt->execute(array(
                ':uid' => $uid,
            ));
            $commentsCount = $stmt->fetch();

            if (isset($commentsCount["number"])) {
                $sql = $pdo->prepare('UPDATE comments_count SET count = count + 1 WHERE uid = :uid');
                $sql->execute(array(
                    ':uid' => $uid,
                ));
            } else {
                $sql = $pdo->prepare('insert into comments_count (uid, count) values(:uid, :count)');
                $sql->execute(array(
                    ':uid' => $uid,
                    ':count' => 1,
                ));
            }
        }




        //답글이 아니면
        if ($reply_number == null) {
            $sendUserNumber = array(); //보낼 유저 목록

            //회차 댓글
            if (strpos($uid, 'part') !== false) {
                $stmt = $pdo->prepare("SELECT user_number FROM work_part WHERE number = :number");
                $stmt->execute(array(
                    ':number' => str_replace('part_', '', $uid)
                ));
                $sendUserNumber = $stmt->fetch()["user_number"];
            }
            //커뮤니티 댓글
            if (strpos($uid, 'community') !== false) {
                $stmt = $pdo->prepare("SELECT user_number FROM community WHERE number = :number");
                $stmt->execute(array(
                    ':number' => str_replace('community_', '', $uid)
                ));
                $sendUserNumber = $stmt->fetch()["user_number"];
            }

            //사용자가 활동 알림을 허용하였는지
            $stmt = $pdo->prepare("SELECT activity_notifications_use FROM user WHERE number = :number");
            $stmt->execute(array(
                ':number' => $sendUserNumber
            ));
            $sendUserInfo = $stmt->fetch();

            if ($sendUserInfo["activity_notifications_use"] == true && $sendUserNumber != $userInfo["number"]) {
                //보낼 사람
                $userNumbers = array();
                $userNumbers[] = $sendUserNumber;
                //댓글 번호
                $commentsNumber = $lastInsertId;

                requestUserNotificationsComments($commentsNumber, $userNumbers);
            }
        }





        //답글이면 답글 알림을 보낸다.
        if ($reply_number != null) {
            //상위 댓글 정보
            $stmt = $pdo->prepare("SELECT number, user_number FROM comments WHERE number = :number");
            $stmt->execute(array(
                ':number' => $reply_number
            ));
            $commentsInfo = $stmt->fetch();

            if (isset($commentsInfo["number"])) {
                //유저 지정 안함
                if ($user_reply == null) {
                    //자기 자신한테 보내는 게 아닐 경우
                    if ($commentsInfo["user_number"] != $userInfo["number"]) {
                        //보낼 사람이 답글 알림을 허용하였는지
                        $stmt = $pdo->prepare("SELECT reply_notifications_use FROM user where number = :number");
                        $stmt->execute(array(
                            ':number' => $commentsInfo["user_number"]
                        ));
                        $user = $stmt->fetch();

                        if ($user["reply_notifications_use"] == true) {
                            //보낼 사람
                            $userNumbers = array();
                            $userNumbers[] = $commentsInfo["user_number"];
                            //댓글 번호
                            $commentsNumber = $lastInsertId;

                            requestUserNotificationsComments($commentsNumber, $userNumbers);
                        }
                    }
                } else {
                    //보낼 사람이 답글 알림을 허용하였는지
                    $stmt = $pdo->prepare("SELECT reply_notifications_use FROM user where number = :number");
                    $stmt->execute(array(
                        ':number' => $user_reply
                    ));
                    $user = $stmt->fetch();

                    if ($user["reply_notifications_use"] == true) {
                        //보낼 사람
                        $userNumbers = array();
                        $userNumbers[] = $user_reply;
                        //댓글 번호
                        $commentsNumber = $lastInsertId;

                        requestUserNotificationsComments($commentsNumber, $userNumbers);
                    }
                }
            }
        }
    }

?>