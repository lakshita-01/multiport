import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { Heart, User, MapPin, Briefcase, GraduationCap, Trash2 } from 'lucide-react';

const MyChoices = () => {
  const { user } = useAuth();
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) fetchChoices(); }, [user]);

  const fetchChoices = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/matrimonial/choices');
      setChoices(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeChoice = async (id) => {
    try {
      await api.delete(`/api/matrimonial/choices/${id}`);
      setChoices((c) => c.filter((ch) => ch.id !== id));
    } catch (err) { console.error(err); }
  };

  const calcAge = (dob) => {
    const today = new Date(), birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
    return age;
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center">
      <div className="text-xl text-gray-600">Loading your choices...</div>
    </div>
  );

  if (choices.length === 0) return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center">
      <div className="text-center">
        <Heart className="w-20 h-20 text-pink-300 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">No Choices Yet</h2>
        <p className="text-gray-600 mb-8">Start browsing profiles and add your favorites</p>
        <a href="/matrimonial/browse" className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition inline-block">Browse Profiles</a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-pink-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Choices</h1>
          <p className="text-gray-600">Profiles you have liked ({choices.length})</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {choices.map((choice) => (
            <div key={choice.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
              <div className="relative h-64 bg-gradient-to-r from-pink-400 to-pink-600">
                {choice.profile_image_url
                  ? <img src={choice.profile_image_url} alt={choice.full_name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><User className="w-24 h-24 text-white opacity-50" /></div>}
                <button onClick={() => removeChoice(choice.id)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-red-50 transition">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{choice.full_name}</h2>
                <p className="text-gray-600 mb-4">{calcAge(choice.date_of_birth)} years, {choice.gender}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700 text-sm"><MapPin className="w-4 h-4 mr-2 text-pink-600" /><span>{choice.city}, {choice.state}</span></div>
                  <div className="flex items-center text-gray-700 text-sm"><GraduationCap className="w-4 h-4 mr-2 text-pink-600" /><span>{choice.education}</span></div>
                  <div className="flex items-center text-gray-700 text-sm"><Briefcase className="w-4 h-4 mr-2 text-pink-600" /><span>{choice.occupation}</span></div>
                  {choice.religion && <div className="text-gray-700 text-sm"><span className="font-semibold">Religion:</span> {choice.religion}</div>}
                  {choice.height && <div className="text-gray-700 text-sm"><span className="font-semibold">Height:</span> {choice.height}</div>}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-1"><strong>Phone:</strong> {choice.contact_number}</p>
                  <p className="text-sm text-gray-600"><strong>Email:</strong> {choice.email}</p>
                </div>
                {choice.biodata_url && (
                  <a href={choice.biodata_url} target="_blank" rel="noopener noreferrer"
                    className="block mt-4 text-center bg-pink-100 text-pink-600 py-2 rounded-lg hover:bg-pink-200 transition">View Biodata</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyChoices;
