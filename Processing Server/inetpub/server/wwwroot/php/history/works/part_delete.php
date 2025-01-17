<?php

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();
    $partNumber = $_POST["partNumber"];

    $sql = $pdo->prepare('UPDATE work_part_viewed SET public_status = :public_status, percent = :percent WHERE part_number = :part_number AND user_number = :user_number');
    $sql->execute(array(
        ':user_number' => $userInfo["number"],
        ':part_number' => $partNumber,
        ':public_status' => 1,
        ':percent' => 0 
    ));

?>