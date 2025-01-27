



function getPaymentHistoryElement(info) {
    let newEl = document.createElement("div");
    newEl.classList.add("payment_history_element");
    newEl.setAttribute("number", info["number"]);

    let displayInfo = getPaymentHistoryDisplayInfo(info);

    //환불 가능 여부
    let isCancellable = info["isCancellable"];
    let cancellableClass = "";
    if (isCancellable == false) {
        cancellableClass = " payment_history_element_right_item_value_right_button_disabled";
    }

    newEl.innerHTML = `
        <div class = "payment_history_element_left img_wrap">
            <img src = "` + displayInfo["pgImageUrl"] + `" onload = "imageLoad(event);" alt = "">
        </div>
        <div class = "payment_history_element_right">
            <div class = "payment_history_element_right_title">
                ` + displayInfo["pgName"] + `
            </div>
            <div class = "payment_history_element_right_items">
                <div class = "payment_history_element_right_item">
                    <div class = "payment_history_element_right_item_title">
                        ` + getLanguage("payment_history_title:method") + `
                    </div>
                    <div class = "payment_history_element_right_item_value">
                        <div class = "payment_history_element_right_item_value_icon img_wrap">
                            <img src = "` + displayInfo["methodImageUrl"] + `" onload = "imageLoad(event);" alt = "">
                        </div>
                        <div class = "payment_history_element_right_item_value_right">
                            <div class = "payment_history_element_right_item_value_right_title">
                                ` + displayInfo["methodTitle"] + `
                            </div>
                            <div class = "payment_history_element_right_item_value_right_description">
                                ` + displayInfo["amount"] + `
                            </div>
                        </div>
                    </div>
                </div>
                <div class = "payment_history_element_right_item">
                    <div class = "payment_history_element_right_item_title">
                        ` + getLanguage("payment_history_title:status") + `
                    </div>
                    <div class = "payment_history_element_right_status" value = "` + displayInfo["paymentStatus"] + `">
                        <div class = "payment_history_element_right_status_0">
                            <div class = "payment_history_element_right_status_icon">
                                <!-- Generated by IcoMoon.io -->
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                            </div>
                            <div class = "payment_history_element_right_status_right">
                                <div class = "payment_history_element_right_status_right_title">
                                    ` + getLanguage("payment_history_status:0") + `
                                </div>
                                <div class = "payment_history_element_right_status_right_date">
                                    ` + displayInfo["date"] + `
                                </div>
                            </div>
                        </div>
                        <div class = "payment_history_element_right_status_1">
                            <div class = "payment_history_element_right_status_icon">
                                <!-- Generated by IcoMoon.io -->
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.164 19.547c-1.641-2.5-3.669-3.285-6.164-3.484v1.437c0 0.534-0.208 1.036-0.586 1.414-0.756 0.756-2.077 0.751-2.823 0.005l-6.293-6.207c-0.191-0.189-0.298-0.444-0.298-0.713s0.107-0.524 0.298-0.712l6.288-6.203c0.754-0.755 2.073-0.756 2.829 0.001 0.377 0.378 0.585 0.88 0.585 1.414v1.704c4.619 0.933 8 4.997 8 9.796v1c0 0.442-0.29 0.832-0.714 0.958-0.095 0.027-0.19 0.042-0.286 0.042-0.331 0-0.646-0.165-0.836-0.452zM12.023 14.011c2.207 0.056 4.638 0.394 6.758 2.121-0.768-3.216-3.477-5.702-6.893-6.080-0.504-0.056-0.888-0.052-0.888-0.052v-3.497l-5.576 5.496 5.576 5.5v-3.499c0 0 0.738 0.010 1.023 0.011z"></path></svg>
                            </div>
                            <div class = "payment_history_element_right_status_right">
                                <div class = "payment_history_element_right_status_right_title">
                                    ` + getLanguage("payment_history_status:1") + `
                                </div>
                                <div class = "payment_history_element_right_status_right_date">
                                    ` + displayInfo["date"] + `
                                </div>
                            </div>
                        </div>
                        <div class = "payment_history_element_right_status_2">
                            <div class = "payment_history_element_right_status_icon">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M2,0A1.828,1.828,0,0,1,4,1.583V11.87c0,.874-4,0-4,0V1.583A1.828,1.828,0,0,1,2,0Z" transform="translate(34.785 31.957) rotate(135)"/><path d="M-3095,50a24.844,24.844,0,0,1-9.731-1.965,24.917,24.917,0,0,1-7.947-5.358,24.922,24.922,0,0,1-5.358-7.947A24.845,24.845,0,0,1-3120,25a24.845,24.845,0,0,1,1.965-9.731,24.922,24.922,0,0,1,5.358-7.947,24.917,24.917,0,0,1,7.947-5.358A24.844,24.844,0,0,1-3095,0a24.844,24.844,0,0,1,9.731,1.965,24.917,24.917,0,0,1,7.947,5.358,24.922,24.922,0,0,1,5.358,7.947A24.84,24.84,0,0,1-3070,25a24.84,24.84,0,0,1-1.965,9.731,24.922,24.922,0,0,1-5.358,7.947,24.917,24.917,0,0,1-7.947,5.358A24.844,24.844,0,0,1-3095,50Zm0-46a21.024,21.024,0,0,0-21,21,21.023,21.023,0,0,0,21,21,21.024,21.024,0,0,0,21-21A21.024,21.024,0,0,0-3095,4Z" transform="translate(3120)"/><rect width="4" height="16" rx="2" transform="translate(23 11)"/></g></svg>
                            </div>
                            <div class = "payment_history_element_right_status_right">
                                <div class = "payment_history_element_right_status_right_title">
                                    ` + getLanguage("payment_history_status:2") + `
                                </div>
                                <div class = "payment_history_element_right_status_right_date">
                                    ` + displayInfo["date"] + `
                                </div>
                            </div>
                        </div>
                        <div class = "payment_history_element_right_status_3">
                            <div class = "payment_history_element_right_status_icon">
                                <!-- Generated by IcoMoon.io -->
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path></svg>
                            </div>
                            <div class = "payment_history_element_right_status_right">
                                <div class = "payment_history_element_right_status_right_title">
                                    ` + getLanguage("payment_history_status:3") + `
                                </div>
                                <div class = "payment_history_element_right_status_right_date">
                                    ` + displayInfo["date"] + `
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class = "payment_history_element_right_item">
                    <div class = "payment_history_element_right_item_title">
                        ` + getLanguage("payment_history_title:order") + `
                    </div>
                    <div class = "payment_history_element_right_item_value">
                        <div class = "payment_history_element_right_item_value_icon">
                            ` + displayInfo["orderIcon"] + `
                        </div>
                        <div class = "payment_history_element_right_item_value_right">
                            <div class = "payment_history_element_right_item_value_right_title">
                                ` + displayInfo["orderTitle"] + `
                            </div>
                            <div class = "payment_history_element_right_item_value_right_description">
                                ` + displayInfo["orderDescription"] + `
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class = "payment_history_element_right_item_value_right_button_items">
                <div class = "payment_history_element_right_item_value_right_button md-ripples" onclick = "window.open('` + displayInfo["receiptUrl"] + `');">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.199 13.599c0.992 1.327 2.43 2.126 3.948 2.345s3.123-0.142 4.45-1.134c0.239-0.179 0.465-0.375 0.655-0.568l2.995-2.995c1.163-1.204 1.722-2.751 1.696-4.285s-0.639-3.061-1.831-4.211c-1.172-1.132-2.688-1.692-4.199-1.683-1.492 0.008-2.984 0.571-4.137 1.683l-1.731 1.721c-0.392 0.389-0.394 1.023-0.004 1.414s1.023 0.394 1.414 0.004l1.709-1.699c0.77-0.742 1.763-1.117 2.76-1.123 1.009-0.006 2.016 0.367 2.798 1.122 0.795 0.768 1.203 1.783 1.221 2.808s-0.355 2.054-1.11 2.836l-3.005 3.005c-0.114 0.116-0.263 0.247-0.428 0.37-0.885 0.662-1.952 0.902-2.967 0.756s-1.971-0.678-2.632-1.563c-0.331-0.442-0.957-0.533-1.4-0.202s-0.533 0.957-0.202 1.4zM14.801 10.401c-0.992-1.327-2.43-2.126-3.948-2.345s-3.124 0.142-4.451 1.134c-0.239 0.179-0.464 0.375-0.655 0.568l-2.995 2.995c-1.163 1.204-1.722 2.751-1.696 4.285s0.639 3.061 1.831 4.211c1.172 1.132 2.688 1.692 4.199 1.683 1.492-0.008 2.984-0.571 4.137-1.683l1.723-1.723c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-1.696 1.698c-0.77 0.742-1.763 1.117-2.76 1.123-1.009 0.006-2.016-0.367-2.798-1.122-0.795-0.768-1.203-1.783-1.221-2.808s0.355-2.054 1.11-2.836l3.005-3.005c0.114-0.116 0.263-0.247 0.428-0.37 0.885-0.662 1.952-0.902 2.967-0.756s1.971 0.678 2.632 1.563c0.331 0.442 0.957 0.533 1.4 0.202s0.533-0.957 0.202-1.4z"></path></svg>
                    ` + getLanguage("payment_history_button:receipt") + `
                </div>
                <div class = "payment_history_element_right_item_value_right_button md-ripples` + cancellableClass + `" onclick = "cancelPaymentHistory(` + info["number"] + `, ` + info["paymentGateway"] + `, ` + displayInfo["isVirtualAccount"] + `);">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.164 19.547c-1.641-2.5-3.669-3.285-6.164-3.484v1.437c0 0.534-0.208 1.036-0.586 1.414-0.756 0.756-2.077 0.751-2.823 0.005l-6.293-6.207c-0.191-0.189-0.298-0.444-0.298-0.713s0.107-0.524 0.298-0.712l6.288-6.203c0.754-0.755 2.073-0.756 2.829 0.001 0.377 0.378 0.585 0.88 0.585 1.414v1.704c4.619 0.933 8 4.997 8 9.796v1c0 0.442-0.29 0.832-0.714 0.958-0.095 0.027-0.19 0.042-0.286 0.042-0.331 0-0.646-0.165-0.836-0.452zM12.023 14.011c2.207 0.056 4.638 0.394 6.758 2.121-0.768-3.216-3.477-5.702-6.893-6.080-0.504-0.056-0.888-0.052-0.888-0.052v-3.497l-5.576 5.496 5.576 5.5v-3.499c0 0 0.738 0.010 1.023 0.011z"></path></svg>
                    ` + getLanguage("payment_history_button:refund") + `
                </div>
            </div>
        </div>
    `;

    return newEl;
}

