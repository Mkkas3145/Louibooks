<?php

    include_once('../search_function.php');
    $userInfo = getMyLoginInfo();

    $menuNumber = $_POST["menuNumber"];

    $data = json_decode($_POST["data"], true);
    $filter = $data["filter"];
    
    $resultData = search($data["query"], $filter);
    $resultQuery = null;
    if (isset($resultData["query"])) {
        $resultQuery = $resultData["query"];
    }

    $history = false;
    if ($userInfo["isLogin"] == true && $userInfo["search_history_use"] == true && $resultData["count"] != 0) {
        $history = true;
    }

    //프리미엄인지
    $isPremium = false;
    if ($userInfo["isLogin"] == true && $userInfo["rankInfo"]["rank"] == 5) {
        $isPremium = true;
    }

?>

<div class = "is_premium" style = "display: none;">
    <?php echo $isPremium; ?>
</div>
<div class = "search_query" style = "display: none;" history = "<?php echo $history; ?>">
    <?php echo $resultQuery; ?>
</div>
<div class = "search_filter" style = "display: none;">
    <?php echo json_encode($filter); ?>
</div>
<div class = "menu_title" style = "display: none;">
    <?php echo $data["query"]; ?>
</div>

<div class = "search_result" style = "display: none;">
    <?php echo json_encode($resultData); ?>
</div>
<div class = "menu_search menu_search_no_right">
    <div class = "search_contents">
        <div class = "search_contents_left">
            <div class = "menu_search_top">
                <div class = "menu_search_top_left">
                    <div class = "menu_search_top_left_sort md-ripples" onclick = "popupSearchFilter(this);">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="50" height="3" rx="1.5" transform="translate(0 7)"></rect><rect width="16" height="3" rx="1.5" transform="translate(0 41)"></rect><rect width="33" height="3" rx="1.5" transform="translate(0 24)"></rect></g></svg>
                        <span>...</span>
                    </div>
                </div>
                <div class = "menu_search_top_right">
                    ...
                </div>
            </div>
            <div class = "search_contents_left_google_adsense" style = "display: none;"></div>
            <div class = "search_contents_left_items">
                <!-- item -->
            </div>
            <div class = "search_contents_loading" style = "padding: 20px; display: none;">
                <div class="showbox"><div class="loader" style="width: 35px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle></svg></div></div>
            </div>
            <div class = "menu_search_no_result" style = "display: none;">
                <div class = "menu_search_no_result_image img_wrap">
                    <img src = "/IMG/search_no_data.webp" onload = "imageLoad(event);" alt = "">
                </div>
                <div class = "menu_search_no_result_wrap">
                    <div class = "menu_search_no_result_left">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M21.5,43A21.5,21.5,0,0,1,6.3,6.3,21.5,21.5,0,1,1,36.7,36.7,21.359,21.359,0,0,1,21.5,43Zm0-39.605A18.105,18.105,0,1,0,39.605,21.5,18.126,18.126,0,0,0,21.5,3.394Z"></path><rect width="3" height="20" rx="1.5" transform="translate(33.904 35.858) rotate(-45)"></rect></g></svg>
                    </div>
                    <div class = "menu_search_no_result_right">
                        <div class = "menu_search_no_result_right_title">
                            ...
                        </div>
                        <div class = "menu_search_no_result_right_description">
                            <span></span><br />
                            <span></span><br />
                            <span></span><br />
                            <span></span><br />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class = "search_contents_right">
            <!-- html -->
        </div>
    </div>
</div>