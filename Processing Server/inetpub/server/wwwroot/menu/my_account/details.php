<?php

    $menuNumber = $_POST["menuNumber"];
    $type = json_decode($_POST["data"], true);

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();
    $data = null;

    if ($type == "nickname") {
        $data = array(
            "nickname" => $userInfo["nickname"]
        );
    }
    if ($type == "my_page_description") {
        $data = array(
            "description" => $userInfo["description"]
        );
    }
    if ($type == "gender") {
        $data = array(
            "gender" => $userInfo["gender"]
        );
    }
    if ($type == "birth_date") {
        $data = array(
            "year" => $userInfo["birth_year"],
            "month" => $userInfo["birth_month"],
            "day" => $userInfo["birth_day"]
        );
    }
    if ($type == "email") {
        $data = array(
            "email" => $userInfo["email"]
        );
    }
    if ($type == "password") {
        $stmt = $pdo->prepare("SELECT password FROM user WHERE number = :number");
        $stmt->execute(array(
            ':number' => $userInfo["number"]
        ));
        $password = $stmt->fetch();
        $isNoPassword = true;
        if (isset($password["password"])) {
            $isNoPassword = false;
        }
        $data = array(
            "isNoPassword" => $isNoPassword
        );
    }
    if ($type == "rigorous_access_procedures") {
        $data = array(
            "rigorousAccessProcedures" => $userInfo["rigorous_access_procedures"]
        );
    }
    if ($type == "two_factor_auth") {
        $isTwoFactorAuth = false;
        if ($userInfo["two_factor_auth_key"] != null) {
            $isTwoFactorAuth = true;
        }
        $data = array(
            "isTwoFactorAuth" => $isTwoFactorAuth
        );
    }

?>

<div class = "type" style = "display: none;"><?php echo $type; ?></div>
<div class = "previous_data" style = "display: none;"></div>
<div class = "data" style = "display: none;"><?php echo json_encode($data); ?></div>
<div class = "menu_title" style = "display: none;">...</div>

<div class = "menu_my_account_details">
    <div class = "menu_my_account_details_top">
        <div class = "menu_my_account_details_top_left">
            <div class = "menu_my_account_details_top_left_back md-ripples" onclick = "history.back();" onmouseenter = "hoverInformation(this, getLanguage('back'));">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"></rect><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"></rect></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"></rect></g></svg>
            </div>
            <div class = "menu_my_account_details_top_left_title">
                ...
            </div>
        </div>
        <div class = "menu_my_account_details_top_right">
            <div class = "menu_my_account_details_top_right_save md-ripples" onclick = "saveDataMyAccountDetails(<?php echo $menuNumber; ?>);">
                ...
            </div>
        </div>
    </div>
    <div class = "menu_my_account_details_line"></div>
    <div class = "menu_my_account_details_notice" style = "display: none;">
        <div class = "menu_my_account_details_notice_items">
            <!-- item -->
        </div>
    </div>
    <div class = "menu_my_account_details_items">
        <!-- item -->
    </div>
</div>