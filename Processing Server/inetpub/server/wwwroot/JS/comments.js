


/* property 속성들

hideAddComments = 최상단 댓글 추가 박스 숨기기
prefix = 댓글의 접두사 uid, content

*/

function registerComments(el, uid, info, property) {
    function callback() {
        if (loginStatus != null) {
            createComments(el, uid, info, property);
        } else {
            window.requestAnimationFrame(callback);
        }
    }
    window.requestAnimationFrame(callback);
}

function createComments(el, uid, info, property) {
    (property == null) ? property = new Array() : null;
    var uniqueNumber = Math.floor(Math.random() * 999999999999);

    let newEl = document.createElement("div");
    newEl.classList.add("comments_box");
    newEl.setAttribute("unique_number", uniqueNumber);
    newEl.setAttribute("uid", uid);
    newEl.setAttribute("comments_numbers", info["numbers"]);
    if (property["prefix"] != null) {
        newEl.setAttribute("prefix", JSON.stringify(property["prefix"]));
    }
    if (property["originatorNumber"] != null) {
        newEl.setAttribute("originator_number", property["originatorNumber"]);
    }
    if (property["preferentiallyCommentNumber"] != null) {
        newEl.setAttribute("preferentially_comment_number", property["preferentiallyCommentNumber"]);
    }
    if (property["highlightedCommentNumber"] != null) {
        newEl.setAttribute("highlighted_comment_number", property["highlightedCommentNumber"]);
    }
    let box = el.appendChild(newEl);

    let commentsCount = 0;
    if (info["numbers"] != null && info["numbers"] != '') {
        commentsCount = info["numbers"].split(",").length;
    }

    let sort = 0;
    if (property["sort"] != null && isNaN(property["sort"]) == false) {
        sort = property["sort"];
    }

    //댓글 개수, 댓글 정렬
    newEl = document.createElement("div");
    newEl.classList.add("comments_box_top");
    newEl.innerHTML = `
        <div class = "comments_box_top_left">
            <div class = "comments_box_top_left_text">
                ` + getLanguage("comments_count").replaceAll("{R:0}", commas(commentsCount)) + `
            </div>
            <div class = "comments_top_sort md-ripples" popupwidth = "max-content" value = "` + sort + `" onchange = "loadComments(getCommentsInfo(this));" onclick = "selectList(this, getCommentsSortItems());">
                <div class = "comments_top_sort_icon">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="50" height="3" rx="1.5" transform="translate(0 7)"/><rect width="16" height="3" rx="1.5" transform="translate(0 41)"/><rect width="33" height="3" rx="1.5" transform="translate(0 24)"/></g></svg>
                </div>
                <div class = "comments_top_sort_title value_title">` + getLanguage("comments_sort:" + sort) + `</div>
            </div>
        </div>
        <div class = "comments_box_top_right">
            <!-- html -->
        </div>
    `;
    box.appendChild(newEl);

    //최상단 댓글 추가 박스
    if (property["hideAddComments"] == null || property["hideAddComments"] == false) {
        //커뮤니티 가이드 지침
        newEl = document.createElement("div");
        newEl.classList.add("follow_our_community_guide");
        newEl.style.marginBottom = "20px";

        let follow_our_title = getLanguage("follow_our_community_guide_comments");
        follow_our_title = follow_our_title.replaceAll("{R:0}", '<span class = "md-ripples" onclick = "loadMenu_community_guide();">' + getLanguage("menu_name:community_guide") + "</span>");
        
        //커뮤니티 자격 없음
        if (loginStatus["community_permission"] == false) {
            follow_our_title = getLanguage("no_community_permission_message");
        }

        newEl.innerHTML = `
            <div class = "follow_our_community_guide_icon">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.070c-1.884-1.821-3.053-4.37-3.053-7.193 0-5.523 4.477-10 10-10 2.823 0 5.372 1.169 7.19 3.050l0.003 0.003c1.737 1.796 2.807 4.247 2.807 6.947 0 5.523-4.477 10-10 10-2.7 0-5.151-1.070-6.95-2.81l0.003 0.003zM9 5v6h2v-6h-2zM9 13v2h2v-2h-2z"></path></svg>
            </div>
            <div class = "follow_our_community_guide_right">
                <div class = "follow_our_community_guide_right_title">
                    ` + follow_our_title + `
                </div>
            </div>
        `;
        box.appendChild(newEl);

        //
        newEl = document.createElement("div");
        let addComments = box.appendChild(newEl);
        createAddComments(addComments);
    }

    //데이터 없음
    let noDataTitle = null;
    if (property["hideAddComments"] == null || property["hideAddComments"] == false) {
        noDataTitle = getLanguage("comments_no_data:0");
    } else {
        noDataTitle = getLanguage("comments_no_data:1");
    }
    newEl = document.createElement("div");
    newEl.classList.add("comments_box_no_data");
    newEl.style.display = "none";
    if (property["hideAddComments"] == null || property["hideAddComments"] == false) {
        newEl.style.marginTop = "20px";
    }
    newEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-3094.635,49.5H-3116.5a3,3,0,0,1-3-3V3.5a3,3,0,0,1,3-3h31a3,3,0,0,1,3,3V37.365L-3094.635,49.5Z" transform="translate(3126)" opacity="0.7"/><path d="M3151.333,49.5l12.293-12.293h-9.846a2.517,2.517,0,0,0-1.983.575,2.884,2.884,0,0,0-.464,2.039Z" transform="translate(-3120)" opacity="0.6"/></g></svg>
        <div class = "comments_box_no_data_title">
            ` + noDataTitle + `
        </div>
        <div class = "comments_box_no_data_description">
            ` + getLanguage("no_data_description") + `
        </div>
    `;
    box.appendChild(newEl);

    //댓글 아이템
    newEl = document.createElement("div");
    newEl.classList.add("comments_box_items");
    let items = box.appendChild(newEl);

    let commentsNumbers = new Array();
    if (info["numbers"] != null) {
        commentsNumbers = info["numbers"].split(",");
    }
    if (info["info"] != null) {
        for (let i = 0; i < info["info"].length; i++) {
            createCommentsItem(items, info["info"][i]);
            commentsNumbers = commentsNumbers.remove("" + info["info"][i]["number"]);
        }
    } else {
        showCommentsNoData(uniqueNumber);
    }
    box.setAttribute("comments_numbers", commentsNumbers.join(","));

    //댓글 무한 스크롤
    newEl = document.createElement("div");
    newEl.classList.add("comments_box_more_load");
    newEl.setAttribute("loading", false);
    newEl.innerHTML = `
        <!-- 로딩 스피너 -->
        <div class="showbox">
            <div class="loader" style="width: 35px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle></svg></div>
        </div>
    `;
    if (commentsNumbers[0] == '' || commentsNumbers[0] == undefined || commentsNumbers[0] == null) {
        newEl.style.display = "none";
    }
    box.appendChild(newEl);
}


function showCommentsNoData(uniqueNumber) {
    let el = null;
    let comments_box = document.getElementsByClassName("comments_box");
    for (let i = 0; i < comments_box.length; i++) {
        if (comments_box[i].getAttribute("unique_number") == uniqueNumber) {
            el = comments_box[i];
        }
    }

    let no_data = el.getElementsByClassName("comments_box_no_data")[0];
    no_data.style.display = null;
}
function hideCommentsNoData(uniqueNumber) {
    let el = null;
    let comments_box = document.getElementsByClassName("comments_box");
    for (let i = 0; i < comments_box.length; i++) {
        if (comments_box[i].getAttribute("unique_number") == uniqueNumber) {
            el = comments_box[i];
        }
    }

    let no_data = el.getElementsByClassName("comments_box_no_data")[0];
    no_data.style.display = "none";
}


//uniqueNumber = 박스의 고유 번호
//commentsNumber = 댓글 번호가 있으면 답글
function createAddComments(el, commentsNumber) {
    if (loginStatus["isLogin"] == true) {
        let newEl = document.createElement("div");
        newEl.classList.add("comments_box_add_comments");
        if (commentsNumber != null) {
            newEl.classList.add("comments_box_add_comments_reply");
        }
    
        let onclick_cancel = "commentsInputDisabled(this);";
        if (commentsNumber != null) {
            onclick_cancel = "commentsInputDelete(this);";
        }

        //
        let itemInfo = getCommentsItemInfo(el);
        let user_reply = '';
        if (itemInfo != null && itemInfo["element"].classList.contains("comments_box_item_reply") && itemInfo["userNumber"] != loginStatus["number"]) {
            let nickname = null;
            let user_number = itemInfo["userNumber"];
            if (itemInfo["element"].classList.contains("comments_box_item_reply") == true) {
                nickname = itemInfo["element"].getElementsByClassName("comments_box_item_right_top_nickname")[0].innerHTML.trim();
            }

            let texts = getLanguage("add_comments_user_reply").replaceAll("{R:0}", "{R:0}{R:0}").split("{R:0}");
            let isNickname = false;
            for (let i = 0; i < texts.length; i++) {
                if (texts[i] != "") {
                    texts[i] = `
                        <div class = "comments_box_add_comments_right_user_reply_text">
                            ` + texts[i] + `
                        </div>
                    `;
                } else if (isNickname == false) {
                    texts[i] = `
                        <div class = "comments_box_add_comments_right_user_reply_nickname">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15 12c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121 0.335-1.577 0.879-2.121 1.292-0.879 2.121-0.879 1.577 0.335 2.121 0.879 0.879 1.292 0.879 2.121zM15.74 15.318c0.13 0.182 0.274 0.353 0.431 0.51 0.723 0.723 1.725 1.172 2.829 1.172s2.106-0.449 2.828-1.172 1.172-1.724 1.172-2.828v-1c0-3.037-1.233-5.789-3.222-7.778s-4.741-3.222-7.779-3.221-5.788 1.232-7.778 3.222-3.221 4.741-3.221 7.778 1.233 5.789 3.222 7.778 4.741 3.222 7.778 3.221c2.525 0 4.855-0.852 6.69-2.269 0.437-0.337 0.518-0.965 0.18-1.403s-0.965-0.518-1.403-0.18c-1.487 1.148-3.377 1.844-5.435 1.852-2.54-0.009-4.776-1.014-6.398-2.636-1.627-1.629-2.634-3.877-2.634-6.363s1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.363v1c0 0.553-0.223 1.051-0.586 1.414s-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414v-5c0-0.552-0.448-1-1-1s-1 0.448-1 1c-0.835-0.627-1.875-1-3-1-1.38 0-2.632 0.561-3.536 1.464s-1.464 2.156-1.464 3.536 0.561 2.632 1.464 3.536 2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464c0.070-0.070 0.139-0.143 0.205-0.217z"></path></svg>
                            <div style = "min-width: calc(100% - 12px); display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; overflow: hidden;">
                                ` + nickname + `
                            </div>
                        </div>
                    `;
                    isNickname = true;
                }
            }
            let text = '';
            for (let i = 0; i < texts.length; i++) {
                text += texts[i];
            }

            user_reply += '<div class = "comments_box_add_comments_right_user_reply md-ripples" onclick = "deleteUserReplyAddComments(this);" user_reply = "' + user_number + '" onmouseenter = "hoverInformation(this, getLanguage(\'delete\'));">';
            user_reply += `
                <div class = "comments_box_add_comments_right_user_reply_icon">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17 21v-2c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464h-7c-1.38 0-2.632 0.561-3.536 1.464s-1.464 2.156-1.464 3.536v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2c0-0.829 0.335-1.577 0.879-2.121s1.292-0.879 2.121-0.879h7c0.829 0 1.577 0.335 2.121 0.879s0.879 1.292 0.879 2.121v2c0 0.552 0.448 1 1 1s1-0.448 1-1zM13.5 7c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464-2.632 0.561-3.536 1.464-1.464 2.156-1.464 3.536 0.561 2.632 1.464 3.536 2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464 1.464-2.156 1.464-3.536zM11.5 7c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121 0.335-1.577 0.879-2.121 1.292-0.879 2.121-0.879 1.577 0.335 2.121 0.879 0.879 1.292 0.879 2.121zM16.293 11.707l2 2c0.391 0.391 1.024 0.391 1.414 0l4-4c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-3.293 3.293-1.293-1.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path></svg>
                </div>
            `;
            user_reply += '<div class = "comments_box_add_comments_right_user_reply_wrap">' + text + '</div>';
            user_reply += '</div>';
        }

        let input_placeholder = null;
        if (commentsNumber == null) {
            input_placeholder = getLanguage("add_comments_input_placeholder:0");
        } else {
            input_placeholder = getLanguage("add_comments_input_placeholder:1");
        }

        newEl.innerHTML = `
            <div class = "comments_box_add_comments_left">
                <div class = "profile_element">
                    <div class = "profile_info">` + JSON.stringify(loginStatus["profile"]) + `</div>
                    <div class = "profile_image"></div>
                </div>
            </div>
            <div class = "comments_box_add_comments_right">
                ` + user_reply + `
                <div class = "comments_box_add_comments_right_nickname">
                    ` + loginStatus["nickname"] + `
                </div>
                <div class = "comments_box_add_comments_right_read_more" onclick = "commentsInputActivate(this);">
                    ` + input_placeholder + `
                </div>
                <div class = "comments_box_add_comments_right_input">
                    <div class = "comments_box_add_comments_right_textbox" contenteditable = "true" placeholder = "` + input_placeholder + `" onkeydown = "textbox_remove_spaces(this); checkCommentsInput(this);" onpaste = "contenteditable_paste(event);" onfocus = "commentsInputFocus(this);" onblur = "commentsInputBlur(this);"></div>
                    <div class = "comments_box_add_comments_right_textbox_line_wrap"></div>
                    <div class = "comments_box_add_comments_right_bottom">
                        <div class = "comments_box_add_comments_right_bottom_left" style = "display: none;">
                            <div class = "comments_box_add_comments_right_bottom_left_item md-ripples" onmouseenter = "hoverInformation(this, getLanguage('add_comments_button_emoticon'));">
                                <!-- Generated by IcoMoon.io -->
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.484q-1.734 0-3.117-0.961t-1.992-2.508h10.219q-0.609 1.547-1.992 2.508t-3.117 0.961zM8.484 11.016q-0.609 0-1.055-0.445t-0.445-1.055 0.445-1.055 1.055-0.445 1.055 0.445 0.445 1.055-0.445 1.055-1.055 0.445zM15.516 11.016q-0.609 0-1.055-0.445t-0.445-1.055 0.445-1.055 1.055-0.445 1.055 0.445 0.445 1.055-0.445 1.055-1.055 0.445zM12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z"></path></svg>
                            </div>
                        </div>
                        <div class = "comments_box_add_comments_right_bottom_right">
                            <div class = "comments_box_add_comments_right_bottom_right_cancel md-ripples" onclick = "` + onclick_cancel + `" onmouseenter = "hoverInformation(this, getLanguage('add_comments_button_cancel'));">
                                <!-- Generated by IcoMoon.io -->
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M9 1c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM3 9c0-1.294 0.416-2.491 1.116-3.472l8.356 8.356c-0.981 0.7-2.178 1.116-3.472 1.116-3.309 0-6-2.691-6-6zM13.884 12.472l-8.356-8.356c0.981-0.7 2.178-1.116 3.472-1.116 3.309 0 6 2.691 6 6 0 1.294-0.416 2.491-1.116 3.472z"></path></svg>
                            </div>
                            <div class = "comments_box_add_comments_right_bottom_right_submit md-ripples" onclick = "submitButtonAddComments(this, ` + commentsNumber + `);" onmouseenter = "hoverInformation(this, getLanguage('add_comments_button_submit:` + ((commentsNumber == null) ? 0 : 1) + `'));">
                                <!-- Generated by IcoMoon.io -->
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.016 21v-6.984l15-2.016-15-2.016v-6.984l21 9z"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 로딩 스피너 -->
            <div class = "comments_box_add_comments_loading_box">
                <div class="showbox">
                    <div class="loader" style="width: 35px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle></svg></div>
                </div>
            </div>
        `;
        if (el.innerHTML.trim() == '') {
            let createdElement = el.appendChild(newEl);

            if (commentsNumber != null) {
                let textbox = createdElement.getElementsByClassName("comments_box_add_comments_right_textbox")[0];
                textbox.focus();
        
                let height = createdElement.clientHeight;
                createdElement.style.height = "0px";
                function callback() {
                    createdElement.style.height = height + "px";
                    setTimeout(() => {
                        createdElement.style.height = null;
                    }, 200);
                }
                window.requestAnimationFrame(callback);

                let reply = el.parentElement.getElementsByClassName("comments_box_item_right_bottom_reply_item");
                reply[0].style.display = "none";
                reply[1].style.display = null;
            }
        } else {
            let cancel = el.getElementsByClassName("comments_box_add_comments_right_bottom_right_cancel")[0];
            cancel.click();
        }
    } else {
        let newEl = document.createElement("div");
        newEl.classList.add("comments_box_add_comments_not_login");
        newEl.classList.add("md-ripples");
        //비로그인 상태
        newEl.innerHTML = `
            <div class = "comments_box_add_comments_not_login_left">
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 14.016q2.531 0 5.273 1.102t2.742 2.883v2.016h-16.031v-2.016q0-1.781 2.742-2.883t5.273-1.102zM12 12q-1.641 0-2.813-1.172t-1.172-2.813 1.172-2.836 2.813-1.195 2.813 1.195 1.172 2.836-1.172 2.813-2.813 1.172z"></path></svg>
            </div>
            <div class = "comments_box_add_comments_right">
                <div class = "comments_box_add_comments_right_read_more" style = "cursor: unset;" onclick = "loadMenu_login();">
                    ` + getLanguage("add_comments_input_placeholder:0") + `
                </div>
            </div>
        `;
        el.appendChild(newEl);
    }
}
function commentsInputActivate(el) {
    if (window.orientation == null || window.orientation == undefined) {
        let parent = el.parentElement;
        checkCommentsInputHeight(parent);
        parent.classList.add('comments_box_add_comments_right_activate');
    
        let textbox = parent.getElementsByClassName("comments_box_add_comments_right_textbox")[0];
        textbox.focus();
    } else {
        createAddCommentsVirtualKeyboard(el);
    }
}
function commentsInputDisabled(el) {
    let parent = el.parentElement.parentElement.parentElement.parentElement;
    checkCommentsInputHeight(parent);
    parent.classList.remove('comments_box_add_comments_right_activate');

    let textbox = parent.getElementsByClassName("comments_box_add_comments_right_textbox")[0];
    textbox.blur();
    textbox.innerText = '';
    checkCommentsInput(textbox);
}
function commentsInputDelete(el) {
    let parent = el.parentElement.parentElement.parentElement.parentElement.parentElement;

    let height = parent.clientHeight;
    parent.style.height = height + "px";
    parent.style.opacity = 0;
    function callback() {
        parent.style.height = "0px";
        setTimeout(() => {
            parent.remove();
        }, 200);
    }
    window.requestAnimationFrame(callback);

    let reply = parent.parentElement.parentElement.getElementsByClassName("comments_box_item_right_bottom_reply_item");
    reply[0].style.display = null;
    reply[1].style.display = "none";
}
function checkCommentsInputHeight(input_box) {
    let height = input_box.clientHeight;
    
    function callback() {
        let afterHeight = input_box.clientHeight;
        input_box.style.height = height + "px";
        function callback2() {
            input_box.style.height = afterHeight + "px";
            setTimeout(() => {
                input_box.style.height = null;
            }, 200);
        }
        window.requestAnimationFrame(callback2);
    }
    window.requestAnimationFrame(callback);
}
function checkCommentsInput(el) {
    setTimeout(() => {
        let parent = el.parentElement;
        let submit = parent.getElementsByClassName('comments_box_add_comments_right_bottom_right_submit')[0];
        if (el.innerText.trim() == "") {
            submit.classList.remove('comments_box_add_comments_right_bottom_right_submit_activate');
        } else {
            submit.classList.add('comments_box_add_comments_right_bottom_right_submit_activate');
        }
    }, 1);
}
function commentsInputFocus(el) {
    let parent = el.parentElement;
    parent.classList.add('comments_box_add_comments_right_textbox_focus');
}
function commentsInputBlur(el) {
    let parent = el.parentElement;
    parent.classList.remove('comments_box_add_comments_right_textbox_focus');
}
function getCommentsInfo(el) {
    let parent = el;   
    while (true) {
        parent = parent.parentElement;
        if (parent != null) {
            let unique_number = parent.getAttribute("unique_number");
            let uid = parent.getAttribute("uid");
            let commentsNumbers = null;
            if (parent.getAttribute("comments_numbers") != null) {
                commentsNumbers = parent.getAttribute("comments_numbers").split(",");
            }
            let prefix = null;
            if (parent.getAttribute("prefix") != null) {
                prefix = JSON.parse(parent.getAttribute("prefix"));
            }
            let originatorNumber = null;
            if (parent.getAttribute("originator_number") != null) {
                originatorNumber = Number.parseInt(parent.getAttribute("originator_number"));
            }
            let preferentiallyCommentNumber = null;
            if (parent.getAttribute("preferentially_comment_number") != null) {
                preferentiallyCommentNumber = Number.parseInt(parent.getAttribute("preferentially_comment_number"));
            }
            let highlightedCommentNumber = null;
            if (parent.getAttribute("highlighted_comment_number") != null) {
                highlightedCommentNumber = Number.parseInt(parent.getAttribute("highlighted_comment_number"));
            }
            if (unique_number != null && uid != null) {
                return {
                    'element': parent,
                    'uniqueNumber': unique_number,
                    'uid': uid,
                    'commentsNumbers': commentsNumbers,
                    'prefix': prefix,
                    'originatorNumber': originatorNumber,
                    'preferentiallyCommentNumber': preferentiallyCommentNumber,
                    'highlightedCommentNumber': highlightedCommentNumber
                };
            }
        } else {
            break;
        }
    }
}
function submitButtonAddComments(el, commentsNumber) {
    let parent = el.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
    loadingAddComments(parent);

    //-- -- -- -- -- 화면에서 보이지 않아도 해당 앨리먼트는 삭제하지 않는다 -- -- -- -- --
    let allowInfo = registerAllowVisibleElement(parent);

    let info = getCommentsInfo(parent);
    let content = parent.getElementsByClassName("comments_box_add_comments_right_textbox")[0].innerText.replaceAll('\n\n','\n').trim();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/comments/upload.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;

                let items = null;
                if (xhrHtml.trim() == "no_community_permission") {
                    //커뮤니티 자격 없음
                    actionMessage(getLanguage("no_community_permission_message"));
                } else if (commentsNumber == null) {
                    items = info["element"].getElementsByClassName("comments_box_items")[0];
                    let commentsInfo = JSON.parse(xhrHtml);
                    setTimeout(() => {
                        createCommentsItem(items, commentsInfo, true, "top");
                    }, 200);

                    actionMessage(getLanguage("comments_upload_message"));
                } else {
                    let info2 = getCommentsItemInfo(parent);

                    //Reply
                    if (info2 != null && info2["element"].classList.contains("comments_box_item_reply")) {
                        info2 = getCommentsItemInfo(info2["element"]);
                    }

                    items = info2["element"].getElementsByClassName("comments_box_item_right_reply_items")[0];
                    let commentsInfo = JSON.parse(xhrHtml);

                    //
                    if (items.getAttribute("reply_numbers") != null && items.getAttribute("reply_numbers") != "null") {
                        let replyNumbers = items.getAttribute("reply_numbers").split(",");
                        if ((replyNumbers[0] != "" && replyNumbers[0] != null) || items.innerHTML == "") {
                            replyNumbers[replyNumbers.length] = commentsInfo["number"];
                            items.setAttribute("reply_numbers", replyNumbers.join(","));
                        } else {
                            setTimeout(() => {
                                createCommentsItem(items, commentsInfo, true, "bottom");
                            }, 200);
                        }
                    } else {
                        //답글 없는 상태에서
                        setTimeout(() => {
                            createCommentsItem(items, commentsInfo, true, "bottom");
                        }, 200);
                    }

                    actionMessage(getLanguage("comments_upload_message"));
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
            loadingCompleteAddComments(parent);
            
            //-- -- -- -- -- 화면에서 보이지 않아도 삭제되지 않는다를 취소한다 -- -- -- -- --
            setTimeout(() => {
                deleteAllowVisibleElement(allowInfo["index"]);
            }, 200);

            let cancel = parent.getElementsByClassName("comments_box_add_comments_right_bottom_right_cancel")[0];
            cancel.click();
        }
    });
    
    var formData = new FormData();
    if (commentsNumber == null) {
        formData.append("uid", info["uid"]);
    }
    formData.append("content", content);
    if (commentsNumber != null) {
        formData.append("reply_number", commentsNumber);
    }
    //유저 답장
    let user_reply = el.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("comments_box_add_comments_right_user_reply");
    if (user_reply.length != 0) {
        user_reply = user_reply[0];
        formData.append("user_reply", user_reply.getAttribute("user_reply"));
    }

    xhr.send(formData);
}
function loadingAddComments(el) {
    let left = el.getElementsByClassName("comments_box_add_comments_left")[0];
    let right = el.getElementsByClassName("comments_box_add_comments_right")[0];
    left.style.opacity = "0.5";
    right.style.opacity = "0.5";

    let loading_box = el.getElementsByClassName("comments_box_add_comments_loading_box")[0];
    loading_box.style.height = (el.clientHeight + "px");
    loading_box.style.width = (el.clientWidth + "px");
    loading_box.style.display = "flex";
}
function loadingCompleteAddComments(el) {
    let left = el.getElementsByClassName("comments_box_add_comments_left")[0];
    let right = el.getElementsByClassName("comments_box_add_comments_right")[0];
    left.style.opacity = null;
    right.style.opacity = null;

    let loading_box = el.getElementsByClassName("comments_box_add_comments_loading_box")[0];
    loading_box.style.height = null;
    loading_box.style.width = null;
    loading_box.style.display = null;
}

function createCommentsItem(el, info, isNew, additional_direction) {
    (additional_direction == null) ? additional_direction = "bottom" : null;

    let newEl = document.createElement("div");
    newEl.classList.add("comments_box_item");
    newEl.classList.add("visible_element");
    newEl.classList.add("variable_element");
    newEl.setAttribute("comments_number", info["number"]);
    newEl.setAttribute("user_number", info["user_number"]);

    if (info["reply_number"] != null) {
        newEl.classList.add("comments_box_item_reply");
    }

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

    let reply = '';
    if (info["reply_number"] == null) {
        if (info["reply_count"] != 0) {
            reply += `
                <div class = "comments_box_item_right_reply_button immutable_element md-ripples" show = "false" onclick = "showReplyButton(this);">
                    <div class = "comments_box_item_right_reply_button_0">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17.418 6.109c0.272-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-7.908 7.83c-0.27 0.268-0.707 0.268-0.979 0l-7.908-7.83c-0.27-0.268-0.27-0.701 0-0.969s0.709-0.268 0.979 0l7.419 7.141 7.418-7.141z"></path></svg>
                        <div class = "comments_box_item_right_reply_button_text">
                            ` + getLanguage("comments_view_replies").replaceAll("{R:0}", getNumberUnit(info["reply_count"])) + `
                        </div>
                    </div>
                    <div class = "comments_box_item_right_reply_button_1">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.582 13.891c-0.272 0.268-0.709 0.268-0.979 0s-0.271-0.701 0-0.969l7.908-7.83c0.27-0.268 0.707-0.268 0.979 0l7.908 7.83c0.27 0.268 0.27 0.701 0 0.969s-0.709 0.268-0.978 0l-7.42-7.141-7.418 7.141z"></path></svg>
                        <div class = "comments_box_item_right_reply_button_text">
                            ` + getLanguage("comments_hide_replies").replaceAll("{R:0}", getNumberUnit(info["reply_count"])) + `
                        </div>
                    </div>
                    <div class = "comments_box_item_right_reply_button_loading">
                        <!-- 로딩 스피너 -->
                        <div class="showbox"><div class="loader" style = "width: 15px; margin: 2.5px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/></svg></div></div>
                    </div>
                </div>
            `;
        }
        if (info["reply_count"] != 0) {
            reply += `
                <div class = "comments_box_item_right_reply_items" reply_numbers = ""></div>
                <div class = "comments_box_item_right_temporary_reply_items"></div>
            `;
        } else {
            reply += `
                <div class = "comments_box_item_right_reply_items" style = "display: block;"></div>
                <div class = "comments_box_item_right_temporary_reply_items"></div>
            `;
        }

        if (info["reply_count"] != 0) {
            reply += `
                <div class = "comments_box_item_right_reply_button immutable_element md-ripples" show = "false" onclick = "moreReplyButton(this);" style = "display: none; margin-top: 5px;">
                    <div class = "comments_box_item_right_reply_button_0">
                        <!-- Generated by IcoMoon.io -->
                        <svg style = "transform: translateY(-2px);" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.984 15l-6 6-1.406-1.406 3.609-3.609h-11.203v-12h2.016v10.031h9.188l-3.609-3.609 1.406-1.406z"></path></svg>
                        <div class = "comments_box_item_right_reply_button_text">
                            ` + getLanguage("comments_more_replies") + `
                        </div>
                    </div>
                    <div class = "comments_box_item_right_reply_button_loading">
                        <!-- 로딩 스피너 -->
                        <div class="showbox"><div class="loader" style="width: 15px; margin: 2.5px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle></svg></div></div>
                    </div>
                </div>
            `;
        }
    }

    let content = '<div class = "comments_box_item_right_content_texts">' + textToURL(info["content"]) + "</div>";
    if (info["user_reply"] != null) {
        content = `
            <div class = "comments_box_item_right_content_user_reply">
                <div class = "comments_box_item_right_content_user_reply_profile">
                    <div class = "profile_element">
                        <div class = "profile_info">` + JSON.stringify(info["user_reply"]["profile"]) + `</div>
                        <div class = "profile_image"></div>
                    </div>
                </div>
                <div class = "comments_box_item_right_content_user_reply_nickname">
                    ` + info["user_reply"]["nickname"] + `
                </div>
            </div>
        ` + content;
    }

    let commentsInfo = getCommentsInfo(el);
    let prefix = '';
    if (info["uid"] != null && commentsInfo["prefix"] != null) {
        let content = '...';
        let prefixInfo = commentsInfo["prefix"];
        for (let i = 0; i < prefixInfo.length; i++) {
            if (prefixInfo[i]["uid"] == info["uid"]) {
                content = prefixInfo[i]["content"];
                break;
            }
        }
        prefix = `
            <div class = "comments_box_item_right_prefix">
                ` + content + `
            </div>
        `;
    }

    let originator = '';
    if (commentsInfo["originatorNumber"] == info["user_number"]) {
        originator = `
            <div class = "comments_box_item_right_top_originator" onmouseenter = "hoverInformation(this, getLanguage('originator'));">
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
            </div>
        `;
    }

    let likesButtonOnClick = 'commentsLikesButton(this);';
    let dislikeButtonOnClick = 'commentsDislikeButton(this);';
    if (loginStatus["isLogin"] == false) {
        likesButtonOnClick = 'loadMenu_login();';
        dislikeButtonOnClick = 'loadMenu_login();';
    }

    //하이라이트 댓글
    let highlightedComment = "";
    if (commentsInfo["highlightedCommentNumber"] == info["number"]) {
        highlightedComment = `
            <div class = "comments_box_item_right_highlighted_comment immutable_element" style = "animation: highlighted_comment_item 1s;">
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7.5 5.578l2.484 1.406-1.406-2.484 1.406-2.484-2.484 1.406-2.484-1.406 1.406 2.484-1.406 2.484zM19.5 15.422l-2.484-1.406 1.406 2.484-1.406 2.484 2.484-1.406 2.484 1.406-1.406-2.484 1.406-2.484zM21.984 2.016l-2.484 1.406-2.484-1.406 1.406 2.484-1.406 2.484 2.484-1.406 2.484 1.406-1.406-2.484zM14.391 7.313q-0.328-0.328-0.727-0.328t-0.727 0.328l-11.625 11.625q-0.328 0.328-0.328 0.727t0.328 0.727l2.297 2.297q0.328 0.328 0.727 0.328t0.727-0.328l11.625-11.625q0.328-0.328 0.328-0.727t-0.328-0.68l-2.297-2.344zM13.359 12.797l-2.156-2.156 2.438-2.438 2.156 2.156-2.438 2.438z"></path></svg>
                <div class = "comments_box_item_right_highlighted_comment_text">
                    ` + getLanguage("highlighted_comment") + `
                </div>
            </div>
        `;
    }

    //댓글 주인인지
    let isCommenter = false;
    if (info["user_number"] == loginStatus["number"]) {
        isCommenter = true;
    }

    newEl.innerHTML = `
        ` + highlightedComment + `
        <div class = "comments_box_item_flex">
            <div class = "comments_box_item_left immutable_element md-ripples" onclick = "loadMenu_user(` + info["user_number"] + `);">
                <div class = "profile_element">
                    <div class = "profile_info">` + JSON.stringify(info["profile"]) + `</div>
                    <div class = "profile_image"></div>
                </div>
            </div>
            <div class = "comments_box_item_right">
                <div class = "comments_box_item_right_top immutable_element">
                    ` + originator + `
                    <div class = "comments_box_item_right_top_nickname md-ripples" onclick = "loadMenu_user(` + info["user_number"] + `);">
                        ` + info["nickname"] + `
                    </div>
                    <div class = "comments_box_item_right_top_date">
                        · ` + getTimePast(new Date(info["upload_date"])) + `
                    </div>
                    <div class = "comments_box_item_right_top_more_button md-ripples" onclick = "moreButtonCommentsItem(this, ` + info["number"] + `, ` + isCommenter + `);">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-1 -1.061)"><circle cx="3" cy="3" r="3" transform="translate(23 4)"></circle><path d="M3,0A2.971,2.971,0,0,1,6,2.942,2.971,2.971,0,0,1,3,5.884,2.971,2.971,0,0,1,0,2.942,2.971,2.971,0,0,1,3,0Z" transform="translate(23 23)"></path><path d="M3,0A3.031,3.031,0,0,1,6,3.061,3.031,3.031,0,0,1,3,6.121,3.031,3.031,0,0,1,0,3.061,3.031,3.031,0,0,1,3,0Z" transform="translate(23 42)"></path></g></g></svg>
                    </div>
                </div>
                <div class = "comments_box_item_right_content">` + content + `</div>
                ` + prefix + `
                <div class = "comments_box_item_right_bottom immutable_element">
                    <div class = "comments_box_item_right_bottom_item md-ripples" onclick = "` + likesButtonOnClick + `" onmouseenter = "hoverInformation(this, getLanguage('likes'));">
                        <div style = "display: ` + likesDisplay0 + `; align-items: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,25H2a2,2,0,0,1-2-2V2A2,2,0,0,1,2,0h9a2,2,0,0,1,2,2V23A2,2,0,0,1,11,25ZM3,3V22h7V3Z" transform="translate(0 22)"/><path d="M29.891,44.45H1.733a1.868,1.868,0,0,1-1.224-.511A1.982,1.982,0,0,1,0,42.469c.016-1.947,0-21.23,0-22.05L14.682,2.173A7.441,7.441,0,0,1,19.5,0a5.453,5.453,0,0,1,2.441.588,4.405,4.405,0,0,1,2.637,3.769,5.912,5.912,0,0,1-.314,2.3c-.053.119-5.339,11.957-5.81,13.943H32.295a2.518,2.518,0,0,1,1.149.888,6.6,6.6,0,0,1,1.07,4.314A50.508,50.508,0,0,1,32.532,36.58l-2.641,7.869ZM19.7,2.931a4.877,4.877,0,0,0-2.353.816c-.917.543-14.2,17.567-14.332,17.739V41.439h24.8c2.66-7.819,3.451-12.257,3.647-14.6.212-2.54-.21-3.242-.215-3.249H14.125c.851-3,3.968-10.2,5.831-14.5.534-1.234.955-2.205,1.172-2.732.94-2.283.323-2.792-.652-3.262A1.764,1.764,0,0,0,19.7,2.931Z" transform="translate(14.814 2.158)"/></g></svg>
                            <div class = "comments_box_item_right_bottom_item_text">
                                ` + getNumberUnit(likes) + `
                            </div>
                        </div>
                        <div style = "display: ` + likesDisplay1 + `; align-items: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="13" height="25" rx="2" transform="translate(0 22)"/><rect width="7" height="19" transform="translate(3 25)"/><path d="M14.814,22.577,29.5,4.331S32.823.792,36.758,2.746,39.081,8.82,39.081,8.82s-5.334,11.936-5.809,13.943H47.109s2.324.634,2.218,5.2a50.274,50.274,0,0,1-1.98,10.774l-2.641,7.869H16.546a1.769,1.769,0,0,1-1.732-1.98C14.83,42.636,14.814,22.577,14.814,22.577Z"/><path d="M17.834,23.644S31.239,6.454,32.165,5.9s2.2-1.1,3.124-.652,1.613.927.652,3.261-5.9,13.354-7,17.233h17.13s1.716,2.712-3.433,17.851h-24.8Z"/></g></svg>
                            <div class = "comments_box_item_right_bottom_item_text">
                                ` + getNumberUnit(likes + 1) + `
                            </div>
                        </div>
                    </div>
                    <div class = "comments_box_item_right_bottom_item md-ripples" onclick = "` + dislikeButtonOnClick + `" onmouseenter = "hoverInformation(this, getLanguage('dislike'));">
                        <div style = "display: ` + dislikeDisplay0 + `; align-items: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,25H2a2,2,0,0,1-2-2V2A2,2,0,0,1,2,0h9a2,2,0,0,1,2,2V23A2,2,0,0,1,11,25ZM3,3V22h7V3Z" transform="translate(49.33 27.158) rotate(180)"/><path d="M29.891,44.45H1.733a1.868,1.868,0,0,1-1.224-.511A1.982,1.982,0,0,1,0,42.469c.016-1.947,0-21.23,0-22.05L14.682,2.173A7.441,7.441,0,0,1,19.5,0a5.453,5.453,0,0,1,2.441.588,4.405,4.405,0,0,1,2.637,3.769,5.912,5.912,0,0,1-.314,2.3c-.053.119-5.339,11.957-5.81,13.943H32.295a2.518,2.518,0,0,1,1.149.888,6.6,6.6,0,0,1,1.07,4.314A50.508,50.508,0,0,1,32.532,36.58l-2.641,7.869ZM19.7,2.931a4.877,4.877,0,0,0-2.353.816c-.917.543-14.2,17.567-14.332,17.739V41.439h24.8c2.66-7.819,3.451-12.257,3.647-14.6.212-2.54-.21-3.242-.215-3.249H14.125c.851-3,3.968-10.2,5.831-14.5.534-1.234.955-2.205,1.172-2.732.94-2.283.323-2.792-.652-3.262A1.764,1.764,0,0,0,19.7,2.931Z" transform="translate(34.517 47) rotate(180)"/></g></svg>
                            <div class = "comments_box_item_right_bottom_item_text">
                                ` + getNumberUnit(dislike) + `
                            </div>
                        </div>
                        <div style = "display: ` + dislikeDisplay1 + `; align-items: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="13" height="25" rx="2" transform="translate(49.33 27.158) rotate(180)"/><rect width="7" height="19" transform="translate(46.33 24.158) rotate(180)"/><path d="M14.814,22.577,29.5,4.331S32.823.792,36.758,2.746,39.081,8.82,39.081,8.82s-5.334,11.936-5.809,13.943H47.109s2.324.634,2.218,5.2a50.274,50.274,0,0,1-1.98,10.774l-2.641,7.869H16.546a1.769,1.769,0,0,1-1.732-1.98C14.83,42.636,14.814,22.577,14.814,22.577Z" transform="translate(49.33 49.158) rotate(180)"/><path d="M17.834,23.644S31.239,6.454,32.165,5.9s2.2-1.1,3.124-.652,1.613.927.652,3.261-5.9,13.354-7,17.233h17.13s1.716,2.712-3.433,17.851h-24.8Z" transform="translate(49.33 49.158) rotate(180)"/></g></svg>
                            <div class = "comments_box_item_right_bottom_item_text">
                                ` + getNumberUnit(dislike + 1) + `
                            </div>
                        </div>
                    </div>
                    <div class = "comments_box_item_right_bottom_reply md-ripples" onclick = "createAddCommentsReplyButton(this);">
                        <div class = "comments_box_item_right_bottom_reply_item">
                            <svg style = "transform: translateY(-1px);" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M14.2,21.974" transform="translate(-1)" fill="none" stroke="#707070" stroke-width="3"/><g transform="translate(5 11.052)"><rect width="3" height="25" transform="translate(0 13.121) rotate(-45)"/><rect width="3" height="25" transform="translate(17.678 -4.6) rotate(45)"/></g><path d="M38.415,50c.043-.167,0-13.345,0-13.345s.987-11.374-10.43-10.9H7.2V22.577H27.985s13.864-.816,13.435,14.078V50Z" transform="translate(1)"/></g></svg>
                            ` + getLanguage("comments_reply_button") + `
                        </div>
                        <div class = "comments_box_item_right_bottom_reply_item" style = "display: none;">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M9 1c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM3 9c0-1.294 0.416-2.491 1.116-3.472l8.356 8.356c-0.981 0.7-2.178 1.116-3.472 1.116-3.309 0-6-2.691-6-6zM13.884 12.472l-8.356-8.356c0.981-0.7 2.178-1.116 3.472-1.116 3.309 0 6 2.691 6 6 0 1.294-0.416 2.491-1.116 3.472z"></path></svg>
                            ` + getLanguage("comments_cancel_reply_button") + `
                        </div>
                    </div>
                </div>
                <div class = "comments_box_item_right_reply_box"></div>
                ` + reply + `
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
            createEl.style.animation = "addCommentsItem 0.2s forwards";
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

    //댓글 정보 안에 답글 정보가 있다면 해당 댓글 안에 답글을 생성한다.
    if (info["replyInfo"] != null) {
        let replyItems = el.getElementsByClassName("comments_box_item_right_temporary_reply_items")[0];
        let replyInfo = info["replyInfo"];
        for (let i = 0; i < replyInfo.length; i++) {
            createCommentsItem(replyItems, replyInfo[i]);
        }
        replyItems.style.display = "block";
    }

    hideCommentsNoData(getCommentsInfo(el)["uniqueNumber"]);
}
function createAddCommentsReplyButton(el) {
    if (loginStatus["isLogin"] == true) {
        let parent = el.parentElement.parentElement;
        let reply_box = parent.getElementsByClassName("comments_box_item_right_reply_box")[0];
    
        let itemInfo = getCommentsItemInfo(el);
        if (itemInfo != null && itemInfo["element"].classList.contains("comments_box_item_reply")) {
            itemInfo = getCommentsItemInfo(itemInfo["element"]);
        }
        if (window.orientation == null || window.orientation == undefined) {
            createAddComments(reply_box, itemInfo["commentsNumber"]);
        } else {
            createAddCommentsVirtualKeyboard(reply_box, itemInfo["commentsNumber"]);
        }   
    } else {
        loadMenu_login();
    }
}



