

<?php

    $menuNumber = $_POST["menuNumber"];
    $data = $_POST["data"];
    $partNumber = (int) $data;

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == false) {
        echo 'not login'; exit;
    }

    //
    $stmt = $pdo->prepare("SELECT number, work_number FROM work_part WHERE user_number = :user_number AND number = :number");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"],
        ':number' => $partNumber
    ));
    $partInfo = $stmt->fetch();

    //
    $stmt = $pdo->prepare("SELECT number, user_number FROM works WHERE user_number = :user_number AND number = :number");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"],
        ':number' => $partInfo["work_number"],
    ));
    $workInfo = $stmt->fetch();

    //
    if (isset($workInfo['number']) == false) {
        echo 'no permission';
        exit;
    }

    //댓글 정보
    $commentsUid = "part_" . $partNumber;
    $commentsSort = 0; //인기 댓글 순
    $commentsNumbers = getCommentsNumbers($commentsUid, $commentsSort);
    $numbers = explode(",", $commentsNumbers);

    $commentsInfoMaxCount = (count($numbers) >= 20) ? 20 : count($numbers);
    $commentsInfo = getCommentsInfo(implode(",", array_slice($numbers, 0, $commentsInfoMaxCount)));

    //
    $info = array(
        "partNumber" => $partInfo["number"],
        "workNumber" => $partInfo["work_number"],
    );

?>

<div class = "info" style = "display: none;">
    <?php echo json_encode($info); ?>
</div>
<div class = "comments_uid" style = "display: none;">
    <?php echo $commentsUid; ?>
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
<div class = "workspace_part_comments_contents">
    <!-- html -->
</div>