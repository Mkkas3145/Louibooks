

function myAccountDetailsLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let type = contents.getElementsByClassName("type")[0].innerHTML;
    let data = JSON.parse(contents.getElementsByClassName("data")[0].innerHTML);

    let saveButton = contents.getElementsByClassName("menu_my_account_details_top_right_save")[0];
    saveButton.innerHTML = getLanguage("save");

    /* 기본 설정 */

    //닉네임
    if (type == "nickname") {
        setTitleMyAccountDetails(menuNumber, getLanguage("menu_my_account_personal_info_item:user_info:0:title"));
        insertNoticeMyAccountDetails(menuNumber, 0, getLanguage("menu_my_account_details:notice:nickname:title"), getLanguage("menu_my_account_details:notice:nickname:description"));

        let property = {
            "title": getLanguage("menu_my_account_personal_info_item:user_info:0:title"),
            "name": "nickname",
            "value": data["nickname"]
        }
        insertItemMyAccountDetails(menuNumber, "input", property);
    }
    //내 페이지 설명
    if (type == "my_page_description") {
        setTitleMyAccountDetails(menuNumber, getLanguage("menu_my_account_personal_info_item:user_info:2:title"));
        insertNoticeMyAccountDetails(menuNumber, 0, getLanguage("menu_my_account_details:notice:my_page_description:title"), getLanguage("menu_my_account_details:notice:my_page_description:description"));

        let description = "";
        if (data["description"] != null) {
            description = data["description"];
        }

        let property = {
            "title": getLanguage("menu_my_account_personal_info_item:user_info:2:title"),
            "name": "my_page_description",
            "value": description
        }
        insertItemMyAccountDetails(menuNumber, "textbox", property);
    }
    //성별
    if (type == "gender") {
        setTitleMyAccountDetails(menuNumber, getLanguage("menu_my_account_personal_info_item:user_info:3:title"));
        insertNoticeMyAccountDetails(menuNumber, 0, getLanguage("menu_my_account_details:notice:gender:title"), getLanguage("menu_my_account_details:notice:gender:description"));

        let property = {
            "title": getLanguage("menu_my_account_details:gender:title:-1"),
            "description": getLanguage("menu_my_account_details:gender:description:-1"),
            "name": "gender",
            "checked": (data["gender"] == null) ? true : false,
            "value": -1
        }
        insertItemMyAccountDetails(menuNumber, "radio", property);

        property = {
            "title": getLanguage("menu_my_account_details:gender:title:0"),
            "description": getLanguage("menu_my_account_details:gender:description:0"),
            "name": "gender",
            "checked": (data["gender"] == 0) ? true : false,
            "value": 0
        }
        insertItemMyAccountDetails(menuNumber, "radio", property);

        property = {
            "title": getLanguage("menu_my_account_details:gender:title:1"),
            "description": getLanguage("menu_my_account_details:gender:description:1"),
            "name": "gender",
            "checked": (data["gender"] == 1) ? true : false,
            "value": 1
        }
        insertItemMyAccountDetails(menuNumber, "radio", property);
    }
    //생년월일
    if (type == "birth_date") {
        setTitleMyAccountDetails(menuNumber, getLanguage("menu_my_account_personal_info_item:user_info:4:title"));
        insertNoticeMyAccountDetails(menuNumber, 0, getLanguage("menu_my_account_details:notice:birth_date:title"), getLanguage("menu_my_account_details:notice:birth_date:description"));
    
        let property = {
            "title": getLanguage("menu_my_account_details:birth_date:title:false"),
            "description": getLanguage("menu_my_account_details:birth_date:description:false"),
            "name": "birthDate",
            "checked": (data["year"] == null) ? true : false,
            "value": false,
            "onclick": 'checkBirthDayMyAccountDetails(' + menuNumber + ');'
        }
        insertItemMyAccountDetails(menuNumber, "radio", property);

        property = {
            "title": getLanguage("menu_my_account_details:birth_date:title:true"),
            "description": getLanguage("menu_my_account_details:birth_date:description:true"),
            "name": "birthDate",
            "checked": (data["year"] != null) ? true : false,
            "value": true,
            "onclick": 'checkBirthDayMyAccountDetails(' + menuNumber + ');'
        }
        insertItemMyAccountDetails(menuNumber, "radio", property);

        let date = new Date();
        let birthYear = date.getFullYear();
        let birthMonth = (date.getMonth() + 1);
        let birthDay = date.getDay();

        if (data["year"] != null) {
            birthYear = data["year"];
        }
        if (data["month"] != null) {
            birthMonth = data["month"];
        }
        if (data["day"] != null) {
            birthDay = data["day"];
        }

        property = {
            "title": getLanguage("menu_my_account_details:birth_date:year:title"),
            "valueTitle": getLanguage("menu_my_account_details:birth_date:year:value").replaceAll("{R:0}", birthYear),
            "value": birthYear,
            "name": "birthYear",
            "checked": false,
            "onchange": 'checkBirthDayMyAccountDetails(' + menuNumber + ');'
        }
        insertItemMyAccountDetails(menuNumber, "select", property);

        property = {
            "title": getLanguage("menu_my_account_details:birth_date:month:title"),
            "valueTitle": getLanguage("menu_my_account_details:birth_date:month:value").replaceAll("{R:0}", birthMonth),
            "value": birthMonth,
            "name": "birthMonth",
            "checked": false,
            "onchange": 'checkBirthDayMyAccountDetails(' + menuNumber + ');'
        }
        insertItemMyAccountDetails(menuNumber, "select", property);

        property = {
            "title": getLanguage("menu_my_account_details:birth_date:day:title"),
            "valueTitle": getLanguage("menu_my_account_details:birth_date:day:value").replaceAll("{R:0}", birthDay),
            "value": birthDay,
            "name": "birthDay",
            "checked": false
        }
        insertItemMyAccountDetails(menuNumber, "select", property);

        //체크
        checkBirthDayMyAccountDetails(menuNumber);
    }

    /* 환경 설정 */

    //언어
    if (type == "language") {
        setTitleMyAccountDetails(menuNumber, getLanguage("header_more_button_box:language"));
        for (let i = 0; i < languages.length; i++) {
            let property = {
                "title": getLanguage('language', languages[i]),
                "name": "language",
                "value": languages[i],
                "checked": (userLanguage == languages[i])
            }
            insertItemMyAccountDetails(menuNumber, "radio", property);
        }
    }
    //위치
    if (type == "location") {
        setTitleMyAccountDetails(menuNumber, getLanguage("header_more_button_box:location"));

        let property = {
            "title": getLanguage('location:default').replaceAll("{R:0}", getLanguage("location:" + userLocation)),
            "name": "location",
            "value": null,
            "checked": (getLocation() == "default")
        }
        insertItemMyAccountDetails(menuNumber, "radio", property);

        for (let i = 0; i < locations.length; i++) {
            let property = {
                "title": getLanguage("location:" + locations[i]),
                "name": "location",
                "value": locations[i],
                "checked": (getLocation() == locations[i])
            }
            insertItemMyAccountDetails(menuNumber, "radio", property);
        }
    }
    //화면 모드
    if (type == "screen_mode") {
        setTitleMyAccountDetails(menuNumber, getLanguage("header_more_button_box:screen_mode"));

        let property = {
            "title": getLanguage("header_more_button_box_settings:screen_mode_1"),
            "name": "screenMode",
            "value": null,
            "checked": (getDisplayColor() == null)
        }
        insertItemMyAccountDetails(menuNumber, "radio", property);

        property = {
            "title": getLanguage("header_more_button_box_settings:screen_mode_3"),
            "name": "screenMode",
            "value": 'light',
            "checked": (getDisplayColor() == 'light')
        }
        insertItemMyAccountDetails(menuNumber, "radio", property);

        property = {
            "title": getLanguage("header_more_button_box_settings:screen_mode_2"),
            "name": "screenMode",
            "value": 'dark',
            "checked": (getDisplayColor() == 'dark')
        }
        insertItemMyAccountDetails(menuNumber, "radio", property);

        property = {
            "title": getLanguage("header_more_button_box_settings:screen_mode_4"),
            "name": "screenMode",
            "value": 'black',
            "checked": (getDisplayColor() == 'black')
        }
        insertItemMyAccountDetails(menuNumber, "radio", property);
    }
    //클릭 효과 속도
    if (type == "click_effect_speed") {
        setTitleMyAccountDetails(menuNumber, getLanguage("header_more_button_box:click_effect_speed"));
        let speed = new Array(0.0, 0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0);
        for (let i = 0; i < speed.length; i++) {
            let property = {
                "title": (speed[i].toFixed(1) + "x"),
                "name": "clickEffectSpeed",
                "value": speed[i],
                "checked": (getValuePopupElementMyProfileSettings('--click-effect-speed') == speed[i])
            }
            insertItemMyAccountDetails(menuNumber, "radio", property);
        }
    }
    //이미지 렌더링
    if (type == "image_rendering") {
        setTitleMyAccountDetails(menuNumber, getLanguage("header_more_button_box:image_rendering"));

        let property = {
            "title": getLanguage("header_more_button_box_settings:image_rendering_default"),
            "name": "imageRendering",
            "value": "auto",
            "checked": (getValuePopupElementMyProfileSettings('--image-rendering') == "auto")
        }
        insertItemMyAccountDetails(menuNumber, "radio", property);

        property = {
            "title": getLanguage("header_more_button_box_settings:image_rendering_pixelated"),
            "name": "imageRendering",
            "value": "pixelated",
            "checked": (getValuePopupElementMyProfileSettings('--image-rendering') == "pixelated")
        }
        insertItemMyAccountDetails(menuNumber, "radio", property);

        property = {
            "title": getLanguage("header_more_button_box_settings:image_rendering_smooth"),
            "name": "imageRendering",
            "value": "smooth",
            "checked": (getValuePopupElementMyProfileSettings('--image-rendering') == "smooth")
        }
        insertItemMyAccountDetails(menuNumber, "radio", property);

        property = {
            "title": getLanguage("header_more_button_box_settings:image_rendering_high-quality"),
            "name": "imageRendering",
            "value": "high-quality",
            "checked": (getValuePopupElementMyProfileSettings('--image-rendering') == "high-quality")
        }
        insertItemMyAccountDetails(menuNumber, "radio", property);

        property = {
            "title": getLanguage("header_more_button_box_settings:image_rendering_crisp-edges"),
            "name": "imageRendering",
            "value": "crisp-edges",
            "checked": (getValuePopupElementMyProfileSettings('--image-rendering') == "crisp-edges")
        }
        insertItemMyAccountDetails(menuNumber, "radio", property);
    }

    /* 민감한 정보 */

    //비밀번호
    if (type == "password") {
        setTitleMyAccountDetails(menuNumber, getLanguage("menu_my_account_personal_info_item:sensitive_data:0:title"));
        insertNoticeMyAccountDetails(menuNumber, 1, getLanguage("menu_my_account_details:warning:password:title"), getLanguage("menu_my_account_details:warning:password:description"));
        insertNoticeMyAccountDetails(menuNumber, 0, getLanguage("menu_my_account_details:notice:password:title"), getLanguage("menu_my_account_details:notice:password:description"));

        if (data["isNoPassword"] == false) {
            let property = {
                "title": getLanguage("menu_my_account_details:password:title:0"),
                "name": "currentPassword",
                "type": "password",
                "required": true,
                "value": ""
            }
            insertItemMyAccountDetails(menuNumber, "input", property);
        }

        property = {
            "title": getLanguage("menu_my_account_details:password:title:1"),
            "name": "newPassword",
            "type": "password",
            "required": true,
            "value": ""
        }
        insertItemMyAccountDetails(menuNumber, "input", property);
    }
    //이메일
    if (type == "email") {
        setTitleMyAccountDetails(menuNumber, getLanguage("menu_my_account_personal_info_item:sensitive_data:1:title"));
        insertNoticeMyAccountDetails(menuNumber, 1, getLanguage("menu_my_account_details:warning:email:title"), getLanguage("menu_my_account_details:warning:email:description"));
        insertNoticeMyAccountDetails(menuNumber, 0, getLanguage("menu_my_account_details:notice:email:title"), getLanguage("menu_my_account_details:notice:email:description"));

        let property = {
            "title": getLanguage("menu_my_account_personal_info_item:sensitive_data:1:title"),
            "name": "email",
            "type": "email",
            "value": data["email"],
            "disabled": true
        }
        insertItemMyAccountDetails(menuNumber, "input", property);
    }

    /* 본인 인증 방법 */

    //2차 인증
    if (type == "two_factor_auth") {
        setTitleMyAccountDetails(menuNumber, getLanguage("menu_my_account_personal_info_item:auth:1:title"));
        insertNoticeMyAccountDetails(menuNumber, 0, getLanguage("menu_my_account_details:notice:two_factor_auth:title"), getLanguage("menu_my_account_details:notice:two_factor_auth:description"));
        let isTwoFactorAuth = data["isTwoFactorAuth"];

        property = {
            "title": getLanguage("menu_my_account_details:two_factor_auth:title:0"),
            "description": getLanguage("menu_my_account_details:two_factor_auth:description:0"),
            "name": "twoFactorAuth",
            "value": false,
            "checked": (isTwoFactorAuth == false)
        }
        insertItemMyAccountDetails(menuNumber, "radio", property);

        property = {
            "title": getLanguage("menu_my_account_details:two_factor_auth:title:1"),
            "description": getLanguage("menu_my_account_details:two_factor_auth:description:1"),
            "name": "twoFactorAuth",
            "value": true,
            "checked": (isTwoFactorAuth == true)
        }
        insertItemMyAccountDetails(menuNumber, "radio", property);
    }

    //엄격한 접근 절차
    if (type == "rigorous_access_procedures") {
        setTitleMyAccountDetails(menuNumber, getLanguage("menu_my_account_personal_info_item:auth:2:title"));
        insertNoticeMyAccountDetails(menuNumber, 0, getLanguage("menu_my_account_details:notice:rigorous_access_procedures:title"), getLanguage("menu_my_account_details:notice:rigorous_access_procedures:description"));
        let rigorousAccessProcedures = data["rigorousAccessProcedures"];

        property = {
            "title": getLanguage("menu_my_account_details:rigorous_access_procedures:title:0"),
            "description": getLanguage("menu_my_account_details:rigorous_access_procedures:description:0"),
            "name": "rigorousAccessProcedures",
            "value": 0,
            "checked": (rigorousAccessProcedures == 0)
        }
        insertItemMyAccountDetails(menuNumber, "radio", property);

        property = {
            "title": getLanguage("menu_my_account_details:rigorous_access_procedures:title:1"),
            "description": getLanguage("menu_my_account_details:rigorous_access_procedures:description:1"),
            "name": "rigorousAccessProcedures",
            "value": 1,
            "checked": (rigorousAccessProcedures == 1)
        }
        insertItemMyAccountDetails(menuNumber, "radio", property);

        property = {
            "title": getLanguage("menu_my_account_details:rigorous_access_procedures:title:2"),
            "description": getLanguage("menu_my_account_details:rigorous_access_procedures:description:2"),
            "name": "rigorousAccessProcedures",
            "value": 2,
            "checked": (rigorousAccessProcedures == 2)
        }
        insertItemMyAccountDetails(menuNumber, "radio", property);

        property = {
            "title": getLanguage("menu_my_account_details:rigorous_access_procedures:title:3"),
            "description": getLanguage("menu_my_account_details:rigorous_access_procedures:description:3"),
            "name": "rigorousAccessProcedures",
            "value": 3,
            "checked": (rigorousAccessProcedures == 3)
        }
        insertItemMyAccountDetails(menuNumber, "radio", property);
    }

    let previousData = contents.getElementsByClassName("previous_data")[0];
    previousData.innerHTML = JSON.stringify(getDataMyAccountDetails(menuNumber));
}



