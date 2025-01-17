

var adminUserReportLoadNumbers = new Array();

function menuAdminUserReportLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let userReportInfo = JSON.parse(contents.getElementsByClassName("user_report_info")[0].innerHTML);

    let numbers = userReportInfo["numbers"].split(",");
    let info = userReportInfo["info"];

    //번호들 변수에 등록
    adminUserReportLoadNumbers[menuNumber] = numbers;

    if (info != null && info.length != 0) {
        for (let i = 0; i < info.length; i++) {
            addItemAdminUserReport(menuNumber, info[i]);
    
            let array = adminUserReportLoadNumbers[menuNumber];
            array = array.remove("" + info[i]["number"]);
            adminUserReportLoadNumbers[menuNumber] = array;
        }
        checkAdminUserReportMoreLoading(menuNumber);
    } else {
        noDataAdminUserReport(menuNumber);
    }

    //정렬
    let sort_box_title = contents.getElementsByClassName("sort_box_title");
    sort_box_title[0].innerHTML = getLanguage("menu_admin_user_report_sort:0");
    sort_box_title[1].innerHTML = getLanguage("language:select_item:all");

    //데이터 없음
    let no_data = contents.getElementsByClassName("menu_admin_user_report_no_data")[0];
    no_data.getElementsByClassName("menu_admin_user_report_no_data_title")[0].innerHTML = getLanguage("menu_admin_user_report_no_data");
    no_data.getElementsByClassName("menu_admin_user_report_no_data_description")[0].innerHTML = getLanguage("no_data_description");

    let user_report_title = contents.getElementsByClassName("menu_admin_user_report_title")[0];
    user_report_title.innerHTML = getLanguage("menu_admin_user_report_title");
}

function noDataAdminUserReport(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let no_data = contents.getElementsByClassName("menu_admin_user_report_no_data")[0];
    no_data.style.display = "flex";
}

