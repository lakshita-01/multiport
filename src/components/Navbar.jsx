import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, LogOut, User, Menu, X, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/property', label: '🏡 Property' },
    { to: '/matrimonial', label: '💍 Matrimonial' },
    { to: '/ecommerce', label: '🛒 E-Commerce' },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
            <Home className="w-6 h-6" />
            <span>Unified Portal</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} className="hover:text-blue-200 transition text-sm font-medium">{label}</Link>
            ))}
            {user && (
              <Link to="/admin" className="hover:text-blue-200 transition text-sm font-medium flex items-center gap-1">
                <LayoutDashboard className="w-4 h-4" />Admin
              </Link>
            )}
            {user ? (
              <div className="flex items-center space-x-3 ml-2">
                <span className="flex items-center space-x-1 text-sm text-blue-100">
                  <User className="w-4 h-4" />
                  <span className="max-w-32 truncate">{user.email}</span>
                </span>
                <button onClick={handleSignOut}
                  className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition text-sm">
                  <LogOut className="w-4 h-4" /><span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link to="/auth" className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-semibold transition text-sm ml-2">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                className="block py-2 px-2 hover:bg-blue-700 rounded-lg transition">{label}</Link>
            ))}
            {user && (
              <Link to="/admin" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-2 px-2 hover:bg-blue-700 rounded-lg transition">
                <LayoutDashboard className="w-4 h-4" />Admin
              </Link>
            )}
            <div className="border-t border-blue-500 pt-3 mt-2">
              {user ? (
                <div className="space-y-2">
                  <p className="text-blue-200 text-sm px-2">{user.email}</p>
                  <button onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 py-2 rounded-lg transition">
                    <LogOut className="w-4 h-4" />Sign Out
                  </button>
                </div>
              ) : (
                <Link to="/auth" onClick={() => setMenuOpen(false)}
                  className="block text-center bg-white text-blue-600 py-2 rounded-lg font-semibold">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
