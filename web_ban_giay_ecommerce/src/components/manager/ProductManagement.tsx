import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Edit2, Trash2, Plus, Search, X } from "lucide-react";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../../api/staffApi";

type SizeItem = {
  size: number;
  stock: number;
};

type Product = {
  id: number;
  title: string;
  price: number;
  description?: string;
  thumbnail?: string;
  images?: string[];
  sport?: string;
  productType?: string;
  collectionName?: string;
  gender?: string[];
  sizes?: SizeItem[];
};

type ProductForm = {
  id: string;
  title: string;
  price: string;
  description: string;
  thumbnail: string;
  sport: string;
  productType: string;
  collectionName: string;
  genderText: string;
  sizesText: string;
};

const emptyForm: ProductForm = {
  id: "",
  title: "",
  price: "",
  description: "",
  thumbnail: "",
  sport: "",
  productType: "",
  collectionName: "",
  genderText: "Men",
  sizesText: "40:5,41:3",
};

function parseSizes(input: string): SizeItem[] {
  if (!input.trim()) return [];

  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((pair) => {
      const [size, stock] = pair.split(":").map((v) => v.trim());
      return {
        size: Number(size),
        stock: Number(stock),
      };
    })
    .filter((item) => !Number.isNaN(item.size) && !Number.isNaN(item.stock));
}

function formatSizes(sizes?: SizeItem[]) {
  if (!sizes || sizes.length === 0) return "";
  return sizes.map((item) => `${item.size}:${item.stock}`).join(",");
}

