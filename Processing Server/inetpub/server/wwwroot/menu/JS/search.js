

var searchLoadNumbers = new Array();

function searchLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let result = JSON.parse(contents.getElementsByClassName("search_result")[0].innerHTML);
    let processingTime = Math.floor(result["processingTime"] / 100) * 100;
    let worksInfo = result["works"]["info"];

    let top_right = contents.getElementsByClassName("menu_search_top_right")[0];
    top_right.innerHTML = getLanguage("menu_search_result").replaceAll("{R:0}", commas(result["count"])).replaceAll("{R:1}", processingTime);
    let left_sort = contents.getElementsByClassName("menu_search_top_left_sort")[0].getElementsByTagName("span")[0];
    left_sort.innerHTML = getLanguage("menu_search_filter_button");

    //유효하지 않은 쿼리
    if (result["status"] == 1) {
        searchNoResult(menuNumber);
    }

    //유효한 쿼리
    if (result["status"] == 0) {
        //사용자 정보
        let userInfo = result["userInfo"];
        if (userInfo != null) {
            let description = "";
            if (userInfo["description"] != null && userInfo["description"] != "") {
                description = `
                    <div class = "search_contents_left_user_info_right_description">
                        ` + userInfo["description"] + `
                    </div>
                `;
            }
            let line = "";
            if (worksInfo != null) {
                line = '<div class = "search_contents_left_user_info_line"></div>';
            }
            let search_items = contents.getElementsByClassName("search_contents_left_items")[0];
            let newEl = document.createElement("div");
            newEl.classList.add("visible_element");
            newEl.innerHTML = `
                <div class = "search_contents_left_user_info md-ripples" onclick = "loadMenu_user(` + userInfo["number"] + `);">
                    <div class = "search_contents_left_user_info_left">
                        <div class = "profile_element">
                            <div class = "profile_info">` + JSON.stringify(userInfo["profile"]) + `</div>
                            <div class = "profile_image"></div>
                        </div>
                    </div>
                    <div class = "search_contents_left_user_info_right">
                        <div class = "search_contents_left_user_info_right_nickname">
                            ` + userInfo["nickname"] + `
                        </div>
                        <div class = "search_contents_left_user_info_right_works_count">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,22A11,11,0,0,1,3.222,3.222,11,11,0,1,1,18.778,18.778,10.928,10.928,0,0,1,11,22ZM11,3a8,8,0,1,0,8,8A8.009,8.009,0,0,0,11,3Z" transform="translate(14)"></path><path d="M29.719,61H19A19,19,0,0,1,0,42V24A19,19,0,0,1,19,5h8.569a18.6,18.6,0,0,0-2.918,3.5H18.719a16.018,16.018,0,0,0-16,16v18a16.018,16.018,0,0,0,16,16h11a16.018,16.018,0,0,0,16-16V36.169a18.429,18.429,0,0,0,3-1.233V42a19,19,0,0,1-19,19Z" transform="translate(1.281 20)"></path><g transform="translate(1.849 -0.459)"><rect width="3" height="17" rx="1.5" transform="translate(23.151 35.438) rotate(-45)"></rect><rect width="3" height="23" rx="1.5" transform="translate(44.884 26.041) rotate(30)"></rect></g></g></svg>
                            ` + getLanguage("menu_user_info_save_count").replaceAll("{R:0}", userInfo["saveCount"]) + `
                        </div>
                    </div>
                </div>
                ` + line + `
            `;
            search_items.appendChild(newEl);
        }

        if (worksInfo != null) {
            searchLoadNumbers[menuNumber] = result["works"]["numbers"].split(",");

            for (let i = 0; i < worksInfo.length; i++) {
                addWorkItemSearch(menuNumber, worksInfo[i]);
    
                let array = searchLoadNumbers[menuNumber];
                array = array.remove("" + worksInfo[i]["number"]);
                searchLoadNumbers[menuNumber] = array;
            }
            checkSearchMoreLoading(menuNumber);
        }

        //검색 결과 없음
        if (result["count"] == 0) {
            searchNoResult(menuNumber);
        }
    
        //사이드 정보
        let sideInfo = result["sideInfo"];
        if (sideInfo["workInfo"] != null) {
            searchRightWorkInfo(menuNumber, sideInfo["workInfo"]);
        }
    
        //검색 기록 저장
        let search_query = contents.getElementsByClassName("search_query")[0];
        if (search_query.getAttribute("history") == true) {
            insertMyRecentSearches(search_query.innerHTML.trim());
        }
    }

    //
    let no_result = contents.getElementsByClassName("menu_search_no_result")[0];
    let no_result_title = no_result.getElementsByClassName("menu_search_no_result_right_title")[0];
    no_result_title.innerHTML = getLanguage("menu_search_no_result_title").replaceAll("{R:0}", "<b></b>")
    no_result_title.getElementsByTagName("b")[0].textContent = contents.getElementsByClassName("menu_title")[0].innerHTML;
    let no_result_description = no_result.getElementsByClassName("menu_search_no_result_right_description")[0].getElementsByTagName("span");
    no_result_description[0].innerHTML = getLanguage("menu_search_no_result_description:0");
    no_result_description[1].innerHTML = getLanguage("menu_search_no_result_description:1");
    no_result_description[2].innerHTML = getLanguage("menu_search_no_result_description:2");
    no_result_description[3].innerHTML = getLanguage("menu_search_no_result_description:3");

    //구글 애드센스 광고
    if (result["status"] == 0) {
        if (worksInfo != null && worksInfo.length != 0) {
            //프리미엄이면 광고 표시 안함
            let isPremium = contents.getElementsByClassName("is_premium")[0].innerHTML.trim();
            if (isPremium == "false" || isPremium == false) {
                //애드센스 광고
                let google_adsense = contents.getElementsByClassName("search_contents_left_google_adsense")[0];
                google_adsense.innerHTML = getElementGoogleAdsense(`
                    <ins class="adsbygoogle"
                        style="display:block; text-align:center;"
                        data-ad-layout="in-article"
                        data-ad-format="fluid"
                        data-ad-client="ca-pub-9109662775581995"
                        data-ad-slot="3491190931">
                    </ins>
                `).outerHTML + `
                    <div style = "width: 100%; height: 1px; background-color: var(--border-color); margin-top: 20px;"></div>
                `;
                google_adsense.style.display = null;
                checkElementGoogleAdsense(google_adsense);
            }
        }
    }
}
function searchNoResult(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let no_result = contents.getElementsByClassName("menu_search_no_result")[0];
    no_result.style.display = "flex";
}
function addWorkItemSearch(menuNumber, info) {
    let contents = document.getElementById("contents_" + menuNumber);
    let search_items = contents.getElementsByClassName("search_contents_left_items")[0];

    let newEl = document.createElement("div");
    newEl.setAttribute("work_number", info["number"]);
    newEl.setAttribute("oncontextmenu", "workMoreItems(event, " + info["number"] + ");");
    newEl.classList.add("visible_element");
    newEl.innerHTML = getHtmlWork(info, 1);
    search_items.appendChild(newEl);
}
function searchRightWorkInfo(menuNumber, info) {
    let contents = document.getElementById("contents_" + menuNumber);
    let menu_search = contents.getElementsByClassName("menu_search")[0];
    let right = contents.getElementsByClassName("search_contents_right")[0];

    //
    menu_search.classList.remove("menu_search_no_right");

    //
    let cover_iamge = info["default_cover_image"];
    if (info["cover_image"] != null) {
        cover_iamge = info["cover_image"];
    }

    //
    let coverWorkTypeSVG = "";
    if (info["contents_type"] == 0) {
        coverWorkTypeSVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-72.583-761.2c-2.946-3.826-6.227-5.765-9.755-5.765h0c-6.133,0-11.229,5.774-11.281,5.833a1.5,1.5,0,0,1-1.126.517h-.006a1.5,1.5,0,0,1-1.124-.506c-3.431-3.877-7.015-5.844-10.651-5.844h0c-6.23,0-10.743,5.713-10.788,5.771a1.5,1.5,0,0,1-1.67.5A1.5,1.5,0,0,1-120-762.116v-30.063a1.5,1.5,0,0,1,.318-.922c3.574-4.578,7.7-6.9,12.273-6.9h0c5.73,0,10.491,3.7,12.606,5.656C-91.165-798.1-87.269-800-83.2-800c7.569,0,12.778,6.622,13,6.9a1.5,1.5,0,0,1,.313.917v30.063a1.5,1.5,0,0,1-1.017,1.42,1.5,1.5,0,0,1-.483.08A1.5,1.5,0,0,1-72.583-761.2Zm-20.812-4.26c2.423-1.988,6.408-4.5,11.056-4.5h0a13.728,13.728,0,0,1,9.444,3.972v-25.638a19,19,0,0,0-2.779-2.56A12.553,12.553,0,0,0-83.2-797c-3.485,0-6.913,1.867-10.191,5.549ZM-117-791.653v25.91a16.593,16.593,0,0,1,10.471-4.223h0a15.532,15.532,0,0,1,10.132,4.125v-25.873c-1.474-1.438-5.9-5.285-11.013-5.285h0C-110.882-797-114.105-795.2-117-791.653Z" transform="translate(119.895 805.308)"></path></g></svg>';
    } else if (info["contents_type"] == 1) {
        coverWorkTypeSVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M3,3H3V18H47V3H3M3,0H47a3,3,0,0,1,3,3V18a3,3,0,0,1-3,3H3a3,3,0,0,1-3-3V3A3,3,0,0,1,3,0Z"></path><path d="M1.5,925H27a1.5,1.5,0,0,1,1.329,2.195l-11.5,22A1.5,1.5,0,0,1,15.5,950H1.508a1.5,1.5,0,0,1-1.5-1.5L0,926.5A1.5,1.5,0,0,1,1.5,925Zm23.023,3H3l.007,19H14.592Z" transform="translate(0 -900)"></path><path d="M1.5,927H26a1.5,1.5,0,0,1,1.33,2.194l-11.5,22.03a1.5,1.5,0,0,1-1.33.806h-.006l-13.5-.053A1.5,1.5,0,0,1-.5,950.442L0,928.466A1.5,1.5,0,0,1,1.5,927Zm22.025,3H2.966l-.432,18.982,11.058.044Z" transform="translate(49.5 977) rotate(180)"></path></g></svg>';
    } else if (info["contents_type"] == 2) {
        coverWorkTypeSVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M121.5,500h47a1.5,1.5,0,0,1,1.5,1.5V516a1.5,1.5,0,0,1-1.218,1.473l-47,9A1.5,1.5,0,0,1,120,525V501.5A1.5,1.5,0,0,1,121.5,500Zm45.5,3H123v20.186l44-8.426Z" transform="translate(-120 -500)"></path><path d="M121.5,500h47a1.5,1.5,0,0,1,1.5,1.5V516a1.5,1.5,0,0,1-1.218,1.473l-47,9A1.5,1.5,0,0,1,120,525V501.5A1.5,1.5,0,0,1,121.5,500Zm45.5,3H123v20.186l44-8.426Z" transform="translate(170 550) rotate(180)"></path></g></svg>';
    } else if (info["contents_type"] == 3) {
        coverWorkTypeSVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M6.712,1000a1.5,1.5,0,0,1,.745.2l41.052,23.5a1.5,1.5,0,0,1,0,2.6L7.458,1049.8a1.5,1.5,0,0,1-2.245-1.3v-47a1.5,1.5,0,0,1,1.5-1.5Zm38.032,25L8.212,1004.087v41.826Z" transform="translate(0.736 -1000)"></path></g></svg>';
    }

    //
    let genreHtml = "";
    let genre = info["genre"].split(",");
    for (let i = 0; i < genre.length; i++) {
        genreHtml += '<div class = "search_contents_work_info_contents_genre_item">' + getLanguage("genre:" + genre[i]) + '</div>';
    }

    let newEl = document.createElement("div");
    newEl.classList.add("search_contents_work_info");
    newEl.innerHTML = `
        <div class = "search_contents_work_info_art img_wrap">
            <img src = "` + info["art_image"] + `" onload = "imageLoad(event);">
        </div>
        <div class = "search_contents_work_info_top">
            <div class = "search_contents_work_info_top_left">
                <img src = "` + cover_iamge + `" onload = "imageLoad(event);">
            </div>
            <div class = "search_contents_work_info_top_right">
                <div class = "search_contents_work_info_top_right_top">
                    <div class = "search_contents_work_info_top_title md-ripples" onclick = "loadMenu_work(` + info["number"] + `);">
                        <div class = "search_contents_work_info_top_title_left">
                            <span>
                                ` + info["title"] + `
                            </span>
                        </div>
                        <div class = "search_contents_work_info_top_title_right">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.25 10l-7.141-7.42c-0.268-0.27-0.268-0.707 0-0.979 0.268-0.27 0.701-0.27 0.969 0l7.83 7.908c0.268 0.271 0.268 0.709 0 0.979l-7.83 7.908c-0.268 0.271-0.701 0.27-0.969 0s-0.268-0.707 0-0.979l7.141-7.417z"></path></svg>
                        </div>
                    </div>
                    <div class = "search_contents_work_info_top_items_wrap">
                        <div class = "search_contents_work_info_top_items">
                            <div class = "search_contents_work_info_top_item">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M27,30H3a3,3,0,0,1-3-3V3A3,3,0,0,1,3,0H27a3,3,0,0,1,3,3V27A3,3,0,0,1,27,30ZM2.647,2.647V27.353H27.353V2.647Z" transform="translate(0 20)"></path><rect width="32" height="3" rx="1.5" transform="translate(8 10)"></rect><rect width="31" height="3" rx="1.5" transform="translate(40 10) rotate(90)"></rect><rect width="32" height="3" rx="1.5" transform="translate(18)"></rect><rect width="32" height="3" rx="1.5" transform="translate(50) rotate(90)"></rect></g></svg>
                                <span>` + getLanguage("work_round").replaceAll("{R:0}", commas(info["part"])) + `</span>
                            </div>
                            <div class="search_contents_work_info_top_item_line"></div>
                            <div class="search_contents_work_info_top_item">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,37a21.437,21.437,0,0,1-9.731-2.508,34.262,34.262,0,0,1-7.947-5.721A39.4,39.4,0,0,1,1.965,22.54,10.312,10.312,0,0,1,0,18.5a10.313,10.313,0,0,1,1.965-4.04A39.4,39.4,0,0,1,7.323,8.229a34.261,34.261,0,0,1,7.947-5.721A21.437,21.437,0,0,1,25,0a21.236,21.236,0,0,1,9.728,2.538A34.517,34.517,0,0,1,42.67,8.311a40.627,40.627,0,0,1,5.357,6.242A10.518,10.518,0,0,1,50,18.5c.01,1.175-2.446,5.3-6.467,9.358a35.762,35.762,0,0,1-8.228,6.3A21.562,21.562,0,0,1,25,37ZM25,2.964C13.381,2.964,3.264,16.237,3.264,18.5S13.381,34.036,25,34.036c7.276,0,13.532-5.214,16.613-8.322,3.016-3.042,5.109-6.244,5.1-7.214-.009-1.079-2.552-4.948-6.516-8.557C36.7,6.759,31.227,2.964,25,2.964Z" transform="translate(0 7)"></path><path d="M9.5,19A9.5,9.5,0,0,1,2.783,2.783,9.5,9.5,0,0,1,16.217,16.217,9.437,9.437,0,0,1,9.5,19Zm0-16.026A6.526,6.526,0,1,0,16.026,9.5,6.534,6.534,0,0,0,9.5,2.974Z" transform="translate(16 16)"></path></g></svg>
                                <span>` + getViewsNumberUnit(info["views"]) + `</span>
                            </div>
                        </div>
                        <div class="search_contents_work_info_top_items">
                            <div class="search_contents_work_info_top_item">
                                ` + coverWorkTypeSVG + getLanguage('work_settings_contents_type:' + info["contents_type"]) + `
                            </div>
                        </div>
                    </div>
                </div>
                <div class = "search_contents_work_info_top_right_bottom">
                    <div class = "search_contents_work_info_top_right_user_info">
                        <div class = "search_contents_work_info_top_right_user_info_profile">
                            <div class="profile_element">
                                <div class="profile_info">` + JSON.stringify(info["originator"]["profile"]) + `</div>
                                <div class="profile_image"></div>
                            </div>
                        </div>
                        <div class = "search_contents_work_info_top_right_user_info_nickname md-ripples" onclick = "loadMenu_user(` + info["originator"]["number"] + `);">
                            ` + info["originator"]["nickname"] + `
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class = "search_contents_work_info_line"></div>
        <div class = "search_contents_work_info_contents">
            <div class = "search_contents_work_info_contents_item">
                <div class = "search_contents_work_info_contents_item_title">
                    ` + getLanguage("work_settings_description") + `
                </div>
                <div class = "search_contents_work_info_contents_description">` + info["description"] + `</div>
            </div>
            <div class = "search_contents_work_info_contents_item">
                <div class = "search_contents_work_info_contents_item_title">
                    ` + getLanguage("work_settings_genre") + `
                </div>
                <div style = "display: flex; flex-wrap: wrap; gap: 10px;">
                    ` + genreHtml + `
                </div>
            </div>
            <div class = "search_contents_work_info_contents_item">
                <div class = "search_contents_work_info_contents_item_title">
                    ` + getLanguage("work_settings_original_language") + `
                </div>
                <div class = "search_contents_work_info_contents_value">
                    ` + getLanguage("language:" + info["original_language"]) + `
                </div>
            </div>
            <div class = "search_contents_work_info_contents_item">
                <div class = "search_contents_work_info_contents_item_title">
                    ` + getLanguage("work_settings_user_age") + `
                </div>
                <div class = "search_contents_work_info_contents_value">
                    ` + getLanguage("work_settings_user_age:" + info["user_age"]) + `
                </div>
            </div>
        </div>
        <div class = "search_contents_work_info_line"></div>
        <div class = "search_contents_work_info_bottom">
            <div class = "menu_work_info_right_bottom_right_item md-ripples" work_number = "` + info["number"] + `" value = "` + info["notifications_settings"] + `" type = "notifications_settings" onchange = "requestWorkNotificationsSettings(` + info["number"] + `, this.getAttribute('value'));" popupwidth = "max-content" onclick = "(loginStatus['isLogin'] == false) ? loadMenu_login() : selectList(this, getMenuWorkNotificationsSettingsItems());" onmouseenter = "hoverInformation(this, getLanguage('menu_work_notifications'));">
                <div class = "menu_work_info_right_bottom_right_item_2">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M21.026-.544C27.557-.544,37.1,5.2,37.182,17.5c.246,17.883,8.487,21.471,3.614,21.348H.083c-4.466.05,3.6-3.546,4.093-21.348C4.259,3.8,14.021-.544,21.026-.544Z" transform="translate(4.383 0.922)"/><path d="M16.939-.544c5.739.056,13.127,4.863,13.194,15.285.157,11.479,3.888,18.093,3.888,18.093L-.9,32.84s3.872-7.043,4.048-18.1C3.216,3.138,10.744-.556,16.939-.544Z" transform="translate(8.401 3.948)"/><path d="M6.4,0a6.4,6.4,0,0,1,6.4,6.4H0A6.4,6.4,0,0,1,6.4,0Z" transform="translate(30.704 50) rotate(180)"/><path d="M8.583.607a1.307,1.307,0,0,1-.192,1.83A14.28,14.28,0,0,0,4.343,8.372,23.949,23.949,0,0,0,3,17.5a1.5,1.5,0,0,1-3,0S-.171,11.456,1.5,7.282A18.529,18.529,0,0,1,6.6.41,1.731,1.731,0,0,1,8.583.607Z" transform="translate(0.005 0.24)"/><path d="M.282.61A1.314,1.314,0,0,0,.475,2.45,14.364,14.364,0,0,1,4.546,8.42,24.089,24.089,0,0,1,5.9,17.6a1.509,1.509,0,0,0,3.018,0s.172-6.079-1.509-10.277A18.637,18.637,0,0,0,2.28.411,1.742,1.742,0,0,0,.282.61Z" transform="translate(41.08 0.186)"/></g></svg>
                </div>
                <div class = "menu_work_info_right_bottom_right_item_1">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M42.282,39.4h0l-.226,0H1.251C.557,39.4.2,39.3.065,39.075c-.221-.363.152-1.085.769-2.282,1.4-2.715,4.315-8.364,4.6-18.745a21.434,21.434,0,0,1,1.682-8.6,15.31,15.31,0,0,1,4.146-5.562A17.322,17.322,0,0,1,22.285,0a16.042,16.042,0,0,1,10.5,4.409,18.085,18.085,0,0,1,5.659,13.638c.141,10.246,2.863,15.713,4.326,18.65.617,1.238.989,1.986.755,2.364C43.375,39.3,43,39.4,42.282,39.4ZM22.187,3.026c-6.61,0-13.7,4.015-13.76,15.285a46.872,46.872,0,0,1-2.09,13.2,29.949,29.949,0,0,1-1.958,4.9L39.3,36.4s0,0-.006-.009a27.524,27.524,0,0,1-1.879-4.733,47.874,47.874,0,0,1-2-13.351C35.34,7.268,27.28,3.075,22.217,3.026Z" transform="translate(3.124 0.378)"/><path d="M6.4,0a6.4,6.4,0,0,1,6.4,6.4H0A6.4,6.4,0,0,1,6.4,0Z" transform="translate(30.704 50) rotate(180)"/></g></svg>
                </div>
                <div class = "menu_work_info_right_bottom_right_item_0">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M42.282,39.4h0l-.226,0H1.251C.557,39.4.2,39.3.065,39.075c-.221-.363.152-1.085.769-2.282,1.4-2.715,4.315-8.364,4.6-18.745a21.434,21.434,0,0,1,1.682-8.6,15.31,15.31,0,0,1,4.146-5.562A17.322,17.322,0,0,1,22.285,0a16.042,16.042,0,0,1,10.5,4.409,18.085,18.085,0,0,1,5.659,13.638c.141,10.246,2.863,15.713,4.326,18.65.617,1.238.989,1.986.755,2.364C43.375,39.3,43,39.4,42.282,39.4ZM22.187,3.026c-6.61,0-13.7,4.015-13.76,15.285a46.872,46.872,0,0,1-2.09,13.2,29.949,29.949,0,0,1-1.958,4.9L39.3,36.4s0,0-.006-.009a27.524,27.524,0,0,1-1.879-4.733,47.874,47.874,0,0,1-2-13.351C35.34,7.268,27.28,3.075,22.217,3.026Z" transform="translate(3.124 0.378)"/><path d="M6.4,0a6.4,6.4,0,0,1,6.4,6.4H0A6.4,6.4,0,0,1,6.4,0Z" transform="translate(30.704 50) rotate(180)"/><rect width="3" height="62" rx="1.5" transform="translate(2.019 4.14) rotate(-45)"/></g></svg>
                </div>
            </div>
            <div class = "menu_work_info_right_bottom_right_item md-ripples" work_number = "` + info["number"] + `" type = "work_list" checked = "false" onclick = "popupWorkList(this, ` + info["number"] + `);" onmouseenter = "hoverInformation(this, getLanguage('work_open_work_list'));">
                <div class = "menu_work_info_right_bottom_right_item_0">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="37" height="3" rx="1.5" transform="translate(1 2)"></rect><rect width="37" height="3" rx="1.5" transform="translate(1 18)"></rect><rect width="20" height="3" rx="1.5" transform="translate(1 34)"></rect><g transform="translate(1 -1)"><g transform="translate(-0.075 1.515)"><rect width="3.678" height="23.098" rx="1.839" transform="translate(25.075 36.713) rotate(-90)"></rect></g><g transform="translate(71.018 -0.075) rotate(90)"><rect width="3.434" height="23.098" rx="1.717" transform="translate(25.075 36.469) rotate(-90)"></rect></g></g></g></svg>
                </div>
                <div class = "menu_work_info_right_bottom_right_item_1">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="37" height="3" rx="1.5" transform="translate(1 2)"></rect><rect width="37" height="3" rx="1.5" transform="translate(1 18)"></rect><rect width="20" height="3" rx="1.5" transform="translate(1 34)"></rect><g transform="translate(2.518 0.541)"><rect width="3" height="17" rx="1.5" transform="translate(23.151 35.438) rotate(-45)"></rect><rect width="3" height="23" rx="1.5" transform="translate(44.884 26.041) rotate(30)"></rect></g></g></svg>
                </div>
            </div>
        </div>
    `;
    right.appendChild(newEl);

    //알림 설정
    setNotificationsSettingsMenuWorkBottomButton(info["number"], info["notifications_settings"]);
}



















