import { Link } from 'react-router-dom';

function Navbar() {
  // Hardcoded for now. Later, you'll replace this with real state/context!
  const cartItemCount = 3; 

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-500 flex items-center gap-2 hover:text-blue-400 transition">
          ⚙️ GearGrid
        </Link>
        
        {/* Navigation Links (Center) */}
        <div className="hidden md:flex gap-6 font-medium">
          <Link to="/" className="hover:text-blue-500 transition border-b-2 border-transparent hover:border-blue-500 pb-1">Home</Link>
          <Link to="/parts" className="hover:text-blue-500 transition border-b-2 border-transparent hover:border-blue-500 pb-1">Parts Catalog</Link>
          <Link to="/services" className="hover:text-blue-500 transition border-b-2 border-transparent hover:border-blue-500 pb-1">Book Repair</Link>
        </div>

        {/* Right Section: Cart & Auth */}
        <div className="flex gap-4 items-center">
          
          {/* Cart Icon with Badge */}
          <Link to="/cart" className="relative text-gray-300 hover:text-blue-400 transition p-1 group">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="w-6 h-6 transform group-hover:scale-110 transition-transform"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            
            {/* The Badge */}
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shadow-sm">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Subtle Divider */}
          <div className="hidden sm:block h-6 w-px bg-gray-700 mx-1"></div>

          {/* Auth Buttons */}
          <Link to="/login" className="text-sm font-medium hover:text-blue-400 transition">Log in</Link>
          <Link to="/signup" className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold transition shadow">
            Sign Up
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;