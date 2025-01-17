<?php

    include_once('../wwwroot/default_function.php');





























    /*
        userNumbers = 유저의 번호 (Array)
        type = 알림 타입 (INT)
        data = 알림 세부 데이터 (JSON)
    */
    function sendUserNotifications($userNumbers, $type, $data) {
        global $pdo;
        $userNumbers_length = count($userNumbers);

        $userSql = $pdo->prepare('UPDATE user SET not_confirm_notifications = not_confirm_notifications + 1 WHERE number = :number');
        $sql = $pdo->prepare('insert into user_notifications (user_number, type, data, updated_date) values(:user_number, :type, :data, :updated_date)');
        for ($i = 0; $i < $userNumbers_length; $i++) {
            $newDate = date("Y-m-d H:i:s");
            $sql->execute(array(
                ':user_number' => $userNumbers[$i],
                ':type' => $type,
                ':data' => json_encode($data),
                ':updated_date' => $newDate,
            ));
            //확인하지 않은 알림 1 더하기
            $userSql->execute(array(
                ':number' => $userNumbers[$i]
            ));
        }
    }

    /*
        $data = array(
            "default" = array(),
            "ko" = array(),
            "en" = array(),
            "ja" = array()
        );
    */
    function sendUserPushNotifications($userNumbers, $type, $data) {
        global $pdo;

        //업데이트 안한지 한달 이상된 데이터 삭제
        $stmt = $pdo->prepare("DELETE FROM messaging_token WHERE upload_date < :upload_date");
        $stmt->execute(array(
            ':upload_date' => date("Y-m-d H:i:s", strtotime("-30 Day"))
        ));

        //토큰 키 가져오기
        $token = array();
        $stmt = $pdo->prepare("SELECT token, language FROM messaging_token WHERE user_number IN (" . implode(",", $userNumbers) . ")");
        $stmt->execute();
        $messagingToken = $stmt->fetchAll();
        $messagingToken_length = count($messagingToken);
        for ($i = 0; $i < $messagingToken_length; $i++) {
            if (isset($token[$messagingToken[$i]["language"]]) == false) {
                $token[$messagingToken[$i]["language"]] = array();
            }
            $token[$messagingToken[$i]["language"]][] = $messagingToken[$i]["token"];
        }
        
        foreach ($token as $key => $value) {
            $notification = getDataUserPushNotifications($type, $data, $key);

            //1000개마다 토큰 키 나누기
            $ids = array_chunk($value, 1000);
            $ids_length = count($ids);
            for ($i = 0; $i < $ids_length; $i++) {
                pushNotificationsCurlRequestAsync(array(
                    "registration_ids" => $ids[$i],
                    "data" => $notification,
                    "content_available" => true
                ));
            }   
        }
    }
    function getDataUserPushNotifications($type, $data, $language) {
        $iconUrl = "https://louibooks.com/IMG/favicon.png";

        if ($type == 0) {
            $default = $data["default"];
            $workTitle = $default["workTitle"];
            $partTitle = $default["partTitle"];
            $coverImage = $default["coverImage"];
            $thumbnailImage = $default["thumbnailImage"];
            $nickname = $default["nickname"];
            $clickURL = $default["clickURL"];

            if (isset($data[$language]["workTitle"])) {
                $workTitle = $data[$language]["workTitle"];
            }
            if (isset($data[$language]["partTitle"])) {
                $partTitle = $data[$language]["partTitle"];
            }
            if (isset($data[$language]["coverImage"])) {
                $coverImage = $data[$language]["coverImage"];
            }
            if (isset($data[$language]["thumbnailImage"])) {
                $thumbnailImage = $data[$language]["thumbnailImage"];
            }

            $title = $workTitle;
            $body = str_replace("{R:0}", $nickname, getLanguage("push_notifications_description:0", $language));
            $body = str_replace("{R:1}", $partTitle, $body);

            //회차 공개
            $notification = array(
                "title" => $title,
                "body" => $body,
                "image" => $thumbnailImage,
                "click_action" => $clickURL
            );
            return $notification;
        } else if ($type == 1) {
            $default = $data["default"];
            $workTitle = $default["workTitle"];
            $coverImage = $default["coverImage"];
            $nickname = $default["nickname"];
            $clickURL = $default["clickURL"];

            if (isset($data[$language]["workTitle"])) {
                $workTitle = $data[$language]["workTitle"];
            }
            if (isset($data[$language]["coverImage"])) {
                $coverImage = $data[$language]["coverImage"];
            }

            $title = $workTitle;
            $body = str_replace("{R:0}", $nickname, getLanguage("push_notifications_description:1", $language));

            //커뮤니티 게시물 게시
            $notification = array(
                "title" => $title,
                "body" => $body,
                "image" => $coverImage,
                "click_action" => $clickURL
            );
            return $notification;
        } else if ($type == 2) {
            $nickname = $data["nickname"];
            $content = $data["content"];
            $clickURL = $data["clickURL"];

            $title = str_replace("{R:0}", $nickname, getLanguage("push_notifications_title:2", $language));

            //댓글 남김
            $notification = array(
                "title" => $title,
                "body" => $content,
                "click_action" => $clickURL
            );
            return $notification;
        } else if ($type == 3) {
            $default = $data["default"];
            $workTitle = $default["workTitle"];
            $coverImage = $default["coverImage"];
            $nickname = $default["nickname"];
            $clickURL = $default["clickURL"];

            if (isset($data[$language]["workTitle"])) {
                $workTitle = $data[$language]["workTitle"];
            }
            if (isset($data[$language]["coverImage"])) {
                $coverImage = $data[$language]["coverImage"];
            }

            $title = $workTitle;
            $body = str_replace("{R:0}", $nickname, getLanguage("push_notifications_description:3", $language));

            //평가 및 리뷰 남김
            $notification = array(
                "title" => $title,
                "body" => $body,
                "image" => $coverImage,
                "click_action" => $clickURL
            );
            return $notification;
        } else if ($type == 4) {
            $content = $data["content"];
            $clickURL = $default["clickURL"];

            $title = getLanguage("push_notifications_title:4", $language);
            $body = $content;

            //문의 검토됨
            $notification = array(
                "title" => $title,
                "body" => $body,
                "color" => $color,
                "click_action" => $clickURL
            );
            return $notification;
        } else if ($type == 5) {
            $title = getLanguage("push_notifications_title:5", $language);
            $body = getLanguage("push_notifications_description:5", $language);

            //커뮤니티 가이드 위반
            $notification = array(
                "title" => $title,
                "body" => $body,
                "click_action" => "https://louibooks.com/community_guide"
            );
            return $notification;
        } else if ($type == 6) {
            $default = $data["default"];
            $clickURL = $default["clickURL"];
            $creatorPermission = $default["creatorPermission"];
            if (isset($default["workTitle"])) {
                $workTitle = $default["workTitle"];
                $coverImage = $default["coverImage"];
    
                if (isset($data[$language]["workTitle"])) {
                    $workTitle = $data[$language]["workTitle"];
                }
                if (isset($data[$language]["coverImage"])) {
                    $coverImage = $data[$language]["coverImage"];
                }
                
                $title = $workTitle;
                if ($creatorPermission == true) {
                    $body = getLanguage("push_notifications_title:6:true", $language);
                } else {
                    $body = getLanguage("push_notifications_title:6:false", $language);
                }
                
                //크리에이터 가이드 위반
                $notification = array(
                    "title" => $title,
                    "body" => $body,
                    "color" => $color,
                    "image" => $coverImage,
                    "click_action" => $clickURL
                );
                return $notification;
            } else {
                $title = null;
                $body = null;
                if ($creatorPermission == true) {
                    $title = getLanguage("push_notifications_title:6:true", $language);
                    $body = getLanguage("push_notifications_description:6:true", $language);
                } else {
                    $title = getLanguage("push_notifications_title:6:false", $language);
                    $body = getLanguage("push_notifications_description:6:false", $language);
                }

                //크리에이터 자격 박탈
                $notification = array(
                    "title" => $title,
                    "body" => $body,
                    "click_action" => $clickURL
                );
                return $notification;
            }
        } else if ($type == 7) {
            $default = $data["default"];
            $workTitle = $default["workTitle"];
            $coverImage = $default["coverImage"];
            $approvalType = $default["approvalType"];
            $clickURL = null;
            if ($approvalType == 0) {
                $clickURL = "https://louibooks.com/creator_guide";
            } else if ($approvalType == 1) {
                $clickURL = "https://louibooks.com/workspace/monetization";
            }

            if (isset($data[$language]["workTitle"])) {
                $workTitle = $data[$language]["workTitle"];
            }
            if (isset($data[$language]["coverImage"])) {
                $coverImage = $data[$language]["coverImage"];
            }

            $title = $workTitle;
            $body = getLanguage(("push_notifications_description:7:" . $approvalType), $language);

            //수익 창출 승인 검토함
            $notification = array(
                "title" => $title,
                "body" => $body,
                "image" => $coverImage,
                "click_action" => $clickURL
            );
            return $notification;
        } else if ($type == 8) {
            $requestType = $data["requestType"];
            $approvalType = $data["approvalType"];
            $clickURL = "https://louibooks.com/workspace/partner";

            $title = getLanguage("push_notifications_title:8:" . $requestType . ":" . $approvalType, $language);
            $description = getLanguage("push_notifications_description:8:" . $requestType . ":" . $approvalType, $language);

            //파트너 승인 검토
            $notification = array(
                "title" => $title,
                "body" => $description,
                "click_action" => $clickURL
            );
            return $notification;
        } else if ($type == 9) {
            $status = $data["status"];
            $revenue = $data["revenue"];
            $clickURL = "https://louibooks.com/workspace/monetization";

            $title = getLanguage("push_notifications_title:9:" . $status, $language);
            $description = str_replace("{R:0}", "$" . sprintf('%0.2f', $revenue) . " USD", getLanguage("push_notifications_description:9:" . $status, $language));

            //수익 지급
            $notification = array(
                "title" => $title,
                "body" => $description,
                "click_action" => $clickURL
            );
            return $notification;
        } else if ($type == 10) {
            $default = $data["default"];
            $workTitle = $default["workTitle"];
            $partTitle = $default["partTitle"];
            $coverImage = $default["coverImage"];
            $thumbnailImage = $default["thumbnailImage"];
            $nickname = $default["nickname"];
            $clickURL = $default["clickURL"];
            $sendType = $default["sendType"];

            if (isset($data[$language]["workTitle"])) {
                $workTitle = $data[$language]["workTitle"];
            }
            if (isset($data[$language]["partTitle"])) {
                $partTitle = $data[$language]["partTitle"];
            }
            if (isset($data[$language]["coverImage"])) {
                $coverImage = $data[$language]["coverImage"];
            }
            if (isset($data[$language]["thumbnailImage"])) {
                $thumbnailImage = $data[$language]["thumbnailImage"];
            }

            $title = str_replace("{R:0}", $nickname, getLanguage("push_notifications_title:10:" . $sendType, $language));
            $body = getLanguage("push_notifications_description:10:" . $sendType, $language);

            //사용자 번역
            $notification = array(
                "title" => $title,
                "body" => $body,
                "image" => $thumbnailImage,
                "click_action" => $clickURL
            );
            return $notification;
        } else if ($type == 11) {
            $default = $data["default"];
            $nickname = $default["nickname"];
            $clickURL = "https://louibooks.com";

            $title = str_replace("{R:0}", $nickname, getLanguage("push_notifications_title:11", $language));
            $body = getLanguage("push_notifications_description:11", $language);

            //사용자 삭제 처리됨
            $notification = array(
                "title" => $title,
                "body" => $body,
                "click_action" => $clickURL
            );
            return $notification;
        } else if ($type == 12) {
            $default = $data["default"];
            $nickname = $default["nickname"];
            $clickURL = "https://louibooks.com/my_account/security";

            $title = str_replace("{R:0}", $nickname, getLanguage("push_notifications_title:12", $language));
            $body = getLanguage("push_notifications_description:12", $language);

            //보안 문제 발생함
            $notification = array(
                "title" => $title,
                "body" => $body,
                "click_action" => $clickURL
            );
            return $notification;
        }
    }







    






    














    
    if (function_exists("ord8") == false) {
        function ord8($c) {
            $len = strlen($c);
            if($len <= 0) return false;
            $h = ord($c[0]);
            if ($h <= 0x7F) return $h;
            if ($h < 0xC2) return false;
            if ($h <= 0xDF && $len>1) return ($h & 0x1F) <<  6 | (ord($c[1]) & 0x3F);
            if ($h <= 0xEF && $len>2) return ($h & 0x0F) << 12 | (ord($c[1]) & 0x3F) <<  6 | (ord($c[2]) & 0x3F);		  
            if ($h <= 0xF4 && $len>3) return ($h & 0x0F) << 18 | (ord($c[1]) & 0x3F) << 12 | (ord($c[2]) & 0x3F) << 6 | (ord($c[3]) & 0x3F);
            return false;
        }
    }
    if (function_exists("linear_hangul") == false) {
        function linear_hangul($str) {
            $cho = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
            $jung = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅗㅏ','ㅗㅐ','ㅗㅣ','ㅛ','ㅜ','ㅜㅓ','ㅜㅔ','ㅜㅣ','ㅠ','ㅡ','ㅡㅣ','ㅣ'];
            $jong = ['','ㄱ','ㄲ','ㄱㅅ','ㄴ','ㄴㅈ','ㄴㅎ','ㄷ','ㄹ','ㄹㄱ','ㄹㅁ','ㄹㅂ','ㄹㅅ','ㄹㅌ','ㄹㅍ','ㄹㅎ','ㅁ','ㅂ','ㅂㅅ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ',' ㅌ','ㅍ','ㅎ'];
            $result = '';
            for ($i=0; $i<mb_strlen($str, 'UTF-8'); $i++) {
                $code = ord8(mb_substr($str, $i, 1, 'UTF-8')) - 44032;
                if ($code > -1 && $code < 11172) {
                    $cho_idx = $code / 588;
                    $jung_idx = $code % 588 / 28;
                    $jong_idx = $code % 28;
                    $result .= $cho[$cho_idx].$jung[$jung_idx].$jong[$jong_idx];
                } else {
                    $result .= mb_substr($str, $i, 1, 'UTF-8');
                }
            }
            return $result;
        }
    }




    function pushNotificationsCurlRequestAsync($params) {  
        $parts = parse_url("https://fcm.googleapis.com/fcm/send");  
    
        if ($parts['scheme'] == 'http') {  
            $fp = fsockopen($parts['host'], isset($parts['port'])?$parts['port']:80, $errno, $errstr, 604800);  
        } else if ($parts['scheme'] == 'https') {  
            $fp = fsockopen("ssl://" . $parts['host'], isset($parts['port'])?$parts['port']:443, $errno, $errstr, 604800);  
        }
    
        $json = json_encode($params);

        $out = "POST " . $parts['path'] . " HTTP/1.1\r\n";  
        $out.= "Host: " . $parts['host'] . "\r\n";
        $out.= "Content-Type: application/json\r\n";
        $out.= "Content-Length: " . strlen($json) . "\r\n";  
        $out.= "Authorization: key=AAAA7Npy5ps:APA91bHHbUnDbrawEFDgKuH-cYJOe8GoYDkCkC4Ipbrq-ljZ2X7bC8UX7BuPYvOzQx30f3h_gYLIxKbTxZFM8N6FpyHtxBwuwu2IH6KmhJUIuG3AYRdOl2zVsCrTRXSs1EemQGewL_lH\r\n";
        $out.= "Connection: Close\r\n\r\n";
        $out.= $json;
    
        fwrite($fp, $out);
        fclose($fp);
    }

?>