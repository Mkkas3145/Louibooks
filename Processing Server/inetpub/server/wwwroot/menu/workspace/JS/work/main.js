

function loadWorkspace_work_details(number) {
    let array = {
        "historyUrl": "/workspace/work/details/" + number,
        "name": "workspace_work_details",
        "historyTitle": getLanguage("menu_name:workspace_work_details"),
    };
    loadMenu("/menu/workspace/work/details.php", array, number);
}
function loadWorkspace_work_part_list(number) {
    let array = {
        "historyUrl": "/workspace/work/part_list/" + number,
        "name": "workspace_work_part_list",
        "historyTitle": getLanguage("menu_name:workspace_work_part_list"),
    };
    loadMenu("/menu/workspace/work/part_list.php", array, number);
}
function loadWorkspace_work_comments(number) {
    let array = {
        "historyUrl": "/workspace/work/comments/" + number,
        "name": "workspace_work_comments",
        "historyTitle": getLanguage("menu_name:workspace_work_comments"),
    };
    loadMenu("/menu/workspace/work/comments.php", array, number);
}
function loadWorkspace_work_community(number) {
    let array = {
        "historyUrl": "/workspace/work/community/" + number,
        "name": "workspace_work_community",
        "historyTitle": getLanguage("menu_name:workspace_work_community"),
    };
    loadMenu("/menu/workspace/work/community.php", array, number);
}
function loadWorkspace_work_localization(number) {
    let array = {
        "historyUrl": "/workspace/work/localization/" + number,
        "name": "workspace_work_localization",
        "historyTitle": getLanguage("menu_name:workspace_work_localization"),
    };
    loadMenu("/menu/workspace/work/localization.php", array, number);
}
function loadWorkspace_work_analysis(number) {
    let array = {
        "historyUrl": "/workspace/work/analysis/" + number,
        "name": "workspace_work_analysis",
        "historyTitle": getLanguage("menu_name:workspace_work_analysis"),
    };
    loadMenu("/menu/workspace/work/analysis.php", array, number);
}