function setTitleMyAccountDetails(menuNumber, title) {
    let contents = document.getElementById("contents_" + menuNumber);
    let el = contents.getElementsByClassName("menu_my_account_details_top_left_title")[0];
    el.innerHTML = title;
    let menuTitle = contents.getElementsByClassName("menu_title")[0];
    menuTitle.innerHTML = getLanguage("menu_name:my_account_details") + " (" + title + ")";
}



/*
    type:
        0 = 팁, 알림
        1 = 경고
*/
function insertNoticeMyAccountDetails(menuNumber, iconType, title, description) {
    let contents = document.getElementById("contents_" + menuNumber);
    let notice = contents.getElementsByClassName("menu_my_account_details_notice")[0];
    notice.style.display = null;
    let items = contents.getElementsByClassName("menu_my_account_details_notice_items")[0];

    let iconHTML = '...';
    if (iconType == 0) {
        iconHTML = `
            <div class = "menu_my_account_details_notice_item_icon" style = "background-color: var(--color-warning-trans2);">
                <!-- Generated by IcoMoon.io -->
                <svg style = "fill: var(--color-warning);" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7 13.33c-2.384-1.15-4-3.549-4-6.325 0-3.866 3.134-7 7-7s7 3.134 7 7c0 2.776-1.616 5.174-3.958 6.306l-0.042 0.018v2.67h-6v-2.67zM7 17h6v1.5c0 0.83-0.67 1.5-1.5 1.5h-3c-0.828 0-1.5-0.672-1.5-1.5v0-1.5zM9 11.9v2.1h2v-2.1c2.299-0.481 4-2.492 4-4.899 0-2.761-2.239-5-5-5s-5 2.239-5 5c0 2.407 1.701 4.417 3.967 4.893l0.033 0.006z"></path></svg>
            </div>
        `;
    } else if (iconType == 1) {
        iconHTML = `
            <div class="menu_my_account_details_notice_item_icon" style="background-color: var(--color-failure-trans2);">
                <!-- Generated by IcoMoon.io -->
                <svg style = "fill: var(--color-failure);" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19.511 17.98l-8.907-16.632c-0.124-0.215-0.354-0.348-0.604-0.348s-0.481 0.133-0.604 0.348l-8.906 16.632c-0.121 0.211-0.119 0.471 0.005 0.68 0.125 0.211 0.352 0.34 0.598 0.34h17.814c0.245 0 0.474-0.129 0.598-0.34 0.124-0.209 0.126-0.469 0.006-0.68zM11 17h-2v-2h2v2zM11 13.5h-2v-6.5h2v6.5z"></path></svg>
            </div>
        `;
    }

    //선
    let childLength = items.children.length;
    if (childLength != 0) {
        let line = document.createElement("div");
        line.classList.add("menu_my_account_details_item_line");
        items.appendChild(line);
    }

    let newEl = document.createElement("div");
    newEl.classList.add("menu_my_account_details_notice_item");
    newEl.innerHTML = `
        ` + iconHTML + `
        <div class = "menu_my_account_details_notice_item_right">
            <div class = "menu_my_account_details_notice_item_right_title">
                ` + title + `
            </div>
            <div class = "menu_my_account_details_notice_item_right_description">
                ` + description + `
            </div>
        </div>
    `;

    items.appendChild(newEl);
}



