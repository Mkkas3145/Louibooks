<?php

    $menuNumber = $_POST["menuNumber"];
    $workNumber = $_POST["workNumber"];
    $chapter = 0;
    if (isset($_POST["data"])) {
        $chapter = $_POST["data"];
    }

    include_once('../../default_function.php');
    //$userInfo = getMyLoginInfo();

    $numbers = getWorkPartNumbers($workNumber, 1, $chapter);
    $partListNumbers = explode(",", $numbers);
    $partListInfoMaxCount = (count($partListNumbers) >= 25) ? 25 : count($partListNumbers);
    $partListInfo = getWorkPartInfo(implode(",", array_slice($partListNumbers, 0, $partListInfoMaxCount)));
    
?>

<div class = "work_number" style = "display: none;">
    <?php echo $workNumber; ?>
</div>
<div class = "part_list_numbers" style = "display: none;">
    <?php echo $numbers; ?>
</div>
<div class = "part_list_chapter_info" style = "display: none;">
    <?php echo json_encode(getWorkChapterInfo($workNumber)); ?>
</div>
<div class = "part_list_info" style = "display: none;">
    <?php echo json_encode($partListInfo); ?>
</div>

<div class = "menu_work_part_list_top">
    <div class = "menu_work_part_list_top_left">
        ...
    </div>
    <div class = "menu_work_part_list_top_right">
        <div class = "sort_box md-ripples" onchange = "workNavigationPartListOptionLoad(<?php echo $menuNumber; ?>);" popupwidth = "max-content" value = "1" onclick = "selectList(this, getWorkspaceWorkPartListSortItems());">
            <div class = "sort_box_title value_title">
                ...
            </div>
            <div class = "sort_box_icon">
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17.418 6.109c0.272-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-7.908 7.83c-0.27 0.268-0.707 0.268-0.979 0l-7.908-7.83c-0.27-0.268-0.27-0.701 0-0.969s0.709-0.268 0.979 0l7.419 7.141 7.418-7.141z"></path></svg>
            </div>
        </div>
        <div class = "sort_box md-ripples" onchange = "workNavigationPartListOptionLoad(<?php echo $menuNumber; ?>);" popupwidth = "max-content" value = "<?php echo $chapter; ?>" onclick = "selectList(this, getWorkNavigationPartListSelectItemsChapter(<?php echo $menuNumber; ?>));">
            <div class = "sort_box_title value_title">
                <?php echo $chapter; ?>
            </div>
            <div class = "sort_box_icon">
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17.418 6.109c0.272-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-7.908 7.83c-0.27 0.268-0.707 0.268-0.979 0l-7.908-7.83c-0.27-0.268-0.27-0.701 0-0.969s0.709-0.268 0.979 0l7.419 7.141 7.418-7.141z"></path></svg>
            </div>
        </div>
    </div>
</div>
<div class = "menu_work_part_list">
    <!-- 아이템 -->
</div>
<div class="work_navigation_part_list_contents_loading" style="padding: 20px; display: none;">
    <div class="showbox"><div class="loader" style="width: 35px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle></svg></div></div>
</div>