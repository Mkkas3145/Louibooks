<?php

    $menuNumber = $_POST["menuNumber"];

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    //모든 작품의 조회수
    $stmt = $pdo->prepare("SELECT number, views, monetization FROM works where user_number = :user_number");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"],
    ));
    $result = $stmt->fetchAll();
    $result_length = count($result);

    $workNumbers = array();
    $countWorks = 0;
    $countMonetizationWorks = 0;
    $totalViews = 0;
    for ($i = 0; $i < $result_length; $i++) {
        $workNumbers[] = $result[$i]["number"];
        $totalViews += $result[$i]["views"];
        $countWorks ++;
        if ($result[$i]["monetization"] == true) {
            $countMonetizationWorks ++;
        }
    }

    //최근에 만든 작품 10개 정보 불러오기
    $stmt = $pdo->prepare("SELECT number FROM works where user_number = :user_number ORDER BY number DESC LIMIT 10");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"],
    ));
    $myWorks = $stmt->fetchAll();
    $myWorks_length = count($myWorks);
    $numbers = array();
    for ($i = 0; $i < $myWorks_length; $i++) {
        $numbers[] = $myWorks[$i]["number"];
    }

    //크리에이터 가이드 위반 횟수 구하기
    //1년 이상된 데이터 삭제
    $stmt = $pdo->prepare("DELETE FROM creator_violation WHERE date < :date");
    $stmt->execute(array(
        ':date' => date("Y-m-d H:i:s", strtotime("-365 Day"))
    ));
    //경고 횟수 구하기
    $stmt = $pdo->prepare("SELECT COUNT(user_number) FROM creator_violation WHERE user_number = :user_number");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"]
    ));
    $creatorViolation = $stmt->fetch()["COUNT(user_number)"];
    //크리에이터 자격 여부
    if ($userInfo["creator_permission"] == false) {
        $creatorViolation = 3;
    }

    //일주일 크리에이터 가이드 위반 여부
    $stmt = $pdo->prepare("SELECT user_number FROM creator_violation WHERE user_number = :user_number AND date > :date");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"],
        ':date' => date("Y-m-d H:i:s", strtotime("-7 Day"))
    ));
    $creatorViolation7Day = $stmt->fetch();

    //작품 생성 권한 여부
    $createPermission = true;
    if ($creatorViolation == 3 || isset($creatorViolation7Day["user_number"])) {
        $createPermission = false;
    }

    //작품 분석 데이터
    $analysisInfo = getWorksAnalysisVariousInfo(implode(",", $workNumbers));

    $info = array(
        "countWorks" => $countWorks,
        "countMonetizationWorks" => $countMonetizationWorks,
        "totalViews" => $totalViews,
        "workInfo" => getWorkInfo(implode(",", $numbers)),
        "creatorViolation" => (int) $creatorViolation,
        "createPermission" => $createPermission,
        "analysisInfo" => $analysisInfo
    );

?>

<div class = "info" style = "display: none;">
    <?php echo json_encode($info); ?>
</div>

