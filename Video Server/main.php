<?php

    //데이터베이스
    $dbHost = "172.30.1.56";
    $dbName = "loui";
    $dbUser = "root";
    $dbPass = ">x?KAFH}+7hIuzgIE~8pJ>ULRBRHv{4<s4I>#|ES!XL_0q9K<.";
    $dbChar = "utf8";

    $pdoOptions = array(
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_PERSISTENT => true,
        PDO::ATTR_STRINGIFY_FETCHES => false,
        PDO::MYSQL_ATTR_COMPRESS => true,                   //네트워크 통신 압축 사용
        PDO::MYSQL_ATTR_DIRECT_QUERY => true,               //쿼리 준비 안함
        PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,    //인증서 확인 안함
        PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true          //쿼리 버퍼링 사용
    );

    $dsn = "mysql:host={$dbHost};dbname={$dbName};charset={$dbChar}";
    @$pdo = new PDO($dsn, $dbUser, $dbPass, $pdoOptions);

    $serverIp = gethostbyname(gethostname());
    
    //초기화
    echo "초기화 중... \n";

    $encodingPath = dirname(__FILE__) . '\encoding';
    $files = glob($encodingPath . '/*');
    foreach ($files as $file) {
        if (is_file($file)) {
            @unlink($file);
        }
    }

    $tempPath = dirname(__FILE__) . '\temp';
    $files = glob($tempPath . '/*');
    foreach ($files as $file) {
        if (is_file($file)) {
            @unlink($file);
        }
    }

    //처리 중을 대기 중으로 변경
    $sql = $pdo->prepare('UPDATE video_encoding SET avc1 = 2, processing_ip = NULL WHERE avc1 = 1 AND processing_ip = :processing_ip');
    $sql->execute(array(
        ":processing_ip" => $serverIp
    ));
    $sql = $pdo->prepare('UPDATE video_encoding SET vp09 = 2, processing_ip = NULL WHERE vp09 = 1 AND processing_ip = :processing_ip');
    $sql->execute(array(
        ":processing_ip" => $serverIp
    ));
    $sql = $pdo->prepare('UPDATE video_encoding SET av01 = 2, processing_ip = NULL WHERE av01 = 1 AND processing_ip = :processing_ip');
    $sql->execute(array(
        ":processing_ip" => $serverIp
    ));

    echo "초기화 완료 \n";

    while (true) {
        //vp09, av01 처리 안함
        $sql = $pdo->prepare('UPDATE video_encoding SET vp09 = 0, av01 = 0');
        $sql->execute();

        $stmt = $pdo->prepare("SELECT avc1, vp09, av01, number, part_number, video_id, original_file_name FROM video_encoding WHERE (avc1 = 2 OR vp09 = 2 OR av01 = 2) AND (avc1 != 1 AND vp09 != 1 AND av01 != 1) LIMIT 1");
        $stmt->execute();
        $encoding = $stmt->fetch();
        if (isset($encoding["number"])) {
            echo "처리 요청 중... \n";

            //처리할 코덱
            $codecId = null;
            if ($encoding["avc1"] == 2) {
                $codecId = "avc1";
            } else if ($encoding["vp09"] == 2) {
                $codecId = "vp09";
            } else if ($encoding["av01"] == 2) {
                $codecId = "av01";
            }

            //상태를 처리 중으로 변경
            $sql = $pdo->prepare('UPDATE video_encoding SET ' . $codecId . ' = 1, processing_ip = :processing_ip WHERE number = :number');
            $sql->execute(array(
                ":number" => $encoding["number"],
                ':processing_ip' => $serverIp
            ));

            //처리 요청
            execAsync('"' . dirname(__FILE__) . '\php\php.exe" -f "' . dirname(__FILE__) . '\process.php" number=' . $encoding['number'] . ' partNumber=' . $encoding['part_number'] . ' videoId=' . $encoding['video_id'] . ' originalFileName=' . $encoding['original_file_name'] . ' codecId=' . $codecId);
            /*exec('"' . dirname(__FILE__) . '\php\php.exe" -f "' . dirname(__FILE__) . '\process.php" number=' . $encoding['number'] . ' partNumber=' . $encoding['part_number'] . ' videoId=' . $encoding['video_id'] . ' originalFileName=' . $encoding['original_file_name'] . ' codecId=' . $codecId, $output);
            foreach ($output as $result) {
                echo $result . "\n";
            }*/

            echo "처리 요청 완료 \n";
        }
        usleep(100000); //0.1초
    }

    function execAsync($cmd) {
        pclose(popen("start /B cmd /C \"" . $cmd . "\"", "r"));
    }

?>