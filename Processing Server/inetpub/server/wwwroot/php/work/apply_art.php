<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {

        $sql = $pdo->prepare('UPDATE works SET art_image = :art_image WHERE user_number = :user_number AND number = :number');
        $sql->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $_POST["workNumber"],
            ':art_image' => $_POST["url"],
        ));

        echo "change done";
    }

?>