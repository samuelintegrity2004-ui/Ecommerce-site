import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { getImageProducts, resolveAssetUrl } from '../services/api';
import { useCart } from '../context/CartContext';

const quantityOptions = Array.from({ length: 10 }, (_, index) => index + 1);

const categoryFilters = {
  'latest-models': ['car', 'bike', 'cloth', 'electric-cook', 'fan'],
  hot: ['phone-accessories', 'laptop', 'tv', 'fridge', 'electric-cook', 'hd', 'iron'],
  trending: ['cloth'],
};

const categoryTitles = {
  'latest-models': 'Latest Models',
  hot: 'Hot Deals',
  trending: 'Trending Now',
};

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

export default function CategoryProducts() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const response = await getImageProducts();
        const filters = categoryFilters[category] || [];
        const filteredProducts = filters.length
          ? response.data.filter((product) => filters.includes(product.category))
          : response.data;
        const selectedProducts = shuffle(filteredProducts || []);

        setProducts(selectedProducts);
        setQuantities(Object.fromEntries(selectedProducts.map((product) => [product._id, 1])));
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  const handleAddToCart = async (product) => {
    try {
      await addItem(product._id, quantities[product._id] || 1, product);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to add item to cart');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>Loading products...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 200px)', background: '#f8f8f8', padding: '20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            color: 'var(--brand)',
            marginBottom: '12px',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          <ChevronLeft size={18} /> Back
        </button>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '32px',
          color: 'var(--text-primary)',
          margin: '12px 0 8px 0',
        }}>
          {categoryTitles[category] || 'Products'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
          {products.length} products available
        </p>
      </div>

      <section style={{ maxWidth: '1400px', margin: '24px auto 0' }}>
        {products.length === 0 ? (
          <div style={{
            background: '#fff',
            padding: '40px',
            textAlign: 'center',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>No products found</p>
          </div>
        ) : (
          <div className="product-catalog-grid">
            {products.map((product) => (
              <article key={product._id} className="product-card">
                <div className="product-card-image">
                  <img
                    src={resolveAssetUrl(product.image)}
                    alt={product.name}
                    onError={(event) => {
                      event.currentTarget.src = 'https://via.placeholder.com/240?text=No+Image';
                    }}
                  />
                </div>
                <div className="product-card-body">
                  <h4>{product.name}</h4>
                  <p className="product-price">{'\u20a6'}{product.price.toLocaleString()}</p>
                  <label>
                    Quantity
                    <select
                      value={quantities[product._id] || 1}
                      onChange={(event) => {
                        setQuantities((current) => ({ ...current, [product._id]: Number(event.target.value) }));
                      }}
                    >
                      {quantityOptions.map((quantity) => (
                        <option key={quantity} value={quantity}>{quantity}</option>
                      ))}
                    </select>
                  </label>
                  <button onClick={() => handleAddToCart(product)}>
                    <ShoppingCart size={14} /> Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
