/**
 * 后端 API 服务
 * 封装所有与后端的通信
 */

const API_BASE = '/api';

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  const result: APIResponse<T> = await response.json();

  if (!result.success) {
    throw new Error(result.error || '请求失败');
  }

  return result.data as T;
}

/**
 * 生成图片
 */
export async function generateImage(params: {
  prompt: string;
  model?: string;
  aspectRatio?: string;
}): Promise<string> {
  const { image } = await request<{ image: string }>('/ai/generate', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return image;
}

/**
 * 编辑图片
 */
export async function editImage(params: {
  image: string;
  prompt: string;
  model?: string;
}): Promise<string> {
  const { image } = await request<{ image: string }>('/ai/edit', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return image;
}

/**
 * 放大图片
 */
export async function upscaleImage(params: {
  image: string;
  resolution?: '2K' | '4K';
}): Promise<string> {
  const { image } = await request<{ image: string }>('/ai/upscale', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return image;
}

/**
 * 获取服务器配置
 */
export async function getConfig(): Promise<{
  provider: string;
  defaultModel: string;
}> {
  const response = await fetch(`${API_BASE}/config`);
  return response.json();
}

/**
 * 健康检查
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
}

// ============ Chat API ============

export interface ChatMessageInput {
  role: 'user' | 'assistant' | 'system';
  content: string;
  attachments?: Array<{
    type: string;
    content: string;
  }>;
}

export interface ChatParams {
  messages: ChatMessageInput[];
  webSearchEnabled?: boolean;
}

/**
 * 发送聊天消息（非流式）
 */
export async function chat(params: ChatParams): Promise<string> {
  const { message } = await request<{ message: string }>('/chat', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return message;
}

/**
 * 发送聊天消息（流式）
 */
export async function* chatStream(
  params: ChatParams,
  onChunk?: (chunk: string) => void
): AsyncGenerator<string, void, unknown> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...params, stream: true }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '请求失败');
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('无法读取响应');
  }

  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;

      const data = trimmedLine.slice(6);
      if (data === '[DONE]') return;

      try {
        const json = JSON.parse(data);
        if (json.error) {
          throw new Error(json.error);
        }
        if (json.content) {
          onChunk?.(json.content);
          yield json.content;
        }
      } catch (e) {
        if (e instanceof SyntaxError) continue;
        throw e;
      }
    }
  }
}
