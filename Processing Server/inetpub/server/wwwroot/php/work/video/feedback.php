<?php

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    //크리에이터 권한 및 애니메이터 체크
    if ($userInfo["creator_permission"] == false || $userInfo["animator"] == false) {
        echo "no permission";
        exit;
    }

    $partNumber = $_POST["partNumber"];

    //회차 정보
    $stmt = $pdo->prepare("SELECT work_number, type, title, thumbnail_image, default_thumbnail_image FROM work_part WHERE number = :number");
    $stmt->execute(array(
        "number" => $partNumber
    ));
    $part = $stmt->fetch();
    if ($part["type"] != "video") {
        echo "not video";
        exit;
    }
    //작품 정보
    $stmt = $pdo->prepare("SELECT number, user_number, cover_image, default_cover_image FROM works WHERE number = :number");
    $stmt->execute(array(
        "number" => $part["work_number"]
    ));
    $work = $stmt->fetch();
    if ($work["user_number"] != $userInfo["number"]) {
        echo "No permission";
        exit;
    }




    //변경할 데이터
    $thumbnailImage = null;
    if (isset($_POST["thumbnailImage"])) {
        $thumbnailImage = $_POST["thumbnailImage"];
    } else if (isset($part["default_thumbnail_image"])) {
        $thumbnailImage = $part["default_thumbnail_image"];
    } else if (isset($work["cover_image"])) {
        $thumbnailImage = $work["cover_image"];
    } else if (isset($work["default_cover_image"])) {
        $thumbnailImage = $work["default_cover_image"];
    }
    $title = $part["title"];
    if (isset($_POST["title"]) && trim($_POST["title"]) != "") {
        $title = cut_str(trim($_POST["title"]), 100);
    }



    $sql = $pdo->prepare('UPDATE work_part SET thumbnail_image = :thumbnail_image, title = :title WHERE number = :number');
    $data = array(
        ':number' => $_POST["partNumber"],
        ':thumbnail_image' => $thumbnailImage,
        ':title' => $title
    );
    $sql->execute($data);

    //챕터 제목 변경
    if (isset($_POST["chapter"]) && isset($_POST["chapterTitle"]) && trim($_POST["chapterTitle"]) != "") {
        $sql = $pdo->prepare('UPDATE work_chapter SET title = :title WHERE work_number = :work_number AND chapter = :chapter');
        $sql->execute(array(
            ':work_number' => $work["number"],
            ':chapter' => $_POST["chapter"],
            ':title' => cut_str(trim($_POST["chapterTitle"]), 100)
        ));
    }




    //정보 가져오기
    $stmt = $pdo->prepare("SELECT title, thumbnail_image, data FROM work_part WHERE number = :number AND type = 'video'");
    $stmt->execute(array(
        "number" => $partNumber
    ));
    $workPart = $stmt->fetch();

    if (isset($workPart["data"])) {
        $thumbnailImage = null;
        if (isset($workPart["thumbnail_image"])) {
            $thumbnailImage = $workPart["thumbnail_image"];
        } else if (isset($work["cover_image"])) {
            $thumbnailImage = $work["cover_image"];
        } else if (isset($work["default_cover_image"])) {
            $thumbnailImage = $work["default_cover_image"];
        }

        echo json_encode(array(
            "title" => $workPart["title"],
            "thumbnailImage" => $thumbnailImage,
            "data" => json_decode($workPart["data"], true)
        ));
    }

?>