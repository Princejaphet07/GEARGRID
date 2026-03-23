import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { db, auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState(''); 
  const [isUploading, setIsUploading] = useState(false); 
  const [isSaving, setIsSaving] = useState(false); 
  
  // MGA BAG-ONG STATE PARA SA CLEAN ALERT (TOAST)
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); 
  
  const fileInputRef = useRef(null);

  const CLOUD_NAME = "djhtu0rzz"; 
  const UPLOAD_PRESET = "geargrid"; 

  // Function para mo-trigger sa atong nindot nga alert
  const triggerToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setName(docSnap.data().name || '');
          setProfilePic(docSnap.data().profilePic || ''); 
        }
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const docRef = doc(db, "users", currentUser.uid);
      
      await setDoc(docRef, { 
        name: name,
        email: currentUser.email 
      }, { merge: true });
      
      triggerToast("Profile successfully updated! 🎉");
    } catch (error) {
      console.error(error);
      triggerToast("Error saving profile. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.secure_url) {
        const docRef = doc(db, "users", currentUser.uid);
        
        await setDoc(docRef, { profilePic: data.secure_url }, { merge: true });
        
        setProfilePic(data.secure_url);
        triggerToast("Profile picture updated! 📸");
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
      triggerToast("Failed to upload image.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    if(window.confirm("Are you sure you want to sign out?")) {
      await signOut(auth);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen pt-12 pb-24 px-4 bg-[#0f1522] font-sans text-white flex justify-center items-start relative overflow-hidden">
      
      <div className="max-w-4xl w-full flex flex-col gap-6">
        
        {/* Main Profile Container */}
        <div className="bg-[#1a2235] rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl relative">
          
          {/* Banner / Cover Photo */}
          <div className="h-40 sm:h-48 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1600&q=80')] opacity-20 mix-blend-overlay object-cover"></div>
          </div>

          <div className="px-6 sm:px-10 pb-10 relative">
            
            {/* Header Actions (Sign Out & Avatar) */}
            <div className="flex justify-between items-start sm:items-end -mt-16 sm:-mt-20 mb-8 relative z-10">
              
              {/* Clickable Avatar */}
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#0f1522] border-[6px] border-[#1a2235] shadow-xl flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[10px] text-blue-500 font-bold tracking-wider uppercase">Uploading</span>
                    </div>
                  ) : profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl text-slate-500">👤</span>
                  )}

                  {!isUploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-sm font-bold flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Change
                      </span>
                    </div>
                  )}
                </div>
                {/* KANI ANG GI-FIX: Gidugangan og onChange={handleImageUpload} */}
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                />
              </div>

              {/* Sign Out Button */}
              <button 
                onClick={handleLogout} 
                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 mt-20 sm:mt-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>

            {/* Form Section */}
            <div className="bg-[#0f1522] rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-inner">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Personal Information
              </h2>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      value={currentUser?.email || ''} 
                      disabled 
                      className="w-full px-4 py-3 bg-[#1a2235] text-slate-500 border border-slate-700 rounded-xl cursor-not-allowed opacity-80" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="w-full px-4 py-3 bg-[#1a2235] text-white border border-slate-700 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all" 
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-6 mt-6 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
            
          </div>
        </div>

        {/* --- ACCOUNT DASHBOARD GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <Link to="/orders" className="bg-[#1a2235] hover:bg-[#1f2937] border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition-all group flex flex-col items-center text-center cursor-pointer shadow-lg">
            <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <h3 className="font-bold text-white text-lg">My Orders</h3>
            <p className="text-xs text-slate-400 mt-1">Track, return, or buy things again</p>
          </Link>

          <div className="bg-[#1a2235] hover:bg-[#1f2937] border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl transition-all group flex flex-col items-center text-center cursor-pointer shadow-lg">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
            </div>
            <h3 className="font-bold text-white text-lg">My Vouchers</h3>
            <p className="text-xs text-slate-400 mt-1">View your saved discounts</p>
          </div>

          <div className="bg-[#1a2235] hover:bg-[#1f2937] border border-slate-800 hover:border-purple-500/50 p-6 rounded-2xl transition-all group flex flex-col items-center text-center cursor-pointer shadow-lg">
            <div className="w-14 h-14 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <h3 className="font-bold text-white text-lg">Addresses</h3>
            <p className="text-xs text-slate-400 mt-1">Manage delivery locations</p>
          </div>

        </div>
      </div>

      {/* CLEAN ALERT / TOAST UI */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className={`border px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 ${toastType === 'success' ? 'bg-[#1a2235] border-[#232d40]' : 'bg-[#1a2235] border-red-900/50'}`}>
          <div className={`p-2 rounded-xl flex-shrink-0 ${toastType === 'success' ? 'bg-blue-500/20 text-blue-500' : 'bg-red-500/20 text-red-500'}`}>
            {toastType === 'success' ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">{toastType === 'success' ? 'Success' : 'Error'}</h4>
            <p className="text-xs text-slate-400">{toastMessage}</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Profile;