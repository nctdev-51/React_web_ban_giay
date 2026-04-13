import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null;
  isSubmitting: boolean;
  signupSuccess: boolean;
  authMessage: { type: "error" | "success"; text: string } | null;
  isLogin: boolean;
  favorites: any[];
}

// Lấy user từ localStorage nếu người dùng F5 tải lại trang
const savedUser = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
const parsedUser = savedUser ? JSON.parse(savedUser) : null;

const initialState: AuthState = {
  user: parsedUser,
  favorites: parsedUser?.favorites || [],
  isSubmitting: false,
  signupSuccess: false,
  authMessage: null,
  isLogin: !!savedUser
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

// 3.Thêm danh sách yêu thích
export const toggleFavoriteApi = createAsyncThunk(
  "auth/toggleFavoriteApi",
  async ({ userId, product }: { userId: string; product: any }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: product._id }),
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data.message);

      // Trả về product để Slice cập nhật vào mảng favorites ở Frontend
      return product;
    } catch (error) {
      return rejectWithValue("Không thể kết nối đến máy chủ.");
    }
  }
);

// 4. Lấy thông tin User mới nhất (bao gồm Favorites từ DB)
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/profile/${userId}`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Không thể lấy thông tin người dùng.");
      }

      // Trả về user object mới nhất
      return data.user; 
    } catch (error) {
      return rejectWithValue("Lỗi kết nối server.");
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
      state.isLogin = false;
      state.user = null;
      state.favorites = [];
      state.authMessage = null;
      state.signupSuccess = false;
      localStorage.removeItem("currentUser");
      sessionStorage.removeItem("currentUser");
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý Sign In
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.user = updatedUser;
        // Cập nhật danh sách yêu thích mới nhất từ Server
        state.favorites = updatedUser.favorites || [];

        // Đồng bộ lại vào Storage để F5 vẫn giữ được dữ liệu mới nhất
        const storage = localStorage.getItem("currentUser") ? localStorage : sessionStorage;
        storage.setItem("currentUser", JSON.stringify(updatedUser));
        })
      .addCase(signInUser.pending, (state) => {
        state.isSubmitting = true;
        state.authMessage = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.user = action.payload;
        state.isLogin = true;
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
      })
      // Xử lý Toggle Favorite
      .addCase(toggleFavoriteApi.fulfilled, (state, action) => {
        const product = action.payload;
        // Kiểm tra xem sản phẩm đã có trong danh sách chưa (dựa trên _id)
        const index = state.favorites.findIndex((fav) => fav._id === product._id);

        if (index !== -1) {
          // Nếu có rồi thì xóa đi (Unlike)
          state.favorites.splice(index, 1);
        } else {
          // Nếu chưa có thì thêm vào (Like)
          state.favorites.push(product);
        }

        // Cập nhật lại localStorage để khi F5 không bị mất trạng thái trái tim
        if (state.user) {
          const updatedUser = { ...state.user, favorites: state.favorites };
          const storage = localStorage.getItem("currentUser") ? localStorage : sessionStorage;
          storage.setItem("currentUser", JSON.stringify(updatedUser));
        }
      });
  },
});

export const { clearAuthMessage, logout, resetSignupStatus } =
  authSlice.actions;
export default authSlice.reducer;
