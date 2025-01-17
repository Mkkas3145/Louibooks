

function loadAdmin_dashboard() {
    let array = {
        "historyUrl": "/admin/dashboard",
        "name": "admin_dashboard",
        "historyTitle": getLanguage("menu_name:admin_dashboard"),
    };
    loadMenu("/menu/admin/dashboard.php", array);
}

function loadAdmin_questions() {
    let array = {
        "historyUrl": "/admin/questions",
        "name": "admin_questions",
        "historyTitle": getLanguage("menu_name:admin_questions"),
    };
    loadMenu("/menu/admin/questions.php", array);
}

function loadAdmin_user_report() {
    let array = {
        "historyUrl": "/admin/user_report",
        "name": "admin_user_report",
        "historyTitle": getLanguage("menu_name:admin_user_report"),
    };
    loadMenu("/menu/admin/user_report.php", array);
}

function loadAdmin_work_report() {
    let array = {
        "historyUrl": "/admin/work_report",
        "name": "admin_work_report",
        "historyTitle": getLanguage("menu_name:admin_work_report"),
    };
    loadMenu("/menu/admin/work_report.php", array);
}

function loadAdmin_monetization_approval() {
    let array = {
        "historyUrl": "/admin/monetization_approval",
        "name": "admin_monetization_approval",
        "historyTitle": getLanguage("menu_name:admin_monetization_approval"),
    };
    loadMenu("/menu/admin/monetization_approval.php", array);
}

function loadAdmin_partner_approval() {
    let array = {
        "historyUrl": "/admin/partner_approval",
        "name": "admin_partner_approval",
        "historyTitle": getLanguage("menu_name:admin_partner_approval"),
    };
    loadMenu("/menu/admin/partner_approval.php", array);
}