

function myAccountManagementLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let userInfo = JSON.parse(contents.getElementsByClassName("user_info")[0].innerHTML);
    let cloudInfo = JSON.parse(contents.getElementsByClassName("cloud_info")[0].innerHTML);

    let managementTitle = contents.getElementsByClassName("menu_my_account_management_title")[0];
    managementTitle.innerHTML = getLanguage("menu_my_account_management_title").replaceAll("{R:0}", userInfo["nickname"]);
    let managementDescription = contents.getElementsByClassName("menu_my_account_management_description")[0];
    managementDescription.innerHTML = getLanguage("menu_my_account_management_description");

    //Louibooks 클라우드
    let itemTitle = contents.getElementsByClassName("menu_my_account_management_item_title")[0];
    itemTitle.innerHTML = getLanguage("menu_my_account_management_cloud_title");
    let itemDescription = contents.getElementsByClassName("menu_my_account_management_item_description")[0];
    itemDescription.innerHTML = getLanguage("menu_my_account_management_cloud_description");
    let itemButton = contents.getElementsByClassName("menu_my_account_management_item_button_text")[0];
    itemButton.innerHTML = getLanguage("menu_my_account_management_cloud_button");
    //개인 정보
    itemTitle = contents.getElementsByClassName("menu_my_account_management_item_title")[1];
    itemTitle.innerHTML = getLanguage("menu_my_account_management_personal_info_title");
    itemDescription = contents.getElementsByClassName("menu_my_account_management_item_description")[1];
    itemDescription.innerHTML = getLanguage("menu_my_account_management_personal_info_description");
    itemButton = contents.getElementsByClassName("menu_my_account_management_item_button_text")[1];
    itemButton.innerHTML = getLanguage("menu_my_account_management_personal_info_button");
    //데이터 및 개인 정보 보호
    itemTitle = contents.getElementsByClassName("menu_my_account_management_item_title")[2];
    itemTitle.innerHTML = getLanguage("menu_my_account_management_privacy_title");
    itemDescription = contents.getElementsByClassName("menu_my_account_management_item_description")[2];
    itemDescription.innerHTML = getLanguage("menu_my_account_management_privacy_description");
    itemButton = contents.getElementsByClassName("menu_my_account_management_item_button_text")[2];
    itemButton.innerHTML = getLanguage("menu_my_account_management_privacy_button");
    //보안
    itemTitle = contents.getElementsByClassName("menu_my_account_management_item_title")[3];
    itemTitle.innerHTML = getLanguage("menu_my_account_management_security_title");
    itemDescription = contents.getElementsByClassName("menu_my_account_management_item_description")[3];
    itemDescription.innerHTML = getLanguage("menu_my_account_management_security_description");
    itemButton = contents.getElementsByClassName("menu_my_account_management_item_button_text")[3];
    itemButton.innerHTML = getLanguage("menu_my_account_management_security_button");

    //
    let bottomText = contents.getElementsByClassName("menu_my_account_management_bottom")[0];
    bottomText.innerHTML = getLanguage("menu_my_account_management_bottom_text");

    //- Louibooks 클라우드
    let box = contents.getElementsByClassName("menu_my_account_management_item")[0];
    let title = box.getElementsByClassName("menu_my_account_management_item_cloud_right_title");
    let bottom = box.getElementsByClassName("menu_my_account_management_item_cloud_right_bottom");
    let lines = box.getElementsByClassName("menu_my_account_management_item_cloud_right_lines")[0];
    let line = lines.getElementsByClassName("menu_my_account_management_item_cloud_right_line")[0];
    title[0].innerHTML = getLanguage("menu_my_account_management_cloud_contents:storage_capacity:title");
    title[1].innerHTML = getLanguage("menu_my_account_management_cloud_contents:info:title");
    if (userInfo["isPremium"] == true) {
        bottom[0].innerHTML = getLanguage("menu_my_account_management_cloud_contents:storage_capacity:description:1");
        lines.style.display = "none";
    } else {
        let percent = (cloudInfo["useSize"] / cloudInfo["maxSize"]) * 100;
        let text = getLanguage("menu_my_account_management_cloud_contents:storage_capacity:description:0");
        text = text.replaceAll("{R:0}", capacityUnit(cloudInfo["useSize"]));
        text = text.replaceAll("{R:1}", capacityUnit(cloudInfo["maxSize"]));
        text = text.replaceAll("{R:2}", Math.round(percent));
        line.style.width = ((Math.floor(percent * 10) / 10) + "%");
        bottom[0].innerHTML = text;
    }
    let cloudInformation = getLanguage("menu_my_account_management_cloud_contents:info:description");
    cloudInformation = cloudInformation.replaceAll("{R:0}", commas(cloudInfo["folderCount"]));
    cloudInformation = cloudInformation.replaceAll("{R:1}", commas(cloudInfo["fileCount"]));
    bottom[1].innerHTML = cloudInformation;

    //- 개인 정보
    box = contents.getElementsByClassName("menu_my_account_management_item")[1];
    title = box.getElementsByClassName("menu_my_account_management_item_check_item_right_title");
    let value = box.getElementsByClassName("menu_my_account_management_item_check_item_right_description");
    let icon = box.getElementsByClassName("menu_my_account_management_item_check_item_icon");
    title[0].innerHTML = getLanguage("menu_my_account_management_personal_info_contents:nickname:title");
    title[1].innerHTML = getLanguage("menu_my_account_management_personal_info_contents:profile:title");
    title[2].innerHTML = getLanguage("menu_my_account_management_personal_info_contents:gender:title");
    title[3].innerHTML = getLanguage("menu_my_account_management_personal_info_contents:birth_date:title");
    //
    value[0].innerHTML = userInfo["nickname"];

    let valueText = getLanguage("menu_my_account_management_personal_info_contents:value_null");
    if (userInfo["profile"]["type"] == "custom") {
        valueText = getLanguage("menu_my_account_management_personal_info_contents:profile:value");
    }
    valueText += `<div class = "my_profile" style = "width: 30px; height: 30px; margin-left: auto;"></div>`;
    value[1].innerHTML = valueText;

    let gender = getLanguage("menu_my_account_management_personal_info_contents:value_null");
    if (userInfo["gender"] != null) {
        gender = getLanguage("menu_my_account_management_personal_info_contents:gender:value:" + userInfo["gender"]);
    }
    value[2].innerHTML = gender;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-1)"><path d="M-2147,24a11.923,11.923,0,0,1-8.486-3.515A11.922,11.922,0,0,1-2159,12a11.921,11.921,0,0,1,3.515-8.485A11.923,11.923,0,0,1-2147,0a11.921,11.921,0,0,1,8.485,3.515A11.921,11.921,0,0,1-2135,12a11.923,11.923,0,0,1-3.515,8.486A11.921,11.921,0,0,1-2147,24Zm0-21a9.01,9.01,0,0,0-9,9,9.01,9.01,0,0,0,9,9,9.01,9.01,0,0,0,9-9A9.01,9.01,0,0,0-2147,3Z" transform="translate(2161 4)"></path><rect width="3" height="20" rx="1.5" transform="translate(13 26)"></rect><rect width="3" height="19" rx="1.5" transform="translate(24 34) rotate(90)"></rect></g><rect width="3" height="20" rx="1.5" transform="translate(38.336 24) rotate(-180)"></rect><path d="M2195.887,6.993l-6.175,6.447s-1.324.736-2.06-.221a1.645,1.645,0,0,1,0-1.938l8.413-8.461a1.47,1.47,0,0,1,1.888,0c.907.809,8.412,8.461,8.412,8.461s.736,1.423-.147,2.109a1.815,1.815,0,0,1-1.962,0l-6.3-6.4Z" transform="translate(-2159.988 0.404)"></path><path d="M-2148,24a11.921,11.921,0,0,1-8.485-3.515A11.923,11.923,0,0,1-2160,12a11.921,11.921,0,0,1,3.515-8.485A11.921,11.921,0,0,1-2148,0a11.923,11.923,0,0,1,8.486,3.515A11.921,11.921,0,0,1-2136,12a11.923,11.923,0,0,1-3.515,8.486A11.922,11.922,0,0,1-2148,24Zm0-21a9.01,9.01,0,0,0-9,9,9.01,9.01,0,0,0,9,9,9.01,9.01,0,0,0,9-9A9.01,9.01,0,0,0-2148,3Z" transform="translate(2185 22)"></path></g></svg>`;
    if (userInfo["gender"] == 0) {
        svg = `<svg style="fill: var(--site-color-light);" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(17.423 -21.984) rotate(45)"><rect width="3" height="23.183" rx="1.5" transform="translate(40.08 27.865) rotate(-180)"></rect><path d="M2197.25,7.714l-7.158,7.473s-1.535.853-2.388-.256a1.907,1.907,0,0,1,0-2.246l9.751-9.808a1.7,1.7,0,0,1,2.189,0c1.052.938,9.751,9.808,9.751,9.808s.853,1.649-.171,2.445a2.1,2.1,0,0,1-2.274,0l-7.306-7.416Z" transform="translate(-2159.617 0.404)"></path><path d="M14,28A14,14,0,0,1,4.1,4.1,14,14,0,1,1,23.9,23.9,13.909,13.909,0,0,1,14,28ZM14,3.5A10.5,10.5,0,1,0,24.5,14,10.512,10.512,0,0,0,14,3.5Z" transform="translate(24.58 24.865)"></path></g></g></svg>`;
    } else if (userInfo["gender"] == 1) {
        svg = `<svg style="fill: var(--color-failure);" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(9.87 -3)"><path d="M13.5,27A13.5,13.5,0,0,1,3.954,3.954,13.5,13.5,0,1,1,23.046,23.046,13.41,13.41,0,0,1,13.5,27Zm0-23.625A10.125,10.125,0,1,0,23.625,13.5,10.136,10.136,0,0,0,13.5,3.375Z" transform="translate(2.13 4)"></path><rect width="3" height="23" rx="1.5" transform="translate(14.13 29)"></rect><rect width="3" height="23" rx="1.5" transform="translate(27.13 38) rotate(90)"></rect></g></g></svg>`;
    }
    icon[2].innerHTML = svg;

    let birthDate = getLanguage("menu_my_account_management_personal_info_contents:value_null");
    if (userInfo["birthDate"]["year"] != null) {
        birthDate = getLanguage("menu_my_account_management_personal_info_contents:birth_date:value");
        birthDate = birthDate.replaceAll("{R:0}", userInfo["birthDate"]["year"]);
        birthDate = birthDate.replaceAll("{R:1}", userInfo["birthDate"]["month"]);
        birthDate = birthDate.replaceAll("{R:2}", userInfo["birthDate"]["day"]);
    }
    value[3].innerHTML = birthDate;

    //- 데이터 및 개인 정보 보호
    box = contents.getElementsByClassName("menu_my_account_management_item")[2];
    title = box.getElementsByClassName("menu_my_account_management_item_check_item_right_title");
    value = box.getElementsByClassName("menu_my_account_management_item_check_item_right_description");
    icon = box.getElementsByClassName("menu_my_account_management_item_check_item_icon");
    title[0].innerHTML = getLanguage("menu_my_account_management_privacy_title:0");
    title[1].innerHTML = getLanguage("menu_my_account_management_privacy_title:1");
    title[2].innerHTML = getLanguage("menu_my_account_management_privacy_title:2");
    title[3].innerHTML = getLanguage("menu_my_account_management_privacy_title:3");
    title[4].innerHTML = getLanguage("menu_my_account_management_privacy_title:4");
    title[5].innerHTML = getLanguage("menu_my_account_management_privacy_title:5");
    let whetherToSave = userInfo["whetherToSaveHistoryData"];
    if (whetherToSave["isUseWorksHistory"] == true || whetherToSave["isUseWorksHistory"] == "true") {
        value[0].innerHTML = getLanguage("menu_my_account_management_privacy_value:0");
        icon[0].setAttribute("checked", true);
    } else {
        value[0].innerHTML = getLanguage("menu_my_account_management_privacy_value:1");
    }
    if (whetherToSave["isUseSearchHistory"] == true || whetherToSave["isUseSearchHistory"] == "true") {
        value[1].innerHTML = getLanguage("menu_my_account_management_privacy_value:0");
        icon[1].setAttribute("checked", true);
    } else {
        value[1].innerHTML = getLanguage("menu_my_account_management_privacy_value:1");
    }
    if (Notification.permission === "granted") {
        value[2].innerHTML = getLanguage("menu_my_account_management_privacy_value:2");
        icon[2].setAttribute("checked", true);
    } else {
        value[2].innerHTML = getLanguage("menu_my_account_management_privacy_value:3");
    }
    if (whetherToSave["isUseReplyNotifications"] == true || whetherToSave["isUseReplyNotifications"] == "true") {
        value[3].innerHTML = getLanguage("menu_my_account_management_privacy_value:0");
        icon[3].setAttribute("checked", true);
    } else {
        value[3].innerHTML = getLanguage("menu_my_account_management_privacy_value:1");
    }
    if (whetherToSave["isUseActivityNotifications"] == true || whetherToSave["isUseActivityNotifications"] == "true") {
        value[4].innerHTML = getLanguage("menu_my_account_management_privacy_value:0");
        icon[4].setAttribute("checked", true);
    } else {
        value[4].innerHTML = getLanguage("menu_my_account_management_privacy_value:1");
    }
    if (whetherToSave["isUseLouibooksNotifications"] == true || whetherToSave["isUseLouibooksNotifications"] == "true") {
        value[5].innerHTML = getLanguage("menu_my_account_management_privacy_value:0");
        icon[5].setAttribute("checked", true);
    } else {
        value[5].innerHTML = getLanguage("menu_my_account_management_privacy_value:1");
    }

    //- 보안
    box = contents.getElementsByClassName("menu_my_account_management_item")[3];
    title = box.getElementsByClassName("menu_my_account_management_item_check_item_right_title");
    value = box.getElementsByClassName("menu_my_account_management_item_check_item_right_description");
    icon = box.getElementsByClassName("menu_my_account_management_item_check_item_icon");
    title[0].innerHTML = getLanguage("menu_my_account_management_security_title:0");
    title[1].innerHTML = getLanguage("menu_my_account_management_security_title:1");
    title[2].innerHTML = getLanguage("menu_my_account_management_security_title:2").replaceAll("{R:0}", userInfo["loginKey"]);
    value[0].innerHTML = getLanguage("menu_my_account_management_security_value:0");
    icon[0].setAttribute("checked", userInfo["isTwoFactorAuth"]);
    value[1].innerHTML = getLanguage("menu_my_account_management_security_value:1");
    (userInfo["rigorousAccessProcedures"] != 0) ? icon[1].setAttribute("checked", true) : null;
    value[2].innerHTML = getLanguage("menu_my_account_management_security_value:2");





    //경고
    if (userInfo["isSecurityIssue"] == true) {
        insertNoticeMyAccountManagement(menuNumber, 1, getLanguage("menu_my_account_management_warning_title:2"), getLanguage("menu_my_account_management_warning_description:2"));
    } else if (userInfo["isTwoFactorAuth"] == false) {
        insertNoticeMyAccountManagement(menuNumber, 1, getLanguage("menu_my_account_management_warning_title:3"), getLanguage("menu_my_account_management_warning_description:3"));
    } else if (userInfo["rigorousAccessProcedures"] == 0) {
        insertNoticeMyAccountManagement(menuNumber, 1, getLanguage("menu_my_account_management_warning_title:4"), getLanguage("menu_my_account_management_warning_description:4"));
    } else if (userInfo["isCreatorPermission"] == false) {
        insertNoticeMyAccountManagement(menuNumber, 1, getLanguage("menu_my_account_management_warning_title:1"), getLanguage("menu_my_account_management_warning_description:1"));
    } else if (userInfo["isCommunityPermission"] == false) {
        insertNoticeMyAccountManagement(menuNumber, 1, getLanguage("menu_my_account_management_warning_title:0"), getLanguage("menu_my_account_management_warning_description:0"));
    }
    //알림
    if (userInfo["loginKey"] > 5) {
        insertNoticeMyAccountManagement(menuNumber, 0, getLanguage("menu_my_account_management_notice_title:6"), getLanguage("menu_my_account_management_notice_description:6"));
    } else if ((cloudInfo["useSize"] / cloudInfo["maxSize"]) >= 0.9) {
        insertNoticeMyAccountManagement(menuNumber, 0, getLanguage("menu_my_account_management_notice_title:7"), getLanguage("menu_my_account_management_notice_description:7"));
    } else if (userInfo["profile"]["type"] == "default") {
        insertNoticeMyAccountManagement(menuNumber, 0, getLanguage("menu_my_account_management_notice_title:5"), getLanguage("menu_my_account_management_notice_description:5"));
    }


    
}

