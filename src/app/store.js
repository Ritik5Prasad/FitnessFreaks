// import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import onboardingReducer from "../features/onboardingSlice";
import foodSlice from "../features/foodSlice";

import thunkMiddleware from "redux-thunk";
import { combineReducers, createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import storage from "redux-persist/es/storage";
// export default configureStore({
//   reducer: {
//     user: userReducer,
//   },
//   middleware: [thunkMiddleware, ...getDefaultMiddleware({serializableCheck: false})],
// });

const AppReducers = combineReducers({
  user: userReducer,
  food: foodSlice,
  onboarding: onboardingReducer,
});

const rootReducer = (state, action) => {
  return AppReducers(state, action);
};

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["food"],
  timeout: null,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = createStore(rootReducer, applyMiddleware(thunk))
export const store = createStore(
  persistedReducer,
  applyMiddleware(thunkMiddleware)
);

export const persistor = persistStore(store);
