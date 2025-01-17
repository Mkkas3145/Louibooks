

function loadWorkNavigationDetails(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    contents = contents.getElementsByClassName("menu_work_contents")[0];
    let workInfo = JSON.parse(contents.getElementsByClassName("work_info")[0].innerHTML);
    let analysisInfo = JSON.parse(contents.getElementsByClassName("analysis_info")[0].innerHTML);
    let contributorInfo = JSON.parse(contents.getElementsByClassName("contributor_info")[0].innerHTML);

    let work_title = contents.getElementsByClassName("work_navigation_details_title")[0];
    work_title.innerHTML = workInfo["title"];

    let originator_profile = contents.getElementsByClassName("menu_work_info_right_originator_left_profile")[0];
    originator_profile.innerHTML = `
        <div class = "profile_element">
            <div class = "profile_info">` + JSON.stringify(workInfo["originator"]["profile"]) + `</div>
            <div class = "profile_image"></div>
        </div>
    `;
    let originator_nickname = contents.getElementsByClassName("menu_work_info_right_originator_left_nickname")[0];
    originator_nickname.innerHTML = workInfo["originator"]["nickname"];

    let description = contents.getElementsByClassName("work_navigation_details_description")[0];
    description.innerHTML = workInfo["description"];
    let genre = contents.getElementsByClassName("menu_work_info_right_description_genre")[0];
    let genreSplit = workInfo["genre"].split(",");
    if (genreSplit.length != 0) {
        for (let i = 0; i < genreSplit.length; i++) {
            let newEl = document.createElement("div");
            newEl.classList.add("menu_work_info_right_description_genre_item");
            newEl.innerHTML = getLanguage("genre:" + genreSplit[i]);
            genre.appendChild(newEl);
        }
    } else {
        genre.remove();
    }

    //
    let info_item = contents.getElementsByClassName("menu_work_info_right_info_item")[0];
    if (workInfo["public_status"] == 0) {
        info_item.innerHTML = `
            <!-- Generated by IcoMoon.io -->
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 12h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v7c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-7c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM8 10v-3c-0.001-1.106 0.445-2.105 1.169-2.831 0.723-0.724 1.719-1.172 2.821-1.174 1.030 0.003 1.948 0.378 2.652 1 0.638 0.565 1.097 1.332 1.28 2.209 0.113 0.541 0.642 0.888 1.183 0.775s0.888-0.642 0.775-1.183c-0.272-1.307-0.958-2.454-1.912-3.299-1.060-0.938-2.452-1.504-3.973-1.502-1.657 0.002-3.157 0.676-4.241 1.762s-1.756 2.587-1.754 4.243v3h-1c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v7c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-7c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879z"></path></svg>
            ` + getLanguage("public_status:0") + `
        `;
    } else if (workInfo["public_status"] == 1) {
        info_item.innerHTML = `
            <!-- Generated by IcoMoon.io -->
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15 8h3c1.105 0 2.103 0.447 2.828 1.172s1.172 1.723 1.172 2.828-0.447 2.103-1.172 2.828-1.723 1.172-2.828 1.172h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1h3c1.657 0 3.158-0.673 4.243-1.757s1.757-2.586 1.757-4.243-0.673-3.158-1.757-4.243-2.586-1.757-4.243-1.757h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1zM9 16h-3c-1.105 0-2.103-0.447-2.828-1.172s-1.172-1.723-1.172-2.828 0.447-2.103 1.172-2.828 1.723-1.172 2.828-1.172h3c0.552 0 1-0.448 1-1s-0.448-1-1-1h-3c-1.657 0-3.158 0.673-4.243 1.757s-1.757 2.586-1.757 4.243 0.673 3.158 1.757 4.243 2.586 1.757 4.243 1.757h3c0.552 0 1-0.448 1-1s-0.448-1-1-1zM8 13h8c0.552 0 1-0.448 1-1s-0.448-1-1-1h-8c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path></svg>
            ` + getLanguage("public_status:1") + `
        `;
    } else if (workInfo["public_status"] == 2) {
        info_item.innerHTML = `
            <!-- Generated by IcoMoon.io -->
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 12h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v7c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-7c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM18 10v-3c0-1.657-0.673-3.158-1.757-4.243s-2.586-1.757-4.243-1.757-3.158 0.673-4.243 1.757-1.757 2.586-1.757 4.243v3h-1c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v7c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-7c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM8 10v-3c0-1.105 0.447-2.103 1.172-2.828s1.723-1.172 2.828-1.172 2.103 0.447 2.828 1.172 1.172 1.723 1.172 2.828v3z"></path></svg>
            ` + getLanguage("public_status:2") + `
        `;
    }
    info_item = contents.getElementsByClassName("menu_work_info_right_info_item")[1].getElementsByTagName("span")[0];
    info_item.innerHTML = workInfo["ratings"]["averageScore"].toFixed(1);
    info_item = contents.getElementsByClassName("menu_work_info_right_info_item")[2].getElementsByTagName("span")[0];
    info_item.innerHTML = getViewsNumberUnit(workInfo["views"]);
    info_item = contents.getElementsByClassName("menu_work_info_right_info_item")[3].getElementsByTagName("span")[0];
    info_item.innerHTML = getLanguage("work_round").replaceAll("{R:0}", commas(workInfo["part"]));
    info_item = contents.getElementsByClassName("menu_work_info_right_info_item")[4];
    let icon = "";
    if (workInfo["contents_type"] == 0) {
        icon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-72.583-761.2c-2.946-3.826-6.227-5.765-9.755-5.765h0c-6.133,0-11.229,5.774-11.281,5.833a1.5,1.5,0,0,1-1.126.517h-.006a1.5,1.5,0,0,1-1.124-.506c-3.431-3.877-7.015-5.844-10.651-5.844h0c-6.23,0-10.743,5.713-10.788,5.771a1.5,1.5,0,0,1-1.67.5A1.5,1.5,0,0,1-120-762.116v-30.063a1.5,1.5,0,0,1,.318-.922c3.574-4.578,7.7-6.9,12.273-6.9h0c5.73,0,10.491,3.7,12.606,5.656C-91.165-798.1-87.269-800-83.2-800c7.569,0,12.778,6.622,13,6.9a1.5,1.5,0,0,1,.313.917v30.063a1.5,1.5,0,0,1-1.017,1.42,1.5,1.5,0,0,1-.483.08A1.5,1.5,0,0,1-72.583-761.2Zm-20.812-4.26c2.423-1.988,6.408-4.5,11.056-4.5h0a13.728,13.728,0,0,1,9.444,3.972v-25.638a19,19,0,0,0-2.779-2.56A12.553,12.553,0,0,0-83.2-797c-3.485,0-6.913,1.867-10.191,5.549ZM-117-791.653v25.91a16.593,16.593,0,0,1,10.471-4.223h0a15.532,15.532,0,0,1,10.132,4.125v-25.873c-1.474-1.438-5.9-5.285-11.013-5.285h0C-110.882-797-114.105-795.2-117-791.653Z" transform="translate(119.895 805.308)"></path></g></svg>';
    } else if (workInfo["contents_type"] == 1) {
        icon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M3,3H3V18H47V3H3M3,0H47a3,3,0,0,1,3,3V18a3,3,0,0,1-3,3H3a3,3,0,0,1-3-3V3A3,3,0,0,1,3,0Z"></path><path d="M1.5,925H27a1.5,1.5,0,0,1,1.329,2.195l-11.5,22A1.5,1.5,0,0,1,15.5,950H1.508a1.5,1.5,0,0,1-1.5-1.5L0,926.5A1.5,1.5,0,0,1,1.5,925Zm23.023,3H3l.007,19H14.592Z" transform="translate(0 -900)"></path><path d="M1.5,927H26a1.5,1.5,0,0,1,1.33,2.194l-11.5,22.03a1.5,1.5,0,0,1-1.33.806h-.006l-13.5-.053A1.5,1.5,0,0,1-.5,950.442L0,928.466A1.5,1.5,0,0,1,1.5,927Zm22.025,3H2.966l-.432,18.982,11.058.044Z" transform="translate(49.5 977) rotate(180)"></path></g></svg>';
    } else if (workInfo["contents_type"] == 2) {
        icon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M121.5,500h47a1.5,1.5,0,0,1,1.5,1.5V516a1.5,1.5,0,0,1-1.218,1.473l-47,9A1.5,1.5,0,0,1,120,525V501.5A1.5,1.5,0,0,1,121.5,500Zm45.5,3H123v20.186l44-8.426Z" transform="translate(-120 -500)"></path><path d="M121.5,500h47a1.5,1.5,0,0,1,1.5,1.5V516a1.5,1.5,0,0,1-1.218,1.473l-47,9A1.5,1.5,0,0,1,120,525V501.5A1.5,1.5,0,0,1,121.5,500Zm45.5,3H123v20.186l44-8.426Z" transform="translate(170 550) rotate(180)"></path></g></svg>';
    } else if (workInfo["contents_type"] == 3) {
        icon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M6.712,1000a1.5,1.5,0,0,1,.745.2l41.052,23.5a1.5,1.5,0,0,1,0,2.6L7.458,1049.8a1.5,1.5,0,0,1-2.245-1.3v-47a1.5,1.5,0,0,1,1.5-1.5Zm38.032,25L8.212,1004.087v41.826Z" transform="translate(0.736 -1000)"></path></g></svg>';
    }
    info_item.innerHTML = icon + getLanguage("work_settings_contents_type:" + workInfo["contents_type"]);
    info_item = contents.getElementsByClassName("menu_work_info_right_info_item")[5].getElementsByTagName("span")[0];
    info_item.innerHTML = getLanguage("language:" + workInfo["original_language"]);
    info_item = contents.getElementsByClassName("menu_work_info_right_info_item")[6].getElementsByTagName("span")[0];
    info_item.innerHTML = getTimePast(new Date(workInfo["creation_date"]));
    info_item = contents.getElementsByClassName("menu_work_info_right_info_item")[7];
    let html = "";
    if (workInfo["user_age"] == 0) {
        info_item.style.display = "none";
    } else if (workInfo["user_age"] == 1) {
        html = `
            <div class = "menu_work_info_right_info_item_user_age_need_attention">
                15
            </div>
            ` + getLanguage("work_settings_user_age:1") + `
        `;
    } else if (workInfo["user_age"] == 2) {
        html = `
            <div class = "menu_work_info_right_info_item_user_age_adult">
                ` + getLanguage("adult_age") + `
            </div>
            ` + getLanguage("work_settings_user_age:2") + `
        `;
    }
    info_item.innerHTML = html;

    //분석
    let analysis_title = contents.getElementsByClassName("work_navigation_details_analysis_title")[0];
    analysis_title.innerHTML = getLanguage("menu_work_details_analysis_title");
    let item_title = contents.getElementsByClassName("work_navigation_details_analysis_item_right_title");
    item_title[0].innerHTML = getLanguage("menu_work_details_analysis_item_title:0");
    item_title[1].innerHTML = getLanguage("menu_work_details_analysis_item_title:1");
    item_title[2].innerHTML = getLanguage("menu_work_details_analysis_item_title:2");
    item_title[3].innerHTML = getLanguage("menu_work_details_analysis_item_title:3");
    item_title[4].innerHTML = getLanguage("menu_work_details_analysis_item_title:4");
    item_title[5].innerHTML = getLanguage("menu_work_details_analysis_item_title:5");
    item_title[6].innerHTML = getLanguage("menu_work_details_analysis_item_title:6");
    item_title[7].innerHTML = getLanguage("menu_work_details_analysis_item_title:7");
    item_title[8].innerHTML = getLanguage("menu_work_details_analysis_item_title:8");
    item_title[9].innerHTML = getLanguage("menu_work_details_analysis_item_title:9");
    let item_value = contents.getElementsByClassName("work_navigation_details_analysis_item_right_value");
    let item_line = contents.getElementsByClassName("work_navigation_details_analysis_item_right_line");
    item_value[0].innerHTML = commas(Math.round(analysisInfo["averageViews"]));
    item_value[1].innerHTML = Math.round(analysisInfo["continuousViewedPercent"] * 100) + "%";
    item_line[0].style.width = (analysisInfo["continuousViewedPercent"] * 100) + "%";
    //주 사용자층 - 위치
    if (analysisInfo["mainUserBase"]["location"] != null) {
        let percent = (analysisInfo["mainUserBase"]["percent"] * 100);
        item_value[2].innerHTML = `
            <img src = "` + getImageUrlCountry(analysisInfo["mainUserBase"]["location"]) + `" onload = "imageLoad(event);" alt = "">
            ` + getLanguage("location:" + analysisInfo["mainUserBase"]["location"]) + " (" + Math.round(percent) + "%)" + `
        `
        item_line[1].style.width = percent + "%";
    } else {
        item_value[2].innerHTML = getLanguage("menu_work_details_analysis_item_value_null");
    }
    //유입 경로
    if (analysisInfo["funnels"]["type"] != null) {
        let percent = (analysisInfo["funnels"]["percent"] * 100);
        if (isNaN(analysisInfo["funnels"]["type"]) == false) {
            item_value[3].innerHTML = getLanguage("workspace_work_analysis_summary_how_find_my_work:" + analysisInfo["funnels"]["type"]) + " (" + Math.round(percent) + "%)";
        } else {
            item_value[3].innerHTML = analysisInfo["funnels"]["type"] + " (" + Math.round(percent) + "%)";
        }
        item_line[2].style.width = percent + "%";
    } else {
        item_value[3].innerHTML = getLanguage("menu_work_details_analysis_item_value_null");
    }
    //현지화율
    if (workInfo["localization_language"] != null) {
        let localizationCount = (workInfo["localization_language"].split(",").length);
        let percent = ((localizationCount / (languages.length - 1)) * 100);
        item_value[4].innerHTML = getLanguage("menu_work_details_analysis_item_value_localization").replaceAll("{R:0}", languages.length - 1).replaceAll("{R:1}", localizationCount) + " (" + Math.round(percent) + "%)";
        item_line[3].style.width = percent + "%";
    } else {
        item_value[4].innerHTML = getLanguage("menu_work_details_analysis_item_value_localization").replaceAll("{R:0}", languages.length - 1).replaceAll("{R:1}", 0) + " (0%)";
        item_line[3].style.width = "0%";
    }
    //평균 업로드 간격
    if (analysisInfo["averageUploadInterval"] != null) {
        item_value[5].innerHTML = getTimeText(analysisInfo["averageUploadInterval"]);
    } else {
        item_value[5].innerHTML = getLanguage("menu_work_details_analysis_item_value_null");
    }
    //성별 차이
    let genderDifference = analysisInfo["genderPercent"]["male"] - analysisInfo["genderPercent"]["female"];
    (genderDifference < 0) ? genderDifference *= -1 : null;

    if (analysisInfo["genderPercent"]["male"] == 0 && analysisInfo["genderPercent"]["female"] == 0) {
        genderDifference = 0;
    }
    item_value[6].innerHTML = Math.round(genderDifference * 100) + "%";
    item_line[4].style.width = (genderDifference * 100) + "%";
    //남자
    item_value[7].innerHTML = Math.round(analysisInfo["genderPercent"]["male"] * 100) + "%";
    item_line[5].style.width = (analysisInfo["genderPercent"]["male"] * 100) + "%";
    //여자
    item_value[8].innerHTML = Math.round(analysisInfo["genderPercent"]["female"] * 100) + "%";
    item_line[6].style.width = (analysisInfo["genderPercent"]["female"] * 100) + "%";
    //나이
    if (analysisInfo["userAge"]["type"] != null) {
        let percent = (analysisInfo["userAge"]["percent"] * 100);
        let value = getLanguage("workspace_work_analysis_summary_demographic_value:age_type:" + analysisInfo["userAge"]["type"]);
        value += " (" + Math.round(percent) + "%)";
        item_value[9].innerHTML = value;
        item_line[7].style.width = percent + "%";
    } else {
        item_value[9].innerHTML = getLanguage("menu_work_details_analysis_item_value_null");
    }




    //작품에 기여한 사람
    let contribute_wrap = contents.getElementsByClassName("work_navigation_details_contribute_wrap")[0];
    let contribute_title = contents.getElementsByClassName("work_navigation_details_contribute_title")[0];
    contribute_title.innerHTML = getLanguage("menu_work_details_analysis_user_translation_title");
    let contribute_description = contents.getElementsByClassName("work_navigation_details_contribute_description")[0];
    contribute_description.innerHTML = getLanguage("menu_work_details_analysis_user_translation_description").replaceAll("{R:0}", 10);

    if (contributorInfo.length != 0) {
        let items = contents.getElementsByClassName("work_navigation_details_contribute_items")[0];
        for (let i = 0; i < contributorInfo.length; i++) {
            let description = "";
            if (contributorInfo[i]["description"] != null) {
                description = `
                    <div class = "work_navigation_details_contribute_item_right_description">` + contributorInfo[i]["description"] + `</div>
                `;
            }

            let newEl = document.createElement("div");
            newEl.classList.add("work_navigation_details_contribute_item");
            newEl.classList.add("md-ripples");
            newEl.classList.add("visible_element");
            newEl.setAttribute("onclick", "loadMenu_user(" + contributorInfo[i]["number"] + ");");
            newEl.innerHTML = `
                <div class = "work_navigation_details_contribute_item_left">
                    <div class = "profile_element">
                        <div class = "profile_info">` + JSON.stringify(contributorInfo[i]["profile"]) + `</div>
                        <div class = "profile_image"></div>
                    </div>
                </div>
                <div class = "work_navigation_details_contribute_item_right">
                    <div class = "work_navigation_details_contribute_item_right_nickname">
                        ` + contributorInfo[i]["nickname"] + `
                    </div>
                    ` + description + `
                </div>
            `;
            items.appendChild(newEl);
        }
    } else {
        contribute_wrap.remove();
    }
}