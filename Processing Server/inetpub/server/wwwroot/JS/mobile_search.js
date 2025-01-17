

var isShowMobileSearch = false;

function showMobileSearch(isHistory, query) {
    if (isShowMobileSearch == false) {
        (query == null) ? query = "" : null;

        //
        let mobile_search = document.getElementsByClassName("mobile_search")[0];
        let items = mobile_search.getElementsByClassName("search_auto_complete_box_items")[0];
        items.innerHTML = "";

        //
        mobile_search.style.animation = "showMobileSearch 0.1s forwards";
        mobile_search.style.opacity = 1;
        setTimeout(() => {
            mobile_search.style.animation = null;
        }, 100);
        mobile_search.style.display = "block";
    
        if (isHistory == null || isHistory == false) {
            let historyData = {
                "type": "mobileSearch",
                "query": query
            };
            history.pushState(historyData, null, null);
        }

        //포커스
        let input_mobile = document.getElementById("header_search_input_mobile");
        input_mobile.value = query;
        input_mobile.focus();
    
        isShowMobileSearch = true;
        setBodyScroll(false);
        searchInputFocus(mobile_search.getElementsByTagName("input")[0]);
    }
}

function hideMobileSearch() {
    if (isShowMobileSearch == true) {
        let mobile_search = document.getElementsByClassName("mobile_search")[0];
        mobile_search.style.animation = "hideMobileSearch 0.1s forwards";
        mobile_search.style.opacity = null;
        setTimeout(() => {
            mobile_search.style.display = "none";
        }, 100);
    
        isShowMobileSearch = false;
        setBodyScroll(true);
    }
}

function checkValueMobileSearch(el) {
    function callback() {
        if (ignoreKeyDownSearchInput == false) {
            let value = el.value;

            if (value != null && value.trim() == "") {
                let search_auto_complete = document.getElementsByClassName("mobile_search_box_auto_complete")[0];
                let items = search_auto_complete.getElementsByClassName("search_auto_complete_box_items")[0];
                items.textContent = "";
    
                checkMyRecentSearches("mobile");
            } else {
                checkSearchAutoComplete("mobile", value);
            }
        }
    }
    window.requestAnimationFrame(callback);
}