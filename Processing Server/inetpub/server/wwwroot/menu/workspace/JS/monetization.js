

function workspaceMonetizationLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let info = JSON.parse(contents.getElementsByClassName("info")[0].innerHTML);

    let monetization_top = contents.getElementsByClassName("menu_workspace_monetization_top")[0];
    monetization_top.innerHTML = getLanguage("menu_workspace_monetization_title");
    
    let remittance_details_right_title = contents.getElementsByClassName("menu_workspace_monetization_bank_remittance_details_right_title")[0];
    remittance_details_right_title.innerHTML = getLanguage("menu_workspace_monetization_bank_remittance_details_title");

    let remittance_details_right_item = contents.getElementsByClassName("menu_workspace_monetization_bank_remittance_details_right_item");
    remittance_details_right_item[0].getElementsByTagName("span")[0].innerHTML = getLanguage("menu_workspace_monetization_bank_remittance_details_button:edit");
    remittance_details_right_item[1].getElementsByTagName("span")[0].innerHTML = getLanguage("menu_workspace_monetization_bank_remittance_details_button:delete");

    let remittance_details_right_description = contents.getElementsByClassName("menu_workspace_monetization_bank_remittance_details_right_description")[0];
    if (info["remittanceInfo"] == null) {
        remittance_details_right_description.innerHTML = getLanguage("menu_workspace_monetization_bank_remittance_details_not_info");
        remittance_details_right_item[1].classList.add("menu_workspace_monetization_bank_remittance_details_right_item_disabled");
    } else {
        let country = info["remittanceInfo"]["country"];
        let bankCode = info["remittanceInfo"]["bankCode"];
        let bankAccountNumber = info["remittanceInfo"]["bankAccountNumber"];
        let countryIcon = `<img src = "/SVG/country/` + country + `.svg" onload = "imageLoad(event);" alt = "">`;
        remittance_details_right_description.innerHTML = (countryIcon + getLanguage(country + "_bank:" + bankCode) + " - " + bankAccountNumber);
    }

    let graph_title = contents.getElementsByClassName("menu_workspace_monetization_graph_title")[0];
    graph_title.innerHTML = getLanguage("menu_workspace_monetization_analysis_title");

    //분석 데이터
    let analysisInfo = info["analysisInfo"];

    //분석 데이터 처리 중
    let graph_wrap = contents.getElementsByClassName("menu_workspace_monetization_graph_wrap")[0];
    let analysis_processing = contents.getElementsByClassName("menu_workspace_monetization_analysis_processing")[0];
    let monetization_graph = contents.getElementsByClassName("menu_workspace_monetization_graph")[0];
    if (analysisInfo["byDate"].length < 2) {
        analysis_processing.style.display = null;
        monetization_graph.style.display = "none";
        monetization_graph.textContent = "";
        graph_wrap.style.paddingBottom = "0px";
    }

    //처리 중
    let processing_title = contents.getElementsByClassName("menu_workspace_monetization_analysis_processing_title")[0];
    let processing_description = contents.getElementsByClassName("menu_workspace_monetization_analysis_processing_description")[0];
    processing_title.innerHTML = getLanguage("menu_workspace_monetization_analysis_not_data:title");
    processing_description.innerHTML = getLanguage("menu_workspace_monetization_analysis_not_data:description");

    let monetization_ready_title = contents.getElementsByClassName("menu_workspace_monetization_ready_title")[0];
    monetization_ready_title.innerHTML = getLanguage("menu_workspace_monetization_ready_title");
    let monetization_ready_description = contents.getElementsByClassName("menu_workspace_monetization_ready_description")[0];
    monetization_ready_description.innerHTML = getLanguage("menu_workspace_monetization_ready_description");

    //그래프 고유 번호 설정
    let graph = contents.getElementsByClassName("graph");
    for (let i = 0; i < graph.length; i++) {
        let uniqueNumber = Math.floor(Math.random() * 999999999999);
        graph[i].setAttribute("data-type", uniqueNumber);
    }

    let ready_item = contents.getElementsByClassName("menu_workspace_monetization_ready_item");
    let right_status = contents.getElementsByClassName("menu_workspace_monetization_ready_item_right_status");
    let ready_item_left = contents.getElementsByClassName("menu_workspace_monetization_ready_item_left");
    let ready_item_right_title = contents.getElementsByClassName("menu_workspace_monetization_ready_item_right_title");
    let ready_item_right_description = contents.getElementsByClassName("menu_workspace_monetization_ready_item_right_description");
    let ready_item_right_button = contents.getElementsByClassName("menu_workspace_monetization_ready_item_right_button");

    let isRequestApproval = true;

    //크리에이터 가이드 검토 여부
    if (info["isCreatorGuideReview"] == true) {
        ready_item[0].classList.add("menu_workspace_monetization_ready_item_complete");
        right_status[0].innerHTML = getLanguage("menu_workspace_monetization_ready_item_top:1");
        ready_item_left[0].innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>`;
    } else {
        right_status[0].innerHTML = getLanguage("menu_workspace_monetization_ready_item_top:0");
        ready_item_left[0].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-215,50a24.843,24.843,0,0,1-9.731-1.965,24.918,24.918,0,0,1-7.947-5.358,24.918,24.918,0,0,1-5.358-7.947A24.843,24.843,0,0,1-240,25a24.843,24.843,0,0,1,1.965-9.731,24.918,24.918,0,0,1,5.358-7.947,24.918,24.918,0,0,1,7.947-5.358A24.843,24.843,0,0,1-215,0a24.843,24.843,0,0,1,9.731,1.965,24.918,24.918,0,0,1,7.947,5.358,24.918,24.918,0,0,1,5.358,7.947A24.843,24.843,0,0,1-190,25a24.843,24.843,0,0,1-1.965,9.731,24.918,24.918,0,0,1-5.358,7.947,24.918,24.918,0,0,1-7.947,5.358A24.843,24.843,0,0,1-215,50Zm0-47a22.025,22.025,0,0,0-22,22,22.025,22.025,0,0,0,22,22,22.025,22.025,0,0,0,22-22A22.025,22.025,0,0,0-215,3Z" transform="translate(240)"/><circle cx="2" cy="2" r="2" transform="translate(23 9)"/><rect width="4" height="24" rx="2" transform="translate(23 18)"/></g></svg>`;

        isRequestApproval = false;
    }
    ready_item_right_title[0].innerHTML = getLanguage("menu_workspace_monetization_ready_item:0:title");
    ready_item_right_description[0].innerHTML = getLanguage("menu_workspace_monetization_ready_item:0:description");
    ready_item_right_button[0].getElementsByTagName("span")[0].innerHTML = getLanguage("menu_workspace_monetization_ready_item:0:button");

    //송금 세부 정보 등록 여부
    if (info["remittanceInfo"] != null) {
        ready_item[1].classList.add("menu_workspace_monetization_ready_item_complete");
        right_status[1].innerHTML = getLanguage("menu_workspace_monetization_ready_item_top:1");
        ready_item_left[1].innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>`;
    } else {
        right_status[1].innerHTML = getLanguage("menu_workspace_monetization_ready_item_top:0");
        ready_item_left[1].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-215,50a24.843,24.843,0,0,1-9.731-1.965,24.918,24.918,0,0,1-7.947-5.358,24.918,24.918,0,0,1-5.358-7.947A24.843,24.843,0,0,1-240,25a24.843,24.843,0,0,1,1.965-9.731,24.918,24.918,0,0,1,5.358-7.947,24.918,24.918,0,0,1,7.947-5.358A24.843,24.843,0,0,1-215,0a24.843,24.843,0,0,1,9.731,1.965,24.918,24.918,0,0,1,7.947,5.358,24.918,24.918,0,0,1,5.358,7.947A24.843,24.843,0,0,1-190,25a24.843,24.843,0,0,1-1.965,9.731,24.918,24.918,0,0,1-5.358,7.947,24.918,24.918,0,0,1-7.947,5.358A24.843,24.843,0,0,1-215,50Zm0-47a22.025,22.025,0,0,0-22,22,22.025,22.025,0,0,0,22,22,22.025,22.025,0,0,0,22-22A22.025,22.025,0,0,0-215,3Z" transform="translate(240)"/><circle cx="2" cy="2" r="2" transform="translate(23 9)"/><rect width="4" height="24" rx="2" transform="translate(23 18)"/></g></svg>`;
    
        isRequestApproval = false;
    }
    ready_item_right_title[1].innerHTML = getLanguage("menu_workspace_monetization_ready_item:1:title");
    ready_item_right_description[1].innerHTML = getLanguage("menu_workspace_monetization_ready_item:1:description");
    ready_item_right_button[1].getElementsByTagName("span")[0].innerHTML = getLanguage("menu_workspace_monetization_ready_item:1:button");

    //작품 정보
    let contents_top_item = contents.getElementsByClassName("menu_workspace_monetization_contents_top_item");
    contents_top_item[0].innerHTML = getLanguage("menu_workspace_monetization_works_top:0");
    contents_top_item[1].innerHTML = getLanguage("menu_workspace_monetization_works_top:1");
    contents_top_item[2].innerHTML = getLanguage("menu_workspace_monetization_works_top:2");

    //현재 시간
    let newDate = new Date();

    let monetized = false;
    let wrap_works = contents.getElementsByClassName("menu_workspace_monetization_wrap_works")[0];
    let worksInfo = info["worksInfo"];
    if (worksInfo.length == 0) {
        wrap_works.style.display = "none";
        graph_wrap.style.display = "none";
    } else {
        let contents_items = contents.getElementsByClassName("menu_workspace_monetization_contents_items")[0];
        
        for (let i = 0; i < worksInfo.length; i++) {
            let workInfo = worksInfo[i];

            let line = "";
            if (i != 0) {
                line = `
                    <div class = "menu_workspace_monetization_contents_lines">
                        <div class = \"menu_workspace_monetization_contents_line\"></div>
                    </div>
                `;
            }

            let addClassStatus0 = "";
            if (isRequestApproval == false) {
                addClassStatus0 = " menu_workspace_monetization_contents_item_status_0_disabled";
            }

            let status = 0;
            if (workInfo["awaitingReview"] != null && (workInfo["awaitingReview"] == true || workInfo["awaitingReview"] == "true")) {
                status = 1;
            }
            if (workInfo["monetized"] != null && (workInfo["monetized"] == true || workInfo["monetized"] == "true")) {
                status = 2;
                monetized = true;
            }

            let monetizationDate = getLanguage("menu_workspace_monetization_works_revenue_not_data");
            if (workInfo["monetizationDate"] != null) {
                let date = new Date(workInfo["monetizationDate"]);
                monetizationDate = "UTC: " + date.getFullYear() + ". " + (date.getMonth() + 1) + ". " + date.getDate() + ".";
                monetizationDate += " ~ " + newDate.getUTCFullYear() + ". " + (newDate.getUTCMonth() + 1) + ". " + newDate.getUTCDate() + ".";
            }

            let expectedRevenue = 0;
            for (let i = 0; i < analysisInfo["expectedRevenue"].length; i++) {
                if (analysisInfo["expectedRevenue"][i]["number"] == workInfo["number"]) {
                    expectedRevenue = analysisInfo["expectedRevenue"][i]["value"];
                    break;
                }
            }

            newEl = document.createElement("div");
            newEl.classList.add("visible_element");
            newEl.classList.add("variable_element");
            newEl.setAttribute("number", workInfo["number"]);
            newEl.innerHTML = `
                ` + line + `
                <div class = "menu_workspace_monetization_contents_item">
                    <div class = "menu_workspace_monetization_contents_item_work">
                        <div class = "menu_workspace_monetization_contents_item_work_left img_wrap">
                            <img src = "` + workInfo["cover_image"] + `" onload = "imageLoad(event);" alt = "">
                        </div>
                        <div class = "menu_workspace_monetization_contents_item_work_right">
                            <div class = "menu_workspace_monetization_contents_item_work_right_title">
                                ` + workInfo["title"] + `
                            </div>
                            <div class = "menu_workspace_monetization_contents_item_work_right_description">
                                ` + workInfo["description"] + `
                            </div>
                        </div>
                    </div>
                    <div class = "menu_workspace_monetization_contents_item_revenue">
                        <div class = "menu_workspace_monetization_contents_item_revenue_title">
                            ` + ("$" + expectedRevenue.toFixed(2) + " USD") + `
                        </div>
                        <div class = "menu_workspace_monetization_contents_item_revenue_description">
                            ` + monetizationDate + `
                        </div>
                    </div>
                    <div class = "menu_workspace_monetization_contents_item_status" status = "` + status + `">
                        <div class = "menu_workspace_monetization_contents_item_status_0 md-ripples` + addClassStatus0 + `" onclick = "workspaceMonetizationMonetizationApprovalButton(` + menuNumber + `, ` + workInfo["number"] + `);">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-4.438,42.27v0L.4,28.587,21.847,7.145a2.12,2.12,0,0,1,1.506-.632,1.945,1.945,0,0,1,1.387.567l7.071,7.071a1.944,1.944,0,0,1,.567,1.433,2.125,2.125,0,0,1-.632,1.459L10.3,38.487-4.436,42.27ZM23.387,9.839h0L3.162,30.064-.327,38.621l9.154-2.892L29.052,15.5,23.387,9.839Z" transform="translate(5.102 6.536)"></path><path d="M28.7,19.1a1.987,1.987,0,0,1-1.414-.586l-7.071-7.071a2,2,0,0,1,0-2.828l6.368-6.368a2,2,0,0,1,2.829,0l7.071,7.071a2,2,0,0,1,0,2.828L30.116,18.51A1.987,1.987,0,0,1,28.7,19.1ZM27.995,5.067h0l-4.95,4.95,5.666,5.665,4.95-4.949L27.995,5.067Z" transform="translate(12.102 -0.464)"></path></g></svg>
                            <div class = "menu_workspace_monetization_contents_item_status_0_text">
                                ` + getLanguage("menu_workspace_monetization_works_button:0") + `
                            </div>
                        </div>
                        <div class = "menu_workspace_monetization_contents_item_status_1">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M2,0A1.828,1.828,0,0,1,4,1.583V11.87c0,.874-4,0-4,0V1.583A1.828,1.828,0,0,1,2,0Z" transform="translate(34.785 31.957) rotate(135)"/><path d="M-3095,50a24.844,24.844,0,0,1-9.731-1.965,24.917,24.917,0,0,1-7.947-5.358,24.922,24.922,0,0,1-5.358-7.947A24.845,24.845,0,0,1-3120,25a24.845,24.845,0,0,1,1.965-9.731,24.922,24.922,0,0,1,5.358-7.947,24.917,24.917,0,0,1,7.947-5.358A24.844,24.844,0,0,1-3095,0a24.844,24.844,0,0,1,9.731,1.965,24.917,24.917,0,0,1,7.947,5.358,24.922,24.922,0,0,1,5.358,7.947A24.84,24.84,0,0,1-3070,25a24.84,24.84,0,0,1-1.965,9.731,24.922,24.922,0,0,1-5.358,7.947,24.917,24.917,0,0,1-7.947,5.358A24.844,24.844,0,0,1-3095,50Zm0-46a21.024,21.024,0,0,0-21,21,21.023,21.023,0,0,0,21,21,21.024,21.024,0,0,0,21-21A21.024,21.024,0,0,0-3095,4Z" transform="translate(3120)"/><rect width="4" height="16" rx="2" transform="translate(23 11)"/></g></svg>
                            <div class = "menu_workspace_monetization_contents_item_status_1_text">
                                ` + getLanguage("menu_workspace_monetization_works_button:1") + `
                            </div>
                        </div>
                        <div class = "menu_workspace_monetization_contents_item_status_2">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                            <div class = "menu_workspace_monetization_contents_item_status_2_text">
                                ` + getLanguage("menu_workspace_monetization_works_button:2") + `
                            </div>
                        </div>
                    </div>
                </div>
            `;
            contents_items.appendChild(newEl);
        }
    }

    //수익 창출을 승인 받은지 여부
    if (monetized == true) {
        ready_item[2].classList.add("menu_workspace_monetization_ready_item_complete");
        right_status[2].innerHTML = getLanguage("menu_workspace_monetization_ready_item_top:1");
        ready_item_left[2].innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>`;
    } else {
        right_status[2].innerHTML = getLanguage("menu_workspace_monetization_ready_item_top:0");
        ready_item_left[2].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-215,50a24.843,24.843,0,0,1-9.731-1.965,24.918,24.918,0,0,1-7.947-5.358,24.918,24.918,0,0,1-5.358-7.947A24.843,24.843,0,0,1-240,25a24.843,24.843,0,0,1,1.965-9.731,24.918,24.918,0,0,1,5.358-7.947,24.918,24.918,0,0,1,7.947-5.358A24.843,24.843,0,0,1-215,0a24.843,24.843,0,0,1,9.731,1.965,24.918,24.918,0,0,1,7.947,5.358,24.918,24.918,0,0,1,5.358,7.947A24.843,24.843,0,0,1-190,25a24.843,24.843,0,0,1-1.965,9.731,24.918,24.918,0,0,1-5.358,7.947,24.918,24.918,0,0,1-7.947,5.358A24.843,24.843,0,0,1-215,50Zm0-47a22.025,22.025,0,0,0-22,22,22.025,22.025,0,0,0,22,22,22.025,22.025,0,0,0,22-22A22.025,22.025,0,0,0-215,3Z" transform="translate(240)"/><circle cx="2" cy="2" r="2" transform="translate(23 9)"/><rect width="4" height="24" rx="2" transform="translate(23 18)"/></g></svg>`;
    }
    ready_item_right_title[2].innerHTML = getLanguage("menu_workspace_monetization_ready_item:2:title");
    ready_item_right_description[2].innerHTML = getLanguage("menu_workspace_monetization_ready_item:2:description");
    ready_item_right_button[2].getElementsByTagName("span")[0].innerHTML = getLanguage("menu_workspace_monetization_ready_item:2:button");

    let statusBarItemAddClass = "";
    let statusBarItemIconText = "";
    if (isRequestApproval == true && monetized == true) {
        statusBarItemIconText = `
            <!-- Generated by IcoMoon.io -->
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
            ` + getLanguage("menu_workspace_monetization_top:0:monetizing") + `
        `;
        statusBarItemAddClass = " menu_workspace_monetization_status_bar_item_activate";
    } else {
        statusBarItemIconText = `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-4.438,42.27v0L.4,28.587,21.847,7.145a2.12,2.12,0,0,1,1.506-.632,1.945,1.945,0,0,1,1.387.567l7.071,7.071a1.944,1.944,0,0,1,.567,1.433,2.125,2.125,0,0,1-.632,1.459L10.3,38.487-4.436,42.27ZM23.387,9.839h0L3.162,30.064-.327,38.621l9.154-2.892L29.052,15.5,23.387,9.839Z" transform="translate(5.102 6.536)"></path><path d="M28.7,19.1a1.987,1.987,0,0,1-1.414-.586l-7.071-7.071a2,2,0,0,1,0-2.828l6.368-6.368a2,2,0,0,1,2.829,0l7.071,7.071a2,2,0,0,1,0,2.828L30.116,18.51A1.987,1.987,0,0,1,28.7,19.1ZM27.995,5.067h0l-4.95,4.95,5.666,5.665,4.95-4.949L27.995,5.067Z" transform="translate(12.102 -0.464)"></path></g></svg>
            ` + getLanguage("menu_workspace_monetization_top:0:need_fix") + `
        `;
    }

    let monetization_status_bar = contents.getElementsByClassName("menu_workspace_monetization_status_bar")[0];
    monetization_status_bar.innerHTML = `
        <div class = "menu_workspace_monetization_status_bar_item` + statusBarItemAddClass + `">
            ` + statusBarItemIconText + `
        </div>
        <div class = "menu_workspace_monetization_status_bar_item">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M38,26H3a3,3,0,0,1-3-3V2A3,3,0,0,1,3-1H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26ZM3.1,2.105V22.9H37.9V2.105Z" transform="translate(1 8.5)"></path><ellipse cx="4" cy="3.939" rx="4" ry="3.939" transform="translate(17.5 17.123)"></ellipse><path d="M38,26H3a3,3,0,0,1-3-3V22.9H37.9V0H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26Z" transform="translate(8 15.5)"></path></g></svg>
            ` + getLanguage("menu_workspace_monetization_top:1").replaceAll("{R:0}", "<b style = \"margin-left: 5px;\">$" + info["revenue"].toFixed(2) + " USD</b>") + `
        </div>
        <div class = "menu_workspace_monetization_status_bar_item">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M38,26H3a3,3,0,0,1-3-3V2A3,3,0,0,1,3-1H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26ZM3.1,2.105V22.9H37.9V2.105Z" transform="translate(1 8.5)"></path><ellipse cx="4" cy="3.939" rx="4" ry="3.939" transform="translate(17.5 17.123)"></ellipse><path d="M38,26H3a3,3,0,0,1-3-3V22.9H37.9V0H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26Z" transform="translate(8 15.5)"></path></g></svg>
            ` + getLanguage("menu_workspace_monetization_top:2").replaceAll("{R:0}", "<b style = \"margin-left: 5px;\">$" + info["remittedRevenue"].toFixed(2) + " USD</b>") + `
        </div>
    `;

    //
    if (isRequestApproval == true && monetized == true) {
        let ready_wrap = contents.getElementsByClassName("menu_workspace_monetization_ready_wrap")[0];
        ready_wrap.remove();
    }

    //지급 기준액
    let paymentThreshold = 10;
    let paymentThresholdPercent = (info["revenue"] / paymentThreshold);
    (paymentThresholdPercent > 1) ? paymentThresholdPercent = 1 : null;
    let paymentThresholdTitle = contents.getElementsByClassName("menu_workspace_monetization_payment_threshold_left_title")[0];
    paymentThresholdTitle.innerHTML = getLanguage("menu_workspace_monetization_payment_threshold:title");
    let paymentThresholdDescription = contents.getElementsByClassName("menu_workspace_monetization_payment_threshold_left_description")[0];
    paymentThresholdDescription.innerHTML = getLanguage("menu_workspace_monetization_payment_threshold:description").replaceAll("{R:0}", ("$" + paymentThreshold.toFixed(2) + " USD"));
    let paymentThresholdProgressLine = contents.getElementsByClassName("menu_workspace_monetization_payment_threshold_left_progress_line")[0];
    paymentThresholdProgressLine.style.width = ((paymentThresholdPercent * 100) + "%");
    let paymentThresholdBottomLeft = contents.getElementsByClassName("menu_workspace_monetization_payment_threshold_left_bottom_left")[0];
    paymentThresholdBottomLeft.innerHTML = getLanguage("menu_workspace_monetization_payment_threshold:bottom:left").replaceAll("{R:0}", Math.round(paymentThresholdPercent * 100));
    let paymentThresholdBottomRight = contents.getElementsByClassName("menu_workspace_monetization_payment_threshold_left_bottom_right")[0];
    paymentThresholdBottomRight.innerHTML = getLanguage("menu_workspace_monetization_payment_threshold:bottom:right").replaceAll("{R:0}", ("$" + paymentThreshold.toFixed(2) + " USD"));
    let paymentThresholdRight = contents.getElementsByClassName("menu_workspace_monetization_payment_threshold_right")[0];
    paymentThresholdRight.innerHTML = ("$" + info["revenue"].toFixed(2) + " USD");

    workspaceMonetizationGraphLoad(menuNumber);
}

function workspaceMonetizationGraphLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    if (contents.getElementsByClassName("menu_workspace_monetization_graph")[0].getElementsByClassName("graph").length != 0) {
        let graphUniqueNumber = contents.getElementsByClassName("menu_workspace_monetization_graph")[0].getElementsByClassName("graph")[0].getAttribute("data-type");
        let analysisInfo = JSON.parse(contents.getElementsByClassName("info")[0].innerHTML)["analysisInfo"];
        let byDate = analysisInfo["byDate"];

        //그래프 데이터
        let startDate = null;
        let graphData = new Array();
        for (let i = 0; i < byDate.length; i++) {
            let value = 0;
            let displayValue = 0;
    
            //예상 수익
            let expectedRevenue = Number.parseFloat(byDate[i]["expectedRevenue"]);
            value = Math.round(expectedRevenue);
            displayValue = ("$" + expectedRevenue.toFixed(2) + " USD");
    
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



























function deleteworkspaceMonetizationBankRemittanceDetails(menuNumber) {
    confirmPopup(getLanguage("confirm_popup_title:delete"), getLanguage("confirm_popup_subject:delete"), 'requestDeleteworkspaceMonetizationBankRemittanceDetails(' + menuNumber + ');');
}

function requestDeleteworkspaceMonetizationBankRemittanceDetails(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let deleteButton = contents.getElementsByClassName("menu_workspace_monetization_bank_remittance_details_right_item")[1];
    let description = contents.getElementsByClassName("menu_workspace_monetization_bank_remittance_details_right_description")[0];

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/menu/workspace/php/monetization/delete_remittance_info.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText.trim();

                description.innerHTML = getLanguage("menu_workspace_monetization_bank_remittance_details_not_info");
                deleteButton.classList.add("menu_workspace_monetization_bank_remittance_details_right_item_disabled");
                actionMessage(getLanguage("bank_remittance_details_delete_message"));
            } else {
                if (status == 504) {
                    //시간 초과
                    serverResponseErrorMessage(0);
                } else {
                    //오류 발생
                    serverResponseErrorMessage(1);
                }
            }
            loadingComplete();
        }
    });

    var formData = new FormData();
    xhr.send(formData);
}
































