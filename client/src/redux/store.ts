import { persistReducer, persistStore } from "redux-persist";

import cartSlice from "./slices/cartSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import courseSlice from "./slices/courseSlice";
import storage from "redux-persist/lib/storage";
import userSlice from "./slices/userSlice";

// Combine reducers
const rootReducer = combineReducers({
  user: userSlice,
  course: courseSlice,
  cart: cartSlice,
});

// Redux-persist configuration
const persistConfig = {
  key: "root", // Key for the persisted state
  storage, // Storage backend (localStorage)
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist
    }),
});

// Create the persistor
export const persistor = persistStore(store);

// Export the store and types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
