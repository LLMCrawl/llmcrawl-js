import { z } from "zod";

// Extract options schema for AI-powered data extraction
export const extractOptionsSchema = z.object({
  mode: z.enum(["llm"]).default("llm"),
  schema: z
    .any()
    .optional()
    .describe(
      "The schema to use for the extraction (Optional). Must conform to JSON Schema"
    ),
  systemPrompt: z
    .string()
    .default(
      "Based on the information on the page, extract all the information from the schema. Try to extract all the fields even those that might not be marked as required."
    )
    .describe("The system prompt to use for the extraction"),
  prompt: z
    .string()
    .optional()
    .describe("The prompt to use for the extraction without a schema"),
});

export type ExtractOptions = z.infer<typeof extractOptionsSchema>;

// Scrape options schema
export const scrapeOptionsSchema = z.object({
  formats: z
    .enum([
      "markdown",
      "html",
      "links",
      "rawHtml",
      "screenshot",
      "screenshot@fullPage",
    ])
    .array()
    .optional()
    .default(["markdown", "html"])
    .describe("Formats to include in the output"),
  headers: z
    .record(z.string(), z.string())
    .optional()
    .describe(
      "Headers to send with the request. Can be used to send cookies, user-agent, etc."
    ),
  includeTags: z
    .string()
    .array()
    .optional()
    .describe("Tags to include in the output"),
  excludeTags: z
    .string()
    .array()
    .optional()
    .describe("Tags to exclude from the output"),
  timeout: z
    .number()
    .int()
    .min(1000)
    .max(90000)
    .default(30000)
    .describe("Timeout in milliseconds for the request"),
  waitFor: z
    .number()
    .int()
    .min(0)
    .max(60000)
    .default(0)
    .describe(
      "Specify a delay in milliseconds before fetching the content, allowing the page sufficient time to load"
    ),
  extract: extractOptionsSchema.optional(),
});

export type ScrapeOptions = z.infer<typeof scrapeOptionsSchema>;

// Document metadata schema
export const documentMetadataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  language: z.string().optional(),
  keywords: z.string().optional(),
  robots: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogUrl: z.string().optional(),
  ogImage: z.string().optional(),
  ogAudio: z.string().optional(),
  ogDeterminer: z.string().optional(),
  ogLocale: z.string().optional(),
  ogLocaleAlternate: z.array(z.string()).optional(),
  ogSiteName: z.string().optional(),
  ogVideo: z.string().optional(),
  dctermsCreated: z.string().optional(),
  dcDateCreated: z.string().optional(),
  dcDate: z.string().optional(),
  dctermsType: z.string().optional(),
  dcType: z.string().optional(),
  dctermsAudience: z.string().optional(),
  dctermsSubject: z.string().optional(),
  dcSubject: z.string().optional(),
  dcDescription: z.string().optional(),
  dctermsKeywords: z.string().optional(),
  modifiedTime: z.string().optional(),
  publishedTime: z.string().optional(),
  articleTag: z.string().optional(),
  articleSection: z.string().optional(),
  sourceURL: z.string().optional(),
  statusCode: z.number().optional(),
  error: z.string().optional(),
});

export type DocumentMetadata = z.infer<typeof documentMetadataSchema>;

// Document schema
export const documentSchema = z.object({
  markdown: z.string().optional().describe("Markdown content of the page"),
  extract: z
    .string()
    .optional()
    .describe("Extracted data from the page following the schema defined"),
  html: z
    .string()
    .optional()
    .describe("HTML version of the content on page if html is in formats"),
  rawHtml: z
    .string()
    .optional()
    .describe("Raw HTML content of the page if rawHtml is in formats"),
  links: z
    .array(z.string())
    .optional()
    .describe("List of links on the page if links is in formats"),
  screenshot: z
    .string()
    .optional()
    .describe("Screenshot of the page if screenshot is in formats"),
  metadata: documentMetadataSchema
    .default({})
    .describe(
      "Metadata about the page including title, description, status code, etc."
    ),
});

export type Document = z.infer<typeof documentSchema>;

// Scrape request schema
export const scrapeRequestSchema = scrapeOptionsSchema.extend({
  url: z.string().url().describe("Target URL to scrape"),
  origin: z.string().optional().default("api"),
  webhookUrls: z
    .array(z.string().url())
    .optional()
    .describe("Webhook URLs to send the response to"),
  metadata: z
    .any()
    .optional()
    .describe("Additional metadata to include with the request"),
});

export type ScrapeRequest = z.infer<typeof scrapeRequestSchema>;

// Scrape response schemas
export const scrapeSuccessResponseSchema = z.object({
  success: z.literal(true),
  warning: z
    .string()
    .optional()
    .describe(
      "Warning message that may let you know about any issues with the extraction"
    ),
  data: documentSchema,
  scrape_id: z
    .string()
    .optional()
    .describe("Unique identifier for the scrape operation"),
});

export const scrapeErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string().describe("Error message describing what went wrong"),
  details: z.any().optional().describe("Additional error details"),
});

export const scrapeResponseSchema = z.discriminatedUnion("success", [
  scrapeSuccessResponseSchema,
  scrapeErrorResponseSchema,
]);

export type ScrapeResponse = z.infer<typeof scrapeResponseSchema>;

