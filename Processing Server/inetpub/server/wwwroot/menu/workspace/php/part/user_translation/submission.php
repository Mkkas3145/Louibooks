<?php

    include_once('../../../../../default_function.php');
    $userInfo = getMyLoginInfo();

    $partNumber = $_POST["partNumber"];
    $language = $_POST["language"];
    $thumbnailImage = null;
    if (isset($_POST["thumbnailImage"])) {
        $thumbnailImage = $_POST["thumbnailImage"];
    }
    $title = $_POST["title"];
    
    if ($userInfo["isLogin"] == true) {

        //커뮤니티 자격 여부
        if ($userInfo["community_permission"] == false) {
            echo "no permission";
            exit;
        }

        $stmt = $pdo->prepare("SELECT user_number, original_language FROM work_part WHERE number = :number");
        $stmt->execute(array(
            ':number' => $partNumber
        ));
        $workPart = $stmt->fetch();

        //크리에이터 자신이면
        if ($workPart["user_number"] == $userInfo["number"]) {
            echo "other users only";
            exit;
        }
        //원본 언어이면
        if ($workPart["original_language"] == $language) {
            echo "original language";
            exit;
        }

        //클라우드 데이터 가져오기
        $stmt = $pdo->prepare("SELECT data, size FROM cloud where user_number = :user_number AND number = :file_number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':file_number' => $_POST["fileNumber"]
        ));
        $cloudInfo = $stmt->fetch();

        //중복 체크
        $stmt = $pdo->prepare("SELECT number FROM work_part_user_translation where user_number = :user_number AND part_number = :part_number AND language = :language");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':part_number' => $partNumber,
            ':language' => $language
        ));
        $userTranslation = $stmt->fetch();

        //위치 구하기
        $location = getLocation()["country"];

        if (isset($userTranslation["number"]) == false) {
            $sql = $pdo->prepare('insert into work_part_user_translation (part_number, user_number, language, thumbnail_image, title, data, submission_date, location, size) values(:part_number, :user_number, :language, :thumbnail_image, :title, :data, :submission_date, :location, :size)');
            $sql->execute(array(
                ':part_number' => $partNumber,
                ':user_number' => $userInfo["number"],
                ':language' => $language,
                ':thumbnail_image' => $thumbnailImage,
                ':title' => $title,
                ':data' => $cloudInfo["data"],
                ':submission_date' => date("Y-m-d H:i:s"),
                ':location' => $location,
                ':size' => $cloudInfo["size"]
            ));

            //사용자가 활동 알림을 허용하였는지
            $stmt = $pdo->prepare("SELECT activity_notifications_use FROM user WHERE number = :number");
            $stmt->execute(array(
                ':number' => $workPart["user_number"]
            ));
            $sendUserInfo = $stmt->fetch();

            //알림
            if ($sendUserInfo["activity_notifications_use"] == true) {
                requestUserNotificationsUserTranslation($userInfo["number"], $workPart["user_number"], $partNumber, 0);
            }

            echo "created";
        } else {
            $sql = $pdo->prepare('UPDATE work_part_user_translation SET thumbnail_image = :thumbnail_image, title = :title, data = :data, location = :location, size = :size WHERE number = :number');
            $sql->execute(array(
                ':number' => $userTranslation["number"],
                ':thumbnail_image' => $thumbnailImage,
                ':title' => $title,
                ':data' => $cloudInfo["data"],
                ':location' => $location,
                ':size' => $cloudInfo["size"]
            ));

            echo "modified";
        }
    }

?>