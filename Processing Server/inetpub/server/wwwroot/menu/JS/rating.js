

function menuRatingLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let rating = contents.getElementsByClassName("menu_rating_contents")[0];

    let info = JSON.parse(contents.getElementsByClassName("info")[0].innerHTML);
    let preferentiallyRatingNumber = info["preferentiallyRatingNumber"];
    let highlightedRatingNumber = info["highlightedRatingNumber"];
    let ratingsInfo = JSON.parse(contents.getElementsByClassName("ratings_info")[0].innerHTML);

    let property = {
        'preferentiallyRatingNumber': preferentiallyRatingNumber,
        'highlightedRatingNumber': highlightedRatingNumber
    }

    registerRatings(rating, info["workNumber"], ratingsInfo, property);
}