<?php

    //시간대 설정: 서울
    date_default_timezone_set('Asia/Seoul');

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        //전체 파일 용량
        $stmt = $pdo->prepare("SELECT SUM(size) FROM cloud where type != 0 and user_number = :user_number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
        ));
        $cloudFileSize = $stmt->fetch()[0];

        if ($cloudFileSize >= $userInfo["cloud"]["maxSize"]) {
            echo "max cloud size";
            exit;
        }

        $number = $_POST["number"];
        $data = $_POST["data"];
        $size = strlen($data) / 1024;
    
        $sql = $pdo->prepare('UPDATE cloud SET data = :data, size = :size WHERE number = :number AND user_number = :user_number');
        $sql->execute(array(
            ':number' => $number,
            ':data' => $data,
            ':size' => $size,
            ':user_number' => $userInfo["number"],
        ));

        echo "saved";
    }

?>