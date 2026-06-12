import { Link } from 'react-router-dom';
import { Sparkles, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => (
  <footer style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63)' }}>
    {/* Top wave */}
    <div className="-mt-1">
      <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0L1440 0L1440 20C1200 0 960 40 720 20C480 0 240 40 0 20L0 0Z" fill="#f8fafc" />
      </svg>
    </div>

    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white">Vajreshvari Services</span>
          </div>
          <p className="text-white/50 text-sm leading-relaxed mb-5">
            India's #1 platform for property purchase, matrimonial services, and e-commerce — all in one place.
          </p>
          <div className="flex gap-3">
            {['𝕏', 'in', 'f', '📸'].map((s, i) => (
              <button key={i} className="w-9 h-9 glass rounded-xl text-white/70 hover:text-white text-sm font-bold transition-all hover:scale-110">{s}</button>
            ))}
          </div>
        </div>

        {/* Modules */}
        <div>
          <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Modules</h4>
          <ul className="space-y-3">
            {[
              { to: '/property',    label: '🏡 Property Purchase' },
              { to: '/matrimonial', label: '💍 Matrimonial Site' },
              { to: '/ecommerce',   label: '🛒 E-Commerce Store' },
              { to: '/admin',       label: '⚙️ Admin Dashboard' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-white/50 hover:text-white text-sm transition-all hover:translate-x-1 inline-block">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-3">
            {[
              { to: '/property/browse',    label: 'Browse Properties' },
              { to: '/matrimonial/browse', label: 'Browse Profiles' },
              { to: '/ecommerce',          label: 'Shop Products' },
              { to: '/auth',               label: 'Sign In / Register' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-white/50 hover:text-white text-sm transition-all hover:translate-x-1 inline-block">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-white/50 text-sm">
              <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />vajreshvari.properties@gmail.com
            </li>
            <li className="flex items-center gap-2 text-white/50 text-sm">
              <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />8178884391
            </li>
            <li className="flex items-start gap-2 text-white/50 text-sm">
              <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />Shop No. H-59, DDA FLATS, PH-1, ASHOK VIHAR, DELHI-52 (Ground Floor)
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-white/40 text-sm">© 2026 vajreshvaris. All rights reserved.</p>
        <p className="text-white/40 text-sm flex items-center gap-1">
          Made with <Heart className="w-4 h-4 text-pink-500 fill-pink-500" /> in India
        </p>
        <div className="flex gap-4">
          {['Privacy Policy', 'Terms of Service', 'Support'].map((t) => (
            <a key={t} href="#" className="text-white/40 hover:text-white/70 text-sm transition-all">{t}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
