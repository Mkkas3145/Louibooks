



function viewerSettingsButton(menuNumber, el, type) {
    popupElementViewerSettings(menuNumber, el, 'bottom', type);
}

function popupElementViewerSettings(menuNumber, el, direction, type) {
    let item = getViewerSettingsItemElement(menuNumber, type);
    popupElement(el, direction, item.outerHTML);
}

function viewerMoveSettings(menuNumber, type, isBack) {
    (isBack == null) ? isBack = false : null;
    let seconds = 0.3;

    let popupElement = document.getElementsByClassName("popup_element")[0];
    let settingsItems = popupElement.getElementsByClassName("popup_element_box")[0];
    let previousItem = settingsItems.getElementsByClassName("popup_element_viewer_settings_item")[0];
    settingsItems.style.overflow = "hidden";
    previousItem.style.pointerEvents = "none";

    //테두리 픽셀
    let borderPixel = 1;
    borderPixel *= 2;

    //예전 스크롤 정보
    let previousItemRect = previousItem.getBoundingClientRect();
    let previousScrollTop = settingsItems.scrollTop;

    //예전 바인딩 정보
    let previousRect = settingsItems.getBoundingClientRect();

    previousItem.style.display = "none";
    let newItem = getViewerSettingsItemElement(menuNumber, type);
    newItem = settingsItems.appendChild(newItem);
    newItem.style.pointerEvents = "none";
    settingsItems.scrollTop = 0;

    //새로운 바인딩 정보
    let newRect = settingsItems.getBoundingClientRect();
    previousItem.style.display = null;

    //width, height 고정
    previousItem.style.minWidth = (previousRect.width + "px");
    previousItem.style.minHeight = (previousRect.height + "px");
    previousItem.style.maxWidth = (previousRect.width + "px");
    previousItem.style.maxHeight = (previousRect.height + "px");
    previousItem.style.position = "absolute";
    previousItem.style.bottom = ("-" + borderPixel + "px");
    previousItem.style.left = (borderPixel + "px");
    let isMobileSize = matchMedia('(max-width: 700px)').matches;
    if (isMobileSize == true) {
        let lineWrap = popupElement.getElementsByClassName("popup_element_touch_line_wrap")[0];
        previousItem.style.bottom = "-" + lineWrap.clientHeight + "px";
    }
    //위치가 고정되게
    let scrollHeight = (newRect.scrollHeight - newRect.height);
    let marginBottom = (previousItemRect.bottom - previousRect.bottom);
    marginBottom += scrollHeight;
    (marginBottom < 0) ? marginBottom = 0 : null;
    previousItem.style.marginBottom = ((marginBottom * -1) + "px");
    //이전 스크롤 위치로
    previousItem.scrollTop = previousScrollTop;

    let newItemRect = newItem.getBoundingClientRect();
    newItem.style.minWidth = (newRect.width + "px");
    newItem.style.minHeight = (newRect.height + "px");
    newItem.style.maxWidth = (newRect.width + "px");
    newItem.style.maxHeight = (newRect.height + "px");
    newItem.style.position = "absolute";
    newItem.style.bottom = ("-" + borderPixel + "px");
    newItem.style.left = (borderPixel + "px");
    if (isMobileSize == true) {
        let lineWrap = popupElement.getElementsByClassName("popup_element_touch_line_wrap")[0];
        newItem.style.bottom = "-" + lineWrap.clientHeight + "px";
    }
    newItem.style.marginLeft = (previousItemRect.width + "px");
    //젤 위로 향하게
    marginBottom = (newItemRect.height - previousItemRect.height) - (newItemRect.height - previousItemRect.height);
    (marginBottom < 0) ? marginBottom = 0 : null;
    newItem.style.marginBottom = ((marginBottom * -1) + "px");

    if (isBack == false) {
        function callback() {
            previousItem.style.transition = ("transform " + seconds + "s" + ", opacity " + seconds + "s");
            newItem.style.transition = ("transform " + seconds + "s" + ", opacity " + seconds + "s");
            previousItem.style.transform = "translateX(-100%)";
            previousItem.style.opacity = 0;
            newItem.style.transform = "translateX(-" + (previousItemRect.width) + "px)"; //-100%
            newItem.style.opacity = 1;
        }
        window.requestAnimationFrame(callback);
    } else {
        previousItem.style.transform = "translateX(0%)"; //0%
        newItem.style.transform = "translateX(-" + (newItemRect.width + previousItemRect.width) + "px)"; //-200%
        function callback() {
            previousItem.style.transition = ("transform " + seconds + "s" + ", opacity " + seconds + "s");
            newItem.style.transition = ("transform " + seconds + "s" + ", opacity " + seconds + "s");
            previousItem.style.transform = "translateX(" + (newItemRect.width) + "px)"; //100%
            previousItem.style.opacity = 0;
            newItem.style.transform = "translateX(-" + (previousItemRect.width) + "px)"; //-100%
            newItem.style.opacity = 1;
        }
        window.requestAnimationFrame(callback);
    }

    //width, height가 서서히 바뀜
    settingsItems.style.minWidth = (previousRect.width + "px");
    settingsItems.style.minHeight = (previousRect.height + "px");
    function callbackItems() {
        settingsItems.style.transition = ("min-width " + seconds + "s, min-height " + seconds + "s");
        settingsItems.style.minWidth = (newRect.width + "px");
        settingsItems.style.minHeight = (newRect.height + "px");
    }
    window.requestAnimationFrame(callbackItems);

    //끝
    function callbackEnd() {
        setTimeout(() => {
            previousItem.remove();

            newItem.style.minWidth = null;
            newItem.style.minHeight = null;
            newItem.style.maxWidth = null;
            newItem.style.maxHeight = null;
            newItem.style.transition = null;
            newItem.style.transform = null;
            newItem.style.opacity = null;
            newItem.style.position = null;
            newItem.style.marginLeft = null;
            newItem.style.marginBottom = null;
            newItem.style.bottom = null;
            newItem.style.pointerEvents = null;

            settingsItems.style.minWidth = null;
            settingsItems.style.minHeight = null;
            settingsItems.style.transition = null;
            settingsItems.style.overflow = null;
        }, seconds * 1000);
    }
    window.requestAnimationFrame(callbackEnd);
}

