<?php

    include_once('../default_function.php');
    $userInfo = getMyLoginInfo();

    $menuNumber = $_POST["menuNumber"];
    $data = json_decode($_POST["data"], true);
    $workNumber = $data["number"];
    $visitType = $data["visitType"];
    $incomingUrl = null;
    if (isset($data["incomingUrl"])) {
        $incomingUrl = $data["incomingUrl"];
    }

    $work = getWorkInfo($workNumber)[0];
    $workNumber = $work["number"];

    if ($work["status"] == 1) {
        echo 'no_permission';
        exit;
    } else if ($work["status"] == 2) {
        echo 'deleted';
        exit;
    }

    $work_cover = $work["cover_image"];
    if ($work_cover == null) {
        $work_cover = $work["default_cover_image"];
    }

    $isCreator = false;
    if ($userInfo["isLogin"] == true) {
        if ($work["user_number"] == $userInfo["number"]) {
            $isCreator = true;
        }
    }

    //다음 회차 구하기
    $stmt = $pdo->prepare("SELECT number FROM work_part WHERE work_number = :work_number AND public_status = 0");
    $stmt->execute(array(
        ':work_number' => $workNumber,
    ));
    $partList = $stmt->fetchAll();
    $partList_count = count($partList);
    //
    $nextPartNumber = null;
    $nextPartType = 'next_part';
    if ($partList_count != 0) {
        $partViewed = null;
        $user_ip = base64_encode(hash('sha256', getClientIp(), true));

        if ($userInfo["isLogin"] == true) {
            $stmt = $pdo->prepare("SELECT part_number, percent FROM work_part_viewed WHERE work_number = :work_number AND public_status = 0 AND user_number = :user_number");
            $stmt->execute(array(
                ':work_number' => $workNumber,
                ':user_number' => $userInfo["number"],
            ));
            $partViewed = $stmt->fetchAll();
        } else {
            $stmt = $pdo->prepare("SELECT part_number, percent FROM work_part_viewed WHERE work_number = :work_number AND public_status = 0 AND ip = :ip");
            $stmt->execute(array(
                ':work_number' => $workNumber,
                ':ip' => $user_ip,
            ));
            $partViewed = $stmt->fetchAll();
        }

        $partViewed_count = count($partViewed);
        $viewed = array();
        $continueViewed = array();
        for ($i = 0; $i < $partViewed_count; $i++) {
            if ($partViewed[$i]["percent"] != 1) {
                $continueViewed[$partViewed[$i]["part_number"]] = true;
            }
            $viewed[$partViewed[$i]["part_number"]] = true;
        }
        for ($i = 0; $i < $partList_count; $i++) {
            if (isset($continueViewed[$partList[$i]["number"]]) == true) {
                $nextPartType = "continue_viewed";
                $nextPartNumber = $partList[$i]["number"];
                break;
            } else if (isset($viewed[$partList[$i]["number"]]) == false) {
                $nextPartNumber = $partList[$i]["number"];
                break;
            } else if ($i == ($partList_count - 1)) {
                $nextPartType = "all_viewed";
                $nextPartNumber = $partList[$i]["number"];
                break;
            }
        }
    }
    if ($nextPartNumber == null) {
        ($partList_count != 0) ? $nextPartNumber = $partList[0]["number"] : null;
    }
    $nextPartInfo = null;
    if ($nextPartNumber != null) {
        $nextPartInfo = getWorkPartInfo($nextPartNumber)[0];
    }
    //첫번째 회차 인지
    if ($nextPartType != "all_viewed" && $nextPartType != "continue_viewed" && $partList_count != 0 && $partList[0]["number"] == $nextPartNumber) {
        $nextPartType = "first_part";
    }

    //성인 관련
    $disableAdult = false;
    if (isset($work["disable_adult"])) {
        $disableAdult = $work["disable_adult"];
    }
    $adultQuestions = false;
    if (isset($work["adult_questions"])) {
        $adultQuestions = $work["adult_questions"];
    }

?>

<div class = "next_part_info" style = "display: none;">
    <?php 
        echo json_encode(array(
            'type' => $nextPartType,
            'info' => $nextPartInfo
        ));
    ?>
</div>
<div class = "menu_title" style = "display: none;">
    <?php echo $work["title"]; ?>
</div>
<div class = "work_number" style = "display: none;">
    <?php echo $work["number"]; ?>
</div>
<div class = "visit_type" style = "display: none;">
    <?php echo $visitType; ?>
