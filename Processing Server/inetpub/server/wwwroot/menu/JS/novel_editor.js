

function novelEditorLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let editor_json = contents.getElementsByClassName("editor_json")[0];
    let json = JSON.parse(editor_json.innerText);

    //제목
    let title = json["title"];
    let dm_title = contents.getElementsByClassName("novel_editor_title")[0];
    dm_title.innerText = title;

    //내용
    let lines = json["lines"];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        if (line["type"] == "text") {
            addItemNovelEditor(menuNumber, line["content"], "doesn't exist", true, true, true);
        } else if (line["type"] == "image") {
            let info = {
                "url": line["url"],
                "width": line["width"],
                "height": line["height"],
            }
            addImageItemNovelEditor(menuNumber, info, "doesn't exist");
        }
    }

    checkNovelEditorItemLine(menuNumber);
}

var previousNovelEditorFocusElement = new Array();

function novelEditorTextFocus(event) {
    let target = event.target;

    let parent = target.parentNode;
    parent.classList.add("novel_editor_item_focus");

    target.addEventListener("blur", novelEditorTextBlur);
    showCaretBar = true;
    caretBarFocusElement = target;
    previousNovelEditorFocusElement[getCurrentMenuNumber()] = target;
}
function novelEditorTextBlur(event) {
    let target = event.target;

    let parent = target.parentNode;
    parent.classList.remove("novel_editor_item_focus");

    target.removeEventListener("blur", novelEditorTextBlur);
    showCaretBar = false;
    caretBarFocusElement = null;
}
function addItemNovelEditor(menuNumber, text, focusElement, isNoAni, isNoCheckLine, isNoFocus) {
    (text == null) ? text = "" : null;
    (isNoAni == null) ? isNoAni = false : null;
    (isNoCheckLine == null) ? isNoCheckLine = false : null;
    (isNoFocus == null) ? isNoFocus = false :null;
    
    //포커스된 앨리먼트
    if (focusElement == null && focusElement != "doesn't exist") {
        focusElement = document.activeElement;
        if (focusElement != null && focusElement.classList.contains("novel_editor_item_text") == false) {
            focusElement = null;
        } else {
            focusElement = focusElement.parentNode.parentNode;
        }
    }

    let textNumber = Math.floor(Math.random() * 999999999999);
    let html = getHtmlNovelEditorItem(menuNumber, textNumber);
    let newEl = document.createElement("div");
    newEl.setAttribute("ondragenter", "novelEditorItemDrag(this);");
    newEl.innerHTML = html;
    let box = document.getElementById("novel_editor_contents_box_" + menuNumber);
    let el = null;
    if (focusElement != null) {
        el = box.insertBefore(newEl, focusElement.nextSibling);
    } else {
        el = box.appendChild(newEl);
    }
    let dm_text = el.getElementsByClassName("novel_editor_item_text")[0];
    dm_text.innerText = text;
    
    el.style.transition = "all 0.2s";

    if (isNoAni == false) {
        let item = el.getElementsByClassName("novel_editor_item")[0];
        let height = el.clientHeight;
        el.style.height = "0px";
        item.style.animation = "addNovelEditorItem 0.2s forwards";
        setTimeout(() => {
            el.style.height = height + "px";
        }, 10);
        setTimeout(() => {
            el.style.height = "max-content";
        }, 210);
    }
    if (isNoCheckLine == false) {
        checkNovelEditorItemLine(menuNumber);
    }
    if (isNoFocus == false) {
        setCurrentCursorPosition(dm_text, dm_text.innerText.length);
    }

    return textNumber;
}

