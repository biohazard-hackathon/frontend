import BaseApi from './BaseApi';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import HealthCheck from './graphql/queries/healthCheck.graphql';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import QuestionMutation from './graphql/mutations/questionMutation.graphql';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import OnQuestionResult from './graphql/subscriptions/onQuestionResult.graphql';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import GetBiopsyResult from './graphql/queries/getBiopsyResult.graphql';
import {ApolloQueryResult} from 'apollo-client';
import client from './AppsyncClient';
import {IBiopsyResult, IQuestionResult} from '../types';

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
	public static async questionMutation(executionId: string, text: string): Promise<IQuestionResult> {
		const result: ApolloQueryResult<{ question: IQuestionResult }> = await client.mutate({
			mutation: QuestionMutation,
			fetchPolicy: 'no-cache',
			variables: {
				executionId,
				text,
			},
		});
		return result.data.question;
	}

	// SUBSCRIPTIONS
	public static async onQuestionResultSubscription(executionId: string) {
		client.hydrated().then(async () => {
			const subscription = client.subscribe({
				query: OnQuestionResult,
				variables: {
					id: executionId,
				},
			});

			subscription.subscribe({
				next: (data) => {
					const response = data.data.onQuestionResult;
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
			const output = await this.questionMutation(executionId, 'dummy text');
			console.log({mutation: output});
		});
	}

	public async getLoggedUserInfo(): Promise<UserInfo> {
		throw new Error('Implement me!');
	}
}