function getViewerSettingsItemElement(menuNumber, type) {
    let contents = document.getElementById("contents_" + menuNumber);

    let newEl = document.createElement("div");
    newEl.classList.add("popup_element_viewer_settings_item");

    let info = new Array();
    
    
    
    
    
    
    
    
    
    
    








































    
    
    
    
    
    /* 소설 뷰어 */
    let novelBackgroundColor = [
        '#FFFFFF',
        '#000000',
        '#ACC9AB',
        '#F6EED4',
        '#E3FFF4',
        '#CDD6EB'
    ];
    let novelTextColor = [
        '#FFFFFF',
        '#DDDDDD',
        '#000000',
        '#404040'
    ];
    //메인 설정
    if (type == "novel_main") {
        let partInfo = JSON.parse(contents.getElementsByClassName("part_info")[0].innerHTML);
        let selectedLanguage = partInfo["language"];

        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 28"><path d="M14 14c0-2.203-1.797-4-4-4s-4 1.797-4 4 1.797 4 4 4 4-1.797 4-4zM26 22c0-1.094-0.906-2-2-2s-2 0.906-2 2c0 1.109 0.906 2 2 2 1.109 0 2-0.906 2-2zM26 6c0-1.094-0.906-2-2-2s-2 0.906-2 2c0 1.109 0.906 2 2 2 1.109 0 2-0.906 2-2zM20 12.578v2.891c0 0.203-0.156 0.438-0.359 0.469l-2.422 0.375c-0.125 0.406-0.297 0.797-0.5 1.188 0.438 0.625 0.906 1.203 1.406 1.797 0.063 0.094 0.109 0.187 0.109 0.313 0 0.109-0.031 0.219-0.109 0.297-0.313 0.422-2.063 2.328-2.516 2.328-0.125 0-0.234-0.047-0.328-0.109l-1.797-1.406c-0.391 0.203-0.781 0.359-1.203 0.484-0.078 0.797-0.156 1.656-0.359 2.422-0.063 0.219-0.25 0.375-0.469 0.375h-2.906c-0.219 0-0.438-0.172-0.469-0.391l-0.359-2.391c-0.406-0.125-0.797-0.297-1.172-0.484l-1.844 1.391c-0.078 0.078-0.203 0.109-0.313 0.109-0.125 0-0.234-0.047-0.328-0.125-0.406-0.375-2.25-2.047-2.25-2.5 0-0.109 0.047-0.203 0.109-0.297 0.453-0.594 0.922-1.172 1.375-1.781-0.219-0.422-0.406-0.844-0.547-1.281l-2.375-0.375c-0.219-0.031-0.375-0.234-0.375-0.453v-2.891c0-0.203 0.156-0.438 0.359-0.469l2.422-0.375c0.125-0.406 0.297-0.797 0.5-1.188-0.438-0.625-0.906-1.203-1.406-1.797-0.063-0.094-0.109-0.203-0.109-0.313s0.031-0.219 0.109-0.313c0.313-0.422 2.063-2.312 2.516-2.312 0.125 0 0.234 0.047 0.328 0.109l1.797 1.406c0.391-0.203 0.781-0.359 1.203-0.5 0.078-0.781 0.156-1.641 0.359-2.406 0.063-0.219 0.25-0.375 0.469-0.375h2.906c0.219 0 0.438 0.172 0.469 0.391l0.359 2.391c0.406 0.125 0.797 0.297 1.172 0.484l1.844-1.391c0.094-0.078 0.203-0.109 0.313-0.109 0.125 0 0.234 0.047 0.328 0.125 0.406 0.375 2.25 2.063 2.25 2.5 0 0.109-0.047 0.203-0.109 0.297-0.453 0.609-0.922 1.172-1.359 1.781 0.203 0.422 0.391 0.844 0.531 1.281l2.375 0.359c0.219 0.047 0.375 0.25 0.375 0.469zM30 20.906v2.188c0 0.234-2.016 0.453-2.328 0.484-0.125 0.297-0.281 0.562-0.469 0.812 0.141 0.313 0.797 1.875 0.797 2.156 0 0.047-0.016 0.078-0.063 0.109-0.187 0.109-1.859 1.109-1.937 1.109-0.203 0-1.375-1.563-1.531-1.797-0.156 0.016-0.313 0.031-0.469 0.031s-0.313-0.016-0.469-0.031c-0.156 0.234-1.328 1.797-1.531 1.797-0.078 0-1.75-1-1.937-1.109-0.047-0.031-0.063-0.078-0.063-0.109 0-0.266 0.656-1.844 0.797-2.156-0.187-0.25-0.344-0.516-0.469-0.812-0.313-0.031-2.328-0.25-2.328-0.484v-2.188c0-0.234 2.016-0.453 2.328-0.484 0.125-0.281 0.281-0.562 0.469-0.812-0.141-0.313-0.797-1.891-0.797-2.156 0-0.031 0.016-0.078 0.063-0.109 0.187-0.094 1.859-1.094 1.937-1.094 0.203 0 1.375 1.547 1.531 1.781 0.156-0.016 0.313-0.031 0.469-0.031s0.313 0.016 0.469 0.031c0.438-0.609 0.906-1.219 1.437-1.75l0.094-0.031c0.078 0 1.75 0.984 1.937 1.094 0.047 0.031 0.063 0.078 0.063 0.109 0 0.281-0.656 1.844-0.797 2.156 0.187 0.25 0.344 0.531 0.469 0.812 0.313 0.031 2.328 0.25 2.328 0.484zM30 4.906v2.187c0 0.234-2.016 0.453-2.328 0.484-0.125 0.297-0.281 0.562-0.469 0.812 0.141 0.313 0.797 1.875 0.797 2.156 0 0.047-0.016 0.078-0.063 0.109-0.187 0.109-1.859 1.109-1.937 1.109-0.203 0-1.375-1.563-1.531-1.797-0.156 0.016-0.313 0.031-0.469 0.031s-0.313-0.016-0.469-0.031c-0.156 0.234-1.328 1.797-1.531 1.797-0.078 0-1.75-1-1.937-1.109-0.047-0.031-0.063-0.078-0.063-0.109 0-0.266 0.656-1.844 0.797-2.156-0.187-0.25-0.344-0.516-0.469-0.812-0.313-0.031-2.328-0.25-2.328-0.484v-2.188c0-0.234 2.016-0.453 2.328-0.484 0.125-0.281 0.281-0.562 0.469-0.812-0.141-0.313-0.797-1.891-0.797-2.156 0-0.031 0.016-0.078 0.063-0.109 0.187-0.094 1.859-1.094 1.937-1.094 0.203 0 1.375 1.547 1.531 1.781 0.156-0.016 0.313-0.031 0.469-0.031s0.313 0.016 0.469 0.031c0.438-0.609 0.906-1.219 1.437-1.75l0.094-0.031c0.078 0 1.75 0.984 1.937 1.094 0.047 0.031 0.063 0.078 0.063 0.109 0 0.281-0.656 1.844-0.797 2.156 0.187 0.25 0.344 0.531 0.469 0.812 0.313 0.031 2.328 0.25 2.328 0.484z"></path></svg>',
            'title': getLanguage("novel_viewer_settings:viewer_settings:title"),
            'description': getLanguage("novel_viewer_settings:viewer_settings:description"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_viewer\');'
        }
        info[info.length] = {
            'type': 'line'
        }
        
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 16h-8c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-10c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h16c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v10c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293zM11 18v2h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1h8c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3v-2h7c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-10c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-16c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v10c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879z"></path></svg>',
            'title': getLanguage("novel_viewer_settings:viewer_mode:title"),
            'description': getLanguage("novel_viewer_settings:viewer_mode:description"),
            'value': getLanguage("novel_viewer_settings:viewer_mode:" + getViewerSettingsValue("novelViewerMode")),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_viewer_mode\');'
        }
        //페이지 뷰
        let novel_viewer = contents.getElementsByClassName("novel_viewer")[0];
        if (novel_viewer.getAttribute("type") == "page_view") {
            info[info.length] = {
                'type': 'menu',
                'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.016 18v-9h-4.031v9h4.031zM15 12.984v-3.984h-11.016v3.984h11.016zM15 18v-3.984h-11.016v3.984h11.016zM20.016 3.984q0.797 0 1.383 0.609t0.586 1.406v12q0 0.797-0.586 1.406t-1.383 0.609h-16.031q-0.797 0-1.383-0.609t-0.586-1.406v-12q0-0.797 0.586-1.406t1.383-0.609h16.031z"></path></svg>',
                'title': getLanguage("novel_viewer_settings:page_count:title"),
                'description': getLanguage("novel_viewer_settings:page_count:description"),
                'value': getLanguage("novel_viewer_settings:page_count:" + getViewerSettingsValue("novelViewerPageCount")),
                'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_page_view\');'
            }
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19.753 10.909c-0.624-1.707-2.366-2.726-4.661-2.726-0.090 0-0.176 0.002-0.262 0.006l-0.016-2.063c0 0 3.41-0.588 3.525-0.607s0.133-0.119 0.109-0.231c-0.023-0.111-0.167-0.883-0.188-0.976-0.027-0.131-0.102-0.127-0.207-0.109s-3.25 0.461-3.25 0.461-0.012-1.953-0.013-2.078c-0.001-0.125-0.069-0.158-0.194-0.156s-0.92 0.014-1.025 0.016c-0.105 0.002-0.164 0.049-0.162 0.148s0.033 2.307 0.033 2.307-3.061 0.527-3.144 0.543c-0.084 0.014-0.17 0.053-0.151 0.143s0.19 1.094 0.208 1.172c0.018 0.080 0.072 0.129 0.188 0.107 0.115-0.019 2.924-0.504 2.924-0.504l0.035 2.018c-1.077 0.281-1.801 0.824-2.256 1.303-0.768 0.807-1.207 1.887-1.207 2.963 0 1.586 0.971 2.529 2.328 2.695 3.162 0.387 5.119-3.060 5.769-4.715 1.097 1.506 0.256 4.354-2.094 5.98-0.043 0.029-0.098 0.129-0.033 0.207s0.541 0.662 0.619 0.756c0.080 0.096 0.206 0.059 0.256 0.023 2.51-1.73 3.661-4.515 2.869-6.683zM12.367 14.097c-0.966-0.121-0.944-0.914-0.944-1.453 0-0.773 0.327-1.58 0.876-2.156 0.335-0.354 0.75-0.621 1.229-0.799l0.082 4.277c-0.385 0.131-0.799 0.185-1.243 0.131zM14.794 13.544l0.046-4.109c0.084-0.004 0.166-0.010 0.252-0.010 0.773 0 1.494 0.145 1.885 0.361s-1.023 2.713-2.183 3.758zM5.844 5.876c-0.030-0.094-0.103-0.145-0.196-0.145h-1.95c-0.093 0-0.165 0.051-0.194 0.144-0.412 1.299-3.48 10.99-3.496 11.041s-0.011 0.076 0.062 0.076h1.733c0.075 0 0.099-0.023 0.114-0.072 0.015-0.051 1.008-3.318 1.008-3.318h3.496c0 0 0.992 3.268 1.008 3.318s0.039 0.072 0.113 0.072h1.734c0.072 0 0.078-0.025 0.062-0.076-0.014-0.050-3.083-9.741-3.494-11.040zM3.226 12.194l1.447-5.25 1.447 5.25h-2.894z"></path></svg>',
            'title': getLanguage("novel_viewer_settings:language:title"),
            'description': getLanguage("novel_viewer_settings:language:description"),
            'value': getLanguage("language:" + selectedLanguage),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_language\');'
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M30 26c-1.104 0-2-0.896-2-2v-8c0-6.627-5.373-12-12-12s-12 5.373-12 12v8c0 1.104-0.896 2-2 2s-2-0.896-2-2v-8c0-8.837 7.164-16 16-16s16 7.163 16 16v8c0 1.104-0.896 2-2 2zM7 18h2c0.552 0 1 0.447 1 1v10c0 0.553-0.448 1-1 1h-2c-0.552 0-1-0.447-1-1v-10c0-0.553 0.448-1 1-1zM23 18h2c0.553 0 1 0.447 1 1v10c0 0.553-0.447 1-1 1h-2c-0.553 0-1-0.447-1-1v-10c0-0.553 0.447-1 1-1z"></path></svg>',
            'title': getLanguage("novel_viewer_settings:tts:title"),
            'description': getLanguage("novel_viewer_settings:tts:description"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_tts\');'
        }
    }
    if (type == "novel_tts") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("novel_viewer_settings:tts:title"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_main\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.063 2.016q2.906 3.047 2.906 7.055t-2.906 6.914l-1.641-1.594q2.063-2.391 2.063-5.461t-2.063-5.32zM16.781 5.344q1.5 1.641 1.5 3.703t-1.5 3.563l-1.688-1.688q0.656-0.891 0.656-1.945t-0.656-1.945zM9 15q2.531 0 5.273 1.102t2.742 2.883v2.016h-16.031v-2.016q0-1.781 2.742-2.883t5.273-1.102zM5.016 9q0-1.641 1.172-2.813t2.813-1.172 2.813 1.172 1.172 2.813-1.172 2.813-2.813 1.172-2.813-1.172-1.172-2.813z"></path></svg>',
            'title': getLanguage("novel_viewer_settings:tts:voice"),
            'value': getViewerSettingsValue('novelViewerTTSVoice'),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_tts_voice\');'
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 6.038v-2.038h4v-2c0-1.105-0.895-2-2-2h-6c-1.105 0-2 0.895-2 2v2h4v2.038c-6.712 0.511-12 6.119-12 12.962 0 7.18 5.82 13 13 13s13-5.82 13-13c0-6.843-5.288-12.451-12-12.962zM22.071 26.071c-1.889 1.889-4.4 2.929-7.071 2.929s-5.182-1.040-7.071-2.929c-1.889-1.889-2.929-4.4-2.929-7.071s1.040-5.182 2.929-7.071c1.814-1.814 4.201-2.844 6.754-2.923l-0.677 9.813c-0.058 0.822 0.389 1.181 0.995 1.181s1.053-0.36 0.995-1.181l-0.677-9.813c2.552 0.079 4.94 1.11 6.754 2.923 1.889 1.889 2.929 4.4 2.929 7.071s-1.040 5.182-2.929 7.071z"></path></svg>',
            'title': getLanguage("novel_viewer_settings:tts:rate"),
            'value': getViewerSettingsValue('novelViewerTTSRate'),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_tts_rate\');'
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 32"><path d="M27.814 28.814c-0.384 0-0.768-0.146-1.061-0.439-0.586-0.586-0.586-1.535 0-2.121 2.739-2.739 4.247-6.38 4.247-10.253s-1.508-7.514-4.247-10.253c-0.586-0.586-0.586-1.536 0-2.121s1.536-0.586 2.121 0c3.305 3.305 5.126 7.7 5.126 12.374s-1.82 9.069-5.126 12.374c-0.293 0.293-0.677 0.439-1.061 0.439zM22.485 25.985c-0.384 0-0.768-0.146-1.061-0.439-0.586-0.586-0.586-1.535 0-2.121 4.094-4.094 4.094-10.755 0-14.849-0.586-0.586-0.586-1.536 0-2.121s1.536-0.586 2.121 0c2.55 2.55 3.954 5.94 3.954 9.546s-1.404 6.996-3.954 9.546c-0.293 0.293-0.677 0.439-1.061 0.439v0zM17.157 23.157c-0.384 0-0.768-0.146-1.061-0.439-0.586-0.586-0.586-1.535 0-2.121 2.534-2.534 2.534-6.658 0-9.192-0.586-0.586-0.586-1.536 0-2.121s1.535-0.586 2.121 0c3.704 3.704 3.704 9.731 0 13.435-0.293 0.293-0.677 0.439-1.061 0.439z"></path><path d="M13 30c-0.26 0-0.516-0.102-0.707-0.293l-7.707-7.707h-3.586c-0.552 0-1-0.448-1-1v-10c0-0.552 0.448-1 1-1h3.586l7.707-7.707c0.286-0.286 0.716-0.372 1.090-0.217s0.617 0.519 0.617 0.924v26c0 0.404-0.244 0.769-0.617 0.924-0.124 0.051-0.254 0.076-0.383 0.076z"></path></svg>',
            'title': getLanguage("novel_viewer_settings:tts:volume"),
            'value': (getViewerSettingsValue('novelViewerTTSVolume') + "%"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_tts_volume\');'
        }
    }
    if (type == "novel_tts_voice") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("novel_viewer_settings:tts:voice"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_tts\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        let voices = speechSynthesis.getVoices();
        for (let i = 0; i < voices.length; i++) {
            let voice = voices[i];
            info[info.length] = {
                'type': 'value',
                'title': voice["name"],
                'checked': isViewerSettingsValue("novelViewerTTSVoice", voice["name"]),
                'onclick': 'setViewerSettingsValue(\'novelViewerTTSVoice\', \'' + voice["name"] + '\');'
            }
        }
    }
    if (type == "novel_tts_rate") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("novel_viewer_settings:tts:rate"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_tts\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        let array = new Array(0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2);
        for (let i = 0; i < array.length; i++) {
            info[info.length] = {
                'type': 'value',
                'title': array[i],
                'checked': isViewerSettingsValue("novelViewerTTSRate", array[i]),
                'onclick': 'setViewerSettingsValue(\'novelViewerTTSRate\', ' + array[i] + ');'
            }
        }
    }
    if (type == "novel_tts_volume") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("novel_viewer_settings:tts:volume"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_tts\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        let array = new Array(10, 20, 30, 40, 50, 60, 70, 80, 90, 100);
        for (let i = 0; i < array.length; i++) {
            info[info.length] = {
                'type': 'value',
                'title': (array[i] + "%"),
                'checked': isViewerSettingsValue("novelViewerTTSVolume", array[i]),
                'onclick': 'setViewerSettingsValue(\'novelViewerTTSVolume\', ' + array[i] + ');'
            }
        }
    }
    if (type == "novel_page_view") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("novel_viewer_settings:page_count:title"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_main\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage('novel_viewer_settings:page_count:1'),
            'checked': isViewerSettingsValue("novelViewerPageCount", 1),
            'onclick': 'setPageCountNovelViewer(1);'
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage('novel_viewer_settings:page_count:2'),
            'checked': isViewerSettingsValue("novelViewerPageCount", 2),
            'onclick': 'setPageCountNovelViewer(2);'
        }
    }
    if (type == "novel_viewer_mode") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("novel_viewer_settings:viewer_mode:title"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_main\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage('novel_viewer_settings:viewer_mode:0'),
            'checked': isViewerSettingsValue("novelViewerMode", 0),
            'onclick': 'setViewerModeNovelViewer(0);'
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage('novel_viewer_settings:viewer_mode:1'),
            'checked': isViewerSettingsValue("novelViewerMode", 1),
            'onclick': 'setViewerModeNovelViewer(1);'
        }
    }
    if (type == "novel_language") {
        let partInfo = JSON.parse(contents.getElementsByClassName("part_info")[0].innerHTML);

        let selectedLanguage = partInfo["language"];
        let languages = new Array();
        languages[0] = partInfo["original_language"];
        let localizationLanguage = new Array();
        if (partInfo["localization_language"] != null) {
            localizationLanguage = partInfo["localization_language"].split(",");
        }
        for (let i = 0; i < localizationLanguage.length; i++) {
            languages[languages.length] = localizationLanguage[i];
        }

        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("novel_viewer_settings:language:title"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_main\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        if (loginStatus["isLogin"] == true) {
            //사용자 번역
            info[info.length] = {
                'type': 'menu',
                'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="a"><rect width="50" height="50"></rect></clipPath></defs><g id="b" clip-path="url(#a)"><g clip-path="url(#a)"><rect width="3" height="25" rx="1.5" transform="translate(0 25)"></rect><rect width="3" height="25" rx="1.5" transform="translate(47 25)"></rect><rect width="50" height="3" rx="1.5" transform="translate(0 47)"></rect><rect width="3" height="34" rx="1.5" transform="translate(27 35.5) rotate(180)"></rect><rect width="3" height="17.526" rx="1.5" transform="translate(37.928 12.393) rotate(135)"></rect><rect width="3" height="17" rx="1.5" transform="translate(15.193 14.142) rotate(-135)"></rect></g></g></svg>',
                'title': getLanguage('viewer_settings_user_translation:title'),
                'description': getLanguage("viewer_settings_user_translation:description"),
                'onclick': 'popupNovelViewerUserTranslation(' + menuNumber + '); hidePopupElement();'
            }
        }
        //생성된 번역
        for (let i = 0; i < languages.length; i++) {
            let onclick = 'loadMenu_viewer(' + partInfo["number"] + ', \'' + partInfo["type"] + '\', true, \'' + languages[i] + '\');';
            if (languages[i] == selectedLanguage) {
                onclick = 'backNovelViewerSettings(\'all_menu\');';
            }
            let title = getLanguage("language:" + languages[i]);
            if (userLanguage == languages[i]) {
                title = getLanguage("viewer_settings_user_language").replaceAll("{R:0}", title)
            }
            info[info.length] = {
                'type': 'value',
                'title': title,
                'checked': (languages[i] == selectedLanguage),
                'onclick': onclick
            }
        }
    }
    if (type == "novel_viewer") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("novel_viewer_settings:viewer_settings:title"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_main\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M23.709,37.886h0L0,24.772,23.71,12.207,49.543,24.772,23.71,37.886Zm.134-22.5L6.133,24.772l17.71,9.8,19.3-9.8Z" transform="translate(0.228 -11.772)"></path><g transform="translate(1.456)"><path d="M1.451-.035A1.6,1.6,0,0,1,3,1.543L3.434,25.3a1.466,1.466,0,0,1-1.488,1.521A1.6,1.6,0,0,1,.4,25.244L-.037,1.486A1.466,1.466,0,0,1,1.451-.035Z" transform="translate(-0.648 25.64) rotate(-60)"></path><path d="M2.639.067A1.466,1.466,0,0,1,4.127,1.588L3.689,25.347a1.6,1.6,0,0,1-1.545,1.578A1.466,1.466,0,0,1,.656,25.4L1.094,1.645A1.6,1.6,0,0,1,2.639.067Z" transform="translate(43.172 22.047) rotate(60)"></path></g><g transform="translate(1.456 11)"><path d="M1.451-.035A1.6,1.6,0,0,1,3,1.543L3.434,25.3a1.466,1.466,0,0,1-1.488,1.521A1.6,1.6,0,0,1,.4,25.244L-.037,1.486A1.466,1.466,0,0,1,1.451-.035Z" transform="translate(-0.648 25.64) rotate(-60)"></path><path d="M2.639.067A1.466,1.466,0,0,1,4.127,1.588L3.689,25.347a1.6,1.6,0,0,1-1.545,1.578A1.466,1.466,0,0,1,.656,25.4L1.094,1.645A1.6,1.6,0,0,1,2.639.067Z" transform="translate(43.172 22.047) rotate(60)"></path></g></g></svg>',
            'title': getLanguage("novel_viewer_settings:viewer_settings:show_work_info:title"),
            'description': getLanguage("novel_viewer_settings:viewer_settings:show_work_info:description"),
            'toggle': isViewerSettingsValue("isNovelViewerShowWorkInfo", "flex"),
            'onclick': `
                let name = 'isNovelViewerShowWorkInfo';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setViewerSettingsValue(name, 'none') : setViewerSettingsValue(name, null)
            `
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M46,50H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0H46a4,4,0,0,1,4,4V46A4.005,4.005,0,0,1,46,50ZM5,3A2,2,0,0,0,3,5V45a2,2,0,0,0,2,2H45a2,2,0,0,0,2-2V5a2,2,0,0,0-2-2Z"></path><rect width="3" height="25" rx="1.5" transform="translate(19.278 28.71) rotate(45)"></rect><rect width="3" height="14.85" rx="1.5" transform="translate(17.727 30.831) rotate(-45)"></rect><rect width="3" height="20.943" rx="1.5" transform="translate(37.002 21.694) rotate(30)"></rect><rect width="3" height="25" rx="1.5" transform="translate(35.451 23.194) rotate(-30)"></rect><path d="M8.5,17A8.5,8.5,0,1,1,17,8.5,8.51,8.51,0,0,1,8.5,17Zm0-14A5.5,5.5,0,1,0,14,8.5,5.506,5.506,0,0,0,8.5,3Z" transform="translate(10 8)"></path></g></svg>',
            'title': getLanguage("novel_viewer_settings:viewer_settings:show_image:title"),
            'description': getLanguage("novel_viewer_settings:viewer_settings:show_image:description"),
            'toggle': isViewerSettingsValue("isNovelViewerShowImage", "block"),
            'onclick': `
                let name = 'isNovelViewerShowImage';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setViewerSettingsValue(name, 'none') : setViewerSettingsValue(name, null)
            `
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M18 5h-16c-1.1 0-2 0.9-2 2v6c0 1.1 0.9 2 2 2h16c1.1 0 2-0.9 2-2v-6c0-1.1-0.9-2-2-2zM18 13h-16v-6h16v6zM7 8h-4v4h4v-4zM12 8h-4v4h4v-4z"></path></svg>',
            'title': getLanguage("viewer_settings:show_progress_bar:title"),
            'description': getLanguage("viewer_settings:show_progress_bar:description"),
            'toggle': isViewerSettingsValue("isNovelViewerShowProgressBar", "block"),
            'onclick': `
                let name = 'isNovelViewerShowProgressBar';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setViewerSettingsValue(name, 'none') : setViewerSettingsValue(name, null)
            `
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.016 12.984v-1.969h9.984v1.969h-9.984zM11.016 9v-2.016h9.984v2.016h-9.984zM3 3h18v2.016h-18v-2.016zM11.016 17.016v-2.016h9.984v2.016h-9.984zM3 8.016l3.984 3.984-3.984 3.984v-7.969zM3 21v-2.016h18v2.016h-18z"></path></svg>',
            'title': getLanguage("viewer_settings:text_indent:title"),
            'description': getLanguage("viewer_settings:text_indent:description"),
            'toggle': isViewerSettingsValue("isNovelViewerTextIndent", "var(--novel-viewer-font-size)"),
            'onclick': `
                let name = 'isNovelViewerTextIndent';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setViewerSettingsValue(name, null) : setViewerSettingsValue(name, 'var(--novel-viewer-font-size)')
            `
        }
        info[info.length] = {
            'type': 'line'
        }
        let value = getViewerSettingsValue("novelViewerBackgroundColor");
        if (value == "var(--pc-background-color)") {
            value = getLanguage("novel_viewer_settings:auto");
        } else {
            let isColor = false;
            for (let i = 0; i < novelBackgroundColor.length; i++) {
                let color = novelBackgroundColor[i];
                if (color == value) {
                    isColor = true;
                    break;
                }
            }
            if (isColor == false) {
                value = getLanguage("novel_viewer_settings:custom");
            }
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 20.016h24v3.984h-24v-3.984zM18.984 11.484q2.016 2.203 2.016 3.516 0 0.797-0.609 1.406t-1.406 0.609-1.383-0.609-0.586-1.406q0-0.563 0.492-1.453t0.961-1.453zM5.203 9.984h9.609l-4.828-4.781zM16.547 8.953q0.469 0.469 0.469 1.078t-0.469 1.031l-5.484 5.484q-0.469 0.469-1.078 0.469-0.563 0-1.031-0.469l-5.531-5.484q-0.422-0.422-0.422-1.078 0-0.609 0.422-1.031l5.156-5.156-2.391-2.391 1.453-1.406z"></path></svg>',
            'title': getLanguage("novel_viewer_settings:viewer_settings:background_color"),
            'value': value,
            'color': 'var(--novel-viewer-background-color)',
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_viewer_background_color\');'
        }
        value = getViewerSettingsValue("novelViewerTextColor");
        if (value == "var(--color1)") {
            value = getLanguage("novel_viewer_settings:auto");
        } else {
            let isColor = false;
            for (let i = 0; i < novelTextColor.length; i++) {
                let color = novelTextColor[i];
                if (color == value) {
                    isColor = true;
                    break;
                }
            }
            if (isColor == false) {
                value = getLanguage("novel_viewer_settings:custom");
            }
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.609 12h4.781l-2.391-6.328zM11.016 3h1.969l5.484 14.016h-2.25l-1.078-3h-6.281l-1.125 3h-2.25zM0 20.016h24v3.984h-24v-3.984z"></path></svg>',
            'title': getLanguage("novel_viewer_settings:viewer_settings:color"),
            'value': value,
            'color': 'var(--novel-viewer-text-color)',
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_viewer_text_color\');'
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 28"><path d="M11.328 8.734l-2.656 7.031c1.547 0.016 3.094 0.063 4.641 0.063 0.297 0 0.594-0.016 0.891-0.031-0.812-2.375-1.766-4.797-2.875-7.063zM0 26l0.031-1.234c1.469-0.453 3.063-0.141 3.719-1.828l3.703-9.625 4.375-11.312h2c0.063 0.109 0.125 0.219 0.172 0.328l3.203 7.5c1.172 2.766 2.25 5.563 3.437 8.313 0.703 1.625 1.25 3.297 2.031 4.891 0.109 0.25 0.328 0.719 0.547 0.891 0.516 0.406 1.953 0.5 2.688 0.781 0.047 0.297 0.094 0.594 0.094 0.891 0 0.141-0.016 0.266-0.016 0.406-1.984 0-3.969-0.25-5.953-0.25-2.047 0-4.094 0.172-6.141 0.234 0-0.406 0.016-0.812 0.063-1.219l2.047-0.438c0.422-0.094 1.25-0.203 1.25-0.781 0-0.562-2.016-5.203-2.266-5.844l-7.031-0.031c-0.406 0.906-1.984 5-1.984 5.594 0 1.203 2.297 1.25 3.187 1.375 0.016 0.297 0.016 0.594 0.016 0.906 0 0.141-0.016 0.281-0.031 0.422-1.813 0-3.641-0.313-5.453-0.313-0.219 0-0.531 0.094-0.75 0.125-0.984 0.172-1.953 0.219-2.938 0.219z"></path></svg>',
            'title': getLanguage("novel_viewer_settings:viewer_settings:font"),
            'value': getViewerSettingsValue("novelViewerFont"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_viewer_font\');'
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M16 9v8h-2v-8h-4v-2h10v2h-4zM8 5v12h-2v-12h-6v-2h15v2h-7z"></path></svg>',
            'title': getLanguage("novel_viewer_settings:viewer_settings:font_size"),
            'value': getViewerSettingsValue("novelViewerFontSize"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_viewer_font_size\');'
        }
        let fontWeight = getViewerSettingsValue("novelViewerFontWeight");
        (fontWeight == "bold") ? fontWeight = getLanguage("novel_viewer_settings:viewer_settings:font_weight_bold") : null;
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg style = "transform: scale(0.9);" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M15 5l-1.284-1.284-3.29 3.29-1.432-1.432 3.29-3.29-1.284-1.284c0-0.552 0.447-1 1-1h3c0.553 0 1 0.448 1 1v3c0 0.553-0.447 1-1 1zM5 15c0 0.553-0.447 1-1 1h-3c-0.553 0-1-0.447-1-1v-3c0-0.553 0.447-1 1-1l1.284 1.284 3.29-3.29 1.432 1.432-3.29 3.291 1.284 1.283z"></path></svg>',
            'title': getLanguage("novel_viewer_settings:viewer_settings:font_weight"),
            'value': fontWeight,
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_viewer_font_weight\');'
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg style = "transform: scale(1.05);" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.984 12.984v-1.969h12v1.969h-12zM9.984 18.984v-1.969h12v1.969h-12zM9.984 5.016h12v1.969h-12v-1.969zM6 6.984v10.031h2.484l-3.469 3.469-3.516-3.469h2.484v-10.031h-2.484l3.516-3.469 3.469 3.469h-2.484z"></path></svg>',
            'title': getLanguage("novel_viewer_settings:viewer_settings:line_spacing"),
            'value': getViewerSettingsValue("novelViewerLineSpacing"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_viewer_line_spacing\');'
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 3h18v2.016h-18v-2.016zM3 21v-2.016h18v2.016h-18zM3 12.984v-1.969h18v1.969h-18zM15 6.984v2.016h-12v-2.016h12zM15 15v2.016h-12v-2.016h12z"></path></svg>',
            'title': getLanguage("novel_viewer_settings:viewer_settings:text_align"),
            'value': getLanguage("novel_viewer_settings:viewer_settings:text_align:" + getViewerSettingsValue("novelViewerTextAlign")),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_viewer_text_align\');'
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg style = "transform: scale(1.15);" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.016 11.016q1.641 0 2.813 1.172t1.172 2.813-1.172 2.813-2.813 1.172h-2.016v2.016l-3-3 3-3v2.016h2.25q0.797 0 1.406-0.609t0.609-1.406-0.609-1.406-1.406-0.609h-13.266v-1.969h13.031zM20.016 5.016v1.969h-16.031v-1.969h16.031zM3.984 18.984v-1.969h6v1.969h-6z"></path></svg>',
            'title': getLanguage("novel_viewer_settings:viewer_settings:word_break"),
            'value': getLanguage("novel_viewer_settings:viewer_settings:word_break:" + getViewerSettingsValue("novelViewerWordBreak")),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_viewer_word_break\');'
        }
    }
    if (type == "novel_viewer_background_color") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("novel_viewer_settings:viewer_settings:background_color"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_viewer\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("novel_viewer_settings:auto"),
            'color': 'var(--pc-background-color)',
            'checked': isViewerSettingsValue('novelViewerBackgroundColor', 'var(--pc-background-color)'),
            'onclick': 'setViewerSettingsValue(\'novelViewerBackgroundColor\', null);'
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("novel_viewer_settings:custom"),
            'color': 'var(--novel-viewer-background-color)',
            'checked': false,
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_viewer_background_color_custom\'); //'
        }
        for (let i = 0; i < novelBackgroundColor.length; i++) {
            let color = novelBackgroundColor[i];
            info[info.length] = {
                'type': 'value',
                'title': color,
                'color': color,
                'checked': isViewerSettingsValue('novelViewerBackgroundColor', color),
                'onclick': 'setViewerSettingsValue(\'novelViewerBackgroundColor\', \'' + color + '\');'
            }
        }
        let isChecked = false;
        for (let i = 0; i < info.length; i++) {
            if (info[i]["checked"] == true) {
                isChecked = true;
                break;
            }
        }
        if (isChecked == false) {
            info[3]["checked"] = true;
        }
    }
    if (type == "novel_viewer_background_color_custom") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("novel_viewer_settings:custom"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_viewer_background_color\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        
        let style = document.documentElement.style;
        style = style.getPropertyValue("--novel-viewer-background-color");
        if (style == "var(--pc-background-color)") {
            let rootStyles = window.getComputedStyle(document.documentElement);
            style = rootStyles.getPropertyValue("--pc-background-color");
        }

        info[info.length] = {
            'type': 'colorPicker',
            'color': style,
            'oncolorpicker': 'setViewerSettingsValue(\'novelViewerBackgroundColor\', this);'
        }
    }
    if (type == "novel_viewer_text_color") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("novel_viewer_settings:viewer_settings:color"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_viewer\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("novel_viewer_settings:auto"),
            'color': 'var(--color1)',
            'checked': isViewerSettingsValue('novelViewerTextColor', 'var(--color1)'),
            'onclick': 'setViewerSettingsValue(\'novelViewerTextColor\', null);'
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("novel_viewer_settings:custom"),
            'color': 'var(--novel-viewer-text-color)',
            'checked': false,
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_viewer_text_color_custom\'); //'
        }
        for (let i = 0; i < novelTextColor.length; i++) {
            let color = novelTextColor[i];
            info[info.length] = {
                'type': 'value',
                'title': color,
                'color': color,
                'checked': isViewerSettingsValue('novelViewerTextColor', color),
                'onclick': 'setViewerSettingsValue(\'novelViewerTextColor\', \'' + color + '\');'
            }
        }
        let isChecked = false;
        for (let i = 0; i < info.length; i++) {
            if (info[i]["checked"] == true) {
                isChecked = true;
                break;
            }
        }
        if (isChecked == false) {
            info[3]["checked"] = true;
        }
    }
    if (type == "novel_viewer_text_color_custom") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("novel_viewer_settings:custom"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_viewer_text_color\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        
        let style = document.documentElement.style;
        style = style.getPropertyValue("--novel-viewer-text-color");
        if (style == "var(--color1)") {
            let rootStyles = window.getComputedStyle(document.documentElement);
            style = rootStyles.getPropertyValue("--color1");
        }

        info[info.length] = {
            'type': 'colorPicker',
            'color': style,
            'oncolorpicker': 'setViewerSettingsValue(\'novelViewerTextColor\', this);'
        }
    }
    if (type == "novel_viewer_font") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("novel_viewer_settings:viewer_settings:font"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_viewer\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        let valueList = new Array(
            'Pretendard', 'Spoqa Han Sans Neo'
        );
        for (let i = 0; i < valueList.length; i++) {
            let value = valueList[i];
            if (value == "Pretendard") {
                value = null;
            }
            info[info.length] = {
                'type': 'value',
                'title': valueList[i],
                'checked': isViewerSettingsValue("novelViewerFont", valueList[i]),
                'onclick': 'setViewerSettingsValue(\'novelViewerFont\', \'' + value + '\');'
            }
        }
        info[info.length] = {
            'type': 'line'
        }
        let font = getFileContentNovelViewerCustomFont();
        for (let i = 0; i < font.length; i++) {
            info[info.length] = {
                'type': 'value',
                'title': font[i]["name"],
                'description': capacityUnit(font[i]["size"]),
                'checked': isViewerSettingsValue("novelViewerFont", font[i]["name"]),
                'onclick': 'setViewerSettingsValue(\'novelViewerFont\', \'' + font[i]["name"] + '\');',
                'oncontextmenu': 'removeCustomFontNovelViewerMoreButton(\'' + font[i]["name"] + '\', event);'
            }
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="a"><rect width="50" height="50"></rect></clipPath></defs><g id="b" clip-path="url(#a)"><g clip-path="url(#a)"><rect width="3" height="25" rx="1.5" transform="translate(0 25)"></rect><rect width="3" height="25" rx="1.5" transform="translate(47 25)"></rect><rect width="50" height="3" rx="1.5" transform="translate(0 47)"></rect><rect width="3" height="34" rx="1.5" transform="translate(27 35.5) rotate(180)"></rect><rect width="3" height="17.526" rx="1.5" transform="translate(37.928 12.393) rotate(135)"></rect><rect width="3" height="17" rx="1.5" transform="translate(15.193 14.142) rotate(-135)"></rect></g></g></svg>',
            'title': getLanguage("novel_viewer_settings:viewer_settings:custom_font_upload:title"),
            'description': getLanguage("novel_viewer_settings:viewer_settings:custom_font_upload:description"),
            'onclick': 'novelViewerUploadCustomFont();'
        }
    }
    if (type == "novel_viewer_font_size") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("novel_viewer_settings:viewer_settings:font_size"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_viewer\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        let valueList = new Array(
            8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 30
        );
        for (let i = 0; i < valueList.length; i++) {
            let value = (valueList[i] + "px");
            info[info.length] = {
                'type': 'value',
                'title': value,
                'checked': isViewerSettingsValue("novelViewerFontSize", value),
                'onclick': "setViewerSettingsValue('novelViewerFontSize', '" + value + "');"
            }
        }
    }
    if (type == "novel_viewer_font_weight") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("novel_viewer_settings:viewer_settings:font_weight"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_viewer\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        let valueList = new Array(
            100, 200, 300, 400, 500, 600, 700, 800, 900
        );
        for (let i = 0; i < valueList.length; i++) {
            info[info.length] = {
                'type': 'value',
                'title': valueList[i],
                'checked': isViewerSettingsValue("novelViewerFontWeight", valueList[i]),
                'onclick': "setViewerSettingsValue('novelViewerFontWeight', " + valueList[i] + ");"
            }
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("novel_viewer_settings:viewer_settings:font_weight_bold"),
            'checked': isViewerSettingsValue("novelViewerFontWeight", "bold"),
            'onclick': "setViewerSettingsValue('novelViewerFontWeight', 'bold');"
        }
    }
    if (type == "novel_viewer_line_spacing") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("novel_viewer_settings:viewer_settings:line_spacing"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_viewer\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        let valueList = new Array(
            1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0
        );
        for (let i = 0; i < valueList.length; i++) {
            info[info.length] = {
                'type': 'value',
                'title': valueList[i],
                'checked': isViewerSettingsValue("novelViewerLineSpacing", valueList[i]),
                'onclick': "setViewerSettingsValue('novelViewerLineSpacing', " + valueList[i] + ");"
            }
        }
    }
    if (type == "novel_viewer_text_align") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("novel_viewer_settings:viewer_settings:text_align"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_viewer\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        let valueList = new Array(
            'justify', 'left', 'center', 'right'
        );
        for (let i = 0; i < valueList.length; i++) {
            info[info.length] = {
                'type': 'value',
                'title': getLanguage('novel_viewer_settings:viewer_settings:text_align:' + valueList[i]),
                'checked': isViewerSettingsValue("novelViewerTextAlign", valueList[i]),
                'onclick': "setViewerSettingsValue('novelViewerTextAlign', '" + valueList[i] + "');"
            }
        }
    }
    if (type == "novel_viewer_word_break") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("novel_viewer_settings:viewer_settings:word_break"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'novel_viewer\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        let valueList = new Array(
            'break-all', 'keep-all'
        );
        for (let i = 0; i < valueList.length; i++) {
            info[info.length] = {
                'type': 'value',
                'title': getLanguage('novel_viewer_settings:viewer_settings:word_break:' + valueList[i]),
                'checked': isViewerSettingsValue("novelViewerWordBreak", valueList[i]),
                'onclick': "setViewerSettingsValue('novelViewerWordBreak', '" + valueList[i] + "');"
            }
        }
    }































    if (type == "image_format_main") {
        let partInfo = JSON.parse(contents.getElementsByClassName("part_info")[0].innerHTML);
        let lines = partInfo["data"]["lines"];
        let selectedLanguage = partInfo["language"];

        //품질
        let qualityInfo = getQualityInfo();
        let nameList = qualityInfo["name"];
        let sizeList = qualityInfo["size"];

        let maxSettingsQuality = getMaxSettingsQualityImageFormat(lines);
        minQuality = maxSettingsQuality["minQuality"];
        constantQuality = maxSettingsQuality["constantQuality"];

        let imageSize = null;
        let quality = getViewerSettingsValue("imageFormatViewerQuality");
        for (let i = 0; i < nameList.length; i++) {
            if (sizeList[i] <= minQuality) {
                (quality == sizeList[i]) ? imageSize = nameList[i] : null;
            } else {
                break;
            }
        }
        if (imageSize == true) {
            info[info.length - 1]["checked"] = true;
        }

        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M18 5h-16c-1.1 0-2 0.9-2 2v6c0 1.1 0.9 2 2 2h16c1.1 0 2-0.9 2-2v-6c0-1.1-0.9-2-2-2zM18 13h-16v-6h16v6zM7 8h-4v4h4v-4zM12 8h-4v4h4v-4z"></path></svg>',
            'title': getLanguage("viewer_settings:show_progress_bar:title"),
            'description': getLanguage("viewer_settings:show_progress_bar:description"),
            'toggle': isViewerSettingsValue("isImageFormatShowProgressBar", "block"),
            'onclick': `
                let name = 'isImageFormatShowProgressBar';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setViewerSettingsValue(name, 'none') : setViewerSettingsValue(name, null)
            `
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M27.555 8.42c-1.355 1.647-5.070 6.195-8.021 9.81l-3.747-3.804c3.389-3.016 7.584-6.744 9.1-8.079 2.697-2.377 5.062-3.791 5.576-3.213 0.322 0.32-0.533 2.396-2.908 5.286zM18.879 19.030c-1.143 1.399-2.127 2.604-2.729 3.343l-4.436-4.323c0.719-0.64 1.916-1.705 3.304-2.939l3.861 3.919zM15.489 23.183v-0.012c-2.575 9.88-14.018 4.2-14.018 4.2s4.801 0.605 4.801-3.873c0-4.341 4.412-4.733 4.683-4.753l4.543 4.427c0 0.001-0.009 0.011-0.009 0.011z"></path></svg>',
            'title': getLanguage('image_format_viewer_settings:quality:title'),
            'description': getLanguage('image_format_viewer_settings:quality:description'),
            'value': imageSize,
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'image_format_quality\');'
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 16h-8c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-10c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h16c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v10c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293zM11 18v2h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1h8c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3v-2h7c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-10c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-16c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v10c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879z"></path></svg>',
            'title': getLanguage('image_format_viewer_settings:viewer_mode:title'),
            'description': getLanguage('image_format_viewer_settings:viewer_mode:description'),
            'value': getLanguage("image_format_viewer_settings_viewer_mode:" + getViewerSettingsValue("imageFormatViewerMode")),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'image_format_viewer_mode\');'
        }
        //스크롤 모드 및 만화 모드
        let items_wrap = contents.getElementsByClassName("image_format_viewer_items_wrap")[0];
        if (items_wrap.classList.contains("image_format_viewer_manga_mode")) {
            info[info.length] = {
                'type': 'menu',
                'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 18.984h9.984l-3.188-4.266-2.484 3.234-1.828-2.156zM0.984 11.016h14.016v9.984h-12q-0.797 0-1.406-0.609t-0.609-1.406v-7.969zM5.016 3h1.969v2.016h-1.969v-2.016zM9 3h2.016v2.016h-2.016v-2.016zM3 3v2.016h-2.016q0-0.75 0.633-1.383t1.383-0.633zM17.016 18.984h1.969v2.016h-1.969v-2.016zM17.016 3h1.969v2.016h-1.969v-2.016zM0.984 6.984h2.016v2.016h-2.016v-2.016zM21 3q0.75 0 1.383 0.633t0.633 1.383h-2.016v-2.016zM21 6.984h2.016v2.016h-2.016v-2.016zM12.984 3h2.016v2.016h-2.016v-2.016zM23.016 18.984q0 0.75-0.633 1.383t-1.383 0.633v-2.016h2.016zM21 11.016h2.016v1.969h-2.016v-1.969zM21 15h2.016v2.016h-2.016v-2.016z"></path></svg>',
                'title': getLanguage('image_format_viewer_settings:image_count:title'),
                'description': getLanguage('image_format_viewer_settings:image_count:description'),
                'value': getLanguage("image_format_viewer_settings_image_count:" + getViewerSettingsValue("imageFormatViewerImageCount")),
                'onclick': 'viewerMoveSettings(' + menuNumber + ', \'image_format_image_count\');'
            }
            info[info.length] = {
                'type': 'menu',
                'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.625 3.219c-0.17-0.136-0.388-0.219-0.625-0.219-0.552 0-1 0.448-1 1v16c-0.001 0.218 0.071 0.439 0.219 0.625 0.345 0.431 0.974 0.501 1.406 0.156l10-8c0.053-0.042 0.108-0.095 0.156-0.156 0.345-0.431 0.275-1.061-0.156-1.406zM6 6.081l7.399 5.919-7.399 5.919zM18 5v14c0 0.552 0.448 1 1 1s1-0.448 1-1v-14c0-0.552-0.448-1-1-1s-1 0.448-1 1z"></path></svg>',
                'title': getLanguage('image_format_viewer_settings:auto_page_move:title'),
                'description': getLanguage('image_format_viewer_settings:auto_page_move:description'),
                'toggle': isViewerSettingsValue("isImageFormatViewerAutoPageMove", true),
                'onclick': `
                    let name = 'isImageFormatViewerAutoPageMove';
                    let toggle = this.getAttribute('toggle');
                    (toggle == true || toggle == 'true') ? setViewerSettingsValue(name, false) : setViewerSettingsValue(name, true)
                `
            }
        } else {
            info[info.length] = {
                'type': 'menu',
                'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.984 17.016h16.031v1.969h-4.031v4.031h-1.969v-4.031h-10.031q-0.797 0-1.383-0.586t-0.586-1.383v-10.031h-4.031v-1.969h4.031v-4.031h1.969v16.031zM17.016 15v-8.016h-8.016v-1.969h8.016q0.797 0 1.383 0.586t0.586 1.383v8.016h-1.969z"></path></svg>',
                'title': getLanguage('image_format_viewer_settings:resize:title'),
                'description': getLanguage('image_format_viewer_settings:resize:description'),
                'value': getViewerSettingsValue("imageFormatViewerResize"),
                'onclick': 'viewerMoveSettings(' + menuNumber + ', \'image_format_resize\');'
            }
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19.753 10.909c-0.624-1.707-2.366-2.726-4.661-2.726-0.090 0-0.176 0.002-0.262 0.006l-0.016-2.063c0 0 3.41-0.588 3.525-0.607s0.133-0.119 0.109-0.231c-0.023-0.111-0.167-0.883-0.188-0.976-0.027-0.131-0.102-0.127-0.207-0.109s-3.25 0.461-3.25 0.461-0.012-1.953-0.013-2.078c-0.001-0.125-0.069-0.158-0.194-0.156s-0.92 0.014-1.025 0.016c-0.105 0.002-0.164 0.049-0.162 0.148s0.033 2.307 0.033 2.307-3.061 0.527-3.144 0.543c-0.084 0.014-0.17 0.053-0.151 0.143s0.19 1.094 0.208 1.172c0.018 0.080 0.072 0.129 0.188 0.107 0.115-0.019 2.924-0.504 2.924-0.504l0.035 2.018c-1.077 0.281-1.801 0.824-2.256 1.303-0.768 0.807-1.207 1.887-1.207 2.963 0 1.586 0.971 2.529 2.328 2.695 3.162 0.387 5.119-3.060 5.769-4.715 1.097 1.506 0.256 4.354-2.094 5.98-0.043 0.029-0.098 0.129-0.033 0.207s0.541 0.662 0.619 0.756c0.080 0.096 0.206 0.059 0.256 0.023 2.51-1.73 3.661-4.515 2.869-6.683zM12.367 14.097c-0.966-0.121-0.944-0.914-0.944-1.453 0-0.773 0.327-1.58 0.876-2.156 0.335-0.354 0.75-0.621 1.229-0.799l0.082 4.277c-0.385 0.131-0.799 0.185-1.243 0.131zM14.794 13.544l0.046-4.109c0.084-0.004 0.166-0.010 0.252-0.010 0.773 0 1.494 0.145 1.885 0.361s-1.023 2.713-2.183 3.758zM5.844 5.876c-0.030-0.094-0.103-0.145-0.196-0.145h-1.95c-0.093 0-0.165 0.051-0.194 0.144-0.412 1.299-3.48 10.99-3.496 11.041s-0.011 0.076 0.062 0.076h1.733c0.075 0 0.099-0.023 0.114-0.072 0.015-0.051 1.008-3.318 1.008-3.318h3.496c0 0 0.992 3.268 1.008 3.318s0.039 0.072 0.113 0.072h1.734c0.072 0 0.078-0.025 0.062-0.076-0.014-0.050-3.083-9.741-3.494-11.040zM3.226 12.194l1.447-5.25 1.447 5.25h-2.894z"></path></svg>',
            'title': getLanguage('image_format_viewer_settings:language:title'),
            'description': getLanguage('image_format_viewer_settings:language:description'),
            'value': getLanguage("language:" + selectedLanguage),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'image_format_language\');'
        }
    }
    if (type == "image_format_quality") {
        let lines = JSON.parse(contents.getElementsByClassName("part_info")[0].innerHTML)["data"]["lines"];

        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("image_format_viewer_settings:quality:title"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'image_format_main\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }

        let qualityInfo = getQualityInfo();
        let nameList = qualityInfo["name"];
        let sizeList = qualityInfo["size"];

        let maxSettingsQuality = getMaxSettingsQualityImageFormat(lines);
        minQuality = maxSettingsQuality["minQuality"];
        constantQuality = maxSettingsQuality["constantQuality"];

        for (let i = 0; i < nameList.length; i++) {
            if (sizeList[i] <= minQuality) {
                info[info.length] = {
                    'type': 'value',
                    'title': nameList[i],
                    'description': capacityUnit(getSizeQualityImageFormat(lines, sizeList[i])),
                    'checked': isViewerSettingsValue("imageFormatViewerQuality", sizeList[i]),
                    'onclick': 'setQualityImageFormatViewer(' + sizeList[i] + ');'
                }
            } else {
                break;
            }
        }

        let unchecked = true;
        for (let i = 0; i < info.length; i++) {
            if (info[i]["type"] == "value" && info[i]["checked"] == true) {
                unchecked = false;
            }
        }

        if (unchecked == true) {
            info[info.length - 1]["checked"] = true;
        }
    }
    if (type == "image_format_viewer_mode") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("image_format_viewer_settings:viewer_mode:title"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'image_format_main\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("image_format_viewer_settings_viewer_mode:auto"),
            'checked': isViewerSettingsValue("imageFormatViewerMode", 'auto'),
            'onclick': 'setViewerModeImageFormatViewer(\'auto\');'
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("image_format_viewer_settings_viewer_mode:0"),
            'checked': isViewerSettingsValue("imageFormatViewerMode", 0),
            'onclick': 'setViewerModeImageFormatViewer(0);'
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("image_format_viewer_settings_viewer_mode:1"),
            'checked': isViewerSettingsValue("imageFormatViewerMode", 1),
            'onclick': 'setViewerModeImageFormatViewer(1);'
        }
    }
    if (type == "image_format_image_count") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("image_format_viewer_settings:image_count:title"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'image_format_main\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("image_format_viewer_settings_image_count:1"),
            'checked': isViewerSettingsValue("imageFormatViewerImageCount", 1),
            'onclick': 'setImageCountImageFormatViewer(1);'
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("image_format_viewer_settings_image_count:2"),
            'checked': isViewerSettingsValue("imageFormatViewerImageCount", 2),
            'onclick': 'setImageCountImageFormatViewer(2);'
        }
    }
    if (type == "image_format_resize") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("image_format_viewer_settings:resize:title"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'image_format_main\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        let array = new Array(300, 400, 500, 600, 700, 800, 900, 1000);
        for (let i = 0; i < array.length; i++) {
            let value = (array[i] + "px");
            info[info.length] = {
                'type': 'value',
                'title': value,
                'checked': isViewerSettingsValue("imageFormatViewerResize", value),
                'onclick': 'setResizeImageFormatViewer(\'' + value + '\');'
            }
        }
    }
    if (type == "image_format_language") {
        let partInfo = JSON.parse(contents.getElementsByClassName("part_info")[0].innerHTML);

        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("image_format_viewer_settings:language:title"),
            'onclick': 'viewerMoveSettings(' + menuNumber + ', \'image_format_main\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }

        let selectedLanguage = partInfo["language"];
        let languages = new Array();
        languages[0] = partInfo["original_language"];
        let localizationLanguage = new Array();
        if (partInfo["localization_language"] != null) {
            localizationLanguage = partInfo["localization_language"].split(",");
        }
        for (let i = 0; i < localizationLanguage.length; i++) {
            languages[languages.length] = localizationLanguage[i];
        }
        if (loginStatus["isLogin"] == true) {
            //사용자 번역
            info[info.length] = {
                'type': 'menu',
                'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="a"><rect width="50" height="50"></rect></clipPath></defs><g id="b" clip-path="url(#a)"><g clip-path="url(#a)"><rect width="3" height="25" rx="1.5" transform="translate(0 25)"></rect><rect width="3" height="25" rx="1.5" transform="translate(47 25)"></rect><rect width="50" height="3" rx="1.5" transform="translate(0 47)"></rect><rect width="3" height="34" rx="1.5" transform="translate(27 35.5) rotate(180)"></rect><rect width="3" height="17.526" rx="1.5" transform="translate(37.928 12.393) rotate(135)"></rect><rect width="3" height="17" rx="1.5" transform="translate(15.193 14.142) rotate(-135)"></rect></g></g></svg>',
                'title': getLanguage('viewer_settings_user_translation:title'),
                'description': getLanguage("viewer_settings_user_translation:description"),
                'onclick': 'popupImageFormatViewerUserTranslation(' + menuNumber + '); hidePopupElement();'
            }
        }
        //생성된 번역
        for (let i = 0; i < languages.length; i++) {
            let onclick = 'loadMenu_viewer(' + partInfo["number"] + ', \'' + partInfo["type"] + '\', true, \'' + languages[i] + '\');';
            (languages[i] == selectedLanguage) ? onclick = '' : null;
            let title = getLanguage("language:" + languages[i]);
            if (userLanguage == languages[i]) {
                title = getLanguage("viewer_settings_user_language").replaceAll("{R:0}", title)
            }
            info[info.length] = {
                'type': 'value',
                'title': title,
                'checked': (languages[i] == selectedLanguage),
                'onclick': onclick
            }
        }
    }































    newEl.innerHTML = getViewerSettingsHtml(menuNumber, info);
    return newEl;
}

