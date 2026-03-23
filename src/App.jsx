import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Parts from './pages/Parts';
import Services from './pages/Services';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout'; 
import Profile from './pages/Profile';
import Orders from './pages/Orders'; 
import Addresses from './pages/Addresses'; 
import Vouchers from './pages/Vouchers';   

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; 
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider> 
      <CartProvider> 
        <Router>
          <div className="min-h-screen flex flex-col font-sans bg-gray-50">
            <Navbar />
            
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/parts" element={<Parts />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes */}
                <Route path="/services" element={
                  <ProtectedRoute>
                    <Services />
                  </ProtectedRoute>
                } />
                
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } />

                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />

                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />

                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />

                <Route path="/addresses" element={
                  <ProtectedRoute>
                    <Addresses />
                  </ProtectedRoute>
                } />
                
                <Route path="/vouchers" element={
                  <ProtectedRoute>
                    <Vouchers />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;