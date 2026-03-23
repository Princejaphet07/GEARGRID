// src/pages/Orders.jsx
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const ordersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // I-sort aron ang pinakabag-ong order maoy mag-una sa taas
        ordersList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Orders</h1>
          <p className="text-gray-400 text-sm">Manage and track customer orders here.</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="w-full bg-[#111827] border border-gray-700 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-500"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#1f2937] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs uppercase bg-[#111827] text-gray-500 border-b border-gray-800">
              <tr>
                <th className="p-5 font-bold tracking-wider">Order ID</th>
                <th className="p-5 font-bold tracking-wider">Customer</th>
                <th className="p-5 font-bold tracking-wider">Date</th>
                <th className="p-5 font-bold tracking-wider">Total</th>
                <th className="p-5 font-bold tracking-wider">Status</th>
                <th className="p-5 font-bold tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                      Loading orders...
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#111827]/50 transition-colors group">
                    <td className="p-5 font-mono text-xs text-blue-400 font-bold">{order.id.substring(0, 8).toUpperCase()}</td>
                    
                    <td className="p-5">
                      <p className="text-white font-bold">{order.customerEmail}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{order.items?.length || 0} items ordered</p>
                    </td>

                    <td className="p-5 text-gray-400">{order.orderDate}</td>
                    
                    <td className="p-5 font-bold text-emerald-400">₱{order.total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-2 w-max ${
                        order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        order.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          order.status === 'Completed' ? 'bg-emerald-500' : 
                          order.status === 'Pending' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></span>
                        {order.status}
                      </span>
                    </td>

                    <td className="p-5 text-center">
                      <button className="bg-[#111827] border border-gray-700 hover:border-blue-500 hover:text-blue-400 text-gray-400 px-4 py-2 rounded-lg text-xs font-bold transition-all">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Orders;