import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/sections/Header/Header.tsx";
import { Footer } from "./components/sections/Footer.tsx";
import { CategoryPage } from "./pages/CategoryPage/CategoryPage";

import Home from "./components/sections/Home.jsx";
import { ProductDetailPage } from "./pages/ProductDetailPage";

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

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
