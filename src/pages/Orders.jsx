import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function Orders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered'];

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentUser]);

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'All') return true;
    return order.status === activeTab;
  });

  // Helper to determine the progress bar width based on status
  const getProgressWidth = (status) => {
    switch (status) {
      case 'Pending': return '10%';
      case 'Processing': return '40%';
      case 'Shipped': return '75%';
      case 'Delivered': return '100%';
      default: return '0%';
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1522] py-10 pb-24 text-gray-200 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumbs */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/profile" className="hover:text-white transition-colors">Profile</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            <span className="text-gray-300">My Orders</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Purchase History</h1>
        </div>

        {/* E-commerce Tabs (Lazada / Shopee Style) */}
        <div className="flex overflow-x-auto border-b border-gray-800 mb-6 hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-6 font-bold text-sm border-b-2 transition-all ${
                activeTab === tab 
                  ? 'border-blue-500 text-blue-500' 
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab === 'Pending' ? 'To Pay/Pack' : tab === 'Shipped' ? 'To Receive' : tab}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading your orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-[#1f2937] border border-gray-800 rounded-2xl p-16 text-center shadow-lg">
              <span className="text-6xl block mb-4">📦</span>
              <h3 className="text-xl font-bold text-white mb-2">No orders found</h3>
              <p className="text-gray-400 mb-6">Looks like you don't have any orders in this category yet.</p>
              <Link to="/parts" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-lg transition-colors">Go Shopping</Link>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-[#1f2937] border border-gray-800 rounded-2xl overflow-hidden shadow-lg">
                
                {/* Order Header */}
                <div className="bg-[#2a3441] px-6 py-4 border-b border-gray-700 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider block mb-0.5">Order ID</span>
                    <span className="font-mono text-sm font-bold text-white">{order.id.slice(0, 10).toUpperCase()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 uppercase tracking-wider block mb-0.5">Status</span>
                    <span className={`text-sm font-bold ${order.status === 'Delivered' ? 'text-emerald-400' : 'text-blue-400'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Realistic Tracking Pipeline */}
                <div className="px-6 py-6 border-b border-gray-800 bg-[#1f2937]">
                  <div className="relative max-w-2xl mx-auto">
                    {/* Background Bar */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-700 -translate-y-1/2 rounded"></div>
                    {/* Active Progress Bar */}
                    <div 
                      className="absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 rounded transition-all duration-1000"
                      style={{ width: getProgressWidth(order.status) }}
                    ></div>
                    
                    {/* Nodes */}
                    <div className="relative flex justify-between">
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 ${['Pending', 'Processing', 'Shipped', 'Delivered'].includes(order.status) ? 'bg-blue-500 border-blue-500' : 'bg-gray-800 border-gray-600'}`}></div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:block">Placed</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 ${['Processing', 'Shipped', 'Delivered'].includes(order.status) ? 'bg-blue-500 border-blue-500' : 'bg-gray-800 border-gray-600'}`}></div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:block">Processing</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 ${['Shipped', 'Delivered'].includes(order.status) ? 'bg-blue-500 border-blue-500' : 'bg-gray-800 border-gray-600'}`}></div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:block">Shipped</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 ${order.status === 'Delivered' ? 'bg-emerald-500 border-emerald-500' : 'bg-gray-800 border-gray-600'}`}></div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:block">Delivered</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Container */}
                <div className="px-6 py-4 space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <img src={item.image} className="w-20 h-20 rounded-lg bg-[#111827] object-cover border border-gray-700 p-1" alt={item.name} />
                      <div className="flex-1">
                        <h4 className="text-base font-bold text-white line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-gray-400 mt-1">x{item.checkoutQuantity}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white">${(item.price * item.checkoutQuantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="bg-[#111827] px-6 py-4 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-400">
                    Order Date: <span className="text-white">{order.createdAt?.toDate().toLocaleDateString() || 'Recently'}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">Order Total:</span>
                    <span className="text-2xl font-black text-blue-500">${order.financials?.total.toFixed(2)}</span>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

export default Orders;