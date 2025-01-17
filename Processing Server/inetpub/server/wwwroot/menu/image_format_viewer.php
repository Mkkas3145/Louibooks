<?php

    include_once('../default_function.php');
    $userInfo = getMyLoginInfo();

    $menuNumber = $_POST["menuNumber"];
    $data = json_decode($_POST["data"], true);
    $partNumber = $data["number"];
    $contentsLanguage = null;
    (isset($data["contentsLanguage"]) == true) ? $contentsLanguage = $data["contentsLanguage"] : null;

    $partInfo = getWorkPartInfo($partNumber, $contentsLanguage, true)[0];
    $workInfo = getWorkInfo($partInfo["work_number"])[0];

    //번역 살펴보기
    if ($userInfo["isLogin"] == true && $partInfo["user_number"] == $userInfo["number"] && isset($data["userTranslationNumber"])) {
        $stmt = $pdo->prepare("SELECT title, thumbnail_image, data, language FROM work_part_user_translation WHERE number = :number");
        $stmt->execute(array(
            ':number' => $data["userTranslationNumber"]
        ));
        $userTranslation = $stmt->fetch();

        $partInfo["title"] = $userTranslation["title"];
        $partInfo["data"] = json_decode($userTranslation["data"], true);
        $partInfo["language"] = $userTranslation["language"];
        if (isset($userTranslation["thumbnail_image"])) {
            $partInfo["thumbnail_image"] = $userTranslation["thumbnail_image"];
        }
    }

    //댓글 정보
    $commentsUid = "part_" . $partInfo["number"];
    $commentsSort = 0; //인기 댓글 순
    $commentsNumbers = getCommentsNumbers($commentsUid, $commentsSort);
    $numbers = explode(",", $commentsNumbers);

    $commentsInfoMaxCount = (count($numbers) >= 20) ? 20 : count($numbers);
    $commentsInfo = getCommentsInfo(implode(",", array_slice($numbers, 0, $commentsInfoMaxCount)));

    //회차 리스트 정보
    $stmt = $pdo->prepare("SELECT number FROM work_part WHERE work_number = :work_number AND (public_status = 0 OR number = :number)");
    $stmt->execute(array(
        ':number' => $partInfo["number"],
        ':work_number' => $workInfo["number"]
    ));
    $partList = $stmt->fetchAll();
    $partListNumbers = array();
    $partListCount = count($partList);

    $currentPartNumberIndex = null;
    for ($i = 0; $i < $partListCount; $i++) {
        if ($partInfo["number"] == $partList[$i]["number"]) {
            $currentPartNumberIndex = $i;
        }
        $partListNumbers[$i] = $partList[$i]["number"];
    }

    $maxCount = 20;
    $removeIndex = $maxCount;
    if (($currentPartNumberIndex + $maxCount) > ($partListCount - 1)) {
        $removeIndex += ($currentPartNumberIndex + $maxCount) - ($partListCount - 1);
    }
    $minIndex = $currentPartNumberIndex - $removeIndex;
    if ($minIndex < 0) {
        $minIndex = 0;
    }

    $partListInfoMaxCount = (count($partListNumbers) >= 25) ? 25 : count($partListNumbers);
    $partListInfo = getWorkPartInfo(implode(",", array_slice($partListNumbers, $minIndex, 41)));

    //프리미엄인지
    $isPremium = false;
    if ($userInfo["isLogin"] == true && $userInfo["rankInfo"]["rank"] == 5) {
        $isPremium = true;
    }
    
    //회차를 이미 봤는지 여부
    $viewed = null;
    $userIp = getClientIp();
    if ($userInfo["isLogin"] == true) {
        $stmt = $pdo->prepare("SELECT part_number FROM work_part_viewed WHERE part_number = :part_number AND user_number = :user_number");
        $stmt->execute(array(
            ':part_number' => $partInfo["number"],
            ':user_number' => $userInfo["number"]
        ));
        $viewed = $stmt->fetch();
    } else {
        $stmt = $pdo->prepare("SELECT part_number FROM work_part_viewed WHERE part_number = :part_number AND ip = :ip");
        $stmt->execute(array(
            ':part_number' => $partInfo["number"],
            ':ip' => $userIp
        ));
        $viewed = $stmt->fetch();
    }

    //이미 본 회차가 아닐 경우, 수익 창출 회차일 경우 또는 본인이 아닐 경우
    if (isset($viewed["part_number"]) == false && $partInfo["monetization"] == true && (isset($userInfo["number"]) && $workInfo["user_number"] != $userInfo["number"])) {
        //수익 증가
        addWorkRevenue($workInfo["number"]);
    }

    //프리미엄일 경우, 이미 본 회차가 아닐 경우, 수익 창출 회차일 경우 또는 본인이 아닐 경우
    if ($isPremium == true && isset($viewed["part_number"]) == false && $partInfo["monetization"] == true && (isset($userInfo["number"]) && $workInfo["user_number"] != $userInfo["number"])) {
        $sql = $pdo->prepare('UPDATE user SET premium_viewed = premium_viewed + 1 WHERE number = :number');
        $sql->execute(array(
            ':number' => $userInfo["number"]
        ));
    }

    //이미 본 회차가 아닐 경우 또는 본인이 아닐 경우
    if (isset($viewed["part_number"]) == false && (isset($userInfo["number"]) && $workInfo["user_number"] != $userInfo["number"])) {
        //포인트 증가
        addUserPoints($userInfo["number"], 1);
    }

    //조회수 집계
    includeViewedPart($partInfo["number"]);

    //성인 관련
    $disableAdult = false;
    if (isset($workInfo["disable_adult"])) {
        $disableAdult = $workInfo["disable_adult"];
    }
    $adultQuestions = false;
    if (isset($workInfo["adult_questions"])) {
        $adultQuestions = $workInfo["adult_questions"];
    }

