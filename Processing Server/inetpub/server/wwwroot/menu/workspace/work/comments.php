<?php

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    $data = $_POST["data"];
    $workNumber = (int) $data;

    if ($userInfo["isLogin"] == false) {
        echo 'not login'; exit;
    }

    $stmt = $pdo->prepare("SELECT number, user_number FROM works WHERE user_number = :user_number AND number = :number");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"],
        ':number' => $workNumber,
    ));
    $work = $stmt->fetch();

    //
    if (isset($work['number']) == false) {
        echo 'no permission';
        exit;
    }

    //회차 정보
    $stmt = $pdo->prepare("SELECT number, category, episode, title FROM work_part WHERE work_number = :work_number");
    $stmt->execute(array(
        ':work_number' => $workNumber,
    ));
    $partList = $stmt->fetchAll();
    $partList_length = count($partList);

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
    for ($i = 0; $i < $partList_length; $i++) {
        $commentsPrefix[] = array(
            'uid' => 'part_' . $partList[$i]["number"],
            'category' => $partList[$i]["category"],
            'episode' => $partList[$i]["episode"],
            'title' => $partList[$i]["title"],
        );
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
    <?php echo $work["user_number"]; ?>
</div>

<div class = "workspace_work_contents">
    <div class = "workspace_work_contents_left">
        <div class = "my_work_comments"></div>
    </div>
</div>