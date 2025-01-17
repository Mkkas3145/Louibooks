<?php

    include_once('default_function.php');

    function search($query, $filter) {
        global $pdo;

        //처리 시작
        $_start = microtime(true);

        //검색 쿼리
        $query = strtolower(trim($query));
        //특수문자 제거
        $query = preg_replace("/[#\&\+\-%@=\/\\\:;,\.'\"\^`~\_|\!\?\*$#<>()\[\]\{\}]/i", "", $query);
        //연속된 공백 제거 (2개 이상의 공백 제거)
        $query = preg_replace("/ +(?= )/i", "", $query);
        //유효하지 않은 쿼리
        if ($query == "") {
            //Invalid query
            return array(
                'status' => 1,
                'count' => 0,
                'processingTime' => 0,
            );
        }

        //순서 바껴도 상관 없는
        $querySplit = explode(" ", $query);
        $querySplit_length = count($querySplit);
        $instrText = "";
        $instrData = array();
        for ($i = 0; $i < $querySplit_length; $i++) {
            if ($instrText == "") {
                $instrText .= "INSTR(compare, :instrData" . $i . ") > 0";
            } else {
                $instrText .= " AND INSTR(compare, :instrData" . $i . ") > 0";
            }
            $instrData[$i] = $querySplit[$i];
        }
        $instrData_length = count($instrData);

        //약자
        $querySplit = preg_split('//u', str_replace(' ', '', $query), null, PREG_SPLIT_NO_EMPTY); //공백 제거, 한글자마다 자르기
        $querySplit_length = count($querySplit);
        $regex = "";
        for ($i = 0; $i < $querySplit_length; $i++) {
            if ($regex == "") {
                $regex .= '(' . $querySplit[$i];
            } else {
                $regex .= '.*' . $querySplit[$i];
            }
        }
        $regex .= ")";

        












        //검색 필터
        $sortSql = "";
        if ($filter["sort"] == 0) {
            $sortSql = " ORDER BY score DESC";
        } else if ($filter["sort"] == 1) {
            $sortSql = " ORDER BY work_number DESC";
        } else if ($filter["sort"] == 2) {
            $sortSql = " ORDER BY work_number ASC";
        } else if ($filter["sort"] == 3) {
            $sortSql = " ORDER BY views DESC";
        }
        $contentsTypeSql = "";
        if ($filter["workType"] == 1) {
            $contentsTypeSql = " AND contents_type = 0";
        } else if ($filter["workType"] == 2) {
            $contentsTypeSql = " AND contents_type = 1";
        } else if ($filter["workType"] == 3) {
            $contentsTypeSql = " AND contents_type = 2";
        } else if ($filter["workType"] == 4) {
            $contentsTypeSql = " AND contents_type = 3";
        }
        $partSql = "";
        if ($filter["part"] == "ending") {
            $partSql = " AND ending > 0";
        } else if ($filter["part"] != "all") {
            $partSql = " AND part >= " . ((int) $filter["part"]);
        }
        $languageSql = "";
        if ($filter["language"] != "all") {
            $languageSql = " AND INSTR(language, :language) > 0";
        }








        //검색
        $stmt = $pdo->prepare("SELECT work_number, score FROM works_cache WHERE ((" . $instrText . ") OR (title REGEXP :regex))" . $contentsTypeSql . $partSql . $languageSql . $sortSql . " LIMIT 1000");
        $data = array(
            ':regex' => $regex
        );
        //INSTR
        for ($i = 0; $i < $instrData_length; $i++) {
            $data["instrData" . $i] = $instrData[$i];
        }
        //검색필터 - 언어
        if ($languageSql != "") {
            $data["language"] = $filter["language"];
        }
        $stmt->execute($data);
        $result = $stmt->fetchAll();
        $result_length = count($result);

        $numbers = array();
        for ($i = 0; $i < $result_length; $i++) {
            $numbers[] = $result[$i]["work_number"];
        }
        $numbers_length = count($numbers);

        $worksInfo = null;
        if ($result_length != 0) {
            $WorksInfoMaxCount = ($numbers_length >= 24) ? 24 : $numbers_length;
            $worksInfo = getWorkInfo(implode(",", array_slice($numbers, 0, $WorksInfoMaxCount)));
        }
        $worksInfo_length = 0;
        if ($worksInfo != null) {
            $worksInfo_length = count($worksInfo);
        }

        //처리 끝
        $_end = microtime(true);

        //첫번째 작품
        $firstWorkInfo = null;
        $firstWorkScore = 0;
        for ($i = 0; $i < $worksInfo_length; $i++) {
            if ($worksInfo[$i]["status"] != 2) {
                $firstWorkInfo = $worksInfo[$i];
                $firstWorkScore = $result[$i]["score"];
                break;
            }
        }

        //사이드 정보
        $sideInfo = array();
        if ($numbers_length == 1) {
            $sideInfo["workInfo"] = $firstWorkInfo;
        } else if ($firstWorkInfo != null) {
            $title = strtolower(trim($firstWorkInfo["title"]));;
            //특수문자 제거
            $title = preg_replace("/[#\&\+\-%@=\/\\\:;,\.'\"\^`~\_|\!\?\*$#<>()\[\]\{\}]/i", "", $title);
            //연속된 공백 제거 (2개 이상의 공백 제거)
            $title = preg_replace("/ +(?= )/i", "", $title);

            $split = explode(" ", $title);
            $split_length = count($split);
            $matching = true;
            for ($i = 0; $i < $split_length; $i++) {
                if (!preg_match("/{$split[$i]}/i", $query)) {
                    $matching = false;
                }
            }
            if ($matching == true) {
                $sideInfo["workInfo"] = $firstWorkInfo;
            }
        }

        //검색 결과 개수
        $count = $numbers_length;

        //사용자 정보
        $stmt = $pdo->prepare("SELECT user_number FROM user_cache WHERE ((" . $instrText . ") AND (score >= :score)) ORDER BY score DESC LIMIT 1");
        $data = array(
            ':score' => $firstWorkScore
        );
        //INSTR
        for ($i = 0; $i < $instrData_length; $i++) {
            $data["instrData" . $i] = $instrData[$i];
        }
        $stmt->execute($data);
        $result = $stmt->fetch();
        $userInfo = null;
        if (isset($result["user_number"])) {
            $userInfo = getUserInfo($result["user_number"])[0];
            $userInfo = array(
                'number' => $userInfo["number"],
                'profile' => $userInfo["profile"],
                'nickname' => $userInfo["nickname"],
                'saveCount' => $userInfo["user_list_save_count"]
            );
            $count ++;
        }

        $resultData = array(
            'status' => 0,
            'query' => $query,
            'count' => $count,
            'processingTime' => ($_end - $_start),
            'works' => array(
                'numbers' => implode(",", $numbers),
                'info' => $worksInfo,
            ),
            'sideInfo' => $sideInfo,
            'userInfo' => $userInfo
        );

        //최근 검색어
        if ($count != 0) {
            includeSearchHistory($query);
        }

        return $resultData;
    }

    //자동 완성
    function autoComplete($query) {
        global $pdo;

        //소문자로 변환
        $query = strtolower($query);
        //특수문자 제거
        $query = preg_replace("/[#\&\+\-%@=\/\\\:;,\.'\"\^`~\_|\!\?\*$#<>()\[\]\{\}]/i", "", $query);
        //연속된 공백 제거 (2개 이상의 공백 제거)
        $query = preg_replace("/ +(?= )/i", "", $query);
        //앞쪽 공백 제거
        $query = ltrim($query);
        //유효하지 않은 쿼리
        if ($query == "") {
            //Invalid query
            return array(
                'status' => 1,
            );
        }
        $compare = linear_hangul($query);

        //정규식
        $regex = "^" . $compare;

        $stmt = $pdo->prepare("SELECT content FROM search_auto_complete WHERE compare REGEXP :regex ORDER BY count DESC LIMIT 10");
        $data = array(
            ':regex' => $regex
        );
        $stmt->execute($data);
        $result = $stmt->fetchAll();
        $result_length = count($result);

        $contentList = array();
        for ($i = 0; $i < $result_length; $i++) {
            $contentList[] = $result[$i]["content"];
        }
        $contentList_length = count($contentList);

        //작품
        $resultWorks = array();
        if ($contentList_length != 0) {
            $regexp = array();
            for ($i = 0; $i < $contentList_length; $i++) {
                $regexp[] = '(^|\n)' . $contentList[$i] . '($|\n)';
            }

            //$stmt = $pdo->prepare("SELECT * FROM (SELECT work_number, title FROM works_cache WHERE title IN (" . implode(",", $contentList) . ") ORDER BY score DESC LIMIT 18446744073709551615)A GROUP BY title LIMIT 10");
            $stmt = $pdo->prepare("SELECT * FROM (SELECT work_number, title FROM works_cache WHERE title REGEXP :regexp ORDER BY score DESC LIMIT 18446744073709551615)A GROUP BY title LIMIT 10");
            $stmt->execute(array(
                ":regexp" => implode("|", $regexp)
            ));
            $workNumberList = $stmt->fetchAll();
            $workNumberList_length = count($workNumberList);

            $workNumbers = array();
            $workTitles = array();
            for ($i = 0; $i < $workNumberList_length; $i++) {
                $workNumbers[] = $workNumberList[$i]["work_number"];
                $workTitles[] = explode("\n", $workNumberList[$i]["title"]);
            }
            $workTitles_length = count($workTitles);
            $worksInfo = getWorkInfo(implode(",", $workNumbers));
            //
            for ($i = 0; $i < $workTitles_length; $i++) {
                $titles = $workTitles[$i];
                for ($j = 0; $j < count($titles); $j++) {
                    $titles[$j] = str_replace("\n", "", $titles[$j]);
                    $titles[$j] = str_replace("\r", "", $titles[$j]);
                    $resultWorks[$titles[$j]] = $worksInfo[$i];
                }
            }
        }

        //사용자
        $resultUsers = array();
        if ($contentList_length != 0) {
            $regexp = array();
            for ($i = 0; $i < $contentList_length; $i++) {
                $regexp[] = '(^|\n)' . $contentList[$i] . '($|\n)';
            }

            $stmt = $pdo->prepare("SELECT * FROM (SELECT user_number, nickname FROM user_cache WHERE nickname REGEXP :regexp ORDER BY score DESC LIMIT 18446744073709551615)A GROUP BY nickname LIMIT 10");
            $stmt->execute(array(
                ":regexp" => implode("|", $regexp)
            ));
            $userNumberList = $stmt->fetchAll();
            $userNumberList_length = count($userNumberList);

            $userNumbers = array();
            $userNicknames = array();
            for ($i = 0; $i < $userNumberList_length; $i++) {
                $userNumbers[] = $userNumberList[$i]["user_number"];
                $userNicknames[] = explode("\n", $userNumberList[$i]["nickname"]);
            }
            $userNicknames_length = count($userNicknames);
            $userInfo = getUserInfo(implode(",", $userNumbers));
            //
            for ($i = 0; $i < $userNicknames_length; $i++) {
                $nicknames = $userNicknames[$i];
                for ($j = 0; $j < count($nicknames); $j++) {
                    $nicknames[$j] = str_replace("\n", "", $nicknames[$j]);
                    $nicknames[$j] = str_replace("\r", "", $nicknames[$j]);
                    $resultUsers[$nicknames[$j]] = $userInfo[$i];
                }
            }
        }

        $resultData = array(
            'status' => 0,
            'result' => array()
        );
        for ($i = 0; $i < $result_length; $i++) {
            //작품
            $resultWorkInfo = null;
            if (isset($resultWorks[$result[$i]["content"]])) {
                $workInfo = $resultWorks[$result[$i]["content"]];
                if ($workInfo["status"] == 0) {
                    $resultWorkInfo = array(
                        "status" => $workInfo["status"],
                        "description" => $workInfo["description"],
                        "coverImage" => $workInfo["cover_image"]
                    );
                }
            }
            //사용자
            $resultUserInfo = null;
            if (isset($resultUsers[$result[$i]["content"]])) {
                $userInfo = $resultUsers[$result[$i]["content"]];
                if ($userInfo["status"] == 0) {
                    $resultUserInfo = array(
                        "status" => $userInfo["status"],
                        "description" => $userInfo["description"],
                        "profile" => $userInfo["profile"]
                    );
                }
            }
            //
            if ($resultWorkInfo != null) {
                $resultData["result"][] = array(
                    "type" => "work",
                    "content" => $result[$i]["content"],
                    "info" => $resultWorkInfo
                );
            } else if ($resultUserInfo != null) {
                $resultData["result"][] = array(
                    "type" => "user",
                    "content" => $result[$i]["content"],
                    "info" => $resultUserInfo
                );
            } else {
                $resultData["result"][] = array(
                    "type" => "default",
                    "content" => $result[$i]["content"]
                );
            }
        }

        return $resultData;
    }
    
?>