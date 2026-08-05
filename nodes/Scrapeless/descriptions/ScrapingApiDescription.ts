import { INodeProperties } from "n8n-workflow";
import { googleDomainOptions, googleSearchCrOptions, googleSearchFilterOptions, googleSearchLrOptions, googleSearchNfprOptions, googleSearchSafeOptions, googleSearchTbmOptions, googleTrendsCatOptions, googleTrendsDataTypeOptions, googleTrendsGeoOptions, googleTrendsPropertyOptions } from "../common";

const googleSearchApiFields: INodeProperties[] =  [
	{
		displayName: 'Search Query',
		name: 'q',
		type: 'string',
		required: true,
		default: 'coffee',
		hint: "Parameter defines the query you want to search. You can use anything that you would use in a regular Google search. e.g. inurl:, site:, intitle:. We also support advanced search query parameters such as as_dt and as_eq.",
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleSearch'],
			}
		},
	},
	{
		displayName: 'Language',
		name: 'hl',
		type: 'string',
		default: 'en',
		hint: "Parameter defines the language to use for the Google search. It's a two-letter language code. (e.g., en for English, es for Spanish, or fr for French).",
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleSearch'],
			}
		},
	},
	{
		displayName: 'Country',
		name: 'gl',
		type: 'string',
		default: 'us',
		hint: "Parameter defines the country to use for the Google search. It's a two-letter country code. (e.g., us for the United States, uk for United Kingdom, or fr for France).",
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleSearch'],
			}
		},
	},
	{
		displayName: 'Domain',
		name: 'google_domain',
		type: 'options',
		hint: "Parameter defines the Google domain to use. It defaults to 'google.com'.",
		options: googleDomainOptions.map((domain) => ({
			name: domain.label,
			value: domain.value,
		})),
		default: 'google.com',
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleSearch'],
			}
		},
	},
	{
		displayName: 'Location',
		name: 'location',
		type: 'string',
		hint: "Parameter defines from where you want the search to originate. If several locations match the location requested, we'll pick the most popular one. The location and uule parameters can't be used together. It is recommended to specify location at the city level in order to simulate a real user’s search. If location is omitted, the search may take on the location of the proxy.",
		default: '',
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleSearch'],
			}
		},
	},
	{
		displayName: 'Result Offset',
		name: 'start',
		type: 'number',
		hint: "Parameter defines the result offset. It skips the given number of results. It's used for pagination. (e.g., `0` (default) is the first page of results, `10` is the 2nd page of results, `20` is the 3rd page of results, etc.).",
		default: 0,
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleSearch'],
			}
		},
	},
	{
		displayName: 'Number of Results',
		name: 'num',
		type: 'number',
		hint: "Parameter defines the maximum number of results to return. (e.g., `10` (default) returns 10 results, `40` returns 40 results, and `100` returns 100 results).",
		default: 10,
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleSearch'],
			}
		},
	},
	{
		displayName: 'Google Place ID',
		name: 'ludocid',
		type: 'string',
		hint: "Parameter defines the id (`CID`) of the Google My Business listing you want to scrape. Also known as Google Place ID.",
		default: '',
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleSearch'],
			}
		},
	},
	{
		displayName: 'Google Knowledge Graph ID',
		name: 'kgmid',
		type: 'string',
		hint: "Parameter defines the id (`KGMID`) of the Google Knowledge Graph listing you want to scrape. Also known as Google Knowledge Graph ID. Searches with `kgmid` parameter will return results for the originally encrypted search parameters. For some searches, `kgmid` may override all other parameters except `start`, and `num` parameters.",
		default: '',
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleSearch'],
			}
		},
	},
	{
		displayName: 'Google Element Rendering',
		name: 'ibp',
		type: 'string',
		hint: "Parameter is responsible for rendering layouts and expansions for some elements (e.g., `gwp;0,7` to expand searches with `ludocid` for expanded knowledge graph).",
		default: '',
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleSearch'],
			}
		},
	},
	{
		displayName: 'Set Multiple Countries',
		name: 'cr',
		type: 'options',
		hint: "Parameter defines one or multiple countries to limit the search to. It uses country{two-letter upper-case country code} to specify countries and | as a delimiter. (e.g., countryFR|countryDE will only search French and German pages).",
		options: googleSearchCrOptions.map((cr) => ({
			name: cr.label,
			value: cr.value,
		})),
		default: '',
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleSearch'],
			}
		},
	},
	{
		displayName: 'Set Multiple Languages',
		name: 'lr',
		type: 'options',
		hint: "Parameter defines one or multiple languages to limit the search to. It uses lang_{two-letter language code} to specify languages and | as a delimiter. (e.g., lang_fr|lang_de will only search French and German pages).",
		options: googleSearchLrOptions.map((lr) => ({
			name: lr.label,
			value: lr.value,
		})),
		default: '',
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleSearch'],
			}
		},
	},
	{
		displayName: 'Advanced Search Parameters',
		name: 'tbs',
		type: 'string',
		hint: "(to be searched) parameter defines advanced search parameters that aren't possible in the regular query field. (e.g., advanced search for patents, dates, news, videos, images, apps, or text contents).",
		default: '',
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleSearch'],
			}
		},
	},
	{
		displayName: 'Advanced Search Parameters',
		name: 'safe',
		type: 'options',
		hint: "Parameter defines the level of filtering for adult content. It can be set to `active` or `off`, by default Google will blur explicit content.",
		default: '',
		options: googleSearchSafeOptions.map((safe) => ({
			name: safe.label,
			value: safe.value,
		})),
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleSearch'],
			}
		},
	},
	{
		displayName: 'Exclude Auto-Corrected Results',
		name: 'nfpr',
		type: 'options',
		hint: "Parameter defines the exclusion of results from an auto-corrected query when the original query is spelled wrong. It can be set to `1` to exclude these results, or `0` to include them (default). Note that this parameter may not prevent Google from returning results for an auto-corrected query if no other results are available.",
		default: '',
		options: googleSearchNfprOptions.map((nfpr) => ({
			name: nfpr.label,
			value: nfpr.value,
		})),
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleSearch'],
			}
		},
	},
	{
		displayName: 'Results Filtering',
		name: 'filter',
		type: 'options',
		hint: "Parameter defines if the filters for 'Similar Results' and 'Omitted Results' are on or off. It can be set to 1 (default) to enable these filters, or 0 to disable these filters.",
		default: '',
		options: googleSearchFilterOptions.map((filter) => ({
			name: filter.label,
			value: filter.value,
		})),
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleSearch'],
			}
		},
	},
	{
		displayName: 'Search Type',
		name: 'tbm',
		type: 'options',
		hint: "(to be matched) parameter defines the type of search you want to do.\n\nIt can be set to:\n`(no tbm parameter)`: `regular Google Search`,\n`isch`: `Google Images API`,\n`lcl` - `Google Local API`\n`vid`: `Google Videos API`,\n`nws`: `Google News API`,\n`shop`: `Google Shopping API`,\n`pts`: `Google Patents API`,\nor any other Google service.",
		default: '',
		options: googleSearchTbmOptions.map((tbm) => ({
			name: tbm.label,
			value: tbm.value,
		})),
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleSearch'],
			}
		},
	},
]

