



function menuVideoLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let menuVideo = contents.getElementsByClassName("menu_video")[0];
    let workInfo = JSON.parse(contents.getElementsByClassName("work_info")[0].innerHTML);
    let partInfo = JSON.parse(contents.getElementsByClassName("part_info")[0].innerHTML);
    let partListInfo = JSON.parse(contents.getElementsByClassName("part_list_info")[0].innerHTML);
    let partListCount = Number.parseInt(contents.getElementsByClassName("part_list_count")[0].innerHTML);
    let chapterTitle = contents.getElementsByClassName("chapter_title")[0].innerHTML.trim();
    let leftBox = contents.getElementsByClassName("menu_video_left_box_in")[0];

    //이전, 다음 회차 구하기
    let previousPartInfo = null;
    let nextPartInfo = null;
    for (let i = 0; i < partListInfo.length; i++) {
        if (partListInfo[i]["number"] == partInfo["number"]) {
            //이전 회차 정보
            if (partListInfo[i - 1] != null) {
                previousPartInfo = partListInfo[i - 1];
            }
            //다음 회차 정보
            if (partListInfo[i + 1] != null) {
                nextPartInfo = partListInfo[i + 1];
            }
        }
    }

    //비디오 플레이어 생성
    let property = {
        'autoPlay': true,
        'thumbnailImage': partInfo["thumbnail_image"],
        'partNumber': partInfo["number"],
        'videoTitle': partInfo["title"],
        'workTitle': workInfo["title"],
        'chapterTitle': chapterTitle,
        'originatorName': workInfo["originator"]["nickname"],
        'language': partInfo["language"],
        'originalLanguage': partInfo["original_language"],
        'localizationLanguage': partInfo["localization_language"],
        'percentViewed': partInfo["percent_viewed"]
    }
    //이전 회차
    if (previousPartInfo != null) {
        let category = '...';
        if (previousPartInfo["category"] == "episode") {
            let episode = previousPartInfo["episode"];
            category = getLanguage("work_part_category:episode_count").replaceAll("{R:0}", episode);
        } else {
            category = getLanguage("work_part_category:" + previousPartInfo["category"]);
        }
        property["previous"] = {
            'title': previousPartInfo["title"],
            'description': category,
            'thumbnailImage': previousPartInfo["thumbnail_image"],
            'onclick': 'loadPartMenuVideo(' + menuNumber + ', ' + previousPartInfo["number"] + ');'
        }
    }
    //다음 회차
    if (nextPartInfo != null) {
        let category = '...';
        if (nextPartInfo["category"] == "episode") {
            let episode = nextPartInfo["episode"];
            category = getLanguage("work_part_category:episode_count").replaceAll("{R:0}", episode);
        } else {
            category = getLanguage("work_part_category:" + nextPartInfo["category"]);
        }
        property["next"] = {
            'title': nextPartInfo["title"],
            'description': category,
            'thumbnailImage': nextPartInfo["thumbnail_image"],
            'onclick': 'loadPartMenuVideo(' + menuNumber + ', ' + nextPartInfo["number"] + ');'
        }
    }
    createVideoPlayer(leftBox, partInfo["data"], property);

    let info_work_info_left = contents.getElementsByClassName("menu_video_left_info_work_info_left")[0].getElementsByTagName("span")[0];
    info_work_info_left.innerHTML = (workInfo["title"] + (" · <b>" + chapterTitle + "</b>"));
    let left_info_part_title = contents.getElementsByClassName("menu_video_left_info_part_title")[0];
    left_info_part_title.innerHTML = partInfo["title"];
    let info_part_info_description = contents.getElementsByClassName("menu_video_left_info_part_info_description")[0];
    info_part_info_description.innerHTML = workInfo["description"];

    //원작자 관련
    let originator_profile = contents.getElementsByClassName("menu_video_left_info_part_info_originator_profile")[0];
    originator_profile.innerHTML = `
        <div class="profile_element">
            <div class="profile_info">` + JSON.stringify(workInfo["originator"]["profile"]) + `</div>
            <div class="profile_image"></div>
        </div>
    `;
    let originator_nickname = contents.getElementsByClassName("menu_video_left_info_part_info_originator_nickname")[0];
    originator_nickname.innerHTML = workInfo["originator"]["nickname"];

    let top_right_title = contents.getElementsByClassName("menu_video_right_part_list_top_right_title")[0];
    top_right_title.innerHTML = getLanguage("work_navigation:part_list");
    let top_right_description = contents.getElementsByClassName("menu_video_right_part_list_top_right_description")[0];
    top_right_description.innerHTML = ("<span>" + workInfo["title"] + "</span><b> · " + getLanguage("item_count").replaceAll("{R:0}", partListCount) + "</b></b>");

    //회차 목록
    top_right_title = contents.getElementsByClassName("menu_video_part_list_box_items_top_right_title")[0];
    top_right_title.innerHTML = getLanguage("work_navigation:part_list");
    top_right_description = contents.getElementsByClassName("menu_video_part_list_box_items_top_right_description")[0];
    top_right_description.innerHTML = ("<span>" + workInfo["title"] + "</span><b> · " + getLanguage("item_count").replaceAll("{R:0}", partListCount) + "</b></b>");

    let partListTitle = contents.getElementsByClassName("menu_video_part_list_box_center_title")[0];
    partListTitle.innerHTML = partInfo["title"];
    let partListDescription = contents.getElementsByClassName("menu_video_part_list_box_center_description")[0];
    partListDescription.innerHTML = ("<span>" + workInfo["title"] + "</span><b> · " + getLanguage("item_count").replaceAll("{R:0}", partListCount) + "</b></b>");
    let partListThumbnail = contents.getElementsByClassName("menu_video_part_list_box_thumbnail")[0].getElementsByTagName("img")[0];
    partListThumbnail.src = (partInfo["thumbnail_image"] + "?not-from-cache-please");
    let partListEvent = `
        let rgb = getAverageRGB(this);
        let parent = this.parentElement.parentElement;

        parent.style.backgroundColor = 'rgba(' + rgb['r'] + ', ' + rgb['g'] + ', ' + rgb['b'] + ', 0.2)';

        let svg = parent.getElementsByTagName('svg')[0];
        svg.style.fill = 'rgb(' + rgb['r'] + ', ' + rgb['g'] + ', ' + rgb['b'] + ')';
    `;
    partListThumbnail.setAttribute("onload", ("imageLoad(event); " + partListEvent));

    //댓글
    let comments = contents.getElementsByClassName("menu_video_left_comments")[0];
    let commentsInfo = JSON.parse(contents.getElementsByClassName("comments_info")[0].innerHTML);

    property = {
        'originatorNumber': partInfo["user_number"]
    }
    registerComments(comments, ("part_" + partInfo["number"]), commentsInfo, property);

    //회차 목록
    loadPartListMenuVideo(menuNumber, partListInfo, partInfo["number"]);

    //체크
    checkMenuVideo(menuNumber);

    //회차 정보
    let partInfoItem = contents.getElementsByClassName("menu_video_left_info_part_info_item");
    partInfoItem[0].getElementsByTagName("span")[0].innerHTML = getTimePast(new Date(partInfo["upload_date"]));
    partInfoItem[1].getElementsByTagName("span")[0].innerHTML = getNumberUnit(partInfo["comments_count"]);
    partInfoItem[2].getElementsByTagName("span")[0].innerHTML = getNumberUnit(partInfo["views"]);

    menuVideo.setAttribute("previous_width", null);
    menuVideo.setAttribute("previous_height", null);

    //전체화면 전환 시 회차 스크롤 보존
    let previousPartListScrollTop = null;
    menuVideo.addEventListener("fullscreenchange", () => {
        let partListItems = contents.getElementsByClassName("menu_video_right_part_list_items")[0];
        if (document.fullscreenElement) {
            previousPartListScrollTop = partListItems.scrollTop;
        } else {
            function callback() {
                partListItems.scrollTo(0, previousPartListScrollTop);
                previousPartListScrollTop = null;
            }
            window.requestAnimationFrame(callback);
        }
    });
}

