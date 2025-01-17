



function getHtmlWork(info, visitType) {
    let html = '';
    if (info["status"] == 0) {
        let coverNeedAttention = "";
        if (info["user_age"] == 1) {
            coverNeedAttention = `
                <div class = "work_left_absolute_top_need_attention" onmouseenter = "hoverInformation(this, getLanguage('work_element_need_attention_hover'));">
                    15
                </div>
            `;
        }
        let coverAdult = "";
        if (info["user_age"] == 2) {
            coverAdult = `
                <div class = "work_left_absolute_top_adult" onmouseenter = "hoverInformation(this, getLanguage('work_element_adult_hover'));">
                    ` + getLanguage("adult_age") + `
                </div>
            `;
        }

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
        let coverWorkType = `
            <div class = "work_left_absolute_top_work_type" onmouseenter = "hoverInformation(this, getLanguage('work_settings_contents_type:` + info["contents_type"] + `'));">
                ` + coverWorkTypeSVG + `
            </div>
        `;

        let coverWorkListSaved = `
            <div class = "work_left_absolute_top_work_list_saved" style = "display: none;" onmouseenter = "hoverInformation(this, getLanguage('work_element_work_list_saved'));">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="37" height="3" rx="1.5" transform="translate(1 2)"></rect><rect width="37" height="3" rx="1.5" transform="translate(1 18)"></rect><rect width="20" height="3" rx="1.5" transform="translate(1 34)"></rect><g transform="translate(2.518 0.541)"><rect width="3" height="17" rx="1.5" transform="translate(23.151 35.438) rotate(-45)"></rect><rect width="3" height="23" rx="1.5" transform="translate(44.884 26.041) rotate(30)"></rect></g></g></svg>
            </div>
        `;

        //파트너인지
        let partner = "";
        if (info["originator"]["partner"] == 2) {
            partner = `
                <div class = "work_left_absolute_top_partner" onmouseenter = "hoverInformation(this, getLanguage('work_element_partner_plus_hover'));">
                    ` + getSVGLouibooksLogo(4) + `
                </div>
            `;
        } else if (info["originator"]["partner"] == 1) {
            partner = `
                <div class = "work_left_absolute_top_partner" onmouseenter = "hoverInformation(this, getLanguage('work_element_partner_hover'));">
                    ` + getSVGLouibooksLogo(3) + `
                </div>
            `;
        }

        //거주하는 나라가 한국이면서 성인 작품이면 표지를 흐림 처리함
        let imgStyle = "";
        if (info["disable_adult"] != null && info["disable_adult"] == true) {
            imgStyle = "width: calc(100% + 10px); height: calc(100% + 10px); position: relative; top: -5; right: 5; filter: blur(5px);";
        }

        html = `
            <div class = "work md-ripples" onmouseenter = "checkHoverWorkElement(this, ` + info["number"] + `);" onclick = "loadMenu_work('` + info["number"] + `', ` + visitType + `);">
                <div class = "work_left img_wrap">
                    <img style = "` + imgStyle + `" src = "` + info["cover_image"] + `" onload = "imageLoad(event);" alt = "">
                </div>
                <div class = "work_left_absolute">
                    <div class = "work_left_absolute_top">
                        ` + partner + `
                        ` + coverNeedAttention + `
                        ` + coverAdult + `
                        ` + coverWorkType + `
                        ` + coverWorkListSaved + `
                    </div>
                </div>
                <div class = "work_right">
                    <div class = "work_right_top" ontouchstart = "touchWorkElementHoverDescription();" onmouseenter = "workElementHoverDescription(this, '` + info["genre"] + `');">
                        <div class = "work_right_title">
                            ` + info["title"] + `
                        </div>
                        <div class = "work_right_info">
                            ` + getLanguage("work_round").replaceAll("{R:0}", commas(info["part"])) + ` · ` + getViewsNumberUnit(info["views"]) + `
                        </div>
                        <div class = "work_right_other">
                            <div class = "work_right_other_type">
                                ` + coverWorkTypeSVG + `
                                ` + getLanguage('work_settings_contents_type:' + info["contents_type"]) + `
                            </div>
                            <div class = "work_right_other_ratings">
                                ★ ` + info["ratings"]["averageScore"].toFixed(1) + `
                            </div>
                        </div>
                        <div class = "work_right_description" style = "display: none;">` + info["description"] + `</div>
                    </div>
                    <div class = "work_right_bottom">
                        <div class = "work_right_user_info">
                            <div class = "work_right_user_info_profile">
                                <div class = "profile_element">
                                    <div class = "profile_info">` + JSON.stringify(info["originator"]["profile"]) + `</div>
                                    <div class = "profile_image"></div>
                                </div>
                            </div>
                            <div class = "work_right_user_info_nickname">
                                ` + info["originator"]["nickname"] + `
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (info["status"] == 1) {
        html = `
            <div class = "work md-ripples" onclick = "loadMenu_work(` + info["number"] + `);">
                <div class = "work_left work_left_wrap">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 12h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v7c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-7c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM18 10v-3c0-1.657-0.673-3.158-1.757-4.243s-2.586-1.757-4.243-1.757-3.158 0.673-4.243 1.757-1.757 2.586-1.757 4.243v3h-1c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v7c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-7c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM8 10v-3c0-1.105 0.447-2.103 1.172-2.828s1.723-1.172 2.828-1.172 2.103 0.447 2.828 1.172 1.172 1.723 1.172 2.828v3z"></path></svg>
                </div>
                <div class = "work_right">
                    <div class = "work_right_title">
                        ` + getLanguage("work_title_no_permission") + `
                    </div>
                </div>
            </div>
        `;
    } else if (info["status"] == 2) {
        html = `
            <div class = "work md-ripples" onclick = "loadMenu_work(` + info["number"] + `);">
                <div class = "work_left work_left_wrap">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M9 1c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM3 9c0-1.294 0.416-2.491 1.116-3.472l8.356 8.356c-0.981 0.7-2.178 1.116-3.472 1.116-3.309 0-6-2.691-6-6zM13.884 12.472l-8.356-8.356c0.981-0.7 2.178-1.116 3.472-1.116 3.309 0 6 2.691 6 6 0 1.294-0.416 2.491-1.116 3.472z"></path></svg>
                </div>
                <div class = "work_right">
                    <div class = "work_right_title">
                        ` + getLanguage("work_title_deleted") + `
                    </div>
                </div>
            </div>
        `;
    }

    return html;
}
function checkHoverWorkElement(el, workNumber) {
    let coverWorkListSaved = el.getElementsByClassName("work_left_absolute_top_work_list_saved")[0];
    if (isExistWorkMyWorkList(workNumber) == true) {
        coverWorkListSaved.style.display = null;
    } else {
        coverWorkListSaved.style.display = "none";
    }
}

function touchWorkElementHoverDescription() {
    isTouchWorkElementHoverDescription = true;
    
    function end() {
        let frameCount = 0;
        function frame() {
            if (frameCount < 3) {
                frameCount ++;
                window.requestAnimationFrame(frame);
            } else {
                isTouchWorkElementHoverDescription = false;
            }
        }
        window.requestAnimationFrame(frame);
        
        document.removeEventListener("touchend", end);
        document.removeEventListener("touchcancel", end);
    }

    document.addEventListener("touchend", end);
    document.addEventListener("touchcancel", end);
}

var isTouchWorkElementHoverDescription = false;
function workElementHoverDescription(el, genre) {
    function callback() {
        if (isTouchWorkElementHoverDescription == false) {
            let description = el.getElementsByClassName("work_right_description")[0].innerText;
            genre = genre.split(",");
        
            let genreItems = "";
            for (let i = 0; i < genre.length; i++) {
                genreItems += `
                    <div class = "work_element_hover_description_genre_item">
                        ` + getLanguage("genre:" + genre[i]) + `
                    </div>
                `;
            }
        
            let html = `
                <div class = "work_element_hover_description_title">
                    ` + getLanguage("work_settings_description") + `
                </div>
                <div class = "work_element_hover_description_text">
                    ` + description.replaceAll("\n", "<br />") + `
                </div>
                <div class = "work_element_hover_description_line"></div>
                <div class = "work_element_hover_description_title">
                    ` + getLanguage("work_settings_genre") + `
                </div>
                <div class = "work_element_hover_description_genre">
                    ` + genreItems + 
                `</div>
            `;
        
            hoverHelp(el, html.trim().replaceAll("\n", ""));
        }
    }
    window.requestAnimationFrame(callback);
}

function workReSizing() {
    let menuNumber = getCurrentMenuNumber();
    if (menuNumber != null && isNaN(menuNumber) == false) {
        let contents = document.getElementById("contents_" + menuNumber);
        let el = contents.getElementsByClassName("work_resizing");
        
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
                    workReSizing_setChildren(el[i], 100);
                }
                if (width >= 800 && width < 1200) {
                    workReSizing_setChildren(el[i], 50);
                }
                if (width >= 1200 && width < 1600) {
                    workReSizing_setChildren(el[i], 33.3);
                }
                if (width >= 1600) {
                    workReSizing_setChildren(el[i], 25);
                }
                el[i].setAttribute("width", width);
            }
        }
    }
}
function workReSizing_setChildren(el, width) {
    let children = el.children;
    let length = children.length;
    for (let i = 0; i < length; i++) {
        let styleWidth = (width + "%");
        (children[i].style.width != styleWidth) ? children[i].style.width = styleWidth : null;
    }
}

window.addEventListener("resize", workReSizing);
window.addEventListener("focus", workReSizing);
window.addEventListener("documentElementUpdated", workReSizing);



function getMoreItemsWorkElement(workNumber) {
    let slot = new Array();

    if (isExistWorkMyWorkList(workNumber)) {
        slot[slot.length] = {
            'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="37" height="3" rx="1.5" transform="translate(1 2)"></rect><rect width="37" height="3" rx="1.5" transform="translate(1 18)"></rect><rect width="20" height="3" rx="1.5" transform="translate(1 34)"></rect><g transform="translate(1 -1)"><g transform="translate(-0.075 1.515)"><rect width="3.678" height="23.098" rx="1.839" transform="translate(25.075 36.713) rotate(-90)"></rect></g><g transform="translate(71.018 -0.075) rotate(90)"><rect width="3.434" height="23.098" rx="1.717" transform="translate(25.075 36.469) rotate(-90)"></rect></g></g></g></svg>',
            'title': getLanguage("work_more_items:0"),
            'onclick': 'popupWorkList(this, ' + workNumber + ');',
        };
    } else {
        slot[slot.length] = {
            'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="37" height="3" rx="1.5" transform="translate(1 2)"></rect><rect width="37" height="3" rx="1.5" transform="translate(1 18)"></rect><rect width="20" height="3" rx="1.5" transform="translate(1 34)"></rect><g transform="translate(2.518 0.541)"><rect width="3" height="17" rx="1.5" transform="translate(23.151 35.438) rotate(-45)"></rect><rect width="3" height="23" rx="1.5" transform="translate(44.884 26.041) rotate(30)"></rect></g></g></svg>',
            'title': getLanguage("work_more_items:0"),
            'onclick': 'popupWorkList(this, ' + workNumber + ');',
        };
    }
    slot[slot.length] = {
        'icon': '<!-- Generated by IcoMoon.io --><svg style="transform: scale(1.2);" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 9.984l3.984 4.031h-3v6h-1.969v-6h-3zM18.984 3.984q0.844 0 1.43 0.586t0.586 1.43v12q0 0.797-0.609 1.406t-1.406 0.609h-3.984v-2.016h3.984v-9.984h-13.969v9.984h3.984v2.016h-3.984q-0.844 0-1.43-0.586t-0.586-1.43v-12q0-0.844 0.586-1.43t1.43-0.586h13.969z"></path></svg>',
        'title': getLanguage("work_more_items:1"),
        'onclick': 'window.open(\'/work/' + workNumber + '\');',
    };
    
    return slot;
}

function workMoreItems(event, workNumber) {
    let slot = new Array();

    let items = getMoreItemsWorkElement(workNumber);
    for (let i = 0; i < items.length; i++) {
        slot[slot.length] = items[i];
    }

    moreButton(null, slot, event);
}