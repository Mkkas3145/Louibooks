<?php
    
    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $type = $_POST["type"];
        $url = $_POST["url"];
        $resize = $_POST["resize"];
        $translateY = $_POST["translateY"];
        $translateX = $_POST["translateX"];
        $width = $_POST["width"];
        $height = $_POST["height"];
        $info = array(
            "type" => $type,
            "url" => $url,
            "resize" => $resize,
            "translateY" => $translateY,
            "translateX" => $translateX,
            "width" => $width,
            "height" => $height
        );
        if (isset($_POST["thumbnail"])) {
            $info["thumbnail"] = $_POST["thumbnail"];
        }
        $sql = $pdo->prepare("UPDATE user SET profile = :profile WHERE number = :number");
        $sql->execute(array(
            ':number' => $userInfo["number"],
            ':profile' => json_encode($info)
        ));
    }

?>