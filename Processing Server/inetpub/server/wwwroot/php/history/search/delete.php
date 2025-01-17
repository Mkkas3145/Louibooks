<?php

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $content = $_POST["content"];

        $sql = $pdo->prepare('UPDATE search_history SET public_status = 1 WHERE user_number = :user_number AND content = :content');
        $sql->execute(array(
            ':content' => $content,
            ':user_number' => $userInfo["number"],
        ));
    } else {
        echo "not login";
    }

?>