function getViewerSettingsHtml(menuNumber, info) {
    let html = "";

    let isTopBttomPadding = false;
    for (let i = 0; i < info.length; i++) {
        let type = info[i]["type"];

        //위, 아래 공백 여부
        if (type == "menu" || type == "value" || type == "colorPicker") {
            if (isTopBttomPadding == false) {
                isTopBttomPadding = true;
                html += `<div class = "popup_element_viewer_settings_top_bottom_padding">`;
            }
        } else {
            isTopBttomPadding = false;
            html += `</div>`;
        }

        if (type == "menu") {
            let onclick = info[i]["onclick"];
            let right = "...";
            let description = "";

            //색깔
            let color = "";
            if (info[i]["color"] != null) {
                color = `
                    <div style = "background-color: ` + info[i]["color"] + `;" class = "popup_element_viewer_settings_menu_color"></div>
                `;
            }

            (info[i]["value"] == null) ? info[i]["value"] = "" : null;
            if (info[i]["value"] != null) {
                right = `
                    <div class = "popup_element_viewer_settings_menu_value">
                        ` + info[i]["value"] + `
                        ` + color + `
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.25 10l-7.141-7.42c-0.268-0.27-0.268-0.707 0-0.979 0.268-0.27 0.701-0.27 0.969 0l7.83 7.908c0.268 0.271 0.268 0.709 0 0.979l-7.83 7.908c-0.268 0.271-0.701 0.27-0.969 0s-0.268-0.707 0-0.979l7.141-7.417z"></path></svg>
                    </div>
                `;
            }
            let isToggle = false;
            if (info[i]["toggle"] != null) {
                right = `
                    <div class = "popup_element_viewer_settings_menu_toggle">
                        <div class = "popup_element_viewer_settings_menu_toggle_circle"></div>
                    </div>
                `;
                isToggle = info[i]["toggle"];

                onclick += `
                    let isToggle = this.getAttribute('toggle');
                    if (isToggle == 'true' || isToggle == true) {
                        this.setAttribute('toggle', false);
                    } else {
                        this.setAttribute('toggle', true);
                    }
                `;
            }

            //설명
            if (info[i]["description"] != null) {
                description = `
                    <div class = "popup_element_viewer_settings_menu_center_description">
                        ` + info[i]["description"] + `
                    </div>
                `;
            }

            html += `
                <div class = "popup_element_viewer_settings_menu md-ripples" onclick = "` + onclick + `" toggle = "` + isToggle + `">
                    <div class = "popup_element_viewer_settings_menu_icon">
                        ` + info[i]["icon"] + `
                    </div>
                    <div class = "popup_element_viewer_settings_menu_center">
                        <div class = "popup_element_viewer_settings_menu_center_title">
                            ` + info[i]["title"] + `
                        </div>
                        ` + description + `
                    </div>
                    ` + right + `
                </div>
            `;
        }
        //뒤로가기
        if (type == "goBack") {
            html += `
                <div class = "popup_element_viewer_settings_go_back">
                    <div class = "popup_element_viewer_settings_go_back_button md-ripples" onclick = "` + info[i]["onclick"] + `">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"></rect><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"></rect></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"></rect></g></svg>
                    </div>
                    <div class = "popup_element_viewer_settings_go_back_title">
                        ` + info[i]["title"] + `
                    </div>
                </div>
            `;
        }
        //값 선택
        if (type == "value") {
            let onclick = info[i]["onclick"];
            onclick += ` viewerSettingsValueChecked(` + menuNumber + `, this);`;

            let checked = info[i]["checked"];
            (checked == null) ? checked = false : null;

            let disabled = info[i]["disabled"];
            (disabled == null) ? disabled = false : null;

            //설명
            let description = "";
            if (info[i]["description"] != null) {
                description = `
                    <div class = "popup_element_viewer_settings_value_right_description">
                        ` + info[i]["description"] + `
                    </div>
                `;
            }

            //색깔
            let color = "";
            if (info[i]["color"] != null) {
                color = `
                    <div style = "background-color: ` + info[i]["color"] + `;" class = "popup_element_viewer_settings_value_color"></div>
                `;
            }

            html += `
                <div class = "popup_element_viewer_settings_value md-ripples" checked = "` + checked + `" disabled = "` + disabled + `" onclick = "` + onclick + `" oncontextmenu = "` + info[i]["oncontextmenu"] + `">
                    <div class = "popup_element_viewer_settings_value_icon">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                    </div>
                    <div class = "popup_element_viewer_settings_value_right">
                        <div class = "popup_element_viewer_settings_value_right_title">
                            ` + info[i]["title"] + `
                        </div>
                        ` + description + `
                    </div>
                    ` + color + `
                </div>
            `;
        }
        //컬러 픽커
        if (type == "colorPicker") {
            let color = info[i]["color"];
            let position = getPositionInfoColorPickerViewerSettings(color);

            html += `
                <div class = "popup_element_viewer_settings_color_picker" oncolorpicker = "` + info[i]["oncolorpicker"] + `">
                    <div class = "popup_element_viewer_settings_color_picker_box">
                        <div class = "popup_element_viewer_settings_color_picker_box_picker"><div></div></div>
                        <canvas onpointerdown = "pointerDownColorPickerViewerSettings(event);"></canvas>
                    </div>
                    <div class = "popup_element_viewer_settings_color_picker_select">
                        <div class = "popup_element_viewer_settings_color_picker_select_picker"><div></div></div>
                        <canvas onpointerdown = "pointerDownRainbowColorViewerSettings(event);"></canvas>
                    </div>
                    <div class = "popup_element_viewer_settings_color_picker_input">
                        <input maxlength = "7" type = "text" value = "` + color + `" placeholder = "HEX" onkeydown = "checkInputColorPickerViewerSettings();"> 
                    </div>
                </div>
            `;

            function callback() {
                setPositionColorPickerViewerSettings(position["x"], position["y"], position["percent"]);
            }
            window.requestAnimationFrame(callback);
        }
        if (type == "line") {
            html += `<div class = "popup_element_viewer_settings_line"></div>`;
        }
    }
    if (isTopBttomPadding == true) {
        html += `</div>`;
    }

    html += `<div style = "width: 280px;"></div>`;
    return html;
}

