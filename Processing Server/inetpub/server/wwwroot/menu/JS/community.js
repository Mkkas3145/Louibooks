



function registerCommunityLoad(menuNumber) {
    function callback() {
        if (loginStatus != null) {
            communityLoad(menuNumber);
        } else {
            window.requestAnimationFrame(callback);
        }
    }
    window.requestAnimationFrame(callback);
}

function communityLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let info = JSON.parse(contents.getElementsByClassName("community_info")[0].innerHTML)[0];

    //프로필 사진
    let left = contents.getElementsByClassName("community_item_left")[0];
    left.innerHTML = `
        <div class = "profile_element">
            <div class = "profile_info">` + JSON.stringify(info["profile"]) + `</div>
            <div class = "profile_image"></div>
        </div>
    `;

    //닉네임
    let right = contents.getElementsByClassName("community_item_right_top_nickname")[0];
    right.innerHTML = info["nickname"];
    //업로드 시간
    let date = contents.getElementsByClassName("community_item_right_top_date")[0];
    date.innerHTML = `· ` + getTimePast(new Date(info["upload_date"]));

    //콘텐츠
    let content = contents.getElementsByClassName("community_item_contents")[0];
    content.innerHTML = getHtmlCommunityContents(JSON.parse(info["content"]));

    //좋아요, 싫어요 버튼
    let bottom_item = contents.getElementsByClassName("community_item_bottom_item");

    let likes = info["likes"];
    let dislike = info["dislike"];

    (info["liked"] == true) ? likes-- : null;
    (info["dislike"] == true) ? dislike-- : null;

    let likesDisplay0 = "flex";
    let likesDisplay1 = "none";
    if (info["liked"] == true) {
        likesDisplay0 = "none";
        likesDisplay1 = "flex";
    }
    let dislikeDisplay0 = "flex";
    let dislikeDisplay1 = "none";
    if (info["disliked"] == true) {
        dislikeDisplay0 = "none";
        dislikeDisplay1 = "flex";
    }

    let likesButtonOnClick = 'communityLikesButton(this, ' + info["number"] + ');';
    let dislikeButtonOnClick = 'communityDislikeButton(this, ' + info["number"] + ');';
    if (loginStatus["isLogin"] == false) {
        likesButtonOnClick = 'loadMenu_login();';
        dislikeButtonOnClick = 'loadMenu_login();';
    }
    bottom_item[0].setAttribute("onclick", likesButtonOnClick);
    bottom_item[1].setAttribute("onclick", dislikeButtonOnClick);

    //좋아요 버튼
    let likes_text = bottom_item[0].getElementsByClassName("community_item_bottom_item_text");
    let likes_div = bottom_item[0].children;
    likes_text[0].innerHTML = getNumberUnit(likes);
    likes_text[1].innerHTML = getNumberUnit(likes + 1);
    likes_div[0].style.display = likesDisplay0;
    likes_div[1].style.display = likesDisplay1;

    //싫어요 버튼
    let dislike_text = bottom_item[1].getElementsByClassName("community_item_bottom_item_text");
    let dislike_div = bottom_item[1].children;
    dislike_text[0].innerHTML = getNumberUnit(dislike);
    dislike_text[1].innerHTML = getNumberUnit(dislike + 1);
    dislike_div[0].style.display = dislikeDisplay0;
    dislike_div[1].style.display = dislikeDisplay1;
    
    //글을 쓴 주인인지
    let isWriter = false;
    if (info["user_number"] == loginStatus["number"]) {
        isWriter = true;
    }

    //더보기 버튼
    let more_button = contents.getElementsByClassName("community_item_right_top_date_more_button")[0];
    more_button.setAttribute("onclick", "moreButtonCommunityItem(this, " + info["number"] + ", " + isWriter + ");");







    //댓글
    let comments = contents.getElementsByClassName("menu_community_comments")[0];
    let commentsUid = contents.getElementsByClassName("comments_uid")[0].innerHTML.trim();
    let commentsInfo = JSON.parse(contents.getElementsByClassName("comments_info")[0].innerHTML);
    let originatorNumber = Number.parseInt(contents.getElementsByClassName("originator_number")[0].innerHTML);

    let property = {
        'originatorNumber': originatorNumber,
    }

    registerComments(comments, commentsUid, commentsInfo, property);
}