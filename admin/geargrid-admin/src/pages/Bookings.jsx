import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; 

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(bookingsArray);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  const filteredBookings = bookings.filter(booking => 
    booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (booking.customerName && booking.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (booking.service && booking.service.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, { status: newStatus });
      setToastMessage(`Booking ${newStatus.toLowerCase()} successfully!`);
      setToastType(newStatus === 'Declined' ? 'error' : 'success');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error updating status:", error);
      setToastMessage("Failed to update booking status.");
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1522] font-sans p-6 lg:p-10 text-slate-300 relative z-0 overflow-hidden">
      
      {/* BACKGROUND GLOW PARA MOGAWAS ANG GLASS EFFECT */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Manage Bookings</h1>
            <p className="text-slate-400 text-sm">View, accept, and decline customer service requests.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            {/* Glass Input */}
            <input 
              type="text" 
              placeholder="Search ID, Name, or Service..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder-slate-400 shadow-lg"
            />
          </div>
        </div>

        {/* GLASS TABLE CONTAINER */}
        <div className="bg-[#1a2235]/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-slate-300 text-xs uppercase tracking-wider border-b border-white/10">
                  <th className="p-5 font-bold">Booking ID</th>
                  <th className="p-5 font-bold">Customer</th>
                  <th className="p-5 font-bold">Service & Mechanic</th>
                  <th className="p-5 font-bold">Date & Time</th>
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
                        Loading bookings...
                      </div>
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-slate-400">No bookings found.</td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-5"><span className="text-sm font-bold text-blue-400 uppercase">#{booking.id.slice(0, 6)}</span></td>
                      <td className="p-5">
                        <p className="text-white font-bold text-sm">{booking.customerName}</p>
                        <p className="text-xs text-slate-400">{booking.customerEmail}</p>
                      </td>
                      <td className="p-5">
                        <p className="text-white font-medium text-sm">{booking.service}</p>
                        <p className="text-xs text-slate-400">Mech: <span className="text-slate-300">{booking.mechanic || 'Unassigned'}</span></p>
                      </td>
                      <td className="p-5">
                        <p className="text-slate-200 text-sm font-medium">{booking.date}</p>
                        <p className="text-xs text-slate-400">{booking.time}</p>
                      </td>
                      <td className="p-5 text-center">
                        <span className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${
                          booking.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30' : 
                          booking.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 
                          booking.status === 'In Progress' ? 'bg-blue-500/10 text-blue-300 border-blue-500/30' : 
                          booking.status === 'Confirmed' ? 'bg-purple-500/10 text-purple-300 border-purple-500/30' :
                          booking.status === 'Declined' ? 'bg-red-500/10 text-red-300 border-red-500/30' :
                          'bg-slate-500/10 text-slate-300 border-slate-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            booking.status === 'Pending' ? 'bg-yellow-400' : booking.status === 'Completed' ? 'bg-emerald-400' : 
                            booking.status === 'In Progress' ? 'bg-blue-400' : booking.status === 'Confirmed' ? 'bg-purple-400' :
                            booking.status === 'Declined' ? 'bg-red-400' : 'bg-slate-400'
                          }`}></span>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        {booking.status === 'Pending' ? (
                          <div className="flex justify-center items-center gap-2">
                            <button onClick={() => handleUpdateStatus(booking.id, 'Confirmed')} className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-all flex justify-center items-center backdrop-blur-sm">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            </button>
                            <button onClick={() => handleUpdateStatus(booking.id, 'Declined')} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all flex justify-center items-center backdrop-blur-sm">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                            No Action Needed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-5 border-t border-white/10 bg-transparent flex justify-between items-center text-xs text-slate-400">
            <div>Showing <span className="font-bold text-white">{filteredBookings.length}</span> bookings</div>
          </div>
        </div>
      </div>

      {/* Glass Toast */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className={`border px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 bg-[#1a2235]/80 backdrop-blur-xl ${toastType === 'success' ? 'border-white/10' : 'border-red-500/30'}`}>
          <div className={`p-2 rounded-xl flex-shrink-0 ${toastType === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            {toastType === 'success' ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">{toastType === 'success' ? 'Updated' : 'Declined'}</h4>
            <p className="text-xs text-slate-300">{toastMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookings;