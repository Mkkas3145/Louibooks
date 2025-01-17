<?php

    include_once('../default_function.php');
    $menuNumber = $_POST["menuNumber"];

    $userInfo = array();
    //- Mkkas3145 (장범룡)
    $user = getUserInfo("8,16,38,65,79,108");
    $userInfo[] = array(
        "type" => 0,
        "number" => $user[0]["number"],
        "nickname" => $user[0]["nickname"],
        "realname" => "장범룡",
        "profile" => $user[0]["profile"]
    );
    //- MTtankkeo (장천룡)
    $userInfo[] = array(
        "type" => 0,
        "number" => $user[1]["number"],
        "nickname" => $user[1]["nickname"],
        "realname" => "장천룡",
        "profile" => $user[1]["profile"]
    );
    //- 차호련
    $userInfo[] = array(
        "type" => 0,
        "number" => $user[2]["number"],
        "nickname" => $user[2]["nickname"],
        "realname" => "차호련",
        "profile" => $user[2]["profile"]
    );
    //- 다트
    $userInfo[] = array(
        "type" => 1,
        "number" => $user[3]["number"],
        "nickname" => $user[3]["nickname"],
        "realname" => "오준희",
        "profile" => $user[3]["profile"]
    );
    //- 단설
    $userInfo[] = array(
        "type" => 1,
        "number" => $user[4]["number"],
        "nickname" => $user[4]["nickname"],
        "realname" => "루이쨩",
        "profile" => $user[4]["profile"]
    );
    //- 김지은
    $userInfo[] = array(
        "type" => 1,
        "number" => $user[5]["number"],
        "nickname" => $user[5]["nickname"],
        "realname" => "이하연",
        "profile" => $user[5]["profile"]
    );
    
?>

<div class = "user_info" style = "display: none;">
    <?php echo json_encode($userInfo); ?>
</div>

<div class = "menu_privacy_policy">
    <div class = "menu_privacy_policy_banner img_wrap">
        <img src = "/IMG/privacy_policy.webp?v=2" onload = "imageLoad(event);" alt = "">
    </div>
    <div class = "menu_privacy_policy_title">
        ...
    </div>
    <div class = "menu_privacy_policy_description">
        ...
    </div>
    <div class = "menu_privacy_policy_line"></div>
    <div class = "menu_privacy_policy_items">
        <div class = "menu_privacy_policy_item">
            <div class = "menu_privacy_policy_item_top">
                <div class = "menu_privacy_policy_item_top_left">
                    1
                </div>
                <div class = "menu_privacy_policy_item_top_right">
                    ...
                </div>
            </div>
            <div class = "menu_privacy_policy_item_contents">
                <div class = "menu_privacy_policy_item_contents_title">
                    ...
                </div>
                <div class = "menu_privacy_policy_item_contents_description">
                    ...
                </div>
                <div class = "menu_privacy_policy_item_contents_title" style = "margin-top: 40px;">
                    ...
                </div>
                <div class = "menu_privacy_policy_item_contents_description">
                    ...
                </div>
                <div class = "menu_privacy_policy_item_contents_title" style = "margin-top: 40px;">
                    ...
                </div>
                <div class = "menu_privacy_policy_item_contents_description">
                    ...
                </div>
                <div class = "menu_privacy_policy_item_contents_title" style = "margin-top: 40px;">
                    ...
                </div>
                <div class = "menu_privacy_policy_item_contents_description">
                    ...
                </div>
                <div class = "menu_privacy_policy_item_contents_title" style = "margin-top: 40px;">
                    ...
                </div>
                <div class = "menu_privacy_policy_item_contents_description">
                    ...
                </div>
                <div class = "menu_privacy_policy_item_contents_title" style = "margin-top: 40px;">
                    ...
                </div>
                <div class = "menu_privacy_policy_item_contents_description">
                    ...
                </div>
            </div>
        </div>
        <div class = "menu_privacy_policy_item">
            <div class = "menu_privacy_policy_item_top">
                <div class = "menu_privacy_policy_item_top_left">
                    2
                </div>
                <div class = "menu_privacy_policy_item_top_right">
                    ...
                </div>
            </div>
            <div class = "menu_privacy_policy_item_contents">
                <div class = "menu_privacy_policy_item_contents_title">
                    ...
                </div>
                <div class = "menu_privacy_policy_item_contents_description">
                    ...
                </div>
                <div class = "menu_privacy_policy_item_contents_title" style = "margin-top: 40px;">
                    ...
                </div>
                <div class = "menu_privacy_policy_item_contents_description">
                    ...
                </div>
                <div class = "menu_privacy_policy_item_contents_title" style = "margin-top: 40px;">
                    ...
                </div>
                <div class = "menu_privacy_policy_item_contents_description">
                    ...
                </div>
            </div>
        </div>
        <div class = "menu_privacy_policy_item">
            <div class = "menu_privacy_policy_item_top">
                <div class = "menu_privacy_policy_item_top_left">
                    3
                </div>
                <div class = "menu_privacy_policy_item_top_right">
                    ...
                </div>
            </div>
            <div class = "menu_privacy_policy_item_contents">
                <div class = "menu_privacy_policy_item_contents_title">
                    ...
                </div>
                <div class = "menu_privacy_policy_item_contents_description">
                    ...
                </div>
            </div>
        </div>
        <div class = "menu_privacy_policy_item">
            <div class = "menu_privacy_policy_item_top">
                <div class = "menu_privacy_policy_item_top_left">
                    4
                </div>
                <div class = "menu_privacy_policy_item_top_right">
                    ...
                </div>
            </div>
            <div class = "menu_privacy_policy_item_contents">
                <div class = "menu_privacy_policy_item_contents_title">
                    ...
                </div>
                <div class = "menu_privacy_policy_item_contents_description">
                    ...
                </div>
            </div>
        </div>
    </div>
    <div class = "menu_privacy_policy_line"></div>
    <div class = "menu_privacy_policy_box_wrap">
        <div class = "menu_privacy_policy_box_title">
            ...
        </div>
        <div class = "menu_privacy_policy_box_description">
            ...
        </div>
        <div class = "menu_privacy_policy_box_items">
            <!-- item -->
        </div>
    </div>
    <div class = "menu_privacy_policy_box_wrap" style = "margin-top: 20px;">
        <div class = "menu_privacy_policy_box_title">
            ...
        </div>
        <div class = "menu_privacy_policy_box_description">
            ...
        </div>
        <div class = "menu_privacy_policy_box_items">
            <!-- item -->
        </div>
    </div>
</div>