



function registerCommunity(el, uid, info, property) {
    function callback() {
        if (loginStatus != null) {
            createCommunity(el, uid, info, property);
        } else {
            window.requestAnimationFrame(callback);
        }
    }
    window.requestAnimationFrame(callback);
}

function createCommunity(el, uid, info, property) {
    (property == null) ? property = new Array() : null;
    var uniqueNumber = Math.floor(Math.random() * 999999999999);

    //커뮤니티 생성
    let newEl = document.createElement("div");
    newEl.classList.add("community_box");
    newEl.setAttribute("unique_number", uniqueNumber);
    newEl.setAttribute("uid", uid);
    newEl.setAttribute("community_numbers", info["numbers"]);
    if (property["originatorNumber"] != null) {
        newEl.setAttribute("originator_number", property["originatorNumber"]);
    }
    let box = el.appendChild(newEl);

    let communityCount = 0;
    if (info["numbers"] != null && info["numbers"] != '') {
        communityCount = info["numbers"].split(",").length;
    }

    //커뮤니티 항목 개수, 커뮤니티 정렬
    newEl = document.createElement("div");
    newEl.classList.add("community_box_top");
    newEl.innerHTML = `
        <div class = "community_box_top_left">
            <div class = "community_box_top_left_text">
                ` + getLanguage("community_count").replaceAll("{R:0}", commas(communityCount)) + `
            </div>
            <div class = "community_box_top_sort md-ripples" popupwidth = "max-content" onchange = "loadCommunity(getCommunityInfo(this));" value = "0" onclick = "selectList(this, getCommunitySortItems());">
                <div class = "community_box_top_sort_icon">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="50" height="3" rx="1.5" transform="translate(0 7)"/><rect width="16" height="3" rx="1.5" transform="translate(0 41)"/><rect width="33" height="3" rx="1.5" transform="translate(0 24)"/></g></svg>
                </div>
                <div class = "community_box_top_sort_title value_title">` + getLanguage("community_sort:0") + `</div>
            </div>
        </div>
        <div class = "community_box_top_right">
            <!-- html -->
        </div>
    `;
    box.appendChild(newEl);

    //커뮤니티 작성 생성
    if (property["originatorNumber"] == loginStatus["number"]) {
        newEl = document.createElement("div");
        let writeCommunity = box.appendChild(newEl);
        createWriteComments(writeCommunity);
    }

    //데이터 없음
    newEl = document.createElement("div");
    newEl.classList.add("community_box_no_data");
    newEl.style.display = "none";
    if (property["originatorNumber"] == loginStatus["number"]) {
        newEl.style.marginTop = "20px";
    }
    newEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-3094.635,49.5H-3116.5a3,3,0,0,1-3-3V3.5a3,3,0,0,1,3-3h31a3,3,0,0,1,3,3V37.365L-3094.635,49.5Z" transform="translate(3126)" opacity="0.7"/><path d="M3151.333,49.5l12.293-12.293h-9.846a2.517,2.517,0,0,0-1.983.575,2.884,2.884,0,0,0-.464,2.039Z" transform="translate(-3120)" opacity="0.6"/></g></svg>
        <div class = "community_box_no_data_title">
            ` + getLanguage("community_no_data") + `
        </div>
        <div class = "community_box_no_data_description">
            ` + getLanguage("no_data_description") + `
        </div>
    `;
    box.appendChild(newEl);

    //커뮤니티 아이템
    newEl = document.createElement("div");
    newEl.classList.add("community_items");
    let items = box.appendChild(newEl);

    let communityNumbers = info["numbers"].split(",");
    if (info["info"] != null) {
        for (let i = 0; i < info["info"].length; i++) {
            createCommunityItem(items, info["info"][i]);
            communityNumbers = communityNumbers.remove("" + info["info"][i]["number"]);
        }
    } else {
        showCommunityNoData(uniqueNumber);
    }
    box.setAttribute("community_numbers", communityNumbers.join(","));

    //커뮤니티 무한 스크롤
    newEl = document.createElement("div");
    newEl.classList.add("community_more_load");
    newEl.setAttribute("loading", false);
    newEl.innerHTML = `
        <!-- 로딩 스피너 -->
        <div class="showbox">
            <div class="loader" style="width: 35px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle></svg></div>
        </div>
    `;
    if (communityNumbers[0] == '' || communityNumbers[0] == undefined || communityNumbers[0] == null) {
        newEl.style.display = "none";
    }
    box.appendChild(newEl);
}

function showCommunityNoData(uniqueNumber) {
    let el = null;
    let community_box = document.getElementsByClassName("community_box");
    for (let i = 0; i < community_box.length; i++) {
        if (community_box[i].getAttribute("unique_number") == uniqueNumber) {
            el = community_box[i];
        }
    }

    let no_data = el.getElementsByClassName("community_box_no_data")[0];
    no_data.style.display = null;
}
function hideCommunityNoData(uniqueNumber) {
    let el = null;
    let community_box = document.getElementsByClassName("community_box");
    for (let i = 0; i < community_box.length; i++) {
        if (community_box[i].getAttribute("unique_number") == uniqueNumber) {
            el = community_box[i];
        }
    }

    let no_data = el.getElementsByClassName("community_box_no_data")[0];
    no_data.style.display = "none";
}





















function createCommunityItem(el, info, isNew, additional_direction) {
    (additional_direction == null) ? additional_direction = "bottom" : null;

    let newEl = document.createElement("div");
    newEl.classList.add("community_item");
    newEl.classList.add("visible_element");
    newEl.classList.add("variable_element");
    newEl.setAttribute("community_number", info["number"]);

    let content = JSON.parse(info["content"]);

    //
    let likes = info["likes"];
    let dislike = info["dislike"];

    (info["liked"] == true) ? likes-- : null;
    (info["dislike"] == true) ? dislike-- : null;
    
    let likesDisplay0 = "flex";
    let likesDisplay1 = "none";
    if (info["liked"] == true) {
        likesDisplay0 = "none";
        likesDisplay1 = "flex";
    }
    let dislikeDisplay0 = "flex";
    let dislikeDisplay1 = "none";
    if (info["disliked"] == true) {
        dislikeDisplay0 = "none";
        dislikeDisplay1 = "flex";
    }

    let likesButtonOnClick = 'communityLikesButton(this, ' + info["number"] + ');';
    let dislikeButtonOnClick = 'communityDislikeButton(this, ' + info["number"] + ');';
    if (loginStatus["isLogin"] == false) {
        likesButtonOnClick = 'loadMenu_login();';
        dislikeButtonOnClick = 'loadMenu_login();';
    }

    //글을 쓴 주인인지
    let isWriter = false;
    if (info["user_number"] == loginStatus["number"]) {
        isWriter = true;
    }

    newEl.innerHTML = `
        <div class = "community_item_left immutable_element md-ripples" onclick = "loadMenu_user(` + info["user_number"] + `);">
            <div class = "profile_element">
                <div class = "profile_info">` + JSON.stringify(info["profile"]) + `</div>
                <div class = "profile_image"></div>
            </div>
        </div>
        <div class = "community_item_right">
            <div class = "community_item_right_top immutable_element">
                <div class = "community_item_right_top_nickname md-ripples" onclick = "loadMenu_user(` + info["user_number"] + `);">
                    ` + info["nickname"] + `
                </div>
                <div class = "community_item_right_top_date">
                    · ` + getTimePast(new Date(info["upload_date"])) + `
                </div>
                <div class = "community_item_right_top_date_more_button md-ripples" onclick = "moreButtonCommunityItem(this, ` + info["number"] + `, ` + isWriter + `);">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-1 -1.061)"><circle cx="3" cy="3" r="3" transform="translate(23 4)"></circle><path d="M3,0A2.971,2.971,0,0,1,6,2.942,2.971,2.971,0,0,1,3,5.884,2.971,2.971,0,0,1,0,2.942,2.971,2.971,0,0,1,3,0Z" transform="translate(23 23)"></path><path d="M3,0A3.031,3.031,0,0,1,6,3.061,3.031,3.031,0,0,1,3,6.121,3.031,3.031,0,0,1,0,3.061,3.031,3.031,0,0,1,3,0Z" transform="translate(23 42)"></path></g></g></svg>
                </div>
            </div>
            <div class = "community_item_contents">
                ` + getHtmlCommunityContents(JSON.parse(info["content"])) + `
            </div>
            <div class = "community_item_bottom immutable_element">
                <div class = "community_item_bottom_item md-ripples" onclick = "` + likesButtonOnClick + `" onmouseenter = "hoverInformation(this, getLanguage('likes'));">
                    <div style = "display: ` + likesDisplay0 + `; align-items: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,25H2a2,2,0,0,1-2-2V2A2,2,0,0,1,2,0h9a2,2,0,0,1,2,2V23A2,2,0,0,1,11,25ZM3,3V22h7V3Z" transform="translate(0 22)"/><path d="M29.891,44.45H1.733a1.868,1.868,0,0,1-1.224-.511A1.982,1.982,0,0,1,0,42.469c.016-1.947,0-21.23,0-22.05L14.682,2.173A7.441,7.441,0,0,1,19.5,0a5.453,5.453,0,0,1,2.441.588,4.405,4.405,0,0,1,2.637,3.769,5.912,5.912,0,0,1-.314,2.3c-.053.119-5.339,11.957-5.81,13.943H32.295a2.518,2.518,0,0,1,1.149.888,6.6,6.6,0,0,1,1.07,4.314A50.508,50.508,0,0,1,32.532,36.58l-2.641,7.869ZM19.7,2.931a4.877,4.877,0,0,0-2.353.816c-.917.543-14.2,17.567-14.332,17.739V41.439h24.8c2.66-7.819,3.451-12.257,3.647-14.6.212-2.54-.21-3.242-.215-3.249H14.125c.851-3,3.968-10.2,5.831-14.5.534-1.234.955-2.205,1.172-2.732.94-2.283.323-2.792-.652-3.262A1.764,1.764,0,0,0,19.7,2.931Z" transform="translate(14.814 2.158)"/></g></svg>
                        <div class = "community_item_bottom_item_text">
                            ` + getNumberUnit(likes) + `
                        </div>
                    </div>
                    <div style = "display: ` + likesDisplay1 + `; align-items: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="13" height="25" rx="2" transform="translate(0 22)"/><rect width="7" height="19" transform="translate(3 25)"/><path d="M14.814,22.577,29.5,4.331S32.823.792,36.758,2.746,39.081,8.82,39.081,8.82s-5.334,11.936-5.809,13.943H47.109s2.324.634,2.218,5.2a50.274,50.274,0,0,1-1.98,10.774l-2.641,7.869H16.546a1.769,1.769,0,0,1-1.732-1.98C14.83,42.636,14.814,22.577,14.814,22.577Z"/><path d="M17.834,23.644S31.239,6.454,32.165,5.9s2.2-1.1,3.124-.652,1.613.927.652,3.261-5.9,13.354-7,17.233h17.13s1.716,2.712-3.433,17.851h-24.8Z"/></g></svg>
                        <div class = "community_item_bottom_item_text">
                            ` + getNumberUnit(likes + 1) + `
                        </div>
                    </div>
                </div>
                <div class = "community_item_bottom_item md-ripples" onclick = "` + dislikeButtonOnClick + `" onmouseenter = "hoverInformation(this, getLanguage('dislike'));">
                    <div style = "display: ` + dislikeDisplay0 + `; align-items: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,25H2a2,2,0,0,1-2-2V2A2,2,0,0,1,2,0h9a2,2,0,0,1,2,2V23A2,2,0,0,1,11,25ZM3,3V22h7V3Z" transform="translate(49.33 27.158) rotate(180)"/><path d="M29.891,44.45H1.733a1.868,1.868,0,0,1-1.224-.511A1.982,1.982,0,0,1,0,42.469c.016-1.947,0-21.23,0-22.05L14.682,2.173A7.441,7.441,0,0,1,19.5,0a5.453,5.453,0,0,1,2.441.588,4.405,4.405,0,0,1,2.637,3.769,5.912,5.912,0,0,1-.314,2.3c-.053.119-5.339,11.957-5.81,13.943H32.295a2.518,2.518,0,0,1,1.149.888,6.6,6.6,0,0,1,1.07,4.314A50.508,50.508,0,0,1,32.532,36.58l-2.641,7.869ZM19.7,2.931a4.877,4.877,0,0,0-2.353.816c-.917.543-14.2,17.567-14.332,17.739V41.439h24.8c2.66-7.819,3.451-12.257,3.647-14.6.212-2.54-.21-3.242-.215-3.249H14.125c.851-3,3.968-10.2,5.831-14.5.534-1.234.955-2.205,1.172-2.732.94-2.283.323-2.792-.652-3.262A1.764,1.764,0,0,0,19.7,2.931Z" transform="translate(34.517 47) rotate(180)"/></g></svg>
                        <div class = "community_item_bottom_item_text">
                            ` + getNumberUnit(dislike) + `
                        </div>
                    </div>
                    <div style = "display: ` + dislikeDisplay1 + `; align-items: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="13" height="25" rx="2" transform="translate(49.33 27.158) rotate(180)"/><rect width="7" height="19" transform="translate(46.33 24.158) rotate(180)"/><path d="M14.814,22.577,29.5,4.331S32.823.792,36.758,2.746,39.081,8.82,39.081,8.82s-5.334,11.936-5.809,13.943H47.109s2.324.634,2.218,5.2a50.274,50.274,0,0,1-1.98,10.774l-2.641,7.869H16.546a1.769,1.769,0,0,1-1.732-1.98C14.83,42.636,14.814,22.577,14.814,22.577Z" transform="translate(49.33 49.158) rotate(180)"/><path d="M17.834,23.644S31.239,6.454,32.165,5.9s2.2-1.1,3.124-.652,1.613.927.652,3.261-5.9,13.354-7,17.233h17.13s1.716,2.712-3.433,17.851h-24.8Z" transform="translate(49.33 49.158) rotate(180)"/></g></svg>
                        <div class = "community_item_bottom_item_text">
                            ` + getNumberUnit(dislike + 1) + `
                        </div>
                    </div>
                </div>
                <div class = "community_item_bottom_comments md-ripples" onclick = "loadMenu_community(` + info["number"] + `);">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M40.707,46.427h0a3.976,3.976,0,0,1-2.333-1.044c-3.13-2.487-11.917-9.316-12-9.383H5a5.006,5.006,0,0,1-5-5V5A5.006,5.006,0,0,1,5,0H45a5.006,5.006,0,0,1,5,5V31a5.005,5.005,0,0,1-5,5H42.466v9.106A2,2,0,0,1,40.707,46.427ZM4.906,3A1.985,1.985,0,0,0,3.016,4.9L2.984,31.027c0,.019.129,1.891,1.859,1.953H27.391l12.078,9.453V32.98h5.688A2.03,2.03,0,0,0,47,31l-.015-26.25c0-.017-.282-1.672-1.8-1.718Z" transform="translate(0 1.786)"></path></g></svg>
                    ` + getNumberUnit(info["comments_count"]) + `
                </div>
            </div>
        </div>
    `;

    if (isNew == null || isNew == false) {
        if (additional_direction == "bottom") {
            el.appendChild(newEl);
        } else if (additional_direction == "top") {
            el.prepend(newEl);
        }
    } else {
        let createEl = null;
        if (additional_direction == "bottom") {
            el.appendChild(newEl);
            let children = el.children;
            createEl = children[children.length - 1];
        } else if (additional_direction == "top") {
            el.prepend(newEl);
            createEl = el.children[0];
        }

        let height = createEl.clientHeight;
        createEl.style.maxHeight = "0px";
        createEl.style.marginBottom = "0px";
        createEl.style.transition = "unset";
        function callback() {
            createEl.style.transition = "max-height 0.2s, margin-bottom 0.2s";
            createEl.style.animation = "addCommunityItem 0.2s forwards";
            createEl.style.maxHeight = height + "px";
            createEl.style.marginBottom = null;
            setTimeout(() => {
                createEl.style.transition = null;
                createEl.style.maxHeight = null;
                createEl.style.animation = null;
            }, 200);
        }
        window.requestAnimationFrame(callback);
    }

    hideCommunityNoData(getCommunityInfo(el)["uniqueNumber"])
}
function getHtmlCommunityContents(info) {
    let html = '';
    
    //texts
    let texts = `
        <div class = "community_item_contents_texts">` + textToURL(info["texts"]) + `</div>
    `;
    //option
    let option = '';
    if (info["option"] != null) {
        if (info["option"]["type"] == 0) {
            let items = info["option"]["items"];
            let item = new Array();
            for (let i = 0; i < items.length; i++) {
                item[item.length] = `
                    <div class = "community_option_image img_wrap" onclick = "communityFullScreenImage(this, ` + (i + 1) + `);">
                        <div class = "md-ripples" style = "cursor: pointer;">
                            <img src = "` + items[i]["url"] + `" width = "` + items[i]["width"] + `" height = "` + items[i]["height"] + `" onload = "imageLoad(event);" alt = "">
                        </div>
                    </div>
                `;
            }

            let itemHtml = '';
            for (let i = 0; i < item.length; i++) {
                itemHtml += item[i];
            }

            let countStyle = '';
            if (item.length == 1) {
                countStyle = 'display: none;';
            }

            option = `
                <div class = "community_item_contents_option" style = "width: calc(100% - 10px); max-width: 600px; border-radius: 10px;">
                    <div class = "community_option_images_count" style = "` + countStyle + `">
                        <div class = "community_option_images_count_box_wrap">
                            <div class = "community_option_images_count_box">
                                <span>1</span> / ` + item.length + `
                            </div>
                        </div>
                    </div>
                    <div class = "horizontal_transform" item_count = "` + item.length + `">
                        <div class = "community_option_images">
                            ` + itemHtml + `
                        </div>
                    </div>
                </div>
            `;
        } else if (info["option"]["type"] == 1) {
            option = `
                <div class = "community_item_contents_option">
                    <div class = "community_option_youtube_video img_wrap">
                        <iframe src = "https://www.youtube.com/embed/` + info["option"]["videoId"] + `" frameborder = "0" allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                </div>
            `;
        }
    }

    html = texts + option;
    return html;
}
function communityFullScreenImage(el, order) {
    let parent = el.parentElement;
    let img = parent.getElementsByTagName("img");

    let images = new Array();
    for (let i = 0; i < img.length; i++) {
        let url = img[i].src;
        url = url.split("/");
        url = "https://img.louibooks.com/community/original/" + url[url.length - 1];
        images[images.length] = url;
    }

    fullScreenImage(images, order);
}




























function createWriteComments(el) {
    if (loginStatus["isLogin"] == true) {
        let newEl = document.createElement("div");
        newEl.classList.add("community_write");

        newEl.innerHTML = `
            <div class = "community_write_left">
                <div class = "profile_element">
                    <div class = "profile_info">` + JSON.stringify(loginStatus["profile"]) + `</div>
                    <div class = "profile_image"></div>
                </div>
            </div>
            <div class = "community_write_right">
                <div class = "community_write_right_nickname">
                    ` + loginStatus["nickname"] + `
                </div>
                <div class = "community_write_right_read_more" onclick = "communityWriteActivate(this);">
                    ` + getLanguage("community_write_placeholder") + `
                </div>
                <div class = "community_write_right_textbox" contenteditable = "true" placeholder = "` + getLanguage("community_write_placeholder") + `" onkeydown = "textbox_remove_spaces(this); checkCommunityInput(this);" onpaste = "contenteditable_paste(event);" onfocus = "communityWriteFocus(this);" onblur = "communityWriteBlur(this);"></div>
                <div class = "community_write_right_option" type = "none"></div>
                <div class = "community_write_bottom">
                    <div class = "community_write_bottom_left">
                        <div class = "community_write_bottom_left_items">
                            <div class = "community_write_bottom_left_item md-ripples" onclick = "communityWriteOptionButton(this, 0);">
                                <!-- Generated by IcoMoon.io -->
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17.125 6.17l-2.046-5.635c-0.151-0.416-0.595-0.637-0.989-0.492l-13.598 4.963c-0.394 0.144-0.593 0.597-0.441 1.013l2.156 5.941v-3.183c0-1.438 1.148-2.607 2.56-2.607h3.593l4.285-3.008 2.479 3.008h2.001zM19.238 8h-14.471c-0.42 0-0.762 0.334-0.762 0.777v9.42c0.001 0.444 0.343 0.803 0.762 0.803h14.471c0.42 0 0.762-0.359 0.762-0.803v-9.42c0-0.443-0.342-0.777-0.762-0.777zM18 17h-12v-2l1.984-4.018 2.768 3.436 2.598-2.662 3.338-1.205 1.312 3.449v3z"></path></svg>
                                <div class = "community_write_bottom_left_item_title">
                                    ` + getLanguage("community_write_button_add_image") + `
                                </div>
                            </div>
                            <div class = "community_write_bottom_left_item md-ripples" onclick = "communityWriteOptionButton(this, 1);">
                                <!-- Generated by IcoMoon.io -->
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.563 6.637c0.287 1.529 0.448 3.295 0.437 5.125 0.019 1.528-0.123 3.267-0.437 5.021-0.057 0.208-0.15 0.403-0.272 0.575-0.227 0.321-0.558 0.565-0.949 0.675-0.604 0.161-2.156 0.275-3.877 0.341-2.23 0.086-4.465 0.086-4.465 0.086s-2.235 0-4.465-0.085c-1.721-0.066-3.273-0.179-3.866-0.338-0.205-0.057-0.396-0.149-0.566-0.268-0.311-0.22-0.55-0.536-0.67-0.923-0.285-1.526-0.444-3.286-0.433-5.11-0.021-1.54 0.121-3.292 0.437-5.060 0.057-0.208 0.15-0.403 0.272-0.575 0.227-0.321 0.558-0.565 0.949-0.675 0.604-0.161 2.156-0.275 3.877-0.341 2.23-0.085 4.465-0.085 4.465-0.085s2.235 0 4.466 0.078c1.719 0.060 3.282 0.163 3.856 0.303 0.219 0.063 0.421 0.165 0.598 0.299 0.307 0.232 0.538 0.561 0.643 0.958zM23.51 6.177c-0.217-0.866-0.718-1.59-1.383-2.093-0.373-0.282-0.796-0.494-1.249-0.625-0.898-0.22-2.696-0.323-4.342-0.38-2.267-0.079-4.536-0.079-4.536-0.079s-2.272 0-4.541 0.087c-1.642 0.063-3.45 0.175-4.317 0.407-0.874 0.247-1.581 0.77-2.064 1.45-0.27 0.381-0.469 0.811-0.587 1.268-0.006 0.024-0.011 0.049-0.015 0.071-0.343 1.898-0.499 3.793-0.476 5.481-0.012 1.924 0.161 3.831 0.477 5.502 0.006 0.031 0.013 0.062 0.021 0.088 0.245 0.86 0.77 1.567 1.451 2.048 0.357 0.252 0.757 0.443 1.182 0.561 0.879 0.235 2.686 0.347 4.328 0.41 2.269 0.087 4.541 0.087 4.541 0.087s2.272 0 4.541-0.087c1.642-0.063 3.449-0.175 4.317-0.407 0.873-0.247 1.581-0.77 2.063-1.45 0.27-0.381 0.47-0.811 0.587-1.267 0.006-0.025 0.012-0.050 0.015-0.071 0.34-1.884 0.496-3.765 0.476-5.44 0.012-1.925-0.161-3.833-0.477-5.504-0.004-0.020-0.008-0.040-0.012-0.057zM10.75 13.301v-3.102l2.727 1.551zM10.244 15.889l5.75-3.27c0.48-0.273 0.648-0.884 0.375-1.364-0.093-0.164-0.226-0.292-0.375-0.375l-5.75-3.27c-0.48-0.273-1.091-0.105-1.364 0.375-0.090 0.158-0.132 0.33-0.131 0.494v6.54c0 0.552 0.448 1 1 1 0.182 0 0.352-0.049 0.494-0.131z"></path></svg>
                                <div class = "community_write_bottom_left_item_title">
                                    ` + getLanguage("community_write_button_add_youtube_video") + `
                                </div>
                            </div>
                        </div>
                        <div class = "community_write_bottom_left_delete md-ripples" onclick = "deleteOptionCommunityWrite(this);">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 28"><path d="M8 21.5v-11c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v11c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM12 21.5v-11c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v11c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM16 21.5v-11c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v11c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM7.5 6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094 0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5 0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375 0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391 2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094 2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z"></path></svg>
                            ` + getLanguage("community_write_button_option_delete") + `
                        </div>
                    </div>
                    <div class = "community_write_bottom_right">
                        <div class = "community_write_bottom_right_cancel md-ripples" onclick = "communityWriteCancel(this);" onmouseenter = "hoverInformation(this, getLanguage('community_write_button_cancel'));">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M9 1c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM3 9c0-1.294 0.416-2.491 1.116-3.472l8.356 8.356c-0.981 0.7-2.178 1.116-3.472 1.116-3.309 0-6-2.691-6-6zM13.884 12.472l-8.356-8.356c0.981-0.7 2.178-1.116 3.472-1.116 3.309 0 6 2.691 6 6 0 1.294-0.416 2.491-1.116 3.472z"></path></svg>
                        </div>
                        <div class = "community_write_bottom_right_submit md-ripples" onclick = "submitButtonCommunityWrite(this);" onmouseenter = "hoverInformation(this, getLanguage('community_write_button_submit'));">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.016 21v-6.984l15-2.016-15-2.016v-6.984l21 9z"></path></svg>
                        </div>
                    </div>
                </div>
                <input type = "file" onchange = "requestCommunityImageUpload(this, this.files[0]);" accept = "image/png, image/jpeg, image/webp, image/gif" style="display: none;">
            </div>
            <!-- 로딩 스피너 -->
            <div class = "community_write_loading_box">
                <div class="showbox">
                    <div class="loader" style="width: 35px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle></svg></div>
                </div>
            </div>
        `;

        el.appendChild(newEl);
    }
}

function communityWriteActivate(el) {
    let parent = el.parentElement.parentElement;
    parent.classList.add("community_write_activate");

    let textbox = parent.getElementsByClassName("community_write_right_textbox")[0];
    textbox.focus();
}
function communityWriteFocus(el) {
    let parent = el.parentElement.parentElement;
    parent.classList.add("community_write_focus");
}
function communityWriteBlur(el) {
    let parent = el.parentElement.parentElement;
    parent.classList.remove("community_write_focus");
}
function communityWriteCancel(el) {
    let parent = el.parentElement.parentElement.parentElement.parentElement;
    let height = (parent.clientHeight + 2);

    //
    parent.classList.remove("community_write_activate");
    parent.classList.remove("community_write_option");
    let textbox = parent.getElementsByClassName("community_write_right_textbox")[0];
    textbox.textContent = '';
    let option = parent.getElementsByClassName("community_write_right_option")[0];
    option.setAttribute("type", "none");
    option.textContent = '';

    let currentHeight = (parent.clientHeight + 2);
    if (height != currentHeight) {
        parent.style.height = height + "px";
        function callback() {
            parent.style.height = currentHeight + "px";
            setTimeout(() => {
                parent.style.height = null;
            }, 200);
        }
        window.requestAnimationFrame(callback);
    }

    let submit = parent.getElementsByClassName('community_write_bottom_right_submit')[0];
    submit.classList.remove('community_write_bottom_right_submit_activate');
}
function checkCommunityInput(el) {
    setTimeout(() => {
        let parent = el.parentElement;
        let submit = parent.getElementsByClassName('community_write_bottom_right_submit')[0];
        if (el.innerText.trim() == "") {
            submit.classList.remove('community_write_bottom_right_submit_activate');
        } else {
            submit.classList.add('community_write_bottom_right_submit_activate');
        }
    }, 1);
}

/*
    type:
        0 - 이미지 추가
        1 - 유튜브 동영상 추가
*/
function communityWriteOptionButton(el, type) {
    let parent = el.parentElement.parentElement.parentElement.parentElement.parentElement;
    if (type == 0) {
        let input = parent.getElementsByTagName("input")[0];
        input.click();
    } else if (type == 1) {
        openPopupContents('community_add_youtube_video');
    }
}
function deleteOptionCommunityWrite(el, parent) {
    if (parent == null) {
        parent = el.parentElement.parentElement.parentElement.parentElement;
    }
    let height = (parent.clientHeight + 2);
    parent.classList.remove("community_write_option");

    let option = parent.getElementsByClassName("community_write_right_option")[0];
    option.setAttribute("type", "none");
    option.textContent = '';

    let currentHeight = (parent.clientHeight + 2);
    parent.style.height = height + "px";
    function callback() {
        parent.style.height = currentHeight + "px";
        setTimeout(() => {
            parent.style.height = null;
        }, 200);
    }
    window.requestAnimationFrame(callback);
}

function communityWriteOptionAddImage(el, imageInfo) {
    let parent = el.parentElement.parentElement;

    let height = null;
    if (el.innerHTML == '') {
        height = (parent.clientHeight + 2);

        el.innerHTML = `
            <div class = "community_write_right_option_add_image">
                <div class = "community_write_right_option_add_image_items">
                    <!-- item -->
                </div>
            </div>
        `;
        parent.classList.add("community_write_option");
        el.setAttribute("type", 0);
    }

    let items = el.getElementsByClassName("community_write_right_option_add_image_items")[0];
    //Upload 버튼 삭제
    let upload = items.getElementsByClassName("community_write_right_option_add_image_upload");
    if (upload.length != 0) {
        upload[0].remove();
    }

    let newEl = document.createElement("div");
    newEl.innerHTML = `
        <div class = "community_write_right_option_add_image_item md-ripples img_wrap" oncontextmenu = "communityWriteOptionAddImageItemMoreButton(this, event);" onclick = "communityWriteOptionAddImageItemMoreButton(this, event);">
            <img src = "` + imageInfo["url"] + `" width = "` + imageInfo["width"] + `" height = "` + imageInfo["height"] + `" onload = "imageLoad(event);">
        </div>
    `;
    let item = items.appendChild(newEl);
    let itemWidth = item.clientWidth;
    item.style.width = "0px";
    item.style.marginRight = "-10px";
    function callback() {
        item.style.transition = "all 0.2s";
        item.style.width = itemWidth + "px";
        item.style.marginRight = null;
        item.style.animation = "showCommunityWriteRightOptionAddImageItem 0.2s forwards";
        setTimeout(() => {
            item.style.animation = null;
            item.style.transition = null;
            item.style.width = null;
        }, 200);
    }
    window.requestAnimationFrame(callback);

    //Upload 버튼 생성
    newEl = document.createElement("div");
    newEl.classList.add("community_write_right_option_add_image_upload");
    newEl.classList.add("md-ripples");
    newEl.setAttribute("onclick", "communityWriteOptionAddImageMoreUpload(this);");
    newEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="a"><rect width="50" height="50"></rect></clipPath></defs><g id="b" clip-path="url(#a)"><g clip-path="url(#a)"><rect width="3" height="25" rx="1.5" transform="translate(0 25)"></rect><rect width="3" height="25" rx="1.5" transform="translate(47 25)"></rect><rect width="50" height="3" rx="1.5" transform="translate(0 47)"></rect><rect width="3" height="34" rx="1.5" transform="translate(27 35.5) rotate(180)"></rect><rect width="3" height="17.526" rx="1.5" transform="translate(37.928 12.393) rotate(135)"></rect><rect width="3" height="17" rx="1.5" transform="translate(15.193 14.142) rotate(-135)"></rect></g></g></svg>
    `;
    items.appendChild(newEl);

    //
    if (height != null) {
        let currentHeight = (parent.clientHeight + 2);
        parent.style.height = height + "px";
        function callback2() {
            parent.style.height = currentHeight + "px";
            setTimeout(() => {
                parent.style.height = null;
            }, 200);
        }
        window.requestAnimationFrame(callback2);
    }
}
function communityWriteOptionAddImageMoreUpload(el) {
    let parent = el.parentElement.parentElement.parentElement.parentElement;
    let input = parent.getElementsByTagName("input")[0];
    input.click();
}
let previousClickElementAddImageItemMoreButton = null;
function communityWriteOptionAddImageItemMoreButton(el, event) {
    previousClickElementAddImageItemMoreButton = el;

    let slot = new Array();
    slot[0] = {
        'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 28"><path d="M8 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM12 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM16 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM18 22.813v-14.812h-14v14.812c0 0.75 0.422 1.188 0.5 1.188h13c0.078 0 0.5-0.438 0.5-1.188zM7.5 6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094 0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5 0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375 0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391 2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094 2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z"></path></svg>',
        'title': getLanguage("delete"),
        'onclick': 'deleteItemCommunityWriteOptionAddImage();',
        'class': 'more_button_item_delete',
    };
    moreButton(null, slot, event);
}
function deleteItemCommunityWriteOptionAddImage() {
    let item = previousClickElementAddImageItemMoreButton.parentElement;

    let width = item.clientWidth;
    item.style.width = width + "px";
    function callback() {
        item.style.transition = "all 0.2s";
        item.style.width = "0px";
        item.style.marginRight = "-10px";
        item.style.animation = "hideCommunityWriteRightOptionAddImageItem 0.2s forwards";
        setTimeout(() => {
            item.remove();
        }, 200);
    }
    window.requestAnimationFrame(callback);

    let itemCount = item.parentElement.getElementsByClassName("community_write_right_option_add_image_item").length;
    if (itemCount <= 1) {
        let parent = item.parentElement.parentElement.parentElement.parentElement.parentElement;
        deleteOptionCommunityWrite(null, parent);
    }
}

















