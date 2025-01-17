

/*
    workNumber = 작품 번호
    workInfo:
        coverImage = 표지 URL
        title = 제목
        description = 설명
*/
function getHtmlPopupContents_work_report(json) {
    let html = "";
    let data = JSON.parse(json);
    let workInfo = data["workInfo"];

    html = `
        <div class = "edit_profile_picture">
            <div class = "popup_contents_top">
                <div class = "popup_contents_top_left md-ripples" onclick = "backPopupContents();" onmouseenter = "hoverInformation(this, getLanguage('popup_contents:back'));">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"></rect><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"></rect></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"></rect></g></svg>
                </div>
                <div class = "popup_contents_top_right">
                    ` + getLanguage("work_report") + `
                </div>
            </div>
            
            <div class = "popup_work_report">
                <div class = "popup_work_report_title">
                    ` + getLanguage("popup_work_report_title") + `
                </div>
                <div class = "popup_work_report_description">
                    ` + getLanguage("popup_work_report_description") + `
                </div>
                <div class = "popup_work_report_line"></div>
                <div class = "popup_work_report_info">
                    <div class = "popup_work_report_info_left img_wrap">
                        <img src = "` + workInfo["coverImage"] + `" onload = "imageLoad(event);" alt = "">
                    </div>
                    <div class = "popup_work_report_info_right">
                        <div class = "popup_work_report_info_right_top">
                            <div class = "popup_work_report_info_right_title">
                                ` + getLanguage("popup_work_report_info_title") + `
                            </div>
                            <div class = "popup_work_report_info_right_work_title">
                                ` + workInfo["title"].replaceAll("<", "&lt;").replaceAll(">", "&gt;") + `
                            </div>
                        </div>
                        <div class = "popup_work_report_info_right_bottom">
                            <div class = "popup_work_report_info_right_work_description">
                                ` + workInfo["description"].replaceAll("<", "&lt;").replaceAll(">", "&gt;") + `
                            </div>
                        </div>
                    </div>
                </div>
                <div class = "popup_work_report_line"></div>
                <div class = "popup_work_report_items">
                    <div class = "popup_work_report_item md-ripples" onclick = "popupContentsWorkReportOptionCheck(0);">
                        <div class = "popup_work_report_item_left">
                            <div class = "popup_work_report_item_left_in"></div>
                        </div>
                        <div class = "popup_work_report_item_right">
                            <div class = "popup_work_report_item_right_title">
                                ` + getLanguage("popup_work_report_item_title:0") + `
                            </div>
                            <div class = "popup_work_report_item_right_description">
                                ` + getLanguage("popup_work_report_item_description:0") + `
                            </div>
                        </div>
                    </div>
                    <div class = "popup_work_report_item md-ripples" onclick = "popupContentsWorkReportOptionCheck(1);">
                        <div class = "popup_work_report_item_left">
                            <div class = "popup_work_report_item_left_in"></div>
                        </div>
                        <div class = "popup_work_report_item_right">
                            <div class = "popup_work_report_item_right_title">
                                ` + getLanguage("popup_work_report_item_title:1") + `
                            </div>
                            <div class = "popup_work_report_item_right_description">
                                ` + getLanguage("popup_work_report_item_description:1") + `
                            </div>
                        </div>
                    </div>
                    <div class = "popup_work_report_item md-ripples" onclick = "popupContentsWorkReportOptionCheck(2);">
                        <div class = "popup_work_report_item_left">
                            <div class = "popup_work_report_item_left_in"></div>
                        </div>
                        <div class = "popup_work_report_item_right">
                            <div class = "popup_work_report_item_right_title">
                                ` + getLanguage("popup_work_report_item_title:2") + `
                            </div>
                            <div class = "popup_work_report_item_right_description">
                                ` + getLanguage("popup_work_report_item_description:2") + `
                            </div>
                        </div>
                    </div>
                    <div class = "popup_work_report_item md-ripples" onclick = "popupContentsWorkReportOptionCheck(3);">
                        <div class = "popup_work_report_item_left">
                            <div class = "popup_work_report_item_left_in"></div>
                        </div>
                        <div class = "popup_work_report_item_right">
                            <div class = "popup_work_report_item_right_title">
                                ` + getLanguage("popup_work_report_item_title:3") + `
                            </div>
                            <div class = "popup_work_report_item_right_description">
                                ` + getLanguage("popup_work_report_item_description:3") + `
                            </div>
                        </div>
                    </div>
                    <div class = "popup_work_report_item popup_work_report_item_checked md-ripples" onclick = "popupContentsWorkReportOptionCheck(4);">
                        <div class = "popup_work_report_item_left">
                            <div class = "popup_work_report_item_left_in"></div>
                        </div>
                        <div class = "popup_work_report_item_right">
                            <div class = "popup_work_report_item_right_title">
                                ` + getLanguage("popup_work_report_item_title:4") + `
                            </div>
                            <div class = "popup_work_report_item_right_description">
                                ` + getLanguage("popup_work_report_item_description:4") + `
                            </div>
                        </div>
                    </div>
                </div>
                <div class = "popup_work_report_line"></div>
                <div class = "popup_work_report_bottom">
                    <div class = "popup_work_report_bottom_button_description">
                        ` + getLanguage("popup_work_report_bottom_description") + `
                    </div>
                    <div class = "popup_work_report_bottom_button md-ripples" onclick = "popupWorkReportSubmitButton(` + data["workNumber"] + `);">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5" transform="translate(9)"></rect><path d="M13.422,25.422s6.941-3.318,12.163-3.086,17.81,4.641,17.81,4.641V9.456S27.963,4,24.656,3.945s-9.456,2.9-9.456,2.9L13.422,4.235S18.913.754,24.25,1.1,43.395,6.15,43.395,6.15h3.249V30.806L25.584,25.422S18.391,25.816,15.2,27.9Z" transform="translate(-0.449)"></path></g></svg>
                        ` + getLanguage("popup_work_report_bottom_submit_button") + `
                    </div>
                </div>
            </div>

            <div style = "width: 500px;"></div>
        </div>
    `;

    return html;
}

