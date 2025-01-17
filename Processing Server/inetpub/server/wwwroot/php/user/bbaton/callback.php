<?php
    
    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $client_id = "JDJhJDA0JE5CbUwwbXFidi9SZ2xhSWdNWjkwNHVyenB2Qk1LR2dTcUlsT05u";
        $secret_key = "ay54VVhwdHVOdlB6NG1L";
        $redirect_uri = "https://louibooks.com/php/user/bbaton/callback.php";
        $code = $_GET["code"];
        $url = "https://bauth.bbaton.com/oauth/token";

        $param = array(
            "grant_type" => "authorization_code",
            "redirect_uri" => $redirect_uri,
            "code" => $code
        );

        $headers = array(
            "Authorization: Basic " . base64_encode($client_id . ":" . $secret_key)
        );

        $cu = curl_init();
        curl_setopt($cu, CURLOPT_URL, $url);
        curl_setopt($cu, CURLOPT_POST, true);
        curl_setopt($cu, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($cu, CURLOPT_SSLVERSION, 3);
        curl_setopt($cu, CURLOPT_POSTFIELDS, http_build_query($param));
        curl_setopt($cu, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($cu, CURLOPT_TIMEOUT, 60);
        curl_setopt($cu, CURLOPT_HEADER, true);
        curl_setopt($cu, CURLOPT_HTTPHEADER, $headers);
        $token = curl_exec($cu);
        curl_close($cu);

        $txt_start = strpos($token, "{");
        $json_txt = substr($token, $txt_start);
        $json_token = json_decode($json_txt, true);
        $access_token = $json_token["access_token"];

        //토큰 키로 사용자 정보 불러오기
        $url = "https://bapi.bbaton.com/v2/user/me";
        $headers = array(
            "Authorization: Bearer " .$access_token
        );
        $cu = curl_init();
        curl_setopt($cu, CURLOPT_URL, $url);
        curl_setopt($cu, CURLOPT_POST, false);
        curl_setopt($cu, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($cu, CURLOPT_SSLVERSION, 3);
        curl_setopt($cu, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($cu, CURLOPT_TIMEOUT, 60);
        curl_setopt($cu, CURLOPT_HEADER, true);
        curl_setopt($cu, CURLOPT_HTTPHEADER, $headers);
        $user = curl_exec($cu);
        curl_close($cu);
        $txt_start = strpos($user, "{");
        $json_txt = substr($user, $txt_start);
        $json_user = json_decode($json_txt, true);
        if ($json_user["adult_flag"] == "Y") {
            $gender = $json_user["gender"];
            if ($gender == "M") {
                $gender = 0;
            } else {
                $gender = 1;
            }
            $birth_year = date("Y") - ((int) $json_user["birth_year"]);
            $isAdult = $json_user["adult_flag"];
            if ($isAdult == "Y") {
                $isAdult = true;
            } else {
                $isAdult = false;
            }

            $sql = $pdo->prepare('UPDATE user SET gender = :gender, adult = :adult WHERE number = :number');
            $sql->execute(array(
                ':number' => $userInfo["number"],
                ':gender' => $gender,
                ':adult' => $isAdult
            ));

            //생년 업데이트
            if (isset($userInfo["birth_year"]) == false && $userInfo["birth_year"] != "" && $userInfo["birth_year"] != null) {
                $sql = $pdo->prepare('UPDATE user SET birth_year = :birth_year, birth_month = :birth_month, birth_day = :birth_day WHERE number = :number AND birth_year is NULL');
                $sql->execute(array(
                    ':number' => $userInfo["number"],
                    ':birth_year' => $birth_year,
                    ':birth_month' => 1,
                    ':birth_day' => 1
                ));
            }

            echo "성인 인증이 되었습니다. Louibooks을(를) 이용해주셔서 감사합니다.";
        } else {
            echo "성인 인증이 실패하였습니다. 다시 시도하십시오.";
        }

    }

?>