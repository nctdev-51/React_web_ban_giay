import { useMemo } from 'react';
import { 
  ComposedChart, Line, Area, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Dữ liệu 15 ngày để biểu đồ trông dày và đẹp hơn
const mockChartData = [
  { date: '01/04', revenue: 4200000, orders: 12, visits: 120 },
  { date: '02/04', revenue: 3800000, orders: 8, visits: 95 },
  { date: '03/04', revenue: 7500000, orders: 25, visits: 180 },
  { date: '04/04', revenue: 5200000, orders: 15, visits: 150 },
  { date: '05/04', revenue: 8900000, orders: 30, visits: 210 },
  { date: '06/04', revenue: 12500000, orders: 45, visits: 320 },
  { date: '07/04', revenue: 9500000, orders: 32, visits: 250 },
  { date: '08/04', revenue: 6200000, orders: 18, visits: 190 },
  { date: '09/04', revenue: 11000000, orders: 38, visits: 280 },
  { date: '10/04', revenue: 14500000, orders: 52, visits: 410 },
  { date: '11/04', revenue: 13200000, orders: 48, visits: 380 },
  { date: '12/04', revenue: 15800000, orders: 60, visits: 450 },
  { date: '13/04', revenue: 10500000, orders: 35, visits: 290 },
  { date: '14/04', revenue: 18200000, orders: 65, visits: 520 },
  { date: '15/04', revenue: 20500000, orders: 75, visits: 600 },
];

const formatPrice = (price: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. TOP STATS CARDS - NÂNG CẤP CHI TIẾT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Tổng doanh thu" value={formatPrice(152600000)} trend="+15.5%" icon={<DollarSign className="text-blue-600"/>} color="border-l-blue-500" />
        <KpiCard title="Đơn hàng" value="842" trend="+12.2%" icon={<ShoppingBag className="text-green-600"/>} color="border-l-green-500" />
        <KpiCard title="Khách hàng" value="1,205" trend="-2.4%" icon={<Users className="text-purple-600"/>} isDown color="border-l-purple-500" />
        <KpiCard title="Lượt truy cập" value="45,802" trend="+25.4%" icon={<TrendingUp className="text-orange-600"/>} color="border-l-orange-500" />
      </div>

      {/* 2. BIỂU ĐỒ CHI TIẾT NHIỀU THÔNG SỐ */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-bold text-[#111]">Phân tích doanh thu & Đơn hàng</h3>
            <p className="text-sm text-gray-500 italic">Dữ liệu tổng hợp từ 15 ngày gần nhất</p>
          </div>
          <select className="bg-gray-50 border border-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-black">
            <option>15 ngày qua</option>
            <option>Tháng này</option>
            <option>Quý này</option>
          </select>
        </div>

        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={mockChartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
              
              {/* Trục Y bên trái cho Doanh thu */}
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(v) => `${v/1000000}M`} />
              
              {/* Trục Y bên phải cho Số đơn hàng */}
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
              
              {/* Đổ màu nền Area cho Doanh thu */}
              <Area yAxisId="left" type="monotone" dataKey="revenue" fill="#f3f4f6" stroke="#111" strokeWidth={3} name="Doanh thu (VNĐ)" />
              
              {/* Vẽ cột Bar cho Số đơn hàng */}
              <Bar yAxisId="right" dataKey="orders" barSize={20} fill="#3b82f6" radius={[4, 4, 0, 0]} name="Số đơn hàng" />
              
              {/* Đường Line phụ cho Lượt truy cập (chia 10 để khớp scale đơn hàng) */}
              <Line yAxisId="right" type="monotone" dataKey="visits" stroke="#ff7300" strokeWidth={2} dot={{r: 4}} name="Lượt truy cập" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Custom Tooltip hiển thị chuyên nghiệp hơn
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 shadow-xl rounded-lg">
        <p className="font-bold mb-2 text-gray-800">{`Ngày: ${label}`}</p>
        <p className="text-sm text-black flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-black"></span>
          Doanh thu: <span className="font-bold">{formatPrice(payload[0].value)}</span>
        </p>
        <p className="text-sm text-blue-600 flex items-center gap-2 mt-1">
          <span className="w-3 h-3 rounded-full bg-blue-600"></span>
          Đơn hàng: <span className="font-bold">{payload[1].value} đơn</span>
        </p>
        <p className="text-sm text-orange-500 flex items-center gap-2 mt-1">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span>
          Truy cập: <span className="font-bold">{payload[2].value} lượt</span>
        </p>
      </div>
    );
  }
  return null;
};

function KpiCard({ title, value, trend, icon, isDown = false, color }: any) {
  return (
    <div className={`bg-white p-6 rounded-2xl border-l-4 ${color} shadow-sm border-y border-r border-gray-100 flex justify-between items-center transition-transform hover:scale-[1.02] cursor-default`}>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
        <h4 className="text-2xl font-black text-[#111]">{value}</h4>
        <div className={`flex items-center gap-1 mt-2 text-xs font-bold ${isDown ? 'text-red-500' : 'text-green-500'}`}>
          {isDown ? <ArrowDownRight size={14}/> : <ArrowUpRight size={14}/>}
          <span>{trend}</span>
          <span className="text-gray-400 font-normal ml-1">vs tháng trước</span>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-2xl">
        {icon}
      </div>
    </div>
  );
}   