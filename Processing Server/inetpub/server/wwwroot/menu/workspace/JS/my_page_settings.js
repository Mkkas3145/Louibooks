

function workspaceMyPageSettingsLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let details = contents.getElementsByClassName("workspace_my_page_settings_details");
    let info = JSON.parse(contents.getElementsByClassName("workspace_my_page_settings_save_json")[0].innerHTML);
    let userRank = Number.parseInt(contents.getElementsByClassName("user_rank")[0].innerHTML);

    //내 페이지 소개
    if (info["description"] != null) {
        details[0].innerHTML = info["description"];
    }

    //내 페이지 아트
    let art_left = contents.getElementsByClassName("workspace_my_page_settings_art_contents_left")[0];
    let right_item = contents.getElementsByClassName("workspace_my_page_settings_art_contents_right_item");
    let art = info["art"];
    if (art != null) {
        let type = art["type"];
        if (type == "image") {
            art_left.innerHTML = `
                <div class = "img_wrap" style = "width: 100%; height: 100%;">
                    <img src = "` + art["url"] + `" width = "` + art["width"] + `" height = "` + art["height"] + `" onload = "imageLoad(event);">
                </div>
            `;
        }
        if (type == "video") {
            art_left.innerHTML = `
                <div class = "video_wrap" style = "width: 100%; height: 100%;">
                    <video src = "` + art["url"] + `" thumbnail = "` + art["thumbnail"] + `" onplay = "videoLoad(event);" width = "` + art["width"] + `" height = "` + art["height"] + `" autoplay loop muted></video>
                </div>
            `;
        }
    } else {
        //삭제 버튼 숨기기
        right_item[1].style.display = "none";
    }

    //언어
    let top_left_title = contents.getElementsByClassName("workspace_my_page_settings_top_left_title")[0];
    top_left_title.innerHTML = getLanguage("menu_name:workspace_my_page_settings");
    let undo = contents.getElementsByClassName("workspace_my_page_settings_top_right_undo")[0];
    undo.innerHTML = getLanguage("workspace_details_undo");
    let save = contents.getElementsByClassName("workspace_my_page_settings_top_right_save")[0];
    save.innerHTML = getLanguage("workspace_details_save");
    
    let user_profile_description = contents.getElementsByClassName("workspace_my_page_settings_description")[0];
    user_profile_description.innerHTML = getLanguage("workspace_my_page_settings_user_profile_description");
    let profile_right_button = contents.getElementsByClassName("workspace_my_page_settings_profile_contents_right_button")[0].getElementsByTagName("span")[0];
    profile_right_button.innerHTML = getLanguage("workspace_my_page_settings_user_profile_button");

    let settings_title = contents.getElementsByClassName("workspace_my_page_settings_title");
    settings_title[0].innerHTML = getLanguage("workspace_my_page_settings_user_profile_title");
    settings_title[1].innerHTML = getLanguage("workspace_my_page_settings_my_page_art_title");
    settings_title[2].innerHTML = getLanguage("workspace_my_page_settings_details_title");

    let right_text = contents.getElementsByClassName("workspace_my_page_settings_art_contents_right_text")[0];
    if (userRank == 5) {
        right_text.innerHTML = getLanguage("workspace_my_page_settings_my_page_art_description:premium");
    } else {
        right_text.innerHTML = getLanguage("workspace_my_page_settings_my_page_art_description:not_premium");
    }

    let art_right_item = contents.getElementsByClassName("workspace_my_page_settings_art_contents_right_item");
    art_right_item[0].getElementsByTagName("span")[0].innerHTML = getLanguage("workspace_my_page_settings_my_page_art_button:upload");
    art_right_item[1].getElementsByTagName("span")[0].innerHTML = getLanguage("workspace_my_page_settings_my_page_art_button:delete");

    let my_page_art_input = contents.getElementsByClassName("workspace_my_page_settings_art")[0].getElementsByTagName("input")[0];
    if (userRank == 5) {
        my_page_art_input.setAttribute("accept", "image/png, image/jpeg, image/webp, image/gif, video/mp4, video/webm");
    } else {
        my_page_art_input.setAttribute("accept", "image/png, image/jpeg, image/webp, image/gif");
    }

    let input_top_title = contents.getElementsByClassName("create_work_input_top_title")[0];
    input_top_title.innerHTML = getLanguage("workspace_my_page_settings_details_description_title");
    let about_input = contents.getElementsByClassName("workspace_my_page_settings_details")[0];
    about_input.setAttribute("placeholder", getLanguage("work_settings_please_enter"));
}






function workspaceMyPageSettingsChangeArtButton(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let art = contents.getElementsByClassName("workspace_my_page_settings_art")[0];
    let input = art.getElementsByTagName("input")[0];

    input.click();
}