function commentsLikesButton(el) {
    let parent = el.parentElement;

    if (el.children[0].style.display == "flex") {
        commentsLikesDislike(parent, "likes");
    } else if (el.children[0].style.display == "none") {
        commentsLikesDislike(parent, null);
    }
}
function commentsDislikeButton(el) {
    let parent = el.parentElement;

    if (el.children[0].style.display == "flex") {
        commentsLikesDislike(parent, "dislike");
    } else if (el.children[0].style.display == "none") {
        commentsLikesDislike(parent, null);
    }
}
function commentsLikesDislike(el, type) {
    let item = el.getElementsByClassName("comments_box_item_right_bottom_item");
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

    let itemInfo = getCommentsItemInfo(el);
    let commentsNumber = itemInfo["commentsNumber"];
    requestCommentsLikesDislike(commentsNumber, type);
}
function requestCommentsLikesDislike(commentsNumber, type) {
    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/comments/likesDislike.php');
    
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
    formData.append("commentsNumber", commentsNumber);
    formData.append("type", type);

    xhr.send(formData);
}
function showReplyButton(el) {
    let itemInfo = getCommentsItemInfo(el);
    let items = itemInfo["element"].getElementsByClassName("comments_box_item_right_reply_items")[0];
    let more_reply_button = itemInfo["element"].getElementsByClassName("comments_box_item_right_reply_button")[1];
    let temporary_reply_items = itemInfo["element"].getElementsByClassName("comments_box_item_right_temporary_reply_items")[0];

    let show = el.getAttribute("show");
    if (show == "false") {
        el.setAttribute("show", true);
        items.style.display = "block";
        items.classList.remove("immutable_element");

        let commentsNumbers = items.getAttribute("reply_numbers").split(",");
        if (commentsNumbers[0] != null && commentsNumbers[0] != '') {
            more_reply_button.style.display = null;
        }
    } else if (show == "true") {
        el.setAttribute("show", false);
        items.style.display = "none";
        items.classList.add("immutable_element");

        more_reply_button.style.display = "none";
    }

    el.style.pointerEvents = null;

    if (items.innerHTML == "") {
        el.setAttribute("show", "loading");
        items.style.display = "none";
        items.classList.add("immutable_element");
        el.style.pointerEvents = "none";
        more_reply_button.style.display = "none";
    
        requestCommentsReply(items, itemInfo["commentsNumber"]);
    }

    temporary_reply_items.remove();
}



