

function workspacePartLocalizationLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    let localizationInfo = JSON.parse(contents.getElementsByClassName("localization_info")[0].innerHTML);
    if (localizationInfo.length != 0) {
        for (let i = 0; i < localizationInfo.length; i++) {
            addItemWorkspacePartLocalization(menuNumber, localizationInfo[i]);
        }
    } else {
        workspacePartLocalizationNoData(menuNumber);
    }

    let title = contents.getElementsByClassName("workspace_part_localization_title")[0];
    title.innerHTML = getLanguage("menu_name:workspace_part_localization");
    let create_language = contents.getElementsByClassName("workspace_part_localization_top_create_language")[0].getElementsByTagName("span")[0];
    create_language.innerHTML = getLanguage("menu_workspace_localization_create_language");
    
    //데이터 없음
    let no_data = contents.getElementsByClassName("menu_workspace_part_localization_no_data")[0];
    no_data.getElementsByClassName("menu_workspace_part_localization_no_data_title")[0].innerHTML = getLanguage("workspace_localization_no_data");
    no_data.getElementsByClassName("menu_workspace_part_localization_no_data_description")[0].innerHTML = getLanguage("no_data_description");

    checkWorkspacePartLocalization(menuNumber);
}
function workspacePartLocalizationNoData(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    let no_data = contents.getElementsByClassName("menu_workspace_part_localization_no_data")[0];
    no_data.style.display = "flex";
}
function checkWorkspacePartLocalization(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let createLanguageButton = contents.getElementsByClassName("workspace_part_localization_top_create_language")[0]; 
    let item = contents.getElementsByClassName("workspace_part_contents_localization_item");

    if ((item.length + 1) >= languages.length) {
        createLanguageButton.style.display = "none";
    } else {
        createLanguageButton.style.display = null;
    }
}



function addItemWorkspacePartLocalization(menuNumber, info, isAni) {
    (isAni == null) ? isAni = false : null;

    let contents = document.getElementById("contents_" + menuNumber);
    let partInfo = JSON.parse(contents.getElementsByClassName("info")[0].innerHTML);
    let items = contents.getElementsByClassName("workspace_part_localization_items")[0];

    //
    let no_data = contents.getElementsByClassName("menu_workspace_part_localization_no_data")[0];
    no_data.style.display = "none";

    let data = {
        "edit": true,
        "type": partInfo["type"],
        "partNumber": info["partNumber"],
        "language": info["language"],
        "thumbnailImage": info["thumbnailImage"],
        "title": info["title"]
    }

    let newEl = document.createElement("div");
    newEl.classList.add("workspace_part_contents_localization_item");
    newEl.setAttribute("language", info["language"]);
    newEl.innerHTML = `
        <div class = "workspace_part_contents_localization_item_left">
            <img src = "` + getImageUrlCountry(null, info["language"]) + `" onload = "imageLoad(event);" alt = "">
        </div>
        <div class = "workspace_part_contents_localization_item_center">
            <div class = "workspace_part_contents_localization_item_center_title">
                ` + getLanguage("language:" + info["language"]) + ` (` + info["language"] + `)
            </div>
            <div class = "workspace_part_contents_localization_item_center_description">
                ` + info["title"] + `
            </div>
        </div>
        <div class = "workspace_part_contents_localization_item_right">
            <div class = "workspace_part_contents_localization_item_right_item md-ripples" onclick = "workspacePartLocalizationEditLanguageButton(this);" onmouseenter = "hoverInformation(this, getLanguage('menu_workspace_localization_item_button:edit'));">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-4.438,42.27v0L.4,28.587,21.847,7.145a2.12,2.12,0,0,1,1.506-.632,1.945,1.945,0,0,1,1.387.567l7.071,7.071a1.944,1.944,0,0,1,.567,1.433,2.125,2.125,0,0,1-.632,1.459L10.3,38.487-4.436,42.27ZM23.387,9.839h0L3.162,30.064-.327,38.621l9.154-2.892L29.052,15.5,23.387,9.839Z" transform="translate(5.102 6.536)"></path><path d="M28.7,19.1a1.987,1.987,0,0,1-1.414-.586l-7.071-7.071a2,2,0,0,1,0-2.828l6.368-6.368a2,2,0,0,1,2.829,0l7.071,7.071a2,2,0,0,1,0,2.828L30.116,18.51A1.987,1.987,0,0,1,28.7,19.1ZM27.995,5.067h0l-4.95,4.95,5.666,5.665,4.95-4.949L27.995,5.067Z" transform="translate(12.102 -0.464)"></path></g></svg>
            </div>
            <div class = "workspace_part_contents_localization_item_right_item md-ripples" onclick = "deleteItemWorkspacePartLocalizationButton(` + menuNumber + `, ` + info["partNumber"] + `, '` + info["language"] + `');" onmouseenter = "hoverInformation(this, getLanguage('menu_workspace_localization_item_button:delete'));">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="50" height="3" rx="1.5" transform="translate(0 11)"></rect><path d="M31,39H5a5.006,5.006,0,0,1-5-5V0H4.932A2,2,0,0,0,3,2V34a2,2,0,0,0,2,2H31a2,2,0,0,0,2-2V2a2,2,0,0,0-1.914-2L36,0V34A5.006,5.006,0,0,1,31,39Z" transform="translate(7 11)"></path><path d="M5,14,0,14V5A5.006,5.006,0,0,1,5,0H21a5.006,5.006,0,0,1,5,5v9H21.007A2,2,0,0,0,23,12V5a2,2,0,0,0-2-2H5A2,2,0,0,0,3,5v7a2,2,0,0,0,2,2H5Z" transform="translate(12)"></path><rect width="3" height="15" rx="1.5" transform="translate(24 22)"></rect><rect width="3" height="15" rx="1.5" transform="translate(33 22)"></rect><rect width="3" height="15" rx="1.5" transform="translate(15 22)"></rect></g></svg>
            </div>
        </div>
        <div class = "workspace_part_contents_localization_item_data" style = "display: none;">
            ` + JSON.stringify(data) + `
        </div>
    `;
    
    let el = items.appendChild(newEl);
    if (isAni == true) {
        let height = el.clientHeight;
        el.style.height = "0px";
        el.style.transition = "all 0.2s";
        function callback() {
            el.style.animation = "addWorkspacePartLocalizationItem 0.2s forwards";
            el.style.height = height + "px";
            setTimeout(() => {
                el.style.animation = null;
                el.style.height = null;
            }, 200);
        }
        window.requestAnimationFrame(callback);
    }

    checkWorkspacePartLocalization(menuNumber);
}



















