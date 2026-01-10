import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { CheckCircle, AlertCircle, Upload, X } from 'lucide-react';

const SellerRegister = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const [sellerData, setSellerData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
  });

  const [propertyData, setPropertyData] = useState({
    propertyType: '',
    location: '',
    areaSize: '',
    sellingPrice: '',
    description: '',
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);

  const propertyTypes = ['Apartment', 'Villa', 'Plot', 'Commercial', 'Farm House', 'Penthouse'];

  const handleSellerChange = (e) => {
    setSellerData({ ...sellerData, [e.target.name]: e.target.value });
  };

  const handlePropertyChange = (e) => {
    setPropertyData({ ...propertyData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setVideos([...videos, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    setUploadingMedia(true);
    const uploadedImageUrls = [];
    const uploadedVideoUrls = [];

    try {
      for (const image of images) {
        const fileName = `${Date.now()}-${image.name}`;
        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(fileName, image);

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);

        uploadedImageUrls.push(urlData.publicUrl);
      }

      for (const video of videos) {
        const fileName = `${Date.now()}-${video.name}`;
        const { data, error } = await supabase.storage
          .from('property-videos')
          .upload(fileName, video);

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('property-videos')
          .getPublicUrl(fileName);

        uploadedVideoUrls.push(urlData.publicUrl);
      }

      setImageUrls(uploadedImageUrls);
      setVideoUrls(uploadedVideoUrls);
      return { imageUrls: uploadedImageUrls, videoUrls: uploadedVideoUrls };
    } catch (err) {
      throw new Error('Failed to upload media files');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { imageUrls, videoUrls } = await uploadFiles();

      const { data: sellerInsert, error: sellerError } = await supabase
        .from('sellers')
        .insert([
          {
            user_id: user.id,
            full_name: sellerData.fullName,
            email: sellerData.email,
            phone: sellerData.phone,
          },
        ])
        .select()
        .maybeSingle();

      if (sellerError) throw sellerError;

      const { error: propertyError } = await supabase
        .from('properties')
        .insert([
          {
            seller_id: sellerInsert.id,
            property_type: propertyData.propertyType,
            location: propertyData.location,
            area_size: propertyData.areaSize,
            selling_price: parseFloat(propertyData.sellingPrice),
            description: propertyData.description,
            image_urls: imageUrls,
            video_urls: videoUrls,
          },
        ]);

      if (propertyError) throw propertyError;

      setSuccess(true);
      setTimeout(() => {
        navigate('/property/browse');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to register property');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Please sign in to register as a seller</p>
          <button
            onClick={() => navigate('/auth')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Property Listed Successfully!</h2>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Seller Registration & Property Listing</h1>
          <p className="text-gray-600 mb-8">Register and list your property for sale</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Seller Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={sellerData.fullName}
                    onChange={handleSellerChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={sellerData.email}
                    onChange={handleSellerChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={sellerData.phone}
                    onChange={handleSellerChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
                  <select
                    name="propertyType"
                    value={propertyData.propertyType}
                    onChange={handlePropertyChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">Select Type</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={propertyData.location}
                    onChange={handlePropertyChange}
                    placeholder="City, Area"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Area/Size (sq. ft.) *</label>
                  <input
                    type="text"
                    name="areaSize"
                    value={propertyData.areaSize}
                    onChange={handlePropertyChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (₹) *</label>
                  <input
                    type="number"
                    name="sellingPrice"
                    value={propertyData.sellingPrice}
                    onChange={handlePropertyChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Description *</label>
                  <textarea
                    name="description"
                    value={propertyData.description}
                    onChange={handlePropertyChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Media Upload</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Images</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      id="images"
                    />
                    <label htmlFor="images" className="cursor-pointer text-blue-600 hover:text-blue-700">
                      Click to upload images
                    </label>
                  </div>
                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {images.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(img)}
                            alt="Preview"
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Videos</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={handleVideoChange}
                      className="hidden"
                      id="videos"
                    />
                    <label htmlFor="videos" className="cursor-pointer text-blue-600 hover:text-blue-700">
                      Click to upload videos
                    </label>
                  </div>
                  {videos.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {videos.map((video, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm text-gray-700">{video.name}</span>
                          <button
                            type="button"
                            onClick={() => removeVideo(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || uploadingMedia}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading || uploadingMedia ? 'Processing...' : 'List Property'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/property')}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerRegister;
