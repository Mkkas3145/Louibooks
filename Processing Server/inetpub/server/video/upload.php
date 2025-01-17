<?php

    $timeout = 2592000;

    //최대 한달 동안 처리
    ini_set('max_execution_time', $timeout);
    //메모리 제한 없애기
    ini_set('memory_limit', -1);

    include_once('../wwwroot/default_function.php');

    $ffmpegPath = "C://programs/ffmpeg/bin/ffmpeg.exe";
    $ffprobePath = "C://programs/ffmpeg/bin/ffprobe.exe";
    $temporaryPath = "C://inetpub/temp";
    $ext = ".mp4";
    $imageExt = ".webp";

    $ffmpeg = FFMpeg\FFMpeg::create(array(
        'ffmpeg.binaries'  => $ffmpegPath,
        'ffprobe.binaries' => $ffprobePath,
        'timeout'          => $timeout,
        'temporary_directory' => $temporaryPath
    ));

    //동영상 서버 주소
    $url = "https://video.louibooks.com/";
    $imageUrl = "https://img.louibooks.com/";

    //
    $type = $_POST["type"];

    $file = null;
    $tempFile = null;
    $fileTypeExt = null;
    $fileSize = null;
    if (isset($_FILES['file'])) {
        $file = $_FILES['file'];
        $tempFile = $file['tmp_name'];
        $fileTypeExt = explode("/", $file['type']);
        $fileSize = filesize($tempFile);
    }

    //용량 제한
    if ($type == "profile") {
        //10메가 이상이면
        if (($fileSize / 1024) == 0 || ($fileSize / 1024) > 10000) {
            echo "file is too big";
            exit;
        }
    } else if ($type == "user_art") {
        //60메가 이상이면
        if (($fileSize / 1024) == 0 || ($fileSize / 1024) > 60000) {
            echo "file is too big";
            exit;
        }
    }

    $a = 0;
    $b = 50;
    $strings = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $newFileName = substr(str_shuffle($strings), $a, $b);
    $resFile = $temporaryPath . '/' . $newFileName . $ext;
    $thumbnailFile = $temporaryPath . '/' . $newFileName . $imageExt;




    
    //동영상 압축, 파일 리사이즈 후 복사하기
    if ($type == "profile") {
        makeVideo($tempFile, $resFile, 200, null, true, 60, 0.6);
    } else if ($type == "user_art") {
        makeVideo($tempFile, $resFile, 1920, null, true, 60, 0.9);
    }

    //썸네일 추출
    $video = $ffmpeg->open($resFile);
    $video->frame(FFMpeg\Coordinate\TimeCode::fromSeconds(0))
        ->save($thumbnailFile);

    //데이터베이스에 업로드
    $uploadList = array();
    $uploadList[] = array(
        "path" => ("inetpub/server/video/" . $type . "/" . $newFileName . $ext),
        "contents" => base64_encode(file_get_contents($resFile))
    );
    $uploadList[] = array(
        "path" => ("inetpub/server/image/" . $type . "/" . $newFileName . $imageExt),
        "contents" => base64_encode(file_get_contents($thumbnailFile))
    );
    remoteFileUpload(
        $dbHost,
        $uploadList
    );






    //동영상 정보 구하기
    $videoInfo = getVideoInfo($resFile);

    $videoUrl = $url . $type . '/' . $newFileName . $ext;
    $videoWidth = $videoInfo["width"];
    $videoHeight = $videoInfo["height"];

    //썸네일 URL
    $thumbnailUrl = $imageUrl . $type . '/' . $newFileName . $imageExt;

    $data = array();
    $data["url"] = $videoUrl;
    $data["width"] = $videoWidth;
    $data["height"] = $videoHeight;
    $data["thumbnail"] = $thumbnailUrl;

    echo json_encode($data);







    
    //처리 파일 삭제
    @unlink($resFile);
    @unlink($thumbnailFile);

























































































    function makeVideo($sourcefile, $endfile, $maxSize, $sizeType = null, $mute = false, $maxFramerate = 0, $quality = 1) {
        global $ffmpeg, $ffmpegPath, $ffprobePath, $temporaryPath;

        $video = $ffmpeg->open($sourcefile);
        $videoInfo = getVideoInfo($sourcefile);
        $width = $videoInfo["width"];
        $height = $videoInfo["height"];

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

        $format = new FFMpeg\Format\Video\X264();
        $format->setKiloBitrate(0);

        $minQuality = 51;
        $maxQuality = 22;
        $crfValue = $maxQuality + (($minQuality - $maxQuality) - (($minQuality - $maxQuality) * $quality));
        $crfValue = round($crfValue);

        $parameters = array();
        if ($mute == true) {
            //오디오 없애기
            $parameters[] = '-an';
        }
        $parameters[] = '-sn';
        $parameters[] = '-b:v';             $parameters[] = 0;
        $parameters[] = '-crf';             $parameters[] = $crfValue;
        $format->setAdditionalParameters($parameters);
        
        $video->filters()->resize(new FFMpeg\Coordinate\Dimension($newwidth, $newheight), FFMpeg\Filters\Video\ResizeFilter::RESIZEMODE_INSET, true);
        $video->filters()->custom('fps=' . number_format($framerate, 6));
        $video->save($format, $endfile);
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

        //프레임
        $framerate = $videoInfo->get('avg_frame_rate');
        $splitFramerate = explode("/", $framerate);
        $framerate = ((int) $splitFramerate[0] / (int) $splitFramerate[1]);
        
        return array(
            "width" => $width,
            "height" => $height,
            "framerate" => $framerate
        );
    }

?>