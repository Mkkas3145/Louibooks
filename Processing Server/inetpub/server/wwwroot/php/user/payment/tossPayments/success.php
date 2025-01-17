<?php
    
    include_once('../../../../default_function.php');
    $secretKey = $paymentGatewaySecretKey[0];
    $userInfo = getMyLoginInfo();

    $orderId = $_GET["orderId"];
    $paymentKey = $_GET["paymentKey"];
    $amount = $_GET["amount"];

    //24시간 전 데이터 삭제
    $stmt = $pdo->prepare("DELETE FROM payment_order WHERE request_date < :request_date");
    $stmt->execute(array(
        ':request_date' => date("Y-m-d H:i:s", strtotime("-1 Day"))
    ));

    //주문 정보
    $stmt = $pdo->prepare("SELECT user_number, type, data, currency, amount FROM payment_order where id = :id");
    $stmt->execute(array(
        ':id' => $orderId
    ));
    $paymentOrder = $stmt->fetch();

    //주문이 존재하는지
    if (isset($paymentOrder["user_number"])) {
        //통화 단위가 KRW이(가) 아니면
        if ($paymentOrder["currency"] != "KRW") {
            echo "ERROR: Wrong currency unit";
            exit;
        }

        //결제가 가능한지
        $availablePaymentInfo = getAvailablePayment($paymentOrder["user_number"], $paymentOrder["type"], $paymentOrder["data"]);
        if ($availablePaymentInfo["isAvailable"] == true) {
            //만료되지 않은 결제 내역 삭제
            $waitingPaymentNumbers = $availablePaymentInfo["waitingPaymentNumbers"];
            $waitingPaymentNumbers_length = count($waitingPaymentNumbers);

            for ($i = 0; $i < $waitingPaymentNumbers_length; $i++) {
                deletePayment($waitingPaymentNumbers[$i]);
            }
        } else {
            echo "ERROR: This is a duplicate payment.";
            exit;
        }

        $originalAmount = $paymentOrder["amount"];
        $data = null;
        $isDone = false;

        //결제 금액이랑 결제된 금액이랑 같을 경우
        if ($amount == $originalAmount) {
            $url = "https://api.tosspayments.com/v1/payments/confirm";
            $param = array(
                "paymentKey" => $paymentKey,
                "orderId" => $orderId,
                "amount" => $amount
            );
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
            $data = getPaymentInfo($info);

            //결제 수단이 가상계좌면
            if ($data["info"]["method"] == 2) {
                $data["secret"] = $info["secret"];
            }

            //결제 완료이면
            if ($info["status"] == "DONE") {
                $isDone = true;
            }
        } else {
            echo "ERORR: Payment amount doesn't match";
            exit;
        }

        //주문 데이터 삭제
        $stmt = $pdo->prepare("DELETE FROM payment_order WHERE id = :id");
        $stmt->execute(array(
            ':id' => $orderId
        ));

        $sql = $pdo->prepare('insert into payment_history (user_number, order_id, order_type, order_data, payment_gateway, payment_key, currency, amount, payment_info, status, date) values(:user_number, :order_id, :order_type, :order_data, :payment_gateway, :payment_key, :currency, :amount, :payment_info, :status, :date)');
        $sql->execute(array(
            ':user_number' => $paymentOrder["user_number"],
            ':order_id' => $orderId,
            ':order_type' => $paymentOrder["type"],
            ':order_data' => $paymentOrder["data"],
            ':payment_gateway' => 0, //PG: 토스페이먼츠
            ':payment_key' => $paymentKey,
            ':currency' => $info["currency"],
            ':amount' => $amount,
            ':payment_info' => json_encode($data),
            ':status' => 2, //대기중
            ':date' => date("Y-m-d H:i:s")
        ));
        $lastInsertId = $pdo->lastInsertId();

        if ($isDone == true) {
            //결제됨으로 변경
            completePayment($orderId);
        }
    } else {
        echo "ERORR: Order expired.";
        exit;
    }








































    //결제 수단
    /*
        0 = 카드 결제
        1 = 계좌이체
        2 = 가상계좌
        3 = 휴대폰
        4 = 간편 결제
        5 = 문화상품권
    */

    //상태값
    /*
        0 = 결제됨
        1 = 취소됨
        2 = 대기중
    */

    function getPaymentInfo($info) {
        $method = null;
        if ($info["method"] == "카드") {
            $method = 0;
        } else if ($info["method"] == "계좌이체") {
            $method = 1;
        } else if ($info["method"] == "가상계좌") {
            $method = 2;
        } else if ($info["method"] == "휴대폰") {
            $method = 3;
        } else if ($info["method"] == "간편결제") {
            $method = 4;
        } else if ($info["method"] == "문화상품권") {
            $method = 5;
        }

        //결제 정보
        $paymentInfo = null;
        if ($method == 0) {
            //카드 결제일 경우
            $paymentInfo = array(
                "method" => $method,
                "issuerCode" => $info["card"]["issuerCode"],
                "acquirerCode" => $info["card"]["acquirerCode"]
            );
        }
        if ($method == 1) {
            //계좌이체일 경우
            $paymentInfo = array(
                "method" => $method,
                "bankCode" => $info["transfer"]["bankCode"]
            );
        }
        if ($method == 2) {
            $timestamp = strtotime("+72 hours");

            //가상계좌일 경우
            $paymentInfo = array(
                "method" => $method,
                "bankCode" => (int) $info["virtualAccount"]["bankCode"],
                "accountNumber" => $info["virtualAccount"]["accountNumber"],
                "expiryDate" => date("Y-m-d H:i:s", $timestamp)
            );
        }
        if ($method == 3) {
            //핸드폰 결제일 경우
            $paymentInfo = array(
                "method" => $method,
                "mobilePhone" => (int) $info["mobilePhone"]["customerMobilePhone"]
            );
        }
        if ($method == 4) {
            $provider = $info["easyPay"]["provider"];
            if ($provider == "토스페이") {
                $provider = "TOSSPAY";
            } else if ($provider == "네이버페이") {
                $provider = "NAVERPAY";
            } else if ($provider == "삼성페이") {
                $provider = "SAMSUNGPAY";
            } else if ($provider == "엘페이") {
                $provider = "LPAY";
            } else if ($provider == "카카오페이") {
                $provider = "KAKAOPAY";
            } else if ($provider == "페이코") {
                $provider = "PAYCO";
            } else if ($provider == "LG페이") {
                $provider = "LGPAY";
            } else if ($provider == "SSG페이") {
                $provider = "SSG";
            } else if ($provider == "애플페이") {
                $provider = "APPLEPAY";
            }
            
            //간편결제일 경우
            $paymentInfo = array(
                "method" => $method,
                "provider" => strtolower($provider)
            );
        }
        if ($method == 5) {
            //문화상품권일 경우
            $paymentInfo = array(
                "method" => $method,
                "approveNo" => $info["giftCertificate"]["approveNo"]
            );
        }

        $receipt = null;
        if ($info["receipt"] != null) {
            $receipt = $info["receipt"]["url"];
        }
        
        $data = array(
            "info" => $paymentInfo,
            "receipt" => $receipt,
            "useEscrow" => $info["useEscrow"]
        );
        return $data;
    }

?>

<script>
    location.href = "/payment_history/<?php echo $lastInsertId ?>";
</script>