<?php

    //최대 3시간 동안 처리
    ini_set('max_execution_time', 10800);
    //메모리 제한 없애기
    ini_set('memory_limit','-1');

    include_once('../../wwwroot/default_function.php');

    if (isset($_FILES['file'])) {
        $file = $_FILES['file'];
        $tempFile = $file['tmp_name'];

        $userInfo = getMyLoginInfo();
        if ($userInfo["isLogin"] == true && $userInfo["animator"] == true) {
            echo uploadFileChunk($dbHost, file_get_contents($tempFile));
        }
    }

?>