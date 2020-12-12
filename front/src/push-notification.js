/* eslint-disable */
import axios from 'axios';

export const VAPID_PUBLIC_KEY = "BNM71Y9WCce_qujpq0SBQzR9TExQKVBeeXc3VSwzD90I6JZv7FyrnOFIeI6sNx2o7kKIAJkByXMIxrCc7_2txRw";
/**
 * checks if Push notification and service workers are supported by your browser
 */
function isPushNotificationSupported() {
    return "serviceWorker" in navigator && "PushManager" in window;
}

/**
 * asks user consent to receive push notifications and returns the response of the user, one of granted, default, denied
 */
function initializePushNotifications() {
    // request user grant to show notification
    return Notification.requestPermission(function(result) {
        return result;
    });
}
/**
 * shows a notification
 */
function sendNotification() {
    const img = "src/static/logo.png";
    const text = "Click 'see results' for detailed report of your backtest";
    const title = "Your backtest is over!!!";
    const options = {
        body: text,
        vibrate: [200, 100, 200],
        tag: "new-product",
        image: img,
        badge: "https://spyna.it/icons/android-icon-192x192.png",
        actions: [{ action: "Detail", title: "See Results", icon: "https://via.placeholder.com/128/ff0000" }]
    };
    navigator.serviceWorker.ready.then(function(serviceWorker) {
        console.log("am i ready?")
        serviceWorker.showNotification(title, options);
    });
}

/**
 *
 */
async function registerServiceWorker() {
    const swRegistration = await navigator.serviceWorker.register("sw.js");
    console.log(swRegistration);
    return swRegistration;

}

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      // eslint-disable-next-line no-useless-escape
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    const outputData = outputArray.map((output, index) => rawData.charCodeAt(index));

    return outputData;
}

const subscribe = async (reg) => {
    const subscription = await reg.pushManager.getSubscription();
    if (subscription) {
        sendSubData(subscription);
        return;
    }

    const key = VAPID_PUBLIC_KEY;
    const options = {
        userVisibleOnly: true,
        // if key exists, create applicationServerKey property
        ...(key && {applicationServerKey: urlB64ToUint8Array(key)})
    };

    const sub = await reg.pushManager.subscribe(options);
    sendSubData(sub)
};

const sendSubData = async (subscription) => {
    const browser = navigator.userAgent.match(/(firefox|msie|chrome|safari|trident)/ig)[0].toLowerCase();
    const data = {
        status_type: 'subscribe',
        subscription: subscription.toJSON(),
        browser: browser,
    };

    const res = await axios.post('api/webpush/save_information', JSON.stringify(data));
    // const res = await fetch('api/webpush', {
    //     method: 'POST',
    //     body: JSON.stringify(data),
    //     headers: {
    //         'content-type': 'application/json'
    //     },
    //     credentials: "include"
    // });

    handleResponse(res);
};

const handleResponse = (res) => {
    console.log(res.status);
};


export {
    isPushNotificationSupported,
    initializePushNotifications,
    registerServiceWorker,
    sendNotification,
    subscribe
};
