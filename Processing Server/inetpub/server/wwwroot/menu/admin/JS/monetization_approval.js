

var adminMonetizationApprovalLoadNumbers = new Array();

function menuAdminMonetizationApprovalLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let monetizationApprovalInfo = JSON.parse(contents.getElementsByClassName("monetization_approval_info")[0].innerHTML);

    let numbers = monetizationApprovalInfo["numbers"].split(",");
    let info = monetizationApprovalInfo["info"];

    //번호들 변수에 등록
    adminMonetizationApprovalLoadNumbers[menuNumber] = numbers;

    if (info != null && info.length != 0) {
        for (let i = 0; i < info.length; i++) {
            addItemAdminMonetizationApproval(menuNumber, info[i]);
    
            let array = adminMonetizationApprovalLoadNumbers[menuNumber];
            array = array.remove("" + info[i]["number"]);
            adminMonetizationApprovalLoadNumbers[menuNumber] = array;
        }
        checkAdminMonetizationApprovalMoreLoading(menuNumber);
    } else {
        noDataAdminMonetizationApproval(menuNumber);
    }

    //정렬
    let sort_box_title = contents.getElementsByClassName("sort_box_title");
    sort_box_title[0].innerHTML = getLanguage("menu_admin_monetization_approval_sort:0");
    sort_box_title[1].innerHTML = getLanguage("menu_admin_monetization_approval_work_type:0");
    sort_box_title[2].innerHTML = getLanguage("language:select_item:all");

    //데이터 없음
    let no_data = contents.getElementsByClassName("menu_admin_monetization_approval_no_data")[0];
    no_data.getElementsByClassName("menu_admin_monetization_approval_no_data_title")[0].innerHTML = getLanguage("menu_admin_monetization_approval_no_data");
    no_data.getElementsByClassName("menu_admin_monetization_approval_no_data_description")[0].innerHTML = getLanguage("no_data_description");

    //제목
    let title = contents.getElementsByClassName("menu_admin_monetization_approval_title")[0];
    title.innerHTML = getLanguage("menu_admin_monetization_approval_title");
}

function noDataAdminMonetizationApproval(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let no_data = contents.getElementsByClassName("menu_admin_monetization_approval_no_data")[0];
    no_data.style.display = "flex";
}

