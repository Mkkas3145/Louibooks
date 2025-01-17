<?php

    include_once('../../default_function.php');

    //댓글 정보
    $communityUid = $_POST["uid"];
    $communitySort = $_POST["sort"]; //인기 댓글 순
    $communityNumbers = getCommunityNumbers($communityUid, $communitySort);
    $numbers = explode(",", $communityNumbers);

    $communityInfoMaxCount = (count($numbers) >= 20) ? 20 : count($numbers);
    $communityInfo = getCommunityInfo(implode(",", array_slice($numbers, 0, $communityInfoMaxCount)));

    //출력
    echo json_encode(array(
        "numbers" => $communityNumbers,
        "info" => $communityInfo,
    ));

?>