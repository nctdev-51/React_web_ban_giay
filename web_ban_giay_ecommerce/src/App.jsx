// import { useState } from "react";
// import "./App.css";
// import { TrendingProducts } from "./components/sections/CategoryPages";
// import Header from "./components/sections/Header/Header";
// import { Footer } from "./components/sections/Footer";
// import Home from "./components/sections/Home";

// function App() {
//   // return <TrendingProducts />;
//   return (
//     <div>
//       <Header />
//       <Home />
//       <Footer />
//     </div>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CategoryPage } from "./components/sections/CategoryPages";
import { Header } from "./components/sections/Header/Header";

function App() {
  return (
    <BrowserRouter>
      {/* Header dùng chung cho mọi trang */}
      <Header />

      <Routes>
        {/* Chuyển hướng trang chủ tạm thời vào Giày Nam */}
        <Route
          path="/"
          element={<Navigate to="/category/mens-shoes" replace />}
        />

        {/* ĐÂY LÀ ĐỊNH TUYẾN ĐỘNG: dấu hai chấm ':' báo hiệu đây là một biến */}
        <Route path="/category/:categorySlug" element={<CategoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
