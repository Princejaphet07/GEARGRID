import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersArray);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (order.shippingInfo?.fullName && order.shippingInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (order.status && order.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      setToastMessage(`Order status updated to ${newStatus}!`);
      setToastType(newStatus === 'Cancelled' ? 'error' : 'success');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error updating status:", error);
      setToastMessage("Failed to update status.");
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#0f1522] font-sans p-6 lg:p-10 text-slate-300 relative z-0 overflow-hidden">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Manage Orders</h1>
            <p className="text-slate-400 text-sm">Track, update, and review customer parts orders.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search Order ID or Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder-slate-400 shadow-lg"
            />
          </div>
        </div>

        {/* GLASS TABLE */}
        <div className="bg-[#1a2235]/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-slate-300 text-xs uppercase tracking-wider border-b border-white/10">
                  <th className="p-5 font-bold">Order ID</th>
                  <th className="p-5 font-bold">Customer Info</th>
                  <th className="p-5 font-bold">Date Ordered</th>
                  <th className="p-5 font-bold">Total Amount</th>
                  <th className="p-5 font-bold text-center">Status</th>
                  <th className="p-5 font-bold text-center">Action</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-slate-400">
                      <div className="flex justify-center items-center gap-3">
                        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        Loading orders...
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-slate-400">No orders found.</td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-5"><span className="text-sm font-bold text-blue-400 uppercase">#{order.id.slice(0, 8)}</span></td>
                      
                      <td className="p-5">
                        <p className="text-white font-bold text-sm">{order.shippingInfo?.fullName || order.customerName || "Unknown"}</p>
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {order.shippingInfo ? `${order.shippingInfo.address}, ${order.shippingInfo.city}` : "No address"}
                        </p>
                      </td>

                      <td className="p-5"><p className="text-slate-200 text-sm font-medium">{formatDate(order.createdAt)}</p></td>
                      <td className="p-5"><span className="text-emerald-400 font-bold tracking-wide">₱{order.total?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}</span></td>
                      <td className="p-5 text-center">
                        <select 
                          value={order.status || 'Pending'}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border backdrop-blur-md focus:outline-none focus:ring-2 cursor-pointer transition-all ${
                            order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 
                            order.status === 'Processing' ? 'bg-blue-500/10 text-blue-300 border-blue-500/30' : 
                            order.status === 'Cancelled' ? 'bg-red-500/10 text-red-300 border-red-500/30' : 
                            'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
                          }`}
                        >
                          <option value="Pending" className="bg-[#1a2235] text-yellow-400">Pending</option>
                          <option value="Processing" className="bg-[#1a2235] text-blue-400">Processing</option>
                          <option value="Completed" className="bg-[#1a2235] text-emerald-400">Completed</option>
                          <option value="Cancelled" className="bg-[#1a2235] text-red-400">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-5 text-center">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white text-slate-300 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm backdrop-blur-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-5 border-t border-white/10 bg-transparent flex justify-between items-center text-xs text-slate-400">
            <div>Showing <span className="font-bold text-white">{filteredOrders.length}</span> orders</div>
          </div>
        </div>
      </div>

      {/* GLASS MODAL (FULL ORDER DETAILS) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f1522]/90 backdrop-blur-2xl border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div>
                <h3 className="text-xl font-black text-white">Order Details</h3>
                <p className="text-xs text-blue-400 font-mono mt-1">ID: {selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white bg-white/5 hover:bg-red-500/80 p-2 rounded-xl transition-colors border border-white/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              
              {/* CUSTOMER & SHIPPING INFO GRIDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                {/* Customer Info */}
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Customer Information</h4>
                  <p className="text-white font-bold text-lg">{selectedOrder.shippingInfo?.fullName || selectedOrder.customerName || 'Guest User'}</p>
                  
                  {/* Phone Number */}
                  {(selectedOrder.shippingInfo?.phone || selectedOrder.contactNumber) && (
                    <p className="text-sm text-slate-300 mt-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      {selectedOrder.shippingInfo?.phone || selectedOrder.contactNumber}
                    </p>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-slate-500 mb-1">Payment Method</p>
                    <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                      {selectedOrder.paymentMethod || 'COD'}
                    </span>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Shipping Address</h4>
                    
                    {selectedOrder.shippingInfo ? (
                      <div>
                        <span className="inline-block bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded mb-2">
                          {selectedOrder.shippingInfo.label || 'Delivery'}
                        </span>
                        <p className="text-sm text-slate-200 leading-relaxed font-medium">
                          {selectedOrder.shippingInfo.address}
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                          {selectedOrder.shippingInfo.city}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic">No delivery address provided.</p>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-slate-500 mb-1">Delivery Option</p>
                    <p className="text-sm font-bold text-white capitalize">{selectedOrder.deliveryOption || 'Standard'}</p>
                  </div>
                </div>

                {/* Order Notes */}
                {selectedOrder.orderNote && (
                  <div className="md:col-span-2 bg-yellow-500/10 p-4 rounded-2xl border border-yellow-500/20 backdrop-blur-sm">
                    <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Order Notes
                    </h4>
                    <p className="text-sm text-yellow-200/80 italic">"{selectedOrder.orderNote}"</p>
                  </div>
                )}
              </div>

              {/* Items List */}
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Items Ordered</h4>
              <div className="bg-white/5 rounded-2xl border border-white/10 divide-y divide-white/10 mb-6 backdrop-blur-sm">
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, index) => (
                    <div key={index} className="p-4 flex justify-between items-center gap-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 border border-white/10">📦</div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-white line-clamp-1">{item.name}</p>
                          <p className="text-xs text-slate-400">Qty: {item.quantity || 1} × {item.price}</p>
                        </div>
                      </div>
                      <span className="font-bold text-white text-sm">
                        {/* GINA-SAFE NAKO ANG PRICE DRI PARA DILI MU-ERROR KUNG NUMBER SIYA */}
                        ₱{((parseFloat(String(item.price || 0).replace('₱', '').replace(',', '')) || 0) * (item.quantity || 1)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-400 text-sm">No items found for this order.</div>
                )}
              </div>
            </div>

            {/* Modal Footer (Totals) */}
            <div className="p-6 border-t border-white/10 bg-white/5 flex justify-between items-end">
              <div>
                <p className="text-xs text-slate-400 mb-1">Status</p>
                <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold border ${
                  selectedOrder.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 
                  selectedOrder.status === 'Processing' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 
                  selectedOrder.status === 'Cancelled' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 
                  'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                }`}>
                  {selectedOrder.status || 'Pending'}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 mb-1">Total Amount</p>
                <p className="text-2xl font-black text-emerald-400">
                  ₱{selectedOrder.total?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Glass Toast */}
      <div className={`fixed bottom-6 right-6 z-[70] transition-all duration-300 transform ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className={`border px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 bg-[#1a2235]/80 backdrop-blur-xl ${toastType === 'success' ? 'border-white/10' : 'border-red-500/30'}`}>
          <div className={`p-2 rounded-xl flex-shrink-0 ${toastType === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            {toastType === 'success' ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">{toastType === 'success' ? 'Updated' : 'Status Changed'}</h4>
            <p className="text-xs text-slate-300">{toastMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;