var previousCommunityImageInfo = new Array();

function requestCommunityImageUpload(input, file) {
    let parent = input.parentElement.parentElement;
    let option = parent.getElementsByClassName("community_write_right_option")[0];

    if (previousCommunityImageInfo[file.name + "," + file.size + "," + file.type + "," + file.lastModified] != null) {
        communityWriteOptionAddImage(option, previousCommunityImageInfo[file.name + "," + file.size + "," + file.type + "," + file.lastModified]);
        input.value = "";
        return;
    }

    spinLoading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "https://img.louibooks.com/upload.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let json = JSON.parse(xhrHtml);

                communityWriteOptionAddImage(option, json);
                
                //이미지 정보 저장
                previousCommunityImageInfo[file.name + "," + file.size + "," + file.type + "," + file.lastModified] = json;
            } else {
                if (status == 504) {
                    //시간 초과
                    serverResponseErrorMessage(0);
                } else {
                    //오류 발생
                    serverResponseErrorMessage(1);
                }
            }
            spinLoadingComplete();
        }
    });
    
    var formData = new FormData();
    formData.append("imgFile", file);
    formData.append("type", "community");

    xhr.send(formData);

    input.value = "";
}



















function communityWriteOptionAddYouTubeVideo(el, videoId) {
    let height = el.clientHeight;

    let option = el.getElementsByClassName("community_write_right_option")[0];
    option.setAttribute("type", 1);
    el.classList.add("community_write_option");

    //
    option.innerHTML = `
        <div class = "community_write_right_option_add_youtube_video" video_id = "` + videoId + `">
            <iframe src = "https://www.youtube.com/embed/` + videoId + `" frameborder = "0" allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    `;

    //
    let currentHeight = (el.clientHeight + 2);
    el.style.height = height + "px";
    function callback2() {
        el.style.height = currentHeight + "px";
        setTimeout(() => {
            el.style.height = null;
        }, 200);
    }
    window.requestAnimationFrame(callback2);
}









