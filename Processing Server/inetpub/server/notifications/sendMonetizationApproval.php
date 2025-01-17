<?php

    include_once('default_function.php');

    if (isset($_POST["key"]) && $_POST["key"] == $originalKey) {
        $senderNumber = $_POST["senderNumber"];
        $workNumber = $_POST["workNumber"];
        $approvalType = $_POST["approvalType"];
        $type = 7;

        //작품 정보 구하기
        $stmt = $pdo->prepare("SELECT number, user_number FROM works WHERE number = :number");
        $stmt->execute(array(
            "number" => $workNumber
        ));
        $workInfo = $stmt->fetch();

        if (isset($workInfo)) {
            //보낼 유저
            $userNumbers = array($workInfo["user_number"]);

            $data = array(
                "senderNumber" => (int) $senderNumber,
                "workNumber" => (int) $workInfo["number"],
                "approvalType" => (int) $approvalType
            );
        
            sendUserNotifications($userNumbers, $type, $data);











            //---------- 푸시 알림 ----------




            





            

            //작품 정보 구하기
            $stmt = $pdo->prepare("SELECT title, user_number, cover_image, default_cover_image FROM works WHERE number = :number");
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

                $language["default"] = array(
                    "workTitle" => $defaultTitle,
                    "coverImage" => $defaultCoverImage,
                    "approvalType" => $approvalType
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

                sendUserPushNotifications($userNumbers, $type, $language);
            }
        }
    }

?>