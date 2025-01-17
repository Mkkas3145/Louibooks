

function workspacePartnerLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    
    let icon = contents.getElementsByClassName("my_workspace_partner_box_icon")[0];
    icon.innerHTML = getSVGLouibooksLogo(3);

    let title = contents.getElementsByClassName("my_workspace_partner_box_title")[0];
    title.innerHTML = getLanguage("menu_workspace_partner_title");
    let description = contents.getElementsByClassName("my_workspace_partner_box_description")[0];
    description.innerHTML = getLanguage("menu_workspace_partner_description");

    let items_description = contents.getElementsByClassName("my_workspace_partner_box_items_description")[0];
    items_description.innerHTML = getLanguage("menu_workspace_partner_condition:title");
    let items = contents.getElementsByClassName("my_workspace_partner_box_items")[0];
    let item_title = items.getElementsByClassName("my_workspace_partner_box_item_title");
    item_title[0].innerHTML = getLanguage("menu_workspace_partner_condition_item:0");
    item_title[1].innerHTML = getLanguage("menu_workspace_partner_condition_item:1");
    item_title[2].innerHTML = getLanguage("menu_workspace_partner_condition_item:2");
    item_title[3].innerHTML = getLanguage("menu_workspace_partner_condition_item:3");

    items_description = contents.getElementsByClassName("my_workspace_partner_box_items_description")[1];
    items_description.innerHTML = getLanguage("menu_workspace_partner_benefits:title");
    items = contents.getElementsByClassName("my_workspace_partner_box_items")[1];
    item_title = items.getElementsByClassName("my_workspace_partner_box_item_title");
    item_title[0].innerHTML = getLanguage("menu_workspace_partner_benefits_item:0");
    item_title[1].innerHTML = getLanguage("menu_workspace_partner_benefits_item:1");
    item_title[2].innerHTML = getLanguage("menu_workspace_partner_benefits_item:2");
    item_title[3].innerHTML = getLanguage("menu_workspace_partner_benefits_item:3");
    item_title[4].innerHTML = getLanguage("menu_workspace_partner_benefits_item:4");

    items_description = contents.getElementsByClassName("my_workspace_partner_box_items_description")[2];
    items_description.innerHTML = getLanguage("menu_workspace_partner_plus_benefits:title");
    items = contents.getElementsByClassName("my_workspace_partner_box_items")[2];
    item_title = items.getElementsByClassName("my_workspace_partner_box_item_title");
    item_title[0].innerHTML = getLanguage("menu_workspace_partner_plus_benefits_item:0");
    item_title[1].innerHTML = getLanguage("menu_workspace_partner_plus_benefits_item:1");
    item_title[2].innerHTML = getLanguage("menu_workspace_partner_plus_benefits_item:2");

    let button_item = contents.getElementsByClassName("my_workspace_partner_box_bottom_button_item");
    let button_item_icon = contents.getElementsByClassName("my_workspace_partner_box_bottom_button_item_icon");
    let button_item_right = contents.getElementsByClassName("my_workspace_partner_box_bottom_button_item_right");
    button_item_icon[0].innerHTML = getSVGLouibooksLogo(3);
    button_item_right[0].innerHTML = getLanguage("menu_workspace_partner_button:0");
    button_item_right[1].innerHTML = getLanguage("menu_workspace_partner_button:1");
    button_item_right[2].innerHTML = getLanguage("menu_workspace_partner_button:2");
    button_item_icon[3].innerHTML = getSVGLouibooksLogo(4);
    button_item_right[3].innerHTML = getLanguage("menu_workspace_partner_button:3");
    button_item_right[4].innerHTML = getLanguage("menu_workspace_partner_button:4");
    button_item_right[5].innerHTML = getLanguage("menu_workspace_partner_button:5");

    //파트너 조건 충족 여부
    let isConditionMet = contents.getElementsByClassName("is_condition_met")[0].innerHTML.trim();
    if (isConditionMet == "false") {
        button_item[0].classList.add("my_workspace_partner_box_bottom_button_item_disabled");
    }

    //파트너 디스코드
    let partnerDiscord = contents.getElementsByClassName("partner_discord")[0].innerHTML.trim();
    if (partnerDiscord != "") {
        button_item[5].style.display = null;
        button_item[5].setAttribute("onclick", "window.open('" + partnerDiscord + "');");
    }

    let bottom_description = contents.getElementsByClassName("my_workspace_partner_box_bottom_description")[0];
    bottom_description.innerHTML = getLanguage("menu_workspace_partner_bottom_description");

    let partner = contents.getElementsByClassName("partner")[0].innerHTML.trim();
    let isAwaitingReview = contents.getElementsByClassName("is_awaiting_review")[0].innerHTML.trim();
    //파트너가 아닐 경우
    if (partner == 0) {
        //검토 대기 중인지
        if (isAwaitingReview == "true") {
            button_item[0].style.display = "none";
            button_item[1].style.display = null;
            button_item[2].style.display = "none";
            button_item[3].style.display = "none";
            button_item[4].style.display = "none";
        } else {
            button_item[0].style.display = null;
            button_item[1].style.display = "none";
            button_item[2].style.display = "none";
            button_item[3].style.display = "none";
            button_item[4].style.display = "none";
        }
    } else if (partner == 1) {
        //검토 대기 중인지
        if (isAwaitingReview == "true") {
            button_item[0].style.display = "none";
            button_item[1].style.display = "none";
            button_item[2].style.display = null;
            button_item[3].style.display = "none";
            button_item[4].style.display = null;
        } else {
            button_item[0].style.display = "none";
            button_item[1].style.display = "none";
            button_item[2].style.display = null;
            button_item[3].style.display = null;
            button_item[4].style.display = "none";
        }
    } else if (partner == 2) {
        //검토 대기 중인지
        button_item[0].style.display = "none";
        button_item[1].style.display = "none";
        button_item[2].style.display = null;
        button_item[3].style.display = "none";
        button_item[4].style.display = "none";
    }
}









