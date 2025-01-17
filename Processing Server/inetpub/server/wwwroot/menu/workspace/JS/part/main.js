

function loadWorkspace_part_details(number) {
    let array = {
        "historyUrl": "/workspace/part/details/" + number,
        "name": "workspace_part_details",
        "historyTitle": getLanguage("menu_name:workspace_part_details"),
    };
    loadMenu("/menu/workspace/part/details.php", array, number);
}
function loadWorkspace_part_comments(number) {
    let array = {
        "historyUrl": "/workspace/part/comments/" + number,
        "name": "workspace_part_comments",
        "historyTitle": getLanguage("menu_name:workspace_part_comments"),
    };
    loadMenu("/menu/workspace/part/comments.php", array, number);
}
function loadWorkspace_part_localization(number) {
    let array = {
        "historyUrl": "/workspace/part/localization/" + number,
        "name": "workspace_part_localization",
        "historyTitle": getLanguage("menu_name:workspace_part_localization"),
    };
    loadMenu("/menu/workspace/part/localization.php", array, number);
}
function loadWorkspace_part_user_translation(number) {
    let array = {
        "historyUrl": "/workspace/part/user_translation/" + number,
        "name": "workspace_part_user_translation",
        "historyTitle": getLanguage("menu_name:workspace_part_user_translation"),
    };
    loadMenu("/menu/workspace/part/user_translation.php", array, number);
}



