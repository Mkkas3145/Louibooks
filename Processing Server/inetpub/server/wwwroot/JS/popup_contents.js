

function openPopupContents(name, isHistory, data) {
    function callback() {
        if (loginStatus != null) {
            openPopupContents2(name, isHistory, data);
        } else {
            window.requestAnimationFrame(callback);
        }
    }
    window.requestAnimationFrame(callback);
}


var isShowPopupContents = false;

function openPopupContents2(name, isHistory, data) {
    showPopupContents();
    if (name == "profile_picture") {
        setHtmlPopupContents(getHtmlPopupContents_edit_profile_picture(), false);
    } else if (name == "create_work") {
        setHtmlPopupContents(getHtmlPopupContents_create_work(), false);
    } else if (name == "workspace_work_cover_upload") {
        setHtmlPopupContents(getHtmlPopupContents_workspace_work_upload_cover(), false);
    } else if (name == "upload_work_part") {
        setHtmlPopupContents(getHtmlPopupContents_upload_work_part(data), false);
    } else if (name == "work_art_upload") {
        setHtmlPopupContents(getHtmlPopupContents_work_art_upload(data), false);
    } else if (name == "change_chapter_title") {
        setHtmlPopupContents(getHtmlPopupContents_change_chapter_title(data), false);
    } else if (name == "community_add_youtube_video") {
        setHtmlPopupContents(getHtmlPopupContents_community_add_youtube_video(), false);
    } else if (name == "workspace_work_localization_create_language") {
        setHtmlPopupContents(getHtmlPopupContents_workspace_work_localization_create_language(data), false);
    } else if (name == "workspace_part_localization_create_language") {
        setHtmlPopupContents(getHtmlPopupContents_workspace_part_localization_create_language(data), false);
    } else if (name == "buy_premium") {
        setHtmlPopupContents(getHtmlPopupContents_buy_premium(), false);
    } else if (name == "change_profile") {
        setHtmlPopupContents(getHtmlPopupContents_change_profile(), false);
    } else if (name == "adult_questions") {
        setHtmlPopupContents(getHtmlPopupContents_adult_questions(data), false);
    } else if (name == "speech_to_text_search") {
        setHtmlPopupContents(getHtmlPopupContents_speech_to_text_search(data), false);
    } else if (name == "json_viewer") {
        setHtmlPopupContents(getHtmlPopupContents_json_viewer(data), false);
    } else if (name == "user_report") {
        setHtmlPopupContents(getHtmlPopupContents_user_report(data), false);
    } else if (name == "work_report") {
        setHtmlPopupContents(getHtmlPopupContents_work_report(data), false);
    } else if (name == "bank_remittance_details") {
        setHtmlPopupContents(getHtmlPopupContents_bank_remittance_details(), false);
    } else if (name == "part_user_translation") {
        setHtmlPopupContents(getHtmlPopupContents_part_user_translation(data), false);
    } else if (name == "presentation") {
        setHtmlPopupContents(getHtmlPopupContents_presentation(), false);
    } else if (name == "upload_work_part_video") {
        setHtmlPopupContents(getHtmlPopupContents_upload_work_part_video(data), false);
    } else if (name == "cancel_payment") {
        setHtmlPopupContents(getHtmlPopupContents_cancel_payment(data), false);
    }

    //히스토리
    if (isHistory == null || isHistory == false) {
        let historyData = {
            "type": "popupContents",
            "name": name,
            "data": data,
        };
        history.pushState(historyData, null, null);
    }
}

function showPopupContents() {
    let popup_contents = document.getElementsByClassName("popup_contents")[0];
    let popup_contents_box = document.getElementsByClassName("popup_contents_box")[0];
    popup_contents.style.display = "flex";
    popup_contents.style.animation = "show_popup_contents 0.2s forwards";
    popup_contents_box.style.animation = "show_popup_contents_box 0.2s forwards";

    popup_contents_box.scrollTop = 0;
    isShowPopupContents = true;

    //스크롤 불가능
    setBodyScroll(false);
}
function hidePopupContents() {
    let popup_contents = document.getElementsByClassName("popup_contents")[0];
    let popup_contents_box = document.getElementsByClassName("popup_contents_box")[0];
    let popup_contents_box_html = document.getElementsByClassName("popup_contents_box_html")[0];
    popup_contents.style.animation = "hide_popup_contents 0.2s forwards";
    popup_contents_box.style.animation = "hide_popup_contents_box 0.2s forwards";

    setTimeout(() => {
        popup_contents.style.display = "none";
        popup_contents_box_html.textContent = "";
    }, 200);

    previousHtmlPopupContents = new Array();

    isShowPopupContents = false;

    //스크롤 가능
    setBodyScroll(true);
    if (speechToTextSearch != null && isPopupSpeechToTextSearchStart == true) {
        speechToTextSearch.stop();
    }

    //기타
    if (checkWorkPartVideoUploadStep != null) {
        clearInterval(checkWorkPartVideoUploadStep);
    }

    //비디오 업로드 초기화
    initXhrPopupContentsUploadWorkPartVideoChunkUpload();
}
function popupContentsResizeEvent() {
    if (isShowPopupContents == true) {
        requestAnimationFrame(popupContentsResizeEvent);
        setPosition_PopupContents_image_upload_complete();
    }
}
function popupContentsLoading() {
    let loadingBox = document.getElementsByClassName("popup_contents_box_loading")[0];
    loadingBox.style.display = "flex";
    loadingBox.style.animation = "show_popup_contents_loading 0.2s forwards";
}
function popupContentsLoadingComplete() {
    let loadingBox = document.getElementsByClassName("popup_contents_box_loading")[0];
    loadingBox.style.animation = "hide_popup_contents_loading 0.2s forwards";
    setTimeout(() => {
        loadingBox.style.display = "none";
    }, 200);
}

