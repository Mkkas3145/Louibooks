<?php

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $sql = $pdo->prepare('UPDATE search_history SET public_status = :public_status WHERE user_number = :user_number');
        $sql->execute(array(
            ':user_number' => $userInfo["number"],
            ':public_status' => 1,
        ));
    }

?>