



function checkProfileElement() {
    let el = document.getElementsByClassName("profile_element");

    //생성이 되지 않은 프로필 앨리먼트 생성
    for (let i = 0; i < el.length; i++) {
        let isVisible = isVisibleElement(el[i]);
        if (isVisible == true) {
            let profile_image = el[i].getElementsByClassName("profile_image")[0];

            if (profile_image.innerHTML.trim() == "") {
                let infoHTML = el[i].getElementsByClassName("profile_info")[0].innerHTML;
                if (infoHTML == null || infoHTML == undefined || infoHTML == 'null' || infoHTML == 'undefined') { continue; }
        
                let elRect = el[i].getBoundingClientRect();
    
                let profile_info = JSON.parse(infoHTML);
                let width = elRect.width;
                let height = elRect.height;
                if (width != 0 && height != 0) {
                    profile_image.innerHTML = getHtmlProfile(profile_info, width, height);
                    
                    //기본 프로필 로드 완료
                    (profile_info["type"] == "default") ? showImage(profile_image) : null;
                }
            }
        }
    }
}
function getHtmlProfile(info, width, height) {
    let type = info["type"];
    if (type == "default") {
        return `
            <div class = "default_profile" style = "width: ` + width + `px; height: ` + height + `px; font-size: ` + (height / 2.25) + `px; background-color: ` + info["info"]["random_color"] + `;">
                <div class = "default_profile_text">
                    ` + info["info"]["first_letter"] + `
                </div>
            </div>
        `;
    } else if (type == "custom") {
        info["info"]["width"] = Number.parseInt(info["info"]["width"]);
        info["info"]["height"] = Number.parseInt(info["info"]["height"]);

        let widthImg = "auto";
        let heightImg = "auto";
        let marginLeft = "0px";
        let marginTop = "0px";
        if (info["info"]["width"] > info["info"]["height"]) {
            heightImg = "calc(100% + 2px)";
        } else {
            widthImg = "calc(100% + 2px)";
        }
        let zoom = 2 * info["info"]["resize"];
        zoom = 1 + (2 - zoom);

        let type = info["info"]["type"];
        if (type == "image") {
            return `
                <div class = "profile img_wrap" style = "width: ` + width + `px; height: ` + height + `px;">
                    <img src = "` + info["info"]["url"] + `" width = "` + info["info"]["width"] + `px" height = "` + info["info"]["height"] + `" style = "width: ` + widthImg + `; height: ` + heightImg + `; margin-top: ` + marginTop + `; margin-left: ` + marginLeft + `; transform: translate(` + (info["info"]["translateX"] * zoom) + `%, ` + (info["info"]["translateY"] * zoom) + `%) scale(` + zoom + `);" onload = "imageLoad(event);" alt = "" loading = "lazy">
                </div>
            `;
        } else if (type == "video") {
            return `
                <div class = "profile video_wrap" style = "width: ` + width + `px; height: ` + height + `px;">
                    <video autoplay loop muted onplay = "videoLoad(event);" width = "` + info["info"]["width"] + `px" height = "` + info["info"]["height"] + `" style = "width: ` + widthImg + `; height: ` + heightImg + `; margin-top: ` + marginTop + `; margin-left: ` + marginLeft + `; transform: translate(` + (info["info"]["translateX"] * zoom) + `%, ` + (info["info"]["translateY"] * zoom) + `%) scale(` + zoom + `);" loading = "lazy" src = "` + info["info"]["url"] + `"></video>
                </div>
            `;
        }
    }
    return null;
}






function registerProfileElement() {
    let previousTimestamp = null;
    function callback(timestamp) {
        if (previousTimestamp === timestamp) { return };
        previousTimestamp = timestamp;
        
        checkProfileElement();
        window.requestAnimationFrame(callback);
    }
    window.requestAnimationFrame(callback);
}
registerProfileElement();