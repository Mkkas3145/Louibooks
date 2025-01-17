



function checkSignupInput(menuNumber) {
    let confirm = document.getElementById("login_box_bottom_right_confirm_" + menuNumber + "_signup");
    let inputList = null;
    //step
    let signup_step2 = document.getElementById("signup_step2_" + menuNumber);
    if (signup_step2.style.display == "none") {
        inputList = new Array(
            "nickname", "email", "password", "password2"
        );
    } else {
        inputList = new Array(
            "auth_code"
        );
    }
    let inputValueList = new Array();
    for (let i = 0; i < inputList.length; i++) {
        let input = document.getElementById("signup_input_" + menuNumber + "_" + inputList[i]);
        inputValueList[inputList[i]] = input.value.trim();
    }
    //체크박스
    let checkbox = document.getElementById("login_box_auto_login_input_" + menuNumber + "_privacy_policy");
    let checkboxValue = false;
    if (checkbox.classList.contains("login_box_auto_login_input_check") == true) {
        checkboxValue = true;
    }

    setTimeout(() => {
        //이전이랑 input value가 다르지 않을 경우
        let isDifferent = true;
        for (let i = 0; i < inputList.length; i++) {
            let input = document.getElementById("signup_input_" + menuNumber + "_" + inputList[i]);
            if (input.value.trim() != inputValueList[inputList[i]]) {
                removeSignupInputNotice(menuNumber, inputList[i]);
                isDifferent = false;
            }
        }
        //체크박스가 다른지
        if (checkboxValue != checkbox.classList.contains("login_box_auto_login_input_check")) {
            isDifferent = false;
        }
        if (isDifferent == true) {
            return;
        }

        let activate = true;
        for (let i = 0; i < inputList.length; i++) {
            let input = document.getElementById("signup_input_" + menuNumber + "_" + inputList[i]);
            if (input.value.trim() == "") {
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

function signupInputNotice(menuNumber, name, text) {
    let input = document.getElementById("signup_input_" + menuNumber + "_" + name);
    if (input != null) {
        input.classList.add("login_box_input_item_notice_input");
    }
    let input2 = document.getElementById("login_box_auto_login_input_" + menuNumber + "_" + name);
    if (input2 != null) {
        input2.classList.add("login_box_auto_login_input_check_notice");
    }
    let notice = document.getElementById("signup_input_notice_" + menuNumber + "_" + name);
    notice.innerText = text;
}
function removeSignupInputNotice(menuNumber, name) {
    let input = document.getElementById("signup_input_" + menuNumber + "_" + name);
    if (input != null) {
        input.classList.remove("login_box_input_item_notice_input");
    }
    let input2 = document.getElementById("login_box_auto_login_input_" + menuNumber + "_" + name);
    if (input2 != null) {
        input2.classList.remove("login_box_auto_login_input_check_notice");
    }
    let notice = document.getElementById("signup_input_notice_" + menuNumber + "_" + name);
    notice.innerText = '';
}

function signup(menuNumber) {
    let confirm = document.getElementById("login_box_bottom_right_confirm_" + menuNumber + "_signup");
    confirm.classList.remove("login_box_bottom_right_confirm_activate");

    let cancel = false;

    let inputList = null;
    //step
    let signup_step2 = document.getElementById("signup_step2_" + menuNumber);
    if (signup_step2.style.display == "none") {
        inputList = new Array(
            "nickname", "email", "password", "password2"
        );
    } else {
        inputList = new Array(
            "auth_code"
        );
    }
    for (let i = 0; i < inputList.length; i++) {
        let input = document.getElementById("signup_input_" + menuNumber + "_" + inputList[i]);
        if (input.value.trim() == '') {
            signupInputNotice(menuNumber, inputList[i], getLanguage("loginPage:response6"));
            input.focus();
            return;
        }
    }

    //비밀번호 확인
    let password = document.getElementById("signup_input_" + menuNumber + "_password");
    let password2 = document.getElementById("signup_input_" + menuNumber + "_password2");
    if (password.value.trim() != password2.value.trim()) {
        signupInputNotice(menuNumber, "password2", getLanguage("loginPage:response12"));
        cancel = true;
    }
    //개인정보 수집 동의 여부
    let checkbox = document.getElementById("login_box_auto_login_input_" + menuNumber + "_privacy_policy");
    if (checkbox.classList.contains("login_box_auto_login_input_check") == false) {
        signupInputNotice(menuNumber, "privacy_policy", getLanguage("loginPage:response11"));
        cancel = true;
    }

    if (cancel == false) {
        signupRequest(menuNumber);
    }
}

function signupRequest(menuNumber) {
    let nickname = document.getElementById("signup_input_" + menuNumber + "_nickname");
    let email = document.getElementById("signup_input_" + menuNumber + "_email");
    let password = document.getElementById("signup_input_" + menuNumber + "_password");
    let auth_code = document.getElementById("signup_input_" + menuNumber + "_auth_code");

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    const url = "/php/login/signup.php";

    xhr.open(method, url);

    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                xhrHtml = xhrHtml.replace(/^\s+|\s+$/gm,'');

                if (xhrHtml == "not email") {
                    signupInputNotice(menuNumber, "email", getLanguage("loginPage:response1"));
                } else if (xhrHtml == "not data") {
                    signupInputNotice(menuNumber, "email", getLanguage("loginPage:response2"));
                    signupInputNotice(menuNumber, "password", getLanguage("loginPage:response2"));
                    signupInputNotice(menuNumber, "nickname", getLanguage("loginPage:response2"));
                } else if (xhrHtml == "max data length / nickname") {
                    signupInputNotice(menuNumber, "nickname", getLanguage("loginPage:response7"));
                } else if (xhrHtml == "max data length / email") {
                    signupInputNotice(menuNumber, "email", getLanguage("loginPage:response3"));
                } else if (xhrHtml == "email exists") {
                    signupInputNotice(menuNumber, "email", getLanguage("loginPage:response8"));
                } else if (xhrHtml == "not same key") {
                    signupInputNotice(menuNumber, "auth_code", getLanguage("loginPage:response9"));
                } else if (xhrHtml == "no auth") {
                    signupInputNotice(menuNumber, "email", getLanguage("loginPage:response10"));
                }

                let signup_step1 = document.getElementById("signup_step1_" + menuNumber);
                let signup_step2 = document.getElementById("signup_step2_" + menuNumber);
                if (xhrHtml == "auth" || xhrHtml == "cannot be issued") {
                    //인증코드 
                    signup_step1.style.display = "none";
                    signup_step2.style.display = "block";
                    loadingComplete();
                } else if (xhrHtml == "signup success") {
                    loadMenu_login();
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
    formData.append('name', nickname.value.trim());
    formData.append('email', email.value.trim());
    formData.append('pw', password.value.trim());
    if (auth_code.value.trim() != '') {
        formData.append('key', auth_code.value.trim());
    }

    xhr.send(formData);
}









function toggleSignupCheckbox(menuNumber) {
    checkSignupInput(menuNumber);
    let checkbox = document.getElementById("login_box_auto_login_input_" + menuNumber + "_privacy_policy");
    if (checkbox.classList.contains("login_box_auto_login_input_check") == true) {
        checkbox.classList.remove("login_box_auto_login_input_check");
    } else {
        checkbox.classList.add("login_box_auto_login_input_check");
    }
    removeSignupInputNotice(menuNumber, "privacy_policy");
}








