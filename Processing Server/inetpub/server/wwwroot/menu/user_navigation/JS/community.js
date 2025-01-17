

function loadUserNavigationCommunity(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let community = contents.getElementsByClassName("user_community")[0];

    let communityUid = ("user_" + contents.getElementsByClassName("user_number")[0].innerHTML.trim());
    let communityInfo = JSON.parse(contents.getElementsByClassName("community_info")[0].innerHTML);
    let originatorNumber = contents.getElementsByClassName("originator_number")[0].innerHTML.trim();

    let property = {
        'originatorNumber': originatorNumber,
    }

    registerCommunity(community, communityUid, communityInfo, property);
}