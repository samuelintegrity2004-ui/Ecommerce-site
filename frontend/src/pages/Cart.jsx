import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, removeItem, loading } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <ShoppingBag size={64} color="var(--border)" style={{ margin: '0 auto 20px' }} />
        <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Sign in to view your cart</h2>
        <Link to="/login" style={{
          display: 'inline-block',
          background: 'var(--brand)',
          color: '#fff',
          padding: '12px 28px',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 600,
          marginTop: '8px',
        }}>
          Sign In
        </Link>
      </div>
    );
  }

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
        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cart.items.map(item => (
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
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  ${item.price} × {item.quantity}
                </p>
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
              onMouseOver={e => e.currentTarget.style.background = '#fecaca'}
              onMouseOut={e => e.currentTarget.style.background = '#fee2e2'}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
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
            <Row label="Subtotal" value={`$${cart.totalPrice.toFixed(2)}`} />
            <Row label="Shipping" value="Free" valueColor="#16a34a" />
            <div style={{ height: '1px', background: 'var(--border)' }} />
            <Row label="Total" value={`$${cart.totalPrice.toFixed(2)}`} bold />
          </div>

          <button style={{
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
          onMouseOver={e => e.currentTarget.style.background = 'var(--accent-dark)'}
          onMouseOut={e => e.currentTarget.style.background = 'var(--accent)'}
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>

          <Link to="/" style={{
            display: 'block',
            textAlign: 'center',
            marginTop: '14px',
            fontSize: '14px',
            color: 'var(--brand)',
            fontWeight: 500,
          }}>
            ← Continue Shopping
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