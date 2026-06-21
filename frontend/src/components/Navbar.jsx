import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Package,
  Search,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Cars', value: 'cars' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Home & Kitchen', value: 'home-kitchen' },
  { label: 'Sports', value: 'sports' },
];

const bottomLinks = [
  { label: "Today's Deals", to: '/deals' },
  { label: 'Customer Service', to: '/customer-service' },
  { label: 'New Arrivals', to: '/new-arrivals' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState('all');
  const dropdownRef = useRef(null);

  const goToProducts = (categoryValue = searchCategory, searchValue = keyword) => {
    const params = new URLSearchParams();
    if (searchValue.trim()) params.set('keyword', searchValue.trim());
    if (categoryValue !== 'all') params.set('categoryGroup', categoryValue);
    navigate(`/products${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    goToProducts();
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSearchCategory(value);
    goToProducts(value, keyword);
  };

  useEffect(() => {
    const handler = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <nav className="top-nav">
        <Link to="/" className="brand-logo">
          ifeco
        </Link>

        <div className="delivery-chip">
          <MapPin size={14} color="var(--accent)" />
          <div>
            <div style={{ fontSize: '11px', color: '#ccc' }}>Deliver to</div>
            <div style={{ fontWeight: 600, color: '#fff', fontSize: '13px' }}>Nigeria</div>
          </div>
        </div>

        <form onSubmit={handleSearch} className="nav-search">
          <select value={searchCategory} onChange={handleCategoryChange} aria-label="Product category">
            {categories.map((category) => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search products, brands and more..."
          />
          <button type="submit" aria-label="Search">
            <Search size={18} color="var(--brand-dark)" />
          </button>
        </form>

        <div className="nav-actions">
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              className="account-trigger"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              type="button"
            >
              <span>Hello, {user ? user.name.split(' ')[0] : 'Sign in'}</span>
              <strong>Account & Lists <ChevronDown size={12} /></strong>
            </button>

            {dropdownOpen && (
              <div className="account-menu">
                {user ? (
                  <>
                    <DropItem icon={<User size={15} />} label={user.name} to="/profile" onClick={() => setDropdownOpen(false)} />
                    <DropItem icon={<Package size={15} />} label="My Orders" to="/orders" onClick={() => setDropdownOpen(false)} />
                    {user.isAdmin && (
                      <DropItem icon={<LayoutDashboard size={15} />} label="Admin Dashboard" to="/admin" onClick={() => setDropdownOpen(false)} />
                    )}
                    <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
                    <button
                      onClick={() => { logout(); setDropdownOpen(false); navigate('/'); }}
                      className="sign-out-button"
                      type="button"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setDropdownOpen(false)} className="sign-in-link">
                      Sign In
                    </Link>
                    <p className="register-prompt">
                      New? <Link to="/register">Create account</Link>
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          <Link to="/cart" className="cart-link">
            <div style={{ position: 'relative' }}>
              <ShoppingCart size={26} />
              {cartCount > 0 && <span>{cartCount}</span>}
            </div>
            <strong>Cart</strong>
          </Link>
        </div>
      </nav>

      <div className="secondary-nav">
        <button
          className="secondary-menu-toggle"
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />} All
        </button>
        <div className={`secondary-nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          {bottomLinks.map((item) => (
            <Link key={item.label} to={item.to} onClick={() => setMobileMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
            All Categories
          </Link>
        </div>
      </div>
    </header>
  );
}

function DropItem({ icon, label, to, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="drop-item">
      {icon} {label}
    </Link>
  );
}