function getInfoCommunityWrite(el) {
    let textbox = el.getElementsByClassName("community_write_right_textbox")[0];
    let option = el.getElementsByClassName("community_write_right_option")[0];

    let data = {
        'texts': textbox.innerText.replaceAll('\n\n','\n').trim(),
    }
    //옵션
    let optionType = option.getAttribute("type");
    if (optionType != "none") {
        if (optionType == 0) {
            let optionData = {
                'type': 0,
                'items': new Array(),
            };
            let items = el.getElementsByClassName("community_write_right_option_add_image_items")[0];
            let img = items.getElementsByTagName("img");
            for (let i = 0; i < img.length; i++) {
                optionData["items"][i] = {
                    'url': img[i].src,
                    'width': Number.parseInt(img[i].getAttribute("width")),
                    'height': Number.parseInt(img[i].getAttribute("height"))
                }
            }
            data['option'] = optionData;
        } else if (optionType == 1) {
            let add_youtube_video = el.getElementsByClassName("community_write_right_option_add_youtube_video")[0];
            data['option'] = {
                'type': 1,
                'videoId': add_youtube_video.getAttribute("video_id")
            };
        }
    }

    return data;
}

function communityWriteLoading(el) {
    let left = el.getElementsByClassName("community_write_left")[0];
    let right = el.getElementsByClassName("community_write_right")[0];
    left.style.opacity = "0.5";
    right.style.opacity = "0.5";

    let loading_box = el.getElementsByClassName("community_write_loading_box")[0];
    loading_box.style.display = "flex";
    loading_box.style.width = (el.clientWidth + "px");
    loading_box.style.height = (el.clientHeight + "px");
}
function communityWriteLoadingComplete(el) {
    let left = el.getElementsByClassName("community_write_left")[0];
    let right = el.getElementsByClassName("community_write_right")[0];
    left.style.opacity = null;
    right.style.opacity = null;

    let loading_box = el.getElementsByClassName("community_write_loading_box")[0];
    loading_box.style.display = null;
    loading_box.style.width = null;
    loading_box.style.height = null;

    let cancel = el.getElementsByClassName("community_write_bottom_right_cancel")[0];
    cancel.click();
}

