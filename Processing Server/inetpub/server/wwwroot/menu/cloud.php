<?php

    $menuNumber = $_POST["menuNumber"];

    include_once('../default_function.php');
    $userInfo = getMyLoginInfo();

    //폴더 개수
    $stmt = $pdo->prepare("SELECT COUNT(number) FROM cloud where type = 0 and user_number = :user_number");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"],
    ));
    $countCloudFolder = $stmt->fetch()[0];

    //파일 개수
    $stmt = $pdo->prepare("SELECT COUNT(number) FROM cloud where type != 0 and user_number = :user_number");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"],
    ));
    $countCloudFile = $stmt->fetch()[0];

    //전체 파일 용량
    $cloudFileSize = $userInfo["cloud"]["useSize"];

    //정보
    $stmt = $pdo->prepare("SELECT number, name, modified_date, size, type FROM cloud where user_number = :user_number and folder_number is NULL");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"],
    ));
    $cloudInfo = $stmt->fetchAll();

    //프리미엄인지
    $isPremium = false;
    if ($userInfo["isLogin"] == true && $userInfo["rankInfo"]["rank"] == 5) {
        $isPremium = true;
    }

?>

<div class = "cloud_header">
    <div class = "cloud_header_left">
        <div class = "cloud_header_left_back md-ripples" onclick = "history.back();" onmouseenter = "hoverInformation(this, getLanguage('back'));">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"/><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"/></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"/></g></svg>
        </div>
        <div class = "cloud_header_left_title">
            <?php echo getLanguage("louibooks_cloud"); ?>
        </div>
    </div>
    <div class = "cloud_header_right">
        <div name = "header_profile" style = "display: flex; align-items: center;">
            <!-- 프로필 -->
        </div>
    </div>