function popupContentsWorkReportOptionCheck(order) {
    let popupContents = document.getElementsByClassName("popup_contents")[0];
    let reportItem = popupContents.getElementsByClassName("popup_work_report_item");

    for (let i = 0; i < reportItem.length; i++) {
        reportItem[i].classList.remove("popup_work_report_item_checked");
    }

    reportItem[order].classList.add("popup_work_report_item_checked");
}











function popupWorkReportSubmitButton(workNumber) {
    let popupContents = document.getElementsByClassName("popup_contents")[0];
    let reportItem = popupContents.getElementsByClassName("popup_work_report_item");

    let reason = null;
    for (let i = 0; i < reportItem.length; i++) {
        if (reportItem[i].classList.contains("popup_work_report_item_checked")) {
            reason = i;
            break;
        }
    }

    popupContentsLoading();

    const xhr = new XMLHttpRequest();
    const method = "POST";
    
    xhr.open(method, "/php/work/report.php");
    
    xhr.addEventListener('readystatechange', function (event) {
        const { target } = event;
        if (target.readyState === XMLHttpRequest.DONE) {
            const { status } = target;
            if (status === 0 || (status >= 200 && status < 400)) {
                let xhrHtml = xhr.responseText.trim();
                
                if (xhrHtml == "submitted") {
                    actionMessage(getLanguage("popup_work_report_bottom_submit_message:0"));
                    history.back();
                } else if (xhrHtml == "changed") {
                    actionMessage(getLanguage("popup_work_report_bottom_submit_message:1"));
                    history.back();
                } else {
                    //오류 발생
                    serverResponseErrorMessage(1);
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
    
    var formData = new FormData();
    formData.append("workNumber", workNumber);
    formData.append("reason", reason);

    xhr.send(formData);
}