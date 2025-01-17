<?php

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();
    $sort = $_POST['sort'];

    //
    if ($sort == 0) {
        $stmt = $pdo->prepare("SELECT work_list_number FROM work_list_save WHERE user_number = :user_number ORDER BY number DESC");
        $stmt->execute(array(
            'user_number' => $userInfo['number']
        ));
        $result = $stmt->fetchAll();
    } else if ($sort == 1) {
        $stmt = $pdo->prepare("SELECT work_list_number FROM work_list_save WHERE user_number = :user_number");
        $stmt->execute(array(
            'user_number' => $userInfo['number']
        ));
        $result = $stmt->fetchAll();
    } else if ($sort == 2) {
        $stmt = $pdo->prepare("SELECT work_list_number FROM work_list_save WHERE user_number = :user_number ORDER BY updated_date DESC");
        $stmt->execute(array(
            'user_number' => $userInfo['number']
        ));
        $result = $stmt->fetchAll();
    } else if ($sort == 3) {
        $stmt = $pdo->prepare("SELECT work_list_number FROM work_list_save WHERE user_number = :user_number ORDER BY updated_date ASC");
        $stmt->execute(array(
            'user_number' => $userInfo['number']
        ));
        $result = $stmt->fetchAll();
    }

    $result_length = count($result);
    $numbers = array();
    for ($i = 0; $i < $result_length; $i++) {
        $numbers[] = $result[$i]['work_list_number'];
    }
    $maxCount = (count($numbers) >= 24) ? 24 : count($numbers);
    $myWorkListInfo = getWorkListInfo(implode(",", array_slice($numbers, 0, $maxCount)), null, null, false, true);

    //출력
    echo json_encode(array(
        "numbers" => implode(",", $numbers),
        "info" => $myWorkListInfo,
    ));

?>