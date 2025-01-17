<?php

    @include_once('../../../../default_function.php');
    $userInfo = getMyLoginInfo();

    //권한 여부
    $isAdmin = $userInfo["admin"];
    if ($isAdmin != true) {
        echo "no permission";
        exit;
    }

    //
    $sort = 1; //오래된 문의 순
    if (isset($_POST["sort"])) {
        $sort = $_POST["sort"];
    }
    $typeSql = "";
    if (isset($_POST["type"])) {
        if ($_POST["type"] != 0) {
            $typeSql = ' type = ' . ($_POST["type"] - 1);
        }
    }
    $languageSql = "";
    if (isset($_POST["language"])) {
        if ($_POST["language"] != "all") {
            $languageSql = ' language = \'' . $_POST["language"] . '\'';
        }
    }
    $whereSql = "";
    if ($typeSql != "" || $languageSql != "") {
        $whereSql = " WHERE" . $typeSql . $languageSql;
    }


    $stmt = $pdo->prepare("SELECT number, type, user_number, content, screenshot, operating_system, program, location, date FROM questions" . $whereSql);
    $stmt->execute();
    $result = $stmt->fetchAll();
    $result_length = count($result);
    //정렬
    if ($sort == 0) {
        $result = array_reverse($result);
    }

    //유저 정보
    $userNumbers = array();
    for ($i = 0; $i < $result_length; $i++) {
        $userNumbers[] = $result[$i]["user_number"];
    }
    $userArray = array();
    if (count($userNumbers) != 0) {
        $userInfo = getUserInfo(implode(',', $userNumbers));
        $userInfo_count = count($userInfo);
        for ($i = 0; $i < $userInfo_count; $i++) {
            $userArray[$userInfo[$i]["number"]] = $userInfo[$i];
        }
    }
    
    $info = array();
    $numbers = array();
    for ($i = 0; $i < $result_length; $i++) {
        $numbers[] = $result[$i]["number"];

        //15개 문의 정보만
        if ($i < 15) {
            $result_i = $result[$i];
            $userNumber = $result_i["user_number"];

            $screenshot = null;
            if (isset($result_i["screenshot"])) {
                $screenshot = json_decode($result_i["screenshot"], true);
            }
            
            $info[] = array(
                'number' => $result_i["number"],
                'type' => $result_i["type"],
                'userNumber' => $userNumber,
                'nickname' => $userArray[$userNumber]["nickname"],
                'profile' => $userArray[$userNumber]["profile"],
                'content' => $result_i["content"],
                'screenshot' => $screenshot,
                'operatingSystem' => $result_i["operating_system"],
                'program' => $result_i["program"],
                'location' => $result_i["location"],
                'date' => $result_i["date"]
            );
        }
    }

    echo json_encode(array(
        'numbers' => implode(",", $numbers),
        'info' => $info
    ));

?>