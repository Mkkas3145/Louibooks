<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $workNumber = $_POST["workNumber"];

        $stmt = $pdo->prepare("DELETE FROM not_interested WHERE user_number = :user_number AND work_number = :work_number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':work_number' => $workNumber
        ));
        
        $sql = $pdo->prepare('insert into not_interested (user_number, work_number, date) values(:user_number, :work_number, :date)');
        $sql->execute(array(
            ':user_number' => $userInfo["number"],
            ':work_number' => $workNumber,
            ':date' => date("Y-m-d H:i:s")
        ));
    }

?>