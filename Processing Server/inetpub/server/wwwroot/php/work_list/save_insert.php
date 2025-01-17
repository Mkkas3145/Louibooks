<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $workListNumber = $_POST['workListNumber'];

        //권한 체크
        $stmt = $pdo->prepare("SELECT updated_date, user_number FROM work_list WHERE number = :number");
        $stmt->execute(array(
            ':number' => $workListNumber
        ));
        $workListInfo = $stmt->fetch();
        if ($workListInfo["user_number"] == null || $workListInfo["user_number"] == $userInfo["number"]) {
            echo 'bad_request';
            exit;
        }

        $stmt = $pdo->prepare("SELECT number FROM work_list_save WHERE work_list_number = :work_list_number AND user_number = :user_number");
        $stmt->execute(array(
            ':work_list_number' => $workListNumber,
            ':user_number' => $userInfo["number"],
        ));
        $workListWorks = $stmt->fetchAll();
        $workListWorksLength = count($workListWorks);
        if ($workListWorksLength == 0) {
            //작품 목록 저장
            $sql = $pdo->prepare('insert into work_list_save (user_number, work_list_number, updated_date, save_date) values(:user_number, :work_list_number, :updated_date, :save_date)');
            $sql->execute(array(
                ':user_number' => $userInfo["number"],
                ':work_list_number' => $workListNumber,
                ':updated_date' => $workListInfo["updated_date"],
                ':save_date' => date("Y-m-d H:i:s"),
            ));
            $sql = $pdo->prepare('UPDATE work_list SET save_count = save_count + 1 WHERE number = :number');
            $sql->execute(array(
                ':number' => $workListNumber,
            ));
            //
            echo json_encode(getWorkListInfo($workListNumber, 0, 0));
        }
    }

?>