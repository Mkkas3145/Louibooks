<?php

    @include_once('../../../../default_function.php');
    $userInfo = getMyLoginInfo();

    //권한 여부
    $isAdmin = $userInfo["admin"];
    if ($isAdmin != true) {
        echo "no permission";
        exit;
    }

    $sort = 0;
    if (isset($_POST["sort"])) {
        $sort = $_POST["sort"];
    }

    $where = "";
    if (isset($_POST["request"]) && $_POST["request"] != 0) {
        ($where == "") ? $where .= " WHERE" : null;
        ($where != " WHERE") ? $where .= " AND" : null;
        $where .= " request = " . (((int) $_POST["request"]) - 1);
    }
    if (isset($_POST["language"]) && $_POST["language"] != 0) {
        if (mb_strlen($_POST["language"], "UTF-8") == 2) {
            ($where == "") ? $where .= " WHERE" : null;
            ($where != " WHERE") ? $where .= " AND" : null;
            $where .= " language = '" . $_POST["language"] . "'";
        }
    }

    $stmt = $pdo->prepare("SELECT user_number, request FROM partner_approval" . $where);
    $stmt->execute();
    $result = $stmt->fetchAll();
    $result_length = count($result);
    //정렬
    if ($sort == 1) {
        $result = array_reverse($result);
    }

    $numbers = array();
    $userRequest = array();
    for ($i = 0; $i < $result_length; $i++) {
        $numbers[] = $result[$i]["user_number"];
        $userRequest[$result[$i]["user_number"]] = $result[$i]["request"];
    }

    $userInfoMaxCount = (count($numbers) >= 20) ? 20 : count($numbers);
    $userInfo = array();
    if (count($numbers) != 0) {
        $userInfo = getUserInfo(implode(",", array_slice($numbers, 0, $userInfoMaxCount)));
    }
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

    $data = array(
        'numbers' => implode(",", $numbers),
        'info' => $userData,
    );
    echo json_encode($data);

?>