<?php

    @include_once('../../../../default_function.php');
    $myUserInfo = getMyLoginInfo();

    //권한 여부
    $isAdmin = $myUserInfo["admin"];
    if ($isAdmin != true) {
        echo "no permission";
        exit;
    }

    $userNumber = $_POST["userNumber"];
    $requestType = $_POST["request"];
    $isAccept = $_POST["isAccept"];
    $userInfo = getUserInfo($userNumber)[0];
    


    //크리에이터 자격이 있으면
    if ($userInfo["creator_permission"] == true) {
        if ($isAccept == false || $isAccept == "false") {
            //승인 거절 알림
            requestUserNotificationsPartnerApproval($myUserInfo["number"], $userInfo["number"], $requestType, 0);
        } else {
            $partner = null;
            if ($requestType == 0) {
                $partner = 1;
            } else if ($requestType == 1) {
                $partner = 2;
            }

            //승인 수락
            $sql = $pdo->prepare('UPDATE user SET partner = :partner WHERE number = :number');
            $sql->execute(array(
                ':number' => $userInfo["number"],
                ':partner' => $partner
            ));

            //알림
            requestUserNotificationsPartnerApproval($myUserInfo["number"], $userInfo["number"], $requestType, 1);
        }
    }
    


    //삭제
    $stmt = $pdo->prepare("DELETE FROM partner_approval WHERE user_number = :user_number");
    $stmt->execute(array(
        ':user_number' => $userNumber
    ));

?>