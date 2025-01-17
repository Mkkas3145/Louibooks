<?php

    include_once('../../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == false) {
        echo 'not login'; exit;
    }

    $optionWorkType = $_POST["workType"];
    if ($optionWorkType == 0) {
        $optionWorkTypeSql = '1 = :type';
        $optionWorkType = '1';
    } else if ($optionWorkType == 1) {
        $optionWorkTypeSql = 'contents_type = :type';
        $optionWorkType = 0;
    } else if ($optionWorkType == 2) {
        $optionWorkTypeSql = 'contents_type = :type';
        $optionWorkType = 1;
    } else if ($optionWorkType == 3) {
        $optionWorkTypeSql = 'contents_type = :type';
        $optionWorkType = 2;
    } else if ($optionWorkType == 4) {
        $optionWorkTypeSql = 'contents_type = :type';
        $optionWorkType = 3;
    } else if ($optionWorkType == 5) {
        $optionWorkTypeSql = 'contents_type = :type';
        $optionWorkType = 4;
    }
    $optionSort = $_POST["sort"];

    $stmt = $pdo->prepare("SELECT number FROM works WHERE user_number = :user_number AND " . $optionWorkTypeSql);
    $stmt->execute(array(
        ':user_number' => $userInfo["number"],
        ':type' => $optionWorkType,
    ));
    $myWorks = null;
    if ($optionSort == 0) {
        $myWorks = array_reverse($stmt->fetchAll());
    } else if ($optionSort == 1) {
        $myWorks = $stmt->fetchAll();
    }
    $myWorksNumbers = array();
    for ($i = 0; $i < count($myWorks); $i++) {
        $myWorksNumbers[$i] = $myWorks[$i]["number"];
    }
    $myWorksInfoMaxCount = (count($myWorksNumbers) >= 15) ? 15 : count($myWorksNumbers);
    $myWorksInfo = getWorkInfo(implode(",", array_slice($myWorksNumbers, 0, $myWorksInfoMaxCount)));

    $data = array(
        'numbers' => implode(',', $myWorksNumbers),
        'info' => json_encode($myWorksInfo),
    );
    echo json_encode($data);

?>