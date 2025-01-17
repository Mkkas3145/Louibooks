<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $stmt = $pdo->prepare("SELECT saved_user_number FROM user_list WHERE user_number = :user_number");
        $stmt->execute(array(
            'user_number' => $userInfo['number']
        ));
        $result = $stmt->fetchAll();
        $result_length = count($result);
        $numbers = array();
        for ($i = 0; $i < $result_length; $i++) {
            $numbers[] = $result[$i]['saved_user_number'];
        }
        $data = getUserInfo(implode(',', $numbers), 0, 0, true);
        $info = array();
        if ($data != null) {
            $data_length = count($data);
            
            for ($i = 0; $i < $data_length; $i++) {
                $info[$i] = array(
                    'userNumber' => $data[$i]['number'],
                    'profileInfo' => $data[$i]["profile"],
                    'nickname' => $data[$i]["nickname"]
                );
            }
        }

        echo json_encode($info);
    }

?>