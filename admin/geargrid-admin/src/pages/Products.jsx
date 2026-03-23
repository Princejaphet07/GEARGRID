import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, updateDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editId, setEditId] = useState(null); 
  
  // ADDED: description to initial state
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", "geargrid");

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/djhtu0rzz/image/upload`, {
        method: "POST",
        body: uploadData,
      });
      const data = await response.json();
      if (data.secure_url) {
        setFormData({ ...formData, image: data.secure_url });
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      alert("Please upload a product image.");
      return;
    }

    setIsSaving(true);
    const stockNum = Number(formData.stock);
    const productData = {
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      stock: stockNum,
      description: formData.description, // ADDED: saving description
      status: stockNum > 10 ? 'In Stock' : stockNum > 0 ? 'Low Stock' : 'Out of Stock',
      image: formData.image,
      updatedAt: new Date()
    };

    try {
      if (editId) {
        await updateDoc(doc(db, "products", editId), productData);
        alert("Product successfully updated! ✅");
      } else {
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: new Date()
        });
        alert("Product successfully added! ✅");
      }
      closeForm();
    } catch (error) {
      console.error("Error saving product: ", error);
      alert("Error saving product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      image: product.image,
      description: product.description || '' // ADDED: loading description
    });
    setEditId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "products", id));
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormData(initialFormState);
  };

  const totalProducts = products.length;
  const lowStockItems = products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 10).length;
  const outOfStockItems = products.filter(p => Number(p.stock) === 0).length;

  return (
    <div className="p-4 sm:p-8 min-h-screen text-gray-200 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Product Inventory</h1>
          <p className="text-sm text-gray-400 mt-1">Monitor your stock, track performance, and manage catalog.</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Add Product
          </button>
        )}
      </div>

      {showForm ? (
        <div className="max-w-4xl">
          <button onClick={closeForm} className="text-sm text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Inventory
          </button>

          <form onSubmit={handleSaveProduct} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-700">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    General Information
                  </h2>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Product Title</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. High Performance Brake Pads" className="w-full bg-[#111827] text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                  </div>
                  {/* ADDED: Description Textarea */}
                  <div className="mt-4">
                    <label className="block text-sm text-gray-400 mb-1">Product Description</label>
                    <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Detailed description of the product..." className="w-full bg-[#111827] text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"></textarea>
                  </div>
                </div>

                <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-700">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    Media & Gallery
                  </h2>
                  <div onClick={() => fileInputRef.current.click()} className="w-full h-40 border-2 border-dashed border-gray-600 hover:border-blue-500 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-[#111827] overflow-hidden transition-all group">
                    {isUploading ? (
                      <span className="text-blue-500 font-medium animate-pulse">Uploading Image...</span>
                    ) : formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-contain p-2" />
                    ) : (
                      <div className="text-center">
                        <svg className="w-10 h-10 text-gray-500 group-hover:text-blue-500 mx-auto mb-2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                        <span className="text-sm text-gray-400 group-hover:text-gray-300">Click to upload image</span>
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-700">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Pricing & Inventory
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Price ($)</label>
                      <input type="number" required step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-[#111827] text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Stock Quantity</label>
                      <input type="number" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full bg-[#111827] text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-700">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    Organization
                  </h2>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-[#111827] text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:border-blue-500 appearance-none">
                      <option>Engine</option>
                      <option>Brakes</option>
                      <option>Fluids</option>
                      <option>Tires</option>
                      <option>Accessories</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button type="button" onClick={closeForm} className="px-6 py-2.5 rounded-lg font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors">Cancel</button>
              <button type="submit" disabled={isSaving || isUploading} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50">
                {isSaving ? "Saving..." : editId ? "Update Product" : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Total Products</p>
                <h3 className="text-3xl font-bold text-white">{totalProducts}</h3>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
              </div>
            </div>
            
            <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Low Stock Items</p>
                <h3 className="text-3xl font-bold text-orange-400">{lowStockItems}</h3>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-lg text-orange-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
            </div>

            <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Out of Stock</p>
                <h3 className="text-3xl font-bold text-red-500">{outOfStockItems}</h3>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg text-red-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
          </div>

          <div className="bg-[#1f2937] border border-gray-700 rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-[#1f2937]">
              <h2 className="text-lg font-semibold text-white">Stock Details</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-[#111827] text-gray-400 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">Product Name</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">Stock</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {products.length === 0 ? (
                    <tr><td colSpan="6" className="text-center p-8 text-gray-500">No products available. Add one to get started.</td></tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-[#111827] border border-gray-600 flex-shrink-0 flex items-center justify-center p-1">
                              <img src={product.image} className="max-w-full max-h-full object-contain rounded" alt={product.name} />
                            </div>
                            <span className="font-semibold text-white truncate max-w-[200px]">{product.name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full font-medium">{product.category}</span>
                        </td>
                        <td className="p-4 text-gray-300 font-medium">${Number(product.price).toFixed(2)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div className={`h-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}></div>
                            </div>
                            <span className="text-gray-300 text-sm w-6">{product.stock}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`flex items-center gap-1.5 text-sm font-medium ${product.stock > 10 ? 'text-green-400' : product.stock > 0 ? 'text-orange-400' : 'text-red-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-green-400' : product.stock > 0 ? 'bg-orange-400' : 'bg-red-400'}`}></span>
                            {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center items-center gap-3">
                            <button onClick={() => handleEdit(product)} className="text-gray-400 hover:text-blue-400 transition-colors" title="Edit">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
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
          </div>
        </>
      )}
    </div>
  );
}

export default Products;