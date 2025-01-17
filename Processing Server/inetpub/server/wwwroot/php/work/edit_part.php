<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {

        //본인이 맞는지
        $stmt = $pdo->prepare("SELECT number, type, work_number, public_status, category, send_notifications, views FROM work_part where user_number = :user_number AND number = :number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $_POST["partNumber"],
        ));
        $partInfo = $stmt->fetch();
        if (count($partInfo) == 0) {
            echo 'not you';
            exit;
        }

        //작품 정보 구하기
        $stmt = $pdo->prepare("SELECT type, public_status FROM works WHERE user_number = :user_number AND number = :number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $partInfo["work_number"]
        ));
        $workInfo = $stmt->fetch();

        //클라우드 데이터 가져오기
        $cloudInfo = null;
        if (isset($_POST["fileNumber"]) && $partInfo["type"] != "video") {
            $stmt = $pdo->prepare("SELECT data FROM cloud where user_number = :user_number AND number = :file_number");
            $stmt->execute(array(
                ':user_number' => $userInfo["number"],
                ':file_number' => $_POST["fileNumber"],
            ));
            $cloudInfo = $stmt->fetch()["data"];
        }
        $dataSql = ", data = :data, size = :size";
        if ($cloudInfo == null) {
            $dataSql = '';
        }

        $sql = $pdo->prepare('UPDATE work_part SET title = :title, public_status = :public_status' . $dataSql . ' WHERE number = :number');
        $uploadData = array(
            ':number' => $_POST["partNumber"],
            ':title' => cut_str($_POST["title"], 100),
            ':public_status' => $_POST["publicStatus"]
        );
        if ($cloudInfo != null) {
            $uploadData[":data"] = $cloudInfo;
            $uploadData[":size"] = getCloudDataSize($cloudInfo);
        }
        $sql->execute($uploadData);

        //회차 수 올리기
        if ($partInfo["public_status"] != 0 && $_POST["publicStatus"] == 0) {
            $sql = $pdo->prepare('UPDATE works SET part = part + 1 WHERE number = :number');
            $sql->execute(array(
                ':number' => $partInfo["work_number"]
            ));
        }
        //회차 수 낮추기
        if ($partInfo["public_status"] == 0 && $_POST["publicStatus"] != 0) {
            $sql = $pdo->prepare('UPDATE works SET part = part - 1 WHERE number = :number');
            $sql->execute(array(
                ':number' => $partInfo["work_number"]
            ));
        }

        //완결 수 올리기
        if ($partInfo["public_status"] != 0 && $partInfo["category"] == "ending" && $_POST["publicStatus"] == 0) {
            $sql = $pdo->prepare('UPDATE works SET ending = ending + 1 WHERE number = :number');
            $sql->execute(array(
                ':number' => $partInfo["work_number"]
            ));
        }
        //완결 수 낮추기
        if ($partInfo["public_status"] == 0 && $partInfo["category"] == "ending" && $_POST["publicStatus"] != 0) {
            $sql = $pdo->prepare('UPDATE works SET ending = ending - 1 WHERE number = :number');
            $sql->execute(array(
                ':number' => $partInfo["work_number"]
            ));
        }

        //작품 조회수 감소
        if ($partInfo["public_status"] == 0 && $_POST["publicStatus"] != 0) {
            $sql = $pdo->prepare('UPDATE works SET views = views - :views WHERE number = :number');
            $sql->execute(array(
                ':number' => $partInfo["work_number"],
                ':views' => $partInfo["views"]
            ));
        }
        //작품 조회수 증가
        if ($partInfo["public_status"] != 0 && $_POST["publicStatus"] == 0) {
            $sql = $pdo->prepare('UPDATE works SET views = views + :views WHERE number = :number');
            $sql->execute(array(
                ':number' => $partInfo["work_number"],
                ':views' => $partInfo["views"]
            ));
        }

        //알림 보내기
        if ($partInfo["send_notifications"] == false && $_POST["publicStatus"] == 0 && $workInfo["public_status"] != 2) {
            requestUserNotificationsPartPublic($partInfo["number"]);

            //이 이후로 더 이상 알림을 보내지 않음
            $sql = $pdo->prepare('UPDATE work_part SET send_notifications = true WHERE number = :number');
            $sql->execute(array(
                ':number' => $partInfo["number"]
            ));
        }

        echo "change done";
    }

?>