<?php

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $sort = $_POST['sort'];

        $stmt = $pdo->prepare("SELECT number FROM payment_history WHERE user_number = :user_number");
        $stmt->execute(array(
            "user_number" => $userInfo["number"]
        )); 
        $result = $stmt->fetchAll();
        $result_length = count($result);
        $numbers = array();
        for ($i = 0; $i < $result_length; $i++) {
            $numbers[] = $result[$i]['number'];
        }
        ($sort == 0) ? $numbers = array_reverse($numbers) : null; //정렬
        $maxCount = (count($numbers) >= 20) ? 20 : count($numbers);
        $info = getPaymentHistoryInfo(implode(",", array_slice($numbers, 0, $maxCount)), null, null, false, true);

        //출력
        echo json_encode(array(
            "numbers" => implode(",", $numbers),
            "info" => $info
        ));
    }

?>