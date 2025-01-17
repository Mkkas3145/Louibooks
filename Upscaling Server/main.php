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
    
    $upscalingPath = dirname(__FILE__) . '\upscaling';
    $files = glob($upscalingPath . '/*');
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
    $sql = $pdo->prepare('UPDATE image_format_upscaling SET status = 2, processing_ip = NULL WHERE status = 1 AND processing_ip = :processing_ip');
    $sql->execute(array(
        ":processing_ip" => $serverIp
    ));

    echo "초기화 완료 \n";

    while (true) {
        $stmt = $pdo->prepare("SELECT number, image_id, processing_size FROM image_format_upscaling WHERE status = 2");
        $stmt->execute();
        $upscaling = $stmt->fetch();
        if (isset($upscaling["number"])) {
            echo "처리 요청 중... \n";

            //상태를 처리 중으로 변경
            $sql = $pdo->prepare('UPDATE image_format_upscaling SET status = 1, processing_ip = :processing_ip WHERE number = :number');
            $sql->execute(array(
                ':number' => $upscaling["number"],
                ':processing_ip' => $serverIp
            ));

            //처리 요청
            execAsync('"' . dirname(__FILE__) . '\php\php.exe" -f "' . dirname(__FILE__) . '\process.php" number=' . $upscaling['number'] . ' imageId=' . $upscaling['image_id'] . ' processingSize=' . $upscaling['processing_size']);
            
            echo "처리 요청 완료 \n";
        }
        usleep(100000); //0.1초
    }

    function execAsync($cmd) {
        pclose(popen("start /B cmd /C \"" . $cmd . "\"", "r"));
    }

?>