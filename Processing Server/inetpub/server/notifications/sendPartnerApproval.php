<?php

    include_once('default_function.php');

    if (isset($_POST["key"]) && $_POST["key"] == $originalKey) {
        $senderNumber = $_POST["senderNumber"];
        $userNumber = $_POST["userNumber"];
        $requestType = $_POST["requestType"];
        $approvalType = $_POST["approvalType"];
        $type = 8;

        //보낼 유저
        $userNumbers = array($userNumber);

        $data = array(
            "senderNumber" => (int) $senderNumber,
            "userNumber" => (int) $userNumber,
            "requestType" => (int) $requestType,
            "approvalType" => (int) $approvalType
        );
        
        sendUserNotifications($userNumbers, $type, $data);











        //---------- 푸시 알림 ----------




            






            
        $data = array(
            "requestType" => (int) $requestType,
            "approvalType" => (int) $approvalType
        );
        sendUserPushNotifications($userNumbers, $type, $data);
    }

?>