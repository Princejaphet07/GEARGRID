import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-[#0f1522] text-gray-400 py-16 border-t border-[#232d40] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Column 1: Brand */}
        <div>
          <Link to="/" className="text-2xl font-bold text-white mb-4 flex items-center gap-2 hover:text-blue-400 transition w-max">
            <span className="text-gray-400">⚙️</span> Gear<span className="text-blue-500">Grid</span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
            The premier destination for high-performance motor parts and expert mechanic services in the heart of Visayas.
          </p>
        </div>

        {/* Column 2: Contact Us */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contact Us</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
              <span>Cebu City, Cebu<br />Philippines 6000</span>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-5 h-5 text-pink-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
              <span>+63 912 345 6789</span>
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
              <a href="mailto:support@geargrid.ph" className="hover:text-blue-400 transition">support@geargrid.ph</a>
            </li>
          </ul>
        </div>

        {/* Column 3: Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
            <li><Link to="/parts" className="hover:text-blue-400 transition">Shop Parts Catalog</Link></li>
            <li><Link to="/services" className="hover:text-blue-400 transition">Book a Repair</Link></li>
            <li><Link to="/login" className="hover:text-blue-400 transition">Customer Login</Link></li>
          </ul>
        </div>

        {/* Column 4: Socials & Hours */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Connect With Us</h3>
          
          {/* Social Icons with Real Logo Colors */}
          <div className="flex gap-3 mb-6">
            <a href="#" className="w-10 h-10 bg-blue-600 border border-blue-600 flex items-center justify-center rounded-full text-white hover:bg-blue-500 hover:border-blue-500 transition-all shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="w-10 h-10 bg-pink-600 border border-pink-600 flex items-center justify-center rounded-full text-white hover:bg-pink-500 hover:border-pink-500 transition-all shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          
          {/* Shop Hours */}
          <div className="bg-[#161d2b] p-5 rounded-xl border border-[#232d40]">
            <p className="font-bold text-white mb-3 text-sm">Shop Hours</p>
            <div className="text-sm text-gray-400 space-y-2">
              <div className="flex justify-between"><span>Mon - Sat:</span> <span className="text-gray-300">8:00 AM - 6:00 PM</span></div>
              <div className="flex justify-between"><span>Sunday:</span> <span className="text-blue-500 font-medium">Closed</span></div>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-[#232d40] flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} GearGrid Cebu. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link to="#" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;