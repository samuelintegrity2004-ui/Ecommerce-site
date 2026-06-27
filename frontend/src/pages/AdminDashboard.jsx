import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Bell, Boxes, ChevronLeft, ChevronRight, ClipboardList, Edit3,
  Home, LayoutDashboard, Moon, MoreVertical, PanelLeftClose, PanelLeftOpen,
  Save, Search, Settings, Sparkles, Sun, Trash2, Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  bulkAssignProductSections,
  createHeroSlide,
  createProduct,
  deleteHeroSlide,
  deleteProduct,
  deleteUser,
  getAdminStats,
  getHomepageSettings,
  getOrders,
  getProducts,
  getUsers,
  updateHomepageSettings,
  updateHeroSlide,
  updateOrderStatus,
  updateProduct,
  updateUser,
  resolveAssetUrl,
} from '../services/api';

const sectionOptions = [
  { key: 'todaysDeal', label: "Today's Deal" },
  { key: 'newArrival', label: 'New Arrival' },
  { key: 'latestModel', label: 'Latest Model' },
  { key: 'hot', label: 'Hot' },
  { key: 'trending', label: 'Trending Now' },
];

const emptyProduct = {
  name: '', description: '', price: '', image: '', category: '', brand: '',
  stock: '', isFeatured: false, sections: [],
};

const emptySlide = {
  product: '', bannerImage: '', title: '', subtitle: '',
  buttonText: 'Shop Now', destinationLink: '/products', isActive: true,
};

