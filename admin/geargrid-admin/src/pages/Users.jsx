import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; 

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // BAG-O: State para sa Toast Notification
  const [toastMessage, setToastMessage] = useState('');

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
            spent: data.spent || '₱0.00',
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

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // BAG-O: Function inig tuslok sa Action Button
  const handleUserAction = (userName) => {
    setToastMessage(`Viewing options for customer: ${userName}`);
    setTimeout(() => setToastMessage(''), 3000); // Mawala after 3 seconds
  };

  return (
    <div className="min-h-screen bg-[#0f1522] font-sans p-6 lg:p-10 text-slate-300 relative z-0 overflow-hidden">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Customers</h1>
            <p className="text-slate-400 text-sm">Manage registered users, view purchase history and tiers.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search by name or email..." 
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
                  <th className="p-5 font-bold">User Information</th>
                  <th className="p-5 font-bold">Loyalty Tier</th>
                  <th className="p-5 font-bold">Total Spent</th>
                  <th className="p-5 font-bold">Joined</th>
                  <th className="p-5 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-slate-400">
                      <div className="flex justify-center items-center gap-3">
                        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        Loading users...
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-slate-400">No users found.</td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-5 flex items-center gap-4">
                        {user.profilePic ? (
                          <img src={user.profilePic} alt={user.name} className="w-12 h-12 rounded-full object-cover border border-white/20 shadow-sm" />
                        ) : (
                          <div className="w-12 h-12 bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-xl shadow-sm">👤</div>
                        )}
                        <div>
                          <p className="font-bold text-white text-sm">{user.name}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          user.tier === 'VIP' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                          user.tier === 'Gold' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                          user.tier === 'Silver' ? 'bg-slate-400/10 text-slate-300 border-slate-400/30' :
                          'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        }`}>
                          {user.tier}
                        </span>
                      </td>
                      <td className="p-5">
                        <p className="text-emerald-400 font-bold text-base mb-0.5">{user.spent}</p>
                        <p className="text-xs text-slate-500">{user.orders} lifetime orders</p>
                      </td>
                      <td className="p-5 text-slate-300 text-sm font-medium">{user.joined}</td>
                      <td className="p-5 text-center">
                        {/* BAG-O: Gidugangan og onClick */}
                        <button 
                          onClick={() => handleUserAction(user.name)}
                          className="bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-500 hover:text-white text-slate-300 p-2.5 rounded-xl transition-all shadow-sm backdrop-blur-sm active:scale-95"
                        >
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

      {/* INTERACTIVE TOAST NOTIFICATION */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform ${toastMessage ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-[#1a2235]/90 backdrop-blur-xl border border-white/10 text-white px-5 py-4 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] flex items-center gap-4">
          <div className="bg-blue-500/20 text-blue-400 p-2 rounded-xl flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h4 className="font-bold text-sm">Action Triggered</h4>
            <p className="text-xs text-slate-400">{toastMessage}</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Users;