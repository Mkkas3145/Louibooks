

var visibleElement = new Array();

/*
    isShowMenu = 메뉴 이동인지
*/
function checkVisibleElement(isShowMenu) {
    (isShowMenu == null) ? isShowMenu = false : null;

    let menuNumber = getCurrentMenuNumber();
    let el = document.getElementsByClassName("visible_element");

    //보이는 앨리먼트 표시 및 내용 삭제
    let isCheckPartViewed = false;
    for (let i = 0; i < el.length; i++) {
        let visibleElement = getVisibleElement(el[i]);
        if (visibleElement == null) {
            visibleElement = addVisibleElement(el[i]);
        }

        //앨리먼트가 보이는지
        let isVisible = isVisibleElement(el[i]);
        if (isVisible == true || isAllowVisibleElement(el[i]) == true) {
            el[i].style.opacity = "inherit";
            if (isShowMenu == true) {
                el[i].style.height = null;
            } else {
                function callback() {
                    el[i].style.height = null;
                }
                window.requestAnimationFrame(callback);
            }

            if (el[i].innerHTML == "") {
                //el[i].innerHTML = visibleElement["html"];
                el[i].insertAdjacentHTML("beforeEnd", visibleElement["html"]);
                isCheckPartViewed = true;

                if (visibleElement["child_visible"].length != 0) {
                    let child_visible = el[i].getElementsByClassName("variable_element");
                    for (let j = 0; j < child_visible.length; j++) {
                        let index = visibleElement["child_visible"][j]["index"];
                        let visible = getVisibleIndexToElement(index);

                        let isVisibleIndex = getIsIntersecting(visible["element"])["index"];
                        isIntersecting[isVisibleIndex]["element"] = child_visible[j];
                        visibleIO.observe(child_visible[j]);

                        visible["element"] = child_visible[j];
                    }
                    visibleElement["child_visible"] = new Array();
                }

                //Image enhancement
                let image_enhancement = el[i].getElementsByClassName("image_enhancement");
                for (let i = 0; i < image_enhancement.length; i++) {
                    intiImageEnhancement(image_enhancement[i]);
                }
            }
        } else {
            if (el[i].innerHTML != "") {
                let rect = el[i].getBoundingClientRect();
                let height = rect.height;
                if (height != 0) {
                    el[i].style.height = height + "px";
                } else {
                    continue;
                }
                el[i].style.opacity = null;

                //원본 HTML
                visibleElement["html"] = el[i].innerHTML;
                //렌더링 최적화 HTML
                if (el[i].classList.contains("variable_element") && menuNumber == visibleElement["menuNumber"]) {
                    let render_html = el[i].cloneNode(true);
                    let immutable_element = el[i].getElementsByClassName("immutable_element");
                    let render_immutable_element = render_html.getElementsByClassName("immutable_element");
                    for (let j = 0; j < immutable_element.length; j++) {
                        if (render_immutable_element[j] != null) {
                            render_immutable_element[j].style.height = immutable_element[j].clientHeight + "px";
                            render_immutable_element[j].textContent = '';
                        }
                    }
                    let render_image_element = render_html.getElementsByTagName("img");
                    for (let j = 0; j < render_image_element.length; j++) {
                        if (render_image_element[j] != null) {
                            render_image_element[j].src = '';
                        }
                    }
                    visibleElement["render_html"] = render_html.innerHTML;
                }

                let child_visible = el[i].getElementsByClassName("variable_element");
                let child_visible_array = new Array();
                for (let j = 0; j < child_visible.length; j++) {
                    child_visible_array[child_visible_array.length] = getVisibleElement(child_visible[j]);
                }
                visibleElement["child_visible"] = child_visible_array;

                visibleElement["width"] = el[i].clientWidth;
                //el[i].textContent = '';
                el[i].replaceChildren();
            }
        }

        //메뉴가 다른 앨리먼트 삭제
        if (visibleElement["menuNumber"] != menuNumber) {
            let temporary_remove = visibleElement["parentElement"].getAttribute("temporary_remove");
            let array = new Array();
            if (temporary_remove != null && temporary_remove != "") {
                array = temporary_remove.split(",");
            }
            if (array.includes(visibleElement["index"]) == false) {
                array[array.length] = visibleElement["index"];
                visibleElement["parentElement"].setAttribute("temporary_remove", array.join(","));
            }
            visibleElement["element"].remove();
            i--;
        }
    }

    if (isCheckPartViewed == true) {
        checkPartViewed();
        checkPercentPartViewed();
    }

    //버블 남아있는 앨리먼트
    let contents = document.getElementById("contents_" + getCurrentMenuNumber());
    let ripples = contents.getElementsByClassName('ripples');
    for (let i = 0; i < ripples.length; i++) {
        ripples[i].remove();
    }
}
function restoreVisibleElement(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let el = contents.getElementsByClassName("visible_element");

    //삭제된 앨리먼트 삭제
    let length = visibleElement.length;
    for (let i = 0; i < length; i++) {
        let exist = false;
        for (let j = 0; j < el.length; j++) {
            if (visibleElement[i]["element"] == el[j]) {
                exist = true;
            }
        }
        if (exist == false) {
            if (visibleElement[i]["menuNumber"] == menuNumber) {
                let parent = visibleElement[i]["parentElement"];
                let temporary_remove = parent.getAttribute("temporary_remove");
                //
                let array = new Array();
                if (temporary_remove != null && temporary_remove != '') {
                    array = temporary_remove.split(",");
                }
                for (let j = 0; j < array.length; j++) {
                    let visibleElementInfo = getVisibleIndexToElement(array[j]);
                    parent.appendChild(visibleElementInfo["element"]);
                    array = array.remove('' + array[j]);
                    j--;
                }
                parent.setAttribute("temporary_remove", array.join(","));
            }
        }
    }

    let menuNumbers = getMenuNumbers();
    for (let i = 0; i < length; i++) {
        if (menuNumbers.indexOf(visibleElement[i]["menuNumber"]) == -1) {
            visibleElement[i] = null;
        }
    }
    
    visibleElement = visibleElement.filter((value, i) => value != null);
}

