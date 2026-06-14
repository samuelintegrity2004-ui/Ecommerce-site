import { Link } from 'react-router-dom';

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

export default function CategoryGrid() {
  return (
    <section style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
      }}>
        {categories.map((category) => (
          <Link key={category.title} to={category.href}>
            <div style={{
              background: '#fff',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform .25s, box-shadow .25s',
              cursor: 'pointer',
            }}
            onMouseOver={(event) => {
              event.currentTarget.style.transform = 'translateY(-4px)';
              event.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseOut={(event) => {
              event.currentTarget.style.transform = 'translateY(0)';
              event.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
            >
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img
                  src={category.image}
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
              <div style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {category.title}
                </h3>
                <span style={{ fontSize: '13px', color: 'var(--brand)', fontWeight: 600 }}>
                  Shop now {'\u2192'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
