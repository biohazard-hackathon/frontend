import BaseApi from './BaseApi';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import HealthCheck from './graphql/queries/healthCheck.graphql';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import StartIngestion from './graphql/mutations/startIngestion.graphql';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SaveAnalysis from './graphql/mutations/saveAnalysis.graphql';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import OnProgressUpdate from './graphql/subscriptions/OnProgressUpdate.graphql';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import GetBiopsyResult from './graphql/queries/getBiopsyResult.graphql';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import GetRelevantReports from './graphql/queries/getRelevantReports.graphql';
import {ApolloQueryResult} from 'apollo-client';
import client from './AppsyncClient';
import {IBiopsyResult, IGeneInfo, IIngestionProgress, IRelevantReport} from '../types';

export interface UserInfo {
	id: number;
	email: string;
}

export default class BackendApi extends BaseApi {
	// QUERIES
	public static async healthCheck(): Promise<string> {
		const status: ApolloQueryResult<{ healthCheck: { status: string } }> = await client.query({
			query: HealthCheck,
			fetchPolicy: 'network-only',
		});
		return status.data.healthCheck.status;
	}

	public static async getBiopsyResult(blockId: string): Promise<IBiopsyResult> {
		const status: ApolloQueryResult<{ getBiopsyResult: IBiopsyResult }> = await client.query({
			query: GetBiopsyResult,
			fetchPolicy: 'network-only',
			variables: {
				blockId,
			},
		});
		return status.data.getBiopsyResult;
	}

	public static async getRelevantReports(codingRegionChange: [string]): Promise<[IRelevantReport]> {
		const status: ApolloQueryResult<{ getRelevantReports: [IRelevantReport] }> = await client.query({
			query: GetRelevantReports,
			fetchPolicy: 'network-only',
			variables: {
				codingRegionChange,
			},
		});
		return status.data.getRelevantReports;
	}

	// MUTATIONS
	public static async startIngestionMutation(id: string): Promise<IIngestionProgress> {
		const result: ApolloQueryResult<{ startIngestion: IIngestionProgress }> = await client.mutate({
			mutation: StartIngestion,
			fetchPolicy: 'no-cache',
			variables: {
				id,
			},
		});
		return result.data.startIngestion;
	}

	public static async saveAnalysis(id: string, annotatedGeneVariants: {[key: string]: IGeneInfo}): Promise<IBiopsyResult> {
		const result: ApolloQueryResult<{ saveAnalysis: IBiopsyResult }> = await client.mutate({
			mutation: SaveAnalysis,
			fetchPolicy: 'no-cache',
			variables: {
				id,
				results: annotatedGeneVariants,
			},
		});

		return result.data.saveAnalysis;
	}

	// SUBSCRIPTIONS
	public static async onProgressUpdateSubscription(id: string, setSignal: Function) {
		client.hydrated().then(async () => {
			const subscription = client.subscribe({
				query: OnProgressUpdate,
				variables: {
					id,
				},
			});

			subscription.subscribe({
				next: (data) => {
					const response = data.data.onProgressUpdate;
					console.log('Signal:', response); // here is what the incoming signals are coming to us
					const result = response.output;
					setSignal(response);

					console.log({subscription: result});
				},
				complete: console.log,
				error: console.error,
			});

			const output = await this.startIngestionMutation(id);
			console.log({mutation: output});
			return
		});
	}

	public async getLoggedUserInfo(): Promise<UserInfo> {
		throw new Error('Implement me!');
	}
}
