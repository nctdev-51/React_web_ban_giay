import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import productDetailReducer from "./productDetailSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    productDetail: productDetailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
