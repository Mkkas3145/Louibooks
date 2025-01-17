<?php

    @include_once('../../../../default_function.php');
    $userInfo = getMyLoginInfo();
    
    $number = $_POST["number"];

    $sql = $pdo->prepare('UPDATE login_key SET security_issue = 0 WHERE number = :number AND user_number = :user_number');
    $sql->execute(array(
        ':number' => $number,
        ':user_number' => $userInfo["number"]
    ));
    
?>

