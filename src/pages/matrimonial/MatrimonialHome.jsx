import { Link } from 'react-router-dom';
import { UserPlus, Users, Heart, ArrowRight, Star, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MatrimonialHome = () => {
  const { user } = useAuth();

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center section-pattern px-4">
      <div className="text-center bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full animate-scale-in">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
          <Heart className="w-10 h-10 text-white fill-white" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-3">Matrimonial Services</h2>
        <p className="text-gray-500 mb-8">Sign in to find your perfect life partner</p>
        <Link to="/auth" className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
          Sign In to Continue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );

  const cards = [
    { to: '/matrimonial/register', icon: UserPlus, title: 'Create Profile', desc: 'Register your profile with biodata and photo. One-time ₹500 fee for activation.', badge: '₹500', from: 'from-pink-500', to2: 'to-rose-600', badgeCls: 'bg-pink-100 text-pink-700' },
    { to: '/matrimonial/browse',   icon: Users,   title: 'Browse Profiles', desc: 'Swipe through active profiles. Heart to save, X to skip — Tinder-style matching.', badge: 'Swipe ❤️', from: 'from-purple-500', to2: 'to-indigo-600', badgeCls: 'bg-purple-100 text-purple-700' },
    { to: '/matrimonial/my-choices', icon: Heart, title: 'My Choices', desc: 'View all profiles you liked. Access contact details and biodata of your matches.', badge: 'Saved', from: 'from-red-500', to2: 'to-pink-600', badgeCls: 'bg-red-100 text-red-700' },
  ];

  const features = [
    { icon: Shield, text: 'OTP Verified Profiles' },
    { icon: Star,   text: 'Detailed Biodata' },
    { icon: CheckCircle, text: 'Secure Messaging' },
    { icon: Heart,  text: 'Smart Matching' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #4a0030, #831843, #9d174d)' }}>
        <div className="absolute top-10 right-20 w-80 h-80 rounded-full opacity-10 animate-float" style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }} />
        <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full opacity-10 animate-float" style={{ background: 'radial-gradient(circle, #f9a8d4, transparent)', animationDelay: '1.5s' }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="text-6xl mb-4 animate-bounce-in">💍</div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Find Your <span style={{ color: '#f9a8d4' }}>Life Partner</span>
          </h1>
          <p className="text-pink-100 text-xl max-w-2xl mx-auto mb-8">
            Trusted matrimonial platform with verified profiles, swipe matching, and secure communication.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {features.map(({ icon: Icon, text }, i) => (
              <span key={i} className="glass text-white/90 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <Icon className="w-4 h-4 text-pink-300" />{text}
              </span>
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
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <Link key={i} to={card.to} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl card-hover border border-gray-100">
                  <div className={`bg-gradient-to-br ${card.from} ${card.to2} p-8 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/10 -translate-y-6 translate-x-6" />
                    <Icon className="w-12 h-12 text-white relative z-10" />
                    <span className="absolute top-4 right-4 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">{card.badge}</span>
                  </div>
                  <div className="p-7">
                    <h3 className="text-xl font-black text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5">{card.desc}</p>
                    <span className={`inline-flex items-center gap-1.5 ${card.badgeCls} px-4 py-1.5 rounded-full text-sm font-semibold group-hover:gap-2.5 transition-all`}>
                      Open <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MatrimonialHome;
