import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import welcomeReducer from "./slices/welcomeSlice";

export const store = configureStore({
  reducer: { auth: authReducer, welcome: welcomeReducer },
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
