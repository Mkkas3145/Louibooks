<?php

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();
    $sort = $_POST['sort'];
    $contentsType = $_POST["workType"];

    $contentsTypeSql = "";
    if ($contentsType == 1) {
        $contentsTypeSql = " AND contents_type = 0";
    } else if ($contentsType == 2) {
        $contentsTypeSql = " AND contents_type = 1";
    } else if ($contentsType == 3) {
        $contentsTypeSql = " AND contents_type = 2";
    } else if ($contentsType == 4) {
        $contentsTypeSql = " AND contents_type = 3";
    }

    //
    $stmt = $pdo->prepare("SELECT work_number FROM work_notifications_settings WHERE user_number = :user_number" . $contentsTypeSql);
    $stmt->execute(array(
        'user_number' => $userInfo["number"]
    ));
    $workNotifications = $stmt->fetchAll();
    $workNotifications_length = count($workNotifications);

    $numbers = array();
    for ($i = 0; $i < $workNotifications_length; $i++) {
        $numbers[] = $workNotifications[$i]["work_number"];
    }
    ($sort == 0) ? $numbers = array_reverse($numbers) : null;

    $workInfoMaxCount = (count($numbers) >= 24) ? 24 : count($numbers);
    $workInfo = getWorkInfo(implode(",", array_slice($numbers, 0, $workInfoMaxCount)));

    echo json_encode(array(
        'numbers' => implode(",", $numbers),
        'info' => $workInfo,
    ));

?>