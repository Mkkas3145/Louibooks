<?php

    include_once('../../default_function.php');

    //데이터 유효성 검사
    if(!filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)){
        echo 'not email';
        exit;
    } else if ((!isset($_POST["email"]))) {
        echo 'not data';
        exit;
    } else if ($_POST["email"] == '') {
        echo 'not data';
        exit;
    } else if (mb_strlen($_POST["email"], "UTF-8") > 50) {
        echo 'max data length';
        exit;
    }


    //이메일 존재 여부
    $isEmail = false;
    $userNumber = null;
    $stmt = $pdo->prepare("SELECT number FROM user where email = :email");
    $stmt->execute(array(
        ':email' => $_POST["email"],
    ));
    $result = $stmt->fetchAll();
    $result_length = count($result);
    for ($i = 0; $i < $result_length; $i++) {
        $userNumber = $result[$i]["number"];
        $isEmail = true;
    }
    if ($isEmail == false) {
        echo 'email does not exist';
        exit;
    }


    //이메일 발송 전, 유효 시간 확인 및 발급 키 존재 여부
    $stmt = $pdo->prepare("SELECT number, reg, code FROM find_password where email = :email");
    $stmt->execute(array(
        ':email' => $_POST["email"],
    ));
    $result = $stmt->fetchAll();
    $result_length = count($result);

    $newreg = date("Y-m-d H:i:s");

    for ($i = 0; $i < $result_length; $i++) {
        $time = time_diff($result[$i]["reg"], $newreg);
        $raw_code = $result[$i]["code"];
        $raw_number = $result[$i]["number"];
        if ($time < 300) {
            if (!isset($_POST["key"])) {
                echo 'cannot be issued';
                exit;
            }
        } else {
            if (!isset($_POST["key"])) {
                $stmt = $pdo->prepare("DELETE FROM find_password WHERE number = :number");
                $stmt->execute(array(
                    ':number' => $raw_number,
                ));
            }
        }
    }
    


    //이메일 발송 관련
    include_once('./PHPMailer/PHPMailerAutoload.php');


    if (isset($_POST["key"])) {
        if (isset($raw_code)) {
            if ($raw_code == $_POST["key"]) {

                if (isset($_POST["newpassword"])) {
                    $stmt = $pdo->prepare("DELETE FROM find_password WHERE number = :number");
                    $stmt->execute(array(
                        ':number' => $raw_number,
                    ));

                    //비밀번호 암호화 - salt 값
                    $salt = random_bytes(10);
                    $salt = bin2hex($salt);
                    //비밀번호 암호화 - password
                    $password = base64_encode(hash('sha512', ($salt . $_POST["newpassword"]), true));
                    for ($i = 0; $i < 10000; $i++) {
                        $password = base64_encode(hash('sha512', $password, true));
                    }

                    $sql = $pdo->prepare("UPDATE user SET password=:password, salt=:salt WHERE number=:number");
                    $sql->execute(array(
                        ':password' => $password,
                        ':salt' => $salt,
                        ':number' => $userNumber,
                    ));

                    //사용자 세션 삭제
                    $loginKey = null;
                    if (isset($_POST["loginKey"])) {
                        $loginKey = $_POST["loginKey"];
                    } else if (isset($_COOKIE["LOGINKEY"])) {
                        $loginKey = $_COOKIE["LOGINKEY"];
                    }
                    $stmt = $pdo->prepare("DELETE FROM login_key WHERE user_number = :user_number AND random_key != :random_key");
                    $stmt->execute(array(
                        ':user_number' => $userNumber,
                        ':random_key' => $loginKey
                    ));
                    $sql = $pdo->prepare("UPDATE login_key SET security_issue = 0 WHERE user_number = :user_number");
                    $sql->execute(array(
                        ':user_number' => $userNumber
                    ));

                    echo 'forgot password success';
                    exit;
                }

                echo 'password to change';
            } else {
                echo 'not same key';
            }
        } else {
            echo 'not same key';
        }
    } else {
        $code = get_random_string("09", 5);
        $sql = $pdo->prepare('insert into find_password (email, code, reg) values(:email, :code, :reg)');
        $sql->execute(array(
            ':email' => $_POST["email"],
            ':code' => $code,
            ':reg' => $newreg,
        ));

        //이메일 발송
        $html = $code;
        $mail = mailer("LouiBooks", "comwe1022@naver.com", $_POST["email"], "Louibooks 비밀번호 변경", $html);
        if ($mail) {
            echo 'auth';
        } else {
            echo 'no auth';
        }
    }






















































    function time_diff($datetime1, $datetime2) {
        return date('U',strtotime($datetime2))-date('U',strtotime($datetime1));
    }

    function get_random_string($type = '', $len = 10) {
        $lowercase = 'abcdefghijklmnopqrstuvwxyz';
        $uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $numeric = '0123456789';
        $special = '`~!@#$%^&*()-_=+\\|[{]};:\'",<.>/?';
        $key = '';
        $token = '';
        if ($type == '') {
            $key = $lowercase.$uppercase.$numeric;
        } else {
            if (strpos($type,'09') > -1) $key .= $numeric;
            if (strpos($type,'az') > -1) $key .= $lowercase;
            if (strpos($type,'AZ') > -1) $key .= $uppercase;
            if (strpos($type,'$') > -1) $key .= $special;
        }
        for ($i = 0; $i < $len; $i++) {
            $token .= $key[mt_rand(0, strlen($key) - 1)];
        }
        return $token;
    }

    function mailer($fname, $fmail, $to, $subject, $content, $type=0, $file="", $cc="", $bcc="") {
        if ($type != 1)
            $content = nl2br($content);

        $mail = new PHPMailer(); // defaults to using php "mail()"
        
        $mail->IsSMTP(); 
    	//$mail->SMTPDebug = 2; 
        $mail->SMTPSecure = "ssl";
        $mail->SMTPAuth = true;

        $mail->Host = "smtp.naver.com";
        $mail->Port = 465;
        $mail->Username = "comwe1022";
        $mail->Password = "Mkkas3141212@;;;";

        $mail->CharSet = 'UTF-8';
        $mail->From = $fmail;
        $mail->FromName = $fname;
        $mail->Subject = $subject;
        $mail->AltBody = ""; // optional, comment out and test
        $mail->msgHTML($content);
        $mail->addAddress($to);
        $mail->SMTPKeepAlive = true;
        if ($cc)
            $mail->addCC($cc);
        if ($bcc)
            $mail->addBCC($bcc);

        if ($file != "") {
            foreach ($file as $f) {
                $mail->addAttachment($f['path'], $f['name']);
            }
        }
        return $mail->send();
    }

?>