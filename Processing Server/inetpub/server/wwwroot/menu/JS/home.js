

var homeLoadNumbers = new Array();

function homeLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let home_work = contents.getElementsByClassName("work_contents")[0];
    home_work.innerHTML = "";

    let numbers = contents.getElementsByClassName("work_numbers")[0].innerHTML.trim().split(",");
    let info = JSON.parse(contents.getElementsByClassName("work_info")[0].innerHTML.trim());

    homeLoadNumbers[menuNumber] = numbers;

    if (info != null && info.length != 0) {
        for (let i = 0; i < info.length; i++) {
            addContentsHomeWork(menuNumber, info[i]);
    
            let array = homeLoadNumbers[menuNumber];
            array = array.remove("" + info[i]["number"]);
            homeLoadNumbers[menuNumber] = array;
        }
        checkHomeWorkMoreLoading(menuNumber);
    } else {
        homeNoData(menuNumber);
    }

    //데이터 없음
    let no_data = contents.getElementsByClassName("menu_home_no_data")[0];
    no_data.getElementsByClassName("menu_home_no_data_title")[0].innerHTML = getLanguage("menu_home_no_data");
    no_data.getElementsByClassName("menu_home_no_data_description")[0].innerHTML = getLanguage("no_data_description");

    //
    let workTypeItem = contents.getElementsByClassName("contents_home_category_work_type_item");
    workTypeItem[0].getElementsByTagName("span")[0].innerHTML = getLanguage("menu_home_header_work_type:0");
    workTypeItem[1].getElementsByTagName("span")[0].innerHTML = getLanguage("work_settings_contents_type:0");
    workTypeItem[2].getElementsByTagName("span")[0].innerHTML = getLanguage("work_settings_contents_type:1");
    workTypeItem[3].getElementsByTagName("span")[0].innerHTML = getLanguage("work_settings_contents_type:2");
    workTypeItem[4].getElementsByTagName("span")[0].innerHTML = getLanguage("work_settings_contents_type:3");
    //
    let categoryItem = contents.getElementsByClassName("contents_home_category_tag_item");
    for (let i = 0; i < categoryItem.length; i++) {
        let value = categoryItem[i].getAttribute("value");
        categoryItem[i].getElementsByTagName("span")[0].innerHTML = getLanguage("menu_home_header_category:" + value);
    }

    //배너 - 워크스페이스
    let banner_workspace_title = contents.getElementsByClassName("menu_home_banner_workspace_contents_title")[0];
    banner_workspace_title.innerHTML = getLanguage("menu_home_banner_workspace:title");
    let banner_workspace_description = contents.getElementsByClassName("menu_home_banner_workspace_contents_description")[0];
    banner_workspace_description.innerHTML = getLanguage("menu_home_banner_workspace:description");

    let banner_bottom_button = contents.getElementsByClassName("menu_home_banner_workspace_contents_bottom_button");
    banner_bottom_button[0].getElementsByTagName("span")[0].innerHTML = getLanguage("menu_home_banner_workspace_bottom_creator_guide_button:0");
    banner_bottom_button[1].getElementsByTagName("span")[0].innerHTML = getLanguage("menu_home_banner_workspace_bottom_creator_guide_button:1");
    banner_bottom_button[2].getElementsByTagName("span")[0].innerHTML = getLanguage("menu_home_banner_workspace_bottom_creator_guide_button:2");

    let banner_workspace_top_left = contents.getElementsByClassName("menu_home_banner_workspace_top_left")[0];
    banner_workspace_top_left.innerHTML = getSVGLouibooksLogo(0) + " <b>LOUI</b>BOOKS";

    //프리미엄이면 광고 표시 안함
    let isPremium = contents.getElementsByClassName("is_premium")[0].innerHTML.trim();
    if (isPremium == "false" || isPremium == false) {
        let google_adsense = contents.getElementsByClassName("google_adsense")[0];
        google_adsense.style.marginBottom = "20px";
        google_adsense.innerHTML = getElementGoogleAdsense(`
            <ins class="adsbygoogle"
                style="display:block; text-align:center;"
                data-ad-layout="in-article"
                data-ad-format="fluid"
                data-ad-client="ca-pub-9109662775581995"
                data-ad-slot="2628158689">
            </ins>
        `).outerHTML + `
            <div style = "width: 100%; height: 1px; background-color: var(--border-color); margin-top: 20px;"></div>
        `;
        google_adsense.style.display = null;
        checkElementGoogleAdsense(google_adsense);
    }

    if (getCookie("homeBannerClose") != null && getCookie("homeBannerClose") == "true") {
        let banner = contents.getElementsByClassName("menu_home_banner_wrap")[0];
        banner.style.display = "none";
    }
}
function homeNoData(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let no_data = contents.getElementsByClassName("menu_home_no_data")[0];
    no_data.style.display = "flex";
}

