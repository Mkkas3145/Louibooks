

var myUserList = null;

function myUserListCheck() {
    loginCheckLoading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    const url = "/php/user_list/myInfo.php";

    xhr.open(method, url);

    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                
                if (xhrHtml.trim() != '') {
                    let info = JSON.parse(xhrHtml);
                    myUserList = new Array();
                    if (info != null) {
                        for (let i = 0; i < info.length; i++) {
                            myUserList[myUserList.length] = info[i];
                        }
                    }
                } else {
                    myUserList = new Array();
                }

                loadMyUserListBigSidebar();
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
function insertMyUserList(info) {
    myUserList[myUserList.length] = info;
    loadMyUserListBigSidebar();
}
function deleteMyUserList(userNumber) {
    let newInfo = new Array();
    for (let i = 0; i < myUserList.length; i++) {
        if (myUserList[i]['userNumber'] != userNumber) {
            newInfo[newInfo.length] = myUserList[i];
        }
    }
    myUserList = newInfo;
    loadMyUserListBigSidebar();
}
function isExistUserMyUserList(userNumber) {
    for (let i = 0; i < myUserList.length; i++) {
        if (myUserList[i]["userNumber"] == userNumber) {
            return true;
        }
    }
    return false;
}































let viewMoreElementMyUserListBigSidebar = new Array();

function loadMyUserListBigSidebar() {
    viewMoreElementMyUserListBigSidebar = new Array();

    let big_sidebar_wrap = document.getElementsByClassName("big_sidebar_wrap");
    let wrap = null;
    for (let i = 0; i < big_sidebar_wrap.length; i++) {
        if (big_sidebar_wrap[i].getAttribute("type") == "my_user_list") {
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

    if (myUserList.length != 0) {
        wrap.style.display = null;

        //최대 아이템 갯수
        let maxItemCount = 5;

        //
        let length = myUserList.length;
        for (let i = 0; i < length; i++) {
            let el = getElementMyUserListBigSidebar(myUserList[i]);
            if (i >= maxItemCount == true) {
                viewMoreElementMyUserListBigSidebar[viewMoreElementMyUserListBigSidebar.length] = el;
            } else {
                items.appendChild(el);
            }
        }

        //{R:0}개 더보기
        if (viewMoreElementMyUserListBigSidebar.length != 0) {
            let cutout = viewMoreElementMyUserListBigSidebar.length;
            view_more_button.style.display = null;
            view_more_button.children[0].style.display = "flex";
            view_more_button.children[0].getElementsByClassName("big_sidebar_item_text")[0].innerHTML = getLanguage("view_more_count").replaceAll("{R:0}", commas(cutout));
        }
    }

    //더보기 여부
    if (big_sidebar_items.getAttribute("view_more") == "true") {
        showViewMoreMyUserListBigSidebar(false);
    }
}
function toggleViewMoreMyUserListBigSidebar() {
    let big_sidebar_wrap = document.getElementsByClassName("big_sidebar_wrap");
    let wrap = null;
    for (let i = 0; i < big_sidebar_wrap.length; i++) {
        if (big_sidebar_wrap[i].getAttribute("type") == "my_user_list") {
            wrap = big_sidebar_wrap[i];
        }
    }

    let big_sidebar_items = wrap.getElementsByClassName("big_sidebar_items")[0];
    let view_more = big_sidebar_items.getAttribute("view_more");
    if (view_more == "true") {
        hideViewMoreMyUserListBigSidebar();
    } else if (view_more == "false") {
        showViewMoreMyUserListBigSidebar();
    }
}
function showViewMoreMyUserListBigSidebar(isAni) {
    (isAni == null) ? isAni = true : null;

    let big_sidebar_wrap = document.getElementsByClassName("big_sidebar_wrap");
    for (let i = 0; i < big_sidebar_wrap.length; i++) {
        if (big_sidebar_wrap[i].getAttribute("type") == "my_user_list") {
            let wrap = big_sidebar_wrap[i];

            let big_sidebar_items = wrap.getElementsByClassName("big_sidebar_items")[0];
            big_sidebar_items.setAttribute("view_more", true);
            let view_more_button = big_sidebar_items.children[2].children[0];
            let items = big_sidebar_items.children[1];
            items.textContent = "";
        
            view_more_button.children[0].style.display = "none";
            view_more_button.children[1].style.display = "flex";
        
            let viewMoreElement = viewMoreElementMyUserListBigSidebar;
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
function hideViewMoreMyUserListBigSidebar() {
    let big_sidebar_wrap = document.getElementsByClassName("big_sidebar_wrap");
    for (let i = 0; i < big_sidebar_wrap.length; i++) {
        if (big_sidebar_wrap[i].getAttribute("type") == "my_user_list") {
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
function getElementMyUserListBigSidebar(info) {
    let newEl = document.createElement("div");
    newEl.classList.add("big_sidebar_item");
    newEl.classList.add("md-ripples");
    newEl.setAttribute("tabindex", 0);
    newEl.setAttribute("onfocus", "focusAccessibility(event);");
    newEl.setAttribute("onclick", "loadMenu_user(" + info["userNumber"] + ");");
    newEl.setAttribute("name", "big_sidebar_item_user");
    newEl.setAttribute("data", info["userNumber"]);
    newEl.innerHTML = `
        <div class = "big_sidebar_item_line"></div>
        <div class = "big_sidebar_my_user_list_item">
            <div class = "big_sidebar_my_user_list_left img_wrap">
                <div class = "profile_element">
                    <div class = "profile_info">` + JSON.stringify(info["profileInfo"]) + `</div>
                    <div class = "profile_image"></div>
                </div>
            </div>
            <div class = "big_sidebar_my_user_list_right">
                ` + info["nickname"] + `
            </div>
        </div>
    `;
    return newEl;
}