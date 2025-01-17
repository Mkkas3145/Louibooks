<?php

    //최대 하루 동안 처리
    ini_set('max_execution_time', 86400);

    //메모리 제한 없애기
    ini_set('memory_limit','-1');

    $referencePath = "C://";

    if (isset($_POST["key"]) && $originalKey == $_POST["key"]) {
        $chunkList = json_decode($_POST["chunkList"], true);
        $chunkList_length = count($chunkList);

        if ($chunkList_length != 0) {
            $files = "";
            for ($i = 0; $i < $chunkList_length; $i++) {
                $chunkPath = ("./temp/" . $chunkList[$i]);
                $files .= file_get_contents($chunkPath);
                unlink($chunkPath);
            }
            
            $files = json_decode($files, true);
            $length = count($files);
            for ($i = 0; $i < $length; $i++) {
                $info = $files[$i];
                $path = ($referencePath . $info["path"]);
                $contents = base64_decode($info["contents"]);
                $dir = dirname($path);
                if (!is_dir($dir)) {
                     @mkdir($dir, 0755, true);
                }
                @file_put_contents($path, $contents);
            }

            exec('C:\inetpub\php\php.exe -r "apcu_clear_cache();"');
            exec('C:\inetpub\php\php.exe -r "opcache_reset();"');

            $rebooting = $_POST["rebooting"];
            if ($rebooting == true) {
                exec('shutdown -r -f -t 0');
            }
        }
        
    }

?>