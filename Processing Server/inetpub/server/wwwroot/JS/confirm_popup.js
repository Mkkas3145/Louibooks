



function confirmPopup(title, subject, execCode, isHistory) {
    let box_title = document.getElementsByClassName("confirm_popup_box_title")[0];
    let box_subject = document.getElementsByClassName("confirm_popup_box_subject")[0];

    box_title.innerText = title;
    box_subject.innerText = subject + "\n" + getLanguage("confirm_popup:subject");

    let bottom_item = document.getElementsByClassName("confirm_popup_box_bottom_item");
    bottom_item[0].innerText = getLanguage("confirm_popup_button:cancel");
    bottom_item[1].setAttribute("onclick", execCode + "history.back();");
    bottom_item[1].innerText = getLanguage("confirm_popup_button:confirm");

    //애니메이션
    let confirm_popup = document.getElementsByClassName("confirm_popup")[0];
    confirm_popup.style.display = "flex";
    confirm_popup.style.animation = "show_confirm_popup 0.2s forwards";

    let confirm_popup_box = document.getElementsByClassName("confirm_popup_box")[0];
    confirm_popup_box.style.animation = "show_confirm_popup_box 0.2s forwards";

    //히스토리
    if (isHistory == null || isHistory == false) {
        let historyData = {
            "type": "confirmPopup",
            "title": title,
            "subject": subject,
            "execCode": execCode,
        };
        history.pushState(historyData, null, null);
    }
}

function closeConfirmPopup() {
    //애니메이션
    let confirm_popup = document.getElementsByClassName("confirm_popup")[0];
    confirm_popup.style.animation = "hide_confirm_popup 0.2s forwards";
    setTimeout(() => {
        confirm_popup.style.display = "none";
    }, 200);

    let confirm_popup_box = document.getElementsByClassName("confirm_popup_box")[0];
    confirm_popup_box.style.animation = "hide_confirm_popup_box 0.2s forwards";
}
