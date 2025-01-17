

var adminWorkReportLoadNumbers = new Array();

function menuAdminWorkReportLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let workReportInfo = JSON.parse(contents.getElementsByClassName("work_report_info")[0].innerHTML);

    let numbers = workReportInfo["numbers"].split(",");
    let info = workReportInfo["info"];

    //번호들 변수에 등록
    adminWorkReportLoadNumbers[menuNumber] = numbers;

    if (info != null && info.length != 0) {
        for (let i = 0; i < info.length; i++) {
            addItemAdminWorkReport(menuNumber, info[i]);
    
            let array = adminWorkReportLoadNumbers[menuNumber];
            array = array.remove("" + info[i]["number"]);
            adminWorkReportLoadNumbers[menuNumber] = array;
        }
        checkAdminWorkReportMoreLoading(menuNumber);
    } else {
        noDataAdminWorkReport(menuNumber);
    }

    let sort_box_title = contents.getElementsByClassName("sort_box_title");
    sort_box_title[0].innerHTML = getLanguage("menu_admin_work_report_sort:0");
    sort_box_title[1].innerHTML = getLanguage("language:select_item:all");

    //데이터 없음
    let no_data = contents.getElementsByClassName("menu_admin_work_report_no_data")[0];
    no_data.getElementsByClassName("menu_admin_work_report_no_data_title")[0].innerHTML = getLanguage("menu_admin_work_report_no_data");
    no_data.getElementsByClassName("menu_admin_work_report_no_data_description")[0].innerHTML = getLanguage("no_data_description");

    let work_report_title = contents.getElementsByClassName("menu_admin_work_report_title")[0];
    work_report_title.innerHTML = getLanguage("menu_admin_work_report_title");
}

function noDataAdminWorkReport(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let no_data = contents.getElementsByClassName("menu_admin_work_report_no_data")[0];
    no_data.style.display = "flex";
}

