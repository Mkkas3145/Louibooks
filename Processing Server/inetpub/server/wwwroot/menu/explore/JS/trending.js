

var exploreTrendingLoadNumbers = new Array();

function exploreTrendingLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let info = JSON.parse(contents.getElementsByClassName("info")[0].innerHTML);
    let numbers = info["numbers"].split(",");

    let category = contents.getElementsByClassName("explore_trending_category")[0];
    let genre = info["genre"].split(",");
    for (let i = 0; i < genre.length; i++) {
        let newEl = document.createElement("div");
        newEl.classList.add("explore_trending_category_item");
        newEl.classList.add("md-ripples");
        newEl.setAttribute("genre", genre[i]);
        newEl.setAttribute("onclick", "exploreTrendingSelectGenre(" + menuNumber + ", '" + genre[i] + "');");
        newEl.innerHTML = `
            ` + getLanguage("genre:" + genre[i]) + `
        `;
        category.appendChild(newEl);
    }

    exploreTrendingLoadNumbers[menuNumber] = numbers;

    //작품
    if (info["info"] != null) {
        for (let i = 0; i < info["info"].length; i++) {
            addItemExploreTrendingLoad(menuNumber, info["info"][i]);

            let array = exploreTrendingLoadNumbers[menuNumber];
            array = array.remove("" + info["info"][i]["number"]);
            exploreTrendingLoadNumbers[menuNumber] = array;
        }
        checkExploreTrendingMoreLoading(menuNumber);
    } else {
        exploreTrendingNoData(menuNumber);
    }

    //배너
    let banner_left_top = contents.getElementsByClassName("explore_trending_banner_left_top")[0].getElementsByTagName("span")[0];
    banner_left_top.innerHTML = getLanguage("menu_explore_trending_left_top_title");
    let banner_left_title = contents.getElementsByClassName("explore_trending_banner_left_title")[0];
    banner_left_title.innerHTML = getLanguage("menu_explore_trending_left_title");
    let banner_left_description = contents.getElementsByClassName("explore_trending_banner_left_description")[0];
    banner_left_description.innerHTML = getLanguage("menu_explore_trending_left_description");
    let banner_left_learn_more_title = contents.getElementsByClassName("explore_trending_banner_left_learn_more_title")[0];
    banner_left_learn_more_title.innerHTML = getLanguage("menu_explore_trending_left_learn_more_title");
    let banner_left_learn_more_button = contents.getElementsByClassName("explore_trending_banner_left_learn_more_button")[0].getElementsByTagName("span")[0];
    banner_left_learn_more_button.innerHTML = getLanguage("menu_explore_trending_left_learn_more_button");
    
    let category_item = contents.getElementsByClassName("explore_trending_category_item")[0].getElementsByTagName("span")[0];
    category_item.innerHTML = getLanguage("menu_explore_trending_all_genre");

    //
    let banner_left_works = contents.getElementsByClassName("explore_trending_banner_left_works")[0];
    if (info["info"] != null) {
        let length = info["info"].length;
        (length > 3) ? length = 3 : null;
        for (let i = 0; i < length; i++) {
            let newEl = document.createElement("div");
            newEl.classList.add("explore_trending_banner_left_works_item");
            newEl.classList.add("md-ripples");
            newEl.setAttribute("onclick", "loadMenu_work('" + info["info"][i]["number"] + "');");
            newEl.innerHTML = `
                <div class = "explore_trending_banner_left_works_item_cover img_wrap">
                    <img src = "` + info["info"][i]["cover_image"] + `" onload = "imageLoad(event);" alt = "">
                </div>
                <div class = "explore_trending_banner_left_works_item_title">
                    ` + info["info"][i]["title"] + `
                </div>
                <div class = "explore_trending_banner_left_works_item_rating">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-161.3,48.508a.992.992,0,0,1-.583-.194l-12.534-9.07a1,1,0,0,0-.586-.19,1,1,0,0,0-.586.19l-12.534,9.07a.99.99,0,0,1-.583.194,1.021,1.021,0,0,1-.808-.407.971.971,0,0,1-.158-.869l4.378-15.5a1,1,0,0,0-.335-1.05L-197.884,20.8a.978.978,0,0,1-.32-1.1.979.979,0,0,1,.921-.68l15.335-.412a1,1,0,0,0,.921-.681l5.08-15.112A.987.987,0,0,1-175,2.139a.987.987,0,0,1,.948.681l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a.979.979,0,0,1,.921.68.978.978,0,0,1-.32,1.1l-12.256,9.877a1,1,0,0,0-.336,1.05l4.378,15.5a.972.972,0,0,1-.158.869A1.021,1.021,0,0,1-161.3,48.508Zm-13.655-12.455a3.809,3.809,0,0,1,2.185.7c2.2,1.509,7.989,5.785,8.047,5.828l-2.968-10.516a4,4,0,0,1,1.281-3.609c1.666-1.266,8.107-6.541,8.172-6.594l-10.031-.219h-.027a3.779,3.779,0,0,1-3.488-2.781c-.969-2.829-3.213-9.345-3.235-9.407l-3.235,9.734c-.011.024-1.121,2.438-3.5,2.453-2.4.015-9.925.233-10,.235l8.407,6.844a3.748,3.748,0,0,1,.968,3.687l-2.844,10.11,8.063-5.828A4.312,4.312,0,0,1-174.951,36.053Z" transform="translate(200)"></path></g></svg>
                    ` + info["info"][i]["ratings"]["averageScore"].toFixed(1) + `
                </div>
            `;
            banner_left_works.appendChild(newEl);
        }
    }

    //
    if (info["info"] != null) {
        let banner_right_images = contents.getElementsByClassName("explore_trending_banner_right_images")[0].getElementsByTagName("img");
        if (info["info"].length >= 1) {
            banner_right_images[1].src = info["info"][0]["cover_image"];
        }
        if (info["info"].length >= 2) {
            banner_right_images[2].src = info["info"][1]["cover_image"];
        }
        if (info["info"].length >= 3) {
            banner_right_images[3].src = info["info"][2]["cover_image"];
        }

        let workIndex = new Array();
        if (info["info"].length >= 5) {
            while(true) {
                if (workIndex.length < 2) {
                    let random = Number.parseInt(3 + (Math.random() * (info["info"].length - 3)));

                    let isOverlap = false;
                    for (let i = 0; i < workIndex.length; i++) {
                        if (workIndex[i] == random) {
                            isOverlap = true;
                        }
                    }
    
                    if (isOverlap == false) {
                        workIndex[workIndex.length] = random;
                    }
                } else {
                    break;
                }
            }
        }

        if (workIndex.length >= 1) {
            banner_right_images[0].src = info["info"][workIndex[0]]["cover_image"];
        }
        if (workIndex.length >= 2) {
            banner_right_images[4].src = info["info"][workIndex[1]]["cover_image"];
        }
    }

    //데이터 없음
    let no_data = contents.getElementsByClassName("menu_explore_trending_no_data")[0].getElementsByTagName("span")[0];
    no_data.innerHTML = getLanguage("menu_explore_trending_no_data");
}
function exploreTrendingNoData(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let no_data = contents.getElementsByClassName("menu_explore_trending_no_data")[0];
    no_data.style.display = "flex";
}
function addItemExploreTrendingLoad(menuNumber, info) {
    let contents = document.getElementById("contents_" + menuNumber);
    let work_contents = contents.getElementsByClassName("work_contents")[0];

    let no_data = contents.getElementsByClassName("menu_explore_trending_no_data")[0];
    no_data.style.display = "none";

    let newEl = document.createElement("div");
    newEl.setAttribute("oncontextmenu", "workMoreItems(event, " + info["number"] + ");");
    newEl.classList.add("visible_element");
    newEl.innerHTML = getHtmlWork(info);
    
    work_contents.appendChild(newEl);
}



