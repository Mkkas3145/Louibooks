



function menuAdminDashboardLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let graph = contents.getElementsByClassName("graph");
    for (let i = 0; i < graph.length; i++) {
        let uniqueNumber = Math.floor(Math.random() * 999999999999);
        graph[i].setAttribute("data-type", uniqueNumber);
    }

    //간략한 정보
    let briefInfo = JSON.parse(contents.getElementsByClassName("brief_info")[0].innerHTML);
    let value = contents.getElementsByClassName("menu_admin_dashboard_top_item_value");
    value[0].innerHTML = commas(briefInfo["currentConnect"]);
    value[1].innerHTML = commas(briefInfo["dayConnect"]);
    value[2].innerHTML = commas(briefInfo["monthConnect"]);
    value[3].innerHTML = commas(briefInfo["totalConnect"]);
    value[4].innerHTML = commas(briefInfo["totalRequest"]);
    value[5].innerHTML = getLanguage("menu_admin_dashboard_top_value:number_user").replaceAll("{R:0}", commas(briefInfo["partner"]));
    value[6].innerHTML = getLanguage("menu_admin_dashboard_top_value:number_user").replaceAll("{R:0}", commas(briefInfo["partnerPlus"]));
    value[7].innerHTML = commas(briefInfo["monetization"]);

    let expectedRevenuePerViews = Number.parseFloat(briefInfo["expectedRevenuePerViews"]);
    let fixed = null;
    if (expectedRevenuePerViews != 0 && expectedRevenuePerViews < 0.01) {
        fixed = expectedRevenuePerViews.toFixed(3);
    } else {
        fixed = expectedRevenuePerViews.toFixed(2);
    }
    value[8].innerHTML = "$" + fixed + " USD";
    
    //
    let title = contents.getElementsByClassName("menu_admin_dashboard_top_title")[0];
    title.innerHTML = getLanguage("menu_admin_dashboard_title");

    //정보 아이템
    let top_item_title = contents.getElementsByClassName("menu_admin_dashboard_top_item_title");
    for (let i = 0; i < top_item_title.length; i++) {
        top_item_title[i].innerHTML = getLanguage("menu_admin_dashboard_top_item:" + i);
    }

    let graph_title = contents.getElementsByClassName("menu_admin_dashboard_graph_title")[0];
    graph_title.innerHTML = getLanguage("menu_admin_dashboard_graph_title");

    //네비게이션
    let navigation_item = contents.getElementsByClassName("menu_admin_dashboard_graph_category_item");
    for (let i = 0; i < navigation_item.length; i++) {
        navigation_item[i].getElementsByTagName("span")[0].innerHTML = getLanguage("menu_admin_dashboard_graph_navigation:" + i);
    }

    //그래프 로그
    menuAdminAnalysisGraphLoad(menuNumber, 0);
}


function menuAdminAnalysisGraphLoad(menuNumber, order) {
    let contents = document.getElementById("contents_" + menuNumber);
    if (contents.getElementsByClassName("menu_admin_dashboard_graph_in")[0].getElementsByClassName("graph").length != 0) {
        let categoryItem = contents.getElementsByClassName("menu_admin_dashboard_graph_category_item");
        let graphUniqueNumber = contents.getElementsByClassName("menu_admin_dashboard_graph_in")[0].getElementsByClassName("graph")[0].getAttribute("data-type");
        let analysisInfo = JSON.parse(contents.getElementsByClassName("analysis_info")[0].innerHTML);
        let byDate = analysisInfo["byDate"];
    
        //
        for (let i = 0; i < categoryItem.length; i++) {
            categoryItem[i].classList.remove("menu_admin_dashboard_graph_category_item_selected");
        }
        categoryItem[order].classList.add("menu_admin_dashboard_graph_category_item_selected");
    
        //그래프 데이터
        let startDate = null;
        let previousViews = null;
        let graphData = new Array();
        for (let i = 0; i < byDate.length; i++) {
            let value = 0;
            let displayValue = 0;
    
            //접속자
            if (order == 0) {
                let connect = Number.parseInt(byDate[i]["connect"]);
                value = connect;
                displayValue = commas(connect);
            }
            //요청 수
            if (order == 1) {
                let request = Number.parseInt(byDate[i]["request"]);
                value = request;
                displayValue = commas(request);
            }
            //생성된 계정 수
            if (order == 2) {
                let user = Number.parseInt(byDate[i]["user"]);
                value = user;
                displayValue = commas(user);
            }
            //파트너 인원
            if (order == 3) {
                let partner = Number.parseInt(byDate[i]["partner"]);
                value = partner;
                displayValue = commas(partner);
            }
            //파트너 PLUS 인원
            if (order == 4) {
                let partnerPlus = Number.parseInt(byDate[i]["partnerPlus"]);
                value = partnerPlus;
                displayValue = commas(partnerPlus);
            }
            //수익화된 작품 수
            if (order == 5) {
                let monetization = Number.parseInt(byDate[i]["monetization"]);
                value = monetization;
                displayValue = commas(monetization);
            }
            //평균 예상 조회당 수익 (USD)
            if (order == 6) {
                let expectedRevenuePerViews = Number.parseFloat(byDate[i]["expectedRevenuePerViews"]);
                value = Math.round(expectedRevenuePerViews);
                let fixed = null;
                if (expectedRevenuePerViews != 0 && expectedRevenuePerViews < 0.01) {
                    fixed = expectedRevenuePerViews.toFixed(3);
                } else {
                    fixed = expectedRevenuePerViews.toFixed(2);
                }
                displayValue = ("$" + fixed + " USD");
            }
    
            //
            if (startDate == null) {
                startDate = new Date(byDate[i]["date"]);
            }
    
            graphData.push(new GraphDataFormat(value, new Date(byDate[i]["date"]), displayValue));
        }
    
        if (graphData.length != 0) {
            GraphDataList.set(graphUniqueNumber, graphData);
            GraphStartTimeList.set(graphUniqueNumber, startDate);
            setStateGraph();
        }
    }
}