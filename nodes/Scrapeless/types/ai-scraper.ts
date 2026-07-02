/**
 * Task status values returned by the LLM chat scraper (v2) endpoints.
 */
export type AiScraperTaskStatus = 'pending' | 'running' | 'success' | 'failed';

/**
 * Response returned when creating an LLM chat scraper task
 * (POST /api/v2/scraper/request).
 */
export interface AiScraperTaskResponse {
	/**
	 * Current task status. A `failed` status means the task could not be created.
	 */
	status: AiScraperTaskStatus;

	/**
	 * Identifier used to poll the task result.
	 */
	task_id: string;

	[key: string]: any;
}

/**
 * Response returned when polling an LLM chat scraper task result
 * (GET /api/v2/scraper/result/{task_id}).
 */
export interface AiScraperResultResponse {
	/**
	 * Current task status. `success` exposes `task_result`; `failed` exposes the
	 * error in `message`; `pending`/`running` mean the caller should retry.
	 */
	status: AiScraperTaskStatus;

	/**
	 * Error message, populated when `status` is `failed`.
	 */
	message: string;

	/**
	 * Scraped data, populated when `status` is `success`.
	 */
	task_result: Record<string, any>;

	[key: string]: any;
}
