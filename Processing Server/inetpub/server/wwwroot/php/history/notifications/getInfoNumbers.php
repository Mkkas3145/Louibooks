<?php

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();
    $sort = $_POST['sort'];
    $type = $_POST['type'];

    $typeSql = "";
    if ($type == 1) {
        $typeSql = " AND type = 0";
    } else if ($type == 2) {
        $typeSql = " AND type = 1";
    } else if ($type == 3) {
        $typeSql = " AND type = 2";
    } else if ($type == 4) {
        $typeSql = " AND type = 3";
    }
    
    $stmt = $pdo->prepare("SELECT number FROM user_notifications WHERE user_number = :user_number" . $typeSql);
    $stmt->execute(array(
        "user_number" => $userInfo["number"]
    )); 
    $result = $stmt->fetchAll();
    $result_length = count($result);
    $numbers = array();
    for ($i = 0; $i < $result_length; $i++) {
        $numbers[] = $result[$i]['number'];
    }
    ($sort == 0) ? $numbers = array_reverse($numbers) : null; //정렬
    $maxCount = (count($numbers) >= 25) ? 25 : count($numbers);
    $info = getNotificationsInfo(implode(",", array_slice($numbers, 0, $maxCount)), null, null, false, true);

    //출력
    echo json_encode(array(
        "numbers" => implode(",", $numbers),
        "info" => $info,
        "replyNotificationsUse" => $userInfo["reply_notifications_use"],
        "activityNotificationsUse" => $userInfo["activity_notifications_use"],
        "louibooksNotificationsUse" => $userInfo["louibooks_notifications_use"]
    ));

?>