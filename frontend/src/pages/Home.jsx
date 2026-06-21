import { useEffect, useState } from 'react';
import HeroSlider from '../components/HeroSlider';
import CategoryGrid from '../components/CategoryGrid';
import ProductSlider from '../components/ProductSlider';
import { getHomepageContent } from '../services/api';

export default function Home() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    getHomepageContent().then((response) => setContent(response.data)).catch(() => setContent(null));
  }, []);

  return (
    <main>
      <HeroSlider slides={content?.heroSlides} />
      <CategoryGrid />
      <ProductSlider title="Best In Sales" />
    </main>
  );
}
