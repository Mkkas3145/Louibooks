

<?php

    $menuNumber = $_POST["menuNumber"];
    $data = $_POST["data"];
    $partNumber = (int) $data;

    include_once('../../../default_function.php');
    $userInfo = getMyLoginInfo();

    //크리에이터 자격 없음
    if ($userInfo["creator_permission"] == false) {
        echo "no permission";
        exit;
    }

    if ($userInfo["isLogin"] == false) {
        echo 'not login'; exit;
    }

    //
    $stmt = $pdo->prepare("SELECT number, type, work_number, original_language FROM work_part WHERE user_number = :user_number AND number = :number");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"],
        ':number' => $partNumber
    ));
    $partInfo = $stmt->fetch();

    //
    $info = array(
        "type" => $partInfo["type"],
        "partNumber" => $partInfo["number"],
        "workNumber" => $partInfo["work_number"],
        "originalLanguage" => $partInfo["original_language"]
    );
    
    //현지화 정보
    $stmt = $pdo->prepare("SELECT part_number, language, title, thumbnail_image FROM work_part_localization WHERE part_number = :part_number");
    $stmt->execute(array(
        ':part_number' => $partInfo["number"],
    ));
    $localizationInfo = $stmt->fetchAll();
    $localizationInfo_count = count($localizationInfo);

    $data = array();
    for ($i = 0; $i < $localizationInfo_count; $i++) {
        $chapterTitleLocalization = null;
        if (isset($chapterTitle[$localizationInfo[$i]["language"]])) {
            $chapterTitleLocalization = $chapterTitle[$localizationInfo[$i]["language"]];
        }
        $data[] = array(
            'partNumber' => $localizationInfo[$i]["part_number"],
            'language' => $localizationInfo[$i]["language"],
            'thumbnailImage' => $localizationInfo[$i]["thumbnail_image"],
            'title' => $localizationInfo[$i]["title"],
        );
    }

?>

<div class = "localization_info" style = "display: none;">
    <?php echo json_encode($data); ?>
</div>
<div class = "info" style = "display: none;">
    <?php echo json_encode($info); ?>
</div>
<div class = "workspace_part_localization_contents">
    <div class = "workspace_part_localization_title">
        ...
    </div>
    <div class="workspace_part_localization_top_create_language md-ripples" onclick = "workspacePartLocalizationCreateLanguageButton(<?php echo $menuNumber; ?>);">
        <!-- Generated by IcoMoon.io -->
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 13h6v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6h6c0.552 0 1-0.448 1-1s-0.448-1-1-1h-6v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v6h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path></svg>
        <span>...</span>
    </div>
    <div class = "workspace_part_localization_items"></div>
    <div class = "menu_workspace_part_localization_no_data" style = "display: none;">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-3094.635,49.5H-3116.5a3,3,0,0,1-3-3V3.5a3,3,0,0,1,3-3h31a3,3,0,0,1,3,3V37.365L-3094.635,49.5Z" transform="translate(3126)" opacity="0.7"/><path d="M3151.333,49.5l12.293-12.293h-9.846a2.517,2.517,0,0,0-1.983.575,2.884,2.884,0,0,0-.464,2.039Z" transform="translate(-3120)" opacity="0.6"/></g></svg>
        <div class = "menu_workspace_part_localization_no_data_title">
            ...
        </div>
        <div class = "menu_workspace_part_localization_no_data_description">
            ...
        </div>
    </div>
</div>