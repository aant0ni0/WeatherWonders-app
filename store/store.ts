import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { weatherApi, geonamesApi } from "../services/api";
import cityReducer from "../slices/citySlice";
import storage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer, PERSIST } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["city"],
};

const rootReducer = combineReducers({
  [weatherApi.reducerPath]: weatherApi.reducer,
  city: cityReducer,
  [geonamesApi.reducerPath]: geonamesApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PERSIST],
      },
    })
      .concat(weatherApi.middleware)
      .concat(geonamesApi.middleware),
});

export const persistor = persistStore(store);
