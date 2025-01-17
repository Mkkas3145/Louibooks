

function popupMyProfile(el) {
    popupElement(el, 'top', getHtmlPopupMyProfile());
}

function getHtmlPopupMyProfile() {
    let html = '<div class = "popup_my_profile">';

    //다른 계정 로그인
    let otherAccountHtml = "";
    let otherAccount = loginStatus["otherAccount"];
    if (otherAccount != null) {
        for (let i = 0; i < otherAccount.length; i++) {
            let status = '';
            let onclick = '';
            if (otherAccount[i]["isLogged"] != null && otherAccount[i]["isLogged"] == true) {
                status = getLanguage("other_account_login:state_login");
                onclick = 'loginWithKey(\'' + otherAccount[i]["loginKey"] + '\');';
            } else {
                status = getLanguage("other_account_login:state_logout");
                onclick = 'loadMenu_other_account(' + otherAccount[i]["number"] + ');';
            }

            otherAccountHtml += `
                <div class = "popup_my_profile_user_info_other_account_item md-ripples" onclick = "` + onclick + ` hidePopupElement();">
                    <div class = "popup_my_profile_user_info_other_account_item_left">
                        <div class = "profile_element">
                            <div class = "profile_info">` + JSON.stringify(otherAccount[i]["profile"]) + `</div>
                            <div class = "profile_image"></div>
                        </div>
                    </div>
                    <div class = "popup_my_profile_user_info_other_account_item_right">
                        <div class = "popup_my_profile_user_info_other_account_item_right_nickname">
                            ` + otherAccount[i]["nickname"] + `
                        </div>
                        <div class = "popup_my_profile_user_info_other_account_item_right_states">
                            ` + status + `
                        </div>
                    </div>
                </div>
            `;
        }
    }

    if (loginStatus["isLogin"] == true) {
        //등급
        let rank = loginStatus["rankInfo"]["rank"];
        let nextPoints = loginStatus["rankInfo"]["nextPoints"];

        let rankIcon = "";
        if (rank == 0) {
            rankIcon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M243.965,617.372V601l4,5.68,4-5.68v16.374" transform="translate(129.289 -641.921) rotate(30)" fill="#c83131"/><path d="M251.967,617.872a.5.5,0,0,1-.5-.5v-14.8l-3.091,4.39a.5.5,0,0,1-.818,0l-3.093-4.39v14.8a.5.5,0,0,1-1,0V601a.5.5,0,0,1,.909-.288l3.593,5.1,3.591-5.1a.5.5,0,0,1,.909.288v16.374A.5.5,0,0,1,251.967,617.872Z" transform="translate(129.289 -641.921) rotate(30)" fill="#c83131"/><path d="M243.965,617.372V601l4,5.68,4-5.68v16.374" transform="translate(-507.779 -393.955) rotate(-30)" fill="#c83131"/><path d="M251.967,617.872a.5.5,0,0,1-.5-.5v-14.8l-3.091,4.39a.5.5,0,0,1-.818,0l-3.093-4.39v14.8a.5.5,0,0,1-1,0V601a.5.5,0,0,1,.909-.288l3.593,5.1,3.591-5.1a.5.5,0,0,1,.909.288v16.374A.5.5,0,0,1,251.967,617.872Z" transform="translate(-507.779 -393.955) rotate(-30)" fill="#c83131"/><path d="M21.5,0A21.5,21.5,0,1,1,0,21.5,21.5,21.5,0,0,1,21.5,0Z" transform="translate(4 7)" fill="#ffcb5e"/><path d="M10.774,21.548H0V10.774A10.765,10.765,0,0,1,10.774,0V10.127a.647.647,0,0,0,.646.647H21.548A10.765,10.765,0,0,1,10.774,21.548Z" transform="translate(15.226 16.726)" fill="#544422"/></g></svg>';
        } else if (rank == 1) {
            rankIcon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M0,17V0L4,4.463,8,0V17Z" transform="translate(38.299 1.616) rotate(30)" fill="#277794" stroke="#19a7dc" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path d="M0,17V0L4,4.463,8,0V17Z" transform="translate(4 5.616) rotate(-30)" fill="#277794" stroke="#19a7dc" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><g transform="translate(4 7)" fill="#7b7b7b" stroke="silver" stroke-width="3"><circle cx="21.5" cy="21.5" r="21.5" stroke="none"/><circle cx="21.5" cy="21.5" r="20" fill="none"/></g><path d="M143.572,147.058a21.752,21.752,0,0,0-19.357,18.14l3.317,7.71c-1.582-5.941.478-18.121,12.287-22Z" transform="translate(-120 -140)" fill="#d9d9d9"/><path d="M163.3,163.377s4.549,15.772-11.463,22.443l-2.453,3.832s15.263-1.98,17.528-19.378Z" transform="translate(-120 -140)" fill="#b4b4b4"/><circle cx="14.5" cy="14.5" r="14.5" transform="translate(11 14)" fill="#a8a8a8"/><g transform="translate(16.276 19.785)"><path d="M-86.873,140c-.146.028-11.674,8.446-11.674,8.446l7.2,6.6Z" transform="translate(107.32 -140)" fill="#5d5d5d"/><path d="M-118.154,158.743l14.419-3.64-16.023-15.035Z" transform="translate(119.758 -140.068)" fill="#6d6d6d"/></g><path d="M-77-119h-43a20.619,20.619,0,0,1,6.3-14.849A21.62,21.62,0,0,1-98.5-140a21.619,21.619,0,0,1,15.2,6.151A20.62,20.62,0,0,1-77-119h0Z" transform="translate(-126.405 54.527) rotate(120)" fill="#fff" opacity="0.48"/></g></svg>';
        } else if (rank == 2) {
            rankIcon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M0,17V0L4,4.463,8,0V17Z" transform="translate(38.299 1.616) rotate(30)" fill="#802c2c" stroke="#c83131" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path d="M0,17V0L4,4.463,8,0V17Z" transform="translate(4 5.616) rotate(-30)" fill="#802c2c" stroke="#c83131" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><g transform="translate(4 7)" fill="#c4a500" stroke="gold" stroke-width="3"><circle cx="21.5" cy="21.5" r="21.5" stroke="none"/><circle cx="21.5" cy="21.5" r="20" fill="none"/></g><path d="M143.572,147.058a21.752,21.752,0,0,0-19.357,18.14l3.317,7.71c-1.582-5.941.478-18.121,12.287-22Z" transform="translate(-120 -140)" fill="#fff"/><path d="M163.3,163.377s4.549,15.772-11.463,22.443l-2.453,3.832s15.263-1.98,17.528-19.378Z" transform="translate(-120 -140)" fill="#ecc700"/><circle cx="14.5" cy="14.5" r="14.5" transform="translate(11 14)" fill="#dcb900"/><g transform="translate(16.276 19.785)"><path d="M-86.873,140c-.146.028-11.674,8.446-11.674,8.446l7.2,6.6Z" transform="translate(107.32 -140)" fill="#816d00"/><path d="M-118.154,158.743l14.419-3.64-16.023-15.035Z" transform="translate(119.758 -140.068)" fill="#927b00"/></g><path d="M-77-119h-43a20.619,20.619,0,0,1,6.3-14.849A21.62,21.62,0,0,1-98.5-140a21.619,21.619,0,0,1,15.2,6.151A20.62,20.62,0,0,1-77-119h0Z" transform="translate(-126.557 54.423) rotate(120)" fill="#fff" opacity="0.48"/></g></svg>';
        } else if (rank == 3) {
            rankIcon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M0,17V0L4,4.463,8,0V17Z" transform="translate(38.299 1.616) rotate(30)" fill="#1e5834" stroke="#319455" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path d="M0,17V0L4,4.463,8,0V17Z" transform="translate(4 5.616) rotate(-30)" fill="#1e5834" stroke="#319455" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><g transform="translate(4 7)" fill="#606b77" stroke="#a0b2c6" stroke-width="3"><circle cx="21.5" cy="21.5" r="21.5" stroke="none"/><circle cx="21.5" cy="21.5" r="20" fill="none"/></g><path d="M143.572,147.058a21.752,21.752,0,0,0-19.357,18.14l3.317,7.71c-1.582-5.941.478-18.121,12.287-22Z" transform="translate(-120 -140)" fill="#d4e1f1"/><circle cx="14.5" cy="14.5" r="14.5" transform="translate(11 14)" fill="#7b8a9a"/><path d="M163.3,163.377s4.549,15.772-11.463,22.443l-2.453,3.832s15.263-1.98,17.528-19.378Z" transform="translate(-120 -140)" fill="#8e9eb1"/><g transform="translate(16.276 19.785)"><path d="M-86.873,140c-.146.028-11.674,8.446-11.674,8.446l7.2,6.6Z" transform="translate(107.32 -140)" fill="#3d454e"/><path d="M-118.154,158.743l14.419-3.64-16.023-15.035Z" transform="translate(119.758 -140.068)" fill="#56616d"/></g><path d="M-77.18-119.015l-43-.037a21.577,21.577,0,0,1,1.756-7.935,22,22,0,0,1,4.453-6.686,20.585,20.585,0,0,1,14.862-6.336c.2,0,.4,0,.607.009a22.876,22.876,0,0,1,8.375,1.8,20.893,20.893,0,0,1,6.626,4.481,22.273,22.273,0,0,1,6.319,14.707Z" transform="translate(-126.457 54.723) rotate(120)" fill="#fff" opacity="0.48"/></g></svg>';
        } else if (rank == 4) {
            rankIcon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M0,17V0L4,4.463,8,0V17Z" transform="translate(38.299 1.616) rotate(30)" fill="#277794" stroke="#19a7dc" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path d="M0,17V0L4,4.463,8,0V17Z" transform="translate(4 5.616) rotate(-30)" fill="#277794" stroke="#19a7dc" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><g transform="translate(4 7)" fill="#7ca19c" stroke="#deefed" stroke-width="3"><circle cx="21.5" cy="21.5" r="21.5" stroke="none"/><circle cx="21.5" cy="21.5" r="20" fill="none"/></g><path d="M143.572,147.058a21.752,21.752,0,0,0-19.357,18.14l3.317,7.71c-1.582-5.941.478-18.121,12.287-22Z" transform="translate(-120 -140)" fill="#fff"/><path d="M163.3,163.377s4.549,15.772-11.463,22.443l-2.453,3.832s15.263-1.98,17.528-19.378Z" transform="translate(-120 -140)" fill="#ccdfdd"/><circle cx="14.5" cy="14.5" r="14.5" transform="translate(11 14)" fill="#aecbc7"/><g transform="translate(16.276 19.785)"><path d="M-86.873,140c-.146.028-11.674,8.446-11.674,8.446l7.2,6.6Z" transform="translate(107.32 -140)" fill="#495856"/><path d="M-118.154,158.743l14.419-3.64-16.023-15.035Z" transform="translate(119.758 -140.068)" fill="#596d6a"/></g><path d="M-77.18-119.015l-43-.037a21.577,21.577,0,0,1,1.756-7.935,22,22,0,0,1,4.453-6.686,20.585,20.585,0,0,1,14.862-6.336c.2,0,.4,0,.607.009a22.876,22.876,0,0,1,8.375,1.8,20.893,20.893,0,0,1,6.626,4.481,22.273,22.273,0,0,1,6.319,14.707Z" transform="translate(-126.34 54.723) rotate(120)" fill="#fff" opacity="0.48"/></g></svg>';
        } else if (rank == 5) {
            rankIcon = getSVGLouibooksLogo(6);
        }

        let rankTitle = getLanguage("popup_my_profile_rank_title");
        rankTitle = rankTitle.replaceAll("{R:0}", "<b>" + getLanguage("user_rank:" + rank) + "</b>");

        let rankDescription = "...";
        if (rank == 5) {
            let curr = new Date();
            let utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
            let currentTime = new Date(utc);
            let second = new Date(loginStatus["rankInfo"]["premiumExpiryDate"]).getTime() - currentTime.getTime();
            second /= 1000;

            rankDescription = getLanguage("popup_my_profile_rank_premium").replaceAll("{R:0}", getTimeText(second));
        } else if (rank == 4) {
            rankDescription = getLanguage("popup_my_profile_rank_thank_you");
        } else {
            rankDescription = getLanguage("popup_my_profile_rank_description");
            rankDescription = rankDescription.replaceAll("{R:0}", getLanguage("user_rank:" + (rank + 1)));
            rankDescription = rankDescription.replaceAll("{R:1}", commas(nextPoints));
        }

        let rankLineWrapStyle = "";
        if (rank == 4 || rank == 5) {
            rankLineWrapStyle = "display: none";
        }

        let buyPremiumStyle = "";
        if (rank == 5) {
            buyPremiumStyle = "display: none;";
        }

        let adultCertification = "";
        if (userLocation == "kr" && loginStatus["adult"] == false) {
            adultCertification = `
                <div class = "popup_my_profile_menu_item md-ripples" onclick = "window.open('https://bauth.bbaton.com/oauth/authorize?client_id=JDJhJDA0JE5CbUwwbXFidi9SZ2xhSWdNWjkwNHVyenB2Qk1LR2dTcUlsT05u&redirect_uri=https://louibooks.com/php/user/bbaton/callback.php&response_type=code&scope=read_profile', 'bbaton', 'width=400, height=500'); hidePopupElement();">
                    <div class = "popup_my_profile_menu_item_left">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-935,50a24.843,24.843,0,0,1-9.731-1.965,24.918,24.918,0,0,1-7.947-5.358,24.916,24.916,0,0,1-5.358-7.947A24.842,24.842,0,0,1-960,25a24.842,24.842,0,0,1,1.965-9.731,24.916,24.916,0,0,1,5.358-7.947,24.918,24.918,0,0,1,7.947-5.358A24.843,24.843,0,0,1-935,0a24.843,24.843,0,0,1,9.731,1.965,24.918,24.918,0,0,1,7.947,5.358,24.916,24.916,0,0,1,5.358,7.947A24.842,24.842,0,0,1-910,25a24.842,24.842,0,0,1-1.965,9.731,24.916,24.916,0,0,1-5.358,7.947,24.918,24.918,0,0,1-7.947,5.358A24.843,24.843,0,0,1-935,50Zm0-47a22.025,22.025,0,0,0-22,22,22.024,22.024,0,0,0,22,22,22.025,22.025,0,0,0,22-22A22.025,22.025,0,0,0-935,3Z" transform="translate(960)"/><g transform="translate(-0.399)"><path d="M976.085,19.876V35.016h4.305V14.938h-2.625a17.727,17.727,0,0,1-5.875,2.953V21.5A9.479,9.479,0,0,0,976.085,19.876Z" transform="translate(-960)"/><path d="M-954.751,20.268a12.083,12.083,0,0,1-4.171-.783V15.923a6.92,6.92,0,0,0,3.643,1.047,5.256,5.256,0,0,0,1.217-.125,4.427,4.427,0,0,0,3.256-3.248,7.721,7.721,0,0,0,.291-2.533,4.637,4.637,0,0,1-3.832,1.869,6.6,6.6,0,0,1-2.5-.51,5.565,5.565,0,0,1-2.6-2.566,6.343,6.343,0,0,1-.552-3.01,10.5,10.5,0,0,1,.822-3.549,5.716,5.716,0,0,1,1.32-1.625A6.98,6.98,0,0,1-953.249,0h.119A6.276,6.276,0,0,1-948.7,1.649,5.4,5.4,0,0,1-947.483,3.3a16.558,16.558,0,0,1,1.1,4.2,14.182,14.182,0,0,1-1.557,8.877,7.464,7.464,0,0,1-3.208,3.114A8.139,8.139,0,0,1-954.751,20.268Zm1.42-16.965a2.2,2.2,0,0,0-.36.026A2.909,2.909,0,0,0-955.3,4.667a4.53,4.53,0,0,0-.105,3.553,2.628,2.628,0,0,0,2.179,1.557c.075,0,.144,0,.211-.01a2.854,2.854,0,0,0,1.867-.923,3.277,3.277,0,0,0,.586-2.609C-950.893,3.589-952.608,3.3-953.331,3.3Z" transform="translate(985.143 14.866)"/></g></g></svg>
                    </div>
                    <div class = "popup_my_profile_menu_item_right">
                        ` + getLanguage("header_more_button:adult_certification") + `
                    </div>
                </div>
            `;
        }

        let adminMenu = "";
        if (loginStatus["admin"] == true || loginStatus["admin"] == "true") {
            adminMenu = `
                <div class = "popup_my_profile_menu_item md-ripples" onclick = "(getCurrentMenuName() != 'admin_dashboard') ? loadAdmin_dashboard() : null; hidePopupElement();">
                    <div class = "popup_my_profile_menu_item_left">
                        ` + getSVGLouibooksLogo(5) + `
                    </div>
                    <div class = "popup_my_profile_menu_item_right">
                        ` + getLanguage("header_more_button:admin") + `
                    </div>
                </div>
            `;
        }

        html += `
            <div class = "popup_my_profile_top">
                <div class = "popup_my_profile_user_info md-ripples" read_more = "false" onclick = "togglePopupMyProfileUserInfoReadMore();">
                    <div class = "popup_my_profile_user_info_left">
                        <div class="profile_element">
                            <div class="profile_info">` + JSON.stringify(loginStatus["profile"]) + `</div>
                            <div class="profile_image"></div>
                        </div>
                    </div>
                    <div class = "popup_my_profile_user_info_center">
                        <div class = "popup_my_profile_user_info_center_nickname">
                            ` + loginStatus["nickname"] + `
                        </div>
                        <div class = "popup_my_profile_user_info_center_email">
                            ` + loginStatus["email"] + `
                        </div>
                    </div>
                    <div class = "popup_my_profile_user_info_right">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17.418 6.109c0.272-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-7.908 7.83c-0.27 0.268-0.707 0.268-0.979 0l-7.908-7.83c-0.27-0.268-0.27-0.701 0-0.969s0.709-0.268 0.979 0l7.419 7.141 7.418-7.141z"></path></svg>
                    </div>
                </div>
                <div class = "popup_my_profile_user_info_read_more">
                    <div class = "popup_my_profile_line"></div>
                    <div class = "popup_my_profile_user_info_read_more_contents">
                        <div class = "popup_my_profile_menu_item md-ripples" onclick = "openPopupContents('change_profile'); hidePopupElement();">
                            <div class = "popup_my_profile_menu_item_left">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="a"><rect width="50" height="50"/></clipPath></defs><g id="b" clip-path="url(#a)"><g clip-path="url(#a)"><path d="M11,22a11,11,0,1,1,7.778-3.222A11,11,0,0,1,11,22ZM11,3a8,8,0,1,0,8,8,8,8,0,0,0-8-8Z" transform="translate(14)"/><path d="M29.719,61H19A19,19,0,0,1,0,42V24A19,19,0,0,1,19,5h8.569a18.6,18.6,0,0,0-2.918,3.5H18.719a16.018,16.018,0,0,0-16,16v18a16.018,16.018,0,0,0,16,16h11a16.018,16.018,0,0,0,16-16V36.169a18.428,18.428,0,0,0,3-1.233V42a19,19,0,0,1-19,19Z" transform="translate(1.281 20)"/></g><path d="M761,48.686c0-.095.015-14.9.015-14.9s5.813,5.859,5.906,5.891a1.552,1.552,0,0,0,1.969-.172,1.418,1.418,0,0,0,.2-1.828c-.094-.109-8.594-8.609-8.594-8.609a1.436,1.436,0,0,0-1.734,0c-.75.7-8.547,8.609-8.547,8.609a1.3,1.3,0,0,0,.063,1.672,1.567,1.567,0,0,0,2.344.078c.5-.562,5.406-5.391,5.406-5.391V48.563a1.4,1.4,0,0,0,1.438,1.359A1.518,1.518,0,0,0,761,48.686Z" transform="translate(-721.335 -1.944)"/></g></svg>
                            </div>
                            <div class = "popup_my_profile_menu_item_right">
                                ` + getLanguage("header_more_button_box:change_profile") + `
                            </div>
                        </div>
                        <div class = "popup_my_profile_menu_item md-ripples" onclick = "(getCurrentMenuName() != 'write_questions') ? loadMenu_write_questions() : null; hidePopupElement();">
                            <div class = "popup_my_profile_menu_item_left">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,50A25.007,25.007,0,0,1,15.269,1.965,25.007,25.007,0,0,1,34.731,48.036,24.843,24.843,0,0,1,25,50ZM25,3A22,22,0,1,0,47,25,22.025,22.025,0,0,0,25,3Z"></path><g transform="translate(-24 6)"><rect width="3" height="24" rx="1.5" transform="translate(48 11)"></rect><rect width="3" height="4" rx="1.5" transform="translate(48 3)"></rect></g></g></svg>
                            </div>
                            <div class = "popup_my_profile_menu_item_right">
                                ` + getLanguage("popup_write_questions_button") + `
                            </div>
                        </div>
                        ` + adultCertification + `
                        <div class = "popup_my_profile_menu_item md-ripples" onclick = "(getCurrentMenuName() != 'withdrawal') ? loadMenu_withdrawal() : null; hidePopupElement();">
                            <div class = "popup_my_profile_menu_item_left">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="50" height="3" rx="1.5" transform="translate(0 11)"></rect><path d="M31,39H5a5.006,5.006,0,0,1-5-5V0H4.932A2,2,0,0,0,3,2V34a2,2,0,0,0,2,2H31a2,2,0,0,0,2-2V2a2,2,0,0,0-1.914-2L36,0V34A5.006,5.006,0,0,1,31,39Z" transform="translate(7 11)"></path><path d="M5,14,0,14V5A5.006,5.006,0,0,1,5,0H21a5.006,5.006,0,0,1,5,5v9H21.007A2,2,0,0,0,23,12V5a2,2,0,0,0-2-2H5A2,2,0,0,0,3,5v7a2,2,0,0,0,2,2H5Z" transform="translate(12)"></path><rect width="3" height="15" rx="1.5" transform="translate(24 22)"></rect><rect width="3" height="15" rx="1.5" transform="translate(33 22)"></rect><rect width="3" height="15" rx="1.5" transform="translate(15 22)"></rect></g></svg>
                            </div>
                            <div class = "popup_my_profile_menu_item_right">
                                ` + getLanguage("header_more_button_box:withdrawal") + `
                            </div>
                        </div>
                        <div class = "popup_my_profile_menu_item md-ripples" onclick = "logout(); hidePopupElement();">
                            <div class = "popup_my_profile_menu_item_left">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5"/><rect width="3" height="32" rx="1.5" transform="translate(32) rotate(90)"/><rect width="3" height="32" rx="1.5" transform="translate(32 47) rotate(90)"/><g transform="translate(10)"><rect width="3" height="33" rx="1.5" transform="translate(39 24) rotate(90)"/><rect width="3" height="18" rx="1.5" transform="translate(40 25.585) rotate(135)"/><rect width="3" height="18" rx="1.5" transform="translate(37.879 23.686) rotate(45)"/></g></g></svg>
                            </div>
                            <div class = "popup_my_profile_menu_item_right">
                                ` + getLanguage("header_more_button_box:logout") + `
                            </div>
                        </div>
                        <div class = "popup_my_profile_menu_item md-ripples" onclick = "loadMenu_login(); hidePopupElement();">
                            <div class = "popup_my_profile_menu_item_left">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,22A11,11,0,0,1,3.222,3.222,11,11,0,1,1,18.778,18.778,10.928,10.928,0,0,1,11,22ZM11,3a8,8,0,1,0,8,8A8.009,8.009,0,0,0,11,3Z" transform="translate(14)"/><path d="M29.719,61H19A19,19,0,0,1,0,42V24A19,19,0,0,1,19,5h8.569a18.6,18.6,0,0,0-2.918,3.5H18.719a16.018,16.018,0,0,0-16,16v18a16.018,16.018,0,0,0,16,16h11a16.018,16.018,0,0,0,16-16V36.169a18.429,18.429,0,0,0,3-1.233V42a19,19,0,0,1-19,19Z" transform="translate(1.281 20)"/><g transform="translate(0 2)"><path d="M10,22A10,10,0,0,1,10,2V5a7,7,0,1,0,6.709,5H19.8A10,10,0,0,1,10,22Z" transform="translate(27 24)"/><rect width="2" height="6.882" rx="1" transform="translate(42.014 38.166) rotate(-135)"/><rect width="2" height="7" rx="1" transform="translate(50.464 36.836) rotate(135)"/></g></g></svg>
                            </div>
                            <div class = "popup_my_profile_menu_item_right">
                                ` + getLanguage("header_more_button_box:other_account_login_button") + `
                            </div>
                        </div>
                        <div class = "popup_my_profile_menu_item md-ripples" style = "` + buyPremiumStyle + `" onclick = "openPopupContents('buy_premium'); hidePopupElement();">
                            <div class = "popup_my_profile_menu_item_left">
                                ` + getSVGLouibooksLogo(6) + `
                            </div>
                            <div class = "popup_my_profile_menu_item_right">
                                ` + getLanguage("header_more_button_box:buy_premium") + `
                            </div>
                        </div>
                        ` + otherAccountHtml + `
                    </div>
                </div>
                <div class = "popup_my_profile_line"></div>
                <div class = "popup_my_profile_user_rank">
                    <div class = "popup_my_profile_user_rank_left">
                        ` + rankIcon + `
                    </div>
                    <div class = "popup_my_profile_user_rank_right">
                        <div class = "popup_my_profile_user_rank_right_title">
                            ` + rankTitle + `
                        </div>
                        <div class = "popup_my_profile_user_rank_right_line_wrap" style = "` + rankLineWrapStyle + `">
                            <div class = "popup_my_profile_user_rank_right_line"></div>
                        </div>
                        <div class = "popup_my_profile_user_rank_right_description">
                            ` + rankDescription + `
                        </div>
                    </div>
                </div>
            </div>
            <div class = "popup_my_profile_line"></div>
            <div class = "popup_my_profile_menu">
                <div class = "popup_my_profile_menu_title">
                    ` + getLanguage("popup_my_profile_menu_move_title") + `
                </div>
                <div class = "popup_my_profile_menu_item md-ripples" onclick = "refreshCurrentMenu(); hidePopupElement();">
                    <div class = "popup_my_profile_menu_item_left">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"> <defs> <clipPath id="clip-reload"> <rect width="50" height="50"/> </clipPath> </defs> <g id="reload" clip-path="url(#clip-reload)"> <path id="빼기_30" data-name="빼기 30" d="M-2615,50a24.844,24.844,0,0,1-9.731-1.965,24.917,24.917,0,0,1-7.947-5.358,24.922,24.922,0,0,1-5.358-7.947A24.844,24.844,0,0,1-2640,25a24.844,24.844,0,0,1,1.965-9.731,24.922,24.922,0,0,1,5.358-7.947,24.917,24.917,0,0,1,7.947-5.358A24.844,24.844,0,0,1-2615,0a24.835,24.835,0,0,1,14.413,4.571,24.948,24.948,0,0,1,9.019,11.7l-.1,1.04h-2.71A22.1,22.1,0,0,0-2615,3a22.025,22.025,0,0,0-22,22,22.025,22.025,0,0,0,22,22,22.03,22.03,0,0,0,21.244-16.264h3.094a24.808,24.808,0,0,1-3.232,7.669,25.065,25.065,0,0,1-5.471,6.1,24.9,24.9,0,0,1-7.2,4.034A24.932,24.932,0,0,1-2615,50Z" transform="translate(2640)"/> <g id="그룹_29" data-name="그룹 29" transform="translate(0 1)"> <rect id="사각형_65" data-name="사각형 65" width="3" height="14" rx="1.5" transform="translate(47 5)"/> <rect id="사각형_66" data-name="사각형 66" width="3" height="14" rx="1.5" transform="translate(35.892 19) rotate(-90)"/> </g> </g> </svg>
                    </div>
                    <div class = "popup_my_profile_menu_item_right">
                        ` + getLanguage("header_more_button:menu_refresh") + ` <b>Shift + R</b>
                    </div>
                </div>
                <div class = "popup_my_profile_menu_item md-ripples" onclick = "(getCurrentMenuName() != 'my_account_management') ? loadMyAccount_management() : null; hidePopupElement();">
                    <div class = "popup_my_profile_menu_item_left">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M32,50H18V44.8a20.917,20.917,0,0,1-6.33-3.577L7,43.924,0,31.8l4.429-2.557a21.187,21.187,0,0,1,0-8.487L0,18.2,7,6.075l4.671,2.7A20.917,20.917,0,0,1,18,5.195V0H32V5.195a20.917,20.917,0,0,1,6.33,3.577L43,6.075,50,18.2l-4.429,2.557a21.187,21.187,0,0,1,0,8.487L50,31.8,43,43.924l-4.67-2.7A20.917,20.917,0,0,1,32,44.8V50ZM11.953,37.578h0a22.447,22.447,0,0,0,9.062,5.093v4.3H29.03v-4.3a16.377,16.377,0,0,0,2.854-1.023,23.142,23.142,0,0,0,6.1-4.039l3.891,2.235L45.89,32.89,42.2,30.75a21.8,21.8,0,0,0,0-11.485l3.7-2.14L41.89,10.187l-3.86,2.25a21.509,21.509,0,0,0-9.047-5.109c.005-.331.059-4.27,0-4.328-.021.014-.725.021-2.092.021C24.569,3.021,21.066,3,21.031,3V7.328A22.161,22.161,0,0,0,12,12.422L8.094,10.187,4.14,17.109l3.625,2.126c-.017.06-1.679,6.056.062,11.5l-3.7,2.156L8.094,39.8l3.859-2.219Z" transform="translate(0)"></path><path d="M10,20A10,10,0,1,1,20,10,10.011,10.011,0,0,1,10,20ZM10,3.294A6.706,6.706,0,1,0,16.706,10,6.713,6.713,0,0,0,10,3.294Z" transform="translate(15 15)"></path></g></svg>
                    </div>
                    <div class = "popup_my_profile_menu_item_right">
                        ` + getLanguage("menu_name:my_account_management") + `
                    </div>
                </div>
                <div class = "popup_my_profile_menu_item md-ripples" onclick = "loadMenu_user(` + loginStatus["number"] + `); hidePopupElement();">
                    <div class = "popup_my_profile_menu_item_left">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,22A11,11,0,0,1,3.222,3.222,11,11,0,1,1,18.778,18.778,10.928,10.928,0,0,1,11,22ZM11,3a8,8,0,1,0,8,8A8.009,8.009,0,0,0,11,3Z" transform="translate(14)"></path><path d="M29.719,56H19A19,19,0,0,1,0,37V19A19,19,0,0,1,19,0H29.719a19,19,0,0,1,19,19V37a19,19,0,0,1-19,19Zm-11-52.5a16.018,16.018,0,0,0-16,16v18a16.018,16.018,0,0,0,16,16h11a16.018,16.018,0,0,0,16-16v-18a16.018,16.018,0,0,0-16-16Z" transform="translate(1.281 25)"></path></g></svg>
                    </div>
                    <div class = "popup_my_profile_menu_item_right">
                        ` + getLanguage("header_more_button:my_page") + `
                    </div>
                </div>
                <div class = "popup_my_profile_menu_item md-ripples" onclick = "(getCurrentMenuName() != 'workspace_dashboard') ? loadWorkspace_dashboard() : null; hidePopupElement();">
                    <div class = "popup_my_profile_menu_item_left">
                        ` + getSVGLouibooksLogo(1) + `
                    </div>
                    <div class = "popup_my_profile_menu_item_right">
                        ` + getLanguage("header_more_button:workspace") + `
                    </div>
                </div>
                <div class = "popup_my_profile_menu_item md-ripples" onclick = "(getCurrentMenuName() != 'cloud') ? loadMenu_cloud() : null; hidePopupElement();">
                    <div class = "popup_my_profile_menu_item_left">
                        ` + getSVGLouibooksLogo(2) + `
                    </div>
                    <div class = "popup_my_profile_menu_item_right">
                        ` + getLanguage("header_more_button:cloud") + `
                    </div>
                </div>
                ` + adminMenu + `
            </div>
            <div class = "popup_my_profile_line"></div>
        `;
    }



    //로그아웃 상태에서 다른 계정 로그인
    if (loginStatus["isLogin"] == false && otherAccountHtml != "") {
        html += `
            <div class = "popup_my_profile_user_info_other_account">
                <div class = "popup_my_profile_user_info_other_account_title">
                    ` + getLanguage("header_more_button_box:other_account_login_button") + `
                </div>
                ` + otherAccountHtml + `
            </div>
            <div class = "popup_my_profile_line"></div>
        `;
    }



    let screenModeValue = "...";
    let settingsData = getDataPopupMyProfileSettings("screen_mode");
    for (let i = 0; i < settingsData.length; i++) {
        if (settingsData[i]["checked"] == true) {
            screenModeValue = settingsData[i]["value"];
        }
    }
    let locationsValue = "...";
    settingsData = getDataPopupMyProfileSettings("location");
    for (let i = 0; i < settingsData.length; i++) {
        if (settingsData[i]["checked"] == true) {
            locationsValue = settingsData[i]["value"];
        }
    }
    let imageRenderingValue = "...";
    settingsData = getDataPopupMyProfileSettings("image_rendering");
    for (let i = 0; i < settingsData.length; i++) {
        if (settingsData[i]["checked"] == true) {
            imageRenderingValue = settingsData[i]["value"];
        }
    }
    let clickEffectSpeedValue = "...";
    settingsData = getDataPopupMyProfileSettings("click_effect_speed");
    for (let i = 0; i < settingsData.length; i++) {
        if (settingsData[i]["checked"] == true) {
            clickEffectSpeedValue = settingsData[i]["value"];
        }
    }

    html += `
        <div class = "popup_my_profile_settings">
            <div class = "popup_my_profile_settings_title">
                ` + getLanguage("popup_my_profile_settings_title") + `
            </div>
            <div class = "popup_my_profile_settings_item md-ripples" onclick = "popupMyProfileSettings('screen_mode');">
                <div class = "popup_my_profile_settings_item_left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><path d="M25,50A24.993,24.993,0,0,1,7.322,7.322,24.924,24.924,0,0,1,25,0a25.194,25.194,0,0,1,5.008.5A16,16,0,1,0,49.5,19.992,25.168,25.168,0,0,1,50,25,24.98,24.98,0,0,1,25,50ZM19.531,3.7h0a19.913,19.913,0,0,0-6.709,2.911,21.465,21.465,0,0,0-8.064,9.8A21.407,21.407,0,0,0,6.025,36.1a21.774,21.774,0,0,0,8.938,8.5,19.533,19.533,0,0,0,5.115,1.85,25.743,25.743,0,0,0,5.037.509,20.084,20.084,0,0,0,10.541-2.7,22.921,22.921,0,0,0,6.812-5.875,23.871,23.871,0,0,0,3.844-7.922,18.576,18.576,0,0,1-12.348,4.52c-.491,0-.994-.017-1.5-.051a18.923,18.923,0,0,1-9.677-3.61l-.224-.147a19.065,19.065,0,0,1-4.8-5.317,17.377,17.377,0,0,1-2.343-5.925A18.688,18.688,0,0,1,19.531,3.7Z" transform="translate(0 0)"></path></svg>
                </div>
                <div class = "popup_my_profile_settings_item_center">
                    <div class = "popup_my_profile_settings_item_center_title">
                        ` + getLanguage("header_more_button_box:screen_mode") + `
                    </div>
                    <div class = "popup_my_profile_settings_item_center_description">
                        ` + screenModeValue + `
                    </div>
                </div>
                <div class = "popup_my_profile_settings_item_right">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.25 10l-7.141-7.42c-0.268-0.27-0.268-0.707 0-0.979 0.268-0.27 0.701-0.27 0.969 0l7.83 7.908c0.268 0.271 0.268 0.709 0 0.979l-7.83 7.908c-0.268 0.271-0.701 0.27-0.969 0s-0.268-0.707 0-0.979l7.141-7.417z"></path></svg>
                </div>
            </div>
            <div class = "popup_my_profile_settings_item md-ripples" onclick = "popupMyProfileSettings('click_effect_speed');">
                <div class = "popup_my_profile_settings_item_left">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 28"><path d="M10 2c-1.109 0-2 0.891-2 2v14l-2.359-3.156c-0.391-0.516-1.016-0.844-1.672-0.844-1.094 0-1.969 0.922-1.969 2 0 0.438 0.141 0.859 0.406 1.203l6 8c0.375 0.5 0.969 0.797 1.594 0.797h11.219c0.453 0 0.859-0.313 0.969-0.75l1.437-5.75c0.25-1 0.375-2.016 0.375-3.031v-3.391c0-0.828-0.641-1.578-1.5-1.578-0.828 0-1.5 0.672-1.5 1.5h-0.5v-0.953c0-0.984-0.75-1.797-1.75-1.797-0.969 0-1.75 0.781-1.75 1.75v1h-0.5v-1.406c0-1.125-0.859-2.094-2-2.094-1.109 0-2 0.891-2 2v1.5h-0.5v-8.906c0-1.125-0.859-2.094-2-2.094zM10 0c2.234 0 4 1.875 4 4.094v3.437c0.172-0.016 0.328-0.031 0.5-0.031 1.016 0 1.969 0.391 2.703 1.078 0.484-0.219 1.016-0.328 1.547-0.328 1.125 0 2.172 0.5 2.875 1.359 0.297-0.078 0.578-0.109 0.875-0.109 1.969 0 3.5 1.641 3.5 3.578v3.391c0 1.172-0.141 2.359-0.438 3.516l-1.437 5.75c-0.328 1.328-1.531 2.266-2.906 2.266h-11.219c-1.25 0-2.453-0.609-3.203-1.594l-6-8c-0.516-0.688-0.797-1.547-0.797-2.406 0-2.188 1.781-4 3.969-4 0.719 0 1.422 0.187 2.031 0.547v-8.547c0-2.203 1.797-4 4-4zM12 22v-6h-0.5v6h0.5zM16 22v-6h-0.5v6h0.5zM20 22v-6h-0.5v6h0.5z"></path></svg>
                </div>
                <div class = "popup_my_profile_settings_item_center">
                    <div class = "popup_my_profile_settings_item_center_title">
                        ` + getLanguage("header_more_button_box:click_effect_speed") + `
                    </div>
                    <div class = "popup_my_profile_settings_item_center_description">
                        ` + clickEffectSpeedValue + `
                    </div>
                </div>
                <div class = "popup_my_profile_settings_item_right">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.25 10l-7.141-7.42c-0.268-0.27-0.268-0.707 0-0.979 0.268-0.27 0.701-0.27 0.969 0l7.83 7.908c0.268 0.271 0.268 0.709 0 0.979l-7.83 7.908c-0.268 0.271-0.701 0.27-0.969 0s-0.268-0.707 0-0.979l7.141-7.417z"></path></svg>
                </div>
            </div>
            <div class = "popup_my_profile_settings_item md-ripples" onclick = "popupMyProfileSettings('image_rendering');">
                <div class = "popup_my_profile_settings_item_left">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M46,50H4a4,4,0,0,1-4-4V4A4,4,0,0,1,4,0H46a4,4,0,0,1,4,4V46A4.005,4.005,0,0,1,46,50ZM5,3A2,2,0,0,0,3,5V45a2,2,0,0,0,2,2H45a2,2,0,0,0,2-2V5a2,2,0,0,0-2-2Z"></path><rect width="3" height="25" rx="1.5" transform="translate(19.278 28.71) rotate(45)"></rect><rect width="3" height="14.85" rx="1.5" transform="translate(17.727 30.831) rotate(-45)"></rect><rect width="3" height="20.943" rx="1.5" transform="translate(37.002 21.694) rotate(30)"></rect><rect width="3" height="25" rx="1.5" transform="translate(35.451 23.194) rotate(-30)"></rect><path d="M8.5,17A8.5,8.5,0,1,1,17,8.5,8.51,8.51,0,0,1,8.5,17Zm0-14A5.5,5.5,0,1,0,14,8.5,5.506,5.506,0,0,0,8.5,3Z" transform="translate(10 8)"></path></g></svg>
                </div>
                <div class = "popup_my_profile_settings_item_center">
                    <div class = "popup_my_profile_settings_item_center_title">
                        ` + getLanguage("header_more_button_box:image_rendering") + `
                    </div>
                    <div class = "popup_my_profile_settings_item_center_description">
                        ` + imageRenderingValue + `
                    </div>
                </div>
                <div class = "popup_my_profile_settings_item_right">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.25 10l-7.141-7.42c-0.268-0.27-0.268-0.707 0-0.979 0.268-0.27 0.701-0.27 0.969 0l7.83 7.908c0.268 0.271 0.268 0.709 0 0.979l-7.83 7.908c-0.268 0.271-0.701 0.27-0.969 0s-0.268-0.707 0-0.979l7.141-7.417z"></path></svg>
                </div>
            </div>
            <div class = "popup_my_profile_settings_item md-ripples" onclick = "popupMyProfileSettings('language');">
                <div class = "popup_my_profile_settings_item_left">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(0 -10)"><rect width="3" height="39" rx="1.5" transform="translate(13.339 12.326) rotate(20)"></rect><rect width="3" height="39" rx="1.5" transform="translate(12.35 13.352) rotate(-20)"></rect><rect width="3" height="15.5" rx="1.5" transform="translate(22.179 33.413) rotate(90)"></rect></g><g transform="translate(4.821 6)"><rect width="3" height="23.5" rx="1.5" transform="translate(45.179 15.413) rotate(90)"></rect><rect width="3" height="6.299" rx="1.5" transform="translate(34.929 17.589) rotate(180)"></rect><path d="M6.258-1.278A1.576,1.576,0,0,1,7.282.152s-3.4,8.118-4.351,14.5A42.123,42.123,0,0,0,3,26.749a1.5,1.5,0,0,1-3,0A46.581,46.581,0,0,1,.157,14.4C1.163,7.87,4.524-.436,4.524-.436A1.37,1.37,0,0,1,6.258-1.278Z" transform="translate(30.054 41.378) rotate(-150)"></path><path d="M-4.084.024A1.4,1.4,0,0,1-2.138.58,46.577,46.577,0,0,1,2.6,12.127a40.794,40.794,0,0,1,.4,11.8,1.5,1.5,0,0,1-3,0,25.612,25.612,0,0,0,0-10.38A49.119,49.119,0,0,0-4.77,1.8,1.48,1.48,0,0,1-4.084.024Z" transform="translate(39.585 41.423) rotate(150)"></path></g></g></svg>
                </div>
                <div class = "popup_my_profile_settings_item_center">
                    <div class = "popup_my_profile_settings_item_center_title">
                        ` + getLanguage("header_more_button_box:language") + `
                    </div>
                    <div class = "popup_my_profile_settings_item_center_description">
                        ` + getLanguage('language', userLanguage) + `
                    </div>
                </div>
                <div class = "popup_my_profile_settings_item_right">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.25 10l-7.141-7.42c-0.268-0.27-0.268-0.707 0-0.979 0.268-0.27 0.701-0.27 0.969 0l7.83 7.908c0.268 0.271 0.268 0.709 0 0.979l-7.83 7.908c-0.268 0.271-0.701 0.27-0.969 0s-0.268-0.707 0-0.979l7.141-7.417z"></path></svg>
                </div>
            </div>
            <div class = "popup_my_profile_settings_item md-ripples" onclick = "popupMyProfileSettings('location');">
                <div class = "popup_my_profile_settings_item_left">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,50A25.007,25.007,0,0,1,15.269,1.965,25.007,25.007,0,0,1,34.731,48.036,24.843,24.843,0,0,1,25,50ZM25,3A22,22,0,1,0,47,25,22.025,22.025,0,0,0,25,3Z"></path><rect width="48" height="2" transform="translate(26 1) rotate(90)"></rect><path d="M0,0S11.775-11.288,23.775-11.288,48,0,48,0V2S35.775-9.288,23.775-9.288,0,2,0,2Z" transform="translate(26 1) rotate(90)"></path><path d="M0,0S11.775-11.288,23.775-11.288,48,0,48,0V2S35.775-9.288,23.775-9.288,0,2,0,2Z" transform="translate(24 49) rotate(-90)"></path><path d="M0,0S11.923-4.994,23.923-4.994,48,0,48,0V2S35.923-2.994,23.923-2.994,0,2,0,2Z" transform="translate(49 31.856) rotate(-180)"></path><path d="M0,0S11.923-4.994,23.923-4.994,48,0,48,0V2S35.923-2.994,23.923-2.994,0,2,0,2Z" transform="translate(1 17.85)"></path></g></svg>
                </div>
                <div class = "popup_my_profile_settings_item_center">
                    <div class = "popup_my_profile_settings_item_center_title">
                        ` + getLanguage("header_more_button_box:location") + `
                    </div>
                    <div class = "popup_my_profile_settings_item_center_description">
                        ` + locationsValue + `
                    </div>
                </div>
                <div class = "popup_my_profile_settings_item_right">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.25 10l-7.141-7.42c-0.268-0.27-0.268-0.707 0-0.979 0.268-0.27 0.701-0.27 0.969 0l7.83 7.908c0.268 0.271 0.268 0.709 0 0.979l-7.83 7.908c-0.268 0.271-0.701 0.27-0.969 0s-0.268-0.707 0-0.979l7.141-7.417z"></path></svg>
                </div>
            </div>
        </div>
    `;

    function callback() {
        if (loginStatus != null && loginStatus["isLogin"] == true) {
            let maxPoints = Number.parseInt(loginStatus["rankInfo"]["maxPoints"]);
            let nextPoints = Number.parseInt(loginStatus["rankInfo"]["nextPoints"]);
            let parent = (maxPoints - nextPoints) / maxPoints;
    
            let user_rank_right_line = document.getElementsByClassName("popup_my_profile_user_rank_right_line")[0];
            user_rank_right_line.style.width = (parent * 100) + "%";
        }
    }
    window.requestAnimationFrame(callback);

    return html + "</div>";
}

