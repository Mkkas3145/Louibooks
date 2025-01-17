



function checkFindPasswordInput(menuNumber) {
    let confirm = document.getElementById("login_box_bottom_right_confirm_" + menuNumber + "_find_password");
    let inputList = null;
    //step
    let find_password_step1 = document.getElementById("find_password_step1_" + menuNumber);
    let find_password_step2 = document.getElementById("find_password_step2_" + menuNumber);
    if (find_password_step1.style.display == "block") {
        inputList = new Array(
            "email"
        );
    } else if (find_password_step2.style.display == "block") {
        inputList = new Array(
            "auth_code"
        );
    } else {
        inputList = new Array(
            "password", "password2"
        );
    }
    let inputValueList = new Array();
    for (let i = 0; i < inputList.length; i++) {
        let input = document.getElementById("find_password_input_" + menuNumber + "_" + inputList[i]);
        inputValueList[inputList[i]] = input.value.trim();
    }

    setTimeout(() => {
        //이전이랑 input value가 다르지 않을 경우
        let isDifferent = true;
        for (let i = 0; i < inputList.length; i++) {
            let input = document.getElementById("find_password_input_" + menuNumber + "_" + inputList[i]);
            if (input.value.trim() != inputValueList[inputList[i]]) {
                removeFindPasswordInputNotice(menuNumber, inputList[i]);
                isDifferent = false;
            }
        }
        if (isDifferent == true) {
            return;
        }

        let activate = true;
        for (let i = 0; i < inputList.length; i++) {
            let input = document.getElementById("find_password_input_" + menuNumber + "_" + inputList[i]);
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

function findPasswordInputNotice(menuNumber, name, text) {
    let input = document.getElementById("find_password_input_" + menuNumber + "_" + name);
    input.classList.add("login_box_input_item_notice_input");
    let notice = document.getElementById("find_password_input_notice_" + menuNumber + "_" + name);
    notice.innerText = text;
}
function removeFindPasswordInputNotice(menuNumber, name) {
    let input = document.getElementById("find_password_input_" + menuNumber + "_" + name);
    input.classList.remove("login_box_input_item_notice_input");
    let notice = document.getElementById("find_password_input_notice_" + menuNumber + "_" + name);
    notice.innerText = '';
}

function findPassword(menuNumber) {
    let confirm = document.getElementById("login_box_bottom_right_confirm_" + menuNumber + "_find_password");
    confirm.classList.remove("login_box_bottom_right_confirm_activate");

    let cancel = false;

    let inputList = null;
    //step
    let find_password_step1 = document.getElementById("find_password_step1_" + menuNumber);
    let find_password_step2 = document.getElementById("find_password_step2_" + menuNumber);
    if (find_password_step1.style.display == "block") {
        inputList = new Array(
            "email"
        );
    } else if (find_password_step2.style.display == "block") {
        inputList = new Array(
            "auth_code"
        );
    } else {
        inputList = new Array(
            "password", "password2"
        );
    }
    for (let i = 0; i < inputList.length; i++) {
        let input = document.getElementById("find_password_input_" + menuNumber + "_" + inputList[i]);
        if (input.value.trim() == '') {
            findPasswordInputNotice(menuNumber, inputList[i],  getLanguage("loginPage:response6"));
            input.focus();
            return;
        }
    }

    //비밀번호 확인
    let password = document.getElementById("find_password_input_" + menuNumber + "_password");
    let password2 = document.getElementById("find_password_input_" + menuNumber + "_password2");
    if (password.value.trim() != password2.value.trim()) {
        findPasswordInputNotice(menuNumber, "password2",  getLanguage("loginPage:response12"));
        cancel = true;
    }

    if (cancel == false) {
        findPasswordRequest(menuNumber);
    }
}

function findPasswordRequest(menuNumber) {
    let email = document.getElementById("find_password_input_" + menuNumber + "_email");
    let password = document.getElementById("find_password_input_" + menuNumber + "_password");
    let auth_code = document.getElementById("find_password_input_" + menuNumber + "_auth_code");

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    const url = "/php/login/find_password.php";

    xhr.open(method, url);

    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                xhrHtml = xhrHtml.replace(/^\s+|\s+$/gm,'');

                if (xhrHtml == "not email") {
                    findPasswordInputNotice(menuNumber, "email", getLanguage("loginPage:response1"));
                } else if (xhrHtml == "not data") {
                    findPasswordInputNotice(menuNumber, "email", getLanguage("loginPage:response2"));
                    findPasswordInputNotice(menuNumber, "password", getLanguage("loginPage:response2"));
                    findPasswordInputNotice(menuNumber, "password2", getLanguage("loginPage:response2"));
                    findPasswordInputNotice(menuNumber, "auth_code", getLanguage("loginPage:response2"));
                } else if (xhrHtml == "max data length") {
                    findPasswordInputNotice(menuNumber, "email",  getLanguage("loginPage:response3"));
                } else if (xhrHtml == "email does not exist") {
                    findPasswordInputNotice(menuNumber, "email",  getLanguage("loginPage:response5"));
                } else if (xhrHtml == "not same key") {
                    findPasswordInputNotice(menuNumber, "auth_code",  getLanguage("loginPage:response9"));
                } else if (xhrHtml == "no auth") {
                    findPasswordInputNotice(menuNumber, "email",  getLanguage("loginPage:response10"));
                }

                let find_password_step1 = document.getElementById("find_password_step1_" + menuNumber);
                let find_password_step2 = document.getElementById("find_password_step2_" + menuNumber);
                let find_password_step3 = document.getElementById("find_password_step3_" + menuNumber);
                if (xhrHtml == "auth" || xhrHtml == "cannot be issued") {
                    //인증코드 
                    find_password_step1.style.display = "none";
                    find_password_step2.style.display = "block";
                    find_password_step3.style.display = "none";
                } else if (xhrHtml == "password to change") {
                    //비밀번호 변경
                    find_password_step1.style.display = "none";
                    find_password_step2.style.display = "none";
                    find_password_step3.style.display = "block";
                } else if (xhrHtml == "forgot password success") {
                    loadMenu_login();
                }
            }
            loadingComplete();
        }
    });

    var formData = new FormData();
    formData.append('email', email.value.trim());
    if (auth_code.value.trim() != '') {
        formData.append('key', auth_code.value.trim());
    }
    if (password.value.trim() != '') {
        formData.append('newpassword', password.value.trim());
    }

    xhr.send(formData);
}