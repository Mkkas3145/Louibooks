<?php

    include_once('C:\Users\kcomw\바탕 화면\Processing Server\inetpub\server\wwwroot\default_function.php');

    ini_set('memory_limit', -1);
    $importPath = "C:\Users\kcomw\바탕 화면\Processing Server";

    $originalKey = "XVKEoAXiju6leBcse8uVLx05JJqb5S1vOqD6QavKSupAtWd6rv"; //노출하지 마십시오.

    //부가 설정
    $rebooting = true;
    $isFrontendUpdate = true;

    //서버 정보
    $servers = array(
        "172.30.1.39",  //A01
        "172.30.1.36"   //A02
    );
    $serverName = "Processing";

    //윈도우 비밀번호 설정
    $ipInfo = array(
        "172.30.1.39" => array(
            "Code" => "A01",
            "DefaultAppPool" => "[enc:IISWASOnlyCngProvider:EsZyXS86wx6/HpVU+KW4q4SNcyfYDZGwb1d9M58N9CTef7JAlxuHARIpLtpfr0K30wCDDVO23yUFxpOKFBa2dw3bQii6VcYG6QrcW4OUU3xw+7ikzjiERviiShlklvQn:enc]",
            "Manager" => "[enc:IISWASOnlyCngProvider:Kt5RHSVGP3SftfOdpioZf4SNcyfYDZGwb1d9M58N9CTef7JAlxuHARIpLtpfr0K3y2w5F/ztCI6al7FVS6FLdNmJC/hpRBQUhPz2E5GWFDcv+s6W6nqA/gPclaLb1pI3:enc]",
            "Image" => "[enc:IISWASOnlyCngProvider:EMRSvmss5YTr5yKFDB/KyISNcyfYDZGwb1d9M58N9CTef7JAlxuHARIpLtpfr0K3rMHtILz8E1JbiQVwlbOCoMgUHZEtZ7cCmXHqaZR42iMjuV59vz11K75jMSqAOufJ:enc]",
            "Video" => "[enc:IISWASOnlyCngProvider:M/sRldELwCMROW01AarwAISNcyfYDZGwb1d9M58N9CTef7JAlxuHARIpLtpfr0K3WWyoJP1C+wySbYIPmIXJ6Da8YdSWVkfMRlWug3NJHR3irH38wz1XAIxcVj0m225m:enc]"
        ),
        "172.30.1.36" => array(
            "Code" => "A02",
            "DefaultAppPool" => "[enc:IISWASOnlyCngProvider:UJhdasr4gxgS28GVZNt7Qou1CACkHmytDFfLewR8a/3gK2xldmNMnh6RzDVISwYhg68/lvX5+7WhJ0uzloRjXonHlXkymRWENhhdBghnxoz+4ra+c6DDk6OMxT0F1BzZ:enc]",
            "Manager" => "[enc:IISWASOnlyCngProvider:2cHueAXHaTXvitnh/PvAT4u1CACkHmytDFfLewR8a/3gK2xldmNMnh6RzDVISwYh6KPdvJUNa+ifaVU08ehKBdbjXPcFgo5cjWC22YsmtJGsM8WjhFUywmW/C7dkvUPn:enc]",
            "Image" => "[enc:IISWASOnlyCngProvider:kkFl14kQEjDKRIXZ1R54BIu1CACkHmytDFfLewR8a/3gK2xldmNMnh6RzDVISwYhbf5frQunCEuw5cU9kmxEV8EIrDNo2j343gqziBpVzLh+HW8t+YzpBPmvo/jdGQzM:enc]",
            "Video" => "[enc:IISWASOnlyCngProvider:g30txL0Bph3/C4L9KoKxJ4u1CACkHmytDFfLewR8a/3gK2xldmNMnh6RzDVISwYhAbGpHZmlP36rQRKlv9Rh86Acu7xQy3zm10SFDZXZlWXzzz6+Gj877prlbYCLn35k:enc]"
        )
    );

    $totalStart = microtime(true);

    echo "파일 불러오는 중...\n";
    $start = microtime(true);
    $info = array();
    $applicationHost = array();
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($importPath));
    foreach($iterator as $file) {
        if ($file->isFile()) {
            $path = $file->getPathname();
            $contents = file_get_contents($path);

            //각자의 윈도우 비밀번호로 변경 및 각자의 서버 이름으로 변경
            if (strpos($path, "applicationHost.config")) {
                $servers_length = count($servers);
                for ($i = 0; $i < $servers_length; $i++) {
                    $configContents = str_replace("%{windowsPassword:DefaultAppPool}%", $ipInfo[$servers[$i]]["DefaultAppPool"], $contents);
                    $configContents = str_replace("%{windowsPassword:Manager}%", $ipInfo[$servers[$i]]["Manager"], $configContents);
                    $configContents = str_replace("%{windowsPassword:Image}%", $ipInfo[$servers[$i]]["Image"], $configContents);
                    $configContents = str_replace("%{windowsPassword:Video}%", $ipInfo[$servers[$i]]["Video"], $configContents);
                    $configContents = str_replace("%{serverName}%", ($serverName . "/" . $ipInfo[$servers[$i]]["Code"]), $configContents);
                    $applicationHost[$servers[$i]] = base64_encode($configContents);
                }
            } 
            
            $contents = file_get_contents($path);
            $info[] = array(
                "path" => str_replace(($importPath . "\\"), "", $path),
                "contents" => base64_encode($contents)
            );
        }
    }
    $end = microtime(true);
    echo ("파일 불러오기 완료 [" . number_format($end - $start, 2) . "초]\n");

    //업데이트 요청하기
    $servers_length = count($servers);
    for ($i = 0; $i < $servers_length; $i++) {
        $serverIp = $servers[$i];

        //각자의 윈도우 비밀번호로 변경 및 각자의 서버 이름으로 변경
        $fileInfo = $info;
        $fileInfo_length = count($fileInfo);
        for ($j = 0; $j < $fileInfo_length; $j++) {
            $path = $fileInfo[$j]["path"];
            if (strpos($path, "applicationHost.config")){
                $fileInfo[$j]["contents"] = $applicationHost[$serverIp];
            }
        }

        //원격 파일 업로드
        $start = microtime(true);
        remoteFileUpload($serverIp, $fileInfo, $rebooting);
        $end = microtime(true);

        echo ($serverIp . " 업데이트 완료 (" . ($i + 1) . "/" . number_format($servers_length) . ") [" . number_format($end - $start, 2) . "초]\n");
    }

    //사이트 버전 올리기
    if ($isFrontendUpdate == true) {
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

        $sql = $pdo->prepare('UPDATE website SET version = version + 1');
        $sql->execute();
    }

    $totalEnd = microtime(true);
    echo ("모두 업데이트됨 [" . number_format($totalEnd - $totalStart, 2) . "초]\n");

    //5분간 대기
    sleep(300);

?>