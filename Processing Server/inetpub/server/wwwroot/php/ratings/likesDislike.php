<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $ratingsNumber = $_POST["ratingsNumber"];
        $type = $_POST["type"];

        $stmt = $pdo->prepare("SELECT type FROM ratings_likes_dislike where user_number = :user_number AND ratings_number = :ratings_number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':ratings_number' => $ratingsNumber,
        ));
        $likesDislike = $stmt->fetch();

        if (isset($likesDislike["type"])) {
            $stmt = $pdo->prepare("DELETE FROM ratings_likes_dislike WHERE user_number = :user_number AND ratings_number = :ratings_number");
            $stmt->execute(array(
                ':user_number' => $userInfo["number"],
                ':ratings_number' => $ratingsNumber,
            ));

            if ($likesDislike["type"] == 0) {
                $sql = $pdo->prepare('UPDATE ratings SET likes = likes - 1 WHERE number = :number');
                $sql->execute(array(
                    ':number' => $ratingsNumber,
                ));
            } else {
                $sql = $pdo->prepare('UPDATE ratings SET dislike = dislike - 1 WHERE number = :number');
                $sql->execute(array(
                    ':number' => $ratingsNumber,
                ));
            }
        }

        if ($type == "likes") {
            $sql = $pdo->prepare('insert into ratings_likes_dislike (user_number, ratings_number, type, date) values(:user_number, :ratings_number, :type, :date)');
            $sql->execute(array(
                ':user_number' => $userInfo["number"],
                ':ratings_number' => $ratingsNumber,
                ':type' => 0,
                ':date' => date("Y-m-d H:i:s")
            ));

            $sql = $pdo->prepare('UPDATE ratings SET likes = likes + 1 WHERE number = :number');
            $sql->execute(array(
                ':number' => $ratingsNumber,
            ));
        } else if ($type == "dislike") {
            $sql = $pdo->prepare('insert into ratings_likes_dislike (user_number, ratings_number, type, date) values(:user_number, :ratings_number, :type, :date)');
            $sql->execute(array(
                ':user_number' => $userInfo["number"],
                ':ratings_number' => $ratingsNumber,
                ':type' => 1,
                ':date' => date("Y-m-d H:i:s"),
            ));

            $sql = $pdo->prepare('UPDATE ratings SET dislike = dislike + 1 WHERE number = :number');
            $sql->execute(array(
                ':number' => $ratingsNumber,
            ));
        }
    }

?>