function popupMyProfileSettings(type) {
    if (type == "my_profile") {
        setHtmlPopupElement(getHtmlPopupMyProfile());
    } else {
        setHtmlPopupElement(getHtmlPopupMyProfileSettings(type));
    }
}

function getHtmlPopupMyProfileSettings(type) {
    let html = '';

    let title = "...";
    let itemData = getDataPopupMyProfileSettings(type);
    
    if (type == "screen_mode") {
        title = getLanguage("header_more_button_box:screen_mode");
    } else if (type == "language") {
        title = getLanguage("header_more_button_box:language");
    } else if (type == "location") {
        title = getLanguage("header_more_button_box:location");
    } else if (type == "image_rendering") {
        title = getLanguage("header_more_button_box:image_rendering");
    } else if (type == "click_effect_speed") {
        title = getLanguage("header_more_button_box:click_effect_speed");
    }

    //
    let items = "";
    for (let i = 0; i < itemData.length; i++) {
        let image = "";
        if (itemData[i]["image"] != null) {
            image = `
                <div class = "popup_my_profile_settings_menu_item_image">
                    <img src = "` + itemData[i]["image"] + `" onload = "imageLoad(event);" alt = "">
                </div>
            `;
        }
        let description = "";
        if (itemData[i]["description"] != null) {
            description = `
                <div class = "popup_my_profile_settings_menu_item_right_description">
                    ` + itemData[i]["description"] + `
                </div>
            `;
        }
        items += `
            <div class = "popup_my_profile_settings_menu_item md-ripples" onclick = "` + itemData[i]["onclick"] + ` popupMyProfileSettings('my_profile');" checked = "` + itemData[i]["checked"] + `">
                <div class = "popup_my_profile_settings_menu_item_left">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                </div>
                ` + image + `
                <div class = "popup_my_profile_settings_menu_item_right">
                    <div class = "popup_my_profile_settings_menu_item_right_title">
                        ` + itemData[i]["value"] + `
                    </div>
                    ` + description + `
                </div>
            </div>
        `;
    }

    html = `
        <div class = "popup_my_profile">
            <div class = "popup_my_profile_settings_menu_top">
                <div class = "popup_my_profile_settings_menu_top_left md-ripples" onclick = "popupMyProfileSettings('my_profile');">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"></rect><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"></rect></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"></rect></g></svg>
                </div>
                <div class = "popup_my_profile_settings_menu_top_right">
                    <div class = "popup_my_profile_settings_menu_top_right_title">
                        ` + title + `
                    </div>
                    <div class = "popup_my_profile_settings_menu_top_right_description">

                    </div>
                </div>
            </div>
            <div class = "popup_my_profile_settings_menu_items">
                ` + items + `
            </div>
        </div>
    `;

    return html;
}

