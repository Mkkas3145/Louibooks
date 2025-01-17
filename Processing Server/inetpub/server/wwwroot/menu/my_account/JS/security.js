

function myAccountSecurityLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let userInfo = JSON.parse(contents.getElementsByClassName("user_info")[0].innerHTML);

    let title = contents.getElementsByClassName("menu_my_account_security_top_title")[0];
    title.innerHTML = getLanguage("menu_my_account_security_title");
    let description = contents.getElementsByClassName("menu_my_account_security_top_description")[0];
    description.innerHTML = getLanguage("menu_my_account_security_description");
    let bottom = contents.getElementsByClassName("menu_my_account_security_bottom")[0];
    bottom.innerHTML = getLanguage("menu_my_account_security_bottom");

    let box = contents.getElementsByClassName("menu_my_account_security_box")[0];
    let boxTitle = box.getElementsByClassName("menu_my_account_security_box_title")[0];
    boxTitle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-1060.834,48.451a24.982,24.982,0,0,1-9.851-5.358,28.206,28.206,0,0,1-5.826-7.3A31.93,31.93,0,0,1-1080,26.576V7.411L-1060.834,0l19.524,8.024V26.576a21.064,21.064,0,0,1-3.676,9.973,29.222,29.222,0,0,1-6.642,6.791,38.884,38.884,0,0,1-9.206,5.111Zm.237-45.077h0l-16.489,6.133V26.32c2.587,8.765,6.933,13.468,10.123,15.869a16.8,16.8,0,0,0,6.366,3.143,43.062,43.062,0,0,0,8.04-5.156c3.682-3.014,8.1-7.864,8.231-13.857.253-11.486,0-16.155,0-16.2L-1060.6,3.373Z" transform="translate(1085.598 0.664)"></path></g></svg>' + getLanguage("menu_my_account_privacy_box:0:title");
    let boxDescription = box.getElementsByClassName("menu_my_account_security_box_description")[0];
    boxDescription.innerHTML = getLanguage("menu_my_account_privacy_box:0:description");

    title = box.getElementsByClassName("menu_my_account_security_box_item_center_title");
    title[0].innerHTML = getLanguage("menu_my_account_personal_info_item:sensitive_data:0:title");
    title[1].innerHTML = getLanguage("menu_my_account_personal_info_item:auth:0:title");
    title[2].innerHTML = getLanguage("menu_my_account_personal_info_item:auth:1:title");
    title[3].innerHTML = getLanguage("menu_my_account_personal_info_item:auth:2:title");
    let value = box.getElementsByClassName("menu_my_account_security_box_item_center_value");
    if (userInfo["isNoPassword"] == true) {
        value[0].innerHTML = getLanguage("menu_my_account_personal_info_item:sensitive_data:0:value");
    }
    if (userInfo["loginKey"] == 0) {
        value[1].innerHTML = getLanguage("menu_my_account_personal_info_item:auth:0:value");
    } else {
        value[1].innerHTML = getLanguage("item_count").replaceAll("{R:0}", commas(userInfo["loginKey"]));
    }
    value[2].innerHTML = getLanguage("menu_my_account_personal_info_item:auth:1:value:" + ((userInfo["isTwoFactorAuth"] == true) ? 1 : 0));
    value[3].innerHTML = getLanguage("menu_my_account_personal_info_item:auth:2:value:" + userInfo["rigorousAccessProcedures"]);
}