function getPositionInfoColorPickerViewerSettings(hex) {
    hex = hex.replace('#', '');

    //X 구하기
    function getSaturation(hex) {
        // HEX 색상 코드에서 RGB 색상 값을 추출
        let r = parseInt(hex.substring(0,2), 16);
        let g = parseInt(hex.substring(2,4), 16);
        let b = parseInt(hex.substring(4,6), 16);
        let red = r / 255;
        let green = g / 255;
        let blue = b / 255;
        let max = Math.max(red, green, blue);
        let min = Math.min(red, green, blue);
        let saturation = 0;
        if (max !== 0) {
            saturation = (max - min) / max;
        }
        return saturation;
    }
    let x = getSaturation(hex);

    //Y 구하기
    function getWhiteRatio(hex) {
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        let whiteRatio = (Math.max(r, g, b) / 255);
        return whiteRatio;
    }
    let y = (1 - getWhiteRatio(hex));

    //무지개색 퍼센트 구하기
    function getHue(hex) {
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        let red = r / 255;
        let green = g / 255;
        let blue = b / 255;
        let max = Math.max(red, green, blue);
        let min = Math.min(red, green, blue);
        let hue = 0;
        if (max !== min) {
            let d = max - min;
            switch (max) {
                case red:
                    hue = ((green - blue) / d) + (green < blue ? 6 : 0);
                    break;
                case green:
                    hue = ((blue - red) / d) + 2;
                    break;
                case blue:
                    hue = ((red - green) / d) + 4;
                    break;
            }
            hue /= 6;
        }
        return hue;
    }
    let hue = getHue(hex);

    return {
        x: x,
        y: y,
        percent: hue
    };
}

