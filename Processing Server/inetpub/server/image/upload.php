<?php

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        exit(0);
    }

    include_once('../wwwroot/default_function.php');
    $serverDomain = "img.louibooks.com";
    $sizeList = array(256, 480, 640, 960, 1280, 1920, 2560, 3840, 5120, 7680);

    $type = $_POST["type"];
    $ext = ".webp";
    
    $a = 0;
    $b = 50;
    $strings = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $newFileName = substr(str_shuffle($strings), $a, $b);
    $resFile = ($tempPath . "/" . $newFileName . $ext);

    if (isset($_POST['imgFile']) == false) {
        $tempFile = $_FILES['imgFile']['tmp_name'];
    }
    
    //이미지 압축, 파일 리사이즈 후 복사하기
    if ($type == "profile") {
        makeThumbnail($tempFile, $resFile, 500, 6);
    } else if ($type == "novel_image") {
        makeThumbnail($tempFile, $resFile, 1920, 9, "width");
    } else if ($type == "work_cover") {
        makeThumbnail($tempFile, $resFile, 800, 8);
    } else if ($type == "work_art") {
        makeThumbnail($tempFile, $resFile, 1920, 8);
    } else if ($type == "work_part_thumbnail") {
        makeThumbnail($tempFile, $resFile, 800, 8);
    } else if ($type == "image_format") {
        $originalSize = getimagesize($tempFile);

        $info = array(
            'imageId' => $newFileName,
            'resolutions' => array()
        );

        $uploadList = array();
        $processingSize = null;
        for ($i = 0; $i < count($sizeList); $i++) {
            if ($originalSize[0] >= $sizeList[$i]) {
                makeThumbnail($tempFile, $resFile, $sizeList[$i], 10, "width");
                $imageSize = getimagesize($resFile);
                $url = ("https://" . $serverDomain . "/" . $type . "/" . $newFileName . "/" . $sizeList[$i] . $ext);

                $info['resolutions'][] = array(
                    "resolution" => $sizeList[$i],
                    'url' => $url,
                    'width' => $imageSize[0],
                    'height' => $imageSize[1],
                    'size' => (filesize($resFile) / 1024)
                );

                $uploadList[] = array(
                    "path" => ("inetpub/server/image/" . $type . "/" . $newFileName . "/" . $sizeList[$i] . $ext),
                    "contents" => base64_encode(file_get_contents($resFile))
                );

                //업스케일링 관련
                $upscalingRate = 4;
                $upscalingWidth = ($imageSize[0] * $upscalingRate);
                $upscalingHeight = ($imageSize[1] * $upscalingRate);
                if ($upscalingWidth <= 16383 && $upscalingHeight <= 16383) {
                    //업스케일링 가능
                    $processingSize = $sizeList[$i];
                }

                //처리 파일 삭제
                unlink($resFile);
            }
        }

        //데이터베이스에 업로드
        remoteFileUpload(
            $dbHost,
            $uploadList
        );

        //업스케일링 정보 생성
        if ($processingSize != null && $processingSize <= 1920 && $processingSize >= 256) {
            $sql = $pdo->prepare('insert into image_format_upscaling (image_id, data, processing_size) values(:image_id, :data, :processing_size)');
            $sql->execute(array(
                ':image_id' => $info["imageId"],
                ':data' => NULL,
                ':processing_size' => $processingSize
            ));
            $lastInsertId = $pdo->lastInsertId();
        }

        echo json_encode($info);
        exit;
    } else if ($type == "community") {
        makeThumbnail($tempFile, $resFile, 1280, 9, "width");
    } else if ($type == "user_art") {
        makeThumbnail($tempFile, $resFile, 1920, 9);
    } else if ($type == "questions") {
        makeThumbnail($tempFile, $resFile, 1920, 8);
    }

    $imageUrl = ('https://' . $serverDomain . '/' . $type . '/' . $newFileName . $ext);
    $imageSize = getimagesize($resFile);
    $imageWidth = $imageSize[0];
    $imageHeight = $imageSize[1];

    $data = array();
    $data["url"] = $imageUrl;
    $data["width"] = $imageWidth;
    $data["height"] = $imageHeight;

    //데이터베이스에 업로드
    remoteFileUpload(
        $dbHost,
        array(array(
            "path" => ("inetpub/server/image/" . $type . "/" . $newFileName . $ext),
            "contents" => base64_encode(file_get_contents($resFile))
        ))
    );

    //처리 파일 삭제
    unlink($resFile);

    echo json_encode($data);

































    



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

?>