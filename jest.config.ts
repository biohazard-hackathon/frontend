import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	verbose: true,
	collectCoverage: true,
	collectCoverageFrom: [
		'<rootDir>/app/**/*.{js,jsx,ts,tsx}',
	],
	coverageDirectory: 'log',
	coverageReporters: ['lcov', 'text', 'cobertura'],
	testMatch: [
		'<rootDir>/tests/**/*.{js,jsx,ts,tsx}',
	],
	testPathIgnorePatterns: [
		'<rootDir>/tests/mocks.ts',
	],
	maxConcurrency: 1,
	transform: {
		'^.+\\.(ts,tsx)$': 'ts-jest',
	},
};

export default jestConfig;
