<?php

    include_once('../../../../default_function.php');

    $numbers = $_POST["numbers"];
    
    $myWorksNumbers = explode(',', $numbers);
    $myWorksInfo = getWorkInfo(implode(",", $myWorksNumbers));

    //출력
    echo json_encode($myWorksInfo);

?>