

<?php

    $menuNumber = $_POST["menuNumber"];
    $data = $_POST["data"];
    $workNumber = (int) $data;

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == false) {
        echo 'not login';
        exit;
    }

    $select = "number, title, description, public_status, user_age, genre, tag, cover_image, default_cover_image, creator_violation_date";
    $stmt = $pdo->prepare("SELECT " . $select . " FROM works WHERE user_number = :user_number AND number = :number");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"],
        ':number' => $workNumber,
    ));
    $work = $stmt->fetch();

    //현재 시간 구하기
    $newDate = date("Y-m-d H:i:s");

    //강제로 비공개 전환 여부
    $forcedPrivate = false;
    //가이드를 위반한 날짜와 일주일 이하로 차이나면 나면
    if (isset($work["creator_violation_date"]) && getTimeDifference($work["creator_violation_date"], $newDate) < 604800) {
        $forcedPrivate = true; //비공개로 전환
    }

?>

<div class = "forced_private" style = "display: none;">
    <?php echo $forcedPrivate; ?>
</div>
<div class = "workspace_work_info_json" style = "display: none;">
    <?php echo json_encode($work); ?>
</div>
<div class = "workspace_work_save_json" style = "display: none;">
    <?php
        echo json_encode(array(
            'title' => $work["title"],
            'description' => $work["description"],
            'public_status' => $work["public_status"],
            'user_age' => $work["user_age"],
            'genre' => $work["genre"],
            'tag' => $work["tag"],
            'cover_image' => $work["cover_image"]
        ));
    ?>
</div>

<div class = "workspace_work_top">
    <div class = "workspace_work_top_left">
        <div class = "workspace_work_top_left_icon">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-4.438,42.27v0L.4,28.587,21.847,7.145a2.12,2.12,0,0,1,1.506-.632,1.945,1.945,0,0,1,1.387.567l7.071,7.071a1.944,1.944,0,0,1,.567,1.433,2.125,2.125,0,0,1-.632,1.459L10.3,38.487-4.436,42.27ZM23.387,9.839h0L3.162,30.064-.327,38.621l9.154-2.892L29.052,15.5,23.387,9.839Z" transform="translate(5.102 6.536)"/><path d="M28.7,19.1a1.987,1.987,0,0,1-1.414-.586l-7.071-7.071a2,2,0,0,1,0-2.828l6.368-6.368a2,2,0,0,1,2.829,0l7.071,7.071a2,2,0,0,1,0,2.828L30.116,18.51A1.987,1.987,0,0,1,28.7,19.1ZM27.995,5.067h0l-4.95,4.95,5.666,5.665,4.95-4.949L27.995,5.067Z" transform="translate(12.102 -0.464)"/></g></svg>
        </div>
        <div class = "workspace_work_top_left_title">
            <?php echo $work["title"]; ?>
        </div>
    </div>
    <div class = "workspace_work_top_right">
        <div class = "workspace_work_top_right_undo md-ripples" onclick = "workspaceWorkUndo(<?php echo $menuNumber; ?>);">
            ...
        </div>
        <div class = "workspace_work_top_right_save md-ripples" onclick = "workspaceWorkSave(<?php echo $menuNumber; ?>);">
            ...
        </div>
        <div class = "workspace_work_top_right_more md-ripples" onclick = "moreButtonWorkspaceWorkDetails(this, <?php echo $work["number"]; ?>);" onmouseenter = "hoverInformation(this, getLanguage('view_more'));">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-1 -1.061)"><circle cx="3" cy="3" r="3" transform="translate(23 4)"></circle><path d="M3,0A2.971,2.971,0,0,1,6,2.942,2.971,2.971,0,0,1,3,5.884,2.971,2.971,0,0,1,0,2.942,2.971,2.971,0,0,1,3,0Z" transform="translate(23 23)"></path><path d="M3,0A3.031,3.031,0,0,1,6,3.061,3.031,3.031,0,0,1,3,6.121,3.031,3.031,0,0,1,0,3.061,3.031,3.031,0,0,1,3,0Z" transform="translate(23 42)"></path></g></g></svg>
        </div>
    </div>
</div>

