<?php

    include_once('../default_function.php');
    $userInfo = getMyLoginInfo();

    $token = $_POST["token"];
    $language = $_POST["language"];

    if ($userInfo["isLogin"] == true) {
        //업데이트 안한지 한달 이상된 데이터 삭제
        $stmt = $pdo->prepare("DELETE FROM messaging_token WHERE upload_date < :upload_date");
        $stmt->execute(array(
            ':upload_date' => date("Y-m-d H:i:s", strtotime("-30 Day"))
        ));
    
        //새로운 토큰인지
        $stmt = $pdo->prepare("SELECT token FROM messaging_token WHERE token = :token");
        $stmt->execute(array(
            ":token" => $token
        ));
        $messagingToken = $stmt->fetch();
    
        //현재 시간 구하기
        $newDate = date("Y-m-d H:i:s");
    
        if (isset($messagingToken["token"])) {
            //업데이트
            $sql = $pdo->prepare("UPDATE messaging_token SET upload_date = :upload_date, language = :language, user_number = :user_number WHERE token = :token");
            $sql->execute(array(
                ':token' => $token,
                ':language' => $language,
                ':upload_date' => $newDate,
                ':user_number' => $userInfo["number"]
            ));
        } else {
            //추가
            $sql = $pdo->prepare('insert into messaging_token (token, upload_date, language, user_number) values(:token, :upload_date, :language, :user_number)');
            $sql->execute(array(
                ':token' => $token,
                ':language' => $language,
                ':upload_date' => $newDate,
                ':user_number' => $userInfo["number"]
            ));
        }
    } else {
        //토큰 삭제
        $stmt = $pdo->prepare("DELETE FROM messaging_token WHERE token = :token");
        $stmt->execute(array(
            ':token' => $token
        ));
    }

?>