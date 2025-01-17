<?php

    $menuNumber = $_POST["menuNumber"];

    include_once('../../default_function.php');
    $userInfo = getMyLoginInfo();

    //파트너 조건 충족 여부
    $isConditionMet = false;

    //수익 창출 승인된 작품 있는지 여부
    $stmt = $pdo->prepare("SELECT monetization FROM works WHERE user_number = :user_number AND monetization = 1 LIMIT 1");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"]
    ));
    $monetization = $stmt->fetch();
    if (isset($monetization["monetization"])) {
        //조건 충족
        $isConditionMet = true;
    }

    //검토 대기 중인지 여부
    $isAwaitingReview = false;
    $stmt = $pdo->prepare("SELECT user_number FROM partner_approval WHERE user_number = :user_number LIMIT 1");
    $stmt->execute(array(
        ':user_number' => $userInfo["number"]
    ));
    $partnerApproval = $stmt->fetch();
    if (isset($partnerApproval["user_number"])) {
        $isAwaitingReview = true;
    }

    //파트너 디스코드
    $partnerDiscord = "";
    if ($userInfo["partner"] != 0) {
        $partnerDiscord = "https://discord.gg/Z6Gkd9nYWk";
    }

?>

<div class = "partner_discord" style = "display: none;">
    <?php echo $partnerDiscord; ?>
</div>
<div class = "is_condition_met" style = "display: none;">
    <?php echo ($isConditionMet == true) ? "true" : "false"; ?>
</div>
<div class = "partner" style = "display: none;">
    <?php echo $userInfo["partner"]; ?>
</div>
<div class = "is_awaiting_review" style = "display: none;">
    <?php echo ($isAwaitingReview == true) ? "true" : "false"; ?>
</div>

