<?php

    //최대 3시간 동안 처리
    ini_set('max_execution_time', 10800);
    //메모리 제한 없애기
    ini_set('memory_limit','-1');

    include_once('../../wwwroot/default_function.php');

    if ($originalKey == $_POST["key"]) {
        $partNumber = $_POST["partNumber"];
        $chunkList = json_decode($_POST["chunkList"], true);
        $chunkList_length = count($chunkList);
        $ext = $_POST["ext"];

        if ($chunkList_length == 0) {
            echo "Not chunk info";
            exit;
        }

        $a = 0;
        $b = 50;
        $strings = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $originalFileName = substr(str_shuffle($strings), $a, $b);
        $videoId = substr(str_shuffle($strings), $a, $b);

        //회차 정보 불러오기
        $stmt = $pdo->prepare("SELECT data FROM work_part WHERE number = :number");
        $stmt->execute(array(
            "number" => $partNumber
        ));
        $partData = json_decode($stmt->fetch()["data"], true);
        $partData["videoId"] = $videoId;
        
        //회차 정보 업데이트
        $sql = $pdo->prepare('UPDATE work_part SET data = :data WHERE number = :number');
        $sql->execute(array(
            ':number' => $partNumber,
            ':data' => json_encode($partData)
        ));

        //파일 결합하기
        combinedFileChunk($dbHost, $chunkList, "inetpub/server/video/video/" . $videoId . "/" . $originalFileName . "." . $ext);

        //동영상 인코딩 요청 정보
        $sql = $pdo->prepare('insert into video_encoding (part_number, video_id, original_file_name) values(:part_number, :video_id, :original_file_name)');
        $sql->execute(array(
            ':part_number' => $partNumber,
            ':video_id' => $videoId,
            ':original_file_name' => ($originalFileName . "." . $ext)
        ));
    }

?>