function showExploreTrendingMoreLoading(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let loading = contents.getElementsByClassName("home_explore_trending_contents_loading")[0];
    loading.style.display = "block";
}
function hideExploreTrendingMoreLoading(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let loading = contents.getElementsByClassName("home_explore_trending_contents_loading")[0];
    loading.style.display = "none";
}
function checkExploreTrendingMoreLoading(menuNumber) {
    if (exploreTrendingLoadNumbers[menuNumber].length == 0) {
        hideExploreTrendingMoreLoading(menuNumber);
        exploreTrendingLoadNumbers[menuNumber] = null;
    } else {
        showExploreTrendingMoreLoading(menuNumber);
    }
}

let isExploreTrendingMoreLoad = new Array();

function checkExploreTrendingLoad() {
    if (getCurrentMenuName() == "explore_trending") {
        let boxSize = 75;

        let scrollPercent = ((document.documentElement.scrollTop + window.innerHeight) / (document.documentElement.scrollHeight - boxSize)) * 100;
        if (scrollPercent >= 100) {
            let number = getCurrentMenuNumber();
            if (isExploreTrendingMoreLoad[number] == null) {
                isExploreTrendingMoreLoad[number] = true;
                moreLoadExploreTrending(number);
            }
        }
    }
}
addEventListener("scroll", checkExploreTrendingLoad);
addEventListener("resize", checkExploreTrendingLoad);
addEventListener("focus", checkExploreTrendingLoad);



