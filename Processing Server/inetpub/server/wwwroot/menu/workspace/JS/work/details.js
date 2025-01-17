

function workspaceWorkLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let info = JSON.parse(contents.getElementsByClassName("workspace_work_info_json")[0].innerHTML);
    
    let details = contents.getElementsByClassName("workspace_work_contents_left_details")[0];
    details.innerHTML = getHtmlWorkspaceWork(menuNumber, info);

    //공개 상태
    let public_status = contents.getElementsByClassName("my_works_contents_item_right_public_status")[0];
    public_status.getElementsByClassName("value_title")[0].innerText = getLanguage("public_status:" + public_status.getAttribute("value"));
    //장르
    let genre_valuebox = contents.getElementsByClassName("create_work_step2_genre_box_valuebox")[0];
    let genre_item = info["genre"].split(",");
    for (let i = 0; i < genre_item.length; i++) {
        if (genre_item[i].trim() != "") {
            let newElement = getNewElementValueboxItem(genre_item[i], getLanguage("genre:" + genre_item[i]));
            genre_valuebox.appendChild(newElement);
        }
    }
    //태그
    let tag_box = contents.getElementsByClassName("create_work_step2_tag_box")[0];
    let tag_item = info["tag"].split(",");
    for (let i = 0; i < tag_item.length; i++) {
        if (tag_item[i].trim() != "") {
            createWorkAddTagValue(tag_box, tag_item[i]);
        }
    }

    //
    let undo = contents.getElementsByClassName("workspace_work_top_right_undo")[0];
    undo.innerHTML = getLanguage("workspace_details_undo");
    let save = contents.getElementsByClassName("workspace_work_top_right_save")[0];
    save.innerHTML = getLanguage("workspace_details_save");
}

