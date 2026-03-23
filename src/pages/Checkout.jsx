import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { removeFromCart } = useCart();
  
  const { itemsToCheckout, subtotal, estimatedTax, discount, paymentMethod: initialPaymentMethod } = location.state || {};

  useEffect(() => {
    if (!itemsToCheckout || itemsToCheckout.length === 0) {
      navigate('/cart');
    }
  }, [itemsToCheckout, navigate]);

  if (!itemsToCheckout || itemsToCheckout.length === 0) return null;

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    phone: '',
    label: 'Home' 
  });
  
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [orderNote, setOrderNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod || 'cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // CHANGED: $15.00 → ₱15.00 (value stays numeric, only display changes)
  const shippingFee = deliveryOption === 'express' ? 15.00 : 0.00;
  const finalTotal = subtotal + estimatedTax + shippingFee - discount;

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "orders"), {
        userId: currentUser ? currentUser.uid : 'guest',
        items: itemsToCheckout,
        shippingInfo,
        deliveryOption,
        orderNote,
        paymentMethod,
        financials: { subtotal, estimatedTax, discount, shippingFee, total: finalTotal },
        status: 'Pending',
        createdAt: serverTimestamp()
      });

      const sortedIndexes = [...itemsToCheckout].sort((a, b) => b.cartIndex - a.cartIndex);
      sortedIndexes.forEach(item => {
        removeFromCart(item.cartIndex);
      });

      alert("🎉 Order placed successfully! Thank you for shopping with GearGrid.");
      navigate('/orders'); 

    } catch (error) {
      console.error("Error placing order: ", error);
      alert("There was an error placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0f1522] min-h-screen py-8 pb-24 text-gray-200 font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Secure Checkout
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="lg:grid lg:grid-cols-12 lg:gap-6 items-start">
          
          <section className="lg:col-span-8 space-y-4">
            
            <div className="bg-[#1f2937] border border-gray-800 rounded-xl p-6 relative overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  Delivery Address
                </h2>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShippingInfo({...shippingInfo, label: 'Home'})} className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors ${shippingInfo.label === 'Home' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'border-gray-600 text-gray-400'}`}>Home</button>
                  <button type="button" onClick={() => setShippingInfo({...shippingInfo, label: 'Office'})} className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors ${shippingInfo.label === 'Office' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'border-gray-600 text-gray-400'}`}>Office</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" name="fullName" value={shippingInfo.fullName} onChange={handleInputChange} className="w-full bg-[#111827] border border-gray-700 focus:border-blue-500 rounded-lg px-4 py-2.5 text-white text-sm" placeholder="Full Name" />
                <input required type="tel" name="phone" value={shippingInfo.phone} onChange={handleInputChange} className="w-full bg-[#111827] border border-gray-700 focus:border-blue-500 rounded-lg px-4 py-2.5 text-white text-sm" placeholder="Phone Number (e.g. 09123456789)" />
                <input required type="text" name="address" value={shippingInfo.address} onChange={handleInputChange} className="w-full bg-[#111827] border border-gray-700 focus:border-blue-500 rounded-lg px-4 py-2.5 text-white text-sm md:col-span-2" placeholder="Street Name, Building, House No." />
                <input required type="text" name="city" value={shippingInfo.city} onChange={handleInputChange} className="w-full bg-[#111827] border border-gray-700 focus:border-blue-500 rounded-lg px-4 py-2.5 text-white text-sm md:col-span-2" placeholder="City / Municipality / Province" />
              </div>
            </div>

            <div className="bg-[#1f2937] border border-gray-800 rounded-xl overflow-hidden">
              <div className="p-6 space-y-6">
                
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                  Order Items
                </h2>

                {itemsToCheckout.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <img src={item.image} className="w-20 h-20 rounded-lg bg-[#111827] object-cover border border-gray-700 p-1" alt={item.name} />
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-white line-clamp-2 leading-tight">{item.name}</h4>
                      <p className="text-xs text-gray-400 mt-1">Category: {item.category}</p>
                      <div className="flex justify-between items-end mt-2">
                        {/* CHANGED: $ → ₱ */}
                        <span className="text-lg font-bold text-blue-400">₱{Number(item.price).toFixed(2)}</span>
                        <span className="text-sm font-medium text-gray-400">Qty: {item.checkoutQuantity}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="border-t border-gray-800 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-bold text-gray-300 mb-3">Delivery Option</h3>
                    <div className="space-y-3">
                      <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${deliveryOption === 'standard' ? 'border-blue-500 bg-blue-500/5' : 'border-gray-700 bg-[#111827] hover:border-gray-500'}`}>
                        <input type="radio" name="delivery" value="standard" checked={deliveryOption === 'standard'} onChange={() => setDeliveryOption('standard')} className="mt-1 w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 focus:ring-blue-500" />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-bold text-white">Standard Delivery</span>
                            <span className="text-sm font-bold text-emerald-400">FREE</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">Receive by {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                        </div>
                      </label>

                      <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${deliveryOption === 'express' ? 'border-blue-500 bg-blue-500/5' : 'border-gray-700 bg-[#111827] hover:border-gray-500'}`}>
                        <input type="radio" name="delivery" value="express" checked={deliveryOption === 'express'} onChange={() => setDeliveryOption('express')} className="mt-1 w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 focus:ring-blue-500" />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-bold text-white">Express Delivery</span>
                            {/* CHANGED: $ → ₱ */}
                            <span className="text-sm font-bold text-white">₱15.00</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">Receive by {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-300 mb-3">Message</h3>
                    <textarea 
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="(Optional) Leave a message to seller or courier..."
                      className="w-full bg-[#111827] border border-gray-700 focus:border-blue-500 rounded-lg px-4 py-3 text-white text-sm h-[110px] resize-none"
                    ></textarea>
                  </div>
                </div>

              </div>
            </div>

            <div className="bg-[#1f2937] border border-gray-800 rounded-xl p-6">
               <h2 className="text-lg font-bold text-white mb-4">Payment Method</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button type="button" onClick={() => setPaymentMethod('cod')} className={`py-3 px-2 rounded-lg border text-sm font-bold flex flex-col items-center gap-2 transition-all ${paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-gray-700 bg-[#111827] text-gray-400 hover:border-gray-500'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    Cash on Delivery
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('gcash')} className={`py-3 px-2 rounded-lg border text-sm font-bold flex flex-col items-center gap-2 transition-all ${paymentMethod === 'gcash' ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-gray-700 bg-[#111827] text-gray-400 hover:border-gray-500'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    GCash
                  </button>
                  <button type="button" disabled className="py-3 px-2 rounded-lg border border-gray-800 bg-[#111827]/50 text-gray-600 text-sm font-bold flex flex-col items-center gap-2 cursor-not-allowed">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                    Credit Card
                  </button>
               </div>
            </div>
          </section>

          <section className="mt-8 lg:mt-0 lg:col-span-4 sticky top-6">
            <div className="bg-[#1f2937] border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-bold text-white mb-6">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Items Subtotal ({itemsToCheckout.length})</span>
                    {/* CHANGED: $ → ₱ */}
                    <span className="text-white">₱{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Shipping Fee</span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      // CHANGED: $ → ₱
                      <span className="text-white">₱{shippingFee.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Estimated Tax</span>
                    {/* CHANGED: $ → ₱ */}
                    <span className="text-white">₱{estimatedTax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400 text-sm">
                      <span>Voucher Discount</span>
                      {/* CHANGED: $ → ₱ */}
                      <span>-₱{discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-end my-6 pt-4 border-t border-gray-800">
                  <span className="text-sm font-medium text-gray-400">Total Payment</span>
                  <div className="text-right">
                    {/* CHANGED: $ → ₱ */}
                    <span className="text-3xl font-black text-blue-500">₱{finalTotal.toFixed(2)}</span>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">VAT Included, where applicable</p>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-[0_4px_15px_rgba(37,99,235,0.3)]
                    ${isSubmitting ? 'bg-blue-800 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-[0.98]'}`}
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </div>

              <div className="bg-[#111827] px-6 py-4 border-t border-gray-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  <span><strong>GearGrid Guarantee:</strong> Get the exact items you ordered or your money back.</span>
                </div>
              </div>
            </div>
          </section>

        </form>
      </div>
    </div>
  );
}

export default Checkout;