function pointerDownColorPickerViewerSettings(event) {
    let target = event.currentTarget;
    let rect = target.getBoundingClientRect();

    //팝업 앨리먼트 닫기 잠금 및 스크롤 잠금
    isHidePopupElementLock = true;
    setBodyScroll(false);

    function move(event) {
        let x = null;
        let y = null;
        if (event.type == "mousemove" || event.type == "pointerdown") {
            x = event.clientX;
            y = event.clientY;
        } else if (event.type == "touchmove") {
            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
        }
        x = (rect.left - x);
        y = (rect.top - y);
        x = (x / rect.width);
        y = (y / rect.height);
        x = (0 - x);
        y = (0 - y);
        (x < 0) ? x = 0 : null;
        (y < 0) ? y = 0 : null;
        (x > 1) ? x = 1 : null;
        (y > 1) ? y = 1 : null;
    
        let popupElement = document.getElementsByClassName("popup_element")[0];
        let colorPicker = popupElement.getElementsByClassName("popup_element_viewer_settings_color_picker")[0];
        let picker = colorPicker.getElementsByClassName("popup_element_viewer_settings_color_picker_select_picker")[0];
        let percent = Number.parseFloat(picker.getAttribute("percent"));
    
        setPositionColorPickerViewerSettings(x, y, percent);
    }
    function end() {
        //마우스
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", end);
        //터치
        document.removeEventListener("touchmove", move);
        document.removeEventListener("touchend", end);
        document.removeEventListener("touchcancel", end);

        //팝업 앨리먼트 닫기 잠금 해제 및 스크롤 잠금 해제
        function callback() {
            isHidePopupElementLock = false;
            setBodyScroll(true);
        }
        window.requestAnimationFrame(callback);
    }
    move(event);

    //마우스
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
    //터치
    document.addEventListener("touchmove", move);
    document.addEventListener("touchend", end);
    document.addEventListener("touchcancel", end);
}
function pointerDownRainbowColorViewerSettings(event) {
    let target = event.currentTarget;
    let rect = target.getBoundingClientRect();

    //팝업 앨리먼트 닫기 잠금 및 스크롤 잠금
    isHidePopupElementLock = true;
    setBodyScroll(false);

    function move(event) {
        let percent = null;
        if (event.type == "mousemove" || event.type == "pointerdown") {
            percent = event.clientX;
        } else if (event.type == "touchmove") {
            percent = event.touches[0].clientX;
        }
        percent = (rect.left - percent);
        percent = (percent / rect.width);
        percent = (0 - percent);
        (percent < 0) ? percent = 0 : null;
        (percent > 1) ? percent = 1 : null;
    
        let popupElement = document.getElementsByClassName("popup_element")[0];
        let colorPicker = popupElement.getElementsByClassName("popup_element_viewer_settings_color_picker")[0];
        let picker = colorPicker.getElementsByClassName("popup_element_viewer_settings_color_picker_box_picker")[0];
        let x = Number.parseFloat(picker.getAttribute("x"));
        let y = Number.parseFloat(picker.getAttribute("y"));
    
        setPositionColorPickerViewerSettings(x, y, percent);
    }

    function end() {
        //마우스
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", end);
        //터치
        document.removeEventListener("touchmove", move);
        document.removeEventListener("touchend", end);
        document.removeEventListener("touchcancel", end);

        //팝업 앨리먼트 닫기 잠금 해제 및 스크롤 잠금 해제
        function callback() {
            isHidePopupElementLock = false;
            setBodyScroll(true);
        }
        window.requestAnimationFrame(callback);
    }
    move(event);

    //마우스
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
    //터치
    document.addEventListener("touchmove", move);
    document.addEventListener("touchend", end);
    document.addEventListener("touchcancel", end);
}

