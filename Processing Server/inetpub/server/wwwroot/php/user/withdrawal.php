<?php
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $userNumber = $_POST["userNumber"];

        if ($userNumber == $userInfo["number"]) {
            $stmt = $pdo->prepare("SELECT password, salt FROM user WHERE number = :number");
            $stmt->execute(array(
                ':number' => $userNumber
            ));
            $user = $stmt->fetch();
            
            if (isset($user["password"])) {
                $salt = $user["salt"];
                $password = base64_encode(hash('sha512', $salt . $_POST["password"], true));
                for ($i2 = 0; $i2 < 10000; $i2++) {
                    $password = base64_encode(hash('sha512', $password, true));
                }
                if ($password == $user["password"]) {
                    requestUserNotificationsUserWithdrawal($userNumber);

                    echo "success";
                } else {
                    echo "password don't match";
                }
            } else {
                echo "no password";
            }
        } else {
            echo "login info don't match";
            exit;
        }
    }

?>