function getHtmlWorkspaceWork(menuNumber, info) {
    let contents = document.getElementById("contents_" + menuNumber);
    let html = '';

    let work_cover_value = "0";
    let work_cover_url = "";
    if (info["cover_image"] != null) {
        work_cover_value = "1";
        work_cover_url = info["cover_image"];
    }

    //강제로 비공개 전환
    let forcedPrivateHtml = "";
    let forcedPrivate = contents.getElementsByClassName("forced_private")[0].innerHTML.trim();
    if (forcedPrivate == true || forcedPrivate == "true") {
        forcedPrivateHtml = `
            <div class = "workspace_work_details_warning">
                <div class = "workspace_work_details_warning_icon">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.070c-1.884-1.821-3.053-4.37-3.053-7.193 0-5.523 4.477-10 10-10 2.823 0 5.372 1.169 7.19 3.050l0.003 0.003c1.737 1.796 2.807 4.247 2.807 6.947 0 5.523-4.477 10-10 10-2.7 0-5.151-1.070-6.95-2.81l0.003 0.003zM9 5v6h2v-6h-2zM9 13v2h2v-2h-2z"></path></svg>
                </div>
                <div class = "workspace_work_details_warning_text">
                    ` + getLanguage("menu_workspace_details_forced_private_message") + `
                </div>
            </div>
        `;
    }

    html = `
        ` + forcedPrivateHtml + `
        <div style = "margin-top: 15px; margin-bottom: 15px;">
            <div class = "create_work_step2_option_title">
                ` + getLanguage("work_settings_cover") + `
            </div>
            <div class = "workspace_work_cover scroll" value = "` + work_cover_value + `">
                <div class = "workspace_work_cover_selected img_wrap">
                    <img src = "` + work_cover_url + `" onload = "imageLoad(event);" alt = "">
                </div>
                <div class = "workspace_work_cover_add md-ripples" onclick = "openPopupContents('workspace_work_cover_upload');">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M16.88 9.1c1.795 0.419 3.111 2.006 3.111 3.9 0 2.206-1.786 3.995-3.991 4h-11c-0.001 0-0.003 0-0.005 0-2.761 0-5-2.239-5-5 0-2.409 1.704-4.421 3.973-4.894l0.032-0.006v-0.1c0-0.001 0-0.002 0-0.004 0-1.657 1.343-3 3-3 0.56 0 1.085 0.154 1.534 0.421l-0.014-0.008c0.899-0.889 2.136-1.438 3.5-1.438 2.75 0 4.98 2.23 4.98 4.98 0 0.017-0 0.033-0 0.050l0-0.003c0 0.38-0.040 0.74-0.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z"></path></svg>
                    <div class = "workspace_work_cover_add_title">
                        ` + getLanguage("workspace_work_upload_cover_title") + `
                    </div>
                    <div class = "workspace_work_cover_add_description">
                        ` + getLanguage("workspace_work_upload_cover_description") + `
                    </div>
                </div>
                <div class = "workspace_work_cover_delete md-ripples" onclick = "workspaceWorkDeleteCover(` + menuNumber + `);">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 28"><path d="M8 21.5v-11c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v11c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM12 21.5v-11c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v11c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM16 21.5v-11c0-0.281-0.219-0.5-0.5-0.5h-1c-0.281 0-0.5 0.219-0.5 0.5v11c0 0.281 0.219 0.5 0.5 0.5h1c0.281 0 0.5-0.219 0.5-0.5zM7.5 6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094 0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5 0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375 0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391 2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094 2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z"></path></svg>
                    <div class = "workspace_work_cover_add_title">
                        ` + getLanguage("workspace_work_delete_cover_title") + `
                    </div>
                    <div class = "workspace_work_cover_add_description">
                        ` + getLanguage("workspace_work_delete_cover_description") + `
                    </div>
                </div>
            </div>
        </div>
        <div class = "create_work_input">
            <div class = "create_work_input_top">
                <div class = "create_work_input_top_title">
                    ` + getLanguage("work_settings_title") + `
                </div>
                <div class = "create_work_input_top_icon" onmouseenter = "hoverHelp(this, getLanguage('work_settings_detailed_description_title'));">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 6q1.641 0 2.813 1.172t1.172 2.813q0 1.266-1.5 2.602t-1.5 2.414h-1.969q0-1.078 0.469-1.852t1.031-1.125 1.031-0.867 0.469-1.172q0-0.797-0.609-1.383t-1.406-0.586-1.406 0.586-0.609 1.383h-1.969q0-1.641 1.172-2.813t2.813-1.172zM12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93zM11.016 18v-2.016h1.969v2.016h-1.969z"></path></svg>
                </div>
            </div>
            <input class = "workspace_work_details" value = "` + info["title"].replaceAll('"', '&quot;') + `" type = "text" placeholder = "` + getLanguage("work_settings_please_enter") + `" onfocus = "create_work_input_focus(this);" >
        </div>

        <div class = "create_work_input" style = "margin-top: 20px;">
            <div class = "create_work_input_top">
                <div class = "create_work_input_top_title">
                    ` + getLanguage("work_settings_description") + `
                </div>
                <div class = "create_work_input_top_icon" onmouseenter = "hoverHelp(this, getLanguage('work_settings_detailed_description_description'));">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 6q1.641 0 2.813 1.172t1.172 2.813q0 1.266-1.5 2.602t-1.5 2.414h-1.969q0-1.078 0.469-1.852t1.031-1.125 1.031-0.867 0.469-1.172q0-0.797-0.609-1.383t-1.406-0.586-1.406 0.586-0.609 1.383h-1.969q0-1.641 1.172-2.813t2.813-1.172zM12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93zM11.016 18v-2.016h1.969v2.016h-1.969z"></path></svg>
                </div>
            </div>
            <div class = "workspace_work_details create_work_input_textbox" contenteditable = "true" placeholder = "` + getLanguage("work_settings_please_enter") + `" onfocus = "create_work_input_focus(this);" onkeydown = "textbox_remove_spaces(this);" onpaste = "contenteditable_paste(event);">` + info["description"] + `</div>
        </div>

        <div class = "create_work_step2_option" style = "margin-top: 20px;">
            <div class = "create_work_step2_option_title">
                ` + getLanguage("work_settings_public_status") + `
            </div>
            <div class = "workspace_work_details create_work_step2_option_box md-ripples" value = "` + info["public_status"] + `" onclick = "selectList(this, create_work_select_list('public_status'));">
                <div class = "create_work_step2_option_box_title value_title">
                    ` + getLanguage("public_status:" + info["public_status"]) + `
                </div>
                <div class = "create_work_step2_option_box_icon">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.984 9.984h10.031l-5.016 5.016z"></path></svg>
                </div>
            </div>
        </div>

        <div class = "workspace_work_contents_read_more md-ripples" value = "0" onclick = "toggleWorkspaceWorkReadMore(` + menuNumber + `);">
            <div class = "workspace_work_contents_read_more_0">
                ` + getLanguage("read_more:0") + `
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17.418 6.109c0.272-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-7.908 7.83c-0.27 0.268-0.707 0.268-0.979 0l-7.908-7.83c-0.27-0.268-0.27-0.701 0-0.969s0.709-0.268 0.979 0l7.419 7.141 7.418-7.141z"></path></svg>
            </div>
            <div class = "workspace_work_contents_read_more_1">
                ` + getLanguage("read_more:1") + `
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.582 13.891c-0.272 0.268-0.709 0.268-0.979 0s-0.271-0.701 0-0.969l7.908-7.83c0.27-0.268 0.707-0.268 0.979 0l7.908 7.83c0.27 0.268 0.27 0.701 0 0.969s-0.709 0.268-0.978 0l-7.42-7.141-7.418 7.141z"></path></svg>
            </div>
        </div>

        <div class = "workspace_work_contents_read_more_contents" style = "display: none;">
            <div class = "create_work_step2_option" style = "margin-top: 20px;">
                <div class = "create_work_step2_option_title">
                    ` + getLanguage("work_settings_user_age") + `
                </div>
                <div class = "workspace_work_details create_work_step2_option_box md-ripples" value = "` + info["user_age"] + `" onclick = "selectList(this, create_work_select_list('user_age'));">
                    <div class = "create_work_step2_option_box_title value_title">
                        ` + getLanguage("work_settings_user_age:" + info["user_age"]) + `
                    </div>
                    <div class = "create_work_step2_option_box_icon">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.984 9.984h10.031l-5.016 5.016z"></path></svg>
                    </div>
                </div>
            </div>
            <div class = "create_work_step2_option" style = "margin-top: 20px;">
                <div class = "create_work_step2_option_title">
                    ` + getLanguage("work_settings_genre") + `
                    <div class = "create_work_input_top_icon" onmouseenter = "hoverHelp(this, getLanguage('work_settings_detailed_description_genre'));">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 6q1.641 0 2.813 1.172t1.172 2.813q0 1.266-1.5 2.602t-1.5 2.414h-1.969q0-1.078 0.469-1.852t1.031-1.125 1.031-0.867 0.469-1.172q0-0.797-0.609-1.383t-1.406-0.586-1.406 0.586-0.609 1.383h-1.969q0-1.641 1.172-2.813t2.813-1.172zM12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93zM11.016 18v-2.016h1.969v2.016h-1.969z"></path></svg>
                    </div>
                </div>
                <div class = "workspace_work_details create_work_step2_genre_box">
                    <div class = "create_work_step2_genre_box_button_click"></div>
                    <div class = "create_work_step2_genre_box_button md-ripples" onclick = "createWorkAddGenre(this, getWorkGenre());">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 13h6v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6h6c0.552 0 1-0.448 1-1s-0.448-1-1-1h-6v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v6h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path></svg>
                        ` + getLanguage("work_settings_add_genre") + `
                    </div>
                    <div class = "create_work_step2_genre_box_valuebox"></div>
                </div>
            </div>
            <div class = "create_work_step2_option" style = "margin-top: 20px;">
                <div class = "create_work_step2_option_title">
                    ` + getLanguage("work_settings_tag") + `
                    <div class = "create_work_input_top_icon" onmouseenter = "hoverHelp(this, getLanguage('work_settings_detailed_description_tag'));">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 6q1.641 0 2.813 1.172t1.172 2.813q0 1.266-1.5 2.602t-1.5 2.414h-1.969q0-1.078 0.469-1.852t1.031-1.125 1.031-0.867 0.469-1.172q0-0.797-0.609-1.383t-1.406-0.586-1.406 0.586-0.609 1.383h-1.969q0-1.641 1.172-2.813t2.813-1.172zM12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93zM11.016 18v-2.016h1.969v2.016h-1.969z"></path></svg>
                    </div>
                </div>
                <div class = "workspace_work_details create_work_step2_tag_box">
                    <div class = "create_work_step2_tag_box_valuebox_wrap"></div>
                    <input type = "text" placeholder = "` + getLanguage("work_settings_please_enter_tag") + `" onfocus = "create_work_input_focus(this);" onkeydown = "if (window.event.keyCode == 13) { createWorkAddTag(this); }" >
                </div>
            </div>
        </div>
    `;

    return html;
}

