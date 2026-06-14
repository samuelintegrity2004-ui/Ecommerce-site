import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../services/api';

const currency = (amount) => `\u20a6${Number(amount || 0).toLocaleString()}`;

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { redirectTo: '/orders' } });
      return;
    }

    getMyOrders()
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, [navigate, user]);

  if (!user) return null;

  return (
    <main className="account-page">
      <section className="account-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Orders</p>
            <h1>Order History</h1>
          </div>
          <Link to="/products">Continue Shopping</Link>
        </div>

        {loading ? (
          <p className="muted">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <Package size={44} />
            <h2>No orders yet</h2>
            <p>Your placed orders will appear here.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.slice(-8).toUpperCase()}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.orderItems.reduce((total, item) => total + item.quantity, 0)}</td>
                    <td>{currency(order.totalPrice)}</td>
                    <td><span className="status-pill">{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
