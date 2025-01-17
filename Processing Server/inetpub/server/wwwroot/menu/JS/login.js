



function checkLoginInput(menuNumber) {
    let confirm = document.getElementById("login_box_bottom_right_confirm_" + menuNumber + "_login");
    let inputList = new Array(
        "email", "password", "two_factor_auth"
    );
    let inputValueList = new Array();
    for (let i = 0; i < inputList.length; i++) {
        let input = document.getElementById("login_input_" + menuNumber + "_" + inputList[i]);
        inputValueList[inputList[i]] = input.value.trim();
    }

    setTimeout(() => {
        //이전이랑 input value가 다르지 않을 경우
        let isDifferent = true;
        for (let i = 0; i < inputList.length; i++) {
            let input = document.getElementById("login_input_" + menuNumber + "_" + inputList[i]);
            if (input.value.trim() != inputValueList[inputList[i]]) {
                removeLoginInputNotice(menuNumber, inputList[i]);
                isDifferent = false;
            }
        }
        if (isDifferent == true) {
            return;
        }

        let activate = true;
        for (let i = 0; i < inputList.length; i++) {
            let input = document.getElementById("login_input_" + menuNumber + "_" + inputList[i]);
            let rect = input.getBoundingClientRect();
            if ((rect.width != 0 && rect.height != 0) && input.value.trim() == "") {
                activate = false;
            }
        }

        if (activate == true) {
            confirm.classList.add("login_box_bottom_right_confirm_activate");
        } else {
            confirm.classList.remove("login_box_bottom_right_confirm_activate");
        }
    }, 1);
}

function loginInputNotice(menuNumber, name, text) {
    let input = document.getElementById("login_input_" + menuNumber + "_" + name);
    input.classList.add("login_box_input_item_notice_input");
    let notice = document.getElementById("login_input_notice_" + menuNumber + "_" + name);
    notice.innerText = text;
}
function removeLoginInputNotice(menuNumber, name) {
    let input = document.getElementById("login_input_" + menuNumber + "_" + name);
    input.classList.remove("login_box_input_item_notice_input");
    let notice = document.getElementById("login_input_notice_" + menuNumber + "_" + name);
    notice.innerText = '';
}

function login(menuNumber) {
    let confirm = document.getElementById("login_box_bottom_right_confirm_" + menuNumber + "_login");
    confirm.classList.remove("login_box_bottom_right_confirm_activate");

    let cancel = false;

    let inputList = new Array(
        "email", "password"
    );
    for (let i = 0; i < inputList.length; i++) {
        let input = document.getElementById("login_input_" + menuNumber + "_" + inputList[i]);
        if (input.value.trim() == '') {
            loginInputNotice(menuNumber, inputList[i], getLanguage("loginPage:response6"));
            input.focus();
            return;
        }
    }

    if (cancel == false) {
        loginRequest(menuNumber);
    }
}





