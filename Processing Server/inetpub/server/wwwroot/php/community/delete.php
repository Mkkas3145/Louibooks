<?php

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $communityNumber = $_POST["communityNumber"];

        //본인이 맞는지
        $stmt = $pdo->prepare("SELECT number, uid FROM community where user_number = :user_number AND number = :number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $communityNumber,
        ));
        $community = $stmt->fetch();
        if (isset($community["number"]) == false) {
            echo 'not you';
            exit;
        }

        deleteCommunity($communityNumber);
    }

?>