/*
    type:
        input: 입력 요소
        textbox: 여러 줄 입력 가능한 요소
        radio: 라디오 버튼
        select: 선택 리스트
    property: 필요로 하는 값
*/
function insertItemMyAccountDetails(menuNumber, type, property) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("menu_my_account_details_items")[0];

    //선
    let childLength = items.children.length;
    if (childLength != 0) {
        let line = document.createElement("div");
        line.classList.add("menu_my_account_details_item_line");
        items.appendChild(line);
    }

    let newEl = document.createElement("div");
    //입력 요소
    if (type == "input") {
        let disabled = "";
        if (property["disabled"] != null && property["disabled"] == true) {
            disabled = " disabled";
        }
        let type = "text";
        if (property["type"] != null) {
            type = property["type"];
        }
        let required = false;
        if (property["required"] != null) {
            required = property["required"];
        }
        newEl.classList.add("menu_my_account_details_item_input");
        newEl.innerHTML = `
            <div class = "menu_my_account_details_item_input_title">
                ` + property["title"] + `
            </div>
            <input placeholder = "` + getLanguage("input_placeholder:0") + `" type = "` + type + `" name = "` + property["name"] + `" value = "` + property["value"] + `" required = "` + required + `" onkeydown = "checkDataMyAccountDetails(` + menuNumber + `);"` + disabled + `>
        `;
    }
    //여러 줄 입력 가능한 요소
    if (type == "textbox") {
        newEl.classList.add("menu_my_account_details_item_textbox");
        newEl.innerHTML = `
            <div class = "menu_my_account_details_item_textbox_title">
                ` + property["title"] + `
            </div>
            <div contenteditable = "true" placeholder = "` + getLanguage("input_placeholder:0") + `" name = "` + property["name"] + `" onkeydown = "textbox_remove_spaces(this); checkDataMyAccountDetails(` + menuNumber + `);" onpaste = "contenteditable_paste(event);">` + property["value"] + `</div>
        `;
    }
    //라디오 버튼
    if (type == "radio") {
        let onclick = "";
        if (property["onclick"] != null) {
            onclick = (" " + property["onclick"]);
        }
        let description = "";
        if (property["description"] != null) {
            description = `
                <div class = "menu_my_account_details_item_radio_right_description">
                    ` + property["description"] + `
                </div>
            `;
        }
        newEl.classList.add("menu_my_account_details_item_radio");
        newEl.classList.add("md-ripples");
        newEl.setAttribute("checked", property["checked"]);
        newEl.setAttribute("name", property["name"]);
        newEl.setAttribute("value", property["value"]);
        newEl.setAttribute("onclick", "checkedRadioMyAccountDetails(" + menuNumber + ", this); checkDataMyAccountDetails(" + menuNumber + ");" + onclick);
        newEl.innerHTML = `
            <div class = "menu_my_account_details_item_radio_left">
                <div class = "menu_my_account_details_item_radio_left_in"></div>
            </div>
            <div class = "menu_my_account_details_item_radio_right">
                <div class = "menu_my_account_details_item_radio_right_title">
                    ` + property["title"] + `
                </div>
                ` + description + `
            </div>
        `;
    }
    //선택 리스트
    if (type == "select") {
        let onchange = "";
        if (property["onchange"] != null) {
            onchange = (" " + property["onchange"]);
        }
        newEl.classList.add("menu_my_account_details_item_select");
        newEl.innerHTML = `
            <div class = "menu_my_account_details_item_select_title">
                ` + property["title"] + `
            </div>
            <div class = "menu_my_account_details_item_select_wrap md-ripples" value = "` + property["value"] + `" name = "` + property["name"] + `" onclick = "selectList(this, getSelectListDataMyAccountDetails('` + property["name"] + `'));" onchange = "checkDataMyAccountDetails(` + menuNumber + `);` + onchange + `">
                <div class = "menu_my_account_details_item_select_wrap_left value_title">
                    ` + property["valueTitle"] + `
                </div>
                <div class = "menu_my_account_details_item_select_wrap_right">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17.418 6.109c0.272-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-7.908 7.83c-0.27 0.268-0.707 0.268-0.979 0l-7.908-7.83c-0.27-0.268-0.27-0.701 0-0.969s0.709-0.268 0.979 0l7.419 7.141 7.418-7.141z"></path></svg>
                </div>
            </div>
        `;
    }

    newEl.setAttribute("type", type);
    items.appendChild(newEl);
}



