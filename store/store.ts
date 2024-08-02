import { configureStore } from "@reduxjs/toolkit";
import { weatherApi } from "../services/api";
import cityReducer from "../slices/citySlice";

export const store = configureStore({
  reducer: {
    [weatherApi.reducerPath]: weatherApi.reducer,
    city: cityReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(weatherApi.middleware),
});
