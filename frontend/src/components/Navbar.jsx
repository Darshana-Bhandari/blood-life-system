import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = {
  admin: [
    { to: '/admin', label: 'Dashboard', },
    { to: '/admin/users', label: 'Users', },
    { to: '/admin/donations', label: 'Donations', },
    { to: '/admin/blood-stock', label: 'Blood Stock', },
  ],
  donor: [
    { to: '/donor', label: 'Dashboard', },
    { to: '/donor/donations', label: 'My Donations', },
    { to: '/donor/profile', label: 'Profile', },
  ],
  receiver: [
    { to: '/receiver', label: 'Dashboard', },
    { to: '/receiver/search', label: 'Find Donors', },
    { to: '/receiver/requests', label: 'My Requests', },
    { to: '/receiver/profile', label: 'Profile', },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const links = user ? (NAV_LINKS[user.role] || []) : [];
  const roleLabel = { admin: ' Admin', donor: 'Donor', receiver: 'Receiver' };

  const isActive = (to) => {
    if (to === `/${user?.role}`) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  return (
    <nav style={{
      background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 1)',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
      boxShadow: scrolled ? '0 10px 30px -10px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.05)',
      position: 'sticky', top: 0, zIndex: 100,
      transition: 'all 0.3s ease',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.3)' : '1px solid #f3f4f6'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        {/* Logo */}
        <Link
          to={user ? `/${user.role}` : '/login'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            flexShrink: 0,
            textDecoration: 'none'
          }}
          className="brand-logo"
        >
          <div style={{
            background: 'linear-gradient(135deg, #e53e3e, #9b2c2c)',
            color: 'white',
            width: 38,
            height: 38,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            boxShadow: '0 4px 10px rgba(229, 62, 62, 0.3)',
            transform: 'rotate(-5deg)',
            transition: 'transform 0.3s ease'
          }}>
            🩸
          </div>
          <span style={{
            fontWeight: 800,
            fontSize: '1.35rem',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(90deg, #9b2c2c, #e53e3e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            BloodLife
          </span>
        </Link>

        {/* Desktop nav links */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1, justifyContent: 'center' }} className="nav-links-desktop">
            {links.map(link => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    color: active ? '#c53030' : '#4b5563',
                    padding: '0.5rem 1rem',
                    borderRadius: '99px',
                    fontSize: '0.9rem',
                    fontWeight: active ? 700 : 500,
                    background: active ? '#fff5f5' : 'transparent',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    textDecoration: 'none',
                    position: 'relative'
                  }}
                  onMouseOver={e => {
                    if (!active) {
                      e.currentTarget.style.background = '#f9fafb';
                      e.currentTarget.style.color = '#1f2937';
                    }
                  }}
                  onMouseOut={e => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#4b5563';
                    }
                  }}
                >
                  <span style={{ fontSize: '1.1rem', opacity: active ? 1 : 0.7 }}>{link.icon}</span>
                  {link.label}
                  {active && (
                    <span style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '20px',
                      height: '3px',
                      background: '#c53030',
                      borderRadius: '4px'
                    }} />
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} className="user-profile-nav">
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#111827', fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.2 }} className="nav-username">{user.name}</span>
                  <span style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 500 }} className="role-badge">{roleLabel[user.role]}</span>
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: '#fff5f5',
                  border: '2px solid #fed7d7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#c53030', fontWeight: 'bold', fontSize: '1rem'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  color: '#4b5563',
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = '#c53030';
                  e.currentTarget.style.color = '#c53030';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(197,48,48,0.1)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.color = '#4b5563';
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Link to="/login" style={{
                color: '#4b5563', fontSize: '0.9rem', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '10px', transition: 'all 0.2s', textDecoration: 'none'
              }}
                onMouseOver={e => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#111827'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4b5563'; }}
              >
                Login
              </Link>
              <Link to="/register" style={{
                background: 'linear-gradient(135deg, #e53e3e, #c53030)',
                color: 'white', padding: '0.5rem 1.25rem', borderRadius: '10px',
                fontSize: '0.9rem', fontWeight: 600, boxShadow: '0 4px 12px rgba(197,48,48,0.3)',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none'
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(197,48,48,0.4)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(197,48,48,0.3)'; }}
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          {user && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="nav-hamburger"
              style={{
                background: menuOpen ? '#fef2f2' : 'white',
                border: `1px solid ${menuOpen ? '#fca5a5' : '#e5e7eb'}`,
                color: menuOpen ? '#dc2626' : '#4b5563',
                width: 40, height: 40,
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <span style={{ transform: menuOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                {menuOpen ? '✕' : '☰'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {user && (
        <div style={{
          maxHeight: menuOpen ? '400px' : '0',
          opacity: menuOpen ? 1 : 0,
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: menuOpen ? '1px solid rgba(0,0,0,0.05)' : 'none',
          boxShadow: menuOpen ? '0 10px 20px -5px rgba(0, 0, 0, 0.1)' : 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <div style={{ padding: '0.5rem 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {links.map(link => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    color: active ? '#c53030' : '#4b5563',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: active ? 700 : 500,
                    background: active ? '#fff5f5' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{link.icon}</span>{link.label}
                </Link>
              );
            })}
            <div style={{ borderTop: '1px solid #f3f4f6', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
              <button onClick={handleLogout} style={{
                background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030',
                fontSize: '0.95rem', cursor: 'pointer', padding: '0.75rem 1rem', width: '100%',
                borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem',
                fontWeight: 600, transition: 'all 0.2s', fontFamily: 'inherit'
              }}>
                <span style={{ fontSize: '1.2rem' }}>🚪</span> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