function addItemAdminMonetizationApproval(menuNumber, info) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("menu_admin_monetization_approval_items")[0];

    let no_data = contents.getElementsByClassName("menu_admin_monetization_approval_no_data")[0];
    no_data.style.display = "none";

    let title = "";
    if (info["status"] == 0) {
        title = info["title"];
    } else if (info["status"] == 1) {
        title = getLanguage("work_title_no_permission");
    } else if (info["status"] == 2) {
        title = getLanguage("work_title_deleted");
    }

    let icon = "";
    if (info["contents_type"] == 0) {
        icon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M46,50H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0H30V3H5A2,2,0,0,0,3,5V45a2,2,0,0,0,2,2H45a2,2,0,0,0,2-2V20h3V46A4.005,4.005,0,0,1,46,50Z" transform="translate(0)"></path><path d="M6.364,28.182h0L0,21.818l20.4-20.4a2,2,0,0,1,2.829,0L26.768,4.95a2,2,0,0,1,0,2.828l-20.4,20.4ZM21.869,4.191h0L4.191,21.869,6.313,23.99,23.99,6.313,21.869,4.191Z" transform="translate(21.818)"></path><path d="M4.5,0C6.75,0,9,8,9,8H0S2.25,0,4.5,0Z" transform="translate(22.587 33.779) rotate(-135)"></path></g></svg>';
    } else {
        icon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M46,50H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0H46a4,4,0,0,1,4,4V46A4.005,4.005,0,0,1,46,50ZM5,3A2,2,0,0,0,3,5V45a2,2,0,0,0,2,2H45a2,2,0,0,0,2-2V5a2,2,0,0,0-2-2Z"></path><rect width="3" height="25" rx="1.5" transform="translate(19.278 28.71) rotate(45)"></rect><rect width="3" height="14.85" rx="1.5" transform="translate(17.727 30.831) rotate(-45)"></rect><rect width="3" height="20.943" rx="1.5" transform="translate(37.002 21.694) rotate(30)"></rect><rect width="3" height="25" rx="1.5" transform="translate(35.451 23.194) rotate(-30)"></rect><path d="M8.5,17A8.5,8.5,0,1,1,17,8.5,8.51,8.51,0,0,1,8.5,17Zm0-14A5.5,5.5,0,1,0,14,8.5,5.506,5.506,0,0,0,8.5,3Z" transform="translate(10 8)"></path></g></svg>';
    }

    let coverImage = "";
    let itemLeftAddClass = "";
    let imageLoad = "";
    if (info["status"] == 0) {
        itemLeftAddClass = " img_wrap";
        coverImage = info["cover_image"];
        imageLoad = "imageLoad(event);";
    }

    let newEl = document.createElement("div");
    newEl.setAttribute("number", info["number"]);
    newEl.classList.add("visible_element");
    newEl.classList.add("variable_element");
    newEl.classList.add("menu_admin_monetization_approval_item");
    newEl.innerHTML = `
        <div class = "menu_admin_monetization_approval_item_left` + itemLeftAddClass + `">
            <img src = "` + coverImage + `" onload = "imageLoad(event);" alt = "">
        </div>
        <div class = "menu_admin_monetization_approval_item_right">
            <div class = "menu_admin_monetization_approval_item_right_title">
                ` + title + `
            </div>
            <div class = "menu_admin_monetization_approval_item_right_profile">
                <div class = "menu_admin_monetization_approval_item_right_profile_left">
                    <div class = "profile_element">
                        <div class = "profile_info">` + JSON.stringify(info["originator"]["profile"]) + `</div>
                        <div class = "profile_image"></div>
                    </div>
                </div>
                <div class = "menu_admin_monetization_approval_item_right_profile_nickname">
                    ` + info["originator"]["nickname"] + `
                </div>
            </div>
            <div class = "menu_admin_monetization_approval_item_right_top_items">
                <div class = "menu_admin_monetization_approval_item_right_top_item">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-161.3,48.508a.992.992,0,0,1-.583-.194l-12.534-9.07a1,1,0,0,0-.586-.19,1,1,0,0,0-.586.19l-12.534,9.07a.99.99,0,0,1-.583.194,1.021,1.021,0,0,1-.808-.407.971.971,0,0,1-.158-.869l4.378-15.5a1,1,0,0,0-.335-1.05L-197.884,20.8a.978.978,0,0,1-.32-1.1.979.979,0,0,1,.921-.68l15.335-.412a1,1,0,0,0,.921-.681l5.08-15.112A.987.987,0,0,1-175,2.139a.987.987,0,0,1,.948.681l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a.979.979,0,0,1,.921.68.978.978,0,0,1-.32,1.1l-12.256,9.877a1,1,0,0,0-.336,1.05l4.378,15.5a.972.972,0,0,1-.158.869A1.021,1.021,0,0,1-161.3,48.508Zm-13.655-12.455a3.809,3.809,0,0,1,2.185.7c2.2,1.509,7.989,5.785,8.047,5.828l-2.968-10.516a4,4,0,0,1,1.281-3.609c1.666-1.266,8.107-6.541,8.172-6.594l-10.031-.219h-.027a3.779,3.779,0,0,1-3.488-2.781c-.969-2.829-3.213-9.345-3.235-9.407l-3.235,9.734c-.011.024-1.121,2.438-3.5,2.453-2.4.015-9.925.233-10,.235l8.407,6.844a3.748,3.748,0,0,1,.968,3.687l-2.844,10.11,8.063-5.828A4.312,4.312,0,0,1-174.951,36.053Z" transform="translate(200)"></path></g></svg>
                    ` + info["ratings"]["averageScore"].toFixed(1) + `
                </div>
                <div class = "menu_admin_monetization_approval_item_right_top_item">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M27,30H3a3,3,0,0,1-3-3V3A3,3,0,0,1,3,0H27a3,3,0,0,1,3,3V27A3,3,0,0,1,27,30ZM2.647,2.647V27.353H27.353V2.647Z" transform="translate(0 20)"></path><rect width="32" height="3" rx="1.5" transform="translate(8 10)"></rect><rect width="31" height="3" rx="1.5" transform="translate(40 10) rotate(90)"></rect><rect width="32" height="3" rx="1.5" transform="translate(18)"></rect><rect width="32" height="3" rx="1.5" transform="translate(50) rotate(90)"></rect></g></svg>
                    ` + getLanguage("work_round").replaceAll("{R:0}", commas(info["part"])) + `
                </div>
                <div class = "menu_admin_monetization_approval_item_right_top_item">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,37a21.437,21.437,0,0,1-9.731-2.508,34.262,34.262,0,0,1-7.947-5.721A39.4,39.4,0,0,1,1.965,22.54,10.312,10.312,0,0,1,0,18.5a10.313,10.313,0,0,1,1.965-4.04A39.4,39.4,0,0,1,7.323,8.229a34.261,34.261,0,0,1,7.947-5.721A21.437,21.437,0,0,1,25,0a21.236,21.236,0,0,1,9.728,2.538A34.517,34.517,0,0,1,42.67,8.311a40.627,40.627,0,0,1,5.357,6.242A10.518,10.518,0,0,1,50,18.5c.01,1.175-2.446,5.3-6.467,9.358a35.762,35.762,0,0,1-8.228,6.3A21.562,21.562,0,0,1,25,37ZM25,2.964C13.381,2.964,3.264,16.237,3.264,18.5S13.381,34.036,25,34.036c7.276,0,13.532-5.214,16.613-8.322,3.016-3.042,5.109-6.244,5.1-7.214-.009-1.079-2.552-4.948-6.516-8.557C36.7,6.759,31.227,2.964,25,2.964Z" transform="translate(0 7)"></path><path d="M9.5,19A9.5,9.5,0,0,1,2.783,2.783,9.5,9.5,0,0,1,16.217,16.217,9.437,9.437,0,0,1,9.5,19Zm0-16.026A6.526,6.526,0,1,0,16.026,9.5,6.534,6.534,0,0,0,9.5,2.974Z" transform="translate(16 16)"></path></g></svg>
                    ` + getViewsNumberUnit(info["views"]) + `
                </div>
                <div class = "menu_admin_monetization_approval_item_right_top_item">
                    ` + icon + `
                    ` + getLanguage('work_settings_contents_type:' + info["contents_type"]) + `
                </div>
            </div>
            <div class = "menu_admin_monetization_approval_item_right_line"></div>
            <div class = "menu_admin_monetization_approval_item_right_description">
                ` + getLanguage("menu_admin_monetization_approval_item_description") + `
            </div>
            <div class = "menu_admin_monetization_approval_item_right_line"></div>
            <div class = "menu_admin_monetization_approval_item_right_button_items">
                <div class = "menu_admin_monetization_approval_item_right_button md-ripples" onclick = "loadMenu_work(` + info["number"] + `);">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.199 13.599c0.992 1.327 2.43 2.126 3.948 2.345s3.123-0.142 4.45-1.134c0.239-0.179 0.465-0.375 0.655-0.568l2.995-2.995c1.163-1.204 1.722-2.751 1.696-4.285s-0.639-3.061-1.831-4.211c-1.172-1.132-2.688-1.692-4.199-1.683-1.492 0.008-2.984 0.571-4.137 1.683l-1.731 1.721c-0.392 0.389-0.394 1.023-0.004 1.414s1.023 0.394 1.414 0.004l1.709-1.699c0.77-0.742 1.763-1.117 2.76-1.123 1.009-0.006 2.016 0.367 2.798 1.122 0.795 0.768 1.203 1.783 1.221 2.808s-0.355 2.054-1.11 2.836l-3.005 3.005c-0.114 0.116-0.263 0.247-0.428 0.37-0.885 0.662-1.952 0.902-2.967 0.756s-1.971-0.678-2.632-1.563c-0.331-0.442-0.957-0.533-1.4-0.202s-0.533 0.957-0.202 1.4zM14.801 10.401c-0.992-1.327-2.43-2.126-3.948-2.345s-3.124 0.142-4.451 1.134c-0.239 0.179-0.464 0.375-0.655 0.568l-2.995 2.995c-1.163 1.204-1.722 2.751-1.696 4.285s0.639 3.061 1.831 4.211c1.172 1.132 2.688 1.692 4.199 1.683 1.492-0.008 2.984-0.571 4.137-1.683l1.723-1.723c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-1.696 1.698c-0.77 0.742-1.763 1.117-2.76 1.123-1.009 0.006-2.016-0.367-2.798-1.122-0.795-0.768-1.203-1.783-1.221-2.808s0.355-2.054 1.11-2.836l3.005-3.005c0.114-0.116 0.263-0.247 0.428-0.37 0.885-0.662 1.952-0.902 2.967-0.756s1.971 0.678 2.632 1.563c0.331 0.442 0.957 0.533 1.4 0.202s0.533-0.957 0.202-1.4z"></path></svg>
                    ` + getLanguage("menu_admin_monetization_approval_item_button:0") + `
                </div>
                <div class = "menu_admin_monetization_approval_item_right_button md-ripples" onclick = "adminMonetizationApprovalButton(` + menuNumber + `, ` + info["number"] + `, false);">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path></svg>
                    ` + getLanguage("menu_admin_monetization_approval_item_button:1") + `
                </div>
                <div class = "menu_admin_monetization_approval_item_right_button md-ripples" onclick = "adminMonetizationApprovalButton(` + menuNumber + `, ` + info["number"] + `, true);">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                    ` + getLanguage("menu_admin_monetization_approval_item_button:2") + `
                </div>
            </div>
        </div>
    `;
    
    items.appendChild(newEl);
}
























































