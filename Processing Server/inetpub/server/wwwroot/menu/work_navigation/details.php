<?php

    $menuNumber = $_POST["menuNumber"];
    $workNumber = $_POST["workNumber"];

    include_once('../../default_function.php');
    $workInfo = getWorkInfo($workNumber)[0];
    
    //현재 시간
    $newDate = date("Y-m-d H:i:s");

    //작품 회차 정보
    $stmt = $pdo->prepare("SELECT views, upload_date FROM work_part WHERE work_number = :work_number AND public_status = 0");
    $stmt->execute(array(
        "work_number" => $workInfo["number"]
    ));
    $workPart = $stmt->fetchAll();
    $workPart_length = count($workPart);
    $viewsTotal = 0;
    $viewsCount = 0;
    $PreviousUploadDate = null;
    $uploadDateTotal = 0;
    $uploadDateCount = 0;
    for ($i = 0; $i < $workPart_length; $i++) {
        $viewsTotal += $workPart[$i]["views"];
        $viewsCount ++;

        if ($PreviousUploadDate != null) {
            $uploadDateTotal += getTimeDifference($PreviousUploadDate, $workPart[$i]["upload_date"]);
            $uploadDateCount ++;
        }
        $PreviousUploadDate = $workPart[$i]["upload_date"];
    }
    //평균 조회수
    $averageViews = 0;
    if ($viewsCount != 0) {
        $averageViews = $viewsTotal / $viewsCount;
    }
    //평균 업로드 간격 (초)
    $averageUploadInterval = null;
    if ($uploadDateCount != 0) {
        $averageUploadInterval = $uploadDateTotal / $uploadDateCount;
    }
    //연독률
    $continuousViewedPercent = getWorkContinuousViewedPercent($workInfo["number"]);

    //분석 데이터
    $demographics = getWorksAnalysisInfo($workInfo["number"])["demographics"];

    //주 사용자층 - 위치
    $mainUserBaseLocationData = array();
    foreach ($demographics as $key => $value) {
        $location = $value["location"];
        foreach ($location as $key => $value) {
            if ($key != "all") {
                if (isset($mainUserBaseLocationData[$key])) {
                    $mainUserBaseLocationData[$key] += $value["total"];
                } else {
                    $mainUserBaseLocationData[$key] = $value["total"];
                }
            }
        }
    }
    $totalUserBaseLocation = 0;
    $maxValueMainUserBaseLocation = 0;
    $mainUserBaseLocation = null;
    foreach ($mainUserBaseLocationData as $key => $value) {
        if ($value > $maxValueMainUserBaseLocation) {
            $maxValueMainUserBaseLocation = $value;
            $mainUserBaseLocation = $key;
        }
        $totalUserBaseLocation += $value;
    }
    $mainUserBasePercent = 0;
    if ($totalUserBaseLocation != 0) {
        $mainUserBasePercent = $maxValueMainUserBaseLocation / $totalUserBaseLocation;
    }

    //유입 경로
    $funnelsData = array();
    foreach ($demographics as $key => $value) {
        $type = $value["type"];
        $total = $value["all"]["total"];
        if (isset($funnelsData[$type])) {
            $funnelsData[$type] += $total;
        } else {
            $funnelsData[$type] = $total;
        }
    }
    $totalFunnels = 0;
    $maxValueFunnels = 0;
    $funnelsType = null;
    foreach ($funnelsData as $key => $value) {
        if ($value > $maxValueFunnels) {
            $maxValueFunnels = $value;
            $funnelsType = $key;
        }
        $totalFunnels += $value;
    }
    $funnelsPercent = 0;
    if ($totalFunnels != 0) {
        $funnelsPercent = $maxValueFunnels / $totalFunnels;
    }

    //성별
    $genderTotal = 0;
    $male = 0;
    $female = 0;
    foreach ($demographics as $key => $value) {
        $gender = $value["gender"];
        foreach ($gender as $key => $value) {
            if ($key == "male") {
                $male += $value;
                $genderTotal += $value;
            } else if ($key == "female") {
                $female += $value;
                $genderTotal += $value;
            }
        }
    }
    $malePercent = 0;
    $femalePercent = 0;
    if ($genderTotal != 0) {
        $malePercent = $male / $genderTotal;
        $femalePercent = $female / $genderTotal;
    }
    
    //나이
    $ageType = null;
    $ageData = array();
    foreach ($demographics as $key => $value) {
        $ageType = $value["ageType"];
        foreach ($ageType as $key => $value) {
            if ($key != "total") {
                if (isset($ageData[$key])) {
                    $ageData[$key] += $value;
                } else {
                    $ageData[$key] = $value;
                }
            }
        }
    }
    $totalAge = 0;
    $maxValueAge = 0;
    $ageType = null;
    foreach ($ageData as $key => $value) {
        if ($value > $maxValueAge) {
            $maxValueAge = $value;
            $ageType = (int) str_replace("type_", "", $key);
        }
        $totalAge += $value;
    }
    $agePercent = 0;
    if ($totalAge != 0) {
        $agePercent = $maxValueAge / $totalAge;
    }

    $analysisInfo = array(
        "averageViews" => $averageViews,
        "averageUploadInterval" => $averageUploadInterval,
        "continuousViewedPercent" => $continuousViewedPercent,
        "mainUserBase" => array(
            "location" => $mainUserBaseLocation,
            "percent" => $mainUserBasePercent
        ),
        "funnels" => array(
            "type" => $funnelsType,
            "percent" => $funnelsPercent
        ),
        "userAge" => array(
            "type" => $ageType,
            "percent" => $agePercent
        ),
        "genderPercent" => array(
            "male" => $malePercent,
            "female" => $femalePercent
        )
    );

    //작품에 기여한 사용자 구하기
    $stmt = $pdo->prepare("SELECT contributor_number FROM work_part_localization WHERE work_number = :work_number GROUP BY contributor_number ORDER BY COUNT(contributor_number) DESC LIMIT 10");
    $stmt->execute(array(
        "work_number" => $workInfo["number"]
    ));
    $localization = $stmt->fetchAll();
    $localization_length = count($localization);

    $userData = array();
    $userData_length = 0;
    if ($localization_length != 0) {
        $userNumbers = array();
        for ($i = 0; $i < $localization_length; $i++) {
            $userNumbers[] = $localization[$i]["contributor_number"];
        }
        $userData = getUserInfo(implode(",", $userNumbers));
        $userData_length = count($userData);
    }

    $contributorInfo = array();
    for ($i = 0; $i < $userData_length; $i++) {
        $contributorInfo[] = array(
            "number" => $userData[$i]["number"],
            "nickname" => $userData[$i]["nickname"],
            "description" => $userData[$i]["description"],
            "profile" => $userData[$i]["profile"]
        );
    }

