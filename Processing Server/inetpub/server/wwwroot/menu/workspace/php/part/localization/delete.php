<?php

    include_once('../../../../../default_function.php');
    $userInfo = getMyLoginInfo();

    $partNumber = $_POST["partNumber"];
    $language = $_POST["language"];
    
    if ($userInfo["isLogin"] == true) {
        //권한 여부
        $stmt = $pdo->prepare("SELECT number, original_language, localization_language FROM work_part WHERE user_number = :user_number AND number = :number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $partNumber,
        ));
        $partInfo = $stmt->fetch();

        if (isset($partInfo["number"])) {
            $stmt = $pdo->prepare("DELETE FROM work_part_localization WHERE part_number = :part_number AND language = :language");
            $stmt->execute(array(
                ':part_number' => $partNumber,
                ':language' => $language,
            ));

            //회차 지원 언어에서 제거
            $localizationLanguage = null;
            if (isset($partInfo["localization_language"])) {
                $array = explode(",", $partInfo["localization_language"]);
                $array_length = count($array);
                $newLocalizationLanguage = array();

                for ($i = 0; $i < $array_length; $i++) {
                    if ($array[$i] != $language) {
                        $newLocalizationLanguage[] = $array[$i];
                    }
                }

                if (count($newLocalizationLanguage) != 0) {
                    $localizationLanguage = implode(",", $newLocalizationLanguage);
                }
            }

            $sql = $pdo->prepare('UPDATE work_part SET localization_language = :localization_language WHERE number = :number');
            $sql->execute(array(
                ':number' => $partNumber,
                ':localization_language' => $localizationLanguage
            ));

            echo "success";
        } else {
            echo "no permission";
        }
    } else {
        echo "no permission";
    }

?>