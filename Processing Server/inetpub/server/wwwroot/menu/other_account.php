<?php

    include_once('../default_function.php');

    $menuNumber = $_POST["menuNumber"];
    $data = $_POST["data"];

    $info = getUserInfo($data)[0];

?>

<div class = "login_background img_wrap">
    <div class = "login_background_item" style = "animation: loginPageBackgroundAni1 30s infinite">
        <img src = "/IMG/login/1.png?v=6" onload = "imageLoad(event);">
    </div>
    <div class = "login_background_item" style = "animation: loginPageBackgroundAni2 30s infinite">
        <img src = "/IMG/login/2.png?v=6" onload = "imageLoad(event);">
    </div>
    <div class = "login_background_item" style = "animation: loginPageBackgroundAni3 30s infinite">
        <img src = "/IMG/login/3.png?v=6" onload = "imageLoad(event);">
    </div>
    <div class = "login_background_item" style = "animation: loginPageBackgroundAni4 30s infinite">
        <img src = "/IMG/login/4.png?v=6" onload = "imageLoad(event);">
    </div>
    <div class = "login_background_item" style = "animation: loginPageBackgroundAni5 30s infinite">
        <img src = "/IMG/login/5.png?v=6" onload = "imageLoad(event);">
    </div>
    <div class = "login_background_item" style = "animation: loginPageBackgroundAni6 30s infinite">
        <img src = "/IMG/login/1.png?v=6" onload = "imageLoad(event);">
    </div>
</div>
<div class = "login">
    <div class = "login_box">
        <?php
            $strings = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $unique = substr(str_shuffle($strings), 0, 10);
            $svg = str_replace("{unique}", $unique, '<svg onclick = "deleteAllMenu();" class = "login_box_logo" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="354" height="150" viewBox="0 0 354 150"> <defs> <style> .cls-1_{unique} { clip-path: url(#clip-title_logo_{unique}); } .cls-2_{unique} { font-size: 46px; font-weight: 700; } .cls-3_{unique} { font-weight: 400; } .cls-4_{unique} { fill: url(#linear-gradient_{unique}); } </style> <linearGradient id="linear-gradient_{unique}" x1="0.184" y1="0.27" x2="0.858" y2="0.91" gradientUnits="objectBoundingBox"> <stop offset="0" stop-color="#004cff"/> <stop offset="1" stop-color="#00c2ff"/> </linearGradient> <clipPath id="clip-title_logo_{unique}"> <rect width="354" height="150"/> </clipPath> </defs> <g id="title_logo_{unique}" class="cls-1_{unique}"> <text id="LOUIBOOKS_{unique}" class="cls-2_{unique}" transform="translate(89 92)"><tspan x="0" y="0">LOUI</tspan><tspan class="cls-3_{unique}" y="0">BOOKS</tspan></text> <g id="그룹_4_{unique}" data-name="그룹 4_{unique}" transform="translate(0 38.517)"> <g id="그룹_1_{unique}" data-name="그룹 1_{unique}" transform="translate(0 0.438)"> <path id="빼기_5_{unique}" data-name="빼기 5_{unique}" class="cls-4_{unique}" d="M36.5,73H0V36.5A36.469,36.469,0,0,1,36.5,0V36.5H73A36.47,36.47,0,0,1,36.5,73Z" transform="translate(0 0.045)"/> </g> </g> </g> </svg>');
            echo $svg;
        ?>
        <div class = "login_box_title">
            <?php echo getLanguage("loginPage_title"); ?>
        </div>
        <div class = "other_account">
            <div class = "other_account_profile" style = "width: 60px; height: 60px; margin: 0 auto;">
                <?php
                    echo '
                        <div class = "profile_element">
                            <div class = "profile_info">' . json_encode($info["profile"]) . '</div>
                            <div class = "profile_image"></div>
                        </div>
                    ';
                ?>
            </div>
            <div class = "other_account_profile_nickname">
                <?php echo $info["nickname"]; ?>
            </div>
            <div class = "other_account_profile_email">
                <?php echo $info["email"]; ?>
            </div>
        </div>
        <div class = "login_box_input">
            <div class = "login_box_input_item" style = "display: none;">
                <div class = "login_box_input_item_title">
                    <?php echo getLanguage("loginPage_input_email"); ?>
                </div>
                <input type = "email" value = "<?php echo $info["email"]; ?>" id = "login_input_<?php echo $menuNumber ?>_email" onkeydown = "checkLoginInput(<?php echo $menuNumber ?>); if (event.keyCode == 13) { login(<?php echo $menuNumber ?>); }">
                <div class = "login_box_input_item_notice" id = "login_input_notice_<?php echo $menuNumber ?>_email"></div>
            </div>
            <div class = "login_box_input_item">
                <div class = "login_box_input_item_title">
                    <?php echo getLanguage("loginPage_input_password"); ?>
                </div>
                <input type = "password" id = "login_input_<?php echo $menuNumber ?>_password" onkeydown = "checkLoginInput(<?php echo $menuNumber ?>); if (event.keyCode == 13) { login(<?php echo $menuNumber ?>); }">
                <div class = "login_box_input_item_notice" id = "login_input_notice_<?php echo $menuNumber ?>_password"></div>
            </div>
            <div class = "login_box_input" style = "display: none;">
                <div class = "login_box_input_item">
                    <div class = "login_box_input_item_title">
                        <?php echo getLanguage("loginPage_input_two_factor_auth"); ?>
                    </div>
                    <input placeholder = "<?php echo getLanguage("loginPage_input_two_factor_auth"); ?>" type = "number" id = "login_input_<?php echo $menuNumber ?>_two_factor_auth" onkeydown = "checkLoginInput(<?php echo $menuNumber ?>); if (event.keyCode == 13) { login(<?php echo $menuNumber ?>); }">
                    <div class = "login_box_input_item_notice" id = "login_input_notice_<?php echo $menuNumber ?>_two_factor_auth"></div>
                </div>
            </div>
        </div>
        <div class = "login_box_auto_login" onclick = "toggleLoginCheckbox(<?php echo $menuNumber; ?>);">
            <div class = "login_box_auto_login_input login_box_auto_login_input_check" id = "login_box_auto_login_input_<?php echo $menuNumber; ?>_auto_login">
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5 11-11 2 2-13 13z"></path></svg>
            </div>
            <div class = "login_box_auto_login_text">
                <?php echo getLanguage("loginPage_keep_logged_in"); ?>
            </div>
        </div>
        <div class = "login_box_bottom">
            <div class = "login_box_bottom_left">
                <div class = "login_box_bottom_left_item md-ripples" onclick = "loadMenu_signup();">
                    <?php echo getLanguage("loginPage_signup"); ?>
                </div>
                <div class = "login_box_bottom_left_line"></div>
                <div class = "login_box_bottom_left_item md-ripples" onclick = "loadMenu_find_password();">
                    <?php echo getLanguage("loginPage_find_password"); ?>
                </div>
            </div>
            <div class = "login_box_bottom_right">
                <div class = "login_box_bottom_right_confirm md-ripples" onclick = "login(<?php echo $menuNumber ?>);" id = "login_box_bottom_right_confirm_<?php echo $menuNumber ?>_login">
                    <?php echo getLanguage("loginPage_button1"); ?>
                </div>
            </div>
        </div>
    </div>
</div>