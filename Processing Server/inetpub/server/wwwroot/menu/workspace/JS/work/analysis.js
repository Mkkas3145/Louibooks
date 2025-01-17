

function workspaceWorkAnalysisLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let graph = contents.getElementsByClassName("graph");
    for (let i = 0; i < graph.length; i++) {
        let uniqueNumber = Math.floor(Math.random() * 999999999999);
        graph[i].setAttribute("data-type", uniqueNumber);
    }
    let analysisInfo = JSON.parse(contents.getElementsByClassName("analysis_info")[0].innerHTML);

    //개요 데이터 처리 중
    let summary_category_items = contents.getElementsByClassName("workspace_work_analysis_summary_category_items")[0];
    let summary_graph = contents.getElementsByClassName("workspace_work_analysis_summary_graph")[0];
    let summary_processing = contents.getElementsByClassName("workspace_work_analysis_summary_processing")[0];
    if (analysisInfo["byDate"].length < 2) {
        summary_processing.style.display = null;
        summary_graph.style.display = "none";
        summary_graph.textContent = "";
        summary_category_items.classList.add("workspace_work_analysis_summary_category_processing");
    }






    //언어


    let analysis_title = contents.getElementsByClassName("workspace_work_analysis_top_title")[0];
    analysis_title.innerHTML = getLanguage("workspace_work_analysis_title");
    let notice_text = contents.getElementsByClassName("workspace_work_analysis_top_notice_text")[0];
    notice_text.innerHTML = getLanguage("workspace_work_analysis_description");

    //네비게이션
    let navigation_item = contents.getElementsByClassName("workspace_work_analysis_navigation_item");
    for (let i = 0; i < navigation_item.length; i++) {
        navigation_item[i].innerHTML = getLanguage("workspace_work_analysis_navigation:" + i);
    }

    //개요
    let summary_processing_title = contents.getElementsByClassName("workspace_work_analysis_summary_processing_title")[0];
    summary_processing_title.innerHTML = getLanguage("workspace_work_analysis_summary_processing_title");
    let summary_processing_description = contents.getElementsByClassName("workspace_work_analysis_summary_processing_description")[0];
    summary_processing_description.innerHTML = getLanguage("workspace_work_analysis_summary_processing_description");

    let summary_title = contents.getElementsByClassName("workspace_work_analysis_summary_title")[0];
    summary_title.innerHTML = getLanguage("workspace_work_analysis_summary_graph_title");
    let summary_category_item = contents.getElementsByClassName("workspace_work_analysis_summary_category_item");
    for (let i = 0; i < summary_category_item.length; i++) {
        let span = summary_category_item[i].getElementsByTagName("span")[0];
        span.innerHTML = getLanguage("workspace_work_analysis_summary_category:" + i);
    }
    let summary_bottom_title = contents.getElementsByClassName("workspace_work_analysis_summary_bottom_title")[0];
    summary_bottom_title.innerHTML = getLanguage("workspace_work_analysis_summary_bottom_title");

    let demographics_contents_items = contents.getElementsByClassName("workspace_work_analysis_summary_right_demographics_contents_items")[0];
    let demographics_contents_item = demographics_contents_items.getElementsByClassName("workspace_work_analysis_summary_right_demographics_contents_item");
    let demographics_contents_item_right_line = demographics_contents_items.getElementsByClassName("workspace_work_analysis_summary_right_demographics_contents_item_right_line");
    let demographics_contents_item_right_title = demographics_contents_items.getElementsByClassName("workspace_work_analysis_summary_right_demographics_contents_item_right_title");
    let demographics_contents_item_right_value = demographics_contents_items.getElementsByClassName("workspace_work_analysis_summary_right_demographics_contents_item_right_value");



    //개요 - 사용자들이 내 작품을 찾는 방법
    let demographics = analysisInfo["demographics"];
    let totalDemographics = 0;
    let totalDemographicsData = new Array();
    for (const [key, value] of Object.entries(demographics)) {
        totalDemographicsData[totalDemographicsData.length] = {
            "type": value["type"],
            "total": value["all"]["total"]
        };
        totalDemographics += value["all"]["total"];
    }
    //높은 순으로 정렬
    totalDemographicsData.sort(function(a, b) {
        return a.total > b.total ? -1 : a.total < b.total ? 1 : 0;
    });

    length = totalDemographicsData.length;
    (length > 10) ? length = 10 : null;
    for (let i = 0; i < length; i++) {
        let value = totalDemographicsData[i];
        let percentage = Math.round(((value["total"] / totalDemographics) * 100));

        let line = document.createElement("div");
        line.classList.add("workspace_work_analysis_summary_right_demographics_contents_line");
        if (i != 0) {
            demographics_contents_items.appendChild(line);
        }

        let icon = "";
        let title = "...";
        if (isNaN(value["type"]) == false) {
            icon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-2508.472,29.514h0a47.738,47.738,0,0,1-4.76-4.993A35.214,35.214,0,0,1-2520,12.7a16.5,16.5,0,0,1,.432-3.451,13.123,13.123,0,0,1,3.217-6.267A10.63,10.63,0,0,1-2508.472,0a10.573,10.573,0,0,1,7.862,2.982,13.036,13.036,0,0,1,3.181,6.267,16.483,16.483,0,0,1,.412,3.451,35.363,35.363,0,0,1-6.749,11.878,45.984,45.984,0,0,1-4.705,4.935Zm0-26.743a7.764,7.764,0,0,0-5.8,2.216c-2.726,2.8-2.636,7.308-2.635,7.353,1.273,5.211,8.368,13.212,8.439,13.292.066-.074,6.829-7.656,8.422-13.292,0-.045.09-4.564-2.622-7.353A7.752,7.752,0,0,0-2508.477,2.771Z" transform="translate(2540.36 0.103)"></path><path d="M-2514,12a6.007,6.007,0,0,1-6-6,6.007,6.007,0,0,1,6-6,6.007,6.007,0,0,1,6,6A6.006,6.006,0,0,1-2514,12Zm0-9a3,3,0,0,0-3,3,3,3,0,0,0,3,3,3,3,0,0,0,3-3A3,3,0,0,0-2514,3Z" transform="translate(2520 38)"></path><path d="M2531.824,42.44l33.7.04s1.385-.119,1.345-2.413-1.345-2.452-1.345-2.452l-29.071-.04a5.1,5.1,0,0,1-4.43-5.537c.237-4.984,4.43-5.537,4.43-5.537h15.465v3.125h-15.148a2.463,2.463,0,0,0-1.7,2.65c.119,2.175,1.7,2.215,1.7,2.215h28.754s4.43.435,4.311,5.577-4.311,5.458-4.311,5.458l-33.7-.079Z" transform="translate(-2520)"></path><path d="M-2515,10a5.006,5.006,0,0,1-5-5,5.006,5.006,0,0,1,5-5,5.005,5.005,0,0,1,5,5A5.005,5.005,0,0,1-2515,10Zm0-7.5a2.5,2.5,0,0,0-2.5,2.5,2.5,2.5,0,0,0,2.5,2.5,2.5,2.5,0,0,0,2.5-2.5A2.5,2.5,0,0,0-2515,2.5Z" transform="translate(2547 7)"></path></g></svg>';
            title = getLanguage("workspace_work_analysis_summary_how_find_my_work:" + value["type"]);
        } else {
            icon = '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.199 13.599c0.992 1.327 2.43 2.126 3.948 2.345s3.123-0.142 4.45-1.134c0.239-0.179 0.465-0.375 0.655-0.568l2.995-2.995c1.163-1.204 1.722-2.751 1.696-4.285s-0.639-3.061-1.831-4.211c-1.172-1.132-2.688-1.692-4.199-1.683-1.492 0.008-2.984 0.571-4.137 1.683l-1.731 1.721c-0.392 0.389-0.394 1.023-0.004 1.414s1.023 0.394 1.414 0.004l1.709-1.699c0.77-0.742 1.763-1.117 2.76-1.123 1.009-0.006 2.016 0.367 2.798 1.122 0.795 0.768 1.203 1.783 1.221 2.808s-0.355 2.054-1.11 2.836l-3.005 3.005c-0.114 0.116-0.263 0.247-0.428 0.37-0.885 0.662-1.952 0.902-2.967 0.756s-1.971-0.678-2.632-1.563c-0.331-0.442-0.957-0.533-1.4-0.202s-0.533 0.957-0.202 1.4zM14.801 10.401c-0.992-1.327-2.43-2.126-3.948-2.345s-3.124 0.142-4.451 1.134c-0.239 0.179-0.464 0.375-0.655 0.568l-2.995 2.995c-1.163 1.204-1.722 2.751-1.696 4.285s0.639 3.061 1.831 4.211c1.172 1.132 2.688 1.692 4.199 1.683 1.492-0.008 2.984-0.571 4.137-1.683l1.723-1.723c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-1.696 1.698c-0.77 0.742-1.763 1.117-2.76 1.123-1.009 0.006-2.016-0.367-2.798-1.122-0.795-0.768-1.203-1.783-1.221-2.808s0.355-2.054 1.11-2.836l3.005-3.005c0.114-0.116 0.263-0.247 0.428-0.37 0.885-0.662 1.952-0.902 2.967-0.756s1.971 0.678 2.632 1.563c0.331 0.442 0.957 0.533 1.4 0.202s0.533-0.957 0.202-1.4z"></path></svg>';
            title = value["type"];
        }

        let newEl = document.createElement("div");
        newEl.classList.add("workspace_work_analysis_summary_right_demographics_contents_item");
        newEl.innerHTML = `
            <div class = "workspace_work_analysis_summary_right_demographics_contents_item_left">
                ` + icon + `
            </div>
            <div class = "workspace_work_analysis_summary_right_demographics_contents_item_right">
                <div class = "workspace_work_analysis_summary_right_demographics_contents_item_right_title">
                    ` + title + `
                </div>
                <div class = "workspace_work_analysis_summary_right_demographics_contents_item_right_value">
                    ` + percentage + `%
                </div>
                <div class = "workspace_work_analysis_summary_right_demographics_contents_item_right_lines">
                    <div class = "workspace_work_analysis_summary_right_demographics_contents_item_right_line" style = "width: ` + percentage + `%;"></div>
                </div>
            </div>
        `;
        demographics_contents_items.appendChild(newEl);
    }
    if (length == 0) {
        demographics_contents_items.style.display = "none";
    }

    //개요 - 로그인 여부
    demographics_contents_items = contents.getElementsByClassName("workspace_work_analysis_summary_right_demographics_contents_items")[1];
    demographics_contents_item = demographics_contents_items.getElementsByClassName("workspace_work_analysis_summary_right_demographics_contents_item");
    demographics_contents_item_right_line = demographics_contents_items.getElementsByClassName("workspace_work_analysis_summary_right_demographics_contents_item_right_line");
    demographics_contents_item_right_title = demographics_contents_items.getElementsByClassName("workspace_work_analysis_summary_right_demographics_contents_item_right_title");
    demographics_contents_item_right_value = demographics_contents_items.getElementsByClassName("workspace_work_analysis_summary_right_demographics_contents_item_right_value");
    demographics_contents_item_right_title[0].innerHTML = getLanguage("workspace_work_analysis_summary_demographic_value:login");
    demographics_contents_item_right_title[1].innerHTML = getLanguage("workspace_work_analysis_summary_demographic_value:logout");

    let login = 0;
    let logout = 0;
    let total = 0;
    for (const [key, value] of Object.entries(analysisInfo["demographics"])) {
        login += value["all"]["login"];
        logout += value["all"]["logout"];
        total += value["all"]["total"];
    }
    //로그인
    if (total != 0) {
        let percentage = Math.round(((login / total) * 100));
        demographics_contents_item_right_line[0].style.width = percentage + "%";
        demographics_contents_item_right_value[0].innerHTML = percentage + "%";
    } else if (login != 0) {
        demographics_contents_item_right_line[0].style.width = "100%";
        demographics_contents_item_right_value[0].innerHTML = "100%";
    } else {
        demographics_contents_item_right_line[0].style.width = "0%";
        demographics_contents_item_right_value[0].innerHTML = "0%";
    }
    //로그아웃
    if (total != 0) {
        let percentage = Math.round(((logout / total) * 100));
        demographics_contents_item_right_line[1].style.width = percentage + "%";
        demographics_contents_item_right_value[1].innerHTML = percentage + "%";
    } else if (logout != 0) {
        demographics_contents_item_right_line[1].style.width = "100%";
        demographics_contents_item_right_value[1].innerHTML = "100%";
    } else {
        demographics_contents_item_right_line[1].style.width = "0%";
        demographics_contents_item_right_value[1].innerHTML = "0%";
    }



    //성별
    demographics_contents_items = contents.getElementsByClassName("workspace_work_analysis_summary_right_demographics_contents_items")[2];
    demographics_contents_item = demographics_contents_items.getElementsByClassName("workspace_work_analysis_summary_right_demographics_contents_item");
    demographics_contents_item_right_line = demographics_contents_items.getElementsByClassName("workspace_work_analysis_summary_right_demographics_contents_item_right_line");
    demographics_contents_item_right_title = demographics_contents_items.getElementsByClassName("workspace_work_analysis_summary_right_demographics_contents_item_right_title");
    demographics_contents_item_right_value = demographics_contents_items.getElementsByClassName("workspace_work_analysis_summary_right_demographics_contents_item_right_value");
    demographics_contents_item_right_title[0].innerHTML = getLanguage("workspace_work_analysis_summary_demographic_value:gender_difference");
    demographics_contents_item_right_title[1].innerHTML = getLanguage("workspace_work_analysis_summary_demographic_value:male");
    demographics_contents_item_right_title[2].innerHTML = getLanguage("workspace_work_analysis_summary_demographic_value:female");

    let male = 0;
    let female = 0;
    total = 0;
    for (const [key, value] of Object.entries(analysisInfo["demographics"])) {
        if (value["gender"]["male"] != null) {
            male += value["gender"]["male"];
        }
        if (value["gender"]["female"] != null) {
            female += value["gender"]["female"];
        }
        total += value["gender"]["total"];
    }
    let malePercentage = 0;
    let femalePercentage = 0;
    //남자
    if (total != 0) {
        let percentage = Math.round(((male / total) * 100));
        demographics_contents_item_right_line[1].style.width = percentage + "%";
        demographics_contents_item_right_value[1].innerHTML = percentage + "%";

        malePercentage = percentage;
    } else if (male != 0) {
        demographics_contents_item_right_line[1].style.width = "100%";
        demographics_contents_item_right_value[1].innerHTML = "100%";
    } else {
        demographics_contents_item_right_line[1].style.width = "0%";
        demographics_contents_item_right_value[1].innerHTML = "0%";
    }
    //여자
    if (total != 0) {
        let percentage = Math.round(((female / total) * 100));
        demographics_contents_item_right_line[2].style.width = percentage + "%";
        demographics_contents_item_right_value[2].innerHTML = percentage + "%";

        femalePercentage = percentage;
    } else if (female != 0) {
        demographics_contents_item_right_line[2].style.width = "100%";
        demographics_contents_item_right_value[2].innerHTML = "100%";
    } else {
        demographics_contents_item_right_line[2].style.width = "0%";
        demographics_contents_item_right_value[2].innerHTML = "0%";
    }
    //성별 차이
    let genderDifference = malePercentage - femalePercentage;
    (genderDifference < 0) ? genderDifference *= -1 : null;
    demographics_contents_item_right_line[0].style.width = genderDifference + "%";
    demographics_contents_item_right_value[0].innerHTML = genderDifference + "%";



    //나이
    demographics_contents_items = contents.getElementsByClassName("workspace_work_analysis_summary_right_demographics_contents_items")[3];
    demographics_contents_item = demographics_contents_items.getElementsByClassName("workspace_work_analysis_summary_right_demographics_contents_item");
    demographics_contents_item_right_line = demographics_contents_items.getElementsByClassName("workspace_work_analysis_summary_right_demographics_contents_item_right_line");
    demographics_contents_item_right_title = demographics_contents_items.getElementsByClassName("workspace_work_analysis_summary_right_demographics_contents_item_right_title");
    demographics_contents_item_right_value = demographics_contents_items.getElementsByClassName("workspace_work_analysis_summary_right_demographics_contents_item_right_value");
    demographics_contents_item_right_title[0].innerHTML = getLanguage("workspace_work_analysis_summary_demographic_value:age_type:0");
    demographics_contents_item_right_title[1].innerHTML = getLanguage("workspace_work_analysis_summary_demographic_value:age_type:1");
    demographics_contents_item_right_title[2].innerHTML = getLanguage("workspace_work_analysis_summary_demographic_value:age_type:2");
    demographics_contents_item_right_title[3].innerHTML = getLanguage("workspace_work_analysis_summary_demographic_value:age_type:3");
    demographics_contents_item_right_title[4].innerHTML = getLanguage("workspace_work_analysis_summary_demographic_value:age_type:4");
    demographics_contents_item_right_title[5].innerHTML = getLanguage("workspace_work_analysis_summary_demographic_value:age_type:5");
    demographics_contents_item_right_title[6].innerHTML = getLanguage("workspace_work_analysis_summary_demographic_value:age_type:6");
    demographics_contents_item_right_title[7].innerHTML = getLanguage("workspace_work_analysis_summary_demographic_value:age_type:7");

    let ageType0 = 0;
    let ageType1 = 0;
    let ageType2 = 0;
    let ageType3 = 0;
    let ageType4 = 0;
    let ageType5 = 0;
    let ageType6 = 0;
    let ageType7 = 0;
    total = 0;
    for (const [key, value] of Object.entries(analysisInfo["demographics"])) {
        if (value["ageType"]["type_0"] != null) {
            ageType0 += value["ageType"]["type_0"];
        }
        if (value["ageType"]["type_1"] != null) {
            ageType1 += value["ageType"]["type_1"];
        }
        if (value["ageType"]["type_2"] != null) {
            ageType2 += value["ageType"]["type_2"];
        }
        if (value["ageType"]["type_3"] != null) {
            ageType3 += value["ageType"]["type_3"];
        }
        if (value["ageType"]["type_4"] != null) {
            ageType4 += value["ageType"]["type_4"];
        }
        if (value["ageType"]["type_5"] != null) {
            ageType5 += value["ageType"]["type_5"];
        }
        if (value["ageType"]["type_6"] != null) {
            ageType6 += value["ageType"]["type_6"];
        }
        if (value["ageType"]["type_7"] != null) {
            ageType7 += value["ageType"]["type_7"];
        }
        total += value["ageType"]["total"];
    }
    //type_0
    if (total != 0) {
        let percentage = Math.round(((ageType0 / total) * 100));
        demographics_contents_item_right_line[0].style.width = percentage + "%";
        demographics_contents_item_right_value[0].innerHTML = percentage + "%";
    } else if (ageType0 != 0) {
        demographics_contents_item_right_line[0].style.width = "100%";
        demographics_contents_item_right_value[0].innerHTML = "100%";
    } else {
        demographics_contents_item_right_line[0].style.width = "0%";
        demographics_contents_item_right_value[0].innerHTML = "0%";
    }
    //type_1
    if (total != 0) {
        let percentage = Math.round(((ageType1 / total) * 100));
        demographics_contents_item_right_line[1].style.width = percentage + "%";
        demographics_contents_item_right_value[1].innerHTML = percentage + "%";
    } else if (ageType1 != 0) {
        demographics_contents_item_right_line[1].style.width = "100%";
        demographics_contents_item_right_value[1].innerHTML = "100%";
    } else {
        demographics_contents_item_right_line[1].style.width = "0%";
        demographics_contents_item_right_value[1].innerHTML = "0%";
    }
    //type_2
    if (total != 0) {
        let percentage = Math.round(((ageType2 / total) * 100));
        demographics_contents_item_right_line[2].style.width = percentage + "%";
        demographics_contents_item_right_value[2].innerHTML = percentage + "%";
    } else if (ageType2 != 0) {
        demographics_contents_item_right_line[2].style.width = "100%";
        demographics_contents_item_right_value[2].innerHTML = "100%";
    } else {
        demographics_contents_item_right_line[2].style.width = "0%";
        demographics_contents_item_right_value[2].innerHTML = "0%";
    }
    //type_3
    if (total != 0) {
        let percentage = Math.round(((ageType3 / total) * 100));
        demographics_contents_item_right_line[3].style.width = percentage + "%";
        demographics_contents_item_right_value[3].innerHTML = percentage + "%";
    } else if (ageType3 != 0) {
        demographics_contents_item_right_line[3].style.width = "100%";
        demographics_contents_item_right_value[3].innerHTML = "100%";
    } else {
        demographics_contents_item_right_line[3].style.width = "0%";
        demographics_contents_item_right_value[3].innerHTML = "0%";
    }
    //type_4
    if (total != 0) {
        let percentage = Math.round(((ageType4 / total) * 100));
        demographics_contents_item_right_line[4].style.width = percentage + "%";
        demographics_contents_item_right_value[4].innerHTML = percentage + "%";
    } else if (ageType4 != 0) {
        demographics_contents_item_right_line[4].style.width = "100%";
        demographics_contents_item_right_value[4].innerHTML = "100%";
    } else {
        demographics_contents_item_right_line[4].style.width = "0%";
        demographics_contents_item_right_value[4].innerHTML = "0%";
    }
    //type_5
    if (total != 0) {
        let percentage = Math.round(((ageType5 / total) * 100));
        demographics_contents_item_right_line[5].style.width = percentage + "%";
        demographics_contents_item_right_value[5].innerHTML = percentage + "%";
    } else if (ageType5 != 0) {
        demographics_contents_item_right_line[5].style.width = "100%";
        demographics_contents_item_right_value[5].innerHTML = "100%";
    } else {
        demographics_contents_item_right_line[5].style.width = "0%";
        demographics_contents_item_right_value[5].innerHTML = "0%";
    }
    //type_6
    if (total != 0) {
        let percentage = Math.round(((ageType6 / total) * 100));
        demographics_contents_item_right_line[6].style.width = percentage + "%";
        demographics_contents_item_right_value[6].innerHTML = percentage + "%";
    } else if (ageType6 != 0) {
        demographics_contents_item_right_line[6].style.width = "100%";
        demographics_contents_item_right_value[6].innerHTML = "100%";
    } else {
        demographics_contents_item_right_line[6].style.width = "0%";
        demographics_contents_item_right_value[6].innerHTML = "0%";
    }
    //type_7
    if (total != 0) {
        let percentage = Math.round(((ageType7 / total) * 100));
        demographics_contents_item_right_line[7].style.width = percentage + "%";
        demographics_contents_item_right_value[7].innerHTML = percentage + "%";
    } else if (ageType7 != 0) {
        demographics_contents_item_right_line[7].style.width = "100%";
        demographics_contents_item_right_value[7].innerHTML = "100%";
    } else {
        demographics_contents_item_right_line[7].style.width = "0%";
        demographics_contents_item_right_value[7].innerHTML = "0%";
    }



    //위치 인구 통계 정보
    let locationTotal = 0;
    let locationInfo = new Array();
    for (const [key, value] of Object.entries(analysisInfo["demographics"])) {
        let location = value["location"];
        for (const [key, value] of Object.entries(location)) {
            if (key != "all") {
                let index = null;
                for (let i = 0; i < locationInfo.length; i++) {
                    if (locationInfo[i]["location"] == key) {
                        index = i;
                        break;
                    }
                }
                if (index != null) {
                    locationInfo[index]["total"] += value["total"];
                    locationTotal += value["total"];
                } else {
                    locationInfo[locationInfo.length] = {
                        'location': key,
                        'total': value["total"]
                    };
                    locationTotal += value["total"];
                }
            }
        }
    }
    //높은 순으로 정렬
    locationInfo.sort(function(a, b) {
        return a.total > b.total ? -1 : a.total < b.total ? 1 : 0;
    });

    demographics_contents_items = contents.getElementsByClassName("workspace_work_analysis_summary_right_demographics_contents_items")[4];
    length = locationInfo.length;
    (length > 10) ? length = 10 : null;
    for (let i = 0; i < length; i++) {
        let percentage = Math.round((locationInfo[i]["total"] / locationTotal) * 100);

        let line = document.createElement("div");
        line.classList.add("workspace_work_analysis_summary_right_demographics_contents_line");
        if (i != 0) {
            demographics_contents_items.appendChild(line);
        }

        let newEl = document.createElement("div");
        newEl.classList.add("workspace_work_analysis_summary_right_demographics_contents_item");
        newEl.innerHTML = `
            <div class = "workspace_work_analysis_summary_right_demographics_contents_item_left">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,50A25.007,25.007,0,0,1,15.269,1.965,25.007,25.007,0,0,1,34.731,48.036,24.843,24.843,0,0,1,25,50ZM25,3A22,22,0,1,0,47,25,22.025,22.025,0,0,0,25,3Z"></path><rect width="48" height="2" transform="translate(26 1) rotate(90)"></rect><path d="M0,0S11.775-11.288,23.775-11.288,48,0,48,0V2S35.775-9.288,23.775-9.288,0,2,0,2Z" transform="translate(26 1) rotate(90)"></path><path d="M0,0S11.775-11.288,23.775-11.288,48,0,48,0V2S35.775-9.288,23.775-9.288,0,2,0,2Z" transform="translate(24 49) rotate(-90)"></path><path d="M0,0S11.923-4.994,23.923-4.994,48,0,48,0V2S35.923-2.994,23.923-2.994,0,2,0,2Z" transform="translate(49 31.856) rotate(-180)"></path><path d="M0,0S11.923-4.994,23.923-4.994,48,0,48,0V2S35.923-2.994,23.923-2.994,0,2,0,2Z" transform="translate(1 17.85)"></path></g></svg>
            </div>
            <div class = "workspace_work_analysis_summary_right_demographics_contents_item_right">
                <div class = "workspace_work_analysis_summary_right_demographics_contents_item_right_title">
                    ` + getLanguage("location:" + locationInfo[i]["location"]) + ` (` + locationInfo[i]["location"].toUpperCase() + `)
                </div>
                <div class = "workspace_work_analysis_summary_right_demographics_contents_item_right_value">
                    ` + (percentage + "%") + `
                </div>
                <div class = "workspace_work_analysis_summary_right_demographics_contents_item_right_lines">
                    <div class = "workspace_work_analysis_summary_right_demographics_contents_item_right_line" style = "width: ` + percentage + `%;"></div>
                </div>
            </div>
        `;
        demographics_contents_items.appendChild(newEl);
    }
    //위치 인구 통계 정보가 없다면
    if (locationInfo.length == 0) {
        demographics_contents_items.style.display = "none";
    }

    //개요 - 콘텐츠 분석 요약
    let summary_bottom_left_items = contents.getElementsByClassName("workspace_work_analysis_summary_bottom_left_items")[0];
    let partInfo = analysisInfo["partInfo"];
    if (partInfo != null) {
        let maxCount = 5;
        length = ((partInfo.length - 1) - (maxCount - 1));
        (length < 0) ? length = 0 : null;
        for (let i = (partInfo.length - 1); i >= length; i--) {
            let info = partInfo[i];
    
            let category = '...';
            if (info["category"] == "episode") {
                let episode = info["episode"];
                category = getLanguage("work_part_category:episode_count").replaceAll("{R:0}", episode);
            } else {
                category = getLanguage("work_part_category:" + info["category"]);
            }
    
            let continuousViewedPercent = Math.round(Number.parseFloat(info["continuousViewedPercent"]) * 100);
    
            let newEl = document.createElement("div");
            newEl.classList.add("workspace_work_analysis_summary_bottom_left_item");
            newEl.setAttribute("type", info["type"]);
            newEl.innerHTML = `
                <div class = "workspace_work_analysis_summary_bottom_left_item_left img_wrap">
                    <img src = "` + info["thumbnail_image"] + `" onload = "imageLoad(event);" alt = "">
                </div>
                <div class = "workspace_work_analysis_summary_bottom_left_item_right">
                    <div class = "workspace_work_analysis_summary_bottom_left_item_right_category">
                        ` + category + `
                    </div>
                    <div class = "workspace_work_analysis_summary_bottom_left_item_right_title">
                        ` + info["title"] + `
                    </div>
                    <div class = "workspace_work_analysis_summary_bottom_left_item_right_info">
                        <div class = "workspace_work_analysis_summary_bottom_left_item_right_info_item">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5"></rect><rect width="3" height="50" rx="1.5" transform="translate(50 47) rotate(90)"></rect><rect width="3" height="18" rx="1.5" transform="translate(10 24)"></rect><rect width="3" height="28" rx="1.5" transform="translate(20 14)"></rect><rect width="3" height="11" rx="1.5" transform="translate(29 31)"></rect><rect width="3" height="21" rx="1.5" transform="translate(39 21)"></rect></g></svg>
                            <span>` + getLanguage("workspace_work_analysis_summary_part_continuous_viewed_percent").replaceAll("{R:0}", continuousViewedPercent) + `</span>
                        </div>
                        <div class = "workspace_work_analysis_summary_bottom_left_item_right_info_item">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,50A25.007,25.007,0,0,1,15.269,1.965,25.007,25.007,0,0,1,34.731,48.036,24.843,24.843,0,0,1,25,50ZM25,3A22,22,0,1,0,47,25,22.025,22.025,0,0,0,25,3Z"></path><g transform="translate(0 1)"><rect width="3" height="21" rx="1.5" transform="translate(23 6)"></rect><rect width="3" height="21" rx="1.5" transform="translate(44 24) rotate(90)"></rect></g></g></svg>
                            <span>` + getTimePast(new Date(info["upload_date"])) + `</span>
                        </div>
                        <div class = "workspace_work_analysis_summary_bottom_left_item_right_info_item">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M40.707,46.427h0a3.976,3.976,0,0,1-2.333-1.044c-3.13-2.487-11.917-9.316-12-9.383H5a5.006,5.006,0,0,1-5-5V5A5.006,5.006,0,0,1,5,0H45a5.006,5.006,0,0,1,5,5V31a5.005,5.005,0,0,1-5,5H42.466v9.106A2,2,0,0,1,40.707,46.427ZM4.906,3A1.985,1.985,0,0,0,3.016,4.9L2.984,31.027c0,.019.129,1.891,1.859,1.953H27.391l12.078,9.453V32.98h5.688A2.03,2.03,0,0,0,47,31l-.015-26.25c0-.017-.282-1.672-1.8-1.718Z" transform="translate(0 1.786)"></path></g></svg>
                            <span>` + commas(info["comments_count"]) + `</span>
                        </div>
                        <div class = "workspace_work_analysis_summary_bottom_left_item_right_info_item">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,37a21.437,21.437,0,0,1-9.731-2.508,34.262,34.262,0,0,1-7.947-5.721A39.4,39.4,0,0,1,1.965,22.54,10.312,10.312,0,0,1,0,18.5a10.313,10.313,0,0,1,1.965-4.04A39.4,39.4,0,0,1,7.323,8.229a34.261,34.261,0,0,1,7.947-5.721A21.437,21.437,0,0,1,25,0a21.236,21.236,0,0,1,9.728,2.538A34.517,34.517,0,0,1,42.67,8.311a40.627,40.627,0,0,1,5.357,6.242A10.518,10.518,0,0,1,50,18.5c.01,1.175-2.446,5.3-6.467,9.358a35.762,35.762,0,0,1-8.228,6.3A21.562,21.562,0,0,1,25,37ZM25,2.964C13.381,2.964,3.264,16.237,3.264,18.5S13.381,34.036,25,34.036c7.276,0,13.532-5.214,16.613-8.322,3.016-3.042,5.109-6.244,5.1-7.214-.009-1.079-2.552-4.948-6.516-8.557C36.7,6.759,31.227,2.964,25,2.964Z" transform="translate(0 7)"></path><path d="M9.5,19A9.5,9.5,0,0,1,2.783,2.783,9.5,9.5,0,0,1,16.217,16.217,9.437,9.437,0,0,1,9.5,19Zm0-16.026A6.526,6.526,0,1,0,16.026,9.5,6.534,6.534,0,0,0,9.5,2.974Z" transform="translate(16 16)"></path></g></svg>
                            <span>` + commas(info["views"]) + `</span>
                        </div>
                    </div>
                </div>
            `;
            summary_bottom_left_items.appendChild(newEl);
        }
    } else {
        //콘텐츠가 없으면
        summary_bottom_left_items.innerHTML = `
            <div class = "menu_home_no_data">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-3094.635,49.5H-3116.5a3,3,0,0,1-3-3V3.5a3,3,0,0,1,3-3h31a3,3,0,0,1,3,3V37.365L-3094.635,49.5Z" transform="translate(3126)" opacity="0.7"/><path d="M3151.333,49.5l12.293-12.293h-9.846a2.517,2.517,0,0,0-1.983.575,2.884,2.884,0,0,0-.464,2.039Z" transform="translate(-3120)" opacity="0.6"/></g></svg>
                <div class = "menu_home_no_data_title">
                    ` + getLanguage("workspace_work_analysis_summary_part_no_data") + `
                </div>
                <div class = "menu_home_no_data_description">
                    ` + getLanguage("no_data_description"); + `
                </div>
            </div>
        `;
    }




    //콘텐츠 분석
    let contents_analysis_items = contents.getElementsByClassName("workspace_work_analysis_contents_analysis_items")[0];
    if (partInfo != null) {
        let contentsAnalysisIndex = new Array();
        for (let i = 0; i < partInfo.length; i++) {
            contentsAnalysisIndex[contentsAnalysisIndex.length] = i;
        }

        let maxCount = 20;
        length = ((partInfo.length - 1) - (maxCount - 1));
        (length < 0) ? length = 0 : null;
        for (let i = (partInfo.length - 1); i >= length; i--) {
            addItemWorkspaceWorkAnalysisContentsAnalysis(menuNumber, partInfo[i]);
            contentsAnalysisIndex = contentsAnalysisIndex.remove(i);
        }

        //스크롤 시 더 로드하기 위해서 다음에 추가할 회차의 인덱스를 기록한다
        contents_analysis_items.setAttribute("indexes", contentsAnalysisIndex.join(","));
    } else {
        //콘텐츠가 없다면
        contents_analysis_items.innerHTML = `
            <div class = "menu_home_no_data">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-3094.635,49.5H-3116.5a3,3,0,0,1-3-3V3.5a3,3,0,0,1,3-3h31a3,3,0,0,1,3,3V37.365L-3094.635,49.5Z" transform="translate(3126)" opacity="0.7"/><path d="M3151.333,49.5l12.293-12.293h-9.846a2.517,2.517,0,0,0-1.983.575,2.884,2.884,0,0,0-.464,2.039Z" transform="translate(-3120)" opacity="0.6"/></g></svg>
                <div class = "menu_home_no_data_title">
                    ` + getLanguage("workspace_work_analysis_contents_analysis_no_data") + `
                </div>
                <div class = "menu_home_no_data_description">
                    ` + getLanguage("no_data_description") + `
                </div>
            </div>
        `;
    }



    workspaceWorkAnalysisSummaryGraphLoad(menuNumber, 0);
    workspaceWorkAnalysisNavigation(menuNumber, 0);
}

