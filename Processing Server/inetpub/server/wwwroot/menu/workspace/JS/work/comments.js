

function workspaceWorkCommentsLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let comments = contents.getElementsByClassName("my_work_comments")[0];

    let commentsUid = contents.getElementsByClassName("comments_uid")[0].innerHTML.trim();
    let commentsInfo = JSON.parse(contents.getElementsByClassName("comments_info")[0].innerHTML);
    let commentsPrefix = JSON.parse(contents.getElementsByClassName("comments_prefix")[0].innerHTML);
    let originatorNumber = contents.getElementsByClassName("originator_number")[0].innerHTML.trim();

    let prefix = new Array();
    for (let i = 0; i < commentsPrefix.length; i++) {
        let category = '...';
        if (commentsPrefix[i]["category"] == "episode") {
            category = getLanguage("work_part_category:episode_count").replaceAll("{R:0}", commentsPrefix[i]["episode"]);
        } else {
            category = getLanguage("work_part_category:" + commentsPrefix[i]["category"]);
        }
        let content = category + " " + commentsPrefix[i]["title"];
        prefix[prefix.length] = {
            'uid': commentsPrefix[i]["uid"],
            'content': content,
        }
    }

    let property = {
        'hideAddComments': true,
        'prefix': prefix,
        'originatorNumber': originatorNumber,
    }

    registerComments(comments, commentsUid, commentsInfo, property);
}