

function popupNotifications(el) {
    let property = {
        "onscroll": "checkPopupNotificationsMoreLoad();"
    }
    popupElement(el, 'top', getHtmlPopupNotifications(), property);
    requestPopupNotifications();
}

function getHtmlPopupNotifications() {
    let html = '';

    html = `
        <div class = "popup_notifications">
            <div class = "popup_notifications_top">
                <div class = "popup_notifications_top_left">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M42.282,39.4h0l-.226,0H1.251C.557,39.4.2,39.3.065,39.075c-.221-.363.152-1.085.769-2.282,1.4-2.715,4.315-8.364,4.6-18.745a21.434,21.434,0,0,1,1.682-8.6,15.31,15.31,0,0,1,4.146-5.562A17.322,17.322,0,0,1,22.285,0a16.042,16.042,0,0,1,10.5,4.409,18.085,18.085,0,0,1,5.659,13.638c.141,10.246,2.863,15.713,4.326,18.65.617,1.238.989,1.986.755,2.364C43.375,39.3,43,39.4,42.282,39.4ZM22.187,3.026c-6.61,0-13.7,4.015-13.76,15.285a46.872,46.872,0,0,1-2.09,13.2,29.949,29.949,0,0,1-1.958,4.9L39.3,36.4s0,0-.006-.009a27.524,27.524,0,0,1-1.879-4.733,47.874,47.874,0,0,1-2-13.351C35.34,7.268,27.28,3.075,22.217,3.026Z" transform="translate(3.124 0.378)"></path><path d="M6.4,0a6.4,6.4,0,0,1,6.4,6.4H0A6.4,6.4,0,0,1,6.4,0Z" transform="translate(30.704 50) rotate(180)"></path></g></svg>
                    ` + getLanguage("popup_notifications_title") + `
                </div>
                <div class = "popup_notifications_top_right popup_notifications_top_right_disabled md-ripples" onclick = "popupClearNotificationsButton();">
                    ` + getLanguage("popup_notifications_all_delete") + `
                </div>
            </div>
            <div class = "popup_notifications_items" style = "display: none;"></div>
            <div class = "popup_notifications_contents_loading" style = "padding: 20px; display: none;">
                <div class="showbox"><div class="loader" style="width: 35px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle></svg></div></div>
            </div>
            <div class = "popup_notifications_no_data" style = "display: none;">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M42.282,39.4h0l-.226,0H1.251C.557,39.4.2,39.3.065,39.075c-.221-.363.152-1.085.769-2.282,1.4-2.715,4.315-8.364,4.6-18.745a21.434,21.434,0,0,1,1.682-8.6,15.31,15.31,0,0,1,4.146-5.562A17.322,17.322,0,0,1,22.285,0a16.042,16.042,0,0,1,10.5,4.409,18.085,18.085,0,0,1,5.659,13.638c.141,10.246,2.863,15.713,4.326,18.65.617,1.238.989,1.986.755,2.364C43.375,39.3,43,39.4,42.282,39.4ZM22.187,3.026c-6.61,0-13.7,4.015-13.76,15.285a46.872,46.872,0,0,1-2.09,13.2,29.949,29.949,0,0,1-1.958,4.9L39.3,36.4s0,0-.006-.009a27.524,27.524,0,0,1-1.879-4.733,47.874,47.874,0,0,1-2-13.351C35.34,7.268,27.28,3.075,22.217,3.026Z" transform="translate(3.124 0.378)"></path><path d="M6.4,0a6.4,6.4,0,0,1,6.4,6.4H0A6.4,6.4,0,0,1,6.4,0Z" transform="translate(30.704 50) rotate(180)"></path><rect width="3" height="62" rx="1.5" transform="translate(2.019 4.14) rotate(-45)"></rect></g></svg>
                <div class = "popup_notifications_no_data_title">
                    ` + getLanguage("popup_notifications_no_data:title") + `
                </div>
                <div class = "popup_notifications_no_data_description">
                    ` + getLanguage("popup_notifications_no_data:description") + `
                </div>
            </div>
            <div class = "popup_notifications_loading">
                <div class="showbox"><div class="loader" style="width: 40px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle></svg></div></div>
            </div>
        </div>
    `;

    return html;
}
function addItemPopupNotifications(info) {
    let popup_element = document.getElementsByClassName("popup_element_box")[0];
    let items = popup_element.getElementsByClassName("popup_notifications_items")[0];

    //회차 페이지일 경우
    let hidePopupElement = null;
    let menuName = getCurrentMenuName();
    if (menuName == "novel_viewer" || menuName == "image_format_viewer") {
        
    }

    let newEl = document.createElement("div");
    newEl.setAttribute("number", info["number"]);
    newEl.setAttribute("oncontextmenu", "popupNotificationsItemMoreButton(" + info["number"] + ", event);");
    newEl.innerHTML = getHtmlNotificationsItem(info);

    items.appendChild(newEl);
}






