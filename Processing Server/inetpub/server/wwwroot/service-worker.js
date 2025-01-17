

importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

const config = {
    apiKey: "AIzaSyBPLBu0QGWD6dKwA_bGeDxa3_d29_zux2I",
    authDomain: "louibooks-5af5c.firebaseapp.com",
    projectId: "louibooks-5af5c",
    storageBucket: "louibooks-5af5c.appspot.com",
    messagingSenderId: "1017277245083",
    appId: "1:1017277245083:web:b72f454f0d146a6ce4c83e",
    measurementId: "G-S3VFEEVMXK"
};

firebase.initializeApp(config);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
    let title = payload["data"]["title"];
    let body = payload["data"]["body"];
    let clickAction = "https://louibooks.com";
    if (payload["data"]["click_action"] != null) {
        clickAction = payload["data"]["click_action"];
    }

    let options = {
        body: body,
        icon: "https://louibooks.com/IMG/favicon.png",
        badge: "https://louibooks.com/IMG/badge.png",
        data: {
            click_url: clickAction
        }
    }
    if (payload["data"]["image"] != null) {
        options["image"] = payload["data"]["image"];
    }

    return self.registration.showNotification(title, options);
});

//알림 클릭
self.addEventListener('notificationclick', function (event) {
	var data = event.notification.data;
	event.notification.close();
	event.waitUntil(clients.matchAll({
		type: "window",
		includeUncontrolled: true
	}).then(function (clientList) {
		for(var i = 0; i < clientList.length; i++) {
			var client = clientList[i];
			if(client.url == '/' && 'focus' in client) {
				return client.focus();
			}
		}
		if(clients.openWindow) {
			return clients.openWindow(data.click_url);
		}
	}));
});
















var cacheVersion = <?php include_once('version.php'); ?>;

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('cache:' + cacheVersion).then(function(cache) {
            return cache.addAll([
                '/',
                '/IMG/favicon.png',
                '/manifest.json',
                <?php
                    header('Content-Type: text/javascript');
                
                    ob_start();
                    require_once('index.php');
                    ob_get_clean();

                    $length = count($javaScript);
                    for ($i = 0; $i < $length; $i++) { 
                        $url = ('/min/JS/' . sha1($javaScript[$i]) . '.js');
                        echo '\'' . $url . '\',' . "\n";
                    }

                    $length = count($cascadingStyleSheets);
                    for ($i = 0; $i < $length; $i++) { 
                        $url = ('/min/CSS/' . sha1($cascadingStyleSheets[$i]) . '.css');
                        echo '\'' . $url . '\',' . "\n";
                    }
                ?>
            ]);
        })
    );
    self.skipWaiting();
});
self.addEventListener('fetch', function(event) {
    const request = event.request;
    if (request.method != 'GET') {
        return;
    }
    event.respondWith((async () => {
        const cache = await caches.open('cache:' + cacheVersion);
        try {
            const cachedResponse = await cache.match(request);
            if (cachedResponse) {
                return cachedResponse;
            }
            const networkResponse = await fetch(request);
            if (networkResponse && networkResponse.status == 200) {
                await cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        } catch (error) {
            const cachedIndexResponse = await cache.match('/');
            if (cachedIndexResponse) {
                return cachedIndexResponse;
            }
            return new Response('Not Found', {
                status: 404,
                statusText: 'Not Found',
                headers: { 'Content-Type': 'text/plain' }
            });
        }
    })());
});
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName != ('cache:' + cacheVersion);
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});