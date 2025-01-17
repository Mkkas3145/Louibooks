<?php

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    //
    $numbers = explode(",", $_POST["numbers"]);
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

    echo json_encode($info);

?>