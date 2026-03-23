import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, query, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

function Addresses() {
  const { currentUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    label: 'Home',
    fullName: '',
    phone: '',
    fullAddress: '',
    city: ''
  });

  const fetchAddresses = async () => {
    if (!currentUser) return;
    try {
      const q = query(collection(db, "users", currentUser.uid, "addresses"));
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAddresses(fetched);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await addDoc(collection(db, "users", currentUser.uid, "addresses"), formData);
      setShowForm(false);
      setFormData({ label: 'Home', fullName: '', phone: '', fullAddress: '', city: '' });
      fetchAddresses(); 
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteDoc(doc(db, "users", currentUser.uid, "addresses", id));
        setAddresses(addresses.filter(addr => addr.id !== id));
      } catch (error) {
        console.error("Error deleting address:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1522] py-10 pb-24 text-gray-200 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/profile" className="hover:text-white transition-colors">Profile</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            <span className="text-gray-300">My Addresses</span>
          </div>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Saved Addresses</h1>
            {!showForm && (
              <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-5 rounded-lg text-sm transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                Add New
              </button>
            )}
          </div>
        </div>

        {showForm ? (
          <div className="bg-[#1a2235] border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-8 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-6">New Delivery Address</h2>
            <form onSubmit={handleSave} className="space-y-5">
              
              <div className="flex gap-3 mb-4">
                <button type="button" onClick={() => setFormData({...formData, label: 'Home'})} className={`px-5 py-2 rounded-full text-sm font-bold border transition-colors ${formData.label === 'Home' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}>Home</button>
                <button type="button" onClick={() => setFormData({...formData, label: 'Office'})} className={`px-5 py-2 rounded-full text-sm font-bold border transition-colors ${formData.label === 'Office' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}>Office</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Full Name</label>
                  <input required type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full bg-[#111827] border border-gray-700 focus:border-blue-500 rounded-xl px-4 py-3 text-white focus:outline-none transition-all" placeholder="Receiver's name" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Phone Number</label>
                  <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#111827] border border-gray-700 focus:border-blue-500 rounded-xl px-4 py-3 text-white focus:outline-none transition-all" placeholder="0912 345 6789" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Complete Address</label>
                  <input required type="text" value={formData.fullAddress} onChange={(e) => setFormData({...formData, fullAddress: e.target.value})} className="w-full bg-[#111827] border border-gray-700 focus:border-blue-500 rounded-xl px-4 py-3 text-white focus:outline-none transition-all" placeholder="Street Name, Building, House No." />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">City / Province</label>
                  <input required type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full bg-[#111827] border border-gray-700 focus:border-blue-500 rounded-xl px-4 py-3 text-white focus:outline-none transition-all" placeholder="e.g., Cebu City" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">Cancel</button>
                <button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl font-bold transition-colors disabled:opacity-50">
                  {isSaving ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {!showForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {loading ? (
              <div className="col-span-2 text-center py-10 text-gray-500">Loading addresses...</div>
            ) : addresses.length === 0 ? (
              <div className="col-span-2 bg-[#1a2235] border border-gray-800 rounded-2xl p-12 text-center">
                <span className="text-5xl block mb-4">📍</span>
                <h3 className="text-xl font-bold text-white mb-2">No addresses saved</h3>
                <p className="text-gray-400">Add a delivery address to make checkout faster.</p>
              </div>
            ) : (
              addresses.map((address) => (
                <div key={address.id} className="bg-[#1a2235] border border-gray-800 hover:border-gray-600 rounded-2xl p-6 transition-colors relative group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-blue-500/10 text-blue-400 text-xs font-black uppercase px-2.5 py-1 rounded-full">{address.label}</span>
                    <button onClick={() => handleDelete(address.id)} className="text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100" title="Delete">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{address.fullName}</h3>
                  <p className="text-sm text-gray-400 mb-2">{address.phone}</p>
                  <p className="text-sm text-gray-300 leading-relaxed">{address.fullAddress}, {address.city}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
      `}} />
    </div>
  );
}

export default Addresses;