<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {

        //본인이 맞는지
        $stmt = $pdo->prepare("SELECT work_number FROM work_part where user_number = :user_number AND number = :number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $_POST["partNumber"],
        ));
        $work = $stmt->fetch();
        if (count($work) == 0) {
            echo 'not you';
            exit;
        }

        $thumbnail_image = $_POST["url"];

        $sql = $pdo->prepare('UPDATE work_part SET thumbnail_image = :thumbnail_image WHERE user_number = :user_number AND number = :number');
        $sql->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $_POST["partNumber"],
            ':thumbnail_image' => $thumbnail_image,
        ));

        echo $thumbnail_image;
    }

?>