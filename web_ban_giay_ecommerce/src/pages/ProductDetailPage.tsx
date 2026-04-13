import { useCallback, useEffect, useMemo } from "react";
import { addToCart } from "../store/cartSlice";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProductDetail } from "../store/productDetailSlice";
import {
  AddToCartActions,
  Breadcrumbs,
  ProductDetailUiProvider,
  ProductDescription,
  ProductGallery,
  ProductInfo,
  ProductSpecs,
  RelatedProducts,
  SizeSelector,
  useProductDetailUi,
} from "./ProductDetail";
import { toggleFavoriteApi } from "../store/authSlice"; 
import { Heart } from "lucide-react";

export default function ProductDetailPage() {
  return (
    <ProductDetailUiProvider>
      <ProductDetailContent />
    </ProductDetailUiProvider>
  );
}

function ProductDetailContent() {
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useAppDispatch();

  const { user, favorites, isLogin } = useAppSelector((state) => state.auth);
  const { product, relatedProducts, isLoading, error } = useAppSelector(
    (state) => state.productDetail,
  );
  const {
    selectedSize,
    quantity,
    sizeError,
    showToast,
    setSelectedSize,
    setQuantity,
    markSizeRequired,
    showAddedToast,
    resetUiState,
  } = useProductDetailUi();

  const isFavorite = useMemo(() => {
    if (!product || !favorites) return false;
    // Kiểm tra xem ID sản phẩm hiện tại có trong mảng favorites của User không
    return favorites.some((fav: any) => 
      typeof fav === "string" ? fav === product._id : fav._id === product._id
    );
  }, [favorites, product]);

  const handleToggleFavorite = useCallback(() => {
    if (!isLogin || !user) {
      alert("Vui lòng đăng nhập để thêm vào danh sách yêu thích!");
      return;
    }
    
    if (product) {
      // Gọi AsyncThunk đã tạo trong authSlice
      dispatch(toggleFavoriteApi({ userId: user._id, product: product }));
    }
  }, [dispatch, isLogin, user, product]);


  useEffect(() => {
    const id = Number(productId);
    if (!id || Number.isNaN(id)) {
      return;
    }

    resetUiState();
    dispatch(fetchProductDetail(id));
  }, [dispatch, productId, resetUiState]);

  const breadcrumbs = useMemo(() => {
    if (!product) return [{ label: "Home", to: "/" }, { label: "Product" }];
    return [
      { label: "Home", to: "/" },
      { label: product.sport, to: `/` },
      { label: product.title },
    ];
  }, [product]);

  const handleAddToCart = useCallback(() => {
    if (!selectedSize) {
      markSizeRequired();
      window.scrollTo({ top: 300, behavior: "smooth" });
      return;
    }

    if (product) {
      dispatch(
        addToCart({
          ...product,
          selectedSize,
          quantity,
        }),
      );
      showAddedToast();
    }
  }, [dispatch, markSizeRequired, product, quantity, selectedSize, showAddedToast]);

  if (isLoading)
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-lg text-gray-500">
        Đang tải thông tin...
      </div>
    );
  if (error || !product)
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-red-500">
        {error || "Product ID is invalid."}
      </div>
    );

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 space-y-10 relative">
      <Breadcrumbs items={breadcrumbs} />

      <section className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        <div className="sticky top-24 h-fit">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        <div className="space-y-8 pt-4">
          <ProductInfo product={product} />

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <h3
                className={`font-medium ${sizeError ? "text-red-500" : "text-[#111]"}`}
              >
                {sizeError ? "Vui lòng chọn Kích thước" : "Chọn Kích thước"}
              </h3>
            </div>

            {/* Nếu có lỗi, bạn có thể truyền border đỏ vào Component này nếu nó hỗ trợ, ở đây mình bao bọc bằng 1 div */}
            <div
              className={`transition-all ${sizeError ? "ring-1 ring-red-500 p-2 rounded-xl bg-red-50/50" : ""}`}
            >
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
              />
            </div>
          </div>

          <AddToCartActions
            quantity={quantity}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
            selectedSize={selectedSize}
          />

          {/* NÚT TRÁI TIM */}
            <button
              onClick={handleToggleFavorite}
              className={`w-full py-4 rounded-full border flex items-center justify-center gap-2 transition-all font-medium cursor-pointer
                ${isFavorite 
                  ? "bg-red-50 border-red-200 text-red-600" 
                  : "bg-white border-gray-300 text-black hover:border-black"}`}
            >
              <Heart 
                size={20} 
                fill={isFavorite ? "currentColor" : "none"} 
                strokeWidth={isFavorite ? 0 : 2}
              />
              {isFavorite ? "Đã yêu thích" : "Yêu thích"}
            </button>
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-8 lg:gap-16 border-t border-gray-200 pt-16 mt-16">
        <ProductDescription product={product} />
        <ProductSpecs product={product} />
      </section>

      <div className="border-t border-gray-200 pt-16 mt-16">
        <RelatedProducts products={relatedProducts} />
      </div>

      {/* Toast Notification Notification Thay thế cho alert() */}
      <div
        className={`fixed bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-lg transition-all duration-300 z-50 ${showToast ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}
      >
        <span className="bg-white text-black w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
          ✓
        </span>
        <span className="font-medium text-sm">
          Đã thêm {product.title} vào giỏ hàng!
        </span>
      </div>
    </main>
  );
}
