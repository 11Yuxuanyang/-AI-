/**
 * 密钥验证和安全管理工具
 * 用于保护 API 密钥，防止泄露
 */

// 无效的占位符列表
const INVALID_PLACEHOLDERS = [
  'your_api_key_here',
  'your_api_key',
  'your-api-key',
  'sk-xxx',
  'xxx',
  'your-key',
  'your-key-here',
  'placeholder',
  'test',
  '',
];

/**
 * 验证 API 密钥是否有效（非占位符）
 */
export function isValidApiKey(key: string | undefined): boolean {
  if (!key) return false;
  const normalizedKey = key.toLowerCase().trim();
  return !INVALID_PLACEHOLDERS.includes(normalizedKey);
}

/**
 * 脱敏显示 API 密钥（用于日志）
 * 只显示前4位和后4位，中间用 *** 替代
 */
export function maskApiKey(key: string | undefined): string {
  if (!key || key.length < 8) return '***';
  return `${key.slice(0, 4)}***${key.slice(-4)}`;
}

/**
 * 验证 URL 格式是否安全（防止 SSRF）
 */
export function isValidApiUrl(url: string | undefined): boolean {
  if (!url) return false;

  try {
    const parsed = new URL(url);

    // 只允许 HTTPS（生产环境）和 HTTP（开发环境）
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }

    // 防止访问内网地址
    const hostname = parsed.hostname.toLowerCase();
    const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
    const blockedPatterns = [
      /^10\./,           // 10.x.x.x
      /^172\.(1[6-9]|2[0-9]|3[01])\./, // 172.16.x.x - 172.31.x.x
      /^192\.168\./,     // 192.168.x.x
      /\.local$/,        // .local 域名
      /\.internal$/,     // .internal 域名
    ];

    if (blockedHosts.includes(hostname)) {
      // 开发环境允许 localhost
      if (process.env.NODE_ENV === 'development') {
        return true;
      }
      return false;
    }

    for (const pattern of blockedPatterns) {
      if (pattern.test(hostname)) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * 提供商配置接口
 */
interface ProviderConfig {
  apiKey: string;
  baseUrl: string;
  imageModel?: string;
  chatModel?: string;
}

/**
 * 检查单个提供商配置是否有效
 */
export function isProviderConfigured(config: ProviderConfig): boolean {
  return isValidApiKey(config.apiKey) && isValidApiUrl(config.baseUrl);
}

/**
 * 启动时验证所有配置，返回警告信息
 */
export function validateAllConfigs(providers: Record<string, ProviderConfig>): {
  configured: string[];
  warnings: string[];
} {
  const configured: string[] = [];
  const warnings: string[] = [];

  for (const [name, providerConfig] of Object.entries(providers)) {
    if (!providerConfig.apiKey) {
      // 未配置的提供商，跳过（不是错误）
      continue;
    }

    if (!isValidApiKey(providerConfig.apiKey)) {
      warnings.push(`[${name}] API 密钥是占位符，请替换为真实密钥`);
      continue;
    }

    if (!isValidApiUrl(providerConfig.baseUrl)) {
      warnings.push(`[${name}] API URL 无效: ${providerConfig.baseUrl}`);
      continue;
    }

    configured.push(name);
  }

  return { configured, warnings };
}

/**
 * 安全地记录配置信息（不泄露密钥）
 */
export function logConfigSafely(providers: Record<string, ProviderConfig>): void {
  console.log('\n========== AI 提供商配置 ==========');

  const { configured, warnings } = validateAllConfigs(providers);

  for (const [name, providerConfig] of Object.entries(providers)) {
    const status = configured.includes(name) ? '✓ 已配置' : '✗ 未配置';
    const maskedKey = maskApiKey(providerConfig.apiKey);
    console.log(`  ${name}: ${status} (密钥: ${maskedKey})`);
  }

  if (warnings.length > 0) {
    console.log('\n⚠️ 配置警告:');
    warnings.forEach(w => console.log(`  - ${w}`));
  }

  if (configured.length === 0) {
    console.log('\n⚠️ 警告: 没有配置任何有效的 AI 提供商');
    console.log('  请编辑 .env 文件并填入有效的 API 密钥');
  } else {
    console.log(`\n✓ 已配置 ${configured.length} 个提供商: ${configured.join(', ')}`);
  }

  console.log('====================================\n');
}
