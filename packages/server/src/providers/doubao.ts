/**
 * 豆包 (Doubao) 图像生成提供商
 * 基于火山引擎 (VolcEngine) Ark API
 * 文档: https://www.volcengine.com/docs/82379
 */

import { AIProvider, GenerateImageParams, EditImageParams, UpscaleImageParams } from './base.js';
import { config } from '../config.js';

export class DoubaoProvider implements AIProvider {
  name = 'doubao';

  private get cfg() {
    return config.providers.doubao;
  }

  /**
   * 生成图片
   * 使用 doubao-seedream 模型
   */
  async generateImage(params: GenerateImageParams): Promise<string> {
    const model = params.model || this.cfg.imageModel;

    if (!model) {
      throw new Error('未配置豆包图像模型，请在 .env 中设置 DOUBAO_IMAGE_MODEL');
    }

    console.log(`[Doubao] 生成图片: model=${model}, prompt="${params.prompt.slice(0, 50)}..."`);

    const response = await fetch(`${this.cfg.baseUrl}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.cfg.apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        prompt: params.prompt,
        size: this.mapAspectRatioToSize(params.aspectRatio),
        response_format: 'b64_json', // 返回 base64
        n: 1,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
      console.error('[Doubao] API 错误:', error);
      throw new Error(error.error?.message || `豆包 API 调用失败: ${response.status}`);
    }

    const data = await response.json();

    // 尝试获取 base64 数据
    const b64 = data.data?.[0]?.b64_json;
    if (b64) {
      return `data:image/png;base64,${b64}`;
    }

    // 如果返回的是 URL，需要下载并转换
    const url = data.data?.[0]?.url;
    if (url) {
      console.log('[Doubao] 返回 URL，正在下载转换...');
      return await this.urlToBase64(url);
    }

    throw new Error('豆包未返回图片数据');
  }

  /**
   * 编辑图片（图生图）
   * 注意：seedream 模型可能不支持编辑，这里使用 prompt 重新生成
   */
  async editImage(params: EditImageParams): Promise<string> {
    const model = params.model || this.cfg.imageModel;

    if (!model) {
      throw new Error('未配置豆包图像模型');
    }

    // 提取 base64 数据
    const base64Data = params.image.includes(',')
      ? params.image.split(',')[1]
      : params.image;

    console.log(`[Doubao] 编辑图片: model=${model}`);

    // 尝试使用图生图 API
    const response = await fetch(`${this.cfg.baseUrl}/images/edits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.cfg.apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        image: base64Data,
        prompt: params.prompt,
        response_format: 'b64_json',
        n: 1,
      }),
    });

    // 如果编辑 API 不支持，回退到纯文生图
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // 如果是不支持的操作，使用文生图替代
      if (response.status === 400 || response.status === 404) {
        console.log('[Doubao] 编辑 API 不可用，使用文生图替代');
        return this.generateImage({
          prompt: params.prompt,
          model: model,
        });
      }

      throw new Error(errorData.error?.message || `豆包编辑 API 失败: ${response.status}`);
    }

    const data = await response.json();
    const b64 = data.data?.[0]?.b64_json;

    if (b64) {
      return `data:image/png;base64,${b64}`;
    }

    const url = data.data?.[0]?.url;
    if (url) {
      return await this.urlToBase64(url);
    }

    throw new Error('豆包未返回编辑结果');
  }

  /**
   * 放大图片
   * 豆包可能不直接支持，抛出不支持错误
   */
  async upscaleImage(_params: UpscaleImageParams): Promise<string> {
    throw new Error('豆包暂不支持图片放大功能');
  }

  /**
   * 宽高比转尺寸
   * seedream 支持的尺寸可能有限制
   */
  private mapAspectRatioToSize(ratio?: string): string {
    const sizeMap: Record<string, string> = {
      '1:1': '1024x1024',
      '16:9': '1920x1080',
      '9:16': '1080x1920',
      '4:3': '1024x768',
      '3:4': '768x1024',
    };
    return sizeMap[ratio || '1:1'] || '1024x1024';
  }

  /**
   * 将 URL 图片转换为 base64
   */
  private async urlToBase64(url: string): Promise<string> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`下载图片失败: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    // 尝试从 Content-Type 获取格式
    const contentType = response.headers.get('content-type') || 'image/png';

    return `data:${contentType};base64,${base64}`;
  }
}
