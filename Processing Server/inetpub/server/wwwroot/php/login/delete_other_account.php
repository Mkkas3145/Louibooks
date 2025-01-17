<?php

    include_once('../../default_function.php');

    $userNumber = $_POST["userNumber"];

    //다른 계정 로그인
    if (isset($_COOKIE["OTHERACCOUNT"])) {
        $array = array();
        $otherAccount = explode(',', $_COOKIE["OTHERACCOUNT"]);
        for ($j = 0; $j < count($otherAccount); $j++) {
            if ($userNumber != $otherAccount[$j]) {
                $array[] = $otherAccount[$j];
            }
        }
        setCookieValue('OTHERACCOUNT', implode(',', $array));
    }

    //다른 계정 로그인 - 로그인 키
    if (isset($_COOKIE["OTHERACCOUNTLOGINKEY"])) {
        $array = array();
        $otherAccount = explode(',', $_COOKIE["OTHERACCOUNTLOGINKEY"]);
        for ($j = 0; $j < count($otherAccount); $j++) {
            $otherAccount2 = explode(':', $otherAccount[$j]);
            if ($userNumber != $otherAccount2[0]) {
                $array[] = $otherAccount[$j];
            }
        }
        setCookieValue('OTHERACCOUNTLOGINKEY', implode(',', $array));
    }
    
?>