/*
    type:
        0 = 팁, 알림
        1 = 경고
*/
function insertNoticeMyAccountManagement(menuNumber, iconType, title, description) {
    let contents = document.getElementById("contents_" + menuNumber);
    let notice = contents.getElementsByClassName("menu_my_account_management_notice")[0];
    notice.style.display = null;
    let items = contents.getElementsByClassName("menu_my_account_management_notice_items")[0];

    let iconHTML = '...';
    if (iconType == 0) {
        iconHTML = `
            <div class = "menu_my_account_management_notice_item_icon" style = "background-color: var(--color-warning-trans2);">
                <!-- Generated by IcoMoon.io -->
                <svg style = "fill: var(--color-warning);" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7 13.33c-2.384-1.15-4-3.549-4-6.325 0-3.866 3.134-7 7-7s7 3.134 7 7c0 2.776-1.616 5.174-3.958 6.306l-0.042 0.018v2.67h-6v-2.67zM7 17h6v1.5c0 0.83-0.67 1.5-1.5 1.5h-3c-0.828 0-1.5-0.672-1.5-1.5v0-1.5zM9 11.9v2.1h2v-2.1c2.299-0.481 4-2.492 4-4.899 0-2.761-2.239-5-5-5s-5 2.239-5 5c0 2.407 1.701 4.417 3.967 4.893l0.033 0.006z"></path></svg>
            </div>
        `;
    } else if (iconType == 1) {
        iconHTML = `
            <div class="menu_my_account_management_notice_item_icon" style="background-color: var(--color-failure-trans2);">
                <!-- Generated by IcoMoon.io -->
                <svg style = "fill: var(--color-failure);" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19.511 17.98l-8.907-16.632c-0.124-0.215-0.354-0.348-0.604-0.348s-0.481 0.133-0.604 0.348l-8.906 16.632c-0.121 0.211-0.119 0.471 0.005 0.68 0.125 0.211 0.352 0.34 0.598 0.34h17.814c0.245 0 0.474-0.129 0.598-0.34 0.124-0.209 0.126-0.469 0.006-0.68zM11 17h-2v-2h2v2zM11 13.5h-2v-6.5h2v6.5z"></path></svg>
            </div>
        `;
    }

    //선
    let childLength = items.children.length;
    if (childLength != 0) {
        let line = document.createElement("div");
        line.classList.add("menu_my_account_details_item_line");
        items.appendChild(line);
    }

    let newEl = document.createElement("div");
    newEl.classList.add("menu_my_account_management_notice_item");
    newEl.innerHTML = `
        ` + iconHTML + `
        <div class = "menu_my_account_management_notice_item_right">
            <div class = "menu_my_account_management_notice_item_right_title">
                ` + title + `
            </div>
            <div class = "menu_my_account_management_notice_item_right_description">
                ` + description + `
            </div>
        </div>
    `;

    items.appendChild(newEl);
}