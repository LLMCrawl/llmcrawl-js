import type {
  ScrapeRequest,
  ScrapeResponse,
  CrawlRequest,
  CrawlResponse,
  CrawlStatusResponse,
  CrawlCancelResponse,
  MapRequest,
  MapResponse,
  ScrapeOptions,
  CrawlerOptions,
} from "./schema";

// Re-export all types and schemas for library consumers
export * from "./schema";

type LLMCrawlOptions = {
  apiKey: string;
  baseUrl?: string;
};

type IScrapeOptions = Partial<Omit<ScrapeRequest, "url">>;
type ICrawlOptions = Partial<Omit<CrawlRequest, "url">>;
type IMapOptions = Partial<Omit<MapRequest, "url">>;

export class LLMCrawl {
  private apiKey: string;
  private baseUrl: string;

  constructor(opts: LLMCrawlOptions) {
    if (!opts.apiKey) {
      throw new Error("Missing apiKey");
    }

    this.apiKey = opts.apiKey;
    this.baseUrl = opts.baseUrl || "https://api.llmcrawl.dev";
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  /**
   * Scrape a single webpage
   * @param url - The URL to scrape
   * @param options - Scraping options
   * @returns Promise<ScrapeResponse>
   */
  async scrape(url: string, options?: IScrapeOptions): Promise<ScrapeResponse> {
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

  /**
   * Start a crawl job for a website
   * @param url - The URL to crawl
   * @param options - Crawling options
   * @returns Promise<CrawlResponse>
   */
  async crawl(url: string, options?: ICrawlOptions): Promise<CrawlResponse> {
    const response = await fetch(`${this.baseUrl}/v1/crawl`, {
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

    return response.json() as Promise<CrawlResponse>;
  }

  /**
   * Get the status of a crawl job
   * @param jobId - The ID of the crawl job
   * @returns Promise<CrawlStatusResponse>
   */
  async getCrawlStatus(jobId: string): Promise<CrawlStatusResponse> {
    const response = await fetch(`${this.baseUrl}/v1/crawl/${jobId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    return response.json() as Promise<CrawlStatusResponse>;
  }

  /**
   * Cancel a crawl job
   * @param jobId - The ID of the crawl job to cancel
   * @returns Promise<CrawlCancelResponse>
   */
  async cancelCrawl(jobId: string): Promise<CrawlCancelResponse> {
    const response = await fetch(`${this.baseUrl}/v1/crawl/${jobId}/cancel`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    return response.json() as Promise<CrawlCancelResponse>;
  }

  /**
   * Map a website to get all URLs
   * @param url - The URL to map
   * @param options - Mapping options
   * @returns Promise<MapResponse>
   */
  async map(url: string, options?: IMapOptions): Promise<MapResponse> {
    const response = await fetch(`${this.baseUrl}/v1/map`, {
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

    return response.json() as Promise<MapResponse>;
  }
}
