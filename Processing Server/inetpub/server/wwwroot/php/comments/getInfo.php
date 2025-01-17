<?php

    include_once('../../default_function.php');

    $highlightedCommentNumber = null;
    if (isset($_POST["highlightedCommentNumber"])) {
        $highlightedCommentNumber = $_POST["highlightedCommentNumber"];
    }

    $numbers = $_POST["numbers"];
    
    $commentsNumbers = explode(',', $numbers);
    $commentsInfo = getCommentsInfo(implode(",", $commentsNumbers), $highlightedCommentNumber);

    //출력
    echo json_encode($commentsInfo);

?>