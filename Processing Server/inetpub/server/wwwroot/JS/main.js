
//전역 변수
var work_cover_default_url = "/IMG/work_cover_default.png";
history.scrollRestoration = 'manual'; //히스토리 스크롤 복구 X
var languages = new Array("en", "ko", "ja");
var locations = new Array("gh", "gt", "ge", "gr", "ng", "za", "nl", "np", "no", "nz", "ni", "tw", "dk", "do", "de", "la", "lv", "ru", "lb", "ro", "li", "my", "mx", "ma", "me", "mt", "us", "bh", "bd", "ve", "vn", "be", "by", "ba", "bo", "mk", "bg", "br", "sa", "cy", "sn", "rs", "lk", "se", "ch", "es", "sk", "si", "sg", "ae", "ar", "is", "ie", "az", "dz", "ee", "ec", "sv", "gb", "ye", "om", "at", "hn", "jo", "ug", "uy", "ua", "iq", "il", "eg", "it", "in", "id", "jp", "jm", "zw", "cz", "cl", "kz", "qa", "kh", "ca", "ke", "cr", "co", "kw", "hr", "tz", "th", "tr", "tn", "pa", "py", "pk", "pg", "pe", "pt", "pl", "pr", "fr", "fi", "ph", "kr", "hu", "au", "hk");
//관련된 언어
var relatedLanguages = {
    "kr": "ko",
    "us": "en",
    "jp": "ja"
};
var userLocation = null;

function getLocation() {
    let location = "";
    if (getCookie('location') != null && getCookie('location') != 'null') {
        location = getCookie('location');
    } else {
        location = "default";
    }
    return location;
}
function setLocation(loc) {
    setCookie("location", loc);
}

let cookieValue = new Array();
function setCookie(name, value) {
    var date = new Date();
    date.setTime((date.getTime() + 86400 * 30 * 12) * 1000);
    document.cookie = (name + "=; expires=" + date.toUTCString());
    document.cookie = (name + '=' + value + '; expires=' + date.toUTCString() + '; path=/; domain=.louibooks.com; SameSite=None; Secure');

    cookieValue[name] = value;
}
function getCookie(name) {
    if (cookieValue[name] == null) {
        let value = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        value = (value ? value.pop() : null);
        cookieValue[name] = value;
        return value;
    } else {
        return cookieValue[name];
    }
}
function setBodyScroll(isScroll) {
    if (isScroll == true) {
        document.body.style.overflow = "auto";
        document.body.style.overflow = "overlay";
    } else {
        document.body.style.overflow = "hidden";
    }
}
function isPossibleBodyScroll() {
    if (document.body.style.overflow == "hidden") {
        return false;
    } else {
        return true;
    }
}
var booleanTouchDevice = checkTouchDevice();
function checkTouchDevice() {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
}
function isTouchDevice() {
    return booleanTouchDevice;
}


//키보드 접근성
function focusAccessibility(e) {
    let target = e.target;
    closeHoverInformation();
    
    let style = window.getComputedStyle(target);
    if (style.getPropertyValue("--focus-visible").trim() == 'true') {
        if (target.getAttribute("onmouseenter") != null) {
            target.onmouseenter();
        }
    }

    target.addEventListener("keydown", keydownAccessibility);
}
function keydownAccessibility(e) {
    if (e.keyCode == 13) {
        let style = getComputedStyle(e.target);
        if (style.pointerEvents != "none") {
            //포인터 다운 이벤트
            let rect = e.target.getBoundingClientRect();
            let x = rect.left + (rect.width / 2);
            let y = rect.top + (rect.height / 2);
            e.target.dispatchEvent(new PointerEvent('pointerdown', {clientX: x, clientY: y}));
            //클릭 이벤트
            e.target.click();
            //임시 이벤트
            function callback() {
                e.target.dispatchEvent(new PointerEvent('mouseup'));
            }
            window.requestAnimationFrame(callback);
        }
    }
}

