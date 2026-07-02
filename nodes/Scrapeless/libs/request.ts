import { IHelpers, RequestResponse } from "../types";
import { ResponseWithStatus } from "../types/base";
import { ScrapingTaskRequest, ScrapingTaskResponse } from "../types/scraping";
import { AiScraperResultResponse, AiScraperTaskResponse } from "../types/ai-scraper";
import { CrawlParams, CrawlStatusResponse, ScrapeParams, ScrapeStatusResponse } from "../types/scraping-crawl";
import { UniversalScrapingRequest } from "../types/universal";

export class ScrapelessError extends Error {
	constructor(
		message: string,
		public statusCode?: number
	) {
		// check if message has prefix [Scrapeless]:
		const hasPrefix = message.startsWith('[Scrapeless]: ');
		const msg = hasPrefix ? message : `[Scrapeless]: ${message}`;
		super(msg);
		this.name = 'ScrapelessError';
	}
}

export abstract class BaseService {
	helpers: IHelpers | null = null;
	protected constructor(
		protected readonly apiKey: string,
		protected readonly baseUrl: string,
		protected readonly timeout: number = 30_000,
		helpers: IHelpers | null = null,
		protected readonly handleResponse?: (res: any) => any,
	) {
		this.helpers = helpers;
	}

	protected async request<T, R extends boolean = false>(
		endpoint: string,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
		body?: Record<string, any>,
		additionalHeaders: Record<string, string> = {},
		responseWithStatus: R = false as R,
	): Promise<RequestResponse<T, R>> {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			'X-API-Key': this.apiKey,
			...additionalHeaders
		};

		const options: any = {
			method,
			headers,
			timeout: this.timeout
		};

		if (body) {
			options.body = JSON.stringify(body);
			// log.debug("Request body:", options.body);
		}

		if (!this.helpers) {
			throw new Error('Helpers are not available');
		}
		let response: any;
		let data: any;

		try {
			const res = await this.helpers.httpRequest({
				url: `${this.baseUrl}${endpoint}`,
				method,
				body: options.body,
				headers: options.headers,
				timeout: options.timeout,
				returnFullResponse: true
			})

			response = {
				...res,
				ok: true,
				status: res.status || res.statusCode
			}
			data = response.body;
		} catch (error) {

			data = error?.data || error?.response?.data;

			response = {
				...error,
				ok: false,
				status: error.status || error.statusCode
			}
		}

		if (!response.ok) {
			let errorMessage = '';
			let errorCode = response.status;


			if (typeof data === 'object') {
				if (data.error) {
					errorMessage = data.error;
				}
				if (data.msg) {
					errorMessage = data.msg;
				}
				if (data.code) {
					errorCode = data.code;
				}
				if (data.traceId) {
					// If error message exists, add traceId info, otherwise create default error message
					if (errorMessage) {
						errorMessage += ` (TraceID: ${data.traceId})`;
					} else {
						errorMessage = `failed with status ${response.status} (TraceID: ${data.traceId})`;
					}
				}
				if (data?.details) {
					// if details is an array, use the first item's message
					const _msgs = data?.details?.map((item: { message: string }) => item?.message) || []
					errorMessage = _msgs?.[0] || ''
				}
			}
			// If no error message has been set, use the default message
			if (!errorMessage) {
				errorMessage = `failed with status ${response.status}`;
			}
			errorMessage = `Request ${method} ${this.baseUrl}${endpoint} failed with reason: ${errorMessage}`;
			// console.error(errorMessage);
			throw new ScrapelessError(errorMessage, errorCode);
		}

		if (this.handleResponse) {
			return this.handleResponse(data) as RequestResponse<T, R>;
		}


		return responseWithStatus
			? ({ data: data as T, status: response.status } as RequestResponse<T, R>)
			: (data as RequestResponse<T, R>);
	}
}

export class ScrapingCrawl extends BaseService {
	constructor({ apiKey, baseUrl, helpers }: { apiKey: string, baseUrl: string, helpers: IHelpers }) {
		super(apiKey, baseUrl, 30_000, helpers);
	}


	/**
	* Monitor the status of a job with polling.
	* @param id Job ID
	* @param pollInterval Polling interval in milliseconds
	* @returns Job info
	*/
	async monitorJobStatus(id: string, pollInterval: number): Promise<CrawlStatusResponse> {
		try {
			while (true) {
				let statusResponse = await this.request<any>(`/api/v1/crawler/crawl/${id}`, 'GET');
				if (statusResponse.status === 'completed') {
					if ('data' in statusResponse) {
						let data = statusResponse.data;
						while (typeof statusResponse === 'object' && 'next' in statusResponse) {
							if (data.length === 0) break;
							statusResponse = await this.request<any>(statusResponse.next, 'GET');
							data = data.concat(statusResponse.data);
						}
						statusResponse.data = data;
						return statusResponse;
					} else {
						throw new ScrapelessError('Crawl job completed but no data was returned', 500);
					}
				} else if (['active', 'paused', 'pending', 'queued', 'waiting', 'scraping'].includes(statusResponse.status)) {
					pollInterval = Math.max(pollInterval, 2);
					await new Promise(resolve => setTimeout(resolve, pollInterval * 1000));
				} else {
					throw new ScrapelessError(`Crawl job failed or was stopped. Status: ${statusResponse.status}`, 500);
				}
			}
		} catch (error: any) {
			throw new ScrapelessError(error.message, error.statusCode || 500);
		}
	}

