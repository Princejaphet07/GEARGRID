import { Link } from 'react-router-dom';

function Cart() {
  // 🛒 Enhanced placeholder data
  const cartItems = [
    {
      id: 1,
      name: 'Premium Synthetic Motor Oil - 5W-30',
      brand: 'Castrol Edge',
      price: 35.00,
      quantity: 2,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1635773054098-9eb06b6e41b4?w=300&q=80'
    },
    {
      id: 2,
      name: 'High-Performance Ceramic Brake Pads',
      brand: 'Brembo',
      price: 55.50,
      quantity: 1,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&q=80'
    }
  ];

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 9.99; // Free shipping over $100
  const tax = subtotal * 0.08; 
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-slate-50 min-h-screen py-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex items-baseline justify-between mb-8 pb-6 border-b border-slate-200">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shopping Cart</h1>
          <p className="text-slate-500 font-medium">{cartItems.length} items</p>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart UI
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-16 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-4xl mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-8 max-w-md">Looks like you haven't added anything yet. Discover our top-tier parts and get your ride running smoothly.</p>
            <Link to="/parts" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md shadow-blue-200">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
            
            {/* Left Column: Cart Items list */}
            <section className="lg:col-span-7 xl:col-span-8">
              <ul className="bg-white rounded-3xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                {cartItems.map((item) => (
                  <li key={item.id} className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 hover:bg-slate-50/50 transition-colors">
                    
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover object-center" />
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between sm:space-x-6">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            <Link to={`/parts/${item.id}`} className="hover:text-blue-600 transition-colors">{item.name}</Link>
                          </h3>
                          <p className="text-sm text-slate-500 mt-1">Brand: {item.brand}</p>
                          {item.inStock ? (
                            <p className="text-sm font-medium text-emerald-600 flex items-center gap-1 mt-2">
                              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                              In stock
                            </p>
                          ) : (
                            <p className="text-sm font-medium text-orange-500 mt-2">Low Stock</p>
                          )}
                        </div>
                        <p className="text-xl font-black text-slate-900">${item.price.toFixed(2)}</p>
                      </div>

                      {/* Controls: Quantity & Actions */}
                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center border border-slate-300 rounded-lg bg-white h-10">
                          <button className="px-3 text-slate-500 hover:text-slate-800 hover:bg-slate-100 h-full rounded-l-lg transition-colors">−</button>
                          <span className="px-4 font-semibold text-slate-800 border-x border-slate-200 h-full flex items-center">{item.quantity}</span>
                          <button className="px-3 text-slate-500 hover:text-slate-800 hover:bg-slate-100 h-full rounded-r-lg transition-colors">+</button>
                        </div>
                        
                        <div className="flex space-x-4">
                          <button className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">Save for later</button>
                          <span className="text-slate-300">|</span>
                          <button className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors">Remove</button>
                        </div>
                      </div>
                    </div>

                  </li>
                ))}
              </ul>
            </section>

            {/* Right Column: Order Summary */}
            <section className="mt-8 lg:mt-0 lg:col-span-5 xl:col-span-4">
              <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl sticky top-28">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                {/* Promo Code Input */}
                <div className="mb-6 flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Promo Code" 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                  <button className="bg-slate-700 hover:bg-slate-600 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors">
                    Apply
                  </button>
                </div>

                <dl className="space-y-4 text-sm text-slate-300 border-t border-slate-800 pt-6">
                  <div className="flex justify-between items-center">
                    <dt>Subtotal</dt>
                    <dd className="font-medium text-white">${subtotal.toFixed(2)}</dd>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <dt className="flex items-center gap-1">
                      Shipping
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-500 cursor-help" title="Free shipping on orders over $100"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                    </dt>
                    <dd className="font-medium text-white">
                      {shipping === 0 ? <span className="text-emerald-400 font-bold">Free</span> : `$${shipping.toFixed(2)}`}
                    </dd>
                  </div>

                  <div className="flex justify-between items-center">
                    <dt>Tax (8%)</dt>
                    <dd className="font-medium text-white">${tax.toFixed(2)}</dd>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-800 pt-4 mt-4">
                    <dt className="text-base font-bold text-white">Order Total</dt>
                    <dd className="text-2xl font-black text-blue-400">${total.toFixed(2)}</dd>
                  </div>
                </dl>

                <button className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg shadow-blue-500/30">
                  Proceed to Checkout
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>

                {/* Trust Badges / Secure Checkout */}
                <div className="mt-6 flex flex-col items-center">
                  <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
                    Secure Checkout
                  </p>
                  <div className="flex gap-2 opacity-60">
                    <div className="bg-white rounded px-2 py-1 text-slate-800 text-[10px] font-black">VISA</div>
                    <div className="bg-white rounded px-2 py-1 text-slate-800 text-[10px] font-black">MC</div>
                    <div className="bg-white rounded px-2 py-1 text-slate-800 text-[10px] font-black italic">PayPal</div>
                  </div>
                </div>

              </div>
            </section>

          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;