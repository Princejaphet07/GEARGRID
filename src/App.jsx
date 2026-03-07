import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Parts from './pages/Parts';
import Services from './pages/Services';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart'; // 1. Added the Cart import here!

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans bg-gray-50">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/parts" element={<Parts />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart />} /> {/* 2. Added the Cart route here! */}
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;