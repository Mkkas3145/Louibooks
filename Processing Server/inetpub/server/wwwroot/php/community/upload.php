<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $uid = $_POST["uid"];
        $content = $_POST["content"];
        
        //권한 체크
        $originatorNumber = null;
        if (strpos($uid, 'work') !== false) {
            $stmt = $pdo->prepare("SELECT user_number FROM works WHERE number = :number");
            $stmt->execute(array(
                ':number' => str_replace('work_', '', $uid)
            ));
            $originatorNumber = $stmt->fetch()["user_number"];
        } else if (strpos($uid, 'user') !== false) {
            $stmt = $pdo->prepare("SELECT number FROM user WHERE number = :number");
            $stmt->execute(array(
                ':number' => str_replace('user_', '', $uid)
            ));
            $originatorNumber = $stmt->fetch()["number"];
        }
        if ($userInfo["isLogin"] == false || $originatorNumber == null || $originatorNumber != $userInfo["number"]) {
            echo 'no_permission';
            exit;
        }
        //커뮤니티 자격 박탈 여부
        if ($userInfo["community_permission"] == false) {
            echo 'no_community_permission';
            exit;
        }

        //
        $sql = $pdo->prepare('insert into community (uid, content, user_number, upload_date) values(:uid, :content, :user_number, :upload_date)');
        $sql->execute(array(
            'uid' => $uid,
            'content' => $content,
            'user_number' => $userInfo["number"],
            ':upload_date' => date("Y-m-d H:i:s"),
        ));
        $lastInsertId = $pdo->lastInsertId();
        
        echo json_encode(getCommunityInfo($lastInsertId)[0]);




        //커뮤니티 카운트
        $stmt = $pdo->prepare("SELECT number FROM community_count where uid = :uid");
        $stmt->execute(array(
            ':uid' => $uid,
        ));
        $commentsCount = $stmt->fetch();

        if (isset($commentsCount["number"])) {
            $sql = $pdo->prepare('UPDATE community_count SET count = count + 1 WHERE uid = :uid');
            $sql->execute(array(
                ':uid' => $uid,
            ));
        } else {
            $sql = $pdo->prepare('insert into community_count (uid, count) values(:uid, :count)');
            $sql->execute(array(
                ':uid' => $uid,
                ':count' => 1,
            ));
        }



        
        //알림 보내기
        if (strpos($uid, 'work') !== false) {
            requestUserNotificationsCommunityPost($lastInsertId);
        }
    }

?>