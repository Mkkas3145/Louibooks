<?php

    @include_once('../../../../default_function.php');
    $userInfo = getMyLoginInfo();

    //권한 여부
    $isAdmin = $userInfo["admin"];
    if ($isAdmin != true) {
        echo "no permission";
        exit;
    }

    //
    $sort = 0; //많은 신고자 순
    if (isset($_POST["sort"])) {
        $sort = $_POST["sort"];
    }
    $language = null;
    if (isset($_POST["language"])) {
        $language = $_POST["language"];
    }
    $numbers = null;
    if (isset($_POST["numbers"])) {
        $numbers = explode(",", $_POST["numbers"]);
    }

    $stmt = $pdo->prepare("SELECT work_number, COUNT(work_number), reason, COUNT(reason) FROM works_report GROUP BY work_number, reason");
    $stmt->execute();
    $result = $stmt->fetchAll();
    $result_length = count($result);
    
    //가져올 데이터 번호 구하기
    $workNumbers = array();
    for ($i = 0; $i < $result_length; $i++) {
        $workNumbers[] = $result[$i]["work_number"];
    }
    //데이터 가져오기
    $workInfoList = getWorkInfo(implode(",", $workNumbers));

    //최종 데이터
    $workInfo = array();

    if (isset($workInfoList)) {
        $workInfoList_length = count($workInfoList);
        for ($i = 0; $i < $workInfoList_length; $i++) {
            $workInfo[$workInfoList[$i]["number"]] = $workInfoList[$i];
        }
    }

    $reportInfo = array();
    for ($i = 0; $i < $result_length; $i++) {
        //
        if ($numbers == null || in_array($result[$i]["work_number"], $numbers)) {
            if (isset($reportInfo[$result[$i]["work_number"]])) {
                $data = $reportInfo[$result[$i]["work_number"]];
                if (isset($data["reason"]["reason_" . $result[$i]["reason"]])) {
                    $data["reason"]["reason_" . $result[$i]["reason"]] += $result[$i]["COUNT(reason)"];
                } else {
                    $data["reason"]["reason_" . $result[$i]["reason"]] = $result[$i]["COUNT(reason)"];
                }
                $data["count"] += $result[$i]["COUNT(work_number)"];

                $reportInfo[$result[$i]["work_number"]] = $data;
            } else {
                $data = array();
                $data["number"] = $result[$i]["work_number"];
                $data["count"] = $result[$i]["COUNT(work_number)"];
                $data["workInfo"] = $workInfo[$data["number"]];
                $data["reason"] = array(
                    "reason_" . $result[$i]["reason"] => $result[$i]["COUNT(reason)"]
                );
                $reportInfo[$result[$i]["work_number"]] = $data;
            }
        }
    }

    $info = array();
    foreach ($reportInfo as $key => $value) {
        $data = $value;

        if (isset($value["workInfo"]["original_language"]) == false) {
            continue;
        }
        $workLanguage = $value["workInfo"]["original_language"];
        $data["language"] = $workLanguage;
        if ($language != null && $language != "all") {
            if ($workLanguage != $language) {
                continue;
            }
        }

        $info[] = $data;
    }
    $info_length = count($info);

    //정렬
    if ($numbers == null) {
        $sortArray = array();
        foreach ($info as $key => $value) {
            $sortArray[$key] = $value['count'];
        }
        if ($sort == 0) {
            array_multisort($sortArray, SORT_DESC, $info);
        } else {
            array_multisort($sortArray, SORT_ASC, $info);
        }
    } else {
        $sortArray = array();

        //순서 구하기
        $order = 0;
        $numbers_length = count($numbers);
        for ($i = 0; $i < $numbers_length; $i++) {
            foreach ($info as $key => $value) {
                if ($numbers[$i] == $value["number"]) {
                    $info[$key]["order"] = $order;
                    $order ++;
                    break;
                }
            }
        }

        foreach ($info as $key => $value) {
            $sortArray[$key] = $value['order'];
        }
        array_multisort($sortArray, SORT_ASC, $info);
    }

    //15개만
    $resultInfo = array();
    $resultNumbers = array();
    for ($i = 0; $i < $info_length; $i++) {
        $resultNumbers[] = $info[$i]["number"];

        if ($i < 15) { //15개로
            $resultInfo[] = $info[$i];
        }
    }

    if ($numbers == null) {
        echo json_encode(array(
            'numbers' => implode(",", $resultNumbers),
            'info' => $resultInfo
        ));
    } else {
        echo json_encode($resultInfo);
    }

?>