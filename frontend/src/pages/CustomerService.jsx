import { Link } from 'react-router-dom';
import { Headphones, HelpCircle, PackageSearch, RefreshCcw, ShieldCheck, Truck } from 'lucide-react';

const serviceCards = [
  { icon: <PackageSearch size={22} />, title: 'Track your order', text: 'Check delivery progress, payment status, and order history.', to: '/track-order' },
  { icon: <RefreshCcw size={22} />, title: 'Returns & refunds', text: 'Start a return request and learn refund timelines.', to: '/returns' },
  { icon: <Truck size={22} />, title: 'Shipping information', text: 'View delivery options, fees, and estimated arrival windows.', to: '/shipping' },
  { icon: <Headphones size={22} />, title: 'Contact support', text: 'Reach our care team for account, payment, or order help.', to: '/contact' },
];

const faqs = [
  'How do I change or cancel an order?',
  'When will my package arrive?',
  'How do I return an item?',
  'What payment methods are accepted?',
  'How do I update my delivery address?',
];

export default function CustomerService() {
  return (
    <main className="commerce-page">
      <section className="service-hero">
        <p className="eyebrow">Customer Service</p>
        <h1>How can we help you today?</h1>
        <p>Find quick answers for orders, delivery, returns, refunds, payments, and account support.</p>
        <div className="service-search">
          <HelpCircle size={18} />
          <input placeholder="Search help topics, orders, returns, shipping..." />
        </div>
      </section>

      <section className="commerce-section">
        <div className="service-card-grid">
          {serviceCards.map((card) => (
            <Link key={card.title} to={card.to} className="service-card">
              {card.icon}
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="commerce-section service-layout">
        <div className="support-panel">
          <p className="eyebrow">Popular Questions</p>
          <h2>Frequently asked questions</h2>
          {faqs.map((question) => (
            <Link key={question} to="/faqs">
              {question}
            </Link>
          ))}
        </div>
        <div className="support-panel">
          <p className="eyebrow">Support Resources</p>
          <h2>Helpful policies</h2>
          <p>Review our shopping policies before and after placing an order.</p>
          <div className="policy-links">
            <Link to="/shipping"><Truck size={16} /> Shipping Policy</Link>
            <Link to="/returns"><RefreshCcw size={16} /> Return Policy</Link>
            <Link to="/faqs"><ShieldCheck size={16} /> FAQs</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
