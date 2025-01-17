<?php

    //시간대 설정: 서울
    date_default_timezone_set('Asia/Seoul');

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    $number = $_POST["number"];

    if ($userInfo["isLogin"] == true) {
        //특정 폴더에 있는지 및 번호 구하기
        $stmt = $pdo->prepare("SELECT folder_number FROM cloud where user_number = :user_number AND number = :number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $number,
        ));
        $folder_number = $stmt->fetch()[0];

        //상위 폴더 사이즈 낮추기
        $sql = $pdo->prepare('UPDATE cloud SET size = size - 1 WHERE user_number = :user_number AND number = :folder_number');
        $sql->execute(array(
            ':user_number' => $userInfo["number"],
            ':folder_number' => $folder_number,
        ));

        deleteFilesInsideFolder($number);

        $stmt = $pdo->prepare("DELETE FROM cloud WHERE user_number = :user_number AND number = :number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $number,
        ));
    }






    function deleteFilesInsideFolder($folder_number) {
        global $pdo, $userInfo;
        
        $stmt = $pdo->prepare("SELECT number FROM cloud where user_number = :user_number AND type = 0 AND folder_number = :folder_number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':folder_number' => $folder_number,
        ));
        $numbers = $stmt->fetchAll();
        $numbers_count = count($numbers);
        for ($i = 0; $i < $numbers_count; $i++) {
            deleteFilesInsideFolder($numbers[$i]["number"]);
        }

        $stmt = $pdo->prepare("DELETE FROM cloud WHERE user_number = :user_number AND folder_number = :folder_number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':folder_number' => $folder_number,
        ));
    }



?>