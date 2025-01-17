<?php

    include_once('../../../default_function.php');

    $userNumber = $_POST["userNumber"];
    $sort = $_POST["sort"];
    $contentsType = $_POST["contentsType"];

    $array = array(
        'user_number' => $userNumber
    );
    $contentsTypeSql = "";
    if ($contentsType != 0) {
        $contentsTypeSql = " AND contents_type = :contents_type";
    }
    if ($contentsType == 1) {
        $array['contents_type'] = 0;
    } else if ($contentsType == 2) {
        $array['contents_type'] = 1;
    } else if ($contentsType == 3) {
        $array['contents_type'] = 2;
    } else if ($contentsType == 4) {
        $array['contents_type'] = 3;
    }

    //
    $stmt = $pdo->prepare("SELECT number FROM works WHERE user_number = :user_number AND public_status = 0" . $contentsTypeSql);
    $stmt->execute($array);
    $workInfo = $stmt->fetchAll();
    $workInfo_length = count($workInfo);

    $numbers = array();
    for ($i = 0; $i < $workInfo_length; $i++) {
        $numbers[] = $workInfo[$i]["number"];
    }
    //정렬
    if ($sort == 0) {
        $numbers = array_reverse($numbers);
    }

    $workInfoMaxCount = (count($numbers) >= 24) ? 24 : count($numbers);
    $workInfo = getWorkInfo(implode(",", array_slice($numbers, 0, $workInfoMaxCount)));

    $workData = array(
        'numbers' => implode(",", $numbers),
        'info' => $workInfo,
    );

    echo json_encode($workData);

?>