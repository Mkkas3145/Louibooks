<?php

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == true) {
        $sort = $_POST["sort"];

        $orderBy = "";
        if ($sort == 0) {
            $orderBy = " ORDER BY number DESC";
        }

        $stmt = $pdo->prepare("SELECT number, content, search_date FROM search_history WHERE user_number = :user_number AND public_status = 0" . $orderBy);
        $stmt->execute(array(
            ':user_number' => $userInfo["number"],
        ));
        $history = $stmt->fetchAll();
        $history_length = count($history);

        $numbers = array();
        $info = array();
        for ($i = 0; $i < $history_length; $i++) {
            $numbers[] = $history[$i]["number"];
            if (count($info) < 30) {
                $info[] = array(
                    "number" => $history[$i]["number"],
                    "content" => $history[$i]["content"],
                    "search_date" => $history[$i]["search_date"],
                );
            }
        }

        $result = array(
            'numbers' => implode(",", $numbers),
            'info' => $info,
            "searchHistoryUse" => $userInfo["search_history_use"],
        );

        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    } else {
        echo "not login";
    }

?>