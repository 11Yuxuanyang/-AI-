import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { aiRouter } from './routes/ai.js';
import { authRouter } from './routes/auth.js';
import { chatRouter } from './routes/chat.js';

const app = express();

// 中间件
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 路由
app.use('/api/ai', aiRouter);
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 获取配置
app.get('/api/config', (req, res) => {
  res.json({
    provider: config.ai.provider,
    defaultModel: config.ai.defaultModel,
    // 不暴露 API 密钥
  });
});

// 错误处理
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    error: err.message || '服务器内部错误',
  });
});

app.listen(config.port, () => {
  console.log(`🚀 服务器运行在 http://localhost:${config.port}`);
  console.log(`📦 AI 提供商: ${config.ai.provider}`);
});
