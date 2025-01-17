<?php

    include_once('../../../../../default_function.php');
    $userInfo = getMyLoginInfo();
    
    if ($userInfo["isLogin"] == true) {
        $partNumber = $_POST["partNumber"];
        $userTranslationNumber = $_POST["userTranslationNumber"];

        //크리에이터 자격 여부
        if ($userInfo["creator_permission"] == false) {
            echo "no permission";
            exit;
        }

        $stmt = $pdo->prepare("SELECT localization_language, work_number, user_number FROM work_part WHERE number = :number");
        $stmt->execute(array(
            ':number' => $partNumber
        ));
        $workPart = $stmt->fetch();

        //크리에이터가 아니면
        if ($workPart["user_number"] != $userInfo["number"]) {
            echo "no permission";
            exit;
        }

        



        //사용자 번역 정보
        $stmt = $pdo->prepare("SELECT title, thumbnail_image, data, language, user_number FROM work_part_user_translation WHERE number = :number");
        $stmt->execute(array(
            ':number' => $userTranslationNumber
        ));
        $userTranslation = $stmt->fetch();

        //이미 현지화가 있는지
        $stmt = $pdo->prepare("SELECT number FROM work_part_localization WHERE part_number = :part_number AND language = :language");
        $stmt->execute(array(
            ':part_number' => $partNumber,
            ':language' => $userTranslation["language"]
        ));
        $localization = $stmt->fetch();
        if (isset($localization["number"]) == false) {
            $sql = $pdo->prepare('insert into work_part_localization (work_number, part_number, language, thumbnail_image, title, data, contributor_number) values(:work_number, :part_number, :language, :thumbnail_image, :title, :data, :contributor_number)');
            $sql->execute(array(
                ':work_number' => $workPart["work_number"],
                ':part_number' => $partNumber,
                ':language' => $userTranslation["language"],
                ':thumbnail_image' => $userTranslation["thumbnail_image"],
                ':title' => $userTranslation["title"],
                ':data' => $userTranslation["data"],
                ':contributor_number' => $userTranslation["user_number"]
            ));

            //회차 지원 언어에 추가
            $localizationLanguage = array();
            if (isset($workPart["localization_language"])) {
                $localizationLanguage = explode(",", $workPart["localization_language"]);
            }
            $localizationLanguage[] = $userTranslation["language"];

            $sql = $pdo->prepare('UPDATE work_part SET localization_language = :localization_language WHERE number = :number');
            $sql->execute(array(
                ':number' => $partNumber,
                ':localization_language' => implode(",", $localizationLanguage)
            ));

            echo "created";
        } else {
            $sql = $pdo->prepare('UPDATE work_part_localization SET thumbnail_image = :thumbnail_image, title = :title, data = :data, contributor_number = :contributor_number WHERE number = :number');
            $sql->execute(array(
                ':number' => $localization["number"],
                ':thumbnail_image' => $userTranslation["thumbnail_image"],
                ':title' => $userTranslation["title"],
                ':data' => $userTranslation["data"],
                ':contributor_number' => $userTranslation["user_number"]
            ));

            echo "changed";
        }

        //알림
        requestUserNotificationsUserTranslation($userInfo["number"], $userTranslation["user_number"], $partNumber, 2);




        //삭제
        $stmt = $pdo->prepare("DELETE FROM work_part_user_translation WHERE number = :number");
        $stmt->execute(array(
            ':number' => $userTranslationNumber
        ));
    }

?>