const googleTrendsApiFields: INodeProperties[] = [
	{
		displayName: 'Search Query',
		name: 'q',
		type: 'string',
		required: true,
		default: 'Mercedes-Benz,BMW X5',
		hint: "Parameter defines the query or queries you want to search. You can use anything that you would use in a regular Google Trends search. The maximum number of queries per search is 5 (this only applies to `interest_over_time` and `compared_breakdown_by_region` data_type, other types of data will only accept 1 query per search).",
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleTrends'],
			}
		},
	},
	{
		displayName: 'Data Type',
		name: 'data_type',
		type: 'options',
		required: true,
		default: 'interest_over_time',
		options: googleTrendsDataTypeOptions.map((dataType) => ({
			name: dataType.label,
			value: dataType.value,
		})),
		hint: "The supported types are: `autocomplete`,`interest_over_time`,`compared_breakdown_by_region`,`interest_by_subregion`,`related_queries`,`related_topics`.",
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleTrends'],
			}
		},
	},
	{
		displayName: 'Date',
		name: 'date',
		type: 'string',
		default: 'today 1-m',
		hint: "The supported dates are: `now 1-H`, `now 4-H`, `now 1-d`, `now 7-d`, `today 1-m`, `today 3-m`, `today 12-m`, `today 5-y`, `all`.You can also pass custom values:Dates from 2004 to present: `yyyy-mm-dd yyyy-mm-dd` (e.g. `2021-10-15 2022-05-25`)\nDates with hours within a week range: `yyyy-mm-ddThh yyyy-mm-ddThh` (e.g. `2022-05-19T10 2022-05-24T22`). Hours will be calculated depending on the tz (time zone) parameter.",
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleTrends'],
			}
		},
	},
	{
		displayName: 'Language',
		name: 'hl',
		type: 'string',
		default: 'en',
		hint: "Parameter defines the language to use for the Google Trends search. It's a two-letter language code. (e.g., `en` for English, `es` for Spanish, or `fr` for French).",
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleTrends'],
			}
		},
	},
	{
		displayName: 'Time Zone',
		name: 'tz',
		type: 'string',
		default: '420',
		hint: "time zone offset. default is `420`.",
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleTrends'],
			}
		},
	},
	{
		displayName: 'Location',
		name: 'geo',
		type: 'options',
		default: '',
		options: googleTrendsGeoOptions.map((geo) => ({
			name: geo.label,
			value: geo.value,
		})),
		hint: "Parameter defines the location from where you want the search to originate. It defaults to Worldwide (activated when the value of geo parameter is not set or empty).",
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleTrends'],
			}
		},
	},
	{
		displayName: 'Category',
		name: 'cat',
		type: 'options',
		default: '',
		options: googleTrendsCatOptions.map((cat) => ({
			name: cat.label,
			value: cat.value,
		})),
		hint: "Parameter is used to define a search category. The default value is set to `0` (\"All categories\").",
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleTrends'],
			}
		},
	},
	{
		displayName: 'Property',
		name: 'property',
		type: 'options',
		default: '',
		options: googleTrendsPropertyOptions.map((property) => ({
			name: property.label,
			value: property.value,
		})),
		hint: "Parameter is used for sorting results by property. The default property is set to `Web Search` (activated when the value of property parameter is not set or empty). Other available options: `images` - Image Search`news` - News Search `froogle` - Google Shopping `youtube` - YouTube Search",
		displayOptions: {
			show: {
				resource: ['scrapingApi'],
				operation: ['googleTrends'],
			}
		},
	},
]


export const scrapingApiFields: INodeProperties[] = [
	...googleSearchApiFields,
	...googleTrendsApiFields,
]
