import { Link } from 'react-router-dom';
import { UserPlus, Users, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MatrimonialHome = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Matrimonial Services</h2>
          <p className="text-gray-600 mb-8">Please sign in to access matrimonial services</p>
          <Link
            to="/auth"
            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Find Your Life Partner</h1>
          <p className="text-xl text-gray-600">Trusted Matrimonial Service</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Link
            to="/matrimonial/register"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <UserPlus className="w-16 h-16 text-pink-600 mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">Create Profile</h2>
            <p className="text-gray-600 text-center">
              Register and create your matrimonial profile (₹500)
            </p>
          </Link>

          <Link
            to="/matrimonial/browse"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <Users className="w-16 h-16 text-blue-600 mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">Browse Profiles</h2>
            <p className="text-gray-600 text-center">
              Explore profiles and find your perfect match
            </p>
          </Link>

          <Link
            to="/matrimonial/my-choices"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:scale-105"
          >
            <Heart className="w-16 h-16 text-red-600 mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">My Choices</h2>
            <p className="text-gray-600 text-center">
              View profiles you have liked and saved
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MatrimonialHome;
