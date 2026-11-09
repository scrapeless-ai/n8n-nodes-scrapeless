import { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties, Icon } from 'n8n-workflow';

export class ScrapelessApi implements ICredentialType {
	name = 'scrapelessApi';
	displayName = 'Scrapeless API';
	documentationUrl = 'https://docs.scrapeless.com/en/docs/get-started/get-and-protect-your-api-key/';
	icon = 'file:scrapeless.png' as Icon;
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-api-token': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.scrapeless.com',
			method: 'GET',
			url: '/api/v1/me',
		},
	};
}
