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
        $stmt = $pdo->prepare("SELECT number, original_language FROM work_part WHERE user_number = :user_number AND number = :number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $partNumber,
        ));
        $partInfo = $stmt->fetch();

        if (isset($partInfo["number"])) {
            $stmt = $pdo->prepare("SELECT number FROM work_part_localization WHERE part_number = :part_number AND language = :language");
            $stmt->execute(array(
                ':part_number' => $partNumber,
                ':language' => $language,
            ));
            $partLocalization = $stmt->fetch();

            //있는지 체크
            if (isset($partLocalization["number"])) {

                //클라우드 데이터 가져오기
                $cloudInfo = null;
                $setDataSql = "";
                if (isset($_POST["fileNumber"])) {
                    $stmt = $pdo->prepare("SELECT data FROM cloud where user_number = :user_number AND number = :file_number");
                    $stmt->execute(array(
                        ':user_number' => $userInfo["number"],
                        ':file_number' => $_POST["fileNumber"],
                    ));
                    $cloudInfo = $stmt->fetch();
                    $setDataSql = ", data = :data, size = :size";
                }

                $sql = $pdo->prepare('UPDATE work_part_localization SET thumbnail_image = :thumbnail_image, title = :title, language = :language' . $setDataSql . ' WHERE part_number = :part_number AND language = :language');
                $data = array(
                    ':part_number' => $partNumber,
                    ':language' => $language,
                    ':thumbnail_image' => $thumbnailImage,
                    ':title' => cut_str($title, 100)
                );
                if ($cloudInfo != null) {
                    $cloudData = $cloudInfo["data"];
                    $data[":data"] = $cloudData;
                    $data[":size"] = getCloudDataSize($cloudData);
                }
                $sql->execute($data);

                echo "success";
            } else {
                echo "already created";
            }
        } else {
            echo "invalid request";
        }
    }

?>