function getDataPopupMyProfileSettings(type) {
    let itemData = new Array();
    
    if (type == "screen_mode") {
        itemData[itemData.length] = {
            "value": getLanguage("header_more_button_box_settings:screen_mode_1"),
            "checked": (getDisplayColor() == null),
            "onclick": "setDisplayColor(null);"
        };
        itemData[itemData.length] = {
            "value": getLanguage("header_more_button_box_settings:screen_mode_3"),
            "checked": (getDisplayColor() == 'light'),
            "onclick": "setDisplayColor('light');"
        };
        itemData[itemData.length] = {
            "value": getLanguage("header_more_button_box_settings:screen_mode_2"),
            "checked": (getDisplayColor() == 'dark'),
            "onclick": "setDisplayColor('dark');"
        };
        itemData[itemData.length] = {
            "value": getLanguage("header_more_button_box_settings:screen_mode_4"),
            "checked": (getDisplayColor() == 'black'),
            "onclick": "setDisplayColor('black');"
        };
    } else if (type == "language") {
        for (let i = 0; i < languages.length; i++) {
            itemData[itemData.length] = {
                "value": getLanguage('language', languages[i]),
                "description": getLanguage('language:' + languages[i]),
                "checked": (userLanguage == languages[i]),
                "onclick": "setLanguage('" + languages[i] + "'); hidePopupElement(); //",
                "image": getImageUrlCountry(null, languages[i])
            };
        }
    } else if (type == "location") {
        for (let i = 0; i < locations.length; i++) {
            itemData[itemData.length] = {
                "value": getLanguage("location:" + locations[i]),
                "checked": (getLocation() == locations[i]),
                "onclick": "setLocation('" + locations[i] + "');",
                "image": getImageUrlCountry(locations[i])
            };
        }

        let names = new Array();
        for (let i = 0; i < itemData.length; i++) {
            names[names.length] = itemData[i]["value"];
        }
        names.sort();
        
        let newItemData = new Array();
        for (let i = 0; i < names.length; i++) {
            for (let j = 0; j < itemData.length; j++) {
                if (names[i] == itemData[j]["value"]) {
                    newItemData[newItemData.length] = itemData[j];
                }
            }
        }
        itemData = newItemData;

        itemData.unshift({
            "value": getLanguage('location:default').replaceAll("{R:0}", getLanguage("location:" + userLocation)),
            "checked": (getLocation() == "default"),
            "onclick": "setLocation(null);",
            "image": getImageUrlCountry(userLocation)
        });
    } else if (type == "image_rendering") {
        itemData[itemData.length] = {
            "value": getLanguage("header_more_button_box_settings:image_rendering_default"),
            "checked": (getValuePopupElementMyProfileSettings('--image-rendering') == "auto"),
            "onclick": "setValuePopupElementMyProfileSettings('--image-rendering', 'auto');"
        };
        itemData[itemData.length] = {
            "value": getLanguage("header_more_button_box_settings:image_rendering_pixelated"),
            "checked": (getValuePopupElementMyProfileSettings('--image-rendering') == 'pixelated'),
            "onclick": "setValuePopupElementMyProfileSettings('--image-rendering', 'pixelated');"
        };
        itemData[itemData.length] = {
            "value": getLanguage("header_more_button_box_settings:image_rendering_smooth"),
            "checked": (getValuePopupElementMyProfileSettings('--image-rendering') == 'smooth'),
            "onclick": "setValuePopupElementMyProfileSettings('--image-rendering', 'smooth');"
        };
        itemData[itemData.length] = {
            "value": getLanguage("header_more_button_box_settings:image_rendering_high-quality"),
            "checked": (getValuePopupElementMyProfileSettings('--image-rendering') == 'high-quality'),
            "onclick": "setValuePopupElementMyProfileSettings('--image-rendering', 'high-quality');"
        };
        itemData[itemData.length] = {
            "value": getLanguage("header_more_button_box_settings:image_rendering_crisp-edges"),
            "checked": (getValuePopupElementMyProfileSettings('--image-rendering') == 'crisp-edges'),
            "onclick": "setValuePopupElementMyProfileSettings('--image-rendering', 'crisp-edges');"
        };
    } else if (type == "click_effect_speed") {
        itemData[itemData.length] = {
            "value": "0.0x",
            "checked": (getValuePopupElementMyProfileSettings('--click-effect-speed') == 0),
            "onclick": "setValuePopupElementMyProfileSettings('--click-effect-speed', 0);"
        };
        itemData[itemData.length] = {
            "value": "0.5x",
            "checked": (getValuePopupElementMyProfileSettings('--click-effect-speed') == 0.6),
            "onclick": "setValuePopupElementMyProfileSettings('--click-effect-speed', 0.6);"
        };
        itemData[itemData.length] = {
            "value": "1.0x",
            "checked": (getValuePopupElementMyProfileSettings('--click-effect-speed') == 1),
            "onclick": "setValuePopupElementMyProfileSettings('--click-effect-speed', 1);"
        };
        itemData[itemData.length] = {
            "value": "1.5x",
            "checked": (getValuePopupElementMyProfileSettings('--click-effect-speed') == 1.5),
            "onclick": "setValuePopupElementMyProfileSettings('--click-effect-speed', 1.5);"
        };
        itemData[itemData.length] = {
            "value": "2.0x",
            "checked": (getValuePopupElementMyProfileSettings('--click-effect-speed') == 2),
            "onclick": "setValuePopupElementMyProfileSettings('--click-effect-speed', 2);"
        };
        itemData[itemData.length] = {
            "value": "3.0x",
            "checked": (getValuePopupElementMyProfileSettings('--click-effect-speed') == 3),
            "onclick": "setValuePopupElementMyProfileSettings('--click-effect-speed', 3);"
        };
        itemData[itemData.length] = {
            "value": "4.0x",
            "checked": (getValuePopupElementMyProfileSettings('--click-effect-speed') == 4),
            "onclick": "setValuePopupElementMyProfileSettings('--click-effect-speed', 4);"
        };
        itemData[itemData.length] = {
            "value": "5.0x",
            "checked": (getValuePopupElementMyProfileSettings('--click-effect-speed') == 5),
            "onclick": "setValuePopupElementMyProfileSettings('--click-effect-speed', 5);"
        };
    }

    return itemData;
}

