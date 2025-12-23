import { config } from '../config.js';
import { AIProvider } from './base.js';
import { CustomProvider } from './custom.js';

// 提供商注册表
const providers: Record<string, () => AIProvider> = {
  custom: () => new CustomProvider(),
  // 在这里添加更多提供商
  // doubao: () => new DoubaoProvider(),
  // banana: () => new BananaProvider(),
};

let currentProvider: AIProvider | null = null;

/**
 * 获取当前 AI 提供商实例
 */
export function getProvider(): AIProvider {
  if (!currentProvider) {
    const providerName = config.ai.provider;
    const createProvider = providers[providerName];

    if (!createProvider) {
      throw new Error(`未知的 AI 提供商: ${providerName}。可用: ${Object.keys(providers).join(', ')}`);
    }

    currentProvider = createProvider();
    console.log(`✅ 已加载 AI 提供商: ${currentProvider.name}`);
  }

  return currentProvider;
}

/**
 * 注册新的提供商
 */
export function registerProvider(name: string, factory: () => AIProvider): void {
  providers[name] = factory;
}

export * from './base.js';