function getSelectListDataMyAccountDetails(name) {
    let items = new Array();

    if (name == "birthYear") {
        let count = 120; //120살까지
        let nowYear = new Date().getFullYear();
        for (let i = 0; i < count; i++) {
            let year = (nowYear - i);
            items[items.length] = {
                "title": getLanguage("menu_my_account_details:birth_date:year:value").replaceAll("{R:0}", year),
                "value": year
            }
        }
    }
    if (name == "birthMonth") {
        let count = 12;
        for (let i = 0; i < count; i++) {
            let month = (1 + i);
            items[items.length] = {
                "title": getLanguage("menu_my_account_details:birth_date:month:value").replaceAll("{R:0}", month),
                "value": month
            }
        }
    }
    if (name == "birthDay") {
        let menuNumber = getCurrentMenuNumber();
        let birthYear = getValueMyAccountDetails(menuNumber, "birthYear")["value"];
        let birthMonth = getValueMyAccountDetails(menuNumber, "birthMonth")["value"];

        let lastDay = new Date(birthYear, birthMonth, 0).getDate();

        let count = lastDay;
        for (let i = 0; i < count; i++) {
            let day = (1 + i);
            items[items.length] = {
                "title": getLanguage("menu_my_account_details:birth_date:day:value").replaceAll("{R:0}", day),
                "value": day
            }
        }
    }

    return items;
}



