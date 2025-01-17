<?php

    include_once('../../../../../default_function.php');
    $userInfo = getMyLoginInfo();

    $workNumber = $_POST["workNumber"];
    $language = $_POST["language"];
    
    if ($userInfo["isLogin"] == true) {
        //권한 여부
        $stmt = $pdo->prepare("SELECT number FROM works WHERE user_number = :user_number AND number = :number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $workNumber,
        ));
        $work = $stmt->fetch();

        if (isset($work["number"])) {
            $stmt = $pdo->prepare("DELETE FROM work_localization WHERE work_number = :work_number AND language = :language");
            $stmt->execute(array(
                ':work_number' => $workNumber,
                ':language' => $language,
            ));

            //챕터 현지화
            $stmt = $pdo->prepare("DELETE FROM work_chapter WHERE work_number = :work_number AND language = :language");
            $stmt->execute(array(
                ':work_number' => $workNumber,
                ':language' => $language,
            ));

            //지원 언어에서 제거
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

            $sql = $pdo->prepare('UPDATE works SET localization_language = :localization_language WHERE number = :number');
            $sql->execute(array(
                ':number' => $workNumber,
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