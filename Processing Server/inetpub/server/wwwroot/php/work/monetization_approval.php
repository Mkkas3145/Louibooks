<?php
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $workNumber = $_POST["workNumber"];

        //크리에이터 가이드 검토 여부
        $isCreatorGuideReview = false;
        if ($userInfo["workspace"]["countWorks"] > 0) {
            $isCreatorGuideReview = true;
        }

        //필요한 정보
        $stmt = $pdo->prepare("SELECT remittance_info FROM user WHERE number = :number");
        $stmt->execute(array(
            "number" => $userInfo["number"]
        ));
        $user = $stmt->fetch();
        $remittanceInfo = null;
        if (isset($user["remittance_info"])) {
            $remittanceInfo = json_decode($user["remittance_info"], true);
        }

        if ($remittanceInfo == null || $isCreatorGuideReview == false) {
            echo "condition not met";
            exit;
        }

        //이미 요청하였는지
        $stmt = $pdo->prepare("SELECT work_number FROM monetization_approval WHERE work_number = :work_number");
        $stmt->execute(array(
            ':work_number' => $workNumber
        ));
        $monetizationApproval = $stmt->fetch();

        if (isset($monetizationApproval["work_number"]) == false) {
            //작품 정보 구하기
            $stmt = $pdo->prepare("SELECT type, contents_type, original_language, user_number, monetization FROM works WHERE number = :number");
            $stmt->execute(array(
                ':number' => $workNumber
            ));
            $works = $stmt->fetch();

            //본인 확인 또는 이미 수익 창출 상태인지
            if ($works["user_number"] == $userInfo["number"] && $works["monetization"] == 0) {
                $sql = $pdo->prepare('insert into monetization_approval (work_number, work_type, contents_type, language, date) values(:work_number, :work_type, :contents_type, :language, :date)');
                $sql->execute(array(
                    ':work_number' => $workNumber,
                    ':work_type' => $works["type"],
                    ':contents_type' => $works["contents_type"],
                    ':language' => $works["original_language"],
                    ':date' => date("Y-m-d H:i:s")
                ));
            }
        }
    }

?>