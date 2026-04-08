import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Header from "./components/sections/Header/Header";
import { Footer } from "./components/sections/Footer";

import Home from "./pages/Home/Home";
import { CategoryPage } from "./pages/CategoryPage/CategoryPage";
import CartProduct from "./pages/CartProduct";
import GuestCheckout from "./pages/GuestCheckout";
import ProductDetailPage from "./pages/ProductDetailPage";

// Import thêm 2 trang mới
import AuthPage from "./pages/Auth/AuthPage";
import User from "./pages/Auth/User"; // Giả sử file User.tsx của bạn đang ở thư mục này

function App() {
  return (
    <BrowserRouter>
      <div className="App min-h-screen flex flex-col">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/category/:categorySlug" element={<CategoryPage />} />

            <Route path="/cart" element={<CartProduct />} />
            <Route path="/guest-checkout" element={<GuestCheckout />} />

            {/* Các route Tâm cần thêm cho phần Xác thực (Auth) */}
            <Route path="/login" element={<AuthPage />} />
            <Route path="/profile" element={<User />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