?>

<div class = "disable_adult" style = "display: none;">
    <?php echo $disableAdult; ?>
</div>
<div class = "adult_questions" style = "display: none;">
    <?php echo $adultQuestions; ?>
</div>
<div class = "is_login" style = "display: none;">
    <?php echo $userInfo["isLogin"]; ?>
</div>
<div class = "is_premium" style = "display: none;">
    <?php echo $isPremium; ?>
</div>
<div class = "menu_title" style = "display: none;"></div>
<div class = "part_number" style = "display: none;">
    <?php echo $partInfo["number"]; ?>
</div>
<div class = "part_info" style = "display: none;">
    <?php echo json_encode($partInfo); ?>
</div>
<div class = "work_info" style = "display: none">
    <?php
        echo json_encode(array(
            "title" => $workInfo["title"],
            "originator" => $workInfo["originator"],
            "contentsType" => $workInfo["contents_type"]
        ));
    ?>
</div>
<div class = "part_comments_info" style = "display: none;">
    <?php
        echo json_encode(array(
            "numbers" => $commentsNumbers,
            "info" => $commentsInfo,
        ));
    ?>
</div>
<div class = "originator_number" style = "display: none;">
    <?php echo getCommentsOriginatorNumber($commentsUid); ?>
</div>
<div class = "part_list_info" style = "display: none;">
    <?php echo json_encode($partListInfo); ?>
</div>

<!-- 헤더 -->
<div class = "image_format_viewer_header">
    <div class = "image_format_viewer_header_left">
        <div class = "image_format_viewer_header_left_back md-ripples" onclick = "history.back();" onmouseenter = "hoverInformation(this, getLanguage('back'));">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"/><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"/></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"/></g></svg>
        </div>
        <div class = "image_format_viewer_header_left_info">
            <div class = "image_format_viewer_header_left_info_left img_wrap">
                <img src = "..." onload = "imageLoad(event);">
            </div>
            <div class = "image_format_viewer_header_left_info_right">
                <div class = "image_format_viewer_header_left_info_right_category">
                    ...
                </div>
                <div class = "image_format_viewer_header_left_info_right_title">
                    ...
                </div>
            </div>
        </div>
    </div>
    <div class = "image_format_viewer_header_right">
        <div name = "header_profile" style="display: flex; align-items: center;"></div>
    </div>
    <div class = "image_format_viewer_header_progress_bar">
        <div class = "image_format_viewer_header_progress_bar_in"></div>
    </div>
</div>

