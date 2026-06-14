import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getImageProducts } from '../services/api';

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

export default function ProductSlider({ title = 'Best In Sales' }) {
  const sliderRef = useRef(null);
  const [products, setProducts] = useState([]);
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getImageProducts();
        setProducts(shuffle(response.data || []).slice(0, 16));
      } catch (error) {
        console.error(error);
      }
    };

    loadProducts();
  }, []);

  const scroll = (dir) => {
    sliderRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  const handleAddToCart = async (product) => {
    if (!user) { navigate('/login'); return; }
    try {
      await addItem(product._id, 1, product);
      toast.success(`${product.name} added to cart`);
    } catch {
      toast.error('Failed to add item');
    }
  };

  return (
    <section style={{
      background: '#fff',
      borderRadius: 'var(--radius-md)',
      padding: '24px',
      margin: '0 24px 24px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '22px',
          color: 'var(--text-primary)',
        }}>
          {title}
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[-1, 1].map(dir => (
            <button key={dir} onClick={() => scroll(dir)} style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--surface-alt)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all .2s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'var(--brand)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--brand)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'var(--surface-alt)'; e.currentTarget.style.color = 'inherit'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              {dir === -1 ? <ChevronLeft size={16}/> : <ChevronRight size={16}/>}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll container */}
      <div ref={sliderRef} style={{
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        paddingBottom: '4px',
      }}>
        {products.map(product => (
          <div key={product._id} style={{
            minWidth: '200px',
            maxWidth: '200px',
            background: 'var(--surface-alt)',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            border: '1px solid var(--border)',
            transition: 'transform .25s, box-shadow .25s',
            flexShrink: 0,
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ height: '160px', overflow: 'hidden', background: '#f0f0f0' }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '12px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', lineHeight: 1.3 }}>
                {product.name}
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                <span style={{ fontWeight: 700, color: 'var(--brand)', fontSize: '15px' }}>
                  {'\u20a6'}{product.price.toLocaleString()}
                </span>
                <button
                  onClick={() => handleAddToCart(product)}
                  style={{
                    background: 'var(--accent)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--brand-dark)',
                    transition: 'background .2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--accent-dark)'}
                  onMouseOut={e => e.currentTarget.style.background = 'var(--accent)'}
                >
                  <ShoppingCart size={13} /> Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
