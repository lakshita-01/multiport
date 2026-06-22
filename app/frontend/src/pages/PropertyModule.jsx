import React, { useState, useContext, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Building2, Search, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card } from '../components/ui/card';
import api from '../lib/api';
import { toast } from 'sonner';

function PropertyHome() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                size="sm"
                className="gap-2"
                data-testid="back-to-home"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-slate-900">Property Purchase</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Find Your Dream Property</h2>
          <p className="text-lg text-slate-600">Register as a buyer or list your property for sale</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card
            onClick={() => navigate('/property/buyer-registration')}
            className="p-8 cursor-pointer hover:shadow-xl card-hover bg-white"
            data-testid="buyer-registration-card"
          >
            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Buyer Registration</h3>
              <p className="text-slate-600">Register to browse and search properties</p>
            </div>
          </Card>

          <Card
            onClick={() => navigate('/property/seller-registration')}
            className="p-8 cursor-pointer hover:shadow-xl card-hover bg-white"
            data-testid="seller-registration-card"
          >
            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <Plus className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Seller Registration</h3>
              <p className="text-slate-600">List your property for potential buyers</p>
            </div>
          </Card>

          <Card
            onClick={() => navigate('/property/listings')}
            className="p-8 cursor-pointer hover:shadow-xl card-hover bg-white"
            data-testid="browse-properties-card"
          >
            <div className="text-center">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Browse Properties</h3>
              <p className="text-slate-600">View all available property listings</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function BuyerRegistration() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    property_type: '',
    preferred_location: '',
    area_size: '',
    budget_range: '',
    additional_requirements: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login first');
      return;
    }

    try {
      await api.post('/property/buyer-profile', formData);
      toast.success('Buyer profile created successfully!');
      navigate('/property/listings');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create profile');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Button
          onClick={() => navigate('/property')}
          variant="ghost"
          className="mb-6 gap-2"
          data-testid="back-button"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="p-8 bg-white shadow-lg">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Buyer Registration</h2>
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="buyer-registration-form">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  data-testid="buyer-full-name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  data-testid="buyer-email"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  data-testid="buyer-phone"
                />
              </div>
              <div>
                <Label htmlFor="property_type">Property Type *</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, property_type: value })}>
                  <SelectTrigger data-testid="buyer-property-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Plot">Plot</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="preferred_location">Preferred Location *</Label>
                <Input
                  id="preferred_location"
                  required
                  value={formData.preferred_location}
                  onChange={(e) => setFormData({ ...formData, preferred_location: e.target.value })}
                  data-testid="buyer-location"
                />
              </div>
              <div>
                <Label htmlFor="area_size">Area/Size (sq. ft.) *</Label>
                <Input
                  id="area_size"
                  required
                  value={formData.area_size}
                  onChange={(e) => setFormData({ ...formData, area_size: e.target.value })}
                  data-testid="buyer-area"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="budget_range">Budget Range *</Label>
              <Input
                id="budget_range"
                required
                placeholder="e.g., 50L - 1Cr"
                value={formData.budget_range}
                onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                data-testid="buyer-budget"
              />
            </div>

            <div>
              <Label htmlFor="additional_requirements">Additional Requirements</Label>
              <Textarea
                id="additional_requirements"
                rows={4}
                value={formData.additional_requirements}
                onChange={(e) => setFormData({ ...formData, additional_requirements: e.target.value })}
                data-testid="buyer-requirements"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              data-testid="buyer-submit"
            >
              Register as Buyer
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