function showSearchMoreLoading(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let loading = contents.getElementsByClassName("search_contents_loading")[0];
    loading.style.display = "block";
}
function hideSearchMoreLoading(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let loading = contents.getElementsByClassName("search_contents_loading")[0];
    loading.style.display = "none";
}
function checkSearchMoreLoading(menuNumber) {
    if (searchLoadNumbers[menuNumber].length == 0) {
        hideSearchMoreLoading(menuNumber);
        searchLoadNumbers[menuNumber] = null;
    } else {
        showSearchMoreLoading(menuNumber);
    }
}

let isSearchMoreLoad = new Array();

function checkSearchLoad() {
    if (getCurrentMenuName() == "search") {
        let boxSize = 75;

        let scrollPercent = ((document.documentElement.scrollTop + window.innerHeight) / (document.documentElement.scrollHeight - boxSize)) * 100;
        if (scrollPercent >= 100) {
            let number = getCurrentMenuNumber();
            if (isSearchMoreLoad[number] == null) {
                isSearchMoreLoad[number] = true;
                moreLoadSearch(number);
            }
        }
    }
}
addEventListener("scroll", checkSearchLoad);
addEventListener("resize", checkSearchLoad);
addEventListener("focus", checkSearchLoad);



function moreLoadSearch(menuNumber) {
    if (searchLoadNumbers[menuNumber] == null || searchLoadNumbers[menuNumber].length == 0) {
        searchLoadNumbers[menuNumber] = null;
        isSearchMoreLoad[menuNumber] = null;
        return;
    }

    let numbers = searchLoadNumbers[menuNumber];
    let numbersMaxCount = (numbers.length >= 24) ? 24 : numbers.length;
    numbers = numbers.splice(0, numbersMaxCount);

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
                    addWorkItemSearch(menuNumber, info[i]);
                }

                //
                for (let i = 0; i < numbers.length; i++) {
                    let array = searchLoadNumbers[menuNumber];
                    array = array.remove("" + numbers[i]);
                    searchLoadNumbers[menuNumber] = array;
                }

                isSearchMoreLoad[menuNumber] = null;
                checkSearchMoreLoading(menuNumber);
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
    formData.append("numbers", numbers.join(","));

    xhr.send(formData);
}























































