<?php

    include_once('../default_function.php');
    $menuNumber = $_POST["menuNumber"];
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == false) {
        echo "not login";
        exit;
    }

    $deviceInfo = getDeviceInfo();

?>

<div class = "device_info" style = "display: none;">
    <?php
        echo json_encode(array(
            "operatingSystem" => $deviceInfo["operatingSystem"],
            "program" => $deviceInfo["program"]
        ));
    ?>
</div>

<div class = "menu_write_questions">
    <div class = "menu_write_questions_top">
        ...
    </div>
    <div class = "menu_write_questions_line"></div>
    <diV class = "menu_write_questions_box">
        <div class = "menu_write_questions_box_item">
            <div class = "menu_write_questions_box_item_title">
                ...
            </div>
            <div class = "menu_write_questions_box_item_select">
                <div class = "menu_write_questions_box_item_select_wrap md-ripples" value = "0" onclick = "selectList(this, getWriteQuestionsTypeItems());">
                    <div class="menu_my_account_details_item_select_wrap_left value_title">
                        ...
                    </div>
                    <div class="menu_my_account_details_item_select_wrap_right">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17.418 6.109c0.272-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-7.908 7.83c-0.27 0.268-0.707 0.268-0.979 0l-7.908-7.83c-0.27-0.268-0.27-0.701 0-0.969s0.709-0.268 0.979 0l7.419 7.141 7.418-7.141z"></path></svg>
                    </div>
                </div>
            </div>
        </div>
        <div class = "menu_write_questions_box_line"></div>
        <div class = "menu_write_questions_box_item">
            <div class = "menu_write_questions_box_item_title">
                ...
            </div>
            <div class = "menu_write_questions_box_item_textbox">
                <div contenteditable = "true" onkeydown = "textbox_remove_spaces(this); checkButtonWriteQuestionsLoad(<?php echo $menuNumber; ?>);" onpaste = "contenteditable_paste(event);"></div>
            </div>
        </div>
        <div class = "menu_write_questions_box_line"></div>
        <div class = "menu_write_questions_box_item">
            <div class = "menu_write_questions_box_item_title">
                ...
            </div>
            <div class = "menu_write_questions_box_item_screenshot">
                <!-- item -->
                <div class = "menu_write_questions_box_item_screenshot_upload md-ripples" onclick = "writeQuestionsImageUploadButton(<?php echo $menuNumber; ?>);">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="a"><rect width="50" height="50"></rect></clipPath></defs><g id="b" clip-path="url(#a)"><g clip-path="url(#a)"><rect width="3" height="25" rx="1.5" transform="translate(0 25)"></rect><rect width="3" height="25" rx="1.5" transform="translate(47 25)"></rect><rect width="50" height="3" rx="1.5" transform="translate(0 47)"></rect><rect width="3" height="34" rx="1.5" transform="translate(27 35.5) rotate(180)"></rect><rect width="3" height="17.526" rx="1.5" transform="translate(37.928 12.393) rotate(135)"></rect><rect width="3" height="17" rx="1.5" transform="translate(15.193 14.142) rotate(-135)"></rect></g></g></svg>
                </div>
                <input type = "file" onchange = "requestWriteQuestionsImageUpload(<?php echo $menuNumber; ?>, this.files[0]);" accept = "image/png, image/jpeg, image/webp, image/gif" style = "display: none;">
            </div>
        </div>
        <div class = "menu_write_questions_box_line"></div>
        <div class = "menu_write_questions_box_item">
            <div class = "menu_write_questions_box_item_title">
                ...
            </div>
            <div class = "menu_write_questions_box_item_user_info">
                <div class = "menu_write_questions_box_item_user_info_box">
                    <div class = "menu_write_questions_box_item_user_info_box_left">
                        <img src = "/IMG/operating_system/<?php echo $deviceInfo["operatingSystem"]; ?>.png" onload = "imageLoad(event);" alt = "">
                    </div>
                    <div class = "menu_write_questions_box_item_user_info_box_right">
                        <div class = "menu_write_questions_box_item_user_info_box_right_title">
                            ...
                        </div>
                        <div class = "menu_write_questions_box_item_user_info_box_right_value">
                            ...
                        </div>
                    </div>
                </div>
                <div class = "menu_write_questions_box_item_user_info_box">
                    <div class = "menu_write_questions_box_item_user_info_box_left">
                        <img src = "/IMG/program/<?php echo $deviceInfo["program"]; ?>.png" onload = "imageLoad(event);" alt = "">
                    </div>
                    <div class = "menu_write_questions_box_item_user_info_box_right">
                        <div class = "menu_write_questions_box_item_user_info_box_right_title">
                            ...
                        </div>
                        <div class = "menu_write_questions_box_item_user_info_box_right_value">
                            ...
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class = "menu_write_questions_box_line"></div>
        <div class = "menu_write_questions_box_item">
            <div class = "menu_write_questions_box_item_button menu_write_questions_box_item_button_disabled md-ripples" onclick = "writeQuestionsSubmitButton(<?php echo $menuNumber; ?>);">
                <div class = "menu_write_questions_box_item_button_icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                </div>
                <div class = "menu_write_questions_box_item_button_right">
                    ...
                </div>
            </div>
        </div>
    </diV>
</div>