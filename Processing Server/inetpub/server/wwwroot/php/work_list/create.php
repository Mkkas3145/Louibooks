<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $title = $_POST['title'];
        $public_status = $_POST['public_status'];

        $date = date("Y-m-d H:i:s");

        $sql = $pdo->prepare('insert into work_list (user_number, title, public_status, creation_date, updated_date) values(:user_number, :title, :public_status, :creation_date, :updated_date)');
        $sql->execute(array(
            ':user_number' => $userInfo["number"],
            ':title' => $title,
            ':public_status' => $public_status,
            ':creation_date' => $date,
            ':updated_date' => $date
        ));
        $lastInsertId = $pdo->lastInsertId();

        //작품 목록 저장
        $sql = $pdo->prepare('insert into work_list_save (user_number, work_list_number, updated_date, save_date) values(:user_number, :work_list_number, :updated_date, :save_date)');
        $sql->execute(array(
            ':user_number' => $userInfo["number"],
            ':work_list_number' => $lastInsertId,
            ':updated_date' => $date,
            ':save_date' => $date
        ));
        
        //
        echo json_encode(getWorkListInfo($lastInsertId, 0, 0, true));
    }

?>