function getTotalStock(sizes?: SizeItem[]) {
  if (!sizes || sizes.length === 0) return 0;
  return sizes.reduce((sum, item) => sum + Number(item.stock || 0), 0);
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchProductsList = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      console.log("Danh sách sản phẩm:", data);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Lỗi lấy sản phẩm:", error);
      alert(error?.message || "Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      (product.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleChange = (field: keyof ProductForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddNewClick = () => {
    alert("Nút Thêm Mới đã bấm");
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleEditClick = (product: Product) => {
    alert(`Đang sửa sản phẩm ID ${product.id}`);
    setEditingId(product.id);
    setForm({
      id: String(product.id),
      title: product.title || "",
      price: String(product.price || ""),
      description: product.description || "",
      thumbnail: product.thumbnail || "",
      sport: product.sport || "",
      productType: product.productType || "",
      collectionName: product.collectionName || "",
      genderText: product.gender?.join(",") || "",
      sizesText: formatSizes(product.sizes),
    });
    setShowForm(true);
  };

  const handleDeleteClick = async (productId: number) => {
    try {
      alert(`Đang xóa sản phẩm ID ${productId}`);
      const ok = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
      if (!ok) return;

      await deleteProduct(productId);
      await fetchProductsList();
      alert("Xóa sản phẩm thành công");
    } catch (error: any) {
      console.error("Lỗi xóa:", error);
      alert(error?.message || "Xóa sản phẩm thất bại");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const payload = {
        ...(editingId === null && form.id.trim() ? { id: Number(form.id) } : {}),
        title: form.title.trim(),
        price: Number(form.price),
        description: form.description.trim(),
        thumbnail: form.thumbnail.trim(),
        images: form.thumbnail.trim() ? [form.thumbnail.trim()] : [],
        sport: form.sport.trim(),
        productType: form.productType.trim(),
        collectionName: form.collectionName.trim(),
        gender: form.genderText
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        sizes: parseSizes(form.sizesText),
      };

      console.log("Payload gửi lên:", payload);

      if (!payload.title || Number.isNaN(payload.price)) {
        alert("Vui lòng nhập title và price hợp lệ");
        return;
      }

      if (editingId === null) {
        await createProduct(payload);
        alert("Thêm sản phẩm thành công");
      } else {
        await updateProduct(editingId, payload);
        alert("Cập nhật sản phẩm thành công");
      }

      resetForm();
      await fetchProductsList();
    } catch (error: any) {
      console.error("Lỗi lưu sản phẩm:", error);
      alert(error?.message || "Lưu sản phẩm thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-red-500 font-bold text-lg mb-4">
          FILE TEST PRODUCT MANAGEMENT
        </p>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-medium text-[#111]">Danh sách Sản phẩm</h2>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý kho hàng và thông tin giày
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Tìm tên giày..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={handleAddNewClick}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition whitespace-nowrap"
            >
              <Plus size={18} /> Thêm Mới
            </button>
          </div>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">
                {editingId === null ? "Thêm sản phẩm mới" : `Sửa sản phẩm #${editingId}`}
              </h3>

              <button
                type="button"
                onClick={resetForm}
                className="p-2 rounded-md hover:bg-gray-200 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editingId === null && (
                <div>
                  <label className="block text-sm font-medium mb-1">ID (có thể để trống)</label>
                  <input
                    className="w-full border rounded-md px-3 py-2"
                    value={form.id}
                    onChange={(e) => handleChange("id", e.target.value)}
                    placeholder="VD: 101"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
                <input
                  className="w-full border rounded-md px-3 py-2"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="VD: Nike Air Max"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Giá</label>
                <input
                  type="number"
                  className="w-full border rounded-md px-3 py-2"
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  placeholder="VD: 3200000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sport</label>
                <input
                  className="w-full border rounded-md px-3 py-2"
                  value={form.sport}
                  onChange={(e) => handleChange("sport", e.target.value)}
                  placeholder="VD: Running"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Product Type</label>
                <input
                  className="w-full border rounded-md px-3 py-2"
                  value={form.productType}
                  onChange={(e) => handleChange("productType", e.target.value)}
                  placeholder="VD: Shoes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Collection Name</label>
                <input
                  className="w-full border rounded-md px-3 py-2"
                  value={form.collectionName}
                  onChange={(e) => handleChange("collectionName", e.target.value)}
                  placeholder="VD: Air Max Collection"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Gender (cách nhau dấu phẩy)
                </label>
                <input
                  className="w-full border rounded-md px-3 py-2"
                  value={form.genderText}
                  onChange={(e) => handleChange("genderText", e.target.value)}
                  placeholder="VD: Men,Women"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Sizes (mẫu: 40:5,41:3)
                </label>
                <input
                  className="w-full border rounded-md px-3 py-2"
                  value={form.sizesText}
                  onChange={(e) => handleChange("sizesText", e.target.value)}
                  placeholder="VD: 40:5,41:3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
                <input
                  className="w-full border rounded-md px-3 py-2"
                  value={form.thumbnail}
                  onChange={(e) => handleChange("thumbnail", e.target.value)}
                  placeholder="Dán link ảnh"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea
                  className="w-full border rounded-md px-3 py-2 min-h-[100px]"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Nhập mô tả sản phẩm"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-60"
              >
                {submitting
                  ? "Đang lưu..."
                  : editingId === null
                  ? "Thêm sản phẩm"
                  : "Cập nhật sản phẩm"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition"
              >
                Hủy
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-sm text-gray-600 border-b border-gray-200">
                <th className="py-3 px-4 font-medium">ID</th>
                <th className="py-3 px-4 font-medium">Tên SP</th>
                <th className="py-3 px-4 font-medium">Danh mục</th>
                <th className="py-3 px-4 font-medium">Giá bán</th>
                <th className="py-3 px-4 font-medium">Tồn kho</th>
                <th className="py-3 px-4 font-medium text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    Đang tải sản phẩm...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const totalStock = getTotalStock(product.sizes);

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="py-4 px-4 text-gray-500 font-medium">{product.id}</td>
                      <td className="py-4 px-4 text-[#111] font-medium">{product.title}</td>
                      <td className="py-4 px-4 text-gray-600">
                        {product.sport || product.productType || "Chưa có"}
                      </td>
                      <td className="py-4 px-4 text-[#111]">
                        {new Intl.NumberFormat("vi-VN").format(product.price)}₫
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            totalStock > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {totalStock > 0 ? `${totalStock} đôi` : "Hết hàng"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="text-gray-500 hover:text-black transition"
                            title="Sửa"
                          >
                            <Edit2 size={18} />
                          </button>

                          <button
                            onClick={() => handleDeleteClick(product.id)}
                            className="text-gray-500 hover:text-red-500 transition"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}