import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { resetPassword } from '../services/api';
import { AuthFrame, Field, SubmitButton, TextInput } from '../components/AuthFormLayout';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { data } = await resetPassword({ token, password: form.password });
      toast.success(data.message);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthFrame title="Reset link missing" subtitle="Request a new password reset link to continue.">
        <Link to="/forgot-password" style={{ color: 'var(--brand)', fontWeight: 600 }}>
          Request reset link
        </Link>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame title="Choose a new password" subtitle="Use at least 6 characters for your new password.">
      <form onSubmit={handleSubmit}>
        <Field label="New password" icon={<Lock size={16} />}>
          <PasswordInput
            value={form.password}
            placeholder="New password"
            showPw={showPw}
            setShowPw={setShowPw}
            onChange={(password) => setForm({ ...form, password })}
          />
        </Field>

        <Field label="Confirm password" icon={<Lock size={16} />}>
          <TextInput
            type={showPw ? 'text' : 'password'}
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            minLength={6}
            required
          />
        </Field>

        <SubmitButton loading={loading}>
          {loading ? 'Saving...' : 'Reset password'}
        </SubmitButton>
      </form>
    </AuthFrame>
  );
}

function PasswordInput({ value, placeholder, showPw, setShowPw, onChange }) {
  return (
    <div style={{ position: 'relative' }}>
      <TextInput
        type={showPw ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        minLength={6}
        required
        style={{ paddingRight: '42px' }}
      />
      <button
        type="button"
        onClick={() => setShowPw(!showPw)}
        style={eyeButtonStyle}
        aria-label={showPw ? 'Hide password' : 'Show password'}
      >
        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

const eyeButtonStyle = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer',
};
