



function profile_upload_file(e) {
    let target = e.target;
    uploadProfileImage(target.files[0]);
    target.value = null;
}
function uploadProfileImage(file) {
    let url = "";
    let fileType = file.type.split("/")[0];
    if (fileType == "image") {
        url = "https://img.louibooks.com/upload.php";
    } else if (fileType == "video") {
        url = "https://video.louibooks.com/upload.php";
    }

    popupContentsLoading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, url);
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;

                if (xhrHtml == "file is too big") {
                    actionMessage(getLanguage("change_profile_upload_file_big_message"));
                    popupContentsLoadingComplete();
                } else {
                    let json = JSON.parse(xhrHtml);
                    setHtmlPopupContents(getHtmlPopupContents_image_upload_complete(fileType, json["url"], json["width"], json["height"]), true);
                }
            } else {
                if (status == 504) {
                    //시간 초과
                    serverResponseErrorMessage(0);
                } else {
                    //오류 발생
                    serverResponseErrorMessage(1);
                }
                popupContentsLoadingComplete();
            }
        }
    });
    
    var formData = new FormData();
    if (fileType == "image") {
        formData.append("imgFile", file);
    } else if (fileType == "video") {
        formData.append("file", file);
    }
    formData.append("type", "profile");

    xhr.send(formData);
}
function registerProfileImage() {
    let crop_image = document.getElementById("crop_image_image");
    let info = JSON.parse(document.getElementsByClassName("edit_profile_picture_info")[0].innerHTML);
    let url = crop_image.src;
    let width = info["width"];
    let height = info["height"];

    popupContentsLoading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/user/change_profile.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;

                if (xhrHtml == "file is too big") {
                    actionMessage(getLanguage("change_profile_upload_file_big_message"));
                } else {
                    loginCheck();
                    history.back();
                    actionMessage(getLanguage("change_profile_upload_message"));

                    setTimeout(() => {
                        openPopupContents("change_profile");
                    }, 300);
                }
            } else {
                if (status == 504) {
                    //시간 초과
                    serverResponseErrorMessage(0);
                } else {
                    //오류 발생
                    serverResponseErrorMessage(1);
                }
            }
            popupContentsLoadingComplete();
        }
    });

    let type = "";
    if (crop_image.tagName == "IMG") {
        type = "image";
    } else if (crop_image.tagName == "VIDEO") {
        type = "video";
    }
    
    var formData = new FormData();
    formData.append("type", type);
    formData.append("url", url);
    formData.append("resize", imageUploadResize);
    formData.append("translateY", imageTranslateY);
    formData.append("translateX", imageTranslateX);
    formData.append("width", width);
    formData.append("height", height);
    if (info["thumbnail"] != null) {
        formData.append("thumbnail", info["thumbnail"]);
    }

    xhr.send(formData);
}
function reviseProfileImage() {
    let url = document.getElementById("crop_image_image").src;
    let info = JSON.parse(document.getElementsByClassName("edit_profile_picture_info")[0].innerHTML);
    let width = info["width"];
    let height = info["height"];

    popupContentsLoading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/image/revise.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            popupContentsLoadingComplete();
            resetBackPopupContents();
            setHtmlPopupContents(getHtmlPopupContents_edit_profile_picture(), true);

            loginCheck();
        }
    });
    
    var formData = new FormData();
    formData.append("type", "profile");
    formData.append("url", url);
    formData.append("resize", imageUploadResize);
    formData.append("translateY", imageTranslateY);
    formData.append("translateX", imageTranslateX);
    formData.append("width", width);
    formData.append("height", height);

    xhr.send(formData);
}
function deleteProfileImage() {
    let url = document.getElementById("crop_image_image").src;

    popupContentsLoading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/image/delete.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            popupContentsLoadingComplete();
            resetBackPopupContents();
            setHtmlPopupContents(getHtmlPopupContents_edit_profile_picture(), true);

            loginCheck();
        }
    });
    
    var formData = new FormData();
    formData.append("type", "profile");
    formData.append("url", url);

    xhr.send(formData);
}




