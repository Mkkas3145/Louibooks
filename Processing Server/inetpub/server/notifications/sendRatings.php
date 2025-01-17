<?php

    include_once('default_function.php');

    if (isset($_POST["key"]) && $_POST["key"] == $originalKey) {
        $ratingsNumber = $_POST["ratingsNumber"];
        $userNumbers = explode(",", $_POST["userNumbers"]);
        $type = 3;

        //댓글 정보 구하기
        $stmt = $pdo->prepare("SELECT work_number, user_number FROM ratings WHERE number = :number");
        $stmt->execute(array(
            ':number' => $ratingsNumber
        ));
        $ratingsInfo = $stmt->fetch();

        if (isset($ratingsInfo)) {
            $workNumber = $ratingsInfo["work_number"];
            $senderNumber = $ratingsInfo["user_number"];
    
            $data = array(
                "senderNumber" => (int) $senderNumber,
                "workNumber" => (int) $workNumber,
                "ratingsNumber" => (int) $ratingsNumber
            );
        
            sendUserNotifications($userNumbers, $type, $data);
                        










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
                $clickURL = "https://louibooks.com/rating/" . $ratingsNumber;

                //유저 정보
                $userInfo = getUserInfo($senderNumber)[0];

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

                sendUserPushNotifications($userNumbers, $type, $language);
            }
        }
    }

?>