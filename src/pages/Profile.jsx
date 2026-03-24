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
  
  // States para sa Toast Notification
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); 
  
  const fileInputRef = useRef(null);

  // Ilisi ni sa imong saktong Cloudinary details kung lahi
  const CLOUD_NAME = "djhtu0rzz"; 
  const UPLOAD_PRESET = "geargrid"; 

  const triggerToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setName(docSnap.data().name || '');
            setProfilePic(docSnap.data().profilePic || '');
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('cloud_name', CLOUD_NAME);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setProfilePic(data.secure_url);
      triggerToast("Profile picture uploaded!");
    } catch (err) {
      console.error(err);
      triggerToast("Failed to upload image.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        name,
        profilePic,
        email: currentUser.email
      }, { merge: true });
      triggerToast("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      triggerToast("Failed to update profile.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      triggerToast("Error logging out.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1522] pt-8 pb-12 px-4 font-sans relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        <h1 className="text-3xl font-black text-white mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Editor Card */}
          <div className="lg:col-span-1 bg-[#1a2235] border border-[#232d40] rounded-3xl p-6 shadow-xl h-max">
            <div className="flex flex-col items-center text-center">
              
              {/* Profile Image Area */}
              <div className="relative mb-6 group">
                <div className="w-32 h-32 rounded-full border-4 border-[#232d40] bg-[#0f1522] overflow-hidden shadow-inner flex items-center justify-center relative z-10">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-16 h-16 text-slate-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                {/* Edit Icon Overlay */}
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-full shadow-lg transition-all z-20 active:scale-95"
                  title="Change Picture"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              </div>

              {/* Name & Email Fields */}
              <div className="w-full space-y-4">
                <div className="text-left">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Display Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Enter your name"
                    className="w-full bg-[#0f1522] border border-[#232d40] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-center font-bold"
                  />
                </div>
                <div className="text-left">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={currentUser?.email || ''} 
                    disabled
                    className="w-full bg-[#0f1522]/50 border border-[#232d40] text-slate-500 rounded-xl px-4 py-3 cursor-not-allowed text-center text-sm"
                  />
                </div>
                
                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving || isUploading}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all active:scale-95"
                >
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links Menu */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            
            {/* LINK 1: My Addresses (Gihimo ng Clickable!) */}
            <Link to="/addresses" className="bg-[#1a2235] hover:bg-[#232d40] border border-[#232d40] rounded-2xl p-6 transition-all group flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">My Addresses</h3>
                  <p className="text-sm text-slate-400">Manage delivery locations</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>

            {/* LINK 2: My Orders */}
            <Link to="/orders" className="bg-[#1a2235] hover:bg-[#232d40] border border-[#232d40] rounded-2xl p-6 transition-all group flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">My Orders</h3>
                  <p className="text-sm text-slate-400">Track, return, or buy things again</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>

            {/* LINK 3: Vouchers */}
            <Link to="/vouchers" className="bg-[#1a2235] hover:bg-[#232d40] border border-[#232d40] rounded-2xl p-6 transition-all group flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-purple-500/10 text-purple-400 rounded-full flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">My Vouchers</h3>
                  <p className="text-sm text-slate-400">View discounts and promos</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="mt-4 w-full bg-[#1a2235] hover:bg-red-500/10 border border-[#232d40] hover:border-red-500/30 text-red-500 rounded-2xl p-4 transition-all flex items-center justify-center gap-3 font-bold active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Sign Out
            </button>

          </div>
        </div>
      </div>

      {/* CLEAN TOAST NOTIFICATION */}
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
            <h4 className={`font-bold text-sm ${toastType === 'success' ? 'text-white' : 'text-red-400'}`}>
              {toastType === 'success' ? 'Success' : 'Error'}
            </h4>
            <p className="text-slate-400 text-xs mt-0.5">{toastMessage}</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Profile;