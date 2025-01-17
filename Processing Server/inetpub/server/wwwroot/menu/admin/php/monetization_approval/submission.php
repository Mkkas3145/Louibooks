<?php

    @include_once('../../../../default_function.php');
    $userInfo = getMyLoginInfo();

    //권한 여부
    $isAdmin = $userInfo["admin"];
    if ($isAdmin != true) {
        echo "no permission";
        exit;
    }

    $workNumber = $_POST["workNumber"];
    $isAccept = $_POST["isAccept"];
    $workInfo = getWorkInfo($workNumber)[0];
    


    //작품이 공개 상태이면
    if ($workInfo["status"] == 0) {
        if ($isAccept == false || $isAccept == "false") {
            //승인 거절
            requestUserNotificationsMonetizationApproval($userInfo["number"], $workNumber, 0);
        } else {
            //이미 수익 창출이 승인이 되어 있는 경우
            $stmt = $pdo->prepare("SELECT monetization FROM works where number = :number");
            $stmt->execute(array(
                ':number' => $workNumber
            ));
            $works = $stmt->fetch();

            if (isset($works["monetization"]) && $works["monetization"] == 0) {
                //승인 수락
                $sql = $pdo->prepare('UPDATE works SET monetization = 1, monetization_date = :monetization_date WHERE number = :number');
                $sql->execute(array(
                    ':number' => $workNumber,
                    ':monetization_date' => date("Y-m-d H:i:s")
                ));

                requestUserNotificationsMonetizationApproval($userInfo["number"], $workNumber, 1);
            }
        }
    }
    


    //삭제
    $stmt = $pdo->prepare("DELETE FROM monetization_approval WHERE work_number = :work_number");
    $stmt->execute(array(
        ':work_number' => $workNumber
    ));

?>