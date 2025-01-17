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
    $makeInfo = json_decode(base64_decode($data["makeInfo"]), true);

    try {
        if ($makeInfo["type"] == "preview") {
            //상태를 처리 중으로 변경
            $datas = array(
                "status" => 1,
                "progress" => 0,
                "startDate" => date("Y-m-d H:i:s")
            );
            setPreviewData($datas);

            //동영상 인코딩
            $encodingStartDate = date("Y-m-d H:i:s");
            $property = array(
                "type" => "preview"
            );
            makeVideo($makeInfo["tempFilePath"], $makeInfo["encodingFilePath"], $makeInfo["previewMaxSize"], null, true, $makeInfo["previewFramerate"], 0.7, $makeInfo["codecId"], $property, true, false);

            //처리 완료 후 동영상 정보 불러오기
            $videoInfo = getVideoInfo($makeInfo["encodingFilePath"]);
            $detailVideoInfo = getDetailVideoInfo();
            $datas = array(
                "status" => 0,
                "progress" => null,
                "startDate" => null,
                "size" => (filesize($makeInfo["encodingFilePath"]) / 1024),
                "duration" => $videoInfo["duration"],
                "framerate" => $videoInfo["framerate"],
                "pixelFormat" => $videoInfo["pixelFormat"],
                "bitDepth" => $videoInfo["bitDepth"],
                "qualityMetrics" => $detailVideoInfo["qualityMetrics"]
            );
            if ($videoInfo["videoBitrate"] != null) {
                $datas["bitrate"] = $videoInfo["videoBitrate"];
            }
            if ($videoInfo["colorRange"] != null) {
                $datas["colorRange"] = $videoInfo["colorRange"];
            }
            if ($videoInfo["colorSpace"] != null) {
                $datas["colorSpace"] = $videoInfo["colorSpace"];
            }
            if ($videoInfo["colorPrimaries"] != null) {
                $datas["colorPrimaries"] = $videoInfo["colorPrimaries"];
            }
            if ($videoInfo["colorTransfer"] != null) {
                $datas["colorTransfer"] = $videoInfo["colorTransfer"];
            }
            //인코딩 프로그램
            if ($videoInfo["encoder"] != null) {
                $datas["encoder"] = $videoInfo["encoder"];
            }
            //인코딩 완료 날짜
            $completionDate = date("Y-m-d H:i:s");
            $datas["completionDate"] = $completionDate;
            //소요 시간
            $datas["timeTaken"] = getTimeDifference($encodingStartDate, $completionDate);

            //데이터베이스에 업로드
            $uploadList = array();
            $uploadList[] = array(
                "path" => ("inetpub/server/video/video/" . $makeInfo["videoId"] . "/" . $makeInfo["codecId"] . '/preview.' . $makeInfo["videoExt"]),
                "contents" => base64_encode(file_get_contents($makeInfo["encodingFilePath"]))
            );
            remoteFileUpload(
                $dbHost,
                $uploadList
            );
            //인코딩 파일 삭제
            @unlink($makeInfo["encodingFilePath"]);

            //JSON 정보 갱신
            setPreviewData($datas);
        } else if ($makeInfo["type"] == "resolution") {
            //상태를 처리 중으로 변경
            $datas = array(
                "status" => 1,
                "progress" => 0,
                "startDate" => date("Y-m-d H:i:s")
            );
            setResolutionData($datas);

            //동영상 인코딩
            $encodingStartDate = date("Y-m-d H:i:s");
            $property = array(
                "type" => "resolution"
            );
            makeVideo($makeInfo["tempFilePath"], $makeInfo["encodingFilePath"], $makeInfo["resolution"], null, null, $makeInfo["maxFramerate"], 1, $makeInfo["codecId"], $property);

            //처리 완료 후 동영상 정보 불러오기
            $videoInfo = getVideoInfo($makeInfo["encodingFilePath"]);
            $detailVideoInfo = getDetailVideoInfo();
            $datas = array(
                "status" => 0,
                "progress" => null,
                "startDate" => null,
                "size" => (filesize($makeInfo["encodingFilePath"]) / 1024),
                "duration" => $videoInfo["duration"],
                "framerate" => $videoInfo["framerate"],
                "pixelFormat" => $videoInfo["pixelFormat"],
                "bitDepth" => $videoInfo["bitDepth"],
                "qualityMetrics" => $detailVideoInfo["qualityMetrics"]
            );
            if ($videoInfo["videoBitrate"] != null) {
                $datas["videoBitrate"] = $videoInfo["videoBitrate"];
            }
            if ($videoInfo["audioBitrate"] != null) {
                $datas["audioBitrate"] = $videoInfo["audioBitrate"];
            }
            if ($videoInfo["audioSampleFormat"] != null) {
                $datas["audioSampleFormat"] = $videoInfo["audioSampleFormat"];
            }
            if ($videoInfo["audioSampleRate"] != null) {
                $datas["audioSampleRate"] = $videoInfo["audioSampleRate"];
            }
            if ($videoInfo["audioChannels"] != null) {
                $datas["audioChannels"] = $videoInfo["audioChannels"];
            }
            if ($videoInfo["audioChannelLayout"] != null) {
                $datas["audioChannelLayout"] = $videoInfo["audioChannelLayout"];
            }
            if ($videoInfo["colorRange"] != null) {
                $datas["colorRange"] = $videoInfo["colorRange"];
            }
            if ($videoInfo["colorSpace"] != null) {
                $datas["colorSpace"] = $videoInfo["colorSpace"];
            }
            if ($videoInfo["colorPrimaries"] != null) {
                $datas["colorPrimaries"] = $videoInfo["colorPrimaries"];
            }
            if ($videoInfo["colorTransfer"] != null) {
                $datas["colorTransfer"] = $videoInfo["colorTransfer"];
            }
            //콘텐츠 표준 음량
            if ($detailVideoInfo["contentLoudness"] != null) {
                $datas["contentLoudness"] = $detailVideoInfo["contentLoudness"];
            }
            //인코딩 프로그램
            if ($videoInfo["encoder"] != null) {
                $datas["encoder"] = $videoInfo["encoder"];
            }
            //인코딩 완료 날짜
            $completionDate = date("Y-m-d H:i:s");
            $datas["completionDate"] = $completionDate;
            //소요 시간
            $datas["timeTaken"] = getTimeDifference($encodingStartDate, $completionDate);

            //데이터베이스에 업로드
            $uploadList = array();
            $uploadList[] = array(
                "path" => ("inetpub/server/video/video/" . $makeInfo["videoId"] . "/" . $makeInfo["codecId"] . '/' . $makeInfo["resolution"] . '.' . $makeInfo["videoExt"]),
                "contents" => base64_encode(file_get_contents($makeInfo["encodingFilePath"]))
            );
            remoteFileUpload(
                $dbHost,
                $uploadList
            );
            //인코딩 파일 삭제
            @unlink($makeInfo["encodingFilePath"]);

            //JSON 정보 갱신
            setResolutionData($datas);
        }
    } catch (\Throwable $th) {
        //
    }































































































    function getData() {
        global $pdo, $tempPath, $makeInfo;

        $apcuData = apcu_fetch('data_' . $makeInfo["partNumber"]);
        if ($apcuData != null) {
            return json_decode($apcuData, true);
        }

        $stmt = $pdo->prepare("SELECT data FROM work_part WHERE number = :number");
        $stmt->execute(array(
            ':number' => $makeInfo["partNumber"]
        ));
        $workPart = $stmt->fetch();

        if (isset($workPart["data"]) && $workPart["data"] != null) {
            return json_decode($workPart["data"], true);
        }
        return null;
    }

    function setData($data) {
        global $pdo, $tempPath, $makeInfo;
        $json = json_encode($data);

        //임시 JSON 정보 갱신
        apcu_store('data_' . $makeInfo["partNumber"], $json);

        //데이터베이스 갱신
        $sql = $pdo->prepare('UPDATE work_part SET data = :data WHERE number = :number');
        $sql->execute(array(
            ':number' => $makeInfo["partNumber"],
            ':data' => $json
        ));
    }

    /*
        {
            key: value,
            key: value
        }
    */
    function setPreviewData($datas) {
        global $makeInfo;
        $data = getData();
        $codecs = $data["codecs"];
        $codecs_length = count($codecs);
        for ($i = 0; $i < $codecs_length; $i++) {
            if ($codecs[$i]["codecId"] == $makeInfo["codecId"]) {
                foreach ($datas as $key => $value) {
                    if ($value !== null) {
                        $codecs[$i]["preview"][$key] = $value;
                    } else {
                        unset($codecs[$i]["preview"][$key]);
                    }
                }
                break;
            }
        }
        $data["codecs"] = $codecs;
        setData($data);
    }

    /*
        {
            key: value,
            key: value
        }
    */
    function setResolutionData($datas) {
        global $makeInfo;
        $data = getData();
        $codecs = $data["codecs"];
        $codecs_length = count($codecs);
        for ($i = 0; $i < $codecs_length; $i++) {
            if ($codecs[$i]["codecId"] == $makeInfo["codecId"]) {
                $resolutions = $codecs[$i]["resolutions"];
                $resolutions_length = count($resolutions);
                for ($j = 0; $j < $resolutions_length; $j++) {
                    if ($resolutions[$j]["resolution"] == $makeInfo["resolution"]) {
                        foreach ($datas as $key => $value) {
                            if ($value !== null) {
                                $resolutions[$j][$key] = $value;
                            } else {
                                unset($resolutions[$j][$key]);
                            }
                        }
                        break;
                    }
                }
                $codecs[$i]["resolutions"] = $resolutions;
            }
        }
        $data["codecs"] = $codecs;
        setData($data);
    }

    //시간 차이 (초)
    function getTimeDifference($date1, $date2) {
        $time1 = new DateTime($date1);
        $time2 = new DateTime($date2);
        return $time2->getTimestamp() - $time1->getTimestamp();
    }




























    function makeVideo($sourcefile, $endfile, $maxSize, $sizeType = null, $mute = false, $maxFramerate = 0, $quality = 1, $codec = "avc1", $property = null, $isFastDecode = false, $roundingFrameRate = true) {
        global $ffmpeg, $ffmpegPath, $ffprobePath, $temporaryPath;

        $video = $ffmpeg->open($sourcefile);
        $videoInfo = getVideoInfo($sourcefile);
        $width = $videoInfo["width"];
        $height = $videoInfo["height"];

        //영상의 색상 정보가 없거나 특정 정보가 빠져 있을 경우 색상 정보들을 토대로 부족한 색상 정보를 채움
        $colorSpaceValue = null;
        $colorSpaceValueList = array(
            'bt470bg' => array(
                'space' => 'bt470bg',
                'primaries' => 'bt470bg',
                'transfer' => 'bt470bg',
                'support' => true
            ),
            'bt601' => array(
                'space' => 'bt601',
                'primaries' => 'bt601',
                'transfer' => 'bt601',
                'support' => true
            ),
            'bt709' => array(
                'space' => 'bt709',
                'primaries' => 'bt709',
                'transfer' => 'bt709',
                'support' => true
            ),
            'bt2020' => array(
                'space' => 'bt2020nc',
                'primaries' => 'bt2020',
                'transfer' => 'smpte2084',
                'support' => true
            ),
            'smpte170m' => array(
                'space' => 'smpte170m',
                'primaries' => 'smpte170m',
                'transfer' => 'smpte170m',
                'support' => false
            ),
            'smpte240m' => array(
                'space' => 'smpte240m',
                'primaries' => 'smpte240m',
                'transfer' => 'smpte240m',
                'support' => false
            ),
            'fcc' => array(
                'space' => 'fcc',
                'primaries' => 'smpte170m',
                'transfer' => 'smpte170m',
                'support' => false
            ),
            'smpte431' => array(
                'space' => 'smpte431',
                'primaries' => 'smpte431',
                'transfer' => 'smpte431',
                'support' => false
            ),
            'smpte432' => array(
                'space' => 'smpte432',
                'primaries' => 'smpte432',
                'transfer' => 'smpte432',
                'support' => false
            ),
        );
        if (isset($videoInfo["colorSpace"]) == false || isset($videoInfo["colorPrimaries"]) == false || isset($videoInfo["colorTransfer"]) == false) {
            //영상의 색상 정보들을 토대로 부족한 색상 정보를 채움
            foreach ($colorSpaceValueList as $key => $value) {
                if (isset($videoInfo["colorSpace"]) && $videoInfo["colorSpace"] == $value["space"]) {
                    $colorSpaceValue = $value;
                    break;
                }
                if (isset($videoInfo["colorPrimaries"]) && $videoInfo["colorPrimaries"] == $value["primaries"]) {
                    $colorSpaceValue = $value;
                    break;
                }
                if (isset($videoInfo["colorTransfer"]) && $videoInfo["colorTransfer"] == $value["transfer"]) {
                    $colorSpaceValue = $value;
                    break;
                }
            }
            //동영상의 색상 정보를 파악하지 힘들다면 BT.709로
            ($colorSpaceValue == null) ? $colorSpaceValue = $colorSpaceValueList["bt709"] : null;
            //이미 정보가 있다면
            (isset($videoInfo["colorSpace"])) ? $colorSpaceValue["space"] = $videoInfo["colorSpace"] : null;
            (isset($videoInfo["colorPrimaries"])) ? $colorSpaceValue["primaries"] = $videoInfo["colorPrimaries"] : null;
            (isset($videoInfo["colorTransfer"])) ? $colorSpaceValue["transfer"] = $videoInfo["colorTransfer"] : null;

            $metadataValue = array(
                "space" => array(
                    "identity" => 0,            "bt709" => 1,               "fcc" => 4,                 "bt470bg" => 5,
                    "bt601" => 6,               "smpte240m" => 7,           "bt2020nonconstant" => 8,   "bt2020constant" => 9,
                    "xyz" => 10,                "smpte2085" => 11,          "chroma-derived-nc" => 12
                ),
                "primaries" => array(
                    "bt709" => 1,               "bt470m" => 4,              "bt470bg" => 5,             "smpte170m" => 6,
                    "smpte240m" => 7,           "film" => 8,                "bt2020" => 9,              "smpte428" => 10,
                    "smpte431" => 11,           "smpte432" => 12
                ),
                "transfer" => array(
                    "bt709" => 1,               "bt601" => 6,               "smpte2084" => 14,          "bt2020_10bit" => 15,
                    "smpte428" => 16,           "arib_b67" => 16,           "bt2100_pq" => 16,          "bt2020_12bit" => 17,
                    "bt2100_hlg" => 18
                )
            );
            $metadataProperty = "h264_metadata";
            $codecId = $videoInfo["codecId"];
            if ($codecId == "hev1" || $codecId == "hvc1") {
                $metadataProperty = "hevc_metadata";
            } else if ($codecId == "vp08" || $codecId == "vvp8") {
                $metadataProperty = "vp8_metadata";
            } else if ($codecId == "vp09" || $codecId == "vvp9") {
                $metadataProperty = "vp9_metadata";
            } else if ($codecId == "av01") {
                $metadataProperty = "av1_metadata";
            } else if ($codecId == "mp2v") {
                $metadataProperty = "mp2v_metadata";
            } else if ($codecId == "mp4v") {
                $metadataProperty = "mp4v_metadata";
            } else if ($codecId == "ffv1") {
                $metadataProperty = "ffv1_metadata";
            } else if ($codecId == "avid") {
                $metadataProperty = "avid_metadata";
            } else if ($codecId == "avdn") {
                $metadataProperty = "avdn_metadata";
            } else if ($codecId == "apro" || $codecId == "apcs" || $codecId == "apco" || $codecId == "ap4h" || $codecId == "apcn" || $codecId == "ap4x") {
                $metadataProperty = "prores_metadata";
            } else if ($codecId == "cfhd") {
                $metadataProperty = "cfhd_metadata";
            }

            $inputPath = $sourcefile;
            $outPath = str_replace(".", "_new.", $sourcefile);

            //색상 정보 설정
            $cmd = '"' . $ffmpegPath . '" -i "' . $inputPath . '" -xerror -map_metadata -1 -strict experimental -vcodec copy -acodec copy -colorspace ' . $colorSpaceValue["space"] . ' -color_primaries ' . $colorSpaceValue["primaries"] . ' -color_trc ' . $colorSpaceValue["transfer"] . ' -bsf:v ' . $metadataProperty . '=colour_primaries=' . $metadataValue["primaries"][$colorSpaceValue["primaries"]] . ':transfer_characteristics=' . $metadataValue["transfer"][$colorSpaceValue["transfer"]] . ':matrix_coefficients=' . $metadataValue["space"][$colorSpaceValue["space"]] . ' -y "' . $outPath . '"';
            exec($cmd, $output, $return);

            //실행 결과가 성공일 경우
            if ($return == 0) {
                unlink($inputPath);
                rename($outPath, $inputPath);
                $videoInfo = getVideoInfo($sourcefile);
            } else {
                unlink($outPath);
            }
        }

        if (isset($sizeType)) {
            if ($sizeType == "width") {
                $newwidth = $maxSize;
                $divisor = $width / $maxSize;
                $newheight = floor($height / $divisor);
            }
            if ($sizeType == "height") {
                $newheight = $maxSize;
                $divisor = $height / $maxSize;
                $newwidth = floor($width / $divisor);
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

        //width, height를 2로 나눌 수 없음 방지
        if (floor($newwidth / 2) != $newwidth / 2) {
            $newwidth --;
        }
        if (floor($newheight / 2) != $newheight / 2) {
            $newheight --;
        }

        //동영상 저장
        $framerate = $videoInfo["framerate"];
        //최대 프레임
        if ($maxFramerate != 0) {
            ($framerate > $maxFramerate) ? $framerate = $maxFramerate : null;
        }
        //최대 비트레이트 구하기
        $maxBitrate = ($newwidth * $newheight * $framerate) / 1000;
        //반올림
        ($roundingFrameRate == true) ? $framerate = round($framerate) : null;

        $pixelFormat = $videoInfo["pixelFormat"];
        $bitDepth = $videoInfo["bitDepth"];
        $videoResolutions = getVideoResolutions($newwidth, $newheight);
        $resolution = null;
        foreach ($videoResolutions as $key => $value) {
            $isSupport = $value["support"];
            if ($isSupport == true) {
                $resolution = str_replace("px", "", $key);
                $resolution = (int) $resolution;
                break;
            }
        }
        $maxBitDepth = array(
            144 => 8,
            240 => 8,
            360 => 8,
            480 => 8,
            720 => 10,
            1080 => 10,
            1440 => 10,
            2160 => 12,
            4320 => 12,
            8640 => 14
        );
        $minBitDepth = 8;
        //H264 에서만 비트 뎁스가 부족하면 영상 깨짐
        /*if ($codec == "avc1") {
            if ($resolution >= 8640) {
                //16K
                $minBitDepth = 14;
            } else if ($resolution >= 4320) {
                //8K
                $minBitDepth = 12;
            } else if ($resolution >= 2160) {
                //4K
                $minBitDepth = 10;
            }
        }*/
        ($bitDepth < $minBitDepth) ? $bitDepth = $minBitDepth : null;
        ($bitDepth > $maxBitDepth[$resolution]) ? $bitDepth = $maxBitDepth[$resolution] : null;

        $maxChromaSubSampling = array(
            144 => 420,
            240 => 420,
            360 => 420,
            480 => 420,
            720 => 422,
            1080 => 422,
            1440 => 422,
            2160 => 444,
            4320 => 444,
            8640 => 444
        );
        $chromaSubSampling = 420;
        if (strpos($pixelFormat, "411") !== false) {
            $chromaSubSampling = 420; //YUV411P 지원 안함
        } else if (strpos($pixelFormat, "420") !== false) {
            //기본 값
        } else if (strpos($pixelFormat, "422") !== false) {
            $chromaSubSampling = 422;
        } else if (strpos($pixelFormat, "444") !== false) {
            $chromaSubSampling = 444;
        }
        ($chromaSubSampling > $maxChromaSubSampling[$resolution]) ? $chromaSubSampling = $maxChromaSubSampling[$resolution] : null;
        $pixelFormat = ("yuv" . $chromaSubSampling . "p");
        if ($bitDepth > 8) {
            $pixelFormat .= ($bitDepth . "le");
        }

        //색 공간 및 색 조합
        $colorSpace = "bt709"; //기본 값
        $videoColorSpace = null;
        if (isset($videoInfo["colorSpace"])) {
            $videoColorSpace = $videoInfo["colorSpace"];
        } else {
            ($colorSpaceValue != null) ? $videoColorSpace = $colorSpaceValue["space"] : null;
        }
        ($videoColorSpace == "bt2020nc") ? $colorSpace = "bt2020" : null;

        //오디오 샘플레이트
        $sampleRate = null;
        if (isset($videoInfo["audioSampleRate"])) {
            $supportSampleRateList = null;
            if ($codec == "avc1") {
                $supportSampleRateList = array(
                    96000, 88200, 64000, 48000,
                    44100, 32000, 24000, 22050,
                    16000, 12000, 11025, 8000,
                    7350
                );
            } else if ($codec == "vp09" || $codec == "av01") {
                $supportSampleRateList = array(
                    48000, 24000, 16000, 12000,
                    8000
                );
            }
            $targetSampleRate = $videoInfo["audioSampleRate"];
            $closestSampleRate = null;
            $minDifference = PHP_INT_MAX;
            foreach ($supportSampleRateList as $sampleRate) {
                $difference = abs($targetSampleRate - $sampleRate);
                if ($difference < $minDifference) {
                    $minDifference = $difference;
                    $closestSampleRate = $sampleRate;
                }
            }
            $sampleRate = $closestSampleRate;
        }

        $format = new FFMpeg\Format\Video\X264();
        $format->setKiloBitrate(0);

        $minQuality = 0;
        $maxQuality = 0;
        if ($codec == "avc1") {
            $minQuality = 51;
            $maxQuality = 22;
        }
        if ($codec == "vp09") {
            $minQuality = 63;
            $maxQuality = 32;
        }
        if ($codec == "av01") {
            $minQuality = 63;
            $maxQuality = 36;
        }
        $crfValue = $maxQuality + (($minQuality - $maxQuality) - (($minQuality - $maxQuality) * $quality));
        $crfValue = round($crfValue);

        $minSubme = 0;
        $maxSubme = 10;
        $submeValue = $maxSubme + (($minSubme - $maxSubme) - (($minSubme - $maxSubme) * $quality));
        $submeValue = round($submeValue);

        $minMeRange = 8;
        $maxMeRange = 32;
        $meRangeValue = $maxMeRange + (($minMeRange - $maxMeRange) - (($minMeRange - $maxMeRange) * $quality));
        $meRangeValue = round($meRangeValue);

        $parameters = array();
        if ($mute == true) {
            //오디오 없애기
            $parameters[] = '-an';
        }
        //코덱
        if ($codec == "avc1") {
            $parameters[] = '-c:v';             $parameters[] = 'libx264';
            $parameters[] = '-c:a';             $parameters[] = 'aac';
            $parameters[] = '-x264opts';        $parameters[] = 'fast_pskip=0';
            $parameters[] = '-x264-params';     $parameters[] = 'recursive=1';
            $parameters[] = '-profile:v';       $parameters[] = 'high';
            $parameters[] = '-rc-lookahead';    $parameters[] = 0;
            $parameters[] = '-flags';           $parameters[] = 'cgop+qpel+bitexact';
        }
        if ($codec == "vp09") {
            $parameters[] = '-c:v';             $parameters[] = 'libvpx-vp9';
            $parameters[] = '-c:a';             $parameters[] = 'libopus';
            $parameters[] = '-deadline';        $parameters[] = 'best';
            $parameters[] = '-cpu-used';        $parameters[] = 0;
            $parameters[] = '-speed';           $parameters[] = 0;
            $parameters[] = '-lag-in-frames';   $parameters[] = 0;
            $parameters[] = '-flags';           $parameters[] = 'cgop+qpel+bitexact';
            //병렬 처리 관련
            $parameters[] = '-tile-columns';    $parameters[] = 6;
            $parameters[] = '-tile-rows';       $parameters[] = 2;
        }
        if ($codec == "av01") {
            $parameters[] = '-c:v';             $parameters[] = 'libaom-av1';
            $parameters[] = '-c:a';             $parameters[] = 'libopus';
            $parameters[] = '-deadline';        $parameters[] = 'best';
            $parameters[] = '-cpu-used';        $parameters[] = 0;
            $parameters[] = '-speed';           $parameters[] = 0;
            $parameters[] = '-lag-in-frames';   $parameters[] = 0;
            //병렬 처리 관련
            $parameters[] = '-tile-columns';    $parameters[] = 3;
            $parameters[] = '-tile-rows';       $parameters[] = 2;
            $parameters[] = '-row-mt';          $parameters[] = 1;
        }
        $parameters[] = '-sn';
        $parameters[] = '-ignore_unknown';
        $parameters[] = '-hide_banner';
        $parameters[] = '-movflags';            $parameters[] = 'faststart';
        $parameters[] = '-map_metadata';        $parameters[] = -1;
        $parameters[] = '-strict';              $parameters[] = 'experimental';
        $parameters[] = '-threads';             $parameters[] = 0;
        $parameters[] = '-thread_type';         $parameters[] = 'slice+frame';
        $parameters[] = '-b:v';                 $parameters[] = 0;
        $parameters[] = '-crf';                 $parameters[] = $crfValue;
        /*$parameters[] = '-rc:v';              $parameters[] = 'vbr';
        $parameters[] = '-cq:v';                $parameters[] = 0;*/
        $parameters[] = '-coder';               $parameters[] = 'ac';
        $parameters[] = '-trellis';             $parameters[] = 7;
        $parameters[] = '-preset';              $parameters[] = 'placebo';
        if ($isFastDecode == true && $codec == "avc1") {
            $parameters[] = '-tune';            $parameters[] = 'fastdecode';
        }
        $parameters[] = '-me_method';           $parameters[] = 'tesa';
        $parameters[] = '-me_range';            $parameters[] = $meRangeValue;
        $parameters[] = '-subq';                $parameters[] = $submeValue;
        $parameters[] = '-partitions';          $parameters[] = 'all';
        $parameters[] = '-mbd';                 $parameters[] = 1;
        $parameters[] = '-subcmp';              $parameters[] = 'chroma';
        $parameters[] = '-fps_mode';            $parameters[] = 'cfr'; //비디오 동기화 방법
        $parameters[] = '-psy';                 $parameters[] = 1;
        $parameters[] = '-psy-rd';              $parameters[] = 4;
        $parameters[] = '-rc-lookahead';        $parameters[] = 90;
        $parameters[] = '-aq-mode';             $parameters[] = 3;
        $parameters[] = '-b-pyramid';           $parameters[] = 'strict';
        $parameters[] = '-auto-alt-ref';        $parameters[] = 1;
        $parameters[] = '-sharpness';           $parameters[] = 7;
        $parameters[] = '-deblock';             $parameters[] = "0:0";
        if ($isFastDecode == true) {
            //GOP 생성 주기 설정
            $parameters[] = '-g';               $parameters[] = 8;
            //B 프레임 생성 주기 설정
            $parameters[] = '-bf';              $parameters[] = 4;
            //참조 프레임 설정
            $parameters[] = '-refs';            $parameters[] = 2;
        } else {
            $minSeconds = 15;   //최소 GOP 생성
            $maxSeconds = 5;    //최대 GOP 생성
            $gopSeconds = $maxSeconds + (($minSeconds - $maxSeconds) - (($minSeconds - $maxSeconds) * $quality));

            //GOP 생성 주기 설정
            $parameters[] = '-g';               $parameters[] = round($framerate * $gopSeconds);
            //$parameters[] = '-force_key_frames';
            //$parameters[] = 'expr:gte(t, n_forced * ' . $gopSeconds . ')';

            //참조 프레임 설정
            $parameters[] = '-refs';            $parameters[] = 8;

            //B 프레임 설정
            $parameters[] = '-bf';              $parameters[] = 16;
            $parameters[] = '-b-pyramid';       $parameters[] = 1;
            $parameters[] = '-weightb';         $parameters[] = 1;
            $parameters[] = '-wpredp';          $parameters[] = 2;
        }
        //디인터레이스
        if ($videoInfo["fieldOrder"] != "progressive") {
            $parameters[] = '-deinterlace';
        }
        $parameters[] = '-sws_flags';           $parameters[] = 'lanczos+accurate_rnd+full_chroma_int+bitexact';
        $parameters[] = '-sws_dither';          $parameters[] = 'ed';
        $parameters[] = '-dither_method';       $parameters[] = 'high_shibata';
        //색상 정보가 없을 경우
        $isNullColorInfo = false;
        if (isset($videoInfo["colorSpace"]) == false || isset($videoInfo["colorPrimaries"]) == false || isset($videoInfo["colorTransfer"]) == false) {
            $colorSpaceValue = $colorSpaceValueList[$colorSpace];
            
            $parameters[] = '-colorspace';
            $parameters[] = $colorSpaceValue["space"];
            $parameters[] = '-color_primaries';
            $parameters[] = $colorSpaceValue["primaries"];
            $parameters[] = '-color_trc';
            $parameters[] = $colorSpaceValue["transfer"];
            
            $isNullColorInfo = true;
        }
        //오디오 관련
        $parameters[] = '-b:a';                 $parameters[] = 0;
        $parameters[] = '-q:a';                 $parameters[] = 0;
        //오디오 채널 레이아웃 설정
        if (isset($videoInfo["audioChannelLayout"])) {
            $parameters[] = '-channel_layout';
            $parameters[] = $videoInfo["audioChannelLayout"];
        } else {
            $parameters[] = '-channel_layout';
            $parameters[] = 'auto';
        }
        //오디오 샘플레이트 설정
        if ($sampleRate != null) {
            $parameters[] = '-ar';              $parameters[] = $sampleRate;
        }
        $format->setAdditionalParameters($parameters);

        //진행률 체크
        $previousProgress = -1;
        $format->on('progress', function ($video, $format, $percentage) {
            global $property, $previousProgress;
            if ($percentage != $previousProgress) {
                $datas = array(
                    "progress" => $percentage
                );
                $type = $property["type"];
                if ($type == "preview") {
                    setPreviewData($datas);
                } else if ($type == "resolution") {
                    setResolutionData($datas);
                }
            }
        });
        
        $video->filters()->custom('scale=' . $newwidth . ':' . $newheight . ':flags=lanczos+full_chroma_inp+full_chroma_int+accurate_rnd');
        $video->filters()->custom('fps=' . number_format($framerate, 6));
        $video->filters()->custom('format=' . $pixelFormat);
        //색 공간 변경
        if ($isNullColorInfo == false) {
            $video->filters()->custom('colorspace=' . $colorSpace);
        }
        //제한된 색상 범위에서 전체 색상 범위로 변경
        if ($videoInfo["colorRange"] == "limited") {
            $video->filters()->custom('scale=in_range=limited:out_range=full');
        }
        //동기화
        $video->filters()->synchronize();

        try {
            $video->save($format, $endfile);
        } catch (\Throwable $th) {
            echo $th;
        }
    }
    function getVideoType($file) {
        $fi = new finfo(FILEINFO_MIME_TYPE);
        $mime_type = $fi->file($file);
        return $mime_type;
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
        //오디오 정보
        $audioInfo = $ffprobe
            ->streams($src)
            ->audios()
            ->first();

        //동영상 해상도
        $width = $videoInfo->getDimensions()->getWidth();
        $height = $videoInfo->getDimensions()->getHeight();

        //코덱 이름
        $codecId = $videoInfo->get('codec_tag_string');
        $codecId = strtolower($codecId);

        //비디오, 오디오 비트레이트
        $videoBitrate = null;
        $audioBitrate = null;
        try {
            $cmd = '"' . $ffprobePath . '" -v quiet -show_entries stream=bit_rate -print_format json "' . $src . '"';
            exec($cmd, $output, $return);

            $lines = "";
            $isJSON = false;
            foreach ($output as $line) {
                if ($line == "{") {
                    $lines = "";
                    $isJSON = true;
                }
                ($isJSON == true) ? $lines .= $line : null;
                ($line == "}") ? $isJSON = false : null;
            }
            $streams = json_decode($lines, true)["streams"];

            (isset($streams[0])) ? $videoBitrate = round($streams[0]["bit_rate"]) : null;
            (isset($streams[1])) ? $audioBitrate = round($streams[1]["bit_rate"]) : null;
        } catch (\Throwable $th) {
            //
        }
        ($videoBitrate == 0) ? $videoBitrate = 0 : null;
        //오디오 샘플링레이트
        $audioSampleRate = null;
        try {
            $audioSampleRate = $audioInfo->get('sample_rate');
        } catch (\Throwable $th) {
            //
        }
        //오디오 샘플 포맷
        $audioSampleFormat = null;
        try {
            $audioSampleFormat = $audioInfo->get('sample_fmt');
        } catch (\Throwable $th) {
            //
        }
        //오디오 채널 수
        $audioChannels = null;
        try {
            $audioChannels = $audioInfo->get('channels');
        } catch (\Throwable $th) {
            //
        }
        //오디오 채널 레이아웃
        $audioChannelLayout = null;
        try {
            $audioChannelLayout = $audioInfo->get('channel_layout');
            if ($audioChannelLayout == "default") {
                $audioChannelLayout = null;
            } else if (strpos($audioChannelLayout, "2.1") !== false) {  
                $audioChannelLayout = 2.1;
            } else if (strpos($audioChannelLayout, "3.0") !== false) {  
                $audioChannelLayout = 3.0;
            } else if (strpos($audioChannelLayout, "3.1") !== false) {  
                $audioChannelLayout = 3.1;
            } else if (strpos($audioChannelLayout, "4.0") !== false) {  
                $audioChannelLayout = 4.0;
            } else if (strpos($audioChannelLayout, "quad") !== false) {  
                $audioChannelLayout = "quad";
            } else if (strpos($audioChannelLayout, "4.1") !== false) {  
                $audioChannelLayout = 4.1;
            } else if (strpos($audioChannelLayout, "5.0") !== false) {  
                $audioChannelLayout = 5.0;
            } else if (strpos($audioChannelLayout, "5.1") !== false) {  
                $audioChannelLayout = 5.1;
            } else if (strpos($audioChannelLayout, "6.0") !== false) {  
                $audioChannelLayout = 6.0;
            } else if (strpos($audioChannelLayout, "6.1") !== false) {  
                $audioChannelLayout = 6.1;
            } else if (strpos($audioChannelLayout, "7.0") !== false) {  
                $audioChannelLayout = 7.0;
            } else if (strpos($audioChannelLayout, "7.1") !== false) {  
                $audioChannelLayout = 7.1;
            }
        } catch (\Throwable $th) {
            //
        }
        //동영상 길이
        $duration = $videoInfo->get('duration');

        //프레임
        $framerate = $videoInfo->get('avg_frame_rate');
        $splitFramerate = explode("/", $framerate);
        $framerate = ((int) $splitFramerate[0] / (int) $splitFramerate[1]);

        $fieldOrder = $videoInfo->get('field_order');
        if ($fieldOrder == null) {
            $fieldOrder = "progressive";
        }

        //픽셀 포맷
        $pixelFormat = $videoInfo->get('pix_fmt');

        //비트 뎁스
        $bitDepth = $videoInfo->get('bits_per_raw_sample');
        if ($bitDepth == 0) {
            if (strpos($pixelFormat, "48le") !== false) {
                $bitDepth = 48;
            } else if (strpos($pixelFormat, "16le") !== false) {
                $bitDepth = 16;
            } else if (strpos($pixelFormat, "14le") !== false) {
                $bitDepth = 14;
            } else if (strpos($pixelFormat, "12le") !== false) {
                $bitDepth = 12;
            } else if (strpos($pixelFormat, "10le") !== false) {
                $bitDepth = 10;
            } else if (strpos($pixelFormat, "9le") !== false) {
                $bitDepth = 9;
            } else {
                $bitDepth = 8;
            }
        }

        //색 영역
        $colorRange = $videoInfo->get('color_range');
        if ($colorRange == "tv") {
            $colorRange = "limited";
        } else if ($colorRange == "pc") {
            $colorRange = "full";
        } else {
            $colorRange = "limited";
        }

        //색 공간
        $colorSpace = $videoInfo->get('color_space');
        if (isset($colorSpace) && $colorSpace == "reserved") {
            $colorSpace = null;
        }

        //색 조합
        $colorPrimaries = $videoInfo->get('color_primaries');
        if (isset($colorPrimaries) && $colorPrimaries == "reserved") {
            $colorPrimaries = null;
        }

        //색공간 변환
        $colorTransfer = $videoInfo->get('color_transfer');
        if (isset($colorTransfer) && $colorTransfer == "reserved") {
            $colorTransfer = null;
        }

        //인코더 프로그램
        $tags = (array) $videoInfo->get('tags');
        if (isset($tags["encoder"])) {
            $encoder = $tags["encoder"];
        } else {
            $encoder = null;
        }

        //webm 형식일 경우
        if (isset($tags) && isset($tags["DURATION"])) {
            $duration = timeToSeconds($tags["DURATION"]);
            $encoder = $tags["ENCODER"];
        }
        
        return array(
            "codecId" => $codecId,
            "width" => $width,
            "height" => $height,
            "duration" => (float) $duration,
            "framerate" => (float) $framerate,
            "fieldOrder" => $fieldOrder,
            "bitDepth" => (int) $bitDepth,
            "pixelFormat" => $pixelFormat,
            "videoBitrate" => (int) $videoBitrate,
            "audioBitrate" => (int) $audioBitrate,
            "audioSampleFormat" => $audioSampleFormat,
            "audioSampleRate" => (int) $audioSampleRate,
            "audioChannels" => (int) $audioChannels,
            "audioChannelLayout" => $audioChannelLayout,
            "colorRange" => $colorRange,
            "colorSpace" => $colorSpace,
            "colorTransfer" => $colorTransfer,
            "colorPrimaries" => $colorPrimaries,
            "encoder" => $encoder
        );
    }
    function timeToSeconds($time) {
        $timeArr = explode(':', $time);
        $decTime = ($timeArr[0] * 60 * 60) + ($timeArr[1] * 60) + ($timeArr[2]);
      
        return $decTime;
    }
    function getSecondsFromHMS($time) {
        $timeArr = array_reverse(explode(":", $time));    
        $seconds = 0;
        foreach ($timeArr as $key => $value) {
            if ($key > 2)
                break;
            $seconds += pow(60, $key) * $value;
        }
        return (int) $seconds;
    }

    function getDetailVideoInfo() {
        global $ffmpegPath, $ffprobePath, $makeInfo;

        $ffprobe = FFMpeg\FFProbe::create(array(
            'ffmpeg.binaries'  => $ffmpegPath,
            'ffprobe.binaries' => $ffprobePath
        ));
        //비디오 정보
        $videoInfo = $ffprobe
            ->streams($makeInfo["tempFilePath"])
            ->videos()
            ->first();

        //동영상 해상도
        $width = $videoInfo->getDimensions()->getWidth();
        $height = $videoInfo->getDimensions()->getHeight();

        //PSNR
        $lavfi = "[1:v]scale=" . $width . ":" . $height . ":flags=neighbor[v1]; [0:v][v1]psnr";
        //SSIM
        $lavfi .= "; [1:v]scale=" . $width . ":" . $height . ":flags=neighbor[v1]; [0:v][v1]ssim";
        
        //CMD
        $qualityMetrics = '"' . $ffmpegPath . '" -i "' . $makeInfo["tempFilePath"] . '" -i "' . $makeInfo["encodingFilePath"] . '" -lavfi "' . $lavfi . '" -f null - 2>&1';
        $contentLoudness = '"' . $ffmpegPath . '" -i "' . $makeInfo["encodingFilePath"] . '" -af "loudnorm=I=-16:LRA=11:TP=-1.5:linear=true:print_format=json" -f null - 2>&1';
        
        $cmd = "start /B cmd /C \"" . $qualityMetrics . "\" & start /B cmd /C \"" . $contentLoudness . "\"";
        exec($cmd, $output);

        /* 출력 값 파싱 */
        $info = array(
            "qualityMetrics" => null,
            "contentLoudness" => null
        );

        //qualityMetrics
        $lines = "";
        foreach ($output as $line) {
            $lines .= $line;
        }
        $lines = preg_replace('/\([^)]+\)/', '', $lines);
        $lines = preg_replace('/\s{2,}/', ' ', $lines);
        $result = array();
        //- PSNR 측정 값 구하기
        if (preg_match('/PSNR y:([0-9.]+|inf) u:([0-9.]+|inf) v:([0-9.]+|inf) average:([0-9.]+|inf) min:([0-9.]+|inf) max:([0-9.]+|inf)/', $lines, $matches)) {
            $result['psnr'] = array(
                'y' => $matches[1] === 'inf' ? -1 : (float) $matches[1],
                'u' => $matches[2] === 'inf' ? -1 : (float) $matches[2],
                'v' => $matches[3] === 'inf' ? -1 : (float) $matches[3],
                'average' => $matches[4] === 'inf' ? -1 : (float) $matches[4],
                'min' => $matches[5] === 'inf' ? -1 : (float) $matches[5],
                'max' => $matches[6] === 'inf' ? -1 : (float) $matches[6]
            );
        }
        //- SSIM 측정 값 구하기
        if (preg_match('/SSIM Y:([0-9.]+) U:([0-9.]+) V:([0-9.]+) All:([0-9.]+)/', $lines, $matches)) {
            $result['ssim'] = array(
                'y' => (float) $matches[1],
                'u' => (float) $matches[2],
                'v' => (float) $matches[3],
                'all' => (float) $matches[4]
            );
        }
        $info["qualityMetrics"] = $result;

        //contentLoudness
        $lines = "";
        $isJSON = false;
        foreach ($output as $line) {
            if ($line == "{") {
                $lines = "";
                $isJSON = true;
            }
            ($isJSON == true) ? $lines .= $line : null;
            ($line == "}") ? $isJSON = false : null;
        }
        try {
            $info["contentLoudness"] = (float) json_decode($lines, true)["input_i"];
        } catch (\Throwable $th) {
            //
        }

        return $info;
    }
    /*function getContentLoudness($src) {
        global $ffmpegPath;
        try {
            $cmd = '"' . $ffmpegPath . '" -i "' . $src . '" -af "loudnorm=I=-16:LRA=11:TP=-1.5:linear=true:print_format=json" -f null - 2>&1';
            exec($cmd, $output, $return);
            
            $lines = "";
            $isJSON = false;
            foreach ($output as $line) {
                if ($line == "{") {
                    $lines = "";
                    $isJSON = true;
                }
                ($isJSON == true) ? $lines .= $line : null;
                ($line == "}") ? $isJSON = false : null;
            }
    
            $contentLoudness = json_decode($lines, true)["input_i"];
            return $contentLoudness;
        } catch (\Throwable $th) {
            return null;
        }
    }
    function getQualityMetrics($original, $processed) {
        global $ffmpegPath, $ffprobePath;

        $ffprobe = FFMpeg\FFProbe::create(array(
            'ffmpeg.binaries'  => $ffmpegPath,
            'ffprobe.binaries' => $ffprobePath
        ));
        //비디오 정보
        $videoInfo = $ffprobe
            ->streams($original)
            ->videos()
            ->first();

        //동영상 해상도
        $width = $videoInfo->getDimensions()->getWidth();
        $height = $videoInfo->getDimensions()->getHeight();
        
        //PSNR
        $lavfi = "[1:v]scale=" . $width . ":" . $height . ":flags=neighbor[v1]; [0:v][v1]psnr";
        //SSIM
        $lavfi .= "; [1:v]scale=" . $width . ":" . $height . ":flags=neighbor[v1]; [0:v][v1]ssim";
        
        $cmd = '"' . $ffmpegPath . '" -i "' . $original . '" -i "' . $processed . '" -lavfi "' . $lavfi . '" -f null - 2>&1';
        exec($cmd, $output, $return);

        $lines = "";
        foreach ($output as $line) {
            $lines .= $line;
        }
        $lines = preg_replace('/\([^)]+\)/', '', $lines);
        $lines = preg_replace('/\s{2,}/', ' ', $lines);

        $result = array();

        //PSNR 측정 값 구하기
        if (preg_match('/PSNR y:([0-9.]+|inf) u:([0-9.]+|inf) v:([0-9.]+|inf) average:([0-9.]+|inf) min:([0-9.]+|inf) max:([0-9.]+|inf)/', $lines, $matches)) {
            $result['psnr'] = array(
                'y' => $matches[1] === 'inf' ? -1 : (float) $matches[1],
                'u' => $matches[2] === 'inf' ? -1 : (float) $matches[2],
                'v' => $matches[3] === 'inf' ? -1 : (float) $matches[3],
                'average' => $matches[4] === 'inf' ? -1 : (float) $matches[4],
                'min' => $matches[5] === 'inf' ? -1 : (float) $matches[5],
                'max' => $matches[6] === 'inf' ? -1 : (float) $matches[6]
            );
        }

        //SSIM 측정 값 구하기
        if (preg_match('/SSIM Y:([0-9.]+) U:([0-9.]+) V:([0-9.]+) All:([0-9.]+)/', $lines, $matches)) {
            $result['ssim'] = array(
                'y' => (float) $matches[1],
                'u' => (float) $matches[2],
                'v' => (float) $matches[3],
                'all' => (float) $matches[4]
            );
        }
        
        return $result;
    }*/

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