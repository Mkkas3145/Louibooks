<?php

    @include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    if (isset($workNumber) == false) {
        $workNumber = $_POST["workNumber"];
    }
    if (isset($menuNumber) == false) {
        $menuNumber = $_POST["menuNumber"];
    }

    $workInfo = getWorkInfo($workNumber)[0];
    $chapterInfo = getWorkChapterInfo($workNumber);

    //평가 정보
    $ratingsSort = 0; //인기순
    $ratingsMaxLength = 3;
    $ratingsNumbers = getRatingsNumbers($workNumber, $ratingsSort, null, $ratingsMaxLength);
    $ratingsInfo = getRatingsInfo($ratingsNumbers);
    $ratingsAnalysisInfo = getRatingsAnalysisInfo($workNumber)[0];
    $ratingsIsWritable = isWritableRatings($workNumber);

    //챕터가 한개 밖에 없으면 회차 목록으로 띄워줌
    $partInfo = null;

    //챕터가 1개일 경우
    $stmt = $pdo->prepare("SELECT number FROM work_part WHERE work_number = :work_number AND public_status = 0 AND chapter != 1 LIMIT 1");
    $stmt->execute(array(
        ':work_number' => $workNumber,
    ));
    $isChapter1 = $stmt->fetch();
    if (isset($isChapter1["number"])) {
        $isChapter1 = false;
    } else {
        $isChapter1 = true;
    }

    if ($isChapter1 == true) {
        $stmt = $pdo->prepare("SELECT number FROM work_part WHERE work_number = :work_number AND public_status = 0 LIMIT 5");
        $stmt->execute(array(
            ':work_number' => $workNumber,
        ));
        $part = $stmt->fetchAll();
        $part_length = count($part);

        $partNumbers = array();
        for ($i = 0; $i < $part_length; $i++) {
            $partNumbers[] = $part[$i]["number"];
        }

        $partInfo = getWorkPartInfo(implode(",", $partNumbers));
    }

    //프리미엄인지
    $isPremium = false;
    if ($userInfo["isLogin"] == true && $userInfo["rankInfo"]["rank"] == 5) {
        $isPremium = true;
    }

?>

<div class = "part_info" style = "display: none;">
    <?php echo json_encode($partInfo); ?>
</div>
<div class = "chapters_info" style = "display: none;">
    <?php echo json_encode($chapterInfo); ?>
</div>
<div class = "ratings_info" style = "display: none;">
    <?php 
        echo json_encode(array(
            "numbers" => $ratingsNumbers,
            "info" => $ratingsInfo,
            "analysisInfo" => $ratingsAnalysisInfo,
            "isWritable" => $ratingsIsWritable
        ));
    ?>
</div>
<div class = "is_premium" style = "display: none;">
    <?php echo $isPremium; ?>
</div>

<div class = "menu_work_home_item">
    <div class = "menu_work_home_item_title">
        ...
    </div>
    <div class = "menu_work_home_item_chapters horizontal_scroll">
        <!-- 아이템 -->
    </div>
</div>
<div class = "menu_work_home_item" style = "margin-top: -5px;">
    <div class = "menu_work_home_item_title">
        ...
    </div>
    <div class = "menu_work_home_item_description_part_list">
        ...
    </div>
    <div class = "menu_work_home_part_list_items">
        <!-- 아이템 -->
    </div>
    <div class = "menu_work_home_item_part_list_more_button md-ripples" onclick = "requestWorkNavigation(<?php echo $menuNumber; ?>, 'part_list');">
        <div class = "menu_work_home_item_part_list_more_button_icon">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="10" height="3" rx="1.5" transform="translate(0 7)"></rect><rect width="35" height="3" rx="1.5" transform="translate(15 7)"></rect><rect width="10" height="3" rx="1.5" transform="translate(0 24)"></rect><rect width="10" height="3" rx="1.5" transform="translate(0 41)"></rect><rect width="29" height="3" rx="1.5" transform="translate(15 24)"></rect><rect width="35" height="3" rx="1.5" transform="translate(15 41)"></rect></g></svg>
        </div>
        <div class = "menu_work_home_item_part_list_more_button_text">
            ...
        </div>
    </div>
</div>
<div class = "menu_work_home_line"></div>
<div class = "menu_work_home_item">
    <div class = "menu_work_home_item_title">
        ...
    </div>
    <div class = "menu_work_home_item_description"><?php echo str_replace("\n\r", "​", $workInfo["description"]); ?></div>
    <div class = "menu_work_home_item_genre">
        <?php echo $workInfo["genre"]; ?>
    </div>
</div>
<div class = "menu_work_home_line"></div>
<div class = "menu_work_home_item" style = "margin-top: 40px;">
    <div class = "menu_work_home_item_title">
        ...
    </div>
    <div class = "menu_work_home_item_ratings">
        <!-- html -->
    </div>
</div>
<div class = "google_adsense">
    <!-- adsense -->
</div>