
function getHtmlPopupContents_cancel_payment(data) {
    let html = '';

    let info = JSON.parse(data);
    let paymentGateway = info["paymentGateway"];
    let number = info["number"];

    let selectItems = getPopupCancelpaymentSelectItems(paymentGateway);
    let bankTitle = selectItems[0]["title"];
    let bankValue = selectItems[0]["value"];

    html = `
        <div class = "edit_profile_picture">
            <div class = "popup_contents_top">
                <div class = "popup_contents_top_left md-ripples" onclick = "backPopupContents();" onmouseenter = "hoverInformation(this, getLanguage('popup_contents:back'));">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"></rect><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"></rect></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"></rect></g></svg>
                </div>
                <div class = "popup_contents_top_right">
                    ` + getLanguage("payment_history_button:refund") + `
                </div>
            </div>
            
            <div class = "popup_cancel_payment">
                <div class = "popup_cancel_payment_items">
                    <div class = "popup_cancel_payment_item">
                        <div class = "popup_cancel_payment_item_title">
                            ` + getLanguage("popup_contents_cancel_payment_title:0") + `
                        </div>
                        <div class = "popup_cancel_payment_item_type md-ripples" value = "` + bankValue + `" onclick = "selectList(this, getPopupCancelpaymentSelectItems(` + paymentGateway + `));">
                            <div class = "popup_cancel_payment_item_type_title value_title">
                                ` + bankTitle + `
                            </div>
                            <div class = "popup_cancel_payment_item_type_icon">
                                <!-- Generated by IcoMoon.io -->
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17.418 6.109c0.272-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-7.908 7.83c-0.27 0.268-0.707 0.268-0.979 0l-7.908-7.83c-0.27-0.268-0.27-0.701 0-0.969s0.709-0.268 0.979 0l7.419 7.141 7.418-7.141z"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div class = "popup_cancel_payment_item">
                        <div class = "popup_cancel_payment_item_title">
                            ` + getLanguage("popup_contents_cancel_payment_title:1") + `
                        </div>
                        <div class = "popup_cancel_payment_item_input">
                            <input placeholder = "` + getLanguage("popup_contents_cancel_payment_placeholder:0") + `" onkeydown = "checkButtonPopupCancelPayment();" onfocus = "popupCancelPaymentInputFocus(this);" onblur = "popupCancelPaymentInputBlur(this);">
                            <div class = "popup_cancel_payment_item_input_line_wrap"></div>
                        </div>
                    </div>

                    <div class = "popup_cancel_payment_item">
                        <div class = "popup_cancel_payment_item_title">
                            ` + getLanguage("popup_contents_cancel_payment_title:2") + `
                        </div>
                        <div class = "popup_cancel_payment_item_input">
                            <input type = "number" placeholder = "` + getLanguage("popup_contents_cancel_payment_placeholder:1") + `" onkeydown = "checkButtonPopupCancelPayment();" onfocus = "popupCancelPaymentInputFocus(this);" onblur = "popupCancelPaymentInputBlur(this);">
                            <div class = "popup_cancel_payment_item_input_line_wrap"></div>
                        </div>
                    </div>
                </div>

                <div class = "popup_cancel_payment_description">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-215,50a24.843,24.843,0,0,1-9.731-1.965,24.918,24.918,0,0,1-7.947-5.358,24.918,24.918,0,0,1-5.358-7.947A24.843,24.843,0,0,1-240,25a24.843,24.843,0,0,1,1.965-9.731,24.918,24.918,0,0,1,5.358-7.947,24.918,24.918,0,0,1,7.947-5.358A24.843,24.843,0,0,1-215,0a24.843,24.843,0,0,1,9.731,1.965,24.918,24.918,0,0,1,7.947,5.358,24.918,24.918,0,0,1,5.358,7.947A24.843,24.843,0,0,1-190,25a24.843,24.843,0,0,1-1.965,9.731,24.918,24.918,0,0,1-5.358,7.947,24.918,24.918,0,0,1-7.947,5.358A24.843,24.843,0,0,1-215,50Zm0-47a22.025,22.025,0,0,0-22,22,22.025,22.025,0,0,0,22,22,22.025,22.025,0,0,0,22-22A22.025,22.025,0,0,0-215,3Z" transform="translate(240)"></path><circle cx="2" cy="2" r="2" transform="translate(23 9)"></circle><rect width="4" height="24" rx="2" transform="translate(23 18)"></rect></g></svg>
                    ` + getLanguage("payment_history_refund_confirm:description") + `
                </div>

                <div class = "popup_cancel_payment_button popup_cancel_payment_button_disabled md-ripples" onclick = "requestTossPaymentsCancelPaymentHistory(` + number + `);">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-4.438,42.27v0L.4,28.587,21.847,7.145a2.12,2.12,0,0,1,1.506-.632,1.945,1.945,0,0,1,1.387.567l7.071,7.071a1.944,1.944,0,0,1,.567,1.433,2.125,2.125,0,0,1-.632,1.459L10.3,38.487-4.436,42.27ZM23.387,9.839h0L3.162,30.064-.327,38.621l9.154-2.892L29.052,15.5,23.387,9.839Z" transform="translate(5.102 6.536)"></path><path d="M28.7,19.1a1.987,1.987,0,0,1-1.414-.586l-7.071-7.071a2,2,0,0,1,0-2.828l6.368-6.368a2,2,0,0,1,2.829,0l7.071,7.071a2,2,0,0,1,0,2.828L30.116,18.51A1.987,1.987,0,0,1,28.7,19.1ZM27.995,5.067h0l-4.95,4.95,5.666,5.665,4.95-4.949L27.995,5.067Z" transform="translate(12.102 -0.464)"></path></g></svg>
                    ` + getLanguage("popup_contents_cancel_payment_button") + `
                </div>
            </div>

            <div style = "width: 500px;"></div>
        </div>
    `;

    return html;
}