function checkColorPickerViewerSettings(color) {
    let popupElement = document.getElementsByClassName("popup_element")[0];

    //그라데이션
    let canvas = popupElement.getElementsByTagName("canvas")[0];

    //초기화
    let reset = canvas.getContext('2d');
    reset.clearRect(0, 0, canvas.width, canvas.height);
    reset.beginPath();

    let ctx = canvas.getContext("2d");
    
    let gradientX = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradientX.addColorStop(0, "#ffffff");
    gradientX.addColorStop(1, color);

    let gradientY = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradientY.addColorStop(0, "#ffffff");
    gradientY.addColorStop(1, "#000000");

    ctx.fillStyle = gradientY;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = gradientX;
    ctx.globalCompositeOperation = "multiply";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //색깔 선택
    canvas = popupElement.getElementsByTagName("canvas")[1];
    ctx = canvas.getContext("2d");

    let gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#FF0000");
    gradient.addColorStop(1 / 6, "#FFFF00");
    gradient.addColorStop(2 / 6, "#00FF00");
    gradient.addColorStop(3 / 6, "#00FFFF");
    gradient.addColorStop(4 / 6, "#0000FF");
    gradient.addColorStop(5 / 6, "#FF00FF");
    gradient.addColorStop(1, "#FF0000");
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function setPositionColorPickerViewerSettings(x, y, percent, isInput) {
    (isInput == null) ? isInput = false : null;

    let popupElement = document.getElementsByClassName("popup_element")[0];
    let colorPicker = popupElement.getElementsByClassName("popup_element_viewer_settings_color_picker")[0];

    //그라데이션
    let canvas = colorPicker.getElementsByTagName("canvas")[0];
    let rect = canvas.getBoundingClientRect();

    let picker = colorPicker.getElementsByClassName("popup_element_viewer_settings_color_picker_box_picker")[0];
    let div = picker.getElementsByTagName("div")[0];
    div.style.transform = "translateX(" + (rect.width * x) + "px) translateY(" + (rect.height * y) + "px)";
    picker.setAttribute("x", x);
    picker.setAttribute("y", y);

    //색깔 선택
    canvas = colorPicker.getElementsByTagName("canvas")[1];
    rect = canvas.getBoundingClientRect();

    picker = colorPicker.getElementsByClassName("popup_element_viewer_settings_color_picker_select_picker")[0];
    div = picker.getElementsByTagName("div")[0];
    div.style.transform = "translateX(" + (rect.width * percent) + "px)";
    picker.setAttribute("percent", percent);

    let rainbowColor = getColorPickerRainbowColorViewerSettings(percent);
    checkColorPickerViewerSettings(rainbowColor);

    let input = popupElement.getElementsByClassName("popup_element_viewer_settings_color_picker_input")[0];
    input = input.getElementsByTagName("input")[0];

    let color = getColorPickerGradientColorViewerSettings(x, y, rainbowColor);
    if (isInput == false) {
        input.value = color;
    }

    //oncolorpicker 이벤트 실행
    let codeStr = colorPicker.getAttribute("oncolorpicker");
    codeStr = codeStr.replaceAll("this", "'" + color + "'");
    eval(codeStr);
}
function checkInputColorPickerViewerSettings() {
    let popupElement = document.getElementsByClassName("popup_element")[0];
    let input = popupElement.getElementsByClassName("popup_element_viewer_settings_color_picker_input")[0];
    input = input.getElementsByTagName("input")[0];

    function callback() {
        //#이 없을 경우
        if (input.value.length != 0 && input.value.substring(0, 1) != "#") {
            input.value = ("#" + input.value);
        }
        if (input.value.length > 7) {
            input.value = input.value.substring(0, 6);
        }
        let info = getPositionInfoColorPickerViewerSettings(input.value);
        if (isNaN(info['x']) != true && isNaN(info['y']) != true && isNaN(info['percent']) != true) {
            setPositionColorPickerViewerSettings(info["x"], info["y"], info["percent"], true);
        }
    }
    window.requestAnimationFrame(callback);
}

function checkPositionColorPickerViewerSettings() {
    if (isShowPopupElement == true) {
        let popupElement = document.getElementsByClassName("popup_element")[0];
        let colorPicker = popupElement.getElementsByClassName("popup_element_viewer_settings_color_picker");
        if (colorPicker.length != 0) {
            colorPicker = colorPicker[0];

            let picker = colorPicker.getElementsByClassName("popup_element_viewer_settings_color_picker_box_picker")[0];
            let x = Number.parseFloat(picker.getAttribute("x"));
            let y = Number.parseFloat(picker.getAttribute("y"));

            picker = colorPicker.getElementsByClassName("popup_element_viewer_settings_color_picker_select_picker")[0];
            let percent = Number.parseFloat(picker.getAttribute("percent"));

            setPositionColorPickerViewerSettings(x, y, percent);
        }
    }
}
window.addEventListener("resize", checkPositionColorPickerViewerSettings);

function getColorPickerGradientColorViewerSettings(x, y, color) {
    let canvas = document.createElement("canvas");
    canvas.width = 255;
    canvas.height = 255;
    let ctx = canvas.getContext("2d");

    x -= (x / 255) / 2;
    y -= (y / 255) / 2;

    let gradientX = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradientX.addColorStop(0, "#ffffff");
    gradientX.addColorStop(1, color);

    let gradientY = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradientY.addColorStop(0, "#ffffff");
    gradientY.addColorStop(1, "#000000");

    ctx.fillStyle = gradientY;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = gradientX;
    ctx.globalCompositeOperation = "multiply";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //색상 구하기
    let imageData = ctx.getImageData(x * canvas.width, y * canvas.height, 1, 1);
    let r = imageData.data[0];
    let g = imageData.data[1];
    let b = imageData.data[2];
    return ("#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1));
}
function getColorPickerRainbowColorViewerSettings(percent) {
    let colors = [
        "#FF0000",
        "#FFFF00",
        "#00FF00",
        "#00FFFF",
        "#0000FF",
        "#FF00FF",
        "#FF0000"
    ];

    let colorIndex1 = Math.floor(percent * (colors.length - 1));
    let colorIndex2 = colorIndex1 + 1;
    if (colorIndex2 >= colors.length) {
        colorIndex2 = colors.length - 1;
    }

    let factor = percent * (colors.length - 1) - colorIndex1;
    let color1 = colors[colorIndex1];
    let color2 = colors[colorIndex2];
    let r = Math.floor(parseInt(color1.slice(1, 3), 16) * (1 - factor) + parseInt(color2.slice(1, 3), 16) * factor);
    let g = Math.floor(parseInt(color1.slice(3, 5), 16) * (1 - factor) + parseInt(color2.slice(3, 5), 16) * factor);
    let b = Math.floor(parseInt(color1.slice(5, 7), 16) * (1 - factor) + parseInt(color2.slice(5, 7), 16) * factor);
    let color = "#" + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0");

    return color;
}

function viewerSettingsValueChecked(menuNumber, el) {
    let popupElement = document.getElementsByClassName("popup_element")[0];
    let settingsItems = popupElement.getElementsByClassName("popup_element_box")[0];

    //뒤로가기
    let goBackButton = settingsItems.getElementsByClassName("popup_element_viewer_settings_go_back_button")[0];
    let previousTimestamp = null;
    function callback(timestamp) {
        if (previousTimestamp === timestamp) { return };
        previousTimestamp = timestamp;

        function callback2() {
            goBackButton.onclick();
        }
        window.requestAnimationFrame(callback2);
    }
    window.requestAnimationFrame(callback);

    let valueList = settingsItems.getElementsByClassName("popup_element_viewer_settings_value");
    for (let i = 0; i < valueList.length; i++) {
        valueList[i].setAttribute("checked", false);
    }

    el.setAttribute("checked", true);
}

function setViewerSettingsValue(name, value) {
    (value == "null") ? value = null : null;

    let settings = {};
    let cookie = getCookie("viewerSettings");
    if (cookie != null && cookie != "null") {
        settings = cookie;
        (settings == null || settings == "null") ? settings = {} : settings = JSON.parse(settings);
    }

    settings[name] = value;
    setCookie("viewerSettings", JSON.stringify(settings));
    viewerSettingsValue = settings;

    checkCSSVarValueViewerSettings();    
}
let viewerSettingsValue = null;
function getViewerSettingsValue(name) {
    if (viewerSettingsValue == null) {
        let settings = getCookie('viewerSettings');
        (settings == null || settings == "null") ? settings = {} : settings = JSON.parse(settings);
        viewerSettingsValue = settings;
    }
    settings = viewerSettingsValue;

    let defaultTTSVoice = null;
    let voices = speechSynthesis.getVoices();
    for (let i = 0; i < voices.length; i++) {
        if (voices[i].default == true) {
            defaultTTSVoice = voices[i].name;
        }
    }

    //기본 값
    let defaultValue = {
        //- 소설 뷰어
        'novelViewerBackgroundColor': 'var(--pc-background-color)',
        'novelViewerTextColor': 'var(--color1)',
        'novelViewerFont': 'Pretendard',
        'novelViewerFontSize': '16px',
        'novelViewerFontWeight': 300,
        'novelViewerLineSpacing': 2,
        'novelViewerTextAlign': 'left',
        'novelViewerWordBreak': 'keep-all',
        'novelViewerMode': 0,
        'novelViewerPageCount': 1,
        'novelViewerTTSVoice': defaultTTSVoice,
        'novelViewerTTSRate': 1,
        'novelViewerTTSVolume': 100,
        'isNovelViewerShowWorkInfo': 'flex',
        'isNovelViewerShowImage': 'block',
        'isNovelViewerShowProgressBar': 'block',
        'isNovelViewerTextIndent': '0px',
        //- 이미지 포맷 뷰어
        'imageFormatViewerQuality': 1920,
        'imageFormatViewerResize': 500,
        'imageFormatViewerMode': 'auto',
        'imageFormatViewerImageCount': 1,
        'isImageFormatViewerAutoPageMove': true,
        'isImageFormatShowProgressBar': 'block'
    };

    return settings[name] ?? defaultValue[name];
}
function getCSSVarNameListViewerSettings() {
    let values = {
        //- 소설 뷰어
        'novelViewerBackgroundColor': '--novel-viewer-background-color',
        'novelViewerTextColor': '--novel-viewer-text-color',
        'novelViewerFont': '--novel-viewer-font',
        'novelViewerFontSize': '--novel-viewer-font-size',
        'novelViewerFontWeight': '--novel-viewer-font-weight',
        'novelViewerLineSpacing': '--novel-viewer-line-spacing',
        'novelViewerTextAlign': '--novel-viewer-text-align',
        'novelViewerWordBreak': '--novel-viewer-word-break',
        'isNovelViewerShowWorkInfo': '--novel-viewer-show-work-info',
        'isNovelViewerShowImage': '--novel-viewer-show-image',
        'isNovelViewerShowProgressBar': '--novel-viewer-show-progress-bar',
        'isNovelViewerTextIndent': '--novel-viewer-text-indent',
        //- 이미지 포맷 뷰어
        'imageFormatViewerResize': '--image-format-viewer-resize',
        'isImageFormatShowProgressBar': '--image-format-show-progress-bar'
    };
    return values;
}
function checkCSSVarValueViewerSettings() {
    let values = getCSSVarNameListViewerSettings();
    let style = document.documentElement.style;
    Object.keys(values).forEach(key => {
        style.setProperty(values[key], getViewerSettingsValue(key));
    });
}
checkCSSVarValueViewerSettings();

function isViewerSettingsValue(name, value) {
    let settingsValue = getViewerSettingsValue(name);
    return (settingsValue == value);
}
function resetViewerSettings() {
    viewerSettingsValue = null;
    setCookie("viewerSettings", null);
}