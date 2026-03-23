// src/pages/Bookings.jsx
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase'; // Import sa imong Firebase Firestore setup

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // KANI ANG BAG-O: Fetch bookings gikan sa Firebase in real-time
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

    return () => unsubscribe(); // Cleanup listener inig unmount
  }, []);

  // Filter Bookings para sa Search
  const filteredBookings = bookings.filter(booking => 
    booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (booking.customerName && booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Service Bookings</h1>
          <p className="text-gray-400 text-sm">Manage garage appointments and mechanic schedules.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center gap-2">
          <span>+</span> New Appointment
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-[#1f2937] border border-gray-800 rounded-2xl overflow-hidden shadow-lg">
        
        {/* Search & Filter Bar */}
        <div className="p-5 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#1f2937]">
          <div className="relative w-full sm:w-96">
            <svg className="absolute left-3.5 top-3 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Booking ID or Customer..." 
              className="w-full bg-[#111827] border border-gray-700 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <select className="bg-[#111827] border border-gray-700 text-gray-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer">
              <option>All Mechanics</option>
              <option>Mike Thompson</option>
              <option>Sarah Jenkins</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-[#111827]/50 text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-800">
                <th className="p-5">Booking Details</th>
                <th className="p-5">Service & Mechanic</th>
                <th className="p-5">Schedule</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">Loading bookings from database...</td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">No bookings found.</td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-800/40 transition-colors group">
                    
                    {/* Booking Info */}
                    <td className="p-5">
                      <p className="font-bold text-white text-base mb-1">
                        {booking.id.substring(0, 8).toUpperCase()} {/* Mubo nga ID */}
                      </p>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        {booking.customerName}
                      </p>
                    </td>

                    {/* Service */}
                    <td className="p-5">
                      <p className="font-bold text-gray-200 mb-1">{booking.service}</p>
                      <p className="text-xs text-blue-400 flex items-center gap-1 font-bold">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        {booking.mechanic || 'Unassigned'}
                      </p>
                    </td>

                    {/* Schedule */}
                    <td className="p-5">
                      <p className="text-white font-bold mb-0.5">{booking.date}</p>
                      <p className="text-xs text-gray-500 font-bold bg-[#111827] px-2 py-1 rounded w-max border border-gray-700">{booking.time}</p>
                    </td>

                    {/* Status */}
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                        booking.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        booking.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                        booking.status === 'Confirmed' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          booking.status === 'Completed' ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 
                          booking.status === 'In Progress' ? 'bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]' : 
                          booking.status === 'Confirmed' ? 'bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]' :
                          'bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.5)]'
                        }`}></span>
                        {booking.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="p-5 text-center">
                      <button className="bg-[#111827] border border-gray-700 hover:border-blue-500 hover:text-blue-400 text-gray-400 px-4 py-2 rounded-lg text-xs font-bold transition-all">
                        Manage
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

export default Bookings;