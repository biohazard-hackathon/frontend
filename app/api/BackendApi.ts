import BaseApi from './BaseApi';

export interface UserInfo {
	id: number;
	email: string;
}

export default class BackendApi extends BaseApi {
	public async healthCheck(): Promise<string> {
		throw new Error('Implement me!');
	}

	public async getLoggedUserInfo(): Promise<UserInfo> {
		throw new Error('Implement me!');
	}
}