function toggleWorkspaceWorkReadMore(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let read_more = contents.getElementsByClassName("workspace_work_contents_read_more")[0];
    
    if (read_more.getAttribute("value") == 0) {
        showWorkspaceWorkReadMore(menuNumber);
    } else {
        hideWorkspaceWorkReadMore(menuNumber);
    }
}
function showWorkspaceWorkReadMore(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let read_more = contents.getElementsByClassName("workspace_work_contents_read_more")[0];
    let more_contents = contents.getElementsByClassName("workspace_work_contents_read_more_contents")[0];

    read_more.setAttribute("value", 1);

    more_contents.style.display = "block";
    let height = more_contents.clientHeight;
    more_contents.style.height = "0px";
    more_contents.style.opacity = "0";

    setTimeout(() => {
        more_contents.style.height = height + "px";
        more_contents.style.opacity = "1";
    }, 10);
    setTimeout(() => {
        more_contents.style.height = null;
    }, 210);
}
function hideWorkspaceWorkReadMore(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let read_more = contents.getElementsByClassName("workspace_work_contents_read_more")[0];
    let more_contents = contents.getElementsByClassName("workspace_work_contents_read_more_contents")[0];

    read_more.setAttribute("value", 0);

    let height = more_contents.clientHeight;
    more_contents.style.height = height + "px";
    more_contents.style.opacity = "1";

    setTimeout(() => {
        more_contents.style.height = 0 + "px";
        more_contents.style.opacity = "0";
    }, 10);
    setTimeout(() => {
        more_contents.style.height = null;
        more_contents.style.display = "none";
    }, 210);
}








