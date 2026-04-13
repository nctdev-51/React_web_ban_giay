import "./App.css";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

import Header from "./components/sections/Header/Header";
import { Footer } from "./components/sections/Footer";

import Home from "./pages/Home/Home";
import { CategoryPage } from "./pages/CategoryPage/CategoryPage";
import CartProduct from "./pages/CartProduct";
import GuestCheckout from "./pages/GuestCheckout";
import ProductDetailPage from "./pages/ProductDetailPage";

import AuthPage from "./pages/Auth/AuthPage";
import User from "./pages/Auth/User";

// FIX LỖI IMPORT TỪ ẢNH CỦA BẠN: manager nằm trong components
import AdminLayout from "./components/manager/AdminLayout"; 
import FavoritesPage from "./pages/FavoritesPage";

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="App min-h-screen flex flex-col">
      {/* Ẩn Header/Footer khi ở trang Admin */}
      {!isAdminPage && <Header />}
      
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/cart" element={<CartProduct />} />
          <Route path="/guest-checkout" element={<GuestCheckout />} />
          <Route path="/login" element={<AuthPage isSignup={false}/>} />
          <Route path="/register" element={<AuthPage isSignup={true}/>} />
          <Route path="/profile" element={<User />} />
          <Route path="/favorites" element={<FavoritesPage/>}/>
          {/* Route Admin */}
          <Route path="/admin" element={<AdminLayout />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;