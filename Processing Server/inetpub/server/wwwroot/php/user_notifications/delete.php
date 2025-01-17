<?php

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    $number = $_POST["number"];
    
    $stmt = $pdo->prepare("DELETE FROM user_notifications WHERE number = :number AND user_number = :user_number");
    $stmt->execute(array(
        ':number' => $number,
        ':user_number' => $userInfo["number"]
    ));

?>