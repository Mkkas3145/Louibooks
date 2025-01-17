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
    $reason = $_POST["reason"];
    $workInfo = getWorkInfo($workNumber)[0];
    
    //작품이 공개 상태이면
    if ($workInfo["status"] == 0) {
        //처벌
        if ($reason != -1) {
            //경고 누적하기
            if ($reason != 3) {
                $sql = $pdo->prepare('insert into creator_violation (user_number, work_number, reason, date) values(:user_number, :work_number, :reason, :date)');
                $sql->execute(array(
                    ':user_number' => $workInfo["user_number"],
                    ':work_number' => $workNumber,
                    ':reason' => $reason,
                    ':date' => date("Y-m-d H:i:s")
                ));
            }

            //영구적으로 크리에이터 자격 박탈 여부
            $creatorPermission = true;
            if ($reason == 3) {
                //파트너 위반
                $creatorPermission = false;
            }

            //1년 이상된 데이터 삭제
            $stmt = $pdo->prepare("DELETE FROM creator_violation WHERE date < :date");
            $stmt->execute(array(
                ':date' => date("Y-m-d H:i:s", strtotime("-365 Day"))
            ));
            //경고 횟수 구하기
            $stmt = $pdo->prepare("SELECT COUNT(user_number) FROM creator_violation WHERE user_number = :user_number");
            $stmt->execute(array(
                ':user_number' => $workInfo["user_number"]
            ));
            $creatorViolation = $stmt->fetch()["COUNT(user_number)"];
            if ($creatorViolation >= 3) {
                //경고 3회 누적
                $creatorPermission = false;
            }

            //크리에이터 번호 구하기
            $stmt = $pdo->prepare("SELECT user_number FROM works where number = :number");
            $stmt->execute(array(
                ':number' => $workNumber
            ));
            $userNumber = $stmt->fetch()["user_number"];

            //크리에이터 자격 박탈
            if ($creatorPermission == false) {
                //크리에이터 자격 박탈, 파트너 자격 박탈
                $sql = $pdo->prepare('UPDATE user SET creator_permission = 0, partner = 0 WHERE number = :number');
                $sql->execute(array(
                    ':number' => $userNumber
                ));
                $stmt = $pdo->prepare("DELETE FROM partner_approval WHERE user_number = :user_number");
                $stmt->execute(array(
                    ':user_number' => $userNumber
                ));

                //경고 기록 삭제
                $stmt = $pdo->prepare("DELETE FROM creator_violation WHERE user_number = :user_number");
                $stmt->execute(array(
                    ':user_number' => $userNumber
                ));

                //모든 작품 삭제
                $stmt = $pdo->prepare("SELECT number FROM works where user_number = :user_number");
                $stmt->execute(array(
                    ':user_number' => $userNumber
                ));
                $works = $stmt->fetchAll();
                $works_length = count($works);
                for ($i = 0; $i < $works_length; $i++) {
                    deleteWork($works[$i]["number"]);
                }
            } else {
                //수익 창출 중지, 일주일 동안 비공개 전환
                $sql = $pdo->prepare('UPDATE works SET monetization = 0, revenue = 0, revenue_views = 0, monetization_date = NULL, creator_violation_date = :creator_violation_date WHERE number = :number');
                $sql->execute(array(
                    ':number' => $workNumber,
                    ':creator_violation_date' => date("Y-m-d H:i:s")
                ));

                //파트너 자격 박탈
                $sql = $pdo->prepare('UPDATE user SET partner = 0 WHERE number = :number');
                $sql->execute(array(
                    ':number' => $userNumber
                ));
                $stmt = $pdo->prepare("DELETE FROM partner_approval WHERE user_number = :user_number");
                $stmt->execute(array(
                    ':user_number' => $userNumber
                ));

                //작품 캐시 삭제
                $stmt = $pdo->prepare("DELETE FROM works_cache WHERE work_number = :work_number");
                $stmt->execute(array(
                    ':work_number' => $workNumber
                ));
            }

            if ($creatorPermission == true) {
                $creatorPermission = "true";
            } else {
                $creatorPermission = "false";
            }
            
            //박탈 알림
            $senderNumber = $userInfo["number"];
            $userNumbers = array($userNumber);
            requestUserNotificationsCreatorGuideViolation($senderNumber, $workNumber, $reason, $creatorPermission, $userNumbers);
        }
    }
    


    //신고 내용 삭제
    $stmt = $pdo->prepare("DELETE FROM works_report WHERE work_number = :work_number");
    $stmt->execute(array(
        ':work_number' => $workNumber
    ));

?>