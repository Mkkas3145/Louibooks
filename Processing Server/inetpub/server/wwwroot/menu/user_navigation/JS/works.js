

var userNavigationWorksLoadNumbers = new Array();

function loadUserNavigationWorks(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    
    let workData = JSON.parse(contents.getElementsByClassName("work_data")[0].innerHTML);
    let numbers = workData["numbers"].split(",");
    let info = workData["info"];

    //
    userNavigationWorksLoadNumbers[menuNumber] = numbers;

    if (info != null && info.length != 0) {
        for (let i = 0; i < info.length; i++) {
            addContentsUserNavigationWorks(menuNumber, info[i]);
    
            let array = userNavigationWorksLoadNumbers[menuNumber];
            array = array.remove("" + info[i]["number"]);
            userNavigationWorksLoadNumbers[menuNumber] = array;
        }
        checkUserNavigationWorksMoreLoading(menuNumber);
    } else {
        userNavigationWorksNoData(menuNumber);
    }

    //
    let sort_title = contents.getElementsByClassName("sort_box_title");
    sort_title[0].innerHTML = getLanguage("user_navigation_works_select_sort:0");
    sort_title[1].innerHTML = getLanguage("user_navigation_works_select_work_type:0");

    //데이터 없음
    let no_data = contents.getElementsByClassName("user_navigation_works_no_data")[0];
    no_data.getElementsByClassName("user_navigation_works_no_data_title")[0].innerHTML = getLanguage("user_navigation_works_no_data");
    no_data.getElementsByClassName("user_navigation_works_no_data_description")[0].innerHTML = getLanguage("no_data_description");
}
function userNavigationWorksNoData(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let no_data = contents.getElementsByClassName("user_navigation_works_no_data")[0];
    no_data.style.display = "flex";
}
function addContentsUserNavigationWorks(menuNumber, info) {
    let contents = document.getElementById("contents_" + menuNumber);
    let work_contents = contents.getElementsByClassName("work_contents")[0];

    let no_data = contents.getElementsByClassName("user_navigation_works_no_data")[0];
    no_data.style.display = "none";

    let newEl = document.createElement("div");
    newEl.setAttribute("oncontextmenu", "workMoreItems(event, " + info["number"] + ");");
    newEl.classList.add("visible_element");
    newEl.innerHTML = getHtmlWork(info);
    
    work_contents.appendChild(newEl);
}
















function showUserNavigationWorksMoreLoading(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let loading = contents.getElementsByClassName("user_navigation_works_contents_loading")[0];
    loading.style.display = "block";
}
function hideUserNavigationWorksMoreLoading(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let loading = contents.getElementsByClassName("user_navigation_works_contents_loading")[0];
    loading.style.display = "none";
}
function checkUserNavigationWorksMoreLoading(menuNumber) {
    if (userNavigationWorksLoadNumbers[menuNumber].length == 0) {
        hideUserNavigationWorksMoreLoading(menuNumber);
        userNavigationWorksLoadNumbers[menuNumber] = null;
    } else {
        showUserNavigationWorksMoreLoading(menuNumber);
    }
}

function moreLoadUserNavigationWorks(menuNumber) {
    if (userNavigationWorksLoadNumbers[menuNumber] == null || userNavigationWorksLoadNumbers[menuNumber].length == 0) {
        userNavigationWorksLoadNumbers[menuNumber] = null;
        isUserNavigationWorksMoreLoad[menuNumber] = null;
        return;
    }

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/work/getInfo.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                for (let i = 0; i < info.length; i++) {
                    addContentsUserNavigationWorks(menuNumber, info[i]);
            
                    let array = userNavigationWorksLoadNumbers[menuNumber];
                    array = array.remove("" + info[i]["number"]);
                    userNavigationWorksLoadNumbers[menuNumber] = array;
                }

                isUserNavigationWorksMoreLoad[menuNumber] = null;
                checkUserNavigationWorksMoreLoading(menuNumber);
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

    let numbers = userNavigationWorksLoadNumbers[menuNumber];
    let numbersMaxCount = (numbers.length >= 24) ? 24 : numbers.length;
    numbers = numbers.splice(0, numbersMaxCount);
    
    var formData = new FormData();
    formData.append("lang", userLanguage);
    formData.append("numbers", numbers.join(","));

    xhr.send(formData);
}

