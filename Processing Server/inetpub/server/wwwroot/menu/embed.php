<?php

    include_once('../default_function.php');
    $userInfo = getMyLoginInfo();

    $menuNumber = $_POST["menuNumber"];
    $data = json_decode($_POST["data"], true);
    $partNumber = $data["number"];
    $partInfo = getWorkPartInfo($partNumber, null, true)[0];
    $workInfo = getWorkInfo($partInfo["work_number"])[0];

    //챕터 제목 구하기
    $chapterTitle = getWorkChapterTitle($workInfo["number"], $partInfo["chapter"])[0];

?>

<div class = "menu_title" style = "display: none;">
    <?php echo $partInfo["title"]; ?>
</div>
<div class = "chapter_title" style = "display: none;">
    <?php echo $chapterTitle; ?>
</div>
<div class = "part_info" style = "display: none;">
    <?php echo json_encode($partInfo); ?>
</div>
<div class = "work_info" style = "display: none;">
    <?php
        echo json_encode(array(
            "title" => $workInfo["title"],
            "originator" => $workInfo["originator"]
        ));
    ?>
</div>

<div class = "menu_embed">
    <!-- video -->
</div>