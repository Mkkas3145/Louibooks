<?php

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    //세션 로그인
    @session_start();
    $_SESSION["userNumber"] = null;

    if (isset($_COOKIE["LOGINKEY"])) {
        $loginkey = $_COOKIE["LOGINKEY"];

        //다른 계정 로그인 - 로그인 키 삭제
        if (isset($_COOKIE["OTHERACCOUNTLOGINKEY"])) {
            $array = array();
            $otherAccount = explode(',', $_COOKIE["OTHERACCOUNTLOGINKEY"]);
            for ($j = 0; $j < count($otherAccount); $j++) {
                $otherAccount2 = explode(':', $otherAccount[$j]);
                if ($loginkey != $otherAccount2[1]) {
                    $array[] = $otherAccount[$j];
                }
            }
            setCookieValue('OTHERACCOUNTLOGINKEY', implode(',', $array));
        }

        //로그인 키 삭제
        $stmt = $pdo->prepare("DELETE FROM login_key WHERE user_number = :user_number AND random_key = :random_key");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':random_key' => $loginkey
        ));
    }

    setCookieValue('LOGINKEY', null);
    
?>