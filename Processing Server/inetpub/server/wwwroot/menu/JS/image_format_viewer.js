

function imageFormatViewerLoad(menuNumber) {
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

    imageFormatViewerContentsLoad(menuNumber, part_info, work_info);

    //댓글
    let viewer_comments = contents.getElementsByClassName("image_format_viewer_contents_comments")[0];
    let part_comments = JSON.parse(contents.getElementsByClassName("part_comments_info")[0].innerHTML);

    let property = {
        'originatorNumber': originator_number
    }
    registerComments(viewer_comments, ("part_" + part_info["number"]), part_comments, property);

    //터치 디바이스
    if (isTouchDevice() == true) {
        let resize = contents.getElementsByClassName("image_format_viewer_items_resize");
        for (let i = 0; i < resize.length; i++) {
            resize[i].remove();
            i--;
        }
    }

    //스크롤, 만화 모드
    let viewerMode = getViewerSettingsValue('imageFormatViewerMode');
    let imageCount = getViewerSettingsValue('imageFormatViewerImageCount');
    let items_wrap = contents.getElementsByClassName("image_format_viewer_items_wrap")[0];
    if (viewerMode == "auto" && work_info["contentsType"] == 1) {
        viewerMode = 1;
    }
    if (viewerMode == 1) {
        items_wrap.classList.add("image_format_viewer_manga_mode");
    }
    (imageCount == 2) ? items_wrap.setAttribute("double", "true") : null;

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
            let items = contents.getElementsByClassName("image_format_viewer_items")[0];
            let rect = items.getBoundingClientRect();
    
            //
            let scrollY = rect.bottom - rect.top;
            scrollY *= percent;
    
            function callback() {
                window.scrollBy({
                    top: scrollY - window.innerHeight,
                    left: 0
                });
    
                //액션 메세지
                if (document.documentElement.scrollTop != 0) {
                    actionMessage(getLanguage("viewer_scroll_percent_viewed_message"), "intiOrderImageFormatViewer(" + getCurrentMenuNumber() + ");");
                }
            }
            window.requestAnimationFrame(callback);
        }
    } else if (viewerMode == 1) {
        if (part_info["percent_viewed"] != null || percentViewedPart != null) {
            let percent = 0;
            if (part_info["percent_viewed"] != null) {
                percent = part_info["percent_viewed"];
            } else if (percentViewedPart != null) {
                percent = percentViewedPart;
            }

            let items = items_wrap.getElementsByClassName("image_format_viewer_items")[0];
            let maxOrder = Number.parseInt(items.getAttribute("item_count"));
            let order = Math.floor((maxOrder * percent) + 0.5);

            if (imageCount == 2) {
                order = (order / 2) + 0.5;
                order = Math.floor(order);
                (order > maxOrder) ? order = maxOrder : null;
            }

            items.setAttribute("current_order", order);
            items.style.transition = "all 0s";
            items.style.transform = "translateX(-" + ((order * 100) - 100) + "%)";
            function callback() {
                items.style.transition = null;
            }
            window.requestAnimationFrame(callback);

            if (order != 1) {
                actionMessage(getLanguage("viewer_scroll_percent_viewed_message"), "intiOrderImageFormatViewer(" + getCurrentMenuNumber() + ");");
            }
        }
    }

    //
    delayCheckTransformImageFormatViewer();

    //언어
    let auto_page_move_title = contents.getElementsByClassName("image_format_viewer_items_auto_page_move_box_title");
    auto_page_move_title[0].innerHTML = getLanguage("image_format_viewer_auto_page_move_back:title");
    auto_page_move_title[1].innerHTML = getLanguage("image_format_viewer_auto_page_move_forward:title");
    let auto_page_move_description = contents.getElementsByClassName("image_format_viewer_items_auto_page_move_box_description");
    auto_page_move_description[0].innerHTML = getLanguage("image_format_viewer_auto_page_move_back:description");
    auto_page_move_description[1].innerHTML = getLanguage("image_format_viewer_auto_page_move_forward:description");

    //프리미엄이면 광고 표시 안함
    let isPremium = contents.getElementsByClassName("is_premium")[0].innerHTML.trim();
    if (isPremium == "false" || isPremium == false) {
        let google_adsense = contents.getElementsByClassName("google_adsense")[0];
        google_adsense.innerHTML = getElementGoogleAdsense(`
            <div class = "image_format_viewer_contents_line"></div>
            <div style = "width: 100%; max-width: 820px; margin-left: auto; margin-right: auto;">
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

function imageFormatViewerContentsLoad(menuNumber, info, workInfo) {
    let contents = document.getElementById("contents_" + menuNumber);
    let data = info["data"];

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
    let info_thumbnail_image = contents.getElementsByClassName("image_format_viewer_header_left_info_left")[0].getElementsByTagName("img")[0];
    info_thumbnail_image.src = info["thumbnail_image"];
    let info_category = contents.getElementsByClassName("image_format_viewer_header_left_info_right_category")[0];
    info_category.innerHTML = category;
    let info_title = contents.getElementsByClassName("image_format_viewer_header_left_info_right_title")[0];
    info_title.innerHTML = info["title"];

    //
    let side_menu_left = contents.getElementsByClassName("image_format_viewer_footer_left")[0];
    let side_menu_left_item = side_menu_left.getElementsByClassName("image_format_viewer_footer_item");

    //
    let partListInfo = JSON.parse(contents.getElementsByClassName("part_list_info")[0].innerHTML);

    //이전 회차 구하기
    let previousPartInfo = null;
    let currentPartIndex = null;
    if (partListInfo != null) {
        for (let i = 0; i < partListInfo.length; i++) {
            if (partListInfo[i]["number"] == info["number"]) {
                currentPartIndex = i;
                break;
            }
        }
    }
    if (currentPartIndex > 0) {
        previousPartInfo = partListInfo[currentPartIndex - 1];
    }
    if (previousPartInfo != null) {
        let onclick = `loadMenu_viewer(` + previousPartInfo["number"] + `, '` + previousPartInfo["type"] + `', true);`;

        side_menu_left_item[0].setAttribute("onclick", onclick);
        side_menu_left_item[0].classList.remove("image_format_viewer_footer_item_disabled");
    }

    //다음 회차 구하기
    let isNextPart = false;
    let nextPartInfo = null;
    if (partListInfo != null) {
        for (let i = 0; i < partListInfo.length; i++) {
            if (isNextPart == true) {
                nextPartInfo = partListInfo[i];
                break;
            }
            if (partListInfo[i]["number"] == info["number"]) {
                isNextPart = true;
            }
        }
    }
    let nextPartButton = "";
    if (nextPartInfo != null) {
        let onclick = `loadMenu_viewer(` + nextPartInfo["number"] + `, '` + nextPartInfo["type"] + `', true);`;

        side_menu_left_item[1].setAttribute("onclick", onclick);
        side_menu_left_item[1].classList.remove("image_format_viewer_footer_item_disabled");

        let nextPartCategory = null;
        if (nextPartInfo["category"] == "episode") {
            let episode = nextPartInfo["episode"];
            nextPartCategory = getLanguage("work_part_category:episode_count").replaceAll("{R:0}", episode);
        } else {
            nextPartCategory = getLanguage("work_part_category:" + nextPartInfo["category"]);
        }

        nextPartButton = `
            <div class = "image_format_viewer_next_part_button md-ripples" onclick = "` + onclick + `">
                <div class = "image_format_viewer_next_part_button_left img_wrap">
                    <img src = "` + nextPartInfo["thumbnail_image"] + `" onload = "imageLoad(event);">
                </div>
                <div class = "image_format_viewer_next_part_button_center"></div>
                <div class = "image_format_viewer_next_part_button_right">
                    <div class="image_format_viewer_next_part_button_right_title">
                        ` + getLanguage("next_part_view") + `
                    </div>
                    <div class="image_format_viewer_next_part_button_right_description">
                        <b>` + nextPartCategory + `</b> ` + nextPartInfo["title"] + `
                    </div>
                </div>
                <div class="image_format_viewer_next_part_button_icon">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.25 10l-7.141-7.42c-0.268-0.27-0.268-0.707 0-0.979 0.268-0.27 0.701-0.27 0.969 0l7.83 7.908c0.268 0.271 0.268 0.709 0 0.979l-7.83 7.908c-0.268 0.271-0.701 0.27-0.969 0s-0.268-0.707 0-0.979l7.141-7.417z"></path></svg>
                </div>
            </div>
        `;
    }

    let contents_next_part = contents.getElementsByClassName("image_format_viewer_contents_next_part")[0];
    contents_next_part.innerHTML = nextPartButton;

    //
    let lines = data["lines"];

    //
    let maxSettingsQuality = getMaxSettingsQualityImageFormat(lines);
    let quality = getViewerSettingsValue("imageFormatViewerQuality");
    if (quality > maxSettingsQuality["minQuality"]) {
        quality = maxSettingsQuality["minQuality"];
    }

    imageFormatViewerLinesLoad(menuNumber, lines, quality);
}
function imageFormatViewerLinesLoad(menuNumber, lines, quality) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("image_format_viewer_items")[0];
    items.textContent = '';
    items.setAttribute("current_order", 1);
    items.setAttribute("item_count", lines.length);

    //min-width 맞추기
    let ratio = new Array();
    for (let i = 0; i < lines.length; i++) {
        let resolutions = lines[i]["resolutions"];
        for (let j = 0; j < resolutions.length; j++) {
            if (resolutions[j]["resolution"] == quality) {
                //이미지 비율
                let width = resolutions[j]["width"];
                let height = resolutions[j]["height"];
                ratio[ratio.length] = width / height;
                break;
            }
        }
    }
    let minWidth = new Array();
    let leftRatio = null;
    for (let i = 0; i < lines.length; i++) {
        if (leftRatio != null) {
            let rightRatio = ratio[i];

            let total = leftRatio + rightRatio;
            minWidth[minWidth.length] = (leftRatio / total) * 100;
            minWidth[minWidth.length] = (rightRatio / total) * 100;

            leftRatio = null;
        } else {
            leftRatio = ratio[i];
        }
    }

    let isLeft = true;
    for (let i = 0; i < lines.length; i++) {
        let newEl = document.createElement("div");
        newEl.classList.add("image_format_viewer_item");
        if (minWidth[i] != null) {
            newEl.style.minWidth = minWidth[i] + "%";
        } else {
            newEl.style.minWidth = "100%";
        }
        //
        if (isLeft == true) {
            newEl.classList.add("manga_image_format_viewer_item_left");
            isLeft = false;
        } else {
            newEl.classList.add("manga_image_format_viewer_item_right");
            isLeft = true;
        }
        let addStyle = "";
        if (minWidth[i] == null) {
            addStyle = " margin-right: auto;";
        }

        let index = null;
        let resolutions = lines[i]["resolutions"];
        for (let j = 0; j < resolutions.length; j++) {
            (resolutions[j]["resolution"] == quality) ? index = j : null;
        }

        newEl.innerHTML = `
            <div class = "image_enhancement" style = "aspect-ratio: ` + ratio[i] + `;` + addStyle + `">
                <div class = "img_wrap">
                    <img width = "` + resolutions[0]["width"] + `" height = "` + resolutions[0]["height"] + `" src = "` + resolutions[0]["url"] + `" quality = "low" onload = "imageLoad(event);">
                    <img width = "` + resolutions[index]["width"] + `" height = "` + resolutions[index]["height"] + `" src = "` + resolutions[index]["url"] + `" quality = "original" onload = "imageLoad(event);">
                </div>
            </div>
        `;
        items.appendChild(newEl);
    }

    //Min Width 체크
    function callback() {
        checkTransformImageFormatViewer();
    }
    window.requestAnimationFrame(callback);
}

/*
    direction = left, right
*/
function imageFormatViewerItemsResize(event, direction) {
    let menuNumber = getCurrentMenuNumber();
    let contents = document.getElementById("contents_" + menuNumber);
    let items_wrap = contents.getElementsByClassName("image_format_viewer_items_wrap")[0];
    let items = contents.getElementsByClassName("image_format_viewer_items")[0];
    let previousItemsWrapWidth = items_wrap.clientWidth;
    
    let previousX = event.clientX;
    let currentMaxWidth = previousItemsWrapWidth;

    function move(event) {
        let currentX = event.clientX;

        let distance = 0;
        if (direction == "left") {
            distance = previousX - currentX;
        } else if (direction == "right") {
            distance = currentX - previousX;
        }

        //최소 width
        let setMaxWidth = previousItemsWrapWidth + (distance * 2);

        if (event.shiftKey) {
            //5px 단위로 반올림
            setMaxWidth = Math.round(setMaxWidth / 5) * 5;
        } else {
            //25px 단위로 반올림
            setMaxWidth = Math.round(setMaxWidth / 25) * 25;
        }

        (setMaxWidth < 300) ? setMaxWidth = 300 : null;
        setResizeImageFormatViewer(setMaxWidth + "px");

        if (setMaxWidth != currentMaxWidth) {
            actionMessage(getLanguage("image_format_viewer_items_resize_message").replaceAll("{R:0}", setMaxWidth));
            items.style.opacity = "0.5";
        }

        currentMaxWidth = setMaxWidth;
    }
    function end() {
        items.style.opacity = null;

        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", end);
    }

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
}
function setResizeImageFormatViewer(width) {
    let menuNumber = getCurrentMenuNumber();
    let contents = document.getElementById("contents_" + menuNumber);
    let items_wrap = contents.getElementsByClassName("image_format_viewer_items_wrap")[0];
    let previousItemsWrapWidth = items_wrap.clientWidth;

    //
    let previousScrollY = window.pageYOffset;

    //값 변경
    setViewerSettingsValue('imageFormatViewerResize', width);

    //스크롤 보정
    let scrollMultiply = (items_wrap.clientWidth / previousItemsWrapWidth);

    let scroll = previousScrollY * scrollMultiply;
    window.scrollTo({
        left: 0,
        top: scroll
    });
}

















function imageFormatViewerComments() {
    let menuNumber = getCurrentMenuNumber();
    let contents = document.getElementById("contents_" + menuNumber);
    let comments = contents.getElementsByClassName("image_format_viewer_contents_comments")[0];

    let top = (window.pageYOffset + comments.getBoundingClientRect().top) - 55;

    window.scrollTo({
        behavior: 'smooth',
        left: 0,
        top: top
    });
}



































var ignoreCheckHideSideImageFormatViewer = false; //일시적으로 무시
function checkHideSideImageFormatViewer(menuNumber, e) {
    if (ignoreCheckHideSideImageFormatViewer == false) {
        let target = e.target;
        let computed = window.getComputedStyle(target)["cursor"];
        if (computed == "auto" || computed == "default") {
            toggleSideImageFormatViewer(menuNumber);
        }
    }
}
function toggleSideImageFormatViewer(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    let side_menu = contents.getElementsByClassName("image_format_viewer_footer")[0];
    if (side_menu.classList.contains("show_image_format_viewer_footer")) {
        hideSideImageFormatViewer(menuNumber);
    } else {
        showSideImageFormatViewer(menuNumber);
    }
}
function hideSideImageFormatViewer(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    let side_menu = contents.getElementsByClassName("image_format_viewer_footer")[0];
    if (side_menu.classList.contains("show_image_format_viewer_footer")) {
        //이미지 포맷 Min Width 체크 (0.2초 동안)
        registerCheckTransformImageFormatViewer();
    }
    side_menu.classList.remove("show_image_format_viewer_footer");
    let top_menu = contents.getElementsByClassName("image_format_viewer_header")[0];
    top_menu.classList.remove("show_image_format_viewer_header");

    let viewer = contents.getElementsByClassName("image_format_viewer")[0];
    viewer.classList.remove("image_format_viewer_show_sidebar");
}
function showSideImageFormatViewer(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    let side_menu = contents.getElementsByClassName("image_format_viewer_footer")[0];
    if (side_menu.classList.contains("show_image_format_viewer_footer") == false) {
        //이미지 포맷 Min Width 체크 (0.2초 동안)
        registerCheckTransformImageFormatViewer();
    }
    side_menu.classList.add("show_image_format_viewer_footer");
    let top_menu = contents.getElementsByClassName("image_format_viewer_header")[0];
    top_menu.classList.add("show_image_format_viewer_header");

    let viewer = contents.getElementsByClassName("image_format_viewer")[0];
    viewer.classList.add("image_format_viewer_show_sidebar");

    //
    let imageFormatViewer = contents.getElementsByClassName("image_format_viewer")[0];
    imageFormatViewer.setAttribute("difference_scroll_top", window.pageYOffset);
}





function checkScrollHideSideImageFormatViewer() {
    function callback() {
        let menuName = getCurrentMenuName();
        if (menuName == "image_format_viewer") {
            let menuNumber = getCurrentMenuNumber();
            let contents = document.getElementById("contents_" + menuNumber);
            let imageFormatViewer = contents.getElementsByClassName("image_format_viewer")[0];
            if (imageFormatViewer != null) {
                let previousScrollY = imageFormatViewer.getAttribute("previous_scroll_top");
                let differenceScrollY = imageFormatViewer.getAttribute("difference_scroll_top");
            
                if (previousScrollY > window.pageYOffset) {
                    //스크롤이 올라갈 경우
                    if (window.pageYOffset <= 55) {
                        hideSideImageFormatViewer(menuNumber);
                    }
        
                    let difference = differenceScrollY - window.pageYOffset;
                    if (difference >= 55) {
                        hideSideImageFormatViewer(menuNumber);
                    }
                } else {
                    //스크롤이 내려갈 경우
                    let difference = window.pageYOffset - differenceScrollY;
                    if (difference >= 55) {
                        hideSideImageFormatViewer(menuNumber);
                    }
                }
                imageFormatViewer.setAttribute("previous_scroll_top", window.pageYOffset);
    
                //상단 진행바 관련
                let itemsWrap = contents.getElementsByClassName("image_format_viewer_items_wrap")[0];
                let isPage = itemsWrap.classList.contains("image_format_viewer_manga_mode");
                let percent = 0;
                if (isPage == false) {
                    let lines = contents.getElementsByClassName("image_format_viewer_items")[0];
                    let rect = lines.getBoundingClientRect();
                    let currentY = (rect.bottom - window.innerHeight);
                    percent = (currentY / rect.height);
                } else {
                    let items = contents.getElementsByClassName("image_format_viewer_item");
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
        
                let progressBar = contents.getElementsByClassName("image_format_viewer_header_progress_bar")[0];
                let progressBarIn = progressBar.getElementsByClassName("image_format_viewer_header_progress_bar_in")[0];
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
checkScrollHideSideImageFormatViewer();










































function checkHistoryPercentImageFormatViewer() {
    let menuName = getCurrentMenuName();
    if (menuName == "image_format_viewer") {
        let menuNumber = getCurrentMenuNumber();
        let contents = document.getElementById("contents_" + menuNumber);
        let partNumber = Number.parseInt(contents.getElementsByClassName("part_number")[0].innerHTML.trim());
        let items = contents.getElementsByClassName("image_format_viewer_items")[0];
        let items_wrap = contents.getElementsByClassName("image_format_viewer_items_wrap")[0];

        //만화 모드이면
        if (items_wrap.classList.contains("image_format_viewer_manga_mode")) {
            let maxOrder = Number.parseInt(items.getAttribute("item_count"));
            let order = Number.parseInt(items.getAttribute("current_order"));

            if (items_wrap.getAttribute("double") == "true") {
                order = (order * 2) + 0.5;
                order = Math.floor(order);
                (order > maxOrder) ? order = maxOrder : null;
            }
            let percent = order / maxOrder;

            requestSetPercentViewedPart(partNumber, percent);
        } else {
            //스크롤 모드
            let rect = items.getBoundingClientRect();

            let percent = (rect.bottom - window.innerHeight) / rect.height;
            percent = 1 - percent;
            (percent > 1) ? percent = 1 : null;
            (percent < 0) ? percent = 0 : null;
    
            requestSetPercentViewedPart(partNumber, percent);
        }
    }
}
var historyPercentImageFormatViewerTimer = null;
window.addEventListener('scroll', function() {
    if(historyPercentImageFormatViewerTimer !== null) {
        clearTimeout(historyPercentImageFormatViewerTimer);        
    }
    historyPercentImageFormatViewerTimer = setTimeout(function() {
        checkHistoryPercentImageFormatViewer();
    }, 200);
}, false);



































































































//만화 모드 슬라이드
function touchStartImageFormatViewerManga(event, el) {
    //만화 모드 상태인지
    if (el.classList.contains("image_format_viewer_manga_mode")) {
        let startX = null;
        let startY = null;
        if (event.type == "touchstart") {
            startX = event.touches[0].pageX;
            startY = event.touches[0].pageY;
        }
        let isBodyScroll = true;

        let menuNumber = getCurrentMenuNumber();
        let contents = document.getElementById("contents_" + menuNumber);
        let items = el.getElementsByClassName("image_format_viewer_items")[0];
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

            if (ignoreCheckHideSideImageFormatViewer == false) {
                //30px 이상 차이나면
                if (difference <= -30 || difference >= 30) {
                    ignoreCheckHideSideImageFormatViewer = true;
                    hideSideImageFormatViewer(getCurrentMenuNumber()); //사이드바 숨기기
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
                setOrderImageFormatViewerManga(items, order);

                if (getViewerSettingsValue('isImageFormatViewerAutoPageMove') == 'true') {
                    let isDouble = el.getAttribute("double");
                    if (isDouble == "true") {
                        maxOrder = (maxOrder / 2) + 0.5;
                        maxOrder = Math.floor(maxOrder);
                    }
    
                    if (order > maxOrder) {
                        let footer_left = contents.getElementsByClassName("image_format_viewer_footer_left")[0];
                        let footer_item = footer_left.getElementsByClassName("image_format_viewer_footer_item")[1];
    
                        if (footer_item.classList.contains("show_image_format_viewer_footer") == false) {
                            footer_item.click();
                        }
                    }
                }
            } else if (difference >= 30) {
                let order = Number.parseInt(items.getAttribute("current_order")) - 1;
                setOrderImageFormatViewerManga(items, order);

                if (order < 1 && getViewerSettingsValue('isImageFormatViewerAutoPageMove') == 'true') {
                    let footer_left = contents.getElementsByClassName("image_format_viewer_footer_left")[0];
                    let footer_item = footer_left.getElementsByClassName("image_format_viewer_footer_item")[0];

                    if (footer_item.classList.contains("show_image_format_viewer_footer") == false) {
                        footer_item.click();
                    }
                }
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
                ignoreCheckHideSideImageFormatViewer = false;
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
function setOrderImageFormatViewerManga(el, order) {
    let maxOrder = Number.parseInt(el.getAttribute("item_count"));

    let isDouble = el.parentElement.getAttribute("double");
    if (isDouble == "true") {
        maxOrder = (maxOrder / 2) + 0.5;
        maxOrder = Math.floor(maxOrder);
    }

    //
    let contents = document.getElementById("contents_" + getCurrentMenuNumber());
    if (order >= maxOrder) {
        let auto_page_move = el.parentElement.getElementsByClassName("image_format_viewer_items_auto_page_move");
        let right = auto_page_move[1];

        let footer_left = contents.getElementsByClassName("image_format_viewer_footer_left")[0];
        let footer_item = footer_left.getElementsByClassName("image_format_viewer_footer_item")[1];

        if (getViewerSettingsValue('isImageFormatViewerAutoPageMove') == 'true') {
            console.log(right.getAttribute("animation"));
            if (footer_item.classList.contains("image_format_viewer_footer_item_disabled") == false && right.getAttribute("animation") == "false") {
                right.setAttribute("animation", "true");
                right.style.display = null;
                setTimeout(() => {
                    right.children[0].style.animation = "show_auto_page_move_box_right 2s";
                    setTimeout(() => {
                        right.children[0].style.animation = null;
                        right.style.display = "none";
                    }, 2000);
                }, 400);
            }
        }
    }
    if (order == 1) {
        let auto_page_move = el.parentElement.getElementsByClassName("image_format_viewer_items_auto_page_move");
        let left = auto_page_move[0];

        let footer_left = contents.getElementsByClassName("image_format_viewer_footer_left")[0];
        let footer_item = footer_left.getElementsByClassName("image_format_viewer_footer_item")[0];

        if (getViewerSettingsValue('isImageFormatViewerAutoPageMove') == 'true') {
            if (footer_item.classList.contains("image_format_viewer_footer_item_disabled") == false && left.getAttribute("animation") == "false") {
                left.setAttribute("animation", "true");
                left.style.display = null;
                setTimeout(() => {
                    left.children[0].style.animation = "show_auto_page_move_box_left 2s";
                    setTimeout(() => {
                        left.children[0].style.animation = null;
                        left.style.display = "none";
                    }, 2000);
                }, 400);
            }
        }
    }

    (order < 1) ? order = 1 : null;
    (order > maxOrder) ? order = maxOrder : null;
    el.setAttribute("current_order", order);
    el.style.transform = "translateX(-" + ((order * 100) - 100) + "%)";

    checkHistoryPercentImageFormatViewer();
}
function intiOrderImageFormatViewer(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items_wrap = contents.getElementsByClassName("image_format_viewer_items_wrap")[0];
    let items = contents.getElementsByClassName("image_format_viewer_items")[0];

    if (items_wrap.classList.contains("image_format_viewer_manga_mode")) {
        setOrderImageFormatViewerManga(items, 1);
    } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
}



































































function checkTransformImageFormatViewer() {
    let menuNumber = getCurrentMenuNumber();
    let contents = document.getElementById("contents_" + menuNumber);

    if (contents.getAttribute("name") == "image_format_viewer" && contents.getElementsByClassName("image_format_viewer_items_wrap").length != 0) {
        let itemsWrap = contents.getElementsByClassName("image_format_viewer_items_wrap")[0];
        if (itemsWrap.classList.contains("image_format_viewer_manga_mode") && (itemsWrap.getAttribute("double") == "true" || itemsWrap.getAttribute("double") == true)) {
            let items = itemsWrap.getElementsByClassName("image_format_viewer_items")[0];
            let itemLeft = items.getElementsByClassName("manga_image_format_viewer_item_left");
            let itemRight = items.getElementsByClassName("manga_image_format_viewer_item_right");
    
            for (let i = 0; i < itemLeft.length; i++) {
                let left = itemLeft[i];
                let right = itemRight[i];
                if (right != null) {
                    let leftChild = left.children[0];
                    let rightChild = right.children[0];
    
                    let leftWidth = left.clientWidth;
                    let rightWidth = right.clientWidth;
                    let leftChildWidth = leftChild.clientWidth; //child
                    let rightChildWidth = rightChild.clientWidth; //child
    
                    let leftDifference = leftWidth - leftChildWidth;
                    let rightDifference = rightWidth - rightChildWidth;
    
                    if (leftDifference > rightDifference) {
                        let difference = (leftDifference - rightDifference) / 2;
                        left.style.transform = "translateX(-" + difference + "px)";
                        right.style.transform = "translateX(-" + difference + "px)";
                    } else {
                        let difference = (rightDifference - leftDifference) / 2;
                        left.style.transform = "translateX(" + difference + "px)";
                        right.style.transform = "translateX(" + difference + "px)";
                    }
                }
            }
        } else {
            //초기화
            let item = itemsWrap.getElementsByClassName("image_format_viewer_item");
            for (let i = 0; i < item.length; i++) {
                item[i].style.transform = null;
            }
        }
    }
}
function registerCheckTransformImageFormatViewer() {
    let startTime = new Date().getTime();

    let previousTimestamp = null;
    function callback(timestamp) {
        if (previousTimestamp === timestamp) { return };
        previousTimestamp = timestamp;

        let time = new Date().getTime();
        let difference = time - startTime;
        
        if (difference <= 200) {
            checkTransformImageFormatViewer();
            window.requestAnimationFrame(callback);
        }
    }
    window.requestAnimationFrame(callback);
}
function eventCheckTransformImageFormatViewer() {
    let menuNumber = getCurrentMenuNumber();
    let contents = document.getElementById("contents_" + menuNumber);

    if (contents.getAttribute("name") == "image_format_viewer" && contents.getElementsByClassName("image_format_viewer_items_wrap").length != 0) {
        let itemsWrap = contents.getElementsByClassName("image_format_viewer_items_wrap")[0];
        itemsWrap.style.transition = "all 0s";
    
        //체크
        checkTransformImageFormatViewer();
    
        //초기화
        function callback() {
            itemsWrap.style.transition = null;
        }
        window.requestAnimationFrame(callback);
    }
}
window.addEventListener("resize", eventCheckTransformImageFormatViewer);
window.addEventListener("focus", eventCheckTransformImageFormatViewer);

function delayCheckTransformImageFormatViewer() {
    function callback() {
        checkTransformImageFormatViewer();
    }
    window.requestAnimationFrame(callback);
}
















































function setQualityImageFormatViewer(quality) {
    let menuNumber = getCurrentMenuNumber();
    let contents = document.getElementById("contents_" + menuNumber);
    let lines = JSON.parse(contents.getElementsByClassName("part_info")[0].innerHTML)["data"]["lines"];

    //값 변경
    setViewerSettingsValue('imageFormatViewerQuality', quality);

    imageFormatViewerLinesLoad(menuNumber, lines, quality);
}














































function setViewerModeImageFormatViewer(value) {
    let menuNumbers = getMenuNumbers();
    let currentMenuNumber = getCurrentMenuNumber();
    for (let i = 0; i < menuNumbers.length; i++) {
        let contents = document.getElementById("contents_" + menuNumbers[i]);
        if (contents.getAttribute("name") == "image_format_viewer") {
            let workInfo = JSON.parse(contents.getElementsByClassName("work_info")[0].innerHTML);
            let items_wrap = contents.getElementsByClassName("image_format_viewer_items_wrap")[0];

            let isImageDouble = items_wrap.getAttribute("double");
            let previousMode = items_wrap.classList.contains("image_format_viewer_manga_mode");
            let mode = value;
            if (mode == "auto") {
                if (workInfo["contentsType"] == 1) {
                    mode = 1;
                } else {
                    mode = 0;
                }
            }
    
            let items = items_wrap.getElementsByClassName("image_format_viewer_items")[0];
            if (previousMode == true && mode == 0) {
                items_wrap.classList.remove("image_format_viewer_manga_mode");
    
                let maxOrder = Number.parseInt(items.getAttribute("item_count"));
                let order = Number.parseInt(items.getAttribute("current_order"));
    
                if (isImageDouble == "true") {
                    order = (order * 2) + 0.5;
                    order = Math.floor(order);
                    (order > maxOrder) ? order = maxOrder : null;
                }
                let percent = order / maxOrder;
    
                let rect = items.getBoundingClientRect();
                let scrollY = rect.bottom - rect.top;
                scrollY *= percent;
    
                if (menuNumbers[i] == currentMenuNumber) {
                    window.scrollBy({
                        top: scrollY - window.innerHeight,
                        left: 0
                    });
                } else {
                    menuScrollY[menuNumbers[i]] = scrollY - window.innerHeight;
                }
    
                //
                items.style.transition = "all 0s";
                items.style.transform = null;
                function callback() {
                    items.style.transition = null;
                }
                window.requestAnimationFrame(callback);
            } else if (previousMode == false && mode == 1) {
                let percent = 0;
                if (menuNumbers[i] == currentMenuNumber) {
                    let rect = items.getBoundingClientRect();
    
                    percent = (rect.bottom - window.innerHeight) / rect.height;
                    percent = 1 - percent;
                    (percent > 1) ? percent = 1 : null;
                    (percent < 0) ? percent = 0 : null;
    
                    window.scrollTo({
                        top: 0,
                        left: 0
                    });
                }
    
                let maxOrder = Number.parseInt(items.getAttribute("item_count"));
                let order = Math.floor((maxOrder * percent) + 0.5);
    
                if (isImageDouble == "true") {
                    order = (order / 2) + 0.5;
                    order = Math.floor(order);
                    (order > maxOrder) ? order = maxOrder : null;
                }
    
                items.setAttribute("current_order", order);
                items.style.transition = "all 0s";
                items.style.transform = "translateX(-" + ((order * 100) - 100) + "%)";
                function callback() {
                    items.style.transition = null;
                }
                window.requestAnimationFrame(callback);
    
                items_wrap.classList.add("image_format_viewer_manga_mode");
            }
        }
    }

    //값 변경
    setViewerSettingsValue('imageFormatViewerMode', value);

    //체크
    checkTransformImageFormatViewer();
}
function setImageCountImageFormatViewer(value) {
    let items_wrap = document.getElementsByClassName("image_format_viewer_items_wrap");
    for (let i = 0; i < items_wrap.length; i++) {
        if (items_wrap[i].classList.contains("image_format_viewer_manga_mode")) {
            let previousImageCount = items_wrap[i].getAttribute("double");
            let imageCount = value;

            if (imageCount == 1) {
                items_wrap[i].setAttribute("double", "false");
            } else if (imageCount == 2) {
                items_wrap[i].setAttribute("double", "true");
            }

            //보고 있는 위치 보존
            let items = items_wrap[i].getElementsByClassName("image_format_viewer_items")[0];
            let maxOrder = Number.parseInt(items.getAttribute("item_count"));
            let order = Number.parseInt(items.getAttribute("current_order"));
            if (previousImageCount == "true" && imageCount == 1) {
                order = (order * 2) + 0.5;
                order = Math.floor(order);
                (order > maxOrder) ? order = maxOrder : null;

                items.setAttribute("current_order", order);
                items.style.transition = "all 0s";
                items.style.transform = "translateX(-" + ((order * 100) - 100) + "%)";
                function callback() {
                    items.style.transition = null;
                }
                window.requestAnimationFrame(callback);
            } else if (previousImageCount == "false" && imageCount == 2) {
                maxOrder = (maxOrder / 2) + 0.5;
                maxOrder = Math.floor(maxOrder);

                order = (order / 2) + 0.5;
                order = Math.floor(order);
                (order > maxOrder) ? order = maxOrder : null;

                items.setAttribute("current_order", order);
                items.style.transition = "all 0s";
                items.style.transform = "translateX(-" + ((order * 100) - 100) + "%)";
                function callback() {
                    items.style.transition = null;
                }
                window.requestAnimationFrame(callback);
            }
        }
    }

    //값 변경
    setViewerSettingsValue('imageFormatViewerImageCount', value);

    //체크
    checkTransformImageFormatViewer();
}























































function popupImageFormatViewerUserTranslation(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let partInfo = JSON.parse(contents.getElementsByClassName("part_info")[0].innerHTML);

    let data = {
        "originalLanguage": partInfo["original_language"],
        "number": partInfo["number"],
        "type": partInfo["type"]
    }

    openPopupContents("part_user_translation", null, data);
}