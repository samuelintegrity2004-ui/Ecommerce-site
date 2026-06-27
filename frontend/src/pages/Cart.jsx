import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder, resolveAssetUrl } from '../services/api';
import toast from 'react-hot-toast';
import CheckoutSummary from '../components/CheckoutSummary';

export default function Cart() {
  const { cart, removeItem, updateItem, clearCart } = useCart();
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
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <ShoppingBag size={64} color="var(--border)" style={{ margin: '0 auto 20px' }} />
        <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Your cart is empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Add some products and they'll appear here.</p>
        <Link to="/" style={{
          display: 'inline-block',
          background: 'var(--brand)',
          color: '#fff',
          padding: '12px 28px',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 600,
        }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '32px' }}>
        Shopping Cart
      </h1>

      <div className="cart-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cart.items.map((item) => (
            <div key={item.product} style={{
              background: '#fff',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              display: 'flex',
              gap: '20px',
              alignItems: 'center',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border)',
            }}>
              <img src={resolveAssetUrl(item.image)} alt={item.name} style={{
                width: '90px',
                height: '90px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-sm)',
                background: '#f0f0f0',
              }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>{item.name}</h3>
                <p style={{ color: 'var(--brand)', fontWeight: 700, fontSize: '18px' }}>
                  {'\u20a6'}{(item.price * item.quantity).toLocaleString()}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {'\u20a6'}{Number(item.price).toLocaleString()} x {item.quantity}
                </p>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px',
              }}>
                <button
                  aria-label="Decrease quantity"
                  onClick={() => updateItem(item.product, item.quantity - 1)}
                  style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-alt)' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 700 }}>{item.quantity}</span>
                <button
                  aria-label="Increase quantity"
                  onClick={() => updateItem(item.product, item.quantity + 1)}
                  style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-alt)' }}
                >
                  <Plus size={14} />
                </button>
              </div>
              <button onClick={() => removeItem(item.product)} style={{
                background: '#fee2e2',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '8px',
                cursor: 'pointer',
                color: '#dc2626',
                transition: 'background .2s',
              }}
              onMouseOver={(event) => { event.currentTarget.style.background = '#fecaca'; }}
              onMouseOut={(event) => { event.currentTarget.style.background = '#fee2e2'; }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <Link to="/order-summary" className="mobile-summary-button">
            View Order Summary
          </Link>
        </div>

        <div className="desktop-cart-summary">
          <CheckoutSummary cart={cart} onPlaceOrder={handlePlaceOrder} compact />
          <Link to="/" className="continue-shopping-link">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
