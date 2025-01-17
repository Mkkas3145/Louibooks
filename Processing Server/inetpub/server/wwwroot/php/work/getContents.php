<?php

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    $partNumber = $_POST["partNumber"];
    $contentsLanguage = null;
    (isset($data["contentsLanguage"]) == true) ? $contentsLanguage = $data["contentsLanguage"] : null;
    
    $partInfo = getWorkPartInfo($partNumber, $contentsLanguage, true)[0];
    $workInfo = getWorkInfo($partInfo["work_number"])[0];

    //조회수 집계
    includeViewedPart($partInfo["number"]);

    //회차 리스트 정보
    $stmt = $pdo->prepare("SELECT number FROM work_part WHERE work_number = :work_number AND (public_status = 0 OR number = :number)");
    $stmt->execute(array(
        ':work_number' => $workInfo["number"],
        ':number' => $partNumber
    ));
    $partList = $stmt->fetchAll();
    $partListNumbers = array();
    $partListCount = count($partList);

    $currentPartNumberIndex = null;
    for ($i = 0; $i < $partListCount; $i++) {
        if ($partInfo["number"] == $partList[$i]["number"]) {
            $currentPartNumberIndex = $i;
        }
        $partListNumbers[$i] = $partList[$i]["number"];
    }

    $maxCount = 20;
    $removeIndex = $maxCount;
    if (($currentPartNumberIndex + $maxCount) > ($partListCount - 1)) {
        $removeIndex += ($currentPartNumberIndex + $maxCount) - ($partListCount - 1);
    }
    $minIndex = $currentPartNumberIndex - $removeIndex;
    if ($minIndex < 0) {
        $minIndex = 0;
    }

    $partListInfoMaxCount = (count($partListNumbers) >= 25) ? 25 : count($partListNumbers);
    $partListInfo = getWorkPartInfo(implode(",", array_slice($partListNumbers, $minIndex, 41)));

    //댓글 정보
    $commentsUid = "part_" . $partInfo["number"];
    $commentsSort = 0; //인기 댓글 순
    $commentsNumbers = getCommentsNumbers($commentsUid, $commentsSort);
    $numbers = explode(",", $commentsNumbers);

    $commentsInfoMaxCount = (count($numbers) >= 20) ? 20 : count($numbers);
    $commentsInfo = getCommentsInfo(implode(",", array_slice($numbers, 0, $commentsInfoMaxCount)));

    //작품 정보
    $workInfo = getWorkInfo($partInfo["work_number"])[0];

    //챕터 제목 구하기
    $chapterTitle = getWorkChapterTitle($workInfo["number"], $partInfo["chapter"])[0];

    $info = array(
        "partInfo" => $partInfo,
        "commentsInfo" => array(
            "numbers" => $commentsNumbers,
            "info" => $commentsInfo,
        ),
        "partListInfo" => $partListInfo,
        "chapterTitle" => $chapterTitle,
        "workInfo" => $workInfo
    );

    echo json_encode($info);

?>