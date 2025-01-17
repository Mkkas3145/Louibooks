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
        $stmt = $pdo->prepare("SELECT user_number FROM work_part_user_translation WHERE number = :number");
        $stmt->execute(array(
            ':number' => $userTranslationNumber
        ));
        $userTranslation = $stmt->fetch();

        //알림
        requestUserNotificationsUserTranslation($userInfo["number"], $userTranslation["user_number"], $partNumber, 1);

        //삭제
        $stmt = $pdo->prepare("DELETE FROM work_part_user_translation WHERE number = :number");
        $stmt->execute(array(
            ':number' => $userTranslationNumber
        ));

        echo "deleted";
    }

?>