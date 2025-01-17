<?php
    
    include_once('../../default_function.php');

    $email = $_POST["email"];
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
        echo 'not email';
        exit;
    }

    $stmt = $pdo->prepare("SELECT number FROM user WHERE email = :email");
    $stmt->execute(array(
        ':email' => $email,
    ));
    $user = $stmt->fetch();
    if (isset($user["number"])) {
        $userNumber = $user["number"];
        $userInfo = getUserInfo($userNumber)[0];

        echo json_encode(array(
            "number" => $userInfo["number"],
            "email" => $userInfo["email"],
            "nickname" => $userInfo["nickname"],
            "profile" => $userInfo["profile"]
        ));
    } else {
        echo "not defind";
        exit;
    }

?>