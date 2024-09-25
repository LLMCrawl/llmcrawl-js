import { expect, test, describe, vi } from "vitest";
import LLMCrawl from ".";

describe("LLMCrawl Constructor", (t) => {
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

  describe("scrape method", () => {
    const apiKey = "test-api-key";
    const llmCrawl = new LLMCrawl({ apiKey });

    test("should call fetch with correct parameters", async () => {
      const url = "https://example.com";
      const options = { formats: ["html" as const] };
      const mockResponse = { data: "test" };

      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

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
      const mockResponse = { data: "test" };

      global.fetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

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
});