function checkedRadioMyAccountDetails(menuNumber, el) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("menu_my_account_details_items")[0];
    let children = items.children;
    let length = children.length;

    for (let i = 0; i < length; i++) {
        let checked = children[i].getAttribute("checked");
        if (checked == true || checked == "true") {
            children[i].setAttribute("checked", false);
        }
    }

    el.setAttribute("checked", true);
}



function checkBirthDayMyAccountDetails(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    
    let birthYear = getValueMyAccountDetails(menuNumber, "birthYear")["value"];
    let birthMonth = getValueMyAccountDetails(menuNumber, "birthMonth")["value"];
    let birthDay = getValueMyAccountDetails(menuNumber, "birthDay")["value"];

    let lastDay = new Date(birthYear, birthMonth, 0).getDate();

    if (birthDay > lastDay) {
        let selectWrap = contents.getElementsByClassName("menu_my_account_details_item_select_wrap")[2];
        selectWrap.setAttribute("value", lastDay);
        let valueTitle = selectWrap.getElementsByClassName("value_title")[0];
        valueTitle.innerHTML = getLanguage("menu_my_account_details:birth_date:day:value").replaceAll("{R:0}", lastDay);
    }

    let line = contents.getElementsByClassName("menu_my_account_details_item_line");
    let select = contents.getElementsByClassName("menu_my_account_details_item_select");
    let birthDate = getValueMyAccountDetails(menuNumber, "birthDate")["value"];
    if (birthDate == true) {
        line[1].style.display = null;
        line[2].style.display = null;
        line[3].style.display = null;
        select[0].style.display = null;
        select[1].style.display = null;
        select[2].style.display = null;
    } else {
        line[1].style.display = "none";
        line[2].style.display = "none";
        line[3].style.display = "none";
        select[0].style.display = "none";
        select[1].style.display = "none";
        select[2].style.display = "none";
    }
}


