import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Share2, MessageCircle, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', marginTop: '40px' }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '48px 24px 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '40px',
      }}>

        {/* Brand */}
        <div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '28px',
            color: '#fff',
            marginBottom: '12px',
          }}>
            ifeco
          </h2>
          <p style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
            Nigeria's premier e-commerce destination for cars, electronics, fashion and more.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[Share2, MessageCircle, Globe].map((Icon, i) => (
              <a key={i} href="#" style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                transition: 'background .2s, color .2s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = 'var(--brand)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = '#1e293b';
                e.currentTarget.style.color = '#94a3b8';
              }}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
            Quick Links
          </h4>
          {['Home', 'Shop', 'Deals', 'New Arrivals', 'Gift Cards'].map(link => (
            <a key={link} href="#" style={{
              display: 'block',
              fontSize: '14px',
              color: '#94a3b8',
              padding: '5px 0',
              transition: 'color .2s',
            }}
            onMouseOver={e => e.currentTarget.style.color = '#fff'}
            onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Support */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
            Support
          </h4>
          {['FAQs', 'Shipping Policy', 'Return Policy', 'Track Order', 'Contact Us'].map(link => (
            <a key={link} href="#" style={{
              display: 'block',
              fontSize: '14px',
              color: '#94a3b8',
              padding: '5px 0',
              transition: 'color .2s',
            }}
            onMouseOver={e => e.currentTarget.style.color = '#fff'}
            onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
            Contact
          </h4>
          {[
            { Icon: MapPin, text: 'Lagos, Nigeria' },
            { Icon: Phone, text: '+234 800 000 0000' },
            { Icon: Mail, text: 'hello@ifeco.com' },
          ].map(({ Icon, text }) => (
            <div key={text} style={{
              display: 'flex',
              gap: '10px',
              padding: '6px 0',
              fontSize: '14px',
              alignItems: 'center',
            }}>
              <Icon size={15} style={{ flexShrink: 0, color: '#f0a500' }} />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid #1e293b',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        maxWidth: '1400px',
        margin: '0 auto',
        fontSize: '13px',
      }}>
        <p>© 2024 ifeco.com, Nig plc. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
            <a key={l} href="#" style={{ color: '#94a3b8', transition: 'color .2s' }}
              onMouseOver={e => e.currentTarget.style.color = '#fff'}
              onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}