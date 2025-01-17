<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $workListNumber = $_POST['workListNumber'];
        $workNumber = $_POST['workNumber'];

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

        //정렬 순서
        $sortOrder = 0;
        $stmt = $pdo->prepare("SELECT MAX(sort_order) FROM work_list_works WHERE work_list_number = :work_list_number");
        $stmt->execute(array(
            ':work_list_number' => $workListNumber
        ));
        $maxSortOrder = $stmt->fetch();
        if (isset($maxSortOrder["MAX(sort_order)"])) {
            $sortOrder = $maxSortOrder["MAX(sort_order)"] + 1;
        }

        //
        $stmt = $pdo->prepare("SELECT number FROM work_list_works WHERE work_list_number = :work_list_number AND work_number = :work_number");
        $stmt->execute(array(
            ':work_list_number' => $workListNumber,
            ':work_number' => $workNumber,
        ));
        $workListWorks = $stmt->fetchAll();
        $workListWorksLength = count($workListWorks);
        if ($workListWorksLength == 0) {
            $newDate = date("Y-m-d H:i:s");

            //작품 타입
            $stmt = $pdo->prepare("SELECT type, contents_type FROM works WHERE number = :number");
            $stmt->execute(array(
                ':number' => $workNumber
            ));
            $result = $stmt->fetch();
            $workType = $result["type"];
            $contentsType = $result["contents_type"];

            $sql = $pdo->prepare('insert into work_list_works (work_list_number, work_number, work_type, contents_type, sort_order, insert_date) values(:work_list_number, :work_number, :work_type, :contents_type, :sort_order, :insert_date)');
            $sql->execute(array(
                ':work_list_number' => $workListNumber,
                ':work_number' => $workNumber,
                ':work_type' => $workType,
                ':contents_type' => $contentsType,
                ':sort_order' => $sortOrder,
                ':insert_date' => $newDate
            ));
            $sql = $pdo->prepare('UPDATE work_list SET count = count + 1, updated_date = :updated_date WHERE number = :number');
            $sql->execute(array(
                ':number' => $workListNumber,
                ':updated_date' => $newDate,
            ));
            $sql = $pdo->prepare('UPDATE work_list_save SET updated_date = :updated_date WHERE work_list_number = :work_list_number');
            $sql->execute(array(
                ':work_list_number' => $workListNumber,
                ':updated_date' => $newDate,
            ));
        }
    }

?>