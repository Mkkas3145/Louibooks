



function historyRatingsLoad(menuNumber, info) {
    let contents = document.getElementById("contents_" + menuNumber);
    let right = contents.getElementsByClassName("menu_history_right")[0];
    right.setAttribute("type", "ratings");
    right.innerHTML = `
        <div class = "menu_history_ratings"></div>
    `;
    let option_items = contents.getElementsByClassName("menu_history_left_wrap_option_items")[0];
    option_items.innerHTML = ``;
    let wrap_line = contents.getElementsByClassName("menu_history_left_wrap_line")[0];
    wrap_line.style.display = "none";

    //댓글
    let ratings = contents.getElementsByClassName("menu_history_ratings")[0];
    let property = {
        'hideWriteRatings': true,
        'sort': 1
    }
    registerRatings(ratings, "history", info, property);
}





function requestHistoryRatingsLoad(menuNumber) {
    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/ratings/getInfoNumbers.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                document.body.scrollTo(0, 0);
                historyRatingsLoad(menuNumber, info);
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
    formData.append("workNumber", "history");
    formData.append("sort", 1);

    xhr.send(formData);
}