function addItemAdminWorkReport(menuNumber, info) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("menu_admin_work_report_items")[0];

    let no_data = contents.getElementsByClassName("menu_admin_work_report_no_data")[0];
    no_data.style.display = "none";

    let description = "";
    //신고자 피셜
    let maxReason = -1;
    let maxReasonText = null;
    let reason = info["reason"];
    for (const [key, value] of Object.entries(reason)) {
        if (maxReason < value) {
            maxReasonText = key;
            maxReason = value;
        }
    }
    let reasonNumber = Number.parseInt(maxReasonText.replaceAll("reason_", ""));

    if (reasonNumber == 4) {
        description += getLanguage("menu_admin_work_report_item_description:1");
    } else {
        description += getLanguage("menu_admin_work_report_item_description:0").replaceAll("{R:0}", "<b style = \"color: var(--site-color-light);\">" + getLanguage("popup_work_report_item_title:" + reasonNumber) + "</b>");
    }
    //일관성 여부
    let consistency = true;
    let maxTwoReason = -1;
    for (const [key, value] of Object.entries(reason)) {
        if (maxTwoReason < value && maxReasonText != key) {
            maxTwoReason = value;
        }
    }

    //신고자가 10명 이상일 경우
    if (info["count"] >= 10) {
        let total = (maxReason + maxTwoReason);
        let percent = 1 - ((maxReason - maxTwoReason) / total);

        if (percent > 0.5) { //신고자의 50% 이상이 서로 다른 의견일 경우
            description += "<br />" + getLanguage("menu_admin_work_report_item_description:2") + " ";
            consistency = false;
        }
    }

    //
    if (consistency == true) {
        description += "<br />";
    }
    description += getLanguage("menu_admin_work_report_item_description:3");

    //방문하기
    let visit = "loadMenu_work(" + info["workInfo"]["number"] + ");";

    let title = "";
    if (info["workInfo"]["status"] == 0) {
        title = info["workInfo"]["title"];
    } else if (info["workInfo"]["status"] == 1) {
        title = getLanguage("work_title_no_permission");
    } else if (info["workInfo"]["status"] == 2) {
        title = getLanguage("work_title_deleted");
    }

    let icon = "";
    if (info["workInfo"]["contents_type"] == 0) {
        icon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M46,50H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0H30V3H5A2,2,0,0,0,3,5V45a2,2,0,0,0,2,2H45a2,2,0,0,0,2-2V20h3V46A4.005,4.005,0,0,1,46,50Z" transform="translate(0)"></path><path d="M6.364,28.182h0L0,21.818l20.4-20.4a2,2,0,0,1,2.829,0L26.768,4.95a2,2,0,0,1,0,2.828l-20.4,20.4ZM21.869,4.191h0L4.191,21.869,6.313,23.99,23.99,6.313,21.869,4.191Z" transform="translate(21.818)"></path><path d="M4.5,0C6.75,0,9,8,9,8H0S2.25,0,4.5,0Z" transform="translate(22.587 33.779) rotate(-135)"></path></g></svg>';
    } else {
        icon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M46,50H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0H46a4,4,0,0,1,4,4V46A4.005,4.005,0,0,1,46,50ZM5,3A2,2,0,0,0,3,5V45a2,2,0,0,0,2,2H45a2,2,0,0,0,2-2V5a2,2,0,0,0-2-2Z"></path><rect width="3" height="25" rx="1.5" transform="translate(19.278 28.71) rotate(45)"></rect><rect width="3" height="14.85" rx="1.5" transform="translate(17.727 30.831) rotate(-45)"></rect><rect width="3" height="20.943" rx="1.5" transform="translate(37.002 21.694) rotate(30)"></rect><rect width="3" height="25" rx="1.5" transform="translate(35.451 23.194) rotate(-30)"></rect><path d="M8.5,17A8.5,8.5,0,1,1,17,8.5,8.51,8.51,0,0,1,8.5,17Zm0-14A5.5,5.5,0,1,0,14,8.5,5.506,5.506,0,0,0,8.5,3Z" transform="translate(10 8)"></path></g></svg>';
    }

    let coverImage = "";
    let itemLeftAddClass = "";
    let imageLoad = "";
    if (info["workInfo"]["status"] == 0) {
        itemLeftAddClass = " img_wrap";
        coverImage = info["workInfo"]["cover_image"];
        imageLoad = "imageLoad(event);";
    }

    let newEl = document.createElement("div");
    newEl.setAttribute("number", info["number"]);
    newEl.classList.add("visible_element");
    newEl.classList.add("variable_element");
    newEl.classList.add("menu_admin_work_report_item");
    newEl.innerHTML = `
        <div class = "menu_admin_work_report_item_left` + itemLeftAddClass + `">
            <img src = "` + coverImage + `" onload = "` + imageLoad + `" alt = "">
        </div>
        <div class = "menu_admin_work_report_item_right">
            <div class = "menu_admin_work_report_item_right_title">
                ` + title + `
            </div>
            <div class = "menu_admin_work_report_item_right_profile">
                <div class = "menu_admin_work_report_item_right_profile_left">
                    <div class = "profile_element">
                        <div class = "profile_info">` + JSON.stringify(info["workInfo"]["originator"]["profile"]) + `</div>
                        <div class = "profile_image"></div>
                    </div>
                </div>
                <div class = "menu_admin_work_report_item_right_profile_nickname">
                    ` + info["workInfo"]["originator"]["nickname"] + `
                </div>
            </div>
            <div class = "menu_admin_work_report_item_right_top_items">
                <div class = "menu_admin_work_report_item_right_top_item">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5" transform="translate(9)"></rect><path d="M13.422,25.422s6.941-3.318,12.163-3.086,17.81,4.641,17.81,4.641V9.456S27.963,4,24.656,3.945s-9.456,2.9-9.456,2.9L13.422,4.235S18.913.754,24.25,1.1,43.395,6.15,43.395,6.15h3.249V30.806L25.584,25.422S18.391,25.816,15.2,27.9Z" transform="translate(-0.449)"></path></g></svg>
                    ` + getLanguage("menu_admin_work_report_item_top:0").replaceAll("{R:0}", commas(info["count"])) + `
                </div>
                <div class = "menu_admin_work_report_item_right_top_item">
                    ` + icon + `
                    ` + getLanguage("work_settings_contents_type:" + info["workInfo"]["contents_type"]) + `
                </div>
            </div>
            <div class = "menu_admin_work_report_item_right_line"></div>
            <div class = "menu_admin_work_report_item_right_description">
                ` + description + `
            </div>
            <div class = "menu_admin_work_report_item_right_line"></div>
            <div class = "menu_admin_work_report_item_right_checkbox_items">
                <div class = "menu_admin_work_report_item_right_checkbox_item md-ripples menu_admin_work_report_item_right_checkbox_item_checked" onclick = "setOrderCheckboxAdminWorkReport(` + menuNumber + `, ` + info["number"] + `, 0);">
                    <div class="menu_admin_work_report_item_right_checkbox_item_left">
                        <div class="menu_admin_work_report_item_right_checkbox_item_left_in"></div>
                    </div>
                    <div class="menu_admin_work_report_item_right_checkbox_item_right">
                        <div class="menu_admin_work_report_item_right_checkbox_item_right_title">
                            ` + getLanguage("menu_admin_work_report_item_title:not_applicable") + `
                        </div>
                    </div>
                </div>
                <div class = "menu_admin_work_report_item_right_checkbox_item md-ripples" onclick = "setOrderCheckboxAdminWorkReport(` + menuNumber + `, ` + info["number"] + `, 1);">
                    <div class="menu_admin_work_report_item_right_checkbox_item_left">
                        <div class="menu_admin_work_report_item_right_checkbox_item_left_in"></div>
                    </div>
                    <div class="menu_admin_work_report_item_right_checkbox_item_right">
                        <div class="menu_admin_work_report_item_right_checkbox_item_right_title">
                            ` + getLanguage("popup_work_report_item_title:0") + `
                        </div>
                        <div class = "menu_admin_work_report_item_right_checkbox_item_right_description">
                            ` + getLanguage("menu_admin_work_report_item_checkbox_description:0") + `
                        </div>
                    </div>
                </div>
                <div class = "menu_admin_work_report_item_right_checkbox_item md-ripples" onclick = "setOrderCheckboxAdminWorkReport(` + menuNumber + `, ` + info["number"] + `, 2);">
                    <div class="menu_admin_work_report_item_right_checkbox_item_left">
                        <div class="menu_admin_work_report_item_right_checkbox_item_left_in"></div>
                    </div>
                    <div class="menu_admin_work_report_item_right_checkbox_item_right">
                        <div class="menu_admin_work_report_item_right_checkbox_item_right_title">
                            ` + getLanguage("popup_work_report_item_title:1") + `
                        </div>
                        <div class = "menu_admin_work_report_item_right_checkbox_item_right_description">
                            ` + getLanguage("menu_admin_work_report_item_checkbox_description:0") + `
                        </div>
                    </div>
                </div>
                <div class = "menu_admin_work_report_item_right_checkbox_item md-ripples" onclick = "setOrderCheckboxAdminWorkReport(` + menuNumber + `, ` + info["number"] + `, 3);">
                    <div class="menu_admin_work_report_item_right_checkbox_item_left">
                        <div class="menu_admin_work_report_item_right_checkbox_item_left_in"></div>
                    </div>
                    <div class="menu_admin_work_report_item_right_checkbox_item_right">
                        <div class="menu_admin_work_report_item_right_checkbox_item_right_title">
                            ` + getLanguage("popup_work_report_item_title:2") + `
                        </div>
                        <div class = "menu_admin_work_report_item_right_checkbox_item_right_description">
                            ` + getLanguage("menu_admin_work_report_item_checkbox_description:0") + `
                        </div>
                    </div>
                </div>
                <div class = "menu_admin_work_report_item_right_checkbox_item md-ripples" onclick = "setOrderCheckboxAdminWorkReport(` + menuNumber + `, ` + info["number"] + `, 4);">
                    <div class="menu_admin_work_report_item_right_checkbox_item_left">
                        <div class="menu_admin_work_report_item_right_checkbox_item_left_in"></div>
                    </div>
                    <div class="menu_admin_work_report_item_right_checkbox_item_right">
                        <div class="menu_admin_work_report_item_right_checkbox_item_right_title">
                            ` + getLanguage("popup_work_report_item_title:3") + `
                        </div>
                        <div class = "menu_admin_work_report_item_right_checkbox_item_right_description">
                            ` + getLanguage("menu_admin_work_report_item_checkbox_description:1") + `
                        </div>
                    </div>
                </div>
            </div>
            <div class = "menu_admin_work_report_item_right_button_items">
                <div class = "menu_admin_work_report_item_right_button md-ripples" onclick = "` + visit + `">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.199 13.599c0.992 1.327 2.43 2.126 3.948 2.345s3.123-0.142 4.45-1.134c0.239-0.179 0.465-0.375 0.655-0.568l2.995-2.995c1.163-1.204 1.722-2.751 1.696-4.285s-0.639-3.061-1.831-4.211c-1.172-1.132-2.688-1.692-4.199-1.683-1.492 0.008-2.984 0.571-4.137 1.683l-1.731 1.721c-0.392 0.389-0.394 1.023-0.004 1.414s1.023 0.394 1.414 0.004l1.709-1.699c0.77-0.742 1.763-1.117 2.76-1.123 1.009-0.006 2.016 0.367 2.798 1.122 0.795 0.768 1.203 1.783 1.221 2.808s-0.355 2.054-1.11 2.836l-3.005 3.005c-0.114 0.116-0.263 0.247-0.428 0.37-0.885 0.662-1.952 0.902-2.967 0.756s-1.971-0.678-2.632-1.563c-0.331-0.442-0.957-0.533-1.4-0.202s-0.533 0.957-0.202 1.4zM14.801 10.401c-0.992-1.327-2.43-2.126-3.948-2.345s-3.124 0.142-4.451 1.134c-0.239 0.179-0.464 0.375-0.655 0.568l-2.995 2.995c-1.163 1.204-1.722 2.751-1.696 4.285s0.639 3.061 1.831 4.211c1.172 1.132 2.688 1.692 4.199 1.683 1.492-0.008 2.984-0.571 4.137-1.683l1.723-1.723c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-1.696 1.698c-0.77 0.742-1.763 1.117-2.76 1.123-1.009 0.006-2.016-0.367-2.798-1.122-0.795-0.768-1.203-1.783-1.221-2.808s0.355-2.054 1.11-2.836l3.005-3.005c0.114-0.116 0.263-0.247 0.428-0.37 0.885-0.662 1.952-0.902 2.967-0.756s1.971 0.678 2.632 1.563c0.331 0.442 0.957 0.533 1.4 0.202s0.533-0.957 0.202-1.4z"></path></svg>
                    ` + getLanguage("menu_admin_work_report_item_visit_button") + `
                </div>
                <div class = "menu_admin_work_report_item_right_button md-ripples" onclick = "submitAdminWorkReportButton(` + menuNumber + `, ` + info["number"] + `);">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-4.438,42.27v0L.4,28.587,21.847,7.145a2.12,2.12,0,0,1,1.506-.632,1.945,1.945,0,0,1,1.387.567l7.071,7.071a1.944,1.944,0,0,1,.567,1.433,2.125,2.125,0,0,1-.632,1.459L10.3,38.487-4.436,42.27ZM23.387,9.839h0L3.162,30.064-.327,38.621l9.154-2.892L29.052,15.5,23.387,9.839Z" transform="translate(5.102 6.536)"></path><path d="M28.7,19.1a1.987,1.987,0,0,1-1.414-.586l-7.071-7.071a2,2,0,0,1,0-2.828l6.368-6.368a2,2,0,0,1,2.829,0l7.071,7.071a2,2,0,0,1,0,2.828L30.116,18.51A1.987,1.987,0,0,1,28.7,19.1ZM27.995,5.067h0l-4.95,4.95,5.666,5.665,4.95-4.949L27.995,5.067Z" transform="translate(12.102 -0.464)"></path></g></svg>
                    ` + getLanguage("menu_admin_work_report_item_submit_button") + `
                </div>
            </div>
        </div>
    `;
    
    items.appendChild(newEl);
}

