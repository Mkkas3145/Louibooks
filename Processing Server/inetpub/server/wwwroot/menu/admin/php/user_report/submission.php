<?php

    @include_once('../../../../default_function.php');
    $userInfo = getMyLoginInfo();

    //권한 여부
    $isAdmin = $userInfo["admin"];
    if ($isAdmin != true) {
        echo "no permission";
        exit;
    }

    $type = $_POST["type"];
    $uniqueNumber = $_POST["uniqueNumber"];
    $reason = $_POST["reason"];

    //이미 검토된 사항인지
    $stmt = $pdo->prepare("SELECT unique_number FROM user_report WHERE type = :type AND unique_number = :unique_number LIMIT 1");
    $stmt->execute(array(
        'type' => $type,
        ':unique_number' => $uniqueNumber
    ));
    $userReport = $stmt->fetchAll();
    //이미 검토된 사항인지
    $stmt = $pdo->prepare("SELECT unique_number FROM user_report_reviewed WHERE type = :type AND unique_number = :unique_number");
    $stmt->execute(array(
        'type' => $type,
        ':unique_number' => $uniqueNumber
    ));
    $reviewed = $stmt->fetch();

    if (isset($reviewed["unique_number"]) || count($userReport) == 0) {
        echo "already reviewed";
        exit;
    }
    
    $userNumber = null;
    $content = null;
    if ($type == 0) {
        $commentsInfo = @getCommentsInfo($uniqueNumber)[0];
        $userNumber = @$commentsInfo["user_number"];
        $content = @$commentsInfo["content"];
    } else if ($type == 1) {
        $ratingsInfo = @getRatingsInfo($uniqueNumber)[0];
        $userNumber = @$ratingsInfo["user_number"];
        $content = @$ratingsInfo["content"];
    } else if ($type == 2) {
        $communityInfo = @getCommunityInfo($uniqueNumber)[0];
        $userNumber = @$communityInfo["user_number"];
        $content = @json_decode($communityInfo["content"], true)["texts"];
    }



    if ($userNumber != null) {
        //해당 없음
        if ($reason == -1) {
            $sql = $pdo->prepare('insert into user_report_reviewed (type, unique_number, date) values(:type, :unique_number, :date)');
            $sql->execute(array(
                ':type' => $type,
                ':unique_number' => $uniqueNumber,
                ':date' => date("Y-m-d H:i:s")
            ));
        } else {
            $sql = $pdo->prepare('UPDATE user SET community_permission = 0 WHERE number = :number');
            $sql->execute(array(
                ':number' => $userNumber
            ));
            
            //커뮤니티 자격 박탈 알림
            $userNumbers = array($userNumber);
            requestUserNotificationsCommunityGuideViolation($userInfo["number"], $type, $reason, $content, $userNumbers);
        }
    }
    


    //신고 내용 삭제
    $stmt = $pdo->prepare("DELETE FROM user_report WHERE type = :type AND unique_number = :unique_number");
    $stmt->execute(array(
        ':type' => $type,
        ':unique_number' => $uniqueNumber
    ));

?>