<?php

    include_once('../../../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == false) {
        echo 'not login'; exit;
    }
    
    $thumbnailImage = $_POST["thumbnailImage"];
    if ($thumbnailImage == "null") {
        $thumbnailImage = null;
    }

    //본인이 맞는지
    $stmt = $pdo->prepare("SELECT number, work_number, public_status, category, send_notifications, views FROM work_part where user_number = :user_number AND number = :number");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"],
        ':number' => $_POST["partNumber"],
    ));
    $partInfo = $stmt->fetch();
    if (count($partInfo) == 0) {
        echo 'not you';
        exit;
    }

    //작품 정보
    $stmt = $pdo->prepare("SELECT number, public_status FROM works WHERE user_number = :user_number AND number = :number");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"],
        ':number' => $partInfo["work_number"]
    ));
    $workInfo = $stmt->fetch();

    $stmt = $pdo->prepare("UPDATE work_part SET thumbnail_image = :thumbnailImage, title = :title, public_status = :publicStatus WHERE number = :number");
    $stmt->execute(array(
        ':thumbnailImage' => $thumbnailImage,
        ':title' => $_POST["title"],
        ':publicStatus' => $_POST["publicStatus"],
        ':number' => $_POST["partNumber"]
    ));

    //회차 수 올리기
    if ($partInfo["public_status"] != 0 && $_POST["publicStatus"] == 0) {
        $sql = $pdo->prepare('UPDATE works SET part = part + 1 WHERE number = :number');
        $sql->execute(array(
            ':number' => $partInfo["work_number"]
        ));
    }
    //회차 수 낮추기
    if ($partInfo["public_status"] == 0 && $_POST["publicStatus"] != 0) {
        $sql = $pdo->prepare('UPDATE works SET part = part - 1 WHERE number = :number');
        $sql->execute(array(
            ':number' => $partInfo["work_number"]
        ));
    }

    //완결 수 올리기
    if ($partInfo["public_status"] != 0 && $partInfo["category"] == "ending" && $_POST["publicStatus"] == 0) {
        $sql = $pdo->prepare('UPDATE works SET ending = ending + 1 WHERE number = :number');
        $sql->execute(array(
            ':number' => $partInfo["work_number"]
        ));
    }
    //완결 수 낮추기
    if ($partInfo["public_status"] == 0 && $partInfo["category"] == "ending" && $_POST["publicStatus"] != 0) {
        $sql = $pdo->prepare('UPDATE works SET ending = ending - 1 WHERE number = :number');
        $sql->execute(array(
            ':number' => $partInfo["work_number"]
        ));
    }

    //작품 조회수 감소
    if ($partInfo["public_status"] == 0 && $_POST["publicStatus"] != 0) {
        $sql = $pdo->prepare('UPDATE works SET views = views - :views WHERE number = :number');
        $sql->execute(array(
            ':number' => $partInfo["work_number"],
            ':views' => $partInfo["views"]
        ));
    }
    //작품 조회수 증가
    if ($partInfo["public_status"] != 0 && $_POST["publicStatus"] == 0) {
        $sql = $pdo->prepare('UPDATE works SET views = views + :views WHERE number = :number');
        $sql->execute(array(
            ':number' => $partInfo["work_number"],
            ':views' => $partInfo["views"]
        ));
    }

    //알림 보내기
    if ($partInfo["send_notifications"] == false && $_POST["publicStatus"] == 0 && $workInfo["public_status"] != 2) {
        requestUserNotificationsPartPublic($partInfo["number"]);

        //이 이후로 더 이상 알림을 보내지 않음
        $sql = $pdo->prepare('UPDATE work_part SET send_notifications = true WHERE number = :number');
        $sql->execute(array(
            ':number' => $partInfo["number"]
        ));
    }

?>