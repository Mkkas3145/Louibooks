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

        $stmt = $pdo->prepare("SELECT work_number, sort_order FROM work_list_works WHERE work_list_number = :work_list_number AND work_number = :work_number");
        $stmt->execute(array(
            ':work_list_number' => $workListNumber,
            ':work_number' => $workNumber,
        ));
        $workListWorks = $stmt->fetch();
        if (isset($workListWorks["work_number"])) {
            $newDate = date("Y-m-d H:i:s");

            $stmt = $pdo->prepare("DELETE FROM work_list_works WHERE work_list_number = :work_list_number AND work_number = :work_number");
            $stmt->execute(array(
                ':work_list_number' => $workListNumber,
                ':work_number' => $workNumber
            ));
            $sql = $pdo->prepare('UPDATE work_list SET count = count - 1, updated_date = :updated_date WHERE number = :number');
            $sql->execute(array(
                ':number' => $workListNumber,
                ':updated_date' => $newDate
            ));
            $sql = $pdo->prepare('UPDATE work_list_save SET updated_date = :updated_date WHERE work_list_number = :work_list_number');
            $sql->execute(array(
                ':work_list_number' => $workListNumber,
                ':updated_date' => $newDate
            ));

            //정렬 순서
            $sql = $pdo->prepare('UPDATE work_list_works SET sort_order = sort_order - 1 WHERE work_list_number = :work_list_number AND sort_order > :sort_order');
            $sql->execute(array(
                ':work_list_number' => $workListNumber,
                ':sort_order' => $workListWorks["sort_order"]
            ));
        }
    }

?>