function getHtmlPopupContents_image_upload_complete(type, url, width, height, translateX, translateY, resize) {
    let html = '';
    if (resize == null) { resize = 1; }

    let title = getLanguage("edit_profile_picture_title:0");
    if (translateX != null && translateY != null && resize != null) {
        title = getLanguage("edit_profile_picture_title:1");
    }

    setTimeout(() => {
        if (translateX != null && translateY != null) {
            let crop_image_image = document.getElementById("crop_image_image");
            crop_image_image.style.transform = "translate(" + translateX + "%, " + translateY + "%)";
        }
    }, 1);

    //적용 버튼
    let applyButton = "registerProfileImage();";
    let isDelete = "none";
    if (translateX != null && translateY != null && resize != null) {
        applyButton = "reviseProfileImage();";
        isDelete = "flex";
    }

    let profile = "";
    if (type == "image") {
        profile = `<img id = "crop_image_image" width = "` + width + `px" height = "` + height + `px" src = "` + url + `" onload = "imageLoad(event); popupContentsLoadingComplete();">`;
    } else if (type == "video") {
        profile = `<video id = "crop_image_image" autoplay loop muted onplay = "videoLoad(event); popupContentsLoadingComplete();" width = "` + width + `px" height = "` + height + `px" src = "` + url + `"></video>`;
    }

    let data = {
        "width": width,
        "height": height
    };
    if (type == "video") {
        let ext = url.split(".")[3];
        data["thumbnail"] = url.replaceAll("." + ext, ".webp");
    }

    html = `
        <div class = "edit_profile_picture_info" style = "display: none;">
            ` + JSON.stringify(data) + `
        </div>
        <div class = "edit_profile_picture">
            <div class = "popup_contents_top">
                <div class = "popup_contents_top_left md-ripples" onclick = "backPopupContents();" onmouseenter = "hoverInformation(this, getLanguage('popup_contents:back'));">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"></rect><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"></rect></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"></rect></g></svg>
                </div>
                <div class = "popup_contents_top_right">
                    ` + title + `
                </div>
            </div>
            <div class = "crop_image_contents">
                <div class = "crop_image">
                    <div class = "crop_image_img" onpointerdown = "onpointerdown_PopupContents_image_position(event);">
                        ` + profile + `
                        <svg id = "crop_image_image_svg" viewBox="0 0 1 1" style = "z-index: 0; overflow: visible;">
                            <path d = "M -40 -40 L -40 41 L 41 41 L 41 -40 Z M 0 .5 A .5 .5 0 0 0 1 .5 A .5 .5 0 0 0 0 .5" fill = "var(--box-color)" fill-rule = "evenodd" fill-opacity = ".55"></path>
                            <path d = "M -40 -40 L -40 41 L 41 41 L 41 -40 Z M 0 0 L 1 0 L 1 1 L 0 1 Z " fill = "var(--box-color)" fill-rule = "evenodd" fill-opacity = ".55"></path>
                        </svg>
                        <div class = "crop_image_img_resize">
                            <div class = "crop_image_img_resize_stick">
                                <div class = "crop_image_img_resize_stick_top">
                                    <div class = "crop_image_img_resize_stick_item_left" style = "cursor: nw-resize;" onpointerdown = "onpointerdown_PopupContents_image_size(event, 0);">
                                        <div class = "crop_image_img_resize_stick_item_left_1"></div>
                                        <div class = "crop_image_img_resize_stick_item_left_2"></div>
                                    </div>
                                    <div class = "crop_image_img_resize_stick_item_right" style = "cursor: ne-resize;" onpointerdown = "onpointerdown_PopupContents_image_size(event, 1);">
                                        <div class = "crop_image_img_resize_stick_item_right_1"></div>
                                        <div class = "crop_image_img_resize_stick_item_right_2"></div>
                                    </div>
                                </div>
                                <div class = "crop_image_img_resize_stick_bottom">
                                    <div class = "crop_image_img_resize_stick_item_left" style = "cursor: sw-resize;" onpointerdown = "onpointerdown_PopupContents_image_size(event, 2);">
                                        <div class = "crop_image_img_resize_stick_item_left_2"></div>
                                        <div class = "crop_image_img_resize_stick_item_left_1"></div>
                                    </div>
                                    <div class = "crop_image_img_resize_stick_item_right" style = "cursor: se-resize;" onpointerdown = "onpointerdown_PopupContents_image_size(event, 3);">
                                        <div class = "crop_image_img_resize_stick_item_right_1" style = "margin-top: auto;"></div>
                                        <div class = "crop_image_img_resize_stick_item_right_2"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class = "crop_image_wrap">
                        <img width = "1px" height = "1px">
                    </div>
                </div>
            </div>
            <div class = "crop_image_contents_bottom">
                <div style = "min-width: max-content;">
                    <div id = "crop_image_contents_rotation_bottom_reset" class = "crop_image_contents_rotation_bottom md-ripples" onclick = "resetPopupContentsImageUpload();">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M32 12h-12l4.485-4.485c-2.267-2.266-5.28-3.515-8.485-3.515s-6.219 1.248-8.485 3.515c-2.266 2.267-3.515 5.28-3.515 8.485s1.248 6.219 3.515 8.485c2.267 2.266 5.28 3.515 8.485 3.515s6.219-1.248 8.485-3.515c0.189-0.189 0.371-0.384 0.546-0.583l3.010 2.634c-2.933 3.349-7.239 5.464-12.041 5.464-8.837 0-16-7.163-16-16s7.163-16 16-16c4.418 0 8.418 1.791 11.313 4.687l4.687-4.687v12z"></path></svg>
                        ` + getLanguage("edit_profile_picture_button:0") + `
                    </div>
                </div>
                <div style = "margin-left: auto; display: flex; align-items: center; min-width: max-content;">
                    <div class = "crop_image_contents_rotation_bottom crop_image_contents_rotation_bottom_delete md-ripples" onclick = "deleteProfileImage();" style = "margin-left: auto; margin-right: 5px; display: ` + isDelete +  `;">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="50" height="3" rx="1.5" transform="translate(0 11)"></rect><path d="M31,39H5a5.006,5.006,0,0,1-5-5V0H4.932A2,2,0,0,0,3,2V34a2,2,0,0,0,2,2H31a2,2,0,0,0,2-2V2a2,2,0,0,0-1.914-2L36,0V34A5.006,5.006,0,0,1,31,39Z" transform="translate(7 11)"></path><path d="M5,14,0,14V5A5.006,5.006,0,0,1,5,0H21a5.006,5.006,0,0,1,5,5v9H21.007A2,2,0,0,0,23,12V5a2,2,0,0,0-2-2H5A2,2,0,0,0,3,5v7a2,2,0,0,0,2,2H5Z" transform="translate(12)"></path><rect width="3" height="15" rx="1.5" transform="translate(24 22)"></rect><rect width="3" height="15" rx="1.5" transform="translate(33 22)"></rect><rect width="3" height="15" rx="1.5" transform="translate(15 22)"></rect></g></svg>
                        ` + getLanguage("edit_profile_picture_button:1") + `
                    </div>
                    <div class = "crop_image_contents_rotation_bottom md-ripples" style = "margin-left: auto;" onclick = "` + applyButton + `">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5 11-11 2 2-13 13z"></path></svg>
                        ` + getLanguage("edit_profile_picture_button:2") + `
                    </div>
                </div>
            </div>
        </div>
    `;

    //스크롤 비활성화
    popupContentsScroll = false;
    imageUploadResize = resize;

    //값 초기화
    if (translateX != null && translateY != null) {
        imageTranslateY = translateY;
        imageTranslateX = translateX;
    } else {
        imageTranslateY = 0;
        imageTranslateX = 0;
    }

    return html;
}

