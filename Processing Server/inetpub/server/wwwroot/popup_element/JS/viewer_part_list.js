



function viewerPartListButton(menuNumber, el) {
    viewerPartList(menuNumber, el, 'bottom');
}

function viewerPartList(menuNumber, el, direction) {
    popupElement(el, direction, getHtmlViewerPartList(menuNumber));
    checkPartViewed();
    checkPercentPartViewed();

    //스크롤 위치
    function callback() {
        let popup_element_box = document.getElementsByClassName("popup_element_box")[0];
        let watching = popup_element_box.getElementsByClassName("viewer_part_list_item_watching");
        if (watching.length != 0) {
            setPopupElementScrollYElement(watching[0]);
        }
    }
    window.requestAnimationFrame(callback);
}

function getHtmlViewerPartList(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let partListInfo = JSON.parse(contents.getElementsByClassName("part_list_info")[0].innerHTML);
    let partInfo = JSON.parse(contents.getElementsByClassName("part_info")[0].innerHTML);

    let html = '';
    let itemsHtml = '';
    for (let i = 0; i < partListInfo.length; i++) {
        itemsHtml += getHtmlViewerPartListItem(partListInfo[i], partInfo["number"]);
    }

    html = `
        <div class = "viewer_part_list">
            <div class = "viewer_part_list_items">
                ` + itemsHtml + `
            </div>
        </div>
    `;

    return html;
}

function getHtmlViewerPartListItem(info, currentNumber) {
    let html = '';

    let category = '...';
    if (info["category"] == "episode") {
        let episode = info["episode"];
        category = getLanguage("work_part_category:episode_count").replaceAll("{R:0}", episode);
    } else {
        category = getLanguage("work_part_category:" + info["category"]);
    }

    let addClass = '';
    let onclick = 'loadMenu_viewer(' + info["number"] + ', \'' + info["type"] + '\', true); hidePopupElement();';
    if (info["number"] == currentNumber) {
        addClass += " viewer_part_list_item_watching";
        onclick = 'window.scrollTo({behavior: \'smooth\', left: 0, top: 0 }); hidePopupElement();'
    }
    if (info["isViewed"] == true) {
        addClass += " menu_work_part_list_item_viewed";
    }
    if (info["reward"] == true) {
        addClass += " menu_work_part_list_item_reward";
    }

    let percentViewed = 0;
    let percentViewedAddClass = "";
    if (info["percent_viewed"] != null) {
        percentViewed = info["percent_viewed"] * 100;
        percentViewedAddClass = " show_part_list_item_left_viewed_percent";
    }

    let reward = "";
    if (info["reward"] == true) {
        reward = `
            <div class = "menu_work_part_list_item_right_reward">
                ` + getLanguage("part_list_reward") + `
            </div>
        `;
    }

    let rewardAvailable = false;
    if (info["reward_available"] != null) {
        rewardAvailable = info["reward_available"];
    }

    html = `
        <div class = "menu_work_part_list_item visible_element md-ripples` + addClass + `" type = "` + info["type"] + `" part_number = "` + info["number"] + `" onclick = "` + onclick + `" oncontextmenu = "moreButtonPartList(` + info["number"] + `, this, event);">
            <div class = "menu_work_part_list_item_left_viewed_percent` + percentViewedAddClass + `">
                <div class = "menu_work_part_list_item_left_viewed_percent_line">
                    <div class = "menu_work_part_list_item_left_viewed_percent_fill" style = "width: ` + percentViewed + `%;"></div>
                </div>
            </div>
            <div class = "viewer_part_list_item_left_watching">
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
            </div>
            <div class = "menu_work_part_list_item_left img_wrap">
                <img src = "` + info["thumbnail_image"] + `" onload = "imageLoad(event);">
            </div>
            <div class = "menu_work_part_list_item_right">
                <div class = "menu_work_part_list_item_right_category">
                    ` + category + `
                </div>
                <div class = "menu_work_part_list_item_right_title">
                    ` + info["title"] + `
                </div>
                <div class = "menu_work_part_list_item_right_info">
                    <div class = "menu_work_part_list_item_right_info_item">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,50A25.007,25.007,0,0,1,15.269,1.965,25.007,25.007,0,0,1,34.731,48.036,24.843,24.843,0,0,1,25,50ZM25,3A22,22,0,1,0,47,25,22.025,22.025,0,0,0,25,3Z"/><g transform="translate(0 1)"><rect width="3" height="21" rx="1.5" transform="translate(23 6)"/><rect width="3" height="21" rx="1.5" transform="translate(44 24) rotate(90)"/></g></g></svg>
                        <span>` + getTimePast(new Date(info["upload_date"])) + `</span>
                    </div>
                    <div class = "menu_work_part_list_item_right_info_item">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M40.707,46.427h0a3.976,3.976,0,0,1-2.333-1.044c-3.13-2.487-11.917-9.316-12-9.383H5a5.006,5.006,0,0,1-5-5V5A5.006,5.006,0,0,1,5,0H45a5.006,5.006,0,0,1,5,5V31a5.005,5.005,0,0,1-5,5H42.466v9.106A2,2,0,0,1,40.707,46.427ZM4.906,3A1.985,1.985,0,0,0,3.016,4.9L2.984,31.027c0,.019.129,1.891,1.859,1.953H27.391l12.078,9.453V32.98h5.688A2.03,2.03,0,0,0,47,31l-.015-26.25c0-.017-.282-1.672-1.8-1.718Z" transform="translate(0 1.786)"></path></g></svg>
                        <span>` + getNumberUnit(info["comments_count"]) + `</span>
                    </div>
                    <div class = "menu_work_part_list_item_right_info_item">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,37a21.437,21.437,0,0,1-9.731-2.508,34.262,34.262,0,0,1-7.947-5.721A39.4,39.4,0,0,1,1.965,22.54,10.312,10.312,0,0,1,0,18.5a10.313,10.313,0,0,1,1.965-4.04A39.4,39.4,0,0,1,7.323,8.229a34.261,34.261,0,0,1,7.947-5.721A21.437,21.437,0,0,1,25,0a21.236,21.236,0,0,1,9.728,2.538A34.517,34.517,0,0,1,42.67,8.311a40.627,40.627,0,0,1,5.357,6.242A10.518,10.518,0,0,1,50,18.5c.01,1.175-2.446,5.3-6.467,9.358a35.762,35.762,0,0,1-8.228,6.3A21.562,21.562,0,0,1,25,37ZM25,2.964C13.381,2.964,3.264,16.237,3.264,18.5S13.381,34.036,25,34.036c7.276,0,13.532-5.214,16.613-8.322,3.016-3.042,5.109-6.244,5.1-7.214-.009-1.079-2.552-4.948-6.516-8.557C36.7,6.759,31.227,2.964,25,2.964Z" transform="translate(0 7)"></path><path d="M9.5,19A9.5,9.5,0,0,1,2.783,2.783,9.5,9.5,0,0,1,16.217,16.217,9.437,9.437,0,0,1,9.5,19Zm0-16.026A6.526,6.526,0,1,0,16.026,9.5,6.534,6.534,0,0,0,9.5,2.974Z" transform="translate(16 16)"></path></g></svg>
                        <span>` + getNumberUnit(info["views"]) + `</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    return html;
}