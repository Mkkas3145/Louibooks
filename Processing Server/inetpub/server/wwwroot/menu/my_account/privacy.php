<?php

    $menuNumber = $_POST["menuNumber"];

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

?>

<div class = "menu_my_account_privacy">
    <div class = "menu_my_account_privacy_top">
        <div class = "menu_my_account_privacy_top_title">
            ...
        </div>
        <div class = "menu_my_account_privacy_top_description">
            ...
        </div>
    </div>
    <div class = "menu_my_account_privacy_line"></div>
    <div class = "menu_my_account_privacy_box_wrap">
        <div class = "menu_my_account_privacy_box">
            <div class = "menu_my_account_privacy_box_title">
                ...
            </div>
            <div class = "menu_my_account_privacy_box_description">
                ...
            </div>
            <div class = "menu_my_account_privacy_box_items">
                <div class = "menu_my_account_privacy_box_item md-ripples" onclick = "toggleMyAccountPrivacyItem(this, 'works_history');" toggle = "<?php echo (($userInfo["works_history_use"] == true) ? "true" : "false"); ?>">
                    <div class = "menu_my_account_privacy_box_item_icon">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M23.709,37.886h0L0,24.772,23.71,12.207,49.543,24.772,23.71,37.886Zm.134-22.5L6.133,24.772l17.71,9.8,19.3-9.8Z" transform="translate(0.228 -11.772)"></path><g transform="translate(1.456)"><path d="M1.451-.035A1.6,1.6,0,0,1,3,1.543L3.434,25.3a1.466,1.466,0,0,1-1.488,1.521A1.6,1.6,0,0,1,.4,25.244L-.037,1.486A1.466,1.466,0,0,1,1.451-.035Z" transform="translate(-0.648 25.64) rotate(-60)"></path><path d="M2.639.067A1.466,1.466,0,0,1,4.127,1.588L3.689,25.347a1.6,1.6,0,0,1-1.545,1.578A1.466,1.466,0,0,1,.656,25.4L1.094,1.645A1.6,1.6,0,0,1,2.639.067Z" transform="translate(43.172 22.047) rotate(60)"></path></g><g transform="translate(1.456 11)"><path d="M1.451-.035A1.6,1.6,0,0,1,3,1.543L3.434,25.3a1.466,1.466,0,0,1-1.488,1.521A1.6,1.6,0,0,1,.4,25.244L-.037,1.486A1.466,1.466,0,0,1,1.451-.035Z" transform="translate(-0.648 25.64) rotate(-60)"></path><path d="M2.639.067A1.466,1.466,0,0,1,4.127,1.588L3.689,25.347a1.6,1.6,0,0,1-1.545,1.578A1.466,1.466,0,0,1,.656,25.4L1.094,1.645A1.6,1.6,0,0,1,2.639.067Z" transform="translate(43.172 22.047) rotate(60)"></path></g></g></svg>
                    </div>
                    <div class = "menu_my_account_privacy_box_item_center">
                        <div class = "menu_my_account_privacy_box_item_center_title">
                            ...
                        </div>
                        <div class = "menu_my_account_privacy_box_item_center_description">
                            ...
                        </div>
                    </div>
                    <div class = "menu_my_account_privacy_box_item_toggle">
                        <div class = "menu_my_account_privacy_box_item_toggle_circle"></div>
                    </div>
                </div>
                <div class = "menu_my_account_privacy_box_line"></div>
                <div class = "menu_my_account_privacy_box_item md-ripples" onclick = "toggleMyAccountPrivacyItem(this, 'search_history');" toggle = "<?php echo (($userInfo["search_history_use"] == true) ? "true" : "false"); ?>">
                    <div class = "menu_my_account_privacy_box_item_icon">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M21.5,43A21.5,21.5,0,0,1,6.3,6.3,21.5,21.5,0,1,1,36.7,36.7,21.359,21.359,0,0,1,21.5,43Zm0-39.605A18.105,18.105,0,1,0,39.605,21.5,18.126,18.126,0,0,0,21.5,3.394Z"></path><rect width="3" height="20" rx="1.5" transform="translate(33.904 35.858) rotate(-45)"></rect></g></svg>
                    </div>
                    <div class = "menu_my_account_privacy_box_item_center">
                        <div class = "menu_my_account_privacy_box_item_center_title">
                            ...
                        </div>
                        <div class = "menu_my_account_privacy_box_item_center_description">
                            ...
                        </div>
                    </div>
                    <div class = "menu_my_account_privacy_box_item_toggle">
                        <div class = "menu_my_account_privacy_box_item_toggle_circle"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class = "menu_my_account_privacy_box">
            <div class = "menu_my_account_privacy_box_title">
                ...
            </div>
            <div class = "menu_my_account_privacy_box_description">
                ...
            </div>
            <div class = "menu_my_account_privacy_box_items">
                <div class = "menu_my_account_privacy_box_item md-ripples" style = "pointer-events: none;">
                    <div class = "menu_my_account_privacy_box_item_icon">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M42.282,39.4h0l-.226,0H1.251C.557,39.4.2,39.3.065,39.075c-.221-.363.152-1.085.769-2.282,1.4-2.715,4.315-8.364,4.6-18.745a21.434,21.434,0,0,1,1.682-8.6,15.31,15.31,0,0,1,4.146-5.562A17.322,17.322,0,0,1,22.285,0a16.042,16.042,0,0,1,10.5,4.409,18.085,18.085,0,0,1,5.659,13.638c.141,10.246,2.863,15.713,4.326,18.65.617,1.238.989,1.986.755,2.364C43.375,39.3,43,39.4,42.282,39.4ZM22.187,3.026c-6.61,0-13.7,4.015-13.76,15.285a46.872,46.872,0,0,1-2.09,13.2,29.949,29.949,0,0,1-1.958,4.9L39.3,36.4s0,0-.006-.009a27.524,27.524,0,0,1-1.879-4.733,47.874,47.874,0,0,1-2-13.351C35.34,7.268,27.28,3.075,22.217,3.026Z" transform="translate(3.124 0.378)"></path><path d="M6.4,0a6.4,6.4,0,0,1,6.4,6.4H0A6.4,6.4,0,0,1,6.4,0Z" transform="translate(30.704 50) rotate(180)"></path></g></svg>
                    </div>
                    <div class = "menu_my_account_privacy_box_item_center">
                        <div class = "menu_my_account_privacy_box_item_center_title">
                            ...
                        </div>
                        <div class = "menu_my_account_privacy_box_item_center_description">
                            ...
                        </div>
                    </div>
                    <div class = "menu_my_account_privacy_box_item_toggle">
                        <div class = "menu_my_account_privacy_box_item_toggle_circle"></div>
                    </div>
                </div>
                <div class = "menu_my_account_privacy_box_line"></div>
                <div class = "menu_my_account_privacy_box_item md-ripples" onclick = "toggleMyAccountPrivacyItem(this, 'reply_notifications');" toggle = "<?php echo (($userInfo["reply_notifications_use"] == true) ? "true" : "false"); ?>">
                    <div class = "menu_my_account_privacy_box_item_icon">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M42.282,39.4h0l-.226,0H1.251C.557,39.4.2,39.3.065,39.075c-.221-.363.152-1.085.769-2.282,1.4-2.715,4.315-8.364,4.6-18.745a21.434,21.434,0,0,1,1.682-8.6,15.31,15.31,0,0,1,4.146-5.562A17.322,17.322,0,0,1,22.285,0a16.042,16.042,0,0,1,10.5,4.409,18.085,18.085,0,0,1,5.659,13.638c.141,10.246,2.863,15.713,4.326,18.65.617,1.238.989,1.986.755,2.364C43.375,39.3,43,39.4,42.282,39.4ZM22.187,3.026c-6.61,0-13.7,4.015-13.76,15.285a46.872,46.872,0,0,1-2.09,13.2,29.949,29.949,0,0,1-1.958,4.9L39.3,36.4s0,0-.006-.009a27.524,27.524,0,0,1-1.879-4.733,47.874,47.874,0,0,1-2-13.351C35.34,7.268,27.28,3.075,22.217,3.026Z" transform="translate(3.124 0.378)"></path><path d="M6.4,0a6.4,6.4,0,0,1,6.4,6.4H0A6.4,6.4,0,0,1,6.4,0Z" transform="translate(30.704 50) rotate(180)"></path></g></svg>
                    </div>
                    <div class = "menu_my_account_privacy_box_item_center">
                        <div class = "menu_my_account_privacy_box_item_center_title">
                            ...
                        </div>
                        <div class = "menu_my_account_privacy_box_item_center_description">
                            ...
                        </div>
                    </div>
                    <div class = "menu_my_account_privacy_box_item_toggle">
                        <div class = "menu_my_account_privacy_box_item_toggle_circle"></div>
                    </div>
                </div>
                <div class = "menu_my_account_privacy_box_line"></div>
                <div class = "menu_my_account_privacy_box_item md-ripples" onclick = "toggleMyAccountPrivacyItem(this, 'activity_notifications');" toggle = "<?php echo (($userInfo["activity_notifications_use"] == true) ? "true" : "false"); ?>">
                    <div class = "menu_my_account_privacy_box_item_icon">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M42.282,39.4h0l-.226,0H1.251C.557,39.4.2,39.3.065,39.075c-.221-.363.152-1.085.769-2.282,1.4-2.715,4.315-8.364,4.6-18.745a21.434,21.434,0,0,1,1.682-8.6,15.31,15.31,0,0,1,4.146-5.562A17.322,17.322,0,0,1,22.285,0a16.042,16.042,0,0,1,10.5,4.409,18.085,18.085,0,0,1,5.659,13.638c.141,10.246,2.863,15.713,4.326,18.65.617,1.238.989,1.986.755,2.364C43.375,39.3,43,39.4,42.282,39.4ZM22.187,3.026c-6.61,0-13.7,4.015-13.76,15.285a46.872,46.872,0,0,1-2.09,13.2,29.949,29.949,0,0,1-1.958,4.9L39.3,36.4s0,0-.006-.009a27.524,27.524,0,0,1-1.879-4.733,47.874,47.874,0,0,1-2-13.351C35.34,7.268,27.28,3.075,22.217,3.026Z" transform="translate(3.124 0.378)"></path><path d="M6.4,0a6.4,6.4,0,0,1,6.4,6.4H0A6.4,6.4,0,0,1,6.4,0Z" transform="translate(30.704 50) rotate(180)"></path></g></svg>
                    </div>
                    <div class = "menu_my_account_privacy_box_item_center">
                        <div class = "menu_my_account_privacy_box_item_center_title">
                            ...
                        </div>
                        <div class = "menu_my_account_privacy_box_item_center_description">
                            ...
                        </div>
                    </div>
                    <div class = "menu_my_account_privacy_box_item_toggle">
                        <div class = "menu_my_account_privacy_box_item_toggle_circle"></div>
                    </div>
                </div>
                <div class = "menu_my_account_privacy_box_line"></div>
                <div class = "menu_my_account_privacy_box_item md-ripples" onclick = "toggleMyAccountPrivacyItem(this, 'louibooks_notifications');" toggle = "<?php echo (($userInfo["louibooks_notifications_use"] == true) ? "true" : "false"); ?>">
                    <div class = "menu_my_account_privacy_box_item_icon">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M42.282,39.4h0l-.226,0H1.251C.557,39.4.2,39.3.065,39.075c-.221-.363.152-1.085.769-2.282,1.4-2.715,4.315-8.364,4.6-18.745a21.434,21.434,0,0,1,1.682-8.6,15.31,15.31,0,0,1,4.146-5.562A17.322,17.322,0,0,1,22.285,0a16.042,16.042,0,0,1,10.5,4.409,18.085,18.085,0,0,1,5.659,13.638c.141,10.246,2.863,15.713,4.326,18.65.617,1.238.989,1.986.755,2.364C43.375,39.3,43,39.4,42.282,39.4ZM22.187,3.026c-6.61,0-13.7,4.015-13.76,15.285a46.872,46.872,0,0,1-2.09,13.2,29.949,29.949,0,0,1-1.958,4.9L39.3,36.4s0,0-.006-.009a27.524,27.524,0,0,1-1.879-4.733,47.874,47.874,0,0,1-2-13.351C35.34,7.268,27.28,3.075,22.217,3.026Z" transform="translate(3.124 0.378)"></path><path d="M6.4,0a6.4,6.4,0,0,1,6.4,6.4H0A6.4,6.4,0,0,1,6.4,0Z" transform="translate(30.704 50) rotate(180)"></path></g></svg>
                    </div>
                    <div class = "menu_my_account_privacy_box_item_center">
                        <div class = "menu_my_account_privacy_box_item_center_title">
                            ...
                        </div>
                        <div class = "menu_my_account_privacy_box_item_center_description">
                            ...
                        </div>
                    </div>
                    <div class = "menu_my_account_privacy_box_item_toggle">
                        <div class = "menu_my_account_privacy_box_item_toggle_circle"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class = "menu_my_account_privacy_line"></div>
    <div class = "menu_my_account_privacy_bottom">
        ...
    </div>
</div>