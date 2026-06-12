import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Search, MapPin, Home, DollarSign, Maximize, Filter } from 'lucide-react';

const BrowseProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);

  const propertyTypes = ['All', 'Apartment', 'Villa', 'Plot', 'Commercial', 'Farm House', 'Penthouse'];

  useEffect(() => { fetchProperties(); }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/property/properties');
      setProperties(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter((p) => {
    const matchesSearch = p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.property_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || filterType === 'All' || p.property_type === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl text-gray-600">Loading properties...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Browse Properties</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search by location or type..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                {propertyTypes.map((t) => <option key={t} value={t === 'All' ? '' : t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-center py-12"><p className="text-xl text-gray-600">No properties found</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <div key={property.id} onClick={() => setSelectedProperty(property)}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer">
                <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 relative">
                  {property.image_urls?.[0] ? (
                    <img src={property.image_urls[0]} alt={property.property_type} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="w-20 h-20 text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-blue-600">
                    {property.property_type}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{property.property_type} in {property.location}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600"><MapPin className="w-4 h-4 mr-2" /><span>{property.location}</span></div>
                    <div className="flex items-center text-gray-600"><Maximize className="w-4 h-4 mr-2" /><span>{property.area_size} sq. ft.</span></div>
                    <div className="flex items-center text-gray-600">
                      <span className="text-2xl font-bold text-green-600">₹{parseInt(property.selling_price).toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{property.description}</p>
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedProperty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedProperty(null)}>
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Property Details</h2>
                <button onClick={() => setSelectedProperty(null)} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
              </div>
              <div className="p-6 space-y-4">
                {selectedProperty.image_urls?.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProperty.image_urls.map((url, i) => (
                      <img key={i} src={url} alt={`Property ${i + 1}`} className="w-full h-64 object-cover rounded-lg" />
                    ))}
                  </div>
                )}
                {selectedProperty.video_urls?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3">Property Videos</h3>
                    {selectedProperty.video_urls.map((url, i) => (
                      <video key={i} controls className="w-full rounded-lg mb-2"><source src={url} type="video/mp4" /></video>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div><h3 className="font-bold text-gray-800">Type</h3><p className="text-gray-600">{selectedProperty.property_type}</p></div>
                  <div><h3 className="font-bold text-gray-800">Location</h3><p className="text-gray-600">{selectedProperty.location}</p></div>
                  <div><h3 className="font-bold text-gray-800">Area</h3><p className="text-gray-600">{selectedProperty.area_size} sq. ft.</p></div>
                  <div><h3 className="font-bold text-gray-800">Price</h3><p className="text-2xl font-bold text-green-600">₹{parseInt(selectedProperty.selling_price).toLocaleString()}</p></div>
                </div>
                <div><h3 className="font-bold text-gray-800 mb-1">Description</h3><p className="text-gray-600">{selectedProperty.description}</p></div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-800 mb-2">Seller Contact</h3>
                  <p className="text-gray-600"><strong>Name:</strong> {selectedProperty.seller_name}</p>
                  <p className="text-gray-600"><strong>Phone:</strong> {selectedProperty.seller_phone}</p>
                  <p className="text-gray-600"><strong>Email:</strong> {selectedProperty.seller_email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseProperties;
