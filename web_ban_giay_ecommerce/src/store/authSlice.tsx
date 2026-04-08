import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null;
  isSubmitting: boolean;
  signupSuccess: boolean; // Trạng thái dùng để chuyển hướng sau khi đăng ký
  authMessage: { type: "error" | "success"; text: string } | null;
}

const initialState: AuthState = {
  user: null,
  isSubmitting: false,
  signupSuccess: false,
  authMessage: null,
};

// --- ASYNC THUNKS ---

// Đăng ký người dùng
export const signUpUser = createAsyncThunk(
  "auth/signUpUser",
  async (formData: any, { rejectWithValue }) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const existingUsers = JSON.parse(localStorage.getItem("nike_users") || "[]");

    if (existingUsers.some((u: any) => u.email === formData.email)) {
      return rejectWithValue("Email is already registered.");
    }

    existingUsers.push(formData);
    localStorage.setItem("nike_users", JSON.stringify(existingUsers));
    return "Account created successfully!";
  }
);

// Đăng nhập người dùng
export const signInUser = createAsyncThunk(
  "auth/signInUser",
  async (formData: any, { rejectWithValue }) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const existingUsers = JSON.parse(localStorage.getItem("nike_users") || "[]");
    
    const user = existingUsers.find(
      (u: any) => u.email === formData.email && u.password === formData.password
    );

    if (user) {
      return user;
    } else {
      return rejectWithValue("Invalid email or password. Please try again.");
    }
  }
);

// --- SLICE ---

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthMessage: (state) => {
      state.authMessage = null;
    },
    resetSignupStatus: (state) => {
      state.signupSuccess = false;
      state.authMessage = null;
    },
    logout: (state) => {
      state.user = null;
      state.authMessage = null;
      state.signupSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý Sign In
      .addCase(signInUser.pending, (state) => {
        state.isSubmitting = true;
        state.authMessage = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.user = action.payload;
        state.authMessage = {
          type: "success",
          text: `Welcome back, ${action.payload.firstName || "Member"}!`,
        };
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.isSubmitting = false;
        state.authMessage = {
          type: "error",
          text: action.payload as string,
        };
      })

      // Xử lý Sign Up
      .addCase(signUpUser.pending, (state) => {
        state.isSubmitting = true;
        state.authMessage = null;
        state.signupSuccess = false;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.signupSuccess = true;
        state.authMessage = {
          type: "success",
          text: action.payload as string,
        };
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.isSubmitting = false;
        state.signupSuccess = false;
        state.authMessage = {
          type: "error",
          text: action.payload as string,
        };
      });
  },
});

export const { clearAuthMessage, logout, resetSignupStatus } = authSlice.actions;
export default authSlice.reducer;