function checkMenuSearchLogEvent() {
    if (getCurrentMenuName() == "search") {
        let menuNumber = getCurrentMenuNumber();
        let contents = document.getElementById("contents_" + menuNumber);
        if (contents.getElementsByClassName("search_contents_left_items").length != 0) {
            let work_contents = contents.getElementsByClassName("search_contents_left_items")[0];
            let children = work_contents.children;
    
            for (let i = 0; i < children.length; i++) {
                let workNumber = Number.parseInt(children[i].getAttribute("work_number"));
                let isVisible = isVisibleElement(children[i]);
    
                if (isVisible == true) {
                    let overlap = false;
                    for (let j = 0; j < logEvent.length; j++) {
                        if (logEvent[j]["log"] == 0 && logEvent[j]["workNumber"] == workNumber) {
                            overlap = true;
                            break;
                        }
                    }
                    if (overlap == false) {
                        logEvent[logEvent.length] = {
                            "log": 0,       //작품 노출
                            "type": 1,      //검색에서 노출
                            "workNumber": workNumber
                        }
                    }
                }
            }
        }
    }
}
window.addEventListener("resize", checkMenuSearchLogEvent);
window.addEventListener("focus", checkMenuSearchLogEvent);
window.addEventListener("scroll", checkMenuSearchLogEvent);

function delayCheckMenuSearchLogEvent() {
    function callback() {
        checkMenuSearchLogEvent();
    }
    window.requestAnimationFrame(callback);
}