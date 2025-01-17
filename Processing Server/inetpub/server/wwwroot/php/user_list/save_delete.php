<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $userNumber = $userInfo["number"];
        $savedUserNumber = $_POST['userNumber'];

        $stmt = $pdo->prepare("SELECT number FROM user_list WHERE user_number = :user_number AND saved_user_number = :saved_user_number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':saved_user_number' => $savedUserNumber,
        ));
        $userList = $stmt->fetchAll();
        $userListLength = count($userList);
        if ($userListLength != 0) {
            deleteSaveUserList($userNumber, $savedUserNumber);
        }
    }

?>