	/**
	 * Crawl a single URL and follow links according to crawl parameters.
	 * @param url Target URL to crawl
	 * @param params Optional crawl parameters
	 * @param pollInterval Optional polling interval for job status (s)
	 * @returns Crawl result
	 */
	async crawlUrl(url: string, params?: CrawlParams, pollInterval: number = 2): Promise<CrawlStatusResponse> {
		const jsonData: any = { url, ...params };
		try {
			const response = await this.request<any>('/api/v1/crawler/crawl', 'POST', jsonData);

			if (response.id) {
				return this.monitorJobStatus(response.id, pollInterval);
			} else {
				throw new ScrapelessError('Failed to start a crawl job', 400);
			}
		} catch (error: any) {
			throw new ScrapelessError(error.message, error.statusCode || 500);
		}
	}


	/**
	 * Scrape a single URL
	 * @param url Target URL to scrape
	 * @param params Optional scraping parameters
	 * * @param pollInterval Optional polling interval for job status (s)
	 * @returns Scraped data result
	 */
	async scrapeUrl(
		url: string,
		params?: ScrapeParams,
		pollInterval: number = 2
	): Promise<any> {
		const jsonData: any = { url, ...params };

		try {
			const response = await this.request<any>('/api/v1/crawler/scrape', 'POST', jsonData, {});

			if (!response.id) {
				throw new ScrapelessError('Failed to start a scrape job', 400);
			}

			while (true) {
				const statusResponse = (await this.checkScrapeStatus(response.id)) as ScrapeStatusResponse<any>;
				if (statusResponse.status !== 'scraping') {
					return statusResponse;
				}

				pollInterval = Math.max(pollInterval, 2);
				await new Promise(resolve => setTimeout(resolve, pollInterval * 1000));
			}
		} catch (error: any) {
			throw new ScrapelessError(error.message, error.statusCode || 500);
		}
	}

	/**
 * Check the status of a crawl job.
 * @param id Job ID
 * @returns Scraped data result
 */
	async checkScrapeStatus(id: string): Promise<ScrapeStatusResponse<any>> {
		if (!id) {
			throw new ScrapelessError('No scrape ID provided', 400);
		}
		const url = `/api/v1/crawler/scrape/${id}`;
		try {
			const response = await this.request<any>(url, 'GET');
			return response;
		} catch (error: any) {
			throw new ScrapelessError(error.message, error.statusCode || 500);
		}
	}
}

export class ScrapingService extends BaseService {
	private basePath = '/api/v1/scraper';

	constructor({ apiKey, baseUrl, helpers }: { apiKey: string, baseUrl: string, helpers: IHelpers }) {
		super(apiKey, baseUrl, 30_000, helpers);
	}

	/**
	 * Create a scraping request to extract data from websites
	 * @param request Scraping request parameters including actor, input, and proxy settings
	 * @returns Task ID and status information for the scraping task
	 */
	async createTask(request: ScrapingTaskRequest): Promise<ResponseWithStatus<ScrapingTaskResponse>> {
		const requestWithSync = {
			...request,
			async: true
		};

		return await this.request<ScrapingTaskResponse, true>(
			`${this.basePath}/request`,
			'POST',
			requestWithSync,
			{},
			true
		);
	}

	/**
	* Get the result of a scraping task
	* @param taskId The ID of the scraping task
	* @returns The scraped data and task status
	*/
	async getTaskResult<T>(taskId: string): Promise<ResponseWithStatus<T>> {
		return this.request<T, true>(`${this.basePath}/result/${taskId}`, 'GET', undefined, {}, true);
	}
}

export class AiScraperService extends BaseService {
	private basePath = '/api/v2/scraper';

	constructor({ apiKey, baseUrl, helpers }: { apiKey: string, baseUrl: string, helpers: IHelpers }) {
		super(apiKey, baseUrl, 30_000, helpers);
	}

	/**
	 * Create an LLM chat scraping task (e.g. ChatGPT, Perplexity, Gemini)
	 * @param request Scraping request parameters including actor and input
	 * @returns Task status and task_id used to poll the result
	 */
	async createTask(request: ScrapingTaskRequest): Promise<AiScraperTaskResponse> {
		const requestWithSync = {
			...request,
			async: true
		};

		return await this.request<AiScraperTaskResponse>(
			`${this.basePath}/request`,
			'POST',
			requestWithSync
		);
	}

	/**
	 * Get the result of an LLM chat scraping task
	 * @param taskId The ID of the scraping task
	 * @returns The task status, message (on failure), and task_result (on success)
	 */
	async getTaskResult(taskId: string): Promise<AiScraperResultResponse> {
		return this.request<AiScraperResultResponse>(`${this.basePath}/result/${taskId}`, 'GET');
	}
}

export class UniversalService extends BaseService {
	private basePath = '/api/v1/unlocker';
	constructor({ apiKey, baseUrl, helpers }: { apiKey: string, baseUrl: string, helpers: IHelpers }) {
		super(apiKey, baseUrl, 30_000, helpers);
	}
	/**
	 * Scrape any website using the Universal Scraping API
	 * @param request Scraping request
	 */
	async scrape<T, R = any>(request: UniversalScrapingRequest<T, R>): Promise<any> {
		return this.request<any>(`${this.basePath}/request`, 'POST', request);
	}
}
