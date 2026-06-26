import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { forgotPassword } from '../services/api';
import { AuthFrame, Field, SubmitButton, TextInput } from '../components/AuthFormLayout';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetLink('');

    try {
      const { data } = await forgotPassword({ email });
      toast.success(data.message);

      if (data.resetToken) {
        const link = `${window.location.origin}/reset-password?token=${data.resetToken}`;
        setResetLink(link);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to start password reset');
    } finally {
      setLoading(false);
    }
  };

  const copyResetLink = async () => {
    await navigator.clipboard.writeText(resetLink);
    toast.success('Reset link copied');
  };

  return (
    <AuthFrame title="Reset your password" subtitle="Enter your account email to prepare a reset link.">
      <form onSubmit={handleSubmit}>
        <Field label="Email address" icon={<Mail size={16} />}>
          <TextInput
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>

        <SubmitButton loading={loading}>
          {loading ? 'Preparing...' : 'Send reset link'}
        </SubmitButton>
      </form>

      {resetLink && (
        <div style={noticeStyle}>
          <p style={{ margin: '0 0 10px', color: 'var(--text-muted)', fontSize: '13px' }}>
            Local testing reset link:
          </p>
          <Link to={`/reset-password?token=${new URL(resetLink).searchParams.get('token')}`}>
            Open reset page
          </Link>
          <button type="button" onClick={copyResetLink} style={secondaryButtonStyle}>
            Copy link
          </button>
        </div>
      )}

      <p style={footerTextStyle}>
        Remembered your password?{' '}
        <Link to="/login" style={{ color: 'var(--brand)', fontWeight: 600 }}>Sign in</Link>
      </p>
    </AuthFrame>
  );
}

const secondaryButtonStyle = {
  display: 'block',
  marginTop: '12px',
  padding: '10px 12px',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  background: '#fff',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  fontWeight: 600,
};

const noticeStyle = {
  marginTop: '18px',
  padding: '14px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  background: 'var(--surface-alt)',
  overflowWrap: 'anywhere',
};

const footerTextStyle = {
  textAlign: 'center',
  fontSize: '14px',
  color: 'var(--text-muted)',
  marginTop: '24px',
};
