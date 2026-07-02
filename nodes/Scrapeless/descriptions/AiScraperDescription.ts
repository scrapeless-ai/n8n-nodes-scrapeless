import { INodeProperties } from "n8n-workflow";
import { countryOptions } from "../common";

const aiScraperCountryOptions = countryOptions
	.filter((country) => country.value !== 'ANY')
	.map((country) => ({
		name: country.label,
		value: country.value,
	}));

/**
 * Build the shared "Prompt" field for a given AI Scraper operation.
 */
function promptField(operation: string): INodeProperties {
	return {
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		required: true,
		default: '',
		typeOptions: {
			rows: 3,
		},
		hint: 'The prompt to send to the model.',
		displayOptions: {
			show: {
				resource: ['aiScraper'],
				operation: [operation],
			},
		},
	};
}

/**
 * Build the shared "Country" field for a given AI Scraper operation.
 */
function countryField(operation: string): INodeProperties {
	return {
		displayName: 'Country',
		name: 'country',
		type: 'options',
		required: true,
		default: 'US',
		hint: 'Country or region code used to run the request.',
		options: aiScraperCountryOptions,
		displayOptions: {
			show: {
				resource: ['aiScraper'],
				operation: [operation],
			},
		},
	};
}

const chatgptFields: INodeProperties[] = [
	promptField('chatgpt'),
	countryField('chatgpt'),
	{
		displayName: 'Web Search',
		name: 'web_search',
		type: 'boolean',
		default: false,
		hint: 'Whether to enable web search.',
		displayOptions: {
			show: {
				resource: ['aiScraper'],
				operation: ['chatgpt'],
			},
		},
	},
	{
		displayName: 'Shopping',
		name: 'shopping',
		type: 'boolean',
		default: true,
		hint: 'Whether to fetch shopping data. When enabled, returns product information in the products field. Note: responses including shopping data are charged at 2x the base rate.',
		displayOptions: {
			show: {
				resource: ['aiScraper'],
				operation: ['chatgpt'],
			},
		},
	},
];

const perplexityFields: INodeProperties[] = [
	promptField('perplexity'),
	countryField('perplexity'),
	{
		displayName: 'Web Search',
		name: 'web_search',
		type: 'boolean',
		default: false,
		hint: 'Enable or disable web search.',
		displayOptions: {
			show: {
				resource: ['aiScraper'],
				operation: ['perplexity'],
			},
		},
	},
];

const copilotFields: INodeProperties[] = [
	promptField('copilot'),
	countryField('copilot'),
	{
		displayName: 'Mode',
		name: 'mode',
		type: 'options',
		required: true,
		default: 'search',
		hint: 'Mode to run Copilot in.',
		options: [
			{ name: 'Chat (Quick Response)', value: 'chat' },
			{ name: 'Reasoning (Think Deeper)', value: 'reasoning' },
			{ name: 'Search', value: 'search' },
			{ name: 'Smart (Quick Response)', value: 'smart' },
			{ name: 'Study (Study and Learn)', value: 'study' },
		],
		displayOptions: {
			show: {
				resource: ['aiScraper'],
				operation: ['copilot'],
			},
		},
	},
];

const geminiFields: INodeProperties[] = [
	promptField('gemini'),
	countryField('gemini'),
];

const grokFields: INodeProperties[] = [
	promptField('grok'),
	countryField('grok'),
	{
		displayName: 'Mode',
		name: 'mode',
		type: 'options',
		required: true,
		default: 'MODEL_MODE_AUTO',
		hint: 'Reasoning mode to run Grok in.',
		options: [
			{ name: 'Auto', value: 'MODEL_MODE_AUTO' },
			{ name: 'Expert', value: 'MODEL_MODE_EXPERT' },
			{ name: 'Fast', value: 'MODEL_MODE_FAST' },
		],
		displayOptions: {
			show: {
				resource: ['aiScraper'],
				operation: ['grok'],
			},
		},
	},
];

/**
 * Build the fields shared by the two Google AI operations
 * (Google AI Mode and Google AI Overview): shopping + location + uule.
 */
function googleAiFields(operation: string): INodeProperties[] {
	return [
		promptField(operation),
		countryField(operation),
		{
			displayName: 'Shopping',
			name: 'shopping',
			type: 'boolean',
			default: true,
			hint: 'Whether to fetch shopping data. When enabled, returns product information in the products field. Note: responses including shopping data are charged at 2x the base rate.',
			displayOptions: {
				show: {
					resource: ['aiScraper'],
					operation: [operation],
				},
			},
		},
		{
			displayName: 'Location',
			name: 'location',
			type: 'string',
			default: '',
			hint: 'Google canonical location name for geo-targeted results (e.g., New York,New York,United States). Mutually exclusive with UULE.',
			displayOptions: {
				show: {
					resource: ['aiScraper'],
					operation: [operation],
				},
			},
		},
		{
			displayName: 'UULE',
			name: 'uule',
			type: 'string',
			default: '',
			hint: 'Pre-encoded Google UULE string for precise geo-targeting. Use this when you have a pre-built UULE value instead of a location name. Mutually exclusive with Location.',
			displayOptions: {
				show: {
					resource: ['aiScraper'],
					operation: [operation],
				},
			},
		},
	];
}

export const aiScraperFields: INodeProperties[] = [
	...chatgptFields,
	...perplexityFields,
	...copilotFields,
	...geminiFields,
	...googleAiFields('googleAiMode'),
	...googleAiFields('googleAiOverview'),
	...grokFields,
];
