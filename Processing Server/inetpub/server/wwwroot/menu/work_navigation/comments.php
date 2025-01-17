<?php

    include_once('../../default_function.php');
    $workNumber = $_POST["workNumber"];

    $workInfo = getWorkInfo($workNumber)[0];

    //회차 정보
    $stmt = $pdo->prepare("SELECT number FROM work_part WHERE work_number = :work_number");
    $stmt->execute(array(
        ':work_number' => $workNumber,
    ));
    $partList = $stmt->fetchAll();
    $partList_length = count($partList);
    $partListNumbers = array();
    for ($i = 0; $i < $partList_length; $i++) {
        $partListNumbers[] = $partList[$i]["number"];
    }
    $partListInfo = array();
    $partListInfo_length = 0;
    if (count($partListNumbers) != 0) {
        $partListInfo = getWorkPartInfo(implode(",", $partListNumbers));
        $partListInfo_length = count($partListInfo);
    }
    
    $commentsUid = array();
    for ($i = 0; $i < $partList_length; $i++) {
        $commentsUid[] = 'part_' . $partList[$i]["number"];
    }
    $commentsUid = implode(",", $commentsUid);

    //댓글 정보
    $commentsSort = 0; //인기 댓글 순
    $commentsNumbers = getCommentsNumbers($commentsUid, $commentsSort);
    $numbers = explode(",", $commentsNumbers);

    $commentsInfoMaxCount = (count($numbers) >= 20) ? 20 : count($numbers);
    $commentsInfo = getCommentsInfo(implode(",", array_slice($numbers, 0, $commentsInfoMaxCount)));

    //댓글 접두사
    $commentsPrefix = array();
    for ($i = 0; $i < $partListInfo_length; $i++) {
        if ($partListInfo[$i]["status"] == 0) {
            $commentsPrefix[] = array(
                'uid' => 'part_' . $partListInfo[$i]["number"],
                'category' => $partListInfo[$i]["category"],
                'episode' => $partListInfo[$i]["episode"],
                'title' => $partListInfo[$i]["title"],
            );
        }
    }

?>

<div class = "comments_uid" style = "display: none;">
    <?php echo $commentsUid; ?>
</div>
<div class = "comments_prefix" style = "display: none;">
    <?php echo json_encode($commentsPrefix); ?>
</div>
<div class = "comments_info" style = "display: none;">
    <?php 
        echo json_encode(array(
            "numbers" => $commentsNumbers,
            "info" => $commentsInfo,
        ));
    ?>
</div>
<div class = "originator_number" style = "display: none;">
    <?php echo getCommentsOriginatorNumber($commentsUid); ?>
</div>

<div class = "menu_work_comments"></div>