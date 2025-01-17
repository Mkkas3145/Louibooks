

function myAccountTwoFactorAuthLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let button = contents.getElementsByClassName("menu_my_account_two_factor_auth_bottom_button")[0];
    button.innerHTML = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>' + getLanguage("menu_my_account_two_factor_auth_button");

    let title = contents.getElementsByClassName("menu_my_account_two_factor_auth_input_title")[0];
    title.innerHTML = getLanguage("menu_my_account_two_factor_auth:title");
    let description = contents.getElementsByClassName("menu_my_account_two_factor_auth_input_description")[0];
    description.innerHTML = getLanguage("menu_my_account_two_factor_auth:description");
}

function checkInputMyAccountTwoFactorAuth(event, menuNumber, order) {
    function callback() {
        let contents = document.getElementById("contents_" + menuNumber);
        let inputList = contents.getElementsByClassName("menu_my_account_two_factor_auth_input_list")[0];
        let input = inputList.children;

        let isAllWritten = true;
        for (let i = 0; i < input.length; i++) {
            if (input[i].value.length >= 1) {
                let lastChar = input[i].value.charAt(input[i].value.length - 1);
                input[i].value = lastChar;
            } else {
                isAllWritten = false;
            }
        }

        if (isAllWritten == true) {
            requestMyAccountTwoFactorAuth(menuNumber);
        }

        let button = contents.getElementsByClassName("menu_my_account_two_factor_auth_bottom_button")[0];
        button.setAttribute("checked", isAllWritten);

        for (let i = 0; i < input.length; i++) {
            if (event.keyCode == 8) {
                input[order].value = "";
                if ((order - 1) >= 0) {
                    input[(order - 1)].focus();
                }
            } else {
                if (input[i].value.length == 0 && i == order) {
                    break;
                }
                if (input[i].value.length == 0 && i > order) {
                    input[i].focus();
                    break;
                }
            }
        }
    }
    window.requestAnimationFrame(callback);
}

function requestMyAccountTwoFactorAuth(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let secretKey = contents.getElementsByClassName("secret_key")[0].innerHTML.trim();
    let inputList = contents.getElementsByClassName("menu_my_account_two_factor_auth_input_list")[0];
    let input = inputList.children;
    let code = "";
    for (let i = 0; i < input.length; i++) {
        code += input[i].value;
    }
    let button = contents.getElementsByClassName("menu_my_account_two_factor_auth_bottom_button")[0];
    button.setAttribute("checked", false);

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/menu/my_account/php/two_factor_auth/register.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText.trim();

                if (xhrHtml == "registered") {
                    deleteMenu(menuNumber);
                    actionMessage(getLanguage("menu_my_account_two_factor_auth_message:0"));
                } else {
                    actionMessage(getLanguage("menu_my_account_two_factor_auth_message:1"));
                }

                button.setAttribute("checked", true);
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
    formData.append("secretKey", secretKey);
    formData.append("code", code);

    xhr.send(formData);
}