function showAdminMonetizationApprovalMoreLoading(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let loading = contents.getElementsByClassName("admin_monetization_approval_contents_loading")[0];
    loading.style.display = "block";
}
function hideAdminMonetizationApprovalMoreLoading(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let loading = contents.getElementsByClassName("admin_monetization_approval_contents_loading")[0];
    loading.style.display = "none";
}
function checkAdminMonetizationApprovalMoreLoading(menuNumber) {
    if (adminMonetizationApprovalLoadNumbers[menuNumber].length == 0) {
        hideAdminMonetizationApprovalMoreLoading(menuNumber);
        adminMonetizationApprovalLoadNumbers[menuNumber] = null;
    } else {
        showAdminMonetizationApprovalMoreLoading(menuNumber);
    }
}

let isAdminMonetizationApprovalMoreLoad = new Array();

function checkAdminMonetizationApprovalLoad() {
    if (getCurrentMenuName() == "admin_monetization_approval") {
        let boxSize = 75;

        let scrollPercent = ((document.documentElement.scrollTop + window.innerHeight) / (document.documentElement.scrollHeight - boxSize)) * 100;
        if (scrollPercent >= 100) {
            let number = getCurrentMenuNumber();
            if (isAdminMonetizationApprovalMoreLoad[number] == null && adminMonetizationApprovalLoadNumbers[number] != null && adminMonetizationApprovalLoadNumbers[number][0] != "") {
                isAdminMonetizationApprovalMoreLoad[number] = true;
                moreLoadAdminMonetizationApproval(number);
            }
        }
    }
}
addEventListener("scroll", checkAdminMonetizationApprovalLoad);
addEventListener("resize", checkAdminMonetizationApprovalLoad);
addEventListener("focus", checkAdminMonetizationApprovalLoad);

