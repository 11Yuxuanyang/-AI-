/**
 * Chat Provider 基础接口定义
 */

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessageInput {
  role: ChatRole;
  content: string;
  attachments?: Array<{
    type: string;
    content: string;
  }>;
}

export interface ChatRequest {
  messages: ChatMessageInput[];
  webSearchEnabled?: boolean;
  stream?: boolean;
}

export interface ChatResponse {
  message: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

export interface ChatProvider {
  name: string;
  chat(request: ChatRequest): Promise<ChatResponse>;
  chatStream(request: ChatRequest): AsyncGenerator<string, void, unknown>;
}
