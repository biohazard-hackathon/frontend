export interface IUserInfo {
	attributes: {
		sub: string,
		email: string,
		email_verified: boolean,
		name: string,
	},
	id: string | undefined,
	username: string
}

export enum QuestionResultStatus {
	STARTED = 'STARTED',
}

export enum Annotation {
	DANGER = 'DANGER',
	INCONCLUSIVE = 'INCONCLUSIVE',
	OK = 'OK',
	VOID = 'VOID',
}

export interface IQuestionResult {
	id: string,
	status: QuestionResultStatus,
	output: string,
}

export interface IGeneInfo {
	id: string,
	chromosome: string,
	region: string,
	type: string,
	reference: string,
	allele: string,
	length: string,
	count: string,
	coverage: string,
	frequency: string,
	forwardReverseBalance: string,
	averageQuality: string,
	typeOfMutation: string,
	condingRegionChange: string,
	aminoAcidChange: string,
	exonNumber: string,
	geneName: string,
	annotation?: Annotation,
	comment?: string,
}

export interface IBiopsyResult {
	blockId: string,
	results: IGeneInfo[],
}
