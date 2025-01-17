<?php

    include_once('../../../../default_function.php');
    $userInfo = getMyLoginInfo();

    //권한 여부
    $isAdmin = $userInfo["admin"];
    if ($isAdmin != true) {
        echo "no permission";
        exit;
    }

    //
    $numbers = explode(",", $_POST["numbers"]);

    $stmt = $pdo->prepare("SELECT number, type, user_number, content, screenshot, operating_system, program, location, date FROM questions WHERE number IN (" . implode(",", $numbers) . ")");
    $stmt->execute();
    $result = $stmt->fetchAll();
    $result_length = count($result);

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
    for ($i = 0; $i < $result_length; $i++) {
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

    echo json_encode($info);

?>