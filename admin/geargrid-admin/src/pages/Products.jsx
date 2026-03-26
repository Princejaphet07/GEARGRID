import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, updateDoc, onSnapshot, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editId, setEditId] = useState(null); 
  
  // Search, Filter, and Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // MAXIMUM 5 ITEMS PER PAGE

  // Toast States
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Delete Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const initialFormState = { name: '', category: 'Engine', price: '', stock: '', image: '', description: '' };
  const [formData, setFormData] = useState(initialFormState);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productList);
    });
    return () => unsubscribe();
  }, []);

  // Reset to Page 1 kung mag-search o mag-filter para dili masaag
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const showNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    // FIXED: Changed preset to "geargrid" to match your Cloudinary dashboard!
    uploadData.append("upload_preset", "geargrid"); 
    uploadData.append("cloud_name", "djhtu0rzz"); 
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/djhtu0rzz/image/upload", {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();
      
      if (data.secure_url) {
        setFormData({ ...formData, image: data.secure_url });
        showNotification("Image uploaded successfully!");
      } else {
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }
    } catch (err) {
      console.error("Cloudinary Error:", err);
      showNotification("Failed to upload image. Check Cloudinary unsigned preset.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Prevent saving 'undefined' to Firebase
      const productData = { ...formData };
      if (!productData.image) productData.image = "";

      if (editId) {
        const productRef = doc(db, "products", editId);
        await updateDoc(productRef, {
          ...productData,
          updatedAt: serverTimestamp()
        });
        showNotification("Product updated successfully!");
      } else {
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: serverTimestamp() // Fixes the Home page empty issue!
        });
        showNotification("Product added successfully!");
      }
      handleCloseForm();
    } catch (error) {
      console.error("Error saving product:", error);
      showNotification("Failed to save product.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditId(product.id);
    setShowForm(true);
  };

  const confirmDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      showNotification("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      showNotification("Failed to delete product.", "error");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData(initialFormState);
    setEditId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Filtering Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const categories = ['All', 'Engine', 'Electrical', 'Accessories', 'Transmission', 'Brake'];

  return (
    <div className="min-h-screen bg-[#0f1522] font-sans p-6 lg:p-10 text-slate-300 relative z-0 overflow-hidden">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Manage Products</h1>
            <p className="text-slate-400 text-sm">Add, edit, or remove motor parts from your inventory.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Category Filter */}
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all shadow-lg"
            >
              {categories.map(cat => <option key={cat} value={cat} className="bg-[#1a2235] text-white">{cat}</option>)}
            </select>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder-slate-400 shadow-lg"
              />
            </div>

            {/* Add New Button */}
            <button 
              onClick={() => setShowForm(true)} 
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Product
            </button>
          </div>
        </div>

        {/* GLASS TABLE */}
        <div className="bg-[#1a2235]/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-slate-300 text-xs uppercase tracking-wider border-b border-white/10">
                  <th className="p-5 font-bold">Product Info</th>
                  <th className="p-5 font-bold">Category</th>
                  <th className="p-5 font-bold">Price</th>
                  <th className="p-5 font-bold">Stock</th>
                  <th className="p-5 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentItems.length === 0 ? (
                  <tr><td colSpan="5" className="p-10 text-center text-slate-400">No products found.</td></tr>
                ) : (
                  currentItems.map(product => (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                      
                      {/* Product Info */}
                      <td className="p-5 flex items-center gap-5">
                        {product.image ? (
                           <img src={product.image} alt={product.name} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl border border-white/10 shadow-md" />
                        ) : (
                           <div className="w-20 h-20 md:w-24 md:h-24 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-500 text-3xl">🧩</div>
                        )}
                        <div>
                          <p className="font-bold text-white text-base md:text-lg line-clamp-1">{product.name}</p>
                          <p className="text-xs text-slate-400 line-clamp-2 w-48 md:w-64 mt-1" title={product.description}>{product.description || "No description"}</p>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-5">
                        <span className="bg-white/10 border border-white/10 text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="p-5 font-bold text-emerald-400 text-lg">
                        ₱{Number(product.price).toLocaleString()}
                      </td>

                      {/* Stock */}
                      <td className="p-5">
                         <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                            Number(product.stock) > 10 ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 
                            Number(product.stock) > 0 ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30' : 
                            'bg-red-500/10 text-red-300 border-red-500/30'
                          }`}>
                            {product.stock} in stock
                          </span>
                      </td>

                      {/* Actions */}
                      <td className="p-5 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button onClick={() => handleEdit(product)} className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500 hover:text-white transition-all flex justify-center items-center backdrop-blur-sm" title="Edit">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          </button>
                          <button onClick={() => setDeleteConfirmId(product.id)} className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all flex justify-center items-center backdrop-blur-sm" title="Delete">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION UI */}
          <div className="p-5 border-t border-white/10 bg-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs text-slate-400">
              Showing <span className="font-bold text-white">{filteredProducts.length === 0 ? 0 : indexOfFirstItem + 1}</span> to <span className="font-bold text-white">{Math.min(indexOfLastItem, filteredProducts.length)}</span> of <span className="font-bold text-white">{filteredProducts.length}</span> products
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  Previous
                </button>
                
                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                      currentPage === index + 1 
                        ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)] border border-blue-500' 
                        : 'text-slate-400 hover:bg-white/10 hover:text-white border border-transparent'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ADD / EDIT GLASS MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f1522]/90 backdrop-blur-2xl border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-xl font-bold text-white">{editId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={handleCloseForm} className="text-slate-400 hover:text-white bg-white/5 hover:bg-red-500/80 p-2 rounded-xl transition-colors border border-white/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Image Upload Area */}
              <div className="flex items-center gap-5 bg-white/5 p-4 rounded-2xl border border-white/10">
                 {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-24 h-24 rounded-xl object-cover border border-white/20 shadow-md" />
                 ) : (
                    <div className="w-24 h-24 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-slate-400 text-3xl">🖼</div>
                 )}
                 <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-400 mb-2">Product Image</label>
                    <input 
                      type="file" 
                      onChange={handleImageUpload} 
                      ref={fileInputRef} 
                      className="block w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 transition-all cursor-pointer"
                      accept="image/*"
                    />
                 </div>
                 {isUploading && <div className="text-xs text-blue-400 animate-pulse font-bold">Uploading...</div>}
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Product Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-[#1a2235] border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500/50 transition-all appearance-none">
                    <option value="Engine">Engine</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Transmission">Transmission</option>
                    <option value="Brake">Brake</option>
                    
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Price (₱)</label>
                  <input type="number" required min="0" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Stock Quantity</label>
                  <input type="number" required min="0" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500/50 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Description</label>
                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-all resize-none" placeholder="Short product details..."></textarea>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button type="button" onClick={handleCloseForm} className="px-5 py-2.5 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all border border-transparent">Cancel</button>
                <button type="submit" disabled={isUploading || isSaving} className={`px-5 py-2.5 rounded-xl font-bold text-white transition-all shadow-lg ${isUploading || isSaving ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]'}`}>
                  {isSaving ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a2235]/90 backdrop-blur-2xl border border-red-500/30 rounded-3xl w-full max-w-sm p-6 shadow-[0_0_50px_rgba(239,68,68,0.2)] text-center">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Are you sure?</h3>
            <p className="text-sm text-slate-400 mb-6">This action cannot be undone. This product will be permanently deleted.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteConfirmId(null)} className="px-5 py-2.5 rounded-xl font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all">Cancel</button>
              <button onClick={() => confirmDelete(deleteConfirmId)} className="px-5 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* GLASS TOAST NOTIFICATION */}
      <div className={`fixed bottom-6 right-6 z-[80] transition-all duration-300 transform ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className={`border px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 bg-[#1a2235]/80 backdrop-blur-xl ${toastType === 'success' ? 'border-white/10' : 'border-red-500/30'}`}>
          <div className={`p-2 rounded-xl flex-shrink-0 ${toastType === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            {toastType === 'success' ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">{toastType === 'success' ? 'Success' : 'Error'}</h4>
            <p className="text-xs text-slate-300">{toastMessage}</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Products;