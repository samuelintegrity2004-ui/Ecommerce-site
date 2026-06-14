import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/api';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { redirectTo: '/profile' } });
      return;
    }

    getUserProfile()
      .then(({ data }) => setProfile({ ...user, ...data }))
      .catch(() => setProfile(user));
  }, [navigate, user]);

  if (!profile) return null;

  return (
    <main className="account-page">
      <section className="account-panel">
        <div>
          <p className="eyebrow">Account</p>
          <h1>My Profile</h1>
        </div>
        <div className="profile-grid">
          <Info icon={<User size={18} />} label="Name" value={profile.name} />
          <Info icon={<Mail size={18} />} label="Email" value={profile.email} />
          <Info icon={<Shield size={18} />} label="Role" value={profile.isAdmin ? 'Administrator' : 'Customer'} />
        </div>
        <div className="account-actions">
          <Link to="/orders">View Order History</Link>
          {profile.isAdmin && <Link to="/admin">Open Admin Dashboard</Link>}
        </div>
      </section>
    </main>
  );
}

function Info({ icon, label, value }) {
  return (
    <article className="info-tile">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
