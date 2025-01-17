<?php

    include_once('../default_function.php');
    $userInfo = getMyLoginInfo();

    $menuNumber = $_POST["menuNumber"];
    $communityNumber = $_POST["data"];
    $communityInfo = getCommunityInfo($communityNumber);

    //댓글 정보
    $commentsUid = 'community_' . $communityNumber;
    $commentsSort = 0; //인기 댓글 순
    $commentsNumbers = getCommentsNumbers($commentsUid, $commentsSort);
    $numbers = explode(",", $commentsNumbers);

    $commentsInfoMaxCount = (count($numbers) >= 20) ? 20 : count($numbers);
    $commentsInfo = getCommentsInfo(implode(",", array_slice($numbers, 0, $commentsInfoMaxCount)));

?>

<div class = "comments_number" style = "display: none;">
    <?php echo $communityNumber; ?>
</div>
<div class = "comments_uid" style = "display: none;">
    <?php echo $commentsUid; ?>
</div>
<div class = "comments_info" style = "display: none;">
    <?php 
        echo json_encode(array(
            "numbers" => $commentsNumbers,
            "info" => $commentsInfo,
        ));
    ?>
</div>
<div class = "community_info" style = "display: none;">
    <?php echo json_encode($communityInfo) ?>
</div>
<div class = "originator_number" style = "display: none;">
    <?php echo getCommentsOriginatorNumber($commentsUid); ?>
</div>

