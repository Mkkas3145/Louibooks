



function menuWriteQuestionsLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let deviceInfo = JSON.parse(contents.getElementsByClassName("device_info")[0].innerHTML);

    let selectWrapLeft = contents.getElementsByClassName("menu_my_account_details_item_select_wrap_left")[0];
    selectWrapLeft.innerHTML = getLanguage("menu_write_questions_type:0");

    let topTitle = contents.getElementsByClassName("menu_write_questions_top")[0];
    topTitle.innerHTML = getLanguage("menu_write_questions_title");

    let itemTitle = contents.getElementsByClassName("menu_write_questions_box_item_title");
    itemTitle[0].innerHTML = getLanguage("menu_write_questions_item_title:0");
    itemTitle[1].innerHTML = getLanguage("menu_write_questions_item_title:1");
    itemTitle[2].innerHTML = getLanguage("menu_write_questions_item_title:2");
    itemTitle[3].innerHTML = getLanguage("menu_write_questions_item_title:3");

    let textbox = contents.getElementsByClassName("menu_write_questions_box_item_textbox")[0].children[0];
    textbox.setAttribute("placeholder", getLanguage("input_placeholder:0"));

    let button = contents.getElementsByClassName("menu_write_questions_box_item_button_right")[0];
    button.innerHTML = getLanguage("menu_write_questions_submit_button");

    //사용자 정보
    let userInfoTitle = contents.getElementsByClassName("menu_write_questions_box_item_user_info_box_right_title");
    userInfoTitle[0].innerHTML = getLanguage("menu_write_questions_user_info:operating_system");
    userInfoTitle[1].innerHTML = getLanguage("menu_write_questions_user_info:program");
    let userInfoValue = contents.getElementsByClassName("menu_write_questions_box_item_user_info_box_right_value");
    userInfoValue[0].innerHTML = getLanguage("operating_system:" + deviceInfo["operatingSystem"]);
    userInfoValue[1].innerHTML = getLanguage("program:" + deviceInfo["program"]);
}

function checkButtonWriteQuestionsLoad(menuNumber) {
    function callback() {
        let contents = document.getElementById("contents_" + menuNumber);
        let button = contents.getElementsByClassName("menu_write_questions_box_item_button")[0];
        let textbox = contents.getElementsByClassName("menu_write_questions_box_item_textbox")[0].children[0];
        let content = textbox.innerText.trim();
        if (content == "") {
            button.classList.add("menu_write_questions_box_item_button_disabled");
        } else {
            button.classList.remove("menu_write_questions_box_item_button_disabled");
        }
    }
    window.requestAnimationFrame(callback);
}

