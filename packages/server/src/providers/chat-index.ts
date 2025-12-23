/**
 * Chat Provider 注册和管理
 */

import { config } from '../config.js';
import { ChatProvider } from './chat-base.js';
import { MockChatProvider } from './chat-mock.js';
import { CustomChatProvider } from './chat-custom.js';

type ChatProviderFactory = () => ChatProvider;

const chatProviders: Record<string, ChatProviderFactory> = {
  mock: () => new MockChatProvider(),
  custom: () => new CustomChatProvider(),
};

let chatProviderInstance: ChatProvider | null = null;

/**
 * 检查 API key 是否有效（不是占位符）
 */
function isValidApiKey(apiKey: string): boolean {
  if (!apiKey) return false;
  const placeholders = ['your_api_key_here', 'your_api_key', 'sk-xxx', ''];
  return !placeholders.includes(apiKey.toLowerCase());
}

/**
 * 获取 Chat Provider 实例
 * 如果没有配置有效的 API key，默认使用 mock provider
 */
export function getChatProvider(): ChatProvider {
  if (!chatProviderInstance) {
    // 如果没有配置有效的 API key 或 URL，使用 mock provider
    const hasValidConfig = isValidApiKey(config.ai.apiKey) &&
                          config.ai.apiBaseUrl &&
                          !config.ai.apiBaseUrl.includes('example.com');
    const providerName = hasValidConfig ? config.ai.provider : 'mock';
    const factory = chatProviders[providerName] || chatProviders['mock'];
    chatProviderInstance = factory();
    console.log(`[Chat] Using provider: ${chatProviderInstance.name}`);
  }
  return chatProviderInstance;
}

/**
 * 注册新的 Chat Provider
 */
export function registerChatProvider(name: string, factory: ChatProviderFactory): void {
  chatProviders[name] = factory;
}

/**
 * 重置 Provider 实例（用于测试）
 */
export function resetChatProvider(): void {
  chatProviderInstance = null;
}
