<?php

    @include_once('../../../../default_function.php');
    $userInfo = getMyLoginInfo();

    //권한 여부
    $isAdmin = $userInfo["admin"];
    if ($isAdmin != true) {
        echo "no permission";
        exit;
    }

    $sort = 0;
    if (isset($_POST["sort"])) {
        $sort = $_POST["sort"];
    }

    $where = "";
    if (isset($_POST["workType"]) && $_POST["workType"] != 0) {
        ($where == "") ? $where .= " WHERE" : null;
        ($where != " WHERE") ? $where .= " AND" : null;
        $where .= " contents_type = " . (((int) $_POST["workType"]) - 1);
    }
    if (isset($_POST["language"]) && $_POST["language"] != 0) {
        if (mb_strlen($_POST["language"], "UTF-8") == 2) {
            ($where == "") ? $where .= " WHERE" : null;
            ($where != " WHERE") ? $where .= " AND" : null;
            $where .= " language = '" . $_POST["language"] . "'";
        }
    }

    $stmt = $pdo->prepare("SELECT work_number FROM monetization_approval" . $where);
    $stmt->execute();
    $result = $stmt->fetchAll();
    $result_length = count($result);
    //정렬
    if ($sort == 1) {
        $result = array_reverse($result);
    }

    $numbers = array();
    for ($i = 0; $i < $result_length; $i++) {
        $numbers[] = $result[$i]["work_number"];
    }

    $workInfoMaxCount = (count($numbers) >= 20) ? 20 : count($numbers);
    $workInfo = getWorkInfo(implode(",", array_slice($numbers, 0, $workInfoMaxCount)));

    $data = array(
        'numbers' => implode(",", $numbers),
        'info' => $workInfo,
    );
    echo json_encode($data);

?>