var popupNotificationsLoadNumbers = null;

function requestPopupNotifications() {
    let popup_element = document.getElementsByClassName("popup_element_box")[0];
    let loading = popup_element.getElementsByClassName("popup_notifications_loading")[0];
    let items = popup_element.getElementsByClassName("popup_notifications_items")[0];
    let no_data = popup_element.getElementsByClassName("popup_notifications_no_data")[0];
    let right_button = popup_element.getElementsByClassName("popup_notifications_top_right")[0];

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/user_notifications/getInfoNumbers.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);
                
                let previousHeight = popup_element.offsetHeight;

                //
                popupNotificationsLoadNumbers = info["numbers"].split(",");

                let notificationsInfo = info["info"];
                if (notificationsInfo != null && notificationsInfo.length != 0) {
                    for (let i = 0; i < notificationsInfo.length; i++) {
                        addItemPopupNotifications(notificationsInfo[i]);

                        let array = popupNotificationsLoadNumbers;
                        array = array.remove("" + notificationsInfo[i]["number"]);
                        popupNotificationsLoadNumbers = array;
                    }
                    right_button.classList.remove("popup_notifications_top_right_disabled");
                    items.style.display = null;

                    checkPopupNotificationsMoreLoading();
                } else {
                    no_data.style.display = null;
                }
                loading.style.display = "none";

                let height = popup_element.offsetHeight;
                popup_element.style.height = previousHeight + "px";
                popup_element.style.transition = "height 0.2s";
                popup_element.style.overflow = "hidden";
                function callback() {
                    popup_element.style.height = height + "px";
                    setTimeout(() => {
                        popup_element.style.height = null;
                        popup_element.style.transition = null;
                        popup_element.style.overflow = null;
                    }, 200);
                }
                window.requestAnimationFrame(callback);

                //알림 확인함
                requestPopupConfirmNotifications();
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
    formData.append("lang", userLanguage);
    formData.append("sort", 0);
    formData.append("type", 0);

    xhr.send(formData);
}

function requestPopupConfirmNotifications() {
    let new_notifications = document.getElementsByClassName("header_right_button_new_notifications");
    for (let i = 0; i < new_notifications.length; i++) {
        new_notifications[i].style.display = "none";
    }
    loginStatus["not_confirm_notifications"] = 0;

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/user_notifications/confirm.php");
    
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

    xhr.send(formData);
}
































function popupNotificationsItemMoreButton(number, event) {
    let slot = new Array();
    slot[0] = {
        'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 28"><path d="M8 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM12 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM16 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM18 22.813v-14.812h-14v14.812c0 0.75 0.422 1.188 0.5 1.188h13c0.078 0 0.5-0.438 0.5-1.188zM7.5 6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094 0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5 0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375 0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391 2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094 2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z"></path></svg>',
        'title': getLanguage("delete"),
        'onclick': 'popupDeleteNotificationsItem(' + number + ');',
        'class': 'more_button_item_delete',
    };
    moreButton(null, slot, event);
}

function popupDeleteNotificationsItem(number) {
    let popup_element = document.getElementsByClassName("popup_element_box")[0];
    let items = popup_element.getElementsByClassName("popup_notifications_items")[0];
    let children = items.children;
    let no_data = popup_element.getElementsByClassName("popup_notifications_no_data")[0];
    let right_button = popup_element.getElementsByClassName("popup_notifications_top_right")[0];

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/user_notifications/delete.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                
                let item = null;
                for (let i = 0; i < children.length; i++) {
                    if (children[i].getAttribute("number") == number) {
                        item = children[i];
                        break;
                    }
                }

                let height = item.clientHeight;
                item.style.height = height + "px";
                item.style.transition = "all 0.2s";
                function callback() {
                    if (children.length <= 1) {
                        let previousHeight = popup_element.offsetHeight;

                        //
                        items.textContent = "";
                        items.style.display = "none";
                        no_data.style.display = null;
                        right_button.classList.add("popup_notifications_top_right_disabled");

                        //
                        let height = popup_element.offsetHeight;
                        popup_element.style.height = previousHeight + "px";
                        popup_element.style.transition = "height 0.2s";
                        popup_element.style.overflow = "hidden";
                        function callback() {
                            popup_element.style.height = height + "px";
                            setTimeout(() => {
                                popup_element.style.height = null;
                                popup_element.style.transition = null;
                                popup_element.style.overflow = null;
                            }, 200);
                        }
                        window.requestAnimationFrame(callback);
                    } else {
                        item.style.height = "0px";
                        item.style.marginBottom = "-10px";
                        item.style.animation = "deleteMenuHistoryNotificationsItem 0.2s forwards";
                        setTimeout(() => {
                            item.remove();
                        }, 200);
                    }
                }
                window.requestAnimationFrame(callback);
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

    xhr.send(formData);
}


























