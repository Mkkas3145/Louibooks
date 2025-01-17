<?php

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $sql = $pdo->prepare('UPDATE user SET reply_notifications_use = :reply_notifications_use WHERE number = :number');
        $sql->execute(array(
            ':number' => $userInfo["number"],
            ':reply_notifications_use' => 0
        ));
    }

?>