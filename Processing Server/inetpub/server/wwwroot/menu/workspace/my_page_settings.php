<?php

    $menuNumber = $_POST["menuNumber"];

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == false) {
        echo 'not login'; exit;
    }

    $stmt = $pdo->prepare("SELECT art FROM user WHERE number = :number");
    $stmt->execute(array(
        'number' => $userInfo["number"]
    ));
    $user = $stmt->fetch();

    $artInfo = null;
    if (isset($user["art"])) {
        $artInfo = json_decode($user["art"]);
    }

?>

<div class = "user_rank" style = "display: none;">
    <?php echo $userInfo["rankInfo"]["rank"]; ?>;
</div>
<div class = "workspace_my_page_settings_save_json" style = "display: none;">
    <?php
        echo json_encode(array(
            'description' => $userInfo["description"],
            'art' => $artInfo
        ));
    ?>
</div>

<div class = "workspace_my_page_settings_top">
    <div class = "workspace_my_page_settings_top_left">
        <div class = "workspace_my_page_settings_top_left_icon">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-4.438,42.27v0L.4,28.587,21.847,7.145a2.12,2.12,0,0,1,1.506-.632,1.945,1.945,0,0,1,1.387.567l7.071,7.071a1.944,1.944,0,0,1,.567,1.433,2.125,2.125,0,0,1-.632,1.459L10.3,38.487-4.436,42.27ZM23.387,9.839h0L3.162,30.064-.327,38.621l9.154-2.892L29.052,15.5,23.387,9.839Z" transform="translate(5.102 6.536)"></path><path d="M28.7,19.1a1.987,1.987,0,0,1-1.414-.586l-7.071-7.071a2,2,0,0,1,0-2.828l6.368-6.368a2,2,0,0,1,2.829,0l7.071,7.071a2,2,0,0,1,0,2.828L30.116,18.51A1.987,1.987,0,0,1,28.7,19.1ZM27.995,5.067h0l-4.95,4.95,5.666,5.665,4.95-4.949L27.995,5.067Z" transform="translate(12.102 -0.464)"></path></g></svg>
        </div>
        <div class = "workspace_my_page_settings_top_left_title">
            ...
        </div>
    </div>
    <div class = "workspace_my_page_settings_top_right">
        <div class = "workspace_my_page_settings_top_right_undo md-ripples" onclick = "workspaceMyPageSettingsUndo(<?php echo $menuNumber; ?>);">
            ...
        </div>
        <div class = "workspace_my_page_settings_top_right_save md-ripples" onclick = "workspaceMyPageSettingsSave(<?php echo $menuNumber; ?>);">
            ...
        </div>
        <div class="workspace_my_page_settings_top_right_more md-ripples" onclick = "moreButtonWorkspaceMyPageSettings(this, <?php echo $userInfo["number"]; ?>);" onmouseenter = "hoverInformation(this, getLanguage('view_more'));">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-1 -1.061)"><circle cx="3" cy="3" r="3" transform="translate(23 4)"></circle><path d="M3,0A2.971,2.971,0,0,1,6,2.942,2.971,2.971,0,0,1,3,5.884,2.971,2.971,0,0,1,0,2.942,2.971,2.971,0,0,1,3,0Z" transform="translate(23 23)"></path><path d="M3,0A3.031,3.031,0,0,1,6,3.061,3.031,3.031,0,0,1,3,6.121,3.031,3.031,0,0,1,0,3.061,3.031,3.031,0,0,1,3,0Z" transform="translate(23 42)"></path></g></g></svg>
        </div>
    </div>
