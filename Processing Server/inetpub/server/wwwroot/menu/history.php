<?php

    include_once('../default_function.php');
    $userInfo = getMyLoginInfo();

    $menuNumber = $_POST["menuNumber"];

    //내가 최근에 본 작품 번호
    $numbers = getMostRecentlyViewedWorkNumbers(0, 0);
    $maxCount = (count($numbers) >= 24) ? 24 : count($numbers);
    $workInfo = getWorkInfo(implode(",", array_slice($numbers, 0, $maxCount)), null, null, false, true);

?>

<div class = "works_info" style = "display: none;">
    <?php
        echo json_encode(array(
            "numbers" => implode(",", $numbers),
            "info" => $workInfo,
            "worksHistoryUse" => $userInfo["works_history_use"],
        ))
    ?>
</div>

<div class = "menu_history">
    <div class = "menu_history_left scroll">
        <div class = "menu_history_left_wrap">
            <div class = "menu_history_left_wrap_top">
                <div class = "menu_history_left_wrap_icon">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25-20a24.846,24.846,0,0,1-9.731-1.965,24.915,24.915,0,0,1-7.947-5.358,24.915,24.915,0,0,1-5.358-7.947A24.837,24.837,0,0,1,0-45H3A21.852,21.852,0,0,0,9.451-29.451,21.852,21.852,0,0,0,25-23,22.025,22.025,0,0,0,47-45,22.025,22.025,0,0,0,25-67,21.939,21.939,0,0,0,5.407-55H2.08a24.925,24.925,0,0,1,5.242-7.678,24.915,24.915,0,0,1,7.947-5.358A24.831,24.831,0,0,1,25-70a24.831,24.831,0,0,1,9.731,1.965,24.915,24.915,0,0,1,7.947,5.358,24.92,24.92,0,0,1,5.358,7.946A24.839,24.839,0,0,1,50-45a24.837,24.837,0,0,1-1.965,9.731,24.915,24.915,0,0,1-5.358,7.947,24.915,24.915,0,0,1-7.947,5.358A24.846,24.846,0,0,1,25-20Zm9.99-16.451a1.494,1.494,0,0,1-.749-.2L23.877-42.636A1.5,1.5,0,0,1,23-44V-59a1.5,1.5,0,0,1,1.5-1.5A1.5,1.5,0,0,1,26-59v14.126l9.742,5.623a1.5,1.5,0,0,1,.549,2.049A1.506,1.506,0,0,1,34.99-36.451Z" transform="translate(0 70)"></path><g transform="translate(-2 4)"><rect width="3" height="12" rx="1.5" transform="translate(2.871 2.017)"></rect><rect width="3" height="12" rx="1.5" transform="matrix(0.259, 0.966, -0.966, 0.259, 14.462, 8.276)"></rect></g></g></svg>
                </div>
                <div class = "menu_history_left_wrap_right">
                    ...
                </div>
            </div>
            <div class = "menu_history_left_wrap_title">
                ...
            </div>
            <div class = "menu_history_left_wrap_type md-ripples" value = "0" onchange = "historyTypeLoad(<?php echo $menuNumber; ?>);" onclick = "selectList(this, getHistoryTypeItems());">
                <div class = "menu_history_left_wrap_type_left">
                    <div class = "menu_history_left_wrap_type_left_0">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M23.709,37.886h0L0,24.772,23.71,12.207,49.543,24.772,23.71,37.886Zm.134-22.5L6.133,24.772l17.71,9.8,19.3-9.8Z" transform="translate(0.228 -11.772)"></path><g transform="translate(1.456)"><path d="M1.451-.035A1.6,1.6,0,0,1,3,1.543L3.434,25.3a1.466,1.466,0,0,1-1.488,1.521A1.6,1.6,0,0,1,.4,25.244L-.037,1.486A1.466,1.466,0,0,1,1.451-.035Z" transform="translate(-0.648 25.64) rotate(-60)"></path><path d="M2.639.067A1.466,1.466,0,0,1,4.127,1.588L3.689,25.347a1.6,1.6,0,0,1-1.545,1.578A1.466,1.466,0,0,1,.656,25.4L1.094,1.645A1.6,1.6,0,0,1,2.639.067Z" transform="translate(43.172 22.047) rotate(60)"></path></g><g transform="translate(1.456 11)"><path d="M1.451-.035A1.6,1.6,0,0,1,3,1.543L3.434,25.3a1.466,1.466,0,0,1-1.488,1.521A1.6,1.6,0,0,1,.4,25.244L-.037,1.486A1.466,1.466,0,0,1,1.451-.035Z" transform="translate(-0.648 25.64) rotate(-60)"></path><path d="M2.639.067A1.466,1.466,0,0,1,4.127,1.588L3.689,25.347a1.6,1.6,0,0,1-1.545,1.578A1.466,1.466,0,0,1,.656,25.4L1.094,1.645A1.6,1.6,0,0,1,2.639.067Z" transform="translate(43.172 22.047) rotate(60)"></path></g></g></svg>
                    </div>
                    <div class = "menu_history_left_wrap_type_left_1">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M40.707,46.427h0a3.976,3.976,0,0,1-2.333-1.044c-3.13-2.487-11.917-9.316-12-9.383H5a5.006,5.006,0,0,1-5-5V5A5.006,5.006,0,0,1,5,0H45a5.006,5.006,0,0,1,5,5V31a5.005,5.005,0,0,1-5,5H42.466v9.106A2,2,0,0,1,40.707,46.427ZM4.906,3A1.985,1.985,0,0,0,3.016,4.9L2.984,31.027c0,.019.129,1.891,1.859,1.953H27.391l12.078,9.453V32.98h5.688A2.03,2.03,0,0,0,47,31l-.015-26.25c0-.017-.282-1.672-1.8-1.718Z" transform="translate(0 1.786)"></path></g></svg>
                    </div>
                    <div class = "menu_history_left_wrap_type_left_2">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,50A25.007,25.007,0,0,1,15.269,1.965,25.007,25.007,0,0,1,34.731,48.036,24.843,24.843,0,0,1,25,50ZM25,3A22,22,0,1,0,47,25,22.025,22.025,0,0,0,25,3Z"></path><rect width="48" height="2" transform="translate(26 1) rotate(90)"></rect><path d="M0,0S11.775-11.288,23.775-11.288,48,0,48,0V2S35.775-9.288,23.775-9.288,0,2,0,2Z" transform="translate(26 1) rotate(90)"></path><path d="M0,0S11.775-11.288,23.775-11.288,48,0,48,0V2S35.775-9.288,23.775-9.288,0,2,0,2Z" transform="translate(24 49) rotate(-90)"></path><path d="M0,0S11.923-4.994,23.923-4.994,48,0,48,0V2S35.923-2.994,23.923-2.994,0,2,0,2Z" transform="translate(49 31.856) rotate(-180)"></path><path d="M0,0S11.923-4.994,23.923-4.994,48,0,48,0V2S35.923-2.994,23.923-2.994,0,2,0,2Z" transform="translate(1 17.85)"></path></g></svg>
                    </div>
                    <div class = "menu_history_left_wrap_type_left_3">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M21.5,43A21.5,21.5,0,0,1,6.3,6.3,21.5,21.5,0,1,1,36.7,36.7,21.359,21.359,0,0,1,21.5,43Zm0-39.605A18.105,18.105,0,1,0,39.605,21.5,18.126,18.126,0,0,0,21.5,3.394Z"></path><rect width="3" height="20" rx="1.5" transform="translate(33.904 35.858) rotate(-45)"></rect></g></svg>
                    </div>
                    <div class = "menu_history_left_wrap_type_left_4">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M42.282,39.4h0l-.226,0H1.251C.557,39.4.2,39.3.065,39.075c-.221-.363.152-1.085.769-2.282,1.4-2.715,4.315-8.364,4.6-18.745a21.434,21.434,0,0,1,1.682-8.6,15.31,15.31,0,0,1,4.146-5.562A17.322,17.322,0,0,1,22.285,0a16.042,16.042,0,0,1,10.5,4.409,18.085,18.085,0,0,1,5.659,13.638c.141,10.246,2.863,15.713,4.326,18.65.617,1.238.989,1.986.755,2.364C43.375,39.3,43,39.4,42.282,39.4ZM22.187,3.026c-6.61,0-13.7,4.015-13.76,15.285a46.872,46.872,0,0,1-2.09,13.2,29.949,29.949,0,0,1-1.958,4.9L39.3,36.4s0,0-.006-.009a27.524,27.524,0,0,1-1.879-4.733,47.874,47.874,0,0,1-2-13.351C35.34,7.268,27.28,3.075,22.217,3.026Z" transform="translate(3.124 0.378)"></path><path d="M6.4,0a6.4,6.4,0,0,1,6.4,6.4H0A6.4,6.4,0,0,1,6.4,0Z" transform="translate(30.704 50) rotate(180)"></path></g></svg>
                    </div>
                    <div class = "menu_history_left_wrap_type_left_5">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-161.3,48.508a.992.992,0,0,1-.583-.194l-12.534-9.07a1,1,0,0,0-.586-.19,1,1,0,0,0-.586.19l-12.534,9.07a.99.99,0,0,1-.583.194,1.021,1.021,0,0,1-.808-.407.971.971,0,0,1-.158-.869l4.378-15.5a1,1,0,0,0-.335-1.05L-197.884,20.8a.978.978,0,0,1-.32-1.1.979.979,0,0,1,.921-.68l15.335-.412a1,1,0,0,0,.921-.681l5.08-15.112A.987.987,0,0,1-175,2.139a.987.987,0,0,1,.948.681l5.08,15.112a1,1,0,0,0,.921.681l15.335.412a.979.979,0,0,1,.921.68.978.978,0,0,1-.32,1.1l-12.256,9.877a1,1,0,0,0-.336,1.05l4.378,15.5a.972.972,0,0,1-.158.869A1.021,1.021,0,0,1-161.3,48.508Zm-13.655-12.455a3.809,3.809,0,0,1,2.185.7c2.2,1.509,7.989,5.785,8.047,5.828l-2.968-10.516a4,4,0,0,1,1.281-3.609c1.666-1.266,8.107-6.541,8.172-6.594l-10.031-.219h-.027a3.779,3.779,0,0,1-3.488-2.781c-.969-2.829-3.213-9.345-3.235-9.407l-3.235,9.734c-.011.024-1.121,2.438-3.5,2.453-2.4.015-9.925.233-10,.235l8.407,6.844a3.748,3.748,0,0,1,.968,3.687l-2.844,10.11,8.063-5.828A4.312,4.312,0,0,1-174.951,36.053Z" transform="translate(200)"/></g></svg>
                    </div>
                    <div class = "menu_history_left_wrap_type_left_6">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M38,26H3a3,3,0,0,1-3-3V2A3,3,0,0,1,3-1H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26ZM3.1,2.105V22.9H37.9V2.105Z" transform="translate(1 8.5)"></path><ellipse cx="4" cy="3.939" rx="4" ry="3.939" transform="translate(17.5 17.123)"></ellipse><path d="M38,26H3a3,3,0,0,1-3-3V22.9H37.9V0H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26Z" transform="translate(8 15.5)"></path></g></svg>
                    </div>
                </div>
                <div class = "menu_history_left_wrap_type_title value_title">
                    ...
                </div>
                <div class = "menu_history_left_wrap_type_icon">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17.418 6.109c0.272-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-7.908 7.83c-0.27 0.268-0.707 0.268-0.979 0l-7.908-7.83c-0.27-0.268-0.27-0.701 0-0.969s0.709-0.268 0.979 0l7.419 7.141 7.418-7.141z"></path></svg>
                </div>
            </div>
            <div class = "menu_history_left_wrap_line"></div>
            <div class = "menu_history_left_wrap_option_items">
                <!-- html -->
            </div>
        </div>
    </div>
    <div class = "menu_history_right">
        <!-- html -->
    </div>
</div>