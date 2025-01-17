<?php

    //시간대 설정: 서울
    date_default_timezone_set('Asia/Seoul');

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    $number = $_POST["number"];
    $newName = $_POST["newName"];

    if ($userInfo["isLogin"] == true) {
        $sql = $pdo->prepare('UPDATE cloud SET name = :name WHERE user_number = :user_number AND number = :number');
        $sql->execute(array(
            ':name' => $newName,
            ':user_number' => $userInfo["number"],
            ':number' => $number,
        ));
    }

?>