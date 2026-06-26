import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { getImageProducts } from '../services/api';

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

export default function ProductSlider({ title = 'Best In Sales', productsOverride }) {
  const sliderRef = useRef(null);
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const { addItem } = useCart();
  const products = productsOverride || fetchedProducts;

  useEffect(() => {
    if (productsOverride) return;

    const loadProducts = async () => {
      try {
        const response = await getImageProducts();
        setFetchedProducts(shuffle(response.data || []).slice(0, 16));
      } catch (error) {
        console.error(error);
      }
    };

    loadProducts();
  }, [productsOverride]);

  const scroll = (dir) => {
    const distance = sliderRef.current?.clientWidth || 280;
    sliderRef.current?.scrollBy({ left: dir * distance, behavior: 'smooth' });
  };

  const handleAddToCart = async (product) => {
    try {
      await addItem(product._id, 1, product);
      toast.success(`${product.name} added to cart`);
    } catch {
      toast.error('Failed to add item');
    }
  };

  return (
    <section className="best-sales-section">
      {/* Header */}
      <div className="best-sales-header">
        <h2>{title}</h2>
        <div className="slider-controls">
          {[-1, 1].map(dir => (
            <button
              key={dir}
              onClick={() => scroll(dir)}
              className="slider-arrow"
              aria-label={dir === -1 ? 'Previous products' : 'Next products'}
            onMouseOver={e => { e.currentTarget.style.background = 'var(--brand)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--brand)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'var(--surface-alt)'; e.currentTarget.style.color = 'inherit'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              {dir === -1 ? <ChevronLeft size={16}/> : <ChevronRight size={16}/>}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll container */}
      <div ref={sliderRef} className="best-sales-track">
        {products.map(product => (
          <div
            key={product._id}
            className="best-sales-card"
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div className="best-sales-image">
              <img
                src={product.image}
                alt={product.name}
              />
            </div>
            <div className="best-sales-body">
              <h4>{product.name}</h4>
              <div>
                <span>
                  {'\u20a6'}{product.price.toLocaleString()}
                </span>
                <button
                  onClick={() => handleAddToCart(product)}
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
