<?php

    //최대 하루 동안 처리
    ini_set('max_execution_time', 86400);

    //메모리 제한 없애기
    ini_set('memory_limit','-1');

    if (isset($_POST["key"]) && $originalKey == $_POST["key"]) {
        //현재 시간 구하기
        $newDate = date("Y-m-d H:i:s");

        //24시간 지난 임시 파일 삭제
        $path = "./temp";
        if(is_dir($path)) {
            if($dh = opendir($path)) {
                while(($entry = readdir($dh)) !== false) {
                    if ($entry == "." || $entry == "..") {
                        continue;
                    }
                    
                    $filePath = ($path . "/" . $entry);
                    $pathInfo = pathinfo($filePath);
                    $fileName = $pathInfo["filename"];
                    $fileName = basename($fileName, strrchr($fileName, '.'));
                    $fileDate = str_replace(";", ":", $fileName);
                    $fileDate = str_replace("_", "", strrchr($fileDate, '_'));
                    $fileDate = date($fileDate);
                    
                    $difference = getTimeDifference($fileDate, $newDate);

                    //최종 수정일이 24시간 이상인 파일만 삭제
                    if ($difference >= (3600 * 24)) {
                        @unlink($filePath);
                    }
                }
                closedir($dh);
            }
        }
        
        //랜덤 파일 이름
        $a = 0;
        $b = 100;
        $strings = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $random = substr(str_shuffle($strings), $a, $b);

        $saveFilePath = "./temp/" . $random . '_' . str_replace(":", ";", $newDate) . '.chunk';
        move_uploaded_file($_FILES['contents']['tmp_name'], $saveFilePath);

        echo ($random . '_' . str_replace(":", ";", $newDate) . '.chunk');
    }

    function getTimeDifference($date1, $date2) {
        $time1 = new DateTime($date1);
        $time2 = new DateTime($date2);
        return $time2->getTimestamp() - $time1->getTimestamp();
    }

?>