function workspacePartnerApprovalButton(menuNumber) {
    confirmPopup(getLanguage("menu_workspace_partner_approval_confirm_popup:title"), getLanguage("menu_workspace_partner_approval_confirm_popup:description"), 'requestWorkspacePartnerApproval(' + menuNumber + ');');
}
function requestWorkspacePartnerApproval(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let button_item = contents.getElementsByClassName("my_workspace_partner_box_bottom_button_item");

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/user/partner_approval.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText.trim();
                
                if (xhrHtml == "condition not met") {
                    actionMessage(getLanguage("menu_workspace_partner_approval_message:1"));
                } else if (xhrHtml == "you partner plus") {
                    actionMessage(getLanguage("menu_workspace_partner_approval_message:3"));
                } else if (xhrHtml == "already requested") {
                    actionMessage(getLanguage("menu_workspace_partner_approval_message:2"));
                } else if (xhrHtml == "request 0") {
                    button_item[0].style.display = "none";
                    button_item[1].style.display = null;
                    button_item[2].style.display = "none";
                    button_item[3].style.display = "none";
                    button_item[4].style.display = "none";

                    actionMessage(getLanguage("menu_workspace_partner_approval_message:0"));
                } else if (xhrHtml == "request 1") {
                    button_item[0].style.display = "none";
                    button_item[1].style.display = "none";
                    button_item[2].style.display = null;
                    button_item[3].style.display = "none";
                    button_item[4].style.display = null;

                    actionMessage(getLanguage("menu_workspace_partner_approval_message:0"));
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
            loadingComplete();
        }
    });
    
    var formData = new FormData();
    formData.append("language", userLanguage);

    xhr.send(formData);
}






function workspacePartnerUnpartnerButton(menuNumber) {
    confirmPopup(getLanguage("menu_workspace_partner_unpartner_confirm_popup:title"), getLanguage("menu_workspace_partner_unpartner_confirm_popup:description"), 'requestWorkspacePartnerUnpartner(' + menuNumber + ');');
}
function requestWorkspacePartnerUnpartner(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let button_item = contents.getElementsByClassName("my_workspace_partner_box_bottom_button_item");

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/user/unpartner.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText.trim();
                
                button_item[0].style.display = null;
                button_item[1].style.display = "none";
                button_item[2].style.display = "none";
                button_item[3].style.display = "none";
                button_item[4].style.display = "none";
                button_item[5].style.display = "none";

                actionMessage(getLanguage("menu_workspace_partner_unpartner_message"));
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
    xhr.send(formData);
}