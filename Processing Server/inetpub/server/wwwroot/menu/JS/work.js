



function workLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let workNumber = Number.parseInt(contents.getElementsByClassName("work_number")[0].innerText.trim());

    //성인 (한국)
    let disableAdult = contents.getElementsByClassName("disable_adult")[0].innerHTML.trim();
    if (disableAdult == "true" || disableAdult == true) {

        contents.innerHTML = `
            <div class = "menu_work_disable_adult">
                <div class = "menu_work_disable_adult_box">
                    <div class = "menu_work_disable_adult_box_icon">
                        ` + getLanguage("adult_age") + `
                    </div>
                    <div class = "menu_work_disable_adult_box_title">
                        ` + getLanguage("menu_work_not_adult:title") + `
                    </div>
                    <div class = "menu_work_disable_adult_box_description">
                        ` + getLanguage("menu_work_not_adult:description") + `
                    </div>
                    <div class = "menu_work_disable_adult_box_button md-ripples" onclick = "window.open('https://bauth.bbaton.com/oauth/authorize?client_id=JDJhJDA0JE5CbUwwbXFidi9SZ2xhSWdNWjkwNHVyenB2Qk1LR2dTcUlsT05u&redirect_uri=https://louibooks.com/php/user/bbaton/callback.php&response_type=code&scope=read_profile', 'bbaton', 'width=400, height=500');">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-935,50a24.843,24.843,0,0,1-9.731-1.965,24.918,24.918,0,0,1-7.947-5.358,24.916,24.916,0,0,1-5.358-7.947A24.842,24.842,0,0,1-960,25a24.842,24.842,0,0,1,1.965-9.731,24.916,24.916,0,0,1,5.358-7.947,24.918,24.918,0,0,1,7.947-5.358A24.843,24.843,0,0,1-935,0a24.843,24.843,0,0,1,9.731,1.965,24.918,24.918,0,0,1,7.947,5.358,24.916,24.916,0,0,1,5.358,7.947A24.842,24.842,0,0,1-910,25a24.842,24.842,0,0,1-1.965,9.731,24.916,24.916,0,0,1-5.358,7.947,24.918,24.918,0,0,1-7.947,5.358A24.843,24.843,0,0,1-935,50Zm0-47a22.025,22.025,0,0,0-22,22,22.024,22.024,0,0,0,22,22,22.025,22.025,0,0,0,22-22A22.025,22.025,0,0,0-935,3Z" transform="translate(960)"></path><g transform="translate(-0.399)"><path d="M976.085,19.876V35.016h4.305V14.938h-2.625a17.727,17.727,0,0,1-5.875,2.953V21.5A9.479,9.479,0,0,0,976.085,19.876Z" transform="translate(-960)"></path><path d="M-954.751,20.268a12.083,12.083,0,0,1-4.171-.783V15.923a6.92,6.92,0,0,0,3.643,1.047,5.256,5.256,0,0,0,1.217-.125,4.427,4.427,0,0,0,3.256-3.248,7.721,7.721,0,0,0,.291-2.533,4.637,4.637,0,0,1-3.832,1.869,6.6,6.6,0,0,1-2.5-.51,5.565,5.565,0,0,1-2.6-2.566,6.343,6.343,0,0,1-.552-3.01,10.5,10.5,0,0,1,.822-3.549,5.716,5.716,0,0,1,1.32-1.625A6.98,6.98,0,0,1-953.249,0h.119A6.276,6.276,0,0,1-948.7,1.649,5.4,5.4,0,0,1-947.483,3.3a16.558,16.558,0,0,1,1.1,4.2,14.182,14.182,0,0,1-1.557,8.877,7.464,7.464,0,0,1-3.208,3.114A8.139,8.139,0,0,1-954.751,20.268Zm1.42-16.965a2.2,2.2,0,0,0-.36.026A2.909,2.909,0,0,0-955.3,4.667a4.53,4.53,0,0,0-.105,3.553,2.628,2.628,0,0,0,2.179,1.557c.075,0,.144,0,.211-.01a2.854,2.854,0,0,0,1.867-.923,3.277,3.277,0,0,0,.586-2.609C-950.893,3.589-952.608,3.3-953.331,3.3Z" transform="translate(985.143 14.866)"></path></g></g></svg>
                        ` + getLanguage("menu_work_not_adult:button") + `
                    </div>
                </div>
            </div>
        `;
        
        return;
    }
    
    //성인인지 질문 팝업
    let isHideAdultQuestions = getCookie("hideAdultQuestions");
    let adultQuestions = contents.getElementsByClassName("adult_questions")[0].innerHTML.trim();
    if ((isHideAdultQuestions == null || isHideAdultQuestions == "false" || isHideAdultQuestions == false) && (adultQuestions == "true" || adultQuestions == true)) {
        let workTitle = contents.getElementsByClassName("menu_work_info_right_title_left_text")[0].innerHTML.trim();
        openPopupContents("adult_questions", null, workTitle);
    }

    //알림 설정
    let bottom_right_item = contents.getElementsByClassName("menu_work_info_right_bottom_right_item");
    for (let i = 0; i < bottom_right_item.length; i++) {
        let type = bottom_right_item[i].getAttribute("type");
        if (type == "notifications_settings") {
            setNotificationsSettingsMenuWorkBottomButton(workNumber, bottom_right_item[i].getAttribute("value"));
            break;
        }
    }

    //작품 장르
    let description_genre = contents.getElementsByClassName("menu_work_info_right_description_genre")[0];
    let workGenre = description_genre.innerHTML.trim().split(",");
    if (workGenre.length != 0) {
        description_genre.textContent = "";
        for (let i = 0; i < workGenre.length; i++) {
            if (workGenre[i] != "") {
                let newEl = document.createElement("div");
                newEl.classList.add("menu_work_info_right_description_genre_item");
                newEl.innerHTML = getLanguage("genre:" + workGenre[i]);
                description_genre.appendChild(newEl);
            }
        }
    } else {
        description_genre.remove();
    }

    //작품 정보
    let info_item = contents.getElementsByClassName("menu_work_info_right_info_item");
    for (let i = 0; i < info_item.length; i++) {
        if (info_item[i].getAttribute("type") == "average_score") {
            let ratings = info_item[i].getElementsByTagName("span")[0];
            ratings.innerHTML = Number.parseFloat(ratings.innerHTML.trim()).toFixed(1);
        } else if (info_item[i].getAttribute("type") == "views") {
            let views = info_item[i].getElementsByTagName("span")[0];
            views.innerHTML = getViewsNumberUnit(Number.parseInt(views.innerHTML.trim()));
        } else if (info_item[i].getAttribute("type") == "part_count") {
            let partCount = info_item[i].getElementsByTagName("span")[0];
            partCount.innerHTML = getLanguage("work_round").replaceAll("{R:0}", commas(Number.parseInt(partCount.innerHTML.trim())))
        } else if (info_item[i].getAttribute("type") == "work_type") {
            let workType = info_item[i].innerHTML.trim();

            let icon = "";
            if (workType == 0) {
                icon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-72.583-761.2c-2.946-3.826-6.227-5.765-9.755-5.765h0c-6.133,0-11.229,5.774-11.281,5.833a1.5,1.5,0,0,1-1.126.517h-.006a1.5,1.5,0,0,1-1.124-.506c-3.431-3.877-7.015-5.844-10.651-5.844h0c-6.23,0-10.743,5.713-10.788,5.771a1.5,1.5,0,0,1-1.67.5A1.5,1.5,0,0,1-120-762.116v-30.063a1.5,1.5,0,0,1,.318-.922c3.574-4.578,7.7-6.9,12.273-6.9h0c5.73,0,10.491,3.7,12.606,5.656C-91.165-798.1-87.269-800-83.2-800c7.569,0,12.778,6.622,13,6.9a1.5,1.5,0,0,1,.313.917v30.063a1.5,1.5,0,0,1-1.017,1.42,1.5,1.5,0,0,1-.483.08A1.5,1.5,0,0,1-72.583-761.2Zm-20.812-4.26c2.423-1.988,6.408-4.5,11.056-4.5h0a13.728,13.728,0,0,1,9.444,3.972v-25.638a19,19,0,0,0-2.779-2.56A12.553,12.553,0,0,0-83.2-797c-3.485,0-6.913,1.867-10.191,5.549ZM-117-791.653v25.91a16.593,16.593,0,0,1,10.471-4.223h0a15.532,15.532,0,0,1,10.132,4.125v-25.873c-1.474-1.438-5.9-5.285-11.013-5.285h0C-110.882-797-114.105-795.2-117-791.653Z" transform="translate(119.895 805.308)"></path></g></svg>';
            } else if (workType == 1) {
                icon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M3,3H3V18H47V3H3M3,0H47a3,3,0,0,1,3,3V18a3,3,0,0,1-3,3H3a3,3,0,0,1-3-3V3A3,3,0,0,1,3,0Z"></path><path d="M1.5,925H27a1.5,1.5,0,0,1,1.329,2.195l-11.5,22A1.5,1.5,0,0,1,15.5,950H1.508a1.5,1.5,0,0,1-1.5-1.5L0,926.5A1.5,1.5,0,0,1,1.5,925Zm23.023,3H3l.007,19H14.592Z" transform="translate(0 -900)"></path><path d="M1.5,927H26a1.5,1.5,0,0,1,1.33,2.194l-11.5,22.03a1.5,1.5,0,0,1-1.33.806h-.006l-13.5-.053A1.5,1.5,0,0,1-.5,950.442L0,928.466A1.5,1.5,0,0,1,1.5,927Zm22.025,3H2.966l-.432,18.982,11.058.044Z" transform="translate(49.5 977) rotate(180)"></path></g></svg>';
            } else if (workType == 2) {
                icon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M121.5,500h47a1.5,1.5,0,0,1,1.5,1.5V516a1.5,1.5,0,0,1-1.218,1.473l-47,9A1.5,1.5,0,0,1,120,525V501.5A1.5,1.5,0,0,1,121.5,500Zm45.5,3H123v20.186l44-8.426Z" transform="translate(-120 -500)"></path><path d="M121.5,500h47a1.5,1.5,0,0,1,1.5,1.5V516a1.5,1.5,0,0,1-1.218,1.473l-47,9A1.5,1.5,0,0,1,120,525V501.5A1.5,1.5,0,0,1,121.5,500Zm45.5,3H123v20.186l44-8.426Z" transform="translate(170 550) rotate(180)"></path></g></svg>';
            } else if (workType == 3) {
                icon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M6.712,1000a1.5,1.5,0,0,1,.745.2l41.052,23.5a1.5,1.5,0,0,1,0,2.6L7.458,1049.8a1.5,1.5,0,0,1-2.245-1.3v-47a1.5,1.5,0,0,1,1.5-1.5Zm38.032,25L8.212,1004.087v41.826Z" transform="translate(0.736 -1000)"></path></g></svg>';
            }

            info_item[i].innerHTML = icon + getLanguage("work_settings_contents_type:" + workType);
        } else if (info_item[i].getAttribute("type") == "user_age") {
            let userAge = info_item[i].innerHTML.trim();

            let html = "";
            if (userAge == 0) {
                info_item[i].style.display = "none";
            } else if (userAge == 1) {
                html = `
                    <div class = "menu_work_info_right_info_item_user_age_need_attention">
                        15
                    </div>
                    ` + getLanguage("work_settings_user_age:1") + `
                `;
            } else if (userAge == 2) {
                html = `
                    <div class = "menu_work_info_right_info_item_user_age_adult">
                        ` + getLanguage("adult_age") + `
                    </div>
                    ` + getLanguage("work_settings_user_age:2") + `
                `;
            }

            info_item[i].innerHTML = html;
        } else if (info_item[i].getAttribute("type") == "partner") {
            let partner = info_item[i].innerHTML.trim();
            if (partner == 2) {
                info_item[i].setAttribute("onmouseenter", "hoverHelp(this, getLanguage('work_element_partner_plus_hover_description'));");
                info_item[i].style.cursor = "help";
                info_item[i].innerHTML = `
                    ` + getSVGLouibooksLogo(4) + `
                    ` + getLanguage("work_element_partner_plus_hover") + `
                `;
            } else if (partner == 1) {
                info_item[i].setAttribute("onmouseenter", "hoverHelp(this, getLanguage('work_element_partner_hover_description'));");
                info_item[i].style.cursor = "help";
                info_item[i].innerHTML = `
                    ` + getSVGLouibooksLogo(3) + `
                    ` + getLanguage("work_element_partner_hover") + `
                `;
            } else {
                info_item[i].remove();
                i--;
            }
        }
    }

    //네비게이션 글자
    let navigation_item = contents.getElementsByClassName("menu_work_navigation_item");
    for (let i = 0; i < navigation_item.length; i++) {
        let navigation_name = navigation_item[i].getAttribute("navigation_name");
        navigation_item[i].innerText = getLanguage("work_navigation:" + navigation_name);
    }

    //설명 자세히 보기
    let read_more_0 = contents.getElementsByClassName("menu_work_info_right_description_read_more_0")[0].getElementsByTagName("span")[0];
    let read_more_1 = contents.getElementsByClassName("menu_work_info_right_description_read_more_1")[0].getElementsByTagName("span")[0];
    read_more_0.innerText = getLanguage("read_more:0");
    read_more_1.innerText = getLanguage("read_more:1");

    //작품 관리 버튼
    let isCreator = contents.getElementsByClassName("is_creator")[0].innerText.trim();
    let management = contents.getElementsByClassName("menu_work_info_right_bottom_management")[0];
    if (isCreator == false) {
        management.style.display = "none";
    }

    //다음 회차
    let nextPartInfo = JSON.parse(contents.getElementsByClassName("next_part_info")[0].innerHTML);
    let next_part_button = contents.getElementsByClassName("menu_work_info_next_part_button")[0];
    let next_part_button_mobile = contents.getElementsByClassName("menu_work_next_part_mobile_box")[0];
    let management_button = contents.getElementsByClassName("menu_work_info_right_bottom_management")[0];
    if (nextPartInfo["info"] == null) {
        next_part_button.style.display = "none";
        next_part_button_mobile.style.display = "none";
        management_button.style.marginLeft = "0px";
    } else {
        let onclick = null;
        if (nextPartInfo["info"]["type"] == "novel") {
            onclick = `loadMenu_novel_viewer(` + nextPartInfo["info"]["number"] + `);`;
        } else if (nextPartInfo["info"]["type"] == "image_format") {
            onclick = `loadMenu_image_format_viewer(` + nextPartInfo["info"]["number"] + `);`;
        } else if (nextPartInfo["info"]["type"] == "video") {
            onclick = `loadMenu_video(` + nextPartInfo["info"]["number"] + `);`;
        }
    
        let category = '...';
        if (nextPartInfo["info"]["category"] == "episode") {
            let episode = nextPartInfo["info"]["episode"];
            category = getLanguage("work_part_category:episode_count").replaceAll("{R:0}", episode);
        } else {
            category = getLanguage("work_part_category:" + nextPartInfo["info"]["category"]);
        }
    
        let next_part_button_title = '...';
        if (nextPartInfo["type"] == "first_part") {
            next_part_button_title = getLanguage("first_part_view");
        } else if (nextPartInfo["type"] == "next_part") {
            next_part_button_title = getLanguage("next_part_view");
        } else if (nextPartInfo["type"] == "continue_viewed") {
            next_part_button_title = getLanguage("continue_part_view");
        } else if (nextPartInfo["type"] == "all_viewed") {
            next_part_button_title = getLanguage("latest_part_view");
        }

        let html = `
            <div class = "menu_work_info_next_part_button_left img_wrap">
                <img src = "` + nextPartInfo["info"]["thumbnail_image"] + `" onload = "imageLoad(event);">
            </div>
            <div class = "menu_work_info_next_part_button_center"></div>
            <div class = "menu_work_info_next_part_button_right">
                <div class = "menu_work_info_next_part_button_right_title">
                    ` + next_part_button_title + `
                </div>
                <div class = "menu_work_info_next_part_button_right_description">
                    <b>` + category + `</b> ` + nextPartInfo["info"]["title"] + `
                </div>
            </div>
            <div class = "menu_work_info_next_part_button_icon">
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.25 10l-7.141-7.42c-0.268-0.27-0.268-0.707 0-0.979 0.268-0.27 0.701-0.27 0.969 0l7.83 7.908c0.268 0.271 0.268 0.709 0 0.979l-7.83 7.908c-0.268 0.271-0.701 0.27-0.969 0s-0.268-0.707 0-0.979l7.141-7.417z"></path></svg>
            </div>
        `;
    
        next_part_button.setAttribute("onclick", onclick);
        next_part_button.innerHTML = html;
        next_part_button_mobile.setAttribute("onclick", onclick);
        next_part_button_mobile.innerHTML = html;
    }

    //커버 전체화면으로 보기
    let cover = contents.getElementsByClassName("menu_work_info_cover")[0];
    let coverUrl = cover.getElementsByTagName("img")[0].src;
    coverUrl = coverUrl.split("/");
    coverUrl = "https://img.louibooks.com/work_cover/original/" + coverUrl[coverUrl.length - 1];
    if (coverUrl[coverUrl.length - 2] == "work_cover") {
        coverUrl = "https://img.louibooks.com/work_cover/original/" + coverUrl[coverUrl.length - 1];
        cover.setAttribute("onclick", "fullScreenImage(new Array('" + coverUrl + "'));");
    } else {
        cover.setAttribute("onclick", "fullScreenImage(new Array('" + cover.getElementsByTagName("img")[0].src + "'));");
    }

    //아트 전체화면으로 보기
    let artImage = contents.getElementsByClassName("menu_work_art_image")[0];
    let artImageUrl = artImage.getElementsByTagName("img")[0].src;
    artImageUrl = artImageUrl.split("/");
    if (artImageUrl[artImageUrl.length - 2] == "work_art") {
        artImageUrl = "https://img.louibooks.com/work_art/" + artImageUrl[artImageUrl.length - 1];
        artImage.setAttribute("onclick", "fullScreenImage(new Array('" + artImageUrl + "'));");
    } else {
        artImage.setAttribute("onclick", "fullScreenImage(new Array('" + artImage.getElementsByTagName("img")[0].src + "'));");
    }

    workNavigation(menuNumber, 0);
    loadWorkNavigationHome(menuNumber);
    checkMenuWork();

    //로그 이벤트에 추가
    let visitType = Number.parseInt(contents.getElementsByClassName("visit_type")[0].innerHTML);
    let incomingUrl = contents.getElementsByClassName("incoming_url")[0].innerHTML.trim();
    let overlap = false;
    for (let j = 0; j < logEvent.length; j++) {
        if (logEvent[j]["log"] == 1 && logEvent[j]["workNumber"] == workNumber) {
            overlap = true;
            break;
        }
    }
    if (overlap == false) {
        if (incomingUrl == "null" || incomingUrl == null) {
            incomingUrl = null;
        }

        logEvent[logEvent.length] = {
            "log": 1,       //작품 방문
            "type": visitType,
            "incomingUrl": incomingUrl,
            "workNumber": workNumber
        }
    }
}
function checkMyWorkListMenuWorkBottomButton(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    if (contents != null && (contents.getAttribute("name") == "work" || contents.getAttribute("name") == "search" || contents.getAttribute("name") == "video")) {
        function callback() {
            if (myWorkList != null) {
                if (contents != null) {
                    let bottom_right_item = contents.getElementsByClassName("menu_work_info_right_bottom_right_item");
                    
                    for (let i = 0; i < bottom_right_item.length; i++) {
                        let type = bottom_right_item[i].getAttribute("type");
                        if (type == "work_list") {
                            let workNumber = Number.parseInt(bottom_right_item[i].getAttribute("work_number"));
                            let work_list_button = bottom_right_item[i];
                            //체크 여부
                            work_list_button.setAttribute("checked", isExistWorkMyWorkList(workNumber));
                            break;
                        }
                    }
                }
            } else {
                window.requestAnimationFrame(callback);
            }
        }
        window.requestAnimationFrame(callback);
    }
}

