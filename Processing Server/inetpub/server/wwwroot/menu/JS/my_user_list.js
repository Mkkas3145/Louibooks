

var myUserListLoadNumbers = new Array();

function myUserListLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    let userListInfo = JSON.parse(contents.getElementsByClassName("user_list_info")[0].innerHTML);
    let numbers = userListInfo["numbers"].split(",");
    let info = userListInfo["info"];

    myUserListLoadNumbers[menuNumber] = numbers;

    if (info != null && info.length != 0) {
        for (let i = 0; i < info.length; i++) {
            addItemMyUserListLoad(menuNumber, info[i]);
    
            let array = myUserListLoadNumbers[menuNumber];
            array = array.remove("" + info[i]["userNumber"]);
            myUserListLoadNumbers[menuNumber] = array;
        }
        checkMyUserListMoreLoading(menuNumber);
    } else {
        myUserListNoData(menuNumber);
    }

    //데이터 없음
    let no_data = contents.getElementsByClassName("menu_my_user_list_no_data")[0];
    no_data.getElementsByClassName("menu_my_user_list_no_data_title")[0].innerHTML = getLanguage("my_user_list_no_data");
    no_data.getElementsByClassName("menu_my_user_list_no_data_description")[0].innerHTML = getLanguage("no_data_description");

    let sort_title = contents.getElementsByClassName("sort_box_title");
    sort_title[0].innerHTML = getLanguage("my_user_list_select_sort:1");
}
function myUserListNoData(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let no_data = contents.getElementsByClassName("menu_my_user_list_no_data")[0];
    no_data.style.display = "flex";
}

function addItemMyUserListLoad(menuNumber, info) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("menu_my_user_list_items")[0];

    let no_data = contents.getElementsByClassName("menu_my_user_list_no_data")[0];
    no_data.style.display = "none";

    let newEl = document.createElement("div");
    newEl.classList.add("visible_element");
    newEl.classList.add("variable_element");
    newEl.classList.add("menu_my_user_list_item");
    newEl.classList.add("md-ripples");
    newEl.setAttribute("user_number", info["userNumber"]);
    newEl.setAttribute("onclick", "loadMenu_user(" + info["userNumber"] + ");");
    newEl.setAttribute("oncontextmenu", "myUserListMoreItems(event, " + menuNumber + ", " + info["userNumber"] + ");");
    newEl.innerHTML = `
        <div class = "menu_my_user_list_item_profile immutable_element">
            <div class = "profile_element">
                <div class = "profile_info">` + JSON.stringify(info["profileInfo"]) + `</div>
                <div class = "profile_image"></div>
            </div>
        </div>
        <div class = "menu_my_user_list_item_info">
            <div class = "menu_my_user_list_item_info_nickname">
                ` + info["nickname"] + `
            </div>
            <div class = "menu_my_user_list_item_info_works_count">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,22A11,11,0,0,1,3.222,3.222,11,11,0,1,1,18.778,18.778,10.928,10.928,0,0,1,11,22ZM11,3a8,8,0,1,0,8,8A8.009,8.009,0,0,0,11,3Z" transform="translate(14)"></path><path d="M29.719,61H19A19,19,0,0,1,0,42V24A19,19,0,0,1,19,5h8.569a18.6,18.6,0,0,0-2.918,3.5H18.719a16.018,16.018,0,0,0-16,16v18a16.018,16.018,0,0,0,16,16h11a16.018,16.018,0,0,0,16-16V36.169a18.429,18.429,0,0,0,3-1.233V42a19,19,0,0,1-19,19Z" transform="translate(1.281 20)"></path><g transform="translate(1.849 -0.459)"><rect width="3" height="17" rx="1.5" transform="translate(23.151 35.438) rotate(-45)"></rect><rect width="3" height="23" rx="1.5" transform="translate(44.884 26.041) rotate(30)"></rect></g></g></svg>
                ` + getLanguage("menu_user_info_save_count").replaceAll("{R:0}", commas(info["saveCount"])) + `
            </div>
        </div>
    `;

    items.appendChild(newEl);
}














function showMyUserListMoreLoading(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let loading = contents.getElementsByClassName("my_user_list_contents_loading")[0];
    loading.style.display = "block";
}
function hideMyUserListMoreLoading(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let loading = contents.getElementsByClassName("my_user_list_contents_loading")[0];
    loading.style.display = "none";
}
function checkMyUserListMoreLoading(menuNumber) {
    if (myUserListLoadNumbers[menuNumber].length == 0) {
        hideMyUserListMoreLoading(menuNumber);
        myUserListLoadNumbers[menuNumber] = null;
    } else {
        showMyUserListMoreLoading(menuNumber);
    }
}

