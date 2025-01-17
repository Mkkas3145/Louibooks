



function menuUserLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let userNumber = Number.parseInt(contents.getElementsByClassName("user_number")[0].innerHTML);
    let myUserNumber = Number.parseInt(contents.getElementsByClassName("my_user_number")[0].innerHTML);

    //
    let user_info_item = contents.getElementsByClassName("menu_user_info_profile_right_bottom_item");
    let value = user_info_item[1].getAttribute("value");
    user_info_item[1].getElementsByTagName("span")[0].innerHTML = getLanguage("menu_user_info_works_count").replaceAll("{R:0}", commas(value));
    value = user_info_item[2].getAttribute("value");
    user_info_item[2].getElementsByTagName("span")[0].innerHTML = getViewsNumberUnit(value);
    value = user_info_item[3].getAttribute("value");
    user_info_item[3].getElementsByTagName("span")[0].innerHTML = getLanguage("menu_user_info_save_count").replaceAll("{R:0}", commas(value));
    //파트너인지
    value = user_info_item[0].getAttribute("value");
    if (value == 2) {
        user_info_item[0].setAttribute("onmouseenter", "hoverHelp(this, getLanguage('work_element_partner_plus_hover_description'));");
        user_info_item[0].style.cursor = "help";
        user_info_item[0].innerHTML = `
            ` + getSVGLouibooksLogo(4) + `
            ` + getLanguage("work_element_partner_plus_hover") + `
        `;
    } else if (value == 1) {
        user_info_item[0].setAttribute("onmouseenter", "hoverHelp(this, getLanguage('work_element_partner_hover_description'));");
        user_info_item[0].style.cursor = "help";
        user_info_item[0].innerHTML = `
            ` + getSVGLouibooksLogo(3) + `
            ` + getLanguage("work_element_partner_hover") + `
        `;
    } else {
        user_info_item[0].remove();
    }

    let user_save_button = contents.getElementsByClassName("menu_user_info_right_save_button")[0].getElementsByTagName("span");
    user_save_button[0].innerHTML = getLanguage("menu_user_save_user_list_0");
    user_save_button[1].innerHTML = getLanguage("menu_user_save_user_list_1");
    let management_button = contents.getElementsByClassName("menu_user_info_right_management_button")[0].getElementsByTagName("span")[0];
    management_button.innerHTML = getLanguage("menu_user_my_page_settings");

    //네비게이션 글자
    let navigation_item = contents.getElementsByClassName("menu_user_navigation_item");
    for (let i = 0; i < navigation_item.length; i++) {
        let navigation_name = navigation_item[i].getAttribute("navigation_name");
        navigation_item[i].innerText = getLanguage("user_navigation:" + navigation_name);
    }

    //내 페이지 설정 버튼
    management_button = contents.getElementsByClassName("menu_user_info_right_management_button")[0];
    user_save_button = contents.getElementsByClassName("menu_user_info_right_save_button")[0];
    if (userNumber == myUserNumber) {
        management_button.style.display = null;
        user_save_button.style.display = "none";
    }

    //내 페이지 아트
    let user_art = contents.getElementsByClassName("menu_user_art")[0];
    let artInfo = JSON.parse(user_art.innerHTML);
    if (artInfo != null) {
        if (artInfo["type"] == "image") {
            user_art.classList.add("img_wrap");
            user_art.innerHTML = `
                <img src = "` + artInfo["url"] + `" width = "` + artInfo["width"] + `" height = "` + artInfo["height"] + `" onload = "imageLoad(event);">
            `;
        }
        if (artInfo["type"] == "video") {
            user_art.classList.add("video_wrap");
            user_art.innerHTML = `
                <video src = "` + artInfo["url"] + `" onplay = "videoLoad(event);" width = "` + artInfo["width"] + `" height = "` + artInfo["height"] + `" autoplay loop muted></video>
            `;
        }
    } else {
        user_art.style.display = "none";
    }

    //내 페이지 설명
    let description = contents.getElementsByClassName("menu_user_info_profile_right_description")[0];
    if (description.innerHTML != "") {
        description.style.display = null;
        description.innerHTML = textToURL(JSON.parse(description.innerHTML));
    }

    userNavigation(menuNumber, 0);
    loadUserNavigationWorks(menuNumber);
    checkMenuUser();
}

