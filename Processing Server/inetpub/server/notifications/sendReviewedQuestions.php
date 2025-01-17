<?php

    include_once('default_function.php');

    if (isset($_POST["key"]) && $_POST["key"] == $originalKey) {
        $reviewedQuestionsNumber = $_POST["reviewedQuestionsNumber"];
        $userNumbers = explode(",", $_POST["userNumbers"]);
        $type = 4;

        //정보 구하기
        $stmt = $pdo->prepare("SELECT reply_user_number, reply_content FROM reviewed_questions WHERE number = :number");
        $stmt->execute(array(
            ':number' => $reviewedQuestionsNumber
        ));
        $reviewedQuestionsInfo = $stmt->fetch();

        if (isset($reviewedQuestionsInfo)) {
            $senderNumber = $reviewedQuestionsInfo["reply_user_number"];
    
            $data = array(
                "senderNumber" => (int) $senderNumber,
                "reviewedQuestionsNumber" => (int) $reviewedQuestionsNumber
            );
        
            sendUserNotifications($userNumbers, $type, $data);
                        










            //---------- 푸시 알림 ----------




            





            //사용자 정보
            $content = $reviewedQuestionsInfo["reply_content"];
            $clickURL = "https://louibooks.com/reviewed_questions/" . $reviewedQuestionsNumber;

            $info = array(
                "content" => $content,
                "clickURL" => $clickURL
            );

            sendUserPushNotifications($userNumbers, $type, $info);
        }
    }

?>