function getPaymentHistoryDisplayInfo(info) {
    let amount = "...";
    if (info["currency"] == "KRW") {
        amount = "₩" + commas(info["amount"]) + " KRW";
    }

    let methodTitle = "...";

    //영수증 URL
    let receiptUrl = null;
    //결제 수단 이미지
    let methodImg = "...";
    //만료인지
    let paymentStatus = info["paymentStatus"];

    let isVirtualAccount = false;
    let paymentMethod = null;
    let pgImageUrl = null;
    //토스페이먼츠
    if (info["paymentGateway"] == 0) {
        pgImageUrl = "https://louibooks.com/IMG/payment_history/PG/tossPayments.webp";
        paymentMethod = info["paymentInfo"]["info"]["method"];

        if (paymentMethod == 0) {
            let issuerCode = info["paymentInfo"]["info"]["issuerCode"];
            methodTitle = getLanguage("payment_history_method:card").replaceAll("{R:0}", getLanguage("payment_history_tosspayments_card:" + issuerCode));
        } else if (paymentMethod == 1) {
            let bankCode = info["paymentInfo"]["info"]["bankCode"];
            methodTitle = getLanguage("payment_history_method:bankTransfer").replaceAll("{R:0}", getLanguage("payment_history_tosspayments_bank:" + bankCode));
        } else if (paymentMethod == 2) {
            let bankCode = info["paymentInfo"]["info"]["bankCode"];
            methodTitle = getLanguage("payment_history_method:virtualAccount").replaceAll("{R:0}", getLanguage("payment_history_tosspayments_bank:" + bankCode));
            //결제 대기 중이면
            if (paymentStatus == 2) {
                amount = getLanguage("payment_history_method_description:virtualAccount").replaceAll("{R:0}", "<b>" + info["paymentInfo"]["info"]["accountNumber"] + "</b>").replaceAll("{R:1}", "<b>" + amount + "</b>");
            }
            isVirtualAccount = true;
        } else if (paymentMethod == 3) {
            let mobilePhone = info["paymentInfo"]["info"]["mobilePhone"];
            mobilePhone.value = mobilePhone.value
                .replace(/[^0-9]/g, '')
                .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
            methodTitle = getLanguage("payment_history_method:cellPhone").replaceAll("{R:0}", mobilePhone);
        } else if (paymentMethod == 4) {
            let provider = info["paymentInfo"]["info"]["provider"];
            methodTitle = getLanguage("payment_history_method:easyPayment").replaceAll("{R:0}", getLanguage("payment_history_provider:" + provider));
        } else if (paymentMethod == 5) {
            methodTitle = getLanguage("payment_history_method:giftCertificate");
        }

        //만료됬는지
        if (paymentMethod == 2) {
            let expiryDate = new Date(info["paymentInfo"]["info"]["expiryDate"]);

            let curr = new Date();
            let utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
            let currentTime = new Date(utc);
            let difference = expiryDate.getTime() - currentTime.getTime();

            if (difference <= 0) {
                paymentStatus = 3;
            }
        }

        //결제 수단 이미지
        if (paymentMethod == 0) {
            let issuerCode = info["paymentInfo"]["info"]["issuerCode"];
            methodImg = "https://louibooks.com/IMG/payment_history/method/card/tossPayments/" + issuerCode + ".png";
        }
        if (paymentMethod == 1) {
            let bankCode = info["paymentInfo"]["info"]["bankCode"];
            methodImg = "https://louibooks.com/IMG/payment_history/method/bank/tossPayments/" + bankCode + ".png";
        }
        if (paymentMethod == 2) {
            let bankCode = info["paymentInfo"]["info"]["bankCode"];
            methodImg = "https://louibooks.com/IMG/payment_history/method/bank/tossPayments/" + bankCode + ".png";
        }
        if (paymentMethod == 3) {
            methodImg = "https://louibooks.com/IMG/payment_history/method/korean_phone.png";
        }
        if (paymentMethod == 4) {
            let provider = info["paymentInfo"]["info"]["provider"];
            if (provider == "tosspay") {
                methodImg = "https://louibooks.com/IMG/payment_history/method/provider/tosspay.webp";
            } else if (provider == "naverpay") {
                methodImg = "https://louibooks.com/IMG/payment_history/method/provider/naverpay.png";
            } else if (provider == "samsungpay") {
                methodImg = "https://louibooks.com/IMG/payment_history/method/provider/samsungpay.png";
            } else if (provider == "lpay") {
                methodImg = "https://louibooks.com/IMG/payment_history/method/provider/lpay.png";
            } else if (provider == "kakaopay") {
                methodImg = "https://louibooks.com/IMG/payment_history/method/provider/kakaopay.png";
            } else if (provider == "payco") {
                methodImg = "https://louibooks.com/IMG/payment_history/method/provider/payco.png";
            } else if (provider == "lgpay") {
                methodImg = "https://louibooks.com/IMG/payment_history/method/provider/lgpay.png";
            } else if (provider == "ssg") {
                methodImg = "https://louibooks.com/IMG/payment_history/method/provider/ssg.png";
            } else if (provider == "applepay") {
                methodImg = "https://louibooks.com/IMG/payment_history/method/provider/applepay.png";
            }
        }
        if (paymentMethod == 5) {
            methodImg = "https://louibooks.com/IMG/payment_history/method/culture_land.png";
        }

        receiptUrl = info["paymentInfo"]["receipt"];
    }

    let orderIcon = "...";
    let orderTitle = "...";
    let orderDescription = "...";
    if (info["orderType"] == 0) {
        orderIcon = getSVGLouibooksLogo(0);
        orderTitle = getLanguage("payment_history_order_title:" + info["orderType"]);
        orderDescription = getLanguage("payment_history_order_description:" + info["orderType"]);
    }

    let date = getLanguage("payment_history_status_date").replaceAll("{R:0}", getTimePast(new Date(info["date"])));;
    if (info["dueDate"] != null) {
        date = getLanguage("payment_history_status_due_date").replaceAll("{R:0}", getTimePast(new Date(info["dueDate"])));
    }
    if (info["cancelDate"] != null) {
        date = getLanguage("payment_history_status_cancel_date").replaceAll("{R:0}", getTimePast(new Date(info["cancelDate"])));
    }

    return {
        "pgImageUrl": pgImageUrl,
        "pgName": getLanguage("payment_history_pg:" + info["paymentGateway"]),
        "amount": amount,
        "receiptUrl": receiptUrl,
        "methodImageUrl": methodImg,
        "methodTitle": methodTitle,
        "paymentStatus": paymentStatus,
        "orderIcon": orderIcon,
        "orderTitle": orderTitle,
        "orderDescription": orderDescription,
        "isVirtualAccount": isVirtualAccount,
        "date": date
    };
}





