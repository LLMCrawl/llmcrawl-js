import { z } from "zod";

export const documentMetadataSchema = z.record(z.any()).and(
  z.object({
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
    sourceUrl: z.string().optional(),
    pageStatusCode: z.number().optional(),
    pageError: z.string().optional(),
  })
);

export const documentSchema = z.object({
  url: z.string().optional().describe("URL of the document"),
  text: z
    .string()
    .optional()
    .describe("A Readable text content of the document"),
  markdown: z.string().optional().describe("Markdown content of the document"),
  html: z
    .string()
    .optional()
    .describe("HTML content of the document if `includeHtmlContent` is `true`"),
  rawHtml: z
    .string()
    .optional()
    .describe(
      "Raw HTML content of the document if `includeRawHtmlContent` is `true`"
    ),
  screenshot: z
    .string()
    .optional()
    .describe("Screenshot of the document if `screenshot` is in `formats`"),
  fullPageScreenshot: z
    .string()
    .optional()
    .describe(
      "Full page screenshot of the document if `fullPageScreenshot` is in `formats`"
    ),
  summary: z.string().optional().describe("Summary of the document"),
  extract: z.record(z.any()).optional().describe("Schema extracted data"),
  numTokens: z.number().optional().describe("Number of tokens in the content"),
  contentTrimmed: z
    .boolean()
    .optional()
    .describe("Whether the content is trimmed"),

  metadata: documentMetadataSchema.describe("Metadata of the document"),

  childrenLinks: z.array(z.string()).optional().describe("Links on the page"),
  provider: z.string().optional().describe("The provider of the document"),
  warning: z.string().optional().describe("Warning message if any"),
  index: z.number().optional().describe("Index of the document in the list"),
});

export type IDocument = z.infer<typeof documentSchema>;

export const documentCrawlSchema = documentSchema.extend({
  index: z.number().describe("Index of the document in the list"),
});

export const scrapeSuccessResponseSchema = z.object({
  success: z.literal(true),
  data: documentSchema.describe("The scraped document"),
  returnCode: z.number().default(200),
});

export const scrapeErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  returnCode: z.number(),
});

const scrapeResponseSchema = z.discriminatedUnion("success", [
  scrapeSuccessResponseSchema,
  scrapeErrorResponseSchema,
]);

export type ScrapeResponse = z.infer<typeof scrapeResponseSchema>;

export const externalResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  returnCode: z.number(),
});

export const summarizerOptionsSchema = z.object({
  mode: z.enum(["from-markdown", "from-raw-html"]).optional(),
  prompt: z.string().optional(),
});

export type SummarizerOptions = z.infer<typeof summarizerOptionsSchema>;

export const contentOptionsSchema = z
  .object({
    mainContentOnly: z
      .boolean()
      .optional()
      .default(false)
      .describe(
        "If `true`, only the main content of the page will be returned, excluding headers, navigation, footers, etc."
      ),
    waitTime: z
      .number()
      .int()
      .optional()
      .default(0)
      .describe(
        "The number of milliseconds to wait before capturing the page content. Useful for pages that load content dynamically."
      ),
    elementsToRemove: z
      .array(z.string())
      .optional()
      .default([])
      .describe(
        "A list of CSS selectors to remove from the page content before returning it."
      ),
    elementsToInclude: z
      .array(z.string())
      .optional()
      .default([])
      .describe(
        "A list of CSS selectors to include in the page content before returning it."
      ),
    customHeaders: z
      .record(z.string())
      .optional()
      .describe(
        "A list of custom headers to include in the request to the target URL, e.g. `{ 'User-Agent': 'Mozilla/5.0' }`."
      ),
    convertPathsToAbsolute: z
      .boolean()
      .optional()
      .default(false)
      .describe(
        "If `true`, all relative paths with absolute paths for images, links, etc. in the HTML content."
      ),
    processPDFs: z
      .boolean()
      .optional()
      .default(true)
      .describe(
        "If `true`, parses the content of PDF files found on the page and returns the text content within the `content` key."
      ),
  })
  .describe("Configuration for the scraping process");

export type ContentOptions = z.infer<typeof contentOptionsSchema>;

export const formats = z.enum([
  "text",
  "html",
  "rawHtml",
  "markdown",
  "text",
  "links",
  "screenshot",
  "full-page-screenshot",
  "extract",
  "summary",
]);

export type Format = z.infer<typeof formats>;

export const jsonSchema = z
  .object({
    type: z.string().optional(),
    properties: z
      .record(
        z.object({
          type: z.string().optional(),
          properties: z
            .record(z.object({ type: z.string().optional() }))
            .optional(),
        })
      )
      .optional(),
  })
  .describe("The JSON schema to use for extraction");

export type AIJsonSchema = z.infer<typeof jsonSchema>;

export const extractionOptionsSchema = z.object({
  mode: z
    .enum(["from-markdown", "from-raw-html"])
    .optional()
    .default("from-markdown"),
  prompt: z
    .string()
    .default(
      "Extract the relevant data from the webpage using the provided JSON schema."
    )
    .describe("The prompt to extract data for"),
  schema: jsonSchema.optional(),
});

export type ExtractionOptions = z.infer<typeof extractionOptionsSchema>;

export const scrapeRequestSchema = z.object({
  url: z.string().url().describe("Target URL to scrape"),
  requestTimeout: z
    .number()
    .int()
    .optional()
    .default(30_000)
    .describe(
      "The maximum time in milliseconds to wait for the request to complete."
    ),
  formats: z
    .array(formats)
    .min(1, { message: "At least one format must be specified." })
    .optional()
    .default(["markdown"])
    .describe(
      "The formats to return the content in. Possible values are `html`, `rawHtml`, `markdown`, `text`, `links`, `screenshot`, `full-page-screenshot`, `extract`, and `summary`. Note that `extract`, and `summary` consume more credits."
    ),
  options: contentOptionsSchema.optional(),
  summarizer: summarizerOptionsSchema.optional(),
  extraction: extractionOptionsSchema.optional(),
  origin: z.string().optional(),
});

export type ScrapeRequest = z.infer<typeof scrapeRequestSchema>;
