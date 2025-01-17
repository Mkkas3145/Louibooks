

function menuCommunityGuideLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    let top_title = contents.getElementsByClassName("menu_community_guide_top_title")[0];
    top_title.innerHTML = getLanguage("menu_community_guide_top_title");
    let top_description = contents.getElementsByClassName("menu_community_guide_top_description")[0];
    top_description.innerHTML = getLanguage("menu_community_guide_top_description");
    let top_notice_text = contents.getElementsByClassName("menu_community_guide_top_notice_text")[0];
    top_notice_text.innerHTML = getLanguage("menu_community_guide_top_notice_text");

    let item_right_title = contents.getElementsByClassName("menu_community_guide_item_right_title");
    item_right_title[0].innerHTML = getLanguage("menu_community_guide_contents_title:0");
    item_right_title[1].innerHTML = getLanguage("menu_community_guide_contents_title:1");
    item_right_title[2].innerHTML = getLanguage("menu_community_guide_contents_title:2");
    item_right_title[3].innerHTML = getLanguage("menu_community_guide_contents_title:3");
    let item_right_description = contents.getElementsByClassName("menu_community_guide_item_right_description");
    item_right_description[0].innerHTML = getLanguage("menu_community_guide_contents_description:0");
    item_right_description[1].innerHTML = getLanguage("menu_community_guide_contents_description:1");
    item_right_description[2].innerHTML = getLanguage("menu_community_guide_contents_description:2");
    item_right_description[3].innerHTML = getLanguage("menu_community_guide_contents_description:3");
    let creator_guide_text = contents.getElementsByClassName("menu_community_guide_bottom_creator_guide_text")[0];
    let guide_text = getLanguage("menu_community_guide_bottom_creator_guide_text");
    guide_text = guide_text.replaceAll("{R:0}", '<span class = "md-ripples" onclick = "loadMenu_creator_guide();">' + getLanguage("menu_name:creator_guide") + '</span>');
    creator_guide_text.innerHTML = guide_text;
    let bottom_description = contents.getElementsByClassName("menu_community_guide_bottom_description")[0];
    bottom_description.innerHTML = getLanguage("menu_community_guide_bottom_description");
}