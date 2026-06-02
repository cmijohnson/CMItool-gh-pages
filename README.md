# CMItool 2.0 - GitHub Pages 版本

细米兰阁中枢导航的纯前端版本，使用 Firebase 替代 PHP+MySQL 后端，可直接托管到 GitHub Pages。

<p align="center">
  <a href="https://你的用户名.github.io/CMItool-gh-pages/" target="_blank">
    <img src="https://img.shields.io/badge/Demo-Live%20Preview-success?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Demo">
  </a>
  <img src="https://img.shields.io/badge/Firebase-10.12-FFCA28?style=flat-square&logo=firebase&logoColor=white" alt="Firebase">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/github/license/你的用户名/CMItool-gh-pages?style=flat-square" alt="License">
</p>

## ✨ 特性

- 🎨 玻璃拟态 UI 设计，支持深色模式
- 🚀 纯前端驱动，极速加载
- 🔧 丰富的本地工具（量子时钟、JSON 格式化等）
- 🌐 中英文双语切换
- 📱 移动端响应式设计
- 🔐 Firebase 用户认证（邮箱/密码 + Google 登录）
- 💾 Firestore 云端数据存储

## 🚀 快速开始

### 1. Fork 或克隆仓库

```bash
git clone https://github.com/你的用户名/CMItool-gh-pages.git
cd CMItool-gh-pages
```

### 2. 创建 Firebase 项目

1. 访问 [Firebase Console](https://console.firebase.google.com)
2. 点击「创建项目」
3. 输入项目名称（如 `cmi-tool`）
4. 启用 Google Analytics（可选）

### 3. 配置 Firebase

#### 3.1 添加 Web 应用

1. 在项目概览页面点击「Web」图标（`</>`）
2. 输入应用昵称（如 `cmi-tool-web`）
3. 复制生成的配置对象

#### 3.2 启用认证方式

1. 左侧菜单选择「Authentication」
2. 点击「开始使用」
3. 在「Sign-in method」标签页启用：
   - ✅ Email/Password（邮箱密码）
   - ✅ Google（Google 登录）

#### 3.3 创建 Firestore 数据库

1. 左侧菜单选择「Firestore Database」
2. 点击「创建数据库」
3. 选择「以测试模式开始」（开发阶段）
4. 选择数据库位置（建议 `asia-east1` 或 `asia-southeast1`）

#### 3.4 更新配置文件

编辑 `assets/js/firebase-config.js`，填入你的 Firebase 配置：

```javascript
const firebaseConfig = {
    apiKey: "你的 API Key",
    authDomain: "你的项目.firebaseapp.com",
    projectId: "你的项目 ID",
    storageBucket: "你的项目.appspot.com",
    messagingSenderId: "你的发送者 ID",
    appId: "你的应用 ID"
};
```

### 4. 迁移数据（可选）

如果你想使用 Firebase 存储动态数据：

1. 打开 `scripts/migrate-to-firestore.html`
2. 填入 Firebase 配置
3. 从 `assets/js/data.js` 复制数据
4. 点击迁移按钮

### 5. 部署到 GitHub Pages

#### 方法一：直接部署

1. 将代码推送到 GitHub
2. 进入仓库 Settings → Pages
3. Source 选择 `Deploy from a branch`
4. Branch 选择 `main`，文件夹选择 `/ (root)`
5. 点击 Save

#### 方法二：使用 GitHub Actions（推荐）

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - id: deployment
        uses: actions/deploy-pages@v4
```

## 📁 项目结构

```
CMItool-gh-pages/
├── index.html                 # 主页面
├── assets/
│   ├── css/
│   │   └── style.css         # 自定义样式
│   ├── js/
│   │   ├── firebase-config.js # Firebase 配置
│   │   ├── auth.js           # 用户认证模块
│   │   ├── data.js           # 静态数据（工具、翻译）
│   │   ├── tools.js          # 工具组件
│   │   └── app.js            # 应用主逻辑
│   └── vendor/               # 第三方库
│       ├── tailwind.min.js
│       ├── lucide.min.js
│       └── fonts.css
├── scripts/
│   └── migrate-to-firestore.html  # 数据迁移工具
├── photos/                   # 项目截图
├── README.md
└── LICENSE
```

## 🔧 本地开发

使用任意静态文件服务器：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js (npx)
npx serve .

# 使用 VS Code Live Server 扩展
# 右键 index.html → Open with Live Server
```

访问 `http://localhost:8000` 即可预览。

## 📝 自定义

### 修改工具列表

编辑 `assets/js/data.js` 中的 `TOOLS` 数组：

```javascript
{
    id: 'your-tool-id',
    name: { en: 'Tool Name', zh: '工具名称' },
    description: { en: 'Description', zh: '描述' },
    icon: 'icon-name',  // Lucide 图标名称
    category: 'Tool',   // Recommend/International/SmartUJS/Tool/Info/External
    size: 'small',      // small/medium/large
    url: 'https://...', // 外部链接（可选）
    component: 'component-name' // 内置组件（可选）
}
```

### 修改翻译

编辑 `assets/js/data.js` 中的 `TRANSLATIONS` 对象。

### 修改样式

编辑 `assets/css/style.css` 或修改 Tailwind 配置。

## 🔒 安全规则

### Firestore 安全规则示例

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 工具数据：所有人可读，仅管理员可写
    match /tools/{toolId} {
      allow read: if true;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // 更新日志：所有人可读，仅管理员可写
    match /changelogs/{logId} {
      allow read: if true;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // 用户数据：仅本人可读写
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // 留言板：所有人可读，登录用户可创建，仅本人可删除
    match /messages/{messageId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## 🆚 与原版对比

| 功能 | 原版 (PHP+MySQL) | GitHub Pages 版 |
|------|------------------|-----------------|
| 托管方式 | 自建服务器 LNMP | GitHub Pages |
| 后端语言 | PHP 7.4+ | 无（纯前端） |
| 数据库 | MySQL 5.7+ | Firebase Firestore |
| 用户认证 | 自定义 PHP Session | Firebase Auth |
| 动态数据 | ✅ | ✅ (Firebase) |
| 静态数据 | ✅ | ✅ (data.js) |
| 部署难度 | 需要服务器 | 简单（推送到 GitHub） |
| 费用 | 服务器费用 | 免费（Firebase 免费额度） |

## 📸 截图

![主页](./photos/PixPin_2026-01-08_00-48-59.png)
![工具](./photos/PixPin_2026-01-08_00-48-45.png)
![深色模式](./photos/PixPin_2026-01-08_00-48-38.png)
![移动端](./photos/PixPin_2026-01-08_00-48-23.png)

## 📄 许可证

[MIT](LICENSE)

## 🙏 致谢

- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Firebase](https://firebase.google.com)
- [CMI 团队](https://www.cmiteam.top)

## 📞 联系我们

- 官网：https://www.cmiteam.top
- 邮箱：contact@cmiteam.top

---

**CMItool Labs · 细米科技工作室**
