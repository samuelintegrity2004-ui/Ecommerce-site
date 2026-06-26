export function AuthFrame({ title, subtitle, children }) {
  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>{title}</h1>
        <p style={subtitleStyle}>{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, icon, children }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={labelStyle}>
        {icon} {label}
      </label>
      {children}
    </div>
  );
}

export function TextInput({ style, ...props }) {
  return <input {...props} style={{ ...inputStyle, ...style }} />;
}

export function SubmitButton({ loading, children }) {
  return (
    <button type="submit" disabled={loading} style={buttonStyle(loading)}>
      {children}
    </button>
  );
}

const pageStyle = {
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--surface-alt)',
  padding: '40px 24px',
};

const cardStyle = {
  background: '#fff',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-lg)',
  padding: '48px',
  width: '100%',
  maxWidth: '440px',
};

const titleStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '28px',
  color: 'var(--text-primary)',
  marginBottom: '8px',
};

const subtitleStyle = {
  color: 'var(--text-muted)',
  fontSize: '14px',
  marginBottom: '32px',
};

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text-primary)',
  marginBottom: '8px',
};

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  border: '1.5px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '14px',
  color: 'var(--text-primary)',
  background: 'var(--surface-alt)',
  transition: 'border-color .2s',
  outline: 'none',
};

const buttonStyle = (loading) => ({
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
  transition: 'background .2s',
});
