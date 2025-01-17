<?php

    //시간대 설정: 서울
    date_default_timezone_set('Asia/Seoul');

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    $itemNumber = $_POST["itemNumber"];
    $folderNumber = null;
    if (isset($_POST["folderNumber"])) {
        $folderNumber = $_POST["folderNumber"];
    }

    if ($userInfo["isLogin"] == true) {
        //기존 폴더
        $stmt = $pdo->prepare("SELECT folder_number FROM cloud where user_number = :user_number AND number = :number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $itemNumber,
        ));
        $previousFolderNumber = $stmt->fetchAll();
        if (count($previousFolderNumber) == 0) {
            exit;
        } else {
            $previousFolderNumber = $previousFolderNumber[0]["folder_number"];
        }
        //사이즈 변경 - 기존 폴더
        $sql = $pdo->prepare('UPDATE cloud SET size = size - 1 WHERE user_number = :user_number AND number = :number');
        $sql->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $previousFolderNumber,
        ));

        //옭겨질 폴더
        if ($folderNumber != null) {
            $stmt = $pdo->prepare("SELECT number FROM cloud where user_number = :user_number AND number = :number");
            $stmt->execute(array(
                ':user_number' => $userInfo["number"],
                ':number' => $folderNumber,
            ));
            $moveFolderNumber = $stmt->fetchAll();
            if (count($moveFolderNumber) == 0) {
                exit;
            }
            //사이즈 변경 - 옭겨질 폴더
            $sql = $pdo->prepare('UPDATE cloud SET size = size + 1 WHERE user_number = :user_number AND number = :folder_number');
            $sql->execute(array(
                ':user_number' => $userInfo["number"],
                ':folder_number' => $folderNumber,
            ));
        }

        //위치 이동
        $sql = $pdo->prepare('UPDATE cloud SET folder_number = :folder_number WHERE user_number = :user_number AND number = :number');
        $sql->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $itemNumber,
            ':folder_number' => $folderNumber,
        ));
    }

?>