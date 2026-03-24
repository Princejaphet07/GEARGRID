import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { useCart } from '../context/CartContext'; 
import { doc, getDoc, collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

function Home() {
  const { currentUser } = useAuth(); 
  const { addToCart } = useCart(); 
  const navigate = useNavigate(); 
  const location = useLocation();
  
  const [userData, setUserData] = useState({ name: '', profilePic: '' });
  const [flashDeals, setFlashDeals] = useState([]);
  const [loadingDeals, setLoadingDeals] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  const filteredDeals = searchQuery
    ? flashDeals.filter(deal =>
        deal.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : flashDeals;

  const categories = [
    { name: 'Engine Parts', subtitle: 'Performance & Maintenance', icon: '⚙️', path: '/parts?category=engine' },
    { name: 'Exhaust Systems', subtitle: 'High-Flow Technology', icon: '📐', path: '/parts?category=exhaust' },
    { name: 'Tires & Wheels', subtitle: 'Premium Rubber & Alloys', icon: '🛞', path: '/parts?category=tires' },
    { name: 'Accessories', subtitle: 'Interior & Exterior Care', icon: '✨', path: '/parts?category=accessories' },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    };

    const fetchLatestProducts = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(4));
        const querySnapshot = await getDocs(q);
        const dealsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFlashDeals(dealsArray);
      } catch (error) {
        console.error("Error fetching deals:", error);
      } finally {
        setLoadingDeals(false);
      }
    };

    fetchUserData();
    fetchLatestProducts();
  }, [currentUser]);

  const handleAddToCart = (deal) => {
    if (!currentUser) {
      navigate('/login');
    } else {
      addToCart({ ...deal, quantity: 1 }); 
      setToastMessage(`Added ${deal.name} to your cart! 🛒`);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1522] font-sans pb-24 text-gray-200 relative overflow-hidden">
      
      {!searchQuery && (
        <section className="relative w-full mb-12 flex items-center min-h-[70vh]">
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1600&q=80" 
              alt="Background" 
              className="w-full h-full object-cover opacity-40 mix-blend-luminosity" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f1522] via-[#0f1522]/90 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1522] via-transparent to-transparent opacity-80"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-blue-500 font-bold text-sm tracking-wide uppercase mb-6">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px]">✓</span>
                Expert Care for Your Journey
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                Upgrade Your Ride. <br />
                <span className="text-blue-500">Empower Your Drive.</span>
              </h1>
              
              <p className="text-gray-400 text-lg mb-10 max-w-2xl leading-relaxed">
                From high-performance parts to expert certified garage services, we provide everything you need to keep your vehicle running at its absolute best.
              </p>
              
              <div className="flex flex-wrap gap-4 items-center mb-10">
                <Link to="/parts" className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3.5 px-8 rounded-lg transition-colors shadow-lg shadow-blue-600/20">
                  Explore Parts &rarr;
                </Link>
                <Link to="/services" className="bg-[#1f2937]/50 backdrop-blur-sm border border-gray-600 hover:border-gray-400 hover:bg-white/10 text-white font-bold text-sm py-3.5 px-8 rounded-lg transition-all">
                  Schedule Service
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {searchQuery && (
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-10 pb-2">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm"
            >
              ← Back to Home
            </button>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Search results for <span className="text-blue-500">"{searchQuery}"</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {filteredDeals.length} {filteredDeals.length === 1 ? 'product' : 'products'} found
          </p>
        </section>
      )}

      {!searchQuery && (
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, idx) => (
              <Link key={idx} to={cat.path} className="bg-[#161d2b] border border-[#232d40] hover:border-gray-500 rounded-2xl p-6 flex flex-col items-start gap-4 transition-all group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1">{cat.name}</h3>
                  <p className="text-gray-400 text-xs">{cat.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* --- TRENDING PRODUCTS SECTION --- */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-24">
        {!searchQuery && (
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight mb-1">Trending Now</h2>
              <p className="text-sm text-gray-400">The most sought-after upgrades this week.</p>
            </div>
            <Link to="/parts" className="text-blue-500 hover:text-blue-400 text-sm font-bold hidden sm:flex items-center gap-1 transition-colors">
              View All Products &rarr;
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loadingDeals ? (
            Array.from({ length: 4 }).map((_, i) => (
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
            ))
          ) : filteredDeals.length === 0 ? (
            <div className="col-span-4 bg-[#161d2b] border border-[#232d40] rounded-2xl p-12 text-center">
              {searchQuery ? (
                <>
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="text-white font-bold text-base mb-1">No results found</p>
                  <p className="text-gray-400 text-sm">Try a different keyword or browse our <Link to="/parts" className="text-blue-500 hover:underline">parts catalog</Link>.</p>
                </>
              ) : (
                <p className="text-gray-400 font-bold text-sm">No products available. Upload via admin panel.</p>
              )}
            </div>
          ) : (
            filteredDeals.map((deal) => (
              <div key={deal.id} className="relative bg-[#161d2b] border border-[#232d40] hover:border-blue-500/50 rounded-2xl overflow-hidden transition-all group flex flex-col shadow-lg">
                
                {/* EDGE TO EDGE IMAGE CONTAINER */}
                <div className="h-56 bg-[#0f1522] relative overflow-hidden">
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider z-10">
                    {deal.category || 'Part'}
                  </span>
                  <img 
                    src={deal.image} 
                    alt={deal.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-white text-base mb-1 line-clamp-1">{deal.name}</h3>
                  <p className="text-xs text-gray-400 mb-4 line-clamp-1">{deal.description || 'Premium automotive part'}</p>
                  
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-lg font-black text-white">₱{Number(deal.price).toFixed(2)}</span>
                    <button className="bg-[#1f2937] text-gray-400 w-8 h-8 rounded-md flex items-center justify-center text-lg font-medium">
                      +
                    </button>
                  </div>
                </div>

                <div className="absolute inset-0 bg-[#0f1522]/95 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 z-30 text-center cursor-pointer">
                  <span className="text-blue-500 text-xs font-bold uppercase tracking-wider mb-2">{deal.category || 'Category'}</span>
                  <h3 className="font-bold text-white text-xl mb-3 line-clamp-2">{deal.name}</h3>
                  
                  <div className="text-gray-300 text-sm overflow-y-auto max-h-24 mb-6 custom-scrollbar leading-relaxed px-2 w-full">
                    {deal.description || 'No detailed description provided for this premium automotive part. High quality guaranteed.'}
                  </div>
                  
                  <div className="mt-auto flex flex-col items-center w-full gap-3">
                    <span className="text-2xl font-black text-white">₱{Number(deal.price).toFixed(2)}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(deal); }} 
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-[0_4px_15px_rgba(37,99,235,0.4)] active:scale-95 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
        {!searchQuery && (
          <div className="mt-6 text-center sm:hidden">
            <Link to="/parts" className="text-blue-500 font-bold text-sm">View All Products &rarr;</Link>
          </div>
        )}
      </section>

      {/* GLASSMORPHISM TOAST ALERT */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="relative overflow-hidden bg-[#0f1522]/60 backdrop-blur-xl border border-white/10 px-5 py-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex items-center gap-4">
          
          {/* Subtle gradient glow background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-50"></div>

          {/* Icon */}
          <div className="relative bg-gradient-to-br from-blue-500/20 to-blue-600/10 text-blue-400 p-2.5 rounded-xl flex-shrink-0 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          {/* Text */}
          <div className="relative pr-4">
            <h4 className="font-bold text-sm text-white tracking-wide">Success</h4>
            <p className="text-xs text-slate-300 mt-0.5">{toastMessage}</p>
          </div>

          {/* Optional: Animated loading bar at the bottom to show time remaining */}
          <div className="absolute bottom-0 left-0 h-[2px] bg-blue-500 animate-[shrink_3s_linear_forwards]" style={{ width: '100%' }}></div>
        </div>
      </div>
      
      {/* CSS For Scrollbar and Animation */}
      <style dangerouslySetInnerHTML={{__html: `
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

export default Home;