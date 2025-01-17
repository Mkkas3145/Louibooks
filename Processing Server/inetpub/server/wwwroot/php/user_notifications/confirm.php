<?php

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();
    
    $sql = $pdo->prepare('UPDATE user SET not_confirm_notifications = 0 WHERE number = :number');
    $sql->execute(array(
        ':number' => $userInfo["number"]
    ));
    $sql = $pdo->prepare('UPDATE user_notifications SET confirm = 1 WHERE user_number = :user_number');
    $sql->execute(array(
        ':user_number' => $userInfo["number"]
    ));

?>