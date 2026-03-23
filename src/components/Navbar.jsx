import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { useCart } from '../context/CartContext'; 

function Navbar() {
  const { currentUser } = useAuth(); 
  const { cartItems } = useCart(); 
  const cartItemCount = cartItems.length; 
  const location = useLocation();
  const navigate = useNavigate(); // ADDED

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // ADDED: Clear search input when leaving home page
  useEffect(() => {
    if (location.pathname !== '/') {
      setSearchQuery('');
    }
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  // ADDED: Handle search submit
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
    { name: 'Book Repair', path: '/services' }
  ];

  return (
    <nav className="bg-[#202531] border-b border-[#2d3342] text-white sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left Side: Logo & Main Nav */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold tracking-tight">
              <span className="text-white">Gear</span>
              <span className="text-blue-500">Grid</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`text-sm font-medium flex items-center transition-colors ${
                    isActive(link.path) 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {link.name}
                  {link.isSpecial && (
                    <span className="ml-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side: Search, Cart, Profile */}
          <div className="flex items-center gap-5">
            
            {/* UPDATED: Search Bar with form submit (Hidden on mobile) */}
            <form onSubmit={handleSearch} className="hidden lg:flex relative items-center">
              <svg className="w-4 h-4 text-gray-400 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search premium gear..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#2a303f] text-sm text-gray-200 rounded-full pl-9 pr-4 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-[#313848] transition-all placeholder-gray-400"
              />
            </form>

            {/* Icons Area */}
            <div className="flex items-center gap-4 border-l border-[#3a4150] pl-5 ml-1">
              
              {/* Shopping Cart */}
              <Link to="/cart" className="relative text-gray-400 hover:text-white transition-colors mr-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-[18px] min-w-[18px] px-1 items-center justify-center rounded-full bg-blue-500 text-white text-[10px] font-bold border-2 border-[#202531]">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Profile / Auth */}
            {currentUser ? (
              <Link to="/profile" className="flex items-center gap-2.5 bg-[#2a303f] hover:bg-[#313848] rounded-full p-1 pr-4 transition-colors">
                <div className="w-7 h-7 bg-[#ffcda3] rounded-full overflow-hidden flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#c47743] mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white">Profile</span>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Log in</Link>
                <Link to="/signup" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Sign Up</Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#202531] border-t border-[#2d3342] absolute w-full pb-4 shadow-xl">
          <div className="px-4 py-3 space-y-1">
            {/* UPDATED: Mobile Search with form submit */}
            <form onSubmit={handleSearch} className="relative mb-4">
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#2a303f] text-sm text-gray-200 rounded-lg pl-9 pr-4 py-2.5 focus:outline-none"
              />
            </form>

            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                  isActive(link.path) ? 'bg-[#2a303f] text-white' : 'text-gray-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;