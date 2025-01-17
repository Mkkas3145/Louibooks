






var previousElementHoverHelp = null;
var hoverHelpTimeout = null;

function hoverHelp(el, html) {
    let timeout = setTimeout(() => {
        let hover_help = document.getElementsByClassName("hover_help")[0];
        hover_help.style.display = "block";
        let hover_help_box = document.getElementsByClassName("hover_help_box")[0];
        hover_help_box.style.visibility = 'hidden';
        setTimeout(() => {
            hover_help_box.style.visibility = 'inherit';
            hover_help_box.style.animation = "show_hover_help 0.1s forwards";
        }, 1);
    
        setHoverHelpHtml(html);
        setPositionHoverHelp();
    }, 300);

    window.addEventListener("resize", setPositionHoverHelp);
    window.addEventListener("scroll", setPositionHoverHelp);
    el.addEventListener("mouseleave", closeHoverHelp);
    previousElementHoverHelp = el;
    
    hoverHelpTimeout = timeout;
}
function setHoverHelpHtml(html) {
    let box = document.getElementsByClassName("hover_help_box")[0];
    box.innerHTML = html.replaceAll("\n", "<br />");
}

function setPositionHoverHelp() {
    let el = previousElementHoverHelp;
    if (el == null || el.tagName == null) {
        closeHoverHelp();
        return;
    }
    
    let hover_help_box = document.getElementsByClassName("hover_help_box")[0];
    let clientRect = el.getBoundingClientRect();
    let clientRect2 = hover_help_box.getBoundingClientRect();

    if (clientRect.top == 0 && clientRect.left == 0) {
        closeHoverHelp();
        return;
    }

    hover_help_box.style.top = ((clientRect.top + clientRect.height) + 10) + "px";
    let setLeft = (clientRect.left) - ((clientRect2.width / 2) - (clientRect.width / 2))
    hover_help_box.style.left = setLeft + "px";

    //top
    clientRect2 = hover_help_box.getBoundingClientRect();
    let height = clientRect2.height;
    let top = (clientRect2.top + height) + 10;
    let browserHeight = window.innerHeight;

    hover_help_box.style.transformOrigin = "top center";

    if (top > browserHeight) {
        hover_help_box.style.top = (((clientRect2.top - clientRect2.height) - clientRect.height) - 20) + "px";

        hover_help_box.style.transformOrigin = "bottom center";
    }









    //top - 위치 조정
    hover_help_box.style.marginTop = "0px";

    clientRect2 = hover_help_box.getBoundingClientRect();
    let paddingHeight = 10; //여유 공간
    top = (clientRect2.top + height) + paddingHeight;
    browserHeight = window.innerHeight;

    if (top > browserHeight) {
        let marginTop = top - browserHeight;
        hover_help_box.style.marginTop = "-" + marginTop + "px";
    }
    if (clientRect2.top < paddingHeight) {
        let marginTop = (clientRect2.top + (paddingHeight * -1)) * -1;
        hover_help_box.style.marginTop = marginTop + "px";
    }


    





    

    //width
    let width = clientRect2.width;
    let left = (clientRect2.left + width) + 5;
    let right = (clientRect2.right - clientRect2.width) - 5;
    let browserWidth = document.body.offsetWidth;

    if (left > browserWidth) {
        let difference = left - browserWidth;
        hover_help_box.style.left = (setLeft - difference) + "px";
    }
    if (right < 0) {
        let difference = right;
        hover_help_box.style.left = (setLeft - difference) + "px";
    }
}

function closeHoverHelp() {
    let hover_help = document.getElementsByClassName("hover_help")[0];
    setTimeout(() => {
        hover_help.style.display = "none";
    }, 100);
    let hover_help_box = document.getElementsByClassName("hover_help_box")[0];
    hover_help_box.style.animation = "hide_hover_help 0.1s forwards";

    window.removeEventListener("resize", setPositionHoverHelp);
    window.removeEventListener("scroll", setPositionHoverHelp);
    window.removeEventListener("click", closeHoverHelp);
    if (previousElementHoverHelp != null) {
        previousElementHoverHelp.removeEventListener("mouseout", closeHoverHelp);
        previousElementHoverHelp = null;
    }

    setTimeout(() => {
        hover_help_box.textContent = "";
    }, 100);

    clearTimeout(hoverHelpTimeout);
    hoverHelpTimeout = null;
}