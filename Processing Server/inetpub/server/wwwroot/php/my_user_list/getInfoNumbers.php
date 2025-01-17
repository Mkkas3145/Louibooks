<?php

    include_once('../../default_function.php');
    $myUserInfo = getMyLoginInfo();
    $sort = $_POST["sort"];

    $stmt = $pdo->prepare("SELECT saved_user_number FROM user_list WHERE user_number = :user_number");
    $stmt->execute(array(
        'user_number' => $myUserInfo['number']
    ));
    $result = $stmt->fetchAll();
    $result_length = count($result);
    $numbers = array();
    for ($i = 0; $i < $result_length; $i++) {
        $numbers[] = $result[$i]['saved_user_number'];
    }
    ($sort == 0) ? $numbers = array_reverse($numbers) : null;
    $maxCount = (count($numbers) >= 40) ? 40 : count($numbers);
    $data = getUserInfo(implode(",", array_slice($numbers, 0, $maxCount)), null, null, false, true);
    
    $info = array();
    if ($data != null) {
        $data_length = count($data);
        
        for ($i = 0; $i < $data_length; $i++) {
            $info[$i] = array(
                'userNumber' => $data[$i]['number'],
                'profileInfo' => $data[$i]["profile"],
                'nickname' => $data[$i]["nickname"],
                'saveCount' => $data[$i]["user_list_save_count"]
            );
        }
    }

    echo json_encode(array(
        "numbers" => implode(',', $numbers),
        "info" => $info
    ));

?>