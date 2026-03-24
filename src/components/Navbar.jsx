import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { useCart } from '../context/CartContext'; 
import { doc, onSnapshot } from 'firebase/firestore'; 
import { db } from '../firebase'; 

function Navbar() {
  const { currentUser } = useAuth(); 
  const { cartItems } = useCart(); 
  const cartItemCount = cartItems.length; 
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profilePic, setProfilePic] = useState('');

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/') {
      setSearchQuery('');
    }
  }, [location.pathname]);

  useEffect(() => {
    let unsubscribe;
    if (currentUser) {
      unsubscribe = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
        if (docSnap.exists() && docSnap.data().profilePic) {
          setProfilePic(docSnap.data().profilePic);
        } else {
          setProfilePic(''); 
        }
      });
    } else {
      setProfilePic('');
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/?search=${encodeURIComponent(trimmed)}`);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Parts Catalog', path: '/parts' },
    { name: 'Services', path: '/services' },
  ];

  return (
    <nav className="bg-[#1a2235] border-b border-[#232d40] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-500/30">
                G
              </div>
              <span className="font-black text-xl text-white tracking-tight">Gear<span className="text-blue-500">Grid</span></span>
            </Link>

            <div className="hidden md:flex space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    isActive(link.path)
                      ? 'bg-blue-500/10 text-blue-400'
                      : 'text-slate-400 hover:bg-[#232d40] hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side (Search, Cart, Profile) */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <svg className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search parts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-[#0f1522] border border-[#232d40] text-sm text-white rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-500"
              />
            </form>

            <div className="h-6 w-px bg-[#232d40] mx-2"></div>

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-slate-400 hover:text-blue-400 transition-colors group">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-[#1a2235] group-hover:scale-110 transition-transform">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Profile Avatar with Text */}
            {currentUser ? (
              <Link to="/profile" className="flex items-center gap-3 pl-2 group">
                <div className="w-10 h-10 rounded-full border-2 border-[#232d40] group-hover:border-blue-500 overflow-hidden bg-[#0f1522] flex items-center justify-center transition-all shadow-lg group-hover:shadow-blue-500/20">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-6 h-6 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                {/* GIBALIK NGA TEXT: Tapad sa picture */}
                <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">
                  Profile
                </span>
              </Link>
            ) : (
              <Link to="/login" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-slate-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-[#1a2235]">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            {/* Mobile Profile Avatar */}
            {currentUser && (
              <Link to="/profile" className="w-8 h-8 rounded-full border-2 border-[#232d40] overflow-hidden bg-[#0f1522] flex items-center justify-center">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-5 h-5 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
              </Link>
            )}

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-400 hover:text-white p-2">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1a2235] border-t border-[#232d40] absolute w-full pb-4 shadow-xl">
          <div className="px-4 py-3 space-y-1">
            <form onSubmit={handleSearch} className="relative mb-4">
              <svg className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search parts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0f1522] border border-[#232d40] text-sm text-white rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:border-blue-500"
              />
            </form>

            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`block px-4 py-3 rounded-xl text-sm font-bold ${
                  isActive(link.path) ? 'bg-blue-500/10 text-blue-400' : 'text-slate-400 hover:bg-[#232d40] hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {!currentUser && (
              <Link to="/login" className="block w-full text-center bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-bold mt-4 shadow-lg shadow-blue-500/20">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;