function loginRequest(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let email = document.getElementById("login_input_" + menuNumber + "_email");
    let password = document.getElementById("login_input_" + menuNumber + "_password");
    let code = document.getElementById("login_input_" + menuNumber + "_two_factor_auth");
    let loginBox = contents.getElementsByClassName("login_box_input");

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    const url = "/php/login/login.php";

    xhr.open(method, url);

    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                xhrHtml = xhrHtml.replace(/^\s+|\s+$/gm,'');

                if (xhrHtml == "secondary authentication codes do not match") {
                    loginInputNotice(menuNumber, "two_factor_auth", getLanguage("loginPage:response13"));
                } else if (xhrHtml == "secondary authentication is required") {
                    loginBox[0].style.display = "none";
                    loginBox[1].style.display = null;
                } else if (xhrHtml == "not email") {
                    loginInputNotice(menuNumber, "email", getLanguage("loginPage:response1"));
                } else if (xhrHtml == "not data") {
                    loginInputNotice(menuNumber, "email", getLanguage("loginPage:response2"));
                    loginInputNotice(menuNumber, "password", getLanguage("loginPage:response2"));
                } else if (xhrHtml == "max data length") {
                    loginInputNotice(menuNumber, "email", getLanguage("loginPage:response3"));
                } else if (xhrHtml == "not match password") {
                    loginInputNotice(menuNumber, "password", getLanguage("loginPage:response4"));
                } else if (xhrHtml == "not match mail") {
                    loginInputNotice(menuNumber, "email", getLanguage("loginPage:response5"));
                }

                if (xhrHtml == "login succeed") {
                    deleteAllMenu();
                } else {
                    loadingComplete();
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
    formData.append('email', email.value.trim());
    formData.append('pw', password.value.trim());
    if (code.value != "") {
        formData.append('code', code.value);
    }
    let checkbox = document.getElementById("login_box_auto_login_input_" + menuNumber + "_auto_login");
    formData.append('autologin', checkbox.classList.contains("login_box_auto_login_input_check"));

    xhr.send(formData);
}







































function toggleLoginCheckbox(menuNumber) {
    let checkbox = document.getElementById("login_box_auto_login_input_" + menuNumber + "_auto_login");
    if (checkbox.classList.contains("login_box_auto_login_input_check") == true) {
        checkbox.classList.remove("login_box_auto_login_input_check");
    } else {
        checkbox.classList.add("login_box_auto_login_input_check");
    }
}


















function moreButtonOtherAccount(el, userNumber) {
    let slot = new Array();
    slot[0] = {
        'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 28"><path d="M8 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM12 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM16 11.5v9c0 0.281-0.219 0.5-0.5 0.5h-1c-0.281 0-0.5-0.219-0.5-0.5v-9c0-0.281 0.219-0.5 0.5-0.5h1c0.281 0 0.5 0.219 0.5 0.5zM18 22.813v-14.812h-14v14.812c0 0.75 0.422 1.188 0.5 1.188h13c0.078 0 0.5-0.438 0.5-1.188zM7.5 6h7l-0.75-1.828c-0.047-0.063-0.187-0.156-0.266-0.172h-4.953c-0.094 0.016-0.219 0.109-0.266 0.172zM22 6.5v1c0 0.281-0.219 0.5-0.5 0.5h-1.5v14.812c0 1.719-1.125 3.187-2.5 3.187h-13c-1.375 0-2.5-1.406-2.5-3.125v-14.875h-1.5c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h4.828l1.094-2.609c0.313-0.766 1.25-1.391 2.078-1.391h5c0.828 0 1.766 0.625 2.078 1.391l1.094 2.609h4.828c0.281 0 0.5 0.219 0.5 0.5z"></path></svg>',
        'title': getLanguage("loginPage:more_button1"),
        'onclick': 'deleteOtherAccount(' + userNumber + ');',
        'class': 'more_button_item_delete',
    };
    moreButton(el, slot);
}











function loginWithKey(loginkey) {
    loading();
    loginCheckLoading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    const url = "/php/login/login_with_key.php";

    xhr.open(method, url);

    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {

                if (history.state != null) {
                    deleteAllMenu(true);

                    let data = history.state;
                    let property = data["property"];
                    property["historyNoStack"] = true;

                    if (data["url"] != null) { loadMenu(data["url"], property, data["data"]); }
                } else {
                    deleteAllMenu();
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
    formData.append('loginkey', loginkey.trim());

    xhr.send(formData);
}





function logout() {
    loading();
    loginCheckLoading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    const url = "/php/login/logout.php";

    xhr.open(method, url);

    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                if (history.state != null) {
                    deleteAllMenu(true);

                    let data = history.state;
                    let property = data["property"];
                    property["historyNoStack"] = true;

                    if (data["url"] != null) { loadMenu(data["url"], property, data["data"]); }
                } else {
                    deleteAllMenu();
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

    xhr.send(formData);
}






function deleteOtherAccount(userNumber) {
    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    const url = "/php/login/delete_other_account.php";

    xhr.open(method, url);

    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let item = document.getElementsByName("other_account_item_" + userNumber);
                let array = new Array();
                for (let i = 0; i < item.length; i++) {
                    array[array.length] = item[i];
                }
                for (let i = 0; i < array.length; i++) {
                    array[i].remove();
                }
                let login_box_other_account = document.getElementsByClassName("login_box_other_account");
                array = new Array();
                for (i = 0; i < login_box_other_account.length; i++) {
                    let child = login_box_other_account[i].children;
                    if (child.length == 0) {
                        array[array.length] = login_box_other_account[i];
                    }
                }
                for (let i = 0; i < array.length; i++) {
                    array[i].remove();
                }
                
                actionMessage(getLanguage("delete_list_message"));
            } else {
                if (status == 504) {
                    //시간 초과
                    serverResponseErrorMessage(0);
                } else {
                    //오류 발생
                    serverResponseErrorMessage(1);
                }
            }
            loadingComplete(); //로딩 끝
        }
    });

    var formData = new FormData();
    formData.append('userNumber', userNumber);

    xhr.send(formData);
}









































function loginGoogle() {
    let GOOGLE_CLIENT_ID = "1017277245083-0cut38qv73v2br4rhfnou21cln49ei3s.apps.googleusercontent.com";
    let GOOGLE_REDIRECT_URI = "https://louibooks.com/php/login/google/callback.php";
    let GOOGLE_SCOPE = "https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/userinfo.profile+https://www.googleapis.com/auth/user.gender.read";
    let url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=${GOOGLE_SCOPE}`;

    location.href = url;
}