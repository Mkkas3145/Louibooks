

function workspaceDashboardLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let info = JSON.parse(contents.getElementsByClassName("info")[0].innerHTML);
    let analysisInfo = info["analysisInfo"];


    //
    let info_item_title = contents.getElementsByClassName("my_workspace_dashboard_left_info_item_title");
    info_item_title[0].innerHTML = getLanguage("workspace_dashboard_box_analysis_top:my_work_count");
    info_item_title[1].innerHTML = getLanguage("workspace_dashboard_box_analysis_top:total_views");
    info_item_title[2].innerHTML = getLanguage("workspace_dashboard_box_analysis_top:average_rating");
    info_item_title[3].innerHTML = getLanguage("workspace_dashboard_box_analysis_top:average_continuous_viewed_percent");
    info_item_title[4].innerHTML = getLanguage("workspace_dashboard_box_analysis_top:monetization_works_count");
    info_item_title[5].innerHTML = getLanguage("workspace_dashboard_box_analysis_top:expected_revenue");

    let clickThroughRate = 0;
    if (analysisInfo["clickThroughRate"] != null) {
        clickThroughRate = analysisInfo["clickThroughRate"];
    }

    let info_item_value = contents.getElementsByClassName("my_workspace_dashboard_left_info_item_value");
    info_item_value[0].innerHTML = commas(info["countWorks"]);
    info_item_value[1].innerHTML = commas(info["totalViews"]);
    info_item_value[2].innerHTML = ("★ " + analysisInfo["averageScore"].toFixed(1));
    info_item_value[3].innerHTML = (Math.round(clickThroughRate * 100) + "%");
    info_item_value[4].innerHTML = commas(info["countMonetizationWorks"]);
    info_item_value[5].innerHTML = ("$" + analysisInfo["totalExpectedRevenue"].toFixed(2) + " USD");

    //데이터 처리 중
    let analysis_contents = contents.getElementsByClassName("my_workspace_dashboard_right_analysis_contents")[0];
    let analysis_processing = contents.getElementsByClassName("my_workspace_dashboard_right_analysis_processing")[0];
    let analysis_processing_title = contents.getElementsByClassName("my_workspace_dashboard_right_analysis_processing_title")[0];
    analysis_processing_title.innerHTML = getLanguage("workspace_dashboard_analysis_processing_title");
    let analysis_processing_description = contents.getElementsByClassName("my_workspace_dashboard_right_analysis_processing_description")[0];
    analysis_processing_description.innerHTML = getLanguage("workspace_dashboard_analysis_processing_description");

    let graph_title = contents.getElementsByClassName("my_workspace_dashboard_right_analysis_contents_graph_title");
    graph_title[0].innerHTML = getLanguage("workspace_work_analysis_summary_category:0");
    graph_title[1].innerHTML = getLanguage("workspace_work_analysis_summary_category:6");

    if (analysisInfo["byDate"].length < 2) {
        analysis_processing.style.display = null;
        analysis_contents.style.display = "none";
        analysis_contents.textContent = "";
    } else {
        let graphUniqueNumbers = new Array();

        //그래프 고유 번호 설정
        let graph = contents.getElementsByClassName("graph");
        for (let i = 0; i < graph.length; i++) {
            let uniqueNumber = Math.floor(Math.random() * 999999999999);
            graph[i].setAttribute("data-type", uniqueNumber);

            graphUniqueNumbers[graphUniqueNumbers.length] = uniqueNumber;
        }

        workspaceDashboardGraphLoad(menuNumber, graphUniqueNumbers[0], "totalViews");
        workspaceDashboardGraphLoad(menuNumber, graphUniqueNumbers[1], "expectedRevenue");
        setStateGraph();
    }









    //언어
    let top_left = contents.getElementsByClassName("my_workspace_dashboard_top_left")[0];
    top_left.innerHTML = getLanguage("workspace_dashboard_top_title");
    let right_create_work = contents.getElementsByClassName("my_workspace_dashboard_top_right_create_work")[0].getElementsByTagName("span")[0];
    right_create_work.innerHTML = getLanguage("workspace_dashboard_top_create_work");

    let left_box_top = contents.getElementsByClassName("my_workspace_dashboard_left_box_top")[0].getElementsByTagName("span")[0];
    left_box_top.innerHTML = getLanguage("workspace_dashboard_box_analysis_items_title");
    let right_news_top = contents.getElementsByClassName("my_workspace_dashboard_right_news_top")[0].getElementsByTagName("span")[0];
    right_news_top.innerHTML = getLanguage("workspace_dashboard_box_title:news");
    let right_analysis_top = contents.getElementsByClassName("my_workspace_dashboard_right_analysis_top")[0].getElementsByTagName("span")[0];
    right_analysis_top.innerHTML = getLanguage("workspace_dashboard_box_title:analysis");

    //소식
    let news_contents_title = contents.getElementsByClassName("my_workspace_dashboard_right_news_contents_title")[0];
    news_contents_title.innerHTML = getLanguage("workspace_dashboard_box_news_contents:title");
    let news_contents_description = contents.getElementsByClassName("my_workspace_dashboard_right_news_contents_description")[0];
    news_contents_description.innerHTML = getLanguage("workspace_dashboard_box_news_contents:description");
    let news_contents_link = contents.getElementsByClassName("my_workspace_dashboard_right_news_contents_link")[0].getElementsByTagName("span")[0];
    news_contents_link.innerHTML = getLanguage("workspace_dashboard_box_news_contents:link");


    let bottom_more_view = contents.getElementsByClassName("my_workspace_dashboard_left_box_bottom_more_view")[0].getElementsByTagName("span")[0];
    bottom_more_view.innerHTML = getLanguage("workspace_dashboard_box_analysis_move_menu_my_works");



    //작품 분석 요약
    if (info["workInfo"] != null) {
        for (let i = 0; i < info["workInfo"].length; i++) {
            workspaceDashboardAddWorkItem(menuNumber, info["workInfo"][i]);
        }
    } else {
        let items = contents.getElementsByClassName("my_workspace_dashboard_left_box_bottom_items")[0];
        items.innerHTML = `
            <div class = "my_workspace_dashboard_left_box_bottom_no_data">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-3094.635,49.5H-3116.5a3,3,0,0,1-3-3V3.5a3,3,0,0,1,3-3h31a3,3,0,0,1,3,3V37.365L-3094.635,49.5Z" transform="translate(3126)" opacity="0.7"/><path d="M3151.333,49.5l12.293-12.293h-9.846a2.517,2.517,0,0,0-1.983.575,2.884,2.884,0,0,0-.464,2.039Z" transform="translate(-3120)" opacity="0.6"/></g></svg>
                <div class = "my_workspace_dashboard_left_box_bottom_no_data_title">
                    ` + getLanguage("workspace_dashboard_box_analysis_works_no_data") + `
                </div>
                <div class = "my_workspace_dashboard_left_box_bottom_no_data_description">
                    ` + getLanguage("no_data_description") + `
                </div>
            </div>
        `;
    }


    //크리에이터 가이드 위반
    let guide_violation_top = contents.getElementsByClassName("my_workspace_dashboard_right_guide_violation_top")[0].getElementsByTagName("span")[0];
    guide_violation_top.innerHTML = getLanguage("workspace_dashboard_box_title:guide_violation");
    let guide_violation_contents_title = contents.getElementsByClassName("my_workspace_dashboard_right_guide_violation_contents_title")[0];
    guide_violation_contents_title.innerHTML = getLanguage("workspace_dashboard_box_guide_violation_contents:title");
    let guide_violation_contents_line = contents.getElementsByClassName("my_workspace_dashboard_right_guide_violation_contents_line");
    let guide_violation_contents_count = contents.getElementsByClassName("my_workspace_dashboard_right_guide_violation_contents_bottom_title")[0];
    let guide_violation_contents_description = contents.getElementsByClassName("my_workspace_dashboard_right_guide_violation_contents_bottom_description")[0];
    guide_violation_contents_count.innerHTML = getLanguage("workspace_dashboard_box_guide_violation_contents:count:0");
    guide_violation_contents_description.innerHTML = getLanguage("workspace_dashboard_box_guide_violation_contents:description:0") + getLanguage("workspace_dashboard_box_guide_violation_contents:description:2");
    let create_work_button = contents.getElementsByClassName("my_workspace_dashboard_top_right_create_work")[0];

    if (info["createPermission"] == false) {
        create_work_button.classList.add("my_workspace_dashboard_top_right_create_work_disabled");
    }

    if (info["creatorViolation"] == 1) {
        guide_violation_contents_line[0].style.animation = "workSpaceDashboardGuideViolationLine 3s infinite";
    }
    if (info["creatorViolation"] == 2) {
        guide_violation_contents_line[0].style.animation = "workSpaceDashboardGuideViolationLine 3s infinite";
        guide_violation_contents_line[1].style.animation = "workSpaceDashboardGuideViolationLine 3s infinite";
    }
    if (info["creatorViolation"] == 3) {
        guide_violation_contents_line[0].style.animation = "workSpaceDashboardGuideViolationLine 3s infinite";
        guide_violation_contents_line[1].style.animation = "workSpaceDashboardGuideViolationLine 3s infinite";
        guide_violation_contents_line[2].style.animation = "workSpaceDashboardGuideViolationLine 3s infinite";
    }
    if (info["creatorViolation"] != 0) {
        if (info["creatorViolation"] == 3) {
            guide_violation_contents_count.innerHTML = getLanguage("workspace_dashboard_box_guide_violation_contents:count:2");
            guide_violation_contents_description.innerHTML = getLanguage("workspace_dashboard_box_guide_violation_contents:description:3");
        } else {
            guide_violation_contents_count.innerHTML = getLanguage("workspace_dashboard_box_guide_violation_contents:count:1").replaceAll("{R:0}", info["creatorViolation"]);
            guide_violation_contents_description.innerHTML = getLanguage("workspace_dashboard_box_guide_violation_contents:description:1") + getLanguage("workspace_dashboard_box_guide_violation_contents:description:2");
        }
    }
    let guide_violation_contents_bottom_link = contents.getElementsByClassName("my_workspace_dashboard_right_guide_violation_contents_bottom_link")[0].getElementsByTagName("span")[0];
    guide_violation_contents_bottom_link.innerHTML = getLanguage("workspace_dashboard_box_guide_violation_button");
}