function addContentsHomeWork(menuNumber, info) {
    let contents = document.getElementById("contents_" + menuNumber);
    let isPremium = contents.getElementsByClassName("is_premium")[0].innerHTML.trim();
    let home_work = contents.getElementsByClassName("work_contents")[0];
    let itemLength = contents.getElementsByClassName("work").length;
    let tagType = contents.getElementsByClassName("contents_home_category_tag_items")[0].getAttribute("value");

    let no_data = contents.getElementsByClassName("menu_home_no_data")[0];
    no_data.style.display = "none";

    let newEl = document.createElement("div");
    newEl.setAttribute("work_number", info["number"]);
    if (tagType == "recently_viewed") {
        newEl.setAttribute("oncontextmenu", "workMoreItems(event, " + info["number"] + ");");
    } else {
        newEl.setAttribute("oncontextmenu", "menuHomeWorkMoreItems(event, " + menuNumber + ", " + info["number"] + ");");
    }
    newEl.classList.add("visible_element");
    newEl.innerHTML = getHtmlWork(info, 0);
    
    home_work.appendChild(newEl);
}

function showHomeWorkMoreLoading(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let loading = contents.getElementsByClassName("home_work_contents_loading")[0];
    loading.style.display = "block";
}
function hideHomeWorkMoreLoading(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let loading = contents.getElementsByClassName("home_work_contents_loading")[0];
    loading.style.display = "none";
}
function checkHomeWorkMoreLoading(menuNumber) {
    if (homeLoadNumbers[menuNumber].length == 0) {
        hideHomeWorkMoreLoading(menuNumber);
        homeLoadNumbers[menuNumber] = null;
    } else {
        showHomeWorkMoreLoading(menuNumber);
    }
}

function moreLoadHomeWork(menuNumber) {
    if (homeLoadNumbers[menuNumber] == null || homeLoadNumbers[menuNumber].length == 0) {
        homeLoadNumbers[menuNumber] = null;
        isHomeWorkMoreLoad[menuNumber] = null;
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
                    addContentsHomeWork(menuNumber, info[i]);
            
                    let array = homeLoadNumbers[menuNumber];
                    array = array.remove("" + info[i]["number"]);
                    homeLoadNumbers[menuNumber] = array;
                }

                isHomeWorkMoreLoad[menuNumber] = null;
                checkHomeWorkMoreLoading(menuNumber);
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

    let numbers = homeLoadNumbers[menuNumber];
    let numbersMaxCount = (numbers.length >= 24) ? 24 : numbers.length;
    numbers = numbers.splice(0, numbersMaxCount);
    
    var formData = new FormData();
    formData.append("lang", userLanguage);
    formData.append("numbers", numbers.join(","));

    xhr.send(formData);
}

let isHomeWorkMoreLoad = new Array();

function checkHomeWorkLoad() {
    if (getCurrentMenuName() == "home") {
        let boxSize = 75;
        let scrollPercent = ((document.documentElement.scrollTop + window.innerHeight) / (document.documentElement.scrollHeight - boxSize)) * 100;
        if (scrollPercent >= 100) {
            let number = getCurrentMenuNumber();
            if (isHomeWorkMoreLoad[number] == null) {
                isHomeWorkMoreLoad[number] = true;
                moreLoadHomeWork(number);
            }
        }
    }
}
addEventListener("scroll", checkHomeWorkLoad);
addEventListener("resize", checkHomeWorkLoad);
addEventListener("focus", checkHomeWorkLoad);









