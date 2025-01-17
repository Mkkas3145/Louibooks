

function workspacePartDetailsLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let info = JSON.parse(contents.getElementsByClassName("info")[0].innerHTML);

    //
    let undo = contents.getElementsByClassName("workspace_part_details_top_right_undo")[0];
    undo.innerHTML = getLanguage("workspace_details_undo");
    let save = contents.getElementsByClassName("workspace_part_details_top_right_save")[0];
    save.innerHTML = getLanguage("workspace_details_save");
    let title = contents.getElementsByClassName("workspace_part_details_title")[0];
    title.innerHTML = getLanguage("menu_name:workspace_part_details");

    //공개 상태
    let details = contents.getElementsByClassName("workspace_part_details");
    details[1].setAttribute("value", info["publicStatus"]);
    details[1].getElementsByClassName("value_title")[0].innerText = getLanguage("public_status:" + info["publicStatus"]);

    //
    let option_title = contents.getElementsByClassName("create_work_step2_option_title")[0];
    option_title.innerHTML = getLanguage("workspace_details_title:part_thumbnail");
    let input_top_title = contents.getElementsByClassName("create_work_input_top_title")[0];
    input_top_title.innerHTML = getLanguage("workspace_details_title:part_title");
    option_title = contents.getElementsByClassName("create_work_step2_option_title")[1];
    option_title.innerHTML = getLanguage("workspace_details_title:public_status");

    //
    let thumbnail_add_title = contents.getElementsByClassName("workspace_work_cover_add_title")[0];
    thumbnail_add_title.innerHTML = getLanguage("workspace_details_part_thumbnail_add:title");
    let thumbnail_add_description = contents.getElementsByClassName("workspace_work_cover_add_description")[0];
    thumbnail_add_description.innerHTML = getLanguage("workspace_details_part_thumbnail_add:description");
    let thumbnail_delete_title = contents.getElementsByClassName("workspace_work_cover_add_title")[1];
    thumbnail_delete_title.innerHTML = getLanguage("workspace_details_part_thumbnail_delete:title");
    let thumbnail_delete_description = contents.getElementsByClassName("workspace_work_cover_add_description")[1];
    thumbnail_delete_description.innerHTML = getLanguage("workspace_details_part_thumbnail_delete:description");
}

function getJsonWorkspacePartDetails(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let info = JSON.parse(contents.getElementsByClassName("info")[0].innerHTML);
    let details = contents.getElementsByClassName("workspace_part_details");

    if (contents.getElementsByClassName("workspace_work_cover").length != 0) {
        let thumbnail = contents.getElementsByClassName("workspace_work_cover_selected")[0].getElementsByTagName("img")[0];
        thumbnailImage = thumbnail.src;

        let thumbnail_value = contents.getElementsByClassName("workspace_work_cover")[0].getAttribute("value");
        if (thumbnail_value == "0") {
            thumbnailImage = info["coverImage"];
        }
    
        data = {
            'thumbnail_image': thumbnailImage,
            'title': details[0].value.trim(),
            'public_status': Number.parseInt(details[1].getAttribute("value")),
        };

        return data;
    }

    return null;
}
function checkWorkspacePartDetails(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    let currentJson = getJsonWorkspacePartDetails(menuNumber);
    let current = JSON.stringify(currentJson);
    let save = JSON.stringify(JSON.parse(contents.getElementsByClassName("workspace_part_save_json")[0].innerText.replaceAll("\\r\\n", "\\n").trim()));

    let right_undo = contents.getElementsByClassName("workspace_part_details_top_right_undo")[0];
    let right_save = contents.getElementsByClassName("workspace_part_details_top_right_save")[0];

    if (current == save || currentJson["title"].trim() == "") {
        right_undo.classList.remove("workspace_part_details_top_right_undo_possible");
        right_save.classList.remove("workspace_part_details_top_right_save_possible");
    } else {
        right_undo.classList.add("workspace_part_details_top_right_undo_possible");
        right_save.classList.add("workspace_part_details_top_right_save_possible");
    }
}
setInterval(() => {
    if (getCurrentMenuName() == "workspace_part_details") {
        let menuNumber = getCurrentMenuNumber();
        checkWorkspacePartDetails(menuNumber);
    }
}, 10);