<div class = "image_format_viewer" previous_scroll_top = "0" difference_scroll_top = "0" onclick = "checkHideSideImageFormatViewer(<?php echo $menuNumber ?>, event);">
    <div class = "image_format_viewer_contents">
        <div class = "image_format_viewer_items_wrap" double = "false" ontouchstart = "touchStartImageFormatViewerManga(event, this);" onmousedown = "touchStartImageFormatViewerManga(event, this);">
            <div class = "image_format_viewer_items_auto_page_move" style = "display: none;" animation = "false">
                <div class = "image_format_viewer_items_auto_page_move_box" style = "left: -200px;">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.375 20.781c0.17 0.136 0.388 0.219 0.625 0.219 0.552 0 1-0.448 1-1v-16c0.001-0.218-0.071-0.439-0.219-0.625-0.345-0.431-0.974-0.501-1.406-0.156l-10 8c-0.053 0.042-0.108 0.095-0.156 0.156-0.345 0.431-0.275 1.061 0.156 1.406zM18 17.919l-7.399-5.919 7.399-5.919zM6 19v-14c0-0.552-0.448-1-1-1s-1 0.448-1 1v14c0 0.552 0.448 1 1 1s1-0.448 1-1z"></path></svg>
                    <div class = "image_format_viewer_items_auto_page_move_box_title">
                        ...
                    </div>
                    <div class = "image_format_viewer_items_auto_page_move_box_description">
                        ...
                    </div>
                </div>
            </div>
            <div class = "image_format_viewer_items_resize">
                <div class = "image_format_viewer_items_resize_line" style = "cursor: w-resize;" onmousedown = "imageFormatViewerItemsResize(event, 'left');"></div>
            </div>
            <div class = "image_format_viewer_items">
                <!-- item -->
            </div>
            <div class = "image_format_viewer_items_resize">
                <div class = "image_format_viewer_items_resize_line" style = "cursor: e-resize;" onmousedown = "imageFormatViewerItemsResize(event, 'right');"></div>
            </div>
            <div class = "image_format_viewer_items_auto_page_move" style = "display: none;" animation = "false">
                <div class = "image_format_viewer_items_auto_page_move_box">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.625 3.219c-0.17-0.136-0.388-0.219-0.625-0.219-0.552 0-1 0.448-1 1v16c-0.001 0.218 0.071 0.439 0.219 0.625 0.345 0.431 0.974 0.501 1.406 0.156l10-8c0.053-0.042 0.108-0.095 0.156-0.156 0.345-0.431 0.275-1.061-0.156-1.406zM6 6.081l7.399 5.919-7.399 5.919zM18 5v14c0 0.552 0.448 1 1 1s1-0.448 1-1v-14c0-0.552-0.448-1-1-1s-1 0.448-1 1z"></path></svg>
                    <div class = "image_format_viewer_items_auto_page_move_box_title">
                        ...
                    </div>
                    <div class = "image_format_viewer_items_auto_page_move_box_description">
                        ...
                    </div>
                </div>
            </div>
        </div>
        <div class = "image_format_viewer_contents_next_part">
            <!-- html -->
        </div>
        <div class = "google_adsense" style = "display: none;">
            <!-- html -->
        </div>
        <div class = "image_format_viewer_contents_line"></div>
        <div class = "image_format_viewer_contents_comments">
            <!-- html -->
        </div>
    </div>
</div>

