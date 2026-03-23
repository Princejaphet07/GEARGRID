import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import { useAuth } from '../context/AuthContext'; // BAG-O: Gidugang para makuha ang user info
import { collection, addDoc } from 'firebase/firestore'; // BAG-O: Para maka-save sa database
import { db } from '../firebase'; // BAG-O: Database connection

function Cart() {
  const { cartItems, removeFromCart } = useCart(); 
  const { currentUser } = useAuth(); // BAG-O: Pagkuha sa current user
  const navigate = useNavigate(); 
  
  // CHANGED: default payment is now 'cod' since gcash is removed
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [receiptImage, setReceiptImage] = useState(null);
  
  const [selectedItems, setSelectedItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [localQuantities, setLocalQuantities] = useState({});

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); 

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState(() => () => {});

  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // BAG-O: Para mag-loading inig place order

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSelectedItems(cartItems.map((_, index) => index));
    const initialQty = {};
    cartItems.forEach((item, index) => {
      initialQty[index] = item.quantity || 1;
    });
    setLocalQuantities(initialQty);
  }, [cartItems]);

  const subtotal = cartItems.reduce((acc, item, index) => {
    if (selectedItems.includes(index)) {
      return acc + (Number(item.price) * (localQuantities[index] || 1));
    }
    return acc;
  }, 0);
  
  const estimatedTax = subtotal * 0.08; 
  const total = subtotal + estimatedTax - discount;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setReceiptImage(URL.createObjectURL(file));
  };

  const canPlaceOrder = selectedItems.length > 0;

  const triggerToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleDelete = (index) => {
    setConfirmMessage("Are you sure you want to remove this item?");
    setOnConfirmAction(() => () => {
      removeFromCart(index);
      setSelectedItems(prev => prev.filter(i => i !== index));
      setShowConfirm(false);
    });
    setShowConfirm(true);
  };

  const handleDeleteSelected = () => {
    setConfirmMessage("Are you sure you want to remove the selected items?");
    setOnConfirmAction(() => () => {
      const sortedSelected = [...selectedItems].sort((a, b) => b - a);
      sortedSelected.forEach(index => removeFromCart(index));
      setSelectedItems([]);
      setShowConfirm(false);
    });
    setShowConfirm(true);
  };

  const toggleSelectItem = (index) => {
    setSelectedItems(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((_, index) => index));
    }
  };

  const updateQuantity = (index, delta) => {
    setLocalQuantities(prev => {
      const current = prev[index] || 1;
      const newQty = Math.max(1, current + delta);
      return { ...prev, [index]: newQty };
    });
  };

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'DISCOUNT20') {
      setDiscount(20);
      triggerToast("Promo code applied successfully!", "success");
    } else {
      setDiscount(0);
      triggerToast("Invalid promo code. Try 'DISCOUNT20'", "error");
    }
  };

  // BAG-O NGA CHECKOUT FUNCTION (MO-SEND DIRITSO SA ADMIN FIREBASE)
  const handleProceedToCheckout = async () => {
    if (!currentUser) {
      triggerToast("Please log in first to place an order.", "error");
      return;
    }

    const itemsToCheckout = selectedItems.map(index => ({
      ...cartItems[index],
      checkoutQuantity: localQuantities[index] || 1,
      cartIndex: index 
    }));

    if (itemsToCheckout.length === 0) return;

    setIsProcessing(true);

    try {
      await addDoc(collection(db, "orders"), {
        userId: currentUser.uid,
        customerEmail: currentUser.email,
        items: itemsToCheckout,
        subtotal: subtotal,
        tax: estimatedTax,
        discount: discount,
        total: total,
        paymentMethod: paymentMethod,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        orderDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });

      triggerToast("Order placed successfully! 🎉", "success");
      
      setTimeout(() => {
        navigate('/profile'); // Mo-redirect paingon sa profile ig human order
      }, 2000);

    } catch (error) {
      console.error("Error placing order:", error);
      triggerToast("Failed to place order. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#0f1522] min-h-screen py-10 pb-24 text-gray-200 font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            <span className="text-gray-300">Shopping Cart</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          
          <section className="lg:col-span-8 space-y-6">
            
            {cartItems.length > 0 && !loading && (
              <div className="flex justify-between items-center pb-4 border-b border-gray-800">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900 bg-gray-800 cursor-pointer" 
                  />
                  <span className="font-medium text-white group-hover:text-blue-400 transition-colors">Select All ({cartItems.length} items)</span>
                </label>
                
                {selectedItems.length > 0 && (
                  <button onClick={handleDeleteSelected} className="text-sm font-medium text-gray-400 hover:text-red-500 flex items-center gap-2 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    Delete Selected
                  </button>
                )}
              </div>
            )}

            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-[#1f2937] rounded-xl border border-gray-800 animate-pulse">
                    <div className="pt-1">
                      <div className="w-5 h-5 rounded bg-gray-700"></div>
                    </div>
                    <div className="w-24 h-24 bg-gray-700 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="h-5 bg-gray-700 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
                        <div className="h-6 bg-gray-700 rounded w-1/4"></div>
                      </div>
                      <div className="mt-4">
                        <div className="h-8 bg-gray-700 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : cartItems.length === 0 ? (
                <div className="bg-[#1f2937] border border-gray-800 rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Your cart is empty</h3>
                  <p className="text-gray-400 mb-6">Looks like you haven't added anything to your cart yet.</p>
                  <Link to="/parts" className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-6 rounded-lg transition-colors inline-block">Start Shopping</Link>
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <div key={index} className={`relative flex gap-4 p-5 bg-[#1f2937] rounded-xl border transition-colors ${selectedItems.includes(index) ? 'border-blue-500/50 bg-[#1f2937]/80' : 'border-gray-800'}`}>
                    
                    <div className="pt-1">
                      <input 
                        type="checkbox" 
                        checked={selectedItems.includes(index)}
                        onChange={() => toggleSelectItem(index)}
                        className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-800 cursor-pointer" 
                      />
                    </div>

                    <img src={item.image} className="w-24 h-24 object-cover rounded-lg bg-[#111827] border border-gray-700 p-1" alt={item.name} />
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="pr-8">
                        <h3 className="text-base font-bold text-white mb-1 line-clamp-2">{item.name}</h3>
                        <p className="text-sm text-gray-400 mb-1">Category: {item.category}</p>
                        <div className="flex items-end gap-2 mt-2">
                          <span className="text-lg font-bold text-blue-400">₱{Number(item.price).toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border border-gray-700 rounded-lg overflow-hidden w-fit bg-[#111827]">
                          <button onClick={() => updateQuantity(index, -1)} className="px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">-</button>
                          <span className="px-3 py-1 font-medium text-sm text-white border-x border-gray-700 min-w-[40px] text-center">{localQuantities[index]}</span>
                          <button onClick={() => updateQuantity(index, 1)} className="px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">+</button>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDelete(index)}
                      className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Payment Details */}
            {cartItems.length > 0 && !loading && (
              <div className="bg-[#1f2937] border border-gray-800 rounded-xl p-6 mt-6">
                <h2 className="text-lg font-bold text-white mb-4">Payment Details</h2>
                
                <div className="grid grid-cols-1 gap-4 mb-2">
                  <label className="relative p-4 rounded-xl border-2 border-blue-500 bg-blue-500/10 cursor-pointer">
                    <input type="radio" name="payment" value="cod" checked readOnly className="sr-only" />
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-xs">COD</div>
                      <div>
                        <span className="font-bold text-white">Cash on Delivery</span>
                        <p className="text-xs text-gray-400 mt-0.5">Pay when your order arrives</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </section>

          <section className="mt-8 lg:mt-0 lg:col-span-4 sticky top-6">
            <div className="bg-[#1f2937] border border-gray-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-bold text-white mb-6">Order Summary</h2>
              
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Promotions</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Voucher Code" 
                    className="w-full bg-[#111827] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <button onClick={applyPromo} className="bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors">Apply</button>
                </div>
              </div>

              <div className="space-y-4 mb-6 border-t border-gray-800 pt-6">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal ({selectedItems.length} items)</span>
                  <span className="text-white font-medium">₱{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Tax (8%)</span>
                  <span className="text-white font-medium">₱{estimatedTax.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 text-sm font-medium">
                    <span>Discount</span>
                    <span>-₱{discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-800">
                <span className="text-base font-bold text-white">Total Payable</span>
                <span className="text-2xl font-black text-blue-500">₱{Math.max(0, total).toFixed(2)}</span>
              </div>

              <button 
                onClick={handleProceedToCheckout}
                disabled={!canPlaceOrder || loading || isProcessing} 
                className={`w-full py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-md
                  ${canPlaceOrder && !loading && !isProcessing ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
              >
                {isProcessing ? 'Processing Order...' : 'Place Order'}
              </button>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L9 13.414l3.707-3.707z" clipRule="evenodd"></path></svg>
                  100% Secure Payment
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className={`fixed bottom-6 right-6 z-[60] transition-all duration-300 transform ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-[#1a2235] border border-[#232d40] text-white px-5 py-4 rounded-2xl shadow-2xl shadow-black/50 flex items-center gap-4">
          <div className={`p-2 rounded-xl flex-shrink-0 ${toastType === 'success' ? 'bg-blue-500/20 text-blue-500' : 'bg-red-500/20 text-red-500'}`}>
            {toastType === 'success' ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">{toastType === 'success' ? 'Success' : 'Error'}</h4>
            <p className="text-xs text-gray-400">{toastMessage}</p>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0f1522]/80 backdrop-blur-sm transition-opacity" onClick={() => setShowConfirm(false)}></div>
          <div className="relative bg-[#1a2235] border border-[#232d40] rounded-2xl shadow-2xl shadow-black/80 max-w-sm w-full p-6 text-center animate-[scale-in_0.2s_ease-out]">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Are you sure?</h3>
            <p className="text-gray-400 text-sm mb-6">{confirmMessage}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 bg-[#0f1522] border border-[#232d40] hover:border-gray-500 text-gray-300 font-medium py-2.5 rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={onConfirmAction} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl transition-colors shadow-lg shadow-red-600/20">
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scale-in {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
}

export default Cart;