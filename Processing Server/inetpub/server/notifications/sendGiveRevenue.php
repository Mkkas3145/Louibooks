<?php

    include_once('default_function.php');

    if (isset($_POST["key"]) && $_POST["key"] == $originalKey) {
        $userNumber = $_POST["userNumber"];
        $status = $_POST["status"];
        $revenue = $_POST["revenue"];
        $type = 9;

        //보낼 유저
        $userNumbers = array($userNumber);

        $data = array(
            "userNumber" => (int) $userNumber,
            "status" => (int) $status,
            "revenue" => (int) $revenue
        );
        
        sendUserNotifications($userNumbers, $type, $data);











        //---------- 푸시 알림 ----------




            






            
        $data = array(
            "status" => (int) $status,
            "revenue" => (int) $revenue
        );
        sendUserPushNotifications($userNumbers, $type, $data);
    }

?>