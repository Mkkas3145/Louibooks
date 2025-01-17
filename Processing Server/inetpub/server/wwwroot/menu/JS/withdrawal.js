



function menuWithdrawalLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let nickname = contents.getElementsByClassName("nickname")[0].innerHTML.trim();
    let profileInfo = JSON.parse(contents.getElementsByClassName("profile_info")[0].innerHTML);

    let title = contents.getElementsByClassName("menu_withdrawal_title")[0];
    title.innerHTML = getLanguage("menu_withdrawal_title");
    let description = contents.getElementsByClassName("menu_withdrawal_description")[0];
    description.innerHTML = getLanguage("menu_withdrawal_description").replaceAll("{R:0}", "<b>" + nickname + "</b>");

    let itemLeft = contents.getElementsByClassName("menu_withdrawal_item_left");
    itemLeft[0].innerHTML = getSVGLouibooksLogo(0);
    itemLeft[1].innerHTML = getSVGLouibooksLogo(1);
    itemLeft[2].innerHTML = getSVGLouibooksLogo(2);
    itemLeft[3].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="37" height="3" rx="1.5" transform="translate(1 2)"></rect><rect width="37" height="3" rx="1.5" transform="translate(1 18)"></rect><rect width="20" height="3" rx="1.5" transform="translate(1 34)"></rect><g transform="translate(2.518 0.541)"><rect width="3" height="17" rx="1.5" transform="translate(23.151 35.438) rotate(-45)"></rect><rect width="3" height="23" rx="1.5" transform="translate(44.884 26.041) rotate(30)"></rect></g></g></svg>';
    itemLeft[4].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,22A11,11,0,0,1,3.222,3.222,11,11,0,1,1,18.778,18.778,10.928,10.928,0,0,1,11,22ZM11,3a8,8,0,1,0,8,8A8.009,8.009,0,0,0,11,3Z" transform="translate(14)"></path><path d="M29.719,61H19A19,19,0,0,1,0,42V24A19,19,0,0,1,19,5h8.569a18.6,18.6,0,0,0-2.918,3.5H18.719a16.018,16.018,0,0,0-16,16v18a16.018,16.018,0,0,0,16,16h11a16.018,16.018,0,0,0,16-16V36.169a18.429,18.429,0,0,0,3-1.233V42a19,19,0,0,1-19,19Z" transform="translate(1.281 20)"></path><g transform="translate(1.849 -0.459)"><rect width="3" height="17" rx="1.5" transform="translate(23.151 35.438) rotate(-45)"></rect><rect width="3" height="23" rx="1.5" transform="translate(44.884 26.041) rotate(30)"></rect></g></g></svg>';
    itemLeft[5].innerHTML = getSVGLouibooksLogo(5);
    itemLeft[6].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M38,26H3a3,3,0,0,1-3-3V2A3,3,0,0,1,3-1H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26ZM3.1,2.105V22.9H37.9V2.105Z" transform="translate(1 8.5)"></path><ellipse cx="4" cy="3.939" rx="4" ry="3.939" transform="translate(17.5 17.123)"></ellipse><path d="M38,26H3a3,3,0,0,1-3-3V22.9H37.9V0H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26Z" transform="translate(8 15.5)"></path></g></svg>';
    itemLeft[7].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25-20a24.846,24.846,0,0,1-9.731-1.965,24.915,24.915,0,0,1-7.947-5.358,24.915,24.915,0,0,1-5.358-7.947A24.837,24.837,0,0,1,0-45H3A21.852,21.852,0,0,0,9.451-29.451,21.852,21.852,0,0,0,25-23,22.025,22.025,0,0,0,47-45,22.025,22.025,0,0,0,25-67,21.939,21.939,0,0,0,5.407-55H2.08a24.925,24.925,0,0,1,5.242-7.678,24.915,24.915,0,0,1,7.947-5.358A24.831,24.831,0,0,1,25-70a24.831,24.831,0,0,1,9.731,1.965,24.915,24.915,0,0,1,7.947,5.358,24.92,24.92,0,0,1,5.358,7.946A24.839,24.839,0,0,1,50-45a24.837,24.837,0,0,1-1.965,9.731,24.915,24.915,0,0,1-5.358,7.947,24.915,24.915,0,0,1-7.947,5.358A24.846,24.846,0,0,1,25-20Zm9.99-16.451a1.494,1.494,0,0,1-.749-.2L23.877-42.636A1.5,1.5,0,0,1,23-44V-59a1.5,1.5,0,0,1,1.5-1.5A1.5,1.5,0,0,1,26-59v14.126l9.742,5.623a1.5,1.5,0,0,1,.549,2.049A1.506,1.506,0,0,1,34.99-36.451Z" transform="translate(0 70)"></path><g transform="translate(-2 4)"><rect width="3" height="12" rx="1.5" transform="translate(2.871 2.017)"></rect><rect width="3" height="12" rx="1.5" transform="matrix(0.259, 0.966, -0.966, 0.259, 14.462, 8.276)"></rect></g></g></svg>';
    itemLeft[8].innerHTML = `
        <div class = "profile_element">
            <div class = "profile_info">` + JSON.stringify(profileInfo) + `</div>
            <div class = "profile_image"></div>
        </div>
    `;

    let itemTitle = contents.getElementsByClassName("menu_withdrawal_item_right_title");
    itemTitle[0].innerHTML = getLanguage("menu_withdrawal_item_title:0");
    itemTitle[1].innerHTML = getLanguage("menu_withdrawal_item_title:1");
    itemTitle[2].innerHTML = getLanguage("menu_withdrawal_item_title:2");
    itemTitle[3].innerHTML = getLanguage("menu_withdrawal_item_title:3");
    itemTitle[4].innerHTML = getLanguage("menu_withdrawal_item_title:4");
    itemTitle[5].innerHTML = getLanguage("menu_withdrawal_item_title:5");
    itemTitle[6].innerHTML = getLanguage("menu_withdrawal_item_title:6");
    itemTitle[7].innerHTML = getLanguage("menu_withdrawal_item_title:7");
    itemTitle[8].innerHTML = getLanguage("menu_withdrawal_item_title:8");

    let itemDescription = contents.getElementsByClassName("menu_withdrawal_item_right_description");
    itemDescription[0].innerHTML = getLanguage("menu_withdrawal_item_description:0");
    itemDescription[1].innerHTML = getLanguage("menu_withdrawal_item_description:1");
    itemDescription[2].innerHTML = getLanguage("menu_withdrawal_item_description:2");
    itemDescription[3].innerHTML = getLanguage("menu_withdrawal_item_description:3");
    itemDescription[4].innerHTML = getLanguage("menu_withdrawal_item_description:4");
    itemDescription[5].innerHTML = getLanguage("menu_withdrawal_item_description:5");
    itemDescription[6].innerHTML = getLanguage("menu_withdrawal_item_description:6");
    itemDescription[7].innerHTML = getLanguage("menu_withdrawal_item_description:7");
    itemDescription[8].innerHTML = getLanguage("menu_withdrawal_item_description:8").replaceAll("{R:0}", "<b>" + nickname + "</b>");

    let bottom = contents.getElementsByClassName("menu_withdrawal_bottom")[0];
    bottom.innerHTML = getLanguage("menu_withdrawal_warning");

    let input = contents.getElementsByClassName("menu_withdrawal_input")[0].getElementsByTagName("input")[0];
    input.setAttribute("placeholder", getLanguage("menu_withdrawal_input_placeholder"));

    let button = contents.getElementsByClassName("menu_withdrawal_button_right")[0];
    button.innerHTML = getLanguage("menu_withdrawal_button");
}

