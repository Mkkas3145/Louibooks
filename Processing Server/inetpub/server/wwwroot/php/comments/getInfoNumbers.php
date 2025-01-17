<?php

    include_once('../../default_function.php');

    //
    $preferentiallyCommentNumber = null;
    if (isset($_POST["preferentiallyCommentNumber"])) {
        $preferentiallyCommentNumber = $_POST["preferentiallyCommentNumber"];
    }
    $highlightedCommentNumber = null;
    if (isset($_POST["highlightedCommentNumber"])) {
        $highlightedCommentNumber = $_POST["highlightedCommentNumber"];
    }

    //댓글 정보
    $commentsUid = $_POST["uid"];
    $commentsSort = $_POST["sort"]; //인기 댓글 순
    $commentsNumbers = getCommentsNumbers($commentsUid, $commentsSort, $preferentiallyCommentNumber);
    $numbers = explode(",", $commentsNumbers);

    $commentsInfoMaxCount = (count($numbers) >= 20) ? 20 : count($numbers);
    $commentsInfo = getCommentsInfo(implode(",", array_slice($numbers, 0, $commentsInfoMaxCount)), $highlightedCommentNumber);

    //출력
    echo json_encode(array(
        "numbers" => $commentsNumbers,
        "info" => $commentsInfo,
    ));

?>