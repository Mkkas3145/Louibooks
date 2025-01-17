<?php

    include_once('../../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == false) {
        echo 'not login'; exit;
    }

    //내 페이지 소개
    $description = null;
    if (isset($_POST["description"])) {
        $description = cut_str($_POST["description"], 500);
    }

    //내 페이지 아트
    $artInfo = null;
    if (isset($_POST["art"])) {
        $art = json_decode($_POST["art"], true);
        $type = $art["type"];
        $url = $art["url"];
        $width = $art["width"];
        $height = $art["height"];
        $artInfo = array(
            "type" => $type,
            "url" => $url,
            "width" => $width,
            "height" => $height
        );
        if (isset($art["thumbnail"])) {
            $artInfo["thumbnail"] = $art["thumbnail"];
        }
        $artInfo = json_encode($artInfo);
    }

    //적용
    $stmt = $pdo->prepare("UPDATE user SET description = :description, art = :art WHERE number = :number");
    $stmt->execute(array(
        ':number' => $userInfo["number"],
        ':description' => $description,
        ':art' => $artInfo
    ));

?>