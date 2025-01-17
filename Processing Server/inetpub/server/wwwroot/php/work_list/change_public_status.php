<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $workListNumber = $_POST['workListNumber'];
        $publicStatus = $_POST["publicStatus"];

        //수정
        $sql = $pdo->prepare('UPDATE work_list SET public_status = :public_status WHERE number = :number AND user_number = :user_number');
        $sql->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $workListNumber,
            ':public_status' => $publicStatus,
        ));
    }

?>