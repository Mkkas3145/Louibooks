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

    //분석 데이터
    $analysisInfo = getAdminAnalysisInfo();

    //간략한 정보
    $dayConnect = 0;
    $monthConnect = 0;
    $totalConnect = 0;
    $totalRequest = 0;
    $partner = 0;
    $partnerPlus = 0;
    $monetization = 0;
    $expectedRevenuePerViews = 0;

    //3초 이내 접속한 사용자
    $stmt = $pdo->prepare("SELECT COUNT(number) FROM ip_location WHERE last_request_date > :date");
    $stmt->execute(array(
        ':date' => date("Y-m-d H:i:s", strtotime("-3 Seconds"))
    ));
    $ipLocation = $stmt->fetch();
    if (isset($ipLocation["COUNT(number)"])) {
        $currentConnect = $ipLocation["COUNT(number)"];
    }
    //24시간 이내 접속한 사용자
    $stmt = $pdo->prepare("SELECT COUNT(number) FROM ip_location WHERE last_request_date > :date");
    $stmt->execute(array(
        ':date' => date("Y-m-d H:i:s", strtotime("-1 Day"))
    ));
    $ipLocation = $stmt->fetch();
    if (isset($ipLocation["COUNT(number)"])) {
        $dayConnect = $ipLocation["COUNT(number)"];
    }
    //한달 이내 접속한 사용자
    $stmt = $pdo->prepare("SELECT COUNT(number) FROM ip_location WHERE last_request_date > :date");
    $stmt->execute(array(
        ':date' => date("Y-m-d H:i:s", strtotime("-30 Day"))
    ));
    $ipLocation = $stmt->fetch();
    if (isset($ipLocation["COUNT(number)"])) {
        $monthConnect = $ipLocation["COUNT(number)"];
    }
    //전체 접속한 사용자
    $stmt = $pdo->prepare("SELECT COUNT(number) FROM ip_location");
    $stmt->execute();
    $ipLocation = $stmt->fetch();
    if (isset($ipLocation["COUNT(number)"])) {
        $totalConnect = $ipLocation["COUNT(number)"];
    }

    //전체 요청 수
    $stmt = $pdo->prepare("SELECT SUM(request) FROM ip_location");
    $stmt->execute();
    $ipLocation = $stmt->fetch();
    if (isset($ipLocation["SUM(request)"])) {
        $totalRequest = $ipLocation["SUM(request)"];
    }

    //파트너
    $stmt = $pdo->prepare("SELECT COUNT(number) FROM user WHERE partner = 1");
    $stmt->execute();
    $userStmt = $stmt->fetch();
    if (isset($userStmt["COUNT(number)"])) {
        $partner = $userStmt["COUNT(number)"];
    }
    //파트너 PLUS
    $stmt = $pdo->prepare("SELECT COUNT(number) FROM user WHERE partner = 2");
    $stmt->execute();
    $userStmt = $stmt->fetch();
    if (isset($userStmt["COUNT(number)"])) {
        $partnerPlus = $userStmt["COUNT(number)"];
    }

    //수익화된 작품 수
    $stmt = $pdo->prepare("SELECT COUNT(number) FROM works WHERE monetization = 1");
    $stmt->execute();
    $works = $stmt->fetch();
    if (isset($works["COUNT(number)"])) {
        $monetization = $works["COUNT(number)"];
    }

    //평균 예상 수익 구하기
    $stmt = $pdo->prepare("SELECT SUM(revenue_views) FROM works WHERE monetization = true AND revenue_views != 0");
    $stmt->execute();
    $works = $stmt->fetch();
    $totalRevenueViews = 0;
    if (isset($works["SUM(revenue_views)"])) {
        $totalRevenueViews = $works["SUM(revenue_views)"];
    }
    $expectedRevenueArray = getWorksRevenue($monthlyMoney); //한달 동안의 순이익 (USD)
    $expectedRevenueArray_length = count($expectedRevenueArray);
    $totalWorkExpectedRevenue = 0;
    for ($i = 0; $i < $expectedRevenueArray_length; $i++) {
        $totalWorkExpectedRevenue += $expectedRevenueArray[$i]["revenue"];
    }
    if ($totalRevenueViews != 0) {
        $expectedRevenuePerViews = $totalWorkExpectedRevenue / $totalRevenueViews;
    }


    //간략한 정보
    $briefInfo = array(
        "currentConnect" => $currentConnect,
        "dayConnect" => $dayConnect,
        "monthConnect" => $monthConnect,
        "totalConnect" => $totalConnect,
        "totalRequest" => $totalRequest,
        "partner" => $partner,
        "partnerPlus" => $partnerPlus,
        "monetization" => $monetization,
        "expectedRevenuePerViews" => $expectedRevenuePerViews
    );

