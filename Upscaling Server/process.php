<?php

    //오류 메세지 출력 안함
    error_reporting(0);
    //최대 한달 동안 처리
    ini_set('max_execution_time', $timeout);
    //메모리 제한 없애기
    ini_set('memory_limit', -1);

    $data = array();
    foreach ($argv as $arg) {
        $parts = explode("=", $arg, 2);
        if (count($parts) == 2) {
            $key = $parts[0];
            $value = $parts[1];
            $data[$key] = $value;
        }
    }

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

    $originalKey = "XVKEoAXiju6leBcse8uVLx05JJqb5S1vOqD6QavKSupAtWd6rv"; //노출하지 마십시오.

    $RealEsrganPath = dirname(__FILE__) . "\Real-ESRGAN\\realesrgan.exe";
    $upscalingPath = dirname(__FILE__) . '\upscaling';
    $tempPath = dirname(__FILE__) . '\temp';
    $ext = ".webp";
    $serverDomain = "img.louibooks.com";
    $sizeList = array(256, 480, 640, 960, 1280, 1920, 2560, 3840, 5120, 7680);

    //처리를 위한 데이터
    $number = $data['number'];
    $imageId = $data['imageId'];
    $processingSize = $data['processingSize'];

    $fileContents = file_get_contents("http://" . $dbHost . ":3001/image_format/" . $imageId . '/' . $processingSize . $ext);

    //임시 파일 저장
    $tempFilePath = $tempPath . ("\\" . $imageId . $ext);
    file_put_contents($tempFilePath, $fileContents);

    //업스케일링 파일 생성
    try {
        $upscalingFilePath = $upscalingPath . ('\\' . $imageId . $ext);
        system("\"" . $RealEsrganPath . "\" -n realesrgan-x4plus-anime -f webp -i \"" . $tempFilePath . "\" -o \"" . $upscalingFilePath . "\"");

        $isExists = file_exists($upscalingFilePath);
        if ($isExists == true) {
            //이미지 처리
            $originalSize = getimagesize($upscalingFilePath);

            $info = array();
            $uploadList = array();
            for ($i = 0; $i < count($sizeList); $i++) {
                if ($originalSize[0] >= $sizeList[$i] && $processingSize < $sizeList[$i]) {
                    makeThumbnail($upscalingFilePath, $tempFilePath, $sizeList[$i], 10, "width");
                    $imageSize = getimagesize($tempFilePath);
                    $url = ("https://" . $serverDomain . "/image_format/" . $imageId . "/" . $sizeList[$i] . $ext);

                    $info[] = array(
                        "resolution" => $sizeList[$i],
                        'url' => $url,
                        'width' => $imageSize[0],
                        'height' => $imageSize[1],
                        'size' => (filesize($tempFilePath) / 1024),
                    );

                    $uploadList[] = array(
                        "path" => ("inetpub/server/image/image_format/" . $imageId . "/" . $sizeList[$i] . $ext),
                        "contents" => base64_encode(file_get_contents($tempFilePath))
                    );

                    //처리 파일 삭제
                    unlink($tempFilePath);
                }
            }

            //데이터베이스에 업로드
            remoteFileUpload(
                $dbHost,
                $uploadList
            );

            $sql = $pdo->prepare('UPDATE image_format_upscaling SET data = :data, status = 0, processing_size = NULL, processing_ip = NULL WHERE number = :number');
            $sql->execute(array(
                ':number' => $number,
                ':data' => json_encode($info)
            ));
        } else {
            //업스케일링 대기열에서 삭제
            $stmt = $pdo->prepare("DELETE FROM image_format_upscaling WHERE number = :number");
            $stmt->execute(array(
                ':number' => $number
            ));
        }
    } catch (\Throwable $th) {
        //업스케일링 대기열에서 삭제
        $stmt = $pdo->prepare("DELETE FROM image_format_upscaling WHERE number = :number");
        $stmt->execute(array(
            ':number' => $number
        ));
    }

    //임시 파일 삭제
    @unlink($tempFilePath);
    //업스케일링 파일 삭제
    @unlink($upscalingFilePath);
















































    function makeThumbnail($sourcefile, $endfile, $maxSize, $quality, $sizeType = null) {
        $img = null;
        if (getImageType($sourcefile) == "image/png") {
            $img = imagecreatefrompng($sourcefile);
        } else if (getImageType($sourcefile) == "image/jpeg") {
            $img = imagecreatefromjpeg($sourcefile);
        } else if (getImageType($sourcefile) == "image/webp") {
            $img = imagecreatefromwebp($sourcefile);
        } else if (getImageType($sourcefile) == "image/gif") {
            $img = imagecreatefromgif($sourcefile);
        }
        $width = imagesx($img);
        $height = imagesy($img);

        if (isset($sizeType)) {
            if ($sizeType == "width") {
                $newwidth = $maxSize;
                $divisor = $width / $maxSize;
                $newheight = floor($height / $divisor);
            }
        } else {
            if ($width > $height) {
                $remove = 1;
                if ($height > $maxSize) {
                    $remove = $maxSize / $height;
                }
                $newwidth = floor($width * $remove);
                $newheight = floor($height * $remove);
            } else {
                $remove = 1;
                if ($width > $maxSize) {
                    $remove = $maxSize / $width;
                }
                $newwidth = floor($width * $remove);
                $newheight = floor($height * $remove);
            }
        }

        $tmpimg = imagecreatetruecolor($newwidth, $newheight);
        imagecopyresampled($tmpimg, $img, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);

        imagewebp($tmpimg, $endfile, $quality * 10);

        imagedestroy($tmpimg);
        imagedestroy($img);
    }
    function getImageType($file) {
        $fi = new finfo(FILEINFO_MIME_TYPE);
        $mime_type = $fi->file($file);
        return $mime_type;
    }

    /*
        $info 형식:
            [
                {
                    path: (inetpub\wwwroot\test.txt)
                    contents: (base64 인코딩된 파일 콘텐츠)
                },
                { ... },
                { ... }
            ]
    */
    function remoteFileUpload($ip, $info, $rebooting = false) {
        global $originalKey;

        $json = json_encode($info);
        $chunkSize = 2000000000; //2GB

        $length = strlen($json);
        $chunks = [];
        if ($length <= $chunkSize) {
            $chunks[] = $json;
        } else {
            $offset = 0;
            while ($offset < $length) {
                $chunk = substr($json, $offset, $chunkSize);
                $chunks[] = $chunk;
                $offset += $chunkSize;
            }
        }

        //청크 업로드
        $chunkList = array();
        $chunks_length = count($chunks);
        for ($i = 0; $i < $chunks_length; $i++) {
            $chunk = $chunks[$i];

            $url = "http://" . $ip . ":8000/chunk/upload.php";
            $param = array(
                "key" => $originalKey,
                "contents" => new CURLStringFile($chunk, 'text/plain')
            );
            $cu = curl_init();
            curl_setopt($cu, CURLOPT_URL, $url);
            curl_setopt($cu, CURLOPT_POST, true);
            curl_setopt($cu, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($cu, CURLOPT_SSLVERSION, 3);
            curl_setopt($cu, CURLOPT_POSTFIELDS, $param);
            curl_setopt($cu, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($cu, CURLOPT_TIMEOUT, 86400);
            $result = curl_exec($cu);
            curl_close($cu);

            $chunkList[] = $result;
        }
        
        //파일 업로드 마무리
        $url = "http://" . $ip . ":8000/chunk/finishing.php";
        $param = array(
            "key" => $originalKey,
            "chunkList" => json_encode($chunkList),
            "rebooting" => $rebooting
        );
        $cu = curl_init();
        curl_setopt($cu, CURLOPT_URL, $url);
        curl_setopt($cu, CURLOPT_POST, true);
        curl_setopt($cu, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($cu, CURLOPT_SSLVERSION, 3);
        curl_setopt($cu, CURLOPT_POSTFIELDS, http_build_query($param));
        curl_setopt($cu, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($cu, CURLOPT_TIMEOUT, 86400);
        curl_exec($cu);
        curl_close($cu);
    }

?>