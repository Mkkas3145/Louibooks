

<?php

    $menuNumber = $_POST["menuNumber"];
    $data = $_POST["data"];
    $partNumber = (int) $data;

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == false) {
        echo 'not login'; exit;
    }

    //
    $stmt = $pdo->prepare("SELECT number, type, work_number, title, thumbnail_image, public_status FROM work_part WHERE user_number = :user_number AND number = :number");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"],
        ':number' => $partNumber
    ));
    $partInfo = $stmt->fetch();

    $stmt = $pdo->prepare("SELECT cover_image, default_cover_image FROM works WHERE number = :number");
    $stmt->execute(array(
        ':number' => $partInfo["work_number"]
    ));
    $workInfo = $stmt->fetch();
    $coverImage = $workInfo["default_cover_image"];
    if (isset($workInfo["cover_image"])) {
        $coverImage = $workInfo["cover_image"];
    }

    //최신 회차인지
    $stmt = $pdo->prepare("SELECT number FROM work_part WHERE user_number = :user_number AND work_number = :work_number ORDER BY chapter DESC, number DESC LIMIT 1");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"],
        ':work_number' => $partInfo["work_number"],
    ));
    $latestNumber = $stmt->fetch()["number"];
    $isLatest = "false";
    if ($latestNumber == $partInfo["number"]) {
        $isLatest = "true";
    }

    //
    $info = array(
        "partType" => $partInfo["type"],
        "partNumber" => $partInfo["number"],
        "workNumber" => $partInfo["work_number"],
        "title" => $partInfo["title"],
        "publicStatus" => $partInfo["public_status"],
        "thumbnailImage" => $partInfo["thumbnail_image"],
        "coverImage" => $coverImage,
    );

    $thumbnailImageBool = 1;
    if ($coverImage == $partInfo["thumbnail_image"]) {
        $thumbnailImageBool = 0;
    }

?>

<div class = "info" style = "display: none;">
    <?php echo json_encode($info); ?>
</div>
<div class = "workspace_part_save_json" style = "display: none;"><?php
    $data = array(
        'thumbnail_image' => $partInfo["thumbnail_image"],
        'title' => $partInfo["title"],
        'public_status' => $partInfo["public_status"]
    );
    echo json_encode($data);
?></div>

<div class = "workspace_part_details_top">
    <div class = "workspace_part_details_top_left">
        <div class = "workspace_part_details_top_left_icon">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="10" height="3" rx="1.5" transform="translate(0 7)"></rect><rect width="35" height="3" rx="1.5" transform="translate(15 7)"></rect><rect width="10" height="3" rx="1.5" transform="translate(0 24)"></rect><rect width="10" height="3" rx="1.5" transform="translate(0 41)"></rect><rect width="29" height="3" rx="1.5" transform="translate(15 24)"></rect><rect width="35" height="3" rx="1.5" transform="translate(15 41)"></rect></g></svg>
        </div>
        <div class = "workspace_part_details_top_left_title">
            <?php echo $info["title"]; ?>
        </div>
    </div>
    <div class = "workspace_part_details_top_right">
        <div class = "workspace_part_details_top_right_undo md-ripples" onclick = "workspacePartDetailsUndo(<?php echo $menuNumber; ?>);">
            <?php echo getLanguage("workspace_work_undo_changes"); ?>
        </div>
        <div class = "workspace_part_details_top_right_save md-ripples" onclick = "workspacePartDetailsSave(<?php echo $menuNumber; ?>);">
            <?php echo getLanguage("workspace_work_save"); ?>
        </div>
        <div class = "workspace_part_details_top_right_more md-ripples" onclick = "moreButtonWorkspacePartDetails(this, <?php echo $isLatest; ?>, <?php echo $info["partNumber"]; ?>, '<?php echo $info["partType"]; ?>');" onmouseenter = "hoverInformation(this, getLanguage('view_more'));">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-1 -1.061)"><circle cx="3" cy="3" r="3" transform="translate(23 4)"></circle><path d="M3,0A2.971,2.971,0,0,1,6,2.942,2.971,2.971,0,0,1,3,5.884,2.971,2.971,0,0,1,0,2.942,2.971,2.971,0,0,1,3,0Z" transform="translate(23 23)"></path><path d="M3,0A3.031,3.031,0,0,1,6,3.061,3.031,3.031,0,0,1,3,6.121,3.031,3.031,0,0,1,0,3.061,3.031,3.031,0,0,1,3,0Z" transform="translate(23 42)"></path></g></g></svg>
        </div>
    </div>
