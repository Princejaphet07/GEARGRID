import { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    totalUsers: 0,
  });
  
  // BAG-O: State para sa tinuod nga Best Sellers gikan sa Firebase
  const [bestSellers, setBestSellers] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');

  // Fetch real data from Firebase
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Get Total Users
        const usersSnap = await getDocs(collection(db, "users"));
        const usersCount = usersSnap.size;

        // 2. Get Total Bookings & Revenue
        const bookingsSnap = await getDocs(collection(db, "bookings"));
        let bookingRevenue = 0;
        let bookingsCount = bookingsSnap.size;

        bookingsSnap.forEach(doc => {
          const data = doc.data();
          if (data.price) bookingRevenue += Number(data.price);
        });

        // 3. Get Total Orders, Revenue, AND Aggregate Top Products
        const ordersSnap = await getDocs(collection(db, "orders"));
        let orderRevenue = 0;
        let ordersCount = ordersSnap.size;
        
        // Gamiton ni para pag-ihap sa halin kada produkto
        const productSalesMap = {};

        ordersSnap.forEach(doc => {
          const data = doc.data();
          if (data.total) orderRevenue += Number(data.total);

          // Assuming ang imong order document naay 'items' array nga maoy gipamalit
          if (data.items && Array.isArray(data.items)) {
            data.items.forEach(item => {
              // Gamiton ang ID or Name as unique identifier
              const productId = item.id || item.name; 
              
              if (!productSalesMap[productId]) {
                productSalesMap[productId] = {
                  id: productId,
                  name: item.name,
                  price: Number(item.price) || 0,
                  sales: 0,
                  image: item.image || null,
                };
              }
              // I-add ang quantity sa order
              productSalesMap[productId].sales += Number(item.quantity) || 1;
            });
          }
        });

        // I-convert ang map to array, i-sort gikan dako paingon gamay nga halin, ug kuhaon ang Top 5
        const top5Products = Object.values(productSalesMap)
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 5);

        setBestSellers(top5Products);

        setStats({
          totalRevenue: bookingRevenue + orderRevenue,
          totalTransactions: bookingsCount + ordersCount,
          totalUsers: usersCount,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchDashboardData();
  }, [filterDate]);

  // MOCK DATA PARA SA CHARTS (Padayon ra gihapon ni hantod i-connect nato unya)
  const revenueData = [
    { name: 'Jan', revenue: 4000 }, { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 }, { name: 'Apr', revenue: 4500 },
    { name: 'May', revenue: 6000 }, { name: 'Jun', revenue: 7500 },
    { name: 'Jul', revenue: 8200 }, { name: 'Aug', revenue: 9000 },
  ];

  const categoryData = [
    { name: 'Engine Parts', value: 400 },
    { name: 'Accessories', value: 300 },
    { name: 'Services', value: 300 },
    { name: 'Electrical', value: 200 },
  ];
  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

  return (
    <div className="min-h-screen bg-[#0f1522] font-sans p-6 lg:p-10 text-slate-300 relative z-0 overflow-hidden">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px]"></div>
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Header Section with Calendar Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Dashboard Overview</h1>
            <p className="text-slate-400 text-sm">Monitor your store's performance, sales, and analytics.</p>
          </div>
          
          {/* GLASS DATE PICKER */}
          <div className="flex flex-col gap-1.5 w-full md:w-auto">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Filter by Date</label>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 shadow-lg hover:bg-white/10 transition-colors focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input 
                type="date" 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-transparent text-white focus:outline-none text-sm font-medium w-full md:w-40 cursor-pointer"
                style={{ colorScheme: 'dark' }}
              />
              {filterDate && (
                <button 
                  onClick={() => setFilterDate('')}
                  className="text-slate-500 hover:text-red-400 transition-colors"
                  title="Clear Date"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-blue-400 font-bold animate-pulse">Loading data...</p>
          </div>
        ) : (
          <>
            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-[fadeIn_0.5s_ease-out]">
              {/* Revenue */}
              <div className="bg-[#1a2235]/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex items-center gap-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex justify-center items-center text-emerald-400 shadow-inner">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-bold mb-1">Total Revenue</p>
                  <h3 className="text-3xl font-black text-white">₱{stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                </div>
              </div>

              {/* Transactions */}
              <div className="bg-[#1a2235]/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex items-center gap-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex justify-center items-center text-blue-400 shadow-inner">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-bold mb-1">Total Orders & Bookings</p>
                  <h3 className="text-3xl font-black text-white">{stats.totalTransactions}</h3>
                </div>
              </div>

              {/* Users */}
              <div className="bg-[#1a2235]/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex items-center gap-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex justify-center items-center text-purple-400 shadow-inner">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-bold mb-1">Registered Users</p>
                  <h3 className="text-3xl font-black text-white">{stats.totalUsers}</h3>
                </div>
              </div>
            </div>

            {/* CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-[fadeIn_0.5s_ease-out]">
              {/* Main Area Chart */}
              <div className="lg:col-span-2 bg-[#1a2235]/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white">Revenue Overview</h2>
                    <p className="text-xs text-slate-400">Monthly sales performance {filterDate && `(Filtered)`}</p>
                  </div>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₱${value}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(15, 21, 34, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-[#1a2235]/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex flex-col">
                <div className="mb-2">
                  <h2 className="text-xl font-bold text-white">Sales Distribution</h2>
                  <p className="text-xs text-slate-400">By top categories & services</p>
                </div>
                <div className="flex-1 min-h-[250px] w-full flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="rgba(255,255,255,0.05)"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(15, 21, 34, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ fontWeight: 'bold', color: '#fff' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* BEST SELLERS TABLE (Connected to Real Firebase Data) */}
            <div className="bg-[#1a2235]/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] animate-[fadeIn_0.5s_ease-out]">
              <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Top 5 Performing Products</h2>
                <button className="text-sm text-blue-400 hover:text-white transition-colors font-bold">View All Orders</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 text-slate-300 text-xs uppercase tracking-wider border-b border-white/10">
                      <th className="p-5 font-bold">Product</th>
                      <th className="p-5 font-bold">Price</th>
                      <th className="p-5 font-bold">Total Sold</th>
                      <th className="p-5 font-bold">Revenue Generated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bestSellers.length > 0 ? (
                      bestSellers.map((product, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors group">
                          <td className="p-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-sm overflow-hidden">
                                {product.image ? (
                                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-xl">📦</span>
                                )}
                              </div>
                              <span className="font-bold text-white group-hover:text-blue-400 transition-colors">{product.name}</span>
                            </div>
                          </td>
                          <td className="p-5 text-slate-300 font-medium">₱{product.price.toLocaleString()}</td>
                          <td className="p-5">
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg text-xs font-bold">
                              {product.sales} units
                            </span>
                          </td>
                          <td className="p-5 font-bold text-white text-lg">
                            ₱{(product.price * product.sales).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-slate-400">
                          No product sales recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}

export default Dashboard;