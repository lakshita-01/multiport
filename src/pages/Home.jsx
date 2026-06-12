import { Link } from 'react-router-dom';
import { Building2, Heart, ShoppingCart } from 'lucide-react';

const Home = () => {
  const modules = [
    {
      id: 1,
      title: 'Property Purchase',
      description: 'Find your dream property or list your property for sale. Connect with buyers and sellers.',
      icon: Building2,
      path: '/property',
      gradient: 'from-green-400 to-green-600',
      hoverGradient: 'hover:from-green-500 hover:to-green-700',
    },
    {
      id: 2,
      title: 'Matrimonial Site',
      description: 'Find your perfect life partner. Browse profiles and connect with matches.',
      icon: Heart,
      path: '/matrimonial',
      gradient: 'from-pink-400 to-pink-600',
      hoverGradient: 'hover:from-pink-500 hover:to-pink-700',
    },
    {
      id: 3,
      title: 'E-Commerce Website',
      description: 'Shop for quality pulses and food products. Convenient online shopping with secure payments.',
      icon: ShoppingCart,
      path: '/ecommerce',
      gradient: 'from-blue-400 to-blue-600',
      hoverGradient: 'hover:from-blue-500 hover:to-blue-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to Unified Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your comprehensive platform for property purchase, matrimonial services, and e-commerce shopping - all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.id}
                to={module.path}
                className={`block bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
              >
                <div className={`bg-gradient-to-r ${module.gradient} ${module.hoverGradient} p-8 transition-all duration-300`}>
                  <Icon className="w-16 h-16 text-white mb-4" />
                  <h2 className="text-2xl font-bold text-white">{module.title}</h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {module.description}
                  </p>
                  <div className="mt-6">
                    <span className={`inline-block bg-gradient-to-r ${module.gradient} text-white px-6 py-2 rounded-full font-semibold`}>
                      Explore Now →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-20 bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Secure & Safe</h3>
              <p className="text-gray-600">Your data is protected with enterprise-level security</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Fast & Easy</h3>
              <p className="text-gray-600">Simple interface for seamless user experience</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌟</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Trusted Platform</h3>
              <p className="text-gray-600">Thousands of satisfied users across all services</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
