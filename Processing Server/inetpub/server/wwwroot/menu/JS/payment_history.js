



function menuPaymentHistoryLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let info = JSON.parse(contents.getElementsByClassName("info")[0].innerHTML);

    let displayInfo = getPaymentHistoryDisplayInfo(info);

    let pgImage = contents.getElementsByClassName("menu_payment_history_box_pg_image")[0].getElementsByTagName("img")[0];
    pgImage.src = displayInfo["pgImageUrl"];
    let pgName = contents.getElementsByClassName("menu_payment_history_box_pg_name")[0];
    pgName.innerHTML = displayInfo["pgName"];

    let itemTitle = contents.getElementsByClassName("menu_payment_history_box_item_title");
    itemTitle[0].innerHTML = getLanguage("payment_history_title:method");
    itemTitle[1].innerHTML = getLanguage("payment_history_title:status");
    itemTitle[2].innerHTML = getLanguage("payment_history_title:order");

    let itemValueIcon = contents.getElementsByClassName("payment_history_element_right_item_value_icon");
    itemValueIcon[0].innerHTML = `
        <img src = "` + displayInfo["methodImageUrl"] + `" onload = "imageLoad(event);" alt = "">
    `;
    itemValueIcon[1].innerHTML = displayInfo["orderIcon"];

    let itemValueTitle = contents.getElementsByClassName("payment_history_element_right_item_value_right_title");
    itemValueTitle[0].innerHTML = displayInfo["methodTitle"];
    itemValueTitle[1].innerHTML = displayInfo["orderTitle"];

    let itemValueDescription = contents.getElementsByClassName("payment_history_element_right_item_value_right_description");
    itemValueDescription[0].innerHTML = displayInfo["amount"];
    itemValueDescription[1].innerHTML = displayInfo["orderDescription"];

    //결제 상태
    let status = contents.getElementsByClassName("payment_history_element_right_status")[0];
    status.setAttribute("value", displayInfo["paymentStatus"]);
    let statusTitle = contents.getElementsByClassName("payment_history_element_right_status_right_title");
    statusTitle[0].innerHTML = getLanguage("payment_history_status:0");
    statusTitle[1].innerHTML = getLanguage("payment_history_status:1");
    statusTitle[2].innerHTML = getLanguage("payment_history_status:2");
    statusTitle[3].innerHTML = getLanguage("payment_history_status:3");
    let statusDate = contents.getElementsByClassName("payment_history_element_right_status_right_date");
    for (let i = 0; i < statusDate.length; i++) {
        statusDate[i].innerHTML = displayInfo["date"];
    }

    //버튼
    let button = contents.getElementsByClassName("menu_payment_history_box_button");
    let buttonText = contents.getElementsByClassName("menu_payment_history_box_button_text");
    button[0].setAttribute("onclick", 'window.open(\'' + displayInfo["receiptUrl"] + '\');');
    button[1].setAttribute("onclick", "cancelPaymentHistory(" + info["number"] + ", " + info["paymentGateway"] + ", " + displayInfo["isVirtualAccount"] + ");");
    buttonText[0].innerHTML = getLanguage("payment_history_button:receipt");
    buttonText[1].innerHTML = getLanguage("payment_history_button:refund");
    
    //환불 버튼
    let isCancellable = info["isCancellable"];
    if (isCancellable == false) {
        button[1].classList.add("menu_payment_history_box_button_disabled");
    }
}