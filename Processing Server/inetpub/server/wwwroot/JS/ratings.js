


/* property 속성들

*/

function registerRatings(el, workNumber, info, property) {
    function callback() {
        if (loginStatus != null) {
            createRatings(el, workNumber, info, property);
        } else {
            window.requestAnimationFrame(callback);
        }
    }
    window.requestAnimationFrame(callback);
}

function createRatings(el, workNumber, info, property) {
    (property == null) ? property = new Array() : null;
    var uniqueNumber = Math.floor(Math.random() * 999999999999);

    let newEl = document.createElement("div");
    newEl.classList.add("ratings_box");
    newEl.setAttribute("unique_number", uniqueNumber);
    newEl.setAttribute("work_number", workNumber);
    newEl.setAttribute("ratings_numbers", info["numbers"]);
    if (property["hideWriteRatings"] != null) {
        newEl.setAttribute("hide_write_ratings", property["hideWriteRatings"]);
    }
    if (property["preferentiallyRatingNumber"] != null) {
        newEl.setAttribute("preferentially_rating_number", property["preferentiallyRatingNumber"]);
    }
    if (property["highlightedRatingNumber"] != null) {
        newEl.setAttribute("highlighted_rating_number", property["highlightedRatingNumber"]);
    }
    let box = el.appendChild(newEl);

    let numbers = info["numbers"].split(",");
    let numbersLength = numbers.length;
    if (numbers[0] == "" || numbers[0] == undefined || numbers[0] == null) {
        numbersLength = 0;
    }

    let sort = 0;
    if (property["sort"] != null && isNaN(property["sort"]) == false) {
        sort = property["sort"];
    }

    //정렬 박스
    if (property["hideSortBox"] == null || property["hideSortBox"] == false) {
        newEl = document.createElement("div");
        newEl.classList.add("ratings_box_top");
        newEl.innerHTML = `
            <div class = "ratings_box_top_text">
                ` + getLanguage("ratings_top_count").replaceAll("{R:0}", commas(numbersLength)) + `
            </div>
            <div class = "ratings_box_top_sort md-ripples" popupwidth = "max-content" value = "0" onchange = "loadRatings(getRatingsInfo(this));" onclick = "selectList(this, getRatingsSortItems());">
                <div class = "ratings_box_top_sort_icon">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="50" height="3" rx="1.5" transform="translate(0 7)"></rect><rect width="16" height="3" rx="1.5" transform="translate(0 41)"></rect><rect width="33" height="3" rx="1.5" transform="translate(0 24)"></rect></g></svg>
                </div>
                <div class = "ratings_box_top_sort_title value_title">` + getLanguage("ratings_sort:" + sort) + `</div>
            </div>
        `;
        box.appendChild(newEl);
    }

    //감싸기 박스
    newEl = document.createElement("div");
    newEl.classList.add("ratings_box_wrap");
    let wrap = box.appendChild(newEl);

    //평가 정보
    if (info["analysisInfo"] != null) {
        let score = info["analysisInfo"]["average"];
        score = Math.round(score * 10) / 10; //반올림
        let iconFillHtml = "";
        for (let i = 1; i <= 5; i++) {
            if (i > score) {
                if ((i - 0.5) > score) {
                    iconFillHtml += `<svg style = "opacity: 0;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-88.7,48.508a1.021,1.021,0,0,1-.808-.407.971.971,0,0,1-.158-.869l4.378-15.5a1,1,0,0,0-.335-1.05L-97.884,20.8a.978.978,0,0,1-.319-1.1.979.979,0,0,1,.921-.68l15.334-.412a1,1,0,0,0,.922-.681L-75.948,2.82A.988.988,0,0,1-75,2.139V39.054h-.006a.987.987,0,0,0-.581.189l-12.534,9.07A.99.99,0,0,1-88.7,48.508Z" transform="translate(100)"/></g></svg>`;
                } else {
                    iconFillHtml += `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-88.7,48.508a1.021,1.021,0,0,1-.808-.407.971.971,0,0,1-.158-.869l4.378-15.5a1,1,0,0,0-.335-1.05L-97.884,20.8a.978.978,0,0,1-.319-1.1.979.979,0,0,1,.921-.68l15.334-.412a1,1,0,0,0,.922-.681L-75.948,2.82A.988.988,0,0,1-75,2.139V39.054h-.006a.987.987,0,0,0-.581.189l-12.534,9.07A.99.99,0,0,1-88.7,48.508Z" transform="translate(100)"/></g></svg>`;
                }
            } else {
                iconFillHtml += `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M24.052,2.82a1,1,0,0,1,1.9,0l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a1,1,0,0,1,.6,1.778L35.627,30.68a1,1,0,0,0-.335,1.05l4.377,15.5a1,1,0,0,1-1.549,1.082l-12.534-9.07a1,1,0,0,0-1.172,0l-12.534,9.07a1,1,0,0,1-1.549-1.082l4.377-15.5a1,1,0,0,0-.335-1.05L2.116,20.8a1,1,0,0,1,.6-1.778l15.335-.412a1,1,0,0,0,.921-.681Z"/></g></svg>`;
            }
        }
        newEl = document.createElement("div");
        newEl.classList.add("ratings_box_info");
        newEl.innerHTML = `
            <div class = "ratings_box_info_left">
                <div class = "ratings_box_info_left_score">
                    ` + score.toFixed(1) + `
                </div>
                <div class = "ratings_box_info_left_icon">
                    <div class = "ratings_box_info_left_icon_items">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M24.052,2.82a1,1,0,0,1,1.9,0l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a1,1,0,0,1,.6,1.778L35.627,30.68a1,1,0,0,0-.335,1.05l4.377,15.5a1,1,0,0,1-1.549,1.082l-12.534-9.07a1,1,0,0,0-1.172,0l-12.534,9.07a1,1,0,0,1-1.549-1.082l4.377-15.5a1,1,0,0,0-.335-1.05L2.116,20.8a1,1,0,0,1,.6-1.778l15.335-.412a1,1,0,0,0,.921-.681Z"/></g></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M24.052,2.82a1,1,0,0,1,1.9,0l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a1,1,0,0,1,.6,1.778L35.627,30.68a1,1,0,0,0-.335,1.05l4.377,15.5a1,1,0,0,1-1.549,1.082l-12.534-9.07a1,1,0,0,0-1.172,0l-12.534,9.07a1,1,0,0,1-1.549-1.082l4.377-15.5a1,1,0,0,0-.335-1.05L2.116,20.8a1,1,0,0,1,.6-1.778l15.335-.412a1,1,0,0,0,.921-.681Z"/></g></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M24.052,2.82a1,1,0,0,1,1.9,0l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a1,1,0,0,1,.6,1.778L35.627,30.68a1,1,0,0,0-.335,1.05l4.377,15.5a1,1,0,0,1-1.549,1.082l-12.534-9.07a1,1,0,0,0-1.172,0l-12.534,9.07a1,1,0,0,1-1.549-1.082l4.377-15.5a1,1,0,0,0-.335-1.05L2.116,20.8a1,1,0,0,1,.6-1.778l15.335-.412a1,1,0,0,0,.921-.681Z"/></g></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M24.052,2.82a1,1,0,0,1,1.9,0l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a1,1,0,0,1,.6,1.778L35.627,30.68a1,1,0,0,0-.335,1.05l4.377,15.5a1,1,0,0,1-1.549,1.082l-12.534-9.07a1,1,0,0,0-1.172,0l-12.534,9.07a1,1,0,0,1-1.549-1.082l4.377-15.5a1,1,0,0,0-.335-1.05L2.116,20.8a1,1,0,0,1,.6-1.778l15.335-.412a1,1,0,0,0,.921-.681Z"/></g></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M24.052,2.82a1,1,0,0,1,1.9,0l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a1,1,0,0,1,.6,1.778L35.627,30.68a1,1,0,0,0-.335,1.05l4.377,15.5a1,1,0,0,1-1.549,1.082l-12.534-9.07a1,1,0,0,0-1.172,0l-12.534,9.07a1,1,0,0,1-1.549-1.082l4.377-15.5a1,1,0,0,0-.335-1.05L2.116,20.8a1,1,0,0,1,.6-1.778l15.335-.412a1,1,0,0,0,.921-.681Z"/></g></svg>
                    </div>
                    <div class = "ratings_box_info_left_icon_items ratings_box_info_left_icon_fill">
                        ` + iconFillHtml + `
                    </div>
                </div>
                <div class = "ratings_box_info_left_count">
                    ` + getLanguage("ratings_info_count").replaceAll("{R:0}", commas(numbersLength)) + `
                </div>
            </div>
            <div class = "ratings_box_info_right">
                <div class = "ratings_box_info_right_item">
                    <div class = "ratings_box_info_right_item_star_count">
                        5
                    </div>
                    <div class = "ratings_box_info_right_item_star_line_wrap" onmouseenter = "hoverInformation(this, '` + info["analysisInfo"]["5"]["count"] + `');">
                        <div class = "ratings_box_info_right_item_star_line" style = "width: ` + (info["analysisInfo"]["5"]["ratio"] * 100) + `%;"></div>
                    </div>
                </div>
                <div class = "ratings_box_info_right_item">
                    <div class = "ratings_box_info_right_item_star_count">
                        4
                    </div>
                    <div class = "ratings_box_info_right_item_star_line_wrap" onmouseenter = "hoverInformation(this, '` + info["analysisInfo"]["4"]["count"] + `');">
                        <div class = "ratings_box_info_right_item_star_line" style = "width: ` + (info["analysisInfo"]["4"]["ratio"] * 100) + `%;"></div>
                    </div>
                </div>
                <div class = "ratings_box_info_right_item">
                    <div class = "ratings_box_info_right_item_star_count">
                        3
                    </div>
                    <div class = "ratings_box_info_right_item_star_line_wrap" onmouseenter = "hoverInformation(this, '` + info["analysisInfo"]["3"]["count"] + `');">
                        <div class = "ratings_box_info_right_item_star_line" style = "width: ` + (info["analysisInfo"]["3"]["ratio"] * 100) + `%;"></div>
                    </div>
                </div>
                <div class = "ratings_box_info_right_item">
                    <div class = "ratings_box_info_right_item_star_count">
                        2
                    </div>
                    <div class = "ratings_box_info_right_item_star_line_wrap" onmouseenter = "hoverInformation(this, '` + info["analysisInfo"]["2"]["count"] + `');">
                        <div class = "ratings_box_info_right_item_star_line" style = "width: ` + (info["analysisInfo"]["2"]["ratio"] * 100) + `%;"></div>
                    </div>
                </div>
                <div class = "ratings_box_info_right_item">
                    <div class = "ratings_box_info_right_item_star_count">
                        1
                    </div>
                    <div class = "ratings_box_info_right_item_star_line_wrap" onmouseenter = "hoverInformation(this, '` + info["analysisInfo"]["1"]["count"] + `');">
                        <div class = "ratings_box_info_right_item_star_line" style = "width: ` + (info["analysisInfo"]["1"]["ratio"] * 100) + `%;"></div>
                    </div>
                </div>
            </div>
        `;
        wrap.appendChild(newEl);
    }

    //Contents 박스
    newEl = document.createElement("div");
    newEl.classList.add("ratings_box_contents");
    let contents = wrap.appendChild(newEl);
    if (info["analysisInfo"] == null) {
        contents.style.width = "100%";
        contents.style.marginLeft = "0px";
    }

    //평가 및 리뷰 작성
    if (loginStatus["isLogin"] == true && (property["hideWriteRatings"] == null || property["hideWriteRatings"] == false)) {
        //커뮤니티 가이드 지침
        let follow_our_title = getLanguage("follow_our_community_guide_ratings");
        follow_our_title = follow_our_title.replaceAll("{R:0}", '<span class = "md-ripples" onclick = "loadMenu_community_guide();">' + getLanguage("menu_name:community_guide") + "</span>");

        //커뮤니티 자격 없음
        if (loginStatus["community_permission"] == false) {
            follow_our_title = getLanguage("no_community_permission_message");
        }

        //
        newEl = document.createElement("div");
        newEl.classList.add("ratings_box_write_wrap");
        if (info["isWritable"] == false) {
            newEl.style.display = "none";
        }
        newEl.innerHTML = `
            <div class = "follow_our_community_guide" style = "margin-bottom: 20px;">
                <div class = "follow_our_community_guide_icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.070c-1.884-1.821-3.053-4.37-3.053-7.193 0-5.523 4.477-10 10-10 2.823 0 5.372 1.169 7.19 3.050l0.003 0.003c1.737 1.796 2.807 4.247 2.807 6.947 0 5.523-4.477 10-10 10-2.7 0-5.151-1.070-6.95-2.81l0.003 0.003zM9 5v6h2v-6h-2zM9 13v2h2v-2h-2z"></path></svg>
                </div>
                <div class = "follow_our_community_guide_right">
                    <div class = "follow_our_community_guide_right_title">
                        ` + follow_our_title + `
                    </div>
                </div>
            </div>
            <div class = "ratings_box_write">
                <div class = "ratings_box_write_left">
                    <div class = "profile_element">
                        <div class = "profile_info">` + JSON.stringify(loginStatus["profile"]) + `</div>
                        <div class = "profile_image"></div>
                    </div>
                </div>
                <div class = "ratings_box_write_right">
                    <div class = "ratings_box_write_right_nickname">
                        ` + loginStatus["nickname"] + `
                    </div>
                    <div class = "ratings_box_write_right_read_more" onclick = "ratingsWriteInputActivate(this);">
                        ` + getLanguage("ratings_write_read_more") + `
                    </div>
                    <div class = "ratings_box_write_right_wrap">
                        <div class = "ratings_box_write_right_score" score = "0">
                            <div class = "ratings_box_write_right_score_item md-ripples" onclick = "ratingsWriteSetScore(this, 1);">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M24.052,2.82a1,1,0,0,1,1.9,0l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a1,1,0,0,1,.6,1.778L35.627,30.68a1,1,0,0,0-.335,1.05l4.377,15.5a1,1,0,0,1-1.549,1.082l-12.534-9.07a1,1,0,0,0-1.172,0l-12.534,9.07a1,1,0,0,1-1.549-1.082l4.377-15.5a1,1,0,0,0-.335-1.05L2.116,20.8a1,1,0,0,1,.6-1.778l15.335-.412a1,1,0,0,0,.921-.681Z"></path></g></svg>
                            </div>
                            <div class = "ratings_box_write_right_score_item md-ripples" onclick = "ratingsWriteSetScore(this, 2);">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M24.052,2.82a1,1,0,0,1,1.9,0l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a1,1,0,0,1,.6,1.778L35.627,30.68a1,1,0,0,0-.335,1.05l4.377,15.5a1,1,0,0,1-1.549,1.082l-12.534-9.07a1,1,0,0,0-1.172,0l-12.534,9.07a1,1,0,0,1-1.549-1.082l4.377-15.5a1,1,0,0,0-.335-1.05L2.116,20.8a1,1,0,0,1,.6-1.778l15.335-.412a1,1,0,0,0,.921-.681Z"></path></g></svg>
                            </div>
                            <div class = "ratings_box_write_right_score_item md-ripples" onclick = "ratingsWriteSetScore(this, 3);">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M24.052,2.82a1,1,0,0,1,1.9,0l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a1,1,0,0,1,.6,1.778L35.627,30.68a1,1,0,0,0-.335,1.05l4.377,15.5a1,1,0,0,1-1.549,1.082l-12.534-9.07a1,1,0,0,0-1.172,0l-12.534,9.07a1,1,0,0,1-1.549-1.082l4.377-15.5a1,1,0,0,0-.335-1.05L2.116,20.8a1,1,0,0,1,.6-1.778l15.335-.412a1,1,0,0,0,.921-.681Z"></path></g></svg>
                            </div>
                            <div class = "ratings_box_write_right_score_item md-ripples" onclick = "ratingsWriteSetScore(this, 4);">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M24.052,2.82a1,1,0,0,1,1.9,0l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a1,1,0,0,1,.6,1.778L35.627,30.68a1,1,0,0,0-.335,1.05l4.377,15.5a1,1,0,0,1-1.549,1.082l-12.534-9.07a1,1,0,0,0-1.172,0l-12.534,9.07a1,1,0,0,1-1.549-1.082l4.377-15.5a1,1,0,0,0-.335-1.05L2.116,20.8a1,1,0,0,1,.6-1.778l15.335-.412a1,1,0,0,0,.921-.681Z"></path></g></svg>
                            </div>
                            <div class = "ratings_box_write_right_score_item md-ripples" onclick = "ratingsWriteSetScore(this, 5);">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M24.052,2.82a1,1,0,0,1,1.9,0l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a1,1,0,0,1,.6,1.778L35.627,30.68a1,1,0,0,0-.335,1.05l4.377,15.5a1,1,0,0,1-1.549,1.082l-12.534-9.07a1,1,0,0,0-1.172,0l-12.534,9.07a1,1,0,0,1-1.549-1.082l4.377-15.5a1,1,0,0,0-.335-1.05L2.116,20.8a1,1,0,0,1,.6-1.778l15.335-.412a1,1,0,0,0,.921-.681Z"></path></g></svg>
                            </div>
                        </div>
                        <div class = "ratings_box_write_right_input">
                            <div class = "ratings_box_write_right_input_textbox" contenteditable = "true" placeholder = "` + getLanguage("ratings_write_read_more") + `" onkeydown = "textbox_remove_spaces(this); checkRatingsWrite(this);" onpaste = "contenteditable_paste(event);" onfocus = "ratingsWriteInputFocus(this);" onblur = "ratingsWriteInputBlur(this);"></div>
                            <div class = "ratings_box_write_right_input_textbox_line_wrap"></div>
                        </div>
                        <div class = "ratings_box_write_right_bottom">
                            <div class = "ratings_box_write_right_bottom_right">
                                <div class = "ratings_box_write_right_bottom_right_cancel md-ripples" onclick = "ratingsWriteInputDisabled(this);" onmouseenter = "hoverInformation(this, getLanguage('ratings_write_cancel_button'));">
                                    <!-- Generated by IcoMoon.io -->
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M9 1c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zM3 9c0-1.294 0.416-2.491 1.116-3.472l8.356 8.356c-0.981 0.7-2.178 1.116-3.472 1.116-3.309 0-6-2.691-6-6zM13.884 12.472l-8.356-8.356c0.981-0.7 2.178-1.116 3.472-1.116 3.309 0 6 2.691 6 6 0 1.294-0.416 2.491-1.116 3.472z"></path></svg>
                                </div>
                                <div class = "ratings_box_write_right_bottom_right_submit md-ripples" onclick = "submitButtonRatingsWrite(this);" onmouseenter = "hoverInformation(this, getLanguage('ratings_write_submit_button'));">
                                    <!-- Generated by IcoMoon.io -->
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.016 21v-6.984l15-2.016-15-2.016v-6.984l21 9z"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 로딩 스피너 -->
                <div class = "ratings_box_write_loading_box">
                    <div class="showbox">
                        <div class="loader" style="width: 35px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle></svg></div>
                    </div>
                </div>
            </div>
        `;
        contents.appendChild(newEl);
    }

    //Items 박스
    newEl = document.createElement("div");
    newEl.classList.add("ratings_box_items");
    let items = contents.appendChild(newEl);

    //데이터 없음
    newEl = document.createElement("div");
    newEl.classList.add("ratings_box_no_data");
    newEl.style.display = "none";
    newEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-3094.635,49.5H-3116.5a3,3,0,0,1-3-3V3.5a3,3,0,0,1,3-3h31a3,3,0,0,1,3,3V37.365L-3094.635,49.5Z" transform="translate(3126)" opacity="0.7"/><path d="M3151.333,49.5l12.293-12.293h-9.846a2.517,2.517,0,0,0-1.983.575,2.884,2.884,0,0,0-.464,2.039Z" transform="translate(-3120)" opacity="0.6"/></g></svg>
        <div class = "ratings_box_no_data_title">
            ` + getLanguage("ratings_no_data") + `
        </div>
        <div class = "ratings_box_no_data_description">
            ` + getLanguage("no_data_description") + `
        </div>
    `;
    contents.appendChild(newEl);

    //
    let ratingsNumbers = info["numbers"].split(",");
    if (info["info"] != null) {
        for (let i = 0; i < info["info"].length; i++) {
            createRatingsItem(items, info["info"][i]);
            ratingsNumbers = ratingsNumbers.remove("" + info["info"][i]["number"]);
        }
    } else {
        showRatingsNoData(uniqueNumber);
    }
    box.setAttribute("ratings_numbers", ratingsNumbers.join(","));

    //댓글 무한 스크롤
    newEl = document.createElement("div");
    newEl.classList.add("ratings_box_more_load");
    newEl.setAttribute("loading", false);
    newEl.innerHTML = `
        <!-- 로딩 스피너 -->
        <div class="showbox">
            <div class="loader" style="width: 35px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle></svg></div>
        </div>
    `;
    if (ratingsNumbers[0] == '' || ratingsNumbers[0] == undefined || ratingsNumbers[0] == null) {
        newEl.style.display = "none";
    }
    contents.appendChild(newEl);
}
function showRatingsNoData(uniqueNumber) {
    let el = null;
    let ratings_box = document.getElementsByClassName("ratings_box");
    for (let i = 0; i < ratings_box.length; i++) {
        if (ratings_box[i].getAttribute("unique_number") == uniqueNumber) {
            el = ratings_box[i];
        }
    }

    let no_data = el.getElementsByClassName("ratings_box_no_data")[0];
    no_data.style.display = null;
}
function hideRatingsNoData(uniqueNumber) {
    let el = null;
    let ratings_box = document.getElementsByClassName("ratings_box");
    for (let i = 0; i < ratings_box.length; i++) {
        if (ratings_box[i].getAttribute("unique_number") == uniqueNumber) {
            el = ratings_box[i];
        }
    }

    let no_data = el.getElementsByClassName("ratings_box_no_data")[0];
    no_data.style.display = "none";
}








function ratingsWriteInputActivate(el) {
    let parent = el.parentElement;
    checkRatingsWriteInputHeight(parent);
    parent.classList.add('ratings_box_write_right_activate');

    let textbox = parent.getElementsByClassName("ratings_box_write_right_input_textbox")[0];
    textbox.focus();
}
function ratingsWriteInputDisabled(el) {
    let parent = el.parentElement.parentElement.parentElement.parentElement;
    checkRatingsWriteInputHeight(parent);
    parent.classList.remove('ratings_box_write_right_activate');

    let textbox = parent.getElementsByClassName("ratings_box_write_right_input_textbox")[0];
    textbox.blur();
    textbox.innerText = '';

    let score = parent.getElementsByClassName("ratings_box_write_right_score")[0];
    score.setAttribute("score", "0");

    checkRatingsWrite(el);
}
function checkRatingsWriteInputHeight(input_box) {
    let height = input_box.clientHeight;
    
    function callback() {
        let afterHeight = input_box.clientHeight;
        input_box.style.height = height + "px";
        function callback2() {
            input_box.style.height = afterHeight + "px";
            setTimeout(() => {
                input_box.style.height = null;
            }, 200);
        }
        window.requestAnimationFrame(callback2);
    }
    window.requestAnimationFrame(callback);
}
function ratingsWriteSetScore(el, score) {
    let parent = el.parentElement;
    if (parent.getAttribute("score") == score) {
        parent.setAttribute("score", 0);
    } else {
        parent.setAttribute("score", score);
    }
    checkRatingsWrite(el);
}
function ratingsWriteInputFocus(el) {
    let parent = el.parentElement;
    parent.classList.add('ratings_box_write_right_input_textbox_focus');
}
function ratingsWriteInputBlur(el) {
    let parent = el.parentElement;
    parent.classList.remove('ratings_box_write_right_input_textbox_focus');
}
function checkRatingsWrite(el) {
    function callback() {
        let ratingsInfo = getRatingsInfo(el);

        let element = ratingsInfo["element"];
        let write = element.getElementsByClassName("ratings_box_write")[0];
        let textbox = write.getElementsByClassName("ratings_box_write_right_input_textbox")[0];
        let score = write.getElementsByClassName("ratings_box_write_right_score")[0];
        let submit = write.getElementsByClassName("ratings_box_write_right_bottom_right_submit")[0];
    
        if (textbox.innerText.trim() != "" && score.getAttribute("score") != 0) {
            submit.classList.add("ratings_box_write_right_bottom_right_submit_activate");
        } else {
            submit.classList.remove("ratings_box_write_right_bottom_right_submit_activate");
        }
    }
    window.requestAnimationFrame(callback);
}

function loadingRatingsWrite(el) {
    let left = el.getElementsByClassName("ratings_box_write_left")[0];
    let right = el.getElementsByClassName("ratings_box_write_right")[0];
    left.style.opacity = "0.5";
    right.style.opacity = "0.5";

    let write = el.getElementsByClassName("ratings_box_write")[0];
    let loading_box = el.getElementsByClassName("ratings_box_write_loading_box")[0];
    loading_box.style.height = (write.clientHeight + "px");
    loading_box.style.width = (write.clientWidth + "px");
    loading_box.style.display = "flex";
}
function loadingCompleteRatingsWrite(el) {
    let height = el.clientHeight;
    el.style.transition = "all 0.2s";
    el.style.height = height + "px";
    function callback() {
        el.style.animation = "deleteRatingsWrite 0.2s forwards";
        el.style.height = "0px";
        el.style.marginBottom = "0px";
        setTimeout(() => {
            el.style.display = "none";
            el.style.height = null;
            el.style.marginBottom = null;
            el.style.animation = null;
            el.style.transition = null;

            //복구
            let left = el.getElementsByClassName("ratings_box_write_left")[0];
            let right = el.getElementsByClassName("ratings_box_write_right")[0];
            left.style.opacity = null;
            right.style.opacity = null;

            let loading_box = el.getElementsByClassName("ratings_box_write_loading_box")[0];
            loading_box.style.height = null;
            loading_box.style.width = null;
            loading_box.style.display = null;

            let cancel = el.getElementsByClassName("ratings_box_write_right_bottom_right_cancel")[0];
            ratingsWriteInputDisabled(cancel);
        }, 200);
    }
    window.requestAnimationFrame(callback);
}













function submitButtonRatingsWrite(el) {
    let parent = el.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
    loadingRatingsWrite(parent);

    let ratingsInfo = getRatingsInfo(el);
    let content = parent.getElementsByClassName("ratings_box_write_right_input_textbox")[0].innerText.replaceAll('\n\n','\n').trim();
    let score = Number.parseInt(parent.getElementsByClassName("ratings_box_write_right_score")[0].getAttribute("score"));

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/ratings/upload.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;

                if (xhrHtml.trim() == "no_community_permission") {
                    //커뮤니티 자격 없음
                    actionMessage(getLanguage("no_community_permission_message"));
                } else {
                    let items = ratingsInfo["element"].getElementsByClassName("ratings_box_items")[0];
                    let info = JSON.parse(xhrHtml);
                    setTimeout(() => {
                        createRatingsItem(items, info, true);
                    }, 200);
    
                    //
                    actionMessage(getLanguage("ratings_write_upload_message"));
                }

                loadingCompleteRatingsWrite(parent);
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
    formData.append("workNumber", ratingsInfo["workNumber"]);
    formData.append("content", content);
    formData.append("score", score);

    xhr.send(formData);
}















function createRatingsItem(el, info, isNew) {
    let newEl = document.createElement("div");
    newEl.classList.add("ratings_box_item");
    newEl.classList.add("visible_element");
    newEl.classList.add("variable_element");
    newEl.setAttribute("ratings_number", info["number"]);

    //평가 아이콘
    let score = info["score"];
    let iconFillHtml = "";
    for (let i = 1; i <= 5; i++) {
        if (i > score) {
            iconFillHtml += `<svg style = "opacity: 0;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M24.052,2.82a1,1,0,0,1,1.9,0l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a1,1,0,0,1,.6,1.778L35.627,30.68a1,1,0,0,0-.335,1.05l4.377,15.5a1,1,0,0,1-1.549,1.082l-12.534-9.07a1,1,0,0,0-1.172,0l-12.534,9.07a1,1,0,0,1-1.549-1.082l4.377-15.5a1,1,0,0,0-.335-1.05L2.116,20.8a1,1,0,0,1,.6-1.778l15.335-.412a1,1,0,0,0,.921-.681Z"/></g></svg>`;
        } else {
            iconFillHtml += `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M24.052,2.82a1,1,0,0,1,1.9,0l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a1,1,0,0,1,.6,1.778L35.627,30.68a1,1,0,0,0-.335,1.05l4.377,15.5a1,1,0,0,1-1.549,1.082l-12.534-9.07a1,1,0,0,0-1.172,0l-12.534,9.07a1,1,0,0,1-1.549-1.082l4.377-15.5a1,1,0,0,0-.335-1.05L2.116,20.8a1,1,0,0,1,.6-1.778l15.335-.412a1,1,0,0,0,.921-.681Z"/></g></svg>`;
        }
    }

    let addClassLikes = "";
    if (info["liked"] == true) {
        addClassLikes = " ratings_box_item_right_questions_item_checked";
    }
    let addClassDislike = "";
    if (info["disliked"] == true) {
        addClassDislike = " ratings_box_item_right_questions_item_checked";
    }

    let ratingsInfo = getRatingsInfo(el);

    //하이라이트 평가 및 리뷰
    let highlightedRating = "";
    if (ratingsInfo["highlightedRatingNumber"] == info["number"]) {
        highlightedRating = `
            <div class = "ratings_box_item_right_highlighted_rating immutable_element" style = "animation: highlighted_rating_item 1s;">
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7.5 5.578l2.484 1.406-1.406-2.484 1.406-2.484-2.484 1.406-2.484-1.406 1.406 2.484-1.406 2.484zM19.5 15.422l-2.484-1.406 1.406 2.484-1.406 2.484 2.484-1.406 2.484 1.406-1.406-2.484 1.406-2.484zM21.984 2.016l-2.484 1.406-2.484-1.406 1.406 2.484-1.406 2.484 2.484-1.406 2.484 1.406-1.406-2.484zM14.391 7.313q-0.328-0.328-0.727-0.328t-0.727 0.328l-11.625 11.625q-0.328 0.328-0.328 0.727t0.328 0.727l2.297 2.297q0.328 0.328 0.727 0.328t0.727-0.328l11.625-11.625q0.328-0.328 0.328-0.727t-0.328-0.68l-2.297-2.344zM13.359 12.797l-2.156-2.156 2.438-2.438 2.156 2.156-2.438 2.438z"></path></svg>
                <div class = "ratings_box_item_right_highlighted_rating_text">
                    ` + getLanguage("highlighted_rating") + `
                </div>
            </div>
        `;
    }

    //평가 및 리뷰를 쓴 주인인지
    let isWriter = false;
    if (info["user_number"] == loginStatus["number"]) {
        isWriter = true;
    }
    
    newEl.innerHTML = `
        ` + highlightedRating + `
        <div class = "ratings_box_item_flex">
            <div class = "ratings_box_item_left immutable_element md-ripples" onclick = "loadMenu_user(` + info["user_number"] + `);">
                <div class="profile_element">
                    <div class="profile_info">` + JSON.stringify(info["profile"]) + `</div>
                    <div class="profile_image"></div>
                </div>
            </div>
            <div class = "ratings_box_item_right">
                <div class = "ratings_box_item_right_top immutable_element">
                    <div class = "ratings_box_item_right_top_nickname md-ripples" onclick = "loadMenu_user(` + info["user_number"] + `);">
                        ` + info["nickname"] + `
                    </div>
                    <div class = "ratings_box_item_right_top_date">
                        · ` + getTimePast(new Date(info["upload_date"])) + `
                    </div>
                    <div class = "ratings_box_item_right_top_more_button md-ripples" onclick = "moreButtonRatingsItem(this, ` + info["number"] + `, ` + isWriter + `);">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-1 -1.061)"><circle cx="3" cy="3" r="3" transform="translate(23 4)"></circle><path d="M3,0A2.971,2.971,0,0,1,6,2.942,2.971,2.971,0,0,1,3,5.884,2.971,2.971,0,0,1,0,2.942,2.971,2.971,0,0,1,3,0Z" transform="translate(23 23)"></path><path d="M3,0A3.031,3.031,0,0,1,6,3.061,3.031,3.031,0,0,1,3,6.121,3.031,3.031,0,0,1,0,3.061,3.031,3.031,0,0,1,3,0Z" transform="translate(23 42)"></path></g></g></svg>
                    </div>
                </div>
                <div class = "ratings_box_item_right_star_rating immutable_element">
                    <div class = "ratings_box_item_right_star_rating_items">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M24.052,2.82a1,1,0,0,1,1.9,0l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a1,1,0,0,1,.6,1.778L35.627,30.68a1,1,0,0,0-.335,1.05l4.377,15.5a1,1,0,0,1-1.549,1.082l-12.534-9.07a1,1,0,0,0-1.172,0l-12.534,9.07a1,1,0,0,1-1.549-1.082l4.377-15.5a1,1,0,0,0-.335-1.05L2.116,20.8a1,1,0,0,1,.6-1.778l15.335-.412a1,1,0,0,0,.921-.681Z"/></g></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M24.052,2.82a1,1,0,0,1,1.9,0l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a1,1,0,0,1,.6,1.778L35.627,30.68a1,1,0,0,0-.335,1.05l4.377,15.5a1,1,0,0,1-1.549,1.082l-12.534-9.07a1,1,0,0,0-1.172,0l-12.534,9.07a1,1,0,0,1-1.549-1.082l4.377-15.5a1,1,0,0,0-.335-1.05L2.116,20.8a1,1,0,0,1,.6-1.778l15.335-.412a1,1,0,0,0,.921-.681Z"/></g></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M24.052,2.82a1,1,0,0,1,1.9,0l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a1,1,0,0,1,.6,1.778L35.627,30.68a1,1,0,0,0-.335,1.05l4.377,15.5a1,1,0,0,1-1.549,1.082l-12.534-9.07a1,1,0,0,0-1.172,0l-12.534,9.07a1,1,0,0,1-1.549-1.082l4.377-15.5a1,1,0,0,0-.335-1.05L2.116,20.8a1,1,0,0,1,.6-1.778l15.335-.412a1,1,0,0,0,.921-.681Z"/></g></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M24.052,2.82a1,1,0,0,1,1.9,0l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a1,1,0,0,1,.6,1.778L35.627,30.68a1,1,0,0,0-.335,1.05l4.377,15.5a1,1,0,0,1-1.549,1.082l-12.534-9.07a1,1,0,0,0-1.172,0l-12.534,9.07a1,1,0,0,1-1.549-1.082l4.377-15.5a1,1,0,0,0-.335-1.05L2.116,20.8a1,1,0,0,1,.6-1.778l15.335-.412a1,1,0,0,0,.921-.681Z"/></g></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M24.052,2.82a1,1,0,0,1,1.9,0l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a1,1,0,0,1,.6,1.778L35.627,30.68a1,1,0,0,0-.335,1.05l4.377,15.5a1,1,0,0,1-1.549,1.082l-12.534-9.07a1,1,0,0,0-1.172,0l-12.534,9.07a1,1,0,0,1-1.549-1.082l4.377-15.5a1,1,0,0,0-.335-1.05L2.116,20.8a1,1,0,0,1,.6-1.778l15.335-.412a1,1,0,0,0,.921-.681Z"/></g></svg>
                    </div>
                    <div class = "ratings_box_item_right_star_rating_items ratings_box_item_right_star_rating_fill">
                        ` + iconFillHtml + `
                    </div>
                </div>
                <div class = "ratings_box_item_right_content">
                    <div class = "ratings_box_item_right_content_texts">` + textToURL(info["content"]) + `</div>
                </div>
                <div class = "ratings_box_item_right_line"></div>
                <div class = "ratings_box_item_right_questions">
                    <div class = "ratings_box_item_right_questions_text" likes = "` + info["likes"] + `">
                        ` + getLanguage("ratings_item_questions").replaceAll("{R:0}", commas(info["likes"])) + `
                    </div>
                    <div class = "ratings_box_item_right_questions_items immutable_element">
                        <div class = "ratings_box_item_right_questions_item` + addClassLikes + ` md-ripples" onclick = "likesButtonRatingsItem(this);">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,25H2a2,2,0,0,1-2-2V2A2,2,0,0,1,2,0h9a2,2,0,0,1,2,2V23A2,2,0,0,1,11,25ZM3,3V22h7V3Z" transform="translate(0 22)"></path><path d="M29.891,44.45H1.733a1.868,1.868,0,0,1-1.224-.511A1.982,1.982,0,0,1,0,42.469c.016-1.947,0-21.23,0-22.05L14.682,2.173A7.441,7.441,0,0,1,19.5,0a5.453,5.453,0,0,1,2.441.588,4.405,4.405,0,0,1,2.637,3.769,5.912,5.912,0,0,1-.314,2.3c-.053.119-5.339,11.957-5.81,13.943H32.295a2.518,2.518,0,0,1,1.149.888,6.6,6.6,0,0,1,1.07,4.314A50.508,50.508,0,0,1,32.532,36.58l-2.641,7.869ZM19.7,2.931a4.877,4.877,0,0,0-2.353.816c-.917.543-14.2,17.567-14.332,17.739V41.439h24.8c2.66-7.819,3.451-12.257,3.647-14.6.212-2.54-.21-3.242-.215-3.249H14.125c.851-3,3.968-10.2,5.831-14.5.534-1.234.955-2.205,1.172-2.732.94-2.283.323-2.792-.652-3.262A1.764,1.764,0,0,0,19.7,2.931Z" transform="translate(14.814 2.158)"></path></g></svg>
                            <span>` + getLanguage("ratings_item_questions_item:yes") + `</span>
                        </div>
                        <div class = "ratings_box_item_right_questions_item` + addClassDislike + ` md-ripples" onclick = "dislikeButtonRatingsItem(this);">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,25H2a2,2,0,0,1-2-2V2A2,2,0,0,1,2,0h9a2,2,0,0,1,2,2V23A2,2,0,0,1,11,25ZM3,3V22h7V3Z" transform="translate(49.33 27.158) rotate(180)"></path><path d="M29.891,44.45H1.733a1.868,1.868,0,0,1-1.224-.511A1.982,1.982,0,0,1,0,42.469c.016-1.947,0-21.23,0-22.05L14.682,2.173A7.441,7.441,0,0,1,19.5,0a5.453,5.453,0,0,1,2.441.588,4.405,4.405,0,0,1,2.637,3.769,5.912,5.912,0,0,1-.314,2.3c-.053.119-5.339,11.957-5.81,13.943H32.295a2.518,2.518,0,0,1,1.149.888,6.6,6.6,0,0,1,1.07,4.314A50.508,50.508,0,0,1,32.532,36.58l-2.641,7.869ZM19.7,2.931a4.877,4.877,0,0,0-2.353.816c-.917.543-14.2,17.567-14.332,17.739V41.439h24.8c2.66-7.819,3.451-12.257,3.647-14.6.212-2.54-.21-3.242-.215-3.249H14.125c.851-3,3.968-10.2,5.831-14.5.534-1.234.955-2.205,1.172-2.732.94-2.283.323-2.792-.652-3.262A1.764,1.764,0,0,0,19.7,2.931Z" transform="translate(34.517 47) rotate(180)"></path></g></svg>
                            <span>` + getLanguage("ratings_item_questions_item:no") + `</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    if (isNew == null || isNew == false) {
        el.appendChild(newEl);
    } else {
        el.prepend(newEl);
        let createEl = el.children[0];

        let height = createEl.clientHeight;
        createEl.style.maxHeight = "0px";
        createEl.style.marginBottom = "0px";
        createEl.style.transition = "unset";
        function callback() {
            createEl.style.transition = "max-height 0.2s, margin-bottom 0.2s";
            createEl.style.animation = "addRatingsItem 0.2s forwards";
            createEl.style.maxHeight = height + "px";
            createEl.style.marginBottom = null;
            setTimeout(() => {
                createEl.style.transition = null;
                createEl.style.maxHeight = null;
                createEl.style.animation = null;
            }, 200);
        }
        window.requestAnimationFrame(callback);
    }

    hideRatingsNoData(getRatingsInfo(el)["uniqueNumber"]);
}





















function likesButtonRatingsItem(el) {
    if (loginStatus["isLogin"] == false) {
        loadMenu_login();
        return;
    }
    let info = getRatingsItemInfo(el);

    //좋아요 취소인지
    let type = "likes";
    if (el.classList.contains("ratings_box_item_right_questions_item_checked")) {
        type = null;
    }

    //
    let parent = el.parentElement;
    let children = parent.children;
    children[0].classList.remove("ratings_box_item_right_questions_item_checked");
    children[1].classList.remove("ratings_box_item_right_questions_item_checked");

    let questions_text = info["element"].getElementsByClassName("ratings_box_item_right_questions_text")[0];
    let likes = Number.parseInt(questions_text.getAttribute("likes"));

    if (type == "likes") {
        el.classList.add("ratings_box_item_right_questions_item_checked");
        actionMessage(getLanguage("ratings_item_likes_and_dislike_message"));

        questions_text.innerHTML = getLanguage("ratings_item_questions").replaceAll("{R:0}", commas(likes + 1));
        questions_text.setAttribute("likes", likes + 1);
    } else {
        questions_text.innerHTML = getLanguage("ratings_item_questions").replaceAll("{R:0}", commas(likes - 1));
        questions_text.setAttribute("likes", likes - 1);
    }

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/ratings/likesDislike.php');
    
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
    formData.append("ratingsNumber", info["ratingsNumber"]);
    formData.append("type", type);

    xhr.send(formData);
}
function dislikeButtonRatingsItem(el) {
    if (loginStatus["isLogin"] == false) {
        loadMenu_login();
        return;
    }
    let info = getRatingsItemInfo(el);

    //싫어요 취소인지
    let type = "dislike";
    if (el.classList.contains("ratings_box_item_right_questions_item_checked")) {
        type = null;
    }

    let parent = el.parentElement;
    let children = parent.children;

    //좋아요가 눌러져 있음
    if (children[0].classList.contains("ratings_box_item_right_questions_item_checked")) {
        let questions_text = info["element"].getElementsByClassName("ratings_box_item_right_questions_text")[0];
        let likes = Number.parseInt(questions_text.getAttribute("likes"));
        questions_text.innerHTML = getLanguage("ratings_item_questions").replaceAll("{R:0}", commas(likes - 1));
        questions_text.setAttribute("likes", likes - 1);
    }

    //
    children[0].classList.remove("ratings_box_item_right_questions_item_checked");
    children[1].classList.remove("ratings_box_item_right_questions_item_checked");

    if (type == "dislike") {
        el.classList.add("ratings_box_item_right_questions_item_checked");
        actionMessage(getLanguage("ratings_item_likes_and_dislike_message"));
    }

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/ratings/likesDislike.php');
    
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
    formData.append("ratingsNumber", info["ratingsNumber"]);
    formData.append("type", type);

    xhr.send(formData);
}






















































function loadRatings(ratingsInfo) {
    let el = ratingsInfo["element"];
    let items = el.getElementsByClassName("ratings_box_items")[0];
    let top = el.getElementsByClassName("ratings_box_top")[0];

    let workNumber = ratingsInfo["workNumber"];
    let sort = top.getElementsByClassName("ratings_box_top_sort")[0].getAttribute("value");

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/ratings/getInfoNumbers.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                let ratingsCount = 0;
                if (info["numbers"] != null && info["numbers"] != '') {
                    ratingsCount = info["numbers"].split(",").length;
                }
            
                top.getElementsByClassName("ratings_box_top_text")[0].innerHTML = getLanguage("ratings_top_count").replaceAll("{R:0}", ratingsCount);

                //
                items.innerHTML = '';

                let ratingsNumbers = info["numbers"].split(",");
                if (info["info"] != null) {
                    for (let i = 0; i < info["info"].length; i++) {
                        createRatingsItem(items, info["info"][i]);
                        ratingsNumbers = ratingsNumbers.remove("" + info["info"][i]["number"]);
                    }
                } else {
                    showRatingsNoData(ratingsInfo["uniqueNumber"]);
                }
                el.setAttribute("ratings_numbers", ratingsNumbers.join(","));
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
    formData.append("workNumber", workNumber);
    formData.append("sort", sort);
    if (ratingsInfo["preferentiallyRatingNumber"] != null) {
        formData.append("preferentiallyRatingNumber", ratingsInfo["preferentiallyRatingNumber"]);
    }

    xhr.send(formData);
}










































































function moreButtonRatingsItem(el, ratingsNumber, isWriter) {
    let slot = new Array();
    if (isWriter == true) {
        slot[0] = {
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 28"><path d="M8 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM12 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM16 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM18 22.813v-14.812h-14v14.812c0 0.75 0.422 1.188 0.5 1.188h13c0.078 0 0.5-0.438 0.5-1.188zM7.5 6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094 0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5 0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375 0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391 2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094 2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z"></path></svg>',
            'title': getLanguage("delete"),
            'onclick': 'deleteRatingsItemButton(' + ratingsNumber + ');',
            'class': 'more_button_item_delete',
        };
    } else {
        let itemInfo = getRatingsItemInfo(el);
        let profile = JSON.parse(itemInfo["element"].getElementsByClassName("ratings_box_item_left")[0].getElementsByClassName("profile_info")[0].innerHTML);
        let nickname = itemInfo["element"].getElementsByClassName("ratings_box_item_right_top_nickname")[0].innerHTML.trim();
        let userInfo = {
            "profile": profile,
            "nickname": nickname
        }
        let userReport = {
            "type": 1,
            "uniqueNumber": ratingsNumber,
            "userInfo": userInfo
        };
        slot[0] = {
            'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5" transform="translate(9)"/><path d="M13.422,25.422s6.941-3.318,12.163-3.086,17.81,4.641,17.81,4.641V9.456S27.963,4,24.656,3.945s-9.456,2.9-9.456,2.9L13.422,4.235S18.913.754,24.25,1.1,43.395,6.15,43.395,6.15h3.249V30.806L25.584,25.422S18.391,25.816,15.2,27.9Z" transform="translate(-0.449)"/></g></svg>',
            'title': getLanguage("ratings_report"),
            'onclick': '(loginStatus[\'isLogin\'] == true) ? openPopupContents(\'user_report\', null, \'' + JSON.stringify(userReport).replaceAll("\"", "\\&quot;").replaceAll("'", "\\\'") + '\') : loadMenu_login();'
        };
    }
    moreButton(el, slot);
}
function deleteRatingsItemButton(ratingsNumber) {
    confirmPopup(getLanguage("confirm_popup_title:delete"), getLanguage("confirm_popup_subject:delete"), 'deleteRatingsItem(' + ratingsNumber + ');');
}

function deleteRatingsItem(ratingsNumber) {
    let contents = document.getElementById("contents_" + getCurrentMenuNumber());

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/ratings/delete.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                
                if (xhrHtml == "not you") {
                    actionMessage(getLanguage("no_permission"));
                } else {
                    let items = contents.getElementsByClassName("ratings_box_items")[0];
                    let item = contents.getElementsByClassName("ratings_box_item");
                    let ratingsInfo = getRatingsInfo(items);
                    for (let i = 0; i < item.length; i++) {
                        if (item[i].getAttribute("ratings_number") == ratingsNumber) {
                            let height = item[i].clientHeight;
                            item[i].style.maxHeight = height + "px";
                            item[i].style.transition = "max-height 0.2s, margin-bottom 0.2s, margin-top 0.2s";
                            item[i].style.animation = "deleteRatingsItem 0.2s forwards";
    
                            function callback() {
                                item[i].style.maxHeight = "0px";
                                item[i].style.marginBottom = "0px";
                                item[i].style.marginTop = "0px";
                                setTimeout(() => {
                                    item[i].remove();

                                    if (items.innerHTML.trim() == "" && (ratingsInfo["ratingsNumbers"] == '' || ratingsInfo["ratingsNumbers"] == undefined || ratingsInfo["ratingsNumbers"] == null)) {
                                        showRatingsNoData(ratingsInfo["uniqueNumber"]);
                                    }
                                }, 200);
                            }
                            window.requestAnimationFrame(callback);
                            break;
                        }
                    }
                    actionMessage(getLanguage("ratings_delete_message"));

                    //쓰기 박스 표시
                    if (ratingsInfo["hideWriteRatings"] == null || ratingsInfo["hideWriteRatings"] == false) {
                        let write = ratingsInfo["element"].getElementsByClassName("ratings_box_write_wrap")[0];
                        write.style.display = null;
                        let height = write.clientHeight;
                        write.style.height = "0px";
                        write.style.marginBottom = "0px";
                        write.style.transition = "all 0.2s";
                        function callback() {
                            write.style.height = height + "px";
                            write.style.marginBottom = null;
                            write.style.animation = "showRatingsWrite 0.2s forwards";
                            setTimeout(() => {
                                write.style.transition = null;
                                write.style.height = null;
                                write.style.animation = null;
                            }, 200);
                        }
                        window.requestAnimationFrame(callback);
                    }
                }
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
    formData.append("ratingsNumber", ratingsNumber);

    xhr.send(formData);
}

















































//무한 스크롤
function checkRatingsMoreLoad() {
    let menuNumber = getCurrentMenuNumber();
    let contents = document.getElementById("contents_" + menuNumber);

    if (contents != null) {
        let moreLoad = contents.getElementsByClassName("ratings_box_more_load");
        for (let i = 0; i < moreLoad.length; i++) {
            let isLoading = moreLoad[i].getAttribute("loading");
            if (isLoading == 'false' && moreLoad[i].style.display != "none") {
                let ratingsInfo = getRatingsInfo(moreLoad[i]);

                let isPossible = isPossibleRatingsMoreLoad(ratingsInfo);
                if (isPossible == true) {
                    let ratingsNumbers = ratingsInfo["ratingsNumbers"];

                    let numbers = ratingsNumbers;
                    let numbersMaxCount = (numbers.length >= 20) ? 20 : numbers.length;
                    numbers = numbers.splice(0, numbersMaxCount);

                    requestRatingsMore(ratingsInfo, numbers);
                    moreLoad[i].setAttribute("loading", true);
                }
            }
        }
    }
}
addEventListener('scroll', checkRatingsMoreLoad);
addEventListener('focus', checkRatingsMoreLoad);
addEventListener('resize', checkRatingsMoreLoad);

function isPossibleRatingsMoreLoad(ratingsInfo) {
    //여백 구하기
    let padding = 0;
    let boxSize = 75 + padding;

    let scrollPercent = ((document.documentElement.scrollTop + window.innerHeight) / (document.documentElement.scrollHeight - boxSize)) * 100;
    if (scrollPercent >= 100) {
        return true;
    } else {
        return false;
    }
}

function requestRatingsMore(ratingsInfo, numbers) {
    let el = ratingsInfo["element"];
    let items = el.getElementsByClassName("ratings_box_items")[0];
    let ratingsNumbers = ratingsInfo["ratingsNumbers"];
    let moreLoad = el.getElementsByClassName("ratings_box_more_load")[0];

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/ratings/getInfo.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);

                if (info.length != 0) {
                    for (let i = 0; i < info.length; i++) {
                        createRatingsItem(items, info[i]);
                    }
                }
                for (let i = 0; i < numbers.length; i++) {
                    ratingsNumbers = ratingsNumbers.remove("" + numbers[i]);
                }

                moreLoad.setAttribute("loading", false);
                if (ratingsNumbers.length != 0) {
                    el.setAttribute("ratings_numbers", ratingsNumbers.join(","));
                } else {
                    moreLoad.style.display = "none";
                }
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
    formData.append("numbers", numbers.join(","));

    xhr.send(formData);
}
































function getRatingsItemInfo(el) {
    let parent = el;
    while (true) {
        parent = parent.parentElement;
        if (parent != null) {
            let ratings_number = parent.getAttribute("ratings_number");
            if (parent.classList.contains("ratings_box_item") && ratings_number != null) {
                return {
                    'element': parent,
                    'ratingsNumber': ratings_number
                };
            }
        } else {
            break;
        }
    }
}

function getRatingsInfo(el) {
    let parent = el;   
    while (true) {
        parent = parent.parentElement;
        if (parent != null) {
            let unique_number = parent.getAttribute("unique_number");
            let workNumber = parent.getAttribute("work_number");
            let ratingsNumbers = null;
            if (parent.getAttribute("ratings_numbers") != null) {
                ratingsNumbers = parent.getAttribute("ratings_numbers").split(",");
            }
            let originatorNumber = null;
            if (parent.getAttribute("originator_number") != null) {
                originatorNumber = Number.parseInt(parent.getAttribute("originator_number"));
            }
            let hideWriteRatings = null;
            if (parent.getAttribute("hide_write_ratings") != null) {
                hideWriteRatings = Number.parseInt(parent.getAttribute("hide_write_ratings"));
            }
            let preferentiallyRatingNumber = null;
            if (parent.getAttribute("preferentially_rating_number") != null) {
                preferentiallyRatingNumber = Number.parseInt(parent.getAttribute("preferentially_rating_number"));
            }
            let highlightedRatingNumber = null;
            if (parent.getAttribute("highlighted_rating_number") != null) {
                highlightedRatingNumber = Number.parseInt(parent.getAttribute("highlighted_rating_number"));
            }
            if (unique_number != null && workNumber != null) {
                return {
                    'element': parent,
                    'uniqueNumber': unique_number,
                    'workNumber': workNumber,
                    'ratingsNumbers': ratingsNumbers,
                    'originatorNumber': originatorNumber,
                    'hideWriteRatings': hideWriteRatings,
                    "preferentiallyRatingNumber": preferentiallyRatingNumber,
                    "highlightedRatingNumber": highlightedRatingNumber
                };
            }
        } else {
            break;
        }
    }
}






























function getRatingsSortItems() {
    let items = new Array();
    items[0] = {
        "title": getLanguage("ratings_sort:0"),
        "value": 0
    }
    items[1] = {
        "title": getLanguage("ratings_sort:1"),
        "value": 1
    }
    items[2] = {
        "title": getLanguage("ratings_sort:2"),
        "value": 2
    }
    return items;
}