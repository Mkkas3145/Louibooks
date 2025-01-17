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
        //권한 여부
        $stmt = $pdo->prepare("SELECT number, type, work_number, original_language, localization_language FROM work_part WHERE user_number = :user_number AND number = :number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $partNumber,
        ));
        $partInfo = $stmt->fetch();

        if (isset($partInfo["number"]) && $partInfo["original_language"] != $language) {
            $stmt = $pdo->prepare("SELECT number FROM work_part_localization WHERE part_number = :part_number AND language = :language");
            $stmt->execute(array(
                ':part_number' => $partNumber,
                ':language' => $language,
            ));
            $partLocalization = $stmt->fetch();

            //중복 체크
            if (isset($partLocalization["number"]) == false) {

                //클라우드 데이터 가져오기
                $data = null;
                if ($partInfo["type"] != "video") {
                    //파일 번호가 없는지
                    if (isset($_POST["fileNumber"])) {
                        echo "No cloud files";
                        exit;
                    }

                    $stmt = $pdo->prepare("SELECT data FROM cloud where user_number = :user_number AND number = :file_number");
                    $stmt->execute(array(
                        ':user_number' => $userInfo["number"],
                        ':file_number' => $_POST["fileNumber"]
                    ));
                    $cloudInfo = $stmt->fetch();

                    //데이터가 있는지
                    if (isset($cloudInfo["data"])) {
                        $data = $cloudInfo["data"];
                    } else {
                        echo "No cloud files";
                        exit;
                    }
                }

                $sql = $pdo->prepare('insert into work_part_localization (work_number, part_number, language, thumbnail_image, title, data, size) values(:work_number, :part_number, :language, :thumbnail_image, :title, :data, :size)');
                $sql->execute(array(
                    ':work_number' => $partInfo["work_number"],
                    ':part_number' => $partNumber,
                    ':language' => $language,
                    ':thumbnail_image' => $thumbnailImage,
                    ':title' => cut_str($title, 100),
                    ':data' => $data,
                    ':size' => getCloudDataSize($data)
                ));

                //회차 지원 언어에 추가
                $localizationLanguage = array();
                if (isset($partInfo["localization_language"])) {
                    $localizationLanguage = explode(",", $partInfo["localization_language"]);
                }
                $localizationLanguage[] = $language;

                $sql = $pdo->prepare('UPDATE work_part SET localization_language = :localization_language WHERE number = :number');
                $sql->execute(array(
                    ':number' => $partNumber,
                    ':localization_language' => implode(",", $localizationLanguage)
                ));

                echo "success";
            } else {
                echo "already created";
            }
        } else {
            echo "invalid request";
        }
    }

?>