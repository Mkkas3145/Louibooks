



var previousScrollY = 0;
var previousTop = 0;

function setHeaderTop() {
    let dm_header = document.getElementsByTagName("header")[0];
    dm_header.style.transition = null;
    let dm_home_category = document.getElementsByClassName("contents_home_category");
    let maxTop = 0;
    //모바일 크기인지
    const media = matchMedia("screen and (max-width: 700px)");
    if (media.matches) {
        maxTop = 55;
    } else {
        maxTop = 0;
        return;
    }
    if (previousScrollY > window.pageYOffset) {
        //스크롤이 올라갈 경우
        let difference = (previousScrollY - window.pageYOffset);
        let setTop = ((previousTop + difference) < 0) ? (previousTop + difference) : 0;
        
        dm_header.style.position = "fixed";
        dm_header.style.transform = "translateY(" + setTop + "px)";
        //dm_header.style.top = setTop;
        previousTop = setTop;

        for (let i = 0; i < dm_home_category.length; i++) {
            dm_home_category[i].style.top = (55 - (setTop * -1)) + "px";
        }
    } else {
        //스크롤이 내려갈 경우
        let difference = (previousScrollY - window.pageYOffset);
        let setTop = ((previousTop + difference) > (maxTop * -1)) ? (previousTop + difference) : (maxTop * -1);

        let resultTop = (window.pageYOffset + setTop);

        dm_header.style.position = "fixed";
        dm_header.style.transform = "translateY(" + setTop + "px)";
        //dm_header.style.position = "absolute";
        //dm_header.style.transform = "translate(0px, " + resultTop + "px)";
        //dm_header.style.top = setTop;
        previousTop = setTop;

        for (let i = 0; i < dm_home_category.length; i++) {
            dm_home_category[i].style.top = (55 - (setTop * -1)) + "px";
        }
    }
    previousScrollY = window.pageYOffset;
}
document.addEventListener("scroll", setHeaderTop, { passive: true });
document.addEventListener("resize", setHeaderTop);
document.addEventListener("focus", setHeaderTop);





















function showHeaderPopup() {
    let header_popup = document.getElementsByClassName("header_popup")[0];
    let header_popup_box = document.getElementsByClassName("header_popup_box")[0];
    header_popup.style.display = "flex";
    header_popup.style.animation = "show_header_popup 0.2s forwards";
    header_popup_box.style.animation = "show_header_popup_box 0.2s forwards";

    let big_sidebar_html = '';
    if (document.getElementById("wrap_sidebar_default").style.display != "none") {
        big_sidebar_html += document.getElementById("wrap_sidebar_default").getElementsByClassName("big_sidebar")[0].innerHTML;
    } else if (document.getElementById("wrap_sidebar_admin").style.display != "none") {
        big_sidebar_html += document.getElementById("wrap_sidebar_admin").getElementsByClassName("big_sidebar")[0].innerHTML;
    } else if (document.getElementById("wrap_sidebar_my_account").style.display != "none") {
        big_sidebar_html += document.getElementById("wrap_sidebar_my_account").getElementsByClassName("big_sidebar")[0].innerHTML;
    } else if (document.getElementById("wrap_sidebar_workspace").style.display != "none") {
        big_sidebar_html += document.getElementById("wrap_sidebar_workspace").getElementsByClassName("big_sidebar")[0].innerHTML;
    }
    let html = `
        <div class = "header_left" style = "height: 50px; margin-top: 5px;">
            <div class = "header_left_sidebar_button">
                <div id = "header_left_sidebar_button_icon_popup_back_button" class = "header_left_sidebar_button_icon md-ripples" onclick = "hideHeaderPopup();" onmouseenter = "hoverInformation(this, getLanguage('back'));">
                    <svg style = "width: 18px; height: 18px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"></rect><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"></rect></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"></rect></g></svg>
                </div>
            </div>
        </div>
    `;
    header_popup_box.innerHTML = (html + big_sidebar_html);

    setBodyScroll(false);
    refreshDisplayColor();

    setTimeout(() => {
        let back_button = document.getElementById("header_left_sidebar_button_icon_popup_back_button");
        back_button.focus();
    }, 1);
}

var isHideHeaderPopupCancel = false;

function hideHeaderPopup() {
    if (isHideHeaderPopupCancel == false) {
        let header_popup = document.getElementsByClassName("header_popup")[0];
        let header_popup_box = document.getElementsByClassName("header_popup_box")[0];
        header_popup.style.animation = "hide_header_popup 0.2s forwards";
        header_popup_box.style.animation = "hide_header_popup_box 0.2s forwards";
    
        setTimeout(() => {
            header_popup.style.display = "none";
            header_popup_box.textContent = "";
        }, 200);
    
        setBodyScroll(true);
    } else {
        isHideHeaderPopupCancel = false;
    }
}