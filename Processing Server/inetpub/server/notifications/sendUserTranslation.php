<?php

    include_once('default_function.php');

    if (isset($_POST["key"]) && $_POST["key"] == $originalKey) {
        $senderNumber = $_POST["senderNumber"];
        $partNumber = $_POST["partNumber"];
        $sendType = $_POST["sendType"];
        $userNumber = $_POST["userNumber"];
        $type = 10;

        //회차 정보 구하기
        $stmt = $pdo->prepare("SELECT work_number, user_number FROM work_part WHERE number = :number");
        $stmt->execute(array(
            "number" => $partNumber
        ));
        $partInfo = $stmt->fetch();

        if (isset($partInfo)) {
            //보낼 유저 목록
            $userNumbers = array();
            $userNumbers[] = $userNumber;

            $data = array(
                "senderNumber" => (int) $senderNumber,
                "workNumber" => (int) $partInfo["work_number"],
                "partNumber" => (int) $partNumber,
                "sendType" => (int) $sendType
            );

            sendUserNotifications($userNumbers, $type, $data);











            //---------- 푸시 알림 ----------




            





            //회차 정보 구하기
            $stmt = $pdo->prepare("SELECT work_number, type, title, thumbnail_image FROM work_part WHERE number = :number");
            $stmt->execute(array(
                ":number" => $partNumber
            ));
            $defaultPart = $stmt->fetch();

            //작품 정보 구하기
            $workNumber = $defaultPart["work_number"];
            $stmt = $pdo->prepare("SELECT title, user_number, cover_image, default_cover_image FROM works WHERE number = :number AND public_status != 2");
            $stmt->execute(array(
                ":number" => $workNumber
            ));
            $defaultWorks = $stmt->fetch();

            if (isset($defaultWorks["title"])) {
                $language = array();
                $defaultTitle = $defaultWorks["title"];
                $defaultCoverImage = $defaultWorks["default_cover_image"];
                if (isset($defaultWorks["cover_image"])) {
                    $defaultCoverImage = $defaultWorks["cover_image"];
                }
                $defaultThumbnailImage = $defaultPart["thumbnail_image"];
                $defaultPartTitle = $defaultPart["title"];
                $clickURL = "https://louibooks.com";
                if ($sendType == 0) {
                    $clickURL = "https://louibooks.com/workspace/part/user_translation/" . $partNumber;
                } else {
                    if ($defaultPart["type"] == "novel") {
                        $clickURL = "https://louibooks.com/novel_viewer/" . $partNumber;
                    } else if ($defaultPart["type"] == "image_format") {
                        $clickURL = "https://louibooks.com/image_format_viewer/" . $partNumber;
                    }
                }

                //보내는 사람 정보
                $userInfo = getUserInfo($senderNumber)[0];

                $language["default"] = array(
                    "workTitle" => $defaultTitle,
                    "partTitle" => $defaultPartTitle,
                    "coverImage" => $defaultCoverImage,
                    "thumbnailImage" => $defaultThumbnailImage,
                    "nickname" => $userInfo["nickname"],
                    "clickURL" => $clickURL,
                    "sendType" => $sendType
                );
                
                //작품 현지화 정보
                $stmt = $pdo->prepare("SELECT language, title, cover_image FROM work_localization WHERE work_number = :work_number");
                $stmt->execute(array(
                    ":work_number" => $workNumber
                ));
                $workLocalization = $stmt->fetchAll();
                $workLocalization_length = count($workLocalization);
                for ($i = 0; $i < $workLocalization_length; $i++) {
                    $title = $workLocalization[$i]["title"];
                    $language[$workLocalization[$i]["language"]]["workTitle"] = $title;
                    if (isset($workLocalization[$i]["cover_image"])) {
                        $image = $workLocalization[$i]["cover_image"];
                        $language[$workLocalization[$i]["language"]]["coverImage"] = $image;
                    }
                }

                //회차 현지화 정보
                $stmt = $pdo->prepare("SELECT language, title, thumbnail_image FROM work_part_localization WHERE part_number = :part_number");
                $stmt->execute(array(
                    ":part_number" => $partNumber
                ));
                $partLocalization = $stmt->fetchAll();
                $partLocalization_length = count($partLocalization);
                for ($i = 0; $i < $partLocalization_length; $i++) {
                    $title = $partLocalization[$i]["title"];
                    $language[$workLocalization[$i]["language"]]["partTitle"] = $title;
                    if (isset($language[$workLocalization[$i]["language"]]["thumbnail_image"])) {
                        $language[$workLocalization[$i]["language"]]["thumbnailImage"] = $language[$workLocalization[$i]["language"]]["thumbnail_image"];
                    }
                }

                //푸시 알림 보내기
                sendUserPushNotifications($userNumbers, $type, $language);
            }
        }
    }

?>