function workspaceWorkAnalysisNavigation(menuNumber, order) {
    let contents = document.getElementById("contents_" + menuNumber);
    let analysis_contents = contents.getElementsByClassName("workspace_work_analysis_contents")[0];
    let items = contents.getElementsByClassName("workspace_work_analysis_navigation_items")[0].children;
    let line = contents.getElementsByClassName("workspace_work_analysis_navigation_line")[0];

    //떨어져 있는 거리 구하기
    let marginLeft = 0;
    for (let i = 0; i < items.length; i++) {
        if (i < order) {
            marginLeft += items[i].clientWidth;
        } else {
            break;
        }
    }

    //모든 아이템 선택 클래스 제거
    for (let i = 0; i < items.length; i++) {
        items[i].classList.remove("workspace_work_analysis_navigation_item_selected");
    }
    
    line.style.marginLeft = marginLeft + "px";
    line.style.width = items[order].clientWidth + "px";
    items[order].classList.add("workspace_work_analysis_navigation_item_selected");
    setTimeout(() => {
        line.style.transition = "all 0.2s";
    }, 1);

    analysis_contents.setAttribute("order", order);
}

function workspaceWorkAnalysisSummaryGraphLoad(menuNumber, order) {
    let contents = document.getElementById("contents_" + menuNumber);
    if (contents.getElementsByClassName("workspace_work_analysis_summary_graph")[0].getElementsByClassName("graph").length != 0) {
        let categoryItem = contents.getElementsByClassName("workspace_work_analysis_summary_category_item");
        let graphUniqueNumber = contents.getElementsByClassName("workspace_work_analysis_summary_graph")[0].getElementsByClassName("graph")[0].getAttribute("data-type");
        let analysisInfo = JSON.parse(contents.getElementsByClassName("analysis_info")[0].innerHTML);
        let byDate = analysisInfo["byDate"];
    
        //
        for (let i = 0; i < categoryItem.length; i++) {
            categoryItem[i].classList.remove("workspace_work_analysis_summary_category_item_selected");
        }
        categoryItem[order].classList.add("workspace_work_analysis_summary_category_item_selected");
    
        //그래프 데이터
        let startDate = null;
        let previousViews = null;
        let graphData = new Array();
        for (let i = 0; i < byDate.length; i++) {
            let value = 0;
            let displayValue = 0;
    
            //전체 조회수
            if (order == 0) {
                let totalViews = Number.parseInt(byDate[i]["totalViews"]);
                value = totalViews;
                displayValue = commas(totalViews);
            }
            //조회수 증가
            if (order == 1) {
                let totalViews = Number.parseInt(byDate[i]["totalViews"]);
                let views = totalViews;
                if (previousViews != null) {
                    views = totalViews - previousViews;
                }
    
                value = views;
                displayValue = commas(views);
                previousViews = totalViews; //이전 전체 조회수 기록
            }
            //연독률
            if (order == 2) {
                let continuousViewedPercent = Number.parseFloat(byDate[i]["continuousViewedPercent"]) * 100;
                value = continuousViewedPercent;
                displayValue = Number.parseInt(continuousViewedPercent) + "%";
            }
            //노출 수
            if (order == 3) {
                let impressions = Number.parseInt(byDate[i]["impressions"]);
                value = impressions;
                displayValue = commas(impressions);
            }
            //클릭률
            if (order == 4) {
                let clickThroughRate = Number.parseFloat(byDate[i]["clickThroughRate"]) * 100;
                value = clickThroughRate;
                displayValue = Number.parseInt(clickThroughRate) + "%";
            }
            //평점
            if (order == 5) {
                let averageScore = Number.parseFloat(byDate[i]["averageScore"]);
                value = Math.round(averageScore);
                displayValue = ("★ " + averageScore.toFixed(1));
            }
            //예상 수익
            if (order == 6) {
                let expectedRevenue = Number.parseFloat(byDate[i]["expectedRevenue"]);
                value = Math.round(expectedRevenue);
                displayValue = ("$" + expectedRevenue.toFixed(2) + " USD");
            }
            //조회수당 예상 수익
            if (order == 7) {
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


































function addItemWorkspaceWorkAnalysisContentsAnalysis(menuNumber, info) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("workspace_work_analysis_contents_analysis_items")[0];

    let category = '...';
    if (info["category"] == "episode") {
        let episode = info["episode"];
        category = getLanguage("work_part_category:episode_count").replaceAll("{R:0}", episode);
    } else {
        category = getLanguage("work_part_category:" + info["category"]);
    }

    let continuousViewedPercent = Math.round(Number.parseFloat(info["continuousViewedPercent"]) * 100);

    let newEl = document.createElement("div");
    newEl.classList.add("visible_element");
    newEl.classList.add("variable_element");
    newEl.classList.add("workspace_work_analysis_contents_analysis_item");
    newEl.setAttribute("type", info["type"]);
    newEl.innerHTML = `
        <div class = "workspace_work_analysis_contents_analysis_item_left img_wrap immutable_element">
            <img src = "` + info["thumbnail_image"] + `" onload = "imageLoad(event);" alt = "">
        </div>
        <div class = "workspace_work_analysis_contents_analysis_item_right">
            <div class = "workspace_work_analysis_contents_analysis_item_right_top immutable_element">
                <div class = "workspace_work_analysis_contents_analysis_item_right_category">
                    ` + category + `
                </div>
                <div class = "workspace_work_analysis_contents_analysis_item_right_title">
                    ` + info["title"] + `
                </div>
            </div>
            <div class = "workspace_work_analysis_contents_analysis_item_right_bottom">
                <div class = "workspace_work_analysis_contents_analysis_item_right_info">
                    <div class = "workspace_work_analysis_contents_analysis_item_right_info_item">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5"></rect><rect width="3" height="50" rx="1.5" transform="translate(50 47) rotate(90)"></rect><rect width="3" height="18" rx="1.5" transform="translate(10 24)"></rect><rect width="3" height="28" rx="1.5" transform="translate(20 14)"></rect><rect width="3" height="11" rx="1.5" transform="translate(29 31)"></rect><rect width="3" height="21" rx="1.5" transform="translate(39 21)"></rect></g></svg>
                        ` + getLanguage("workspace_work_analysis_summary_part_continuous_viewed_percent").replaceAll("{R:0}", continuousViewedPercent) + `
                    </div>
                    <div class = "workspace_work_analysis_contents_analysis_item_right_info_item">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,50A25.007,25.007,0,0,1,15.269,1.965,25.007,25.007,0,0,1,34.731,48.036,24.843,24.843,0,0,1,25,50ZM25,3A22,22,0,1,0,47,25,22.025,22.025,0,0,0,25,3Z"></path><g transform="translate(0 1)"><rect width="3" height="21" rx="1.5" transform="translate(23 6)"></rect><rect width="3" height="21" rx="1.5" transform="translate(44 24) rotate(90)"></rect></g></g></svg>
                        ` + getTimePast(new Date(info["upload_date"])) + `
                    </div>
                    <div class = "workspace_work_analysis_contents_analysis_item_right_info_item">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M40.707,46.427h0a3.976,3.976,0,0,1-2.333-1.044c-3.13-2.487-11.917-9.316-12-9.383H5a5.006,5.006,0,0,1-5-5V5A5.006,5.006,0,0,1,5,0H45a5.006,5.006,0,0,1,5,5V31a5.005,5.005,0,0,1-5,5H42.466v9.106A2,2,0,0,1,40.707,46.427ZM4.906,3A1.985,1.985,0,0,0,3.016,4.9L2.984,31.027c0,.019.129,1.891,1.859,1.953H27.391l12.078,9.453V32.98h5.688A2.03,2.03,0,0,0,47,31l-.015-26.25c0-.017-.282-1.672-1.8-1.718Z" transform="translate(0 1.786)"></path></g></svg>
                        ` + commas(info["comments_count"]) + `
                    </div>
                    <div class = "workspace_work_analysis_contents_analysis_item_right_info_item">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,37a21.437,21.437,0,0,1-9.731-2.508,34.262,34.262,0,0,1-7.947-5.721A39.4,39.4,0,0,1,1.965,22.54,10.312,10.312,0,0,1,0,18.5a10.313,10.313,0,0,1,1.965-4.04A39.4,39.4,0,0,1,7.323,8.229a34.261,34.261,0,0,1,7.947-5.721A21.437,21.437,0,0,1,25,0a21.236,21.236,0,0,1,9.728,2.538A34.517,34.517,0,0,1,42.67,8.311a40.627,40.627,0,0,1,5.357,6.242A10.518,10.518,0,0,1,50,18.5c.01,1.175-2.446,5.3-6.467,9.358a35.762,35.762,0,0,1-8.228,6.3A21.562,21.562,0,0,1,25,37ZM25,2.964C13.381,2.964,3.264,16.237,3.264,18.5S13.381,34.036,25,34.036c7.276,0,13.532-5.214,16.613-8.322,3.016-3.042,5.109-6.244,5.1-7.214-.009-1.079-2.552-4.948-6.516-8.557C36.7,6.759,31.227,2.964,25,2.964Z" transform="translate(0 7)"></path><path d="M9.5,19A9.5,9.5,0,0,1,2.783,2.783,9.5,9.5,0,0,1,16.217,16.217,9.437,9.437,0,0,1,9.5,19Zm0-16.026A6.526,6.526,0,1,0,16.026,9.5,6.534,6.534,0,0,0,9.5,2.974Z" transform="translate(16 16)"></path></g></svg>
                        ` + commas(info["views"]) + `
                    </div>
                </div>
            </div>
        </div>
    `;
    items.appendChild(newEl);
}

function checkWorkspaceWorkAnalysisContentsAnalysisMoreLoad() {
    if (getCurrentMenuName() == "workspace_work_analysis") {
        let menuNumber = getCurrentMenuNumber();
        let contents = document.getElementById("contents_" + menuNumber);

        let analysis_contents = contents.getElementsByClassName("workspace_work_analysis_contents")[0];
        let contents_analysis_items = contents.getElementsByClassName("workspace_work_analysis_contents_analysis_items")[0];
        let indexes = contents_analysis_items.getAttribute("indexes").split(",");
        if (indexes.length != 0 && indexes[0] != "" && analysis_contents.getAttribute("order") == 1) {
            //스크롤 퍼센트 구하기
            let boxSize = 75;

            let scrollPercent = ((document.documentElement.scrollTop + window.innerHeight) / (document.documentElement.scrollHeight - boxSize)) * 100;
            if (scrollPercent >= 100) {
                let analysisInfo = JSON.parse(contents.getElementsByClassName("analysis_info")[0].innerHTML);
                let partInfo = analysisInfo["partInfo"];
    
                //
                let maxCount = 20;
                length = ((indexes.length - 1) - (maxCount - 1));
                (length < 0) ? length = 0 : null;
                for (let i = (indexes.length - 1); i >= length; i--) {
                    addItemWorkspaceWorkAnalysisContentsAnalysis(menuNumber, partInfo[i]);
                    indexes = indexes.remove(indexes[i]);
                }
    
                contents_analysis_items.setAttribute("indexes", indexes.join(","));
            }
        }
    }
}
window.addEventListener("scroll", checkWorkspaceWorkAnalysisContentsAnalysisMoreLoad);
window.addEventListener("resize", checkWorkspaceWorkAnalysisContentsAnalysisMoreLoad);
window.addEventListener("focus", checkWorkspaceWorkAnalysisContentsAnalysisMoreLoad);