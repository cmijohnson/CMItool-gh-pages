const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();

// 天气 API Token（安全存储在后端）
const WEATHER_API_TOKEN = "AmZjOQgzPoBlwNswHZWYEBNvCjIJbCeH";
const WEATHER_API_URL = "https://api.istero.com/resource/v1/hefeng/weather";

// 默认城市
const DEFAULT_CITY = "镇江";

/**
 * 获取天气数据的 Cloud Function
 * 支持 HTTP 调用，前端可以直接请求
 */
exports.getWeather = functions.https.onRequest(async (req, res) => {
  // 设置 CORS 头
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // 处理预检请求
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    const city = req.query.city || req.body.city || DEFAULT_CITY;

    // 检查 Firestore 缓存（1小时有效期）
    const cacheDoc = await admin.firestore()
        .collection("weather_cache")
        .doc(city)
        .get();

    if (cacheDoc.exists) {
      const cacheData = cacheDoc.data();
      const cacheTime = cacheData.updatedAt.toDate();
      const now = new Date();
      const diffMinutes = (now - cacheTime) / (1000 * 60);

      // 如果缓存未过期（60分钟内），直接返回缓存数据
      if (diffMinutes < 60) {
        console.log(`返回缓存数据: ${city}, 缓存时间: ${diffMinutes.toFixed(1)}分钟前`);
        res.json({
          success: true,
          data: cacheData.weatherData,
          fromCache: true,
          cacheAge: Math.round(diffMinutes),
        });
        return;
      }
    }

    // 缓存过期或不存在，调用天气 API
    console.log(`调用天气 API: ${city}`);

    const response = await fetch(`${WEATHER_API_URL}?city=${encodeURIComponent(city)}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${WEATHER_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API 响应错误: ${response.status}`);
    }

    const result = await response.json();

    if (result.code !== 200) {
      throw new Error(`API 返回错误: ${result.message || "未知错误"}`);
    }

    const weatherData = result.data;

    // 更新缓存
    await admin.firestore()
        .collection("weather_cache")
        .doc(city)
        .set({
          weatherData: weatherData,
          city: city,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

    console.log(`天气数据已更新: ${city}`);

    res.json({
      success: true,
      data: weatherData,
      fromCache: false,
    });
  } catch (error) {
    console.error("获取天气数据失败:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * 获取天气数据（可调用函数版本）
 * 前端可以通过 Firebase SDK 调用
 */
exports.fetchWeather = functions.https.onCall(async (data, context) => {
  const city = data.city || DEFAULT_CITY;

  try {
    // 检查缓存
    const cacheDoc = await admin.firestore()
        .collection("weather_cache")
        .doc(city)
        .get();

    if (cacheDoc.exists) {
      const cacheData = cacheDoc.data();
      const cacheTime = cacheData.updatedAt.toDate();
      const now = new Date();
      const diffMinutes = (now - cacheTime) / (1000 * 60);

      if (diffMinutes < 60) {
        return {
          success: true,
          data: cacheData.weatherData,
          fromCache: true,
          cacheAge: Math.round(diffMinutes),
        };
      }
    }

    // 调用 API
    const response = await fetch(`${WEATHER_API_URL}?city=${encodeURIComponent(city)}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${WEATHER_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API 响应错误: ${response.status}`);
    }

    const result = await response.json();

    if (result.code !== 200) {
      throw new Error(`API 返回错误: ${result.message || "未知错误"}`);
    }

    const weatherData = result.data;

    // 更新缓存
    await admin.firestore()
        .collection("weather_cache")
        .doc(city)
        .set({
          weatherData: weatherData,
          city: city,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

    return {
      success: true,
      data: weatherData,
      fromCache: false,
    };
  } catch (error) {
    console.error("获取天气数据失败:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

/**
 * 定时更新天气数据（每小时执行一次）
 * 使用 Cloud Scheduler 触发
 */
exports.scheduledWeatherUpdate = functions.pubsub
    .schedule("every 1 hours")
    .onRun(async (context) => {
      const cities = ["镇江", "南京", "上海", "北京"];

      for (const city of cities) {
        try {
          const response = await fetch(
              `${WEATHER_API_URL}?city=${encodeURIComponent(city)}`,
              {
                method: "GET",
                headers: {
                  "Authorization": `Bearer ${WEATHER_API_TOKEN}`,
                },
              }
          );

          if (response.ok) {
            const result = await response.json();
            if (result.code === 200) {
              await admin.firestore()
                  .collection("weather_cache")
                  .doc(city)
                  .set({
                    weatherData: result.data,
                    city: city,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                  });
              console.log(`定时更新天气成功: ${city}`);
            }
          }
        } catch (error) {
          console.error(`定时更新天气失败: ${city}`, error);
        }
      }

      return null;
    });
