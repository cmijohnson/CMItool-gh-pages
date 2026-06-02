// Firebase 配置文件
// CMItool 2.0 GitHub Pages 版本

const firebaseConfig = {
    apiKey: "AIzaSyBmHLEIxFfXylXUmnomtBGDKZ9SnxJ-bjU",
    authDomain: "github-cmiteamtop.firebaseapp.com",
    projectId: "github-cmiteamtop",
    storageBucket: "github-cmiteamtop.firebasestorage.app",
    messagingSenderId: "195134429408",
    appId: "1:195134429408:web:d012224b5182f867a91885",
    measurementId: "G-H458NF8XC3"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);

// 初始化服务
const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics();

// 导出到全局
window.firebaseAuth = auth;
window.firebaseDB = db;
window.firebaseAnalytics = analytics;

console.log('Firebase 初始化完成 - 项目: github-cmiteamtop');
