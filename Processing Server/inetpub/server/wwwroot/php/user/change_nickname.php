<?php
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $nickname = cut_str($_POST['nickname'], 50);

        if ($nickname != "") {
            $stmt = $pdo->prepare("SELECT default_profile FROM user WHERE number = :number");
            $stmt->execute(array(
                ':number' => $userInfo["number"],
            ));
            $defaultProfile = json_decode($stmt->fetch()["default_profile"], true);
    
            $newDefaultProfile = array(
                'random_color' => $defaultProfile["random_color"],
                'first_letter' => mb_substr($nickname, 0, 1)
            );
    
            //수정
            $sql = $pdo->prepare('UPDATE user SET nickname = :nickname, default_profile = :default_profile WHERE number = :number');
            $sql->execute(array(
                ':number' => $userInfo["number"],
                ':nickname' => cut_str($nickname, 50),
                ':default_profile' => json_encode($newDefaultProfile)
            ));
        }
    }

?>