

function menuPreviewPremiumProfileLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    //
    let user_info_item = contents.getElementsByClassName("menu_user_info_profile_right_bottom_item");
    let value = user_info_item[0].getAttribute("value");
    user_info_item[0].getElementsByTagName("span")[0].innerHTML = getLanguage("menu_user_info_works_count").replaceAll("{R:0}", commas(value));
    value = user_info_item[1].getAttribute("value");
    user_info_item[1].getElementsByTagName("span")[0].innerHTML = getViewsNumberUnit(value);
    value = user_info_item[2].getAttribute("value");
    user_info_item[2].getElementsByTagName("span")[0].innerHTML = getLanguage("menu_user_info_save_count").replaceAll("{R:0}", commas(value));

    //네비게이션 글자
    let navigation_item = contents.getElementsByClassName("menu_user_navigation_item");
    for (let i = 0; i < navigation_item.length; i++) {
        let navigation_name = navigation_item[i].getAttribute("navigation_name");
        navigation_item[i].innerText = getLanguage("user_navigation:" + navigation_name);
    }

    //프리미엄 구매
    let contents_title = contents.getElementsByClassName("menu_preview_premium_profile_contents_title")[0];
    let contents_description = contents.getElementsByClassName("menu_preview_premium_profile_contents_description")[0];
    let contents_button = contents.getElementsByClassName("menu_preview_premium_profile_contents_button")[0];
    contents_title.innerHTML = getLanguage("menu_preview_premium_profile_title");
    contents_description.innerHTML = getLanguage("menu_preview_premium_profile_description");
    contents_button.innerHTML = getLanguage("header_more_button_box:buy_premium");

    //소개
    let description = contents.getElementsByClassName("menu_user_info_profile_right_description")[0];
    if (description.innerHTML.trim() != "") {
        description.style.display = null;
        description.innerHTML = textToURL(JSON.parse(description.innerHTML));
    }
}