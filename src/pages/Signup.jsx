import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // MGA BAG-ONG STATE PARA SA MODALS
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: `${firstName} ${lastName}`,
        email: email,
      });

      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-12 sm:px-6 lg:px-8 font-sans">
      
      {/* Full-screen Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80" 
          alt="Sleek sports car" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1522] via-[#0f1522]/85 to-[#0f1522]/70 backdrop-blur-[5px]"></div>
      </div>

      {/* Signup Card */}
      <div className="relative z-10 bg-[#1a2235]/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-2xl shadow-black/50 max-w-lg w-full border border-slate-800 my-8">
        
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-black text-white tracking-tight inline-block mb-2">GEAR<span className="text-blue-500">GRID</span></Link>
          <h2 className="text-3xl font-bold text-white mb-2">Create an Account</h2>
          <p className="text-slate-400 text-sm">Join the community and manage your vehicles</p>
          {error && <p className="text-red-500 text-sm mt-2 font-bold">{error}</p>}
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">First Name</label>
              <input 
                type="text" 
                required
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f1522] text-white border border-slate-700 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-600" 
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Last Name</label>
              <input 
                type="text" 
                required
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f1522] text-white border border-slate-700 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-600" 
                placeholder="Doe"
              />
            </div>
          </div>

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
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f1522] text-white border border-slate-700 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-600 pr-12"
                placeholder="Create a strong password"
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

          <div className="flex items-start mt-4">
            <div className="flex items-center h-5 mt-0.5">
              <input type="checkbox" required id="terms" className="w-4 h-4 text-blue-600 bg-[#0f1522] border-slate-700 rounded focus:ring-blue-500 focus:ring-offset-[#1a2235]" />
            </div>
            <div className="ml-2 text-sm text-slate-400 leading-tight">
              <label htmlFor="terms" className="cursor-pointer hover:text-slate-300 transition-colors">I agree to the </label>
              <span 
                onClick={() => setShowTerms(true)} 
                className="font-bold text-blue-500 hover:text-blue-400 transition-colors cursor-pointer"
              >
                Terms of Service
              </span>
              <span> and </span>
              <span 
                onClick={() => setShowPrivacy(true)} 
                className="font-bold text-blue-500 hover:text-blue-400 transition-colors cursor-pointer"
              >
                Privacy Policy
              </span>.
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all mt-4"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-400 font-bold transition-colors">Log in</Link>
        </p>
      </div>

      {/* --- MODAL PARA SA TERMS OF SERVICE --- */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a2235] p-6 sm:p-8 rounded-[2rem] max-w-lg w-full border border-slate-700 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">Terms of Service</h3>
            <div className="text-slate-300 text-sm max-h-64 overflow-y-auto mb-6 pr-2 space-y-3 custom-scrollbar">
              <p>Welcome to GEARGRID. By using our services, you agree to these terms.</p>
              <p><strong>1. Usage</strong><br/>You must not misuse our services or use them for illegal purposes.</p>
              <p><strong>2. Account Security</strong><br/>You are responsible for keeping your password secure.</p>
              {/* Pwede nimo ilisan ug tinuod nga terms diri */}
              <p>Please read these terms carefully before using the platform.</p>
            </div>
            <button 
              onClick={() => setShowTerms(false)}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL PARA SA PRIVACY POLICY --- */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a2235] p-6 sm:p-8 rounded-[2rem] max-w-lg w-full border border-slate-700 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">Privacy Policy</h3>
            <div className="text-slate-300 text-sm max-h-64 overflow-y-auto mb-6 pr-2 space-y-3 custom-scrollbar">
              <p>Your privacy is important to us. This policy explains how we collect and use your data.</p>
              <p><strong>1. Data Collection</strong><br/>We collect your name, email, and vehicle data to improve your experience.</p>
              <p><strong>2. Data Security</strong><br/>We use industry-standard encryption to protect your personal information.</p>
              {/* Pwede nimo ilisan ug tinuod nga policy diri */}
              <p>We do not sell your personal data to third parties.</p>
            </div>
            <button 
              onClick={() => setShowPrivacy(false)}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Signup;