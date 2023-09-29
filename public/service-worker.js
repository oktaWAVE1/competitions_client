const urlB64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

const showLocalNotification = (title, body, swRegistration) => {
    const options = {
        body,
        icon: 'sw.png',
        vibrate: [100, 100, 200]
        // here you can add more properties like icon, image, vibrate, etc.
    }
    swRegistration.showNotification(title, options)
}

const saveSubscription = async (subscription) => {


    const SERVER_URL = `http://localhost:5000/api/notification`
    const response = await fetch(SERVER_URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
    })
    console.log(response)
    return response.json()
}

self.addEventListener('activate', async () => {
    try {
        const applicationServerKey = urlB64ToUint8Array(
            'BOc-WKcpoez_uPDUX83-NHJiUhnuFahWS2Dn6Vcp2g_Ey9ipoUUf-4L_3BJDcvPwPaY-A9a1WUdKwqQh23Vfy1w'
        )
        const options = { applicationServerKey, userVisibleOnly: true }
        const subscription = await self.registration.pushManager.subscribe(options)

        const response = await saveSubscription(subscription)
    } catch (err) {
        console.log('Error', err)
    }
})

self.addEventListener("push", function(event) {
    if (event.data) {
        console.log("Push event!! ", event.data.text());
        showLocalNotification("wow-contest.ru", event.data.text(), self.registration);
    } else {
        console.log("Push event but no data");
    }
});