function setOrderCheckboxAdminWorkReport(menuNumber, number, order) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("menu_admin_work_report_items")[0];
    let child = items.children;
    let item = null;
    for (let i = 0; i < child.length; i++) {
        if (child[i].getAttribute("number") == number) {
            item = child[i];
            break;
        }
    }

    let checkboxItem = item.getElementsByClassName("menu_admin_work_report_item_right_checkbox_item");
    for (let i = 0; i < checkboxItem.length; i++) {
        checkboxItem[i].classList.remove("menu_admin_work_report_item_right_checkbox_item_checked");
    }

    checkboxItem[order].classList.add("menu_admin_work_report_item_right_checkbox_item_checked");
}















































function showAdminWorkReportMoreLoading(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let loading = contents.getElementsByClassName("admin_work_report_contents_loading")[0];
    loading.style.display = "block";
}
function hideAdminWorkReportMoreLoading(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let loading = contents.getElementsByClassName("admin_work_report_contents_loading")[0];
    loading.style.display = "none";
}
function checkAdminWorkReportMoreLoading(menuNumber) {
    if (adminWorkReportLoadNumbers[menuNumber].length == 0) {
        hideAdminWorkReportMoreLoading(menuNumber);
        adminWorkReportLoadNumbers[menuNumber] = null;
    } else {
        showAdminWorkReportMoreLoading(menuNumber);
    }
}

