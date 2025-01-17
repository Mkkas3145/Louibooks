<?php

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $workNumber = $_POST["workNumber"];
        $score = $_POST["score"];
        $content = $_POST["content"];

        //커뮤니티 자격 박탈 여부
        if ($userInfo["community_permission"] == false) {
            echo 'no_community_permission';
            exit;
        }

        if ($content == '') {
            echo 'content is empty';
            exit;
        }

        if (isWritableRatings($workNumber) == false) {
            echo "not writeable";
            exit;
        }

        $sql = $pdo->prepare('insert into ratings (work_number, user_number, content, score, upload_date) values(:work_number, :user_number, :content, :score, :upload_date)');
        $sql->execute(array(
            ':work_number' => $workNumber,
            ':user_number' => $userInfo["number"],
            ':content' => $content,
            ':score' => $score,
            ':upload_date' => date("Y-m-d H:i:s")
        ));
        $lastInsertId = $pdo->lastInsertId();

        echo json_encode(getRatingsInfo($lastInsertId)[0]);


        

        //알림 보내기
        $stmt = $pdo->prepare("SELECT user_number FROM works WHERE number = :number");
        $stmt->execute(array(
            ':number' => $workNumber
        ));
        $workInfo = $stmt->fetch();

        //사용자가 활동 알림을 허용하였는지
        $stmt = $pdo->prepare("SELECT activity_notifications_use FROM user WHERE number = :number");
        $stmt->execute(array(
            ':number' => $workInfo["user_number"]
        ));
        $sendUserInfo = $stmt->fetch();

        if ($sendUserInfo["activity_notifications_use"] == true) {
            //보낼 사람
            $userNumbers = array();
            $userNumbers[] = $workInfo["user_number"];
            //평가 및 리뷰 번호
            $ratingsNumber = $lastInsertId;

            requestUserNotificationsRatings($ratingsNumber, $userNumbers);
        }
    }

?>