function workspaceMonetizationMonetizationApprovalButton(menuNumber, workNumber) {
    confirmPopup(getLanguage("menu_workspace_monetization_works_monetization_approval_confirm_popup:title"), getLanguage("menu_workspace_monetization_works_monetization_approval_confirm_popup:description"), 'requestWorkspaceMonetizationMonetizationApprovalButton(' + menuNumber + ', ' + workNumber + ');');
}
function requestWorkspaceMonetizationMonetizationApprovalButton(menuNumber, workNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("menu_workspace_monetization_contents_items")[0];
    let child = items.children;
    let item = null;
    for (let i = 0; i < child.length; i++) {
        if (child[i].getAttribute("number") == workNumber) {
            item = child[i];
            break;
        }
    }

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/work/monetization_approval.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText.trim();
                
                if (xhrHtml == "condition not met") {
                    actionMessage(getLanguage("menu_workspace_monetization_works_monetization_approval_message:1"));
                } else {
                    actionMessage(getLanguage("menu_workspace_monetization_works_monetization_approval_message:0"));

                    let status = item.getElementsByClassName("menu_workspace_monetization_contents_item_status")[0];
                    status.setAttribute("status", 1);
                }
            } else {
                if (status == 504) {
                    //시간 초과
                    serverResponseErrorMessage(0);
                } else {
                    //오류 발생
                    serverResponseErrorMessage(1);
                }
            }
            loadingComplete();
        }
    });
    
    var formData = new FormData();
    formData.append("workNumber", workNumber);

    xhr.send(formData);
}








































