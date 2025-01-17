<?php

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        //본인이 맞는지
        $stmt = $pdo->prepare("SELECT number FROM works where user_number = :user_number AND number = :number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $_POST["work_number"]
        ));
        $works = $stmt->fetch();
        if (isset($works["number"]) == false) {
            echo 'not you';
            exit;
        }

        //작품 삭제
        deleteWork($_POST["work_number"]);
    }

?>