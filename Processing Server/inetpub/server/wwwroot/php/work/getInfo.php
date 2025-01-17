<?php

    include_once('../../default_function.php');

    $numbers = $_POST["numbers"];
    
    $workNumbers = explode(',', $numbers);
    $workInfo = getWorkInfo(implode(",", $workNumbers));

    //출력
    echo json_encode($workInfo);

?>