<!DOCTYPE html>

<?php
    include_once('default_function.php');

    if (isset($_GET["lang"])) {
        $_POST["lang"] = $_GET["lang"];
    }

    $defaultMeta = '
        <title>Louibooks</title>
        <meta name = "description" content = "Create and monetise freely on a global platform that\'s free to use, and users can view ad-supported work for free." />
        <meta name = "keywords" content = "Novels, comics, webtoons, monetization, free, free serialization" />
    ';

    $requestURI = $_SERVER['REQUEST_URI'];
    if ((strpos($requestURI, "/work/") !== false && strpos($requestURI, "/workspace/") === false) || strpos($requestURI, "/video/") !== false || strpos($requestURI, "/novel/") !== false || strpos($requestURI, "/image_format/") !== false || strpos($requestURI, "/user/") !== false) {
        $isMeta = false;

        $workNumber = (int) str_replace("/work/", "", $requestURI);
        if (is_int($workNumber)) {
            $workInfo = getWorkInfo($workNumber)[0];

            if ($workInfo["status"] == 0) {
                $stmt = $pdo->prepare("SELECT tag FROM works WHERE number = :number");
                $stmt->execute(array(
                    'number' => $workInfo["number"]
                ));
                $works = $stmt->fetch();

                //현지화 정보
                $workLocalization = null;
                if (isset($_POST["lang"])) {
                    $stmt = $pdo->prepare("SELECT tag FROM work_localization WHERE number = :number AND language = :language");
                    $stmt->execute(array(
                        'number' => $workInfo["number"],
                        'language' => $_POST["lang"]
                    ));
                    $workLocalization = $stmt->fetch();
                }

                $keywords = array();
                if ($workLocalization != null) {
                    if (isset($workLocalization["tag"])) {
                        $keywords = explode(",", $workLocalization["tag"]);
                    }
                } else {
                    if (isset($works["tag"])) {
                        $keywords = explode(",", $works["tag"]);
                    }
                }

                $title = $workInfo["title"];
                $title .= " - Louibooks";
                $description = $workInfo["description"];

                echo '
                    <title>' . $title . '</title>
                    <meta name = "description" content = "' . $description . '" />
                    <meta name = "keywords" content = "' . implode(",", $keywords) . '" />
                    <meta name = "author" content = "' . $workInfo["originator"]["nickname"] . '" />

                    <meta property = "og:type" content = "artwork" />
                    <meta property = "og:title" content = "' . $title . '" />
                    <meta property = "og:description" content = "' . $description . '" />
                    <meta property = "og:image" content = "' . $workInfo["cover_image"] . '" />
                    <meta property = "og:image:width" content = "600" />
                    <meta property = "og:image:height" content = "900" />
                ';

                $isMeta = true;
            }
        }
        //비디오 정보
        $partNumber = (int) str_replace("/video/", "", $requestURI);
        if (is_int($partNumber)) {
            $partInfo = getWorkPartInfo($partNumber)[0];

            if ($partInfo["status"] == 0) {
                $workInfo = getWorkInfo($partInfo["work_number"])[0];
                $title = $partInfo["title"];
                $title .= " - Louibooks";

                echo '
                    <title>' . $title . '</title>
                    <meta name = "author" content = "' . $workInfo["originator"]["nickname"] . '" />

                    <meta property = "og:type" content = "video.other">
                    <meta property = "og:video:url" content = "https://louibooks.com/embed/' . $partInfo["number"] . '">
                    <meta property = "og:video:type" content = "text/html">
                    <meta property = "og:video:width" content = "1920">
                    <meta property = "og:video:height" content = "1080">

                    <meta property = "og:title" content = "' . $title . '" />
                    <meta property = "og:image" content = "' . $partInfo["thumbnail_image"] . '" />
                    <meta property = "og:image:width" content = "1920" />
                    <meta property = "og:image:height" content = "1080" />
                ';

                $isMeta = true;
            }
        }
        //소설 회차 정보
        $partNumber = (int) str_replace("/novel/", "", $requestURI);
        if (is_int($partNumber)) {
            $partInfo = getWorkPartInfo($partNumber)[0];

            if ($partInfo["status"] == 0) {
                $workInfo = getWorkInfo($partInfo["work_number"])[0];
                $title = $partInfo["title"];
                $title .= " - Louibooks";

                echo '
                    <title>' . $title . '</title>
                    <meta name = "author" content = "' . $workInfo["originator"]["nickname"] . '" />
                    
                    <meta property = "og:type" content = "article" />
                    <meta property = "og:title" content = "' . $title . '" />
                    
                    <meta property = "og:image" content = "' . $partInfo["thumbnail_image"] . '" />
                    <meta property = "og:image:width" content = "600" />
                    <meta property = "og:image:height" content = "900" />
                ';

                $isMeta = true;
            }
        }
        //이미지 형식 회차 정보
        $partNumber = (int) str_replace("/image_format/", "", $requestURI);
        if (is_int($partNumber)) {
            $partInfo = getWorkPartInfo($partNumber)[0];

            if ($partInfo["status"] == 0) {
                $workInfo = getWorkInfo($partInfo["work_number"])[0];
                $title = $partInfo["title"];
                $title .= " - Louibooks";

                echo '
                    <title>' . $title . '</title>
                    <meta name = "author" content = "' . $workInfo["originator"]["nickname"] . '" />
                    
                    <meta property = "og:type" content = "article" />
                    <meta property = "og:title" content = "' . $title . '" />
                    
                    <meta property = "og:image" content = "' . $partInfo["thumbnail_image"] . '" />
                    <meta property = "og:image:width" content = "600" />
                    <meta property = "og:image:height" content = "900" />
                ';

                $isMeta = true;
            }
        }
        //유저 정보
        $userNumber = (int) str_replace("/user/", "", $requestURI);
        if (is_int($userNumber)) {
            $userInfo = getUserInfo($userNumber)[0];
            if ($userInfo["status"] == 0) {
                $title = $userInfo["nickname"];
                $title .= " - Louibooks";
                $description = $userInfo["description"];

                //프로필 사진
                $stmt = $pdo->prepare("SELECT profile FROM user WHERE number = :number");
                $stmt->execute(array(
                    "number" => $userInfo["number"]
                ));
                $profile = $stmt->fetch();
                $profileUrl = null;
                if (isset($profile[0]) == true) {
                    $profile = json_decode($profile[0], true);
                    if ($profile["type"] == "video") {
                        $profileUrl = $profile["thumbnail"];
                    } else {
                        $profileUrl = $profile["url"];
                    }
                }

                echo '
                    <title>' . $title . '</title>
                    <meta name = "description" content = "' . $description . '" />
                    <meta name = "author" content = "' . $userInfo["nickname"] . '" />

                    <meta property = "og:type" content = "profile" />
                    <meta property = "og:title" content = "' . $title . '" />
                    <meta property = "og:description" content = "' . $description . '" />
                ';
                if ($profileUrl != null) {
                    echo '
                        <meta property = "og:image" content = "' . $profileUrl . '" />
                        <meta property = "og:image:width" content = "600" />
                        <meta property = "og:image:height" content = "600" />
                    ';
                }

                $isMeta = true;
            }
        }
        if ($isMeta == false) {
            echo $defaultMeta;
            echo '<meta property = "og:type" content = "website" />';
            echo '<meta property = "og:image" content = "/IMG/favicon.png" />';
        }
    } else {
        //일반
        if (isset($_GET["lang"])) {
            if ($_GET["lang"] == "ko") {
                echo '<title>루이북스(Louibooks) - 소설이나 웹툰, 만화 등 자유롭게 창작하세요.</title>';
                echo '<meta name = "description" content = "자유 연재 글로벌 플랫폼을 통해 부담없이 창작하고 수익을 창출하세요, 또한 사용자는 광고를 통해 수익화된 작품을 무료로 볼 수 있습니다." />';
                echo '<meta name = "keywords" content = "소설, 만화, 웹툰, 수익 창출, 무료, 자유 연재" />';
            } else if ($_GET["lang"] == "en") {
                echo '<title>Louibooks - Freely create novels, webtoons, comics, etc.</title>';
                echo '<meta name = "description" content = "Create and monetise freely on a global platform that\'s free to use, and users can view ad-supported work for free." />';
                echo '<meta name = "keywords" content = "Novels, comics, webtoons, monetization, free, free serialization" />';
            } else if ($_GET["lang"] == "ja") {
                echo '<title>ルイブックス(Louibooks) - 小説やウェブトゥーン、漫画など自由に創作してください。</title>';
                echo '<meta name = "description" content = "自由連載のグローバルプラットフォームを通じて気軽に創作し、収益化することができます。また、ユーザーは広告を通じて収益化された作品を無料で見ることができます。" />';
                echo '<meta name = "keywords" content = "小説, 漫画, ウェブトゥーン, 収益化, 無料, 自由連載" />';
            } else {
                echo $defaultMeta;
            }
        } else {
            echo $defaultMeta;
        }
        echo '<meta property = "og:type" content = "website" />';
        echo '<meta property = "og:image" content = "/IMG/favicon.png" />';
    }
    //사이트 이름
    echo '<meta property = "og:site_name" content = "Louibooks" />';

    if (isset($_GET["lang"]) == false) {
        $location = getLocation()["country"];
        echo '<meta name = "location" content = "' . $location . '" />';
    }

    //웹사이트 버전 가져오기
    $stmt = $pdo->prepare("SELECT version FROM website");
    $stmt->execute();
    $currentVersion = $stmt->fetch()[0];

    //캐시 시간 (0으로 적지 마삼)
    $cacheTime = 1;

    //로드할 자바스크립트
    $javaScript = array(
        //- 언어 JS
        "/JS/language/language_ko.js",
        "/JS/language/language_en.js",
        "/JS/language/language_ja.js",
        //- 기능 JS
        "/JS/language.js",
        "/JS/main.js",
        "/JS/ripples.js",
        "/JS/more_button.js",
        "/JS/header_more_button.js",
        "/JS/hover_information.js",
        "/JS/popup_contents.js",
        "/JS/hover_help.js",
        "/JS/select_list.js",
        "/JS/string_search.js",
        "/JS/action_message.js",
        "/JS/header.js",
        "/JS/confirm_popup.js",
        "/JS/caret_bar.js",
        "/JS/visible_element.js",
        "/JS/work_element.js",
        "/JS/work_list_element.js",
        "/JS/profile_element.js",
        "/JS/url_rewrite.js",
        "/JS/horizontal_scroll.js",
        "/JS/popup_element.js",
        "/JS/comments.js",
        "/JS/community.js",
        "/JS/horizontal_transform.js",
        "/JS/sidebar.js",
        "/JS/my_work_list.js",
        "/JS/mobile_search.js",
        "/JS/search_auto_complete.js",
        "/JS/my_user_list.js",
        "/JS/notifications_element.js",
        "/JS/ratings.js",
        "/JS/graph_element.js",
        "/JS/full_screen_image.js",
        "/JS/pull_to_refresh.js",
        "/JS/NoSleep.min.js",
        "/JS/payment_history_element.js",
        "/JS/video_player.js",
        //- 메뉴 JS
        "/menu/JS/login.js",
        "/menu/JS/signup.js",
        "/menu/JS/find_password.js",
        "/menu/JS/home.js",
        "/menu/JS/cloud.js",
        "/menu/JS/cloud_drag.js",
        "/menu/JS/novel_editor.js",
        "/menu/JS/work.js",
        "/menu/JS/novel_viewer.js",
        "/menu/JS/image_format_editor.js",
        "/menu/JS/image_format_viewer.js",
        "/menu/JS/community.js",
        "/menu/JS/my_work_list.js",
        "/menu/JS/work_list.js",
        "/menu/JS/history.js",
        "/menu/JS/history/works.js",
        "/menu/JS/history/comments.js",
        "/menu/JS/history/community.js",
        "/menu/JS/history/search_history.js",
        "/menu/JS/history/notifications.js",
        "/menu/JS/history/ratings.js",
        "/menu/JS/history/payment_history.js",
        "/menu/JS/search.js",
        "/menu/JS/library.js",
        "/menu/JS/user.js",
        "/menu/JS/my_user_list.js",
        "/menu/JS/notifications_settings.js",
        "/menu/JS/comment.js",
        "/menu/JS/rating.js",
        "/menu/JS/community_guide.js",
        "/menu/JS/creator_guide.js",
        "/menu/JS/preview_premium_profile.js",
        "/menu/JS/privacy_policy.js",
        "/menu/JS/reviewed_questions.js",
        "/menu/JS/withdrawal.js",
        "/menu/JS/payment_history.js",
        "/menu/JS/explore.js",
        "/menu/JS/video.js",
        "/menu/JS/embed.js",
        "/menu/JS/write_questions.js",
        //- 메뉴 워크스페이스 JS
        "/menu/workspace/JS/main.js",
        "/menu/workspace/JS/my_works.js",
        "/menu/workspace/JS/work/main.js",
        "/menu/workspace/JS/work/details.js",
        "/menu/workspace/JS/work/part_list.js",
        "/menu/workspace/JS/work/comments.js",
        "/menu/workspace/JS/work/community.js",
        "/menu/workspace/JS/work/localization.js",
        "/menu/workspace/JS/work/analysis.js",
        "/menu/workspace/JS/part/main.js",
        "/menu/workspace/JS/part/details.js",
        "/menu/workspace/JS/part/comments.js",
        "/menu/workspace/JS/part/localization.js",
        "/menu/workspace/JS/part/user_translation.js",
        "/menu/workspace/JS/dashboard.js",
        "/menu/workspace/JS/my_page_settings.js",
        "/menu/workspace/JS/monetization.js",
        "/menu/workspace/JS/partner.js",
        //- 메뉴 내 계정 JS
        "/menu/my_account/JS/main.js",
        "/menu/my_account/JS/details.js",
        "/menu/my_account/JS/management.js",
        "/menu/my_account/JS/personal_info.js",
        "/menu/my_account/JS/privacy.js",
        "/menu/my_account/JS/security.js",
        "/menu/my_account/JS/session_list.js",
        "/menu/my_account/JS/two_factor_auth.js",
        //- 메뉴 관리자 JS
        "/menu/admin/JS/main.js",
        "/menu/admin/JS/dashboard.js",
        "/menu/admin/JS/questions.js",
        "/menu/admin/JS/user_report.js",
        "/menu/admin/JS/work_report.js",
        "/menu/admin/JS/monetization_approval.js",
        "/menu/admin/JS/partner_approval.js",
        //- 팝업 콘텐츠 JS
        "/popup_contents/JS/create_work.js",
        "/popup_contents/JS/create_work_add_tag.js",
        "/popup_contents/JS/create_work_add_genre.js",
        "/popup_contents/JS/edit_profile_picture.js",
        "/popup_contents/JS/workspace_work_cover_upload.js",
        "/popup_contents/JS/upload_work_part.js",
        "/popup_contents/JS/work_art_upload.js",
        "/popup_contents/JS/change_chapter_title.js",
        "/popup_contents/JS/community_add_youtube_video.js",
        "/popup_contents/JS/workspace_work_localization_create_language.js",
        "/popup_contents/JS/workspace_part_localization_create_language.js",
        "/popup_contents/JS/buy_premium.js",
        "/popup_contents/JS/change_profile.js",
        "/popup_contents/JS/adult_questions.js",
        "/popup_contents/JS/speech_to_text_search.js",
        "/popup_contents/JS/json_viewer.js",
        "/popup_contents/JS/user_report.js",
        "/popup_contents/JS/work_report.js",
        "/popup_contents/JS/bank_remittance_details.js",
        "/popup_contents/JS/part_user_translation.js",
        "/popup_contents/JS/upload_work_part_video.js",
        "/popup_contents/JS/cancel_payment.js",
        //- 팝업 앨리먼트 JS
        "/popup_element/JS/viewer_part_list.js",
        "/popup_element/JS/image_format_editor_info.js",
        "/popup_element/JS/work_list.js",
        "/popup_element/JS/search_filter.js",
        "/popup_element/JS/notifications.js",
        "/popup_element/JS/my_profile.js",
        "/popup_element/JS/viewer_settings.js",
        //- Work navigation JS
        "/menu/work_navigation/JS/home.js",
        "/menu/work_navigation/JS/part_list.js",
        "/menu/work_navigation/JS/comments.js",
        "/menu/work_navigation/JS/community.js",
        "/menu/work_navigation/JS/details.js",
        "/menu/work_navigation/JS/ratings.js",
        //- User navigation JS
        "/menu/user_navigation/JS/works.js",
        "/menu/user_navigation/JS/community.js",
        "/menu/user_navigation/JS/created_work_list.js",
        //- 탐색 JS
        "/menu/explore/JS/trending.js"
    );

    //압축 관련
    use MatthiasMullie\Minify\JS;

    $htmlCodeJavaScript = apcu_fetch('htmlCodeJavaScript');
    if ($htmlCodeJavaScript == null) {
        $htmlCodeJavaScript = "";
        $isUpdate = true;
        $version = getCache("websiteVersion", "javaScript");
        if ($version != null && $version == $currentVersion) {
            $isUpdate = false;
        } else {
            $version = $currentVersion;
            setCache("websiteVersion", "javaScript", $version);
        }
        foreach ($javaScript as $key => $value) {
            $url = $javaScript[$key];

            //파일 업데이트
            if ($isUpdate == true) {
                //JS 파일 압축
                @mkdir('./min/JS', 0777, true);
                $minifier = new JS("." . $url);
                $minCode = $minifier->minify();
                file_put_contents('./min/JS/' . sha1($url) . '.js', $minCode);
            }

            $url = ('/min/JS/' . sha1($url) . '.js');
            $htmlCodeJavaScript .= '<script src = "' . $url . '" onerror = "javaScriptOrCSSError();"></script>';
        }
        apcu_store('htmlCodeJavaScript', $htmlCodeJavaScript, $cacheTime);
    }

    $cascadingStyleSheets = array(
        "/CSS/color.css",
        "/CSS/main.css",
        "/CSS/header.css",
        "/CSS/more_button.css",
        "/CSS/header_more_button.css",
        "/CSS/hover_information.css",
        "/CSS/popup_contents.css",
        "/CSS/loading.css",
        "/CSS/hover_help.css",
        "/CSS/select_list.css",
        "/CSS/action_message.css",
        "/CSS/mobile_footer.css",
        "/CSS/mobile_more_button.css",
        "/CSS/confirm_popup.css",
        "/CSS/caret_bar.css",
        "/CSS/horizontal_scroll.css",
        "/CSS/horizontal_transform.css",
        "/CSS/popup_element.css",
        "/CSS/picker_monolith.css",
        "/CSS/comments.css",
        "/CSS/community.css",
        "/CSS/work_element.css",
        "/CSS/work_list_element.css",
        "/CSS/my_work_list.css",
        "/CSS/mobile_search.css",
        "/CSS/search_auto_complete.css",
        "/CSS/my_user_list.css",
        "/CSS/notifications_element.css",
        "/CSS/ratings.css",
        "/CSS/graph_element.css",
        "/CSS/full_screen_image.css",
        "/CSS/pull_to_refresh.css",
        "/CSS/payment_history_element.css",
        "/CSS/video_player.css",
        //- 메뉴 CSS
        "/menu/CSS/login.css",
        "/menu/CSS/signup.css",
        "/menu/CSS/other_account.css",
        "/menu/CSS/work.css",
        "/menu/CSS/home.css",
        "/menu/CSS/cloud.css",
        "/menu/CSS/novel_editor.css",
        "/menu/CSS/novel_viewer.css",
        "/menu/CSS/image_format_editor.css",
        "/menu/CSS/image_format_viewer.css",
        "/menu/CSS/community.css",
        "/menu/CSS/my_work_list.css",
        "/menu/CSS/work_list.css",
        "/menu/CSS/history.css",
        "/menu/CSS/search.css",
        "/menu/CSS/library.css",
        "/menu/CSS/user.css",
        "/menu/CSS/my_user_list.css",
        "/menu/CSS/notifications_settings.css",
        "/menu/CSS/comment.css",
        "/menu/CSS/rating.css",
        "/menu/CSS/explore.css",
        "/menu/CSS/community_guide.css",
        "/menu/CSS/creator_guide.css",
        "/menu/CSS/preview_premium_profile.css",
        "/menu/CSS/privacy_policy.css",
        "/menu/CSS/reviewed_questions.css",
        "/menu/CSS/withdrawal.css",
        "/menu/CSS/payment_history.css",
        "/menu/CSS/video.css",
        "/menu/CSS/embed.css",
        "/menu/CSS/write_questions.css",
        //- 워크스페이스 메뉴 CSS
        "/menu/workspace/CSS/dashboard.css",
        "/menu/workspace/CSS/my_works.css",
        "/menu/workspace/CSS/header.css",
        "/menu/workspace/CSS/main.css",
        "/menu/workspace/CSS/my_page_settings.css",
        "/menu/workspace/CSS/monetization.css",
        "/menu/workspace/CSS/partner.css",
        "/menu/workspace/CSS/work/details.css",
        "/menu/workspace/CSS/work/part_list.css",
        "/menu/workspace/CSS/work/localization.css",
        "/menu/workspace/CSS/work/analysis.css",
        "/menu/workspace/CSS/part/details.css",
        "/menu/workspace/CSS/part/comments.css",
        "/menu/workspace/CSS/part/localization.css",
        "/menu/workspace/CSS/part/user_translation.css",
        //- 내 계정 CSS
        "/menu/my_account/CSS/details.css",
        "/menu/my_account/CSS/management.css",
        "/menu/my_account/CSS/personal_info.css",
        "/menu/my_account/CSS/privacy.css",
        "/menu/my_account/CSS/security.css",
        "/menu/my_account/CSS/session_list.css",
        "/menu/my_account/CSS/two_factor_auth.css",
        //- 관리자 메뉴 CSS
        "/menu/admin/CSS/dashboard.css",
        "/menu/admin/CSS/questions.css",
        "/menu/admin/CSS/user_report.css",
        "/menu/admin/CSS/work_report.css",
        "/menu/admin/CSS/monetization_approval.css",
        "/menu/admin/CSS/partner_approval.css",
        //- 팝업 콘텐츠 CSS
        "/popup_contents/CSS/create_work.css",
        "/popup_contents/CSS/create_work_add_genre.css",
        "/popup_contents/CSS/edit_profile_picture.css",
        "/popup_contents/CSS/workspace_work_cover_upload.css",
        "/popup_contents/CSS/upload_work_part.css",
        "/popup_contents/CSS/work_art_upload.css",
        "/popup_contents/CSS/community_add_youtube_video.css",
        "/popup_contents/CSS/buy_premium.css",
        "/popup_contents/CSS/change_profile.css",
        "/popup_contents/CSS/adult_questions.css",
        "/popup_contents/CSS/speech_to_text_search.css",
        "/popup_contents/CSS/json_viewer.css",
        "/popup_contents/CSS/user_report.css",
        "/popup_contents/CSS/work_report.css",
        "/popup_contents/CSS/bank_remittance_details.css",
        "/popup_contents/CSS/part_user_translation.css",
        "/popup_contents/CSS/upload_work_part_video.css",
        "/popup_contents/CSS/cancel_payment.css",
        //- 팝업 앨리먼트 JS
        "/popup_element/CSS/viewer_part_list.css",
        "/popup_element/CSS/image_format_editor_info.css",
        "/popup_element/CSS/work_list.css",
        "/popup_element/CSS/search_filter.css",
        "/popup_element/CSS/notifications.css",
        "/popup_element/CSS/my_profile.css",
        "/popup_element/CSS/viewer_settings.css",
        //- Work navigation CSS
        "/menu/work_navigation/CSS/details.css",
        //- User navigation CSS
        "/menu/user_navigation/CSS/works.css",
        "/menu/user_navigation/CSS/created_work_list.css",
        "/menu/explore/CSS/trending.css",
        //- 탐색 CSS
        "/menu/explore/CSS/fantasy.css"
    );
    
    //압축 관련
    use MatthiasMullie\Minify\CSS;

    $htmlCodeCSS = apcu_fetch('htmlCodeCSS');
    if ($htmlCodeCSS == null) {
        $htmlCodeCSS = "";
        $isUpdate = true;
        $version = getCache("websiteVersion", "cascadingStyleSheets");
        if ($version != null && $version == $currentVersion) {
            $isUpdate = false;
        } else {
            $version = $currentVersion;
            setCache("websiteVersion", "cascadingStyleSheets", $version);
        }
        foreach ($cascadingStyleSheets as $key => $value) {
            $url = $cascadingStyleSheets[$key];

            //파일 업데이트
            if ($isUpdate == true) {
                //CSS 파일 압축
                @mkdir('./min/CSS', 0777, true);
                $minifier = new CSS("." . $url);
                $minCode = $minifier->minify();
                file_put_contents('./min/CSS/' . sha1($url) . '.css', $minCode);
            }

            $url = ('/min/CSS/' . sha1($url) . '.css');
            $htmlCodeCSS .= '<link rel = "stylesheet" href = "' . $url . '" onerror = "javaScriptOrCSSError();">';
        }
        apcu_store('htmlCodeCSS', $htmlCodeCSS, $cacheTime);
    }

?>

