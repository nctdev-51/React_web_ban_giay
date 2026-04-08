import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { useParams } from "react-router-dom";
import type { Product, ProductSummary } from "../types/product";
import { getProductById, getRelatedProducts } from "../lib/productsApi";
import {
  AddToCartActions,
  Breadcrumbs,
  ProductDescription,
  ProductGallery,
  ProductInfo,
  ProductSpecs,
  RelatedProducts,
  SizeSelector,
} from "../components/sections/ProductDetail";

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const dispatch = useDispatch();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  // State mới quản lý lỗi UX và Thông báo
  const [sizeError, setSizeError] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const id = Number(productId);
    if (!id || Number.isNaN(id)) {
      setError("Product ID is invalid.");
      setIsLoading(false);
      return;
    }

    let mounted = true;

    async function fetchData() {
      setIsLoading(true);
      setError(null);
      setSelectedSize(null);
      setQuantity(1);
      setSizeError(false);
      setShowToast(false);

      try {
        const item = await getProductById(id);
        if (!mounted) return;
        setProduct(item);

        const related = await getRelatedProducts(item, 4);
        if (!mounted) return;
        setRelatedProducts(related);
      } catch (err) {
        if (!mounted) return;
        setError(
          err instanceof Error ? err.message : "Cannot load product details.",
        );
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      mounted = false;
    };
  }, [productId]);

  // Xóa cảnh báo lỗi nếu người dùng đã chọn size
  useEffect(() => {
    if (selectedSize) setSizeError(false);
  }, [selectedSize]);

  const breadcrumbs = useMemo(() => {
    if (!product) return [{ label: "Home", to: "/" }, { label: "Product" }];
    return [
      { label: "Home", to: "/" },
      { label: product.sport, to: `/` },
      { label: product.title },
    ];
  }, [product]);

  const handleAddToCart = () => {
    // Validate trước khi đẩy vào giỏ (Rất quan trọng cho DB)
    if (!selectedSize) {
      setSizeError(true);
      // Cuộn lên phần size nếu màn hình nhỏ
      window.scrollTo({ top: 300, behavior: "smooth" });
      return;
    }

    if (product) {
      dispatch(
        addToCart({
          ...product,
          selectedSize: selectedSize,
          quantity: quantity,
        }),
      );

      // Hiện thông báo đẹp mắt thay vì alert()
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000); // Tự động ẩn sau 3s
    }
  };

  if (isLoading)
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-lg text-gray-500">
        Đang tải thông tin...
      </div>
    );
  if (error || !product)
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-red-500">
        {error || "Product not found."}
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
