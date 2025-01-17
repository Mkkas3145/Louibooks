

function menuReviewedQuestionsLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let info = JSON.parse(contents.getElementsByClassName("info")[0].innerHTML);
    
    let item_left = contents.getElementsByClassName("menu_reviewed_questions_item_left")[0];
    item_left.innerHTML = `
        <div class = "profile_element">
            <div class = "profile_info">` + JSON.stringify(info["profile"]) + `</div>
            <div class = "profile_image"></div>
        </div>
    `;
    item_left.setAttribute("onclick", "loadMenu_user(" + info['userNumber'] + ");");

    let item_right_top_nickname = contents.getElementsByClassName("menu_reviewed_questions_item_right_top_nickname")[0];
    item_right_top_nickname.innerHTML = info["nickname"];
    item_right_top_nickname.setAttribute("onclick", "loadMenu_user(" + info['userNumber'] + ");");
    let item_right_top_date = contents.getElementsByClassName("menu_reviewed_questions_item_right_top_date")[0];
    item_right_top_date.innerHTML = '· ' + getTimePast(new Date(info["date"]));
    let item_right_type = contents.getElementsByClassName("menu_reviewed_questions_item_right_type_text")[0];
    item_right_type.innerHTML = getLanguage("menu_write_questions_type:" + info["type"]);
    let item_right_content = contents.getElementsByClassName("menu_reviewed_questions_item_right_content")[0];
    item_right_content.innerHTML = textToURL(info["content"]);

    let item_right_screenshot_wrap = contents.getElementsByClassName("menu_reviewed_questions_item_right_screenshot_wrap")[0];
    if (info["screenshot"] != null) {
        let screenshotInfo = info["screenshot"];
        let screenshotItem = "";
        for (let i = 0; i < screenshotInfo.length; i++) {
            screenshotItem += `
                <div class = "menu_reviewed_questions_image">
                    <div class = "md-ripples" style = "cursor: pointer;" onclick = "fullScreenImage(new Array('` + screenshotInfo[i]["url"] + `'));">
                        <img src = "` + screenshotInfo[i]["url"] + `" width = "` + screenshotInfo[i]["width"] + `" height = "` + screenshotInfo[i]["height"] + `" onload = "imageLoad(event);" alt = "">
                    </div>
                </div>
            `;
        }

        let countStyle = '';
        if (screenshotInfo.length == 1) {
            countStyle = 'display: none;';
        }

        screenshot = `
            <div class = "menu_reviewed_questions_screenshot_title">
                ` + getLanguage("menu_admin_questions_screenshot") + `
            </div>
            <div class = "menu_reviewed_questions_screenshot" style = "width: calc(100% - 10px); max-width: 600px; border-radius: 10px;">
                <div class = "menu_reviewed_questions_images_count" style = "` + countStyle + `">
                    <div class = "menu_reviewed_questions_images_count_box_wrap">
                        <div class = "menu_reviewed_questions_images_count_box">
                            <span>1</span> / ` + screenshotInfo.length + `
                        </div>
                    </div>
                </div>
                <div class = "horizontal_transform" item_count = "` + screenshotInfo.length + `">
                    <div class = "menu_reviewed_questions_images">
                        ` + screenshotItem + `
                    </div>
                </div>
            </div>
        `;
        item_right_screenshot_wrap.innerHTML = screenshot;
        item_right_screenshot_wrap.style.display = "block";
    }

    //답변
    let reply_highlighted_text = contents.getElementsByClassName("menu_reviewed_questions_reply_highlighted_text")[0];
    reply_highlighted_text.innerHTML = getLanguage("menu_reviewed_questions_survey_highlighted");

    let replyInfo = info["reply"];
    let reply_item_left = contents.getElementsByClassName("menu_reviewed_questions_reply_item_left")[0];
    reply_item_left.innerHTML = `
        <div class = "profile_element">
            <div class = "profile_info">` + JSON.stringify(replyInfo["profile"]) + `</div>
            <div class = "profile_image"></div>
        </div>
    `;
    reply_item_left.setAttribute("onclick", "loadMenu_user(" + replyInfo['userNumber'] + ");");
    let reply_item_right_top_nickname = contents.getElementsByClassName("menu_reviewed_questions_reply_item_right_top_nickname")[0];
    reply_item_right_top_nickname.innerHTML = replyInfo["nickname"];
    reply_item_right_top_nickname.setAttribute("onclick", "loadMenu_user(" + replyInfo['userNumber'] + ");");
    let reply_item_right_top_date = contents.getElementsByClassName("menu_reviewed_questions_reply_item_right_top_date")[0];
    reply_item_right_top_date.innerHTML = '· ' + getTimePast(new Date(replyInfo["date"]));
    let reply_item_right_content = contents.getElementsByClassName("menu_reviewed_questions_reply_item_right_content")[0];
    reply_item_right_content.innerHTML = textToURL(replyInfo["content"]);

    //답변 설문조사
    let reply_survey_text = contents.getElementsByClassName("menu_reviewed_questions_reply_survey_text")[0];
    reply_survey_text.innerHTML = getLanguage("menu_reviewed_questions_survey_title");
    let reply_survey_item = contents.getElementsByClassName("menu_reviewed_questions_reply_survey_item");
    reply_survey_item[0].getElementsByTagName("span")[0].innerHTML = getLanguage("menu_reviewed_questions_survey:yes");
    reply_survey_item[1].getElementsByTagName("span")[0].innerHTML = getLanguage("menu_reviewed_questions_survey:no");
    if (replyInfo["liked"] == true) {
        reply_survey_item[0].classList.add("menu_reviewed_questions_reply_survey_item_checked");
    }
    if (replyInfo["disliked"] == true) {
        reply_survey_item[1].classList.add("menu_reviewed_questions_reply_survey_item_checked");
    }

    let myUserNumber = Number.parseInt(contents.getElementsByClassName("my_user_number")[0].innerHTML);
    let reply_survey_items = contents.getElementsByClassName("menu_reviewed_questions_reply_survey_items")[0];
    if (info["userNumber"] != myUserNumber) {
        reply_survey_items.classList.add("menu_reviewed_questions_reply_survey_items_disabled");
    }
}














