<?php

    include_once('../../default_function.php');
    
    $numbersStr = getReplyNumbers($_POST["comments_number"]);
    $numbers = explode(",", $numbersStr);

    $infoMaxCount = (count($numbers) >= 10) ? 10 : count($numbers);
    $info = getCommentsInfo(implode(",", array_slice($numbers, 0, $infoMaxCount)));

    //출력
    echo json_encode(array(
        'numbers' => $numbersStr,
        'info' => $info,
    ));

?>