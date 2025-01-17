<?php
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $language = $_POST["language"];

        //크리에이터 자격이 없을 경우
        if ($userInfo["creator_permission"] == false) {
            echo "no permission";
            exit;
        }

        //이미 파트너 플러스인지
        if ($userInfo["partner"] == 2) {
            echo "you partner plus";
            exit;
        }

        //이미 요청하였는지
        $stmt = $pdo->prepare("SELECT request FROM partner_approval WHERE user_number = :user_number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"]
        ));
        $partnerApproval = $stmt->fetch();
        if (isset($partnerApproval["request"])) {
            echo "already requested";
            exit;
        }

        //조건을 충족하는지
        $stmt = $pdo->prepare("SELECT number FROM works WHERE user_number = :user_number AND monetization = 1 LIMIT 1");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"]
        ));
        $monetizationWorks = $stmt->fetch();
        if (isset($monetizationWorks["number"]) == false) {
            echo "condition not met";
            exit;
        }

        //파트너가 아니면
        if ($userInfo["partner"] == 0) {
            $sql = $pdo->prepare('insert into partner_approval (user_number, request, language, date) values(:user_number, :request, :language, :date)');
            $sql->execute(array(
                ':user_number' => $userInfo["number"],
                ':request' => 0,
                ':language' => $language,
                ':date' => date("Y-m-d H:i:s")
            ));
            echo "request 0";
        }
        //파트너이면 파트너 플러스 요청
        if ($userInfo["partner"] == 1) {
            $sql = $pdo->prepare('insert into partner_approval (user_number, request, language, date) values(:user_number, :request, :language, :date)');
            $sql->execute(array(
                ':user_number' => $userInfo["number"],
                ':request' => 1,
                ':language' => $language,
                ':date' => date("Y-m-d H:i:s")
            ));
            echo "request 1";
        }
    }

?>