<?php

    include_once('../../default_function.php');

    $loginkey = $_POST["loginkey"];
    setCookieValue('LOGINKEY', $loginkey);

    $stmt = $pdo->prepare("SELECT user_number FROM login_key WHERE random_key = :random_key");
    $stmt->execute(array(
        ':random_key' => $loginkey
    ));
    $userNumber = $stmt->fetch()["user_number"];

    //다른 계정 로그인
    if (isset($_COOKIE["OTHERACCOUNT"])) {
        $array = array();
        $otherAccount = explode(',', $_COOKIE["OTHERACCOUNT"]);
        for ($j = 0; $j < count($otherAccount); $j++) {
            if ($userNumber != $otherAccount[$j]) {
                $array[] = $otherAccount[$j];
            }
        }
        $array[] = $userNumber;
        setCookieValue('OTHERACCOUNT', implode(',', $array));
    }
    
?>