function popupClearNotificationsButton() {
    confirmPopup(getLanguage("confirm_popup_title:delete"), getLanguage("confirm_popup_subject:delete"), 'requestPopupClearNotifications();');
}
function requestPopupClearNotifications() {
    let popup_element = document.getElementsByClassName("popup_element_box")[0];
    let items = popup_element.getElementsByClassName("popup_notifications_items")[0];
    let no_data = popup_element.getElementsByClassName("popup_notifications_no_data")[0];
    let right_button = popup_element.getElementsByClassName("popup_notifications_top_right")[0];

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/user_notifications/clear.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                
                let previousHeight = popup_element.offsetHeight;

                //
                items.textContent = "";
                items.style.display = "none";
                no_data.style.display = null;
                right_button.classList.add("popup_notifications_top_right_disabled");

                //
                let height = popup_element.offsetHeight;
                popup_element.style.height = previousHeight + "px";
                popup_element.style.transition = "height 0.2s";
                popup_element.style.overflow = "hidden";
                function callback() {
                    popup_element.style.height = height + "px";
                    setTimeout(() => {
                        popup_element.style.height = null;
                        popup_element.style.transition = null;
                        popup_element.style.overflow = null;
                    }, 200);
                }
                window.requestAnimationFrame(callback);
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

    xhr.send(formData);
}




































function showPopupNotificationsMoreLoading() {
    let popup_element = document.getElementsByClassName("popup_element_box")[0];
    let loading = popup_element.getElementsByClassName("popup_notifications_contents_loading")[0];
    loading.style.display = "block";
}
function hidePopupNotificationsMoreLoading() {
    let popup_element = document.getElementsByClassName("popup_element_box")[0];
    let loading = popup_element.getElementsByClassName("popup_notifications_contents_loading")[0];
    loading.style.display = "none";
}
function checkPopupNotificationsMoreLoading() {
    if (popupNotificationsLoadNumbers == null || popupNotificationsLoadNumbers.length == 0) {
        hidePopupNotificationsMoreLoading();
        popupNotificationsLoadNumbers = null;
    } else {
        showPopupNotificationsMoreLoading();
    }
}

var isPopupNotificationsMoreLoad = null;

function checkPopupNotificationsMoreLoad() {
    let popup_element = document.getElementsByClassName("popup_element_box")[0];
    
    let boxSize = 75;

    let scrollPercent = ((popup_element.scrollTop + popup_element.clientHeight) / (popup_element.scrollHeight - boxSize)) * 100;
    if (scrollPercent >= 100) {
        if (isPopupNotificationsMoreLoad == null) {
            isPopupNotificationsMoreLoad = true;
            moreLoadPopupNotifications();
        }
    }
}

function moreLoadPopupNotifications() {
    if (popupNotificationsLoadNumbers == null || popupNotificationsLoadNumbers == '' || popupNotificationsLoadNumbers.length == 0) {
        popupNotificationsLoadNumbers = null;
        isPopupNotificationsMoreLoad = null;
        return;
    }

    let numbers = popupNotificationsLoadNumbers;
    let numbersMaxCount = (numbers.length >= 25) ? 25 : numbers.length;
    numbers = numbers.splice(0, numbersMaxCount);

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/user_notifications/getInfo.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                for (let i = 0; i < info.length; i++) {
                    addItemPopupNotifications(info[i]);

                    let array = popupNotificationsLoadNumbers;
                    array = array.remove("" + info[i]["number"]);
                    popupNotificationsLoadNumbers = array;
                }

                isPopupNotificationsMoreLoad = null;
                checkPopupNotificationsMoreLoading();
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
    formData.append("lang", userLanguage);
    formData.append("numbers", numbers.join(","));

    xhr.send(formData);
}
