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

  const handleAddToCart = (part) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    addToCart({ ...part, quantity: 1 });
    setToastMessage(`Added ${part.name} to cart! 🛒`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const categories = ['All', ...new Set(motorParts.map(part => part.category || 'Uncategorized'))];

  const filteredParts = useMemo(() => {
    return motorParts
      .filter(part => {
        const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (part.description && part.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = activeCategory === 'All' || part.category === activeCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortOption === 'price-low') return Number(a.price) - Number(b.price);
        if (sortOption === 'price-high') return Number(b.price) - Number(a.price);
        if (sortOption === 'name-a-z') return a.name.localeCompare(b.name);
        return 0; // default
      });
  }, [motorParts, searchTerm, activeCategory, sortOption]);

  return (
    <div className="min-h-screen bg-[#0f1522] font-sans pb-24">
      
      {/* Header Banner - PINAKANIPIS NA GYUD NI PARA SA MOBILE (pt-20 pb-4) */}
      <div className="bg-[#161d2b] border-b border-[#232d40] pt-20 pb-4 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
           <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[150%] bg-gradient-to-l from-blue-600/20 to-transparent blur-3xl transform rotate-12"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-blue-500 font-bold text-[10px] md:text-xs tracking-wider uppercase mb-0.5">
              <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
              <span className="opacity-50">/</span>
              <span className="text-gray-400">Catalog</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight">Premium Parts</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-8">
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-3 mb-5">
          
          {/* Search Input */}
          <div className="relative w-full lg:flex-1">
            <input 
              type="text" 
              placeholder="Search parts by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a2235] border border-[#232d40] text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-500 text-sm shadow-inner"
            />
            <svg className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter & Sort Container */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden flex-1 bg-[#1a2235] border border-[#232d40] text-white py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 font-medium text-sm transition-colors hover:bg-[#1f2937]"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
            
            <div className="relative flex-1 lg:w-48">
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full bg-[#1a2235] border border-[#232d40] text-white pl-3 pr-8 py-2.5 rounded-xl appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm cursor-pointer shadow-sm"
              >
                <option value="default">Recommended</option>
                <option value="price-low">Price: Low</option>
                <option value="price-high">Price: High</option>
                <option value="name-a-z">Name: A-Z</option>
              </select>
              <svg className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Categories - Horizontal Scroll */}
        <div className={`mb-6 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  activeCategory === cat 
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-500' 
                    : 'bg-[#1a2235] text-gray-400 border border-[#232d40] hover:border-gray-500 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[#1a2235] border border-[#232d40] rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-[#232d40] w-full"></div>
                <div className="p-4 flex flex-col gap-4">
                  <div className="h-4 bg-[#232d40] rounded w-1/3"></div>
                  <div className="h-6 bg-[#232d40] rounded w-3/4"></div>
                  <div className="mt-4 pt-4 border-t border-[#232d40] flex justify-between items-center">
                    <div className="h-8 bg-[#232d40] rounded w-1/3"></div>
                    <div className="h-8 w-8 bg-[#232d40] rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredParts.length === 0 ? (
          <div className="bg-[#1a2235] border border-[#232d40] rounded-3xl p-10 md:p-16 text-center max-w-2xl mx-auto mt-8 shadow-2xl">
            <div className="w-20 h-20 bg-[#0f1522] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">No parts found</h3>
            <p className="text-gray-400 mb-8 text-sm md:text-base">We couldn't find any items matching your search criteria. Try using different keywords or selecting a different category.</p>
            <button 
              onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-500/20 text-sm"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredParts.map((part) => (
              <div key={part.id} className="relative bg-[#161d2b] border border-[#232d40] hover:border-blue-500/50 rounded-2xl overflow-hidden transition-all group flex flex-col shadow-lg">
                
                {/* EDGE TO EDGE IMAGE CONTAINER */}
                <div className="h-48 bg-[#0f1522] relative overflow-hidden flex-shrink-0">
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider z-10 shadow-lg">
                    {part.category || 'Part'}
                  </span>
                  <img 
                    src={part.image} 
                    alt={part.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                </div>
                
                {/* TEXT AREA */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-white text-base mb-1 line-clamp-1">{part.name}</h3>
                  <p className="text-xs text-gray-400 mb-4 line-clamp-1">{part.description || 'Premium automotive part'}</p>
                  
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-lg font-black text-white">₱{Number(part.price).toFixed(2)}</span>
                    <button className="bg-[#1f2937] text-gray-400 hover:bg-blue-600 hover:text-white transition-colors w-8 h-8 rounded-lg flex items-center justify-center text-lg font-medium">
                      +
                    </button>
                  </div>
                </div>

                {/* DARK HOVER OVERLAY */}
                <div className="absolute inset-0 bg-[#0f1522]/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-5 z-30 text-center cursor-pointer">
                  <span className="text-blue-500 text-[10px] font-bold uppercase tracking-wider mb-1">{part.category || 'Category'}</span>
                  <h3 className="font-bold text-white text-base mb-2 line-clamp-2">{part.name}</h3>
                  
                  <div className="text-gray-300 text-xs overflow-y-auto max-h-20 mb-4 custom-scrollbar leading-relaxed px-2 w-full">
                    {part.description || 'No detailed description provided for this premium automotive part. High quality guaranteed.'}
                  </div>
                  
                  <div className="mt-auto flex flex-col items-center w-full gap-2">
                    <span className="text-xl font-black text-white">₱{Number(part.price).toFixed(2)}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(part); }} 
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2.5 px-4 rounded-xl transition-all shadow-[0_4px_15px_rgba(37,99,235,0.4)] active:scale-95 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* GLASSMORPHISM TOAST ALERT */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${toastMessage ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="relative overflow-hidden bg-[#0f1522]/60 backdrop-blur-xl border border-white/10 px-5 py-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex items-center gap-4">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-50"></div>
          <div className="relative bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-400 p-2.5 rounded-xl flex-shrink-0 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="relative pr-4">
            <h4 className="font-bold text-sm text-white tracking-wide">Success</h4>
            <p className="text-xs text-slate-300 mt-0.5">{toastMessage}</p>
          </div>
          <div className="absolute bottom-0 left-0 h-[2px] bg-blue-500 animate-[shrink_3s_linear_forwards]" style={{ width: '100%' }}></div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 4px; }

        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}} />
    </div>
  );
}

export default Parts;