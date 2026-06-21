import { Link } from 'react-router-dom';
import { Clock, Flame, Percent, ShoppingBag, Tag, Zap } from 'lucide-react';

const dealCategories = ['Phones & accessories', 'Home appliances', 'Fashion markdowns', 'Car essentials', 'Computing deals'];

const dealProducts = [
  { name: 'Smart LED TV Bundle', category: 'Electronics', oldPrice: '₦420,000', price: '₦319,500', off: '24% OFF', image: '/images/tv-1.jpg' },
  { name: 'Wireless Headphones', category: 'Audio', oldPrice: '₦85,000', price: '₦54,900', off: '35% OFF', image: '/images/hd-1.jpg' },
  { name: 'Premium Cotton Outfit', category: 'Fashion', oldPrice: '₦28,500', price: '₦18,950', off: '34% OFF', image: '/images/cloth_1.jpg' },
  { name: 'Electric Cooker Set', category: 'Home & Kitchen', oldPrice: '₦96,000', price: '₦69,500', off: '28% OFF', image: '/images/electric-cook-1.jpg' },
];

export default function Deals() {
  return (
    <main className="commerce-page">
      <section className="commerce-hero deals-hero">
        <div>
          <p className="eyebrow">Today's Deals</p>
          <h1>Fresh discounts, flash sales, and limited-time offers.</h1>
          <p>Shop daily price drops across electronics, fashion, home appliances, car accessories, and more.</p>
          <Link to="/products">Shop all deals</Link>
        </div>
      </section>

      <section className="promo-strip">
        {[
          { icon: <Zap size={20} />, title: 'Flash Sales', text: 'Fast-moving deals refreshed throughout the day.' },
          { icon: <Percent size={20} />, title: 'Up to 50% Off', text: 'Clearance prices on selected trusted products.' },
          { icon: <Clock size={20} />, title: 'Limited Time', text: 'Deal windows close when stock runs out.' },
        ].map((item) => (
          <article key={item.title}>
            {item.icon}
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="commerce-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Hot Picks</p>
            <h2>Deal of the day</h2>
          </div>
          <Link to="/products?categoryGroup=electronics">View more</Link>
        </div>
        <div className="deal-grid">
          {dealProducts.map((product) => (
            <article key={product.name} className="deal-card">
              <span>{product.off}</span>
              <img src={product.image} alt={product.name} />
              <div>
                <p>{product.category}</p>
                <h3>{product.name}</h3>
                <strong>{product.price}</strong>
                <small>{product.oldPrice}</small>
                <Link to="/products">Add to cart</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="commerce-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Browse Deals</p>
            <h2>Popular deal categories</h2>
          </div>
        </div>
        <div className="category-pill-grid">
          {dealCategories.map((category) => (
            <Link key={category} to="/products">
              <Tag size={16} /> {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="info-band">
        <Flame size={24} />
        <div>
          <h2>Save more with bundled offers</h2>
          <p>Look out for free delivery tags, accessory bundles, and checkout-only coupon offers on selected products.</p>
        </div>
        <ShoppingBag size={24} />
      </section>
    </main>
  );
}