function workspaceDashboardAddWorkItem(menuNumber, info) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("my_workspace_dashboard_left_box_bottom_items")[0];

    let newEl = document.createElement("div");
    newEl.classList.add("my_workspace_dashboard_left_box_bottom_item");
    newEl.innerHTML = `
        <div class = "my_workspace_dashboard_left_box_bottom_item_left img_wrap">
            <img src = "` + info["cover_image"] + `" onload = "imageLoad(event);" alt = "">
        </div>
        <div class = "my_workspace_dashboard_left_box_bottom_item_right">
            <div class = "my_workspace_dashboard_left_box_bottom_item_right_top">
                <div class = "my_workspace_dashboard_left_box_bottom_item_right_title">
                    ` + info["title"] + `
                </div>
                <div class = "my_workspace_dashboard_left_box_bottom_item_right_info">
                    <div class = "my_workspace_dashboard_left_box_bottom_item_right_info_item">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-161.3,48.508a.992.992,0,0,1-.583-.194l-12.534-9.07a1,1,0,0,0-.586-.19,1,1,0,0,0-.586.19l-12.534,9.07a.99.99,0,0,1-.583.194,1.021,1.021,0,0,1-.808-.407.971.971,0,0,1-.158-.869l4.378-15.5a1,1,0,0,0-.335-1.05L-197.884,20.8a.978.978,0,0,1-.32-1.1.979.979,0,0,1,.921-.68l15.335-.412a1,1,0,0,0,.921-.681l5.08-15.112A.987.987,0,0,1-175,2.139a.987.987,0,0,1,.948.681l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a.979.979,0,0,1,.921.68.978.978,0,0,1-.32,1.1l-12.256,9.877a1,1,0,0,0-.336,1.05l4.378,15.5a.972.972,0,0,1-.158.869A1.021,1.021,0,0,1-161.3,48.508Zm-13.655-12.455a3.809,3.809,0,0,1,2.185.7c2.2,1.509,7.989,5.785,8.047,5.828l-2.968-10.516a4,4,0,0,1,1.281-3.609c1.666-1.266,8.107-6.541,8.172-6.594l-10.031-.219h-.027a3.779,3.779,0,0,1-3.488-2.781c-.969-2.829-3.213-9.345-3.235-9.407l-3.235,9.734c-.011.024-1.121,2.438-3.5,2.453-2.4.015-9.925.233-10,.235l8.407,6.844a3.748,3.748,0,0,1,.968,3.687l-2.844,10.11,8.063-5.828A4.312,4.312,0,0,1-174.951,36.053Z" transform="translate(200)"></path></g></svg>
                        ` + info["ratings"]["averageScore"].toFixed(1) + `
                    </div>
                    <div class = "my_workspace_dashboard_left_box_bottom_item_right_info_item">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,37a21.437,21.437,0,0,1-9.731-2.508,34.262,34.262,0,0,1-7.947-5.721A39.4,39.4,0,0,1,1.965,22.54,10.312,10.312,0,0,1,0,18.5a10.313,10.313,0,0,1,1.965-4.04A39.4,39.4,0,0,1,7.323,8.229a34.261,34.261,0,0,1,7.947-5.721A21.437,21.437,0,0,1,25,0a21.236,21.236,0,0,1,9.728,2.538A34.517,34.517,0,0,1,42.67,8.311a40.627,40.627,0,0,1,5.357,6.242A10.518,10.518,0,0,1,50,18.5c.01,1.175-2.446,5.3-6.467,9.358a35.762,35.762,0,0,1-8.228,6.3A21.562,21.562,0,0,1,25,37ZM25,2.964C13.381,2.964,3.264,16.237,3.264,18.5S13.381,34.036,25,34.036c7.276,0,13.532-5.214,16.613-8.322,3.016-3.042,5.109-6.244,5.1-7.214-.009-1.079-2.552-4.948-6.516-8.557C36.7,6.759,31.227,2.964,25,2.964Z" transform="translate(0 7)"></path><path d="M9.5,19A9.5,9.5,0,0,1,2.783,2.783,9.5,9.5,0,0,1,16.217,16.217,9.437,9.437,0,0,1,9.5,19Zm0-16.026A6.526,6.526,0,1,0,16.026,9.5,6.534,6.534,0,0,0,9.5,2.974Z" transform="translate(16 16)"></path></g></svg>
                        ` + getViewsNumberUnit(info["views"]) + `
                    </div>
                    <div class = "my_workspace_dashboard_left_box_bottom_item_right_info_item">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M27,30H3a3,3,0,0,1-3-3V3A3,3,0,0,1,3,0H27a3,3,0,0,1,3,3V27A3,3,0,0,1,27,30ZM2.647,2.647V27.353H27.353V2.647Z" transform="translate(0 20)"></path><rect width="32" height="3" rx="1.5" transform="translate(8 10)"></rect><rect width="31" height="3" rx="1.5" transform="translate(40 10) rotate(90)"></rect><rect width="32" height="3" rx="1.5" transform="translate(18)"></rect><rect width="32" height="3" rx="1.5" transform="translate(50) rotate(90)"></rect></g></svg>
                        ` + getLanguage("work_round").replaceAll("{R:0}", commas(info["part"])) + `
                    </div>
                </div>
            </div>
            <div class = "my_workspace_dashboard_left_box_bottom_item_right_bottom">
                <div class = "my_workspace_dashboard_left_box_bottom_item_right_move_menu md-ripples" onclick = "loadMenu_work(` + info["number"] + `);">
                    <span>
                        ` + getLanguage("more_button_workspace_details:go_to_work_page") + `
                    </span>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.25 10l-7.141-7.42c-0.268-0.27-0.268-0.707 0-0.979 0.268-0.27 0.701-0.27 0.969 0l7.83 7.908c0.268 0.271 0.268 0.709 0 0.979l-7.83 7.908c-0.268 0.271-0.701 0.27-0.969 0s-0.268-0.707 0-0.979l7.141-7.417z"></path></svg>
                </div>
                <div class = "my_workspace_dashboard_left_box_bottom_item_right_move_menu md-ripples" onclick = "loadWorkspace_work_analysis(` + info["number"] + `);">
                    <span>
                        ` + getLanguage("workspace_dashboard_box_analysis_item_move_menu") + `
                    </span>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.25 10l-7.141-7.42c-0.268-0.27-0.268-0.707 0-0.979 0.268-0.27 0.701-0.27 0.969 0l7.83 7.908c0.268 0.271 0.268 0.709 0 0.979l-7.83 7.908c-0.268 0.271-0.701 0.27-0.969 0s-0.268-0.707 0-0.979l7.141-7.417z"></path></svg>
                </div>
            </div>
        </div>
    `;

    items.appendChild(newEl);
}