// Crawler options schema
export const crawlerOptionsSchema = z.object({
  includePaths: z
    .array(z.string())
    .default([])
    .describe(
      "Paths to include in the crawl. Only URLs matching these paths will be crawled"
    ),
  excludePaths: z
    .array(z.string())
    .default([])
    .describe(
      "Paths to exclude from the crawl. URLs matching these paths will be skipped"
    ),
  maxDepth: z
    .number()
    .default(10)
    .describe("Maximum depth to crawl relative to the entered URL"),
  limit: z.number().default(10000).describe("Maximum number of pages to crawl"),
  allowBackwardLinks: z
    .boolean()
    .default(false)
    .describe(
      "Allow crawling pages that link back to a previously crawled page"
    ),
  allowExternalLinks: z
    .boolean()
    .default(false)
    .describe("Allow crawling external domains"),
  ignoreSitemap: z
    .boolean()
    .default(true)
    .describe("Ignore the robots.txt and sitemap.xml files"),
});

export type CrawlerOptions = z.infer<typeof crawlerOptionsSchema>;

// Crawl request schema
export const crawlRequestSchema = crawlerOptionsSchema.extend({
  url: z.string().url().describe("Target URL to crawl"),
  origin: z.string().optional().default("api"),
  scrapeOptions: scrapeOptionsSchema
    .omit({ timeout: true })
    .default({})
    .describe("Options for scraping each page during the crawl"),
  webhookUrls: z
    .array(z.string().url())
    .optional()
    .describe("Webhook URLs to send the response to"),
  webhookMetadata: z
    .any()
    .optional()
    .describe("Additional metadata to include with webhook calls"),
  limit: z.number().default(10000).describe("Maximum number of pages to crawl"),
});

export type CrawlRequest = z.infer<typeof crawlRequestSchema>;

// Crawl response schemas
export const crawlSuccessResponseSchema = z.object({
  success: z.literal(true),
  id: z.string().describe("Unique identifier for the crawl job"),
  url: z.string().describe("The URL that is being crawled"),
});

export const crawlErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string().describe("Error message describing what went wrong"),
  details: z.any().optional().describe("Additional error details"),
});

export const crawlResponseSchema = z.discriminatedUnion("success", [
  crawlSuccessResponseSchema,
  crawlErrorResponseSchema,
]);

export type CrawlResponse = z.infer<typeof crawlResponseSchema>;

// Crawl status response schema
export const crawlStatusSuccessResponseSchema = z.object({
  success: z.literal(true),
  status: z
    .enum(["scraping", "completed", "failed", "cancelled"])
    .describe("The current status of the crawl"),
  completed: z
    .number()
    .describe("The number of pages that have been successfully crawled"),
  total: z
    .number()
    .describe("The total number of pages that were attempted to be crawled"),
  expiresAt: z
    .string()
    .describe("The date and time when the crawl will expire"),
  next: z
    .string()
    .optional()
    .describe(
      "The URL to retrieve the next 10MB of data. Returned if the crawl is not completed or if the response is larger than 10MB"
    ),
  data: z.array(documentSchema).describe("The data of the crawl"),
});

export const crawlStatusErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string().describe("Error message describing what went wrong"),
  details: z.any().optional().describe("Additional error details"),
});

export const crawlStatusResponseSchema = z.discriminatedUnion("success", [
  crawlStatusSuccessResponseSchema,
  crawlStatusErrorResponseSchema,
]);

export type CrawlStatusResponse = z.infer<typeof crawlStatusResponseSchema>;

// Crawl cancel response schema
export const crawlCancelSuccessResponseSchema = z.object({
  success: z.literal(true),
  message: z
    .string()
    .optional()
    .describe("Success message confirming the crawl cancellation"),
});

export const crawlCancelErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string().describe("Error message describing what went wrong"),
  details: z.any().optional().describe("Additional error details"),
});

export const crawlCancelResponseSchema = z.discriminatedUnion("success", [
  crawlCancelSuccessResponseSchema,
  crawlCancelErrorResponseSchema,
]);

export type CrawlCancelResponse = z.infer<typeof crawlCancelResponseSchema>;

// Map request schema
export const mapRequestSchema = crawlerOptionsSchema.extend({
  url: z.string().url().describe("Target URL to map"),
  origin: z.string().optional().default("api"),
  includeSubdomains: z
    .boolean()
    .default(true)
    .describe("Include subdomains of the website"),
  search: z
    .string()
    .optional()
    .describe("Search query to filter the map results"),
  ignoreSitemap: z
    .boolean()
    .default(true)
    .describe("Ignore the robots.txt and sitemap.xml files"),
  limit: z
    .number()
    .min(1)
    .max(5000)
    .default(5000)
    .optional()
    .describe("Maximum number of links to return"),
});

export type MapRequest = z.infer<typeof mapRequestSchema>;

// Map response schemas
export const mapSuccessResponseSchema = z.object({
  success: z.literal(true),
  links: z.array(z.string()).describe("List of links found on the website"),
  scrape_id: z
    .string()
    .optional()
    .describe("Unique identifier for the map operation"),
});

export const mapErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string().describe("Error message describing what went wrong"),
  details: z.any().optional().describe("Additional error details"),
});

export const mapResponseSchema = z.discriminatedUnion("success", [
  mapSuccessResponseSchema,
  mapErrorResponseSchema,
]);

export type MapResponse = z.infer<typeof mapResponseSchema>;
