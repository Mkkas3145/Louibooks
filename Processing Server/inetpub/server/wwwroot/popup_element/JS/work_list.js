

function popupWorkList(el, workNumber) {
    if (loginStatus['isLogin'] == true) {
        popupElement(el, 'top', getHtmlPopupWorkList(workNumber));
    } else {
        loadMenu_login();
    }
}

function getHtmlPopupWorkList(workNumber) {
    let html = '';

    let items = '';
    let itemsLength = 0;
    for (let i = 0; i < myWorkList.length; i++) {
        //권한
        if (myWorkList[i]["userNumber"] != loginStatus["number"]) {
            continue;
        }
        itemsLength ++;

        //체크된 상태 여부
        let checked = false;
        let workNumbers = myWorkList[i]['workNumbers'];
        for (let j = 0; j < workNumbers.length; j++) {
            if (workNumbers[j] == workNumber) {
                checked = true;
            }
        }
        let count = myWorkList[i]['count'];
        if (checked == true) {
            count -= 1;
        }
        items += `
            <div>
                <div class = "popup_work_list_item md-ripples" checked = "` + checked + `" number = "` + myWorkList[i]["number"] + `" onclick = "toggleCheckedPopupWorkList(this, ` + workNumber + `);" oncontextmenu = "moreButtonPopupWorkListItem(this, event);">
                    <div class = "popup_work_list_item_left">
                        <div class = "popup_work_list_item_left_check_box">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5 11-11 2 2-13 13z"></path></svg>
                        </div>
                    </div>
                    <div class = "popup_work_list_item_right">
                        <div class = "popup_work_list_item_right_title">
                            ` + myWorkList[i]['title'] + `
                        </div>
                        <div class = "popup_work_list_item_right_count">
                            <div class = "popup_work_list_item_right_count_0">
                                ` + getLanguage("item_count").replaceAll("{R:0}", commas(count)) + `
                            </div>
                            <div class = "popup_work_list_item_right_count_1">
                                ` + getLanguage("item_count").replaceAll("{R:0}", commas(count + 1)) + `
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    if (itemsLength == 0) {
        items = `
            <div class = "popup_no_work_list">
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7.734 9.984h-1.734q-1.641 0-2.813 1.195t-1.172 2.836 1.172 2.813 2.813 1.172h9.75zM3 5.25l1.266-1.266 16.734 16.734-1.266 1.266-2.016-1.969h-11.719q-2.484 0-4.242-1.758t-1.758-4.242q0-2.438 1.688-4.172t4.078-1.828zM19.359 10.031q1.922 0.141 3.281 1.57t1.359 3.398q0 2.578-2.109 4.078l-1.453-1.453q1.547-0.844 1.547-2.625 0-1.219-0.891-2.109t-2.109-0.891h-1.5v-0.516q0-2.297-1.594-3.891t-3.891-1.594q-1.313 0-2.531 0.609l-1.5-1.453q1.828-1.172 4.031-1.172 2.531 0 4.711 1.781t2.648 4.266z"></path></svg>
                ` + getLanguage("no_work_list") + `
            </div>
        `;
    }

    html = `
        <div class = "popup_work_list">
            <div class = "popup_work_list_top">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="37" height="3" rx="1.5" transform="translate(1 2)"></rect><rect width="37" height="3" rx="1.5" transform="translate(1 18)"></rect><rect width="20" height="3" rx="1.5" transform="translate(1 34)"></rect><g transform="translate(2.518 0.541)"><rect width="3" height="17" rx="1.5" transform="translate(23.151 35.438) rotate(-45)"></rect><rect width="3" height="23" rx="1.5" transform="translate(44.884 26.041) rotate(30)"></rect></g></g></svg>
                ` + getLanguage("work_open_work_list") + `
            </div>
            <div class = "popup_work_list_items">
                ` + items + `
            </div>
            <div class = "popup_work_list_line"></div>
            <div class = "popup_work_list_add md-ripples" onclick = "popupAddWorkList(` + workNumber + `);">
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0 4c0-1.1 0.9-2 2-2h7l2 2h7c1.105 0 2 0.895 2 2v0 10c0 1.105-0.895 2-2 2v0h-16c-1.105 0-2-0.895-2-2v0-12zM2 6v10h16v-10h-16zM9 10v-2h2v2h2v2h-2v2h-2v-2h-2v-2h2z"></path></svg>
                ` + getLanguage("popup_work_list_create_button") + `
            </div>
        </div>
    `;

    return html;
}

function toggleCheckedPopupWorkList(el, workNumber) {
    let checked = el.getAttribute("checked");
    if (checked == "true") {
        el.setAttribute("checked", "false");
    } else if (checked == "false") {
        el.setAttribute("checked", "true");
    }

    let workListNumber = el.getAttribute("number");
    if (checked == "true") {
        requestPopupWorkListDeleteWork(workListNumber, workNumber);
    } else if (checked == "false") {
        requestPopupWorkListInsertWork(workListNumber, workNumber);
    }

    checkMyWorkListMenuWorkBottomButton(getCurrentMenuNumber());
}

function popupAddWorkList(workNumber) {
    let html = '';

    html = `
        <div class = "popup_work_list">
            <div class = "popup_add_work_list_top">
                <div class = "popup_add_work_list_top_back md-ripples" onclick = "popupAddWorkListBackButton(` + workNumber + `);">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"></rect><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"></rect></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"></rect></g></svg>
                </div>
                <div class = "popup_add_work_list_top_title">
                    ` + getLanguage("popup_work_list_create_button") + `
                </div>
            </div>
            <div class = "popup_add_work_list_contents">
                <div class = "popup_add_work_list_title">
                    ` + getLanguage("popup_add_work_list_title:title") + `
                </div>
                <div class = "popup_add_work_list_input">
                    <input type = "text" placeholder = "` + getLanguage("popup_add_work_list_input_placeholder") + `" onkeydown = "setTimeout(() => { checkInputPopupAddWorkList(this); }, 1);" onfocus = "popupAddWorkListInputFocus(this);" onblur = "popupAddWorkListInputBlur(this);">
                    <div class = "popup_add_work_list_input_line_wrap"></div>
                </div>
                <div class = "popup_add_work_list_title">
                    ` + getLanguage("popup_add_work_list_title:public_status") + `
                </div>
                <div class = "popup_add_work_list_input_public_status md-ripples" value = "2" onclick = "selectList(this, getAddWorkListPublicStateItems());">
                    <div class = "popup_add_work_list_input_public_status_title value_title">
                        ` + getLanguage("public_status:2") + `
                    </div>
                    <div class = "popup_add_work_list_input_public_status_icon">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17.418 6.109c0.272-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-7.908 7.83c-0.27 0.268-0.707 0.268-0.979 0l-7.908-7.83c-0.27-0.268-0.27-0.701 0-0.969s0.709-0.268 0.979 0l7.419 7.141 7.418-7.141z"></path></svg>
                    </div>
                </div>
            </div>
            <div class = "popup_add_work_list_bottom">
                <div class = "popup_add_work_list_bottom_button md-ripples" onclick = "requestPopupAddWorkList(` + workNumber + `);">
                    ` + getLanguage("popup_add_work_list_create_button") + `
                </div>
            </div>
        </div>
    `;

    setHtmlPopupElement(html);
}
function popupAddWorkListBackButton(workNumber) {
    setHtmlPopupElement(getHtmlPopupWorkList(workNumber));
}

function popupAddWorkListInputFocus(input) {
    let parent = input.parentElement;
    parent.classList.add("popup_add_work_list_input_focus");
}
function popupAddWorkListInputBlur(input) {
    let parent = input.parentElement;
    parent.classList.remove("popup_add_work_list_input_focus");
}
function checkInputPopupAddWorkList(input) {
    let parent = input.parentElement.parentElement.parentElement;
    let button = parent.getElementsByClassName("popup_add_work_list_bottom_button")[0];
    if (input.value.trim() != "") {
        button.classList.add("popup_add_work_list_bottom_button_activate");
    } else {
        button.classList.remove("popup_add_work_list_bottom_button_activate");
    }
}

function getAddWorkListPublicStateItems() {
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

function requestPopupAddWorkList(workNumber) {
    let popup_element_box = document.getElementsByClassName("popup_element_box")[0];
    let title = popup_element_box.getElementsByClassName("popup_add_work_list_input")[0].getElementsByTagName("input")[0].value.trim();
    let public_status = popup_element_box.getElementsByClassName("popup_add_work_list_input_public_status")[0].getAttribute("value");

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/work_list/create.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                insertMyWorkList(info[0]);

                actionMessage(getLanguage('work_list_create_message'));
                popupAddWorkListBackButton(workNumber);
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
    formData.append("title", title);
    formData.append("public_status", public_status);

    xhr.send(formData);
}

function moreButtonPopupWorkListItem(el, event) {
    let workListNumber = el.getAttribute('number');

    let slot = new Array();
    slot[0] = {
        'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 28"><path d="M8 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM12 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM16 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM18 22.813v-14.812h-14v14.812c0 0.75 0.422 1.188 0.5 1.188h13c0.078 0 0.5-0.438 0.5-1.188zM7.5 6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094 0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5 0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375 0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391 2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094 2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z"></path></svg>',
        'title': getLanguage("delete"),
        'onclick': 'deletePopupWorkListItemButton(' + workListNumber + ');',
        'class': 'more_button_item_delete',
    };
    moreButton(null, slot, event);
}
function deletePopupWorkListItemButton(workListNumber) {
    confirmPopup(getLanguage("confirm_popup_title:delete"), getLanguage("confirm_popup_subject:delete"), 'requestPopupDeleteWorkList(' + workListNumber + ');');
}

function requestPopupDeleteWorkList(workListNumber) {
    let menuNumber = getCurrentMenuNumber();
    let popup_element_box = document.getElementsByClassName("popup_element_box")[0];
    let items = popup_element_box.getElementsByClassName("popup_work_list_items")[0];

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/work_list/delete.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;

                deleteMyWorkList(workListNumber);

                let item = popup_element_box.getElementsByClassName('popup_work_list_item');
                let el = null;
                for (let i = 0; i < item.length; i++) {
                    let number = item[i].getAttribute('number');
                    if (number == workListNumber) {
                        el = item[i].parentElement;
                    }
                }
                let height = el.clientHeight;
                el.style.height = height + 'px';
                el.style.transition = 'all 0.2s';
                function callback() {
                    el.style.height = '0px';
                    el.style.marginTop = '-5px';
                    el.style.marginBottom = '5px';
                    el.style.animation = "deletePopupWorkList 0.2s forwards";
                    setTimeout(() => {
                        el.remove();

                        if (items.innerHTML.trim() == "") {
                            setHtmlPopupElement(getHtmlPopupWorkList(workListNumber));
                        }
                    }, 200);
                }
                window.requestAnimationFrame(callback);

                actionMessage(getLanguage('work_list_delete_message'));
                checkMyWorkListMenuWorkBottomButton(menuNumber);
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
    formData.append("workListNumber", workListNumber);

    xhr.send(formData);
}






function requestPopupWorkListInsertWork(workListNumber, workNumber) {
    insertWorkMyWorkList(workListNumber, workNumber);
    actionMessage(getLanguage('work_list_insert_work_message'));

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/work_list/insert_work.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;

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
    formData.append("workListNumber", workListNumber);
    formData.append("workNumber", workNumber);

    xhr.send(formData);
}

function requestPopupWorkListDeleteWork(workListNumber, workNumber) {
    deleteWorkMyWorkList(workListNumber, workNumber);
    actionMessage(getLanguage('work_list_delete_work_message'));

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/work_list/delete_work.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;

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
    formData.append("workListNumber", workListNumber);
    formData.append("workNumber", workNumber);

    xhr.send(formData);
}