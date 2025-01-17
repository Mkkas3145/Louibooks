<?php

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();
    $sort = $_POST['sort'];
    $workType = $_POST["workType"];

    $numbers = getMostRecentlyViewedWorkNumbers($sort, $workType);
    $maxCount = (count($numbers) >= 24) ? 24 : count($numbers);
    $workInfo = getWorkInfo(implode(",", array_slice($numbers, 0, $maxCount)), null, null, false, true);

    //출력
    echo json_encode(array(
        "numbers" => implode(",", $numbers),
        "info" => $workInfo,
        "worksHistoryUse" => $userInfo["works_history_use"],
    ));

?>