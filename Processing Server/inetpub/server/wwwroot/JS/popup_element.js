

var isShowPopupElement = false;
var previousElementPopupElement = null;
var previousElementPopupElement_direction = null;

function popupElement(el, direction, html, property) {
    (property == null) ? property = new Array() : null;
    let popup_element_box = document.getElementsByClassName("popup_element_box")[0];

    //속성 적용
    if (property["onscroll"] != null) {
        popup_element_box.setAttribute("onscroll", property["onscroll"]);
    }

    //터치 라인
    let touch_line_html = `
        <div class = "popup_element_touch_line_wrap" ontouchstart = "popupElementTouchStart(event);">
            <div class = "popup_element_touch_line"></div>
        </div>
    `;

    popup_element_box.innerHTML = touch_line_html + html;

    previousElementPopupElement = el;
    previousElementPopupElement_direction = direction;
    isShowPopupElement = true;

    showPopupElement();
    checkPositionPopupElement(); checkPositionPopupElement();
}
var callbackPopupElementPreviousTimestamp = null;
function callbackPopupElement(timestamp) {
    if (callbackPopupElementPreviousTimestamp === timestamp) { return };
    callbackPopupElementPreviousTimestamp = timestamp;

    if (previousElementPopupElement != null) {
        checkPositionPopupElement(); checkPositionPopupElement();
    }
    window.requestAnimationFrame(callbackPopupElement);
}
window.requestAnimationFrame(callbackPopupElement);

function setHtmlPopupElement(html) {
    let popup_element_box = document.getElementsByClassName("popup_element_box")[0];

    //터치 라인
    let touch_line_html = `
        <div class = "popup_element_touch_line_wrap" ontouchstart = "popupElementTouchStart(event);">
            <div class = "popup_element_touch_line"></div>
        </div>
    `;

    let width = popup_element_box.clientWidth;
    let height = popup_element_box.clientHeight;

    popup_element_box.innerHTML = touch_line_html + html;

    let afterWidth = popup_element_box.clientWidth;
    let afterHeight = popup_element_box.clientHeight;

    popup_element_box.style.width = width + 'px';
    popup_element_box.style.height = height + 'px';
    popup_element_box.style.overflow = 'hidden';

    function callback() {
        popup_element_box.style.width = afterWidth + 'px';
        popup_element_box.style.height = afterHeight + 'px';
    }
    window.requestAnimationFrame(callback);

    setTimeout(() => {
        popup_element_box.style.width = null;
        popup_element_box.style.height = null;
        popup_element_box.style.overflow = null;
    }, 200);
}
function showPopupElement() {
    let popup_element = document.getElementsByClassName("popup_element")[0];
    let popup_element_box = document.getElementsByClassName("popup_element_box")[0];
    popup_element.style.display = "flex";

    let media = matchMedia("screen and (max-width: 700px)");
    if (media.matches == false) {
        popup_element_box.style.animation = "show_popup_element_box 0.1s forwards";
        setTimeout(() => {
            popup_element_box.style.animation = null;
        }, 100);
    } else {
        popup_element_box.style.animation = "show_popup_element_box_mobile 0.2s forwards";
        setTimeout(() => {
            popup_element_box.style.animation = null;
        }, 200);

        //
        let height = popup_element_box.clientHeight;
        popup_element_box.style.transform = "translateY(" + height + "px)";
        function callback() {
            popup_element_box.style.transition = "transform 0.2s";
            popup_element_box.style.transform = null;
            setTimeout(() => {
                popup_element_box.style.transition = null;
            }, 200);
        }
        window.requestAnimationFrame(callback);
    }

    function callback2() {
        popup_element.style.backgroundColor = "var(--popup-background-color)";
    }
    window.requestAnimationFrame(callback2);
}

function setPopupElementScrollY(value) {
    let popup_element_box = document.getElementsByClassName("popup_element_box")[0];
    popup_element_box.scrollTo(0, value); //
}
function setPopupElementScrollYElement(el) {
    let popup_element_box = document.getElementsByClassName("popup_element_box")[0];
    popup_element_box.scrollTo(0, 0); //스크롤 초기화

    let popup_rect = popup_element_box.getBoundingClientRect();
    let el_rect = el.getBoundingClientRect();

    let scrollTop = (el_rect.top - popup_rect.top) - ((popup_rect.height - el_rect.height) / 2);
    setPopupElementScrollY(scrollTop);
}

