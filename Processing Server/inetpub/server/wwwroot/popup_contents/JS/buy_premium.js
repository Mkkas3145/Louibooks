
function getHtmlPopupContents_buy_premium() {
    let html = '';

    html = `
        <div class = "popup_buy_premium">
            <div class = "popup_contents_top">
                <div class = "popup_contents_top_left md-ripples" onclick = "backPopupContents();" onmouseenter = "hoverInformation(this, getLanguage('popup_contents:back'));">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"></rect><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"></rect></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"></rect></g></svg>
                </div>
                <div class = "popup_contents_top_right">
                    Louibooks Premium 결제
                </div>
            </div>
            <div class = "popup_buy_premium_contents">
                <div class = "popup_buy_premium_contents_icon">
                    ` + getSVGLouibooksLogo(6) + `
                </div>
                <div class = "popup_buy_premium_contents_title">
                    Louibooks Premium 결제
                </div>
                <div class = "popup_buy_premium_contents_description">
                    Louibooks Premium을(를) 결제하여 다양한 혜택들을 만나보세요.
                </div>
                <div class = "popup_buy_premium_contents_items">
                    <div class = "popup_buy_premium_contents_item">
                        <div class = "popup_buy_premium_contents_item_left">
                            1
                        </div>
                        <div class = "popup_buy_premium_contents_item_right">
                            <div class = "popup_buy_premium_contents_item_right_title">
                                프리패스
                            </div>
                            <div class = "popup_buy_premium_contents_item_right_description">
                                리워드 포인트를 쓰지 않아도 모든 작품을 감상하세요!
                            </div>
                        </div>
                    </div>
                    <div class = "popup_buy_premium_contents_item">
                        <div class = "popup_buy_premium_contents_item_left">
                            2
                        </div>
                        <div class = "popup_buy_premium_contents_item_right">
                            <div class = "popup_buy_premium_contents_item_right_title">
                                광고 없이 이용하기
                            </div>
                            <div class = "popup_buy_premium_contents_item_right_description">
                                광고를 보기 싫으신가요?
                                <br />
                                Louibooks에 존재하는 모든 광고가 사라집니다!
                            </div>
                        </div>
                    </div>
                    <div class = "popup_buy_premium_contents_item">
                        <div class = "popup_buy_premium_contents_item_left">
                            3
                        </div>
                        <div class = "popup_buy_premium_contents_item_right">
                            <div class = "popup_buy_premium_contents_item_right_title">
                                클라우드 용량 무제한 (JSON 저장)
                            </div>
                            <div class = "popup_buy_premium_contents_item_right_description">
                                내 클라우드의 용량을 무제한으로 늘려보세요!
                            </div>
                        </div>
                    </div>
                    <div class = "popup_buy_premium_contents_item">
                        <div class = "popup_buy_premium_contents_item_left">
                            4
                        </div>
                        <div class = "popup_buy_premium_contents_item_right">
                            <div class = "popup_buy_premium_contents_item_right_title">
                                기존보다 더 다양한 커스터마이징
                            </div>
                            <div class = "popup_buy_premium_contents_item_right_description">
                                나를 더 이쁘게 멋있게 꾸미고 싶나요?
                                <br />
                                내 페이지의 배너를 동영상으로 업로드할 수 있습니다.
                                <br />
                                또 프로필을 동영상으로 업로드하세요.
                            </div>
                            <div class = "popup_buy_premium_preview_premium_profile md-ripples" onclick = "movePopupBuyPremiumPreviewPremiumProfile();">
                                <div class = "popup_buy_premium_preview_premium_profile_left">
                                    Louibooks Premium 헤택 미리보기
                                </div>
                                <div class = "popup_buy_premium_preview_premium_profile_right">
                                    <!-- Generated by IcoMoon.io -->
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.25 10l-7.141-7.42c-0.268-0.27-0.268-0.707 0-0.979 0.268-0.27 0.701-0.27 0.969 0l7.83 7.908c0.268 0.271 0.268 0.709 0 0.979l-7.83 7.908c-0.268 0.271-0.701 0.27-0.969 0s-0.268-0.707 0-0.979l7.141-7.417z"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class = "popup_buy_premium_contents_item">
                        <div class = "popup_buy_premium_contents_item_left">
                            5
                        </div>
                        <div class = "popup_buy_premium_contents_item_right">
                            <div class = "popup_buy_premium_contents_item_right_title">
                                오프라인 저장
                            </div>
                            <div class = "popup_buy_premium_contents_item_right_description">
                                즐겨하는 작품을 오프라인 환경에서도 볼 수 있습니다.
                                <br />
                                (Louibooks App에서만 이용 가능)
                            </div>
                        </div>
                    </div>
                </div>
                <div class = "popup_buy_premium_contents_bottom_button md-ripples" onclick = "popupBuyPremiumMethodPayment();">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                    Louibooks Premium 결제하기
                </div>
            </div>
        </div>
        <div style = "width: 550px;"></div>
    `;

    return html;
}

