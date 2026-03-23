import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../context/CartContext'; 
import { useAuth } from '../context/AuthContext'; 

function Parts() {
  const [motorParts, setMotorParts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);
  const [sortOption, setSortOption] = useState('default');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMotorParts(productsArray);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('#filter-dropdown-wrapper')) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = useMemo(() => {
    const cats = motorParts.map(part => part.category).filter(Boolean);
    return ['All', ...new Set(cats)];
  }, [motorParts]);

  const filteredParts = useMemo(() => {
    let result = motorParts.filter(part => {
      const matchesCategory = activeCategory === 'All' || part.category === activeCategory;
      const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    switch (sortOption) {
      case 'az':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'za':
        result = [...result].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price_asc':
        result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price_desc':
        result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
        break;
      default:
        break;
    }

    return result;
  }, [motorParts, activeCategory, searchTerm, sortOption]);

  const handleAddToCart = (part) => {
    if (!currentUser) {
      navigate('/login');
    } else {
      addToCart({ ...part, quantity: 1 });
      showToast(`🛒 ${part.name} added to cart!`);
    }
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const sortLabels = {
    default: 'Sort & Filter',
    az: 'A → Z',
    za: 'Z → A',
    price_asc: 'Price: Low → High',
    price_desc: 'Price: High → Low',
  };

  return (
    <div className="min-h-screen bg-[#0f1522] font-sans pb-24 pt-8 text-gray-200">
      
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1f2937] border border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] text-white px-6 py-4 rounded-xl font-bold flex items-center gap-3 animate-bounce-in">
          {toastMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10">
          <Link to="/" className="text-gray-400 hover:text-white text-sm font-medium flex items-center gap-2 mb-6 w-max transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Garage
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white">
                PARTS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 not-italic tracking-normal">/ CATALOG</span>
              </h1>
              <p className="text-gray-400 mt-2">Find the perfect upgrade for your machine.</p>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <input 
                  type="text" 
                  placeholder="Search parts..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#1a2235] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500"
                />
                <svg className="w-5 h-5 text-gray-500 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>

              <div className="relative flex-shrink-0" id="filter-dropdown-wrapper">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all whitespace-nowrap ${
                    sortOption !== 'default'
                      ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                      : 'bg-[#1a2235] border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                  </svg>
                  <span className="hidden sm:inline">{sortLabels[sortOption]}</span>
                  <svg className={`w-3.5 h-3.5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-[#1a2235] border border-gray-700 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
                    <div className="px-4 pt-3 pb-1">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Alphabetical</p>
                    </div>
                    {[
                      { value: 'az', label: 'A → Z' },
                      { value: 'za', label: 'Z → A' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortOption(opt.value); setIsFilterOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
                          sortOption === opt.value
                            ? 'text-blue-400 bg-blue-500/10 font-bold'
                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {opt.label}
                        {sortOption === opt.value && (
                          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}

                    <div className="border-t border-gray-700/60 mx-4 my-1"></div>

                    <div className="px-4 pt-2 pb-1">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Price</p>
                    </div>
                    {[
                      { value: 'price_asc', label: 'Low → High' },
                      { value: 'price_desc', label: 'High → Low' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortOption(opt.value); setIsFilterOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
                          sortOption === opt.value
                            ? 'text-blue-400 bg-blue-500/10 font-bold'
                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {opt.label}
                        {sortOption === opt.value && (
                          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}

                    {sortOption !== 'default' && (
                      <>
                        <div className="border-t border-gray-700/60 mx-4 my-1"></div>
                        <button
                          onClick={() => { setSortOption('default'); setIsFilterOpen(false); }}
                          className="w-full text-left px-4 py-2.5 pb-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                        >
                          ✕ Clear Filter
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {!loading && categories.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-6 mb-4 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                    : 'bg-[#1a2235] text-gray-400 border border-gray-700 hover:border-gray-500 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[#1a2235] border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-800 w-full"></div>
                <div className="p-5 flex flex-col gap-4">
                  <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                  <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center">
                    <div className="h-8 bg-gray-700 rounded w-1/3"></div>
                    <div className="h-10 w-10 bg-gray-700 rounded-xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredParts.length === 0 ? (
          <div className="text-center py-20 bg-[#1a2235] rounded-3xl border border-gray-800 mt-8">
            <span className="text-6xl block mb-4">🔍</span>
            <h2 className="text-2xl font-bold text-white mb-2">No parts found</h2>
            <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
            <button 
              onClick={() => { setSearchTerm(''); setActiveCategory('All'); setSortOption('default'); }}
              className="mt-6 text-blue-400 hover:text-white font-bold underline transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredParts.map((part) => (
              <div key={part.id} className="bg-[#1f2937] border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/30 hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.2)] hover:-translate-y-1.5 transition-all group flex flex-col relative">
                
                <div className="h-56 bg-gradient-to-b from-white to-gray-200 relative p-6 flex items-center justify-center overflow-hidden">
                  <img src={part.image} alt={part.name} className="h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl" />
                  
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 z-20 cursor-pointer">
                    <p className="text-white text-sm text-center overflow-y-auto max-h-full">
                      {part.description || 'No description available for this premium automotive part.'}
                    </p>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow bg-[#1f2937]">
                  <p className="text-xs text-blue-400 font-bold tracking-wider uppercase mb-2">{part.category || 'Uncategorized'}</p>
                  <h3 className="font-bold text-white text-lg mb-1 leading-tight line-clamp-2">{part.name}</h3>
                  
                  <div className="mt-auto pt-6 border-t border-gray-800 flex justify-between items-end">
                    <div className="flex flex-col">
                      {/* CHANGED: $ → ₱ */}
                      <span className="text-xs text-gray-500 line-through">₱{(Number(part.price) * 1.2).toFixed(2)}</span>
                      <span className="text-2xl font-black text-white">₱{Number(part.price).toFixed(2)}</span>
                    </div>
                    
                    <button 
                      onClick={() => handleAddToCart(part)}
                      className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl shadow-[0_4px_15px_rgba(37,99,235,0.3)] transition-all active:scale-95"
                      title="Add to Cart"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes bounce-in {
          0% { transform: translateY(100%); opacity: 0; }
          50% { transform: translateY(-10%); opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-bounce-in { animation: bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}} />
    </div>
  );
}

export default Parts;