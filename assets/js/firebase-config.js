// Firebase 配置文件
// 请在 Firebase Console (https://console.firebase.google.com) 创建项目后填入配置

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);

// 初始化服务
const auth = firebase.auth();
const db = firebase.firestore();

// 导出到全局
window.firebaseAuth = auth;
window.firebaseDB = db;

console.log('Firebase 初始化完成');
