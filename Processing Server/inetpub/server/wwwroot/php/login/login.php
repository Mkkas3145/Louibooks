<?php

    include_once('../../default_function.php');
    use RobThree\Auth\TwoFactorAuth;

    //데이터 유효성 검사
    if(!filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)){
        echo 'not email';
        exit;
    } else if ((!isset($_POST["email"])) || (!isset($_POST["pw"]))) {
        echo 'not data';
        exit;
    } else if ($_POST["email"] == '' || $_POST["pw"] == '') {
        echo 'not data';
        exit;
    } else if (mb_strlen($_POST["email"], "UTF-8") > 50) {
        echo 'max data length';
        exit;
    }

    $isJson = false;
    if (isset($_POST["isJson"]) && $_POST["isJson"] == 'true') {
        $isJson = true;
    }
    if (isset($_POST["autologin"]) == false) {
        $_POST["autologin"] = true;
    }

    $stmt = $pdo->prepare("SELECT number, password, salt, two_factor_auth_key FROM user where email = :email");
    $stmt->execute(array(
        ':email' => $_POST["email"],
    ));
    $result = $stmt->fetchAll();
    $result_length = count($result);
    
    for ($i = 0; $i < $result_length; $i++) {
        $salt = $result[$i]["salt"];
        $password = base64_encode(hash('sha512', ($salt . $_POST["pw"]), true));
        for ($i2 = 0; $i2 < 10000; $i2++) {
            $password = base64_encode(hash('sha512', $password, true));
        }
        if ($password == $result[$i]["password"]) {
            //2차 인증 관련
            if (($result[$i]["two_factor_auth_key"])) {
                $secretKey = $result[$i]["two_factor_auth_key"];
                if (isset($_POST["code"])) {
                    $tfa = new TwoFactorAuth('Louibooks');
                    $isValid = $tfa->verifyCode($secretKey, $_POST["code"]);
                    if ($isValid == false) {
                        echo "secondary authentication codes do not match";
                        exit;
                    }
                } else {
                    echo "secondary authentication is required";
                    exit;
                }
            }

            if ($_POST["autologin"] == "true") {
                //로그인 키 생성
                $loginkey = createLoginKey($result[$i]["number"]);
    
                //isJson이(가) false이면
                if ($isJson == false) {
                    setCookieValue('LOGINKEY', $loginkey);

                    //다른 계정 로그인 - 로그인 키 저장
                    saveOtherAccountLoginKey($result[$i]["number"], $loginkey);
                }
            } else {
                $_SESSION["userNumber"] = $result[$i]["number"];
            }

            if ($isJson == false) {
                //다른 계정 로그인
                saveOtherAccountUserNumber($result[$i]["number"]);

                echo 'login succeed';
            } else {
                $data = array(
                    "userNumber" => $result[$i]["number"],
                    "loginKey" => $loginkey
                );
                echo json_encode($data);
            }
            exit;
        } else {
            echo 'not match password';
            exit;
        }
    }

    echo 'not match mail';

?>