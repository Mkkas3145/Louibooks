<?php

    include_once('../../default_function.php');

    $numbers = $_POST["numbers"];
    
    $partNumbers = explode(',', $numbers);
    $partInfo = getWorkPartInfo(implode(",", $partNumbers));

    //출력
    echo json_encode($partInfo);

?>