function checkMenuUserWithdrawalButton(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    function callback() {
        let button = contents.getElementsByClassName("menu_withdrawal_button")[0];
        let input = contents.getElementsByClassName("menu_withdrawal_input")[0].getElementsByTagName("input")[0];

        if (input.value.trim() != "") {
            button.classList.remove("menu_withdrawal_button_disabled");
        } else {
            button.classList.add("menu_withdrawal_button_disabled");
        }
    }
    window.requestAnimationFrame(callback);
}

function confirmPopupRequestMenuUserWithdrawal(menuNumber) {
    confirmPopup(getLanguage("menu_withdrawal_confirm_popup:title"), getLanguage("menu_withdrawal_confirm_popup:description"), 'requestMenuUserWithdrawal(' + menuNumber + ');');
}
function requestMenuUserWithdrawal(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let userNumber = Number.parseInt(contents.getElementsByClassName("user_number")[0].innerHTML.trim());
    let input = contents.getElementsByClassName("menu_withdrawal_input")[0].getElementsByTagName("input")[0];

    loading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    const url = "/php/user/withdrawal.php";

    xhr.open(method, url);

    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText.trim();
                
                if (xhrHtml == "no password") {
                    actionMessage(getLanguage("menu_withdrawal_request_message:3"));
                } else if (xhrHtml == "login info don't match") {
                    actionMessage(getLanguage("menu_withdrawal_request_message:2"));
                } else if (xhrHtml == "password don't match") {
                    actionMessage(getLanguage("menu_withdrawal_request_message:1"));
                } else if (xhrHtml == "success") {
                    actionMessage(getLanguage("menu_withdrawal_request_message:0"));
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
            loadingComplete();
        }
    });

    var formData = new FormData();
    formData.append('userNumber', userNumber);
    formData.append('password', hex_sha512(input.value.trim()).toString());

    xhr.send(formData);
}