



function imageFormatEditorInfoButton(el, menuNumber) {
    popupElement(el, 'top', getHtmlImageFormatEditorInfoButton(menuNumber));
}

function getHtmlImageFormatEditorInfoButton(menuNumber) {
    let html = '';

    let json = getImageFormatJson(menuNumber);
    let lines = json["lines"];
    
    //압축된 이미지 용량
    let compressedImageCapacity = 0;
    for (let i = 0; i < lines.length; i++) {
        resolutions = lines[i]["resolutions"];
        compressedImageCapacity += resolutions[resolutions.length - 1]["size"];
    }

    //설정 가능한 품질, 일정한 품질
    let maxSettingsQuality = getMaxSettingsQualityImageFormat(lines);
    minQuality = maxSettingsQuality["minQuality"];
    maximumSettingsQuality = getQualityNameImageFormat(minQuality);
    if (maximumSettingsQuality == null || maximumSettingsQuality == undefined) {
        maximumSettingsQuality = getLanguage("image_format_editor_info_value_no_data");
    }
    constantQuality = maxSettingsQuality["constantQuality"];

    //전체 이미지 비율
    let imageWidth = minQuality;
    let imageHeight = 0;
    for (let i = 0; i < lines.length; i++) {
        resolutions = lines[i]["resolutions"];
        for (let j = 0; j < resolutions.length; j++) {
            (resolutions[j]["resolution"] == minQuality) ? imageHeight += resolutions[j]["height"] : null;
        }
    }
    let widthRatio = null;
    let heightRatio = null;
    if (imageWidth < imageHeight) {
        widthRatio = 1;
        heightRatio = (imageHeight / imageWidth);
    } else {
        widthRatio = (imageWidth / imageHeight);
        heightRatio = 1;
    }
    let imageRatio = ((Math.floor(widthRatio * 100) / 100) + " / " + (Math.floor(heightRatio * 100) / 100));
    if (imageWidth == 0 || imageHeight == 0) {
        imageRatio = getLanguage("image_format_editor_info_value_no_data");
    }

    //충분한 콘텐츠 길이
    let sufficientContent = null;
    if (imageWidth != 0 && imageHeight != 0) {
        if (heightRatio >= 80) {
            sufficientContent = true;
        } else {
            sufficientContent = false;
        }
    }

    //UHD 품질
    let ultraHighDefinition = false;
    if (minQuality == null || minQuality == undefined) {
        ultraHighDefinition = null;
    } else if (minQuality >= 3840) {
        ultraHighDefinition = true;
    }
    //HD 품질
    let highDefinition = false;
    if (minQuality == null || minQuality == undefined) {
        highDefinition = null;
    } else if (minQuality >= 1280) {
        highDefinition = true;
    }

    html = `
        <div class = "image_format_editor_info">
            <div class = "image_format_editor_info_title">
                ` + getLanguage("image_format_editor_info_title:condition_met") + `
            </div>
            <div class = "image_format_editor_info_condition_met">
                <div class = "image_format_editor_info_condition_met_item">
                    ` + getHtmlConditionMetChecked(ultraHighDefinition) + `
                    <div class = "image_format_editor_info_condition_met_item_right">
                        <div class = "image_format_editor_info_condition_met_item_right_title">
                            ` + getLanguage("image_format_editor_info_condition_met_title:0") + `
                        </div>
                        <div class = "image_format_editor_info_condition_met_item_right_description">
                            ` + getLanguage("image_format_editor_info_condition_met_description:0") + `
                        </div>
                    </div>
                </div>
                <div class = "image_format_editor_info_condition_met_item">
                    ` + getHtmlConditionMetChecked(highDefinition) + `
                    <div class = "image_format_editor_info_condition_met_item_right">
                        <div class = "image_format_editor_info_condition_met_item_right_title">
                            ` + getLanguage("image_format_editor_info_condition_met_title:1") + `
                        </div>
                        <div class = "image_format_editor_info_condition_met_item_right_description">
                            ` + getLanguage("image_format_editor_info_condition_met_description:1") + `
                        </div>
                    </div>
                </div>
                <div class = "image_format_editor_info_condition_met_item">
                    ` + getHtmlConditionMetChecked(sufficientContent) + `
                    <div class = "image_format_editor_info_condition_met_item_right">
                        <div class = "image_format_editor_info_condition_met_item_right_title">
                            ` + getLanguage("image_format_editor_info_condition_met_title:2") + `
                        </div>
                        <div class = "image_format_editor_info_condition_met_item_right_description">
                            ` + getLanguage("image_format_editor_info_condition_met_description:2") + `
                        </div>
                    </div>
                </div>
                <div class = "image_format_editor_info_condition_met_item">
                    ` + getHtmlConditionMetChecked(constantQuality) + `
                    <div class = "image_format_editor_info_condition_met_item_right">
                        <div class = "image_format_editor_info_condition_met_item_right_title">
                            ` + getLanguage("image_format_editor_info_condition_met_title:3") + `
                        </div>
                        <div class = "image_format_editor_info_condition_met_item_right_description">
                            ` + getLanguage("image_format_editor_info_condition_met_description:3") + `
                        </div>
                    </div>
                </div>
            </div>
            <div class = "image_format_editor_info_title">
                ` + getLanguage("image_format_editor_info_title:information") + `
            </div>
            <div class = "image_format_editor_info_items">
                <div class = "image_format_editor_info_item">
                    <div class = "image_format_editor_info_item_title">
                        ` + getLanguage("image_format_editor_info_information_title:0") + `:
                    </div>
                    <div class = "image_format_editor_info_item_value">
                        ` + maximumSettingsQuality + `
                    </div>
                </div>
                <div class = "image_format_editor_info_item">
                    <div class = "image_format_editor_info_item_title">
                        ` + getLanguage("image_format_editor_info_information_title:1") + `:
                    </div>
                    <div class = "image_format_editor_info_item_value">
                        ` + imageRatio + `
                    </div>
                </div>
                <div class = "image_format_editor_info_item">
                    <div class = "image_format_editor_info_item_title">
                        ` + getLanguage("image_format_editor_info_information_title:2") + `:
                    </div>
                    <div class = "image_format_editor_info_item_value">
                        ` + capacityUnit(compressedImageCapacity) + `
                    </div>
                </div>
            </div>
        </div>
    `;

    return html;
}

