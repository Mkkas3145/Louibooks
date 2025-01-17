<?php

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();
    
    $stmt = $pdo->prepare("DELETE FROM user_notifications WHERE user_number = :user_number");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"]
    ));

?>