function workspacePartDetailsUndo(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let info = JSON.parse(contents.getElementsByClassName("info")[0].innerText);
    let save_json = JSON.parse(contents.getElementsByClassName("workspace_part_save_json")[0].innerText);
    let details = contents.getElementsByClassName("workspace_part_details");

    //썸네일
    let thumbnail = contents.getElementsByClassName("workspace_work_cover")[0];
    let img = thumbnail.getElementsByTagName("img")[0];
    if (save_json["thumbnail_image"] != info["coverImage"]) {
        thumbnail.setAttribute("value", "1");
        thumbnail.getElementsByTagName("img")[0].src = save_json["thumbnail_image"];
        img.src = save_json["thumbnail_image"];
    } else {
        thumbnail.setAttribute("value", "0");
    }

    //작품 제목
    details[0].value = save_json["title"];

    //공개 상태
    details[1].setAttribute("value", save_json["public_status"]);
    details[1].getElementsByClassName("value_title")[0].innerText = getLanguage("public_status:" + save_json["public_status"]);

    actionMessage(getLanguage("save_undo"));
}




















function workspacePartDetailsDeleteThumbnail(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    //
    let thumbnail = contents.getElementsByClassName("workspace_work_cover")[0];
    thumbnail.setAttribute("value", "0");
}
function workspacePartDetailsThumbnailUploadButton(el) {
    let parent = el.parentElement;
    let input = parent.getElementsByTagName("input")[0];

    input.click();
}
function requestWorkspacePartDetailsThumbnailUpload(menuNumber, input) {
    let contents = document.getElementById("contents_" + menuNumber);
    let file = input.files[0];
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
                
                let thumbnail = contents.getElementsByClassName("workspace_work_cover")[0];
                let img = thumbnail.getElementsByTagName("img")[0];
                thumbnail.setAttribute("value", "1");
                img.style.animation = null;
                img.src = "";
                img.src = json["url"];
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
    formData.append("type", "work_part_thumbnail");

    xhr.send(formData);

    input.value = null;
}







































function workspacePartDetailsSaveKeydown(event) {
    if (getCurrentMenuName() == "workspace_part_details") {
        if (event.ctrlKey && event.keyCode == 83) {
            let menuNumber = getCurrentMenuNumber();
            
            let contents = document.getElementById("contents_" + menuNumber);
            let right_save = contents.getElementsByClassName("workspace_part_details_top_right_save")[0];

            if (right_save.classList.contains("workspace_part_details_top_right_save_possible")) {
                workspacePartDetailsSave(menuNumber);
            } else {
                actionMessage(getLanguage("save_no_change"));
            }
            event.preventDefault();
        }
    }
}
window.addEventListener("keydown", workspacePartDetailsSaveKeydown);

function workspacePartDetailsSave(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let info = JSON.parse(contents.getElementsByClassName("info")[0].innerText);
    let save_json = contents.getElementsByClassName("workspace_part_save_json")[0];
    let save_data = getJsonWorkspacePartDetails(menuNumber);
    save_json.innerText = JSON.stringify(save_data);

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/menu/workspace/php/part/details/save.php");
    
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
    formData.append("partNumber", info["partNumber"]);
    formData.append("thumbnailImage", save_data["thumbnail_image"]);
    formData.append("title", save_data["title"]);
    formData.append("publicStatus", save_data["public_status"]);

    xhr.send(formData);
}
































function moreButtonWorkspacePartDetails(el, isLatest, partNumber, partType) {
    let slot = new Array();
    slot[0] = {
        'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.199 13.599c0.992 1.327 2.43 2.126 3.948 2.345s3.123-0.142 4.45-1.134c0.239-0.179 0.465-0.375 0.655-0.568l2.995-2.995c1.163-1.204 1.722-2.751 1.696-4.285s-0.639-3.061-1.831-4.211c-1.172-1.132-2.688-1.692-4.199-1.683-1.492 0.008-2.984 0.571-4.137 1.683l-1.731 1.721c-0.392 0.389-0.394 1.023-0.004 1.414s1.023 0.394 1.414 0.004l1.709-1.699c0.77-0.742 1.763-1.117 2.76-1.123 1.009-0.006 2.016 0.367 2.798 1.122 0.795 0.768 1.203 1.783 1.221 2.808s-0.355 2.054-1.11 2.836l-3.005 3.005c-0.114 0.116-0.263 0.247-0.428 0.37-0.885 0.662-1.952 0.902-2.967 0.756s-1.971-0.678-2.632-1.563c-0.331-0.442-0.957-0.533-1.4-0.202s-0.533 0.957-0.202 1.4zM14.801 10.401c-0.992-1.327-2.43-2.126-3.948-2.345s-3.124 0.142-4.451 1.134c-0.239 0.179-0.464 0.375-0.655 0.568l-2.995 2.995c-1.163 1.204-1.722 2.751-1.696 4.285s0.639 3.061 1.831 4.211c1.172 1.132 2.688 1.692 4.199 1.683 1.492-0.008 2.984-0.571 4.137-1.683l1.723-1.723c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-1.696 1.698c-0.77 0.742-1.763 1.117-2.76 1.123-1.009 0.006-2.016-0.367-2.798-1.122-0.795-0.768-1.203-1.783-1.221-2.808s0.355-2.054 1.11-2.836l3.005-3.005c0.114-0.116 0.263-0.247 0.428-0.37 0.885-0.662 1.952-0.902 2.967-0.756s1.971 0.678 2.632 1.563c0.331 0.442 0.957 0.533 1.4 0.202s0.533-0.957 0.202-1.4z"></path></svg>',
        'title': getLanguage("more_button_workspace_part_details:go_to_part_page"),
        'onclick': 'loadMenu_viewer(' + partNumber + ', \'' + partType + '\');',
    }
    if (isLatest == true) {
        slot[1] = {
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 28"><path d="M8 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM12 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM16 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM18 22.813v-14.812h-14v14.812c0 0.75 0.422 1.188 0.5 1.188h13c0.078 0 0.5-0.438 0.5-1.188zM7.5 6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094 0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5 0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375 0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391 2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094 2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z"></path></svg>',
            'title': getLanguage("more_button_workspace_part_details:delete"),
            'onclick': 'deleteWorkspacePartDetails(' + partNumber + ');',
            'class': 'more_button_item_delete',
        };
    }
    moreButton(el, slot, null);
}
function deleteWorkspacePartDetails(partNumber) {
    confirmPopup(getLanguage("confirm_popup_title:delete"), getLanguage("confirm_popup_subject:delete"), 'requestDeleteWorkspacePartDetails(' + partNumber + ');');
}

