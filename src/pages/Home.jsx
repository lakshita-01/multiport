import { Link } from 'react-router-dom';
import { Building2, Heart, ShoppingCart, Shield, Zap, Star, ArrowRight, Users, Home as HomeIcon, TrendingUp, CheckCircle } from 'lucide-react';

const stats = [
  { value: '10K+', label: 'Happy Users', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { value: '500+', label: 'Properties Listed', icon: HomeIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { value: '2K+', label: 'Matches Made', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50' },
  { value: '₹2Cr+', label: 'Revenue Processed', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
];

const modules = [
  {
    id: 1, title: 'Property Purchase', emoji: '🏡',
    description: 'Find your dream home or list your property. Connect with verified buyers and sellers across India.',
    path: '/property',
    features: ['Verified Listings', 'Image & Video Tours', 'Direct Contact'],
    from: 'from-emerald-500', to: 'to-teal-600',
    shadow: 'hover:shadow-emerald-200',
    icon: Building2, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 2, title: 'Matrimonial', emoji: '💍',
    description: 'Find your perfect life partner with our trusted matrimonial platform. Swipe, match, connect.',
    path: '/matrimonial',
    features: ['Swipe Interface', 'Verified Profiles', 'Biodata Upload'],
    from: 'from-pink-500', to: 'to-rose-600',
    shadow: 'hover:shadow-pink-200',
    icon: Heart, iconBg: 'bg-pink-100', iconColor: 'text-pink-600',
    badge: 'bg-pink-100 text-pink-700',
  },
  {
    id: 3, title: 'E-Commerce', emoji: '🛒',
    description: 'Shop premium quality pulses and food products with secure Razorpay payments.',
    path: '/ecommerce',
    features: ['Secure Payments', 'Quality Products', 'Fast Delivery'],
    from: 'from-indigo-500', to: 'to-purple-600',
    shadow: 'hover:shadow-indigo-200',
    icon: ShoppingCart, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600',
    badge: 'bg-indigo-100 text-indigo-700',
  },
];

const features = [
  { icon: Shield, title: 'Bank-Level Security', desc: 'JWT auth + encrypted data storage', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for performance and speed', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { icon: Star, title: 'Top Rated', desc: '4.9★ rated by thousands of users', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: CheckCircle, title: 'Verified Users', desc: 'OTP verified profiles only', color: 'text-green-600', bg: 'bg-green-50' },
];

const Home = () => (
  <div className="min-h-screen">

    {/* Hero */}
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>
      {/* Decorative blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full opacity-10 animate-float" style={{ background: 'radial-gradient(circle, #6366f1, transparent)', animationDelay: '0s' }} />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full opacity-10 animate-float" style={{ background: 'radial-gradient(circle, #ec4899, transparent)', animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-5 animate-spin-slow" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', transform: 'translate(-50%,-50%)' }} />

      <div className="relative container mx-auto px-4 py-24 text-center">
        <div className="animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            India's #1 Unified Services Portal
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            One Portal,
            <br />
            <span className="gradient-text">Infinite Possibilities</span>
          </h1>

          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Property buying, matrimonial matchmaking, and e-commerce — all under one powerful platform designed for modern India.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth" className="btn-primary text-lg px-8 py-4 rounded-2xl animate-pulse-glow">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/property" className="inline-flex items-center gap-2 text-white/80 hover:text-white border border-white/30 hover:border-white/60 px-8 py-4 rounded-2xl text-lg font-semibold transition-all">
              Explore Modules
            </Link>
          </div>
        </div>

        {/* Floating module pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-16">
          {['🏡 Property', '💍 Matrimonial', '🛒 E-Commerce', '🔒 Secure', '⚡ Fast'].map((t, i) => (
            <span key={i} className="glass text-white/90 px-4 py-2 rounded-full text-sm font-medium animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 30C480 60 240 0 0 30L0 60Z" fill="#f8fafc" />
        </svg>
      </div>
    </section>

    {/* Stats */}
    <section className="section-pattern py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {stats.map(({ value, label, icon: Icon, color, bg }, i) => (
            <div key={i} className="stat-card card-hover animate-scale-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div className={`text-3xl font-black ${color} mb-1`}>{value}</div>
              <div className="text-sm text-gray-500 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Module Cards */}
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Explore Our <span className="gradient-text">Modules</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Three powerful services, one seamless experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link key={mod.id} to={mod.path}
                className={`group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl ${mod.shadow} card-hover border border-gray-100`}>
                {/* Top gradient */}
                <div className={`bg-gradient-to-br ${mod.from} ${mod.to} p-8 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-8 translate-x-8" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/10 translate-y-6 -translate-x-6" />
                  <div className="relative z-10">
                    <span className="text-5xl mb-4 block">{mod.emoji}</span>
                    <h3 className="text-2xl font-black text-white mb-2">{mod.title}</h3>
                    <Icon className="w-6 h-6 text-white/70" />
                  </div>
                </div>

                {/* Body */}
                <div className="p-7">
                  <p className="text-gray-600 leading-relaxed mb-5">{mod.description}</p>
                  <ul className="space-y-2 mb-6">
                    {mod.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className={`inline-flex items-center gap-2 ${mod.badge} px-4 py-2 rounded-full text-sm font-semibold group-hover:gap-3 transition-all`}>
                    Explore Now <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="section-pattern py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Why <span className="gradient-text">Trust Us?</span></h2>
          <p className="text-gray-500 text-lg">Built for reliability, security, and ease of use</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map(({ icon: Icon, title, desc, color, bg }, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg card-hover border border-gray-100 text-center">
              <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <Icon className={`w-7 h-7 ${color}`} />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">{title}</h4>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)' }}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Ready to Get Started?</h2>
        <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Join thousands of users who trust Unified Portal for their property, matrimonial, and shopping needs.</p>
        <Link to="/auth" className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-8 py-4 rounded-2xl text-lg hover:bg-white/90 transition-all hover:scale-105 shadow-2xl">
          Create Free Account <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  </div>
);

export default Home;
