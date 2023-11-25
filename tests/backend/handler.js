const fs = require('fs');
const {GraphQLHandler} = require('graphql-mocks');

const schema = fs.readFileSync('./api.graphql', {
	encoding: 'utf8',
	flag: 'r',
});

const dateTimeFormat = new Intl.DateTimeFormat('cs-CZ', {
	timeStyle: 'medium',
	dateStyle: 'short',
});

const readResponse = (name) => {
	console.log(`[${dateTimeFormat.format(Date.now())}] - ${name}`);
	return JSON.parse(fs.readFileSync('./responses/' + name + '.json'));
};

const resolverMap = {
	Query: {
		healthCheck() {
			return readResponse('healthCheck');
		},
		getBiopsyResult() {
			return readResponse('biopsyResult');
		},
	},
	Subscription: {
		onProgressUpdate() {
			return readResponse('ingestionResult');
		},
	},
	Mutation: {
		startIngestion() {
			return readResponse('ingestionResult');
		},
		signalProgress() {
			return 'START';
		},
		saveAnalysis() {
			return readResponse('biopsyResultAnnotated');
		},
	},
};

module.exports = new GraphQLHandler({
	resolverMap,
	dependencies: {
		graphqlSchema: schema,
	},
});