var videoPartListItemsHtml = new Array();
function loadPartListMenuVideo(menuNumber, info, playingNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let partListItems = contents.getElementsByClassName("menu_video_right_part_list_items")[0];
    let length = info.length;

    //새롭게 로드된 회차 리스트에 있는 회차 번호 구하기
    let numbers = new Array();
    for (let i = 0; i < length; i++) {
        numbers[numbers.length] = info[i]["number"];
    }

    //새롭게 로드된 회차 리스트에 없는 회차 삭제
    let children = partListItems.children;
    let children_length = children.length;
    for (let i = 0; i < children_length; i++) {
        if (children[i] != null) {
            let number = children[i].getAttribute("number");
            let isExist = false;
            for (let j = 0; j < length; j++) {
                if (numbers[j] == number) {
                    isExist = true;
                    break;
                }
            }
            if (isExist == false) {
                children[i].remove();
                i--;
            }
        } else {
            break;
        }
    }

    let html = "";
    for (let i = 0; i < length; i++) {
        let category = '...';
        if (info[i]["category"] == "episode") {
            let episode = info[i]["episode"];
            category = getLanguage("work_part_category:episode_count").replaceAll("{R:0}", episode);
        } else {
            category = getLanguage("work_part_category:" + info[i]["category"]);
        }

        let newEl = document.createElement("div");
        newEl.classList.add("menu_video_right_part_list_item");
        newEl.classList.add("md-ripples");
        newEl.classList.add("visible_element");
        if (info[i]["number"] == playingNumber) {
            newEl.classList.add("menu_video_right_part_list_item_playing");
        }
        if (info[i]["isViewed"] == true) {
            newEl.classList.add("menu_video_right_part_list_item_viewed");
        }
        newEl.setAttribute("number", info[i]["number"]);
        newEl.setAttribute("onclick", "loadPartMenuVideo(" + menuNumber + ", " + info[i]["number"] + ");");

        let event = `
            let parent = this.parentElement.parentElement;

            if (parent != null && parent.classList.contains('menu_video_right_part_list_item_playing')) {
                let rgb = getAverageRGB(this);
                parent.style.backgroundColor = 'rgba(' + rgb['r'] + ', ' + rgb['g'] + ', ' + rgb['b'] + ', 0.2)';

                let svg = parent.getElementsByTagName('svg')[0];
                svg.style.fill = 'rgb(' + rgb['r'] + ', ' + rgb['g'] + ', ' + rgb['b'] + ')';
            }
        `;

        let percentViewed = 0;
        let percentViewedAddClass = "";
        if (info[i]["percent_viewed"] != null) {
            percentViewed = info[i]["percent_viewed"] * 100;
            percentViewedAddClass = " show_part_list_item_thumbnail_viewed_percent";
        }

        newEl.innerHTML = `
            <div class = "menu_video_right_part_list_item_left">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M22.406,4.461a3,3,0,0,1,5.187,0L47.379,38.492A3,3,0,0,1,44.786,43H5.214a3,3,0,0,1-2.594-4.508Z" transform="translate(50) rotate(90)"></path></g></svg>
            </div>
            <div class = "menu_video_right_part_list_item_thumbnail img_wrap">
                <div class = "menu_video_right_part_list_item_thumbnail_viewed_percent` + percentViewedAddClass + `">
                    <div class = "menu_video_right_part_list_item_thumbnail_viewed_percent_line">
                        <div class = "menu_video_right_part_list_item_thumbnail_viewed_percent_fill" style = "width: ` + percentViewed + `%;"></div>
                    </div>
                </div>
                <img src = "` + info[i]["thumbnail_image"] + `?not-from-cache-please" crossorigin = "anonymous" onload = "imageLoad(event); ` + event + `" onchange = "` + event + `" alt = "">
            </div>
            <div class = "menu_video_right_part_list_item_right">
                <div class = "menu_video_right_part_list_item_right_title">
                    ` + info[i]["title"] + `
                </div>
                <div class = "menu_video_right_part_list_item_right_description">
                    ` + category + `
                </div>
            </div>
        `;
        newEl.style.order = i;
        
        //이미 회차 리스트에 존재하는지
        let element = null;
        let isExist = false;
        children_length = children.length;
        for (let j = 0; j < children_length; j++) {
            let number = children[j].getAttribute("number");
            if (number == info[i]["number"]) {
                element = children[j];
                isExist = true;
                break;
            }
        }
        if (isExist == false) {
            partListItems.appendChild(newEl);
        } else {
            element.style.order = i;
        }

        html += newEl.outerHTML;
    }
    videoPartListItemsHtml[menuNumber] = html;

    checkPartViewed();
    checkPercentPartViewed();
}

