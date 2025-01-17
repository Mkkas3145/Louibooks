<?php

    @include_once('../../../../default_function.php');
    $userInfo = getMyLoginInfo();

    //권한 여부
    $isAdmin = $userInfo["admin"];
    if ($isAdmin != true) {
        echo "no permission";
        exit;
    }

    $numbers = $_POST["numbers"];

    $stmt = $pdo->prepare("SELECT user_number, request FROM partner_approval WHERE user_number IN (" . $numbers . ")");
    $stmt->execute();
    $result = $stmt->fetchAll();
    $result_length = count($result);

    $userRequest = array();
    for ($i = 0; $i < $result_length; $i++) {
        $userRequest[$result[$i]["user_number"]] = $result[$i]["request"];
    }

    $userInfo = getUserInfo($numbers);
    $userInfo_length = count($userInfo);

    $userData = array();
    for ($i = 0; $i < $userInfo_length; $i++) {
        $userData[] = array(
            "number" => $userInfo[$i]["number"],
            "nickname" => $userInfo[$i]["nickname"],
            "profile" => $userInfo[$i]["profile"],
            "userListSaveCount" => $userInfo[$i]["user_list_save_count"],
            "partner" => $userInfo[$i]["partner"],
            "request" => $userRequest[$userInfo[$i]["number"]]
        ); 
    }

    echo json_encode($userData);

?>