function moreLoadExploreTrending(menuNumber) {
    if (exploreTrendingLoadNumbers[menuNumber] == null || exploreTrendingLoadNumbers[menuNumber].length == 0) {
        exploreTrendingLoadNumbers[menuNumber] = null;
        isExploreTrendingMoreLoad[menuNumber] = null;
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
                    addItemExploreTrendingLoad(menuNumber, info[i]);
            
                    let array = exploreTrendingLoadNumbers[menuNumber];
                    array = array.remove("" + info[i]["number"]);
                    exploreTrendingLoadNumbers[menuNumber] = array;
                }

                isExploreTrendingMoreLoad[menuNumber] = null;
                checkExploreTrendingMoreLoading(menuNumber);
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

    let numbers = exploreTrendingLoadNumbers[menuNumber];
    let numbersMaxCount = (numbers.length >= 24) ? 24 : numbers.length;
    numbers = numbers.splice(0, numbersMaxCount);
    
    var formData = new FormData();
    formData.append("lang", userLanguage);
    formData.append("numbers", numbers.join(","));

    xhr.send(formData);
}









































function exploreTrendingSelectGenre(menuNumber, genre) {
    let contents = document.getElementById("contents_" + menuNumber);
    let work_contents = contents.getElementsByClassName("work_contents")[0];
    let genreItem = contents.getElementsByClassName("explore_trending_category_item");
    for (let i = 0; i < genreItem.length; i++) {
        genreItem[i].classList.remove("explore_trending_category_item_selected");
    }
    for (let i = 0; i < genreItem.length; i++) {
        if (genreItem[i].getAttribute("genre") == genre) {
            genreItem = genreItem[i];
            break;
        }
    }
    genreItem.classList.add("explore_trending_category_item_selected");

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/explore/trending/getInfoNumbers.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                work_contents.textContent = "";
                let numbers = info["numbers"].split(",");
                exploreTrendingLoadNumbers[menuNumber] = numbers;

                //
                if (numbers.length != 0 && numbers[0] != "") {
                    let worksInfo = info["info"];
                    for (let i = 0; i < worksInfo.length; i++) {
                        addItemExploreTrendingLoad(menuNumber, worksInfo[i]);
                
                        let array = exploreTrendingLoadNumbers[menuNumber];
                        array = array.remove("" + worksInfo[i]["number"]);
                        exploreTrendingLoadNumbers[menuNumber] = array;
                    }
                    checkExploreTrendingMoreLoading(menuNumber);
                } else {
                    exploreTrendingNoData(menuNumber);
                    hideExploreTrendingMoreLoading(menuNumber);
                }

                isHomeWorkMoreLoad[menuNumber] = null;
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
    if (genre != null) {
        formData.append("genre", genre);
    }

    xhr.send(formData);
}


































function checkExploreTrendingBanner() {
    if (getCurrentMenuName() == "explore_trending") {
        let menuNumber = getCurrentMenuNumber();
        let contents = document.getElementById("contents_" + menuNumber);

        if (contents.getElementsByClassName("explore_trending_banner").length != 0) {
            let banner = contents.getElementsByClassName("explore_trending_banner")[0];

            let left = banner.getElementsByClassName("explore_trending_banner_left")[0];
            let right = banner.getElementsByClassName("explore_trending_banner_right")[0];
    
            right.style.height = left.clientHeight;
        }
    }
}
window.addEventListener("resize", checkExploreTrendingBanner);
window.addEventListener("focus", checkExploreTrendingBanner);

function delayCheckExploreTrendingBanner() {
    function callback() {
        checkExploreTrendingBanner();
    }
    window.requestAnimationFrame(callback);
}