function checkMenuWork() {
    if (getCurrentMenuName() == "work") {
        let menuNumber = getCurrentMenuNumber();
        let contents = document.getElementById("contents_" + menuNumber);

        //
        if (contents.getElementsByClassName("menu_work_art").length == 0) {
            return;
        }

        //
        let header = document.getElementsByTagName("header")[0];

        let navigation = contents.getElementsByClassName("menu_work_navigation")[0];
        let navigationHeight = navigation.offsetHeight;

        let work_contents = contents.getElementsByClassName("menu_work_contents")[0];
        let headerHeight = header.clientHeight;
        let media = window.matchMedia("screen and (max-width: 700px)");
        if (media.matches == true) {
            headerHeight -= 5;
        }
        if (window.innerHeight > work_contents.clientHeight) {
            let marginBottom = ((window.innerHeight - work_contents.clientHeight) - (navigationHeight + headerHeight));
            if (marginBottom > 0) {
                work_contents.style.marginBottom = (marginBottom + "px");
            } else {
                work_contents.style.marginBottom = null;
            }
        } else {
            work_contents.style.marginBottom = null;
        }

        //설명 자세히 보기
        let description = contents.getElementsByClassName("menu_work_info_right_description_text")[0];
        let read_more = contents.getElementsByClassName("menu_work_info_right_description_read_more")[0];
        let read_more_value = read_more.getAttribute("value");
        if (description.clientHeight != description.scrollHeight || read_more_value == 1) {
            read_more.style.display = "block";
        } else {
            read_more.style.display = "none";
        }

        //네비게이션 메뉴 고정
        let work_info = contents.getElementsByClassName("menu_work_info")[0];
        //모바일 헤더와 얼마나 떨어져 있는지
        let headerRect = header.getBoundingClientRect();
        let headerDistance = Math.floor(headerRect.top) - 1;

        let pageYOffset = window.pageYOffset;
        if (media.matches == true) {
            pageYOffset += 11;
        } else {
            pageYOffset += 1;
        }

        if (pageYOffset > (getMenuWorkNavigationScrollY() + 1)) {
            navigation.style.position = "fixed";
            navigation.style.marginTop = "0px";
            navigation.style.transform = "translateY(" + headerDistance + "px)";
            if (media.matches == true) {
                navigation.style.backgroundColor = "var(--background-color)";
            } else {
                navigation.style.backgroundColor = "var(--pc-background-color)";
            }
            work_info.style.marginBottom = (navigationHeight + 10) + "px";
        } else {
            navigation.style.position = null;
            navigation.style.marginTop = null;
            navigation.style.transform = null;
            navigation.style.backgroundColor = null;
            work_info.style.marginBottom = null;
        }
    }
}
addEventListener("scroll", checkMenuWork);
addEventListener("resize", checkMenuWork);
addEventListener("focus", checkMenuWork);

