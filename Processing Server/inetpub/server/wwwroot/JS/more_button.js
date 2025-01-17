






/*

    슬롯 데이터 파라미터
    ["icon"] = SVG HTML
    ["title"] = 슬롯의 제목
    ["onclick"] = 슬롯을 클릭했을 때 실행되는 JS 코드

*/

var previousElementMoreButton = null;
var previousMousePositionMoreButton = null;
var isShowMobileMoreButtonBox = false;

function moreButton(el, slot, event) {
    //마우스 위치
    if (event != null) {
        let newEl = document.createElement("div");
        newEl.style.position = "fixed";
        newEl.style.top = (event.clientY + "px");
        newEl.style.left = (event.clientX + "px");
        let body = document.getElementsByTagName("body")[0];
        let div = body.appendChild(newEl);
        previousMousePositionMoreButton = div.getBoundingClientRect();
        div.remove();

        event.preventDefault();
    } else {
        previousMousePositionMoreButton = null;
    }

    if (isTouchDevice() == false) {
        let more_button = document.getElementsByClassName("more_button")[0];
        more_button.style.display = "block";
        let more_button_box = document.getElementsByClassName("more_button_box")[0];
        more_button_box.style.visibility = 'hidden';
        setTimeout(() => {
            more_button_box.style.visibility = 'inherit';
            more_button_box.style.animation = "show_more_button 0.1s forwards";
            setTimeout(() => {
                more_button_box.style.animation = null;
            }, 100);
        }, 1);
    } else {
        //모바일
        let mobile_more_button = document.getElementsByClassName("mobile_more_button")[0];
        mobile_more_button.style.display = "flex";
        mobile_more_button.style.animation = "show_mobile_more_button 0.1s forwards";
        let mobile_more_button_box = document.getElementsByClassName("mobile_more_button_box")[0];
        mobile_more_button_box.style.animation = "show_mobile_more_button_box 0.2s forwards";
        setTimeout(() => {
            mobile_more_button_box.style.animation = null;
        }, 200);

        isShowMobileMoreButtonBox = true;
    }

    //HTML
    setMoreButtonItemHtml(slot);

    //resize 이벤트
    previousElementMoreButton = el;
    setPositionMoreButton();
    window.addEventListener("resize", setPositionMoreButton);
    window.addEventListener("scroll", setPositionMoreButton);

    //모바일 SHOW 애니메이션
    if (isTouchDevice() == true) {
        let mobile_more_button_box = document.getElementsByClassName("mobile_more_button_box")[0];
        let height = mobile_more_button_box.clientHeight;
        mobile_more_button_box.style.transform = "translateY(" + height + "px)";
        function callback() {
            mobile_more_button_box.style.transition = "transform 0.2s";
            mobile_more_button_box.style.transform = null;
            setTimeout(() => {
                mobile_more_button_box.style.transition = null;
            }, 200);
        }
        window.requestAnimationFrame(callback);
    }
}
function setMoreButtonItemHtml(slot) {
    let box = document.getElementsByClassName("more_button_box")[0];
    let box2 = document.getElementsByClassName("mobile_more_button_box")[0];

    let html = '';
    for (let i = 0; i < slot.length; i++) {
        let onclick = slot[i]["onclick"] + " closeMoreButton();";
        let addClass = '';
        if (slot[i]["class"] != null) {
            addClass = ' ' + slot[i]["class"];
        }
        html += `
            <div class = "more_button_item md-ripples` + addClass + `" onclick = "` + onclick + `">
                <div class = "more_button_item_icon">
                    ` + slot[i]["icon"] + `
                </div>
                <div class = "more_button_item_title">
                    ` + slot[i]["title"] + `
                </div>
            </div>
        `;
    }

    box.innerHTML = html;
    box2.innerHTML = html;
}

function setPositionMoreButton() {
    let el = previousElementMoreButton;
    
    let clientRect = null;
    if (previousMousePositionMoreButton == null) {
        clientRect = el.getBoundingClientRect();
    } else {
        clientRect = previousMousePositionMoreButton;
    }

    let more_button_box = document.getElementsByClassName("more_button_box")[0];
    more_button_box.style.top = (clientRect.top + clientRect.height) + "px";
    more_button_box.style.left = (clientRect.left) + "px";

    //width
    let clientRect2 = more_button_box.getBoundingClientRect();
    let width = clientRect2.width;
    let left = (clientRect2.left + width) + 10;
    let browserWidth = document.body.offsetWidth;

    more_button_box.style.transformOrigin = "0 0";

    if (left > browserWidth) {
        more_button_box.style.top = (clientRect.top + clientRect.height) + "px";
        more_button_box.style.left = (clientRect.left + (clientRect.width - clientRect2.width)) + "px";

        more_button_box.style.transformOrigin = "100% 0";
    }

    //top
    clientRect2 = more_button_box.getBoundingClientRect();
    let height = clientRect2.height;
    let top = (clientRect2.top + height) + 10;
    let browserHeight = window.innerHeight;

    if (top > browserHeight) {
        more_button_box.style.top = ((clientRect2.top - clientRect2.height) - clientRect.height) + "px";

        if (left > browserWidth) {
            more_button_box.style.transformOrigin = "100% 100%";
        } else {
            more_button_box.style.transformOrigin = "0 100%";
        }
    }
}

function closeMoreButton(e) {
    let isClose = true;
    if (e != null) {
        let target = e.target;
        if (target.classList.contains("more_button") == false && target.classList.contains("mobile_more_button") == false) {
            isClose = false;
        }
    }

    if (isClose == true) {
        if (isTouchDevice() == false) {
            let more_button = document.getElementsByClassName("more_button")[0];
            setTimeout(() => {
                more_button.style.display = "none";
            }, 100);
            let more_button_box = document.getElementsByClassName("more_button_box")[0];
            more_button_box.style.animation = "hide_more_button 0.1s forwards";
        } else {
            let mobile_more_button = document.getElementsByClassName("mobile_more_button")[0];
            mobile_more_button.style.animation = "hide_mobile_more_button 0.2s forwards";
            setTimeout(() => {
                mobile_more_button.style.display = "none";
            }, 200);
            let mobile_more_button_box = document.getElementsByClassName("mobile_more_button_box")[0];
            mobile_more_button_box.style.animation = "hide_mobile_more_button_box 0.2s forwards";

            //
            let height = mobile_more_button_box.clientHeight;
            mobile_more_button_box.style.transition = "transform 0.2s";
            mobile_more_button_box.style.transform = "translateY(" + height + "px)";
            setTimeout(() => {
                mobile_more_button_box.style.transform = null;
                mobile_more_button_box.style.transition = null;
            }, 200);

            isShowMobileMoreButtonBox = false;
        }

        window.removeEventListener("resize", setPositionMoreButton);
        window.removeEventListener("scroll", setPositionMoreButton);
        previousElementMoreButton = null;
    }
}