

function getHtmlPopupContents_adult_questions(workTitle) {
    let html = '';

    html = `
        <div class = "popup_contents_top">
            <div class = "popup_contents_top_left md-ripples" onclick = "backPopupContents();" onmouseenter = "hoverInformation(this, getLanguage('popup_contents:back'));">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"></rect><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"></rect></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"></rect></g></svg>
            </div>
            <div class = "popup_contents_top_right">
                ` + workTitle + `
            </div>
        </div>

        <div class = "popup_adult_questions">
            <div class = "popup_adult_questions_icon">
                ` + getLanguage("adult_age") + `
            </div>
            <div class = "popup_adult_questions_title">
                ` + getLanguage("popup_adult_questions:title") + `
            </div>
            <div class = "popup_adult_questions_description">
                ` + getLanguage("popup_adult_questions:description") + `
            </div>
            <div class = "popup_adult_questions_items">
                <div class = "popup_adult_questions_button md-ripples" onclick = "setCookie('hideAdultQuestions', true); history.back();">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                    ` + getLanguage("popup_adult_questions_button:yes") + `
                </div>
                <div class = "popup_adult_questions_button md-ripples" onclick = "setCookie('hideAdultQuestions', false); history.back(); history.back();">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path></svg>
                    ` + getLanguage("popup_adult_questions_button:no") + `
                </div>
            </div>
        </div>
        <div style = "width: 600px;"></div>
    `;

    return html;
}