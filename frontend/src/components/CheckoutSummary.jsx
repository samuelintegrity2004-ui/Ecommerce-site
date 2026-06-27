import { ArrowRight } from 'lucide-react';
import { resolveAssetUrl } from '../services/api';

const formatCurrency = (amount) => `₦${Number(amount || 0).toLocaleString()}`;

export default function CheckoutSummary({ cart, onPlaceOrder, showItems = false, compact = false }) {
  const subtotal = cart.totalPrice || 0;
  const shipping = 0;
  const taxes = 0;
  const total = subtotal + shipping + taxes;

  return (
    <section className={`checkout-summary ${compact ? 'compact' : ''}`}>
      <h2>Order Summary</h2>

      {showItems && (
        <div className="summary-item-list">
          {cart.items.map((item) => (
            <article key={item.product} className="summary-item">
              <img src={resolveAssetUrl(item.image)} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>Qty: {item.quantity}</p>
              </div>
              <strong>{formatCurrency(Number(item.price) * Number(item.quantity))}</strong>
            </article>
          ))}
        </div>
      )}

      <div className="summary-total-list">
        <SummaryRow label="Product subtotal" value={formatCurrency(subtotal)} />
        <SummaryRow label="Shipping fee" value={shipping ? formatCurrency(shipping) : 'Free'} valueColor="#16a34a" />
        <SummaryRow label="Taxes" value={taxes ? formatCurrency(taxes) : formatCurrency(0)} />
        <div className="summary-divider" />
        <SummaryRow label="Total amount" value={formatCurrency(total)} bold />
      </div>

      <button className="place-order-button" onClick={onPlaceOrder}>
        Place Order <ArrowRight size={18} />
      </button>
    </section>
  );
}

function SummaryRow({ label, value, bold, valueColor }) {
  return (
    <div className={`summary-row ${bold ? 'bold' : ''}`}>
      <span>{label}</span>
      <strong style={{ color: valueColor || undefined }}>{value}</strong>
    </div>
  );
}
