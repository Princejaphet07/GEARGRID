// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Siguroha nga sakto ni nga path paingon sa imong firebase.js

function Dashboard() {
  // --- STATE PARA SA TINUOD NGA DATA GIKAN SA FIREBASE ---
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrdersAndBookings: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  // KANI ANG BAG-O: Mo-fetch sa tinuod nga data sa Firebase
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Kuhaon ang total Users
        const usersSnap = await getDocs(collection(db, "users"));
        const usersCount = usersSnap.size;

        // 2. Kuhaon ang total Bookings (Services) ug i-sum ang presyo
        const bookingsSnap = await getDocs(collection(db, "bookings"));
        let totalRevenue = 0;
        let totalTransactions = bookingsSnap.size;

        bookingsSnap.forEach(doc => {
          const data = doc.data();
          totalRevenue += Number(data.price || 0); // Presyo sa service booking
        });

        // 3. Kuhaon ang total Orders (Kung naa kay 'orders' collection gikan sa Checkout)
        try {
          const ordersSnap = await getDocs(collection(db, "orders"));
          totalTransactions += ordersSnap.size;
          
          ordersSnap.forEach(doc => {
            const data = doc.data();
            totalRevenue += Number(data.total || 0); // Presyo sa parts order
          });
        } catch (orderErr) {
          console.log("No orders collection yet or error fetching orders.", orderErr);
        }

        // I-save sa state para mo-reflect sa UI
        setStats({
          totalRevenue: totalRevenue,
          totalOrdersAndBookings: totalTransactions,
          totalUsers: usersCount,
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // --- DUMMY DATA FOR CHARTS & TABLES (For Visuals) ---
  const revenueData = [
    { name: 'Jan', total: 12000 },
    { name: 'Feb', total: 19000 },
    { name: 'Mar', total: 15000 },
    { name: 'Apr', total: 22000 },
    { name: 'May', total: 28000 },
    { name: 'Jun', total: 24560 },
  ];

  const categoryData = [
    { name: 'Motor Parts', value: 55 },
    { name: 'Repair Services', value: 30 },
    { name: 'Accessories', value: 15 },
  ];
  const PIE_COLORS = ['#3b82f6', '#10b981', '#8b5cf6'];

  const bestSellers = [
    { id: 1, name: 'Premium Synthetic Motor Oil', sales: 124, price: '$35.00', image: 'https://images.unsplash.com/photo-1635773054098-9eb06b6e41b4?w=100&q=80' },
    { id: 2, name: 'Ceramic Brake Pads', sales: 98, price: '$55.50', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=100&q=80' },
    { id: 3, name: 'All-Terrain Motor Tires', sales: 45, price: '$120.00', image: 'https://images.unsplash.com/photo-1580274455041-d6ba8f2abdf2?w=100&q=80' },
  ];

  return (
    <div className="p-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm">Welcome back, Admin. Here is what's happening today.</p>
        </div>
        <button className="bg-[#1f2937] border border-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all">
          📅 Last 6 Months
        </button>
      </div>
      
      {/* 1. TOP STAT CARDS (NOW LIVE FROM FIREBASE) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Total Revenue */}
        <div className="bg-[#1f2937] p-6 rounded-2xl border border-gray-800 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Total Revenue</h3>
            <p className="text-3xl font-black text-white">
              {loading ? "..." : `₱${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </p>
            <p className="text-emerald-400 text-sm mt-2 font-bold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              Live Data
            </p>
          </div>
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
        </div>
        
        {/* Total Orders & Bookings */}
        <div className="bg-[#1f2937] p-6 rounded-2xl border border-gray-800 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Orders & Bookings</h3>
            <p className="text-3xl font-black text-white">
              {loading ? "..." : stats.totalOrdersAndBookings}
            </p>
            <p className="text-emerald-400 text-sm mt-2 font-bold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              Live Data
            </p>
          </div>
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl"></div>
        </div>

        {/* Total Customers */}
        <div className="bg-[#1f2937] p-6 rounded-2xl border border-gray-800 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Registered Users</h3>
            <p className="text-3xl font-black text-white">
              {loading ? "..." : stats.totalUsers}
            </p>
            <p className="text-emerald-400 text-sm mt-2 font-bold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              Live Data
            </p>
          </div>
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* 2. CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Main Area Chart (Takes up 2/3 space) */}
        <div className="lg:col-span-2 bg-[#1f2937] p-6 rounded-2xl border border-gray-800 shadow-sm">
          <h2 className="text-lg font-bold text-white mb-6">Revenue Overview</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
                <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', color: '#fff' }}
                  itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart (Takes up 1/3 space) */}
        <div className="bg-[#1f2937] p-6 rounded-2xl border border-gray-800 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-white mb-2">Sales by Category</h2>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text for Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-white">100%</span>
              <span className="text-xs text-gray-400">Total Sales</span>
            </div>
          </div>
          
          {/* Custom Legend */}
          <div className="flex justify-center gap-4 mt-4">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }}></div>
                <span className="text-xs font-bold text-gray-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW: BEST SELLERS */}
      <div className="bg-[#1f2937] p-6 rounded-2xl border border-gray-800 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">🏆 Best Selling Products</h2>
          <button className="text-blue-500 hover:text-blue-400 text-sm font-bold transition-colors">View All Catalog →</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                <th className="pb-3 font-bold">Product</th>
                <th className="pb-3 font-bold">Price</th>
                <th className="pb-3 font-bold">Total Sold</th>
                <th className="pb-3 font-bold">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {bestSellers.map((product) => (
                <tr key={product.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg bg-gray-800 object-cover border border-gray-700" />
                      <span className="font-bold text-white">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-300 font-medium">{product.price}</td>
                  <td className="py-4">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-md text-xs font-bold">
                      {product.sales} units
                    </span>
                  </td>
                  <td className="py-4 font-bold text-white">
                    ${(parseFloat(product.price.replace('$', '')) * product.sales).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;