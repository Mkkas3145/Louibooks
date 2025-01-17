<?php
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $sql = $pdo->prepare("UPDATE user SET profile = :profile WHERE number = :number");
        $sql->execute(array(
            ':number' => $userInfo["number"],
            ':profile' => null
        ));
    }

?>