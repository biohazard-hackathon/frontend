import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import userReducer from '../reducers/userSlice';
import { Middleware } from 'redux';

const reducer = {
	user: userReducer,
};

const preloadedState = {};
const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

let middleware: ReadonlyArray<Middleware<any, any>> | undefined = undefined;

if (!isProduction && !isTest) {
	//@ts-ignore
	middleware = (getDefaultMiddleware) => getDefaultMiddleware().concat(logger);
}

const store = configureStore({
	reducer,
	middleware,
	devTools: !isProduction && !isTest,
	preloadedState,
	enhancers: [],
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
