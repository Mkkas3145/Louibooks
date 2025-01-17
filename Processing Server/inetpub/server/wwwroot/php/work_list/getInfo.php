<?php

    include_once('../../default_function.php');

    $numbers = $_POST["numbers"];
    
    $workListNumbers = explode(',', $numbers);
    $workListInfo = getWorkListInfo(implode(",", $workListNumbers), null, null, false, true);

    //출력
    echo json_encode($workListInfo);

?>