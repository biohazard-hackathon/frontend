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
import {AWS_REGION, IDENTITY_POOL_ID, S3_BUCKET} from '../constants/env';
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {Auth} from 'aws-amplify';
import {fromCognitoIdentityPool} from '@aws-sdk/credential-providers';


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
				id: blockId,
			},
		});
		console.log('status', status);
		return status.data.getBiopsyResult;
	}

	public static async getRelevantReports(codingRegionChange: string[]): Promise<IRelevantReport[]> {
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
			return;
		});
	}

	public static async getPresignedLinkForUpload(key: string) {
		// const credentials = await Auth.currentCredentials();
		const config = {
			clientConfig: {region: AWS_REGION},
			identityPoolId: IDENTITY_POOL_ID,
			logins: {
				"cognito-idp.us-east-1.amazonaws.com/us-east-1_ifEOrHfGw": async () =>
					(await Auth.currentSession()).getIdToken().getJwtToken(),
			},
		};

		const s3Client = new S3Client({
			region: AWS_REGION,
			credentials: fromCognitoIdentityPool(config),
		});

		const command = new PutObjectCommand({
			Bucket: S3_BUCKET,
			Key: key + '.xlsx',
			ContentType: "vnd.ms-excel",
		});
		return getSignedUrl(s3Client, command, {expiresIn: 3600});
	}

	public async getLoggedUserInfo(): Promise<UserInfo> {
		throw new Error('Implement me!');
	}
}
