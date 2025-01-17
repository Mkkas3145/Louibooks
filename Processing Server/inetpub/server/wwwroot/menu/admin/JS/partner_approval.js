

var adminPartnerApprovalLoadNumbers = new Array();

function menuAdminPartnerApprovalLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let partnerApprovalInfo = JSON.parse(contents.getElementsByClassName("partner_approval_info")[0].innerHTML);

    let numbers = partnerApprovalInfo["numbers"].split(",");
    let info = partnerApprovalInfo["info"];

    //번호들 변수에 등록
    adminPartnerApprovalLoadNumbers[menuNumber] = numbers;

    if (info != null && info.length != 0) {
        for (let i = 0; i < info.length; i++) {
            addItemAdminPartnerApproval(menuNumber, info[i]);
    
            let array = adminPartnerApprovalLoadNumbers[menuNumber];
            array = array.remove("" + info[i]["number"]);
            adminPartnerApprovalLoadNumbers[menuNumber] = array;
        }
        checkAdminPartnerApprovalMoreLoading(menuNumber);
    } else {
        noDataAdminPartnerApproval(menuNumber);
    }

    //데이터 없음
    let no_data = contents.getElementsByClassName("menu_admin_partner_approval_no_data")[0];
    no_data.getElementsByClassName("menu_admin_partner_approval_no_data_title")[0].innerHTML = getLanguage("menu_admin_partner_approval_no_data");
    no_data.getElementsByClassName("menu_admin_partner_approval_no_data_description")[0].innerHTML = getLanguage("no_data_description");

    //제목
    let title = contents.getElementsByClassName("menu_admin_partner_approval_title")[0];
    title.innerHTML = getLanguage("menu_admin_partner_approval_title");

    //정렬
    let sort_box_title = contents.getElementsByClassName("sort_box_title");
    sort_box_title[0].innerHTML = getLanguage("menu_admin_partner_approval_sort:0");
    sort_box_title[1].innerHTML = getLanguage("menu_admin_partner_approval_item_type:all");
    sort_box_title[2].innerHTML = getLanguage("language:select_item:all");
}

function noDataAdminPartnerApproval(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let no_data = contents.getElementsByClassName("menu_admin_partner_approval_no_data")[0];
    no_data.style.display = "flex";
}

