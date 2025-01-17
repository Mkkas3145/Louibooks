<?php

    require './php/vendor/autoload.php';

    //최대 처리 시간
    $timeout = 2592000;
    
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

    $ffmpegPath = dirname(__FILE__) . "\\ffmpeg\bin\\ffmpeg.exe";
    $ffprobePath = dirname(__FILE__) . "\\ffmpeg\bin\\ffprobe.exe";
    $encodingPath = dirname(__FILE__) . '\encoding';
    $tempPath = dirname(__FILE__) . '\temp';

    $ffmpeg = FFMpeg\FFMpeg::create(array(
        'ffmpeg.binaries'  => $ffmpegPath,
        'ffprobe.binaries' => $ffprobePath,
        'timeout'          => $timeout,
        'temporary_directory' => $tempPath
    ));

    //처리를 위한 데이터
    $number = $data["number"];
    $partNumber = $data["partNumber"];
    $videoId = $data["videoId"];
    $originalFileName = $data["originalFileName"];
    $codecId = $data["codecId"];

    $fileContents = file_get_contents("http://" . $dbHost . ":3002/video/" . $videoId . '/' . $originalFileName);

    //임시 파일 저장
    $tempFilePath = $tempPath . ("\\" . $originalFileName);
    file_put_contents($tempFilePath, $fileContents);

    try {
        $videoExt = "mp4";
        if ($codecId == "vp09" || $codecId == "av01") {
            $videoExt = "webm";
        }

        //동영상 정보
        $videoInfo = getVideoInfo($tempFilePath);
        $videoResolutions = array_reverse(getVideoResolutions($videoInfo["width"], $videoInfo["height"]));

        $width = (int) $videoInfo["width"];
        $height = (int) $videoInfo["height"];
        $maxFramerate = 60;
        $framerate = round($videoInfo["framerate"]);
        ($framerate > $maxFramerate) ? $framerate = $maxFramerate : null;

        //미리보기 동영상 URL
        $previewFilePath = "https://video.louibooks.com/video/" . $videoId . '/' . $codecId . '/preview.' . $videoExt;
        $previewMaxSize = 240;

        //동영상의 길이가 900초에 가까울 수록 프레임이 1로 설정됨
        $previewFramerate = (900 / $videoInfo["duration"]);
        ($previewFramerate > $framerate) ? $previewFramerate = $framerate : null;

        //미리보기 동영상 사이즈 구하기
        $previewWidth = null;
        $previewHeight = null;
        if ($width > $height) {
            $remove = 1;
            if ($height > $previewMaxSize) {
                $remove = $previewMaxSize / $height;
            }
            $previewWidth = floor($width * $remove);
            $previewHeight = floor($height * $remove);
        } else {
            $remove = 1;
            if ($width > $previewMaxSize) {
                $remove = $previewMaxSize / $width;
            }
            $previewWidth = floor($width * $remove);
            $previewHeight = floor($height * $remove);
        }
        //미리보기 프레임이 원본 프레임보다 높다면
        if ($previewFramerate > $framerate) {
            $previewFramerate = $framerate;
        }

        //JSON 정보
        $jsonData = getData();

        //미리 정의된 데이터
        $startDate = date("Y-m-d H:i:s");
        $preview = array(
            "status" => 2, //대기 중
            'width' => $previewWidth,
            'height' => $previewHeight,
            'url' => $previewFilePath
        );
        $resolutions = array();

        $data = array();
        if ($jsonData != null) {
            if (isset($jsonData["codecs"])) {
                $data = $jsonData["codecs"];
            }
            //코덱 중복 여부
            $newData = array();
            $codecs_length = count($data);
            for ($i = 0; $i < $codecs_length; $i++) {
                if ($data[$i]["codecId"] != $codecId) {
                    $newData[] = $data[$i];
                } else {
                    $startDate = $data[$i]["startDate"];
                    $preview = $data[$i]["preview"];
                    if ($preview["status"] != 0) {
                        $preview["status"] = 2;
                        unset($preview["progress"]);
                        unset($preview["startDate"]);
                    }
                    $resolutions = $data[$i]["resolutions"];
                }
            }
            $data = $newData;
        }
        $data[] = array(
            'status' => 1, //처리 중
            "startDate" => $startDate,
            'codecId' => $codecId,
            'resolutions' => $resolutions,
            'preview' => $preview
        );
        $resultData = array(
            'videoId' => $videoId,
            'codecs' => $data
        );
        $data = $data[count($data) - 1];

        //해상도 정보
        if (empty($resolutions)) {
            foreach ($videoResolutions as $key => $value) {
                if ($value["support"] == true) {
                    $resolution = str_replace("px", "", $key);
                    $resolution = (int) $resolution;
                    $filePath = "https://video.louibooks.com/video/" . $videoId . '/' . $codecId . '/' . $resolution . '.' . $videoExt;
    
                    $width = $videoInfo["width"];
                    $height = $videoInfo["height"];
                    if ($width > $height) {
                        $remove = 1;
                        if ($height > $resolution) {
                            $remove = $resolution / $height;
                        }
                        $newWidth = floor($width * $remove);
                        $newHeight = floor($height * $remove);
                    } else {
                        $remove = 1;
                        if ($width > $resolution) {
                            $remove = $resolution / $width;
                        }
                        $newWidth = floor($width * $remove);
                        $newHeight = floor($height * $remove);
                    }
    
                    $data["resolutions"][] = array(
                        "status" => 2, //대기 중
                        "resolution" => $resolution,
                        "width" => $newWidth,
                        "height" => $newHeight,
                        "url" => $filePath,
                    );
                }
            }
        } else {
            $length = count($data["resolutions"]);
            for ($i = 0; $i < $length; $i++) { 
                if ($data["resolutions"][$i]["status"] != 0) {
                    $data["resolutions"][$i]["status"] = 2;
                    unset($data["resolutions"][$i]["progress"]);
                    unset($data["resolutions"][$i]["startDate"]);
                }
            }
        }

        $codecs = $resultData["codecs"];
        $codecs_length = count($codecs);
        for ($i = 0; $i < $codecs_length; $i++) {
            if ($codecs[$i]["codecId"] == $codecId) {
                $codecs[$i] = $data;
            }
        }
        $resultData["codecs"] = $codecs;

        //JSON 정보 갱신
        setData($resultData);





        /* 인코딩 진행 */





        //미리보기
        if ($data["preview"]["status"] != 0) {
            $encodingFilePath = $encodingPath . ("\\" . $videoId . '_preview.' . $videoExt);
            $makeInfo = array(
                "type" => "preview",
                "tempFilePath" => $tempFilePath,
                "encodingFilePath" => $encodingFilePath,
                "previewMaxSize" => $previewMaxSize,
                "previewFramerate" => $previewFramerate,
                "codecId" => $codecId,
                "videoId" => $videoId,
                "videoExt" => $videoExt,
                "partNumber" => $partNumber
            );
            execAsync('"' . dirname(__FILE__) . '\php\php.exe" -f "' . dirname(__FILE__) . '\encoding.php" makeInfo=' . base64_encode(json_encode($makeInfo)));
            /*exec('"' . dirname(__FILE__) . '\php\php.exe" -f "' . dirname(__FILE__) . '\encoding.php" makeInfo=' . base64_encode(json_encode($makeInfo)), $output);
            foreach ($output as $result) {
                echo $result . "\n";
            }
            exit;*/
        }

        //각각의 해상도로 처리 시작
        foreach ($videoResolutions as $key => $value) {
            if ($value["support"] == true) {
                $resolution = str_replace("px", "", $key);
                $resolution = (int) $resolution;

                //이미 처리된 건지
                $isAlready = false;
                $length = count($data["resolutions"]);
                for ($i = 0; $i < $length; $i++) { 
                    if ($data["resolutions"][$i]["resolution"] == $resolution) {
                        if ($data["resolutions"][$i]["status"] == 0) {
                            $isAlready = true;
                        }
                        break;
                    }
                }
                if ($isAlready == true) {
                    continue;
                }

                $encodingFilePath = $encodingPath . ("\\" . $videoId . '_' . $resolution . 'p.' . $videoExt);
                $makeInfo = array(
                    "type" => "resolution",
                    "tempFilePath" => $tempFilePath,
                    "encodingFilePath" => $encodingFilePath,
                    "resolution" => $resolution,
                    "maxFramerate" => $maxFramerate,
                    "codecId" => $codecId,
                    "videoId" => $videoId,
                    "videoExt" => $videoExt,
                    "partNumber" => $partNumber
                );
                execAsync('"' . dirname(__FILE__) . '\php\php.exe" -f "' . dirname(__FILE__) . '\encoding.php" makeInfo=' . base64_encode(json_encode($makeInfo)));
                /*exec('"' . dirname(__FILE__) . '\php\php.exe" -f "' . dirname(__FILE__) . '\encoding.php" makeInfo=' . base64_encode(json_encode($makeInfo)), $output);
                foreach ($output as $result) {
                    echo $result . "\n";
                }
                exit;*/
            }
        }





        /* 처리 완료 */





        while (true) {
            $isProcessingPreview = true;
            $isProcessingResolutions = true;

            $resultData = getData();
            $codecs = $resultData["codecs"];
            $codecs_length = count($codecs);
            for ($i = 0; $i < $codecs_length; $i++) {
                if ($codecs[$i]["codecId"] == $makeInfo["codecId"]) {
                    if ($codecs[$i]["preview"]["status"] != 0) {
                        $isProcessingPreview = false;
                    }
                    $resolutions = $codecs[$i]["resolutions"];
                    $resolutions_length = count($resolutions);
                    for ($j = 0; $j < $resolutions_length; $j++) {
                        if ($resolutions[$j]["status"] != 0) {
                            $isProcessingResolutions = false;
                        }
                    }
                    break;
                }
            }

            if ($isProcessingPreview == true && $isProcessingResolutions == true) {
                //상태를 처리 완료로 변경
                $codecs = $resultData["codecs"];
                $codecs_length = count($codecs);
                for ($i = 0; $i < $codecs_length; $i++) {
                    if ($codecs[$i]["codecId"] == $makeInfo["codecId"]) {
                        $codecs[$i]["status"] = 0;
                        $completionDate = date("Y-m-d H:i:s");
                        $codecs[$i]["completionDate"] = $completionDate;
                        $codecs[$i]["timeTaken"] = getTimeDifference($startDate, $completionDate);
                        unset($codecs[$i]["startDate"]);
                        break;
                    }
                }
                $resultData["codecs"] = $codecs;
                setData($resultData);
                //처리 완료
                $sql = $pdo->prepare('UPDATE video_encoding SET ' . $codecId . ' = 0, processing_ip = NULL WHERE number = :number');
                $sql->execute(array(
                    ":number" => $number
                ));
                break;
            }

            usleep(100000); //0.1초
        }
    } catch (\Throwable $th) {
        //
    }

    //임시 파일 삭제
    @unlink($tempFilePath);
    @unlink($tempPath . ("\\data_" . $partNumber . ".json"));































































































    function getData() {
        global $pdo, $tempPath, $partNumber;

        $apcuData = apcu_fetch('data_' . $partNumber);
        if ($apcuData != null) {
            return json_decode($apcuData, true);
        }

        $stmt = $pdo->prepare("SELECT data FROM work_part WHERE number = :number");
        $stmt->execute(array(
            ':number' => $partNumber
        ));
        $workPart = $stmt->fetch();

        if (isset($workPart["data"]) && $workPart["data"] != null) {
            return json_decode($workPart["data"], true);
        }
        return null;
    }

    function setData($data) {
        global $pdo, $tempPath, $partNumber;
        $json = json_encode($data);

        //임시 JSON 정보 갱신
        apcu_store('data_' . $partNumber, $json);

        //데이터베이스 갱신
        $sql = $pdo->prepare('UPDATE work_part SET data = :data WHERE number = :number');
        $sql->execute(array(
            ':number' => $partNumber,
            ':data' => $json
        ));
    }





























    function getVideoInfo($src) {
        global $ffmpegPath, $ffprobePath;

        $ffprobe = FFMpeg\FFProbe::create(array(
            'ffmpeg.binaries'  => $ffmpegPath,
            'ffprobe.binaries' => $ffprobePath
        ));
        //비디오 정보
        $videoInfo = $ffprobe
            ->streams($src)
            ->videos()
            ->first();

        //동영상 해상도
        $width = $videoInfo->getDimensions()->getWidth();
        $height = $videoInfo->getDimensions()->getHeight();

        //동영상 길이
        $duration = $videoInfo->get('duration');
        //- webm 형식일 경우
        $tags = (array) $videoInfo->get('tags');
        if (isset($tags) && isset($tags["DURATION"])) {
            $duration = timeToSeconds($tags["DURATION"]);
        }

        //프레임
        $framerate = $videoInfo->get('avg_frame_rate');
        $splitFramerate = explode("/", $framerate);
        $framerate = ((int) $splitFramerate[0] / (int) $splitFramerate[1]);
        
        return array(
            "width" => $width,
            "height" => $height,
            "duration" => (float) $duration,
            "framerate" => (float) $framerate
        );
    }
    function timeToSeconds($time) {
        $timeArr = explode(':', $time);
        $decTime = ($timeArr[0] * 60 * 60) + ($timeArr[1] * 60) + ($timeArr[2]);
      
        return $decTime;
    }

    //동영상 어느 품질까지 생성할 수 있는지
    function getVideoResolutions($width, $height) {
        $dimensions = array(
            "width" => $width,
            "height" => $height
        );

        return $resolutions = [
            '8640px' => ['support' => ($dimensions['height'] >= 8640) ? true : false,
                        'width' => 15360,
                        'height' => 8640
                    ],
            '4320px' => ['support' => ($dimensions['height'] >= 4320) ? true : false,
                        'width' => 7680,
                        'height' => 4320
                    ],
            '2160px' => ['support' => ($dimensions['height'] >= 2160) ? true : false,
                      'width' => 3840,
                      'height' => 2160
                    ],
            '1440px'=> ['support' => ($dimensions['height'] >= 1440) ? true : false,
                      'width' => 2560,
                      'height' => 1440
                    ],
            '1080px'=> ['support' => ($dimensions['height'] >= 1080) ? true : false,
                      'width' => 1920,
                      'height' => 1080
                    ],
            '720px'=> ['support' => ($dimensions['height'] >= 720) ? true : false,
                      'width' => 1280,
                      'height' => 720
                    ],
            '480px'=> ['support' => ($dimensions['height'] >= 480) ? true : false,
                      'width' => 854,
                      'height' => 480
                    ],
            '360px'=> ['support' => ($dimensions['height'] >= 360) ? true : false,
                      'width' => 640,
                      'height' => 360
                    ],
            '240px'=> ['support' => ($dimensions['height'] >= 240),
                      'width' => 426,
                      'height' => 240
                  ],
            '144px'=> ['support' => true,
                      'width' => 256,
                      'height' => 144
                  ]
          ];
    }

    //시간 차이 (초)
    function getTimeDifference($date1, $date2) {
        $time1 = new DateTime($date1);
        $time2 = new DateTime($date2);
        return $time2->getTimestamp() - $time1->getTimestamp();
    }

    function execAsync($cmd) {
        pclose(popen("start /B cmd /C \"" . $cmd . "\"", "r"));
    }

?>