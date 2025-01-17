<?php

    //세션 시작
    @session_start();


    
    $serverDomain = "louibooks.com";
    $serverIp = gethostbyname(gethostname());
    $publicIp = "121.149.138.101";
    $monthlyMoney = 10; //한달 동안의 순이익 (USD)
    $cachePath = "C://inetpub/php/cache";
    $tempPath = "C://inetpub/temp";

    //PG사 관련
    $paymentGatewaySecretKey = array(
        0 => "live_sk_Z0RnYX2w5327PKOZJ1eVNeyqApQE",            //토스페이먼츠
    );



    if (isset($_COOKIE["OTHERACCOUNT"])) {
        $DATA_OTHERACCOUNT = $_COOKIE["OTHERACCOUNT"];
    } else if (isset($_POST["OTHERACCOUNT"])) {
        $DATA_OTHERACCOUNT = $_POST["OTHERACCOUNT"];
    }



    //로그인 키 쿠키에 저장 - 다른 계정으로 로그인
    function saveOtherAccountLoginKey($userNumber, $loginKey) {
        if (isset($_COOKIE["OTHERACCOUNTLOGINKEY"])) {
            $array = array();
            $otherAccount = explode(',', $_COOKIE["OTHERACCOUNTLOGINKEY"]);
            for ($j = 0; $j < count($otherAccount); $j++) {
                $otherAccount2 = explode(':', $otherAccount[$j]);
                if ($userNumber != $otherAccount2[0]) {
                    $array[] = $otherAccount[$j];
                }
            }
            $array[] = ($userNumber . ':' . $loginKey);
            setCookieValue('OTHERACCOUNTLOGINKEY', implode(',', $array));
        } else {
            setCookieValue('OTHERACCOUNTLOGINKEY', ($userNumber . ':' . $loginKey));
        }
    }
    //유저 번호 쿠키에 저장 - 다른 계정으로 로그인
    function saveOtherAccountUserNumber($userNumber) {
        if (isset($_COOKIE["OTHERACCOUNT"])) {
            $array = array();
            $otherAccount = explode(',', $_COOKIE["OTHERACCOUNT"]);
            for ($j = 0; $j < count($otherAccount); $j++) {
                if ($userNumber != $otherAccount[$j]) {
                    $array[] = $otherAccount[$j];
                }
            }
            $array[] = $userNumber;
            setCookieValue('OTHERACCOUNT', implode(',', $array));
        } else {
            setCookieValue('OTHERACCOUNT', $userNumber);
        }
    }

    //랜덤 프로필 생성
    function generateRandomProfile($name) {
        $default_profile = array();
        $colorList = array(
            '#39AEA9', '#C74B50', '#E15FED', '#4D77FF', '#F68989', '#C65D7B', '#D18CE0', '#ECA6A6', '#00C897', '#42C2FF',
            '#AD8B73', '#5463FF', '#BB6464', '#7882A4', '#2666CF', '#54BAB9', '#FA4EAB', '#2EB086', '#7897AB', '#655D8A',
            '#D67D3E', '#FE7E6D', '#F47340', '#D77FA1', '#1C6DD0', '#676FA3', '#F05454', '#C84B31', '#B958A5', '#396EB0'
        );
        $default_profile["random_color"] = $colorList[rand(0, count($colorList) - 1)];
        $default_profile["first_letter"] = mb_substr($name, 0, 1);
        if (preg_match("/[\xA1-\xFE][\xA1-\xFE]/", $default_profile["first_letter"]) == false) {
            $default_profile["first_letter"] = strtoupper($default_profile["first_letter"]);
        }
        $default_profile_json = json_encode($default_profile);
        return $default_profile_json;
    }

    //해당 이메일을 가진 사용자가 존재하는지
    //존재하지 않다면 NULL를 반환한다.
    //존재하면 유저 번호를 반환한다.
    function getUserByEmail($email) {
        global $pdo;

        $stmt = $pdo->prepare("SELECT number FROM user WHERE email = :email");
        $stmt->execute(array(
            "email" => $email
        ));
        $result = $stmt->fetch();

        if (isset($result["number"])) {
            return $result["number"];
        } else {
            return null;
        }
    }
    //로그인 키 생성
    function createLoginKey($userNumber) {
        global $pdo;

        $a = 0;
        $b = 100;
        $strings = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $loginKey = substr(str_shuffle($strings), $a, $b);

        //디바이스 정보
        $deviceInfo = getDeviceInfo();
        //UUID
        $uuid = $deviceInfo["uuid"];
        //기기 유형
        $deviceType = $deviceInfo["deviceType"];
        //어떤 프로그램을 통해 접속하였는지
        $program = $deviceInfo["program"];
        //운영체제 구하기
        $operatingSystem = $deviceInfo["operatingSystem"];

        //위치 정보
        $location = getLocation();

        //현재 날짜
        $date = date("Y-m-d H:i:s");

        //기존에 있던 로그인 키 삭제
        $stmt = $pdo->prepare("DELETE FROM login_key WHERE uuid = :uuid AND user_number = :user_number");
        $stmt->execute(array(
            ':uuid' => $uuid,
            ':user_number' => $userNumber
        ));

        //로그인 키 생성
        $sql = $pdo->prepare('insert into login_key (random_key, user_number, uuid, ip, operating_system, device_type, program, country, region, city, latitude, longitude, last_request_date, first_request_date) values(:random_key, :user_number, :uuid, :ip, :operating_system, :device_type, :program, :country, :region, :city, :latitude, :longitude, :last_request_date, :first_request_date)');
        $sql->execute(array(
            ':random_key' => $loginKey,
            ':user_number' => $userNumber,
            ':uuid' => $uuid,
            ':ip' => getClientIp(),
            ':operating_system' => $operatingSystem,
            ':device_type' => $deviceType,
            ':program' => $program,
            ':country' => $location["country"],
            ':region' => $location["region"],
            ':city' => $location["city"],
            ':latitude' => $location["latitude"],
            ':longitude' => $location["longitude"],
            ':last_request_date' => $date,
            ':first_request_date' => $date
        ));

        return $loginKey;
    }

    //기기 정보 구하기
    function getDeviceInfo() {
        $headers = getallheaders();
        $possibleHeaders = array(
            'HTTP_X_DEVICE_ID',
            'HTTP_X_UNIQUE_ID',
            'HTTP_X_DEVICE_TOKEN',
            'HTTP_X_ANDROID_ID',
            'HTTP_X_IOS_DEVICE_ID',
            'HTTP_X_MS_DEVICE_ID'
        );
        $uuid = null;
        foreach ($possibleHeaders as $header) {
            if (isset($headers[$header])) {
                $uuid = $headers[$header];
                break;
            }
        }
        if ($uuid == null) {
            if (isset($_COOKIE["UUID"])) {
                $uuid = $_COOKIE["UUID"];
            } else {
                function uuidCreate() {
                    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
                        mt_rand(0, 65535),
                        mt_rand(0, 65535),
                        mt_rand(0, 65535),
                        mt_rand(16384, 20479),
                        mt_rand(32768, 49151),
                        mt_rand(0, 65535),
                        mt_rand(0, 65535),
                        mt_rand(0, 65535)
                    );
                }
                $uuid = uuidCreate();
                @setCookieValue('UUID', $uuid);
            }
        }

        //브라우저 정보 가져오기
        $userAgent = $_SERVER['HTTP_USER_AGENT'];
        $browserInfo = getCache("browserInfo", $userAgent);
        if ($browserInfo == null) {
            $browserInfo = get_browser($userAgent, true);
            $json = json_encode($browserInfo);
            setCache("browserInfo", $userAgent, $json);
        } else {
            $browserInfo = json_decode($browserInfo, true);
        }

        //기기 유형
        $deviceType = "unknown";
        if (isset($browserInfo["device_type"])) {
            $deviceType = $browserInfo["device_type"];
            $deviceType = str_replace(" ", "_", $deviceType);
            $deviceType = strtolower($deviceType);
        }

        //어떤 프로그램을 통해 접속하였는지
        $program = "application";
        if (isset($browserInfo["browser"])) {
            $program = $browserInfo["browser"];
            $program = str_replace(" ", "_", $program);
            $program = strtolower($program);
        }

        //운영체제 구하기
        $operatingSystem = $browserInfo["platform"];
        $operatingSystem = strtolower($operatingSystem);
        $operatingSystem = str_replace(" ", "_", $operatingSystem);
        $operatingSystem = getOperatingSystemName($operatingSystem);

        return array(
            'uuid' => $uuid,
            'operatingSystem' => $operatingSystem,
            'deviceType' => $deviceType,
            'program' => $program,
        );
    }

    //운영체제 타입 구하기
    function getOperatingSystemName($platform) {
        $platform = strtolower($platform);
        $operatingSystem = "unknown";

        //윈도우
        if (strpos($platform, "win") !== false) {
            $operatingSystem = "windows";
        }
        //안드로이드
        if ($platform == "android") {
            $operatingSystem = "android";
        }
        //iOS
        if ($platform == "ios") {
            $operatingSystem = "ios";
        }
        //macOS
        if ($platform == "macos") {
            $operatingSystem = "macos";
        }
        //리눅스
        if ($platform == "linux") {
            $operatingSystem = "linux";
        }
        //유닉스
        if ($platform == "unix") {
            $operatingSystem = "unix";
        }
        
        return $operatingSystem;
    }

    //유저의 정보를 반환함
    function getUserInfo($numberList) {
        if ($numberList == '') { return null; } 
        global $pdo;
        $data = array();

        //반환할 유저 수
        $numberList_explode = explode(',', $numberList);
        $numberList_length = count($numberList_explode);

        $select = 'number, admin, nickname, email, adult, gender, birth_year, birth_month, birth_day, default_profile, profile, art, description, works_history_use, search_history_use, reply_notifications_use, activity_notifications_use, louibooks_notifications_use, user_list_save_count, not_confirm_notifications, community_permission, creator_permission, partner, animator, rigorous_access_procedures, premium_viewed, two_factor_auth_key';

        if ($numberList_length > 1) {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM user WHERE number IN (" . $numberList . ") ORDER BY FIELD(number, " . $numberList . ")");
            $stmt->execute();
            $result = $stmt->fetchAll();   $result_length = count($result);
        } else {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM user WHERE number = :number");
            $stmt->execute(array(
                "number" => $numberList
            ));
            $result = $stmt->fetchAll();   $result_length = count($result);
        }

        //전체 클라우드 파일 용량
        $stmt = $pdo->prepare("SELECT user_number, SUM(size) FROM cloud WHERE type != 0 AND user_number IN (" . $numberList . ")");
        $stmt->execute();
        $cloudFileSizeInfo = $stmt->fetchAll();
        $cloudFileSizeInfo_length = count($cloudFileSizeInfo);
        $cloudFileSize = array();
        for ($i = 0; $i < $cloudFileSizeInfo_length; $i++) {
            $cloudFileSize[$cloudFileSizeInfo[$i]["user_number"]] = $cloudFileSizeInfo[$i][1];
        }

        //사용자 등급 정보
        $rankInfoData = getUserRankInfo($numberList_explode);
        $rankInfoData_count = count($rankInfoData);
        $rankInfo = array();
        for ($i = 0; $i < $rankInfoData_count; $i++) {
            $rankInfo[$rankInfoData[$i]["userNumber"]] = $rankInfoData[$i];
        }

        $resultArray = array();
        for ($i = 0; $i < $result_length; $i++) {
            $result_i = array();
            foreach($result[$i] as $key => $value) {
                if (is_int($key) == false) {
                    $result_i[$key] = $value;
                }
            }

            //사용자 등급 정보
            $result_i["rankInfo"] = $rankInfo[$result_i["number"]];

            //클라우드 정보
            $useSize = 0;
            if (isset($cloudFileSize[$result_i["number"]])) {
                $useSize = $cloudFileSize[$result_i["number"]];
            }
            $maxSize = (1024 * 10); //10MB
            if ($result_i["rankInfo"]["rank"] == 5) {
                $maxSize = 999999999999; //프리미엄
            }
            $result_i["cloud"] = array(
                "maxSize" => $maxSize,
                "useSize" => $useSize
            );

            //프로필 정보
            $result_i["profile"] = getUserProfile($result_i);

            //아트 정보
            if (isset($result_i["art"])) {
                $artInfo = json_decode($result_i["art"], true);

                $url = $artInfo["url"];
                $type = $artInfo["type"];
                if ($artInfo["type"] == "video" && $result_i["rankInfo"]["rank"] != 5) {
                    $url = $artInfo["thumbnail"];
                    $type = "image";
                }

                if ($type == "image") {
                    $artInfo = array(
                        "type" => "image",
                        "url" => $url,
                        "width" => $artInfo["width"],
                        "height" => $artInfo["height"]
                    );
                } else if ($type == "video") {
                    $artInfo = array(
                        "type" => "video",
                        "url" => $url,
                        "width" => $artInfo["width"],
                        "height" => $artInfo["height"]
                    );
                }

                $result_i["art"] = $artInfo;
            }

            //닉네임
            if ($result_i["admin"] == false) {
                $result_i["nickname"] = str_ireplace("Louibooks", "Impersonator", $result_i["nickname"]);
                $result_i["nickname"] = str_ireplace("Louibook", "Impersonator", $result_i["nickname"]);
                $result_i["nickname"] = str_ireplace("루이북스", "사칭", $result_i["nickname"]);
                $result_i["nickname"] = str_ireplace("루이북", "사칭", $result_i["nickname"]);
            }

            $result_i["status"] = 0;
            $resultArray[$result_i["number"]] = $result_i;
        }

        $data = array();
        for ($i = 0; $i < $numberList_length; $i++) {
            if (isset($resultArray[$numberList_explode[$i]])) {
                $data[] = $resultArray[$numberList_explode[$i]];
            } else {
                $data[] = array(
                    'status' => 1, //삭제됨
                    'nickname' => getLanguage("user_not_found"),
                    'profile' => array(
                        "type" => "default",
                        "info" => array(
                            "random_color" => "#000000",
                            "first_letter" => "🤔"
                        )
                    ),
                    'art' => null,
                    'partner' => 0,
                    'user_list_save_count' => 0,
                    'number' => $numberList_explode[$i]
                );
            }
        }

        return $data;
    }

    //사용자 삭제
    function deleteUser($userNumber) {
        global $pdo;

        //모든 작품 삭제
        $stmt = $pdo->prepare("SELECT number FROM works where user_number = :user_number");
        $stmt->execute(array(
            ':user_number' => $userNumber
        ));
        $works = $stmt->fetchAll();
        $works_length = count($works);
        for ($i = 0; $i < $works_length; $i++) {
            deleteWork($works[$i]["number"]);
        }
        
        //모든 작품 목록 삭제
        $stmt = $pdo->prepare("SELECT number FROM work_list WHERE user_number = :user_number");
        $stmt->execute(array(
            ':user_number' => $userNumber
        ));
        $workList = $stmt->fetchAll();
        $workList_length = count($workList);
        for ($i = 0; $i < $workList_length; $i++) {
            deleteWorkList($workList[$i]["number"]);
        }

        //모든 커뮤니티 기록 삭제
        deleteAllCommunityHistory($userNumber);

        //모든 유저 저장 삭제
        $stmt = $pdo->prepare("SELECT saved_user_number FROM user_list WHERE user_number = :user_number");
        $stmt->execute(array(
            ':user_number' => $userNumber
        ));
        $userList = $stmt->fetchAll();
        $userList_length = count($userList);
        for ($i = 0; $i < $userList_length; $i++) {
            deleteSaveUserList($userNumber, $userList[$i]["saved_user_number"]);
        }
        $stmt = $pdo->prepare("DELETE FROM user_list WHERE saved_user_number = :saved_user_number");
        $stmt->execute(array(
            ':saved_user_number' => $userNumber
        ));

        //유저 캐시 삭제
        $stmt = $pdo->prepare("DELETE FROM user_notifications WHERE user_number = :user_number");
        $stmt->execute(array(
            ':user_number' => $userNumber
        ));

        //알림 삭제
        $stmt = $pdo->prepare("DELETE FROM user_cache WHERE user_number = :user_number");
        $stmt->execute(array(
            ':user_number' => $userNumber
        ));
        //메세지 토큰 삭제
        $stmt = $pdo->prepare("DELETE FROM messaging_token WHERE user_number = :user_number");
        $stmt->execute(array(
            ':user_number' => $userNumber
        ));

        //클라우드 파일 삭제
        $stmt = $pdo->prepare("DELETE FROM cloud WHERE user_number = :user_number");
        $stmt->execute(array(
            ':user_number' => $userNumber
        ));

        //회차 기록 비공개로 전환
        $sql = $pdo->prepare("UPDATE work_part_viewed SET public_status = 1 WHERE user_number = :user_number");
        $sql->execute(array(
            ':user_number' => $userNumber
        ));

        //결제 내역 삭제
        $stmt = $pdo->prepare("SELECT number FROM payment_history WHERE user_number = :user_number");
        $stmt->execute(array(
            ':user_number' => $userNumber
        ));
        $paymentHistory = $stmt->fetchAll();
        $paymentHistory_length = count($paymentHistory);
        for ($i = 0; $i < $paymentHistory_length; $i++) {
            deletePayment($paymentHistory[$i]["number"]);
        }
        //주문 정보 삭제
        $stmt = $pdo->prepare("DELETE FROM payment_order WHERE user_number = :user_number");
        $stmt->execute(array(
            ':user_number' => $userNumber
        ));

        //유저 정보 삭제
        $stmt = $pdo->prepare("DELETE FROM user WHERE number = :number");
        $stmt->execute(array(
            ':number' => $userNumber
        ));
    }
    function deleteAllCommunityHistory($userNumber) {
        global $pdo;

        //커뮤니티 게시물 삭제
        $stmt = $pdo->prepare("SELECT number FROM community WHERE user_number = :user_number");
        $stmt->execute(array(
            ':user_number' => $userNumber
        ));
        $community = $stmt->fetchAll();
        $community_length = count($community);
        for ($j = 0; $j < $community_length; $j++) {
            deleteCommunity($community[$j]["number"]);
        }

        //댓글 삭제 - 답글
        $stmt = $pdo->prepare("SELECT number FROM comments WHERE user_number = :user_number AND reply_number is NOT NULL");
        $stmt->execute(array(
            ':user_number' => $userNumber
        ));
        $comments = $stmt->fetchAll();
        $comments_length = count($comments);
        for ($j = 0; $j < $comments_length; $j++) {
            deleteComments($comments[$j]["number"]);
        }
        //댓글 삭제
        $stmt = $pdo->prepare("SELECT number FROM comments WHERE user_number = :user_number");
        $stmt->execute(array(
            ':user_number' => $userNumber
        ));
        $comments = $stmt->fetchAll();
        $comments_length = count($comments);
        for ($j = 0; $j < $comments_length; $j++) {
            deleteComments($comments[$j]["number"]);
        }

        //평가 및 리뷰 삭제
        $stmt = $pdo->prepare("SELECT number FROM ratings WHERE user_number = :user_number");
        $stmt->execute(array(
            ':user_number' => $userNumber
        ));
        $ratings = $stmt->fetchAll();
        $ratings_length = count($ratings);
        for ($j = 0; $j < $ratings_length; $j++) {
            deleteRatings($ratings[$j]["number"]);
        }
    }

    $myUserInfo = null;
    function getMyLoginInfo() {
        global $myUserInfo, $pdo, $DATA_OTHERACCOUNT, $originalKey;
        $data = array();

        //이미 데이터가 있으면
        if ($myUserInfo != null) {
            return $myUserInfo;
        }

        //PHP 백그라운드 실행인지
        $isLocal = false;
        if (isset($_POST["key"]) && $_POST["key"] == $originalKey) {
            $isLocal = true;
        }
    
        //자동 로그인
        $loginKey = null;
        if (isset($_POST["loginKey"])) {
            $loginKey = $_POST["loginKey"];
        } else if (isset($_COOKIE["LOGINKEY"])) {
            $loginKey = $_COOKIE["LOGINKEY"];
        }
        if ($loginKey != null) {
            $stmt = $pdo->prepare("SELECT number, user_number, uuid, ip, latitude, longitude, security_issue FROM login_key WHERE random_key = :random_key");
            $stmt->execute(array(
                ':random_key' => $loginKey
            ));
            $result = $stmt->fetchAll();
            $result_length = count($result);
            for ($i = 0; $i < $result_length; $i++) {
                $sessionNumber = $result[$i]["number"];
                $userNumber = $result[$i]["user_number"];

                //쿠키 값 갱신
                @setCookieValue('LOGINKEY', $_COOKIE["LOGINKEY"], time() + 86400 * 30, '/');

                //마지막 요청 날짜 수정
                $date = date("Y-m-d H:i:s");
                $sql = $pdo->prepare('UPDATE login_key SET last_request_date = :last_request_date WHERE random_key = :random_key AND user_number = :user_number');
                $sql->execute(array(
                    ':last_request_date' => $date,
                    ':random_key' => $loginKey,
                    ':user_number' => $userNumber
                ));

                //보안 문제 관련
                $stmt = $pdo->prepare("SELECT rigorous_access_procedures FROM user WHERE number = :number");
                $stmt->execute(array(
                    ':number' => $userNumber
                ));
                $rigorousAccessProcedures = $stmt->fetch();
                if ($isLocal == false && isset($rigorousAccessProcedures["rigorous_access_procedures"])) {
                    $rigorousAccessProcedures = $rigorousAccessProcedures["rigorous_access_procedures"];
                    $deviceInfo = getDeviceInfo();
                    $isSecurityIssue = false;

                    //디바이스 정보가 동일한지
                    if ($rigorousAccessProcedures == 1 || $rigorousAccessProcedures == 2) {
                        if ($deviceInfo["uuid"] != $result[$i]["uuid"]) {
                            $loginKey = null;
                            $isSecurityIssue = true;
                        }
                    }

                    //위치 정보가 동일한지
                    if ($rigorousAccessProcedures == 2) {
                        $location = getLocation();
                        if ($result[$i]["latitude"] != $location["latitude"] || $result[$i]["longitude"] != $location["longitude"]) {
                            $loginKey = null;
                            $isSecurityIssue = true;
                        }
                    }

                    //아이피가 동일한지
                    if ($rigorousAccessProcedures == 3) {
                        $clientIp = getClientIp();
                        if ($result[$i]["ip"] != $clientIp) {
                            $loginKey = null;
                            $isSecurityIssue = true;
                        }
                    }

                    if ($isSecurityIssue == true && $result[$i]["security_issue"] == false) {
                        $sql = $pdo->prepare("UPDATE login_key SET security_issue = 1 WHERE number = :number");
                        $sql->execute(array(
                            ':number' => $sessionNumber
                        ));
                        requestUserNotificationsSecurityIssue($userNumber, $sessionNumber);
                    }

                    if ($isSecurityIssue == true) {
                        $userNumber = null;
                    }

                }

                continue;
            }
        }
    
        //세션 로그인
        if (isset($_SESSION["userNumber"])) {
            $userNumber = $_SESSION["userNumber"];
        }
        //로컬 로그인
        if ($isLocal == true && isset($_POST["loginNumber"])) {
            $userNumber = $_POST["loginNumber"];
        }

        if (isset($userNumber)) {
            $data["isLogin"] = true;

            $info = getUserInfo($userNumber)[0];
            foreach ($info as $key => $value) {
                $data[$key] = $value;
            }
        } else {
            $data["isLogin"] = false;
        }

        //다른 계정 로그인
        if (isset($DATA_OTHERACCOUNT)) {
            if ($data["isLogin"] == true) {
                $userList = array();
                $array = explode(',', $DATA_OTHERACCOUNT);
                for ($i = 0; $i < count($array); $i++) {
                    if ($array[$i] != $info["number"]) {
                        $userList[] = $array[$i];
                    }
                }
                $otherAccount = getUserInfo(implode(',', $userList));
            } else {
                $otherAccount = getUserInfo($DATA_OTHERACCOUNT);
            }
            if ($otherAccount != null) {
                $newArray = array();
                $otherAccount_length = count($otherAccount);
                for ($i = 0; $i < $otherAccount_length; $i++) {
                    if ($otherAccount[$i]["status"] == 0) {
                        $newArray[] = $otherAccount[$i];
                    }
                }

                $data["otherAccount"] = $newArray;
                $data["otherAccount"] = array_reverse($data["otherAccount"]);
            }
        }

        //다른 계정 로그인 - 바로 전환
        if (isset($data["otherAccount"]) && isset($_COOKIE["OTHERACCOUNTLOGINKEY"])) {
            $otherAccountLoginkey = explode(',', $_COOKIE["OTHERACCOUNTLOGINKEY"]);
            for ($i = 0; $i < count($otherAccountLoginkey); $i++) {
                $array = explode(':', $otherAccountLoginkey[$i]);
                $otherAccount = $data["otherAccount"];
                for ($j = 0; $j < count($otherAccount); $j++) {
                    if ($array[0] == $otherAccount[$j]["number"]) {
                        $data["otherAccount"][$j]["isLogged"] = true;
                        $data["otherAccount"][$j]["loginKey"] = $array[1];
                    }
                }
            }
        }

        //그 외 정보
        if ($data["isLogin"] == true) {
            //작품 개수
            $stmt = $pdo->prepare("SELECT COUNT(number) FROM works where user_number = :user_number");
            $stmt->execute(array(
                ':user_number' => $data["number"],
            ));
            $data["workspace"]["countWorks"] = $stmt->fetch()[0];
        }

        //거주하고 있는 나라
        $location = getLocation()["country"];
        $data["location"] = $location;

        if ($data["isLogin"] == true) {
            $last_login_date = date("Y-m-d H:i:s");
            //최근 로그인 날짜
            $sql = $pdo->prepare('UPDATE user SET last_login_date = :last_login_date WHERE number = :number');
            $sql->execute(array(
                ':last_login_date' => $last_login_date,
                ':number' => $data["number"]
            ));
        }
        
        if ($data["isLogin"] == true && $data["status"] == 1) {
            $data["isLogin"] = false;
        }

        $myUserInfo = $data;
        return $data;
    }
    
    /*
        필요한 유저 정보
        number, default_profile
    */
    function getUserProfile($userInfo) {
        global $pdo;

        $data = array();

        //유저 프로필
        if (isset($userInfo["profile"]) == false) {
            $data["type"] = 'default';
        } else {
            $data["type"] = 'custom';
        }
        if ($data["type"] == "default") {
            $default_profile = json_decode($userInfo["default_profile"], true);
            $data["info"] = array(
                "random_color" => $default_profile["random_color"],
                "first_letter" => $default_profile["first_letter"],
            );
        } else if ($data["type"] == "custom") {
            $info = json_decode($userInfo["profile"], true);

            $rank = 0;
            if (isset($userInfo["rankInfo"])) {
                $rank = $userInfo["rankInfo"]["rank"];
            }

            //
            if ($info["type"] == "video" && $rank == 5) {
                $info = array(
                    "type" => "video",
                    "url" => $info["url"],
                    "resize" => $info["resize"],
                    "translateY" => $info["translateY"],
                    "translateX" => $info["translateX"],
                    "width" => $info["width"],
                    "height" => $info["height"]
                );
            } else {
                $url = "";
                if ($info["type"] == "video") {
                    $url = $info["thumbnail"];
                } else {
                    $url = $info["url"];
                }
                $info = array(
                    "type" => "image",
                    "url" => $url,
                    "resize" => $info["resize"],
                    "translateY" => $info["translateY"],
                    "translateX" => $info["translateX"],
                    "width" => $info["width"],
                    "height" => $info["height"]
                );
            }

            $data["info"] = $info;
        }

        return $data;
    }









    /*
        작품 정보를 반환함
    */
    function getWorkInfo($numberList) {
        if ($numberList == '') { return null; }
        global $pdo, $myUserInfo;
        if (isset($myUserInfo) == false) {
            $myUserInfo = getMyLoginInfo();
        }

        //사용자 언어
        $userLanguage = null;
        if (isset($_POST["lang"])) {
            $userLanguage = $_POST["lang"];
        }

        //
        $numberList = explode(',', $numberList);
        $numberList_implode = implode(",", $numberList);
        $numberList_length = count($numberList);

        $select = 'number, user_number, type, contents_type, title, chapter, description, public_status, user_age, cover_image, default_cover_image, art_image, views, part, original_language, localization_language, genre, creation_date, creator_violation_date';

        if ($numberList_length > 1) {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM works WHERE number IN (" . $numberList_implode . ") ORDER BY FIELD(number, " . $numberList_implode . ")");
            $stmt->execute();
            $result = $stmt->fetchAll();   $result_length = count($result);
        } else {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM works WHERE number = :number");
            $stmt->execute(array(
                "number" => $numberList[0],
            ));
            $result = $stmt->fetchAll();   $result_length = count($result);
        }

        //유저 정보
        $userNumbers = array();
        for ($i = 0; $i < $result_length; $i++) {
            $userNumbers[] = $result[$i]["user_number"];
        }
        $userArray = array();
        if (count($userNumbers) != 0) {
            $userInfo = getUserInfo(implode(',', $userNumbers));
            $userInfo_count = count($userInfo);
            for ($i = 0; $i < $userInfo_count; $i++) {
                $userArray[$userInfo[$i]["number"]] = $userInfo[$i];
            }
        }

        //현지화 정보
        $localizationInfo = array();
        if ($userLanguage != null) {
            $stmt = $pdo->prepare("SELECT work_number, cover_image, title, description FROM work_localization WHERE work_number IN (" . $numberList_implode . ") AND language = :language");
            $stmt->execute(array(
                "language" => $userLanguage
            ));
            $workLocalization = $stmt->fetchAll();
            $workLocalization_length = count($workLocalization);

            for ($i = 0; $i < $workLocalization_length; $i++) {
                $workNumber = $workLocalization[$i]["work_number"];
                $localizationInfo[$workNumber] = $workLocalization[$i];
            }
        }

        //알림 설정
        $notificationsSettings = array();
        if ($myUserInfo["isLogin"] == true) {
            $stmt = $pdo->prepare("SELECT work_number, type FROM work_notifications_settings WHERE user_number = :user_number AND work_number IN (" . $numberList_implode . ")");
            $stmt->execute(array(
                "user_number" => $myUserInfo["number"]
            ));
            $workNotifications = $stmt->fetchAll();
            $workNotifications_length = count($workNotifications);

            for ($i = 0; $i < $workNotifications_length; $i++) {
                $notificationsSettings[$workNotifications[$i]["work_number"]] = $workNotifications[$i]["type"];
            }
        }

        //평점 구하기
        $ratingsAnalysisInfo = getRatingsAnalysisInfo($numberList_implode);
        $ratingsAnalysisInfo_length = count($ratingsAnalysisInfo);
        $ratingsAnalysisArray = array();
        for ($i = 0; $i < $ratingsAnalysisInfo_length; $i++) {
            $ratingsAnalysisArray[$ratingsAnalysisInfo[$i]["workNumber"]] = $ratingsAnalysisInfo[$i];
        }

        //현재 시간 구하기
        $newDate = date("Y-m-d H:i:s");

        $resultArray = array();
        for ($i = 0; $i < $result_length; $i++) {
            $result_i = array();
            foreach($result[$i] as $key => $value) {
                if (is_int($key) == false) {
                    $result_i[$key] = $value;
                }
            }

            $publicStatus = $result_i["public_status"];
            //가이드를 위반한 날짜와 일주일 이하로 차이나면 나면
            if (isset($result_i["creator_violation_date"]) && getTimeDifference($result_i["creator_violation_date"], $newDate) < 604800) {
                $publicStatus = 2; //비공개로 전환
            }
            unset($result_i["creator_violation_date"]);

            if ($publicStatus != 2 || ($myUserInfo["isLogin"] == true && $myUserInfo["number"] == $result_i["user_number"])) {
                $result_i["status"] = 0;

                $originator = $userArray[$result_i["user_number"]];
                $originatorInfo = array(
                    'number' => $originator["number"],
                    'nickname' => $originator["nickname"],
                    'profile' => $originator["profile"],
                    'partner' => $originator["partner"],
                    'userSaved' => $originator["user_list_save_count"]
                );
                $result_i["originator"] = $originatorInfo;

                //커버 이미지
                $cover_image = "";
                if (isset($result_i["cover_image"])) {
                    $cover_image = $result_i["cover_image"];
                } else {
                    $cover_image = $result_i["default_cover_image"];
                }
                $result_i["cover_image"] = $cover_image;
                $result_i["default_cover_image"] = null;

                //현지화
                if (isset($localizationInfo[$result_i["number"]])) {
                    $info = $localizationInfo[$result_i["number"]];
                    $result_i["title"] = $info["title"];
                    $result_i["description"] = $info["description"];

                    if (isset($info["cover_image"])) {
                        $result_i["cover_image"] = $info["cover_image"];
                    }
                }

                //알림 설정
                if (isset($notificationsSettings[$result_i["number"]])) {
                    $result_i["notifications_settings"] = $notificationsSettings[$result_i["number"]];
                } else {
                    $result_i["notifications_settings"] = 0;
                }

                //평점
                $result_i["ratings"] = array(
                    "count" => $ratingsAnalysisArray[$result_i["number"]]["count"],
                    "averageScore" => $ratingsAnalysisArray[$result_i["number"]]["average"]
                );
                
                //성인 작품
                if ($result_i["user_age"] == 2 && ($myUserInfo["isLogin"] == false || $myUserInfo["adult"] == false)) {
                    if (($myUserInfo["isLogin"] == false || ($myUserInfo["isLogin"] == true && $myUserInfo["number"] != $result_i["user_number"])) && $myUserInfo["location"] == "kr") {
                        $result_i["disable_adult"] = true;
                    } else {
                        //해외
                        if (($myUserInfo["isLogin"] == false || ($myUserInfo["isLogin"] == true && $myUserInfo["number"] != $result_i["user_number"]))) {
                            $result_i["adult_questions"] = true;
                        }
                    }
                }
    
                $resultArray[$result_i["number"]] = $result_i;
            } else {
                $resultArray[$result_i["number"]] = array(
                    'status' => 1,
                    'number' => $numberList[$i]
                );
            }
        }

        $data = array();
        for ($i = 0; $i < $numberList_length; $i++) {
            if (isset($resultArray[$numberList[$i]])) {
                $data[] = $resultArray[$numberList[$i]];
            } else {
                $data[] = array(
                    'status' => 2,
                    'number' => $numberList[$i]
                );
            }
        }

        return $data;
    }

    function deleteWork($workNumber) {
        global $pdo;

        //회차 삭제
        $stmt = $pdo->prepare("SELECT number FROM work_part WHERE work_number = :work_number ORDER BY number DESC");
        $stmt->execute(array(
            ":work_number" => $workNumber
        ));
        $part = $stmt->fetchAll();
        $part_length = count($part);
        for ($i = 0; $i < $part_length; $i++) {
            $partNumber = $part[$i]["number"];
            deleteWorkPart($partNumber);
        }

        //커뮤니티 게시물 삭제
        $stmt = $pdo->prepare("DELETE FROM community WHERE uid = :uid");
        $stmt->execute(array(
            ':uid' => "work_" . $workNumber
        ));
        //커뮤니티 게시물 삭제 - COUNT
        $stmt = $pdo->prepare("DELETE FROM community_count WHERE uid = :uid");
        $stmt->execute(array(
            ':uid' => "work_" . $workNumber
        ));
        //평가 및 리뷰 삭제
        $stmt = $pdo->prepare("DELETE FROM ratings WHERE work_number = :work_number");
        $stmt->execute(array(
            ':work_number' => $workNumber
        ));
        //작품 신고 삭제
        $stmt = $pdo->prepare("DELETE FROM works_report WHERE work_number = :work_number");
        $stmt->execute(array(
            ':work_number' => $workNumber
        ));
        //작품 캐시 삭제
        $stmt = $pdo->prepare("DELETE FROM works_cache WHERE work_number = :work_number");
        $stmt->execute(array(
            ':work_number' => $workNumber
        ));
        //작품 현지화 삭제
        $stmt = $pdo->prepare("DELETE FROM work_localization WHERE work_number = :work_number");
        $stmt->execute(array(
            ':work_number' => $workNumber
        ));

        //작품 삭제
        $stmt = $pdo->prepare("DELETE FROM works WHERE number = :number");
        $stmt->execute(array(
            ':number' => $workNumber
        ));
    }

    function deleteWorkPart($partNumber) {
        global $pdo, $serverIp, $originalKey;

        //본인이 맞는지
        $stmt = $pdo->prepare("SELECT data, type, work_number, public_status, views FROM work_part where number = :number");
        $stmt->execute(array(
            ':number' => $partNumber
        ));
        $partInfo = $stmt->fetch();

        $stmt = $pdo->prepare("SELECT number, chapter FROM works WHERE number = :number");
        $stmt->execute(array(
            ':number' => $partInfo["work_number"],
        ));
        $workInfo = $stmt->fetch();

        //최신 회차인지
        $stmt = $pdo->prepare("SELECT number, chapter, category FROM work_part WHERE work_number = :work_number ORDER BY chapter DESC, number DESC LIMIT 2");
        $stmt->execute(array(
            ':work_number' => $partInfo["work_number"]
        ));
        $latestNumber = $stmt->fetchAll();

        if ($partNumber == $latestNumber[0]["number"]) {
            //동영상 회차일 경우
            if ($partInfo["type"] == "video") {
                $stmt = $pdo->prepare("DELETE FROM video_encoding WHERE part_number = :part_number");
                $stmt->execute(array(
                    ':part_number' => $partNumber
                ));
            }

            $stmt = $pdo->prepare("DELETE FROM work_part WHERE number = :number");
            $stmt->execute(array(
                ':number' => $partNumber
            ));

            $latestChapter = null;
            if (isset($latestNumber[1]["chapter"]) == false) {
                $latestChapter = 0;
            } else {
                $latestChapter = $latestNumber[1]["chapter"];
            }

            //챕터 수 조정
            $sql = $pdo->prepare('UPDATE works SET chapter = :chapter WHERE number = :number');
            $sql->execute(array(
                ':number' => $partInfo["work_number"],
                ':chapter' => $latestChapter
            ));

            //회차 수 낮추기
            if ($partInfo["public_status"] == 0) {
                $sql = $pdo->prepare('UPDATE works SET part = part - 1 WHERE number = :number');
                $sql->execute(array(
                    ':number' => $partInfo["work_number"]
                ));
            }

            //완결 개수 삭제
            if ($partInfo["public_status"] == 0) {
                if ($latestNumber[0]["category"] == "ending") {
                    $sql = $pdo->prepare('UPDATE works SET ending = ending - 1 WHERE number = :number');
                    $sql->execute(array(
                        ':number' => $workInfo["number"],
                    ));
                }
            }

            //챕터 제목 정보 삭제
            if ($workInfo["chapter"] != $latestChapter) {
                $stmt = $pdo->prepare("DELETE FROM work_chapter WHERE work_number = :work_number AND chapter = :chapter");
                $stmt->execute(array(
                    ':work_number' => $workInfo["number"],
                    ':chapter' => $workInfo["chapter"]
                ));
            }

            //회차 현지화 정보 삭제
            $stmt = $pdo->prepare("DELETE FROM work_part_localization WHERE part_number = :part_number");
            $stmt->execute(array(
                ':part_number' => $partNumber
            ));

            //댓글 삭제
            $stmt = $pdo->prepare("DELETE FROM comments WHERE uid = :uid");
            $stmt->execute(array(
                ':uid' => "part_" . $partNumber
            ));
            //댓글 삭제 - COUNT
            $stmt = $pdo->prepare("DELETE FROM comments_count WHERE uid = :uid");
            $stmt->execute(array(
                ':uid' => "part_" . $partNumber
            ));

            //작품 조회수 감소
            if ($partInfo["public_status"] == 0) {
                $sql = $pdo->prepare('UPDATE works SET views = views - :views WHERE number = :number');
                $sql->execute(array(
                    ':number' => $workInfo["number"],
                    ':views' => $partInfo["views"]
                ));
            }
        } else {
            echo 'not the latest part';
            exit;
        }

        if (count($latestNumber) >= 2) {
            $data = array(
                'latest_number' => $latestNumber[1]["number"],
                'latest_chapter' => $latestNumber[1]["chapter"],
            );
            echo json_encode($data);
        } else {
            echo 'null';
        }
    }

    /*
        작품 회차 정보를 반환함
        isContentsInfo = 콘텐츠 내용 반환 여부
    */
    function getWorkPartInfo($numberList, $lang = null, $isContentsInfo = false) {
        if ($numberList == '') { return null; }
        global $pdo, $userInfo;
        $data = array();

        if (isset($userInfo) == false) {
            $userInfo = getMyLoginInfo();
        }

        //사용자 언어
        $userLanguage = null;
        if (isset($_POST["lang"]) && $lang != "original") {
            $userLanguage = $_POST["lang"];

            if ($lang != null) {
                $userLanguage = $lang;
            }
        }

        //반환할 수
        $numberList_array = explode(',', $numberList);
        $numberList_length = count($numberList_array);

        $select = 'number, work_number, type, user_number, title, chapter, category, episode, upload_date, views, thumbnail_image, public_status, original_language, localization_language, size';
        if ($isContentsInfo == true) {
            $select .= ', data';
        }

        if ($numberList_length > 1) {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM work_part WHERE number IN (" . $numberList . ") ORDER BY FIELD(number, " . $numberList . ")");
            $stmt->execute();
            $result = $stmt->fetchAll();   $result_length = count($result);
        } else {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM work_part WHERE number = :number");
            $stmt->execute(array(
                "number" => $numberList,
            ));
            $result = $stmt->fetchAll();   $result_length = count($result);
        }

        //회차를 봤는지
        $partViews = null;
        $userIp = getClientIp();
        if ($userInfo["isLogin"] == true) {
            $stmt = $pdo->prepare("SELECT part_number, percent FROM work_part_viewed WHERE part_number IN (" . $numberList . ") AND user_number = :user_number AND public_status = 0");
            $stmt->execute(array(
                ':user_number' => $userInfo["number"],
            ));
            $partViewed = $stmt->fetchAll();
        } else {
            $stmt = $pdo->prepare("SELECT part_number, percent FROM work_part_viewed WHERE part_number IN (" . $numberList . ") AND ip = :ip AND public_status = 0");
            $stmt->execute(array(
                ':ip' => $userIp,
            ));
            $partViewed = $stmt->fetchAll();
        }
        $viewsInfo = array();
        $viewsPercentInfo = array();
        $partViewed_length = count($partViewed);
        for ($i = 0; $i < $partViewed_length; $i++) {
            $viewsInfo[$partViewed[$i]["part_number"]] = true;
            $viewsPercentInfo[$partViewed[$i]["part_number"]] = $partViewed[$i]["percent"];
        }

        //가져올 댓글
        $commentsUid = array();
        for ($i = 0; $i < $result_length; $i++) {
            $commentsUid[] = '"part_' . $result[$i]["number"] . '"';
        }
        $commentsCount = array();
        if (count($commentsUid) != 0) {
            //댓글 갯수
            $stmt = $pdo->prepare("SELECT uid, count FROM comments_count WHERE uid IN (" . implode(',', $commentsUid) . ")");
            $stmt->execute();
            $commentsInfo = $stmt->fetchAll();
            $commentsInfo_length = count($commentsInfo);
            for ($i = 0; $i < $commentsInfo_length; $i++) {
                $commentsData = $commentsInfo[$i];
                $commentsCount[$commentsData["uid"]] = $commentsData["count"];
            }
        }

        //현지화 정보
        $localizationInfo = array();
        if ($userLanguage != null) {
            $select = 'part_number, thumbnail_image, title, language, size';
            if ($isContentsInfo == true) {
                $select .= ', data';
            }
            $stmt = $pdo->prepare("SELECT " . $select . " FROM work_part_localization WHERE part_number IN (" . $numberList . ") AND language = :language");
            $stmt->execute(array(
                "language" => $userLanguage
            ));
            $partLocalization = $stmt->fetchAll();
            $partLocalization_length = count($partLocalization);

            for ($i = 0; $i < $partLocalization_length; $i++) {
                $partNumber = $partLocalization[$i]["part_number"];
                $localizationInfo[$partNumber] = $partLocalization[$i];
            }
        }

        //타입이 비디오일 경우 data를 가져온다.
        $partData = array();
        if ($isContentsInfo == false) {
            $dataNumbers = array();
            for ($i = 0; $i < $result_length; $i++) {
                if ($result[$i]["type"] == "video") {
                    $dataNumbers[] = $result[$i]["number"];
                }
            }
            $dataNumbers_length = count($dataNumbers);

            if ($dataNumbers_length != 0) {
                $stmt = $pdo->prepare("SELECT number, data FROM work_part WHERE number IN (" . implode(",", $dataNumbers) . ")");
                $stmt->execute();
                $workPart = $stmt->fetchAll();
                $workPart_length = count($workPart);

                for ($i = 0; $i < $workPart_length; $i++) {
                    $partData[$workPart[$i]["number"]] = json_decode($workPart[$i]["data"], true);
                }
            }
        }

        //작품 정보
        $workInfo = array();
        $workNumbers = array();
        for ($i = 0; $i < $result_length; $i++) {
            $workNumbers[] = $result[$i]["work_number"];
        }
        $workNumbers = array_unique($workNumbers);
        if (count($workNumbers) != 0) {
            $workInfo = getWorkInfo(implode(",", $workNumbers));
            $workInfo_length = count($workInfo);
            for ($i = 0; $i < $workInfo_length; $i++) {
                $workInfo[$workInfo[$i]["number"]] = $workInfo[$i];
            }
            $stmt = $pdo->prepare("SELECT number, monetization FROM works WHERE number IN (" . implode(",", $workNumbers) . ")");
            $stmt->execute();
            $works = $stmt->fetchAll();
            $works_length = count($works);
            for ($i = 0; $i < $works_length; $i++) {
                $workInfo[$works[$i]["number"]]["monetization"] = $works[$i]["monetization"];
            }
        }

        //현재 시간 구하기
        $newDate = date("Y-m-d H:i:s");

        $resultArray = array();
        for ($i = 0; $i < $result_length; $i++) {
            $result_i = array();
            foreach($result[$i] as $key => $value) {
                if (is_int($key) == false) {
                    $result_i[$key] = $value;
                }
            }

            //작품이 비공개면
            if (isset($workInfo[$result_i["work_number"]])) {
                if ($workInfo[$result_i["work_number"]]["status"] == 1) {
                    $resultArray[$result_i["number"]] = array(
                        'status' => 1,
                        'number' => $numberList_array[$i]
                    );
                    continue;
                }
            }

            if ($result_i["public_status"] != 2 || ($userInfo["isLogin"] == true && $result_i["user_number"] == $userInfo["number"])) {
                $result_i["status"] = 0;
                
                if (isset($result_i["data"])) {
                    if ($result_i["type"] != "video") {
                        $result_i["data"] = json_decode($result_i["data"], true);

                        //이미지 포맷일 경우 업스케일링 정보를 찾는다.
                        if ($result_i["type"] == "image_format") {
                            $data = $result_i["data"];

                            $lines = $data["lines"];
                            $lines_length = count($lines);

                            $imageIds = array();
                            for ($j = 0; $j < $lines_length; $j++) {
                                $imageIds[] = ("'" . $lines[$j]["imageId"] . "'");
                            }
                            $imageIds_length = count($imageIds);
                            
                            if ($imageIds_length != 0) {
                                $stmt = $pdo->prepare("SELECT image_id, data FROM image_format_upscaling WHERE status = 0 AND image_id IN (" . implode(",", $imageIds) . ")");
                                $stmt->execute();
                                $upscaling = $stmt->fetchAll();
                                $upscaling_length = count($upscaling);
                                
                                $upscalingInfo = array();
                                for ($j = 0; $j < $upscaling_length; $j++) {
                                    $upscalingInfo[$upscaling[$j]["image_id"]] = json_decode($upscaling[$j]["data"], true);
                                }

                                for ($j = 0; $j < $lines_length; $j++) {
                                    $imageId = $lines[$j]["imageId"];
                                    if (isset($upscalingInfo[$imageId])) {
                                        $upscalingList = $upscalingInfo[$imageId];
                                        $upscalingList_length = count($upscalingList);
                                        for ($j2 = 0; $j2 < $upscalingList_length; $j2++) {
                                            $length = count($lines[$j]["resolutions"]);
                                            $lines[$j]["resolutions"][$length] = $upscalingList[$j2];
                                            $lines[$j]["resolutions"][$length]["upscaling"] = true;
                                        }
                                    }
                                }

                                $data["lines"] = $lines;
                                $result_i["data"] = $data;
                            }
                        }
                    } else {
                        $result_i["data"] = json_decode($result_i["data"], true);
                    }
                }

                //회차를 봤는지
                if (isset($viewsInfo[$result_i["number"]])) {
                    $result_i["isViewed"] = $viewsInfo[$result_i["number"]];
                    $result_i["percent_viewed"] = $viewsPercentInfo[$result_i["number"]];
                } else {
                    $result_i["isViewed"] = false;
                }
    
                //댓글 갯수
                $uid = 'part_' . $result_i["number"];
                if (isset($commentsCount[$uid])) {
                    $result_i["comments_count"] = $commentsCount[$uid];
                } else {
                    $result_i["comments_count"] = 0;
                }

                //반환되는 언어
                $result_i["language"] = $result_i["original_language"];

                //현지화
                $isTranslated = false;
                if (isset($localizationInfo[$result_i["number"]])) {
                    $info = $localizationInfo[$result_i["number"]];
                    $result_i["title"] = $info["title"];
                    if ($isContentsInfo == true) {
                        $result_i["data"] = json_decode($info["data"], true);
                        $result_i["size"] = $info["size"];
                    }
                    if (isset($info["thumbnail_image"])) {
                        $result_i["thumbnail_image"] = $info["thumbnail_image"];
                    }
                    $result_i["language"] = $info["language"];
                    //번역됨
                    $isTranslated = true;
                }

                //현재 시간과 업로드 날짜의 차이 (초)
                $result_i["time_difference"] = getTimeDifference($result_i["upload_date"], $newDate);

                //번역됨 여부
                $result_i["isTranslated"] = $isTranslated;

                //수익 창출이 활성화된 작품이면
                if (isset($workInfo[$result_i["work_number"]]) && $workInfo[$result_i["work_number"]]["monetization"] == true) {
                    $result_i["monetization"] = true;
                } else {
                    $result_i["monetization"] = false;
                }

                //동영상일 경우
                if ($result_i["type"] == "video") {
                    $data = null;
                    if (isset($result_i["data"])) {
                        $data = $result_i["data"];
                    } else if (isset($partData[$result_i["number"]])) {
                        $data = $partData[$result_i["number"]];
                    }
                    
                    if ($data != null) {
                        /*
                            duration: 동영상 길이
                            processingResolution: 처리 중인 화질
                            processingProgress: 처리 중인 화질 진행률
                            status:
                                0 = 처리 완료
                                1 = 처리 중
                                2 = 처리 대기 중
                        */
                        if (isset($data["codecs"][0]["resolutions"][0])) {
                            $duration = null;
                            if (isset($data["codecs"][0]["resolutions"][0]["duration"])) {
                                $duration = $data["codecs"][0]["resolutions"][0]["duration"];
                            }
                            $status = 2;
                            $processingResolution = null;
                            $processingProgress = null;
                            if (isset($data["codecs"][0])) {
                                $codecs = $data["codecs"][0];
                                $status = $codecs["status"];

                                $resolutions = $codecs["resolutions"];
                                $resolutions_length = count($resolutions);
                                for ($j = 0; $j < $resolutions_length; $j++) {
                                    if ($resolutions[$j]["status"] == 1) {
                                        $processingResolution = $resolutions[$j]["resolution"];
                                        $processingProgress = 0;
                                        if (isset($resolutions[$j]["progress"])) {
                                            $processingProgress = $resolutions[$j]["progress"];
                                        }
                                        break;
                                    }
                                }
                            }

                            $dataResult = array(
                                'duration' => $duration,
                                'status' => $status
                            );
                            if ($processingResolution != null) {
                                $dataResult["processingResolution"] = $processingResolution;
                                $dataResult["processingProgress"] = $processingProgress;
                            }
    
                            $result_i["video"] = $dataResult;
                        } else {
                            $result_i["video"] = array(
                                'status' => 2
                            );
                        }
                    }
                }

                $resultArray[$result_i["number"]] = $result_i;
            } else {
                $resultArray[$result_i["number"]] = array(
                    'status' => 1,
                    'number' => $result_i["number"]
                );
            }
        }

        $data = array();
        for ($i = 0; $i < $numberList_length; $i++) {
            if (isset($resultArray[$numberList_array[$i]])) {
                $data[] = $resultArray[$numberList_array[$i]];
            } else {
                $data[] = array(
                    'status' => 2,
                    'number' => $numberList_array[$i]
                );
            }
        }

        return $data;
    }
    function getWorkPartNumbers($workNumber, $sort, $chapter) {
        global $pdo;

        $optionChapter = $chapter;
        if ($optionChapter == 0) {
            $optionChapterSql = '1 = :chapter';
            $optionChapter = '1';
        } else {
            $optionChapterSql = 'chapter = :chapter';
        }
    
        $stmt = $pdo->prepare("SELECT number FROM work_part WHERE work_number = :work_number AND public_status = 0 AND " . $optionChapterSql);
        $stmt->execute(array(
            ':work_number' => $workNumber,
            ':chapter' => $optionChapter
        ));
        $partList = null;
        if ($sort == 0) {
            $partList = array_reverse($stmt->fetchAll());
        } else if ($sort == 1) {
            $partList = $stmt->fetchAll();
        }
        $partListNumbers = array();
        for ($i = 0; $i < count($partList); $i++) {
            $partListNumbers[$i] = $partList[$i]["number"];
        }
        return implode(',', $partListNumbers);
    }
    function getWorkChapterTitle($workNumber, $chapterList, $lang = null) {
        global $pdo;

        //사용자 언어
        $userLanguage = null;
        if (isset($_POST["lang"]) && $lang != "original") {
            $userLanguage = $_POST["lang"];
        }
        $languageSql = "";
        if ($userLanguage != null) {
            $languageSql = ' OR language = :userLanguage';
        }

        //반환할 수
        $numberList_split = explode(',', $chapterList);
        $numberList_length = count($numberList_split);

        if ($numberList_length > 1) {
            $stmt = $pdo->prepare("SELECT chapter, title, language FROM work_chapter WHERE work_number = :work_number AND chapter IN (" . $chapterList . ") AND (language is NULL" . $languageSql . ")");
            $data = array(
                "work_number" => $workNumber,
            );
            ($userLanguage != null) ? $data["userLanguage"] = $userLanguage : null; //사용자 언어

            $stmt->execute($data);
            $result = $stmt->fetchAll();
        } else {
            $stmt = $pdo->prepare("SELECT chapter, title, language FROM work_chapter WHERE work_number = :work_number AND chapter = :chapter AND (language is NULL" . $languageSql . ")");
            $data = array(
                "work_number" => $workNumber,
                "chapter" => $chapterList
            );
            ($userLanguage != null) ? $data["userLanguage"] = $userLanguage : null; //사용자 언어

            $stmt->execute($data);
            $result = $stmt->fetchAll();
        }

        $titles = array();
        for ($i = 0; $i < count($result); $i++) {
            if (isset($titles[$result[$i]["chapter"]]) == false) {
                $titles[$result[$i]["chapter"]] = $result[$i]["title"];
            } else {
                if (isset($result[$i]["language"])) {
                    $titles[$result[$i]["chapter"]] = $result[$i]["title"];
                }
            }
        }

        $result = array();
        for ($i = 0; $i < $numberList_length; $i++) {
            foreach ($titles as $key => $value) {
                if ($numberList_split[$i] == $key) {
                    $result[] = $value;
                    break;
                }
            }
        }
        
        return $result;
    }
    function getWorkChapterInfo($workNumber) {
        global $pdo;

        //$stmt = $pdo->prepare("SELECT number, chapter, COUNT(chapter) FROM work_part WHERE work_number = :work_number GROUP BY chapter HAVING COUNT(chapter) > 1");
        $stmt = $pdo->prepare("SELECT number, chapter, COUNT(chapter) FROM (SELECT * FROM work_part WHERE work_number = :work_number AND public_status = 0 ORDER BY number DESC LIMIT 18446744073709551615)A GROUP BY chapter");
        $data = array(
            "work_number" => $workNumber,
        );
        $stmt->execute($data);
        $result = $stmt->fetchAll();
        $result_length = count($result);
        
        $chapterInfo = array();
        if ($result_length != 0) {
            $partNumbers = array();
            $chapters = array();
            for ($i = 0; $i < $result_length; $i++) {
                $chapterInfo[] = array(
                    'thumbnailPartNumber' => $result[$i]["number"],
                    'chapter' => $result[$i]["chapter"],
                    'count' => $result[$i]["COUNT(chapter)"],
                );
                $partNumbers[] = $result[$i]["number"];
                $chapters[] = $result[$i]["chapter"];
            }
            $chapterInfo_length = count($chapterInfo);
    
            //썸네일 구하기
            $thumbnailImage = array();
            $partInfo = getWorkPartInfo(implode(",", $partNumbers));
            $partInfo_length = count($partInfo);
            for ($i = 0; $i < $partInfo_length; $i++) {
                $thumbnailImage[$partInfo[$i]["number"]] = $partInfo[$i]["thumbnail_image"];
            }
    
            //챕터 제목 구하기
            $chapterTitle = array();
            $chapterTitleInfo = getWorkChapterTitle($workNumber, implode(",", $chapters));
            
            //결과 합치기
            for ($i = 0; $i < $chapterInfo_length; $i++) {
                $chapterInfo[$i]["title"] = $chapterTitleInfo[$i];
                $chapterInfo[$i]["thumbnailImage"] = $thumbnailImage[$chapterInfo[$i]["thumbnailPartNumber"]];
            }
        }

        return array_reverse($chapterInfo);
    }

    function getCloudDataSize($data) {
        $size = 0;
        $json = json_decode($data, true);

        $lines = $json["lines"];
        $lines_length = count($lines);
        for ($i = 0; $i < $lines_length; $i++) {
            $line = $lines[$i];
            if (isset($line["type"]) && $line["type"] == "text") {
                //문서 형식
                $content = $line["content"];
                $content = preg_replace("/\s+/u", "", $content);
                $size += mb_strlen($content, "UTF-8");
            } else if (isset($line["resolutions"])) {
                //이미지 형식
                $size ++;
            }
        }

        return $size;
    }


































    //댓글 정보 반환
    /*
        highlightedCommentNumber = 하이라이트 댓글 번호
    */
    function getCommentsInfo($numberList, $highlightedCommentNumber = null) {
        if ($numberList == '') { return null; }
        global $pdo, $myUserInfo;

        if (isset($myUserInfo) == false) {
            $myUserInfo = getMyLoginInfo();
        }

        //하이라이트 답글이면 상위 댓글 번호 구하기
        $highlightedCommentReplyNumber = null;
        $highlightedCommentInfo = null;
        if ($highlightedCommentNumber != null) {
            $stmt = $pdo->prepare("SELECT reply_number FROM comments WHERE number = :number");
            $stmt->execute(array(
                "number" => $highlightedCommentNumber
            ));
            $result = $stmt->fetch();
            if (isset($result["reply_number"])) {
                $highlightedCommentReplyNumber = $result["reply_number"];
                $highlightedCommentInfo = getCommentsInfo($highlightedCommentNumber)[0];
            }
        }

        //반환할 수
        $numberList_count = explode(',', $numberList);

        $select = 'number, uid, content, user_number, likes, dislike, upload_date, reply_number, reply_count, user_reply';

        if ($numberList_count > 1) {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM comments WHERE number IN (" . $numberList . ") ORDER BY FIELD(number, " . $numberList . ")");
            $stmt->execute();
            $result = $stmt->fetchAll();   $result_length = count($result);
        } else {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM comments WHERE number = :number");
            $stmt->execute(array(
                "number" => $numberList,
            ));
            $result = $stmt->fetchAll();   $result_length = count($result);
        }

        //유저 정보
        $userNumbers = array();
        for ($i = 0; $i < $result_length; $i++) {
            $userNumbers[] = $result[$i]["user_number"];
            //
            if (isset($result[$i]["user_reply"])) {
                $userNumbers[] = $result[$i]["user_reply"];
            }
        }
        $userArray = array();
        if (count($userNumbers) != 0) {
            $userInfo = getUserInfo(implode(',', $userNumbers));
            $userInfo_count = count($userInfo);
            for ($i = 0; $i < $userInfo_count; $i++) {
                $userArray[$userInfo[$i]["number"]] = $userInfo[$i];
            }
        }

        //좋아요, 싫어요 표시 여부
        $likesDislikeArray = array();
        if ($myUserInfo["isLogin"] == true) {
            $stmt = $pdo->prepare("SELECT type, comments_number FROM comments_likes_dislike WHERE user_number = :user_number AND comments_number IN (" . $numberList . ")");
            $stmt->execute(array(
                ':user_number' => $myUserInfo["number"],
            ));
            $likesDislike = $stmt->fetchAll();
            $likesDislike_count = count($likesDislike);
            for ($i = 0; $i < $likesDislike_count; $i++) {
                $likesDislikeData = $likesDislike[$i];
                $likesDislikeArray[$likesDislikeData["comments_number"]] = $likesDislikeData["type"];
            }
        }

        $data = array();
        for ($i = 0; $i < $result_length; $i++) {
            $result_i = $result[$i];

            $commentsUserInfo = $userArray[$result_i["user_number"]];
            $result_i["nickname"] = $commentsUserInfo["nickname"];
            $result_i["profile"] = $commentsUserInfo["profile"];

            //좋아요, 싫어요 표시 여부
            $result_i["liked"] = false;
            $result_i["disliked"] = false;
            if (isset($likesDislikeArray[$result_i["number"]])) {
                $type = $likesDislikeArray[$result_i["number"]];
                if ($type == 0) {
                    $result_i["liked"] = true;
                } else if ($type == 1) {
                    $result_i["disliked"] = true;
                }
            }

            //User reply
            if (isset($result_i["user_reply"])) {
                $replyUserInfo = $userArray[$result_i["user_reply"]];
                $result_i["user_reply"] = array(
                    "nickname" => $replyUserInfo["nickname"],
                    "profile" => $replyUserInfo["profile"],
                );
            }

            //하이라이트 답글의 상위 댓글이면
            if ($highlightedCommentReplyNumber != null && $highlightedCommentReplyNumber == $result_i["number"]) {
                $replyInfo = array();
                $replyInfo[] = $highlightedCommentInfo;
                $result_i["replyInfo"] = $replyInfo;
            }

            $data[] = $result_i;
        }

        return $data;
    }

    /*
        정렬
        0 = 인기 댓글 순
        1 = 최근 댓글 순
        2 = 오래된 댓글 순
        3 = 좋아요 순
        4 = 싫어요 순

        preferentially = 우선적으로 앞으로
    */
    function getCommentsNumbers($uid, $sort, $preferentially = null) {
        global $pdo, $myUserInfo;
        $initialUid = $uid;
        if ($initialUid == "history" && isset($myUserInfo) == false) {
            $myUserInfo = getMyLoginInfo();
        }

        $uid = explode(",", $uid);
        $uid_length = count($uid);
        for ($i = 0; $i < $uid_length; $i++) {
            $uid[$i] = '"' . $uid[$i] . '"';
        }
        $uid = implode(",", $uid);

        //최근 기록
        $historyNumbers = array();
        if ($initialUid == "history") {
            $stmt = $pdo->prepare("SELECT number, reply_number FROM comments WHERE user_number = :user_number");
            $stmt->execute(array(
                'user_number' => $myUserInfo["number"]
            ));
            $result = $stmt->fetchAll();
            $result_length = count($result);

            for ($i = 0; $i < $result_length; $i++) {
                if ($result[$i]["reply_number"] != "") {
                    $historyNumbers[] = $result[$i]["reply_number"];
                } else {
                    $historyNumbers[] = $result[$i]["number"];
                }
            }

            //중복 제거
            $historyNumbers = array_unique($historyNumbers);
            if (count($historyNumbers) == 0) {
                return null;
            }
        }

        //인기 댓글 순
        if ($sort == 0) {
            $numbers = array();

            if ($initialUid == "history") {
                $stmt = $pdo->prepare("SELECT number, reply_number, likes, dislike FROM comments WHERE number IN (" . implode(",", $historyNumbers) . ")");
                $stmt->execute();
                $result = $stmt->fetchAll();
                $result_length = count($result);

                $numbers = $historyNumbers;
            } else {
                $stmt = $pdo->prepare("SELECT number, likes, dislike FROM comments WHERE uid IN (" . $uid . ")");
                $stmt->execute();
                $result = $stmt->fetchAll();
                $result_length = count($result);

                for ($i = 0; $i < $result_length; $i++) {
                    $numbers[] = $result[$i]["number"];
                }
            }

            if ($result_length != 0) {
                //7일 이내의 좋아요 갯수
                $stmt = $pdo->prepare("SELECT comments_number FROM comments_likes_dislike WHERE comments_number IN (" . implode(',', $numbers) . ") AND date > :date");
                $stmt->execute(array(
                    ':date' => date("Y-m-d H:i:s", strtotime("-7 Day")),
                ));
                $likesDislike = $stmt->fetchAll();
                $likesDislike_length = count($likesDislike);

                $recentlyLikes = array();
                for ($i = 0; $i < $likesDislike_length; $i++) {
                    $commentsNumber = $likesDislike[$i]["comments_number"];
                    if (isset($recentlyLikes[$commentsNumber])) {
                        ++ $recentlyLikes[$commentsNumber];
                    } else {
                        $recentlyLikes[$commentsNumber] = 1;
                    }
                }

                $sort = array();
                for ($i = 0; $i < $result_length; $i++) {
                    $likes = $result[$i]["likes"];
                    $dislike = $result[$i]["dislike"];
                    $commentsRecentlyLikes = 0;
                    if (isset($recentlyLikes[$result[$i]["number"]])) {
                        $commentsRecentlyLikes = $recentlyLikes[$result[$i]["number"]];
                    }

                    //좋아요 비율
                    $likeRatio = 0;
                    if ($dislike != 0 && $likes != 0) {
                        $likeRatio = 1 - ($dislike / $likes);
                    } else {
                        if ($likes >= $dislike) {
                            $likeRatio = 1;
                        } else {
                            $likeRatio = - $dislike;
                        }
                    }

                    if ($likes >= $dislike) {
                        $score = $commentsRecentlyLikes * $likeRatio;
                    } else {
                        $score = $likeRatio;
                    }

                    $sort[$i] = $score;
                }
                array_multisort($sort, SORT_DESC, $result);
            }
        } else if ($sort == 1) {
            if ($initialUid == "history") {
                $stmt = $pdo->prepare("SELECT number FROM comments WHERE number IN (" . implode(",", $historyNumbers) . ") ORDER BY number DESC");
                $stmt->execute();
                $result = $stmt->fetchAll();
                $result_length = count($result);
            } else {
                $stmt = $pdo->prepare("SELECT number FROM comments WHERE uid IN (" . $uid . ") ORDER BY number DESC");
                $stmt->execute();
                $result = $stmt->fetchAll();
                $result_length = count($result);
            }
        } else if ($sort == 2) {
            if ($initialUid == "history") {
                $stmt = $pdo->prepare("SELECT number FROM comments WHERE number IN (" . implode(",", $historyNumbers) . ")");
                $stmt->execute();
                $result = $stmt->fetchAll();
                $result_length = count($result);
            } else {
                $stmt = $pdo->prepare("SELECT number FROM comments WHERE uid IN (" . $uid . ")");
                $stmt->execute();
                $result = $stmt->fetchAll();
                $result_length = count($result);
            }
        } else if ($sort == 3) {
            if ($initialUid == "history") {
                $stmt = $pdo->prepare("SELECT number FROM comments WHERE number IN (" . implode(",", $historyNumbers) . ") ORDER BY likes DESC");
                $stmt->execute();
                $result = $stmt->fetchAll();
                $result_length = count($result);
            } else {
                $stmt = $pdo->prepare("SELECT number FROM comments WHERE uid IN (" . $uid . ") ORDER BY likes DESC");
                $stmt->execute();
                $result = $stmt->fetchAll();
                $result_length = count($result);
            }
        } else if ($sort == 4) {
            if ($initialUid == "history") {
                $stmt = $pdo->prepare("SELECT number FROM comments WHERE number IN (" . implode(",", $historyNumbers) . ") ORDER BY dislike DESC");
                $stmt->execute();
                $result = $stmt->fetchAll();
                $result_length = count($result);
            } else {
                $stmt = $pdo->prepare("SELECT number FROM comments WHERE uid IN (" . $uid . ") ORDER BY dislike DESC");
                $stmt->execute();
                $result = $stmt->fetchAll();
                $result_length = count($result);
            }
        }

        $numbers = array();
        ($preferentially != null) ? $numbers[] = $preferentially : null;
        for ($i = 0; $i < $result_length; $i++) {
            //우선적으로 앞에 배치되는 댓글 번호는 배열 추가에서 제외
            if ($preferentially == null || $preferentially != $result[$i]["number"]) {
                $numbers[] = $result[$i]["number"];
            }
        }

        return implode(",", $numbers);
    }

    function deleteComments($commentsNumber) {
        global $pdo;

        $stmt = $pdo->prepare("SELECT number, reply_number, uid FROM comments where number = :number");
        $stmt->execute(array(
            ':number' => $commentsNumber
        ));
        $comments = $stmt->fetch();

        //답글 갯수
        if (isset($comments["reply_number"])) {
            $sql = $pdo->prepare('UPDATE comments SET reply_count = reply_count - 1 WHERE number = :number');
            $sql->execute(array(
                ':number' => $comments["reply_number"],
            ));
        }

        $stmt = $pdo->prepare("DELETE FROM comments WHERE number = :number OR reply_number = :reply_number");
        $stmt->execute(array(
            ':number' => $commentsNumber,
            ':reply_number' => $commentsNumber,
        ));

        if (isset($comments["reply_number"]) == false) {
            $stmt = $pdo->prepare("SELECT number, count FROM comments_count where uid = :uid");
            $stmt->execute(array(
                ':uid' => $comments["uid"],
            ));
            $commentsCount = $stmt->fetch();

            if (isset($commentsCount["number"])) {
                if ($commentsCount["count"] <= 1) {
                    $sql = $pdo->prepare('DELETE FROM comments_count WHERE uid = :uid');
                    $sql->execute(array(
                        ':uid' => $comments["uid"],
                    ));
                } else {
                    $sql = $pdo->prepare('UPDATE comments_count SET count = count - 1 WHERE uid = :uid');
                    $sql->execute(array(
                        ':uid' => $comments["uid"],
                    ));
                }
            }
        }

        //좋아요, 싫어요 여부 삭제
        $stmt = $pdo->prepare("DELETE FROM comments_likes_dislike WHERE comments_number = :comments_number");
        $stmt->execute(array(
            ':comments_number' => $commentsNumber
        ));
        //신고 삭제
        $stmt = $pdo->prepare("DELETE FROM user_report WHERE type = 0 AND unique_number = :unique_number");
        $stmt->execute(array(
            ':unique_number' => $commentsNumber
        ));
    }

    function getReplyNumbers($number) {
        global $pdo;

        $stmt = $pdo->prepare("SELECT number FROM comments WHERE reply_number = :reply_number");
        $stmt->execute(array(
            ':reply_number' => $number,
        ));
        $replyNumbers = $stmt->fetchAll();
        $replyNumbers_length = count($replyNumbers);
        $numbers = array();
        for ($j = 0; $j < $replyNumbers_length; $j++) {
            $numbers[] = $replyNumbers[$j]["number"];
        }

        return implode(",", $numbers);
    }

    function getCommentsOriginatorNumber($uid) {
        global $pdo;
        
        $originatorNumber = null;
        if (strpos($uid, 'work') !== false) {
            $stmt = $pdo->prepare("SELECT user_number FROM works WHERE number = :number");
            $stmt->execute(array(
                ':number' => str_replace('work_', '', $uid)
            ));
            $originatorNumber = $stmt->fetch()["user_number"];
        } else if (strpos($uid, 'part') !== false) {
            $stmt = $pdo->prepare("SELECT user_number FROM work_part WHERE number = :number");
            $stmt->execute(array(
                ':number' => str_replace('part_', '', $uid)
            ));
            $originatorNumber = $stmt->fetch()["user_number"];
        } else if (strpos($uid, 'community') !== false) {
            $stmt = $pdo->prepare("SELECT user_number FROM community WHERE number = :number");
            $stmt->execute(array(
                ':number' => str_replace('community_', '', $uid)
            ));
            $originatorNumber = $stmt->fetch()["user_number"];
        }

        return $originatorNumber;
    }




































    function getRatingsInfo($numberList) {
        if ($numberList == '') { return null; }
        global $pdo, $myUserInfo;
        if (isset($myUserInfo) == false) {
            $myUserInfo = getMyLoginInfo();
        }

        //반환할 수
        $numbers = explode(',', $numberList);
        $numbers_length = count($numbers);

        $select = 'number, user_number, content, score, likes, dislike, upload_date';

        if ($numbers_length > 1) {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM ratings WHERE number IN (" . $numberList . ") ORDER BY FIELD(number, " . $numberList . ")");
            $stmt->execute();
            $result = $stmt->fetchAll();   $result_length = count($result);
        } else {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM ratings WHERE number = :number");
            $stmt->execute(array(
                "number" => $numberList,
            ));
            $result = $stmt->fetchAll();   $result_length = count($result);
        }

        //유저 정보
        $userNumbers = array();
        for ($i = 0; $i < $result_length; $i++) {
            $userNumbers[] = $result[$i]["user_number"];
        }
        $userArray = array();
        if (count($userNumbers) != 0) {
            $userInfo = getUserInfo(implode(',', $userNumbers));
            $userInfo_count = count($userInfo);
            for ($i = 0; $i < $userInfo_count; $i++) {
                $userArray[$userInfo[$i]["number"]] = $userInfo[$i];
            }
        }

        //좋아요, 싫어요 표시 여부
        $likesDislikeArray = array();
        if ($myUserInfo["isLogin"] == true) {
            $stmt = $pdo->prepare("SELECT type, ratings_number FROM ratings_likes_dislike WHERE user_number = :user_number AND ratings_number IN (" . $numberList . ")");
            $stmt->execute(array(
                ':user_number' => $myUserInfo["number"],
            ));
            $likesDislike = $stmt->fetchAll();
            $likesDislike_count = count($likesDislike);
            for ($i = 0; $i < $likesDislike_count; $i++) {
                $likesDislikeData = $likesDislike[$i];
                $likesDislikeArray[$likesDislikeData["ratings_number"]] = $likesDislikeData["type"];
            }
        }

        $data = array();
        for ($i = 0; $i < $result_length; $i++) {
            $result_i = $result[$i];

            $ratingsUserInfo = $userArray[$result_i["user_number"]];
            $result_i["nickname"] = $ratingsUserInfo["nickname"];
            $result_i["profile"] = $ratingsUserInfo["profile"];

            //좋아요, 싫어요 표시 여부
            $result_i["liked"] = false;
            $result_i["disliked"] = false;
            if (isset($likesDislikeArray[$result_i["number"]])) {
                $type = $likesDislikeArray[$result_i["number"]];
                if ($type == 0) {
                    $result_i["liked"] = true;
                } else if ($type == 1) {
                    $result_i["disliked"] = true;
                }
            }

            $data[] = $result_i;
        }

        return $data;
    }
    /*
        정렬
        0 = 인기 평가 순
        1 = 최근 평가 순
        2 = 오래된 평가 순

        preferentially = 우선적으로 앞으로
        maxLength = 최대 몇개를 반환하냐
    */
    function getRatingsNumbers($workNumber, $sort, $preferentially = null, $maxLength = null) {
        global $pdo, $myUserInfo;
        if (isset($myUserInfo) == false) {
            $myUserInfo = getMyLoginInfo();
        }

        //인기 댓글 순
        if ($sort == 0) {
            $numbers = array();

            if ($workNumber == "history") {
                $stmt = $pdo->prepare("SELECT number, likes, dislike FROM ratings WHERE user_number = :user_number");
                $stmt->execute(array(
                    ":user_number" => $myUserInfo["number"]
                ));
                $result = $stmt->fetchAll();
                $result_length = count($result);
            } else {
                $stmt = $pdo->prepare("SELECT number, likes, dislike FROM ratings WHERE work_number = :work_number");
                $stmt->execute(array(
                    ":work_number" => $workNumber
                ));
                $result = $stmt->fetchAll();
                $result_length = count($result);
            }

            for ($i = 0; $i < $result_length; $i++) {
                $numbers[] = $result[$i]["number"];
            }

            if ($result_length != 0) {
                //7일 이내의 좋아요 갯수
                $stmt = $pdo->prepare("SELECT ratings_number FROM ratings_likes_dislike WHERE ratings_number IN (" . implode(',', $numbers) . ") AND date > :date");
                $stmt->execute(array(
                    ':date' => date("Y-m-d H:i:s", strtotime("-7 Day")),
                ));
                $likesDislike = $stmt->fetchAll();
                $likesDislike_length = count($likesDislike);

                $recentlyLikes = array();
                for ($i = 0; $i < $likesDislike_length; $i++) {
                    $ratingsNumber = $likesDislike[$i]["ratings_number"];
                    if (isset($recentlyLikes[$ratingsNumber])) {
                        ++ $recentlyLikes[$ratingsNumber];
                    } else {
                        $recentlyLikes[$ratingsNumber] = 1;
                    }
                }

                $sort = array();
                for ($i = 0; $i < $result_length; $i++) {
                    $likes = $result[$i]["likes"];
                    $dislike = $result[$i]["dislike"];
                    $recentlyRecentlyLikes = 0;
                    if (isset($recentlyLikes[$result[$i]["number"]])) {
                        $recentlyRecentlyLikes = $recentlyLikes[$result[$i]["number"]];
                    }

                    //좋아요 비율
                    $likeRatio = 0;
                    if ($dislike != 0 && $likes != 0) {
                        $likeRatio = 1 - ($dislike / $likes);
                    } else {
                        if ($likes >= $dislike) {
                            $likeRatio = 1;
                        } else {
                            $likeRatio = - $dislike;
                        }
                    }

                    if ($likes >= $dislike) {
                        $score = $recentlyRecentlyLikes * $likeRatio;
                    } else {
                        $score = $likeRatio;
                    }

                    $sort[$i] = $score;
                }
                array_multisort($sort, SORT_DESC, $result);
            }
        } else if ($sort == 1) {
            if ($workNumber == "history") {
                $stmt = $pdo->prepare("SELECT number FROM ratings WHERE user_number = :user_number ORDER BY number DESC");
                $stmt->execute(array(
                    ":user_number" => $myUserInfo["number"]
                ));
                $result = $stmt->fetchAll();
                $result_length = count($result);
            } else {
                $stmt = $pdo->prepare("SELECT number FROM ratings WHERE work_number = :work_number ORDER BY number DESC");
                $stmt->execute(array(
                    ":work_number" => $workNumber
                ));
                $result = $stmt->fetchAll();
                $result_length = count($result);
            }
        } else if ($sort == 2) {
            if ($workNumber == "history") {
                $stmt = $pdo->prepare("SELECT number FROM ratings WHERE user_number = :user_number");
                $stmt->execute(array(
                    ":user_number" => $myUserInfo["number"]
                ));
                $result = $stmt->fetchAll();
                $result_length = count($result);
            } else {
                $stmt = $pdo->prepare("SELECT number FROM ratings WHERE work_number = :work_number");
                $stmt->execute(array(
                    ":work_number" => $workNumber
                ));
                $result = $stmt->fetchAll();
                $result_length = count($result);
            }
        }

        $numbers = array();
        ($preferentially != null) ? $numbers[] = $preferentially : null;
        for ($i = 0; $i < $result_length; $i++) {
            //우선적으로 앞에 배치되는 댓글 번호는 배열 추가에서 제외
            if ($preferentially == null || $preferentially != $result[$i]["number"]) {
                $numbers[] = $result[$i]["number"];
                //최대 갯수
                if ($maxLength != null && $maxLength <= count($numbers)) {
                    break;
                }
            }
        }

        return implode(",", $numbers);
    }

    function deleteRatings($ratingsNumber) {
        global $pdo;

        $stmt = $pdo->prepare("DELETE FROM ratings WHERE number = :number");
        $stmt->execute(array(
            ':number' => $ratingsNumber
        ));

        //좋아요, 싫어요 여부 삭제
        $stmt = $pdo->prepare("DELETE FROM ratings_likes_dislike WHERE ratings_number = :ratings_number");
        $stmt->execute(array(
            ':ratings_number' => $ratingsNumber
        ));
        //신고 삭제
        $stmt = $pdo->prepare("DELETE FROM user_report WHERE type = 1 AND unique_number = :unique_number");
        $stmt->execute(array(
            ':unique_number' => $ratingsNumber
        ));
    }

    /*
        평균 점수, 5점, 4점, 3점, 2점, 1점이 몇 개 있는지 분석 정보를 가져온다.
    */
    function getRatingsAnalysisInfo($workNumbers) {
        global $pdo;

        $stmt = $pdo->prepare("SELECT work_number, score, COUNT(score) FROM ratings WHERE work_number IN (" . $workNumbers . ") GROUP BY work_number, score");
        $stmt->execute();
        $result = $stmt->fetchAll();
        $result_length = count($result);

        $data = array();
        for ($i = 0; $i < $result_length; $i++) {
            $data[$result[$i]["work_number"]][] = $result[$i];
        }

        $return = array();

        $numbers = explode(",", $workNumbers);
        $numbers_length = count($numbers);
        for ($i = 0; $i < $numbers_length; $i++) {
            $info = array();
            if (isset($data[$numbers[$i]])) {
                $info = $data[$numbers[$i]];
            }
            $info_length = count($info);

            $scoreCountArray = array();
            $sumScoreCount = 0;
            for ($j = 0; $j < $info_length; $j++) {
                $scoreCountArray[$info[$j]["score"]] = $info[$j]["COUNT(score)"];
                $sumScoreCount += $info[$j]["COUNT(score)"];
            }
            $scoreInfo = array();
            for ($j = 1; $j <= 5; $j++) {
                $count = 0;
                if (isset($scoreCountArray[$j])) {
                    $count = $scoreCountArray[$j];
                }
                $ratio = 0;
                if ($count != 0) {
                    $ratio = $count / $sumScoreCount;
                }

                $scoreInfo[$j] = array(
                    "count" => $count,
                    "ratio" => $ratio
                );
            }
            $avg = 0;
            for ($j = 1; $j <= 5; $j++) {
                $avg += $j * $scoreInfo[$j]["ratio"];
            }
            $scoreInfo["count"] = $sumScoreCount;
            $scoreInfo["average"] = $avg;
            $scoreInfo["workNumber"] = $numbers[$i];

            $return[] = $scoreInfo;
        }

        return $return;
    }

    //쓰기 가능한지
    function isWritableRatings($workNumber) {
        global $pdo, $myUserInfo;
        if (isset($myUserInfo) == false) {
            $myUserInfo = getMyLoginInfo();
        }

        //로그인을 하지 않으면 평가를 업로드할 수 없음
        if ($myUserInfo["isLogin"] == false) {
            return false;
        }
        
        //한 작품에 한개의 평가를 업로드할 수 있음
        $stmt = $pdo->prepare("SELECT number FROM ratings WHERE work_number = :work_number AND user_number = :user_number");
        $stmt->execute(array(
            ":work_number" => $workNumber,
            ":user_number" => $myUserInfo["number"]
        ));
        $result = $stmt->fetch();
        if (isset($result["number"])) {
            return false;
        }
        
        //원작자 본인인지
        $stmt = $pdo->prepare("SELECT number FROM works WHERE number = :number AND user_number = :user_number");
        $stmt->execute(array(
            ":number" => $workNumber,
            ":user_number" => $myUserInfo["number"]
        ));
        $result = $stmt->fetch();
        if (isset($result["number"])) {
            return false;
        }

        return true;
    }







































    //커뮤니티 정보 반환
    function getCommunityInfo($numberList) {
        if ($numberList == '') { return null; }
        global $pdo, $myUserInfo;

        if (isset($myUserInfo) == false) {
            $myUserInfo = getMyLoginInfo();
        }

        //반환할 수
        $numberList_count = explode(',', $numberList);

        $select = 'number, uid, content, user_number, likes, dislike, upload_date';

        if ($numberList_count > 1) {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM community WHERE number IN (" . $numberList . ") ORDER BY FIELD(number, " . $numberList . ")");
            $stmt->execute();
            $result = $stmt->fetchAll();   $result_length = count($result);
        } else {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM community WHERE number = :number");
            $stmt->execute(array(
                "number" => $numberList,
            ));
            $result = $stmt->fetchAll();   $result_length = count($result);
        }

        //유저 정보
        $userNumbers = array();
        for ($i = 0; $i < $result_length; $i++) {
            $userNumbers[] = $result[$i]["user_number"];
            //
            if (isset($result[$i]["user_reply"])) {
                $userNumbers[] = $result[$i]["user_reply"];
            }
        }
        $userInfo = getUserInfo(implode(',', $userNumbers));
        $userArray = array();
        if (isset($userInfo)) {
            $userInfo_count = count($userInfo);
            for ($i = 0; $i < $userInfo_count; $i++) {
                $userArray[$userInfo[$i]["number"]] = $userInfo[$i];
            }
        }

        //좋아요, 싫어요 표시 여부
        $likesDislikeArray = array();
        if ($myUserInfo["isLogin"] == true) {
            $stmt = $pdo->prepare("SELECT type, community_number FROM community_likes_dislike WHERE user_number = :user_number AND community_number IN (" . $numberList . ")");
            $stmt->execute(array(
                ':user_number' => $myUserInfo["number"],
            ));
            $likesDislike = $stmt->fetchAll();
            $likesDislike_count = count($likesDislike);
            for ($i = 0; $i < $likesDislike_count; $i++) {
                $likesDislikeData = $likesDislike[$i];
                $likesDislikeArray[$likesDislikeData["community_number"]] = $likesDislikeData["type"];
            }
        }

        //가져올 댓글
        $commentsUid = array();
        for ($i = 0; $i < $result_length; $i++) {
            $commentsUid[] = '"community_' . $result[$i]["number"] . '"';
        }
        //댓글 갯수
        $stmt = $pdo->prepare("SELECT uid, count FROM comments_count WHERE uid IN (" . implode(',', $commentsUid) . ")");
        $stmt->execute();
        $commentsInfo = $stmt->fetchAll();
        $commentsInfo_length = count($commentsInfo);
        $commentsCount = array();
        for ($i = 0; $i < $commentsInfo_length; $i++) {
            $commentsData = $commentsInfo[$i];
            $commentsCount[$commentsData["uid"]] = $commentsData["count"];
        }

        $data = array();
        for ($i = 0; $i < $result_length; $i++) {
            $result_i = $result[$i];

            $communityUserInfo = $userArray[$result_i["user_number"]];
            $result_i["nickname"] = $communityUserInfo["nickname"];
            $result_i["profile"] = $communityUserInfo["profile"];

            //좋아요, 싫어요 표시 여부
            $result_i["liked"] = false;
            $result_i["disliked"] = false;
            if (isset($likesDislikeArray[$result_i["number"]])) {
                $type = $likesDislikeArray[$result_i["number"]];
                if ($type == 0) {
                    $result_i["liked"] = true;
                } else if ($type == 1) {
                    $result_i["disliked"] = true;
                }
            }

            //댓글 갯수
            $uid = 'community_' . $result_i["number"];
            if (isset($commentsCount[$uid])) {
                $result_i["comments_count"] = $commentsCount[$uid];
            } else {
                $result_i["comments_count"] = 0;
            }

            $data[] = $result_i;
        }

        return $data;
    }

    function getCommunityNumbers($uid, $sort) {
        global $pdo, $myUserInfo;
        $initialUid = $uid;
        if ($initialUid == "history" && isset($myUserInfo) == false) {
            $myUserInfo = getMyLoginInfo();
        }

        //최근 기록
        if ($initialUid == "history") {
            //최근 생성 순
            if ($sort == 0) {
                $stmt = $pdo->prepare("SELECT number FROM community WHERE user_number = :user_number ORDER BY number DESC");
                $stmt->execute(array(
                    'user_number' => $myUserInfo["number"]
                ));
                $result = $stmt->fetchAll();
                $result_length = count($result);
            } else if ($sort == 1) {
                //오래된 생성 순
                $stmt = $pdo->prepare("SELECT number FROM community WHERE user_number = :user_number");
                $stmt->execute(array(
                    'user_number' => $myUserInfo["number"]
                ));
                $result = $stmt->fetchAll();
                $result_length = count($result);
            } else if ($sort == 2) {
                //좋아요 순
                $stmt = $pdo->prepare("SELECT number FROM community WHERE user_number = :user_number ORDER BY likes DESC, number DESC");
                $stmt->execute(array(
                    'user_number' => $myUserInfo["number"]
                ));
                $result = $stmt->fetchAll();
                $result_length = count($result);
            } else if ($sort == 3) {
                //싫어요 순
                $stmt = $pdo->prepare("SELECT number FROM community WHERE user_number = :user_number ORDER BY dislike DESC, number DESC");
                $stmt->execute(array(
                    'user_number' => $myUserInfo["number"]
                ));
                $result = $stmt->fetchAll();
                $result_length = count($result);
            }
        }

        //UID 가져오기
        if ($initialUid != "history") {
            //최근 생성 순
            if ($sort == 0) {
                $stmt = $pdo->prepare("SELECT number FROM community WHERE uid = :uid ORDER BY number DESC");
                $stmt->execute(array(
                    'uid' => $uid
                ));
                $result = $stmt->fetchAll();
                $result_length = count($result);
            } else if ($sort == 1) {
                //오래된 생성 순
                $stmt = $pdo->prepare("SELECT number FROM community WHERE uid = :uid");
                $stmt->execute(array(
                    'uid' => $uid
                ));
                $result = $stmt->fetchAll();
                $result_length = count($result);
            } else if ($sort == 2) {
                //좋아요 순
                $stmt = $pdo->prepare("SELECT number FROM community WHERE uid = :uid ORDER BY likes DESC, number DESC");
                $stmt->execute(array(
                    'uid' => $uid
                ));
                $result = $stmt->fetchAll();
                $result_length = count($result);
            } else if ($sort == 3) {
                //싫어요 순
                $stmt = $pdo->prepare("SELECT number FROM community WHERE uid = :uid ORDER BY dislike DESC, number DESC");
                $stmt->execute(array(
                    'uid' => $uid
                ));
                $result = $stmt->fetchAll();
                $result_length = count($result);
            }
        }

        $numbers = array();
        for ($i = 0; $i < $result_length; $i++) {
            $numbers[] = $result[$i]["number"];
        }

        return implode(",", $numbers);
    }

    function deleteCommunity($communityNumber) {
        global $pdo;

        $stmt = $pdo->prepare("SELECT number, uid FROM community where number = :number");
        $stmt->execute(array(
            ':number' => $communityNumber
        ));
        $community = $stmt->fetch();

        $stmt = $pdo->prepare("DELETE FROM community WHERE number = :number");
        $stmt->execute(array(
            ':number' => $communityNumber,
        ));

        $stmt = $pdo->prepare("SELECT number, count FROM community_count where uid = :uid");
        $stmt->execute(array(
            ':uid' => $community["uid"],
        ));
        $communityCount = $stmt->fetch();

        if (isset($communityCount["number"])) {
            if ($communityCount["count"] <= 1) {
                $sql = $pdo->prepare('DELETE FROM community_count WHERE uid = :uid');
                $sql->execute(array(
                    ':uid' => $community["uid"],
                ));
            } else {
                $sql = $pdo->prepare('UPDATE community_count SET count = count - 1 WHERE uid = :uid');
                $sql->execute(array(
                    ':uid' => $community["uid"],
                ));
            }
        }

        //좋아요, 싫어요 여부 삭제
        $stmt = $pdo->prepare("DELETE FROM community_likes_dislike WHERE community_number = :community_number");
        $stmt->execute(array(
            ':community_number' => $communityNumber
        ));
        //신고 삭제
        $stmt = $pdo->prepare("DELETE FROM user_report WHERE type = 2 AND unique_number = :unique_number");
        $stmt->execute(array(
            ':unique_number' => $communityNumber
        ));

        //댓글 삭제
        $stmt = $pdo->prepare("DELETE FROM comments WHERE uid = :uid");
        $stmt->execute(array(
            ':uid' => "community_" . $communityNumber
        ));
        //댓글 삭제 - COUNT
        $stmt = $pdo->prepare("DELETE FROM comments_count WHERE uid = :uid");
        $stmt->execute(array(
            ':uid' => "community_" . $communityNumber
        ));
    }






































    //작품 목록 정보 반환
    function getWorkListInfo($numberList, $sort = 0, $contentsType = 0, $isIncludeWorkNumbers = false, $isIncludeUserInfo = false) {
        if ($numberList == '') { return null; }
        global $pdo, $myUserInfo;

        if (isset($myUserInfo) == false) {
            $myUserInfo = getMyLoginInfo();
        }

        //
        $numberList = explode(',', $numberList);
        $numberList_implode = implode(",", $numberList);
        $numberList_length = count($numberList);

        $select = 'number, user_number, title, count, public_status, updated_date';

        if ($numberList_length > 1) {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM work_list WHERE number IN (" . $numberList_implode . ") ORDER BY FIELD(number, " . $numberList_implode . ")");
            $stmt->execute();
            $result = $stmt->fetchAll();   $result_length = count($result);
        } else {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM work_list WHERE number = :number");
            $stmt->execute(array(
                "number" => $numberList[0],
            ));
            $result = $stmt->fetchAll();   $result_length = count($result);
        }

        if ($isIncludeUserInfo == true) {
            //유저 정보
            $userNumbers = array();
            for ($i = 0; $i < $result_length; $i++) {
                $userNumbers[] = $result[$i]["user_number"];
            }
            $userArray = array();
            if (count($userNumbers) != 0) {
                $userInfo = getUserInfo(implode(',', $userNumbers));
                $userInfo_count = count($userInfo);
                for ($i = 0; $i < $userInfo_count; $i++) {
                    $userArray[$userInfo[$i]["number"]] = $userInfo[$i];
                }
            }
        }

        $sortOrderSql = "";
        if ($sort == 0) {
            $sortOrderSql = " ORDER BY sort_order ASC";
        }

        //작품 번호
        $stmt = $pdo->prepare("SELECT work_list_number, work_number, contents_type FROM work_list_works WHERE work_list_number IN (" . $numberList_implode . ")" . $sortOrderSql);
        $stmt->execute();
        $workListWorksInfo = $stmt->fetchAll();
        $workListWorksInfo_length = count($workListWorksInfo);
        $workListWorkNumbers = array();
        $workListWorkTypes = array();
        for ($i = 0; $i < $workListWorksInfo_length; $i++) {
            $workListWorksData = $workListWorksInfo[$i];
            $workListWorkNumbers[$workListWorksData["work_list_number"]][] = $workListWorksData["work_number"];
            $workListWorkTypes[$workListWorksData["work_list_number"]][] = $workListWorksData["contents_type"];
        }
        //특정 작품 타입만
        if ($contentsType != 0) {
            foreach ($workListWorkNumbers as $key => $value) {
                $newNumbers = array();
                $workListWorkNumbers_length = count($value);
                for ($i = 0; $i < $workListWorkNumbers_length; $i++) {
                    if ($contentsType == 1 && $workListWorkTypes[$key][$i] == 0) {
                        $newNumbers[] = $value[$i];
                    } else if ($contentsType == 2 && $workListWorkTypes[$key][$i] == 1) {
                        $newNumbers[] = $value[$i];
                    } else if ($contentsType == 3 && $workListWorkTypes[$key][$i] == 2) {
                        $newNumbers[] = $value[$i];
                    } else if ($contentsType == 4 && $workListWorkTypes[$key][$i] == 3) {
                        $newNumbers[] = $value[$i];
                    }
                }
                $workListWorkNumbers[$key] = $newNumbers;
            }
        }

        $totalWorkNumbers = array();
        foreach ($workListWorkNumbers as $key => $value) {
            $length = count($value);
            for ($i = 0; $i < $length; $i++) {
                $totalWorkNumbers[] = $value[$i];
            }
        }
        $totalWorkNumbers_length = count($totalWorkNumbers);
        
        //썸네일 이미지 정보 구하기
        $worksThumbnailImage = array();
        if ($totalWorkNumbers_length != 0) {
            $workInfo = getWorkInfo(implode(",", $totalWorkNumbers));
            $workInfo_length = count($workInfo);
            for ($i = 0; $i < $workInfo_length; $i++) {
                if ($workInfo[$i]["status"] == 0 && ($workInfo[$i]["public_status"] != 2 || $myUserInfo["number"] == $workInfo[$i]["user_number"])) {
                    $url = null;
                    if ($workInfo[$i]["cover_image"] == null) {
                        $url = $workInfo[$i]["default_cover_image"];
                    } else {
                        $url = $workInfo[$i]["cover_image"];
                    }
                    $worksThumbnailImage[$workInfo[$i]["number"]] = $url;
                }
            }
        }

        //
        $totalWorkNumbers = null;

        //썸네일 구하기
        $thumbnailImage = array();
        foreach ($workListWorkNumbers as $key => $value) {
            $length = count($value);
            for ($i = 0; $i < $length; $i++) {
                if (isset($worksThumbnailImage[$value[$i]])) {
                    $thumbnailImage[$key] = $worksThumbnailImage[$value[$i]];
                    break;
                }
            }
        }

        $resultArray = array();
        for ($i = 0; $i < $result_length; $i++) {
            $result_i = $result[$i];

            if ($result_i["public_status"] != 2 || ($myUserInfo["isLogin"] == true && $myUserInfo["number"] == $result_i["user_number"])) {
                $result_i["status"] = 0;
                
                //유저 정보
                if ($isIncludeUserInfo == true) {
                    $workListUserInfo = $userArray[$result_i["user_number"]];
                    $result_i["nickname"] = $workListUserInfo["nickname"];
                    $result_i["profile"] = $workListUserInfo["profile"];
                }

                //작품 번호
                if ($isIncludeWorkNumbers == true) {
                    if (isset($workListWorkNumbers[$result_i["number"]])) {
                        $workNumbers = $workListWorkNumbers[$result_i["number"]];
                        if ($sort == 1) {
                            $workNumbers = array_reverse($workNumbers);
                        }
                        $result_i["work_numbers"] = implode(",", $workNumbers);
                    } else {
                        $result_i["work_numbers"] = "";
                    }
                }

                //썸네일 이미지
                if (isset($thumbnailImage[$result_i["number"]])) {
                    $result_i["thumbnail_image"] = $thumbnailImage[$result_i["number"]];
                }

                $resultArray[$result_i["number"]] = $result_i;
            } else {
                $resultArray[$result_i["number"]] = array(
                    'status' => 1,
                    'number' => $numberList[$i]
                );
            }
        }

        $data = array();
        for ($i = 0; $i < $numberList_length; $i++) {
            if (isset($resultArray[$numberList[$i]])) {
                $data[] = $resultArray[$numberList[$i]];
            } else {
                $data[] = array(
                    'status' => 2,
                    'number' => $numberList[$i]
                );
            }
        }

        return $data;
    }

    function deleteWorkList($workListNumber) {
        global $pdo;
        
        $stmt = $pdo->prepare("DELETE FROM work_list WHERE number = :number");
        $stmt->execute(array(
            ':number' => $workListNumber
        ));
        $stmt = $pdo->prepare("DELETE FROM work_list_works WHERE work_list_number = :work_list_number");
        $stmt->execute(array(
            ':work_list_number' => $workListNumber
        ));
        $stmt = $pdo->prepare("DELETE FROM work_list_save WHERE work_list_number = :work_list_number");
        $stmt->execute(array(
            ':work_list_number' => $workListNumber
        ));
    }






































    //조회수 집계
    function includeViewedPart($partNumber) {
        global $pdo, $myUserInfo;
        if (isset($myUserInfo) == false) {
            $myUserInfo = getMyLoginInfo();
        }

        //작품 번호, 타입 구하기
        $stmt = $pdo->prepare("SELECT work_number, type, public_status FROM work_part WHERE number = :number");
        $stmt->execute(array(
            ':number' => $partNumber,
        ));
        $partInfo = $stmt->fetch();
        $workNumber = $partInfo["work_number"];
        $workType = $partInfo["type"];

        $stmt = $pdo->prepare("SELECT contents_type FROM works WHERE number = :number");
        $stmt->execute(array(
            ':number' => $workNumber,
        ));
        $contentsType = $stmt->fetch()["contents_type"];

        //
        if (isset($workNumber)) {
            $partViewed = null;
            $userIp = getClientIp();

            if ($myUserInfo["isLogin"] == true) {
                $stmt = $pdo->prepare("SELECT public_status, percent FROM work_part_viewed WHERE part_number = :part_number AND user_number = :user_number");
                $stmt->execute(array(
                    ':part_number' => $partNumber,
                    ':user_number' => $myUserInfo["number"],
                ));
                $partViewed = $stmt->fetch();
            } else {
                $stmt = $pdo->prepare("SELECT public_status, percent FROM work_part_viewed WHERE part_number = :part_number AND ip = :ip");
                $stmt->execute(array(
                    ':part_number' => $partNumber,
                    ':ip' => $userIp,
                ));
                $partViewed = $stmt->fetch();
            }
    
            $user_number = null;
            $userIp2 = $userIp;
            $newDate = date("Y-m-d H:i:s");

            if ($myUserInfo["isLogin"] == true) {
                $user_number = $myUserInfo["number"];
                $userIp2 = null;
            }

            $previousPublicState = null;
            if (isset($partViewed["public_status"]) && $partViewed["public_status"] == 0) {
                $previousPublicState = 0;
            }
            $percentViewed = 0;
            if (isset($partViewed["percent"])) {
                $percentViewed = $partViewed["percent"];
            }
            $publicStatus = 1;
            if (($myUserInfo["isLogin"] == true && $myUserInfo["works_history_use"] == 1) || $previousPublicState != null) {
                $publicStatus = 0;
            }

            if ($userIp2 == null) {
                $stmt = $pdo->prepare("DELETE FROM work_part_viewed WHERE part_number = :part_number AND user_number = :user_number");
                $stmt->execute(array(
                    ':part_number' => $partNumber,
                    ':user_number' => $user_number,
                ));
            } else {
                $stmt = $pdo->prepare("DELETE FROM work_part_viewed WHERE part_number = :part_number AND ip = :ip");
                $stmt->execute(array(
                    ':part_number' => $partNumber,
                    ':ip' => $userIp2,
                ));
            }
            $sql = $pdo->prepare('insert into work_part_viewed (work_number, work_type, contents_type, part_number, user_number, ip, public_status, percent, viewed_date) values(:work_number, :work_type, :contents_type, :part_number, :user_number, :ip, :public_status, :percent, :viewed_date)');
            $sql->execute(array(
                ':work_number' => $workNumber,
                ':work_type' => $workType,
                ':contents_type' => $contentsType,
                ':part_number' => $partNumber,
                ':user_number' => $user_number,
                ':ip' => $userIp2,
                ':public_status' => $publicStatus,
                ':percent' => $percentViewed,
                ':viewed_date' => $newDate,
            ));

            if (isset($partViewed["public_status"]) == false) {
                //조회수 올리기
                $sql = $pdo->prepare('UPDATE work_part SET views = views + 1 WHERE number = :number');
                $sql->execute(array(
                    ':number' => $partNumber,
                ));
                if ($partInfo["public_status"] == 0) {
                    //작품 조회수
                    $sql = $pdo->prepare('UPDATE works SET views = views + 1 WHERE number = :number');
                    $sql->execute(array(
                        ':number' => $workNumber,
                    ));
                }
            }
        }
    }
    //최근 검색어 집계
    function includeSearchHistory($content) {
        global $pdo, $myUserInfo;
        if (isset($myUserInfo) == false) {
            $myUserInfo = getMyLoginInfo();
        }

        //
        $searchHistory = null;
        $userIp = getClientIp();

        if ($myUserInfo["isLogin"] == true) {
            $stmt = $pdo->prepare("SELECT public_status FROM search_history WHERE content = :content AND user_number = :user_number");
            $stmt->execute(array(
                ':content' => $content,
                ':user_number' => $myUserInfo["number"],
            ));
            $searchHistory = $stmt->fetch();
        } else {
            $stmt = $pdo->prepare("SELECT public_status FROM search_history WHERE content = :content AND ip = :ip");
            $stmt->execute(array(
                ':content' => $content,
                ':ip' => $userIp,
            ));
            $searchHistory = $stmt->fetch();
        }

        $user_number = null;
        $userIp2 = $userIp;
        $newDate = date("Y-m-d H:i:s");

        if ($myUserInfo["isLogin"] == true) {
            $user_number = $myUserInfo["number"];
            $userIp2 = null;
        }

        $previousPublicState = null;
        if (isset($searchHistory["public_status"]) && $searchHistory["public_status"] == 0) {
            $previousPublicState = 0;
        }
        $publicStatus = 1;
        if (($myUserInfo["isLogin"] == true && $myUserInfo["search_history_use"] == 1) || $previousPublicState != null) {
            $publicStatus = 0;
        }

        if ($userIp2 == null) {
            $stmt = $pdo->prepare("DELETE FROM search_history WHERE content = :content AND user_number = :user_number");
            $stmt->execute(array(
                ':content' => $content,
                ':user_number' => $user_number,
            ));
        } else {
            $stmt = $pdo->prepare("DELETE FROM search_history WHERE content = :content AND ip = :ip");
            $stmt->execute(array(
                ':content' => $content,
                ':ip' => $userIp2,
            ));
        }
        $sql = $pdo->prepare('insert into search_history (content, user_number, ip, public_status, search_date) values(:content, :user_number, :ip, :public_status, :search_date)');
        $sql->execute(array(
            ':content' => $content,
            ':user_number' => $user_number,
            ':ip' => $userIp2,
            ':public_status' => $publicStatus,
            ':search_date' => $newDate,
        ));
    }
    
    //뷰 퍼센트 저장
    function savePercentViewedPart($partNumber, $percent) {
        global $pdo, $myUserInfo;
        if (isset($myUserInfo) == false) {
            $myUserInfo = getMyLoginInfo();
        }

        //
        $userIp = getClientIp();

        if ($myUserInfo["isLogin"] == true) {
            $stmt = $pdo->prepare("SELECT percent FROM work_part_viewed WHERE part_number = :part_number AND user_number = :user_number");
            $stmt->execute(array(
                ':part_number' => $partNumber,
                ':user_number' => $myUserInfo["number"]
            ));
            $partViewed = $stmt->fetch();
        } else {
            $stmt = $pdo->prepare("SELECT percent FROM work_part_viewed WHERE part_number = :part_number AND ip = :ip");
            $stmt->execute(array(
                ':part_number' => $partNumber,
                ':ip' => $userIp
            ));
            $partViewed = $stmt->fetch();
        }

        if (isset($partViewed["percent"]) && $partViewed["percent"] < $percent) {

            if ($myUserInfo["isLogin"] == true) {
                $sql = $pdo->prepare('UPDATE work_part_viewed SET percent = :percent WHERE user_number = :user_number AND part_number = :part_number');
                $sql->execute(array(
                    ':user_number' => $myUserInfo["number"],
                    ':part_number' => $partNumber,
                    ':percent' => $percent,
                ));
            } else {
                $sql = $pdo->prepare('UPDATE work_part_viewed SET percent = :percent WHERE ip = :ip AND part_number = :part_number');
                $sql->execute(array(
                    ':ip' => $userIp,
                    ':part_number' => $partNumber,
                    ':percent' => $percent,
                ));
            }

        }
    }































    //뷰 퍼센트 저장
    function addWorkRevenue($workNumber) {
        global $pdo;
    
        //수익 창출 활성화 작품인지
        $stmt = $pdo->prepare("SELECT type, monetization, user_number FROM works WHERE number = :number");
        $stmt->execute(array(
            ':number' => $workNumber
        ));
        $works = $stmt->fetch();

        //해당 작품의 유저 정보
        $stmt = $pdo->prepare("SELECT partner FROM user WHERE number = :number");
        $stmt->execute(array(
            ':number' => $works["user_number"]
        ));
        $user = $stmt->fetch();
        $partner = $user["partner"];

        if (isset($works["monetization"]) && $works["monetization"] == true) {
            $add = 0; //수익 증가 정도
            //소설
            if ($works["type"] == "novel") {
                if ($partner == 2) {
                    $add += 8;
                } else if ($partner == 1) {
                    $add += 7;
                } else {
                    $add += 6;
                }
            }
            //이미지 형식
            if ($works["type"] == "image_format") {
                if ($partner == 2) {
                    $add += 13;
                } else if ($partner == 1) {
                    $add += 12;
                } else {
                    $add += 10;
                }
            }

            $sql = $pdo->prepare('UPDATE works SET revenue = revenue + :revenue, revenue_views = revenue_views + 1 WHERE number = :number');
            $sql->execute(array(
                ':revenue' => $add,
                ':number' => $workNumber
            ));
        }
    }









































    function getMostRecentlyViewedWorkNumbers($sort, $contentsType) {
        global $pdo, $myUserInfo;
        if (isset($myUserInfo) == false) {
            $myUserInfo = getMyLoginInfo();
        }

        //작품 타입
        $contents_type_text = "";
        if ($contentsType != 0) {
            $contents_type_text = " AND contents_type = :contents_type";
        }
        
        $array = array(
            'user_number' => $myUserInfo['number']
        );
        if ($contentsType == 1) {
            $array['contents_type'] = 0;
        } else if ($contentsType == 2) {
            $array['contents_type'] = 1;
        } else if ($contentsType == 3) {
            $array['contents_type'] = 2;
        } else if ($contentsType == 4) {
            $array['contents_type'] = 3;
        }
        $stmt = $pdo->prepare("SELECT work_number FROM work_part_viewed WHERE user_number = :user_number" . $contents_type_text . " AND public_status = 0 ORDER BY number DESC");
        $stmt->execute($array);
        $result = $stmt->fetchAll();
        $result_length = count($result);

        $numbers = array();
        for ($i = 0; $i < $result_length; $i++) {
            $numbers[] = $result[$i]['work_number'];
        }
        $numbers = array_unique($numbers); //중복 제거
        ($sort == 1) ? $numbers = array_reverse($numbers) : null; //정렬

        return $numbers;
    }






















    //인기 콘텐츠
    function getPopularityContentsWorkNumbers($contentsType, $exceptNumbers = array(), $limit = 1000) {
        global $pdo, $myUserInfo;
        if (isset($myUserInfo) == false) {
            $myUserInfo = getMyLoginInfo();
        }

        $contentsTypeSql = "1 = 1";
        if ($contentsType == 1) {
            $contentsTypeSql = "contents_type = 0";
        } else if ($contentsType == 2) {
            $contentsTypeSql = "contents_type = 1";
        } else if ($contentsType == 3) {
            $contentsTypeSql = "contents_type = 2";
        } else if ($contentsType == 4) {
            $contentsTypeSql = "contents_type = 3";
        }

        //유저 관심 없음 작품
        if ($myUserInfo["isLogin"] == true) {
            $stmt = $pdo->prepare("SELECT work_number FROM not_interested WHERE user_number = :user_number");
            $stmt->execute(array(
                ":user_number" => $myUserInfo["number"]
            ));
            $notInterested = $stmt->fetchAll();
            $notInterested_length = count($notInterested);
            for ($i = 0; $i < $notInterested_length; $i++) {
                $exceptNumbers[] = $notInterested[$i]["work_number"];
            }
        }

        $sqlExcept = "";
        if (count($exceptNumbers) != 0) {
            $sqlExcept = " AND work_number NOT IN (" . implode(",", $exceptNumbers) . ")";
        }

        $stmt = $pdo->prepare("SELECT work_number FROM works_cache WHERE " . $contentsTypeSql . $sqlExcept . " ORDER BY RAND() LIMIT " . $limit);
        $stmt->execute();
        $workInfo = $stmt->fetchAll();
        $workInfo_length = count($workInfo);

        $numbers = array();
        for ($i = 0; $i < $workInfo_length; $i++) {
            $numbers[] = $workInfo[$i]["work_number"];
        }
        
        return $numbers;
    }





















    //맞춤 콘텐츠
    function getCustomContentsWorkNumbers($contentsType) {
        global $pdo, $myUserInfo;
        if (isset($myUserInfo) == false) {
            $myUserInfo = getMyLoginInfo();
        }

        //사용자 언어
        $userLanguage = null;
        if (isset($_POST["lang"])) {
            $userLanguage = $_POST["lang"];
        }

        //최대 작품 점수
        $stmt = $pdo->prepare("SELECT MAX(score) FROM works_cache");
        $stmt->execute();
        $maxScore = $stmt->fetch()["MAX(score)"];

        //유저의 분석 데이터 구하기
        $stmt = $pdo->prepare("SELECT analysis FROM user_cache WHERE user_number = :user_number");
        $stmt->execute(array(
            ":user_number" => $myUserInfo["number"]
        ));
        $userCache = $stmt->fetch();
        $analysis = array();
        if (isset($userCache["analysis"])) {
            $analysis = json_decode($userCache["analysis"], true);
        }

        //유저 관심 없음 작품
        $stmt = $pdo->prepare("SELECT work_number FROM not_interested WHERE user_number = :user_number");
        $stmt->execute(array(
            ":user_number" => $myUserInfo["number"]
        ));
        $notInterested = $stmt->fetchAll();
        $notInterested_length = count($notInterested);
        $notInterestedNumbers = array();
        for ($i = 0; $i < $notInterested_length; $i++) {
            $notInterestedNumbers[] = $notInterested[$i]["work_number"];
        }

        /*
            맞춤 콘텐츠를 추천해주는 비율
            만약 데이터가 부족하다면 비율이 낮다.
            데이터가 모일 경우 비율이 1로 가까워 진다.
        */
        $referralRate = 0;                          //추천 비율
        $minPopularity = 0;                         //최소 인기도 (1로 가까워질 수록 인기 있는 작품만 추출)
        $maxPopularity = 0.8;                       //최대 인기도 (최소 인기도가 MAX 값을 넘으면 MAX 값으로 변경)
        $maxCount = 300;                            //최대 반환 작품 수 (적당한 값으로 설정)
        
        //정확도가 0.2 이상이여함
        if (isset($analysis["accuracy"]) && $analysis["accuracy"] > 0.3) {
            $referralRate = $analysis["accuracy"]; //추천 비율을 정확도로 설정
            $referralRate -= 0.3; //최대 0.7
        }
        //최소 인기도
        if (isset($analysis["averageScore"])) {
            $minPopularity = ($analysis["averageScore"] - ($maxScore / 2)) / $maxScore;
            if ($minPopularity < 0) {
                $minPopularity = 0;
            } else {
                $minPopularity *= 2;
                ($minPopularity > $maxPopularity) ? $minPopularity = $maxPopularity : null;
            }
        }
        /*
            목표 비율
            70% = 맞춤 콘텐츠
            20% = 인기 콘텐츠
            10% = 볼 가능성이 높은 최근 본 작품 (앞 부분 노출)
        */

        //추천할 작품 개수
        $referralWorksCount = round($maxCount * $referralRate);

        $contentsTypeSql = null;
        if ($contentsType == 1) {
            $contentsTypeSql = "contents_type = 0";
        } else if ($contentsType == 2) {
            $contentsTypeSql = "contents_type = 1";
        } else if ($contentsType == 3) {
            $contentsTypeSql = "contents_type = 2";
        } else if ($contentsType == 4) {
            $contentsTypeSql = "contents_type = 3";
        }

        $numbers = array();
        $numbers_length = 0;

        //
        $selectList = array();
        if ($referralRate != 0) {
            //콘텐츠 타입 추천 퍼센트 구하기
            if ($contentsTypeSql == null) {
                $contentsTypeRatio = array(
                    0 => (isset($analysis["contentsType"]["novel"])) ? $analysis["contentsType"]["novel"]["viewRate"] : 0,
                    1 => (isset($analysis["contentsType"]["comics"])) ? $analysis["contentsType"]["comics"]["viewRate"] : 0,
                    2 => (isset($analysis["contentsType"]["webtoon"])) ? $analysis["contentsType"]["webtoon"]["viewRate"] : 0,
                    3 => (isset($analysis["contentsType"]["cartoon"])) ? $analysis["contentsType"]["cartoon"]["viewRate"] : 0
                );
                $contentsType0 = "(contents_type = 0 AND " . (1 - $contentsTypeRatio[0]) . " < RAND())";
                $contentsType1 = "(contents_type = 1 AND " . (1 - $contentsTypeRatio[1]) . " < RAND())";
                $contentsType2 = "(contents_type = 2 AND " . (1 - $contentsTypeRatio[2]) . " < RAND())";
                $contentsType3 = "(contents_type = 3 AND " . (1 - $contentsTypeRatio[3]) . " < RAND())";
                $contentsTypeSql = "(" . $contentsType0 . " OR " . $contentsType1 . " OR " . $contentsType2 . " OR " . $contentsType3 . ")";
            }

            //원작 언어
            $originalLanguage = null;
            $maxOriginalLanguage = 0;
            foreach ($analysis["language"] as $key => $value) {
                if ($value["viewRate"] > $maxOriginalLanguage) {
                    $maxOriginalLanguage = $value["viewRate"];
                    $originalLanguage = $key;
                }
            }

            //일반, 15금, 19금 추천 퍼센트 구하기
            $userAgeRatio = array(
                0 => (isset($analysis["userAge"]["no_age_limit"])) ? $analysis["userAge"]["no_age_limit"]["viewRate"] : 0,
                1 => (isset($analysis["userAge"]["need_attention"])) ? $analysis["userAge"]["need_attention"]["viewRate"] : 0,
                2 => (isset($analysis["userAge"]["adult"])) ? $analysis["userAge"]["adult"]["viewRate"] : 0
            );
            $userAge0 = "(user_age = 0 AND " . (1 - $userAgeRatio[0]) . " < RAND())";
            $userAge1 = "(user_age = 1 AND " . (1 - $userAgeRatio[1]) . " < RAND())";
            $userAge2 = "(user_age = 2 AND " . (1 - $userAgeRatio[2]) . " < RAND())";
            $userAgeSql = "(" . $userAge0 . " OR " . $userAge1 . " OR " . $userAge2 . ")";

            //장르
            $genreList = array();
            foreach ($analysis["relatedGenre"] as $key => $value) {
                $genreList[] = "(genre = '" . $key . "' AND " . (1 - $value["viewRate"]) . " < RAND())";
            }
            $genreSql = "";
            if (count($genreList) != 0) {
                $genreSql = " AND (" . implode(" OR ", $genreList) . ")";
            }

            //원작 언어
            $languageList = array();
            foreach ($analysis["language"] as $key => $value) {
                $languageList[] = "(original_language = '" . $key . "' AND " . (1 - $value["viewRate"]) . " < RAND())";
            }
            $languageSql = "";
            if (count($languageList) != 0) {
                $languageSql = " AND (" . implode(" OR ", $languageList) . ")";
            }

            //최소 인기도
            $minScore = round($maxScore * $minPopularity);

            //관심 없음 작품
            $notInterestedSql = "";
            if ($notInterested_length != 0) {
                $notInterestedSql = " AND work_number IN NOT (" . implode(",", $notInterestedNumbers) . ")";
            }

            $select = "SELECT work_number FROM works_cache WHERE " . $contentsTypeSql . " AND " . $userAgeSql . $genreSql . $languageSql . $notInterestedSql . " AND INSTR(language, :language) > 0 AND score > :min_score ORDER BY RAND() LIMIT " . $referralWorksCount;
            $stmt = $pdo->prepare($select);
            $stmt->execute(array(
                ':language' => $userLanguage,
                ':min_score' => $minScore
            ));
            $works = $stmt->fetchAll();
            $works_length = count($works);

            for ($i = 0; $i < $works_length; $i++) {
                $numbers[] = $works[$i]["work_number"];
            }
            $numbers_length = count($numbers);
        }

        //채워지지 않은 부분 채우기
        if (($maxCount - $numbers_length) != 0) {
            $fillWorks = getPopularityContentsWorkNumbers($contentsType, $numbers, ($maxCount - $numbers_length));
            $fillWorks_length = count($fillWorks);

            for ($i = 0; $i < $fillWorks_length; $i++) {
                $numbers[] = $fillWorks[$i];
            }
        }

        //랜덤하게 섞는다.
        shuffle($numbers);
        
        return $numbers;
    }











































    function getNotificationsInfo($numberList) {
        if ($numberList == '') { return null; }
        global $pdo, $myUserInfo;
        if (isset($myUserInfo) == false) {
            $myUserInfo = getMyLoginInfo();
        }

        //반환할 수
        $numberList_count = explode(',', $numberList);

        $select = 'number, type, data, updated_date, confirm';

        if ($numberList_count > 1) {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM user_notifications WHERE number IN (" . $numberList . ") AND user_number = :user_number ORDER BY FIELD(number, " . $numberList . ")");
            $stmt->execute(array(
                "user_number" => $myUserInfo["number"]
            ));
            $result = $stmt->fetchAll();   $result_length = count($result);
        } else {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM user_notifications WHERE number = :number AND user_number = :user_number");
            $stmt->execute(array(
                "number" => $numberList,
                "user_number" => $myUserInfo["number"]
            ));
            $result = $stmt->fetchAll();   $result_length = count($result);
        }

        //필요한 데이터 구하기
        $senderNumbers = array();
        $workNumbers = array();
        $partNumbers = array();
        $communityNumbers = array();
        $commentsNumbers = array();
        $ratingsNumbers = array();
        $reviewedQuestionsNumbers = array();

        $resultArray = array();
        for ($i = 0; $i < $result_length; $i++) {
            $result_i = $result[$i];
            $data = json_decode($result_i["data"], true);

            if ($result_i["type"] == 0) {
                $senderNumbers[] = $data["senderNumber"];
                $workNumbers[] = $data["workNumber"];
                $partNumbers[] = $data["partNumber"];
            } else if ($result_i["type"] == 1) {
                $senderNumbers[] = $data["senderNumber"];
                $workNumbers[] = $data["workNumber"];
                $communityNumbers[] = $data["communityNumber"];
            } else if ($result_i["type"] == 2) {
                $senderNumbers[] = $data["senderNumber"];
                $commentsNumbers[] = $data["commentsNumber"];
            } else if ($result_i["type"] == 3) {
                $senderNumbers[] = $data["senderNumber"];
                $workNumbers[] = $data["workNumber"];
                $ratingsNumbers[] = $data["ratingsNumber"];
            } else if ($result_i["type"] == 4) {
                $senderNumbers[] = $data["senderNumber"];
                $reviewedQuestionsNumbers[] = $data["reviewedQuestionsNumber"];
            } else if ($result_i["type"] == 5) {
                $senderNumbers[] = $data["senderNumber"];
            } else if ($result_i["type"] == 6) {
                $senderNumbers[] = $data["senderNumber"];
                $workNumbers[] = $data["workNumber"];
            } else if ($result_i["type"] == 7) {
                $senderNumbers[] = $data["senderNumber"];
                $workNumbers[] = $data["workNumber"];
            } else if ($result_i["type"] == 8) {
                $senderNumbers[] = $data["senderNumber"];
            } else if ($result_i["type"] == 10) {
                $senderNumbers[] = $data["senderNumber"];
                $workNumbers[] = $data["workNumber"];
                $partNumbers[] = $data["partNumber"];
            }
        }
        //가져올 데이터 중복 제거
        $senderNumbers = array_unique($senderNumbers);
        $workNumbers = array_unique($workNumbers);
        $partNumbers = array_unique($partNumbers);
        $communityNumbers = array_unique($communityNumbers);
        $commentsNumbers = array_unique($commentsNumbers);
        $ratingsNumbers = array_unique($ratingsNumbers);
        $reviewedQuestionsNumbers = array_unique($reviewedQuestionsNumbers);
        //데이터 가져오기
        $senderInfoList = getUserInfo(implode(",", $senderNumbers));
        $workInfoList = getWorkInfo(implode(",", $workNumbers));
        $partInfoList = getWorkPartInfo(implode(",", $partNumbers));
        $communityInfoList = getCommunityInfo(implode(",", $communityNumbers));
        $commentsInfoList = getCommentsInfo(implode(",", $commentsNumbers));
        $ratingsInfoList = getRatingsInfo(implode(",", $ratingsNumbers));
        $reviewedQuestionsInfoList = getReviewedQuestionsInfo(implode(",", $reviewedQuestionsNumbers));

        $senderInfo = array();
        $workInfo = array();
        $partInfo = array();
        $communityInfo = array();
        $commentsInfo = array();
        $ratingsInfo = array();
        $reviewedQuestionsInfo = array();

        if (isset($senderInfoList)) {
            $senderInfoList_length = count($senderInfoList);
            for ($i = 0; $i < $senderInfoList_length; $i++) {
                $senderInfo[$senderInfoList[$i]["number"]] = $senderInfoList[$i];
            }
        }
        if (isset($workInfoList)) {
            $workInfoList_length = count($workInfoList);
            for ($i = 0; $i < $workInfoList_length; $i++) {
                $workInfo[$workInfoList[$i]["number"]] = $workInfoList[$i];
            }
        }
        if (isset($partInfoList)) {
            $partInfoList_length = count($partInfoList);
            for ($i = 0; $i < $partInfoList_length; $i++) {
                $partInfo[$partInfoList[$i]["number"]] = $partInfoList[$i];
            }
        }
        if (isset($communityInfoList)) {
            $communityInfoList_length = count($communityInfoList);
            for ($i = 0; $i < $communityInfoList_length; $i++) {
                $communityInfo[$communityInfoList[$i]["number"]] = $communityInfoList[$i];
            }
        }
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
        if (isset($reviewedQuestionsInfoList)) {
            $reviewedQuestionsInfoList_length = count($reviewedQuestionsInfoList);
            for ($i = 0; $i < $reviewedQuestionsInfoList_length; $i++) {
                $reviewedQuestionsInfo[$reviewedQuestionsInfoList[$i]["number"]] = $reviewedQuestionsInfoList[$i];
            }
        }

        $resultArray = array();
        for ($i = 0; $i < $result_length; $i++) {
            $result_i = $result[$i];
            $data = json_decode($result_i["data"], true);
            $array = array();

            if ($result_i["type"] == 0) {
                //반환 형태
                /*
                    senderInfo: {
                        profile: Array(),
                        nickname: Mkkas3145
                    }
                    workInfo: {
                        status: 0,
                        title: "전생했더니 슬라임이었던 건에 대하여"
                    }
                    partInfo: {
                        status: 0,
                        title: "지위향상편 1화"
                        thumbnailImage: "https://img.louibooks.com/..."
                    }
                    number: ...
                    type: ...
                    date: ...
                */
                $array["senderInfo"] = array(
                    "profile" => $senderInfo[$data["senderNumber"]]["profile"],
                    "nickname" => $senderInfo[$data["senderNumber"]]["nickname"]
                );
                if ($workInfo[$data["workNumber"]]["status"] == 0) {
                    $array["workInfo"] = array(
                        "status" => 0,
                        "number" => $workInfo[$data["workNumber"]]["number"],
                        "title" => $workInfo[$data["workNumber"]]["title"]
                    );
                } else {
                    $array["workInfo"] = array(
                        "status" => $workInfo[$data["workNumber"]]["status"],
                        "number" => $workInfo[$data["workNumber"]]["number"]
                    );
                }
                if ($partInfo[$data["partNumber"]]["status"] == 0) {
                    $array["partInfo"] = array(
                        "status" => 0,
                        "number" => $partInfo[$data["partNumber"]]["number"],
                        "type" => $partInfo[$data["partNumber"]]["type"],
                        "title" => $partInfo[$data["partNumber"]]["title"],
                        "thumbnailImage" => $partInfo[$data["partNumber"]]["thumbnail_image"],
                        "category" => $partInfo[$data["partNumber"]]["category"],
                        "episode" => $partInfo[$data["partNumber"]]["episode"]
                    );
                } else {
                    $array["partInfo"] = array(
                        "status" => $partInfo[$data["partNumber"]]["status"],
                        "number" => $partInfo[$data["partNumber"]]["number"]
                    );
                }
            } else if ($result_i["type"] == 1) {
                //반환 형태
                /*
                    senderInfo: {
                        profile: Array(),
                        nickname: Mkkas3145
                    }
                    workInfo: {
                        status: 0,
                        title: "전생했더니 슬라임이었던 건에 대하여"
                    }
                    communityInfo: {
                        status: 0,
                        data: ...
                    }
                    number: ...
                    type: ...
                    date: ...
                */
                $array["senderInfo"] = array(
                    "profile" => $senderInfo[$data["senderNumber"]]["profile"],
                    "nickname" => $senderInfo[$data["senderNumber"]]["nickname"]
                );
                if ($workInfo[$data["workNumber"]]["status"] == 0) {
                    $array["workInfo"] = array(
                        "status" => 0,
                        "number" => $workInfo[$data["workNumber"]]["number"],
                        "title" => $workInfo[$data["workNumber"]]["title"]
                    );
                } else {
                    $array["workInfo"] = array(
                        "status" => $workInfo[$data["workNumber"]]["status"],
                        "number" => $workInfo[$data["workNumber"]]["number"]
                    );
                }
                if (isset($communityInfo[$data["communityNumber"]])) {
                    $array["communityInfo"] = array(
                        "status" => 0,
                        "number" => $communityInfo[$data["communityNumber"]]["number"],
                        "content" => $communityInfo[$data["communityNumber"]]["content"]
                    );
                } else {
                    $array["communityInfo"] = array(
                        "status" => 1, //삭제됨
                        "number" => $data["communityNumber"]
                    );
                }
            } else if ($result_i["type"] == 2) {
                //반환 형태
                /*
                    senderInfo: {
                        profile: Array(),
                        nickname: Mkkas3145
                    }
                    commentsInfo: {
                        status: 0,
                        data: ...
                    }
                    number: ...
                    type: ...
                    date: ...
                */
                $array["senderInfo"] = array(
                    "profile" => $senderInfo[$data["senderNumber"]]["profile"],
                    "nickname" => $senderInfo[$data["senderNumber"]]["nickname"]
                );
                if (isset($commentsInfo[$data["commentsNumber"]])) {
                    $array["commentsInfo"] = array(
                        "status" => 0,
                        "number" => $commentsInfo[$data["commentsNumber"]]["number"],
                        "content" => $commentsInfo[$data["commentsNumber"]]["content"]
                    );
                } else {
                    $array["commentsInfo"] = array(
                        "status" => 1, //삭제됨
                        "number" => $data["commentsNumber"]
                    );
                }
            } else if ($result_i["type"] == 3) {
                //반환 형태
                /*
                    senderInfo: {
                        profile: Array(),
                        nickname: Mkkas3145
                    }
                    workInfo: {
                        status: 0,
                        title: "전생했더니 슬라임이었던 건에 대하여"
                    }
                    ratingsInfo: {
                        status: 0,
                        data: ...
                    }
                    number: ...
                    type: ...
                    date: ...
                */
                $array["senderInfo"] = array(
                    "profile" => $senderInfo[$data["senderNumber"]]["profile"],
                    "nickname" => $senderInfo[$data["senderNumber"]]["nickname"]
                );
                if ($workInfo[$data["workNumber"]]["status"] == 0) {
                    $array["workInfo"] = array(
                        "status" => 0,
                        "number" => $workInfo[$data["workNumber"]]["number"],
                        "title" => $workInfo[$data["workNumber"]]["title"]
                    );
                } else {
                    $array["workInfo"] = array(
                        "status" => $workInfo[$data["workNumber"]]["status"],
                        "number" => $workInfo[$data["workNumber"]]["number"]
                    );
                }
                if (isset($ratingsInfo[$data["ratingsNumber"]])) {
                    $array["ratingsInfo"] = array(
                        "status" => 0,
                        "number" => $ratingsInfo[$data["ratingsNumber"]]["number"],
                        "content" => $ratingsInfo[$data["ratingsNumber"]]["content"],
                        "score" => $ratingsInfo[$data["ratingsNumber"]]["score"]
                    );
                } else {
                    $array["ratingsInfo"] = array(
                        "status" => 1, //삭제됨
                        "number" => $data["ratingsNumber"]
                    );
                }
            } else if ($result_i["type"] == 4) {
                //반환 형태
                /*
                    senderInfo: {
                        profile: Array(),
                        nickname: Mkkas3145
                    }
                    reviewedQuestionsInfo: {
                        status: 0,
                        data: ...
                    }
                    number: ...
                    type: ...
                    date: ...
                */
                $array["senderInfo"] = array(
                    "profile" => $senderInfo[$data["senderNumber"]]["profile"],
                    "nickname" => $senderInfo[$data["senderNumber"]]["nickname"]
                );
                if (isset($reviewedQuestionsInfo[$data["reviewedQuestionsNumber"]])) {
                    $array["reviewedQuestionsInfo"] = array(
                        "status" => 0,
                        "number" => $reviewedQuestionsInfo[$data["reviewedQuestionsNumber"]]["number"],
                        "content" => $reviewedQuestionsInfo[$data["reviewedQuestionsNumber"]]["reply"]["content"]
                    );
                } else {
                    $array["reviewedQuestionsInfo"] = array(
                        "status" => 1, //삭제됨
                        "number" => $data["reviewedQuestionsNumber"]
                    );
                }
            } else if ($result_i["type"] == 5) {
                //반환 형태
                /*
                    senderInfo: {
                        profile: Array(),
                        nickname: Mkkas3145
                    }
                    reason: ...
                    content: ...
                    number: ...
                    type: ...
                    date: ...
                */
                $array["senderInfo"] = array(
                    "profile" => $senderInfo[$data["senderNumber"]]["profile"],
                    "nickname" => $senderInfo[$data["senderNumber"]]["nickname"]
                );
                $array["reason"] = $data["reason"];
                $array["content"] = $data["content"];
            } else if ($result_i["type"] == 6) {
                //반환 형태
                /*
                    senderInfo: {
                        profile: Array(),
                        nickname: Mkkas3145
                    }
                    workInfo: {
                        status: 0,
                        title: "전생했더니 슬라임이었던 건에 대하여"
                    }
                    reason: ...
                    number: ...
                    type: ...
                    date: ...
                */
                $array["senderInfo"] = array(
                    "profile" => $senderInfo[$data["senderNumber"]]["profile"],
                    "nickname" => $senderInfo[$data["senderNumber"]]["nickname"]
                );
                if ($workInfo[$data["workNumber"]]["status"] == 0) {
                    $array["workInfo"] = array(
                        "status" => 0,
                        "number" => $workInfo[$data["workNumber"]]["number"],
                        "title" => $workInfo[$data["workNumber"]]["title"]
                    );
                } else {
                    $array["workInfo"] = array(
                        "status" => $workInfo[$data["workNumber"]]["status"],
                        "number" => $workInfo[$data["workNumber"]]["number"]
                    );
                }
                $array["reason"] = $data["reason"];
                $array["creatorPermission"] = $data["creatorPermission"];
            } else if ($result_i["type"] == 7) {
                //반환 형태
                /*
                    senderInfo: {
                        profile: Array(),
                        nickname: Mkkas3145
                    }
                    workInfo: {
                        status: 0,
                        title: "전생했더니 슬라임이었던 건에 대하여"
                    }
                    approvalType: ...
                    number: ...
                    type: ...
                    date: ...
                */
                $array["senderInfo"] = array(
                    "profile" => $senderInfo[$data["senderNumber"]]["profile"],
                    "nickname" => $senderInfo[$data["senderNumber"]]["nickname"]
                );
                if ($workInfo[$data["workNumber"]]["status"] == 0) {
                    $array["workInfo"] = array(
                        "status" => 0,
                        "number" => $workInfo[$data["workNumber"]]["number"],
                        "title" => $workInfo[$data["workNumber"]]["title"]
                    );
                } else {
                    $array["workInfo"] = array(
                        "status" => $workInfo[$data["workNumber"]]["status"],
                        "number" => $workInfo[$data["workNumber"]]["number"]
                    );
                }
                $array["approvalType"] = $data["approvalType"];
            } else if ($result_i["type"] == 8) {
                //반환 형태
                /*
                    senderInfo: {
                        profile: Array(),
                        nickname: Mkkas3145
                    }
                    requestType: ...
                    approvalType: ...
                    number: ...
                    type: ...
                    date: ...
                */
                $array["senderInfo"] = array(
                    "profile" => $senderInfo[$data["senderNumber"]]["profile"],
                    "nickname" => $senderInfo[$data["senderNumber"]]["nickname"]
                );
                $array["requestType"] = $data["requestType"];
                $array["approvalType"] = $data["approvalType"];
            } else if ($result_i["type"] == 9) {
                //반환 형태
                /*
                    status: ...
                    revenue: ...
                    number: ...
                    type: ...
                    date: ...
                */
                $array["status"] = $data["status"];
                $array["revenue"] = $data["revenue"];
            } else if ($result_i["type"] == 10) {
                //반환 형태
                /*
                    senderInfo: {
                        profile: Array(),
                        nickname: Mkkas3145
                    }
                    workInfo: {
                        status: 0,
                        title: "전생했더니 슬라임이었던 건에 대하여"
                    }
                    partInfo: {
                        status: 0,
                        title: "지위향상편 1화"
                        thumbnailImage: "https://img.louibooks.com/..."
                    }
                    number: ...
                    type: ...
                    date: ...
                */
                $array["senderInfo"] = array(
                    "profile" => $senderInfo[$data["senderNumber"]]["profile"],
                    "nickname" => $senderInfo[$data["senderNumber"]]["nickname"]
                );
                if ($workInfo[$data["workNumber"]]["status"] == 0) {
                    $array["workInfo"] = array(
                        "status" => 0,
                        "number" => $workInfo[$data["workNumber"]]["number"],
                        "title" => $workInfo[$data["workNumber"]]["title"]
                    );
                } else {
                    $array["workInfo"] = array(
                        "status" => $workInfo[$data["workNumber"]]["status"],
                        "number" => $workInfo[$data["workNumber"]]["number"]
                    );
                }
                if ($partInfo[$data["partNumber"]]["status"] == 0) {
                    $array["partInfo"] = array(
                        "status" => 0,
                        "number" => $partInfo[$data["partNumber"]]["number"],
                        "type" => $partInfo[$data["partNumber"]]["type"],
                        "title" => $partInfo[$data["partNumber"]]["title"],
                        "thumbnailImage" => $partInfo[$data["partNumber"]]["thumbnail_image"],
                        "category" => $partInfo[$data["partNumber"]]["category"],
                        "episode" => $partInfo[$data["partNumber"]]["episode"]
                    );
                } else {
                    $array["partInfo"] = array(
                        "status" => $partInfo[$data["partNumber"]]["status"],
                        "number" => $partInfo[$data["partNumber"]]["number"]
                    );
                }
                $array["sendType"] = $data["sendType"];
            }

            $array["number"] = $result_i["number"];
            $array["type"] = $result_i["type"];
            $array["date"] = $result_i["updated_date"];
            $array["confirm"] = $result_i["confirm"];
            $resultArray[] = $array;
        }

        return $resultArray;
    }




    


    




    $location = null;

    /*
        해당 아이피는 어떤 나라에 있을 까
    */
    function getLocation() {
        global $pdo;

        $ip = getClientIp();
        $date = date("Y-m-d H:i:s");

        $stmt = $pdo->prepare("SELECT country, region, city, latitude, longitude, last_request_date, last_check_date FROM ip_location WHERE ip = :ip");
        $stmt->execute(array(
            "ip" => $ip
        ));
        $result = $stmt->fetch();

        $timeDifference = 0;
        if (isset($result["last_check_date"])) {
            $lastCheckDate = $result["last_check_date"];
            $timeDifference = strtotime($date) - strtotime($lastCheckDate);
            $timeDifference = $timeDifference / (60 * 60 * 24);
        }

        //데이터베이스에 해당 아이피의 나라가 없을 경우 또는 1개월이 지났을 경우
        $isExist = isset($result["country"]);
        if ($isExist == false || $timeDifference > 30) {
            $url = "ipinfo.io/" . $ip . "?token=cd066b0a897c0e";
            $cu = curl_init();
            curl_setopt($cu, CURLOPT_URL, $url);
            curl_setopt($cu, CURLOPT_POST, false);
            curl_setopt($cu, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($cu, CURLOPT_SSLVERSION, 3);
            curl_setopt($cu, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($cu, CURLOPT_TIMEOUT, 60);
            curl_setopt($cu, CURLOPT_HEADER, true);
            $result = curl_exec($cu);
            $txt_start = strpos($result, "{");
            $json_txt = substr($result, $txt_start);
            $info = json_decode($json_txt, true);
            curl_close($cu);

            $countryCode = strtolower($info["country"]);
            if ($countryCode == null || $countryCode == "") {
                $countryCode = "us";
            }

            $region = $info["region"];
            $city = $info["city"];
            $loc = explode(",", $info["loc"]);
            $latitude = $loc[0];
            $longitude = $loc[1];

            //해당 결과 값을 데이터베이스에 저장
            if ($isExist == true) {
                $sql = $pdo->prepare('UPDATE ip_location SET request = request + 1, country = :country, region = :region, city = :city, latitude = :latitude, longitude = :longitude, last_request_date = :last_request_date, last_check_date = :last_check_date WHERE ip = :ip');
                $sql->execute(array(
                    ':ip' => $ip,
                    ':country' => $countryCode,
                    ':region' => $region,
                    ':city' => $city,
                    ':latitude' => $latitude,
                    ':longitude' => $longitude,
                    ':last_request_date' => $date,
                    ':last_check_date' => $date
                ));
            } else {
                $sql = $pdo->prepare('insert into ip_location (ip, country, region, city, latitude, longitude, request, last_request_date, last_check_date) values(:ip, :country, :region, :city, :latitude, :longitude, :request, :last_request_date, :last_check_date)');
                $sql->execute(array(
                    ':ip' => $ip,
                    ':request' => 1,
                    ':country' => $countryCode,
                    ':region' => $region,
                    ':city' => $city,
                    ':latitude' => $latitude,
                    ':longitude' => $longitude,
                    ':last_request_date' => $date,
                    ':last_check_date' => $date
                ));
            }

            //중복 데이터 삭제
            $sql = $pdo->prepare('
                delete from ip_location
                where number not in (
                select number from (
                select number 
                from ip_location 
                group by `ip`) 
                as number);
            ');
            $sql->execute();

            $location = array(
                'country' => $countryCode,
                'region' => $region,
                'city' => $city,
                'latitude' => $latitude,
                'longitude' => $longitude
            );
            return $location;
        } else {
            //
            if (getTimeDifference($result["last_request_date"], $date) >= 3) {
                $sql = $pdo->prepare('UPDATE ip_location SET request = request + 1, last_request_date = :last_request_date WHERE ip = :ip');
                $sql->execute(array(
                    ':ip' => $ip,
                    ':last_request_date' => $date
                ));
            }

            $location = array(
                'country' => $result["country"],
                'region' => $result["region"],
                'city' => $result["city"],
                'latitude' => $result["latitude"],
                'longitude' => $result["longitude"]
            );
            return $location;
        }
    }











    function requestUserNotificationsPartPublic($partNumber) {
        global $serverIp, $originalKey;

        $url = "http://" . $serverIp . ":3000/sendPartPublic.php";
        curlRequestAsync($url, array(
            "key" => $originalKey, //노출하지 마십시오.
            "partNumber" => $partNumber
        ));
    }
    function requestUserNotificationsCommunityPost($communityNumber) {
        global $serverIp, $originalKey;

        $url = "http://" . $serverIp . ":3000/sendCommunityPost.php";
        curlRequestAsync($url, array(
            "key" => $originalKey, //노출하지 마십시오.
            "communityNumber" => $communityNumber
        ));
    }
    function requestUserNotificationsComments($commentsNumber, $userNumbers) {
        global $serverIp, $originalKey;

        $url = "http://" . $serverIp . ":3000/sendComments.php";
        curlRequestAsync($url, array(
            "key" => $originalKey, //노출하지 마십시오.
            "commentsNumber" => $commentsNumber,
            "userNumbers" => implode(",", $userNumbers)
        ));
    }
    function requestUserNotificationsRatings($ratingsNumber, $userNumbers) {
        global $serverIp, $originalKey;

        $url = "http://" . $serverIp . ":3000/sendRatings.php";
        curlRequestAsync($url, array(
            "key" => $originalKey, //노출하지 마십시오.
            "ratingsNumber" => $ratingsNumber,
            "userNumbers" => implode(",", $userNumbers)
        ));
    }
    function requestUserNotificationsReviewedQuestions($reviewedQuestionsNumber, $userNumbers) {
        global $serverIp, $originalKey;

        $url = "http://" . $serverIp . ":3000/sendReviewedQuestions.php";
        curlRequestAsync($url, array(
            "key" => $originalKey, //노출하지 마십시오.
            "reviewedQuestionsNumber" => $reviewedQuestionsNumber,
            "userNumbers" => implode(",", $userNumbers)
        ));
    }
    //커뮤니티 자격 박탈 알림
    function requestUserNotificationsCommunityGuideViolation($senderNumber, $type, $reason, $content, $userNumbers) {
        global $serverIp, $originalKey;

        $url = "http://" . $serverIp . ":3000/sendCommunityGuideViolation.php";
        curlRequestAsync($url, array(
            "key" => $originalKey, //노출하지 마십시오.
            "senderNumber" => $senderNumber,
            "type" => $type,
            "reason" => $reason,
            "content" => $content,
            "userNumbers" => implode(",", $userNumbers)
        ));
    }
    //크리에이터 위반 경고 누적 알림
    function requestUserNotificationsCreatorGuideViolation($senderNumber, $workNumber, $reason, $creatorPermission, $userNumbers) {
        global $serverIp, $originalKey;

        $url = "http://" . $serverIp . ":3000/sendCreatorGuideViolation.php";
        curlRequestAsync($url, array(
            "key" => $originalKey, //노출하지 마십시오.
            "senderNumber" => $senderNumber,
            "workNumber" => $workNumber,
            "reason" => $reason,
            "creatorPermission" => $creatorPermission,
            "userNumbers" => implode(",", $userNumbers)
        ));
    }
    //수익 창출 승인 관련
    /*
        type:
            0 = 승인 거절
            1 = 승인 수락
    */
    function requestUserNotificationsMonetizationApproval($senderNumber, $workNumber, $approvalType) {
        global $serverIp, $originalKey;

        $url = "http://" . $serverIp . ":3000/sendMonetizationApproval.php";
        curlRequestAsync($url, array(
            "key" => $originalKey, //노출하지 마십시오.
            "senderNumber" => $senderNumber,
            "workNumber" => $workNumber,
            "approvalType" => $approvalType
        ));
    }
    //파트너 승인 관련
    function requestUserNotificationsPartnerApproval($senderNumber, $userNumber, $requestType, $approvalType) {
        global $serverIp, $originalKey;

        $url = "http://" . $serverIp . ":3000/sendPartnerApproval.php";
        curlRequestAsync($url, array(
            "key" => $originalKey, //노출하지 마십시오.
            "senderNumber" => $senderNumber,
            "userNumber" => $userNumber,
            "requestType" => $requestType,
            "approvalType" => $approvalType
        ));
    }
    //정산 관련
    /*
        status:
            0 = 지급됨
            1 = 지급 보류
    */
    function requestUserNotificationsGiveRevenue($userNumber, $status, $revenue) {
        global $serverIp, $originalKey;

        $url = "http://" . $serverIp . ":3000/sendGiveRevenue.php";
        curlRequestAsync($url, array(
            "key" => $originalKey, //노출하지 마십시오.
            "userNumber" => $userNumber,
            "status" => $status,
            "revenue" => $revenue
        ));
    }
    //사용자 번역 관련
    /*
        sendType:
            0 = 사용자 번역 제출함
            1 = 사용자 번역 거절
            2 = 사용자 번역 수락
    */
    function requestUserNotificationsUserTranslation($senderNumber, $userNumber, $partNumber, $sendType) {
        global $serverIp, $originalKey;

        $url = "http://" . $serverIp . ":3000/sendUserTranslation.php";
        curlRequestAsync($url, array(
            "key" => $originalKey, //노출하지 마십시오.
            "senderNumber" => $senderNumber,
            "userNumber" => $userNumber,
            "partNumber" => $partNumber,
            "sendType" => $sendType
        ));
    }
    function requestUserNotificationsUserWithdrawal($userNumber) {
        global $serverIp, $originalKey;

        $url = "http://" . $serverIp . ":3000/sendUserWithdrawal.php";
        curlRequestAsync($url, array(
            "key" => $originalKey, //노출하지 마십시오.
            "userNumber" => $userNumber
        ));
    }
    function requestUserNotificationsSecurityIssue($userNumber, $sessionNumber) {
        global $serverIp, $originalKey;

        $url = "http://" . $serverIp . ":3000/sendSecurityIssue.php";
        curlRequestAsync($url, array(
            "key" => $originalKey, //노출하지 마십시오.
            "userNumber" => $userNumber,
            "sessionNumber" => $sessionNumber
        ));
    }




























































    //인기 작품
    function getTrendingWorkNumbers($genre = null) {
        global $pdo;

        $where = "";
        if (isset($genre)) {
            $where = " WHERE INSTR(genre, :genre) > 0";
        }

        $stmt = $pdo->prepare("SELECT work_number FROM works_cache" . $where . " ORDER BY score DESC LIMIT 1000");
        $data = array();
        if ($where != "") {
            $data[":genre"] = $genre;
        }
        $stmt->execute($data);
        $result = $stmt->fetchAll();
        $result_length = count($result);

        $numbers = array();
        for ($i = 0; $i < $result_length; $i++) {
            $numbers[] = $result[$i]["work_number"];
        }

        return implode(",", $numbers);
    }
    /*
        인기 작품 1000개 중에서 가장 많은 점수를 받은 장르
    */
    function getTrendingGenre() {
        global $pdo;

        $stmt = $pdo->prepare("SELECT genre, score FROM works_cache ORDER BY score DESC LIMIT 1000");
        $stmt->execute();
        $result = $stmt->fetchAll();
        $result_length = count($result);

        $score = array();
        $genreScore = array();
        for ($i = 0; $i < $result_length; $i++) {
            $genre = explode(",", $result[$i]["genre"]);
            $genre_length = count($genre);

            for ($j = 0; $j < $genre_length; $j++) {
                if (isset($genreScore[$genre[$j]])) {
                    $genreScore[$genre[$j]] += $result[$i]["score"];
                } else {
                    $genreScore[$genre[$j]] = $result[$i]["score"];
                }
            }
        }
        $sort = array();
        foreach ($genreScore as $key => $value) {
            $sort[] = $value;
        }
        array_multisort($sort, SORT_DESC, $genreScore);

        $genre = array();
        foreach ($genreScore as $key => $value) {
            if ($key != "") {
                $genre[] = $key;
            }
        }

        return implode(",", $genre);
    }













































































    function addUserPoints($userNumber, $points) {
        global $pdo;

        //포인트 기록
        $sql = $pdo->prepare('insert into points_history (user_number, points, date) values(:user_number, :points, :date)');
        $sql->execute(array(
            ':user_number' => $userNumber,
            ':points' => $points,
            ':date' => date("Y-m-d H:i:s")
        ));
    }
    function getUserRankInfo($userNumbers) {
        global $pdo;

        //30일 이내의 포인트 기록
        $stmt = $pdo->prepare("SELECT user_number, SUM(points) FROM points_history WHERE user_number IN (" . implode(",", $userNumbers) . ") AND date > :date GROUP BY user_number");
        $stmt->execute(array(
            ':date' => date("Y-m-d H:i:s", strtotime("-30 Day")),
        ));
        $pointsHistory = $stmt->fetchAll();
        $pointsHistory_length = count($pointsHistory);

        $pointsInfo = array();
        for ($i = 0; $i < $pointsHistory_length; $i++) {
            $history = $pointsHistory[$i];
            $pointsInfo[$history["user_number"]] = $history["SUM(points)"];
        }

        //현재 시간 구하기
        $newDate = date("Y-m-d H:i:s");

        //유저 정보
        $stmt = $pdo->prepare("SELECT number, premium_expiry_date FROM user WHERE number IN (" . implode(",", $userNumbers) . ")");
        $stmt->execute();
        $user = $stmt->fetchAll();
        $user_length = count($user);
        $userInfo = array();
        for ($i = 0; $i < $user_length; $i++) {
            $isPremium = false;
            $premiumExpiryDate = null;

            if (isset($user[$i]["premium_expiry_date"])) {
                //만료일 여부
                if (getTimeDifference($newDate, $user[$i]["premium_expiry_date"]) > 0) {
                    $isPremium = true;
                    $premiumExpiryDate = $user[$i]["premium_expiry_date"];
                }
            }

            $userInfo[$user[$i]["number"]] = array(
                "isPremium" => $isPremium,
                "premiumExpiryDate" => $premiumExpiryDate
            );
        }

        $info = array();
        $userNumbers_length = count($userNumbers);
        for ($i = 0; $i < $userNumbers_length; $i++) {
            $points = 0;
            if (isset($pointsInfo[$userNumbers[$i]])) {
                $points = $pointsInfo[$userNumbers[$i]];
            }
            $rank = 0;
            $nextPoints = 0; //승급하기 위해 필요한 포인트

            //브론즈
            if ($points >= 0) {
                $rank = 0;
                $maxPoints = 100;
                $nextPoints = ($maxPoints - $points);
            }
            //실버
            if ($points >= 100) {
                $rank = 1;
                $maxPoints = 300;
                $nextPoints = ($maxPoints - $points);
            }
            //골드
            if ($points >= 300) {
                $rank = 2;
                $maxPoints = 600;
                $nextPoints = ($maxPoints - $points);
            }
            //플래티넘
            if ($points >= 600) {
                $rank = 3;
                $maxPoints = 1000;
                $nextPoints = ($maxPoints - $points);
            }
            //다이아몬드
            if ($points >= 1000) {
                $rank = 4;
                $nextPoints = -1;
            }

            //프리미엄
            if (isset($userInfo[$userNumbers[$i]])) {
                if ($userInfo[$userNumbers[$i]]["isPremium"] == true) {
                    $rank = 5;
                    $nextPoints = 0;
                }
            }

            $data = array(
                "userNumber" => $userNumbers[$i],
                "maxPoints" => $maxPoints,
                "nextPoints" => $nextPoints,
                "rank" => $rank
            );
            //프리미엄이면 만료일
            if ($rank == 5) {
                $data["premiumExpiryDate"] = $userInfo[$userNumbers[$i]]["premiumExpiryDate"];
            }

            $info[] = $data;
        }

        return $info;
    }



































































    function getReviewedQuestionsInfo($numberList) {
        if ($numberList == '') { return null; }
        global $pdo, $myUserInfo;
        if (isset($myUserInfo) == false) {
            $myUserInfo = getMyLoginInfo();
        }

        //반환할 수
        $numbers = explode(',', $numberList);
        $numbers_length = count($numbers);

        $select = 'number, type, user_number, content, reply_user_number, reply_content, reviewed_date, upload_date, screenshot, likes, dislike';

        if ($numbers_length > 1) {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM reviewed_questions WHERE number IN (" . $numberList . ") ORDER BY FIELD(number, " . $numberList . ")");
            $stmt->execute();
            $result = $stmt->fetchAll();   $result_length = count($result);
        } else {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM reviewed_questions WHERE number = :number");
            $stmt->execute(array(
                "number" => $numberList,
            ));
            $result = $stmt->fetchAll();   $result_length = count($result);
        }

        //유저 정보
        $userNumbers = array();
        for ($i = 0; $i < $result_length; $i++) {
            $userNumbers[] = $result[$i]["user_number"];
            $userNumbers[] = $result[$i]["reply_user_number"];
        }
        $userArray = array();
        if (count($userNumbers) != 0) {
            $userInfo = getUserInfo(implode(',', $userNumbers));
            $userInfo_count = count($userInfo);
            for ($i = 0; $i < $userInfo_count; $i++) {
                $userArray[$userInfo[$i]["number"]] = $userInfo[$i];
            }
        }

        $data = array();
        for ($i = 0; $i < $result_length; $i++) {
            $result_r = array();
            $result_i = $result[$i];

            $resultUserInfo = $userArray[$result_i["user_number"]];
            $result_r["number"] = $result_i["number"];
            $result_r["type"] = $result_i["type"];
            $result_r["userNumber"] = $result_i["user_number"];
            $result_r["nickname"] = $resultUserInfo["nickname"];
            $result_r["profile"] = $resultUserInfo["profile"];
            $result_r["content"] = $result_i["content"];
            $result_r["date"] = $result_i["upload_date"];
            if (isset($result_i["screenshot"])) {
                $result_r["screenshot"] = json_decode($result_i["screenshot"], true);
            }

            //답변 정보
            $resultUserInfo = $userArray[$result_i["reply_user_number"]];
            $result_r["reply"] = array(
                'userNumber' => $result_i["reply_user_number"],
                'nickname' => $resultUserInfo["nickname"],
                'profile' => $resultUserInfo["profile"],
                'content' => $result_i["reply_content"],
                'date' => $result_i["reviewed_date"],
                'liked' => $result_i["likes"],
                'disliked' => $result_i["dislike"]
            );

            $data[] = $result_r;
        }

        return $data;
    }








































































    /*
        작품 분석 데이터
    */
    function getWorksAnalysisInfo($workNumber) {
        global $pdo;

        $stmt = $pdo->prepare("SELECT total_views, continuous_viewed_percent, impressions, click_through_rate, average_score, expected_revenue, expected_revenue_per_views, date FROM works_analysis WHERE work_number = :work_number");
        $stmt->execute(array(
            'work_number' => $workNumber
        ));
        $info = $stmt->fetchAll();
        $info_length = count($info);

        $analysisInfo = array(
            "byDate" => array()
        );
        for ($i = 0; $i < $info_length; $i++) {
            $analysisInfo["byDate"][] = array(
                'date' => $info[$i]["date"],
                'totalViews' => $info[$i]["total_views"],                               //전체 조회수
                'continuousViewedPercent' => $info[$i]["continuous_viewed_percent"],    //연독률
                'impressions' => $info[$i]["impressions"],                              //노출 수
                'clickThroughRate' => $info[$i]["click_through_rate"],                  //노출에서 클릭으로 이어진 수
                'averageScore' => $info[$i]["average_score"],                           //평점
                'expectedRevenue' => $info[$i]["expected_revenue"],                     //예상 수익
                'expectedRevenuePerViews' => $info[$i]["expected_revenue_per_views"]    //조회수당 예상 수익
            );
        }

        //인구 통계
        $stmt = $pdo->prepare("SELECT type, COUNT(type), location, language, COUNT(location), COUNT(language), incoming_domain, COUNT(incoming_domain), user_number FROM works_visit WHERE work_number = :work_number GROUP BY type, location, language, ISNULL(user_number), incoming_domain");
        $stmt->execute(array(
            'work_number' => $workNumber
        ));
        $worksVisit = $stmt->fetchAll();
        $worksVisit_length = count($worksVisit);

        $demographics = array();
        for ($i = 0; $i < $worksVisit_length; $i++) {
            $isLogin = isset($worksVisit[$i]["user_number"]); //로그인 여부
            $originalType = $worksVisit[$i]["type"];
            $type = "type_" . $worksVisit[$i]["type"];
            $typeCount = $worksVisit[$i]["COUNT(type)"];
            $location = $worksVisit[$i]["location"];
            $locationCount = $worksVisit[$i]["COUNT(location)"];
            $language = $worksVisit[$i]["language"];
            $languageCount = $worksVisit[$i]["COUNT(language)"];

            if (isset($worksVisit[$i]["incoming_domain"])) {
                $type = $worksVisit[$i]["incoming_domain"];
                $originalType = $worksVisit[$i]["incoming_domain"];
                $typeCount = $worksVisit[$i]["COUNT(incoming_domain)"];
            }

            if (isset($demographics[$type])) {
                //위치
                if (isset($demographics[$type]["location"][$location]) == false) {
                    $demographics[$type]["location"][$location] = array(
                        "total" => 0,
                        "logout" => 0,
                        "login" => 0
                    );
                }
                $demographics[$type]["location"]["all"]["total"] += $locationCount;
                $demographics[$type]["location"][$location]["total"] += $locationCount;
                if ($isLogin == true) {
                    $demographics[$type]["location"]["all"]["login"] += $locationCount;
                    $demographics[$type]["location"][$location]["login"] += $locationCount;
                } else {
                    $demographics[$type]["location"]["all"]["logout"] += $locationCount;
                    $demographics[$type]["location"][$location]["logout"] += $locationCount;
                }

                //언어
                if (isset($demographics[$type]["language"][$language]) == false) {
                    $demographics[$type]["language"][$language] = array(
                        "total" => 0,
                        "logout" => 0,
                        "login" => 0
                    );
                }
                $demographics[$type]["language"]["all"]["total"] += $languageCount;
                $demographics[$type]["language"][$language]["total"] += $languageCount;
                if ($isLogin == true) {
                    $demographics[$type]["language"]["all"]["login"] += $languageCount;
                    $demographics[$type]["language"][$language]["login"] += $languageCount;
                } else {
                    $demographics[$type]["language"]["all"]["logout"] += $languageCount;
                    $demographics[$type]["language"][$language]["logout"] += $languageCount;
                }

                //All
                $demographics[$type]["all"]["total"] += $typeCount;
                if ($isLogin == true) {
                    $demographics[$type]["all"]["login"] += $typeCount;
                } else {
                    $demographics[$type]["all"]["logout"] += $typeCount;
                }
            } else {
                $demographics[$type] = array(
                    'type' => $originalType,
                    'all' => array(),
                    'location' => array(),
                    'language' => array(),
                    'gender' => array(
                        'total' => 0
                    ),
                    'ageType' => array(
                        'total' => 0
                    )
                );

                //All
                if ($isLogin == true) {
                    $demographics[$type]["all"] = array(
                        "total" => $typeCount,
                        "login" => $typeCount,
                        "logout" => 0
                    );
                } else {
                    $demographics[$type]["all"] = array(
                        "total" => $typeCount,
                        "login" => 0,
                        "logout" => $typeCount
                    );
                }

                //위치
                if ($isLogin == true) {
                    $demographics[$type]["location"] = array(
                        "all" => array(
                            "total" => $locationCount,
                            "login" => $locationCount,
                            "logout" => 0
                        ),
                        $location => array(
                            "total" => $locationCount,
                            "login" => $locationCount,
                            "logout" => 0
                        )
                    );
                } else {
                    $demographics[$type]["location"] = array(
                        "all" => array(
                            "total" => $locationCount,
                            "login" => 0,
                            "logout" => $locationCount
                        ),
                        $location => array(
                            "total" => $locationCount,
                            "login" => 0,
                            "logout" => $locationCount
                        )
                    );
                }
                //언어
                if ($isLogin == true) {
                    $demographics[$type]["language"] = array(
                        "all" => array(
                            "total" => $languageCount,
                            "login" => $languageCount,
                            "logout" => 0
                        ),
                        $language => array(
                            "total" => $languageCount,
                            "login" => $languageCount,
                            "logout" => 0
                        )
                    );
                } else {
                    $demographics[$type]["language"] = array(
                        "all" => array(
                            "total" => $languageCount,
                            "login" => 0,
                            "logout" => $languageCount
                        ),
                        $language => array(
                            "total" => $languageCount,
                            "login" => 0,
                            "logout" => $languageCount
                        )
                    );
                }
            }
        }

        //인구 통계 - 성별, 나이
        $stmt = $pdo->prepare("SELECT type, COUNT(type), gender, COUNT(gender), age_type, COUNT(age_type) FROM works_visit WHERE work_number = :work_number AND (gender is NOT NULL OR age_type IS NOT NULL) GROUP BY type, gender, age_type");
        $stmt->execute(array(
            'work_number' => $workNumber
        ));
        $worksVisit = $stmt->fetchAll();
        $worksVisit_length = count($worksVisit);
        for ($i = 0; $i < $worksVisit_length; $i++) {
            $isLogin = isset($worksVisit[$i]["user_number"]); //로그인 여부
            $type = "type_" . $worksVisit[$i]["type"];
            $typeCount = $worksVisit[$i]["COUNT(type)"];
            //성별
            $gender = null;
            $genderCount = null;
            if (isset($worksVisit[$i]["gender"])) {
                $gender = $worksVisit[$i]["gender"];
                $genderCount = $worksVisit[$i]["COUNT(gender)"];
                if ($gender == 0) {
                    $gender = "male";
                } else if ($gender == 1) {
                    $gender = "female";
                }
            }
            //나이 유형
            $ageType = null;
            $ageTypeCount = null;
            if (isset($worksVisit[$i]["age_type"])) {
                $ageType = 'type_' . $worksVisit[$i]["age_type"];
                $ageTypeCount = $worksVisit[$i]["COUNT(age_type)"];
            }
            
            if (isset($demographics[$type])) {
                if ($gender != null) {
                    if (isset($demographics[$type]["gender"][$gender])) {
                        $demographics[$type]["gender"][$gender] += $genderCount;
                    } else {
                        $demographics[$type]["gender"][$gender] = $genderCount;
                    }
    
                    //All
                    $demographics[$type]["gender"]["total"] += $genderCount;
                }
                if ($ageType != null) {
                    if (isset($demographics[$type]["ageType"][$ageType])) {
                        $demographics[$type]["ageType"][$ageType] += $ageTypeCount;
                    } else {
                        $demographics[$type]["ageType"][$ageType] = $ageTypeCount;
                    }
    
                    //All
                    $demographics[$type]["ageType"]["total"] += $ageTypeCount;
                }
            }
        }

        //인구 통계 결과
        $analysisInfo["demographics"] = $demographics;
        
        //콘텐츠 분석
        $stmt = $pdo->prepare("SELECT number FROM work_part WHERE work_number = :work_number");
        $stmt->execute(array(
            'work_number' => $workNumber
        ));
        $workPart = $stmt->fetchAll();
        $workPart_length = count($workPart);
        $partNumbers = array();
        for ($i = 0; $i < $workPart_length; $i++) {
            $partNumbers[] =  $workPart[$i]["number"];
        }
        $partInfo = getWorkPartInfo(implode(",", $partNumbers));

        //연독률 구하기
        $firstViews = null;
        for ($i = 0; $i < $workPart_length; $i++) {
            if ($partInfo[$i]["status"] != 0) { continue; };
            if ($partInfo[$i]["public_status"] != 0) { continue; };

            $views = $partInfo[$i]["views"];
            if ($firstViews == null) {
                $partInfo[$i]["isFirst"] = true;
                $firstViews = $views;
            }

            if ($firstViews != 0) {
                $percent = $views / $firstViews;
                ($percent > 1) ? $percent = 1 : null;
                $partInfo[$i]["continuousViewedPercent"] = $percent;
            } else if ($views != 0) {
                $partInfo[$i]["continuousViewedPercent"] = 1;
            } else {
                $partInfo[$i]["continuousViewedPercent"] = 0;
            }
        }
        $analysisInfo["partInfo"] = $partInfo;

        return $analysisInfo;
    }







    /*
        작품 다양한 분석 데이터:
        다양한 작품의 분석 데이터를 합쳐서 가져와야 될 때 사용할 수 있다.

        가져올 수 있는 값: 전체 조회수, 예상 수익, 평균 평점
    */
    function getWorksAnalysisVariousInfo($numberList) {
        global $pdo;

        //반환할 수
        $numbers = explode(',', $numberList);
        $numbers_length = count($numbers);
        
        $select = 'SUM(expected_revenue), SUM(total_views), date';
        
        if ($numbers_length > 1) {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM works_analysis WHERE work_number IN (" . $numberList . ") GROUP BY date");
            $stmt->execute();
            $result = $stmt->fetchAll();   $result_length = count($result);
        } else {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM works_analysis WHERE work_number = :work_number GROUP BY date");
            $stmt->execute(array(
                ":work_number" => $numberList
            ));
            $result = $stmt->fetchAll();   $result_length = count($result);
        }

        $analysisInfo = array(
            "byDate" => array(),
            "expectedRevenue" => array(),   //해당 작품들의 최신 예상 수익
            "averageScore" => 0,            //평균 평점
        );
        for ($i = 0; $i < $result_length; $i++) {
            $analysisInfo["byDate"][] = array(
                'date' => $result[$i]["date"],
                'expectedRevenue' => $result[$i]["SUM(expected_revenue)"],
                'totalViews' => $result[$i]["SUM(total_views)"]
            );
            $result[$i]["date"];
        }


        //


        $select = 'work_number, expected_revenue, average_score, click_through_rate';
        
        if ($numbers_length > 1) {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM works_analysis WHERE work_number IN (" . $numberList . ")");
            $stmt->execute();
            $result = $stmt->fetchAll();   $result_length = count($result);
        } else {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM works_analysis WHERE work_number = :work_number");
            $stmt->execute(array(
                ":work_number" => $numberList
            ));
            $result = $stmt->fetchAll();   $result_length = count($result);
        }
        $expectedRevenueData = array();
        $averageScoreData = array();
        $clickThroughRateData = array();
        for ($i = 0; $i < $result_length; $i++) {
            $expectedRevenueData[$result[$i]["work_number"]] = $result[$i]["expected_revenue"];
            $averageScoreData[$result[$i]["work_number"]] = $result[$i]["average_score"];
            $clickThroughRateData[$result[$i]["work_number"]] = $result[$i]["click_through_rate"];
        }
        $totalExpectedRevenue = 0;
        for ($i = 0; $i < $numbers_length; $i++) {
            $expectedRevenue = 0;
            if (isset($expectedRevenueData[$numbers[$i]])) {
                $expectedRevenue = $expectedRevenueData[$numbers[$i]];
            }
            $analysisInfo["expectedRevenue"][] = array(
                'number' => $numbers[$i],
                'value' => $expectedRevenue
            );
            $totalExpectedRevenue += $expectedRevenue;
        }

        //평균 평점
        $averageScore = 0;
        $averageScoreCount = 0;
        foreach ($averageScoreData as $key => $value) {
            $averageScore += $value;
            $averageScoreCount ++;
        }
        if ($averageScoreCount != 0) {
            $analysisInfo["averageScore"] = $averageScore / $averageScoreCount;
        }
        //평균 연독률
        $clickThroughRate = 0;
        $clickThroughRateCount = 0;
        foreach ($clickThroughRateData as $key => $value) {
            $clickThroughRate += $value;
            $clickThroughRateCount ++;
        }
        if ($clickThroughRateCount != 0) {
            $analysisInfo["clickThroughRate"] = $clickThroughRate / $clickThroughRateCount;
        }
        //예상 수익
        $analysisInfo["totalExpectedRevenue"] = $totalExpectedRevenue;

        return $analysisInfo;
    }




















































    //연독률 구하기
    function getWorkContinuousViewedPercent($workNumber) {
        global $pdo;

        $stmt = $pdo->prepare("SELECT views FROM work_part WHERE work_number = :work_number");
        $stmt->execute(array(
            'work_number' => $workNumber
        ));
        $workPart = $stmt->fetchAll();
        $workPart_length = count($workPart);
        $startPartViews = 0;
        $endPartViews = 0;
        if (isset($workPart[0]["views"])) {
            $startPartViews = $workPart[0]["views"];
        }
        if ($workPart_length > 1) {
            $endPartViews = $workPart[$workPart_length - 1]["views"];
        }

        $continuousViewedPercent = 0;
        if ($startPartViews != 0) {
            $continuousViewedPercent = $endPartViews / $startPartViews;
        }
        ($continuousViewedPercent > 1) ? $continuousViewedPercent = 1 : null;

        return $continuousViewedPercent;
    }











































    /*
        작품들 수익 구하기
        Money = 순이익 (달러)
    */
    function getWorksRevenue($money) {
        global $pdo;
        
        $money *= 0.8; //80%
        $total = 0;

        $stmt = $pdo->prepare("SELECT number, revenue, user_number FROM works WHERE monetization = true");
        $stmt->execute();
        $works = $stmt->fetchAll();
        $works_length = count($works);

        for ($i = 0; $i < $works_length; $i++) {
            $revenue = $works[$i]["revenue"];
            $total += $revenue;
        }
        
        $data = array();
        if ($total != 0) {
            for ($i = 0; $i < $works_length; $i++) {
                $ratio = $works[$i]["revenue"] / $total;
                $revenue = ($money * $ratio);
                if ($revenue != 0) {
                    $data[] = array(
                        "number" => $works[$i]["number"],
                        "userNumber" => $works[$i]["user_number"],
                        "revenue" => $revenue
                    );
                }
            }
        }

        return $data;
    }














































    //결제가 가능한지
    function getAvailablePayment($userNumber, $orderType, $orderData) {
        global $pdo;
        $userInfo = getUserInfo($userNumber)[0];

        $data = array(
            "isAvailable" => false,
            "waitingPaymentNumbers" => array()
        );

        //현재 시간 구하기
        $newDate = date("Y-m-d H:i:s");

        //만료되지 않은 가상계좌 여부
        $paymentHistory = null;
        if ($orderData == null) {
            $stmt = $pdo->prepare("SELECT number, payment_gateway, payment_info, date FROM payment_history WHERE user_number = :user_number AND status = 2 AND order_type = :order_type");
            $stmt->execute(array(
                ':user_number' => $userNumber,
                ':order_type' => $orderType
            ));
            $paymentHistory = $stmt->fetchAll();
        } else {
            $stmt = $pdo->prepare("SELECT number, payment_gateway, payment_info, date FROM payment_history WHERE user_number = :user_number AND status = 2 AND order_type = :order_type AND order_data = :order_data");
            $stmt->execute(array(
                ':user_number' => $userNumber,
                ':order_type' => $orderType,
                ':order_data' => $orderData
            ));
            $paymentHistory = $stmt->fetchAll();
        }
        $paymentHistory_length = count($paymentHistory);
        for ($i = 0; $i < $paymentHistory_length; $i++) {
            $paymentGateway = $paymentHistory[$i]["payment_gateway"];
            $paymentInfo = json_decode($paymentHistory[$i]["payment_info"], true);
            $date = $paymentHistory[$i]["date"];

            //가상계좌가 만료되지 않으면
            if ($paymentGateway == 0) {
                //토스페이먼츠
                $difference = getTimeDifference($paymentInfo["info"]["expiryDate"], $newDate);
                
                if ($difference <= 0) {
                    $data["waitingPaymentNumbers"][] = $paymentHistory[$i]["number"];
                }
            }
        }

        if ($orderType == 0) {
            //프리미엄
            if ($userInfo["rankInfo"]["rank"] == 5) {
                $data["isAvailable"] = false;   //결제 불가
            } else {
                $data["isAvailable"] = true;    //결제 가능
            }
        }

        return $data;
    }

    //결제 완료
    function completePayment($orderId) {
        global $pdo;

        $stmt = $pdo->prepare("SELECT user_number, order_type, order_data, status FROM payment_history WHERE order_id = :order_id");
        $stmt->execute(array(
            ':order_id' => $orderId
        ));
        $paymentHistory = $stmt->fetch();

        //현재 시간 구하기
        $newDate = date("Y-m-d H:i:s");

        //상태가 대기 중이여야 함
        if (isset($paymentHistory["status"]) && $paymentHistory["status"] == 2) {
            $orderType = $paymentHistory["order_type"];
            $userNumber = $paymentHistory["user_number"];

            //결제됨으로 변경
            $sql = $pdo->prepare('UPDATE payment_history SET status = 0, due_date = :due_date WHERE order_id = :order_id');
            $sql->execute(array(
                ':order_id' => $orderId,
                ':due_date' => $newDate
            ));

            //보상 처리
            if ($orderType == 0) {
                //30일
                $timestamp = strtotime("+720 hours");

                //프리미엄
                $sql = $pdo->prepare('UPDATE user SET premium_expiry_date = :premium_expiry_date, premium_viewed = 0 WHERE number = :number');
                $sql->execute(array(
                    ':number' => $userNumber,
                    ':premium_expiry_date' => date("Y-m-d H:i:s", $timestamp)
                ));
            }
        }
    }
    //결제 취소
    function cancelPayment($orderId) {
        global $pdo;

        $stmt = $pdo->prepare("SELECT number, user_number, order_type, order_data, status FROM payment_history WHERE order_id = :order_id");
        $stmt->execute(array(
            ':order_id' => $orderId
        ));
        $paymentHistory = $stmt->fetch();

        //현재 시간 구하기
        $newDate = date("Y-m-d H:i:s");

        //상태가 결제 완료이여야 함
        if (isset($paymentHistory["status"]) && $paymentHistory["status"] == 0) {
            $orderType = $paymentHistory["order_type"];
            $userNumber = $paymentHistory["user_number"];

            //결제 취소로 변경
            $sql = $pdo->prepare('UPDATE payment_history SET status = 1, cancel_date = :cancel_date WHERE order_id = :order_id');
            $sql->execute(array(
                ':order_id' => $orderId,
                ':cancel_date' => $newDate
            ));

            //보상 취소
            if ($orderType == 0) {
                //프리미엄 취소
                $sql = $pdo->prepare('UPDATE user SET premium_expiry_date = NULL, premium_viewed = NULL WHERE number = :number');
                $sql->execute(array(
                    ':number' => $userNumber
                ));
            }
        }
    }
    //결제 내역 삭제
    function deletePayment($number) {
        global $pdo, $paymentGatewaySecretKey;

        $stmt = $pdo->prepare("SELECT number, status, payment_gateway, payment_key FROM payment_history WHERE number = :number");
        $stmt->execute(array(
            ':number' => $number
        ));
        $paymentHistory = $stmt->fetch();

        //현재 시간 구하기
        $newDate = date("Y-m-d H:i:s");

        //상태가 대기 중이면
        if (isset($paymentHistory["status"]) && $paymentHistory["status"] == 2) {
            $paymentGateway = $paymentHistory["payment_gateway"];

            //토스페이먼츠이면
            if ($paymentGateway == 0) {
                $paymentKey = $paymentHistory["payment_key"];
                $secretKey = $paymentGatewaySecretKey[0];

                $params = array(
                    "cancelReason" => "사용자가 거래 내역을 삭제함"
                );
                $url = "https://api.tosspayments.com/v1/payments/" . $paymentKey . "/cancel";
                $parts = parse_url($url);
                $fp = fsockopen("ssl://" . $parts['host'], (isset($parts['port']) ? $parts['port'] : 443), $errno, $errstr, 30);

                $json = json_encode($params);
        
                $out = "POST " . $parts['path'] . " HTTP/1.1\r\n";  
                $out.= "Host: " . $parts['host'] . "\r\n";
                $out.= "Content-Type: application/json\r\n";
                $out.= "Content-Length: " . strlen($json) . "\r\n";
                $out.= "Authorization: Basic " . base64_encode($secretKey . ":") . "\r\n";
                $out.= "Connection: Close\r\n\r\n";
                $out.= $json;
            
                fwrite($fp, $out);
                fclose($fp);
            }
        }

        //거래 내역 삭제
        $stmt = $pdo->prepare("DELETE FROM payment_history WHERE number = :number");
        $stmt->execute(array(
            ':number' => $number
        ));
    }









    /*
        결제 내역 정보를 반환함
    */
    function getPaymentHistoryInfo($numberList) {
        if ($numberList == '') { return null; }
        global $pdo, $myUserInfo;
        if (isset($myUserInfo) == false) {
            $myUserInfo = getMyLoginInfo();
        }

        //사용자 언어
        $userLanguage = null;
        if (isset($_POST["lang"])) {
            $userLanguage = $_POST["lang"];
        }

        //
        $numberList = explode(',', $numberList);
        $numberList_implode = implode(",", $numberList);
        $numberList_length = count($numberList);

        $select = 'number, user_number, order_type, order_data, payment_gateway, currency, amount, payment_info, status, due_date, cancel_date, date';

        if ($numberList_length > 1) {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM payment_history WHERE number IN (" . $numberList_implode . ") ORDER BY FIELD(number, " . $numberList_implode . ")");
            $stmt->execute();
            $result = $stmt->fetchAll();   $result_length = count($result);
        } else {
            $stmt = $pdo->prepare("SELECT " . $select . " FROM payment_history WHERE number = :number");
            $stmt->execute(array(
                "number" => $numberList[0],
            ));
            $result = $stmt->fetchAll();   $result_length = count($result);
        }

        //현재 시간 구하기
        $newDate = date("Y-m-d H:i:s");

        $resultArray = array();
        for ($i = 0; $i < $result_length; $i++) {
            $result_i = $result[$i];
            $data = array();
            
            if ($result_i["user_number"] == $myUserInfo["number"]) {
                $data["number"] = $result_i["number"];
                $data["userNumber"] = $result_i["user_number"];
                $data["orderType"] = $result_i["order_type"];
                $data["orderData"] = $result_i["order_data"];
                $data["paymentGateway"] = $result_i["payment_gateway"];
                $data["currency"] = $result_i["currency"];
                $data["amount"] = $result_i["amount"];
                $data["paymentInfo"] = json_decode($result_i["payment_info"]);
                $data["paymentStatus"] = $result_i["status"];
                //결제 완료 날짜
                if (isset($result_i["due_date"])) {
                    $data["dueDate"] = $result_i["due_date"];
                }
                //결제 취소 날짜
                if (isset($result_i["cancel_date"])) {
                    $data["cancelDate"] = $result_i["cancel_date"];
                }
                $data["date"] = $result_i["date"];

                //환불 가능한지
                $isCancellable = false;
                if ($data["paymentStatus"] == 0 && isset($data["dueDate"])) {
                    //상품 유형이 프리미엄이면
                    if ($data["orderType"] == 0) {
                        $isExpiry = false;

                        if (isset($myUserInfo["premium_viewed"])) {
                            $premiumViewed = $myUserInfo["premium_viewed"];
                            
                            $day = 14;
                            if ($premiumViewed >= 30) {
                                $day = 7;
                            }
                            //결제 완료 후 N일이 지났는지
                            if (getTimeDifference($data["dueDate"], $newDate) >= (86400 * $day)) {
                                $isExpiry = true;
                            }

                            if ($premiumViewed < 100 && $isExpiry == false) {
                                $isCancellable = true;
                            }
                        }
                    }
                }
                $data["isCancellable"] = $isCancellable;
                
                $data["status"] = 0;
            } else {
                $data["number"] = $result_i["number"];
                $data["status"] = 1; //권한 없음
            }
            $resultArray[$result_i["number"]] = $data;
        }

        $data = array();
        for ($i = 0; $i < $numberList_length; $i++) {
            if (isset($resultArray[$numberList[$i]])) {
                $data[] = $resultArray[$numberList[$i]];
            } else {
                $data[] = array(
                    'status' => 2, //존재하지 않음
                    'number' => $numberList[$i]
                );
            }
        }

        return $data;
    }
































    function deleteSaveUserList($userNumber, $savedUserNumber) {
        global $pdo;

        $stmt = $pdo->prepare("SELECT number FROM user_list WHERE user_number = :user_number AND saved_user_number = :saved_user_number");
        $stmt->execute(array(
            ':user_number' => $userNumber,
            ':saved_user_number' => $savedUserNumber
        ));
        $userList = $stmt->fetchAll();
        $userListLength = count($userList);
        if ($userListLength != 0) {
            $stmt = $pdo->prepare("DELETE FROM user_list WHERE user_number = :user_number AND saved_user_number = :saved_user_number");
            $stmt->execute(array(
                ':user_number' => $userNumber,
                ':saved_user_number' => $savedUserNumber
            ));
            $sql = $pdo->prepare('UPDATE user SET user_list_save_count = user_list_save_count - 1 WHERE number = :number');
            $sql->execute(array(
                ':number' => $savedUserNumber
            ));
        }
    }























































    /*
    
        언어

    */

    function getUserLanguageName() {
        $lang = "en";
        if (isset($_POST["lang"])) {
            $lang = $_POST["lang"];
        }
        return $lang;
    }
    function getLanguageNameList() {
        $language = array(
            "ko", "en", "ja"
        );
        return $language;
    }

    function getLanguage($type, $language = null) {
        if ($language == null) {
            $language = getUserLanguageName();
        }

        $texts = getlanguageTexts($language);
        foreach ($texts as $key => $value) {
            if ($key == $type) {
                return $value;
            }
        }

        return "...";
    }

    function getlanguageTexts($language) {
        $texts = array();
        //한국어
        if ($language == "ko") {

            //로그인 페이지
            $texts["loginPage_title"] = "Louibooks 계정에 로그인합니다.";
            $texts["signupPage_title"] = "Louibooks 계정을 생성합니다.";
            $texts["findPasswordPage_title"] = "Louibooks 계정 비밀번호를 변경합니다.";
            $texts["loginPage_input_nickname"] = "표시되는 이름";
            $texts["loginPage_input_email"] = "이메일 주소";
            $texts["loginPage_input_password"] = "비밀번호";
            $texts["loginPage_input_password2"] = "비밀번호 확인";
            $texts["loginPage_input_new_password"] = "새로운 비밀번호";
            $texts["loginPage_input_verification_code"] = "인증 코드";
            $texts["signupPage_check_box_title"] = "개인정보 수집 및 이용동의";
            $texts["signupPage_check_box_more"] = "자세히 보기";
            $texts["loginPage_button1"] = "로그인";
            $texts["loginPage_button2"] = "계속";
            $texts["loginPage_find_password"] = "비밀번호 찾기";
            $texts["loginPage_signup"] = "회원가입";
            $texts["loginPage_login"] = "로그인";
            $texts["loginPage_keep_logged_in"] = "로그인 상태를 유지합니다.";
            $texts["loginPage_state_login"] = "로그인됨";
            $texts["loginPage_state_logout"] = "로그아웃됨";
            $texts["loginPage_input_two_factor_auth"] = "2차 인증 코드";

            $texts["my_cloud_folder"] = "내 클라우드";
            $texts["louibooks_cloud"] = "루이북스 클라우드";
            $texts["louibooks_nickname_cloud"] = " 클라우드";
            $texts["louibooks_cloud_folder"] = "폴더 {R:0}개";
            $texts["louibooks_cloud_file"] = "파일 {R:0}개";
            $texts["louibooks_cloud_total_capacity"] = "보유 용량";
            $texts["louibooks_cloud_in_use"] = "사용 중";
            $texts["louibooks_cloud_storage_capacity"] = "저장 용량";

            $texts["novel_editor_please_title"] = "제목을 입력하세요.";
            $texts["novel_editor_add_sentence"] = "문장 추가";

            $texts["workspace_work_work_part"] = "작품 회차 정보";
            $texts["workspace_work_work_details"] = "작품 세부정보";
            $texts["workspace_work_work_link"] = "작품 링크";
            $texts["workspace_work_public_status"] = "공개 상태";
            $texts["workspace_work_undo_changes"] = "변경사항 실행 취소";
            $texts["workspace_work_save"] = "저장";

            $texts["user_not_found"] = "존재하지 않는 사용자";

            //----- 푸시 알림 -----

            //회차 공개
            $texts["push_notifications_description:0"] = "{R:0} 사용자가 \"{R:1}\"을(를) 공개하였습니다.";
            //커뮤니티 게시물 게시
            $texts["push_notifications_description:1"] = "{R:0} 사용자가 커뮤니티 게시물을 게시하였습니다.";
            //댓글 남김
            $texts["push_notifications_title:2"] = "{R:0} 사용자가 댓글을 남겼습니다.";
            //평가 및 리뷰 남김
            $texts["push_notifications_description:3"] = "{R:0} 사용자가 내 작품에 리뷰를 남겼습니다.";
            //문의 검토됨
            $texts["push_notifications_title:4"] = "문의가 검토되었습니다.";
            //커뮤니티 자격 박탈됨
            $texts["push_notifications_title:5"] = "커뮤니티 자격이 박탈되었습니다.";
            $texts["push_notifications_description:5"] = "Louibooks 담당자가 커뮤니티 가이드를 위반하였다고 판단하였습니다.\n자격이 박탈됨과 동시에 모든 기간 동안의 커뮤니티 활동 기록이 삭제됩니다.";
            //크리에이터 가이드 위반함
            $texts["push_notifications_title:6:true"] = "크리에이터 가이드를 위반하였습니다.";
            $texts["push_notifications_description:6:true"] = "Louibooks 담당자가 해당 작품이 크리에이터 가이드를 위반하였다고 판단하였습니다.\n해당 작품의 수익 창출이 중지됨과 동시에 가이드를 위반한 작품이 일주일 동안 비공개로 전환됩니다. 또한 일주일 동안 작품 생성이 불가합니다.";
            $texts["push_notifications_title:6:false"] = "크리에이터 자격이 박탈되었습니다.";
            $texts["push_notifications_description:6:false"] = "Louibooks 담당자가 해당 작품이 크리에이터 가이드를 위반하였다고 판단하였습니다.\n자격이 박탈됨과 동시에 모든 작품이 삭제되며 Louibooks에서의 창작 활동이 불가합니다.";
            //수익 창출 승인 검토
            $texts["push_notifications_description:7:0"] = "수익 창출 승인이 거절되었습니다.";
            $texts["push_notifications_description:7:1"] = "🎉 수익 창출이 승인되었습니다.";
            //파트너 프로그램 승인 검토
            $texts["push_notifications_title:8:0:0"] = "파트너 프로그램 참여 승인이 거절되었습니다.";
            $texts["push_notifications_title:8:0:1"] = "🎉 파트너 프로그램 참여가 승인되었습니다.";
            $texts["push_notifications_description:8:0:0"] = "Louibooks 담당자가 파트너 프로그램 참여 승인을 거절하였습니다, 자세한 내용은 Louibooks 워크스페이스 파트너 메뉴를 참고하세요.";
            $texts["push_notifications_description:8:0:1"] = "Louibooks와(과) 협력 관계가 되신 것을 축하드립니다 또한 Louibooks 파트너 PLUS 프로모션에 참여할 수 있습니다, Louibooks은(는) 크리에이터님의 창작 활동이 자유롭게 이루어질 수 있도록 노력할 것입니다.";
            //파트너 PLUS 프로모션 승인 검토
            $texts["push_notifications_title:8:1:0"] = "파트너 PLUS 프로모션 참여 승인이 거절되었습니다.";
            $texts["push_notifications_title:8:1:1"] = "🎉 파트너 PLUS 프로모션 참여가 승인되었습니다.";
            $texts["push_notifications_title:8:1:2"] = "파트너 PLUS 프로모션이 만료되었습니다.";
            $texts["push_notifications_description:8:1:0"] = "Louibooks 담당자가 파트너 PLUS 프로모션 승인을 거절하였습니다, 자세한 내용은 Louibooks 워크스페이스 파트너 메뉴를 참고하세요.";
            $texts["push_notifications_description:8:1:1"] = "Louibooks와(과) 더 긴밀한 관계가 되신 것을 축하드립니다, Louibooks은(는) 크리에이터님의 창작 활동이 자유롭게 이루어질 수 있도록 노력할 것입니다.";
            $texts["push_notifications_description:8:1:2"] = "Louibooks 담당자가 파트너 PLUS 프로모션을 만료시켰습니다, 자세한 내용은 Louibooks 워크스페이스 파트너 메뉴를 참고하세요.";
            //수익 지급
            $texts["push_notifications_title:9:0"] = "🎉 수익이 지급되었습니다.";
            $texts["push_notifications_title:9:1"] = "문제가 발생하여 지급이 보류되었습니다.";
            $texts["push_notifications_description:9:0"] = "지급된 수익: {R:0}";
            $texts["push_notifications_description:9:1"] = "지급 보류된 수익: {R:0}, 정산 과정에서 발생한 문제입니다. 잘못된 송금 세부 정보이거나 Louibooks 정산 시스템 오류일 수 있습니다. 올바른 송금 세부 정보로 변경해보십시오. 문제가 해결되지 않는 경우 Louibooks 담당자에게 문의하십시오.";
            //사용자 번역
            $texts["push_notifications_title:10:0"] = "{R:0} 사용자가 번역을 제출하였습니다.";
            $texts["push_notifications_title:10:1"] = "{R:0} 사용자가 제출한 번역을 거절하였습니다.";
            $texts["push_notifications_title:10:2"] = "{R:0} 사용자가 제출한 번역을 사용하기로 했습니다.";
            $texts["push_notifications_description:10:0"] = "많은 나라의 사용자가 내 작품을 볼 수 있게 사용자 번역을 검토하십시오.";
            $texts["push_notifications_description:10:1"] = "번역이 거절된 이유는 다양한 이유가 있을 수 있습니다.";
            $texts["push_notifications_description:10:2"] = "사용자 번역은 다양한 나라의 사람들이 언어 장벽없이 작품을 자유롭게 즐길 수 있도록 합니다, 또한 비용 절감 그리고 수익을 증가시키는 요인이 됩니다. Louibooks을(를) 이용해 주셔서 감사합니다.";
            //사용자 탈퇴
            $texts["push_notifications_title:11"] = "{R:0} 사용자가 삭제 처리되었습니다.";
            $texts["push_notifications_description:11"] = "사용자의 데이터가 많을 경우 모든 데이터를 삭제하기 까지 꽤 많은 시간이 걸릴 수 있습니다. (특정 데이터는 삭제되지 않을 수 있습니다.)";
            //보안 문제 발생
            $texts["push_notifications_title:12"] = "{R:0} 사용자님에게 보안 문제가 발생하였습니다.";
            $texts["push_notifications_description:12"] = "사용자님의 세션이 다른 사용자에게 유출된 거 같습니다, 계정의 보안을 위해 비밀번호 변경 및 빠른 대처를 해주십시오.";
        }



        //영어
        if ($language == "en") {

            //로그인 페이지
            $texts["loginPage_title"] = "Login to your Louibooks account.";
            $texts["signupPage_title"] = "Create a Louibooks account.";
            $texts["findPasswordPage_title"] = "Change your Louibooks account password.";
            $texts["loginPage_input_nickname"] = "Nickname";
            $texts["loginPage_input_email"] = "Email";
            $texts["loginPage_input_password"] = "Password";
            $texts["loginPage_input_password2"] = "Confirm";
            $texts["loginPage_input_new_password"] = "New password";
            $texts["loginPage_input_verification_code"] = "Verification code";
            $texts["signupPage_check_box_title"] = "Accept Privacy Policy";
            $texts["signupPage_check_box_more"] = "more information";
            $texts["loginPage_button1"] = "Login";
            $texts["loginPage_button2"] = "Next";
            $texts["loginPage_find_password"] = "Forgot Password";
            $texts["loginPage_signup"] = "Sign up";
            $texts["loginPage_login"] = "Login";
            $texts["loginPage_keep_logged_in"] = "Keep me logged in to.";
            $texts["loginPage_state_login"] = "Login";
            $texts["loginPage_state_logout"] = "Logout";
            $texts["loginPage_input_two_factor_auth"] = "Secondary Authentication Code";

            $texts["my_cloud_folder"] = "My Cloud";
            $texts["louibooks_cloud"] = "Louibooks Cloud";
            $texts["louibooks_nickname_cloud"] = " Cloud";
            $texts["louibooks_cloud_folder"] = "{R:0} folder";
            $texts["louibooks_cloud_file"] = "{R:0} file";
            $texts["louibooks_cloud_total_capacity"] = "Total";
            $texts["louibooks_cloud_in_use"] = "in use";
            $texts["louibooks_cloud_storage_capacity"] = "Storage capacity";

            $texts["novel_editor_please_title"] = "Please enter the title.";
            $texts["novel_editor_add_sentence"] = "Add sentence";

            $texts["workspace_work_work_part"] = "Work part";
            $texts["workspace_work_work_details"] = "Work details";
            $texts["workspace_work_work_link"] = "Work link";
            $texts["workspace_work_public_status"] = "Public state";
            $texts["workspace_work_undo_changes"] = "Undo changes";
            $texts["workspace_work_save"] = "Save";

            $texts["user_not_found"] = "User does not exist";

            //----- 푸시 알림 -----

            //회차 공개
            $texts["push_notifications_description:0"] = "User {R:0} made \"{R:1}\" public.";
            //커뮤니티 게시물 게시
            $texts["push_notifications_description:1"] = "User {R:0} posted a community post.";
            //댓글 남김
            $texts["push_notifications_title:2"] = "User {R:0} commented.";
            //평가 및 리뷰 남김
            $texts["push_notifications_description:3"] = "User {R:0} has left a review for your work.";
            //문의 검토됨
            $texts["push_notifications_title:4"] = "Your inquiry has been reviewed.";
            //커뮤니티 자격 박탈됨
            $texts["push_notifications_title:5"] = "Community has been disqualified.";
            $texts["push_notifications_description:5"] = "The Louibooks representative has determined that the Community Guidelines have been violated.\nYou will be disqualified and all community activity records for the entire period will be deleted.";
            //크리에이터 가이드 위반함
            $texts["push_notifications_title:6:true"] = "You violated the Creators Guide.";
            $texts["push_notifications_description:6:true"] = "A Louibooks representative has determined that the work violates the Creator's Guide.\nMonetization of the work will be suspended, and works that violate the guide will be made private for one week. Also, it is not possible to create works for a week.";
            $texts["push_notifications_title:6:false"] = "Creator qualification has been revoked.";
            $texts["push_notifications_description:6:false"] = "The person in charge of Louibooks has determined that the work violates the Creator's Guide.\nThe qualification will be revoked, all works will be deleted, and creative activities on Louibooks will not be allowed.";
            //수익 창출 승인 검토
            $texts["push_notifications_description:7:0"] = "Your monetization authorization has been declined.";
            $texts["push_notifications_description:7:1"] = "🎉 Monetization approved.";
            //파트너 프로그램 승인 검토
            $texts["push_notifications_title:8:0:0"] = "Your approval to participate in the Partner Program has been declined.";
            $texts["push_notifications_title:8:0:1"] = "🎉 You have been approved to participate in the Partner Program.";
            $texts["push_notifications_description:8:0:0"] = "Approval to participate in the Partner Program has been declined by the Louibooks representative. Please refer to the Louibooks Workspace Partner Menu for details.";
            $texts["push_notifications_description:8:0:1"] = "Congratulations on partnering with Louibooks. You can also participate in the Louibooks Partner PLUS promotion, Louibooks will strive to ensure that creators' creative activities are free.";
            //파트너 PLUS 프로모션 승인 검토
            $texts["push_notifications_title:8:1:0"] = "Your approval to participate in the Partner PLUS promotion has been declined.";
            $texts["push_notifications_title:8:1:1"] = "🎉 Participation in the Partner PLUS promotion has been approved.";
            $texts["push_notifications_title:8:1:2"] = "Partner PLUS promotion has expired.";
            $texts["push_notifications_description:8:1:0"] = "The Louibooks representative has declined to approve the Partner PLUS Promotion. Please refer to the Louibooks Workspace Partner Menu for details.";
            $texts["push_notifications_description:8:1:1"] = "Congratulations on becoming a closer relationship with Louibooks, Louibooks will strive to allow creators' creative activities to be free.";
            $texts["push_notifications_description:8:1:2"] = "The Louibooks representative has expired the Partner PLUS Promotion, see the Louibooks Workspace Partner Menu for details.";
            //수익 지급
            $texts["push_notifications_title:9:0"] = "🎉 Profits have been paid";
            $texts["push_notifications_title:9:1"] = "Your payment has been put on hold because of a problem.";
            $texts["push_notifications_description:9:0"] = "Revenues Paid: {R:0}";
            $texts["push_notifications_description:9:1"] = "Withheld Revenue: {R:0}, There was a problem during the settlement process. It could be an incorrect remittance details or an error in the Louibooks settlement system. Try changing them to the correct remittance details. If the problem is not resolved, contact your Louibooks representative. Please contact us.";
            //사용자 번역
            $texts["push_notifications_title:10:0"] = "User {R:0} submitted a translation.";
            $texts["push_notifications_title:10:1"] = "The translation submitted by user {R:0} has been rejected.";
            $texts["push_notifications_title:10:2"] = "{R:0} We have decided to use the translation submitted by the user.";
            $texts["push_notifications_description:10:0"] = "Please review user translations so that users in many countries can see your work.";
            $texts["push_notifications_description:10:1"] = "Translations may be rejected for a variety of reasons.";
            $texts["push_notifications_description:10:2"] = "User translation allows people from various countries to freely enjoy your work without language barriers, and it also reduces costs and increases revenue. Thank you for using Louibooks.";
            //사용자 탈퇴
            $texts["push_notifications_title:11"] = "User {R:0} has been deleted.";
            $texts["push_notifications_description:11"] = "If there is a lot of user data, it may take quite a while to delete all data. (Certain data may not be deleted.)";
            //보안 문제 발생
            $texts["push_notifications_title:12"] = "A security issue has occurred for user {R:0}.";
            $texts["push_notifications_description:12"] = "Your session seems to have been leaked to another user. Please change your password and act quickly to secure your account.";
        }



        //일본어
        if ($language == "ja") {

            //로그인 페이지
            $texts["loginPage_title"] = "Louibooks アカウントにログインします。";
            $texts["signupPage_title"] = "Louibooks アカウントを作成します。";
            $texts["findPasswordPage_title"] = "Louibooks アカウントのパスワードを変更します。";
            $texts["loginPage_input_nickname"] = "ニックネーム";
            $texts["loginPage_input_email"] = "Eメール";
            $texts["loginPage_input_password"] = "パスワード";
            $texts["loginPage_input_password2"] = "パスワード確認";
            $texts["loginPage_input_new_password"] = "新しいパスワード";
            $texts["loginPage_input_verification_code"] = "検証コード";
            $texts["signupPage_check_box_title"] = "プライバシーポリシーを受け入れる";
            $texts["signupPage_check_box_more"] = "詳しくは";
            $texts["loginPage_button1"] = "ログイン";
            $texts["loginPage_button2"] = "次のステップ";
            $texts["loginPage_find_password"] = "パスワードをお忘れですか";
            $texts["loginPage_signup"] = "サインアップ";
            $texts["loginPage_login"] = "ログイン";
            $texts["loginPage_keep_logged_in"] = "ログインしたままにします。";
            $texts["loginPage_state_login"] = "ログイン";
            $texts["loginPage_state_logout"] = "サインアウト";
            $texts["loginPage_input_two_factor_auth"] = "二次認証コード";

            $texts["my_cloud_folder"] = "マイクラウド";
            $texts["louibooks_cloud"] = "ルイブックス クラウド";
            $texts["louibooks_nickname_cloud"] = " クラウド";
            $texts["louibooks_cloud_folder"] = "フォルダ{R:0}個";
            $texts["louibooks_cloud_file"] = "ファイル{R:0}個";
            $texts["louibooks_cloud_total_capacity"] = "総容量";
            $texts["louibooks_cloud_in_use"] = "使用中";
            $texts["louibooks_cloud_storage_capacity"] = "ストレージ容量";

            $texts["novel_editor_please_title"] = "タイトルを入力してください。";
            $texts["novel_editor_add_sentence"] = "文章を追加";

            $texts["workspace_work_work_part"] = "作品回差";
            $texts["workspace_work_work_details"] = "作品の詳細";
            $texts["workspace_work_work_link"] = "作品リンク";
            $texts["workspace_work_public_status"] = "公開ステータス";
            $texts["workspace_work_undo_changes"] = "変更の取り消し";
            $texts["workspace_work_save"] = "保存";

            $texts["user_not_found"] = "存在しないユーザー";

            //----- 푸시 알림 -----

            //회차 공개
            $texts["push_notifications_description:0"] = "{R:0} ユーザーが \"{R:1}\" を公開しました。";
            //커뮤니티 게시물 게시
            $texts["push_notifications_description:1"] = "{R:0}ユーザーがコミュニティ投稿を投稿しました。";
            //댓글 남김
            $texts["push_notifications_title:2"] = "{R:0}ユーザーがコメントを残しました。";
            //평가 및 리뷰 남김
            $texts["push_notifications_description:3"] = "{R:0}ユーザーが自分の作品にレビューを残しました。";
            //문의 검토됨
            $texts["push_notifications_title:4"] = "お問い合わせがレビューされました。";
            //커뮤니티 자격 박탈됨
            $texts["push_notifications_title:5"] = "コミュニティ資格が奪われた。";
            $texts["push_notifications_description:5"] = "Louibooksの担当者がコミュニティガイドラインに違反したと判断しました。";
            //크리에이터 가이드 위반함
            $texts["push_notifications_title:6:true"] = "クリエイターガイドに違反しました。";
            $texts["push_notifications_description:6:true"] = "Louibooksの担当者は、その作品がクリエイターガイドに違反したと判断しました。 また、一週間の作品作成はできません。";
            $texts["push_notifications_title:6:false"] = "クリエイターの資格が奪われた。";
            $texts["push_notifications_description:6:false"] = "Louibooksの担当者は、その作品がクリエイターガイドに違反したと判断しました。";
            //수익 창출 승인 검토
            $texts["push_notifications_description:7:0"] = "収益化の承認が拒否されました。";
            $texts["push_notifications_description:7:1"] = "🎉収益化が承認されました。";
            //파트너 프로그램 승인 검토
            $texts["push_notifications_title:8:0:0"] = "パートナープログラム参加の承認が拒否されました。";
            $texts["push_notifications_title:8:0:1"] = "🎉パートナープログラムへの参加が承認されました。";
            $texts["push_notifications_description:8:0:0"] = "Louibooks担当者がパートナープログラム参加の承認を拒否しました。詳細については、Louibooksワークスペースパートナーメニューを参照してください。";
            $texts["push_notifications_description:8:0:1"] = "Louibooksとの提携を祝い、LouibooksパートナーPLUSプロモーションに参加することもできます。";
            //파트너 PLUS 프로모션 승인 검토
            $texts["push_notifications_title:8:1:0"] = "パートナーPLUSプロモーション参加の承認が拒否されました。";
            $texts["push_notifications_title:8:1:1"] = "🎉パートナーPLUSプロモーション参加が承認されました。";
            $texts["push_notifications_title:8:1:2"] = "パートナーPLUSプロモーションの有効期限が切れました。";
            $texts["push_notifications_description:8:1:0"] = "Louibooks担当者がパートナーPLUSプロモーションの承認を拒否しました。詳細については、Louibooksワークスペースパートナーメニューを参照してください。";
            $texts["push_notifications_description:8:1:1"] = "Louibooksとの緊密な関係を築いてくれたことをおめでとうございます。";
            $texts["push_notifications_description:8:1:2"] = "Louibooksの担当者がパートナーPLUSのプロモーションを期限切れにしました。詳細については、Louibooksワークスペースのパートナーメニューを参照してください。";
            //수익 지급
            $texts["push_notifications_title:9:0"] = "🎉収益が支払われました。";
            $texts["push_notifications_title:9:1"] = "問題が発生し、支払いが保留されました。";
            $texts["push_notifications_description:9:0"] = "支払われた収益: {R:0}";
            $texts["push_notifications_description:9:1"] = "保留された収益：{R:0}、決済処理中に発生した問題 お問い合わせください。」";
            //사용자 번역
            $texts["push_notifications_title:10:0"] = "{R:0} ユーザーが翻訳を送信しました。";
            $texts["push_notifications_title:10:1"] = "{R:0}ユーザーが送信した翻訳を拒否しました。";
            $texts["push_notifications_title:10:2"] = "{R:0}ユーザーが送信した翻訳を使用することにしました。";
            $texts["push_notifications_description:10:0"] = "多くの国のユーザーが自分の作品を見ることができるように、ユーザーの翻訳を確認してください。";
            $texts["push_notifications_description:10:1"] = "翻訳が拒否された理由にはさまざまな理由があります。";
            $texts["push_notifications_description:10:2"] = "ユーザー翻訳は、さまざまな国の人々が言語バリアなしで作品を自由に楽しむことを可能にし、またコスト削減と収益を増加させる要因となります。 Louibooksをご利用いただきありがとうございます。";
            //사용자 탈퇴
            $texts["push_notifications_title:11"] = "{R:0} ユーザーが削除処理されました。";
            $texts["push_notifications_description:11"] = "ユーザーのデータが多い場合は、すべてのデータを削除するのにかなりの時間がかかります。 （特定データは削除されない場合があります。）";
            //보안 문제 발생
            $texts["push_notifications_title:12"] = "{R:0} ユーザーにセキュリティ上の問題が発生しました。";
            $texts["push_notifications_description:12"] = "ユーザーのセッションが他のユーザーに漏洩したようです。";
        }
        return $texts;
    }






















































































    /*
        작품 분석 데이터
    */
    function getAdminAnalysisInfo() {
        global $pdo;

        $stmt = $pdo->prepare("SELECT connect, request, user, partner, partner_plus, monetization, expected_revenue_per_views, date FROM admin_analysis");
        $stmt->execute();
        $info = $stmt->fetchAll();
        $info_length = count($info);

        $analysisInfo = array(
            "byDate" => array()
        );
        for ($i = 0; $i < $info_length; $i++) {
            $analysisInfo["byDate"][] = array(
                'date' => $info[$i]["date"],
                'connect' => $info[$i]["connect"],
                'request' => $info[$i]["request"],
                'user' => $info[$i]["user"],
                'partner' => $info[$i]["partner"],
                'partnerPlus' => $info[$i]["partner_plus"],
                'monetization' => $info[$i]["monetization"],
                'expectedRevenuePerViews' => $info[$i]["expected_revenue_per_views"]
            );
        }

        return $analysisInfo;
    }












































































    function setCookieValue($name, $value) {
        $date = new DateTime();
        $date->modify('+1 year');
        $expires = $date->format('D, d M Y H:i:s \G\M\T');
        setcookie($name, $value, strtotime($expires), '/', '.louibooks.com', true, true);
    }

    function getClientIp() {
        global $publicIp;
        $ipAddress = null;
        if (isset($_SERVER['HTTP_CLIENT_IP'])) {
            $ipAddress = $_SERVER['HTTP_CLIENT_IP'];
        } else if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ipAddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else if (isset($_SERVER['HTTP_X_FORWARDED'])) {
            $ipAddress = $_SERVER['HTTP_X_FORWARDED'];
        } else if (isset($_SERVER['HTTP_FORWARDED_FOR'])) {
            $ipAddress = $_SERVER['HTTP_FORWARDED_FOR'];
        } else if (isset($_SERVER['HTTP_FORWARDED'])) {
            $ipAddress = $_SERVER['HTTP_FORWARDED'];
        } else if (isset($_SERVER['REMOTE_ADDR'])) {
            $ipAddress = $_SERVER['REMOTE_ADDR'];
        } else {
            echo "invalid connection";
            exit;
        }
        (strpos($ipAddress, "172.30.1.") !== false) ? $ipAddress = $publicIp : null;
        return $ipAddress;
    }

    function ord8($c) {
        $len = strlen($c);
        if($len <= 0) return false;
        $h = ord($c[0]);
        if ($h <= 0x7F) return $h;
        if ($h < 0xC2) return false;
        if ($h <= 0xDF && $len>1) return ($h & 0x1F) <<  6 | (ord($c[1]) & 0x3F);
        if ($h <= 0xEF && $len>2) return ($h & 0x0F) << 12 | (ord($c[1]) & 0x3F) <<  6 | (ord($c[2]) & 0x3F);		  
        if ($h <= 0xF4 && $len>3) return ($h & 0x0F) << 18 | (ord($c[1]) & 0x3F) << 12 | (ord($c[2]) & 0x3F) << 6 | (ord($c[3]) & 0x3F);
        return false;
    }
    /*function linear_hangul($str) {
        $cho = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
        $jung = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
        $jong = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ',' ㅌ','ㅍ','ㅎ'];
        $result = '';
        for ($i=0; $i<mb_strlen($str, 'UTF-8'); $i++) {
            $code = ord8(mb_substr($str, $i, 1, 'UTF-8')) - 44032;
            if ($code > -1 && $code < 11172) {
                $cho_idx = $code / 588;
                $jung_idx = $code % 588 / 28;
                $jong_idx = $code % 28;
                $result .= $cho[$cho_idx].$jung[$jung_idx].$jong[$jong_idx];
            } else {
                $result .= mb_substr($str, $i, 1, 'UTF-8');
            }
        }
        return $result;
    }*/
    function linear_hangul($str) {
        $cho = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
        $jung = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅗㅏ','ㅗㅐ','ㅗㅣ','ㅛ','ㅜ','ㅜㅓ','ㅜㅔ','ㅜㅣ','ㅠ','ㅡ','ㅡㅣ','ㅣ'];
        $jong = ['','ㄱ','ㄲ','ㄱㅅ','ㄴ','ㄴㅈ','ㄴㅎ','ㄷ','ㄹ','ㄹㄱ','ㄹㅁ','ㄹㅂ','ㄹㅅ','ㄹㅌ','ㄹㅍ','ㄹㅎ','ㅁ','ㅂ','ㅂㅅ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ',' ㅌ','ㅍ','ㅎ'];
        $result = '';
        for ($i=0; $i<mb_strlen($str, 'UTF-8'); $i++) {
            $code = ord8(mb_substr($str, $i, 1, 'UTF-8')) - 44032;
            if ($code > -1 && $code < 11172) {
                $cho_idx = $code / 588;
                $jung_idx = $code % 588 / 28;
                $jong_idx = $code % 28;
                $result .= $cho[$cho_idx].$jung[$jung_idx].$jong[$jong_idx];
            } else {
                $result .= mb_substr($str, $i, 1, 'UTF-8');
            }
        }
        return $result;
    }

    function curlRequestAsync($url, $params, $type = 'POST') {  
        $postStr = http_build_query($params);

        $parts = parse_url($url);  
        if ($parts['scheme'] == 'http') {  
            $fp = fsockopen($parts['host'], isset($parts['port'])?$parts['port']:80, $errno, $errstr, 604800);  
        } else if ($parts['scheme'] == 'https') {  
            $fp = fsockopen("ssl://" . $parts['host'], isset($parts['port'])?$parts['port']:443, $errno, $errstr, 604800);  
        }
        
        if('GET' == $type) {
            $parts['path'] .= ('?' . $postStr);  
        }
        $out = "$type " . $parts['path'] . " HTTP/1.1\r\n";  
        $out.= "Host: " . $parts['host'] . "\r\n";  
        $out.= "Content-Type: application/x-www-form-urlencoded\r\n";  
        $out.= "Content-Length: " . strlen($postStr) . "\r\n";
        $out.= "Connection: Close\r\n\r\n";
        if ('POST' == $type && isset($postStr)) {
            $out .= $postStr;
        }
    
        fwrite($fp, $out);
        fclose($fp);
    }

    //시간 차이 (초)
    function getTimeDifference($date1, $date2) {
        $time1 = new DateTime($date1);
        $time2 = new DateTime($date2);
        return $time2->getTimestamp() - $time1->getTimestamp();
    }

    //URL에서 도메인만 추출
    function getDomainName($url) {
        $value = strtolower(trim($url));
        $url_patten = '/^(?:(?:[a-z]+):\/\/)?((?:[a-z\d\-]{2,}\.)+[a-z]{2,})(?::\d{1,5})?(?:\/[^\?]*)?(?:\?.+)?$/i';
        $domain_patten = '/([a-z\d\-]+(?:\.(?:asia|info|name|mobi|com|net|org|biz|tel|xxx|io|gh|gt|ge|gr|ng|za|nl|np|no|nz|ni|tw|dk|do|de|la|lv|ru|lb|ro|li|my|mx|ma|me|mt|us|bh|bd|ve|vn|be|by|ba|bo|mk|bg|br|sa|cy|sn|rs|lk|se|ch|es|sk|si|sg|ae|ar|is|ie|az|dz|ee|ec|sv|gb|ye|om|at|hn|jo|ug|uy|ua|iq|il|eg|it|in|id|jp|jm|zw|cz|cl|kz|qa|kh|ca|ke|cr|co|kw|hr|tz|th|tr|tn|pa|py|pk|pg|pe|pt|pl|pr|fr|fi|ph|kr|hu|au|hk)){1,2})(?::\d{1,5})?(?:\/[^\?]*)?(?:\?.+)?$/i';
        if (preg_match($url_patten, $value)) {
            preg_match($domain_patten, $value, $matches);
            $host = (!$matches[1]) ? $value : $matches[1];
        }
        return $host;
    }

    function cut_str($str, $len) {
        $arr_str = preg_split("//u", $str, -1, PREG_SPLIT_NO_EMPTY);
        $str_len = count($arr_str);

        if ($str_len >= $len) {
            $slice_str = array_slice($arr_str, 0, $len);
            $str = join("", $slice_str);

            return $str . ($str_len > $len ? "..." : '');
        } else {
            $str = join("", $arr_str);
            return $str;
        }
    }

    function setCache($path, $key, $data) {
        global $cachePath;
        $joinPath = ($cachePath . '/' . $path);
        $cacheFile = ($joinPath . '/' . sha1($key) . '.cache');
        @mkdir($joinPath, 0777);
        file_put_contents($cacheFile, $data);

        //24시간 동안 결과를 메모리에 캐시한다
        apcu_store(('cache:' . ($path . $key)), $data);
        @apcu_delete('cacheAll:' . $path);
    }
    function getCache($path, $key) {
        global $cachePath;
        $data = apcu_fetch(('cache:' . ($path . $key)));
        if ($data == null) {
            $joinPath = ($cachePath . '/' . $path);
            $cacheFile = ($joinPath . '/' . sha1($key) . '.cache');
            $data = @file_get_contents($cacheFile);
            ($data == false) ? $data = null : null;

            //24시간 동안 결과를 메모리에 캐시한다
            apcu_store(('cache:' . ($path . $key)), $data);
        }
        return $data;
    }
    function getCacheAll($path) {
        global $cachePath;
        $array = apcu_fetch(('cacheAll:' . $path));
        if ($array == null) {
            $array = array();
            $joinPath = ($cachePath . '/' . $path);
            $files = glob($joinPath . '/*');
            foreach ($files as $file) {
                $data = file_get_contents($file);
                $array[] = $data;
            }
            //24시간 동안 결과를 메모리에 캐시한다
            apcu_store(('cacheAll:' . $path), $array);
        }
        return $array;
    }

    /*
        $info 형식:
            [
                {
                    path: (inetpub\wwwroot\test.txt)
                    contents: (base64 인코딩된 파일 콘텐츠)
                },
                { ... },
                { ... }
            ]
    */
    function remoteFileUpload($ip, $info, $rebooting = false) {
        global $originalKey;

        $json = json_encode($info);
        $chunkSize = 2000000000; //2GB

        $length = strlen($json);
        $chunks = [];
        if ($length <= $chunkSize) {
            $chunks[] = $json;
        } else {
            $offset = 0;
            while ($offset < $length) {
                $chunk = substr($json, $offset, $chunkSize);
                $chunks[] = $chunk;
                $offset += $chunkSize;
            }
        }

        //청크 업로드
        $chunkList = array();
        $chunks_length = count($chunks);
        for ($i = 0; $i < $chunks_length; $i++) {
            $chunk = $chunks[$i];

            $url = "http://" . $ip . ":8000/chunk/upload.php";
            $param = array(
                "key" => $originalKey,
                "contents" => new CURLStringFile($chunk, 'text/plain')
            );
            $cu = curl_init();
            curl_setopt($cu, CURLOPT_URL, $url);
            curl_setopt($cu, CURLOPT_POST, true);
            curl_setopt($cu, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($cu, CURLOPT_SSLVERSION, 3);
            curl_setopt($cu, CURLOPT_POSTFIELDS, $param);
            curl_setopt($cu, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($cu, CURLOPT_TIMEOUT, 86400);
            $result = curl_exec($cu);
            curl_close($cu);

            $chunkList[] = $result;
        }
        
        //파일 업로드 마무리
        $url = "http://" . $ip . ":8000/chunk/finishing.php";
        $param = array(
            "key" => $originalKey,
            "chunkList" => json_encode($chunkList),
            "rebooting" => $rebooting
        );
        $cu = curl_init();
        curl_setopt($cu, CURLOPT_URL, $url);
        curl_setopt($cu, CURLOPT_POST, true);
        curl_setopt($cu, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($cu, CURLOPT_SSLVERSION, 3);
        curl_setopt($cu, CURLOPT_POSTFIELDS, http_build_query($param));
        curl_setopt($cu, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($cu, CURLOPT_TIMEOUT, 86400);
        curl_exec($cu);
        curl_close($cu);
    }
    /*
        $info 형식:
            [
                inetpub\wwwroot\test1.txt,
                inetpub\wwwroot\test2.txt,
                inetpub\wwwroot\test3.txt
            ]
    */
    function remoteFileDelete($ip, $info, $rebooting = false) {
        global $originalKey;

        $url = "http://" . $ip . ":8000/delete.php";
        $param = array(
            "key" => $originalKey,
            "files" => json_encode($info),
            "rebooting" => $rebooting
        );
        $cu = curl_init();
        curl_setopt($cu, CURLOPT_URL, $url);
        curl_setopt($cu, CURLOPT_POST, true);
        curl_setopt($cu, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($cu, CURLOPT_SSLVERSION, 3);
        curl_setopt($cu, CURLOPT_POSTFIELDS, http_build_query($param));
        curl_setopt($cu, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($cu, CURLOPT_TIMEOUT, 86400);
        curl_exec($cu);
        curl_close($cu);
    }

    function uploadFileChunk($ip, $chunk) {
        global $originalKey;

        $url = "http://" . $ip . ":8000/chunk/upload.php";
        $param = array(
            "key" => $originalKey,
            "contents" => new CURLStringFile($chunk, 'text/plain')
        );
        $cu = curl_init();
        curl_setopt($cu, CURLOPT_URL, $url);
        curl_setopt($cu, CURLOPT_POST, true);
        curl_setopt($cu, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($cu, CURLOPT_SSLVERSION, 3);
        curl_setopt($cu, CURLOPT_POSTFIELDS, $param);
        curl_setopt($cu, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($cu, CURLOPT_TIMEOUT, 86400);
        $result = curl_exec($cu);
        curl_close($cu);

        return $result;
    }
    function combinedFileChunk($ip, $chunkList, $path) {
        global $originalKey;

        $url = "http://" . $ip . ":8000/chunk/combining.php";
        $param = array(
            "key" => $originalKey,
            "chunkList" => json_encode($chunkList),
            "path" => $path
        );
        $cu = curl_init();
        curl_setopt($cu, CURLOPT_URL, $url);
        curl_setopt($cu, CURLOPT_POST, true);
        curl_setopt($cu, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($cu, CURLOPT_SSLVERSION, 3);
        curl_setopt($cu, CURLOPT_POSTFIELDS, http_build_query($param));
        curl_setopt($cu, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($cu, CURLOPT_TIMEOUT, 86400);
        curl_exec($cu);
        curl_close($cu);
    }

    function getUrlSiteMap() {
        global $pdo;

        $stmt = $pdo->prepare("SELECT number, original_language FROM works WHERE public_status = 0");
        $stmt->execute();
        $works = $stmt->fetchAll();
        $works_length = count($works);
    
        $stmt = $pdo->prepare("SELECT work_number, language FROM work_localization");
        $stmt->execute();
        $workLocalization = $stmt->fetchAll();
        $workLocalization_length = count($workLocalization);
        $localizationInfo = array();
        for ($i = 0; $i < $workLocalization_length; $i++) {
            $number = $workLocalization[$i]["work_number"];
            if (isset($localizationInfo[$number]) == false) {
                $localizationInfo[$number] = array();
            }
            $localizationInfo[$number][] = $workLocalization[$i]["language"];
        }
    
        $urlList = array();
        $urlList[] = "https://louibooks.com?lang=en";
        $urlList[] = "https://louibooks.com?lang=ko";
        $urlList[] = "https://louibooks.com?lang=ja";
    
        for ($i = 0; $i < $works_length; $i++) {
            $urlList[] = 'https://louibooks.com/work/' . $works[$i]["number"] . "?lang=" . $works[$i]["original_language"] . "\n";
    
            //현지화 버전
            if (isset($localizationInfo[$works[$i]["number"]])) {
                $localization = $localizationInfo[$works[$i]["number"]];
                $localization_length = count($localization);
                for ($j = 0; $j < $localization_length; $j++) {
                    $urlList[] = 'https://louibooks.com/work/' . $works[$i]["number"] . "?lang=" . $localization[$j] . "\n";
                }
            }
        }

        return $urlList;
    }

    //- 성능 디버깅
    /*$previousStartTime = null;
    $previousFunctionName = null;
    $result = array();
    function start($functionName) {
        global $previousStartTime, $previousFunctionName;
        $previousFunctionName = $functionName;
        $previousStartTime = microtime(true);
    }
    function finish() {
        global $previousStartTime, $previousFunctionName, $result;
        $endTime = microtime(true);
        $executionTime = ($endTime - $previousStartTime);

        $result[] = array(
            "functionName" => $previousFunctionName,
            "executionTime" => (number_format($executionTime) . ' seconds')
        );

        echo $previousFunctionName . ": " . (number_format($executionTime, 10) . ' seconds') . '<br />';
    }*/

?>