var visibleElementIndex = 0;

function addVisibleElement(el) {
    return visibleElement[visibleElement.length] = {
        "index": visibleElementIndex ++,
        "parentElement": el.parentElement,
        "element": el,
        "html": el.innerHTML,
        "menuNumber": getCurrentMenuNumber(),
        "child_visible": new Array(),
    };
}
function getVisibleElement(el) {
    for (let i = 0; i < visibleElement.length; i++) {
        if (visibleElement[i]["element"] == el) {
            return visibleElement[i];
        }
    }
    return null;
}
function getVisibleIndexToElement(index) {
    for (let i = 0; i < visibleElement.length; i++) {
        if (visibleElement[i]["index"] == index) {
            return visibleElement[i];
        }
    }
    return null;
}


function registerVisibleElement() {
    function callback() {
        let isNew = false;
        let el = document.getElementsByClassName("visible_element");
        for (let i = 0; i < el.length; i++) {
            let intersecting = getIsIntersecting(el[i]);
            if (intersecting == null) {
                visibleIO.observe(el[i]);
                isNew = true;
            }
        }
        if (isNew == true || isCheckVisibleIO == true) {
            //체크
            function callback2() { checkVisibleElement(); }
            window.requestAnimationFrame(callback2);

            isCheckVisibleIO = false;
        }
        //
        window.requestAnimationFrame(callback);
    }
    window.requestAnimationFrame(callback);
}
registerVisibleElement();





var isIntersecting = new Array();
var visibleIO = newVisibleIO();
var isCheckVisibleIO = false;

function newVisibleIO() {
    return new IntersectionObserver(entries => {
        entries.forEach(entry => {
            let target = entry.target;
            let visible = getIsIntersecting(target);

            if (visible == null) {
                isIntersecting[isIntersecting.length] = {
                    "index": isIntersecting.length,
                    "element": entry.target,
                    "isIntersecting": entry.isIntersecting,
                };
            } else {
                isIntersecting[visible["index"]]["isIntersecting"] = entry.isIntersecting;
                isCheckVisibleIO = true;
            }
        });
    });
}
function getIsIntersecting(el) {
    let length = isIntersecting.length;
    for (let i = 0; i < length; i++) {
        if (isIntersecting[i]["element"] == el) {
            return isIntersecting[i];
        }
    }
}

function isVisibleElement(el) {
    let intersecting = getIsIntersecting(el);
    if (intersecting == null) {
        visibleIO.observe(el);

        //
        let rect = el.getBoundingClientRect();
        let height = el.clientHeight;
        let viewPortBottom = window.innerHeight || document.documentElement.clientHeight;
    
        let isTopInViewPort = rect.top >= (height * -1),
            isBottomInViewPort = rect.bottom <= (viewPortBottom + height);
    
        return (isTopInViewPort && isBottomInViewPort);
    } else {
        return intersecting["isIntersecting"];
    }
}






