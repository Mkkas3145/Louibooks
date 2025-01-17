<?php

    include_once('../../../default_function.php');

    $genre = null;
    if (isset($_POST["genre"])) {
        $genre = $_POST["genre"];
    }
    
    $trendingGenre = getTrendingGenre();
    $workNumbers = getTrendingWorkNumbers($genre); //인기 작품 구하기
    $numbers = explode(",", $workNumbers);
    $maxCount = (count($numbers) >= 24) ? 24 : count($numbers);
    $workInfo = getWorkInfo(implode(",", array_slice($numbers, 0, $maxCount)), null, null, false, true);

    echo json_encode(array(
        "genre" => $trendingGenre,
        "numbers" => $workNumbers,
        "info" => $workInfo
    ));

?>