function submitButtonCommunityWrite(el) {
    let parent = el.parentElement.parentElement.parentElement.parentElement;
    communityWriteLoading(parent);

    let info = getCommunityInfo(parent);
    let content = JSON.stringify(getInfoCommunityWrite(parent));

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/community/upload.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;

                if (xhrHtml.trim() == "no_community_permission") {
                    //커뮤니티 자격 없음
                    actionMessage(getLanguage("no_community_permission_message"));
                } else if (xhrHtml.trim() == "no_permission") {
                    //권한 없음
                    actionMessage(getLanguage("no_permission"));
                } else {
                    let communityInfo = JSON.parse(xhrHtml);

                    let items = info["element"].getElementsByClassName("community_items")[0];
                    setTimeout(() => {
                        createCommunityItem(items, communityInfo, true, 'top');
                    }, 200);

                    actionMessage(getLanguage("community_upload_message"));
                }
            } else {
                if (status == 504) {
                    //시간 초과
                    serverResponseErrorMessage(0);
                } else {
                    //오류 발생
                    serverResponseErrorMessage(1);
                }
            }
            communityWriteLoadingComplete(parent);
        }
    });
    
    var formData = new FormData();
    formData.append("uid", info["uid"]);
    formData.append("content", content);

    xhr.send(formData);
}








































