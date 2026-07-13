/* eslint-disable n8n-nodes-base/node-param-operation-option-action-miscased */
import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import {
	aiScraperFields,
	crawlerFields,
	scrapingApiFields,
	universalScrapingApiFields,
} from './descriptions';
import { INodeContext } from './types';
import { handleAiScraperOperation, handleCrawlerOperation, handleScrapingApiOperation, handleUniversalScrapingApiOperation } from './actions';

const inputs = [NodeConnectionTypes.Main];
const outputs = [NodeConnectionTypes.Main];

export class Scrapeless implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Scrapeless Official',
		description: 'Official Scrapeless nodes for n8n',
		group: ['transform'],
		version: [1],
		defaultVersion: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		defaults: {
			name: 'Scrapeless',
		},
		icon: 'file:scrapeless.svg',
		usableAsTool: true,
		inputs,
		outputs,
		credentials: [
			{
				name: 'scrapelessApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Deep SerpApi',
						value: 'scrapingApi',
					},
					{
						name: 'Universal Scraping API',
						value: 'universalScrapingApi',
					},
					{
						name: 'Crawler',
						value: 'crawler',
					},
					{
						name: 'AI Scraper',
						value: 'aiScraper',
					}
				],
				noDataExpression: true,
				default: 'scrapingApi',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				default: 'scrape',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['crawler'],
					}
				},
				options: [
					{
						name: 'Scrape',
						value: 'scrape',
						action: 'Scrape',
					},
					{
						name: 'Crawl',
						value: 'crawl',
						action: 'Crawl',
					},
				]
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				default: 'webUnlocker',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['universalScrapingApi'],
					}
				},
				options: [
					{
						name: 'Web Unlocker',
						value: 'webUnlocker',
						action: 'Web Unlocker',
					},
				]
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				default: 'googleSearch',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['scrapingApi'],
					}
				},
				options: [
					{
						name: 'Google Search',
						value: 'googleSearch',
						action: 'Google Search',
					},
					{
						name: 'Google Trends',
						value: 'googleTrends',
						action: 'Google Trends',
					},
				]
			},

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				default: 'chatgpt',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['aiScraper'],
					}
				},
				options: [
					{
						name: 'ChatGPT',
						value: 'chatgpt',
						action: 'ChatGPT',
					},
					{
						name: 'Copilot',
						value: 'copilot',
						action: 'Copilot',
					},
					{
						name: 'Gemini',
						value: 'gemini',
						action: 'Gemini',
					},
					{
						name: 'Google AI Mode',
						value: 'googleAiMode',
						action: 'Google AI Mode',
					},
					{
						name: 'Google AI Overview',
						value: 'googleAiOverview',
						action: 'Google AI Overview',
					},
					{
						name: 'Grok',
						value: 'grok',
						action: 'Grok',
					},
					{
						name: 'Perplexity',
						value: 'perplexity',
						action: 'Perplexity',
					},
				]
			},

			// every other operation is forData
			...crawlerFields,
			...universalScrapingApiFields,
			...scrapingApiFields,
			...aiScraperFields,
		],
		name: 'scrapeless',
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const helpers = this.helpers;


		// Process each item
		for (let i = 0; i < items.length; i++) {
			try {

				const context: INodeContext = {
					functionThis: this,
					items,
					i,
				};

				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let responseItem: INodeExecutionData = {
					json: {},
				};

				switch (resource) {
					case 'crawler':
						responseItem = await handleCrawlerOperation(helpers, operation, context);
						break;
					case 'universalScrapingApi':
						responseItem = await handleUniversalScrapingApiOperation(helpers, operation, context);
						break;
					case 'scrapingApi':
						responseItem = await handleScrapingApiOperation(helpers, operation, context);
						break;
					case 'aiScraper':
						responseItem = await handleAiScraperOperation(helpers, operation, context);
						break;
					default:
						throw new NodeOperationError(this.getNode(), `Unsupported resource: ${resource}`);
				}


				returnData.push(responseItem);
			} catch (error) {
				// 에러 처리
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
