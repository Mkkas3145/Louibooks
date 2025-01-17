






/*

    슬롯 데이터 파라미터
    ["icon"] = SVG HTML
    ["title"] = 슬롯의 제목
    ["onclick"] = 슬롯을 클릭했을 때 실행되는 JS 코드

*/

var previousElementHeaderMoreButton = null;

function headerMoreButton(el, html) {
    let more_button = document.getElementsByClassName("header_more_button")[0];
    more_button.style.display = "block";
    let more_button_box = document.getElementsByClassName("header_more_button_box")[0];
    more_button_box.style.visibility = 'hidden';
    setTimeout(() => {
        more_button_box.style.visibility = 'inherit';
        more_button_box.style.animation = "show_more_button 0.1s forwards";
    }, 1);

    setHeaderMoreButtonItemHtml(html);

    //resize 이벤트
    previousElementHeaderMoreButton = el;
    setPositionHeaderMoreButton();
    window.addEventListener("resize", setPositionHeaderMoreButton);
    window.addEventListener("scroll", setPositionHeaderMoreButton);
}
function setHeaderMoreButtonItemHtml(html) {
    let box = document.getElementsByClassName("header_more_button_box")[0];

    box.innerHTML = html;
}

function setPositionHeaderMoreButton() {
    let el = previousElementHeaderMoreButton;
    
    let clientRect = el.getBoundingClientRect();

    let more_button_box = document.getElementsByClassName("header_more_button_box")[0];
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

}

function closeHeaderMoreButton(e) {
    let isClose = true;
    if (e != null) {
        let target = e.target;
        if (target.classList.contains("header_more_button") == false) {
            isClose = false;
        }
    }

    if (isClose == true) {
        let more_button = document.getElementsByClassName("header_more_button")[0];
        setTimeout(() => {
            more_button.style.display = "none";
        }, 100);
        let more_button_box = document.getElementsByClassName("header_more_button_box")[0];
        more_button_box.style.animation = "hide_more_button 0.1s forwards";

        window.removeEventListener("resize", setPositionHeaderMoreButton);
        window.removeEventListener("scroll", setPositionHeaderMoreButton);
        previousElementHeaderMoreButton = null;
    }
}