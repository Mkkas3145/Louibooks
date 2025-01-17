<?php

    @include_once('../../../../default_function.php');
    $userInfo = getMyLoginInfo();

    //권한 여부
    $isAdmin = $userInfo["admin"];
    if ($isAdmin != true) {
        echo "no permission";
        exit;
    }

    $questionsNumber = $_POST["questionsNumber"];
    $content = $_POST["content"];
    
    $stmt = $pdo->prepare("SELECT number, type, user_number, content, screenshot, date FROM questions WHERE number = :number");
    $stmt->execute(array(
        ":number" => $questionsNumber
    ));
    $questions = $stmt->fetch();

    if (isset($questions["number"])) {
        $stmt = $pdo->prepare("DELETE FROM questions WHERE number = :number");
        $stmt->execute(array(
            ':number' => $questionsNumber
        ));

        $screenshot = null;
        if (isset($questions["screenshot"])) {
            $screenshot = $questions["screenshot"];
        }

        $sql = $pdo->prepare('insert into reviewed_questions (user_number, type, content, screenshot, upload_date, reply_user_number, reply_content, reviewed_date) values(:user_number, :type, :content, :screenshot, :upload_date, :reply_user_number, :reply_content, :reviewed_date)');
        $sql->execute(array(
            ':user_number' => $questions["user_number"],
            ':type' => $questions["type"],
            ':content' => $questions["content"],
            ':screenshot' => $screenshot,
            ':upload_date' => $questions["date"],
            ':reply_user_number' => $userInfo["number"],
            ':reply_content' => $content,
            ':reviewed_date' => date("Y-m-d H:i:s")
        ));
        $lastInsertId = $pdo->lastInsertId();

        //사용자 알림
        $userNumbers = array($questions["user_number"]);
        requestUserNotificationsReviewedQuestions($lastInsertId, $userNumbers);
    } else {
        echo "does not exist";
    }

?>