function popupCancelPaymentInputFocus(input) {
    let parent = input.parentElement;
    parent.classList.add("popup_cancel_payment_item_input_line_focus");
}
function popupCancelPaymentInputBlur(input) {
    let parent = input.parentElement;
    parent.classList.remove("popup_cancel_payment_item_input_line_focus");
}





function getInfoPopupCancelPayment() {
    let popupContents = document.getElementsByClassName("popup_contents")[0];

    if (popupContents.getElementsByClassName("popup_cancel_payment_item_type").length != 0) {
        let bankCode = popupContents.getElementsByClassName("popup_cancel_payment_item_type")[0].getAttribute("value");
        let input = popupContents.getElementsByTagName("input");
        
        return {
            "bankCode": bankCode,
            "holderName": input[0].value.trim(),
            "accountNumber": Number.parseInt(input[1].value.trim())
        }
    }
}
function checkButtonPopupCancelPayment() {
    function callback() {
        let popupContents = document.getElementsByClassName("popup_contents")[0];
        let button = popupContents.getElementsByClassName("popup_cancel_payment_button")[0];
        let input = popupContents.getElementsByTagName("input");
        let isWrite = true;
        
        //예금주 이름
        if (input[0].value.trim() == "") {
            isWrite = false;
        }
        //은행 계좌 번호
        if (isNaN(input[1].value.trim()) == true || input[1].value.trim() == "") {
            isWrite = false;
        }
    
        if (isWrite == true) {
            button.classList.remove("popup_cancel_payment_button_disabled");
        } else {
            button.classList.add("popup_cancel_payment_button_disabled");
        }
    }
    window.requestAnimationFrame(callback);
}








function getPopupCancelpaymentSelectItems(paymentGateway) {
    let items = new Array();

    if (paymentGateway == 0) {
        //토스페이먼츠
        let bankCode = new Array("11", "06", "20", "88", "03", "39", "34", "31", "32", "45", "07", "71", "37", "81", "89");
        for (let i = 0; i < bankCode.length; i++) {
            items[items.length] = {
                "title": getLanguage("payment_history_tosspayments_bank:" + bankCode[i]),
                "value": bankCode[i],
                "image": "/IMG/payment_history/method/bank/tossPayments/" + bankCode[i] + ".png"
            }
        }
    }

    return items;
}