setInterval(() => {
    if (getCurrentMenuName() == "workspace_work_details") {
        let menuNumber = getCurrentMenuNumber();
        checkWorkspaceWorkDetails(menuNumber);
    }
}, 10);

function getJsonWorkspaceWorkDetails(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let details = contents.getElementsByClassName("workspace_work_details");

    let description = details[1].innerHTML.replaceAll("<div>", "\n").replaceAll("</div>", "").replaceAll("<br>", "").trim();
    description = description.replaceAll("&lt;", "<").replaceAll("&gt;", ">");

    let data = {
        'title': details[0].value,
        'description': description,
        'public_status': Number.parseInt(details[2].getAttribute("value")),
        'user_age': Number.parseInt(details[3].getAttribute("value")),
        'genre': getValueCreateWorkGenre(details[4]).join(","),
        'tag': getValueCreateWorkTag(details[5]).join(","),
        'cover_image': getUrlWorkspaceWorkCover(menuNumber)
    };

    return data;
}
function checkWorkspaceWorkDetails(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    let json = getJsonWorkspaceWorkDetails(menuNumber);
    let current = JSON.stringify(json);
    let save = JSON.stringify(JSON.parse(contents.getElementsByClassName("workspace_work_save_json")[0].innerText.replaceAll("\\r\\n", "\\n").trim()));

    //필수 입력 정보 여부
    let isEssential = true;
    if (json["title"] == null || json["title"] == "") {
        isEssential = false;
    }
    if (json["description"] == null || json["description"] == "") {
        isEssential = false;
    }

    let right_undo = contents.getElementsByClassName("workspace_work_top_right_undo")[0];
    let right_save = contents.getElementsByClassName("workspace_work_top_right_save")[0];

    if (current == save || isEssential == false) {
        right_undo.classList.remove("workspace_work_top_right_undo_possible");
        right_save.classList.remove("workspace_work_top_right_save_possible");
    } else {
        right_undo.classList.add("workspace_work_top_right_undo_possible");
        right_save.classList.add("workspace_work_top_right_save_possible");
    }
}










function workspaceWorkSaveKeydown(event) {
    if (getCurrentMenuName() == "workspace_work_details") {
        if (event.ctrlKey && event.keyCode == 83) {
            let menuNumber = getCurrentMenuNumber();
            
            let contents = document.getElementById("contents_" + menuNumber);
            let right_save = contents.getElementsByClassName("workspace_work_top_right_save")[0];

            if (right_save.classList.contains("workspace_work_top_right_save_possible")) {
                workspaceWorkSave(menuNumber);
            } else {
                actionMessage(getLanguage("save_no_change"));
            }
            event.preventDefault();
        }
    }
}
window.addEventListener("keydown", workspaceWorkSaveKeydown);

