<?php

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $numbers = $_POST['numbers'];
        $info = getPaymentHistoryInfo($numbers);

        //출력
        echo json_encode($info);
    }

?>