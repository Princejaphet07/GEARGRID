// src/pages/AdminLogin.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

function AdminLogin() {
  // State to track if the password is visible or hidden
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Login Card */}
      <div className="max-w-md w-full bg-[#1f2937] border border-gray-800 rounded-[2rem] p-8 shadow-2xl relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 bg-[#111827] rounded-2xl flex items-center justify-center border border-gray-800 shadow-inner relative">
              <div className="absolute inset-0 bg-blue-500/10 rounded-2xl animate-pulse"></div>
              <svg className="w-8 h-8 text-blue-500 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-1">
            Gear<span className="text-blue-500">Admin</span>
          </h2>
          <p className="text-gray-400 text-sm font-medium">Secure System Access</p>
        </div>

        {/* Login Form */}
        <form className="space-y-5">
          
          {/* Email Input */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Admin Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input 
                type="email" 
                className="w-full bg-[#111827] text-white border border-gray-700 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600" 
                placeholder="admin@geargrid.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors">Forgot Password?</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              
              <input 
                type={showPassword ? "text" : "password"} // Toggles between text and password
                className="w-full bg-[#111827] text-white border border-gray-700 rounded-xl py-3 pl-11 pr-12 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600" 
                placeholder="••••••••"
              />

              {/* Eye Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  /* Eye Slash Icon (Hide) */
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  /* Eye Icon (Show) */
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center pt-2">
            <input type="checkbox" id="remember" className="w-4 h-4 rounded bg-[#111827] border-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900 cursor-pointer" />
            <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-400 cursor-pointer">Remember my device</label>
          </div>

          {/* Submit Button */}
          <Link to="/" className="block mt-6">
            <button 
              type="button" 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all transform hover:-translate-y-0.5 flex justify-center items-center gap-2"
            >
              Sign In to Dashboard
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </Link>
        </form>

        <div className="mt-8 text-center border-t border-gray-800 pt-6">
          <p className="text-xs text-gray-500">
            Unauthorized access is strictly prohibited. <br/>
            &copy; 2024 ATEC Motors.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;