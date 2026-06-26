import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { getImageProducts } from '../services/api';
import { useCart } from '../context/CartContext';

const quantityOptions = Array.from({ length: 10 }, (_, index) => index + 1);

const categoryGroups = {
  cars: ['car', 'bike'],
  electronics: ['phone-accessories', 'laptop', 'tv', 'camera', 'hd', 'fridge'],
  fashion: ['cloth', 'watch'],
  'home-kitchen': ['electric-cook', 'fan', 'bulb', 'iron', 'stanley-cup'],
  sports: ['bike'],
};

const categoryGroupLabels = {
  all: 'All Products',
  cars: 'Cars',
  electronics: 'Electronics',
  fashion: 'Fashion',
  'home-kitchen': 'Home & Kitchen',
  sports: 'Sports',
};

const arrangeProducts = (productList) => {
  const grouped = productList.reduce((groups, product) => {
    const category = product.category || 'other';
    return { ...groups, [category]: [...(groups[category] || []), product] };
  }, {});

  const categories = Object.keys(grouped);
  const arranged = [];

  while (arranged.length < productList.length) {
    categories.forEach((category) => {
      const nextProduct = grouped[category].shift();
      if (nextProduct) arranged.push(nextProduct);
    });
  }

  return arranged;
};

const formatCategory = (category) => {
  if (categoryGroupLabels[category]) return categoryGroupLabels[category];
  if (category === 'all') return 'All Products';
  return category.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function ProductListing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [searchParams] = useSearchParams();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const category = searchParams.get('category') || 'all';
  const categoryGroup = searchParams.get('categoryGroup') || '';
  const keyword = (searchParams.get('keyword') || '').trim().toLowerCase();
  const selectedCategory = categoryGroup || category;
  const groupFilters = categoryGroups[categoryGroup];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getImageProducts();
        const arrangedProducts = arrangeProducts(response.data || []);

        setProducts(arrangedProducts);
        setQuantities(Object.fromEntries(arrangedProducts.map((product) => [product._id, 1])));
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = groupFilters
      ? groupFilters.includes(product.category)
      : category === 'all' || product.category === category;
    const matchesKeyword = !keyword || product.name.toLowerCase().includes(keyword);
    return matchesCategory && matchesKeyword;
  }), [category, groupFilters, keyword, products]);

  const categories = ['all', ...Object.keys(categoryGroups), ...new Set(products.map((product) => product.category))];

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
    <div className="catalog-page">
      <div className="catalog-header">
        <button
          onClick={() => navigate('/')}
          className="catalog-back-button"
        >
          <ChevronLeft size={18} /> Back
        </button>
        <div>
          <h1>{formatCategory(selectedCategory)}</h1>
          <p>{filteredProducts.length} products available</p>
        </div>
      </div>

      <div className="catalog-shell">
        <aside className="catalog-sidebar">
          <h3>Categories</h3>
          <div className="catalog-category-list">
            {categories.map((category) => (
              <button
                key={category}
                className={selectedCategory === category ? 'active' : ''}
                onClick={() => {
                  const params = new URLSearchParams();
                  if (category !== 'all') {
                    if (categoryGroups[category]) params.set('categoryGroup', category);
                    else params.set('category', category);
                  }
                  navigate(`/products${params.toString() ? `?${params.toString()}` : ''}`);
                }}
              >
                {formatCategory(category)}
              </button>
            ))}
          </div>
        </aside>

        <section className="catalog-products">
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>No products found</p>
            </div>
          ) : (
            <div className="product-catalog-grid">
              {filteredProducts.map((product) => (
                <article key={product._id} className="product-card">
                  <div className="product-card-image">
                    <img
                      src={product.image}
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
    </div>
  );
}
