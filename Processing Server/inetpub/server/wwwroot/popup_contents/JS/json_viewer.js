
function getHtmlPopupContents_json_viewer(json) {
    let html = '';

    json = json.replaceAll("\"", "\\\"");
    json = json.replaceAll("&2quot;", "\"");

    html = `
        <div class = "popup_contents_top">
            <div class = "popup_contents_top_left md-ripples" onclick = "backPopupContents();" onmouseenter = "hoverInformation(this, getLanguage('popup_contents:back'));">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"></rect><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"></rect></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"></rect></g></svg>
            </div>
            <div class = "popup_contents_top_right">
                JSON
            </div>
        </div>

        <div class = "popup_contents_json_viewer">
            <div class = "popup_contents_json_viewer_input">
                <div class = "popup_contents_json_viewer_input_textbox" contenteditable = "true" placeholder = "..." onkeydown = "textbox_remove_spaces(this);" onpaste = "contenteditable_paste(event);" onfocus = "popupContentsJsonViewerInputFocus(this);" onblur = "popupContentsJsonViewerInputBlur(this);">` + cleanJson(json) + `</div>
                <div class = "popup_contents_json_viewer_input_line_wrap"></div>
            </div>
        </div>

        <div style = "width: 500px;"></div>
    `;

    return html;
}
function popupContentsJsonViewerInputFocus(el) {
    let parent = el.parentElement;
    parent.classList.add('popup_contents_json_viewer_input_focus');
}
function popupContentsJsonViewerInputBlur(el) {
    let parent = el.parentElement;
    parent.classList.remove('popup_contents_json_viewer_input_focus');
}