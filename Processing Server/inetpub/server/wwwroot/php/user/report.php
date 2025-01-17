<?php
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $type = $_POST["type"];
        $uniqueNumber = $_POST["uniqueNumber"];
        $reason = $_POST["reason"];
        $language = $_POST["language"];

        //이미 검토된 사항인지
        $stmt = $pdo->prepare("SELECT unique_number FROM user_report_reviewed WHERE type = :type AND unique_number = :unique_number");
        $stmt->execute(array(
            'type' => $type,
            ':unique_number' => $uniqueNumber
        ));
        $reviewed = $stmt->fetch();
        if (isset($reviewed["unique_number"])) {
            echo "already reviewed";
            exit;
        }

        //이미 신고하였는지
        $stmt = $pdo->prepare("SELECT number FROM user_report WHERE type = :type AND unique_number = :unique_number AND user_number = :user_number");
        $stmt->execute(array(
            ':type' => $type,
            ':unique_number' => $uniqueNumber,
            ':user_number' => $userInfo["number"]
        ));
        $userReport = $stmt->fetch();

        if (isset($userReport["number"]) == false) {
            $sql = $pdo->prepare('insert into user_report (type, unique_number, user_number, reason, language, date) values(:type, :unique_number, :user_number, :reason, :language, :date)');
            $sql->execute(array(
                ':type' => $type,
                ':unique_number' => $uniqueNumber,
                ':reason' => $reason,
                ':language' => $language,
                ':user_number' => $userInfo["number"],
                ':date' => date("Y-m-d H:i:s")
            ));

            echo "submitted";
        } else {
            $sql = $pdo->prepare('UPDATE user_report SET reason = :reason, language = :language WHERE number = :number');
            $sql->execute(array(
                ':reason' => $reason,
                ':language' => $language,
                ':number' => $userReport["number"]
            ));

            echo "changed";
        }

    }

?>