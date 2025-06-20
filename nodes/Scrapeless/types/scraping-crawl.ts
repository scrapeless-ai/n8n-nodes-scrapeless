/**
 * Browser session creation options
 */
export interface ICreateBrowser {
	session_name?: string;
	session_ttl?: number;
	session_recording?: boolean;
	proxy_country?: string;
	proxy_url?: string;
	fingerprint?: object;
}

/**
 * Configuration interface for ScrapingCrawl.
 * @param apiKey - Optional API key for authentication.
 * @param baseUrl - Optional base URL of the API;
 */
export interface ScrapingCrawlConfig {
	apiKey?: string;
	baseUrl?: string;
	timeout?: number;
}

/**
 * Metadata for a ScrapingCrawl document.
 * Includes various optional properties for document metadata.
 */
export interface ScrapingCrawlDocumentMetadata {
	title?: string;
	description?: string;
	language?: string;
	keywords?: string;
	robots?: string;
	ogTitle?: string;
	ogDescription?: string;
	ogUrl?: string;
	ogImage?: string;
	ogAudio?: string;
	ogDeterminer?: string;
	ogLocale?: string;
	ogLocaleAlternate?: string[];
	ogSiteName?: string;
	ogVideo?: string;
	dctermsCreated?: string;
	dcDateCreated?: string;
	dcDate?: string;
	dctermsType?: string;
	dcType?: string;
	dctermsAudience?: string;
	dctermsSubject?: string;
	dcSubject?: string;
	dcDescription?: string;
	dctermsKeywords?: string;
	modifiedTime?: string;
	publishedTime?: string;
	articleTag?: string;
	articleSection?: string;
	sourceURL?: string;
	statusCode?: number;
	error?: string;
	[key: string]: any; // Allows for additional metadata properties not explicitly defined.
}

/**
 * Document interface for ScrapingCrawl.
 * Represents a document retrieved or processed by ScrapingCrawl.
 */
export interface ScrapingCrawlDocument<T = any> {
	markdown?: string;
	html?: string;
	rawHtml?: string;
	links?: string[];
	extract?: T;
	screenshot?: string;
	metadata?: ScrapingCrawlDocumentMetadata;
}

/**
 * Parameters for scraping operations.
 * Defines the options and configurations available for scraping web content.
 */
export interface CrawlScrapeOptions {
	formats?: ('markdown' | 'html' | 'rawHtml' | 'content' | 'links' | 'screenshot' | 'screenshot@fullPage')[];
	headers?: Record<string, string>;
	includeTags?: string[];
	excludeTags?: string[];
	onlyMainContent?: boolean;
	waitFor?: number;
	timeout?: number;
}

export interface ScrapeParams extends CrawlScrapeOptions {
	browserOptions?: ICreateBrowser;
}

/**
 * Response interface for scraping operations.
 * Defines the structure of the response received after a scraping operation.
 */
export interface ScrapeStatusResponse<LLMResult = any> {
	success: true;
	error?: string;
	status: 'scraping' | 'completed' | 'failed' | 'cancelled';
	data: ScrapingCrawlDocument<LLMResult>;
}

/**
 * Parameters for crawling operations.
 * Includes options for both scraping and mapping during a crawl.
 */
export interface CrawlParams {
	includePaths?: string[];
	excludePaths?: string[];
	maxDepth?: number;
	maxDiscoveryDepth?: number;
	limit?: number;
	allowBackwardLinks?: boolean;
	allowExternalLinks?: boolean;
	ignoreSitemap?: boolean;
	scrapeOptions?: CrawlScrapeOptions;
	deduplicateSimilarURLs?: boolean;
	ignoreQueryParameters?: boolean;
	regexOnFullURL?: boolean;
	/**
	 * Delay in seconds between scrapes. This helps respect website rate limits.
	 * If not provided, the crawler may use the robots.txt crawl delay if available.
	 */
	delay?: number;
	browserOptions?: ICreateBrowser;
}

/**
 * Response interface for scrape operations.
 * Defines the structure of the response received after initiating a scrape.
 */
export interface ScrapeResponse {
	id?: string;
	success: true;
	error?: string;
}

/**
 * Response interface for batch scrape operations.
 * Defines the structure of the response received after initiating a batch scrape.
 */
export interface BatchScrapeResponse {
	id?: string;
	success: true;
	error?: string;
	invalidURLs?: string[];
}

/**
 * Response interface for crawling operations.
 * Defines the structure of the response received after initiating a crawl.
 */
export interface CrawlResponse {
	id?: string;
	success: true;
	error?: string;
}

/**
 * Response interface for job status checks.
 * Provides detailed status of a crawl job including progress and results.
 */
export interface CrawlStatusResponse {
	success: boolean;
	status: 'scraping' | 'completed' | 'failed' | 'cancelled';
	completed: number;
	total: number;
	data: ScrapingCrawlDocument<undefined>[];
	error?: string;
}

/**
 * Response interface for batch scrape job status checks.
 * Provides detailed status of a batch scrape job including progress and results.
 */
export interface BatchScrapeStatusResponse {
	success: true;
	status: 'scraping' | 'completed' | 'failed' | 'cancelled';
	completed: number;
	total: number;
	data: ScrapingCrawlDocument<undefined>[];
	error?: string;
}

/**
 * Error response interface.
 * Defines the structure of the response received when an error occurs.
 */
export interface ErrorResponse {
	success: false;
	error: string;
}

/**
 * Response interface for crawl/batch scrape error monitoring.
 */
export interface CrawlErrorsResponse {
	/**
	 * Scrapes that errored out + error details
	 */
	errors: {
		id: string;
		timestamp?: string;
		error: string;
	}[];
	/**
	 * URLs blocked by robots.txt
	 */
	robotsBlocked: string[];
}

export interface CrawlScrapeParams extends CrawlScrapeOptions {
	browserOptions?: ICreateBrowser;
}
