<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $commentsNumber = $_POST["commentsNumber"];
        $type = $_POST["type"];

        $stmt = $pdo->prepare("SELECT type FROM comments_likes_dislike where user_number = :user_number AND comments_number = :comments_number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':comments_number' => $commentsNumber,
        ));
        $likesDislike = $stmt->fetch();

        if (isset($likesDislike["type"])) {
            $stmt = $pdo->prepare("DELETE FROM comments_likes_dislike WHERE user_number = :user_number AND comments_number = :comments_number");
            $stmt->execute(array(
                ':user_number' => $userInfo["number"],
                ':comments_number' => $commentsNumber,
            ));

            if ($likesDislike["type"] == 0) {
                $sql = $pdo->prepare('UPDATE comments SET likes = likes - 1 WHERE number = :number');
                $sql->execute(array(
                    ':number' => $commentsNumber,
                ));
            } else {
                $sql = $pdo->prepare('UPDATE comments SET dislike = dislike - 1 WHERE number = :number');
                $sql->execute(array(
                    ':number' => $commentsNumber,
                ));
            }
        }

        if ($type == "likes") {
            $sql = $pdo->prepare('insert into comments_likes_dislike (user_number, comments_number, type, date) values(:user_number, :comments_number, :type, :date)');
            $sql->execute(array(
                ':user_number' => $userInfo["number"],
                ':comments_number' => $commentsNumber,
                ':type' => 0,
                ':date' => date("Y-m-d H:i:s"),
            ));

            $sql = $pdo->prepare('UPDATE comments SET likes = likes + 1 WHERE number = :number');
            $sql->execute(array(
                ':number' => $commentsNumber,
            ));
        } else if ($type == "dislike") {
            $sql = $pdo->prepare('insert into comments_likes_dislike (user_number, comments_number, type, date) values(:user_number, :comments_number, :type, :date)');
            $sql->execute(array(
                ':user_number' => $userInfo["number"],
                ':comments_number' => $commentsNumber,
                ':type' => 1,
                ':date' => date("Y-m-d H:i:s"),
            ));

            $sql = $pdo->prepare('UPDATE comments SET dislike = dislike + 1 WHERE number = :number');
            $sql->execute(array(
                ':number' => $commentsNumber,
            ));
        }
    }

?>