function showVideoPartListBoxItems(menuNumber) {
    if (hideVideoPartListBoxItemsTimeout[menuNumber] != null) {
        clearTimeout(hideVideoPartListBoxItemsTimeout[menuNumber]);
        hideVideoPartListBoxItemsTimeout[menuNumber] = null;
    }
    
    let contents = document.getElementById("contents_" + menuNumber);
    let partListBoxItems = contents.getElementsByClassName("menu_video_part_list_box_items")[0];
    partListBoxItems.innerHTML = videoPartListItemsHtml[menuNumber];
    let item = partListBoxItems.getElementsByClassName("menu_video_right_part_list_item");
    let length = item.length;
    for (let i = 0; i < length; i++) {
        item[i].classList.remove("menu_video_right_part_list_item_playing");
    }
    let playingNumber = null;
    let partListItems = contents.getElementsByClassName("menu_video_right_part_list_items")[0];
    let partListItem = partListItems.getElementsByClassName("menu_video_right_part_list_item");
    let partListItem_length = partListItem.length;
    for (let i = 0; i < partListItem_length; i++) {
        if (partListItem[i].classList.contains("menu_video_right_part_list_item_playing")) {
            playingNumber = partListItem[i].getAttribute("number");
            break;
        }
    }
    for (let i = 0; i < length; i++) {
        if (item[i].getAttribute("number") == playingNumber) {
            item[i].classList.add("menu_video_right_part_list_item_playing");
            break;
        }
    }

    checkMenuVideoResize[menuNumber] = true;
    checkMenuVideo(menuNumber);

    function callback() {
        //스크롤 위치
        partListBoxItems.scrollTo(0, 0);
        let partListItem = partListBoxItems.children;
        for (let i = 0; partListItem.length; i++) {
            if (partListItem[i].classList.contains("menu_video_right_part_list_item_playing")) {
                let partListItemsRect = partListBoxItems.getBoundingClientRect();
                let itemRect = partListItem[i].getBoundingClientRect();
                let scrollTop = (itemRect.top - partListItemsRect.top) - ((partListItemsRect.height - itemRect.height) / 2);
                partListBoxItems.scrollTo(0, scrollTop);
                break;
            }
        }
    }
    window.requestAnimationFrame(callback);
    
    checkPartViewed();
    checkPercentPartViewed();
}
var hideVideoPartListBoxItemsTimeout = new Array();
function hideVideoPartListBoxItems(menuNumber) {
    hideVideoPartListBoxItemsTimeout[menuNumber] = setTimeout(() => {
        let contents = document.getElementById("contents_" + menuNumber);
        let partListBoxItems = contents.getElementsByClassName("menu_video_part_list_box_items")[0];
        partListBoxItems.textContent = "";
        hideVideoPartListBoxItemsTimeout[menuNumber] = null;
    }, 200);
}

