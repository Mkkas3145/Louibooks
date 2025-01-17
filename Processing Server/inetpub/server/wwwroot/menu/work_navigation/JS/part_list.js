

var workNavigationPartListNumbers = new Array();

function loadWorkNavigationPartList(menuNumber, first) {
    (first == null) ? first = true : null;

    let contents = document.getElementById("contents_" + menuNumber);
    let part_list = contents.getElementsByClassName("menu_work_part_list")[0];
    part_list.innerHTML = '';

    let numbers = contents.getElementsByClassName("part_list_numbers")[0].innerHTML.trim();
    let partInfo = JSON.parse(contents.getElementsByClassName("part_list_info")[0].innerHTML);
    let chapterInfo = JSON.parse(contents.getElementsByClassName("part_list_chapter_info")[0].innerHTML);

    workNavigationPartListNumbers[menuNumber] = numbers.split(",");

    if (partInfo != null) {
        for (let i = 0; i < partInfo.length; i++) {
            let html = getHtmlWorkNavigationPartListItem(menuNumber, partInfo[i]);
            addContentWorkNavigationPartListItem(menuNumber, partInfo[i]["chapter"], html);
    
            let array = workNavigationPartListNumbers[menuNumber];
            array = array.remove("" + partInfo[i]["number"]);
            workNavigationPartListNumbers[menuNumber] = array;
        }
        checkWorkNavigationPartListMoreLoading(menuNumber);
    } else {
        part_list.innerHTML = `
            <div class = "workspace_work_part_list_no_data">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-3094.635,49.5H-3116.5a3,3,0,0,1-3-3V3.5a3,3,0,0,1,3-3h31a3,3,0,0,1,3,3V37.365L-3094.635,49.5Z" transform="translate(3126)" opacity="0.7"/><path d="M3151.333,49.5l12.293-12.293h-9.846a2.517,2.517,0,0,0-1.983.575,2.884,2.884,0,0,0-.464,2.039Z" transform="translate(-3120)" opacity="0.6"/></g></svg>
                <div class = "workspace_work_part_list_no_data_title">
                    ` + getLanguage("work_part_list_no_data_2") + `
                </div>
                <div class = "workspace_work_part_list_no_data_description">
                    ` + getLanguage("no_data_description") + `
                </div>
            </div>
        `;
        hideWorkNavigationPartListMoreLoading(menuNumber);
    }

    //
    if (first == true) {
        let sort = contents.getElementsByClassName("sort_box");
        sort[0].getElementsByClassName("value_title")[0].innerHTML = getLanguage("workspace_work_part_list_select_sort:1");
        if (sort[1].getElementsByClassName("value_title")[0].innerHTML.trim() == 0) {
            sort[1].getElementsByClassName("value_title")[0].innerHTML = getLanguage("work_part_list_all_chapters");
        } else {
            let chapter = Number.parseInt(sort[1].getElementsByClassName("value_title")[0].innerHTML.trim());
            let chapterTitle = "";
            for (let i = 0; i < chapterInfo.length; i++) {
                if (chapterInfo[i]["chapter"] == chapter) {
                    chapterTitle = chapterInfo[i]["title"];
                }
            }

            sort[1].getElementsByClassName("value_title")[0].innerHTML = getLanguage("work_part_list_chapter").replaceAll("{R:0}", (chapter + ": " + chapterTitle));
        }
        let top_left = contents.getElementsByClassName("menu_work_part_list_top_left")[0];
        let top_right = contents.getElementsByClassName("menu_work_part_list_top_right")[0];
        top_left.innerHTML = getLanguage("work_navigation:part_list");
        top_right.style.width = "calc(100% - " + (top_left.clientWidth + 20) + "px)";
    }
}