function likesButtonReviewedQuestionsReply(el, reviewedQuestionsNumber) {
    //좋아요 취소인지
    let type = "likes";
    if (el.classList.contains("menu_reviewed_questions_reply_survey_item_checked")) {
        type = null;
    }

    //
    let parent = el.parentElement;
    let children = parent.children;
    children[0].classList.remove("menu_reviewed_questions_reply_survey_item_checked");
    children[1].classList.remove("menu_reviewed_questions_reply_survey_item_checked");

    if (type == "likes") {
        el.classList.add("menu_reviewed_questions_reply_survey_item_checked");
        actionMessage(getLanguage("menu_reviewed_questions_survey_message"));
    }

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/user/questions/likesDislike.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
            } else {
                if (status == 504) {
                    //시간 초과
                    serverResponseErrorMessage(0);
                } else {
                    //오류 발생
                    serverResponseErrorMessage(1);
                }
            }
        }
    });
    
    var formData = new FormData();
    formData.append("reviewedQuestionsNumber", reviewedQuestionsNumber);
    formData.append("type", type);

    xhr.send(formData);
}
function dislikeButtonReviewedQuestionsReply(el, reviewedQuestionsNumber) {
    //싫어요 취소인지
    let type = "dislike";
    if (el.classList.contains("menu_reviewed_questions_reply_survey_item_checked")) {
        type = null;
    }

    let parent = el.parentElement;
    let children = parent.children;

    //
    children[0].classList.remove("menu_reviewed_questions_reply_survey_item_checked");
    children[1].classList.remove("menu_reviewed_questions_reply_survey_item_checked");

    if (type == "dislike") {
        el.classList.add("menu_reviewed_questions_reply_survey_item_checked");
        actionMessage(getLanguage("menu_reviewed_questions_survey_message"));
    }

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/user/questions/likesDislike.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
            } else {
                if (status == 504) {
                    //시간 초과
                    serverResponseErrorMessage(0);
                } else {
                    //오류 발생
                    serverResponseErrorMessage(1);
                }
            }
        }
    });
    
    var formData = new FormData();
    formData.append("reviewedQuestionsNumber", reviewedQuestionsNumber);
    formData.append("type", type);

    xhr.send(formData);
}