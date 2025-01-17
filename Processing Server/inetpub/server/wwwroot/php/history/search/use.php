<?php

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $sql = $pdo->prepare('UPDATE user SET search_history_use = :search_history_use WHERE number = :number');
        $sql->execute(array(
            ':number' => $userInfo["number"],
            ':search_history_use' => 1,
        ));
    }

?>