var checkMenuVideoResize = new Array();
function checkMenuVideo(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let header = document.getElementsByTagName("header")[0];
    header.style.transition = "background-color 0.2s";

    if (contents.getElementsByClassName("menu_video").length != 0) {
        let menuVideo = contents.getElementsByClassName("menu_video")[0];
        let menuVideoRight = contents.getElementsByClassName("menu_video_right")[0];
        let videoBox = contents.getElementsByClassName("menu_video_left_box_in")[0];
        let infoBoxTop = contents.getElementsByClassName("menu_video_left_info_top")[0];

        let previousWidth = menuVideo.getAttribute("previous_width");
        let previousHeight = menuVideo.getAttribute("previous_height");

        let isResize = false;
        if (previousWidth != window.innerWidth || previousHeight != window.innerHeight) {
            menuVideo.setAttribute("previous_width", window.innerWidth);
            menuVideo.setAttribute("previous_height", window.innerHeight);
            isResize = true;
        }
        let changeAspectRatio = videoBox.getAttribute("change_aspect_ratio");
        if (changeAspectRatio == true || changeAspectRatio == "true") {
            videoBox.setAttribute("change_aspect_ratio", null);
            isResize = true;
        }
        if (checkMenuVideoResize[menuNumber] != null && checkMenuVideoResize[menuNumber] == true) {
            isResize = true;
            checkMenuVideoResize[menuNumber] = null;
        }

        //초기화
        if (isResize == true) {
            videoBox.style.maxHeight = null;
            menuVideo.style.maxWidth = null;
        }

        //회차 목록 관련
        let partListBox = contents.getElementsByClassName("menu_video_part_list")[0];
        let partListBoxStyle = window.getComputedStyle(partListBox);
        let partListBoxDisplay = partListBoxStyle.getPropertyValue("display");

        let partListBoxWrap = contents.getElementsByClassName("menu_video_part_list_box_wrap")[0];
        let partListBoxWrapHeight = 0;
        if (partListBoxDisplay != "none") {
            partListBoxWrapHeight = getAbsoluteHeight(partListBoxWrap);
        } else {
            partListBoxWrapHeight = 10;
        }
        
        if (isResize == true) {
            let clientRect = videoBox.getBoundingClientRect();
            let relativeTop = clientRect.top;
            let scrolledTopLength = window.pageYOffset; // 스크롤된 길이
            let absoluteTop = scrolledTopLength + relativeTop; // 절대좌표
    
            let menuVideoRightRect = menuVideoRight.getBoundingClientRect();
            let videoBoxRect = videoBox.getBoundingClientRect();
            let infoBoxTopRect = infoBoxTop.getBoundingClientRect();

            //최대 높이
            let maxHeight = window.innerHeight;
            maxHeight -= absoluteTop;
            maxHeight -= infoBoxTopRect.height;
            maxHeight -= 20;
            maxHeight -= partListBoxWrapHeight;
            (maxHeight < 360) ? maxHeight = 360 : null;
            videoBox.style.maxHeight = (maxHeight + "px");

            videoBoxRect = videoBox.getBoundingClientRect();

            //최대 Width 구하기
            let maxWidth = (videoBoxRect.width + menuVideoRightRect.width);
            menuVideo.style.maxWidth = (maxWidth + 40) + "px";
        }

        //회차 목록
        let partListItems = contents.getElementsByClassName("menu_video_right_part_list_items")[0];
        let previousScrollY = null;
        if (isResize == true) {
            previousScrollY = partListItems.scrollTop;
            let videoBoxRect = videoBox.getBoundingClientRect();
            
            partListItems.style.maxHeight = null;

            let partList = contents.getElementsByClassName("menu_video_right_part_list")[0];
            partList.style.minHeight = (videoBoxRect.height + "px");
            partList.style.maxHeight = ((window.innerHeight - 100) + "px");

            let partListRect = partList.getBoundingClientRect();
            let partListTop = contents.getElementsByClassName("menu_video_right_part_list_top")[0];
            let partListTopRect = partListTop.getBoundingClientRect();
            let maxHeight = (partListRect.height - partListTopRect.height);
            if (maxHeight != 0) {
                partListItems.style.maxHeight = (maxHeight + "px");
            }
            partListItems.scrollTop = previousScrollY;
        }

        //회차 목록 관련
        let menuVideoStyle = window.getComputedStyle(menuVideo);
        let menuVideoPaddingBottom = Number.parseFloat(menuVideoStyle.getPropertyValue("padding-bottom").replaceAll("px", ""));

        let partListBoxItems = contents.getElementsByClassName("menu_video_part_list_box_items")[0];
        if (isResize == true) {
            previousScrollY = partListBoxItems.scrollTop;
        }

        //회차 목록 스크롤 위치
        let menuVideoRightStyle = window.getComputedStyle(menuVideoRight);
        if (menuVideoRightStyle.getPropertyValue("display") != "none") {
            let isShow = menuVideoRight.getAttribute("is_show");

            if (isShow == null || (isShow == false || isShow == "false")) {
                let partListItem = partListItems.children; 

                for (let i = 0; partListItem.length; i++) {
                    if (partListItem[i].classList.contains("menu_video_right_part_list_item_playing")) {
                        let partListItemsRect = partListItems.getBoundingClientRect();
                        let itemRect = partListItem[i].getBoundingClientRect();
                        let scrollTop = (itemRect.top - partListItemsRect.top) - ((partListItemsRect.height - itemRect.height) / 2);
                        partListItems.scrollTo(0, scrollTop);
                        break;
                    }
                }

                partListBox.classList.remove("show_menu_video_part_list");
                hideVideoPartListBoxItems(menuNumber);

                menuVideoRight.setAttribute("is_show", true);
            }
        } else {
            menuVideoRight.setAttribute("is_show", false);
        }

        if (partListBoxDisplay != "none") {
            if (isResize == true) {
                let partListBoxItemsWrap = contents.getElementsByClassName("menu_video_part_list_box_items_wrap")[0];
                partListBoxItemsWrap.style.maxHeight = null;
                partListBoxItems.style.maxHeight = null;
    
                let partListWrap = contents.getElementsByClassName("menu_video_part_list_wrap")[0];
                let partListWrapRect = partListWrap.getBoundingClientRect();
                let partListBoxWrapHeight = getAbsoluteHeight(partListBoxWrap);
                
                let maxHeight = (partListWrapRect.height - partListBoxWrapHeight);
                
                var match = window.matchMedia("screen and (max-width: 700px)");
                if (match.matches == true) {
                    maxHeight -= 10;
                } else {
                    maxHeight -= 20;
                }
                partListBoxItemsWrap.style.maxHeight = (maxHeight + "px");
    
                let partListBoxItemsTop = contents.getElementsByClassName("menu_video_part_list_box_items_top")[0];
                let partListBoxItemsTopRect = partListBoxItemsTop.getBoundingClientRect();
                partListBoxItems.style.maxHeight = ((maxHeight - partListBoxItemsTopRect.height) + "px");
                partListBoxItems.scrollTop = previousScrollY;

                menuVideo.style.marginBottom = ((partListBoxWrapHeight - menuVideoPaddingBottom) + "px");
            }
        } else {
            menuVideo.style.marginBottom = null;
        }

        //다크모드인지
        let isDarkMode = document.documentElement.classList.contains("dark_mode");
        if (document.documentElement.classList.contains("black_mode")) {
            isDarkMode = true;
        }
        //동적 조명 효과 사용 여부
        let isUseDynamicLightEffect = getVideoPlayerSettingsValue("isUseDynamicLightEffect");

        if (isUseDynamicLightEffect == true && isDarkMode == true && document.documentElement.scrollTop <= 55 && partListBox.classList.contains("show_menu_video_part_list") == false) {
            //헤더 투명으로
            header.style.backgroundColor = "transparent";
        } else {
            //헤더 복구
            header.style.backgroundColor = null;
        }

        if (partListBox.classList.contains("show_menu_video_part_list")) {
            partListBox.setAttribute("is_show_part_list", true);
            setBodyScroll(false);
        } else {
            let isShow = partListBox.getAttribute("is_show_part_list");
            if (isShow == true || isShow == "true") {
                partListBox.setAttribute("is_show_part_list", null);
                setBodyScroll(true);
            }
        }
    }
}

