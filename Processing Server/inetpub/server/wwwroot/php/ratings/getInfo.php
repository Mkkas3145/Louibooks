<?php

    include_once('../../default_function.php');

    $numbers = $_POST["numbers"];

    $ratingsNumbers = explode(",", $numbers);
    $ratingsInfoMaxCount = (count($ratingsNumbers) >= 20) ? 20 : count($ratingsNumbers);
    $ratingsInfo = getRatingsInfo(implode(",", array_slice($ratingsNumbers, 0, $ratingsInfoMaxCount)));

    echo json_encode($ratingsInfo);

?>