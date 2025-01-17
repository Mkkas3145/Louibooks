<?php

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $stmt = $pdo->prepare("SELECT content, search_date FROM search_history WHERE user_number = :user_number AND public_status = 0 ORDER BY number DESC LIMIT 1000");
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
        ));
        $history = $stmt->fetchAll();
        $history_length = count($history);
        
        $texts = array();
        for ($i = ($history_length - 1); $i >= 0; $i--) {
            $texts[] = array(
                "content" => $history[$i]["content"],
                "search_date" => $history[$i]["search_date"],
            );
        }

        echo json_encode($texts, JSON_UNESCAPED_UNICODE);
    } else {
        echo "not login";
    }

?>