function addChapterWorkNavigationPartList(menuNumber, chapter) {
    let contents = document.getElementById("contents_" + menuNumber);
    let part_list = contents.getElementsByClassName("menu_work_part_list")[0];
    let chapterInfo = JSON.parse(contents.getElementsByClassName("part_list_chapter_info")[0].innerHTML);

    //회차 앨리먼트가 이미 있는지
    let chapter_items = contents.getElementsByClassName("menu_work_part_list_items");
    for (let i = 0; i < chapter_items.length; i++) {
        if (chapter_items[i].getAttribute("chapter") == chapter) {
            return;
        }
    }

    let chapterTitle = "";
    for (let i = 0; i < chapterInfo.length; i++) {
        if (chapterInfo[i]["chapter"] == chapter) {
            chapterTitle = chapterInfo[i]["title"];
        }
    }

    let newEl = document.createElement("div");
    newEl.classList.add("menu_work_part_list_items");
    newEl.setAttribute("chapter", chapter);
    newEl.innerHTML = `
        <div class = "menu_work_part_list_item_chapter">
            ` + getLanguage("work_part_list_chapter").replaceAll("{R:0}", chapter) + `: <b>` + chapterTitle + `</b>
        </div>
        <div class = "menu_work_part_list_item_contents">
            <!-- 아이템 -->
        </div>
    `;
    part_list.appendChild(newEl);
}

function addContentWorkNavigationPartListItem(menuNumber, chapter, html) {
    let contents = document.getElementById("contents_" + menuNumber);

    addChapterWorkNavigationPartList(menuNumber, chapter);

    let chapter_contents = null;
    let chapter_items = contents.getElementsByClassName("menu_work_part_list_items");
    for (let i = 0; i < chapter_items.length; i++) {
        if (chapter_items[i].getAttribute("chapter") == chapter) {
            chapter_contents = chapter_items[i].getElementsByClassName("menu_work_part_list_item_contents")[0];
        }
    }

    let newEl = document.createElement("div");
    newEl.classList.add("visible_element");
    newEl.innerHTML = html;

    chapter_contents.appendChild(newEl);
}

