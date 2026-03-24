import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const navigate = useNavigate();

  // BAG-O: Interactive States para sa Toggles ug Buttons
  const [emailNotif, setEmailNotif] = useState(true);
  const [lowStock, setLowStock] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Function para inig Save
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setToastMessage('Settings successfully saved and updated!');
      setTimeout(() => setToastMessage(''), 3000);
    }, 1000); // Simulate saving for 1 second
  };

  // Function para inig Logout
  const handleLogout = () => {
    // Pwede nimo i-clear ang admin session diri kung naa man gani
    navigate('/adminlogin'); // I-route padulong sa Admin Login
  };

  return (
    <div className="min-h-screen bg-[#0f1522] font-sans p-6 lg:p-10 text-slate-300 relative z-0 overflow-hidden">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Store Settings</h1>
          <p className="text-slate-400 text-sm">Configure your store profile, notifications, and security features.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Side: Forms */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* General Information Card */}
            <div className="bg-[#1a2235]/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 border border-blue-500/20">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </div>
                General Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Store Name</label>
                  <input type="text" defaultValue="AutoParts Pro Shop" className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Support Email</label>
                  <input type="email" defaultValue="admin@autopartspro.com" className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Store Address</label>
                  <textarea rows="3" defaultValue="123 Motor Avenue, Auto District\nCebu City, Philippines" className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-all resize-none shadow-inner"></textarea>
                </div>
                
                {/* BAG-O: Interactive Save Button */}
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`font-bold py-3 px-6 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    isSaving 
                    ? 'bg-blue-600/50 text-white/70 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </div>

            {/* Payment & Currency Card */}
            <div className="bg-[#1a2235]/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 border border-emerald-500/20">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                Payment & Localization
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Currency</label>
                  <select className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer">
                    <option value="PHP" className="bg-[#1a2235]">PHP (₱) - Philippine Peso</option>
                    <option value="USD" className="bg-[#1a2235]">USD ($) - US Dollar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Timezone</label>
                  <select className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer">
                    <option value="Asia/Manila" className="bg-[#1a2235]">(GMT+08:00) Asia/Manila</option>
                    <option value="UTC" className="bg-[#1a2235]">UTC Standard Time</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side: Quick Settings */}
          <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-[#1a2235]/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] sticky top-6">
              <h3 className="text-lg font-bold text-white mb-6">System Preferences</h3>
              
              <div className="space-y-6">
                
                {/* BAG-O: Interactive Toggles */}
                
                {/* Toggle 1: Email Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-sm">Email Notifications</p>
                    <p className="text-xs text-slate-400">Receive alerts on new orders.</p>
                  </div>
                  <div 
                    onClick={() => setEmailNotif(!emailNotif)} 
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${emailNotif ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-white/10 border border-white/10'}`}
                  >
                    <div className={`w-4 h-4 rounded-full absolute top-1 transition-all duration-300 ${emailNotif ? 'right-1 bg-white' : 'left-1 bg-slate-400'}`}></div>
                  </div>
                </div>

                {/* Toggle 2: Low Stock Alerts */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-sm">Low Stock Alerts</p>
                    <p className="text-xs text-slate-400">Alert when inventory is {'<'} 10.</p>
                  </div>
                  <div 
                    onClick={() => setLowStock(!lowStock)} 
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${lowStock ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-white/10 border border-white/10'}`}
                  >
                    <div className={`w-4 h-4 rounded-full absolute top-1 transition-all duration-300 ${lowStock ? 'right-1 bg-white' : 'left-1 bg-slate-400'}`}></div>
                  </div>
                </div>

                {/* Toggle 3: Maintenance Mode */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <p className="font-bold text-slate-300 text-sm">Maintenance Mode</p>
                    <p className="text-xs text-slate-500">Disable store checkout.</p>
                  </div>
                  <div 
                    onClick={() => setMaintenance(!maintenance)} 
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${maintenance ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]' : 'bg-white/10 border border-white/10'}`}
                  >
                    <div className={`w-4 h-4 rounded-full absolute top-1 transition-all duration-300 ${maintenance ? 'right-1 bg-white' : 'left-1 bg-slate-400'}`}></div>
                  </div>
                </div>
                
                {/* BAG-O: Working Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="w-full mt-4 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/20 font-bold py-3 px-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Admin Logout
                </button>

              </div>
            </div>

          </div>

        </div>
      </div>

      {/* INTERACTIVE TOAST NOTIFICATION */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform ${toastMessage ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-[#1a2235]/90 backdrop-blur-xl border border-white/10 text-white px-5 py-4 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] flex items-center gap-4">
          <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-xl flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <div>
            <h4 className="font-bold text-sm">Success</h4>
            <p className="text-xs text-slate-400">{toastMessage}</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Settings;