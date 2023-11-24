import BaseApi from './BaseApi';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import HealthCheck from './graphql/queries/healthCheck.graphql';
import {ApolloQueryResult} from 'apollo-client';
import client from './AppsyncClient';

export interface UserInfo {
	id: number;
	email: string;
}

export default class BackendApi extends BaseApi {
	public static async healthCheck(): Promise<string> {
		const status: ApolloQueryResult<{ healthCheck: { status: string } }> = await client.query({
			query: HealthCheck,
			fetchPolicy: 'network-only',
		});
		return status.data.healthCheck.status;
	}

	public async getLoggedUserInfo(): Promise<UserInfo> {
		throw new Error('Implement me!');
	}
}