var isMyUserListMoreLoad = new Array();

function checkMyUserListLoad() {
    if (getCurrentMenuName() == "my_user_list") {
        let boxSize = 75;

        let scrollPercent = ((document.documentElement.scrollTop + window.innerHeight) / (document.documentElement.scrollHeight - boxSize)) * 100;
        if (scrollPercent >= 100) {
            let number = getCurrentMenuNumber();
            if (isMyUserListMoreLoad[number] == null) {
                isMyUserListMoreLoad[number] = true;
                moreLoadMyUserList(number);
            }
        }
    }
}
addEventListener("scroll", checkMyUserListLoad);
addEventListener("resize", checkMyUserListLoad);
addEventListener("focus", checkMyUserListLoad);



function moreLoadMyUserList(menuNumber) {
    if (myUserListLoadNumbers[menuNumber] == null || myUserListLoadNumbers[menuNumber].length == 0) {
        myUserListLoadNumbers[menuNumber] = null;
        isMyUserListMoreLoad[menuNumber] = null;
        return;
    }

    let numbers = myUserListLoadNumbers[menuNumber];
    let numbersMaxCount = (numbers.length >= 40) ? 40 : numbers.length;
    numbers = numbers.splice(0, numbersMaxCount);

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/my_user_list/getInfo.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                for (let i = 0; i < info.length; i++) {
                    addItemMyUserListLoad(menuNumber, info[i]);
                }

                //
                for (let i = 0; i < numbers.length; i++) {
                    let array = myUserListLoadNumbers[menuNumber];
                    array = array.remove("" + numbers[i]);
                    myUserListLoadNumbers[menuNumber] = array;
                }

                isMyUserListMoreLoad[menuNumber] = null;
                checkMyUserListMoreLoading(menuNumber);
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



























function myUserListOptionLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("menu_my_user_list_items")[0];
    let sort_box = contents.getElementsByClassName("sort_box");

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/my_user_list/getInfoNumbers.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let data = JSON.parse(xhrHtml);
                let info = data["info"];
                let numbers = data["numbers"].split(",");

                items.textContent = "";
                myUserListLoadNumbers[menuNumber] = null;

                //
                if (info != null && info.length != 0) {
                    myUserListLoadNumbers[menuNumber] = numbers;

                    for (let i = 0; i < info.length; i++) {
                        addItemMyUserListLoad(menuNumber, info[i]);
    
                        let array = myUserListLoadNumbers[menuNumber];
                        array = array.remove("" + info[i]["userNumber"]);
                        myUserListLoadNumbers[menuNumber] = array;
                    }
                    checkMyUserListMoreLoading(menuNumber);
                } else {
                    myUserListNoData(menuNumber);
                }

                isMyUserListMoreLoad[menuNumber] = null;
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
    formData.append("sort", sort_box[0].getAttribute("value"));

    xhr.send(formData);
}






















function myUserListMoreItems(event, menuNumber, userNumber) {
    let slot = new Array();

    slot[0] = {
        'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 28"><path d="M8 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM12 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM16 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM18 22.813v-14.812h-14v14.812c0 0.75 0.422 1.188 0.5 1.188h13c0.078 0 0.5-0.438 0.5-1.188zM7.5 6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094 0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5 0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375 0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391 2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094 2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z"></path></svg>',
        'title': getLanguage("delete"),
        'onclick': 'deleteMenuMyUserListItem(' + menuNumber + ', ' + userNumber + ');',
        'class': 'more_button_item_delete',
    };

    moreButton(null, slot, event);
}
function deleteMenuMyUserListItem(menuNumber, userNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    const url = "/php/user_list/save_delete.php";

    xhr.open(method, url);

    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;

                let nickname = "...";
                let item = contents.getElementsByClassName("menu_my_user_list_item");
                for (let i = 0; i < item.length; i++) {
                    if (item[i].getAttribute("user_number") == userNumber) {
                        nickname = item[i].getElementsByClassName("menu_my_user_list_item_info_nickname")[0].innerHTML.trim();
                        item[i].remove();
                        break;
                    }
                }

                deleteMyUserList(userNumber);
                actionMessage(getLanguage("save_user_list_message_delete").replaceAll("{R:0}", nickname));
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
    formData.append('userNumber', userNumber);

    xhr.send(formData);
}





















function getMyUserListSortItems() {
    let items = new Array();
    items[0] = {
        "title": getLanguage("my_user_list_select_sort:0"),
        "value": 0
    }
    items[1] = {
        "title": getLanguage("my_user_list_select_sort:1"),
        "value": 1
    }
    return items;
}