function loadValuesPopupElementMyProfileSettings() {
    let defaultValue = {
        '--image-rendering': 'auto',
        '--click-effect-speed': 1
    }
    let style = document.documentElement.style;
    for (let [key, value] of Object.entries(defaultValue)) {
        let cookieValue = getCookiePopupElementMyProfileSettings(key);
        style.setProperty(key, ((cookieValue != null) ? cookieValue : value));
    }
}
function getValuePopupElementMyProfileSettings(name) {
    let style = document.documentElement.style;
    return style.getPropertyValue(name);
}
function getCookiePopupElementMyProfileSettings(name) {
    if (name == "--image-rendering") {
        return getCookie("imageRendering");
    } else if (name == "--click-effect-speed") {
        return getCookie("clickEffectSpeed");
    }
}
function setValuePopupElementMyProfileSettings(name, value) {
    let style = document.documentElement.style;
    style.setProperty(name, value);

    if (name == "--image-rendering") {
        setCookie("imageRendering", value);
    } else if (name == "--click-effect-speed") {
        setCookie("clickEffectSpeed", value);
    }
}














function togglePopupMyProfileUserInfoReadMore() {
    let userInfo = document.getElementsByClassName("popup_my_profile_user_info")[0];

    if (userInfo.getAttribute("read_more") == "true" || userInfo.getAttribute("read_more") == true) {
        hidePopupMyProfileUserInfoReadMore();
    } else {
        showPopupMyProfileUserInfoReadMore();
    }
}
function showPopupMyProfileUserInfoReadMore() {
    let userInfo = document.getElementsByClassName("popup_my_profile_user_info")[0];
    userInfo.setAttribute("read_more", true);

    let readMore = document.getElementsByClassName("popup_my_profile_user_info_read_more")[0];
    readMore.style.display = "block";

    //
    let height = readMore.clientHeight;
    readMore.style.height = "0px";
    readMore.style.opacity = 0;
    function callback() {
        readMore.style.height = height + "px";
        readMore.style.opacity = 1;
        setTimeout(() => {
            readMore.style.height = null;
            readMore.style.opacity = null;
        }, 200);
    }
    window.requestAnimationFrame(callback);
}
function hidePopupMyProfileUserInfoReadMore() {
    let userInfo = document.getElementsByClassName("popup_my_profile_user_info")[0];
    userInfo.setAttribute("read_more", false);

    let readMore = document.getElementsByClassName("popup_my_profile_user_info_read_more")[0];

    //
    let height = readMore.clientHeight;
    readMore.style.height = height + "px";
    readMore.style.opacity = 1;
    function callback() {
        readMore.style.height = "0px";
        readMore.style.opacity = 0;
        setTimeout(() => {
            readMore.style.display = "none";
            readMore.style.height = null;
        }, 200);
    }
    window.requestAnimationFrame(callback);
}