<?php

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $sql = $pdo->prepare('UPDATE user SET activity_notifications_use = :activity_notifications_use WHERE number = :number');
        $sql->execute(array(
            ':number' => $userInfo["number"],
            ':activity_notifications_use' => 0
        ));
    }

?>