function novelEditorItemDrag(el) {
    let target = el;

    target.setAttribute("ondrop", "novelEditorItemDragUpload(this, event);");
    target.setAttribute("ondragover", "novelEditorItemDragOver(this, event);");
    target.setAttribute("ondragend", "novelEditorItemDragEnd(this);");
    target.setAttribute("ondragleave", "novelEditorItemDragEnd(this);");
    target.setAttribute("ondragexit", "novelEditorItemDragEnd(this);");
}
function novelEditorItemDragOver(el, event) {
    el.classList.add("novel_editor_drag");
    
    event.preventDefault();
}
function novelEditorItemDragEnd(el) {
    el.classList.remove("novel_editor_drag");
}
function novelEditorItemDragUpload(el, event) {
    novelEditorItemDragEnd(el);

    let menuNumber = getCurrentMenuNumber();
    let target = el;
    let file = event.dataTransfer.files[0];
    let fileType = file.type.split("/")[0];
    if (fileType == "image") {
        previousNovelEditorFocusElement[menuNumber] = target;
        requestNovelEditorImageUpload(menuNumber, file);
    }
    
    //
    event.preventDefault();
}

function deleteItemNovelEditor(menuNumber, el) {
    let item = el.getElementsByClassName("novel_editor_item")[0];
    item.setAttribute("isDelete", true);
    el.style.transition = "all 0.2s";
    let height = el.clientHeight;
    el.style.height = height + "px";
    setTimeout(() => {
        el.style.height = "0px";
        item.style.animation = "deleteNovelEditorItem 0.2s forwards";
    }, 10);
    item.getElementsByClassName("novel_editor_item_text")[0].blur();

    setTimeout(() => {
        el.remove();
        checkNovelEditorItemLine(menuNumber);
    }, 210);

    //
    let newFocus = null;
    if (el.previousSibling != null && el.previousSibling.data == undefined) {
        newFocus = el.previousSibling.getElementsByClassName("novel_editor_item_text")[0];
    } else if (el.nextSibling != null && el.nextSibling.data == undefined) {
        newFocus = el.nextSibling.getElementsByClassName("novel_editor_item_text")[0];
    }

    if (newFocus != null) {
        setCurrentCursorPosition(newFocus, newFocus.innerText.length);
    }
}

function getHtmlNovelEditorItem(menuNumber, textNumber) {
    let html = ``;

    html = `
        <div class = "novel_editor_item" id = "novel_editor_item_text_` + textNumber + `" oncontextmenu = "novelEditorItemMoreButton(` + menuNumber + `, ` + textNumber + `, event);">
            <div class = "novel_editor_item_left">
                <div class = "novel_editor_item_left_bar"></div>
                <div class = "novel_editor_item_left_line"></div>
            </div>
            <div class = "novel_editor_item_text" spellcheck = "false" contenteditable = "true" onfocus = "novelEditorTextFocus(event);" onpaste = "novelEditorItemContenteditablePaste(event);" onkeydown = "novelEditorItemKeydown(event, ` + menuNumber + `);"></div>
        </div>
    `;

    return html;
}
function novelEditorItemMoreButton(menuNumber, textNumber, event) {
    let slot = new Array();
    slot[slot.length] = {
        'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.016 11.016q1.641 0 2.813 1.172t1.172 2.813-1.172 2.813-2.813 1.172h-2.016v2.016l-3-3 3-3v2.016h2.25q0.797 0 1.406-0.609t0.609-1.406-0.609-1.406-1.406-0.609h-13.266v-1.969h13.031zM20.016 5.016v1.969h-16.031v-1.969h16.031zM3.984 18.984v-1.969h6v1.969h-6z"></path></svg>',
        'title': getLanguage("cloud_novel_editor_bottom_add_sentence"),
        'onclick': 'novelEditorBottomAddSentence(' + menuNumber + ', ' + textNumber + ');',
    };
    slot[slot.length] = {
        'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 28"><path d="M8 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM12 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM16 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM18 22.813v-14.812h-14v14.812c0 0.75 0.422 1.188 0.5 1.188h13c0.078 0 0.5-0.438 0.5-1.188zM7.5 6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094 0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5 0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375 0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391 2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094 2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z"></path></svg>',
        'title': getLanguage("delete"),
        'onclick': 'deleteItemNovelEditorMore(' + menuNumber + ', ' + textNumber + ');',
        'class': 'more_button_item_delete',
    };
    moreButton(null, slot, event);
}
function novelEditorBottomAddSentence(menuNumber, textNumber) {
    let el = document.getElementById("novel_editor_item_text_" + textNumber);
    let focusElement = el.parentElement;

    addItemNovelEditor(menuNumber, null, focusElement);
}
function deleteItemNovelEditorMore(menuNumber, textNumber) {
    let el = document.getElementById("novel_editor_item_text_" + textNumber);
    deleteItemNovelEditor(menuNumber, el.parentElement);
}

