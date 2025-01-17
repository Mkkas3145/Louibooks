<?php

    //최대 하루 동안 처리
    ini_set('max_execution_time', 86400);

    $referencePath = "C://";

    if (isset($_POST["key"]) && $originalKey == $_POST["key"]) {
        $files = json_decode($_POST["files"], true);
        $length = count($files);
        $isError = false;
        for ($i = 0; $i < $length; $i++) {
            $path = ($referencePath . $files[$i]);
            delete($path);
        }
        $rebooting = $_POST["rebooting"];
        if ($rebooting == true) {
            exec('shutdown -r -f -t 0');
        }
    }

    function delete($dir) {
        if (!is_dir($dir)) {
            @unlink($dir);
            return;
        }
        $files = scandir($dir);
        foreach ($files as $file) {
            if ($file === '.' || $file === '..') {
                continue;
            }
            $path = $dir . '/' . $file;
            if (is_dir($path)) {
                delete($path);
            } else {
                @unlink($path);
            }
        }
        @rmdir($dir);
    }

?>