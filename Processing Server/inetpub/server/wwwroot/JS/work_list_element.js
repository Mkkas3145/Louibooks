

function getHtmlWorkList(info) {
    let html = '';

    if (info["status"] == 0) {
        let thumbnail = '';
        if (info['thumbnail_image'] != null && info['thumbnail_image'] != undefined) {
            thumbnail = `
                <div class = "img_wrap">
                    <img src = "` + info["thumbnail_image"] + `" onload = "imageLoad(event);" alt = "">
                </div>
                <div class = "work_list_left_bottom">
                    <div class = "work_list_left_bottom_box">
                        <div class = "work_list_left_bottom_box_count">
                            ` + info["count"] + `
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="37" height="3" rx="1.5" transform="translate(1 2)"></rect><rect width="37" height="3" rx="1.5" transform="translate(1 18)"></rect><rect width="20" height="3" rx="1.5" transform="translate(1 34)"></rect><g transform="translate(2.518 0.541)"><rect width="3" height="17" rx="1.5" transform="translate(23.151 35.438) rotate(-45)"></rect><rect width="3" height="23" rx="1.5" transform="translate(44.884 26.041) rotate(30)"></rect></g></g></svg>
                    </div>
                </div>
            `;
        } else {
            thumbnail = `
                <div class = "work_list_left_no_thumbnail">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M9 1c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM3 9c0-1.294 0.416-2.491 1.116-3.472l8.356 8.356c-0.981 0.7-2.178 1.116-3.472 1.116-3.309 0-6-2.691-6-6zM13.884 12.472l-8.356-8.356c0.981-0.7 2.178-1.116 3.472-1.116 3.309 0 6 2.691 6 6 0 1.294-0.416 2.491-1.116 3.472z"></path></svg>
                    <div class = "work_list_left_no_thumbnail_title">
                        ` + getLanguage("work_list_thumbnail") + `
                    </div>
                </div>
            `;
        }

        let public_status_icon = '';
        if (info["public_status"] == 0) {
            public_status_icon = `
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 12h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v7c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-7c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM8 10v-3c-0.001-1.106 0.445-2.105 1.169-2.831 0.723-0.724 1.719-1.172 2.821-1.174 1.030 0.003 1.948 0.378 2.652 1 0.638 0.565 1.097 1.332 1.28 2.209 0.113 0.541 0.642 0.888 1.183 0.775s0.888-0.642 0.775-1.183c-0.272-1.307-0.958-2.454-1.912-3.299-1.060-0.938-2.452-1.504-3.973-1.502-1.657 0.002-3.157 0.676-4.241 1.762s-1.756 2.587-1.754 4.243v3h-1c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v7c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-7c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879z"></path></svg>
            `;
        } else if (info["public_status"] == 1) {
            public_status_icon = `
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15 8h3c1.105 0 2.103 0.447 2.828 1.172s1.172 1.723 1.172 2.828-0.447 2.103-1.172 2.828-1.723 1.172-2.828 1.172h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1h3c1.657 0 3.158-0.673 4.243-1.757s1.757-2.586 1.757-4.243-0.673-3.158-1.757-4.243-2.586-1.757-4.243-1.757h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1zM9 16h-3c-1.105 0-2.103-0.447-2.828-1.172s-1.172-1.723-1.172-2.828 0.447-2.103 1.172-2.828 1.723-1.172 2.828-1.172h3c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3c-1.657 0-3.158 0.673-4.243 1.757s-1.757 2.586-1.757 4.243 0.673 3.158 1.757 4.243 2.586 1.757 4.243 1.757h3c0.552 0 1-0.448 1-1s-0.448-1-1-1zM8 13h8c0.552 0 1-0.448 1-1s-0.448-1-1-1h-8c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path></svg>
            `;
        } else if (info["public_status"] == 2) {
            public_status_icon = `
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 12h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v7c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-7c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM18 10v-3c0-1.657-0.673-3.158-1.757-4.243s-2.586-1.757-4.243-1.757-3.158 0.673-4.243 1.757-1.757 2.586-1.757 4.243v3h-1c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v7c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-7c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM8 10v-3c0-1.105 0.447-2.103 1.172-2.828s1.723-1.172 2.828-1.172 2.103 0.447 2.828 1.172 1.172 1.723 1.172 2.828v3z"></path></svg>
            `;
        }
    
        html = `
            <div class = "work_list md-ripples" onclick = "loadMenu_work_list(` + info["number"] + `);">
                <div class = "work_list_left">
                    ` + thumbnail + `
                </div>
                <div class = "work_list_right">
                    <div class = "work_list_right_top">
                        <div class = "work_list_right_title">
                            ` + info["title"] + `
                        </div>
                        <div class = "work_list_right_updated_date">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,50A25.007,25.007,0,0,1,15.269,1.965,25.007,25.007,0,0,1,34.731,48.036,24.843,24.843,0,0,1,25,50ZM25,3A22,22,0,1,0,47,25,22.025,22.025,0,0,0,25,3Z"></path><g transform="translate(0 1)"><rect width="3" height="21" rx="1.5" transform="translate(23 6)"></rect><rect width="3" height="21" rx="1.5" transform="translate(44 24) rotate(90)"></rect></g></g></svg>
                            ` + getLanguage("work_list_updated_date").replaceAll("{R:0}", getTimePast(new Date(info["updated_date"]))) + `
                        </div>
                        <div class = "work_list_right_public_status">
                            ` + public_status_icon + `
                            ` + getLanguage("public_status:" + info["public_status"]) + `
                        </div>
                    </div>
                    <div class = "work_list_right_bottom">
                        <div class = "work_list_right_user_info">
                            <div class = "work_list_right_user_info_profile">
                                <div class = "profile_element">
                                    <div class="profile_info">` + JSON.stringify(info["profile"]) + `</div>
                                    <div class="profile_image"></div>
                                </div>
                            </div>
                            <div class = "work_list_right_user_info_nickname">
                                ` + info["nickname"] + `
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (info["status"] == 1) {
        html = `
            <div class = "work_list md-ripples" onclick = "loadMenu_work_list(` + info["number"] + `);">
                <div class = "work_list_left work_list_left_wrap">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 12h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v7c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-7c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM18 10v-3c0-1.657-0.673-3.158-1.757-4.243s-2.586-1.757-4.243-1.757-3.158 0.673-4.243 1.757-1.757 2.586-1.757 4.243v3h-1c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v7c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-7c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM8 10v-3c0-1.105 0.447-2.103 1.172-2.828s1.723-1.172 2.828-1.172 2.103 0.447 2.828 1.172 1.172 1.723 1.172 2.828v3z"></path></svg>
                </div>
                <div class = "work_list_right">
                    <div class = "work_list_right_title">
                        ` + getLanguage("work_list_title_no_permission") + `
                    </div>
                </div>
            </div>
        `;
    } else if (info["status"] == 2) {
        html = `
            <div class = "work_list md-ripples" onclick = "loadMenu_work_list(` + info["number"] + `);">
                <div class = "work_list_left work_list_left_wrap">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M9 1c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM3 9c0-1.294 0.416-2.491 1.116-3.472l8.356 8.356c-0.981 0.7-2.178 1.116-3.472 1.116-3.309 0-6-2.691-6-6zM13.884 12.472l-8.356-8.356c0.981-0.7 2.178-1.116 3.472-1.116 3.309 0 6 2.691 6 6 0 1.294-0.416 2.491-1.116 3.472z"></path></svg>
                </div>
                <div class = "work_list_right">
                    <div class = "work_list_right_title">
                        ` + getLanguage("work_list_title_deleted") + `
                    </div>
                </div>
            </div>
        `;
    }


    return html;
}

function workListReSizing() {
    let menuNumber = getCurrentMenuNumber();
    if (menuNumber != null && isNaN(menuNumber) == false) {
        let contents = document.getElementById("contents_" + menuNumber);
        let el = contents.getElementsByClassName("work_list_resizing");
        
        for (let i = 0; i < el.length; i++) {
            let elRect = el[i].getBoundingClientRect();
            
            let isChildNotSetWidth = false;
            let children = el[i].children;
            let childWidth = (children.length != 0) ? children[children.length - 1].style.width : null;
            if (childWidth == null || childWidth == "") {
                isChildNotSetWidth = true;
            }

            let width = elRect.width;
            let previousWidth = el[i].getAttribute("width");
            if (isChildNotSetWidth == true || previousWidth == null || width != previousWidth) {
                if (width >= 0 && width < 800) {
                    workListReSizing_setChildren(el[i], 100);
                }
                if (width >= 800 && width < 1200) {
                    workListReSizing_setChildren(el[i], 50);
                }
                if (width >= 1200 && width < 1550) {
                    workListReSizing_setChildren(el[i], 33.3);
                }
                if (width >= 1550) {
                    workListReSizing_setChildren(el[i], 25);
                }
                el[i].setAttribute("width", width);
            }
        }
    }
}
function workListReSizing_setChildren(el, width) {
    let children = el.children;
    let length = children.length;
    for (let i = 0; i < length; i++) {
        let styleWidth = (width + "%");
        (children[i].style.width != styleWidth) ? children[i].style.width = styleWidth : null;
    }
}

window.addEventListener("resize", workListReSizing);
window.addEventListener("focus", workListReSizing);
window.addEventListener("documentElementUpdated", workListReSizing);