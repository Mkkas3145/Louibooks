<?php

    include_once('../../../../default_function.php');
    $userInfo = getMyLoginInfo();
    $type = $_POST["type"];
    $data = json_decode($_POST["data"], true);

    /* 기본 정보 */
    if ($type == "nickname") {
        $nickname = cut_str($data[0]["value"], 50);
        if ($nickname != "") {
            $stmt = $pdo->prepare("SELECT default_profile FROM user WHERE number = :number");
            $stmt->execute(array(
                ':number' => $userInfo["number"],
            ));
            $defaultProfile = json_decode($stmt->fetch()["default_profile"], true);
    
            $newDefaultProfile = array(
                'random_color' => $defaultProfile["random_color"],
                'first_letter' => mb_substr($nickname, 0, 1)
            );
    
            //수정
            $sql = $pdo->prepare('UPDATE user SET nickname = :nickname, default_profile = :default_profile WHERE number = :number');
            $sql->execute(array(
                ':number' => $userInfo["number"],
                ':nickname' => cut_str($nickname, 50),
                ':default_profile' => json_encode($newDefaultProfile)
            ));
        }
    } else if ($type == "my_page_description") {
        $description = null;
        if (isset($data[0]["value"])) {
            $description = cut_str($data[0]["value"], 500);
        }
        $stmt = $pdo->prepare("UPDATE user SET description = :description WHERE number = :number");
        $stmt->execute(array(
            ':number' => $userInfo["number"],
            ':description' => $description
        ));
    } else if ($type == "gender") {
        $gender = null;
        if ($data[0]["value"] == -1 || $gender > 1) {
            $gender = null;
        } else {
            $gender = $data[0]["value"];
        }
        $stmt = $pdo->prepare("UPDATE user SET gender = :gender WHERE number = :number");
        $stmt->execute(array(
            ':number' => $userInfo["number"],
            ':gender' => $gender
        ));
    } else if ($type == "birth_date") {
        if ($data[0]["value"] == false) {
            $stmt = $pdo->prepare("UPDATE user SET birth_year = NULL, birth_month = NULL, birth_day = NULL WHERE number = :number");
            $stmt->execute(array(
                ':number' => $userInfo["number"]
            ));
        } else {
            $birthYear = $data[1]["value"];
            $birthMonth = $data[2]["value"];
            $birthDay = $data[3]["value"];
            $stmt = $pdo->prepare("UPDATE user SET birth_year = :birth_year, birth_month = :birth_month, birth_day = :birth_day WHERE number = :number");
            $stmt->execute(array(
                ':number' => $userInfo["number"],
                ':birth_year' => $birthYear,
                ':birth_month' => $birthMonth,
                ':birth_day' => $birthDay
            ));
        }
    }

    /* 민감한 정보 */
    if ($type == "password") {
        $currentPassword = null;
        $newPassword = null;
        if (isset($data[1])) {
            $currentPassword = $data[0]["value"];
            $newPassword = $data[1]["value"];
        } else {
            $newPassword = $data[0]["value"];
        }

        $stmt = $pdo->prepare("SELECT password, salt FROM user WHERE number = :number");
        $stmt->execute(array(
            ':number' => $userInfo["number"]
        ));
        $result = $stmt->fetch();

        $salt = $result["salt"];
        $password = base64_encode(hash('sha512', ($salt . $currentPassword), true));
        for ($i = 0; $i < 10000; $i++) {
            $password = base64_encode(hash('sha512', $password, true));
        }

        if (isset($result["password"]) == false || $password == $result["password"]) {
            if ($newPassword != "") {
                //비밀번호 암호화 - salt 값
                $salt = random_bytes(10);
                $salt = bin2hex($salt);
                //비밀번호 암호화 - password
                $password = base64_encode(hash('sha512', ($salt . $newPassword), true));
                for ($i = 0; $i < 10000; $i++) {
                    $password = base64_encode(hash('sha512', $password, true));
                }
                $sql = $pdo->prepare("UPDATE user SET password = :password, salt = :salt WHERE number = :number");
                $sql->execute(array(
                    ':number' => $userInfo["number"],
                    ':password' => $password,
                    ':salt' => $salt
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
                    ':user_number' => $userInfo["number"],
                    ':random_key' => $loginKey
                ));
                $sql = $pdo->prepare("UPDATE login_key SET security_issue = 0 WHERE user_number = :user_number");
                $sql->execute(array(
                    ':user_number' => $userInfo["number"]
                ));
            } else {
                echo "You do not have a new password.";
                exit;
            }
        } else {
            echo "Your current password is invalid.";
            exit;
        }
    }

    /* 본인 인증 방법 */
    if ($type == "rigorous_access_procedures") {
        $rigorousAccessProcedures = $data[0]["value"];
        $sql = $pdo->prepare("UPDATE user SET rigorous_access_procedures = :rigorous_access_procedures WHERE number = :number");
        $sql->execute(array(
            ':number' => $userInfo["number"],
            ':rigorous_access_procedures' => $rigorousAccessProcedures
        ));
    }
    if ($type == "two_factor_auth") {
        $twoFactorAuth = $data[0]["value"];
        if ($twoFactorAuth == false) {
            $sql = $pdo->prepare("UPDATE user SET two_factor_auth_key = NULL WHERE number = :number");
            $sql->execute(array(
                ':number' => $userInfo["number"]
            ));
        }
    }

?>

