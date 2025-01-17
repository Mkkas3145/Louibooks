<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $workListNumber = $_POST['workListNumber'];

        $stmt = $pdo->prepare("SELECT number FROM work_list_save WHERE work_list_number = :work_list_number AND user_number = :user_number");
        $stmt->execute(array(
            ':work_list_number' => $workListNumber,
            ':user_number' => $userInfo["number"],
        ));
        $workListWorks = $stmt->fetchAll();
        $workListWorksLength = count($workListWorks);
        
        if ($workListWorksLength != 0) {
            $stmt = $pdo->prepare("DELETE FROM work_list_save WHERE work_list_number = :work_list_number AND user_number = :user_number");
            $stmt->execute(array(
                ':work_list_number' => $workListNumber,
                ':user_number' => $userInfo["number"],
            ));
            $sql = $pdo->prepare('UPDATE work_list SET save_count = save_count - 1 WHERE number = :number');
            $sql->execute(array(
                ':number' => $workListNumber,
            ));
        }
    }

?>