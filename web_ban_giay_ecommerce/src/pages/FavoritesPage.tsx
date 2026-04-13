import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Link } from "react-router-dom";
import { CategoryProductCard } from "../components/Category/CategoryProductCard";
import { useEffect } from "react";
import { fetchUserProfile } from "../store/authSlice";

export default function FavoritesPage() {
  // 1. Lấy danh sách yêu thích từ Redux
  const dispatch = useAppDispatch();
  const { favorites, isLogin, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Nếu đã đăng nhập thì ép fetch lại dữ liệu mới nhất từ DB
    if (isLogin && user?._id) {
      dispatch(fetchUserProfile(user._id));
    }
  }, [dispatch, isLogin, user?._id]);

  // 2. Xử lý trường hợp chưa đăng nhập
  if (!isLogin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-semibold">Vui lòng đăng nhập</h2>
        <p className="text-gray-500">Bạn cần đăng nhập để xem danh sách yêu thích.</p>
        <Link to="/login" className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <h3 className="text-2xl font-medium text-[#111]">{user.firstName}'s Favorites</h3>
        <span className="text-gray-500 font-medium">({favorites.length})</span>
      </div>

      {/* 3. Kiểm tra nếu danh sách trống */}
      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl">
          <p className="text-gray-500">Bạn chưa có sản phẩm yêu thích nào.</p>
          <Link to="/" className="text-black font-medium underline mt-2 inline-block">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-10">
          {favorites.map((product) => (
            <CategoryProductCard key={product.id} product={product}/>
          ))}
        </div>
      )}
    </div>
  );
}