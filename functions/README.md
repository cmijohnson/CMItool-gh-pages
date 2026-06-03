# ITLab 天气服务 Cloud Functions

这个目录包含 Firebase Cloud Functions 代码，用于安全地代理天气 API 请求。

## 功能说明

- ✅ Token 安全存储在后端，不暴露给前端
- ✅ 1小时缓存机制，避免频繁调用 API
- ✅ 支持多城市天气查询
- ✅ 定时更新天气数据

## 部署步骤

### 1. 安装 Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. 登录 Firebase

```bash
firebase login
```

### 3. 初始化项目（如果还没有）

```bash
cd /Users/cmijohnson/CMItool-gh-pages
firebase init functions
```

选择项目 `github-cmiteamtop`

### 4. 安装依赖

```bash
cd functions
npm install
```

### 5. 部署 Cloud Functions

```bash
cd /Users/cmijohnson/CMItool-gh-pages
firebase deploy --only functions
```

### 6. 部署完成后

部署成功后，Firebase 会显示函数的 URL，格式类似：
```
https://getWeather-xxxxxxxxxx-uc.a.run.app
```

将这个 URL 更新到前端代码中。

## Cloud Function 说明

### 1. `getWeather` (HTTP 触发)
- 前端可以直接通过 HTTP 请求调用
- 支持 GET 和 POST 方法
- 参数：`city`（城市名称）

### 2. `fetchWeather` (可调用函数)
- 通过 Firebase SDK 调用
- 更安全，自动处理认证

### 3. `scheduledWeatherUpdate` (定时触发)
- 每小时自动更新天气数据
- 更新城市：镇江、南京、上海、北京

## Firestore 集合

### `weather_cache`
存储天气数据缓存：
```javascript
{
  weatherData: { ... },  // 天气数据
  city: "镇江",          // 城市名称
  updatedAt: Timestamp   // 更新时间
}
```

## 安全说明

- ✅ API Token 存储在 Cloud Functions 环境中
- ✅ 前端无法直接访问 Token
- ✅ 缓存机制减少 API 调用次数
- ✅ CORS 配置允许跨域请求

## 注意事项

1. 部署前确保 Firebase Blaze 计划（按量付费）
2. Cloud Functions 有免费额度，足够个人使用
3. 定时触发需要 Cloud Scheduler，可能需要额外配置
