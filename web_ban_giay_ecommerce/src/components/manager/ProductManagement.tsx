import { useState } from 'react';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

const initialProducts: Product[] = [
  { id: 'SP001', name: 'Nike Air Force 1', category: 'Men Shoes', price: 2900000, stock: 45 },
  { id: 'SP002', name: 'Air Jordan 1 Retro', category: 'Men Shoes', price: 4500000, stock: 12 },
  { id: 'SP003', name: 'Nike Dunk Low', category: 'Unisex', price: 3200000, stock: 0 },
];

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-medium text-[#111]">Danh sách Sản phẩm</h2>
            <p className="text-sm text-gray-500 mt-1">Quản lý kho hàng và thông tin giày</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm tên giày..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition whitespace-nowrap">
              <Plus size={18} /> Thêm Mới
            </button>
          </div>
        </div>

        {/* Bảng sản phẩm */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-sm text-gray-600 border-b border-gray-200">
                <th className="py-3 px-4 font-medium">Mã SP</th>
                <th className="py-3 px-4 font-medium">Tên SP</th>
                <th className="py-3 px-4 font-medium">Danh mục</th>
                <th className="py-3 px-4 font-medium">Giá bán</th>
                <th className="py-3 px-4 font-medium">Tồn kho</th>
                <th className="py-3 px-4 font-medium text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4 px-4 text-gray-500 font-medium">{product.id}</td>
                  <td className="py-4 px-4 text-[#111] font-medium">{product.name}</td>
                  <td className="py-4 px-4 text-gray-600">{product.category}</td>
                  <td className="py-4 px-4 text-[#111]">{new Intl.NumberFormat('vi-VN').format(product.price)}₫</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock > 0 ? `${product.stock} đôi` : 'Hết hàng'}
                    </span>
                  </td>
                  <td className="py-4 px-4 flex justify-center gap-3">
                    <button className="text-gray-500 hover:text-black transition" title="Sửa">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-gray-500 hover:text-red-500 transition" title="Xóa">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">Không tìm thấy sản phẩm nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}