import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Full-screen Background Image with Blur Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80" 
          alt="Sleek sports car" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 bg-white p-8 sm:p-10 rounded-[2rem] shadow-2xl max-w-md w-full border border-slate-100">
        
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-black text-slate-800 tracking-tight inline-block mb-2">
            Gear<span className="text-blue-600">Grid</span>
          </Link>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-500 text-sm">Enter your details to access your garage.</p>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="flex items-center justify-center gap-2 w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium py-2.5 rounded-xl transition-colors shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            Google
          </button>
          <button className="flex items-center justify-center gap-2 w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium py-2.5 rounded-xl transition-colors shadow-sm">
            <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 24 24"><path d="M13.6 10.4c-.1-2.4 2-3.8 2.1-3.9-1.2-1.7-3.1-1.9-3.8-1.9-1.6-.2-3.1 1-4 1-1 0-2.2-1-3.4-1-1.6 0-3.1.9-3.9 2.3-1.7 3-1 7.4.6 9.7.8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7 1.4 0 1.8.7 3.1.7 1.3 0 2.1-1.1 2.8-2.2.8-1.1 1.1-2.2 1.1-2.3 0-.1-2.2-.8-2.3-3.2zM11.6 4.3c.7-.8 1.1-1.8 1-2.9-1 .1-2.1.6-2.8 1.4-.6.7-1.1 1.7-1 2.8 1.1.2 2.1-.5 2.8-1.3z"/></svg>
            Apple
          </button>
        </div>

        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
          <span className="relative bg-white px-4 text-xs text-slate-400 font-medium uppercase tracking-widest">Or continue with</span>
        </div>
        
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition-all" 
              placeholder="driver@example.com"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-bold text-slate-700">Password</label>
              <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors">Forgot password?</a>
            </div>
            <input 
              type="password" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition-all" 
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="remember" className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500" />
            <label htmlFor="remember" className="ml-2 text-sm font-medium text-slate-600 cursor-pointer">Remember me for 30 days</label>
          </div>

          <button 
            type="button" 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-transform transform hover:-translate-y-0.5 mt-2"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600 font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-500 hover:underline font-bold transition-colors">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;