<?php

    $menuNumber = $_POST["menuNumber"];

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    $stmt = $pdo->prepare("SELECT two_factor_auth_key FROM user WHERE number = :number");
    $stmt->execute(array(
        ':number' => $userInfo["number"]
    ));
    $twoFactorAuthKey = $stmt->fetch();

    if (isset($twoFactorAuthKey["two_factor_auth_key"])) {
        echo "Secondary authentication already set up";
        exit;
    }

    $a = 0;
    $b = 100;
    $strings = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $secretKey = substr(str_shuffle($strings), $a, $b);
    $secretKey = base32_encode($secretKey);

    function base32_encode($input) {
        $charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    
        $output = '';
        $buffer = 0;
        $buffer_size = 0;
    
        for ($i = 0; $i < strlen($input); $i++) {
            $buffer <<= 8;
            $buffer |= ord($input[$i]);
            $buffer_size += 8;
    
            while ($buffer_size >= 5) {
                $buffer_size -= 5;
                $output .= $charset[($buffer >> $buffer_size) & 31];
            }
        }
    
        if ($buffer_size > 0) {
            $buffer <<= (5 - $buffer_size);
            $output .= $charset[$buffer & 31];
        }
    
        return $output;
    }

?>

<div class = "secret_key" style = "display: none;"><?php echo $secretKey; ?></div>

<div class = "menu_my_account_two_factor_auth">
    <div class = "menu_my_account_two_factor_auth_qr_wrap">
        <div class = "menu_my_account_two_factor_auth_qr_box img_wrap">
            <img src = "/menu/my_account/php/two_factor_auth/qr.php?secretKey=<?php echo $secretKey ?>" onload = "imageLoad(event);" alt = "">
        </div>
    </div>
    <div class = "menu_my_account_two_factor_auth_line"></div>
    <div class = "menu_my_account_two_factor_auth_input">
        <div class = "menu_my_account_two_factor_auth_input_title">
            ...
        </div>
        <div class = "menu_my_account_two_factor_auth_input_description">
            ...
        </div>
        <div class = "menu_my_account_two_factor_auth_input_list">
            <input type = "number" onkeydown = "checkInputMyAccountTwoFactorAuth(event, <?php echo $menuNumber; ?>, 0);">
            <input type = "number" onkeydown = "checkInputMyAccountTwoFactorAuth(event, <?php echo $menuNumber; ?>, 1);">
            <input type = "number" onkeydown = "checkInputMyAccountTwoFactorAuth(event, <?php echo $menuNumber; ?>, 2);">
            <input type = "number" onkeydown = "checkInputMyAccountTwoFactorAuth(event, <?php echo $menuNumber; ?>, 3);">
            <input type = "number" onkeydown = "checkInputMyAccountTwoFactorAuth(event, <?php echo $menuNumber; ?>, 4);">
            <input type = "number" onkeydown = "checkInputMyAccountTwoFactorAuth(event, <?php echo $menuNumber; ?>, 5);">
        </div>
    </div>
    <div class = "menu_my_account_two_factor_auth_line" style = "margin-top: 70px;"></div>
    <div class = "menu_my_account_two_factor_auth_bottom">
        <div class = "menu_my_account_two_factor_auth_bottom_button md-ripples" onclick = "requestMyAccountTwoFactorAuth(<?php echo $menuNumber; ?>);">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
            <span>...</span>
        </div>
    </div>
</div>