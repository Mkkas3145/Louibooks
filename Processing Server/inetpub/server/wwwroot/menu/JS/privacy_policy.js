

function menuPrivacyPolicyLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    let privacy_policy_title = contents.getElementsByClassName("menu_privacy_policy_title")[0];
    privacy_policy_title.innerHTML = getLanguage("menu_privacy_policy:title");
    let privacy_policy_description = contents.getElementsByClassName("menu_privacy_policy_description")[0];
    privacy_policy_description.innerHTML = getLanguage("menu_privacy_policy:description");

    let privacy_policy_item_top_right = contents.getElementsByClassName("menu_privacy_policy_item_top_right");
    privacy_policy_item_top_right[0].innerHTML = getLanguage("menu_privacy_policy_item_0:title");
    privacy_policy_item_top_right[1].innerHTML = getLanguage("menu_privacy_policy_item_1:title");
    privacy_policy_item_top_right[2].innerHTML = getLanguage("menu_privacy_policy_item_2:title");
    privacy_policy_item_top_right[3].innerHTML = getLanguage("menu_privacy_policy_item_3:title");

    let item_contents = contents.getElementsByClassName("menu_privacy_policy_item_contents");
    let privacy_policy_item_title = item_contents[0].getElementsByClassName("menu_privacy_policy_item_contents_title");
    let privacy_policy_item_description = item_contents[0].getElementsByClassName("menu_privacy_policy_item_contents_description");
    privacy_policy_item_title[0].innerHTML = getLanguage("menu_privacy_policy_item_0:contents_title:0");
    privacy_policy_item_title[1].innerHTML = getLanguage("menu_privacy_policy_item_0:contents_title:1");
    privacy_policy_item_title[2].innerHTML = getLanguage("menu_privacy_policy_item_0:contents_title:2");
    privacy_policy_item_title[3].innerHTML = getLanguage("menu_privacy_policy_item_0:contents_title:3");
    privacy_policy_item_title[4].innerHTML = getLanguage("menu_privacy_policy_item_0:contents_title:4");
    privacy_policy_item_title[5].innerHTML = getLanguage("menu_privacy_policy_item_0:contents_title:5");
    privacy_policy_item_description[0].innerHTML = getLanguage("menu_privacy_policy_item_0:contents_description:0");
    privacy_policy_item_description[1].innerHTML = getLanguage("menu_privacy_policy_item_0:contents_description:1");
    privacy_policy_item_description[2].innerHTML = getLanguage("menu_privacy_policy_item_0:contents_description:2");
    privacy_policy_item_description[3].innerHTML = getLanguage("menu_privacy_policy_item_0:contents_description:3");
    privacy_policy_item_description[4].innerHTML = getLanguage("menu_privacy_policy_item_0:contents_description:4");
    privacy_policy_item_description[5].innerHTML = getLanguage("menu_privacy_policy_item_0:contents_description:5");

    privacy_policy_item_title = item_contents[1].getElementsByClassName("menu_privacy_policy_item_contents_title");
    privacy_policy_item_description = item_contents[1].getElementsByClassName("menu_privacy_policy_item_contents_description");
    privacy_policy_item_title[0].innerHTML = getLanguage("menu_privacy_policy_item_1:contents_title:0");
    privacy_policy_item_title[1].innerHTML = getLanguage("menu_privacy_policy_item_1:contents_title:1");
    privacy_policy_item_title[2].innerHTML = getLanguage("menu_privacy_policy_item_1:contents_title:2");
    privacy_policy_item_description[0].innerHTML = getLanguage("menu_privacy_policy_item_1:contents_description:0");
    privacy_policy_item_description[1].innerHTML = getLanguage("menu_privacy_policy_item_1:contents_description:1");
    privacy_policy_item_description[2].innerHTML = getLanguage("menu_privacy_policy_item_1:contents_description:2");

    privacy_policy_item_title = item_contents[2].getElementsByClassName("menu_privacy_policy_item_contents_title");
    privacy_policy_item_description = item_contents[2].getElementsByClassName("menu_privacy_policy_item_contents_description");
    privacy_policy_item_title[0].innerHTML = getLanguage("menu_privacy_policy_item_2:contents_title:0");
    privacy_policy_item_description[0].innerHTML = getLanguage("menu_privacy_policy_item_2:contents_description:0");

    privacy_policy_item_title = item_contents[3].getElementsByClassName("menu_privacy_policy_item_contents_title");
    privacy_policy_item_description = item_contents[3].getElementsByClassName("menu_privacy_policy_item_contents_description");
    privacy_policy_item_title[0].innerHTML = getLanguage("menu_privacy_policy_item_3:contents_title:0");
    privacy_policy_item_description[0].innerHTML = getLanguage("menu_privacy_policy_item_3:contents_description:0");

    //개발자 및 책임자
    let title = contents.getElementsByClassName("menu_privacy_policy_box_title")[0];
    title.innerHTML = '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7 13.33c-2.384-1.15-4-3.549-4-6.325 0-3.866 3.134-7 7-7s7 3.134 7 7c0 2.776-1.616 5.174-3.958 6.306l-0.042 0.018v2.67h-6v-2.67zM7 17h6v1.5c0 0.83-0.67 1.5-1.5 1.5h-3c-0.828 0-1.5-0.672-1.5-1.5v0-1.5zM9 11.9v2.1h2v-2.1c2.299-0.481 4-2.492 4-4.899 0-2.761-2.239-5-5-5s-5 2.239-5 5c0 2.407 1.701 4.417 3.967 4.893l0.033 0.006z"></path></svg>' + getLanguage("menu_privacy_policy_developer:title");
    let description = contents.getElementsByClassName("menu_privacy_policy_box_description")[0];
    description.innerHTML = getLanguage("menu_privacy_policy_developer:description");
    //도움을 주는 사람
    title = contents.getElementsByClassName("menu_privacy_policy_box_title")[1];
    title.innerHTML = '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7 13.33c-2.384-1.15-4-3.549-4-6.325 0-3.866 3.134-7 7-7s7 3.134 7 7c0 2.776-1.616 5.174-3.958 6.306l-0.042 0.018v2.67h-6v-2.67zM7 17h6v1.5c0 0.83-0.67 1.5-1.5 1.5h-3c-0.828 0-1.5-0.672-1.5-1.5v0-1.5zM9 11.9v2.1h2v-2.1c2.299-0.481 4-2.492 4-4.899 0-2.761-2.239-5-5-5s-5 2.239-5 5c0 2.407 1.701 4.417 3.967 4.893l0.033 0.006z"></path></svg>' + getLanguage("menu_privacy_policy_helper:title");
    description = contents.getElementsByClassName("menu_privacy_policy_box_description")[1];
    description.innerHTML = getLanguage("menu_privacy_policy_helper:description");

    let userInfo = JSON.parse(contents.getElementsByClassName("user_info")[0].innerHTML);
    let previousType = null;
    for (let i = 0; i < userInfo.length; i++) {
        let info = userInfo[i];
        let items = contents.getElementsByClassName("menu_privacy_policy_box_items")[info["type"]];
        if (previousType == info["type"] && i != 0) {
            let line = document.createElement("div");
            line.classList.add("menu_privacy_policy_box_line");
            items.appendChild(line);
        }
        let newEl = document.createElement("div");
        newEl.classList.add("menu_privacy_policy_box_item");
        newEl.classList.add("md-ripples");
        newEl.setAttribute("onclick", "loadMenu_user(" + info["number"] + ");");
        newEl.innerHTML = `
            <div class = "menu_privacy_policy_box_item_left">
                <div class="profile_element">
                    <div class="profile_info">` + JSON.stringify(info["profile"]) + `</div>
                    <div class="profile_image"></div>
                </div>
            </div>
            <div class = "menu_privacy_policy_box_item_right">
                <div class = "menu_privacy_policy_box_item_right_realname">
                    ` + info["realname"] + `
                </div>
                <div class = "menu_privacy_policy_box_item_right_nickname">
                    ` + info["nickname"] + `
                </div>
                <div class = "menu_privacy_policy_box_item_right_description">
                    · ` + getLanguage("menu_privacy_policy_user:" + info["number"]) + `
                </div>
            </div>
        `;
        items.appendChild(newEl);
        previousType = info["type"];
    }
}