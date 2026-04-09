import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProductById, getRelatedProducts } from "../lib/productsApi";
import type { Product, ProductSummary } from "../types/product";

interface ProductDetailState {
  product: Product | null;
  relatedProducts: ProductSummary[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductDetailState = {
  product: null,
  relatedProducts: [],
  isLoading: false,
  error: null,
};

export const fetchProductDetail = createAsyncThunk(
  "productDetail/fetchProductDetail",
  async (productId: number, { rejectWithValue }) => {
    try {
      const item = await getProductById(productId);
      const related = await getRelatedProducts(item, 4);

      return {
        product: item,
        relatedProducts: related,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Cannot load product details.",
      );
    }
  },
);

const productDetailSlice = createSlice({
  name: "productDetail",
  initialState,
  reducers: {
    clearProductDetailState: (state) => {
      state.product = null;
      state.relatedProducts = [];
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload.product;
        state.relatedProducts = action.payload.relatedProducts;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Cannot load product details.";
      });
  },
});

export const { clearProductDetailState } = productDetailSlice.actions;
export default productDetailSlice.reducer;