function uploadArtWorkspaceMyPageSettings(menuNumber, event) {
    let contents = document.getElementById("contents_" + menuNumber);
    let art = contents.getElementsByClassName("workspace_my_page_settings_art")[0];

    let url = "";
    let file = event.target.files[0];
    let fileType = file.type.split("/")[0];
    if (fileType == "image") {
        url = "https://img.louibooks.com/upload.php";
    } else if (fileType == "video") {
        url = "https://video.louibooks.com/upload.php";
    }

    spinLoading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, url);
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;

                if (xhrHtml == "file is too big") {
                    actionMessage(getLanguage("workspace_my_page_settings_my_page_art_long_file_message"));
                } else {
                    let json = JSON.parse(xhrHtml);
                    
                    let art_left = art.getElementsByClassName("workspace_my_page_settings_art_contents_left")[0];
                    let art_right_item = contents.getElementsByClassName("workspace_my_page_settings_art_contents_right_item");
                    if (fileType == "image") {
                        art_left.innerHTML = `
                            <div class = "img_wrap" style = "width: 100%; height: 100%;">
                                <img src = "` + json["url"] + `" width = "` + json["width"] + `" height = "` + json["height"] + `" onload = "imageLoad(event);">
                            </div>
                        `;
                    }
                    if (fileType == "video") {
                        art_left.innerHTML = `
                            <div class = "video_wrap" style = "width: 100%; height: 100%;">
                                <video src = "` + json["url"] + `" thumbnail = "` + json["thumbnail"] + `" onplay = "videoLoad(event);" width = "` + json["width"] + `" height = "` + json["height"] + `" autoplay loop muted></video>
                            </div>
                        `;
                    }
                    art_right_item[1].style.display = null;
                }
            } else {
                if (status == 504) {
                    //시간 초과
                    serverResponseErrorMessage(0);
                } else {
                    //오류 발생
                    serverResponseErrorMessage(1);
                }
                popupContentsLoadingComplete();
            }
            spinLoadingComplete();
        }
    });
    
    var formData = new FormData();
    if (fileType == "image") {
        formData.append("imgFile", file);
    } else if (fileType == "video") {
        formData.append("file", file);
    }
    formData.append("type", "user_art");

    xhr.send(formData);

    event.target.value = null;
}

function deleteButtonArtWorkspaceMyPageSettings(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let art = contents.getElementsByClassName("workspace_my_page_settings_art")[0];

    let art_right_item = contents.getElementsByClassName("workspace_my_page_settings_art_contents_right_item");
    let art_left = art.getElementsByClassName("workspace_my_page_settings_art_contents_left")[0];

    art_left.textContent = "";
    art_right_item[1].style.display = "none";
}







function getJsonWorkspaceMyPageSettings(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    if (contents.getElementsByClassName("workspace_my_page_settings").length != 0) {
        let details = contents.getElementsByClassName("workspace_my_page_settings_details");
        let description = details[0].innerHTML.replaceAll("<div>", "\n").replaceAll("</div>", "").replaceAll("<br>", "").trim();
        description = description.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
        if (description == "") {
            description = null;
        }

        let art = null;
        let settings_art = contents.getElementsByClassName("workspace_my_page_settings_art")[0];
        if (settings_art.getElementsByTagName("img").length != 0) {
            let img = settings_art.getElementsByTagName("img")[0];
            let width = img.getAttribute("width");
            let height = img.getAttribute("height");
            let url = img.src;

            art = {
                "type": "image",
                "url": url,
                "width": width,
                "height": height
            };
        }
        if (settings_art.getElementsByTagName("video").length != 0) {
            let video = settings_art.getElementsByTagName("video")[0];
            let width = video.getAttribute("width");
            let height = video.getAttribute("height");
            let url = video.src;
            let thumbnail = video.getAttribute("thumbnail");

            art = {
                "type": "video",
                "url": url,
                "width": Number.parseInt(width),
                "height": Number.parseInt(height),
                "thumbnail": thumbnail
            };
        }

        let data = {
            "description": description,
            "art": art
        }

        return data;
    }

    return null;
}
function checkWorkspaceMyPageSettings(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    if (contents.getElementsByClassName("workspace_my_page_settings_save_json").length != 0) {
        let current = JSON.stringify(getJsonWorkspaceMyPageSettings(menuNumber));
        let save = JSON.stringify(JSON.parse(contents.getElementsByClassName("workspace_my_page_settings_save_json")[0].innerText.replaceAll("\\r\\n", "\\n").trim()));
    
        let right_undo = contents.getElementsByClassName("workspace_my_page_settings_top_right_undo")[0];
        let right_save = contents.getElementsByClassName("workspace_my_page_settings_top_right_save")[0];
    
        if (current == save) {
            right_undo.classList.remove("workspace_my_page_settings_top_right_undo_possible");
            right_save.classList.remove("workspace_my_page_settings_top_right_save_possible");
        } else {
            right_undo.classList.add("workspace_my_page_settings_top_right_undo_possible");
            right_save.classList.add("workspace_my_page_settings_top_right_save_possible");
        }
    }
}
setInterval(() => {
    if (getCurrentMenuName() == "workspace_my_page_settings") {
        let menuNumber = getCurrentMenuNumber();
        checkWorkspaceMyPageSettings(menuNumber);
    }
}, 10);








