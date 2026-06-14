import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import ProductListing from './pages/ProductListing';
import CategoryProducts from './pages/CategoryProducts';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" toastOptions={{
            style: { fontFamily: 'Sora, sans-serif', fontSize: '14px' },
          }} />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/category/:category" element={<CategoryProducts />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
