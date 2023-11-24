import { createAsyncThunk, createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import BackendApi, { UserInfo } from '../api/BackendApi';
import { API_URL } from '../constants/env';

export interface UserState {
	loggedIn: boolean,
	token: string,
	userInfo: UserInfo | null,
	authenticating: boolean,
	unauthenticated: boolean,
	userInfoRequestId: null | string,
	logoutRequestId: null | string,
	userInfoLoading: string,
	userInfoError: null | any,
}

export const initialState: UserState = {
	loggedIn: false,
	token: '',
	userInfo: null,
	authenticating: false,
	unauthenticated: false,
	userInfoRequestId: null,
	logoutRequestId: null,
	userInfoLoading: 'idle',
	userInfoError: null,
};

export const fetchUserInfo = createAsyncThunk<UserInfo | void, string, { state: { user: UserState } }>(
	'user/fetchUserInfo',
	async (userId: string, { getState, requestId }): Promise<UserInfo | void> => {
		const { userInfoRequestId, userInfoLoading, token } = getState().user;
		if (userInfoLoading !== 'pending' || requestId !== userInfoRequestId) {
			return;
		}

		const api = new BackendApi(API_URL, token);
		return await api.getLoggedUserInfo();
	},
);

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		authenticating: (state: Draft<UserState>, action: PayloadAction<string>) => {
			state.authenticating = true;
			state.token = String(action.payload);
		},
		signedIn: (state: Draft<UserState>, action: PayloadAction<UserInfo>) => {
			state.authenticating = false;
			state.loggedIn = true;
			state.userInfo = action.payload;
		},
		signedOut: (state: Draft<UserState>) => {
			state.loggedIn = false;
			state.authenticating = false;
			state.userInfo = null;
			state.token = initialState.token;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUserInfo.pending, (state, action) => {
				if (state.userInfoLoading === 'idle') {
					state.userInfoLoading = 'pending';
					state.userInfoRequestId = action.meta.requestId;
				}
			})
			.addCase(fetchUserInfo.fulfilled, (state, action) => {
				const { requestId } = action.meta;
				if (state.userInfoLoading === 'pending' && state.userInfoRequestId === requestId) {
					state.userInfoLoading = 'idle';
					state.userInfo = action.payload as UserInfo;
					state.userInfoRequestId = null;
				}
			})
			.addCase(fetchUserInfo.rejected, (state, action) => {
				const { requestId } = action.meta;
				if (state.userInfoLoading === 'pending' && state.userInfoRequestId === requestId) {
					state.userInfoLoading = 'idle';
					state.userInfoError = action.error;
					state.userInfoRequestId = null;
				}
			});
	},
});

export const { authenticating, signedIn, signedOut } = userSlice.actions;

export default userSlice.reducer;
