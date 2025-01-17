<?php

    include_once('default_function.php');

    if (isset($_POST["key"]) && $_POST["key"] == $originalKey) {
        $communityNumber = $_POST["communityNumber"];
        $type = 1;

        //커뮤니티 글 정보 구하기
        $stmt = $pdo->prepare("SELECT uid, user_number FROM community WHERE number = :number");
        $stmt->execute(array(
            "number" => $communityNumber
        ));
        $communityInfo = $stmt->fetch();

        if (isset($communityInfo)) {
            $workNumber = (Int) str_replace('work_', '', $communityInfo["uid"]);

            //보낼 유저 목록
            $stmt = $pdo->prepare("SELECT user_number FROM work_notifications_settings WHERE work_number = :work_number AND type = 2");
            $stmt->execute(array(
                "work_number" => $workNumber
            ));
            $notificationsSettings = $stmt->fetchAll();
            $notificationsSettings_length = count($notificationsSettings);
            $userNumbers = array();
            for ($i = 0; $i < $notificationsSettings_length; $i++) {
                $userNumbers[] = $notificationsSettings[$i]["user_number"];
            }

            $data = array(
                "senderNumber" => (int) $communityInfo["user_number"],
                "workNumber" => (int) $workNumber,
                "communityNumber" => (int) $communityNumber
            );
            
            //푸시 알림을 먼저 처리한다.











            //---------- 푸시 알림 ----------




            

            




            //작품 정보 구하기
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
                $clickURL = "https://louibooks.com/community/" . $communityNumber;

                //크리에이터 정보
                $userInfo = getUserInfo($defaultWorks["user_number"])[0];

                $language["default"] = array(
                    "workTitle" => $defaultTitle,
                    "coverImage" => $defaultCoverImage,
                    "nickname" => $userInfo["nickname"],
                    "clickURL" => $clickURL
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

                //푸시 알림 보내기
                sendUserPushNotifications($userNumbers, $type, $language);
            }
        }










        //Louibooks 데이터베이스 알림 삽입
        sendUserNotifications($userNumbers, $type, $data);
    }

?>