function deleteItemWorkspacePartLocalizationButton(menuNumber, partNumber, language) {
    confirmPopup(getLanguage("confirm_popup_title:delete"), getLanguage("confirm_popup_subject:delete"), 'requestDeleteItemWorkspacePartLocalization(' + menuNumber + ', ' + partNumber + ', \''  + language + '\');');
}
function requestDeleteItemWorkspacePartLocalization(menuNumber, partNumber, language) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("workspace_part_localization_items")[0];
    let item = contents.getElementsByClassName("workspace_part_contents_localization_item");
    for (let i = 0; i < item.length; i++) {
        if (item[i].getAttribute("language") == language) {
            item = item[i];
            break;
        }
    }

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/menu/workspace/php/part/localization/delete.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText.trim();
                
                if (xhrHtml == "success") {
                    let height = item.clientHeight;
                    item.style.height = height + "px";
                    item.style.transition = "all 0.2s";
                    function callback() {
                        item.style.animation = "deleteWorkspacePartLocalizationItem 0.2s forwards";
                        item.style.height = "0px";
                        item.style.marginBottom = "-20px";
                        setTimeout(() => {
                            item.remove();
                            if (items.innerHTML.trim() == "") {
                                workspacePartLocalizationNoData(menuNumber);
                            }
                            checkWorkspacePartLocalization(menuNumber);
                        }, 200);
                    }
                    window.requestAnimationFrame(callback);

                    actionMessage(getLanguage("workspace_localization_delete_language_message"));
                } else if (xhrHtml == "no permission") {
                    actionMessage(getLanguage("no_permission"));
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
    formData.append("language", language);

    xhr.send(formData);
}




































function workspacePartLocalizationCreateLanguageButton(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let info = JSON.parse(contents.getElementsByClassName("info")[0].innerHTML);
    let item = contents.getElementsByClassName("workspace_part_contents_localization_item");

    let alreadyCreatedLanguage = new Array();
    alreadyCreatedLanguage[0] = info["originalLanguage"];
    for (let i = 0; i < item.length; i++) {
        alreadyCreatedLanguage[alreadyCreatedLanguage.length] = item[i].getAttribute("language");
    }

    //partNumber = 작품 번호
    //alreadyCreatedLanguage = 이미 생성된 언어
    let data = {
        "type": info["type"],
        "partNumber": info["partNumber"],
        "alreadyCreatedLanguage": alreadyCreatedLanguage
    }

    openPopupContents("workspace_part_localization_create_language", null, data);
}








































function workspacePartLocalizationEditLanguageButton(el) {
    let parent = el.parentElement.parentElement;
    let data = JSON.parse(parent.getElementsByClassName("workspace_part_contents_localization_item_data")[0].innerHTML);

    openPopupContents("workspace_part_localization_create_language", null, data);
}