import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import CheckoutSummary from '../components/CheckoutSummary';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';

export default function OrderSummary() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login', { state: { redirectTo: '/order-summary' } });
      return;
    }

    try {
      await createOrder({
        orderItems: cart.items,
        shippingAddress: { fullName: user.name, phone: '', address: '', city: '' },
        paymentMethod: 'Pay on delivery',
      });
      clearCart();
      toast.success('Order placed successfully');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="empty-cart-state">
        <ShoppingBag size={64} color="var(--border)" />
        <h2>Your cart is empty</h2>
        <p>Add some products and they'll appear here.</p>
        <Link to="/">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <main className="order-summary-page">
      <div className="order-summary-header">
        <Link to="/cart">Back to Cart</Link>
        <h1>Order Summary</h1>
        <p>Review your items and totals before placing your order.</p>
      </div>
      <CheckoutSummary cart={cart} onPlaceOrder={handlePlaceOrder} showItems />
    </main>
  );
}
