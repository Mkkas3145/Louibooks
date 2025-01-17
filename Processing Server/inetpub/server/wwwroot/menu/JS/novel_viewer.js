

function novelViewerLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let part_info = JSON.parse(contents.getElementsByClassName("part_info")[0].innerHTML);
    let work_info = JSON.parse(contents.getElementsByClassName("work_info")[0].innerHTML);
    let partNumber = Number.parseInt(contents.getElementsByClassName("part_number")[0].innerHTML.trim());
    let originator_number = contents.getElementsByClassName("originator_number")[0].innerHTML.trim();

    //성인 (한국)
    let disableAdult = contents.getElementsByClassName("disable_adult")[0].innerHTML.trim();
    if (disableAdult == "true" || disableAdult == true) {

        contents.innerHTML = `
            <div class = "menu_work_disable_adult" style = "min-height: calc(var(--vh, 1vh) * 100);">
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
        let workTitle = JSON.parse(contents.getElementsByClassName("work_info")[0].innerHTML)["title"];
        openPopupContents("adult_questions", null, workTitle);
    }

    //
    if (part_info["percent_viewed"] != null) {
        //뷰 퍼센트 (클라이언트 정보)
        setPercentViewedPart(part_info["number"], part_info["percent_viewed"]);
    }

    novelViewerContentsLoad(menuNumber, part_info, work_info);

    //댓글
    let viewer_comments = contents.getElementsByClassName("novel_viewer_contents_comments")[0];
    let part_comments = JSON.parse(contents.getElementsByClassName("part_comments_info")[0].innerHTML);

    let property = {
        'originatorNumber': originator_number
    }
    registerComments(viewer_comments, ("part_" + part_info["number"]), part_comments, property);

    //
    checkHistoryPercentNovelViewer();

    //스크롤, 페이지
    let novel_viewer = contents.getElementsByClassName("novel_viewer")[0];
    let viewerMode = getViewerSettingsValue('novelViewerMode');
    let pageCount = getViewerSettingsValue('novelViewerPageCount');

    if (viewerMode == 1) {
        //페이지 뷰 로드
        loadNovelViewerPageView(menuNumber);
    }
    if (pageCount == 2) {
        novel_viewer.setAttribute("double", "true");
    }

    //스크롤 보존
    let percentViewedPart = getPercentViewedPart(partNumber);
    if (viewerMode == 0) {
        if (part_info["percent_viewed"] != null || percentViewedPart != null) {
            let percent = 0;
            if (part_info["percent_viewed"] != null) {
                percent = part_info["percent_viewed"];
            } else if (percent != null) {
                percent = percentViewedPart;
            }
    
            //
            let lines = contents.getElementsByClassName("novel_viewer_contents_lines")[0];
            let rect = lines.getBoundingClientRect();
            
            let scrollY = rect.bottom - rect.top;
            scrollY *= percent;
    
            function callback() {
                let top = (window.pageYOffset + lines.getBoundingClientRect().top);
                window.scrollTo({
                    left: 0,
                    top: top
                });
                rect = lines.getBoundingClientRect();
                window.scrollBy({
                    top: scrollY - (window.innerHeight - rect.top),
                    left: 0
                });
    
                //액션 메세지
                if (document.documentElement.scrollTop != 0) {
                    actionMessage(getLanguage("viewer_scroll_percent_viewed_message"), "intiOrderNovelViewer(" + getCurrentMenuNumber() + ");");
                } else {
                    let novel_viewer_top = contents.getElementsByClassName("novel_viewer_top")[0];
                    let novel_viewer_side_menu = contents.getElementsByClassName("novel_viewer_side_menu")[0];
                
                    novel_viewer_top.style.transition = "all 0s";
                    novel_viewer_side_menu.style.transition = "all 0s";
                    novel_viewer_top.classList.add("show_novel_viewer_top");
                    novel_viewer_side_menu.classList.add("show_novel_viewer_side_menu");
            
                    function callback2() {
                        novel_viewer_top.style.transition = null;
                        novel_viewer_side_menu.style.transition = null;
                    }
                    window.requestAnimationFrame(callback2);
                }
            }
            window.requestAnimationFrame(callback);
        }
    } else if (viewerMode == 1) {
        if (part_info["percent_viewed"] != null || percentViewedPart != null) {
            function callback() {
                let percent = 0;
                if (part_info["percent_viewed"] != null) {
                    percent = part_info["percent_viewed"];
                } else if (percentViewedPart != null) {
                    percent = percentViewedPart;
                }
    
                let novel_viewer_pages = novel_viewer.getElementsByClassName("novel_viewer_pages")[0];
                let maxOrder = Number.parseInt(novel_viewer_pages.getAttribute("item_count"));
                let order = Math.floor((maxOrder * percent) + 0.5);
    
                if (pageCount == 2) {
                    order = (order / 2) + 0.5;
                    order = Math.floor(order);
                    (order > maxOrder) ? order = maxOrder : null;
                }
    
                novel_viewer_pages.setAttribute("current_order", order);
                novel_viewer_pages.style.transition = "all 0s";
                novel_viewer_pages.style.transform = "translateX(-" + ((order * 100) - 100) + "%)";
                function callback2() {
                    novel_viewer_pages.style.transition = null;
                }
                window.requestAnimationFrame(callback2);
    
                if (order != 1) {
                    actionMessage(getLanguage("viewer_scroll_percent_viewed_message"), "intiOrderNovelViewer(" + getCurrentMenuNumber() + ");");
                }
            }
            window.requestAnimationFrame(callback);
        }
    }

    //프리미엄이면 광고 표시 안함
    let isPremium = contents.getElementsByClassName("is_premium")[0].innerHTML.trim();
    if (isPremium == "false" || isPremium == false) {
        let google_adsense = contents.getElementsByClassName("google_adsense")[0];
        google_adsense.innerHTML = getElementGoogleAdsense(`
            <div class = "novel_viewer_contents_comments_line"></div>
            <div>
                <ins class="adsbygoogle"
                    style="display:block"
                    data-ad-client="ca-pub-9109662775581995"
                    data-ad-slot="2377857533"
                    data-ad-format="auto"
                    data-full-width-responsive="true">
                </ins>
            </div>
        `).outerHTML;
        google_adsense.style.display = null;
        checkElementGoogleAdsense(google_adsense);
    }
}

function novelViewerContentsLoad(menuNumber, info, workInfo) {
    let contents = document.getElementById("contents_" + menuNumber);
    let data = info["data"];
    let novel_viewer = contents.getElementsByClassName("novel_viewer")[0];
    let viewer_contents = contents.getElementsByClassName("novel_viewer_contents")[0];

    //브라우저 제목
    let category = '...';
    if (info["category"] == "episode") {
        let episode = info["episode"];
        category = getLanguage("work_part_category:episode_count").replaceAll("{R:0}", episode);
    } else {
        category = getLanguage("work_part_category:" + info["category"]);
    }
    let menu_title = contents.getElementsByClassName("menu_title")[0];
    menu_title.innerHTML = category + " - " + info["title"] + " (" + workInfo["title"] + ")";

    //Top
    let info_thumbnail_image = contents.getElementsByClassName("novel_viewer_top_left_info_left")[0].getElementsByTagName("img")[0];
    info_thumbnail_image.src = info["thumbnail_image"];
    let info_category = contents.getElementsByClassName("novel_viewer_top_left_info_right_category")[0];
    info_category.innerHTML = category;
    let info_title = contents.getElementsByClassName("novel_viewer_top_left_info_right_title")[0];
    info_title.innerHTML = info["title"];

    //
    let side_menu_left = contents.getElementsByClassName("novel_viewer_side_menu_left")[0];
    let side_menu_left_item = side_menu_left.getElementsByClassName("novel_viewer_side_menu_item");

    //
    let partListInfo = JSON.parse(contents.getElementsByClassName("part_list_info")[0].innerHTML);

    //이전 회차 구하기
    let previousPartInfo = null;
    let currentPartIndex = null;
    for (let i = 0; i < partListInfo.length; i++) {
        if (partListInfo[i]["number"] == info["number"]) {
            currentPartIndex = i;
            break;
        }
    }
    if (currentPartIndex > 0) {
        previousPartInfo = partListInfo[currentPartIndex - 1];
    }
    if (previousPartInfo != null) {
        let onclick = `loadMenu_viewer(` + previousPartInfo["number"] + `, '` + previousPartInfo["type"] + `', true);`;

        side_menu_left_item[0].setAttribute("onclick", onclick);
        side_menu_left_item[0].classList.remove("novel_viewer_side_menu_item_disabled");
    }

    //다음 회차 구하기
    let isNextPart = false;
    let nextPartInfo = null;
    for (let i = 0; i < partListInfo.length; i++) {
        if (isNextPart == true) {
            nextPartInfo = partListInfo[i];
            break;
        }
        if (partListInfo[i]["number"] == info["number"]) {
            isNextPart = true;
        }
    }
    let nextPartButton = "";
    if (nextPartInfo != null) {
        let onclick = `loadMenu_viewer(` + nextPartInfo["number"] + `, '` + nextPartInfo["type"] + `', true);`;

        side_menu_left_item[1].setAttribute("onclick", onclick);
        side_menu_left_item[1].classList.remove("novel_viewer_side_menu_item_disabled");

        let nextPartCategory = null;
        if (nextPartInfo["category"] == "episode") {
            let episode = nextPartInfo["episode"];
            nextPartCategory = getLanguage("work_part_category:episode_count").replaceAll("{R:0}", episode);
        } else {
            nextPartCategory = getLanguage("work_part_category:" + nextPartInfo["category"]);
        }

        nextPartButton = `
            <div class = "novel_viewer_next_part_button md-ripples" onclick = "` + onclick + `">
                <div class = "novel_viewer_next_part_button_left img_wrap">
                    <img src = "` + nextPartInfo["thumbnail_image"] + `" onload = "imageLoad(event);">
                </div>
                <div class = "novel_viewer_next_part_button_center"></div>
                <div class = "novel_viewer_next_part_button_right">
                    <div class="novel_viewer_next_part_button_right_title">
                        ` + getLanguage("next_part_view") + `
                    </div>
                    <div class="novel_viewer_next_part_button_right_description">
                        <b>` + nextPartCategory + `</b> ` + nextPartInfo["title"] + `
                    </div>
                </div>
                <div class="novel_viewer_next_part_button_icon">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.25 10l-7.141-7.42c-0.268-0.27-0.268-0.707 0-0.979 0.268-0.27 0.701-0.27 0.969 0l7.83 7.908c0.268 0.271 0.268 0.709 0 0.979l-7.83 7.908c-0.268 0.271-0.701 0.27-0.969 0s-0.268-0.707 0-0.979l7.141-7.417z"></path></svg>
                </div>
            </div>
        `;
    }

    //회차 정보
    viewer_contents.innerHTML = `
        <div class = "novel_viewer_contents_info">
            <div class = "novel_viewer_contents_info_cover img_wrap">
                <img src = "` + info["thumbnail_image"] + `" onload = "imageLoad(event);" alt = "">
            </div>
            <div class = "novel_viewer_contents_info_work_title">
                ` + workInfo["title"] + `
            </div>
            <div class = "novel_viewer_contents_info_work_originator md-ripples" onclick = "loadMenu_user(` + workInfo["originator"]["number"] + `);">
                <div class = "novel_viewer_contents_info_work_originator_profile">
                    <div class = "profile_element">
                        <div class = "profile_info">` + JSON.stringify(workInfo["originator"]["profile"]) + `</div>
                        <div class = "profile_image"></div>
                    </div>
                </div>
                <div class = "novel_viewer_contents_info_work_originator_nickname">
                    ` + workInfo["originator"]["nickname"] + `
                </div>
            </div>
        </div>
        <div class = "novel_viewer_contents_line_wrap">
            <div class = "novel_viewer_contents_line"></div>
            <!-- Generated by IcoMoon.io -->
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M15 25.875v-19.625c0 0-2.688-2.25-6.5-2.25s-6.5 2-6.5 2v19.875c0 0 2.688-1.938 6.5-1.938s6.5 1.938 6.5 1.938zM29 25.875v-19.625c0 0-2.688-2.25-6.5-2.25s-6.5 2-6.5 2v19.875c0 0 2.688-1.938 6.5-1.938s6.5 1.938 6.5 1.938zM31 8h-1v19h-12v1h-5v-1h-12v-19h-1v20h12v1h7.062l-0.062-1h12v-20z"></path></svg>
            <div class = "novel_viewer_contents_line"></div>
        </div>
        <div class = "novel_viewer_contents_title">
            ` + data["title"] + `
        </div>
        <div class = "novel_viewer_contents_lines"></div>
    `;

    let contents_lines = viewer_contents.getElementsByClassName("novel_viewer_contents_lines")[0];

    let textLine = 0;
    for (let i = 0; i < data["lines"].length; i++) {
        let line = data["lines"][i];
        let newEl = document.createElement("div");

        if (line["type"] == "text") {
            newEl.classList.add("novel_viewer_contents_text");
            let content = line["content"];
            if (content.trim() == "") {
                content = "<br />";
            } else {
                newEl.setAttribute("oncontextmenu", "moreButtonNovelViewerItem(" + menuNumber + ", " + textLine + ", event);");
                textLine ++;
            }
            newEl.innerHTML = content;
        } else if (line["type"] == "image") {
            newEl.classList.add("novel_viewer_contents_image");
            newEl.classList.add("img_wrap");
            newEl.innerHTML = `
                <img src = "` + line["url"] + `" width = "` + line["width"] + `" height = "` + line["height"] + `" onload = "imageLoad(event);" loading = "lazy" alt = "">
            `;
        }

        contents_lines.appendChild(newEl);
    }

    //bottom
    let bottom = contents.getElementsByClassName("novel_viewer_bottom")[0];
    let newEl = document.createElement("div");
    newEl.innerHTML = nextPartButton;
    bottom.prepend(newEl);
}




function novelViewerComments() {
    let menuNumber = getCurrentMenuNumber();
    let contents = document.getElementById("contents_" + menuNumber);
    let comments = contents.getElementsByClassName("novel_viewer_contents_comments")[0];

    let top = (window.pageYOffset + comments.getBoundingClientRect().top) - 55;

    window.scrollTo({
        behavior: 'smooth',
        left: 0,
        top: top
    });
}















var ignoreCheckHideSideNovelViewer = false; //일시적으로 무시
function checkHideSideNovelViewer(menuNumber, e) {
    if (ignoreCheckHideSideNovelViewer == false) {
        let target = e.target;
        let computed = window.getComputedStyle(target)["cursor"];
        if (computed == "auto" || computed == "default") {
            toggleSideNovelViewer(menuNumber);
        }
    }
}
function toggleSideNovelViewer(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    let side_menu = contents.getElementsByClassName("novel_viewer_side_menu")[0];
    if (side_menu.classList.contains("show_novel_viewer_side_menu")) {
        hideSideNovelViewer(menuNumber);
    } else {
        showSideNovelViewer(menuNumber);
    }
}
function hideSideNovelViewer(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    let side_menu = contents.getElementsByClassName("novel_viewer_side_menu")[0];
    side_menu.classList.remove("show_novel_viewer_side_menu");
    let top_menu = contents.getElementsByClassName("novel_viewer_top")[0];
    top_menu.classList.remove("show_novel_viewer_top");
}
function showSideNovelViewer(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    let side_menu = contents.getElementsByClassName("novel_viewer_side_menu")[0];
    side_menu.classList.add("show_novel_viewer_side_menu");
    let top_menu = contents.getElementsByClassName("novel_viewer_top")[0];
    top_menu.classList.add("show_novel_viewer_top");

    //
    let novelViewer = contents.getElementsByClassName("novel_viewer")[0];
    novelViewer.setAttribute("difference_scroll_top", window.pageYOffset);
}





function checkScrollHideSideNovelViewer() {
    function callback() {
        let menuName = getCurrentMenuName();
        if (menuName == "novel_viewer") {
            let menuNumber = getCurrentMenuNumber();
            let contents = document.getElementById("contents_" + menuNumber);
            let novelViewer = contents.getElementsByClassName("novel_viewer")[0];
            if (novelViewer != null) {
                let previousScrollY = novelViewer.getAttribute("previous_scroll_top");
                let differenceScrollY = novelViewer.getAttribute("difference_scroll_top");
            
                if (previousScrollY > window.pageYOffset) {
                    //스크롤이 올라갈 경우
                    if (window.pageYOffset <= 55) {
                        showSideNovelViewer(menuNumber);
                    }
                    let difference = differenceScrollY - window.pageYOffset;
                    if (difference >= 55) {
                        hideSideNovelViewer(menuNumber);
                    }
                } else {
                    //스크롤이 내려갈 경우
                    let difference = window.pageYOffset - differenceScrollY;
                    if (difference >= 55) {
                        hideSideNovelViewer(menuNumber);
                    }
                }
                novelViewer.setAttribute("previous_scroll_top", window.pageYOffset);
        
                //상단 진행바 관련
                let isPage = (novelViewer.getAttribute("type") == "page_view");
                let percent = 0;
                if (isPage == false) {
                    let lines = contents.getElementsByClassName("novel_viewer_contents_lines")[0];
                    let rect = lines.getBoundingClientRect();
                    let currentY = (rect.bottom - window.innerHeight);
                    percent = (currentY / rect.height);
                } else {
                    let pages = contents.getElementsByClassName("novel_viewer_pages")[0];
                    let items = pages.getElementsByClassName("novel_viewer_pages_items_wrap");
                    let width = 0;
                    for (let i = 0; i < items.length; i++) {
                        let rect = items[i].getBoundingClientRect();
                        width += rect.width;
                    }
                    items = items[items.length - 1];
                    let rect = items.getBoundingClientRect();
                    let right = rect.right;
                    let currentX = (right - window.innerWidth);
                    percent = (currentX / width);
                }
                (percent < 0) ? percent = 0 : null;
                (percent > 1) ? percent = 1 : null;
                percent = (1 - percent);
        
                let progressBar = contents.getElementsByClassName("novel_viewer_top_progress_bar")[0];
                let progressBarIn = progressBar.getElementsByClassName("novel_viewer_top_progress_bar_in")[0];
                progressBarIn.style.width = ((percent * 100) + "%");
        
                if (percent >= 0.999) {
                    progressBar.style.opacity = 0;
                } else {
                    progressBar.style.opacity = 1;
                }
            }
        }
        window.requestAnimationFrame(callback);
    }
    window.requestAnimationFrame(callback);
}
checkScrollHideSideNovelViewer();















function checkHistoryPercentNovelViewer() {
    let menuName = getCurrentMenuName();
    if (menuName == "novel_viewer") {
        let menuNumber = getCurrentMenuNumber();
        let contents = document.getElementById("contents_" + menuNumber);
        let partNumber = Number.parseInt(contents.getElementsByClassName("part_number")[0].innerHTML.trim());
        let novel_viewer = contents.getElementsByClassName("novel_viewer")[0];
        let novel_viewer_pages = contents.getElementsByClassName("novel_viewer_pages")[0];
        let lines = contents.getElementsByClassName("novel_viewer_contents_lines")[0];
        let rect = lines.getBoundingClientRect();

        if (novel_viewer.getAttribute("type") == "scroll_view") {
            let percent = (rect.bottom - window.innerHeight) / rect.height;
            percent = 1 - percent;
            (percent > 1) ? percent = 1 : null;
            (percent < 0) ? percent = 0 : null;
    
            requestSetPercentViewedPart(partNumber, percent);
        } else if (novel_viewer.getAttribute("type") == "page_view") {
            let maxOrder = Number.parseInt(novel_viewer_pages.getAttribute("item_count"));
            let order = Number.parseInt(novel_viewer_pages.getAttribute("current_order"));

            if (novel_viewer.getAttribute("double") == "true") {
                order = (order * 2) + 0.5;
                order = Math.floor(order);
                (order > maxOrder) ? order = maxOrder : null;
            }
            let percent = order / maxOrder;

            requestSetPercentViewedPart(partNumber, percent);
        }
    }
}
var historyPercentNovelViewerTimer = null;
window.addEventListener('scroll', function() {
    if(historyPercentNovelViewerTimer !== null) {
        clearTimeout(historyPercentNovelViewerTimer);        
    }
    historyPercentNovelViewerTimer = setTimeout(function() {
        checkHistoryPercentNovelViewer();
    }, 200);
}, false);












































































/*
    페이지 뷰
*/

function loadNovelViewerPageView(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let novel_viewer = contents.getElementsByClassName("novel_viewer")[0];
    let viewer_contents = contents.getElementsByClassName("novel_viewer_contents")[0];
    let viewer_pages = contents.getElementsByClassName("novel_viewer_pages")[0];

    let width = 0; //가로 사이즈 구하기
    let height = 0; //세로 사이즈 구하기
    viewer_pages.innerHTML = `
        <div class = "novel_viewer_pages_items_wrap">
            <div class = "novel_viewer_pages_items"></div>
        </div>
    `;
    viewer_contents.style.display = "none";
    viewer_pages.style.display = null;
    let viewer_pages_items = viewer_pages.getElementsByClassName("novel_viewer_pages_items")[0];
    let rect = viewer_pages_items.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    viewer_pages.textContent = "";

    //가로 사이즈
    viewer_contents.style.display = null;
    viewer_contents.style.minWidth = (width + "px");
    viewer_contents.style.maxWidth = (width + "px");
    
    let children = viewer_contents.children;
    let child = new Array();
    for (let i = 0; i < children.length; i++) {
        let el = children[i];
        if (el.classList.contains("novel_viewer_contents_lines")) {
            let childEl = el.children;
            for (let j = 0; j < childEl.length; j++) {
                child[child.length] = childEl[j];
            }
        } else {
            child[child.length] = el;
        }
    }

    let pageElement = new Array();
    pageElement[0] = new Array();

    let index = 0;
    let totalHeight = 0; //totalHeight가 브라우저 높이보다 높아지면 pageElement의 인덱스가 올라감
    for (let i = 0; i < child.length; i++) {
        let absoluteHeight = getAbsoluteHeight(child[i]);

        //앨리먼트의 높이가 height보다 높으면
        if (absoluteHeight > height) {
            height = absoluteHeight;
        }

        totalHeight += absoluteHeight;
        if (totalHeight > height) {
            //공백은 추가하지 않기
            if (child[i].innerText != "\n") {
                pageElement[pageElement.length] = new Array();
                totalHeight = 0;
                index ++;
                i --;
            } else {
                totalHeight -= absoluteHeight;
            }
        } else {
            pageElement[index][pageElement[index].length] = child[i];
        }
    }

    //스크롤 뷰 숨기기
    viewer_contents.style.display = "none";
    viewer_contents.style.minWidth = null;
    viewer_contents.style.maxWidth = null;

    //앨리먼트 삽입
    let isLeft = true;
    for (let i = 0; i < pageElement.length; i++) {
        let page = pageElement[i];
        let items_wrap = document.createElement("div");
        items_wrap.classList.add("novel_viewer_pages_items_wrap");
        items_wrap.setAttribute("order", (i + 1));
        let addEl = viewer_pages.appendChild(items_wrap);
        
        let newEl = document.createElement("div");
        newEl.classList.add("novel_viewer_pages_items");
        if (isLeft == true && i == (pageElement.length - 1)) {
            addEl.style.minWidth = "100%";
            addEl.style.maxWidth = "100%";
            newEl.style.marginLeft = "auto";
            newEl.style.marginRight = "auto";
        } else if (isLeft == true) {
            newEl.style.marginLeft = "auto";
            isLeft = false;
        } else {
            newEl.style.marginRight = "auto";
            isLeft = true;
        }
        for (let j = 0; j < page.length; j++) {
            newEl.innerHTML += page[j].outerHTML;
        }
        addEl.appendChild(newEl);
    }

    viewer_pages.style.display = null;
    novel_viewer.setAttribute("type", "page_view");

    //
    viewer_pages_items = viewer_pages.getElementsByClassName("novel_viewer_pages_items")[0];
    rect = viewer_pages_items.getBoundingClientRect();
    viewer_pages.setAttribute("width", Math.round(rect.width));
    viewer_pages.setAttribute("height", document.body.clientHeight);
    viewer_pages.setAttribute("item_count", pageElement.length);
    //
    let contentsText = viewer_pages.getElementsByClassName("novel_viewer_contents_text")[0];
    let textStyle = window.getComputedStyle(contentsText);
    viewer_pages.setAttribute("font_size", textStyle.fontSize);
    viewer_pages.setAttribute("line_height", textStyle.lineHeight);
    viewer_pages.setAttribute("word_break", textStyle.wordBreak);
}

function checkNovelViewerPageView() {
    if (getCurrentMenuName() == "novel_viewer") {
        let menuNumber = getCurrentMenuNumber();
        let contents = document.getElementById("contents_" + menuNumber);
        if (contents.getElementsByClassName("novel_viewer").length != 0) {
            let novel_viewer = contents.getElementsByClassName("novel_viewer")[0];
            if (novel_viewer.getAttribute("type") == "page_view") {
                let viewer_pages = contents.getElementsByClassName("novel_viewer_pages")[0];
                let novel_viewer = contents.getElementsByClassName("novel_viewer")[0];

                let pages_width = viewer_pages.getAttribute("width");
                let pages_height = viewer_pages.getAttribute("height");
                let pages_fontSize = viewer_pages.getAttribute("font_size");
                let pages_lineHeight = viewer_pages.getAttribute("line_height");
                let pages_wordBreak = viewer_pages.getAttribute("word_break");
                
                let viewer_pages_items = viewer_pages.getElementsByClassName("novel_viewer_pages_items")[0];
                let rect = viewer_pages_items.getBoundingClientRect();
                let items_wrap_width = Math.round(rect.width);
                let items_wrap_height = document.body.clientHeight;

                let contentsText = viewer_pages.getElementsByClassName("novel_viewer_contents_text")[0];
                let textStyle = window.getComputedStyle(contentsText);
    
                if (novel_viewer.getAttribute("type") == "page_view" && (pages_width != items_wrap_width || pages_height != items_wrap_height || pages_fontSize != textStyle.fontSize || pages_lineHeight != textStyle.lineHeight || pages_wordBreak != textStyle.wordBreak)) {
                    loadNovelViewerPageView(menuNumber);
                }

                //오버플로우 여부
                let maxOrder = Number.parseInt(viewer_pages.getAttribute("item_count"));
                let order = viewer_pages.getAttribute("current_order");
                let isDouble = novel_viewer.getAttribute("double");

                if (isDouble == "true") {
                    maxOrder = (maxOrder / 2) + 0.5;
                    maxOrder = Math.floor(maxOrder);
                }

                if (order > maxOrder) {
                    setOrderNovelViewerPageView(viewer_pages, maxOrder);
                }
            }
        }
    }
}

function registerCheckNovelViewerPageView() {
    let previousTimestamp = null;
    function callback(timestamp) {
        if (previousTimestamp === timestamp) { return };
        previousTimestamp = timestamp;
        
        //
        checkNovelViewerPageView();

        window.requestAnimationFrame(callback);
    }
    window.requestAnimationFrame(callback);
}
registerCheckNovelViewerPageView();
















































//페이지 뷰 슬라이드
function touchStartNovelViewerPageView(event, el) {
    //페이지 뷰 상태인지
    if (el.getAttribute("type") == "page_view") {
        let startX = null;
        let startY = null;
        if (event.type == "touchstart") {
            startX = event.touches[0].pageX;
            startY = event.touches[0].pageY;
        }
        let isBodyScroll = true;

        let menuNumber = getCurrentMenuNumber();
        let contents = document.getElementById("contents_" + menuNumber);
        let items = el.getElementsByClassName("novel_viewer_pages")[0];
        let firstX = null;
        let difference = 0;
        let itemsTransform = items.style.transform;

        //items이 화면에서 얼마나 차이 나는지
        let rect = items.getBoundingClientRect();
        let correctX = rect.left;

        function move(event) {
            let x = null;
            if (event.type == "touchmove") {
                x = event.touches[0].pageX;
                let y = event.touches[0].pageY;

                if (firstX == null) {
                    let distanceX = startX - x;
                    let distanceY = startY - y;
                    (distanceX < 0) ? distanceX *= -1 : null;
                    (distanceY < 0) ? distanceY *= -1 : null;
    
                    //터치 동작 좌우 스크롤이 아니면
                    if (distanceY > distanceX) {
                        end();
                        return;
                    } else {
                        setBodyScroll(false); //스크롤 금지
                        isBodyScroll = false;
                    }
                }
            } else if (event.type == "mousemove") {
                x = event.pageX;
            }
            (firstX == null) ? firstX = x : null;
    
            difference = x - firstX;

            if (ignoreCheckHideSideNovelViewer == false) {
                //30px 이상 차이나면
                if (difference <= -30 || difference >= 30) {
                    ignoreCheckHideSideNovelViewer = true;
                    hideSideNovelViewer(getCurrentMenuNumber()); //사이드바 숨기기
                }
            }
    
            items.style.transition = "all 0s";
            items.style.transform = "translateX(" + (correctX + difference) + "px)";
        }
        function end() {
            items.style.transition = null;
    
            //30px 이상 차이나면
            if (difference <= -30) {
                let maxOrder = Number.parseInt(items.getAttribute("item_count"));
                let order = Number.parseInt(items.getAttribute("current_order")) + 1;
                setOrderNovelViewerPageView(items, order);
            } else if (difference >= 30) {
                let order = Number.parseInt(items.getAttribute("current_order")) - 1;
                setOrderNovelViewerPageView(items, order);
            } else {
                items.style.transform = itemsTransform;
            }
    
            document.removeEventListener("touchmove", move);
            document.removeEventListener("touchend", end);
            document.removeEventListener("touchcancel", end);
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", end);
            document.removeEventListener("click", end);

            function callback() {
                ignoreCheckHideSideNovelViewer = false;
                if (isBodyScroll == false) {
                    setBodyScroll(true); //스크롤 풀기
                }
            }
            window.requestAnimationFrame(callback);
        }
    
        //터치 이벤트
        document.addEventListener("touchmove", move);
        document.addEventListener("touchend", end);
        document.addEventListener("touchcancel", end);
        //마우스 이벤트
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", end);
        document.addEventListener("click", end);
    }
}

function setOrderNovelViewerPageView(el, order) {
    let maxOrder = Number.parseInt(el.getAttribute("item_count"));

    let isDouble = el.parentElement.getAttribute("double");
    if (isDouble == "true") {
        maxOrder = (maxOrder / 2) + 0.5;
        maxOrder = Math.floor(maxOrder);
    }

    (order < 1) ? order = 1 : null;
    (order > maxOrder) ? order = maxOrder : null;
    el.setAttribute("current_order", order);
    el.style.transform = "translateX(-" + ((order * 100) - 100) + "%)";

    checkHistoryPercentNovelViewer();
    hideSideNovelViewer(getCurrentMenuNumber());
}

function intiOrderNovelViewer(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let novel_viewer = contents.getElementsByClassName("novel_viewer")[0];
    let novel_viewer_pages = contents.getElementsByClassName("novel_viewer_pages")[0];

    if (novel_viewer.getAttribute("type") == "page_view") {
        setOrderNovelViewerPageView(novel_viewer_pages, 1);
    } else if (novel_viewer.getAttribute("type") == "scroll_view") {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
}








































































/*
    TTS

    menuNumber = 메뉴 번호
    line = 몇번째 라인
    forward = 다음 라인으로 넘어가기
*/

var isPlayNovelViewerTTS = false;
var novelViewerEndFunctionTTS = null;

function playNovelViewerTTS(menuNumber, line, forward) {
    let contents = document.getElementById("contents_" + menuNumber);
    let novel_viewer = contents.getElementsByClassName("novel_viewer")[0];

    //터치 불가
    novel_viewer.style.pointerEvents = "none";

    let child = null;
    if (novel_viewer.getAttribute("type") == "scroll_view") {
        child = contents.getElementsByClassName("novel_viewer_contents_text");
    } else if (novel_viewer.getAttribute("type") == "page_view") {
        let viewer_pages = contents.getElementsByClassName("novel_viewer_pages")[0];
        child = viewer_pages.getElementsByClassName("novel_viewer_contents_text");
    }

    for (let i = 0; i < child.length; i++) {
        child[i].classList.remove("novel_viewer_contents_text_tts");
    }

    //공백인 child 빼기
    let newChild = new Array();
    for (let i = 0; i < child.length; i++) {
        if (child[i].textContent.trim() != "") {
            newChild[newChild.length] = child[i];
        }
    }
    child = newChild;

    let item = child[line];
    item.classList.add("novel_viewer_contents_text_tts");

    let voices = speechSynthesis.getVoices();
    let voice = null;
    for (let i = 0; i < voices.length; i++) {
        if (voices[i].voiceURI == getViewerSettingsValue('novelViewerTTSVoice')) {
            voice = voices[i];
        }
    }
    let text = item.textContent;
    text = text.replaceAll("…", ".");
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.volume = Number.parseFloat(getViewerSettingsValue('novelViewerTTSVolume')) / 100;
    utterance.rate = Number.parseFloat(getViewerSettingsValue('novelViewerTTSRate'));
    window.speechSynthesis.speak(utterance);

    //재생하고 있음
    isPlayNovelViewerTTS = true;

    //스크롤 및 페이지 이동
    if (novel_viewer.getAttribute("type") == "scroll_view") {
        let rect = item.getBoundingClientRect();

        let relativeTop = rect.top;
        let scrolledTopLength = window.pageYOffset;
        let absoluteTop = scrolledTopLength + relativeTop;

        let top = absoluteTop;
        top += rect.height / 2;
        top -= window.innerHeight / 2;

        window.scrollTo(
            { top: top, behavior: 'smooth' }
        );
    } else if (novel_viewer.getAttribute("type") == "page_view") {
        let viewer_pages = contents.getElementsByClassName("novel_viewer_pages")[0];

        let isDouble = novel_viewer.getAttribute("double");
        let maxOrder = Number.parseInt(viewer_pages.getAttribute("item_count"));
        let order = Number.parseInt(item.parentElement.parentElement.getAttribute("order"));
        if (isDouble == "true") {
            order = (order / 2) + 0.5;
            order = Math.floor(order);
            (order > maxOrder) ? order = maxOrder : null;
        }

        window.scrollTo(
            { top: 0, behavior: 'smooth' }
        );

        setOrderNovelViewerPageView(viewer_pages, order);
    }

    novelViewerEndFunctionTTS = function() {
        isPlayNovelViewerTTS = false; //재생이 끝났음
        item.classList.remove("novel_viewer_contents_text_tts");

        if (isCancelNovelViewerTTS == false) {
            if (forward == true && child[line + 1] != null) {
                playNovelViewerTTS(menuNumber, line + 1, true);
            }
        } else {
            isCancelNovelViewerTTS = false;
        }

        utterance.removeEventListener("end", novelViewerEndFunctionTTS);
    }
    utterance.addEventListener("end", novelViewerEndFunctionTTS);
}

var isCancelNovelViewerTTS = false;
function cancelNovelViewerTTS() {
    if (isPlayNovelViewerTTS == true) {
        let novel_viewer = document.getElementsByClassName("novel_viewer");
        for (let i = 0; i < novel_viewer.length; i++) {
            //터치 불가 해제
            novel_viewer[i].style.pointerEvents = null;
        }

        let synth = window.speechSynthesis;
        synth.cancel();
        isCancelNovelViewerTTS = true;
        novelViewerEndFunctionTTS();

        actionMessage(getLanguage("novel_viewer_cancel_tts_message"));
    }
}










function moreButtonNovelViewerItem(menuNumber, order, event) {
    let el = event.currentTarget;

    function callback() {
        el.classList.add("md-ripples");
        function callback2() {
            el.dispatchEvent(new PointerEvent('pointerdown', {clientX: event.clientX, clientY: event.clientY}));
            //임시 이벤트
            function callback3() {
                el.dispatchEvent(new PointerEvent('mouseup'));
            }
            window.requestAnimationFrame(callback3);

            let spread = (0.2 * getValuePopupElementMyProfileSettings('--click-effect-speed'));
            let hidden = (spread * 1.5);
            (hidden < 0.2) ? hidden = 0.2 : null;
            let time = (spread + hidden) * 1000;

            setTimeout(() => {
                el.classList.remove("md-ripples");
                cancelRegisterRipplesElement(el);
            }, time);
        }
        window.requestAnimationFrame(callback2);
    }
    window.requestAnimationFrame(callback);

    let slot = new Array();
    slot[0] = {
        'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M30 26c-1.104 0-2-0.896-2-2v-8c0-6.627-5.373-12-12-12s-12 5.373-12 12v8c0 1.104-0.896 2-2 2s-2-0.896-2-2v-8c0-8.837 7.164-16 16-16s16 7.163 16 16v8c0 1.104-0.896 2-2 2zM7 18h2c0.552 0 1 0.447 1 1v10c0 0.553-0.448 1-1 1h-2c-0.552 0-1-0.447-1-1v-10c0-0.553 0.448-1 1-1zM23 18h2c0.553 0 1 0.447 1 1v10c0 0.553-0.447 1-1 1h-2c-0.553 0-1-0.447-1-1v-10c0-0.553 0.447-1 1-1z"></path></svg>',
        'title': getLanguage("novel_viewer_more_items:tts"),
        'onclick': 'playNovelViewerTTS(' + menuNumber + ', ' + order + ', true); actionMessage(\'' + getLanguage("novel_viewer_start_tts_message") + '\');',
    };
    moreButton(null, slot, event);
}


















































function setViewerModeNovelViewer(value) {
    let menuNumber = getCurrentMenuNumber();
    let contents = document.getElementById("contents_" + menuNumber);

    let novel_viewer = contents.getElementsByClassName("novel_viewer")[0];
    let viewer_type = novel_viewer.getAttribute("type");

    //
    if ((viewer_type == "scroll_view" && value == 0) || (viewer_type == "page_view" && value == 1)) {
        return;
    }

    let isDouble = novel_viewer.getAttribute("double");
    let previousMode = null;
    if (viewer_type == "scroll_view") {
        previousMode = 0;
    } else if (viewer_type == "page_view") {
        previousMode = 1;
    }
    let mode = value;
    
    if (previousMode == 1 && mode == 0) {
        let novel_viewer_contents = contents.getElementsByClassName("novel_viewer_contents")[0];
        let novel_viewer_pages = contents.getElementsByClassName("novel_viewer_pages")[0];
        novel_viewer_pages.textContent = "";
        novel_viewer_pages.style.display = "none";
        novel_viewer_contents.style.display = null;

        let maxOrder = Number.parseInt(novel_viewer_pages.getAttribute("item_count"));
        let order = Number.parseInt(novel_viewer_pages.getAttribute("current_order"));

        if (isDouble == "true") {
            order = (order * 2) + 0.5;
            order = Math.floor(order);
            (order > maxOrder) ? order = maxOrder : null;
        }
        let percent = order / maxOrder;

        let lines = contents.getElementsByClassName("novel_viewer_contents_lines")[0];
        let rect = lines.getBoundingClientRect();
        
        let scrollY = (rect.bottom - rect.top);
        scrollY *= percent;

        let top = (window.pageYOffset + lines.getBoundingClientRect().top);
        window.scrollTo({
            left: 0,
            top: top
        });
        rect = lines.getBoundingClientRect();
        window.scrollBy({
            top: scrollY - (window.innerHeight - rect.top),
            left: 0
        });

        novel_viewer.setAttribute("type", "scroll_view");
    } else {
        let novel_viewer_pages = contents.getElementsByClassName("novel_viewer_pages")[0];

        let lines = contents.getElementsByClassName("novel_viewer_contents_lines")[0];
        let rect = lines.getBoundingClientRect();

        let percent = (rect.bottom - window.innerHeight) / rect.height;
        percent = 1 - percent;
        (percent > 1) ? percent = 1 : null;
        (percent < 0) ? percent = 0 : null;

        //스크롤 제일 위로
        window.scrollTo({
            top: 0,
            left: 0
        });

        //페이지 뷰 로드
        loadNovelViewerPageView(menuNumber);

        let maxOrder = Number.parseInt(novel_viewer_pages.getAttribute("item_count"));
        let order = Math.floor((maxOrder * percent) + 0.5);
            
        if (isDouble == "true") {
            order = (order / 2) + 0.5;
            order = Math.floor(order);
            (order > maxOrder) ? order = maxOrder : null;
        }

        novel_viewer_pages.setAttribute("current_order", order);
        novel_viewer_pages.style.transition = "all 0s";
        novel_viewer_pages.style.transform = "translateX(-" + ((order * 100) - 100) + "%)";
        function callback() {
            novel_viewer_pages.style.transition = null;
        }
        window.requestAnimationFrame(callback);

        novel_viewer.setAttribute("type", "page_view");
    }

    //값 변경
    setViewerSettingsValue('novelViewerMode', value);
}

function setPageCountNovelViewer(value) {
    let menuNumber = getCurrentMenuNumber();
    let contents = document.getElementById("contents_" + menuNumber);

    let novel_viewer = contents.getElementsByClassName("novel_viewer")[0];

    let isDouble = novel_viewer.getAttribute("double");
    let pageCount = value;

    if (pageCount == 1) {
        novel_viewer.setAttribute("double", "false");
    } else if (pageCount == 2) {
        novel_viewer.setAttribute("double", "true");
    }

    //보고 있는 위치 보존
    let novel_viewer_pages = contents.getElementsByClassName("novel_viewer_pages")[0];
    let maxOrder = Number.parseInt(novel_viewer_pages.getAttribute("item_count"));
    let order = Number.parseInt(novel_viewer_pages.getAttribute("current_order"));
    if (isDouble == "true" && pageCount == 1) {
        order = (order * 2) + 0.5;
        order = Math.floor(order);
        (order > maxOrder) ? order = maxOrder : null;

        novel_viewer_pages.setAttribute("current_order", order);
        novel_viewer_pages.style.transition = "all 0s";
        novel_viewer_pages.style.transform = "translateX(-" + ((order * 100) - 100) + "%)";
        function callback() {
            novel_viewer_pages.style.transition = null;
        }
        window.requestAnimationFrame(callback);
    } else if (isDouble == "false" && pageCount == 2) {
        maxOrder = (maxOrder / 2) + 0.5;
        maxOrder = Math.floor(maxOrder);

        order = (order / 2) + 0.5;
        order = Math.floor(order);
        (order > maxOrder) ? order = maxOrder : null;

        novel_viewer_pages.setAttribute("current_order", order);
        novel_viewer_pages.style.transition = "all 0s";
        novel_viewer_pages.style.transform = "translateX(-" + ((order * 100) - 100) + "%)";
        function callback() {
            novel_viewer_pages.style.transition = null;
        }
        window.requestAnimationFrame(callback);
    }

    //값 변경
    setViewerSettingsValue('novelViewerPageCount', value);
}










































function novelViewerUploadCustomFont() {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", ".otf, .ttf, .woff, .woff2");

    function callback() {
        input.click();
    }
    window.requestAnimationFrame(callback);

    input.onchange = function(event) {
        let file = event.target.files[0];
        let name = file.name.split('.').slice(0, -1).join('.');
        let ext = file.name.split('.').pop();
        if (ext == "otf" || ext == "ttf" || ext == "woff" || ext == "woff2") {
            let reader = new FileReader();
            reader.onload = function(event) {
                let fileContent = event.target.result;
                fileContent = fileContent.replaceAll("data:application/octet-stream;base64,", "");
    
                let novelViewerCustomFont = JSON.parse(localStorage.getItem('novelViewerCustomFont'));
                (novelViewerCustomFont == null) ? novelViewerCustomFont = new Array() : null;

                //이미 동일한 글꼴이 있는지
                for (let i = 0; i < novelViewerCustomFont.length; i++) {
                    let font = novelViewerCustomFont[i];
                    if (font["name"] == name || font["content"] == fileContent) {
                        actionMessage(getLanguage("novel_viewer_same_font").replaceAll("{R:0}", font["name"]));
                        return;
                    }
                }

                //크기 (KB)
                function getStringSizeInBytes(str) {
                    let byteSize = 0;
                    for (let i = 0; i < str.length; i++) {
                        const codePoint = str.codePointAt(i);
                        byteSize += codePoint <= 0x7f ? 1 : 
                                    codePoint <= 0x7ff ? 2 :
                                    codePoint <= 0xffff ? 3 : 4;
                    }
                    return byteSize;
                }
                let size = getStringSizeInBytes(fileContent) / 1024;

                novelViewerCustomFont[novelViewerCustomFont.length] = {
                    'name': name,
                    'ext': ext,
                    'size': size,
                    'content': fileContent
                }

                try {
                    //글꼴 데이터 저장
                    localStorage.setItem('novelViewerCustomFont', JSON.stringify(novelViewerCustomFont));
                    actionMessage(getLanguage("novel_viewer_font_uploaded"));
                    viewerMoveSettings(getCurrentMenuNumber(), "novel_viewer_font");
                    //글꼴 로드
                    loadNovelViewerCustomFont();
                } catch (error) {
                    actionMessage(getLanguage("novel_viewer_font_storage_capacity_limit"));
                }
            };
            reader.readAsDataURL(file);
        } else {
            actionMessage(getLanguage("novel_viewer_not_font"));
        }
    }
}

function getFileContentNovelViewerCustomFont() {
    let novelViewerCustomFont = JSON.parse(localStorage.getItem('novelViewerCustomFont'));
    (novelViewerCustomFont == null) ? novelViewerCustomFont = new Array() : null;
    return novelViewerCustomFont;
}

var loadedCustomFontElementNovelViewer = new Array();
function loadNovelViewerCustomFont() {
    //글꼴 로드 초기화
    for (let i = 0; i < loadedCustomFontElementNovelViewer.length; i++) {
        loadedCustomFontElementNovelViewer[i].remove();
    }
    loadedCustomFontElementNovelViewer = new Array();
    //글꼴 로드
    let files = getFileContentNovelViewerCustomFont();
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let fontFace = document.createElement('style');
        fontFace.appendChild(document.createTextNode(`
            @font-face {
                font-family: '` + file["name"] + `';
                src: url('data:font/` + file["ext"] + `;base64,` + file["content"] + `');
            }
        `));
        let length = loadedCustomFontElementNovelViewer.length;
        loadedCustomFontElementNovelViewer[length] = document.head.appendChild(fontFace);
    }
}
loadNovelViewerCustomFont();

function removeCustomFontNovelViewerMoreButton(name, event) {
    let slot = new Array();
    slot[0] = {
        'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 28"><path d="M8 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM12 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM16 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM18 22.813v-14.812h-14v14.812c0 0.75 0.422 1.188 0.5 1.188h13c0.078 0 0.5-0.438 0.5-1.188zM7.5 6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094 0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5 0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375 0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391 2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094 2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z"></path></svg>',
        'title': getLanguage("delete"),
        'onclick': 'removeCustomFontNovelViewerMessage(\'' + name + '\');',
        'class': 'more_button_item_delete',
    };
    moreButton(null, slot, event);
}
function removeCustomFontNovelViewerMessage(name) {
    confirmPopup(getLanguage("confirm_popup_title:delete"), getLanguage("confirm_popup_subject:delete"), 'removeCustomFontNovelViewer(\'' + name + '\');');
}
function removeCustomFontNovelViewer(name) {
    let currentFont = getViewerSettingsValue("novelViewerFont");
    if (currentFont == name) {
        setViewerSettingsValue('novelViewerFont', null);
    }

    //글꼴 삭제
    let novelViewerCustomFont = JSON.parse(localStorage.getItem('novelViewerCustomFont'));
    (novelViewerCustomFont == null) ? novelViewerCustomFont = new Array() : null;
    let newArray = new Array();
    for (let i = 0; i < novelViewerCustomFont.length; i++) {
        let font = novelViewerCustomFont[i];
        if (font["name"] != name) {
            newArray[newArray.length] = font;
        }
    }
    novelViewerCustomFont = newArray;
    localStorage.setItem('novelViewerCustomFont', JSON.stringify(novelViewerCustomFont));
    loadNovelViewerCustomFont();
    
    //
    function onRemoveCustomFontNovelViewerHistoryUpdate() {
        viewerMoveSettings(getCurrentMenuNumber(), "novel_viewer_font");
        actionMessage(getLanguage("novel_viewer_font_deleted"));
        window.removeEventListener('popstate', onRemoveCustomFontNovelViewerHistoryUpdate);
    }
    window.addEventListener('popstate', onRemoveCustomFontNovelViewerHistoryUpdate);
}













































function popupNovelViewerUserTranslation(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let partInfo = JSON.parse(contents.getElementsByClassName("part_info")[0].innerHTML);

    let data = {
        "originalLanguage": partInfo["original_language"],
        "number": partInfo["number"],
        "type": partInfo["type"]
    }

    openPopupContents("part_user_translation", null, data);
}