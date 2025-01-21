import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

import translatorReducer from "./reducers/translatorsReducer";

export const createStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      translatorReducer,
    },
    preloadedState: initialState,
  });
};
export const store = createStore(); 

export default store

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;