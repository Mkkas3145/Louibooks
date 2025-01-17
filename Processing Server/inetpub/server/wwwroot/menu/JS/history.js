



function historyLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);

    //
    let title = contents.getElementsByClassName("menu_history_left_wrap_right")[0];
    title.innerHTML = getLanguage("menu_history_top_title");
    //
    title = contents.getElementsByClassName("menu_history_left_wrap_title")[0];
    title.innerHTML = getLanguage("menu_history_type_title");
    //
    title = contents.getElementsByClassName("menu_history_left_wrap_type_title")[0];
    title.innerHTML = getLanguage("history_type_option:0");

    let worksInfo = JSON.parse(contents.getElementsByClassName("works_info")[0].innerHTML);
    historyWorksLoad(menuNumber, worksInfo);
}
function historyTypeLoad(menuNumber) {
    let contents = document.getElementById("contents_" + menuNumber);
    let type = contents.getElementsByClassName("menu_history_left_wrap_type")[0].getAttribute("value");

    if (type == 0) {
        requestHistoryWorksLoad(menuNumber);
    } else if (type == 1) {
        requestHistoryCommentsLoad(menuNumber);
    } else if (type == 2) {
        requestHistoryCommunityLoad(menuNumber);
    } else if (type == 3) {
        requestHistorySearchHistoryLoad(menuNumber);
    } else if (type == 4) {
        requestHistoryNotificationsLoad(menuNumber);
    } else if (type == 5) {
        requestHistoryRatingsLoad(menuNumber);
    } else if (type == 6) {
        requestMenuHistoryPaymentHistoryLoad(menuNumber);
    }
}