function addItemAdminUserReport(menuNumber, info) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("menu_admin_user_report_items")[0];

    let no_data = contents.getElementsByClassName("menu_admin_user_report_no_data")[0];
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

    if (reasonNumber == 5) {
        description += getLanguage("menu_admin_user_report_item_description:1");
    } else {
        description += getLanguage("menu_admin_user_report_item_description:0").replaceAll("{R:0}", "<b style = \"color: var(--site-color-light);\">" + getLanguage("popup_user_report_item_title:" + reasonNumber) + "</b>");
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
            description += "<br />" + getLanguage("menu_admin_user_report_item_description:2") + " ";
            consistency = false;
        }
    }

    //
    if (consistency == true) {
        description += "<br />";
    }
    description += getLanguage("menu_admin_user_report_item_description:3");

    //방문하기
    let visit = "";
    if (info["type"] == 0) {
        visit = "loadMenu_comment(" + info["uniqueNumber"] + ");";
    } else if (info["type"] == 1) {
        visit = "loadMenu_rating(" + info["uniqueNumber"] + ");";
    } else if (info["type"] == 2) {
        visit = "loadMenu_community(" + info["uniqueNumber"] + ");";
    }

    let contentStyle = "";
    let content = info["content"];
    if (info["type"] == 2) {
        contentStyle = "white-space: unset; line-height: unset;";
        content = getHtmlCommunityContents(JSON.parse(content));
    }

    let newEl = document.createElement("div");
    newEl.setAttribute("number", info["number"]);
    newEl.classList.add("visible_element");
    newEl.classList.add("variable_element");
    newEl.classList.add("menu_admin_user_report_item");
    newEl.innerHTML = `
        <div class = "menu_admin_user_report_item_left md-ripples" onclick = "loadMenu_user(` + info["userNumber"] + `);">
            <div class = "profile_element">
                <div class = "profile_info">` + JSON.stringify(info["profile"]) + `</div>
                <div class = "profile_image"></div>
            </div>
        </div>
        <div class = "menu_admin_user_report_item_right">
            <div class = "menu_admin_user_report_item_right_nickname md-ripples" onclick = "loadMenu_user(` + info["userNumber"] + `);">
                ` + info["nickname"] + `
            </div>
            <div class = "menu_admin_user_report_item_right_top_items">
                <div class = "menu_admin_user_report_item_right_top_item">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5" transform="translate(9)"></rect><path d="M13.422,25.422s6.941-3.318,12.163-3.086,17.81,4.641,17.81,4.641V9.456S27.963,4,24.656,3.945s-9.456,2.9-9.456,2.9L13.422,4.235S18.913.754,24.25,1.1,43.395,6.15,43.395,6.15h3.249V30.806L25.584,25.422S18.391,25.816,15.2,27.9Z" transform="translate(-0.449)"></path></g></svg>
                    ` + getLanguage("menu_admin_user_report_item_top:0").replaceAll("{R:0}", commas(info["count"])) + `
                </div>
                <div class = "menu_admin_user_report_item_right_top_item">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M29.884 25.14l-9.884-16.47v-6.671h1c0.55 0 1-0.45 1-1s-0.45-1-1-1h-10c-0.55 0-1 0.45-1 1s0.45 1 1 1h1v6.671l-9.884 16.47c-2.264 3.773-0.516 6.86 3.884 6.86h20c4.4 0 6.148-3.087 3.884-6.86zM7.532 20l6.468-10.779v-7.221h4v7.221l6.468 10.779h-16.935z"></path></svg>
                    ` + getLanguage("menu_admin_user_report_item_top_type:" + info["type"]) + `
                </div>
            </div>
            <div class = "menu_admin_user_report_item_right_content" style = "` + contentStyle + `">` + textToURL(content) + `</div>
            <div class = "menu_admin_user_report_item_right_line"></div>
            <div class = "menu_admin_user_report_item_right_description">
                ` + description + `
            </div>
            <div class = "menu_admin_user_report_item_right_line"></div>
            <div class = "menu_admin_user_report_item_right_checkbox_items">
                <div class = "menu_admin_user_report_item_right_checkbox_item md-ripples menu_admin_user_report_item_right_checkbox_item_checked" onclick = "setOrderCheckboxAdminUserReport(` + menuNumber + `, '` + info["number"] + `', 0);">
                    <div class = "menu_admin_user_report_item_right_checkbox_item_left">
                        <div class = "menu_admin_user_report_item_right_checkbox_item_left_in"></div>
                    </div>
                    <div class = "menu_admin_user_report_item_right_checkbox_item_right">
                        <div class = "menu_admin_user_report_item_right_checkbox_item_right_title">
                            ` + getLanguage("menu_admin_user_report_item_title:not_applicable") + `
                        </div>
                    </div>
                </div>
                <div class = "menu_admin_user_report_item_right_checkbox_item md-ripples" onclick = "setOrderCheckboxAdminUserReport(` + menuNumber + `, '` + info["number"] + `', 1);">
                    <div class = "menu_admin_user_report_item_right_checkbox_item_left">
                        <div class = "menu_admin_user_report_item_right_checkbox_item_left_in"></div>
                    </div>
                    <div class = "menu_admin_user_report_item_right_checkbox_item_right">
                        <div class = "menu_admin_user_report_item_right_checkbox_item_right_title">
                            ` + getLanguage("popup_user_report_item_title:0") + `
                        </div>
                    </div>
                </div>
                <div class = "menu_admin_user_report_item_right_checkbox_item md-ripples" onclick = "setOrderCheckboxAdminUserReport(` + menuNumber + `, '` + info["number"] + `', 2);">
                    <div class = "menu_admin_user_report_item_right_checkbox_item_left">
                        <div class = "menu_admin_user_report_item_right_checkbox_item_left_in"></div>
                    </div>
                    <div class = "menu_admin_user_report_item_right_checkbox_item_right">
                        <div class = "menu_admin_user_report_item_right_checkbox_item_right_title">
                            ` + getLanguage("popup_user_report_item_title:1") + `
                        </div>
                    </div>
                </div>
                <div class = "menu_admin_user_report_item_right_checkbox_item md-ripples" onclick = "setOrderCheckboxAdminUserReport(` + menuNumber + `, '` + info["number"] + `', 3);">
                    <div class = "menu_admin_user_report_item_right_checkbox_item_left">
                        <div class = "menu_admin_user_report_item_right_checkbox_item_left_in"></div>
                    </div>
                    <div class = "menu_admin_user_report_item_right_checkbox_item_right">
                        <div class = "menu_admin_user_report_item_right_checkbox_item_right_title">
                            ` + getLanguage("popup_user_report_item_title:2") + `
                        </div>
                    </div>
                </div>
                <div class = "menu_admin_user_report_item_right_checkbox_item md-ripples" onclick = "setOrderCheckboxAdminUserReport(` + menuNumber + `, '` + info["number"] + `', 4);">
                    <div class = "menu_admin_user_report_item_right_checkbox_item_left">
                        <div class = "menu_admin_user_report_item_right_checkbox_item_left_in"></div>
                    </div>
                    <div class = "menu_admin_user_report_item_right_checkbox_item_right">
                        <div class = "menu_admin_user_report_item_right_checkbox_item_right_title">
                            ` + getLanguage("popup_user_report_item_title:3") + `
                        </div>
                    </div>
                </div>
                <div class = "menu_admin_user_report_item_right_checkbox_item md-ripples" onclick = "setOrderCheckboxAdminUserReport(` + menuNumber + `, '` + info["number"] + `', 5);">
                    <div class = "menu_admin_user_report_item_right_checkbox_item_left">
                        <div class = "menu_admin_user_report_item_right_checkbox_item_left_in"></div>
                    </div>
                    <div class = "menu_admin_user_report_item_right_checkbox_item_right">
                        <div class = "menu_admin_user_report_item_right_checkbox_item_right_title">
                            ` + getLanguage("popup_user_report_item_title:4") + `
                        </div>
                    </div>
                </div>
            </div>
            <div class = "menu_admin_user_report_item_right_button_items">
                <div class = "menu_admin_user_report_item_right_button md-ripples" onclick = "` + visit + `">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.199 13.599c0.992 1.327 2.43 2.126 3.948 2.345s3.123-0.142 4.45-1.134c0.239-0.179 0.465-0.375 0.655-0.568l2.995-2.995c1.163-1.204 1.722-2.751 1.696-4.285s-0.639-3.061-1.831-4.211c-1.172-1.132-2.688-1.692-4.199-1.683-1.492 0.008-2.984 0.571-4.137 1.683l-1.731 1.721c-0.392 0.389-0.394 1.023-0.004 1.414s1.023 0.394 1.414 0.004l1.709-1.699c0.77-0.742 1.763-1.117 2.76-1.123 1.009-0.006 2.016 0.367 2.798 1.122 0.795 0.768 1.203 1.783 1.221 2.808s-0.355 2.054-1.11 2.836l-3.005 3.005c-0.114 0.116-0.263 0.247-0.428 0.37-0.885 0.662-1.952 0.902-2.967 0.756s-1.971-0.678-2.632-1.563c-0.331-0.442-0.957-0.533-1.4-0.202s-0.533 0.957-0.202 1.4zM14.801 10.401c-0.992-1.327-2.43-2.126-3.948-2.345s-3.124 0.142-4.451 1.134c-0.239 0.179-0.464 0.375-0.655 0.568l-2.995 2.995c-1.163 1.204-1.722 2.751-1.696 4.285s0.639 3.061 1.831 4.211c1.172 1.132 2.688 1.692 4.199 1.683 1.492-0.008 2.984-0.571 4.137-1.683l1.723-1.723c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-1.696 1.698c-0.77 0.742-1.763 1.117-2.76 1.123-1.009 0.006-2.016-0.367-2.798-1.122-0.795-0.768-1.203-1.783-1.221-2.808s0.355-2.054 1.11-2.836l3.005-3.005c0.114-0.116 0.263-0.247 0.428-0.37 0.885-0.662 1.952-0.902 2.967-0.756s1.971 0.678 2.632 1.563c0.331 0.442 0.957 0.533 1.4 0.202s0.533-0.957 0.202-1.4z"></path></svg>
                    ` + getLanguage("menu_admin_user_report_item_visit_button") + `
                </div>
                <div class = "menu_admin_user_report_item_right_button md-ripples" onclick = "submitAdminUserReportButton(` + menuNumber + `, ` + info["type"] + `, ` + info["uniqueNumber"] + `);">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-4.438,42.27v0L.4,28.587,21.847,7.145a2.12,2.12,0,0,1,1.506-.632,1.945,1.945,0,0,1,1.387.567l7.071,7.071a1.944,1.944,0,0,1,.567,1.433,2.125,2.125,0,0,1-.632,1.459L10.3,38.487-4.436,42.27ZM23.387,9.839h0L3.162,30.064-.327,38.621l9.154-2.892L29.052,15.5,23.387,9.839Z" transform="translate(5.102 6.536)"></path><path d="M28.7,19.1a1.987,1.987,0,0,1-1.414-.586l-7.071-7.071a2,2,0,0,1,0-2.828l6.368-6.368a2,2,0,0,1,2.829,0l7.071,7.071a2,2,0,0,1,0,2.828L30.116,18.51A1.987,1.987,0,0,1,28.7,19.1ZM27.995,5.067h0l-4.95,4.95,5.666,5.665,4.95-4.949L27.995,5.067Z" transform="translate(12.102 -0.464)"></path></g></svg>
                    ` + getLanguage("menu_admin_user_report_item_submit_button") + `
                </div>
            </div>
        </div>
    `;
    
    items.appendChild(newEl);
}

