

function menuExploreLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    let title = contents.getElementsByClassName("menu_explore_item_right_title");
    title[0].innerHTML = getLanguage("menu_explore_trending_left_top_title");

    let description = contents.getElementsByClassName("menu_explore_item_right_description");
    description[0].innerHTML = getLanguage("menu_explore_trending_left_description");
}