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

export enum IngestionStatus {
    STARTED = 'STARTED',
    COMPLETED = 'COMPLETED',
    ERROR = 'ERROR',
	SHEET_LOADED = 'SHEET_LOADED',
	SHEET_PARSED = 'SHEET_PARSED',
	SHEET_VALIDATED = 'SHEET_VALIDATED'
}

export enum Annotation {
	DANGER = 'DANGER',
	INCONCLUSIVE = 'INCONCLUSIVE',
	OK = 'OK',
}

export interface IIngestionProgress {
	id: string,
	status: IngestionStatus,
	output?: string,
}

export interface IGeneInfo {
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
	codingRegionChange: string,
	aminoAcidChange: string,
	exonNumber: string,
	geneName: string,
	annotation?: Annotation,
	comment?: string,
}

export interface IBiopsyResult {
	blockId: string,
	id: string,
	results: {
		[key: string]: IGeneInfo
	},
}