const tabs = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'products', label: 'Products', icon: Boxes },
  { key: 'homepage', label: 'Homepage', icon: Home },
  { key: 'orders', label: 'Orders', icon: ClipboardList },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const currency = (amount) => `₦${Number(amount || 0).toLocaleString()}`;

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [homepage, setHomepage] = useState(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [slideForm, setSlideForm] = useState(emptySlide);
  const [editingSlideId, setEditingSlideId] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [query, setQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkSections, setBulkSections] = useState([]);

  const loadAdminData = async () => {
    const [statsResponse, productsResponse, ordersResponse, usersResponse, homepageResponse] = await Promise.all([
      getAdminStats(), getProducts(), getOrders(), getUsers(), getHomepageSettings(),
    ]);
    setStats(statsResponse.data);
    setProducts(Array.isArray(productsResponse.data) ? productsResponse.data : productsResponse.data.products || []);
    setOrders(ordersResponse.data);
    setUsers(usersResponse.data);
    setHomepage(homepageResponse.data);
  };

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { redirectTo: '/admin' } });
      return;
    }
    if (!user.isAdmin) {
      navigate('/profile');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAdminData().catch((error) => toast.error(error.response?.data?.message || 'Failed to load admin dashboard'));
  }, [navigate, user]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery = [product.name, product.category, product.brand].join(' ').toLowerCase().includes(query.toLowerCase());
      const matchesSection = sectionFilter === 'all' || product.sections?.includes(sectionFilter);
      return matchesQuery && matchesSection;
    });
  }, [products, query, sectionFilter]);

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  const chartData = useMemo(() => {
    const revenue = Object.entries(stats?.monthlyRevenue || {});
    const ordersByMonth = Object.entries(stats?.orderAnalytics || {});
    const maxRevenue = Math.max(...revenue.map(([, value]) => value), 1);
    const maxOrders = Math.max(...ordersByMonth.map(([, value]) => value), 1);
    return { revenue, ordersByMonth, maxRevenue, maxOrders };
  }, [stats]);

  const saveProduct = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(productForm).forEach(([key, value]) => {
      formData.append(key, key === 'sections' ? JSON.stringify(value) : value);
    });
    if (imageFile) formData.append('imageFile', imageFile);
    try {
      if (editingProductId) await updateProduct(editingProductId, formData);
      else await createProduct(formData);
      toast.success(editingProductId ? 'Product updated' : 'Product added');
      setProductForm(emptyProduct);
      setEditingProductId(null);
      setImageFile(null);
      await loadAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Product save failed');
    }
  };

  const startEditProduct = (product) => {
    setEditingProductId(product._id);
    setProductForm({ ...emptyProduct, ...product, sections: product.sections || [] });
    setActiveTab('products');
  };

  const removeProduct = async (id) => {
    await deleteProduct(id);
    toast.success('Product deleted');
    await loadAdminData();
  };

  const toggleProductSection = (key) => {
    setProductForm((current) => ({
      ...current,
      sections: current.sections.includes(key)
        ? current.sections.filter((section) => section !== key)
        : [...current.sections, key],
    }));
  };

  const runBulkAssign = async () => {
    await bulkAssignProductSections({ productIds: selectedProducts, sections: bulkSections, mode: 'replace' });
    toast.success('Sections assigned');
    setSelectedProducts([]);
    await loadAdminData();
  };

  const saveSlide = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(slideForm).forEach(([key, value]) => formData.append(key, value));
    if (bannerFile) formData.append('bannerFile', bannerFile);
    if (editingSlideId) await updateHeroSlide(editingSlideId, formData);
    else await createHeroSlide(formData);
    toast.success(editingSlideId ? 'Hero slide updated' : 'Hero slide added');
    setSlideForm(emptySlide);
    setEditingSlideId(null);
    setBannerFile(null);
    await loadAdminData();
  };

  const startEditSlide = (slide) => {
    setEditingSlideId(slide._id);
    setSlideForm({
      product: slide.product?._id || slide.product || '',
      bannerImage: slide.bannerImage || '',
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      buttonText: slide.buttonText || 'Shop Now',
      destinationLink: slide.destinationLink || '/products',
      isActive: Boolean(slide.isActive),
    });
  };

  const saveHomepageSections = async (sections) => {
    await updateHomepageSettings({ sections });
    toast.success('Homepage settings saved');
    await loadAdminData();
  };

  if (!user?.isAdmin) return null;

  return (
    <main className={`admin-pro ${darkMode ? 'admin-dark' : ''}`}>
      <aside className={`admin-pro-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="admin-brand"><Sparkles size={20} /><span>ifeco Admin</span></div>
        <nav>
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} className={activeTab === key ? 'active' : ''} onClick={() => setActiveTab(key)}>
              <Icon size={18} /><span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <section className="admin-pro-main">
        <header className="admin-topbar">
          <button className="icon-button" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
          <div><p>Admin workspace</p><h1>{tabs.find((tab) => tab.key === activeTab)?.label}</h1></div>
          <div className="topbar-actions">
            <button className="icon-button" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle dark mode">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="icon-button" aria-label="Notifications"><Bell size={18} /><span className="dot" /></button>
            <div className="profile-menu">
              <button onClick={() => setProfileOpen(!profileOpen)}>{user.name?.[0] || 'A'} <MoreVertical size={16} /></button>
              {profileOpen && <div><strong>{user.name}</strong><span>{user.email}</span></div>}
            </div>
          </div>
        </header>

        <div className="admin-pro-content">
          {activeTab === 'overview' && (
            <>
              <div className="kpi-grid">
                <Kpi icon={BarChart3} label="Revenue" value={currency(stats?.sales)} trend="+12.4%" />
                <Kpi icon={ClipboardList} label="Orders" value={stats?.ordersCount || 0} trend={`${stats?.pendingOrders || 0} open`} />
                <Kpi icon={Boxes} label="Products" value={stats?.productsCount || 0} trend="Live catalog" />
                <Kpi icon={Users} label="Customers" value={stats?.usersCount || 0} trend="Registered" />
              </div>
              <div className="analytics-grid">
                <ChartCard title="Revenue analytics" data={chartData.revenue} max={chartData.maxRevenue} format={currency} />
                <ChartCard title="Order analytics" data={chartData.ordersByMonth} max={chartData.maxOrders} />
              </div>
              <div className="admin-panel">
                <h2>Sales by status</h2>
                <div className="status-grid">
                  {Object.entries(stats?.salesByStatus || {}).map(([status, value]) => (
                    <div key={status}><span>{status}</span><strong>{currency(value)}</strong></div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'products' && (
            <div className="product-management">
              <form className="admin-panel product-form" onSubmit={saveProduct}>
                <h2>{editingProductId ? 'Edit product' : 'Add product'}</h2>
                {['name', 'description', 'price', 'image', 'category', 'brand', 'stock'].map((field) => (
                  <label key={field}>{field}<input value={productForm[field] || ''} onChange={(e) => setProductForm({ ...productForm, [field]: e.target.value })} required={['name', 'description', 'price', 'category', 'stock'].includes(field)} /></label>
                ))}
                <label>Upload image<input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} /></label>
                <div className="check-group"><span>Display Sections</span>{sectionOptions.filter((s) => s.key !== 'newArrival').map((section) => (
                  <label key={section.key}><input type="checkbox" checked={productForm.sections.includes(section.key)} onChange={() => toggleProductSection(section.key)} />{section.label}</label>
                ))}</div>
                <button className="primary-button" type="submit"><Save size={16} /> Save product</button>
              </form>

              <div className="admin-panel">
                <div className="table-tools">
                  <label className="search-box"><Search size={16} /><input placeholder="Search products" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} /></label>
                  <select value={sectionFilter} onChange={(e) => { setSectionFilter(e.target.value); setPage(1); }}>
                    <option value="all">All sections</option>
                    {sectionOptions.map((section) => <option key={section.key} value={section.key}>{section.label}</option>)}
                  </select>
                </div>
                <div className="bulk-bar">
                  <span>{selectedProducts.length} selected</span>
                  {sectionOptions.filter((s) => s.key !== 'newArrival').map((section) => (
                    <label key={section.key}><input type="checkbox" checked={bulkSections.includes(section.key)} onChange={() => setBulkSections((current) => current.includes(section.key) ? current.filter((item) => item !== section.key) : [...current, section.key])} />{section.label}</label>
                  ))}
                  <button disabled={!selectedProducts.length} onClick={runBulkAssign}>Apply</button>
                </div>
                <ProductTable products={paginatedProducts} selected={selectedProducts} setSelected={setSelectedProducts} edit={startEditProduct} remove={removeProduct} />
                <Pagination page={page} totalPages={totalPages} setPage={setPage} />
              </div>
            </div>
          )}

          {activeTab === 'homepage' && (
            <div className="homepage-grid">
              <form className="admin-panel product-form" onSubmit={saveSlide}>
                <h2>{editingSlideId ? 'Edit hero slide' : 'Add hero slide'}</h2>
                <label>Featured product<select value={slideForm.product} onChange={(e) => setSlideForm({ ...slideForm, product: e.target.value })}><option value="">No product</option>{products.map((product) => <option key={product._id} value={product._id}>{product.name}</option>)}</select></label>
                {['bannerImage', 'title', 'subtitle', 'buttonText', 'destinationLink'].map((field) => (
                  <label key={field}>{field}<input value={slideForm[field]} onChange={(e) => setSlideForm({ ...slideForm, [field]: e.target.value })} required={['bannerImage', 'title'].includes(field) && !bannerFile} /></label>
                ))}
                <label>Upload banner<input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files[0])} /></label>
                <label className="inline-check"><input type="checkbox" checked={slideForm.isActive} onChange={(e) => setSlideForm({ ...slideForm, isActive: e.target.checked })} />Active slide</label>
                <button className="primary-button" type="submit"><Save size={16} /> Save slide</button>
              </form>
              <div className="admin-panel">
                <h2>Hero carousel</h2>
                <div className="slide-list">{homepage?.heroSlides?.sort((a, b) => a.order - b.order).map((slide) => (
                  <article key={slide._id} className="slide-row">
                    <img src={resolveAssetUrl(slide.bannerImage)} alt={slide.title} />
                    <div><strong>{slide.title}</strong><span>{slide.subtitle}</span><small>{slide.product?.name || 'Custom banner'}</small></div>
                    <button onClick={() => startEditSlide(slide)}><Edit3 size={15} /></button>
                    <button onClick={async () => { await deleteHeroSlide(slide._id); await loadAdminData(); }}><Trash2 size={15} /></button>
                  </article>
                ))}</div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && <OrdersPanel orders={orders} update={async (id, status) => { await updateOrderStatus(id, status); await loadAdminData(); }} />}
          {activeTab === 'users' && <UsersPanel users={users} refresh={loadAdminData} />}
          {activeTab === 'settings' && <HomepageSettingsPanel homepage={homepage} save={saveHomepageSections} />}
        </div>
      </section>
    </main>
  );
}

function Kpi({ icon: Icon, label, value, trend }) {
  return <article className="kpi-card"><span><Icon size={18} /></span><p>{label}</p><strong>{value}</strong><small>{trend}</small></article>;
}

function ChartCard({ title, data, max, format = (value) => value }) {
  return (
    <section className="admin-panel chart-card"><h2>{title}</h2>
      <div className="bar-chart">{data.length ? data.map(([label, value]) => (
        <div key={label} className="bar-item"><span style={{ height: `${Math.max(10, (value / max) * 100)}%` }} title={format(value)} /><small>{label}</small></div>
      )) : <p className="muted">No analytics yet.</p>}</div>
    </section>
  );
}

function ProductTable({ products, selected, setSelected, edit, remove }) {
  const toggle = (id) => setSelected(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  return (
    <div className="table-wrap"><table className="data-table pro-table"><thead><tr><th></th><th>Product</th><th>Price</th><th>Stock</th><th>Sections</th><th>Actions</th></tr></thead><tbody>
      {products.map((product) => <tr key={product._id}>
        <td><input type="checkbox" checked={selected.includes(product._id)} onChange={() => toggle(product._id)} /></td>
        <td><div className="product-cell"><img src={resolveAssetUrl(product.image)} alt={product.name} /><span>{product.name}</span></div></td>
        <td>{currency(product.price)}</td><td>{product.stock}</td>
        <td><div className="pill-wrap">{(product.sections || []).map((section) => <span key={section}>{sectionOptions.find((item) => item.key === section)?.label || section}</span>)}</div></td>
        <td className="row-actions"><button onClick={() => edit(product)}><Edit3 size={14} />Edit</button><button onClick={() => remove(product._id)}><Trash2 size={14} />Delete</button></td>
      </tr>)}
    </tbody></table></div>
  );
}

function Pagination({ page, totalPages, setPage }) {
  return <div className="pagination"><button disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft size={16} /></button><span>Page {page} of {totalPages}</span><button disabled={page === totalPages} onClick={() => setPage(page + 1)}><ChevronRight size={16} /></button></div>;
}

function OrdersPanel({ orders, update }) {
  return <div className="admin-panel"><h2>Orders</h2><div className="table-wrap"><table className="data-table"><thead><tr><th>Customer</th><th>Total</th><th>Status</th><th>Update</th></tr></thead><tbody>{orders.map((order) => <tr key={order._id}><td>{order.user?.name || 'Customer'}</td><td>{currency(order.totalPrice)}</td><td><span className="status-pill">{order.status}</span></td><td><select value={order.status} onChange={(e) => update(order._id, e.target.value)}>{['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div></div>;
}

function UsersPanel({ users, refresh }) {
  return <div className="admin-panel"><h2>Users</h2><div className="table-wrap"><table className="data-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead><tbody>{users.map((selectedUser) => <tr key={selectedUser._id}><td>{selectedUser.name}</td><td>{selectedUser.email}</td><td>{selectedUser.isAdmin ? 'Admin' : 'Customer'}</td><td className="row-actions"><button onClick={async () => { await updateUser(selectedUser._id, { ...selectedUser, isAdmin: !selectedUser.isAdmin }); await refresh(); }}>{selectedUser.isAdmin ? 'Remove admin' : 'Make admin'}</button><button onClick={async () => { await deleteUser(selectedUser._id); await refresh(); }}>Delete</button></td></tr>)}</tbody></table></div></div>;
}

function HomepageSettingsPanel({ homepage, save }) {
  const [sections, setSections] = useState(homepage?.sections || []);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setSections(homepage?.sections || []), [homepage]);
  const updateSection = (key, patch) => setSections((current) => current.map((section) => section.key === key ? { ...section, ...patch } : section));
  return <div className="admin-panel settings-panel"><h2>Homepage Settings</h2>{sections.sort((a, b) => a.order - b.order).map((section) => <div key={section.key} className="settings-row"><label><input type="checkbox" checked={section.enabled} onChange={(e) => updateSection(section.key, { enabled: e.target.checked })} />{section.label}</label><input type="number" min="1" value={section.order} onChange={(e) => updateSection(section.key, { order: Number(e.target.value) })} /><input type="number" min="1" max="24" value={section.limit} onChange={(e) => updateSection(section.key, { limit: Number(e.target.value) })} /></div>)}<button className="primary-button" onClick={() => save(sections)}>Save settings</button></div>;
}
