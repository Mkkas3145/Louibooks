<?php

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $numberList = $_POST["numbers"];

        $stmt = $pdo->prepare("SELECT number, content, search_date FROM search_history WHERE user_number = :user_number AND public_status = 0 AND number IN (" . $numberList . ") ORDER BY FIELD(number, " . $numberList . ")");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
        ));
        $history = $stmt->fetchAll();
        $history_length = count($history);

        $info = array();
        for ($i = 0; $i < $history_length; $i++) {
            $info[] = array(
                "number" => $history[$i]["number"],
                "content" => $history[$i]["content"],
                "search_date" => $history[$i]["search_date"],
            );
        }

        echo json_encode($info, JSON_UNESCAPED_UNICODE);
    } else {
        echo "not login";
    }

?>