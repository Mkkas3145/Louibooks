<?php

    include_once('default_function.php');

    if (isset($_POST["key"]) && $_POST["key"] == $originalKey) {
        $userNumber = $_POST["userNumber"];
        $type = 11;

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

            $data["default"] = array(
                "nickname" => $user["nickname"]
            );

            //푸시 알림 보내기
            sendUserPushNotifications($userNumbers, $type, $data);

            $userNumbers_length = count($userNumbers);
            for ($i = 0; $i < $userNumbers_length; $i++) {
                deleteUser($userNumbers[$i]);
            }
        }
    }

?>