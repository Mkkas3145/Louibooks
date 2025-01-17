<?php

    include_once('../default_function.php');
    $myUserInfo = getMyLoginInfo();

    $menuNumber = $_POST["menuNumber"];
    $userNumber = $_POST["data"];
    $userInfo = getUserInfo($userNumber)[0];

    //모든 작품의 조회수
    $stmt = $pdo->prepare("SELECT COUNT(number), SUM(views) FROM works where user_number = :user_number AND public_status = 0");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"],
    ));
    $result = $stmt->fetch();
    $countWorks = $result[0];
    $views = $result[1];
    if ($views == null) {
        $views = 0;
    }

    //
    $myUserNumber = null;
    if ($myUserInfo["isLogin"] == true) {
        $myUserNumber = $myUserInfo["number"];
    }

    $description = "";
    if (isset($userInfo["description"])) {
        $description = $userInfo["description"];
    }

?>

<div class = "menu_title" style = "display: none;">
    <?php echo $userInfo["nickname"]; ?>
</div>
<div class = "user_number" style = "display: none;">
    <?php echo $userNumber; ?>
</div>
<div class = "my_user_number" style = "display: none;">
    <?php echo $myUserNumber; ?>
</div>

<div class = "menu_user_wrap">
    <div class = "menu_user_art">
        <?php echo json_encode($userInfo["art"]); ?>
    </div>
    <div class = "menu_user_info">
        <div class = "menu_user_info_profile">
            <div class = "menu_user_info_profile_left">
                <div class = "profile_element">
                    <div class = "profile_info"><?php echo json_encode($userInfo["profile"]) ?></div>
                    <div class = "profile_image"></div>
                </div>
            </div>
            <div class = "menu_user_info_profile_right">
                <div class = "menu_user_info_profile_right_nickname">
                    <?php echo $userInfo["nickname"]; ?>
                </div>
                <div class = "menu_user_info_profile_right_description" style = "display: none;"><?php echo json_encode($description); ?></div>
                <div class = "menu_user_info_profile_right_bottom">
                    <div class="menu_user_info_profile_right_bottom_item" value = "<?php echo $userInfo["partner"]; ?>">
                        ...
                    </div>
                    <div class="menu_user_info_profile_right_bottom_item" value = "<?php echo $countWorks; ?>">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M23.709,37.886h0L0,24.772,23.71,12.207,49.543,24.772,23.71,37.886Zm.134-22.5L6.133,24.772l17.71,9.8,19.3-9.8Z" transform="translate(0.228 -11.772)"></path><g transform="translate(1.456)"><path d="M1.451-.035A1.6,1.6,0,0,1,3,1.543L3.434,25.3a1.466,1.466,0,0,1-1.488,1.521A1.6,1.6,0,0,1,.4,25.244L-.037,1.486A1.466,1.466,0,0,1,1.451-.035Z" transform="translate(-0.648 25.64) rotate(-60)"></path><path d="M2.639.067A1.466,1.466,0,0,1,4.127,1.588L3.689,25.347a1.6,1.6,0,0,1-1.545,1.578A1.466,1.466,0,0,1,.656,25.4L1.094,1.645A1.6,1.6,0,0,1,2.639.067Z" transform="translate(43.172 22.047) rotate(60)"></path></g><g transform="translate(1.456 11)"><path d="M1.451-.035A1.6,1.6,0,0,1,3,1.543L3.434,25.3a1.466,1.466,0,0,1-1.488,1.521A1.6,1.6,0,0,1,.4,25.244L-.037,1.486A1.466,1.466,0,0,1,1.451-.035Z" transform="translate(-0.648 25.64) rotate(-60)"></path><path d="M2.639.067A1.466,1.466,0,0,1,4.127,1.588L3.689,25.347a1.6,1.6,0,0,1-1.545,1.578A1.466,1.466,0,0,1,.656,25.4L1.094,1.645A1.6,1.6,0,0,1,2.639.067Z" transform="translate(43.172 22.047) rotate(60)"></path></g></g></svg>
                        <span>...</span>
                    </div>
                    <div class="menu_user_info_profile_right_bottom_item" value = "<?php echo $views; ?>">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,37a21.437,21.437,0,0,1-9.731-2.508,34.262,34.262,0,0,1-7.947-5.721A39.4,39.4,0,0,1,1.965,22.54,10.312,10.312,0,0,1,0,18.5a10.313,10.313,0,0,1,1.965-4.04A39.4,39.4,0,0,1,7.323,8.229a34.261,34.261,0,0,1,7.947-5.721A21.437,21.437,0,0,1,25,0a21.236,21.236,0,0,1,9.728,2.538A34.517,34.517,0,0,1,42.67,8.311a40.627,40.627,0,0,1,5.357,6.242A10.518,10.518,0,0,1,50,18.5c.01,1.175-2.446,5.3-6.467,9.358a35.762,35.762,0,0,1-8.228,6.3A21.562,21.562,0,0,1,25,37ZM25,2.964C13.381,2.964,3.264,16.237,3.264,18.5S13.381,34.036,25,34.036c7.276,0,13.532-5.214,16.613-8.322,3.016-3.042,5.109-6.244,5.1-7.214-.009-1.079-2.552-4.948-6.516-8.557C36.7,6.759,31.227,2.964,25,2.964Z" transform="translate(0 7)"></path><path d="M9.5,19A9.5,9.5,0,0,1,2.783,2.783,9.5,9.5,0,0,1,16.217,16.217,9.437,9.437,0,0,1,9.5,19Zm0-16.026A6.526,6.526,0,1,0,16.026,9.5,6.534,6.534,0,0,0,9.5,2.974Z" transform="translate(16 16)"></path></g></svg>
                        <span>...</span>
                    </div>
                    <div class="menu_user_info_profile_right_bottom_item" value = "<?php echo $userInfo["user_list_save_count"]; ?>">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,22A11,11,0,0,1,3.222,3.222,11,11,0,1,1,18.778,18.778,10.928,10.928,0,0,1,11,22ZM11,3a8,8,0,1,0,8,8A8.009,8.009,0,0,0,11,3Z" transform="translate(14)"></path><path d="M29.719,61H19A19,19,0,0,1,0,42V24A19,19,0,0,1,19,5h8.569a18.6,18.6,0,0,0-2.918,3.5H18.719a16.018,16.018,0,0,0-16,16v18a16.018,16.018,0,0,0,16,16h11a16.018,16.018,0,0,0,16-16V36.169a18.429,18.429,0,0,0,3-1.233V42a19,19,0,0,1-19,19Z" transform="translate(1.281 20)"></path><g transform="translate(1.849 -0.459)"><rect width="3" height="17" rx="1.5" transform="translate(23.151 35.438) rotate(-45)"></rect><rect width="3" height="23" rx="1.5" transform="translate(44.884 26.041) rotate(30)"></rect></g></g></svg>
                        <span>...</span>
                    </div>
                </div>
            </div>
        </div>
        <div class = "menu_user_info_right">
            <div class = "menu_user_info_right_management_button md-ripples" style = "display: none;" onclick = "loadWorkspace_my_page_settings();" onmouseenter = "hoverInformation(this, getLanguage('menu_user_my_page_settings'));">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-4.438,42.27v0L.4,28.587,21.847,7.145a2.12,2.12,0,0,1,1.506-.632,1.945,1.945,0,0,1,1.387.567l7.071,7.071a1.944,1.944,0,0,1,.567,1.433,2.125,2.125,0,0,1-.632,1.459L10.3,38.487-4.436,42.27ZM23.387,9.839h0L3.162,30.064-.327,38.621l9.154-2.892L29.052,15.5,23.387,9.839Z" transform="translate(5.102 6.536)"></path><path d="M28.7,19.1a1.987,1.987,0,0,1-1.414-.586l-7.071-7.071a2,2,0,0,1,0-2.828l6.368-6.368a2,2,0,0,1,2.829,0l7.071,7.071a2,2,0,0,1,0,2.828L30.116,18.51A1.987,1.987,0,0,1,28.7,19.1ZM27.995,5.067h0l-4.95,4.95,5.666,5.665,4.95-4.949L27.995,5.067Z" transform="translate(12.102 -0.464)"></path></g></svg>
                <span>...</span>
            </div>
            <div class = "menu_user_info_right_save_button md-ripples" checked = "false" onclick = "toggleMenuUserSaveUserList(<?php echo $menuNumber; ?>);">
                <div class = "menu_user_info_right_save_button_0" onmouseenter = "hoverInformation(this, getLanguage('menu_user_save_user_list_0'));">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17 21v-2c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464h-7c-1.38 0-2.632 0.561-3.536 1.464s-1.464 2.156-1.464 3.536v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2c0-0.829 0.335-1.577 0.879-2.121s1.292-0.879 2.121-0.879h7c0.829 0 1.577 0.335 2.121 0.879s0.879 1.292 0.879 2.121v2c0 0.552 0.448 1 1 1s1-0.448 1-1zM13.5 7c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464-2.632 0.561-3.536 1.464-1.464 2.156-1.464 3.536 0.561 2.632 1.464 3.536 2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464 1.464-2.156 1.464-3.536zM11.5 7c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121 0.335-1.577 0.879-2.121 1.292-0.879 2.121-0.879 1.577 0.335 2.121 0.879 0.879 1.292 0.879 2.121zM23 10h-2v-2c0-0.552-0.448-1-1-1s-1 0.448-1 1v2h-2c-0.552 0-1 0.448-1 1s0.448 1 1 1h2v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2h2c0.552 0 1-0.448 1-1s-0.448-1-1-1z"></path></svg>
                    <span>...</span>
                </div>
                <div class = "menu_user_info_right_save_button_1" onmouseenter = "hoverInformation(this, getLanguage('menu_user_save_user_list_1'));">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17 21v-2c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464h-7c-1.38 0-2.632 0.561-3.536 1.464s-1.464 2.156-1.464 3.536v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2c0-0.829 0.335-1.577 0.879-2.121s1.292-0.879 2.121-0.879h7c0.829 0 1.577 0.335 2.121 0.879s0.879 1.292 0.879 2.121v2c0 0.552 0.448 1 1 1s1-0.448 1-1zM13.5 7c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464-2.632 0.561-3.536 1.464-1.464 2.156-1.464 3.536 0.561 2.632 1.464 3.536 2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464 1.464-2.156 1.464-3.536zM11.5 7c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121 0.335-1.577 0.879-2.121 1.292-0.879 2.121-0.879 1.577 0.335 2.121 0.879 0.879 1.292 0.879 2.121zM16.293 11.707l2 2c0.391 0.391 1.024 0.391 1.414 0l4-4c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-3.293 3.293-1.293-1.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path></svg>
                    <span>...</span>
                </div>
            </div>
        </div>
    </div>
    <div class = "menu_user_navigation">
        <div class = "menu_user_navigation_items">
            <div class = "menu_user_navigation_item md-ripples" navigation_name = "works" onclick = "requestUserNavigation(<?php echo $menuNumber; ?>, 'works');">
                ...
            </div>
            <div class = "menu_user_navigation_item md-ripples" navigation_name = "created_work_list" onclick = "requestUserNavigation(<?php echo $menuNumber; ?>, 'created_work_list');">
                ...
            </div>
            <div class = "menu_user_navigation_item md-ripples" navigation_name = "community" onclick = "requestUserNavigation(<?php echo $menuNumber; ?>, 'community');">
                ...
            </div>
        </div>
        <div class = "menu_user_navigation_lines">
            <div class="menu_user_navigation_line"></div>
        </div>
    </div>
</div>
<div class = "menu_user_contents">
    <?php include_once('./user_navigation/works.php'); ?>
</div>