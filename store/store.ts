import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { weatherApi, geonamesApi } from "../services/api";
import cityReducer from "../slices/citySlice";
import storage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
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
    getDefaultMiddleware({ serializableCheck: false })
      .concat(weatherApi.middleware)
      .concat(geonamesApi.middleware),
});

export const persistor = persistStore(store);
