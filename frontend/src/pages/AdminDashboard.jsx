import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Boxes,
  ClipboardList,
  Plus,
  Save,
  Settings,
  Trash2,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  createProduct,
  deleteProduct,
  deleteUser,
  getAdminStats,
  getOrders,
  getProducts,
  getUsers,
  updateOrderStatus,
  updateProduct,
  updateUser,
} from '../services/api';

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  image: '',
  category: '',
  brand: '',
  stock: '',
  isFeatured: false,
};

const tabs = [
  { key: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
  { key: 'products', label: 'Products', icon: <Boxes size={16} /> },
  { key: 'orders', label: 'Orders', icon: <ClipboardList size={16} /> },
  { key: 'users', label: 'Users', icon: <Users size={16} /> },
  { key: 'settings', label: 'Settings', icon: <Settings size={16} /> },
];

const currency = (amount) => `\u20a6${Number(amount || 0).toLocaleString()}`;

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const loadAdminData = async () => {
    const [statsResponse, productsResponse, ordersResponse, usersResponse] = await Promise.all([
      getAdminStats(),
      getProducts(),
      getOrders(),
      getUsers(),
    ]);
    setStats(statsResponse.data);
    setProducts(productsResponse.data);
    setOrders(ordersResponse.data);
    setUsers(usersResponse.data);
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

    loadAdminData().catch((error) => {
      toast.error(error.response?.data?.message || 'Failed to load admin dashboard');
    });
  }, [navigate, user]);

  const orderStatusSummary = useMemo(() => {
    if (!stats?.salesByStatus) return [];
    return Object.entries(stats.salesByStatus);
  }, [stats]);

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(productForm).forEach(([key, value]) => formData.append(key, value));
    if (imageFile) formData.append('imageFile', imageFile);

    try {
      if (editingProductId) {
        await updateProduct(editingProductId, formData);
        toast.success('Product updated');
      } else {
        await createProduct(formData);
        toast.success('Product added');
      }
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
    setProductForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      image: product.image || '',
      category: product.category || '',
      brand: product.brand || '',
      stock: product.stock || '',
      isFeatured: Boolean(product.isFeatured),
    });
    setActiveTab('products');
  };

  const handleDeleteProduct = async (id) => {
    await deleteProduct(id);
    toast.success('Product deleted');
    await loadAdminData();
  };

  const handleStatusChange = async (id, status) => {
    await updateOrderStatus(id, status);
    toast.success('Order status updated');
    await loadAdminData();
  };

  const handleAdminToggle = async (selectedUser) => {
    await updateUser(selectedUser._id, { ...selectedUser, isAdmin: !selectedUser.isAdmin });
    toast.success('User updated');
    await loadAdminData();
  };

  if (!user?.isAdmin) return null;

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <h1>Admin</h1>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? 'active' : ''}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </aside>

      <section className="admin-content">
        {activeTab === 'overview' && (
          <>
            <div className="section-heading">
              <div>
                <p className="eyebrow">Analytics</p>
                <h2>Sales Overview</h2>
              </div>
            </div>
            <div className="metric-grid">
              <Metric label="Total sales" value={currency(stats?.sales)} />
              <Metric label="Orders" value={stats?.ordersCount || 0} />
              <Metric label="Pending orders" value={stats?.pendingOrders || 0} />
              <Metric label="Products" value={stats?.productsCount || 0} />
              <Metric label="Users" value={stats?.usersCount || 0} />
            </div>
            <div className="admin-card">
              <h3>Sales by status</h3>
              <div className="analytics-bars">
                {orderStatusSummary.length === 0 ? <p className="muted">No sales data yet.</p> : orderStatusSummary.map(([status, value]) => (
                  <div key={status}>
                    <span>{status}</span>
                    <strong>{currency(value)}</strong>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'products' && (
          <div className="admin-grid">
            <form className="admin-card form-grid" onSubmit={handleProductSubmit}>
              <h3>{editingProductId ? 'Edit Product' : 'Add Product'}</h3>
              {['name', 'description', 'price', 'image', 'category', 'brand', 'stock'].map((field) => (
                <label key={field}>
                  {field}
                  <input
                    value={productForm[field]}
                    onChange={(event) => setProductForm({ ...productForm, [field]: event.target.value })}
                    required={['name', 'description', 'price', 'category', 'stock'].includes(field)}
                  />
                </label>
              ))}
              <label>
                Upload image
                <input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files[0])} />
              </label>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={productForm.isFeatured}
                  onChange={(event) => setProductForm({ ...productForm, isFeatured: event.target.checked })}
                />
                Featured product
              </label>
              <button type="submit"><Save size={16} /> Save product</button>
            </form>
            <div className="admin-card">
              <h3>Manage Products</h3>
              <div className="table-wrap">
                <table className="data-table">
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{currency(product.price)}</td>
                        <td>{product.stock}</td>
                        <td className="row-actions">
                          <button onClick={() => startEditProduct(product)}><Plus size={14} /> Edit</button>
                          <button onClick={() => handleDeleteProduct(product._id)}><Trash2 size={14} /> Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="admin-card">
            <h3>View Orders</h3>
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Customer</th><th>Total</th><th>Status</th><th>Update</th></tr></thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order.user?.name || 'Customer'}</td>
                      <td>{currency(order.totalPrice)}</td>
                      <td><span className="status-pill">{order.status}</span></td>
                      <td>
                        <select value={order.status} onChange={(event) => handleStatusChange(order._id, event.target.value)}>
                          {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-card">
            <h3>Manage Users</h3>
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.map((selectedUser) => (
                    <tr key={selectedUser._id}>
                      <td>{selectedUser.name}</td>
                      <td>{selectedUser.email}</td>
                      <td>{selectedUser.isAdmin ? 'Admin' : 'Customer'}</td>
                      <td className="row-actions">
                        <button onClick={() => handleAdminToggle(selectedUser)}>
                          {selectedUser.isAdmin ? 'Remove admin' : 'Make admin'}
                        </button>
                        <button onClick={async () => { await deleteUser(selectedUser._id); await loadAdminData(); }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="admin-card settings-list">
            <h3>Settings</h3>
            <label><span>Store name</span><input defaultValue="ifeco" /></label>
            <label><span>Default payment</span><input defaultValue="Pay on delivery" /></label>
            <label><span>Support email</span><input defaultValue="support@ifeco.test" /></label>
          </div>
        )}
      </section>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
