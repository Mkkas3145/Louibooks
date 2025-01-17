

function loadWorkNavigationHome(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    //
    let chapters_title = contents.getElementsByClassName("menu_work_home_item_title")[0];
    chapters_title.innerHTML = `
    ` + getLanguage("work_navigation_home_chapters_title") + `
        <div class = "menu_work_home_item_title_move md-ripples" onclick = "requestWorkNavigation(` + menuNumber + `, 'part_list');">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="10" height="3" rx="1.5" transform="translate(0 7)"/><rect width="35" height="3" rx="1.5" transform="translate(15 7)"/><rect width="10" height="3" rx="1.5" transform="translate(0 24)"/><rect width="10" height="3" rx="1.5" transform="translate(0 41)"/><rect width="29" height="3" rx="1.5" transform="translate(15 24)"/><rect width="35" height="3" rx="1.5" transform="translate(15 41)"/></g></svg>
            ` + getLanguage("work_navigation:part_list") + `
        </div>
    `;

    //작품 챕터
    let chapters_info = JSON.parse(contents.getElementsByClassName("chapters_info")[0].innerHTML);
    if (chapters_info.length != 0) {
        for (let i = 0; i < chapters_info.length; i++) {
            addContentsWorkNavigationHomeChaptersItem(menuNumber, chapters_info[i]);
        }
    } else {
        let chapters = contents.getElementsByClassName("menu_work_home_item_chapters")[0];
        chapters.innerHTML = `
            <div class = "workspace_work_part_list_no_data">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-3094.635,49.5H-3116.5a3,3,0,0,1-3-3V3.5a3,3,0,0,1,3-3h31a3,3,0,0,1,3,3V37.365L-3094.635,49.5Z" transform="translate(3126)" opacity="0.7"/><path d="M3151.333,49.5l12.293-12.293h-9.846a2.517,2.517,0,0,0-1.983.575,2.884,2.884,0,0,0-.464,2.039Z" transform="translate(-3120)" opacity="0.6"/></g></svg>
                <div class = "workspace_work_part_list_no_data_title">
                    ` + getLanguage("work_part_list_no_data_3") + `
                </div>
                <div class = "workspace_work_part_list_no_data_description">
                    ` + getLanguage("no_data_description") + `
                </div>
            </div>
        `;
    }

    //작품 회차
    let item_title = contents.getElementsByClassName("menu_work_home_item_title")[1];
    item_title.innerHTML = `
        ` + getLanguage("work_navigation:part_list") + `
        <div class = "menu_work_home_item_title_part_list_move md-ripples" onclick = "requestWorkNavigation(` + menuNumber + `, 'part_list');">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(61.651 50.24) rotate(180)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"/><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"/></g><rect width="49" height="3" rx="1.5" transform="translate(48.565 26.5) rotate(180)"/></g></svg>
        </div>
    `;
    let partInfo = JSON.parse(contents.getElementsByClassName("part_info")[0].innerHTML);
    if (partInfo != null && partInfo.length != 0) {
        let chapters = contents.getElementsByClassName("menu_work_home_item")[0];
        chapters.style.display = "none";

        //회차 개수
        let maxCount = 5; //항목이 최대 5개까지 표시됨
        let partCount = chapters_info[0]["count"];
        let difference = partCount - maxCount;

        if (difference > 0) {
            let description = contents.getElementsByClassName("menu_work_home_item_description_part_list")[0];
            description.innerHTML = getLanguage("work_navigation_home_part_list_description").replaceAll("{R:0}", difference).replaceAll("{R:1}", maxCount);
            description.style.display = "block";

            let more_button = contents.getElementsByClassName("menu_work_home_item_part_list_more_button")[0];
            more_button.style.display = "flex";
            let more_button_text = contents.getElementsByClassName("menu_work_home_item_part_list_more_button_text")[0];
            more_button_text.innerHTML = getLanguage("work_navigation_home_part_list_more").replaceAll("{R:0}", difference);
        }

        let items = contents.getElementsByClassName("menu_work_home_part_list_items")[0];
        for (let i = 0; i < partInfo.length; i++) {

            let html = getHtmlWorkNavigationPartListItem(menuNumber, partInfo[i]);
            let newEl = document.createElement("div");
            newEl.classList.add("visible_element");
            newEl.innerHTML = html;
        
            items.appendChild(newEl);
        }
    } else {
        let partList = contents.getElementsByClassName("menu_work_home_item")[1];
        partList.style.display = "none";
    }

    //작품 설명
    item_title = contents.getElementsByClassName("menu_work_home_item_title")[2];
    item_title.innerHTML = getLanguage("work_settings_description");

    let ratings_title = contents.getElementsByClassName("menu_work_home_item_title")[3];
    ratings_title.innerHTML = `
        ` + getLanguage("work_navigation:ratings") + `
        <div class = "menu_work_home_item_title_ratings_move md-ripples" onclick = "requestWorkNavigation(` + menuNumber + `, 'ratings');">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(61.651 50.24) rotate(180)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"/><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"/></g><rect width="49" height="3" rx="1.5" transform="translate(48.565 26.5) rotate(180)"/></g></svg>
        </div>
    `;

    //작품 장르
    let genreItems = contents.getElementsByClassName("menu_work_home_item_genre")[0];
    let genre = genreItems.innerHTML.split(",");
    genreItems.textContent = "";
    for (let i = 0; i < genre.length; i++) {
        let newEl = document.createElement("div");
        newEl.classList.add("menu_work_home_item_genre_item");
        newEl.innerHTML = getLanguage("genre:" + genre[i].trim());
        genreItems.appendChild(newEl);
    }

    //작품 평가 및 리뷰
    let ratings = contents.getElementsByClassName("menu_work_home_item_ratings")[0];
    let workNumber = Number.parseInt(contents.getElementsByClassName("work_number")[0].innerHTML.trim());
    let ratingsInfo = JSON.parse(contents.getElementsByClassName("ratings_info")[0].innerHTML);
    
    let property = {
        'hideSortBox': true
    }
    registerRatings(ratings, workNumber, ratingsInfo, property);

    //프리미엄이면 광고 표시 안함
    let isPremium = contents.getElementsByClassName("is_premium")[0].innerHTML.trim();
    if (isPremium == "false" || isPremium == false) {
        let google_adsense = contents.getElementsByClassName("google_adsense")[0];
        google_adsense.innerHTML = getElementGoogleAdsense(`
            <div style = "width: 100%; height: 1px; background-color: var(--border-color); margin: 40px 0px;"></div>
            <div style = "width: 100%; margin-left: auto; margin-right: auto;">
                <ins class="adsbygoogle"
                    style="display:block; text-align:center;"
                    data-ad-layout="in-article"
                    data-ad-format="fluid"
                    data-ad-client="ca-pub-9109662775581995"
                    data-ad-slot="7316427860">
                </ins>
            </div>
        `).outerHTML;
        google_adsense.style.display = null;
        checkElementGoogleAdsense(google_adsense);
    }
}



