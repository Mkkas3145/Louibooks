<?php

    include_once('default_function.php');

    if (isset($_POST["key"]) && $_POST["key"] == $originalKey) {
        $senderNumber = $_POST["senderNumber"];
        $type = $_POST["type"];
        $reason = $_POST["reason"];
        $content = $_POST["content"];
        $userNumbers = explode(",", $_POST["userNumbers"]);
        $userNumbers_length = count($userNumbers);
        $type = 5;

        $data = array(
            "senderNumber" => (int) $senderNumber,
            "type" => (int) $type,
            "reason" => (int) $reason,
            "content" => $content
        );
    
        sendUserNotifications($userNumbers, $type, $data);

                        










        //---------- 푸시 알림 ----------
        sendUserPushNotifications($userNumbers, $type, array());















        
        //유저의 모든 커뮤니티 활동 기록 삭제
        for ($i = 0; $i < $userNumbers_length; $i++) {
            $userNumber = $userNumbers[$i];
            deleteAllCommunityHistory($userNumber);
        }
    }

?>