<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    //노출하지 마십시오.
    $originalKey = "XVKEoAXiju6leBcse8uVLx05JJqb5S1vOqD6QavKSupAtWd6rv";

    if ($userInfo["isLogin"] == true) {
        $category = null;
        if (isset($_POST["category"])) {
            $category = $_POST["category"];
        } else {
            $category = "episode"; //카테고리 값이 없으면 기본 값인 episode으(로)
        }
        if ($category != "prologue" && $category != "episode" && $category != "ending") {
            echo "incorrect value";
            exit;
        }

        //본인이 맞는지
        $stmt = $pdo->prepare("SELECT number, type, cover_image, default_cover_image, original_language, public_status FROM works where user_number = :user_number AND number = :number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':number' => $_POST["workNumber"],
        ));
        $work = $stmt->fetch();
        if (count($work) == 0) {
            echo 'not you';
            exit;
        }

        if ($work["type"] == "video") {
            //크리에이터 권한 및 애니메이터 체크
            if ($userInfo["creator_permission"] == false || $userInfo["animator"] == false) {
                echo "no permission";
                exit;
            }
        }

        $fileName = null;
        $chapterTitle = null;
        $title = null;
        $publicStatus = 2;
        $data = null;
        if ($work["type"] == "video") {
            if ($originalKey != $_POST["key"]) {
                echo "Private key mismatch.";
                exit;
            }
            
            $title = substr($_POST["fileName"], 0, strrpos($_POST["fileName"], "."));
            $fileName = $_POST["fileName"];

            //상태
            //0 = 처리 완료
            //1 = 처리 중
            //2 = 준비 중

            $data = json_encode(array(
                'status' => 2 //준비 중
            ));
        } else {
            //클라우드 데이터 가져오기
            $stmt = $pdo->prepare("SELECT data FROM cloud where user_number = :user_number AND number = :file_number");
            $stmt->execute(array(
                ':user_number' => $userInfo["number"],
                ':file_number' => $_POST["fileNumber"],
            ));
            $cloudInfo = $stmt->fetch();

            if (isset($cloudInfo["data"])) {
                $data = $cloudInfo["data"];
            } else {
                echo "No cloud files";
                exit;
            }

            $title = $_POST["title"];
            $publicStatus = $_POST["publicStatus"];
        }
        //챕터 제목
        if (isset($_POST["chapterTitle"])) {
            $chapterTitle = $_POST["chapterTitle"];
        }

        //챕터 구하기
        $isNewChapter = false;
        $chapter = null;
        if (isset($_POST["chapter"]) == false || $_POST["chapter"] == "latest_chapter") {
            $stmt = $pdo->prepare("SELECT MAX(chapter) FROM work_part where work_number = :work_number");
            $stmt->execute(array(
                ':work_number' => $_POST["workNumber"],
            ));
            $chapter = $stmt->fetch()[0];
            if ($chapter == null) {
                $chapter == 0;
            }
            if (isset($_POST["chapter"]) == false || $_POST["chapter"] != "latest_chapter") {
                $chapter ++;
                $isNewChapter = true;
            }
        } else {
            $chapter = $_POST["chapter"];
        }

        //새로운 챕터인데 챕터 제목이 정해지지 않았음
        if ($isNewChapter == true && $chapterTitle == null) {
            echo "Cannot create new chapters";
            exit;
        }

        //에피소드 구하기
        $episode = null;
        if ($category == "episode") {
            $stmt = $pdo->prepare("SELECT MAX(episode) FROM work_part where work_number = :work_number AND chapter = :chapter");
            $stmt->execute(array(
                ':work_number' => $_POST["workNumber"],
                ':chapter' => $chapter,
            ));
            $episode = $stmt->fetch()[0];
            if ($episode == null) {
                $episode == 0;
            }
            $episode ++;
        }

        //최신 회차 구하기
        $stmt = $pdo->prepare("SELECT MAX(chapter) FROM work_part WHERE user_number = :user_number AND work_number = :work_number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
            ':work_number' => $_POST["workNumber"],
        ));
        $latestChapter = $stmt->fetch()[0];

        //썸네일 구하기
        //현재 작품 표지 이미지
        $thumbnail_image = '';
        if ($work["cover_image"] == null) {
            $thumbnail_image = $work["default_cover_image"];
        } else {
            $thumbnail_image = $work["cover_image"];
        }

        if ($chapter == $latestChapter || $chapter == ($latestChapter + 1)) {
            $size = null;
            if ($work["type"] == "novel" || $work["type"] == "image_format") {
                $size = getCloudDataSize($data);
            }

            $sql = $pdo->prepare('insert into work_part (type, work_number, user_number, title, chapter, category, episode, data, upload_date, thumbnail_image, public_status, original_language, size) values(:type, :work_number, :user_number, :title, :chapter, :category, :episode, :data, :upload_date, :thumbnail_image, :public_status, :original_language, :size)');
            $sql->execute(array(
                ':type' => $work["type"],
                ':work_number' => $_POST["workNumber"],
                ':user_number' => $userInfo["number"],
                ':title' => cut_str($title, 100),
                ':chapter' => $chapter,
                ':category' => $category,
                ':episode' => $episode,
                ':data' => $data,
                ':upload_date' => date("Y-m-d H:i:s"),
                ':thumbnail_image' => $thumbnail_image,
                ':public_status' => $publicStatus,
                ':original_language' => $work["original_language"],
                ':size' => $size
            ));
            $lastInsertId = $pdo->lastInsertId();

            if ($latestChapter == null) {
                $latestChapter = 1;
            } else if ($chapter == ($latestChapter + 1)) {
                $latestChapter ++;
            }

            //챕터 수 조정
            $sql = $pdo->prepare('UPDATE works SET chapter = :chapter WHERE number = :number');
            $sql->execute(array(
                ':number' => $_POST["workNumber"],
                ':chapter' => $latestChapter
            ));

            //회차 수 올리기
            if ($publicStatus == 0) {
                $sql = $pdo->prepare('UPDATE works SET part = part + 1 WHERE number = :number');
                $sql->execute(array(
                    ':number' => $_POST["workNumber"]
                ));
            }

            //챕터 제목
            $stmt = $pdo->prepare("SELECT number FROM work_chapter WHERE work_number = :work_number AND chapter = :chapter");
            $stmt->execute(array(
                ':work_number' => $_POST["workNumber"],
                ':chapter' => $latestChapter,
            ));
            $chapterTitleNumber = $stmt->fetchAll();

            if ($chapterTitle != null) {
                $chapterTitle = $chapterTitle;
                if (count($chapterTitleNumber) == 0) {
                    $sql = $pdo->prepare('insert into work_chapter (work_number, chapter, title) values(:work_number, :chapter, :title)');
                    $sql->execute(array(
                        ':work_number' => $_POST["workNumber"],
                        ':chapter' => $latestChapter,
                        ':title' => cut_str($chapterTitle, 100)
                    ));
                } else {
                    $sql = $pdo->prepare('UPDATE work_chapter SET title = :title WHERE number = :number');
                    $sql->execute(array(
                        ':number' => $chapterTitleNumber[0]["number"],
                        ':title' => cut_str($chapterTitle, 100)
                    ));
                }
            }

            //완결 개수 올리기
            if ($publicStatus == 0) {
                if ($category == "ending") {
                    $sql = $pdo->prepare('UPDATE works SET ending = ending + 1 WHERE number = :number');
                    $sql->execute(array(
                        ':number' => $_POST["workNumber"],
                    ));
                }
            }

            //알림 보내기
            if ($publicStatus == 0 && $work["public_status"] != 2) {
                requestUserNotificationsPartPublic($lastInsertId);

                //이 이후로 더 이상 알림을 보내지 않음
                $sql = $pdo->prepare('UPDATE work_part SET send_notifications = true WHERE number = :number');
                $sql->execute(array(
                    ':number' => $lastInsertId
                ));
            }

            $info = getWorkPartInfo($lastInsertId)[0];
            if ($chapterTitle != null) {
                $info["chapter_title"] = $chapterTitle;
                $info["chapter"] = $chapter;
            }
            if ($fileName != null) {
                $info["file_name"] = $fileName;
            }
            echo json_encode($info);
        } else {
            echo 'not the latest chapter';
        }
    } else {
        echo "not login";
    }

?>