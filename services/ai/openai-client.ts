import OpenAI from "openai";

type Provider = "openrouter" | "deepseek" | "openai";

type Config = {
  provider: Provider;
  apiKey: string;
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
  model: string;
  supportsJsonObject: boolean;
};

let cachedClient: OpenAI | null = null;
let cachedConfig: Config | null = null;

function resolveConfig(): Config {
  if (cachedConfig) return cachedConfig;

  const requestedModel = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  if (process.env.OPENROUTER_API_KEY) {
    // OpenRouter expects "provider/model" slugs. If caller passed a bare OpenAI
    // model like "gpt-4o-mini", promote it to "openai/gpt-4o-mini".
    const model = requestedModel.includes("/") ? requestedModel : `openai/${requestedModel}`;
    cachedConfig = {
      provider: "openrouter",
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
        "X-Title": "InterviewAI",
      },
      model,
      supportsJsonObject: true,
    };
    return cachedConfig;
  }

  if (process.env.DEEPSEEK_API_KEY) {
    // DeepSeek only serves its own models; fall back to deepseek-chat if the
    // caller left OPENAI_MODEL pointed at an OpenAI model.
    const model =
      requestedModel.startsWith("deepseek") ? requestedModel : "deepseek-chat";
    cachedConfig = {
      provider: "deepseek",
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com",
      model,
      supportsJsonObject: true,
    };
    return cachedConfig;
  }

  if (process.env.OPENAI_API_KEY) {
    cachedConfig = {
      provider: "openai",
      apiKey: process.env.OPENAI_API_KEY,
      model: requestedModel,
      supportsJsonObject: true,
    };
    return cachedConfig;
  }

  throw new Error(
    "No AI provider configured. Set OPENROUTER_API_KEY, DEEPSEEK_API_KEY, or OPENAI_API_KEY.",
  );
}

function getClient(): { client: OpenAI; config: Config } {
  const config = resolveConfig();
  if (cachedClient) return { client: cachedClient, config };
  cachedClient = new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
    defaultHeaders: config.defaultHeaders,
    maxRetries: 2,
    timeout: 30_000,
  });
  return { client: cachedClient, config };
}

export async function callOpenAI(systemPrompt: string, userPrompt: string) {
  const { client, config } = getClient();
  const response = await client.chat.completions.create({
    model: config.model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: config.supportsJsonObject ? { type: "json_object" } : undefined,
    max_tokens: 1500,
  });
  return { raw: response.choices[0]?.message?.content ?? "", usage: response.usage };
}