function addItemAdminPartnerApproval(menuNumber, info) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("menu_admin_partner_approval_items")[0];

    let no_data = contents.getElementsByClassName("menu_admin_partner_approval_no_data")[0];
    no_data.style.display = "none";

    let partner = "";
    if (info["partner"] == 0) {
        partner = `
            ` + getSVGLouibooksLogo(1) + `
            ` + getLanguage("menu_admin_partner_approval_item_partner:0") + `
        `;
    } else if (info["partner"] == 1) {
        partner = `
            ` + getSVGLouibooksLogo(3) + `
            ` + getLanguage("menu_admin_partner_approval_item_partner:1") + `
        `;
    } else if (info["partner"] == 2) {
        partner = `
            ` + getSVGLouibooksLogo(4) + `
            ` + getLanguage("menu_admin_partner_approval_item_partner:2") + `
        `;
    }

    let request = "";
    if (info["request"] == 0) {
        request = `
            ` + getSVGLouibooksLogo(3) + `
            ` + getLanguage("menu_admin_partner_approval_item_type").replaceAll("{R:0}", getLanguage("menu_admin_partner_approval_item_type:" + info["request"])) + `
        `;
    } else if (info["request"] == 1) {
        request = `
            ` + getSVGLouibooksLogo(4) + `
            ` + getLanguage("menu_admin_partner_approval_item_type").replaceAll("{R:0}", getLanguage("menu_admin_partner_approval_item_type:" + info["request"])) + `
        `;
    }

    let newEl = document.createElement("div");
    newEl.setAttribute("number", info["number"]);
    newEl.classList.add("visible_element");
    newEl.classList.add("variable_element");
    newEl.classList.add("menu_admin_partner_approval_item");
    newEl.innerHTML = `
        <div class = "menu_admin_partner_approval_item_left md-ripples" onclick = "loadMenu_user(` + info["number"] + `);">
            <div class = "profile_element">
                <div class = "profile_info">` + JSON.stringify(info["profile"]) + `</div>
                <div class = "profile_image"></div>
            </div>
        </div>
        <div class = "menu_admin_partner_approval_item_right">
            <div class = "menu_admin_partner_approval_item_right_nickname md-ripples" onclick = "loadMenu_user(` + info["number"] + `);">
                ` + info["nickname"] + `
            </div>
            <div class = "menu_admin_partner_approval_item_right_top_items">
                <div class = "menu_admin_partner_approval_item_right_top_item">
                    ` + partner + `
                </div>
                <div class = "menu_admin_partner_approval_item_right_top_item">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17 21v-2c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464h-7c-1.38 0-2.632 0.561-3.536 1.464s-1.464 2.156-1.464 3.536v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2c0-0.829 0.335-1.577 0.879-2.121s1.292-0.879 2.121-0.879h7c0.829 0 1.577 0.335 2.121 0.879s0.879 1.292 0.879 2.121v2c0 0.552 0.448 1 1 1s1-0.448 1-1zM13.5 7c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464-2.632 0.561-3.536 1.464-1.464 2.156-1.464 3.536 0.561 2.632 1.464 3.536 2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464 1.464-2.156 1.464-3.536zM11.5 7c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121 0.335-1.577 0.879-2.121 1.292-0.879 2.121-0.879 1.577 0.335 2.121 0.879 0.879 1.292 0.879 2.121zM16.293 11.707l2 2c0.391 0.391 1.024 0.391 1.414 0l4-4c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-3.293 3.293-1.293-1.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path></svg>
                    ` + getLanguage("menu_user_info_save_count").replaceAll("{R:0}", commas(info["userListSaveCount"])) + `
                </div>
            </div>
            <div class = "menu_admin_partner_approval_item_right_line"></div>
            <div class = "menu_admin_partner_approval_item_right_request">
                ` + request + `
            </div>
            <div class = "menu_admin_partner_approval_item_right_content">
                ` + getLanguage("menu_admin_partner_approval_item_description").replaceAll("{R:0}", "<b>" + getLanguage("menu_admin_partner_approval_item_type:" + info["request"]) + "</b>") + `
            </div>
            <div class = "menu_admin_partner_approval_item_right_line"></div>
            <div class = "menu_admin_partner_approval_item_right_button_items">
                <div class = "menu_admin_partner_approval_item_right_button md-ripples" onclick = "loadMenu_user(` + info["number"] + `);">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.199 13.599c0.992 1.327 2.43 2.126 3.948 2.345s3.123-0.142 4.45-1.134c0.239-0.179 0.465-0.375 0.655-0.568l2.995-2.995c1.163-1.204 1.722-2.751 1.696-4.285s-0.639-3.061-1.831-4.211c-1.172-1.132-2.688-1.692-4.199-1.683-1.492 0.008-2.984 0.571-4.137 1.683l-1.731 1.721c-0.392 0.389-0.394 1.023-0.004 1.414s1.023 0.394 1.414 0.004l1.709-1.699c0.77-0.742 1.763-1.117 2.76-1.123 1.009-0.006 2.016 0.367 2.798 1.122 0.795 0.768 1.203 1.783 1.221 2.808s-0.355 2.054-1.11 2.836l-3.005 3.005c-0.114 0.116-0.263 0.247-0.428 0.37-0.885 0.662-1.952 0.902-2.967 0.756s-1.971-0.678-2.632-1.563c-0.331-0.442-0.957-0.533-1.4-0.202s-0.533 0.957-0.202 1.4zM14.801 10.401c-0.992-1.327-2.43-2.126-3.948-2.345s-3.124 0.142-4.451 1.134c-0.239 0.179-0.464 0.375-0.655 0.568l-2.995 2.995c-1.163 1.204-1.722 2.751-1.696 4.285s0.639 3.061 1.831 4.211c1.172 1.132 2.688 1.692 4.199 1.683 1.492-0.008 2.984-0.571 4.137-1.683l1.723-1.723c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-1.696 1.698c-0.77 0.742-1.763 1.117-2.76 1.123-1.009 0.006-2.016-0.367-2.798-1.122-0.795-0.768-1.203-1.783-1.221-2.808s0.355-2.054 1.11-2.836l3.005-3.005c0.114-0.116 0.263-0.247 0.428-0.37 0.885-0.662 1.952-0.902 2.967-0.756s1.971 0.678 2.632 1.563c0.331 0.442 0.957 0.533 1.4 0.202s0.533-0.957 0.202-1.4z"></path></svg>
                    ` + getLanguage("menu_admin_partner_approval_item_button:0") + `
                </div>
                <div class = "menu_admin_partner_approval_item_right_button md-ripples" onclick = "adminPartnerApprovalButton(` + menuNumber + `, ` + info["number"] + `, ` + info["request"] + `, false);">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path></svg>
                    ` + getLanguage("menu_admin_partner_approval_item_button:1") + `
                </div>
                <div class = "menu_admin_partner_approval_item_right_button md-ripples" onclick = "adminPartnerApprovalButton(` + menuNumber + `, ` + info["number"] + `, ` + info["request"] + `, true);">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                    ` + getLanguage("menu_admin_partner_approval_item_button:2") + `
                </div>
            </div>
        </div>
    `;

    items.appendChild(newEl);
}














































