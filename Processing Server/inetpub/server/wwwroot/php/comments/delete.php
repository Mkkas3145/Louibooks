<?php

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $commentsNumber = $_POST["commentsNumber"];

        //본인이 맞는지
        $stmt = $pdo->prepare("SELECT number FROM comments where user_number = :user_number AND number = :number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $commentsNumber,
        ));
        $comments = $stmt->fetch();
        if (isset($comments["number"]) == false) {
            echo 'not you';
            exit;
        }

        deleteComments($commentsNumber);
    }

?>