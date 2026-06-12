import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Menu, X, LayoutDashboard, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleSignOut = () => { signOut(); navigate('/'); };

  const navLinks = [
    { to: '/property',   label: 'Property',   emoji: '🏡' },
    { to: '/matrimonial',label: 'Matrimonial', emoji: '💍' },
    { to: '/ecommerce',  label: 'E-Commerce',  emoji: '🛒' },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-100'
        : 'bg-white shadow-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black gradient-text">Unified Portal</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, emoji }) => (
              <Link key={to} to={to}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive(to)
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                }`}>
                <span>{emoji}</span>{label}
              </Link>
            ))}
            {user && (
              <Link to="/admin"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/admin') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                }`}>
                <LayoutDashboard className="w-4 h-4" />Admin
              </Link>
            )}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}>
                    {user.email?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-600 max-w-28 truncate">{user.email}</span>
                </div>
                <button onClick={handleSignOut}
                  className="flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                  <LogOut className="w-4 h-4" />Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" className="text-gray-600 hover:text-indigo-600 px-4 py-2 text-sm font-semibold transition-all">Sign In</Link>
                <Link to="/auth" className="btn-primary text-sm px-5 py-2.5 rounded-xl">Get Started</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-all" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1 animate-slide-up border-t border-gray-100 pt-3">
            {navLinks.map(({ to, label, emoji }) => (
              <Link key={to} to={to}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive(to) ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'
                }`}>
                <span>{emoji}</span>{label}
              </Link>
            ))}
            {user && (
              <Link to="/admin" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
                <LayoutDashboard className="w-4 h-4" />Admin Dashboard
              </Link>
            )}
            <div className="border-t border-gray-100 pt-3 mt-2">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500">
                    <User className="w-4 h-4" />{user.email}
                  </div>
                  <button onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-semibold text-sm">
                    <LogOut className="w-4 h-4" />Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link to="/auth" className="block text-center text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50">Sign In</Link>
                  <Link to="/auth" className="block text-center btn-primary py-3 rounded-xl font-semibold text-sm">Get Started Free</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
