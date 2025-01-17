<?php

    include_once('../../default_function.php');

    $partNumber = $_POST["partNumber"];
    $percent = $_POST["percent"];

    savePercentViewedPart($partNumber, $percent);

?>