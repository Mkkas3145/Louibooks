<?php

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    $data = $_POST["data"];
    $workNumber = (int) $data;
    $workInfo = getWorkInfo($workNumber)[0];

    //
    if ($userInfo["isLogin"] == false && $userInfo["number"] != $workInfo["user_number"]) {
        echo 'no permission';
        exit;
    }

    //댓글 정보
    $communityUid = 'work_' . $workNumber;
    $communitySort = 0; //인기 댓글 순
    $communityNumbers = getCommunityNumbers($communityUid, $communitySort);
    $numbers = explode(",", $communityNumbers);

    $communityInfoMaxCount = (count($numbers) >= 20) ? 20 : count($numbers);
    $communityInfo = getCommunityInfo(implode(",", array_slice($numbers, 0, $communityInfoMaxCount)));

?>

<div class = "work_number" style = "display: none;">
    <?php echo $workNumber; ?>
</div>
<div class = "community_info" style = "display: none;">
    <?php
        echo json_encode(array(
            "numbers" => $communityNumbers,
            "info" => $communityInfo,
        ));
    ?>
</div>
<div class = "originator_number" style = "display: none;">
    <?php echo $workInfo["user_number"]; ?>
</div>

<div class = "workspace_work_contents">
    <div class = "workspace_work_contents_left">
        <div class = "work_community">
            <!-- html -->
        </div>
    </div>
</div>