function setOrderCheckboxAdminUserReport(menuNumber, number, order) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("menu_admin_user_report_items")[0];
    let child = items.children;
    let item = null;
    for (let i = 0; i < child.length; i++) {
        if (child[i].getAttribute("number") == number) {
            item = child[i];
            break;
        }
    }

    let checkboxItem = item.getElementsByClassName("menu_admin_user_report_item_right_checkbox_item");
    for (let i = 0; i < checkboxItem.length; i++) {
        checkboxItem[i].classList.remove("menu_admin_user_report_item_right_checkbox_item_checked");
    }

    checkboxItem[order].classList.add("menu_admin_user_report_item_right_checkbox_item_checked");
}















































function showAdminUserReportMoreLoading(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let loading = contents.getElementsByClassName("admin_user_report_contents_loading")[0];
    loading.style.display = "block";
}
function hideAdminUserReportMoreLoading(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let loading = contents.getElementsByClassName("admin_user_report_contents_loading")[0];
    loading.style.display = "none";
}
function checkAdminUserReportMoreLoading(menuNumber) {
    if (adminUserReportLoadNumbers[menuNumber].length == 0) {
        hideAdminUserReportMoreLoading(menuNumber);
        adminUserReportLoadNumbers[menuNumber] = null;
    } else {
        showAdminUserReportMoreLoading(menuNumber);
    }
}

