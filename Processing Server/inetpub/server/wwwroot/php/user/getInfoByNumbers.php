<?php
    
    include_once('../../default_function.php');

    $userNumbers = explode(",", $_POST["numbers"]);
    $userInfo = getUserInfo(implode(",", $userNumbers));
    $userInfo_length = count($userInfo);

    $data = array();
    for ($i = 0; $i < $userInfo_length; $i++) {
        $data[] = array(
            "number" => $userInfo[$i]["number"],
            "email" => $userInfo[$i]["email"],
            "nickname" => $userInfo[$i]["nickname"],
            "profile" => $userInfo[$i]["profile"]
        );
    }

    echo json_encode($data);

?>