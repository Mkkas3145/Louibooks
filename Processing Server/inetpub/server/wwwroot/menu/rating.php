<?php

    include_once('../default_function.php');
    $userInfo = getMyLoginInfo();

    //강조 평가 및 리뷰 번호
    $ratingNumber = $_POST["data"];

    //작품 번호 구하기
    $stmt = $pdo->prepare("SELECT work_number FROM ratings WHERE number = :number");
    $stmt->execute(array(
        ':number' => $ratingNumber
    ));
    $workNumber = $stmt->fetch()["work_number"];

    //우선 순위가 제일 높은 댓글 번호
    $preferentially = $ratingNumber;

    //평가 및 리뷰 정보
    $ratingsSort = 0; //인기 댓글 순
    $ratingsNumbers = getRatingsNumbers($workNumber, $ratingsSort, $preferentially);
    $numbers = explode(",", $ratingsNumbers);

    $ratingsInfoMaxCount = (count($numbers) >= 20) ? 20 : count($numbers);
    $ratingsInfo = getRatingsInfo(implode(",", array_slice($numbers, 0, $ratingsInfoMaxCount)));

    //분석 정보
    $analysisInfo = getRatingsAnalysisInfo($workNumber)[0];

    //쓰기 가능 여부
    $isWritableRatings = isWritableRatings($workNumber);

    $info = array(
        "preferentiallyRatingNumber" => $ratingNumber,
        "highlightedRatingNumber" => $ratingNumber,
        "workNumber" => $workNumber
    );

?>

<div class = "info" style = "display: none;">
    <?php echo json_encode($info); ?>
</div>
<div class = "ratings_info" style = "display: none;">
    <?php
        echo json_encode(array(
            "analysisInfo" => $analysisInfo,
            "isWritable" => $isWritableRatings,
            "numbers" => $ratingsNumbers,
            "info" => $ratingsInfo
        ));
    ?>
</div>
<div class = "menu_rating_contents">
    <!-- html -->
</div>