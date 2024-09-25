import type { ScrapeRequest, ScrapeResponse } from "./schema";

type LLMCrawlOptions = {
  apiKey: string;
};

type IOptions = Partial<Omit<ScrapeRequest, "url">>;

export default class LLMCrawl {
  private apiKey: string;
  private baseUrl = "https://api.llmcrawl.dev";

  constructor(opts: LLMCrawlOptions) {
    if (!opts.apiKey) {
      throw new Error("Missing apiKey");
    }

    this.apiKey = opts.apiKey;
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  async scrape(url: string, options?: IOptions): Promise<ScrapeResponse> {
    const response = await fetch(`${this.baseUrl}/v1/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        url,
        ...(options ? options : {}),
      }),
    });

    return response.json() as Promise<ScrapeResponse>;
  }
}
