<?php

    include_once('../../../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == false) {
        echo 'not login'; exit;
    }

    //작품 정보
    $stmt = $pdo->prepare("SELECT type FROM works where number = :number");
    $stmt->execute(array(
        ':number' => $_POST["work_number"]
    ));
    $works = $stmt->fetch();
    
    $cover_image = $_POST["cover_image"];
    if ($cover_image == "null") {
        $cover_image = null;
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

    $stmt = $pdo->prepare("UPDATE works SET title = :title, description = :description, user_age = :user_age, genre = :genre, tag = :tag, cover_image = :cover_image, public_status = :public_status WHERE user_number = :user_number AND number = :number");
    $stmt->execute(array(
        ':title' => cut_str($_POST["title"], 100),
        ':description' => cut_str($_POST["description"], 500),
        ':user_age' => $_POST["user_age"],
        ':genre' => $genre,
        ':tag' => $_POST["tag"],
        ':user_number' => $userInfo["number"],
        ':number' => $_POST["work_number"],
        ':cover_image' => $cover_image,
        ':public_status' => $_POST["public_status"],
    ));

    //공개 상태가 일부 공개 또는 비공개일 경우
    if ($_POST["public_status"] != 0) {
        $stmt = $pdo->prepare("DELETE FROM works_cache WHERE user_number = :user_number AND work_number = :work_number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':work_number' => $_POST["work_number"]
        ));
    }

?>