function getHistoryTypeItems() {
    let items = new Array();
    items[0] = {
        "icon": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,700a1.5,1.5,0,0,1,.844.26l23.5,16A1.5,1.5,0,0,1,49.4,718.7L25.9,736.2a1.5,1.5,0,0,1-1.792,0L.6,718.7a1.5,1.5,0,0,1,.052-2.443l23.5-16A1.5,1.5,0,0,1,25,700Zm20.915,17.555L25,703.315,4.085,717.555,25,733.13Z" transform="translate(0 -700)"/><path d="M24.953,736.551a1.5,1.5,0,0,1-.9-.3L.6,718.754a1.5,1.5,0,0,1,1.794-2.4l22.558,16.832,22.65-16.834a1.5,1.5,0,1,1,1.789,2.408l-23.547,17.5A1.5,1.5,0,0,1,24.953,736.551Z" transform="translate(0 -686.551)"/></g></svg>',
        "title": getLanguage("history_type_option:0"),
        "value": 0
    }
    items[1] = {
        "icon": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M40.707,46.427h0a3.976,3.976,0,0,1-2.333-1.044c-3.13-2.487-11.917-9.316-12-9.383H5a5.006,5.006,0,0,1-5-5V5A5.006,5.006,0,0,1,5,0H45a5.006,5.006,0,0,1,5,5V31a5.005,5.005,0,0,1-5,5H42.466v9.106A2,2,0,0,1,40.707,46.427ZM4.906,3A1.985,1.985,0,0,0,3.016,4.9L2.984,31.027c0,.019.129,1.891,1.859,1.953H27.391l12.078,9.453V32.98h5.688A2.03,2.03,0,0,0,47,31l-.015-26.25c0-.017-.282-1.672-1.8-1.718Z" transform="translate(0 1.786)"></path></g></svg>',
        "title": getLanguage("history_type_option:1"),
        "value": 1
    }
    items[2] = {
        "icon": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,50A25.007,25.007,0,0,1,15.269,1.965,25.007,25.007,0,0,1,34.731,48.036,24.843,24.843,0,0,1,25,50ZM25,3A22,22,0,1,0,47,25,22.025,22.025,0,0,0,25,3Z"></path><rect width="48" height="2" transform="translate(26 1) rotate(90)"></rect><path d="M0,0S11.775-11.288,23.775-11.288,48,0,48,0V2S35.775-9.288,23.775-9.288,0,2,0,2Z" transform="translate(26 1) rotate(90)"></path><path d="M0,0S11.775-11.288,23.775-11.288,48,0,48,0V2S35.775-9.288,23.775-9.288,0,2,0,2Z" transform="translate(24 49) rotate(-90)"></path><path d="M0,0S11.923-4.994,23.923-4.994,48,0,48,0V2S35.923-2.994,23.923-2.994,0,2,0,2Z" transform="translate(49 31.856) rotate(-180)"></path><path d="M0,0S11.923-4.994,23.923-4.994,48,0,48,0V2S35.923-2.994,23.923-2.994,0,2,0,2Z" transform="translate(1 17.85)"></path></g></svg>',
        "title": getLanguage("history_type_option:2"),
        "value": 2
    }
    items[3] = {
        "icon": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M21.5,43A21.5,21.5,0,0,1,6.3,6.3,21.5,21.5,0,1,1,36.7,36.7,21.359,21.359,0,0,1,21.5,43Zm0-39.605A18.105,18.105,0,1,0,39.605,21.5,18.126,18.126,0,0,0,21.5,3.394Z"></path><rect width="3" height="20" rx="1.5" transform="translate(33.904 35.858) rotate(-45)"></rect></g></svg>',
        "title": getLanguage("history_type_option:3"),
        "value": 3
    }
    items[4] = {
        "icon": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M42.282,39.4h0l-.226,0H1.251C.557,39.4.2,39.3.065,39.075c-.221-.363.152-1.085.769-2.282,1.4-2.715,4.315-8.364,4.6-18.745a21.434,21.434,0,0,1,1.682-8.6,15.31,15.31,0,0,1,4.146-5.562A17.322,17.322,0,0,1,22.285,0a16.042,16.042,0,0,1,10.5,4.409,18.085,18.085,0,0,1,5.659,13.638c.141,10.246,2.863,15.713,4.326,18.65.617,1.238.989,1.986.755,2.364C43.375,39.3,43,39.4,42.282,39.4ZM22.187,3.026c-6.61,0-13.7,4.015-13.76,15.285a46.872,46.872,0,0,1-2.09,13.2,29.949,29.949,0,0,1-1.958,4.9L39.3,36.4s0,0-.006-.009a27.524,27.524,0,0,1-1.879-4.733,47.874,47.874,0,0,1-2-13.351C35.34,7.268,27.28,3.075,22.217,3.026Z" transform="translate(3.124 0.378)"></path><path d="M6.4,0a6.4,6.4,0,0,1,6.4,6.4H0A6.4,6.4,0,0,1,6.4,0Z" transform="translate(30.704 50) rotate(180)"></path></g></svg>',
        "title": getLanguage("history_type_option:4"),
        "value": 4
    }
    items[5] = {
        "icon": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-161.3,48.508a.992.992,0,0,1-.583-.194l-12.534-9.07a1,1,0,0,0-.586-.19,1,1,0,0,0-.586.19l-12.534,9.07a.99.99,0,0,1-.583.194,1.021,1.021,0,0,1-.808-.407.971.971,0,0,1-.158-.869l4.378-15.5a1,1,0,0,0-.335-1.05L-197.884,20.8a.978.978,0,0,1-.32-1.1.979.979,0,0,1,.921-.68l15.335-.412a1,1,0,0,0,.921-.681l5.08-15.112A.987.987,0,0,1-175,2.139a.987.987,0,0,1,.948.681l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a.979.979,0,0,1,.921.68.978.978,0,0,1-.32,1.1l-12.256,9.877a1,1,0,0,0-.336,1.05l4.378,15.5a.972.972,0,0,1-.158.869A1.021,1.021,0,0,1-161.3,48.508Zm-13.655-12.455a3.809,3.809,0,0,1,2.185.7c2.2,1.509,7.989,5.785,8.047,5.828l-2.968-10.516a4,4,0,0,1,1.281-3.609c1.666-1.266,8.107-6.541,8.172-6.594l-10.031-.219h-.027a3.779,3.779,0,0,1-3.488-2.781c-.969-2.829-3.213-9.345-3.235-9.407l-3.235,9.734c-.011.024-1.121,2.438-3.5,2.453-2.4.015-9.925.233-10,.235l8.407,6.844a3.748,3.748,0,0,1,.968,3.687l-2.844,10.11,8.063-5.828A4.312,4.312,0,0,1-174.951,36.053Z" transform="translate(200)"/></g></svg>',
        "title": getLanguage("history_type_option:5"),
        "value": 5
    }
    items[6] = {
        "icon": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M38,26H3a3,3,0,0,1-3-3V2A3,3,0,0,1,3-1H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26ZM3.1,2.105V22.9H37.9V2.105Z" transform="translate(1 8.5)"></path><ellipse cx="4" cy="3.939" rx="4" ry="3.939" transform="translate(17.5 17.123)"></ellipse><path d="M38,26H3a3,3,0,0,1-3-3V22.9H37.9V0H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26Z" transform="translate(8 15.5)"></path></g></svg>',
        "title": getLanguage("history_type_option:6"),
        "value": 6
    }
    return items;
}