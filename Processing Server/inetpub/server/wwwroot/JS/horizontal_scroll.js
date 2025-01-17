



function checkHorizontalScroll() {
    let menuNumber = getCurrentMenuNumber();
    if (menuNumber == null || isNaN(menuNumber)) { return; }
    let contents = document.getElementById("contents_" + menuNumber);
    let horizontal_scroll = contents.getElementsByClassName("horizontal_scroll");
    let length = horizontal_scroll.length;

    for (let i = 0; i < length; i++) {
        let target = horizontal_scroll[i];

        //가로 스크롤 박스가 존재하지 않을 경우
        if (target.getElementsByClassName("horizontal_scroll_box").length == 0) {
            let newEl = document.createElement("div");
            newEl.classList.add("horizontal_scroll_box");
            newEl.innerHTML = `
                <div class = "horizontal_scroll_box_item md-ripples" style = "left: -20px;" onclick = "moveHorizontalScroll(this, 'left');">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.707 17.293l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-6 6c-0.391 0.391-0.391 1.024 0 1.414l6 6c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"></path></svg>
                </div>
                <div class = "horizontal_scroll_box_item md-ripples" style = "margin-left: auto; left: 20px;" onclick = "moveHorizontalScroll(this, 'right');">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9.707 18.707l6-6c0.391-0.391 0.391-1.024 0-1.414l-6-6c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z"></path></svg>
                </div>
            `;
            target.appendChild(newEl);
        }

        let scroll_box = target.getElementsByClassName("horizontal_scroll_box")[0];
        let scrollBoxWidth = (target.clientWidth + "px");
        let scrollBoxHeight = (target.clientHeight + "px");
        (scroll_box.style.width != scrollBoxWidth) ? scroll_box.style.width = scrollBoxWidth : null;
        (scroll_box.style.height != scrollBoxHeight) ? scroll_box.style.height = scrollBoxHeight : null;

        let items = target.getElementsByClassName("horizontal_scroll_box_item");
        let scrollWidth = (target.scrollWidth - target.clientWidth);
        if (scrollWidth != 0 && (scrollWidth - 1) <= target.scrollLeft) {
            items[0].style.display = "flex"; items[0].style.animation = "showHorizontalScroll 0.1s forwards";
            items[1].style.animation = "hideHorizontalScroll 0.1s forwards";
            setTimeout(() => {
                items[1].style.display = "none";
            }, 200);
        } else if (scrollWidth != 0 && target.scrollLeft == 0) {
            items[0].style.animation = "hideHorizontalScroll 0.1s forwards";
            setTimeout(() => {
                items[0].style.display = "none";
            }, 200);
            items[1].style.display = "flex"; items[1].style.animation = "showHorizontalScroll 0.1s forwards";
        } else if (scrollWidth != 0) {
            items[0].style.display = "flex"; items[0].style.animation = "showHorizontalScroll 0.1s forwards";
            items[1].style.display = "flex"; items[1].style.animation = "showHorizontalScroll 0.1s forwards";
        } else {
            items[0].style.animation = "hideHorizontalScroll 0.1s forwards";
            items[1].style.animation = "hideHorizontalScroll 0.1s forwards";
            setTimeout(() => {
                if (items.length != 0) {
                    items[0].style.display = "none";
                    items[1].style.display = "none";
                }
            }, 200);
        }
    }
}

/*
    type = left, right
*/
function moveHorizontalScroll(el, type) {
    let parent = el.parentElement.parentElement;

    let left = parent.clientWidth;
    if (type == "left") {
        left *= -1;
    }
    parent.scrollBy({
        top: 0,
        left: left,
        behavior: 'smooth'
    });
}



function registerHorizontalScroll() {
    let previousTimestamp = null;
    function callback(timestamp) {
        if (previousTimestamp === timestamp) { return };
        previousTimestamp = timestamp;
        
        checkHorizontalScroll();
        window.requestAnimationFrame(callback);
    }
    window.requestAnimationFrame(callback);
}
//터치 디바이스 제외
(isTouchDevice() == false) ? registerHorizontalScroll() : null;