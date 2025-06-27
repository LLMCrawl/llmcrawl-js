import { expect, test, describe, vi } from "vitest";
import { LLMCrawl } from ".";

describe("LLMCrawl Constructor", () => {
  test("should throw an error if apiKey is missing", async () => {
    expect(() => {
      new LLMCrawl({ apiKey: "" });
    }).toThrow("Missing apiKey");
  });

  test("should set the apiKey if provided", async () => {
    const apiKey = "test-api-key";
    const llmCrawl = new LLMCrawl({ apiKey });
    expect(llmCrawl).toHaveProperty("apiKey", apiKey);
  });

  test("should use custom baseUrl if provided", async () => {
    const apiKey = "test-api-key";
    const baseUrl = "https://custom.api.com";
    const llmCrawl = new LLMCrawl({ apiKey, baseUrl });
    expect(llmCrawl.getBaseUrl()).toBe(baseUrl);
  });

  test("should use default baseUrl if not provided", async () => {
    const apiKey = "test-api-key";
    const llmCrawl = new LLMCrawl({ apiKey });
    expect(llmCrawl.getBaseUrl()).toBe("https://api.llmcrawl.dev");
  });

  describe("scrape method", () => {
    const apiKey = "test-api-key";
    const llmCrawl = new LLMCrawl({ apiKey });

    test("should call fetch with correct parameters", async () => {
      const url = "https://example.com";
      const options = { formats: ["html" as const] };
      const mockResponse = { success: true, data: { markdown: "test" } };

      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      }) as any;

      const response = await llmCrawl.scrape(url, options);

      expect(fetch).toHaveBeenCalledWith(`${llmCrawl.getBaseUrl()}/v1/scrape`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url,
          ...options,
        }),
      });

      expect(response).toEqual(mockResponse);
    });

    test("should handle missing options", async () => {
      const url = "https://example.com";
      const mockResponse = { success: true, data: { markdown: "test" } };

      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      }) as any;

      const response = await llmCrawl.scrape(url);

      expect(fetch).toHaveBeenCalledWith(`${llmCrawl.getBaseUrl()}/v1/scrape`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url,
        }),
      });

      expect(response).toEqual(mockResponse);
    });
  });

  describe("crawl method", () => {
    const apiKey = "test-api-key";
    const llmCrawl = new LLMCrawl({ apiKey });

    test("should call fetch with correct parameters", async () => {
      const url = "https://example.com";
      const options = { limit: 100 };
      const mockResponse = { success: true, id: "crawl-123", url };

      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      }) as any;

      const response = await llmCrawl.crawl(url, options);

      expect(fetch).toHaveBeenCalledWith(`${llmCrawl.getBaseUrl()}/v1/crawl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url,
          ...options,
        }),
      });

      expect(response).toEqual(mockResponse);
    });
  });

  describe("getCrawlStatus method", () => {
    const apiKey = "test-api-key";
    const llmCrawl = new LLMCrawl({ apiKey });

    test("should call fetch with correct parameters", async () => {
      const jobId = "crawl-123";
      const mockResponse = {
        success: true,
        status: "completed",
        completed: 10,
        total: 10,
        expiresAt: "2024-01-01T00:00:00Z",
        data: [],
      };

      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      }) as any;

      const response = await llmCrawl.getCrawlStatus(jobId);

      expect(fetch).toHaveBeenCalledWith(
        `${llmCrawl.getBaseUrl()}/v1/crawl/${jobId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      expect(response).toEqual(mockResponse);
    });
  });

  describe("cancelCrawl method", () => {
    const apiKey = "test-api-key";
    const llmCrawl = new LLMCrawl({ apiKey });

    test("should call fetch with correct parameters", async () => {
      const jobId = "crawl-123";
      const mockResponse = {
        success: true,
        message: "Crawl cancelled successfully",
      };

      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      }) as any;

      const response = await llmCrawl.cancelCrawl(jobId);

      expect(fetch).toHaveBeenCalledWith(
        `${llmCrawl.getBaseUrl()}/v1/crawl/${jobId}/cancel`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      expect(response).toEqual(mockResponse);
    });
  });

  describe("map method", () => {
    const apiKey = "test-api-key";
    const llmCrawl = new LLMCrawl({ apiKey });

    test("should call fetch with correct parameters", async () => {
      const url = "https://example.com";
      const options = { limit: 1000 };
      const mockResponse = {
        success: true,
        links: ["https://example.com/page1", "https://example.com/page2"],
      };

      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      }) as any;

      const response = await llmCrawl.map(url, options);

      expect(fetch).toHaveBeenCalledWith(`${llmCrawl.getBaseUrl()}/v1/map`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url,
          ...options,
        }),
      });

      expect(response).toEqual(mockResponse);
    });
  });
});