function checkMyUserListMenuUserSaveButton(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    if (contents != null && contents.getAttribute("name") == "user") {
        function callback() {
            if (myUserList != null) {
                if (contents != null && contents.getElementsByClassName("user_number").length != 0) {
                    let userNumber = Number.parseInt(contents.getElementsByClassName("user_number")[0].innerHTML);
                    let saveButton = contents.getElementsByClassName("menu_user_info_right_save_button")[0];
                    let checked = isExistUserMyUserList(userNumber);

                    saveButton.setAttribute("checked", checked);
                }
            } else {
                window.requestAnimationFrame(callback);
            }
        }
        window.requestAnimationFrame(callback);
    }
}

function checkMenuUser() {
    if (getCurrentMenuName() == "user") {
        let menuNumber = getCurrentMenuNumber();
        let contents = document.getElementById("contents_" + menuNumber);

        //
        let header = document.getElementsByTagName("header")[0];
        let media = window.matchMedia("screen and (max-width: 700px)");

        let navigation = contents.getElementsByClassName("menu_user_navigation")[0];
        let navigationHeight = navigation.offsetHeight;

        let user_contents = contents.getElementsByClassName("menu_user_contents")[0];
        let headerHeight = header.clientHeight;
        if (media.matches == true) {
            headerHeight -= 5;
        }
        if (window.innerHeight > user_contents.clientHeight) {
            user_contents.style.marginBottom = ((window.innerHeight - user_contents.clientHeight) - (navigationHeight + headerHeight)) + "px";
        } else {
            user_contents.style.marginBottom = null;
        }

        //네비게이션 메뉴 고정
        let user_info = contents.getElementsByClassName("menu_user_info")[0];
        //모바일 헤더와 얼마나 떨어져 있는지
        let headerRect = header.getBoundingClientRect();
        let headerDistance = Math.floor(headerRect.top) - 1;

        let pageYOffset = window.pageYOffset;
        pageYOffset += 1;

        if (pageYOffset > getMenuUserNavigationScrollY()) {
            navigation.style.position = "fixed";
            navigation.style.marginTop = "0px";
            navigation.style.transform = "translateY(" + headerDistance + "px)";
            if (media.matches == true) {
                navigation.style.backgroundColor = "var(--background-color)";
            } else {
                navigation.style.backgroundColor = "var(--pc-background-color)";
            }
            user_info.style.marginBottom = (navigationHeight + 40) + "px";
        } else {
            navigation.style.position = null;
            navigation.style.marginTop = null;
            navigation.style.transform = null;
            navigation.style.backgroundColor = null;
            user_info.style.marginBottom = null;
        }
    }
}
addEventListener("scroll", checkMenuUser);
addEventListener("resize", checkMenuUser);
addEventListener("focus", checkMenuUser);



function getMenuUserNavigationScrollY() {
    let menuNumber = getCurrentMenuNumber();
    let contents = document.getElementById("contents_" + menuNumber);
    let header = document.getElementsByTagName("header")[0];

    //네비게이션 메뉴
    let navigation = contents.getElementsByClassName("menu_user_navigation")[0];
    let navigationHeight = navigation.offsetHeight;
    let user_contents = contents.getElementsByClassName("menu_user_contents")[0];
    let rect = user_contents.getBoundingClientRect();
    let contentsDistance = Math.floor(window.pageYOffset + contents.getBoundingClientRect().top);

    //모바일 헤더와 얼마나 떨어져 있는지
    let headerRect = header.getBoundingClientRect();
    let headerDistance = Math.floor(headerRect.top);

    return (((window.pageYOffset + rect.top) - navigationHeight) - contentsDistance) - headerDistance;
}






























function userNavigation(menuNumber, order) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("menu_user_navigation_items")[0].children;
    let line = contents.getElementsByClassName("menu_user_navigation_line")[0];

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
        items[i].classList.remove("menu_user_navigation_item_selected");
    }
    
    line.style.marginLeft = marginLeft + "px";
    line.style.width = items[order].clientWidth + "px";
    items[order].classList.add("menu_user_navigation_item_selected");
    setTimeout(() => {
        line.style.transition = "all 0.2s";
    }, 1);
}









