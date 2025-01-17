<?php

    @include_once('../../../../default_function.php');
    $userInfo = getMyLoginInfo();
    
    $number = $_POST["number"];

    $stmt = $pdo->prepare("DELETE FROM login_key WHERE user_number = :user_number AND number = :number");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"],
        ':number' => $number
    ));
    
?>

