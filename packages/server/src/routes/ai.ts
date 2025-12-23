import { Router, Request, Response, NextFunction } from 'express';
import { getProvider } from '../providers/index.js';

export const aiRouter = Router();

// 异步错误处理包装器
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * POST /api/ai/generate
 * 生成图片
 */
aiRouter.post('/generate', asyncHandler(async (req: Request, res: Response) => {
  const { prompt, model, aspectRatio, options } = req.body;

  if (!prompt) {
    return res.status(400).json({
      success: false,
      error: '缺少 prompt 参数',
    });
  }

  const provider = getProvider();
  const image = await provider.generateImage({
    prompt,
    model,
    aspectRatio,
    options,
  });

  res.json({
    success: true,
    data: { image },
  });
}));

/**
 * POST /api/ai/edit
 * 编辑图片
 */
aiRouter.post('/edit', asyncHandler(async (req: Request, res: Response) => {
  const { image, prompt, model, options } = req.body;

  if (!image) {
    return res.status(400).json({
      success: false,
      error: '缺少 image 参数',
    });
  }

  if (!prompt) {
    return res.status(400).json({
      success: false,
      error: '缺少 prompt 参数',
    });
  }

  const provider = getProvider();
  const resultImage = await provider.editImage({
    image,
    prompt,
    model,
    options,
  });

  res.json({
    success: true,
    data: { image: resultImage },
  });
}));

/**
 * POST /api/ai/upscale
 * 放大图片
 */
aiRouter.post('/upscale', asyncHandler(async (req: Request, res: Response) => {
  const { image, resolution, options } = req.body;

  if (!image) {
    return res.status(400).json({
      success: false,
      error: '缺少 image 参数',
    });
  }

  const provider = getProvider();

  if (!provider.upscaleImage) {
    return res.status(501).json({
      success: false,
      error: '当前提供商不支持图片放大功能',
    });
  }

  const resultImage = await provider.upscaleImage({
    image,
    resolution,
    options,
  });

  res.json({
    success: true,
    data: { image: resultImage },
  });
}));
