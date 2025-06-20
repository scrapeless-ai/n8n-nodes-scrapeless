import { IHelpers, INodeContext } from "../../types";
import { IDataObject, INodeExecutionData, NodeOperationError } from "n8n-workflow";
import { getRequestConfig } from "../../common";
import { ScrapingCrawl } from "../../libs/request";

export async function handleCrawlerOperation(helpers: IHelpers, operation: string, context: INodeContext): Promise<INodeExecutionData> {
	switch (operation) {
		case 'scrape':
			return await handleCrawlerScrape(helpers, context);
		case 'crawl':
			return await handleCrawlerCrawl(helpers, context);
		default:
			throw new Error(`Unsupported operation: ${operation}`);
	}
}

async function handleCrawlerScrape(helpers: IHelpers, context: INodeContext): Promise<INodeExecutionData> {
	const { apiKey, baseUrl } = await getRequestConfig(context);

	const url = context.functionThis.getNodeParameter('url', context.i) as string;

	const client = new ScrapingCrawl({
		apiKey: apiKey,
		baseUrl: baseUrl,
		helpers: helpers
	})

	const res = await client.scrapeUrl(url, {
		"browserOptions": {
			"proxy_country": "ANY",
			"session_name": "Crawl",
			"session_recording": true,
			"session_ttl": 900,
		}
	})

	if (res?.status === 'completed' && res?.data) {
		return {
			json: res.data as IDataObject
		}
	} else {
		const errorMsg = res?.error || 'Unknown error';
		return {
			error: new NodeOperationError(context.functionThis.getNode(), errorMsg),
			json: {}
		}
	}

}

async function handleCrawlerCrawl(helpers: IHelpers, context: INodeContext): Promise<INodeExecutionData> {
	const { apiKey, baseUrl } = await getRequestConfig(context);

	const url = context.functionThis.getNodeParameter('url', context.i) as string;
	const limit = context.functionThis.getNodeParameter('limitCrawlPages', context.i) as number;

	const client = new ScrapingCrawl({
		apiKey: apiKey,
		baseUrl: baseUrl,
		helpers: helpers
	})

	const res = await client.crawlUrl(url, {
		"limit": limit,
		"browserOptions": {
			"proxy_country": "ANY",
			"session_name": "Crawl",
			"session_recording": true,
			"session_ttl": 900,
		}
	})

	if (res?.status === 'completed' && res?.data) {
		return {
			json: res.data as unknown as IDataObject
		}
	} else {
		const errorMsg = res?.error || 'Unknown error';
		return {
			error: new NodeOperationError(context.functionThis.getNode(), errorMsg),
			json: {}
		}
	}
}
