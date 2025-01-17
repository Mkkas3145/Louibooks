<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $userNumber = $userInfo["number"];
        $savedUserNumber = $_POST['userNumber'];

        if ($userNumber == $savedUserNumber) {
            echo "you can't add yourself";
            exit;
        }

        $stmt = $pdo->prepare("SELECT number FROM user_list WHERE user_number = :user_number AND saved_user_number = :saved_user_number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':saved_user_number' => $savedUserNumber,
        ));
        $userList = $stmt->fetchAll();
        $userListLength = count($userList);
        if ($userListLength == 0) {
            $sql = $pdo->prepare('insert into user_list (user_number, saved_user_number, save_date) values(:user_number, :saved_user_number, :save_date)');
            $sql->execute(array(
                ':user_number' => $userInfo["number"],
                ':saved_user_number' => $savedUserNumber,
                ':save_date' => date("Y-m-d H:i:s"),
            ));
            $sql = $pdo->prepare('UPDATE user SET user_list_save_count = user_list_save_count + 1 WHERE number = :number');
            $sql->execute(array(
                ':number' => $savedUserNumber
            ));
        }
    }

?>