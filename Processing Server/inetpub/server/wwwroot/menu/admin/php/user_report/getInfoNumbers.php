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

    $stmt = $pdo->prepare("SELECT type, unique_number, COUNT(unique_number), reason, COUNT(reason), language, COUNT(language) FROM user_report GROUP BY type, unique_number, reason, language");
    $stmt->execute();
    $result = $stmt->fetchAll();
    $result_length = count($result);
    
    //가져올 데이터 번호 구하기
    $commentsNumbers = array();
    $ratingsNumbers = array();
    $communityNumbers = array();
    for ($i = 0; $i < $result_length; $i++) {
        $type = $result[$i]["type"];
        $uniqueNumber = $result[$i]["unique_number"];

        //
        if ($numbers == null || in_array(($type . ":" . $uniqueNumber), $numbers)) {
            if ($type == 0) {
                $commentsNumbers[] = $uniqueNumber;
            }
            if ($type == 1) {
                $ratingsNumbers[] = $uniqueNumber;
            }
            if ($type == 2) {
                $communityNumbers[] = $uniqueNumber;
            }
        }
    }
    //데이터 가져오기
    $commentsInfoList = getCommentsInfo(implode(",", $commentsNumbers));
    $ratingsInfoList = getRatingsInfo(implode(",", $ratingsNumbers));
    $communityInfoList = getCommunityInfo(implode(",", $communityNumbers));

    //최종 데이터
    $commentsInfo = array();
    $ratingsInfo = array();
    $communityInfo = array();

    if (isset($commentsInfoList)) {
        $commentsInfoList_length = count($commentsInfoList);
        for ($i = 0; $i < $commentsInfoList_length; $i++) {
            $commentsInfo[$commentsInfoList[$i]["number"]] = $commentsInfoList[$i];
        }
    }
    if (isset($ratingsInfoList)) {
        $ratingsInfoList_length = count($ratingsInfoList);
        for ($i = 0; $i < $ratingsInfoList_length; $i++) {
            $ratingsInfo[$ratingsInfoList[$i]["number"]] = $ratingsInfoList[$i];
        }
    }
    if (isset($communityInfoList)) {
        $communityInfoList_length = count($communityInfoList);
        for ($i = 0; $i < $communityInfoList_length; $i++) {
            $communityInfo[$communityInfoList[$i]["number"]] = $communityInfoList[$i];
        }
    }

    $reportInfo = array();
    for ($i = 0; $i < $result_length; $i++) {
        //
        if ($numbers == null || in_array(($result[$i]["type"] . ":" . $result[$i]["unique_number"]), $numbers)) {
            if (isset($reportInfo[$result[$i]["type"] . ":" . $result[$i]["unique_number"]])) {
                $data = $reportInfo[$result[$i]["type"] . ":" . $result[$i]["unique_number"]];
                if (isset($data["reason"]["reason_" . $result[$i]["reason"]])) {
                    $data["reason"]["reason_" . $result[$i]["reason"]] += $result[$i]["COUNT(reason)"];
                } else {
                    $data["reason"]["reason_" . $result[$i]["reason"]] = $result[$i]["COUNT(reason)"];
                }
                if (isset($data["language"][$result[$i]["language"]])) {
                    $data["language"][$result[$i]["language"]] += $result[$i]["COUNT(language)"];
                } else {
                    $data["language"][$result[$i]["language"]] = $result[$i]["COUNT(language)"];
                }
                $data["count"] += $result[$i]["COUNT(unique_number)"];
    
                $reportInfo[$result[$i]["type"] . ":" . $result[$i]["unique_number"]] = $data;
            } else {
                $type = $result[$i]["type"];
                $uniqueNumber = $result[$i]["unique_number"];
                $content = null;
                $profile = null;
                $nickname = null;
                $userNumber = null;
                if ($type == 0 && isset($commentsInfo[$uniqueNumber])) {
                    $content = $commentsInfo[$uniqueNumber]["content"];
                    $profile = $commentsInfo[$uniqueNumber]["profile"];
                    $nickname = $commentsInfo[$uniqueNumber]["nickname"];
                    $userNumber = $commentsInfo[$uniqueNumber]["user_number"];
                }
                if ($type == 1 && isset($ratingsInfo[$uniqueNumber])) {
                    $content = $ratingsInfo[$uniqueNumber]["content"];
                    $profile = $ratingsInfo[$uniqueNumber]["profile"];
                    $nickname = $ratingsInfo[$uniqueNumber]["nickname"];
                    $userNumber = $ratingsInfo[$uniqueNumber]["user_number"];
                }
                if ($type == 2 && isset($communityInfo[$uniqueNumber])) {
                    $content = $communityInfo[$uniqueNumber]["content"];
                    $profile = $communityInfo[$uniqueNumber]["profile"];
                    $nickname = $communityInfo[$uniqueNumber]["nickname"];
                    $userNumber = $communityInfo[$uniqueNumber]["user_number"];
                }
    
                $data = array();
                $data["type"] = $result[$i]["type"];
                $data["number"] = $result[$i]["type"] . ":" . $result[$i]["unique_number"];
                $data["uniqueNumber"] = $result[$i]["unique_number"];
                $data["count"] = $result[$i]["COUNT(unique_number)"];
                $data["content"] = $content;
                $data["userNumber"] = $userNumber;
                $data["profile"] = $profile;
                $data["nickname"] = $nickname;
                $data["reason"] = array(
                    "reason_" . $result[$i]["reason"] => $result[$i]["COUNT(reason)"]
                );
                $data["language"] = array(
                    $result[$i]["language"] => $result[$i]["COUNT(language)"]
                );
                $reportInfo[$result[$i]["type"] . ":" . $result[$i]["unique_number"]] = $data;
            }
        }
    }

    $info = array();
    foreach ($reportInfo as $key => $value) {
        $data = $value;

        //신고자 언어 구하기
        $maxLanguage = null;
        $max = -1;
        $reportLanguage = $value["language"];
        if ($reportLanguage != null) {
            foreach ($reportLanguage as $key => $value) {
                if ($value > $max) {
                    $maxLanguage = $key;
                    $max = $value;
                }
            }
        }
        
        $data["language"] = $maxLanguage;
        if ($language != null && $language != "all") {
            if ($maxLanguage != $language) {
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
        $resultNumbers[] = $info[$i]["type"] . ":" . $info[$i]["uniqueNumber"];

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