function workspaceMyPageSettingsUndo(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let save_json = JSON.parse(contents.getElementsByClassName("workspace_my_page_settings_save_json")[0].innerText);
    let details = contents.getElementsByClassName("workspace_my_page_settings_details");

    details[0].innerHTML = save_json["description"];

    //내 페이지 아트
    let art_right_item = contents.getElementsByClassName("workspace_my_page_settings_art_contents_right_item");
    let art_left = contents.getElementsByClassName("workspace_my_page_settings_art_contents_left")[0];
    let art = save_json["art"];
    if (art != null) {
        let type = art["type"];
        if (type == "image") {
            art_left.innerHTML = `
                <div class = "img_wrap" style = "width: 100%; height: 100%;">
                    <img src = "` + art["url"] + `" width = "` + art["width"] + `" height = "` + art["height"] + `" onload = "imageLoad(event);">
                </div>
            `;
        }
        if (type == "video") {
            art_left.innerHTML = `
                <div class = "video_wrap" style = "width: 100%; height: 100%;">
                    <video src = "` + art["url"] + `" thumbnail = "` + art["thumbnail"] + `" onplay = "videoLoad(event);" width = "` + art["width"] + `" height = "` + art["height"] + `" autoplay loop muted></video>
                </div>
            `;
        }
        //삭제 버튼 표시
        art_right_item[1].style.display = null;
    } else {
        art_left.textContent = "";

        //삭제 버튼 숨기기
        art_right_item[1].style.display = "none";
    }

    actionMessage(getLanguage("save_undo"));
}



























function workspaceMyPageSettingsSaveKeydown(event) {
    if (getCurrentMenuName() == "workspace_my_page_settings") {
        if (event.ctrlKey && event.keyCode == 83) {
            let menuNumber = getCurrentMenuNumber();
            
            let contents = document.getElementById("contents_" + menuNumber);
            let right_save = contents.getElementsByClassName("workspace_my_page_settings_top_right_save")[0];

            if (right_save.classList.contains("workspace_my_page_settings_top_right_save_possible")) {
                workspaceMyPageSettingsSave(menuNumber);
            } else {
                actionMessage(getLanguage("save_no_change"));
            }
            event.preventDefault();
        }
    }
}
window.addEventListener("keydown", workspaceMyPageSettingsSaveKeydown);

function workspaceMyPageSettingsSave(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let save_json = contents.getElementsByClassName("workspace_my_page_settings_save_json")[0];
    let save_data = getJsonWorkspaceMyPageSettings(menuNumber);
    save_json.innerText = JSON.stringify(save_data);

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/menu/workspace/php/my_page_settings/save.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                
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
    
    var formData = new FormData();
    if (save_data["description"] != null) {
        formData.append("description", save_data["description"]);
    }
    if (save_data["art"] != null) {
        formData.append("art", JSON.stringify(save_data["art"]));
    }

    xhr.send(formData);
}






































function moreButtonWorkspaceMyPageSettings(el, userNumber) {
    let slot = new Array();
    slot[0] = {
        'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.199 13.599c0.992 1.327 2.43 2.126 3.948 2.345s3.123-0.142 4.45-1.134c0.239-0.179 0.465-0.375 0.655-0.568l2.995-2.995c1.163-1.204 1.722-2.751 1.696-4.285s-0.639-3.061-1.831-4.211c-1.172-1.132-2.688-1.692-4.199-1.683-1.492 0.008-2.984 0.571-4.137 1.683l-1.731 1.721c-0.392 0.389-0.394 1.023-0.004 1.414s1.023 0.394 1.414 0.004l1.709-1.699c0.77-0.742 1.763-1.117 2.76-1.123 1.009-0.006 2.016 0.367 2.798 1.122 0.795 0.768 1.203 1.783 1.221 2.808s-0.355 2.054-1.11 2.836l-3.005 3.005c-0.114 0.116-0.263 0.247-0.428 0.37-0.885 0.662-1.952 0.902-2.967 0.756s-1.971-0.678-2.632-1.563c-0.331-0.442-0.957-0.533-1.4-0.202s-0.533 0.957-0.202 1.4zM14.801 10.401c-0.992-1.327-2.43-2.126-3.948-2.345s-3.124 0.142-4.451 1.134c-0.239 0.179-0.464 0.375-0.655 0.568l-2.995 2.995c-1.163 1.204-1.722 2.751-1.696 4.285s0.639 3.061 1.831 4.211c1.172 1.132 2.688 1.692 4.199 1.683 1.492-0.008 2.984-0.571 4.137-1.683l1.723-1.723c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-1.696 1.698c-0.77 0.742-1.763 1.117-2.76 1.123-1.009 0.006-2.016-0.367-2.798-1.122-0.795-0.768-1.203-1.783-1.221-2.808s0.355-2.054 1.11-2.836l3.005-3.005c0.114-0.116 0.263-0.247 0.428-0.37 0.885-0.662 1.952-0.902 2.967-0.756s1.971 0.678 2.632 1.563c0.331 0.442 0.957 0.533 1.4 0.202s0.533-0.957 0.202-1.4z"></path></svg>',
        'title': getLanguage("workspace_my_page_settings_more_button:my_page"),
        'onclick': 'loadMenu_user(' + userNumber + ');',
    }
    moreButton(el, slot, null);
}