function writeQuestionsSubmitButton(menuNumber) {
    confirmPopup(getLanguage("menu_write_questions_confirm_popup:title"), getLanguage("menu_write_questions_confirm_popup:description"), 'requestWriteQuestionsSubmit(' + menuNumber + ');');
}
function requestWriteQuestionsSubmit(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let type = Number.parseInt(contents.getElementsByClassName("menu_write_questions_box_item_select_wrap")[0].getAttribute("value"));
    let textbox = contents.getElementsByClassName("menu_write_questions_box_item_textbox")[0].children[0];
    let content = textbox.innerText.replaceAll('\n\n','\n').trim();

    let screenshot = new Array();
    let screenshotItem = contents.getElementsByClassName("menu_write_questions_box_item_screenshot")[0];
    let screenshotItems = screenshotItem.children;
    for (let i = 0; i < screenshotItems.length; i++) {
        if (screenshotItems[i].getElementsByTagName("img").length != 0) {
            let img = screenshotItems[i].getElementsByTagName("img")[0];
            let width = Number.parseInt(img.getAttribute("width"));
            let height = Number.parseInt(img.getAttribute("height"));
            screenshot[screenshot.length] = {
                'url': img.getAttribute("src"),
                'width': Number.parseInt(width),
                'height': Number.parseInt(height)
            };
        }
    }

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/user/questions/submission.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText.trim();
                
                if (xhrHtml == "submitted") {
                    deleteMenu(getCurrentMenuNumber());
                    actionMessage(getLanguage("menu_write_questions_submit_message:0"));
                } else if (xhrHtml == "changed") {
                    deleteMenu(getCurrentMenuNumber());
                    actionMessage(getLanguage("menu_write_questions_submit_message:1"));
                } else {
                    //오류 발생
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
    formData.append("type", type);
    formData.append("content", content);
    if (screenshot.length != 0) {
        formData.append("screenshot", JSON.stringify(screenshot));
    }
    formData.append("language", userLanguage);

    xhr.send(formData);
}
























function writeQuestionsImageUploadButton(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let screenshot = contents.getElementsByClassName("menu_write_questions_box_item_screenshot")[0];
    let input = screenshot.getElementsByTagName("input")[0];
    input.click();
}

var previousWriteQuestionsImageInfo = new Array();

function requestWriteQuestionsImageUpload(menuNumber, file) {
    let contents = document.getElementById("contents_" + menuNumber);
    let screenshot = contents.getElementsByClassName("menu_write_questions_box_item_screenshot")[0];
    let input = screenshot.getElementsByTagName("input")[0];
    
    if (previousWriteQuestionsImageInfo[file.name + "," + file.size + "," + file.type + "," + file.lastModified] != null) {
        writeQuestionsImageAddImage(menuNumber, previousWriteQuestionsImageInfo[file.name + "," + file.size + "," + file.type + "," + file.lastModified]);
        input.value = "";
        return;
    }

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

                writeQuestionsImageAddImage(menuNumber, json);
                
                //이미지 정보 저장
                previousWriteQuestionsImageInfo[file.name + "," + file.size + "," + file.type + "," + file.lastModified] = json;
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
    formData.append("type", "questions");

    xhr.send(formData);

    input.value = "";
}

function writeQuestionsImageAddImage(menuNumber, info) {
    let contents = document.getElementById("contents_" + menuNumber);
    let screenshot = contents.getElementsByClassName("menu_write_questions_box_item_screenshot")[0];
    
    //업로드 버튼 삭제
    let upload = screenshot.getElementsByClassName("menu_write_questions_box_item_screenshot_upload")[0];
    upload.remove();

    //이미지 추가
    let uniqueNumber = Math.floor(Math.random() * 999999999999);
    let newEl = document.createElement("div");
    newEl.classList.add("menu_write_questions_box_item_screenshot_item_wrap");
    newEl.classList.add("img_wrap");
    newEl.innerHTML = `
        <div class = "menu_write_questions_box_item_screenshot_item img_wrap md-ripples" unique_number = "` + uniqueNumber + `" onclick = "moreButtonWriteQuestionsImageDeleteImage(` + menuNumber + `, ` + uniqueNumber + `, event);" oncontextmenu = "moreButtonWriteQuestionsImageDeleteImage(` + menuNumber + `, ` + uniqueNumber + `, event);">
            <img src = "` + info["url"] + `" width = "` + info["width"] + `" height = "` + info["height"] + `" onload = "imageLoad(event);" alt = "">
        </div>
    `;
    let el = screenshot.appendChild(newEl);
    let rect = el.getBoundingClientRect();
    el.style.width = "0px";
    el.style.marginRight = "-15px";
    el.style.opacity = 0;
    function callback() {
        el.style.transition = "all 0.2s";
        el.style.width = (rect.width + "px");
        el.style.marginRight = "0px";
        el.style.opacity = 1;
        setTimeout(() => {
            el.style.transition = null;
            el.style.width = null;
            el.style.marginRight = null;
            el.style.opacity = null;
        }, 200);
    }
    window.requestAnimationFrame(callback);

    //업로드 버튼 추가
    newEl = document.createElement("div");
    newEl.classList.add("menu_write_questions_box_item_screenshot_upload");
    newEl.classList.add("md-ripples");
    newEl.setAttribute("onclick", "writeQuestionsImageUploadButton(" + menuNumber + ");");
    newEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="a"><rect width="50" height="50"></rect></clipPath></defs><g id="b" clip-path="url(#a)"><g clip-path="url(#a)"><rect width="3" height="25" rx="1.5" transform="translate(0 25)"></rect><rect width="3" height="25" rx="1.5" transform="translate(47 25)"></rect><rect width="50" height="3" rx="1.5" transform="translate(0 47)"></rect><rect width="3" height="34" rx="1.5" transform="translate(27 35.5) rotate(180)"></rect><rect width="3" height="17.526" rx="1.5" transform="translate(37.928 12.393) rotate(135)"></rect><rect width="3" height="17" rx="1.5" transform="translate(15.193 14.142) rotate(-135)"></rect></g></g></svg>
    `;
    screenshot.appendChild(newEl);

    actionMessage(getLanguage("menu_write_questions_screenshot_message:0"));
}
function moreButtonWriteQuestionsImageDeleteImage(menuNumber, uniqueNumber, event) {
    let slot = new Array();
    slot[0] = {
        'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 28"><path d="M8 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM12 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM16 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM18 22.813v-14.812h-14v14.812c0 0.75 0.422 1.188 0.5 1.188h13c0.078 0 0.5-0.438 0.5-1.188zM7.5 6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094 0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5 0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375 0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391 2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094 2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z"></path></svg>',
        'title': getLanguage("delete"),
        'onclick': 'writeQuestionsImageDeleteImage(' + menuNumber + ', ' + uniqueNumber + ');',
        'class': 'more_button_item_delete',
    };
    moreButton(null, slot, event);
}
function writeQuestionsImageDeleteImage(menuNumber, uniqueNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let screenshot = contents.getElementsByClassName("menu_write_questions_box_item_screenshot")[0];
    let items = screenshot.children;
    let el = null;
    for (let i = 0; i < items.length; i++) {
        if (items[i].tagName.toLowerCase() == "div") {
            let item = items[i].children[0];
            if (item.getAttribute("unique_number") == uniqueNumber) {
                el = items[i];
                break;
            }
        }
    }
    let rect = el.getBoundingClientRect();
    el.style.width = (rect.width + "px");
    el.style.marginRight = "0px";
    el.style.opacity = 1;
    function callback() {
        el.style.transition = "all 0.2s";
        el.style.width = "0px";
        el.style.marginRight = "-15px";
        el.style.opacity = 0;
        setTimeout(() => {
            el.remove();
        }, 200);
    }
    window.requestAnimationFrame(callback);

    actionMessage(getLanguage("menu_write_questions_screenshot_message:1"));
}













function getWriteQuestionsTypeItems() {
    let items = new Array();
    items[0] = {
        "title": getLanguage("menu_write_questions_type:0"),
        "value": 0
    }
    items[1] = {
        "title": getLanguage("menu_write_questions_type:1"),
        "value": 1
    }
    items[2] = {
        "title": getLanguage("menu_write_questions_type:2"),
        "value": 2
    }
    return items;
}