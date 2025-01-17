<?php

    $startProcessingTime = microtime(true);
    function scriptShutdownEvent() {
        global $startProcessingTime;
        $processingTime = (microtime(true) - $startProcessingTime);
        header("X-Execution-Time: " . number_format($processingTime * 1000) . "ms");
    }
    register_shutdown_function('scriptShutdownEvent');

    //시간대 설정: UTC
    date_default_timezone_set("UTC");

    require 'C://inetpub/php/vendor/autoload.php';

    $dbHost = "172.30.1.56";
    $dbName = "loui";
    $dbUser = "root";
    $dbPass = ">x?KAFH}+7hIuzgIE~8pJ>ULRBRHv{4<s4I>#|ES!XL_0q9K<.";
    $dbChar = "utf8";

    $pdoOptions = array(
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_PERSISTENT => true,
        PDO::ATTR_STRINGIFY_FETCHES => false,
        PDO::MYSQL_ATTR_COMPRESS => true,                   //네트워크 통신 압축 사용
        PDO::MYSQL_ATTR_DIRECT_QUERY => true,               //쿼리 준비 안함
        PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,    //인증서 확인 안함
        PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true          //쿼리 버퍼링 사용
    );

    $dsn = "mysql:host={$dbHost};dbname={$dbName};charset={$dbChar}";
    @$pdo = new PDO($dsn, $dbUser, $dbPass, $pdoOptions);

    //서버 정보
    $serverIp = gethostname();
    $originalKey = "XVKEoAXiju6leBcse8uVLx05JJqb5S1vOqD6QavKSupAtWd6rv"; //노출하지 마십시오.

    //사용자가 입력한 문자열 필터링
    foreach ($_GET as $key => $value) {
        if (isset($_POST["key"]) && $originalKey == $_POST["key"]) {
            //서버가 보내온 요청
        } else {
            $isNumber = (strpos($value, "number") !== false);
            $_GET[$key] = filteringRequiredStrings($value, $isNumber);
        }
    }
    foreach ($_POST as $key => $value) {
        if (isset($_POST["key"]) && $originalKey == $_POST["key"]) {
            //서버가 보내온 요청
        } else {
            $isNumber = (strpos($value, "number") !== false);
            $_POST[$key] = filteringRequiredStrings($value, $isNumber);
        }
    }
    function filteringRequiredStrings($str, $isNumber) {
        global $pdo;
        //XSS
        $str = str_replace("\r\n", "\n", $str);
        $str = str_replace("\r", "\n", $str);
        $str = htmlspecialchars($str, ENT_NOQUOTES);
        //JSON 이라면
        $json = json_decode($str, true);
        $isJson = false;
        if ($json != null && is_array($json)) {
            $str = json_encode(filteringRequiredStringsJsonRecursive($json));
            $isJson = true;
        } else {
            /*$str = $pdo->quote($str);
            //별도로 처리
            if (strlen($str) > 1 && $str[0] === "'" && $str[strlen($str) - 1] === "'") {
                $str = substr($str, 1, -1);
                $str = trim($str, '\\');
                //$str = stripslashes($str);
            }*/
        }
        //원하는 입력 데이터 형식이 숫자일 경우
        if ($isJson == false && $isNumber == true && preg_match('/[^0-9,]/', $str) == false) {
            echo "invalid input value";
            exit;
        }
        //숫자라면 숫자 형식으로 변환
        //- 숫자 앞에 0이 있으면 문자열로 판단
        if (is_numeric($str) && substr($str, 0, 1) != "0") {
            $str = (float) $str;
        }
        return $str;
    }
    function filteringRequiredStringsJsonRecursive($array) {
        global $pdo;
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $array[$key] = filteringRequiredStringsJsonRecursive($value);
            } else {
                /*$array[$key] = $pdo->quote($value);
                //별도로 처리
                if (strlen($array[$key]) > 1 && $array[$key][0] === "'" && $array[$key][strlen($array[$key]) - 1] === "'") {
                    $array[$key] = substr($array[$key], 1, -1);
                    $array[$key] = trim($array[$key], '\\');
                    //$array[$key] = stripslashes($array[$key]);
                }*/
                if (is_numeric($array[$key])) {
                    $array[$key] = (float) $array[$key];
                }
            }
        }
        return $array;
    }

?>