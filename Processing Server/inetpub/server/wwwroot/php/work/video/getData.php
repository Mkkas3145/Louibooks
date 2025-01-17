<?php

    include_once('../../../default_function.php');

    $partNumber = $_POST["partNumber"];
    $info = getWorkPartInfo($partNumber, null, true)[0];

    //조회수 집계
    includeViewedPart($info["number"]);

    echo json_encode($info["data"]);

?>