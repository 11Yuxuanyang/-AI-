import 'dotenv/config';

export const config = {
  // 服务器配置
  port: parseInt(process.env.PORT || '3001', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // AI 提供商配置
  ai: {
    provider: process.env.AI_PROVIDER || 'custom',
    apiKey: process.env.AI_API_KEY || '',
    apiBaseUrl: process.env.AI_API_BASE_URL || '',
    defaultModel: process.env.AI_DEFAULT_MODEL || 'default',
  },

  // 微信登录配置
  wechat: {
    appId: process.env.WECHAT_APP_ID || '',
    appSecret: process.env.WECHAT_APP_SECRET || '',
    // 微信回调地址（需要和开放平台配置一致）
    redirectUri: process.env.WECHAT_REDIRECT_URI || 'http://localhost:3001/api/auth/wechat/callback',
  },

  // JWT 配置
  jwt: {
    secret: process.env.JWT_SECRET || 'your-jwt-secret-change-in-production',
    expiresIn: '7d',
  },
};
