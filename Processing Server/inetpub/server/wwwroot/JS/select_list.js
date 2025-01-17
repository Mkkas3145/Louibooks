






var previousElementSelectList = null;
var selectListPopupWidth = null;

function selectList(el, items) {
    //selectListPopupWidth 값
    if (el.getAttribute("popupwidth") != null) {
        selectListPopupWidth = el.getAttribute("popupwidth");
    } else {
        selectListPopupWidth = "100%";
    }

    let select_list = document.getElementsByClassName("select_list")[0];
    select_list.style.display = "block";
    let select_list_box = document.getElementsByClassName("select_list_box")[0];
    select_list_box.style.visibility = 'hidden';
    setTimeout(() => {
        select_list_box.style.visibility = 'inherit';
        select_list_box.style.animation = "show_select_list 0.1s forwards";
    }, 1);
    
    setSelectListItems(items, el.getAttribute("value"));

    window.addEventListener("resize", setPositionSelectList2);
    window.addEventListener("scroll", setPositionSelectList2);
    setTimeout(() => {
        window.addEventListener("click", closeSelectList);
    }, 1);
    
    previousElementSelectList = el;
    setPositionSelectList2();
}
function setPositionSelectList2() {
    setPositionSelectList(); setPositionSelectList();
}
function setSelectListItems(items, value) {
    let box = document.getElementsByClassName("select_list_box")[0];
    box.innerHTML = '';

    for (let i = 0; i < items.length; i++) {
        let newElement = document.createElement("div");
        let setValue = items[i].value;
        if (isNaN(setValue)) {
            setValue = "'" + items[i].value + "'";
        }
        newElement.setAttribute("onclick", "setValueSelectList(" + setValue + ", '" + items[i].title + "');");
        newElement.setAttribute("id", "select_list_item_value_" + items[i].value);
        newElement.classList.add("select_list_box_item");
        newElement.classList.add("md-ripples");
        if (items[i].value == value) {
            newElement.classList.add("select_list_box_item_selected");
        }

        let description = '';
        if (items[i]["description"] != null) {
            description = '<div class = "select_list_box_item_description">' + items[i]["description"] + '</div>';
        }

        let icon = ``;
        if (items[i]["icon"] != null) {
            icon = `
                <div class = "select_list_box_item_icon">
                    ` + items[i]["icon"] + `
                </div>
            `;
        }
        let image = ``;
        if (items[i]["image"] != null) {
            image = `
                <div class = "select_list_box_item_icon">
                    <img src = "` + items[i]["image"] + `" onload = "imageLoad(event);" alt = "">
                </div>
            `;
        }

        newElement.innerHTML += `
            ` + image + `
            ` + icon + `
            <div class = "select_list_box_item_left">
                <div class = "select_list_box_item_title">` + items[i]["title"] + `</div>
                ` + description + `
            </div>
            <div class = "select_list_box_item_right">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M499.169,36.875l26.69-26.907a1.531,1.531,0,0,1,2.063.125,1.657,1.657,0,0,1,0,2.094L499.938,40.141s-1.062.656-1.766,0-16.3-16.422-16.3-16.422A1.475,1.475,0,0,1,482,22a1.65,1.65,0,0,1,1.578-.453s.125-.125,1.453,1.125S499.169,36.875,499.169,36.875Z" transform="translate(-480)"/></g></svg>
            </div>
        `;
        box.appendChild(newElement);
    }
}
function setValueSelectList(value, title) {
    previousElementSelectList.setAttribute("value", value);
    if (previousElementSelectList.getAttribute("onchange") != null) {
        previousElementSelectList.onchange();
    }

    let titleItems = previousElementSelectList.getElementsByClassName("value_title");
    for (let i = 0; i < titleItems.length; i++) {
        titleItems[i].innerText = title;
        titleItems[i].style.animation = "unset";
        setTimeout(() => {
            titleItems[i].style.animation = "change_select_list_item 0.2s";
        }, 1);
    }
}

function setPositionSelectList() {
    let el = previousElementSelectList;
    if (el == null || (el.getBoundingClientRect().top == 0 && el.getBoundingClientRect().left == 0)) {
        closeSelectList();
        return;
    }

    let select_list_box = document.getElementsByClassName("select_list_box")[0];

    //width 크기
    if (selectListPopupWidth == "max-content") {
        select_list_box.style.maxWidth = "unset";
    } else {
        select_list_box.style.maxWidth = (el.offsetWidth + "px");
    }
    //select_list_box.style.width = el.offsetWidth;

    let clientRect = el.getBoundingClientRect();
    let clientRect2 = select_list_box.getBoundingClientRect();
    let height = clientRect2.height;

    select_list_box.style.top = ((clientRect.top + clientRect.height) - el.offsetHeight) + "px";
    let setLeft = (clientRect.left) - ((clientRect2.width / 2) - (clientRect.width / 2));
    select_list_box.style.left = setLeft + "px";


    //top
    select_list_box.style.marginTop = "0px";

    clientRect2 = select_list_box.getBoundingClientRect();
    let paddingHeight = 10; //여유 공간
    let top = (clientRect2.top + height) + paddingHeight;
    let browserHeight = window.innerHeight;

    if (top > browserHeight) {
        let marginTop = top - browserHeight;
        select_list_box.style.marginTop = "-" + marginTop + "px";
    }
    if (clientRect2.top < paddingHeight) {
        let marginTop = (clientRect2.top + (paddingHeight * -1)) * -1;
        select_list_box.style.marginTop = marginTop + "px";
    }


    //height 제한
    select_list_box.style.height = "max-content";

    clientRect2 = select_list_box.getBoundingClientRect();
    height = clientRect2.height + 20;
    browserHeight = window.innerHeight;

    if (height > browserHeight) {
        select_list_box.style.height = (clientRect2.height + (browserHeight - height)) + "px";
    }




    //left
    let browserWidth = window.innerWidth;
    select_list_box.style.marginLeft = "0px";

    if (selectListPopupWidth == "max-content") {
        clientRect2 = select_list_box.getBoundingClientRect();
        let width = clientRect2.width;
        let left = (clientRect2.left + width) + 10;

        if (left > browserWidth) {
            let marginLeft = left - browserWidth;
            select_list_box.style.marginLeft = "-" + marginLeft + "px";
        }
    }

    //right
    if (selectListPopupWidth == "max-content") {
        clientRect2 = select_list_box.getBoundingClientRect();
        let width = clientRect2.width;
        let right = (clientRect2.right - width) - 10;

        if (right < 0) {
            let marginLeft = right;
            select_list_box.style.marginLeft = (marginLeft * -1) + "px";
        }
    }

    

    //width 크기
    select_list_box.style.width = selectListPopupWidth;



    //width 제한
    if (selectListPopupWidth == "max-content") {
        clientRect2 = select_list_box.getBoundingClientRect();
        width = clientRect2.width + 20;
        browserWidth = window.innerWidth;
    
        if (width > browserWidth) {
            select_list_box.style.width = (clientRect2.width + (browserWidth - width)) + "px";
        }
    }
}

function closeSelectList() {
    let select_list = document.getElementsByClassName("select_list")[0];
    setTimeout(() => {
        select_list.style.display = "none";
    }, 100);
    let select_list_box = document.getElementsByClassName("select_list_box")[0];
    select_list_box.style.animation = "hide_select_list 0.1s forwards";

    window.removeEventListener("resize", setPositionSelectList);
    window.removeEventListener("scroll", setPositionSelectList);
    window.removeEventListener("click", closeSelectList);
    if (previousElementSelectList != null) {
        previousElementSelectList = null;
    }
}