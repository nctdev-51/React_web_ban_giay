import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null;
  isSubmitting: boolean;
  signupSuccess: boolean;
  authMessage: { type: "error" | "success"; text: string } | null;
}

// Lấy user từ localStorage nếu người dùng F5 tải lại trang
const savedUser = localStorage.getItem("currentUser");

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  isSubmitting: false,
  signupSuccess: false,
  authMessage: null,
};

// --- ASYNC THUNKS (GỌI API BACKEND THẬT) ---

// 1. Đăng ký người dùng
export const signUpUser = createAsyncThunk(
  "auth/signUpUser",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Lỗi khi đăng ký.");
      }

      return "Account created successfully!";
    } catch (error) {
      return rejectWithValue("Không thể kết nối đến máy chủ.");
    }
  },
);

// 2. Đăng nhập người dùng
export const signInUser = createAsyncThunk(
  "auth/signInUser",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Invalid email or password.");
      }

      // Lưu thông tin đăng nhập vào trình duyệt để không bị mất khi F5
      if (formData.rememberMe) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
      } else {
        sessionStorage.setItem("currentUser", JSON.stringify(data.user));
      }

      return data.user;
    } catch (error) {
      return rejectWithValue("Không thể kết nối đến máy chủ.");
    }
  },
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
      localStorage.removeItem("currentUser");
      sessionStorage.removeItem("currentUser");
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

export const { clearAuthMessage, logout, resetSignupStatus } =
  authSlice.actions;
export default authSlice.reducer;
