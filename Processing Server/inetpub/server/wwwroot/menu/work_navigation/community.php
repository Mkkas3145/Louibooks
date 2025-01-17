<?php

    include_once('../../default_function.php');
    $workNumber = $_POST["workNumber"];
    $workInfo = getWorkInfo($workNumber)[0];

    //커뮤니티 정보
    $communityUid = 'work_' . $workNumber;
    $communitySort = 0; //최신 순
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

<div class = "work_community">
    <!-- html -->
</div>