function novelEditorItemContenteditablePaste(e) {
    e.preventDefault();

    // 클립보드에서 복사된 텍스트 얻기
    var pastedData = event.clipboardData ||  window.clipboardData;
    var textData = pastedData.getData('Text');
    let textList = textData.split("\n");

    window.document.execCommand('insertHTML', false, textList[0].replaceAll("\r", "").replaceAll("\t", ""));
    for (let i = 1; i < textList.length; i++) {
        let str = textList[i];
        str = str.replaceAll("\r", "").replaceAll("\t", "");
        addItemNovelEditor(getCurrentMenuNumber(), str, null, true, true, false);
    }
    checkNovelEditorItemLine(getCurrentMenuNumber());
}
function novelEditorItemKeydown(event, menuNumber) {
    if (event.keyCode == 13) {
        let target = event.target;
        let selection = getSelectionIndices(target);

        let value = target.innerText;
        let length = value.length;
        let endText = "";
        let text = "";
        for (let i = 0; i < length; i++) {
            if (selection["start"] > i) {
                text += value[i];
            }
            if (selection["end"] <= i) {
                endText += value[i];
            }
        }
        target.innerText = text;

        let textNumber = addItemNovelEditor(menuNumber, endText);
        let textEl = document.getElementById("novel_editor_item_text_" + textNumber);
        textEl = textEl.getElementsByClassName("novel_editor_item_text")[0];
        setCurrentCursorPosition(textEl, 0);

        event.preventDefault();
    }
    if (event.keyCode == 8) {
        let target = event.target;
        let selection = getSelectionIndices(target);

        if (selection["start"] == selection["end"] && selection["start"] == 0) {
            let el = target.parentNode.parentNode;
            let value = target.innerText;
            let length = value.length;

            let newFocus = null;
            if (el.previousSibling != null && el.previousSibling.data == undefined) {
                newFocus = el.previousSibling.getElementsByClassName("novel_editor_item_text")[0];
            } else if (el.nextSibling != null && el.nextSibling.data == undefined) {
                newFocus = el.nextSibling.getElementsByClassName("novel_editor_item_text")[0];
            }
            if (newFocus != null || value == "") {
                let addText = "";
                for (let i = 0; i < length; i++) {
                    if (selection["start"] <= i) {
                        addText += value[i];
                    }
                }

                deleteItemNovelEditor(menuNumber, el);

                if (newFocus != null) {
                    let focusIndex = newFocus.innerText.length;
                    newFocus.innerText += addText;
                    setCurrentCursorPosition(newFocus, focusIndex);
                }

                event.preventDefault();
            }
        }
    }
    //자동 텍스트 추가
    if (event.shiftKey == true && event.keyCode == 222 && event.ctrlKey == false) {
        novelEditorAddText("“", "”");
        event.preventDefault();
    }
    if (event.shiftKey == false && event.keyCode == 222 && event.ctrlKey == false) {
        novelEditorAddText("‘", "’");
        event.preventDefault();
    }
    if (event.shiftKey == true && event.keyCode == 219 && event.ctrlKey == false) {
        novelEditorAddText("『", "』");
        event.preventDefault();
    }
    if (event.shiftKey == false && event.keyCode == 219 && event.ctrlKey == false) {
        novelEditorAddText("「", "」");
        event.preventDefault();
    }
    //원본 텍스트
    //'
    if (event.shiftKey == false && event.keyCode == 222 && event.ctrlKey == true) {
        document.execCommand('insertText', false, '\'');
        event.preventDefault();
    }
    //"
    if (event.shiftKey == true && event.keyCode == 222 && event.ctrlKey == true) {
        document.execCommand('insertText', false, '"');
        event.preventDefault();
    }
    //{
    if (event.shiftKey == true && event.keyCode == 219 && event.ctrlKey == true) {
        document.execCommand('insertText', false, '{');
        event.preventDefault();
    }
    //[
    if (event.shiftKey == false && event.keyCode == 219 && event.ctrlKey == true) {
        document.execCommand('insertText', false, '[');
        event.preventDefault();
    }
}
function novelEditorAddText(startText, endText) {
    sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);

        document.execCommand('insertText', false, startText + endText);

        let caretPos = range.endOffset;
        setCurrentCursorPosition(document.activeElement, caretPos + 1);
    }
}

