<?php

    include_once('../../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == false) {
        echo 'not login'; exit;
    }

    $stmt = $pdo->prepare("UPDATE works SET public_status = :public_status WHERE user_number = :user_number AND number = :number");
    $stmt->execute(array(
        ':public_status' => $_POST["public_status"],
        ':user_number' => $userInfo["number"],
        ':number' => $_POST["work_number"],
    ));

    //공개 상태가 일부 공개 또는 비공개일 경우
    if ($_POST["public_status"] != 0) {
        $stmt = $pdo->prepare("DELETE FROM works_cache WHERE user_number = :user_number AND work_number = :work_number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':work_number' => $_POST["work_number"]
        ));
    }

?>