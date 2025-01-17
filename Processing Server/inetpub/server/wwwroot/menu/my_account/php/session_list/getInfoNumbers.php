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

    $sort = 0;
    (isset($_POST["sort"])) ? $sort = $_POST["sort"] : null;
    $sortSql = "";
    if ($sort == 0) {
        $sortSql = "number DESC";
    } else if ($sort == 1) {
        $sortSql = "number ASC";
    } else if ($sort == 2) {
        $sortSql = "last_request_date DESC";
    } else if ($sort == 3) {
        $sortSql = "last_request_date ASC";
    }

    //프로그램
    $program = 0;
    (isset($_POST["program"])) ? $program = $_POST["program"] : null;
    $programSql = "";
    if ($program == 0) {
        $programSql = "1 = 1";
    } else if ($program == 1) {
        $programSql = "program != 'application'";
    } else if ($program == 2) {
        $programSql = "program = 'application'";
    }

    //운영체제
    $operatingSystem = "all";
    (isset($_POST["operatingSystem"])) ? $operatingSystem = $_POST["operatingSystem"] : null;
    $operatingSystemSql = "";
    if ($operatingSystem == "all") {
        $operatingSystemSql = "1 = 1";
    } else if ($operatingSystem == "windows") {
        $operatingSystemSql = "operating_system = 'windows'";
    } else if ($operatingSystem == "android") {
        $operatingSystemSql = "operating_system = 'android'";
    } else if ($operatingSystem == "ios") {
        $operatingSystemSql = "operating_system = 'ios'";
    } else if ($operatingSystem == "macos") {
        $operatingSystemSql = "operating_system = 'macos'";
    } else if ($operatingSystem == "linux") {
        $operatingSystemSql = "operating_system = 'linux'";
    } else if ($operatingSystem == "unix") {
        $operatingSystemSql = "operating_system = 'unix'";
    }

    //활성화된 세션 구하기
    $stmt = $pdo->prepare("SELECT number, random_key, ip, operating_system, device_type, program, country, region, city, last_request_date, first_request_date, security_issue FROM login_key WHERE user_number = :user_number AND " . $programSql . " AND " . $operatingSystemSql . " ORDER BY " . $sortSql);
    $stmt->execute(array(
        ':user_number' => $userInfo["number"]
    ));
    $sessionList = $stmt->fetchAll();
    $sessionList_length = count($sessionList);

    $numbers = array();
    for ($i = 0; $i < $sessionList_length; $i++) {
        $numbers[] = $sessionList[$i]["number"];
    }

    $info = array();
    $length = ($sessionList_length > 15) ? 15 : $sessionList_length;
    for ($i = 0; $i < $length; $i++) {
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

    $data = array(
        'numbers' => implode(",", $numbers),
        'info' => $info,
    );
    echo json_encode($data);
    
?>