function workspaceWorkSave(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let info = JSON.parse(contents.getElementsByClassName("workspace_work_info_json")[0].innerText);
    let save_json = contents.getElementsByClassName("workspace_work_save_json")[0];
    let save_data = getJsonWorkspaceWorkDetails(menuNumber);
    save_json.innerText = JSON.stringify(save_data);

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/menu/workspace/php/work/details/save.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                
                //공개 상태
                let public_status = contents.getElementsByClassName("my_works_contents_item_right_public_status")[0];
                public_status.setAttribute("value", save_data["public_status"]);
                public_status.getElementsByClassName("value_title")[0].innerText = getLanguage("public_status:" + save_data["public_status"]);

                actionMessage(getLanguage("save_saved"));
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
    
    let data = getJsonWorkspaceWorkDetails(menuNumber);
    
    var formData = new FormData();
    formData.append("work_number", info["number"]);
    formData.append("title", data["title"]);
    formData.append("description", data["description"]);
    formData.append("user_age", data["user_age"]);
    formData.append("genre", data["genre"]);
    formData.append("tag", data["tag"]);
    formData.append("cover_image", data["cover_image"]);
    formData.append("public_status", data["public_status"]);
    formData.append("contents_type", data["contents_type"]);

    xhr.send(formData);
}

function workspaceWorkUndo(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let info = JSON.parse(contents.getElementsByClassName("workspace_work_info_json")[0].innerText);
    let save_json = JSON.parse(contents.getElementsByClassName("workspace_work_save_json")[0].innerText);
    let details = contents.getElementsByClassName("workspace_work_details");

    //작품 표지
    let work_cover = contents.getElementsByClassName("workspace_work_cover")[0];
    let img = contents.getElementsByClassName("workspace_work_contents_right_top_cover")[0].getElementsByTagName("img")[0];
    if (save_json["cover_image"] != null) {
        work_cover.setAttribute("value", "1");
        work_cover.getElementsByTagName("img")[0].src = save_json["cover_image"];
        img.src = save_json["cover_image"];
    } else {
        work_cover.setAttribute("value", "0");
        img.src = info["default_cover_image"];
    }

    //작품 제목
    details[0].value = save_json["title"];

    //작품 소개
    details[1].innerHTML = save_json["description"];

    //공개 상태
    details[2].setAttribute("value", save_json["public_status"]);
    details[2].getElementsByClassName("value_title")[0].innerText = getLanguage("public_status:" + save_json["public_status"]);

    //연령 제한
    details[3].setAttribute("value", save_json["user_age"]);
    details[3].getElementsByClassName("value_title")[0].innerText = getLanguage("work_settings_user_age:" + save_json["user_age"]);

    //작품 장르
    let genre_valuebox = contents.getElementsByClassName("create_work_step2_genre_box_valuebox")[0];
    genre_valuebox.innerText = '';
    let genre_item = save_json["genre"].split(",");
    for (let i = 0; i < genre_item.length; i++) {
        let newElement = getNewElementValueboxItem(genre_item[i], getLanguage("genre:" + genre_item[i]));
        genre_valuebox.appendChild(newElement);
    }

    //작품 태그
    let tag_box = contents.getElementsByClassName("create_work_step2_tag_box")[0];
    let tag_wrap = tag_box.getElementsByClassName("create_work_step2_tag_box_valuebox_wrap")[0];
    tag_wrap.innerText = '';
    let tag_item = save_json["tag"].split(",");
    for (let i = 0; i < tag_item.length; i++) {
        if (tag_item[i] != "") {
            createWorkAddTagValue(tag_box, tag_item[i]);
        }
    }

    actionMessage(getLanguage("save_undo"));
}












function getUrlWorkspaceWorkCover(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let work_cover = contents.getElementsByClassName("workspace_work_cover")[0];
    if (work_cover.getAttribute("value") == "1") {
        return work_cover.getElementsByTagName("img")[0].src;
    }
    return null;
}
function workspaceWorkDeleteCover(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let info = JSON.parse(contents.getElementsByClassName("workspace_work_info_json")[0].innerText);
    let work_cover = contents.getElementsByClassName("workspace_work_cover")[0];
    work_cover.setAttribute("value", "0");

    let img = contents.getElementsByClassName("workspace_work_contents_right_top_cover")[0].getElementsByTagName("img")[0];
    img.src = info["default_cover_image"];
}