</div>
<div class = "incoming_url" style = "display: none;">
    <?php echo $incomingUrl; ?>
</div>
<div class = "is_creator" style = "display: none;">
    <?php echo $isCreator; ?>
</div>
<div class = "disable_adult" style = "display: none;">
    <?php echo $disableAdult; ?>
</div>
<div class = "adult_questions" style = "display: none;">
    <?php echo $adultQuestions; ?>
</div>

<!-- 모바일 다음 회차 -->
<div class = "menu_work_next_part_mobile">
    <div class = "menu_work_next_part_mobile_box md-ripples"></div>
</div>
<div class = "menu_work_art img_wrap">
    <div class = "menu_work_art_top">
        <div class = "menu_work_art_top_wrap">
            <div class = "menu_work_art_top_back_button md-ripples" onclick = "history.back();" onmouseenter = "hoverInformation(this, getLanguage('back'));">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"></rect><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"></rect></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"></rect></g></svg>
            </div>
            <?php
                if ($userInfo["isLogin"] == true && $work["user_number"] == $userInfo["number"]) {
                    echo '
                        <div class = "menu_work_art_top_upload_image md-ripples" onclick = "openPopupContents(\'work_art_upload\', null, ' . $work["number"] . ');" onmouseenter = "hoverInformation(this, getLanguage(\'work_art_upload\'));">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M16.88 9.1c1.795 0.419 3.111 2.006 3.111 3.9 0 2.206-1.786 3.995-3.991 4h-11c-0.001 0-0.003 0-0.005 0-2.761 0-5-2.239-5-5 0-2.409 1.704-4.421 3.973-4.894l0.032-0.006v-0.1c0-0.001 0-0.002 0-0.004 0-1.657 1.343-3 3-3 0.56 0 1.085 0.154 1.534 0.421l-0.014-0.008c0.899-0.889 2.136-1.438 3.5-1.438 2.75 0 4.98 2.23 4.98 4.98 0 0.017-0 0.033-0 0.050l0-0.003c0 0.38-0.040 0.74-0.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z"></path></svg>
                        </div>
                    ';
                }
            ?>
        </div>
    </div>
    <div class = "menu_work_art_image md-ripples">
        <img src = "<?php echo $work["art_image"]; ?>" onload = "imageLoad(event);">
    </div>
