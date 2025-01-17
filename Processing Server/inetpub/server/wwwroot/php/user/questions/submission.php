<?php
    
    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $type = $_POST["type"];
        $content = $_POST["content"];
        $language = $_POST["language"];
        $location = getLocation()["country"];
        $screenshot = null;
        if (isset($_POST["screenshot"])) {
            $screenshot = $_POST["screenshot"];
        }

        //해당 유저가 이미 문의를 제출하였는지
        $stmt = $pdo->prepare("SELECT user_number FROM questions WHERE user_number = :user_number");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
        ));
        $questions = $stmt->fetch();

        //디바이스 정보
        $deviceInfo = getDeviceInfo();

        //문의가 없다면 생성
        if (isset($questions["user_number"]) == false) {
            $sql = $pdo->prepare('insert into questions (type, user_number, content, screenshot, operating_system, program, language, location, date) values(:type, :user_number, :content, :screenshot, :operating_system, :program, :language, :location, :date)');
            $sql->execute(array(
                ':type' => $type,
                ':user_number' => $userInfo["number"],
                ':content' => $content,
                ':screenshot' => $screenshot,
                ':operating_system' => $deviceInfo["operatingSystem"],
                ':program' => $deviceInfo["program"],
                ':language' => $language,
                ':location' => $location,
                ':date' => date("Y-m-d H:i:s")
            ));
            echo "submitted";
        } else {
            //제출 변경
            $sql = $pdo->prepare('UPDATE questions SET type = :type, content = :content, screenshot = :screenshot, operating_system = :operating_system, program = :program, language = :language, location = :location WHERE user_number = :user_number');
            $sql->execute(array(
                ':type' => $type,
                ':user_number' => $userInfo["number"],
                ':content' => $content,
                ':screenshot' => $screenshot,
                ':operating_system' => $deviceInfo["operatingSystem"],
                ':program' => $deviceInfo["program"],
                ':language' => $language,
                ':location' => $location
            ));
            echo "changed";
        }
    }

?>