

var myWorkList = null;

function myWorkListCheck() {
    loginCheckLoading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    const url = "/php/work_list/myInfo.php";

    xhr.open(method, url);

    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                
                if (xhrHtml.trim() != '') {
                    let info = JSON.parse(xhrHtml);
                    myWorkList = new Array();
                    if (info != null) {
                        for (let i = 0; i < info.length; i++) {
                            myWorkList[myWorkList.length] = getInfoMyWorkList(info[i]);
                        }
                    }
                } else {
                    myWorkList = new Array();
                }

                loadMyWorkListBigSidebar();
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

    var formData = new FormData();
    formData.append("lang", userLanguage);
    xhr.send(formData);
}
function getInfoMyWorkList(info) {
    let workNumbers = info['work_numbers'];
    if (workNumbers != null && workNumbers != '') {
        let numbers = workNumbers.split(',');
        for (let i = 0; i < numbers.length; i++) {
            numbers[i] = Number.parseInt(numbers[i]);
        }
        workNumbers = numbers;
    } else {
        workNumbers = new Array();
    }
    let data = {
        'number': info['number'],
        'userNumber': info['user_number'],
        'thumbnail_image': info['thumbnail_image'],
        'title': info['title'],
        'count': info['count'],
        'workNumbers': workNumbers,
    }
    return data;
}
function insertMyWorkList(info) {
    myWorkList[myWorkList.length] = getInfoMyWorkList(info);

    loadMyWorkListBigSidebar();
}
function deleteMyWorkList(workListNumber) {
    let newInfo = new Array();
    for (let i = 0; i < myWorkList.length; i++) {
        if (myWorkList[i]['number'] != workListNumber) {
            newInfo[newInfo.length] = myWorkList[i];
        }
    }
    myWorkList = newInfo;

    loadMyWorkListBigSidebar();
}
function deleteWorkMyWorkList(workListNumber, workNumber) {
    for (let i = 0; i < myWorkList.length; i++) {
        if (myWorkList[i]['number'] == workListNumber) {
            let workNumbers = myWorkList[i]['workNumbers'];
            myWorkList[i]['workNumbers'] = workNumbers.remove(Number.parseInt(workNumber));
            myWorkList[i]['count'] --;
        }
    }

    loadMyWorkListBigSidebar();
}
function insertWorkMyWorkList(workListNumber, workNumber) {
    for (let i = 0; i < myWorkList.length; i++) {
        if (myWorkList[i]['number'] == workListNumber) {
            let workNumbers = myWorkList[i]['workNumbers'];
            workNumbers[workNumbers.length] = Number.parseInt(workNumber);
            myWorkList[i]['count'] ++;
        }
    }

    loadMyWorkListBigSidebar();
}
function changeTitleMyWorkList(workListNumber, title) {
    for (let i = 0; i < myWorkList.length; i++) {
        if (myWorkList[i]['number'] == workListNumber) {
            myWorkList[i]['title'] = title;
        }
    }

    loadMyWorkListBigSidebar();
}
function isExistWorkMyWorkList(workNumber) {
    if (myWorkList != null) {
        for (let j = 0; j < myWorkList.length; j++) {
            let workNumbers = myWorkList[j]["workNumbers"];
            for (let j2 = 0; j2 < workNumbers.length; j2++) {
                if (workNumbers[j2] == workNumber) {
                    return true;
                }
            }
        }
    }
    return false;
}
















let viewMoreElementMyWorkListBigSidebar = new Array();

