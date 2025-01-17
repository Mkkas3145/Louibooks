<?php

    include_once('../../../../../default_function.php');
    $userInfo = getMyLoginInfo();

    $workNumber = $_POST["workNumber"];
    $language = $_POST["language"];
    $coverImage = null;
    if (isset($_POST["coverImage"])) {
        $coverImage = $_POST["coverImage"];
    }
    $title = $_POST["title"];
    $description = $_POST["description"];
    $tag = null;
    if (isset($_POST["tag"])) {
        //특수문자 제거
        $tag = $preg = preg_replace('/[0-9\@\.\;\" "]+/', '', $_POST["tag"]);
    }
    
    if ($userInfo["isLogin"] == true) {
        //권한 여부
        $stmt = $pdo->prepare("SELECT number, original_language, localization_language, chapter FROM works WHERE user_number = :user_number AND number = :number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $workNumber,
        ));
        $work = $stmt->fetch();

        if (isset($work["number"]) && $work["original_language"] != $language) {
            $stmt = $pdo->prepare("SELECT number FROM work_localization WHERE work_number = :work_number AND language = :language");
            $stmt->execute(array(
                ':work_number' => $workNumber,
                ':language' => $language,
            ));
            $workLocalization = $stmt->fetch();

            //중복 체크
            if (isset($workLocalization["number"]) == false) {
                $sql = $pdo->prepare('insert into work_localization (work_number, language, cover_image, title, description, tag) values(:work_number, :language, :cover_image, :title, :description, :tag)');
                $sql->execute(array(
                    ':work_number' => $_POST["workNumber"],
                    ':language' => $language,
                    ':cover_image' => $coverImage,
                    ':title' => cut_str($title, 100),
                    ':description' => cut_str($description, 500),
                    ':tag' => $tag
                ));

                //챕터 제목
                $stmt = $pdo->prepare("DELETE FROM work_chapter WHERE work_number = :work_number AND language = :language");
                $stmt->execute(array(
                    ':work_number' => $workNumber,
                    ':language' => $language,
                ));
                if (isset($_POST["chapterTitle"])) {
                    //
                    $chapterTitle = json_decode($_POST["chapterTitle"], true);
                    $chapterTitle_length = count($chapterTitle);

                    //MYSQL
                    $sql = $pdo->prepare('insert into work_chapter (work_number, language, chapter, title) values(:work_number, :language, :chapter, :title)');
                    
                    for ($i = 0; $i < $chapterTitle_length; $i++) {
                        if ($work["chapter"] >= $chapterTitle[$i]["chapter"]) {
                            $sql->execute(array(
                                ':work_number' => $workNumber,
                                ':language' => $language,
                                ':title' => cut_str($chapterTitle[$i]["title"], 100),
                                ':chapter' => $chapterTitle[$i]["chapter"]
                            ));
                        }
                    }
                }

                //지원 언어에 추가
                $localizationLanguage = array();
                if (isset($work["localization_language"])) {
                    $localizationLanguage = explode(",", $work["localization_language"]);
                }
                $localizationLanguage[] = $language;

                $sql = $pdo->prepare('UPDATE works SET localization_language = :localization_language WHERE number = :number');
                $sql->execute(array(
                    ':number' => $workNumber,
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