function addContentsWorkNavigationHomeChaptersItem(menuNumber, info) {
    let contents = document.getElementById("contents_" + menuNumber);
    let chapters = contents.getElementsByClassName("menu_work_home_item_chapters")[0];

    let newEl = document.createElement("div");
    newEl.classList.add("menu_work_home_item_chapters_item");
    newEl.classList.add("visible_element");
    newEl.classList.add("md-ripples");
    newEl.classList.add("img_wrap");
    newEl.setAttribute("onclick", "requestWorkNavigation(" + menuNumber + ", 'part_list', " + info["chapter"] + ");");
    newEl.innerHTML = `
        <img src = "` + info["thumbnailImage"] + `" onload = "imageLoad(event);">
        <div class = "menu_work_home_item_chapters_item_bottom">
            <div class = "menu_work_home_item_chapters_item_bottom_box">
                <div class = "menu_work_home_item_chapters_item_bottom_box_top">
                    ` + getLanguage("work_part_list_chapter").replaceAll("{R:0}", info["chapter"]) + `
                </div>
                <div class = "menu_work_home_item_chapters_item_bottom_box_title">
                    ` + info["title"] + `
                </div>
                <div class = "menu_work_home_item_chapters_item_bottom_box_count">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M27,30H3a3,3,0,0,1-3-3V3A3,3,0,0,1,3,0H27a3,3,0,0,1,3,3V27A3,3,0,0,1,27,30ZM2.647,2.647V27.353H27.353V2.647Z" transform="translate(0 20)"></path><rect width="32" height="3" rx="1.5" transform="translate(8 10)"></rect><rect width="31" height="3" rx="1.5" transform="translate(40 10) rotate(90)"></rect><rect width="32" height="3" rx="1.5" transform="translate(18)"></rect><rect width="32" height="3" rx="1.5" transform="translate(50) rotate(90)"></rect></g></svg>
                    ` + getCountNumberUnit(info["count"]) + `
                </div>
            </div>
        </div>
    `;

    chapters.prepend(newEl);
}