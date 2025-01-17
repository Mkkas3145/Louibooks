<?php

    include_once('default_function.php');

    if (isset($_POST["key"]) && $_POST["key"] == $originalKey) {
        $userNumber = $_POST["userNumber"];
        $sessionNumber = $_POST["sessionNumber"];
        $type = 12;

        //회차 정보 구하기
        $stmt = $pdo->prepare("SELECT nickname FROM user WHERE number = :number");
        $stmt->execute(array(
            "number" => $userNumber
        ));
        $user = $stmt->fetch();

        if (isset($user["nickname"])) {
            //보낼 유저 목록
            $userNumbers = array();
            $userNumbers[] = $userNumber;

            //알림
            $data = array(
                "sessionNumber" => $sessionNumber
            );
            sendUserNotifications($userNumbers, $type, $data);

            //푸시 알림 보내기
            $data["default"] = array(
                "nickname" => $user["nickname"]
            );
            sendUserPushNotifications($userNumbers, $type, $data);
        }
    }

?>