let isAdminWorkReportMoreLoad = new Array();

function checkAdminWorkReportLoad() {
    if (getCurrentMenuName() == "admin_work_report") {
        let boxSize = 75;

        let scrollPercent = ((document.documentElement.scrollTop + window.innerHeight) / (document.documentElement.scrollHeight - boxSize)) * 100;
        if (scrollPercent >= 100) {
            let number = getCurrentMenuNumber();
            if (isAdminWorkReportMoreLoad[number] == null && adminWorkReportLoadNumbers[number] != null && adminWorkReportLoadNumbers[number][0] != "") {
                isAdminWorkReportMoreLoad[number] = true;
                moreLoadAdminWorkReport(number);
            }
        }
    }
}
addEventListener("scroll", checkAdminWorkReportLoad);
addEventListener("resize", checkAdminWorkReportLoad);
addEventListener("focus", checkAdminWorkReportLoad);

function moreLoadAdminWorkReport(menuNumber) {
    if (adminWorkReportLoadNumbers[menuNumber] == null || adminWorkReportLoadNumbers[menuNumber].length == 0) {
        adminWorkReportLoadNumbers[menuNumber] = null;
        isAdminWorkReportMoreLoad[menuNumber] = null;
        return;
    }

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/menu/admin/php/work_report/getInfoNumbers.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                for (let i = 0; i < info.length; i++) {
                    addItemAdminWorkReport(menuNumber, info[i]);
            
                    let array = adminWorkReportLoadNumbers[menuNumber];
                    array = array.remove("" + info[i]["number"]);
                    adminWorkReportLoadNumbers[menuNumber] = array;
                }

                isAdminWorkReportMoreLoad[menuNumber] = null;
                checkAdminWorkReportMoreLoading(menuNumber);
            } else {
                if (status == 504) {
                    //시간 초과
                    serverResponseErrorMessage(0);
                } else {
                    //오류 발생
                    serverResponseErrorMessage(1);
                }
            }
        }
    });

    let numbers = adminWorkReportLoadNumbers[menuNumber];
    let numbersMaxCount = (numbers.length >= 15) ? 15 : numbers.length;
    numbers = numbers.splice(0, numbersMaxCount);
    
    var formData = new FormData();
    formData.append("numbers", numbers.join(","));
    formData.append("lang", userLanguage);

    xhr.send(formData);
}












































function menuAdminWorkReportOptionLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("menu_admin_work_report_items")[0];
    let sort_box = contents.getElementsByClassName("sort_box");

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/menu/admin/php/work_report/getInfoNumbers.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                items.textContent = "";
                let numbers = info["numbers"].split(",");
                adminWorkReportLoadNumbers[menuNumber] = numbers;

                //
                if (numbers.length != 0 && numbers[0] != "") {
                    let worksInfo = info["info"];
                    for (let i = 0; i < worksInfo.length; i++) {
                        addItemAdminWorkReport(menuNumber, worksInfo[i]);
                
                        let array = adminWorkReportLoadNumbers[menuNumber];
                        array = array.remove("" + worksInfo[i]["number"]);
                        adminWorkReportLoadNumbers[menuNumber] = array;
                    }
                    checkAdminWorkReportMoreLoading(menuNumber);
                } else {
                    noDataAdminWorkReport(menuNumber);
                    hideAdminWorkReportMoreLoading(menuNumber);
                }

                isAdminWorkReportMoreLoad[menuNumber] = null;
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
    formData.append("sort", sort_box[0].getAttribute("value"));
    formData.append("language", sort_box[1].getAttribute("value"));
    formData.append("lang", userLanguage);

    xhr.send(formData);
}






















































