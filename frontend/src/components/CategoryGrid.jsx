import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { resolveAssetUrl } from '../services/api';

const categories = [
  {
    title: 'Latest Models',
    image: '/images/car-5.jpg',
    href: '/category/latest-models',
    tag: 'New',
  },
  {
    title: 'Hot',
    image: '/images/phone-accessories-1.jpg',
    href: '/category/hot',
    tag: 'Hot',
  },
  {
    title: 'Trending',
    image: '/images/cloth_5.jpg',
    href: '/category/trending',
    tag: 'Trending',
  },
];

const tagColors = {
  New: '#16a34a',
  Hot: '#dc2626',
  Trending: '#7c3aed',
};

const shopCategories = [
  {
    label: 'Electronics',
    value: 'electronics',
    items: [
      { label: 'Phones & Accessories', value: 'phone-accessories' },
      { label: 'Laptops', value: 'laptop' },
      { label: 'TV & Video', value: 'tv' },
      { label: 'Cameras', value: 'camera' },
    ],
  },
  {
    label: 'Fashion',
    value: 'fashion',
    items: [
      { label: 'Clothing', value: 'cloth' },
      { label: 'Watches', value: 'watch' },
    ],
  },
  {
    label: 'Home Appliances',
    value: 'home-kitchen',
    items: [
      { label: 'Fridges', value: 'fridge' },
      { label: 'Electric Cookers', value: 'electric-cook' },
      { label: 'Fans', value: 'fan' },
      { label: 'Irons', value: 'iron' },
    ],
  },
  {
    label: 'Cars & Mobility',
    value: 'cars',
    items: [
      { label: 'Cars', value: 'car' },
      { label: 'Bikes', value: 'bike' },
    ],
  },
];

export default function CategoryGrid() {
  const [shopOpen, setShopOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(shopCategories[0].value);

  return (
    <section className="home-category-section">
      <div className="home-category-grid">
        {categories.map((category) => (
          <article
            key={category.title}
            className="home-category-card"
            onMouseOver={(event) => {
              event.currentTarget.style.transform = 'translateY(-4px)';
              event.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseOut={(event) => {
              event.currentTarget.style.transform = 'translateY(0)';
              event.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <Link to={category.href}>
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img
                  src={resolveAssetUrl(category.image)}
                  alt={category.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }}
                  onMouseOver={(event) => event.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(event) => event.currentTarget.style.transform = 'scale(1)'}
                  onError={(event) => {
                    event.currentTarget.src = `https://via.placeholder.com/500?text=${category.title}`;
                  }}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: tagColors[category.tag] || '#444',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  letterSpacing: '0.5px',
                }}>
                  {category.tag}
                </span>
              </div>
            </Link>
              <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {category.title}
                </h3>
                <Link to={category.href} className="category-shop-link">
                  Shop now {'\u2192'}
                </Link>
                <button
                  type="button"
                  className="mobile-shop-toggle"
                  onClick={() => setShopOpen((open) => !open)}
                  aria-expanded={shopOpen}
                >
                  Shop now <ChevronDown size={14} />
                </button>
              </div>
          </article>
        ))}
      </div>

      {shopOpen && (
        <div className="mobile-shop-accordion">
          {shopCategories.map((category) => (
            <div key={category.value} className="shop-accordion-group">
              <button
                type="button"
                onClick={() => setOpenCategory((current) => (current === category.value ? '' : category.value))}
                aria-expanded={openCategory === category.value}
              >
                {category.label}
                <ChevronDown size={15} />
              </button>
              {openCategory === category.value && (
                <div className="shop-accordion-panel">
                  <Link to={`/products?categoryGroup=${category.value}`}>View all {category.label}</Link>
                  {category.items.map((item) => (
                    <Link key={item.value} to={`/products?category=${item.value}`}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