function checkPositionPopupElement() {
    let el = previousElementPopupElement;
    let direction = previousElementPopupElement_direction;

    let popup_element_box = document.getElementsByClassName("popup_element_box")[0];

    let rect = el.getBoundingClientRect();

    if (rect.x == 0 && rect.y == 0 && rect.width == 0 && rect.height == 0) {
        return;
    }

    let left = rect.left;
    let top = rect.top - ((popup_element_box.clientHeight - el.clientHeight) / 2);
    if (direction == "left") {
        left -= (popup_element_box.offsetWidth + 10);
    } else if (direction == "right") {
        left += (popup_element_box.offsetWidth + 10);
    } else if (direction == "top") {
        left -= ((popup_element_box.offsetWidth / 2) - (rect.width / 2));
        top = rect.top + (rect.height + 10);
    } else if (direction == "bottom") {
        left -= ((popup_element_box.offsetWidth / 2) - (rect.width / 2));
        top = rect.top - (popup_element_box.offsetHeight + 10);
    }
    popup_element_box.style.left = left + "px";
    popup_element_box.style.top = top + "px";

    let clientRect2 = popup_element_box.getBoundingClientRect();
    let height = clientRect2.height;

    //top
    popup_element_box.style.marginTop = "0px";

    clientRect2 = popup_element_box.getBoundingClientRect();
    let paddingHeight = 15; //여유 공간
    top = (clientRect2.top + height) + paddingHeight;
    let browserHeight = window.innerHeight;

    if (top > browserHeight) {
        let marginTop = top - browserHeight;
        popup_element_box.style.marginTop = "-" + marginTop + "px";
    }
    if (clientRect2.top < paddingHeight) {
        let marginTop = (clientRect2.top + (paddingHeight * -1)) * -1;
        popup_element_box.style.marginTop = marginTop + "px";
    }





    //





    //left
    let browserWidth = window.innerWidth;
    popup_element_box.style.marginLeft = "0px";

    clientRect2 = popup_element_box.getBoundingClientRect();
    let width = clientRect2.width;
    left = (clientRect2.left + width) + 15;

    if (left > browserWidth) {
        let marginLeft = left - browserWidth;
        popup_element_box.style.marginLeft = "-" + marginLeft + "px";
    }

    clientRect2 = popup_element_box.getBoundingClientRect();
    width = clientRect2.width;
    let right = (clientRect2.right - width) - 10;

    if (right < 0) {
        let marginLeft = right;
        popup_element_box.style.marginLeft = (marginLeft * -1) + "px";
    }


    popup_element_box.style.maxWidth = null;


    //width
    clientRect2 = popup_element_box.getBoundingClientRect();
    width = clientRect2.width + 30;
    browserWidth = window.innerWidth;

    if (width > browserWidth) {
        popup_element_box.style.maxWidth = (clientRect2.width + (browserWidth - width)) + "px";
    }
}

var isHidePopupElementLock = false;
var isHidePopupElementCancel = false;
function hidePopupElement() {
    if (isHidePopupElementCancel == false && isHidePopupElementLock == false) {
        let popup_element = document.getElementsByClassName("popup_element")[0];
        let popup_element_box = document.getElementsByClassName("popup_element_box")[0];

        //속성 초기화
        popup_element_box.setAttribute("onscroll", null);

        let media = matchMedia("screen and (max-width: 700px)");
        if (media.matches == false) {
            popup_element_box.style.animation = "hide_popup_element_box 0.1s forwards";
        } else {
            popup_element_box.style.animation = "hide_popup_element_box_mobile 0.2s forwards";

            //
            let height = popup_element_box.clientHeight;
            popup_element_box.style.transition = "transform 0.2s";
            popup_element_box.style.transform = "translateY(" + height + "px)";
            setTimeout(() => {
                popup_element_box.style.transform = null;
                popup_element_box.style.transition = null;
            }, 200);
        }

        popup_element.style.backgroundColor = "transparent";
        setTimeout(() => {
            popup_element_box.style.left = null;
            popup_element_box.style.top = null;
            popup_element.style.display = "none";
            popup_element_box.innerHTML = '';
        }, 200);

        window.removeEventListener("resize", checkPositionPopupElement);
        window.removeEventListener("scroll", checkPositionPopupElement);

        previousElementPopupElement = null;
        previousElementPopupElement_direction = null;
        isShowPopupElement = false;
    } else {
        isHidePopupElementCancel = false;
    }
}



























































//
function popupElementBoxTouchStart(event) {
    if (window.matchMedia("screen and (max-width: 700px)").matches) {
        let box = document.getElementsByClassName("popup_element_box")[0];
        let startY = event.touches[0].pageY;
    
        function move(event) {
            let y = event.touches[0].pageY;
            
            if (startY - y < 0 && box.scrollTop == 0) {
                popupElementTouchStart(event);
            }
            document.removeEventListener("touchmove", move);
        }
    
        document.addEventListener("touchmove", move);
    }
}
function popupElementTouchStart(event) {
    if (isHidePopupElementLock == false) {
        let box = document.getElementsByClassName("popup_element_box")[0];
        box.style.overflow = "hidden";
    
        //스크롤 방지
        setBodyScroll(false);
    
        let difference = null;
        let firstY = null;
        function move(event) {
            let y = event.touches[0].pageY;
            (firstY == null) ? firstY = y : null;
    
            difference = y - firstY;
            (difference < 0) ? difference = 0 : null;
    
            box.style.transform = "translateY(" + difference + "px)";
        }
        function end(event) {
            //30px 이상 내려가면
            if (difference >= 30) {
                hidePopupElement();
            } else {
                box.style.transition = "transform 0.2s";
                box.style.transform = null;
                setTimeout(() => {
                    box.style.transition = null;
                }, 200);
            }
    
            //스크롤 방지 X
            setTimeout(() => {
                setBodyScroll(true);
                box.style.overflow = null;
            }, 100);
    
            document.removeEventListener("touchmove", move);
            document.removeEventListener("touchend", end);
            document.removeEventListener("touchcancel", end);
        }
    
        document.addEventListener("touchmove", move);
        document.addEventListener("touchend", end);
        document.addEventListener("touchcancel", end);
    }
}