function communityLikesButton(el, communityNumber) {
    let parent = el.parentElement;

    if (el.children[0].style.display == "flex") {
        communityLikesDislike(parent, communityNumber, "likes");
    } else if (el.children[0].style.display == "none") {
        communityLikesDislike(parent, communityNumber, null);
    }
}
function communityDislikeButton(el, communityNumber) {
    let parent = el.parentElement;

    if (el.children[0].style.display == "flex") {
        communityLikesDislike(parent, communityNumber, "dislike");
    } else if (el.children[0].style.display == "none") {
        communityLikesDislike(parent, communityNumber, null);
    }
}
function communityLikesDislike(el, communityNumber, type) {
    let item = el.getElementsByClassName("community_item_bottom_item");
    let likes = item[0];
    let dislike = item[1];

    if (type == "likes") {
        likes.children[0].style.display = "none";
        likes.children[1].style.display = "flex";
        dislike.children[0].style.display = "flex";
        dislike.children[1].style.display = "none";

        actionMessage(getLanguage("liked_message"));
    } else if (type == "dislike") {
        likes.children[0].style.display = "flex";
        likes.children[1].style.display = "none";
        dislike.children[0].style.display = "none";
        dislike.children[1].style.display = "flex";

        actionMessage(getLanguage("disliked_message"));
    } else {
        likes.children[0].style.display = "flex";
        likes.children[1].style.display = "none";
        dislike.children[0].style.display = "flex";
        dislike.children[1].style.display = "none";
    }

    requestCommunityLikesDislike(communityNumber, type);
}
function requestCommunityLikesDislike(communityNumber, type) {
    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/community/likesDislike.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if ((status === 0 || (status >= 200 && status < 400)) == false) {
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
    formData.append("communityNumber", communityNumber);
    formData.append("type", type);

    xhr.send(formData);
}






















































//무한 스크롤
function checkCommunityMoreLoad() {
    let menuNumber = getCurrentMenuNumber();
    let contents = document.getElementById("contents_" + menuNumber);

    if (contents != null) {
        let moreLoad = contents.getElementsByClassName("community_more_load");
        for (let i = 0; i < moreLoad.length; i++) {
            let isLoading = moreLoad[i].getAttribute("loading");
            if (isLoading == 'false' && moreLoad[i].style.display != "none") {
                let communityInfo = getCommunityInfo(moreLoad[i]);

                let isPossible = isPossibleCommunityMoreLoad(communityInfo);
                if (isPossible == true) {
                    let communityNumbers = communityInfo["communityNumbers"];

                    let numbers = communityNumbers;
                    let numbersMaxCount = (numbers.length >= 20) ? 20 : numbers.length;
                    numbers = numbers.splice(0, numbersMaxCount);

                    requestCommunityMore(communityInfo, numbers);
                    moreLoad[i].setAttribute("loading", true);
                }
            }
        }
    }
}
addEventListener('scroll', checkCommunityMoreLoad);
addEventListener('focus', checkCommunityMoreLoad);
addEventListener('resize', checkCommunityMoreLoad);

function isPossibleCommunityMoreLoad(communityInfo) {
    //여백 구하기
    let padding = 0;
    let boxSize = 75 + padding;

    let scrollPercent = ((document.documentElement.scrollTop + window.innerHeight) / (document.documentElement.scrollHeight - boxSize)) * 100;
    if (scrollPercent >= 100) {
        return true;
    } else {
        return false;
    }
}

function requestCommunityMore(communityInfo, numbers) {
    let el = communityInfo["element"];
    let items = el.getElementsByClassName("community_items")[0];
    let communityNumbers = communityInfo["communityNumbers"];
    let moreLoad = el.getElementsByClassName("community_more_load")[0];

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/community/getInfo.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                if (info.length != 0) {
                    for (let i = 0; i < info.length; i++) {
                        createCommunityItem(items, info[i]);
                    }
                }
                for (let i = 0; i < numbers.length; i++) {
                    communityNumbers = communityNumbers.remove("" + numbers[i]);
                }

                moreLoad.setAttribute("loading", false);
                if (communityNumbers.length != 0) {
                    el.setAttribute("community_numbers", communityNumbers.join(","));
                } else {
                    moreLoad.style.display = "none";
                }
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
    formData.append("numbers", numbers.join(","));

    xhr.send(formData);
}





























































function loadCommunity(communityInfo) {
    let el = communityInfo["element"];
    let items = el.getElementsByClassName("community_items")[0];
    let top = el.getElementsByClassName("community_box_top")[0];

    let uid = communityInfo["uid"];
    let sort = top.getElementsByClassName("community_box_top_sort")[0].getAttribute("value");

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/community/getInfoNumbers.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                let communityCount = 0;
                if (info["numbers"] != null && info["numbers"] != '') {
                    communityCount = info["numbers"].split(",").length;
                }
            
                let top_left = top.getElementsByClassName("community_box_top_left")[0];
                top_left.getElementsByClassName("community_box_top_left_text")[0].innerHTML = getLanguage("community_count").replaceAll("{R:0}", communityCount);

                //
                items.innerHTML = '';

                let communityNumbers = info["numbers"].split(",");
                if (info["info"] != null) {
                    for (let i = 0; i < info["info"].length; i++) {
                        createCommunityItem(items, info["info"][i]);
                        communityNumbers = communityNumbers.remove("" + info["info"][i]["number"]);
                    }
                } else {
                    showCommunityNoData(communityInfo["uniqueNumber"]);
                }
                el.setAttribute("community_numbers", communityNumbers.join(","));

                let moreLoad = el.getElementsByClassName("community_more_load")[0];
                moreLoad.setAttribute("loading", false);
                if (communityNumbers[0] == null || communityNumbers[0] == undefined || communityNumbers[0] == '') {
                    moreLoad.style.display = "none";
                } else {
                    moreLoad.style.display = null;
                }
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
    formData.append("uid", uid);
    formData.append("sort", sort);

    xhr.send(formData);
}
































































var elementMoreButtonCommunityItem = null;

function moreButtonCommunityItem(el, communityNumber, isWriter) {
    let slot = new Array();
    if (isWriter == true) {
        slot[0] = {
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 28"><path d="M8 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM12 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM16 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM18 22.813v-14.812h-14v14.812c0 0.75 0.422 1.188 0.5 1.188h13c0.078 0 0.5-0.438 0.5-1.188zM7.5 6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094 0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5 0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375 0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391 2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094 2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z"></path></svg>',
            'title': getLanguage("delete"),
            'onclick': 'deleteCommunityItemButton(' + communityNumber + ');',
            'class': 'more_button_item_delete',
        };
    } else {
        let item = null;
        let contents = document.getElementById("contents_" + getCurrentMenuNumber());
        let communityItem = contents.getElementsByClassName("community_item");
        for (let i = 0; i < communityItem.length; i++) {
            if (communityItem[i].getAttribute("community_number") == communityNumber) {
                item = communityItem[i];
                break;
            }
        }
        if (item == null) {
            item = contents.getElementsByClassName("menu_community_main")[0];
        }

        let profile = JSON.parse(item.getElementsByClassName("community_item_left")[0].getElementsByClassName("profile_info")[0].innerHTML);
        let nickname = item.getElementsByClassName("community_item_right_top_nickname")[0].innerHTML.trim();
        let userInfo = {
            "profile": profile,
            "nickname": nickname
        }
        let userReport = {
            "type": 2,
            "uniqueNumber": communityNumber,
            "userInfo": userInfo
        };
        slot[0] = {
            'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5" transform="translate(9)"/><path d="M13.422,25.422s6.941-3.318,12.163-3.086,17.81,4.641,17.81,4.641V9.456S27.963,4,24.656,3.945s-9.456,2.9-9.456,2.9L13.422,4.235S18.913.754,24.25,1.1,43.395,6.15,43.395,6.15h3.249V30.806L25.584,25.422S18.391,25.816,15.2,27.9Z" transform="translate(-0.449)"/></g></svg>',
            'title': getLanguage("sidebar_admin_user_report"),
            'onclick': '(loginStatus[\'isLogin\'] == true) ? openPopupContents(\'user_report\', null, \'' + JSON.stringify(userReport).replaceAll("\"", "\\&quot;").replaceAll("'", "\\\'") + '\') : loadMenu_login();'
        };
    }
    moreButton(el, slot);

    elementMoreButtonCommunityItem = null;
    el = el.parentElement.parentElement.parentElement;
    if (el.classList.contains("visible_element")) {
        elementMoreButtonCommunityItem = el;
    }
}
function deleteCommunityItemButton(communityNumber) {
    confirmPopup(getLanguage("confirm_popup_title:delete"), getLanguage("confirm_popup_subject:delete"), 'deleteCommunityItem(' + communityNumber + ');');
}

function deleteCommunityItem(communityNumber) {
    let contents = document.getElementById("contents_" + getCurrentMenuNumber());
    let menuNumber = getCurrentMenuNumber();

    //-- -- -- -- -- 화면에서 보이지 않아도 해당 앨리먼트는 삭제하지 않는다 -- -- -- -- --
    let allowInfo = null;
    if (elementMoreButtonCommunityItem != null) {
        allowInfo = registerAllowVisibleElement(elementMoreButtonCommunityItem);
    }

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/community/delete.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                
                if (xhrHtml == "not you") {
                    actionMessage(getLanguage("no_permission"));
                } else {
                    let items = contents.getElementsByClassName("community_items")[0];
                    let item = contents.getElementsByClassName("community_item");
                    let communityInfo = getCommunityInfo(items);
                    for (let i = 0; i < item.length; i++) {
                        if (item[i].getAttribute("community_number") == communityNumber) {
                            let height = item[i].clientHeight;
                            item[i].style.maxHeight = height + "px";
                            item[i].style.transition = "max-height 0.2s, margin-bottom 0.2s, margin-top 0.2s";
                            item[i].style.animation = "deleteCommunityItem 0.2s forwards";
    
                            function callback() {
                                item[i].style.maxHeight = "0px";
                                item[i].style.marginBottom = "0px";
                                item[i].style.marginTop = "0px";
                                setTimeout(() => {
                                    item[i].remove();

                                    if (items.innerHTML.trim() == "" && (communityInfo["communityNumbers"] == '' || communityInfo["communityNumbers"] == undefined || communityInfo["communityNumbers"] == null)) {
                                        showCommunityNoData(communityInfo["uniqueNumber"]);
                                    }
                                }, 200);
                            }
                            window.requestAnimationFrame(callback);
                            break;
                        }
                    }
                    actionMessage(getLanguage("community_delete_message"));
                }
            } else {
                if (status == 504) {
                    //시간 초과
                    serverResponseErrorMessage(0);
                } else {
                    //오류 발생
                    serverResponseErrorMessage(1);
                }
            }

            //-- -- -- -- -- 화면에서 보이지 않아도 삭제되지 않는다를 취소한다 -- -- -- -- --
            if (allowInfo != null) {
                deleteAllowVisibleElement(allowInfo["index"]);
            } else {
                let menu_community = contents.getElementsByClassName("menu_community");
                if (menu_community.length != 0) {
                    deleteMenu(menuNumber);
                }
            }

            loadingComplete();
        }
    });
    
    var formData = new FormData();
    formData.append("communityNumber", communityNumber);

    xhr.send(formData);
}




















































