

function loadMyAccount_details(type) {
    let array = {
        "historyUrl": "/my_account/details/" + type,
        "name": "my_account_details",
        "historyTitle": getLanguage("menu_name:my_account_details")
    };
    loadMenu("/menu/my_account/details.php", array, type);
}

function loadMyAccount_management() {
    let array = {
        "historyUrl": "/my_account/management",
        "name": "my_account_management",
        "historyTitle": getLanguage("menu_name:my_account_management")
    };
    loadMenu("/menu/my_account/management.php", array);
}

function loadMyAccount_personal_info() {
    let array = {
        "historyUrl": "/my_account/personal_info",
        "name": "my_account_personal_info",
        "historyTitle": getLanguage("menu_name:my_account_personal_info")
    };
    loadMenu("/menu/my_account/personal_info.php", array);
}

function loadMyAccount_privacy() {
    let array = {
        "historyUrl": "/my_account/privacy",
        "name": "my_account_privacy",
        "historyTitle": getLanguage("menu_name:my_account_privacy")
    };
    loadMenu("/menu/my_account/privacy.php", array);
}

function loadMyAccount_security() {
    let array = {
        "historyUrl": "/my_account/security",
        "name": "my_account_security",
        "historyTitle": getLanguage("menu_name:my_account_security")
    };
    loadMenu("/menu/my_account/security.php", array);
}

function loadMyAccount_session_list() {
    let array = {
        "historyUrl": "/my_account/session_list",
        "name": "my_account_session_list",
        "historyTitle": getLanguage("menu_name:my_account_session_list")
    };
    loadMenu("/menu/my_account/session_list.php", array);
}

function loadMyAccount_two_factor_auth() {
    let array = {
        "historyUrl": "/my_account/two_factor_auth",
        "name": "my_account_two_factor_auth",
        "historyTitle": getLanguage("menu_name:my_account_two_factor_auth")
    };
    loadMenu("/menu/my_account/two_factor_auth.php", array);
}