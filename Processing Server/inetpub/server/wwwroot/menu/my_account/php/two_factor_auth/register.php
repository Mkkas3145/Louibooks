<?php

    include_once('../../../../default_function.php');
    use RobThree\Auth\TwoFactorAuth;
    
    $userInfo = getMyLoginInfo();
    
    $secretKey = $_POST["secretKey"];
    $code = $_POST["code"];

    $tfa = new TwoFactorAuth('Louibooks');
    $isValid = $tfa->verifyCode($secretKey, $code);

    if ($isValid == true) {
        //데이터베이스에 저장
        $sql = $pdo->prepare("UPDATE user SET two_factor_auth_key = :secret_key WHERE number = :number");
        $sql->execute(array(
            ':number' => $userInfo["number"],
            ':secret_key' => $secretKey
        ));
        echo "registered";
    } else {
        echo "unregistered";
    }

?>