function movePopupBuyPremiumPreviewPremiumProfile() {
    if (getCurrentMenuName() == "preview_premium_profile") {
        history.back();
    } else {
        history.back();
        function onMovePopupBuyPremiumPreviewPremiumProfileHistoryUpdate() {
            loadMenu_preview_premium_profile();
            window.removeEventListener('popstate', onMovePopupBuyPremiumPreviewPremiumProfileHistoryUpdate);
        }
        window.addEventListener('popstate', onMovePopupBuyPremiumPreviewPremiumProfileHistoryUpdate);
    }
}

function popupBuyPremiumMethodPayment() {
    let html = '';

    let location = userLocation;
    let title = getLanguage("location:" + location);

    html = `
        <div class = "popup_buy_premium">
            <div class = "popup_contents_top">
                <div class = "popup_contents_top_left md-ripples" onclick = "backPopupContents();" onmouseenter = "hoverInformation(this, getLanguage('popup_contents:back'));">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"></rect><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"></rect></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"></rect></g></svg>
                </div>
                <div class = "popup_contents_top_right">
                    Louibooks Premium 결제 수단 선택
                </div>
            </div>
            <div class = "popup_buy_premium_contents">
                <div class = "popup_buy_premium_contents_icon">
                    ` + getSVGLouibooksLogo(6) + `
                </div>
                <div class = "popup_buy_premium_contents_title">
                    결제 수단 선택
                </div>
                <div class = "popup_buy_premium_contents_description">
                    Louibooks Premium을(를) 결제하기 위해 결제 수단을 선택하세요.
                </div>
                <div class = "popup_buy_premium_contents_country_select_box md-ripples" onchange = "changeSelectBuyPremiumMethodPayment(this);" popupwidth = "max-content" value = "` + location + `" onclick = "selectList(this, getSelectItemsBuyPremiumMethodPayment());">
                    <div class = "popup_buy_premium_contents_country_select_box_title value_title">
                        ` + title + `
                    </div>
                    <div class = "popup_buy_premium_contents_country_select_box_icon">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17.418 6.109c0.272-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-7.908 7.83c-0.27 0.268-0.707 0.268-0.979 0l-7.908-7.83c-0.27-0.268-0.27-0.701 0-0.969s0.709-0.268 0.979 0l7.419 7.141 7.418-7.141z"></path></svg>
                    </div>
                </div>
                <div class = "popup_buy_premium_contents_country_items">
                    ` + getItemsPopupBuyPremiumMethodPaymentItems(location) + `
                </div>
                <div class = "popup_buy_premium_contents_description" style = "margin-top: 40px;">
                    ` + getLanguage("menu_privacy_policy_item_3:contents_description:0") + `
                </div>
            </div>
        </div>
        <div style = "width: 550px;"></div>
    `;

    setHtmlPopupContents(html);
}

function getSelectItemsBuyPremiumMethodPayment() {
    let items = getLocationSelectItem();
    let newItems = new Array();
    for (let i = 0; i < items.length; i++) {
        if (items[i]["value"] == "kr") {
            newItems[newItems.length] = items[i];
        }
    }
    return newItems;
}

function changeSelectBuyPremiumMethodPayment(el) {
    let country = el.getAttribute("value");
    let html = getItemsPopupBuyPremiumMethodPaymentItems(country);

    checkHtmlPopupContents();
    let items = document.getElementsByClassName("popup_buy_premium_contents_country_items")[0];
    items.innerHTML = html;
}

