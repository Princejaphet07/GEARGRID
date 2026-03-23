// src/pages/Settings.jsx
function Settings() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Store Settings</h1>
        <p className="text-gray-400 text-sm">Configure your store profile, notifications, and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* General Information Card */}
          <div className="bg-[#1f2937] border border-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              General Information
            </h2>
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Store Name</label>
                  <input type="text" defaultValue="GearGrid Auto" className="w-full bg-[#111827] text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Support Email</label>
                  <input type="email" defaultValue="support@geargrid.com" className="w-full bg-[#111827] text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Store Address</label>
                <input type="text" defaultValue="123 Performance Way, Cebu City, Philippines" className="w-full bg-[#111827] text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
              </div>
              <div className="pt-2">
                <button type="button" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                  Save General Settings
                </button>
              </div>
            </form>
          </div>

          {/* Admin Security Card */}
          <div className="bg-[#1f2937] border border-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Admin Security
            </h2>
            <form className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-[#111827] text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">New Password</label>
                  <input type="password" placeholder="Create new password" className="w-full bg-[#111827] text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Confirm Password</label>
                  <input type="password" placeholder="Confirm new password" className="w-full bg-[#111827] text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" />
                </div>
              </div>
              <div className="pt-2">
                <button type="button" className="bg-[#111827] border border-gray-700 hover:border-purple-500 text-white hover:text-purple-400 px-6 py-2.5 rounded-xl text-sm font-bold transition-all">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Toggles / Preferences */}
        <div className="space-y-6">
          <div className="bg-[#1f2937] border border-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-6">Preferences</h2>
            
            <div className="space-y-6">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white text-sm">Order Notifications</p>
                  <p className="text-xs text-gray-500">Receive email on new orders.</p>
                </div>
                <div className="w-11 h-6 bg-blue-600 rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(37,99,235,0.3)]">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                </div>
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white text-sm">Low Stock Alerts</p>
                  <p className="text-xs text-gray-500">Alert when inventory is {'<'} 10.</p>
                </div>
                <div className="w-11 h-6 bg-blue-600 rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(37,99,235,0.3)]">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                </div>
              </div>

              {/* Toggle 3 */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-400 text-sm">Maintenance Mode</p>
                  <p className="text-xs text-gray-500">Disable store checkout.</p>
                </div>
                <div className="w-11 h-6 bg-gray-700 rounded-full relative cursor-pointer border border-gray-600">
                  <div className="w-4 h-4 bg-gray-400 rounded-full absolute left-1 top-1"></div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Settings;