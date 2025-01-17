



function menuCommentLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let comments = contents.getElementsByClassName("menu_comment_contents")[0];

    let commentsUid = contents.getElementsByClassName("comments_uid")[0].innerHTML.trim();
    let commentsInfo = JSON.parse(contents.getElementsByClassName("comments_info")[0].innerHTML);
    let originatorNumber = Number.parseInt(contents.getElementsByClassName("originator_number")[0].innerHTML);
    let preferentiallyCommentNumber = Number.parseInt(contents.getElementsByClassName("preferentially_comment_number")[0].innerHTML);
    let highlightedCommentNumber = Number.parseInt(contents.getElementsByClassName("highlighted_comment_number")[0].innerHTML);

    let property = {
        'originatorNumber': originatorNumber,
        'preferentiallyCommentNumber': preferentiallyCommentNumber,
        'highlightedCommentNumber': highlightedCommentNumber
    }

    registerComments(comments, commentsUid, commentsInfo, property);
}