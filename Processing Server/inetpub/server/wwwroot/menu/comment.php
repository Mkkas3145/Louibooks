<?php

    include_once('../default_function.php');
    $userInfo = getMyLoginInfo();

    //강조 댓글 번호
    $commentNumber = $_POST["data"];
    $commentsUid = null;

    //강조 댓글의 UID 구하기
    $stmt = $pdo->prepare("SELECT number, uid, reply_number FROM comments WHERE number = :number");
    $stmt->execute(array(
        ':number' => $commentNumber
    ));
    $commentsInfo = $stmt->fetch();

    //우선 순위가 제일 높은 댓글 번호
    $preferentially = null;

    //답글일 경우 UID를 가지고 있지 않으니 상위 댓글의 UID를 구한다.
    if (isset($commentsInfo["reply_number"])) {
        $stmt = $pdo->prepare("SELECT number, uid FROM comments WHERE number = :number");
        $stmt->execute(array(
            ':number' => $commentsInfo["reply_number"]
        ));
        $info = $stmt->fetch();
        $commentsUid = $info["uid"];
        $preferentially = $info["number"];
    } else {
        $commentsUid = $commentsInfo["uid"];
        $preferentially = $commentsInfo["number"];
    }

    //댓글 정보
    $commentsSort = 0; //인기 댓글 순
    $commentsNumbers = getCommentsNumbers($commentsUid, $commentsSort, $preferentially);
    $numbers = explode(",", $commentsNumbers);

    $commentsInfoMaxCount = (count($numbers) >= 20) ? 20 : count($numbers);
    $commentsInfo = getCommentsInfo(implode(",", array_slice($numbers, 0, $commentsInfoMaxCount)), $commentNumber);

?>

<div class = "preferentially_comment_number" style = "display: none;">
    <?php echo $preferentially; ?>
</div>
<div class = "highlighted_comment_number" style = "display: none;">
    <?php echo $commentNumber; ?>
</div>
<div class = "comments_uid" style = "display: none;">
    <?php echo $commentsUid; ?>
</div>
<div class = "originator_number" style = "display: none;">
    <?php echo getCommentsOriginatorNumber($commentsUid); ?>
</div>
<div class = "comments_info" style = "display: none;">
    <?php
        echo json_encode(array(
            "numbers" => $commentsNumbers,
            "info" => $commentsInfo
        ));
    ?>
</div>
<div class = "menu_comment_contents">
    <!-- html -->
</div>