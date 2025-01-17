

var previousDragItemNumber = null;

function cloudDrag(menuNumber, itemNumber, event, el) {
    let y = event.pageY;
    let x = event.pageX;
    let transition = el.style.transition;
    let zIndex = el.style.zIndex;
    let pointerEvents = el.style.pointerEvents;
    let first = false;

    function move(event) {
        let distanceY = event.pageY - y;
        let distanceX = event.pageX - x;

        if (((distanceY <= 10 && distanceY >= -10) == false || (distanceX <= 10 && distanceX >= -10) == false) || first == true) {
            el.style.pointerEvents = "none";
            el.style.transition = "all 0s";
            el.style.zIndex = "1";
            el.style.transform = "scale(0.95) translate(" + distanceX + "px, " + distanceY + "px)";
            previousDragItemNumber = itemNumber;
            first = true;
        }

        previousDistanceY = distanceY;
        previousdistanceX = distanceX;
    }
    function complete() {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", complete);

        if (isCloudMoveFolder == false) {
            el.style.pointerEvents = pointerEvents;
            el.style.transform = "unset";
            el.style.zIndex = zIndex;
            el.style.transition = transition;
        } else {
            el.style.transition = "all 0.2s";
            el.style.opacity = "0";
            el.style.transform = "scale(0.9) translate(" + previousdistanceX + "px, " + previousDistanceY + "px)";

            isCloudMoveFolder = false;
        }
        previousDragItemNumber = null;
    }

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", complete);
}

var isCloudMoveFolder = false;

function cloudMoveFolder(menuNumber, folderNumber) {
    if (previousDragItemNumber != null) {
        let item_wrap = document.getElementById("cloud_contents_item_" + menuNumber + "_" + previousDragItemNumber);
        let height = item_wrap.clientHeight;
        item_wrap.style.transition = "all 0.2s";
        item_wrap.style.height = height + "px";
        setTimeout(() => {
            item_wrap.style.height = "0px";
        }, 10);
        setTimeout(() => {
            item_wrap.remove();
        }, 210);

        requestCloudMoveFolder(folderNumber, previousDragItemNumber);
        isCloudMoveFolder = true;
    }
}

function requestCloudMoveFolder(folderNumber, itemNumber) {
    loading();
    
    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, '/php/cloud/moveItem.php');
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                
            } else {
                if (status == 504) {
                    //시간 초과
                } else {
                    //오류 발생
                }
            }
            loadingComplete();
        }
    });
    
    var formData = new FormData();
    if (folderNumber != null) {
        formData.append("folderNumber", folderNumber);
    }
    formData.append("itemNumber", itemNumber);

    xhr.send(formData);
}