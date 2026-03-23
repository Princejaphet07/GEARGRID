import { useState } from 'react';
import { Link } from 'react-router-dom';

function Vouchers() {
  const [copiedCode, setCopiedCode] = useState(null);

  const vouchers = [
    { id: 1, code: 'DISCOUNT20', amount: '$20 OFF', description: 'Valid on any order over $100. One time use.', expiry: 'Dec 31, 2026', color: 'from-blue-600 to-blue-800' },
    { id: 2, code: 'FREESHIP', amount: 'FREE SHIPPING', description: 'Get free express shipping on premium parts.', expiry: 'No Expiry', color: 'from-emerald-500 to-teal-700' },
    { id: 3, code: 'NEWGEAR10', amount: '10% OFF', description: 'Welcome discount for new members only.', expiry: 'Valid for 7 days', color: 'from-purple-600 to-indigo-800' },
  ];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f1522] py-10 pb-24 text-gray-200 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/profile" className="hover:text-white transition-colors">Profile</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            <span className="text-gray-300">My Vouchers</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Promo & Vouchers</h1>
          <p className="text-gray-400 mt-2">Copy a code below and apply it at checkout to get discounts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vouchers.map((voucher) => (
            <div key={voucher.id} className="bg-[#1a2235] border border-gray-800 rounded-2xl overflow-hidden flex shadow-lg hover:-translate-y-1 transition-transform">
              
              <div className={`w-1/3 bg-gradient-to-br ${voucher.color} p-4 flex flex-col justify-center items-center text-center relative border-r-2 border-dashed border-[#0f1522]`}>
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#0f1522] rounded-full"></div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#0f1522] rounded-full"></div>
                <span className="text-white font-black text-xl leading-tight">{voucher.amount}</span>
              </div>

              <div className="w-2/3 p-5 flex flex-col justify-between relative">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold text-white tracking-widest uppercase">{voucher.code}</h3>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed mb-3">{voucher.description}</p>
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Expires: {voucher.expiry}</p>
                </div>
                
                <button 
                  onClick={() => handleCopy(voucher.code)}
                  className={`mt-4 w-full py-2 rounded-lg text-sm font-bold transition-colors ${
                    copiedCode === voucher.code 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                  }`}
                >
                  {copiedCode === voucher.code ? 'Copied! ✅' : 'Copy Code'}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Vouchers;