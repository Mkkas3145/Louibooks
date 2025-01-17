<?php
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        //파트너 검토 요청 삭제
        $stmt = $pdo->prepare("DELETE FROM partner_approval WHERE user_number = :user_number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"]
        ));
        //파트너 프로그램 해제
        $sql = $pdo->prepare('UPDATE user SET partner = 0 WHERE number = :number');
        $sql->execute(array(
            ':number' => $userInfo["number"]
        ));
    }

?>