?>

<div class = "work_info" style = "display: none;">
    <?php echo json_encode($workInfo); ?>
</div>
<div class = "analysis_info" style = "display: none;">
    <?php echo json_encode($analysisInfo); ?>
</div>
<div class = "contributor_info" style = "display: none;">
    <?php echo json_encode($contributorInfo); ?>
</div>

<div class = "work_navigation_details">
    <div class = "work_navigation_details_title">
        ...
    </div>
    <div class="menu_work_info_right_originator">
        <div class="menu_work_info_right_originator_left md-ripples" onclick="loadMenu_user(<?php echo $workInfo["originator"]["number"]; ?>);">
            <div class = "menu_work_info_right_originator_left_profile">
                ...
            </div>
            <div class="menu_work_info_right_originator_left_nickname">
                ...
            </div>
        </div>
    </div>
    <div class = "work_navigation_details_items">
        <div class = "menu_work_info_right_info_item">
            ...
        </div>
        <div class = "menu_work_info_right_info_item">
            <svg style="margin-right: 7px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-161.3,48.508a.992.992,0,0,1-.583-.194l-12.534-9.07a1,1,0,0,0-.586-.19,1,1,0,0,0-.586.19l-12.534,9.07a.99.99,0,0,1-.583.194,1.021,1.021,0,0,1-.808-.407.971.971,0,0,1-.158-.869l4.378-15.5a1,1,0,0,0-.335-1.05L-197.884,20.8a.978.978,0,0,1-.32-1.1.979.979,0,0,1,.921-.68l15.335-.412a1,1,0,0,0,.921-.681l5.08-15.112A.987.987,0,0,1-175,2.139a.987.987,0,0,1,.948.681l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a.979.979,0,0,1,.921.68.978.978,0,0,1-.32,1.1l-12.256,9.877a1,1,0,0,0-.336,1.05l4.378,15.5a.972.972,0,0,1-.158.869A1.021,1.021,0,0,1-161.3,48.508Zm-13.655-12.455a3.809,3.809,0,0,1,2.185.7c2.2,1.509,7.989,5.785,8.047,5.828l-2.968-10.516a4,4,0,0,1,1.281-3.609c1.666-1.266,8.107-6.541,8.172-6.594l-10.031-.219h-.027a3.779,3.779,0,0,1-3.488-2.781c-.969-2.829-3.213-9.345-3.235-9.407l-3.235,9.734c-.011.024-1.121,2.438-3.5,2.453-2.4.015-9.925.233-10,.235l8.407,6.844a3.748,3.748,0,0,1,.968,3.687l-2.844,10.11,8.063-5.828A4.312,4.312,0,0,1-174.951,36.053Z" transform="translate(200)"></path></g></svg>
            <span></span>
        </div>
        <div class = "menu_work_info_right_info_item">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,37a21.437,21.437,0,0,1-9.731-2.508,34.262,34.262,0,0,1-7.947-5.721A39.4,39.4,0,0,1,1.965,22.54,10.312,10.312,0,0,1,0,18.5a10.313,10.313,0,0,1,1.965-4.04A39.4,39.4,0,0,1,7.323,8.229a34.261,34.261,0,0,1,7.947-5.721A21.437,21.437,0,0,1,25,0a21.236,21.236,0,0,1,9.728,2.538A34.517,34.517,0,0,1,42.67,8.311a40.627,40.627,0,0,1,5.357,6.242A10.518,10.518,0,0,1,50,18.5c.01,1.175-2.446,5.3-6.467,9.358a35.762,35.762,0,0,1-8.228,6.3A21.562,21.562,0,0,1,25,37ZM25,2.964C13.381,2.964,3.264,16.237,3.264,18.5S13.381,34.036,25,34.036c7.276,0,13.532-5.214,16.613-8.322,3.016-3.042,5.109-6.244,5.1-7.214-.009-1.079-2.552-4.948-6.516-8.557C36.7,6.759,31.227,2.964,25,2.964Z" transform="translate(0 7)"></path><path d="M9.5,19A9.5,9.5,0,0,1,2.783,2.783,9.5,9.5,0,0,1,16.217,16.217,9.437,9.437,0,0,1,9.5,19Zm0-16.026A6.526,6.526,0,1,0,16.026,9.5,6.534,6.534,0,0,0,9.5,2.974Z" transform="translate(16 16)"></path></g></svg>
            <span></span>
        </div>
        <div class = "menu_work_info_right_info_item">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M27,30H3a3,3,0,0,1-3-3V3A3,3,0,0,1,3,0H27a3,3,0,0,1,3,3V27A3,3,0,0,1,27,30ZM2.647,2.647V27.353H27.353V2.647Z" transform="translate(0 20)"></path><rect width="32" height="3" rx="1.5" transform="translate(8 10)"></rect><rect width="31" height="3" rx="1.5" transform="translate(40 10) rotate(90)"></rect><rect width="32" height="3" rx="1.5" transform="translate(18)"></rect><rect width="32" height="3" rx="1.5" transform="translate(50) rotate(90)"></rect></g></svg>
            <span></span>
        </div>
        <div class = "menu_work_info_right_info_item">
            ...
        </div>
        <div class = "menu_work_info_right_info_item">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(0 -10)"><rect width="3" height="39" rx="1.5" transform="translate(13.339 12.326) rotate(20)"></rect><rect width="3" height="39" rx="1.5" transform="translate(12.35 13.352) rotate(-20)"></rect><rect width="3" height="15.5" rx="1.5" transform="translate(22.179 33.413) rotate(90)"></rect></g><g transform="translate(4.821 6)"><rect width="3" height="23.5" rx="1.5" transform="translate(45.179 15.413) rotate(90)"></rect><rect width="3" height="6.299" rx="1.5" transform="translate(34.929 17.589) rotate(180)"></rect><path d="M6.258-1.278A1.576,1.576,0,0,1,7.282.152s-3.4,8.118-4.351,14.5A42.123,42.123,0,0,0,3,26.749a1.5,1.5,0,0,1-3,0A46.581,46.581,0,0,1,.157,14.4C1.163,7.87,4.524-.436,4.524-.436A1.37,1.37,0,0,1,6.258-1.278Z" transform="translate(30.054 41.378) rotate(-150)"></path><path d="M-4.084.024A1.4,1.4,0,0,1-2.138.58,46.577,46.577,0,0,1,2.6,12.127a40.794,40.794,0,0,1,.4,11.8,1.5,1.5,0,0,1-3,0,25.612,25.612,0,0,0,0-10.38A49.119,49.119,0,0,0-4.77,1.8,1.48,1.48,0,0,1-4.084.024Z" transform="translate(39.585 41.423) rotate(150)"></path></g></g></svg>
            <span></span>
        </div>
        <div class = "menu_work_info_right_info_item">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,50A25.007,25.007,0,0,1,15.269,1.965,25.007,25.007,0,0,1,34.731,48.036,24.843,24.843,0,0,1,25,50ZM25,3A22,22,0,1,0,47,25,22.025,22.025,0,0,0,25,3Z"></path><g transform="translate(0 1)"><rect width="3" height="21" rx="1.5" transform="translate(23 6)"></rect><rect width="3" height="21" rx="1.5" transform="translate(44 24) rotate(90)"></rect></g></g></svg>
            <span></span>
        </div>
        <div class = "menu_work_info_right_info_item">
            ...
        </div>
    </div>
    <div class = "work_navigation_details_line"></div>
    <div class = "work_navigation_details_description">
        ...
    </div>
    <div class = "menu_work_info_right_description_genre">
        <!-- item -->
    </div>
    <div class = "work_navigation_details_line"></div>
    <div class = "work_navigation_details_analysis_title">
        ...
    </div>
    <div class = "work_navigation_details_analysis_items_wrap">
        <div class = "work_navigation_details_analysis_items">
            <div class = "work_navigation_details_analysis_item">
                <div class = "work_navigation_details_analysis_item_left">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,37a21.437,21.437,0,0,1-9.731-2.508,34.262,34.262,0,0,1-7.947-5.721A39.4,39.4,0,0,1,1.965,22.54,10.312,10.312,0,0,1,0,18.5a10.313,10.313,0,0,1,1.965-4.04A39.4,39.4,0,0,1,7.323,8.229a34.261,34.261,0,0,1,7.947-5.721A21.437,21.437,0,0,1,25,0a21.236,21.236,0,0,1,9.728,2.538A34.517,34.517,0,0,1,42.67,8.311a40.627,40.627,0,0,1,5.357,6.242A10.518,10.518,0,0,1,50,18.5c.01,1.175-2.446,5.3-6.467,9.358a35.762,35.762,0,0,1-8.228,6.3A21.562,21.562,0,0,1,25,37ZM25,2.964C13.381,2.964,3.264,16.237,3.264,18.5S13.381,34.036,25,34.036c7.276,0,13.532-5.214,16.613-8.322,3.016-3.042,5.109-6.244,5.1-7.214-.009-1.079-2.552-4.948-6.516-8.557C36.7,6.759,31.227,2.964,25,2.964Z" transform="translate(0 7)"></path><path d="M9.5,19A9.5,9.5,0,0,1,2.783,2.783,9.5,9.5,0,0,1,16.217,16.217,9.437,9.437,0,0,1,9.5,19Zm0-16.026A6.526,6.526,0,1,0,16.026,9.5,6.534,6.534,0,0,0,9.5,2.974Z" transform="translate(16 16)"></path></g></svg>
                </div>
                <div class = "work_navigation_details_analysis_item_right">
                    <div class = "work_navigation_details_analysis_item_right_title">
                        ...
                    </div>
                    <div class = "work_navigation_details_analysis_item_right_value">
                        ...
                    </div>
                </div>
            </div>
            <div class = "work_navigation_details_analysis_line"></div>
            <div class = "work_navigation_details_analysis_item">
                <div class = "work_navigation_details_analysis_item_left">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5"></rect><rect width="3" height="50" rx="1.5" transform="translate(50 47) rotate(90)"></rect><rect width="3" height="18" rx="1.5" transform="translate(10 24)"></rect><rect width="3" height="28" rx="1.5" transform="translate(20 14)"></rect><rect width="3" height="11" rx="1.5" transform="translate(29 31)"></rect><rect width="3" height="21" rx="1.5" transform="translate(39 21)"></rect></g></svg>
                </div>
                <div class = "work_navigation_details_analysis_item_right">
                    <div class = "work_navigation_details_analysis_item_right_title">
                        ...
                    </div>
                    <div class = "work_navigation_details_analysis_item_right_value">
                        ...
                    </div>
                    <div class = "work_navigation_details_analysis_item_right_lines">
                        <div class = "work_navigation_details_analysis_item_right_line"></div>
                    </div>
                </div>
            </div>
            <div class = "work_navigation_details_analysis_line"></div>
            <div class = "work_navigation_details_analysis_item">
                <div class = "work_navigation_details_analysis_item_left">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,50A25.007,25.007,0,0,1,15.269,1.965,25.007,25.007,0,0,1,34.731,48.036,24.843,24.843,0,0,1,25,50ZM25,3A22,22,0,1,0,47,25,22.025,22.025,0,0,0,25,3Z"></path><rect width="48" height="2" transform="translate(26 1) rotate(90)"></rect><path d="M0,0S11.775-11.288,23.775-11.288,48,0,48,0V2S35.775-9.288,23.775-9.288,0,2,0,2Z" transform="translate(26 1) rotate(90)"></path><path d="M0,0S11.775-11.288,23.775-11.288,48,0,48,0V2S35.775-9.288,23.775-9.288,0,2,0,2Z" transform="translate(24 49) rotate(-90)"></path><path d="M0,0S11.923-4.994,23.923-4.994,48,0,48,0V2S35.923-2.994,23.923-2.994,0,2,0,2Z" transform="translate(49 31.856) rotate(-180)"></path><path d="M0,0S11.923-4.994,23.923-4.994,48,0,48,0V2S35.923-2.994,23.923-2.994,0,2,0,2Z" transform="translate(1 17.85)"></path></g></svg>
                </div>
                <div class = "work_navigation_details_analysis_item_right">
                    <div class = "work_navigation_details_analysis_item_right_title">
                        ...
                    </div>
                    <div class = "work_navigation_details_analysis_item_right_value">
                        ...
                    </div>
                    <div class = "work_navigation_details_analysis_item_right_lines">
                        <div class = "work_navigation_details_analysis_item_right_line"></div>
                    </div>
                </div>
            </div>
            <div class = "work_navigation_details_analysis_line"></div>
            <div class = "work_navigation_details_analysis_item">
                <div class = "work_navigation_details_analysis_item_left">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-2508.472,29.514h0a47.738,47.738,0,0,1-4.76-4.993A35.214,35.214,0,0,1-2520,12.7a16.5,16.5,0,0,1,.432-3.451,13.123,13.123,0,0,1,3.217-6.267A10.63,10.63,0,0,1-2508.472,0a10.573,10.573,0,0,1,7.862,2.982,13.036,13.036,0,0,1,3.181,6.267,16.483,16.483,0,0,1,.412,3.451,35.363,35.363,0,0,1-6.749,11.878,45.984,45.984,0,0,1-4.705,4.935Zm0-26.743a7.764,7.764,0,0,0-5.8,2.216c-2.726,2.8-2.636,7.308-2.635,7.353,1.273,5.211,8.368,13.212,8.439,13.292.066-.074,6.829-7.656,8.422-13.292,0-.045.09-4.564-2.622-7.353A7.752,7.752,0,0,0-2508.477,2.771Z" transform="translate(2540.36 0.103)"/><path d="M-2514,12a6.007,6.007,0,0,1-6-6,6.007,6.007,0,0,1,6-6,6.007,6.007,0,0,1,6,6A6.006,6.006,0,0,1-2514,12Zm0-9a3,3,0,0,0-3,3,3,3,0,0,0,3,3,3,3,0,0,0,3-3A3,3,0,0,0-2514,3Z" transform="translate(2520 38)"/><path d="M2531.824,42.44l33.7.04s1.385-.119,1.345-2.413-1.345-2.452-1.345-2.452l-29.071-.04a5.1,5.1,0,0,1-4.43-5.537c.237-4.984,4.43-5.537,4.43-5.537h15.465v3.125h-15.148a2.463,2.463,0,0,0-1.7,2.65c.119,2.175,1.7,2.215,1.7,2.215h28.754s4.43.435,4.311,5.577-4.311,5.458-4.311,5.458l-33.7-.079Z" transform="translate(-2520)"/><path d="M-2515,10a5.006,5.006,0,0,1-5-5,5.006,5.006,0,0,1,5-5,5.005,5.005,0,0,1,5,5A5.005,5.005,0,0,1-2515,10Zm0-7.5a2.5,2.5,0,0,0-2.5,2.5,2.5,2.5,0,0,0,2.5,2.5,2.5,2.5,0,0,0,2.5-2.5A2.5,2.5,0,0,0-2515,2.5Z" transform="translate(2547 7)"/></g></svg>
                </div>
                <div class = "work_navigation_details_analysis_item_right">
                    <div class = "work_navigation_details_analysis_item_right_title">
                        ...
                    </div>
                    <div class = "work_navigation_details_analysis_item_right_value">
                        ...
                    </div>
                    <div class = "work_navigation_details_analysis_item_right_lines">
                        <div class = "work_navigation_details_analysis_item_right_line"></div>
                    </div>
                </div>
            </div>
            <div class = "work_navigation_details_analysis_line"></div>
            <div class = "work_navigation_details_analysis_item">
                <div class = "work_navigation_details_analysis_item_left">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(0 -10)"><rect width="3" height="39" rx="1.5" transform="translate(13.339 12.326) rotate(20)"></rect><rect width="3" height="39" rx="1.5" transform="translate(12.35 13.352) rotate(-20)"></rect><rect width="3" height="15.5" rx="1.5" transform="translate(22.179 33.413) rotate(90)"></rect></g><g transform="translate(4.821 6)"><rect width="3" height="23.5" rx="1.5" transform="translate(45.179 15.413) rotate(90)"></rect><rect width="3" height="6.299" rx="1.5" transform="translate(34.929 17.589) rotate(180)"></rect><path d="M6.258-1.278A1.576,1.576,0,0,1,7.282.152s-3.4,8.118-4.351,14.5A42.123,42.123,0,0,0,3,26.749a1.5,1.5,0,0,1-3,0A46.581,46.581,0,0,1,.157,14.4C1.163,7.87,4.524-.436,4.524-.436A1.37,1.37,0,0,1,6.258-1.278Z" transform="translate(30.054 41.378) rotate(-150)"></path><path d="M-4.084.024A1.4,1.4,0,0,1-2.138.58,46.577,46.577,0,0,1,2.6,12.127a40.794,40.794,0,0,1,.4,11.8,1.5,1.5,0,0,1-3,0,25.612,25.612,0,0,0,0-10.38A49.119,49.119,0,0,0-4.77,1.8,1.48,1.48,0,0,1-4.084.024Z" transform="translate(39.585 41.423) rotate(150)"></path></g></g></svg>
                </div>
                <div class = "work_navigation_details_analysis_item_right">
                    <div class = "work_navigation_details_analysis_item_right_title">
                        ...
                    </div>
                    <div class = "work_navigation_details_analysis_item_right_value">
                        ...
                    </div>
                    <div class = "work_navigation_details_analysis_item_right_lines">
                        <div class = "work_navigation_details_analysis_item_right_line"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class = "work_navigation_details_analysis_items">
            <div class = "work_navigation_details_analysis_item">
                <div class = "work_navigation_details_analysis_item_left">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,50A25.007,25.007,0,0,1,15.269,1.965,25.007,25.007,0,0,1,34.731,48.036,24.843,24.843,0,0,1,25,50ZM25,3A22,22,0,1,0,47,25,22.025,22.025,0,0,0,25,3Z"></path><g transform="translate(0 1)"><rect width="3" height="21" rx="1.5" transform="translate(23 6)"></rect><rect width="3" height="21" rx="1.5" transform="translate(44 24) rotate(90)"></rect></g></g></svg>
                </div>
                <div class = "work_navigation_details_analysis_item_right">
                    <div class = "work_navigation_details_analysis_item_right_title">
                        ...
                    </div>
                    <div class = "work_navigation_details_analysis_item_right_value">
                        ...
                    </div>
                </div>
            </div>
            <div class = "work_navigation_details_analysis_line"></div>
            <div class = "work_navigation_details_analysis_item">
                <div class = "work_navigation_details_analysis_item_left">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-1)"><path d="M-2147,24a11.923,11.923,0,0,1-8.486-3.515A11.922,11.922,0,0,1-2159,12a11.921,11.921,0,0,1,3.515-8.485A11.923,11.923,0,0,1-2147,0a11.921,11.921,0,0,1,8.485,3.515A11.921,11.921,0,0,1-2135,12a11.923,11.923,0,0,1-3.515,8.486A11.921,11.921,0,0,1-2147,24Zm0-21a9.01,9.01,0,0,0-9,9,9.01,9.01,0,0,0,9,9,9.01,9.01,0,0,0,9-9A9.01,9.01,0,0,0-2147,3Z" transform="translate(2161 4)"/><rect width="3" height="20" rx="1.5" transform="translate(13 26)"/><rect width="3" height="19" rx="1.5" transform="translate(24 34) rotate(90)"/></g><rect width="3" height="20" rx="1.5" transform="translate(38.336 24) rotate(-180)"/><path d="M2195.887,6.993l-6.175,6.447s-1.324.736-2.06-.221a1.645,1.645,0,0,1,0-1.938l8.413-8.461a1.47,1.47,0,0,1,1.888,0c.907.809,8.412,8.461,8.412,8.461s.736,1.423-.147,2.109a1.815,1.815,0,0,1-1.962,0l-6.3-6.4Z" transform="translate(-2159.988 0.404)"/><path d="M-2148,24a11.921,11.921,0,0,1-8.485-3.515A11.923,11.923,0,0,1-2160,12a11.921,11.921,0,0,1,3.515-8.485A11.921,11.921,0,0,1-2148,0a11.923,11.923,0,0,1,8.486,3.515A11.921,11.921,0,0,1-2136,12a11.923,11.923,0,0,1-3.515,8.486A11.922,11.922,0,0,1-2148,24Zm0-21a9.01,9.01,0,0,0-9,9,9.01,9.01,0,0,0,9,9,9.01,9.01,0,0,0,9-9A9.01,9.01,0,0,0-2148,3Z" transform="translate(2185 22)"/></g></svg>
                </div>
                <div class = "work_navigation_details_analysis_item_right">
                    <div class = "work_navigation_details_analysis_item_right_title">
                        ...
                    </div>
                    <div class = "work_navigation_details_analysis_item_right_value">
                        ...
                    </div>
                    <div class = "work_navigation_details_analysis_item_right_lines">
                        <div class = "work_navigation_details_analysis_item_right_line"></div>
                    </div>
                </div>
            </div>
            <div class = "work_navigation_details_analysis_line"></div>
            <div class = "work_navigation_details_analysis_item">
                <div class = "work_navigation_details_analysis_item_left">
                    <svg style = "fill: var(--site-color-light);" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(17.423 -21.984) rotate(45)"><rect width="3" height="23.183" rx="1.5" transform="translate(40.08 27.865) rotate(-180)"/><path d="M2197.25,7.714l-7.158,7.473s-1.535.853-2.388-.256a1.907,1.907,0,0,1,0-2.246l9.751-9.808a1.7,1.7,0,0,1,2.189,0c1.052.938,9.751,9.808,9.751,9.808s.853,1.649-.171,2.445a2.1,2.1,0,0,1-2.274,0l-7.306-7.416Z" transform="translate(-2159.617 0.404)"/><path d="M14,28A14,14,0,0,1,4.1,4.1,14,14,0,1,1,23.9,23.9,13.909,13.909,0,0,1,14,28ZM14,3.5A10.5,10.5,0,1,0,24.5,14,10.512,10.512,0,0,0,14,3.5Z" transform="translate(24.58 24.865)"/></g></g></svg>
                </div>
                <div class = "work_navigation_details_analysis_item_right">
                    <div class = "work_navigation_details_analysis_item_right_title">
                        ...
                    </div>
                    <div class = "work_navigation_details_analysis_item_right_value">
                        ...
                    </div>
                    <div class = "work_navigation_details_analysis_item_right_lines">
                        <div class = "work_navigation_details_analysis_item_right_line"></div>
                    </div>
                </div>
            </div>
            <div class = "work_navigation_details_analysis_line"></div>
            <div class = "work_navigation_details_analysis_item">
                <div class = "work_navigation_details_analysis_item_left">
                    <svg style = "fill: var(--color-failure);" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(9.87 -3)"><path d="M13.5,27A13.5,13.5,0,0,1,3.954,3.954,13.5,13.5,0,1,1,23.046,23.046,13.41,13.41,0,0,1,13.5,27Zm0-23.625A10.125,10.125,0,1,0,23.625,13.5,10.136,10.136,0,0,0,13.5,3.375Z" transform="translate(2.13 4)"/><rect width="3" height="23" rx="1.5" transform="translate(14.13 29)"/><rect width="3" height="23" rx="1.5" transform="translate(27.13 38) rotate(90)"/></g></g></svg>
                </div>
                <div class = "work_navigation_details_analysis_item_right">
                    <div class = "work_navigation_details_analysis_item_right_title">
                        ...
                    </div>
                    <div class = "work_navigation_details_analysis_item_right_value">
                        ...
                    </div>
                    <div class = "work_navigation_details_analysis_item_right_lines">
                        <div class = "work_navigation_details_analysis_item_right_line"></div>
                    </div>
                </div>
            </div>
            <div class = "work_navigation_details_analysis_line"></div>
            <div class = "work_navigation_details_analysis_item">
                <div class = "work_navigation_details_analysis_item_left">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,50A25.007,25.007,0,0,1,15.269,1.965,25.007,25.007,0,0,1,34.731,48.036,24.843,24.843,0,0,1,25,50ZM25,3A22,22,0,1,0,47,25,22.025,22.025,0,0,0,25,3Z"></path><g transform="translate(0 1)"><rect width="3" height="21" rx="1.5" transform="translate(23 6)"></rect><rect width="3" height="21" rx="1.5" transform="translate(44 24) rotate(90)"></rect></g></g></svg>
                </div>
                <div class = "work_navigation_details_analysis_item_right">
                    <div class = "work_navigation_details_analysis_item_right_title">
                        ...
                    </div>
                    <div class = "work_navigation_details_analysis_item_right_value">
                        ...
                    </div>
                    <div class = "work_navigation_details_analysis_item_right_lines">
                        <div class = "work_navigation_details_analysis_item_right_line"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class = "work_navigation_details_contribute_wrap">
        <div class = "work_navigation_details_line"></div>
        <div class = "work_navigation_details_contribute">
            <div class = "work_navigation_details_contribute_title">
                ...
            </div>
            <div class = "work_navigation_details_contribute_description">
                ...
            </div>
            <div class = "work_navigation_details_contribute_items">
                <!-- item -->
            </div>
        </div>
    </div>
</div>