function requestDeleteWorkspacePartDetails(partNumber) {
    let menuNumber = getCurrentMenuNumber();
    let contents = document.getElementById("contents_" + menuNumber);

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/work/delete_part.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText.trim();

                if (xhrHtml != "not the latest part") {
                    let info = contents.getElementsByClassName("info");
                    let workNumber = null;
                    if (info.length != 0) {
                        info = JSON.parse(info[0].innerHTML)
                        workNumber = info["workNumber"];
                    }
                    loadWorkspace_work_part_list(workNumber);
    
                    actionMessage(getLanguage("permanently_delete_item_message"));
                } else {
                    serverResponseErrorMessage(1);
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
    formData.append("partNumber", partNumber);

    xhr.send(formData);
}
















function getItemsWorkspacePartDetailsPublicState() {
    let items = new Array();
    items[0] = {
        "icon": '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 12h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v7c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-7c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM8 10v-3c-0.001-1.106 0.445-2.105 1.169-2.831 0.723-0.724 1.719-1.172 2.821-1.174 1.030 0.003 1.948 0.378 2.652 1 0.638 0.565 1.097 1.332 1.28 2.209 0.113 0.541 0.642 0.888 1.183 0.775s0.888-0.642 0.775-1.183c-0.272-1.307-0.958-2.454-1.912-3.299-1.060-0.938-2.452-1.504-3.973-1.502-1.657 0.002-3.157 0.676-4.241 1.762s-1.756 2.587-1.754 4.243v3h-1c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v7c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-7c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879z"></path></svg>',
        "title": getLanguage("public_status:0"),
        "description": getLanguage("public_status_description:0"),
        "value": 0
    }
    items[1] = {
        "icon": '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15 8h3c1.105 0 2.103 0.447 2.828 1.172s1.172 1.723 1.172 2.828-0.447 2.103-1.172 2.828-1.723 1.172-2.828 1.172h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1h3c1.657 0 3.158-0.673 4.243-1.757s1.757-2.586 1.757-4.243-0.673-3.158-1.757-4.243-2.586-1.757-4.243-1.757h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1zM9 16h-3c-1.105 0-2.103-0.447-2.828-1.172s-1.172-1.723-1.172-2.828 0.447-2.103 1.172-2.828 1.723-1.172 2.828-1.172h3c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3c-1.657 0-3.158 0.673-4.243 1.757s-1.757 2.586-1.757 4.243 0.673 3.158 1.757 4.243 2.586 1.757 4.243 1.757h3c0.552 0 1-0.448 1-1s-0.448-1-1-1zM8 13h8c0.552 0 1-0.448 1-1s-0.448-1-1-1h-8c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path></svg>',
        "title": getLanguage("public_status:1"),
        "description": getLanguage("public_status_description:1"),
        "value": 1
    }
    items[2] = {
        "icon": '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 12h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v7c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-7c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM18 10v-3c0-1.657-0.673-3.158-1.757-4.243s-2.586-1.757-4.243-1.757-3.158 0.673-4.243 1.757-1.757 2.586-1.757 4.243v3h-1c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v7c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-7c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM8 10v-3c0-1.105 0.447-2.103 1.172-2.828s1.723-1.172 2.828-1.172 2.103 0.447 2.828 1.172 1.172 1.723 1.172 2.828v3z"></path></svg>',
        "title": getLanguage("public_status:2"),
        "description": getLanguage("public_status_description:2"),
        "value": 2
    }
    return items;
}