let isAdminUserReportMoreLoad = new Array();

function checkAdminUserReportLoad() {
    if (getCurrentMenuName() == "admin_user_report") {
        let boxSize = 75;

        let scrollPercent = ((document.documentElement.scrollTop + window.innerHeight) / (document.documentElement.scrollHeight - boxSize)) * 100;
        if (scrollPercent >= 100) {
            let number = getCurrentMenuNumber();
            if (isAdminUserReportMoreLoad[number] == null && adminUserReportLoadNumbers[number] != null && adminUserReportLoadNumbers[number][0] != "") {
                isAdminUserReportMoreLoad[number] = true;
                moreLoadAdminUserReport(number);
            }
        }
    }
}
addEventListener("scroll", checkAdminUserReportLoad);
addEventListener("resize", checkAdminUserReportLoad);
addEventListener("focus", checkAdminUserReportLoad);

function moreLoadAdminUserReport(menuNumber) {
    if (adminUserReportLoadNumbers[menuNumber] == null || adminUserReportLoadNumbers[menuNumber].length == 0) {
        adminUserReportLoadNumbers[menuNumber] = null;
        isAdminUserReportMoreLoad[menuNumber] = null;
        return;
    }

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/menu/admin/php/user_report/getInfoNumbers.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                for (let i = 0; i < info.length; i++) {
                    addItemAdminUserReport(menuNumber, info[i]);
            
                    let array = adminUserReportLoadNumbers[menuNumber];
                    array = array.remove("" + info[i]["number"]);
                    adminUserReportLoadNumbers[menuNumber] = array;
                }

                isAdminUserReportMoreLoad[menuNumber] = null;
                checkAdminUserReportMoreLoading(menuNumber);
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

    let numbers = adminUserReportLoadNumbers[menuNumber];
    let numbersMaxCount = (numbers.length >= 15) ? 15 : numbers.length;
    numbers = numbers.splice(0, numbersMaxCount);
    
    var formData = new FormData();
    formData.append("numbers", numbers.join(","));
    formData.append("lang", userLanguage);

    xhr.send(formData);
}








































function menuAdminUserReportOptionLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("menu_admin_user_report_items")[0];
    let sort_box = contents.getElementsByClassName("sort_box");

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/menu/admin/php/user_report/getInfoNumbers.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                items.textContent = "";
                let numbers = info["numbers"].split(",");
                adminUserReportLoadNumbers[menuNumber] = numbers;

                //
                if (numbers.length != 0 && numbers[0] != "") {
                    let worksInfo = info["info"];
                    for (let i = 0; i < worksInfo.length; i++) {
                        addItemAdminUserReport(menuNumber, worksInfo[i]);
                
                        let array = adminUserReportLoadNumbers[menuNumber];
                        array = array.remove("" + worksInfo[i]["number"]);
                        adminUserReportLoadNumbers[menuNumber] = array;
                    }
                    checkAdminUserReportMoreLoading(menuNumber);
                } else {
                    noDataAdminUserReport(menuNumber);
                    hideAdminUserReportMoreLoading(menuNumber);
                }

                isAdminUserReportMoreLoad[menuNumber] = null;
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









































function submitAdminUserReportButton(menuNumber, type, uniqueNumber) {
    confirmPopup(getLanguage("menu_admin_user_report_submit_confirm_popup:title"), getLanguage("menu_admin_user_report_submit_confirm_popup:description"), 'requestSubmitAdminUserReport(' + menuNumber + ', ' + type + ', ' + uniqueNumber + ');');
}

function requestSubmitAdminUserReport(menuNumber, type, uniqueNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("menu_admin_user_report_items")[0];
    let child = items.children;
    let item = null;
    for (let i = 0; i < child.length; i++) {
        if (child[i].getAttribute("number") == (type + ":" + uniqueNumber)) {
            item = child[i];
            break;
        }
    }

    //
    let reason = -1;
    let checkboxItem = item.getElementsByClassName("menu_admin_user_report_item_right_checkbox_item");
    for (let i = 0; i < checkboxItem.length; i++) {
        if (checkboxItem[i].classList.contains("menu_admin_user_report_item_right_checkbox_item_checked")) {
            reason = i;
            reason --;
            break;
        }
    }

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/menu/admin/php/user_report/submission.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;

                let height = item.clientHeight;
                item.style.maxHeight = height + "px";
                function callback() {
                    item.style.animation = "deleteAdminUserReportItem 0.2s forwards";
                    item.style.maxHeight = "0px";
                    item.style.marginBottom = "0px";
                    setTimeout(() => {
                        item.remove();
    
                        //데이터 없음
                        if (child.length == 0 && (adminUserReportLoadNumbers[menuNumber] == null || adminUserReportLoadNumbers[menuNumber][0] == "")) {
                            noDataAdminUserReport(menuNumber);
                        }
                    }, 200);
                }
                window.requestAnimationFrame(callback);

                let reasonText = getLanguage("popup_user_report_item_title:" + reason);
                if (reason == -1) {
                    reasonText = getLanguage("menu_admin_user_report_item_title:not_applicable");
                }
                actionMessage(getLanguage("menu_admin_user_report_submit_message").replaceAll("{R:0}", reasonText));
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
    formData.append("type", type);
    formData.append("uniqueNumber", uniqueNumber);

    xhr.send(formData);
}

































function getMenuAdminUserReportSortItems() {
    let items = new Array();
    items[0] = {
        "title": getLanguage("menu_admin_user_report_sort:0"),
        "value": 0
    }
    items[1] = {
        "title": getLanguage("menu_admin_user_report_sort:1"),
        "value": 1
    }
    return items;
}