<div class = "workspace_work_contents">
    <div class = "workspace_work_contents_left">
        <div class = "workspace_work_contents_left_title">
            <?php echo getLanguage("workspace_work_work_details"); ?>
        </div>
        <div class = "workspace_work_contents_left_details">
            <!-- 작품 세부정보 -->
        </div>
    </div>
    <div class = "workspace_work_contents_right">
        <div class = "workspace_work_contents_right_top">
            <div class = "workspace_work_contents_right_top_cover img_wrap">
                <?php
                    $work_cover = $work["cover_image"];
                    if ($work_cover == null) {
                        $work_cover = $work["default_cover_image"];
                    }
                ?>
                <img src = "<?php echo $work_cover; ?>" onload = "imageLoad(event);" alt = "">
            </div>
            <div class = "workspace_work_contents_right_top_info" style = "display: flex; align-items: center;">
                <div style = "width: calc(100% - 40px);">
                    <div class = "workspace_work_contents_right_top_info_title">
                        <?php echo getLanguage("workspace_work_work_link"); ?>
                    </div>
                    <div class = "workspace_work_contents_right_top_info_link md-ripples" onclick = "window.open('https://louibooks.com/work/<?php echo $work["number"]; ?>');" onmouseenter = "hoverHelp(this, 'https://louibooks.com/work/<?php echo $work["number"]; ?>');">
                        https://louibooks.com/work/<?php echo $work["number"]; ?>
                    </div>
                </div>
                <div class = "workspace_work_contents_right_top_info_link_copy md-ripples" onclick = "copy('https://louibooks.com/work/<?php echo $work["number"]; ?>');" onmouseenter = "hoverInformation(this, getLanguage('copy_link'));">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11 8c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v9c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h9c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-9c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM11 10h9c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v9c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-9c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-9c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM5 14h-1c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-9c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h9c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v1c0 0.552 0.448 1 1 1s1-0.448 1-1v-1c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-9c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v9c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h1c0.552 0 1-0.448 1-1s-0.448-1-1-1z"></path></svg>
                </div>
            </div>
            <div class = "workspace_work_contents_right_top_info">
                <div class = "workspace_work_contents_right_top_info_title">
                    <?php echo getLanguage("workspace_work_public_status"); ?>
                </div>
                <div style = "margin-left: -10px;" class = "my_works_contents_item_right_public_status md-ripples" value = "<?php echo $work["public_status"]; ?>" previous_value = "<?php echo $work["public_status"]; ?>" onchange = "workspaceMyWorksChangeState(this, <?php echo $work["number"]; ?>); workspaceWorkChangePublicState(<?php echo $menuNumber; ?>, this);" popupsize = "parent" popupwidth = "max-content" onclick = "selectList(this, create_work_select_list('public_status', true));">
                    <div class = "my_works_contents_item_right_public_status_icon">
                        <div class = "my_works_contents_item_right_public_status_icon_0">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 12h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v7c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-7c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM8 10v-3c-0.001-1.106 0.445-2.105 1.169-2.831 0.723-0.724 1.719-1.172 2.821-1.174 1.030 0.003 1.948 0.378 2.652 1 0.638 0.565 1.097 1.332 1.28 2.209 0.113 0.541 0.642 0.888 1.183 0.775s0.888-0.642 0.775-1.183c-0.272-1.307-0.958-2.454-1.912-3.299-1.060-0.938-2.452-1.504-3.973-1.502-1.657 0.002-3.157 0.676-4.241 1.762s-1.756 2.587-1.754 4.243v3h-1c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v7c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-7c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879z"></path></svg>
                        </div>
                        <div class = "my_works_contents_item_right_public_status_icon_1">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15 8h3c1.105 0 2.103 0.447 2.828 1.172s1.172 1.723 1.172 2.828-0.447 2.103-1.172 2.828-1.723 1.172-2.828 1.172h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1h3c1.657 0 3.158-0.673 4.243-1.757s1.757-2.586 1.757-4.243-0.673-3.158-1.757-4.243-2.586-1.757-4.243-1.757h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1zM9 16h-3c-1.105 0-2.103-0.447-2.828-1.172s-1.172-1.723-1.172-2.828 0.447-2.103 1.172-2.828 1.723-1.172 2.828-1.172h3c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3c-1.657 0-3.158 0.673-4.243 1.757s-1.757 2.586-1.757 4.243 0.673 3.158 1.757 4.243 2.586 1.757 4.243 1.757h3c0.552 0 1-0.448 1-1s-0.448-1-1-1zM8 13h8c0.552 0 1-0.448 1-1s-0.448-1-1-1h-8c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path></svg>
                        </div>
                        <div class = "my_works_contents_item_right_public_status_icon_2">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 12h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v7c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-7c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM18 10v-3c0-1.657-0.673-3.158-1.757-4.243s-2.586-1.757-4.243-1.757-3.158 0.673-4.243 1.757-1.757 2.586-1.757 4.243v3h-1c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v7c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-7c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM8 10v-3c0-1.105 0.447-2.103 1.172-2.828s1.723-1.172 2.828-1.172 2.103 0.447 2.828 1.172 1.172 1.723 1.172 2.828v3z"></path></svg>
                        </div>
                    </div>
                    <div class = "value_title">
                        ...
                    </div>
                    <div class = "my_works_contents_item_right_public_status_selectlist_icon">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17.418 6.109c0.272-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-7.908 7.83c-0.27 0.268-0.707 0.268-0.979 0l-7.908-7.83c-0.27-0.268-0.27-0.701 0-0.969s0.709-0.268 0.979 0l7.419 7.141 7.418-7.141z"></path></svg>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>