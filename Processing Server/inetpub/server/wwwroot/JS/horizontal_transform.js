



function checkHorizontalTransform() {
    let menuNumber = getCurrentMenuNumber();
    if (menuNumber == null || isNaN(menuNumber)) { return; }
    let contents = document.getElementById("contents_" + menuNumber);
    let horizontal_transform = contents.getElementsByClassName("horizontal_transform");
    let length = horizontal_transform.length;

    for (let i = 0; i < length; i++) {
        let target = horizontal_transform[i];

        let currentOrder = Number.parseInt(target.getAttribute("current_order"));
        let maxOrder = Number.parseInt(target.getAttribute("item_count"));

        //가로 스크롤 박스가 존재하지 않을 경우
        if (target.getElementsByClassName("horizontal_transform_box").length == 0) {
            if (target.getAttribute("current_order") == null) {
                target.setAttribute("current_order", 1);
                currentOrder = Number.parseInt(target.getAttribute("current_order"));

                let items = getItemsHorizontalTransform(target);
                children = items.children;
                for (let i = 0; i < children.length; i++) {
                    if (i == (currentOrder - 1)) {
                        children[i].style.height = null;
                    } else {
                        children[i].style.height = "0px";
                    }
                }
            }

            let newEl = document.createElement("div");
            newEl.classList.add("horizontal_transform_box");
            newEl.innerHTML = `
                <div class = "horizontal_transform_box_item md-ripples" style = "left: -20px;" onclick = "moveHorizontalTransform(this, 'left');">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.707 17.293l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-6 6c-0.391 0.391-0.391 1.024 0 1.414l6 6c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"></path></svg>
                </div>
                <div class = "horizontal_transform_box_item md-ripples" style = "margin-left: auto; left: 20px;" onclick = "moveHorizontalTransform(this, 'right');">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9.707 18.707l6-6c0.391-0.391 0.391-1.024 0-1.414l-6-6c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z"></path></svg>
                </div>
            `;
            target.prepend(newEl);
        }

        let transform_box = target.getElementsByClassName("horizontal_transform_box")[0];
        let transformBoxWidth = (target.clientWidth + "px");
        let transformBoxHeight = (target.clientHeight + "px");
        (transform_box.style.width != transformBoxWidth) ? transform_box.style.width = transformBoxWidth : null;
        (transform_box.style.height != transformBoxHeight) ? transform_box.style.height = transformBoxHeight : null;

        let items = target.getElementsByClassName("horizontal_transform_box_item");
        //
        if (currentOrder > 1) {
            items[0].style.display = "flex";
            items[0].style.animation = "showHorizontalTransform 0.1s forwards";
        } else {
            items[0].style.animation = "hideHorizontalTransform 0.1s forwards";
            setTimeout(() => {
                items[0].style.display = "none";
            }, 200);
        }
        //
        if (currentOrder < maxOrder) {
            items[1].style.display = "flex";
            items[1].style.animation = "showHorizontalTransform 0.1s forwards";
        } else {
            items[1].style.animation = "hideHorizontalTransform 0.1s forwards";
            setTimeout(() => {
                items[1].style.display = "none";
            }, 200);
        }
    }
}

/*
    type = left, right
*/
function moveHorizontalTransform(el, type) {
    let parent = el.parentElement.parentElement;

    let items = getItemsHorizontalTransform(parent);
    items.style.transition = "transform 0.2s";

    //
    let currentOrder = parent.getAttribute("current_order");
    if (type == "left") {
        currentOrder --;
    } else if (type == "right") {
        currentOrder ++;
    }
    parent.setAttribute("current_order", currentOrder);
    items.style.transform = "translateX(-" + ((currentOrder * 100) - 100) + "%)";

    //height 변화
    let height = parent.clientHeight;
    children = items.children;
    for (let i = 0; i < children.length; i++) {
        if (i == (currentOrder - 1)) {
            children[i].style.height = null;
        } else {
            children[i].style.height = "0px";
        }
    }
    let currentHeight = parent.clientHeight;
    if (height != currentHeight) {
        parent.style.height = height + "px";
        function callback() {
            parent.style.height = currentHeight + "px";
            setTimeout(() => {
                parent.style.height = null;
            }, 200);
        }
        window.requestAnimationFrame(callback);
    }

    moveHorizontalTransformComplete(parent, currentOrder);
}
function getItemsHorizontalTransform(el) {
    let children = el.children;
    for (let i = 0; i < children.length; i++) {
        if (children[i].classList.contains("horizontal_transform_box") == false) {
            return children[i];
        }
    }
    return null;
}

function moveHorizontalTransformComplete(el, currentOrder) {
    if (el.getElementsByClassName("community_option_images").length != 0) {
        let parent = el.parentElement;
        let count_box = parent.getElementsByClassName("community_option_images_count_box")[0];
        let count = count_box.getElementsByTagName("span")[0];
        count.innerHTML = currentOrder;
    }
    if (el.getElementsByClassName("menu_admin_questions_images").length != 0) {
        let parent = el.parentElement;
        let count_box = parent.getElementsByClassName("menu_admin_questions_images_count_box")[0];
        let count = count_box.getElementsByTagName("span")[0];
        count.innerHTML = currentOrder;
    }
    if (el.getElementsByClassName("menu_reviewed_questions_images").length != 0) {
        let parent = el.parentElement;
        let count_box = parent.getElementsByClassName("menu_reviewed_questions_images_count_box")[0];
        let count = count_box.getElementsByTagName("span")[0];
        count.innerHTML = currentOrder;
    }
}



function registerHorizontalTransform() {
    let previousTimestamp = null;
    function callback(timestamp) {
        if (previousTimestamp === timestamp) { return };
        previousTimestamp = timestamp;
        
        checkHorizontalTransform();
        window.requestAnimationFrame(callback);
    }
    window.requestAnimationFrame(callback);
}
registerHorizontalTransform();