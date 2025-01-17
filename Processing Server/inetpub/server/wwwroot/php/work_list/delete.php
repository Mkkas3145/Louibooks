<?php

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $workListNumber = $_POST["workListNumber"];

        //권한 체크
        $stmt = $pdo->prepare("SELECT user_number FROM work_list WHERE number = :number");
        $stmt->execute(array(
            ':number' => $workListNumber
        ));
        $originatorNumber = $stmt->fetch()["user_number"];
        if ($userInfo["isLogin"] == false || $originatorNumber == null || $originatorNumber != $userInfo["number"]) {
            echo 'no_permission';
            exit;
        }

        deleteWorkList($workListNumber);
    }

?>