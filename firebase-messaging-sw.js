importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDYpP_Uk52egku25vZ4l4iRfkswlc6U4T0",
  authDomain: "amigo-ai-bc5ac.firebaseapp.com",
  projectId: "amigo-ai-bc5ac",
  storageBucket: "amigo-ai-bc5ac.appspot.com",
  messagingSenderId: "280877895436",
  appId: "1:280877895436:web:bef1e5f9f067d1cab34329"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: 'icon.png'
  });
});