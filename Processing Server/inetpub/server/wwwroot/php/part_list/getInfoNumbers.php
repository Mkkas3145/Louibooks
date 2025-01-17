<?php

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    $workNumber = $_POST["workNumber"];
    $sort = $_POST["sort"];
    $chapter = $_POST["chapter"];
    
    $numbers = getWorkPartNumbers($workNumber, $sort, $chapter);
    $partListNumbers = explode(",", $numbers);
    $partListInfoMaxCount = (count($partListNumbers) >= 25) ? 25 : count($partListNumbers);
    $partListInfo = getWorkPartInfo(implode(",", array_slice($partListNumbers, 0, $partListInfoMaxCount)));

    $data = array(
        'numbers' => implode(',', $partListNumbers),
        'info' => json_encode($partListInfo),
    );
    echo json_encode($data);

?>