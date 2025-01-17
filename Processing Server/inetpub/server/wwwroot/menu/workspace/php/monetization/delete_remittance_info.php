<?php

    include_once('../../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == false) {
        echo 'not login'; exit;
    }

    $sql = $pdo->prepare('UPDATE user SET remittance_info = NULL WHERE number = :number');
    $sql->execute(array(
        ':number' => $userInfo["number"]
    ));

?>