






var previousElementHoverInformation = null;
var hoverInformationTimeout = null;
var hoverInformationIsTop = null;

function hoverInformation(el, text, isTop) {
    (isTop == null) ? isTop = false : null;

    let timeout = setTimeout(() => {
        let hover_information = document.getElementsByClassName("hover_information")[0];
        hover_information.style.display = "block";
        let hover_information_box = document.getElementsByClassName("hover_information_box")[0];
        hover_information_box.style.visibility = 'hidden';
        setTimeout(() => {
            hover_information_box.style.visibility = 'inherit';
            hover_information_box.style.animation = "show_hover_information 0.1s forwards";
        }, 1);
    
        setHoverInformationText(text);
        setPositionHoverInformation();
    }, 110);

    window.addEventListener("resize", setPositionHoverInformation);
    window.addEventListener("scroll", setPositionHoverInformation);
    window.addEventListener("click", closeHoverInformation);
    el.addEventListener("mouseleave", closeHoverInformation);
    previousElementHoverInformation = el;

    hoverInformationTimeout = timeout;
    hoverInformationIsTop = isTop;


    //스크린 리더용 텍스트 모두 제거
    let createTextNode = document.getElementsByTagName("createtextnode");
    for (let i = 0; i < createTextNode.length; i++) {
        createTextNode[i].remove();
    }

    let newElement = document.createElement("createTextNode");
    newElement.innerHTML = `
        <spen class = "text_hidden">` + text + `</spen>
    `;
    el.append(newElement);
}
function setHoverInformationText(text) {
    let box = document.getElementsByClassName("hover_information_box")[0];

    box.innerText = text;
}

function setPositionHoverInformation() {
    let el = previousElementHoverInformation;
    
    let hover_information_box = document.getElementsByClassName("hover_information_box")[0];
    let clientRect = el.getBoundingClientRect();
    let clientRect2 = hover_information_box.getBoundingClientRect();

    hover_information_box.style.top = ((clientRect.top + clientRect.height) + 10) + "px";
    let setLeft = (clientRect.left) - ((clientRect2.width / 2) - (clientRect.width / 2))
    hover_information_box.style.left = setLeft + "px";

    //top
    clientRect2 = hover_information_box.getBoundingClientRect();
    let height = clientRect2.height;
    let top = (clientRect2.top + height) + 10;
    let browserHeight = window.innerHeight;

    hover_information_box.style.transformOrigin = "top center";

    if (top > browserHeight || hoverInformationIsTop == true) {
        hover_information_box.style.top = (((clientRect2.top - clientRect2.height) - clientRect.height) - 20) + "px";

        hover_information_box.style.transformOrigin = "bottom center";
    }

    //width
    let width = clientRect2.width;
    let left = (clientRect2.left + width) + 5;
    let right = (clientRect2.right - clientRect2.width) - 5;
    let browserWidth = document.body.offsetWidth;

    if (left > browserWidth) {
        let difference = (left - browserWidth);
        hover_information_box.style.left = (setLeft - difference) + "px";
    }
    if (right < 0) {
        let difference = right;
        hover_information_box.style.left = (setLeft - difference) + "px";
    }
}

function closeHoverInformation() {
    let hover_information = document.getElementsByClassName("hover_information")[0];
    setTimeout(() => {
        hover_information.style.display = "none";
    }, 100);
    let hover_information_box = document.getElementsByClassName("hover_information_box")[0];
    hover_information_box.style.animation = "hide_hover_information 0.1s forwards";

    window.removeEventListener("resize", setPositionHoverInformation);
    window.removeEventListener("scroll", setPositionHoverInformation);
    window.removeEventListener("click", closeHoverInformation);
    if (previousElementHoverInformation != null) {
        previousElementHoverInformation.removeEventListener("mouseout", closeHoverInformation);
        previousElementHoverInformation = null;
    }

    clearTimeout(hoverInformationTimeout);
    hoverInformationTimeout = null;
    hoverInformationIsTop = null;
}