function setHtmlSidebarWorkspaceWorkCustom(data) {
    let sidebar_workspace_custom = document.getElementById("wrap_sidebar_workspace_custom");
    sidebar_workspace_custom.setAttribute("type", "workspace_work");

    sidebar_workspace_custom.innerHTML = `
        <!-- 사이드바 -->
        <div class = "big_sidebar scroll">
            <div class = "big_sidebar_items">
                <div onclick = "loadWorkspace_my_works();" class = "big_sidebar_item md-ripples">
                    <div class = "big_sidebar_item_line"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"></rect><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"></rect></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"></rect></g></svg>
                    <div class = "big_sidebar_item_text">
                        ` + getLanguage("sidebar_workspace_my_works") + `
                    </div>
                </div>
            </div>
            <div class = "big_sidebar_line"></div>
            <div class = "big_sidebar_items">
                <div name = "big_sidebar_item_workspace_work_details" onclick = "loadWorkspace_work_details(` + data + `);" class = "big_sidebar_item md-ripples">
                    <div class = "big_sidebar_item_line"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-4.438,42.27v0L.4,28.587,21.847,7.145a2.12,2.12,0,0,1,1.506-.632,1.945,1.945,0,0,1,1.387.567l7.071,7.071a1.944,1.944,0,0,1,.567,1.433,2.125,2.125,0,0,1-.632,1.459L10.3,38.487-4.436,42.27ZM23.387,9.839h0L3.162,30.064-.327,38.621l9.154-2.892L29.052,15.5,23.387,9.839Z" transform="translate(5.102 6.536)"/><path d="M28.7,19.1a1.987,1.987,0,0,1-1.414-.586l-7.071-7.071a2,2,0,0,1,0-2.828l6.368-6.368a2,2,0,0,1,2.829,0l7.071,7.071a2,2,0,0,1,0,2.828L30.116,18.51A1.987,1.987,0,0,1,28.7,19.1ZM27.995,5.067h0l-4.95,4.95,5.666,5.665,4.95-4.949L27.995,5.067Z" transform="translate(12.102 -0.464)"/></g></svg>
                    <div class = "big_sidebar_item_text">
                        ` + getLanguage("sidebar_workspace_work_details") + `
                    </div>
                </div>
                <div name = "big_sidebar_item_workspace_work_part_list" onclick = "loadWorkspace_work_part_list(` + data + `);" class = "big_sidebar_item md-ripples">
                    <div class = "big_sidebar_item_line"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="10" height="3" rx="1.5" transform="translate(0 7)"></rect><rect width="35" height="3" rx="1.5" transform="translate(15 7)"></rect><rect width="10" height="3" rx="1.5" transform="translate(0 24)"></rect><rect width="10" height="3" rx="1.5" transform="translate(0 41)"></rect><rect width="29" height="3" rx="1.5" transform="translate(15 24)"></rect><rect width="35" height="3" rx="1.5" transform="translate(15 41)"></rect></g></svg>
                    <div class = "big_sidebar_item_text">
                        ` + getLanguage("sidebar_workspace_work_part_list") + `
                    </div>
                </div>
                <div name = "big_sidebar_item_workspace_work_analysis" onclick = "loadWorkspace_work_analysis(` + data + `);" class = "big_sidebar_item md-ripples">
                    <div class = "big_sidebar_item_line"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5"/><rect width="3" height="50" rx="1.5" transform="translate(50 47) rotate(90)"/><rect width="3" height="18" rx="1.5" transform="translate(10 24)"/><rect width="3" height="28" rx="1.5" transform="translate(20 14)"/><rect width="3" height="11" rx="1.5" transform="translate(29 31)"/><rect width="3" height="21" rx="1.5" transform="translate(39 21)"/></g></svg>
                    <div class = "big_sidebar_item_text">
                        ` + getLanguage("sidebar_workspace_work_analysis") + `
                    </div>
                </div>
                <div name = "big_sidebar_item_workspace_work_comments" onclick = "loadWorkspace_work_comments(` + data + `);" class = "big_sidebar_item md-ripples">
                    <div class = "big_sidebar_item_line"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M40.707,46.427h0a3.976,3.976,0,0,1-2.333-1.044c-3.13-2.487-11.917-9.316-12-9.383H5a5.006,5.006,0,0,1-5-5V5A5.006,5.006,0,0,1,5,0H45a5.006,5.006,0,0,1,5,5V31a5.005,5.005,0,0,1-5,5H42.466v9.106A2,2,0,0,1,40.707,46.427ZM4.906,3A1.985,1.985,0,0,0,3.016,4.9L2.984,31.027c0,.019.129,1.891,1.859,1.953H27.391l12.078,9.453V32.98h5.688A2.03,2.03,0,0,0,47,31l-.015-26.25c0-.017-.282-1.672-1.8-1.718Z" transform="translate(0 1.786)"></path></g></svg>
                    <div class = "big_sidebar_item_text">
                        ` + getLanguage("sidebar_workspace_work_comments") + `
                    </div>
                </div>
                <div name = "big_sidebar_item_workspace_work_community" onclick = "loadWorkspace_work_community(` + data + `);" class = "big_sidebar_item md-ripples">
                    <div class = "big_sidebar_item_line"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,50A25.007,25.007,0,0,1,15.269,1.965,25.007,25.007,0,0,1,34.731,48.036,24.843,24.843,0,0,1,25,50ZM25,3A22,22,0,1,0,47,25,22.025,22.025,0,0,0,25,3Z"></path><rect width="48" height="2" transform="translate(26 1) rotate(90)"></rect><path d="M0,0S11.775-11.288,23.775-11.288,48,0,48,0V2S35.775-9.288,23.775-9.288,0,2,0,2Z" transform="translate(26 1) rotate(90)"></path><path d="M0,0S11.775-11.288,23.775-11.288,48,0,48,0V2S35.775-9.288,23.775-9.288,0,2,0,2Z" transform="translate(24 49) rotate(-90)"></path><path d="M0,0S11.923-4.994,23.923-4.994,48,0,48,0V2S35.923-2.994,23.923-2.994,0,2,0,2Z" transform="translate(49 31.856) rotate(-180)"></path><path d="M0,0S11.923-4.994,23.923-4.994,48,0,48,0V2S35.923-2.994,23.923-2.994,0,2,0,2Z" transform="translate(1 17.85)"></path></g></svg>
                    <div class = "big_sidebar_item_text">
                        ` + getLanguage("sidebar_workspace_work_community") + `
                    </div>
                </div>
                <div name = "big_sidebar_item_workspace_work_localization" onclick = "loadWorkspace_work_localization(` + data + `);" class = "big_sidebar_item md-ripples">
                    <div class = "big_sidebar_item_line"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(0 -10)"><rect width="3" height="39" rx="1.5" transform="translate(13.339 12.326) rotate(20)"></rect><rect width="3" height="39" rx="1.5" transform="translate(12.35 13.352) rotate(-20)"></rect><rect width="3" height="15.5" rx="1.5" transform="translate(22.179 33.413) rotate(90)"></rect></g><g transform="translate(4.821 6)"><rect width="3" height="23.5" rx="1.5" transform="translate(45.179 15.413) rotate(90)"></rect><rect width="3" height="6.299" rx="1.5" transform="translate(34.929 17.589) rotate(180)"></rect><path d="M6.258-1.278A1.576,1.576,0,0,1,7.282.152s-3.4,8.118-4.351,14.5A42.123,42.123,0,0,0,3,26.749a1.5,1.5,0,0,1-3,0A46.581,46.581,0,0,1,.157,14.4C1.163,7.87,4.524-.436,4.524-.436A1.37,1.37,0,0,1,6.258-1.278Z" transform="translate(30.054 41.378) rotate(-150)"></path><path d="M-4.084.024A1.4,1.4,0,0,1-2.138.58,46.577,46.577,0,0,1,2.6,12.127a40.794,40.794,0,0,1,.4,11.8,1.5,1.5,0,0,1-3,0,25.612,25.612,0,0,0,0-10.38A49.119,49.119,0,0,0-4.77,1.8,1.48,1.48,0,0,1-4.084.024Z" transform="translate(39.585 41.423) rotate(150)"></path></g></g></svg>
                    <div class = "big_sidebar_item_text">
                        ` + getLanguage("sidebar_workspace_work_localization") + `
                    </div>
                </div>
            </div>
            <div class = "big_sidebar_line"></div>
        </div>
        <!-- 작은 사이드바 -->
        <div class = "small_sidebar">
            <div class = "small_sidebar_right">
                <!-- 뒤로가기 -->
                <div class = "small_sidebar_items">
                    <div class = "small_sidebar_item md-ripples" onclick = "loadWorkspace_my_works();" onmouseenter = "hoverInformation(this, getLanguage('sidebar_workspace_my_works'));">
                        <div class = "small_sidebar_item_left">
                            <div class = "small_sidebar_item_left_line"></div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"></rect><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"></rect></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"></rect></g></svg>
                    </div>
                </div>
                <!-- ... -->
                <div class = "big_sidebar_line"></div>
                <div class = "small_sidebar_items">
                    <div class = "small_sidebar_item md-ripples" onclick = "loadWorkspace_work_details(` + data + `);" id = "small_sidebar_item_workspace_work_details" onmouseenter = "hoverInformation(this, getLanguage('sidebar_workspace_work_details'));">
                        <div class = "small_sidebar_item_left">
                            <div class = "small_sidebar_item_left_line"></div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-4.438,42.27v0L.4,28.587,21.847,7.145a2.12,2.12,0,0,1,1.506-.632,1.945,1.945,0,0,1,1.387.567l7.071,7.071a1.944,1.944,0,0,1,.567,1.433,2.125,2.125,0,0,1-.632,1.459L10.3,38.487-4.436,42.27ZM23.387,9.839h0L3.162,30.064-.327,38.621l9.154-2.892L29.052,15.5,23.387,9.839Z" transform="translate(5.102 6.536)"/><path d="M28.7,19.1a1.987,1.987,0,0,1-1.414-.586l-7.071-7.071a2,2,0,0,1,0-2.828l6.368-6.368a2,2,0,0,1,2.829,0l7.071,7.071a2,2,0,0,1,0,2.828L30.116,18.51A1.987,1.987,0,0,1,28.7,19.1ZM27.995,5.067h0l-4.95,4.95,5.666,5.665,4.95-4.949L27.995,5.067Z" transform="translate(12.102 -0.464)"/></g></svg>
                    </div>
                    <div class = "small_sidebar_item md-ripples" onclick = "loadWorkspace_work_part_list(` + data + `);" id = "small_sidebar_item_workspace_work_part_list" onmouseenter = "hoverInformation(this, getLanguage('sidebar_workspace_work_part_list'));">
                        <div class = "small_sidebar_item_left">
                            <div class = "small_sidebar_item_left_line"></div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="10" height="3" rx="1.5" transform="translate(0 7)"></rect><rect width="35" height="3" rx="1.5" transform="translate(15 7)"></rect><rect width="10" height="3" rx="1.5" transform="translate(0 24)"></rect><rect width="10" height="3" rx="1.5" transform="translate(0 41)"></rect><rect width="29" height="3" rx="1.5" transform="translate(15 24)"></rect><rect width="35" height="3" rx="1.5" transform="translate(15 41)"></rect></g></svg>
                    </div>
                    <div class = "small_sidebar_item md-ripples" onclick = "loadWorkspace_work_analysis(` + data + `);" id = "small_sidebar_item_workspace_work_analysis" onmouseenter = "hoverInformation(this, getLanguage('sidebar_workspace_work_analysis'));">
                        <div class = "small_sidebar_item_left">
                            <div class = "small_sidebar_item_left_line"></div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5"/><rect width="3" height="50" rx="1.5" transform="translate(50 47) rotate(90)"/><rect width="3" height="18" rx="1.5" transform="translate(10 24)"/><rect width="3" height="28" rx="1.5" transform="translate(20 14)"/><rect width="3" height="11" rx="1.5" transform="translate(29 31)"/><rect width="3" height="21" rx="1.5" transform="translate(39 21)"/></g></svg>
                    </div>
                    <div class = "small_sidebar_item md-ripples" onclick = "loadWorkspace_work_comments(` + data + `);" id = "small_sidebar_item_workspace_work_comments" onmouseenter = "hoverInformation(this, getLanguage('sidebar_workspace_work_comments'));">
                        <div class = "small_sidebar_item_left">
                            <div class = "small_sidebar_item_left_line"></div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M40.707,46.427h0a3.976,3.976,0,0,1-2.333-1.044c-3.13-2.487-11.917-9.316-12-9.383H5a5.006,5.006,0,0,1-5-5V5A5.006,5.006,0,0,1,5,0H45a5.006,5.006,0,0,1,5,5V31a5.005,5.005,0,0,1-5,5H42.466v9.106A2,2,0,0,1,40.707,46.427ZM4.906,3A1.985,1.985,0,0,0,3.016,4.9L2.984,31.027c0,.019.129,1.891,1.859,1.953H27.391l12.078,9.453V32.98h5.688A2.03,2.03,0,0,0,47,31l-.015-26.25c0-.017-.282-1.672-1.8-1.718Z" transform="translate(0 1.786)"></path></g></svg>
                    </div>
                    <div class = "small_sidebar_item md-ripples" onclick = "loadWorkspace_work_community(` + data + `);" id = "small_sidebar_item_workspace_work_community" onmouseenter = "hoverInformation(this, getLanguage('sidebar_workspace_work_community'));">
                        <div class = "small_sidebar_item_left">
                            <div class = "small_sidebar_item_left_line"></div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,50A25.007,25.007,0,0,1,15.269,1.965,25.007,25.007,0,0,1,34.731,48.036,24.843,24.843,0,0,1,25,50ZM25,3A22,22,0,1,0,47,25,22.025,22.025,0,0,0,25,3Z"></path><rect width="48" height="2" transform="translate(26 1) rotate(90)"></rect><path d="M0,0S11.775-11.288,23.775-11.288,48,0,48,0V2S35.775-9.288,23.775-9.288,0,2,0,2Z" transform="translate(26 1) rotate(90)"></path><path d="M0,0S11.775-11.288,23.775-11.288,48,0,48,0V2S35.775-9.288,23.775-9.288,0,2,0,2Z" transform="translate(24 49) rotate(-90)"></path><path d="M0,0S11.923-4.994,23.923-4.994,48,0,48,0V2S35.923-2.994,23.923-2.994,0,2,0,2Z" transform="translate(49 31.856) rotate(-180)"></path><path d="M0,0S11.923-4.994,23.923-4.994,48,0,48,0V2S35.923-2.994,23.923-2.994,0,2,0,2Z" transform="translate(1 17.85)"></path></g></svg>
                    </div>
                    <div class = "small_sidebar_item md-ripples" onclick = "loadWorkspace_work_localization(` + data + `);" id = "small_sidebar_item_workspace_work_localization" onmouseenter = "hoverInformation(this, getLanguage('sidebar_workspace_work_localization'));">
                        <div class = "small_sidebar_item_left">
                            <div class = "small_sidebar_item_left_line"></div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(0 -10)"><rect width="3" height="39" rx="1.5" transform="translate(13.339 12.326) rotate(20)"></rect><rect width="3" height="39" rx="1.5" transform="translate(12.35 13.352) rotate(-20)"></rect><rect width="3" height="15.5" rx="1.5" transform="translate(22.179 33.413) rotate(90)"></rect></g><g transform="translate(4.821 6)"><rect width="3" height="23.5" rx="1.5" transform="translate(45.179 15.413) rotate(90)"></rect><rect width="3" height="6.299" rx="1.5" transform="translate(34.929 17.589) rotate(180)"></rect><path d="M6.258-1.278A1.576,1.576,0,0,1,7.282.152s-3.4,8.118-4.351,14.5A42.123,42.123,0,0,0,3,26.749a1.5,1.5,0,0,1-3,0A46.581,46.581,0,0,1,.157,14.4C1.163,7.87,4.524-.436,4.524-.436A1.37,1.37,0,0,1,6.258-1.278Z" transform="translate(30.054 41.378) rotate(-150)"></path><path d="M-4.084.024A1.4,1.4,0,0,1-2.138.58,46.577,46.577,0,0,1,2.6,12.127a40.794,40.794,0,0,1,.4,11.8,1.5,1.5,0,0,1-3,0,25.612,25.612,0,0,0,0-10.38A49.119,49.119,0,0,0-4.77,1.8,1.48,1.48,0,0,1-4.084.024Z" transform="translate(39.585 41.423) rotate(150)"></path></g></g></svg>
                    </div>
                </div>
                <div class = "big_sidebar_line"></div>
            </div>
        </div>
    `;
}