function cancelPaymentHistory(number, paymentGateway, isVirtualAccount) {
    if (isVirtualAccount == true) {
        let onclick = `
            spinLoading();
            setTimeout(() => {
                openPopupContents("cancel_payment", false, '` + JSON.stringify({
                    'number': number,
                    'paymentGateway': paymentGateway
                }) + `');
                spinLoadingComplete();
            }, 1000);
        `;

        confirmPopup(getLanguage("payment_history_refund_confirm:title"), getLanguage("payment_history_refund_confirm:description"), onclick);
        return;
    }

    if (paymentGateway == 0) {
        let onclick = 'requestCancelPaymentHistory(' + number + ', ' + paymentGateway + ');';
        confirmPopup(getLanguage("payment_history_refund_confirm:title"), getLanguage("payment_history_refund_confirm:description"), onclick);
    }
}
function requestCancelPaymentHistory(number, paymentGateway) {
    if (paymentGateway == 0) {
        requestTossPaymentsCancelPaymentHistory(number);
    }
}
function requestTossPaymentsCancelPaymentHistory(number) {
    let menuNumber = getCurrentMenuNumber();
    let menuName = getCurrentMenuName();
    let contents = document.getElementById("contents_" + menuNumber);
    let item = null;
    if (contents != null) {
        let items = contents.getElementsByClassName("payment_history_element");
        for (let i = 0; i < items.length; i++) {
            if (items[i].getAttribute("number") == number) {
                item = items[i];
            }
        }
    }

    if (menuName == "payment_history") {
        item = contents.getElementsByClassName("menu_payment_history_box")[0];
    }

    spinLoading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/user/payment/tossPayments/cancel.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let resultCode = xhr.responseText.trim();

                if (resultCode == 0 && item != null) {
                    let status = item.getElementsByClassName("payment_history_element_right_status")[0];
                    status.setAttribute("value", 1);

                    if (menuName == "payment_history") {
                        let button = item.getElementsByClassName("menu_payment_history_box_button");
                        button[1].classList.add("menu_payment_history_box_button_disabled");
                    } else {
                        let button = item.getElementsByClassName("payment_history_element_right_item_value_right_button");
                        button[1].classList.add("payment_history_element_right_item_value_right_button_disabled");
                    }
                }
                if (isShowPopupContents == true) {
                    history.back();
                }
                
                //액션 메세지
                actionMessage(getLanguage("payment_history_refund_message:" + resultCode));
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
    formData.append("number", number);
    let refundReceiveAccount = getInfoPopupCancelPayment();
    if (refundReceiveAccount != null) {
        formData.append("refundReceiveAccount", JSON.stringify(refundReceiveAccount));
    }
    xhr.send(formData);
}