function workspaceDashboardGraphLoad(menuNumber, uniqueNumber, type) {
    let contents = document.getElementById("contents_" + menuNumber);
    if (contents.getElementsByClassName("my_workspace_dashboard_right_analysis_contents")[0].getElementsByClassName("graph").length != 0) {
        let analysisInfo = JSON.parse(contents.getElementsByClassName("info")[0].innerHTML)["analysisInfo"];
        let byDate = analysisInfo["byDate"];

        //그래프 데이터
        let startDate = null;
        let graphData = new Array();
        for (let i = 0; i < byDate.length; i++) {
            let value = 0;
            let displayValue = 0;
    
            //예상 수익
            if (type == "totalViews") {
                let totalViews = Number.parseInt(byDate[i]["totalViews"]);
                value = totalViews;
                displayValue = commas(totalViews);
            }
            //전체 조회수
            if (type == "expectedRevenue") {
                let expectedRevenue = Number.parseFloat(byDate[i]["expectedRevenue"]);
                value = Math.round(expectedRevenue);
                displayValue = ("$" + expectedRevenue.toFixed(2) + " USD");
            }
    
            //
            if (startDate == null) {
                startDate = new Date(byDate[i]["date"]);
            }
    
            graphData.push(new GraphDataFormat(value, new Date(byDate[i]["date"]), displayValue));
        }
    
        if (graphData.length != 0) {
            GraphDataList.set(uniqueNumber.toString(), graphData);
            GraphStartTimeList.set(uniqueNumber.toString(), startDate);
        }
    }
}