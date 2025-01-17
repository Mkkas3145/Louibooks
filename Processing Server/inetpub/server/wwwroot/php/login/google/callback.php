<?php

    include_once('../../../default_function.php');

    $client_id = "1017277245083-0cut38qv73v2br4rhfnou21cln49ei3s.apps.googleusercontent.com";
    $secret_key = "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";
    $redirect_uri = "https://louibooks.com/php/login/google/callback.php";
    $code = $_GET["code"];
    
    $url = "https://oauth2.googleapis.com/token?code=$code&client_id=$client_id&client_secret=$secret_key&redirect_uri=$redirect_uri&grant_type=authorization_code";

    $cu = curl_init();
    curl_setopt($cu, CURLOPT_URL, $url);
    curl_setopt($cu, CURLOPT_POST, true);
    curl_setopt($cu, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($cu, CURLOPT_SSLVERSION, 3);
    curl_setopt($cu, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($cu, CURLOPT_TIMEOUT, 60);
    curl_setopt($cu, CURLOPT_HEADER, true);
    $token = curl_exec($cu);
    $txt_start = strpos($token, "{");
    $json_txt = substr($token, $txt_start);
    $json = json_decode($json_txt, true);
    curl_close($cu);

    //토큰이 받아와졌다면
    if (isset($json["access_token"])) {
        $accessToken = $json["access_token"];

        $googleAPI = "https://www.googleapis.com/oauth2/v3/userinfo?access_token=$accessToken";
        $cu = curl_init();
        curl_setopt($cu, CURLOPT_URL, $googleAPI);
        curl_setopt($cu, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($cu, CURLOPT_SSLVERSION, 3);
        curl_setopt($cu, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($cu, CURLOPT_TIMEOUT, 60);
        curl_setopt($cu, CURLOPT_HEADER, true);
        $userInfo = curl_exec($cu);
        $txt_start = strpos($userInfo, "{");
        $json_txt = substr($userInfo, $txt_start);
        $json = json_decode($json_txt, true);
        curl_close($cu);

        //유저 아이디
        $userId = $json["sub"];

        $googleAPI = "https://people.googleapis.com/v1/people/$userId?personFields=birthdays,genders&access_token=$accessToken";
        $cu = curl_init();
        curl_setopt($cu, CURLOPT_URL, $googleAPI);
        curl_setopt($cu, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($cu, CURLOPT_SSLVERSION, 3);
        curl_setopt($cu, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($cu, CURLOPT_TIMEOUT, 60);
        curl_setopt($cu, CURLOPT_HEADER, true);
        $peopleInfo = curl_exec($cu);
        $txt_start = strpos($peopleInfo, "{");
        $json_txt = substr($peopleInfo, $txt_start);
        $peopleJson = json_decode($json_txt, true);
        curl_close($cu);

        //검증된 이메일이여야됨
        if (isset($json["email_verified"]) && $json["email_verified"] == true) {
            $name = $json["name"];
            $email = $json["email"];
            $picture = $json["picture"];
            $picture = str_replace("=s96-c", "=s500-c", $picture);
            $gender = null;
            if (isset($peopleJson["genders"])) {
                $value = $peopleJson["genders"][0]["value"];
                if ($value == "male") {
                    $gender = 0;
                } else if ($value == "female") {
                    $gender = 1;
                }
            }
            $birthYear = null;
            $birthMonth = null;
            $birthDay = null;
            if (isset($peopleJson["birthdays"])) {
                $date = $peopleJson["birthdays"][0]["date"];
                $birthYear = $date["year"];
                $birthMonth = $date["month"];
                $birthDay = $date["day"];
            }
            
            //유저 번호
            $userNumber = getUserByEmail($email);

            //계정이 없다면 만든다.
            if ($userNumber == null) {
                $profileInfo = array(
                    'type' => "image",
                    'url' => $picture,
                    'resize' => 1,
                    'translateY' => 0,
                    'translateX' => 0,
                    'width' => 500,
                    'height' => 500
                );

                $sql = $pdo->prepare('insert into user (nickname, email, profile, default_profile, gender, birth_year, birth_month, birth_day, creation_date) values(:nickname, :email, :profile, :default_profile, :gender, :birth_year, :birth_month, :birth_day, :creation_date)');
                $sql->execute(array(
                    ':nickname' => cut_str($name, 50),
                    ':email' => $email,
                    ':profile' => json_encode($profileInfo),
                    ':default_profile' => generateRandomProfile($name),
                    ':creation_date' => date("Y-m-d H:i:s"),
                    ':gender' => $gender,
                    ':birth_year' => $birthYear,
                    ':birth_month' => $birthMonth,
                    ':birth_day' => $birthDay
                ));
                $userNumber = $pdo->lastInsertId();
            } else {
                //계정이 있다면 필수 정보만 업데이트한다.

                if ($gender != null) {
                    //성별 업데이트
                    $sql = $pdo->prepare('UPDATE user SET gender = :gender WHERE number = :number');
                    $sql->execute(array(
                        ':number' => $userNumber,
                        ':gender' => $gender
                    ));
                }

                if ($birthYear != null) {
                    //생년월일 업데이트
                    $sql = $pdo->prepare('UPDATE user SET birth_year = :birth_year, birth_month = :birth_month, birth_day = :birth_day WHERE number = :number');
                    $sql->execute(array(
                        ':number' => $userNumber,
                        ':birth_year' => $birthYear,
                        ':birth_month' => $birthMonth,
                        ':birth_day' => $birthDay
                    ));
                }
            }

            //로그인 키 생성
            $loginKey = createLoginKey($userNumber);
            setCookieValue('LOGINKEY', $loginKey);

            //다른 계정 로그인 - 로그인 키 저장
            saveOtherAccountLoginKey($userNumber, $loginKey);
            //다른 계정 로그인
            saveOtherAccountUserNumber($userNumber);

            echo "<script>location.href = \"https://louibooks.com\";</script>";
        } else {
            echo "ERROR: email_verified is " . $json["email_verified"];
        }
    } else {
        echo "ERROR: " . $json["error_description"];
    }

?>