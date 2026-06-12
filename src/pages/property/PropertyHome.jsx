import { Link } from 'react-router-dom';
import { UserPlus, Home as HomeIcon, Search, ArrowRight, Building2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const PropertyHome = () => {
  const { user } = useAuth();

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-4">
      <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md w-full border border-slate-200">
        <div className="h-16 w-16 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-6">
          <Building2 className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Property Purchase</h2>
        <p className="text-slate-500 mb-8">Sign in to access property buying and selling services</p>
        <Link to="/auth" className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all">
          Sign In to Continue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );

  const cards = [
    { to: '/property/buyer-register', icon: UserPlus, title: 'Buyer Registration', desc: 'Register to browse and search properties', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', btn: 'bg-gradient-to-r from-blue-500 to-blue-600' },
    { to: '/property/seller-register', icon: HomeIcon, title: 'Seller Registration', desc: 'List your property for potential buyers', iconBg: 'bg-green-100', iconColor: 'text-green-600', btn: 'bg-gradient-to-r from-green-500 to-green-600' },
    { to: '/property/browse', icon: Search, title: 'Browse Properties', desc: 'View all available property listings', iconBg: 'bg-purple-100', iconColor: 'text-purple-600', btn: 'bg-gradient-to-r from-purple-500 to-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Property Purchase</h1>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Find Your Dream Property</h2>
          <p className="text-lg text-slate-600">Register as a buyer or list your property for sale</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map(({ to, icon: Icon, title, desc, iconBg, iconColor, btn }) => (
            <Link key={to} to={to} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl card-hover border border-slate-200">
              <div className={`${iconBg} h-16 w-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <Icon className={`h-8 w-8 ${iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
              <p className="text-slate-600 leading-relaxed mb-6">{desc}</p>
              <div className={`w-full ${btn} text-white font-semibold py-2.5 rounded-xl text-center text-sm`}>Get Started</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyHome;
