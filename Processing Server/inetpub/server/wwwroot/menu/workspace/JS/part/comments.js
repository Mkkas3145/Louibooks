

function workspacePartCommentsLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let comments = contents.getElementsByClassName("workspace_part_comments_contents")[0];

    let commentsUid = contents.getElementsByClassName("comments_uid")[0].innerHTML.trim();
    let commentsInfo = JSON.parse(contents.getElementsByClassName("comments_info")[0].innerHTML);
    let originatorNumber = contents.getElementsByClassName("originator_number")[0].innerHTML.trim();

    let property = {
        'originatorNumber': originatorNumber,
    }

    registerComments(comments, commentsUid, commentsInfo, property);
}