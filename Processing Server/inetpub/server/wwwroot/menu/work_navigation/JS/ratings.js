



function loadWorkNavigationRatings(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let ratings = contents.getElementsByClassName("work_navigation_ratings")[0];
    let workNumber = Number.parseInt(contents.getElementsByClassName("work_number")[0].innerHTML.trim());

    let ratingsInfo = JSON.parse(contents.getElementsByClassName("ratings_info")[0].innerHTML);

    registerRatings(ratings, workNumber, ratingsInfo);
}