function getHtmlConditionMetChecked(value) {
    if (value == true) {
        return `
            <div class = "image_format_editor_info_condition_met_item_left" checked = "true">
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
            </div>
        `;
    } else if (value == false) {
        return `
            <div class = "image_format_editor_info_condition_met_item_left" checked = "false">
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M18 4v16h-4v-16h4zM14 28h4v-4h-4v4z"></path></svg>
            </div>
        `;
    } else {
        return `
            <div class = "image_format_editor_info_condition_met_item_left" checked = "false">
                <!-- Generated by IcoMoon.io -->
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M14.090 2.233c-1.14-0.822-2.572-1.233-4.296-1.233-1.311 0-2.418 0.289-3.317 0.868-1.427 0.906-2.185 2.445-2.277 4.615h3.307c0-0.633 0.185-1.24 0.553-1.828 0.369-0.586 0.995-0.879 1.878-0.879 0.898 0 1.517 0.238 1.854 0.713 0.339 0.477 0.508 1.004 0.508 1.582 0 0.504-0.252 0.965-0.557 1.383-0.167 0.244-0.387 0.469-0.661 0.674 0 0-1.793 1.15-2.58 2.074-0.456 0.535-0.497 1.338-0.538 2.488-0.002 0.082 0.029 0.252 0.315 0.252s2.316 0 2.571 0c0.256 0 0.309-0.189 0.312-0.274 0.018-0.418 0.064-0.633 0.141-0.875 0.144-0.457 0.538-0.855 0.979-1.199l0.91-0.627c0.822-0.641 1.477-1.166 1.767-1.578 0.494-0.676 0.842-1.51 0.842-2.5-0.001-1.615-0.571-2.832-1.711-3.656zM9.741 14.924c-1.139-0.035-2.079 0.754-2.115 1.99-0.035 1.234 0.858 2.051 1.998 2.084 1.189 0.035 2.104-0.727 2.141-1.963 0.034-1.236-0.834-2.076-2.024-2.111z"></path></svg>
            </div>
        `;
    }
}