<div class = "my_workspace_dashboard">
    <div class = "my_workspace_dashboard_top">
        <div class = "my_workspace_dashboard_top_left">
            ...
        </div>
        <div class = "my_workspace_dashboard_top_right">
            <div class = "my_workspace_dashboard_top_right_create_work md-ripples" onclick = "openPopupContents('create_work');">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M139.895-296a1.5,1.5,0,0,1,.843.259l18.395,12.5a1.5,1.5,0,0,1,.657,1.208,1.5,1.5,0,0,1-.6,1.235l-18.395,13.723a1.5,1.5,0,0,1-1.794,0L120.6-280.8a1.5,1.5,0,0,1-.6-1.235,1.5,1.5,0,0,1,.657-1.208l18.395-12.5A1.5,1.5,0,0,1,139.895-296Zm15.81,14.056-15.81-10.743-15.81,10.743,15.81,11.795Z" transform="translate(-120 296)"/><path d="M139.895-249.788a1.5,1.5,0,0,1-.894-.3l-18.395-13.646a1.5,1.5,0,0,1-.311-2.1,1.5,1.5,0,0,1,2.1-.311l17.5,12.983,17.5-12.983a1.5,1.5,0,0,1,2.1.311,1.5,1.5,0,0,1-.311,2.1l-18.395,13.646A1.5,1.5,0,0,1,139.895-249.788Z" transform="translate(-120 289.577)"/><g transform="translate(0.5 0.902)"><path d="M498.013,19.126q-.87,0-1.559,0c-2.618-.011-2.7-.039-2.977-.133a1.5,1.5,0,0,1,.729-2.9c.989.069,9.521.025,14.743-.02a1.5,1.5,0,0,1,.026,3c-.037,0-3.7.031-7.369.047C500.233,19.123,499.031,19.126,498.013,19.126Z" transform="translate(-460.962 22.528)"/><path d="M498.013,19.126q-.87,0-1.559,0c-2.618-.011-2.7-.039-2.977-.133a1.5,1.5,0,0,1,.729-2.9c.989.069,9.521.025,14.743-.02a1.5,1.5,0,0,1,.026,3c-.037,0-3.7.031-7.369.047C500.233,19.123,499.031,19.126,498.013,19.126Z" transform="translate(58.126 -461.364) rotate(90)"/></g></g></svg>
                <span>...</span>
            </div>
        </div>
    </div>
    <div class = "my_workspace_dashboard_flex">
        <div class = "my_workspace_dashboard_left">
            <div class = "my_workspace_dashboard_left_info_items">
                <div class = "my_workspace_dashboard_left_info_item">
                    <div class = "my_workspace_dashboard_left_info_item_title">
                        ...
                    </div>
                    <div class = "my_workspace_dashboard_left_info_item_value">
                        ...
                    </div>
                </div>
                <div class = "my_workspace_dashboard_left_info_item">
                    <div class = "my_workspace_dashboard_left_info_item_title">
                        ...
                    </div>
                    <div class = "my_workspace_dashboard_left_info_item_value">
                        ...
                    </div>
                </div>
                <div class = "my_workspace_dashboard_left_info_item">
                    <div class = "my_workspace_dashboard_left_info_item_title">
                        ...
                    </div>
                    <div class = "my_workspace_dashboard_left_info_item_value">
                        ...
                    </div>
                </div>
                <div class = "my_workspace_dashboard_left_info_item">
                    <div class = "my_workspace_dashboard_left_info_item_title">
                        ...
                    </div>
                    <div class = "my_workspace_dashboard_left_info_item_value">
                        ...
                    </div>
                </div>
                <div class = "my_workspace_dashboard_left_info_item">
                    <div class = "my_workspace_dashboard_left_info_item_title">
                        ...
                    </div>
                    <div class = "my_workspace_dashboard_left_info_item_value">
                        ...
                    </div>
                </div>
                <div class = "my_workspace_dashboard_left_info_item">
                    <div class = "my_workspace_dashboard_left_info_item_title">
                        ...
                    </div>
                    <div class = "my_workspace_dashboard_left_info_item_value">
                        $0.00 USD
                    </div>
                </div>
            </div>
            <div class = "my_workspace_dashboard_left_box">
                <div class = "my_workspace_dashboard_left_box_top">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="50" height="3" rx="1.5" transform="translate(0 7)"></rect><rect width="16" height="3" rx="1.5" transform="translate(0 41)"></rect><rect width="33" height="3" rx="1.5" transform="translate(0 24)"></rect></g></svg>
                    <span>...</span>
                </div>
                <div class = "my_workspace_dashboard_left_box_contents">
                    <div class = "my_workspace_dashboard_left_box_bottom">
                        <div class = "my_workspace_dashboard_left_box_bottom_items">
                            <!-- item -->
                        </div>
                        <div class = "my_workspace_dashboard_left_box_bottom_more_view md-ripples" onclick = "loadWorkspace_my_works();">
                            <span>...</span>
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.25 10l-7.141-7.42c-0.268-0.27-0.268-0.707 0-0.979 0.268-0.27 0.701-0.27 0.969 0l7.83 7.908c0.268 0.271 0.268 0.709 0 0.979l-7.83 7.908c-0.268 0.271-0.701 0.27-0.969 0s-0.268-0.707 0-0.979l7.141-7.417z"></path></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class = "my_workspace_dashboard_right">
            <div class = "my_workspace_dashboard_right_guide_violation">
                <div class = "my_workspace_dashboard_right_guide_violation_top">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 2.899l13.409 26.726h-26.819l13.409-26.726zM16 0c-0.69 0-1.379 0.465-1.903 1.395l-13.659 27.222c-1.046 1.86-0.156 3.383 1.978 3.383h27.166c2.134 0 3.025-1.522 1.978-3.383h0l-13.659-27.222c-0.523-0.93-1.213-1.395-1.903-1.395v0z"></path><path d="M18 26c0 1.105-0.895 2-2 2s-2-0.895-2-2c0-1.105 0.895-2 2-2s2 0.895 2 2z"></path><path d="M16 22c-1.105 0-2-0.895-2-2v-6c0-1.105 0.895-2 2-2s2 0.895 2 2v6c0 1.105-0.895 2-2 2z"></path></svg>
                    <span>...</span>
                </div>
                <div class = "my_workspace_dashboard_right_guide_violation_contents">
                    <div class = "my_workspace_dashboard_right_guide_violation_contents_title">
                        ...
                    </div>
                    <div class = "my_workspace_dashboard_right_guide_violation_contents_lines">
                        <div class = "my_workspace_dashboard_right_guide_violation_contents_line"></div>
                        <div class = "my_workspace_dashboard_right_guide_violation_contents_line"></div>
                        <div class = "my_workspace_dashboard_right_guide_violation_contents_line"></div>
                    </div>
                    <div class = "my_workspace_dashboard_right_guide_violation_contents_bottom_title">
                        ...
                    </div>
                    <div class = "my_workspace_dashboard_right_guide_violation_contents_bottom_description">
                        ...
                    </div>
                    <div class = "my_workspace_dashboard_right_guide_violation_contents_bottom_link md-ripples" onclick = "loadMenu_creator_guide();">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.070c-1.884-1.821-3.053-4.37-3.053-7.193 0-5.523 4.477-10 10-10 2.823 0 5.372 1.169 7.19 3.050l0.003 0.003c1.737 1.796 2.807 4.247 2.807 6.947 0 5.523-4.477 10-10 10-2.7 0-5.151-1.070-6.95-2.81l0.003 0.003zM9 5v6h2v-6h-2zM9 13v2h2v-2h-2z"></path></svg>
                        <span>...</span>
                    </div>
                </div>
            </div>
            <div class = "my_workspace_dashboard_right_news">
                <div class = "my_workspace_dashboard_right_news_top">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M15.9,33.647h0L1,28.011,2.511,22.04,0,21.2V7.589L31.526,0V30.578l-13.5-4.018L15.9,33.645ZM5.413,22.933h0l-.866,3.278,9.417,3.576,1.173-3.927L5.413,22.933Zm23.126-19.1L3,9.8v9.228l25.538,7.555Z" transform="translate(16.572 10.713)"/><path d="M0,28.122V0L12.722,7.031V20.98L0,28.121ZM3.013,5.189V23.044l6.7-3.683V8.928Z" transform="translate(1.395 10.937)"/><path d="M25.852,24.961,41.866,21l-.759-2.972-15.98,3.962Z" transform="translate(0 0.006)"/></g></svg>
                    <span>...</span>
                </div>
                <div class = "my_workspace_dashboard_right_news_contents">
                    <div class = "my_workspace_dashboard_right_news_contents_image img_wrap">
                        <img src = "https://louibooks.com/IMG/discord.jpg" width = "1" height = "1" onload = "imageLoad(event);" alt = "">
                    </div>
                    <div class = "my_workspace_dashboard_right_news_contents_title">
                        ...
                    </div>
                    <div class = "my_workspace_dashboard_right_news_contents_description">
                        ...
                    </div>
                    <div class = "my_workspace_dashboard_right_news_contents_link md-ripples" onclick = "window.open('https://discord.gg/HnZsQWrs65');" onmouseenter = "hoverHelp(this, 'https://discord.gg/HnZsQWrs65');">
                        <!-- Generated by IcoMoon.io -->
                        <svg style="transform: scale(1.2);" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 9.984l3.984 4.031h-3v6h-1.969v-6h-3zM18.984 3.984q0.844 0 1.43 0.586t0.586 1.43v12q0 0.797-0.609 1.406t-1.406 0.609h-3.984v-2.016h3.984v-9.984h-13.969v9.984h3.984v2.016h-3.984q-0.844 0-1.43-0.586t-0.586-1.43v-12q0-0.844 0.586-1.43t1.43-0.586h13.969z"></path></svg>
                        <span>...</span>
                    </div>
                </div>
            </div>
            <div class = "my_workspace_dashboard_right_analysis">
                <div class = "my_workspace_dashboard_right_analysis_top">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5"></rect><rect width="3" height="50" rx="1.5" transform="translate(50 47) rotate(90)"></rect><rect width="3" height="18" rx="1.5" transform="translate(10 24)"></rect><rect width="3" height="28" rx="1.5" transform="translate(20 14)"></rect><rect width="3" height="11" rx="1.5" transform="translate(29 31)"></rect><rect width="3" height="21" rx="1.5" transform="translate(39 21)"></rect></g></svg>
                    <span>...</span>
                </div>
                <div class = "my_workspace_dashboard_right_analysis_contents">
                    <div class = "my_workspace_dashboard_right_analysis_contents_graph_wrap">
                        <div class = "my_workspace_dashboard_right_analysis_contents_graph_title">
                            ...
                        </div>
                        <div class = "my_workspace_dashboard_right_analysis_contents_graph">
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
                    <div class = "my_workspace_dashboard_right_analysis_contents_line"></div>
                    <div class = "my_workspace_dashboard_right_analysis_contents_graph_wrap">
                        <div class = "my_workspace_dashboard_right_analysis_contents_graph_title">
                            ...
                        </div>
                        <div class = "my_workspace_dashboard_right_analysis_contents_graph">
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
                <div class = "my_workspace_dashboard_right_analysis_processing" style = "display: none;">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 5.002c0 0 0.003-0.095 0.213-0.288 0.245-0.225 0.671-0.483 1.306-0.73 1.499-0.585 3.821-0.984 6.481-0.984s4.982 0.399 6.482 0.984c0.634 0.247 1.061 0.505 1.306 0.73 0.205 0.189 0.212 0.281 0.212 0.288 0 0.003-0.007 0.095-0.213 0.284-0.245 0.225-0.671 0.483-1.306 0.73-1.499 0.585-3.821 0.984-6.481 0.984s-4.982-0.399-6.482-0.984c-0.634-0.247-1.061-0.505-1.306-0.73-0.208-0.192-0.212-0.284-0.212-0.284zM20 14.532v4.471c-0.041 0.097-0.096 0.181-0.217 0.291-0.245 0.225-0.671 0.482-1.303 0.728-1.495 0.582-3.809 0.978-6.48 0.978s-4.985-0.396-6.48-0.978c-0.633-0.246-1.058-0.503-1.303-0.728-0.12-0.11-0.176-0.194-0.199-0.242l-0.006-4.514c0.248 0.126 0.51 0.242 0.782 0.348 1.797 0.699 4.377 1.114 7.206 1.114s5.409-0.415 7.206-1.114c0.277-0.108 0.543-0.225 0.794-0.354zM20 7.527v4.463c0 0.004 0 0.008 0 0.013-0.041 0.097-0.096 0.181-0.217 0.291-0.245 0.225-0.671 0.482-1.303 0.728-1.495 0.582-3.809 0.978-6.48 0.978s-4.985-0.396-6.48-0.978c-0.633-0.246-1.058-0.503-1.303-0.728-0.12-0.11-0.176-0.194-0.199-0.242-0.001-0.040-0.004-0.079-0.009-0.117l-0.005-4.407c0.248 0.128 0.513 0.244 0.788 0.352 1.801 0.702 4.388 1.12 7.208 1.12s5.407-0.418 7.208-1.12c0.276-0.108 0.542-0.225 0.792-0.353zM2 5v14c0 0.058 0.002 0.116 0.007 0.174 0.057 0.665 0.425 1.197 0.857 1.594 0.498 0.457 1.175 0.824 1.93 1.118 1.797 0.699 4.377 1.114 7.206 1.114s5.409-0.415 7.206-1.114c0.755-0.294 1.432-0.661 1.93-1.118 0.432-0.397 0.8-0.929 0.857-1.594 0.005-0.058 0.007-0.116 0.007-0.174v-14c0-0.056-0.002-0.112-0.007-0.168-0.055-0.664-0.422-1.195-0.852-1.59-0.498-0.459-1.177-0.827-1.933-1.122-1.801-0.702-4.388-1.12-7.208-1.12s-5.407 0.418-7.208 1.12c-0.756 0.295-1.435 0.664-1.933 1.122-0.43 0.395-0.797 0.927-0.852 1.59-0.005 0.056-0.007 0.112-0.007 0.168z"></path></svg>
                    <div class = "my_workspace_dashboard_right_analysis_processing_title">
                        ...
                    </div>
                    <div class = "my_workspace_dashboard_right_analysis_processing_description">
                        ...
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>