<div class = "menu_community">
    <div class = "menu_community_main">
        <div class = "community_item_left">
            ...
        </div>
        <div class = "community_item_right">
            <div class = "community_item_right_top">
                <div class = "community_item_right_top_nickname">
                    ...
                </div>
                <div class = "community_item_right_top_date">
                    · ...
                </div>
                <div class = "community_item_right_top_date_more_button md-ripples">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-1 -1.061)"><circle cx="3" cy="3" r="3" transform="translate(23 4)"></circle><path d="M3,0A2.971,2.971,0,0,1,6,2.942,2.971,2.971,0,0,1,3,5.884,2.971,2.971,0,0,1,0,2.942,2.971,2.971,0,0,1,3,0Z" transform="translate(23 23)"></path><path d="M3,0A3.031,3.031,0,0,1,6,3.061,3.031,3.031,0,0,1,3,6.121,3.031,3.031,0,0,1,0,3.061,3.031,3.031,0,0,1,3,0Z" transform="translate(23 42)"></path></g></g></svg>
                </div>
            </div>
            <div class = "community_item_contents">
                ...
            </div>
            <div class = "community_item_bottom">
                <div class = "community_item_bottom_item md-ripples" onmouseenter = "hoverInformation(this, getLanguage('likes'));">
                    <div style = "align-items: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,25H2a2,2,0,0,1-2-2V2A2,2,0,0,1,2,0h9a2,2,0,0,1,2,2V23A2,2,0,0,1,11,25ZM3,3V22h7V3Z" transform="translate(0 22)"/><path d="M29.891,44.45H1.733a1.868,1.868,0,0,1-1.224-.511A1.982,1.982,0,0,1,0,42.469c.016-1.947,0-21.23,0-22.05L14.682,2.173A7.441,7.441,0,0,1,19.5,0a5.453,5.453,0,0,1,2.441.588,4.405,4.405,0,0,1,2.637,3.769,5.912,5.912,0,0,1-.314,2.3c-.053.119-5.339,11.957-5.81,13.943H32.295a2.518,2.518,0,0,1,1.149.888,6.6,6.6,0,0,1,1.07,4.314A50.508,50.508,0,0,1,32.532,36.58l-2.641,7.869ZM19.7,2.931a4.877,4.877,0,0,0-2.353.816c-.917.543-14.2,17.567-14.332,17.739V41.439h24.8c2.66-7.819,3.451-12.257,3.647-14.6.212-2.54-.21-3.242-.215-3.249H14.125c.851-3,3.968-10.2,5.831-14.5.534-1.234.955-2.205,1.172-2.732.94-2.283.323-2.792-.652-3.262A1.764,1.764,0,0,0,19.7,2.931Z" transform="translate(14.814 2.158)"/></g></svg>
                        <div class = "community_item_bottom_item_text">
                            ...
                        </div>
                    </div>
                    <div style = "align-items: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="13" height="25" rx="2" transform="translate(0 22)"/><rect width="7" height="19" transform="translate(3 25)"/><path d="M14.814,22.577,29.5,4.331S32.823.792,36.758,2.746,39.081,8.82,39.081,8.82s-5.334,11.936-5.809,13.943H47.109s2.324.634,2.218,5.2a50.274,50.274,0,0,1-1.98,10.774l-2.641,7.869H16.546a1.769,1.769,0,0,1-1.732-1.98C14.83,42.636,14.814,22.577,14.814,22.577Z"/><path d="M17.834,23.644S31.239,6.454,32.165,5.9s2.2-1.1,3.124-.652,1.613.927.652,3.261-5.9,13.354-7,17.233h17.13s1.716,2.712-3.433,17.851h-24.8Z"/></g></svg>
                        <div class = "community_item_bottom_item_text">
                            ...
                        </div>
                    </div>
                </div>
                <div class = "community_item_bottom_item md-ripples" onmouseenter = "hoverInformation(this, getLanguage('dislike'));">
                    <div style = "align-items: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,25H2a2,2,0,0,1-2-2V2A2,2,0,0,1,2,0h9a2,2,0,0,1,2,2V23A2,2,0,0,1,11,25ZM3,3V22h7V3Z" transform="translate(49.33 27.158) rotate(180)"/><path d="M29.891,44.45H1.733a1.868,1.868,0,0,1-1.224-.511A1.982,1.982,0,0,1,0,42.469c.016-1.947,0-21.23,0-22.05L14.682,2.173A7.441,7.441,0,0,1,19.5,0a5.453,5.453,0,0,1,2.441.588,4.405,4.405,0,0,1,2.637,3.769,5.912,5.912,0,0,1-.314,2.3c-.053.119-5.339,11.957-5.81,13.943H32.295a2.518,2.518,0,0,1,1.149.888,6.6,6.6,0,0,1,1.07,4.314A50.508,50.508,0,0,1,32.532,36.58l-2.641,7.869ZM19.7,2.931a4.877,4.877,0,0,0-2.353.816c-.917.543-14.2,17.567-14.332,17.739V41.439h24.8c2.66-7.819,3.451-12.257,3.647-14.6.212-2.54-.21-3.242-.215-3.249H14.125c.851-3,3.968-10.2,5.831-14.5.534-1.234.955-2.205,1.172-2.732.94-2.283.323-2.792-.652-3.262A1.764,1.764,0,0,0,19.7,2.931Z" transform="translate(34.517 47) rotate(180)"/></g></svg>
                        <div class = "community_item_bottom_item_text">
                            ...
                        </div>
                    </div>
                    <div style = "align-items: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="13" height="25" rx="2" transform="translate(49.33 27.158) rotate(180)"/><rect width="7" height="19" transform="translate(46.33 24.158) rotate(180)"/><path d="M14.814,22.577,29.5,4.331S32.823.792,36.758,2.746,39.081,8.82,39.081,8.82s-5.334,11.936-5.809,13.943H47.109s2.324.634,2.218,5.2a50.274,50.274,0,0,1-1.98,10.774l-2.641,7.869H16.546a1.769,1.769,0,0,1-1.732-1.98C14.83,42.636,14.814,22.577,14.814,22.577Z" transform="translate(49.33 49.158) rotate(180)"/><path d="M17.834,23.644S31.239,6.454,32.165,5.9s2.2-1.1,3.124-.652,1.613.927.652,3.261-5.9,13.354-7,17.233h17.13s1.716,2.712-3.433,17.851h-24.8Z" transform="translate(49.33 49.158) rotate(180)"/></g></svg>
                        <div class = "community_item_bottom_item_text">
                            ...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class = "menu_community_lines"></div>
    <div class = "menu_community_comments">
        <!-- html -->
    </div>
</div>