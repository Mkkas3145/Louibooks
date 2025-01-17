

<?php

    $menuNumber = $_POST["menuNumber"];
    $data = $_POST["data"];
    $workNumber = (int) $data;

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    if ($userInfo["isLogin"] == false) {
        echo 'not login'; exit;
    }

    $stmt = $pdo->prepare("SELECT number, type, cover_image, default_cover_image, chapter FROM works WHERE user_number = :user_number AND number = :number");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"],
        ':number' => $workNumber,
    ));
    $work = $stmt->fetch();

    $stmt = $pdo->prepare("SELECT number FROM work_part WHERE user_number = :user_number AND work_number = :work_number AND type = :type");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"],
        ':type' => $work["type"],
        ':work_number' => $work["number"],
    ));
    $partList = array_reverse($stmt->fetchAll());
    $partListNumbers = array();
    for ($i = 0; $i < count($partList); $i++) {
        $partListNumbers[$i] = $partList[$i]["number"];
    }
    $partListInfoMaxCount = (count($partListNumbers) >= 25) ? 25 : count($partListNumbers);
    $partListInfo = getWorkPartInfo(implode(",", array_slice($partListNumbers, 0, $partListInfoMaxCount)), "original");

?>

<div class = "workspace_work_info_json" style = "display: none;">
    <?php echo json_encode($work); ?>
</div>
<div class = "workspace_work_part_list_info_json" style = "display: none;">
    <?php echo json_encode($partListInfo); ?>
</div>
<div class = "workspace_work_part_list_numbers" style = "display: none;">
    <?php echo implode(",", $partListNumbers); ?>
</div>
<div class = "workspace_work_part_list_latest_number" style = "display: none;">
    <?php
        if (count($partListNumbers) >= 1) {
            echo $partListNumbers[0];
        } else {
            echo 'null';
        }
    ?>
</div>
<div class = "workspace_work_part_list_latest_chapter" style = "display: none;">
    <?php
        echo $work["chapter"];
    ?>
</div>
<div class = "workspace_work_part_list_chapter_info" style = "display: none;">
    <?php
        if ($work["chapter"] != 0) {
            $chapterList = array();
            for ($i = 0; $i < $work["chapter"]; $i++) {
                $chapterList[$i] = $i + 1;
            }
            echo json_encode(getWorkChapterTitle($workNumber, implode(",", $chapterList)));
        }
    ?>
</div>
<div class = "workspace_work_part_list_original_chapter_info" style = "display: none;">
    <?php
        if ($work["chapter"] != 0) {
            $chapterList = array();
            for ($i = 0; $i < $work["chapter"]; $i++) {
                $chapterList[$i] = $i + 1;
            }
            echo json_encode(getWorkChapterTitle($workNumber, implode(",", $chapterList), "original"));
        }
    ?>
</div>

<div class = "workspace_work_contents">
    <div class = "workspace_work_contents_left">
        <div class = "workspace_work_contents_left_title">
            <?php echo getLanguage("workspace_work_work_part"); ?>
        </div>
        <div class = "workspace_work_contents_left_work_part_list_wrap">
            <!-- 작품 회차정보 -->
        </div>
    </div>
</div>