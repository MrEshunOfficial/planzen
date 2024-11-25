// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./profile.slice";
import eventsReducer from "./event.slice";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    events: eventsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