function getHtmlWorkNavigationPartListItem(menuNumber, info) {
    let html = '';

    let category = '...';
    if (info["category"] == "episode") {
        let episode = info["episode"];
        category = getLanguage("work_part_category:episode_count").replaceAll("{R:0}", episode);
    } else {
        category = getLanguage("work_part_category:" + info["category"]);
    }

    let addClass = '';
    if (info["isViewed"] == true) {
        addClass += " menu_work_part_list_item_viewed";
    }

    let onclick = null;
    if (info["type"] != null) {
        onclick = `loadMenu_viewer(` + info["number"] + `, '` + info["type"] + `');`;
    }

    let percentViewed = 0;
    let percentViewedAddClass = "";
    if (info["percent_viewed"] != null) {
        percentViewed = info["percent_viewed"] * 100;
        percentViewedAddClass = " show_part_list_item_left_viewed_percent";
    }

    let videoInfo = "";
    if (info["video"] != null) {
        let status = '';
        if (info["video"]["status"] == 2) {
            status = `
                <div class = "menu_work_part_list_item_left_video_info_item">
                    <div class = "menu_work_part_list_item_left_video_info_item_left">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-4.438,42.27v0L.4,28.587,21.847,7.145a2.12,2.12,0,0,1,1.506-.632,1.945,1.945,0,0,1,1.387.567l7.071,7.071a1.944,1.944,0,0,1,.567,1.433,2.125,2.125,0,0,1-.632,1.459L10.3,38.487-4.436,42.27ZM23.387,9.839h0L3.162,30.064-.327,38.621l9.154-2.892L29.052,15.5,23.387,9.839Z" transform="translate(5.102 6.536)"></path><path d="M28.7,19.1a1.987,1.987,0,0,1-1.414-.586l-7.071-7.071a2,2,0,0,1,0-2.828l6.368-6.368a2,2,0,0,1,2.829,0l7.071,7.071a2,2,0,0,1,0,2.828L30.116,18.51A1.987,1.987,0,0,1,28.7,19.1ZM27.995,5.067h0l-4.95,4.95,5.666,5.665,4.95-4.949L27.995,5.067Z" transform="translate(12.102 -0.464)"></path></g></svg>
                    </div>
                    <div class = "menu_work_part_list_item_left_video_info_item_right">
                        ` + getLanguage("popup_upload_work_part_video_step_right_item_status:0") + `
                    </div>
                </div>
            `;
        }
        if (info["video"]["status"] == 1) {
            let resolution = (info["video"]["processingResolution"] + "p");
            let progress = info["video"]["processingProgress"];

            status = `
                <div class = "menu_work_part_list_item_left_video_info_item">
                    <div class = "menu_work_part_list_item_left_video_info_item_left">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-4.438,42.27v0L.4,28.587,21.847,7.145a2.12,2.12,0,0,1,1.506-.632,1.945,1.945,0,0,1,1.387.567l7.071,7.071a1.944,1.944,0,0,1,.567,1.433,2.125,2.125,0,0,1-.632,1.459L10.3,38.487-4.436,42.27ZM23.387,9.839h0L3.162,30.064-.327,38.621l9.154-2.892L29.052,15.5,23.387,9.839Z" transform="translate(5.102 6.536)"></path><path d="M28.7,19.1a1.987,1.987,0,0,1-1.414-.586l-7.071-7.071a2,2,0,0,1,0-2.828l6.368-6.368a2,2,0,0,1,2.829,0l7.071,7.071a2,2,0,0,1,0,2.828L30.116,18.51A1.987,1.987,0,0,1,28.7,19.1ZM27.995,5.067h0l-4.95,4.95,5.666,5.665,4.95-4.949L27.995,5.067Z" transform="translate(12.102 -0.464)"></path></g></svg>
                    </div>
                    <div class = "menu_work_part_list_item_left_video_info_item_right">
                        ` + getLanguage("popup_upload_work_part_video_step_right_item_status:1").replaceAll("{R:0}", resolution) + (" (" + progress + "%)") + `
                    </div>
                </div>
            `;
        }

        let duration = "";
        if (info["video"]["duration"] != null && status.trim() == "") {
            duration = `
                <div class = "menu_work_part_list_item_left_video_info_item">
                    <div class = "menu_work_part_list_item_left_video_info_item_left">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M2,0A1.828,1.828,0,0,1,4,1.583V11.87c0,.874-4,0-4,0V1.583A1.828,1.828,0,0,1,2,0Z" transform="translate(34.785 31.957) rotate(135)"/><path d="M-3095,50a24.844,24.844,0,0,1-9.731-1.965,24.917,24.917,0,0,1-7.947-5.358,24.922,24.922,0,0,1-5.358-7.947A24.845,24.845,0,0,1-3120,25a24.845,24.845,0,0,1,1.965-9.731,24.922,24.922,0,0,1,5.358-7.947,24.917,24.917,0,0,1,7.947-5.358A24.844,24.844,0,0,1-3095,0a24.844,24.844,0,0,1,9.731,1.965,24.917,24.917,0,0,1,7.947,5.358,24.922,24.922,0,0,1,5.358,7.947A24.84,24.84,0,0,1-3070,25a24.84,24.84,0,0,1-1.965,9.731,24.922,24.922,0,0,1-5.358,7.947,24.917,24.917,0,0,1-7.947,5.358A24.844,24.844,0,0,1-3095,50Zm0-46a21.024,21.024,0,0,0-21,21,21.023,21.023,0,0,0,21,21,21.024,21.024,0,0,0,21-21A21.024,21.024,0,0,0-3095,4Z" transform="translate(3120)"/><rect width="4" height="16" rx="2" transform="translate(23 11)"/></g></svg>
                    </div>
                    <div class = "menu_work_part_list_item_left_video_info_item_right">
                        ` + secondsToTime(Math.round(info["video"]["duration"])) + `
                    </div>
                </div>
            `;
        }

        videoInfo = `
            <div class = "menu_work_part_list_item_left_video_info">
                <div class = "menu_work_part_list_item_left_video_info_box">
                    ` + status + `
                    ` + duration + `
                </div>
            </div>
        `;
    }

    let size = "";
    if (info["type"] == "novel") {
        size = `
            <div class = "menu_work_part_list_item_right_info_item">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M17-1536h0v-41.182l-7-11.9-7,11.9V-1536H17m0,3H3a3,3,0,0,1-3-3v-42l10-17,10,17v42A3,3,0,0,1,17-1533Z" transform="translate(1134.986 -1070.844) rotate(-135)"></path></g></svg>
                <span>` + getNumberUnit(info["size"]) + `</span>
            </div>
        `;
    } else if (info["type"] == "image_format") {
        size = `
            <div class = "menu_work_part_list_item_right_info_item">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M48.5,1550H1.5a1.5,1.5,0,0,1-1.289-2.267l11-18.5a1.5,1.5,0,0,1,1.846-.626l11.336,4.534L36.228,1514.2a1.5,1.5,0,0,1,2.7.327l11,33.5A1.5,1.5,0,0,1,48.5,1550Zm-44.363-3H46.429l-9.354-28.489-10.8,17.284a1.5,1.5,0,0,1-1.829.6l-11.309-4.524Z" transform="translate(0 -1500)"></path><path d="M11.5,3A8.5,8.5,0,1,0,20,11.5,8.51,8.51,0,0,0,11.5,3m0-3A11.5,11.5,0,1,1,0,11.5,11.5,11.5,0,0,1,11.5,0Z"></path></g></svg>
                <span>` + getNumberUnit(info["size"]) + `</span>
            </div>
        `;
    }

    html = `
        <div class = "menu_work_part_list_item md-ripples` + addClass + `" type = "` + info["type"] + `" part_number = "` + info["number"] + `" onclick = "` + onclick + `" oncontextmenu = "moreButtonPartList(` + info["number"] + `, this, event);">
            <div class = "menu_work_part_list_item_left_viewed_percent` + percentViewedAddClass + `">
                <div class = "menu_work_part_list_item_left_viewed_percent_line">
                    <div class = "menu_work_part_list_item_left_viewed_percent_fill" style = "width: ` + percentViewed + `%;"></div>
                </div>
            </div>
            ` + videoInfo + `
            <div class = "menu_work_part_list_item_left img_wrap">
                <img src = "` + info["thumbnail_image"] + `" onload = "imageLoad(event);">
            </div>
            <div class = "menu_work_part_list_item_right">
                <div class = "menu_work_part_list_item_right_items">
                    <div class = "menu_work_part_list_item_right_category">
                        ` + category + `
                    </div>
                </div>
                <div class = "menu_work_part_list_item_right_title">
                    ` + info["title"] + `
                </div>
                <div class = "menu_work_part_list_item_right_info">
                    ` + size + `
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

















function showWorkNavigationPartListMoreLoading(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let loading = contents.getElementsByClassName("work_navigation_part_list_contents_loading")[0];
    loading.style.display = "block";
}
function hideWorkNavigationPartListMoreLoading(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let loading = contents.getElementsByClassName("work_navigation_part_list_contents_loading")[0];
    loading.style.display = "none";
}
function checkWorkNavigationPartListMoreLoading(menuNumber) {
    if (workNavigationPartListNumbers[menuNumber].length == 0) {
        hideWorkNavigationPartListMoreLoading(menuNumber);
        workNavigationPartListNumbers[menuNumber] = null;
    } else {
        showWorkNavigationPartListMoreLoading(menuNumber);
    }
}






















let isWorkNavigationPartListMoreLoad = new Array();

function checkWorkNavigationPartListLoad() {
    if (getCurrentMenuName() == "work") {
        let menuNumber = getCurrentMenuNumber();
        let contents = document.getElementById("contents_" + menuNumber);

        if (contents.getElementsByClassName("part_list_info").length != 0) {
            let boxSize = 75;

            let scrollPercent = ((document.documentElement.scrollTop + window.innerHeight) / (document.documentElement.scrollHeight - boxSize)) * 100;
            if (scrollPercent >= 100) {
                let number = getCurrentMenuNumber();
                if (isWorkNavigationPartListMoreLoad[number] == null) {
                    isWorkNavigationPartListMoreLoad[number] = true;
                    moreLoadWorkNavigationPartList(number);
                }
            }
        }
    }
}
addEventListener("scroll", checkWorkNavigationPartListLoad);
addEventListener("resize", checkWorkNavigationPartListLoad);
addEventListener("focus", checkWorkNavigationPartListLoad);


















function moreLoadWorkNavigationPartList(menuNumber) {
    if (workNavigationPartListNumbers[menuNumber] == null || workNavigationPartListNumbers[menuNumber].length == 0) {
        workNavigationPartListNumbers[menuNumber] = null;
        isWorkNavigationPartListMoreLoad[menuNumber] = null;
        return;
    }

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/part_list/getInfo.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                if (info != null) {
                    for (let i = 0; i < info.length; i++) {
                        let html = getHtmlWorkNavigationPartListItem(menuNumber, info[i]);
                        addContentWorkNavigationPartListItem(menuNumber, info[i]["chapter"], html);
                
                        let array = workNavigationPartListNumbers[menuNumber];
                        array = array.remove("" + info[i]["number"]);
                        workNavigationPartListNumbers[menuNumber] = array;
                    }
                }

                isWorkNavigationPartListMoreLoad[menuNumber] = null;
                checkWorkNavigationPartListMoreLoading(menuNumber);
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

    let numbers = workNavigationPartListNumbers[menuNumber];
    let numbersMaxCount = (numbers.length >= 25) ? 25 : numbers.length;
    numbers = numbers.splice(0, numbersMaxCount);
    
    var formData = new FormData();
    formData.append("lang", userLanguage);
    formData.append("numbers", numbers.join(","));

    xhr.send(formData);
}







function workNavigationPartListOptionLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let workNumber = Number.parseInt(contents.getElementsByClassName("work_number")[0].innerHTML);
    
    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/part_list/getInfoNumbers.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let json = JSON.parse(xhrHtml);
                
                let numbers = contents.getElementsByClassName("part_list_numbers")[0];
                let info = contents.getElementsByClassName("part_list_info")[0];
                numbers.innerHTML = json["numbers"];
                info.innerHTML = json["info"];

                loadWorkNavigationPartList(menuNumber, false);
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

    //옵션
    let sort = contents.getElementsByClassName("sort_box");
    
    var formData = new FormData();
    formData.append("lang", userLanguage);
    formData.append("workNumber", workNumber);
    formData.append("sort", sort[0].getAttribute("value"));
    formData.append("chapter", sort[1].getAttribute("value"));

    xhr.send(formData);
}

























function getWorkNavigationPartListSelectItemsChapter(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let chapterInfo = JSON.parse(contents.getElementsByClassName("part_list_chapter_info")[0].innerHTML);
    return getSelectItemsPartListChapter(chapterInfo);
}
function getSelectItemsPartListChapter(chapterInfo) {
    let items = new Array();
    items[items.length] = {
        "title": getLanguage("work_part_list_all_chapters"),
        "value": 0
    }
    for (let i = 0; i < chapterInfo.length; i++) {
        items[items.length] = {
            "title": getLanguage("work_part_list_chapter").replaceAll("{R:0}", chapterInfo[i]["chapter"]) + ": " + chapterInfo[i]["title"],
            "value": chapterInfo[i]["chapter"]
        }
    }
    return items;
}
















































function moreButtonPartList(partNumber, el, event) {
    if (el.classList.contains("menu_work_part_list_item_viewed")) {
        let slot = new Array();
        slot[0] = {
            'icon': '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 28"><path d="M8 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM12 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM16 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM18 22.813v-14.812h-14v14.812c0 0.75 0.422 1.188 0.5 1.188h13c0.078 0 0.5-0.438 0.5-1.188zM7.5 6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094 0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5 0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375 0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391 2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094 2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z"></path></svg>',
            'title': getLanguage("history_works_more_item:delete"),
            'onclick': 'deletePartHistroy(' + partNumber + ');',
            'class': 'more_button_item_delete',
        };
        moreButton(null, slot, event);
    }
}








function deletePartHistroy(partNumber) {
    //로딩 표시
    loading();

    //요청
    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/history/works/part_delete.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                
                //클라이언트 정보 삭제
                deletePercentViewedPart(partNumber);
                checkPercentPartViewed();

                let items = document.getElementsByClassName("menu_work_part_list_item");
                let items_length = items.length;
                for (let i = 0; i < items_length; i++) {
                    let item = items[i];
                    if (item.getAttribute("part_number") != null) {
                        let number = Number.parseInt(item.getAttribute("part_number"));
                        if (number == partNumber) {
                            //-- -- -- -- -- 화면에서 보이지 않아도 해당 앨리먼트는 삭제하지 않는다 -- -- -- -- --
                            let allowInfo = registerAllowVisibleElement(item);

                            item.classList.remove("menu_work_part_list_item_viewed");
                            let viewedPercent = item.getElementsByClassName("menu_work_part_list_item_left_viewed_percent")[0];
                            viewedPercent.classList.remove("show_part_list_item_left_viewed_percent");
                            let viewedPercentFill = item.getElementsByClassName("menu_work_part_list_item_left_viewed_percent_fill")[0];
                            viewedPercentFill.style.width = null;

                            //-- -- -- -- -- 화면에서 보이지 않아도 삭제되지 않는다를 취소한다 -- -- -- -- --
                            deleteAllowVisibleElement(allowInfo["index"]);
                        }
                    }
                }

                actionMessage(getLanguage("history_works_delete_message"));
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
    formData.append("partNumber", partNumber);

    xhr.send(formData);
}