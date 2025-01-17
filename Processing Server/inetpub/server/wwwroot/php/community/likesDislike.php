<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $communityNumber = $_POST["communityNumber"];
        $type = $_POST["type"];

        $stmt = $pdo->prepare("SELECT type FROM community_likes_dislike where user_number = :user_number AND community_number = :community_number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':community_number' => $communityNumber,
        ));
        $likesDislike = $stmt->fetch();

        if (isset($likesDislike["type"])) {
            $stmt = $pdo->prepare("DELETE FROM community_likes_dislike WHERE user_number = :user_number AND community_number = :community_number");
            $stmt->execute(array(
                ':user_number' => $userInfo["number"],
                ':community_number' => $communityNumber,
            ));

            if ($likesDislike["type"] == 0) {
                $sql = $pdo->prepare('UPDATE community SET likes = likes - 1 WHERE number = :number');
                $sql->execute(array(
                    ':number' => $communityNumber,
                ));
            } else {
                $sql = $pdo->prepare('UPDATE community SET dislike = dislike - 1 WHERE number = :number');
                $sql->execute(array(
                    ':number' => $communityNumber,
                ));
            }
        }

        if ($type == "likes") {
            $sql = $pdo->prepare('insert into community_likes_dislike (user_number, community_number, type, date) values(:user_number, :community_number, :type, :date)');
            $sql->execute(array(
                ':user_number' => $userInfo["number"],
                ':community_number' => $communityNumber,
                ':type' => 0,
                ':date' => date("Y-m-d H:i:s"),
            ));

            $sql = $pdo->prepare('UPDATE community SET likes = likes + 1 WHERE number = :number');
            $sql->execute(array(
                ':number' => $communityNumber,
            ));
        } else if ($type == "dislike") {
            $sql = $pdo->prepare('insert into community_likes_dislike (user_number, community_number, type, date) values(:user_number, :community_number, :type, :date)');
            $sql->execute(array(
                ':user_number' => $userInfo["number"],
                ':community_number' => $communityNumber,
                ':type' => 1,
                ':date' => date("Y-m-d H:i:s"),
            ));

            $sql = $pdo->prepare('UPDATE community SET dislike = dislike + 1 WHERE number = :number');
            $sql->execute(array(
                ':number' => $communityNumber,
            ));
        }
    }

?>