var allowVisibleElement = new Array();
var allowVisibleElementIndex = 0;
function registerAllowVisibleElement(el, milliseconds) {
    let visibleElementList = new Array();
    while (true) {
        if (el.classList.contains("visible_element")) {
            visibleElementList[visibleElementList.length] = el;
        }
        if (el.parentElement == null) {
            break;
        }
        el = el.parentElement;
    }

    let newVisible = allowVisibleElement[allowVisibleElement.length] = {
        'index': allowVisibleElementIndex ++,
        'allowElement': visibleElementList,
    };

    if (milliseconds != null) {
        setTimeout(() => {
            //체크
            function callback() {
                function callback2() {
                    for (let i = 0; i < allowVisibleElement.length; i++) {
                        if (allowVisibleElement[i]["index"] == newVisible["index"]) {
                            allowVisibleElement[i] = null;
                        }
                    }
                    allowVisibleElement = allowVisibleElement.filter((value, i) => value != null);
                    
                    checkVisibleElement();
                }
                window.requestAnimationFrame(callback2);
            }
            window.requestAnimationFrame(callback);
        }, milliseconds);
    }

    //체크
    checkVisibleElement();
    return newVisible;
}
function deleteAllowVisibleElement(index) {
    function callback() {
        function callback2() {
            for (let i = 0; i < allowVisibleElement.length; i++) {
                if (allowVisibleElement[i]["index"] == index) {
                    allowVisibleElement[i] = null;
                }
            }
            allowVisibleElement = allowVisibleElement.filter((value, i) => value != null);

            checkVisibleElement();
        }
        window.requestAnimationFrame(callback2);
    }
    window.requestAnimationFrame(callback);
}
function isAllowVisibleElement(el) {
    for (let i = 0; i < allowVisibleElement.length; i++) {
        let allowElement = allowVisibleElement[i]["allowElement"];
        for (let j = 0; j < allowElement.length; j++) {
            if (allowElement[j] == el) {
                return true;
            }
        }
    }
    return false;
}






let isForcedProcessingVariableElement = false; //부모 Width가 안 바뀌어도 강제 처리
function checkVariableElement(menuNumber) {
    //console.time('checkVariableElement');

    let variable = document.getElementById("variable_element_box");

    if (variable != null) {
        let html = '';
        let length = visibleElement.length;
        for (let i = 0; i < length; i++) {
            let visible = visibleElement[i];
            if (visible["menuNumber"] == menuNumber) {
                if (visible["element"].classList.contains("variable_element") && visible["element"].innerHTML == "") {
                    let width = visible["element"].clientWidth;
                    if (visible["width"] != width || isForcedProcessingVariableElement == true) {
                        let display = getComputedStyle(visible["element"]).getPropertyValue("display");
                        html += "<div class = \"" + visible["element"].classList + "\" style = \"width: " + width + "px; display: " + display + ";\" index = \"" + i + "\">" + visible["render_html"] + "</div>";
                        visible["width"] = width;
                    }
                }
            }
        }
    
        if (html != "") {
            variable.insertAdjacentHTML("beforeEnd", html);

            let children = variable.children;
            for (let i = 0; i < children.length; i++) {
                let height = children[i].clientHeight;
                let index = children[i].getAttribute("index");
        
                function callback() {
                    visibleElement[index]["element"].style.height = height;
                }
                window.requestAnimationFrame(callback);
            }

            variable.textContent = '';
        }
    }

    //console.timeEnd('checkVariableElement');
}



var notRunningCheckVariableElement = false;
function registerCheckVariableElement() {
    let previousTimestamp = null;
    function callback(timestamp) {
        if (previousTimestamp === timestamp) { return };
        previousTimestamp = timestamp;

        if (notRunningCheckVariableElement == false) {
            checkVariableElementCurrentMenu();
        }
        window.requestAnimationFrame(callback);
    }
    window.requestAnimationFrame(callback);
}
registerCheckVariableElement();

function checkVariableElementCurrentMenu() {
    let menuNumber = getCurrentMenuNumber();
    if (menuNumber != null) {
        checkVariableElement(menuNumber);
    }
}