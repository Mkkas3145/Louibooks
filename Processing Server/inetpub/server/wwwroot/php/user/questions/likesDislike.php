<?php
    
    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $reviewedQuestionsNumber = $_POST["reviewedQuestionsNumber"];
        $type = $_POST["type"];

        //본인 확인
        $stmt = $pdo->prepare("SELECT user_number FROM reviewed_questions WHERE number = :number");
        $stmt->execute(array(
            ':number' => $reviewedQuestionsNumber
        ));
        $reviewedQuestions = $stmt->fetch();

        if ($reviewedQuestions["user_number"] == $userInfo["number"]) {
            if ($type == null || $type == "null") {
                $sql = $pdo->prepare('UPDATE reviewed_questions SET likes = false, dislike = false WHERE number = :number');
                $sql->execute(array(
                    ':number' => $reviewedQuestionsNumber
                ));
            } else if ($type == "likes") {
                $sql = $pdo->prepare('UPDATE reviewed_questions SET likes = true, dislike = false WHERE number = :number');
                $sql->execute(array(
                    ':number' => $reviewedQuestionsNumber
                ));
            } else if ($type == "dislike") {
                $sql = $pdo->prepare('UPDATE reviewed_questions SET likes = false, dislike = true WHERE number = :number');
                $sql->execute(array(
                    ':number' => $reviewedQuestionsNumber
                ));
            }
        }
    }

?>