function receivePushNotification(event) {
    console.log("[Service Worker] Push Received.");
    console.log("[Service Worker] fuck");
    const eventInfo = event.data.text();
    const data = JSON.parse(eventInfo);
    const head = data.head || 'New Notification 🕺🕺';
    const body = data.body || 'This is default content. Your notification didn\'t have one 🙄🙄';

    console.log("[Service Worker]",event.data.json())
    console.log("hi")
    const options = {
        //data: url,
        body: body,
        //icon: image,
        vibrate: [200, 100, 200],
        //tag: tag,
        //image: image,
        badge: "https://spyna.it/icons/favicon.ico",
        actions: [{ action: "Detail", title: "View", icon: "https://via.placeholder.com/128/ff0000" }]
    };
    event.waitUntil(self.registration.showNotification(head, options));
}

function openPushNotification(event) {
    console.log("[Service Worker] Notification click Received.", event.notification.data);

    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data));
}

self.addEventListener("push", receivePushNotification);
self.addEventListener("notificationclick", openPushNotification);
console.log("hello fucking world!");