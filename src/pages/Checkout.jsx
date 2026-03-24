import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore'; // BAG-O: Gidugang ang getDocs
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

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    phone: '',
    label: 'Home' 
  });
  
  // BAG-O: State para sa mga na-save nga addresses
  const [savedAddresses, setSavedAddresses] = useState([]);
  
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [orderNote, setOrderNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod || 'cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // BAG-O: Mo-fetch sa Saved Addresses gikan sa Profile/Addresses.jsx inig load sa Checkout
  useEffect(() => {
    const fetchSavedAddresses = async () => {
      if (currentUser) {
        try {
          const querySnapshot = await getDocs(collection(db, 'users', currentUser.uid, 'addresses'));
          const addresses = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setSavedAddresses(addresses);

          // Pangitaon ang Default Address ug i-auto fill ang porma
          const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
          if (defaultAddress) {
            setShippingInfo({
              fullName: defaultAddress.fullName || '',
              address: `${defaultAddress.street}, ${defaultAddress.barangay}`,
              city: defaultAddress.city || '',
              phone: defaultAddress.phone || '',
              label: defaultAddress.label || 'Home'
            });
          }
        } catch (error) {
          console.error("Error fetching addresses:", error);
        }
      }
    };

    fetchSavedAddresses();
  }, [currentUser]);

  // BAG-O: Handle inig naay pilion sa Dropdown
  const handleAddressSelect = (e) => {
    const selectedId = e.target.value;
    const selectedAddr = savedAddresses.find(addr => addr.id === selectedId);
    if (selectedAddr) {
      setShippingInfo({
        fullName: selectedAddr.fullName || '',
        address: `${selectedAddr.street}, ${selectedAddr.barangay}`,
        city: selectedAddr.city || '',
        phone: selectedAddr.phone || '',
        label: selectedAddr.label || 'Home'
      });
    } else {
      // Kung gi-clear ang selection
      setShippingInfo({ fullName: '', address: '', city: '', phone: '', label: 'Home' });
    }
  };

  if (!itemsToCheckout || itemsToCheckout.length === 0) return null;

  const total = subtotal + estimatedTax - discount + (deliveryOption === 'express' ? 150 : 50);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create the order document
      const orderData = {
        userId: currentUser ? currentUser.uid : 'guest',
        customerName: shippingInfo.fullName || 'Guest User',
        items: itemsToCheckout,
        subtotal,
        estimatedTax,
        discount,
        total,
        shippingInfo, // KANI MAOY BASAHON SA ADMIN
        deliveryOption,
        orderNote,
        paymentMethod,
        status: 'Pending',
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      console.log("Order placed with ID: ", docRef.id);

      itemsToCheckout.forEach(item => {
        removeFromCart(item.id);
      });

      navigate('/orders', { 
        state: { 
          orderSuccess: true,
          orderId: docRef.id
        } 
      });

    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0f1522] min-h-screen pt-8 pb-20 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link to="/cart" className="w-10 h-10 bg-[#1a2235] border border-[#232d40] rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Checkout</h1>
            <p className="text-sm text-slate-400">Complete your order details</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column - Forms */}
          <div className="w-full lg:w-2/3 space-y-6">
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
              
              {/* Shipping Details */}
              <div className="bg-[#1a2235] border border-[#232d40] rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">1</span>
                  Shipping Details
                </h2>

                {/* BAG-O: Select Saved Address Dropdown */}
                {savedAddresses.length > 0 && (
                  <div className="mb-6 p-4 bg-[#0f1522] border border-blue-500/20 rounded-xl">
                    <label className="block text-sm font-bold text-blue-400 mb-2">Use a Saved Address</label>
                    <select 
                      onChange={handleAddressSelect}
                      className="w-full bg-[#1a2235] border border-[#232d40] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">-- Choose an address or enter manually below --</option>
                      {savedAddresses.map(addr => (
                        <option key={addr.id} value={addr.id}>
                          {addr.label || 'Address'} - {addr.street}, {addr.barangay}, {addr.city}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-400 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#0f1522] border border-[#232d40] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="Juan Dela Cruz"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-400 mb-2">Full Address (Street, Barangay)</label>
                    <input 
                      type="text" 
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#0f1522] border border-[#232d40] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="123 Main St, Brgy. San Jose"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">City</label>
                    <input 
                      type="text" 
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#0f1522] border border-[#232d40] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="Cebu City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#0f1522] border border-[#232d40] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="09123456789"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Options */}
              <div className="bg-[#1a2235] border border-[#232d40] rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">2</span>
                  Delivery Method
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Standard */}
                  <div 
                    onClick={() => setDeliveryOption('standard')}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${
                      deliveryOption === 'standard' 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-[#232d40] bg-[#0f1522] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${deliveryOption === 'standard' ? 'border-blue-500' : 'border-slate-500'}`}>
                          {deliveryOption === 'standard' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                        <span className="font-bold text-white">Standard Delivery</span>
                      </div>
                      <span className="text-slate-400 font-bold">₱50.00</span>
                    </div>
                    <p className="text-xs text-slate-500 ml-6">3-5 Business Days</p>
                  </div>

                  {/* Express */}
                  <div 
                    onClick={() => setDeliveryOption('express')}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${
                      deliveryOption === 'express' 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-[#232d40] bg-[#0f1522] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${deliveryOption === 'express' ? 'border-blue-500' : 'border-slate-500'}`}>
                          {deliveryOption === 'express' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        </div>
                        <span className="font-bold text-white">Express Delivery</span>
                      </div>
                      <span className="text-slate-400 font-bold">₱150.00</span>
                    </div>
                    <p className="text-xs text-slate-500 ml-6">1-2 Business Days</p>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-[#1a2235] border border-[#232d40] rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">3</span>
                  Payment Method
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* COD */}
                  <div 
                    onClick={() => setPaymentMethod('cod')}
                    className={`border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3 ${
                      paymentMethod === 'cod' 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-[#232d40] bg-[#0f1522] hover:border-slate-500'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-blue-500' : 'border-slate-500'}`}>
                      {paymentMethod === 'cod' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      <div>
                        <p className="font-bold text-white text-sm">Cash on Delivery</p>
                        <p className="text-[10px] text-slate-500">Pay when you receive</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-[#1a2235] border border-[#232d40] rounded-2xl p-6 shadow-xl">
                <label className="block text-sm font-bold text-slate-400 mb-2">Order Notes (Optional)</label>
                <textarea 
                  rows="3"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  className="w-full bg-[#0f1522] border border-[#232d40] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                  placeholder="Notes about your order, e.g. special notes for delivery."
                ></textarea>
              </div>

            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-[#1a2235] border border-[#232d40] rounded-2xl shadow-xl sticky top-24 overflow-hidden">
              <div className="p-6 border-b border-[#232d40] bg-[#0f1522]">
                <h2 className="text-lg font-bold text-white">Order Summary</h2>
                <p className="text-xs text-slate-500 mt-1">{itemsToCheckout.length} {itemsToCheckout.length === 1 ? 'Item' : 'Items'} in cart</p>
              </div>
              
              <div className="p-6 max-h-[40vh] overflow-y-auto no-scrollbar space-y-4 border-b border-[#232d40]">
                {itemsToCheckout.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-[#0f1522] rounded-xl border border-[#232d40] overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-bold text-white line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-blue-400 mt-1">₱{(parseFloat(item.price.replace('₱', '').replace(',', '')) * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="font-medium text-white">₱{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Shipping</span>
                  <span className="font-medium text-white">₱{(deliveryOption === 'express' ? 150 : 50).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Tax (12%)</span>
                  <span className="font-medium text-white">₱{estimatedTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-400">
                    <span>Discount Applied</span>
                    <span>-₱{discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-[#232d40]">
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-base font-bold text-white">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-blue-400 tracking-tight">₱{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">VAT Included</p>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    form="checkout-form"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold text-base flex justify-center items-center gap-2 transition-all shadow-lg
                      ${isSubmitting 
                        ? 'bg-[#232d40] text-slate-500 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20 active:scale-[0.98]'}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-[#0f1522] px-6 py-4 border-t border-[#232d40] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span>Secure checkout process</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;