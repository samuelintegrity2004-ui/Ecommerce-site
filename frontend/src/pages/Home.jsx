import HeroSlider from '../components/HeroSlider';
import CategoryGrid from '../components/CategoryGrid';
import ProductSlider from '../components/ProductSlider';

export default function Home() {
  return (
    <main>
      <HeroSlider />
      <CategoryGrid />
      <ProductSlider title="Best In Sales" />
    </main>
  );
}
