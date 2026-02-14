// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyAVJ4N323w-BHjhRAHiR579U601JUDjVPQ",
  authDomain: "techreva-doorstepsnepal-2082.firebaseapp.com",
  projectId: "techreva-doorstepsnepal-2082",
  storageBucket: "techreva-doorstepsnepal-2082.firebasestorage.app",
  messagingSenderId: "257279015429",
  appId: "1:257279015429:web:c2040312e779e199f0ba6c",
  measurementId: "G-2C59HV48MZ"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log(
//     '[firebase-messaging-sw.js] Received background message ',
//     payload
//   );
//   // Customize notification here
//     const notificationTitle = payload.notification.title;
// //   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     // body: 'Background Message body.',
//     body: payload.notification.body,
//     // icon: '/firebase-logo.png'
//     icon:payload.notification.image,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });


// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message:', payload);
  
  const data = payload.data || {};
  const notification = payload.notification || {};
  
  const title = notification.title || data.title || 'Notification';
  const options = {
    body: notification.body || data.body || '',
    icon: notification.icon || data.icon || '/icon-192x192.png',
    badge: '/badge-72x72.png',
    image: data.image_url || notification.image,
    data: {
      ...data,
      click_url: data.link_url || data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'View'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ]
  };

  // Special handling for payment notifications
  if (data.type === 'payment_success' || title.includes('Payment Successful')) {
    options.requireInteraction = true; // Stay until user interacts
    options.tag = 'payment-success'; // Group payment notifications
  }

  return self.registration.showNotification(title, options);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.click_url || '/';
  
  // Send message to all clients to refresh data
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // First, try to focus existing tab
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          client.focus();
          
          // Send refresh message
          client.postMessage({
            type: 'FCM_MESSAGE',
            payload: event.notification.data
          });
          return;
        }
      }
      
      // If no matching tab, open new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});