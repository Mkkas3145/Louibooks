<?php

    @include_once('../../../../default_function.php');
    $userInfo = getMyLoginInfo();
    
    //사용자의 로그인 키 구하기
    $loginKey = null;
    if (isset($_POST["loginKey"])) {
        $loginKey = $_POST["loginKey"];
    } else if (isset($_COOKIE["LOGINKEY"])) {
        $loginKey = $_COOKIE["LOGINKEY"];
    }

    $numbers = $_POST["numbers"];

    //활성화된 세션 구하기
    $stmt = $pdo->prepare("SELECT number, random_key, ip, operating_system, device_type, program, country, region, city, last_request_date, first_request_date, security_issue FROM login_key WHERE user_number = :user_number AND number IN (" . $numbers . ")");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"]
    ));
    $sessionList = $stmt->fetchAll();
    $sessionList_length = count($sessionList);

    $info = array();
    for ($i = 0; $i < $sessionList_length; $i++) {
        $isCurrentSession = ($sessionList[$i]["random_key"] == $loginKey);
        $info[] = array(
            "number" => $sessionList[$i]["number"],
            "isCurrentSession" => $isCurrentSession,
            "ip" => $sessionList[$i]["ip"],
            "deviceType" => $sessionList[$i]["device_type"],
            "operatingSystem" => $sessionList[$i]["operating_system"],
            "program" => $sessionList[$i]["program"],
            "country" => $sessionList[$i]["country"],
            "region" => $sessionList[$i]["region"],
            "city" => $sessionList[$i]["city"],
            "lastRequestDate" => $sessionList[$i]["last_request_date"],
            "firstRequestDate" => $sessionList[$i]["first_request_date"],
            "isSecurityIssue" => $sessionList[$i]["security_issue"]
        );
    }

    echo json_encode($info);
    
?>

