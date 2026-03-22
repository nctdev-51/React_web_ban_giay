import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../types/product";

export interface CartItem extends Product {
  quantity: number;
  selectedSize: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.selectedSize === action.payload.selectedSize,
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    increaseQuantity: (
      state,
      action: PayloadAction<{ id: number; size: number }>,
    ) => {
      const item = state.items.find(
        (i) =>
          i.id === action.payload.id && i.selectedSize === action.payload.size,
      );
      if (item) item.quantity += 1;
    },
    decreaseQuantity: (
      state,
      action: PayloadAction<{ id: number; size: number }>,
    ) => {
      const item = state.items.find(
        (i) =>
          i.id === action.payload.id && i.selectedSize === action.payload.size,
      );
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ id: number; size: number }>,
    ) => {
      state.items = state.items.filter(
        (i) =>
          !(
            i.id === action.payload.id && i.selectedSize === action.payload.size
          ),
      );
    },
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart } =
  cartSlice.actions;
export default cartSlice.reducer;
