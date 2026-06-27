import { useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Deals from './pages/Deals';
import NewArrivals from './pages/NewArrivals';
import CustomerService from './pages/CustomerService';
import SupportPage from './pages/SupportPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Cart from './pages/Cart';
import OrderSummary from './pages/OrderSummary';
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
          <AppShell />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppShell() {
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith('/admin');

  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;

    root.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    root.style.scrollBehavior = previousScrollBehavior;
  }, [location.pathname, location.search]);

  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
      }} />
      {!isAdminArea && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/customer-service" element={<CustomerService />} />
        <Route path="/faqs" element={<SupportPage />} />
        <Route path="/shipping" element={<SupportPage />} />
        <Route path="/returns" element={<SupportPage />} />
        <Route path="/track-order" element={<SupportPage />} />
        <Route path="/contact" element={<SupportPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/category/:category" element={<CategoryProducts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      {!isAdminArea && <Footer />}
    </>
  );
}
