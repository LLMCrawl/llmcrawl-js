# LLMCrawl JavaScript SDK

[![npm version](https://badge.fury.io/js/@llmcrawl%2Fllmcrawl-js.svg)](https://badge.fury.io/js/@llmcrawl%2Fllmcrawl-js)

The official JavaScript SDK for LLMCrawl, providing a simple and powerful way to scrape websites, crawl multiple pages, and extract structured data using AI.

## Installation

```bash
npm install @llmcrawl/llmcrawl-js
```

> **Note:** Version 1.0.0 introduces breaking changes. If you're upgrading from 0.x, please use named imports: `import { LLMCrawl } from '@llmcrawl/llmcrawl-js'`

## Quick Start

```typescript
import { LLMCrawl } from "@llmcrawl/llmcrawl-js";

const client = new LLMCrawl({
  apiKey: "your-api-key-here",
});

// Scrape a single page
const result = await client.scrape("https://example.com");
console.log(result.data?.markdown);
```

## Features

- 🌐 **Single Page Scraping** - Extract content from individual web pages
- 🕷️ **Website Crawling** - Crawl entire websites with customizable options
- 🗺️ **Site Mapping** - Get all URLs from a website
- 🤖 **AI-Powered Extraction** - Extract structured data using custom schemas
- 📷 **Screenshot Capture** - Take screenshots of web pages
- ⚙️ **Flexible Configuration** - Extensive customization options

## API Reference

### Constructor

```typescript
import { LLMCrawl } from "@llmcrawl/llmcrawl-js";

const client = new LLMCrawl({
  apiKey: "your-api-key",
  baseUrl: "https://api.llmcrawl.dev", // Optional custom base URL
});
```

### Scraping

#### `scrape(url, options?)`

Scrape a single webpage and extract its content.

```typescript
const result = await client.scrape("https://example.com", {
  formats: ["markdown", "html", "links"],
  headers: {
    "User-Agent": "Mozilla/5.0...",
  },
  waitFor: 3000, // Wait 3 seconds for page to load
  extract: {
    schema: {
      type: "object",
      properties: {
        title: { type: "string" },
        price: { type: "number" },
        description: { type: "string" },
      },
      required: ["title", "price"],
    },
  },
});

if (result.success) {
  console.log("Markdown:", result.data.markdown);
  console.log("Extracted data:", result.data.extract);
  console.log("Links:", result.data.links);
}
```

**Options:**

- `formats`: Array of formats to return (`'markdown'`, `'html'`, `'rawHtml'`, `'links'`, `'screenshot'`, `'screenshot@fullPage'`)
- `headers`: Custom HTTP headers
- `includeTags`: HTML tags to include in output
- `excludeTags`: HTML tags to exclude from output
- `timeout`: Request timeout in milliseconds (1000-90000)
- `waitFor`: Delay before capturing content (0-60000ms)
- `extract`: AI extraction configuration
- `webhookUrls`: URLs to send results to
- `metadata`: Additional metadata to include

### Crawling

#### `crawl(url, options?)`

Start a crawl job to scrape multiple pages from a website.

```typescript
const crawlResult = await client.crawl("https://example.com", {
  limit: 100,
  maxDepth: 3,
  includePaths: ["/blog/*", "/docs/*"],
  excludePaths: ["/admin/*"],
  scrapeOptions: {
    formats: ["markdown"],
    extract: {
      schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          content: { type: "string" },
        },
      },
    },
  },
});

if (crawlResult.success) {
  console.log("Crawl started with ID:", crawlResult.id);
}
```

**Options:**

- `limit`: Maximum number of pages to crawl
- `maxDepth`: Maximum crawl depth
- `includePaths`: Array of path patterns to include
- `excludePaths`: Array of path patterns to exclude
- `allowBackwardLinks`: Allow crawling backward links
- `allowExternalLinks`: Allow crawling external domains
- `ignoreSitemap`: Ignore robots.txt and sitemap.xml
- `scrapeOptions`: Scraping options for each page
- `webhookUrls`: URLs for webhook notifications
- `webhookMetadata`: Additional webhook metadata

#### `getCrawlStatus(jobId)`

Check the status of a crawl job.

```typescript
const status = await client.getCrawlStatus("crawl-job-id");

if (status.success) {
  console.log("Status:", status.status);
  console.log("Progress:", `${status.completed}/${status.total}`);
  console.log("Data:", status.data); // Array of scraped pages
}
```

#### `cancelCrawl(jobId)`

Cancel a running crawl job.

```typescript
const result = await client.cancelCrawl("crawl-job-id");

if (result.success) {
  console.log("Crawl cancelled:", result.message);
}
```

### Site Mapping

#### `map(url, options?)`

Get all URLs from a website without scraping their content.

```typescript
const mapResult = await client.map("https://example.com", {
  limit: 1000,
  includeSubdomains: true,
  search: "documentation",
});

if (mapResult.success) {
  console.log("Found URLs:", mapResult.links);
}
```

**Options:**

- `limit`: Maximum number of links to return (1-5000)
- `includeSubdomains`: Include subdomain URLs
- `search`: Filter links by search query
- `ignoreSitemap`: Ignore robots.txt and sitemap.xml
- `includePaths`: Path patterns to include
- `excludePaths`: Path patterns to exclude

## AI-Powered Data Extraction

LLMCrawl supports advanced AI-powered data extraction using custom schemas:

```typescript
const result = await client.scrape("https://example-store.com/product/123", {
  formats: ["markdown"],
  extract: {
    mode: "llm",
    schema: {
      type: "object",
      properties: {
        productName: { type: "string" },
        price: { type: "number" },
        description: { type: "string" },
        inStock: { type: "boolean" },
        reviews: {
          type: "array",
          items: {
            type: "object",
            properties: {
              rating: { type: "number" },
              comment: { type: "string" },
              author: { type: "string" },
            },
          },
        },
      },
      required: ["productName", "price"],
    },
    systemPrompt: "Extract product information from this e-commerce page.",
    prompt: "Focus on getting accurate pricing and availability information.",
  },
});

if (result.success && result.data.extract) {
  const productData = JSON.parse(result.data.extract);
  console.log("Product:", productData.productName);
  console.log("Price:", productData.price);
  console.log("In Stock:", productData.inStock);
}
```

## Error Handling

All methods return a response object with a `success` field:

```typescript
const result = await client.scrape("https://example.com");

if (result.success) {
  // Handle successful response
  console.log(result.data);
} else {
  // Handle error
  console.error("Error:", result.error);
  console.error("Details:", result.details);
}
```

## Type Definitions

The SDK includes comprehensive TypeScript types:

```typescript
import {
  ScrapeResponse,
  CrawlResponse,
  CrawlStatusResponse,
  Document,
  ExtractOptions,
  ScrapeOptions,
  CrawlerOptions,
} from "@llmcrawl/llmcrawl-js";
```

## Examples

### E-commerce Product Scraping

```typescript
const product = await client.scrape("https://store.example.com/product/123", {
  formats: ["markdown"],
  extract: {
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        price: { type: "number" },
        rating: { type: "number" },
        availability: { type: "string" },
      },
    },
  },
});
```

### News Article Extraction

```typescript
const article = await client.scrape("https://news.example.com/article/123", {
  formats: ["markdown", "html"],
  extract: {
    schema: {
      type: "object",
      properties: {
        headline: { type: "string" },
        author: { type: "string" },
        publishDate: { type: "string" },
        content: { type: "string" },
        tags: { type: "array", items: { type: "string" } },
      },
    },
  },
});
```

### Documentation Crawling

```typescript
// Start crawling documentation
const crawl = await client.crawl("https://docs.example.com", {
  limit: 500,
  includePaths: ["/docs/*", "/api/*"],
  excludePaths: ["/docs/internal/*"],
  scrapeOptions: {
    formats: ["markdown"],
    extract: {
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

// Poll for completion
if (crawl.success) {
  let status = await client.getCrawlStatus(crawl.id);
  while (status.success && status.status === "scraping") {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    status = await client.getCrawlStatus(crawl.id);
  }

  if (status.success && status.status === "completed") {
    console.log("Crawl completed!");
    console.log("Pages scraped:", status.data.length);
  }
}
```

## Support

- 📧 Email: contact@llmcrawl.dev
- 📚 Documentation: https://docs.llmcrawl.dev
- 🐛 Issues: https://github.com/LLMCrawl/llmcrawl-js/issues

## License

MIT License - see LICENSE file for details.