function resetPopupContentsImageUpload() {
    imageUploadResize = 1;

    let crop_image_image = document.getElementById("crop_image_image");
    crop_image_image.style.transform = "translate(0%, 0%)";

    imageTranslateY = 0;
    imageTranslateX = 0;
}

var imageUploadMaxTranslateY = 0;
var imageUploadMaxTranslateX = 0;
var imageTranslateY = 0;
var imageTranslateX = 0;
var imageMaxTranslate = 0;

var imageUploadResize = 1;

function setPosition_PopupContents_image_upload_complete() {
    let crop_image_wrap = document.getElementsByClassName("crop_image_wrap")[0];
    if (crop_image_wrap == null) { return; }
    let crop_image_image = document.getElementById("crop_image_image");
    let crop_image_img = document.getElementsByClassName("crop_image_img")[0];
    crop_image_img.style.width = crop_image_wrap.clientHeight + "px";
    crop_image_img.style.width = crop_image_wrap.clientWidth + "px";
    crop_image_img.style.height = crop_image_wrap.clientHeight + "px";

    let crop_image_image_svg = document.getElementById("crop_image_image_svg");
    if ((crop_image_image.clientWidth > crop_image_image.clientHeight) == false) {
        crop_image_image.setAttribute("width", crop_image_img.clientWidth + "px");
        crop_image_image.setAttribute("height", "");
        crop_image_image_svg.style.width = (crop_image_image.clientWidth * imageUploadResize) + "px";
        crop_image_image_svg.style.height = (crop_image_image.clientWidth * imageUploadResize) + "px";

        imageMaxTranslate = crop_image_image.clientWidth;
    } else {
        crop_image_image.setAttribute("width", "");
        crop_image_image.setAttribute("height", crop_image_img.clientWidth + "px");
        crop_image_image_svg.style.width = (crop_image_image.clientHeight * imageUploadResize) + "px";
        crop_image_image_svg.style.height = (crop_image_image.clientHeight * imageUploadResize) + "px";

        imageMaxTranslate = crop_image_image.clientHeight;
    }

    let crop_image_img_resize = document.getElementsByClassName("crop_image_img_resize")[0];
    crop_image_img_resize.style.width = crop_image_image_svg.clientHeight + "px";
    crop_image_img_resize.style.height = crop_image_image_svg.clientHeight + "px";

    
    imageUploadMaxTranslateY = (crop_image_image.clientHeight - crop_image_img_resize.clientHeight) / 2;
    imageUploadMaxTranslateX = (crop_image_image.clientWidth - crop_image_img_resize.clientWidth) / 2;

    if (imageUploadMaxTranslateX > 0) {
        imageUploadMaxTranslateX -= 1;
    }

    let translateY = getTranslateY(crop_image_image);
    let translateX = getTranslateX(crop_image_image);

    let reset_button = document.getElementById("crop_image_contents_rotation_bottom_reset");
    if (imageUploadResize == 1 && translateY == 0 && translateX == 0) {
        reset_button.classList.add("crop_image_contents_rotation_bottom_disabled");
    } else {
        reset_button.classList.remove("crop_image_contents_rotation_bottom_disabled");
    }
}

