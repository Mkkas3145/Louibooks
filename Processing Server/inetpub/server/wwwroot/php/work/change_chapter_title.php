<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {

        //본인이 맞는지
        $stmt = $pdo->prepare("SELECT number FROM works where user_number = :user_number AND number = :number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $_POST["workNumber"],
        ));
        $work = $stmt->fetch();
        if (count($work) == 0) {
            echo 'not you';
            exit;
        }

        //챕터 제목 변경
        $sql = $pdo->prepare('UPDATE work_chapter SET title = :title WHERE work_number = :work_number AND chapter = :chapter');
        $sql->execute(array(
            ':work_number' => $_POST["workNumber"],
            ':chapter' => $_POST["chapter"],
            ':title' => cut_str($_POST["chapter_title"], 100)
        ));
    }

?>