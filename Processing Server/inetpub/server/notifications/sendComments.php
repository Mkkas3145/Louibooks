<?php

    include_once('default_function.php');

    if (isset($_POST["key"]) && $_POST["key"] == $originalKey) {
        $commentsNumber = $_POST["commentsNumber"];
        $userNumbers = explode(",", $_POST["userNumbers"]);
        $type = 2;

        //댓글 정보 구하기
        $stmt = $pdo->prepare("SELECT user_number, content FROM comments WHERE number = :number");
        $stmt->execute(array(
            ':number' => $commentsNumber
        ));
        $commentsInfo = $stmt->fetch();

        if (isset($commentsInfo)) {
            $senderNumber = $commentsInfo["user_number"];
    
            $data = array(
                "senderNumber" => (int) $senderNumber,
                "commentsNumber" => (int) $commentsNumber
            );
        
            sendUserNotifications($userNumbers, $type, $data);
            










            //---------- 푸시 알림 ----------




            






            //사용자 정보
            $userInfo = getUserInfo($senderNumber)[0];
            $nickname = $userInfo["nickname"];
            $content = $commentsInfo["content"];
            $clickURL = "https://louibooks.com/comment/" . $commentsNumber;

            $info = array(
                "nickname" => $nickname,
                "content" => $content,
                "clickURL" => $clickURL
            );

            sendUserPushNotifications($userNumbers, $type, $info);
        }
    }

?>