importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAITOYudxo23zbZ3jK2nOl6YzD6o9lFaaY',
  authDomain: 'metasaltnotifications.firebaseapp.com',
  projectId: 'metasaltnotifications',
  storageBucket: 'metasaltnotifications.appspot.com',
  messagingSenderId: '797576424240',
  appId: '1:797576424240:web:dd338dbc1873880ed0f6f5',
  measurementId: 'G-DPJF8T4WB6'
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
