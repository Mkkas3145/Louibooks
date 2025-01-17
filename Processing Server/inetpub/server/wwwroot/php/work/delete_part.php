<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {

        //본인이 맞는지
        $stmt = $pdo->prepare("SELECT data, type, work_number, public_status FROM work_part where user_number = :user_number AND number = :number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $_POST["partNumber"],
        ));
        $partInfo = $stmt->fetch();
        if (count($partInfo) == 0) {
            echo 'not you';
            exit;
        }

        //회차 삭제
        deleteWorkPart($_POST["partNumber"]);

    }

?>