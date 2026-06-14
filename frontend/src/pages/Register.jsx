import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/api';
import toast from 'react-hot-toast';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const { data } = await registerUser({ name: form.name, email: form.email, password: form.password });
      login(data);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const fields = [
    { label: 'Full Name', field: 'name', type: 'text', icon: <User size={16}/>, placeholder: 'John Doe' },
    { label: 'Email Address', field: 'email', type: 'email', icon: <Mail size={16}/>, placeholder: 'you@example.com' },
    { label: 'Password', field: 'password', type: 'password', icon: <Lock size={16}/>, placeholder: 'Min 6 characters' },
    { label: 'Confirm Password', field: 'confirm', type: 'password', icon: <Lock size={16}/>, placeholder: 'Repeat password' },
  ];

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        padding: '48px',
        width: '100%',
        maxWidth: '440px',
      }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', marginBottom: '8px' }}>
          Create Account
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '32px' }}>
          Join ifeco — Nigeria's best marketplace
        </p>

        <form onSubmit={handleSubmit}>
          {fields.map(({ label, field, type, icon, placeholder }) => (
            <div key={field} style={{ marginBottom: '18px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '6px',
              }}>
                {icon} {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[field]}
                onChange={update(field)}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '14px',
                  background: 'var(--surface-alt)',
                  outline: 'none',
                }}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              background: loading ? '#ccc' : 'var(--brand)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '15px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px',
            }}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)', marginTop: '24px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--brand)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}