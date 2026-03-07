import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Column 1: Brand */}
        <div>
          <Link to="/" className="text-2xl font-bold text-white mb-4 flex items-center gap-2 hover:text-blue-400 transition w-max">
            ⚙️ GearGrid
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            The premier destination for high-performance motor parts and expert mechanic services in the heart of Visayas.
          </p>
        </div>

        {/* Column 2: Contact Info */}
        <div>
          <h3 className="text-white font-semibold mb-5 uppercase tracking-wider text-sm">Contact Us</h3>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex items-start gap-3">
              <span className="text-blue-500 text-base">📍</span>
              <span>Cebu City, Cebu<br />Philippines 6000</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-blue-500 text-base">📞</span>
              <span>+63 912 345 6789</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-blue-500 text-base">✉️</span>
              <a href="mailto:support@geargrid.ph" className="hover:text-blue-400 transition">support@geargrid.ph</a>
            </li>
          </ul>
        </div>

        {/* Column 3: Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-5 uppercase tracking-wider text-sm">Quick Links</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
            <li><Link to="/parts" className="hover:text-blue-400 transition">Shop Parts Catalog</Link></li>
            <li><Link to="/services" className="hover:text-blue-400 transition">Book a Repair</Link></li>
            <li><Link to="/login" className="hover:text-blue-400 transition">Customer Login</Link></li>
          </ul>
        </div>

        {/* Column 4: Socials & Hours */}
        <div>
          <h3 className="text-white font-semibold mb-5 uppercase tracking-wider text-sm">Connect With Us</h3>
          
          {/* Social Icons */}
          <div className="flex gap-4 mb-6">
            {/* Facebook Icon */}
            <a href="#" className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-full text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            {/* Instagram Icon */}
            <a href="#" className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded-full text-slate-400 hover:bg-pink-600 hover:text-white transition-all shadow-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          
          {/* Shop Hours */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800">
            <p className="font-semibold text-slate-300 mb-2 text-sm">Shop Hours</p>
            <div className="text-sm text-slate-400 space-y-1">
              <div className="flex justify-between"><span>Mon - Sat:</span> <span>8:00 AM - 6:00 PM</span></div>
              <div className="flex justify-between"><span>Sunday:</span> <span className="text-blue-400">Closed</span></div>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} GearGrid Cebu. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link to="#" className="hover:text-blue-400 transition">Privacy Policy</Link>
          <Link to="#" className="hover:text-blue-400 transition">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;