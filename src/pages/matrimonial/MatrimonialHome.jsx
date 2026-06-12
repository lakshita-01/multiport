import { Link } from 'react-router-dom';
import { UserPlus, Users, Heart, ArrowRight, ThumbsUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MatrimonialHome = () => {
  const { user } = useAuth();

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50 px-4">
      <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md w-full border border-slate-200">
        <div className="h-16 w-16 rounded-xl bg-rose-100 flex items-center justify-center mx-auto mb-6">
          <Heart className="h-8 w-8 text-rose-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Matrimonial Services</h2>
        <p className="text-slate-500 mb-8">Sign in to find your perfect life partner</p>
        <Link to="/auth" className="inline-flex items-center justify-center gap-2 w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-xl transition-all">
          Sign In to Continue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );

  const cards = [
    { to: '/matrimonial/register', icon: UserPlus, title: 'Create Profile', desc: 'Register your profile with biodata and photo. One-time ₹500 fee for activation.', iconBg: 'bg-rose-100', iconColor: 'text-rose-600', btn: 'bg-gradient-to-r from-pink-500 to-rose-600' },
    { to: '/matrimonial/browse',   icon: Heart,    title: 'Browse Profiles', desc: 'Swipe through active profiles. Heart to save, X to skip — Tinder-style matching.', iconBg: 'bg-pink-100', iconColor: 'text-pink-600', btn: 'bg-gradient-to-r from-pink-400 to-pink-600' },
    { to: '/matrimonial/my-choices', icon: ThumbsUp, title: 'My Choices', desc: 'View profiles you’ve liked and access their contact details.', iconBg: 'bg-purple-100', iconColor: 'text-purple-600', btn: 'bg-gradient-to-r from-purple-500 to-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      <header className="bg-white border-b border-rose-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-rose-600" />
            <h1 className="text-3xl font-bold text-slate-900">Matrimonial Site</h1>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Find Your Perfect Match</h2>
          <p className="text-lg text-slate-600">Create your profile and discover compatible partners</p>
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

export default MatrimonialHome;