<html>
    <head>
        <meta charset="UTF-8">
        <meta name = "viewport" content = "width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1, user-scalable=no">
        <link rel = "icon" href = "/IMG/favicon.png">
        <meta name = "theme-color" content = "#000000">

        <script>
            function javaScriptOrCSSError() {
                function callback() {
                    let menuNumber = getCurrentMenuNumber();
                    let menuName = getCurrentMenuName();
                    let contents = document.getElementById("contents_" + menuNumber);
                    if (contents != null) {
                        let errorCode = contents.getElementsByClassName("menu_error_page");
                        if (errorCode.length == 0 || errorCode[0].getAttribute("code") != -2) {
                            let html = getMenuErrorHTML(-2);
                            menuHTML(menuNumber, menuName, html);
                        }
                    }
                    window.requestAnimationFrame(callback);
                }
                window.requestAnimationFrame(callback);
            }
        </script>
        <?php echo $htmlCodeJavaScript; ?>
        <?php echo $htmlCodeCSS; ?>

        <!-- CODELAB: Add link rel manifest -->
        <link rel = "manifest" href = "/manifest.json">

        <!-- 구글 애드센스 -->
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9109662775581995"
            crossorigin="anonymous"></script>

        <!-- Tosspayments 결제 -->
        <script async src = "https://js.tosspayments.com/v1/payment"></script>
    </head>

    <script>

        function asyncFontLoad(url) {
            let link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            document.head.appendChild(link);
        }
        //Pretendard
        asyncFontLoad("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.5/dist/web/static/pretendard.css");
        //SpoqaHanSansNeo
        asyncFontLoad("//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css");

        //익스플로러 작동 안함 리다이렉트
        if(/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
            window.location = 'microsoft-edge:' + window.location;
            function callback() {
                window.location = 'https://go.microsoft.com/fwlink/?linkid=2135547';
            }
            window.requestAnimationFrame(callback);
        }

    </script>

    <body>

        <div id = "variable_element_box" style = "visibility: hidden; height: 0px;"></div>

        <!-- 초기 로드 -->
        <div class = "site_loading">
            <!-- svg -->
        </div>
        <!-- 로딩 바 -->
        <div class = "loading_bar">
            <div class = "loading_bar_progress"></div>
        </div>
        <!-- 스핀 로딩 바 -->
        <div class = "spin_loading_bar">
            <div class="showbox"><div class="loader" style="width: 40px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle></svg></div></div>
        </div>
        <!-- 당겨서 새로고침 -->
        <div class = "pull_to_refresh">
            <div class = "pull_to_refresh_box">
                <div class = "pull_to_refresh_box_icon">
                    <canvas></canvas>
                </div>
                <div class = "pull_to_refresh_box_loading">
                    <div class="showbox"><div class="loader" style="width: 25px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle></svg></div></div>
                </div>
            </div>
        </div>
        <!-- 커서 -->
        <div class = "caret_bar"></div>
        <!-- 행동 팝업 -->
        <div class = "action_message">
            <div class = "action_message_box">
                <!-- text -->
                <div class = "action_message_box_text">
                    ...
                </div>
                <div class = "action_message_box_undo md-ripples">
                    ...
                </div>
            </div>
        </div>
        <!-- 모바일 검색 -->
        <div class = "mobile_search">
            <div class = "mobile_search_box">
                <div class = "mobile_search_box_contents">
                    <div class = "mobile_search_box_top">
                        <div class = "header_search_left md-ripples" onclick = "history.back();" onmouseenter = "hoverInformation(this, getLanguage('back'));">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"/><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"/></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"/></g></svg>
                        </div>
                        <div class = "header_search_center">
                            <div class = "header_search" style = "width: calc(100% - 10px); max-width: unset; margin-right: 10px;">
                                <div class = "header_search_wrap_left">
                                    <input id = "header_search_input_mobile" type = "search" placeholder = "..." onfocus = "mobileSearchInputFocus(this);" onkeydown = "checkSearchInput(this); checkValueMobileSearch(this); if (window.event.keyCode == 13) { mobileSearch(this.value); }">
                                    <div class = "header_search_remove_all_texts hide_header_search_remove_all_texts">
                                        <div class = "header_search_remove_all_texts_box md-ripples" onclick = "searchRemoveAllTexts(this);" onmouseenter = "hoverInformation(this, getLanguage('search_clear'));">
                                            <!-- Generated by IcoMoon.io -->
                                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path></svg>
                                        </div>
                                    </div>
                                    <div class = "header_search_icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M21.5,43A21.5,21.5,0,0,1,6.3,6.3,21.5,21.5,0,1,1,36.7,36.7,21.359,21.359,0,0,1,21.5,43Zm0-39.605A18.105,18.105,0,1,0,39.605,21.5,18.126,18.126,0,0,0,21.5,3.394Z"/><rect width="3" height="20" rx="1.5" transform="translate(33.904 35.858) rotate(-45)"/></g></svg>
                                    </div>
                                </div>
                                <div class = "header_search_wrap_right md-ripples" onclick = "openPopupContents('speech_to_text_search', null, true);" onmouseenter = "hoverInformation(this, getLanguage('header_search_stt_button'));">
                                    <!-- Generated by IcoMoon.io -->
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.297 11.016h1.688q0 2.531-1.758 4.43t-4.242 2.273v3.281h-1.969v-3.281q-2.484-0.375-4.242-2.273t-1.758-4.43h1.688q0 2.203 1.57 3.633t3.727 1.43 3.727-1.43 1.57-3.633zM12 14.016q-1.219 0-2.109-0.891t-0.891-2.109v-6q0-1.219 0.891-2.109t2.109-0.891 2.109 0.891 0.891 2.109v6q0 1.219-0.891 2.109t-2.109 0.891z"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class = "mobile_search_box_auto_complete scroll">
                        <div class = "search_auto_complete_box_items search_auto_complete_screen_keyboard">
                            <!-- item -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class = "full_screen_image">
            <div class = "full_screen_image_back md-ripples" onclick = "history.back();" onmouseenter = "hoverInformation(this, getLanguage('back'));">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"></rect><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"></rect></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"></rect></g></svg>
            </div>
            <div class = "full_screen_image_left">
                <div class = "full_screen_image_button md-ripples" onclick = "moveFullScreenImage('left');">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.707 17.293l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-6 6c-0.391 0.391-0.391 1.024 0 1.414l6 6c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"></path></svg>
                </div>
            </div>
            <div class = "full_screen_image_items" item_count = "0" current_order = "1" ontouchstart = "touchStartFullScreenImage();" onmousedown = "touchStartFullScreenImage();">
                <!-- item -->
            </div>
            <div class = "full_screen_image_right">
                <div class = "full_screen_image_button md-ripples" onclick = "moveFullScreenImage('right');">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9.707 18.707l6-6c0.391-0.391 0.391-1.024 0-1.414l-6-6c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z"></path></svg>
                </div>
            </div>
        </div>
        <div class = "add_comments_virtual_keyboard" onclick = "hideAddCommentsVirtualKeyboard();">
            <div class = "add_comments_virtual_keyboard_box" onclick = "isNotHideAddCommentsVirtualKeyboard = true;">
                <!-- html -->
            </div>
        </div>
        <!-- 팝업 콘텐츠 -->
        <div class = "header_popup" onclick = "hideHeaderPopup();">
            <div class = "header_popup_box scroll" onclick = "isHideHeaderPopupCancel = true;">
                <!-- html -->
            </div>
        </div>
        <!-- 팝업 콘텐츠 -->
        <div class = "popup_contents">
            <div class = "popup_contents_box scroll">
                <div class = "popup_contents_box_html">
                    <!-- html -->
                </div>
                <div class = "popup_contents_box_loading">
                    <!-- 로딩 스피너 -->
                    <div class="showbox">
                        <div class="loader" style = "width: 40px;"><svg class="circular" viewBox="25 25 50 50"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/></svg></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 팝업 콘텐츠 -->
        <div class = "popup_element" style = "background-color: transparent;" onclick = "hidePopupElement();">
            <div class = "popup_element_box scroll" ontouchstart = "popupElementBoxTouchStart(event);" onclick = "isHidePopupElementCancel = true;">
                <!-- html -->
            </div>
        </div>
        <!-- 모바일 더보기 버튼 -->
        <div class = "mobile_more_button" onclick = "closeMoreButton(event);" onmousedown = "isCancelSearchInputBlur = true;">
            <div class = "mobile_more_button_box scroll">
                <!-- item -->
            </div>
        </div>
        <!-- 선택 리스트 -->
        <div class = "select_list">
            <div class = "select_list_box scroll">
                <!-- item -->
            </div>
        </div>
        <!-- create_work_add_genre - 선택 리스트 -->
        <div class = "create_work_add_genre">
            <div class = "create_work_add_genre_box scroll" onclick = "createWorkAddGenreCloseCancel = true;">
                <div class = "create_work_add_genre_box_search">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M21.5,43A21.5,21.5,0,0,1,6.3,6.3,21.5,21.5,0,1,1,36.7,36.7,21.359,21.359,0,0,1,21.5,43Zm0-39.605A18.105,18.105,0,1,0,39.605,21.5,18.126,18.126,0,0,0,21.5,3.394Z"></path><rect width="3" height="20" rx="1.5" transform="translate(33.904 35.858) rotate(-45)"></rect></g></svg>
                    <input type = "text" placeholder = "..." id = "create_work_add_genre_box_search_input" onkeydown = "setTimeout(() => { createWorkAddGenreSearch(); }, 1);">
                </div>
                <div id = "create_work_add_genre_box_contents">
                    <!-- item -->
                </div>
            </div>
        </div>
        <!-- 더보기 버튼 -->
        <div class = "more_button" onclick = "closeMoreButton(event);" onmousedown = "isCancelSearchInputBlur = true;">
            <div class = "more_button_box">
                <!-- item -->
            </div>
        </div>
        <!-- 헤더 더보기 -->
        <div class = "header_more_button" onclick = "closeHeaderMoreButton(event);">
            <div class = "header_more_button_box">
                <!-- item -->
            </div>
        </div>
        <!-- 마우스 갖다 대어 정보 -->
        <div class = "hover_information">
            <div class = "hover_information_box">
                <!-- text -->
            </div>
        </div>
        <!-- 마우스 갖다 도움말 -->
        <div class = "hover_help">
            <div class = "hover_help_box">
                <!-- text -->
            </div>
        </div>
        <div class = "image_format_editor_upload_loading">
            <div class = "image_format_editor_upload_loading_box scroll">
                <!-- html -->
            </div>
        </div>
        <div class = "image_format_editor_popup" onclick = "imageFormatEditorPopupClose();">
            <div class = "image_format_editor_popup_box" onclick = "isCancelImageFormatEditorPopupClose = true;">
                <div class = "image_format_editor_popup_box_items scroll">
                    <!-- items -->
                </div>
                <div class = "image_format_editor_popup_box_upload md-ripples" onclick = "imageFormatUploadButton();">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 13h6v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6h6c0.552 0 1-0.448 1-1s-0.448-1-1-1h-6v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v6h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path></svg>
                </div>
            </div>
        </div>
        <!-- 확인 창 -->
        <div class = "confirm_popup" onclick = "isHidePopupElementCancel = true;">
            <div class = "confirm_popup_box scroll">
                <div class = "confirm_popup_box_title">
                    <!-- 제목 -->
                </div>
                <div class = "confirm_popup_box_subject">
                    <!-- 본문 -->
                </div>
                <div class = "confirm_popup_box_bottom">
                    <div class = "confirm_popup_box_bottom_items">
                        <div class = "confirm_popup_box_bottom_item md-ripples" type = "cancel" onclick = "history.back();">
                            <!-- 취소 -->
                        </div>
                        <div class = "confirm_popup_box_bottom_item md-ripples" type = "confirm">
                            <!-- 계속 -->
                        </div>
                    </div>
                </div>
                <div style = "width: 400px;"></div>
            </div>
        </div>

        <!-- 헤더 -->
        <header>
            <div id = "wrap_header_default" style = "width: 100%;" onclick = "isHeaderSearchClick = true;">
                <div id = "header_default">
                    <div class = "header_left">
                        <div class = "header_left_sidebar_button">
                            <div class = "header_left_sidebar_button_icon md-ripples" onclick = "showHeaderPopup();" onmouseenter = "hoverInformation(this, getLanguage('tablist'));">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 64 64"><defs><clipPath id="clip-SPRK_default_preset_name_custom_1"><rect width="64" height="64"/></clipPath></defs><g id="SPRK_default_preset_name_custom_1" data-name="SPRK_default_preset_name_custom – 1" class="cls-1"><rect id="사각형_1" data-name="사각형 1" width="40" height="3" transform="translate(12 16)"/><rect id="사각형_2" data-name="사각형 2" width="40" height="3" transform="translate(12 31)"/><rect id="사각형_3" data-name="사각형 3" width="40" height="3" transform="translate(12 46)"/></g></svg>
                            </div>
                        </div>
                        <div class = "header_left_sidebar_refresh">
                            <div class = "header_left_sidebar_refresh_icon md-ripples" onclick = "refreshCurrentMenu();" onmouseenter = "hoverInformation(this, getLanguage('header_more_button:menu_refresh'));">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"> <defs> <clipPath id="clip-reload"> <rect width="50" height="50"></rect> </clipPath> </defs> <g id="reload" clip-path="url(#clip-reload)"> <path id="빼기_30" data-name="빼기 30" d="M-2615,50a24.844,24.844,0,0,1-9.731-1.965,24.917,24.917,0,0,1-7.947-5.358,24.922,24.922,0,0,1-5.358-7.947A24.844,24.844,0,0,1-2640,25a24.844,24.844,0,0,1,1.965-9.731,24.922,24.922,0,0,1,5.358-7.947,24.917,24.917,0,0,1,7.947-5.358A24.844,24.844,0,0,1-2615,0a24.835,24.835,0,0,1,14.413,4.571,24.948,24.948,0,0,1,9.019,11.7l-.1,1.04h-2.71A22.1,22.1,0,0,0-2615,3a22.025,22.025,0,0,0-22,22,22.025,22.025,0,0,0,22,22,22.03,22.03,0,0,0,21.244-16.264h3.094a24.808,24.808,0,0,1-3.232,7.669,25.065,25.065,0,0,1-5.471,6.1,24.9,24.9,0,0,1-7.2,4.034A24.932,24.932,0,0,1-2615,50Z" transform="translate(2640)"></path> <g id="그룹_29" data-name="그룹 29" transform="translate(0 1)"> <rect id="사각형_65" data-name="사각형 65" width="3" height="14" rx="1.5" transform="translate(47 5)"></rect> <rect id="사각형_66" data-name="사각형 66" width="3" height="14" rx="1.5" transform="translate(35.892 19) rotate(-90)"></rect> </g> </g> </svg>
                            </div>
                        </div>
                        <div class = "header_left_logo" onclick = "deleteAllMenu();">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 453 100"><defs><clipPath id="b"><rect width="453" height="100"/></clipPath></defs><g id="a" clip-path="url(#b)"><text transform="translate(108 73)" font-size="65" font-family="Pretendard Variable" font-weight="800" letter-spacing="-0.05em"><tspan x="0" y="0">LOUI</tspan><tspan y="0" font-weight="700">BOOKS</tspan></text><g transform="translate(-21.608 -15.697)"><path d="M1935.333,67.426V18.19s-43.321,2.874-43.321,49.236V110.4h43.321c47.9,0,46.118-42.97,46.118-42.97Z" transform="translate(-1866.534 1.376)" fill="#74b5ff"/><path d="M1893.382,115.69a3.87,3.87,0,0,1-3.87-3.87V68.8c0-11.284,2.462-21.122,7.318-29.239a46.6,46.6,0,0,1,16.218-16.081,57.267,57.267,0,0,1,23.4-7.777,3.87,3.87,0,0,1,4.126,3.861V64.926h42.249a3.87,3.87,0,0,1,3.866,3.709,48.546,48.546,0,0,1-1.243,11.449,50.117,50.117,0,0,1-3.644,10.684,42.243,42.243,0,0,1-7.62,11.116,41.635,41.635,0,0,1-14.823,9.846,61.336,61.336,0,0,1-22.655,3.9h-42.665A3.893,3.893,0,0,1,1893.382,115.69Zm3.87-7.794H1936.7c13.924,0,24.655-3.825,31.893-11.369,7.709-8.035,9.7-18.415,10.2-23.861H1936.7a3.87,3.87,0,0,1-3.87-3.87V24.056a50.767,50.767,0,0,0-16.039,6.2c-12.968,7.913-19.543,20.88-19.543,38.541Z" transform="translate(-1867.904 0.006)"/></g></g></svg>
                        </div>
                        <div class="header_left_alpha">...</div>
                    </div>
                    <div class = "header_center">
                        <div class = "header_search">
                            <div class = "header_search_wrap_left">
                                <input type = "search" placeholder = "..." onfocus = "searchInputFocus(this);" onkeydown = "checkSearchInput(this); changeValueSearchInput(this); if (window.event.keyCode == 13) { pcSearch(this.value); }" onmousedown = "isCancelSearchInputBlur = true;">
                                <div class = "header_search_remove_all_texts hide_header_search_remove_all_texts">
                                    <div class = "header_search_remove_all_texts_box md-ripples" onclick = "searchRemoveAllTexts(this);" onmouseenter = "hoverInformation(this, getLanguage('search_clear'));" onmousedown = "isCancelSearchInputBlur = true;">
                                        <!-- Generated by IcoMoon.io -->
                                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path></svg>
                                    </div>
                                </div>
                                <div class = "header_search_auto_complete blur_header_search_auto_complete hide_header_search_auto_complete" onmousedown = "isCancelSearchInputBlur = true;">
                                    <div class = "header_search_auto_complete_box scroll" style = "padding: 10px 0px;">
                                        <div class = "search_auto_complete_box_items">
                                            <!-- item -->
                                        </div>
                                    </div>
                                </div>
                                <div class = "header_search_icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M21.5,43A21.5,21.5,0,0,1,6.3,6.3,21.5,21.5,0,1,1,36.7,36.7,21.359,21.359,0,0,1,21.5,43Zm0-39.605A18.105,18.105,0,1,0,39.605,21.5,18.126,18.126,0,0,0,21.5,3.394Z"/><rect width="3" height="20" rx="1.5" transform="translate(33.904 35.858) rotate(-45)"/></g></svg>
                                </div>
                            </div>
                            <div class = "header_search_wrap_right md-ripples" onclick = "openPopupContents('speech_to_text_search');" onmouseenter = "hoverInformation(this, getLanguage('header_search_stt_button'));">
                                <!-- Generated by IcoMoon.io -->
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.297 11.016h1.688q0 2.531-1.758 4.43t-4.242 2.273v3.281h-1.969v-3.281q-2.484-0.375-4.242-2.273t-1.758-4.43h1.688q0 2.203 1.57 3.633t3.727 1.43 3.727-1.43 1.57-3.633zM12 14.016q-1.219 0-2.109-0.891t-0.891-2.109v-6q0-1.219 0.891-2.109t2.109-0.891 2.109 0.891 0.891 2.109v6q0 1.219-0.891 2.109t-2.109 0.891z"></path></svg>
                            </div>
                        </div>
                    </div>
                    <div class = "header_right">
                        <div id = "header_search_button" style = "display: none;" class = "header_right_button md-ripples" onclick = "mobileSearchButton();" onmouseenter = "hoverInformation(this, getLanguage('header_hover:search'));">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M21.5,43A21.5,21.5,0,0,1,6.3,6.3,21.5,21.5,0,1,1,36.7,36.7,21.359,21.359,0,0,1,21.5,43Zm0-39.605A18.105,18.105,0,1,0,39.605,21.5,18.126,18.126,0,0,0,21.5,3.394Z"/><rect width="3" height="20" rx="1.5" transform="translate(33.904 35.858) rotate(-45)"/></g></svg>
                        </div>
                        <div name = "header_profile" style = "display: flex; align-items: center;"></div>
                    </div>
                </div>
                <div id = "header_search" style = "display: none;">
                    <div class = "header_search_left md-ripples" onclick = "headerSearchBack();" onmouseenter = "hoverInformation(this, getLanguage('back'));">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-12.086 -0.24)"><rect width="3" height="35" rx="1.5" transform="translate(36.399 0.479) rotate(45)"/><rect width="3" height="35" rx="1.5" transform="translate(38.521 47.879) rotate(135)"/></g><rect width="49" height="3" rx="1.5" transform="translate(1 23.5)"/></g></svg>
                    </div>
                    <div class = "header_search_center">
                        <div class = "header_search" style = "max-width: unset; width: 100%;">
                            <div class = "header_search_wrap_left">
                                <input type = "search" placeholder = "..." onfocus = "searchInputFocus(this);" onkeydown = "checkSearchInput(this); changeValueSearchInput(this); if (window.event.keyCode == 13) { pcSearch(this.value); }" onmousedown = "isCancelSearchInputBlur = true;">
                                <div class = "header_search_remove_all_texts hide_header_search_remove_all_texts">
                                    <div class = "header_search_remove_all_texts_box md-ripples" onclick = "searchRemoveAllTexts(this);" onmouseenter = "hoverInformation(this, getLanguage('search_clear'));" onmousedown = "isCancelSearchInputBlur = true;">
                                        <!-- Generated by IcoMoon.io -->
                                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path></svg>
                                    </div>
                                </div>
                                <div class = "header_search_auto_complete blur_header_search_auto_complete hide_header_search_auto_complete" onmousedown = "isCancelSearchInputBlur = true;">
                                    <div class = "header_search_auto_complete_box scroll" style = "padding: 10px 0px;">
                                        <div class = "search_auto_complete_box_items">
                                            <!-- item -->
                                        </div>
                                    </div>
                                </div>
                                <div class = "header_search_icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M21.5,43A21.5,21.5,0,0,1,6.3,6.3,21.5,21.5,0,1,1,36.7,36.7,21.359,21.359,0,0,1,21.5,43Zm0-39.605A18.105,18.105,0,1,0,39.605,21.5,18.126,18.126,0,0,0,21.5,3.394Z"/><rect width="3" height="20" rx="1.5" transform="translate(33.904 35.858) rotate(-45)"/></g></svg>
                                </div>
                            </div>
                            <div class = "header_search_wrap_right md-ripples" onclick = "openPopupContents('speech_to_text_search');" onmouseenter = "hoverInformation(this, getLanguage('header_search_stt_button'));">
                                <!-- Generated by IcoMoon.io -->
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.297 11.016h1.688q0 2.531-1.758 4.43t-4.242 2.273v3.281h-1.969v-3.281q-2.484-0.375-4.242-2.273t-1.758-4.43h1.688q0 2.203 1.57 3.633t3.727 1.43 3.727-1.43 1.57-3.633zM12 14.016q-1.219 0-2.109-0.891t-0.891-2.109v-6q0-1.219 0.891-2.109t2.109-0.891 2.109 0.891 0.891 2.109v6q0 1.219-0.891 2.109t-2.109 0.891z"></path></svg>
                            </div>
                        </div>
                    </div>
                    <div class = "header_search_right">
                        <!-- html -->
                    </div>
                </div>
            </div>
            <!-- 워크스페이스 헤더 -->
            <div id = "wrap_header_workspace" style = "width: 100%; display: none;">
                <div class = "workspace_header">
                    <div class = "header_left">
                        <div class = "header_left_sidebar_button">
                            <div class = "header_left_sidebar_button_icon md-ripples" onclick = "showHeaderPopup();" onmouseenter = "hoverInformation(this, getLanguage('tablist'));">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64" viewBox="0 0 64 64"><defs><clipPath id="clip-SPRK_default_preset_name_custom_1"><rect width="64" height="64"/></clipPath></defs><g id="SPRK_default_preset_name_custom_1" data-name="SPRK_default_preset_name_custom – 1" class="cls-1"><rect id="사각형_1" data-name="사각형 1" width="40" height="3" transform="translate(12 16)"/><rect id="사각형_2" data-name="사각형 2" width="40" height="3" transform="translate(12 31)"/><rect id="사각형_3" data-name="사각형 3" width="40" height="3" transform="translate(12 46)"/></g></svg>
                            </div>
                        </div>
                        <div class = "header_left_sidebar_refresh">
                            <div class = "header_left_sidebar_refresh_icon md-ripples" onclick = "refreshCurrentMenu();" onmouseenter = "hoverInformation(this, getLanguage('header_more_button:menu_refresh'));">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"> <defs> <clipPath id="clip-reload"> <rect width="50" height="50"></rect> </clipPath> </defs> <g id="reload" clip-path="url(#clip-reload)"> <path id="빼기_30" data-name="빼기 30" d="M-2615,50a24.844,24.844,0,0,1-9.731-1.965,24.917,24.917,0,0,1-7.947-5.358,24.922,24.922,0,0,1-5.358-7.947A24.844,24.844,0,0,1-2640,25a24.844,24.844,0,0,1,1.965-9.731,24.922,24.922,0,0,1,5.358-7.947,24.917,24.917,0,0,1,7.947-5.358A24.844,24.844,0,0,1-2615,0a24.835,24.835,0,0,1,14.413,4.571,24.948,24.948,0,0,1,9.019,11.7l-.1,1.04h-2.71A22.1,22.1,0,0,0-2615,3a22.025,22.025,0,0,0-22,22,22.025,22.025,0,0,0,22,22,22.03,22.03,0,0,0,21.244-16.264h3.094a24.808,24.808,0,0,1-3.232,7.669,25.065,25.065,0,0,1-5.471,6.1,24.9,24.9,0,0,1-7.2,4.034A24.932,24.932,0,0,1-2615,50Z" transform="translate(2640)"></path> <g id="그룹_29" data-name="그룹 29" transform="translate(0 1)"> <rect id="사각형_65" data-name="사각형 65" width="3" height="14" rx="1.5" transform="translate(47 5)"></rect> <rect id="사각형_66" data-name="사각형 66" width="3" height="14" rx="1.5" transform="translate(35.892 19) rotate(-90)"></rect> </g> </g> </svg>
                            </div>
                        </div>
                        <div class = "header_left_logo" onclick = "deleteAllMenu();">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 153 50"><defs><clipPath id="b"><rect width="153" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M16,32H0V16A15.987,15.987,0,0,1,16,0V15.04a.961.961,0,0,0,.96.96H32A15.987,15.987,0,0,1,16,32Z" transform="translate(0 9)" fill="#002bff"/><path d="M.338-14.848H3.691L6.183-4.471h.133L9.034-14.848h2.912L14.673-4.44H14.8l2.492-10.408h3.353L16.406,0H13.381l-2.83-9.8h-.113L7.6,0H4.583Zm33.6,7.424a8.748,8.748,0,0,1-.9,4.091A6.323,6.323,0,0,1,30.568-.7,7,7,0,0,1,27,.205,7,7,0,0,1,23.441-.7,6.317,6.317,0,0,1,20.97-3.338a8.756,8.756,0,0,1-.9-4.086,8.779,8.779,0,0,1,.9-4.1,6.283,6.283,0,0,1,2.471-2.63,7.035,7.035,0,0,1,3.563-.9,7.035,7.035,0,0,1,3.563.9,6.283,6.283,0,0,1,2.471,2.63A8.779,8.779,0,0,1,33.936-7.424Zm-3.117,0a6.806,6.806,0,0,0-.467-2.666,3.633,3.633,0,0,0-1.328-1.666A3.58,3.58,0,0,0,27-12.325a3.537,3.537,0,0,0-2,.569,3.708,3.708,0,0,0-1.333,1.666,6.676,6.676,0,0,0-.477,2.666,6.609,6.609,0,0,0,.477,2.651A3.746,3.746,0,0,0,25-3.107a3.573,3.573,0,0,0,2,.584,3.616,3.616,0,0,0,2.02-.584,3.669,3.669,0,0,0,1.328-1.666A6.737,6.737,0,0,0,30.819-7.424Zm4.3-7.424h5.8a6.451,6.451,0,0,1,2.871.59,4.145,4.145,0,0,1,1.825,1.687,5.087,5.087,0,0,1,.625,2.563,4.886,4.886,0,0,1-.631,2.533A4.1,4.1,0,0,1,43.771-5.84a6.832,6.832,0,0,1-2.917.569H36.926V-7.783h3.445a3.946,3.946,0,0,0,1.507-.251,1.846,1.846,0,0,0,.9-.738,2.337,2.337,0,0,0,.3-1.236,2.535,2.535,0,0,0-.3-1.271,1.812,1.812,0,0,0-.907-.779,3.915,3.915,0,0,0-1.512-.256H38.2V0H35.122ZM46.78,0H43.356l-3.6-6.747h3.333Zm.56-14.848h3.076v6.583h.195L56-14.848h3.712L54.169-8.2,59.778,0h-3.7L51.965-6.142l-1.548,1.9V0H47.34Zm21.2,3.907a2.2,2.2,0,0,0-.467-1.169,2.382,2.382,0,0,0-1.061-.738,4.362,4.362,0,0,0-1.518-.246,4.121,4.121,0,0,0-1.569.277,2.391,2.391,0,0,0-1.046.774,1.852,1.852,0,0,0-.369,1.133,1.633,1.633,0,0,0,.774,1.451,6.091,6.091,0,0,0,1.933.784l1.425.379A8.058,8.058,0,0,1,69.715-6.88,3.32,3.32,0,0,1,70.93-4.1a4,4,0,0,1-.651,2.251,4.275,4.275,0,0,1-1.9,1.543,7.242,7.242,0,0,1-2.958.554,7.117,7.117,0,0,1-2.876-.533,4.489,4.489,0,0,1-1.907-1.507,4.373,4.373,0,0,1-.774-2.317h2.256A2.26,2.26,0,0,0,62.635-2.8a2.728,2.728,0,0,0,1.174.8,4.456,4.456,0,0,0,1.6.256,4.551,4.551,0,0,0,1.692-.3,2.693,2.693,0,0,0,1.169-.841,2,2,0,0,0,.42-1.261,1.609,1.609,0,0,0-.349-1.046,2.489,2.489,0,0,0-.954-.7,10.29,10.29,0,0,0-1.5-.5L64.132-6.85a6.6,6.6,0,0,1-2.866-1.471,3.233,3.233,0,0,1-.99-2.466,3.8,3.8,0,0,1,.682-2.235,4.392,4.392,0,0,1,1.887-1.5,6.663,6.663,0,0,1,2.7-.528,6.42,6.42,0,0,1,2.661.528,4.385,4.385,0,0,1,1.835,1.466,3.7,3.7,0,0,1,.682,2.117Zm3.78-3.907h5.291a5.954,5.954,0,0,1,2.84.62A4.108,4.108,0,0,1,82.19-12.52a5.216,5.216,0,0,1,.579,2.492,5.157,5.157,0,0,1-.584,2.481,4.171,4.171,0,0,1-1.743,1.712,5.914,5.914,0,0,1-2.84.625h-3.65V-7.126h3.435A3.7,3.7,0,0,0,79.15-7.5a2.3,2.3,0,0,0,1.015-1.02,3.471,3.471,0,0,0,.328-1.507,3.5,3.5,0,0,0-.328-1.518,2.219,2.219,0,0,0-1.02-1,3.87,3.87,0,0,0-1.769-.359h-2.8V0H72.321ZM81.391,0l5.332-14.848h2.615L94.68,0h-2.41L88.087-12.13h-.123L83.77,0Zm10.49-5.814v1.887H84.17V-5.814Zm13.008-4.194a3.629,3.629,0,0,0-.733-1.61,3.515,3.515,0,0,0-1.354-1.025,4.377,4.377,0,0,0-1.759-.349,4.155,4.155,0,0,0-2.3.651,4.375,4.375,0,0,0-1.589,1.907,7.141,7.141,0,0,0-.579,3.01,7.1,7.1,0,0,0,.579,3.01,4.4,4.4,0,0,0,1.584,1.9,4.194,4.194,0,0,0,2.3.661,4.561,4.561,0,0,0,1.759-.354,3.533,3.533,0,0,0,1.354-1,3.6,3.6,0,0,0,.743-1.574l2.266.01a5.876,5.876,0,0,1-1.072,2.589,5.686,5.686,0,0,1-2.143,1.764,6.627,6.627,0,0,1-2.917.631,6.491,6.491,0,0,1-3.45-.923A6.285,6.285,0,0,1,95.2-3.368a9.031,9.031,0,0,1-.856-4.055,8.986,8.986,0,0,1,.861-4.055,6.318,6.318,0,0,1,2.374-2.651,6.472,6.472,0,0,1,3.44-.923,6.855,6.855,0,0,1,2.881.595,5.48,5.48,0,0,1,2.153,1.738,6.026,6.026,0,0,1,1.1,2.712Zm3.667-4.84h9.321l-.01,1.938h-7.055l-.01,4.522,6.583-.01V-6.47h-6.573l-.01,4.532h7.147V0h-9.393Z" transform="translate(34 33)"/></g></svg>
                        </div>
                    </div>
                    <div class = "header_center"></div>
                    <div class = "header_right">
                        <div name = "header_profile" style = "display: flex; align-items: center;"></div>
                    </div>
                </div>
            </div>
        </header>

        <main>
            <div id = "wrap_sidebar_default">
                <!-- 사이드바 -->
                <div class = "big_sidebar scroll">
                    <div class = "big_sidebar_items">
                        <div name = "big_sidebar_item_home" class = "big_sidebar_item md-ripples" onclick = "loadMenu_home();">
                            <div class = "big_sidebar_item_line"></div>
                            <div class = "big_sidebar_item_icon_0">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M15.341-101.5H.025A1.525,1.525,0,0,1-1.5-103.026v-26.866a1.525,1.525,0,0,1,.447-1.078l22.941-20.083a1.525,1.525,0,0,1,2.156,0L47-130.971a1.525,1.525,0,0,1,.447,1.079v26.865a1.525,1.525,0,0,1-1.525,1.525H30.591a1.525,1.525,0,0,1-1.078-.447,1.525,1.525,0,0,1-.447-1.078v-16.387h-12.2v16.387a1.526,1.526,0,0,1-.447,1.079A1.526,1.526,0,0,1,15.341-101.5ZM1.55-104.552H13.816v-16.387a1.525,1.525,0,0,1,.447-1.078,1.525,1.525,0,0,1,1.078-.447H30.591a1.525,1.525,0,0,1,1.525,1.525v16.387H44.4V-129.26L22.966-147.819,1.55-129.261Z" transform="translate(2.026 151.5)"/></g></svg>
                            </div>
                            <div class = "big_sidebar_item_icon_1">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M15.341-101.5H.025A1.525,1.525,0,0,1-1.5-103.026v-26.866a1.525,1.525,0,0,1,.447-1.078l22.941-20.083a1.525,1.525,0,0,1,2.156,0L47-130.971a1.525,1.525,0,0,1,.447,1.079v26.865a1.525,1.525,0,0,1-1.525,1.525H30.591a1.525,1.525,0,0,1-1.078-.447,1.525,1.525,0,0,1-.447-1.078v-16.387h-12.2v16.387a1.526,1.526,0,0,1-.447,1.079A1.526,1.526,0,0,1,15.341-101.5Z" transform="translate(2.026 151.5)"/></g></svg>
                            </div>
                            <div class = "big_sidebar_item_text">
                                ...
                            </div>
                        </div>
                        <div name = "big_sidebar_item_explore" onclick = "loadMenu_explore();" class = "big_sidebar_item md-ripples">
                            <div class = "big_sidebar_item_line"></div>
                            <div class = "big_sidebar_item_icon_0">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,3a22.007,22.007,0,0,0-8.562,42.272A22.006,22.006,0,0,0,33.562,4.728,21.859,21.859,0,0,0,25,3m0-3A25,25,0,1,1,0,25,25,25,0,0,1,25,0Z"/><path d="M-470.667-100v0L-480-125l9.333-25L-461-125l-9.666,25Zm.167-29a4.505,4.505,0,0,0-4.5,4.5,4.505,4.505,0,0,0,4.5,4.5,4.505,4.505,0,0,0,4.5-4.5A4.505,4.505,0,0,0-470.5-129Z" transform="translate(269.305 446.082) rotate(45)"/></g></svg>
                            </div>
                            <div class = "big_sidebar_item_icon_1">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-335-100a24.837,24.837,0,0,1-9.809-2,24.918,24.918,0,0,1-7.986-5.443l24.513-10.842L-317.44-142.8A24.917,24.917,0,0,1-312-134.809,24.837,24.837,0,0,1-310-125a24.842,24.842,0,0,1-1.965,9.731,24.918,24.918,0,0,1-5.358,7.947,24.918,24.918,0,0,1-7.947,5.358A24.843,24.843,0,0,1-335-100Zm-17.8-7.441A24.85,24.85,0,0,1-360-125a24.842,24.842,0,0,1,1.965-9.731,24.918,24.918,0,0,1,5.358-7.947,24.918,24.918,0,0,1,7.947-5.358A24.843,24.843,0,0,1-335-150a24.85,24.85,0,0,1,17.559,7.2l-24.277,11.078-11.077,24.275Zm17.441-12.708a4.468,4.468,0,0,1-3.182-1.316,4.468,4.468,0,0,1-1.316-3.182,4.47,4.47,0,0,1,1.316-3.182,4.469,4.469,0,0,1,3.182-1.316,4.47,4.47,0,0,1,3.182,1.316,4.506,4.506,0,0,1,0,6.364A4.47,4.47,0,0,1-335.354-120.149Z" transform="translate(360 150)"/></g></svg>
                            </div>
                            <div class = "big_sidebar_item_text">
                                ...
                            </div>
                        </div>
                        <div name = "big_sidebar_item_library" class = "big_sidebar_item md-ripples" onclick = "loadMenu_library();">
                            <div class = "big_sidebar_item_line"></div>
                            <div class = "big_sidebar_item_icon_0">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,22A11,11,0,0,1,3.222,3.222,11,11,0,1,1,18.778,18.778,10.928,10.928,0,0,1,11,22ZM11,3a8,8,0,1,0,8,8A8.009,8.009,0,0,0,11,3Z" transform="translate(14)"/><path d="M29.719,56H19A19,19,0,0,1,0,37V19A19,19,0,0,1,19,0H29.719a19,19,0,0,1,19,19V37a19,19,0,0,1-19,19Zm-11-52.5a16.018,16.018,0,0,0-16,16v18a16.018,16.018,0,0,0,16,16h11a16.018,16.018,0,0,0,16-16v-18a16.018,16.018,0,0,0-16-16Z" transform="translate(1.281 25)"/></g></svg>
                            </div>
                            <div class = "big_sidebar_item_icon_1">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><circle cx="11" cy="11" r="11" transform="translate(14)"/><circle cx="8" cy="8" r="8" transform="translate(17 3)"/><rect width="48.719" height="56" rx="19" transform="translate(1.281 25)"/><rect width="43" height="50" rx="16" transform="translate(4 28.5)"/></g></svg>
                            </div>
                            <div class = "big_sidebar_item_text">
                                ...
                            </div>
                        </div>
                    </div>
                    <div class = "big_sidebar_wrap" type = "my_work_list" style = "display: none;">
                        <div class = "big_sidebar_line"></div>
                        <div class = "big_sidebar_title">
                            ...
                        </div>
                        <div class = "big_sidebar_items" view_more = "false">
                            <div>
                                <!-- item -->
                            </div>
                            <div style = "overflow: hidden;">
                                <!-- item -->
                            </div>
                            <div style = "margin-top: -5px;">
                                <div class = "big_sidebar_item md-ripples" style = "display: none;" onclick = "toggleViewMoreMyWorkListBigSidebar();">
                                    <div style = "display: none; align-items: center;">
                                        <div class = "big_sidebar_item_line"></div>
                                        <!-- Generated by IcoMoon.io -->
                                        <svg style = "fill: var(--color4);" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17.418 6.109c0.272-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-7.908 7.83c-0.27 0.268-0.707 0.268-0.979 0l-7.908-7.83c-0.27-0.268-0.27-0.701 0-0.969s0.709-0.268 0.979 0l7.419 7.141 7.418-7.141z"></path></svg>
                                        <div class = "big_sidebar_item_text">
                                            ...
                                        </div>
                                    </div>
                                    <div style = "display: none; align-items: center;">
                                        <div class = "big_sidebar_item_line"></div>
                                        <!-- Generated by IcoMoon.io -->
                                        <svg style = "fill: var(--color4);" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.582 13.891c-0.272 0.268-0.709 0.268-0.979 0s-0.271-0.701 0-0.969l7.908-7.83c0.27-0.268 0.707-0.268 0.979 0l7.908 7.83c0.27 0.268 0.27 0.701 0 0.969s-0.709 0.268-0.978 0l-7.42-7.141-7.418 7.141z"></path></svg>
                                        <div class = "big_sidebar_item_text">
                                            ...
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class = "big_sidebar_wrap" logout_required = "true" style = "display: none;">
                        <div class = "big_sidebar_line"></div>
                        <div class = "big_sidebar_logout_status">
                            <div class = "big_sidebar_logout_status_title">
                                ...
                            </div>
                            <div class = "big_sidebar_logout_status_description">
                                ...
                            </div>
                            <div class = "big_sidebar_logout_status_button md-ripples" onclick = "loadMenu_login();">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,22A11,11,0,0,1,3.222,3.222,11,11,0,1,1,18.778,18.778,10.928,10.928,0,0,1,11,22ZM11,3a8,8,0,1,0,8,8A8.009,8.009,0,0,0,11,3Z" transform="translate(14)"></path><path d="M29.719,56H19A19,19,0,0,1,0,37V19A19,19,0,0,1,19,0H29.719a19,19,0,0,1,19,19V37a19,19,0,0,1-19,19Zm-11-52.5a16.018,16.018,0,0,0-16,16v18a16.018,16.018,0,0,0,16,16h11a16.018,16.018,0,0,0,16-16v-18a16.018,16.018,0,0,0-16-16Z" transform="translate(1.281 25)"></path></g></svg>
                                <div class = "big_sidebar_logout_status_button_text">
                                    ...
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class = "big_sidebar_wrap" login_required = "true" style = "display: none;">
                        <div class = "big_sidebar_line"></div>
                        <div class = "big_sidebar_items">
                            <div class = "big_sidebar_item md-ripples" name = "big_sidebar_item_history" onclick = "loadMenu_history();">
                                <div class = "big_sidebar_item_line"></div>
                                <div class = "big_sidebar_item_icon_0">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25-20a24.846,24.846,0,0,1-9.731-1.965,24.915,24.915,0,0,1-7.947-5.358,24.915,24.915,0,0,1-5.358-7.947A24.837,24.837,0,0,1,0-45H3A21.852,21.852,0,0,0,9.451-29.451,21.852,21.852,0,0,0,25-23,22.025,22.025,0,0,0,47-45,22.025,22.025,0,0,0,25-67,21.939,21.939,0,0,0,5.407-55H2.08a24.925,24.925,0,0,1,5.242-7.678,24.915,24.915,0,0,1,7.947-5.358A24.831,24.831,0,0,1,25-70a24.831,24.831,0,0,1,9.731,1.965,24.915,24.915,0,0,1,7.947,5.358,24.92,24.92,0,0,1,5.358,7.946A24.839,24.839,0,0,1,50-45a24.837,24.837,0,0,1-1.965,9.731,24.915,24.915,0,0,1-5.358,7.947,24.915,24.915,0,0,1-7.947,5.358A24.846,24.846,0,0,1,25-20Zm9.99-16.451a1.494,1.494,0,0,1-.749-.2L23.877-42.636A1.5,1.5,0,0,1,23-44V-59a1.5,1.5,0,0,1,1.5-1.5A1.5,1.5,0,0,1,26-59v14.126l9.742,5.623a1.5,1.5,0,0,1,.549,2.049A1.506,1.506,0,0,1,34.99-36.451Z" transform="translate(0 70)"/><g transform="translate(-2 4)"><rect width="3" height="12" rx="1.5" transform="translate(2.871 2.017)"/><rect width="3" height="12" rx="1.5" transform="matrix(0.259, 0.966, -0.966, 0.259, 14.462, 8.276)"/></g></g></svg>
                                </div>
                                <div class = "big_sidebar_item_icon_1">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25-20a24.846,24.846,0,0,1-9.731-1.965,24.915,24.915,0,0,1-7.947-5.358,24.915,24.915,0,0,1-5.358-7.947A24.837,24.837,0,0,1,0-45H4a20.859,20.859,0,0,0,6.158,14.842A20.858,20.858,0,0,0,25-24,21.023,21.023,0,0,0,46-45,21.023,21.023,0,0,0,25-66,21.014,21.014,0,0,0,6.537-55H2.08a24.925,24.925,0,0,1,5.242-7.678,24.915,24.915,0,0,1,7.947-5.358A24.831,24.831,0,0,1,25-70a24.831,24.831,0,0,1,9.731,1.965,24.915,24.915,0,0,1,7.947,5.358,24.92,24.92,0,0,1,5.358,7.946A24.839,24.839,0,0,1,50-45a24.837,24.837,0,0,1-1.965,9.731,24.915,24.915,0,0,1-5.358,7.947,24.915,24.915,0,0,1-7.947,5.358A24.846,24.846,0,0,1,25-20Zm8.956-16.768a2,2,0,0,1-1-.268l-9.526-5.5a2,2,0,0,1-.991-1.929V-58.721A1.781,1.781,0,0,1,24.221-60.5,1.781,1.781,0,0,1,26-58.721v13.049L34.959-40.5a1.985,1.985,0,0,1,.932,1.214,1.987,1.987,0,0,1-.2,1.518A2.009,2.009,0,0,1,33.956-36.768Z" transform="translate(0 70)"/><g transform="translate(-2 4)"><rect width="3" height="12" rx="1.5" transform="translate(2.871 2.017)"/><rect width="3" height="12" rx="1.5" transform="matrix(0.259, 0.966, -0.966, 0.259, 14.462, 8.276)"/></g></g></svg>
                                </div>
                                <div class = "big_sidebar_item_text">
                                    ...
                                </div>
                            </div>
                            <div class = "big_sidebar_item md-ripples" name = "big_sidebar_item_notifications_settings" onclick = "loadMenu_notifications_settings();">
                                <div class = "big_sidebar_item_line"></div>
                                <div class = "big_sidebar_item_icon_0">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M42.282,39.4h0l-.226,0H1.251C.557,39.4.2,39.3.065,39.075c-.221-.363.152-1.085.769-2.282,1.4-2.715,4.315-8.364,4.6-18.745a21.434,21.434,0,0,1,1.682-8.6,15.31,15.31,0,0,1,4.146-5.562A17.322,17.322,0,0,1,22.285,0a16.042,16.042,0,0,1,10.5,4.409,18.085,18.085,0,0,1,5.659,13.638c.141,10.246,2.863,15.713,4.326,18.65.617,1.238.989,1.986.755,2.364C43.375,39.3,43,39.4,42.282,39.4ZM22.187,3.026c-6.61,0-13.7,4.015-13.76,15.285a46.872,46.872,0,0,1-2.09,13.2,29.949,29.949,0,0,1-1.958,4.9L39.3,36.4s0,0-.006-.009a27.524,27.524,0,0,1-1.879-4.733,47.874,47.874,0,0,1-2-13.351C35.34,7.268,27.28,3.075,22.217,3.026Z" transform="translate(3.124 0.378)"></path><path d="M6.4,0a6.4,6.4,0,0,1,6.4,6.4H0A6.4,6.4,0,0,1,6.4,0Z" transform="translate(30.704 50) rotate(180)"></path></g></svg>
                                </div>
                                <div class = "big_sidebar_item_icon_1">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M21.026-.544C27.557-.544,37.1,5.2,37.182,17.5c.246,17.883,8.487,21.471,3.614,21.348H.083c-4.466.05,3.6-3.546,4.093-21.348C4.259,3.8,14.021-.544,21.026-.544Z" transform="translate(4.383 0.922)"></path><path d="M16.939-.544c5.739.056,13.127,4.863,13.194,15.285.157,11.479,3.888,18.093,3.888,18.093L-.9,32.84s3.872-7.043,4.048-18.1C3.216,3.138,10.744-.556,16.939-.544Z" transform="translate(8.401 3.948)"></path><path d="M6.4,0a6.4,6.4,0,0,1,6.4,6.4H0A6.4,6.4,0,0,1,6.4,0Z" transform="translate(30.704 50) rotate(180)"></path><path d="M8.583.607a1.307,1.307,0,0,1-.192,1.83A14.28,14.28,0,0,0,4.343,8.372,23.949,23.949,0,0,0,3,17.5a1.5,1.5,0,0,1-3,0S-.171,11.456,1.5,7.282A18.529,18.529,0,0,1,6.6.41,1.731,1.731,0,0,1,8.583.607Z" transform="translate(0.005 0.24)"></path><path d="M.282.61A1.314,1.314,0,0,0,.475,2.45,14.364,14.364,0,0,1,4.546,8.42,24.089,24.089,0,0,1,5.9,17.6a1.509,1.509,0,0,0,3.018,0s.172-6.079-1.509-10.277A18.637,18.637,0,0,0,2.28.411,1.742,1.742,0,0,0,.282.61Z" transform="translate(41.08 0.186)"></path></g></svg>
                                </div>
                                <div class = "big_sidebar_item_text">
                                    ...
                                </div>
                            </div>
                            <div class = "big_sidebar_item md-ripples" name = "big_sidebar_item_my_works" onclick = "loadWorkspace_my_works();">
                                <div class = "big_sidebar_item_line"></div>
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,700a1.5,1.5,0,0,1,.844.26l23.5,16A1.5,1.5,0,0,1,49.4,718.7L25.9,736.2a1.5,1.5,0,0,1-1.792,0L.6,718.7a1.5,1.5,0,0,1,.052-2.443l23.5-16A1.5,1.5,0,0,1,25,700Zm20.915,17.555L25,703.315,4.085,717.555,25,733.13Z" transform="translate(0 -700)"/><path d="M24.953,736.551a1.5,1.5,0,0,1-.9-.3L.6,718.754a1.5,1.5,0,0,1,1.794-2.4l22.558,16.832,22.65-16.834a1.5,1.5,0,1,1,1.789,2.408l-23.547,17.5A1.5,1.5,0,0,1,24.953,736.551Z" transform="translate(0 -686.551)"/></g></svg>
                                <div class = "big_sidebar_item_text">
                                    ...
                                </div>
                            </div>
                            <div class = "big_sidebar_item md-ripples" name = "big_sidebar_item_my_work_list" onclick = "loadMenu_my_work_list();">
                                <div class = "big_sidebar_item_line"></div>
                                <div class = "big_sidebar_item_icon_0">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="37" height="3" rx="1.5" transform="translate(1 2)"/><rect width="37" height="3" rx="1.5" transform="translate(1 18)"/><rect width="20" height="3" rx="1.5" transform="translate(1 34)"/><g transform="translate(2.518 0.541)"><rect width="3" height="17" rx="1.5" transform="translate(23.151 35.438) rotate(-45)"/><rect width="3" height="23" rx="1.5" transform="translate(44.884 26.041) rotate(30)"/></g></g></svg>
                                </div>
                                <div class = "big_sidebar_item_icon_1">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="37" height="4" rx="2" transform="translate(1 1.5)"/><rect width="37" height="4" rx="2" transform="translate(1 17.5)"/><rect width="20" height="4" rx="2" transform="translate(1 34)"/><g transform="translate(2.748 0.965)"><rect width="4.277" height="18" rx="2.138" transform="translate(22.652 35.438) rotate(-45)"/><rect width="4.276" height="23" rx="2.138" transform="translate(44.149 25.903) rotate(30)"/></g></g></svg>
                                </div>
                                <div class = "big_sidebar_item_text">
                                    ...
                                </div>
                            </div>
                            <div class = "big_sidebar_item md-ripples" name = "big_sidebar_item_my_user_list" onclick = "loadMenu_my_user_list();">
                                <div class = "big_sidebar_item_line"></div>
                                <div class = "big_sidebar_item_icon_0">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,22A11,11,0,0,1,3.222,3.222,11,11,0,1,1,18.778,18.778,10.928,10.928,0,0,1,11,22ZM11,3a8,8,0,1,0,8,8A8.009,8.009,0,0,0,11,3Z" transform="translate(14)"/><path d="M29.719,61H19A19,19,0,0,1,0,42V24A19,19,0,0,1,19,5h8.569a18.6,18.6,0,0,0-2.918,3.5H18.719a16.018,16.018,0,0,0-16,16v18a16.018,16.018,0,0,0,16,16h11a16.018,16.018,0,0,0,16-16V36.169a18.429,18.429,0,0,0,3-1.233V42a19,19,0,0,1-19,19Z" transform="translate(1.281 20)"/><g transform="translate(1.849 -0.459)"><rect width="3" height="17" rx="1.5" transform="translate(23.151 35.438) rotate(-45)"/><rect width="3" height="23" rx="1.5" transform="translate(44.884 26.041) rotate(30)"/></g></g></svg>
                                </div>
                                <div class = "big_sidebar_item_icon_1">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,22A11,11,0,0,1,3.222,3.222,11,11,0,1,1,18.778,18.778,10.928,10.928,0,0,1,11,22ZM11,4a7,7,0,1,0,7,7A7.008,7.008,0,0,0,11,4Z" transform="translate(14)"/><path d="M29.719,61H19A19,19,0,0,1,0,42V24A19,19,0,0,1,19,5h8.569a18.573,18.573,0,0,0-3.228,4H19.859a16.018,16.018,0,0,0-16,16V42a16.018,16.018,0,0,0,16,16h10a16.018,16.018,0,0,0,16-16V36.124a18.435,18.435,0,0,0,2.859-1.188V42a19,19,0,0,1-19,19Z" transform="translate(1.281 20)"/><g transform="translate(1.849 -0.459)"><rect width="4" height="17" rx="2" transform="translate(23.151 35.438) rotate(-45)"/><rect width="4" height="23" rx="2" transform="translate(44.018 25.541) rotate(30)"/></g></g></svg>
                                </div>
                                <div class = "big_sidebar_item_text">
                                    ...
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class = "big_sidebar_wrap">
                        <div class = "big_sidebar_line"></div>
                        <div class = "big_sidebar_title" name = "big_sidebar_title_explore">
                            ...
                        </div>
                        <div class = "big_sidebar_items" view_more = "false">
                            <div name = "big_sidebar_item_explore_trending" onclick = "loadMenu_explore_trending();" class = "big_sidebar_item md-ripples">
                                <div class = "big_sidebar_item_line"></div>
                                <!-- Generated by IcoMoon.io -->
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17 7h3.586l-7.086 7.086-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0l-7.5 7.5c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l6.793-6.793 4.293 4.293c0.391 0.391 1.024 0.391 1.414 0l7.793-7.793v3.586c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.136-0.027-0.265-0.076-0.383s-0.121-0.228-0.216-0.323c-0.001-0.001-0.001-0.001-0.002-0.002-0.092-0.092-0.202-0.166-0.323-0.216-0.118-0.049-0.247-0.076-0.383-0.076h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path></svg>
                                <div class = "big_sidebar_item_text">
                                    ...
                                </div>
                            </div>
                            <!--<div name = "big_sidebar_item_explore_fantasy" onclick = "loadMenu_explore_fantasy();" class = "big_sidebar_item md-ripples">
                                <div class = "big_sidebar_item_line"></div>
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="9" height="16.1" rx="2" transform="translate(11.338 31.798) rotate(45)"/><rect width="20.883" height="5" rx="2" transform="translate(12.723 22.01) rotate(45)"/><path d="M4.485-6.846C6.075-6.78,9,5.714,9,7.134v27a2.34,2.34,0,0,1-2,2.571H2a2.34,2.34,0,0,1-2-2.571v-27S2.895-6.912,4.485-6.846Z" transform="translate(41.024 2.612) rotate(45)"/><rect width="9" height="22.1" rx="2" transform="translate(28.009 33.421) rotate(-45)"/><path d="M4.485-6.846C6.075-6.78,9,5.714,9,7.134l-.063,8.123a2.34,2.34,0,0,1-2,2.571h-5a2.34,2.34,0,0,1-2-2.571L0,7.134S2.895-6.912,4.485-6.846Z" transform="translate(5.045 8.726) rotate(-45)"/></g></svg>
                                <div class = "big_sidebar_item_text">
                                    ...
                                </div>
                            </div>
                            <div name = "big_sidebar_item_explore_healing" class = "big_sidebar_item md-ripples">
                                <div class = "big_sidebar_item_line"></div>
                                Generated by IcoMoon.io
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><path d="M20 16h4.766c-0.187 0.203-0.313 0.313-0.344 0.344l-9.734 9.375c-0.187 0.187-0.438 0.281-0.688 0.281s-0.5-0.094-0.688-0.281l-9.75-9.406c-0.031-0.016-0.156-0.125-0.328-0.313h5.766c0.453 0 0.859-0.313 0.969-0.75l1.094-4.391 2.969 10.422c0.125 0.422 0.516 0.719 0.969 0.719v0c0.438 0 0.828-0.297 0.953-0.719l2.281-7.578 0.875 1.75c0.172 0.328 0.516 0.547 0.891 0.547zM28 9.312c0 1.797-0.781 3.437-1.609 4.688h-5.766l-1.734-3.453c-0.172-0.359-0.578-0.578-0.969-0.547-0.422 0.047-0.766 0.313-0.875 0.719l-2.016 6.719-3.063-10.719c-0.125-0.422-0.516-0.719-0.984-0.719-0.453 0-0.844 0.313-0.953 0.75l-1.813 7.25h-6.609c-0.828-1.25-1.609-2.891-1.609-4.688 0-4.578 2.797-7.313 7.469-7.313 2.734 0 5.297 2.156 6.531 3.375 1.234-1.219 3.797-3.375 6.531-3.375 4.672 0 7.469 2.734 7.469 7.313z"></path></svg>
                                <div class = "big_sidebar_item_text">
                                    ...
                                </div>
                            </div>
                            <div name = "big_sidebar_item_explore_horror" class = "big_sidebar_item md-ripples">
                                <div class = "big_sidebar_item_line"></div>
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-97.648,45.935l-.257,0c-.232,0-.459-.014-.674-.028-.5.005-1,.008-1.482.008-12.047,0-18.617-1.564-19.531-4.648-.408-1.376.323-3.046,2.173-4.964a32.5,32.5,0,0,1,5.406-4.278c-.009-.267-.012-.531-.007-.783l.3-17.046a14.4,14.4,0,0,1,4.3-10.055A14.245,14.245,0,0,1-97.362,0l.255,0A14.239,14.239,0,0,1-87.023,4.412,14.391,14.391,0,0,1-82.993,14.7l-.157,9.041c1.609.318,5.523,1.338,7.088,3.916a4.912,4.912,0,0,1,.41,4.073,2.825,2.825,0,0,1-3.021,2.131,12.2,12.2,0,0,1-4.657-1.247,14.418,14.418,0,0,1-4.551,9.466A14.276,14.276,0,0,1-97.648,45.935ZM-90.6,9.967a1.5,1.5,0,0,0-1.5,1.5v9a1.5,1.5,0,0,0,1.5,1.5,1.5,1.5,0,0,0,1.5-1.5v-9A1.5,1.5,0,0,0-90.6,9.967Zm-7,0a1.5,1.5,0,0,0-1.5,1.5v9a1.5,1.5,0,0,0,1.5,1.5,1.5,1.5,0,0,0,1.5-1.5v-9A1.5,1.5,0,0,0-97.6,9.967Z" transform="translate(122.099 2.032)"/></g></svg>
                                <div class = "big_sidebar_item_text">
                                    ...
                                </div>
                            </div>-->
                            <div name = "big_sidebar_item_explore_learn_more" onclick = "(getCurrentMenuName() != 'explore') ? loadMenu_explore() : null;" class = "big_sidebar_item md-ripples">
                                <div class = "big_sidebar_item_line"></div>
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25-10a24.843,24.843,0,0,1-9.731-1.965,24.918,24.918,0,0,1-7.947-5.358,24.918,24.918,0,0,1-5.358-7.947A24.843,24.843,0,0,1,0-35a24.843,24.843,0,0,1,1.965-9.731,24.917,24.917,0,0,1,5.358-7.947,24.918,24.918,0,0,1,7.947-5.358A24.843,24.843,0,0,1,25-60a24.843,24.843,0,0,1,9.731,1.965,24.918,24.918,0,0,1,7.947,5.358,24.918,24.918,0,0,1,5.358,7.947A24.843,24.843,0,0,1,50-35a24.843,24.843,0,0,1-1.965,9.731,24.918,24.918,0,0,1-5.358,7.947,24.918,24.918,0,0,1-7.947,5.358A24.843,24.843,0,0,1,25-10Zm0-47A22.025,22.025,0,0,0,3-35,22.025,22.025,0,0,0,25-13,22.025,22.025,0,0,0,47-35,22.025,22.025,0,0,0,25-57Z" transform="translate(0 60)"></path><path d="M7-15.909v0L0-36.5,7-60l7,23.5L7-15.912Zm0-24.92a4,4,0,0,0-4,4,4.005,4.005,0,0,0,4,4,4,4,0,0,0,4-4A4,4,0,0,0,7-40.829Z" transform="translate(-6.788 46.763) rotate(45)"></path></g></svg>
                                <div class = "big_sidebar_item_text">
                                    ...
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class = "big_sidebar_wrap" type = "my_work_list" style = "display: none;">
                        <div class = "big_sidebar_line"></div>
                        <div class = "big_sidebar_title">
                            ...
                        </div>
                        <div class = "big_sidebar_items" view_more = "false">
                            <div>
                                <!-- item -->
                            </div>
                            <div style = "overflow: hidden;">
                                <!-- item -->
                            </div>
                            <div style = "margin-top: -5px;">
                                <div class = "big_sidebar_item md-ripples" style = "display: none;" onclick = "toggleViewMoreMyWorkListBigSidebar();">
                                    <div style = "display: none; align-items: center;">
                                        <div class = "big_sidebar_item_line"></div>
                                        <!-- Generated by IcoMoon.io -->
                                        <svg style = "fill: var(--color4);" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17.418 6.109c0.272-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-7.908 7.83c-0.27 0.268-0.707 0.268-0.979 0l-7.908-7.83c-0.27-0.268-0.27-0.701 0-0.969s0.709-0.268 0.979 0l7.419 7.141 7.418-7.141z"></path></svg>
                                        <div class = "big_sidebar_item_text">
                                            ...
                                        </div>
                                    </div>
                                    <div style = "display: none; align-items: center;">
                                        <div class = "big_sidebar_item_line"></div>
                                        <!-- Generated by IcoMoon.io -->
                                        <svg style = "fill: var(--color4);" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.582 13.891c-0.272 0.268-0.709 0.268-0.979 0s-0.271-0.701 0-0.969l7.908-7.83c0.27-0.268 0.707-0.268 0.979 0l7.908 7.83c0.27 0.268 0.27 0.701 0 0.969s-0.709 0.268-0.978 0l-7.42-7.141-7.418 7.141z"></path></svg>
                                        <div class = "big_sidebar_item_text">
                                            ...
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class = "big_sidebar_wrap" type = "my_user_list" style = "display: none;">
                        <div class = "big_sidebar_line"></div>
                        <div class = "big_sidebar_title">
                            ...
                        </div>
                        <div class = "big_sidebar_items" view_more = "false">
                            <div>
                                <!-- item -->
                            </div>
                            <div style = "overflow: hidden;">
                                <!-- item -->
                            </div>
                            <div style = "margin-top: -5px;">
                                <div class = "big_sidebar_item md-ripples" style = "display: none;" onclick = "toggleViewMoreMyUserListBigSidebar();">
                                    <div style = "display: none; align-items: center;">
                                        <div class = "big_sidebar_item_line"></div>
                                        <!-- Generated by IcoMoon.io -->
                                        <svg style = "fill: var(--color4);" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17.418 6.109c0.272-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-7.908 7.83c-0.27 0.268-0.707 0.268-0.979 0l-7.908-7.83c-0.27-0.268-0.27-0.701 0-0.969s0.709-0.268 0.979 0l7.419 7.141 7.418-7.141z"></path></svg>
                                        <div class = "big_sidebar_item_text">
                                            ...
                                        </div>
                                    </div>
                                    <div style = "display: none; align-items: center;">
                                        <div class = "big_sidebar_item_line"></div>
                                        <!-- Generated by IcoMoon.io -->
                                        <svg style = "fill: var(--color4);" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.582 13.891c-0.272 0.268-0.709 0.268-0.979 0s-0.271-0.701 0-0.969l7.908-7.83c0.27-0.268 0.707-0.268 0.979 0l7.908 7.83c0.27 0.268 0.27 0.701 0 0.969s-0.709 0.268-0.978 0l-7.42-7.141-7.418 7.141z"></path></svg>
                                        <div class = "big_sidebar_item_text">
                                            ...
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class = "big_sidebar_wrap">
                        <div class = "big_sidebar_line"></div>
                        <div class = "big_sidebar_items">
                            <div class = "big_sidebar_item md-ripples" name = "big_sidebar_item_write_questions" onclick = "(getCurrentMenuName() != 'write_questions') ? loadMenu_write_questions() : null;">
                                <div class = "big_sidebar_item_line"></div>
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,50A25.007,25.007,0,0,1,15.269,1.965,25.007,25.007,0,0,1,34.731,48.036,24.843,24.843,0,0,1,25,50ZM25,3A22,22,0,1,0,47,25,22.025,22.025,0,0,0,25,3Z"></path><g transform="translate(-24 6)"><rect width="3" height="24" rx="1.5" transform="translate(48 11)"></rect><rect width="3" height="4" rx="1.5" transform="translate(48 3)"></rect></g></g></svg>
                                <div class = "big_sidebar_item_text">
                                    ...
                                </div>
                            </div>
                            <div class = "big_sidebar_item md-ripples" name = "big_sidebar_item_privacy_policy" onclick = "loadMenu_privacy_policy();">
                                <div class = "big_sidebar_item_line"></div>
                                <div class = "big_sidebar_item_icon_0">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-1060.834,48.451a24.982,24.982,0,0,1-9.851-5.358,28.206,28.206,0,0,1-5.826-7.3A31.93,31.93,0,0,1-1080,26.576V7.411L-1060.834,0l19.524,8.024V26.576a21.064,21.064,0,0,1-3.676,9.973,29.222,29.222,0,0,1-6.642,6.791,38.884,38.884,0,0,1-9.206,5.111Zm.237-45.077h0l-16.489,6.133V26.32c2.587,8.765,6.933,13.468,10.123,15.869a16.8,16.8,0,0,0,6.366,3.143,43.062,43.062,0,0,0,8.04-5.156c3.682-3.014,8.1-7.864,8.231-13.857.253-11.486,0-16.155,0-16.2L-1060.6,3.373Z" transform="translate(1085.598 0.664)"/></g></svg>
                                </div>
                                <div class = "big_sidebar_item_icon_1">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M1105,2.392l-17.756,6.777V24.982s.83,16.876,17.756,22.656c0,0,18.056-7.375,18.122-21.926s0-16.012,0-16.012Z" transform="translate(-1080.198 -0.015)"/></g></svg>
                                </div>
                                <div class = "big_sidebar_item_text">
                                    ...
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class = "big_sidebar_line"></div>
                    <div class = "big_sidebar_bottom">
                        © <?php echo date("Y"); ?>. Louibooks (v<?php echo number_format($currentVersion); ?>)
                        <br />
                        상호: 루이북스 (Louibooks)
                        <br />
                        대표: 장범룡
                        <br />
                        업태: 정보통신업
                        <br />
                        종목: 포털 및 기타 인터넷 정보 매개 서비스
                        <br />
                        사업자등록번호: 660-43-00944
                        <br />
                        통신판매번호: 2022-전남순천-5044
                        <br />
                        사업장: 전라남도 순천시 남산로 124
                        <br />
                        유선번호: 0507-0177-1546
                        <br />
                        생년월일: 2005년 06월 25일
                    </div>
                    <div class = "big_sidebar_line"></div>
                </div>
                <!-- 작은 사이드바 -->
                <div class = "small_sidebar">
                    <div class = "small_sidebar_right">
                        <div class = "small_sidebar_items">
                            <div id = "small_sidebar_item_home" class = "small_sidebar_item md-ripples" onclick = "loadMenu_home();" onmouseenter = "hoverInformation(this, getLanguage('side_bar:home'));">
                                <div class = "small_sidebar_item_left">
                                    <div class = "small_sidebar_item_left_line"></div>
                                </div>
                                <div class = "small_sidebar_item_icon_0">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M15.341-101.5H.025A1.525,1.525,0,0,1-1.5-103.026v-26.866a1.525,1.525,0,0,1,.447-1.078l22.941-20.083a1.525,1.525,0,0,1,2.156,0L47-130.971a1.525,1.525,0,0,1,.447,1.079v26.865a1.525,1.525,0,0,1-1.525,1.525H30.591a1.525,1.525,0,0,1-1.078-.447,1.525,1.525,0,0,1-.447-1.078v-16.387h-12.2v16.387a1.526,1.526,0,0,1-.447,1.079A1.526,1.526,0,0,1,15.341-101.5ZM1.55-104.552H13.816v-16.387a1.525,1.525,0,0,1,.447-1.078,1.525,1.525,0,0,1,1.078-.447H30.591a1.525,1.525,0,0,1,1.525,1.525v16.387H44.4V-129.26L22.966-147.819,1.55-129.261Z" transform="translate(2.026 151.5)"/></g></svg>
                                </div>
                                <div class = "small_sidebar_item_icon_1">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M15.341-101.5H.025A1.525,1.525,0,0,1-1.5-103.026v-26.866a1.525,1.525,0,0,1,.447-1.078l22.941-20.083a1.525,1.525,0,0,1,2.156,0L47-130.971a1.525,1.525,0,0,1,.447,1.079v26.865a1.525,1.525,0,0,1-1.525,1.525H30.591a1.525,1.525,0,0,1-1.078-.447,1.525,1.525,0,0,1-.447-1.078v-16.387h-12.2v16.387a1.526,1.526,0,0,1-.447,1.079A1.526,1.526,0,0,1,15.341-101.5Z" transform="translate(2.026 151.5)"/></g></svg>
                                </div>
                            </div>
                            <div id = "small_sidebar_item_explore" class = "small_sidebar_item md-ripples" onclick = "loadMenu_explore();" onmouseenter = "hoverInformation(this, getLanguage('side_bar:explore'));">
                                <div class = "small_sidebar_item_left">
                                    <div class = "small_sidebar_item_left_line"></div>
                                </div>
                                <div class = "small_sidebar_item_icon_0">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,3a22.007,22.007,0,0,0-8.562,42.272A22.006,22.006,0,0,0,33.562,4.728,21.859,21.859,0,0,0,25,3m0-3A25,25,0,1,1,0,25,25,25,0,0,1,25,0Z"/><path d="M-470.667-100v0L-480-125l9.333-25L-461-125l-9.666,25Zm.167-29a4.505,4.505,0,0,0-4.5,4.5,4.505,4.505,0,0,0,4.5,4.5,4.505,4.505,0,0,0,4.5-4.5A4.505,4.505,0,0,0-470.5-129Z" transform="translate(269.305 446.082) rotate(45)"/></g></svg>
                                </div>
                                <div class = "small_sidebar_item_icon_1">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-335-100a24.837,24.837,0,0,1-9.809-2,24.918,24.918,0,0,1-7.986-5.443l24.513-10.842L-317.44-142.8A24.917,24.917,0,0,1-312-134.809,24.837,24.837,0,0,1-310-125a24.842,24.842,0,0,1-1.965,9.731,24.918,24.918,0,0,1-5.358,7.947,24.918,24.918,0,0,1-7.947,5.358A24.843,24.843,0,0,1-335-100Zm-17.8-7.441A24.85,24.85,0,0,1-360-125a24.842,24.842,0,0,1,1.965-9.731,24.918,24.918,0,0,1,5.358-7.947,24.918,24.918,0,0,1,7.947-5.358A24.843,24.843,0,0,1-335-150a24.85,24.85,0,0,1,17.559,7.2l-24.277,11.078-11.077,24.275Zm17.441-12.708a4.468,4.468,0,0,1-3.182-1.316,4.468,4.468,0,0,1-1.316-3.182,4.47,4.47,0,0,1,1.316-3.182,4.469,4.469,0,0,1,3.182-1.316,4.47,4.47,0,0,1,3.182,1.316,4.506,4.506,0,0,1,0,6.364A4.47,4.47,0,0,1-335.354-120.149Z" transform="translate(360 150)"/></g></svg>
                                </div>
                            </div>
                            <div id = "small_sidebar_item_library" class = "small_sidebar_item md-ripples" onclick = "loadMenu_library();" onmouseenter = "hoverInformation(this, getLanguage('side_bar:library'));">
                                <div class = "small_sidebar_item_left">
                                    <div class = "small_sidebar_item_left_line"></div>
                                </div>
                                <div class = "small_sidebar_item_icon_0">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,22A11,11,0,0,1,3.222,3.222,11,11,0,1,1,18.778,18.778,10.928,10.928,0,0,1,11,22ZM11,3a8,8,0,1,0,8,8A8.009,8.009,0,0,0,11,3Z" transform="translate(14)"></path><path d="M29.719,56H19A19,19,0,0,1,0,37V19A19,19,0,0,1,19,0H29.719a19,19,0,0,1,19,19V37a19,19,0,0,1-19,19Zm-11-52.5a16.018,16.018,0,0,0-16,16v18a16.018,16.018,0,0,0,16,16h11a16.018,16.018,0,0,0,16-16v-18a16.018,16.018,0,0,0-16-16Z" transform="translate(1.281 25)"></path></g></svg>
                                </div>
                                <div class = "small_sidebar_item_icon_1">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><circle cx="11" cy="11" r="11" transform="translate(14)"></circle><circle cx="8" cy="8" r="8" transform="translate(17 3)"></circle><rect width="48.719" height="56" rx="19" transform="translate(1.281 25)"></rect><rect width="43" height="50" rx="16" transform="translate(4 28.5)"></rect></g></svg>
                                </div>
                            </div>
                        </div>
                        <div class = "small_sidebar_wrap" login_required = "true" style = "display: none;">
                            <div class = "big_sidebar_line"></div>
                            <div class = "small_sidebar_items">
                                <div id = "small_sidebar_item_history" class = "small_sidebar_item md-ripples" onclick = "loadMenu_history();" onmouseenter = "hoverInformation(this, getLanguage('side_bar:history'));">
                                    <div class = "small_sidebar_item_left">
                                        <div class = "small_sidebar_item_left_line"></div>
                                    </div>
                                    <div class = "small_sidebar_item_icon_0">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25-20a24.846,24.846,0,0,1-9.731-1.965,24.915,24.915,0,0,1-7.947-5.358,24.915,24.915,0,0,1-5.358-7.947A24.837,24.837,0,0,1,0-45H3A21.852,21.852,0,0,0,9.451-29.451,21.852,21.852,0,0,0,25-23,22.025,22.025,0,0,0,47-45,22.025,22.025,0,0,0,25-67,21.939,21.939,0,0,0,5.407-55H2.08a24.925,24.925,0,0,1,5.242-7.678,24.915,24.915,0,0,1,7.947-5.358A24.831,24.831,0,0,1,25-70a24.831,24.831,0,0,1,9.731,1.965,24.915,24.915,0,0,1,7.947,5.358,24.92,24.92,0,0,1,5.358,7.946A24.839,24.839,0,0,1,50-45a24.837,24.837,0,0,1-1.965,9.731,24.915,24.915,0,0,1-5.358,7.947,24.915,24.915,0,0,1-7.947,5.358A24.846,24.846,0,0,1,25-20Zm9.99-16.451a1.494,1.494,0,0,1-.749-.2L23.877-42.636A1.5,1.5,0,0,1,23-44V-59a1.5,1.5,0,0,1,1.5-1.5A1.5,1.5,0,0,1,26-59v14.126l9.742,5.623a1.5,1.5,0,0,1,.549,2.049A1.506,1.506,0,0,1,34.99-36.451Z" transform="translate(0 70)"></path><g transform="translate(-2 4)"><rect width="3" height="12" rx="1.5" transform="translate(2.871 2.017)"></rect><rect width="3" height="12" rx="1.5" transform="matrix(0.259, 0.966, -0.966, 0.259, 14.462, 8.276)"></rect></g></g></svg>
                                    </div>
                                    <div class = "small_sidebar_item_icon_1">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25-20a24.846,24.846,0,0,1-9.731-1.965,24.915,24.915,0,0,1-7.947-5.358,24.915,24.915,0,0,1-5.358-7.947A24.837,24.837,0,0,1,0-45H4a20.859,20.859,0,0,0,6.158,14.842A20.858,20.858,0,0,0,25-24,21.023,21.023,0,0,0,46-45,21.023,21.023,0,0,0,25-66,21.014,21.014,0,0,0,6.537-55H2.08a24.925,24.925,0,0,1,5.242-7.678,24.915,24.915,0,0,1,7.947-5.358A24.831,24.831,0,0,1,25-70a24.831,24.831,0,0,1,9.731,1.965,24.915,24.915,0,0,1,7.947,5.358,24.92,24.92,0,0,1,5.358,7.946A24.839,24.839,0,0,1,50-45a24.837,24.837,0,0,1-1.965,9.731,24.915,24.915,0,0,1-5.358,7.947,24.915,24.915,0,0,1-7.947,5.358A24.846,24.846,0,0,1,25-20Zm8.956-16.768a2,2,0,0,1-1-.268l-9.526-5.5a2,2,0,0,1-.991-1.929V-58.721A1.781,1.781,0,0,1,24.221-60.5,1.781,1.781,0,0,1,26-58.721v13.049L34.959-40.5a1.985,1.985,0,0,1,.932,1.214,1.987,1.987,0,0,1-.2,1.518A2.009,2.009,0,0,1,33.956-36.768Z" transform="translate(0 70)"></path><g transform="translate(-2 4)"><rect width="3" height="12" rx="1.5" transform="translate(2.871 2.017)"></rect><rect width="3" height="12" rx="1.5" transform="matrix(0.259, 0.966, -0.966, 0.259, 14.462, 8.276)"></rect></g></g></svg>
                                    </div>
                                </div>
                                <div id = "small_sidebar_item_notifications_settings" class = "small_sidebar_item md-ripples" onclick = "loadMenu_notifications_settings();" onmouseenter = "hoverInformation(this, getLanguage('side_bar:notifications_settings'));">
                                    <div class = "small_sidebar_item_left">
                                        <div class = "small_sidebar_item_left_line"></div>
                                    </div>
                                    <div class = "small_sidebar_item_icon_0">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M42.282,39.4h0l-.226,0H1.251C.557,39.4.2,39.3.065,39.075c-.221-.363.152-1.085.769-2.282,1.4-2.715,4.315-8.364,4.6-18.745a21.434,21.434,0,0,1,1.682-8.6,15.31,15.31,0,0,1,4.146-5.562A17.322,17.322,0,0,1,22.285,0a16.042,16.042,0,0,1,10.5,4.409,18.085,18.085,0,0,1,5.659,13.638c.141,10.246,2.863,15.713,4.326,18.65.617,1.238.989,1.986.755,2.364C43.375,39.3,43,39.4,42.282,39.4ZM22.187,3.026c-6.61,0-13.7,4.015-13.76,15.285a46.872,46.872,0,0,1-2.09,13.2,29.949,29.949,0,0,1-1.958,4.9L39.3,36.4s0,0-.006-.009a27.524,27.524,0,0,1-1.879-4.733,47.874,47.874,0,0,1-2-13.351C35.34,7.268,27.28,3.075,22.217,3.026Z" transform="translate(3.124 0.378)"></path><path d="M6.4,0a6.4,6.4,0,0,1,6.4,6.4H0A6.4,6.4,0,0,1,6.4,0Z" transform="translate(30.704 50) rotate(180)"></path></g></svg>
                                    </div>
                                    <div class = "small_sidebar_item_icon_1">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M21.026-.544C27.557-.544,37.1,5.2,37.182,17.5c.246,17.883,8.487,21.471,3.614,21.348H.083c-4.466.05,3.6-3.546,4.093-21.348C4.259,3.8,14.021-.544,21.026-.544Z" transform="translate(4.383 0.922)"></path><path d="M16.939-.544c5.739.056,13.127,4.863,13.194,15.285.157,11.479,3.888,18.093,3.888,18.093L-.9,32.84s3.872-7.043,4.048-18.1C3.216,3.138,10.744-.556,16.939-.544Z" transform="translate(8.401 3.948)"></path><path d="M6.4,0a6.4,6.4,0,0,1,6.4,6.4H0A6.4,6.4,0,0,1,6.4,0Z" transform="translate(30.704 50) rotate(180)"></path><path d="M8.583.607a1.307,1.307,0,0,1-.192,1.83A14.28,14.28,0,0,0,4.343,8.372,23.949,23.949,0,0,0,3,17.5a1.5,1.5,0,0,1-3,0S-.171,11.456,1.5,7.282A18.529,18.529,0,0,1,6.6.41,1.731,1.731,0,0,1,8.583.607Z" transform="translate(0.005 0.24)"></path><path d="M.282.61A1.314,1.314,0,0,0,.475,2.45,14.364,14.364,0,0,1,4.546,8.42,24.089,24.089,0,0,1,5.9,17.6a1.509,1.509,0,0,0,3.018,0s.172-6.079-1.509-10.277A18.637,18.637,0,0,0,2.28.411,1.742,1.742,0,0,0,.282.61Z" transform="translate(41.08 0.186)"></path></g></svg>
                                    </div>
                                </div>
                                <div class = "small_sidebar_item md-ripples" onclick = "loadWorkspace_my_works();" onmouseenter = "hoverInformation(this, getLanguage('side_bar:my_works'));">
                                    <div class = "small_sidebar_item_left">
                                        <div class = "small_sidebar_item_left_line"></div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,700a1.5,1.5,0,0,1,.844.26l23.5,16A1.5,1.5,0,0,1,49.4,718.7L25.9,736.2a1.5,1.5,0,0,1-1.792,0L.6,718.7a1.5,1.5,0,0,1,.052-2.443l23.5-16A1.5,1.5,0,0,1,25,700Zm20.915,17.555L25,703.315,4.085,717.555,25,733.13Z" transform="translate(0 -700)"></path><path d="M24.953,736.551a1.5,1.5,0,0,1-.9-.3L.6,718.754a1.5,1.5,0,0,1,1.794-2.4l22.558,16.832,22.65-16.834a1.5,1.5,0,1,1,1.789,2.408l-23.547,17.5A1.5,1.5,0,0,1,24.953,736.551Z" transform="translate(0 -686.551)"></path></g></svg>
                                </div>
                                <div class = "small_sidebar_item md-ripples" id = "small_sidebar_item_my_work_list" onclick = "loadMenu_my_work_list();" onmouseenter = "hoverInformation(this, getLanguage('side_bar:my_work_list'));">
                                    <div class = "small_sidebar_item_left">
                                        <div class = "small_sidebar_item_left_line"></div>
                                    </div>
                                    <div class = "small_sidebar_item_icon_0">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="37" height="3" rx="1.5" transform="translate(1 2)"></rect><rect width="37" height="3" rx="1.5" transform="translate(1 18)"></rect><rect width="20" height="3" rx="1.5" transform="translate(1 34)"></rect><g transform="translate(2.518 0.541)"><rect width="3" height="17" rx="1.5" transform="translate(23.151 35.438) rotate(-45)"></rect><rect width="3" height="23" rx="1.5" transform="translate(44.884 26.041) rotate(30)"></rect></g></g></svg>
                                    </div>
                                    <div class = "small_sidebar_item_icon_1">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="37" height="4" rx="2" transform="translate(1 1.5)"></rect><rect width="37" height="4" rx="2" transform="translate(1 17.5)"></rect><rect width="20" height="4" rx="2" transform="translate(1 34)"></rect><g transform="translate(2.748 0.965)"><rect width="4.277" height="18" rx="2.138" transform="translate(22.652 35.438) rotate(-45)"></rect><rect width="4.276" height="23" rx="2.138" transform="translate(44.149 25.903) rotate(30)"></rect></g></g></svg>
                                    </div>
                                </div>
                                <div class = "small_sidebar_item md-ripples" id = "small_sidebar_item_my_user_list" onclick = "loadMenu_my_user_list();" onmouseenter = "hoverInformation(this, getLanguage('side_bar:my_user_list'));">
                                    <div class = "small_sidebar_item_left">
                                        <div class = "small_sidebar_item_left_line"></div>
                                    </div>
                                    <div class = "small_sidebar_item_icon_0">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,22A11,11,0,0,1,3.222,3.222,11,11,0,1,1,18.778,18.778,10.928,10.928,0,0,1,11,22ZM11,3a8,8,0,1,0,8,8A8.009,8.009,0,0,0,11,3Z" transform="translate(14)"></path><path d="M29.719,61H19A19,19,0,0,1,0,42V24A19,19,0,0,1,19,5h8.569a18.6,18.6,0,0,0-2.918,3.5H18.719a16.018,16.018,0,0,0-16,16v18a16.018,16.018,0,0,0,16,16h11a16.018,16.018,0,0,0,16-16V36.169a18.429,18.429,0,0,0,3-1.233V42a19,19,0,0,1-19,19Z" transform="translate(1.281 20)"></path><g transform="translate(1.849 -0.459)"><rect width="3" height="17" rx="1.5" transform="translate(23.151 35.438) rotate(-45)"></rect><rect width="3" height="23" rx="1.5" transform="translate(44.884 26.041) rotate(30)"></rect></g></g></svg>
                                    </div>
                                    <div class = "small_sidebar_item_icon_1">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,22A11,11,0,0,1,3.222,3.222,11,11,0,1,1,18.778,18.778,10.928,10.928,0,0,1,11,22ZM11,4a7,7,0,1,0,7,7A7.008,7.008,0,0,0,11,4Z" transform="translate(14)"></path><path d="M29.719,61H19A19,19,0,0,1,0,42V24A19,19,0,0,1,19,5h8.569a18.573,18.573,0,0,0-3.228,4H19.859a16.018,16.018,0,0,0-16,16V42a16.018,16.018,0,0,0,16,16h10a16.018,16.018,0,0,0,16-16V36.124a18.435,18.435,0,0,0,2.859-1.188V42a19,19,0,0,1-19,19Z" transform="translate(1.281 20)"></path><g transform="translate(1.849 -0.459)"><rect width="4" height="17" rx="2" transform="translate(23.151 35.438) rotate(-45)"></rect><rect width="4" height="23" rx="2" transform="translate(44.018 25.541) rotate(30)"></rect></g></g></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class = "big_sidebar_line"></div>
                    </div>
                </div>
            </div>
            <div id = "wrap_sidebar_workspace" style = "display: none;">
                <div id = "wrap_sidebar_workspace_default">
                    <!-- 사이드바 -->
                    <div class = "big_sidebar scroll">
                        <div class = "workspace_big_sidebar_profile">
                            <div class = "header_right_button_profile_img" style = "width: 50px; height: 50px;"></div>
                            <div class = "workspace_big_sidebar_profile_title">
                                ...
                            </div>
                            <div class = "workspace_big_sidebar_profile_info">
                                <div class = "workspace_big_sidebar_profile_info_nickname">
                                    <span name = "my_nickname">...</span>
                                </div>
                                <div class = "workspace_big_sidebar_profile_info_work_count">
                                    · <span name = "my_work_count"></span>
                                </div>
                            </div>
                        </div>
                        <div class = "big_sidebar_items">
                            <div name = "big_sidebar_item_workspace_dashboard" onclick = "loadWorkspace_dashboard();" class = "big_sidebar_item md-ripples">
                                <div class = "big_sidebar_item_line"></div>
                                <div class = "big_sidebar_item_icon_0">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M21,26H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H21a1,1,0,0,1,1,1V25A1,1,0,0,1,21,26ZM2.869,2.889V23.111H19.13V2.889Z"/><path d="M22,19H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H22a1,1,0,0,1,1,1V18A1,1,0,0,1,22,19ZM2.875,2.85v13.3h17.25V2.85Z" transform="translate(27)"/><path d="M21,19H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H21a1,1,0,0,1,1,1V18A1,1,0,0,1,21,19ZM2.869,2.85v13.3H19.13V2.85Z" transform="translate(0 31)"/><path d="M22,26H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H22a1,1,0,0,1,1,1V25A1,1,0,0,1,22,26ZM2.875,2.889V23.111h17.25V2.889Z" transform="translate(27 24)"/></g></svg>
                                </div>
                                <div class = "big_sidebar_item_icon_1">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="22" height="26" rx="1"/><rect width="17" height="21" transform="translate(3 3)"/><rect width="23" height="19" rx="1" transform="translate(27)"/><rect width="18" height="14" transform="translate(29 3)"/><rect width="22" height="19" rx="1" transform="translate(0 31)"/><rect width="17" height="14" transform="translate(3 33)"/><rect width="23" height="26" rx="1" transform="translate(27 24)"/><rect width="18" height="21" transform="translate(29 26)"/></g></svg>
                                </div>
                                <div class = "big_sidebar_item_text">
                                    ...
                                </div>
                            </div>
                            <div name = "big_sidebar_item_workspace_my_works" onclick = "loadWorkspace_my_works();" class = "big_sidebar_item md-ripples">
                                <div class = "big_sidebar_item_line"></div>
                                <div class = "big_sidebar_item_icon_0">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,700a1.5,1.5,0,0,1,.844.26l23.5,16A1.5,1.5,0,0,1,49.4,718.7L25.9,736.2a1.5,1.5,0,0,1-1.792,0L.6,718.7a1.5,1.5,0,0,1,.052-2.443l23.5-16A1.5,1.5,0,0,1,25,700Zm20.915,17.555L25,703.315,4.085,717.555,25,733.13Z" transform="translate(0 -700)"/><path d="M24.953,736.551a1.5,1.5,0,0,1-.9-.3L.6,718.754a1.5,1.5,0,0,1,1.794-2.4l22.558,16.832,22.65-16.834a1.5,1.5,0,1,1,1.789,2.408l-23.547,17.5A1.5,1.5,0,0,1,24.953,736.551Z" transform="translate(0 -686.551)"/></g></svg>
                                </div>
                                <div class = "big_sidebar_item_icon_1">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,700a1.5,1.5,0,0,1,.844.26l23.5,16A1.5,1.5,0,0,1,49.4,718.7L25.9,736.2a1.5,1.5,0,0,1-1.792,0L.6,718.7a1.5,1.5,0,0,1,.052-2.443l23.5-16A1.5,1.5,0,0,1,25,700Z" transform="translate(0 -700)"/><path d="M24.953,736.551a1.5,1.5,0,0,1-.9-.3L.6,718.754a1.5,1.5,0,0,1,1.794-2.4l22.558,16.832,22.65-16.834a1.5,1.5,0,1,1,1.789,2.408l-23.547,17.5A1.5,1.5,0,0,1,24.953,736.551Z" transform="translate(0 -686.551)"/></g></svg>
                                </div>
                                <div class = "big_sidebar_item_text">
                                    ...
                                </div>
                            </div>
                            <div name = "big_sidebar_item_workspace_monetization" onclick = "loadWorkspace_monetization();" class = "big_sidebar_item md-ripples">
                                <div class = "big_sidebar_item_line"></div>
                                <div class = "big_sidebar_item_icon_0">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M38,26H3a3,3,0,0,1-3-3V2A3,3,0,0,1,3-1H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26ZM3.1,2.105V22.9H37.9V2.105Z" transform="translate(1 8.5)"/><ellipse cx="4" cy="3.939" rx="4" ry="3.939" transform="translate(17.5 17.123)"/><path d="M38,26H3a3,3,0,0,1-3-3V22.9H37.9V0H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26Z" transform="translate(8 15.5)"/></g></svg>
                                </div>
                                <div class = "big_sidebar_item_icon_1">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-1402,27h-35a3,3,0,0,1-3-3V3a3,3,0,0,1,3-3h35a3,3,0,0,1,3,3V24A3,3,0,0,1-1402,27Zm-17.5-17.377a3.974,3.974,0,0,0-4,3.938,3.974,3.974,0,0,0,4,3.938,3.974,3.974,0,0,0,4-3.938A3.974,3.974,0,0,0-1419.5,9.623Z" transform="translate(1441 7.5)"/><path d="M38,26H3a3,3,0,0,1-3-3V22.9H37.9V0H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26Z" transform="translate(8 15.5)"/></g></svg>
                                </div>
                                <div class = "big_sidebar_item_text">
                                    ...
                                </div>
                            </div>
                        </div>
                        <div class = "big_sidebar_line"></div>
                        <div class = "big_sidebar_items">
                            <div name = "big_sidebar_item_workspace_my_page_settings" onclick = "loadWorkspace_my_page_settings();" class = "big_sidebar_item md-ripples">
                                <div class = "big_sidebar_item_line"></div>
                                <div class = "big_sidebar_item_icon_0">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,22A11,11,0,0,1,3.222,3.222,11,11,0,1,1,18.778,18.778,10.928,10.928,0,0,1,11,22ZM11,3a8,8,0,1,0,8,8A8.009,8.009,0,0,0,11,3Z" transform="translate(14)"></path><path d="M29.719,56H19A19,19,0,0,1,0,37V19A19,19,0,0,1,19,0H29.719a19,19,0,0,1,19,19V37a19,19,0,0,1-19,19Zm-11-52.5a16.018,16.018,0,0,0-16,16v18a16.018,16.018,0,0,0,16,16h11a16.018,16.018,0,0,0,16-16v-18a16.018,16.018,0,0,0-16-16Z" transform="translate(1.281 25)"></path></g></svg>
                                </div>
                                <div class = "big_sidebar_item_icon_1">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><circle cx="11" cy="11" r="11" transform="translate(14)"></circle><circle cx="8" cy="8" r="8" transform="translate(17 3)"></circle><rect width="48.719" height="56" rx="19" transform="translate(1.281 25)"></rect><rect width="43" height="50" rx="16" transform="translate(4 28.5)"></rect></g></svg>
                                </div>
                                <div class = "big_sidebar_item_text">
                                    ...
                                </div>
                            </div>
                            <div name = "big_sidebar_item_workspace_partner" onclick = "loadWorkspace_partner();" class = "big_sidebar_item md-ripples">
                                <div class = "big_sidebar_item_line"></div>
                                <div class = "big_sidebar_item_icon_0">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"> <defs> <clipPath id="clip-partner"> <rect width="50" height="50"></rect> </clipPath> </defs> <g id="partner" clip-path="url(#clip-partner)"> <path id="빼기_31" data-name="빼기 31" d="M-1779.87,28.619a9.76,9.76,0,0,1-3.441-.734l-15.976-11.724L-1800,0l2.773,2.561c.025.025,2.571,2.509,8.333,2.509A32.869,32.869,0,0,0-1775.732,1.8l19.514,18.062a4.891,4.891,0,0,1-.781,1.767,4.231,4.231,0,0,1-3.633,1.767,8.044,8.044,0,0,1-2.029-.287,4,4,0,0,1-.714,1.441,3.836,3.836,0,0,1-3.179,1.441,8.953,8.953,0,0,1-3.289-.743,3.306,3.306,0,0,1-.821,1.087,4.632,4.632,0,0,1-3.191,1.087,9.433,9.433,0,0,1-2.589-.406A3.763,3.763,0,0,1-1779.87,28.619Zm-16.785-22.354.33,8.177,14.337,10.634a9.206,9.206,0,0,0,2.252.434,1.311,1.311,0,0,0,.682-.14l-.477-3.007c.035.018,3.669,1.9,5.842,1.9a3.014,3.014,0,0,0,.466-.034.645.645,0,0,0,.446-.237c.36-.377.766-1.329.654-3.72.033.025,3.424,2.587,5.508,2.587.072,0,.143,0,.211-.009h.019a.877.877,0,0,0,.665-.356c.349-.43.664-1.435.175-3.785a14.548,14.548,0,0,0,5.141,1.568c.069,0,.137,0,.2-.005L-1776.467,5.2c-.253.105-6.2,2.537-11.3,2.687-.218.006-.439.01-.658.01a20.479,20.479,0,0,1-8.234-1.631h0Z" transform="translate(1800.326 18.801)"></path> <path id="빼기_32" data-name="빼기 32" d="M-1756.977,31.092h0l-19.725-17.8,0,0a22.763,22.763,0,0,1-3.717,2.218,21.317,21.317,0,0,1-9.039,2.223,15.894,15.894,0,0,1-5.407-.933,10.25,10.25,0,0,1-2.369-1.72A8.823,8.823,0,0,1-1800,9.67l.015-.01c.643-.4,4.057-2.5,8.173-4.648s9.772-4.764,13.278-5a3.008,3.008,0,0,1,.357-.015c1.468,0,7.663.5,25.768,6.93V29.191a2.9,2.9,0,0,0-1-.16,4.437,4.437,0,0,0-3.564,2.06Zm-19.65-20.827h0a2.809,2.809,0,0,1,1.62.554.464.464,0,0,0,.131.078c.12,0,17.76,15.985,17.938,16.147a2.873,2.873,0,0,1,1.437-.631V9.142c-16.235-5.911-22.43-6.068-22.491-6.069h-.087c-5.227,0-18.291,7.923-18.422,8a2.737,2.737,0,0,0,.713,1.4,7.768,7.768,0,0,0,4.377,2.215,9.158,9.158,0,0,0,1.976.207c4.655,0,9.568-3.064,10.963-4A3.314,3.314,0,0,1-1776.628,10.265Z" transform="translate(1801.031 2.55)"></path> </g> </svg>
                                </div>
                                <div class = "big_sidebar_item_icon_1">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-142.811 -236.621)"><path d="M53.98,12187.691l.526,11.8,15.162,11.183s5.608,1.869,5.024-1.578c0,0,6.542,2.979,6.835-1.985,0,0,6.951,4.381,6.834-1.928,0,0,5.024,2.1,5.958-.759l-18.149-16.733s-8.4,3.33-13.953,2.921S53.98,12187.691,53.98,12187.691Z" transform="translate(90.831 -11928.661)"/><path d="M67.463,11904.994s1.216,6.071,8.582,5.92a20.763,20.763,0,0,0,12.117-4.179,1.45,1.45,0,0,1,1.9,0c.911.836,18.708,16.859,18.708,16.859a4.916,4.916,0,0,1,3.1-1.394v-19.547s-19.412-7.01-24.939-6.471S67.463,11904.994,67.463,11904.994Z" transform="translate(78.051 -11655.431)"/></g></g></svg>
                                </div>
                                <div class = "big_sidebar_item_text">
                                    ...
                                </div>
                            </div>
                        </div>
                        <div class = "big_sidebar_line"></div>
                    </div>
                    <!-- 작은 사이드바 -->
                    <div class = "small_sidebar">
                        <div class = "small_sidebar_right">
                            <div class = "workspace_big_sidebar_profile">
                                <div class = "workspace_big_sidebar_profile_img">
                                    <div class = "header_right_button_profile_img" style = "width: 40px; height: 40px;"></div>
                                </div>
                            </div>
                            <div class = "small_sidebar_items">
                                <div class = "small_sidebar_item md-ripples" onclick = "loadWorkspace_dashboard();" id = "small_sidebar_item_workspace_dashboard" onmouseenter = "hoverInformation(this, getLanguage('sidebar_workspace_dashboard'));">
                                    <div class = "small_sidebar_item_left">
                                        <div class = "small_sidebar_item_left_line"></div>
                                    </div>
                                    <div class = "small_sidebar_item_icon_0">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M21,26H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H21a1,1,0,0,1,1,1V25A1,1,0,0,1,21,26ZM2.869,2.889V23.111H19.13V2.889Z"></path><path d="M22,19H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H22a1,1,0,0,1,1,1V18A1,1,0,0,1,22,19ZM2.875,2.85v13.3h17.25V2.85Z" transform="translate(27)"></path><path d="M21,19H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H21a1,1,0,0,1,1,1V18A1,1,0,0,1,21,19ZM2.869,2.85v13.3H19.13V2.85Z" transform="translate(0 31)"></path><path d="M22,26H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H22a1,1,0,0,1,1,1V25A1,1,0,0,1,22,26ZM2.875,2.889V23.111h17.25V2.889Z" transform="translate(27 24)"></path></g></svg>
                                    </div>
                                    <div class = "small_sidebar_item_icon_1">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="22" height="26" rx="1"></rect><rect width="17" height="21" transform="translate(3 3)"></rect><rect width="23" height="19" rx="1" transform="translate(27)"></rect><rect width="18" height="14" transform="translate(29 3)"></rect><rect width="22" height="19" rx="1" transform="translate(0 31)"></rect><rect width="17" height="14" transform="translate(3 33)"></rect><rect width="23" height="26" rx="1" transform="translate(27 24)"></rect><rect width="18" height="21" transform="translate(29 26)"></rect></g></svg>
                                    </div>
                                </div>
                                <div class = "small_sidebar_item md-ripples" onclick = "loadWorkspace_my_works();" id = "small_sidebar_item_workspace_my_works" onmouseenter = "hoverInformation(this, getLanguage('sidebar_workspace_my_works'));">
                                    <div class = "small_sidebar_item_left">
                                        <div class = "small_sidebar_item_left_line"></div>
                                    </div>
                                    <div class = "small_sidebar_item_icon_0">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,700a1.5,1.5,0,0,1,.844.26l23.5,16A1.5,1.5,0,0,1,49.4,718.7L25.9,736.2a1.5,1.5,0,0,1-1.792,0L.6,718.7a1.5,1.5,0,0,1,.052-2.443l23.5-16A1.5,1.5,0,0,1,25,700Zm20.915,17.555L25,703.315,4.085,717.555,25,733.13Z" transform="translate(0 -700)"></path><path d="M24.953,736.551a1.5,1.5,0,0,1-.9-.3L.6,718.754a1.5,1.5,0,0,1,1.794-2.4l22.558,16.832,22.65-16.834a1.5,1.5,0,1,1,1.789,2.408l-23.547,17.5A1.5,1.5,0,0,1,24.953,736.551Z" transform="translate(0 -686.551)"></path></g></svg>
                                    </div>
                                    <div class = "small_sidebar_item_icon_1">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,700a1.5,1.5,0,0,1,.844.26l23.5,16A1.5,1.5,0,0,1,49.4,718.7L25.9,736.2a1.5,1.5,0,0,1-1.792,0L.6,718.7a1.5,1.5,0,0,1,.052-2.443l23.5-16A1.5,1.5,0,0,1,25,700Z" transform="translate(0 -700)"></path><path d="M24.953,736.551a1.5,1.5,0,0,1-.9-.3L.6,718.754a1.5,1.5,0,0,1,1.794-2.4l22.558,16.832,22.65-16.834a1.5,1.5,0,1,1,1.789,2.408l-23.547,17.5A1.5,1.5,0,0,1,24.953,736.551Z" transform="translate(0 -686.551)"></path></g></svg>
                                    </div>
                                </div>
                                <div class = "small_sidebar_item md-ripples" onclick = "loadWorkspace_monetization();" id = "small_sidebar_item_workspace_monetization" onmouseenter = "hoverInformation(this, getLanguage('sidebar_workspace_monetization'));">
                                    <div class = "small_sidebar_item_left">
                                        <div class = "small_sidebar_item_left_line"></div>
                                    </div>
                                    <div class = "small_sidebar_item_icon_0">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M38,26H3a3,3,0,0,1-3-3V2A3,3,0,0,1,3-1H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26ZM3.1,2.105V22.9H37.9V2.105Z" transform="translate(1 8.5)"/><ellipse cx="4" cy="3.939" rx="4" ry="3.939" transform="translate(17.5 17.123)"/><path d="M38,26H3a3,3,0,0,1-3-3V22.9H37.9V0H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26Z" transform="translate(8 15.5)"/></g></svg>
                                    </div>
                                    <div class = "small_sidebar_item_icon_1">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-1402,27h-35a3,3,0,0,1-3-3V3a3,3,0,0,1,3-3h35a3,3,0,0,1,3,3V24A3,3,0,0,1-1402,27Zm-17.5-17.377a3.974,3.974,0,0,0-4,3.938,3.974,3.974,0,0,0,4,3.938,3.974,3.974,0,0,0,4-3.938A3.974,3.974,0,0,0-1419.5,9.623Z" transform="translate(1441 7.5)"/><path d="M38,26H3a3,3,0,0,1-3-3V22.9H37.9V0H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26Z" transform="translate(8 15.5)"/></g></svg>
                                    </div>
                                </div>
                            </div>
                            <div class = "big_sidebar_line"></div>
                            <div class = "small_sidebar_items">
                                <div class = "small_sidebar_item md-ripples" onclick = "loadWorkspace_my_page_settings();" id = "small_sidebar_item_workspace_my_page_settings" onmouseenter = "hoverInformation(this, getLanguage('sidebar_workspace_my_page_settings'));">
                                    <div class = "small_sidebar_item_left">
                                        <div class = "small_sidebar_item_left_line"></div>
                                    </div>
                                    <div class = "small_sidebar_item_icon_0">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,22A11,11,0,0,1,3.222,3.222,11,11,0,1,1,18.778,18.778,10.928,10.928,0,0,1,11,22ZM11,3a8,8,0,1,0,8,8A8.009,8.009,0,0,0,11,3Z" transform="translate(14)"></path><path d="M29.719,56H19A19,19,0,0,1,0,37V19A19,19,0,0,1,19,0H29.719a19,19,0,0,1,19,19V37a19,19,0,0,1-19,19Zm-11-52.5a16.018,16.018,0,0,0-16,16v18a16.018,16.018,0,0,0,16,16h11a16.018,16.018,0,0,0,16-16v-18a16.018,16.018,0,0,0-16-16Z" transform="translate(1.281 25)"></path></g></svg>
                                    </div>
                                    <div class = "small_sidebar_item_icon_1">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><circle cx="11" cy="11" r="11" transform="translate(14)"></circle><circle cx="8" cy="8" r="8" transform="translate(17 3)"></circle><rect width="48.719" height="56" rx="19" transform="translate(1.281 25)"></rect><rect width="43" height="50" rx="16" transform="translate(4 28.5)"></rect></g></svg>
                                    </div>
                                </div>
                                <div class = "small_sidebar_item md-ripples" onclick = "loadWorkspace_partner();" id = "small_sidebar_item_workspace_partner" onmouseenter = "hoverInformation(this, getLanguage('sidebar_workspace_partner'));">
                                    <div class = "small_sidebar_item_left">
                                        <div class = "small_sidebar_item_left_line"></div>
                                    </div>
                                    <div class = "small_sidebar_item_icon_0">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"> <defs> <clipPath id="clip-partner"> <rect width="50" height="50"></rect> </clipPath> </defs> <g id="partner" clip-path="url(#clip-partner)"> <path id="빼기_31" data-name="빼기 31" d="M-1779.87,28.619a9.76,9.76,0,0,1-3.441-.734l-15.976-11.724L-1800,0l2.773,2.561c.025.025,2.571,2.509,8.333,2.509A32.869,32.869,0,0,0-1775.732,1.8l19.514,18.062a4.891,4.891,0,0,1-.781,1.767,4.231,4.231,0,0,1-3.633,1.767,8.044,8.044,0,0,1-2.029-.287,4,4,0,0,1-.714,1.441,3.836,3.836,0,0,1-3.179,1.441,8.953,8.953,0,0,1-3.289-.743,3.306,3.306,0,0,1-.821,1.087,4.632,4.632,0,0,1-3.191,1.087,9.433,9.433,0,0,1-2.589-.406A3.763,3.763,0,0,1-1779.87,28.619Zm-16.785-22.354.33,8.177,14.337,10.634a9.206,9.206,0,0,0,2.252.434,1.311,1.311,0,0,0,.682-.14l-.477-3.007c.035.018,3.669,1.9,5.842,1.9a3.014,3.014,0,0,0,.466-.034.645.645,0,0,0,.446-.237c.36-.377.766-1.329.654-3.72.033.025,3.424,2.587,5.508,2.587.072,0,.143,0,.211-.009h.019a.877.877,0,0,0,.665-.356c.349-.43.664-1.435.175-3.785a14.548,14.548,0,0,0,5.141,1.568c.069,0,.137,0,.2-.005L-1776.467,5.2c-.253.105-6.2,2.537-11.3,2.687-.218.006-.439.01-.658.01a20.479,20.479,0,0,1-8.234-1.631h0Z" transform="translate(1800.326 18.801)"></path> <path id="빼기_32" data-name="빼기 32" d="M-1756.977,31.092h0l-19.725-17.8,0,0a22.763,22.763,0,0,1-3.717,2.218,21.317,21.317,0,0,1-9.039,2.223,15.894,15.894,0,0,1-5.407-.933,10.25,10.25,0,0,1-2.369-1.72A8.823,8.823,0,0,1-1800,9.67l.015-.01c.643-.4,4.057-2.5,8.173-4.648s9.772-4.764,13.278-5a3.008,3.008,0,0,1,.357-.015c1.468,0,7.663.5,25.768,6.93V29.191a2.9,2.9,0,0,0-1-.16,4.437,4.437,0,0,0-3.564,2.06Zm-19.65-20.827h0a2.809,2.809,0,0,1,1.62.554.464.464,0,0,0,.131.078c.12,0,17.76,15.985,17.938,16.147a2.873,2.873,0,0,1,1.437-.631V9.142c-16.235-5.911-22.43-6.068-22.491-6.069h-.087c-5.227,0-18.291,7.923-18.422,8a2.737,2.737,0,0,0,.713,1.4,7.768,7.768,0,0,0,4.377,2.215,9.158,9.158,0,0,0,1.976.207c4.655,0,9.568-3.064,10.963-4A3.314,3.314,0,0,1-1776.628,10.265Z" transform="translate(1801.031 2.55)"></path> </g> </svg>
                                    </div>
                                    <div class = "small_sidebar_item_icon_1">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-142.811 -236.621)"><path d="M53.98,12187.691l.526,11.8,15.162,11.183s5.608,1.869,5.024-1.578c0,0,6.542,2.979,6.835-1.985,0,0,6.951,4.381,6.834-1.928,0,0,5.024,2.1,5.958-.759l-18.149-16.733s-8.4,3.33-13.953,2.921S53.98,12187.691,53.98,12187.691Z" transform="translate(90.831 -11928.661)"/><path d="M67.463,11904.994s1.216,6.071,8.582,5.92a20.763,20.763,0,0,0,12.117-4.179,1.45,1.45,0,0,1,1.9,0c.911.836,18.708,16.859,18.708,16.859a4.916,4.916,0,0,1,3.1-1.394v-19.547s-19.412-7.01-24.939-6.471S67.463,11904.994,67.463,11904.994Z" transform="translate(78.051 -11655.431)"/></g></g></svg>
                                    </div>
                                </div>
                            </div>
                            <div class = "big_sidebar_line"></div>
                        </div>
                    </div>
                </div>
                <div id = "wrap_sidebar_workspace_custom" style = "display: none;">
                    ...
                </div>
            </div>
            <div id = "wrap_sidebar_admin" style = "display: none;">
                <!-- 사이드바 -->
                <div class = "big_sidebar scroll">
                    <div class = "big_sidebar_items">
                        <div name = "big_sidebar_item_admin_dashboard" onclick = "loadAdmin_dashboard();" class = "big_sidebar_item md-ripples">
                            <div class = "big_sidebar_item_line"></div>
                            <div class = "big_sidebar_item_icon_0">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M21,26H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H21a1,1,0,0,1,1,1V25A1,1,0,0,1,21,26ZM2.869,2.889V23.111H19.13V2.889Z"/><path d="M22,19H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H22a1,1,0,0,1,1,1V18A1,1,0,0,1,22,19ZM2.875,2.85v13.3h17.25V2.85Z" transform="translate(27)"/><path d="M21,19H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H21a1,1,0,0,1,1,1V18A1,1,0,0,1,21,19ZM2.869,2.85v13.3H19.13V2.85Z" transform="translate(0 31)"/><path d="M22,26H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H22a1,1,0,0,1,1,1V25A1,1,0,0,1,22,26ZM2.875,2.889V23.111h17.25V2.889Z" transform="translate(27 24)"/></g></svg>
                            </div>
                            <div class = "big_sidebar_item_icon_1">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="22" height="26" rx="1"/><rect width="17" height="21" transform="translate(3 3)"/><rect width="23" height="19" rx="1" transform="translate(27)"/><rect width="18" height="14" transform="translate(29 3)"/><rect width="22" height="19" rx="1" transform="translate(0 31)"/><rect width="17" height="14" transform="translate(3 33)"/><rect width="23" height="26" rx="1" transform="translate(27 24)"/><rect width="18" height="21" transform="translate(29 26)"/></g></svg>
                            </div>
                            <div class = "big_sidebar_item_text">
                                ...
                            </div>
                        </div>
                        <div name = "big_sidebar_item_admin_questions" onclick = "loadAdmin_questions();" class = "big_sidebar_item md-ripples">
                            <div class = "big_sidebar_item_line"></div>
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,50A25.007,25.007,0,0,1,15.269,1.965,25.007,25.007,0,0,1,34.731,48.036,24.843,24.843,0,0,1,25,50ZM25,3A22,22,0,1,0,47,25,22.025,22.025,0,0,0,25,3Z"/><g transform="translate(-24 6)"><rect width="3" height="24" rx="1.5" transform="translate(48 11)"/><rect width="3" height="4" rx="1.5" transform="translate(48 3)"/></g></g></svg>
                            <div class = "big_sidebar_item_text">
                                ...
                            </div>
                        </div>
                        <div name = "big_sidebar_item_admin_user_report" onclick = "loadAdmin_user_report();" class = "big_sidebar_item md-ripples">
                            <div class = "big_sidebar_item_line"></div>
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5" transform="translate(9)"></rect><path d="M13.422,25.422s6.941-3.318,12.163-3.086,17.81,4.641,17.81,4.641V9.456S27.963,4,24.656,3.945s-9.456,2.9-9.456,2.9L13.422,4.235S18.913.754,24.25,1.1,43.395,6.15,43.395,6.15h3.249V30.806L25.584,25.422S18.391,25.816,15.2,27.9Z" transform="translate(-0.449)"></path></g></svg>
                            <div class = "big_sidebar_item_text">
                                ...
                            </div>
                        </div>
                    </div>
                    <div class = "big_sidebar_line"></div>
                    <div class = "big_sidebar_title big_sidebar_title_admin_work">...</div>
                    <div class = "big_sidebar_items">
                    <div name = "big_sidebar_item_admin_work_report" onclick = "loadAdmin_work_report();" class = "big_sidebar_item md-ripples">
                        <div class = "big_sidebar_item_line"></div>
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5" transform="translate(9)"></rect><path d="M13.422,25.422s6.941-3.318,12.163-3.086,17.81,4.641,17.81,4.641V9.456S27.963,4,24.656,3.945s-9.456,2.9-9.456,2.9L13.422,4.235S18.913.754,24.25,1.1,43.395,6.15,43.395,6.15h3.249V30.806L25.584,25.422S18.391,25.816,15.2,27.9Z" transform="translate(-0.449)"></path></g></svg>
                            <div class = "big_sidebar_item_text">
                                ...
                            </div>
                        </div>
                        <div name = "big_sidebar_item_admin_monetization_approval" onclick = "loadAdmin_monetization_approval();" class = "big_sidebar_item md-ripples">
                            <div class = "big_sidebar_item_line"></div>
                            <div class = "big_sidebar_item_icon_0">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M38,26H3a3,3,0,0,1-3-3V2A3,3,0,0,1,3-1H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26ZM3.1,2.105V22.9H37.9V2.105Z" transform="translate(1 8.5)"></path><ellipse cx="4" cy="3.939" rx="4" ry="3.939" transform="translate(17.5 17.123)"></ellipse><path d="M38,26H3a3,3,0,0,1-3-3V22.9H37.9V0H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26Z" transform="translate(8 15.5)"></path></g></svg>
                            </div>
                            <div class = "big_sidebar_item_icon_1">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-1402,27h-35a3,3,0,0,1-3-3V3a3,3,0,0,1,3-3h35a3,3,0,0,1,3,3V24A3,3,0,0,1-1402,27Zm-17.5-17.377a3.974,3.974,0,0,0-4,3.938,3.974,3.974,0,0,0,4,3.938,3.974,3.974,0,0,0,4-3.938A3.974,3.974,0,0,0-1419.5,9.623Z" transform="translate(1441 7.5)"></path><path d="M38,26H3a3,3,0,0,1-3-3V22.9H37.9V0H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26Z" transform="translate(8 15.5)"></path></g></svg>
                            </div>
                            <div class = "big_sidebar_item_text">
                                ...
                            </div>
                        </div>
                        <div name = "big_sidebar_item_admin_partner_approval" onclick = "loadAdmin_partner_approval();" class = "big_sidebar_item md-ripples">
                            <div class = "big_sidebar_item_line"></div>
                            <div class = "big_sidebar_item_icon_0">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"> <defs> <clipPath id="clip-partner"> <rect width="50" height="50"/> </clipPath> </defs> <g id="partner" clip-path="url(#clip-partner)"> <path id="빼기_31" data-name="빼기 31" d="M-1779.87,28.619a9.76,9.76,0,0,1-3.441-.734l-15.976-11.724L-1800,0l2.773,2.561c.025.025,2.571,2.509,8.333,2.509A32.869,32.869,0,0,0-1775.732,1.8l19.514,18.062a4.891,4.891,0,0,1-.781,1.767,4.231,4.231,0,0,1-3.633,1.767,8.044,8.044,0,0,1-2.029-.287,4,4,0,0,1-.714,1.441,3.836,3.836,0,0,1-3.179,1.441,8.953,8.953,0,0,1-3.289-.743,3.306,3.306,0,0,1-.821,1.087,4.632,4.632,0,0,1-3.191,1.087,9.433,9.433,0,0,1-2.589-.406A3.763,3.763,0,0,1-1779.87,28.619Zm-16.785-22.354.33,8.177,14.337,10.634a9.206,9.206,0,0,0,2.252.434,1.311,1.311,0,0,0,.682-.14l-.477-3.007c.035.018,3.669,1.9,5.842,1.9a3.014,3.014,0,0,0,.466-.034.645.645,0,0,0,.446-.237c.36-.377.766-1.329.654-3.72.033.025,3.424,2.587,5.508,2.587.072,0,.143,0,.211-.009h.019a.877.877,0,0,0,.665-.356c.349-.43.664-1.435.175-3.785a14.548,14.548,0,0,0,5.141,1.568c.069,0,.137,0,.2-.005L-1776.467,5.2c-.253.105-6.2,2.537-11.3,2.687-.218.006-.439.01-.658.01a20.479,20.479,0,0,1-8.234-1.631h0Z" transform="translate(1800.326 18.801)"/> <path id="빼기_32" data-name="빼기 32" d="M-1756.977,31.092h0l-19.725-17.8,0,0a22.763,22.763,0,0,1-3.717,2.218,21.317,21.317,0,0,1-9.039,2.223,15.894,15.894,0,0,1-5.407-.933,10.25,10.25,0,0,1-2.369-1.72A8.823,8.823,0,0,1-1800,9.67l.015-.01c.643-.4,4.057-2.5,8.173-4.648s9.772-4.764,13.278-5a3.008,3.008,0,0,1,.357-.015c1.468,0,7.663.5,25.768,6.93V29.191a2.9,2.9,0,0,0-1-.16,4.437,4.437,0,0,0-3.564,2.06Zm-19.65-20.827h0a2.809,2.809,0,0,1,1.62.554.464.464,0,0,0,.131.078c.12,0,17.76,15.985,17.938,16.147a2.873,2.873,0,0,1,1.437-.631V9.142c-16.235-5.911-22.43-6.068-22.491-6.069h-.087c-5.227,0-18.291,7.923-18.422,8a2.737,2.737,0,0,0,.713,1.4,7.768,7.768,0,0,0,4.377,2.215,9.158,9.158,0,0,0,1.976.207c4.655,0,9.568-3.064,10.963-4A3.314,3.314,0,0,1-1776.628,10.265Z" transform="translate(1801.031 2.55)"/> </g> </svg>
                            </div>
                            <div class = "big_sidebar_item_icon_1">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-142.811 -236.621)"><path d="M53.98,12187.691l.526,11.8,15.162,11.183s5.608,1.869,5.024-1.578c0,0,6.542,2.979,6.835-1.985,0,0,6.951,4.381,6.834-1.928,0,0,5.024,2.1,5.958-.759l-18.149-16.733s-8.4,3.33-13.953,2.921S53.98,12187.691,53.98,12187.691Z" transform="translate(90.831 -11928.661)"></path><path d="M67.463,11904.994s1.216,6.071,8.582,5.92a20.763,20.763,0,0,0,12.117-4.179,1.45,1.45,0,0,1,1.9,0c.911.836,18.708,16.859,18.708,16.859a4.916,4.916,0,0,1,3.1-1.394v-19.547s-19.412-7.01-24.939-6.471S67.463,11904.994,67.463,11904.994Z" transform="translate(78.051 -11655.431)"></path></g></g></svg>
                            </div>
                            <div class = "big_sidebar_item_text">
                                ...
                            </div>
                        </div>
                    </div>
                    <div class = "big_sidebar_line"></div>
                </div>
                <!-- 작은 사이드바 -->
                <div class = "small_sidebar">
                    <div class = "small_sidebar_right">
                        <div class = "small_sidebar_items">
                            <div class = "small_sidebar_item md-ripples" onclick = "loadAdmin_dashboard();" id = "small_sidebar_item_admin_dashboard" onmouseenter = "hoverInformation(this, getLanguage('sidebar_admin_dashboard'));">
                                <div class = "small_sidebar_item_left">
                                    <div class = "small_sidebar_item_left_line"></div>
                                </div>
                                <div class = "small_sidebar_item_icon_0">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M21,26H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H21a1,1,0,0,1,1,1V25A1,1,0,0,1,21,26ZM2.869,2.889V23.111H19.13V2.889Z"></path><path d="M22,19H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H22a1,1,0,0,1,1,1V18A1,1,0,0,1,22,19ZM2.875,2.85v13.3h17.25V2.85Z" transform="translate(27)"></path><path d="M21,19H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H21a1,1,0,0,1,1,1V18A1,1,0,0,1,21,19ZM2.869,2.85v13.3H19.13V2.85Z" transform="translate(0 31)"></path><path d="M22,26H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H22a1,1,0,0,1,1,1V25A1,1,0,0,1,22,26ZM2.875,2.889V23.111h17.25V2.889Z" transform="translate(27 24)"></path></g></svg>
                                </div>
                                <div class = "small_sidebar_item_icon_1">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="22" height="26" rx="1"></rect><rect width="17" height="21" transform="translate(3 3)"></rect><rect width="23" height="19" rx="1" transform="translate(27)"></rect><rect width="18" height="14" transform="translate(29 3)"></rect><rect width="22" height="19" rx="1" transform="translate(0 31)"></rect><rect width="17" height="14" transform="translate(3 33)"></rect><rect width="23" height="26" rx="1" transform="translate(27 24)"></rect><rect width="18" height="21" transform="translate(29 26)"></rect></g></svg>
                                </div>
                            </div>
                            <div class = "small_sidebar_item md-ripples" onclick = "loadAdmin_questions();" id = "small_sidebar_item_admin_questions" onmouseenter = "hoverInformation(this, getLanguage('sidebar_admin_questions'));">
                                <div class = "small_sidebar_item_left">
                                    <div class = "small_sidebar_item_left_line"></div>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,50A25.007,25.007,0,0,1,15.269,1.965,25.007,25.007,0,0,1,34.731,48.036,24.843,24.843,0,0,1,25,50ZM25,3A22,22,0,1,0,47,25,22.025,22.025,0,0,0,25,3Z"/><g transform="translate(-24 6)"><rect width="3" height="24" rx="1.5" transform="translate(48 11)"/><rect width="3" height="4" rx="1.5" transform="translate(48 3)"/></g></g></svg>
                            </div>
                            <div class = "small_sidebar_item md-ripples" onclick = "loadAdmin_user_report();" id = "small_sidebar_item_admin_user_report" onmouseenter = "hoverInformation(this, getLanguage('sidebar_admin_user_report'));">
                                <div class = "small_sidebar_item_left">
                                    <div class = "small_sidebar_item_left_line"></div>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5" transform="translate(9)"></rect><path d="M13.422,25.422s6.941-3.318,12.163-3.086,17.81,4.641,17.81,4.641V9.456S27.963,4,24.656,3.945s-9.456,2.9-9.456,2.9L13.422,4.235S18.913.754,24.25,1.1,43.395,6.15,43.395,6.15h3.249V30.806L25.584,25.422S18.391,25.816,15.2,27.9Z" transform="translate(-0.449)"></path></g></svg>
                            </div>
                        </div>
                        <div class = "big_sidebar_line"></div>
                        <div class = "small_sidebar_items">
                            <div class = "small_sidebar_item md-ripples" onclick = "loadAdmin_work_report();" id = "small_sidebar_item_admin_work_report" onmouseenter = "hoverInformation(this, getLanguage('sidebar_admin_work_report'));">
                                <div class = "small_sidebar_item_left">
                                    <div class = "small_sidebar_item_left_line"></div>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5" transform="translate(9)"></rect><path d="M13.422,25.422s6.941-3.318,12.163-3.086,17.81,4.641,17.81,4.641V9.456S27.963,4,24.656,3.945s-9.456,2.9-9.456,2.9L13.422,4.235S18.913.754,24.25,1.1,43.395,6.15,43.395,6.15h3.249V30.806L25.584,25.422S18.391,25.816,15.2,27.9Z" transform="translate(-0.449)"></path></g></svg>
                            </div>
                            <div class = "small_sidebar_item md-ripples" onclick = "loadAdmin_monetization_approval();" id = "small_sidebar_item_admin_monetization_approval" onmouseenter = "hoverInformation(this, getLanguage('sidebar_admin_monetization_approval'));">
                                <div class = "small_sidebar_item_left">
                                    <div class = "small_sidebar_item_left_line"></div>
                                </div>
                                <div class = "small_sidebar_item_icon_0">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M38,26H3a3,3,0,0,1-3-3V2A3,3,0,0,1,3-1H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26ZM3.1,2.105V22.9H37.9V2.105Z" transform="translate(1 8.5)"></path><ellipse cx="4" cy="3.939" rx="4" ry="3.939" transform="translate(17.5 17.123)"></ellipse><path d="M38,26H3a3,3,0,0,1-3-3V22.9H37.9V0H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26Z" transform="translate(8 15.5)"></path></g></svg>
                                </div>
                                <div class = "small_sidebar_item_icon_1">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-1402,27h-35a3,3,0,0,1-3-3V3a3,3,0,0,1,3-3h35a3,3,0,0,1,3,3V24A3,3,0,0,1-1402,27Zm-17.5-17.377a3.974,3.974,0,0,0-4,3.938,3.974,3.974,0,0,0,4,3.938,3.974,3.974,0,0,0,4-3.938A3.974,3.974,0,0,0-1419.5,9.623Z" transform="translate(1441 7.5)"></path><path d="M38,26H3a3,3,0,0,1-3-3V22.9H37.9V0H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26Z" transform="translate(8 15.5)"></path></g></svg>
                                </div>
                            </div>
                            <div class = "small_sidebar_item md-ripples" onclick = "loadAdmin_partner_approval();" id = "small_sidebar_item_admin_partner_approval" onmouseenter = "hoverInformation(this, getLanguage('sidebar_admin_partner_approval'));">
                                <div class = "small_sidebar_item_left">
                                    <div class = "small_sidebar_item_left_line"></div>
                                </div>
                                <div class = "small_sidebar_item_icon_0">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"> <defs> <clipPath id="clip-partner"> <rect width="50" height="50"/> </clipPath> </defs> <g id="partner" clip-path="url(#clip-partner)"> <path id="빼기_31" data-name="빼기 31" d="M-1779.87,28.619a9.76,9.76,0,0,1-3.441-.734l-15.976-11.724L-1800,0l2.773,2.561c.025.025,2.571,2.509,8.333,2.509A32.869,32.869,0,0,0-1775.732,1.8l19.514,18.062a4.891,4.891,0,0,1-.781,1.767,4.231,4.231,0,0,1-3.633,1.767,8.044,8.044,0,0,1-2.029-.287,4,4,0,0,1-.714,1.441,3.836,3.836,0,0,1-3.179,1.441,8.953,8.953,0,0,1-3.289-.743,3.306,3.306,0,0,1-.821,1.087,4.632,4.632,0,0,1-3.191,1.087,9.433,9.433,0,0,1-2.589-.406A3.763,3.763,0,0,1-1779.87,28.619Zm-16.785-22.354.33,8.177,14.337,10.634a9.206,9.206,0,0,0,2.252.434,1.311,1.311,0,0,0,.682-.14l-.477-3.007c.035.018,3.669,1.9,5.842,1.9a3.014,3.014,0,0,0,.466-.034.645.645,0,0,0,.446-.237c.36-.377.766-1.329.654-3.72.033.025,3.424,2.587,5.508,2.587.072,0,.143,0,.211-.009h.019a.877.877,0,0,0,.665-.356c.349-.43.664-1.435.175-3.785a14.548,14.548,0,0,0,5.141,1.568c.069,0,.137,0,.2-.005L-1776.467,5.2c-.253.105-6.2,2.537-11.3,2.687-.218.006-.439.01-.658.01a20.479,20.479,0,0,1-8.234-1.631h0Z" transform="translate(1800.326 18.801)"/> <path id="빼기_32" data-name="빼기 32" d="M-1756.977,31.092h0l-19.725-17.8,0,0a22.763,22.763,0,0,1-3.717,2.218,21.317,21.317,0,0,1-9.039,2.223,15.894,15.894,0,0,1-5.407-.933,10.25,10.25,0,0,1-2.369-1.72A8.823,8.823,0,0,1-1800,9.67l.015-.01c.643-.4,4.057-2.5,8.173-4.648s9.772-4.764,13.278-5a3.008,3.008,0,0,1,.357-.015c1.468,0,7.663.5,25.768,6.93V29.191a2.9,2.9,0,0,0-1-.16,4.437,4.437,0,0,0-3.564,2.06Zm-19.65-20.827h0a2.809,2.809,0,0,1,1.62.554.464.464,0,0,0,.131.078c.12,0,17.76,15.985,17.938,16.147a2.873,2.873,0,0,1,1.437-.631V9.142c-16.235-5.911-22.43-6.068-22.491-6.069h-.087c-5.227,0-18.291,7.923-18.422,8a2.737,2.737,0,0,0,.713,1.4,7.768,7.768,0,0,0,4.377,2.215,9.158,9.158,0,0,0,1.976.207c4.655,0,9.568-3.064,10.963-4A3.314,3.314,0,0,1-1776.628,10.265Z" transform="translate(1801.031 2.55)"/> </g> </svg>
                                </div>
                                <div class = "small_sidebar_item_icon_1">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-142.811 -236.621)"><path d="M53.98,12187.691l.526,11.8,15.162,11.183s5.608,1.869,5.024-1.578c0,0,6.542,2.979,6.835-1.985,0,0,6.951,4.381,6.834-1.928,0,0,5.024,2.1,5.958-.759l-18.149-16.733s-8.4,3.33-13.953,2.921S53.98,12187.691,53.98,12187.691Z" transform="translate(90.831 -11928.661)"></path><path d="M67.463,11904.994s1.216,6.071,8.582,5.92a20.763,20.763,0,0,0,12.117-4.179,1.45,1.45,0,0,1,1.9,0c.911.836,18.708,16.859,18.708,16.859a4.916,4.916,0,0,1,3.1-1.394v-19.547s-19.412-7.01-24.939-6.471S67.463,11904.994,67.463,11904.994Z" transform="translate(78.051 -11655.431)"></path></g></g></svg>
                                </div>
                            </div>
                        </div>
                        <div class = "big_sidebar_line"></div>
                    </div>
                </div>
            </div>
            <div id = "wrap_sidebar_my_account" style = "display: none;">
                <!-- 사이드바 -->
                <div class = "big_sidebar scroll">
                    <div class = "big_sidebar_items">
                        <div name = "big_sidebar_item_my_account_management" onclick = "loadMyAccount_management();" class = "big_sidebar_item md-ripples">
                            <div class = "big_sidebar_item_line"></div>
                            <div class = "big_sidebar_item_icon_0">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,22A11,11,0,0,1,3.222,3.222,11,11,0,1,1,18.778,18.778,10.928,10.928,0,0,1,11,22ZM11,3a8,8,0,1,0,8,8A8.009,8.009,0,0,0,11,3Z" transform="translate(14)"></path><path d="M29.719,56H19A19,19,0,0,1,0,37V19A19,19,0,0,1,19,0H29.719a19,19,0,0,1,19,19V37a19,19,0,0,1-19,19Zm-11-52.5a16.018,16.018,0,0,0-16,16v18a16.018,16.018,0,0,0,16,16h11a16.018,16.018,0,0,0,16-16v-18a16.018,16.018,0,0,0-16-16Z" transform="translate(1.281 25)"></path></g></svg>
                            </div>
                            <div class = "big_sidebar_item_icon_1">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><circle cx="11" cy="11" r="11" transform="translate(14)"></circle><circle cx="8" cy="8" r="8" transform="translate(17 3)"></circle><rect width="48.719" height="56" rx="19" transform="translate(1.281 25)"></rect><rect width="43" height="50" rx="16" transform="translate(4 28.5)"></rect></g></svg>
                            </div>
                            <div class = "big_sidebar_item_text">
                                ...
                            </div>
                        </div>
                        <div name = "big_sidebar_item_my_account_personal_info" onclick = "loadMyAccount_personal_info();" class = "big_sidebar_item md-ripples">
                            <div class = "big_sidebar_item_line"></div>
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M6 0v32h24v-32h-24zM18 8.010c2.203 0 3.99 1.786 3.99 3.99s-1.786 3.99-3.99 3.99-3.99-1.786-3.99-3.99 1.786-3.99 3.99-3.99v0zM24 24h-12v-2c0-2.209 1.791-4 4-4v0h4c2.209 0 4 1.791 4 4v2z"></path><path d="M2 2h3v6h-3v-6z"></path><path d="M2 10h3v6h-3v-6z"></path><path d="M2 18h3v6h-3v-6z"></path><path d="M2 26h3v6h-3v-6z"></path></svg>
                            <div class = "big_sidebar_item_text">
                                ...
                            </div>
                        </div>
                        <div name = "big_sidebar_item_my_account_privacy" onclick = "loadMyAccount_privacy();" class = "big_sidebar_item md-ripples">
                            <div class = "big_sidebar_item_line"></div>
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 3h-6c-3.866 0-7 3.134-7 7s3.134 7 7 7h6c3.866 0 7-3.134 7-7s-3.134-7-7-7zM13 15c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z"></path></svg>
                            <div class = "big_sidebar_item_text">
                                ...
                            </div>
                        </div>
                        <div name = "big_sidebar_item_my_account_security" onclick = "loadMyAccount_security();" class = "big_sidebar_item md-ripples">
                            <div class = "big_sidebar_item_line"></div>
                            <!-- Generated by IcoMoon.io -->
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M4 8v-2c0-3.314 2.686-6 6-6s6 2.686 6 6v0 2h1c1.105 0 2 0.895 2 2v0 8c0 1.105-0.895 2-2 2v0h-14c-1.105 0-2-0.895-2-2v0-8c0-1.1 0.9-2 2-2h1zM9 14.73v2.27h2v-2.27c0.602-0.352 1-0.996 1-1.732 0-1.105-0.895-2-2-2s-2 0.895-2 2c0 0.736 0.398 1.38 0.991 1.727l0.009 0.005zM7 6v2h6v-2c0-1.657-1.343-3-3-3s-3 1.343-3 3v0z"></path></svg>
                            <div class = "big_sidebar_item_text">
                                ...
                            </div>
                        </div>
                    </div>
                    <div class = "big_sidebar_line"></div>
                </div>
                <!-- 작은 사이드바 -->
                <div class = "small_sidebar">
                    <div class = "small_sidebar_right">
                        <div class = "small_sidebar_items">
                            <div class = "small_sidebar_item md-ripples" onclick = "loadMyAccount_management();" id = "small_sidebar_item_my_account_management" onmouseenter = "hoverInformation(this, getLanguage('sidebar_my_account_management'));">
                                <div class = "small_sidebar_item_left">
                                    <div class = "small_sidebar_item_left_line"></div>
                                </div>
                                <div class = "small_sidebar_item_icon_0">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,22A11,11,0,0,1,3.222,3.222,11,11,0,1,1,18.778,18.778,10.928,10.928,0,0,1,11,22ZM11,3a8,8,0,1,0,8,8A8.009,8.009,0,0,0,11,3Z" transform="translate(14)"></path><path d="M29.719,56H19A19,19,0,0,1,0,37V19A19,19,0,0,1,19,0H29.719a19,19,0,0,1,19,19V37a19,19,0,0,1-19,19Zm-11-52.5a16.018,16.018,0,0,0-16,16v18a16.018,16.018,0,0,0,16,16h11a16.018,16.018,0,0,0,16-16v-18a16.018,16.018,0,0,0-16-16Z" transform="translate(1.281 25)"></path></g></svg>
                                </div>
                                <div class = "small_sidebar_item_icon_1">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><circle cx="11" cy="11" r="11" transform="translate(14)"></circle><circle cx="8" cy="8" r="8" transform="translate(17 3)"></circle><rect width="48.719" height="56" rx="19" transform="translate(1.281 25)"></rect><rect width="43" height="50" rx="16" transform="translate(4 28.5)"></rect></g></svg>
                                </div>
                            </div>
                            <div class = "small_sidebar_item md-ripples" onclick = "loadMyAccount_personal_info();" id = "small_sidebar_item_my_account_personal_info" onmouseenter = "hoverInformation(this, getLanguage('sidebar_my_account_personal_info'));">
                                <div class = "small_sidebar_item_left">
                                    <div class = "small_sidebar_item_left_line"></div>
                                </div>
                                <!-- Generated by IcoMoon.io -->
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M6 0v32h24v-32h-24zM18 8.010c2.203 0 3.99 1.786 3.99 3.99s-1.786 3.99-3.99 3.99-3.99-1.786-3.99-3.99 1.786-3.99 3.99-3.99v0zM24 24h-12v-2c0-2.209 1.791-4 4-4v0h4c2.209 0 4 1.791 4 4v2z"></path><path d="M2 2h3v6h-3v-6z"></path><path d="M2 10h3v6h-3v-6z"></path><path d="M2 18h3v6h-3v-6z"></path><path d="M2 26h3v6h-3v-6z"></path></svg>
                            </div>
                            <div class = "small_sidebar_item md-ripples" onclick = "loadMyAccount_privacy();" id = "small_sidebar_item_my_account_privacy" onmouseenter = "hoverInformation(this, getLanguage('sidebar_my_account_privacy'));">
                                <div class = "small_sidebar_item_left">
                                    <div class = "small_sidebar_item_left_line"></div>
                                </div>
                                <!-- Generated by IcoMoon.io -->
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 3h-6c-3.866 0-7 3.134-7 7s3.134 7 7 7h6c3.866 0 7-3.134 7-7s-3.134-7-7-7zM13 15c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z"></path></svg>
                            </div>
                            <div class = "small_sidebar_item md-ripples" onclick = "loadMyAccount_security();" id = "small_sidebar_item_my_account_security" onmouseenter = "hoverInformation(this, getLanguage('sidebar_my_account_security'));">
                                <div class = "small_sidebar_item_left">
                                    <div class = "small_sidebar_item_left_line"></div>
                                </div>
                                <!-- Generated by IcoMoon.io -->
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M4 8v-2c0-3.314 2.686-6 6-6s6 2.686 6 6v0 2h1c1.105 0 2 0.895 2 2v0 8c0 1.105-0.895 2-2 2v0h-14c-1.105 0-2-0.895-2-2v0-8c0-1.1 0.9-2 2-2h1zM9 14.73v2.27h2v-2.27c0.602-0.352 1-0.996 1-1.732 0-1.105-0.895-2-2-2s-2 0.895-2 2c0 0.736 0.398 1.38 0.991 1.727l0.009 0.005zM7 6v2h6v-2c0-1.657-1.343-3-3-3s-3 1.343-3 3v0z"></path></svg>
                            </div>
                        </div>
                        <div class = "big_sidebar_line"></div>
                    </div>
                </div>
            </div>

            <div class = "contents" id = "contents" ontouchstart = "touchStartPullToRefresh(event);" onmousedown = "(event.button == 2) ? touchStartPullToRefresh(event) : null;">
                <!-- item -->
            </div>

            <footer>
                <div id = "wrap_footer_default" style = "display: flex; width: 100%; height: 100%;">
                    <div id = "footer_item_home" class = "footer_item md-ripples" onclick = "loadMenu_home();">
                        <div class = "footer_item_icon_0">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M15.341-101.5H.025A1.525,1.525,0,0,1-1.5-103.026v-26.866a1.525,1.525,0,0,1,.447-1.078l22.941-20.083a1.525,1.525,0,0,1,2.156,0L47-130.971a1.525,1.525,0,0,1,.447,1.079v26.865a1.525,1.525,0,0,1-1.525,1.525H30.591a1.525,1.525,0,0,1-1.078-.447,1.525,1.525,0,0,1-.447-1.078v-16.387h-12.2v16.387a1.526,1.526,0,0,1-.447,1.079A1.526,1.526,0,0,1,15.341-101.5ZM1.55-104.552H13.816v-16.387a1.525,1.525,0,0,1,.447-1.078,1.525,1.525,0,0,1,1.078-.447H30.591a1.525,1.525,0,0,1,1.525,1.525v16.387H44.4V-129.26L22.966-147.819,1.55-129.261Z" transform="translate(2.026 151.5)"/></g></svg>
                        </div>
                        <div class = "footer_item_icon_1">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M15.341-101.5H.025A1.525,1.525,0,0,1-1.5-103.026v-26.866a1.525,1.525,0,0,1,.447-1.078l22.941-20.083a1.525,1.525,0,0,1,2.156,0L47-130.971a1.525,1.525,0,0,1,.447,1.079v26.865a1.525,1.525,0,0,1-1.525,1.525H30.591a1.525,1.525,0,0,1-1.078-.447,1.525,1.525,0,0,1-.447-1.078v-16.387h-12.2v16.387a1.526,1.526,0,0,1-.447,1.079A1.526,1.526,0,0,1,15.341-101.5Z" transform="translate(2.026 151.5)"/></g></svg>
                        </div>
                        <div class = "footer_item_text">
                            ...
                        </div>
                        <div class = "footer_item_line"></div>
                    </div>
                    <div id = "footer_item_explore" onclick = "loadMenu_explore();" class = "footer_item md-ripples">
                        <div class = "footer_item_icon_0">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,3a22.007,22.007,0,0,0-8.562,42.272A22.006,22.006,0,0,0,33.562,4.728,21.859,21.859,0,0,0,25,3m0-3A25,25,0,1,1,0,25,25,25,0,0,1,25,0Z"/><path d="M-470.667-100v0L-480-125l9.333-25L-461-125l-9.666,25Zm.167-29a4.505,4.505,0,0,0-4.5,4.5,4.505,4.505,0,0,0,4.5,4.5,4.505,4.505,0,0,0,4.5-4.5A4.505,4.505,0,0,0-470.5-129Z" transform="translate(269.305 446.082) rotate(45)"/></g></svg>
                        </div>
                        <div class = "footer_item_icon_1">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-335-100a24.837,24.837,0,0,1-9.809-2,24.918,24.918,0,0,1-7.986-5.443l24.513-10.842L-317.44-142.8A24.917,24.917,0,0,1-312-134.809,24.837,24.837,0,0,1-310-125a24.842,24.842,0,0,1-1.965,9.731,24.918,24.918,0,0,1-5.358,7.947,24.918,24.918,0,0,1-7.947,5.358A24.843,24.843,0,0,1-335-100Zm-17.8-7.441A24.85,24.85,0,0,1-360-125a24.842,24.842,0,0,1,1.965-9.731,24.918,24.918,0,0,1,5.358-7.947,24.918,24.918,0,0,1,7.947-5.358A24.843,24.843,0,0,1-335-150a24.85,24.85,0,0,1,17.559,7.2l-24.277,11.078-11.077,24.275Zm17.441-12.708a4.468,4.468,0,0,1-3.182-1.316,4.468,4.468,0,0,1-1.316-3.182,4.47,4.47,0,0,1,1.316-3.182,4.469,4.469,0,0,1,3.182-1.316,4.47,4.47,0,0,1,3.182,1.316,4.506,4.506,0,0,1,0,6.364A4.47,4.47,0,0,1-335.354-120.149Z" transform="translate(360 150)"/></g></svg>
                        </div>
                        <div class = "footer_item_text">
                            ...
                        </div>
                        <div class = "footer_item_line"></div>
                    </div>
                    <div id = "footer_item_library" class = "footer_item md-ripples" onclick = "loadMenu_library();">
                        <div class = "footer_item_icon_0">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,22A11,11,0,0,1,3.222,3.222,11,11,0,1,1,18.778,18.778,10.928,10.928,0,0,1,11,22ZM11,3a8,8,0,1,0,8,8A8.009,8.009,0,0,0,11,3Z" transform="translate(14)"></path><path d="M29.719,56H19A19,19,0,0,1,0,37V19A19,19,0,0,1,19,0H29.719a19,19,0,0,1,19,19V37a19,19,0,0,1-19,19Zm-11-52.5a16.018,16.018,0,0,0-16,16v18a16.018,16.018,0,0,0,16,16h11a16.018,16.018,0,0,0,16-16v-18a16.018,16.018,0,0,0-16-16Z" transform="translate(1.281 25)"></path></g></svg>
                        </div>
                        <div class = "footer_item_icon_1">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><circle cx="11" cy="11" r="11" transform="translate(14)"></circle><circle cx="8" cy="8" r="8" transform="translate(17 3)"></circle><rect width="48.719" height="56" rx="19" transform="translate(1.281 25)"></rect><rect width="43" height="50" rx="16" transform="translate(4 28.5)"></rect></g></svg>
                        </div>
                        <div class = "footer_item_text">
                            ...
                        </div>
                        <div class = "footer_item_line"></div>
                    </div>
                </div>
                <div id = "wrap_footer_workspace" style = "display: none; width: 100%; height: 100%;">
                    <div id = "wrap_footer_workspace_default" style = "width: 100%; height: 100%;">
                        <div id = "footer_item_workspace_dashboard" onclick = "loadWorkspace_dashboard();" class = "footer_item md-ripples">
                            <div class = "footer_item_icon_0">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M21,26H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H21a1,1,0,0,1,1,1V25A1,1,0,0,1,21,26ZM2.869,2.889V23.111H19.13V2.889Z"></path><path d="M22,19H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H22a1,1,0,0,1,1,1V18A1,1,0,0,1,22,19ZM2.875,2.85v13.3h17.25V2.85Z" transform="translate(27)"></path><path d="M21,19H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H21a1,1,0,0,1,1,1V18A1,1,0,0,1,21,19ZM2.869,2.85v13.3H19.13V2.85Z" transform="translate(0 31)"></path><path d="M22,26H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H22a1,1,0,0,1,1,1V25A1,1,0,0,1,22,26ZM2.875,2.889V23.111h17.25V2.889Z" transform="translate(27 24)"></path></g></svg>
                            </div>
                            <div class = "footer_item_icon_1">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="22" height="26" rx="1"></rect><rect width="17" height="21" transform="translate(3 3)"></rect><rect width="23" height="19" rx="1" transform="translate(27)"></rect><rect width="18" height="14" transform="translate(29 3)"></rect><rect width="22" height="19" rx="1" transform="translate(0 31)"></rect><rect width="17" height="14" transform="translate(3 33)"></rect><rect width="23" height="26" rx="1" transform="translate(27 24)"></rect><rect width="18" height="21" transform="translate(29 26)"></rect></g></svg>
                            </div>
                            <div class = "footer_item_text">
                                ...
                            </div>
                            <div class = "footer_item_line"></div>
                        </div>
                        <div id = "footer_item_workspace_my_works" onclick = "loadWorkspace_my_works();" class = "footer_item md-ripples">
                            <div class = "footer_item_icon_0">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,700a1.5,1.5,0,0,1,.844.26l23.5,16A1.5,1.5,0,0,1,49.4,718.7L25.9,736.2a1.5,1.5,0,0,1-1.792,0L.6,718.7a1.5,1.5,0,0,1,.052-2.443l23.5-16A1.5,1.5,0,0,1,25,700Zm20.915,17.555L25,703.315,4.085,717.555,25,733.13Z" transform="translate(0 -700)"></path><path d="M24.953,736.551a1.5,1.5,0,0,1-.9-.3L.6,718.754a1.5,1.5,0,0,1,1.794-2.4l22.558,16.832,22.65-16.834a1.5,1.5,0,1,1,1.789,2.408l-23.547,17.5A1.5,1.5,0,0,1,24.953,736.551Z" transform="translate(0 -686.551)"></path></g></svg>
                            </div>
                            <div class = "footer_item_icon_1">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,700a1.5,1.5,0,0,1,.844.26l23.5,16A1.5,1.5,0,0,1,49.4,718.7L25.9,736.2a1.5,1.5,0,0,1-1.792,0L.6,718.7a1.5,1.5,0,0,1,.052-2.443l23.5-16A1.5,1.5,0,0,1,25,700Z" transform="translate(0 -700)"></path><path d="M24.953,736.551a1.5,1.5,0,0,1-.9-.3L.6,718.754a1.5,1.5,0,0,1,1.794-2.4l22.558,16.832,22.65-16.834a1.5,1.5,0,1,1,1.789,2.408l-23.547,17.5A1.5,1.5,0,0,1,24.953,736.551Z" transform="translate(0 -686.551)"></path></g></svg>
                            </div>
                            <div class = "footer_item_text">
                                ...
                            </div>
                            <div class = "footer_item_line"></div>
                        </div>
                        <div id = "footer_item_workspace_monetization" onclick = "loadWorkspace_monetization();" class = "footer_item md-ripples">
                            <div class = "footer_item_icon_0">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M38,26H3a3,3,0,0,1-3-3V2A3,3,0,0,1,3-1H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26ZM3.1,2.105V22.9H37.9V2.105Z" transform="translate(1 8.5)"></path><ellipse cx="4" cy="3.939" rx="4" ry="3.939" transform="translate(17.5 17.123)"></ellipse><path d="M38,26H3a3,3,0,0,1-3-3V22.9H37.9V0H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26Z" transform="translate(8 15.5)"></path></g></svg>
                            </div>
                            <div class = "footer_item_icon_1">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-1402,27h-35a3,3,0,0,1-3-3V3a3,3,0,0,1,3-3h35a3,3,0,0,1,3,3V24A3,3,0,0,1-1402,27Zm-17.5-17.377a3.974,3.974,0,0,0-4,3.938,3.974,3.974,0,0,0,4,3.938,3.974,3.974,0,0,0,4-3.938A3.974,3.974,0,0,0-1419.5,9.623Z" transform="translate(1441 7.5)"></path><path d="M38,26H3a3,3,0,0,1-3-3V22.9H37.9V0H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26Z" transform="translate(8 15.5)"></path></g></svg>
                            </div>
                            <div class = "footer_item_text">
                                ...
                            </div>
                            <div class = "footer_item_line"></div>
                        </div>
                        <div id = "footer_item_workspace_my_page_settings" onclick = "loadWorkspace_my_page_settings();" class = "footer_item md-ripples">
                            <div class = "footer_item_icon_0">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,22A11,11,0,0,1,3.222,3.222,11,11,0,1,1,18.778,18.778,10.928,10.928,0,0,1,11,22ZM11,3a8,8,0,1,0,8,8A8.009,8.009,0,0,0,11,3Z" transform="translate(14)"></path><path d="M29.719,56H19A19,19,0,0,1,0,37V19A19,19,0,0,1,19,0H29.719a19,19,0,0,1,19,19V37a19,19,0,0,1-19,19Zm-11-52.5a16.018,16.018,0,0,0-16,16v18a16.018,16.018,0,0,0,16,16h11a16.018,16.018,0,0,0,16-16v-18a16.018,16.018,0,0,0-16-16Z" transform="translate(1.281 25)"></path></g></svg>
                            </div>
                            <div class = "footer_item_icon_1">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><circle cx="11" cy="11" r="11" transform="translate(14)"></circle><circle cx="8" cy="8" r="8" transform="translate(17 3)"></circle><rect width="48.719" height="56" rx="19" transform="translate(1.281 25)"></rect><rect width="43" height="50" rx="16" transform="translate(4 28.5)"></rect></g></svg>
                            </div>
                            <div class = "footer_item_text">
                                ...
                            </div>
                            <div class = "footer_item_line"></div>
                        </div>
                        <div id = "footer_item_workspace_partner" onclick = "loadWorkspace_partner();" class = "footer_item md-ripples">
                            <div class = "footer_item_icon_0">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"> <defs> <clipPath id="clip-partner"> <rect width="50" height="50"></rect> </clipPath> </defs> <g id="partner" clip-path="url(#clip-partner)"> <path id="빼기_31" data-name="빼기 31" d="M-1779.87,28.619a9.76,9.76,0,0,1-3.441-.734l-15.976-11.724L-1800,0l2.773,2.561c.025.025,2.571,2.509,8.333,2.509A32.869,32.869,0,0,0-1775.732,1.8l19.514,18.062a4.891,4.891,0,0,1-.781,1.767,4.231,4.231,0,0,1-3.633,1.767,8.044,8.044,0,0,1-2.029-.287,4,4,0,0,1-.714,1.441,3.836,3.836,0,0,1-3.179,1.441,8.953,8.953,0,0,1-3.289-.743,3.306,3.306,0,0,1-.821,1.087,4.632,4.632,0,0,1-3.191,1.087,9.433,9.433,0,0,1-2.589-.406A3.763,3.763,0,0,1-1779.87,28.619Zm-16.785-22.354.33,8.177,14.337,10.634a9.206,9.206,0,0,0,2.252.434,1.311,1.311,0,0,0,.682-.14l-.477-3.007c.035.018,3.669,1.9,5.842,1.9a3.014,3.014,0,0,0,.466-.034.645.645,0,0,0,.446-.237c.36-.377.766-1.329.654-3.72.033.025,3.424,2.587,5.508,2.587.072,0,.143,0,.211-.009h.019a.877.877,0,0,0,.665-.356c.349-.43.664-1.435.175-3.785a14.548,14.548,0,0,0,5.141,1.568c.069,0,.137,0,.2-.005L-1776.467,5.2c-.253.105-6.2,2.537-11.3,2.687-.218.006-.439.01-.658.01a20.479,20.479,0,0,1-8.234-1.631h0Z" transform="translate(1800.326 18.801)"></path> <path id="빼기_32" data-name="빼기 32" d="M-1756.977,31.092h0l-19.725-17.8,0,0a22.763,22.763,0,0,1-3.717,2.218,21.317,21.317,0,0,1-9.039,2.223,15.894,15.894,0,0,1-5.407-.933,10.25,10.25,0,0,1-2.369-1.72A8.823,8.823,0,0,1-1800,9.67l.015-.01c.643-.4,4.057-2.5,8.173-4.648s9.772-4.764,13.278-5a3.008,3.008,0,0,1,.357-.015c1.468,0,7.663.5,25.768,6.93V29.191a2.9,2.9,0,0,0-1-.16,4.437,4.437,0,0,0-3.564,2.06Zm-19.65-20.827h0a2.809,2.809,0,0,1,1.62.554.464.464,0,0,0,.131.078c.12,0,17.76,15.985,17.938,16.147a2.873,2.873,0,0,1,1.437-.631V9.142c-16.235-5.911-22.43-6.068-22.491-6.069h-.087c-5.227,0-18.291,7.923-18.422,8a2.737,2.737,0,0,0,.713,1.4,7.768,7.768,0,0,0,4.377,2.215,9.158,9.158,0,0,0,1.976.207c4.655,0,9.568-3.064,10.963-4A3.314,3.314,0,0,1-1776.628,10.265Z" transform="translate(1801.031 2.55)"></path> </g> </svg>
                            </div>
                            <div class = "footer_item_icon_1">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-142.811 -236.621)"><path d="M53.98,12187.691l.526,11.8,15.162,11.183s5.608,1.869,5.024-1.578c0,0,6.542,2.979,6.835-1.985,0,0,6.951,4.381,6.834-1.928,0,0,5.024,2.1,5.958-.759l-18.149-16.733s-8.4,3.33-13.953,2.921S53.98,12187.691,53.98,12187.691Z" transform="translate(90.831 -11928.661)"></path><path d="M67.463,11904.994s1.216,6.071,8.582,5.92a20.763,20.763,0,0,0,12.117-4.179,1.45,1.45,0,0,1,1.9,0c.911.836,18.708,16.859,18.708,16.859a4.916,4.916,0,0,1,3.1-1.394v-19.547s-19.412-7.01-24.939-6.471S67.463,11904.994,67.463,11904.994Z" transform="translate(78.051 -11655.431)"></path></g></g></svg>
                            </div>
                            <div class = "footer_item_text">
                                ...
                            </div>
                            <div class = "footer_item_line"></div>
                        </div>
                    </div>
                    <div id = "wrap_footer_workspace_custom" style = "width: 100%; height: 100%;">
                        ...
                    </div>
                </div>
                <div id = "wrap_footer_admin" style = "display: none; width: 100%; height: 100%;">
                    <div id = "footer_item_admin_dashboard" onclick = "loadAdmin_dashboard();" class = "footer_item md-ripples">
                        <div class = "footer_item_icon_0">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M21,26H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H21a1,1,0,0,1,1,1V25A1,1,0,0,1,21,26ZM2.869,2.889V23.111H19.13V2.889Z"></path><path d="M22,19H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H22a1,1,0,0,1,1,1V18A1,1,0,0,1,22,19ZM2.875,2.85v13.3h17.25V2.85Z" transform="translate(27)"></path><path d="M21,19H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H21a1,1,0,0,1,1,1V18A1,1,0,0,1,21,19ZM2.869,2.85v13.3H19.13V2.85Z" transform="translate(0 31)"></path><path d="M22,26H1a1,1,0,0,1-1-1V1A1,1,0,0,1,1,0H22a1,1,0,0,1,1,1V25A1,1,0,0,1,22,26ZM2.875,2.889V23.111h17.25V2.889Z" transform="translate(27 24)"></path></g></svg>
                        </div>
                        <div class = "footer_item_icon_1">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="22" height="26" rx="1"></rect><rect width="17" height="21" transform="translate(3 3)"></rect><rect width="23" height="19" rx="1" transform="translate(27)"></rect><rect width="18" height="14" transform="translate(29 3)"></rect><rect width="22" height="19" rx="1" transform="translate(0 31)"></rect><rect width="17" height="14" transform="translate(3 33)"></rect><rect width="23" height="26" rx="1" transform="translate(27 24)"></rect><rect width="18" height="21" transform="translate(29 26)"></rect></g></svg>
                        </div>
                        <div class = "footer_item_text">
                            ...
                        </div>
                        <div class = "footer_item_line"></div>
                    </div>
                    <div id = "footer_item_admin_questions" onclick = "loadAdmin_questions();" class = "footer_item md-ripples">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"/></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M25,50A25.007,25.007,0,0,1,15.269,1.965,25.007,25.007,0,0,1,34.731,48.036,24.843,24.843,0,0,1,25,50ZM25,3A22,22,0,1,0,47,25,22.025,22.025,0,0,0,25,3Z"/><g transform="translate(-24 6)"><rect width="3" height="24" rx="1.5" transform="translate(48 11)"/><rect width="3" height="4" rx="1.5" transform="translate(48 3)"/></g></g></svg>
                        <div class = "footer_item_text">
                            ...
                        </div>
                        <div class = "footer_item_line"></div>
                    </div>
                    <div id = "footer_item_admin_user_report" onclick = "loadAdmin_user_report();" class = "footer_item md-ripples">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5" transform="translate(9)"></rect><path d="M13.422,25.422s6.941-3.318,12.163-3.086,17.81,4.641,17.81,4.641V9.456S27.963,4,24.656,3.945s-9.456,2.9-9.456,2.9L13.422,4.235S18.913.754,24.25,1.1,43.395,6.15,43.395,6.15h3.249V30.806L25.584,25.422S18.391,25.816,15.2,27.9Z" transform="translate(-0.449)"></path></g></svg>
                        <div class = "footer_item_text">
                            ...
                        </div>
                        <div class = "footer_item_line"></div>
                    </div>
                    <div id = "footer_item_admin_work_report" onclick = "loadAdmin_work_report();" class = "footer_item md-ripples">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="3" height="50" rx="1.5" transform="translate(9)"></rect><path d="M13.422,25.422s6.941-3.318,12.163-3.086,17.81,4.641,17.81,4.641V9.456S27.963,4,24.656,3.945s-9.456,2.9-9.456,2.9L13.422,4.235S18.913.754,24.25,1.1,43.395,6.15,43.395,6.15h3.249V30.806L25.584,25.422S18.391,25.816,15.2,27.9Z" transform="translate(-0.449)"></path></g></svg>
                        <div class = "footer_item_text">
                            ...
                        </div>
                        <div class = "footer_item_line"></div>
                    </div>
                    <div id = "footer_item_admin_monetization_approval" onclick = "loadAdmin_monetization_approval();" class = "footer_item md-ripples">
                        <div class = "footer_item_icon_0">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M38,26H3a3,3,0,0,1-3-3V2A3,3,0,0,1,3-1H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26ZM3.1,2.105V22.9H37.9V2.105Z" transform="translate(1 8.5)"></path><ellipse cx="4" cy="3.939" rx="4" ry="3.939" transform="translate(17.5 17.123)"></ellipse><path d="M38,26H3a3,3,0,0,1-3-3V22.9H37.9V0H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26Z" transform="translate(8 15.5)"></path></g></svg>
                        </div>
                        <div class = "footer_item_icon_1">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-1402,27h-35a3,3,0,0,1-3-3V3a3,3,0,0,1,3-3h35a3,3,0,0,1,3,3V24A3,3,0,0,1-1402,27Zm-17.5-17.377a3.974,3.974,0,0,0-4,3.938,3.974,3.974,0,0,0,4,3.938,3.974,3.974,0,0,0,4-3.938A3.974,3.974,0,0,0-1419.5,9.623Z" transform="translate(1441 7.5)"></path><path d="M38,26H3a3,3,0,0,1-3-3V22.9H37.9V0H38a3,3,0,0,1,3,3V23A3,3,0,0,1,38,26Z" transform="translate(8 15.5)"></path></g></svg>
                        </div>
                        <div class = "footer_item_text">
                            ...
                        </div>
                        <div class = "footer_item_line"></div>
                    </div>
                    <div id = "footer_item_admin_partner_approval" onclick = "loadAdmin_partner_approval();" class = "footer_item md-ripples">
                        <div class = "footer_item_icon_0">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"> <defs> <clipPath id="clip-partner"> <rect width="50" height="50"></rect> </clipPath> </defs> <g id="partner" clip-path="url(#clip-partner)"> <path id="빼기_31" data-name="빼기 31" d="M-1779.87,28.619a9.76,9.76,0,0,1-3.441-.734l-15.976-11.724L-1800,0l2.773,2.561c.025.025,2.571,2.509,8.333,2.509A32.869,32.869,0,0,0-1775.732,1.8l19.514,18.062a4.891,4.891,0,0,1-.781,1.767,4.231,4.231,0,0,1-3.633,1.767,8.044,8.044,0,0,1-2.029-.287,4,4,0,0,1-.714,1.441,3.836,3.836,0,0,1-3.179,1.441,8.953,8.953,0,0,1-3.289-.743,3.306,3.306,0,0,1-.821,1.087,4.632,4.632,0,0,1-3.191,1.087,9.433,9.433,0,0,1-2.589-.406A3.763,3.763,0,0,1-1779.87,28.619Zm-16.785-22.354.33,8.177,14.337,10.634a9.206,9.206,0,0,0,2.252.434,1.311,1.311,0,0,0,.682-.14l-.477-3.007c.035.018,3.669,1.9,5.842,1.9a3.014,3.014,0,0,0,.466-.034.645.645,0,0,0,.446-.237c.36-.377.766-1.329.654-3.72.033.025,3.424,2.587,5.508,2.587.072,0,.143,0,.211-.009h.019a.877.877,0,0,0,.665-.356c.349-.43.664-1.435.175-3.785a14.548,14.548,0,0,0,5.141,1.568c.069,0,.137,0,.2-.005L-1776.467,5.2c-.253.105-6.2,2.537-11.3,2.687-.218.006-.439.01-.658.01a20.479,20.479,0,0,1-8.234-1.631h0Z" transform="translate(1800.326 18.801)"></path> <path id="빼기_32" data-name="빼기 32" d="M-1756.977,31.092h0l-19.725-17.8,0,0a22.763,22.763,0,0,1-3.717,2.218,21.317,21.317,0,0,1-9.039,2.223,15.894,15.894,0,0,1-5.407-.933,10.25,10.25,0,0,1-2.369-1.72A8.823,8.823,0,0,1-1800,9.67l.015-.01c.643-.4,4.057-2.5,8.173-4.648s9.772-4.764,13.278-5a3.008,3.008,0,0,1,.357-.015c1.468,0,7.663.5,25.768,6.93V29.191a2.9,2.9,0,0,0-1-.16,4.437,4.437,0,0,0-3.564,2.06Zm-19.65-20.827h0a2.809,2.809,0,0,1,1.62.554.464.464,0,0,0,.131.078c.12,0,17.76,15.985,17.938,16.147a2.873,2.873,0,0,1,1.437-.631V9.142c-16.235-5.911-22.43-6.068-22.491-6.069h-.087c-5.227,0-18.291,7.923-18.422,8a2.737,2.737,0,0,0,.713,1.4,7.768,7.768,0,0,0,4.377,2.215,9.158,9.158,0,0,0,1.976.207c4.655,0,9.568-3.064,10.963-4A3.314,3.314,0,0,1-1776.628,10.265Z" transform="translate(1801.031 2.55)"></path> </g> </svg>
                        </div>
                        <div class = "footer_item_icon_1">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><g transform="translate(-142.811 -236.621)"><path d="M53.98,12187.691l.526,11.8,15.162,11.183s5.608,1.869,5.024-1.578c0,0,6.542,2.979,6.835-1.985,0,0,6.951,4.381,6.834-1.928,0,0,5.024,2.1,5.958-.759l-18.149-16.733s-8.4,3.33-13.953,2.921S53.98,12187.691,53.98,12187.691Z" transform="translate(90.831 -11928.661)"></path><path d="M67.463,11904.994s1.216,6.071,8.582,5.92a20.763,20.763,0,0,0,12.117-4.179,1.45,1.45,0,0,1,1.9,0c.911.836,18.708,16.859,18.708,16.859a4.916,4.916,0,0,1,3.1-1.394v-19.547s-19.412-7.01-24.939-6.471S67.463,11904.994,67.463,11904.994Z" transform="translate(78.051 -11655.431)"></path></g></g></svg>
                        </div>
                        <div class = "footer_item_text">
                            ...
                        </div>
                        <div class = "footer_item_line"></div>
                    </div>
                </div>
                <div id = "wrap_footer_my_account" style = "display: none; width: 100%; height: 100%;">
                    <div id = "footer_item_my_account_management" onclick = "loadMyAccount_management();" class = "footer_item md-ripples">
                        <div class = "footer_item_icon_0">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M11,22A11,11,0,0,1,3.222,3.222,11,11,0,1,1,18.778,18.778,10.928,10.928,0,0,1,11,22ZM11,3a8,8,0,1,0,8,8A8.009,8.009,0,0,0,11,3Z" transform="translate(14)"></path><path d="M29.719,56H19A19,19,0,0,1,0,37V19A19,19,0,0,1,19,0H29.719a19,19,0,0,1,19,19V37a19,19,0,0,1-19,19Zm-11-52.5a16.018,16.018,0,0,0-16,16v18a16.018,16.018,0,0,0,16,16h11a16.018,16.018,0,0,0,16-16v-18a16.018,16.018,0,0,0-16-16Z" transform="translate(1.281 25)"></path></g></svg>
                        </div>
                        <div class = "footer_item_icon_1">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><circle cx="11" cy="11" r="11" transform="translate(14)"></circle><circle cx="8" cy="8" r="8" transform="translate(17 3)"></circle><rect width="48.719" height="56" rx="19" transform="translate(1.281 25)"></rect><rect width="43" height="50" rx="16" transform="translate(4 28.5)"></rect></g></svg>
                        </div>
                        <div class = "footer_item_text">
                            ...
                        </div>
                        <div class = "footer_item_line"></div>
                    </div>
                    <div id = "footer_item_my_account_personal_info" onclick = "loadMyAccount_personal_info();" class = "footer_item md-ripples">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M6 0v32h24v-32h-24zM18 8.010c2.203 0 3.99 1.786 3.99 3.99s-1.786 3.99-3.99 3.99-3.99-1.786-3.99-3.99 1.786-3.99 3.99-3.99v0zM24 24h-12v-2c0-2.209 1.791-4 4-4v0h4c2.209 0 4 1.791 4 4v2z"></path><path d="M2 2h3v6h-3v-6z"></path><path d="M2 10h3v6h-3v-6z"></path><path d="M2 18h3v6h-3v-6z"></path><path d="M2 26h3v6h-3v-6z"></path></svg>
                        <div class = "footer_item_text">
                            ...
                        </div>
                        <div class = "footer_item_line"></div>
                    </div>
                    <div id = "footer_item_my_account_privacy" onclick = "loadMyAccount_privacy();" class = "footer_item md-ripples">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 3h-6c-3.866 0-7 3.134-7 7s3.134 7 7 7h6c3.866 0 7-3.134 7-7s-3.134-7-7-7zM13 15c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z"></path></svg>
                        <div class = "footer_item_text">
                            ...
                        </div>
                        <div class = "footer_item_line"></div>
                    </div>
                    <div id = "footer_item_my_account_security" onclick = "loadMyAccount_security();" class = "footer_item md-ripples">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M4 8v-2c0-3.314 2.686-6 6-6s6 2.686 6 6v0 2h1c1.105 0 2 0.895 2 2v0 8c0 1.105-0.895 2-2 2v0h-14c-1.105 0-2-0.895-2-2v0-8c0-1.1 0.9-2 2-2h1zM9 14.73v2.27h2v-2.27c0.602-0.352 1-0.996 1-1.732 0-1.105-0.895-2-2-2s-2 0.895-2 2c0 0.736 0.398 1.38 0.991 1.727l0.009 0.005zM7 6v2h6v-2c0-1.657-1.343-3-3-3s-3 1.343-3 3v0z"></path></svg>
                        <div class = "footer_item_text">
                            ...
                        </div>
                        <div class = "footer_item_line"></div>
                    </div>
                </div>
            </footer>
        </main>

    </body>

    <!-- HTML 로드 후 -->
    <script>

        //다크모드 체크
        (getCookie("displayColor") != null) ? setDisplayColor(getCookie("displayColor")) : setDisplayColor(null);

        //사이트 로드
        siteLoad();

    </script>

    <script src = "https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
    <script src = "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"></script>

    <script>

        //사이트 버전
        var currentVersion = <?php echo $currentVersion; ?>;
        var checkedVersion = null;

        //사이트 업데이트 체크
        function checkUpdate() {
            //버전 체크
            const xhr = new XMLHttpRequest();
            const method = "POST";
            xhr.open(method, "/version.php");
            xhr.addEventListener('readystatechange', function (event) {
                const { target } = event;
                if (target.readyState === XMLHttpRequest.DONE) {
                    const { status } = target;
                    if (status === 0 || (status >= 200 && status < 400)) {
                        let xhrHtml = xhr.responseText.trim();
                        let version = Number.parseInt(xhrHtml);
                        //숫자인지
                        if (isNaN(version) == false) {
                            //업데이트 여부
                            if (version != currentVersion) {
                                function callback() {
                                    let menuNumber = getCurrentMenuNumber();
                                    let menuName = getCurrentMenuName();
                                    let contents = document.getElementById("contents_" + menuNumber);
                                    if (contents != null) {
                                        let errorCode = contents.getElementsByClassName("menu_error_page");
                                        if (errorCode.length == 0 || errorCode[0].getAttribute("code") != -1) {
                                            let html = getMenuErrorHTML(-1);
                                            menuHTML(menuNumber, menuName, html);
                                        }
                                    }
                                    window.requestAnimationFrame(callback);
                                }
                                window.requestAnimationFrame(callback);
                            }
                            checkedVersion = version;
                        }
                    }
                }
            });
            xhr.send();
        }
        checkUpdate();

        //서비스 워커
        navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
            //업데이트
            let installed = false;
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed') {
                        installed = true;
                    } else if (installingWorker.state === 'activated' && installed == true) {
                        function callback() {
                            if (checkedVersion != null) {
                                if (checkedVersion != currentVersion) {
                                    location.reload();
                                }
                            } else {
                                window.requestAnimationFrame(callback);
                            }
                        }
                        window.requestAnimationFrame(callback);
                    }
                };
            };
            //알림 관련
            function callback() {
                if (loginStatus != null && loginStatus["isLogin"] == true) {
                    //Firebase 초기화
                    initFirebase(registration);
                } else {
                    window.requestAnimationFrame(callback);
                }
            }
            window.requestAnimationFrame(callback);
        });

        var messagingToken = null;

        function initFirebase(serviceWorkRegistration) {
            var firebaseConfig = {
                apiKey: "AIzaSyBol30DOsSExDgL2G26BHjwhCpKXGzkVwo",
                authDomain: "louibooks-5af5c.firebaseapp.com",
                projectId: "louibooks-5af5c",
                storageBucket: "louibooks-5af5c.appspot.com",
                messagingSenderId: "1017277245083",
                appId: "1:1017277245083:web:b72f454f0d146a6ce4c83e",
                measurementId: "G-S3VFEEVMXK"
            };
            firebase.initializeApp(firebaseConfig);
            var messaging = firebase.messaging();
            messaging.useServiceWorker(serviceWorkRegistration);
            messaging.usePublicVapidKey("BK_NXSlBhFoCqWkZ4KlsWtgrGeW03To0Bz8BUv_q0minXLYPPXTJWcNAjUSJ1NqTrFbprBA3J6_BsI9QnGlMuqY");

            //토큰 키 정보 갱신
            messaging.getToken().then((currentToken) => {
                if (currentToken) {
                    messagingToken = currentToken;
                    updateMessagingToken(currentToken);
                }
            }).catch((err) => {
                //...
            });

            messaging.onMessage((payload) => {
                if (loginStatus["isLogin"] == true) {
                    loginStatus["not_confirm_notifications"] ++;

                    let new_notifications = document.getElementsByClassName("header_right_button_new_notifications");
                    for (let i = 0; i < new_notifications.length; i++) {
                        new_notifications[i].style.display = null;
                    }

                    actionMessage(getLanguage("new_notifications_message"));
                }
            });
        }
        function updateMessagingToken(token) {
            const xhr = new XMLHttpRequest();
            const method = "POST";
            const url = "/php/messagingToken.php";

            xhr.open(method, url);

            xhr.addEventListener('readystatechange', function (event) {
                const { target } = event;
                if (target.readyState === XMLHttpRequest.DONE) {
                    const { status } = target;
                }
            });

            var formData = new FormData();
            formData.append("language", userLanguage);
            formData.append("token", token);

            xhr.send(formData);
        }

    </script>

    <script async src="https://www.googletagmanager.com/gtag/js?id=G-S3VFEEVMXK"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-S3VFEEVMXK');
    </script>

    <script type="text/javascript">
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "j8tg6c2is2");
    </script>

</html>