</div>
<div class = "menu_work_wrap">
    <div class = "menu_work_info_wrap">
        <div class = "menu_work_info">
            <div class = "menu_work_info_cover img_wrap md-ripples">
                <img src = "<?php echo $work_cover; ?>" onload = "imageLoad(event);">
            </div>
            <div class = "menu_work_info_right">
                <div class = "menu_work_info_right_title">
                    <div class = "menu_work_info_right_title_left">
                        <div class = "menu_work_info_right_title_left_text">
                            <?php echo $work["title"]; ?>
                        </div>
                        <div class = "menu_work_info_right_originator">
                            <div class = "menu_work_info_right_originator_left md-ripples" onclick = "loadMenu_user(<?php echo $work["originator"]["number"]; ?>);">
                                <div class = "menu_work_info_right_originator_left_profile img_wrap">
                                    <div class = "profile_element">
                                        <div class = "profile_info"><?php echo json_encode($work["originator"]["profile"]); ?></div>
                                        <div class = "profile_image"></div>
                                    </div>
                                </div>
                                <div class = "menu_work_info_right_originator_left_nickname">
                                    <?php echo $work["originator"]["nickname"]; ?>
                                </div>
                            </div>
                        </div>
                        <div class = "menu_work_info_right_info_items">
                            <div class = "menu_work_info_right_info_item" type = "partner">
                                <?php echo $work["originator"]["partner"]; ?>
                            </div>
                            <div class = "menu_work_info_right_info_item" type = "average_score">
                                <svg style = "margin-right: 7px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-161.3,48.508a.992.992,0,0,1-.583-.194l-12.534-9.07a1,1,0,0,0-.586-.19,1,1,0,0,0-.586.19l-12.534,9.07a.99.99,0,0,1-.583.194,1.021,1.021,0,0,1-.808-.407.971.971,0,0,1-.158-.869l4.378-15.5a1,1,0,0,0-.335-1.05L-197.884,20.8a.978.978,0,0,1-.32-1.1.979.979,0,0,1,.921-.68l15.335-.412a1,1,0,0,0,.921-.681l5.08-15.112A.987.987,0,0,1-175,2.139a.987.987,0,0,1,.948.681l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a.979.979,0,0,1,.921.68.978.978,0,0,1-.32,1.1l-12.256,9.877a1,1,0,0,0-.336,1.05l4.378,15.5a.972.972,0,0,1-.158.869A1.021,1.021,0,0,1-161.3,48.508Zm-13.655-12.455a3.809,3.809,0,0,1,2.185.7c2.2,1.509,7.989,5.785,8.047,5.828l-2.968-10.516a4,4,0,0,1,1.281-3.609c1.666-1.266,8.107-6.541,8.172-6.594l-10.031-.219h-.027a3.779,3.779,0,0,1-3.488-2.781c-.969-2.829-3.213-9.345-3.235-9.407l-3.235,9.734c-.011.024-1.121,2.438-3.5,2.453-2.4.015-9.925.233-10,.235l8.407,6.844a3.748,3.748,0,0,1,.968,3.687l-2.844,10.11,8.063-5.828A4.312,4.312,0,0,1-174.951,36.053Z" transform="translate(200)"></path></g></svg>
                                <span><?php echo $work["ratings"]["averageScore"]; ?></span>
                            </div>
                            <div class = "menu_work_info_right_info_item" type = "views">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,37a21.437,21.437,0,0,1-9.731-2.508,34.262,34.262,0,0,1-7.947-5.721A39.4,39.4,0,0,1,1.965,22.54,10.312,10.312,0,0,1,0,18.5a10.313,10.313,0,0,1,1.965-4.04A39.4,39.4,0,0,1,7.323,8.229a34.261,34.261,0,0,1,7.947-5.721A21.437,21.437,0,0,1,25,0a21.236,21.236,0,0,1,9.728,2.538A34.517,34.517,0,0,1,42.67,8.311a40.627,40.627,0,0,1,5.357,6.242A10.518,10.518,0,0,1,50,18.5c.01,1.175-2.446,5.3-6.467,9.358a35.762,35.762,0,0,1-8.228,6.3A21.562,21.562,0,0,1,25,37ZM25,2.964C13.381,2.964,3.264,16.237,3.264,18.5S13.381,34.036,25,34.036c7.276,0,13.532-5.214,16.613-8.322,3.016-3.042,5.109-6.244,5.1-7.214-.009-1.079-2.552-4.948-6.516-8.557C36.7,6.759,31.227,2.964,25,2.964Z" transform="translate(0 7)"></path><path d="M9.5,19A9.5,9.5,0,0,1,2.783,2.783,9.5,9.5,0,0,1,16.217,16.217,9.437,9.437,0,0,1,9.5,19Zm0-16.026A6.526,6.526,0,1,0,16.026,9.5,6.534,6.534,0,0,0,9.5,2.974Z" transform="translate(16 16)"></path></g></svg>
                                <span><?php echo $work["views"]; ?></span>
                            </div>
                            <div class = "menu_work_info_right_info_item" type = "part_count">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M27,30H3a3,3,0,0,1-3-3V3A3,3,0,0,1,3,0H27a3,3,0,0,1,3,3V27A3,3,0,0,1,27,30ZM2.647,2.647V27.353H27.353V2.647Z" transform="translate(0 20)"></path><rect width="32" height="3" rx="1.5" transform="translate(8 10)"></rect><rect width="31" height="3" rx="1.5" transform="translate(40 10) rotate(90)"></rect><rect width="32" height="3" rx="1.5" transform="translate(18)"></rect><rect width="32" height="3" rx="1.5" transform="translate(50) rotate(90)"></rect></g></svg>
                                <span><?php echo $work["part"]; ?></span>
                            </div>
                            <div class = "menu_work_info_right_info_item" type = "work_type">
                                <?php echo $work["contents_type"]; ?>
                            </div>
                            <div class = "menu_work_info_right_info_item" type = "user_age" style = "padding-left: 10px;">
                                <?php echo $work["user_age"]; ?>
                            </div>
                        </div>
                        <div class = "menu_work_info_right_description">
                            <div class = "menu_work_info_right_description_text"><?php echo str_replace("\n\r", "​", $work["description"]); ?><div class = "menu_work_info_right_description_genre"><?php echo $work["genre"]; ?></div></div>
                        </div>
                        <div class = "menu_work_info_right_description_read_more md-ripples" value = "0" onclick = "toggleMenuWorkDescriptionReadMore(<?php echo $menuNumber; ?>);">
                            <div class = "menu_work_info_right_description_read_more_0">
                                <span>...</span>
                                <!-- Generated by IcoMoon.io -->
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17.418 6.109c0.272-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-7.908 7.83c-0.27 0.268-0.707 0.268-0.979 0l-7.908-7.83c-0.27-0.268-0.27-0.701 0-0.969s0.709-0.268 0.979 0l7.419 7.141 7.418-7.141z"></path></svg>
                            </div>
                            <div class = "menu_work_info_right_description_read_more_1">
                                <span>...</span>
                                <!-- Generated by IcoMoon.io -->
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.582 13.891c-0.272 0.268-0.709 0.268-0.979 0s-0.271-0.701 0-0.969l7.908-7.83c0.27-0.268 0.707-0.268 0.979 0l7.908 7.83c0.27 0.268 0.27 0.701 0 0.969s-0.709 0.268-0.978 0l-7.42-7.141-7.418 7.141z"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div class = "menu_work_info_right_line"></div>
                <div class = "menu_work_info_right_bottom">
                    <div class = "menu_work_info_right_bottom_items">
                        <div class = "menu_work_info_right_bottom_management md-ripples" onclick = "loadWorkspace_work_details(<?php echo $work["number"]; ?>);" onmouseenter = "hoverInformation(this, getLanguage('menu_work_management_button'));">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-4.438,42.27v0L.4,28.587,21.847,7.145a2.12,2.12,0,0,1,1.506-.632,1.945,1.945,0,0,1,1.387.567l7.071,7.071a1.944,1.944,0,0,1,.567,1.433,2.125,2.125,0,0,1-.632,1.459L10.3,38.487-4.436,42.27ZM23.387,9.839h0L3.162,30.064-.327,38.621l9.154-2.892L29.052,15.5,23.387,9.839Z" transform="translate(5.102 6.536)"></path><path d="M28.7,19.1a1.987,1.987,0,0,1-1.414-.586l-7.071-7.071a2,2,0,0,1,0-2.828l6.368-6.368a2,2,0,0,1,2.829,0l7.071,7.071a2,2,0,0,1,0,2.828L30.116,18.51A1.987,1.987,0,0,1,28.7,19.1ZM27.995,5.067h0l-4.95,4.95,5.666,5.665,4.95-4.949L27.995,5.067Z" transform="translate(12.102 -0.464)"></path></g></svg>
                        </div>
                        <div class = "menu_work_info_next_part_button md-ripples">
                            ...
                        </div>
                        <div class = "menu_work_info_right_bottom_right">
                            <?php
                                //내 작품은 알림 설정 불가
                                $notificationsSettingsStyle = "";
                                if ($userInfo["isLogin"] == true && $work["user_number"] == $userInfo["number"]) {
                                    $notificationsSettingsStyle = "display: none;";
                                }
                            ?>
                            <div class = "menu_work_info_right_bottom_right_item md-ripples" style = "<?php echo $notificationsSettingsStyle; ?>" value = "<?php echo $work["notifications_settings"]; ?>" type = "notifications_settings" work_number = "<?php echo $workNumber; ?>" onchange = "requestWorkNotificationsSettings(<?php echo $workNumber; ?>, this.getAttribute('value'));" popupwidth = "max-content" onclick = "(loginStatus['isLogin'] == false) ? loadMenu_login() : selectList(this, getMenuWorkNotificationsSettingsItems());" onmouseenter = "hoverInformation(this, getLanguage('menu_work_notifications'));">
                                <div class = "menu_work_info_right_bottom_right_item_2">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M21.026-.544C27.557-.544,37.1,5.2,37.182,17.5c.246,17.883,8.487,21.471,3.614,21.348H.083c-4.466.05,3.6-3.546,4.093-21.348C4.259,3.8,14.021-.544,21.026-.544Z" transform="translate(4.383 0.922)"/><path d="M16.939-.544c5.739.056,13.127,4.863,13.194,15.285.157,11.479,3.888,18.093,3.888,18.093L-.9,32.84s3.872-7.043,4.048-18.1C3.216,3.138,10.744-.556,16.939-.544Z" transform="translate(8.401 3.948)"/><path d="M6.4,0a6.4,6.4,0,0,1,6.4,6.4H0A6.4,6.4,0,0,1,6.4,0Z" transform="translate(30.704 50) rotate(180)"/><path d="M8.583.607a1.307,1.307,0,0,1-.192,1.83A14.28,14.28,0,0,0,4.343,8.372,23.949,23.949,0,0,0,3,17.5a1.5,1.5,0,0,1-3,0S-.171,11.456,1.5,7.282A18.529,18.529,0,0,1,6.6.41,1.731,1.731,0,0,1,8.583.607Z" transform="translate(0.005 0.24)"/><path d="M.282.61A1.314,1.314,0,0,0,.475,2.45,14.364,14.364,0,0,1,4.546,8.42,24.089,24.089,0,0,1,5.9,17.6a1.509,1.509,0,0,0,3.018,0s.172-6.079-1.509-10.277A18.637,18.637,0,0,0,2.28.411,1.742,1.742,0,0,0,.282.61Z" transform="translate(41.08 0.186)"/></g></svg>
                                </div>
                                <div class = "menu_work_info_right_bottom_right_item_1">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M42.282,39.4h0l-.226,0H1.251C.557,39.4.2,39.3.065,39.075c-.221-.363.152-1.085.769-2.282,1.4-2.715,4.315-8.364,4.6-18.745a21.434,21.434,0,0,1,1.682-8.6,15.31,15.31,0,0,1,4.146-5.562A17.322,17.322,0,0,1,22.285,0a16.042,16.042,0,0,1,10.5,4.409,18.085,18.085,0,0,1,5.659,13.638c.141,10.246,2.863,15.713,4.326,18.65.617,1.238.989,1.986.755,2.364C43.375,39.3,43,39.4,42.282,39.4ZM22.187,3.026c-6.61,0-13.7,4.015-13.76,15.285a46.872,46.872,0,0,1-2.09,13.2,29.949,29.949,0,0,1-1.958,4.9L39.3,36.4s0,0-.006-.009a27.524,27.524,0,0,1-1.879-4.733,47.874,47.874,0,0,1-2-13.351C35.34,7.268,27.28,3.075,22.217,3.026Z" transform="translate(3.124 0.378)"/><path d="M6.4,0a6.4,6.4,0,0,1,6.4,6.4H0A6.4,6.4,0,0,1,6.4,0Z" transform="translate(30.704 50) rotate(180)"/></g></svg>
                                </div>
                                <div class = "menu_work_info_right_bottom_right_item_0">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M42.282,39.4h0l-.226,0H1.251C.557,39.4.2,39.3.065,39.075c-.221-.363.152-1.085.769-2.282,1.4-2.715,4.315-8.364,4.6-18.745a21.434,21.434,0,0,1,1.682-8.6,15.31,15.31,0,0,1,4.146-5.562A17.322,17.322,0,0,1,22.285,0a16.042,16.042,0,0,1,10.5,4.409,18.085,18.085,0,0,1,5.659,13.638c.141,10.246,2.863,15.713,4.326,18.65.617,1.238.989,1.986.755,2.364C43.375,39.3,43,39.4,42.282,39.4ZM22.187,3.026c-6.61,0-13.7,4.015-13.76,15.285a46.872,46.872,0,0,1-2.09,13.2,29.949,29.949,0,0,1-1.958,4.9L39.3,36.4s0,0-.006-.009a27.524,27.524,0,0,1-1.879-4.733,47.874,47.874,0,0,1-2-13.351C35.34,7.268,27.28,3.075,22.217,3.026Z" transform="translate(3.124 0.378)"/><path d="M6.4,0a6.4,6.4,0,0,1,6.4,6.4H0A6.4,6.4,0,0,1,6.4,0Z" transform="translate(30.704 50) rotate(180)"/><rect width="3" height="62" rx="1.5" transform="translate(2.019 4.14) rotate(-45)"/></g></svg>
                                </div>
                            </div>
                            <div class = "menu_work_info_right_bottom_right_item md-ripples" checked = "false" type = "work_list" work_number = "<?php echo $workNumber; ?>" checked = "false" onclick = "popupWorkList(this, <?php echo $workNumber; ?>);" onmouseenter = "hoverInformation(this, getLanguage('menu_work_bottom_button:work_list'));">
                                <div class = "menu_work_info_right_bottom_right_item_0">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="37" height="3" rx="1.5" transform="translate(1 2)"/><rect width="37" height="3" rx="1.5" transform="translate(1 18)"/><rect width="20" height="3" rx="1.5" transform="translate(1 34)"/><g transform="translate(1 -1)"><g transform="translate(-0.075 1.515)"><rect width="3.678" height="23.098" rx="1.839" transform="translate(25.075 36.713) rotate(-90)"/></g><g transform="translate(71.018 -0.075) rotate(90)"><rect width="3.434" height="23.098" rx="1.717" transform="translate(25.075 36.469) rotate(-90)"/></g></g></g></svg>
                                </div>
                                <div class = "menu_work_info_right_bottom_right_item_1">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="37" height="3" rx="1.5" transform="translate(1 2)"/><rect width="37" height="3" rx="1.5" transform="translate(1 18)"/><rect width="20" height="3" rx="1.5" transform="translate(1 34)"/><g transform="translate(2.518 0.541)"><rect width="3" height="17" rx="1.5" transform="translate(23.151 35.438) rotate(-45)"/><rect width="3" height="23" rx="1.5" transform="translate(44.884 26.041) rotate(30)"/></g></g></svg>
                                </div>
                            </div>
                            <div class = "menu_work_info_right_bottom_right_item md-ripples" onclick = "menuWorkShare(<?php echo $menuNumber; ?>);" onmouseenter = "hoverInformation(this, getLanguage('menu_work_bottom_button:share'));">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="22" transform="translate(32.74 10.201) rotate(60)"/><rect width="3" height="22" transform="translate(34.437 37.201) rotate(120)"/><path d="M8,16a8,8,0,1,1,8-8A8.009,8.009,0,0,1,8,16ZM8,3a5,5,0,1,0,5,5A5.006,5.006,0,0,0,8,3Z" transform="translate(32)"/><path d="M8,16a8,8,0,1,1,8-8A8.009,8.009,0,0,1,8,16ZM8,3a5,5,0,1,0,5,5A5.006,5.006,0,0,0,8,3Z" transform="translate(1 17)"/><path d="M8,16a8,8,0,1,1,8-8A8.009,8.009,0,0,1,8,16ZM8,3a5,5,0,1,0,5,5A5.006,5.006,0,0,0,8,3Z" transform="translate(32 33)"/></g></svg>
                            </div>
                            <div class = "menu_work_info_right_bottom_right_item md-ripples" onclick = "menuWorkMoreButton(this, <?php echo $menuNumber; ?>, <?php echo $work["user_number"]; ?>, <?php echo $work["number"]; ?>);" onmouseenter = "hoverInformation(this, getLanguage('view_more'));">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-1 -1.061)"><circle cx="3" cy="3" r="3" transform="translate(23 4)"></circle><path d="M3,0A2.971,2.971,0,0,1,6,2.942,2.971,2.971,0,0,1,3,5.884,2.971,2.971,0,0,1,0,2.942,2.971,2.971,0,0,1,3,0Z" transform="translate(23 23)"></path><path d="M3,0A3.031,3.031,0,0,1,6,3.061,3.031,3.031,0,0,1,3,6.121,3.031,3.031,0,0,1,0,3.061,3.031,3.031,0,0,1,3,0Z" transform="translate(23 42)"></path></g></g></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class = "menu_work_navigation scroll">
            <div class = "menu_work_navigation_items">
                <div class = "menu_work_navigation_item md-ripples" navigation_name = "home" onclick = "requestWorkNavigation(<?php echo $menuNumber; ?>, 'home');">
                    ...
                </div>
                <div class = "menu_work_navigation_item md-ripples" navigation_name = "part_list" onclick = "requestWorkNavigation(<?php echo $menuNumber; ?>, 'part_list');">
                    ...
                </div>
                <div class = "menu_work_navigation_item md-ripples" navigation_name = "ratings" onclick = "requestWorkNavigation(<?php echo $menuNumber; ?>, 'ratings');">
                    ...
                </div>
                <div class = "menu_work_navigation_item md-ripples" navigation_name = "comments" onclick = "requestWorkNavigation(<?php echo $menuNumber; ?>, 'comments');">
                    ...
                </div>
                <div class = "menu_work_navigation_item md-ripples" navigation_name = "community" onclick = "requestWorkNavigation(<?php echo $menuNumber; ?>, 'community');">
                    ...
                </div>
                <div class = "menu_work_navigation_item md-ripples" style = "display: none;" navigation_name = "related_works" onclick = "requestWorkNavigation(<?php echo $menuNumber; ?>, 'related_works');">
                    ...
                </div>
                <div class = "menu_work_navigation_item md-ripples" navigation_name = "details" onclick = "requestWorkNavigation(<?php echo $menuNumber; ?>, 'details');">
                    ...
                </div>
            </div>
            <div class = "menu_work_navigation_lines">
                <div class = "menu_work_navigation_line"></div>
            </div>
        </div>
    </div>
</div>
<div class = "menu_work_contents">
    <?php include_once('./work_navigation/home.php'); ?>
</div>