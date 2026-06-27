import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Sparkles, Truck } from 'lucide-react';
import { resolveAssetUrl } from '../services/api';

const arrivalGroups = [
  {
    title: 'Electronics',
    href: '/products?categoryGroup=electronics',
    products: [
      { name: 'Business Laptop', image: '/images/laptop-1.jpg' },
      { name: 'Smart LED TV', image: '/images/tv-2.jpg' },
      { name: 'Wireless Headphones', image: '/images/hd-2.jpg' },
    ],
  },
  {
    title: 'Fashion',
    href: '/products?categoryGroup=fashion',
    products: [
      { name: 'Designer Jeans', image: '/images/cloth_2.jpg' },
      { name: 'Casual Polo Shirt', image: '/images/cloth_3.jpg' },
      { name: 'Digital Smartwatch', image: '/images/watch-1.jpg' },
    ],
  },
  {
    title: 'Home & Kitchen',
    href: '/products?categoryGroup=home-kitchen',
    products: [
      { name: 'Electric Cooker', image: '/images/electric-cook-2.jpg' },
      { name: 'Side-by-Side Fridge', image: '/images/fridge-1.jpg' },
      { name: 'Steam Iron', image: '/images/iron-1.jpg' },
    ],
  },
];

export default function NewArrivals() {
  return (
    <main className="commerce-page">
      <section className="commerce-hero arrivals-hero">
        <div>
          <p className="eyebrow">New Arrivals</p>
          <h1>Recently added products across your favorite departments.</h1>
          <p>Explore fresh electronics, fashion, home essentials, and everyday upgrades curated for Nigerian shoppers.</p>
          <Link to="/products?sort=newest">Shop newest items</Link>
        </div>
      </section>

      <section className="promo-strip">
        {[
          { icon: <Sparkles size={20} />, title: 'Fresh Stock', text: 'New product selections added regularly.' },
          { icon: <BadgeCheck size={20} />, title: 'Quality Checked', text: 'Listings are organized for easier browsing.' },
          { icon: <Truck size={20} />, title: 'Ready to Deliver', text: 'Shop items prepared for nationwide delivery.' },
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
            <p className="eyebrow">Just In</p>
            <h2>Shop by new category</h2>
          </div>
        </div>
        <div className="arrival-group-grid">
          {arrivalGroups.map((group) => (
            <article key={group.title} className="arrival-group">
              <div>
                <h3>{group.title}</h3>
                <Link to={group.href}>View category <ArrowRight size={15} /></Link>
              </div>
              <div className="arrival-products">
                {group.products.map((product) => (
                  <Link key={product.name} to={group.href}>
                    <img src={resolveAssetUrl(product.image)} alt={product.name} />
                    <span>{product.name}</span>
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