function loadMyWorkListBigSidebar() {
    viewMoreElementMyWorkListBigSidebar = new Array();

    let big_sidebar_wrap = document.getElementsByClassName("big_sidebar_wrap");
    let wrap = null;
    for (let i = 0; i < big_sidebar_wrap.length; i++) {
        if (big_sidebar_wrap[i].getAttribute("type") == "my_work_list") {
            wrap = big_sidebar_wrap[i];
        }
    }
    wrap.style.display = "none";

    let big_sidebar_items = wrap.getElementsByClassName("big_sidebar_items")[0];
    big_sidebar_items.children[1].textContent = "";
    let items = big_sidebar_items.children[0];
    items.textContent = "";

    let view_more_button = big_sidebar_items.children[2].children[0];
    //
    view_more_button.style.display = "none";
    view_more_button.children[0].style.display = "none";
    view_more_button.children[1].style.display = "none";
    //간략히 보기
    view_more_button.children[1].getElementsByClassName("big_sidebar_item_text")[0].innerHTML = getLanguage("read_more:1");

    if (myWorkList.length != 0) {
        wrap.style.display = null;

        //최대 아이템 갯수
        let maxItemCount = 5;

        //
        let length = myWorkList.length;
        for (let i = 0; i < length; i++) {
            let el = getElementMyWorkListBigSidebar(myWorkList[i]);
            if (i >= maxItemCount == true) {
                viewMoreElementMyWorkListBigSidebar[viewMoreElementMyWorkListBigSidebar.length] = el;
            } else {
                items.appendChild(el);
            }
        }

        //{R:0}개 더보기
        if (viewMoreElementMyWorkListBigSidebar.length != 0) {
            let cutout = viewMoreElementMyWorkListBigSidebar.length;
            view_more_button.style.display = null;
            view_more_button.children[0].style.display = "flex";
            view_more_button.children[0].getElementsByClassName("big_sidebar_item_text")[0].innerHTML = getLanguage("view_more_count").replaceAll("{R:0}", commas(cutout));
        }
    }

    //더보기 여부
    if (big_sidebar_items.getAttribute("view_more") == "true") {
        showViewMoreMyWorkListBigSidebar(false);
    }
}
function toggleViewMoreMyWorkListBigSidebar() {
    let big_sidebar_wrap = document.getElementsByClassName("big_sidebar_wrap");
    let wrap = null;
    for (let i = 0; i < big_sidebar_wrap.length; i++) {
        if (big_sidebar_wrap[i].getAttribute("type") == "my_work_list") {
            wrap = big_sidebar_wrap[i];
        }
    }

    let big_sidebar_items = wrap.getElementsByClassName("big_sidebar_items")[0];
    let view_more = big_sidebar_items.getAttribute("view_more");
    if (view_more == "true") {
        hideViewMoreMyWorkListBigSidebar();
    } else if (view_more == "false") {
        showViewMoreMyWorkListBigSidebar();
    }
}
function showViewMoreMyWorkListBigSidebar(isAni) {
    (isAni == null) ? isAni = true : null;

    let big_sidebar_wrap = document.getElementsByClassName("big_sidebar_wrap");
    for (let i = 0; i < big_sidebar_wrap.length; i++) {
        if (big_sidebar_wrap[i].getAttribute("type") == "my_work_list") {
            let wrap = big_sidebar_wrap[i];

            let big_sidebar_items = wrap.getElementsByClassName("big_sidebar_items")[0];
            big_sidebar_items.setAttribute("view_more", true);
            let view_more_button = big_sidebar_items.children[2].children[0];
            let items = big_sidebar_items.children[1];
            items.textContent = "";
        
            view_more_button.children[0].style.display = "none";
            view_more_button.children[1].style.display = "flex";
        
            let viewMoreElement = viewMoreElementMyWorkListBigSidebar;
            let length = viewMoreElement.length;
            let html = "";
            for (let j = 0; j < length; j++) {
                if (j == 0) {
                    viewMoreElement[j].style.marginTop = "0px";
                }
                html += viewMoreElement[j].outerHTML;
            }
            items.innerHTML = html;
        
            if (isAni == true) {
                let height = items.clientHeight;
                items.style.height = "0px";
                items.style.opacity = 0;
                items.style.transition = "all 0.2s";
                function callback() {
                    items.style.opacity = 1;
                    items.style.height = height + "px";
                    setTimeout(() => {
                        items.style.opacity = null;
                        items.style.height = null;
                        items.style.transition = null;
                    }, 200);
                }
                window.requestAnimationFrame(callback);
            }
        }
    }
}
function hideViewMoreMyWorkListBigSidebar() {
    let big_sidebar_wrap = document.getElementsByClassName("big_sidebar_wrap");
    for (let i = 0; i < big_sidebar_wrap.length; i++) {
        if (big_sidebar_wrap[i].getAttribute("type") == "my_work_list") {
            let wrap = big_sidebar_wrap[i];

            let big_sidebar_items = wrap.getElementsByClassName("big_sidebar_items")[0];
            big_sidebar_items.setAttribute("view_more", false);
            let view_more_button = big_sidebar_items.children[2].children[0];
            let items = big_sidebar_items.children[1];

            view_more_button.children[0].style.display = "flex";
            view_more_button.children[1].style.display = "none";

            let height = items.clientHeight;

            items.style.height = height + "px";
            items.style.opacity = 1;
            items.style.transition = "all 0.2s";
            function callback() {
                items.style.opacity = 0;
                items.style.height = "0px";
                setTimeout(() => {
                    items.style.opacity = null;
                    items.style.height = null;
                    items.style.transition = null;

                    items.textContent = "";
                }, 200);
            }
            window.requestAnimationFrame(callback);
        }
    }
}
function getElementMyWorkListBigSidebar(info) {
    let thumbnail = '';
    if (info["thumbnail_image"] != null) {
        thumbnail = `
            <img src = "` + info["thumbnail_image"] + `" onload = "imageLoad(event);" alt = "">
        `;
    } else {
        thumbnail = `
            <div class = "big_sidebar_my_work_list_left_no_thumbnail">
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M9 1c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM3 9c0-1.294 0.416-2.491 1.116-3.472l8.356 8.356c-0.981 0.7-2.178 1.116-3.472 1.116-3.309 0-6-2.691-6-6zM13.884 12.472l-8.356-8.356c0.981-0.7 2.178-1.116 3.472-1.116 3.309 0 6 2.691 6 6 0 1.294-0.416 2.491-1.116 3.472z"></path></svg>
            </div>
        `;
    }

    let newEl = document.createElement("div");
    newEl.classList.add("big_sidebar_item");
    newEl.classList.add("md-ripples");
    newEl.setAttribute("tabindex", 0);
    newEl.setAttribute("onfocus", "focusAccessibility(event);");
    newEl.setAttribute("onclick", "loadMenu_work_list(" + info["number"] + ");");
    newEl.setAttribute("name", "big_sidebar_item_work_list");
    newEl.setAttribute("data", info["number"]);
    newEl.innerHTML = `
        <div class = "big_sidebar_item_line"></div>
        <div class = "big_sidebar_my_work_list_item">
            <div class = "big_sidebar_my_work_list_left img_wrap">
                ` + thumbnail + `
            </div>
            <div class = "big_sidebar_my_work_list_right">
                <div class = "big_sidebar_my_work_list_right_title">
                    ` + info["title"] + `
                </div>
                <div class = "big_sidebar_my_work_list_right_count">
                    ` + getLanguage("item_count").replaceAll("{R:0}", info["count"]) + `
                </div>
            </div>
        </div>
    `;
    return newEl;
}