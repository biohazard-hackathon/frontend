import BaseApi from './BaseApi';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import HealthCheck from './graphql/queries/healthCheck.graphql';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import StartIngestion from './graphql/mutations/startIngestion.graphql';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Annotate from './graphql/mutations/annotate.graphql';// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Comment from './graphql/mutations/comment.graphql';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import OnProgressUpdate from './graphql/subscriptions/OnProgressUpdate.graphql';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import GetBiopsyResult from './graphql/queries/getBiopsyResult.graphql';
import {ApolloQueryResult} from 'apollo-client';
import client from './AppsyncClient';
import {Annotation, IBiopsyResult, IGeneInfo, IIngestionProgress} from '../types';

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

	public static async annotateMutation(id: string, annotation: Annotation): Promise<IGeneInfo> {
		const result: ApolloQueryResult<{ annotate: IGeneInfo }> = await client.mutate({
			mutation: Annotate,
			fetchPolicy: 'no-cache',
			variables: {
				id,
				annotation,
			},
		});
		return result.data.annotate;
	}

	public static async commentMutation(id: string, comment: string): Promise<IGeneInfo> {
		const result: ApolloQueryResult<{ annotate: IGeneInfo }> = await client.mutate({
			mutation: Comment,
			fetchPolicy: 'no-cache',
			variables: {
				id,
				comment,
			},
		});
		return result.data.annotate;
	}

	// SUBSCRIPTIONS
	public static async onProgressUpdateSubscription(id: string) {
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
					console.log('Signal:', response);
					const result = response.output;
					// output += "S: " + result + "\n";
					// outputElement.innerText = output;
					console.log({subscription: result});
				},
				complete: console.log,
				error: console.error,
			});

			// output += "S: Listening for responses...\n";
			// outputElement.innerText = output;
			const output = await this.startIngestionMutation(id);
			console.log({mutation: output});
		});
	}

	public async getLoggedUserInfo(): Promise<UserInfo> {
		throw new Error('Implement me!');
	}
}
