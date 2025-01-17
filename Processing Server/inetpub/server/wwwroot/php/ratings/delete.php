<?php

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $ratingsNumber = $_POST["ratingsNumber"];

        //본인이 맞는지
        $stmt = $pdo->prepare("SELECT number FROM ratings where user_number = :user_number AND number = :number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $ratingsNumber,
        ));
        $ratings = $stmt->fetch();
        if (isset($ratings["number"]) == false) {
            echo 'not you';
            exit;
        }

        deleteRatings($ratingsNumber);
    }

?>