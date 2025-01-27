<?php

    $menuNumber = $_POST["menuNumber"];

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    //로그인 키 갯수
    $stmt = $pdo->prepare("SELECT COUNT(random_key) FROM login_key WHERE user_number = :user_number");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"]
    ));
    $loginKey = $stmt->fetch()[0];

    //2차 인증 여부
    $isTwoFactorAuth = false;
    if ($userInfo["two_factor_auth_key"] != null) {
        $isTwoFactorAuth = true;
    }

    //비밀번호 설정 여부
    $stmt = $pdo->prepare("SELECT password FROM user WHERE number = :number");
    $stmt->execute(array(
        ':number' => $userInfo["number"]
    ));
    $password = $stmt->fetch();
    $isNoPassword = true;
    if (isset($password["password"])) {
        $isNoPassword = false;
    }

?>

<div class = "user_info" style = "display: none;">
    <?php
        echo json_encode(array(
            "loginKey" => $loginKey,
            "rigorousAccessProcedures" => $userInfo["rigorous_access_procedures"],
            "isTwoFactorAuth" => $isTwoFactorAuth,
            "isNoPassword" => $isNoPassword
        ));
    ?>
</div>

<div class = "menu_my_account_security">
    <div class = "menu_my_account_security_top">
        <div class = "menu_my_account_security_top_title">
            ...
        </div>
        <div class = "menu_my_account_security_top_description">
            ...
        </div>
    </div>
    <div class = "menu_my_account_security_line"></div>
    <div class = "menu_my_account_security_box">
        <div class = "menu_my_account_security_box_title">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-1060.834,48.451a24.982,24.982,0,0,1-9.851-5.358,28.206,28.206,0,0,1-5.826-7.3A31.93,31.93,0,0,1-1080,26.576V7.411L-1060.834,0l19.524,8.024V26.576a21.064,21.064,0,0,1-3.676,9.973,29.222,29.222,0,0,1-6.642,6.791,38.884,38.884,0,0,1-9.206,5.111Zm.237-45.077h0l-16.489,6.133V26.32c2.587,8.765,6.933,13.468,10.123,15.869a16.8,16.8,0,0,0,6.366,3.143,43.062,43.062,0,0,0,8.04-5.156c3.682-3.014,8.1-7.864,8.231-13.857.253-11.486,0-16.155,0-16.2L-1060.6,3.373Z" transform="translate(1085.598 0.664)"></path></g></svg>
            ...
        </div>
        <div class = "menu_my_account_security_box_description">
            ...
        </div>
        <div class = "menu_my_account_security_box_items">
            <div class = "menu_my_account_security_box_item md-ripples" onclick = "loadMyAccount_details('password');">
                <div class = "menu_my_account_security_box_item_icon">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 12h14c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v7c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-7c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293zM18 10v-3c0-1.657-0.673-3.158-1.757-4.243s-2.586-1.757-4.243-1.757-3.158 0.673-4.243 1.757-1.757 2.586-1.757 4.243v3h-1c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v7c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-7c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879zM8 10v-3c0-1.105 0.447-2.103 1.172-2.828s1.723-1.172 2.828-1.172 2.103 0.447 2.828 1.172 1.172 1.723 1.172 2.828v3z"></path></svg>
                </div>
                <div class = "menu_my_account_security_box_item_center">
                    <div class = "menu_my_account_security_box_item_center_title">
                        ...
                    </div>
                    <div class = "menu_my_account_security_box_item_center_value">
                        •••••••••••••••
                    </div>
                </div>
                <div class = "menu_my_account_security_box_item_right">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.25 10l-7.141-7.42c-0.268-0.27-0.268-0.707 0-0.979 0.268-0.27 0.701-0.27 0.969 0l7.83 7.908c0.268 0.271 0.268 0.709 0 0.979l-7.83 7.908c-0.268 0.271-0.701 0.27-0.969 0s-0.268-0.707 0-0.979l7.141-7.417z"></path></svg>
                </div>
            </div>
            <div class="menu_my_account_security_box_line"></div>
            <div class = "menu_my_account_security_box_item md-ripples" onclick = "loadMyAccount_session_list();">
                <div class = "menu_my_account_security_box_item_icon">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.293 1.293l-2 2c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l2-2c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0zM12.092 10.898c-1.262-1.244-2.908-1.869-4.553-1.873-1.652-0.003-3.308 0.62-4.578 1.873-1.277 1.26-1.923 2.921-1.935 4.583s0.614 3.332 1.874 4.609c1.34 1.323 3.009 1.946 4.671 1.935s3.323-0.657 4.583-1.935 1.884-2.947 1.873-4.609-0.657-3.323-1.935-4.583zM10.688 12.322c0.885 0.873 1.332 2.020 1.339 3.173s-0.424 2.306-1.297 3.191-2.020 1.332-3.173 1.339-2.306-0.424-3.191-1.297c-0.916-0.927-1.347-2.080-1.339-3.233s0.455-2.3 1.339-3.173c0.879-0.867 2.023-1.299 3.169-1.296 1.141 0.002 2.279 0.435 3.152 1.296zM12.097 12.317l4.11-4.11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-4.11 4.11c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0zM14.793 8.207l3 3c0.391 0.391 1.024 0.391 1.414 0l3.5-3.5c0.391-0.391 0.391-1.024 0-1.414l-3-3c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l2.293 2.293-2.086 2.086-2.293-2.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM16.207 8.207l3.5-3.5c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-3.5 3.5c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z"></path></svg>
                </div>
                <div class = "menu_my_account_security_box_item_center">
                    <div class = "menu_my_account_security_box_item_center_title">
                        ...
                    </div>
                    <div class = "menu_my_account_security_box_item_center_value">
                        ...
                    </div>
                </div>
                <div class = "menu_my_account_security_box_item_right">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.25 10l-7.141-7.42c-0.268-0.27-0.268-0.707 0-0.979 0.268-0.27 0.701-0.27 0.969 0l7.83 7.908c0.268 0.271 0.268 0.709 0 0.979l-7.83 7.908c-0.268 0.271-0.701 0.27-0.969 0s-0.268-0.707 0-0.979l7.141-7.417z"></path></svg>
                </div>
            </div>
            <div class="menu_my_account_security_box_line"></div>
            <div class = "menu_my_account_security_box_item md-ripples" onclick = "loadMyAccount_details('two_factor_auth');">
                <div class = "menu_my_account_security_box_item_icon">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><path d="M-1060.834,48.451a24.982,24.982,0,0,1-9.851-5.358,28.206,28.206,0,0,1-5.826-7.3A31.93,31.93,0,0,1-1080,26.576V7.411L-1060.834,0l19.524,8.024V26.576a21.064,21.064,0,0,1-3.676,9.973,29.222,29.222,0,0,1-6.642,6.791,38.884,38.884,0,0,1-9.206,5.111Zm.237-45.077h0l-16.489,6.133V26.32c2.587,8.765,6.933,13.468,10.123,15.869a16.8,16.8,0,0,0,6.366,3.143,43.062,43.062,0,0,0,8.04-5.156c3.682-3.014,8.1-7.864,8.231-13.857.253-11.486,0-16.155,0-16.2L-1060.6,3.373Z" transform="translate(1085.598 0.664)"></path></g></svg>
                </div>
                <div class = "menu_my_account_security_box_item_center">
                    <div class = "menu_my_account_security_box_item_center_title">
                        ...
                    </div>
                    <div class = "menu_my_account_security_box_item_center_value">
                        ...
                    </div>
                </div>
                <div class = "menu_my_account_security_box_item_right">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.25 10l-7.141-7.42c-0.268-0.27-0.268-0.707 0-0.979 0.268-0.27 0.701-0.27 0.969 0l7.83 7.908c0.268 0.271 0.268 0.709 0 0.979l-7.83 7.908c-0.268 0.271-0.701 0.27-0.969 0s-0.268-0.707 0-0.979l7.141-7.417z"></path></svg>
                </div>
            </div>
            <div class="menu_my_account_security_box_line"></div>
            <div class = "menu_my_account_security_box_item md-ripples" onclick = "loadMyAccount_details('rigorous_access_procedures');">
                <div class = "menu_my_account_security_box_item_icon">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16.5 24.447v-0.996c3.352 0.099 5.993 1.174 5.993 2.487 0 1.379-2.906 2.56-6.492 2.56s-6.492-1.181-6.492-2.56c0-1.313 2.641-2.389 5.992-2.487v0.996c-2.799 0.069-4.993 0.71-4.993 1.491 0 0.827 2.459 1.623 5.493 1.623 3.033 0 5.492-0.796 5.492-1.623-0.001-0.781-2.194-1.421-4.993-1.491zM10.516 8.995c0-3.033 2.521-5.493 5.556-5.493 3.034 0 5.493 2.46 5.493 5.493 0 2.607-1.818 4.786-4.256 5.348l-1.309 13.219-1.313-13.256c-2.362-0.615-4.171-2.756-4.171-5.311zM16 7.524c0-0.828-0.671-1.498-1.498-1.498s-1.499 0.67-1.499 1.498c0 0.827 0.671 1.498 1.499 1.498s1.498-0.67 1.498-1.498z"></path></svg>
                </div>
                <div class = "menu_my_account_security_box_item_center">
                    <div class = "menu_my_account_security_box_item_center_title">
                        ...
                    </div>
                    <div class = "menu_my_account_security_box_item_center_value">
                        ...
                    </div>
                </div>
                <div class = "menu_my_account_security_box_item_right">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13.25 10l-7.141-7.42c-0.268-0.27-0.268-0.707 0-0.979 0.268-0.27 0.701-0.27 0.969 0l7.83 7.908c0.268 0.271 0.268 0.709 0 0.979l-7.83 7.908c-0.268 0.271-0.701 0.27-0.969 0s-0.268-0.707 0-0.979l7.141-7.417z"></path></svg>
                </div>
            </div>
        </div>
    </div>
    <div class = "menu_my_account_security_line"></div>
    <div class = "menu_my_account_security_bottom">
        ...
    </div>
</div>