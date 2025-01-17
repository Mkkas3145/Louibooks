<?php

    include_once('../../default_function.php');

    $workNumber = $_POST["workNumber"];

    //평가 및 리뷰 정보
    $ratingsSort = $_POST["sort"];
    $ratingsNumbers = getRatingsNumbers($workNumber, $ratingsSort);
    $numbers = explode(",", $ratingsNumbers);

    $ratingsInfoMaxCount = (count($numbers) >= 20) ? 20 : count($numbers);
    $ratingsInfo = getRatingsInfo(implode(",", array_slice($numbers, 0, $ratingsInfoMaxCount)));

    if ($workNumber != "history") {
        //분석 정보
        $analysisInfo = getRatingsAnalysisInfo($workNumber)[0];
        $isWritableRatings = isWritableRatings($workNumber);
    }

    $data = array(
        "info" => $ratingsInfo,
        "numbers" => $ratingsNumbers
    );
    if (isset($analysisInfo)) {
        $data["analysisInfo"] = $analysisInfo;
    }
    if (isset($isWritableRatings)) {
        $data["isWritableRatings"] = $isWritableRatings;
    }

    echo json_encode($data);

?>