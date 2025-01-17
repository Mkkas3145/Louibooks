

/*
    property:
        autoPlay = 자동으로 동영상을 재생할 지
        startTime = 시작될 동영상 시간
        thumbnailImage = 동영상 로드 전 표시되는 이미지
        previous:
            title = 제목
            description = 설명
            thumbnailImage = 미리보기 이미지 URL
            onclick = 클릭시 발생하는 JS 구문
        next:
            title = 제목
            description = 설명
            thumbnailImage = 미리보기 이미지 URL
            onclick = 클릭시 발생하는 JS 구문
*/
function createVideoPlayer(el, info, property) {
    (property == null) ? property = new Array() : null;
    let uniqueNumber = Math.floor(Math.random() * 999999999999);

    (property["previous"] == null) ? property["previous"] = new Array() : null;
    (property["next"] == null) ? property["next"] = new Array() : null;

    let newEl = document.createElement("div");
    newEl.classList.add("video_player_box");
    newEl.setAttribute("unique_number", uniqueNumber);
    let box = el.appendChild(newEl);

    //포커스 여부
    let isBoxFocus = false;
    function checkBoxFocus(event) {
        isBoxFocus = true;
        box.setAttribute("is_focus", true);
    }
    box.addEventListener("click", checkBoxFocus);
    function checkBoxBlur(event) {
        if (document.body.contains(box)) {
            (isBoxFocus == false) ? box.setAttribute("is_focus", false) : isBoxFocus = false;
        } else {
            document.removeEventListener("click", closeContainerSettings);
        }
    }
    document.addEventListener("click", checkBoxBlur);

    let language = property["language"];
    let partNumber = property["partNumber"];
    let isEmbed = (property["embed"] == null) ? false : property["embed"];
    let videoInfo = info;
    let codecsList = videoInfo["codecs"];

    //우선적으로 사용할 코덱
    let preferredCodec = getVideoPlayerSettingsValue("videoCodec");
    
    let codecs = {
        "resolutions": new Array(),
        "preview": null
    };
    function checkCodecs() {
        let useCodec = preferredCodec;
        //압축 효율 우선
        if (useCodec == "auto") {
            if (supportsVideoType("av01") == true) {
                useCodec = "av01";
            } else if (supportsVideoType("vp09") == true) {
                useCodec = "vp09";
            } else if (supportsVideoType("avc1") == true) {
                useCodec = "avc1";
            }
        }
        //성능 우선
        if (useCodec == "performance") {
            useCodec = "avc1";
        }
    
        for (let i = 0; i < codecsList.length; i++) {
            let codecInfo = codecsList[i];
            let codecId = codecInfo["codecId"];
            let isSupports = supportsVideoType(codecId);
    
            if (isSupports == true) {
                let resolutions = codecInfo["resolutions"];
                for (let j = 0; j < resolutions.length; j++) {
                    if (resolutions[j]["status"] == 0 || i == 0) {
                        codecs["resolutions"][j] = resolutions[j];
                        codecs["resolutions"][j]["codecId"] = codecId;
                    }
                }
                let preview = codecInfo["preview"];
                if (preview["status"] == 0 || i == 0) {
                    codecs["preview"] = preview;
                    codecs["preview"]["codecId"] = codecId;
                }
            }
    
            if (useCodec == codecId) {
                break;
            }
        }
    }
    checkCodecs();

    //10초 마다 동영상 데이터 불러오기
    let videoDataCheckInterval = setInterval(() => {
        let isProcessing = false;
        for (let i = 0; i < codecsList.length; i++) {
            let codecInfo = codecsList[i];
            if (codecInfo["status"] != 0) {
                isProcessing = true;
            }
        }
        if (document.body.contains(box) && isProcessing == true) {
            const xhr = new XMLHttpRequest();
            const method = "POST";
            const url = "/php/work/video/getData.php";
        
            xhr.open(method, url);
        
            xhr.addEventListener('readystatechange', function (event) {
                const { target } = event;
                if (target.readyState === XMLHttpRequest.DONE) {
                    const { status } = target;
                    if (status === 0 || (status >= 200 && status < 400)) {
                        let xhrHtml = xhr.responseText;
                        let json = JSON.parse(xhrHtml);
    
                        videoInfo = json;
                        codecsList = videoInfo["codecs"];

                        checkCodecs();
                    }
                }
            });
        
            let formData = new FormData();
            formData.append('partNumber', partNumber);
            formData.append('lang', language);
        
            xhr.send(formData);
        } else {
            clearInterval(videoDataCheckInterval);
        }
    }, (10 * 1000));

    //기본 품질 모드: 0 (자동)
    let resolutionMode = 0;
    if (getCookie("videoPlayerResolutionMode")) {
        resolutionMode = getCookie("videoPlayerResolutionMode");
    }

    let previewUrl = null;
    let previewFramerate = 0;
    let previewAspectRatio = null;
    let resolutionInfo = null;
    if (codecs != null) {
        previewAspectRatio = (codecs["preview"]["width"] / codecs["preview"]["height"]);
        previewUrl = codecs["preview"]["url"];
        previewFramerate = codecs["preview"]["framerate"];
    }

    newEl = document.createElement("div");
    newEl.classList.add("video_player");
    newEl.innerHTML = `
        <video resolution_mode = "` + resolutionMode + `" preload = "metadata" playsinline></video>
        <div class = "video_player_info" style = "display: none;"></div>
        <div class = "video_player_preview">
            <canvas></canvas>
        </div>
        <div class = "video_player_backdrop">
            <div class = "video_player_backdrop_filter">
                <canvas></canvas>
            </div>
        </div>
        <div class = "video_player_thumbnail">
            <img src = "` + property["thumbnailImage"] + `" onload = "imageLoad(event);">
        </div>
        <div class = "video_player_subtitle">
            <div class = "video_player_subtitle_items">
                <!-- item -->
            </div>
        </div>
        <div class = "video_player_container">
            <div class = "video_player_container_loading">
                <div class="showbox"><div class="loader" style="width: 50px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" style = "animation: white_dash 0.6s ease-in-out infinite;" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle></svg></div></div>
            </div>
            <div class = "video_player_container_double_tap">
                <div class = "video_player_container_double_tap_wrap">
                    <div class = "video_player_container_double_tap_box md-ripples" style = "border-top-left-radius: 0px; border-bottom-left-radius: 0px;">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M12.428,4.287a3,3,0,0,1,5.145,0l9.7,16.169A3,3,0,0,1,24.7,25H5.3a3,3,0,0,1-2.572-4.543Z" transform="translate(-3 40) rotate(-90)"/><path d="M12.428,4.287a3,3,0,0,1,5.145,0l9.7,16.169A3,3,0,0,1,24.7,25H5.3a3,3,0,0,1-2.572-4.543Z" transform="translate(25 40) rotate(-90)" opacity="0.5"/></g></svg>
                        <span>...</span>
                    </div>
                </div>
                <div class = "video_player_container_double_tap_wrap" style = "margin-left: auto;">
                    <div class = "video_player_container_double_tap_box md-ripples" style = "margin-left: -100%; border-top-right-radius: 0px; border-bottom-right-radius: 0px;">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M12.428,4.287a3,3,0,0,1,5.145,0l9.7,16.169A3,3,0,0,1,24.7,25H5.3a3,3,0,0,1-2.572-4.543Z" transform="translate(25 10) rotate(90)"/><path d="M12.428,4.287a3,3,0,0,1,5.145,0l9.7,16.169A3,3,0,0,1,24.7,25H5.3a3,3,0,0,1-2.572-4.543Z" transform="translate(53 10) rotate(90)" opacity="0.5"/></g></svg>
                        <span>...</span>
                    </div>
                </div>
            </div>
            <div class = "video_player_container_touch_device_controls">
                <div class = "video_player_container_touch_device_controls_items">
                    <div class = "video_player_container_touch_device_controls_item">
                        <div class = "video_player_container_touch_device_controls_item_button md-ripples" onclick = "` + property["previous"]["onclick"] + `" style = "width: 40px; height: 40px; left: 20px;">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="a"><rect width="50" height="50"/></clipPath></defs><g id="b" clip-path="url(#a)"><g transform="translate(50 50) rotate(180)" clip-path="url(#a)"><rect width="14" height="44" rx="3" transform="translate(33 3)"/><path d="M19.581,3.3a3,3,0,0,1,4.838,0L40.5,25.226A3,3,0,0,1,38.08,30H5.92A3,3,0,0,1,3.5,25.226Z" transform="translate(33 3) rotate(90)"/></g></g></svg>
                        </div>
                    </div>
                    <div class = "video_player_container_touch_device_controls_item">
                        <div class = "video_player_container_touch_device_controls_item_button md-ripples" onclick = "togglePlayAndPauseVideoPlayer(` + uniqueNumber + `);" is_play = "false" style = "width: 60px; height: 60px;">
                            <div class = "video_player_container_touch_device_controls_item_button_0">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M22.406,4.461a3,3,0,0,1,5.187,0L47.379,38.492A3,3,0,0,1,44.786,43H5.214a3,3,0,0,1-2.594-4.508Z" transform="translate(50) rotate(90)"/></g></svg>
                            </div>
                            <div class = "video_player_container_touch_device_controls_item_button_1">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="15" height="44" rx="3" transform="translate(3 3)"/><rect width="15" height="44" rx="3" transform="translate(32 3)"/></g></svg>
                            </div>
                            <div class = "video_player_container_touch_device_controls_item_button_2">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-215.993,50a24.843,24.843,0,0,0,9.731-1.965,24.918,24.918,0,0,0,7.947-5.358,24.918,24.918,0,0,0,5.358-7.947A24.843,24.843,0,0,0-190.993,25a24.843,24.843,0,0,0-1.965-9.731,24.918,24.918,0,0,0-5.358-7.947,24.918,24.918,0,0,0-7.947-5.358A24.843,24.843,0,0,0-215.993,0a24.958,24.958,0,0,0-12.922,3.595A25.124,25.124,0,0,0-237.93,13h8.532a18.029,18.029,0,0,1,13.4-6,18.02,18.02,0,0,1,18,18,18.02,18.02,0,0,1-18,18,17.987,17.987,0,0,1-16.583-11H-240a24.857,24.857,0,0,0,3.429,7.2,25.1,25.1,0,0,0,5.444,5.7A24.773,24.773,0,0,0-215.993,50Z" transform="translate(240.993)"/><path d="M269.093,0,290,20.907H269.093Z" transform="translate(-269.093)"/></g></svg>
                            </div>
                        </div>
                    </div>
                    <div class = "video_player_container_touch_device_controls_item">
                        <div class = "video_player_container_touch_device_controls_item_button md-ripples" onclick = "` + property["next"]["onclick"] + `" style = "width: 40px; height: 40px; right: 20px;">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="14" height="44" rx="3" transform="translate(33 3)"></rect><path d="M19.581,3.3a3,3,0,0,1,4.838,0L40.5,25.226A3,3,0,0,1,38.08,30H5.92A3,3,0,0,1,3.5,25.226Z" transform="translate(33 3) rotate(90)"></path></g></svg>
                        </div>
                    </div>
                </div>
            </div>
            <div class = "video_player_container_effect_items"></div>
            <div class = "video_player_container_sound">
                <div class = "video_player_container_sound_lines">
                    <div class = "video_player_container_sound_line"></div>
                    <div class = "video_player_container_sound_icon_wrap video_player_container_sound_icon">
                        <div class = "video_player_container_sound_icon_0">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3.771" height="23.881" rx="1.885" transform="translate(30.447 18.388) rotate(-45)"/><rect width="3.771" height="23.881" rx="1.885" transform="translate(33.114 35.274) rotate(-135)"/><path d="M-217.414,48.586-227,39h-10a3,3,0,0,1-3-3V18a3,3,0,0,1,3-3h8l11.586-11.586A2,2,0,0,1-214,4.829V47.172a2,2,0,0,1-2.014,2A1.958,1.958,0,0,1-217.414,48.586Z" transform="translate(240 -1)"/></g></svg>
                        </div>
                        <div class = "video_player_container_sound_icon_1">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(2.622 -2)"><path d="M18,36.625a2.2,2.2,0,0,1-1.66-.784,2.952,2.952,0,0,1,0-3.787,12.815,12.815,0,0,0,0-16.414,2.952,2.952,0,0,1,0-3.787,2.147,2.147,0,0,1,3.318,0,18.729,18.729,0,0,1,0,23.991,2.2,2.2,0,0,1-1.66.784Z" transform="translate(12.301 3.155)"/></g><path d="M-217.414,48.586-227,39h-10a3,3,0,0,1-3-3V18a3,3,0,0,1,3-3h8l11.586-11.586A2,2,0,0,1-214,4.829V47.172a2,2,0,0,1-2.014,2A1.958,1.958,0,0,1-217.414,48.586Z" transform="translate(240 -1)"/></g></svg>
                        </div>
                        <div class = "video_player_container_sound_icon_2">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-217.414,48.586-227,39h-10a3,3,0,0,1-3-3V18a3,3,0,0,1,3-3h8l11.586-11.586A2,2,0,0,1-214,4.829V47.172a2,2,0,0,1-2.014,2A1.958,1.958,0,0,1-217.414,48.586Z" transform="translate(240 -1)"/><g transform="translate(2.622 -2)"><path d="M26.338,41.675a2.2,2.2,0,0,1-1.66-.784,2.952,2.952,0,0,1,0-3.787,20.7,20.7,0,0,0,0-26.516,2.952,2.952,0,0,1,0-3.787A2.147,2.147,0,0,1,28,6.8a25.769,25.769,0,0,1,6.185,17.046A25.769,25.769,0,0,1,28,40.893a2.2,2.2,0,0,1-1.66.784h0ZM18,36.625a2.2,2.2,0,0,1-1.66-.784,2.952,2.952,0,0,1,0-3.787,12.815,12.815,0,0,0,0-16.414,2.952,2.952,0,0,1,0-3.787,2.147,2.147,0,0,1,3.318,0,18.729,18.729,0,0,1,0,23.991,2.2,2.2,0,0,1-1.66.784Z" transform="translate(12.301 3.155)"/></g></g></svg>
                        </div>
                    </div>
                </div>
            </div>
            <div class = "video_player_container_controls_wrap">
                <div class = "video_player_container_controls_top">
                    <div class = "video_player_container_controls_top_left md-ripples" onclick = " (document.fullscreenElement != null) ? document.exitFullscreen() : toggleTheaterModeVideoPlayer(` + uniqueNumber + `);">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25.207,46.292a1.5,1.5,0,0,1-1.061-.439L1.188,22.895a1.5,1.5,0,0,1,2.121-2.121l21.9,21.9,21.9-21.9a1.5,1.5,0,1,1,2.121,2.121L26.268,45.853A1.5,1.5,0,0,1,25.207,46.292Z" transform="translate(-0.207 -8.313)"/></g></svg>
                    </div>
                    <div class = "video_player_container_controls_top_icon md-ripples">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M22.406,4.461a3,3,0,0,1,5.187,0L47.379,38.492A3,3,0,0,1,44.786,43H5.214a3,3,0,0,1-2.594-4.508Z" transform="translate(50) rotate(90)"></path></g></svg>
                    </div>
                    <div class = "video_player_container_controls_top_right">
                        <div class = "video_player_container_controls_top_right_title">
                            ` + property["videoTitle"] + `
                        </div>
                        <div class = "video_player_container_controls_top_right_description">
                            ` + (property["workTitle"] + (" · <b>" + property["chapterTitle"] + "</b>")) + `
                        </div>
                    </div>
                </div>
                <div class = "video_player_container_controls_accessibility">
                    <div class = "video_player_container_controls_accessibility_items">
                        <div class = "video_player_container_controls_accessibility_wrap" style = "justify-content: start; padding-right: 10px;">
                            <div class = "video_player_container_controls_accessibility_item md-ripples" onclick = "getVideoPlayerElement(` + uniqueNumber + `).getElementsByTagName('video')[0].currentTime -= 60;">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M12.428,4.287a3,3,0,0,1,5.145,0l9.7,16.169A3,3,0,0,1,24.7,25H5.3a3,3,0,0,1-2.572-4.543Z" transform="translate(-3 40) rotate(-90)"/><path d="M12.428,4.287a3,3,0,0,1,5.145,0l9.7,16.169A3,3,0,0,1,24.7,25H5.3a3,3,0,0,1-2.572-4.543Z" transform="translate(25 40) rotate(-90)" opacity="0.5"/></g></svg>
                                <span>` + getTimeText(60) + `</span>
                            </div>
                            <div class = "video_player_container_controls_accessibility_item md-ripples" onclick = "getVideoPlayerElement(` + uniqueNumber + `).getElementsByTagName('video')[0].currentTime -= 30;">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M12.428,4.287a3,3,0,0,1,5.145,0l9.7,16.169A3,3,0,0,1,24.7,25H5.3a3,3,0,0,1-2.572-4.543Z" transform="translate(-3 40) rotate(-90)"/><path d="M12.428,4.287a3,3,0,0,1,5.145,0l9.7,16.169A3,3,0,0,1,24.7,25H5.3a3,3,0,0,1-2.572-4.543Z" transform="translate(25 40) rotate(-90)" opacity="0.5"/></g></svg>
                                <span>` + getTimeText(30) + `</span>
                            </div>
                            <div class = "video_player_container_controls_accessibility_item md-ripples" onclick = "getVideoPlayerElement(` + uniqueNumber + `).getElementsByTagName('video')[0].currentTime -= 5;">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M12.428,4.287a3,3,0,0,1,5.145,0l9.7,16.169A3,3,0,0,1,24.7,25H5.3a3,3,0,0,1-2.572-4.543Z" transform="translate(-3 40) rotate(-90)"/><path d="M12.428,4.287a3,3,0,0,1,5.145,0l9.7,16.169A3,3,0,0,1,24.7,25H5.3a3,3,0,0,1-2.572-4.543Z" transform="translate(25 40) rotate(-90)" opacity="0.5"/></g></svg>
                                <span>` + getTimeText(5) + `</span>
                            </div>
                        </div>
                        <div class = "video_player_container_controls_accessibility_wrap" style = "justify-content: end; padding-left: 10px;">
                            <div class = "video_player_container_controls_accessibility_item md-ripples" onclick = "getVideoPlayerElement(` + uniqueNumber + `).getElementsByTagName('video')[0].currentTime += 5;">
                                <span>` + getTimeText(5) + `</span>
                                <svg style = "margin-left: 10px; margin-right: 0px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M12.428,4.287a3,3,0,0,1,5.145,0l9.7,16.169A3,3,0,0,1,24.7,25H5.3a3,3,0,0,1-2.572-4.543Z" transform="translate(25 10) rotate(90)"/><path d="M12.428,4.287a3,3,0,0,1,5.145,0l9.7,16.169A3,3,0,0,1,24.7,25H5.3a3,3,0,0,1-2.572-4.543Z" transform="translate(53 10) rotate(90)" opacity="0.5"/></g></svg>
                            </div>
                            <div class = "video_player_container_controls_accessibility_item md-ripples" onclick = "getVideoPlayerElement(` + uniqueNumber + `).getElementsByTagName('video')[0].currentTime += 30;">
                                <span>` + getTimeText(30) + `</span>
                                <svg style = "margin-left: 10px; margin-right: 0px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M12.428,4.287a3,3,0,0,1,5.145,0l9.7,16.169A3,3,0,0,1,24.7,25H5.3a3,3,0,0,1-2.572-4.543Z" transform="translate(25 10) rotate(90)"/><path d="M12.428,4.287a3,3,0,0,1,5.145,0l9.7,16.169A3,3,0,0,1,24.7,25H5.3a3,3,0,0,1-2.572-4.543Z" transform="translate(53 10) rotate(90)" opacity="0.5"/></g></svg>
                            </div>
                            <div class = "video_player_container_controls_accessibility_item md-ripples" onclick = "getVideoPlayerElement(` + uniqueNumber + `).getElementsByTagName('video')[0].currentTime += 60;">
                                <span>` + getTimeText(60) + `</span>
                                <svg style = "margin-left: 10px; margin-right: 0px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M12.428,4.287a3,3,0,0,1,5.145,0l9.7,16.169A3,3,0,0,1,24.7,25H5.3a3,3,0,0,1-2.572-4.543Z" transform="translate(25 10) rotate(90)"/><path d="M12.428,4.287a3,3,0,0,1,5.145,0l9.7,16.169A3,3,0,0,1,24.7,25H5.3a3,3,0,0,1-2.572-4.543Z" transform="translate(53 10) rotate(90)" opacity="0.5"/></g></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div class = "video_player_container_controls_hover_message">
                    <div class = "video_player_container_controls_hover_message_items">
                        <!-- item -->
                    </div>
                </div>
                <div class = "video_player_container_controls_progress">
                    <div class = "video_player_container_controls_progress_wrap">
                        <div class = "video_player_container_controls_progress_lines">
                            <div class = "video_player_container_controls_progress_line" style = "background-color: #ffffff60;"></div>
                            <div class = "video_player_container_controls_progress_line" style = "background-color: #ffffffaa; display: none;"></div>
                            <div class = "video_player_container_controls_progress_line" style = "background-color: #ff0000;"></div>
                            <div class = "video_player_container_controls_progress_circle"></div>
                        </div>
                    </div>
                </div>
                <div class = "video_player_container_controls">
                    <div class = "video_player_container_controls_items">
                        <div class = "video_player_container_controls_items_left">
                            <div class = "video_player_container_controls_item md-ripples" hover_text = "` + getLanguage("video_player_controls_button:previous") + `" onclick = "` + property["previous"]["onclick"] + `">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="a"><rect width="50" height="50"/></clipPath></defs><g id="b" clip-path="url(#a)"><g transform="translate(50 50) rotate(180)" clip-path="url(#a)"><rect width="14" height="44" rx="3" transform="translate(33 3)"/><path d="M19.581,3.3a3,3,0,0,1,4.838,0L40.5,25.226A3,3,0,0,1,38.08,30H5.92A3,3,0,0,1,3.5,25.226Z" transform="translate(33 3) rotate(90)"/></g></g></svg>
                            </div>
                            <div class = "video_player_container_controls_item md-ripples video_player_container_play_and_pause_icon">
                                <div class = "video_player_container_play_and_pause_icon_0" hover_text = "` + getLanguage("video_player_controls_button:play") + `" hotkey = "_">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M22.406,4.461a3,3,0,0,1,5.187,0L47.379,38.492A3,3,0,0,1,44.786,43H5.214a3,3,0,0,1-2.594-4.508Z" transform="translate(50) rotate(90)"/></g></svg>
                                </div>
                                <div class = "video_player_container_play_and_pause_icon_1" hover_text = "` + getLanguage("video_player_controls_button:pause") + `" hotkey = "_">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="15" height="44" rx="3" transform="translate(3 3)"/><rect width="15" height="44" rx="3" transform="translate(32 3)"/></g></svg>
                                </div>
                                <div class = "video_player_container_play_and_pause_icon_2" hover_text = "` + getLanguage("video_player_controls_button:replay") + `" hotkey = "_">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-215.993,50a24.843,24.843,0,0,0,9.731-1.965,24.918,24.918,0,0,0,7.947-5.358,24.918,24.918,0,0,0,5.358-7.947A24.843,24.843,0,0,0-190.993,25a24.843,24.843,0,0,0-1.965-9.731,24.918,24.918,0,0,0-5.358-7.947,24.918,24.918,0,0,0-7.947-5.358A24.843,24.843,0,0,0-215.993,0a24.958,24.958,0,0,0-12.922,3.595A25.124,25.124,0,0,0-237.93,13h8.532a18.029,18.029,0,0,1,13.4-6,18.02,18.02,0,0,1,18,18,18.02,18.02,0,0,1-18,18,17.987,17.987,0,0,1-16.583-11H-240a24.857,24.857,0,0,0,3.429,7.2,25.1,25.1,0,0,0,5.444,5.7A24.773,24.773,0,0,0-215.993,50Z" transform="translate(240.993)"/><path d="M269.093,0,290,20.907H269.093Z" transform="translate(-269.093)"/></g></svg>
                                </div>
                            </div>
                            <div class = "video_player_container_controls_item md-ripples" hover_text = "` + getLanguage("video_player_controls_button:next") + `" onclick = "` + property["next"]["onclick"] + `">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="14" height="44" rx="3" transform="translate(33 3)"/><path d="M19.581,3.3a3,3,0,0,1,4.838,0L40.5,25.226A3,3,0,0,1,38.08,30H5.92A3,3,0,0,1,3.5,25.226Z" transform="translate(33 3) rotate(90)"/></g></svg>
                            </div>
                            <div class = "video_player_container_controls_item md-ripples video_player_container_sound_icon" sound = "0" onclick = "toggleMuteVideoPlayer(` + uniqueNumber + `);">
                                <div class = "video_player_container_sound_icon_0" hover_text = "` + getLanguage("video_player_controls_button:unmute") + `" hotkey = "m">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3.771" height="23.881" rx="1.885" transform="translate(30.447 18.388) rotate(-45)"/><rect width="3.771" height="23.881" rx="1.885" transform="translate(33.114 35.274) rotate(-135)"/><path d="M-217.414,48.586-227,39h-10a3,3,0,0,1-3-3V18a3,3,0,0,1,3-3h8l11.586-11.586A2,2,0,0,1-214,4.829V47.172a2,2,0,0,1-2.014,2A1.958,1.958,0,0,1-217.414,48.586Z" transform="translate(240 -1)"/></g></svg>
                                </div>
                                <div class = "video_player_container_sound_icon_1" hover_text = "` + getLanguage("video_player_controls_button:mute") + `" hotkey = "m">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(2.622 -2)"><path d="M18,36.625a2.2,2.2,0,0,1-1.66-.784,2.952,2.952,0,0,1,0-3.787,12.815,12.815,0,0,0,0-16.414,2.952,2.952,0,0,1,0-3.787,2.147,2.147,0,0,1,3.318,0,18.729,18.729,0,0,1,0,23.991,2.2,2.2,0,0,1-1.66.784Z" transform="translate(12.301 3.155)"/></g><path d="M-217.414,48.586-227,39h-10a3,3,0,0,1-3-3V18a3,3,0,0,1,3-3h8l11.586-11.586A2,2,0,0,1-214,4.829V47.172a2,2,0,0,1-2.014,2A1.958,1.958,0,0,1-217.414,48.586Z" transform="translate(240 -1)"/></g></svg>
                                </div>
                                <div class = "video_player_container_sound_icon_2" hover_text = "` + getLanguage("video_player_controls_button:mute") + `" hotkey = "m">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-217.414,48.586-227,39h-10a3,3,0,0,1-3-3V18a3,3,0,0,1,3-3h8l11.586-11.586A2,2,0,0,1-214,4.829V47.172a2,2,0,0,1-2.014,2A1.958,1.958,0,0,1-217.414,48.586Z" transform="translate(240 -1)"/><g transform="translate(2.622 -2)"><path d="M26.338,41.675a2.2,2.2,0,0,1-1.66-.784,2.952,2.952,0,0,1,0-3.787,20.7,20.7,0,0,0,0-26.516,2.952,2.952,0,0,1,0-3.787A2.147,2.147,0,0,1,28,6.8a25.769,25.769,0,0,1,6.185,17.046A25.769,25.769,0,0,1,28,40.893a2.2,2.2,0,0,1-1.66.784h0ZM18,36.625a2.2,2.2,0,0,1-1.66-.784,2.952,2.952,0,0,1,0-3.787,12.815,12.815,0,0,0,0-16.414,2.952,2.952,0,0,1,0-3.787,2.147,2.147,0,0,1,3.318,0,18.729,18.729,0,0,1,0,23.991,2.2,2.2,0,0,1-1.66.784Z" transform="translate(12.301 3.155)"/></g></g></svg>
                                </div>
                            </div>
                            <div class = "video_player_container_controls_sound_wrap">
                                <div class = "video_player_container_controls_sound_lines">
                                    <div class = "video_player_container_controls_sound_line"></div>
                                    <div class = "video_player_container_controls_sound_circle"></div>
                                </div>
                            </div>
                            <div class = "video_player_container_controls_time">
                                0:00 / 0:00
                            </div>
                        </div>
                        <div class = "video_player_container_controls_items_right">
                            <div class = "video_player_container_controls_item md-ripples" hover_text = "` + getLanguage("video_player_controls_button:subtitles:not_available") + `" hotkey = "c">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-1045.942,49.527h-27.945a3,3,0,0,1-3-3V18.582l8.944,8.944h-1.944a3,3,0,0,0-3,3,3,3,0,0,0,3,3h7.944l7.056,7.056a2.989,2.989,0,0,0,2.944,2.944l6,6Zm-23.944-12a3,3,0,0,0-3,3,3,3,0,0,0,3,3h7a3,3,0,0,0,3-3,3,3,0,0,0-3-3Zm43,1.407,0,0-5.7-5.7a3.02,3.02,0,0,0,1.7-2.7,3,3,0,0,0-3-3h-4.407l-20-20h28.406a3,3,0,0,1,3,3V38.933Z" transform="translate(1076.887 -3.527)"/><rect width="6" height="66" rx="3" transform="translate(-0.102 3.433) rotate(-45)"/></g></svg>
                            </div>
                            <div class = "video_player_container_controls_item md-ripples" hover_text = "` + getLanguage("video_player_controls_button:settings") + `">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-1177.556,50a3,3,0,0,1-3-3l-.575-5.355A17.877,17.877,0,0,1-1185.569,39l-5.511,2.12a3,3,0,0,1-4.1-1.1l-3-5.2a3,3,0,0,1,1.1-4.1l4.874-3.558.074-.042a18.306,18.306,0,0,1-.124-2.131,18.306,18.306,0,0,1,.124-2.131l-.074-.042-4.723-3.82a3,3,0,0,1-1.1-4.1l3-5.2a3,3,0,0,1,4.1-1.1l5.368,2.375a17.867,17.867,0,0,1,4.463-2.65l.842-5.341a3,3,0,0,1,3-3h6a3,3,0,0,1,3,3l.562,5.229a17.857,17.857,0,0,1,4.653,2.69l5.308-2.042a3,3,0,0,1,4.1,1.1l3,5.2a3,3,0,0,1-1.1,4.1l-4.67,3.41a18.276,18.276,0,0,1,.147,2.321,18.276,18.276,0,0,1-.149,2.336l4.521,3.656a3,3,0,0,1,1.1,4.1l-3,5.2a3,3,0,0,1-4.1,1.1l-5.173-2.289a17.859,17.859,0,0,1-4.678,2.693l-.822,5.212a3,3,0,0,1-3,3Zm-5.7-25a9.01,9.01,0,0,0,9,9,9.01,9.01,0,0,0,9-9,9.01,9.01,0,0,0-9-9A9.01,9.01,0,0,0-1183.255,25Z" transform="translate(1199.255)"/></g></svg>
                            </div>
                            <div class = "video_player_container_controls_item_settings">
                                <div class = "video_player_container_controls_item_settings_text"></div>
                            </div>
                            <div class = "video_player_container_controls_item md-ripples">
                                <div class = "video_player_container_controls_item_false" hover_text = "` + getLanguage("video_player_controls_button:pip_mode:on") + `">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="6" height="42" rx="3" transform="translate(50 46) rotate(180)"/><rect width="6" height="50" rx="3" transform="translate(0 10) rotate(-90)"/><rect width="6" height="42" rx="3" transform="translate(0 4)"/><rect width="6" height="50" rx="3" transform="translate(0 46) rotate(-90)"/><rect width="15" height="12" rx="2" transform="translate(25 24)"/></g></svg>
                                </div>
                                <div class = "video_player_container_controls_item_true" hover_text = "` + getLanguage("video_player_controls_button:pip_mode:off") + `">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="a"><path d="M1355,30.083s6.409,6.248,6.247,6.292-.231-20.692-.231-20.692H1355Z" transform="translate(-1320)" fill="#fff"/></clipPath><clipPath id="b"><path d="M1355,30l7.137,7.137h-21.492V30Z" transform="translate(-1320)" fill="red"/></clipPath><clipPath id="d"><rect width="50" height="50"/></clipPath></defs><g id="c" clip-path="url(#d)"><g clip-path="url(#a)"><rect width="6" height="19" rx="3" transform="translate(41 36) rotate(180)"/></g><rect width="6" height="42" rx="3" transform="translate(50 46) rotate(180)"/><rect width="6" height="50" rx="3" transform="translate(0 10) rotate(-90)"/><rect width="6" height="42" rx="3" transform="translate(0 4)"/><rect width="6" height="50" rx="3" transform="translate(0 46) rotate(-90)"/><g clip-path="url(#b)"><rect width="6" height="19" rx="3" transform="translate(41 30) rotate(90)"/></g></g></svg>
                                </div>
                            </div>
                            <div class = "video_player_container_controls_item md-ripples" onclick = "toggleTheaterModeVideoPlayer(` + uniqueNumber + `);">
                                <div class = "video_player_container_controls_item_false" hover_text = "` + getLanguage("video_player_controls_button:theater_mode:on") + `" hotkey = "t">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M50,8V5a2,2,0,0,0-2-2H2A2,2,0,0,0,0,5V8H5v5H0v5H5v5H0v5H5v5H0v3a2,2,0,0,0,2,2h14.24v4.407H34.117V38H48a2,2,0,0,0,2-2V33H45V28h5V23H45V18h5V13H45V8h5ZM20,28V13l12.5,7.5Z" transform="translate(0 2.297)"/></g></svg>
                                </div>
                                <div class = "video_player_container_controls_item_true" hover_text = "` + getLanguage("video_player_controls_button:theater_mode:off") + `" hotkey = "t">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M35.025,21.191,19.176,30.232V12.041ZM46.408,34.807V7.575H5.56V34.807ZM46.408,3a4.541,4.541,0,0,1,4.575,4.575l-.107,27.232a4.542,4.542,0,0,1-4.468,4.468H35.025V43.85H16.941V39.275H5.558A4.509,4.509,0,0,1,2.313,38a4.242,4.242,0,0,1-1.33-3.191V7.575A4.415,4.415,0,0,1,2.313,4.33,4.415,4.415,0,0,1,5.558,3H46.406Z" transform="translate(-0.983 1.575)"/></g></svg>
                                </div>
                            </div>
                            <div class = "video_player_container_controls_item md-ripples">
                                <div class = "video_player_container_controls_item_false" hover_text = "` + getLanguage("video_player_controls_button:full_screen:on") + `" hotkey = "f">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="6" height="18" rx="3"/><rect width="6" height="18" rx="3" transform="translate(0 6) rotate(-90)"/><rect width="6" height="18" rx="3" transform="translate(0 50) rotate(-90)"/><rect width="6" height="18" rx="3" transform="translate(6 50) rotate(-180)"/><rect width="6" height="18" rx="3" transform="translate(50 50) rotate(-180)"/><rect width="6" height="18" rx="3" transform="translate(50 44) rotate(90)"/><rect width="6" height="18" rx="3" transform="translate(50) rotate(90)"/><rect width="6" height="18" rx="3" transform="translate(44)"/></g></svg>
                                </div>
                                <div class = "video_player_container_controls_item_true" hover_text = "` + getLanguage("video_player_controls_button:full_screen:off") + `" hotkey = "f">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="6" height="18" rx="3" transform="translate(18 18) rotate(180)"/><rect width="6" height="18" rx="3" transform="translate(18 12) rotate(90)"/><rect width="6" height="18" rx="3" transform="translate(18 32) rotate(90)"/><rect width="6" height="18" rx="3" transform="translate(12 32)"/><rect width="6" height="18" rx="3" transform="translate(32 32)"/><rect width="6" height="18" rx="3" transform="translate(32 38) rotate(-90)"/><rect width="6" height="18" rx="3" transform="translate(32 18) rotate(-90)"/><rect width="6" height="18" rx="3" transform="translate(38 18) rotate(180)"/></g></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class = "video_player_container_controls_preview">
                    <div class = "video_player_container_controls_preview_box">
                        <div class = "video_player_container_controls_preview_box_screen">
                            <video src = "` + previewUrl + `" crossorigin = "anonymous" preload = "auto" muted></video>
                            <canvas></canvas>
                            <div class = "video_player_container_controls_preview_box_detailed">
                                <video crossorigin = "anonymous" preload = "none" muted></video>
                            </div>
                        </div>
                        <div class = "video_player_container_controls_preview_box_time">
                            0:00
                        </div>
                    </div>
                </div>
            </div>
            <div class = "video_player_container_statistics">
                <div class = "video_player_container_statistics_box scroll">
                    <div class = "video_player_container_statistics_top">
                        <div class = "video_player_container_statistics_top_left">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0.69 11.331l1.363 0.338 1.026-1.611-1.95-0.482c-0.488-0.121-0.981 0.174-1.102 0.66-0.121 0.483 0.175 0.973 0.663 1.095zM18.481 11.592l-4.463 4.016-5.247-4.061c-0.1-0.076-0.215-0.133-0.338-0.162l-0.698-0.174-1.027 1.611 1.1 0.273 5.697 4.408c0.166 0.127 0.362 0.189 0.559 0.189 0.219 0 0.438-0.078 0.609-0.232l5.028-4.527c0.372-0.334 0.401-0.906 0.064-1.277s-0.911-0.4-1.284-0.064zM8.684 7.18l4.887 3.129c0.413 0.264 0.961 0.154 1.24-0.246l5.027-7.242c0.286-0.412 0.183-0.977-0.231-1.26-0.414-0.285-0.979-0.182-1.265 0.23l-4.528 6.521-4.916-3.147c-0.204-0.131-0.451-0.174-0.688-0.123-0.236 0.053-0.442 0.197-0.571 0.4l-7.497 11.767c-0.27 0.422-0.144 0.983 0.28 1.25 0.15 0.096 0.319 0.141 0.486 0.141 0.301 0 0.596-0.149 0.768-0.42l7.008-11z"></path></svg>
                            ` + getLanguage("video_player_context_menu:statistics") + `
                        </div>
                        <div class = "video_player_container_statistics_top_right_wrap">
                            <div class = "video_player_container_statistics_top_right md-ripples">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="66.708" rx="1.5" transform="translate(47.17 0) rotate(45)"></rect><rect width="3" height="66.708" rx="1.5" transform="translate(50 47.17) rotate(135)"></rect></g></svg>
                            </div>
                        </div>
                    </div>
                    <div class = "video_player_container_statistics_line"></div>
                    <div class = "video_player_container_statistics_items">
                        <div class = "video_player_container_statistics_item">
                            <div class = "video_player_container_statistics_item_title">
                                ` + getLanguage("video_player_statistics:video_id") + `:
                            </div>
                            <div class = "video_player_container_statistics_item_value">
                                ` + videoInfo["videoId"] + `
                            </div>
                        </div>
                        <div class = "video_player_container_statistics_item">
                            <div class = "video_player_container_statistics_item_title">
                                ` + getLanguage("video_player_statistics:viewport") + `:
                            </div>
                            <div class = "video_player_container_statistics_item_value">
                                ...
                            </div>
                        </div>
                        <div class = "video_player_container_statistics_item">
                            <div class = "video_player_container_statistics_item_title">
                                ` + getLanguage("video_player_statistics:content_loudness") + `:
                            </div>
                            <div class = "video_player_container_statistics_item_value">
                                ...
                            </div>
                        </div>
                        <div class = "video_player_container_statistics_item">
                            <div class = "video_player_container_statistics_item_title">
                                ` + getLanguage("video_player_statistics:video_frames") + `:
                            </div>
                            <div class = "video_player_container_statistics_item_value">
                                ...
                            </div>
                        </div>
                        <div class = "video_player_container_statistics_item">
                            <div class = "video_player_container_statistics_item_title">
                                ` + getLanguage("video_player_statistics:resolution") + `:
                            </div>
                            <div class = "video_player_container_statistics_item_value">
                                ...
                            </div>
                        </div>
                        <div class = "video_player_container_statistics_item">
                            <div class = "video_player_container_statistics_item_title">
                                ` + getLanguage("video_player_statistics:codec") + `:
                            </div>
                            <div class = "video_player_container_statistics_item_value">
                                ...
                            </div>
                        </div>
                        <div class = "video_player_container_statistics_item">
                            <div class = "video_player_container_statistics_item_title">
                                ` + getLanguage("video_player_statistics:encoder") + `:
                            </div>
                            <div class = "video_player_container_statistics_item_value">
                                ...
                            </div>
                        </div>
                        <div class = "video_player_container_statistics_item">
                            <div class = "video_player_container_statistics_item_title">
                                ` + getLanguage("video_player_statistics:progress") + `:
                            </div>
                            <div class = "video_player_container_statistics_item_value">
                                ...
                            </div>
                        </div>
                        <div class = "video_player_container_statistics_item">
                            <div class = "video_player_container_statistics_item_title">
                                ` + getLanguage("video_player_statistics:pixel_format") + `:
                            </div>
                            <div class = "video_player_container_statistics_item_value">
                                ...
                            </div>
                        </div>
                        <div class = "video_player_container_statistics_item">
                            <div class = "video_player_container_statistics_item_title">
                                ` + getLanguage("video_player_statistics:color") + `:
                            </div>
                            <div class = "video_player_container_statistics_item_value">
                                ...
                            </div>
                        </div>
                        <div class = "video_player_container_statistics_item">
                            <div class = "video_player_container_statistics_item_title">
                                ` + getLanguage("video_player_statistics:video_status") + `:
                            </div>
                            <div class = "video_player_container_statistics_item_value">
                                ...
                            </div>
                        </div>
                        <div class = "video_player_container_statistics_item">
                            <div class = "video_player_container_statistics_item_title">
                                ` + getLanguage("video_player_statistics:video_bitrate") + `:
                            </div>
                            <div class = "video_player_container_statistics_item_value">
                                ...
                            </div>
                        </div>
                        <div class = "video_player_container_statistics_item">
                            <div class = "video_player_container_statistics_item_title">
                                ` + getLanguage("video_player_statistics:audio_bitrate") + `:
                            </div>
                            <div class = "video_player_container_statistics_item_value">
                                ...
                            </div>
                        </div>
                        <div class = "video_player_container_statistics_item">
                            <div class = "video_player_container_statistics_item_title">
                                ` + getLanguage("video_player_statistics:audio_channels") + `:
                            </div>
                            <div class = "video_player_container_statistics_item_value">
                                ...
                            </div>
                        </div>
                        <div class = "video_player_container_statistics_item">
                            <div class = "video_player_container_statistics_item_title">
                                ` + getLanguage("video_player_statistics:network_activity") + `:
                            </div>
                            <div class = "video_player_container_statistics_item_value">
                                <div class = "video_player_container_statistics_item_network_activity">
                                    <!-- item -->
                                </div>
                            </div>
                        </div>
                        <div class = "video_player_container_statistics_item">
                            <div class = "video_player_container_statistics_item_title">
                                ` + getLanguage("video_player_statistics:loaded_buffer") + `:
                            </div>
                            <div class = "video_player_container_statistics_item_value">
                                <div class = "video_player_container_statistics_item_buffer">
                                    <!-- item -->
                                </div>
                            </div>
                        </div>
                        <div class = "video_player_container_statistics_item">
                            <div class = "video_player_container_statistics_item_title">
                                ` + getLanguage("video_player_statistics:protocol") + `:
                            </div>
                            <div class = "video_player_container_statistics_item_value">
                                <div class = "video_player_container_statistics_item_buffer">
                                    <!-- item -->
                                </div>
                            </div>
                        </div>
                        <div class = "video_player_container_statistics_item">
                            <div class = "video_player_container_statistics_item_title">
                                ` + getLanguage("video_player_statistics:quality_metrics") + `:
                            </div>
                            <div class = "video_player_container_statistics_item_value">
                                ...
                            </div>
                        </div>
                        <div class = "video_player_container_statistics_item">
                            <div class = "video_player_container_statistics_item_title">
                                ` + getLanguage("video_player_statistics:encoding_date") + `:
                            </div>
                            <div class = "video_player_container_statistics_item_value">
                                ...
                            </div>
                        </div>
                        <div class = "video_player_container_statistics_item">
                            <div class = "video_player_container_statistics_item_title">
                                ` + getLanguage("video_player_statistics:current_date") + `:
                            </div>
                            <div class = "video_player_container_statistics_item_value">
                                ...
                            </div>
                        </div>
                    </div>

                    <div style = "width: 500px;"></div>
                </div>
            </div>
            <div class = "video_player_container_settings">
                <div class = "video_player_container_settings_items scroll">
                    <!-- item -->
                </div>
            </div>
            <div class = "video_player_container_context_menu">
                <div class = "video_player_container_context_menu_box scroll">
                    <div class = "video_player_container_context_menu_box_item md-ripples">
                        <div class = "video_player_container_context_menu_box_item_left">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-2877,25h-3a24.823,24.823,0,0,1,1.964-9.731,24.916,24.916,0,0,1,5.358-7.947,24.916,24.916,0,0,1,7.947-5.358A24.831,24.831,0,0,1-2855,0a24.84,24.84,0,0,1,9.732,1.965,24.921,24.921,0,0,1,7.946,5.358,24.916,24.916,0,0,1,5.358,7.947c.084.2.167.4.246.6l-2.811,1.066A21.9,21.9,0,0,0-2855,3a22.025,22.025,0,0,0-22,22Z" transform="translate(2880 0)"/><rect width="3" height="15" rx="1.5" transform="translate(47 3)"/><rect width="3" height="15" rx="1.5" transform="translate(35 18) rotate(-90)"/><path d="M-2877,25h-3a24.823,24.823,0,0,1,1.964-9.731,24.916,24.916,0,0,1,5.358-7.947,24.916,24.916,0,0,1,7.947-5.358A24.831,24.831,0,0,1-2855,0a24.84,24.84,0,0,1,9.732,1.965,24.921,24.921,0,0,1,7.946,5.358,24.916,24.916,0,0,1,5.358,7.947c.084.2.167.4.246.6l-2.811,1.066A21.9,21.9,0,0,0-2855,3a22.025,22.025,0,0,0-22,22Z" transform="translate(-2829.999 50.001) rotate(180)"/><rect width="3" height="15" rx="1.5" transform="translate(3 47.001) rotate(180)"/><rect width="3" height="15" rx="1.5" transform="translate(15 32.001) rotate(90)"/></g></svg>
                            ` + getLanguage("video_player_context_menu:continuous_play") + `
                        </div>
                        <div class = "video_player_container_context_menu_box_item_right">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                        </div>
                    </div>
                    <div class = "video_player_container_context_menu_box_item md-ripples">
                        <div class = "video_player_container_context_menu_box_item_left">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-2735,50a24.844,24.844,0,0,1-9.731-1.965,24.917,24.917,0,0,1-7.947-5.358,24.922,24.922,0,0,1-5.358-7.947A24.845,24.845,0,0,1-2760,25a24.845,24.845,0,0,1,1.965-9.731,24.922,24.922,0,0,1,5.358-7.947,24.917,24.917,0,0,1,7.947-5.358A24.844,24.844,0,0,1-2735,0a24.844,24.844,0,0,1,9.731,1.965,24.917,24.917,0,0,1,7.947,5.358,24.922,24.922,0,0,1,5.358,7.947A24.84,24.84,0,0,1-2710,25a24.84,24.84,0,0,1-1.965,9.731,24.922,24.922,0,0,1-5.358,7.947,24.917,24.917,0,0,1-7.947,5.358A24.844,24.844,0,0,1-2735,50Zm0-47a22.025,22.025,0,0,0-22,22,22.024,22.024,0,0,0,22,22,22.025,22.025,0,0,0,22-22A22.025,22.025,0,0,0-2735,3Z" transform="translate(2760)"/><path d="M9.366,4.828a3,3,0,0,1,5.267,0L21.58,17.563A3,3,0,0,1,18.946,22H5.054A3,3,0,0,1,2.42,17.563Z" transform="translate(39 13) rotate(90)"/></g></svg>
                            ` + getLanguage("video_player_context_menu:auto_play") + `
                        </div>
                        <div class = "video_player_container_context_menu_box_item_right">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                        </div>
                    </div>
                    <div class = "video_player_container_context_menu_box_line"></div>
                    <div class = "video_player_container_context_menu_box_item md-ripples" onclick = "` + property["previous"]["onclick"] + `">
                        <div class = "video_player_container_context_menu_box_item_left">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="a"><rect width="50" height="50"></rect></clipPath></defs><g id="b" clip-path="url(#a)"><g transform="translate(50 50) rotate(180)" clip-path="url(#a)"><rect width="14" height="44" rx="3" transform="translate(33 3)"></rect><path d="M19.581,3.3a3,3,0,0,1,4.838,0L40.5,25.226A3,3,0,0,1,38.08,30H5.92A3,3,0,0,1,3.5,25.226Z" transform="translate(33 3) rotate(90)"></path></g></g></svg>
                            ` + getLanguage("video_player_context_menu:previous") + `
                        </div>
                        <div class = "video_player_container_context_menu_box_item_right">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                        </div>
                    </div>
                    <div class = "video_player_container_context_menu_box_item md-ripples" onclick = "` + property["next"]["onclick"] + `">
                        <div class = "video_player_container_context_menu_box_item_left">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="14" height="44" rx="3" transform="translate(33 3)"></rect><path d="M19.581,3.3a3,3,0,0,1,4.838,0L40.5,25.226A3,3,0,0,1,38.08,30H5.92A3,3,0,0,1,3.5,25.226Z" transform="translate(33 3) rotate(90)"></path></g></svg>
                            ` + getLanguage("video_player_context_menu:next") + `
                        </div>
                        <div class = "video_player_container_context_menu_box_item_right">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                        </div>
                    </div>
                    <div class = "video_player_container_context_menu_box_item md-ripples">
                        <div class = "video_player_container_context_menu_box_item_left">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0 3c0-1.1 0.9-2 2-2h16c1.105 0 2 0.895 2 2v0 14c0 1.105-0.895 2-2 2v0h-16c-1.105 0-2-0.895-2-2v0-14zM2 5v12h16v-12h-16zM10 8l4 5h-8l4-5z"></path></svg>
                            ` + getLanguage("video_player_context_menu:open_popup") + `
                        </div>
                        <div class = "video_player_container_context_menu_box_item_right">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                        </div>
                    </div>
                    <div class = "video_player_container_context_menu_box_item md-ripples">
                        <div class = "video_player_container_context_menu_box_item_left">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M48.5,1550H1.5a1.5,1.5,0,0,1-1.289-2.267l11-18.5a1.5,1.5,0,0,1,1.846-.626l11.336,4.534L36.228,1514.2a1.5,1.5,0,0,1,2.7.327l11,33.5A1.5,1.5,0,0,1,48.5,1550Zm-44.363-3H46.429l-9.354-28.489-10.8,17.284a1.5,1.5,0,0,1-1.829.6l-11.309-4.524Z" transform="translate(0 -1500)"></path><path d="M11.5,3A8.5,8.5,0,1,0,20,11.5,8.51,8.51,0,0,0,11.5,3m0-3A11.5,11.5,0,1,1,0,11.5,11.5,11.5,0,0,1,11.5,0Z"></path></g></svg>
                            ` + getLanguage("video_player_context_menu:screenshot") + `
                        </div>
                        <div class = "video_player_container_context_menu_box_item_right">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                        </div>
                    </div>
                    <div class = "video_player_container_context_menu_box_item md-ripples">
                        <div class = "video_player_container_context_menu_box_item_left">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.199 13.599c0.992 1.327 2.43 2.126 3.948 2.345s3.123-0.142 4.45-1.134c0.239-0.179 0.465-0.375 0.655-0.568l2.995-2.995c1.163-1.204 1.722-2.751 1.696-4.285s-0.639-3.061-1.831-4.211c-1.172-1.132-2.688-1.692-4.199-1.683-1.492 0.008-2.984 0.571-4.137 1.683l-1.731 1.721c-0.392 0.389-0.394 1.023-0.004 1.414s1.023 0.394 1.414 0.004l1.709-1.699c0.77-0.742 1.763-1.117 2.76-1.123 1.009-0.006 2.016 0.367 2.798 1.122 0.795 0.768 1.203 1.783 1.221 2.808s-0.355 2.054-1.11 2.836l-3.005 3.005c-0.114 0.116-0.263 0.247-0.428 0.37-0.885 0.662-1.952 0.902-2.967 0.756s-1.971-0.678-2.632-1.563c-0.331-0.442-0.957-0.533-1.4-0.202s-0.533 0.957-0.202 1.4zM14.801 10.401c-0.992-1.327-2.43-2.126-3.948-2.345s-3.124 0.142-4.451 1.134c-0.239 0.179-0.464 0.375-0.655 0.568l-2.995 2.995c-1.163 1.204-1.722 2.751-1.696 4.285s0.639 3.061 1.831 4.211c1.172 1.132 2.688 1.692 4.199 1.683 1.492-0.008 2.984-0.571 4.137-1.683l1.723-1.723c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-1.696 1.698c-0.77 0.742-1.763 1.117-2.76 1.123-1.009 0.006-2.016-0.367-2.798-1.122-0.795-0.768-1.203-1.783-1.221-2.808s0.355-2.054 1.11-2.836l3.005-3.005c0.114-0.116 0.263-0.247 0.428-0.37 0.885-0.662 1.952-0.902 2.967-0.756s1.971 0.678 2.632 1.563c0.331 0.442 0.957 0.533 1.4 0.202s0.533-0.957 0.202-1.4z"></path></svg>
                            ` + getLanguage("video_player_context_menu:copy_page_url") + `
                        </div>
                        <div class = "video_player_container_context_menu_box_item_right">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                        </div>
                    </div>
                    <div class = "video_player_container_context_menu_box_item md-ripples">
                        <div class = "video_player_container_context_menu_box_item_left">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.199 13.599c0.992 1.327 2.43 2.126 3.948 2.345s3.123-0.142 4.45-1.134c0.239-0.179 0.465-0.375 0.655-0.568l2.995-2.995c1.163-1.204 1.722-2.751 1.696-4.285s-0.639-3.061-1.831-4.211c-1.172-1.132-2.688-1.692-4.199-1.683-1.492 0.008-2.984 0.571-4.137 1.683l-1.731 1.721c-0.392 0.389-0.394 1.023-0.004 1.414s1.023 0.394 1.414 0.004l1.709-1.699c0.77-0.742 1.763-1.117 2.76-1.123 1.009-0.006 2.016 0.367 2.798 1.122 0.795 0.768 1.203 1.783 1.221 2.808s-0.355 2.054-1.11 2.836l-3.005 3.005c-0.114 0.116-0.263 0.247-0.428 0.37-0.885 0.662-1.952 0.902-2.967 0.756s-1.971-0.678-2.632-1.563c-0.331-0.442-0.957-0.533-1.4-0.202s-0.533 0.957-0.202 1.4zM14.801 10.401c-0.992-1.327-2.43-2.126-3.948-2.345s-3.124 0.142-4.451 1.134c-0.239 0.179-0.464 0.375-0.655 0.568l-2.995 2.995c-1.163 1.204-1.722 2.751-1.696 4.285s0.639 3.061 1.831 4.211c1.172 1.132 2.688 1.692 4.199 1.683 1.492-0.008 2.984-0.571 4.137-1.683l1.723-1.723c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-1.696 1.698c-0.77 0.742-1.763 1.117-2.76 1.123-1.009 0.006-2.016-0.367-2.798-1.122-0.795-0.768-1.203-1.783-1.221-2.808s0.355-2.054 1.11-2.836l3.005-3.005c0.114-0.116 0.263-0.247 0.428-0.37 0.885-0.662 1.952-0.902 2.967-0.756s1.971 0.678 2.632 1.563c0.331 0.442 0.957 0.533 1.4 0.202s0.533-0.957 0.202-1.4z"></path></svg>
                            ` + getLanguage("video_player_context_menu:copy_video_url") + `
                        </div>
                        <div class = "video_player_container_context_menu_box_item_right">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                        </div>
                    </div>
                    <div class = "video_player_container_context_menu_box_item md-ripples">
                        <div class = "video_player_container_context_menu_box_item_left">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M0 19.256l10.042 6.457v-4.661l-5.979-3.692 5.979-3.692v-4.693l-10.042 6.49v3.791zM12.166 28h3.456l5.064-24h-3.479l-5.041 24zM21.959 8.975v4.693l5.977 3.692-5.977 3.691v4.661l10.041-6.456v-3.791l-10.041-6.49z"></path></svg>
                            ` + getLanguage("video_player_context_menu:copy_source_code") + `
                        </div>
                        <div class = "video_player_container_context_menu_box_item_right">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                        </div>
                    </div>
                    <div class = "video_player_container_context_menu_box_item md-ripples">
                        <div class = "video_player_container_context_menu_box_item_left">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M18.405 2.799c-0.112-0.44-0.656-0.799-1.21-0.799h-14.39c-0.555 0-1.099 0.359-1.21 0.799l-0.201 1.201h17.211l-0.2-1.201zM19.412 5h-18.825c-0.342 0-0.609 0.294-0.577 0.635l0.923 11.669c0.038 0.394 0.37 0.696 0.766 0.696h16.601c0.397 0 0.728-0.302 0.766-0.696l0.923-11.669c0.033-0.341-0.235-0.635-0.577-0.635zM8 14v-5l4.383 2.5-4.383 2.5z"></path></svg>
                            ` + getLanguage("video_player_context_menu:copy_video_info") + `
                        </div>
                        <div class = "video_player_container_context_menu_box_item_right">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                        </div>
                    </div>
                    <div class = "video_player_container_context_menu_box_item md-ripples">
                        <div class = "video_player_container_context_menu_box_item_left">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M15.3 14.89l2.77 2.77c0.18 0.181 0.291 0.43 0.291 0.705s-0.111 0.524-0.291 0.705l0-0c-0.181 0.18-0.43 0.291-0.705 0.291s-0.524-0.111-0.705-0.291l0 0-2.59-2.58c-0.825 0.765-1.872 1.303-3.034 1.505l-0.036 0.005v-8.96c0-0.552-0.448-1-1-1s-1 0.448-1 1v0 8.96c-1.198-0.207-2.245-0.744-3.074-1.513l0.004 0.003-2.59 2.58c-0.181 0.18-0.43 0.291-0.705 0.291s-0.524-0.111-0.705-0.291l0 0c-0.18-0.181-0.291-0.43-0.291-0.705s0.111-0.524 0.291-0.705l2.77-2.77c-0.298-0.547-0.518-1.183-0.626-1.856l-0.004-0.034h-3.070c-0.552 0-1-0.448-1-1s0.448-1 1-1v0h3v-2.59l-3.070-3.070c-0.18-0.181-0.291-0.43-0.291-0.705s0.111-0.524 0.291-0.705l-0 0c0.181-0.18 0.43-0.291 0.705-0.291s0.524 0.111 0.705 0.291l2.1 2.1h11.12l2.1-2.1c0.181-0.18 0.43-0.291 0.705-0.291s0.524 0.111 0.705 0.291l-0-0c0.18 0.181 0.291 0.43 0.291 0.705s-0.111 0.524-0.291 0.705l-3.070 3.070v2.59h3c0.552 0 1 0.448 1 1s-0.448 1-1 1v0h-3.070c-0.1 0.67-0.32 1.31-0.63 1.89zM15 5h-10c0-2.761 2.239-5 5-5s5 2.239 5 5v0z"></path></svg>
                            ` + getLanguage("video_player_context_menu:copy_debug_info") + `
                        </div>
                        <div class = "video_player_container_context_menu_box_item_right">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                        </div>
                    </div>
                    <div class = "video_player_container_context_menu_box_item md-ripples">
                        <div class = "video_player_container_context_menu_box_item_left">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"> <defs> <clipPath id="clip-reload"> <rect width="50" height="50"></rect> </clipPath> </defs> <g id="reload" clip-path="url(#clip-reload)"> <path id="빼기_30" data-name="빼기 30" d="M-2615,50a24.844,24.844,0,0,1-9.731-1.965,24.917,24.917,0,0,1-7.947-5.358,24.922,24.922,0,0,1-5.358-7.947A24.844,24.844,0,0,1-2640,25a24.844,24.844,0,0,1,1.965-9.731,24.922,24.922,0,0,1,5.358-7.947,24.917,24.917,0,0,1,7.947-5.358A24.844,24.844,0,0,1-2615,0a24.835,24.835,0,0,1,14.413,4.571,24.948,24.948,0,0,1,9.019,11.7l-.1,1.04h-2.71A22.1,22.1,0,0,0-2615,3a22.025,22.025,0,0,0-22,22,22.025,22.025,0,0,0,22,22,22.03,22.03,0,0,0,21.244-16.264h3.094a24.808,24.808,0,0,1-3.232,7.669,25.065,25.065,0,0,1-5.471,6.1,24.9,24.9,0,0,1-7.2,4.034A24.932,24.932,0,0,1-2615,50Z" transform="translate(2640)"></path> <g id="그룹_29" data-name="그룹 29" transform="translate(0 1)"> <rect id="사각형_65" data-name="사각형 65" width="3" height="14" rx="1.5" transform="translate(47 5)"></rect> <rect id="사각형_66" data-name="사각형 66" width="3" height="14" rx="1.5" transform="translate(35.892 19) rotate(-90)"></rect> </g> </g> </svg>
                            ` + getLanguage("video_player_context_menu:reload") + `
                        </div>
                        <div class = "video_player_container_context_menu_box_item_right">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                        </div>
                    </div>
                    <div class = "video_player_container_context_menu_box_item md-ripples">
                        <div class = "video_player_container_context_menu_box_item_left">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M0.69 11.331l1.363 0.338 1.026-1.611-1.95-0.482c-0.488-0.121-0.981 0.174-1.102 0.66-0.121 0.483 0.175 0.973 0.663 1.095zM18.481 11.592l-4.463 4.016-5.247-4.061c-0.1-0.076-0.215-0.133-0.338-0.162l-0.698-0.174-1.027 1.611 1.1 0.273 5.697 4.408c0.166 0.127 0.362 0.189 0.559 0.189 0.219 0 0.438-0.078 0.609-0.232l5.028-4.527c0.372-0.334 0.401-0.906 0.064-1.277s-0.911-0.4-1.284-0.064zM8.684 7.18l4.887 3.129c0.413 0.264 0.961 0.154 1.24-0.246l5.027-7.242c0.286-0.412 0.183-0.977-0.231-1.26-0.414-0.285-0.979-0.182-1.265 0.23l-4.528 6.521-4.916-3.147c-0.204-0.131-0.451-0.174-0.688-0.123-0.236 0.053-0.442 0.197-0.571 0.4l-7.497 11.767c-0.27 0.422-0.144 0.983 0.28 1.25 0.15 0.096 0.319 0.141 0.486 0.141 0.301 0 0.596-0.149 0.768-0.42l7.008-11z"></path></svg>
                            ` + getLanguage("video_player_context_menu:statistics") + `
                        </div>
                        <div class = "video_player_container_context_menu_box_item_right">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                        </div>
                    </div>
                    <div class = "video_player_container_context_menu_box_line"></div>
                    <div class = "video_player_container_context_menu_box_item md-ripples">
                        <div class = "video_player_container_context_menu_box_item_left">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M22.406,4.461a3,3,0,0,1,5.187,0L47.379,38.492A3,3,0,0,1,44.786,43H5.214a3,3,0,0,1-2.594-4.508Z" transform="translate(50) rotate(90)"></path></g></svg>
                            ` + getLanguage("video_player_context_menu:from_louisbooks") + `
                        </div>
                        <div class = "video_player_container_context_menu_box_item_right">
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    let videoPlayer = box.appendChild(newEl);

    //Embed인지
    box.setAttribute("is_embed", isEmbed);
    
    //자막 불러오기 (테스트)
    const xhr = new XMLHttpRequest();
    const method = "POST";
    const url = "/test_subtitle.php";
    xhr.open(method, url);
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText;
                let subtitleData = JSON.parse(xhrHtml.trim());
                applySubtitleVideoPlayer(uniqueNumber, subtitleData);
            }
        }
    });
    let formData = new FormData();
    formData.append('partNumber', partNumber);
    xhr.send(formData);

    //자막 적용
    let subtitleData = JSON.parse("{}");
    applySubtitleVideoPlayer(uniqueNumber, subtitleData);

    //앨리먼트
    let video = box.getElementsByTagName("video")[0];
    let backDrop = box.getElementsByClassName("video_player_backdrop")[0];
    let backDropCanvas = backDrop.getElementsByTagName("canvas")[0];
    let container = box.getElementsByClassName("video_player_container")[0];
    let controlsWrap = box.getElementsByClassName("video_player_container_controls_wrap")[0];
    let controlsPreview = container.getElementsByClassName("video_player_container_controls_preview")[0];
    let previewVideo = controlsPreview.getElementsByTagName("video")[0];
    let previewCanvas = controlsPreview.getElementsByTagName("canvas")[0];
    let previewScreen = container.getElementsByClassName("video_player_container_controls_preview_box_screen")[0];
    let screenPreview = box.getElementsByClassName("video_player_preview")[0];
    let screenPreviewCanvas = screenPreview.getElementsByTagName("canvas")[0];
    let screenPreviewDetailed = container.getElementsByClassName("video_player_container_controls_preview_box_detailed")[0];
    let previewDetailedVideo = screenPreviewDetailed.getElementsByTagName("video")[0];
    let subtitle = box.getElementsByClassName("video_player_subtitle")[0];
    let touchDeviceControls = container.getElementsByClassName("video_player_container_touch_device_controls")[0];
    let contextMenu = container.getElementsByClassName("video_player_container_context_menu")[0];
    let contextMenuBox = contextMenu.getElementsByClassName("video_player_container_context_menu_box")[0];
    let contextMenuItem = contextMenuBox.getElementsByClassName("video_player_container_context_menu_box_item");
    let containerSettings = container.getElementsByClassName("video_player_container_settings")[0];
    let containerSettingsItems = containerSettings.getElementsByClassName("video_player_container_settings_items")[0];

    //동영상 품질
    function checkResolutionInfo() {
        //품질 모드
        resolutionMode = video.getAttribute("resolution_mode");
        //동영상 품질
        if (resolutionMode == -1) {
            let customResolution = video.getAttribute("custom_resolution");
            let resolutions = codecs["resolutions"];
            for (let i = 0; i < resolutions.length; i++) {
                if (resolutions[i]["resolution"] == customResolution) {
                    resolutionInfo = resolutions[i];
                    break;
                }
            }
        } else {
            resolutionInfo = getVideoPlayerResolutionData(uniqueNumber, codecs["resolutions"])[resolutionMode];
        }
        video.setAttribute("duration", resolutionInfo["duration"]);
    }
    checkResolutionInfo();
    
    //뷰 퍼센트 (클라이언트 정보)
    if (property["percentViewed"] != null) {
        setPercentViewedPart(partNumber, property["percentViewed"]);
    }

    //동영상 시간 설정
    let startTime = 0;
    if (property["startTime"] != null) {
        startTime = property["startTime"];
    } else {
        if (window.opener != null && window.opener.popupVideoStartTime != null) {
            startTime = window.opener.popupVideoStartTime;
            window.opener.popupVideoStartTime = null;
        } else {
            let percentViewed = property["percentViewed"];
            if (percentViewed == null) {
                percentViewed = getPercentViewedPart(partNumber);
            }
            if (percentViewed != null && percentViewed < 1) {
                let duration = Number.parseFloat(video.getAttribute("duration"));
                (isNaN(video.duration) == false) ? duration = video.duration : null;
                startTime = (duration * percentViewed);
                actionMessage(getLanguage("viewer_scroll_percent_viewed_message"), "goTofirstTimeVideoPlayer(" + uniqueNumber + ");");
            }
        }
    }
    video.currentTime = startTime;

    //메뉴에 있는지
    function isVideoVisible() {
        let menuNumber = getCurrentMenuNumber();
        let contents = document.getElementById("contents_" + menuNumber);
        let videoPlayerBox = contents.getElementsByClassName("video_player_box");
        let videoPlayerBox_length = videoPlayerBox.length;
        for (let i = 0; i < videoPlayerBox_length; i++) {
            if (videoPlayerBox[i].getAttribute("unique_number") == uniqueNumber) {
                return true;
            }
        }
        return false;
    }
    
    //1초마다 동영상 길이 체크
    let percentViewedPartCheckInterval = setInterval(() => {
        if (document.body.contains(box)) {
            if (isVideoVisible() == true) {
                checkPercentViewedPart();
            }
        } else {
            clearInterval(percentViewedPartCheckInterval);
        }
    }, 1000);
    video.addEventListener("seeked", () => {
        checkPercentViewedPart();
    });
    video.addEventListener("pause", () => {
        checkPercentViewedPart();
    });
    video.addEventListener("ended", () => {
        checkPercentViewedPart();
    });
    function checkPercentViewedPart() {
        let duration = Number.parseFloat(video.getAttribute("duration"));
        (isNaN(video.duration) == false) ? duration = video.duration : null;
        requestSetPercentViewedPart(partNumber, (video.currentTime / duration));
    }

    //설정 관련
    containerSettings.onclick = function(event) {
        isIgnoreClick = true;
    }
    let isContainerSettingsClick = false;
    containerSettingsItems.onclick = function(event) {
        isIgnoreClick = true;
        isContainerSettingsClick = true;
    }
    function closeContainerSettings(event) {
        if (document.body.contains(box)) {
            if (isContainerSettingsClick == false) {
                closeSettings();
            } else {
                isContainerSettingsClick = false;
            }
        } else {
            document.removeEventListener("click", closeContainerSettings);
        }
    }
    document.addEventListener("click", closeContainerSettings);

    //미리보기 화면 비율
    previewScreen.style.aspectRatio = previewAspectRatio;

    //개발자 통계 - 네트워크 활동 관련
    let maxNetworkActivityLength = 60;
    let statisticsNetworkActivity = container.getElementsByClassName("video_player_container_statistics_item_network_activity")[0];
    for (let i = 0; i < maxNetworkActivityLength; i++) {
        let newEl = document.createElement("div");
        newEl.classList.add("video_player_container_statistics_item_network_activity_item");

        statisticsNetworkActivity.appendChild(newEl);
    }

    let previewDataList = new Array();
    previewVideo.onseeked = function(event) {
        checkPreviewVideo();

        //요청 동영상 시간
        let requestTime = previewVideo.getAttribute("request_time");
        if (requestTime != previewVideo.currentTime && (requestTime != null && requestTime != "null")) {
            requestTime = Number.parseFloat(requestTime);
            previewVideo.currentTime = requestTime;
            previewVideo.setAttribute("is_loading", true);
            previewVideo.setAttribute("current_time", requestTime);
        } else {
            previewVideo.setAttribute("is_loading", false);
            previewVideo.setAttribute("request_time", null);
        }
    }
    function checkPreviewVideo() {
        //그리기
        drawPreviewCanvas(previewVideo);
        
        //미리보기 이미지 저장
        previewDataList["time_" + previewVideo.currentTime] = previewCanvas.toDataURL("image/png", 1);
    }
    function drawPreviewCanvas(data) {
        if (typeof data == "string") {
            let image = new Image();
            image.src = data;

            image.onload = function (event) {
                draw(event.target);
            }
        } else {
            draw(data);
        }

        function draw(image) {
            if (isMovePossible == true && isMouseDown == true) {
                screenPreviewCanvas.width = previewVideo.videoWidth;
                screenPreviewCanvas.height = previewVideo.videoHeight;
            }
            previewCanvas.width = previewVideo.videoWidth;
            previewCanvas.height = previewVideo.videoHeight;

            //1
            let context = previewCanvas.getContext('2d');
            context.drawImage(image, 0, 0);

            //미리보기 표시
            previewCanvas.style.opacity = 1;

            if (isMovePossible == true && isMouseDown == true) {
                //2
                context = screenPreviewCanvas.getContext('2d');
                context.drawImage(image, 0, 0);

                //미리보기 로드 완료
                screenPreviewCanvas.setAttribute("is_load", true);
            }
        }
    }

    //비디오 음량
    let videoVolume = 0;
    if (getCookie("videoVolume") != null) {
        videoVolume = getCookie("videoVolume");
    } else {
        if (isTouchDevice() == true) {
            videoVolume = 1;
        } else {
            videoVolume = 0.5;
        }
    }
    setVolumeVideoPlayer(uniqueNumber, videoVolume);

    //컨트롤러가 숨겨지기까지의 시간(초)
    let hideControlsSeconds = getVideoPlayerSettingsValue("progressBarHiddenTime");
    //최대 컨트롤러 대기 시간(초)
    //최대 0.2초까지 컨트롤러가 보여져야 한다.
    let maxControlsLatencySeconds = 0.2;
    //두번 클릭으로 전체 화면 전환 시간
    let fullScreenTransitionSeconds = 0.2;

    let waltClickTimeout = null;
    let isWaitClick = false;
    let isIgnoreBoxClick = false;
    function videoBoxClick(event) {
        if (isIgnoreBoxClick == false) {
            //데스크톱인지 터치 디바이스인지
            if (isTouchDevice() == false) {
                //전체 화면
                let hideEffect = false;
                if (document.fullscreenEnabled == true) {
                    if (isWaitClick == true) {
                        if (document.fullscreenElement == null) {
                            box.requestFullscreen();
                        } else {
                            document.exitFullscreen();
                        }
                        hideEffectVideoPlayer(uniqueNumber);
                        hideEffect = true;
    
                        clearTimeout(waltClickTimeout);
                        isWaitClick = false;
                    } else {
                        isWaitClick = true;
                        waltClickTimeout = setTimeout(() => {
                            isWaitClick = false;
                        }, (fullScreenTransitionSeconds * 1000));
                    }
                }

                let isUseFullScreenClickDelay = getVideoPlayerSettingsValue("isUseFullScreenClickDelay");
                if (isUseFullScreenClickDelay == true && document.fullscreenEnabled == true) {
                    let fullScreenClickDelayTimeout = video.getAttribute("full_screen_click_delay_timeout");
                    if (fullScreenClickDelayTimeout != null && fullScreenClickDelayTimeout != "null") {
                        clearTimeout(fullScreenClickDelayTimeout);
                        video.setAttribute("full_screen_click_delay_timeout", null);
                    }
                }

                //동영상 다 봤는지
                let duration = Number.parseFloat(video.getAttribute("duration"));
                (isNaN(video.duration) == false) ? duration = video.duration : null;

                let isVideoEnded = false;
                if (video.paused == true && Math.abs(video.currentTime - duration) < 0.01) {
                    isVideoEnded = true;
                }

                if (video.paused == true) {
                    //효과
                    if (hideEffect == false) {
                        showPlayEffectVideoPlayer(uniqueNumber);
                    }
                    if (isUseFullScreenClickDelay == true && document.fullscreenEnabled == true) {
                        if (hideEffect == false) {
                            let timeout = setTimeout(() => {
                                (isVideoEnded == true) ? video.currentTime = 0 : null;
                                video.play();
                                video.setAttribute("full_screen_click_delay_timeout", null);
                            }, (fullScreenTransitionSeconds * 1000));
                            video.setAttribute("full_screen_click_delay_timeout", timeout);
                        }
                    } else {
                        (isVideoEnded == true) ? video.currentTime = 0 : null;
                        video.play();
                    }
                } else {
                    if (isUseFullScreenClickDelay == true && document.fullscreenEnabled == true) {
                        if (hideEffect == false) {
                            let timeout = setTimeout(() => {
                                video.pause();
                                video.setAttribute("full_screen_click_delay_timeout", null);
                            }, (fullScreenTransitionSeconds * 1000));
                            video.setAttribute("full_screen_click_delay_timeout", timeout);
                        }
                    } else {
                        video.pause();
                    }

                    //효과
                    if (hideEffect == false) {
                        showPauseEffectVideoPlayer(uniqueNumber);
                    }
                }
            } else {
                //터치 디바이스면
                if (controlsWrap.classList.contains("show_video_player_container_controls")) {
                    if (hideControlsTimeout != null) {
                        clearTimeout(hideControlsTimeout);
                        hideControlsTimeout = null;
                    }

                    hideControls(false);
                } else {
                    if (hideControlsTimeout != null) {
                        clearTimeout(hideControlsTimeout);
                        hideControlsTimeout = null;
                    }
                    hideControlsTimeout = setTimeout(() => {
                        hideControls(true);
                        hideControlsTimeout = null;
                    }, (hideControlsSeconds * 1000));

                    showControls();
                }
            }
        } else {
            isIgnoreBoxClick = false;
        }
    }
    let isIgnoreClick = false;
    controlsWrap.onclick = function(event) {
        isIgnoreClick = true;
    }

    let doubleTapWrap = container.getElementsByClassName("video_player_container_double_tap_wrap");
    let doubleTapBox = container.getElementsByClassName("video_player_container_double_tap_box");
    let doubleTapTimeout = new Array();
    let hideDoubleTapTimeout = new Array();
    let doubleTapTime = new Array();
    let isDoubleTapTouch = false;
    for (let i = 0; i < doubleTapWrap.length; i++) {
        doubleTapWrap[i].onclick = function() {
            (isDoubleTapTouch == true) ? isIgnoreClick = true : null;
            isDoubleTapTouch = false;
        }
        doubleTapWrap[i].ontouchstart = function() {
            isDoubleTapTouch = true;
        }
        doubleTapWrap[i].ontouchend = function(event) {
            //대기 상태일 동안 다시 한번 더 클릭하면, 효과가 사라지려고 하는데 다시 한번 더 클릭하면
            if (doubleTapTimeout[i] != null || hideDoubleTapTimeout[i] != null) {
                if (doubleTapTimeout[i] != null) {
                    clearTimeout(doubleTapTimeout[i]);
                    doubleTapTimeout[i] = null;
                }
                if (hideDoubleTapTimeout[i] != null) {
                    clearTimeout(hideDoubleTapTimeout[i]);
                    hideDoubleTapTimeout[i] = null;
                }
                //시간 기록
                if (doubleTapTime[i] == null) {
                    doubleTapTime[i] = 0;
                }
                doubleTapTime[i] += 10;
                
                //컨트롤러 숨기기
                hideControls(false);

                //뒤로가기
                if (i == 0) {
                    video.currentTime -= 10;
                }
                //앞으로 가기
                if (i == 1) {
                    video.currentTime += 10;
                }

                //효과 보이기
                doubleTapBox[i].style.opacity = 1;
                //시간 표시
                let span = doubleTapBox[i].getElementsByTagName("span")[0];
                span.innerHTML = (getTimeText((doubleTapTime[i] < 0) ? doubleTapTime[i] *= -1 : doubleTapTime[i]))

                //0.25초 뒤에 효과 사라짐
                hideDoubleTapTimeout[i] = setTimeout(() => {
                    doubleTapBox[i].style.opacity = null;
                    doubleTapBox[i].style.pointerEvents = null;

                    hideDoubleTapTimeout[i] = null;
                    doubleTapTime[i] = null;
                }, 250);
            } else {
                //효과 클릭 가능하게
                doubleTapBox[i].style.pointerEvents = "all";

                doubleTapTimeout[i] = setTimeout(() => {
                    videoBoxClick(event);
                    doubleTapTimeout[i] = null;

                    //효과 클릭 불가능
                    doubleTapBox[i].style.pointerEvents = null;
                }, (maxControlsLatencySeconds * 1000));
            }
        }
    }

    box.onclick = function(event) {
        if (isIgnoreClick == false) {
            videoBoxClick(event);
        } else {
            isIgnoreClick = false;
        }
    }





    //우클릭 팝업 메뉴 관련
    box.oncontextmenu = function(event) {
        let isUseContextMenu = getVideoPlayerSettingsValue("isUseContextMenu");

        if (isUseContextMenu == true && isShowSettings == false) {
            let scale = box.getAttribute("scale");
            (scale == null || scale == "null") ? scale = 1 : null;
            scale = Number.parseFloat(scale);
            
            contextMenuBox.style.pointerEvents = "all";
            contextMenu.style.pointerEvents = "all";
            contextMenu.setAttribute("is_show", true);
            function callback23780168() {
                contextMenuBox.style.opacity = 1;
            }
            window.requestAnimationFrame(callback23780168);
    
            let timeout = contextMenu.getAttribute("timeout");
            if (timeout != null && timeout != "null") {
                clearTimeout(timeout);
                contextMenu.setAttribute("timeout", null);
            }
            contextMenu.style.display = "block";
    
            let contextMenuRect = contextMenuBox.getBoundingClientRect();
            let boxRect = box.getBoundingClientRect();
    
            //마우스 위치
            let newEl = document.createElement("div");
            newEl.style.position = "fixed";
            newEl.style.top = (event.clientY + "px");
            newEl.style.left = (event.clientX + "px");
            let body = document.getElementsByTagName("body")[0];
            let div = body.appendChild(newEl);
            let mouseRect = div.getBoundingClientRect();
            div.remove();
    
            let mouseRectTop = (mouseRect.top / scale);
            let mouseRectLeft = (mouseRect.left / scale);
    
            let top = (mouseRectTop - boxRect.top);
            (top < 10) ? top = 10 : null;
            let boxHeight = (boxRect.height - 10);
            if ((boxHeight - (top + contextMenuRect.height)) < 0) {
                top -= (boxHeight - (top + contextMenuRect.height)) * -1;
            }
    
            let left = (mouseRectLeft - boxRect.left);
            (left < 10) ? left = 10 : null;
            let boxWidth = (boxRect.width - 10);
            if ((boxWidth - (left + contextMenuRect.width)) < 0) {
                left -= (boxWidth - (left + contextMenuRect.width)) * -1;
            }
    
            contextMenuBox.style.left = (left + "px");
            contextMenuBox.style.top = (top + "px");
    
            //특정 메뉴 안보이게
            let item = contextMenuBox.getElementsByClassName("video_player_container_context_menu_box_item");
            if (resolutionInfo == null) {
                item[5].style.display = "none";
                item[6].style.display = "none";
                item[8].style.display = "none";
            }
            
            event.preventDefault();
        }
    }
    function closeContextMenuBox(event) {
        if (document.body.contains(box)) {
            let isShow = contextMenu.getAttribute("is_show");

            if (isShow == true || isShow == "true") {
                contextMenuBox.style.opacity = null;
                contextMenuBox.style.pointerEvents = null;
                contextMenu.style.pointerEvents = null;
                contextMenu.setAttribute("is_show", false);
        
                let timeout = setTimeout(() => {
                    contextMenu.style.display = null;
                    contextMenu.setAttribute("timeout", null);
                }, 200);
                contextMenu.setAttribute("timeout", timeout);
    
                isIgnoreClick = true;
            }
        } else {
            document.removeEventListener("click", closeContextMenuBox);
        }
    }
    document.addEventListener("click", closeContextMenuBox);
    window.addEventListener("resize", closeContextMenuBox);
    window.addEventListener("focus", closeContextMenuBox);

    contextMenu.onclick = function() {
        isIgnoreClick = true;
    }
    
    //팝업 창으로 열기
    if (window.opener != null || isTouchDevice() == true) {
        contextMenuItem[4].style.display = "none";
    }
    //Louibooks에서 시청하기 숨기기
    if (isEmbed == false) {
        contextMenuItem[13].style.display = "none";
        let contextMenuBoxLine = container.getElementsByClassName("video_player_container_context_menu_box_line")[1];
        contextMenuBoxLine.style.display = "none";
    }
    
    for (let i = 0; i < contextMenuItem.length; i++) {
        let target = contextMenuItem[i];

        function click(event) {
            //연속 재생
            if (i == 0) {
                if (video.loop == true) {
                    video.loop = false;
                } else {
                    video.loop = true;
                }
            }
            //팝업 창으로 열기
            if (i == 4) {
                let width = (window.screen.availWidth * 0.5);
                let height = (width / 16) * 9;

                let url = `https://louibooks.com/embed/` + partNumber;
                let features = 'popup=yes,location=no,toolbar=no,status=no,menubar=no,scrollbars=no,width=' + width + ',height=' + height;
                let popup = window.open(url, "_blank", features);
                if (popup == null) {
                    actionMessage("video_player:open_popup:no_permission_message");
                } else {
                    window.popupVideoStartTime = video.currentTime;
                }

                //동영상 일시 정지
                video.pause();
            }
            //현재 장면 스크린샷
            if (i == 5) {
                videoPlayerScreenshot(uniqueNumber);
            }
            //현재 페이지 URL 복사
            if (i == 6) {
                let textarea = document.createElement("textarea");
                document.body.appendChild(textarea);
                textarea.value = window.location;
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);

                let items = box.getElementsByClassName("video_player_container_effect_items")[0];
                let newEl = document.createElement("div");
                newEl.classList.add("video_player_container_effect_item");
                newEl.innerHTML = '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>';
                let el = items.appendChild(newEl);
                setTimeout(() => {
                    el.remove();
                }, 700);
            }
            //동영상 URL 복사
            if (i == 7) {
                let textarea = document.createElement("textarea");
                document.body.appendChild(textarea);
                textarea.value = video.src;
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);

                let items = box.getElementsByClassName("video_player_container_effect_items")[0];
                let newEl = document.createElement("div");
                newEl.classList.add("video_player_container_effect_item");
                newEl.innerHTML = '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>';
                let el = items.appendChild(newEl);
                setTimeout(() => {
                    el.remove();
                }, 700);
            }
            //소스 코드 복사
            if (i == 8) {
                let textarea = document.createElement("textarea");
                document.body.appendChild(textarea);
                textarea.value = `
                    <iframe style = "width: 100%; height: max-content; aspect-ratio: 16 / 9;" src="https://louibooks.com/embed/` + partNumber + `" frameborder = "0" allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                `;
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);

                let items = box.getElementsByClassName("video_player_container_effect_items")[0];
                let newEl = document.createElement("div");
                newEl.classList.add("video_player_container_effect_item");
                newEl.innerHTML = '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>';
                let el = items.appendChild(newEl);
                setTimeout(() => {
                    el.remove();
                }, 700);
            }
            //동영상 정보 복사
            if (i == 9) {
                let textarea = document.createElement("textarea");
                document.body.appendChild(textarea);
                textarea.value = JSON.stringify({
                    "id": videoInfo["videoId"],
                    "video": {
                        "codecId": resolutionInfo["codecId"],
                        "url": video.src,
                        "resolution": resolutionInfo["resolution"],
                        "width": resolutionInfo["width"],
                        "height": resolutionInfo["height"],
                        "size": resolutionInfo["size"],
                        "framerate": resolutionInfo["framerate"],
                        "pixelFormat": resolutionInfo["pixelFormat"],
                        "bitDepth": resolutionInfo["bitDepth"],
                        "colorRange": resolutionInfo["colorRange"],
                        "colorSpace": resolutionInfo["colorSpace"],
                        "colorPrimaries": resolutionInfo["colorPrimaries"],
                        "duration": resolutionInfo["duration"],
                        "bitrate": resolutionInfo["videoBitrate"],
                        "qualityMetrics": resolutionInfo["qualityMetrics"],
                        "encoder": resolutionInfo["encoder"]
                    },
                    "audio": {
                        "bitrate": resolutionInfo["audioBitrate"],
                        "sampleFormat": resolutionInfo["audioSampleFormat"],
                        "sampleRate": resolutionInfo["audioSampleRate"],
                        "channels": resolutionInfo["audioChannels"],
                        "channelLayout": resolutionInfo["audioChannelLayout"]
                    },
                    "preview": {
                        "codecId": codecs["preview"]["codecId"],
                        "url": previewUrl,
                        "width": codecs["preview"]["width"],
                        "height": codecs["preview"]["height"],
                        "framerate": codecs["preview"]["framerate"],
                        "pixelFormat": codecs["preview"]["pixelFormat"],
                        "bitDepth": codecs["preview"]["bitDepth"],
                        "colorRange": codecs["preview"]["colorRange"],
                        "colorSpace": codecs["preview"]["colorSpace"],
                        "colorPrimaries": codecs["preview"]["colorPrimaries"],
                        "qualityMetrics": resolutionInfo["qualityMetrics"],
                        "encoder": codecs["preview"]["encoder"]
                    }
                });
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);

                let items = box.getElementsByClassName("video_player_container_effect_items")[0];
                let newEl = document.createElement("div");
                newEl.classList.add("video_player_container_effect_item");
                newEl.innerHTML = '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>';
                let el = items.appendChild(newEl);
                setTimeout(() => {
                    el.remove();
                }, 700);
            }
            //디버그 정보 복사
            if (i == 10) {
                let textarea = document.createElement("textarea");
                document.body.appendChild(textarea);
                textarea.value = JSON.stringify(videoInfo);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);

                let items = box.getElementsByClassName("video_player_container_effect_items")[0];
                let newEl = document.createElement("div");
                newEl.classList.add("video_player_container_effect_item");
                newEl.innerHTML = '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>';
                let el = items.appendChild(newEl);
                setTimeout(() => {
                    el.remove();
                }, 700);
            }
            //재로드
            if (i == 11) {
                let isPaused = video.paused;
                let previousCurrentTime = video.currentTime;
                video.src = "";
                video.load();
                video.src = resolutionInfo["url"];
                video.currentTime = previousCurrentTime;
                (isPaused == false) ? video.play() : null;

                //로드 전 미리보기 이미지
                let thumbnail = box.getElementsByClassName("video_player_thumbnail")[0];
                thumbnail.style.opacity = 1;
                thumbnail.setAttribute("is_load", false);

                //버퍼링 감지 관련
                loadingEndTime = null;
                loadingStartTime = null;
            }
            //개발자 통계
            if (i == 12) {
                if (isShowStatistics == true) {
                    closeContainerStatistics();
                } else {
                    openContainerStatistics();
                }
            }
            //Louibooks에서 시청하기
            if (i == 13) {
                let url = `https://louibooks.com/video/` + partNumber;
                window.open(url);

                //동영상 일시 정지
                video.pause();
            }
        }
        
        contextMenuItem[i].addEventListener("click", click);

        //Louibooks에서 시청하기 관련
        if (i == 13) {
            let containerControlsTopIcon = container.getElementsByClassName("video_player_container_controls_top_icon")[0];
            containerControlsTopIcon.addEventListener("click", click);
        }
    }




    //개발자 통계 관련
    let isShowStatistics = false;
    let containerStatistics = container.getElementsByClassName("video_player_container_statistics")[0];
    let containerStatisticsBox = containerStatistics.getElementsByClassName("video_player_container_statistics_box")[0];
    let containerStatisticsCloseButton = containerStatistics.getElementsByClassName("video_player_container_statistics_top_right")[0];

    containerStatisticsBox.onclick = function(event) {
        isIgnoreClick = true;
    }
    containerStatisticsCloseButton.onclick = function(event) {
        closeContainerStatistics();
    }

    function openContainerStatistics() {
        containerStatistics.style.display = "block";
        isShowStatistics = true;
        function callback45289385() {
            containerStatisticsBox.style.opacity = 1;
        }
        window.requestAnimationFrame(callback45289385);
        
        let timeout = containerStatistics.getAttribute("timeout");
        if (timeout != null && timeout != "null") {
            clearTimeout(timeout);
            containerStatistics.setAttribute("timeout", null);
        }
    }
    function closeContainerStatistics() {
        containerStatisticsBox.style.opacity = 0;
        isShowStatistics = false;
        let timeout = setTimeout(() => {
            containerStatistics.style.display = null;
            containerStatistics.setAttribute("timeout", null);
        }, 200);
        containerStatistics.setAttribute("timeout", timeout);
    }

    let increaseBufferPercent = 0;
    let previousBufferPercent = 0;
    let networkActivity = new Array();
    let maxValueNetworkActivity = 0;
    let progressTimeout = null;
    video.onprogress = (event) => {
        let target = event.target;
        let buffer = target.buffered;

        if (buffer.length != 0) {
            let loaded = 0;
            for (let i = 0; i < buffer.length; i++) {
                if (video.currentTime >= buffer.start(i) && video.currentTime <= buffer.end(i)) {
                    loaded = buffer.end(i);
                    break;
                }
            }
            target.setAttribute("loaded", loaded);
    
            if (progressTimeout != null) {
                clearTimeout(progressTimeout);
                progressTimeout = null;
            }
    
            let line = box.getElementsByClassName("video_player_container_controls_progress_line")[0];
            line.style.transition = "width 0.2s";
            progressTimeout = setTimeout(() => {
                line.style.transition = null;
                progressTimeout = null;
            }, 200);

            //개발자 통계 관련
            let statisticsBuffer = container.getElementsByClassName("video_player_container_statistics_item_buffer")[0];
            let bufferItem = statisticsBuffer.children;
            if (bufferItem.length != buffer.length) {
                statisticsBuffer.textContent = "";
                for (let i = 0; i < buffer.length; i++) {
                    let newEl = document.createElement("div");
                    newEl.classList.add("video_player_container_statistics_item_buffer_item");
                    statisticsBuffer.appendChild(newEl);
                }
            }
            let percent = 0;
            for (let i = 0; i < buffer.length; i++) {
                let duration = Number.parseFloat(video.getAttribute("duration"));
                if (isNaN(video.duration) == false) {
                    duration = video.duration;
                }
                let width = (((buffer.end(i) - buffer.start(i)) / duration) * 100);
                let marginLeft = ((buffer.start(i) / duration) * 100);
                bufferItem[i].style.width = width + "%";
                bufferItem[i].style.marginLeft = marginLeft + "%";

                percent += (width / 100);
            }

            increaseBufferPercent += (percent - previousBufferPercent);
            previousBufferPercent = percent;
        }
    };

    let checkNetworkActivityInterval = setInterval(() => {
        if (document.body.contains(box)) {
            if (networkActivity.length >= maxNetworkActivityLength) {
                networkActivity.shift();
            }

            networkActivity[networkActivity.length] = increaseBufferPercent;
            increaseBufferPercent = 0;

            //최대 값 구하기
            maxValueNetworkActivity = Math.max.apply(null, networkActivity);
        } else {
            clearInterval(checkNetworkActivityInterval);
        }
    }, 1000);

    let line = box.getElementsByClassName("video_player_container_controls_progress_line");
    let circle = box.getElementsByClassName("video_player_container_controls_progress_circle")[0];
    let progressWrap = box.getElementsByClassName("video_player_container_controls_progress_wrap")[0];
    let isMovePossible = false;
    let isMouseOver = false;
    let isTouchStart = false;
    //마우스
    progressWrap.onmouseover = (event) => {
        progressWrapStart(event);
    }
    progressWrap.onmouseout = (event) => {
        progressWrapEnd(event);
    }
    //터치
    progressWrap.ontouchstart = (event) => {
        progressWrapStart(event);
        isTouchStart = true;
    }
    progressWrap.ontouchend = (event) => {
        progressWrapEnd(event);
    }
    progressWrap.ontouchcancel = (event) => {
        progressWrapEnd(event);
    }
    progressWrap.onclick = (event) => {
        if (isTouchStart == true) {
            progressWrapEnd(event);   
        }
    }

    let previousBodyScroll = null;
    function progressWrapStart(event) {
        isMouseOver = true;
        isMovePossible = true;

        if (hideControlsTimeout != null) {
            clearTimeout(hideControlsTimeout);
            hideControlsTimeout = null;
        }
        controlsWrap.classList.add("show_video_player_container_controls_progress_select");
        container.classList.add("hide_touch_device_video_player_container_controls");

        //터치라면 스크롤 안되게
        if (event.type == "touchstart") {
            previousBodyScroll = isPossibleBodyScroll();
            setBodyScroll(false);
            impossiblePullToRefresh(getCurrentMenuNumber());
        }
    }
    function progressWrapEnd(event) {
        if (isMouseDown == false) {
            isMovePossible = false;

            previewVideo.setAttribute("current_time", -1);
            controlsWrap.classList.remove("show_video_player_container_controls_progress_select");
        }
        isMouseOver = false;
        container.classList.remove("hide_touch_device_video_player_container_controls");

        //스크롤 관련
        if (previousBodyScroll != null) {
            setBodyScroll(previousBodyScroll);
            previousBodyScroll = null;
            possiblePullToRefresh(getCurrentMenuNumber());
        }
    }

    function move(event) {
        if (isMovePossible == true) {
            let scale = box.getAttribute("scale");
            (scale == null || scale == "null") ? scale = 1 : null;
            scale = Number.parseFloat(scale);
            
            let rect = progressWrap.getBoundingClientRect();
            let x = null;
            if (event.type == "mousemove" || event.type == "mousedown") {
                x = event.clientX - rect.left;
            } else if (event.type == "touchmove" || event.type == "touchstart") {
                x = event.touches[0].clientX - rect.left;
            }
            x /= scale;

            //픽셀 반올림 값
            let pixelRound = (1 / (window.devicePixelRatio * scale));

            //퍼센트 구하기
            let percent = 0;
            if (rect.width != 0) {
                percent = x / rect.width;
            }
            (percent > 1) ? percent = 1 : null;
            (percent < 0) ? percent = 0 : null;

            let duration = Number.parseFloat(video.getAttribute("duration"));
            if (isNaN(video.duration) == false) {
                duration = video.duration;
            }

            if (isMouseDown == true) {
                let moveTime = (duration * percent);

                //이동한 시간 (간격 제한 없는 값)
                video.setAttribute("move_time", moveTime);
            }

            let line1_width = (rect.width * percent);
            line1_width = Math.round(line1_width / pixelRound) * pixelRound;
            line1_width = Math.floor(line1_width * 1000000) / 1000000;
            line1_width += "px";
            (line[1].style.width != line1_width) ? line[1].style.width = line1_width : null;
            (circle.style.marginLeft != line1_width) ? circle.style.marginLeft = line1_width : null;

            //미리보기
            let previewTime = controlsWrap.getElementsByClassName("video_player_container_controls_preview_box_time")[0];
            let previewBox = controlsWrap.getElementsByClassName("video_player_container_controls_preview_box")[0];
            previewBox.setAttribute("percent", percent);
            let previewTimeText = secondsToTime(Math.round(duration * percent));
            (previewTime.innerHTML != previewTimeText) ? previewTime.innerHTML = previewTimeText : null;

            let previewRound = (1 / previewFramerate);
            let previewVideoTime = Math.round((duration * percent) / previewRound) * previewRound;
            previewVideoTime = Math.floor(previewVideoTime * 1000000) / 1000000; //소숫점 6자리까지

            let previewCurrentTime = previewVideo.getAttribute("current_time");
            if (previewCurrentTime != previewVideoTime) {
                let isLoading = previewVideo.getAttribute("is_loading");
                if (isLoading == null) {
                    isLoading = false;
                } else if (isLoading == "true") {
                    isLoading = true;
                } else if (isLoading == "false") {
                    isLoading = false;
                }

                if (isLoading == false) {
                    if (previewDataList["time_" + previewVideoTime] == null) {
                        //미리보기 데이터가 없으면
                        previewVideo.currentTime = previewVideoTime;
                        previewVideo.setAttribute("is_loading", true);
                    } else {
                        //미리보기 데이터가 있으면 그리기
                        drawPreviewCanvas(previewDataList["time_" + previewVideoTime]);
                    }
                    previewVideo.setAttribute("current_time", previewVideoTime);
                } else {
                    if (previewDataList["time_" + previewVideoTime] == null) {
                        previewVideo.setAttribute("request_time", previewVideoTime);
                    } else {
                        //미리보기 데이터가 있으면 그리기
                        drawPreviewCanvas(previewDataList["time_" + previewVideoTime]);
                        previewVideo.setAttribute("is_loading", false);
                    }
                }

                //상세한 미리보기 관련
                let nowDate = new Date().getTime();
                let previewFocusTime = screenPreviewDetailed.getAttribute("focus_time");
                if (previewFocusTime != null && previewFocusTime != "null") {
                    screenPreviewDetailed.setAttribute("focus_time", nowDate);
                    screenPreviewDetailed.setAttribute("is_show", false);
                    screenPreviewDetailed.style.opacity = 0;
                    previewDetailedVideo.style.opacity = 0;
                    previewDetailedVideo.pause();
                    previewDetailedVideo.muted = true;
                    previewScreen.style.maxHeight = null;
                }
            }
        }
    }

    //재생바 이동
    let isPlayMouseDown = null;
    let isMouseDown = false;
    function down(event) {
        if (isMouseOver == true) {
            isMouseDown = true;
            isIgnoreClick = true;
            move(event);

            if (video.paused == false) {
                isPlayMouseDown = true;
                video.pause();
            }
        }
        controlsWrap.classList.add("focus_video_player_container_controls_progress");
        checkPreviewVideo(); //체크 프리뷰
    }
    function up() {
        if (isMovePossible == true) {
            let moveTime = Number.parseFloat(video.getAttribute("move_time"));
            saveTimeDistoryVideoPlayer(uniqueNumber, moveTime);
            video.currentTime = moveTime;
            if (isMouseOver == false) {
                isMovePossible = false;
            }

            if (isMouseOver == false) {
                previewVideo.setAttribute("current_time", -1);
                controlsWrap.classList.remove("show_video_player_container_controls_progress_select");
            }

            function callback2() {
                if (isMouseOver == true && hideControlsTimeout != null) {
                    clearTimeout(hideControlsTimeout);
                    hideControlsTimeout = null;
                }
            }
            window.requestAnimationFrame(callback2);

            if (isPlayMouseDown == true) {
                video.play();
                isPlayMouseDown = null;
            }
        }
        isMouseDown = false;
        function callback() {
            isIgnoreClick = false;
        }
        window.requestAnimationFrame(callback);

        controlsWrap.classList.remove("focus_video_player_container_controls_progress");
    }
    //마우스
    document.addEventListener("mousemove", move);
    document.addEventListener("mousedown", down);
    document.addEventListener("mouseup", up);
    //터치
    document.addEventListener("touchmove", move);
    document.addEventListener("touchstart", down);
    document.addEventListener("touchend", up);

    //재생바 표시 및 숨기기
    let hideControlsTimeout = null;
    videoPlayer.onmousemove = userInteraction;
    videoPlayer.onclick = userInteraction;

    let isContainerInteraction = false;
    function containerInteraction(event) {
        isContainerInteraction = true;
        if (hideControlsTimeout != null) {
            clearTimeout(hideControlsTimeout);
            hideControlsTimeout = null;
        }

        function containerInteractionEnd() {
            //마우스
            document.removeEventListener("mouseup", containerInteractionEnd);
            //터치
            document.removeEventListener("touchend", containerInteractionEnd);
            document.removeEventListener("touchcancel", containerInteractionEnd);

            isContainerInteraction = false;
            hideControlsTimeout = setTimeout(() => {
                hideControls(true);
                hideControlsTimeout = null;
            }, (hideControlsSeconds * 1000));
        }
        //마우스
        document.addEventListener("mouseup", containerInteractionEnd);
        //터치
        document.addEventListener("touchend", containerInteractionEnd);
        document.addEventListener("touchcancel", containerInteractionEnd);
    }
    container.addEventListener("mousedown", containerInteraction);
    container.addEventListener("touchstart", containerInteraction);

    touchDeviceControls.onclick = function(event) {
        isIgnoreBoxClick = true;
    }



    function userInteraction() {
        //데스크톱이면
        if (isTouchDevice() == false) {
            if (((isMovePossible == false && isMouseOver == false) == true) && isContainerInteraction == false) {
                showControls();
                
                if (hideControlsTimeout != null) {
                    clearTimeout(hideControlsTimeout);
                    hideControlsTimeout = null;
                }
                hideControlsTimeout = setTimeout(() => {
                    hideControls(true);
                    hideControlsTimeout = null;
                }, (hideControlsSeconds * 1000));
            }
        }
    }

    function showControls() {
        controlsWrap.style.cursor = null;
        controlsWrap.style.pointerEvents = null;
        controlsWrap.classList.add("show_video_player_container_controls");

        if (isTouchDevice() == true) {
            container.classList.add("show_touch_device_video_player_container_controls");
        }
    }
    function hideControls(isHideCursor) {
        controlsWrap.classList.remove("show_video_player_container_controls");
        container.classList.remove("show_touch_device_video_player_container_controls");

        if (isTouchDevice() == true || isHideCursor == false) {
            controlsWrap.style.cursor = null;
            controlsWrap.style.pointerEvents = null;
        } else {
            controlsWrap.style.cursor = "none";
            controlsWrap.style.pointerEvents = "all";
        }
    }
    videoPlayer.onmouseleave = function() {
        if (isMovePossible == false && isContainerInteraction == false) {
            hideControls(false);
        }
    }


























    //사운드 조절
    let containerSoundIcon = box.getElementsByClassName("video_player_container_sound_icon");
    let controlsSoundWrap = box.getElementsByClassName("video_player_container_controls_sound_wrap")[0];
    let controlsSoundLines = box.getElementsByClassName("video_player_container_controls_sound_lines")[0];
    let controlsSoundLine = box.getElementsByClassName("video_player_container_controls_sound_line")[0];
    let controlsSoundCircle = box.getElementsByClassName("video_player_container_controls_sound_circle")[0];
    let containerSound = box.getElementsByClassName("video_player_container_sound")[0];

    function soundWrapDown(event) {
        let scale = box.getAttribute("scale");
        (scale == null || scale == "null") ? scale = 1 : null;
        scale = Number.parseFloat(scale);
        let videoVolume = getVolumeVideoPlayer(uniqueNumber);

        if (videoVolume != 0) {
            setCookie("videoPreviousVolume", videoVolume);
        }
        
        function soundWrapMove(event) {
            let linesRect = controlsSoundLines.getBoundingClientRect();
            let circleRect = controlsSoundCircle.getBoundingClientRect();

            //퍼센트 구하기
            let left = linesRect.left + (circleRect.width / 2);
            let width = (linesRect.width - circleRect.width);

            let x = null;
            if (event.type == "mousemove" || event.type == "mousedown") {
                x = (event.clientX / scale) - left;
            } else if (event.type == "touchmove" || event.type == "touchstart") {
                x = (event.touches[0].clientX / scale) - left;
            }

            let percent = 0;
            if (width != 0) {
                percent = x / width;
            }
            (percent > 1) ? percent = 1 : null;
            (percent < 0) ? percent = 0 : null;

            let volume = Math.round((percent) * 10000) / 10000;
            setVolumeVideoPlayer(uniqueNumber, volume);
            setCookie("videoVolume", volume);
        }
        soundWrapMove(event); //실행

        function soundWrapEnd() {
            //마우스
            document.removeEventListener("mousemove", soundWrapMove);
            document.removeEventListener("mouseup", soundWrapEnd);
            //터치
            document.removeEventListener("touchmove", soundWrapMove);
            document.removeEventListener("touchend", soundWrapEnd);
        }

        //마우스
        document.addEventListener("mousemove", soundWrapMove);
        document.addEventListener("mouseup", soundWrapEnd);
        //터치
        document.addEventListener("touchmove", soundWrapMove);
        document.addEventListener("touchend", soundWrapEnd);
    }
    controlsSoundWrap.addEventListener("mousedown", soundWrapDown);
    controlsSoundWrap.addEventListener("touchstart", soundWrapDown);





    //사운드 조절 - 2
    let containerSoundLines = box.getElementsByClassName("video_player_container_sound_lines")[0];
    let containerSoundLine = box.getElementsByClassName("video_player_container_sound_line")[0];

    function containerSoundWrapDown(event) {
        let scale = box.getAttribute("scale");
        (scale == null || scale == "null") ? scale = 1 : null;
        scale = Number.parseFloat(scale);
        let videoVolume = getVolumeVideoPlayer(uniqueNumber);

        if (videoVolume != 0) {
            setCookie("videoPreviousVolume", videoVolume);
        }

        let linesRect = containerSoundLines.getBoundingClientRect();
        let lineRect = containerSoundLine.getBoundingClientRect();

        //
        if (containerSoundTimeoutVideoPlayer[uniqueNumber] != null) {
            clearTimeout(containerSoundTimeoutVideoPlayer[uniqueNumber]);
            containerSoundTimeoutVideoPlayer[uniqueNumber] = null;
        }

        containerSoundLines.style.transform = "scale(1.05)";
        containerSoundLine.style.transition = "unset";

        let previousY = null;
        if (event.type == "mousemove" || event.type == "mousedown") {
            previousY = event.clientY;
        } else if (event.type == "touchmove" || event.type == "touchstart") {
            previousY = event.touches[0].clientY;
        }
        previousY /= scale;

        let previousPercent = (lineRect.height / linesRect.height);
        function containerSoundWrapMove(event) {
            //퍼센트 구하기
            let height = (linesRect.height * 1.05);

            let y = null;
            if (event.type == "mousemove" || event.type == "mousedown") {
                y = event.clientY;
            } else if (event.type == "touchmove" || event.type == "touchstart") {
                y = event.touches[0].clientY;
            }
            y /= scale;

            let percent = (previousY - y);
            if (height != 0) {
                percent /= height;
            }
            percent += previousPercent;
            (percent > 1) ? percent = 1 : null;
            (percent < 0) ? percent = 0 : null;

            let volume = Math.round((percent) * 10000) / 10000;
            setVolumeVideoPlayer(uniqueNumber, volume);
            setCookie("videoVolume", volume);
        }
        containerSoundWrapMove(event); //실행

        function containerSoundWrapEnd() {
            //
            containerSound.classList.add("show_video_player_container_sound");
            containerSoundTimeoutVideoPlayer[uniqueNumber] = setTimeout(() => {
                containerSound.classList.remove("show_video_player_container_sound");
            }, 2000);

            containerSoundLines.style.transform = null;
            containerSoundLine.style.transition = null;

            //마우스
            document.removeEventListener("mousemove", containerSoundWrapMove);
            document.removeEventListener("mouseup", containerSoundWrapEnd);
            //터치
            document.removeEventListener("touchmove", containerSoundWrapMove);
            document.removeEventListener("touchend", containerSoundWrapEnd);

            //클릭 무시
            isIgnoreClick = true;
            function callback5756841() {
                isIgnoreClick = false;
            }
            window.requestAnimationFrame(callback5756841);
        }

        //마우스
        document.addEventListener("mousemove", containerSoundWrapMove);
        document.addEventListener("mouseup", containerSoundWrapEnd);
        //터치
        document.addEventListener("touchmove", containerSoundWrapMove);
        document.addEventListener("touchend", containerSoundWrapEnd);
    }

    containerSoundLines.addEventListener("mousedown", containerSoundWrapDown);
    containerSoundLines.addEventListener("touchstart", containerSoundWrapDown);




    







    //전체 화면 전환 시 가로 모드로 변경
    box.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement) {
            screen.orientation.lock("landscape").catch(error => {
                //대충 오류 남
            });
        } else {
            screen.orientation.unlock();
        }
    });













    //컨트롤러 버튼 클릭 효과 이벤트 등록
    let controlsItem = controlsWrap.getElementsByClassName("video_player_container_controls_item");
    for (let i = 0; i < controlsItem.length; i++) {
        let target = controlsItem[i];

        function click(event) {
            //플레이 및 일시정지 버튼일 경우
            if (i == 1) {
                //동영상 다 봤는지
                let duration = Number.parseFloat(video.getAttribute("duration"));
                (isNaN(video.duration) == false) ? duration = video.duration : null;

                let isVideoEnded = false;
                if (video.paused == true && Math.abs(video.currentTime - duration) < 0.01) {
                    isVideoEnded = true;
                }

                if (isVideoEnded == true) {
                    video.currentTime = 0;
                    video.play();
                } else if (video.paused == true) {
                    video.play();
                } else {
                    video.pause();
                }
            }
            //설정
            if (i == 5) {
                let isShow = containerSettings.getAttribute("is_show");
                if (isShow == true || isShow == "true") {
                    closeSettings();
                } else {
                    openSettings();

                    if (isTouchDevice() == true) {
                        //컨트롤러 숨기기
                        hideControls(false);
                    }
                }
                isContainerSettingsClick = true;
            }
            //소형 플레이어 켜기 및 끄기
            if (i == 6) {
                if (document.pictureInPictureElement == null) {
                    video.requestPictureInPicture();
                } else {
                    document.exitPictureInPicture();
                }
            }
            //전체 화면 켜기 및 끄기
            if (i == 8) {
                if (document.fullscreenElement == null) {
                    box.requestFullscreen();
                } else {
                    document.exitFullscreen();
                }
            }
        }

        let isFocusEvent = false;
        function hoverStart(event) {
            if (controlsWrap.classList.contains("show_video_player_container_controls")) {
                let isTouch = target.getAttribute("is_touch");
                if (isTouch == true || isTouch == "true") {
                    isTouch = true;
                } else {
                    isTouch = false;
                }
                //터치가 아니라면
                if (isTouch == false && isContainerInteraction == false) {
                    target.setAttribute("is_hover", true);
                }
    
                //포커스 이벤트라면
                if (event.type == "focus") {
                    isFocusEvent = true;
                    isContainerInteraction = true;
                    if (hideControlsTimeout != null) {
                        clearTimeout(hideControlsTimeout);
                        hideControlsTimeout = null;
                    }
    
                    //스크린 리더용 텍스트 모두 제거
                    let createTextNode = document.getElementsByTagName("createtextnode");
                    for (let i = 0; i < createTextNode.length; i++) {
                        createTextNode[i].remove();
                    }
    
                    let focusText = target.getAttribute("focus_text");
                    let newElement = document.createElement("createTextNode");
                    newElement.innerHTML = `
                        <spen class = "text_hidden">` + focusText + `</spen>
                    `;
                    target.append(newElement);
                }
            }
        }
        function hoverEnd(event) {
            target.setAttribute("is_hover", false);
            
            if (isFocusEvent == true) {
                isContainerInteraction = false;
                isFocusEvent = false;
            }
        }
        function touchStart(event) {
            target.setAttribute("is_touch", true);

            function touchEnd(event) {
                target.setAttribute("is_touch", true);
            }
            document.addEventListener("touchend", touchEnd);
        }

        controlsItem[i].addEventListener("click", click);
        controlsItem[i].addEventListener("mouseenter", hoverStart);
        controlsItem[i].addEventListener("mouseleave", hoverEnd);
        controlsItem[i].addEventListener("touchstart", touchStart);
        controlsItem[i].addEventListener("focus", hoverStart);
        controlsItem[i].addEventListener("blur", hoverEnd);
    }







    let isShowSettings = false;
    function openSettings() {
        controlsItem[5].classList.add("show_settings_video_player_container_controls_item");

        containerSettings.style.pointerEvents = "all";
        containerSettings.setAttribute("is_show", true);
        containerSettings.style.display = "flex";
        function callback179316925() {
            containerSettingsItems.style.opacity = 1;
        }
        window.requestAnimationFrame(callback179316925);

        let timeout = containerSettings.getAttribute("timeout");
        if (timeout != null && timeout != "null") {
            clearTimeout(timeout);
            containerSettings.setAttribute("timeout", null);
        }

        let item = getVideoPlayerSettingsItemElement(uniqueNumber, "main");
        containerSettingsItems.textContent = "";
        containerSettingsItems.appendChild(item);

        isShowSettings = true;
    }
    function closeSettings() {
        controlsItem[5].classList.remove("show_settings_video_player_container_controls_item");

        containerSettings.style.pointerEvents = null;
        containerSettings.setAttribute("is_show", false);
        containerSettingsItems.style.opacity = null;

        let timeout = setTimeout(() => {
            containerSettings.style.display = null;
            containerSettings.setAttribute("timeout", null);
            containerSettingsItems.textContent = "";
        }, 200);
        containerSettings.setAttribute("timeout", timeout);

        isShowSettings = false;
    }






    


    //동영상, 오디오 비트레이트 구하기
    let checkBitrateInterval = null;
    function registerCheckBitrate() {
        let lastVideoDecodedByteCount = video.webkitVideoDecodedByteCount;
        let lastAudioDecodedByteCount = video.webkitAudioDecodedByteCount;
        video.setAttribute("is_check_bitrate", true);

        checkBitrateInterval = setInterval(() => {
            if (document.body.contains(box)) {
                let videoBitrate = (((video.webkitVideoDecodedByteCount - lastVideoDecodedByteCount) / 1000) * 8);
                let audioBitrate = (((video.webkitAudioDecodedByteCount - lastAudioDecodedByteCount) / 1000) * 8);
                (isNaN(videoBitrate) == true) ? videoBitrate = 0 : null;
                (isNaN(audioBitrate) == true) ? audioBitrate = 0 : null;
                video.setAttribute("video_bitrate", videoBitrate);
                video.setAttribute("audio_bitrate", audioBitrate);

                lastVideoDecodedByteCount = video.webkitVideoDecodedByteCount;
                lastAudioDecodedByteCount = video.webkitAudioDecodedByteCount;
            } else {
                video.setAttribute("is_check_bitrate", false);
                clearInterval(checkBitrateInterval);
            }
        }, 1000);
    }
    registerCheckBitrate();

    //동영상 시간 이동 완료시 발생하는 이벤트
    function cancelCheckBitrate() {
        video.setAttribute("is_check_bitrate", false);
        clearInterval(checkBitrateInterval);
    }
    video.addEventListener("seeked", cancelCheckBitrate);

    //로딩이 시작된 시간
    let loadingStartTime = null;
    //로딩이 끝난 시간
    let loadingEndTime = null;
    //
    video.onseeking = function() {
        loadingStartTime = null;
        loadingEndTime = null;
    }
    let isVideoSeeked = false;
    video.onseeked = function() {
        decodedFrames ++;

        isVideoSeeked = true;
        function callback18832809756() {
            isVideoSeeked = false;
        }
        window.requestAnimationFrame(callback18832809756);
    }

    //전체화면 전환
    box.onfullscreenchange = function() {
        if (document.fullscreenElement == null) {
            checkVideoPlayerFullscreenInterface(uniqueNumber, false);
            possiblePullToRefresh(getCurrentMenuNumber());
        } else {
            checkVideoPlayerFullscreenInterface(uniqueNumber, true);
            impossiblePullToRefresh(getCurrentMenuNumber());
        }
    }

    let dynamicLighting = box.parentElement.parentElement.getElementsByClassName("video_player_dynamic_lighting");
    if (dynamicLighting.length != 0) {
        dynamicLighting = dynamicLighting[0];
        dynamicLighting.style.display = "none";
        function callback237716674() {
            dynamicLighting.style.opacity = null;
            dynamicLighting.style.display = null;
        }
        window.requestAnimationFrame(callback237716674);
    } else {
        dynamicLighting = null;
    }

    let audioContextList = new Array();
    function setVideoVolume(el, volume) {
        let audioNumber = el.getAttribute("audio_number");
        let audioContext = audioContextList[audioNumber];
        if (audioContext == null) {
            if (el.paused == false && window.AudioContext != null) {
                let context = new window.AudioContext;
                let result = {
                    context: context,
                    source: context.createMediaElementSource(el),
                    limiter: context.createDynamicsCompressor(),
                    gain: context.createGain(),
                    analyser: context.createAnalyser(),
                    amplify: function(volume) {
                        result.gain.gain.value = volume;
                    },
                    getAmpLevel: function() {
                        return result.gain.gain.value;
                    }
                };

                result.limiter.threshold.value = -6;
                result.limiter.knee.value = 30;
                result.limiter.ratio.value = 2;
                result.limiter.attack.value = 0.005;
                result.limiter.release.value = 0.2;

                //이퀄라이저
                let frequencyRanges = [32, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 12500, 16000];
                let gainValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

                let eqNodes = frequencyRanges.map((freq, index) => {
                    let eqNode = context.createBiquadFilter();
                    eqNode.type = 'peaking';
                    eqNode.frequency.value = freq;
                    eqNode.gain.value = gainValues[index];
                    eqNode.Q.value = 1;
                    return eqNode;
                });
                result["eqNodes"] = eqNodes;

                //HRTF
                let pannerNode = context.createPanner();
                pannerNode.panningModel = 'equalpower';
                pannerNode.distanceModel = 'linear';
                pannerNode.setOrientation(0, 0, -1, 0, 1, 0);
                pannerNode.setPosition(0, 0, 0);
                pannerNode.coneInnerAngle = 360;
                pannerNode.coneOuterAngle = 0;
                pannerNode.coneOuterGain = 0;
                pannerNode.refDistance = 1;
                pannerNode.rolloffFactor = 1;
                pannerNode.reflectionCoefficient = 0.45;
                result["pannerNode"] = pannerNode;

                //오디오 노드 연결
                result.source.connect(result.gain);

                //오디오 부스터 노드 연결
                eqNodes.reduce((prevNode, currentNode) => {
                    prevNode.connect(currentNode);
                    return currentNode;
                }, result.gain);

                eqNodes[eqNodes.length - 1].connect(pannerNode).connect(result.limiter).connect(context.destination);
                result.amplify(volume);

                //오디오 데시벨 분석
                result.analyser.fftSize = 2048;
                result.analyser.smoothingTimeConstant = 0.8;
                result.source.connect(result.analyser);

                let bufferLength = result.analyser.frequencyBinCount;
                let dataArray = new Float32Array(bufferLength);
                result["analyserDataArray"] = dataArray;

                audioNumber = Math.floor(Math.random() * 999999999999);
                el.setAttribute("audio_number", audioNumber);
                audioContextList[audioNumber] = result;

                el.volume = 1;
            } else {
                (volume > 1) ? volume = 1 : null;
                (volume < 0) ? volume = 0 : null;
                el.volume = volume;
            }
        } else {
            audioContext.amplify(volume);

            //HRTF
            let isUseHeadRelatedTransferFunction = getVideoPlayerSettingsValue("isUseHeadRelatedTransferFunction");
            let pannerNode = audioContext.pannerNode;
            if (isUseHeadRelatedTransferFunction == true) {
                pannerNode.panningModel = 'HRTF';
                pannerNode.distanceModel = 'inverse';
            } else {
                pannerNode.panningModel = 'equalpower';
                pannerNode.distanceModel = 'linear';
            }

            //오디오 부스터
            let audioBooster = getVideoPlayerSettingsValue("audioBooster");
            if (audioBooster == 0) {
                let eqNodes = audioContext.eqNodes;
                for (let i = 0; i < eqNodes.length; i++) {
                    eqNodes[i].type = "allpass";
                }
            } else {
                let strength = 0.5;
                let boosterStrength = (strength * audioBooster);
                let gainValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                //저역대
                gainValues[0] = (boosterStrength * 1);
                gainValues[1] = (boosterStrength * 2);
                gainValues[2] = (boosterStrength * 3);
                gainValues[3] = (boosterStrength * 2.5);
                gainValues[4] = (boosterStrength * 1);
                //고역대
                gainValues[6] = (boosterStrength * 0.125);
                gainValues[7] = (boosterStrength * 0.25);
                gainValues[8] = (boosterStrength * 2);
                gainValues[9] = (boosterStrength * 1.75);
                gainValues[10] = (boosterStrength * 1.5);

                let eqNodes = audioContext.eqNodes;
                for (let i = 0; i < eqNodes.length; i++) {
                    eqNodes[i].type = "peaking";
                    eqNodes[i].gain.value = gainValues[i];
                }
            }
        }
    }
    function getVideoDecibel(el, percent) {
        let audioNumber = el.getAttribute("audio_number");
        let audioContext = audioContextList[audioNumber];
        if (audioContext != null) {
            let analyser = audioContext.analyser;
            let dataArray = audioContext.analyserDataArray;

            analyser.getFloatTimeDomainData(dataArray);
            let rms = 0;
            for (let i = 0; i < dataArray.length; i++) {
              rms += dataArray[i] * dataArray[i];
            }
            rms /= dataArray.length;

            let decibel = 20 * Math.log10(Math.sqrt(rms));
            let dBAdjustment = 20 * Math.log10(percent);
            return (decibel + dBAdjustment);
        }
        return Infinity;
    }
    
    let processingPerSecond = 0;
    let framesPerSecond = 0;
    let decodedFrames = (video.webkitDecodedFrameCount || video.mozDecodedFrames);
    let droppedFrames = video.webkitDroppedFrameCount;
    let previousVideoRect = null;
    let isDecodedFrames = false;
    let isPreviousLoad = false;
    let previousSize = {
        "width": null,
        "height": null
    };
    let previousVideoInfo = null;
    let previousTimestamp = null;
    let previousObjectFit = null;
    let previousAspectRatio = null;
    let hasBeenFullScreened = false;
    callback(); //실행
    function callback(timestamp) {
        if (previousTimestamp === timestamp) { return };
        previousTimestamp = timestamp;

        if (document.body.contains(box)) {
            let viewport = getVisualViewport();

            let container = box.getElementsByClassName("video_player_container")[0];
            let video = box.getElementsByTagName("video")[0];

            //PIP 모드 해제
            if (isVideoVisible() == false && document.pictureInPictureElement == video) {
                document.exitPictureInPicture();
            }

            //미디어 세션 API
            if ("mediaSession" in navigator) {
                if (isVideoVisible() == true) {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: property["videoTitle"],
                        artist: property["originatorName"],
                        album: (property["workTitle"] + " · " + property["chapterTitle"]),
                        artwork: [
                            {
                                src: property["thumbnailImage"],
                                sizes: '1280x720',
                                type: 'image/webp'
                            }
                        ]
                    });
                    //이전 트랙
                    if (property["previous"]["onclick"] != null) {
                        navigator.mediaSession.setActionHandler('previoustrack', function() {
                            if (isVideoVisible() == true) {
                                eval(property["previous"]["onclick"]);
                            } else {
                                actionMessage(getLanguage("video_player_impossible_media_session_message"));
                            }
                        });
                    } else {
                        navigator.mediaSession.setActionHandler('previoustrack', null);
                    }
                    //다음 트랙
                    if (property["next"]["onclick"] != null) {
                        navigator.mediaSession.setActionHandler('nexttrack', function() {
                            if (isVideoVisible() == true) {
                                eval(property["next"]["onclick"]);
                            } else {
                                actionMessage(getLanguage("video_player_impossible_media_session_message"));
                            }
                        });
                    } else {
                        navigator.mediaSession.setActionHandler('nexttrack', null);
                    }
                    navigator.mediaSession.setActionHandler('seekbackward', function() {
                        if (isVideoVisible() == true) {
                            video.currentTime -= 5;
                        } else {
                            actionMessage(getLanguage("video_player_impossible_media_session_message"));
                        }
                    });
                    navigator.mediaSession.setActionHandler('seekforward', function() {
                        if (isVideoVisible() == true) {
                            video.currentTime += 5;
                        } else {
                            actionMessage(getLanguage("video_player_impossible_media_session_message"));
                        }
                    });
                    //재생
                    navigator.mediaSession.setActionHandler('play', function() {
                        if (isVideoVisible() == true) {
                            video.play();
                        } else {
                            actionMessage(getLanguage("video_player_impossible_media_session_message"));
                        }
                    });
                }
            }

            //동영상 음량
            let videoVolume = getVolumeVideoPlayer(uniqueNumber);
            let realVideoVolume = videoVolume;
            let attenuationPercent = 1;
            //오디오 노멀라이즈
            let isUseLoudnessNormalizer = getVideoPlayerSettingsValue("isUseLoudnessNormalizer");
            if (resolutionInfo != null && resolutionInfo["contentLoudness"] != null && isUseLoudnessNormalizer == true) {
                let targetLufs = -13;
                let currentLufs = resolutionInfo["contentLoudness"];
                let differenceLufs = (targetLufs - currentLufs);
                attenuationPercent = Math.pow(10, differenceLufs / 20);
                realVideoVolume = (attenuationPercent * videoVolume);
            }
            setVideoVolume(video, realVideoVolume);

            //보이는지 여부
            let isVisible = isVisibleElement(box);
            if (isVisible == false) {
                window.requestAnimationFrame(callback);
                return;
            }

            let rect = box.getBoundingClientRect();
            let scale = box.getAttribute("scale");
            (scale == null || scale == "null") ? scale = 1 : null;
            let isResize = false;

            //동영상 길이
            let duration = Number.parseFloat(video.getAttribute("duration"));
            (isNaN(video.duration) == false) ? duration = video.duration : null;

            //로딩바
            let isLoad = false;
            let loading = box.getElementsByClassName("video_player_container_loading")[0];
            let loadingShowbox = loading.getElementsByClassName("showbox")[0];
            if (isMouseDown == false && video.readyState < video.HAVE_FUTURE_DATA) {
                loading.classList.add("show_video_player_container_loading");
                isLoad = false;
                video.setAttribute("is_load", false);

                loadingShowbox.style.visibility = "visible";
            } else {
                loading.classList.remove("show_video_player_container_loading");
                isLoad = true;
                video.setAttribute("is_load", true);

                loadingShowbox.style.visibility = null;
            }
            (isLoad != isPreviousLoad) ? isResize = true : null;
            isPreviousLoad = isLoad;

            if (previousSize == null || rect.width != previousSize["width"] || rect.height != previousSize["height"]) {
                isResize = true;

                previousSize = {
                    "width": rect.width,
                    "height": rect.height
                }
            }

            //디코딩된 프레임
            let previousDecodedFrames = decodedFrames;
            decodedFrames = (video.webkitDecodedFrameCount || video.mozDecodedFrames);
            if (previousDecodedFrames != decodedFrames || decodedFrames == null) {
                let addFrames = (decodedFrames - previousDecodedFrames);
                if (isNaN(addFrames) == false) {
                    framesPerSecond += addFrames;
                    setTimeout(() => {
                        framesPerSecond -= addFrames;
                    }, 1000);
                }

                function callback323771794312() {
                    isDecodedFrames = true;
                }
                window.requestAnimationFrame(callback323771794312);
            }
            //손실 프레임
            droppedFrames = video.webkitDroppedFrameCount;

            //초당 처리
            processingPerSecond ++;
            setTimeout(() => {
                processingPerSecond --;
            }, 1000);

            //동영상 품질
            checkResolutionInfo();

            //컨테이너 가로 세로 비율
            let aspectRatio = getVideoPlayerSettingsValue("aspectRatio");

            let boxParent = box.parentElement;
            if (boxParent.classList.contains("menu_video_left_box_in") && previousAspectRatio != aspectRatio) {
                let aspectRatioList = new Array(
                    (1 / 1), (4 / 3), (16 / 9), (21 / 9)
                )

                if (aspectRatio == -2) {
                    function findClosestAspectRatio(targetRatio, aspectRatioList) {
                        let closestRatio = aspectRatioList[0];
                        let minDifference = Math.abs(targetRatio - closestRatio);
                        for (let i = 1; i < aspectRatioList.length; i++) {
                            let currentRatio = aspectRatioList[i];
                            let difference = Math.abs(targetRatio - currentRatio);
                            if (difference < minDifference) {
                                closestRatio = currentRatio;
                                minDifference = difference;
                            }
                        }
                        return closestRatio;
                    }
                    let width = (window.screen.width * window.devicePixelRatio);
                    let height = (window.screen.height * window.devicePixelRatio);
                    if (width < height) {
                        boxParent.style.aspectRatio = (16 / 9);
                    } else {
                        boxParent.style.aspectRatio = findClosestAspectRatio((width / height), aspectRatioList);
                    }
                } else if (aspectRatio == -1) {
                    boxParent.style.aspectRatio = (resolutionInfo["width"] / resolutionInfo["height"]);
                } else if (aspectRatio == 0) {
                    boxParent.style.aspectRatio = aspectRatioList[0];
                } else if (aspectRatio == 1) {
                    boxParent.style.aspectRatio = aspectRatioList[1];
                } else if (aspectRatio == 2) {
                    boxParent.style.aspectRatio = aspectRatioList[2];
                } else if (aspectRatio == 3) {
                    boxParent.style.aspectRatio = aspectRatioList[3];
                }

                boxParent.setAttribute("change_aspect_ratio", true);
                previousAspectRatio = aspectRatio;
            }

            //콘텐츠 자리 맞춤 방식
            let objectFit = getVideoPlayerSettingsValue("objectFit");

            let videoRect = null;
            if (isResize == true || previousObjectFit != objectFit) {
                let videoWidth = video.videoWidth;
                let videoHeight = video.videoHeight;
                (videoWidth == null) ? videoWidth = resolutionInfo["width"] : null;
                (videoHeight == null) ? videoHeight = resolutionInfo["height"] : null;

                video.setAttribute("width", (videoWidth + "px"));
                video.setAttribute("height", (videoHeight + "px"));

                if (objectFit == "contain") {
                    video.style.width = (rect.width + "px");
                    video.style.height = "auto";

                    videoRect = video.getBoundingClientRect();
                    previousVideoRect = video.getBoundingClientRect();
    
                    if (videoRect.height > rect.height) {
                        video.style.width = "auto";
                        video.style.height = (rect.height + "px");
                    }
                } else if (objectFit == "fill") {
                    video.style.width = (rect.width + "px");
                    video.style.height = (rect.height + "px");

                    videoRect = video.getBoundingClientRect();
                    previousVideoRect = video.getBoundingClientRect();
                } else if (objectFit == "cover") {
                    video.style.width = (rect.width + "px");
                    video.style.height = "auto";

                    videoRect = video.getBoundingClientRect();
                    previousVideoRect = video.getBoundingClientRect();
    
                    if (videoRect.height < rect.height) {
                        video.style.width = "auto";
                        video.style.height = (rect.height + "px");
                    }
                }

                container.style.width = (rect.width + "px");
                container.style.height = (rect.height + "px");

                previousObjectFit = objectFit;
            } else {
                videoRect = previousVideoRect;
            }

            //화면 미리보기
            let isScreenPreview = false;
            screenPreview.style.width = (rect.width + "px");
            screenPreview.style.height = (rect.height + "px");
            if (isMovePossible == true && isMouseDown == true) {
                if (screenPreview.getAttribute("time") == null || screenPreview.getAttribute("time") == "null") {
                    screenPreview.setAttribute("time", new Date().getTime());
                } else {
                    let difference = (new Date().getTime() - Number.parseInt(screenPreview.getAttribute("time")));
                    //0.1초 이상
                    if (difference >= 100) {
                        screenPreview.style.opacity = 1;
        
                        let isPreviewLoad = screenPreviewCanvas.getAttribute("is_load");
                        if (isPreviewLoad == true || isPreviewLoad == "true") {
                            screenPreviewCanvas.style.opacity = 1;
                            isScreenPreview = true;
                        }
                    }
                }
            } else {
                if (isLoad == true) {
                    screenPreview.style.opacity = 0;
                    screenPreviewCanvas.style.opacity = null;
                }
                screenPreview.setAttribute("time", null);
            }

            let boxRect = box.getBoundingClientRect();
            //사운드 조절바 숨기기
            if (boxRect.width <= 650) {
                controlsSoundWrap.style.width = "0px";
                controlsSoundWrap.style.marginRight = "0px";
                controlsSoundCircle.style.opacity = 0;
            } else {
                controlsSoundWrap.style.width = null;
                controlsSoundWrap.style.marginRight = null;
                controlsSoundCircle.style.opacity = 1;
            }
            //시간 숨기기, 이전, 다음 회차 버튼 숨기기
            let isUsePreviousAndNextButton = getVideoPlayerSettingsValue("isUsePreviousAndNextButton");
            let previousButton = controlsWrap.getElementsByClassName("video_player_container_controls_item")[0];
            let nextButton = controlsWrap.getElementsByClassName("video_player_container_controls_item")[2];
            if (isUsePreviousAndNextButton == false || isTouchDevice() == true) {
                let isShow = previousButton.getAttribute("is_show");
                if (isShow == null || isShow == true || isShow == "true") {
                    previousButton.style.display = "none";
                    previousButton.setAttribute("is_show", false);
                }
                isShow = nextButton.getAttribute("is_show");
                if (isShow == null || isShow == true || isShow == "true") {
                    nextButton.style.display = "none";
                    nextButton.setAttribute("is_show", false);
                }
            } else {
                let isShow = previousButton.getAttribute("is_show");
                if (isShow == null || isShow == false || isShow == "false") {
                    previousButton.style.display = null;
                    previousButton.setAttribute("is_show", true);
                }
                isShow = nextButton.getAttribute("is_show");
                if (isShow == null || isShow == false || isShow == "false") {
                    nextButton.style.display = null;
                    nextButton.setAttribute("is_show", true);
                }
            }
            let touchDeviceControlsItem = container.getElementsByClassName("video_player_container_touch_device_controls_item_button");
            if (isUsePreviousAndNextButton == false) {
                touchDeviceControlsItem[0].style.display = "none";
                touchDeviceControlsItem[2].style.display = "none";
            } else {
                touchDeviceControlsItem[0].style.display = null;
                touchDeviceControlsItem[2].style.display = null;
            }
            //영화관 모드 숨기기
            let theaterModeButton = controlsWrap.getElementsByClassName("video_player_container_controls_item")[7];
            let isFullBodySize = false;
            if (viewport["width"] == boxRect.width && viewport["height"] == boxRect.height) {
                isFullBodySize = true;
            }
            if (isTouchDevice() == true || document.fullscreenElement != null || isEmbed == true || (isFullBodySize == true && box.classList.contains("theater_mode_video_player") == false)) {
                theaterModeButton.style.display = "none";
            } else {
                theaterModeButton.style.display = null;
            }
            //PIP 숨기기
            let isUsePipModeButton = getVideoPlayerSettingsValue("isUsePipModeButton");
            let pipButton = controlsWrap.getElementsByClassName("video_player_container_controls_item")[6];
            if (isUsePipModeButton == false || document.fullscreenElement != null) {
                pipButton.style.display = "none";
            } else {
                pipButton.style.display = null;
            }
            //전체 화면 비활성화 여부
            let fullscreenButton = controlsWrap.getElementsByClassName("video_player_container_controls_item")[8];
            if (document.fullscreenEnabled == false) {
                fullscreenButton.classList.add("video_player_container_controls_item_disabled");
            } else {
                fullscreenButton.classList.remove("video_player_container_controls_item_disabled");
            }

            //클릭 및 단축키 효과 사용 여부
            let isUseClickAndHotKeyEffects = getVideoPlayerSettingsValue("isUseClickAndHotKeyEffects");
            let containerEffectItems = container.getElementsByClassName("video_player_container_effect_items")[0];
            if (isUseClickAndHotKeyEffects == false) {
                containerEffectItems.style.display = "none";
            } else {
                containerEffectItems.style.display = null;
            }
            //로드 중일 때 스핀 애니메이션 사용 여부
            let isUseLoadingFeedback = getVideoPlayerSettingsValue("isUseLoadingFeedback");
            let containerLoading = container.getElementsByClassName("video_player_container_loading")[0];
            if (isUseLoadingFeedback == false) {
                containerLoading.style.display = "none";
            } else {
                containerLoading.style.display = null;
            }

            //탐색바 숨겨지는 시간
            hideControlsSeconds = getVideoPlayerSettingsValue("progressBarHiddenTime");
            //일반 상태에서 탐색바 숨기기
            let containerControlsProgress = container.getElementsByClassName("video_player_container_controls_progress")[0];
            let isUseHideProgressBar = getVideoPlayerSettingsValue("isUseHideProgressBar");
            if (isUseHideProgressBar == true) {
                containerControlsProgress.classList.add("use_hide_video_player_container_controls_progress");
            } else {
                containerControlsProgress.classList.remove("use_hide_video_player_container_controls_progress");
            }
            //탐색바 미리보기 사용 여부
            let isUsePreview = getVideoPlayerSettingsValue("isUsePreview");
            if (isUsePreview == false) {
                previewScreen.style.display = "none";
            } else {
                previewScreen.style.display = null;
            }

            //레터박스 채우기
            backDrop.style.width = rect.width + "px";
            backDrop.style.height = rect.height + "px";
            
            //레터박스 채우기 효과 사용 여부
            let isUseLetterBoxEffect = getVideoPlayerSettingsValue("isUseLetterBoxEffect");

            if (isUseLetterBoxEffect == true && ((Math.round(videoRect.width) != Math.round(rect.width) || Math.round(videoRect.height) != Math.round(rect.height)) && (video.videoWidth != 0 || video.videoHeight))) {
                if (isScreenPreview == true) {
                    backDropCanvas.style.aspectRatio = previewVideo.videoWidth / previewVideo.videoHeight;
                } else {
                    backDropCanvas.style.aspectRatio = video.videoWidth / video.videoHeight;
                }

                if (videoRect.height > rect.height) {
                    backDropCanvas.style.width = "100%";
                    backDropCanvas.style.height = "auto";
                } else {
                    backDropCanvas.style.width = "auto";
                    backDropCanvas.style.height = "100%";
                }

                let backDropCanvasRect = backDropCanvas.getBoundingClientRect();

                if (isResize == true || isDecodedFrames == true || isScreenPreview == true) {
                    let width = backDropCanvasRect.width;
                    let height = backDropCanvasRect.height;
    
                    let context = backDropCanvas.getContext('2d');
                    if (isScreenPreview == true) {
                        backDropCanvas.width = width;
                        backDropCanvas.height = height;
                        
                        context.drawImage(screenPreviewCanvas, 0, 0, width, height);
                    } else {
                        if (isLoad == true) {
                            backDropCanvas.width = width;
                            backDropCanvas.height = height;
    
                            context.drawImage(video, 0, 0, width, height);
                        }
                    }
                }
                
                backDrop.style.opacity = null;
            } else {
                backDrop.style.opacity = 0;
            }

            //동적 조명 효과
            if (dynamicLighting != null) {
                let dynamicLightingCanvas = dynamicLighting.getElementsByTagName("canvas")[0];

                //다크모드인지
                let isDarkMode = document.documentElement.classList.contains("dark_mode");
                if (document.documentElement.classList.contains("black_mode")) {
                    isDarkMode = true;
                }

                //동적 조명 효과 사용 여부
                let isUseDynamicLightEffect = getVideoPlayerSettingsValue("isUseDynamicLightEffect");

                if (isUseDynamicLightEffect == true && isDarkMode == true && isLoad == true && box.style.position != "fixed" && document.fullscreenElement == null) {
                    dynamicLighting.style.width = (rect.width + "px");
                    dynamicLighting.style.height = (rect.height + "px");

                    if (isResize == true || isDecodedFrames == true || isScreenPreview == true) {
                        let width = rect.width;
                        let height = rect.height;
                        dynamicLightingCanvas.width = width;
                        dynamicLightingCanvas.height = height;
                
                        let dynamicLightingContext = dynamicLightingCanvas.getContext('2d');
                        if (isScreenPreview == true) {
                            dynamicLightingContext.drawImage(screenPreviewCanvas, 0, 0, width, height);
                        } else {
                            dynamicLightingContext.drawImage(video, 0, 0, width, height);
                        }
                    }
    
                    dynamicLighting.style.opacity = 0.8;
                }
                
                if (isUseDynamicLightEffect == false || isDarkMode == false || box.style.position == "fixed" || document.fullscreenElement != null) {
                    dynamicLighting.style.opacity = 0;
                }
            }

            if (isLoad == false && window.navigator.onLine == true) {
                if (loadingStartTime == null) {
                    loadingStartTime = new Date().getTime();
                }

                let time = new Date().getTime();
                let difference = (time - loadingStartTime) / 1000;

                //제한된 품질 모드로 전환 사용 여부
                let isUseLimitedResolution = getVideoPlayerSettingsValue("isUseLimitedResolution");

                //10초 이상 로딩 중이면
                if (isUseLimitedResolution == true && difference > 10 && resolutionMode != 3) {
                    changeResolutionModeVideoPlayer(uniqueNumber, 3);
                    actionMessage(getLanguage("video_player_buffering_message"));

                    loadingStartTime = null;
                }
            } else {
                if (loadingStartTime != null) {
                    if (loadingEndTime != null) {
                        let time = new Date().getTime();
                        let difference = (time - loadingEndTime) / 1000;
    
                        //5초 이상 지나면
                        if (difference > 5) {
                            loadingEndTime = null;
                            loadingStartTime = null;
                        }
                    } else {
                        loadingEndTime = new Date().getTime();
                    }
                }
            }

            //로드 전 미리보기 이미지
            let thumbnail = box.getElementsByClassName("video_player_thumbnail")[0];
            thumbnail.style.width = rect.width + "px";
            thumbnail.style.height = rect.height + "px";
            if (isScreenPreview == true || (isLoad == true && (thumbnail.getAttribute("is_load") != true || thumbnail.getAttribute("is_load") != "true"))) {
                if (isVideoSeeked == true || isScreenPreview == true || video.paused == false) {
                    thumbnail.style.opacity = 0;
                    thumbnail.setAttribute("is_load", true);
                }
            }
            //PIP 모드이면 미리보기 이미지 표시
            if (document.pictureInPictureElement != null) {
                thumbnail.style.opacity = 1;
            }

            //동영상 제목, 작품 제목, 챕터 제목 관련
            let containerControlsTop = container.getElementsByClassName("video_player_container_controls_top")[0];
            let isFullScreen = false;
            if (box.classList.contains("theater_mode_video_player") || document.fullscreenElement != null) {
                isFullScreen = true;
            }
            if (isFullScreen == false) {
                containerControlsTop.classList.add("video_player_container_controls_top_not_fullscreen");
            } else {
                containerControlsTop.classList.remove("video_player_container_controls_top_not_fullscreen");
            }
            //컨트롤러가 보여지고 있는지
            if (controlsWrap.classList.contains("show_video_player_container_controls")) {
                containerControlsTop.classList.add("show_video_player_container_controls_top");
            } else {
                containerControlsTop.classList.remove("show_video_player_container_controls_top");
            }
            //숨기기
            if (isEmbed == false && isFullScreen == false) {
                containerControlsTop.classList.remove("show_video_player_container_controls_top");
            }

            //탐색바 관련
            if (controlsWrap.classList.contains("show_video_player_container_controls")) {
                let isTimeout = progressWrap.getAttribute("is_timeout");

                if (isTimeout == null || isTimeout == "null") {
                    let timeout = setTimeout(() => {
                        progressWrap.style.pointerEvents = "all";
                    }, 200);
                    progressWrap.setAttribute("timeout", timeout);
                    progressWrap.setAttribute("is_timeout", true);
                }
            } else {
                let timeout = progressWrap.getAttribute("timeout");
                if (timeout != null && timeout != "null") {
                    clearTimeout(timeout);
                    progressWrap.setAttribute("timeout", null);
                }
                progressWrap.style.pointerEvents = null;
                progressWrap.setAttribute("is_timeout", null);
            }

            let videoPlayerInfo = box.getElementsByClassName("video_player_info")[0];
            let videoInfo = {
                "language": language,
                "property": property,
                "resolutionInfo": resolutionInfo,
                "resolutions": codecs["resolutions"],
                "resolutionMode": resolutionMode
            };
            let isDifferenceVideoInfo = false;
            if (previousVideoInfo != null) {
                isDifferenceVideoInfo = (isArrayEqual(previousVideoInfo, videoInfo)) ? false : true;
            }
            if (previousVideoInfo == null || isDifferenceVideoInfo == true) {
                let json = JSON.stringify(videoInfo);
                videoPlayerInfo.innerHTML = json;
                previousVideoInfo = JSON.parse(json);
            }

            let videoUrl = resolutionInfo["url"];
            if ((video.src == "" || video.src == null) || video.src != videoUrl) {
                let isPaused = video.paused;
                if (isPaused == true && (((video.src == "" || video.src == null) && (property["autoPlay"] == null || property["autoPlay"] == true)))) {
                    isPaused = false;
                }
                let previousCurrentTime = video.currentTime;
                video.crossOrigin = "Anonymous";
                video.src = videoUrl;
                video.currentTime = previousCurrentTime;
                (isPaused == false) ? video.play() : null;

                //미리보기 - 대기하여 자세히 보기
                previewDetailedVideo.src = videoUrl;

                //로드 전 미리보기 이미지
                thumbnail.style.opacity = 1;
                thumbnail.setAttribute("is_load", false);

                //버퍼링 감지 관련
                loadingEndTime = null;
                loadingStartTime = null;
            }

            //팝업창 여부
            let isShowContainerSettings = containerSettings.getAttribute("is_show");
            let isShowContextMenu = contextMenu.getAttribute("is_show");
            if (isShowStatistics == true || (isShowContextMenu == true || isShowContextMenu == "true") || (isShowContainerSettings == true || isShowContainerSettings == "true")) {
                box.setAttribute("is_exist_popup", true);
            } else {
                box.setAttribute("is_exist_popup", false);
            }

            //설정 버튼 화질 표시
            let controlsItemSettings = controlsWrap.getElementsByClassName("video_player_container_controls_item_settings")[0];
            let controlsItemSettingsText = controlsItemSettings.getElementsByClassName("video_player_container_controls_item_settings_text")[0];
            let settingsButtonText = "";
            if (resolutionInfo["resolution"] == 480) {
                settingsButtonText = "SD";
            } else if (resolutionInfo["resolution"] == 720) {
                settingsButtonText = "HD";
            } else if (resolutionInfo["resolution"] == 1080) {
                settingsButtonText = "FHD";
            } else if (resolutionInfo["resolution"] == 1440) {
                settingsButtonText = "QHD";
            } else if (resolutionInfo["resolution"] == 2160) {
                settingsButtonText = "4K";
            } else if (resolutionInfo["resolution"] == 4320) {
                settingsButtonText = "8K";
            } else if (resolutionInfo["resolution"] == 8640) {
                settingsButtonText = "16K";
            }
            (controlsItemSettingsText.innerHTML != settingsButtonText) ? controlsItemSettingsText.innerHTML = settingsButtonText : null;
            if (settingsButtonText == "") {
                controlsItemSettings.style.opacity = null;
            } else {
                controlsItemSettings.style.opacity = 1;
            }

            //픽셀 반올림 값
            let pixelRound = (1 / (window.devicePixelRatio * scale));

            //진행바
            let lines = box.getElementsByClassName("video_player_container_controls_progress_lines")[0].getBoundingClientRect();
            let line = box.getElementsByClassName("video_player_container_controls_progress_line");
            let percent = (video.getAttribute("loaded") / duration);
            (percent > 1) ? percent = 1 : null;
            let line0_width = (lines.width * percent);
            line0_width = Math.floor(line0_width * 1000000) / 1000000;
            line0_width += "px";
            (line[0].style.width != line0_width) ? line[0].style.width = line0_width : null;

            let currentTime = null;
            if (isMouseDown == true) {
                currentTime = Number.parseFloat(video.getAttribute("move_time"));
            } else {
                currentTime = video.currentTime;
            }
            percent = (currentTime / duration);
            (percent > 1) ? percent = 1 : null;
            let line2_width = (lines.width * percent);
            line2_width = Math.round(line2_width / pixelRound) * pixelRound;
            line2_width = Math.floor(line2_width * 1000000) / 1000000;
            line2_width += "px";
            (line[2].style.width != line2_width) ? line[2].style.width = line2_width : null;

            let controlsTime = box.getElementsByClassName("video_player_container_controls_time")[0];
            let timeText = secondsToTime(Math.round(currentTime)) + " / " + secondsToTime(Math.round(duration));
            if (timeText != controlsTime.innerHTML) {
                controlsTime.innerHTML = secondsToTime(Math.round(currentTime)) + " / " + secondsToTime(Math.round(duration));
            }
            
            //미리보기
            let progressWrapRect = progressWrap.getBoundingClientRect();
            let previewBox = controlsWrap.getElementsByClassName("video_player_container_controls_preview_box")[0];
            let previewBoxPercent = previewBox.getAttribute("percent");
            if (previewBoxPercent != null) {
                let marginLeft = (progressWrapRect.width * previewBoxPercent);
                marginLeft = Math.round(marginLeft / pixelRound) * pixelRound;
                marginLeft = Math.floor(marginLeft * 1000000) / 1000000;
                marginLeft += "px";
                (previewBox.style.marginLeft != marginLeft) ? previewBox.style.marginLeft = marginLeft : null;
            }

            let previewRect = previewBox.getBoundingClientRect();
            let marginLeft = null;
            if (previewBox.style.marginLeft != null && previewBox.style.marginLeft != "") {
                marginLeft = Number.parseFloat(previewBox.style.marginLeft.replaceAll("px", ""));
            }
            
            //미리보기 화면 최대 크기
            let controlsPreviewRect = controlsPreview.getBoundingClientRect();
            let previewBoxTime = controlsWrap.getElementsByClassName("video_player_container_controls_preview_box_time")[0];
            let previewBoxTimeRect = previewBoxTime.getBoundingClientRect();
            let maxPreviewHeight = controlsPreviewRect.height - (previewBoxTimeRect.height + 10);
            let previewBoxTopPadding = 15;
            let previewScreenHeight = ((maxPreviewHeight - previewBoxTopPadding) + "px");
            (previewScreen.style.height != previewScreenHeight) ? previewScreen.style.height = previewScreenHeight : null;

            //미리보기 - 대기하여 자세히 보기 사용 여부
            let isUseDetailedPreview = getVideoPlayerSettingsValue("isUseDetailedPreview");

            //상세한 미리보기 - 데스크톱에서만
            if (isUseDetailedPreview == true && isMouseOver == true && isMouseDown == false) {
                let previewScreenRect = previewScreen.getBoundingClientRect();
                let width = ((previewScreenRect.width - 2) + "px");
                let height = ((previewScreenRect.height - 2) + "px");
                let marginTop = ("-" + (previewScreenRect.height - 2) + "px");
                (screenPreviewDetailed.style.width != width) ? screenPreviewDetailed.style.width = width : null;
                (screenPreviewDetailed.style.height != height) ? screenPreviewDetailed.style.height = height : null;
                (screenPreviewDetailed.style.marginTop != marginTop) ? screenPreviewDetailed.style.marginTop = marginTop : null;
                setVideoVolume(previewDetailedVideo, realVideoVolume);
            }

            let previewFocusTime = screenPreviewDetailed.getAttribute("focus_time");
            let isShowPreviewDetailed = screenPreviewDetailed.getAttribute("is_show");
            if (isUsePreview == true && isUseDetailedPreview == true && isMouseOver == true && isMouseDown == false) {
                let nowDate = new Date().getTime();

                if (previewFocusTime == null || previewFocusTime == "null") {
                    screenPreviewDetailed.setAttribute("focus_time", nowDate);
                    previewFocusTime = nowDate;
                }

                let difference = (nowDate - Number.parseInt(previewFocusTime)) / 1000;
                if (difference >= 1.5 && (isShowPreviewDetailed == null || (isShowPreviewDetailed == false || isShowPreviewDetailed == "false"))) {
                    screenPreviewDetailed.style.opacity = 1;
                    screenPreviewDetailed.setAttribute("is_show", true);
                    let previewTime = Number.parseFloat(previewVideo.getAttribute("current_time"));
                    if (previewTime == -1) {
                        previewTime = previewVideo.currentTime;
                    }
                    previewDetailedVideo.currentTime = previewTime;
                    previewDetailedVideo.onseeked = function(event) {
                        event.target.style.opacity = 1;

                        //음소거 여부
                        if (video.paused == true) {
                            previewDetailedVideo.muted = false;
                        } else {
                            previewDetailedVideo.muted = true;
                        }
                    }
                    try {
                        previewDetailedVideo.play();
                    } catch (error) {}
                    previewScreen.style.maxHeight = "300px";
                }
            } else {
                screenPreviewDetailed.setAttribute("focus_time", null);
                screenPreviewDetailed.setAttribute("is_show", false);
                screenPreviewDetailed.style.opacity = 0;
                previewDetailedVideo.style.opacity = 0;
                previewDetailedVideo.pause();
                previewDetailedVideo.muted = true;
                previewScreen.style.maxHeight = null;
            }

            if (marginLeft != null) {
                let value = (previewRect.width / 2);
                if (marginLeft < value) {
                    let marginLeftValue = (value + "px");
                    (previewBox.style.marginLeft != marginLeftValue) ? previewBox.style.marginLeft = marginLeftValue : null;
                }
                value = (lines.width - previewRect.width + (previewRect.width / 2));
                if (marginLeft > value) {
                    let marginLeftValue = (value + "px");
                    (previewBox.style.marginLeft != marginLeftValue) ? previewBox.style.marginLeft = marginLeftValue : null;
                }
            }

            if (isMovePossible == false && isMouseOver == false) {
                previewCanvas.style.opacity = null;
                screenPreviewCanvas.setAttribute("is_load", false);
            }

            //일시정지면
            let touchDeviceButton = touchDeviceControls.getElementsByClassName("video_player_container_touch_device_controls_item_button")[1];
            if (video.paused == true && Math.abs(video.currentTime - duration) < 0.01) {
                touchDeviceButton.setAttribute("type", 2);
            } else if (video.paused == true) {
                touchDeviceButton.setAttribute("type", 0);
            } else {
                touchDeviceButton.setAttribute("type", 1);
            }

            //일시정지면
            let button = controlsWrap.getElementsByClassName("video_player_container_controls_item")[1];
            if (video.paused == true && Math.abs(video.currentTime - duration) < 0.01) {
                button.setAttribute("type", 2);
            } else if (video.paused == true) {
                button.setAttribute("type", 0);
            } else {
                button.setAttribute("type", 1);
            }
            //소형 플레이어가 켜져있으면
            button = controlsWrap.getElementsByClassName("video_player_container_controls_item")[6];
            if (document.pictureInPictureElement == null) {
                button.classList.remove("video_player_container_controls_true");
            } else {
                button.classList.add("video_player_container_controls_true");
            }
            //영화관 모드이라면
            button = controlsWrap.getElementsByClassName("video_player_container_controls_item")[7];
            if (box.classList.contains("theater_mode_video_player")) {
                button.classList.add("video_player_container_controls_true");
            } else {
                button.classList.remove("video_player_container_controls_true");
            }
            //전체 화면이라면
            button = controlsWrap.getElementsByClassName("video_player_container_controls_item")[8];
            if (document.fullscreenElement == null) {
                button.classList.remove("video_player_container_controls_true");
            } else {
                button.classList.add("video_player_container_controls_true");
            }

            //이전으로 이동 버튼 숨기기
            touchDeviceControlsItem = container.getElementsByClassName("video_player_container_touch_device_controls_item_button")[0];
            button = controlsWrap.getElementsByClassName("video_player_container_controls_item")[0];
            if (property["previous"]["onclick"] == null) {
                button.style.display = "none";
                touchDeviceControlsItem.classList.add("video_player_container_touch_device_controls_item_button_disabled");
            }
            //다음으로 이동 버튼 숨기기
            touchDeviceControlsItem = container.getElementsByClassName("video_player_container_touch_device_controls_item_button")[2];
            button = controlsWrap.getElementsByClassName("video_player_container_controls_item")[2];
            if (property["next"]["onclick"] == null) {
                button.style.display = "none";
                touchDeviceControlsItem.classList.add("video_player_container_touch_device_controls_item_button_disabled");
            }
            if (isUsePreviousAndNextButton == false) {
                containerContextMenuBoxItem = container.getElementsByClassName("video_player_container_context_menu_box_item")[2];
                containerContextMenuBoxItem.style.display = "none";
                containerContextMenuBoxItem = container.getElementsByClassName("video_player_container_context_menu_box_item")[3];
                containerContextMenuBoxItem.style.display = "none";
            } else {
                containerContextMenuBoxItem = container.getElementsByClassName("video_player_container_context_menu_box_item")[2];
                if (property["previous"]["onclick"] == null) {
                    containerContextMenuBoxItem.style.display = "none";
                } else {
                    containerContextMenuBoxItem.style.display = null;
                }
                containerContextMenuBoxItem = container.getElementsByClassName("video_player_container_context_menu_box_item")[3];
                if (property["next"]["onclick"] == null) {
                    containerContextMenuBoxItem.style.display = "none";
                } else {
                    containerContextMenuBoxItem.style.display = null;
                }
            }

            //접근성 플레이어
            let isUseAccessibility = getVideoPlayerSettingsValue("isUseAccessibility");
            let containerControlsAccessibility = container.getElementsByClassName("video_player_container_controls_accessibility")[0];
            if (isUseAccessibility == true && isTouchDevice() == false && controlsWrap.classList.contains("show_video_player_container_controls")) {
                containerControlsAccessibility.classList.add("show_video_player_container_controls_accessibility");
            } else {
                containerControlsAccessibility.classList.remove("show_video_player_container_controls_accessibility");
            }

            //사운드
            let soundLinesRect = controlsSoundLines.getBoundingClientRect();
            let soundCircleRect = controlsSoundCircle.getBoundingClientRect();
            let soundLinesWidth = soundLinesRect.width - soundCircleRect.width;
            let controlsSoundWidth = (soundLinesWidth * videoVolume);
            controlsSoundWidth = Math.floor(controlsSoundWidth * 1000000) / 1000000;
            controlsSoundWidth += "px";
            (controlsSoundLine.style.width != controlsSoundWidth) ? controlsSoundLine.style.width = controlsSoundWidth : null;
            (controlsSoundCircle.style.marginLeft != controlsSoundWidth) ? controlsSoundCircle.style.marginLeft = controlsSoundWidth : null;

            let soundType = 1;
            if (videoVolume >= 0.5) {
                soundType = 2;
            } else if (videoVolume == 0) {
                soundType = 0;
            }
            for (let i = 0; i < containerSoundIcon.length; i++) {
                if (containerSoundIcon[i].getAttribute("sound") != soundType) {
                    containerSoundIcon[i].setAttribute("sound", soundType);
                }
            }
            
            if (videoVolume >= 0.75) {
                containerSound.classList.add("high_video_player_container_sound");
            } else {
                containerSound.classList.remove("high_video_player_container_sound");
            }

            //화면 내에 사운드 표시
            let containerSoundLine = box.getElementsByClassName("video_player_container_sound_line")[0];
            containerSoundLine.style.height = (videoVolume * 100) + "%";

            //자막
            videoRect = video.getBoundingClientRect();

            let subtitleWidth = (videoRect.width + "px");
            let subtitleHeight = (videoRect.height + "px");
            (subtitle.style.width != subtitleWidth) ? subtitle.style.width = subtitleWidth : null;
            (subtitle.style.height != subtitleHeight) ? subtitle.style.height = subtitleHeight : null;

            let subtitleItems = subtitle.getElementsByClassName("video_player_subtitle_items")[0];
            let isShowSubtitle = false;
            if (subtitleItems.children.length != 0) {
                isShowSubtitle = true;
            }

            if (isShowSubtitle == true) {
                //자막 여백 구하기
                let marginPercent = 0.25;
                let marginTopBottom = ((videoRect.height / 2) * marginPercent);
                let marginLeftRight = ((videoRect.width / 2) * marginPercent);
                let subtitleItemsMargin = (marginTopBottom + "px") + " " + (marginLeftRight + "px");
                let subtitleItemsWidth = "calc(100% - " + (marginLeftRight * 2) + "px)";
                let subtitleItemsHeight = "calc(100% - " + (marginTopBottom * 2) + "px)";
                (subtitleItems.style.margin != subtitleItemsMargin) ? subtitleItems.style.margin = subtitleItemsMargin : null;
                (subtitleItems.style.width != subtitleItemsWidth) ? subtitleItems.style.width = subtitleItemsWidth : null;
                (subtitleItems.style.height != subtitleItemsHeight) ? subtitleItems.style.height = subtitleItemsHeight : null;

                //가로 크기를 기준으로 폰트 사이즈 구하기
                let fontSizePercent = 0.0325;
                let fontSize = (videoRect.width * fontSizePercent);
                (fontSize < 10) ? fontSize = 10 : null;
                subtitleItems.style.fontSize = fontSize + "px";

                let lineHeight = (fontSize * 1.25); 
                (subtitleItems.style.lineHeight != (lineHeight + "px")) ? subtitleItems.style.lineHeight = (lineHeight + "px") : null;
                (subtitleItems.style.letterSpacing != (fontSize * 0.05)) ? subtitleItems.style.letterSpacing = (fontSize * 0.05) : null;

                //글자 외곽선
                let outlineSizePercent = 0.075;
                let outlineSize = (fontSize * outlineSizePercent);

                let subtitleItemsRect = subtitleItems.getBoundingClientRect();

                let subtitleItem = subtitle.getElementsByClassName("video_player_subtitle_item");
                for (let i = 0; i < subtitleItem.length; i++) {
                    let range = {
                        'start': Number.parseFloat(subtitleItem[i].getAttribute("start")),
                        'end': Number.parseFloat(subtitleItem[i].getAttribute("end"))
                    }
                    let currentTime = video.currentTime;

                    if (range["start"] < range["end"] && currentTime >= range["start"] && currentTime < range["end"]) {
                        let backdrop = subtitleItem[i].getElementsByClassName("video_player_subtitle_item_backdrop")[0];
                        
                        subtitleItem[i].setAttribute("hidden_time", null);
                        if (subtitleItem[i].style.display == "none") {
                            subtitleItem[i].style.display = null;
                        } else {
                            backdrop.style.opacity = 1;
                            //backdrop.style.transform = "scale(1)";
                        }

                        subtitleItem[i].style.width = (subtitleItemsRect.width + "px");
                        subtitleItem[i].style.height = (subtitleItemsRect.height + "px");

                        //외곽선 사이즈
                        let span = subtitleItem[i].getElementsByTagName("span")[0];
                        span.style.webkitTextStroke = outlineSize + "px #000000";
                        //그림자
                        let shadowPercent = 0.2;
                        span.style.textShadow = "0px 0px " + (outlineSize * (1 + shadowPercent)) + "px #000000";

                        //자막 배경
                        let isUsePadding = false;
                        let paddingPercent = 0;
                        let paddingLeftRight =(lineHeight * paddingPercent) * 2;
                        let paddingTopBottom = (lineHeight * paddingPercent);
                        backdrop.style.padding = (paddingTopBottom + "px") + " " + (paddingLeftRight + "px");
                        if (isUsePadding == false) {
                            backdrop.style.backgroundColor = "unset";
                            backdrop.style.backdropFilter = "unset";
                        } else {
                            backdrop.style.backgroundColor = null;
                            backdrop.style.backdropFilter = null;
                        }

                        //둥근 정도
                        let borderRadiusPercent = 0.25;
                        let borderRadius = (lineHeight + (paddingTopBottom * 2)) * borderRadiusPercent;
                        backdrop.style.borderRadius = (borderRadius / 2) + "px";

                        let text = subtitleItem[i].getElementsByTagName("text")[0];
                        let textRect = text.getBoundingClientRect();
                        span.style.width = textRect.width + "px";
                        span.style.weight = textRect.height + "px";
                    } else {
                        let hiddenTime = subtitleItem[i].getAttribute("hidden_time");
                        let time = new Date().getTime();
                        let difference = time - hiddenTime;

                        if (difference >= 100 && subtitleItem[i].style.display != "none") {
                            subtitleItem[i].style.display = "none";
                            subtitleItem[i].setAttribute("hidden_time", null);
                        } else {
                            if (subtitleItem[i].getAttribute("hidden_time") == null || subtitleItem[i].getAttribute("hidden_time") == "null") {
                                let backdrop = subtitleItem[i].getElementsByClassName("video_player_subtitle_item_backdrop")[0];
                                backdrop.style.opacity = 0;
                                //backdrop.style.transform = "scale(0.9)";
                                subtitleItem[i].setAttribute("hidden_time", new Date().getTime());
                            }
                        }
                    }
                }
            }

            //호버 메세지
            let hoverMessageItems = container.getElementsByClassName("video_player_container_controls_hover_message_items")[0];
            let hoverMessageItem = hoverMessageItems.children;
            let buttonItems = controlsWrap.getElementsByClassName("video_player_container_controls_item");
            for (let i = 0; i < buttonItems.length; i++) {
                let isHover = buttonItems[i].getAttribute("is_hover");
                if (isHover == true || isHover == "true") {
                    isHover = true;
                } else {
                    isHover = false;
                }

                let hoverMessageEl = null;
                for (let j = 0; j < hoverMessageItem.length; j++) {
                    if (hoverMessageItem[j].getAttribute("index") == i) {
                        hoverMessageEl = hoverMessageItem[j];
                        break;
                    }
                }
                let isNewEl = false;

                if (isHover == true) {
                    let text = "...";
                    let svg = "...";
                    let hotkey = null;
                    if (buttonItems[i].getAttribute("hover_text") != null) {
                        text = buttonItems[i].getAttribute("hover_text");
                        if (buttonItems[i].getElementsByTagName("svg").length != 0) {
                            svg = buttonItems[i].getElementsByTagName("svg")[0].outerHTML;
                        }
                        if (buttonItems[i].getAttribute("hotkey") != null) {
                            hotkey = buttonItems[i].getAttribute("hotkey");
                        }
                    } else {
                        let child = buttonItems[i].children;
                        for (let j = 0; j < child.length; j++) {
                            let style = window.getComputedStyle(child[j]);

                            if (style.getPropertyValue("clear") != "none") {
                                text = child[j].getAttribute("hover_text");
                                if (child[j].getElementsByTagName("svg").length != 0) {
                                    svg = child[j].getElementsByTagName("svg")[0].outerHTML;
                                }
                                if (child[j].getAttribute("hotkey") != null) {
                                    hotkey = child[j].getAttribute("hotkey");
                                }
                                break;
                            }
                        }
                    }

                    let html = `
                        ` + svg + `
                        ` + text + `
                    `;
                    if (hotkey != null) {
                        html += `
                            <span style = "margin-left: 7px; color: #ffffff80;">·</span>
                            <div class = "video_player_container_controls_hover_message_hotkey">
                                ` + hotkey.toUpperCase(); + `
                            </div>
                        `;
                    }
                    //이전, 다음으로 이동 정보
                    let additionalInfo = null;
                    if (svg == '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="a"><rect width="50" height="50"></rect></clipPath></defs><g id="b" clip-path="url(#a)"><g transform="translate(50 50) rotate(180)" clip-path="url(#a)"><rect width="14" height="44" rx="3" transform="translate(33 3)"></rect><path d="M19.581,3.3a3,3,0,0,1,4.838,0L40.5,25.226A3,3,0,0,1,38.08,30H5.92A3,3,0,0,1,3.5,25.226Z" transform="translate(33 3) rotate(90)"></path></g></g></svg>') {
                        additionalInfo = property["previous"];
                    } else if (svg == '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="14" height="44" rx="3" transform="translate(33 3)"></rect><path d="M19.581,3.3a3,3,0,0,1,4.838,0L40.5,25.226A3,3,0,0,1,38.08,30H5.92A3,3,0,0,1,3.5,25.226Z" transform="translate(33 3) rotate(90)"></path></g></svg>') {
                        additionalInfo = property["next"];
                    }
                    if (additionalInfo != null) {
                        html = `
                            <div class = "video_player_container_controls_hover_message_move_left">
                                ` + svg + `
                            </div>
                            <div class = "video_player_container_controls_hover_message_move_thumbnail img_wrap">
                                <img src = "` + additionalInfo["thumbnailImage"] + `" onload = "imageLoad(event);" alt = "">
                            </div>
                            <div class = "video_player_container_controls_hover_message_move_right">
                                <div class = "video_player_container_controls_hover_message_move_right_title">
                                    ` + additionalInfo["title"] + `
                                </div>
                                <div class = "video_player_container_controls_hover_message_move_right_description">
                                    ` + additionalInfo["description"] + `
                                </div>
                            </div>
                        `;
                    }
                    buttonItems[i].setAttribute("focus_text", text);

                    //앨리먼트가 없으면 만든다
                    if (hoverMessageEl == null) {
                        let newEl = document.createElement("div");
                        newEl.classList.add("video_player_container_controls_hover_message_item");
                        newEl.setAttribute("index", i);
                        newEl.innerHTML = html;
                        if (additionalInfo != null) {
                            newEl.style.borderRadius = "10px";
                        }
                        hoverMessageEl = hoverMessageItems.appendChild(newEl);
                        isNewEl = true; //새로운 앨리맨트
                    } else {
                        let regex1 = /(style=".+?")/gm;
                        let regex2 = /(style = ".+?")/gm;
                        let str1 = hoverMessageEl.innerHTML.replace(regex1, "").replace(regex2, "").replace(/(\s*)/g, "").trim();
                        let str2 = html.replace(regex1, "").replace(regex2, "").replace(/(\s*)/g, "").trim();
                        if (str1 != str2 && str1 != (str2 + "</div>")) {
                            hoverMessageEl.innerHTML = html;
                        }
                    }

                    //최소 가로, 최대 가로
                    if (additionalInfo != null && hoverMessageEl != null) {
                        let hoverMessageItemsRect = hoverMessageItems.getBoundingClientRect();
                        let maxWidth = ((hoverMessageItemsRect.width - 20) + "px");
                        let minWidth = 350;
                        if (minWidth > maxWidth) {
                            minWidth = maxWidth;
                        }
                        hoverMessageEl.style.minWidth = (minWidth + "px");
                        hoverMessageEl.style.maxWidth = "max-content";
                        hoverMessageEl.style.width = "calc(100% - 20px)";
                    }

                    let removeTimeout = hoverMessageEl.getAttribute("remove_timeout");
                    if (removeTimeout != null && removeTimeout != "null") {
                        clearTimeout(removeTimeout);
                        hoverMessageEl.setAttribute("remove_timeout", null);
                    }
                    if (isNewEl == false) {
                        hoverMessageEl.style.opacity = 1;
                    }
                } else {
                    if (hoverMessageEl != null) {
                        hoverMessageEl.style.opacity = null;

                        let removeTimeout = hoverMessageEl.getAttribute("remove_timeout");
                        if (removeTimeout == null || removeTimeout == "null") {
                            let timeout = setTimeout(() => {
                                hoverMessageEl.remove();
                            }, 200);
                            hoverMessageEl.setAttribute("remove_timeout", timeout);
                        }
                    }
                }
            }
            //호버 메시지 위치 맞추기
            for (let i = 0; i < hoverMessageItem.length; i++) {
                let index = Number.parseInt(hoverMessageItem[i].getAttribute("index"));
                if (buttonItems[index] != null) {
                    button = buttonItems[index];
                    let containerRect = container.getBoundingClientRect();
                    let buttonRect = button.getBoundingClientRect();
                    let hoverMessageRect = hoverMessageItem[i].getBoundingClientRect();
                    let left = (buttonRect.left - containerRect.left) - (hoverMessageRect.width / 2);
                    left += (buttonRect.width / 2);
                    left -= 10;

                    (left < 0) ? left = 0 : null;
                    let containerWidth = (containerRect.width - 20);
                    if ((containerWidth - (left + hoverMessageRect.width)) < 0) {
                        left -= (containerWidth - (left + hoverMessageRect.width)) * -1;
                    }
                    
                    hoverMessageItem[i].style.marginLeft = (left + "px");
                }
            }

            //우클릭 팝업 메뉴 관련
            if (video.loop == true) {
                contextMenuItem[0].classList.add("video_player_container_context_menu_box_item_checked");
            } else {
                contextMenuItem[0].classList.remove("video_player_container_context_menu_box_item_checked");
            }
            //개발자 통계 관련
            if (isShowStatistics == true) {
                contextMenuItem[12].classList.add("video_player_container_context_menu_box_item_checked");
            } else {
                contextMenuItem[12].classList.remove("video_player_container_context_menu_box_item_checked");
            }

            //컨트롤러가 보여지고 있는지
            if (controlsWrap.classList.contains("show_video_player_container_controls")) {
                containerStatistics.classList.add("show_controls_video_player_container_statistics");
                containerSettings.classList.add("show_controls_video_player_container_settings");
            } else {
                containerStatistics.classList.remove("show_controls_video_player_container_statistics");
                containerSettings.classList.remove("show_controls_video_player_container_settings");
            }

            //재생 시 전체 화면으로 전환
            if (isEmbed == false || isBoxFocus == true) {
                if (isVideoPlayerSettingsValue("isUseFullScreenOnPlayback", true) && isLoad == true && hasBeenFullScreened == false) {
                    box.requestFullscreen();
                }
            }
            if (document.fullscreenElement != null || isLoad == true) {
                hasBeenFullScreened = true;
            }

            //개발자 통계 관련
            let isCheckBitrate = video.getAttribute("is_check_bitrate");
            if (isLoad == true && video.paused == false && (isCheckBitrate == false || isCheckBitrate == "false")) {
                registerCheckBitrate();
            }
            if ((isLoad == false || video.paused == true) && (isCheckBitrate == true || isCheckBitrate == "true")) {
                cancelCheckBitrate();
            }
            if (isShowStatistics == true) {
                let statisticsItem = container.getElementsByClassName("video_player_container_statistics_item");
                let statisticsValue = container.getElementsByClassName("video_player_container_statistics_item_value");

                //보이는 화면 크기 / 음량
                let realTimeDecibels = getVideoDecibel(video, realVideoVolume);
                realTimeDecibels = Math.round(realTimeDecibels * 100) / 100;
                if (isFinite(realTimeDecibels) == false) {
                    realTimeDecibels = '-∞';
                }
                let decibels = Math.round((20 * Math.log10(realVideoVolume)) * 100) / 100;
                if (isFinite(decibels) == false) {
                    decibels = '-∞';
                }
                let scale = box.getAttribute("scale");
                (scale == null || scale == "null") ? scale = 1 : null;
                let viewportWidth = Math.round((videoRect.width * window.devicePixelRatio) * scale);
                let viewportHeight = Math.round((videoRect.height * window.devicePixelRatio) * scale);
                let value = (viewportWidth + 'x' + viewportHeight) + " / " + ((Math.round(realVideoVolume * 10000) / 100) + "% (" + decibels + " dB) · RT: " + realTimeDecibels + " dB");
                (statisticsValue[1].innerHTML != value) ? statisticsValue[1].innerHTML = value : null;

                //콘텐츠 음량 / 노멀라이즈
                if (resolutionInfo["contentLoudness"] != null) {
                    let LUFS = resolutionInfo["contentLoudness"];
                    value = (LUFS + " LUFS");
                    value += (" / ");
                    let dB = Math.round((20 * Math.log10(Math.abs(attenuationPercent))) * 100) / 100;
                    let percent = ((Math.round((1 - attenuationPercent) * 10000) / 100) * -1);
                    value += (percent + "% (" + dB + " dB)");
                    (statisticsValue[2].innerHTML != value) ? statisticsValue[2].innerHTML = value : null;

                    statisticsItem[2].style.display = null;
                } else {
                    statisticsItem[2].style.display = "none";
                }

                //동영상 프레임 정보
                if (decodedFrames != null && droppedFrames != null) {
                    value = getLanguage("video_player_statistics:video_frames:value");
                    value = value.replaceAll("{R:0}", commas(decodedFrames));
                    value = value.replaceAll("{R:1}", commas(droppedFrames));
                    value += (" (" + framesPerSecond + "Hz · FPS: " + processingPerSecond + ")");
                    (statisticsValue[3].innerHTML != value) ? statisticsValue[3].innerHTML = value : null;

                    statisticsItem[3].style.display = null;
                } else {
                    statisticsItem[3].style.display = "none";
                }

                //동영상 해상도
                let capacityText = capacityUnit(resolutionInfo["size"]);
                let capacityPerFrame = resolutionInfo["size"] / (resolutionInfo["framerate"] * duration);
                capacityText += " (";
                capacityText += capacityUnit(capacityPerFrame);
                capacityText += "/f)";
                capacityText += " (";
                capacityText += capacityUnit((capacityPerFrame * resolutionInfo["framerate"]) * 60 * 60);
                capacityText += "/h)";
                value = ((resolutionInfo["width"] + 'x' + resolutionInfo["height"]) + "@" + resolutionInfo["framerate"] + "Hz") + " (" + resolutionInfo["resolution"] + "p)" + " · " + capacityText;
                (statisticsValue[4].innerHTML != value) ? statisticsValue[4].innerHTML = value : null;

                //하드웨어 가속 여부
                let hardwareName = null;
                let isHardwareAccel = false;
                let isCheckedHardwareAccel = statisticsValue[5].getAttribute("is_checked");
                if (isCheckedHardwareAccel != true && isCheckedHardwareAccel != "true") {
                    let tempCanvas = document.createElement('canvas');
                    let webgl = tempCanvas.getContext('webgl') || tempCanvas.getContext('experimental-webgl');
                    if (webgl != null) {
                        let debugInfo = webgl.getExtension('WEBGL_debug_renderer_info');
                        let renderer = webgl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
                        
                        if (renderer.includes('nvidia')) {
                            hardwareName = "NVIDIA";
                            isHardwareAccel = true;
                        } else if (renderer.includes('amd')) {
                            hardwareName = "AMD";
                            isHardwareAccel = true;
                        } else if (renderer.includes('qualcomm')) {
                            hardwareName = "QUALCOMM";
                            isHardwareAccel = true;
                        } else if (renderer.includes('intel')) {
                            hardwareName = "INTEL";
                            isHardwareAccel = true;
                        } else if (renderer.includes('apple')) {
                            hardwareName = "APPLE";
                            isHardwareAccel = true;
                        }

                        statisticsValue[5].setAttribute("is_hardware_accel", isHardwareAccel);
                        statisticsValue[5].setAttribute("hardware_name", hardwareName);
    
                        webgl.getExtension('WEBGL_lose_context').loseContext();

                        //일정 시간 동안 체크하지 않음
                        statisticsValue[5].setAttribute("is_checked", true);
                        setTimeout(() => {
                            statisticsValue[5].setAttribute("is_checked", false);
                        }, 3000);
                    }
                    tempCanvas.remove();
                } else {
                    isHardwareAccel = statisticsValue[5].getAttribute("is_hardware_accel");
                    (isHardwareAccel == "true") ? isHardwareAccel = true : null;
                    hardwareName = statisticsValue[5].getAttribute("hardware_name");
                }

                //동영상 / 오디오 코덱
                let videoCodec = resolutionInfo["codecId"].toUpperCase();
                if (videoCodec == "AVC1") {
                    videoCodec = "AVC1(H264)";
                }
                let audioCodec = "...";
                if (resolutionInfo["codecId"] == "avc1") {
                    audioCodec = "AAC";
                } else if (resolutionInfo["codecId"] == "vp09" || resolutionInfo["codecId"] == "av01") {
                    audioCodec = "OPUS";
                }
                let renderer = ('<span style="color: #ff7575; font-weight: bold;">' + getLanguage("video_player_statistics:codec:software_accel") + "</span>");
                if (isHardwareAccel == true) {
                    renderer = getLanguage("video_player_statistics:codec:hardware_accel").replaceAll("{R:0}", hardwareName);
                }
                value = (videoCodec + " / " + audioCodec + " · (" + renderer + ")");
                (statisticsValue[5].innerHTML != value) ? statisticsValue[5].innerHTML = value : null;

                //인코더 프로그램
                value = resolutionInfo["encoder"];
                (statisticsValue[6].innerHTML != value) ? statisticsValue[6].innerHTML = value : null;

                //인코딩 진행 상황
                value = "...";
                for (let i = 0; i < codecsList.length; i++) {
                    if (codecsList[i]["status"] == 0) {
                        let codecId = codecsList[i]["codecId"].toUpperCase();
                        value = getLanguage("video_player_statistics:progress:0");
                        value = value.replaceAll("{R:0}", codecId);

                        let timeTaken = codecsList[i]["timeTaken"];
                        value = value.replaceAll("{R:1}", getTimeText(timeTaken));
                    }
                    if (codecsList[i]["status"] == 1) {
                        let codecId = codecsList[i]["codecId"].toUpperCase();
                        let isComplete = false;
                        let processing = null;
                        let resolutions = codecsList[i]["resolutions"];
                        for (let j = 0; j < resolutions.length; j++) {
                            if (resolutions[j]["status"] != 2) {
                                isComplete = true;
                            }
                            if (resolutions[j]["status"] == 1) {
                                processing = resolutions[j];
                                break;
                            }
                        }
                        if (processing != null) {
                            let progressText = (codecId + " · " + processing["resolution"] + "p");
                            value = getLanguage("video_player_statistics:progress:1").replaceAll("{R:0}", progressText);

                            let currentTime = new Date();
                            let utc = (currentTime.getTime() + (currentTime.getTimezoneOffset() * 60 * 1000));
                            let elapsedTime = (utc - new Date(processing["startDate"]).getTime()) / 1000;
                            value = value.replaceAll("{R:1}", getTimeText(elapsedTime));

                            value += " (" + processing["progress"] + "%)";
                            break;
                        }
                        if (isComplete == false) {
                            let text = getLanguage("video_player_statistics:progress:2");
                            value = text.replaceAll("{R:0}", codecId);
                            break;
                        }
                    }
                }
                (statisticsValue[7].innerHTML != value) ? statisticsValue[7].innerHTML = value : null;

                //색 영역 / 비트 뎁스 / 픽셀 형식
                let colorRange = getLanguage("video_player_statistics:color_range:" + resolutionInfo["colorRange"]);
                let colorRangeStart = 0;
                let colorRangeEnd = 0;
                if (resolutionInfo["colorRange"] == "full") {
                    colorRangeStart = 0;
                    if (resolutionInfo["bitDepth"] == 8) {
                        colorRangeEnd = 255;
                    } else if (resolutionInfo["bitDepth"] == 10) {
                        colorRangeEnd = 1023;
                    } else if (resolutionInfo["bitDepth"] == 12) {
                        colorRangeEnd = 4095;
                    } else if (resolutionInfo["bitDepth"] == 14) {
                        colorRangeEnd = 65535;
                    } else if (resolutionInfo["bitDepth"] == 16) {
                        colorRangeEnd = 65535;
                    } else if (resolutionInfo["bitDepth"] == 24) {
                        colorRangeEnd = 16777215;
                    } else if (resolutionInfo["bitDepth"] == 30) {
                        colorRangeEnd = 1073741823;
                    } else if (resolutionInfo["bitDepth"] == 36) {
                        colorRangeEnd = 68719476735;
                    } else if (resolutionInfo["bitDepth"] == 48) {
                        colorRangeEnd = 281474976710655;
                    }
                } else if (resolutionInfo["colorRange"] == "limited") {
                    if (resolutionInfo["bitDepth"] == 8) {
                        colorRangeStart = 16;
                        colorRangeEnd = 235;
                    } else if (resolutionInfo["bitDepth"] == 10) {
                        colorRangeStart = 64;
                        colorRangeEnd = 940;
                    } else if (resolutionInfo["bitDepth"] == 12) {
                        colorRangeStart = 256;
                        colorRangeEnd = 3760;
                    } else if (resolutionInfo["bitDepth"] == 16) {
                        colorRangeStart = 4096;
                        colorRangeEnd = 60160;
                    }
                }
                colorRange = colorRange.replaceAll("{R:0}", colorRangeStart);
                colorRange = colorRange.replaceAll("{R:1}", colorRangeEnd);
                value = resolutionInfo["pixelFormat"].toUpperCase();
                value += (" · " + resolutionInfo["bitDepth"] + " bit");
                if (colorRange != null) {
                    value += (" / " + colorRange);
                }
                //사용자의 모니터가 동영상 소스의 색상 깊이를 표현할 수 있는지
                let bitDepth = null;
                let isCheckedBitDepth = statisticsValue[8].getAttribute("is_checked");
                if (isCheckedBitDepth != true && isCheckedBitDepth != "true") {
                    function calculateBitDepth(color) {
                        let depth = 0;
                        while (color > 0) {
                            depth ++;
                            color = color >> 1;
                        }
                        return depth;
                    }
                    let canvas = document.createElement('canvas');
                    let context = canvas.getContext('2d');
                    canvas.width = 1;
                    canvas.height = 1;
                    context.fillStyle = '#808080';
                    context.fillRect(0, 0, 1, 1);
                    let imageData = context.getImageData(0, 0, 1, 1);
                    let colorBuffer = imageData.data;
                    canvas.remove();
                    
                    let tempBitDepth = 0;
                    for (let i = 0; i < colorBuffer.length; i++) {
                        tempBitDepth += calculateBitDepth(colorBuffer[i]);
                    }
                    
                    bitDepth = Math.floor(tempBitDepth / 3);
                    statisticsValue[8].setAttribute("bit_depth", bitDepth);

                    //일정 시간 동안 체크하지 않음
                    statisticsValue[8].setAttribute("is_checked", true);
                    setTimeout(() => {
                        statisticsValue[8].setAttribute("is_checked", false);
                    }, 3000);
                } else {
                    bitDepth = parseInt(statisticsValue[8].getAttribute("bit_depth"));
                }
                //
                value += " · ";
                if (bitDepth >= resolutionInfo["bitDepth"]) {
                    value += getLanguage("video_player_statistics:color_range:able");
                } else {
                    value += ('<span style="color: #ff7575; font-weight: bold;">' + getLanguage("video_player_statistics:color_range:unable") + "</span>");
                }
                value += " (" + bitDepth + " bpc)";
                (statisticsValue[8].innerHTML != value) ? statisticsValue[8].innerHTML = value : null;

                //색 공간 / 색 조합 / 변환 방식
                if (resolutionInfo["colorSpace"] == null || resolutionInfo["colorPrimaries"] == null) {
                    statisticsItem[9].style.display = "none";
                } else {
                    value = (resolutionInfo["colorSpace"].toUpperCase() + " · " + resolutionInfo["colorPrimaries"].toUpperCase() + " · " + resolutionInfo["colorTransfer"].toUpperCase());
                    (statisticsValue[9].innerHTML != value) ? statisticsValue[9].innerHTML = value : null;
                    statisticsItem[9].style.display = null;
                }

                //동영상 상태 / 시간
                value = "...";
                if (isLoad == true) {
                    if (video.paused == true) {
                        value = getLanguage("video_player_statistics:video_status:1");
                    } else {
                        value = getLanguage("video_player_statistics:video_status:0");
                    }
                } else {
                    let time = new Date().getTime();
                    let difference = (time - loadingStartTime) / 1000;
                    difference = commas(Math.round(difference * 100) / 100);
                    value = getLanguage("video_player_statistics:video_status:2") + (" " + difference + "s");
                }
                let videoCurrentTime = commas(Math.round(video.currentTime * 100) / 100);
                let videoDuration = commas(Math.round(duration * 100) / 100);
                let currentFrame = commas(Math.round(resolutionInfo["framerate"] * video.currentTime));
                let totalFrame = commas(Math.round(resolutionInfo["framerate"] * duration));
                value += (" · (" + videoCurrentTime + "s / " + videoDuration + "s) · (" + currentFrame + "f / " + totalFrame + "f)");
                (statisticsValue[10].innerHTML != value) ? statisticsValue[10].innerHTML = value : null;

                //계산 / 추정 동영상, 오디오 비트레이트
                let videoBitrate = getLanguage("video_player_statistics:bitrate_null");
                if (video.getAttribute("video_bitrate") != null) {
                    videoBitrate = Number.parseFloat(video.getAttribute("video_bitrate"));
                    videoBitrate = commas(Math.round(videoBitrate));
                    videoBitrate += "Kbps";
                }
                let estimatedVideoBitrate = getLanguage("video_player_statistics:bitrate_null");
                if (resolutionInfo["videoBitrate"] != null) {
                    estimatedVideoBitrate = commas(Math.round((resolutionInfo["videoBitrate"] / 1000)));
                    estimatedVideoBitrate += "Kbps";
                }
                let audioBitrate = getLanguage("video_player_statistics:bitrate_null");
                if (video.getAttribute("audio_bitrate") != null) {
                    audioBitrate = Number.parseFloat(video.getAttribute("audio_bitrate"));
                    audioBitrate = commas(Math.round(audioBitrate));
                    audioBitrate += "Kbps";
                }
                let estimatedAudioBitrate = getLanguage("video_player_statistics:bitrate_null");
                if (resolutionInfo["audioBitrate"] != null) {
                    estimatedAudioBitrate = commas(Math.round((resolutionInfo["audioBitrate"] / 1000)));
                    estimatedAudioBitrate += "Kbps";
                }
                value = videoBitrate;
                value += " / ";
                value += estimatedVideoBitrate;
                (statisticsValue[11].innerHTML != value) ? statisticsValue[11].innerHTML = value : null;
                value = audioBitrate;
                value += " / ";
                value += estimatedAudioBitrate;
                (statisticsValue[12].innerHTML != value) ? statisticsValue[12].innerHTML = value : null;

                //오디오 채널 / 샘플레이트 / 샘플 포맷
                value = getLanguage("video_player_statistics:audio_channels:value");
                let audioChannelLayout = getLanguage("video_player_statistics:audio_channels:null");
                if (resolutionInfo["audioChannelLayout"] == "mono" || resolutionInfo["audioChannelLayout"] == "stereo" || resolutionInfo["audioChannelLayout"] == "hexagonal" || resolutionInfo["audioChannelLayout"] == "octagonal" || resolutionInfo["audioChannelLayout"] == "hexadecagonal") {
                    audioChannelLayout = getLanguage("video_player_statistics:audio_channels:" + resolutionInfo["audioChannelLayout"]);
                } else {
                    audioChannelLayout = resolutionInfo["audioChannelLayout"].toString().toUpperCase();
                }
                let audioSampleRate = getLanguage("video_player_statistics:audio_channels:null");
                if (resolutionInfo["audioSampleRate"] != null) {
                    audioSampleRate = (resolutionInfo["audioSampleRate"] / 1000).toFixed(1);
                }
                let audioSampleFormat = getLanguage("video_player_statistics:audio_channels:null");
                if (resolutionInfo["audioSampleFormat"] != null) {
                    audioSampleFormat = resolutionInfo["audioSampleFormat"].toUpperCase();
                }
                value = value.replaceAll("{R:0}", (audioChannelLayout + "(" + resolutionInfo["audioChannels"] + "ch)"));
                value = value.replaceAll("{R:1}", audioSampleRate);
                value = value.replaceAll("{R:2}", audioSampleFormat);
                (statisticsValue[13].innerHTML != value) ? statisticsValue[13].innerHTML = value : null;

                //네트워크 활동
                let networkActivityItem = statisticsNetworkActivity.children;
                let addIndex = (maxNetworkActivityLength - networkActivity.length);
                for (let i = 0; i < networkActivityItem.length; i++) {
                    if (networkActivityItem[addIndex + i] != null) {
                        let height = 0;
                        if (maxValueNetworkActivity != 0) {
                            height = ((networkActivity[i] / maxValueNetworkActivity) * 100);
                        }
                        networkActivityItem[addIndex + i].style.height = height + "%";
                    }
                }

                //프로토콜
                value = getLanguage("video_player_statistics:protocol:pseudo_streaming");
                value += (" · " + performance.getEntries()[0].nextHopProtocol.toUpperCase());
                (statisticsValue[16].innerHTML != value) ? statisticsValue[16].innerHTML = value : null;

                //품질 지표
                value = "PSNR(" + (Math.round(resolutionInfo["qualityMetrics"]["psnr"]["average"] * 100) / 100) + " dB)";
                value += " · SSIM(" + (Math.round((resolutionInfo["qualityMetrics"]["ssim"]["all"] * 100) * 100) / 100) + "%)";
                (statisticsValue[17].innerHTML != value) ? statisticsValue[17].innerHTML = value : null;

                //인코딩 완료 날짜
                value = getLanguage("video_player_statistics:encoding_date:value");
                value = value.replaceAll("{R:0}", resolutionInfo["completionDate"]);
                value = value.replaceAll("{R:1}", getTimeText(resolutionInfo["timeTaken"]));
                (statisticsValue[18].innerHTML != value) ? statisticsValue[18].innerHTML = value : null;

                //현재 날짜
                value = new Date();
                (statisticsValue[19].innerHTML != value) ? statisticsValue[19].innerHTML = value : null;
            }

            //디코드된 프레임
            (isDecodedFrames == true) ? isDecodedFrames = false : null;

            //우선적으로 사용할 코덱이 변경되었는지
            let previousPreferredCodec = preferredCodec;
            preferredCodec = getVideoPlayerSettingsValue("videoCodec");
            if (previousPreferredCodec != preferredCodec) {
                checkCodecs();
            }

            window.requestAnimationFrame(callback);
        } else {
            //PIP 모드 해제
            if (document.pictureInPictureElement == video) {
                document.exitPictureInPicture();
            }
            //로드 해제
            video.src = "";
            video.load();
            previewVideo.src = "";
            previewVideo.load();
            previewDetailedVideo.src = "";
            previewDetailedVideo.load();
        }
    }
    window.requestAnimationFrame(callback);
}
function getVideoPlayerElement(uniqueNumber) {
    let box = document.getElementsByClassName("video_player_box");
    for (let i = 0; i < box.length; i++) {
        if (box[i].getAttribute("unique_number") == uniqueNumber) {
            return box[i];
        }
    }
}
//전체 화면 상태에서의 인터페이스 크기 조절
function checkVideoPlayerFullscreenInterface(uniqueNumber, isFullscreen) {
    let box = getVideoPlayerElement(uniqueNumber);

    let size = window.screen.width;
    if (size < window.screen.height) {
        size = window.screen.height;
    }

    //제한된 품질 모드로 전환 사용 여부
    let fullScreenBalancing = getVideoPlayerSettingsValue("fullScreenBalancing");
    let isSupported = CSS.supports("zoom", 1);
    if (fullScreenBalancing == -2) {
        isSupported = false;
    }

    let defaultSize = (window.screen.width > window.screen.height) ? window.screen.width : window.screen.height;
    defaultSize *= window.devicePixelRatio;
    defaultSize /= 2;
    if (fullScreenBalancing == 0) {
        defaultSize *= 0.5;
    } else if (fullScreenBalancing == 1) {
        defaultSize *= 0.75;
    } else if (fullScreenBalancing == 2) {
        defaultSize *= 1;
    } else if (fullScreenBalancing == 3) {
        defaultSize *= 1.25;
    } else if (fullScreenBalancing == 4) {
        defaultSize *= 1.5;
    }
    
    if (size > defaultSize && isFullscreen == true && isSupported == true) {
        let scale = (size / defaultSize);
        box.style.zoom = scale;
        box.setAttribute("scale", scale);
    } else {
        box.style.zoom = null;
        box.setAttribute("scale", null);
    }
}
function resizeVideoPlayerFullscreenInterface() {
    if (document.fullscreenElement != null) {
        let box = document.fullscreenElement;
        if (box.classList.contains("video_player_box")) {
            let uniqueNumber = Number.parseInt(box.getAttribute("unique_number"));
            checkVideoPlayerFullscreenInterface(uniqueNumber, true);
        }
    }
}
window.addEventListener("resize", resizeVideoPlayerFullscreenInterface);

































let isShowChangeTabVideoPlayerEvent = false;
function changeTabVideoPlayerEvent() {
    if (isTouchDevice() == true || getVideoPlayerSettingsValue("isUseChangeTabPipMode") == false) { return; }

    if (document.hidden == true) {
        let menuNumber = getCurrentMenuNumber();
        let contents = document.getElementById("contents_" + menuNumber);
        let box = contents.getElementsByClassName("video_player_box");

        let isEmbed = false;
        if (box.length == 1) {
            isEmbed = box[0].getAttribute("is_embed");
            if (isEmbed == "true") {
                isEmbed = true;
            } else if (isEmbed == "false") {
                isEmbed = false;
            }
        }
        if (box.length == 1 && isEmbed == false) {
            box = box[0];
        } else {
            //포커스된 박스 있는지
            let isBoxFocus = false;
            for (let i = 0; i < box.length; i++) {
                let isFocus = box[i].getAttribute("is_focus");
                if (isFocus == true || isFocus == "true") {
                    box = box[i];
                    isBoxFocus = true;
                    break;
                }
            }
            if (isBoxFocus == false) {
                return;
            }
        }

        let video = box.getElementsByTagName("video")[0];
        if (video.paused == false && document.pictureInPictureElement == null) {
            video.requestPictureInPicture();
            isShowChangeTabVideoPlayerEvent = true;
        }
    } else if (document.hidden == false && isShowChangeTabVideoPlayerEvent == true && document.pictureInPictureElement != null) {
        document.exitPictureInPicture();
        isShowChangeTabVideoPlayerEvent = false;
    }
}
window.addEventListener("visibilitychange", changeTabVideoPlayerEvent);





























//동영상 재생 효과
function showPlayEffectVideoPlayer(uniqueNumber) {
    let box = getVideoPlayerElement(uniqueNumber);
    let video = box.getElementsByTagName("video")[0];
    let items = box.getElementsByClassName("video_player_container_effect_items")[0];

    //동영상 다 봤는지
    let duration = Number.parseFloat(video.getAttribute("duration"));
    (isNaN(video.duration) == false) ? duration = video.duration : null;

    let isVideoEnded = false;
    if (video.paused == true && Math.abs(video.currentTime - duration) < 0.01) {
        isVideoEnded = true;
    }
    
    let svg = "...";
    if (isVideoEnded == true) {
        svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-215.993,50a24.843,24.843,0,0,0,9.731-1.965,24.918,24.918,0,0,0,7.947-5.358,24.918,24.918,0,0,0,5.358-7.947A24.843,24.843,0,0,0-190.993,25a24.843,24.843,0,0,0-1.965-9.731,24.918,24.918,0,0,0-5.358-7.947,24.918,24.918,0,0,0-7.947-5.358A24.843,24.843,0,0,0-215.993,0a24.958,24.958,0,0,0-12.922,3.595A25.124,25.124,0,0,0-237.93,13h8.532a18.029,18.029,0,0,1,13.4-6,18.02,18.02,0,0,1,18,18,18.02,18.02,0,0,1-18,18,17.987,17.987,0,0,1-16.583-11H-240a24.857,24.857,0,0,0,3.429,7.2,25.1,25.1,0,0,0,5.444,5.7A24.773,24.773,0,0,0-215.993,50Z" transform="translate(240.993)"></path><path d="M269.093,0,290,20.907H269.093Z" transform="translate(-269.093)"></path></g></svg>';
    } else {
        svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M22.406,4.461a3,3,0,0,1,5.187,0L47.379,38.492A3,3,0,0,1,44.786,43H5.214a3,3,0,0,1-2.594-4.508Z" transform="translate(50) rotate(90)"/></g></svg>';
    }
    
    let newEl = document.createElement("div");
    newEl.classList.add("video_player_container_effect_item");
    newEl.innerHTML = svg;
    let el = items.appendChild(newEl);
    setTimeout(() => {
        el.remove();
    }, 700);
}
//동영상 일시정지 효과
function showPauseEffectVideoPlayer(uniqueNumber) {
    let box = getVideoPlayerElement(uniqueNumber);
    let items = box.getElementsByClassName("video_player_container_effect_items")[0];
    
    let newEl = document.createElement("div");
    newEl.classList.add("video_player_container_effect_item");
    newEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="15" height="44" rx="3" transform="translate(3 3)"/><rect width="15" height="44" rx="3" transform="translate(32 3)"/></g></svg>';
    let el = items.appendChild(newEl);
    setTimeout(() => {
        el.remove();
    }, 700);
}
function hideEffectVideoPlayer(uniqueNumber) {
    let box = getVideoPlayerElement(uniqueNumber);
    let items = box.getElementsByClassName("video_player_container_effect_items")[0];
    items.textContent = "";
}



function togglePlayAndPauseVideoPlayer(uniqueNumber) {
    let box = getVideoPlayerElement(uniqueNumber);
    let video = box.getElementsByTagName("video")[0];

    //동영상 다 봤는지
    let duration = Number.parseFloat(video.getAttribute("duration"));
    (isNaN(video.duration) == false) ? duration = video.duration : null;

    let isVideoEnded = false;
    if (video.paused == true && Math.abs(video.currentTime - duration) < 0.01) {
        isVideoEnded = true;
    }
    
    if (isVideoEnded == true) {
        video.currentTime = 0;
        video.play();
    } else if (video.paused == true) {
        video.play();
    } else {
        video.pause();
    }
}


var videoPlayerVolumeList = new Array();
function setVolumeVideoPlayer(uniqueNumber, volume) {
    videoPlayerVolumeList[uniqueNumber] = volume;
}
function getVolumeVideoPlayer(uniqueNumber) {
    return videoPlayerVolumeList[uniqueNumber];
}


//동영상 음소거 토클
function toggleMuteVideoPlayer(uniqueNumber) {
    let previousVolume = getCookie("videoPreviousVolume");
    let volume = getVolumeVideoPlayer(uniqueNumber);

    if (previousVolume == null) {
        if (volume != 0) {
            previousVolume = volume;
        } else {
            previousVolume = 0.5;
        }
        setCookie("videoPreviousVolume", previousVolume);
    }
    if (previousVolume == 0) {
        previousVolume = 0.5;
        setCookie("videoPreviousVolume", previousVolume);
    }

    let isMute = false;
    if (volume == 0) {
        isMute = true;
    }

    if (isMute == false) {
        setCookie("videoPreviousVolume", volume);

        setVolumeVideoPlayer(uniqueNumber, 0);
        setCookie("videoVolume", 0);
    } else {
        setVolumeVideoPlayer(uniqueNumber, previousVolume);
        setCookie("videoVolume", previousVolume);
    }
}



//동영상 시간 이동
function moveTimeVideoPlayer(uniqueNumber, seconds, isTouch) {
    if (isTouch == false) {
        let box = getVideoPlayerElement(uniqueNumber);
        let container = box.getElementsByClassName("video_player_container")[0];
        let rect = container.getBoundingClientRect();
        let items = container.getElementsByClassName("video_player_container_effect_items")[0];

        let icon = "...";
        let position = "...";
        if (seconds < 0) {
            position = "left";
            icon = '<svg style = "margin-top: -10px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M12.428,4.287a3,3,0,0,1,5.145,0l9.7,16.169A3,3,0,0,1,24.7,25H5.3a3,3,0,0,1-2.572-4.543Z" transform="translate(-3 40) rotate(-90)"/><path d="M12.428,4.287a3,3,0,0,1,5.145,0l9.7,16.169A3,3,0,0,1,24.7,25H5.3a3,3,0,0,1-2.572-4.543Z" transform="translate(25 40) rotate(-90)" opacity="0.5"/></g></svg>';
        } else {
            position = "right";
            icon = '<svg style = "margin-top: -10px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M12.428,4.287a3,3,0,0,1,5.145,0l9.7,16.169A3,3,0,0,1,24.7,25H5.3a3,3,0,0,1-2.572-4.543Z" transform="translate(25 10) rotate(90)"/><path d="M12.428,4.287a3,3,0,0,1,5.145,0l9.7,16.169A3,3,0,0,1,24.7,25H5.3a3,3,0,0,1-2.572-4.543Z" transform="translate(53 10) rotate(90)" opacity="0.5"/></g></svg>';
        }

        let newEl = document.createElement("div");
        newEl.classList.add("video_player_container_effect_item");

        if (position == "left") {
            let marginLeft = rect.width / 2;
            newEl.style.marginLeft = (marginLeft * -1) + "px";
        } else {
            let marginLeft = rect.width / 2;
            newEl.style.marginLeft = marginLeft + "px";
        }

        newEl.innerHTML = icon + `
            <div class = "video_player_container_effect_item_text">
                ` + (getTimeText((seconds < 0) ? seconds *= -1 : seconds)) + `
            </div>
        `;
        let el = items.appendChild(newEl);
        setTimeout(() => {
            el.remove();
        }, 700);
    }
}



//영화관 모드
function toggleTheaterModeVideoPlayer(uniqueNumber) {
    if (document.fullscreenElement) {
        return;
    }
    let box = getVideoPlayerElement(uniqueNumber);
    let isAnimationTheaterMode = box.getAttribute("is_animation_theater_mode");
    if (isAnimationTheaterMode == null || isAnimationTheaterMode == false || isAnimationTheaterMode == "false") {
        theaterModeVideoPlayer(uniqueNumber);
    }
}

function theaterModeVideoPlayer(uniqueNumber) {
    let menuNumber = getCurrentMenuNumber();
    let contents = document.getElementById("contents_" + menuNumber);
    let box = getVideoPlayerElement(uniqueNumber);
    box.setAttribute("is_animation_theater_mode", true);

    let viewport = getVisualViewport();

    if (box.classList.contains("theater_mode_video_player")) {
        box.classList.remove("theater_mode_video_player");
        let rect = box.getBoundingClientRect();
        box.classList.add("theater_mode_video_player");

        setBodyScroll(true);
        possiblePullToRefresh(getCurrentMenuNumber());

        function callback() {
            box.style.width = (viewport["width"] + "px");
            box.style.height = (viewport["height"] + "px");
            box.style.top = "0px";
            box.style.left = "0px";

            function callback2() {
                box.style.transition = "all 0.2s";
                box.style.width = (rect.width + "px");
                box.style.height = (rect.height + "px");
                box.style.top = (rect.top + "px");
                box.style.left = (rect.left + "px");

                setTimeout(() => {
                    box.style.transition = null;
                    box.style.width = null;
                    box.style.height = null;
                    box.style.top = null;
                    box.style.left = null;

                    contents.style.position = null;
                    contents.style.zIndex = null;
                    box.classList.remove("theater_mode_video_player");

                    box.setAttribute("is_animation_theater_mode", false);
                }, 200);
            }
            window.requestAnimationFrame(callback2);
        }
        window.requestAnimationFrame(callback);
    } else {
        let rect = box.getBoundingClientRect();

        contents.style.position = "relative";
        contents.style.zIndex = 1;

        box.style.position = "fixed";
        box.style.zIndex = 999;
        box.style.width = (rect.width + "px");
        box.style.height = (rect.height + "px");
        box.style.top = (rect.top + "px");
        box.style.left = (rect.left + "px");

        setBodyScroll(false);
        impossiblePullToRefresh(getCurrentMenuNumber());

        function callback() {
            box.style.transition = "all 0.2s";
            box.style.width = (viewport["width"] + "px");
            box.style.height = (viewport["height"] + "px");
            box.style.top = "0px";
            box.style.left = "0px";

            setTimeout(() => {
                box.style.zIndex = null;
                box.style.position = null;
                box.style.transition = null;
                box.style.width = null;
                box.style.height = null;
                box.style.top = null;
                box.style.left = null;

                box.classList.add("theater_mode_video_player");

                box.setAttribute("is_animation_theater_mode", false);
            }, 200);
        }
        window.requestAnimationFrame(callback);
    }
}

















//탐색바 시간 이동 기록
var timeDistoryVideoPlayer = new Array();
function saveTimeDistoryVideoPlayer(uniqueNumber, seconds) {
    let box = getVideoPlayerElement(uniqueNumber);
    let video = box.getElementsByTagName("video")[0];

    if (timeDistoryVideoPlayer[uniqueNumber] == null) {
        timeDistoryVideoPlayer[uniqueNumber] = new Array();
    }

    let distory = timeDistoryVideoPlayer[uniqueNumber];
    if (distory.length == 0) {
        distory[0] = {
            'time': video.currentTime,
            'isMoved': false
        }
    } else {
        for (let i = 0; i < distory.length; i++) {
            if (distory[i]["isMoved"] == true) {
                distory[i]["time"] = video.currentTime;
                break;
            }
        }
    }

    let isMoved = false;
    let newData = new Array();
    for (let i = 0; i < distory.length; i++) {
        if (isMoved == true) {
            break;
        } else {
            if (distory[i]["isMoved"] == true) {
                isMoved = true;
            }
            distory[i]["isMoved"] = false;
            newData[newData.length] = distory[i];
        }
    }
    distory = newData;

    let length = distory.length;
    distory[length] = {
        'time': seconds,
        'isMoved': true
    };

    timeDistoryVideoPlayer[uniqueNumber] = distory;
}
/*
    type:
        0 = 뒤로가기
        1 = 앞으로 가기
*/
function moveTimeDistoryVideoPlayer(uniqueNumber, type) {
    let box = getVideoPlayerElement(uniqueNumber);
    let video = box.getElementsByTagName("video")[0];

    let history = new Array();
    if (timeDistoryVideoPlayer[uniqueNumber] != null) {
        history = timeDistoryVideoPlayer[uniqueNumber];
    }

    let isMoveTime = false;
    //뒤로가기
    if (type == 0) {
        let moveTime = null;
        for (let i = (history.length - 1); i >= 0; i--) {
            if (history[i]["isMoved"] == false) {
                moveTime = history[i]["time"];
                history[i]["isMoved"] = true;
                break;
            }
        }
        if (moveTime != null) {
            video.currentTime = moveTime;
            isMoveTime = true;
        }
        timeDistoryVideoPlayer[uniqueNumber] = history;
    }
    //앞으로 가기
    if (type == 1) {
        let moveTime = null;
        for (let i = 0; i < history.length; i++) {
            if (history[i]["isMoved"] == true) {
                if (history[i + 1] != null) {
                    moveTime = history[i + 1]["time"];
                    history[i]["isMoved"] = false;
                }
                break;
            }
        }
        if (moveTime != null) {
            video.currentTime = moveTime;
            isMoveTime = true;
        }
        timeDistoryVideoPlayer[uniqueNumber] = history;
    }

    let icon = "...";
    if (isMoveTime == true) {
        if (type == 0) {
            icon = '<!-- Generated by IcoMoon.io --><svg style = "width: 25px; height: 25px;" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 9.059v-2.559c0-0.256-0.098-0.512-0.293-0.708-0.195-0.195-0.451-0.292-0.707-0.292s-0.512 0.097-0.707 0.292l-6.293 6.208 6.293 6.207c0.195 0.195 0.451 0.293 0.707 0.293s0.512-0.098 0.707-0.293 0.293-0.452 0.293-0.707v-2.489c2.75 0.068 5.755 0.566 8 3.989v-1c0-4.633-3.5-8.443-8-8.941z"></path></svg>';
        } else if (type == 1) {
            icon = '<!-- Generated by IcoMoon.io --><svg style = "width: 25px; height: 25px;" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13 5.499c-0.256 0-0.512 0.097-0.707 0.292-0.195 0.196-0.293 0.452-0.293 0.708v2.559c-4.5 0.498-8 4.309-8 8.941v1c2.245-3.423 5.25-3.92 8-3.989v2.489c0 0.255 0.098 0.512 0.293 0.707s0.451 0.293 0.707 0.293 0.512-0.098 0.707-0.293l6.293-6.207-6.293-6.208c-0.195-0.195-0.451-0.292-0.707-0.292z"></path></svg>';
        }
    } else {
        icon = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"> <defs> <clipPath id="clip-path"> <path id="패스_15" data-name="패스 15" d="M0,0H50V25s-15.093-2.888-21.343,3.362S25,50,25,50H0Z" fill="#fff" stroke="#707070" stroke-width="1"/> </clipPath> <clipPath id="clip-path-2"> <rect id="사각형_31" data-name="사각형 31" width="50" height="50"/> </clipPath> </defs> <g id="timer_2" data-name="timer – 2" clip-path="url(#clip-path-2)"> <rect id="사각형_32" data-name="사각형 32" width="22" height="4" rx="2" transform="translate(31.615 47.172) rotate(-45)"/> <g id="마스크_그룹_3" data-name="마스크 그룹 3" clip-path="url(#clip-path)"> <g id="a" clip-path="url(#clip-path-2)"> <path id="패스_13" data-name="패스 13" d="M2,0A1.828,1.828,0,0,1,4,1.583V11.87c0,.874-4,0-4,0V1.583A1.828,1.828,0,0,1,2,0Z" transform="translate(34.785 31.957) rotate(135)"/> <path id="패스_14" data-name="패스 14" d="M-3095,50a24.845,24.845,0,0,1-9.731-1.965,24.918,24.918,0,0,1-7.947-5.358,24.922,24.922,0,0,1-5.358-7.947A24.843,24.843,0,0,1-3120,25a24.845,24.845,0,0,1,1.966-9.731,24.922,24.922,0,0,1,5.358-7.947,24.917,24.917,0,0,1,7.947-5.358A24.842,24.842,0,0,1-3095,0a24.845,24.845,0,0,1,9.731,1.965,24.917,24.917,0,0,1,7.947,5.358,24.918,24.918,0,0,1,5.358,7.947A24.839,24.839,0,0,1-3070,25a24.835,24.835,0,0,1-1.965,9.731,24.922,24.922,0,0,1-5.358,7.947,24.916,24.916,0,0,1-7.947,5.358A24.845,24.845,0,0,1-3095,50Zm0-46a21.024,21.024,0,0,0-21,21,21.023,21.023,0,0,0,21,21,21.024,21.024,0,0,0,21-21,21.024,21.024,0,0,0-21-21Z" transform="translate(3120)"/> <rect id="사각형_30" data-name="사각형 30" width="4" height="16" rx="2" transform="translate(23 11)"/> </g> </g> <rect id="사각형_34" data-name="사각형 34" width="22" height="4" rx="2" transform="translate(47.172 50) rotate(-135)"/> </g> </svg>';
    }

    let items = box.getElementsByClassName("video_player_container_effect_items")[0];
    let newEl = document.createElement("div");
    newEl.classList.add("video_player_container_effect_item");
    newEl.innerHTML = icon;
    let el = items.appendChild(newEl);
    setTimeout(() => {
        el.remove();
    }, 700);
}










//동영상 품질
let videoPlayerResolutionScreenTime = null;
let videoPlayerResolutionScreenHeight = (window.screen.height * window.devicePixelRatio);
let videoPlayerResolutionScreenWidth = (window.screen.width * window.devicePixelRatio);
function getVideoPlayerResolutionData(uniqueNumber, info) {
    let box = getVideoPlayerElement(uniqueNumber);
    let resolutions = null;
    if (info == null) {
        videoPlayerInfo = JSON.parse(box.getElementsByClassName("video_player_info")[0].innerHTML);
        resolutions = videoPlayerInfo["resolutions"];
    } else {
        resolutions = info;
    }
    
    let resolutionData = new Array();

    //전체 화면이 아닐 경우
    if (document.fullscreenElement == null) {
        videoPlayerResolutionScreenHeight = (window.screen.height * window.devicePixelRatio);
        videoPlayerResolutionScreenWidth = (window.screen.width * window.devicePixelRatio);
        videoPlayerResolutionScreenTime = null;
    } else {
        if (videoPlayerResolutionScreenTime == null) {
            videoPlayerResolutionScreenTime = new Date().getTime();
        }
        let difference = (new Date().getTime() - videoPlayerResolutionScreenTime) / 1000;
        if (difference >= 3) {
            videoPlayerResolutionScreenHeight = (window.screen.height * window.devicePixelRatio);
            videoPlayerResolutionScreenWidth = (window.screen.width * window.devicePixelRatio);
        }
    }
    
    //자동
    for (let i = (resolutions.length - 1); i >= 0; i--) {
        let resolution = resolutions[i];
        let screenHeight = videoPlayerResolutionScreenHeight;

        let screenWidth = videoPlayerResolutionScreenWidth;
        if (screenWidth < screenHeight) {
            screenHeight = screenWidth;
        }

        //처리 완료라면
        if (resolution["status"] == 0) {
            if (resolution["resolution"] <= screenHeight) {
                resolutionData[0] = resolution;
                break;
            }
            if (resolution["resolution"] == 144) {
                resolutionData[0] = resolution;
                break;
            }
        }
    }

    //최고 품질
    for (let i = (resolutions.length - 1); i >= 0; i--) {
        let resolution = resolutions[i];

        //처리 완료라면
        if (resolution["status"] == 0) {
            resolutionData[1] = resolution;
            break;
        }
    }

    //최저 품질
    for (let i = (resolutions.length - 1); i >= 0; i--) {
        let resolution = resolutions[i];
        let screenHeight = videoPlayerResolutionScreenHeight;

        let screenWidth = videoPlayerResolutionScreenWidth;
        if (screenWidth < screenHeight) {
            screenHeight = screenWidth;
        }

        screenHeight /= 2;

        //처리 완료라면
        if (resolution["status"] == 0) {
            if (resolution["resolution"] <= screenHeight) {
                resolutionData[2] = resolution;
                break;
            }
            if (resolution["resolution"] == 144) {
                resolutionData[2] = resolution;
                break;
            }
        }
    }

    //제한된 품질
    for (let i = (resolutions.length - 1); i >= 0; i--) {
        let resolution = resolutions[i];
        
        //처리 완료라면
        if (resolution["status"] == 0 && resolution["resolution"] == 144) {
            resolutionData[3] = resolution;
            break;
        }
    }

    return resolutionData;
}









//자막
/*
    text: (문장) [String]
    range:
        start: (초) [Float]
        end: (초) [Float]
    property:
        type:
            soliloquy = 혼잣말
            talking = 대화
            sing = 노래
            deaf = 청각 장애인을 위한
        alignment:
            vertical:
                start = 위쪽
                center = 가운데
                end = 아래쪽
            horizontal:
                start = 왼쪽
                center = 가운데
                end = 오른쪽
*/
function applySubtitleVideoPlayer(uniqueNumber, info) {
    let box = getVideoPlayerElement(uniqueNumber);
    let video = box.getElementsByTagName("video")[0];

    let items = box.getElementsByClassName("video_player_subtitle_items")[0];
    items.textContent = "";

    for (let i = 0; i < info.length; i++) {
        let text = info[i]["text"];
        let range = info[i]["range"];

        text = text.replaceAll("\n", "<br />");

        let newEl = document.createElement("div");
        newEl.setAttribute("start", range["start"]);
        newEl.setAttribute("end", range["end"]);
        newEl.classList.add("video_player_subtitle_item");
        newEl.innerHTML = `
            <div class = "video_player_subtitle_item_backdrop">
                <text>` + text + `</text>
                <span>` + text + `</span>
            </div>
        `;

        items.appendChild(newEl);
    }

    //PIP 모드에서 자막 표시 관련
    let track = document.createElement('track');
    track.kind = 'subtitles';
    track.mode = 'showing';
    track.default = true;

    let blob = new Blob([generateVTT(info)], { type: 'text/vtt;charset=utf-8' });
    function generateVTT(info) {
        let vttString = "WEBVTT\n\n";
        let count = 1;
        for (let i = 0; i < info.length; i++) {
            let text = info[i]["text"];
            let range = info[i]["range"];

            let start = secondsToVTTTime(range["start"]);
            let end = secondsToVTTTime(range["end"]);

            let cueString = `${count}\n${start} --> ${end}\n${text}\n\n`;
            vttString += cueString;
            count ++;
        }
        return vttString;
    }
    function secondsToVTTTime(seconds) {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        let remainingSeconds = (seconds % 3600) % 60;
        function padZero(number) {
            if (number < 10) {
                return `0${number}`;
            }
            return number;
        }
        return `${padZero(hours)}:${padZero(minutes)}:${padZero(remainingSeconds.toFixed(3))}`;
    }
    track.src = URL.createObjectURL(blob);

    //기존 자막 트랙 삭제
    let videoTrack = video.getElementsByTagName("track");
    for (let i = 0; i < videoTrack.length; i++) {
        videoTrack[i].remove();
        i--;
    }
    //자막 트랙 추가
    video.appendChild(track);

    let textTrack = null;
    track.onload = () => {
        textTrack = video.textTracks[0];
        textTrack.mode = 'disabled';
    }

    //이벤트 관련
    video.onenterpictureinpicture = () => {
        textTrack.mode = 'showing';
    }
    video.onleavepictureinpicture = () => {
        textTrack.mode = 'disabled';
    }
}





//키보드 이벤트
let containerSoundTimeoutVideoPlayer = new Array();
function keyDownVideoPlayer(event) {
    let actionTag = null;
    let isContenteditable = false;
    if (document.activeElement != null) {
        actionTag = document.activeElement.tagName.toLowerCase();
        if (document.activeElement.getAttribute("contenteditable") != null) {
            isContenteditable = true;
        }
    }
    if (actionTag == null || (actionTag != "input" && isContenteditable == false)) {
        let menuNumber = getCurrentMenuNumber();
        let contents = document.getElementById("contents_" + menuNumber);
        let box = contents.getElementsByClassName("video_player_box");

        let isEmbed = false;
        if (box.length == 1) {
            isEmbed = box[0].getAttribute("is_embed");
            if (isEmbed == "true") {
                isEmbed = true;
            } else if (isEmbed == "false") {
                isEmbed = false;
            }
        }
        if (box.length == 1 && isEmbed == false) {
            box = box[0];
        } else {
            //포커스된 박스 있는지
            let isBoxFocus = false;
            for (let i = 0; i < box.length; i++) {
                let isFocus = box[i].getAttribute("is_focus");
                if (isFocus == true || isFocus == "true") {
                    box = box[i];
                    isBoxFocus = true;
                    break;
                }
            }
            if (isBoxFocus == false) {
                return;
            }
        }
        let boxRect = box.getBoundingClientRect();
        let viewport = getVisualViewport();
    
        //재생 및 일시정지
        if (event.keyCode == 32 || event.keyCode == 75) {
            let uniqueNumber = box.getAttribute("unique_number");
            let video = box.getElementsByTagName("video")[0];

            let duration = Number.parseFloat(video.getAttribute("duration"));
            (isNaN(video.duration) == false) ? duration = video.duration : null;
            
            if (video.paused == true && Math.abs(video.currentTime - duration) < 0.01) {
                showPlayEffectVideoPlayer(uniqueNumber);
                video.currentTime = 0;
                video.play();
            } else if (video.paused == true) {
                video.play();
                showPlayEffectVideoPlayer(uniqueNumber);
            } else {
                video.pause();
                showPauseEffectVideoPlayer(uniqueNumber);
            }
    
            event.preventDefault();
        }
        //앞으로 가기 및 뒤로가기
        if (event.keyCode == 37 || event.keyCode == 39) {
            let uniqueNumber = box.getAttribute("unique_number");
            let video = box.getElementsByTagName("video")[0];
    
            let seconds = 0;
            if (event.keyCode == 37) {
                seconds = -5;
                if (event.ctrlKey == true) {
                    seconds = -1;
                }
                if (event.shiftKey == true) {
                    seconds = -10;
                }
            } else if (event.keyCode == 39) {
                seconds = 5;
                if (event.ctrlKey == true) {
                    seconds = 1;
                }
                if (event.shiftKey == true) {
                    seconds = 10;
                }
            }
    
            video.currentTime += seconds;
            moveTimeVideoPlayer(uniqueNumber, seconds, false);
    
            event.preventDefault();
        }
        //사운드 조절
        if (event.keyCode == 38 || event.keyCode == 40) {
            let uniqueNumber = box.getAttribute("unique_number");
            let containerSound = box.getElementsByClassName("video_player_container_sound")[0];
    
            let sound = 0;
            if (event.keyCode == 38) {
                sound = 0.1;
                if (event.ctrlKey == true) {
                    sound = 0.05;
                }
                if (event.shiftKey == true) {
                    sound = 0.25;
                }
            } else if (event.keyCode == 40) {
                sound = -0.1;
                if (event.ctrlKey == true) {
                    sound = -0.05;
                }
                if (event.shiftKey == true) {
                    sound = -0.25;
                }
            }
            let videoVolume = getVolumeVideoPlayer(uniqueNumber);
    
            let volume = (Math.round((videoVolume) * 10000) / 10000) + sound;
            (volume >= 1) ? volume = 1 : null;
            (volume <= 0) ? volume = 0 : null;
    
            setVolumeVideoPlayer(uniqueNumber, volume);
            setCookie("videoVolume", volume);
            (volume != 0) ? setCookie("videoPreviousVolume", volume) : null;
    
            if (containerSoundTimeoutVideoPlayer[uniqueNumber] != null) {
                clearTimeout(containerSoundTimeoutVideoPlayer[uniqueNumber]);
                containerSoundTimeoutVideoPlayer[uniqueNumber] = null;
            }
            containerSound.classList.add("show_video_player_container_sound");
            containerSoundTimeoutVideoPlayer[uniqueNumber] = setTimeout(() => {
                containerSound.classList.remove("show_video_player_container_sound");
            }, 2000);
    
            event.preventDefault();
        }
        //전체 화면 켜기 및 끄기
        if (event.keyCode == 70) {
            if (document.fullscreenElement == null) {
                box.requestFullscreen();
            } else {
                document.exitFullscreen();
            }

            event.preventDefault();
        }
        //영화관 모드 켜기 및 끄기
        let isFullBodySize = false;
        if (viewport["width"] == boxRect.width && viewport["height"] == boxRect.height) {
            isFullBodySize = true;
        }
        if (((document.fullscreenElement == null && isEmbed == false && isFullBodySize == false) || box.classList.contains("theater_mode_video_player")) && event.keyCode == 84) {
            let uniqueNumber = box.getAttribute("unique_number");
            toggleTheaterModeVideoPlayer(uniqueNumber);
            
            event.preventDefault();
        }
        //음소거 토클
        if (event.keyCode == 77) {
            let uniqueNumber = box.getAttribute("unique_number");
            let volume = getVolumeVideoPlayer(uniqueNumber);
    
            //음소거 토클
            toggleMuteVideoPlayer(uniqueNumber);

            let svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(2.622 -2)"><path d="M18,36.625a2.2,2.2,0,0,1-1.66-.784,2.952,2.952,0,0,1,0-3.787,12.815,12.815,0,0,0,0-16.414,2.952,2.952,0,0,1,0-3.787,2.147,2.147,0,0,1,3.318,0,18.729,18.729,0,0,1,0,23.991,2.2,2.2,0,0,1-1.66.784Z" transform="translate(12.301 3.155)"></path></g><path d="M-217.414,48.586-227,39h-10a3,3,0,0,1-3-3V18a3,3,0,0,1,3-3h8l11.586-11.586A2,2,0,0,1-214,4.829V47.172a2,2,0,0,1-2.014,2A1.958,1.958,0,0,1-217.414,48.586Z" transform="translate(240 -1)"></path></g></svg>';
            if (volume >= 0.5) {
                svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-217.414,48.586-227,39h-10a3,3,0,0,1-3-3V18a3,3,0,0,1,3-3h8l11.586-11.586A2,2,0,0,1-214,4.829V47.172a2,2,0,0,1-2.014,2A1.958,1.958,0,0,1-217.414,48.586Z" transform="translate(240 -1)"></path><g transform="translate(2.622 -2)"><path d="M26.338,41.675a2.2,2.2,0,0,1-1.66-.784,2.952,2.952,0,0,1,0-3.787,20.7,20.7,0,0,0,0-26.516,2.952,2.952,0,0,1,0-3.787A2.147,2.147,0,0,1,28,6.8a25.769,25.769,0,0,1,6.185,17.046A25.769,25.769,0,0,1,28,40.893a2.2,2.2,0,0,1-1.66.784h0ZM18,36.625a2.2,2.2,0,0,1-1.66-.784,2.952,2.952,0,0,1,0-3.787,12.815,12.815,0,0,0,0-16.414,2.952,2.952,0,0,1,0-3.787,2.147,2.147,0,0,1,3.318,0,18.729,18.729,0,0,1,0,23.991,2.2,2.2,0,0,1-1.66.784Z" transform="translate(12.301 3.155)"></path></g></g></svg>';
            } else if (volume == 0) {
                svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3.771" height="23.881" rx="1.885" transform="translate(30.447 18.388) rotate(-45)"></rect><rect width="3.771" height="23.881" rx="1.885" transform="translate(33.114 35.274) rotate(-135)"></rect><path d="M-217.414,48.586-227,39h-10a3,3,0,0,1-3-3V18a3,3,0,0,1,3-3h8l11.586-11.586A2,2,0,0,1-214,4.829V47.172a2,2,0,0,1-2.014,2A1.958,1.958,0,0,1-217.414,48.586Z" transform="translate(240 -1)"></path></g></svg>';
            }
    
            let items = box.getElementsByClassName("video_player_container_effect_items")[0];
    
            let newEl = document.createElement("div");
            newEl.classList.add("video_player_container_effect_item");
            newEl.innerHTML = svg;
            let el = items.appendChild(newEl);
            setTimeout(() => {
                el.remove();
            }, 700);
    
            event.preventDefault();
        }
        //탐색바 시간 기록 이동 - 뒤로가기
        if (event.keyCode == 65) {
            let uniqueNumber = box.getAttribute("unique_number");
            moveTimeDistoryVideoPlayer(uniqueNumber, 0);
        }
        //탐색바 시간 기록 이동 - 앞으로 가기
        if (event.keyCode == 68) {
            let uniqueNumber = box.getAttribute("unique_number");
            moveTimeDistoryVideoPlayer(uniqueNumber, 1);
        }
        //Home키 - 맨 처음으로
        if (event.keyCode == 36) {
            let uniqueNumber = box.getAttribute("unique_number");
            let video = box.getElementsByTagName("video")[0];
    
            let seconds = (video.currentTime) * -1;
            if (seconds != 0) {
                video.currentTime += seconds;
                moveTimeVideoPlayer(uniqueNumber, seconds, false);
            } else {
                let svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"> <defs> <clipPath id="clip-path"> <path id="패스_15" data-name="패스 15" d="M0,0H50V25s-15.093-2.888-21.343,3.362S25,50,25,50H0Z" fill="#fff" stroke="#707070" stroke-width="1"/> </clipPath> <clipPath id="clip-path-2"> <rect id="사각형_31" data-name="사각형 31" width="50" height="50"/> </clipPath> </defs> <g id="timer_2" data-name="timer – 2" clip-path="url(#clip-path-2)"> <rect id="사각형_32" data-name="사각형 32" width="22" height="4" rx="2" transform="translate(31.615 47.172) rotate(-45)"/> <g id="마스크_그룹_3" data-name="마스크 그룹 3" clip-path="url(#clip-path)"> <g id="a" clip-path="url(#clip-path-2)"> <path id="패스_13" data-name="패스 13" d="M2,0A1.828,1.828,0,0,1,4,1.583V11.87c0,.874-4,0-4,0V1.583A1.828,1.828,0,0,1,2,0Z" transform="translate(34.785 31.957) rotate(135)"/> <path id="패스_14" data-name="패스 14" d="M-3095,50a24.845,24.845,0,0,1-9.731-1.965,24.918,24.918,0,0,1-7.947-5.358,24.922,24.922,0,0,1-5.358-7.947A24.843,24.843,0,0,1-3120,25a24.845,24.845,0,0,1,1.966-9.731,24.922,24.922,0,0,1,5.358-7.947,24.917,24.917,0,0,1,7.947-5.358A24.842,24.842,0,0,1-3095,0a24.845,24.845,0,0,1,9.731,1.965,24.917,24.917,0,0,1,7.947,5.358,24.918,24.918,0,0,1,5.358,7.947A24.839,24.839,0,0,1-3070,25a24.835,24.835,0,0,1-1.965,9.731,24.922,24.922,0,0,1-5.358,7.947,24.916,24.916,0,0,1-7.947,5.358A24.845,24.845,0,0,1-3095,50Zm0-46a21.024,21.024,0,0,0-21,21,21.023,21.023,0,0,0,21,21,21.024,21.024,0,0,0,21-21,21.024,21.024,0,0,0-21-21Z" transform="translate(3120)"/> <rect id="사각형_30" data-name="사각형 30" width="4" height="16" rx="2" transform="translate(23 11)"/> </g> </g> <rect id="사각형_34" data-name="사각형 34" width="22" height="4" rx="2" transform="translate(47.172 50) rotate(-135)"/> </g> </svg>';
                let items = box.getElementsByClassName("video_player_container_effect_items")[0];
                let newEl = document.createElement("div");
                newEl.classList.add("video_player_container_effect_item");
                newEl.innerHTML = svg;
                let el = items.appendChild(newEl);
                setTimeout(() => {
                    el.remove();
                }, 700);
            }
    
            event.preventDefault();
        }
        //End키 - 맨 뒤로
        if (event.keyCode == 35) {
            let uniqueNumber = box.getAttribute("unique_number");
            let video = box.getElementsByTagName("video")[0];
    
            let duration = Number.parseFloat(video.getAttribute("duration"));
            (isNaN(video.duration) == false) ? duration = video.duration : null;

            let seconds = (duration - video.currentTime);
            if (seconds != 0) {
                video.currentTime += seconds;
                moveTimeVideoPlayer(uniqueNumber, seconds, false);
            } else {
                let svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"> <defs> <clipPath id="clip-path"> <path id="패스_15" data-name="패스 15" d="M0,0H50V25s-15.093-2.888-21.343,3.362S25,50,25,50H0Z" fill="#fff" stroke="#707070" stroke-width="1"/> </clipPath> <clipPath id="clip-path-2"> <rect id="사각형_31" data-name="사각형 31" width="50" height="50"/> </clipPath> </defs> <g id="timer_2" data-name="timer – 2" clip-path="url(#clip-path-2)"> <rect id="사각형_32" data-name="사각형 32" width="22" height="4" rx="2" transform="translate(31.615 47.172) rotate(-45)"/> <g id="마스크_그룹_3" data-name="마스크 그룹 3" clip-path="url(#clip-path)"> <g id="a" clip-path="url(#clip-path-2)"> <path id="패스_13" data-name="패스 13" d="M2,0A1.828,1.828,0,0,1,4,1.583V11.87c0,.874-4,0-4,0V1.583A1.828,1.828,0,0,1,2,0Z" transform="translate(34.785 31.957) rotate(135)"/> <path id="패스_14" data-name="패스 14" d="M-3095,50a24.845,24.845,0,0,1-9.731-1.965,24.918,24.918,0,0,1-7.947-5.358,24.922,24.922,0,0,1-5.358-7.947A24.843,24.843,0,0,1-3120,25a24.845,24.845,0,0,1,1.966-9.731,24.922,24.922,0,0,1,5.358-7.947,24.917,24.917,0,0,1,7.947-5.358A24.842,24.842,0,0,1-3095,0a24.845,24.845,0,0,1,9.731,1.965,24.917,24.917,0,0,1,7.947,5.358,24.918,24.918,0,0,1,5.358,7.947A24.839,24.839,0,0,1-3070,25a24.835,24.835,0,0,1-1.965,9.731,24.922,24.922,0,0,1-5.358,7.947,24.916,24.916,0,0,1-7.947,5.358A24.845,24.845,0,0,1-3095,50Zm0-46a21.024,21.024,0,0,0-21,21,21.023,21.023,0,0,0,21,21,21.024,21.024,0,0,0,21-21,21.024,21.024,0,0,0-21-21Z" transform="translate(3120)"/> <rect id="사각형_30" data-name="사각형 30" width="4" height="16" rx="2" transform="translate(23 11)"/> </g> </g> <rect id="사각형_34" data-name="사각형 34" width="22" height="4" rx="2" transform="translate(47.172 50) rotate(-135)"/> </g> </svg>';
                let items = box.getElementsByClassName("video_player_container_effect_items")[0];
                let newEl = document.createElement("div");
                newEl.classList.add("video_player_container_effect_item");
                newEl.innerHTML = svg;
                let el = items.appendChild(newEl);
                setTimeout(() => {
                    el.remove();
                }, 700);
            }
    
            event.preventDefault();
        }
        //P키 - 이전으로 이동
        if (event.keyCode == 80) {
            let controlsWrap = box.getElementsByClassName("video_player_container_controls_wrap")[0];
            let previousButton = controlsWrap.getElementsByClassName("video_player_container_controls_item")[0];
            let onclick = previousButton.getAttribute("onclick");

            let svg = '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.328 16.922q1.688-2.109 1.688-4.922 0-3.281-2.367-5.648t-5.648-2.367q-1.125 0-2.578 0.492t-2.344 1.195zM12 20.016q1.125 0 2.578-0.492t2.344-1.195l-11.25-11.25q-1.688 2.109-1.688 4.922 0 3.281 2.367 5.648t5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z"></path></svg>';
            if (onclick != null && onclick != "null" && onclick != undefined && onclick != "undefined" && onclick != "") {
                svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="a"><rect width="50" height="50"></rect></clipPath></defs><g id="b" clip-path="url(#a)"><g transform="translate(50 50) rotate(180)" clip-path="url(#a)"><rect width="14" height="44" rx="3" transform="translate(33 3)"></rect><path d="M19.581,3.3a3,3,0,0,1,4.838,0L40.5,25.226A3,3,0,0,1,38.08,30H5.92A3,3,0,0,1,3.5,25.226Z" transform="translate(33 3) rotate(90)"></path></g></g></svg>';
                eval(onclick);
            }

            let items = box.getElementsByClassName("video_player_container_effect_items")[0];
            let newEl = document.createElement("div");
            newEl.classList.add("video_player_container_effect_item");
            newEl.innerHTML = svg;
            let el = items.appendChild(newEl);
            setTimeout(() => {
                el.remove();
            }, 700);
        }
        //N키 - 다음으로 이동
        if (event.keyCode == 78) {
            let controlsWrap = box.getElementsByClassName("video_player_container_controls_wrap")[0];
            let nextButton = controlsWrap.getElementsByClassName("video_player_container_controls_item")[2];
            let onclick = nextButton.getAttribute("onclick");

            let svg = '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.328 16.922q1.688-2.109 1.688-4.922 0-3.281-2.367-5.648t-5.648-2.367q-1.125 0-2.578 0.492t-2.344 1.195zM12 20.016q1.125 0 2.578-0.492t2.344-1.195l-11.25-11.25q-1.688 2.109-1.688 4.922 0 3.281 2.367 5.648t5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z"></path></svg>';
            if (onclick != null && onclick != "null" && onclick != undefined && onclick != "undefined" && onclick != "") {
                svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="14" height="44" rx="3" transform="translate(33 3)"></rect><path d="M19.581,3.3a3,3,0,0,1,4.838,0L40.5,25.226A3,3,0,0,1,38.08,30H5.92A3,3,0,0,1,3.5,25.226Z" transform="translate(33 3) rotate(90)"></path></g></svg>';
                eval(onclick);
            }

            let items = box.getElementsByClassName("video_player_container_effect_items")[0];
            let newEl = document.createElement("div");
            newEl.classList.add("video_player_container_effect_item");
            newEl.innerHTML = svg;
            let el = items.appendChild(newEl);
            setTimeout(() => {
                el.remove();
            }, 700);
        }
        //S키 - 현재 장면 스크린샷
        if (event.keyCode == 83) {
            let uniqueNumber = box.getAttribute("unique_number");
            videoPlayerScreenshot(uniqueNumber);
        }
    }
}
document.addEventListener("keydown", keyDownVideoPlayer);

function mouseWheelVideoPlayer(event) {
    let menuNumber = getCurrentMenuNumber();
    let contents = document.getElementById("contents_" + menuNumber);
    let box = contents.getElementsByClassName("video_player_box");

    let isEmbed = false;
    if (box.length == 1) {
        isEmbed = box[0].getAttribute("is_embed");
        if (isEmbed == "true") {
            isEmbed = true;
        } else if (isEmbed == "false") {
            isEmbed = false;
        }
    }
    if (box.length == 1 && isEmbed == false) {
        box = box[0];
    } else {
        //포커스된 박스 있는지
        let isBoxFocus = false;
        for (let i = 0; i < box.length; i++) {
            let isFocus = box[i].getAttribute("is_focus");
            if (isFocus == true || isFocus == "true") {
                box = box[i];
                isBoxFocus = true;
                break;
            }
        }
        if (isBoxFocus == false) {
            return;
        }
    }
    let isExistPopup = box.getAttribute("is_exist_popup");
    if (isExistPopup == true || isExistPopup == "true") {
        return;
    }

    //음량 조절
    if ((event.shiftKey == true || box.classList.contains("theater_mode_video_player") || document.fullscreenElement != null)) {
        let uniqueNumber = box.getAttribute("unique_number");
        let containerSound = box.getElementsByClassName("video_player_container_sound")[0];
        let videoVolume = getVolumeVideoPlayer(uniqueNumber);
        
        let deltaY = (((event.deltaY / 100) / 100) * 3) * -1;

        let volume = (Math.round((videoVolume) * 10000) / 10000) + deltaY;
        (volume >= 1) ? volume = 1 : null;
        (volume <= 0) ? volume = 0 : null;

        setVolumeVideoPlayer(uniqueNumber, volume);
        setCookie("videoVolume", volume);
        (volume != 0) ? setCookie("videoPreviousVolume", volume) : null;

        if (containerSoundTimeoutVideoPlayer[uniqueNumber] != null) {
            clearTimeout(containerSoundTimeoutVideoPlayer[uniqueNumber]);
            containerSoundTimeoutVideoPlayer[uniqueNumber] = null;
        }
        containerSound.classList.add("show_video_player_container_sound");
        containerSoundTimeoutVideoPlayer[uniqueNumber] = setTimeout(() => {
            containerSound.classList.remove("show_video_player_container_sound");
        }, 2000);
    }
}
document.addEventListener("wheel", mouseWheelVideoPlayer);

function changePlaybackRateVideoPlayer(uniqueNumber, rate) {
    let box = getVideoPlayerElement(uniqueNumber);
    let video = box.getElementsByTagName("video")[0];

    video.playbackRate = rate;
}

/*
    품질 모드:
        -1 = 사용자 지정
        0 = 자동
        1 = 최고 품질
        2 = 낮은 품질
        3 = 제한된 품질
*/
function changeResolutionModeVideoPlayer(uniqueNumber, mode, resolution) {
    let box = getVideoPlayerElement(uniqueNumber);
    let video = box.getElementsByTagName("video")[0];

    video.setAttribute("resolution_mode", mode);
    (resolution != null) ? video.setAttribute("custom_resolution", resolution) : video.setAttribute("custom_resolution", null);
    (mode != -1 && mode != 3) ? setCookie("videoPlayerResolutionMode", mode) : null;
}







//이전에 보던 위치로 이동 (실행 취소)
function goTofirstTimeVideoPlayer(uniqueNumber) {
    let box = getVideoPlayerElement(uniqueNumber);
    let video = box.getElementsByTagName("video")[0];
    video.currentTime = 0;
}








function videoPlayerScreenshot(uniqueNumber) {
    let box = getVideoPlayerElement(uniqueNumber);
    let video = box.getElementsByTagName("video")[0];

    //SVG
    let svg = '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.328 16.922q1.688-2.109 1.688-4.922 0-3.281-2.367-5.648t-5.648-2.367q-1.125 0-2.578 0.492t-2.344 1.195zM12 20.016q1.125 0 2.578-0.492t2.344-1.195l-11.25-11.25q-1.688 2.109-1.688 4.922 0 3.281 2.367 5.648t5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z"></path></svg>';
    
    let isLoad = video.getAttribute("is_load");
    if (isLoad == "true" || isLoad == true) {
        svg = '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>';
            
        let canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        let ctx = canvas.getContext('2d');

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        let capturedFrame = canvas.toDataURL();

        let now = new Date();
        let year = now.getFullYear();
        let month = String(now.getMonth() + 1).padStart(2, '0');
        let day = String(now.getDate()).padStart(2, '0');
        let hours = String(now.getHours()).padStart(2, '0');
        let minutes = String(now.getMinutes()).padStart(2, '0');
        let seconds = String(now.getSeconds()).padStart(2, '0');

        let download = document.createElement('a');
        download.href = capturedFrame;
        download.download = (`${year}${month}${day}${hours}${minutes}${seconds}.png`);
        document.body.appendChild(download);
        download.click();

        canvas.remove();
        download.remove();
    }
    
    let items = box.getElementsByClassName("video_player_container_effect_items")[0];
    let newEl = document.createElement("div");
    newEl.classList.add("video_player_container_effect_item");
    newEl.innerHTML = svg;
    let el = items.appendChild(newEl);
    setTimeout(() => {
        el.remove();
    }, 700);
}






















function videoPlayerMoveSettings(uniqueNumber, type, isBack) {
    (isBack == null) ? isBack = false : null;
    let seconds = 0.3;

    let box = getVideoPlayerElement(uniqueNumber);
    let container = box.getElementsByClassName("video_player_container")[0];
    let settingsItems = container.getElementsByClassName("video_player_container_settings_items")[0];
    let previousItem = settingsItems.getElementsByClassName("video_player_container_settings_item")[0];
    settingsItems.style.overflow = "hidden";
    previousItem.style.pointerEvents = "none";
    
    //예전 스크롤 정보
    let previousItemRect = previousItem.getBoundingClientRect();
    let previousScrollTop = settingsItems.scrollTop;

    //예전 바인딩 정보
    let previousRect = settingsItems.getBoundingClientRect();

    previousItem.style.display = "none";
    let newItem = getVideoPlayerSettingsItemElement(uniqueNumber, type);
    newItem = settingsItems.appendChild(newItem);
    newItem.style.pointerEvents = "none";
    settingsItems.scrollTop = 0;

    //새로운 바인딩 정보
    let newRect = settingsItems.getBoundingClientRect();
    previousItem.style.display = null;

    //width, height 고정
    previousItem.style.minWidth = (previousRect.width + "px");
    previousItem.style.minHeight = (previousRect.height + "px");
    previousItem.style.maxWidth = (previousRect.width + "px");
    previousItem.style.maxHeight = (previousRect.height + "px");
    previousItem.style.position = "absolute";
    previousItem.style.bottom = "0px";
    //위치가 고정되게
    let scrollHeight = (newRect.scrollHeight - newRect.height);
    let marginBottom = (previousItemRect.bottom - previousRect.bottom);
    marginBottom += scrollHeight;
    (marginBottom < 0) ? marginBottom = 0 : null;
    previousItem.style.marginBottom = ((marginBottom * -1) + "px");
    //이전 스크롤 위치로
    previousItem.scrollTop = previousScrollTop;

    let newItemRect = newItem.getBoundingClientRect();
    newItem.style.minWidth = (newRect.width + "px");
    newItem.style.minHeight = (newRect.height + "px");
    newItem.style.maxWidth = (newRect.width + "px");
    newItem.style.maxHeight = (newRect.height + "px");
    newItem.style.position = "absolute";
    newItem.style.bottom = "0px";
    newItem.style.marginLeft = (previousItemRect.width + "px");
    //젤 위로 향하게
    marginBottom = (newItemRect.height - previousItemRect.height) - (newItemRect.height - previousItemRect.height);
    (marginBottom < 0) ? marginBottom = 0 : null;
    newItem.style.marginBottom = ((marginBottom * -1) + "px");

    if (isBack == false) {
        function callback() {
            previousItem.style.transition = ("transform " + seconds + "s" + ", opacity " + seconds + "s");
            newItem.style.transition = ("transform " + seconds + "s" + ", opacity " + seconds + "s");
            previousItem.style.transform = "translateX(-100%)";
            previousItem.style.opacity = 0;
            newItem.style.transform = "translateX(-" + (previousItemRect.width) + "px)"; //-100%
            newItem.style.opacity = 1;
        }
        window.requestAnimationFrame(callback);
    } else {
        previousItem.style.transform = "translateX(0%)"; //0%
        newItem.style.transform = "translateX(-" + (newItemRect.width + previousItemRect.width) + "px)"; //-200%
        function callback() {
            previousItem.style.transition = ("transform " + seconds + "s" + ", opacity " + seconds + "s");
            newItem.style.transition = ("transform " + seconds + "s" + ", opacity " + seconds + "s");
            previousItem.style.transform = "translateX(" + (newItemRect.width) + "px)"; //100%
            previousItem.style.opacity = 0;
            newItem.style.transform = "translateX(-" + (previousItemRect.width) + "px)"; //-100%
            newItem.style.opacity = 1;
        }
        window.requestAnimationFrame(callback);
    }

    //width, height가 서서히 바뀜
    settingsItems.style.minWidth = (previousRect.width + "px");
    settingsItems.style.minHeight = (previousRect.height + "px");
    function callbackItems() {
        settingsItems.style.transition = ("min-width " + seconds + "s, min-height " + seconds + "s");
        settingsItems.style.minWidth = (newRect.width + "px");
        settingsItems.style.minHeight = (newRect.height + "px");
    }
    window.requestAnimationFrame(callbackItems);

    //끝
    function callbackEnd() {
        setTimeout(() => {
            previousItem.remove();

            newItem.style.minWidth = null;
            newItem.style.minHeight = null;
            newItem.style.maxWidth = null;
            newItem.style.maxHeight = null;
            newItem.style.transition = null;
            newItem.style.transform = null;
            newItem.style.opacity = null;
            newItem.style.position = null;
            newItem.style.marginLeft = null;
            newItem.style.marginBottom = null;
            newItem.style.bottom = null;
            newItem.style.pointerEvents = null;

            settingsItems.style.minWidth = null;
            settingsItems.style.minHeight = null;
            settingsItems.style.transition = null;
            settingsItems.style.overflow = null;
        }, seconds * 1000);
    }
    window.requestAnimationFrame(callbackEnd);
}

function getVideoPlayerSettingsItemElement(uniqueNumber, type) {
    let box = getVideoPlayerElement(uniqueNumber);
    let videoPlayerInfo = JSON.parse(box.getElementsByClassName("video_player_info")[0].innerHTML);
    let video = box.getElementsByTagName("video")[0];

    let newEl = document.createElement("div");
    newEl.classList.add("video_player_container_settings_item");

    let info = new Array();
    
    //메인 설정
    if (type == "main") {
        let language = videoPlayerInfo["language"];
        let currentResolution = videoPlayerInfo["resolutionInfo"];
        let resolutionMode = videoPlayerInfo["resolutionMode"];

        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 28"><path d="M14 14c0-2.203-1.797-4-4-4s-4 1.797-4 4 1.797 4 4 4 4-1.797 4-4zM26 22c0-1.094-0.906-2-2-2s-2 0.906-2 2c0 1.109 0.906 2 2 2 1.109 0 2-0.906 2-2zM26 6c0-1.094-0.906-2-2-2s-2 0.906-2 2c0 1.109 0.906 2 2 2 1.109 0 2-0.906 2-2zM20 12.578v2.891c0 0.203-0.156 0.438-0.359 0.469l-2.422 0.375c-0.125 0.406-0.297 0.797-0.5 1.188 0.438 0.625 0.906 1.203 1.406 1.797 0.063 0.094 0.109 0.187 0.109 0.313 0 0.109-0.031 0.219-0.109 0.297-0.313 0.422-2.063 2.328-2.516 2.328-0.125 0-0.234-0.047-0.328-0.109l-1.797-1.406c-0.391 0.203-0.781 0.359-1.203 0.484-0.078 0.797-0.156 1.656-0.359 2.422-0.063 0.219-0.25 0.375-0.469 0.375h-2.906c-0.219 0-0.438-0.172-0.469-0.391l-0.359-2.391c-0.406-0.125-0.797-0.297-1.172-0.484l-1.844 1.391c-0.078 0.078-0.203 0.109-0.313 0.109-0.125 0-0.234-0.047-0.328-0.125-0.406-0.375-2.25-2.047-2.25-2.5 0-0.109 0.047-0.203 0.109-0.297 0.453-0.594 0.922-1.172 1.375-1.781-0.219-0.422-0.406-0.844-0.547-1.281l-2.375-0.375c-0.219-0.031-0.375-0.234-0.375-0.453v-2.891c0-0.203 0.156-0.438 0.359-0.469l2.422-0.375c0.125-0.406 0.297-0.797 0.5-1.188-0.438-0.625-0.906-1.203-1.406-1.797-0.063-0.094-0.109-0.203-0.109-0.313s0.031-0.219 0.109-0.313c0.313-0.422 2.063-2.312 2.516-2.312 0.125 0 0.234 0.047 0.328 0.109l1.797 1.406c0.391-0.203 0.781-0.359 1.203-0.5 0.078-0.781 0.156-1.641 0.359-2.406 0.063-0.219 0.25-0.375 0.469-0.375h2.906c0.219 0 0.438 0.172 0.469 0.391l0.359 2.391c0.406 0.125 0.797 0.297 1.172 0.484l1.844-1.391c0.094-0.078 0.203-0.109 0.313-0.109 0.125 0 0.234 0.047 0.328 0.125 0.406 0.375 2.25 2.063 2.25 2.5 0 0.109-0.047 0.203-0.109 0.297-0.453 0.609-0.922 1.172-1.359 1.781 0.203 0.422 0.391 0.844 0.531 1.281l2.375 0.359c0.219 0.047 0.375 0.25 0.375 0.469zM30 20.906v2.188c0 0.234-2.016 0.453-2.328 0.484-0.125 0.297-0.281 0.562-0.469 0.812 0.141 0.313 0.797 1.875 0.797 2.156 0 0.047-0.016 0.078-0.063 0.109-0.187 0.109-1.859 1.109-1.937 1.109-0.203 0-1.375-1.563-1.531-1.797-0.156 0.016-0.313 0.031-0.469 0.031s-0.313-0.016-0.469-0.031c-0.156 0.234-1.328 1.797-1.531 1.797-0.078 0-1.75-1-1.937-1.109-0.047-0.031-0.063-0.078-0.063-0.109 0-0.266 0.656-1.844 0.797-2.156-0.187-0.25-0.344-0.516-0.469-0.812-0.313-0.031-2.328-0.25-2.328-0.484v-2.188c0-0.234 2.016-0.453 2.328-0.484 0.125-0.281 0.281-0.562 0.469-0.812-0.141-0.313-0.797-1.891-0.797-2.156 0-0.031 0.016-0.078 0.063-0.109 0.187-0.094 1.859-1.094 1.937-1.094 0.203 0 1.375 1.547 1.531 1.781 0.156-0.016 0.313-0.031 0.469-0.031s0.313 0.016 0.469 0.031c0.438-0.609 0.906-1.219 1.437-1.75l0.094-0.031c0.078 0 1.75 0.984 1.937 1.094 0.047 0.031 0.063 0.078 0.063 0.109 0 0.281-0.656 1.844-0.797 2.156 0.187 0.25 0.344 0.531 0.469 0.812 0.313 0.031 2.328 0.25 2.328 0.484zM30 4.906v2.187c0 0.234-2.016 0.453-2.328 0.484-0.125 0.297-0.281 0.562-0.469 0.812 0.141 0.313 0.797 1.875 0.797 2.156 0 0.047-0.016 0.078-0.063 0.109-0.187 0.109-1.859 1.109-1.937 1.109-0.203 0-1.375-1.563-1.531-1.797-0.156 0.016-0.313 0.031-0.469 0.031s-0.313-0.016-0.469-0.031c-0.156 0.234-1.328 1.797-1.531 1.797-0.078 0-1.75-1-1.937-1.109-0.047-0.031-0.063-0.078-0.063-0.109 0-0.266 0.656-1.844 0.797-2.156-0.187-0.25-0.344-0.516-0.469-0.812-0.313-0.031-2.328-0.25-2.328-0.484v-2.188c0-0.234 2.016-0.453 2.328-0.484 0.125-0.281 0.281-0.562 0.469-0.812-0.141-0.313-0.797-1.891-0.797-2.156 0-0.031 0.016-0.078 0.063-0.109 0.187-0.094 1.859-1.094 1.937-1.094 0.203 0 1.375 1.547 1.531 1.781 0.156-0.016 0.313-0.031 0.469-0.031s0.313 0.016 0.469 0.031c0.438-0.609 0.906-1.219 1.437-1.75l0.094-0.031c0.078 0 1.75 0.984 1.937 1.094 0.047 0.031 0.063 0.078 0.063 0.109 0 0.281-0.656 1.844-0.797 2.156 0.187 0.25 0.344 0.531 0.469 0.812 0.313 0.031 2.328 0.25 2.328 0.484z"></path></svg>',
            'title': getLanguage("video_player_settings:main:detailed:title"),
            'description': getLanguage("video_player_settings:main:detailed:description"),
            'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'detailed_settings\');'
        }
        info[info.length] = {
            'type': 'line'
        }
        let isToggleContinuousPlay = false;
        if (video.loop == true) {
            isToggleContinuousPlay = true;
        }
        let continuousPlayOnClick = `
            let box = getVideoPlayerElement(` + uniqueNumber + `);
            let video = box.getElementsByTagName('video')[0];

            let isPreviousToggle = this.getAttribute('toggle');
            if (isPreviousToggle == 'true' || isPreviousToggle == true) {
                video.loop = false;
            } else {
                video.loop = true;
            }
        `;
        info[info.length] = {
            'type': 'menu',
            'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-2877,25h-3a24.823,24.823,0,0,1,1.964-9.731,24.916,24.916,0,0,1,5.358-7.947,24.916,24.916,0,0,1,7.947-5.358A24.831,24.831,0,0,1-2855,0a24.84,24.84,0,0,1,9.732,1.965,24.921,24.921,0,0,1,7.946,5.358,24.916,24.916,0,0,1,5.358,7.947c.084.2.167.4.246.6l-2.811,1.066A21.9,21.9,0,0,0-2855,3a22.025,22.025,0,0,0-22,22Z" transform="translate(2880 0)"/><rect width="3" height="15" rx="1.5" transform="translate(47 3)"/><rect width="3" height="15" rx="1.5" transform="translate(35 18) rotate(-90)"/><path d="M-2877,25h-3a24.823,24.823,0,0,1,1.964-9.731,24.916,24.916,0,0,1,5.358-7.947,24.916,24.916,0,0,1,7.947-5.358A24.831,24.831,0,0,1-2855,0a24.84,24.84,0,0,1,9.732,1.965,24.921,24.921,0,0,1,7.946,5.358,24.916,24.916,0,0,1,5.358,7.947c.084.2.167.4.246.6l-2.811,1.066A21.9,21.9,0,0,0-2855,3a22.025,22.025,0,0,0-22,22Z" transform="translate(-2829.999 50.001) rotate(180)"/><rect width="3" height="15" rx="1.5" transform="translate(3 47.001) rotate(180)"/><rect width="3" height="15" rx="1.5" transform="translate(15 32.001) rotate(90)"/></g></svg>',
            'title': getLanguage("video_player_settings:main:continuous_play:title"),
            'description': getLanguage("video_player_settings:main:continuous_play:description"),
            'onclick': continuousPlayOnClick,
            'toggle': isToggleContinuousPlay
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-2735,50a24.844,24.844,0,0,1-9.731-1.965,24.917,24.917,0,0,1-7.947-5.358,24.922,24.922,0,0,1-5.358-7.947A24.845,24.845,0,0,1-2760,25a24.845,24.845,0,0,1,1.965-9.731,24.922,24.922,0,0,1,5.358-7.947,24.917,24.917,0,0,1,7.947-5.358A24.844,24.844,0,0,1-2735,0a24.844,24.844,0,0,1,9.731,1.965,24.917,24.917,0,0,1,7.947,5.358,24.922,24.922,0,0,1,5.358,7.947A24.84,24.84,0,0,1-2710,25a24.84,24.84,0,0,1-1.965,9.731,24.922,24.922,0,0,1-5.358,7.947,24.917,24.917,0,0,1-7.947,5.358A24.844,24.844,0,0,1-2735,50Zm0-47a22.025,22.025,0,0,0-22,22,22.024,22.024,0,0,0,22,22,22.025,22.025,0,0,0,22-22A22.025,22.025,0,0,0-2735,3Z" transform="translate(2760)"/><path d="M9.366,4.828a3,3,0,0,1,5.267,0L21.58,17.563A3,3,0,0,1,18.946,22H5.054A3,3,0,0,1,2.42,17.563Z" transform="translate(39 13) rotate(90)"/></g></svg>',
            'title': getLanguage("video_player_settings:main:auto_play:title"),
            'description': getLanguage("video_player_settings:main:auto_play:description"),
            'toggle': false
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19.753 10.909c-0.624-1.707-2.366-2.726-4.661-2.726-0.090 0-0.176 0.002-0.262 0.006l-0.016-2.063c0 0 3.41-0.588 3.525-0.607s0.133-0.119 0.109-0.231c-0.023-0.111-0.167-0.883-0.188-0.976-0.027-0.131-0.102-0.127-0.207-0.109s-3.25 0.461-3.25 0.461-0.012-1.953-0.013-2.078c-0.001-0.125-0.069-0.158-0.194-0.156s-0.92 0.014-1.025 0.016c-0.105 0.002-0.164 0.049-0.162 0.148s0.033 2.307 0.033 2.307-3.061 0.527-3.144 0.543c-0.084 0.014-0.17 0.053-0.151 0.143s0.19 1.094 0.208 1.172c0.018 0.080 0.072 0.129 0.188 0.107 0.115-0.019 2.924-0.504 2.924-0.504l0.035 2.018c-1.077 0.281-1.801 0.824-2.256 1.303-0.768 0.807-1.207 1.887-1.207 2.963 0 1.586 0.971 2.529 2.328 2.695 3.162 0.387 5.119-3.060 5.769-4.715 1.097 1.506 0.256 4.354-2.094 5.98-0.043 0.029-0.098 0.129-0.033 0.207s0.541 0.662 0.619 0.756c0.080 0.096 0.206 0.059 0.256 0.023 2.51-1.73 3.661-4.515 2.869-6.683zM12.367 14.097c-0.966-0.121-0.944-0.914-0.944-1.453 0-0.773 0.327-1.58 0.876-2.156 0.335-0.354 0.75-0.621 1.229-0.799l0.082 4.277c-0.385 0.131-0.799 0.185-1.243 0.131zM14.794 13.544l0.046-4.109c0.084-0.004 0.166-0.010 0.252-0.010 0.773 0 1.494 0.145 1.885 0.361s-1.023 2.713-2.183 3.758zM5.844 5.876c-0.030-0.094-0.103-0.145-0.196-0.145h-1.95c-0.093 0-0.165 0.051-0.194 0.144-0.412 1.299-3.48 10.99-3.496 11.041s-0.011 0.076 0.062 0.076h1.733c0.075 0 0.099-0.023 0.114-0.072 0.015-0.051 1.008-3.318 1.008-3.318h3.496c0 0 0.992 3.268 1.008 3.318s0.039 0.072 0.113 0.072h1.734c0.072 0 0.078-0.025 0.062-0.076-0.014-0.050-3.083-9.741-3.494-11.040zM3.226 12.194l1.447-5.25 1.447 5.25h-2.894z"></path></svg>',
            'title': getLanguage("video_player_settings:main:language"),
            'value': getLanguage("language:" + language),
            'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'language\');'
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-2594,50h-42a4,4,0,0,1-4-4V4a4,4,0,0,1,4-4h42a4,4,0,0,1,4,4V46A4,4,0,0,1-2594,50Zm-41-47a2,2,0,0,0-2,2V45a2,2,0,0,0,2,2h40a2,2,0,0,0,2-2V5a2,2,0,0,0-2-2Z" transform="translate(2640)"/><path d="M2661.822,19.376s-9.053-4.245-10.22,4.639c0,0-.67,9.813,10.22,5.362v3.949s-10.768,3.31-13.842-3.949,1.707-15.05,9.4-14.782a20.883,20.883,0,0,1,4.447.769Z" transform="translate(-2638.004 0.666)"/><path d="M2661.822,19.376s-9.053-4.245-10.22,4.639c0,0-.67,9.813,10.22,5.362v3.949s-10.768,3.31-13.842-3.949,1.707-15.05,9.4-14.782a20.883,20.883,0,0,1,4.447.769Z" transform="translate(-2620.854 0.666)"/></g></svg>',
            'title': getLanguage("video_player_settings:main:subtitles"),
            'value': getLanguage("video_player_settings:subtitles:disabled"),
            'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'subtitles\');'
        }

        let playbackRate = video.playbackRate;
        (playbackRate == 1) ? playbackRate = getLanguage("video_player_settings:playback_rate:normal") : null;
        info[info.length] = {
            'type': 'menu',
            'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-2975,50a24.84,24.84,0,0,1-9.732-1.965,24.914,24.914,0,0,1-6.365-3.9l2.139-2.138A22.02,22.02,0,0,0-2975,47a22.025,22.025,0,0,0,22-22,22.025,22.025,0,0,0-22-22,22.035,22.035,0,0,0-13.8,4.875l-2.14-2.14a24.912,24.912,0,0,1,6.2-3.771A24.84,24.84,0,0,1-2975,0a24.838,24.838,0,0,1,9.731,1.965,24.915,24.915,0,0,1,7.947,5.358,24.932,24.932,0,0,1,5.358,7.947A24.831,24.831,0,0,1-2950,25a24.831,24.831,0,0,1-1.965,9.731,24.932,24.932,0,0,1-5.358,7.947,24.915,24.915,0,0,1-7.947,5.358A24.838,24.838,0,0,1-2975,50Zm-19.582-9.454h0a24.939,24.939,0,0,1-3.453-5.815,24.8,24.8,0,0,1-1.856-7.377h3.017a21.913,21.913,0,0,0,4.438,11.047l-2.145,2.145Zm-2.259-18.193h-3.021a24.8,24.8,0,0,1,1.827-7.084,24.929,24.929,0,0,1,3.584-5.978l2.143,2.143a21.923,21.923,0,0,0-4.533,10.918Z" transform="translate(3000 0)"/><path d="M18.668,9.8l8.416,5.82q-8.416,5.82-17.1,11.889Z" transform="translate(6.466 10.937)"/></g></svg>',
            'title': getLanguage("video_player_settings:main:playback_rate"),
            'value': playbackRate,
            'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'playback_rate\');'
        }

        let resolutionTitle = "...";
        if (resolutionMode == -1) {
            resolutionTitle = (currentResolution["resolution"] + "p@" + currentResolution["framerate"] + "Hz");
        } else {
            resolutionTitle = getLanguage("video_player_settings:resolutions:" + resolutionMode + ":title");
            resolutionTitle += "<b>(";
            resolutionTitle += (currentResolution["resolution"] + "p@" + currentResolution["framerate"] + "Hz");
            resolutionTitle += ")</b>";
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-3095,50h0a24.838,24.838,0,0,1-9.731-1.965,24.911,24.911,0,0,1-7.946-5.358,24.936,24.936,0,0,1-5.359-7.947A24.855,24.855,0,0,1-3120,25a24.855,24.855,0,0,1,1.965-9.731,24.935,24.935,0,0,1,5.359-7.947,24.91,24.91,0,0,1,7.946-5.358A24.838,24.838,0,0,1-3095,0a24.84,24.84,0,0,1,9.732,1.965,24.916,24.916,0,0,1,7.946,5.358,24.932,24.932,0,0,1,5.358,7.947A24.848,24.848,0,0,1-3070,25h-3a21.853,21.853,0,0,0-6.451-15.55A21.851,21.851,0,0,0-3095,3a22.024,22.024,0,0,0-22,22,22.024,22.024,0,0,0,22,22v3Z" transform="translate(3120 0)"/><path d="M9.366,4.828a3,3,0,0,1,5.267,0L21.58,17.563A3,3,0,0,1,18.946,22H5.054A3,3,0,0,1,2.42,17.563Z" transform="translate(39 13) rotate(90)"/><path d="M-1191.036,18a1.079,1.079,0,0,1-1.077-1.08l-.206-1.928a6.411,6.411,0,0,1-1.592-.951l-1.978.763a1.074,1.074,0,0,1-1.47-.4l-1.076-1.87a1.082,1.082,0,0,1,.394-1.476l1.749-1.281.027-.015a6.607,6.607,0,0,1-.044-.767,6.608,6.608,0,0,1,.044-.767l-.027-.015-1.695-1.375a1.082,1.082,0,0,1-.394-1.475l1.076-1.871a1.075,1.075,0,0,1,1.471-.4l1.926.855a6.407,6.407,0,0,1,1.6-.954l.3-1.923A1.078,1.078,0,0,1-1190.928,0h2.153a1.078,1.078,0,0,1,1.077,1.08l.2,1.882a6.4,6.4,0,0,1,1.67.968l1.9-.735a1.075,1.075,0,0,1,1.47.4l1.076,1.871a1.082,1.082,0,0,1-.394,1.475l-1.676,1.228a6.61,6.61,0,0,1,.053.836,6.623,6.623,0,0,1-.053.841l1.622,1.316a1.083,1.083,0,0,1,.394,1.476l-1.077,1.87a1.074,1.074,0,0,1-1.47.4l-1.856-.824a6.4,6.4,0,0,1-1.678.969l-.295,1.876a1.079,1.079,0,0,1-1.077,1.08Zm-2.045-9a3.238,3.238,0,0,0,3.229,3.24A3.238,3.238,0,0,0-1186.623,9a3.238,3.238,0,0,0-3.229-3.24A3.238,3.238,0,0,0-1193.081,9Z" transform="translate(1230.255 32)"/></g></svg>',
            'title': getLanguage("video_player_settings:main:resolutions"),
            'value': resolutionTitle,
            'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'resolutions\');'
        }
    }

    //세부 설정
    if (type == "detailed_settings") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("video_player_settings:main:detailed:title"),
            'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'main\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.984 11.016l-6.984 3.984v-8.016zM21 17.016v-12h-18v12h18zM21 3q0.844 0 1.43 0.586t0.586 1.43l-0.047 12q0 0.797-0.586 1.383t-1.383 0.586h-5.016v2.016h-7.969v-2.016h-5.016q-0.844 0-1.43-0.563t-0.586-1.406v-12q0-0.844 0.586-1.43t1.43-0.586h18z"></path></svg>',
            'title': getLanguage("video_player_settings:detailed:skip_intro:title"),
            'description': getLanguage("video_player_settings:detailed:skip_intro:description"),
            'toggle': getVideoPlayerSettingsValue("isUseSkipIntro"),
            'onclick': `
                let name = 'isUseSkipIntro';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setVideoPlayerSettingsValue(name, false) : setVideoPlayerSettingsValue(name, true)
            `
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17.115 2.884c-1.676-1.676-3.779-2.288-4.449-1.618l-2.696 2.696c-0.409 0.41-0.766 1.779-0.602 3.164l-8.161 8.161c-0.484 0.484-0.092 1.66 0.876 2.629s2.146 1.359 2.629 0.877l8.161-8.162c1.386 0.164 2.755-0.193 3.164-0.601l2.696-2.697c0.67-0.67 0.058-2.774-1.618-4.449zM8.141 11.039c-0.373-0.372-0.251-1.096 0.269-1.617s1.246-0.643 1.618-0.27c0.372 0.371 0.251 1.097-0.27 1.617-0.521 0.522-1.245 0.643-1.617 0.27zM14.891 5.108c-1.298-1.297-1.623-3.010-1.508-3.125s1.76 0.277 3.059 1.575c1.298 1.298 1.688 2.946 1.575 3.059-0.112 0.112-1.829-0.21-3.126-1.509z"></path></svg>',
            'title': getLanguage("video_player_settings:detailed:dynamic_light_effect:title"),
            'description': getLanguage("video_player_settings:detailed:dynamic_light_effect:description"),
            'toggle': getVideoPlayerSettingsValue("isUseDynamicLightEffect"),
            'onclick': `
                let name = 'isUseDynamicLightEffect';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setVideoPlayerSettingsValue(name, false) : setVideoPlayerSettingsValue(name, true)
            `
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 28"><path d="M6 25v-2c0-0.547-0.453-1-1-1h-2c-0.547 0-1 0.453-1 1v2c0 0.547 0.453 1 1 1h2c0.547 0 1-0.453 1-1zM6 19v-2c0-0.547-0.453-1-1-1h-2c-0.547 0-1 0.453-1 1v2c0 0.547 0.453 1 1 1h2c0.547 0 1-0.453 1-1zM6 13v-2c0-0.547-0.453-1-1-1h-2c-0.547 0-1 0.453-1 1v2c0 0.547 0.453 1 1 1h2c0.547 0 1-0.453 1-1zM22 25v-8c0-0.547-0.453-1-1-1h-12c-0.547 0-1 0.453-1 1v8c0 0.547 0.453 1 1 1h12c0.547 0 1-0.453 1-1zM6 7v-2c0-0.547-0.453-1-1-1h-2c-0.547 0-1 0.453-1 1v2c0 0.547 0.453 1 1 1h2c0.547 0 1-0.453 1-1zM28 25v-2c0-0.547-0.453-1-1-1h-2c-0.547 0-1 0.453-1 1v2c0 0.547 0.453 1 1 1h2c0.547 0 1-0.453 1-1zM22 13v-8c0-0.547-0.453-1-1-1h-12c-0.547 0-1 0.453-1 1v8c0 0.547 0.453 1 1 1h12c0.547 0 1-0.453 1-1zM28 19v-2c0-0.547-0.453-1-1-1h-2c-0.547 0-1 0.453-1 1v2c0 0.547 0.453 1 1 1h2c0.547 0 1-0.453 1-1zM28 13v-2c0-0.547-0.453-1-1-1h-2c-0.547 0-1 0.453-1 1v2c0 0.547 0.453 1 1 1h2c0.547 0 1-0.453 1-1zM28 7v-2c0-0.547-0.453-1-1-1h-2c-0.547 0-1 0.453-1 1v2c0 0.547 0.453 1 1 1h2c0.547 0 1-0.453 1-1zM30 4.5v21c0 1.375-1.125 2.5-2.5 2.5h-25c-1.375 0-2.5-1.125-2.5-2.5v-21c0-1.375 1.125-2.5 2.5-2.5h25c1.375 0 2.5 1.125 2.5 2.5z"></path></svg>',
            'title': getLanguage("video_player_settings:detailed:letterbox_effect:title"),
            'description': getLanguage("video_player_settings:detailed:letterbox_effect:description"),
            'toggle': getVideoPlayerSettingsValue("isUseLetterBoxEffect"),
            'onclick': `
                let name = 'isUseLetterBoxEffect';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setVideoPlayerSettingsValue(name, false) : setVideoPlayerSettingsValue(name, true)
            `
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="6" height="42" rx="3" transform="translate(50 46) rotate(180)"></rect><rect width="6" height="50" rx="3" transform="translate(0 10) rotate(-90)"></rect><rect width="6" height="42" rx="3" transform="translate(0 4)"></rect><rect width="6" height="50" rx="3" transform="translate(0 46) rotate(-90)"></rect><rect width="15" height="12" rx="2" transform="translate(25 24)"></rect></g></svg>',
            'title': getLanguage("video_player_settings:detailed:pip_mode_button:title"),
            'description': getLanguage("video_player_settings:detailed:pip_mode_button:description"),
            'toggle': getVideoPlayerSettingsValue("isUsePipModeButton"),
            'onclick': `
                let name = 'isUsePipModeButton';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setVideoPlayerSettingsValue(name, false) : setVideoPlayerSettingsValue(name, true)
            `
        }
        if (isTouchDevice() == false) {
            info[info.length] = {
                'type': 'menu',
                'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M18 2h-16c-1.1 0-2 0.9-2 2v12c0 1.1 0.9 2 2 2h16c1.1 0 2-0.9 2-2v-12c0-1.1-0.9-2-2-2zM4.5 3.75c0.414 0 0.75 0.336 0.75 0.75s-0.336 0.75-0.75 0.75c-0.414 0-0.75-0.336-0.75-0.75s0.336-0.75 0.75-0.75zM1.75 4.5c0-0.414 0.336-0.75 0.75-0.75s0.75 0.336 0.75 0.75c0 0.414-0.336 0.75-0.75 0.75s-0.75-0.336-0.75-0.75zM18 16h-16v-9h16v9zM18 5h-12v-1h12.019l-0.019 1z"></path></svg>',
                'title': getLanguage("video_player_settings:detailed:change_tab_pip_mode:title"),
                'description': getLanguage("video_player_settings:detailed:change_tab_pip_mode:description"),
                'toggle': getVideoPlayerSettingsValue("isUseChangeTabPipMode"),
                'onclick': `
                    let name = 'isUseChangeTabPipMode';
                    let toggle = this.getAttribute('toggle');
                    (toggle == true || toggle == 'true') ? setVideoPlayerSettingsValue(name, false) : setVideoPlayerSettingsValue(name, true)
                `
            }
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="6" height="18" rx="3"></rect><rect width="6" height="18" rx="3" transform="translate(0 6) rotate(-90)"></rect><rect width="6" height="18" rx="3" transform="translate(0 50) rotate(-90)"></rect><rect width="6" height="18" rx="3" transform="translate(6 50) rotate(-180)"></rect><rect width="6" height="18" rx="3" transform="translate(50 50) rotate(-180)"></rect><rect width="6" height="18" rx="3" transform="translate(50 44) rotate(90)"></rect><rect width="6" height="18" rx="3" transform="translate(50) rotate(90)"></rect><rect width="6" height="18" rx="3" transform="translate(44)"></rect></g></svg>',
            'title': getLanguage("video_player_settings:detailed:full_screen_on_playback:title"),
            'description': getLanguage("video_player_settings:detailed:full_screen_on_playback:description"),
            'toggle': getVideoPlayerSettingsValue("isUseFullScreenOnPlayback"),
            'onclick': `
                let name = 'isUseFullScreenOnPlayback';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setVideoPlayerSettingsValue(name, false) : setVideoPlayerSettingsValue(name, true)
            `
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M17 2c-0.552 0-1 0.448-1 1v4.318l-9-5.318c-0.552 0-1 0.448-1 1v1.954l-5-2.954c-0.552 0-1 0.448-1 1v12c0 0.552 0.448 1 1 1l5-2.955v1.955c0 0.552 0.448 1 1 1l9-5.318v4.318c0 0.552 0.448 1 1 1s1-0.448 1-1v-12c0-0.552-0.448-1-1-1zM6 10.722l-4 2.364v-8.172l4 2.364v3.444zM8 13.086v-8.172l6.915 4.086-6.915 4.086z"></path></svg>',
            'title': getLanguage("video_player_settings:detailed:previous_and_next_button:title"),
            'description': getLanguage("video_player_settings:detailed:previous_and_next_button:description"),
            'toggle': getVideoPlayerSettingsValue("isUsePreviousAndNextButton"),
            'onclick': `
                let name = 'isUsePreviousAndNextButton';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setVideoPlayerSettingsValue(name, false) : setVideoPlayerSettingsValue(name, true)
            `
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.984 9v6q0 0.844-0.586 1.43t-1.383 0.586h-1.031v-2.016h1.031v-6h-16.031v6h6v2.016h-6q-0.797 0-1.383-0.586t-0.586-1.43v-6q0-0.844 0.586-1.43t1.383-0.586h16.031q0.797 0 1.383 0.586t0.586 1.43zM14.484 18.984l1.125-2.391 2.391-1.078-2.391-1.125-1.125-2.391-1.078 2.391-2.391 1.125 2.391 1.078zM17.016 14.016l0.609-1.406 1.359-0.609-1.359-0.609-0.609-1.406-0.656 1.406-1.359 0.609 1.359 0.609zM14.484 18.984l1.125-2.391 2.391-1.078-2.391-1.125-1.125-2.391-1.078 2.391-2.391 1.125 2.391 1.078zM17.016 14.016l0.609-1.406 1.359-0.609-1.359-0.609-0.609-1.406-0.656 1.406-1.359 0.609 1.359 0.609z"></path></svg>',
            'title': getLanguage("video_player_settings:detailed:skip_button:title"),
            'description': getLanguage("video_player_settings:detailed:skip_button:description"),
            'toggle': getVideoPlayerSettingsValue("isUseSkipButton"),
            'onclick': `
                let name = 'isUseSkipButton';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setVideoPlayerSettingsValue(name, false) : setVideoPlayerSettingsValue(name, true)
            `
        }
        info[info.length] = {
            'type': 'line'
        }
        if (isTouchDevice() == false) {
            info[info.length] = {
                'type': 'menu',
                'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M13 1v4h1v-4h-1zM19.403 3.578l-3.109 2.516 0.628 0.778 3.109-2.519c0.003 0-0.628-0.775-0.628-0.775zM21.409 10.313l-3.897-0.9-0.225 0.975 3.897 0.9 0.225-0.975zM5.819 11.287l3.897-0.9-0.225-0.975-3.897 0.9 0.225 0.975zM6.969 4.353l3.109 2.519 0.628-0.778-3.109-2.519-0.628 0.778zM19 13.491c0-0.822-0.666-1.491-1.5-1.491-0.828 0-1.5 0.675-1.5 1.491v4.509h-1v-9.491c0-0.834-0.666-1.509-1.5-1.509-0.828 0-1.5 0.666-1.5 1.509v10.291c-2.059-2.2-4.769-4.619-5.878-3.503-1.087 1.094 1.716 4.106 5.625 10.688 1.766 2.966 3.994 5.016 7.753 5.016 4.141 0 7.5-3.359 7.5-7.5v-7.994c0-0.831-0.666-1.506-1.5-1.506-0.828 0-1.5 0.675-1.5 1.506v2.494h-1v-3.509c0-0.825-0.666-1.491-1.5-1.491-0.828 0-1.5 0.662-1.5 1.491v2.509h-1v-3.509z"></path></svg>',
                'title': getLanguage("video_player_settings:detailed:full_screen_click_delay:title"),
                'description': getLanguage("video_player_settings:detailed:full_screen_click_delay:description"),
                'toggle': getVideoPlayerSettingsValue("isUseFullScreenClickDelay"),
                'onclick': `
                    let name = 'isUseFullScreenClickDelay';
                    let toggle = this.getAttribute('toggle');
                    (toggle == true || toggle == 'true') ? setVideoPlayerSettingsValue(name, false) : setVideoPlayerSettingsValue(name, true)
                `
            }
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15 2.016q-2.016 0-3.68 1.031t-2.555 2.719q-1.969 1.078-3 3-1.688 0.891-2.719 2.555t-1.031 3.68q0 1.453 0.539 2.719t1.5 2.227 2.227 1.5 2.719 0.539q2.016 0 3.68-1.031t2.555-2.719q1.969-1.078 3-3 1.688-0.891 2.719-2.555t1.031-3.68q0-1.453-0.539-2.719t-1.5-2.227-2.227-1.5-2.719-0.539zM9 20.016q-1.359 0-2.508-0.68t-1.828-1.828-0.68-2.508q0-0.844 0.281-1.617t0.75-1.383q0 1.453 0.539 2.719t1.5 2.227 2.227 1.5 2.719 0.539q-0.609 0.469-1.383 0.75t-1.617 0.281zM12 17.016q-1.359 0-2.508-0.68t-1.828-1.828-0.68-2.508q0-0.844 0.281-1.617t0.75-1.383q0 1.453 0.539 2.719t1.5 2.227 2.227 1.5 2.719 0.539q-0.609 0.469-1.383 0.75t-1.617 0.281zM16.688 13.688q-0.844 0.328-1.688 0.328-1.359 0-2.508-0.68t-1.828-1.828-0.68-2.508q0-0.844 0.328-1.688 0.844-0.328 1.688-0.328 1.359 0 2.508 0.68t1.828 1.828 0.68 2.508q0 0.844-0.328 1.688zM18.984 12q0-1.453-0.539-2.719t-1.5-2.227-2.227-1.5-2.719-0.539q0.609-0.469 1.383-0.75t1.617-0.281q1.359 0 2.508 0.68t1.828 1.828 0.68 2.508q0 0.844-0.281 1.617t-0.75 1.383z"></path></svg>',
            'title': getLanguage("video_player_settings:detailed:click_and_hotkey_effects:title"),
            'description': getLanguage("video_player_settings:detailed:click_and_hotkey_effects:description"),
            'toggle': getVideoPlayerSettingsValue("isUseClickAndHotKeyEffects"),
            'onclick': `
                let name = 'isUseClickAndHotKeyEffects';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setVideoPlayerSettingsValue(name, false) : setVideoPlayerSettingsValue(name, true)
            `
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M15.6 4.576c0-2.139 0-2.348 0-2.348 0-0.789-2.508-2.228-5.6-2.228-3.093 0-5.6 1.439-5.6 2.228 0 0 0 0.209 0 2.348 0 2.141 3.877 3.908 3.877 5.424 0 1.514-3.877 3.281-3.877 5.422s0 2.35 0 2.35c0 0.788 2.507 2.228 5.6 2.228 3.092 0 5.6-1.44 5.6-2.229 0 0 0-0.209 0-2.35s-3.877-3.908-3.877-5.422c0-1.515 3.877-3.282 3.877-5.423zM5.941 2.328c0.696-0.439 2-1.082 4.114-1.082s4.006 1.082 4.006 1.082c0.142 0.086 0.698 0.383 0.317 0.609-0.838 0.497-2.478 1.020-4.378 1.020s-3.484-0.576-4.324-1.074c-0.381-0.225 0.265-0.555 0.265-0.555zM10.501 10c0 1.193 0.996 1.961 2.051 2.986 0.771 0.748 1.826 1.773 1.826 2.435v1.328c-0.97-0.483-3.872-0.955-3.872-2.504 0-0.783-1.013-0.783-1.013 0 0 1.549-2.902 2.021-3.872 2.504v-1.328c0-0.662 1.056-1.688 1.826-2.435 1.055-1.025 2.051-1.793 2.051-2.986s-0.996-1.961-2.051-2.986c-0.771-0.75-1.826-1.775-1.826-2.438l-0.046-0.998c1.026 0.553 2.652 1.078 4.425 1.078 1.772 0 3.406-0.525 4.433-1.078l-0.055 0.998c0 0.662-1.056 1.688-1.826 2.438-1.054 1.025-2.051 1.793-2.051 2.986z"></path></svg>',
            'title': getLanguage("video_player_settings:detailed:loading_feedback:title"),
            'description': getLanguage("video_player_settings:detailed:loading_feedback:description"),
            'toggle': getVideoPlayerSettingsValue("isUseLoadingFeedback"),
            'onclick': `
                let name = 'isUseLoadingFeedback';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setVideoPlayerSettingsValue(name, false) : setVideoPlayerSettingsValue(name, true)
            `
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 15.609l-1.406 1.406-5.016-5.016 5.016-5.016 1.406 1.406-3.563 3.609zM3 6h12.984v2.016h-12.984v-2.016zM3 12.984v-1.969h9.984v1.969h-9.984zM3 18v-2.016h12.984v2.016h-12.984z"></path></svg>',
            'title': getLanguage("video_player_settings:detailed:context_menu:title"),
            'description': getLanguage("video_player_settings:detailed:context_menu:description"),
            'toggle': getVideoPlayerSettingsValue("isUseContextMenu"),
            'onclick': `
                let name = 'isUseContextMenu';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setVideoPlayerSettingsValue(name, false) : setVideoPlayerSettingsValue(name, true)
            `
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 6.038v-2.038h4v-2c0-1.105-0.895-2-2-2h-6c-1.105 0-2 0.895-2 2v2h4v2.038c-6.712 0.511-12 6.119-12 12.962 0 7.18 5.82 13 13 13s13-5.82 13-13c0-6.843-5.288-12.451-12-12.962zM22.071 26.071c-1.889 1.889-4.4 2.929-7.071 2.929s-5.182-1.040-7.071-2.929c-1.889-1.889-2.929-4.4-2.929-7.071s1.040-5.182 2.929-7.071c1.814-1.814 4.201-2.844 6.754-2.923l-0.677 9.813c-0.058 0.822 0.389 1.181 0.995 1.181s1.053-0.36 0.995-1.181l-0.677-9.813c2.552 0.079 4.94 1.11 6.754 2.923 1.889 1.889 2.929 4.4 2.929 7.071s-1.040 5.182-2.929 7.071z"></path></svg>',
            'title': getLanguage("video_player_settings:detailed:progress_bar_hidden_time"),
            'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'progress_bar_hidden_time\');',
            'value': getTimeText(getVideoPlayerSettingsValue("progressBarHiddenTime"))
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.81 4.36l-1.77 1.78c-0.311-0.087-0.668-0.137-1.037-0.137-2.209 0-4 1.791-4 4 0 0.369 0.050 0.726 0.143 1.065l-0.007-0.028-2.76 2.75c-1.32-1-2.42-2.3-3.18-3.79 1.86-3.591 5.548-6.003 9.799-6.003 0.996 0 1.96 0.132 2.878 0.38l-0.077-0.018zM16.61 6.21c1.33 1 2.43 2.3 3.2 3.79-1.859 3.594-5.549 6.007-9.802 6.007-1.002 0-1.973-0.134-2.895-0.385l0.077 0.018 1.77-1.78c0.311 0.087 0.668 0.137 1.037 0.137 2.209 0 4-1.791 4-4 0-0.369-0.050-0.726-0.143-1.065l0.007 0.028 2.76-2.75zM16.36 2.22l1.42 1.42-14.14 14.14-1.42-1.42 14.14-14.14z"></path></svg>',
            'title': getLanguage("video_player_settings:detailed:hide_progress_bar:title"),
            'description': getLanguage("video_player_settings:detailed:hide_progress_bar:description"),
            'toggle': getVideoPlayerSettingsValue("isUseHideProgressBar"),
            'onclick': `
                let name = 'isUseHideProgressBar';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setVideoPlayerSettingsValue(name, false) : setVideoPlayerSettingsValue(name, true)
            `
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.047 10.266q0.938-0.938 0.938-2.25 0-1.641-1.172-2.836t-2.813-1.195-2.813 1.195-1.172 2.836h1.969q0-0.797 0.609-1.406t1.406-0.609 1.406 0.609 0.609 1.406-0.609 1.406l-1.219 1.266q-1.172 1.266-1.172 2.813v0.516h1.969q0-1.594 1.172-2.859zM12.984 18v-2.016h-1.969v2.016h1.969zM18.984 2.016q0.797 0 1.406 0.586t0.609 1.383v14.016q0 0.797-0.609 1.406t-1.406 0.609h-3.984l-3 3-3-3h-3.984q-0.844 0-1.43-0.586t-0.586-1.43v-14.016q0-0.844 0.586-1.406t1.43-0.563h13.969z"></path></svg>',
            'title': getLanguage("video_player_settings:detailed:preview:title"),
            'description': getLanguage("video_player_settings:detailed:preview:description"),
            'toggle': getVideoPlayerSettingsValue("isUsePreview"),
            'onclick': `
                let name = 'isUsePreview';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setVideoPlayerSettingsValue(name, false) : setVideoPlayerSettingsValue(name, true)
            `
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16.689 17.655l5.311 12.345-4 2-4.646-12.678-7.354 6.678v-26l20 16-9.311 1.655z"></path></svg>',
            'title': getLanguage("video_player_settings:detailed:detailed_preview:title"),
            'description': getLanguage("video_player_settings:detailed:detailed_preview:description"),
            'toggle': getVideoPlayerSettingsValue("isUseDetailedPreview"),
            'onclick': `
                let name = 'isUseDetailedPreview';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setVideoPlayerSettingsValue(name, false) : setVideoPlayerSettingsValue(name, true)
            `
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><path d="M16.5 13c0 0.547 0.453 1 1 1s1-0.453 1-1c0-3.031-2.469-5.5-5.5-5.5s-5.5 2.469-5.5 5.5c0 0.547 0.453 1 1 1s1-0.453 1-1c0-1.937 1.578-3.5 3.5-3.5s3.5 1.563 3.5 3.5zM13.047 4c-4.969 0-9 4.031-9 9 0 0.547 0.453 1 1 1s1-0.453 1-1c0-3.859 3.141-7 7-7s7 3.141 7 7c0 1.844-0.828 2.797-1.797 3.906-1.047 1.203-2.25 2.578-2.25 5.094 0 2.203-1.797 4-4 4-0.547 0-1 0.453-1 1s0.453 1 1 1c3.313 0 6-2.688 6-6 0-1.766 0.781-2.656 1.766-3.781 1.062-1.234 2.281-2.625 2.281-5.219 0-4.969-4.031-9-9-9zM9.234 15.234l3.531 3.531-9.047 9.047c-0.25 0.25-0.656 0.25-0.906 0l-2.625-2.625c-0.25-0.25-0.25-0.656 0-0.906zM25.188 0.187l2.625 2.625c0.25 0.25 0.25 0.656 0 0.922l-3.641 3.641-0.406 0.391-1.109 1.109c-0.672-1.563-1.703-2.938-3.047-4.031l4.656-4.656c0.266-0.25 0.672-0.25 0.922 0z"></path></svg>',
            'title': getLanguage("video_player_settings:detailed:deaf_subtitles:title"),
            'description': getLanguage("video_player_settings:detailed:deaf_subtitles:description"),
            'toggle': getVideoPlayerSettingsValue("isUseDeafSubtitles"),
            'onclick': `
                let name = 'isUseDeafSubtitles';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setVideoPlayerSettingsValue(name, false) : setVideoPlayerSettingsValue(name, true)
            `
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.016 21.984l19.969-19.969v6h-3.984v13.969h-15.984zM20.016 21.984v-1.969h1.969v1.969h-1.969zM20.016 18v-8.016h1.969v8.016h-1.969z"></path></svg>',
            'title': getLanguage("video_player_settings:detailed:limited_resolution:title"),
            'description': getLanguage("video_player_settings:detailed:limited_resolution:description"),
            'toggle': getVideoPlayerSettingsValue("isUseLimitedResolution"),
            'onclick': `
                let name = 'isUseLimitedResolution';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setVideoPlayerSettingsValue(name, false) : setVideoPlayerSettingsValue(name, true)
            `
        }
        if (isTouchDevice() == false) {
            info[info.length] = {
                'type': 'menu',
                'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M13 3c0-1.657 1.343-3 3-3s3 1.343 3 3c0 1.657-1.343 3-3 3s-3-1.343-3-3z"></path><path d="M20 10l10.3-4.443-0.743-1.857-12.557 4.3h-2l-12.557-4.3-0.743 1.857 10.3 4.443v8l-4.102 13.268 1.87 0.709 5.804-12.977h0.857l5.804 12.977 1.87-0.709-4.102-13.268z"></path></svg>',
                'title': getLanguage("video_player_settings:detailed:accessibility_player:title"),
                'description': getLanguage("video_player_settings:detailed:accessibility_player:description"),
                'toggle': getVideoPlayerSettingsValue("isUseAccessibility"),
                'onclick': `
                    let name = 'isUseAccessibility';
                    let toggle = this.getAttribute('toggle');
                    (toggle == true || toggle == 'true') ? setVideoPlayerSettingsValue(name, false) : setVideoPlayerSettingsValue(name, true)
                `
            }
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19 13.805c0 0.657-0.538 1.195-1.195 1.195h-16.272c-0.88 0-0.982-0.371-0.229-0.822l16.323-9.055c0.755-0.453 1.373-0.104 1.373 0.777v7.905z"></path></svg>',
            'title': getLanguage("video_player_settings:detailed:loudness_normalizer:title"),
            'description': getLanguage("video_player_settings:detailed:loudness_normalizer:description"),
            'toggle': getVideoPlayerSettingsValue("isUseLoudnessNormalizer"),
            'onclick': `
                let name = 'isUseLoudnessNormalizer';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setVideoPlayerSettingsValue(name, false) : setVideoPlayerSettingsValue(name, true)
            `
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0q4.688 0 8.133 3.164t3.82 7.805h-1.5q-0.234-2.766-1.852-5.016t-4.102-3.422l-1.359 1.313-3.797-3.797zM16.547 11.813q0-2.672-2.203-2.672h-0.938v5.766h0.891q1.688 0 2.156-1.594 0.094-0.328 0.094-1.125v-0.375zM14.344 8.016q2.484 0 3.375 2.203 0.234 0.563 0.234 1.594v0.375q0 1.781-0.984 2.766-1.031 1.031-2.672 1.031h-2.297v-7.969h2.344zM9.703 11.906q1.313 0.516 1.313 1.828 0 0.469-0.234 0.938-0.281 0.563-0.516 0.75-0.703 0.563-1.875 0.563-1.125 0-1.828-0.563t-0.703-1.641h1.266q0 0.516 0.352 0.844t0.914 0.328q1.313 0 1.313-1.266t-1.453-1.266h-0.75v-1.031h0.75q1.359 0 1.359-1.172t-1.219-1.172q-1.172 0-1.172 1.078h-1.313q0-0.797 0.703-1.5 0.75-0.609 1.781-0.609 1.125 0 1.805 0.563t0.68 1.641q0 1.172-1.172 1.688zM7.5 21.469l1.359-1.313 3.797 3.797-0.656 0.047q-4.688 0-8.133-3.188t-3.82-7.828h1.5q0.234 2.484 1.969 4.969t3.984 3.516z"></path></svg>',
            'title': getLanguage("video_player_settings:detailed:head_related_transfer_function:title"),
            'description': getLanguage("video_player_settings:detailed:head_related_transfer_function:description"),
            'toggle': getVideoPlayerSettingsValue("isUseHeadRelatedTransferFunction"),
            'onclick': `
                let name = 'isUseHeadRelatedTransferFunction';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setVideoPlayerSettingsValue(name, false) : setVideoPlayerSettingsValue(name, true)
            `
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM13 16v-5.586l2.293 2.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-4-4c-0.096-0.096-0.206-0.168-0.324-0.217-0.122-0.051-0.253-0.076-0.383-0.076-0.256 0-0.512 0.098-0.707 0.293l-4 4c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l2.293-2.293v5.586c0 0.552 0.448 1 1 1s1-0.448 1-1z"></path></svg>',
            'title': getLanguage("video_player_settings:detailed:scroll_reset:title"),
            'description': getLanguage("video_player_settings:detailed:scroll_reset:description"),
            'toggle': getVideoPlayerSettingsValue("isUseScrollReset"),
            'onclick': `
                let name = 'isUseScrollReset';
                let toggle = this.getAttribute('toggle');
                (toggle == true || toggle == 'true') ? setVideoPlayerSettingsValue(name, false) : setVideoPlayerSettingsValue(name, true)
            `
        }
        info[info.length] = {
            'type': 'line'
        }
        if (window.AudioContext != null) {
            let audioBooster = getVideoPlayerSettingsValue("audioBooster");
            let value = getLanguage("video_player_settings:audio_booster:" + audioBooster);
            info[info.length] = {
                'type': 'menu',
                'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20c-5.523 0-10-4.477-10-10s4.477-10 10-10v0c5.523 0 10 4.477 10 10s-4.477 10-10 10v0zM4.4 15.71c1.568-1.080 3.509-1.725 5.6-1.725s4.032 0.645 5.634 1.747l-0.034-0.022c1.482-1.453 2.4-3.476 2.4-5.713 0-4.418-3.582-8-8-8s-8 3.582-8 8c0 2.237 0.918 4.26 2.399 5.712l0.001 0.001zM10.52 8.070l3.020-3.020 1.41 1.41-3.020 3.020c0.044 0.156 0.069 0.336 0.069 0.521 0 1.105-0.895 2-2 2s-2-0.895-2-2c0-1.105 0.895-2 2-2 0.185 0 0.365 0.025 0.535 0.072l-0.014-0.003z"></path></svg>',
                'title': getLanguage("video_player_settings:detailed:audio_booster:title"),
                'description': getLanguage("video_player_settings:detailed:audio_booster:description"),
                'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'audio_booster\');',
                'value': value
            }
        }
        let isZoomSupported = CSS.supports("zoom", 1);
        if (isZoomSupported == true) {
            let fullScreenBalancing = getVideoPlayerSettingsValue("fullScreenBalancing");
            let value = "...";
            if (fullScreenBalancing >= 0) {
                value = getLanguage("video_player_settings:full_screen_balancing:" + getVideoPlayerSettingsValue("fullScreenBalancing"));
            } else {
                value = getLanguage("video_player_settings:full_screen_balancing:" + getVideoPlayerSettingsValue("fullScreenBalancing") + ":title");
            }
            info[info.length] = {
                'type': 'menu',
                'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 28"><path d="M27 7l-6 11h12zM7 7l-6 11h12zM19.828 4c-0.297 0.844-0.984 1.531-1.828 1.828v20.172h9.5c0.281 0 0.5 0.219 0.5 0.5v1c0 0.281-0.219 0.5-0.5 0.5h-21c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h9.5v-20.172c-0.844-0.297-1.531-0.984-1.828-1.828h-7.672c-0.281 0-0.5-0.219-0.5-0.5v-1c0-0.281 0.219-0.5 0.5-0.5h7.672c0.422-1.172 1.516-2 2.828-2s2.406 0.828 2.828 2h7.672c0.281 0 0.5 0.219 0.5 0.5v1c0 0.281-0.219 0.5-0.5 0.5h-7.672zM17 4.25c0.688 0 1.25-0.562 1.25-1.25s-0.562-1.25-1.25-1.25-1.25 0.562-1.25 1.25 0.562 1.25 1.25 1.25zM34 18c0 3.219-4.453 4.5-7 4.5s-7-1.281-7-4.5v0c0-0.609 5.453-10.266 6.125-11.484 0.172-0.313 0.516-0.516 0.875-0.516s0.703 0.203 0.875 0.516c0.672 1.219 6.125 10.875 6.125 11.484v0zM14 18c0 3.219-4.453 4.5-7 4.5s-7-1.281-7-4.5v0c0-0.609 5.453-10.266 6.125-11.484 0.172-0.313 0.516-0.516 0.875-0.516s0.703 0.203 0.875 0.516c0.672 1.219 6.125 10.875 6.125 11.484z"></path></svg>',
                'title': getLanguage("video_player_settings:detailed:full_screen_balancing:title"),
                'description': getLanguage("video_player_settings:detailed:full_screen_balancing:description"),
                'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'full_screen_balancing\');',
                'value': value
            }
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 8.016v7.969h-12v-7.969h12zM6.984 18v2.016h-3q-0.797 0-1.383-0.609t-0.586-1.406v-2.016h1.969v2.016h3zM20.016 15.984h1.969v2.016q0 0.797-0.586 1.406t-1.383 0.609h-3v-2.016h3v-2.016zM3.984 8.016h-1.969v-2.016q0-0.797 0.586-1.406t1.383-0.609h3v2.016h-3v2.016zM17.016 3.984h3q0.797 0 1.383 0.609t0.586 1.406v2.016h-1.969v-2.016h-3v-2.016z"></path></svg>',
            'title': getLanguage("video_player_settings:detailed:object_fit:title"),
            'description': getLanguage("video_player_settings:detailed:object_fit:description"),
            'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'object_fit\');',
            'value': getLanguage("video_player_settings:object_fit:" + getVideoPlayerSettingsValue("objectFit") + ":title")
        }
        let aspectRatio = getVideoPlayerSettingsValue("aspectRatio");
        let aspectRatioValue = "...";
        if (aspectRatio >= 0) {
            aspectRatioValue = getLanguage("video_player_settings:aspect_ratio:" + aspectRatio);
        } else {
            aspectRatioValue = getLanguage("video_player_settings:aspect_ratio:" + aspectRatio + ":title");
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.016 18v-12h-16.031v12h16.031zM20.016 3.984q0.797 0 1.383 0.609t0.586 1.406v12q0 0.797-0.586 1.406t-1.383 0.609h-16.031q-0.797 0-1.383-0.609t-0.586-1.406v-12q0-0.797 0.586-1.406t1.383-0.609h16.031zM12 9.984v2.016h-2.016v-2.016h2.016zM8.016 9.984v2.016h-2.016v-2.016h2.016zM15.984 14.016v1.969h-1.969v-1.969h1.969zM15.984 9.984v2.016h-1.969v-2.016h1.969z"></path></svg>',
            'title': getLanguage("video_player_settings:detailed:aspect_ratio:title"),
            'description': getLanguage("video_player_settings:detailed:aspect_ratio:description"),
            'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'aspect_ratio\');',
            'value': aspectRatioValue
        }
        let videoCodecValue = getVideoPlayerSettingsValue("videoCodec").toUpperCase();
        if (videoCodecValue == "AUTO") {
            videoCodecValue = getLanguage("video_player_settings:video_codec:auto:title");
        } else if (videoCodecValue == "PERFORMANCE") {
            videoCodecValue = getLanguage("video_player_settings:video_codec:performance:title");
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.707 18.707l6-6c0.391-0.391 0.391-1.024 0-1.414l-6-6c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0zM7.293 5.293l-6 6c-0.391 0.391-0.391 1.024 0 1.414l6 6c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>',
            'title': getLanguage("video_player_settings:detailed:video_codec:title"),
            'description': getLanguage("video_player_settings:detailed:video_codec:description"),
            'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'preferred_codec\');',
            'value': videoCodecValue
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 9.984q0.797 0 1.406 0.609t0.609 1.406h-0.047v5.016q0 0.797-0.586 1.383t-1.383 0.586h-5.016v2.016h-7.969v-2.016h-5.016q-0.797 0-1.406-0.586t-0.609-1.383v-12q0-0.797 0.609-1.406t1.406-0.609h18q0.797 0 1.406 0.609t0.609 1.406v3h-2.016v-3h-18v12h18v-5.016h-8.016v3l-3.984-3.984 3.984-4.031v3h8.016z"></path></svg>',
            'title': getLanguage("video_player_settings:detailed:reset_settings:title"),
            'description': getLanguage("video_player_settings:detailed:reset_settings:description"),
            'onclick': 'resetVideoPlayerSettings(); videoPlayerMoveSettings(' + uniqueNumber + ', \'main\', true);'
        }
    }

    //컨테이너 가로 세로 비율
    if (type == "aspect_ratio") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("video_player_settings:detailed:aspect_ratio:title"),
            'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'detailed_settings\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:aspect_ratio:-2:title"),
            'description': getLanguage("video_player_settings:aspect_ratio:-2:description"),
            'onclick': 'setVideoPlayerSettingsValue(\'aspectRatio\', -2);',
            'checked': isVideoPlayerSettingsValue("aspectRatio", -2)
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:aspect_ratio:-1:title"),
            'description': getLanguage("video_player_settings:aspect_ratio:-1:description"),
            'onclick': 'setVideoPlayerSettingsValue(\'aspectRatio\', -1);',
            'checked': isVideoPlayerSettingsValue("aspectRatio", -1)
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:aspect_ratio:0"),
            'onclick': 'setVideoPlayerSettingsValue(\'aspectRatio\', 0);',
            'checked': isVideoPlayerSettingsValue("aspectRatio", 0)
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:aspect_ratio:1"),
            'onclick': 'setVideoPlayerSettingsValue(\'aspectRatio\', 1);',
            'checked': isVideoPlayerSettingsValue("aspectRatio", 1)
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:aspect_ratio:2"),
            'onclick': 'setVideoPlayerSettingsValue(\'aspectRatio\', 2);',
            'checked': isVideoPlayerSettingsValue("aspectRatio", 2)
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:aspect_ratio:3"),
            'onclick': 'setVideoPlayerSettingsValue(\'aspectRatio\', 3);',
            'checked': isVideoPlayerSettingsValue("aspectRatio", 3)
        }
    }

    //콘텐츠 자리 맞춤 방식
    if (type == "object_fit") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("video_player_settings:detailed:object_fit:title"),
            'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'detailed_settings\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:object_fit:contain:title"),
            'description': getLanguage("video_player_settings:object_fit:contain:description"),
            'onclick': 'setVideoPlayerSettingsValue(\'objectFit\', \'contain\');',
            'checked': isVideoPlayerSettingsValue("objectFit", "contain")
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:object_fit:fill:title"),
            'description': getLanguage("video_player_settings:object_fit:fill:description"),
            'onclick': 'setVideoPlayerSettingsValue(\'objectFit\', \'fill\');',
            'checked': isVideoPlayerSettingsValue("objectFit", "fill")
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:object_fit:cover:title"),
            'description': getLanguage("video_player_settings:object_fit:cover:description"),
            'onclick': 'setVideoPlayerSettingsValue(\'objectFit\', \'cover\');',
            'checked': isVideoPlayerSettingsValue("objectFit", "cover")
        }
    }

    //오디오 부스터
    if (type == "audio_booster") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("video_player_settings:detailed:audio_booster:title"),
            'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'detailed_settings\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:audio_booster:0"),
            'onclick': 'setVideoPlayerSettingsValue(\'audioBooster\', 0);',
            'checked': isVideoPlayerSettingsValue("audioBooster", 0)
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:audio_booster:1"),
            'onclick': 'setVideoPlayerSettingsValue(\'audioBooster\', 1);',
            'checked': isVideoPlayerSettingsValue("audioBooster", 1)
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:audio_booster:2"),
            'onclick': 'setVideoPlayerSettingsValue(\'audioBooster\', 2);',
            'checked': isVideoPlayerSettingsValue("audioBooster", 2)
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:audio_booster:3"),
            'onclick': 'setVideoPlayerSettingsValue(\'audioBooster\', 3);',
            'checked': isVideoPlayerSettingsValue("audioBooster", 3)
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:audio_booster:4"),
            'onclick': 'setVideoPlayerSettingsValue(\'audioBooster\', 4);',
            'checked': isVideoPlayerSettingsValue("audioBooster", 4)
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:audio_booster:5"),
            'onclick': 'setVideoPlayerSettingsValue(\'audioBooster\', 5);',
            'checked': isVideoPlayerSettingsValue("audioBooster", 5)
        }
    }

    //우선적으로 사용할 코덱
    if (type == "preferred_codec") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("video_player_settings:detailed:video_codec:title"),
            'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'detailed_settings\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:video_codec:auto:title"),
            'description': getLanguage("video_player_settings:video_codec:auto:description"),
            'onclick': 'setVideoPlayerSettingsValue(\'videoCodec\', \'auto\');',
            'checked': isVideoPlayerSettingsValue("videoCodec", "auto")
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:video_codec:performance:title"),
            'description': getLanguage("video_player_settings:video_codec:performance:description"),
            'onclick': 'setVideoPlayerSettingsValue(\'videoCodec\', \'performance\');',
            'checked': isVideoPlayerSettingsValue("videoCodec", "performance")
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'value',
            'title': 'AVC1(H264)',
            'description': getLanguage("video_player_settings:video_codec:avc1"),
            'onclick': 'setVideoPlayerSettingsValue(\'videoCodec\', \'avc1\');',
            'checked': isVideoPlayerSettingsValue("videoCodec", "avc1"),
            'disabled': ((supportsVideoType("avc1") == false) ? true : false)
        }
        info[info.length] = {
            'type': 'value',
            'title': 'VP09',
            'description': getLanguage("video_player_settings:video_codec:vp09"),
            'onclick': 'setVideoPlayerSettingsValue(\'videoCodec\', \'vp09\');',
            'checked': isVideoPlayerSettingsValue("videoCodec", "vp09"),
            'disabled': ((supportsVideoType("vp09") == false) ? true : false)
        }
        info[info.length] = {
            'type': 'value',
            'title': 'AV01',
            'onclick': 'setVideoPlayerSettingsValue(\'videoCodec\', \'av01\');',
            'description': getLanguage("video_player_settings:video_codec:av01"),
            'checked': isVideoPlayerSettingsValue("videoCodec", "av01"),
            'disabled': ((supportsVideoType("av01") == false) ? true : false)
        }
    }

    //전체 화면에서의 인터페이스 크기 조절
    if (type == "full_screen_balancing") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("video_player_settings:detailed:full_screen_balancing:title"),
            'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'detailed_settings\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:full_screen_balancing:-2:title"),
            'description': getLanguage("video_player_settings:full_screen_balancing:-2:description"),
            'onclick': 'setVideoPlayerSettingsValue(\'fullScreenBalancing\', -2); checkVideoPlayerFullscreenInterface(' + uniqueNumber + ', ((document.fullscreenElement != null) ? true : false));',
            'checked': isVideoPlayerSettingsValue("fullScreenBalancing", -2)
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:full_screen_balancing:-1:title"),
            'description': getLanguage("video_player_settings:full_screen_balancing:-1:description"),
            'onclick': 'setVideoPlayerSettingsValue(\'fullScreenBalancing\', -1); checkVideoPlayerFullscreenInterface(' + uniqueNumber + ', ((document.fullscreenElement != null) ? true : false));',
            'checked': isVideoPlayerSettingsValue("fullScreenBalancing", -1)
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:full_screen_balancing:0"),
            'onclick': 'setVideoPlayerSettingsValue(\'fullScreenBalancing\', 0); checkVideoPlayerFullscreenInterface(' + uniqueNumber + ', ((document.fullscreenElement != null) ? true : false));',
            'checked': isVideoPlayerSettingsValue("fullScreenBalancing", 0)
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:full_screen_balancing:1"),
            'onclick': 'setVideoPlayerSettingsValue(\'fullScreenBalancing\', 1); checkVideoPlayerFullscreenInterface(' + uniqueNumber + ', ((document.fullscreenElement != null) ? true : false));',
            'checked': isVideoPlayerSettingsValue("fullScreenBalancing", 1)
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:full_screen_balancing:2"),
            'onclick': 'setVideoPlayerSettingsValue(\'fullScreenBalancing\', 2); checkVideoPlayerFullscreenInterface(' + uniqueNumber + ', ((document.fullscreenElement != null) ? true : false));',
            'checked': isVideoPlayerSettingsValue("fullScreenBalancing", 2)
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:full_screen_balancing:3"),
            'onclick': 'setVideoPlayerSettingsValue(\'fullScreenBalancing\', 3); checkVideoPlayerFullscreenInterface(' + uniqueNumber + ', ((document.fullscreenElement != null) ? true : false));',
            'checked': isVideoPlayerSettingsValue("fullScreenBalancing", 3)
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:full_screen_balancing:4"),
            'onclick': 'setVideoPlayerSettingsValue(\'fullScreenBalancing\', 4); checkVideoPlayerFullscreenInterface(' + uniqueNumber + ', ((document.fullscreenElement != null) ? true : false));',
            'checked': isVideoPlayerSettingsValue("fullScreenBalancing", 4)
        }
    }

    //탐색바 숨기기 시간
    if (type == "progress_bar_hidden_time") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("video_player_settings:detailed:progress_bar_hidden_time"),
            'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'detailed_settings\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'value',
            'title': getTimeText(1),
            'onclick': 'setVideoPlayerSettingsValue(\'progressBarHiddenTime\', 1);',
            'checked': isVideoPlayerSettingsValue("progressBarHiddenTime", 1)
        }
        info[info.length] = {
            'type': 'value',
            'title': getTimeText(2),
            'onclick': 'setVideoPlayerSettingsValue(\'progressBarHiddenTime\', 2);',
            'checked': isVideoPlayerSettingsValue("progressBarHiddenTime", 2)
        }
        info[info.length] = {
            'type': 'value',
            'title': getTimeText(3),
            'onclick': 'setVideoPlayerSettingsValue(\'progressBarHiddenTime\', 3);',
            'checked': isVideoPlayerSettingsValue("progressBarHiddenTime", 3)
        }
        info[info.length] = {
            'type': 'value',
            'title': getTimeText(4),
            'onclick': 'setVideoPlayerSettingsValue(\'progressBarHiddenTime\', 4);',
            'checked': isVideoPlayerSettingsValue("progressBarHiddenTime", 4)
        }
        info[info.length] = {
            'type': 'value',
            'title': getTimeText(5),
            'onclick': 'setVideoPlayerSettingsValue(\'progressBarHiddenTime\', 5);',
            'checked': isVideoPlayerSettingsValue("progressBarHiddenTime", 5)
        }
        info[info.length] = {
            'type': 'value',
            'title': getTimeText(6),
            'onclick': 'setVideoPlayerSettingsValue(\'progressBarHiddenTime\', 6);',
            'checked': isVideoPlayerSettingsValue("progressBarHiddenTime", 6)
        }
        info[info.length] = {
            'type': 'value',
            'title': getTimeText(7),
            'onclick': 'setVideoPlayerSettingsValue(\'progressBarHiddenTime\', 7);',
            'checked': isVideoPlayerSettingsValue("progressBarHiddenTime", 7)
        }
        info[info.length] = {
            'type': 'value',
            'title': getTimeText(8),
            'onclick': 'setVideoPlayerSettingsValue(\'progressBarHiddenTime\', 8);',
            'checked': isVideoPlayerSettingsValue("progressBarHiddenTime", 8)
        }
    }

    //재생 속도
    if (type == "playback_rate") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("video_player_settings:main:playback_rate"),
            'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'main\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'value',
            'title': '0.25',
            'onclick': 'changePlaybackRateVideoPlayer(' + uniqueNumber + ', 0.25);',
            'checked': (video.playbackRate == 0.25)
        }
        info[info.length] = {
            'type': 'value',
            'title': '0.5',
            'onclick': 'changePlaybackRateVideoPlayer(' + uniqueNumber + ', 0.5);',
            'checked': (video.playbackRate == 0.5)
        }
        info[info.length] = {
            'type': 'value',
            'title': '0.75',
            'onclick': 'changePlaybackRateVideoPlayer(' + uniqueNumber + ', 0.75);',
            'checked': (video.playbackRate == 0.75)
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:playback_rate:normal"),
            'onclick': 'changePlaybackRateVideoPlayer(' + uniqueNumber + ', 1);',
            'checked': (video.playbackRate == 1)
        }
        info[info.length] = {
            'type': 'value',
            'title': '1.25',
            'onclick': 'changePlaybackRateVideoPlayer(' + uniqueNumber + ', 1.25);',
            'checked': (video.playbackRate == 1.25)
        }
        info[info.length] = {
            'type': 'value',
            'title': '1.5',
            'onclick': 'changePlaybackRateVideoPlayer(' + uniqueNumber + ', 1.5);',
            'checked': (video.playbackRate == 1.5)
        }
        info[info.length] = {
            'type': 'value',
            'title': '1.75',
            'onclick': 'changePlaybackRateVideoPlayer(' + uniqueNumber + ', 1.75);',
            'checked': (video.playbackRate == 1.75)
        }
        info[info.length] = {
            'type': 'value',
            'title': '2',
            'onclick': 'changePlaybackRateVideoPlayer(' + uniqueNumber + ', 2);',
            'checked': (video.playbackRate == 2)
        }
    }

    //품질
    if (type == "resolutions") {
        let resolutions = videoPlayerInfo["resolutions"];
        let currentResolution = videoPlayerInfo["resolutionInfo"];
        let resolutionMode = videoPlayerInfo["resolutionMode"];
        let resolutionData = getVideoPlayerResolutionData(uniqueNumber);

        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("video_player_settings:main:resolutions"),
            'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'main\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }

        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:resolutions:0:title"),
            'description': getLanguage("video_player_settings:resolutions:0:description") + '<br /> <b>(' + resolutionData[0]["resolution"] + 'p@' + resolutionData[0]["framerate"] + 'Hz · ' + capacityUnit(resolutionData[0]["size"]) + ')</b>',
            'onclick': 'changeResolutionModeVideoPlayer(' + uniqueNumber + ', 0);',
            'checked': (resolutionMode == 0)
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:resolutions:1:title"),
            'description': getLanguage("video_player_settings:resolutions:1:description") + '<br /> <b>(' + resolutionData[1]["resolution"] + 'p@' + resolutionData[1]["framerate"] + 'Hz · ' + capacityUnit(resolutionData[1]["size"]) + ')</b>',
            'onclick': 'changeResolutionModeVideoPlayer(' + uniqueNumber + ', 1);',
            'checked': (resolutionMode == 1)
        }
        info[info.length] = {
            'type': 'value',
            'title': getLanguage("video_player_settings:resolutions:2:title"),
            'description': getLanguage("video_player_settings:resolutions:2:description") + '<br /> <b>(' + resolutionData[2]["resolution"] + 'p@' + resolutionData[2]["framerate"] + 'Hz · ' + capacityUnit(resolutionData[2]["size"]) + ')</b>',
            'onclick': 'changeResolutionModeVideoPlayer(' + uniqueNumber + ', 2);',
            'checked': (resolutionMode == 2)
        }
        if (resolutionMode == 3) {
            info[info.length] = {
                'type': 'value',
                'title': getLanguage("video_player_settings:resolutions:3:title"),
                'description': getLanguage("video_player_settings:resolutions:3:description") + '<br /> <b>(' + resolutionData[3]["resolution"] + 'p@' + resolutionData[3]["framerate"] + 'Hz · ' + capacityUnit(resolutionData[3]["size"]) + ')</b>',
                'onclick': 'changeResolutionModeVideoPlayer(' + uniqueNumber + ', 2);',
                'checked': (resolutionMode == 3)
            }
        }
        info[info.length] = {
            'type': 'line'
        }

        for (let i = (resolutions.length - 1); i >= 0; i--) {
            let resolution = resolutions[i];

            let title = (resolution["resolution"] + "p");
            if (resolution["resolution"] == 480) {
                title += " <span>SD</span>";
            }
            if (resolution["resolution"] == 720) {
                title += " <span>HD</span>";
            }
            if (resolution["resolution"] == 1080) {
                title += " <span>FHD</span>";
            }
            if (resolution["resolution"] == 1440) {
                title += " <span>QHD</span>";
            }
            if (resolution["resolution"] == 2160) {
                title += " <span>4K</span>";
            }
            if (resolution["resolution"] == 4320) {
                title += " <span>8K</span>";
            }
            if (resolution["resolution"] == 8640) {
                title += " <span>16K</span>";
            }

            let size = "...";
            if (resolution["status"] == 0) {
                size = capacityUnit(resolution["size"]);
            } else if (resolution["status"] == 1) {
                size = getLanguage("video_player_statistics:progress:1").replaceAll("{R:0}", (resolution["progress"] + "%"));
                let currentTime = new Date();
                let utc = (currentTime.getTime() + (currentTime.getTimezoneOffset() * 60 * 1000));
                let elapsedTime = (utc - new Date(resolution["startDate"]).getTime()) / 1000;
                size = size.replaceAll("{R:1}", getTimeText(elapsedTime));
            } else if (resolution["status"] == 2) {
                size = getLanguage("video_player_statistics:progress:2").replaceAll("{R:0}", "");
            }
            let framerate = "";
            if (resolution["status"] == 0) {
                framerate = ('@' + resolution["framerate"] + 'Hz');
            }

            info[info.length] = {
                'type': 'value',
                'title': title,
                'description': (resolution["width"] + 'x' + resolution["height"] + framerate + ' · ' + size),
                'onclick': 'changeResolutionModeVideoPlayer(' + uniqueNumber + ', -1, ' + resolution["resolution"] + ');',
                'checked': (currentResolution["resolution"] == resolution["resolution"]),
                'disabled': ((resolution["status"] == 0) ? false : true)
            }
        }
    }

    //언어
    if (type == "language") {
        let language = videoPlayerInfo["language"];
        let property = videoPlayerInfo["property"];
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("video_player_settings:main:language"),
            'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'main\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }

        let languages = new Array();
        languages[0] = property["originalLanguage"];
        let localizationLanguage = new Array();
        if (property["localizationLanguage"] != null) {
            localizationLanguage = property["localizationLanguage"].split(",");
        }
        for (let i = 0; i < localizationLanguage.length; i++) {
            languages[languages.length] = localizationLanguage[i];
        }

        for (let i = 0; i < languages.length; i++) {
            let title = getLanguage("language:" + languages[i]);
            if (userLanguage == languages[i]) {
                title = getLanguage("viewer_settings_user_language").replaceAll("{R:0}", title)
            }
            info[info.length] = {
                'type': 'value',
                'title': title,
                'checked': (languages[i] == language)
            }
        }
    }

    //자막
    if (type == "subtitles") {
        info[info.length] = {
            'type': 'goBack',
            'title': getLanguage("video_player_settings:main:subtitles"),
            'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'main\', true);'
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'menu',
            'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 28"><path d="M14 14c0-2.203-1.797-4-4-4s-4 1.797-4 4 1.797 4 4 4 4-1.797 4-4zM26 22c0-1.094-0.906-2-2-2s-2 0.906-2 2c0 1.109 0.906 2 2 2 1.109 0 2-0.906 2-2zM26 6c0-1.094-0.906-2-2-2s-2 0.906-2 2c0 1.109 0.906 2 2 2 1.109 0 2-0.906 2-2zM20 12.578v2.891c0 0.203-0.156 0.438-0.359 0.469l-2.422 0.375c-0.125 0.406-0.297 0.797-0.5 1.188 0.438 0.625 0.906 1.203 1.406 1.797 0.063 0.094 0.109 0.187 0.109 0.313 0 0.109-0.031 0.219-0.109 0.297-0.313 0.422-2.063 2.328-2.516 2.328-0.125 0-0.234-0.047-0.328-0.109l-1.797-1.406c-0.391 0.203-0.781 0.359-1.203 0.484-0.078 0.797-0.156 1.656-0.359 2.422-0.063 0.219-0.25 0.375-0.469 0.375h-2.906c-0.219 0-0.438-0.172-0.469-0.391l-0.359-2.391c-0.406-0.125-0.797-0.297-1.172-0.484l-1.844 1.391c-0.078 0.078-0.203 0.109-0.313 0.109-0.125 0-0.234-0.047-0.328-0.125-0.406-0.375-2.25-2.047-2.25-2.5 0-0.109 0.047-0.203 0.109-0.297 0.453-0.594 0.922-1.172 1.375-1.781-0.219-0.422-0.406-0.844-0.547-1.281l-2.375-0.375c-0.219-0.031-0.375-0.234-0.375-0.453v-2.891c0-0.203 0.156-0.438 0.359-0.469l2.422-0.375c0.125-0.406 0.297-0.797 0.5-1.188-0.438-0.625-0.906-1.203-1.406-1.797-0.063-0.094-0.109-0.203-0.109-0.313s0.031-0.219 0.109-0.313c0.313-0.422 2.063-2.312 2.516-2.312 0.125 0 0.234 0.047 0.328 0.109l1.797 1.406c0.391-0.203 0.781-0.359 1.203-0.5 0.078-0.781 0.156-1.641 0.359-2.406 0.063-0.219 0.25-0.375 0.469-0.375h2.906c0.219 0 0.438 0.172 0.469 0.391l0.359 2.391c0.406 0.125 0.797 0.297 1.172 0.484l1.844-1.391c0.094-0.078 0.203-0.109 0.313-0.109 0.125 0 0.234 0.047 0.328 0.125 0.406 0.375 2.25 2.063 2.25 2.5 0 0.109-0.047 0.203-0.109 0.297-0.453 0.609-0.922 1.172-1.359 1.781 0.203 0.422 0.391 0.844 0.531 1.281l2.375 0.359c0.219 0.047 0.375 0.25 0.375 0.469zM30 20.906v2.188c0 0.234-2.016 0.453-2.328 0.484-0.125 0.297-0.281 0.562-0.469 0.812 0.141 0.313 0.797 1.875 0.797 2.156 0 0.047-0.016 0.078-0.063 0.109-0.187 0.109-1.859 1.109-1.937 1.109-0.203 0-1.375-1.563-1.531-1.797-0.156 0.016-0.313 0.031-0.469 0.031s-0.313-0.016-0.469-0.031c-0.156 0.234-1.328 1.797-1.531 1.797-0.078 0-1.75-1-1.937-1.109-0.047-0.031-0.063-0.078-0.063-0.109 0-0.266 0.656-1.844 0.797-2.156-0.187-0.25-0.344-0.516-0.469-0.812-0.313-0.031-2.328-0.25-2.328-0.484v-2.188c0-0.234 2.016-0.453 2.328-0.484 0.125-0.281 0.281-0.562 0.469-0.812-0.141-0.313-0.797-1.891-0.797-2.156 0-0.031 0.016-0.078 0.063-0.109 0.187-0.094 1.859-1.094 1.937-1.094 0.203 0 1.375 1.547 1.531 1.781 0.156-0.016 0.313-0.031 0.469-0.031s0.313 0.016 0.469 0.031c0.438-0.609 0.906-1.219 1.437-1.75l0.094-0.031c0.078 0 1.75 0.984 1.937 1.094 0.047 0.031 0.063 0.078 0.063 0.109 0 0.281-0.656 1.844-0.797 2.156 0.187 0.25 0.344 0.531 0.469 0.812 0.313 0.031 2.328 0.25 2.328 0.484zM30 4.906v2.187c0 0.234-2.016 0.453-2.328 0.484-0.125 0.297-0.281 0.562-0.469 0.812 0.141 0.313 0.797 1.875 0.797 2.156 0 0.047-0.016 0.078-0.063 0.109-0.187 0.109-1.859 1.109-1.937 1.109-0.203 0-1.375-1.563-1.531-1.797-0.156 0.016-0.313 0.031-0.469 0.031s-0.313-0.016-0.469-0.031c-0.156 0.234-1.328 1.797-1.531 1.797-0.078 0-1.75-1-1.937-1.109-0.047-0.031-0.063-0.078-0.063-0.109 0-0.266 0.656-1.844 0.797-2.156-0.187-0.25-0.344-0.516-0.469-0.812-0.313-0.031-2.328-0.25-2.328-0.484v-2.188c0-0.234 2.016-0.453 2.328-0.484 0.125-0.281 0.281-0.562 0.469-0.812-0.141-0.313-0.797-1.891-0.797-2.156 0-0.031 0.016-0.078 0.063-0.109 0.187-0.094 1.859-1.094 1.937-1.094 0.203 0 1.375 1.547 1.531 1.781 0.156-0.016 0.313-0.031 0.469-0.031s0.313 0.016 0.469 0.031c0.438-0.609 0.906-1.219 1.437-1.75l0.094-0.031c0.078 0 1.75 0.984 1.937 1.094 0.047 0.031 0.063 0.078 0.063 0.109 0 0.281-0.656 1.844-0.797 2.156 0.187 0.25 0.344 0.531 0.469 0.812 0.313 0.031 2.328 0.25 2.328 0.484z"></path></svg>',
            'title': '자막 세부 설정',
            'onclick': 'videoPlayerMoveSettings(' + uniqueNumber + ', \'subtitles_settings\');',
            'description': '사용 가능한 세부 설정을 살펴보세요.'
        }
        if (loginStatus["isLogin"] == true) {
            info[info.length] = {
                'type': 'menu',
                'icon': '<!-- Generated by IcoMoon.io --><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19.753 10.909c-0.624-1.707-2.366-2.726-4.661-2.726-0.090 0-0.176 0.002-0.262 0.006l-0.016-2.063c0 0 3.41-0.588 3.525-0.607s0.133-0.119 0.109-0.231c-0.023-0.111-0.167-0.883-0.188-0.976-0.027-0.131-0.102-0.127-0.207-0.109s-3.25 0.461-3.25 0.461-0.012-1.953-0.013-2.078c-0.001-0.125-0.069-0.158-0.194-0.156s-0.92 0.014-1.025 0.016c-0.105 0.002-0.164 0.049-0.162 0.148s0.033 2.307 0.033 2.307-3.061 0.527-3.144 0.543c-0.084 0.014-0.17 0.053-0.151 0.143s0.19 1.094 0.208 1.172c0.018 0.080 0.072 0.129 0.188 0.107 0.115-0.019 2.924-0.504 2.924-0.504l0.035 2.018c-1.077 0.281-1.801 0.824-2.256 1.303-0.768 0.807-1.207 1.887-1.207 2.963 0 1.586 0.971 2.529 2.328 2.695 3.162 0.387 5.119-3.060 5.769-4.715 1.097 1.506 0.256 4.354-2.094 5.98-0.043 0.029-0.098 0.129-0.033 0.207s0.541 0.662 0.619 0.756c0.080 0.096 0.206 0.059 0.256 0.023 2.51-1.73 3.661-4.515 2.869-6.683zM12.367 14.097c-0.966-0.121-0.944-0.914-0.944-1.453 0-0.773 0.327-1.58 0.876-2.156 0.335-0.354 0.75-0.621 1.229-0.799l0.082 4.277c-0.385 0.131-0.799 0.185-1.243 0.131zM14.794 13.544l0.046-4.109c0.084-0.004 0.166-0.010 0.252-0.010 0.773 0 1.494 0.145 1.885 0.361s-1.023 2.713-2.183 3.758zM5.844 5.876c-0.030-0.094-0.103-0.145-0.196-0.145h-1.95c-0.093 0-0.165 0.051-0.194 0.144-0.412 1.299-3.48 10.99-3.496 11.041s-0.011 0.076 0.062 0.076h1.733c0.075 0 0.099-0.023 0.114-0.072 0.015-0.051 1.008-3.318 1.008-3.318h3.496c0 0 0.992 3.268 1.008 3.318s0.039 0.072 0.113 0.072h1.734c0.072 0 0.078-0.025 0.062-0.076-0.014-0.050-3.083-9.741-3.494-11.040zM3.226 12.194l1.447-5.25 1.447 5.25h-2.894z"></path></svg>',
                'title': '사용자 번역 참여',
                'description': '좋아하시는 작품인가요? 많은 사람들이 읽거나 볼 수 있도록 번역해주세요!'
            }
        }
        info[info.length] = {
            'type': 'line'
        }
        info[info.length] = {
            'type': 'value',
            'title': '사용 안함',
            'checked': true
        }
    }
    
    newEl.innerHTML = getVideoPlayerSettingsHtml(uniqueNumber, info);
    return newEl;
}
function getVideoPlayerSettingsHtml(uniqueNumber, info) {
    let html = "";

    let isTopBttomPadding = false;
    for (let i = 0; i < info.length; i++) {
        let type = info[i]["type"];

        //위, 아래 공백 여부
        if (type == "menu" || type == "value") {
            if (isTopBttomPadding == false) {
                isTopBttomPadding = true;
                html += `<div class = "video_player_container_settings_top_bottom_padding">`;
            }
        } else {
            isTopBttomPadding = false;
            html += `</div>`;
        }

        if (type == "menu") {
            let onclick = info[i]["onclick"];
            let right = "...";
            let description = "";

            (info[i]["value"] == null) ? info[i]["value"] = "" : null;
            if (info[i]["value"] != null) {
                right = `
                    <div class = "video_player_container_settings_menu_value">
                        ` + info[i]["value"] + `
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.25 10l-7.141-7.42c-0.268-0.27-0.268-0.707 0-0.979 0.268-0.27 0.701-0.27 0.969 0l7.83 7.908c0.268 0.271 0.268 0.709 0 0.979l-7.83 7.908c-0.268 0.271-0.701 0.27-0.969 0s-0.268-0.707 0-0.979l7.141-7.417z"></path></svg>
                    </div>
                `;
            }
            let isToggle = false;
            if (info[i]["toggle"] != null) {
                right = `
                    <div class = "video_player_container_settings_menu_toggle">
                        <div class = "video_player_container_settings_menu_toggle_circle"></div>
                    </div>
                `;
                isToggle = info[i]["toggle"];

                onclick += `
                    let isToggle = this.getAttribute('toggle');
                    if (isToggle == 'true' || isToggle == true) {
                        this.setAttribute('toggle', false);
                    } else {
                        this.setAttribute('toggle', true);
                    }
                `;
            }

            //설명
            if (info[i]["description"] != null) {
                description = `
                    <div class = "video_player_container_settings_menu_center_description">
                        ` + info[i]["description"] + `
                    </div>
                `;
            }

            html += `
                <div class = "video_player_container_settings_menu md-ripples" onclick = "` + onclick + `" toggle = "` + isToggle + `">
                    <div class = "video_player_container_settings_menu_icon">
                        ` + info[i]["icon"] + `
                    </div>
                    <div class = "video_player_container_settings_menu_center">
                        <div class = "video_player_container_settings_menu_center_title">
                            ` + info[i]["title"] + `
                        </div>
                        ` + description + `
                    </div>
                    ` + right + `
                </div>
            `;
        }
        //뒤로가기
        if (type == "goBack") {
            html += `
                <div class = "video_player_container_settings_go_back">
                    <div class = "video_player_container_settings_go_back_button md-ripples" onclick = "` + info[i]["onclick"] + `">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"></rect><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"></rect></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"></rect></g></svg>
                    </div>
                    <div class = "video_player_container_settings_go_back_title">
                        ` + info[i]["title"] + `
                    </div>
                </div>
            `;
        }
        //값 선택
        if (type == "value") {
            let onclick = info[i]["onclick"];
            onclick += ` videoPlayerSettingsValueChecked(` + uniqueNumber + `, this);`;

            let checked = info[i]["checked"];
            (checked == null) ? checked = false : null;

            let disabled = info[i]["disabled"];
            (disabled == null) ? disabled = false : null;

            //설명
            let description = "";
            if (info[i]["description"] != null) {
                description = `
                    <div class = "video_player_container_settings_value_right_description">
                        ` + info[i]["description"] + `
                    </div>
                `;
            }

            html += `
                <div class = "video_player_container_settings_value md-ripples" checked = "` + checked + `" disabled = "` + disabled + `" onclick = "` + onclick + `">
                    <div class = "video_player_container_settings_value_icon">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                    </div>
                    <div class = "video_player_container_settings_value_right">
                        <div class = "video_player_container_settings_value_right_title">
                            ` + info[i]["title"] + `
                        </div>
                        ` + description + `
                    </div>
                </div>
            `;
        }
        if (type == "line") {
            html += `<div class = "video_player_container_settings_line"></div>`;
        }
    }
    if (isTopBttomPadding == true) {
        html += `</div>`;
    }

    html += `<div style = "width: 280px;"></div>`;
    return html;
}
function videoPlayerSettingsValueChecked(uniqueNumber, el) {
    let box = getVideoPlayerElement(uniqueNumber);
    let container = box.getElementsByClassName("video_player_container")[0];
    let settingsItems = container.getElementsByClassName("video_player_container_settings_items")[0];

    //뒤로가기
    let goBackButton = settingsItems.getElementsByClassName("video_player_container_settings_go_back_button")[0];
    let previousTimestamp = null;
    function callback(timestamp) {
        if (previousTimestamp === timestamp) { return };
        previousTimestamp = timestamp;

        function callback2() {
            goBackButton.onclick();
        }
        window.requestAnimationFrame(callback2);
    }
    window.requestAnimationFrame(callback);

    let valueList = settingsItems.getElementsByClassName("video_player_container_settings_value");
    for (let i = 0; i < valueList.length; i++) {
        valueList[i].setAttribute("checked", false);
    }

    el.setAttribute("checked", true);
}

function setVideoPlayerSettingsValue(name, value) {
    let settings = {};
    let cookie = getCookie("videoPlayerSettings");
    if (cookie != null && cookie != "null") {
        settings = cookie;
        (settings == null || settings == "null") ? settings = {} : settings = JSON.parse(settings);
    }

    settings[name] = value;
    setCookie("videoPlayerSettings", JSON.stringify(settings));
    videoPlayerSettingsValue = settings;
}
let videoPlayerSettingsValue = null;
function getVideoPlayerSettingsValue(name) {
    if (videoPlayerSettingsValue == null) {
        let settings = getCookie('videoPlayerSettings');
        (settings == null || settings == "null") ? settings = {} : settings = JSON.parse(settings);
        videoPlayerSettingsValue = settings;
    }
    settings = videoPlayerSettingsValue;

    //기본 값
    let defaultValue = {
        'isUseSkipIntro': false,
        'isUseDynamicLightEffect': true,
        'isUseLetterBoxEffect': true,
        'isUsePipModeButton': true,
        'isUseChangeTabPipMode': false,
        'isUseFullScreenOnPlayback': false,
        'isUsePreviousAndNextButton': true,
        'isUseSkipButton': true,
        'isUseAccessibility': false,
        'isUseFullScreenClickDelay': true,
        'isUseClickAndHotKeyEffects': true,
        'isUseLoadingFeedback': true,
        'isUseContextMenu': true,
        'progressBarHiddenTime': 2,
        'isUseHideProgressBar': false,
        'isUsePreview': true,
        'isUseDetailedPreview': true,
        'isUseDeafSubtitles': false,
        'isUseLimitedResolution': true,
        'isUseLoudnessNormalizer': true,
        'isUseHeadRelatedTransferFunction': false,
        "isUseScrollReset": true,
        'audioBooster': 0,
        'fullScreenBalancing': -1,
        'videoCodec': 'auto',
        'objectFit': 'contain',
        'aspectRatio': -2
    };

    return settings[name] ?? defaultValue[name];
}
function isVideoPlayerSettingsValue(name, value) {
    let settingsValue = getVideoPlayerSettingsValue(name);
    return (settingsValue == value);
}
function resetVideoPlayerSettings() {
    videoPlayerSettingsValue = null;
    setCookie("videoPlayerSettings", null);
}