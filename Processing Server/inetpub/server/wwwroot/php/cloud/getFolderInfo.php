<?php

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    $folderNumber = null;
    if (isset($_POST["folderNumber"])) {
        $folderNumber = $_POST["folderNumber"];
    }

    if ($userInfo["isLogin"] == true) {
        //정보
        $cloudInfo = null;
        if ($folderNumber != null) {
            $stmt = $pdo->prepare("SELECT folder_number, modified_date, name, number, size, type FROM cloud where user_number = :user_number AND folder_number = :folder_number");
            $stmt->execute(array(
                ':user_number' => $userInfo["number"],
                ':folder_number' => $folderNumber,
            ));
            $cloudInfo = $stmt->fetchAll();
        } else {
            $stmt = $pdo->prepare("SELECT folder_number, modified_date, name, number, size, type FROM cloud where user_number = :user_number AND folder_number is NULL");
            $stmt->execute(array(
                ':user_number' => $userInfo["number"],
            ));
            $cloudInfo = $stmt->fetchAll();
        }

        echo json_encode($cloudInfo);
    } else {
        echo "not login";
    }

?>