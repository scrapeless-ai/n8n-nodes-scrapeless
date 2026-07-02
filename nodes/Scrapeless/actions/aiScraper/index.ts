import { IDataObject, INodeExecutionData } from "n8n-workflow";
import { getRequestConfig } from "../../common";
import { IHelpers, INodeContext } from "../../types";
import { AiScraperService, ScrapelessError } from "../../libs/request";

// Poll the task result every 15s until it succeeds or fails.
const POLL_INTERVAL_MS = 15_000;

interface AiScraperOperationConfig {
	actor: string;
	// Build the actor input from the node parameters.
	buildInput: (context: INodeContext) => IDataObject;
}

function getString(context: INodeContext, name: string): string {
	return context.functionThis.getNodeParameter(name, context.i) as string;
}

function getBoolean(context: INodeContext, name: string): boolean {
	return context.functionThis.getNodeParameter(name, context.i) as boolean;
}

const operationConfigs: Record<string, AiScraperOperationConfig> = {
	chatgpt: {
		actor: 'scraper.chatgpt',
		buildInput: (context) => ({
			prompt: getString(context, 'prompt'),
			country: getString(context, 'country'),
			web_search: getBoolean(context, 'web_search'),
			shopping: getBoolean(context, 'shopping'),
		}),
	},
	perplexity: {
		actor: 'scraper.perplexity',
		buildInput: (context) => ({
			prompt: getString(context, 'prompt'),
			country: getString(context, 'country'),
			web_search: getBoolean(context, 'web_search'),
		}),
	},
	copilot: {
		actor: 'scraper.copilot',
		buildInput: (context) => ({
			prompt: getString(context, 'prompt'),
			country: getString(context, 'country'),
			mode: getString(context, 'mode'),
		}),
	},
	gemini: {
		actor: 'scraper.gemini',
		buildInput: (context) => ({
			prompt: getString(context, 'prompt'),
			country: getString(context, 'country'),
		}),
	},
	googleAiMode: {
		actor: 'scraper.aimode',
		buildInput: (context) => buildGoogleAiInput(context),
	},
	googleAiOverview: {
		actor: 'scraper.overview',
		buildInput: (context) => buildGoogleAiInput(context),
	},
	grok: {
		actor: 'scraper.grok',
		buildInput: (context) => ({
			prompt: getString(context, 'prompt'),
			country: getString(context, 'country'),
			mode: getString(context, 'mode'),
		}),
	},
};

// Google AI Mode / Overview share the same input shape. location and uule are
// mutually exclusive and only sent when provided.
function buildGoogleAiInput(context: INodeContext): IDataObject {
	const input: IDataObject = {
		prompt: getString(context, 'prompt'),
		country: getString(context, 'country'),
		shopping: getBoolean(context, 'shopping'),
	};

	const location = getString(context, 'location');
	const uule = getString(context, 'uule');

	if (location) {
		input.location = location;
	}
	if (uule) {
		input.uule = uule;
	}

	return input;
}

export async function handleAiScraperOperation(helpers: IHelpers, operation: string, context: INodeContext): Promise<INodeExecutionData> {
	const config = operationConfigs[operation];

	if (!config) {
		throw new Error(`Unsupported operation: ${operation}`);
	}

	const { apiKey, baseUrl } = await getRequestConfig(context);

	const client = new AiScraperService({
		apiKey: apiKey,
		baseUrl: baseUrl,
		helpers: helpers,
	});

	const task = await client.createTask({
		actor: config.actor,
		input: config.buildInput(context),
	});

	// A failed creation short-circuits: no result will ever be available.
	if (task.status === 'failed') {
		throw new ScrapelessError((task.message as string) || 'Failed to create the AI Scraper task');
	}

	// Otherwise poll the result endpoint every 15s until it succeeds or fails.
	while (true) {
		await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

		const result = await client.getTaskResult(task.task_id);

		switch (result.status) {
			case 'success':
				return {
					json: result.task_result as unknown as IDataObject,
				};
			case 'failed':
				throw new ScrapelessError(result.message || 'AI Scraper task failed');
			// 'pending' / 'running' -> keep polling
		}
	}
}