function setHtmlFooterWorkspaceWorkCustom(data) {
    let wrap_footer_workspace_custom = document.getElementById("wrap_footer_workspace_custom");
    wrap_footer_workspace_custom.setAttribute("type", "workspace_work");

    wrap_footer_workspace_custom.innerHTML = `
        <div id = "footer_item_workspace_work_details" onclick = "loadWorkspace_work_details(` + data + `);" class = "footer_item md-ripples">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-4.438,42.27v0L.4,28.587,21.847,7.145a2.12,2.12,0,0,1,1.506-.632,1.945,1.945,0,0,1,1.387.567l7.071,7.071a1.944,1.944,0,0,1,.567,1.433,2.125,2.125,0,0,1-.632,1.459L10.3,38.487-4.436,42.27ZM23.387,9.839h0L3.162,30.064-.327,38.621l9.154-2.892L29.052,15.5,23.387,9.839Z" transform="translate(5.102 6.536)"/><path d="M28.7,19.1a1.987,1.987,0,0,1-1.414-.586l-7.071-7.071a2,2,0,0,1,0-2.828l6.368-6.368a2,2,0,0,1,2.829,0l7.071,7.071a2,2,0,0,1,0,2.828L30.116,18.51A1.987,1.987,0,0,1,28.7,19.1ZM27.995,5.067h0l-4.95,4.95,5.666,5.665,4.95-4.949L27.995,5.067Z" transform="translate(12.102 -0.464)"/></g></svg>
            <div class = "footer_item_text">
                ` + getLanguage("sidebar_workspace_work_details") + `
            </div>
            <div class = "footer_item_line"></div>
        </div>
        <div id = "footer_item_workspace_work_part_list" onclick = "loadWorkspace_work_part_list(` + data + `);" class = "footer_item md-ripples">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="10" height="3" rx="1.5" transform="translate(0 7)"></rect><rect width="35" height="3" rx="1.5" transform="translate(15 7)"></rect><rect width="10" height="3" rx="1.5" transform="translate(0 24)"></rect><rect width="10" height="3" rx="1.5" transform="translate(0 41)"></rect><rect width="29" height="3" rx="1.5" transform="translate(15 24)"></rect><rect width="35" height="3" rx="1.5" transform="translate(15 41)"></rect></g></svg>
            <div class = "footer_item_text">
                ` + getLanguage("sidebar_workspace_work_part_list") + `
            </div>
            <div class = "footer_item_line"></div>
        </div>
        <div id = "footer_item_workspace_work_analysis" onclick = "loadWorkspace_work_analysis(` + data + `);" class = "footer_item md-ripples">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5"/><rect width="3" height="50" rx="1.5" transform="translate(50 47) rotate(90)"/><rect width="3" height="18" rx="1.5" transform="translate(10 24)"/><rect width="3" height="28" rx="1.5" transform="translate(20 14)"/><rect width="3" height="11" rx="1.5" transform="translate(29 31)"/><rect width="3" height="21" rx="1.5" transform="translate(39 21)"/></g></svg>
            <div class = "footer_item_text">
                ` + getLanguage("sidebar_workspace_work_analysis") + `
            </div>
            <div class = "footer_item_line"></div>
        </div>
        <div id = "footer_item_workspace_work_comments" onclick = "loadWorkspace_work_comments(` + data + `);" class = "footer_item md-ripples">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M40.707,46.427h0a3.976,3.976,0,0,1-2.333-1.044c-3.13-2.487-11.917-9.316-12-9.383H5a5.006,5.006,0,0,1-5-5V5A5.006,5.006,0,0,1,5,0H45a5.006,5.006,0,0,1,5,5V31a5.005,5.005,0,0,1-5,5H42.466v9.106A2,2,0,0,1,40.707,46.427ZM4.906,3A1.985,1.985,0,0,0,3.016,4.9L2.984,31.027c0,.019.129,1.891,1.859,1.953H27.391l12.078,9.453V32.98h5.688A2.03,2.03,0,0,0,47,31l-.015-26.25c0-.017-.282-1.672-1.8-1.718Z" transform="translate(0 1.786)"></path></g></svg>
            <div class = "footer_item_text">
                ` + getLanguage("sidebar_workspace_work_comments") + `
            </div>
            <div class = "footer_item_line"></div>
        </div>
        <div id = "footer_item_workspace_work_community" onclick = "loadWorkspace_work_community(` + data + `);" class = "footer_item md-ripples">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,50A25.007,25.007,0,0,1,15.269,1.965,25.007,25.007,0,0,1,34.731,48.036,24.843,24.843,0,0,1,25,50ZM25,3A22,22,0,1,0,47,25,22.025,22.025,0,0,0,25,3Z"></path><rect width="48" height="2" transform="translate(26 1) rotate(90)"></rect><path d="M0,0S11.775-11.288,23.775-11.288,48,0,48,0V2S35.775-9.288,23.775-9.288,0,2,0,2Z" transform="translate(26 1) rotate(90)"></path><path d="M0,0S11.775-11.288,23.775-11.288,48,0,48,0V2S35.775-9.288,23.775-9.288,0,2,0,2Z" transform="translate(24 49) rotate(-90)"></path><path d="M0,0S11.923-4.994,23.923-4.994,48,0,48,0V2S35.923-2.994,23.923-2.994,0,2,0,2Z" transform="translate(49 31.856) rotate(-180)"></path><path d="M0,0S11.923-4.994,23.923-4.994,48,0,48,0V2S35.923-2.994,23.923-2.994,0,2,0,2Z" transform="translate(1 17.85)"></path></g></svg>
            <div class = "footer_item_text">
                ` + getLanguage("sidebar_workspace_work_community") + `
            </div>
            <div class = "footer_item_line"></div>
        </div>
        <div id = "footer_item_workspace_work_localization" onclick = "loadWorkspace_work_localization(` + data + `);" class = "footer_item md-ripples">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(0 -10)"><rect width="3" height="39" rx="1.5" transform="translate(13.339 12.326) rotate(20)"></rect><rect width="3" height="39" rx="1.5" transform="translate(12.35 13.352) rotate(-20)"></rect><rect width="3" height="15.5" rx="1.5" transform="translate(22.179 33.413) rotate(90)"></rect></g><g transform="translate(4.821 6)"><rect width="3" height="23.5" rx="1.5" transform="translate(45.179 15.413) rotate(90)"></rect><rect width="3" height="6.299" rx="1.5" transform="translate(34.929 17.589) rotate(180)"></rect><path d="M6.258-1.278A1.576,1.576,0,0,1,7.282.152s-3.4,8.118-4.351,14.5A42.123,42.123,0,0,0,3,26.749a1.5,1.5,0,0,1-3,0A46.581,46.581,0,0,1,.157,14.4C1.163,7.87,4.524-.436,4.524-.436A1.37,1.37,0,0,1,6.258-1.278Z" transform="translate(30.054 41.378) rotate(-150)"></path><path d="M-4.084.024A1.4,1.4,0,0,1-2.138.58,46.577,46.577,0,0,1,2.6,12.127a40.794,40.794,0,0,1,.4,11.8,1.5,1.5,0,0,1-3,0,25.612,25.612,0,0,0,0-10.38A49.119,49.119,0,0,0-4.77,1.8,1.48,1.48,0,0,1-4.084.024Z" transform="translate(39.585 41.423) rotate(150)"></path></g></g></svg>
            <div class = "footer_item_text">
                ` + getLanguage("sidebar_workspace_work_localization") + `
            </div>
        <div class = "footer_item_line"></div>
    </div>
    `;
}