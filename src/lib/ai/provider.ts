export type AiProviderId = "openai" | "deepseek" | "qwen";

export type AiClientConfig = {
  provider: AiProviderId;
  apiKey: string | undefined;
  baseURL?: string;
  model: string;
};

const PROVIDERS: Record<
  AiProviderId,
  { baseURL?: string; defaultModel: string; keyEnv: string[] }
> = {
  openai: {
    defaultModel: "gpt-4o-mini",
    keyEnv: ["OPENAI_API_KEY", "AI_API_KEY"],
  },
  deepseek: {
    baseURL: "https://api.deepseek.com",
    defaultModel: "deepseek-chat",
    keyEnv: ["DEEPSEEK_API_KEY", "AI_API_KEY", "OPENAI_API_KEY"],
  },
  qwen: {
    baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    defaultModel: "qwen-plus",
    keyEnv: ["DASHSCOPE_API_KEY", "QWEN_API_KEY", "AI_API_KEY", "OPENAI_API_KEY"],
  },
};

function pickEnv(keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key];
    if (value?.trim()) return value.trim();
  }
  return undefined;
}

export function resolveAiClientConfig(): AiClientConfig {
  const raw = (process.env.AI_PROVIDER ?? "openai").toLowerCase();
  const provider: AiProviderId =
    raw === "deepseek" || raw === "qwen" ? raw : "openai";

  const preset = PROVIDERS[provider];
  const apiKey = pickEnv(preset.keyEnv);
  const baseURL = process.env.AI_BASE_URL?.trim() || preset.baseURL;
  const model = process.env.AI_MODEL?.trim() || preset.defaultModel;

  return { provider, apiKey, baseURL, model };
}
