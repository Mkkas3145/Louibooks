

var previousInfoAutoComplete = new Array();
var requestSearchAutoComplete = new Array();

function checkSearchAutoComplete(type, query) {
    
    //태그 구하기
    /*let input = document.activeElement;
    function extractTagString(str, index) {
        let length = str.length;
        let isTag = false;
        let tagString = new Array();
        let tagCount = -1;
        let startIndex = null;
        for (let i = 0; i < length; i++) {
            if (isTag == false) {
                if (str[i] == "#") {
                    tagStart(i);
                }
            } else {
                if (str[i] == "#") {
                    tagStart(i);
                } else if (str[i] == " ") {
                    tagEnd();
                } else {
                    tagString[tagCount]["text"] += str[i];
                    tagString[tagCount]["end"] = (i + 1);
                }
            }
        }
        function tagStart(i) {
            tagCount ++;
            isTag = true;
            tagString[tagCount] = {
                'text': '',
                'start': (i + 1),
                'end': (i + 1)
            };
            startIndex = i;
        }
        function tagEnd() {
            isTag = false;
        }
        length = tagString.length;
        for (let i = 0; i < length; i++) {
            let start = tagString[i]["start"];
            let end = tagString[i]["end"];
            if (start <= index && end >= index) {
                return tagString[i]["text"];
            }
        }
        return null;
    }
    let tagString = extractTagString(query, input.selectionStart);*/

    if (previousInfoAutoComplete[query] == null) {
        const xhr = new XMLHttpRequest();
        const method = "POST";
        
        xhr.open(method, '/php/search/getInfoAutoComplete.php');
        
        xhr.addEventListener('readystatechange', function (event) {
            const { target } = event;
            if (target.readyState === XMLHttpRequest.DONE) {
                const { status } = target;
                if (status === 0 || (status >= 200 && status < 400)) {
                    let xhrHtml = xhr.responseText;
                    let info = JSON.parse(xhrHtml);
                    let newInfo = new Array();

                    if (info["status"] == 1) {
                        //유효하지 않은 쿼리
                        noResultSearchAutoComplete(type);

                        previousInfoAutoComplete[query] = {};
                    } else if (info["status"] == 0) {
                        let result = info["result"];

                        //최근 검색어
                        let recentSearches = getInfoMyRecentSearchesAutoComplete(query);
                        for (let i = 0; i < recentSearches.length; i++) {
                            newInfo[newInfo.length] = recentSearches[i];
                        }

                        //최근 검색어와 일치하는 자동 검색어 제거
                        for (let i = 0; i < result.length; i++) {
                            let isOverlap = false;
                            for (let j = 0; j < recentSearches.length; j++) {
                                if (result[i]["content"] == recentSearches[j]["content"]) {
                                    isOverlap = true;
                                }
                            }
                            if (isOverlap == false) {
                                newInfo[newInfo.length] = result[i];
                            }
                            if (newInfo.length > 10) {
                                break;
                            }
                        }

                        if (newInfo.length != 0) {
                            setItemsSearchAutoComplete(type, newInfo);
                            checkContentSearchAutoComplete();
                        } else {
                            noResultSearchAutoComplete(type);
                        }

                        previousInfoAutoComplete[query] = result;
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
            }
        });
        
        var formData = new FormData();
        formData.append("lang", userLanguage);
        formData.append("query", query);

        xhr.send(formData);
        requestSearchAutoComplete[requestSearchAutoComplete.length] = xhr;
    } else {
        let result = previousInfoAutoComplete[query];
        let newInfo = new Array();

        //최근 검색어
        let recentSearches = getInfoMyRecentSearchesAutoComplete(query);
        for (let i = 0; i < recentSearches.length; i++) {
            newInfo[newInfo.length] = recentSearches[i];
        }

        //최근 검색어와 일치하는 자동 검색어 제거
        for (let i = 0; i < result.length; i++) {
            let isOverlap = false;
            for (let j = 0; j < recentSearches.length; j++) {
                if (result[i]["content"] == recentSearches[j]["content"]) {
                    isOverlap = true;
                }
            }
            if (isOverlap == false) {
                newInfo[newInfo.length] = result[i];
            }
            if (newInfo.length > 10) {
                break;
            }
        }
        
        if (newInfo.length != 0) {
            setItemsSearchAutoComplete(type, newInfo);
            checkContentSearchAutoComplete();
        } else {
            noResultSearchAutoComplete(type);
        }
    }
}
function cancelRequestSearchAutoComplete() {
    for (let i = 0; i < requestSearchAutoComplete.length; i++) {
        requestSearchAutoComplete[i].abort();
    }
}
function getInfoMyRecentSearchesAutoComplete(query) {
    let recentSearches = new Array();
    if (myRecentSearches != null && myRecentSearches.length != 0) {
        let matchRecentSearches = getInfoMatchRecentSearches(query);
        let length = matchRecentSearches.length;
        let maxCount = 5; //최대 5개 최근 검색어 표시
        for (let i = length - 1; i >= 0; i--) {
            if (recentSearches.length < maxCount) {
                recentSearches[recentSearches.length] = matchRecentSearches[i];
            } else {
                return recentSearches;
            }
        }
    }
    return recentSearches;
}
function noResultSearchAutoComplete(type) {
    if (type == "desktop") {
        let search_auto_complete = document.getElementsByClassName("header_search_auto_complete");
        for (let i = 0; i < search_auto_complete.length; i++) {
            search_auto_complete[i].classList.add("hide_header_search_auto_complete");
        }
    } else if (type == "mobile") {
        let search_auto_complete = document.getElementsByClassName("mobile_search_box_auto_complete")[0];
        let items = search_auto_complete.getElementsByClassName("search_auto_complete_box_items")[0];
        items.textContent = "";
    }
}
function setItemsSearchAutoComplete(type, info) {
    if (type == "desktop") {
        let search_auto_complete = document.getElementsByClassName("header_search_auto_complete");
        for (let i = 0; i < search_auto_complete.length; i++) {
            search_auto_complete[i].classList.remove("hide_header_search_auto_complete");

            let items = search_auto_complete[i].getElementsByClassName("search_auto_complete_box_items")[0];
            appendItemsSearchAutoComplete(type, items, info);
        }
    } else if (type == "mobile") {
        let search_auto_complete = document.getElementsByClassName("mobile_search_box_auto_complete")[0];
        let items = search_auto_complete.getElementsByClassName("search_auto_complete_box_items")[0];
        appendItemsSearchAutoComplete(type, items, info);
    }
}
function checkContentSearchAutoComplete() {
    //PC
    let header_search = document.getElementsByClassName("header_search");
    for (let i = 0; i < header_search.length; i++) {
        let originalValue = header_search[i].getElementsByTagName("input")[0].value;
        let value = originalValue;
        value = value.toLowerCase();                                                                        //소문자로 변환
        value = value.replace(new RegExp(/[#\&\+\-%@=\/\\\:;,\.'\"\^`~\_|\!\?\*$#<>()\[\]\{\}]/gi), "");     //특수문자 제거
        value = value.replace(new RegExp(/ +(?= )/gi), "");                                                  //연속된 공백 제거 (2개 이상의 공백 제거)
        value = value.replace(new RegExp(/^\s+/gi), "");                                                      //앞쪽 공백 제거

        let item = header_search[i].getElementsByClassName("search_auto_complete_box_item");

        for (let i = 0; i < item.length; i++) {
            let el = item[i].getElementsByClassName("search_auto_complete_box_item_text")[0];
            let content = item[i].getAttribute("content");
            let html = content;

            let contentRegex = content;
            let contentRegexLength = contentRegex.length;
            for (let i = 0; i < contentRegexLength; i++) {
                let regex = new RegExp("^" + contentRegex);

                let isMatch = regex.test(value);
                if (isMatch == true) {
                    let result = content.match(regex);
                    html = content.replace(regex, '<span style = "font-weight: initial;">' + result + '</span>');
                    break;
                }

                contentRegex = contentRegex.slice(0, -1);
            }

            //검색어 완성 버튼 숨기기
            if (content.trim() == originalValue.trim()) {
                item[i].parentElement.classList.add("hide_complete_button_search_auto_complete");
            }

            el.innerHTML = html;
        }
    }
    //Mobile
    let originalValue = document.getElementById("header_search_input_mobile").value;
    let value = originalValue;
    value = value.toLowerCase();                                                                        //소문자로 변환
    value = value.replace(new RegExp(/[#\&\+\-%@=\/\\\:;,\.'\"\^`~\_|\!\?\*$#<>()\[\]\{\}]/gi), "");     //특수문자 제거
    value = value.replace(new RegExp(/ +(?= )/gi), "");                                                  //연속된 공백 제거 (2개 이상의 공백 제거)
    value = value.replace(new RegExp(/^\s+/gi), "");    
    let search_auto_complete = document.getElementsByClassName("mobile_search_box_auto_complete")[0];
    let item = search_auto_complete.getElementsByClassName("search_auto_complete_box_item");

    for (let i = 0; i < item.length; i++) {
        let el = item[i].getElementsByClassName("search_auto_complete_box_item_text")[0];
        let content = item[i].getAttribute("content");
        let html = content;
        
        let contentRegex = content;
        let contentRegexLength = contentRegex.length;
        for (let i = 0; i < contentRegexLength; i++) {
            let regex = new RegExp("^" + contentRegex);

            let isMatch = regex.test(value);
            if (isMatch == true) {
                let result = content.match(regex);
                html = content.replace(regex, '<span style = "font-weight: initial;">' + result + '</span>');
                break;
            }

            contentRegex = contentRegex.slice(0, -1);
        }

        //검색어 완성 버튼 숨기기
        if (content.trim() == originalValue.trim()) {
            item[i].parentElement.classList.add("hide_complete_button_search_auto_complete");
        }

        el.innerHTML = html;
    }
}

function appendItemsSearchAutoComplete(type, el, info) {
    el.textContent = "";
    for (let i = 0; i < info.length; i++) {
        let item = getItemElementSearchAutoComplete(type, info[i]);
        el.appendChild(item);
    }

    let auto_complete_box = el.parentElement.parentElement;
    if (auto_complete_box.classList.contains("header_search_auto_complete")) {
        auto_complete_box.classList.remove("hide_header_search_auto_complete");
    }
}

function getItemElementSearchAutoComplete(type, info) {
    let newEl = document.createElement("div");
    newEl.classList.add("search_auto_complete_box_item_wrap");
    
    let onclick = "";
    if (type == "desktop") {
        onclick = "pcSearch('" + info["content"] + "');";
    } else if (type == "mobile") {
        onclick = "mobileSearch('" + info["content"] + "');";
    }
    let icon = "";
    if (info["type"] == "default") {
        icon = `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M21.5,43A21.5,21.5,0,0,1,6.3,6.3,21.5,21.5,0,1,1,36.7,36.7,21.359,21.359,0,0,1,21.5,43Zm0-39.605A18.105,18.105,0,1,0,39.605,21.5,18.126,18.126,0,0,0,21.5,3.394Z"></path><rect width="3" height="20" rx="1.5" transform="translate(33.904 35.858) rotate(-45)"></rect></g></svg>
        `;
    } else if (info["type"] == "copied_text") {
        icon = `
            <!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.984 21v-14.016h-10.969v14.016h10.969zM18.984 5.016q0.797 0 1.406 0.586t0.609 1.383v14.016q0 0.797-0.609 1.406t-1.406 0.609h-10.969q-0.797 0-1.406-0.609t-0.609-1.406v-14.016q0-0.797 0.609-1.383t1.406-0.586h10.969zM15.984 0.984v2.016h-12v14.016h-1.969v-14.016q0-0.797 0.586-1.406t1.383-0.609h12z"></path></svg>
        `;
    } else if (info["type"] == "recent_searches") {
        icon = `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25-20a24.846,24.846,0,0,1-9.731-1.965,24.915,24.915,0,0,1-7.947-5.358,24.915,24.915,0,0,1-5.358-7.947A24.837,24.837,0,0,1,0-45H3A21.852,21.852,0,0,0,9.451-29.451,21.852,21.852,0,0,0,25-23,22.025,22.025,0,0,0,47-45,22.025,22.025,0,0,0,25-67,21.939,21.939,0,0,0,5.407-55H2.08a24.925,24.925,0,0,1,5.242-7.678,24.915,24.915,0,0,1,7.947-5.358A24.831,24.831,0,0,1,25-70a24.831,24.831,0,0,1,9.731,1.965,24.915,24.915,0,0,1,7.947,5.358,24.92,24.92,0,0,1,5.358,7.946A24.839,24.839,0,0,1,50-45a24.837,24.837,0,0,1-1.965,9.731,24.915,24.915,0,0,1-5.358,7.947,24.915,24.915,0,0,1-7.947,5.358A24.846,24.846,0,0,1,25-20Zm9.99-16.451a1.494,1.494,0,0,1-.749-.2L23.877-42.636A1.5,1.5,0,0,1,23-44V-59a1.5,1.5,0,0,1,1.5-1.5A1.5,1.5,0,0,1,26-59v14.126l9.742,5.623a1.5,1.5,0,0,1,.549,2.049A1.506,1.506,0,0,1,34.99-36.451Z" transform="translate(0 70)"></path><g transform="translate(-2 4)"><rect width="3" height="12" rx="1.5" transform="translate(2.871 2.017)"></rect><rect width="3" height="12" rx="1.5" transform="matrix(0.259, 0.966, -0.966, 0.259, 14.462, 8.276)"></rect></g></g></svg>
        `;
    } else if (info["type"] == "work") {
        icon = `
            <div class = "search_auto_complete_box_item_cover img_wrap">
                <img src = "` + info["info"]["coverImage"] + `" alt = "">
            </div>
        `;
    } else if (info["type"] == "user") {
        icon = `
            <div class = "search_auto_complete_box_item_profile">
                <div class = "profile_element">
                    <div class = "profile_info">` + JSON.stringify(info["info"]["profile"]) + `</div>
                    <div class = "profile_image"></div>
                </div>
            </div>
        `;
    }
    
    let date = '';
    if (info["searchDate"] != null) {
        date = `
            <div class = "search_auto_complete_box_item_date">
                ` + getTimePast(new Date(info["searchDate"])) + `
            </div>
        `;
    }

    let description = '';
    if (info["info"] != null && info["info"]["description"] != null && info["info"]["description"] != "") {
        description = `
            <div class = "search_auto_complete_box_item_description">
                ` + info["info"]["description"] + `
            </div>
        `;
    }

    newEl.innerHTML = `
        <div class = "search_auto_complete_box_item md-ripples" onclick = "` + onclick + `" oncontextmenu = "searchAutoCompleteItemMoreButton('` + type + `', this, event, '` + info["type"] + `');" onmouseover = "searchAutoCompleteItemFocus(this);" onmouseout = "searchAutoCompleteItemBlur(this);" content = "` + info["content"] + `">
            <div class = "search_auto_complete_box_item_left">
                ` + icon + `
            </div>
            <div class = "search_auto_complete_box_item_center">
                <div class = "search_auto_complete_box_item_text">
                    ` + info["content"] + `
                </div>
                ` + date + `
                ` + description + `
            </div>
        </div>
        <div class = "search_auto_complete_box_item_wrap_right">
            <div class = "search_auto_complete_box_item_wrap_right_box md-ripples" onclick = "insertContentSearchAutoComplete('` + type + `', this);" onmouseenter = "hoverInformation(this, getLanguage('search_complete_button'));">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(8.029 8.029)"><rect width="3" height="30" rx="1.5"/><rect width="3" height="45" rx="1.5" transform="translate(0 2.121) rotate(-45)"/><rect width="3" height="30" rx="1.5" transform="translate(0 3) rotate(-90)"/></g></g></svg>
            </div>
        </div>
    `;
    return newEl;
}
//itemType = 'default', 'recent_searches', 'work'
function searchAutoCompleteItemMoreButton(type, el, event, itemType) {
    let content = el.getAttribute("content");

    let slot = new Array();
    slot[slot.length] = {
        'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(8.029 8.029)"><rect width="3" height="30" rx="1.5"/><rect width="3" height="45" rx="1.5" transform="translate(0 2.121) rotate(-45)"/><rect width="3" height="30" rx="1.5" transform="translate(0 3) rotate(-90)"/></g></g></svg>',
        'title': getLanguage("search_complete_button"),
        'onclick': 'insertContentSearchAutoComplete(\'' + type + '\', null, \'' + content + '\');',
    };
    if (itemType == "recent_searches") {
        slot[slot.length] = {
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 28"><path d="M8 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM12 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM16 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM18 22.813v-14.812h-14v14.812c0 0.75 0.422 1.188 0.5 1.188h13c0.078 0 0.5-0.438 0.5-1.188zM7.5 6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094 0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5 0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375 0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391 2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094 2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z"></path></svg>',
            'title': getLanguage("search_delete_history"),
            'onclick': 'deleteRecentSearchesAutoComplete(\'' + type + '\', \'' + content + '\');',
            'class': 'more_button_item_delete',
        };
    }
    moreButton(null, slot, event);
}
//el = content 정보를 얻기 위한 앨리먼트
//content = 이 매개변수가 있다면 el는 필요하지 않음
function insertContentSearchAutoComplete(type, el, content) {
    if (content == null) {
        content = el.parentElement.parentElement;
        content = content.getElementsByClassName("search_auto_complete_box_item")[0].getAttribute("content");
    }
    
    if (type == "desktop") {
        let header_search = document.getElementsByClassName("header_search");
        for (let i = 0; i < header_search.length; i++) {
            let input = header_search[i].getElementsByTagName("input")[0];
            input.value = content;
            input.focus();
            changeValueSearchInput(input);
        }

        let media = window.matchMedia("screen and (max-width: 700px)").matches;
        if (media == true) {
            isHeaderSearchClick = true;
            mobileSearchButton();
        }
    } else if (type == "mobile") {
        let input = document.getElementById("header_search_input_mobile");
        input.value = content;
        input.focus();
        checkValueMobileSearch(input);
    }
}
function searchAutoCompleteItemFocus(el) {
    let item = el.parentElement.parentElement.getElementsByClassName("search_auto_complete_box_item");
    for (let i = 0; i < item.length; i++) {
        item[i].classList.remove("search_auto_complete_box_item_focus");
    }

    el.classList.add("search_auto_complete_box_item_focus");
}
function searchAutoCompleteItemBlur(el) {
    let item = el.parentElement.parentElement.getElementsByClassName("search_auto_complete_box_item");
    for (let i = 0; i < item.length; i++) {
        item[i].classList.remove("search_auto_complete_box_item_focus");
    }
}
function searchAutoCompleteItemKeyDown(e) {
    if (e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 13 || e.keyCode == 16 || (e.ctrlKey == true && e.keyCode != 8)) {
        ignoreKeyDownSearchInput = true;
        function callback() {
            ignoreKeyDownSearchInput = false;
        }
        window.requestAnimationFrame(callback);
    }
    //위 아래 키
    if (e.keyCode == 38 || e.keyCode == 40) {
        let focusAutoCompleteItems = null;
        let autoCompleteInput = null;
        let autoCompleteType = "";
        //데스크톱
        let header_search = document.getElementsByClassName("header_search");
        for (let i = 0; i < header_search.length; i++) {
            let search_auto_complete = header_search[i].getElementsByClassName("header_search_auto_complete")[0];
            if (search_auto_complete != null && search_auto_complete.classList.contains("blur_header_search_auto_complete") == false && search_auto_complete.classList.contains("hide_header_search_auto_complete") == false) {
                let items = search_auto_complete.getElementsByClassName("search_auto_complete_box_items")[0];
                focusAutoCompleteItems = items;
                autoCompleteInput = header_search[i].getElementsByTagName("input")[0];
                autoCompleteType = "desktop";
            }
        }
        //모바일
        if (isShowMobileSearch == true) {
            let mobile_search = document.getElementsByClassName("mobile_search")[0];
            let items = mobile_search.getElementsByClassName("search_auto_complete_box_items")[0];
            focusAutoCompleteItems = items;
            autoCompleteInput = mobile_search.getElementsByTagName("input")[0];
            autoCompleteType = "mobile";
        }
        if (focusAutoCompleteItems == null) {
            return;
        }
        let item = focusAutoCompleteItems.getElementsByClassName("search_auto_complete_box_item");
        let maxCount = item.length - 1;

        //
        let order = 0;
        if (e.keyCode == 38) {
            order = maxCount;
        }
        //이미 포커스가 되어 있다면 포커스가 되어 있는 순서
        for (let i = 0; i < item.length; i++) {
            if (item[i].classList.contains("search_auto_complete_box_item_focus")) {
                order = i;
                if (e.keyCode == 38) {
                    order --;
                }
                if (e.keyCode == 40) {
                    order ++;
                }
            }
        }

        if (order < 0 || order > maxCount) {
            let focusElement = item[0];
            searchAutoCompleteItemBlur(focusElement);

            if (autoCompleteType == "desktop") {
                let header_search = document.getElementsByClassName("header_search");
                for (let i = 0; i < header_search.length; i++) {
                    let input = header_search[i].getElementsByTagName("input")[0];
                    input.value = "";
                    input.value = autoCompleteInput.getAttribute("previous_value");
                }
            } else {
                autoCompleteInput.value = "";
                autoCompleteInput.value = autoCompleteInput.getAttribute("previous_value");
            }
        } else {
            let focusElement = item[order];
            searchAutoCompleteItemFocus(focusElement);

            if (autoCompleteType == "desktop") {
                let header_search = document.getElementsByClassName("header_search");
                for (let i = 0; i < header_search.length; i++) {
                    let input = header_search[i].getElementsByTagName("input")[0];
                    input.value = focusElement.getAttribute("content");
                }
            } else {
                autoCompleteInput.value = focusElement.getAttribute("content");
            }
        }

        ignoreKeyDownSearchInput = true;
        function callback() {
            ignoreKeyDownSearchInput = false;
            checkRemoveAllTexts();
        }
        window.requestAnimationFrame(callback);

        //기본 동작 취소
        e.preventDefault();
        e.returnValue = false;
    }
}
addEventListener("keydown", searchAutoCompleteItemKeyDown);

function isFocusAutoCompleteItem() {
    let item = document.getElementsByClassName("search_auto_complete_box_item");
    for (let i = 0; i < item.length; i++) {
        if (item[i].classList.contains("search_auto_complete_box_item_focus")) {
            return true;
        }
    }
    return false;
}

function deleteRecentSearchesAutoComplete(type, content) {
    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/history/search/delete.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                
                //삭제 및 초기화
                deleteMyRecentSearches(content);

                //콘텐츠 변경
                if (type == "desktop") {
                    let header_search = document.getElementsByClassName("header_search");
                    for (let i = 0; i < header_search.length; i++) {
                        let input = header_search[i].getElementsByTagName("input")[0];
                        let value = input.value;
    
                        if (value != null && value.trim() == "") {
                            let search_auto_complete = document.getElementsByClassName("header_search_auto_complete");
                            for (let i = 0; i < search_auto_complete.length; i++) {
                                search_auto_complete[i].classList.add("hide_header_search_auto_complete");
                            }
                            checkMyRecentSearches("desktop");
                        } else {
                            checkSearchAutoComplete("desktop", value);
                        }
                    }
                } else if (type == "mobile") {
                    let mobile_search = document.getElementsByClassName("mobile_search")[0];
                    let value = mobile_search.getElementsByTagName("input")[0].value;
                    if (value != null && value.trim() == "") {
                        let search_auto_complete = document.getElementsByClassName("mobile_search_box_auto_complete")[0];
                        let items = search_auto_complete.getElementsByClassName("search_auto_complete_box_items")[0];
                        items.textContent = "";
            
                        checkMyRecentSearches("mobile");
                    } else {
                        checkSearchAutoComplete("mobile", value);
                    }
                }

                actionMessage(getLanguage("search_delete_history_message"));
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
    formData.append("content", content);

    xhr.send(formData);
}















/*
    최근 검색어
*/
var myRecentSearches = null;
function requestRecentSearches() {
    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/history/search/getInfoAllHistory.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                if (xhrHtml != "not login") {
                    let info = JSON.parse(xhrHtml);
                    let newInfo = new Array();

                    let length = info.length;
                    for (let i = 0; i < length; i++) {
                        newInfo[newInfo.length] = {
                            "type": "recent_searches",
                            "content": info[i]["content"],
                            "searchDate": info[i]["search_date"]
                        };
                    }
                    myRecentSearches = newInfo;

                    let mobile_search = document.getElementsByClassName("mobile_search")[0];
                    let search_input = mobile_search.getElementsByTagName("input")[0];
                    if (search_input.value.trim() == "") {
                        checkMyRecentSearches("mobile");
                    }
                    let header_search = document.getElementsByClassName("header_search")[0];
                    search_input = header_search.getElementsByTagName("input")[0];
                    if (search_input.value.trim() == "") {
                        checkMyRecentSearches("desktop");
                    }
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
        }
    });
    
    var formData = new FormData();

    xhr.send(formData);
}
function checkMyRecentSearches(type) {
    //최근 검색어가 있을 경우
    if (myRecentSearches != null && myRecentSearches.length != 0) {
        let recentSearches = new Array();
        let maxCount = 10; //최대 10개 최근 검색어 표시
        let length = myRecentSearches.length;
        for (let i = length - 1; i >= 0; i--) {
            if (recentSearches.length < maxCount) {
                recentSearches[recentSearches.length] = myRecentSearches[i];
            } else {
                break;
            }
        }
        setItemsSearchAutoComplete(type, recentSearches);
    } else {
        noResultSearchAutoComplete(type);
    }
}
function insertMyRecentSearches(content) {
    if (myRecentSearches != null) {
        deleteMyRecentSearches(content);

        let curr = new Date();
        let utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
        let currentTime = new Date(utc);
        let newDate = dateTimeFormat(currentTime, "yyyy-MM-dd HH:mm:ss");

        let newData = {
            type: 'recent_searches',
            content: content,
            searchDate: newDate
        };
        myRecentSearches[myRecentSearches.length] = newData;
    }
}
function deleteMyRecentSearches(content) {
    if (myRecentSearches != null) {
        let newArray = new Array();
        let length = myRecentSearches.length;
        for (let i = 0; i < length; i++) {
            if (myRecentSearches[i]["content"] != content) {
                newArray[newArray.length] = myRecentSearches[i];
            }
        }
        myRecentSearches = newArray;
    }
}
function getInfoMatchRecentSearches(compare) {
    let info = new Array();

    let length = myRecentSearches.length;
    for (let i = 0; i < length; i++) {
        let content = myRecentSearches[i]["content"];
        if (isMatchSearchCompare(content, compare)) {
            info[info.length] = myRecentSearches[i];
        }
    }

    return info;
}
function isMatchSearchCompare(search, compare) {
    search = getStringSearchCompare(search);
    compare = getStringSearchCompare(compare);

    let reg = new RegExp("^" + compare);
    if (search.match(reg)) {
        return true;
    }
    return false;
}
function getStringSearchCompare(string) {
    //소문자로 변환
    string = string.toLowerCase();
    //특수문자 제거
    string = string.replace(new RegExp(/[#\&\+\-%@=\/\\\:;,\.'\"\^`~\_|\!\?\*$#<>()\[\]\{\}]/gi), "");
    //연속된 공백 제거 (2개 이상의 공백 제거)
    string = string.replace(new RegExp(/ +(?= )/gi), "");
    //앞쪽 공백 제거
    string = string.replace(new RegExp(/^\s+/gi), "");
    string = getHangulList(string);

    return string;
}