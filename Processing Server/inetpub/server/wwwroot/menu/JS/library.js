



function libraryLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    if (contents.innerHTML.trim() == "not login") {
        deleteMenu(getCurrentMenuNumber());
        loadMenu_login();
    }

    //
    let info_item = contents.getElementsByClassName("menu_library_top_info_item");
    let value = info_item[0].getAttribute("value");
    info_item[0].getElementsByTagName("span")[0].innerHTML = getLanguage("menu_library_info_works_count").replaceAll("{R:0}", value);
    value = info_item[1].getAttribute("value");
    info_item[1].getElementsByTagName("span")[0].innerHTML = getLanguage("menu_library_info_cloud_use_size").replaceAll("{R:0}", capacityUnit(value));
    info_item[1].getElementsByTagName("div")[0].innerHTML = getSVGLouibooksLogo(2);
    //
    let bottom_left = contents.getElementsByClassName("menu_library_contents_load_menu_item_bottom_left");
    for (let i = 0; i < bottom_left.length; i++) {
        bottom_left[i].innerHTML = getLanguage("menu_library_contents_bottom_button");
    }

    //제목
    let title = contents.getElementsByClassName("menu_library_contents_load_menu_item_right_title");
    title[0].innerHTML = getLanguage("menu_library_contents_history:title");
    title[1].innerHTML = getLanguage("menu_library_contents_my_work_list:title");
    title[2].innerHTML = getLanguage("menu_library_contents_my_user_list:title");
    title[3].innerHTML = getLanguage("menu_library_contents_my_page:title");
    title[4].innerHTML = getLanguage("menu_library_contents_notifications_settings:title");
    //설명
    let description = contents.getElementsByClassName("menu_library_contents_load_menu_item_right_description");
    description[0].innerHTML = getLanguage("menu_library_contents_history:description");
    description[1].innerHTML = getLanguage("menu_library_contents_my_work_list:description");
    description[2].innerHTML = getLanguage("menu_library_contents_my_user_list:description");
    description[3].innerHTML = getLanguage("menu_library_contents_my_page:description");
    description[4].innerHTML = getLanguage("menu_library_contents_notifications_settings:description");

    let input = contents.getElementsByClassName("menu_library_top_nickname_input")[0].getElementsByTagName("input")[0];
    input.setAttribute("placeholder", getLanguage("menu_library_user_nickname_input_placeholder"));
}

function showLibraryChangeNicknameInputBox(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let wrap = contents.getElementsByClassName("menu_library_top_nickname_wrap")[0];
    let height = wrap.clientHeight; //height

    //
    let top_nickname = contents.getElementsByClassName("menu_library_top_nickname")[0];
    let top_nickname_input_box = contents.getElementsByClassName("menu_library_top_nickname_input_box")[0];
    top_nickname.style.display = "none";
    top_nickname_input_box.style.display = "block";

    let nickname = top_nickname.getElementsByClassName("menu_library_top_nickname_text")[0].innerText.trim();
    let input = top_nickname_input_box.getElementsByTagName("input")[0];
    input.value = "";
    input.value = nickname;
    input.setAttribute("original_value", nickname);
    input.focus();

    //
    let currentHeight = wrap.clientHeight; //height

    //
    if (height != currentHeight) {
        wrap.style.height = height + "px";
        function callback() {
            wrap.style.height = currentHeight + "px";
            setTimeout(() => {
                wrap.style.height = null;
            }, 200);
        }
        window.requestAnimationFrame(callback);
    }

    //
    libraryChangeNicknameInputKeyDown(input);
}
function hideLibraryChangeNicknameInputBox(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let wrap = contents.getElementsByClassName("menu_library_top_nickname_wrap")[0];
    let height = wrap.clientHeight; //height

    //
    let top_nickname = contents.getElementsByClassName("menu_library_top_nickname")[0];
    let top_nickname_input_box = contents.getElementsByClassName("menu_library_top_nickname_input_box")[0];
    top_nickname.style.display = null;
    top_nickname_input_box.style.display = null;

    //
    let currentHeight = wrap.clientHeight; //height

    //
    if (height != currentHeight) {
        wrap.style.height = height + "px";
        function callback() {
            wrap.style.height = currentHeight + "px";
            setTimeout(() => {
                wrap.style.height = null;
            }, 200);
        }
        window.requestAnimationFrame(callback);
    }

    let submit = contents.getElementsByClassName("menu_library_top_nickname_bottom_submit")[0];
    submit.classList.remove("menu_library_top_nickname_bottom_submit_activate");
}
function libraryChangeNicknameInputFocus(input) {
    let parent = input.parentElement;
    parent.classList.add("menu_library_top_nickname_input_focus");
}
function libraryChangeNicknameInputBlur(input) {
    let parent = input.parentElement;
    parent.classList.remove("menu_library_top_nickname_input_focus");
}
function libraryChangeNicknameInputKeyDown(input) {
    function callback() {
        let submit = input.parentElement.parentElement.getElementsByClassName("menu_library_top_nickname_bottom_submit")[0];
        let originalValue = input.getAttribute("original_value").trim();
        let value = input.value.trim();

        if (value == originalValue || value == "") {
            submit.classList.remove("menu_library_top_nickname_bottom_submit_activate");
        } else {
            submit.classList.add("menu_library_top_nickname_bottom_submit_activate");
        }
    }
    window.requestAnimationFrame(callback);
}

function libraryChangeNicknameButton(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let input = contents.getElementsByClassName("menu_library_top_nickname_input")[0].getElementsByTagName("input")[0];
    
    requestLibraryChangeNickname(menuNumber, input.value.trim());
}
function requestLibraryChangeNickname(menuNumber, nickname, isPrevious) {
    (isPrevious == null) ? isPrevious = false : null;

    let contents = document.getElementById("contents_" + menuNumber);
    let previousNickname = contents.getElementsByClassName("menu_library_top_nickname_text")[0].innerHTML.trim();

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/user/change_nickname.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;

                //닉네임 값 변경
                let nicknameText = contents.getElementsByClassName("menu_library_top_nickname_text")[0];
                nicknameText.textContent = nickname;

                if (isPrevious == false) {
                    actionMessage(getLanguage("user_nickname_change_message"), "requestLibraryChangeNickname(" + menuNumber + ", \'" + previousNickname + "\', true);");
                } else {
                    actionMessage(getLanguage("user_nickname_change_message"));
                }

                hideLibraryChangeNicknameInputBox(menuNumber);
                loginCheck();
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
    formData.append("nickname", nickname);

    xhr.send(formData);
}