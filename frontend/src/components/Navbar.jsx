import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ShoppingCart, User, ChevronDown, MapPin,
  Menu, X, LogOut, Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const categories = ['All', 'Cars', 'Electronics', 'Fashion', 'Home', 'Sports'];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) navigate(`/?keyword=${keyword.trim()}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      {/* ── Top nav ── */}
      <nav style={{
        background: 'var(--brand)',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>

        {/* Logo */}
        <Link to="/" style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '26px',
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '-0.5px',
          flexShrink: 0,
        }}>
          ifeco
        </Link>

        {/* Deliver to */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#e8d5d5',
          fontSize: '13px',
          flexShrink: 0,
        }}>
          <MapPin size={14} color="var(--accent)" />
          <div>
            <div style={{ fontSize: '11px', color: '#ccc' }}>Deliver to</div>
            <div style={{ fontWeight: 600, color: '#fff', fontSize: '13px' }}>Nigeria</div>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={{
          flex: 1,
          display: 'flex',
          background: '#fff',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
          maxWidth: '800px',
        }}>
          <select style={{
            border: 'none',
            background: '#f0f0f0',
            padding: '0 12px',
            fontSize: '13px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            borderRight: '1px solid var(--border)',
          }}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search products, brands and more…"
            style={{
              flex: 1,
              border: 'none',
              padding: '10px 14px',
              fontSize: '14px',
              color: 'var(--text-primary)',
            }}
          />
          <button type="submit" style={{
            background: 'var(--accent)',
            border: 'none',
            padding: '0 18px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'background .2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'var(--accent-dark)'}
          onMouseOut={e => e.currentTarget.style.background = 'var(--accent)'}
          >
            <Search size={18} color="var(--brand-dark)" />
          </button>
        </form>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: 'auto' }}>

          {/* Account */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                background: 'transparent',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '1px',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                transition: 'background .2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '11px', color: '#ccc' }}>
                Hello, {user ? user.name.split(' ')[0] : 'Sign in'}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Account & Lists <ChevronDown size={12} />
              </span>
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                background: '#fff',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                minWidth: '200px',
                overflow: 'hidden',
                border: '1px solid var(--border)',
              }}>
                {user ? (
                  <>
                    <DropItem icon={<User size={15}/>} label={user.name} to="/profile" onClick={() => setDropdownOpen(false)} />
                    <DropItem icon={<Package size={15}/>} label="My Orders" to="/orders" onClick={() => setDropdownOpen(false)} />
                    <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
                    <button
                      onClick={() => { logout(); setDropdownOpen(false); navigate('/'); }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 16px',
                        background: 'transparent',
                        fontSize: '14px',
                        color: '#dc2626',
                        cursor: 'pointer',
                        border: 'none',
                      }}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'block',
                        background: 'var(--accent)',
                        color: 'var(--brand-dark)',
                        fontWeight: 600,
                        padding: '10px 16px',
                        textAlign: 'center',
                        fontSize: '14px',
                        margin: '12px',
                        borderRadius: 'var(--radius-sm)',
                      }}>
                      Sign In
                    </Link>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', paddingBottom: '8px' }}>
                      New? <Link to="/register" style={{ color: 'var(--brand)', fontWeight: 600 }}>Create account</Link>
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            position: 'relative',
            transition: 'background .2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,.1)'}
          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ position: 'relative' }}>
              <ShoppingCart size={26} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: 'var(--accent)',
                  color: 'var(--brand-dark)',
                  fontSize: '11px',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {cartCount}
                </span>
              )}
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Cart</span>
          </Link>
        </div>
      </nav>

      {/* ── Bottom nav ── */}
      <div style={{
        background: 'var(--nav-bottom)',
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        padding: '0 24px',
        overflowX: 'auto',
      }}>
        {[
          { label: '☰  All', bold: true },
          { label: "Today's Deals" },
          { label: 'Customer Service' },
          { label: 'New Arrivals' },
          { label: 'Gift Cards' },
          { label: 'Sell on Ifeco' },
        ].map((item) => (
          <a
            key={item.label}
            href="#"
            style={{
              color: '#fff',
              fontSize: '13.5px',
              fontWeight: item.bold ? 700 : 400,
              padding: '10px 14px',
              whiteSpace: 'nowrap',
              borderBottom: '2px solid transparent',
              transition: 'border-color .2s, background .2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderBottomColor = '#fff';
              e.currentTarget.style.background = 'rgba(255,255,255,.06)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderBottomColor = 'transparent';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </header>
  );
}

// Helper sub-component
function DropItem({ icon, label, to, onClick }) {
  return (
    <Link to={to} onClick={onClick} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 16px',
      fontSize: '14px',
      color: 'var(--text-primary)',
      transition: 'background .15s',
    }}
    onMouseOver={e => e.currentTarget.style.background = 'var(--surface-alt)'}
    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
    >
      {icon} {label}
    </Link>
  );
}