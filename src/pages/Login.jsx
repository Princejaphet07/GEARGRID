import { useState, useEffect } from 'react'; // Gi-dugang ang useEffect
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // KANI ANG BAG-O: State para ma-toggle ang password
  const navigate = useNavigate();

  // Automatic mo-scroll sa pinakataas inig load sa page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); 
    } catch (err) {
      setError("Sayop ang email o password!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-12 sm:px-6 lg:px-8 font-sans">
      
      {/* Full-screen Background Image with Dark Mood Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80" 
          alt="Sleek sports car" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f1522]/90 via-[#0f1522]/80 to-[#0f1522] backdrop-blur-[4px]"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 bg-[#1a2235]/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-2xl shadow-black/50 max-w-md w-full border border-slate-800">
        
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-black text-white tracking-tight inline-block mb-2">GEAR<span className="text-blue-500">GRID</span></Link>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-slate-400 text-sm">Sign in to access your garage and bookings</p>
          {error && <p className="text-red-500 text-sm mt-2 font-bold">{error}</p>}
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1522] text-white border border-slate-700 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-600" 
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">Forgot password?</a>
            </div>
            
            <div className="relative"> {/* KANI ANG BAG-O: Wrapper para sa input ug icon */}
              <input 
                type={showPassword ? "text" : "password"} // Dynamic type
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f1522] text-white border border-slate-700 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-600 pr-12" // Gidugangan ug pr-12
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="remember" className="w-4 h-4 text-blue-600 bg-[#0f1522] border-slate-700 rounded focus:ring-blue-500 focus:ring-offset-[#1a2235]" />
            <label htmlFor="remember" className="ml-2 text-sm font-medium text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">Remember me for 30 days</label>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all mt-6"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Don't have an account? <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-bold transition-colors">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;