<div class = "my_workspace_partner">
    <div class = "my_workspace_partner_box">
        <div class = "my_workspace_partner_box_icon">
            <!-- svg --> 
        </div>
        <div class = "my_workspace_partner_box_title">
            ...
        </div>
        <div class = "my_workspace_partner_box_description">
            ...
        </div>
        <div class = "my_workspace_partner_box_line"></div>
        <div class = "my_workspace_partner_box_items_description">
            ...
        </div>
        <div class = "my_workspace_partner_box_items">
            <div class = "my_workspace_partner_box_item">
                <div class = "my_workspace_partner_box_item_icon">
                    <!-- Generated by IcoMoon.io -->
                    <svg style = "fill: var(--color4);" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM10.033 9.332c0.183-0.521 0.559-0.918 1.022-1.14s1.007-0.267 1.528-0.083c0.458 0.161 0.819 0.47 1.050 0.859 0.183 0.307 0.284 0.665 0.286 1.037 0 0.155-0.039 0.309-0.117 0.464-0.080 0.16-0.203 0.325-0.368 0.49-0.709 0.709-1.831 1.092-1.831 1.092-0.524 0.175-0.807 0.741-0.632 1.265s0.741 0.807 1.265 0.632c0 0 1.544-0.506 2.613-1.575 0.279-0.279 0.545-0.614 0.743-1.010 0.2-0.4 0.328-0.858 0.328-1.369-0.004-0.731-0.204-1.437-0.567-2.049-0.463-0.778-1.19-1.402-2.105-1.724-1.042-0.366-2.135-0.275-3.057 0.167s-1.678 1.238-2.044 2.28c-0.184 0.521 0.090 1.092 0.611 1.275s1.092-0.091 1.275-0.611zM12 18c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z"></path></svg>
                </div>
                <div class = "my_workspace_partner_box_item_title" style = "color: var(--color4);">
                    ...
                </div>
            </div>
            <div class = "my_workspace_partner_box_item">
                <div class = "my_workspace_partner_box_item_icon">
                    <!-- Generated by IcoMoon.io -->
                    <svg style = "fill: var(--color4);" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM10.033 9.332c0.183-0.521 0.559-0.918 1.022-1.14s1.007-0.267 1.528-0.083c0.458 0.161 0.819 0.47 1.050 0.859 0.183 0.307 0.284 0.665 0.286 1.037 0 0.155-0.039 0.309-0.117 0.464-0.080 0.16-0.203 0.325-0.368 0.49-0.709 0.709-1.831 1.092-1.831 1.092-0.524 0.175-0.807 0.741-0.632 1.265s0.741 0.807 1.265 0.632c0 0 1.544-0.506 2.613-1.575 0.279-0.279 0.545-0.614 0.743-1.010 0.2-0.4 0.328-0.858 0.328-1.369-0.004-0.731-0.204-1.437-0.567-2.049-0.463-0.778-1.19-1.402-2.105-1.724-1.042-0.366-2.135-0.275-3.057 0.167s-1.678 1.238-2.044 2.28c-0.184 0.521 0.090 1.092 0.611 1.275s1.092-0.091 1.275-0.611zM12 18c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z"></path></svg>
                </div>
                <div class = "my_workspace_partner_box_item_title" style = "color: var(--color4);">
                    ...
                </div>
            </div>
            <div class = "my_workspace_partner_box_item">
                <div class = "my_workspace_partner_box_item_icon">
                    <!-- Generated by IcoMoon.io -->
                    <svg style = "fill: var(--color4);" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM10.033 9.332c0.183-0.521 0.559-0.918 1.022-1.14s1.007-0.267 1.528-0.083c0.458 0.161 0.819 0.47 1.050 0.859 0.183 0.307 0.284 0.665 0.286 1.037 0 0.155-0.039 0.309-0.117 0.464-0.080 0.16-0.203 0.325-0.368 0.49-0.709 0.709-1.831 1.092-1.831 1.092-0.524 0.175-0.807 0.741-0.632 1.265s0.741 0.807 1.265 0.632c0 0 1.544-0.506 2.613-1.575 0.279-0.279 0.545-0.614 0.743-1.010 0.2-0.4 0.328-0.858 0.328-1.369-0.004-0.731-0.204-1.437-0.567-2.049-0.463-0.778-1.19-1.402-2.105-1.724-1.042-0.366-2.135-0.275-3.057 0.167s-1.678 1.238-2.044 2.28c-0.184 0.521 0.090 1.092 0.611 1.275s1.092-0.091 1.275-0.611zM12 18c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z"></path></svg>
                </div>
                <div class = "my_workspace_partner_box_item_title" style = "color: var(--color4);">
                    ...
                </div>
            </div>
            <div class = "my_workspace_partner_box_item">
                <div class = "my_workspace_partner_box_item_icon">
                    <!-- Generated by IcoMoon.io -->
                    <svg style = "fill: var(--color4);" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23 12c0-3.037-1.232-5.789-3.222-7.778s-4.741-3.222-7.778-3.222-5.789 1.232-7.778 3.222-3.222 4.741-3.222 7.778 1.232 5.789 3.222 7.778 4.741 3.222 7.778 3.222 5.789-1.232 7.778-3.222 3.222-4.741 3.222-7.778zM21 12c0 2.486-1.006 4.734-2.636 6.364s-3.878 2.636-6.364 2.636-4.734-1.006-6.364-2.636-2.636-3.878-2.636-6.364 1.006-4.734 2.636-6.364 3.878-2.636 6.364-2.636 4.734 1.006 6.364 2.636 2.636 3.878 2.636 6.364zM10.033 9.332c0.183-0.521 0.559-0.918 1.022-1.14s1.007-0.267 1.528-0.083c0.458 0.161 0.819 0.47 1.050 0.859 0.183 0.307 0.284 0.665 0.286 1.037 0 0.155-0.039 0.309-0.117 0.464-0.080 0.16-0.203 0.325-0.368 0.49-0.709 0.709-1.831 1.092-1.831 1.092-0.524 0.175-0.807 0.741-0.632 1.265s0.741 0.807 1.265 0.632c0 0 1.544-0.506 2.613-1.575 0.279-0.279 0.545-0.614 0.743-1.010 0.2-0.4 0.328-0.858 0.328-1.369-0.004-0.731-0.204-1.437-0.567-2.049-0.463-0.778-1.19-1.402-2.105-1.724-1.042-0.366-2.135-0.275-3.057 0.167s-1.678 1.238-2.044 2.28c-0.184 0.521 0.090 1.092 0.611 1.275s1.092-0.091 1.275-0.611zM12 18c0.552 0 1-0.448 1-1s-0.448-1-1-1-1 0.448-1 1 0.448 1 1 1z"></path></svg>
                </div>
                <div class = "my_workspace_partner_box_item_title" style = "color: var(--color4);">
                    ...
                </div>
            </div>
        </div>
        <div class = "my_workspace_partner_box_line"></div>
        <div class = "my_workspace_partner_box_items_description">
            ...
        </div>
        <div class = "my_workspace_partner_box_items">
            <div class = "my_workspace_partner_box_item">
                <div class = "my_workspace_partner_box_item_icon">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                </div>
                <div class = "my_workspace_partner_box_item_title">
                    ...
                </div>
            </div>
            <div class = "my_workspace_partner_box_item">
                <div class = "my_workspace_partner_box_item_icon">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                </div>
                <div class = "my_workspace_partner_box_item_title">
                    ...
                </div>
            </div>
            <div class = "my_workspace_partner_box_item">
                <div class = "my_workspace_partner_box_item_icon">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                </div>
                <div class = "my_workspace_partner_box_item_title">
                    ...
                </div>
            </div>
            <div class = "my_workspace_partner_box_item">
                <div class = "my_workspace_partner_box_item_icon">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                </div>
                <div class = "my_workspace_partner_box_item_title">
                    ...
                </div>
            </div>
            <div class = "my_workspace_partner_box_item">
                <div class = "my_workspace_partner_box_item_icon">
                    <!-- Generated by IcoMoon.io -->
                    <svg style = "fill: var(--color6);" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.148 4.374c0.073-0.123 0.185-0.242 0.334-0.332 0.236-0.143 0.506-0.178 0.756-0.116s0.474 0.216 0.614 0.448l8.466 14.133c0.070 0.12 0.119 0.268 0.128 0.434-0.015 0.368-0.119 0.591-0.283 0.759-0.18 0.184-0.427 0.298-0.693 0.301l-16.937-0.001c-0.152-0.001-0.321-0.041-0.481-0.134-0.239-0.138-0.399-0.359-0.466-0.607s-0.038-0.519 0.092-0.745zM9.432 3.346l-8.47 14.14c-0.422 0.731-0.506 1.55-0.308 2.29s0.68 1.408 1.398 1.822c0.464 0.268 0.976 0.4 1.475 0.402h16.943c0.839-0.009 1.587-0.354 2.123-0.902s0.864-1.303 0.855-2.131c-0.006-0.536-0.153-1.044-0.406-1.474l-8.474-14.147c-0.432-0.713-1.11-1.181-1.854-1.363s-1.561-0.081-2.269 0.349c-0.429 0.26-0.775 0.615-1.012 1.014z"></path></svg>
                </div>
                <div class = "my_workspace_partner_box_item_title" style = "color: var(--color6);">
                    ...
                </div>
            </div>
        </div>
        <div class = "my_workspace_partner_box_line"></div>
        <div class = "my_workspace_partner_box_items_description">
            ...
        </div>
        <div class = "my_workspace_partner_box_items">
            <div class = "my_workspace_partner_box_item">
                <div class = "my_workspace_partner_box_item_icon">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                </div>
                <div class = "my_workspace_partner_box_item_title">
                    ...
                </div>
            </div>
            <div class = "my_workspace_partner_box_item">
                <div class = "my_workspace_partner_box_item_icon">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                </div>
                <div class = "my_workspace_partner_box_item_title">
                    ...
                </div>
            </div>
            <div class = "my_workspace_partner_box_item">
                <div class = "my_workspace_partner_box_item_icon">
                    <!-- Generated by IcoMoon.io -->
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.293 5.293l-10.293 10.293-4.293-4.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414l5 5c0.391 0.391 1.024 0.391 1.414 0l11-11c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0z"></path></svg>
                </div>
                <div class = "my_workspace_partner_box_item_title">
                    ...
                </div>
            </div>
        </div>
        <div class = "my_workspace_partner_box_line"></div>
        <div class = "my_workspace_partner_box_bottom">
            <div class = "my_workspace_partner_box_bottom_button_items">
                <div class = "my_workspace_partner_box_bottom_button_item md-ripples" onclick = "workspacePartnerApprovalButton(<?php echo $menuNumber; ?>);">
                    <div class = "my_workspace_partner_box_bottom_button_item_icon">
                        ...
                    </div>
                    <div class = "my_workspace_partner_box_bottom_button_item_right">
                        ...
                    </div>
                </div>
                <div class = "my_workspace_partner_box_bottom_button_item" style = "pointer-events: none;">
                    <div class = "my_workspace_partner_box_bottom_button_item_icon">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20c-5.523 0-10-4.477-10-10s4.477-10 10-10v0c5.523 0 10 4.477 10 10s-4.477 10-10 10v0zM10 18c4.418 0 8-3.582 8-8s-3.582-8-8-8v0c-4.418 0-8 3.582-8 8s3.582 8 8 8v0zM9 10.41v-6.41h2v5.59l3.95 3.95-1.41 1.41-4.54-4.54z"></path></svg>
                    </div>
                    <div class = "my_workspace_partner_box_bottom_button_item_right">
                        ...
                    </div>
                </div>
                <div class = "my_workspace_partner_box_bottom_button_item md-ripples" onclick = "workspacePartnerUnpartnerButton(<?php echo $menuNumber; ?>);">
                    <div class = "my_workspace_partner_box_bottom_button_item_icon">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" viewBox="0 0 50 50"><defs><clipPath id="b"><rect width="50" height="50"></rect></clipPath></defs><g id="a" clip-path="url(#b)"><rect width="50" height="3" rx="1.5" transform="translate(0 11)"></rect><path d="M31,39H5a5.006,5.006,0,0,1-5-5V0H4.932A2,2,0,0,0,3,2V34a2,2,0,0,0,2,2H31a2,2,0,0,0,2-2V2a2,2,0,0,0-1.914-2L36,0V34A5.006,5.006,0,0,1,31,39Z" transform="translate(7 11)"></path><path d="M5,14,0,14V5A5.006,5.006,0,0,1,5,0H21a5.006,5.006,0,0,1,5,5v9H21.007A2,2,0,0,0,23,12V5a2,2,0,0,0-2-2H5A2,2,0,0,0,3,5v7a2,2,0,0,0,2,2H5Z" transform="translate(12)"></path><rect width="3" height="15" rx="1.5" transform="translate(24 22)"></rect><rect width="3" height="15" rx="1.5" transform="translate(33 22)"></rect><rect width="3" height="15" rx="1.5" transform="translate(15 22)"></rect></g></svg>
                    </div>
                    <div class = "my_workspace_partner_box_bottom_button_item_right">
                        ...
                    </div>
                </div>
                <div class = "my_workspace_partner_box_bottom_button_item md-ripples" onclick = "workspacePartnerApprovalButton(<?php echo $menuNumber; ?>);">
                    <div class = "my_workspace_partner_box_bottom_button_item_icon">
                        ...
                    </div>
                    <div class = "my_workspace_partner_box_bottom_button_item_right">
                        ...
                    </div>
                </div>
                <div class = "my_workspace_partner_box_bottom_button_item" style = "pointer-events: none;">
                    <div class = "my_workspace_partner_box_bottom_button_item_icon">
                        <!-- Generated by IcoMoon.io -->
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20c-5.523 0-10-4.477-10-10s4.477-10 10-10v0c5.523 0 10 4.477 10 10s-4.477 10-10 10v0zM10 18c4.418 0 8-3.582 8-8s-3.582-8-8-8v0c-4.418 0-8 3.582-8 8s3.582 8 8 8v0zM9 10.41v-6.41h2v5.59l3.95 3.95-1.41 1.41-4.54-4.54z"></path></svg>
                    </div>
                    <div class = "my_workspace_partner_box_bottom_button_item_right">
                        ...
                    </div>
                </div>
                <div class = "my_workspace_partner_box_bottom_button_item md-ripples" style = "display: none;">
                    <div class = "my_workspace_partner_box_bottom_button_item_icon">
                        <!-- Generator: Adobe Illustrator 19.1.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 48" style="enable-background:new 0 0 48 48;" xml:space="preserve"><path style="fill:#8C9EFF;" d="M40,12c0,0-4.585-3.588-10-4l-0.488,0.976C34.408,10.174,36.654,11.891,39,14  c-4.045-2.065-8.039-4-15-4s-10.955,1.935-15,4c2.346-2.109,5.018-4.015,9.488-5.024L18,8c-5.681,0.537-10,4-10,4s-5.121,7.425-6,22  c5.162,5.953,13,6,13,6l1.639-2.185C13.857,36.848,10.715,35.121,8,32c3.238,2.45,8.125,5,16,5s12.762-2.55,16-5  c-2.715,3.121-5.857,4.848-8.639,5.815L33,40c0,0,7.838-0.047,13-6C45.121,19.425,40,12,40,12z M17.5,30c-1.933,0-3.5-1.791-3.5-4  c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C21,28.209,19.433,30,17.5,30z M30.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4  s3.5,1.791,3.5,4C34,28.209,32.433,30,30.5,30z"/></svg>
                    </div>
                    <div class = "my_workspace_partner_box_bottom_button_item_right">
                        ...
                    </div>
                </div>
            </div>
            <div class = "my_workspace_partner_box_bottom_description">
                ...
            </div>
        </div>
    </div>
</div>