<?php

    $menuNumber = $_POST["menuNumber"];
    $workNumber = $_POST["workNumber"];

    include_once('../../default_function.php');
    //$userInfo = getMyLoginInfo();

    //평가 및 리뷰 정보
    $ratingsSort = 0; //인기 댓글 순
    $ratingsNumbers = getRatingsNumbers($workNumber, $ratingsSort);
    $numbers = explode(",", $ratingsNumbers);

    $ratingsInfoMaxCount = (count($numbers) >= 20) ? 20 : count($numbers);
    $ratingsInfo = getRatingsInfo(implode(",", array_slice($numbers, 0, $ratingsInfoMaxCount)));

    //분석 정보
    $analysisInfo = getRatingsAnalysisInfo($workNumber)[0];

    //쓰기 가능 여부
    $isWritableRatings = isWritableRatings($workNumber);

?>

<div class = "work_number" style = "display: none;">
    <?php echo $workNumber; ?>
</div>
<div class = "ratings_info" style = "display: none;">
    <?php
        echo json_encode(array(
            "isWritable" => $isWritableRatings,
            "analysisInfo" => $analysisInfo,
            "info" => $ratingsInfo,
            "numbers" => $ratingsNumbers
        ));
    ?>
</div>

<div class = "work_navigation_ratings">
    <!-- box -->
</div>