function getItemsPopupBuyPremiumMethodPaymentItems(country) {
    let html = '';

    let countryName = getLanguage("location:" + country);
    countryName += " (" + country.toUpperCase() + ")";

    //한국
    if (country == "kr") {
        html = `
            <div class = "popup_buy_premium_contents_payment_amount">
                <div class = "popup_buy_premium_contents_payment_amount_title">
                    결제 금액
                </div>
                <div class = "popup_buy_premium_contents_payment_amount_value">
                    ₩8,900 KRW / 30일
                </div>
            </div>

            <div class = "popup_buy_premium_contents_country_items">
                <div class = "popup_buy_premium_contents_country_items_title">
                    toss Payments
                </div>
                <div class = "popup_buy_premium_contents_country_item md-ripples" onclick = "buyPremiumTossPayments(0);">
                    <div class = "popup_buy_premium_contents_country_item_icon">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 28"><path d="M27.5 2c1.375 0 2.5 1.125 2.5 2.5v19c0 1.375-1.125 2.5-2.5 2.5h-25c-1.375 0-2.5-1.125-2.5-2.5v-19c0-1.375 1.125-2.5 2.5-2.5h25zM2.5 4c-0.266 0-0.5 0.234-0.5 0.5v3.5h26v-3.5c0-0.266-0.234-0.5-0.5-0.5h-25zM27.5 24c0.266 0 0.5-0.234 0.5-0.5v-9.5h-26v9.5c0 0.266 0.234 0.5 0.5 0.5h25zM4 22v-2h4v2h-4zM10 22v-2h6v2h-6z"></path></svg>
                    </div>
                    <div class = "popup_buy_premium_contents_country_item_right">
                        <div class = "popup_buy_premium_contents_country_item_right_title">
                            카드 결제
                        </div>
                    </div>
                </div>
                <div class = "popup_buy_premium_contents_country_item md-ripples" onclick = "buyPremiumTossPayments(1);">
                    <div class = "popup_buy_premium_contents_country_item_icon">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.484 0.984l9.516 5.016v2.016h-18.984v-2.016zM15.984 9.984h3v7.031h-3v-7.031zM2.016 21.984v-3h18.984v3h-18.984zM9.984 9.984h3v7.031h-3v-7.031zM3.984 9.984h3v7.031h-3v-7.031z"></path></svg>
                    </div>
                    <div class = "popup_buy_premium_contents_country_item_right">
                        <div class = "popup_buy_premium_contents_country_item_right_title">
                            계좌이체
                        </div>
                    </div>
                </div>
                <div class = "popup_buy_premium_contents_country_item md-ripples" onclick = "buyPremiumTossPayments(2);">
                    <div class = "popup_buy_premium_contents_country_item_icon">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.484 0.984l9.516 5.016v2.016h-18.984v-2.016zM15.984 9.984h3v7.031h-3v-7.031zM2.016 21.984v-3h18.984v3h-18.984zM9.984 9.984h3v7.031h-3v-7.031zM3.984 9.984h3v7.031h-3v-7.031z"></path></svg>
                    </div>
                    <div class = "popup_buy_premium_contents_country_item_right">
                        <div class = "popup_buy_premium_contents_country_item_right_title">
                            가상계좌 (무통장 입금)
                        </div>
                    </div>
                </div>
                <div class = "popup_buy_premium_contents_country_item md-ripples" onclick = "buyPremiumTossPayments(3);">
                    <div class = "popup_buy_premium_contents_country_item_icon">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M23 0h-14c-1.65 0-3 1.35-3 3v26c0 1.65 1.35 3 3 3h14c1.65 0 3-1.35 3-3v-26c0-1.65-1.35-3-3-3zM12 1.5h8v1h-8v-1zM16 30c-1.105 0-2-0.895-2-2s0.895-2 2-2 2 0.895 2 2-0.895 2-2 2zM24 24h-16v-20h16v20z"></path></svg>
                    </div>
                    <div class = "popup_buy_premium_contents_country_item_right">
                        <div class = "popup_buy_premium_contents_country_item_right_title">
                            휴대폰
                        </div>
                    </div>
                </div>
                <div class = "popup_buy_premium_contents_country_item md-ripples" onclick = "buyPremiumTossPayments(4);">
                    <div class = "popup_buy_premium_contents_country_item_icon">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11 13v8h-6v-8zM13 21v-8h6v8zM7.5 6c-0.414 0-0.788-0.167-1.061-0.439s-0.439-0.647-0.439-1.061 0.167-0.788 0.439-1.061 0.647-0.439 1.061-0.439c0.629 0 1.142 0.223 1.584 0.586 0.376 0.308 0.701 0.719 0.976 1.177 0.241 0.401 0.433 0.821 0.58 1.203zM13.346 6c0.161-0.416 0.353-0.836 0.593-1.237 0.275-0.459 0.601-0.869 0.976-1.177 0.443-0.363 0.956-0.586 1.585-0.586 0.414 0 0.788 0.167 1.061 0.439s0.439 0.647 0.439 1.061-0.167 0.788-0.439 1.061-0.647 0.439-1.061 0.439zM11 8v3h-8v-3h4.5zM19.663 6c0.216-0.455 0.337-0.963 0.337-1.5 0-0.966-0.393-1.843-1.025-2.475s-1.509-1.025-2.475-1.025c-1.16 0-2.109 0.43-2.852 1.039-0.603 0.494-1.068 1.103-1.423 1.694-0.080 0.133-0.155 0.266-0.225 0.398-0.070-0.132-0.145-0.265-0.225-0.398-0.355-0.591-0.82-1.2-1.423-1.694-0.743-0.609-1.692-1.039-2.852-1.039-0.966 0-1.843 0.393-2.475 1.025s-1.025 1.509-1.025 2.475c0 0.537 0.121 1.045 0.337 1.5h-2.337c-0.552 0-1 0.448-1 1v5c0 0.552 0.448 1 1 1h1v9c0 0.552 0.448 1 1 1h16c0.552 0 1-0.448 1-1v-9h1c0.552 0 1-0.448 1-1v-5c0-0.552-0.448-1-1-1zM13 8h8v3h-8z"></path></svg>
                    </div>
                    <div class = "popup_buy_premium_contents_country_item_right">
                        <div class = "popup_buy_premium_contents_country_item_right_title">
                            문화상품권
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        html = `
            <div class = "popup_buy_premium_contents_not_supported">
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.070c-1.884-1.821-3.053-4.37-3.053-7.193 0-5.523 4.477-10 10-10 2.823 0 5.372 1.169 7.19 3.050l0.003 0.003c1.737 1.796 2.807 4.247 2.807 6.947 0 5.523-4.477 10-10 10-2.7 0-5.151-1.070-6.95-2.81l0.003 0.003zM9 5v6h2v-6h-2zM9 13v2h2v-2h-2z"></path></svg>
                <div class = "popup_buy_premium_contents_not_supported_title">
                    결제 수단 없음
                </div>
                <div class = "popup_buy_premium_contents_not_supported_description">
                    죄송합니다, ` + countryName + `은(는) 결제 수단이 없습니다.
                </div>
            </div>
        `;
    }

    return html;
}





/*
    type:
        0 = 카드 결제
        1 = 계좌이체
        2 = 가상계좌 (무통장 입금)
        3 = 휴대폰
*/
function buyPremiumTossPayments(type) {
    spinLoading();
    
    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/user/payment/getPremiumOrderId.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let info = JSON.parse(xhrHtml);
                
                let clientKey = 'live_ck_Wd46qopOB89xgaWBLqLrZmM75y0v';
                let tossPayments = TossPayments(clientKey);

                if (type == 0) {
                    tossPayments.requestPayment('카드', {
                        amount: info["amount"],
                        orderId: info["id"],
                        orderName: 'Louibooks Premium',
                        customerName: loginStatus["nickname"],
                        customerEmail: loginStatus["email"],
                        successUrl: 'https://louibooks.com/php/user/payment/tossPayments/success.php',
                        failUrl: 'https://louibooks.com/php/user/payment/tossPayments/fail.php'
                    });
                } else if (type == 1) {
                    tossPayments.requestPayment('계좌이체', {
                        amount: info["amount"],
                        orderId: info["id"],
                        orderName: 'Louibooks Premium',
                        customerName: loginStatus["nickname"],
                        customerEmail: loginStatus["email"],
                        successUrl: 'https://louibooks.com/php/user/payment/tossPayments/success.php',
                        failUrl: 'https://louibooks.com/php/user/payment/tossPayments/fail.php'
                    });
                } else if (type == 2) {
                    tossPayments.requestPayment('가상계좌', {
                        amount: info["amount"],
                        orderId: info["id"],
                        orderName: 'Louibooks Premium',
                        customerName: loginStatus["nickname"],
                        customerEmail: loginStatus["email"],
                        successUrl: 'https://louibooks.com/php/user/payment/tossPayments/success.php',
                        failUrl: 'https://louibooks.com/php/user/payment/tossPayments/fail.php',
                        validHours: 72,
                        cashReceipt: {
                            type: '소득공제'
                        }
                    });
                } else if (type == 3) {
                    tossPayments.requestPayment('휴대폰', {
                        amount: info["amount"],
                        orderId: info["id"],
                        orderName: 'Louibooks Premium',
                        customerName: loginStatus["nickname"],
                        customerEmail: loginStatus["email"],
                        successUrl: 'https://louibooks.com/php/user/payment/tossPayments/success.php',
                        failUrl: 'https://louibooks.com/php/user/payment/tossPayments/fail.php'
                    });
                } else if (type == 4) {
                    tossPayments.requestPayment('문화상품권', {
                        amount: info["amount"],
                        orderId: info["id"],
                        orderName: 'Louibooks Premium',
                        customerName: loginStatus["nickname"],
                        customerEmail: loginStatus["email"],
                        successUrl: 'https://louibooks.com/php/user/payment/tossPayments/success.php',
                        failUrl: 'https://louibooks.com/php/user/payment/tossPayments/fail.php'
                    });
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
            spinLoadingComplete();
        }
    });
    
    var formData = new FormData();
    formData.append("paymentGateway", 0); //토스페이먼츠
    xhr.send(formData);
}