function SellerRegistration() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    seller_name: '',
    seller_email: '',
    seller_phone: '',
    property_type: '',
    location: '',
    area_size: '',
    selling_price: '',
    description: '',
    images: []
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(
      files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      })
    ).then(images => {
      setFormData({ ...formData, images });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login first');
      return;
    }

    try {
      await api.post('/property/listings', formData);
      toast.success('Property listed successfully!');
      navigate('/property/listings');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to list property');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Button
          onClick={() => navigate('/property')}
          variant="ghost"
          className="mb-6 gap-2"
          data-testid="back-button"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="p-8 bg-white shadow-lg">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Seller Registration</h2>
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="seller-registration-form">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="seller_name">Full Name *</Label>
                <Input
                  id="seller_name"
                  required
                  value={formData.seller_name}
                  onChange={(e) => setFormData({ ...formData, seller_name: e.target.value })}
                  data-testid="seller-name"
                />
              </div>
              <div>
                <Label htmlFor="seller_email">Email *</Label>
                <Input
                  id="seller_email"
                  type="email"
                  required
                  value={formData.seller_email}
                  onChange={(e) => setFormData({ ...formData, seller_email: e.target.value })}
                  data-testid="seller-email"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="seller_phone">Phone *</Label>
                <Input
                  id="seller_phone"
                  required
                  value={formData.seller_phone}
                  onChange={(e) => setFormData({ ...formData, seller_phone: e.target.value })}
                  data-testid="seller-phone"
                />
              </div>
              <div>
                <Label htmlFor="property_type">Property Type *</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, property_type: value })}>
                  <SelectTrigger data-testid="seller-property-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Plot">Plot</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="location">Property Location *</Label>
                <Input
                  id="location"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  data-testid="seller-location"
                />
              </div>
              <div>
                <Label htmlFor="area_size">Area/Size (sq. ft.) *</Label>
                <Input
                  id="area_size"
                  required
                  value={formData.area_size}
                  onChange={(e) => setFormData({ ...formData, area_size: e.target.value })}
                  data-testid="seller-area"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="selling_price">Selling Price (₹) *</Label>
              <Input
                id="selling_price"
                type="number"
                required
                value={formData.selling_price}
                onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                data-testid="seller-price"
              />
            </div>

            <div>
              <Label htmlFor="description">Property Description *</Label>
              <Textarea
                id="description"
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                data-testid="seller-description"
              />
            </div>

            <div>
              <Label htmlFor="images">Property Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                data-testid="seller-images"
              />
              <p className="text-sm text-slate-500 mt-1">{formData.images.length} image(s) selected</p>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              data-testid="seller-submit"
            >
              List Property
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

function PropertyListings() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    property_type: '',
    location: '',
    min_price: '',
    max_price: ''
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.property_type && filters.property_type !== 'all_types') params.append('property_type', filters.property_type);
      if (filters.location) params.append('location', filters.location);
      if (filters.min_price) params.append('min_price', filters.min_price);
      if (filters.max_price) params.append('max_price', filters.max_price);

      const response = await api.get(`/property/listings?${params.toString()}`);
      setProperties(Array.isArray(response.data) ? response.data : response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch properties');
    }
  };

  const handleSearch = () => {
    fetchProperties();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <Button
          onClick={() => navigate('/property')}
          variant="ghost"
          className="mb-6 gap-2"
          data-testid="back-button"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <h2 className="text-3xl font-bold text-slate-900 mb-8">Property Listings</h2>

        {/* Filters */}
        <Card className="p-6 mb-8 bg-white">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <Label>Property Type</Label>
              <Select onValueChange={(value) => setFilters({ ...filters, property_type: value })}>
                <SelectTrigger data-testid="filter-property-type">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_types">All Types</SelectItem>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="Plot">Plot</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Location</Label>
              <Input
                placeholder="Search location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                data-testid="filter-location"
              />
            </div>
            <div>
              <Label>Min Price (₹)</Label>
              <Input
                type="number"
                value={filters.min_price}
                onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
                data-testid="filter-min-price"
              />
            </div>
            <div>
              <Label>Max Price (₹)</Label>
              <Input
                type="number"
                value={filters.max_price}
                onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                data-testid="filter-max-price"
              />
            </div>
          </div>
          <Button
            onClick={handleSearch}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
            data-testid="search-button"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </Card>

        {/* Property Grid */}
        <div className="grid md:grid-cols-3 gap-6" data-testid="property-listings-grid">
          {properties.map((property) => (
            <Card key={property.id} className="p-6 bg-white hover:shadow-xl card-hover" data-testid={`property-card-${property.id}`}>
              {property.images.length > 0 && (
                <img
                  src={property.images[0]}
                  alt={property.property_type}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <div className="mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                  {property.property_type}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{property.location}</h3>
              <p className="text-sm text-slate-600 mb-2">{property.area_size} sq. ft.</p>
              <p className="text-2xl font-bold text-blue-600 mb-4">₹{property.selling_price.toLocaleString()}</p>
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{property.description}</p>
              <div className="text-sm text-slate-500">
                <p>Contact: {property.seller_name}</p>
                <p>{property.seller_phone}</p>
              </div>
            </Card>
          ))}
        </div>

        {properties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">No properties found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertyModule() {
  return (
    <Routes>
      <Route path="/" element={<PropertyHome />} />
      <Route path="/buyer-registration" element={<BuyerRegistration />} />
      <Route path="/seller-registration" element={<SellerRegistration />} />
      <Route path="/listings" element={<PropertyListings />} />
    </Routes>
  );
}