function moreLoadAdminMonetizationApproval(menuNumber) {
    if (adminMonetizationApprovalLoadNumbers[menuNumber] == null || adminMonetizationApprovalLoadNumbers[menuNumber].length == 0) {
        adminMonetizationApprovalLoadNumbers[menuNumber] = null;
        isAdminMonetizationApprovalMoreLoad[menuNumber] = null;
        return;
    }

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/work/getInfo.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                for (let i = 0; i < info.length; i++) {
                    addItemAdminMonetizationApproval(menuNumber, info[i]);
            
                    let array = adminMonetizationApprovalLoadNumbers[menuNumber];
                    array = array.remove("" + info[i]["number"]);
                    adminMonetizationApprovalLoadNumbers[menuNumber] = array;
                }

                isAdminMonetizationApprovalMoreLoad[menuNumber] = null;
                checkAdminMonetizationApprovalMoreLoading(menuNumber);
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

    let numbers = adminMonetizationApprovalLoadNumbers[menuNumber];
    let numbersMaxCount = (numbers.length >= 20) ? 20 : numbers.length;
    numbers = numbers.splice(0, numbersMaxCount);
    
    var formData = new FormData();
    formData.append("numbers", numbers.join(","));
    formData.append("lang", userLanguage);

    xhr.send(formData);
}






























































function menuAdminMonetizationApprovalOptionLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("menu_admin_monetization_approval_items")[0];
    let sort_box = contents.getElementsByClassName("sort_box");

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/menu/admin/php/monetization_approval/getInfoNumbers.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                items.textContent = "";
                let numbers = info["numbers"].split(",");
                adminMonetizationApprovalLoadNumbers[menuNumber] = numbers;

                //
                if (numbers.length != 0 && numbers[0] != "") {
                    let worksInfo = info["info"];
                    for (let i = 0; i < worksInfo.length; i++) {
                        addItemAdminMonetizationApproval(menuNumber, worksInfo[i]);
                
                        let array = adminMonetizationApprovalLoadNumbers[menuNumber];
                        array = array.remove("" + worksInfo[i]["number"]);
                        adminMonetizationApprovalLoadNumbers[menuNumber] = array;
                    }
                    checkAdminMonetizationApprovalMoreLoading(menuNumber);
                } else {
                    noDataAdminMonetizationApproval(menuNumber);
                    hideAdminMonetizationApprovalMoreLoading(menuNumber);
                }

                isAdminMonetizationApprovalMoreLoad[menuNumber] = null;
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
    formData.append("workType", sort_box[1].getAttribute("value"));
    formData.append("language", sort_box[2].getAttribute("value"));
    formData.append("lang", userLanguage);

    xhr.send(formData);
}






















































function getMenuAdminMonetizationApprovalSortItems() {
    let items = new Array();
    items[0] = {
        "title": getLanguage("menu_admin_monetization_approval_sort:0"),
        "value": 0
    }
    items[1] = {
        "title": getLanguage("menu_admin_monetization_approval_sort:1"),
        "value": 1
    }
    return items;
}
function getMenuAdminMonetizationApprovalWorkTypeItems() {
    let items = new Array();
    items[0] = {
        "title": getLanguage("menu_admin_monetization_approval_work_type:0"),
        "value": 0
    }
    items[1] = {
        "title": getLanguage("work_settings_contents_type:0"),
        "value": 1
    }
    items[2] = {
        "title": getLanguage("work_settings_contents_type:1"),
        "value": 2
    }
    items[3] = {
        "title": getLanguage("work_settings_contents_type:2"),
        "value": 3
    }
    items[4] = {
        "title": getLanguage("work_settings_contents_type:3"),
        "value": 4
    }
    return items;
}


































































function adminMonetizationApprovalButton(menuNumber, workNumber, isAccept) {
    confirmPopup(getLanguage("menu_admin_monetization_approval_submit_confirm_popup:title"), getLanguage("menu_admin_monetization_approval_submit_confirm_popup:description"), 'requestAdminMonetizationApprovalButton(' + menuNumber + ', ' + workNumber + ', ' + isAccept + ');');
}
function requestAdminMonetizationApprovalButton(menuNumber, workNumber, isAccept) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("menu_admin_monetization_approval_items")[0];
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
    
    xhr.open(method, "/menu/admin/php/monetization_approval/submission.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText.trim();
                
                let height = item.clientHeight;
                item.style.maxHeight = height + "px";
                function callback() {
                    item.style.animation = "deleteAdminMonetizationApprovalItem 0.2s forwards";
                    item.style.maxHeight = "0px";
                    item.style.marginBottom = "0px";
                    setTimeout(() => {
                        item.remove();
    
                        //데이터 없음
                        if (child.length == 0 && (adminMonetizationApprovalLoadNumbers[menuNumber] == null || adminMonetizationApprovalLoadNumbers[menuNumber][0] == "")) {
                            noDataAdminMonetizationApproval(menuNumber);
                        }
                    }, 200);
                }
                window.requestAnimationFrame(callback);

                actionMessage(getLanguage("menu_admin_monetization_approval_submit_message"));
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
    formData.append("isAccept", isAccept);

    xhr.send(formData);
}