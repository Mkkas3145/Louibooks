



function urlRewrite() {
    if (history.state != null) {
        //히스토리 정보가 있다면 히스토리 정보대로 메뉴 로드
        let data = history.state;
        if (data["url"] != null) {
            loadMenu(data["url"], data["property"], data["data"]);
        }
    } else {
        //히스토리 정보가 없다면 URL 정보로 메뉴 로드
        let pathName = window.location.pathname;

        let isEvent = checkUrlRewrite(pathName);
        if (isEvent == false) {
            loadMenu_home();
        }
    }
}

function checkUrlRewrite(pathName) {
    let array = pathName.split(/([0-9]+)/);
    if (array[0] != null && array[0] == "/work/") {
        loadMenu_work(array[1], -1);
        return true;
    }
    if (array[0] != null && array[0] == "/cloud") {
        loadMenu_cloud();
        return true;
    }
    if (array[0] != null && array[0] == "/novel_editor/") {
        loadMenu_novel_editor(Number.parseInt(array[1]));
        return true;
    }
    if (array[0] != null && array[0] == "/novel/") {
        loadMenu_novel_viewer(Number.parseInt(array[1]));
        return true;
    }
    if (array[0] != null && array[0] == "/image_format_editor/") {
        loadMenu_image_format_editor(Number.parseInt(array[1]));
        return true;
    }
    if (array[0] != null && array[0] == "/image_format/") {
        loadMenu_image_format_viewer(Number.parseInt(array[1]));
        return true;
    }
    if (array[0] != null && array[0] == "/video/") {
        loadMenu_video(Number.parseInt(array[1]));
        return true;
    }
    if (array[0] != null && array[0] == "/embed/") {
        loadMenu_embed(Number.parseInt(array[1]));
        return true;
    }
    //워크스페이스
    if (array[0] != null && array[0] == "/workspace/dashboard") {
        loadWorkspace_dashboard();
        return true;
    }
    if (array[0] != null && array[0] == "/workspace/my_works") {
        loadWorkspace_my_works();
        return true;
    }
    if (array[0] != null && array[0] == "/workspace/analysis") {
        loadWorkspace_analysis();
        return true;
    }
    if (array[0] != null && array[0] == "/workspace/monetization") {
        loadWorkspace_monetization();
        return true;
    }
    if (array[0] != null && array[0] == "/workspace/copyright") {
        loadWorkspace_copyright();
        return true;
    }
    if (array[0] != null && array[0] == "/workspace/partner") {
        loadWorkspace_partner();
        return true;
    }
    if (array[0] != null && array[0] == "/workspace/my_page_settings") {
        loadWorkspace_my_page_settings();
        return true;
    }
    if (array[0] != null && array[0] == "/workspace/work/details/") {
        loadWorkspace_work_details(Number.parseInt(array[1]));
        return true;
    }
    if (array[0] != null && array[0] == "/workspace/work/part_list/") {
        loadWorkspace_work_part_list(Number.parseInt(array[1]));
        return true;
    }
    if (array[0] != null && array[0] == "/workspace/work/comments/") {
        loadWorkspace_work_comments(Number.parseInt(array[1]));
        return true;
    }
    if (array[0] != null && array[0] == "/workspace/work/community/") {
        loadWorkspace_work_community(Number.parseInt(array[1]));
        return true;
    }
    if (array[0] != null && array[0] == "/workspace/work/localization/") {
        loadWorkspace_work_localization(Number.parseInt(array[1]));
        return true;
    }
    //
    if (array[0] != null && array[0] == "/workspace/part/details/") {
        loadWorkspace_part_details(Number.parseInt(array[1]));
        return true;
    }
    if (array[0] != null && array[0] == "/workspace/part/comments/") {
        loadWorkspace_part_comments(Number.parseInt(array[1]));
        return true;
    }
    if (array[0] != null && array[0] == "/workspace/part/localization/") {
        loadWorkspace_part_localization(Number.parseInt(array[1]));
        return true;
    }
    if (array[0] != null && array[0] == "/workspace/part/user_translation/") {
        loadWorkspace_part_user_translation(Number.parseInt(array[1]));
        return true;
    }
    //
    if (array[0] != null && array[0] == "/login") {
        loadMenu_login();
        return true;
    }
    if (array[0] != null && array[0] == "/other_account/") {
        loadMenu_other_account(Number.parseInt(array[1]));
        return true;
    }
    if (array[0] != null && array[0] == "/signup") {
        loadMenu_signup();
        return true;
    }
    if (array[0] != null && array[0] == "/find_password") {
        loadMenu_find_password();
        return true;
    }
    if (array[0] != null && array[0] == "/community/") {
        loadMenu_community(Number.parseInt(array[1]));
        return true;
    }
    if (array[0] != null && array[0] == "/my_work_list") {
        loadMenu_my_work_list();
        return true;
    }
    if (array[0] != null && array[0] == "/work_list/") {
        loadMenu_work_list(Number.parseInt(array[1]));
        return true;
    }
    if (array[0] != null && array[0] == "/history") {
        loadMenu_history();
        return true;
    }
    if (pathName.startsWith("/search/") == true) {
        let query = decodeURI(pathName.replace(/^\/search\//g, '')).replaceAll("+", " ");
        loadMenu_search(query);
        return true;
    }
    if (array[0] != null && array[0] == "/library") {
        loadMenu_library();
        return true;
    }
    if (array[0] != null && array[0] == "/user/") {
        loadMenu_user(Number.parseInt(array[1]));
        return true;
    }
    if (array[0] != null && array[0] == "/my_user_list") {
        loadMenu_my_user_list();
        return true;
    }
    if (array[0] != null && array[0] == "/notifications_settings") {
        loadMenu_notifications_settings();
        return true;
    }
    if (array[0] != null && array[0] == "/comment/") {
        loadMenu_comment(Number.parseInt(array[1]));
        return true;
    }
    if (array[0] != null && array[0] == "/rating/") {
        loadMenu_rating(Number.parseInt(array[1]));
        return true;
    }
    if (array[0] != null && array[0] == "/workspace/work/analysis/") {
        loadWorkspace_work_analysis(Number.parseInt(array[1]));
        return true;
    }
    if (array[0] != null && array[0] == "/explore") {
        loadMenu_explore();
        return true;
    }
    if (array[0] != null && array[0] == "/explore/trending") {
        loadMenu_explore_trending();
        return true;
    }
    if (array[0] != null && array[0] == "/explore/fantasy") {
        loadMenu_explore_fantasy();
        return true;
    }
    if (array[0] != null && array[0] == "/community_guide") {
        loadMenu_community_guide();
        return true;
    }
    if (array[0] != null && array[0] == "/creator_guide") {
        loadMenu_creator_guide();
        return true;
    }
    if (array[0] != null && array[0] == "/preview_premium_profile") {
        loadMenu_preview_premium_profile();
        return true;
    }
    if (array[0] != null && array[0] == "/privacy_policy") {
        loadMenu_privacy_policy();
        return true;
    }
    if (array[0] != null && array[0] == "/reviewed_questions/") {
        loadWorkspace_reviewed_questions(Number.parseInt(array[1]));
        return true;
    }
    if (array[0] != null && array[0] == "/presentation") {
        loadMenu_presentation();
        return true;
    }
    if (array[0] != null && array[0] == "/payment_history/") {
        loadMenu_payment_history(Number.parseInt(array[1]));
        return true;
    }
    if (array[0] != null && array[0] == "/write_questions") {
        loadMenu_write_questions();
        return true;
    }

    //내 계정 페이지
    if (pathName.startsWith("/my_account/details/") == true) {
        let type = decodeURI(pathName.replace(/^\/my_account\/details\//g, '')).replaceAll("+", " ");
        loadMyAccount_details(type);
        return true;
    }
    if (array[0] != null && array[0] == "/my_account/management") {
        loadMyAccount_management();
        return true;
    }
    if (array[0] != null && array[0] == "/my_account/management") {
        loadMyAccount_management();
        return true;
    }
    if (array[0] != null && array[0] == "/my_account/personal_info") {
        loadMyAccount_personal_info();
        return true;
    }
    if (array[0] != null && array[0] == "/my_account/privacy") {
        loadMyAccount_privacy();
        return true;
    }
    if (array[0] != null && array[0] == "/my_account/security") {
        loadMyAccount_security();
        return true;
    }
    if (array[0] != null && array[0] == "/my_account/two_factor_auth") {
        loadMyAccount_two_factor_auth();
        return true;
    }
    if (array[0] != null && array[0] == "/user_rank") {
        loadMenu_user_rank();
        return true;
    }

    //관리자 페이지
    if (array[0] != null && array[0] == "/admin/dashboard") {
        loadAdmin_dashboard();
        return true;
    }
    if (array[0] != null && array[0] == "/admin/questions") {
        loadAdmin_questions();
        return true;
    }
    if (array[0] != null && array[0] == "/admin/user_report") {
        loadAdmin_user_report();
        return true;
    }
    if (array[0] != null && array[0] == "/admin/work_report") {
        loadAdmin_work_report();
        return true;
    }
    if (array[0] != null && array[0] == "/admin/monetization_approval") {
        loadAdmin_monetization_approval();
        return true;
    }
    if (array[0] != null && array[0] == "/admin/partner_approval") {
        loadAdmin_partner_approval();
        return true;
    }
    if (array[0] != null && array[0] == "/admin/withdrawal") {
        loadAdmin_withdrawal();
        return true;
    }

    return false;
}