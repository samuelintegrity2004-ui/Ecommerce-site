import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Replace these URLs with your own images later
const fallbackSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1400&q=80',
    title: 'Drive Your Dream',
    subtitle: 'Premium vehicles at unbeatable prices',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=1400&q=80',
    title: 'Latest Electronics',
    subtitle: 'Cutting-edge tech, delivered to your door',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1400&q=80',
    title: 'Sport & Fitness',
    subtitle: 'Gear up and perform at your best',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1400&q=80',
    title: 'Style Redefined',
    subtitle: 'Fashion for every occasion',
  },
];

export default function HeroSlider({ slides: managedSlides }) {
  const slides = managedSlides?.length ? managedSlides.map((slide) => ({
    id: slide._id,
    image: slide.bannerImage,
    title: slide.title,
    subtitle: slide.subtitle,
    buttonText: slide.buttonText,
    destinationLink: slide.destinationLink,
  })) : fallbackSlides;
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const navigate = useNavigate();

  const goTo = useCallback((index) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setTransitioning(false);
    }, 300);
  }, [transitioning]);

  const prev = () => goTo(current === 0 ? slides.length - 1 : current - 1);
  const next = () => goTo(current === slides.length - 1 ? 0 : current + 1);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [current]);

  const slide = slides[current] || slides[0];

  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      height: '480px',
      background: '#111',
    }}>
      {/* Slide image */}
      <img
        src={slide.image}
        alt={slide.title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: transitioning ? 0 : 1,
          transition: 'opacity .35s ease',
        }}
      />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, rgba(0,0,0,.65) 0%, rgba(0,0,0,.1) 60%)',
      }} />

      {/* Caption */}
      <div style={{
        position: 'absolute',
        left: '64px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#fff',
        opacity: transitioning ? 0 : 1,
        transition: 'opacity .35s ease',
      }}>
        <p style={{
          fontSize: '13px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          marginBottom: '12px',
          fontWeight: 600,
        }}>
          Featured
        </p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(32px, 4vw, 56px)',
          fontWeight: 700,
          lineHeight: 1.1,
          marginBottom: '14px',
          maxWidth: '480px',
        }}>
          {slide.title}
        </h2>
        <p style={{ fontSize: '16px', color: '#ddd', marginBottom: '28px' }}>
          {slide.subtitle}
        </p>
        <button
          onClick={() => navigate(slide.destinationLink || '/products')}
          style={{
          background: 'var(--accent)',
          color: 'var(--brand-dark)',
          padding: '12px 28px',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 700,
          fontSize: '15px',
          cursor: 'pointer',
          transition: 'transform .2s, background .2s',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {slide.buttonText || 'Shop Now'}
        </button>
      </div>

      {/* Arrows */}
      {[
        { fn: prev, side: 'left', Icon: ChevronLeft },
        { fn: next, side: 'right', Icon: ChevronRight },
      ].map(({ fn, side, Icon }) => (
        <button key={side} onClick={fn} style={{
          position: 'absolute',
          top: '50%',
          [side]: '20px',
          transform: 'translateY(-50%)',
          background: 'rgba(255,255,255,.15)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,.2)',
          color: '#fff',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background .2s',
        }}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,.3)'}
        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,.15)'}
        >
          <Icon size={22} />
        </button>
      ))}

      {/* Dots */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
      }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: i === current ? '24px' : '8px',
            height: '8px',
            borderRadius: '999px',
            background: i === current ? 'var(--accent)' : 'rgba(255,255,255,.5)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all .3s ease',
            padding: 0,
          }} />
        ))}
      </div>
    </div>
  );
}
