<?php

    include_once('../../default_function.php');
    $userNumber = $_POST["userNumber"];

    //커뮤니티 정보
    $communityUid = 'user_' . $userNumber;
    $communitySort = 0; //최신 순
    $communityNumbers = getCommunityNumbers($communityUid, $communitySort);
    $numbers = explode(",", $communityNumbers);

    $communityInfoMaxCount = (count($numbers) >= 20) ? 20 : count($numbers);
    $communityInfo = getCommunityInfo(implode(",", array_slice($numbers, 0, $communityInfoMaxCount)));

?>

<div class = "user_number" style = "display: none;">
    <?php echo $userNumber; ?>
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
    <?php echo $userNumber; ?>
</div>

<div class = "user_community">
    <!-- html -->
</div>