function getDataMyAccountDetails(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let items = contents.getElementsByClassName("menu_my_account_details_items")[0];
    let children = items.children;
    let length = children.length;

    let data = new Array();
    for (let i = 0; i < length; i++) {
        let type = children[i].getAttribute("type");
        if (type == "input") {
            let input = children[i].getElementsByTagName("input")[0];
            let value = input.value.trim();
            data[data.length] = {
                "name": input.getAttribute("name"),
                "value": value
            }
        }
        if (type == "textbox") {
            let textbox = children[i].getElementsByTagName("div")[1];
            let value = textbox.innerHTML.replaceAll("<div>", "\n").replaceAll("</div>", "").replaceAll("<br>", "").trim();
            value = value.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
            data[data.length] = {
                "name": textbox.getAttribute("name"),
                "value": value
            }
        }
        if (type == "radio") {
            let radio = children[i];
            let checked = radio.getAttribute("checked");
            if (checked == "true") {
                checked = true;
            } else if (checked == "false") {
                checked = false;
            } else {
                checked = false;
            }
            if (checked == true) {
                let value = radio.getAttribute("value");
                if (value == "true") {
                    value = true;
                } else if (value == "false") {
                    value = false;
                } else if (value == "null") {
                    value = null;
                }
                data[data.length] = {
                    "name": radio.getAttribute("name"),
                    "value": value
                }
            }
        }
        if (type == "select") {
            let select = children[i];
            let selectWrap = select.getElementsByClassName("menu_my_account_details_item_select_wrap")[0];
            data[data.length] = {
                "name": selectWrap.getAttribute("name"),
                "value": selectWrap.getAttribute("value")
            }
        }
    }
    
    return data;
}
function getValueMyAccountDetails(menuNumber, name) {
    let data = getDataMyAccountDetails(menuNumber);
    for (let i = 0; i < data.length; i++) {
        if (data[i]["name"] == name) {
            return data[i];
        }
    }
    return null;
}
function checkDataMyAccountDetails(menuNumber) {
    function callback() {
        let contents = document.getElementById("contents_" + menuNumber);
        let saveButton = contents.getElementsByClassName("menu_my_account_details_top_right_save")[0];
        let previousData = contents.getElementsByClassName("previous_data")[0].innerHTML;
        let newData = JSON.stringify(getDataMyAccountDetails(menuNumber));
        
        let isSavePossible = (previousData != newData);
        
        //필수 입력을 적지 않았을 경우
        let input = contents.getElementsByTagName("input");
        for (let i = 0; i < input.length; i++) {
            let required = input[i].getAttribute("required");
            if ((required == true || required == "true") && input[i].value.trim() == "") {
                isSavePossible = false;
                console.log(isSavePossible);
            }
        }

        if (isSavePossible == true) {
            saveButton.classList.add("menu_my_account_details_top_right_save_possible");
        } else {
            saveButton.classList.remove("menu_my_account_details_top_right_save_possible");
        }
    }
    window.requestAnimationFrame(callback);
}