function checkNovelEditorItemLine(menuNumber) {
    let box = document.getElementById("novel_editor_contents_box_" + menuNumber);
    let line = box.getElementsByClassName("novel_editor_item_left_line");

    if (line.length != 0) {
        for (let i = 0; i < line.length; i++) {
            line[i].innerHTML = "<span>" + (i + 1) + "</span>";
        }
    
        let maxWidth = 0;
        for (let i = line.length - 1; (i >= 0 && i > (line.length - 11)); i--) {
            let span = line[i].getElementsByTagName("span")[0];
            let rect = span.getBoundingClientRect();
            if (maxWidth < rect.width) {
                maxWidth = rect.width;
            }
        }
        for (let i = 0; i < line.length; i++) {
            line[i].style.width = (maxWidth + "px");
        }

        let text = document.getElementsByClassName("novel_editor_item_text");
        for (let i = 0; i < text.length; i++) {
            let addWidth = 20;
            text[i].style.width = "calc(100% - " + (maxWidth + addWidth) + "px)";
        }
    }
}
function getNovelEditorItemLineCount(menuNumber) {
    let box = document.getElementById("novel_editor_contents_box_" + menuNumber);
    let items = box.getElementsByClassName("novel_editor_item");
    let count = 0;

    for (let i = 0; i < items.length; i++) {
        if (items[i].getAttribute("isDelete") == null) {
            count ++;
        }
    }
    
    return count;
}

function titleKeydown(event) {
    if (window.event.keyCode == 13) {
        addItemNovelEditor(getCurrentMenuNumber(), null, event.target);
        event.preventDefault();
    }
}










/*
    에디터 내용 저장
*/

function getNovelEditorJson(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let title = contents.getElementsByClassName("novel_editor_title")[0];
    let items = contents.getElementsByClassName("novel_editor_item");

    if (title != null && items != null) {
        //그 외 정보
        let text_count = 0;
        let line_count = 0;

        let data = {
            "title": title.innerText,
        };
        let data_contents = new Array();
        
        for (let i = 0; i < items.length; i++) {
            let text = items[i].getElementsByClassName("novel_editor_item_text");
            let image = items[i].getElementsByClassName("novel_editor_image");
            
            if (text.length != 0) {
                data_contents[i] = {
                    "type": "text",
                    "content": text[0].innerText
                }
                text_count += text[0].innerText.replace(/(\s*)/g, "").length;
                line_count ++;
            } else if (image.length != 0) {
                let img = image[0].getElementsByTagName("img")[0];
                data_contents[i] = {
                    "type": "image",
                    "url": img.getAttribute("src"),
                    "width": img.getAttribute("width"),
                    "height": img.getAttribute("height")
                }
            }
        }
        data["lines"] = data_contents;

        //그 외 정보 반영
        let dm_text_count = document.getElementById("novel_editor_header_info_box_item_" + menuNumber + "_text_count");
        let dm_line_count = document.getElementById("novel_editor_header_info_box_item_" + menuNumber + "_line_count");
        dm_text_count.innerText = commas(text_count);
        dm_line_count.innerText = commas(line_count);

        return data;
    }
}
function novelEditorCopyJsonInfo(menuNumber) {
    let json = getNovelEditorJson(menuNumber);

    let el = document.createElement("textarea");
    document.body.appendChild(el);
    el.value = JSON.stringify(json);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    actionMessage(getLanguage("copy_message"));
}
function novelEditorCopyLines(menuNumber) {
    let json = getNovelEditorJson(menuNumber);
    let lines = json["lines"];
    let lines_length = lines.length;
    let text = "";

    for (let i = 0; i < lines_length; i++) {
        if (lines[i]["type"] == "text") {
            text += (lines[i]["content"] + "\n");
        }
        if (lines[i]["type"] == "image") {
            text += (lines[i]["url"] + "\n");
        }
    }

    let el = document.createElement("textarea");
    document.body.appendChild(el);
    el.value = text.trim();
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    actionMessage(getLanguage("copy_message"));
}

