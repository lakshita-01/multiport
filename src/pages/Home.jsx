import { Link } from 'react-router-dom';
import { Building2, Heart, ShoppingBag, Shield, Zap, Star, ArrowRight, CheckCircle } from 'lucide-react';

const modules = [
  {
    id: 1, title: 'Property Purchase',
    description: 'Find your dream property or list yours for sale',
    path: '/property',
    icon: Building2, iconBg: 'bg-blue-100', iconColor: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    id: 2, title: 'Matrimonial Site',
    description: 'Discover your perfect life partner',
    path: '/matrimonial',
    icon: Heart, iconBg: 'bg-pink-100', iconColor: 'text-pink-600',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    id: 3, title: 'E-Commerce',
    description: 'Shop premium quality pulses and grains',
    path: '/ecommerce',
    icon: ShoppingBag, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600',
    gradient: 'from-emerald-500 to-green-600',
  },
];

const features = [
  { icon: Shield, title: 'Bank-Level Security', desc: 'Row-level security + encrypted storage', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for performance and speed', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { icon: Star, title: 'Top Rated', desc: '4.9★ rated by thousands of users', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: CheckCircle, title: 'Verified Users', desc: 'OTP verified profiles only', color: 'text-green-600', bg: 'bg-green-50' },
];

const Home = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">

    {/* Hero */}
    <section className="pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
          Your All-in-One
          <span className="block mt-2 gradient-text-blue">Digital Platform</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8">
          Access property listings, find life partners, and shop quality products — all in one place
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-200">
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/property"
            className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600 font-semibold px-8 py-3.5 rounded-xl transition-all">
            Explore Modules
          </Link>
        </div>
      </div>
    </section>

    {/* Module Cards */}
    <section className="pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Our <span className="gradient-text-blue">Services</span>
          </h2>
          <p className="text-slate-500">Three powerful services, one seamless experience</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link key={mod.id} to={mod.path}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl card-hover border border-slate-200">
                <div className={`${mod.iconBg} h-16 w-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-8 w-8 ${mod.iconColor}`} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{mod.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{mod.description}</p>
                <div className={`w-full bg-gradient-to-r ${mod.gradient} text-white font-semibold py-2.5 rounded-xl text-center text-sm`}>
                  Explore Now
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="py-20 px-4 dots-bg">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Why <span className="gradient-text-blue">Trust Us?</span></h2>
          <p className="text-slate-500">Built for reliability, security, and ease of use</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc, color, bg }, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg card-hover border border-slate-100 text-center">
              <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <Icon className={`w-7 h-7 ${color}`} />
              </div>
              <h4 className="font-bold text-slate-800 mb-2">{title}</h4>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto text-center bg-white rounded-2xl p-12 shadow-lg border border-slate-200">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Get Started?</h2>
        <p className="text-slate-600 mb-8">Join thousands of users who trust Vajreshvari for their property, matrimonial, and shopping needs.</p>
        <Link to="/auth"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-blue-200">
          Create Free Account <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  </div>
);

export default Home;