let isUserNavigationWorksMoreLoad = new Array();

function checkUserNavigationWorksLoad() {
    if (getCurrentMenuName() == "user") {
        let boxSize = 75;

        let scrollPercent = ((document.documentElement.scrollTop + window.innerHeight) / (document.documentElement.scrollHeight - boxSize)) * 100;
        if (scrollPercent >= 100) {
            let number = getCurrentMenuNumber();
            if (isUserNavigationWorksMoreLoad[number] == null) {
                isUserNavigationWorksMoreLoad[number] = true;
                moreLoadUserNavigationWorks(number);
            }
        }
    }
}
addEventListener("scroll", checkUserNavigationWorksLoad);
addEventListener("resize", checkUserNavigationWorksLoad);
addEventListener("focus", checkUserNavigationWorksLoad);










































function userNavigationWorksOptionLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let work_contents = contents.getElementsByClassName("work_contents")[0];
    let userNumber = Number.parseInt(contents.getElementsByClassName("user_number")[0].innerHTML.trim());
    let sort_box = contents.getElementsByClassName("sort_box");
    let sort = sort_box[0].getAttribute("value");
    let contentsType = sort_box[1].getAttribute("value");

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/user/works/getInfoNumbers.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                work_contents.textContent = "";
                let numbers = info["numbers"].split(",");
                userNavigationWorksLoadNumbers[menuNumber] = numbers;

                //
                if (numbers.length != 0 && numbers[0] != "") {
                    let worksInfo = info["info"];
                    for (let i = 0; i < worksInfo.length; i++) {
                        addContentsUserNavigationWorks(menuNumber, worksInfo[i]);
                
                        let array = userNavigationWorksLoadNumbers[menuNumber];
                        array = array.remove("" + worksInfo[i]["number"]);
                        userNavigationWorksLoadNumbers[menuNumber] = array;
                    }
                    checkUserNavigationWorksMoreLoading(menuNumber);
                } else {
                    userNavigationWorksNoData(menuNumber);
                    hideUserNavigationWorksMoreLoading(menuNumber);
                }

                isUserNavigationWorksMoreLoad[menuNumber] = null;
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
    formData.append("lang", userLanguage);
    formData.append("userNumber", userNumber);
    formData.append("sort", sort);
    formData.append("contentsType", contentsType);

    xhr.send(formData);
}



































