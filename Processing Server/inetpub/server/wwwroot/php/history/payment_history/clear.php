<?php

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $userNumber = $userInfo["number"];

        //결제 내역 삭제
        $stmt = $pdo->prepare("SELECT number FROM payment_history WHERE user_number = :user_number");
        $stmt->execute(array(
            ':user_number' => $userNumber
        ));
        $paymentHistory = $stmt->fetchAll();
        $paymentHistory_length = count($paymentHistory);
        for ($i = 0; $i < $paymentHistory_length; $i++) {
            deletePayment($paymentHistory[$i]["number"]);
        }
    }

?>