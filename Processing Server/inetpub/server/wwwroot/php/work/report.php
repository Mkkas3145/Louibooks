<?php
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $workNumber = $_POST["workNumber"];
        $reason = $_POST["reason"];

        //이미 신고하였는지
        $stmt = $pdo->prepare("SELECT number FROM works_report WHERE work_number = :work_number AND user_number = :user_number");
        $stmt->execute(array(
            ':work_number' => $workNumber,
            ':user_number' => $userInfo["number"]
        ));
        $worksReport = $stmt->fetch();

        if (isset($worksReport["number"]) == false) {
            $sql = $pdo->prepare('insert into works_report (work_number, user_number, reason, date) values(:work_number, :user_number, :reason, :date)');
            $sql->execute(array(
                ':work_number' => $workNumber,
                ':reason' => $reason,
                ':user_number' => $userInfo["number"],
                ':date' => date("Y-m-d H:i:s")
            ));

            echo "submitted";
        } else {
            $sql = $pdo->prepare('UPDATE works_report SET reason = :reason WHERE number = :number');
            $sql->execute(array(
                ':reason' => $reason,
                ':number' => $worksReport["number"]
            ));

            echo "changed";
        }

    }

?>