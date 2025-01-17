<?php

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $sql = $pdo->prepare('UPDATE user SET works_history_use = :works_history_use WHERE number = :number');
        $sql->execute(array(
            ':number' => $userInfo["number"],
            ':works_history_use' => 1,
        ));
    }

?>