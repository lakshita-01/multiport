import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Menu, X, LayoutDashboard } from 'lucide-react';

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
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200' : 'bg-white border-b border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">MV</span>
            </div>
            <span className="text-xl font-bold text-slate-900">MultiVista</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, emoji }) => (
              <Link key={to} to={to}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive(to) ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}>
                <span>{emoji}</span>{label}
              </Link>
            ))}
            {user && (
              <Link to="/admin"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/admin') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}>
                <LayoutDashboard className="w-4 h-4" />Admin
              </Link>
            )}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-32 truncate">{user.email}</span>
                </div>
                <button onClick={handleSignOut}
                  className="flex items-center gap-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-semibold transition-all">
                  <LogOut className="w-4 h-4" />Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" className="text-slate-600 hover:text-blue-600 px-4 py-2 text-sm font-semibold transition-all">Sign In</Link>
                <Link to="/auth" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all">Get Started</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-all" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-slate-100 pt-3 animate-slide-down">
            {navLinks.map(({ to, label, emoji }) => (
              <Link key={to} to={to}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  isActive(to) ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                }`}>
                <span>{emoji}</span>{label}
              </Link>
            ))}
            {user && (
              <Link to="/admin" className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
                <LayoutDashboard className="w-4 h-4" />Admin Dashboard
              </Link>
            )}
            <div className="border-t border-slate-100 pt-3 mt-2">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500">
                    <User className="w-4 h-4" />{user.email}
                  </div>
                  <button onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 border border-slate-200 text-slate-600 py-3 rounded-lg font-semibold text-sm">
                    <LogOut className="w-4 h-4" />Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link to="/auth" className="block text-center text-slate-600 py-3 rounded-lg font-semibold text-sm hover:bg-slate-50">Sign In</Link>
                  <Link to="/auth" className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-sm">Get Started Free</Link>
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
