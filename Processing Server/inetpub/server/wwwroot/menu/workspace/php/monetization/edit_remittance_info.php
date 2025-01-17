<?php

    include_once('../../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == false) {
        echo 'not login'; exit;
    }

    $info = array(
        "country" => $_POST["country"],
        "bankCode" => $_POST["bankCode"],
        "bankAccountNumber" => $_POST["bankAccountNumber"]
    );

    $stmt = $pdo->prepare("SELECT remittance_info FROM user WHERE number = :number");
    $stmt->execute(array(
        ':number' => $userInfo["number"],
    ));
    $remittanceInfo = $stmt->fetch();

    $sql = $pdo->prepare('UPDATE user SET remittance_info = :remittance_info WHERE number = :number');
    $sql->execute(array(
        ':remittance_info' => json_encode($info),
        ':number' => $userInfo["number"]
    ));

    if (isset($remittanceInfo["remittance_info"])) {
        echo "changed";
    } else {
        echo "added";
    }

?>