?>

<div class = "brief_info" style = "display: none;">
    <?php echo json_encode($briefInfo); ?>
</div>
<div class = "analysis_info" style = "display: none;">
    <?php echo json_encode($analysisInfo); ?>
</div>

<div class = "menu_admin_dashboard">
    <div class = "menu_admin_dashboard_top">
        <div class = "menu_admin_dashboard_top_title">
            ...
        </div>
    </div>
    <div class = "menu_admin_dashboard_top_items">
        <div class = "menu_admin_dashboard_top_item">
            <div class = "menu_admin_dashboard_top_item_title">
                ...
            </div>
            <div class = "menu_admin_dashboard_top_item_value">
                ...
            </div>
        </div>
        <div class = "menu_admin_dashboard_top_item">
            <div class = "menu_admin_dashboard_top_item_title">
                ...
            </div>
            <div class = "menu_admin_dashboard_top_item_value">
                ...
            </div>
        </div>
        <div class = "menu_admin_dashboard_top_item">
            <div class = "menu_admin_dashboard_top_item_title">
                ...
            </div>
            <div class = "menu_admin_dashboard_top_item_value">
                ...
            </div>
        </div>
        <div class = "menu_admin_dashboard_top_item">
            <div class = "menu_admin_dashboard_top_item_title">
                ...
            </div>
            <div class = "menu_admin_dashboard_top_item_value">
                ...
            </div>
        </div>
        <div class = "menu_admin_dashboard_top_item">
            <div class = "menu_admin_dashboard_top_item_title">
                ...
            </div>
            <div class = "menu_admin_dashboard_top_item_value">
                ...
            </div>
        </div>
        <div class = "menu_admin_dashboard_top_item">
            <div class = "menu_admin_dashboard_top_item_title">
                ...
            </div>
            <div class = "menu_admin_dashboard_top_item_value">
                ...
            </div>
        </div>
        <div class = "menu_admin_dashboard_top_item">
            <div class = "menu_admin_dashboard_top_item_title">
                ...
            </div>
            <div class = "menu_admin_dashboard_top_item_value">
                ...
            </div>
        </div>
        <div class = "menu_admin_dashboard_top_item">
            <div class = "menu_admin_dashboard_top_item_title">
                ...
            </div>
            <div class = "menu_admin_dashboard_top_item_value">
                ...
            </div>
        </div>
        <div class = "menu_admin_dashboard_top_item">
            <div class = "menu_admin_dashboard_top_item_title">
                ...
            </div>
            <div class = "menu_admin_dashboard_top_item_value">
                ...
            </div>
        </div>
    </div>
    <div class = "menu_admin_dashboard_line"></div>
    <div class = "menu_admin_dashboard_graph">
        <div class = "menu_admin_dashboard_graph_title">
            ...
        </div>
        <div class = "menu_admin_dashboard_graph_category_items scroll">
            <div class = "menu_admin_dashboard_graph_category_item md-ripples" onclick = "menuAdminAnalysisGraphLoad(<?php echo $menuNumber; ?>, 0);">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5"></rect><rect width="3" height="50" rx="1.5" transform="translate(50 47) rotate(90)"></rect><rect width="3" height="18" rx="1.5" transform="translate(10 24)"></rect><rect width="3" height="28" rx="1.5" transform="translate(20 14)"></rect><rect width="3" height="11" rx="1.5" transform="translate(29 31)"></rect><rect width="3" height="21" rx="1.5" transform="translate(39 21)"></rect></g></svg>
                <span>...</span>
            </div>
            <div class = "menu_admin_dashboard_graph_category_item md-ripples" onclick = "menuAdminAnalysisGraphLoad(<?php echo $menuNumber; ?>, 1);">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5"></rect><rect width="3" height="50" rx="1.5" transform="translate(50 47) rotate(90)"></rect><rect width="3" height="18" rx="1.5" transform="translate(10 24)"></rect><rect width="3" height="28" rx="1.5" transform="translate(20 14)"></rect><rect width="3" height="11" rx="1.5" transform="translate(29 31)"></rect><rect width="3" height="21" rx="1.5" transform="translate(39 21)"></rect></g></svg>
                <span>...</span>
            </div>
            <div class = "menu_admin_dashboard_graph_category_item md-ripples" onclick = "menuAdminAnalysisGraphLoad(<?php echo $menuNumber; ?>, 2);">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5"></rect><rect width="3" height="50" rx="1.5" transform="translate(50 47) rotate(90)"></rect><rect width="3" height="18" rx="1.5" transform="translate(10 24)"></rect><rect width="3" height="28" rx="1.5" transform="translate(20 14)"></rect><rect width="3" height="11" rx="1.5" transform="translate(29 31)"></rect><rect width="3" height="21" rx="1.5" transform="translate(39 21)"></rect></g></svg>
                <span>...</span>
            </div>
            <div class = "menu_admin_dashboard_graph_category_item md-ripples" onclick = "menuAdminAnalysisGraphLoad(<?php echo $menuNumber; ?>, 3);">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5"></rect><rect width="3" height="50" rx="1.5" transform="translate(50 47) rotate(90)"></rect><rect width="3" height="18" rx="1.5" transform="translate(10 24)"></rect><rect width="3" height="28" rx="1.5" transform="translate(20 14)"></rect><rect width="3" height="11" rx="1.5" transform="translate(29 31)"></rect><rect width="3" height="21" rx="1.5" transform="translate(39 21)"></rect></g></svg>
                <span>...</span>
            </div>
            <div class = "menu_admin_dashboard_graph_category_item md-ripples" onclick = "menuAdminAnalysisGraphLoad(<?php echo $menuNumber; ?>, 4);">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5"></rect><rect width="3" height="50" rx="1.5" transform="translate(50 47) rotate(90)"></rect><rect width="3" height="18" rx="1.5" transform="translate(10 24)"></rect><rect width="3" height="28" rx="1.5" transform="translate(20 14)"></rect><rect width="3" height="11" rx="1.5" transform="translate(29 31)"></rect><rect width="3" height="21" rx="1.5" transform="translate(39 21)"></rect></g></svg>
                <span>...</span>
            </div>
            <div class = "menu_admin_dashboard_graph_category_item md-ripples" onclick = "menuAdminAnalysisGraphLoad(<?php echo $menuNumber; ?>, 5);">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5"></rect><rect width="3" height="50" rx="1.5" transform="translate(50 47) rotate(90)"></rect><rect width="3" height="18" rx="1.5" transform="translate(10 24)"></rect><rect width="3" height="28" rx="1.5" transform="translate(20 14)"></rect><rect width="3" height="11" rx="1.5" transform="translate(29 31)"></rect><rect width="3" height="21" rx="1.5" transform="translate(39 21)"></rect></g></svg>
                <span>...</span>
            </div>
            <div class = "menu_admin_dashboard_graph_category_item md-ripples" onclick = "menuAdminAnalysisGraphLoad(<?php echo $menuNumber; ?>, 6);">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5"></rect><rect width="3" height="50" rx="1.5" transform="translate(50 47) rotate(90)"></rect><rect width="3" height="18" rx="1.5" transform="translate(10 24)"></rect><rect width="3" height="28" rx="1.5" transform="translate(20 14)"></rect><rect width="3" height="11" rx="1.5" transform="translate(29 31)"></rect><rect width="3" height="21" rx="1.5" transform="translate(39 21)"></rect></g></svg>
                <span>...</span>
            </div>
        </div>
        <div class = "menu_admin_dashboard_graph_in">
            <div class = "graph" data-type = "">
                <div class = "graph-top">
                    <canvas class = "graph-canvas" width = "1" height = "1"></canvas>
                    <div class = "graph-info"></div>
                </div>
                <div class = "graph-bottom"></div>
                <div class = "graph-value-view">
                    <div class = "graph-value-view-top">
                        <span class = "graph-description">...</span>
                        <span class = "graph-additional">...</span>
                    </div>
                    <span class = "graph-value">0</span>
                </div>
                <div class = "graph-value-differential-view">
                    <span class = "graph-differential-increase">...</span>
                    <span class = "graph-differential-description">...</span>
                </div>
            </div>
        </div>
    </div>
</div>