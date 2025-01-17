<?php

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $sql = $pdo->prepare('UPDATE user SET louibooks_notifications_use = :louibooks_notifications_use WHERE number = :number');
        $sql->execute(array(
            ':number' => $userInfo["number"],
            ':louibooks_notifications_use' => 1
        ));
    }

?>