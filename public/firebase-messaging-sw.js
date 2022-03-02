importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyDYq7pxlORqd7Pi7ruHzZEmn8yOWAGThZM",
  authDomain: "dovb-blog.firebaseapp.com",
  projectId: "dovb-blog",
  storageBucket: "dovb-blog.appspot.com",
  messagingSenderId: "487590574701",
  appId: "1:487590574701:web:69f4df7f78b5bf9ad31d64",
  measurementId: "G-G7XTBGWJ9C",
};

firebase.initializeApp(firebaseConfig);
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
