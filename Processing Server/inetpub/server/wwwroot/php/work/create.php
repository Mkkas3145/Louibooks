<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    //크리에이터 자격 없음
    if ($userInfo["creator_permission"] == false) {
        echo "no permission";
        exit;
    }

    //크리에이터 가이드 위반 여부
    $stmt = $pdo->prepare("SELECT user_number FROM creator_violation WHERE user_number = :user_number AND date > :date");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"],
        ':date' => date("Y-m-d H:i:s", strtotime("-7 Day"))
    ));
    $creatorViolation = $stmt->fetch();
    if (isset($creatorViolation["user_number"])) {
        echo "creator guide violation";
        exit;
    }

    if ($userInfo["isLogin"] == true) {
        $default_cover_image = "https://img.louibooks.com/provided_work_cover/illustration/" . rand(1, 11) . ".webp";
        $art_image = "https://img.louibooks.com/provided_work_art/illustration/" . rand(1, 7) . ".webp";

        //데이터 유효성 검사
        if ($_POST["type"] != 0 && $_POST["type"] != 1 && $_POST["type"] != 2 && $_POST["type"] != 3) {
            echo "incorrect data";
            return;
        }
        if ($userInfo["animator"] == false && $_POST["type"] == 3) {
            echo "incorrect data";
            return;
        }
        if ($_POST["user_age"] != 0 && $_POST["user_age"] != 1 && $_POST["user_age"] != 2) {
            echo "incorrect data";
            return;
        }
        if ($_POST["public_status"] != 0 && $_POST["public_status"] != 1 && $_POST["public_status"] != 2) {
            echo "incorrect data";
            return;
        }
        if ($_POST["original_language"] != "ko" && $_POST["original_language"] != "en" && $_POST["original_language"] != "ja") {
            echo "incorrect data";
            return;
        }

        $contentsType = $_POST["type"];
        $workType = "novel";
        if ($contentsType != 0) {
            $workType = "image_format";
        }
        if ($contentsType == 3) {
            $workType = "video";
        }

        //장르 정렬
        $genre = $_POST["genre"];
        if ($genre != "") {
            $split = explode(",", $genre);
            $split = array_unique($split);
            sort($split);
            $genre = implode(",", $split);
        }

        //필수 정보
        if (isset($_POST["title"]) == false || $_POST["title"] == "") {
            echo "not title";
            exit;
        }
        if (isset($_POST["description"]) == false || $_POST["description"] == "") {
            echo "not description";
            exit;
        }

        //특수문자 제거
        $_POST["tag"] = $preg = preg_replace('/[0-9\@\.\;\" "]+/', '', $_POST["tag"]);

        $sql = $pdo->prepare('insert into works (user_number, type, contents_type, title, description, public_status, user_age, original_language, genre, tag, default_cover_image, art_image, creation_date) values(:user_number, :type, :contents_type, :title, :description, :public_status, :user_age, :original_language, :genre, :tag, :default_cover_image, :art_image, :creation_date)');
        $sql->execute(array(
            ':user_number' => $userInfo["number"],
            ':type' => $workType,
            ':contents_type' => $contentsType,
            ':title' => cut_str($_POST["title"], 100),
            ':description' => cut_str($_POST["description"], 500),
            ':public_status' => $_POST["public_status"],
            ':user_age' => $_POST["user_age"],
            ':original_language' => $_POST["original_language"],
            ':genre' => $genre,
            ':tag' => $_POST["tag"],
            ':default_cover_image' => $default_cover_image,
            ':art_image' => $art_image,
            ':creation_date' => date("Y-m-d H:i:s"),
        ));
        $lastInsertId = $pdo->lastInsertId();
    }

?>