function onpointerdown_PopupContents_image_position(e) {
    if (isCancelPopupContentsImagePosition == true) {
        isCancelPopupContentsImagePosition = false;
        return;
    }

    let y = e.pageY;
    let x = e.pageX;

    let crop_image_image = document.getElementById("crop_image_image");
    let translateY = getTranslateY(crop_image_image);
    let translateX = getTranslateX(crop_image_image);

    function move(event) {
        let moveY = null;
        let moveX = null;
        if (event.type != "touchmove") {
            moveY = event.pageY;
            moveX = event.pageX;
        } else {
            moveY = event.touches[0].pageY;
            moveX = event.touches[0].pageX;
        }
        let distanceY = moveY - y;
        let distanceX = moveX - x;

        let setDistanceY = (distanceY + translateY);
        if (setDistanceY >= imageUploadMaxTranslateY) {
            setDistanceY = imageUploadMaxTranslateY;
        } else if (setDistanceY <= (imageUploadMaxTranslateY * -1)) {
            setDistanceY = (imageUploadMaxTranslateY * -1);
        }

        let setDistanceX = (distanceX + translateX);
        if (setDistanceX >= imageUploadMaxTranslateX) {
            setDistanceX = imageUploadMaxTranslateX;
        } else if (setDistanceX <= (imageUploadMaxTranslateX * -1)) {
            setDistanceX = (imageUploadMaxTranslateX * -1);
        }

        let setTranslateDistanceX = ((setDistanceX / crop_image_image.clientWidth) * 100);
        let setTranslateDistanceY = ((setDistanceY / crop_image_image.clientHeight) * 100);

        imageTranslateY = setTranslateDistanceY;
        imageTranslateX = setTranslateDistanceX;

        crop_image_image.style.transform = "translate(" + setTranslateDistanceX + "%, " + setTranslateDistanceY + "%)";
    }
    function cancel() {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("touchmove", move);
        window.removeEventListener("mouseup", cancel);
        window.removeEventListener("touchend", cancel);
        window.removeEventListener("touchcancel", cancel);
    }

    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move);
    window.addEventListener("mouseup", cancel);
    window.addEventListener("touchend", cancel);
    window.addEventListener("touchcancel", cancel);
}