function delayCheckMenuWork() {
    function callback() {
        checkMenuWork();
    }
    window.requestAnimationFrame(callback);
}



function getMenuWorkNavigationScrollY() {
    let menuNumber = getCurrentMenuNumber();
    let contents = document.getElementById("contents_" + menuNumber);
    let header = document.getElementsByTagName("header")[0];

    //네비게이션 메뉴
    let navigation = contents.getElementsByClassName("menu_work_navigation")[0];
    let navigationHeight = navigation.offsetHeight;
    let work_contents = contents.getElementsByClassName("menu_work_contents")[0];
    let rect = work_contents.getBoundingClientRect();
    let contentsDistance = Math.floor(window.pageYOffset + contents.getBoundingClientRect().top);

    //모바일 헤더와 얼마나 떨어져 있는지
    let headerRect = header.getBoundingClientRect();
    let headerDistance = Math.floor(headerRect.top);

    return ((((window.pageYOffset + rect.top) - navigationHeight) - contentsDistance) - headerDistance) + 20;
}



function workNavigation(menuNumber, order) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("menu_work_navigation_items")[0].children;
    let line = contents.getElementsByClassName("menu_work_navigation_line")[0];

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
        items[i].classList.remove("menu_work_navigation_item_selected");
    }
    
    line.style.marginLeft = marginLeft + "px";
    line.style.width = items[order].clientWidth + "px";
    items[order].classList.add("menu_work_navigation_item_selected");
    setTimeout(() => {
        line.style.transition = "all 0.2s";
    }, 1);
}

