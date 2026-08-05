import { IDataObject, INodeExecutionData, sleep } from "n8n-workflow";
import { getRequestConfig } from "../../common";
import { IHelpers, INodeContext } from "../../types";
import { ScrapingService } from "../../libs/request";


export async function handleScrapingApiOperation(helpers: IHelpers, operation: string, context: INodeContext): Promise<INodeExecutionData> {
	switch (operation) {
		case 'googleSearch':
			return await handleScrapingApiGoogleSearch(helpers, context);
		case 'googleTrends':
			return await handleScrapingApiGoogleTrends(helpers, context);
		default:
			throw new Error(`Unsupported operation: ${operation}`);
	}
}

async function handleScrapingApiGoogleSearch(helpers: IHelpers, context: INodeContext): Promise<INodeExecutionData> {
	const { apiKey, baseUrl } = await getRequestConfig(context);

	const q = context.functionThis.getNodeParameter('q', context.i) as string;
	const hl = context.functionThis.getNodeParameter('hl', context.i) as string;
	const gl = context.functionThis.getNodeParameter('gl', context.i) as string;
	const google_domain = context.functionThis.getNodeParameter('google_domain', context.i) as string;
	const location = context.functionThis.getNodeParameter('location', context.i) as string;
	const start = context.functionThis.getNodeParameter('start', context.i) as number;
	const num = context.functionThis.getNodeParameter('num', context.i) as number;
	const ludocid = context.functionThis.getNodeParameter('ludocid', context.i) as string;
	const kgmid = context.functionThis.getNodeParameter('kgmid', context.i) as string;
	const ibp = context.functionThis.getNodeParameter('ibp', context.i) as string;
	const cr = context.functionThis.getNodeParameter('cr', context.i) as string;
	const lr = context.functionThis.getNodeParameter('lr', context.i) as string;
	const tbs = context.functionThis.getNodeParameter('tbs', context.i) as string;
	const safe = context.functionThis.getNodeParameter('safe', context.i) as string;
	const nfpr = context.functionThis.getNodeParameter('nfpr', context.i) as string;
	const filter = context.functionThis.getNodeParameter('filter', context.i) as string;
	const tbm = context.functionThis.getNodeParameter('tbm', context.i) as string;

	const input = {
		q: q,
		hl: hl,
		gl: gl,
		google_domain: google_domain,
		location: location,
		start: start,
		num: num,
		ludocid: ludocid,
		kgmid: kgmid,
		ibp: ibp,
		cr: cr,
		lr: lr,
		tbs: tbs,
		safe: safe,
		nfpr: nfpr,
		filter: filter,
		tbm: tbm,
	}

	const client = new ScrapingService({
		apiKey: apiKey,
		baseUrl: baseUrl,
		helpers: helpers
	})

	const task = await client.createTask({
		actor: 'scraper.google.search',
		input: input,
	});

	if (task.status === 200) {
		return {
			json: task.data as unknown as IDataObject
		}
	}

	while (true) {
		await sleep(1000);
		const result = await client.getTaskResult(task.data.taskId);

		if (result.status === 200) {
			return {
				json: result.data as unknown as IDataObject
			}
		}
	}
}


async function handleScrapingApiGoogleTrends(helpers: IHelpers, context: INodeContext): Promise<INodeExecutionData> {
	const { apiKey, baseUrl } = await getRequestConfig(context);

	const q = context.functionThis.getNodeParameter('q', context.i) as string;
	const data_type = context.functionThis.getNodeParameter('data_type', context.i) as string;
	const date = context.functionThis.getNodeParameter('date', context.i) as string;
	const hl = context.functionThis.getNodeParameter('hl', context.i) as string;
	const tz = context.functionThis.getNodeParameter('tz', context.i) as string;
	const geo = context.functionThis.getNodeParameter('geo', context.i) as string;
	const cat = context.functionThis.getNodeParameter('cat', context.i) as string;
	const property = context.functionThis.getNodeParameter('property', context.i) as string;


	const input = {
		q: q,
		data_type: data_type,
		date: date,
		hl: hl,
		tz: tz,
		geo: geo,
		cat: cat,
		property: property,
	}

	const client = new ScrapingService({
		apiKey: apiKey,
		baseUrl: baseUrl,
		helpers: helpers
	})

	const task = await client.createTask({
		actor: 'scraper.google.trends',
		input: input,
	})

	if (task.status === 200) {
		return {
			json: task.data as unknown as IDataObject
		}
	}

	while (true) {
		await sleep(1000);
		const result = await client.getTaskResult(task.data.taskId);

		if (result.status === 200) {
			return {
				json: result.data as unknown as IDataObject
			}
		}
	}
}