function registerMenuCheckMenuVideo() {
    let previousTimestamp = null;
    function callback(timestamp) {
        if (previousTimestamp === timestamp) { return };
        previousTimestamp = timestamp;
        
        if (getCurrentMenuName() == "video") {
            let menuNumber = getCurrentMenuNumber();
            checkMenuVideo(menuNumber);
        } else {
            //헤더 복구
            let header = document.getElementsByTagName("header");
            if (header.length != 0) {
                header[0].style.transition = null;
                header[0].style.backgroundColor = null;
            }
        }
        window.requestAnimationFrame(callback);
    }
    window.requestAnimationFrame(callback);
}
registerMenuCheckMenuVideo();

function loadPartMenuVideo(menuNumber, number) {
    let contents = document.getElementById("contents_" + menuNumber);
    let partListItem = contents.getElementsByClassName("menu_video_right_part_list_item");
    let workInfo = JSON.parse(contents.getElementsByClassName("work_info")[0].innerHTML);
    let leftBox = contents.getElementsByClassName("menu_video_left_box_in")[0];
    let partListBox = contents.getElementsByClassName("menu_video_part_list")[0];

    partViewedList[partViewedList.length] = number;
    partViewedList = new Set(partViewedList);
    partViewedList = [...partViewedList];
    
    checkPartViewed();
    checkPercentPartViewed();

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/work/getContents.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                //스크롤 복구
                let previousScrollY = window.scrollY;
                
                for (let i = 0; i < partListItem.length; i++) {
                    if (partListItem[i].getAttribute("number") == number) {
                        partListItem[i].classList.add("menu_video_right_part_list_item_playing");
                        if (partListItem[i].getElementsByTagName("img").length != 0) {
                            partListItem[i].getElementsByTagName("img")[0].onchange();
                        }
                    } else {
                        partListItem[i].classList.remove("menu_video_right_part_list_item_playing");
                        partListItem[i].style.backgroundColor = null;
                    }
                }
                partListBox.classList.remove("show_menu_video_part_list");
                hideVideoPartListBoxItems(menuNumber);

                //회차 리스트 로드
                loadPartListMenuVideo(menuNumber, info["partListInfo"], number);

                //회차 목록 스크롤 위치
                let partListItems = contents.getElementsByClassName("menu_video_right_part_list_items")[0];
                let previousPartListScrollTop = partListItems.scrollTop;
                partListItems.scrollTo(0, 0);
                for (let i = 0; partListItem.length; i++) {
                    if (partListItem[i].classList.contains("menu_video_right_part_list_item_playing")) {
                        let partListItemsRect = partListItems.getBoundingClientRect();
                        let itemRect = partListItem[i].getBoundingClientRect();
                        let scrollTop = (itemRect.top - partListItemsRect.top) - ((partListItemsRect.height - itemRect.height) / 2);
                        partListItems.scrollTo(0, previousPartListScrollTop);
                        function callback48316521() {
                            partListItems.scrollTo({
                                top: scrollTop,
                                behavior: 'smooth'
                            });
                        }
                        window.requestAnimationFrame(callback48316521);
                        break;
                    }
                }

                //비디오 플레이어 삭제 및 생성
                leftBox.textContent = "";
                
                //이전, 다음 회차 구하기
                let previousPartInfo = null;
                let nextPartInfo = null;
                for (let i = 0; i < info["partListInfo"].length; i++) {
                    if (info["partListInfo"][i]["number"] == info["partInfo"]["number"]) {
                        //이전 회차 정보
                        if (info["partListInfo"][i - 1] != null) {
                            previousPartInfo = info["partListInfo"][i - 1];
                        }
                        //다음 회차 정보
                        if (info["partListInfo"][i + 1] != null) {
                            nextPartInfo = info["partListInfo"][i + 1];
                        }
                    }
                }

                let property = {
                    'autoPlay': true,
                    'thumbnailImage': info["partInfo"]["thumbnail_image"],
                    'partNumber': info["partInfo"]["number"],
                    'videoTitle': info["partInfo"]["title"],
                    'workTitle': workInfo["title"],
                    'chapterTitle': info["chapterTitle"],
                    'originatorName': workInfo["originator"]["nickname"],
                    'language': info["partInfo"]["language"],
                    'originalLanguage': info["partInfo"]["original_language"],
                    'localizationLanguage': info["partInfo"]["localization_language"],
                    'percentViewed': info["partInfo"]["percent_viewed"]
                }
                //이전 회차
                if (previousPartInfo != null) {
                    let category = '...';
                    if (previousPartInfo["category"] == "episode") {
                        let episode = previousPartInfo["episode"];
                        category = getLanguage("work_part_category:episode_count").replaceAll("{R:0}", episode);
                    } else {
                        category = getLanguage("work_part_category:" + previousPartInfo["category"]);
                    }
                    property["previous"] = {
                        'title': previousPartInfo["title"],
                        'description': category,
                        'thumbnailImage': previousPartInfo["thumbnail_image"],
                        'onclick': 'loadPartMenuVideo(' + menuNumber + ', ' + previousPartInfo["number"] + ');'
                    }
                }
                //다음 회차
                if (nextPartInfo != null) {
                    let category = '...';
                    if (nextPartInfo["category"] == "episode") {
                        let episode = nextPartInfo["episode"];
                        category = getLanguage("work_part_category:episode_count").replaceAll("{R:0}", episode);
                    } else {
                        category = getLanguage("work_part_category:" + nextPartInfo["category"]);
                    }
                    property["next"] = {
                        'title': nextPartInfo["title"],
                        'description': category,
                        'thumbnailImage': nextPartInfo["thumbnail_image"],
                        'onclick': 'loadPartMenuVideo(' + menuNumber + ', ' + nextPartInfo["number"] + ');'
                    }
                }
                createVideoPlayer(leftBox, info["partInfo"]["data"], property);

                //
                let title = contents.getElementsByClassName("menu_video_left_info_part_title")[0];
                title.innerHTML = info["partInfo"]["title"];

                let info_work_info_left = contents.getElementsByClassName("menu_video_left_info_work_info_left")[0].getElementsByTagName("span")[0];
                info_work_info_left.innerHTML = (workInfo["title"] + (" · <b>" + info["chapterTitle"] + "</b>"));

                //회차 정보
                let partInfoItem = contents.getElementsByClassName("menu_video_left_info_part_info_item");
                partInfoItem[0].getElementsByTagName("span")[0].innerHTML = getTimePast(new Date(info["partInfo"]["upload_date"]));
                partInfoItem[1].getElementsByTagName("span")[0].innerHTML = getNumberUnit(info["partInfo"]["comments_count"]);
                partInfoItem[2].getElementsByTagName("span")[0].innerHTML = getNumberUnit(info["partInfo"]["views"]);

                //댓글
                let comments = contents.getElementsByClassName("menu_video_left_comments")[0];
                comments.textContent = "";
                let commentsInfo = info["commentsInfo"];

                property = {
                    'originatorNumber': info["partInfo"]["user_number"]
                }
                registerComments(comments, ("part_" + info["partInfo"]["number"]), commentsInfo, property);

                //히스토리 정보 수정
                let state = history.state;
                if (state["url"] != null) {
                    let url = state["url"];
                    let property = state["property"];
                    let data = state["data"];
                    data["number"] = info["partInfo"]["number"];

                    historyData = {
                        "url": url,
                        "property": property,
                        "data": data
                    };

                    let historyTitle = info["partInfo"]["title"];
                    let historyUrl = ("/video/" + info["partInfo"]["number"]);
                    history.replaceState(historyData, historyTitle, historyUrl);

                    //브라우저 제목
                    let title = document.getElementsByTagName("title")[0];
                    title.innerText = historyTitle + " - " + siteName;
                }

                //회차 정보 수정
                let partInfo = contents.getElementsByClassName("part_info")[0];
                partInfo.innerHTML = JSON.stringify(info["partInfo"]);
                //회차 목록 정보 수정
                let partListInfo = contents.getElementsByClassName("part_list_info")[0];
                partListInfo.innerHTML = JSON.stringify(info["partListInfo"]);

                //회차 목록
                let partListTitle = contents.getElementsByClassName("menu_video_part_list_box_center_title")[0];
                partListTitle.innerHTML = info["partInfo"]["title"];
                let partListThumbnail = contents.getElementsByClassName("menu_video_part_list_box_thumbnail")[0].getElementsByTagName("img")[0];
                partListThumbnail.style.animation = null;
                partListThumbnail.src = (info["partInfo"]["thumbnail_image"] + "?not-from-cache-please");

                //스크롤 복구
                function callback() {
                    window.scrollTo(0, previousScrollY);
                    //회차 이동 시 스크롤 초기화
                    if (getVideoPlayerSettingsValue("isUseScrollReset") == true) {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                    }
                }
                window.requestAnimationFrame(callback);
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
    formData.append("partNumber", number);

    xhr.send(formData);
}




























































function menuVideoShare(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let workInfo = JSON.parse(contents.getElementsByClassName("work_info")[0].innerHTML);
    let partInfo = JSON.parse(contents.getElementsByClassName("part_info")[0].innerHTML);

    let title = partInfo["title"];
    let description = workInfo["description"];

    let shareData = {
        title: title,
        text: description,
        url: "https://louibooks.com/video/" + partInfo["number"]
    };

    if (navigator.canShare && navigator.canShare(shareData)) {
        window.navigator.share(shareData);
    };
}