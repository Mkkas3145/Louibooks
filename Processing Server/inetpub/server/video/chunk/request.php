<?php

    include_once('../../wwwroot/default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        //회차 업로드
        $workNumber = $_POST["workNumber"];
        $chapter = null;
        if (isset($_POST["chapter"])) {
            $chapter = $_POST["chapter"];
        }
        $chapterTitle = null;
        if (isset($_POST["chapterTitle"])) {
            $chapterTitle = $_POST["chapterTitle"];
        }
        $category = $_POST["category"];
        $fileName = $_POST["fileName"];

        $url = "http://" . $serverIp . "/php/work/upload_part.php";
        $param = array(
            "key" => $originalKey,
            "loginNumber" => $userInfo["number"],
            "workNumber" => $workNumber,
            "chapter" => $chapter,
            "chapterTitle" => $chapterTitle,
            "category" => $category,
            "fileName" => $fileName
        );
        $cu = curl_init();
        curl_setopt($cu, CURLOPT_URL, $url);
        curl_setopt($cu, CURLOPT_POST, true);
        curl_setopt($cu, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($cu, CURLOPT_SSLVERSION, 3);
        curl_setopt($cu, CURLOPT_POSTFIELDS, http_build_query($param));
        curl_setopt($cu, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($cu, CURLOPT_TIMEOUT, 60);
        $partInfo = json_decode(curl_exec($cu), true);
        curl_close($cu);

        if ($partInfo != null && count($partInfo) != 0) {
            $url = "http://" . $serverIp . ":3002/chunk/finishing.php";
            $param = array(
                "key" => $originalKey,
                "partNumber" => $partInfo["number"],
                "chunkList" => $_POST["chunkList"],
                "ext" => $_POST["ext"]
            );
            curlRequestAsync($url, $param);

            //결과 출력
            echo json_encode($partInfo);
        }
    }

?>