<?php

    include_once('../../default_function.php');



    
    //데이터 유효성 검사
    if(!filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
        echo 'not email';
        exit;
    } else if ((!isset($_POST["email"])) || (!isset($_POST["name"])) || (!isset($_POST["pw"]))) {
        echo 'not data';
        exit;
    } else if ($_POST["email"] == '' || $_POST["name"] == '' || $_POST["pw"] == '') {
        echo 'not data';
        exit;
    } else if (mb_strlen($_POST["name"], "UTF-8") > 20) {
        echo 'max data length / nickname';
    } else if (mb_strlen($_POST["email"], "UTF-8") > 50) {
        echo 'max data length / email';
        exit;
    }
    $_POST["email"] = trim($_POST["email"]);





    //이메일 존재하는지
    $stmt = $pdo->prepare("SELECT number FROM user where email = :email AND password is NOT NULL");
    $stmt->execute(array(
        ':email' => $_POST["email"],
    ));
    $result = $stmt->fetch();

    if (isset($result["number"])) {
        echo 'email exists';
        exit;
    }



    $newreg = date("Y-m-d H:i:s");

    //인증 코드 관련
    $stmt = $pdo->prepare("SELECT number, reg, code FROM email_auth where email = :email");
    $stmt->execute(array(
        ':email' => $_POST["email"],
    ));
    $result = $stmt->fetchAll();
    $result_length = count($result);

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
                $stmt = $pdo->prepare("DELETE FROM email_auth WHERE number = :number");
                $stmt->execute(array(
                    ':number' => $raw_number,
                ));
            }
        }
    }




    //이메일 발송 관련
    include_once('./PHPMailer/PHPMailerAutoload.php');
    
    //보내온 데이터 중에 인증 코드가 있을 경우
    if (isset($_POST["key"])) {
        if (isset($raw_code)) {
            if ($raw_code == $_POST["key"]) {
                $stmt = $pdo->prepare("DELETE FROM email_auth WHERE number = :number");
                $stmt->execute(array(
                    ':number' => $raw_number,
                ));

                //비밀번호 암호화 - salt 값
                $a = 0;
                $b = 25;
                $strings = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                $salt = substr(str_shuffle($strings), $a, $b);

                //비밀번호 암호화 - password
                $password = base64_encode(hash('sha512', $salt . $_POST["pw"], true));
                for ($i = 0; $i < 10000; $i++) {
                    $password = base64_encode(hash('sha512', $password, true));
                }

                //랜덤 프로필
                $default_profile_json = generateRandomProfile($_POST["name"]);

                //계정이 없으면 계정을 생성한다.
                if (getUserByEmail($_POST["email"]) == false) {
                    $sql = $pdo->prepare('insert into user (nickname, email, password, salt, default_profile, creation_date) values(:nickname, :email, :password, :salt, :default_profile, :creation_date)');
                    $sql->execute(array(
                        ':nickname' => cut_str($_POST["name"], 50),
                        ':email' => $_POST["email"],
                        ':password' => $password,
                        ':salt' => $salt,
                        ':default_profile' => $default_profile_json,
                        ':creation_date' => date("Y-m-d H:i:s"),
                    ));
                } else {
                    //사용자 비밀번호를 업데이트한다.
                    $sql = $pdo->prepare('UPDATE user SET password = :password, salt = :salt WHERE email = :email AND password is NULL');
                    $sql->execute(array(
                        ':email' => $_POST["email"],
                        ':password' => $password,
                        ':salt' => $salt
                    ));
                }

                echo 'signup success';
                exit;
            } else {
                echo 'not same key';
            }
        } else {
            echo 'not same key';
        }
    } else {
        //없을 경우
        $code = get_random_string("09", 5);

        $sql = $pdo->prepare('insert into email_auth (email, code, reg) values(:email, :code, :reg)');
        $sql->execute(array(
            ':email' => $_POST["email"],
            ':code' => $code,
            ':reg' => $newreg,
        ));

        //이메일 발송
        $html = '
        <b style = "font-size: 22px;">계정 생성 인증코드</b>
        <div style = "font-size: 16px; margin-top: 20px;">가입해주셔서 감사드립니다.<br>Louibooks 계정을 생성하기 위해선 인증코드가 필요합니다.</div>
        <div style = "font-weight: bold; padding: 15px 20px; background-color: #eeeeee; font-size: 30px; margin-top: 20px;">' . $code . '</div>
        <div style = "font-size: 16px; margin-top: 20px;">인증코드는 5분 뒤에 만료됩니다.</div>
        <a href = "https://louibooks.com" target = "_blank">louibooks.com</a>
        ';
        $mail = mailer("LouiBooks", "comwe1022@naver.com", $_POST["email"], "Louibooks 회원가입 인증 코드", $html);
        if ($mail) {
            echo 'auth';
        } else {
            echo 'no auth';
        }
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


?>