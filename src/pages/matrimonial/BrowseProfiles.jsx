import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Heart, X, User, MapPin, Briefcase, GraduationCap, Calendar } from 'lucide-react';

const BrowseProfiles = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState(null);

  useEffect(() => {
    if (user) {
      fetchProfiles();
    }
  }, [user]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('matrimonial_profiles')
        .select('*')
        .eq('profile_status', 'ACTIVE')
        .neq('user_id', user.id);

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSwipe = async (direction) => {
    if (currentIndex >= profiles.length) return;

    setSwipeDirection(direction);

    if (direction === 'right') {
      try {
        await supabase
          .from('profile_choices')
          .insert([
            {
              user_id: user.id,
              liked_profile_id: profiles[currentIndex].id,
            },
          ]);
      } catch (error) {
        console.error('Error saving choice:', error);
      }
    }

    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setSwipeDirection(null);
    }, 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading profiles...</div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">No profiles available at the moment</p>
          <p className="text-gray-500">Check back later for new profiles</p>
        </div>
      </div>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">No More Profiles</h2>
          <p className="text-gray-600 mb-8">You've viewed all available profiles</p>
          <button
            onClick={() => {
              setCurrentIndex(0);
              fetchProfiles();
            }}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Browse Profiles</h1>
          <p className="text-gray-600">
            Profile {currentIndex + 1} of {profiles.length}
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div
            className={`bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform ${
              swipeDirection === 'left'
                ? '-translate-x-full opacity-0'
                : swipeDirection === 'right'
                ? 'translate-x-full opacity-0'
                : 'translate-x-0 opacity-100'
            }`}
          >
            <div className="relative h-96 bg-gradient-to-r from-pink-400 to-pink-600">
              {currentProfile.profile_image_url ? (
                <img
                  src={currentProfile.profile_image_url}
                  alt={currentProfile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-32 h-32 text-white opacity-50" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <h2 className="text-3xl font-bold text-white mb-1">
                  {currentProfile.full_name}
                </h2>
                <p className="text-white text-lg">
                  {calculateAge(currentProfile.date_of_birth)} years, {currentProfile.gender}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-pink-600" />
                <span>
                  {currentProfile.city}, {currentProfile.state}, {currentProfile.country}
                </span>
              </div>

              <div className="flex items-center text-gray-700">
                <GraduationCap className="w-5 h-5 mr-3 text-pink-600" />
                <span>{currentProfile.education}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <Briefcase className="w-5 h-5 mr-3 text-pink-600" />
                <span>{currentProfile.occupation}</span>
              </div>

              {currentProfile.religion && (
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-5 h-5 mr-3 text-pink-600" />
                  <span>
                    {currentProfile.religion}
                    {currentProfile.caste && `, ${currentProfile.caste}`}
                  </span>
                </div>
              )}

              {currentProfile.height && (
                <div className="flex items-center text-gray-700">
                  <span className="font-semibold mr-2">Height:</span>
                  <span>{currentProfile.height}</span>
                </div>
              )}

              {currentProfile.annual_income && (
                <div className="flex items-center text-gray-700">
                  <span className="font-semibold mr-2">Income:</span>
                  <span>{currentProfile.annual_income}</span>
                </div>
              )}

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold text-gray-800 mb-2">Contact Information</h3>
                <p className="text-gray-600">
                  <strong>Phone:</strong> {currentProfile.contact_number}
                </p>
                <p className="text-gray-600">
                  <strong>Email:</strong> {currentProfile.email}
                </p>
              </div>

              {currentProfile.biodata_url && (
                <a
                  href={currentProfile.biodata_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-gray-100 text-pink-600 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  View Biodata PDF
                </a>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-8 mt-8">
            <button
              onClick={() => handleSwipe('left')}
              className="bg-white rounded-full p-6 shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 group"
              disabled={swipeDirection !== null}
            >
              <X className="w-10 h-10 text-red-500 group-hover:text-red-600" />
            </button>

            <button
              onClick={() => handleSwipe('right')}
              className="bg-white rounded-full p-6 shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 group"
              disabled={swipeDirection !== null}
            >
              <Heart className="w-10 h-10 text-pink-500 group-hover:text-pink-600" />
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              <span className="inline-flex items-center mr-4">
                <X className="w-4 h-4 mr-1 text-red-500" /> Skip
              </span>
              <span className="inline-flex items-center">
                <Heart className="w-4 h-4 mr-1 text-pink-500" /> Add to My Choices
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseProfiles;
