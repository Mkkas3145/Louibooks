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
        $stmt = $pdo->prepare("SELECT number, chapter FROM works WHERE user_number = :user_number AND number = :number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $workNumber,
        ));
        $work = $stmt->fetch();

        if (isset($work["number"])) {
            $stmt = $pdo->prepare("SELECT number FROM work_localization WHERE work_number = :work_number AND language = :language");
            $stmt->execute(array(
                ':work_number' => $workNumber,
                ':language' => $language,
            ));
            $workLocalization = $stmt->fetch();

            //있는지 체크
            if (isset($workLocalization["number"])) {
                $sql = $pdo->prepare('UPDATE work_localization SET cover_image = :cover_image, title = :title, description = :description, tag = :tag WHERE work_number = :work_number AND language = :language');
                $sql->execute(array(
                    ':work_number' => $workNumber,
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

                echo "success";
            } else {
                echo "does not exist";
            }
        } else {
            echo "invalid request";
        }
    }

?>