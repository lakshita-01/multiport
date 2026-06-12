import { Link } from 'react-router-dom';
import { UserPlus, Home as HomeIcon, Search, MapPin, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const PropertyHome = () => {
  const { user } = useAuth();

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center section-pattern px-4">
      <div className="text-center bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full animate-scale-in">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
          <HomeIcon className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-3">Property Portal</h2>
        <p className="text-gray-500 mb-8">Sign in to access property buying and selling services</p>
        <Link to="/auth" className="btn-primary w-full py-3.5 rounded-xl justify-center">Sign In to Continue <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </div>
  );

  const cards = [
    { to: '/property/buyer-register', icon: UserPlus, title: 'Register as Buyer', desc: 'Find your dream property by sharing your requirements with us.', color: 'text-blue-600', bg: 'from-blue-500 to-cyan-500', light: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700' },
    { to: '/property/seller-register', icon: HomeIcon, title: 'List Your Property', desc: 'Sell your property faster by listing it with images and videos.', color: 'text-emerald-600', bg: 'from-emerald-500 to-teal-500', light: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700' },
    { to: '/property/browse', icon: Search, title: 'Browse Properties', desc: 'Search thousands of verified listings across India.', color: 'text-orange-600', bg: 'from-orange-500 to-amber-500', light: 'bg-orange-50', badge: 'bg-orange-100 text-orange-700' },
  ];

  const stats = [
    { icon: HomeIcon, value: '500+', label: 'Properties Listed', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: MapPin, value: '50+', label: 'Cities Covered', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: TrendingUp, value: '₹100Cr+', label: 'Property Value', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: Shield, value: '100%', label: 'Verified Listings', color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #064e3b, #065f46, #047857)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/10 text-white/90 px-4 py-1.5 rounded-full text-sm font-medium mb-5 border border-white/20">
            🏡 Property Purchase Portal
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Find Your <span style={{ color: '#6ee7b7' }}>Dream Home</span>
          </h1>
          <p className="text-emerald-100 text-xl max-w-2xl mx-auto mb-10">
            Buy, sell, or rent properties across India with verified listings and direct seller contact.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map(({ icon: Icon, value, label, color, bg }, i) => (
              <div key={i} className="glass rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="text-emerald-200 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none"><path d="M0 50L1440 50L1440 25C1200 50 960 0 720 25C480 50 240 0 0 25L0 50Z" fill="#f8fafc" /></svg>
        </div>
      </section>

      {/* Cards */}
      <section className="section-pattern py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {cards.map(({ to, icon: Icon, title, desc, bg, badge }, i) => (
              <Link key={i} to={to} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl card-hover border border-gray-100">
                <div className={`bg-gradient-to-br ${bg} p-8 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/10 -translate-y-6 translate-x-6" />
                  <Icon className="w-12 h-12 text-white relative z-10" />
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">{desc}</p>
                  <span className={`inline-flex items-center gap-1.5 ${badge} px-4 py-1.5 rounded-full text-sm font-semibold group-hover:gap-2.5 transition-all`}>
                    Get Started <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PropertyHome;
