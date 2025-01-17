<?php

    include_once('../../../default_function.php');
    $userNumber = $_POST["userNumber"];
    $sort = $_POST['sort'];

    //
    if ($sort == 0) {
        $stmt = $pdo->prepare("SELECT number FROM work_list WHERE user_number = :user_number AND public_status = 0 ORDER BY number DESC");
        $stmt->execute(array(
            'user_number' => $userNumber
        ));
        $result = $stmt->fetchAll();
    } else if ($sort == 1) {
        $stmt = $pdo->prepare("SELECT number FROM work_list WHERE user_number = :user_number AND public_status = 0");
        $stmt->execute(array(
            'user_number' => $userNumber
        ));
        $result = $stmt->fetchAll();
    } else if ($sort == 2) {
        $stmt = $pdo->prepare("SELECT number FROM work_list WHERE user_number = :user_number AND public_status = 0 ORDER BY updated_date DESC");
        $stmt->execute(array(
            'user_number' => $userNumber
        ));
        $result = $stmt->fetchAll();
    } else if ($sort == 3) {
        $stmt = $pdo->prepare("SELECT number FROM work_list WHERE user_number = :user_number AND public_status = 0 ORDER BY updated_date ASC");
        $stmt->execute(array(
            'user_number' => $userNumber
        ));
        $result = $stmt->fetchAll();
    }

    $result_length = count($result);
    $numbers = array();
    for ($i = 0; $i < $result_length; $i++) {
        $numbers[] = $result[$i]['number'];
    }
    $maxCount = (count($numbers) >= 24) ? 24 : count($numbers);
    $myWorkListInfo = getWorkListInfo(implode(",", array_slice($numbers, 0, $maxCount)), null, null, false, true);

    //출력
    echo json_encode(array(
        "numbers" => implode(",", $numbers),
        "info" => $myWorkListInfo,
    ));

?>