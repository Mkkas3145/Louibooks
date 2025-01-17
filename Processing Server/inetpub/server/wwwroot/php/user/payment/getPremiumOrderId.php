<?php
    
    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    $paymentGateway = $_POST["paymentGateway"];

    //24시간 전 데이터 삭제
    $stmt = $pdo->prepare("DELETE FROM payment_order WHERE request_date < :request_date");
    $stmt->execute(array(
        ':request_date' => date("Y-m-d H:i:s", strtotime("-1 Day"))
    ));

    $a = 0;
    $b = 50;
    $strings = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $orderId = substr(str_shuffle($strings), $a, $b);

    $currency = null;
    $amount = null;
    if ($paymentGateway == 0) {
        //토스페이먼츠
        $currency = "KRW";
        $amount = 8900;
    }

    $sql = $pdo->prepare('insert into payment_order (user_number, id, type, currency, amount, request_date) values(:user_number, :id, :type, :currency, :amount, :request_date)');
    $sql->execute(array(
        ':user_number' => $userInfo["number"],
        ':id' => $orderId,
        ':type' => 0, //프리미엄
        ':currency' => $currency,
        ':amount' => $amount,
        ':request_date' => date("Y-m-d H:i:s")
    ));

    echo json_encode(array(
        "currency" => $currency,
        "amount" => $amount,
        "id" => $orderId
    ));

?>