function changeHomeWorkType(menuNumber, workType) {
    let contents = document.getElementById("contents_" + menuNumber);
    let item = contents.getElementsByClassName("contents_home_category_work_type_item");

    for (let i = 0; i < item.length; i++) {
        item[i].classList.remove("contents_home_category_work_type_item_selected");
    }

    if (workType == 0) {
        item[0].classList.add("contents_home_category_work_type_item_selected");
    } else if (workType == 1) {
        item[1].classList.add("contents_home_category_work_type_item_selected");
    } else if (workType == 2) {
        item[2].classList.add("contents_home_category_work_type_item_selected");
    } else if (workType == 3) {
        item[3].classList.add("contents_home_category_work_type_item_selected");
    } else if (workType == 4) {
        item[4].classList.add("contents_home_category_work_type_item_selected");
    }

    let items = contents.getElementsByClassName("contents_home_category_work_type_items")[0];
    items.setAttribute("value", workType);

    homeOptionLoad(menuNumber);
}
function changeHomeCategory(menuNumber, category) {
    let contents = document.getElementById("contents_" + menuNumber);
    let item = contents.getElementsByClassName("contents_home_category_tag_item");

    for (let i = 0; i < item.length; i++) {
        item[i].classList.remove("contents_home_category_tag_item_selected");
        if (item[i].getAttribute("value") == category) {
            item[i].classList.add("contents_home_category_tag_item_selected");
        }
    }

    let items = contents.getElementsByClassName("contents_home_category_tag_items")[0];
    items.setAttribute("value", category);

    homeOptionLoad(menuNumber);
}









function homeOptionLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let work_contents = contents.getElementsByClassName("work_contents")[0];
    let workType = contents.getElementsByClassName("contents_home_category_work_type_items")[0].getAttribute("value");
    let category = contents.getElementsByClassName("contents_home_category_tag_items")[0].getAttribute("value");

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/home/getInfoNumbers.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                work_contents.textContent = "";
                let numbers = info["numbers"].split(",");
                homeLoadNumbers[menuNumber] = numbers;

                //
                document.body.scrollTo(0, 0);

                //
                if (numbers.length != 0 && numbers[0] != "") {
                    let worksInfo = info["info"];
                    for (let i = 0; i < worksInfo.length; i++) {
                        addContentsHomeWork(menuNumber, worksInfo[i]);
                
                        let array = homeLoadNumbers[menuNumber];
                        array = array.remove("" + worksInfo[i]["number"]);
                        homeLoadNumbers[menuNumber] = array;
                    }
                    checkHomeWorkMoreLoading(menuNumber);
                } else {
                    homeNoData(menuNumber);
                    hideHomeWorkMoreLoading(menuNumber);
                }

                isHomeWorkMoreLoad[menuNumber] = null;
                checkMenuHomeLogEvent();
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
    formData.append("workType", workType);
    formData.append("category", category);

    xhr.send(formData);
}



















function checkMenuHomeBanner() {
    if (getCurrentMenuName() == "home") {
        let menuNumber = getCurrentMenuNumber();
        let contents = document.getElementById("contents_" + menuNumber);
        
        if (contents.getElementsByClassName("menu_home_banner_workspace").length != 0) {
            let banner = contents.getElementsByClassName("menu_home_banner_workspace")[0];
            let banner_background = contents.getElementsByClassName("menu_home_banner_workspace_background")[0];

            let width = banner_background.clientWidth;
            let height = banner_background.clientHeight;

            if (width != banner.clientWidth || height != banner.clientHeight) {
                banner_background.style.width = (banner.clientWidth + "px");
                banner_background.style.height = (banner.clientHeight + "px");
            }
        }
    }
}
window.addEventListener("resize", checkMenuHomeBanner);
window.addEventListener("focus", checkMenuHomeBanner);

function delayCheckMenuHomeBanner() {
    function callback() {
        checkMenuHomeBanner();
    }
    window.requestAnimationFrame(callback);
}




function CloseMenuHomeBanner(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let banner = contents.getElementsByClassName("menu_home_banner_wrap")[0];
    
    let height = banner.clientHeight;
    banner.style.height = height + "px";
    function callback() {
        banner.style.height = "0px";
        banner.style.marginBottom = "0px";
        banner.style.animation = "closeMenuHomeBannerWrap 0.2s forwards";

        setTimeout(() => {
            banner.remove();
        }, 200);
    }
    window.requestAnimationFrame(callback);

    setCookie("homeBannerClose", true);
}


































































