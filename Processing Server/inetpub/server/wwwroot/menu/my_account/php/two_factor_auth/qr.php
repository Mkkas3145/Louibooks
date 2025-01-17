<?php

    include_once('../../../../default_function.php');
    use RobThree\Auth\TwoFactorAuth;
    
    $userInfo = getMyLoginInfo();
    $secretKey = $_GET["secretKey"];

    $tfa = new TwoFactorAuth('Louibooks');
    $qrCodeUrl = $tfa->getQRCodeImageAsDataUri($userInfo["email"], $secretKey);
    $qrCodeImg = imagecreatefromstring(base64_decode(str_replace('data:image/png;base64,', '', $qrCodeUrl)));

    header('Content-Type: image/png');
    imagepng($qrCodeImg);

?>

