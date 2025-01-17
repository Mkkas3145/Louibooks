<?php

    include_once('../search_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == false) {
        echo "not login";
        exit;
    }

    $menuNumber = $_POST["menuNumber"];

?>

<div class = "nickname" style = "display: none;">
    <?php echo $userInfo["nickname"]; ?>
</div>
<div class = "user_number" style = "display: none;">
    <?php echo $userInfo["number"]; ?>
</div>

<div class = "menu_withdrawal">
    <div class = "menu_withdrawal_profile">
        <div class = "profile_element">
            <div class = "profile_info"><?php echo json_encode($userInfo["profile"]); ?></div>
            <div class = "profile_image"></div>
        </div>
    </div>
    <div class = "menu_withdrawal_title">
        ...
    </div>
    <div class = "menu_withdrawal_description">
        ...
    </div>
    <div class = "menu_withdrawal_items">
        <div class = "menu_withdrawal_item">
            <div class = "menu_withdrawal_item_left">
                <!-- svg -->
            </div>
            <div class = "menu_withdrawal_item_right">
                <div class = "menu_withdrawal_item_right_title">
                    <!-- text -->
                </div>
                <div class = "menu_withdrawal_item_right_description">
                    <!-- text -->
                </div>
            </div>
        </div>
        <div class = "menu_withdrawal_item_line"></div>
        <div class = "menu_withdrawal_item">
            <div class = "menu_withdrawal_item_left">
                <!-- svg -->
            </div>
            <div class = "menu_withdrawal_item_right">
                <div class = "menu_withdrawal_item_right_title">
                    <!-- text -->
                </div>
                <div class = "menu_withdrawal_item_right_description">
                    <!-- text -->
                </div>
            </div>
        </div>
        <div class = "menu_withdrawal_item_line"></div>
        <div class = "menu_withdrawal_item">
            <div class = "menu_withdrawal_item_left">
                <!-- svg -->
            </div>
            <div class = "menu_withdrawal_item_right">
                <div class = "menu_withdrawal_item_right_title">
                    <!-- text -->
                </div>
                <div class = "menu_withdrawal_item_right_description">
                    <!-- text -->
                </div>
            </div>
        </div>
        <div class = "menu_withdrawal_item_line"></div>
        <div class = "menu_withdrawal_item">
            <div class = "menu_withdrawal_item_left">
                <!-- svg -->
            </div>
            <div class = "menu_withdrawal_item_right">
                <div class = "menu_withdrawal_item_right_title">
                    <!-- text -->
                </div>
                <div class = "menu_withdrawal_item_right_description">
                    <!-- text -->
                </div>
            </div>
        </div>
        <div class = "menu_withdrawal_item_line"></div>
        <div class = "menu_withdrawal_item">
            <div class = "menu_withdrawal_item_left">
                <!-- svg -->
            </div>
            <div class = "menu_withdrawal_item_right">
                <div class = "menu_withdrawal_item_right_title">
                    <!-- text -->
                </div>
                <div class = "menu_withdrawal_item_right_description">
                    <!-- text -->
                </div>
            </div>
        </div>
        <div class = "menu_withdrawal_item_line"></div>
        <div class = "menu_withdrawal_item">
            <div class = "menu_withdrawal_item_left">
                <!-- svg -->
            </div>
            <div class = "menu_withdrawal_item_right">
                <div class = "menu_withdrawal_item_right_title">
                    <!-- text -->
                </div>
                <div class = "menu_withdrawal_item_right_description">
                    <!-- text -->
                </div>
            </div>
        </div>
        <div class = "menu_withdrawal_item_line"></div>
        <div class = "menu_withdrawal_item">
            <div class = "menu_withdrawal_item_left">
                <!-- svg -->
            </div>
            <div class = "menu_withdrawal_item_right">
                <div class = "menu_withdrawal_item_right_title">
                    <!-- text -->
                </div>
                <div class = "menu_withdrawal_item_right_description">
                    <!-- text -->
                </div>
            </div>
        </div>
        <div class = "menu_withdrawal_item_line"></div>
        <div class = "menu_withdrawal_item">
            <div class = "menu_withdrawal_item_left">
                <!-- svg -->
            </div>
            <div class = "menu_withdrawal_item_right">
                <div class = "menu_withdrawal_item_right_title">
                    <!-- text -->
                </div>
                <div class = "menu_withdrawal_item_right_description">
                    <!-- text -->
                </div>
            </div>
        </div>
        <div class = "menu_withdrawal_item_line"></div>
        <div class = "menu_withdrawal_item">
            <div class = "menu_withdrawal_item_left">
                <!-- svg -->
            </div>
            <div class = "menu_withdrawal_item_right">
                <div class = "menu_withdrawal_item_right_title">
                    <!-- text -->
                </div>
                <div class = "menu_withdrawal_item_right_description">
                    <!-- text -->
                </div>
            </div>
        </div>
    </div>
    <div class = "menu_withdrawal_input">
        <input type = "password" placeholder = "..." onkeydown = "checkMenuUserWithdrawalButton(<?php echo $menuNumber; ?>);">
    </div>
    <div class = "menu_withdrawal_button menu_withdrawal_button_disabled md-ripples" onclick = "confirmPopupRequestMenuUserWithdrawal(<?php echo $menuNumber; ?>);">
        <div class = "menu_withdrawal_button_icon">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="50" height="3" rx="1.5" transform="translate(0 11)"></rect><path d="M31,39H5a5.006,5.006,0,0,1-5-5V0H4.932A2,2,0,0,0,3,2V34a2,2,0,0,0,2,2H31a2,2,0,0,0,2-2V2a2,2,0,0,0-1.914-2L36,0V34A5.006,5.006,0,0,1,31,39Z" transform="translate(7 11)"></path><path d="M5,14,0,14V5A5.006,5.006,0,0,1,5,0H21a5.006,5.006,0,0,1,5,5v9H21.007A2,2,0,0,0,23,12V5a2,2,0,0,0-2-2H5A2,2,0,0,0,3,5v7a2,2,0,0,0,2,2H5Z" transform="translate(12)"></path><rect width="3" height="15" rx="1.5" transform="translate(24 22)"></rect><rect width="3" height="15" rx="1.5" transform="translate(33 22)"></rect><rect width="3" height="15" rx="1.5" transform="translate(15 22)"></rect></g></svg>
        </div>
        <div class = "menu_withdrawal_button_right">
            ...
        </div>
    </div>
    <div class = "menu_withdrawal_bottom">
        ...
    </div>
</div>