<?php

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();
    $workNumber = $_POST["workNumber"];

    $sql = $pdo->prepare('UPDATE work_part_viewed SET public_status = :public_status, percent = :percent WHERE work_number = :work_number AND user_number = :user_number');
    $sql->execute(array(
        ':user_number' => $userInfo["number"],
        ':work_number' => $workNumber,
        ':public_status' => 1,
        ':percent' => 0 
    ));

?>