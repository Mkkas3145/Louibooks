<?php

    include_once('../default_function.php');

    $menuNumber = $_POST["menuNumber"];

    $info = getMyLoginInfo();

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
            <?php echo getLanguage("loginPage_title"); ?>
        </div>
        <div class = "login_box_input">
            <div class = "login_box_input_item">
                <div class = "login_box_input_item_title">
                    <?php echo getLanguage("loginPage_input_email"); ?>
                </div>
                <input placeholder = "<?php echo getLanguage("loginPage_input_email"); ?>" type = "email" id = "login_input_<?php echo $menuNumber ?>_email" onkeydown = "checkLoginInput(<?php echo $menuNumber ?>); if (event.keyCode == 13) { login(<?php echo $menuNumber ?>); }">
                <div class = "login_box_input_item_notice" id = "login_input_notice_<?php echo $menuNumber ?>_email"></div>
            </div>
            <div class = "login_box_input_item">
                <div class = "login_box_input_item_title">
                    <?php echo getLanguage("loginPage_input_password"); ?>
                </div>
                <input placeholder = "<?php echo getLanguage("loginPage_input_password"); ?>" type = "password" id = "login_input_<?php echo $menuNumber ?>_password" onkeydown = "checkLoginInput(<?php echo $menuNumber ?>); if (event.keyCode == 13) { login(<?php echo $menuNumber ?>); }">
                <div class = "login_box_input_item_notice" id = "login_input_notice_<?php echo $menuNumber ?>_password"></div>
            </div>
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
        <div class = "login_box_sns">
            <div class = "login_box_sns_google_button md-ripples" onclick = "loginGoogle();">
                <div class = "login_box_sns_google_button_logo">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                          <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                          <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                          <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                          <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                        </g>
                    </svg>
                </div>
                <div class = "login_box_sns_google_button_text">
                    Sign in with Google
                </div>
            </div>
        </div>
        <?php
            $isOtherAccount = (isset($info["otherAccount"]) && count($info["otherAccount"]) != 0);
        ?>
        <div class = "login_box_bottom" style = "<?php if ($isOtherAccount == true) { echo "margin-top: 40px;"; } ?>">
            <?php
                if ($isOtherAccount == true) {
                    echo '<div class = "login_box_other_account">';

                    $otherAccount = $info["otherAccount"];
                    for ($i = 0; $i < count($otherAccount); $i++) {
                        if ($otherAccount[$i]["status"] == 0) {
                            if (isset($otherAccount[$i]["isLogged"]) && $otherAccount[$i]["isLogged"] == true) {
                                $state = getLanguage("loginPage_state_login");
                                $onclick = 'loginWithKey(\'' . $otherAccount[$i]["loginKey"] . '\');';
                            } else {
                                $state = getLanguage("loginPage_state_logout");
                                $onclick = 'loadMenu_other_account(' . $otherAccount[$i]["number"] . ');';
                            }
                            echo '
                                <div class = "login_box_other_account_wrapped" name = "other_account_item_' . $otherAccount[$i]["number"] . '">
                                    <div class = "login_box_other_account_item md-ripples" onclick = "' . $onclick . '">
                                        <div class = "login_box_other_account_item_left">
                                            <div class = "profile_element">
                                                <div class = "profile_info">' . json_encode($otherAccount[$i]["profile"]) . '</div>
                                                <div class = "profile_image"></div>
                                            </div>
                                        </div>
                                        <div class = "login_box_other_account_item_center">
                                            <div class = "login_box_other_account_item_center_nickname">
                                                ' . $otherAccount[$i]["nickname"] . '
                                                <spen class = "login_box_other_account_item_center_state">
                                                    ' . $state . '
                                                </spen>
                                            </div>
                                            <div class = "login_box_other_account_item_center_email">
                                                ' . $otherAccount[$i]["email"] . '
                                            </div>
                                        </div>
                                        <div class = "login_box_other_account_item_right">
                                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-1 -1.061)"><circle cx="3" cy="3" r="3" transform="translate(23 4)"></circle><path d="M3,0A2.971,2.971,0,0,1,6,2.942,2.971,2.971,0,0,1,3,5.884,2.971,2.971,0,0,1,0,2.942,2.971,2.971,0,0,1,3,0Z" transform="translate(23 23)"></path><path d="M3,0A3.031,3.031,0,0,1,6,3.061,3.031,3.031,0,0,1,3,6.121,3.031,3.031,0,0,1,0,3.061,3.031,3.031,0,0,1,3,0Z" transform="translate(23 42)"></path></g></g></svg>
                                        </div>
                                    </div>
                                    <div class = "login_box_other_account_item_more_button">
                                        <div class = "login_box_other_account_item_more_button_box md-ripples" onclick = "moreButtonOtherAccount(this, ' . $otherAccount[$i]["number"] . ');"></div>
                                    </div>
                                </div>
                            ';
                        }
                    }

                    echo '</div>';
                }
            ?>
        </div>
    </div>
</div>