var isCancelPopupContentsImagePosition = false;

function onpointerdown_PopupContents_image_size(e, startPosition) {
    isCancelPopupContentsImagePosition = true;

    //startPosition
    //0 = top left
    //1 = top right
    //2 = bottom left
    //3 = bottom right

    let y = null;
    let x = null;
    if (startPosition == 2 || startPosition == 3) {
        y = e.pageY;
        x = e.pageX;
    } else {
        y = e.pageY * -1;
        x = e.pageX * -1;
    }

    if (startPosition == 0) {
        y = e.pageY * -1;
        x = e.pageX * -1;
    } else if (startPosition == 1) {
        y = e.pageY * -1;
        x = e.pageX;
    } else if (startPosition == 2) {
        y = e.pageY;
        x = e.pageX * -1;
    } else if (startPosition == 3) {
        y = e.pageY;
        x = e.pageX;
    }

    let previousImageUploadResize = imageUploadResize;

    let crop_image_image = document.getElementById("crop_image_image");
    let translateY = getTranslateY(crop_image_image);
    let translateX = getTranslateX(crop_image_image);

    function move(event) {
        let moveY = null;
        let moveX = null;
        if (event.type != "touchmove") {
            moveY = event.pageY;
            moveX = event.pageX;
        } else {
            moveY = event.touches[0].pageY;
            moveX = event.touches[0].pageX;
        }
        if (startPosition == 0 || startPosition == 1) {
            moveY *= -1;
            moveX *= -1;
        }
        if (startPosition == 1) {
            moveX *= -1;
        } else if (startPosition == 2) {
            moveX *= -1;
        }
        let distanceY = moveY - y;
        let distanceX = moveX - x;

        let distance = distanceX + distanceY;
        let result = ((distance * -1) / imageMaxTranslate);

        imageUploadResize = (previousImageUploadResize - result);
        //최대 값
        if (imageUploadResize > 1) {
            imageUploadResize = 1;
        } else if (imageUploadResize < 0.5) {
            //최소 값
            imageUploadResize = 0.5;
        }

        //오버플로우
        if (translateY >= imageUploadMaxTranslateY) {
            translateY = imageUploadMaxTranslateY;
        } else if (translateY <= (imageUploadMaxTranslateY * -1)) {
            translateY = (imageUploadMaxTranslateY * -1);
        }
    
        if (translateX >= imageUploadMaxTranslateX) {
            translateX = imageUploadMaxTranslateX;
        } else if (translateX <= (imageUploadMaxTranslateX * -1)) {
            translateX = (imageUploadMaxTranslateX * -1);
        }
    
        let setTranslateDistanceX = ((translateX / crop_image_image.clientWidth) * 100);
        let setTranslateDistanceY = ((translateY / crop_image_image.clientHeight) * 100);
    
        crop_image_image.style.transform = "translate(" + setTranslateDistanceX + "%, " + setTranslateDistanceY + "%)";
    }
    function cancel() {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("touchmove", move);
        window.removeEventListener("mouseup", cancel);
        window.removeEventListener("touchend", cancel);
        window.removeEventListener("touchcancel", cancel);
    }

    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move);
    window.addEventListener("mouseup", cancel);
    window.addEventListener("touchend", cancel);
    window.addEventListener("touchcancel", cancel);
}

function getTranslateX(el) {
    var style = window.getComputedStyle(el);
    var matrix = new WebKitCSSMatrix(style.transform);
    return matrix.m41;
}
function getTranslateY(el) {
    if(!window.getComputedStyle) return;
    var style = getComputedStyle(el),
        transform = style.transform || style.webkitTransform || style.mozTransform;
    var mat = transform.match(/^matrix3d\((.+)\)$/);
    if(mat) return parseFloat(mat[1].split(', ')[13]);
    mat = transform.match(/^matrix\((.+)\)$/);
    return mat ? parseFloat(mat[1].split(', ')[5]) : 0;
}