

function menuCreatorGuideLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    let top_title = contents.getElementsByClassName("menu_creator_guide_top_title")[0];
    top_title.innerHTML = getLanguage("menu_creator_guide_top_title");
    let top_description = contents.getElementsByClassName("menu_creator_guide_top_description")[0];
    top_description.innerHTML = getLanguage("menu_creator_guide_top_description");
    let top_notice_text = contents.getElementsByClassName("menu_creator_guide_top_notice_text")[0];
    top_notice_text.innerHTML = getLanguage("menu_creator_guide_top_notice_text");

    let item_right_title = contents.getElementsByClassName("menu_creator_guide_item_right_title");
    item_right_title[0].innerHTML = getLanguage("menu_creator_guide_contents_title:0");
    item_right_title[1].innerHTML = getLanguage("menu_creator_guide_contents_title:1");
    item_right_title[2].innerHTML = getLanguage("menu_creator_guide_contents_title:2");
    item_right_title[3].innerHTML = getLanguage("menu_creator_guide_contents_title:3");
    let item_right_description = contents.getElementsByClassName("menu_creator_guide_item_right_description");
    item_right_description[0].innerHTML = getLanguage("menu_creator_guide_contents_description:0");
    item_right_description[1].innerHTML = getLanguage("menu_creator_guide_contents_description:1");
    item_right_description[2].innerHTML = getLanguage("menu_creator_guide_contents_description:2");
    item_right_description[3].innerHTML = getLanguage("menu_creator_guide_contents_description:3");
    let bottom_description = contents.getElementsByClassName("menu_creator_guide_bottom_description")[0];
    bottom_description.innerHTML = getLanguage("menu_creator_guide_bottom_description");
}