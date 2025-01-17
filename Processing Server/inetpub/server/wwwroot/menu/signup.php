<?php

    include_once('../default_function.php');

    $menuNumber = $_POST["menuNumber"];

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
        <svg onclick = "deleteAllMenu();" style = "width: 150px; cursor: pointer; margin-bottom: 20px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 453 100"><defs><clipPath id="b"><rect width="453" height="100"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><text transform="translate(108 73)" font-size="65" font-family="Pretendard Variable" font-weight="800" letter-spacing="-0.05em"><tspan x="0" y="0">LOUI</tspan><tspan y="0" font-weight="700">BOOKS</tspan></text><g transform="translate(-21.608 -15.697)"><path d="M1935.333,67.426V18.19s-43.321,2.874-43.321,49.236V110.4h43.321c47.9,0,46.118-42.97,46.118-42.97Z" transform="translate(-1866.534 1.376)" fill="#74b5ff"></path><path d="M1893.382,115.69a3.87,3.87,0,0,1-3.87-3.87V68.8c0-11.284,2.462-21.122,7.318-29.239a46.6,46.6,0,0,1,16.218-16.081,57.267,57.267,0,0,1,23.4-7.777,3.87,3.87,0,0,1,4.126,3.861V64.926h42.249a3.87,3.87,0,0,1,3.866,3.709,48.546,48.546,0,0,1-1.243,11.449,50.117,50.117,0,0,1-3.644,10.684,42.243,42.243,0,0,1-7.62,11.116,41.635,41.635,0,0,1-14.823,9.846,61.336,61.336,0,0,1-22.655,3.9h-42.665A3.893,3.893,0,0,1,1893.382,115.69Zm3.87-7.794H1936.7c13.924,0,24.655-3.825,31.893-11.369,7.709-8.035,9.7-18.415,10.2-23.861H1936.7a3.87,3.87,0,0,1-3.87-3.87V24.056a50.767,50.767,0,0,0-16.039,6.2c-12.968,7.913-19.543,20.88-19.543,38.541Z" transform="translate(-1867.904 0.006)"></path></g></g></svg>
        <div class = "login_box_title">
            <?php echo getLanguage("signupPage_title"); ?>
        </div>
        <div class = "login_box_input">
            <div id = "signup_step1_<?php echo $menuNumber; ?>">
                <div class = "login_box_input_item">
                    <div class = "login_box_input_item_title">
                        <?php echo getLanguage("loginPage_input_nickname"); ?>
                    </div>
                    <input placeholder = "<?php echo getLanguage("loginPage_input_nickname"); ?>" id = "signup_input_<?php echo $menuNumber ?>_nickname" type = "text" onkeydown = "checkSignupInput(<?php echo $menuNumber ?>); if (event.keyCode == 13) { signup(<?php echo $menuNumber ?>); }">
                    <div class = "login_box_input_item_notice" id = "signup_input_notice_<?php echo $menuNumber ?>_nickname"></div>
                </div>
                <div class = "login_box_input_item">
                    <div class = "login_box_input_item_title">
                        <?php echo getLanguage("loginPage_input_email"); ?>
                    </div>
                    <input placeholder = "<?php echo getLanguage("loginPage_input_email"); ?>" id = "signup_input_<?php echo $menuNumber ?>_email" type = "email" onkeydown = "checkSignupInput(<?php echo $menuNumber ?>); if (event.keyCode == 13) { signup(<?php echo $menuNumber ?>); }">
                    <div class = "login_box_input_item_notice" id = "signup_input_notice_<?php echo $menuNumber ?>_email"></div>
                </div>
                <div class = "signup_password">
                    <div class = "login_box_input_item" style = "width: 50%;">
                        <div class = "login_box_input_item_title">
                            <?php echo getLanguage("loginPage_input_password"); ?>
                        </div>
                        <input placeholder = "<?php echo getLanguage("loginPage_input_password"); ?>" id = "signup_input_<?php echo $menuNumber ?>_password" type = "password" onkeydown = "checkSignupInput(<?php echo $menuNumber ?>); if (event.keyCode == 13) { signup(<?php echo $menuNumber ?>); }">
                        <div class = "login_box_input_item_notice" id = "signup_input_notice_<?php echo $menuNumber ?>_password"></div>
                    </div>
                    <div class = "login_box_input_item" style = "width: 50%; margin-left: 20px;">
                        <div class = "login_box_input_item_title">
                            <?php echo getLanguage("loginPage_input_password2"); ?>
                        </div>
                        <input placeholder = "<?php echo getLanguage("loginPage_input_password2"); ?>" id = "signup_input_<?php echo $menuNumber ?>_password2" type = "password" onkeydown = "checkSignupInput(<?php echo $menuNumber ?>); if (event.keyCode == 13) { signup(<?php echo $menuNumber ?>); }">
                        <div class = "login_box_input_item_notice" id = "signup_input_notice_<?php echo $menuNumber ?>_password2"></div>
                    </div>
                </div>
                <div class = "login_box_input_item_notice" id = "signup_input_notice_<?php echo $menuNumber ?>_privacy_policy" style = "height: max-content;"></div>
                <div class = "login_box_auto_login" style = "margin-bottom: 0px" onclick = "toggleSignupCheckbox(<?php echo $menuNumber ?>);">
                    <div class = "login_box_auto_login_input" id = "login_box_auto_login_input_<?php echo $menuNumber ?>_privacy_policy">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5 11-11 2 2-13 13z"></path></svg>
                    </div>
                    <div class = "login_box_auto_login_text">
                        <?php echo getLanguage("signupPage_check_box_title"); ?>
                    </div>
                </div>
                <div class = "login_box_auto_login_details md-ripples" onclick = "loadMenu_privacy_policy();" style = "margin-bottom: 40px;">
                    <?php echo getLanguage("signupPage_check_box_more"); ?>
                </div>
            </div>
            <div id = "signup_step2_<?php echo $menuNumber; ?>" style = "display: none; margin-bottom: 50px;">
                <div class = "login_box_input_item">
                    <div class = "login_box_input_item_title">
                        <?php echo getLanguage("loginPage_input_verification_code"); ?>
                    </div>
                    <input id = "signup_input_<?php echo $menuNumber ?>_auth_code" type = "text" onkeydown = "checkSignupInput(<?php echo $menuNumber ?>); if (event.keyCode == 13) { signup(<?php echo $menuNumber ?>); }">
                    <div class = "login_box_input_item_notice" id = "signup_input_notice_<?php echo $menuNumber ?>_auth_code"></div>
                </div>
            </div>
        </div>
        <div class = "login_box_bottom">
            <div class = "login_box_bottom_left">
                <div class = "login_box_bottom_left_item md-ripples" onclick = "loadMenu_login();">
                    <?php echo getLanguage("loginPage_login"); ?>
                </div>
                <div class = "login_box_bottom_left_line"></div>
                <div class = "login_box_bottom_left_item md-ripples" onclick = "loadMenu_find_password();">
                    <?php echo getLanguage("loginPage_find_password"); ?>
                </div>
            </div>
            <div class = "login_box_bottom_right">
                <div onclick = "signup(<?php echo $menuNumber ?>);" id = "login_box_bottom_right_confirm_<?php echo $menuNumber ?>_signup" class = "login_box_bottom_right_confirm md-ripples">
                    <?php echo getLanguage("loginPage_button2"); ?>
                </div>
            </div>
        </div>
    </div>
</div>