function menuHomeWorkMoreItems(event, menuNumber, workNumber) {
    let slot = new Array();

    if (loginStatus["isLogin"] == true) {
        slot[slot.length] = {
            'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-215,50a24.843,24.843,0,0,1-9.731-1.965,24.918,24.918,0,0,1-7.947-5.358,24.918,24.918,0,0,1-5.358-7.947A24.843,24.843,0,0,1-240,25a24.843,24.843,0,0,1,1.965-9.731,24.918,24.918,0,0,1,5.358-7.947,24.918,24.918,0,0,1,7.947-5.358A24.843,24.843,0,0,1-215,0a24.843,24.843,0,0,1,9.731,1.965,24.918,24.918,0,0,1,7.947,5.358,24.918,24.918,0,0,1,5.358,7.947A24.843,24.843,0,0,1-190,25a24.843,24.843,0,0,1-1.965,9.731,24.918,24.918,0,0,1-5.358,7.947,24.918,24.918,0,0,1-7.947,5.358A24.843,24.843,0,0,1-215,50Zm0-47a22.025,22.025,0,0,0-22,22,22.025,22.025,0,0,0,22,22,22.025,22.025,0,0,0,22-22A22.025,22.025,0,0,0-215,3Z" transform="translate(240)"/><rect width="3" height="49" rx="1.5" transform="translate(41.41 6.969) rotate(45)"/></g></svg>',
            'title': getLanguage("home_work_more_items:not_interested"),
            'onclick': 'requestHomeNotInterested(' + menuNumber + ', ' + workNumber + ');',
            'class': 'more_button_item_delete'
        };
    }

    let items = getMoreItemsWorkElement(workNumber);
    for (let i = 0; i < items.length; i++) {
        slot[slot.length] = items[i];
    }

    moreButton(null, slot, event);
}

function requestHomeNotInterested(menuNumber, workNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let work_contents = contents.getElementsByClassName("work_contents")[0];
    let item = work_contents.children;

    for (let i = 0; i < item.length; i++) {
        if (item[i].getAttribute("work_number") == workNumber) {
            item = item[i];
            break;
        }
    }

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/work/not_interested.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                
                item.style.display = "none";
                actionMessage(getLanguage("home_not_interested_message"), "requestHomeCancelNotInterested(" + menuNumber + ", " + workNumber + ");");
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
    formData.append("workNumber", workNumber);

    xhr.send(formData);
}
function requestHomeCancelNotInterested(menuNumber, workNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let work_contents = contents.getElementsByClassName("work_contents")[0];
    let item = work_contents.children;

    for (let i = 0; i < item.length; i++) {
        if (item[i].getAttribute("work_number") == workNumber) {
            item = item[i];
            break;
        }
    }

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/work/not_interested_cancel.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                
                item.style.display = null;
                actionMessage(getLanguage("home_not_interested_cancel_message"));
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
    formData.append("workNumber", workNumber);

    xhr.send(formData);
}

















































function checkMenuHomeLogEvent() {
    if (getCurrentMenuName() == "home") {
        let menuNumber = getCurrentMenuNumber();
        let contents = document.getElementById("contents_" + menuNumber);
        if (contents.getElementsByClassName("work_contents").length != 0) {
            let work_contents = contents.getElementsByClassName("work_contents")[0];
            let children = work_contents.children;
    
            for (let i = 0; i < children.length; i++) {
                let workNumber = Number.parseInt(children[i].getAttribute("work_number"));
                let isVisible = isVisibleElement(children[i]);
    
                if (isVisible == true) {
                    let overlap = false;
                    for (let j = 0; j < logEvent.length; j++) {
                        if (logEvent[j]["log"] == 0 && logEvent[j]["workNumber"] == workNumber) {
                            overlap = true;
                            break;
                        }
                    }
                    if (overlap == false) {
                        logEvent[logEvent.length] = {
                            "log": 0,       //작품 노출
                            "type": 0,      //탐색에서 노출
                            "workNumber": workNumber
                        }
                    }
                }
            }
        }
    }
}
window.addEventListener("resize", checkMenuHomeLogEvent);
window.addEventListener("focus", checkMenuHomeLogEvent);
window.addEventListener("scroll", checkMenuHomeLogEvent);

function delayCheckMenuHomeLogEvent() {
    function callback() {
        checkMenuHomeLogEvent();
    }
    window.requestAnimationFrame(callback);
}