function workspaceMonetizationRevenueRequestButton(menuNumber, number) {
    confirmPopup(getLanguage("menu_workspace_monetization_history_item_request_confirm_popup:title"), getLanguage("menu_workspace_monetization_history_item_request_confirm_popup:description"), 'requestWorkspaceRevenueRequest(' + menuNumber + ', ' + number + ');');
}
function requestWorkspaceRevenueRequest(menuNumber, number) {
    let contents = document.getElementById("contents_" + menuNumber);

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/menu/workspace/php/monetization/revenue_request.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText.trim();
                
                if (xhrHtml == "expired") {
                    actionMessage(getLanguage("menu_workspace_monetization_history_item_request_message:1"));
                } else if (xhrHtml == "error") {
                    actionMessage(getLanguage("menu_workspace_monetization_history_item_request_message:2"));
                } else if (xhrHtml == "done") {
                    actionMessage(getLanguage("menu_workspace_monetization_history_item_request_message:0"));
                }
            } else {
                if (status == 504) {
                    //시간 초과
                    serverResponseErrorMessage(0);
                } else {
                    //오류 발생
                    serverResponseErrorMessage(1);
                }
            }
            loadingComplete();
        }
    });
    
    var formData = new FormData();
    formData.append("number", number);

    xhr.send(formData);
}