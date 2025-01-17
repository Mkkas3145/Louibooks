<?php

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    //데이터 유효성 검사
    if(!filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)){
        echo 'not email';
        exit;
    }

    $stmt = $pdo->prepare("SELECT number FROM user where email = :email");
    $stmt->execute(array(
        ':email' => $_POST["email"],
    ));
    $result = $stmt->fetchAll();
    $result_length = count($result);
    
    if ($result_length != 0) {
        echo json_encode(getUserInfo($result[0]["number"]));
    } else {
        echo 'not match mail';
    }

?>