var isBackPopupContents = false;
function backPopupContents() {
    if (previousHtmlPopupContents.length > 1) {
        let array = new Array();
        for (let i = 0; i < previousHtmlPopupContents.length; i++) {
            array[array.length] = previousHtmlPopupContents[i];
        }

        isBackPopupContents = true;
        setHtmlPopupContents(previousHtmlPopupContents[previousHtmlPopupContents.length - 1], true);

        previousHtmlPopupContents.splice(-1, 1);
    } else {
        history.back();
    }
}
function resetBackPopupContents() {
    isBackPopupContents = false;
    previousHtmlPopupContents = new Array();
}

var previousHtmlPopupContents = new Array();
var popupContentsScroll = true;

function setHtmlPopupContents(html, isAnimation) {
    let popup_contents_box = document.getElementsByClassName("popup_contents_box")[0];
    let popup_contents_box_html = document.getElementsByClassName("popup_contents_box_html")[0];
    let previousHtml = popup_contents_box_html.innerHTML;

    if (isAnimation == false) {
        popup_contents_box_html.innerHTML = html;
        
        popupContentsResizeEvent();
    } else {
        popup_contents_box.style.pointerEvents = "none";

        let clientRect = popup_contents_box.getBoundingClientRect();
        let previousWidth = clientRect.width;
        let previousHeight = clientRect.height;

        popup_contents_box_html.innerHTML = html;
        popupContentsResizeEvent();

        clientRect = popup_contents_box.getBoundingClientRect();
        let width = clientRect.width;
        let height = clientRect.height;

        popup_contents_box.style.width = previousWidth + "px";
        popup_contents_box.style.height = previousHeight + "px";

        setTimeout(() => {
            popup_contents_box.style.width = width + "px";
            popup_contents_box.style.height = height + "px";

            setTimeout(() => {
                popup_contents_box.style.width = "max-content";
                popup_contents_box.style.height = "max-content";

                popup_contents_box.style.pointerEvents = "all";
            }, 300);
        }, 1);

        //스크롤 위로
        popup_contents_box.scrollTop = 0;
    }

    if (isBackPopupContents == false) {
        previousHtmlPopupContents[previousHtmlPopupContents.length] = previousHtml;
    } else {
        isBackPopupContents = false;
    }

    //스크롤
    if (popupContentsScroll == true) {
        popup_contents_box.style.overflow = "auto";
    } else {
        popup_contents_box.style.overflow = "hidden";
        popupContentsScroll = true;
    }
}
function checkHtmlPopupContents() {
    if (isShowPopupContents == true) {
        let popup_contents_box = document.getElementsByClassName("popup_contents_box")[0];
        let popup_contents_box_html = document.getElementsByClassName("popup_contents_box_html")[0];
        //popup_contents_box.style.overflow = "hidden";

        let differenceWidth = popup_contents_box.offsetWidth - popup_contents_box_html.offsetWidth;
    
        let clientRect = popup_contents_box.getBoundingClientRect();
        let previousWidth = clientRect.width;
        let previousHeight = clientRect.height;
    
        popup_contents_box.style.width = previousWidth + "px";
        popup_contents_box.style.height = previousHeight + "px";
    
        function callback() {
            clientRect = popup_contents_box_html.getBoundingClientRect();
            let width = clientRect.width;
            let height = clientRect.height;
            width += differenceWidth;

            popup_contents_box.style.width = width + "px";
            popup_contents_box.style.height = height + "px";
    
            setTimeout(() => {
                popup_contents_box.style.width = "max-content";
                popup_contents_box.style.height = "max-content";
                //popup_contents_box.style.overflow = "auto";
    
                popup_contents_box.style.pointerEvents = "all";
            }, 300);
        }
        window.requestAnimationFrame(callback);
    }
}