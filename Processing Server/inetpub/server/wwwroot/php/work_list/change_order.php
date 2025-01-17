<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $workListNumber = $_POST['workListNumber'];
        $workNumber = $_POST['workNumber'];
        $order = $_POST['order'];

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

        $stmt = $pdo->prepare("SELECT MAX(sort_order) FROM work_list_works WHERE work_list_number = :work_list_number");
        $stmt->execute(array(
            ':work_list_number' => $workListNumber
        ));
        $maxSortOrder = $stmt->fetch()["MAX(sort_order)"];

        //최대 정렬 순서보다 높으면 정정
        if ($maxSortOrder < $order) {
            $order = $maxSortOrder;
        }
        //0보다 낮으면 정정
        if ($order < 0) {
            $order = 0;
        }

        $stmt = $pdo->prepare("SELECT work_number, sort_order FROM work_list_works WHERE work_list_number = :work_list_number AND work_number = :work_number");
        $stmt->execute(array(
            ':work_list_number' => $workListNumber,
            ':work_number' => $workNumber
        ));
        $workListWorks = $stmt->fetch();
        if (isset($workListWorks["work_number"])) {
            $previousOrder = $workListWorks["sort_order"];

            if ($previousOrder < $order) {
                $sql = $pdo->prepare('UPDATE work_list_works SET sort_order = sort_order - 1 WHERE work_list_number = :work_list_number AND sort_order >= :previous_order AND sort_order <= :sort_order');
                $sql->execute(array(
                    ':work_list_number' => $workListNumber,
                    ':previous_order' => $previousOrder,
                    ':sort_order' => $order
                ));
            }
            if ($previousOrder > $order) {
                $sql = $pdo->prepare('UPDATE work_list_works SET sort_order = sort_order + 1 WHERE work_list_number = :work_list_number AND sort_order <= :previous_order AND sort_order >= :sort_order');
                $sql->execute(array(
                    ':work_list_number' => $workListNumber,
                    ':previous_order' => $previousOrder,
                    ':sort_order' => $order
                ));
            }

            //바꿀 작품 순서 바꾸기
            $sql = $pdo->prepare('UPDATE work_list_works SET sort_order = :sort_order WHERE work_list_number = :work_list_number AND work_number = :work_number');
            $sql->execute(array(
                ':work_list_number' => $workListNumber,
                ':work_number' => $workNumber,
                ':sort_order' => $order
            ));
        }
    }

?>