function setHtmlSidebarWorkspacePartCustom(data) {
    let sidebar_workspace_custom = document.getElementById("wrap_sidebar_workspace_custom");
    sidebar_workspace_custom.setAttribute("type", "workspace_part");

    let menuNumber = getCurrentMenuNumber();
    let contents = document.getElementById("contents_" + menuNumber);
    let info = contents.getElementsByClassName("info");
    let workNumber = null;
    if (info.length != 0) {
        info = JSON.parse(info[0].innerHTML)
        workNumber = info["workNumber"];
    }

    sidebar_workspace_custom.innerHTML = `
        <!-- 사이드바 -->
        <div class = "big_sidebar scroll">
            <div class = "big_sidebar_items">
                <div class = "big_sidebar_item md-ripples" onclick = "loadWorkspace_work_part_list(` + workNumber + `);">
                    <div class = "big_sidebar_item_line"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"></rect><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"></rect></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"></rect></g></svg>
                    <div class = "big_sidebar_item_text">
                        ` + getLanguage("sidebar_workspace_part_back_button") + `
                    </div>
                </div>
            </div>
            <div class = "big_sidebar_line"></div>
            <div class = "big_sidebar_items">
                <div name = "big_sidebar_item_workspace_part_details" onclick = "loadWorkspace_part_details(` + data + `);" class = "big_sidebar_item md-ripples">
                    <div class = "big_sidebar_item_line"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-4.438,42.27v0L.4,28.587,21.847,7.145a2.12,2.12,0,0,1,1.506-.632,1.945,1.945,0,0,1,1.387.567l7.071,7.071a1.944,1.944,0,0,1,.567,1.433,2.125,2.125,0,0,1-.632,1.459L10.3,38.487-4.436,42.27ZM23.387,9.839h0L3.162,30.064-.327,38.621l9.154-2.892L29.052,15.5,23.387,9.839Z" transform="translate(5.102 6.536)"/><path d="M28.7,19.1a1.987,1.987,0,0,1-1.414-.586l-7.071-7.071a2,2,0,0,1,0-2.828l6.368-6.368a2,2,0,0,1,2.829,0l7.071,7.071a2,2,0,0,1,0,2.828L30.116,18.51A1.987,1.987,0,0,1,28.7,19.1ZM27.995,5.067h0l-4.95,4.95,5.666,5.665,4.95-4.949L27.995,5.067Z" transform="translate(12.102 -0.464)"/></g></svg>
                    <div class = "big_sidebar_item_text">
                        ` + getLanguage("sidebar_workspace_part_details") + `
                    </div>
                </div>
                <div name = "big_sidebar_item_workspace_part_comments" onclick = "loadWorkspace_part_comments(` + data + `);" class = "big_sidebar_item md-ripples">
                    <div class = "big_sidebar_item_line"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M40.707,46.427h0a3.976,3.976,0,0,1-2.333-1.044c-3.13-2.487-11.917-9.316-12-9.383H5a5.006,5.006,0,0,1-5-5V5A5.006,5.006,0,0,1,5,0H45a5.006,5.006,0,0,1,5,5V31a5.005,5.005,0,0,1-5,5H42.466v9.106A2,2,0,0,1,40.707,46.427ZM4.906,3A1.985,1.985,0,0,0,3.016,4.9L2.984,31.027c0,.019.129,1.891,1.859,1.953H27.391l12.078,9.453V32.98h5.688A2.03,2.03,0,0,0,47,31l-.015-26.25c0-.017-.282-1.672-1.8-1.718Z" transform="translate(0 1.786)"></path></g></svg>
                    <div class = "big_sidebar_item_text">
                        ` + getLanguage("sidebar_workspace_part_comments") + `
                    </div>
                </div>
                <div name = "big_sidebar_item_workspace_part_localization" onclick = "loadWorkspace_part_localization(` + data + `);" class = "big_sidebar_item md-ripples">
                    <div class = "big_sidebar_item_line"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(0 -10)"><rect width="3" height="39" rx="1.5" transform="translate(13.339 12.326) rotate(20)"></rect><rect width="3" height="39" rx="1.5" transform="translate(12.35 13.352) rotate(-20)"></rect><rect width="3" height="15.5" rx="1.5" transform="translate(22.179 33.413) rotate(90)"></rect></g><g transform="translate(4.821 6)"><rect width="3" height="23.5" rx="1.5" transform="translate(45.179 15.413) rotate(90)"></rect><rect width="3" height="6.299" rx="1.5" transform="translate(34.929 17.589) rotate(180)"></rect><path d="M6.258-1.278A1.576,1.576,0,0,1,7.282.152s-3.4,8.118-4.351,14.5A42.123,42.123,0,0,0,3,26.749a1.5,1.5,0,0,1-3,0A46.581,46.581,0,0,1,.157,14.4C1.163,7.87,4.524-.436,4.524-.436A1.37,1.37,0,0,1,6.258-1.278Z" transform="translate(30.054 41.378) rotate(-150)"></path><path d="M-4.084.024A1.4,1.4,0,0,1-2.138.58,46.577,46.577,0,0,1,2.6,12.127a40.794,40.794,0,0,1,.4,11.8,1.5,1.5,0,0,1-3,0,25.612,25.612,0,0,0,0-10.38A49.119,49.119,0,0,0-4.77,1.8,1.48,1.48,0,0,1-4.084.024Z" transform="translate(39.585 41.423) rotate(150)"></path></g></g></svg>
                    <div class = "big_sidebar_item_text">
                        ` + getLanguage("sidebar_workspace_part_localization") + `
                    </div>
                </div>
                <div name = "big_sidebar_item_workspace_part_user_translation" onclick = "loadWorkspace_part_user_translation(` + data + `);" class = "big_sidebar_item md-ripples">
                    <div class = "big_sidebar_item_line"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(0 -10)"><rect width="3" height="39" rx="1.5" transform="translate(13.339 12.326) rotate(20)"></rect><rect width="3" height="39" rx="1.5" transform="translate(12.35 13.352) rotate(-20)"></rect><rect width="3" height="15.5" rx="1.5" transform="translate(22.179 33.413) rotate(90)"></rect></g><g transform="translate(4.821 6)"><rect width="3" height="23.5" rx="1.5" transform="translate(45.179 15.413) rotate(90)"></rect><rect width="3" height="6.299" rx="1.5" transform="translate(34.929 17.589) rotate(180)"></rect><path d="M6.258-1.278A1.576,1.576,0,0,1,7.282.152s-3.4,8.118-4.351,14.5A42.123,42.123,0,0,0,3,26.749a1.5,1.5,0,0,1-3,0A46.581,46.581,0,0,1,.157,14.4C1.163,7.87,4.524-.436,4.524-.436A1.37,1.37,0,0,1,6.258-1.278Z" transform="translate(30.054 41.378) rotate(-150)"></path><path d="M-4.084.024A1.4,1.4,0,0,1-2.138.58,46.577,46.577,0,0,1,2.6,12.127a40.794,40.794,0,0,1,.4,11.8,1.5,1.5,0,0,1-3,0,25.612,25.612,0,0,0,0-10.38A49.119,49.119,0,0,0-4.77,1.8,1.48,1.48,0,0,1-4.084.024Z" transform="translate(39.585 41.423) rotate(150)"></path></g></g></svg>
                    <div class = "big_sidebar_item_text">
                        ` + getLanguage("sidebar_workspace_part_user_translation") + `
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
                    <div class = "small_sidebar_item md-ripples" onclick = "loadWorkspace_work_part_list(` + workNumber + `);" onmouseenter = "hoverInformation(this, getLanguage('sidebar_workspace_part_back_button'));">
                        <div class = "small_sidebar_item_left">
                            <div class = "small_sidebar_item_left_line"></div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"></rect><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"></rect></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"></rect></g></svg>
                    </div>
                </div>
                <!-- ... -->
                <div class = "big_sidebar_line"></div>
                <div class = "small_sidebar_items">
                    <div class = "small_sidebar_item md-ripples" onclick = "loadWorkspace_part_details(` + data + `);" id = "small_sidebar_item_workspace_part_details" onmouseenter = "hoverInformation(this, getLanguage('sidebar_workspace_part_details'));">
                        <div class = "small_sidebar_item_left">
                            <div class = "small_sidebar_item_left_line"></div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-4.438,42.27v0L.4,28.587,21.847,7.145a2.12,2.12,0,0,1,1.506-.632,1.945,1.945,0,0,1,1.387.567l7.071,7.071a1.944,1.944,0,0,1,.567,1.433,2.125,2.125,0,0,1-.632,1.459L10.3,38.487-4.436,42.27ZM23.387,9.839h0L3.162,30.064-.327,38.621l9.154-2.892L29.052,15.5,23.387,9.839Z" transform="translate(5.102 6.536)"/><path d="M28.7,19.1a1.987,1.987,0,0,1-1.414-.586l-7.071-7.071a2,2,0,0,1,0-2.828l6.368-6.368a2,2,0,0,1,2.829,0l7.071,7.071a2,2,0,0,1,0,2.828L30.116,18.51A1.987,1.987,0,0,1,28.7,19.1ZM27.995,5.067h0l-4.95,4.95,5.666,5.665,4.95-4.949L27.995,5.067Z" transform="translate(12.102 -0.464)"/></g></svg>
                    </div>
                    <div class = "small_sidebar_item md-ripples" onclick = "loadWorkspace_part_comments(` + data + `);" id = "small_sidebar_item_workspace_part_comments" onmouseenter = "hoverInformation(this, getLanguage('sidebar_workspace_part_comments'));">
                        <div class = "small_sidebar_item_left">
                            <div class = "small_sidebar_item_left_line"></div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M40.707,46.427h0a3.976,3.976,0,0,1-2.333-1.044c-3.13-2.487-11.917-9.316-12-9.383H5a5.006,5.006,0,0,1-5-5V5A5.006,5.006,0,0,1,5,0H45a5.006,5.006,0,0,1,5,5V31a5.005,5.005,0,0,1-5,5H42.466v9.106A2,2,0,0,1,40.707,46.427ZM4.906,3A1.985,1.985,0,0,0,3.016,4.9L2.984,31.027c0,.019.129,1.891,1.859,1.953H27.391l12.078,9.453V32.98h5.688A2.03,2.03,0,0,0,47,31l-.015-26.25c0-.017-.282-1.672-1.8-1.718Z" transform="translate(0 1.786)"></path></g></svg>
                    </div>
                    <div class = "small_sidebar_item md-ripples" onclick = "loadWorkspace_part_localization(` + data + `);" id = "small_sidebar_item_workspace_part_localization" onmouseenter = "hoverInformation(this, getLanguage('sidebar_workspace_part_localization'));">
                        <div class = "small_sidebar_item_left">
                            <div class = "small_sidebar_item_left_line"></div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(0 -10)"><rect width="3" height="39" rx="1.5" transform="translate(13.339 12.326) rotate(20)"></rect><rect width="3" height="39" rx="1.5" transform="translate(12.35 13.352) rotate(-20)"></rect><rect width="3" height="15.5" rx="1.5" transform="translate(22.179 33.413) rotate(90)"></rect></g><g transform="translate(4.821 6)"><rect width="3" height="23.5" rx="1.5" transform="translate(45.179 15.413) rotate(90)"></rect><rect width="3" height="6.299" rx="1.5" transform="translate(34.929 17.589) rotate(180)"></rect><path d="M6.258-1.278A1.576,1.576,0,0,1,7.282.152s-3.4,8.118-4.351,14.5A42.123,42.123,0,0,0,3,26.749a1.5,1.5,0,0,1-3,0A46.581,46.581,0,0,1,.157,14.4C1.163,7.87,4.524-.436,4.524-.436A1.37,1.37,0,0,1,6.258-1.278Z" transform="translate(30.054 41.378) rotate(-150)"></path><path d="M-4.084.024A1.4,1.4,0,0,1-2.138.58,46.577,46.577,0,0,1,2.6,12.127a40.794,40.794,0,0,1,.4,11.8,1.5,1.5,0,0,1-3,0,25.612,25.612,0,0,0,0-10.38A49.119,49.119,0,0,0-4.77,1.8,1.48,1.48,0,0,1-4.084.024Z" transform="translate(39.585 41.423) rotate(150)"></path></g></g></svg>
                    </div>
                    <div class = "small_sidebar_item md-ripples" onclick = "loadWorkspace_part_user_translation(` + data + `);" id = "small_sidebar_item_workspace_part_localization" onmouseenter = "hoverInformation(this, getLanguage('sidebar_workspace_part_user_translation'));">
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

function setHtmlFooterWorkspacePartCustom(data) {
    let wrap_footer_workspace_custom = document.getElementById("wrap_footer_workspace_custom");
    wrap_footer_workspace_custom.setAttribute("type", "workspace_part");

    wrap_footer_workspace_custom.innerHTML = `
        <div id = "footer_item_workspace_part_details" onclick = "loadWorkspace_part_details(` + data + `);" class = "footer_item md-ripples">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-4.438,42.27v0L.4,28.587,21.847,7.145a2.12,2.12,0,0,1,1.506-.632,1.945,1.945,0,0,1,1.387.567l7.071,7.071a1.944,1.944,0,0,1,.567,1.433,2.125,2.125,0,0,1-.632,1.459L10.3,38.487-4.436,42.27ZM23.387,9.839h0L3.162,30.064-.327,38.621l9.154-2.892L29.052,15.5,23.387,9.839Z" transform="translate(5.102 6.536)"/><path d="M28.7,19.1a1.987,1.987,0,0,1-1.414-.586l-7.071-7.071a2,2,0,0,1,0-2.828l6.368-6.368a2,2,0,0,1,2.829,0l7.071,7.071a2,2,0,0,1,0,2.828L30.116,18.51A1.987,1.987,0,0,1,28.7,19.1ZM27.995,5.067h0l-4.95,4.95,5.666,5.665,4.95-4.949L27.995,5.067Z" transform="translate(12.102 -0.464)"/></g></svg>
            <div class = "footer_item_text">
                ` + getLanguage("sidebar_workspace_part_details") + `
            </div>
            <div class = "footer_item_line"></div>
        </div>
        <div id = "footer_item_workspace_part_comments" onclick = "loadWorkspace_part_comments(` + data + `);" class = "footer_item md-ripples">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M40.707,46.427h0a3.976,3.976,0,0,1-2.333-1.044c-3.13-2.487-11.917-9.316-12-9.383H5a5.006,5.006,0,0,1-5-5V5A5.006,5.006,0,0,1,5,0H45a5.006,5.006,0,0,1,5,5V31a5.005,5.005,0,0,1-5,5H42.466v9.106A2,2,0,0,1,40.707,46.427ZM4.906,3A1.985,1.985,0,0,0,3.016,4.9L2.984,31.027c0,.019.129,1.891,1.859,1.953H27.391l12.078,9.453V32.98h5.688A2.03,2.03,0,0,0,47,31l-.015-26.25c0-.017-.282-1.672-1.8-1.718Z" transform="translate(0 1.786)"></path></g></svg>
            <div class = "footer_item_text">
                ` + getLanguage("sidebar_workspace_part_comments") + `
            </div>
            <div class = "footer_item_line"></div>
        </div>
        <div id = "footer_item_workspace_part_localization" onclick = "loadWorkspace_part_localization(` + data + `);" class = "footer_item md-ripples">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(0 -10)"><rect width="3" height="39" rx="1.5" transform="translate(13.339 12.326) rotate(20)"></rect><rect width="3" height="39" rx="1.5" transform="translate(12.35 13.352) rotate(-20)"></rect><rect width="3" height="15.5" rx="1.5" transform="translate(22.179 33.413) rotate(90)"></rect></g><g transform="translate(4.821 6)"><rect width="3" height="23.5" rx="1.5" transform="translate(45.179 15.413) rotate(90)"></rect><rect width="3" height="6.299" rx="1.5" transform="translate(34.929 17.589) rotate(180)"></rect><path d="M6.258-1.278A1.576,1.576,0,0,1,7.282.152s-3.4,8.118-4.351,14.5A42.123,42.123,0,0,0,3,26.749a1.5,1.5,0,0,1-3,0A46.581,46.581,0,0,1,.157,14.4C1.163,7.87,4.524-.436,4.524-.436A1.37,1.37,0,0,1,6.258-1.278Z" transform="translate(30.054 41.378) rotate(-150)"></path><path d="M-4.084.024A1.4,1.4,0,0,1-2.138.58,46.577,46.577,0,0,1,2.6,12.127a40.794,40.794,0,0,1,.4,11.8,1.5,1.5,0,0,1-3,0,25.612,25.612,0,0,0,0-10.38A49.119,49.119,0,0,0-4.77,1.8,1.48,1.48,0,0,1-4.084.024Z" transform="translate(39.585 41.423) rotate(150)"></path></g></g></svg>
            <div class = "footer_item_text">
                ` + getLanguage("sidebar_workspace_part_localization") + `
            </div>
            <div class = "footer_item_line"></div>
        </div>
        <div id = "footer_item_workspace_part_user_translation" onclick = "loadWorkspace_part_user_translation(` + data + `);" class = "footer_item md-ripples">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(0 -10)"><rect width="3" height="39" rx="1.5" transform="translate(13.339 12.326) rotate(20)"></rect><rect width="3" height="39" rx="1.5" transform="translate(12.35 13.352) rotate(-20)"></rect><rect width="3" height="15.5" rx="1.5" transform="translate(22.179 33.413) rotate(90)"></rect></g><g transform="translate(4.821 6)"><rect width="3" height="23.5" rx="1.5" transform="translate(45.179 15.413) rotate(90)"></rect><rect width="3" height="6.299" rx="1.5" transform="translate(34.929 17.589) rotate(180)"></rect><path d="M6.258-1.278A1.576,1.576,0,0,1,7.282.152s-3.4,8.118-4.351,14.5A42.123,42.123,0,0,0,3,26.749a1.5,1.5,0,0,1-3,0A46.581,46.581,0,0,1,.157,14.4C1.163,7.87,4.524-.436,4.524-.436A1.37,1.37,0,0,1,6.258-1.278Z" transform="translate(30.054 41.378) rotate(-150)"></path><path d="M-4.084.024A1.4,1.4,0,0,1-2.138.58,46.577,46.577,0,0,1,2.6,12.127a40.794,40.794,0,0,1,.4,11.8,1.5,1.5,0,0,1-3,0,25.612,25.612,0,0,0,0-10.38A49.119,49.119,0,0,0-4.77,1.8,1.48,1.48,0,0,1-4.084.024Z" transform="translate(39.585 41.423) rotate(150)"></path></g></g></svg>
            <div class = "footer_item_text">
                ` + getLanguage("sidebar_workspace_part_user_translation") + `
            </div>
            <div class = "footer_item_line"></div>
        </div>
    `;
}