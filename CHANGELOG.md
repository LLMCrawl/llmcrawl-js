# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-XX

### Added

- **Breaking Change**: Complete rewrite to match current API implementation
- **New**: Website crawling functionality with `crawl()` method
- **New**: Crawl status monitoring with `getCrawlStatus()` method
- **New**: Crawl cancellation with `cancelCrawl()` method
- **New**: Site mapping functionality with `map()` method
- **New**: AI-powered data extraction with custom schemas
- **New**: Comprehensive TypeScript types and schemas
- **New**: Support for multiple output formats (markdown, html, rawHtml, links, screenshots)
- **New**: Advanced configuration options (headers, timeouts, element filtering)
- **New**: Webhook support for async operations
- **New**: Custom base URL configuration
- **New**: Path filtering for crawling (include/exclude patterns)
- **New**: Crawl depth and limit controls
- **New**: External link and backward link crawling options
- **New**: Screenshot capture capabilities
- **New**: Comprehensive error handling with detailed error types

### Changed

- **Breaking Change**: Updated response schema to match current API
- **Breaking Change**: Renamed and restructured all types and interfaces
- **Breaking Change**: Changed scrape options structure
- **Breaking Change**: Changed to named exports only (import `{ LLMCrawl }` instead of default import)
- Updated package description
- Enhanced documentation with comprehensive examples
- Improved test coverage for all new functionality
- Fixed build warning by using named exports only

### Removed

- **Breaking Change**: Removed legacy schema definitions
- **Breaking Change**: Removed old response format with `returnCode`
- **Breaking Change**: Removed legacy content options

## [0.0.2] - Previous Version

### Added

- Initial release with basic scraping functionality
- Basic TypeScript support
- Simple response handling

---

## Migration Guide from 0.x to 1.0.0

### Import Changes

**Before (0.x):**

```typescript
import LLMCrawl from "@llmcrawl/llmcrawl-js";
```

**After (1.0.0):**

```typescript
import { LLMCrawl } from "@llmcrawl/llmcrawl-js";
```

### Response Format Changes

**Before (0.x):**

```typescript
const result = await client.scrape(url);
if (result.success) {
  console.log(result.data.markdown);
  console.log(result.returnCode); // 200
}
```

**After (1.0.0):**

```typescript
const result = await client.scrape(url);
if (result.success) {
  console.log(result.data.markdown);
  // returnCode is no longer available
  // Use result.success boolean instead
}
```

### Options Structure Changes

**Before (0.x):**

```typescript
await client.scrape(url, {
  formats: ["markdown"],
  options: {
    mainContentOnly: true,
    waitTime: 3000,
  },
});
```

**After (1.0.0):**

```typescript
await client.scrape(url, {
  formats: ["markdown"],
  waitFor: 3000,
  // mainContentOnly is no longer available
  // Use includeTags/excludeTags instead
});
```

### New Features Available

1. **Website Crawling:**

```typescript
const crawl = await client.crawl("https://example.com", {
  limit: 100,
  maxDepth: 3,
});
```

2. **AI-Powered Extraction:**

```typescript
const result = await client.scrape(url, {
  extract: {
    mode: "llm",
    schema: {
      /* your schema */
    },
    systemPrompt: "Extract product information",
  },
});
```

3. **Site Mapping:**

```typescript
const map = await client.map("https://example.com");
```