function showAdminPartnerApprovalMoreLoading(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let loading = contents.getElementsByClassName("admin_partner_approval_contents_loading")[0];
    loading.style.display = "block";
}
function hideAdminPartnerApprovalMoreLoading(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let loading = contents.getElementsByClassName("admin_partner_approval_contents_loading")[0];
    loading.style.display = "none";
}
function checkAdminPartnerApprovalMoreLoading(menuNumber) {
    if (adminPartnerApprovalLoadNumbers[menuNumber].length == 0) {
        hideAdminPartnerApprovalMoreLoading(menuNumber);
        adminPartnerApprovalLoadNumbers[menuNumber] = null;
    } else {
        showAdminPartnerApprovalMoreLoading(menuNumber);
    }
}

let isAdminPartnerApprovalMoreLoad = new Array();

function checkAdminPartnerApprovalLoad() {
    if (getCurrentMenuName() == "admin_partner_approval") {
        let boxSize = 75;

        let scrollPercent = ((document.documentElement.scrollTop + window.innerHeight) / (document.documentElement.scrollHeight - boxSize)) * 100;
        if (scrollPercent >= 100) {
            let number = getCurrentMenuNumber();
            if (isAdminPartnerApprovalMoreLoad[number] == null && adminPartnerApprovalLoadNumbers[number] != null && adminPartnerApprovalLoadNumbers[number][0] != "") {
                isAdminPartnerApprovalMoreLoad[number] = true;
                moreLoadAdminPartnerApproval(number);
            }
        }
    }
}
addEventListener("scroll", checkAdminPartnerApprovalLoad);
addEventListener("resize", checkAdminPartnerApprovalLoad);
addEventListener("focus", checkAdminPartnerApprovalLoad);

function moreLoadAdminPartnerApproval(menuNumber) {
    if (adminPartnerApprovalLoadNumbers[menuNumber] == null || adminPartnerApprovalLoadNumbers[menuNumber].length == 0) {
        adminPartnerApprovalLoadNumbers[menuNumber] = null;
        isAdminPartnerApprovalMoreLoad[menuNumber] = null;
        return;
    }

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/menu/admin/php/partner_approval/getInfo.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                for (let i = 0; i < info.length; i++) {
                    addItemAdminPartnerApproval(menuNumber, info[i]);
            
                    let array = adminPartnerApprovalLoadNumbers[menuNumber];
                    array = array.remove("" + info[i]["number"]);
                    adminPartnerApprovalLoadNumbers[menuNumber] = array;
                }

                isAdminPartnerApprovalMoreLoad[menuNumber] = null;
                checkAdminPartnerApprovalMoreLoading(menuNumber);
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

    let numbers = adminPartnerApprovalLoadNumbers[menuNumber];
    let numbersMaxCount = (numbers.length >= 20) ? 20 : numbers.length;
    numbers = numbers.splice(0, numbersMaxCount);
    
    var formData = new FormData();
    formData.append("numbers", numbers.join(","));
    formData.append("lang", userLanguage);

    xhr.send(formData);
}

















































function menuAdminPartnerApprovalOptionLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("menu_admin_partner_approval_items")[0];
    let sort_box = contents.getElementsByClassName("sort_box");

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/menu/admin/php/partner_approval/getInfoNumbers.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                items.textContent = "";
                let numbers = info["numbers"].split(",");
                adminPartnerApprovalLoadNumbers[menuNumber] = numbers;

                //
                if (numbers.length != 0 && numbers[0] != "") {
                    let worksInfo = info["info"];
                    for (let i = 0; i < worksInfo.length; i++) {
                        addItemAdminPartnerApproval(menuNumber, worksInfo[i]);
                
                        let array = adminPartnerApprovalLoadNumbers[menuNumber];
                        array = array.remove("" + worksInfo[i]["number"]);
                        adminPartnerApprovalLoadNumbers[menuNumber] = array;
                    }
                    checkAdminPartnerApprovalMoreLoading(menuNumber);
                } else {
                    noDataAdminPartnerApproval(menuNumber);
                    hideAdminPartnerApprovalMoreLoading(menuNumber);
                }

                isAdminPartnerApprovalMoreLoad[menuNumber] = null;
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
    formData.append("request", sort_box[1].getAttribute("value"));
    formData.append("language", sort_box[2].getAttribute("value"));
    formData.append("lang", userLanguage);

    xhr.send(formData);
}





























































function getMenuAdminPartnerApprovalSortItems() {
    let items = new Array();
    items[0] = {
        "title": getLanguage("menu_admin_partner_approval_sort:0"),
        "value": 0
    }
    items[1] = {
        "title": getLanguage("menu_admin_partner_approval_sort:1"),
        "value": 1
    }
    return items;
}
function getMenuAdminPartnerApprovalTypeItems() {
    let items = new Array();
    items[0] = {
        "title": getLanguage("menu_admin_partner_approval_item_type:all"),
        "value": 0
    }
    items[1] = {
        "title": getLanguage("menu_admin_partner_approval_item_type:0"),
        "value": 1
    }
    items[2] = {
        "title": getLanguage("menu_admin_partner_approval_item_type:1"),
        "value": 2
    }
    return items;
}


























































function adminPartnerApprovalButton(menuNumber, userNumber, request, isAccept) {
    confirmPopup(getLanguage("menu_admin_partner_approval_submit_confirm_popup:title"), getLanguage("menu_admin_partner_approval_submit_confirm_popup:description"), 'requestAdminPartnerApproval(' + menuNumber + ', ' + userNumber + ', ' + request + ', ' + isAccept + ');');
}
function requestAdminPartnerApproval(menuNumber, userNumber, request, isAccept) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("menu_admin_partner_approval_items")[0];
    let child = items.children;
    let item = null;
    for (let i = 0; i < child.length; i++) {
        if (child[i].getAttribute("number") == userNumber) {
            item = child[i];
            break;
        }
    }

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/menu/admin/php/partner_approval/submission.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText.trim();
                
                let height = item.clientHeight;
                item.style.maxHeight = height + "px";
                function callback() {
                    item.style.animation = "deleteAdminPartnerApprovalItem 0.2s forwards";
                    item.style.maxHeight = "0px";
                    item.style.marginBottom = "0px";
                    setTimeout(() => {
                        item.remove();
    
                        //데이터 없음
                        if (child.length == 0 && (adminPartnerApprovalLoadNumbers[menuNumber] == null || adminPartnerApprovalLoadNumbers[menuNumber][0] == "")) {
                            noDataAdminPartnerApproval(menuNumber);
                        }
                    }, 200);
                }
                window.requestAnimationFrame(callback);

                actionMessage(getLanguage("menu_admin_partner_approval_submit_message"));
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
    formData.append("userNumber", userNumber);
    formData.append("request", request);
    formData.append("isAccept", isAccept);

    xhr.send(formData);
}