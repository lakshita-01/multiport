import { Link } from 'react-router-dom';
import { UserPlus, Home as HomeIcon, Search } from 'lucide-react';

const PropertyHome = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Property Purchase Portal</h1>
          <p className="text-xl text-gray-600">Buy or Sell Properties with Ease</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Link
            to="/property/buyer-register"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <UserPlus className="w-16 h-16 text-blue-600 mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">Register as Buyer</h2>
            <p className="text-gray-600 text-center">
              Find your dream property by registering your requirements
            </p>
          </Link>

          <Link
            to="/property/seller-register"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <HomeIcon className="w-16 h-16 text-green-600 mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">Register as Seller</h2>
            <p className="text-gray-600 text-center">
              List your property and connect with potential buyers
            </p>
          </Link>

          <Link
            to="/property/browse"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <Search className="w-16 h-16 text-orange-600 mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">Browse Properties</h2>
            <p className="text-gray-600 text-center">
              Search and explore available properties in your area
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyHome;