function novelEditorSave(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let number = document.getElementById("novel_editor_number_" + menuNumber).value;
    let json = JSON.stringify(getNovelEditorJson(menuNumber));
    
    loading();

    //요청
    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/cloud/save.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;

                let editor_json = contents.getElementsByClassName("editor_json")[0];
                editor_json.innerText = json;

                if (xhrHtml == "max cloud size") {
                    actionMessage(getLanguage("cloud_max_cloud_size"));
                } else if (xhrHtml == "saved") {
                    actionMessage(getLanguage("save_saved"));
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
    formData.append("number", number);
    formData.append("data", json);
    
    xhr.send(formData);
}

function novelEditorSaveKeydown(event) {
    if (getCurrentMenuName() == "novel_editor") {
        if (event.ctrlKey && event.keyCode == 83) {
            let menuNumber = getCurrentMenuNumber();
            if (isNovelEditorSavePossible(menuNumber) == true) {
                novelEditorSave(menuNumber);
            } else {
                actionMessage(getLanguage("save_no_change"));
            }
            event.preventDefault();
        }
    }
}
window.addEventListener("keydown", novelEditorSaveKeydown);

function checkNovelEditorSaveButton(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let header_right_save = contents.getElementsByClassName("novel_editor_header_right_save")[0];

    if (header_right_save != null) {
        if (isNovelEditorSavePossible(menuNumber) == false) {
            header_right_save.classList.remove("novel_editor_header_right_save_activate");
        } else {
            header_right_save.classList.add("novel_editor_header_right_save_activate");
        }
    }
}

setInterval(() => {
    if (getCurrentMenuName() == "novel_editor") {
        checkNovelEditorSaveButton(getCurrentMenuNumber());
    }
}, 100);

function isNovelEditorSavePossible(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let current_json = JSON.stringify(getNovelEditorJson(menuNumber));
    if (contents.getElementsByClassName("editor_json").length != 0) {
        let editor_json = JSON.stringify(JSON.parse(contents.getElementsByClassName("editor_json")[0].textContent));
        if (current_json.trim() == editor_json.trim()) {
            return false;
        } else {
            return true;
        }
    }
}









































function moreButtonNovelEditor(menuNumber, el) {
    let slot = new Array();
    slot[0] = {
        'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19 2h-18c-0.553 0-1 0.447-1 1v14c0 0.552 0.447 1 1 1h18c0.553 0 1-0.448 1-1v-14c0-0.552-0.447-1-1-1zM18 16h-16v-12h16v12zM14.315 10.877l-3.231 1.605-3.77-6.101-3.314 7.619h12l-1.685-3.123zM13.25 9c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25-1.25 0.56-1.25 1.25 0.56 1.25 1.25 1.25z"></path></svg>',
        'title': getLanguage("cloud_novel_editor_more_image_upload"),
        'onclick': 'novelEditorImageUploadButton(' + menuNumber + ');',
    };
    slot[1] = {
        'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M6 6v-4c0-1.1 0.9-2 2-2h10c1.105 0 2 0.895 2 2v0 10c0 1.105-0.895 2-2 2v0h-4v4c0 1.105-0.895 2-2 2v0h-10c-1.105 0-2-0.895-2-2v0-10c0-1.1 0.9-2 2-2h4zM8 6h4c1.105 0 2 0.895 2 2v0 4h4v-10h-10v4zM2 8v10h10v-10h-10z"></path></svg>',
        'title': getLanguage("cloud_novel_editor_copy_lines"),
        'onclick': 'novelEditorCopyLines(' + menuNumber + ');',
    };
    slot[2] = {
        'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M6 6v-4c0-1.1 0.9-2 2-2h10c1.105 0 2 0.895 2 2v0 10c0 1.105-0.895 2-2 2v0h-4v4c0 1.105-0.895 2-2 2v0h-10c-1.105 0-2-0.895-2-2v0-10c0-1.1 0.9-2 2-2h4zM8 6h4c1.105 0 2 0.895 2 2v0 4h4v-10h-10v4zM2 8v10h10v-10h-10z"></path></svg>',
        'title': getLanguage("copy_json_info"),
        'onclick': 'novelEditorCopyJsonInfo(' + menuNumber + ');',
    };
    slot[3] = {
        'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16.057 31.957c0.639-0.005 1.271-0.039 1.901-0.125 1.44-0.184 2.857-0.577 4.195-1.151 1.879-0.803 3.597-1.961 5.057-3.391 1.337-1.319 2.456-2.868 3.253-4.569 0.679-1.463 1.159-3.032 1.36-4.635 0.199-1.547 0.18-3.128-0.060-4.665-0.199-1.28-0.559-2.528-1.057-3.717-0.32-0.748-0.7-1.468-1.139-2.156-1.557-2.449-3.815-4.419-6.413-5.735-0.924-0.473-1.897-0.86-2.896-1.159h-0.007c0.159 0.084 0.32 0.176 0.46 0.268 0.16 0.099 0.319 0.195 0.468 0.3 0.759 0.513 1.459 1.103 2.079 1.773 1.417 1.527 2.396 3.397 2.957 5.388 0.379 1.309 0.579 2.664 0.66 4.023 0.059 0.991 0.059 1.988-0.063 2.972-0.199 1.693-0.739 3.347-1.637 4.795-0.66 1.071-1.52 2.025-2.537 2.779-1.659 1.237-3.836 1.976-5.915 1.485-0.339-0.081-0.68-0.195-0.997-0.344-0.361-0.165-0.72-0.369-1.039-0.599-0.62-0.415-1.18-0.913-1.659-1.475-0.58-0.693-1.059-1.481-1.399-2.329-0.419-1.075-0.639-2.229-0.659-3.387-0.040-1.697 0.3-3.404 1.139-4.893 0.56-0.992 1.319-1.861 2.217-2.557 0.3-0.237 0.619-0.444 0.939-0.639l0.021-0.009c-0.621-0.14-1.28-0.201-1.921-0.16-0.557 0.039-1.097 0.14-1.637 0.319-0.479 0.16-0.939 0.361-1.359 0.6-0.34 0.199-0.677 0.42-0.977 0.66-0.281 0.24-0.56 0.479-0.82 0.74-1.497 1.537-2.357 3.576-2.696 5.675-0.2 1.297-0.2 2.615-0.121 3.935 0.14 1.859 0.521 3.715 1.26 5.415 0.459 1.059 1.057 2.036 1.797 2.897 1.139 1.316 2.579 2.337 4.176 2.975 0.9 0.361 1.859 0.62 2.817 0.72 0.099 0.020 0.199 0.020 0.279 0.020zM12.145 31.427c-0.219-0.093-0.419-0.199-0.6-0.304-0.199-0.111-0.4-0.224-0.599-0.345-0.78-0.483-1.477-1.049-2.119-1.7-1.459-1.517-2.436-3.423-2.996-5.441-0.379-1.379-0.58-2.803-0.66-4.229-0.059-0.937-0.039-1.857 0.061-2.776 0.18-1.676 0.66-3.335 1.499-4.773 0.599-1.059 1.417-1.997 2.377-2.737 0.659-0.499 1.399-0.92 2.177-1.2 1.099-0.399 2.277-0.519 3.417-0.36 0.44 0.060 0.877 0.161 1.279 0.3 0.039 0 0.039 0 0.060 0.040 0.020 0.020 0.060 0.020 0.080 0.040 0.060 0.021 0.139 0.060 0.22 0.099 0.319 0.16 0.639 0.361 0.939 0.56 1.199 0.839 2.177 1.997 2.796 3.336 0.56 1.219 0.82 2.579 0.841 3.917 0.019 1.439-0.24 2.876-0.86 4.195-0.74 1.579-1.997 2.917-3.517 3.776 0.12 0.040 0.24 0.060 0.361 0.1 0.3 0.059 0.599 0.099 0.917 0.099 1.957 0.060 3.856-0.879 5.253-2.196 0.26-0.24 0.5-0.5 0.72-0.78 0.3-0.36 0.58-0.719 0.819-1.097 0.319-0.5 0.58-1 0.819-1.539 0.301-0.719 0.539-1.459 0.679-2.219 0.261-1.339 0.281-2.696 0.199-4.035-0.18-2.696-0.897-5.393-2.456-7.632-0.24-0.339-0.479-0.659-0.74-0.959-0.439-0.5-0.919-0.959-1.417-1.379-0.56-0.46-1.18-0.879-1.817-1.22-0.657-0.297-1.437-0.596-2.256-0.797l-0.4-0.080c-0.279-0.040-0.56-0.059-0.845-0.080-0.433-0.020-0.892-0.013-1.353 0.021-0.939 0.060-1.883 0.213-2.816 0.449-4.475 1.155-8.389 4.273-10.473 8.411-0.668 1.319-1.14 2.728-1.416 4.176-0.319 1.657-0.36 3.364-0.139 5.033 0.16 1.36 0.499 2.697 1.037 3.969 0.303 0.76 0.681 1.499 1.1 2.197 1.459 2.377 3.577 4.315 6.013 5.653 0.917 0.521 1.877 0.92 2.876 1.26 0.301 0.099 0.6 0.199 0.919 0.279z"></path></svg>',
        'title': getLanguage("open_json_viewer"),
        'onclick': `openPopupContents('json_viewer', null, '` + JSON.stringify(getNovelEditorJson(menuNumber)).replaceAll("\\\"", "&quot;").replaceAll("\"", "&2quot;") + `');`,
    };
    moreButton(el, slot);
}

function novelEditorImageUploadButton(menuNumber) {
    let input = document.getElementById("novel_editor_image_upload_" + menuNumber);
    input.click();
}

var previousNovelEditorImageInfo = new Array();

function requestNovelEditorImageUpload(menuNumber, file) {
    let input = document.getElementById("novel_editor_image_upload_" + menuNumber);
    if (file == null) {
        file = input.files[0];
    }

    if (previousNovelEditorImageInfo[file.name + "," + file.size + "," + file.type + "," + file.lastModified] != null) {
        addImageItemNovelEditor(menuNumber, previousNovelEditorImageInfo[file.name + "," + file.size + "," + file.type + "," + file.lastModified]);
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
                
                addImageItemNovelEditor(menuNumber, json);
                //이미지 정보 저장
                previousNovelEditorImageInfo[file.name + "," + file.size + "," + file.type + "," + file.lastModified] = json;

                actionMessage(getLanguage("cloud_novel_editor_image_file_upload"));
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
    formData.append("type", "novel_image");

    xhr.send(formData);

    input.value = "";
}

function addImageItemNovelEditor(menuNumber, info, focusElement) {
    //포커스된 앨리먼트
    if (focusElement == null && focusElement != "doesn't exist") {
        if (previousNovelEditorFocusElement[menuNumber] != null) {
            if (previousNovelEditorFocusElement[menuNumber].classList.contains("novel_editor_item_text") == true) {
                focusElement = previousNovelEditorFocusElement[menuNumber].parentNode.parentNode;
            } else {
                focusElement = previousNovelEditorFocusElement[menuNumber];
            }
        }
    }

    let html = getHtmlNovelEditorImageItem(menuNumber, info);
    let newEl = document.createElement("div");
    newEl.setAttribute("ondragenter", "novelEditorItemDrag(this);");
    newEl.innerHTML = html;
    let box = document.getElementById("novel_editor_contents_box_" + menuNumber);
    let el = null;
    if (focusElement != null) {
        el = box.insertBefore(newEl, focusElement.nextSibling);
    } else {
        el = box.appendChild(newEl);
    }
    let item = el.getElementsByClassName("novel_editor_image")[0];
    
    el.style.transition = "all 0.2s";
    let height = el.clientHeight;
    el.style.height = "0px";
    item.style.animation = "addNovelEditorItem 0.2s forwards";
    setTimeout(() => {
        el.style.height = height + "px";
    }, 10);
    setTimeout(() => {
        el.style.height = "max-content";
        item.style.animation = null;
    }, 210);

    previousNovelEditorFocusElement[menuNumber] = el;
}
function getHtmlNovelEditorImageItem(menuNumber, info) {
    let imageNumber = Math.floor(Math.random() * 999999999999);
    let html = '';

    html = `
        <div class = "novel_editor_item">
            <div class = "novel_editor_image img_wrap md-ripples" id = "novel_editor_image_` + imageNumber + `" onclick = "novelEditorImageItemMoreButton(` + menuNumber + `, ` + imageNumber + `, event);" oncontextmenu = "novelEditorImageItemMoreButton(` + menuNumber + `, ` + imageNumber + `, event);">
                <img src = "` + info["url"] + `" width = "` + info["width"] + `" height = "` + info["height"] + `" onload = "imageLoad(event);">
            </div>
        </div>
    `;

    return html;
}
function deleteImageItemNovelEditor(imageNumber) {
    let item = document.getElementById("novel_editor_image_" + imageNumber);
    let el = item.parentElement.parentElement;

    el.style.transition = "all 0.2s";
    let height = el.clientHeight;
    el.style.height = height + "px";
    setTimeout(() => {
        el.style.height = "0px";
        item.style.animation = "deleteNovelEditorItem 0.2s forwards";
    }, 10);

    setTimeout(() => {
        el.remove();
    }, 210);
}




function novelEditorImageItemMoreButton(menuNumber, imageNumber, event) {
    let slot = new Array();
    slot[0] = {
        'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.016 11.016q1.641 0 2.813 1.172t1.172 2.813-1.172 2.813-2.813 1.172h-2.016v2.016l-3-3 3-3v2.016h2.25q0.797 0 1.406-0.609t0.609-1.406-0.609-1.406-1.406-0.609h-13.266v-1.969h13.031zM20.016 5.016v1.969h-16.031v-1.969h16.031zM3.984 18.984v-1.969h6v1.969h-6z"></path></svg>',
        'title': getLanguage("cloud_novel_editor_bottom_add_sentence"),
        'onclick': 'novelEditorImageBottomAddSentence(' + menuNumber + ', ' + imageNumber + ');',
    };
    slot[1] = {
        'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 28"><path d="M8 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM12 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM16 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM18 22.813v-14.812h-14v14.812c0 0.75 0.422 1.188 0.5 1.188h13c0.078 0 0.5-0.438 0.5-1.188zM7.5 6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094 0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5 0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375 0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391 2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094 2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z"></path></svg>',
        'title': getLanguage("delete"),
        'onclick': 'deleteImageItemNovelEditor(' + imageNumber + ');',
        'class': 'more_button_item_delete',
    };
    moreButton(null, slot, event);
}

function novelEditorImageBottomAddSentence(menuNumber, imageNumber) {
    let item = document.getElementById("novel_editor_image_" + imageNumber);
    let focusElement = item.parentElement.parentElement;

    addItemNovelEditor(menuNumber, null, focusElement);
}


