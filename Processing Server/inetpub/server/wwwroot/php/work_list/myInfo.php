<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $stmt = $pdo->prepare("SELECT work_list_number FROM work_list_save WHERE user_number = :user_number");
        $stmt->execute(array(
            'user_number' => $userInfo['number']
        ));
        $result = $stmt->fetchAll();
        $result_length = count($result);
        $numbers = array();
        for ($i = 0; $i < $result_length; $i++) {
            $numbers[] = $result[$i]['work_list_number'];
        }
        $data = getWorkListInfo(implode(',', $numbers), 0, 0, true);
        $info = array();
        if ($data != null) {
            $data_length = count($data);
            
            for ($i = 0; $i < $data_length; $i++) {
                if ($data[$i]["status"] == 0) {
                    $array = array(
                        'number' => $data[$i]['number'],
                        'user_number' => $data[$i]['user_number'],
                        'title' => $data[$i]['title'],
                        'count' => $data[$i]['count'],
                    );
                    if ($data[$i]['user_number'] == $userInfo["number"]) {
                        $array["work_numbers"] = $data[$i]['work_numbers'];
                    }
                    if (isset($data[$i]['thumbnail_image'])) {
                        $array["thumbnail_image"] = $data[$i]['thumbnail_image'];
                    }

                    $info[] = $array;
                }
            }
        }

        echo json_encode($info);
    }

?>