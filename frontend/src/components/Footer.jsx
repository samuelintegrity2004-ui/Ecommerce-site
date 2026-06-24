import { Link } from 'react-router-dom';
import { Globe, Mail, MapPin, MessageCircle, Phone, Share2 } from 'lucide-react';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/products' },
  { label: 'Deals', to: '/deals' },
  { label: 'New Arrivals', to: '/new-arrivals' },
];

const supportLinks = [
  { label: 'FAQs', to: '/faqs' },
  { label: 'Shipping Policy', to: '/shipping' },
  { label: 'Return Policy', to: '/returns' },
  { label: 'Track Order', to: '/track-order' },
  { label: 'Contact Us', to: '/contact' },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <h2>ifeco</h2>
          <p>Nigeria's premier e-commerce destination for cars, electronics, fashion, home essentials and more.</p>
          <div className="footer-socials">
            {[Share2, MessageCircle, Globe].map((Icon, index) => (
              <a key={index} href="/" aria-label="Social link">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <FooterLinkGroup title="Quick Links" links={quickLinks} />
        <FooterLinkGroup title="Support" links={supportLinks} />

        <div>
          <h4>Contact</h4>
          {[
            { Icon: MapPin, text: 'Lagos, Nigeria' },
            { Icon: Phone, text: '09151277509' },
            { Icon: Mail, text: 'samuelintegrity2004@gmail.com' },
          ].map(({ Icon, text }) => (
            <div key={text} className="footer-contact-row">
              <Icon size={15} />
              {text}
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 ifeco.com, Nig plc. All rights reserved.</p>
        <div>
          <Link to="/faqs">Privacy Policy</Link>
          <Link to="/faqs">Terms of Service</Link>
          <Link to="/faqs">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkGroup({ title, links }) {
  return (
    <div>
      <h4>{title}</h4>
      {links.map((link) => (
        <Link key={link.label} to={link.to} className="footer-link">
          {link.label}
        </Link>
      ))}
    </div>
  );
}
