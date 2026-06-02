// Firebase Authentication 模块

// 显示登录模态框
function showLoginModal() {
    document.getElementById('login-modal').classList.remove('hidden');
}

// 隐藏登录模态框
function hideLoginModal() {
    document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('login-error').classList.add('hidden');
}

// 更新 UI 显示用户状态
function updateAuthUI(user) {
    const userMenu = document.getElementById('user-menu');
    const loginBtn = document.getElementById('login-btn');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');

    if (user) {
        // 用户已登录
        userMenu.classList.remove('hidden');
        loginBtn.classList.add('hidden');

        // 更新用户信息
        const displayName = user.displayName || user.email.split('@')[0];
        userName.textContent = displayName;
        userAvatar.textContent = displayName.charAt(0).toUpperCase();

        // 保存用户状态到全局
        window.currentUser = user;
    } else {
        // 用户未登录
        userMenu.classList.add('hidden');
        loginBtn.classList.remove('hidden');
        window.currentUser = null;
    }
}

// 显示错误信息
function showLoginError(message) {
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

// 邮箱密码登录
async function firebaseLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showLoginError('请输入邮箱和密码');
        return;
    }

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        hideLoginModal();
        console.log('登录成功:', userCredential.user.email);
    } catch (error) {
        console.error('登录失败:', error);
        switch (error.code) {
            case 'auth/user-not-found':
                showLoginError('用户不存在');
                break;
            case 'auth/wrong-password':
                showLoginError('密码错误');
                break;
            case 'auth/invalid-email':
                showLoginError('邮箱格式不正确');
                break;
            case 'auth/too-many-requests':
                showLoginError('登录尝试过多，请稍后再试');
                break;
            default:
                showLoginError('登录失败: ' + error.message);
        }
    }
}

// 注册新账号
async function firebaseRegister() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showLoginError('请输入邮箱和密码');
        return;
    }

    if (password.length < 6) {
        showLoginError('密码至少需要 6 位');
        return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);

        // 创建用户文档到 Firestore
        await db.collection('users').doc(userCredential.user.uid).set({
            email: email,
            role: 'user',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        hideLoginModal();
        console.log('注册成功:', userCredential.user.email);
    } catch (error) {
        console.error('注册失败:', error);
        switch (error.code) {
            case 'auth/email-already-in-use':
                showLoginError('该邮箱已被注册');
                break;
            case 'auth/invalid-email':
                showLoginError('邮箱格式不正确');
                break;
            case 'auth/weak-password':
                showLoginError('密码强度不够');
                break;
            default:
                showLoginError('注册失败: ' + error.message);
        }
    }
}

// Google 登录
async function firebaseGoogleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;

        // 检查用户是否已存在
        const userDoc = await db.collection('users').doc(user.uid).get();

        if (!userDoc.exists) {
            // 新用户，创建文档
            await db.collection('users').doc(user.uid).set({
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                role: 'user',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        hideLoginModal();
        console.log('Google 登录成功:', user.email);
    } catch (error) {
        console.error('Google 登录失败:', error);
        if (error.code !== 'auth/popup-closed-by-user') {
            showLoginError('Google 登录失败: ' + error.message);
        }
    }
}

// 退出登录
async function firebaseLogout() {
    try {
        await auth.signOut();
        console.log('已退出登录');
    } catch (error) {
        console.error('退出登录失败:', error);
    }
}

// 监听认证状态变化
auth.onAuthStateChanged((user) => {
    updateAuthUI(user);
    console.log('认证状态变化:', user ? user.email : '未登录');
});

// 导出函数到全局
window.showLoginModal = showLoginModal;
window.hideLoginModal = hideLoginModal;
window.firebaseLogin = firebaseLogin;
window.firebaseRegister = firebaseRegister;
window.firebaseGoogleLogin = firebaseGoogleLogin;
window.firebaseLogout = firebaseLogout;
