<?php

    //시간대 설정: UTC
    date_default_timezone_set("UTC");
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $workNumber = $_POST['workNumber'];
        $type = $_POST['type'];

        //작품
        $workType = null;
        $workInfo = getWorkInfo($workNumber)[0];
        if ($workInfo["status"] == 0) {
            $workType = $workInfo["type"];
            $workContentsType = $workInfo["contents_type"];

            if ($workInfo["user_number"] != $userInfo["number"]) {
                if ($type == 0) {
                    $stmt = $pdo->prepare("SELECT type FROM work_notifications_settings where user_number = :user_number AND work_number = :work_number");
                    $stmt->execute(array(
                        ':user_number' => $userInfo["number"],
                        ':work_number' => $workNumber
                    ));
                    $workNotifications = $stmt->fetch();

                    //데이터베이스에 있는지
                    if (isset($workNotifications["type"]) == true) {
                        $stmt = $pdo->prepare("DELETE FROM work_notifications_settings WHERE user_number = :user_number AND work_number = :work_number");
                        $stmt->execute(array(
                            ':user_number' => $userInfo["number"],
                            ':work_number' => $workNumber
                        ));

                        $sql = $pdo->prepare('UPDATE works SET notifications = notifications - 1 WHERE number = :number');
                        $sql->execute(array(
                            ':number' => $workNumber
                        ));
                    }
                } else {
                    $stmt = $pdo->prepare("SELECT type FROM work_notifications_settings where user_number = :user_number AND work_number = :work_number");
                    $stmt->execute(array(
                        ':user_number' => $userInfo["number"],
                        ':work_number' => $workNumber
                    ));
                    $workNotifications = $stmt->fetch();
        
                    //이미 데이터베이스에 있는지
                    if (isset($workNotifications["type"])) {
                        $sql = $pdo->prepare('UPDATE work_notifications_settings SET type = :type WHERE user_number = :user_number AND work_number = :work_number');
                        $sql->execute(array(
                            ':user_number' => $userInfo["number"],
                            ':work_number' => $workNumber,
                            ':type' => $type
                        ));
                    } else {
                        $sql = $pdo->prepare('insert into work_notifications_settings (user_number, work_number, work_type, contents_type, type) values(:user_number, :work_number, :work_type, :contents_type, :type)');
                        $sql->execute(array(
                            ':user_number' => $userInfo["number"],
                            ':work_number' => $workNumber,
                            ':work_type' => $workType,
                            ':contents_type' => $workContentsType,
                            ':type' => $type
                        ));

                        $sql = $pdo->prepare('UPDATE works SET notifications = notifications + 1 WHERE number = :number');
                        $sql->execute(array(
                            ':number' => $workNumber
                        ));
                    }
                }
            }
        } else if ($workInfo["status"] == 2) {
            //삭제된 작품이면 삭제한다
            $stmt = $pdo->prepare("DELETE FROM work_notifications_settings WHERE user_number = :user_number AND work_number = :work_number");
            $stmt->execute(array(
                ':user_number' => $userInfo["number"],
                ':work_number' => $workNumber
            ));
        }
    }

?>