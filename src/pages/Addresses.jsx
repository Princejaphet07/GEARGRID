import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore'; 
import { db } from '../firebase';
import { Link } from 'react-router-dom';

function Addresses() {
  const { currentUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States para sa Form
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    barangay: '',
    city: '',
    postalCode: '',
    isDefault: false
  });

  // States para sa Toast (Kinopya gikan sa Profile.jsx)
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const triggerToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Fetch Addresses
  const fetchAddresses = async () => {
    if (!currentUser) return;
    try {
      const q = query(collection(db, 'users', currentUser.uid, 'addresses'), orderBy('isDefault', 'desc'));
      const querySnapshot = await getDocs(q);
      const addressList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAddresses(addressList);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      triggerToast("Failed to load addresses.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [currentUser]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Save New Address
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Kung naka-default ni, i-false ang ubang address
      if (formData.isDefault) {
        for (let addr of addresses) {
          if (addr.isDefault) {
            await updateDoc(doc(db, 'users', currentUser.uid, 'addresses', addr.id), { isDefault: false });
          }
        }
      }

      // Default kung siya ray pinaka-unang address
      const willBeDefault = addresses.length === 0 ? true : formData.isDefault;

      await addDoc(collection(db, 'users', currentUser.uid, 'addresses'), {
        ...formData,
        isDefault: willBeDefault
      });

      triggerToast("Address added successfully!");
      setShowForm(false);
      setFormData({ fullName: '', phone: '', street: '', barangay: '', city: '', postalCode: '', isDefault: false });
      fetchAddresses();
    } catch (error) {
      console.error("Error saving address:", error);
      triggerToast("Error saving address.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Address
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'addresses', id));
      triggerToast("Address deleted!");
      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      triggerToast("Error deleting address.", "error");
    }
  };

  // Set as Default
  const handleSetDefault = async (id) => {
    try {
      // Unset current default
      for (let addr of addresses) {
        if (addr.isDefault) {
          await updateDoc(doc(db, 'users', currentUser.uid, 'addresses', addr.id), { isDefault: false });
        }
      }
      // Set new default
      await updateDoc(doc(db, 'users', currentUser.uid, 'addresses', id), { isDefault: true });
      triggerToast("Default address updated!");
      fetchAddresses();
    } catch (error) {
      console.error("Error setting default:", error);
      triggerToast("Error setting default address.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1522] pt-8 pb-12 px-4 font-sans relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header & Back Button */}
        <div className="mb-8">
          <Link to="/profile" className="inline-flex items-center text-slate-400 hover:text-blue-400 transition-colors mb-4 text-sm font-bold">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Profile
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-white mb-2">My Addresses</h1>
              <p className="text-slate-400">Manage your delivery and billing locations.</p>
            </div>
            <button 
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add New
            </button>
          </div>
        </div>

        {/* Address List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-[#1a2235] border border-[#232d40] rounded-[2rem] p-12 text-center shadow-xl">
            <div className="w-20 h-20 bg-[#0f1522] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#232d40]">
              <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No addresses found</h3>
            <p className="text-slate-400 mb-6">You haven't added any addresses yet.</p>
            <button onClick={() => setShowForm(true)} className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
              + Add your first address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((addr) => (
              <div key={addr.id} className={`bg-[#1a2235] border ${addr.isDefault ? 'border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.1)]' : 'border-[#232d40]'} rounded-2xl p-6 relative group transition-all`}>
                
                {addr.isDefault && (
                  <span className="absolute top-4 right-4 bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
                    Default
                  </span>
                )}

                <h3 className="text-lg font-bold text-white mb-1">{addr.fullName}</h3>
                <p className="text-slate-400 text-sm mb-4">{addr.phone}</p>
                
                <div className="text-slate-300 text-sm space-y-1 mb-6">
                  <p>{addr.street}</p>
                  <p>Brgy. {addr.barangay}, {addr.city}</p>
                  <p>{addr.postalCode}</p>
                </div>

                <div className="flex items-center gap-3 border-t border-[#232d40] pt-4">
                  {!addr.isDefault && (
                    <button onClick={() => handleSetDefault(addr.id)} className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
                      Set as Default
                    </button>
                  )}
                  <button onClick={() => handleDelete(addr.id)} className="text-sm text-red-400 hover:text-red-300 transition-colors font-medium ml-auto">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Address Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1a2235] border border-[#232d40] rounded-[2rem] p-8 w-full max-w-lg shadow-2xl relative animate-[fadeIn_0.2s_ease-out]">
              <h2 className="text-2xl font-bold text-white mb-6">Add New Address</h2>
              
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full bg-[#0f1522] border border-[#232d40] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="Juan Dela Cruz"/>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full bg-[#0f1522] border border-[#232d40] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="09XX XXX XXXX"/>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Street Name, Bldg, House No.</label>
                    <input type="text" name="street" value={formData.street} onChange={handleChange} required className="w-full bg-[#0f1522] border border-[#232d40] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="123 Mabini St."/>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Barangay</label>
                    <input type="text" name="barangay" value={formData.barangay} onChange={handleChange} required className="w-full bg-[#0f1522] border border-[#232d40] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="Brgy. Lahug"/>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full bg-[#0f1522] border border-[#232d40] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="Cebu City"/>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Postal Code</label>
                    <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required className="w-full bg-[#0f1522] border border-[#232d40] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="6000"/>
                  </div>
                  
                  <div className="col-span-2 flex items-center gap-3 mt-2">
                    <input type="checkbox" name="isDefault" id="isDefault" checked={formData.isDefault} onChange={handleChange} className="w-5 h-5 rounded bg-[#0f1522] border-[#232d40] text-blue-500 focus:ring-blue-500 focus:ring-offset-[#1a2235] cursor-pointer"/>
                    <label htmlFor="isDefault" className="text-sm font-medium text-slate-300 cursor-pointer">Set as default address</label>
                  </div>
                </div>

                <div className="flex gap-4 mt-8 pt-4 border-t border-[#232d40]">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-[#0f1522] border border-[#232d40] text-slate-300 py-3 rounded-xl font-bold hover:bg-white/5 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSaving} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all disabled:opacity-50">
                    {isSaving ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* TOAST NOTIFICATION (Kinopya sa Profile) */}
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

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}} />
    </div>
  );
}

export default Addresses;