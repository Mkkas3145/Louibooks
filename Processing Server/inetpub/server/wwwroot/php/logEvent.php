<?php

    include_once('../default_function.php');
    $userInfo = getMyLoginInfo();
    
    //사용자 로그 정보
    $data = json_decode($_POST["data"], true);
    $userIp = getClientIp();
    $language = $_POST["language"];
    $location = getLocation()["country"];
    $gender = null;
    $birthYear = null;
    $birthMonth = null;
    $birthDay = null;
    $userNumber = null;
    if ($userInfo["isLogin"] == true) {
        //유저 번호
        $userNumber = $userInfo["number"];
        //성별
        if (isset($userInfo["gender"])) {
            $gender = $userInfo["gender"];
        }
        //생년월일
        if (isset($userInfo["birth_year"])) {
            $birthYear = $userInfo["birth_year"];
        }
        if (isset($userInfo["birth_month"])) {
            $birthMonth = $userInfo["birth_month"];
        }
        if (isset($userInfo["birth_day"])) {
            $birthDay = $userInfo["birth_day"];
        }
    }

    //나이 유형
    $ageType = null;
    if ($birthYear != null) {
        $birthDate = new DateTime($birthYear . "-" . $birthMonth . "-" . $birthDay);
        $currentDate = new DateTime();
        $ageInterval = $birthDate->diff($currentDate);
        $age = $ageInterval->y;
        $ageType = 0;
        /*
            0 = 13세 이하
            1 = 13 ~ 17
            2 = 18 ~ 24
            3 = 25 ~ 34
            4 = 35 ~ 44
            5 = 45 ~ 54
            6 = 55 ~ 64
            7 = 65세 이상
        */
        if ($age >= 65) {
            $ageType = 7;
        } else if ($age >= 55) {
            $ageType = 6;
        } else if ($age >= 45) {
            $ageType = 5;
        } else if ($age >= 35) {
            $ageType = 4;
        } else if ($age >= 25) {
            $ageType = 3;
        } else if ($age >= 18) {
            $ageType = 2;
        } else if ($age >= 13) {
            $ageType = 1;
        }
    }

    $data_length = count($data);
    for ($i = 0; $i < $data_length; $i++) {
        //0 = 작품 노출
        if ($data[$i]["log"] == 0) {
            includeWorksImpressions($data[$i]["type"], $data[$i]["workNumber"], $userNumber, $userIp, $language, $location, $gender, $birthYear, $ageType);
        }
        //1 = 작품 방문
        if ($data[$i]["log"] == 1) {
            $workNumber = $data[$i]["workNumber"];
            $type = $data[$i]["type"];

            //유입 URL
            $incomingDomain = null;
            if (isset($data[$i]["incomingUrl"])) {
                $incomingDomain = @getDomainName($data[$i]["incomingUrl"]);
                if ($incomingDomain == "" || $incomingDomain == false) {
                    $incomingDomain = null;
                }
            }

            if ($incomingDomain != null) {
                $type = 3;
            }
            //유입 URL이 louibooks.com 이라면
            if ($incomingDomain == "louibooks.com") {
                $incomingDomain = null;
                $type = 2; //방문 유형 변경: Louibooks에서
            }

            includeWorksVisit($type, $workNumber, $userNumber, $userIp, $language, $location, $gender, $birthYear, $ageType, $incomingDomain);
        }
    }
















    



















    







    



































    //작품 노출
    /*
        type:
            0 = 탐색
            1 = 검색
    */
    function includeWorksImpressions($type, $workNumber, $userNumber = null, $ip = null, $language, $location, $gender = null, $birthYear = null, $ageType = null) {
        global $pdo;

        //필요한 데이터 없음
        if ($userNumber == null && $ip == null) {
            return;
        }
        if ($userNumber != null) {
            $ip = null;
        }

        $stmt = $pdo->prepare("SELECT work_number FROM works_impressions WHERE type = :type AND work_number = :work_number AND (user_number = :user_number OR ip = :ip)");
        $stmt->execute(array(
            ':type' => $type,
            ':work_number' => $workNumber,
            ':user_number' => $userNumber,
            ':ip' => $ip
        ));
        $worksImpressions = $stmt->fetch();

        if (isset($worksImpressions["work_number"]) == false) {
            $newDate = date("Y-m-d H:i:s");

            $sql = $pdo->prepare('insert into works_impressions (type, work_number, user_number, ip, language, location, gender, birth_year, age_type, date) values(:type, :work_number, :user_number, :ip, :language, :location, :gender, :birth_year, :age_type, :date)');
            $sql->execute(array(
                ':type' => $type,
                ':work_number' => $workNumber,
                ':user_number' => $userNumber,
                ':ip' => $ip,
                ':language' => $language,
                ":location" => $location,
                ':gender' => $gender,
                ':birth_year' => $birthYear,
                ':age_type' => $ageType,
                ':date' => $newDate
            ));

            $sql = $pdo->prepare('UPDATE works SET impressions = impressions + 1 WHERE number = :number');
            $sql->execute(array(
                ':number' => $workNumber
            ));
        }
    }
    
    //작품 방문
    /*
        type:
            -1 = 알 수 없음
            0 = 탐색
            1 = 검색
            2 = Louibooks에서
    */
    function includeWorksVisit($type, $workNumber, $userNumber = null, $ip = null, $language, $location, $gender = null, $birthYear = null, $ageType = null, $incomingDomain = null) {
        global $pdo;

        //필요한 데이터 없음
        if ($userNumber == null && $ip == null) {
            return;
        }
        if ($userNumber != null) {
            $ip = null;
        }

        $worksVisit = null;
        if ($incomingDomain != null) {
            $stmt = $pdo->prepare("SELECT work_number FROM works_visit WHERE type = :type AND incoming_domain = :incoming_domain AND work_number = :work_number AND (user_number = :user_number OR ip = :ip)");
            $stmt->execute(array(
                ':type' => $type,
                ':work_number' => $workNumber,
                ':user_number' => $userNumber,
                ':incoming_domain' => $incomingDomain,
                ':ip' => $ip
            ));
            $worksVisit = $stmt->fetch();
        } else {
            $stmt = $pdo->prepare("SELECT work_number FROM works_visit WHERE type = :type AND work_number = :work_number AND (user_number = :user_number OR ip = :ip)");
            $stmt->execute(array(
                ':type' => $type,
                ':work_number' => $workNumber,
                ':user_number' => $userNumber,
                ':ip' => $ip
            ));
            $worksVisit = $stmt->fetch();
        }

        if (isset($worksVisit["work_number"]) == false) {
            $newDate = date("Y-m-d H:i:s");

            $sql = $pdo->prepare('insert into works_visit (type, work_number, user_number, ip, language, location, gender, birth_year, age_type, incoming_domain, date) values(:type, :work_number, :user_number, :ip, :language, :location, :gender, :birth_year, :age_type, :incoming_domain, :date)');
            $sql->execute(array(
                ':type' => $type,
                ':work_number' => $workNumber,
                ':user_number' => $userNumber,
                ':ip' => $ip,
                ':language' => $language,
                ":location" => $location,
                ':gender' => $gender,
                ':birth_year' => $birthYear,
                ':age_type' => $ageType,
                ':incoming_domain' => $incomingDomain,
                ':date' => $newDate
            ));

            $sql = $pdo->prepare('UPDATE works SET visit = visit + 1 WHERE number = :number');
            $sql->execute(array(
                ':number' => $workNumber
            ));
        }
    }

?>