function submitAdminWorkReportButton(menuNumber, workNumber) {
    confirmPopup(getLanguage("menu_admin_work_report_submit_confirm_popup:title"), getLanguage("menu_admin_work_report_submit_confirm_popup:description"), 'requestSubmitAdminWorkReport(' + menuNumber + ', ' + workNumber + ');');
}

function requestSubmitAdminWorkReport(menuNumber, workNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("menu_admin_work_report_items")[0];
    let child = items.children;
    let item = null;
    for (let i = 0; i < child.length; i++) {
        if (child[i].getAttribute("number") == workNumber) {
            item = child[i];
            break;
        }
    }

    //
    let reason = -1;
    let checkboxItem = item.getElementsByClassName("menu_admin_work_report_item_right_checkbox_item");
    for (let i = 0; i < checkboxItem.length; i++) {
        if (checkboxItem[i].classList.contains("menu_admin_work_report_item_right_checkbox_item_checked")) {
            reason = i;
            reason --;
            break;
        }
    }

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/menu/admin/php/work_report/submission.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;

                let height = item.clientHeight;
                item.style.maxHeight = height + "px";
                function callback() {
                    item.style.animation = "deleteAdminWorkReportItem 0.2s forwards";
                    item.style.maxHeight = "0px";
                    item.style.marginBottom = "0px";
                    setTimeout(() => {
                        item.remove();
    
                        //데이터 없음
                        if (child.length == 0 && (adminWorkReportLoadNumbers[menuNumber] == null || adminWorkReportLoadNumbers[menuNumber][0] == "")) {
                            noDataAdminWorkReport(menuNumber);
                        }
                    }, 200);
                }
                window.requestAnimationFrame(callback);

                let reasonText = getLanguage("popup_work_report_item_title:" + reason);
                if (reason == -1) {
                    reasonText = getLanguage("menu_admin_work_report_item_title:not_applicable");
                }
                actionMessage(getLanguage("menu_admin_work_report_submit_message").replaceAll("{R:0}", reasonText));
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
    formData.append("reason", reason);
    formData.append("workNumber", workNumber);

    xhr.send(formData);
}
















































function getMenuAdminWorkReportSortItems() {
    let items = new Array();
    items[0] = {
        "title": getLanguage("menu_admin_work_report_sort:0"),
        "value": 0
    }
    items[1] = {
        "title": getLanguage("menu_admin_work_report_sort:1"),
        "value": 1
    }
    return items;
}