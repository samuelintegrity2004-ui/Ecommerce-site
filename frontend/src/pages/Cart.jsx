import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, removeItem, updateItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login', { state: { redirectTo: '/cart' } });
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '32px' }}>
        Shopping Cart
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
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
              <img src={item.image} alt={item.name} style={{
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
        </div>

        <div style={{
          background: '#fff',
          borderRadius: 'var(--radius-md)',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border)',
          position: 'sticky',
          top: '100px',
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Order Summary</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <Row label="Subtotal" value={`${'\u20a6'}${cart.totalPrice.toLocaleString()}`} />
            <Row label="Shipping" value="Free" valueColor="#16a34a" />
            <div style={{ height: '1px', background: 'var(--border)' }} />
            <Row label="Total" value={`${'\u20a6'}${cart.totalPrice.toLocaleString()}`} bold />
          </div>

          <button onClick={handlePlaceOrder} style={{
            width: '100%',
            padding: '14px',
            background: 'var(--accent)',
            color: 'var(--brand-dark)',
            fontWeight: 700,
            fontSize: '16px',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'background .2s',
          }}
          onMouseOver={(event) => { event.currentTarget.style.background = 'var(--accent-dark)'; }}
          onMouseOut={(event) => { event.currentTarget.style.background = 'var(--accent)'; }}
          >
            Place Order <ArrowRight size={18} />
          </button>

          <Link to="/" style={{
            display: 'block',
            textAlign: 'center',
            marginTop: '14px',
            fontSize: '14px',
            color: 'var(--brand)',
            fontWeight: 500,
          }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: bold ? '16px' : '14px', fontWeight: bold ? 700 : 400 }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ color: valueColor || 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}