function requestUserNavigation(menuNumber, name, data) {
    let contents = document.getElementById("contents_" + menuNumber);
    let user_contents = contents.getElementsByClassName("menu_user_contents")[0];
    let userNumber = Number.parseInt(contents.getElementsByClassName("user_number")[0].innerText.trim());
    
    let navigation_items = contents.getElementsByClassName("menu_user_navigation_items")[0].children;
    for (let i = 0; i < navigation_items.length; i++) {
        if (navigation_items[i].getAttribute("navigation_name") == name) {
            userNavigation(menuNumber, i);
        }
    }

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    const url = "/menu/user_navigation/" + name + ".php";

    xhr.open(method, url);

    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;

                //숨기기
                user_contents.style.opacity = 0;

                setTimeout(() => {
                    //스크롤 보존
                    let scrollY = window.pageYOffset;

                    //로드
                    user_contents.innerHTML = xhrHtml;
                    loadCompleteUserNavigation(menuNumber, name);

                    //표시
                    user_contents.style.opacity = null;

                    //
                    let navigationScrollY = getMenuUserNavigationScrollY();
                    (scrollY > navigationScrollY) ? scrollY = navigationScrollY : null;
                    window.scrollTo({
                        left: 0,
                        top: scrollY
                    });

                    previousScrollY = window.pageYOffset;
                }, 100);
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
    formData.append("lang", userLanguage);
    formData.append('menuNumber', menuNumber);
    formData.append('userNumber', userNumber);
    if (data != null) {
        formData.append('data', data);
    }

    xhr.send(formData);
}



function loadCompleteUserNavigation(menuNumber, name) {
    if (name == "works") {
        loadUserNavigationWorks(menuNumber);
    } else if (name == "created_work_list") {
        loadUserNavigationCreatedWorkList(menuNumber);
    } else if (name == "community") {
        loadUserNavigationCommunity(menuNumber);
    }

    checkMenuUser();
    function callback() {
        checkMenuUser();
    }
    window.requestAnimationFrame(callback);
}



























































function toggleMenuUserSaveUserList(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let save_button = contents.getElementsByClassName("menu_user_info_right_save_button")[0];
    let checked = save_button.getAttribute("checked");
    if (checked == "false") {
        requestMenuUserSaveUserListInsert(menuNumber);
    } else if (checked == "true") {
        requestMenuUserSaveUserListDelete(menuNumber);
    }
}

function requestMenuUserSaveUserListInsert(menuNumber) {
    if (loginStatus["isLogin"] == true) {
        let contents = document.getElementById("contents_" + menuNumber);
        let userNumber = Number.parseInt(contents.getElementsByClassName("user_number")[0].innerHTML);
        let profileInfo = JSON.parse(contents.getElementsByClassName("menu_user_info_profile_left")[0].getElementsByClassName("profile_info")[0].innerHTML);
        let nickname = contents.getElementsByClassName("menu_user_info_profile_right_nickname")[0].innerHTML.trim();

        //
        insertMyUserList({
            'userNumber': userNumber,
            'profileInfo': profileInfo,
            'nickname': nickname
        });
        actionMessage(getLanguage("save_user_list_message_insert").replaceAll("{R:0}", nickname));
        checkMyUserListMenuUserSaveButton(menuNumber);

        const xhr = new XMLHttpRequest();
        const method = "POST";
        const url = "/php/user_list/save_insert.php";
    
        xhr.open(method, url);
    
        xhr.addEventListener('readystatechange', function (event) {
            const { target } = event;
            if (target.readyState === XMLHttpRequest.DONE) {
                const { status } = target;
                if (status === 0 || (status >= 200 && status < 400)) {
                    let xhrHtml = xhr.responseText;
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
        formData.append('userNumber', userNumber);
    
        xhr.send(formData);
    } else {
        loadMenu_login();
    }
}
function requestMenuUserSaveUserListDelete(menuNumber) {
    if (loginStatus["isLogin"] == true) {
        let contents = document.getElementById("contents_" + menuNumber);
        let userNumber = Number.parseInt(contents.getElementsByClassName("user_number")[0].innerHTML);
        let nickname = contents.getElementsByClassName("menu_user_info_profile_right_nickname")[0].innerHTML.trim();

        //
        deleteMyUserList(userNumber);
        actionMessage(getLanguage("save_user_list_message_delete").replaceAll("{R:0}", nickname));
        checkMyUserListMenuUserSaveButton(menuNumber);

        const xhr = new XMLHttpRequest();
        const method = "POST";
        const url = "/php/user_list/save_delete.php";
    
        xhr.open(method, url);
    
        xhr.addEventListener('readystatechange', function (event) {
            const { target } = event;
            if (target.readyState === XMLHttpRequest.DONE) {
                const { status } = target;
                if (status === 0 || (status >= 200 && status < 400)) {
                    let xhrHtml = xhr.responseText;
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
        formData.append('userNumber', userNumber);
    
        xhr.send(formData);
    } else {
        loadMenu_login();
    }
}