function requestWorkNavigation(menuNumber, name, data) {
    let contents = document.getElementById("contents_" + menuNumber);
    let work_contents = contents.getElementsByClassName("menu_work_contents")[0];
    let workNumber = Number.parseInt(contents.getElementsByClassName("work_number")[0].innerText.trim());
    
    let navigation_items = contents.getElementsByClassName("menu_work_navigation_items")[0].children;
    for (let i = 0; i < navigation_items.length; i++) {
        if (navigation_items[i].getAttribute("navigation_name") == name) {
            workNavigation(menuNumber, i);
        }
    }

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    const url = "/menu/work_navigation/" + name + ".php";

    xhr.open(method, url);

    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;

                //숨기기
                work_contents.style.opacity = 0;

                setTimeout(() => {
                    //스크롤 보존
                    let scrollY = window.pageYOffset;

                    //로드
                    work_contents.innerHTML = xhrHtml;
                    loadCompleteWorkNavigation(menuNumber, name);

                    //표시
                    work_contents.style.opacity = null;

                    //
                    let navigationScrollY = getMenuWorkNavigationScrollY();
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
    formData.append('workNumber', workNumber);
    if (data != null) {
        formData.append('data', data);
    }

    xhr.send(formData);
}

function loadCompleteWorkNavigation(menuNumber, name) {
    if (name == "home") {
        loadWorkNavigationHome(menuNumber);
    } else if (name == "part_list") {
        loadWorkNavigationPartList(menuNumber);
    } else if (name == "ratings") {
        loadWorkNavigationRatings(menuNumber);
    } else if (name == "comments") {
        loadWorkNavigationComments(menuNumber);
    } else if (name == "community") {
        loadWorkNavigationCommunity(menuNumber);
    } else if (name == "details") {
        loadWorkNavigationDetails(menuNumber);
    }

    checkMenuWork();
    function callback() {
        checkMenuWork();
    }
    window.requestAnimationFrame(callback);
}




















function menuWorkDescriptionReadMore(menuNumber, value) {
    let contents = document.getElementById("contents_" + menuNumber);
    let description = contents.getElementsByClassName("menu_work_info_right_description_text")[0];
    let genre = contents.getElementsByClassName("menu_work_info_right_description_genre");
    let read_more = contents.getElementsByClassName("menu_work_info_right_description_read_more")[0];
    read_more.setAttribute("value", value);
    
    if (value == 1) {
        description.style.height = description.clientHeight + "px";
        description.style.display = "block";
        setTimeout(() => {
            description.style.height = description.scrollHeight + "px";
        }, 10);
        setTimeout(() => {
            description.style.height = "max-content";
            checkMenuWork();
        }, 210);
    } else if (value == 0) {
        let height = description.clientHeight;
        description.style.display = "-webkit-box";
        let min_height = description.clientHeight;
        description.style.height = height + "px";
        setTimeout(() => {
            description.style.height = min_height + "px";
        }, 10);
        setTimeout(() => {
            description.style.height = "max-content";
            checkMenuWork();
        }, 210);

        if (genre.length != 0) {
            genre = genre[0];
            genre.style.opacity = 0;
            setTimeout(() => {
                genre.style.opacity = null;
            }, 210);
        }
    }
}
function toggleMenuWorkDescriptionReadMore(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let read_more = contents.getElementsByClassName("menu_work_info_right_description_read_more")[0];
    let value = read_more.getAttribute("value");
    
    if (value == "0") {
        menuWorkDescriptionReadMore(menuNumber, 1);
    } else if (value == "1") {
        menuWorkDescriptionReadMore(menuNumber, 0);
    }
}



























function hideMenuWorkNextPartMobileButton() {
    if (getCurrentMenuName() == "work") {
        let menuNumber = getCurrentMenuNumber();
        let contents = document.getElementById("contents_" + menuNumber);
        let nextPartMobileBox = contents.getElementsByClassName("menu_work_next_part_mobile_box")[0];
        if (nextPartMobileBox != null) {
            nextPartMobileBox.classList.add("hide_menu_work_next_part_mobile_box");
        }
        let work_contents = contents.getElementsByClassName("menu_work_contents")[0];
        if (work_contents != null) {
            work_contents.classList.remove("show_next_part_mobile_work_contents");
        }
    }
}
function showMenuWorkNextPartMobileButton() {
    let menuNumber = getCurrentMenuNumber();
    let contents = document.getElementById("contents_" + menuNumber);
    let nextPartMobileBox = contents.getElementsByClassName("menu_work_next_part_mobile_box")[0];
    if (nextPartMobileBox != null) {
        nextPartMobileBox.classList.remove("hide_menu_work_next_part_mobile_box");
    }
    let work_contents = contents.getElementsByClassName("menu_work_contents")[0];
    
    let media = window.matchMedia("screen and (max-width: 700px)");
    if (work_contents != null && media.matches == true && nextPartMobileBox.innerHTML.trim() != "") {
        work_contents.classList.add("show_next_part_mobile_work_contents");
    } else {
        work_contents.classList.remove("show_next_part_mobile_work_contents");
    }
}

function registerMenuWorkNextPartMobileButton() {
    function callback() {
        if (getCurrentMenuName() == "work") {
            let virtual_keyboard_box = document.getElementsByClassName("add_comments_virtual_keyboard_box")[0];
            if (virtual_keyboard_box.innerHTML != "") {
                hideMenuWorkNextPartMobileButton();
            } else {
                showMenuWorkNextPartMobileButton();
            }
        }
        window.requestAnimationFrame(callback);
    }
    window.requestAnimationFrame(callback);
}
registerMenuWorkNextPartMobileButton();









function setNotificationsSettingsMenuWorkBottomButton(workNumber, value) {
    let bottom_right_item = document.getElementsByClassName("menu_work_info_right_bottom_right_item");
                    
    for (let i = 0; i < bottom_right_item.length; i++) {
        let type = bottom_right_item[i].getAttribute("type");
        if (type == "notifications_settings") {
            let buttonWorkNumber = Number.parseInt(bottom_right_item[i].getAttribute("work_number"));

            if (buttonWorkNumber == workNumber) {
                let button = bottom_right_item[i];
                button.setAttribute("value", value);
            }
        }
    }
}

function requestWorkNotificationsSettings(workNumber, value) {
    //액션 메세지
    actionMessage(getLanguage("change_settings_work_notifications_message").replaceAll("{R:0}", getLanguage("menu_work_notifications_select:" + value)));
    //
    setNotificationsSettingsMenuWorkBottomButton(workNumber, value);

    const xhr = new XMLHttpRequest();
    const method = "POST";
    const url = "/php/work/notifications_settings.php";

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
    formData.append('workNumber', workNumber);
    formData.append("type", value);

    xhr.send(formData);
}

function getMenuWorkNotificationsSettingsItems() {
    let items = new Array();
    items[0] = {
        "icon": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M42.282,39.4h0l-.226,0H1.251C.557,39.4.2,39.3.065,39.075c-.221-.363.152-1.085.769-2.282,1.4-2.715,4.315-8.364,4.6-18.745a21.434,21.434,0,0,1,1.682-8.6,15.31,15.31,0,0,1,4.146-5.562A17.322,17.322,0,0,1,22.285,0a16.042,16.042,0,0,1,10.5,4.409,18.085,18.085,0,0,1,5.659,13.638c.141,10.246,2.863,15.713,4.326,18.65.617,1.238.989,1.986.755,2.364C43.375,39.3,43,39.4,42.282,39.4ZM22.187,3.026c-6.61,0-13.7,4.015-13.76,15.285a46.872,46.872,0,0,1-2.09,13.2,29.949,29.949,0,0,1-1.958,4.9L39.3,36.4s0,0-.006-.009a27.524,27.524,0,0,1-1.879-4.733,47.874,47.874,0,0,1-2-13.351C35.34,7.268,27.28,3.075,22.217,3.026Z" transform="translate(3.124 0.378)"/><path d="M6.4,0a6.4,6.4,0,0,1,6.4,6.4H0A6.4,6.4,0,0,1,6.4,0Z" transform="translate(30.704 50) rotate(180)"/><rect width="3" height="62" rx="1.5" transform="translate(2.019 4.14) rotate(-45)"/></g></svg>',
        "title": getLanguage("menu_work_notifications_select:0"),
        "value": 0
    }
    items[1] = {
        "icon": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M42.282,39.4h0l-.226,0H1.251C.557,39.4.2,39.3.065,39.075c-.221-.363.152-1.085.769-2.282,1.4-2.715,4.315-8.364,4.6-18.745a21.434,21.434,0,0,1,1.682-8.6,15.31,15.31,0,0,1,4.146-5.562A17.322,17.322,0,0,1,22.285,0a16.042,16.042,0,0,1,10.5,4.409,18.085,18.085,0,0,1,5.659,13.638c.141,10.246,2.863,15.713,4.326,18.65.617,1.238.989,1.986.755,2.364C43.375,39.3,43,39.4,42.282,39.4ZM22.187,3.026c-6.61,0-13.7,4.015-13.76,15.285a46.872,46.872,0,0,1-2.09,13.2,29.949,29.949,0,0,1-1.958,4.9L39.3,36.4s0,0-.006-.009a27.524,27.524,0,0,1-1.879-4.733,47.874,47.874,0,0,1-2-13.351C35.34,7.268,27.28,3.075,22.217,3.026Z" transform="translate(3.124 0.378)"/><path d="M6.4,0a6.4,6.4,0,0,1,6.4,6.4H0A6.4,6.4,0,0,1,6.4,0Z" transform="translate(30.704 50) rotate(180)"/></g></svg>',
        "title": getLanguage("menu_work_notifications_select:1"),
        "value": 1
    }
    items[2] = {
        "icon": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M21.026-.544C27.557-.544,37.1,5.2,37.182,17.5c.246,17.883,8.487,21.471,3.614,21.348H.083c-4.466.05,3.6-3.546,4.093-21.348C4.259,3.8,14.021-.544,21.026-.544Z" transform="translate(4.383 0.922)"/><path d="M16.939-.544c5.739.056,13.127,4.863,13.194,15.285.157,11.479,3.888,18.093,3.888,18.093L-.9,32.84s3.872-7.043,4.048-18.1C3.216,3.138,10.744-.556,16.939-.544Z" transform="translate(8.401 3.948)"/><path d="M6.4,0a6.4,6.4,0,0,1,6.4,6.4H0A6.4,6.4,0,0,1,6.4,0Z" transform="translate(30.704 50) rotate(180)"/><path d="M8.583.607a1.307,1.307,0,0,1-.192,1.83A14.28,14.28,0,0,0,4.343,8.372,23.949,23.949,0,0,0,3,17.5a1.5,1.5,0,0,1-3,0S-.171,11.456,1.5,7.282A18.529,18.529,0,0,1,6.6.41,1.731,1.731,0,0,1,8.583.607Z" transform="translate(0.005 0.24)"/><path d="M.282.61A1.314,1.314,0,0,0,.475,2.45,14.364,14.364,0,0,1,4.546,8.42,24.089,24.089,0,0,1,5.9,17.6a1.509,1.509,0,0,0,3.018,0s.172-6.079-1.509-10.277A18.637,18.637,0,0,0,2.28.411,1.742,1.742,0,0,0,.282.61Z" transform="translate(41.08 0.186)"/></g></svg>',
        "title": getLanguage("menu_work_notifications_select:2"),
        "value": 2
    }
    return items;
}

























function menuWorkShare(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let workNumber = contents.getElementsByClassName("work_number")[0].textContent.trim();

    let title = contents.getElementsByClassName("menu_work_info_right_title_left_text")[0].innerText.trim();
    let description = contents.getElementsByClassName("menu_work_info_right_description_text")[0].innerText.trim();

    let shareData = {
        title: title,
        text: description,
        url: "https://louibooks.com/work/" + workNumber
    };

    if (navigator.canShare && navigator.canShare(shareData)) {
        window.navigator.share(shareData);
    };
}




















function menuWorkMoreButton(el, menuNumber, creatorNumber, workNumber) {
    let isCreator = false;
    if (loginStatus["isLogin"] == true && loginStatus["number"] == creatorNumber) {
        isCreator = true;
    }

    let slot = new Array();
    //작품 관리
    if (isCreator == true) {
        slot[slot.length] = {
            'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-4.438,42.27v0L.4,28.587,21.847,7.145a2.12,2.12,0,0,1,1.506-.632,1.945,1.945,0,0,1,1.387.567l7.071,7.071a1.944,1.944,0,0,1,.567,1.433,2.125,2.125,0,0,1-.632,1.459L10.3,38.487-4.436,42.27ZM23.387,9.839h0L3.162,30.064-.327,38.621l9.154-2.892L29.052,15.5,23.387,9.839Z" transform="translate(5.102 6.536)"></path><path d="M28.7,19.1a1.987,1.987,0,0,1-1.414-.586l-7.071-7.071a2,2,0,0,1,0-2.828l6.368-6.368a2,2,0,0,1,2.829,0l7.071,7.071a2,2,0,0,1,0,2.828L30.116,18.51A1.987,1.987,0,0,1,28.7,19.1ZM27.995,5.067h0l-4.95,4.95,5.666,5.665,4.95-4.949L27.995,5.067Z" transform="translate(12.102 -0.464)"></path></g></svg>',
            'title': getLanguage("menu_work_management_button"),
            'onclick': 'loadWorkspace_work_details(' + workNumber + ');'
        };
    }
    //
    if (contents.getElementsByClassName("menu_work_info_cover").length != 0) {
        slot[slot.length] = {
            'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="22" transform="translate(32.74 10.201) rotate(60)"></rect><rect width="3" height="22" transform="translate(34.437 37.201) rotate(120)"></rect><path d="M8,16a8,8,0,1,1,8-8A8.009,8.009,0,0,1,8,16ZM8,3a5,5,0,1,0,5,5A5.006,5.006,0,0,0,8,3Z" transform="translate(32)"></path><path d="M8,16a8,8,0,1,1,8-8A8.009,8.009,0,0,1,8,16ZM8,3a5,5,0,1,0,5,5A5.006,5.006,0,0,0,8,3Z" transform="translate(1 17)"></path><path d="M8,16a8,8,0,1,1,8-8A8.009,8.009,0,0,1,8,16ZM8,3a5,5,0,1,0,5,5A5.006,5.006,0,0,0,8,3Z" transform="translate(32 33)"></path></g></svg>',
            'title': getLanguage("menu_work_bottom_button:share"),
            'onclick': 'menuWorkShare(' + menuNumber + ');'
        };
    } else {
        slot[slot.length] = {
            'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="22" transform="translate(32.74 10.201) rotate(60)"></rect><rect width="3" height="22" transform="translate(34.437 37.201) rotate(120)"></rect><path d="M8,16a8,8,0,1,1,8-8A8.009,8.009,0,0,1,8,16ZM8,3a5,5,0,1,0,5,5A5.006,5.006,0,0,0,8,3Z" transform="translate(32)"></path><path d="M8,16a8,8,0,1,1,8-8A8.009,8.009,0,0,1,8,16ZM8,3a5,5,0,1,0,5,5A5.006,5.006,0,0,0,8,3Z" transform="translate(1 17)"></path><path d="M8,16a8,8,0,1,1,8-8A8.009,8.009,0,0,1,8,16ZM8,3a5,5,0,1,0,5,5A5.006,5.006,0,0,0,8,3Z" transform="translate(32 33)"></path></g></svg>',
            'title': getLanguage("menu_work_bottom_button:share"),
            'onclick': 'menuVideoShare(' + menuNumber + ');'
        };
    }
    if (isCreator == false) {
        let contents = document.getElementById("contents_" + menuNumber);

        let cover = null;
        let title = null;
        let description = null;
        if (contents.getElementsByClassName("menu_work_info_cover").length != 0) {
            cover = contents.getElementsByClassName("menu_work_info_cover")[0].getElementsByTagName("img")[0].src;
            title = contents.getElementsByClassName("menu_work_info_right_title_left_text")[0].innerHTML.trim().replaceAll("\n", " ");

            let newEl = document.createElement("div");
            newEl.innerHTML = contents.getElementsByClassName("menu_work_info_right_description_text")[0].innerHTML;
            newEl.getElementsByClassName("menu_work_info_right_description_genre")[0].remove();

            description = newEl.innerHTML.trim().replaceAll("\n", " ");
        } else {
            let workInfo = JSON.parse(contents.getElementsByClassName("work_info")[0].innerHTML);
            cover = workInfo["cover_image"];
            title = workInfo["title"];
            description = workInfo["description"];
        }

        let workInfo = {
            "coverImage": cover,
            "title": title,
            "description": description
        }
        let workReport = {
            "workNumber": workNumber,
            "workInfo": workInfo
        };
        slot[slot.length] = {
            'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5" transform="translate(9)"></rect><path d="M13.422,25.422s6.941-3.318,12.163-3.086,17.81,4.641,17.81,4.641V9.456S27.963,4,24.656,3.945s-9.456,2.9-9.456,2.9L13.422,4.235S18.913.754,24.25,1.1,43.395,6.15,43.395,6.15h3.249V30.806L25.584,25.422S18.391,25.816,15.2,27.9Z" transform="translate(-0.449)"></path></g></svg>',
            'title': getLanguage("work_report"),
            'onclick': '(loginStatus[\'isLogin\'] == true) ? openPopupContents(\'work_report\', null, \'' + JSON.stringify(workReport).replaceAll("\"", "\\&quot;").replaceAll("'", "\\\'") + '\') : loadMenu_login();'
        };
    }
    moreButton(el, slot);
}