</div>
<div class = "workspace_part_details_contents">
    <div class = "workspace_part_details_title">
        ...
    </div>
    <div style = "margin-top: 15px; margin-bottom: 15px;">
        <div class = "create_work_step2_option_title">
            ...
        </div>
        <div class = "workspace_work_cover scroll" type = "<?php echo $partInfo["type"]; ?>" value = "<?php echo $thumbnailImageBool; ?>">
            <div class = "workspace_work_cover_selected img_wrap">
                <img src = "<?php echo $partInfo["thumbnail_image"]; ?>" onload = "imageLoad(event);" alt = "">
            </div>
            <div class = "workspace_work_cover_add md-ripples" onclick = "workspacePartDetailsThumbnailUploadButton(this);">
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M16.88 9.1c1.795 0.419 3.111 2.006 3.111 3.9 0 2.206-1.786 3.995-3.991 4h-11c-0.001 0-0.003 0-0.005 0-2.761 0-5-2.239-5-5 0-2.409 1.704-4.421 3.973-4.894l0.032-0.006v-0.1c0-0.001 0-0.002 0-0.004 0-1.657 1.343-3 3-3 0.56 0 1.085 0.154 1.534 0.421l-0.014-0.008c0.899-0.889 2.136-1.438 3.5-1.438 2.75 0 4.98 2.23 4.98 4.98 0 0.017-0 0.033-0 0.050l0-0.003c0 0.38-0.040 0.74-0.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z"></path></svg>
                <div class = "workspace_work_cover_add_title">
                    ...
                </div>
                <div class = "workspace_work_cover_add_description">
                    ...
                </div>
            </div>
            <div class = "workspace_work_cover_delete md-ripples" onclick = "workspacePartDetailsDeleteThumbnail(<?php echo $menuNumber; ?>);">
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 28"><path d="M8 21.5v-11c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v11c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM12 21.5v-11c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v11c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM16 21.5v-11c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v11c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM7.5 6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094 0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5 0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375 0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391 2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094 2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z"></path></svg>
                <div class = "workspace_work_cover_add_title">
                    ...
                </div>
                <div class = "workspace_work_cover_add_description">
                    ...
                </div>
            </div>
            <input type = "file" onchange = "requestWorkspacePartDetailsThumbnailUpload(<?php echo $menuNumber; ?>, this);" accept = "image/png, image/jpeg, image/webp, image/gif" style = "display: none;">
        </div>
    </div>
    <div class = "create_work_input">
        <div class = "create_work_input_top">
            <div class = "create_work_input_top_title">
                ...
            </div>
        </div>
        <input class = "workspace_part_details" value = "<?php echo str_replace('"', '&quot;', $info["title"]); ?>" type = "text" placeholder = "Please enter your text." onfocus = "create_work_input_focus(this);" >
    </div>
    <div class = "create_work_step2_option" style = "margin-top: 20px;">
        <div class = "create_work_step2_option_title">
            Public state
        </div>
        <div class = "workspace_part_details create_work_step2_option_box md-ripples" onclick = "selectList(this, getItemsWorkspacePartDetailsPublicState());" value = "0">
            <div class="create_work_step2_option_box_title value_title">
                ...
            </div>
            <div class="create_work_step2_option_box_icon">
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.984 9.984h10.031l-5.016 5.016z"></path></svg>
            </div>
        </div>
    </div>
</div>