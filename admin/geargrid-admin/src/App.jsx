// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Bookings from './pages/Bookings';
import Users from './pages/Users';
import Settings from './pages/Settings';
import AdminLogin from './pages/AdminLogin'; // <-- IMPORT THIS

function App() {
  return (
    <Router>
      <Routes>
        
        {/* Standalone Route for Login (No Sidebar) */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Routes wrapped inside the AdminLayout (Has Sidebar) */}
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;