function getUserNavigationWorksSortItems() {
    let items = new Array();
    items[0] = {
        "title": getLanguage("user_navigation_works_select_sort:0"),
        "value": 0
    }
    items[1] = {
        "title": getLanguage("user_navigation_works_select_sort:1"),
        "value": 1
    }
    return items;
}
function getUserNavigationWorksWorkTypeItems() {
    let items = new Array();
    items[0] = {
        "title": getLanguage("user_navigation_works_select_work_type:0"),
        "icon": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,700a1.5,1.5,0,0,1,.844.26l23.5,16A1.5,1.5,0,0,1,49.4,718.7L25.9,736.2a1.5,1.5,0,0,1-1.792,0L.6,718.7a1.5,1.5,0,0,1,.052-2.443l23.5-16A1.5,1.5,0,0,1,25,700Zm20.915,17.555L25,703.315,4.085,717.555,25,733.13Z" transform="translate(0 -700)"/><path d="M24.953,736.551a1.5,1.5,0,0,1-.9-.3L.6,718.754a1.5,1.5,0,0,1,1.794-2.4l22.558,16.832,22.65-16.834a1.5,1.5,0,1,1,1.789,2.408l-23.547,17.5A1.5,1.5,0,0,1,24.953,736.551Z" transform="translate(0 -686.551)"/></g></svg>',
        "value": 0
    }
    items[1] = {
        "title": getLanguage("work_settings_contents_type:0"),
        "icon": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-72.583-761.2c-2.946-3.826-6.227-5.765-9.755-5.765h0c-6.133,0-11.229,5.774-11.281,5.833a1.5,1.5,0,0,1-1.126.517h-.006a1.5,1.5,0,0,1-1.124-.506c-3.431-3.877-7.015-5.844-10.651-5.844h0c-6.23,0-10.743,5.713-10.788,5.771a1.5,1.5,0,0,1-1.67.5A1.5,1.5,0,0,1-120-762.116v-30.063a1.5,1.5,0,0,1,.318-.922c3.574-4.578,7.7-6.9,12.273-6.9h0c5.73,0,10.491,3.7,12.606,5.656C-91.165-798.1-87.269-800-83.2-800c7.569,0,12.778,6.622,13,6.9a1.5,1.5,0,0,1,.313.917v30.063a1.5,1.5,0,0,1-1.017,1.42,1.5,1.5,0,0,1-.483.08A1.5,1.5,0,0,1-72.583-761.2Zm-20.812-4.26c2.423-1.988,6.408-4.5,11.056-4.5h0a13.728,13.728,0,0,1,9.444,3.972v-25.638a19,19,0,0,0-2.779-2.56A12.553,12.553,0,0,0-83.2-797c-3.485,0-6.913,1.867-10.191,5.549ZM-117-791.653v25.91a16.593,16.593,0,0,1,10.471-4.223h0a15.532,15.532,0,0,1,10.132,4.125v-25.873c-1.474-1.438-5.9-5.285-11.013-5.285h0C-110.882-797-114.105-795.2-117-791.653Z" transform="translate(119.895 805.308)"/></g></svg>',
        "value": 1
    }
    items[2] = {
        "title": getLanguage("work_settings_contents_type:1"),
        "icon": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M3,3H3V18H47V3H3M3,0H47a3,3,0,0,1,3,3V18a3,3,0,0,1-3,3H3a3,3,0,0,1-3-3V3A3,3,0,0,1,3,0Z"/><path d="M1.5,925H27a1.5,1.5,0,0,1,1.329,2.195l-11.5,22A1.5,1.5,0,0,1,15.5,950H1.508a1.5,1.5,0,0,1-1.5-1.5L0,926.5A1.5,1.5,0,0,1,1.5,925Zm23.023,3H3l.007,19H14.592Z" transform="translate(0 -900)"/><path d="M1.5,927H26a1.5,1.5,0,0,1,1.33,2.194l-11.5,22.03a1.5,1.5,0,0,1-1.33.806h-.006l-13.5-.053A1.5,1.5,0,0,1-.5,950.442L0,928.466A1.5,1.5,0,0,1,1.5,927Zm22.025,3H2.966l-.432,18.982,11.058.044Z" transform="translate(49.5 977) rotate(180)"/></g></svg>',
        "value": 2
    }
    items[3] = {
        "title": getLanguage("work_settings_contents_type:2"),
        "icon": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M121.5,500h47a1.5,1.5,0,0,1,1.5,1.5V516a1.5,1.5,0,0,1-1.218,1.473l-47,9A1.5,1.5,0,0,1,120,525V501.5A1.5,1.5,0,0,1,121.5,500Zm45.5,3H123v20.186l44-8.426Z" transform="translate(-120 -500)"></path><path d="M121.5,500h47a1.5,1.5,0,0,1,1.5,1.5V516a1.5,1.5,0,0,1-1.218,1.473l-47,9A1.5,1.5,0,0,1,120,525V501.5A1.5,1.5,0,0,1,121.5,500Zm45.5,3H123v20.186l44-8.426Z" transform="translate(170 550) rotate(180)"></path></g></svg>',
        "value": 3
    }
    items[4] = {
        "title": getLanguage("work_settings_contents_type:3"),
        "icon": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M6.712,1000a1.5,1.5,0,0,1,.745.2l41.052,23.5a1.5,1.5,0,0,1,0,2.6L7.458,1049.8a1.5,1.5,0,0,1-2.245-1.3v-47a1.5,1.5,0,0,1,1.5-1.5Zm38.032,25L8.212,1004.087v41.826Z" transform="translate(0.736 -1000)"/></g></svg>',
        "value": 3
    }
    return items;
}