function requestCommentsReply(el, comments_number) {
    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/comments/getReplyNumbers.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let itemInfo = getCommentsItemInfo(el);
                let reply_button = itemInfo["element"].getElementsByClassName("comments_box_item_right_reply_button")[0];

                let info = JSON.parse(xhrHtml);
                let commentsInfo = info["info"];
                let commentsNumbers = null;

                if (commentsInfo != null) {
                    commentsNumbers = info["numbers"].split(",");
                    for (let i = 0; i < commentsInfo.length; i++) {
                        createCommentsItem(el, commentsInfo[i]);
                        commentsNumbers = commentsNumbers.remove("" + commentsInfo[i]["number"]);
                    }
                    reply_button.setAttribute("show", "true");
                } else {
                    reply_button.setAttribute("show", "false");
                }

                let items = itemInfo["element"].getElementsByClassName("comments_box_item_right_reply_items")[0];
                items.style.display = "block";
                items.classList.remove("immutable_element");
                reply_button.style.pointerEvents = null;

                items.setAttribute("reply_numbers", commentsNumbers.join(","));

                if (commentsNumbers.length == 0) {
                    let more_reply_button = itemInfo["element"].getElementsByClassName("comments_box_item_right_reply_button")[1];
                    more_reply_button.style.display = "none";
                } else {
                    let more_reply_button = itemInfo["element"].getElementsByClassName("comments_box_item_right_reply_button")[1];
                    more_reply_button.style.display = null;
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
    formData.append("comments_number", comments_number);

    xhr.send(formData);
}




function getCommentsItemInfo(el) {
    let parent = el;
    while (true) {
        parent = parent.parentElement;
        if (parent != null) {
            let comments_number = parent.getAttribute("comments_number");
            let user_number = parent.getAttribute("user_number");
            if (parent.classList.contains("comments_box_item") && comments_number != null && user_number != null) {
                return {
                    'element': parent,
                    'commentsNumber': comments_number,
                    'userNumber': user_number,
                };
            }
        } else {
            break;
        }
    }
}




function moreReplyButton(el) {
    let itemInfo = getCommentsItemInfo(el);
    let items = itemInfo["element"].getElementsByClassName("comments_box_item_right_reply_items")[0];
    let more_reply_button = itemInfo["element"].getElementsByClassName("comments_box_item_right_reply_button")[1];

    more_reply_button.setAttribute("show", "loading");
    more_reply_button.style.pointerEvents = "none";
    
    let numbers = items.getAttribute("reply_numbers").split(",");
    let numbersMaxCount = (numbers.length >= 10) ? 10 : numbers.length;
    numbers = numbers.splice(0, numbersMaxCount);

    requestCommentsMoreReply(items, numbers);
}
function requestCommentsMoreReply(el, numbers) {
    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/comments/getInfo.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                let itemInfo = getCommentsItemInfo(el);
                let commentsNumbers = el.getAttribute("reply_numbers").split(",");
                
                let more_reply_button = itemInfo["element"].getElementsByClassName("comments_box_item_right_reply_button")[1];
                if (info.length != 0) {
                    for (let i = 0; i < info.length; i++) {
                        createCommentsItem(el, info[i]);
                    }
                }
                for (let i = 0; i < numbers.length; i++) {
                    commentsNumbers = commentsNumbers.remove("" + numbers[i]);
                }

                el.setAttribute("reply_numbers", commentsNumbers.join(","));
    
                more_reply_button.setAttribute("show", false);
                more_reply_button.style.pointerEvents = null;
                if (commentsNumbers.length == 0) {
                    more_reply_button.style.display = "none";
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














function deleteUserReplyAddComments(el) {
    let height = el.clientHeight;
    el.style.transition = "all 0.2s";
    el.style.opacity = "0";
    el.style.marginTop = (height * -1) + "px";
    el.style.marginBottom = "0px";
    setTimeout(() => {
        el.remove();
    }, 200);
}








































































var elementMoreButtonCommentsItem = null;

function moreButtonCommentsItem(el, commentsNumber, isCommenter) {
    let slot = new Array();
    if (isCommenter == true) {
        slot[0] = {
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 28"><path d="M8 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM12 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM16 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM18 22.813v-14.812h-14v14.812c0 0.75 0.422 1.188 0.5 1.188h13c0.078 0 0.5-0.438 0.5-1.188zM7.5 6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094 0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5 0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375 0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391 2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094 2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z"></path></svg>',
            'title': getLanguage("delete"),
            'onclick': 'deleteCommentsItemButton(' + commentsNumber + ');',
            'class': 'more_button_item_delete',
        };
    } else {
        let itemInfo = getCommentsItemInfo(el);
        let profile = JSON.parse(itemInfo["element"].getElementsByClassName("comments_box_item_left")[0].getElementsByClassName("profile_info")[0].innerHTML);
        let nickname = itemInfo["element"].getElementsByClassName("comments_box_item_right_top_nickname")[0].innerHTML.trim();
        let userInfo = {
            "profile": profile,
            "nickname": nickname
        }
        let userReport = {
            "type": 0,
            "uniqueNumber": commentsNumber,
            "userInfo": userInfo
        };
        slot[0] = {
            'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5" transform="translate(9)"/><path d="M13.422,25.422s6.941-3.318,12.163-3.086,17.81,4.641,17.81,4.641V9.456S27.963,4,24.656,3.945s-9.456,2.9-9.456,2.9L13.422,4.235S18.913.754,24.25,1.1,43.395,6.15,43.395,6.15h3.249V30.806L25.584,25.422S18.391,25.816,15.2,27.9Z" transform="translate(-0.449)"/></g></svg>',
            'title': getLanguage("comments_report"),
            'onclick': '(loginStatus[\'isLogin\'] == true) ? openPopupContents(\'user_report\', null, \'' + JSON.stringify(userReport).replaceAll("\"", "\\&quot;").replaceAll("'", "\\\'") + '\') : loadMenu_login();'
        };
    }
    moreButton(el, slot);

    let visibleElementList = new Array();
    while (true) {
        if (el.classList.contains("visible_element")) {
            visibleElementList[visibleElementList.length] = el;
        }
        if (el.parentElement == null) {
            break;
        }
        el = el.parentElement;
    }
    elementMoreButtonCommentsItem = visibleElementList;
}
function deleteCommentsItemButton(commentsNumber) {
    confirmPopup(getLanguage("confirm_popup_title:delete"), getLanguage("confirm_popup_subject:delete"), 'deleteCommentsItem(' + commentsNumber + ');');
}

function deleteCommentsItem(commentsNumber) {
    let contents = document.getElementById("contents_" + getCurrentMenuNumber());

    //-- -- -- -- -- 화면에서 보이지 않아도 해당 앨리먼트는 삭제하지 않는다 -- -- -- -- --
    let allowInfoList = new Array();
    for (let i = (elementMoreButtonCommentsItem.length - 1); i >= 0; i--) {
        allowInfoList[allowInfoList.length] = registerAllowVisibleElement(elementMoreButtonCommentsItem[i]);
    }

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/comments/delete.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                
                if (xhrHtml == "not you") {
                    actionMessage(getLanguage("no_permission"));
                } else {
                    let items = contents.getElementsByClassName("comments_box_items")[0];
                    let item = contents.getElementsByClassName("comments_box_item");
                    let commentsInfo = getCommentsInfo(items);
                    for (let i = 0; i < item.length; i++) {
                        if (item[i].getAttribute("comments_number") == commentsNumber) {
                            let height = item[i].clientHeight;
                            item[i].style.maxHeight = height + "px";
                            item[i].style.transition = "max-height 0.2s, margin-bottom 0.2s, margin-top 0.2s";
                            item[i].style.animation = "deleteCommentsItem 0.2s forwards";
    
                            function callback() {
                                item[i].style.maxHeight = "0px";
                                item[i].style.marginBottom = "0px";
                                item[i].style.marginTop = "0px";
                                setTimeout(() => {
                                    item[i].remove();

                                    if (items.innerHTML.trim() == "" && (commentsInfo["commentsNumbers"] == '' || commentsInfo["commentsNumbers"] == undefined || commentsInfo["commentsNumbers"] == null)) {
                                        showCommentsNoData(commentsInfo["uniqueNumber"]);
                                    }
                                }, 200);
                            }
                            window.requestAnimationFrame(callback);
                            break;
                        }
                    }
                    actionMessage(getLanguage("comments_delete_message"));
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

            setTimeout(() => {
                for (let i = 0; i < allowInfoList.length; i++) {
                    //-- -- -- -- -- 화면에서 보이지 않아도 삭제되지 않는다를 취소한다 -- -- -- -- --
                    deleteAllowVisibleElement(allowInfoList[i]["index"]);
                }
            }, 200);

            loadingComplete();
        }
    });
    
    var formData = new FormData();
    formData.append("commentsNumber", commentsNumber);

    xhr.send(formData);
}




































































































var allowInfoAddCommentsVirtualKeyboard = null;
var elementAddCommentsVirtualKeyboard = null;

function createAddCommentsVirtualKeyboard(el, commentsNumber) {
    let itemInfo = getCommentsItemInfo(el);

    //-- -- -- -- -- 화면에서 보이지 않아도 해당 앨리먼트는 삭제하지 않는다 -- -- -- -- --
    let allowInfo = registerAllowVisibleElement(el);
    allowInfoAddCommentsVirtualKeyboard = allowInfo;
    elementAddCommentsVirtualKeyboard = el;



    //
    let user_reply = '';
    if (itemInfo != null && itemInfo["element"].classList.contains("comments_box_item_reply") && itemInfo["userNumber"] != loginStatus["number"]) {
        let nickname = null;
        let user_number = itemInfo["userNumber"];
        if (itemInfo["element"].classList.contains("comments_box_item_reply") == true) {
            nickname = itemInfo["element"].getElementsByClassName("comments_box_item_right_top_nickname")[0].innerHTML.trim();
        }

        let texts = getLanguage("add_comments_user_reply").replaceAll("{R:0}", "{R:0}{R:0}").split("{R:0}");
        let isNickname = false;
        for (let i = 0; i < texts.length; i++) {
            if (texts[i] != "") {
                texts[i] = `
                    <div class = "comments_box_add_comments_right_user_reply_text">
                        ` + texts[i] + `
                    </div>
                `;
            } else if (isNickname == false) {
                texts[i] = `
                    <div class = "comments_box_add_comments_right_user_reply_nickname">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15 12c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121 0.335-1.577 0.879-2.121 1.292-0.879 2.121-0.879 1.577 0.335 2.121 0.879 0.879 1.292 0.879 2.121zM15.74 15.318c0.13 0.182 0.274 0.353 0.431 0.51 0.723 0.723 1.725 1.172 2.829 1.172s2.106-0.449 2.828-1.172 1.172-1.724 1.172-2.828v-1c0-3.037-1.233-5.789-3.222-7.778s-4.741-3.222-7.779-3.221-5.788 1.232-7.778 3.222-3.221 4.741-3.221 7.778 1.233 5.789 3.222 7.778 4.741 3.222 7.778 3.221c2.525 0 4.855-0.852 6.69-2.269 0.437-0.337 0.518-0.965 0.18-1.403s-0.965-0.518-1.403-0.18c-1.487 1.148-3.377 1.844-5.435 1.852-2.54-0.009-4.776-1.014-6.398-2.636-1.627-1.629-2.634-3.877-2.634-6.363s1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.363v1c0 0.553-0.223 1.051-0.586 1.414s-0.861 0.586-1.414 0.586-1.051-0.223-1.414-0.586-0.586-0.861-0.586-1.414v-5c0-0.552-0.448-1-1-1s-1 0.448-1 1c-0.835-0.627-1.875-1-3-1-1.38 0-2.632 0.561-3.536 1.464s-1.464 2.156-1.464 3.536 0.561 2.632 1.464 3.536 2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464c0.070-0.070 0.139-0.143 0.205-0.217z"></path></svg>
                        <div style = "min-width: calc(100% - 12px); display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; overflow: hidden;">
                            ` + nickname + `
                        </div>
                    </div>
                `;
                isNickname = true;
            }
        }
        let text = '';
        for (let i = 0; i < texts.length; i++) {
            text += texts[i];
        }

        user_reply += '<div class = "virtual_keyboard_comments_box_add_comments_right_user_reply md-ripples" onclick = "deleteUserReplyAddComments(this);" user_reply = "' + user_number + '" onmouseenter = "hoverInformation(this, getLanguage(\'delete\'));">';
        user_reply += `
            <div class = "comments_box_add_comments_right_user_reply_icon">
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17 21v-2c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464h-7c-1.38 0-2.632 0.561-3.536 1.464s-1.464 2.156-1.464 3.536v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2c0-0.829 0.335-1.577 0.879-2.121s1.292-0.879 2.121-0.879h7c0.829 0 1.577 0.335 2.121 0.879s0.879 1.292 0.879 2.121v2c0 0.552 0.448 1 1 1s1-0.448 1-1zM13.5 7c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464-2.632 0.561-3.536 1.464-1.464 2.156-1.464 3.536 0.561 2.632 1.464 3.536 2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464 1.464-2.156 1.464-3.536zM11.5 7c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121 0.335-1.577 0.879-2.121 1.292-0.879 2.121-0.879 1.577 0.335 2.121 0.879 0.879 1.292 0.879 2.121zM16.293 11.707l2 2c0.391 0.391 1.024 0.391 1.414 0l4-4c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-3.293 3.293-1.293-1.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path></svg>
            </div>
        `;
        user_reply += '<div class = "comments_box_add_comments_right_user_reply_wrap">' + text + '</div>';
        user_reply += '</div>';
    }


    



    let input_placeholder = null;
    if (commentsNumber == null) {
        input_placeholder = getLanguage("add_comments_input_placeholder:0");
    } else {
        input_placeholder = getLanguage("add_comments_input_placeholder:1");
    }

    let virtual_keyboard = document.getElementsByClassName("add_comments_virtual_keyboard")[0];
    virtual_keyboard.style.display = "flex";
    virtual_keyboard.style.animation = "show_add_comments_virtual_keyboard 0.2s forwards";

    let virtual_keyboard_box = document.getElementsByClassName("add_comments_virtual_keyboard_box")[0];
    virtual_keyboard_box.innerHTML = `
        ` + user_reply + `
        <div class = "add_comments_virtual_keyboard_box_wrap">
            <div class = "add_comments_virtual_keyboard_box_left">
                <div class = "add_comments_virtual_keyboard_box_profile">
                    <div class = "profile_element">
                        <div class = "profile_info">` + JSON.stringify(loginStatus["profile"]) + `</div>
                        <div class = "profile_image"></div>
                    </div>
                </div>
                <div class = "add_comments_virtual_keyboard_box_textbox scroll" contenteditable = "true" placeholder = "` + input_placeholder + `" onkeydown = "textbox_remove_spaces(this); checkVirtualKeyboardCommentsInput(this);" onpaste="contenteditable_paste(event);"></div>
            </div>
            <div class = "add_comments_virtual_keyboard_box_submit md-ripples" style = "display: none; opacity: 0;" show = "button" onclick = "submitButtonVirtualKeyboardAddComments(` + commentsNumber + `);">
                <div class = "add_comments_virtual_keyboard_box_submit_button">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.016 21v-6.984l15-2.016-15-2.016v-6.984l21 9z"></path></svg>
                </div>
                <div class = "add_comments_virtual_keyboard_box_submit_loading">
                    <div class="showbox">
                        <div class="loader" style="width: 25px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle></svg></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    let height = virtual_keyboard_box.clientHeight;
    virtual_keyboard_box.style.transition = "unset";
    virtual_keyboard_box.style.marginBottom = (height * -1) + "px";
    function callback() {
        virtual_keyboard_box.style.transition = null;
        virtual_keyboard_box.style.marginBottom = null;
    }
    window.requestAnimationFrame(callback);

    let textbox = virtual_keyboard_box.getElementsByClassName("add_comments_virtual_keyboard_box_textbox")[0];
    textbox.focus();
}

var isNotHideAddCommentsVirtualKeyboard = false;
var isHideBlockAddCommentsVirtualKeyboard = false;
function hideAddCommentsVirtualKeyboard() {
    if (isNotHideAddCommentsVirtualKeyboard == false) {
        if (isHideBlockAddCommentsVirtualKeyboard == true) { return; }

        let virtual_keyboard = document.getElementsByClassName("add_comments_virtual_keyboard")[0];
        virtual_keyboard.style.animation = "hide_add_comments_virtual_keyboard 0.2s forwards";

        let virtual_keyboard_box = virtual_keyboard.getElementsByClassName("add_comments_virtual_keyboard_box")[0];
        let height = virtual_keyboard_box.clientHeight;
        virtual_keyboard_box.style.marginBottom = (height * -1) + "px";

        setTimeout(() => {
            virtual_keyboard.style.display = null;
            virtual_keyboard_box.style.marginBottom = null;
            virtual_keyboard_box.innerHTML = '';

            //-- -- -- -- -- 화면에서 보이지 않아도 삭제되지 않는다를 취소한다 -- -- -- -- --
            if (allowInfoAddCommentsVirtualKeyboard != null) {
                deleteAllowVisibleElement(allowInfoAddCommentsVirtualKeyboard["index"]);
                allowInfoAddCommentsVirtualKeyboard = null;
            }
            elementAddCommentsVirtualKeyboard = null;
        }, 200);
    } else {
        isNotHideAddCommentsVirtualKeyboard = false;
    }
}

function checkVirtualKeyboardCommentsInput(el) {
    setTimeout(() => {
        let parent = el.parentElement.parentElement;
        let submit = parent.getElementsByClassName('add_comments_virtual_keyboard_box_submit')[0];
        if (el.innerText.trim() == "") {
            submit.style.opacity = "0";
            setTimeout(() => {
                submit.style.display = "none";
            }, 200);
        } else {
            submit.style.display = null;
            function callback() {
                submit.style.opacity = "1";
            }
            window.requestAnimationFrame(callback);
        }
    }, 1);
}

function checkVirtualKeyboardCommentsInput(el) {
    setTimeout(() => {
        let parent = el.parentElement.parentElement;
        let submit = parent.getElementsByClassName('add_comments_virtual_keyboard_box_submit')[0];
        if (el.innerText.trim() == "") {
            submit.style.opacity = "0";
            setTimeout(() => {
                submit.style.display = "none";
            }, 200);
        } else {
            submit.style.display = null;
            function callback() {
                submit.style.opacity = "1";
            }
            window.requestAnimationFrame(callback);
        }
    }, 1);
}

function submitButtonVirtualKeyboardAddComments(commentsNumber) {
    let virtual_keyboard_box = document.getElementsByClassName("add_comments_virtual_keyboard_box")[0];

    //loading
    let submit = virtual_keyboard_box.getElementsByClassName("add_comments_virtual_keyboard_box_submit")[0];
    submit.setAttribute("show", "loading");
    submit.style.pointerEvents = "none";
    isHideBlockAddCommentsVirtualKeyboard = true;

    //
    let info = getCommentsInfo(elementAddCommentsVirtualKeyboard);
    let content = virtual_keyboard_box.getElementsByClassName("add_comments_virtual_keyboard_box_textbox")[0].innerText.replaceAll('\n\n','\n').trim();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/comments/upload.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;

                if (xhrHtml.trim() == "no_community_permission") {
                    //커뮤니티 자격 없음
                    actionMessage(getLanguage("no_community_permission_message"));
                } else if (commentsNumber == null) {
                    let items = info["element"].getElementsByClassName("comments_box_items")[0];
                    let commentsInfo = JSON.parse(xhrHtml);
                    createCommentsItem(items, commentsInfo, true, "top");

                    actionMessage(getLanguage("comments_upload_message"));
                } else {
                    let info2 = getCommentsItemInfo(elementAddCommentsVirtualKeyboard);

                    //Reply
                    if (info2 != null && info2["element"].classList.contains("comments_box_item_reply")) {
                        info2 = getCommentsItemInfo(info2["element"]);
                    }

                    let items = info2["element"].getElementsByClassName("comments_box_item_right_reply_items")[0];
                    let commentsInfo = JSON.parse(xhrHtml);

                    //
                    if (items.getAttribute("reply_numbers") != null && items.getAttribute("reply_numbers") != "null") {
                        let replyNumbers = items.getAttribute("reply_numbers").split(",");
                        if ((replyNumbers[0] != "" && replyNumbers[0] != null) || items.innerHTML == "") {
                            replyNumbers[replyNumbers.length] = commentsInfo["number"];
                            items.setAttribute("reply_numbers", replyNumbers.join(","));
                        } else {
                            createCommentsItem(items, commentsInfo, true, "bottom");
                        }
                    } else {
                        //답글 없는 상태에서
                        createCommentsItem(items, commentsInfo, true, "bottom");
                    }

                    actionMessage(getLanguage("comments_upload_message"));
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

            isHideBlockAddCommentsVirtualKeyboard = false;
            hideAddCommentsVirtualKeyboard();
        }
    });

    var formData = new FormData();
    if (commentsNumber == null) {
        formData.append("uid", info["uid"]);
    }
    formData.append("content", content);
    if (commentsNumber != null) {
        formData.append("reply_number", commentsNumber);
    }
    //유저 답장
    let user_reply = virtual_keyboard_box.getElementsByClassName("virtual_keyboard_comments_box_add_comments_right_user_reply");
    if (user_reply.length != 0) {
        user_reply = user_reply[0];
        formData.append("user_reply", user_reply.getAttribute("user_reply"));
    }

    xhr.send(formData);
}















































//무한 스크롤
function checkCommentsMoreLoad() {
    let menuNumber = getCurrentMenuNumber();
    let contents = document.getElementById("contents_" + menuNumber);

    if (contents != null) {
        let moreLoad = contents.getElementsByClassName("comments_box_more_load");
        for (let i = 0; i < moreLoad.length; i++) {
            let isLoading = moreLoad[i].getAttribute("loading");
            if (isLoading == 'false' && moreLoad[i].style.display != "none") {
                let commentsInfo = getCommentsInfo(moreLoad[i]);

                let isPossible = isPossibleCommentsMoreLoad(commentsInfo);
                if (isPossible == true) {
                    let commentsNumbers = commentsInfo["commentsNumbers"];

                    let numbers = commentsNumbers;
                    let numbersMaxCount = (numbers.length >= 20) ? 20 : numbers.length;
                    numbers = numbers.splice(0, numbersMaxCount);

                    requestCommentsMore(commentsInfo, numbers);
                    moreLoad[i].setAttribute("loading", true);
                }
            }
        }
    }
}
addEventListener('scroll', checkCommentsMoreLoad);
addEventListener('focus', checkCommentsMoreLoad);
addEventListener('resize', checkCommentsMoreLoad);

function isPossibleCommentsMoreLoad(commentsInfo) {
    //여백 구하기
    let padding = 0;
    let menuName = getCurrentMenuName();
    if (menuName == "novel_viewer" || menuName == "image_format_viewer") {
        padding = (40 + 15);
    }

    let boxSize = 75 + padding;

    let scrollPercent = ((document.documentElement.scrollTop + window.innerHeight) / (document.documentElement.scrollHeight - boxSize)) * 100;
    if (scrollPercent >= 100) {
        return true;
    } else {
        return false;
    }
}

function requestCommentsMore(commentsInfo, numbers) {
    let el = commentsInfo["element"];
    let items = el.getElementsByClassName("comments_box_items")[0];
    let commentsNumbers = commentsInfo["commentsNumbers"];
    let moreLoad = el.getElementsByClassName("comments_box_more_load")[0];

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/comments/getInfo.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                if (info.length != 0) {
                    for (let i = 0; i < info.length; i++) {
                        createCommentsItem(items, info[i]);
                    }
                }
                for (let i = 0; i < numbers.length; i++) {
                    commentsNumbers = commentsNumbers.remove("" + numbers[i]);
                }

                moreLoad.setAttribute("loading", false);
                if (commentsNumbers.length != 0) {
                    el.setAttribute("comments_numbers", commentsNumbers.join(","));
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
    if (commentsInfo["highlightedCommentNumber"] != null) {
        formData.append("highlightedCommentNumber", commentsInfo["highlightedCommentNumber"]);
    }

    xhr.send(formData);
}





















































function loadComments(commentsInfo) {
    let el = commentsInfo["element"];
    let items = el.getElementsByClassName("comments_box_items")[0];
    let top = el.getElementsByClassName("comments_box_top")[0];

    let uid = commentsInfo["uid"];
    let sort = top.getElementsByClassName("comments_top_sort")[0].getAttribute("value");

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/comments/getInfoNumbers.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                let commentsCount = 0;
                if (info["numbers"] != null && info["numbers"] != '') {
                    commentsCount = info["numbers"].split(",").length;
                }
            
                let top_left = top.getElementsByClassName("comments_box_top_left")[0];
                top_left.getElementsByClassName("comments_box_top_left_text")[0].innerHTML = getLanguage("comments_count").replaceAll("{R:0}", commentsCount);

                //
                items.innerHTML = '';

                let commentsNumbers = new Array();
                if (info["numbers"] != null) {
                    commentsNumbers = info["numbers"].split(",");
                }
                if (info["info"] != null) {
                    for (let i = 0; i < info["info"].length; i++) {
                        createCommentsItem(items, info["info"][i]);
                        commentsNumbers = commentsNumbers.remove("" + info["info"][i]["number"]);
                    }
                } else {
                    showCommentsNoData(commentsInfo["uniqueNumber"]);
                }
                el.setAttribute("comments_numbers", commentsNumbers.join(","));

                let moreLoad = el.getElementsByClassName("comments_box_more_load")[0];
                moreLoad.setAttribute("loading", false);
                if (commentsNumbers[0] == null || commentsNumbers[0] == undefined || commentsNumbers[0] == '') {
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
    if (commentsInfo["preferentiallyCommentNumber"] != null) {
        formData.append("preferentiallyCommentNumber", commentsInfo["preferentiallyCommentNumber"]);
    }
    if (commentsInfo["highlightedCommentNumber"] != null) {
        formData.append("highlightedCommentNumber", commentsInfo["highlightedCommentNumber"]);
    }

    xhr.send(formData);
}























































function getCommentsSortItems() {
    let items = new Array();
    items[0] = {
        "title": getLanguage("comments_sort:0"),
        "value": 0
    }
    items[1] = {
        "title": getLanguage("comments_sort:1"),
        "value": 1
    }
    items[2] = {
        "title": getLanguage("comments_sort:2"),
        "value": 2
    }
    items[3] = {
        "title": getLanguage("comments_sort:3"),
        "value": 3
    }
    items[4] = {
        "title": getLanguage("comments_sort:4"),
        "value": 4
    }
    return items;
}