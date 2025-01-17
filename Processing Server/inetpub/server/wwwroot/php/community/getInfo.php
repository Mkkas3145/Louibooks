<?php

    include_once('../../default_function.php');

    $numbers = $_POST["numbers"];
    
    $communityNumbers = explode(',', $numbers);
    $communityInfo = getCommunityInfo(implode(",", $communityNumbers));

    //출력
    echo json_encode($communityInfo);

?>