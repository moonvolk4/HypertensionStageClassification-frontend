import { configureStore } from '@reduxjs/toolkit';

import servicesReducer from './slices/servicesSlice';
import userReducer from './slices/userSlice';
import draftReducer from './slices/draftSlice';
import recordsReducer from './slices/recordsSlice';

export const store = configureStore({
	reducer: {
		services: servicesReducer,
		user: userReducer,
		draft: draftReducer,
		records: recordsReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
