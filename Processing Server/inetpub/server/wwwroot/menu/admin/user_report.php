<?php

    $menuNumber = $_POST["menuNumber"];

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    //권한 여부
    $isAdmin = $userInfo["admin"];
    if ($isAdmin != true) {
        echo "no permission";
        exit;
    }

?>

<div class = "user_report_info" style = "display: none;">
    <?php include_once('./php/user_report/getInfoNumbers.php'); ?>
</div>

<div class = "menu_admin_user_report">
    <div class = "menu_admin_user_report_title">
        ...
    </div>
    <div class = "menu_admin_user_report_sort">
        <div class = "sort_box md-ripples" onclick = "selectList(this, getMenuAdminUserReportSortItems());" onchange = "menuAdminUserReportOptionLoad(<?php echo $menuNumber; ?>);" popupwidth = "max-content" value = "0">
            <div class = "sort_box_title value_title">...</div>
            <div class = "sort_box_icon">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17.418 6.109c0.272-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-7.908 7.83c-0.27 0.268-0.707 0.268-0.979 0l-7.908-7.83c-0.27-0.268-0.27-0.701 0-0.969s0.709-0.268 0.979 0l7.419 7.141 7.418-7.141z"></path></svg>
            </div>
        </div>
        <div class = "sort_box md-ripples" onclick = "selectList(this, getLanguageSelectItem(true));" onchange = "menuAdminUserReportOptionLoad(<?php echo $menuNumber; ?>);" popupwidth = "max-content" value = "all">
            <div class = "sort_box_title value_title">...</div>
            <div class = "sort_box_icon">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17.418 6.109c0.272-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-7.908 7.83c-0.27 0.268-0.707 0.268-0.979 0l-7.908-7.83c-0.27-0.268-0.27-0.701 0-0.969s0.709-0.268 0.979 0l7.419 7.141 7.418-7.141z"></path></svg>
            </div>
        </div>
    </div>
    <div class = "menu_admin_user_report_items">
        <!-- item -->
    </div>
    <div class = "menu_admin_user_report_no_data" style = "display: none;">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-3094.635,49.5H-3116.5a3,3,0,0,1-3-3V3.5a3,3,0,0,1,3-3h31a3,3,0,0,1,3,3V37.365L-3094.635,49.5Z" transform="translate(3126)" opacity="0.7"/><path d="M3151.333,49.5l12.293-12.293h-9.846a2.517,2.517,0,0,0-1.983.575,2.884,2.884,0,0,0-.464,2.039Z" transform="translate(-3120)" opacity="0.6"/></g></svg>
        <div class = "menu_admin_user_report_no_data_title">
            ...
        </div>
        <div class = "menu_admin_user_report_no_data_description">
            ...
        </div>
    </div>
</div>
<div class = "admin_user_report_contents_loading" style = "padding: 20px; display: none;">
    <div class="showbox"><div class="loader" style="width: 35px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle></svg></div></div>
</div>