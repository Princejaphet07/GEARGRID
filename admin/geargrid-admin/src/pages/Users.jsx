// src/pages/Users.jsx
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Siguroha nga sakto ang path sa imong firebase.js

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'No Name Set',
            email: data.email || 'No Email',
            profilePic: data.profilePic || null,
            // Fallback values since wala pa ni sa atong database sa pagkakaron
            spent: data.spent || '$0.00',
            orders: data.orders || 0,
            tier: data.tier || 'New',
            joined: data.joined || 'Recently'
          };
        });
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Customers</h1>
          <p className="text-gray-400 text-sm">Manage your registered users and their activity.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="w-full bg-[#111827] border border-gray-700 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-500"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <button className="bg-[#111827] border border-gray-700 hover:border-blue-500 hover:text-blue-400 text-gray-300 p-2.5 rounded-xl transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#1f2937] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs uppercase bg-[#111827] text-gray-500 border-b border-gray-800">
              <tr>
                <th className="p-5 font-bold tracking-wider">Customer</th>
                <th className="p-5 font-bold tracking-wider">Tier</th>
                <th className="p-5 font-bold tracking-wider">Total Spent</th>
                <th className="p-5 font-bold tracking-wider">Joined</th>
                <th className="p-5 font-bold tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                      Loading customers...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#111827]/50 transition-colors group">
                    
                    {/* Customer Info */}
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        {user.profilePic ? (
                          <img src={user.profilePic} alt={user.name} className="h-10 w-10 rounded-full object-cover border border-gray-700" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/30">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-white font-bold text-base group-hover:text-blue-400 transition-colors">{user.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                          <p className="text-[10px] text-gray-600 font-mono mt-0.5">ID: {user.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>

                    {/* Tier */}
                    <td className="p-5">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center w-max ${
                        user.tier === 'VIP' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                        user.tier === 'Gold' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                        user.tier === 'Silver' ? 'bg-gray-500/10 text-gray-300 border-gray-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {user.tier === 'VIP' && <span className="mr-1">👑</span>}
                        {user.tier}
                      </span>
                    </td>

                    {/* Total Spent */}
                    <td className="p-5">
                      <p className="text-emerald-400 font-bold text-base mb-0.5">{user.spent}</p>
                      <p className="text-xs text-gray-500">{user.orders} lifetime orders</p>
                    </td>

                    {/* Joined */}
                    <td className="p-5 text-gray-400">{user.joined}</td>

                    {/* Actions */}
                    <td className="p-5 text-center">
                      <button className="bg-[#111827] border border-gray-700 hover:border-blue-500 hover:text-blue-400 text-gray-400 p-2 rounded-lg transition-all shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
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

export default Users;