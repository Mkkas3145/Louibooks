<?php

    @include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    $workType = 0;
    if (isset($_POST["workType"])) {
        $workType = $_POST["workType"];
    }
    if (isset($_POST["category"])) {
        $category = $_POST["category"];
    }




    //
    $numbers = null;
    if ($category == "popularity_contents") {
        $numbers = getPopularityContentsWorkNumbers($workType);
    } else if ($category == "custom_contents") {
        $numbers = getCustomContentsWorkNumbers($workType);
    } else if ($category == "recently_viewed") {
        $numbers = getMostRecentlyViewedWorkNumbers(0, $workType);
    }







    $workListInfoMaxCount = (count($numbers) >= 24) ? 24 : count($numbers);
    $workListInfo = getWorkInfo(implode(",", array_slice($numbers, 0, $workListInfoMaxCount)));

    $workListData = array(
        'numbers' => implode(",", $numbers),
        'info' => $workListInfo,
    );

    if (isset($isPrint) == false || $isPrint == true) {
        echo json_encode($workListData);
    }

?>