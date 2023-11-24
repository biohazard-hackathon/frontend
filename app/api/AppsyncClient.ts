import AWSAppSyncClient from 'aws-appsync';
import {AUTH_TYPE} from 'aws-appsync/lib/client';
import {Auth} from 'aws-amplify';
import {API_URL, AWS_REGION} from '../constants/env';

const client = new AWSAppSyncClient({
    url: API_URL,
    region: AWS_REGION,
    auth: {
        type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS,
        jwtToken: async () =>
            (await Auth.currentSession()).getAccessToken().getJwtToken(),
    },
});

export default client;