</div>
<div class = "workspace_my_page_settings">
    <div class = "workspace_my_page_settings_profile">
        <div class = "workspace_my_page_settings_title">
            ...
        </div>
        <div class = "workspace_my_page_settings_description">
            ...
        </div>
        <div class = "workspace_my_page_settings_profile_contents">
            <div class = "workspace_my_page_settings_profile_contents_left">
                <div class = "my_profile"></div>
            </div>
            <div class = "workspace_my_page_settings_profile_contents_right">
                <div class = "workspace_my_page_settings_profile_contents_right_button md-ripples" onclick = "openPopupContents('change_profile');">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="a"><rect width="50" height="50"></rect></clipPath></defs><g id="b" clip-path="url(#a)"><g clip-path="url(#a)"><path d="M11,22a11,11,0,1,1,7.778-3.222A11,11,0,0,1,11,22ZM11,3a8,8,0,1,0,8,8,8,8,0,0,0-8-8Z" transform="translate(14)"></path><path d="M29.719,61H19A19,19,0,0,1,0,42V24A19,19,0,0,1,19,5h8.569a18.6,18.6,0,0,0-2.918,3.5H18.719a16.018,16.018,0,0,0-16,16v18a16.018,16.018,0,0,0,16,16h11a16.018,16.018,0,0,0,16-16V36.169a18.428,18.428,0,0,0,3-1.233V42a19,19,0,0,1-19,19Z" transform="translate(1.281 20)"></path></g><path d="M761,48.686c0-.095.015-14.9.015-14.9s5.813,5.859,5.906,5.891a1.552,1.552,0,0,0,1.969-.172,1.418,1.418,0,0,0,.2-1.828c-.094-.109-8.594-8.609-8.594-8.609a1.436,1.436,0,0,0-1.734,0c-.75.7-8.547,8.609-8.547,8.609a1.3,1.3,0,0,0,.063,1.672,1.567,1.567,0,0,0,2.344.078c.5-.562,5.406-5.391,5.406-5.391V48.563a1.4,1.4,0,0,0,1.438,1.359A1.518,1.518,0,0,0,761,48.686Z" transform="translate(-721.335 -1.944)"></path></g></svg>
                    <span>...</span>
                </div>
            </div>
        </div>
    </div>
    <div class = "workspace_my_page_settings_art">
        <div class = "workspace_my_page_settings_title">
            ...
        </div>
        <div class = "workspace_my_page_settings_art_contents">
            <div class = "workspace_my_page_settings_art_contents_left">
                <!-- html -->
            </div>
            <div class = "workspace_my_page_settings_art_contents_right">
                <div class = "workspace_my_page_settings_art_contents_right_text">
                    ...
                </div>
                <div class = "workspace_my_page_settings_art_contents_right_items">
                    <div class = "workspace_my_page_settings_art_contents_right_item md-ripples" onclick = "workspaceMyPageSettingsChangeArtButton(<?php echo $menuNumber; ?>);">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-4.438,42.27v0L.4,28.587,21.847,7.145a2.12,2.12,0,0,1,1.506-.632,1.945,1.945,0,0,1,1.387.567l7.071,7.071a1.944,1.944,0,0,1,.567,1.433,2.125,2.125,0,0,1-.632,1.459L10.3,38.487-4.436,42.27ZM23.387,9.839h0L3.162,30.064-.327,38.621l9.154-2.892L29.052,15.5,23.387,9.839Z" transform="translate(5.102 6.536)"></path><path d="M28.7,19.1a1.987,1.987,0,0,1-1.414-.586l-7.071-7.071a2,2,0,0,1,0-2.828l6.368-6.368a2,2,0,0,1,2.829,0l7.071,7.071a2,2,0,0,1,0,2.828L30.116,18.51A1.987,1.987,0,0,1,28.7,19.1ZM27.995,5.067h0l-4.95,4.95,5.666,5.665,4.95-4.949L27.995,5.067Z" transform="translate(12.102 -0.464)"></path></g></svg>
                        <span>...</span>
                    </div>
                    <div class = "workspace_my_page_settings_art_contents_right_item md-ripples workspace_my_page_settings_art_contents_right_item_delete" onclick = "deleteButtonArtWorkspaceMyPageSettings(<?php echo $menuNumber; ?>);">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="50" height="3" rx="1.5" transform="translate(0 11)"></rect><path d="M31,39H5a5.006,5.006,0,0,1-5-5V0H4.932A2,2,0,0,0,3,2V34a2,2,0,0,0,2,2H31a2,2,0,0,0,2-2V2a2,2,0,0,0-1.914-2L36,0V34A5.006,5.006,0,0,1,31,39Z" transform="translate(7 11)"></path><path d="M5,14,0,14V5A5.006,5.006,0,0,1,5,0H21a5.006,5.006,0,0,1,5,5v9H21.007A2,2,0,0,0,23,12V5a2,2,0,0,0-2-2H5A2,2,0,0,0,3,5v7a2,2,0,0,0,2,2H5Z" transform="translate(12)"></path><rect width="3" height="15" rx="1.5" transform="translate(24 22)"></rect><rect width="3" height="15" rx="1.5" transform="translate(33 22)"></rect><rect width="3" height="15" rx="1.5" transform="translate(15 22)"></rect></g></svg>
                        <span>...</span>
                    </div>
                </div>
            </div>
        </div>
        <input type = "file" onchange = "uploadArtWorkspaceMyPageSettings(<?php echo $menuNumber; ?>, event);" accept = "image/png, image/jpeg, image/webp, image/gif, video/mp4, video/webm" style = "display: none;">
    </div>
    <div class = "workspace_my_page_settings_title" style = "margin-bottom: 10px;">
        ...
    </div>
    <div class = "create_work_input">
        <div class = "create_work_input_top">
            <div class = "create_work_input_top_title">
                ...
            </div>
        </div>
        <div class = "workspace_my_page_settings_details create_work_input_textbox" contenteditable = "true" placeholder = "..." onfocus = "create_work_input_focus(this);" onkeydown = "textbox_remove_spaces(this);" onpaste = "contenteditable_paste(event);"></div>
    </div>
</div>