</div>
<div class = "cloud_contents">
    <div class = "cloud_contents_left">
        <div class = "cloud_contents_top">
            <div class = "cloud_contents_top_left">
                <div class = "cloud_contents_top_left_profile">
                    <div class = "profile_element">
                        <div class = "profile_info"><?php echo json_encode($userInfo["profile"]); ?></div>
                        <div class = "profile_image"></div>
                    </div>
                </div>
                <div class = "cloud_contents_top_left_info">
                    <div class = "cloud_contents_top_left_title">
                        <?php echo $userInfo["nickname"] . getLanguage("louibooks_nickname_cloud"); ?>
                    </div>
                    <div class = "cloud_contents_top_left_info">
                        <?php
                            $countCloudFolderStr = str_replace("{R:0}", $countCloudFolder, getLanguage("louibooks_cloud_folder"));
                            $countCloudFileStr = str_replace("{R:0}", $countCloudFile, getLanguage("louibooks_cloud_file"));
                            echo $countCloudFolderStr . ' · ' . $countCloudFileStr;
                        ?>
                    </div>
                </div>
            </div>
        </div>
        <div class = "cloud_contents_top_capacity" style = "display: <?php echo ($isPremium == true) ? "none" : "flex"; ?>;">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M39.531,1240.953h-29.2a12.507,12.507,0,0,1-4.965-1.349A9.848,9.848,0,0,1,0,1230.672a10.094,10.094,0,0,1,1.481-5.958,9.757,9.757,0,0,1,3.608-3.284,13.9,13.9,0,0,1,4.037-1.411A13.749,13.749,0,0,1,18,1210.051a18.7,18.7,0,0,1,7.055-1.12,13.57,13.57,0,0,1,4.846,1.123,14.709,14.709,0,0,1,7.285,6.883l.052-.009a10.573,10.573,0,0,1,6.36.824,10.684,10.684,0,0,1,4.666,4.392A13.953,13.953,0,0,1,50,1229.083c0,5.58-2.821,8.522-5.187,10.008a13.063,13.063,0,0,1-5.133,1.854A1.482,1.482,0,0,1,39.531,1240.953Zm-29.133-3h29.04a10.242,10.242,0,0,0,3.867-1.458c2.452-1.58,3.695-4.073,3.695-7.412,0-4-1.754-7.225-4.691-8.621-2.988-1.42-6.623-.67-9.973,2.059a1.5,1.5,0,1,1-1.894-2.326,16.521,16.521,0,0,1,3.812-2.364,11.36,11.36,0,0,0-9.237-5.9h0c-.041,0-.082,0-.123,0a15.806,15.806,0,0,0-5.94.971,10.876,10.876,0,0,0-7.107,8.737,1.5,1.5,0,0,1-1.373,1.219,10.948,10.948,0,0,0-4.018,1.251A6.486,6.486,0,0,0,3,1230.556a6.961,6.961,0,0,0,3.668,6.34A9.587,9.587,0,0,0,10.4,1237.953Z" transform="translate(0 -1200)"/></g></svg>
            <?php echo getLanguage("louibooks_cloud_storage_capacity"); ?>
            <span class = "cloud_contents_top_capacity_max_size">
                <?php
                    echo getLanguage("louibooks_cloud_total_capacity") . " " . getFileSizeToString($userInfo["cloud"]["maxSize"]);
                ?>
            </span>
        </div>
        <div class = "cloud_contents_usage" style = "display: <?php echo ($isPremium == true) ? "none" : "block"; ?>;">
            <?php
                $cloudUsePercent = $cloudFileSize / $userInfo["cloud"]["maxSize"];
                if ($cloudUsePercent > 1) { $cloudUsePercent = 1; }
            ?>
            <div class = "cloud_contents_usage_top">
                <div class = "cloud_contents_usage_top_progress" style = "width: <?php echo $cloudUsePercent * 100; ?>%"></div>
            </div>
            <div class = "cloud_contents_usage_bottom">
                <div class = "cloud_contents_usage_bottom_left">
                    <?php
                        echo getLanguage("louibooks_cloud_in_use") . ' ' . getFileSizeToString($cloudFileSize);
                    ?>
                </div>
                <div class = "cloud_contents_usage_bottom_right">
                    <?php
                        echo round($cloudUsePercent * 100, 1) . "%";
                    ?>
                </div>
            </div>
        </div>
        <div class = "cloud_contents_line"></div>
    </div>
    <div class = "cloud_contents_right">
        <div class = "cloud_contents_info">
            <div class = "cloud_contents_info_left scroll" id = "cloud_contents_info_left_<?php echo $menuNumber; ?>">
                <div class = "cloud_contents_info_left_item_wrap">
                    <div class = "cloud_contents_info_left_item md-ripples" onclick = "cloudLoadFolder(<?php echo $menuNumber; ?>, null);" onmouseup = "cloudMoveFolder(<?php echo $menuNumber; ?>, null);">
                        <?php echo getLanguage("my_cloud_folder"); ?>
                    </div>
                    <div class = "cloud_contents_info_left_item_icon">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.707 18.707l6-6c0.391-0.391 0.391-1.024 0-1.414l-6-6c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z"></path></svg>
                    </div>
                </div>
            </div>
            <div class = "cloud_contents_info_right">
                <div id = "cloud_contents_top_right_item_sort_<?php echo $menuNumber; ?>" class = "cloud_contents_top_right_item md-ripples" onchange = "cloudItemsSort(<?php echo $menuNumber; ?>);" onmouseenter = "hoverInformation(this, getLanguage('sort'));" popupwidth = "max-content" value = "0" onclick = "selectList(this, getSelectItemsCloudSort());">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="50" height="3" rx="1.5" transform="translate(0 7)"/><rect width="16" height="3" rx="1.5" transform="translate(0 41)"/><rect width="33" height="3" rx="1.5" transform="translate(0 24)"/></g></svg>
                </div>
                <div class = "cloud_contents_top_right_item md-ripples" onmouseenter = "hoverInformation(this, getLanguage('view_more'));" onclick = "moreButtonCloud(<?php echo $menuNumber; ?>, this);">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-1 -1.061)"><circle cx="3" cy="3" r="3" transform="translate(23 4)"></circle><path d="M3,0A2.971,2.971,0,0,1,6,2.942,2.971,2.971,0,0,1,3,5.884,2.971,2.971,0,0,1,0,2.942,2.971,2.971,0,0,1,3,0Z" transform="translate(23 23)"></path><path d="M3,0A3.031,3.031,0,0,1,6,3.061,3.031,3.031,0,0,1,3,6.121,3.031,3.031,0,0,1,0,3.061,3.031,3.031,0,0,1,3,0Z" transform="translate(23 42)"></path></g></g></svg>
                </div>
            </div>
        </div>
        <div class = "cloud_contents_items" id = "cloud_contents_items_<?php echo $menuNumber; ?>">
            <?php echo json_encode($cloudInfo); ?>
        </div>
        <div class = "cloud_contents_folder_empty" style = "display: none;">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-3094.635,49.5H-3116.5a3,3,0,0,1-3-3V3.5a3,3,0,0,1,3-3h31a3,3,0,0,1,3,3V37.365L-3094.635,49.5Z" transform="translate(3126)" opacity="0.7"/><path d="M3151.333,49.5l12.293-12.293h-9.846a2.517,2.517,0,0,0-1.983.575,2.884,2.884,0,0,0-.464,2.039Z" transform="translate(-3120)" opacity="0.6"/></g></svg>
            <div class = "cloud_contents_folder_empty_title">
                ...
            </div>
            <div class = "cloud_contents_folder_empty_description">
                ...
            </div>
        </div>
    </div>
</div>

<?php

    //KB
    function getFileSizeToString($size) {
        $str = null;
        if ($size < 1024) {
            $str = $size . "KB";
        } else if ($size < 1048576) {
            $str = floor($size / 1024) . "MB";
        } else if ($size < 1073741824) {
            $str = floor($size / 1024 / 1024) . "GB";
        } else if ($size < 1.0995116e+12) {
            $str = floor($size / 1024 / 1024 / 1024) . "TB";
        } else {
            $str = "...";
        }
        return $str;
    }

?>