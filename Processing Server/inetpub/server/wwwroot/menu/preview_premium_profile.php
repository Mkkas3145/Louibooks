<?php

    include_once('../default_function.php');

    $menuNumber = $_POST["menuNumber"];
    $userInfo = getMyLoginInfo();

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
    if ($userInfo["isLogin"] == true) {
        $myUserNumber = $userInfo["number"];
    }

    $description = "";
    if (isset($userInfo["description"])) {
        $description = $userInfo["description"];
    }

?>

<div class = "menu_user_wrap">
    <div class = "menu_user_art video_wrap">
        <video autoplay loop muted onplay = "videoLoad(event);" src = "/IMG/TEST/mylivewallpapers-com-Saki-Fuwa-Tower-of-Fantasy-4K.mp4"></video>
    </div>
    <div class = "menu_user_info">
        <div class = "menu_user_info_profile">
            <div class = "menu_user_info_profile_left">
                <div class = "menu_preview_premium_profile_left_video video_wrap">
                    <video autoplay loop muted onplay = "videoLoad(event);" src = "/IMG/TEST/mylivewallpapers-com-Spirit-Blossom-LoL.mp4"></video>
                </div>
            </div>
            <div class = "menu_user_info_profile_right">
                <div class = "menu_user_info_profile_right_nickname">
                    <?php echo $userInfo["nickname"]; ?>
                </div>
                <div class = "menu_user_info_profile_right_description" style = "display: none;"><?php echo json_encode($description); ?></div>
                <div class = "menu_user_info_profile_right_bottom">
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
            <!-- html -->
        </div>
    </div>
    <div class = "menu_user_navigation">
        <div class = "menu_user_navigation_items">
            <div class = "menu_user_navigation_item md-ripples" navigation_name = "works">
                ...
            </div>
            <div class = "menu_user_navigation_item md-ripples" navigation_name = "created_work_list">
                ...
            </div>
            <div class = "menu_user_navigation_item md-ripples" navigation_name = "community">
                ...
            </div>
        </div>
    </div>
</div>
<div class = "menu_preview_premium_profile_contents">
    <div class = "menu_preview_premium_profile_contents_icon">
        <!-- Generated by IcoMoon.io -->
        <svg style = "animation: myProfileBuyPremium 3s infinite;" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 28c-6.627 0-12-5.373-12-12s5.373-12 12-12c6.627 0 12 5.373 12 12s-5.373 12-12 12z"></path></svg>
    </div>
    <div class = "menu_preview_premium_profile_contents_title">
        ...
    </div>
    <div class = "menu_preview_premium_profile_contents_description">
        ...
    </div>
    <div class = "menu_preview_premium_profile_contents_button md-ripples" onclick = "openPopupContents('buy_premium');">
        ...
    </div>
</div>