

var userNavigationCreatedWorkListLoadNumbers = new Array();

function loadUserNavigationCreatedWorkList(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    
    let workListData = JSON.parse(contents.getElementsByClassName("work_list_data")[0].innerHTML);
    let numbers = workListData["numbers"].split(",");
    let info = workListData["info"];

    userNavigationCreatedWorkListLoadNumbers[menuNumber] = numbers;

    if (info != null) {
        for (let i = 0; i < info.length; i++) {
            addItemUserNavigationCreatedWorkList(menuNumber, info[i])
    
            let array = userNavigationCreatedWorkListLoadNumbers[menuNumber];
            array = array.remove("" + info[i]["number"]);
            userNavigationCreatedWorkListLoadNumbers[menuNumber] = array;
        }
        checkUserNavigationCreatedWorkListMoreLoading(menuNumber);
    } else {
        userNavigationCreatedWorkListNoData(menuNumber);
    }

    //
    let sort_title = contents.getElementsByClassName("sort_box_title");
    sort_title[0].innerHTML = getLanguage("user_navigation_created_work_list_select_sort:0");

    //데이터 없음
    let no_data = contents.getElementsByClassName("user_navigation_created_work_list_no_data")[0];
    no_data.getElementsByClassName("user_navigation_created_work_list_no_data_title")[0].innerHTML = getLanguage("user_navigation_created_work_list_no_data");
    no_data.getElementsByClassName("user_navigation_created_work_list_no_data_description")[0].innerHTML = getLanguage("no_data_description");
}
function userNavigationCreatedWorkListNoData(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let no_data = contents.getElementsByClassName("user_navigation_created_work_list_no_data")[0];
    no_data.style.display = "flex";
}
function addItemUserNavigationCreatedWorkList(menuNumber, info) {
    let contents = document.getElementById("contents_" + menuNumber);
    let workListContents = contents.getElementsByClassName("work_list_contents")[0];

    let no_data = contents.getElementsByClassName("user_navigation_created_work_list_no_data")[0];
    no_data.style.display = "none";

    let newEl = document.createElement("div");
    newEl.classList.add("visible_element");
    newEl.innerHTML = getHtmlWorkList(info);
    workListContents.appendChild(newEl);
}



























function showUserNavigationCreatedWorkListMoreLoading(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let loading = contents.getElementsByClassName("user_navigation_created_work_list_contents_loading")[0];
    loading.style.display = "block";
}
function hideUserNavigationCreatedWorkListMoreLoading(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let loading = contents.getElementsByClassName("user_navigation_created_work_list_contents_loading")[0];
    loading.style.display = "none";
}
function checkUserNavigationCreatedWorkListMoreLoading(menuNumber) {
    if (userNavigationCreatedWorkListLoadNumbers[menuNumber].length == 0) {
        hideUserNavigationCreatedWorkListMoreLoading(menuNumber);
        userNavigationCreatedWorkListLoadNumbers[menuNumber] = null;
    } else {
        showUserNavigationCreatedWorkListMoreLoading(menuNumber);
    }
}

let isUserNavigationCreatedWorkListMoreLoad = new Array();

function checkUserNavigationCreatedWorkListLoad() {
    if (getCurrentMenuName() == "user") {
        let boxSize = 75;

        let scrollPercent = ((document.documentElement.scrollTop + window.innerHeight) / (document.documentElement.scrollHeight - boxSize)) * 100;
        if (scrollPercent >= 100) {
            let number = getCurrentMenuNumber();
            if (isUserNavigationCreatedWorkListMoreLoad[number] == null) {
                isUserNavigationCreatedWorkListMoreLoad[number] = true;
                moreLoadUserNavigationCreatedWorkList(number);
            }
        }
    }
}
addEventListener("scroll", checkUserNavigationCreatedWorkListLoad);
addEventListener("resize", checkUserNavigationCreatedWorkListLoad);
addEventListener("focus", checkUserNavigationCreatedWorkListLoad);












function moreLoadUserNavigationCreatedWorkList(menuNumber) {
    if (userNavigationCreatedWorkListLoadNumbers[menuNumber] == null || userNavigationCreatedWorkListLoadNumbers[menuNumber].length == 0) {
        userNavigationCreatedWorkListLoadNumbers[menuNumber] = null;
        isUserNavigationCreatedWorkListMoreLoad[menuNumber] = null;
        return;
    }

    let numbers = userNavigationCreatedWorkListLoadNumbers[menuNumber];
    let numbersMaxCount = (numbers.length >= 24) ? 24 : numbers.length;
    numbers = numbers.splice(0, numbersMaxCount);

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/work_list/getInfo.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                for (let i = 0; i < info.length; i++) {
                    addItemUserNavigationCreatedWorkList(menuNumber, info[i]);
                }

                //
                for (let i = 0; i < numbers.length; i++) {
                    let array = userNavigationCreatedWorkListLoadNumbers[menuNumber];
                    array = array.remove("" + numbers[i]);
                    userNavigationCreatedWorkListLoadNumbers[menuNumber] = array;
                }

                isUserNavigationCreatedWorkListMoreLoad[menuNumber] = null;
                checkUserNavigationCreatedWorkListMoreLoading(menuNumber);
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






























function userNavigationCreatedWorkListOptionLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let work_contents = contents.getElementsByClassName("work_list_contents")[0];
    let userNumber = Number.parseInt(contents.getElementsByClassName("user_number")[0].innerHTML);
    let sort_box = contents.getElementsByClassName("sort_box");

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/user/created_work_list/getInfoNumbers.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let data = JSON.parse(xhrHtml);
                let info = data["info"];
                let numbers = data["numbers"].split(",");

                work_contents.textContent = "";
                userNavigationCreatedWorkListLoadNumbers[menuNumber] = null;

                //
                if (info != null) {
                    userNavigationCreatedWorkListLoadNumbers[menuNumber] = numbers;

                    for (let i = 0; i < info.length; i++) {
                        addItemUserNavigationCreatedWorkList(menuNumber, info[i]);
    
                        let array = userNavigationCreatedWorkListLoadNumbers[menuNumber];
                        array = array.remove("" + info[i]["number"]);
                        userNavigationCreatedWorkListLoadNumbers[menuNumber] = array;
                    }
                    checkUserNavigationCreatedWorkListMoreLoading(menuNumber);
                } else {
                    userNavigationCreatedWorkListNoData(menuNumber);
                }

                isUserNavigationCreatedWorkListMoreLoad[menuNumber] = null;
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
    formData.append("userNumber", userNumber);
    formData.append("sort", sort_box[0].getAttribute("value"));

    xhr.send(formData);
}





























function getUserNavigationCreatedWorkListSortItems() {
    let items = new Array();
    items[0] = {
        "title": getLanguage("user_navigation_created_work_list_select_sort:0"),
        "value": 0
    }
    items[1] = {
        "title": getLanguage("user_navigation_created_work_list_select_sort:1"),
        "value": 1
    }
    items[2] = {
        "title": getLanguage("user_navigation_created_work_list_select_sort:2"),
        "value": 2
    }
    items[3] = {
        "title": getLanguage("user_navigation_created_work_list_select_sort:3"),
        "value": 3
    }
    return items;
}