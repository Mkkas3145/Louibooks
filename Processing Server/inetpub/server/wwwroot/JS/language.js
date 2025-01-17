


function setLanguage(language) {
    if (getLanguageNameList().indexOf(language) == -1)  {
        language = "en";
    }
    setCookie('language', language);
    userLanguage = language;
    document.documentElement.setAttribute("lang", language);

    if (history.state != null) {
        deleteAllMenu(true);

        let data = history.state;
        let property = data["property"];
        property["historyNoStack"] = true;

        if (data["url"] != null) { loadMenu(data["url"], property, data["data"]); }
    } else {
        deleteAllMenu();
    }

    loadLanguage();
}
function getUserLanguageName() {
    let language = "";
    if (getCookie('language') != null) {
        language = getCookie('language');
    } else {
        //브라우저 언어
        language = (navigator.language || navigator.userLanguage).split("-")[0];
    }
    if (getLanguageNameList().indexOf(language) != -1)  {
        return language;
    } else {
        return 'en';
    }
}
function getLanguageNameList() {
    let language = new Array(
        "ko", "en", "ja"
    );
    return language;
}
function getLanguage(type, language) {
    if (language == null) {
        language = userLanguage;
    }

    let texts = getLanguageTexts(language);
    if (texts[type] != null) {
        return texts[type];
    }

    return "...";
}

let languageTexts = new Array();
function getLanguageTexts(language) {
    if (language == "ko") {
        //한국어
        (languageTexts[language] == null) ? languageTexts[language] = getLanguageText_ko() : null;
    } else if (language == "en") {
        //영어
        (languageTexts[language] == null) ? languageTexts[language] = getLanguageText_en() : null;
    } else if (language == "ja") {
        //일본어
        (languageTexts[language] == null) ? languageTexts[language] = getLanguageText_ja() : null;
    }
    return languageTexts[language];
}












function getCountNumberUnit(number) {
    //한국어
    if (userLanguage == "ko") {
        return getCountNumberUnit_ko(number);
    }
    //영어
    if (userLanguage == "en") {
        return getCountNumberUnit_en(number);
    }
    //일본어
    if (userLanguage == "ja") {
        return getCountNumberUnit_ja(number);
    }
}
function getRatingsNumberUnit(number) {
    //한국어
    if (userLanguage == "ko") {
        return getRatingsNumberUnit_ko(number);
    }
    //영어
    if (userLanguage == "en") {
        return getRatingsNumberUnit_en(number);
    }
    //일본어
    if (userLanguage == "ja") {
        return getRatingsNumberUnit_ja(number);
    }
}
function getViewsNumberUnit(number) {
    //한국어
    if (userLanguage == "ko") {
        return getViewsNumberUnit_ko(number);
    }
    //영어
    if (userLanguage == "en") {
        return getViewsNumberUnit_en(number);
    }
    //일본어
    if (userLanguage == "ja") {
        return getViewsNumberUnit_ja(number);
    }
}
function getNumberUnit(number) {
    //한국어
    if (userLanguage == "ko") {
        return getNumberUnit_ko(number);
    }
    //영어
    if (userLanguage == "en") {
        return getNumberUnit_en(number);
    }
    //일본어
    if (userLanguage == "ja") {
        return getNumberUnit_ja(number);
    }
}
function getTimePast(time) {
    let curr = new Date();
    let utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
    let currentTime = new Date(utc);

    let difference = currentTime.getTime() - time.getTime();
    let second = difference / 1000;

    (second < 0) ? second = 0 : null;

    if (second < 60) {
        let text = getLanguage("time_past_second");
        return text.replaceAll("{R:0}", Math.floor(second));
    } else if (second < 3600) {
        let text = getLanguage("time_past_minute");
        return text.replaceAll("{R:0}", Math.floor(second / 60));
    } else if (second < 86400) {
        let text = getLanguage("time_past_hour");
        return text.replaceAll("{R:0}", Math.floor(second / 3600));
    } else if (second < 2592000) {
        let text = getLanguage("time_past_day");
        return text.replaceAll("{R:0}", Math.floor(second / 86400));
    } else if (second < 31104000) {
        let text = getLanguage("time_past_month");
        return text.replaceAll("{R:0}", Math.floor(second / 2592000));
    } else {
        let text = getLanguage("time_past_year");
        return text.replaceAll("{R:0}", Math.floor(second / 31104000));
    }
}
/*
    초를 텍스트로 변환
*/
function getTimeText(second) {
    (second < 0) ? second = 0 : null;

    if (second < 60) {
        let text = getLanguage("time_second");
        return text.replaceAll("{R:0}", Math.floor(second));
    } else if (second < 3600) {
        let text = getLanguage("time_minute");
        return text.replaceAll("{R:0}", Math.floor(second / 60));
    } else if (second < 86400) {
        let text = getLanguage("time_hour");
        return text.replaceAll("{R:0}", Math.floor(second / 3600));
    } else if (second < 2592000) {
        let text = getLanguage("time_day");
        return text.replaceAll("{R:0}", Math.floor(second / 86400));
    } else if (second < 31104000) {
        let text = getLanguage("time_month");
        return text.replaceAll("{R:0}", Math.floor(second / 2592000));
    } else {
        let text = getLanguage("time_year");
        return text.replaceAll("{R:0}", Math.floor(second / 31104000));
    }
}
function commas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}