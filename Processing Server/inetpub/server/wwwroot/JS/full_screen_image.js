

var isShowFullScreenImage = false;

/*
    images = Array (String)
*/
function fullScreenImage(images, order, isHistory) {
    if (isShowFullScreenImage == false) {
        (order == null) ? order = 1 : null;
        setBodyScroll(false);

        let full_screen_image = document.getElementsByClassName("full_screen_image")[0];
        full_screen_image.style.display = "flex";
        full_screen_image.style.animation = "show_full_screen_image 0.2s forwards";

        let items = document.getElementsByClassName("full_screen_image_items")[0];
        for (let i = 0; i < images.length; i++) {
            let newEl = document.createElement("div");
            newEl.classList.add("full_screen_image_item");
            newEl.innerHTML = `
                <!-- 로딩 스피너 -->
                <div class="showbox"><div class="loader" style = "width: 40px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/></svg></div></div>
                <img src = "` + images[i] + `" loading = "lazy" onload = "imageLoad(event);" alt = "">
            `;
            items.appendChild(newEl);
        }
        items.style.transform = "translateX(-" + ((order * 100) - 100) + "%)";
        items.setAttribute("current_order", order);
        items.setAttribute("item_count", images.length);

        if (isHistory == null || isHistory == false) {
            let historyData = {
                "type": "fullScreenImage",
                "images": images,
                "order": order
            };
            history.pushState(historyData, null, null);
        }

        checkMoveButtonFullScreenImage();
        isShowFullScreenImage = true;
    }
}

//direction = left, right
function moveFullScreenImage(type) {
    if (isShowFullScreenImage == true) {
        let items = document.getElementsByClassName("full_screen_image_items")[0];

        let currentOrder = Number.parseInt(items.getAttribute("current_order"));
        let maxOrder = Number.parseInt(items.getAttribute("item_count"));
        if (type == "left") {
            currentOrder --;
        } else if (type == "right") {
            currentOrder ++;
        }
        (currentOrder < 1) ? currentOrder = 1 : null;
        (currentOrder > maxOrder) ? currentOrder = maxOrder : null;
        items.setAttribute("current_order", currentOrder);
        items.style.transform = "translateX(-" + ((currentOrder * 100) - 100) + "%)";

        checkMoveButtonFullScreenImage();
    }
}
function checkMoveButtonFullScreenImage() {
    let items = document.getElementsByClassName("full_screen_image_items")[0];
    let currentOrder = Number.parseInt(items.getAttribute("current_order"));
    let maxOrder = Number.parseInt(items.getAttribute("item_count"));

    let button = document.getElementsByClassName("full_screen_image_button");
    //
    if (currentOrder > 1) {
        button[0].style.display = "flex";
        button[0].style.animation = "showFullScreenImageMoveButton 0.1s forwards";
    } else {
        button[0].style.animation = "hideFullScreenImageMoveButton 0.1s forwards";
        setTimeout(() => {
            button[0].style.display = "none";
        }, 200);
    }
    //
    if (currentOrder < maxOrder) {
        button[1].style.display = "flex";
        button[1].style.animation = "showFullScreenImageMoveButton 0.1s forwards";
    } else {
        button[1].style.animation = "hideFullScreenImageMoveButton 0.1s forwards";
        setTimeout(() => {
            button[1].style.display = "none";
        }, 200);
    }
}

function hideFullScreenImage() {
    if (isShowFullScreenImage == true) {
        let full_screen_image = document.getElementsByClassName("full_screen_image")[0];
        full_screen_image.style.animation = "hide_full_screen_image 0.2s forwards";
        setTimeout(() => {
            full_screen_image.style.display = "none";
        }, 200);

        let items = document.getElementsByClassName("full_screen_image_items")[0];
        items.textContent = "";

        isShowFullScreenImage = false;
        setBodyScroll(true);
    }
}





function touchStartFullScreenImage() {
    let items = document.getElementsByClassName("full_screen_image_items")[0];
    let firstX = null;
    let difference = 0;
    let itemsTransform = items.style.transform;

    //items이 화면에서 얼마나 차이 나는지
    let rect = items.getBoundingClientRect();
    let correctX = rect.left;

    function move(event) {
        let x = null;
        if (event.type == "touchmove") {
            x = event.touches[0].pageX;
        } else if (event.type == "mousemove") {
            x = event.pageX;
        }
        (firstX == null) ? firstX = x : null;

        difference = x - firstX;

        items.style.transition = "all 0s";
        items.style.transform = "translateX(" + (correctX + difference) + "px)";
    }
    function end(event) {
        items.style.transition = null;

        //30px 이상 차이나면
        if (difference <= -30) {
            moveFullScreenImage("right");
        } else if (difference >= 30) {
            moveFullScreenImage("left");
        } else {
            items.style.transform = itemsTransform;
        }

        document.removeEventListener("touchmove", move);
        document.removeEventListener("touchend", end);
        document.removeEventListener("touchcancel", end);
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", end);
    }

    //터치 이벤트
    document.addEventListener("touchmove", move);
    document.addEventListener("touchend", end);
    document.addEventListener("touchcancel", end);
    //마우스 이벤트
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
}