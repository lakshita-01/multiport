import { Link } from 'react-router-dom';
import { Building2, Heart, ShoppingBag, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">MV</span>
            </div>
            <span className="text-xl font-bold text-slate-900">MultiVista</span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            India's platform for property purchase, matrimonial services, and e-commerce — all in one place.
          </p>
        </div>

        {/* Modules */}
        <div>
          <h4 className="text-slate-900 font-semibold mb-4 text-sm uppercase tracking-wider">Modules</h4>
          <ul className="space-y-3">
            {[
              { to: '/property',    label: 'Property Purchase', icon: Building2 },
              { to: '/matrimonial', label: 'Matrimonial Site', icon: Heart },
              { to: '/ecommerce',   label: 'E-Commerce Store', icon: ShoppingBag },
            ].map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link to={to} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm transition-all">
                  <Icon className="w-3.5 h-3.5" />{label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-slate-900 font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-3">
            {[
              { to: '/property/browse',    label: 'Browse Properties' },
              { to: '/matrimonial/browse', label: 'Browse Profiles' },
              { to: '/ecommerce',          label: 'Shop Products' },
              { to: '/auth',               label: 'Sign In / Register' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-slate-500 hover:text-blue-600 text-sm transition-all">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-slate-900 font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-slate-500 text-sm">
              <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />vajreshvari.properties@gmail.com
            </li>
            <li className="flex items-center gap-2 text-slate-500 text-sm">
              <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />8178884391
            </li>
            <li className="flex items-start gap-2 text-slate-500 text-sm">
              <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />Shop No. H-59, DDA FLATS, PH-1, ASHOK VIHAR, DELHI-52
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-400 text-sm">© 2025 MultiVista. All rights reserved.</p>
        <div className="flex gap-6">
          {['Privacy Policy', 'Terms of Service', 'Support'].map((t) => (
            <a key={t} href="#" className="text-slate-400 hover:text-slate-600 text-sm transition-all">{t}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