function workspaceWorkChangePublicState(menuNumber, el) {
    let contents = document.getElementById("contents_" + menuNumber);
    let details = contents.getElementsByClassName("workspace_work_details");
    let public_status = el.getAttribute("value");

    details[2].setAttribute("value", public_status);
    details[2].getElementsByClassName("value_title")[0].innerText = getLanguage("public_status:" + public_status);

    let save_json = contents.getElementsByClassName("workspace_work_save_json")[0];
    let save_data = JSON.parse(save_json.innerText);
    save_data["public_status"] = Number.parseInt(public_status);
    save_json.innerText = JSON.stringify(save_data);
}
















































function moreButtonWorkspaceWorkDetails(el, workNumber) {
    let slot = new Array();
    slot[0] = {
        'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.199 13.599c0.992 1.327 2.43 2.126 3.948 2.345s3.123-0.142 4.45-1.134c0.239-0.179 0.465-0.375 0.655-0.568l2.995-2.995c1.163-1.204 1.722-2.751 1.696-4.285s-0.639-3.061-1.831-4.211c-1.172-1.132-2.688-1.692-4.199-1.683-1.492 0.008-2.984 0.571-4.137 1.683l-1.731 1.721c-0.392 0.389-0.394 1.023-0.004 1.414s1.023 0.394 1.414 0.004l1.709-1.699c0.77-0.742 1.763-1.117 2.76-1.123 1.009-0.006 2.016 0.367 2.798 1.122 0.795 0.768 1.203 1.783 1.221 2.808s-0.355 2.054-1.11 2.836l-3.005 3.005c-0.114 0.116-0.263 0.247-0.428 0.37-0.885 0.662-1.952 0.902-2.967 0.756s-1.971-0.678-2.632-1.563c-0.331-0.442-0.957-0.533-1.4-0.202s-0.533 0.957-0.202 1.4zM14.801 10.401c-0.992-1.327-2.43-2.126-3.948-2.345s-3.124 0.142-4.451 1.134c-0.239 0.179-0.464 0.375-0.655 0.568l-2.995 2.995c-1.163 1.204-1.722 2.751-1.696 4.285s0.639 3.061 1.831 4.211c1.172 1.132 2.688 1.692 4.199 1.683 1.492-0.008 2.984-0.571 4.137-1.683l1.723-1.723c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-1.696 1.698c-0.77 0.742-1.763 1.117-2.76 1.123-1.009 0.006-2.016-0.367-2.798-1.122-0.795-0.768-1.203-1.783-1.221-2.808s0.355-2.054 1.11-2.836l3.005-3.005c0.114-0.116 0.263-0.247 0.428-0.37 0.885-0.662 1.952-0.902 2.967-0.756s1.971 0.678 2.632 1.563c0.331 0.442 0.957 0.533 1.4 0.202s0.533-0.957 0.202-1.4z"></path></svg>',
        'title': getLanguage("more_button_workspace_details:go_to_work_page"),
        'onclick': 'loadMenu_work(' + workNumber + ');',
    }
    slot[1] = {
        'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 28"><path d="M8 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM12 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM16 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM18 22.813v-14.812h-14v14.812c0 0.75 0.422 1.188 0.5 1.188h13c0.078 0 0.5-0.438 0.5-1.188zM7.5 6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094 0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5 0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375 0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391 2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094 2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z"></path></svg>',
        'title': getLanguage("more_button_workspace_details:delete_work"),
        'onclick': 'deleteWorkspaceWorkDetails(' + workNumber + ');',
        'class': 'more_button_item_delete',
    };
    moreButton(el, slot, null);
}
function deleteWorkspaceWorkDetails(workNumber) {
    confirmPopup(getLanguage("confirm_popup_title:delete"), getLanguage("confirm_popup_subject:delete"), 'requestDeleteWorkspaceWorkDetails(' + workNumber + ');');
}






function requestDeleteWorkspaceWorkDetails(workNumber) {
    spinLoading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/work/delete.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                
                loadWorkspace_my_works();
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
    formData.append("work_number", workNumber);

    xhr.send(formData);
}