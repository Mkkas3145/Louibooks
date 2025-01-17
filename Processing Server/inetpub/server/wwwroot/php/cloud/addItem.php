<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $type = $_POST["type"];
        $name = $_POST["name"];
        $folder_number = null;
        if (isset($_POST["folder_number"])) {
            $folder_number = $_POST["folder_number"];
        }

        if ($folder_number != null) {
            $sql = $pdo->prepare('UPDATE cloud SET size = size + 1 WHERE user_number = :user_number AND number = :folder_number');
            $sql->execute(array(
                ':user_number' => $userInfo["number"],
                ':folder_number' => $folder_number,
            ));
        }

        //기본 데이터
        $data = '';
        if ($type == 1) {
            $data = array(
                'title' => '',
                'lines' => array(),
            );
            $data = json_encode($data);
        } else if ($type == 2) {
            $data = array(
                'lines' => array(),
            );
            $data = json_encode($data);
        }
    
        $sql = $pdo->prepare('insert into cloud (user_number, type, folder_number, name, data, modified_date, size) values(:user_number, :type, :folder_number, :name, :data, :modified_date, :size)');
        $sql->execute(array(
            ':user_number' => $userInfo["number"],
            ':type' => $type,
            ':folder_number' => $folder_number,
            ':name' => $name,
            ':data' => $data,
            ':modified_date' => date("Y-m-d H:i:s"),
            ':size' => 0,
        ));
        $lastInsertId = $pdo->lastInsertId();

        echo $lastInsertId;
    }

?>