function getCommunityInfo(el) {
    let parent = el;
    while (true) {
        parent = parent.parentElement;
        if (parent != null) {
            let unique_number = parent.getAttribute("unique_number");
            let uid = parent.getAttribute("uid");
            let communityNumbers = null;
            if (parent.getAttribute("community_numbers") != null) {
                communityNumbers = parent.getAttribute("community_numbers").split(",");
            }
            let originatorNumber = null;
            if (parent.getAttribute("originator_number") != null) {
                originatorNumber = Number.parseInt(parent.getAttribute("originator_number"));
            }
            if (unique_number != null && uid != null) {
                return {
                    'element': parent,
                    'uniqueNumber': unique_number,
                    'uid': uid,
                    'communityNumbers': communityNumbers,
                    'originatorNumber': originatorNumber,
                };
            }
        } else {
            break;
        }
    }
}










function getCommunitySortItems() {
    let items = new Array();
    items[0] = {
        "title": getLanguage("community_sort:0"),
        "value": 0
    }
    items[1] = {
        "title": getLanguage("community_sort:1"),
        "value": 1
    }
    items[2] = {
        "title": getLanguage("community_sort:2"),
        "value": 2
    }
    items[3] = {
        "title": getLanguage("community_sort:3"),
        "value": 3
    }
    return items;
}