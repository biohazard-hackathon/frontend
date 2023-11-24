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
