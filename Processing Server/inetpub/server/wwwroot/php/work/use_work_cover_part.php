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

        //작품 표지 정보
        $stmt = $pdo->prepare("SELECT cover_image, default_cover_image FROM works where user_number = :user_number AND number = :number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $work["work_number"],
        ));
        $work = $stmt->fetch();

        $thumbnail_image = '';
        if ($work["cover_image"] == null) {
            $thumbnail_image = $work["default_cover_image"];
        } else {
            $thumbnail_image = $work["cover_image"];
        }

        $sql = $pdo->prepare('UPDATE work_part SET thumbnail_image = :thumbnail_image WHERE user_number = :user_number AND number = :number');
        $sql->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $_POST["partNumber"],
            ':thumbnail_image' => $thumbnail_image,
        ));

        echo $thumbnail_image;
    }

?>