<div class = "image_format_viewer_footer">
    <div class = "image_format_viewer_footer_left">
        <div class = "image_format_viewer_footer_item image_format_viewer_footer_item_disabled md-ripples" onmouseenter = "hoverInformation(this, '이전 회차');">
            <!-- Generated by IcoMoon.io -->
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.891 17.418c0.268 0.272 0.268 0.709 0 0.979s-0.701 0.271-0.969 0l-7.83-7.908c-0.268-0.27-0.268-0.707 0-0.979l7.83-7.908c0.268-0.27 0.701-0.27 0.969 0s0.268 0.709 0 0.979l-7.141 7.419 7.141 7.418z"></path></svg>
        </div>
        <div class = "image_format_viewer_footer_item image_format_viewer_footer_item_disabled md-ripples" onmouseenter = "hoverInformation(this, '다음 회차');">
            <!-- Generated by IcoMoon.io -->
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.25 10l-7.141-7.42c-0.268-0.27-0.268-0.707 0-0.979 0.268-0.27 0.701-0.27 0.969 0l7.83 7.908c0.268 0.271 0.268 0.709 0 0.979l-7.83 7.908c-0.268 0.271-0.701 0.27-0.969 0s-0.268-0.707 0-0.979l7.141-7.417z"></path></svg>
        </div>
    </div>
    <div class = "image_format_viewer_footer_right">
        <div class = "image_format_viewer_footer_item md-ripples" onclick = "viewerPartListButton(<?php echo $menuNumber ?>, this);" onmouseenter = "hoverInformation(this, getLanguage('image_format_viewer_menu_button:part_list'));">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="10" height="3" rx="1.5" transform="translate(0 7)"/><rect width="35" height="3" rx="1.5" transform="translate(15 7)"/><rect width="10" height="3" rx="1.5" transform="translate(0 24)"/><rect width="10" height="3" rx="1.5" transform="translate(0 41)"/><rect width="29" height="3" rx="1.5" transform="translate(15 24)"/><rect width="35" height="3" rx="1.5" transform="translate(15 41)"/></g></svg>
        </div>
        <div class = "image_format_viewer_footer_item md-ripples" onclick = "imageFormatViewerComments();" onmouseenter = "hoverInformation(this, getLanguage('image_format_viewer_menu_button:comments'));">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M40.707,46.427h0a3.976,3.976,0,0,1-2.333-1.044c-3.13-2.487-11.917-9.316-12-9.383H5a5.006,5.006,0,0,1-5-5V5A5.006,5.006,0,0,1,5,0H45a5.006,5.006,0,0,1,5,5V31a5.005,5.005,0,0,1-5,5H42.466v9.106A2,2,0,0,1,40.707,46.427ZM4.906,3A1.985,1.985,0,0,0,3.016,4.9L2.984,31.027c0,.019.129,1.891,1.859,1.953H27.391l12.078,9.453V32.98h5.688A2.03,2.03,0,0,0,47,31l-.015-26.25c0-.017-.282-1.672-1.8-1.718Z" transform="translate(0 1.786)"/></g></svg>
        </div>
        <div class = "image_format_viewer_footer_item md-ripples" onclick = "viewerSettingsButton(<?php echo $menuNumber ?>, this, 'image_format_main');" onmouseenter = "hoverInformation(this, getLanguage('image_format_viewer_menu_button:settings'));">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M32,50H18V44.8a20.917,20.917,0,0,1-6.33-3.577L7,43.924,0,31.8l4.429-2.557a21.187,21.187,0,0,1,0-8.487L0,18.2,7,6.075l4.671,2.7A20.917,20.917,0,0,1,18,5.195V0H32V5.195a20.917,20.917,0,0,1,6.33,3.577L43,6.075,50,18.2l-4.429,2.557a21.187,21.187,0,0,1,0,8.487L50,31.8,43,43.924l-4.67-2.7A20.917,20.917,0,0,1,32,44.8V50ZM11.953,37.578h0a22.447,22.447,0,0,0,9.062,5.093v4.3H29.03v-4.3a16.377,16.377,0,0,0,2.854-1.023,23.142,23.142,0,0,0,6.1-4.039l3.891,2.235L45.89,32.89,42.2,30.75a21.8,21.8,0,0,0,0-11.485l3.7-2.14L41.89,10.187l-3.86,2.25a21.509,21.509,0,0,0-9.047-5.109c.005-.331.059-4.27,0-4.328-.021.014-.725.021-2.092.021C24.569,3.021,21.066,3,21.031,3V7.328A22.161,22.161,0,0,0,12,12.422L8.094,10.187,4.14,17.109l3.625,2.126c-.017.06-1.679,6.056.062,11.5l-3.7,2.156L8.094,39.8l3.859-2.219Z" transform="translate(0)"/><path d="M10,20A10,10,0,1,1,20,10,10.011,10.011,0,0,1,10,20ZM10,3.294A6.706,6.706,0,1,0,16.706,10,6.713,6.713,0,0,0,10,3.294Z" transform="translate(15 15)"/></g></svg>
        </div>
    </div>
</div>