function saveDataMyAccountDetails(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let type = contents.getElementsByClassName("type")[0].innerHTML;
    let newData = JSON.stringify(getDataMyAccountDetails(menuNumber));
    let previousData = contents.getElementsByClassName("previous_data")[0];
    previousData.innerHTML = newData;

    if (type == "language") {
        let data = JSON.parse(newData);
        setLanguage(data[0]["value"]);
        actionMessage(getLanguage("save_saved"));
    } else if (type == "location") {
        let data = JSON.parse(newData);
        setLocation(data[0]["value"]);
        actionMessage(getLanguage("save_saved"));
    } else if (type == "screen_mode") {
        let data = JSON.parse(newData);
        setDisplayColor(data[0]["value"]);
        actionMessage(getLanguage("save_saved"));
    } else if (type == "click_effect_speed") {
        let data = JSON.parse(newData);
        setValuePopupElementMyProfileSettings('--click-effect-speed', data[0]["value"]);
        actionMessage(getLanguage("save_saved"));
    } else if (type == "image_rendering") {
        let data = JSON.parse(newData);
        setValuePopupElementMyProfileSettings('--image-rendering', data[0]["value"]);
        actionMessage(getLanguage("save_saved"));
    } else {
        loading();

        const xhr = new XMLHttpRequest();
        const method = "POST";
        
        xhr.open(method, "/menu/my_account/php/details/save.php");
        
        xhr.addEventListener('readystatechange', function (event) {
            const { target } = event;
            if (target.readyState === XMLHttpRequest.DONE) {
                const { status } = target;
                if (status === 0 || (status >= 200 && status < 400)) {
                    let xhrHtml = xhr.responseText.trim();

                    if (type == "two_factor_auth") {
                        let data = JSON.parse(newData);
                        let twoFactorAuth = data[0]["value"];
                        if (twoFactorAuth == false) {
                            actionMessage(getLanguage("save_saved"));
                        } else {
                            loadMyAccount_two_factor_auth();
                        }
                    } else if (type == "password") {
                        let input = contents.getElementsByTagName("input");
                        if (input.length == 2 && input[0].value.trim() == input[1].value.trim()) {
                            actionMessage(getLanguage("menu_my_account_details:password:message:2"));
                        } else if (xhrHtml == "Your current password is invalid.") {
                            actionMessage(getLanguage("menu_my_account_details:password:message:0"));
                        } else if (xhrHtml == "You do not have a new password.") {
                            actionMessage(getLanguage("menu_my_account_details:password:message:1"));
                        } else {
                            actionMessage(getLanguage("save_saved"));
                        }
                    } else {
                        actionMessage(getLanguage("save_saved"));
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
        formData.append("type", type);
        formData.append("data", newData);

        xhr.send(formData);
    }
    
    checkDataMyAccountDetails(menuNumber);
}
function myAccountDetailsSaveKeydown(event) {
    if (getCurrentMenuName() == "my_account_details") {
        if (event.ctrlKey && event.keyCode == 83) {
            let menuNumber = getCurrentMenuNumber();
            let contents = document.getElementById("contents_" + menuNumber);
            let saveButton = contents.getElementsByClassName("menu_my_account_details_top_right_save")[0];
            if (saveButton.classList.contains("menu_my_account_details_top_right_save_possible")) {
                saveDataMyAccountDetails(menuNumber);
            } else {
                actionMessage(getLanguage("save_no_change"));
            }
            event.preventDefault();
        }
    }
}
window.addEventListener("keydown", myAccountDetailsSaveKeydown);