function loadLanguage() {
    //
    let workspace_big_sidebar_profile_title = document.getElementsByClassName("workspace_big_sidebar_profile_title")[0];
    workspace_big_sidebar_profile_title.innerText = getLanguage("workspace_big_sidebar_my_workspace");
    //
    let wrap_sidebar_workspace = document.getElementById("wrap_sidebar_workspace");
    let workspace_big_sidebar_item = wrap_sidebar_workspace.getElementsByClassName("big_sidebar_item_text");
    workspace_big_sidebar_item[0].innerText = getLanguage("sidebar_workspace_dashboard");
    workspace_big_sidebar_item[1].innerText = getLanguage("sidebar_workspace_my_works");
    workspace_big_sidebar_item[2].innerText = getLanguage("sidebar_workspace_monetization");
    workspace_big_sidebar_item[3].innerText = getLanguage("sidebar_workspace_my_page_settings");
    workspace_big_sidebar_item[4].innerText = getLanguage("sidebar_workspace_partner");
    //
    let wrap_footer_workspace = document.getElementById("wrap_footer_workspace");
    let workspace_footer_item = wrap_footer_workspace.getElementsByClassName("footer_item_text");
    workspace_footer_item[0].innerText = getLanguage("sidebar_workspace_dashboard");
    workspace_footer_item[1].innerText = getLanguage("sidebar_workspace_my_works");
    workspace_footer_item[2].innerText = getLanguage("sidebar_workspace_monetization");
    workspace_footer_item[3].innerText = getLanguage("sidebar_workspace_my_page_settings");
    workspace_footer_item[4].innerText = getLanguage("sidebar_workspace_partner");

    //
    let big_sidebar_wrap = document.getElementsByClassName("big_sidebar_wrap");
    for (let i = 0; i < big_sidebar_wrap.length; i++) {
        let type = big_sidebar_wrap[i].getAttribute("type");
        if (type != null) {
            big_sidebar_wrap[i].getElementsByClassName("big_sidebar_title")[0].innerHTML = getLanguage("big_sidebar_title:" + type);
        }
    }

    //
    let header_search = document.getElementsByClassName("header_search");
    for (let i = 0; i < header_search.length; i++) {
        header_search[i].getElementsByTagName("input")[0].setAttribute("placeholder", getLanguage("header_hover:search"));
    }

    //사이드바
    let big_sidebar_item_home = document.getElementsByName("big_sidebar_item_home");
    for (let i = 0; i < big_sidebar_item_home.length; i++) {
        let text = big_sidebar_item_home[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("side_bar:home");
    }
    let big_sidebar_item_explore = document.getElementsByName("big_sidebar_item_explore");
    for (let i = 0; i < big_sidebar_item_explore.length; i++) {
        let text = big_sidebar_item_explore[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("side_bar:explore");
    }
    let big_sidebar_item_library = document.getElementsByName("big_sidebar_item_library");
    for (let i = 0; i < big_sidebar_item_library.length; i++) {
        let text = big_sidebar_item_library[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("side_bar:library");
    }
    let big_sidebar_item_history = document.getElementsByName("big_sidebar_item_history");
    for (let i = 0; i < big_sidebar_item_history.length; i++) {
        let text = big_sidebar_item_history[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("side_bar:history");
    }
    let big_sidebar_item_my_works = document.getElementsByName("big_sidebar_item_my_works");
    for (let i = 0; i < big_sidebar_item_my_works.length; i++) {
        let text = big_sidebar_item_my_works[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("side_bar:my_works");
    }
    let big_sidebar_item_my_work_list = document.getElementsByName("big_sidebar_item_my_work_list");
    for (let i = 0; i < big_sidebar_item_my_work_list.length; i++) {
        let text = big_sidebar_item_my_work_list[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("side_bar:my_work_list");
    }
    let big_sidebar_item_my_user_list = document.getElementsByName("big_sidebar_item_my_user_list");
    for (let i = 0; i < big_sidebar_item_my_user_list.length; i++) {
        let text = big_sidebar_item_my_user_list[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("side_bar:my_user_list");
    }
    let big_sidebar_item_notifications_settings = document.getElementsByName("big_sidebar_item_notifications_settings");
    for (let i = 0; i < big_sidebar_item_notifications_settings.length; i++) {
        let text = big_sidebar_item_notifications_settings[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("side_bar:notifications_settings");
    }

    //큰 사이드바 탐색
    let big_sidebar_title_explore = document.getElementsByName("big_sidebar_title_explore");
    for (let i = 0; i < big_sidebar_title_explore.length; i++) {
        big_sidebar_title_explore[i].innerHTML = getLanguage("side_bar:explore");
    }
    let big_sidebar_item_explore_trending = document.getElementsByName("big_sidebar_item_explore_trending");
    for (let i = 0; i < big_sidebar_item_explore_trending.length; i++) {
        let text = big_sidebar_item_explore_trending[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("side_bar:explore_trending");
    }
    let big_sidebar_item_explore_fantasy = document.getElementsByName("big_sidebar_item_explore_fantasy");
    for (let i = 0; i < big_sidebar_item_explore_fantasy.length; i++) {
        let text = big_sidebar_item_explore_fantasy[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("side_bar:explore_fantasy");
    }
    let big_sidebar_item_explore_healing = document.getElementsByName("big_sidebar_item_explore_healing");
    for (let i = 0; i < big_sidebar_item_explore_healing.length; i++) {
        let text = big_sidebar_item_explore_healing[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("side_bar:explore_healing");
    }
    let big_sidebar_item_explore_horror = document.getElementsByName("big_sidebar_item_explore_horror");
    for (let i = 0; i < big_sidebar_item_explore_horror.length; i++) {
        let text = big_sidebar_item_explore_horror[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("side_bar:explore_horror");
    }
    let big_sidebar_item_explore_learn_more = document.getElementsByName("big_sidebar_item_explore_learn_more");
    for (let i = 0; i < big_sidebar_item_explore_learn_more.length; i++) {
        let text = big_sidebar_item_explore_learn_more[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("side_bar:explore_learn_more");
    }
    let big_sidebar_item_privacy_policy = document.getElementsByName("big_sidebar_item_privacy_policy");
    for (let i = 0; i < big_sidebar_item_privacy_policy.length; i++) {
        let text = big_sidebar_item_privacy_policy[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("side_bar:privacy_policy");
    }
    let big_sidebar_item_write_questions = document.getElementsByName("big_sidebar_item_write_questions");
    for (let i = 0; i < big_sidebar_item_write_questions.length; i++) {
        let text = big_sidebar_item_write_questions[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("popup_write_questions_button");
    }

    //
    let footer_item_home = document.getElementById("footer_item_home");
    let footer_item_text = footer_item_home.getElementsByClassName("footer_item_text")[0];
    footer_item_text.innerHTML = getLanguage("side_bar:home");
    //
    let footer_item_explore = document.getElementById("footer_item_explore");
    footer_item_text = footer_item_explore.getElementsByClassName("footer_item_text")[0];
    footer_item_text.innerHTML = getLanguage("side_bar:explore");
    //
    let footer_item_library = document.getElementById("footer_item_library");
    footer_item_text = footer_item_library.getElementsByClassName("footer_item_text")[0];
    footer_item_text.innerHTML = getLanguage("side_bar:library");
    
    //큰 사이드바 로그아웃 상태
    let logout_status_title = document.getElementsByClassName("big_sidebar_logout_status_title");
    for (let i = 0; i < logout_status_title.length; i++) {
        logout_status_title[i].innerHTML = getLanguage("side_bar_logout_status:title");
    }
    let logout_status_description = document.getElementsByClassName("big_sidebar_logout_status_description");
    for (let i = 0; i < logout_status_description.length; i++) {
        logout_status_description[i].innerHTML = getLanguage("side_bar_logout_status:description");
    }
    let logout_status_button_text = document.getElementsByClassName("big_sidebar_logout_status_button_text");
    for (let i = 0; i < logout_status_button_text.length; i++) {
        logout_status_button_text[i].innerHTML = getLanguage("side_bar_logout_status:button");
    }

    let sidebar_workspace_custom = document.getElementById("wrap_sidebar_workspace_custom");
    let footer_workspace_custom = document.getElementById("wrap_footer_workspace_custom");
    sidebar_workspace_custom.setAttribute("type", null);
    footer_workspace_custom.setAttribute("type", null);

    //내 계정 사이드바
    let big_sidebar_item_my_account_management = document.getElementsByName("big_sidebar_item_my_account_management");
    for (let i = 0; i < big_sidebar_item_my_account_management.length; i++) {
        let text = big_sidebar_item_my_account_management[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("sidebar_my_account_management");
    }
    let big_sidebar_item_my_account_personal_info = document.getElementsByName("big_sidebar_item_my_account_personal_info");
    for (let i = 0; i < big_sidebar_item_my_account_personal_info.length; i++) {
        let text = big_sidebar_item_my_account_personal_info[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("sidebar_my_account_personal_info");
    }
    let big_sidebar_item_my_account_privacy = document.getElementsByName("big_sidebar_item_my_account_privacy");
    for (let i = 0; i < big_sidebar_item_my_account_privacy.length; i++) {
        let text = big_sidebar_item_my_account_privacy[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("sidebar_my_account_privacy");
    }
    let big_sidebar_item_my_account_security = document.getElementsByName("big_sidebar_item_my_account_security");
    for (let i = 0; i < big_sidebar_item_my_account_security.length; i++) {
        let text = big_sidebar_item_my_account_security[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("sidebar_my_account_security");
    }
    //내 계정 푸터
    let footer_item_my_account_management = document.getElementById("footer_item_my_account_management");
    footer_item_my_account_management.getElementsByClassName("footer_item_text")[0].innerHTML = getLanguage("sidebar_my_account_management");
    let footer_item_my_account_personal_info = document.getElementById("footer_item_my_account_personal_info");
    footer_item_my_account_personal_info.getElementsByClassName("footer_item_text")[0].innerHTML = getLanguage("sidebar_my_account_personal_info");
    let footer_item_my_account_privacy = document.getElementById("footer_item_my_account_privacy");
    footer_item_my_account_privacy.getElementsByClassName("footer_item_text")[0].innerHTML = getLanguage("sidebar_my_account_privacy");
    let footer_item_my_account_security = document.getElementById("footer_item_my_account_security");
    footer_item_my_account_security.getElementsByClassName("footer_item_text")[0].innerHTML = getLanguage("sidebar_my_account_security");

    //관리자 사이드바
    let big_sidebar_item_admin_dashboard = document.getElementsByName("big_sidebar_item_admin_dashboard");
    for (let i = 0; i < big_sidebar_item_admin_dashboard.length; i++) {
        let text = big_sidebar_item_admin_dashboard[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("sidebar_admin_dashboard");
    }
    let big_sidebar_item_admin_questions = document.getElementsByName("big_sidebar_item_admin_questions");
    for (let i = 0; i < big_sidebar_item_admin_questions.length; i++) {
        let text = big_sidebar_item_admin_questions[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("sidebar_admin_questions");
    }
    let big_sidebar_item_admin_user_report = document.getElementsByName("big_sidebar_item_admin_user_report");
    for (let i = 0; i < big_sidebar_item_admin_user_report.length; i++) {
        let text = big_sidebar_item_admin_user_report[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("sidebar_admin_user_report");
    }
    let big_sidebar_item_admin_work_report = document.getElementsByName("big_sidebar_item_admin_work_report");
    for (let i = 0; i < big_sidebar_item_admin_work_report.length; i++) {
        let text = big_sidebar_item_admin_work_report[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("sidebar_admin_work_report");
    }
    let big_sidebar_item_admin_monetization_approval = document.getElementsByName("big_sidebar_item_admin_monetization_approval");
    for (let i = 0; i < big_sidebar_item_admin_monetization_approval.length; i++) {
        let text = big_sidebar_item_admin_monetization_approval[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("sidebar_admin_monetization_approval");
    }
    let big_sidebar_item_admin_partner_approval = document.getElementsByName("big_sidebar_item_admin_partner_approval");
    for (let i = 0; i < big_sidebar_item_admin_partner_approval.length; i++) {
        let text = big_sidebar_item_admin_partner_approval[i].getElementsByClassName("big_sidebar_item_text")[0];
        text.innerHTML = getLanguage("sidebar_admin_partner_approval");
    }
    //관리자 푸터
    let footer_item_admin_dashboard = document.getElementById("footer_item_admin_dashboard");
    footer_item_admin_dashboard.getElementsByClassName("footer_item_text")[0].innerHTML = getLanguage("sidebar_admin_dashboard");
    let footer_item_admin_questions = document.getElementById("footer_item_admin_questions");
    footer_item_admin_questions.getElementsByClassName("footer_item_text")[0].innerHTML = getLanguage("sidebar_admin_questions");
    let footer_item_user_report = document.getElementById("footer_item_admin_user_report");
    footer_item_user_report.getElementsByClassName("footer_item_text")[0].innerHTML = getLanguage("sidebar_admin_user_report");
    let footer_item_work_report = document.getElementById("footer_item_admin_work_report");
    footer_item_work_report.getElementsByClassName("footer_item_text")[0].innerHTML = getLanguage("sidebar_admin_work_report");
    let footer_item_monetization_approval = document.getElementById("footer_item_admin_monetization_approval");
    footer_item_monetization_approval.getElementsByClassName("footer_item_text")[0].innerHTML = getLanguage("sidebar_admin_monetization_approval");
    let footer_item_partner_approval = document.getElementById("footer_item_admin_partner_approval");
    footer_item_partner_approval.getElementsByClassName("footer_item_text")[0].innerHTML = getLanguage("sidebar_admin_partner_approval");

    let big_sidebar_title_admin_work = document.getElementsByClassName("big_sidebar_title_admin_work")[0];
    big_sidebar_title_admin_work.innerHTML = getLanguage("sidebar_admin_title:work");

    //
    let site_loading = document.getElementsByClassName("site_loading")[0];
    site_loading.innerHTML = `
        <div class = "site_loading_effect" style = "display: none;"></div>
        <div class = "site_loading_icon" style = "display: none;">
            ` + getSVGLouibooksLogo(0) + `
        </div>
        <div class = "site_loading_louibooks" style = "display: none;">
            LOUIBOOKS
        </div>
    `;
    site_loading.setAttribute("duration", 1.2);
    site_loading.setAttribute("start_time", new Date().getTime());

    let effect = site_loading.getElementsByClassName("site_loading_effect")[0];
    let icon = site_loading.getElementsByClassName("site_loading_icon")[0];
    let louibooks = site_loading.getElementsByClassName("site_loading_louibooks")[0];
    setTimeout(() => {
        effect.style.display = null;
        icon.style.display = null;
        louibooks.style.display = null;
        setTimeout(() => {
            effect.style.animation = "siteLoadingEffectLoadingAni 1s infinite";
            icon.style.animation = "siteLoadingIconLoadingAni 1s infinite";
        }, 1000);
    }, 200);

    let header_left_alpha = document.getElementsByClassName("header_left_alpha")[0];
    header_left_alpha.innerHTML = '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M12 0l-12 16h12l-8 16 28-20h-16l12-12z"></path></svg>' + getLanguage("alpha");
}

//웹사이트 로드 완료
function siteLoad() {
    let isEvent = loadManagement();

    //loadManagement 함수에서 무슨 일도 안 일어났을 경우
    if (isEvent == false) {
        urlRewrite();
    } else {
        let site_loading = document.getElementsByClassName("site_loading")[0];
        //빠른 시작
        site_loading.classList.add("md-ripples");
        site_loading.style.cursor = "pointer";
        site_loading.setAttribute("onclick", "this.style.opacity = 0; setTimeout(() => { this.style.display = 'none'; }, 200);");
        //일정 시간 뒤
        let duration = Number.parseFloat(site_loading.getAttribute("duration"));
        let startTime = Number.parseInt(site_loading.getAttribute("start_time"));
        let endTime = new Date().getTime();
        let difference = (duration * 1000) - (endTime - startTime);
        setTimeout(() => {
            site_loading.style.opacity = 0;
            setTimeout(() => {
                site_loading.style.display = "none";
            }, 200);
        }, difference);
    }
    loginCheck(); //로그인 정보 불러오기
    myWorkListCheck(); //작품 목록 정보 불러오기
    requestRecentSearches(); //최근 검색어 정보 불러오기
    myUserListCheck(); //사용자 목록 정보 불러오기

    //언어 로드
    loadLanguage();

    //터치 디바이스 스크롤 숨김
    if (isTouchDevice() == true) {
        document.body.classList.add("scroll_hide");
    }
    //터치 디바이스 Hover 효과 제거
    if (isTouchDevice() == true) {
        try {
            for (var si in document.styleSheets) {
                var styleSheet = document.styleSheets[si];
                if (!styleSheet.rules) continue;
                for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
                    if (!styleSheet.rules[ri].selectorText) continue;
                    if (styleSheet.rules[ri].selectorText.match(':hover')) {
                        styleSheet.deleteRule(ri);
                    }
                }
            }
        } catch (ex) {}
    }

    //위치 구하기
    let meta = document.getElementsByTagName("meta");
    for (let i = 0; i < meta.length; i++) {
        if (meta[i].getAttribute("name") == "location") {
            userLocation = meta[i].getAttribute("content");
            break;
        }
    }

    //내 프로필 팝업 앨리먼트 로드
    loadValuesPopupElementMyProfileSettings();
}

function loadManagement() {
    //모바일 검색 - 자동 완성 보기
    if (history.state != null) {
        let data = history.state;
        if (data["type"] != null) {
            if (data["type"] == "mobileSearch") { showMobileSearch(true, data["query"]); return true; }
        }
    }
    //팝업 콘텐츠
    if (history.state != null) {
        let data = history.state;
        if (data["type"] != null) {
            if (data["type"] == "popupContents") { openPopupContents(data["name"], true, data["data"]); return true; }
        }
    }
    //확인 창
    if (history.state != null) {
        let data = history.state;
        if (data["type"] != null) {
            if (data["type"] == "confirmPopup") { confirmPopup(data["title"], data["subject"], data["execCode"], true); return true; }
        }
    }
    //전체화면 이미지 보기
    if (history.state != null) {
        let data = history.state;
        if (data["type"] != null) {
            if (data["type"] == "fullScreenImage") { fullScreenImage(data["images"], data["order"], true); return true; }
        }
    }

    return false;
}

var ignoreHistoryEvent = false;
var timesIgnoreHistoryEvent = 0; //2번 뒤로가기 시 2로 되어있으면 2번 다 무시
window.onpopstate = (e) => {
    if (ignoreHistoryEvent == false && timesIgnoreHistoryEvent == 0) {
        //메뉴
        if (e.state != null) {
            let data = e.state;
            if (data["url"] != null) { loadMenu(data["url"], data["property"], data["data"], true); }
        }
        
        let isEvent = popstateManagement(e);

        //popstateManagement 함수에서 무슨 일도 안 일어났을 경우
        if (isEvent == false) {
            hideMobileSearch(); //모바일 검색 - 자동 완성 닫기
            hidePopupContents(); //팝업 콘텐츠
            closeConfirmPopup(); //팝업 콘텐츠
            hideFullScreenImage(); // 전체화면 이미지 보기
        }
        //모바일 검색이 켜져 있을 경우
        if (isShowMobileSearch == true) {
            hidePopupContents(); //팝업 콘텐츠
        }
    } else {
        ignoreHistoryEvent = false;
        if (timesIgnoreHistoryEvent > 0) {
            timesIgnoreHistoryEvent --;
        }
    }
}
//히스토리 관리
function popstateManagement(e) {
    //모바일 검색 - 자동 완성 보기
    if (e.state != null) {
        let data = e.state;
        if (data["type"] != null) {
            if (data["type"] == "mobileSearch") { showMobileSearch(true, data["query"]); return true; }
        }
    }
    //팝업 콘텐츠
    if (e.state != null) {
        let data = e.state;
        if (data["type"] != null) {
            if (data["type"] == "popupContents") { openPopupContents(data["name"], true, data["data"]); return true; }
        }
    }
    //확인 창
    if (e.state != null) {
        let data = e.state;
        if (data["type"] != null) {
            if (data["type"] == "confirmPopup") { confirmPopup(data["title"], data["subject"], data["execCode"], true); return true; }
        }
    }
    //전체화면 이미지 보기
    if (e.state != null) {
        let data = e.state;
        if (data["type"] != null) {
            if (data["type"] == "fullScreenImage") { fullScreenImage(data["images"], data["order"], true); return true; }
        }
    }

    return false;
}

function getBodyDisplayColor() {
    let type = getDisplayColor();
    if (type == null || type == 'null') {
        let isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isDark == true) {
            type = "dark";
        } else {
            type = "light";
        }
    } else if (type == "black") {
        type = "dark";
    }
    return type;
}

//type = light, dark
let firstDisplayColorChange = false;
function setDisplayColor(type) {
    document.documentElement.classList.remove("dark_mode");
    document.documentElement.classList.remove("black_mode");

    if (type == null || type == 'null') {
        let isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isDark == true) {
            document.documentElement.classList.add("dark_mode");
            type = "dark";
        } else {
            type = "light";
        }
        setCookie("displayColor", null);
    } else if (type == "light") {
        setCookie("displayColor", "light");
    } else if (type == "dark") {
        document.documentElement.classList.add("dark_mode");
        setCookie("displayColor", "dark");
    } else if (type == "black") {
        document.documentElement.classList.add("black_mode");
        setCookie("displayColor", "black");
    }

    //테마 색깔
    let head = document.getElementsByTagName("head")[0];
    let meta = head.getElementsByTagName("meta");
    for (let i = 0; i < meta.length; i++) {
        if (meta[i].getAttribute("name") == "theme-color") {
            let color = null;
            if (type == "light") {
                color = "#ffffff";
            } else if (type == "dark") {
                color = "#101010";
            } else if (type == "black") {
                color = "#000000";
            }
            meta[i].setAttribute("content", color);
        }
    }

    if (firstDisplayColorChange == true) {
        let style = document.createElement('style');
        style.innerHTML = `
            .change_screen_color * {
                transition: color 0s, background-color 0s, border-color 0s, box-shadow 0s, fill 0s, stroke 0s !important;
            }
        `;
        let newEl = document.head.appendChild(style);

        document.documentElement.classList.add("change_screen_color");
        function callback() {
            document.documentElement.classList.remove("change_screen_color");
            newEl.remove();
        }
        window.requestAnimationFrame(callback);
    } else {
        firstDisplayColorChange = true;
    }

    //그래프 체크
    checkOptionGraphElement();
    setStateGraph();
}
function refreshDisplayColor() {
    let color = getDisplayColor();
    if (color == "light") {
        setDisplayColor("light");
    } else if (color == "dark") {
        setDisplayColor("dark");
    } else if (color == "black") {
        setDisplayColor("black");
    } else {
        setDisplayColor(null);
    }
}
function getDisplayColor() {
    let color = getCookie("displayColor");
    if (color == 'null') {
        return null;
    }
    if (color == "dark") {
        return "dark";
    } else if (color == "black") {
        return "black";
    } else {
        return "light";
    }
}



//이미지 로드 완료 시
function imageLoad(e) {
    let target = e.target;

    let parent = target.parentElement;
    if (parent.parentElement != null && parent.parentElement.classList.contains("image_enhancement")) {
        parent = parent.parentElement;
    }
    if (parent != null && parent.classList.contains("image_enhancement") == true && (parent.getAttribute("load") != true)) {
        let img = parent.getElementsByTagName("img");

        let quality = target.getAttribute("quality");
        if (quality == "original") {
            let lowImage = null;
            let originalImage = null;
            for (let i = 0; i < img.length; i++) {
                if (img[i].getAttribute("quality") == "low") {
                    lowImage = img[i];
                } else if (img[i].getAttribute("quality") == "original") {
                    originalImage = img[i];
                }
            }

            let start = parent.getAttribute("load_time");
            if (start != null) {
                let end = new Date().getTime();
                let difference = end - start;
                let delay = 0.2; //화질이 낮은 이미지가 나타나야 되는 최소 시간 (페이드 인 애니메이션 때문에)
                delay = (delay * 1000) - difference;

                setTimeout(() => {
                    lowImage.style.display = "none";
                    originalImage.style.display = "block";
                }, delay);
            } else {
                lowImage.style.display = "none";
                originalImage.style.display = "block";
                function callback() {
                    parent.setAttribute("load", true);
                    showImage(target);
                }
                window.requestAnimationFrame(callback);
            }
        } else if (quality == "low") {
            function callback() {
                parent.setAttribute("load", true);
                parent.setAttribute("load_time", new Date().getTime());
                showImage(target);
            }
            window.requestAnimationFrame(callback);
        }
    } else {
        showImage(target);
    }
}
function showImage(el) {
    el.style.animation = "imageLoad 0.2s forwards";

    //최대 시도 횟수
    let maxAttempts = 5;
    let parent = el;
    for (let i = 0; i < maxAttempts; i++) {
        parent = parent.parentElement;
        if (parent == null) {
            break;
        }
        if (parent.classList.contains("img_wrap")) {
            parent.style.animationPlayState = "paused";

            new MutationObserver(function onSrcChange() {
                parent.style.animationPlayState = null;
            })
            .observe(el, {attributes: true, attributeFilter: ["src"]})
        }
    }
}
function intiImageEnhancement(el) {
    if (el.classList.contains("image_enhancement") == true && el.getAttribute("load") == 'true') {
        let img = el.getElementsByTagName("img");

        for (let i = 0; i < img.length; i++) {
            img[i].style.display = null;
        }

        el.style.animation = null;
        el.setAttribute("load", false);
    }
}




function videoLoad(e) {
    let target = e.target;
    showVideo(target);
}
function showVideo(el) {
    el.style.animation = "videoLoad 0.2s forwards";

    //최대 시도 횟수
    let maxAttempts = 10;
    let parent = el;
    for (let i = 0; i < maxAttempts; i++) {
        parent = parent.parentElement;
        if (parent == null) {
            break;
        }
        if (parent.classList.contains("video_wrap")) {
            parent.style.animationPlayState = "paused";

            new MutationObserver(function onSrcChange() {
                parent.style.animationPlayState = null;
            })
            .observe(el, {attributes: true, attributeFilter: ["src"]})
        }
    }
}




let vh = window.visualViewport.height * 0.01;
document.documentElement.style.setProperty("--vh", `${vh}px`);

window.addEventListener("resize", () => {
    let vh = window.visualViewport.height * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
});

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}











var loadingStartTime = null;
var previousLoadingTime = 0;
(getCookie("previousLoadingTime") == null) ? null : previousLoadingTime = getCookie("previousLoadingTime");
var isLoading = false;
function loading() {
    loadingStartTime = new Date().getTime();

    let loading_bar = document.getElementsByClassName("loading_bar")[0];
    loading_bar.style.animation = "loading_bar_start 0.1s forwards";

    loadingCompleteAnimation(previousLoadingTime);
    document.body.style.pointerEvents = "none";

    isLoading = true;
}
function loadingComplete() {
    var loadingEndTime = new Date().getTime();
    previousLoadingTime = (loadingEndTime - loadingStartTime) / 1000;
    setCookie("previousLoadingTime", previousLoadingTime);
    loadingStartTime = null;

    let loading_bar = document.getElementsByClassName("loading_bar")[0];
    let loading_bar_progress = document.getElementsByClassName("loading_bar_progress")[0];
    loading_bar_progress.style.transition = "width 0.1s";
    loading_bar_progress.style.width = "100%";
    loading_bar.style.animation = "loading_bar_end 0.1s forwards";
    setTimeout(() => {
        loading_bar_progress.style.transition = null;
        loading_bar_progress.style.width = "0%";
    }, 100);

    document.body.style.pointerEvents = "unset";
    isLoading = false;
}
function loadingCompleteAnimation(second) {
    let loading_bar_progress = document.getElementsByClassName("loading_bar_progress")[0];
    loading_bar_progress.style.width = "0%";
    loading_bar_progress.style.transition = "width " + second + "s";
    loading_bar_progress.style.transitionTimingFunction = "linear";

    function callback() {
        loading_bar_progress.style.width = "100%";
    }
    window.requestAnimationFrame(callback);
}






















































var userLanguage = getUserLanguageName();
document.documentElement.setAttribute("lang", userLanguage);
var siteName = "Louibooks";



function loadMenu_home(historyNoStack) {
    let array = {
        "historyUrl": "/",
        "name": "home",
        "historyTitle": siteName
    };
    if (historyNoStack != null) {
        array["historyNoStack"] = historyNoStack;
    }
    loadMenu("/menu/home.php", array, null);
}
function loadMenu_login() {
    let array = {
        "historyUrl": "/login",
        "name": "login",
        "historyTitle": "로그인 - " + siteName,
        "nothing": true
    };
    loadMenu("/menu/login.php", array, null);
}
function loadMenu_signup() {
    let array = {
        "historyUrl": "/signup",
        "name": "signup",
        "historyTitle": "회원가입 - " + siteName,
        "nothing": true
    };
    loadMenu("/menu/signup.php", array, null);
}
function loadMenu_find_password() {
    let array = {
        "historyUrl": "/find_password",
        "name": "find_password",
        "historyTitle": "비밀번호 찾기 - " + siteName,
        "nothing": true
    };
    loadMenu("/menu/find_password.php", array, null);
}
function loadMenu_other_account(userNumber) {
    let array = {
        "historyUrl": "/other_account/" + userNumber,
        "name": "other_account",
        "historyTitle": "다른 계정으로 로그인 - " + siteName,
        "nothing": true
    };
    loadMenu("/menu/other_account.php", array, userNumber);
}
function loadMenu_workspace() {
    let array = {
        "historyUrl": "/workspace",
        "name": "workspace",
        "historyTitle": getLanguage("header_more_button:workspace"),
    };
    loadMenu("/workspace/main.php", array, null);
}
function loadMenu_cloud() {
    let array = {
        "historyUrl": "/cloud",
        "name": "cloud",
        "historyTitle": getLanguage("header_more_button:cloud"),
        "nothing": true
    };
    loadMenu("/menu/cloud.php", array, null);
}
function loadMenu_novel_editor(number) {
    let array = {
        "historyUrl": "/novel_editor/" + number,
        "name": "novel_editor",
        "historyTitle": getLanguage("menu_name:novel_editor"),
        "nothing": true
    };
    loadMenu("/menu/novel_editor.php", array, number);
}
function loadMenu_viewer(number, type, historyNoStack, contentsLanguage, userTranslationNumber) {
    //팝업 앨리먼트
    if (isShowPopupElement == true && contentsLanguage == null && userTranslationNumber == null) {
        let menuName = getCurrentMenuName();
        if (menuName == "novel_viewer" || menuName == "image_format_viewer") {
            let menuNumber = getCurrentMenuNumber();
            let contents = document.getElementById("contents_" + menuNumber);
            let partNumber = Number.parseInt(contents.getElementsByClassName("part_number")[0].innerHTML);

            if (number == partNumber) {
                hidePopupElement();
                return;
            }
        }
    }

    if (type == "novel") {
        loadMenu_novel_viewer(number, historyNoStack, contentsLanguage, userTranslationNumber);
    } else if (type == "image_format") {
        loadMenu_image_format_viewer(number, historyNoStack, contentsLanguage, userTranslationNumber);
    } else if (type == "video") {
        loadMenu_video(number, historyNoStack, contentsLanguage, userTranslationNumber);
    }
}
function loadMenu_novel_viewer(number, historyNoStack, contentsLanguage, userTranslationNumber) {
    let array = {
        "historyUrl": "/novel/" + number,
        "name": "novel_viewer",
        "nothing": true,
        "historyNoStack": historyNoStack,
    };
    let data = {
        "number": number,
        "contentsLanguage": contentsLanguage,
        "userTranslationNumber": userTranslationNumber
    }
    loadMenu("/menu/novel_viewer.php", array, data);

    partViewedList[partViewedList.length] = number;
    partViewedList = new Set(partViewedList);
    partViewedList = [...partViewedList];

    checkPartViewed();
    checkPercentPartViewed();
}
function loadMenu_image_format_viewer(number, historyNoStack, contentsLanguage, userTranslationNumber) {
    let array = {
        "historyUrl": "/image_format/" + number,
        "name": "image_format_viewer",
        "nothing": true,
        "historyNoStack": historyNoStack,
    };
    let data = {
        "number": number,
        "contentsLanguage": contentsLanguage,
        "userTranslationNumber": userTranslationNumber
    }
    loadMenu("/menu/image_format_viewer.php", array, data);

    partViewedList[partViewedList.length] = number;
    partViewedList = new Set(partViewedList);
    partViewedList = [...partViewedList];

    checkPartViewed();
    checkPercentPartViewed();
}
function loadMenu_video(number, historyNoStack) {
    let array = {
        "historyUrl": "/video/" + number,
        "name": "video",
        "historyNoStack": historyNoStack,
        "hideSidebar": true
    };
    let data = {
        "number": number
    }
    loadMenu("/menu/video.php", array, data);

    partViewedList[partViewedList.length] = number;
    partViewedList = new Set(partViewedList);
    partViewedList = [...partViewedList];
    
    checkPartViewed();
    checkPercentPartViewed();
}
function loadMenu_embed(number) {
    let array = {
        "historyUrl": "/embed/" + number,
        "name": "embed",
        "nothing": true
    };
    let data = {
        "number": number
    }
    loadMenu("/menu/embed.php", array, data);

    partViewedList[partViewedList.length] = number;
    partViewedList = new Set(partViewedList);
    partViewedList = [...partViewedList];

    checkPartViewed();
    checkPercentPartViewed();
}
var partViewedList = new Array();
function checkPartViewed() {
    let items = document.getElementsByClassName("menu_work_part_list_item");
    let items_length = items.length;
    for (let i = 0; i < items_length; i++) {
        let item = items[i];
        if (item.getAttribute("part_number") != null) {
            let partNumber = Number.parseInt(item.getAttribute("part_number"));
            if (partViewedList.includes(partNumber) == true) {
                item.classList.add("menu_work_part_list_item_viewed");
            }
        }
    }
    //동영상 페이지
    items = document.getElementsByClassName("menu_video_right_part_list_item");
    items_length = items.length;
    for (let i = 0; i < items_length; i++) {
        let item = items[i];
        if (item.getAttribute("number") != null) {
            let partNumber = Number.parseInt(item.getAttribute("number"));
            if (partViewedList.includes(partNumber) == true) {
                item.classList.add("menu_video_right_part_list_item_viewed");
            }
        }
    }
}
function checkPercentPartViewed() {
    let items = document.getElementsByClassName("menu_work_part_list_item");
    let items_length = items.length;
    for (let i = 0; i < items_length; i++) {
        let item = items[i];
        if (item.getAttribute("part_number") != null) {
            let partNumber = Number.parseInt(item.getAttribute("part_number"));
            let viewed_percent = item.getElementsByClassName("menu_work_part_list_item_left_viewed_percent");

            if (viewed_percent.length != 0) {
                viewed_percent = viewed_percent[0];
                if (item.classList.contains("menu_work_part_list_item_viewed")) {
                    viewed_percent.classList.add("show_part_list_item_left_viewed_percent");
    
                    let percent = getPercentViewedPart(partNumber);
                    if (percent != null) {
                        let fill = viewed_percent.getElementsByClassName("menu_work_part_list_item_left_viewed_percent_fill")[0];
                        fill.style.width = (percent * 100) + "%";
                    }
                } else {
                    viewed_percent.classList.remove("show_part_list_item_left_viewed_percent");
                }
            }
        }
    }
    //동영상 페이지
    items = document.getElementsByClassName("menu_video_right_part_list_item");
    items_length = items.length;
    for (let i = 0; i < items_length; i++) {
        let item = items[i];
        if (item.getAttribute("number") != null) {
            let partNumber = Number.parseInt(item.getAttribute("number"));
            let viewed_percent = item.getElementsByClassName("menu_video_right_part_list_item_thumbnail_viewed_percent");

            if (viewed_percent.length != 0) {
                viewed_percent = viewed_percent[0];
                if (item.classList.contains("menu_video_right_part_list_item_viewed")) {
                    viewed_percent.classList.add("show_part_list_item_thumbnail_viewed_percent");
    
                    let percent = getPercentViewedPart(partNumber);
                    if (percent != null) {
                        let fill = viewed_percent.getElementsByClassName("menu_video_right_part_list_item_thumbnail_viewed_percent_fill")[0];
                        fill.style.width = (percent * 100) + "%";
                    }
                } else {
                    viewed_percent.classList.remove("show_part_list_item_thumbnail_viewed_percent");
                }
            }
        }
    }
}
var partPercentViewedList = new Array();
function setPercentViewedPart(partNumber, percent) {
    let newArray = new Array();

    let length = partPercentViewedList.length;
    for (let i = 0; i < length; i++) {
        if (partPercentViewedList[i]["number"] != partNumber) {
            newArray[newArray.length] = partPercentViewedList[i];
        }
    }
    partPercentViewedList = newArray;

    partPercentViewedList[partPercentViewedList.length] = {
        "number": partNumber,
        "percent": percent
    };
    partPercentViewedList = new Set(partPercentViewedList);
    partPercentViewedList = [...partPercentViewedList];
    
    checkPercentPartViewed();
}
function getPercentViewedPart(partNumber) {
    let length = partPercentViewedList.length;

    for (let i = 0; i < length; i++) {
        if (partPercentViewedList[i]["number"] == partNumber) {
            return partPercentViewedList[i]["percent"];
        }
    }

    return null;
}
function deletePercentViewedPart(partNumber) {
    partViewedList = partViewedList.filter(item => item !== partNumber);
    partViewedList = new Set(partViewedList);
    partViewedList = [...partViewedList];
    partPercentViewedList = partPercentViewedList.filter(item => item["number"] !== partNumber);
    partPercentViewedList = new Set(partPercentViewedList);
    partPercentViewedList = [...partPercentViewedList];
}
function requestSetPercentViewedPart(partNumber, percent) {
    if (getPercentViewedPart(partNumber) < percent) {
        //클라이언트 정보
        setPercentViewedPart(partNumber, percent);

        //서버 요청
        const xhr = new XMLHttpRequest();
        const method = "POST";
        const url = "/php/work/percent_viewed_part.php";
    
        xhr.open(method, url);
    
        xhr.addEventListener('readystatechange', function (event) {
            const { target } = event;
            if (target.readyState === XMLHttpRequest.DONE) {
                const { status } = target;
                if (status === 0 || (status >= 200 && status < 400)) {
                    //
                }
            }
        });
    
        var formData = new FormData();
        formData.append("partNumber", partNumber);
        formData.append("percent", percent);
    
        xhr.send(formData);
    }
}
function loadMenu_image_format_editor(number) {
    let array = {
        "historyUrl": "/image_format_editor/" + number,
        "name": "image_format_editor",
        "historyTitle": getLanguage("menu_name:image_format_editor"),
        "nothing": true
    };
    loadMenu("/menu/image_format_editor.php", array, number);
}
/*
    visitType:
        -1 = 알 수 없음
        0 = 탐색
        1 = 검색
        2 = Louibooks에서
        3 = 기타
*/
function loadMenu_work(number, visitType) {
    (visitType == null) ? visitType = 2 : null;

    let data = {
        'visitType': visitType,
        'number': Number.parseInt(number)
    }
    if (visitType == -1) {
        //외부 사이트
        let referrer = document.referrer;
        data["incomingUrl"] = referrer;
    }

    let array = {
        "historyUrl": "/work/" + number,
        "name": "work",
    };
    loadMenu("/menu/work.php", array, data);
}
function loadMenu_community(number) {
    //팝업 앨리먼트
    if (isShowPopupElement == true) {
        let menuName = getCurrentMenuName();
        if (menuName == "community") {
            let menuNumber = getCurrentMenuNumber();
            let contents = document.getElementById("contents_" + menuNumber);
            let commentsNumber = Number.parseInt(contents.getElementsByClassName("comments_number")[0].innerHTML);

            if (number == commentsNumber) {
                hidePopupElement();
                return;
            }
        }
    }

    let array = {
        "historyUrl": "/community/" + number,
        "name": "community",
    };
    loadMenu("/menu/community.php", array, number);
}
function loadMenu_my_work_list() {
    let array = {
        "historyUrl": "/my_work_list",
        "name": "my_work_list",
        "historyTitle": getLanguage("menu_name:my_work_list"),
    };
    loadMenu("/menu/my_work_list.php", array);
}
function loadMenu_work_list(number) {
    let array = {
        "historyUrl": "/work_list/" + number,
        "name": "work_list",
    };
    loadMenu("/menu/work_list.php", array, number);
}
function loadMenu_history() {
    let array = {
        "historyUrl": "/history",
        "name": "history",
        "historyTitle": getLanguage("menu_name:history"),
    };
    loadMenu("/menu/history.php", array);
}
function mobileSearch(query) {
    //쿼리 문자열이 중복하는지
    let isHistoryNoStack = false;
    if (query.trim() == "") {
        return;
    }
    let property = currentMenuProperty;
    if (property != null && property["historySearch"] == query) {
        isHistoryNoStack = true;
    }

    if (query.trim() != "") {
        history.back();
        ignoreHistoryEvent = true;
        document.activeElement.blur();
    
        function onMobileSearchHistoryUpdate() {
            loadMenu_search(query, true, isHistoryNoStack);
            hideMobileSearch();
            window.removeEventListener('popstate', onMobileSearchHistoryUpdate);
        }
        window.addEventListener('popstate', onMobileSearchHistoryUpdate);
    }
}
function pcSearch(query) {
    //쿼리 문자열이 중복하는지
    let isHistoryNoStack = false;
    if (query.trim() == "") {
        return;
    }
    let property = currentMenuProperty;
    if (property != null && property["historySearch"] == query) {
        isHistoryNoStack = true;
    }

    if (query.trim() != "") {
        document.activeElement.blur();
        searchInputBlurDesktop();

        loadMenu_search(query, false, isHistoryNoStack);
    }
}
function searchRemoveAllTexts(el) {
    let parent = el.parentElement.parentElement;

    let header_search = document.getElementsByClassName("header_search");
    for (let i = 0; i < header_search.length; i++) {
        let input = header_search[i].getElementsByTagName("input")[0];
        input.value = "";
    }

    let input = parent.getElementsByTagName("input")[0];
    input.focus();
    checkSearchInput(input);

    //
    changeValueSearchInput(input);
    checkValueMobileSearch(input);
}
function loadMenu_comment(number) {
    //팝업 앨리먼트
    if (isShowPopupElement == true) {
        let menuName = getCurrentMenuName();
        if (menuName == "comment") {
            let menuNumber = getCurrentMenuNumber();
            let contents = document.getElementById("contents_" + menuNumber);
            let commentNumber = Number.parseInt(contents.getElementsByClassName("highlighted_comment_number")[0].innerHTML);

            if (number == commentNumber) {
                hidePopupElement();
                return;
            }
        }
    }

    let array = {
        "historyUrl": "/comment/" + number,
        "name": "comment",
    };
    loadMenu("/menu/comment.php", array, number);
}
function loadMenu_rating(number) {
    //팝업 앨리먼트
    if (isShowPopupElement == true) {
        let menuName = getCurrentMenuName();
        if (menuName == "rating") {
            let menuNumber = getCurrentMenuNumber();
            let contents = document.getElementById("contents_" + menuNumber);
            let ratingNumber = JSON.parse(contents.getElementsByClassName("info")[0].innerHTML)["highlightedRatingNumber"];

            if (number == ratingNumber) {
                hidePopupElement();
                return;
            }
        }
    }

    let array = {
        "historyUrl": "/rating/" + number,
        "name": "rating",
    };
    loadMenu("/menu/rating.php", array, number);
}

var ignoreKeyDownSearchInput = false;
function checkSearchInput(el) {
    function callback() {
        if (ignoreKeyDownSearchInput == false) {
            let header_search = document.getElementsByClassName("header_search");
            let value = el.value;
    
            for (let i = 0; i < header_search.length; i++) {
                let input = header_search[i].getElementsByTagName("input")[0];
                if (value != null) {
                    input.value = value;
                    input.setAttribute("previous_value", value);
                }
            }

            let mobile_input = document.getElementById("header_search_input_mobile");
            if (value != null) {
                mobile_input.setAttribute("previous_value", value);
            }
    
            checkRemoveAllTexts();
            checkContentSearchAutoComplete();
        }
    }
    window.requestAnimationFrame(callback);
}
function checkRemoveAllTexts() {
    let header_search = document.getElementsByClassName("header_search");

    for (let i = 0; i < header_search.length; i++) {
        let input = header_search[i].getElementsByTagName("input")[0];
        let remove_all_texts = header_search[i].getElementsByClassName("header_search_remove_all_texts")[0];
        if (input.value == "") {
            remove_all_texts.classList.add("hide_header_search_remove_all_texts");
            cancelRequestSearchAutoComplete();
        } else {
            remove_all_texts.classList.remove("hide_header_search_remove_all_texts");
        }
    }
}
function searchInputFocus(el) {
    if ((window.orientation == null || window.orientation == undefined) == false) {
        showMobileSearch(null, el.value);
        mobileSearchInputFocus(el);
    } else {
        let search_auto_complete = el.parentElement.getElementsByClassName("header_search_auto_complete")[0];
        search_auto_complete.classList.remove("blur_header_search_auto_complete");

        if (el.value.trim() == "") {
            checkMyRecentSearches("desktop");
        } else {
            checkSearchAutoComplete("desktop", el.value);
        }
    }
    checkSearchInput(el);
}
function mobileSearchInputFocus(el) {
    if (el.value.trim() == "") {
        checkMyRecentSearches("mobile");
    } else {
        checkSearchAutoComplete("mobile", el.value);
    }
    checkSearchInput(el);
}

var alreadyChangeValueSearch = false;
function changeValueSearchInput(el) {
    if (alreadyChangeValueSearch == false) {
        let previousValue = el.getAttribute("previous_value");

        function callback() {
            if (ignoreKeyDownSearchInput == false) {
                let value = el.value;

                if (previousValue == null || value != previousValue) {
                    if (value != null && value.trim() == "") {
                        let search_auto_complete = document.getElementsByClassName("header_search_auto_complete");
                        for (let i = 0; i < search_auto_complete.length; i++) {
                            search_auto_complete[i].classList.add("hide_header_search_auto_complete");
                        }
                        checkMyRecentSearches("desktop");
                    } else {
                        checkSearchAutoComplete("desktop", value);
                    }
                    
                    alreadyChangeValueSearch = true;
                    function callback2() {
                        alreadyChangeValueSearch = false;
                    }
                    window.requestAnimationFrame(callback2);
                }
            }
        }
        window.requestAnimationFrame(callback);
    }
}

var isCancelSearchInputBlur = false;
function searchInputBlurDesktop(isForce) {
    if (isCancelSearchInputBlur == false) {         
        function callback() {
            let activeElement = document.activeElement;

            if ((activeElement.tagName.toLowerCase() == "input" && activeElement.type == "search") == false || isForce == true) {
                let search_auto_complete = document.getElementsByClassName("header_search_auto_complete");
                for (let i = 0; i < search_auto_complete.length; i++) {
                    search_auto_complete[i].classList.add("blur_header_search_auto_complete");
                    search_auto_complete[i].classList.add("hide_header_search_auto_complete");
                }
            }
        }
        window.requestAnimationFrame(callback);
    } else {
        isCancelSearchInputBlur = false;
    }
}
addEventListener("mousedown", searchInputBlurDesktop);

var previousCheckSearchInputBlurMatchMedia = window.matchMedia("screen and (max-width: 700px)").matches;
function checkSearchInputBlurDesktop() {
    let media = window.matchMedia("screen and (max-width: 700px)").matches;
    if (media != previousCheckSearchInputBlurMatchMedia) {
        searchInputBlurDesktop(true);

        previousCheckSearchInputBlurMatchMedia = media;
    }
}
addEventListener("resize", checkSearchInputBlurDesktop);

function loadMenu_search(query, isViewInstantly, isHistoryNoStack, filter) {
    //
    let array = {
        "historyUrl": "/search/" + query.replaceAll(" ", "+"),
        "name": "search",
        "viewInstantly": isViewInstantly,
        "historySearch": query,
        "historyNoStack": isHistoryNoStack
    };
    let data = {
        'query': query,
        'filter': defaultSearchFilter
    }
    //검색 필터
    if (filter != null) {
        if (filter["language"] == "user_language") {
            filter["language"] = userLanguage;
        }
        data["filter"] = filter;
    }
    loadMenu("/menu/search.php", array, data);
}
function loadMenu_library() {
    if (loginStatus == null || loginStatus["isLogin"] == true) {
        let array = {
            "historyUrl": "/library",
            "name": "library",
            "historyTitle": getLanguage("menu_name:library"),
        };
        loadMenu("/menu/library.php", array);
    } else {
        loadMenu_login();
    }
}
function loadMenu_user(number) {
    let array = {
        "historyUrl": "/user/" + number,
        "name": "user",
    };
    loadMenu("/menu/user.php", array, number);
}
function loadMenu_my_user_list() {
    let array = {
        "historyUrl": "/my_user_list",
        "name": "my_user_list",
        "historyTitle": getLanguage("menu_name:my_user_list"),
    };
    loadMenu("/menu/my_user_list.php", array);
}
function loadMenu_notifications_settings() {
    let array = {
        "historyUrl": "/notifications_settings",
        "name": "notifications_settings",
        "historyTitle": getLanguage("menu_name:notifications_settings"),
    };
    loadMenu("/menu/notifications_settings.php", array);
}
function loadMenu_explore() {
    let array = {
        "historyUrl": "/explore",
        "name": "explore",
        "historyTitle": getLanguage("menu_name:explore"),
    };
    loadMenu("/menu/explore.php", array);
}
function loadMenu_explore_trending() {
    let array = {
        "historyUrl": "/explore/trending",
        "name": "explore_trending",
        "historyTitle": getLanguage("menu_name:explore_trending"),
    };
    loadMenu("/menu/explore/trending.php", array);
}
function loadMenu_explore_fantasy() {
    let array = {
        "historyUrl": "/explore/fantasy",
        "name": "explore_fantasy",
        "historyTitle": getLanguage("menu_name:explore_fantasy"),
    };
    loadMenu("/menu/explore/fantasy.php", array);
}
function loadMenu_community_guide() {
    let array = {
        "historyUrl": "/community_guide",
        "name": "community_guide",
        "historyTitle": getLanguage("menu_name:community_guide"),
    };
    loadMenu("/menu/community_guide.php", array);
}
function loadMenu_creator_guide() {
    let array = {
        "historyUrl": "/creator_guide",
        "name": "creator_guide",
        "historyTitle": getLanguage("menu_name:creator_guide"),
    };
    loadMenu("/menu/creator_guide.php", array);
}
function loadMenu_preview_premium_profile() {
    let array = {
        "historyUrl": "/preview_premium_profile",
        "name": "preview_premium_profile",
        "historyTitle": getLanguage("menu_name:preview_premium_profile"),
    };
    loadMenu("/menu/preview_premium_profile.php", array);
}
function loadMenu_privacy_policy() {
    let array = {
        "historyUrl": "/privacy_policy",
        "name": "privacy_policy",
        "historyTitle": getLanguage("menu_name:privacy_policy"),
    };
    loadMenu("/menu/privacy_policy.php", array);
}
function loadMenu_reviewed_questions(number) {
    let array = {
        "historyUrl": "/reviewed_questions/" + number,
        "name": "reviewed_questions",
        "historyTitle": getLanguage("menu_name:reviewed_questions"),
    };
    loadMenu("/menu/reviewed_questions.php", array, number);
}
function loadMenu_withdrawal() {
    let array = {
        "historyUrl": "/withdrawal",
        "name": "withdrawal",
        "historyTitle": getLanguage("menu_name:withdrawal")
    };
    loadMenu("/menu/withdrawal.php", array);
}
function loadMenu_payment_history(number) {
    let array = {
        "historyUrl": "/payment_history/" + number,
        "name": "payment_history",
        "historyTitle": getLanguage("menu_name:payment_history")
    };
    loadMenu("/menu/payment_history.php", array, number);
}
function loadMenu_write_questions() {
    let array = {
        "historyUrl": "/write_questions",
        "name": "write_questions",
        "historyTitle": getLanguage("menu_name:write_questions")
    };
    loadMenu("/menu/write_questions.php", array);
}







/* default, search */
function setHeaderType(type) {
    let header_default = document.getElementById("header_default");
    let header_search = document.getElementById("header_search");

    if (type == "default") {
        header_default.style.display = null;
        header_search.style.display = "none";
    } else if (type == "search") {
        header_default.style.display = "none";
        header_search.style.display = null;
    }
}





function refreshCurrentMenu() {
    //히스토리 정보가 있다면 히스토리 정보대로 메뉴 로드
    let data = history.state;
    if (data["url"] != null) {
        let property = data["property"];

        //히스토리가 쌓이지 않음
        property["historyNoStack"] = true;
        property["uniqueNumber"] = null; //고유 번호를 없애야 메뉴 로드를 함
        property["viewInstantly"] = null; //상단 로딩바 생략하지 않음

        loadMenu(data["url"], property, data["data"]);
    }
}

//단축키 새로고침
let isHotkeyRefreshCurrentMenu = false;
let timeoutHotkeyRefreshCurrentMenu = null;
function hotkeyRefreshCurrentMenuKeydown(event) {
    let isInput = false;
    if (document.activeElement != null) {
        let actionTag = document.activeElement.tagName.toLowerCase();
        if (document.activeElement.getAttribute("contenteditable") != null) {
            isInput = true;
        } else if (actionTag == "input") {
            isInput = true;
        }
    }
    if (isInput == false && event.shiftKey == true && event.keyCode == 82) {
        //중요한 메뉴
        let isImportantMenu = false;
        let menuName = getCurrentMenuName();
        if (menuName == "novel_editor" || menuName == "image_format_editor") {
            isImportantMenu = true;
        }

        if (isImportantMenu == true) {
            if (isLoading == false) {
                if (isHotkeyRefreshCurrentMenu == true) {
                    refreshCurrentMenu();
                    isHotkeyRefreshCurrentMenu = false;
                } else {
                    if (timeoutHotkeyRefreshCurrentMenu != null) {
                        clearTimeout(timeoutHotkeyRefreshCurrentMenu);
                        timeoutHotkeyRefreshCurrentMenu = null;
                    }
    
                    actionMessage(getLanguage("hotkey_menu_refresh_message"));
                    isHotkeyRefreshCurrentMenu = true;
                    timeoutHotkeyRefreshCurrentMenu = setTimeout(() => {
                        isHotkeyRefreshCurrentMenu = false;
                    }, 1000);
                }
            } else {
                actionMessage(getLanguage("hotkey_menu_refresh_ignore_message"));
            }
        } else {
            if (isLoading == false) {
                refreshCurrentMenu();
            } else {
                actionMessage(getLanguage("hotkey_menu_refresh_ignore_message"));
            }
        }
    }
}
window.addEventListener("keydown", hotkeyRefreshCurrentMenuKeydown);







/* property 속성들

nothing = 헤더, 푸터 안보이게
hideSidebar = 헤더, 푸터 안보이게
uniqueNumber = 이전 메뉴일 경우 고유 번호가 있음
keepContent = 계속 컨텐츠를 유지함
name = 컨텐츠를 유지할려면 name이 필요함
historyTitle = 메뉴 제목
historyUrl = 주소창 주소                                    (필수 항목)
historySearch = 주소창 검색 내용
historyNoStack = 히스토리가 안쌓임
scrollUp = 스크롤 제일 위로 올리기를 사용할 건지
viewInstantly = 상단 로딩바 생략하고 메뉴 즉시 보기

*/

var historyMemoryMenu = new Array();

var keepContentNumber = new Array();
var menuUniqueNumber = Math.floor(Math.random() * 999999999999);
function loadMenu(url, property, data, isBack) {
    hideHeaderPopup(); //헤더 팝업 숨기기

    (isBack == null) ? isBack = false : null;
    (property == null) ? property = new Array() : null;

    //스크롤 제일 위로 올리기
    if (getCurrentMenuName() == property["name"] && property["scrollUp"] == true && isBack == false) {
        window.scrollTo(
            { top: 0, behavior: 'smooth' }
        );
        return;
    }

    (property == null) ? property = new Array() : null;

    if (property["uniqueNumber"] != null && isMenuExists(property["uniqueNumber"])) {
        //메뉴가 존재할 경우
        let uniqueNumber = property["uniqueNumber"];
        
        showMenu(uniqueNumber);

        setMenuProperty(property, data);
    } else if (keepContentNumber[property["name"]] != null) {
        //메뉴가 존재할 경우
        let uniqueNumber = keepContentNumber[property["name"]];

        showMenu(uniqueNumber);

        if (isBack == false && (property["historyNoStack"] == null || property["historyNoStack"] == false)) {
            let historyTitle = property["historyTitle"];
            let historyData = {
                "url": url,
                "property": property,
                "data": data
            };
            let historyUrl = property["historyUrl"];
            history.pushState(historyData, historyTitle, historyUrl);
        }

        setMenuProperty(property, data);
    } else {
        //새로운 메뉴 로드
        let uniqueNumber = property["uniqueNumber"];
        //첫번째 로드 메뉴인지
        let noPushState = false;
        if (isNaN(getCurrentMenuNumber()) == true) { noPushState = true; }
        if (property["uniqueNumber"] == null) { menuUniqueNumber = Math.floor(Math.random() * 999999999999); uniqueNumber = menuUniqueNumber; }

        //첫번째 로드 메뉴인지
        if (isNaN(getCurrentMenuNumber()) == true) {
            menuHTML(uniqueNumber, property["name"], getMenuLoadingStateHtml(null));
            showMenu(uniqueNumber);
            setMenuProperty(property, data);
            historyMemoryMenu[historyMemoryMenu.length] = uniqueNumber;
        }
        //즉시 보기 메뉴인지, 단 뒤로가기, 앞으로가기 시 무효
        if (property["viewInstantly"] == true && isBack == false) {
            //덮어씌인 메뉴 삭제
            let previousMenuNumber = getCurrentMenuNumber();
            if (property["viewInstantly"] == true && property["historyNoStack"] == true && isNaN(previousMenuNumber) == false) {
                deleteMenu(previousMenuNumber, false);
            }

            menuHTML(uniqueNumber, property["name"], getMenuLoadingStateHtml(null));
            showMenu(uniqueNumber);
            setMenuProperty(property, data);
        }

        //고유 번호가 존재하지 않을 경우
        if (property["uniqueNumber"] == null) {
            property["uniqueNumber"] = uniqueNumber;
            let historyTitle = property["historyTitle"];
            let historyData = {
                "url": url,
                "property": property,
                "data": data
            };
            let historyUrl = property["historyUrl"];
            if ((noPushState == true || property["historyNoStack"] == true) && property["historyNoStack"] != false) {
                history.replaceState(historyData, historyTitle, historyUrl);
                historyMemoryMenu[historyMemoryMenu.length] = uniqueNumber;
            } else {
                history.pushState(historyData, historyTitle, historyUrl);
                //
                if (historyMemoryMenu.includes(getCurrentMenuNumber())) {
                    let array = new Array();
                    for (let i = 0; i < historyMemoryMenu.length; i++) {
                        if (historyMemoryMenu[i] == getCurrentMenuNumber()) {
                            array[array.length] = historyMemoryMenu[i];
                            break;
                        } else {
                            array[array.length] = historyMemoryMenu[i];
                        }
                    }
                    historyMemoryMenu = array;
                }
                historyMemoryMenu[historyMemoryMenu.length] = uniqueNumber;
                cleanMenu();
            }
        } else {
            historyMemoryMenu[historyMemoryMenu.length] = uniqueNumber;
        }
        menuRequest(url, property, data);
    }

    //제목 설정
    if (property["historyTitle"] != null) {
        let title = document.getElementsByTagName("title")[0];
        if (property["historyTitle"] != siteName) {
            title.innerText = property["historyTitle"] + " - " + siteName;
        } else {
            title.innerText = property["historyTitle"];
        }
    }
}

function deleteMenu(menuNumber, isAllowBack) {
    (isAllowBack == null) ? isAllowBack = true : null;

    let contents = document.getElementById("contents_" + menuNumber);
    if (contents != null && getMenuNumbers().length > 1) {
        if (isAllowBack == true && getCurrentMenuNumber() == menuNumber) {
            history.back();
        }
        contents.remove();
    }
}

function deleteAllMenu(doNotLoad) {
    let currentMenu = getCurrentMenuName();

    let contents = document.getElementById("contents");
    contents.innerHTML = '';

    keepContentNumber = new Array();
    menuUniqueNumber = Math.floor(Math.random() * 999999999999);
    historyMemoryMenu = new Array();
    menuScrollY = new Array();
    visibleElement = new Array();
    visibleElementIndex = 0;
    visibleIO = newVisibleIO();
    isIntersecting = new Array();
    allowVisibleElement = new Array();
    allowVisibleElementIndex = 0;
    loginStatus = null;
    myWorkList = null;
    myRecentSearches = null;
    myUserList = null;
    partViewedList = new Array();
    partPercentViewedList = new Array();

    if (doNotLoad == null || doNotLoad == false) {
        if (currentMenu == "home") {
            loadMenu_home(true);
        } else {
            loadMenu_home(false);
        }
    }

    loginCheck(); //로그인 정보 불러오기
    myWorkListCheck(); //작품 목록 정보 불러오기
    requestRecentSearches(); //최근 검색어 정보 불러오기
    myUserListCheck(); //사용자 목록 정보 불러오기

    //토큰 키 업데이트
    if (messagingToken != null) {
        updateMessagingToken(messagingToken);
    }

    //
    let sidebar_wrap = document.getElementsByClassName("big_sidebar_wrap");
    for (let i = 0; i < sidebar_wrap.length; i++) {
        if (sidebar_wrap[i].getAttribute("login_required") != null) {
            sidebar_wrap[i].style.display = "none";
        }
        if (sidebar_wrap[i].getAttribute("logout_required") != null) {
            sidebar_wrap[i].style.display = "none";
        }
    }
    sidebar_wrap = document.getElementsByClassName("small_sidebar_wrap");
    for (let i = 0; i < sidebar_wrap.length; i++) {
        if (sidebar_wrap[i].getAttribute("login_required") != null) {
            sidebar_wrap[i].style.display = "none";
        }
        if (sidebar_wrap[i].getAttribute("logout_required") != null) {
            sidebar_wrap[i].style.display = "none";
        }
    }

    //
    let big_sidebar_wrap = document.getElementsByClassName("big_sidebar_wrap");
    for (let i = 0; i < big_sidebar_wrap.length; i++) {
        if (big_sidebar_wrap[i].getAttribute("type") == "my_work_list" || big_sidebar_wrap[i].getAttribute("type") == "my_user_list") {
            let big_sidebar_items = big_sidebar_wrap[i].getElementsByClassName("big_sidebar_items")[0];
            big_sidebar_items.setAttribute("view_more", false);
            big_sidebar_items.children[0].textContent = "";
            big_sidebar_items.children[1].textContent = "";
            big_sidebar_wrap[i].style.display = "none";
        }
    }

    //자동 완성 초기화
    previousInfoAutoComplete = new Array();
    let search_auto_complete = document.getElementsByClassName("header_search_auto_complete");
    for (let i = 0; i < search_auto_complete.length; i++) {
        search_auto_complete[i].classList.add("blur_header_search_auto_complete");
        search_auto_complete[i].classList.add("hide_header_search_auto_complete");

        let items = search_auto_complete[i].getElementsByClassName("search_auto_complete_box_items")[0];
        items.textContent = "";
    }
    search_auto_complete = document.getElementsByClassName("mobile_search_box_auto_complete")[0];
    let items = search_auto_complete.getElementsByClassName("search_auto_complete_box_items")[0];
    items.textContent = "";
}

function cleanMenu() {
    let child = document.getElementById("contents").children;

    let removeMenu = new Array();
    for (let i = 0; i < child.length; i++) {
        let number = Number((child[i].id).replaceAll("contents_", ""));
        if (historyMemoryMenu.includes(number) == false) {
            removeMenu[removeMenu.length] = child[i];
        }
    }

    for (let i = 0; i < removeMenu.length; i++) {
        keepContentNumber[removeMenu[i].getAttribute("name")] = null;
        removeMenu[i].remove();
    }
}

function menuRequest(url, property, data) {
    let previousMenuNumber = getCurrentMenuNumber();
    let number = property["uniqueNumber"];
    let name = property["name"];

    //오프라인일 경우
    if (navigator.onLine == false) {
        menuHTML(number, name, getMenuErrorHTML(0));
        showMenu(number);
        refreshDisplayColor();
        setMenuProperty(property, data);
        complete();
        return;
    }

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, url);

    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                
                menuHTML(number, name, xhrHtml.trim());
                showMenu(number);
        
                try {
                    menuLoadingComplete(url, property, data);
                } catch (error) {
                    //오류 발생
                    menuHTML(number, name, getMenuErrorHTML(null));
                    console.log(error);
                }
                refreshDisplayColor();
        
                setMenuProperty(property, data);
                checkMenuTitle(number);
        
                //덮어씌인 메뉴 삭제
                if (property["viewInstantly"] != true && property["historyNoStack"] == true && isNaN(previousMenuNumber) == false) {
                    deleteMenu(previousMenuNumber);
                }
            } else {
                //오류 발생
                menuHTML(number, name, getMenuErrorHTML(status));
                showMenu(number);
                refreshDisplayColor();
                setMenuProperty(property, data);
            }
            complete();
        }
    });
    xhr.setRequestHeader('Cache-Control', 'max-age=3600');
    
    var formData = new FormData();
    formData.append("menuNumber", number);
    formData.append("menuName", name);
    formData.append("lang", userLanguage);
    formData.append("data", JSON.stringify(data));

    xhr.send(formData);

    //완료
    function complete() {
        loadingComplete();

        //초기 사이트 로딩 숨김
        let site_loading = document.getElementsByClassName("site_loading")[0];
        //빠른 시작
        site_loading.classList.add("md-ripples");
        site_loading.style.cursor = "pointer";
        site_loading.setAttribute("onclick", "this.style.opacity = 0; setTimeout(() => { this.style.display = 'none'; }, 200);");
        //일정 시간 뒤
        let duration = Number.parseFloat(site_loading.getAttribute("duration"));
        let startTime = Number.parseInt(site_loading.getAttribute("start_time"));
        let endTime = new Date().getTime();
        let difference = (duration * 1000) - (endTime - startTime);
        setTimeout(() => {
            site_loading.style.opacity = 0;
            setTimeout(() => {
                site_loading.style.display = "none";
            }, 200);
        }, difference);

        //스크롤 초기화
        window.scrollTo(
            { top: 0 }
        );
    
        //당겨서 새로고침 숨기기
        setTimeout(() => {
            hidePullToRefresh(1);
        }, 100);
    
        settingLoginInfo();
    }
}



function getMenuErrorHTML(errorCode) {
    let title = getLanguage("menu_error_title:etc");
    let description = getLanguage("menu_error_description:etc");

    let svg = '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19.511 17.98l-8.907-16.632c-0.124-0.215-0.354-0.348-0.604-0.348s-0.481 0.133-0.604 0.348l-8.906 16.632c-0.121 0.211-0.119 0.471 0.005 0.68 0.125 0.211 0.352 0.34 0.598 0.34h17.814c0.245 0 0.474-0.129 0.598-0.34 0.124-0.209 0.126-0.469 0.006-0.68zM11 17h-2v-2h2v2zM11 13.5h-2v-6.5h2v6.5z"></path></svg>';
    if (errorCode == 404) {
        svg = '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 20.016q3.281 0 5.648-2.367t2.367-5.648q0-2.672-1.734-4.922l-11.203 11.203q2.25 1.734 4.922 1.734zM3.984 12q0 2.672 1.734 4.922l11.203-11.203q-2.25-1.734-4.922-1.734-3.281 0-5.648 2.367t-2.367 5.648zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z"></path></svg>';
    } else if (errorCode == 504) {
        svg = '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.016 21.984l19.969-19.969v6h-3.984v13.969h-15.984zM20.016 21.984v-1.969h1.969v1.969h-1.969zM20.016 18v-8.016h1.969v8.016h-1.969z"></path></svg>';
    } else if (errorCode == 503) {
        svg = '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.016 21.984l19.969-19.969v6h-3.984v13.969h-15.984zM20.016 21.984v-1.969h1.969v1.969h-1.969zM20.016 18v-8.016h1.969v8.016h-1.969z"></path></svg>';
    } else if (errorCode == 500) {
        svg = '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 28"><path d="M25.5 15c0 0.547-0.453 1-1 1h-3.5c0 1.953-0.422 3.422-1.047 4.531l3.25 3.266c0.391 0.391 0.391 1.016 0 1.406-0.187 0.203-0.453 0.297-0.703 0.297s-0.516-0.094-0.703-0.297l-3.094-3.078s-2.047 1.875-4.703 1.875v-14h-2v14c-2.828 0-4.891-2.063-4.891-2.063l-2.859 3.234c-0.203 0.219-0.469 0.328-0.75 0.328-0.234 0-0.469-0.078-0.672-0.25-0.406-0.375-0.438-1-0.078-1.422l3.156-3.547c-0.547-1.078-0.906-2.469-0.906-4.281h-3.5c-0.547 0-1-0.453-1-1s0.453-1 1-1h3.5v-4.594l-2.703-2.703c-0.391-0.391-0.391-1.016 0-1.406s1.016-0.391 1.406 0l2.703 2.703h13.188l2.703-2.703c0.391-0.391 1.016-0.391 1.406 0s0.391 1.016 0 1.406l-2.703 2.703v4.594h3.5c0.547 0 1 0.453 1 1zM18 6h-10c0-2.766 2.234-5 5-5s5 2.234 5 5z"></path></svg>';
    } else if (errorCode == 0) {
        svg = '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3.281 1.453q0.563 0.563 7.195 7.172t10.008 10.078l-1.266 1.266-3.328-3.328-3.891 4.828-11.625-14.484q1.547-1.266 3.656-2.203l-2.016-2.063zM23.625 6.984l-5.438 6.797-10.359-10.313q2.109-0.469 4.172-0.469 5.953 0 11.625 3.984z"></path></svg>';
    } else if (errorCode == -1) {
        svg = '<div class="showbox"><div class="loader" style="width: 50px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" style = "stroke: var(--site-color-light) !important;" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle></svg></div></div>';
    } else if (errorCode == -2) {
        svg = '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.016 21.984l19.969-19.969v6h-3.984v13.969h-15.984zM20.016 21.984v-1.969h1.969v1.969h-1.969zM20.016 18v-8.016h1.969v8.016h-1.969z"></path></svg>';
    }

    if (errorCode == 404) {
        title = getLanguage("menu_error_title:404");
        description = getLanguage("menu_error_description:404");
    } else if (errorCode == 504) {
        title = getLanguage("menu_error_title:504");
        description = getLanguage("menu_error_description:504");
    } else if (errorCode == 503) {
        title = getLanguage("menu_error_title:503");
        description = getLanguage("menu_error_description:503");
    } else if (errorCode == 500) {
        title = getLanguage("menu_error_title:500");
        description = getLanguage("menu_error_description:500");
    } else if (errorCode == 0) {
        title = getLanguage("menu_error_title:0");
        description = getLanguage("menu_error_description:0");
    } else if (errorCode == -1) {
        title = getLanguage("menu_error_title:-1");
        description = getLanguage("menu_error_description:-1");
    } else if (errorCode == -2) {
        title = getLanguage("menu_error_title:-2");
        description = getLanguage("menu_error_description:-2");
    }

    let iconClass = "menu_error_page_box_icon";
    if (errorCode == -1) {
        iconClass = "menu_error_page_box_loading";
    }

    return `
        <div class = "menu_error_page" code = "` + errorCode + `">
            <div class = "menu_error_page_box">
                <div class = "` + iconClass + `">
                    ` + svg + `
                </div>
                <div class = "menu_error_page_box_title">
                    ` + title + `
                </div>
                <div class = "menu_error_page_box_description">
                    ` + description + `
                </div>
                <div class = "menu_error_page_box_button md-ripples" onclick = "refreshCurrentMenu();">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"> <defs> <clipPath id="clip-reload"> <rect width="50" height="50"></rect> </clipPath> </defs> <g id="reload" clip-path="url(#clip-reload)"> <path id="빼기_30" data-name="빼기 30" d="M-2615,50a24.844,24.844,0,0,1-9.731-1.965,24.917,24.917,0,0,1-7.947-5.358,24.922,24.922,0,0,1-5.358-7.947A24.844,24.844,0,0,1-2640,25a24.844,24.844,0,0,1,1.965-9.731,24.922,24.922,0,0,1,5.358-7.947,24.917,24.917,0,0,1,7.947-5.358A24.844,24.844,0,0,1-2615,0a24.835,24.835,0,0,1,14.413,4.571,24.948,24.948,0,0,1,9.019,11.7l-.1,1.04h-2.71A22.1,22.1,0,0,0-2615,3a22.025,22.025,0,0,0-22,22,22.025,22.025,0,0,0,22,22,22.03,22.03,0,0,0,21.244-16.264h3.094a24.808,24.808,0,0,1-3.232,7.669,25.065,25.065,0,0,1-5.471,6.1,24.9,24.9,0,0,1-7.2,4.034A24.932,24.932,0,0,1-2615,50Z" transform="translate(2640)"></path> <g id="그룹_29" data-name="그룹 29" transform="translate(0 1)"> <rect id="사각형_65" data-name="사각형 65" width="3" height="14" rx="1.5" transform="translate(47 5)"></rect> <rect id="사각형_66" data-name="사각형 66" width="3" height="14" rx="1.5" transform="translate(35.892 19) rotate(-90)"></rect> </g> </g> </svg>
                    ` + getLanguage("menu_error_button") + `
                </div>
            </div>
        </div>
    `;
}



function menuHTML(number, name, html) {
    let contents = document.getElementById("contents");
    if (isMenuExists(number) == false) {
        let div = document.createElement("div");
        div.setAttribute("id", "contents_" + number);
        div.setAttribute("name", name);
        div.innerHTML = html;
        contents.appendChild(div);
    } else {
        let menu = getMenuElement(number);
        menu.innerHTML = html;
    }
}
function isMenuExists(number) {
    let menu = getMenuElement(number);
    if (menu == null) {
        return false;
    } else {
        return true;
    }
}
function getMenuElement(number) {
    let menu = document.getElementById("contents_" + number);
    if (menu == null) {
        return null;
    }
    return menu;
}

var menuScrollY = new Array();

function showMenu(number) {
    let previousMenuNumber = getCurrentMenuNumber();

    if (previousMenuNumber != number) {
        //스크롤 복원
        let scrollTop = window.scrollY;
        menuScrollY[previousMenuNumber] = scrollTop;

        if (isMenuExists(number) == true) {
            allHideMenu();

            let menu = getMenuElement(number);
            menu.style.display = "block";
            menu.style.animation = "showMenu 0.2s forwards";
        }
        restoreVisibleElement(number);
        checkVisibleElement(true); //메뉴 이동

        //브라우저 제목
        checkMenuTitle(number);

        //variable element
        notRunningCheckVariableElement = true;
        function callback() {
            function callback2() {
                notRunningCheckVariableElement = false;
            }
            window.requestAnimationFrame(callback2);
        }
        window.requestAnimationFrame(callback);

        let scrollY = menuScrollY[number];
        if (scrollY != null) {
            function callback35622127() {
                window.scrollTo(0, scrollY);
                setHeaderTop();
            }
            window.requestAnimationFrame(callback35622127);
        }

        //
        let horizontal_scroll = document.getElementsByClassName("horizontal_scroll_box");
        for (let i = 0; i < horizontal_scroll.length; i++) {
            horizontal_scroll[i].remove();
            i--;
        }

        document.activeElement.blur();
        hideActionMessage(); //액션 메세지 숨기기

        //모든 동영상 일시정지
        let previousContents = document.getElementById("contents_" + previousMenuNumber);
        let videoPlayer = previousContents.getElementsByClassName("video_player");
        for (let i = 0; i < videoPlayer.length; i++) {
            let video = videoPlayer[i].getElementsByTagName("video")[0];
            if (video.paused == false) {
                video.pause();
            }
        }
    } else {
        if (isMenuExists(number) == true) {
            allHideMenu();

            let menu = getMenuElement(number);
            menu.style.display = "block";
            menu.style.animation = "showMenu 0.2s forwards";
        }
    }

    //
    hidePopupElement();
    hideAddCommentsVirtualKeyboard();
    closeSelectList();
    closeMoreButton();
    imageFormatEditorPopupClose();
    closeLoadingImageFormat();
    delayCheckMenuWork();
    checkMyWorkListMenuWorkBottomButton(number);
    checkMyUserListMenuUserSaveButton(number);
    delayCheckTransformImageFormatViewer(); //이미지 포맷 Min Width 체크
    delayCheckMenuHomeBanner(); //메뉴 홈 배너 체크
    delayCheckExploreTrendingBanner(); //메뉴 탐색 인기 작품 배너 체크
    delayCheckMenuWorkListBackground(); //메뉴 작품 목록
    delayCheckMenuHomeLogEvent(); //홈 작품 노출 체크
    delayCheckMenuSearchLogEvent(); //검색 작품 노출 체크
    cancelNovelViewerTTS(); //소설 에디터 TTS 재생 취소
    closeHoverHelp();
}
function checkMenuTitle(number) {
    //브라우저 제목
    let menu = getMenuElement(number);
    let menu_title = menu.getElementsByClassName("menu_title");
    if (menu_title.length != 0) {
        let title = menu_title[0].innerText.trim();
        let titleTag = document.getElementsByTagName("title")[0];
        titleTag.innerText = title + " - " + siteName;
    }
}
function allHideMenu() {
    let child = document.getElementById("contents").children;
    let child_length = child.length;

    for (let i = 0; i < child_length; i++) {
        child[i].style.display = "none";
        child[i].style.animation = "unset";
    }
}
function getCurrentMenuNumber() {
    let contents = document.getElementById("contents");
    if (contents != null) {
        let child = contents.children;
        let child_length = child.length;
    
        for (let i = 0; i < child_length; i++) {
            if (child[i].style.display != "none") {
                let number = Number(child[i].getAttribute("id").replace("contents_", ""));
                return number;
            }
        }
    }

    return NaN;
}
function getCurrentMenuName() {
    let contents = document.getElementById("contents");

    if (contents != null) {
        let child = document.getElementById("contents").children;
        let child_length = child.length;
    
        for (let i = 0; i < child_length; i++) {
            if (child[i].style.display != "none") {
                let name = child[i].getAttribute("name");
                return name;
            }
        }
    }

    return null;
}
function getMenuNumbers() {
    let contents = document.getElementById("contents");
    let numbers = new Array();

    if (contents != null) {
        let child = contents.children;
        let child_length = child.length;
        for (let i = 0; i < child_length; i++) {
            numbers[numbers.length] = Number.parseInt(child[i].id.replace("contents_", ""));
        }
    }

    return numbers;
}
function getMenuProperty() {
    if (history.state != null) {
        let data = history.state;
        return data["property"];
    }
    return null;
}

let currentMenuProperty = null;
function setMenuProperty(property, data) {
    (property["nothing"] == null) ? property["nothing"] = false : null;
    (property["keepContent"] == null) ? property["keepContent"] = false : null;

    if (property["keepContent"] == true && keepContentNumber[property["name"]] == null) {
        keepContentNumber[property["name"]] = property["uniqueNumber"];
    }

    //아무것도 없는 메뉴
    let main = document.getElementsByTagName("main")[0];
    let header = document.getElementsByTagName("header")[0];
    let footer = document.getElementsByTagName("footer")[0];
    if (property["nothing"] == true) {
        main.classList.add("main_nothing");
        header.style.display = "none";
        footer.classList.add("footer_nothing");
    } else {
        main.classList.remove("main_nothing");
        header.style.display = "flex";
        footer.classList.remove("footer_nothing");
    }

    //사이드바 숨기기
    if (property["hideSidebar"] == true) {
        main.classList.add("hide_sidebar");
    } else {
        main.classList.remove("hide_sidebar");
    }

    //검색어
    let header_search = document.getElementsByClassName("header_search");
    if (property["historySearch"] != null) {
        //검색어 있음
        let search = property["historySearch"];

        for (let i = 0; i < header_search.length; i++) {
            let input = header_search[i].getElementsByTagName("input")[0];
            input.value = search;
            checkSearchInput(header_search[i]);
            changeValueSearchInput(input);
        }
    } else {
        //검색어 없음
        for (let i = 0; i < header_search.length; i++) {
            let input = header_search[i].getElementsByTagName("input")[0];
            input.value = "";
            checkSearchInput(header_search[i]);
            changeValueSearchInput(input);
        }
    }
    searchInputBlurDesktop();

    //Header
    let header_default = document.getElementById("wrap_header_default");
    let header_workspace = document.getElementById("wrap_header_workspace");
    if (property["name"].indexOf("workspace") != -1) {
        header_default.style.display = "none";
        header_workspace.style.display = "block";
    } else {
        header_default.style.display = "block";
        header_workspace.style.display = "none";
    }
    //Footer
    let footer_default = document.getElementById("wrap_footer_default");
    let footer_workspace = document.getElementById("wrap_footer_workspace");
    let footer_admin = document.getElementById("wrap_footer_admin");
    let footer_my_account = document.getElementById("wrap_footer_my_account");
    if (property["name"].indexOf("workspace") != -1) {
        footer_default.style.display = "none";
        footer_workspace.style.display = "flex";
        footer_admin.style.display = "none";
        footer_my_account.style.display = "none";
    } else if (property["name"].indexOf("admin") != -1) {
        footer_default.style.display = "none";
        footer_workspace.style.display = "none";
        footer_admin.style.display = "flex";
        footer_my_account.style.display = "none";
    } else if (property["name"].indexOf("my_account") != -1) {
        footer_default.style.display = "none";
        footer_workspace.style.display = "none";
        footer_admin.style.display = "none";
        footer_my_account.style.display = "flex";
    } else {
        footer_default.style.display = "flex";
        footer_workspace.style.display = "none";
        footer_admin.style.display = "none";
        footer_my_account.style.display = "none";
    }
    //Sidebar
    let sidebar_default = document.getElementById("wrap_sidebar_default");
    let sidebar_workspace = document.getElementById("wrap_sidebar_workspace");
    let sidebar_admin = document.getElementById("wrap_sidebar_admin");
    let sidebar_my_account = document.getElementById("wrap_sidebar_my_account");
    if (property["name"].indexOf("workspace") != -1) {
        sidebar_default.style.display = "none";
        sidebar_workspace.style.display = "block";
        sidebar_admin.style.display = "none";
        sidebar_my_account.style.display = "none";
    } else if (property["name"].indexOf("admin") != -1) {
        sidebar_default.style.display = "none";
        sidebar_workspace.style.display = "none";
        sidebar_admin.style.display = "block";
        sidebar_my_account.style.display = "none";
    } else if (property["name"].indexOf("my_account") != -1) {
        sidebar_default.style.display = "none";
        sidebar_workspace.style.display = "none";
        sidebar_admin.style.display = "none";
        sidebar_my_account.style.display = "block";
    } else {
        sidebar_default.style.display = "block";
        sidebar_workspace.style.display = "none";
        sidebar_admin.style.display = "none";
        sidebar_my_account.style.display = "none";
    }

    //
    let sidebar_workspace_default = document.getElementById("wrap_sidebar_workspace_default");
    let sidebar_workspace_custom = document.getElementById("wrap_sidebar_workspace_custom");
    let footer_workspace_default = document.getElementById("wrap_footer_workspace_default");
    let footer_workspace_custom = document.getElementById("wrap_footer_workspace_custom");
    if (property["name"].indexOf("workspace_work") != -1) {
        if (sidebar_workspace_custom.getAttribute("type") != "workspace_work") {
            setHtmlSidebarWorkspaceWorkCustom(data);
        }
        if (footer_workspace_custom.getAttribute("type") != "workspace_work") {
            setHtmlFooterWorkspaceWorkCustom(data);
        }
        sidebar_workspace_default.style.display = "none";
        footer_workspace_default.style.display = "none";
        sidebar_workspace_custom.style.display = "block";
        footer_workspace_custom.style.display = "flex";
    } else if (property["name"].indexOf("workspace_part_") != -1) {
        if (sidebar_workspace_custom.getAttribute("type") != "workspace_part") {
            setHtmlSidebarWorkspacePartCustom(data);
        }
        if (footer_workspace_custom.getAttribute("type") != "workspace_part") {
            setHtmlFooterWorkspacePartCustom(data);
        }
        sidebar_workspace_default.style.display = "none";
        footer_workspace_default.style.display = "none";
        sidebar_workspace_custom.style.display = "block";
        footer_workspace_custom.style.display = "flex";
    } else {
        sidebar_workspace_default.style.display = "block";
        footer_workspace_default.style.display = "flex";
        sidebar_workspace_custom.style.display = "none";
        footer_workspace_custom.style.display = "none";

        sidebar_workspace_custom.setAttribute("type", null);
        footer_workspace_custom.setAttribute("type", null);
    }

    //검색 메뉴 헤더
    if (property["name"] == "search") {
        setHeaderType("search");
    } else {
        setHeaderType("default");
    }

    //
    refreshDisplayColor();
    setMenuButton(property, data);

    currentMenuProperty = property;
}


function getMenuLoadingStateHtml(type) {
    let html = "";
    html += '<div class = "menu_loading">';
    html += '<div class="showbox"><div class="loader" style="width: 40px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle></svg></div></div>';
    html += "</div>";
    return html;
}


function menuLoadingComplete(url, property, data) {
    let menuName = property["name"];
    let number = property["uniqueNumber"];

    if (menuName == "cloud") {
        menuCloudLoad(number);
        cloudContentsLoad(number);
    } else if (menuName == "novel_editor") {
        novelEditorLoad(number);
    } else if (menuName == "novel_viewer") {
        novelViewerLoad(number);
    } else if (menuName == "image_format_editor") {
        imageFormatEditorLoad(number);
    } else if (menuName == "image_format_viewer") {
        imageFormatViewerLoad(number);
    } else if (menuName == "workspace_my_works") {
        workspaceMyWorksLoad(number);
    } else if (menuName == "workspace_work_details") {
        workspaceWorkLoad(number);
    } else if (menuName == "workspace_work_part_list") {
        workspaceWorkPartListLoad(number);
    } else if (menuName == "workspace_work_comments") {
        workspaceWorkCommentsLoad(number);
    } else if (menuName == "workspace_work_community") {
        workspaceWorkCommunityLoad(number);
    } else if (menuName == "workspace_work_localization") {
        workspaceWorkLocalizationLoad(number);
    } else if (menuName == "home") {
        homeLoad(number);
    } else if (menuName == "work") {
        workLoad(number);
    } else if (menuName == "community") {
        registerCommunityLoad(number);
    } else if (menuName == "my_work_list") {
        myWorkListLoad(number);
    } else if (menuName == "work_list") {
        registerWorkListLoad(number);
    } else if (menuName == "history") {
        historyLoad(number);
    } else if (menuName == "search") {
        searchLoad(number);
    } else if (menuName == "library") {
        libraryLoad(number);
    } else if (menuName == "user") {
        menuUserLoad(number);
    } else if (menuName == "my_user_list") {
        myUserListLoad(number);
    } else if (menuName == "workspace_part_details") {
        workspacePartDetailsLoad(number);
    } else if (menuName == "workspace_part_comments") {
        workspacePartCommentsLoad(number);
    } else if (menuName == "workspace_part_localization") {
        workspacePartLocalizationLoad(number);
    } else if (menuName == "notifications_settings") {
        menuNotificationsSettingsLoad(number);
    } else if (menuName == "comment") {
        menuCommentLoad(number);
    } else if (menuName == "rating") {
        menuRatingLoad(number);
    } else if (menuName == "workspace_dashboard") {
        workspaceDashboardLoad(number);
        initGraphElement(); //그래프 그리기
    } else if (menuName == "workspace_work_analysis") {
        workspaceWorkAnalysisLoad(number);
        initGraphElement(); //그래프 그리기
    } else if (menuName == "explore_trending") {
        exploreTrendingLoad(number);
    } else if (menuName == "community_guide") {
        menuCommunityGuideLoad(number);
    } else if (menuName == "creator_guide") {
        menuCreatorGuideLoad(number);
    } else if (menuName == "preview_premium_profile") {
        menuPreviewPremiumProfileLoad(number);
    } else if (menuName == "workspace_my_page_settings") {
        workspaceMyPageSettingsLoad(number);
    } else if (menuName == "privacy_policy") {
        menuPrivacyPolicyLoad(number);
    } else if (menuName == "reviewed_questions") {
        menuReviewedQuestionsLoad(number);
    } else if (menuName == "workspace_monetization") {
        workspaceMonetizationLoad(number);
        initGraphElement(); //그래프 그리기
    } else if (menuName == "workspace_partner") {
        workspacePartnerLoad(number);
    } else if (menuName == "workspace_part_user_translation") {
        menuWorkspacePartUserTranslationLoad(number);
    } else if (menuName == "withdrawal") {
        menuWithdrawalLoad(number);
    } else if (menuName == "payment_history") {
        menuPaymentHistoryLoad(number);
    } else if (menuName == "explore") {
        menuExploreLoad(number);
    } else if (menuName == "video") {
        menuVideoLoad(number);
    } else if (menuName == "embed") {
        menuEmbedLoad(number);
    } else if (menuName == "write_questions") {
        menuWriteQuestionsLoad(number);
    }

    //내 계정
    if (menuName == "my_account_details") {
        myAccountDetailsLoad(number);
    } else if (menuName == "my_account_management") {
        myAccountManagementLoad(number);
    } else if (menuName == "my_account_personal_info") {
        myAccountPersonalInfoLoad(number);
    } else if (menuName == "my_account_session_list") {
        myAccountSessionListLoad(number);
    } else if (menuName == "my_account_two_factor_auth") {
        myAccountTwoFactorAuthLoad(number);
    } else if (menuName == "my_account_privacy") {
        myAccountPrivacyLoad(number);
    } else if (menuName == "my_account_security") {
        myAccountSecurityLoad(number);
    }

    //관리자
    if (menuName == "admin_dashboard") {
        menuAdminDashboardLoad(number);
        initGraphElement(); //그래프 그리기
    } else if (menuName == "admin_questions") {
        registerMenuAdminQuestionsLoad(number);
    } else if (menuName == "admin_user_report") {
        menuAdminUserReportLoad(number);
    } else if (menuName == "admin_work_report") {
        menuAdminWorkReportLoad(number);
    } else if (menuName == "admin_monetization_approval") {
        menuAdminMonetizationApprovalLoad(number);
    } else if (menuName == "admin_partner_approval") {
        menuAdminPartnerApprovalLoad(number);
    }

    //음성 인식 - 검색
    if (isPopupSpeechToTextSearchLoading == true && menuName == "search") {
        hideMobileSearch();
        hidePopupContents();

        isPopupSpeechToTextSearchLoading = false;
    }
}































































































































































var loginStatus = null;
var loginStatusIsLoading = false;

function loginCheckLoading() {
    if (loginStatusIsLoading == false) {
        let header_right = document.getElementsByName("header_profile");

        for (let i = 0; i < header_right.length; i++) {
            header_right[i].innerHTML = `
                <!-- 로딩 스피너 -->
                <div class="showbox" style = "margin-right: 15px;">
                    <div class="loader" style = "width: 30px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/></svg></div>
                </div>
            `;
        }

        //
        let sidebar_wrap = document.getElementsByClassName("big_sidebar_wrap");
        for (let i = 0; i < sidebar_wrap.length; i++) {
            if (sidebar_wrap[i].getAttribute("login_required") != null) {
                sidebar_wrap[i].style.display = "none";
            }
            if (sidebar_wrap[i].getAttribute("logout_required") != null) {
                sidebar_wrap[i].style.display = "none";
            }
        }
        sidebar_wrap = document.getElementsByClassName("small_sidebar_wrap");
        for (let i = 0; i < sidebar_wrap.length; i++) {
            if (sidebar_wrap[i].getAttribute("login_required") != null) {
                sidebar_wrap[i].style.display = "none";
            }
            if (sidebar_wrap[i].getAttribute("logout_required") != null) {
                sidebar_wrap[i].style.display = "none";
            }
        }

        loginStatusIsLoading = true;
    }
}

function loginCheck() {
    loginCheckLoading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    const url = "/php/login/loginStatus.php";

    xhr.open(method, url);

    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                xhrHtml = xhrHtml.replace(/^\s+|\s+$/gm,'');

                loginStatus = JSON.parse(xhrHtml);
                settingLoginInfo();
            } else {
                if (status == 504) {
                    //시간 초과
                    serverResponseErrorMessage(0);
                } else {
                    //오류 발생
                    serverResponseErrorMessage(1);
                }
            }
            loginStatusIsLoading = false;
        }
    });

    let formData = new FormData();

    xhr.send(formData);
}
function settingLoginInfo() {
    if (loginStatus != null) {
        let header_right = document.getElementsByName("header_profile");
        for (let i = 0; i < header_right.length; i++) {
            header_right[i].innerHTML = '';

            let newNotificationsStyle = "";
            if (loginStatus["not_confirm_notifications"] == 0) {
                newNotificationsStyle = "display: none;";
            }
        
            if (loginStatus["isLogin"] == false) {
                header_right[i].innerHTML += `
                    <div class = "header_right_button md-ripples" onclick = "popupMyProfile(this);" onmouseenter = "hoverInformation(this, getLanguage('header_hover:settings'));">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 12c0-0.552-0.225-1.053-0.586-1.414s-0.862-0.586-1.414-0.586-1.053 0.225-1.414 0.586-0.586 0.862-0.586 1.414 0.225 1.053 0.586 1.414 0.862 0.586 1.414 0.586 1.053-0.225 1.414-0.586 0.586-0.862 0.586-1.414zM14 5c0-0.552-0.225-1.053-0.586-1.414s-0.862-0.586-1.414-0.586-1.053 0.225-1.414 0.586-0.586 0.862-0.586 1.414 0.225 1.053 0.586 1.414 0.862 0.586 1.414 0.586 1.053-0.225 1.414-0.586 0.586-0.862 0.586-1.414zM14 19c0-0.552-0.225-1.053-0.586-1.414s-0.862-0.586-1.414-0.586-1.053 0.225-1.414 0.586-0.586 0.862-0.586 1.414 0.225 1.053 0.586 1.414 0.862 0.586 1.414 0.586 1.053-0.225 1.414-0.586 0.586-0.862 0.586-1.414z"></path></svg>
                    </div>
                `;
                header_right[i].innerHTML += `
                    <div class = "header_right_login_button md-ripples" onclick = "loadMenu_login();">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 21v-2c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464h-8c-1.38 0-2.632 0.561-3.536 1.464s-1.464 2.156-1.464 3.536v2c0 0.552 0.448 1 1 1s1-0.448 1-1v-2c0-0.829 0.335-1.577 0.879-2.121s1.292-0.879 2.121-0.879h8c0.829 0 1.577 0.335 2.121 0.879s0.879 1.292 0.879 2.121v2c0 0.552 0.448 1 1 1s1-0.448 1-1zM17 7c0-1.38-0.561-2.632-1.464-3.536s-2.156-1.464-3.536-1.464-2.632 0.561-3.536 1.464-1.464 2.156-1.464 3.536 0.561 2.632 1.464 3.536 2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464 1.464-2.156 1.464-3.536zM15 7c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121 0.335-1.577 0.879-2.121 1.292-0.879 2.121-0.879 1.577 0.335 2.121 0.879 0.879 1.292 0.879 2.121z"></path></svg>
                        ` + getLanguage("header_login_button") + `
                    </div>
                `;
            } else {
                header_right[i].innerHTML += `
                    <div class = "header_right_button md-ripples" type = "create" onclick = "headerRightButtonCreateMoreButton(this);" onmouseenter = "hoverInformation(this, getLanguage('header_hover:create'));">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-19.952 -19.55)"><path d="M517.743,19.132H494.084a1.5,1.5,0,0,1,0-3h23.658a1.5,1.5,0,0,1,0,3Z" transform="translate(-460.962 26.918)"/><path d="M23.658,1.5H0A1.5,1.5,0,0,1-1.5,0,1.5,1.5,0,0,1,0-1.5H23.658a1.5,1.5,0,0,1,1.5,1.5A1.5,1.5,0,0,1,23.658,1.5Z" transform="translate(44.951 32.721) rotate(90)"/></g><path d="M25,3a22.007,22.007,0,0,0-8.562,42.272A22.006,22.006,0,0,0,33.562,4.728,21.859,21.859,0,0,0,25,3m0-3A25,25,0,1,1,0,25,25,25,0,0,1,25,0Z"/></g></svg>
                    </div>
                `;
                header_right[i].innerHTML += `
                    <div class = "header_right_button md-ripples" type = "notifications" onclick = "popupNotifications(this);" onmouseenter = "hoverInformation(this, getLanguage('header_hover:notifications'));">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M42.282,39.4h0l-.226,0H1.251C.557,39.4.2,39.3.065,39.075c-.221-.363.152-1.085.769-2.282,1.4-2.715,4.315-8.364,4.6-18.745a21.434,21.434,0,0,1,1.682-8.6,15.31,15.31,0,0,1,4.146-5.562A17.322,17.322,0,0,1,22.285,0a16.042,16.042,0,0,1,10.5,4.409,18.085,18.085,0,0,1,5.659,13.638c.141,10.246,2.863,15.713,4.326,18.65.617,1.238.989,1.986.755,2.364C43.375,39.3,43,39.4,42.282,39.4ZM22.187,3.026c-6.61,0-13.7,4.015-13.76,15.285a46.872,46.872,0,0,1-2.09,13.2,29.949,29.949,0,0,1-1.958,4.9L39.3,36.4s0,0-.006-.009a27.524,27.524,0,0,1-1.879-4.733,47.874,47.874,0,0,1-2-13.351C35.34,7.268,27.28,3.075,22.217,3.026Z" transform="translate(3.124 0.378)"/><path d="M6.4,0a6.4,6.4,0,0,1,6.4,6.4H0A6.4,6.4,0,0,1,6.4,0Z" transform="translate(30.704 50) rotate(180)"/></g></svg>
                        <div class = "header_right_button_new_notifications" style = "` + newNotificationsStyle + `">
                            <div class = "header_right_button_new_notifications_wrap">
                                <div class = "header_right_button_new_notifications_in"></div>
                            </div>
                        </div>
                    </div>
                `;
                header_right[i].innerHTML += `
                    <div class = "header_right_button_profile md-ripples" onclick = "popupMyProfile(this);" onmouseenter = "hoverInformation(this, getLanguage('header_hover:profile'));">
                        <div class = "header_right_button_profile_img img_wrap"></div>
                    </div>
                `;
            }
        }
    
        if (loginStatus["isLogin"] == true) {
            //my profile
            let profile = new Array();
            let header_profile_img = document.getElementsByClassName("header_right_button_profile_img");
            let my_profile = document.getElementsByClassName("my_profile");
            for (let i = 0; i < header_profile_img.length; i++) {
                profile[profile.length] = header_profile_img[i];
            }
            for (let i = 0; i < my_profile.length; i++) {
                profile[profile.length] = my_profile[i];
            }
            for (let i = 0; i < profile.length; i++) {
                profile[i].innerHTML = `
                    <div class = "profile_element">
                        <div class = "profile_info">` + JSON.stringify(loginStatus["profile"]) + `</div>
                        <div class = "profile_image"></div>
                    </div>
                `;
            }
            //my_nickname
            let my_nickname = document.getElementsByName("my_nickname");
            for (let i = 0; i < my_nickname.length; i++) {
                my_nickname[i].innerText = loginStatus["nickname"];
            }
            //my_work_count
            let my_work_count = document.getElementsByName("my_work_count");
            for (let i = 0; i < my_work_count.length; i++) {
                let text = getLanguage("workspace_big_sidebar_work_count");
                my_work_count[i].innerText = commas(text.replaceAll("{R:0}", loginStatus["workspace"]["countWorks"]));
            }
        }

        //
        let sidebar_wrap = document.getElementsByClassName("big_sidebar_wrap");
        for (let i = 0; i < sidebar_wrap.length; i++) {
            if (sidebar_wrap[i].getAttribute("login_required") == "true") {
                if (loginStatus["isLogin"] == true) {
                    sidebar_wrap[i].style.display = null;
                } else {
                    sidebar_wrap[i].style.display = "none";
                }
            }
            if (sidebar_wrap[i].getAttribute("logout_required") == "true") {
                if (loginStatus["isLogin"] == false) {
                    sidebar_wrap[i].style.display = null;
                } else {
                    sidebar_wrap[i].style.display = "none";
                }
            }
        }
        sidebar_wrap = document.getElementsByClassName("small_sidebar_wrap");
        for (let i = 0; i < sidebar_wrap.length; i++) {
            if (sidebar_wrap[i].getAttribute("login_required") == "true") {
                if (loginStatus["isLogin"] == true) {
                    sidebar_wrap[i].style.display = null;
                } else {
                    sidebar_wrap[i].style.display = "none";
                }
            }
            if (sidebar_wrap[i].getAttribute("logout_required") == "true") {
                if (loginStatus["isLogin"] == false) {
                    sidebar_wrap[i].style.display = null;
                } else {
                    sidebar_wrap[i].style.display = "none";
                }
            }
        }
    }
}

function headerRightButtonCreateMoreButton(el) {
    let slot = new Array();
    slot[slot.length] = {
        'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M139.895-296a1.5,1.5,0,0,1,.843.259l18.395,12.5a1.5,1.5,0,0,1,.657,1.208,1.5,1.5,0,0,1-.6,1.235l-18.395,13.723a1.5,1.5,0,0,1-1.794,0L120.6-280.8a1.5,1.5,0,0,1-.6-1.235,1.5,1.5,0,0,1,.657-1.208l18.395-12.5A1.5,1.5,0,0,1,139.895-296Zm15.81,14.056-15.81-10.743-15.81,10.743,15.81,11.795Z" transform="translate(-120 296)"/><path d="M139.895-249.788a1.5,1.5,0,0,1-.894-.3l-18.395-13.646a1.5,1.5,0,0,1-.311-2.1,1.5,1.5,0,0,1,2.1-.311l17.5,12.983,17.5-12.983a1.5,1.5,0,0,1,2.1.311,1.5,1.5,0,0,1-.311,2.1l-18.395,13.646A1.5,1.5,0,0,1,139.895-249.788Z" transform="translate(-120 289.577)"/><g transform="translate(0.5 0.902)"><path d="M498.013,19.126q-.87,0-1.559,0c-2.618-.011-2.7-.039-2.977-.133a1.5,1.5,0,0,1,.729-2.9c.989.069,9.521.025,14.743-.02a1.5,1.5,0,0,1,.026,3c-.037,0-3.7.031-7.369.047C500.233,19.123,499.031,19.126,498.013,19.126Z" transform="translate(-460.962 22.528)"/><path d="M498.013,19.126q-.87,0-1.559,0c-2.618-.011-2.7-.039-2.977-.133a1.5,1.5,0,0,1,.729-2.9c.989.069,9.521.025,14.743-.02a1.5,1.5,0,0,1,.026,3c-.037,0-3.7.031-7.369.047C500.233,19.123,499.031,19.126,498.013,19.126Z" transform="translate(58.126 -461.364) rotate(90)"/></g></g></svg>',
        'title': getLanguage("header_more_button:create:create_work"),
        'onclick': "openPopupContents('create_work');"
    };
    slot[slot.length] = {
        'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,700a1.5,1.5,0,0,1,.844.26l23.5,16A1.5,1.5,0,0,1,49.4,718.7L25.9,736.2a1.5,1.5,0,0,1-1.792,0L.6,718.7a1.5,1.5,0,0,1,.052-2.443l23.5-16A1.5,1.5,0,0,1,25,700Zm20.915,17.555L25,703.315,4.085,717.555,25,733.13Z" transform="translate(0 -700)"></path><path d="M24.953,736.551a1.5,1.5,0,0,1-.9-.3L.6,718.754a1.5,1.5,0,0,1,1.794-2.4l22.558,16.832,22.65-16.834a1.5,1.5,0,1,1,1.789,2.408l-23.547,17.5A1.5,1.5,0,0,1,24.953,736.551Z" transform="translate(0 -686.551)"></path></g></svg>',
        'title': getLanguage("header_more_button:create:my_works"),
        'onclick': "(getCurrentMenuName() != 'workspace_my_works') ? loadWorkspace_my_works() : null;"
    };
    slot[slot.length] = {
        'icon': getSVGLouibooksLogo(2),
        'title': getLanguage("header_more_button:create:my_cloud"),
        'onclick': "(getCurrentMenuName() != 'cloud') ? loadMenu_cloud() : null;"
    };
    moreButton(el, slot);
}



















function mobileSearchButton() {
    if (window.orientation == null || window.orientation == undefined) {
        setHeaderType("search");

        let header_search = document.getElementById("header_search");
        let input = header_search.getElementsByTagName("input")[0];
        input.focus();
    } else {
        showMobileSearch();
    }
}

var isHeaderSearchClick = false;
function mobileSearchCancel() {
    if (getCurrentMenuName() != "search") {
        let media = window.matchMedia("screen and (max-width: 700px)").matches;

        if (isHeaderSearchClick == false || media == false) {
            setHeaderType('default');
        }
        isHeaderSearchClick = false;
    }
}
function mobileSearchClick() {
    isHeaderSearchClick = false;
}
function mobileSearchResizeFocus() {
    isHeaderSearchClick = true;
    mobileSearchCancel();
}
addEventListener("click", mobileSearchCancel);
addEventListener("click", mobileSearchClick);
addEventListener("resize", mobileSearchResizeFocus);
addEventListener("focus", mobileSearchResizeFocus);

function headerSearchBack() {
    if (getCurrentMenuName() != "search") {
        setHeaderType('default');
    } else {
        history.back();
    }
}







































function spinLoading() {
    let loading = document.getElementsByClassName("spin_loading_bar")[0];
    loading.style.animation = "showSpinLoadingBar 0.2s forwards";
    loading.style.display = "flex";
}
function spinLoadingComplete() {
    let loading = document.getElementsByClassName("spin_loading_bar")[0];
    loading.style.animation = "hideSpinLoadingBar 0.2s forwards";
    setTimeout(() => {
        loading.style.display = "none";
    }, 200);
}























































































function serverResponseErrorMessage(type) {
    actionMessage(getLanguage("server_response_error:" + type));
}






































































var logEvent = new Array();
function checkLogEvent() {
    if (logEvent.length == 0) {
        return;
    }

    const xhr = new XMLHttpRequest();
    const method = "POST";
    const url = "/php/logEvent.php";

    xhr.open(method, url);

    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                
                
            }
        }
    });

    var formData = new FormData();
    formData.append("language", userLanguage);
    formData.append("data", JSON.stringify(logEvent));

    xhr.send(formData);
    logEvent = new Array();
}
window.addEventListener("beforeunload", checkLogEvent);

//30초 간격으로 실행
setInterval(() => {
    checkLogEvent();
}, 30 * 1000);















































































Array.prototype.remove = function(...values) {
    return this.filter(item => !values.includes(item));
}

function contenteditable_paste(e) {
    e.preventDefault();

    // 클립보드에서 복사된 텍스트 얻기
    let pastedData = event.clipboardData ||  window.clipboardData;
    let textData = pastedData.getData('Text');

    window.document.execCommand('insertHTML', false, textData);
}

function rgbaToHex(orig) {
    let rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i), alpha = (rgb && rgb[4] || "").trim(), hex = rgb ?
    (rgb[1] | 1 << 8).toString(16).slice(1) +
    (rgb[2] | 1 << 8).toString(16).slice(1) +
    (rgb[3] | 1 << 8).toString(16).slice(1) : orig;
    return "#" + hex;
}
function hexToRgba(hex) {
    let [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r},${g},${b})`;
};
function hexToRgba(hex) {
    if (hex.indexOf("rgba") == -1) {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b})`;
    } else {
        return hex;
    }
}

function capacityUnit(size) {
    let value = (Math.floor(size * 10) / 10) + "KB";
    if (size < 1024) {
        value = (Math.floor(size * 10) / 10) + "KB";
    } else if (size < 1048576) {
        value = (Math.floor((size / 1024) * 10) / 10) + "MB";
    } else if (size < 1073741824) {
        value = (Math.floor((size / 1024 / 1024) * 10) / 10) + "GB";
    } else if (size < 1.0995116e+12) {
        value = (Math.floor((size / 1024 / 1024 / 1024) * 10) / 10) + "TB";
    }
    return value;
}

function youtubeParser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

function dateTimeFormat(date, pattern) {
	var dateString = pattern.replace(/(yyyy|MM|dd|HH|mm|ss|SSS)/g, function(match) {
		var matchString = "";
		switch(match) {
			case "yyyy":
				matchString = date.getFullYear();
				break;
			case "MM":
				matchString = date.getMonth() + 1;
				break;
			case "dd":
				matchString = date.getDate();
				break;
			case "HH":
				matchString = date.getHours();
				break;
			case "mm":
				matchString = date.getMinutes();
				break;
			case "ss":
				matchString = date.getSeconds();
				break;
			case "SSS":
				matchString = date.getMilliseconds();
				break;
			default :
				matchString = match;
				break;
		}
		if (match == "SSS") {
			if (matchString < 10) {
				matchString = "00" + matchString;
			} else if (matchString < 100) {
				matchString = "0" + matchString;
			}
		} else {
			if ((typeof(matchString) == "number" && matchString < 10)) {
				matchString = "0" + matchString;
			}
		}
		return matchString;
	});

	return dateString;
}

function getAbsoluteHeight(el) {
    el = (typeof el === 'string') ? document.querySelector(el) : el; 
  
    var styles = window.getComputedStyle(el);
    var margin = parseFloat(styles['marginTop']) +
                 parseFloat(styles['marginBottom']);
  
    return Math.ceil(el.offsetHeight + margin);
}

function cleanJson(code) {
    var instring = false;
    let level = 0;
    let i = 0;
    function cleanAsync() {
        let startI = i;
        for (; i < code.length && i < startI + 10000; i++) {
            c = code.charAt(i);
    
            if (instring) {
            if (instring==c && // this string closes at the next matching quote
                // unless it was escaped, or the escape is escaped
                ('\\'!=code.charAt(i-1) || '\\'==code.charAt(i-2))
            ) {
                instring=false;
            }
            out+=c;
            } else if ('"'==c || "'"==c) {
            if (instring && c==instring) {
                instring=false;
            } else {
                instring=c;
            }
                out+=c;
            } else if ('{'==c || '['==c) {
                level++;
                out+=c+'\n'+tabs();
                while (code.charAt(++i).match(/\s/)) ;; i--;
            } else if ('}'==c || ']'==c) {
                out=out.replace(/\s*$/, '');
                level--;
            if (!out.match(/({|\[)$/)) out+='\n'+tabs();
                out+=c;
                while (code.charAt(++i).match(/\s/)) ;; i--;
            } else if (','==c) {
                out+=',\n'+tabs();
                while (code.charAt(++i).match(/\s/)) ;; i--;
            } else {
                out+=c;
            }
        }
  
        if (i < code.length) {
            cleanAsync();
        } else {
            level = li;
            out = out.replace(/[\s\n]*$/, '');
        }
    }
  
    function tabs() {
        var s = '';
        for (var j = 0; j < level; j++) s += '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
        return s;
    }

    code = code.replace(/^[\s\n]*/, ''); //leading space
    code = code.replace(/[\s\n]*$/, ''); //trailing space
    code = code.replace(/[\n\r]+/g, '\n'); //collapse newlines

    let out = tabs(), li = level, c = '';
    cleanAsync();

    return out.replaceAll("\n", "<br />");
}

function textToURL(text) {
    var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function(url) {
        text = `
            <div class = "link md-ripples" onclick = "window.open('` + url + `');" onmouseenter = "hoverHelp(this, '` + url + `');">
                <div class = "link_in">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.199 13.599c0.992 1.327 2.43 2.126 3.948 2.345s3.123-0.142 4.45-1.134c0.239-0.179 0.465-0.375 0.655-0.568l2.995-2.995c1.163-1.204 1.722-2.751 1.696-4.285s-0.639-3.061-1.831-4.211c-1.172-1.132-2.688-1.692-4.199-1.683-1.492 0.008-2.984 0.571-4.137 1.683l-1.731 1.721c-0.392 0.389-0.394 1.023-0.004 1.414s1.023 0.394 1.414 0.004l1.709-1.699c0.77-0.742 1.763-1.117 2.76-1.123 1.009-0.006 2.016 0.367 2.798 1.122 0.795 0.768 1.203 1.783 1.221 2.808s-0.355 2.054-1.11 2.836l-3.005 3.005c-0.114 0.116-0.263 0.247-0.428 0.37-0.885 0.662-1.952 0.902-2.967 0.756s-1.971-0.678-2.632-1.563c-0.331-0.442-0.957-0.533-1.4-0.202s-0.533 0.957-0.202 1.4zM14.801 10.401c-0.992-1.327-2.43-2.126-3.948-2.345s-3.124 0.142-4.451 1.134c-0.239 0.179-0.464 0.375-0.655 0.568l-2.995 2.995c-1.163 1.204-1.722 2.751-1.696 4.285s0.639 3.061 1.831 4.211c1.172 1.132 2.688 1.692 4.199 1.683 1.492-0.008 2.984-0.571 4.137-1.683l1.723-1.723c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-1.696 1.698c-0.77 0.742-1.763 1.117-2.76 1.123-1.009 0.006-2.016-0.367-2.798-1.122-0.795-0.768-1.203-1.783-1.221-2.808s0.355-2.054 1.11-2.836l3.005-3.005c0.114-0.116 0.263-0.247 0.428-0.37 0.885-0.662 1.952-0.902 2.967-0.756s1.971 0.678 2.632 1.563c0.331 0.442 0.957 0.533 1.4 0.202s0.533-0.957 0.202-1.4z"></path></svg>
                    <span>` + url + `</span>
                </div>
            </div>
        `;

        return text.replaceAll("\n", "").trim();
    });
}

function getElementGoogleAdsense(ins) {
    let newEl = document.createElement("div");
    newEl.classList.add("google_ad_wrap");

    newEl.innerHTML = `
        <div class = "google_ad">
            ` + ins + `
        </div>
        <div class = "google_ad_loading">
            <!-- 로딩 스피너 -->
            <div class="showbox">
                <div class="loader" style = "width: 40px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/></svg></div>
            </div>
        </div>
    `;

    return newEl;
}
function checkElementGoogleAdsense(el) {
    (adsbygoogle = window.adsbygoogle || []).push({});

    function callback() {
        let loading = el.getElementsByClassName("google_ad_loading")[0];
        let adsby = el.getElementsByClassName("adsbygoogle")[0];

        function callback2() {
            let width = adsby.clientWidth;
            let height = adsby.clientHeight;

            let rect = adsby.getBoundingClientRect();
            let loadingRect = loading.getBoundingClientRect();

            loading.style.width = width + "px";
            loading.style.height = height + "px";
            loading.style.marginTop = (adsby.clientHeight * -1) + "px";
            if ((rect.left - loadingRect.left) != 0) {
                loading.style.marginLeft = (rect.left - loadingRect.left) + "px";
            }
    
            if (adsby.getAttribute("data-ad-status") != null) {
                if (adsby.getAttribute("data-ad-status") == "unfilled") {
                    el.style.height = el.clientHeight + "px";
                    el.style.transition = "all 0.2s";
                    function callback3() {
                        el.style.opacity = 0;
                        el.style.height = "0px";
                        el.style.margin = "0px";
                        setTimeout(() => {
                            el.remove();
                        }, 200);
                    }
                    window.requestAnimationFrame(callback3);
                } else {
                    loading.remove();
                }
            } else {
                window.requestAnimationFrame(callback2);
            }
        }
        window.requestAnimationFrame(callback2);
    }
    window.requestAnimationFrame(callback);
}

function generateRandomString(number) {
    let characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    let charactersLength = characters.length;
    for (let i = 0; i < number; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
}

function getSVGLouibooksLogo(type) {
    let svg = "";
    let unique = generateRandomString(10);

    if (type == 0) {
        //일반 로고
        svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62.789 64.607"><g transform="translate(-21.608 -15.697)"><path d="M1920,50V18.19s-27.988,1.857-27.988,31.81V77.761H1920c30.945,0,29.8-27.761,29.8-27.761Z" transform="translate(-1867.904 0.006)" fill="#74b5ff"/><path d="M1892.012,80.3a2.5,2.5,0,0,1-2.5-2.5V50c0-7.29,1.591-13.646,4.728-18.89a30.1,30.1,0,0,1,10.478-10.389,37,37,0,0,1,15.117-5.025,2.5,2.5,0,0,1,2.666,2.495V47.5h27.3a2.5,2.5,0,0,1,2.5,2.4,31.364,31.364,0,0,1-.8,7.4,32.387,32.387,0,0,1-2.354,6.9,27.3,27.3,0,0,1-4.923,7.182,26.9,26.9,0,0,1-9.576,6.361A39.627,39.627,0,0,1,1920,80.261h-27.565A2.516,2.516,0,0,1,1892.012,80.3Zm2.5-5.036H1920c9,0,15.929-2.471,20.6-7.345,4.98-5.191,6.266-11.9,6.59-15.416H1920a2.5,2.5,0,0,1-2.5-2.5V21.095a32.8,32.8,0,0,0-10.362,4.005c-8.378,5.112-12.626,13.49-12.626,24.9Z" transform="translate(-1867.904 0.006)"/></g></svg>
        `.replaceAll("{unique}", unique);
    } else if (type == 1) {
        //워크스페이스
        svg = `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M3,3H3V22h8V3H3M3,0h8a3,3,0,0,1,3,3V22a3,3,0,0,1-3,3H3a3,3,0,0,1-3-3V3A3,3,0,0,1,3,0Z" transform="translate(0 25)"/><path d="M3,3H3V34h8V3H3M3,0h8a3,3,0,0,1,3,3V34a3,3,0,0,1-3,3H3a3,3,0,0,1-3-3V3A3,3,0,0,1,3,0Z" transform="translate(18 13)"/><path d="M3,3H3V47h8V3H3M3,0h8a3,3,0,0,1,3,3V47a3,3,0,0,1-3,3H3a3,3,0,0,1-3-3V3A3,3,0,0,1,3,0Z" transform="translate(36)"/></g></svg>
        `.replaceAll("{unique}", unique);
    } else if (type == 2) {
        //클라우드
        svg = `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M39.531,1240.953h-29.2a12.507,12.507,0,0,1-4.965-1.349A9.848,9.848,0,0,1,0,1230.672a10.094,10.094,0,0,1,1.481-5.958,9.757,9.757,0,0,1,3.608-3.284,13.9,13.9,0,0,1,4.037-1.411A13.749,13.749,0,0,1,18,1210.051a18.7,18.7,0,0,1,7.055-1.12,13.57,13.57,0,0,1,4.846,1.123,14.709,14.709,0,0,1,7.285,6.883l.052-.009a10.573,10.573,0,0,1,6.36.824,10.684,10.684,0,0,1,4.666,4.392A13.953,13.953,0,0,1,50,1229.083c0,5.58-2.821,8.522-5.187,10.008a13.063,13.063,0,0,1-5.133,1.854A1.482,1.482,0,0,1,39.531,1240.953Zm-29.133-3h29.04a10.242,10.242,0,0,0,3.867-1.458c2.452-1.58,3.695-4.073,3.695-7.412,0-4-1.754-7.225-4.691-8.621-2.988-1.42-6.623-.67-9.973,2.059a1.5,1.5,0,1,1-1.894-2.326,16.521,16.521,0,0,1,3.812-2.364,11.36,11.36,0,0,0-9.237-5.9h0c-.041,0-.082,0-.123,0a15.806,15.806,0,0,0-5.94.971,10.876,10.876,0,0,0-7.107,8.737,1.5,1.5,0,0,1-1.373,1.219,10.948,10.948,0,0,0-4.018,1.251A6.486,6.486,0,0,0,3,1230.556a6.961,6.961,0,0,0,3.668,6.34A9.587,9.587,0,0,0,10.4,1237.953Z" transform="translate(0 -1200)"/></g></svg>
        `.replaceAll("{unique}", unique);
    } else if (type == 3) {
        //파트너
        svg = `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 150 150"><defs><style>.a_{unique}{clip-path:url(#b_{unique});}.b_{unique}{fill:#005dff;}.c_{unique}{fill:#fff;}</style><clipPath id="b_{unique}"><rect width="150" height="150"/></clipPath></defs><g id="a_{unique}" class="a_{unique}"><path class="b_{unique}" d="M97.522,0l11.545,23.325,25.7,3.795L130.43,52.79,149,71,130.43,89.21l4.341,25.67-25.7,3.795L97.522,142,74.5,129.93,51.478,142,39.933,118.675l-25.7-3.795L18.57,89.21,0,71,18.57,52.79,14.228,27.12l25.7-3.795L51.478,0,74.5,12.07Z" transform="translate(0.5 4)"/><g transform="translate(47 39)"><g transform="translate(0 0)"><path class="c_{unique}" d="M32.5,65H0V32.5A32.472,32.472,0,0,1,32.5,0V27.5a5.006,5.006,0,0,0,5,5H65A32.472,32.472,0,0,1,32.5,65Z"/></g></g></g></svg>
        `.replaceAll("{unique}", unique);
    } else if (type == 4) {
        //파트너 PLUS
        svg = `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 150 150"><defs><style>.a_{unique}{clip-path:url(#b_{unique});}.b_{unique}{fill:#005dff;}.c_{unique}{fill:#fff;}</style><clipPath id="b_{unique}"><rect width="150" height="150"/></clipPath></defs><g id="a_{unique}" class="a_{unique}"><path class="b_{unique}" d="M71.5,0,84.659,9.971l16.083-3.765L108.7,20.659l16.226,3.092,1.384,16.436L139.875,49.6l-5.431,15.577L143,79.288,131.693,91.312l2.069,16.364-15.228,6.393-4.776,15.79-16.516-.344L86.448,142,71.5,134.978,56.552,142,45.757,129.515l-16.516.344-4.776-15.79L9.238,107.676l2.069-16.364L0,79.288,8.556,65.179,3.125,49.6l13.564-9.414,1.384-16.436L34.3,20.659,42.258,6.206,58.341,9.971Z" transform="translate(3.5 4)"/><g transform="translate(47 39)"><g transform="translate(0 0)"><path class="c_{unique}" d="M32.5,65H0V32.5A32.472,32.472,0,0,1,32.5,0V27.5a5.006,5.006,0,0,0,5,5H65A32.472,32.472,0,0,1,32.5,65Z"/></g></g></g></svg>
        `.replaceAll("{unique}", unique);
    } else if (type == 5) {
        //관리자
        svg = `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M18.868,1436.482a1.5,1.5,0,0,1-1.064-.443L.436,1418.548a1.5,1.5,0,0,1,0-2.114L17.8,1398.943a1.5,1.5,0,1,1,2.129,2.114L3.614,1417.491l16.318,16.434a1.5,1.5,0,0,1-1.064,2.557Z" transform="translate(0 -1392.491)"/><path d="M18.868,1436.482a1.5,1.5,0,0,1-1.076-.455l-17-17.491a1.5,1.5,0,0,1,0-2.091l17-17.491a1.5,1.5,0,1,1,2.151,2.091L3.959,1417.491l15.984,16.446a1.5,1.5,0,0,1-1.076,2.545Z" transform="translate(50.368 1442.491) rotate(180)"/></g></svg>
        `.replaceAll("{unique}", unique);
    } else if (type == 6) {
        //프리미엄
        svg = `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100"><defs><clipPath id="b"><rect width="100" height="100"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M3.48,8.013h8.546V-79.155H3.48V-82.94H57.808q12.453,0,18.557,7.081t6.1,17.7q0,10.743-6.1,18.007T57.808-32.885H35.222v40.9h8.546V11.8H3.48ZM45.111-37.4a11.233,11.233,0,0,0,7.142-2.564A17.213,17.213,0,0,0,57.38-47.23a28.408,28.408,0,0,0,1.892-10.682q0-10.743-4.151-15.993a13.073,13.073,0,0,0-10.743-5.25H35.222V-37.4Z" transform="translate(7.026 85.571)" fill="#74b5ff"/><path d="M46.268,14.3H.98V5.513H9.526V-76.655H.98V-85.44H57.808a33.02,33.02,0,0,1,11.757,1.934,21.368,21.368,0,0,1,8.694,6.014c4.453,5.165,6.711,11.67,6.711,19.335,0,7.733-2.251,14.333-6.69,19.616-4.548,5.412-11.435,8.156-20.471,8.156H37.722v35.9h8.546Zm-31.742-5h18.2V-80.44h-18.2ZM48.732-35.385h9.075c7.6,0,13.04-2.084,16.643-6.372,3.713-4.419,5.518-9.783,5.518-16.4,0-6.522-1.8-11.779-5.5-16.07-3.6-4.181-9.055-6.213-16.663-6.213H50.684q.392.164.774.351a16.331,16.331,0,0,1,5.625,4.633,20.264,20.264,0,0,1,3.572,7.546,40.205,40.205,0,0,1,1.118,10A31.016,31.016,0,0,1,59.7-46.3a19.744,19.744,0,0,1-5.894,8.29A14.223,14.223,0,0,1,48.732-35.385ZM37.722-39.9h7.389A8.726,8.726,0,0,0,50.7-41.926a14.847,14.847,0,0,0,4.361-6.238,26.065,26.065,0,0,0,1.711-9.749c0-6.552-1.215-11.411-3.612-14.443a10.6,10.6,0,0,0-8.782-4.3H37.722Z" transform="translate(7.026 85.571)"/></g></svg>
        `.replaceAll("{unique}", unique);
    }

    return svg;
}

/*
    isAll = 모든 나라를 선택할 수 있는지
*/
function getLocationSelectItem(isAll) {
    let items = new Array();
    for (let i = 0; i < locations.length; i++) {
        items[items.length] = {
            "image": getImageUrlCountry(locations[i]),
            "title": getLanguage("location:" + locations[i]),
            "value": locations[i]
        }
    }

    let names = new Array();
    for (let i = 0; i < items.length; i++) {
        names[names.length] = items[i]["title"];
    }
    names.sort();

    let newItems = new Array();
    for (let i = 0; i < names.length; i++) {
        for (let j = 0; j < items.length; j++) {
            if (names[i] == items[j]["title"]) {
                newItems[newItems.length] = items[j];
            }
        }
    }

    //모든
    if (isAll == true) {
        newItems.unshift({
            "icon": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,50A25.007,25.007,0,0,1,15.269,1.965,25.007,25.007,0,0,1,34.731,48.036,24.843,24.843,0,0,1,25,50ZM25,3A22,22,0,1,0,47,25,22.025,22.025,0,0,0,25,3Z"></path><rect width="48" height="2" transform="translate(26 1) rotate(90)"></rect><path d="M0,0S11.775-11.288,23.775-11.288,48,0,48,0V2S35.775-9.288,23.775-9.288,0,2,0,2Z" transform="translate(26 1) rotate(90)"></path><path d="M0,0S11.775-11.288,23.775-11.288,48,0,48,0V2S35.775-9.288,23.775-9.288,0,2,0,2Z" transform="translate(24 49) rotate(-90)"></path><path d="M0,0S11.923-4.994,23.923-4.994,48,0,48,0V2S35.923-2.994,23.923-2.994,0,2,0,2Z" transform="translate(49 31.856) rotate(-180)"></path><path d="M0,0S11.923-4.994,23.923-4.994,48,0,48,0V2S35.923-2.994,23.923-2.994,0,2,0,2Z" transform="translate(1 17.85)"></path></g></svg>',
            "title": getLanguage("location:select_item:all"),
            "value": "all"
        });
    }

    return newItems;
}
/*
    isAll = 모든 언어를 선택할 수 있는지
    except = 제외 언어
*/
function getLanguageSelectItem(isAll, except) {
    let items = new Array();
    for (let i = 0; i < languages.length; i++) {
        let is = true;
        if (except != null) {
            for (let j = 0; j < except.length; j++) {
                if (except[j] == languages[i]) {
                    is = false;
                    break;
                }
            }
        }
        if (is == true) {
            items[items.length] = {
                "image": getImageUrlCountry(null, languages[i]),
                "title": getLanguage("language:" + languages[i]),
                "value": languages[i]
            }
        }
    }

    let names = new Array();
    for (let i = 0; i < items.length; i++) {
        names[names.length] = items[i]["title"];
    }
    names.sort();

    let newItems = new Array();
    for (let i = 0; i < names.length; i++) {
        for (let j = 0; j < items.length; j++) {
            if (names[i] == items[j]["title"]) {
                newItems[newItems.length] = items[j];
            }
        }
    }

    //모든
    if (isAll == true) {
        newItems.unshift({
            "icon": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(0 -10)"><rect width="3" height="39" rx="1.5" transform="translate(13.339 12.326) rotate(20)"></rect><rect width="3" height="39" rx="1.5" transform="translate(12.35 13.352) rotate(-20)"></rect><rect width="3" height="15.5" rx="1.5" transform="translate(22.179 33.413) rotate(90)"></rect></g><g transform="translate(4.821 6)"><rect width="3" height="23.5" rx="1.5" transform="translate(45.179 15.413) rotate(90)"></rect><rect width="3" height="6.299" rx="1.5" transform="translate(34.929 17.589) rotate(180)"></rect><path d="M6.258-1.278A1.576,1.576,0,0,1,7.282.152s-3.4,8.118-4.351,14.5A42.123,42.123,0,0,0,3,26.749a1.5,1.5,0,0,1-3,0A46.581,46.581,0,0,1,.157,14.4C1.163,7.87,4.524-.436,4.524-.436A1.37,1.37,0,0,1,6.258-1.278Z" transform="translate(30.054 41.378) rotate(-150)"></path><path d="M-4.084.024A1.4,1.4,0,0,1-2.138.58,46.577,46.577,0,0,1,2.6,12.127a40.794,40.794,0,0,1,.4,11.8,1.5,1.5,0,0,1-3,0,25.612,25.612,0,0,0,0-10.38A49.119,49.119,0,0,0-4.77,1.8,1.48,1.48,0,0,1-4.084.024Z" transform="translate(39.585 41.423) rotate(150)"></path></g></g></svg>',
            "title": getLanguage("language:select_item:all"),
            "value": "all"
        });
    }

    return newItems;
}

function getImageUrlCountry(country, language) {
    if (language != null) {
        Object.keys(relatedLanguages).forEach(key => {
            if (relatedLanguages[key] == language) {
                country = key;
            }
        });
    }

    return "/SVG/country/" + country + ".svg";
}

function secondsToTime(seconds) {
    var hour = parseInt(seconds / 3600);
    var min = parseInt((seconds % 3600) / 60);
    var sec = seconds % 60 < 10 ? '0' + seconds % 60 : seconds % 60;

    if (hour != 0) {
        return hour + ":" + ((min < 10) ? min = ("0" + min) : min) + ":" + sec;
    } else {
        return min + ":" + sec;
    }
}

function getAverageRGB(element, blockSize) {
    (blockSize == null) ? blockSize = 5 : null;

    let canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d');

    let width = element.naturalWidth || element.videoWidth;
    let height = element.naturalHeight || element.videoHeight;
    canvas.width = width;
    canvas.height = height;

    context.drawImage(element, 0, 0);

    let imageData = null;
    try {
        imageData = context.getImageData(0, 0, width, height);
    } catch(e) {
        return null;
    }

    if (imageData != null) {
        let i = 0;
        let length = imageData.data.length;
        let rgb = {r: 0, g: 0, b: 0};
        let count = 0;

        while ((i += 4) < length) {
            rgb.r += imageData.data[i];
            rgb.g += imageData.data[i + 1];
            rgb.b += imageData.data[i + 2];
    
            count ++;
        }
    
        rgb.r /= count;
        rgb.g /= count;
        rgb.b /= count;

        return rgb;
    }

    return null;
}

function supportsVideoType(type) {
    let formats = {
        avc1: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
        vp09: 'video/webm; codecs="vp09.02.10.10.01.09.16.09.01, opus"',
        av01: 'video/webm; codecs="av01.2.15M.10.0.100.09.16.09.0, opus"'
    };
    
    let video = document.createElement('video');
    return (video.canPlayType(formats[type]) == 'probably') ? true : false;
}

var visualViewportData = {
    "width": window.visualViewport.width,
    "height": window.visualViewport.height
}
function getVisualViewport() {
    return visualViewportData;
}
function checkVisualViewport() {
    visualViewportData = {
        "width": window.visualViewport.width,
        "height": window.visualViewport.height
    }
}
window.visualViewport.addEventListener('resize', checkVisualViewport);
window.visualViewport.addEventListener('focus', checkVisualViewport);

function isArrayEqual(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (!isArrayEqual(a[i], b[i])) {
                return false;
            }
        }
        return true;
    } else if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
        if (Object.keys(a).length !== Object.keys(b).length) {
            return false;
        }
        for (let key in a) {
            if (!b.hasOwnProperty(key) || !isArrayEqual(a[key], b[key])) {
                return false;
            }
        }
        return true;
    } else {
        return a === b;
    }
}

function copy(text) {
    let el = document.createElement("textarea");
    document.body.appendChild(el);
    el.value = text;
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    actionMessage(getLanguage("copy_message"));
}
var copiedText = "";
document.addEventListener('copy', function(e){
    copiedText = window.getSelection().toString();
    e.clipboardData.setData('text/plain', copiedText);
});

var documentElementUpdated = new CustomEvent('documentElementUpdated');
var isDocumentElementUpdated = false;
var documentObserver = new MutationObserver(function(mutationsList) {
    if (isDocumentElementUpdated == false) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                isDocumentElementUpdated = true;
                function callback() {
                    window.dispatchEvent(documentElementUpdated);
                    isDocumentElementUpdated = false;
                }
                window.requestAnimationFrame(callback);
                break;
            }
        }
    }
});
documentObserver.observe(document.documentElement, { childList: true, subtree: true, passive: true });

function getOverflowElement() {
    let elementsWithOverflow = Array.from(document.documentElement.querySelectorAll('*')).filter(el => {
        let computedStyle = window.getComputedStyle(el);
        let overflow = computedStyle.overflow;
        return overflow.indexOf('auto') != -1 || overflow.indexOf('scroll') != -1 || overflow.indexOf('overlay') != -1;
    });
    let elementsWithScroll = elementsWithOverflow.filter(el => {
        return el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
    });
    return elementsWithScroll;
}

function getSelectionIndices(element) {
    let start = 0, end = 0;
    let sel, range, priorRange;
  
    if (typeof window.getSelection != "undefined") {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            priorRange = range.cloneRange();
        
            priorRange.selectNodeContents(element);
            priorRange.setEnd(range.startContainer, range.startOffset);
            start = priorRange.toString().length;
    
            priorRange.selectNodeContents(element);
            priorRange.setEnd(range.endContainer, range.endOffset);
            end = priorRange.toString().length;
        }
    } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
        range = document.selection.createRange().duplicate();
        priorRange = range.duplicate();
    
        priorRange.moveToElementText(element);
        priorRange.setEndPoint("EndToStart", range);
        start = priorRange.text.length;
    
        priorRange.moveToElementText(element);
        priorRange.setEndPoint("EndToEnd", range);
        end = priorRange.text.length;
    }
  
    return { start: start, end: end };
}