import { useEffect, useState } from 'react';
import HeroSlider from '../components/HeroSlider';
import CategoryGrid from '../components/CategoryGrid';
import ProductSlider from '../components/ProductSlider';
import { getHomepageContent } from '../services/api';

export default function Home() {
  const [content, setContent] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    getHomepageContent().then((response) => setContent(response.data)).catch(() => setContent(null));
  }, []);

  return (
    <main>
      <HeroSlider slides={content?.heroSlides} />
      <CategoryGrid />
      <ProductSlider title="Best In Sales" />
      <section className={`ifeco-about ${aboutOpen ? 'expanded' : ''}`}>
        <div>
          <h2>Ifeco</h2>
          <div className="ifeco-about-copy">
            <p><strong>Ifeco</strong> is one of Africa's emerging e-commerce platforms, committed to providing customers with a fast, secure, and convenient online shopping experience. We offer a wide selection of quality products across categories including electronics, fashion, home appliances, beauty, groceries, and more all at competitive prices.</p>
            <p>Our mission is to make online shopping simple, reliable, and accessible to everyone by delivering excellent customer service, secure payment options, and dependable nationwide delivery. Whether you're looking for everyday essentials or the latest products, Ifeco is your trusted destination for quality and value.</p>
          </div>
          <button type="button" onClick={() => setAboutOpen((open) => !open)}>
            {aboutOpen ? 'View Less' : 'View More'}
          </button>
        </div>
      </section>
    </main>
  );
}
