import { LLMCrawl } from "./src/index";

// Initialize the client
const client = new LLMCrawl({
  apiKey: "your-api-key-here",
});

async function examples() {
  try {
    // Example 1: Simple scraping
    console.log("=== Simple Scraping ===");
    const scrapeResult = await client.scrape("https://example.com", {
      formats: ["markdown", "html"],
    });

    if (scrapeResult.success) {
      console.log("Scraping successful!");
      console.log("Markdown length:", scrapeResult.data.markdown?.length);
    } else {
      console.error("Scraping failed:", scrapeResult.error);
    }

    // Example 2: AI-powered extraction
    console.log("\n=== AI-Powered Extraction ===");
    const extractResult = await client.scrape(
      "https://example-store.com/product",
      {
        formats: ["markdown"],
        extract: {
          mode: "llm" as const,
          systemPrompt:
            "Extract product information from this e-commerce page.",
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              price: { type: "number" },
              description: { type: "string" },
              inStock: { type: "boolean" },
            },
            required: ["title", "price"],
          },
        },
      }
    );

    if (extractResult.success && extractResult.data.extract) {
      console.log("Extraction successful!");
      const productData = JSON.parse(extractResult.data.extract);
      console.log("Product data:", productData);
    }

    // Example 3: Website crawling
    console.log("\n=== Website Crawling ===");
    const crawlResult = await client.crawl("https://docs.example.com", {
      limit: 50,
      maxDepth: 3,
      includePaths: ["/docs/*"],
      excludePaths: ["/docs/internal/*"],
      scrapeOptions: {
        formats: ["markdown"],
        waitFor: 0,
        extract: {
          mode: "llm" as const,
          systemPrompt: "Extract documentation structure from this page.",
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              section: { type: "string" },
              content: { type: "string" },
            },
          },
        },
      },
    });

    if (crawlResult.success) {
      console.log("Crawl started with ID:", crawlResult.id);

      // Poll for status
      let status = await client.getCrawlStatus(crawlResult.id);
      console.log("Initial status:", status.success ? status.status : "Error");

      // In a real application, you'd poll periodically until completion
      while (status.success && status.status === "scraping") {
        console.log(`Progress: ${status.completed}/${status.total} pages`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        status = await client.getCrawlStatus(crawlResult.id);
      }

      if (status.success && status.status === "completed") {
        console.log("Crawl completed!");
        console.log("Total pages scraped:", status.data.length);
      }
    }

    // Example 4: Site mapping
    console.log("\n=== Site Mapping ===");
    const mapResult = await client.map("https://example.com", {
      limit: 100,
      includeSubdomains: false,
      search: "blog",
    });

    if (mapResult.success) {
      console.log("Site mapping successful!");
      console.log("Found links:", mapResult.links.length);
      console.log("Sample links:", mapResult.links.slice(0, 5));
    }
  } catch (error) {
    console.error("Example error:", error);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  examples();
}

export { examples };
