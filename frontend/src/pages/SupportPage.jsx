import { Link, useLocation } from 'react-router-dom';
import { Mail, MapPin, PackageCheck, Phone, RefreshCcw, Truck } from 'lucide-react';

const pages = {
  '/faqs': {
    title: 'Frequently Asked Questions',
    eyebrow: 'FAQs',
    intro: 'Quick answers to common questions about shopping, payment, delivery, returns, and account management.',
    sections: [
      ['Orders', 'You can view orders from your account dashboard, check order status, and reorder previously purchased items.'],
      ['Payments', 'We support secure checkout flows and confirm successful payments before processing delivery.'],
      ['Returns', 'Eligible products can be returned within the published return window when they meet return conditions.'],
      ['Delivery', 'Delivery timelines depend on destination, product type, seller location, and courier availability.'],
    ],
  },
  '/shipping': {
    title: 'Shipping Information',
    eyebrow: 'Shipping Policy',
    intro: 'Learn how delivery works, what affects timelines, and how to prepare for a successful delivery.',
    sections: [
      ['Delivery coverage', 'We support delivery across major locations in Nigeria through trusted logistics partners.'],
      ['Delivery timelines', 'Most stocked items are prepared quickly, with timelines shown during checkout where available.'],
      ['Delivery fees', 'Shipping fees may vary by product weight, delivery city, and selected delivery option.'],
      ['Receiving orders', 'Please keep your phone available and inspect delivered packages before confirming receipt.'],
    ],
  },
  '/returns': {
    title: 'Returns & Refunds',
    eyebrow: 'Return Policy',
    intro: 'Our return process is built to keep shopping clear, fair, and predictable for customers.',
    sections: [
      ['Return eligibility', 'Products must be unused, complete, and returned with original packaging where applicable.'],
      ['How to request a return', 'Open your order details or contact support with your order number and return reason.'],
      ['Refund timelines', 'Refunds are processed after inspection and confirmation of returned item condition.'],
      ['Non-returnable items', 'Some personal care, opened consumables, and final-sale items may not qualify for returns.'],
    ],
  },
  '/track-order': {
    title: 'Track Order',
    eyebrow: 'Order Assistance',
    intro: 'Use your order number and contact details to follow order progress and delivery updates.',
    sections: [
      ['Order confirmation', 'After checkout, you receive order details and payment confirmation where applicable.'],
      ['Processing', 'Your item is packed, verified, and prepared for handover to a delivery partner.'],
      ['In transit', 'Courier delivery updates become available once your package leaves the fulfillment point.'],
      ['Delivered', 'Your order is marked delivered after successful handover at the delivery address.'],
    ],
  },
  '/contact': {
    title: 'Contact Us',
    eyebrow: 'Support Team',
    intro: 'Need direct help? Reach our customer care team for orders, payments, delivery, returns, and account issues.',
    sections: [
      ['Phone', '09151277509'],
      ['Email', 'samuelintegrity2004@gmail.com'],
      ['Office', 'Enugu, Nigeria'],
      ['Support hours', 'Monday to Saturday, 8:00 AM - 7:00 PM'],
    ],
  },
};

const iconMap = {
  '/shipping': <Truck size={24} />,
  '/returns': <RefreshCcw size={24} />,
  '/track-order': <PackageCheck size={24} />,
  '/contact': <Phone size={24} />,
};

export default function SupportPage() {
  const { pathname } = useLocation();
  const page = pages[pathname] || pages['/faqs'];

  return (
    <main className="commerce-page">
      <section className="support-hero">
        {iconMap[pathname] || <Mail size={24} />}
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.title}</h1>
        <p>{page.intro}</p>
      </section>

      <section className="commerce-section">
        <div className="support-detail-grid">
          {page.sections.map(([title, text]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="info-band">
        <MapPin size={22} />
        <div>
          <h2>Still need help?</h2>
          <p>Our support team can help you with order details, product questions, delivery updates, and return requests.</p>
        </div>
        <Link to="/customer-service">Visit help center</Link>
      </section>
    </main>
  );
}
