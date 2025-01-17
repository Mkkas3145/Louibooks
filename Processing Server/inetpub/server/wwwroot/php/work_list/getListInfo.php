<?php

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();
    
    $workListNumber = $_POST["workListNumber"];
    $workListInfo = getWorkListInfo($workListNumber, $_POST["sort"], $_POST["workType"], true, true)[0];

    if ($workListInfo["public_status"] == 2 && ($userInfo["isLogin"] == false || $userInfo["number"] != $workListInfo["user_number"])) {
        echo 'no_permission';
        exit;
    }

    $numbers = explode(",", $workListInfo["work_numbers"]);
    $maxCount = (count($numbers) >= 24) ? 24 : count($numbers);
    $worksInfo = getWorkInfo(implode(",", array_slice($numbers, 0, $maxCount)));

    $info = array(
        'number' => $workListInfo["number"],
        'userNumber' => $workListInfo["user_number"],
        'profile' => $workListInfo["profile"],
        'nickname' => $workListInfo["nickname"],
        'title' => $workListInfo["title"],
        'publicStatus' => $workListInfo["public_status"],
        'count' => $workListInfo["count"],
        'updated_date' => $workListInfo["updated_date"],
        'workNumbers' => $workListInfo["work_numbers"],
        'worksInfo' => $worksInfo,
    );
    if (isset($workListInfo["thumbnail_image"])) {
        $info['thumbnailImage'] = $workListInfo["thumbnail_image"];
    }

    echo json_encode($info);
    
?>