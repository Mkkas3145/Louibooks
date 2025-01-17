<?php
    
    include_once('../../../../default_function.php');
    $secretKey = $paymentGatewaySecretKey[0];
    $userInfo = getMyLoginInfo();

    $number = $_POST["number"];
    /*
        refundReceiveAccount = array(
            bankCode = 은행 코드
            accountNumber = 계좌 번호
            holderName = 예금주
        )
    */
    $refundReceiveAccount = null;
    if (isset($_POST["refundReceiveAccount"])) {
        $refundReceiveAccount = json_decode($_POST["refundReceiveAccount"], true);
    }

    $stmt = $pdo->prepare("SELECT number, order_id, payment_key FROM payment_history WHERE user_number = :user_number AND number = :number");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"],
        ':number' => $number
    ));
    $paymentHistory = $stmt->fetch();

    if (isset($paymentHistory["payment_key"])) {
        $orderId = $paymentHistory["order_id"];
        $paymentKey = $paymentHistory["payment_key"];
        $info = getPaymentHistoryInfo($number)[0];

        /*
            0 = 환불 요청됨
            1 = 잘못된 요청
            2 = 이미 취소된 결제
            3 = 환불 계좌번호와 예금주명이 일치하지 않음
            4 = 잘못된 환불 계좌번호
            5 = 유효하지 않은 은행
            6 = 잔액 결과가 일치하지 않음
            7 = 은행 서비스 시간이 아님
            8 = 알 수 없는 이유로 오류가 발생함
            9 = 환불 불가
        */
        $resultCode = 8;
        
        //환불이 가능하면
        if ($info["isCancellable"] == true) {
            //환불 요청
            $url = "https://api.tosspayments.com/v1/payments/" . $paymentKey . "/cancel";
            $param = array(
                "cancelReason" => "사용자가 요청함"
            );
            //입금될 계좌 정보
            if ($refundReceiveAccount != null) {
                $param["refundReceiveAccount"] = $refundReceiveAccount;
            }
            $headers = array(
                "Authorization: Basic " . base64_encode($secretKey . ":"),
                "Content-Type: application/json"
            );

            $cu = curl_init();
            curl_setopt($cu, CURLOPT_URL, $url);
            curl_setopt($cu, CURLOPT_POST, true);
            curl_setopt($cu, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($cu, CURLOPT_SSLVERSION, 3);
            curl_setopt($cu, CURLOPT_POSTFIELDS, json_encode($param));
            curl_setopt($cu, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($cu, CURLOPT_TIMEOUT, 60);
            curl_setopt($cu, CURLOPT_HEADER, true);
            curl_setopt($cu, CURLOPT_HTTPHEADER, $headers);
            $result = curl_exec($cu);
            curl_close($cu);

            $txt_start = strpos($result, "{");
            $json_txt = substr($result, $txt_start);
            $info = json_decode($json_txt, true);

            //환불 요청 성공
            if (isset($info["cancels"])) {
                //결제 취소로 변경
                cancelPayment($orderId);

                $resultCode = 0;
            } else {
                $code = $info["code"];
                
                if ($code == "ALREADY_CANCELED_PAYMENT") {
                    $resultCode = 1;
                } else if ($code == "ALREADY_CANCELED_PAYMENT") {
                    $resultCode = 2;
                } else if ($code == "INVALID_REFUND_ACCOUNT_INFO") {
                    $resultCode = 3;
                } else if ($code == "INVALID_REFUND_ACCOUNT_NUMBER") {
                    $resultCode = 4;
                } else if ($code == "INVALID_BANK") {
                    $resultCode = 5;
                } else if ($code == "NOT_MATCHES_REFUNDABLE_AMOUNT") {
                    $resultCode = 6;
                } else if ($code == "NOT_AVAILABLE_BANK") {
                    $resultCode = 7;
                }
            }
        } else {
            $resultCode = 9;
        }

        echo $resultCode;
    }

?>