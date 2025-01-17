<?php

    @include_once('../../../../../default_function.php');
    $userInfo = getMyLoginInfo();
    
    if ($userInfo["isLogin"] == true) {
        (isset($partNumber) == false) ? $partNumber = $_POST["partNumber"] : null;

        //크리에이터 자격 여부
        if ($userInfo["creator_permission"] == false) {
            echo "no permission";
            exit;
        }

        //본인 확인
        $stmt = $pdo->prepare("SELECT user_number, localization_language FROM work_part WHERE number = :number");
        $stmt->execute(array(
            ':number' => $partNumber
        ));
        $workPart = $stmt->fetch();
        if ($workPart["user_number"] != $userInfo["number"]) {
            echo "not creator";
        }
        
        //

        $maxContribute = 10;
        $numbers = explode(",", $_POST["numbers"]);
        
        //정보 불러오기
        $stmt = $pdo->prepare("SELECT number, user_number, language, location, thumbnail_image, size FROM work_part_user_translation WHERE part_number = :part_number AND number IN (" . implode(",", $numbers) . ")");
        $stmt->execute(array(
            ':part_number' => $partNumber
        ));
        $result = $stmt->fetchAll();
        $result_length = count($result);

        $userNumbers = array();
        for ($i = 0; $i < $result_length; $i++) {
            $userNumbers[] = $result[$i]["user_number"];
        }
        $userData = array();
        if (count($userNumbers) != 0) {
            $userInfo = getUserInfo(implode(",", $userNumbers));
            $userInfo_length = count($userInfo);
            for ($i = 0; $i < $userInfo_length; $i++) {
                $userData[$userInfo[$i]["number"]] = $userInfo[$i];
            }
        }

        //몇개의 작품을 기여했는지 구하기
        $contributorData = array();
        if (count($userNumbers) != 0) {
            $stmt = $pdo->prepare("SELECT contributor_number, COUNT(DISTINCT work_number) FROM work_part_localization WHERE contributor_number IN (" . implode(",", $userNumbers) . ") GROUP BY contributor_number");
            $stmt->execute();
            $localization = $stmt->fetchAll();
            $localization_length = count($localization);
            
            for ($i = 0; $i < $localization_length; $i++) {
                $contributorData[$localization[$i]["contributor_number"]] = $localization[$i]["COUNT(DISTINCT work_number)"];
            }
        }

        //번역된 언어
        $localizationLanguage = array();
        if (isset($workPart["localization_language"])) {
            $localizationLanguage = explode(",", $workPart["localization_language"]);
        }
        $localizationLanguage_length = count($localizationLanguage);

        $info = array();
        for ($i = 0; $i < $result_length; $i++) {
            //몇개의 작품을 기여했는지
            $contribute = 0;
            if (isset($contributorData[$result[$i]["user_number"]])) {
                $contribute = $contributorData[$result[$i]["user_number"]];
            }
            $isTrusted = false;
            if ($contribute >= $maxContribute) {
                $isTrusted = true;
            }
            $isThumbnail = false;
            if (isset($result[$i]["thumbnail_image"])) {
                $isThumbnail = true;
            }
            //이미 번역된 언어인지
            $isAlreadyTranslated = false;
            for ($j = 0; $j < $localizationLanguage_length; $j++) {
                if ($localizationLanguage[$j] == $result[$i]["language"]) {
                    $isAlreadyTranslated = true;
                    break;
                }
            }

            $userInfo = $userData[$result[$i]["user_number"]];

            $info[] = array(
                "number" => $result[$i]["number"],
                "userNumber" => $result[$i]["user_number"],
                "profile" => $userInfo["profile"],
                "nickname" => $userInfo["nickname"],
                "language" => $result[$i]["language"],
                "location" => $result[$i]["location"],
                "contribute" => $contribute,
                "isTrusted" => $isTrusted,
                "isThumbnail" => $isThumbnail,
                "isAlreadyTranslated" => $isAlreadyTranslated,
                "size" => $result[$i]["size"]
            );
        }

        echo json_encode($info);
    }

?>