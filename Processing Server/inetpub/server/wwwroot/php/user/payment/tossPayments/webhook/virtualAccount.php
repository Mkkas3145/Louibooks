<?php
    
    header('Content-Type: application/json; charset=UTF-8');
    include_once('../../../../../default_function.php');

    $body = file_get_contents("php://input");
    $params = json_decode($body, true);

    if (isset($params["orderId"])) {
        $orderId = $params["orderId"];
        $status = $params["status"];
        $secret = $params["secret"];

        $stmt = $pdo->prepare("SELECT payment_key, payment_info FROM payment_history WHERE order_id = :order_id");
        $stmt->execute(array(
            "order_id" => $orderId
        ));
        $paymenthistory = $stmt->fetch();
        
        if (isset($paymenthistory["payment_info"])) {
            $paymentInfo = json_decode($paymenthistory["payment_info"], true);

            if ($status == "DONE" && $paymentInfo["secret"] == $secret) {
                //결제됨으로 변경
                completePayment($orderId);
            }
        }
    }

?>