const firebaseConfig = {
    apiKey: "AIzaSyDzYgSTPi4S9v3DT7zzRG_yLPVjN6JedII",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "pioneers-hub",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "BNmlQQH1IIoI7cSiSfPN2oU3F72pc9SIwh7dXWEymb6jZH2O-HN0r1K5oYMg5BsCD_DDNtILm78Shxg21XK0fcg",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
