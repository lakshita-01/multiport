import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Building2, Heart, ShoppingBag, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function AdminHome() {
  const navigate = useNavigate();
  const [matrimonialProfiles, setMatrimonialProfiles] = useState([]);
  const [properties, setProperties] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profilesRes, propertiesRes, ordersRes] = await Promise.all([
        axios.get(`${API}/admin/matrimonial-profiles`, { withCredentials: true }),
        axios.get(`${API}/admin/properties`, { withCredentials: true }),
        axios.get(`${API}/admin/orders`, { withCredentials: true })
      ]);
      setMatrimonialProfiles(profilesRes.data);
      setProperties(propertiesRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      toast.error('Failed to fetch admin data');
    }
  };

  const approveProfile = async (profileId) => {
    try {
      await axios.patch(
        `${API}/admin/matrimonial-profiles/${profileId}/approve`,
        {},
        { withCredentials: true }
      );
      toast.success('Profile approved!');
      fetchData();
    } catch (error) {
      toast.error('Failed to approve profile');
    }
  };

  const pendingProfiles = matrimonialProfiles.filter(p => p.status === 'pending');
  const pendingOrders = orders.filter(o => o.status === 'processing');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Properties</p>
                <p className="text-3xl font-bold text-slate-900">{properties.length}</p>
              </div>
              <Building2 className="h-12 w-12 text-blue-500" />
            </div>
          </Card>
          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Matrimonial Profiles</p>
                <p className="text-3xl font-bold text-slate-900">{matrimonialProfiles.length}</p>
              </div>
              <Heart className="h-12 w-12 text-rose-500" />
            </div>
          </Card>
          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Orders</p>
                <p className="text-3xl font-bold text-slate-900">{orders.length}</p>
              </div>
              <ShoppingBag className="h-12 w-12 text-emerald-500" />
            </div>
          </Card>
          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pending Approvals</p>
                <p className="text-3xl font-bold text-slate-900">{pendingProfiles.length}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-yellow-500" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="matrimonial" className="w-full" data-testid="admin-tabs">
          <TabsList className="mb-8">
            <TabsTrigger value="matrimonial" data-testid="tab-matrimonial">Matrimonial Profiles</TabsTrigger>
            <TabsTrigger value="properties" data-testid="tab-properties">Properties</TabsTrigger>
            <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="matrimonial">
            <div className="space-y-4" data-testid="matrimonial-profiles-list">
              {matrimonialProfiles.map((profile) => (
                <Card key={profile.id} className="p-6 bg-white" data-testid={`profile-${profile.id}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{profile.name}</h3>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Gender: </span>
                          <span className="font-semibold">{profile.gender}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Age: </span>
                          <span className="font-semibold">{profile.age} years</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Religion: </span>
                          <span className="font-semibold">{profile.religion}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Occupation: </span>
                          <span className="font-semibold">{profile.occupation}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Location: </span>
                          <span className="font-semibold">{profile.city}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Payment: </span>
                          <Badge className={profile.payment_status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                            {profile.payment_status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={profile.profile_status === 'active' ? 'bg-green-100 text-green-700' : profile.profile_status === 'pending_approval' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'}>
                        {profile.profile_status}
                      </Badge>
                      {profile.profile_status === 'pending_approval' && profile.payment_status === 'completed' && (
                        <Button
                          onClick={() => approveProfile(profile.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          data-testid={`approve-${profile.id}`}
                        >
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              {matrimonialProfiles.length === 0 && (
                <p className="text-center text-slate-600 py-12">No profiles yet</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="properties">
            <div className="space-y-4" data-testid="properties-list">
              {properties.map((property) => (
                <Card key={property.id} className="p-6 bg-white" data-testid={`property-${property.id}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{property.location}</h3>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Type: </span>
                          <span className="font-semibold">{property.property_type}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Area: </span>
                          <span className="font-semibold">{property.area_size} sq. ft.</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Price: </span>
                          <span className="font-semibold">₹{property.selling_price.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Seller: </span>
                          <span className="font-semibold">{property.seller_name}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Contact: </span>
                          <span className="font-semibold">{property.seller_phone}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Status: </span>
                          <Badge className={property.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}>
                            {property.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {properties.length === 0 && (
                <p className="text-center text-slate-600 py-12">No properties yet</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="space-y-4" data-testid="orders-list">
              {orders.map((order) => (
                <Card key={order.id} className="p-6 bg-white" data-testid={`order-${order.id}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Order #{order.order_number}</h3>
                      <div className="space-y-2 text-sm mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx}>
                            <span className="text-slate-600">{item.product_name} x {item.quantity}</span>
                            <span className="font-semibold ml-2">₹{item.total}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <span className="text-slate-600">Total: </span>
                        <span className="text-xl font-bold text-emerald-600">₹{order.total_amount}</span>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className={order.payment_status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                        Payment: {order.payment_status}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-700">
                        {order.status}
                      </Badge>
                      <p className="text-xs text-slate-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
              {orders.length === 0 && (
                <p className="text-center text-slate-600 py-12">No orders yet</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Routes>
      <Route path="/" element={<AdminHome />} />
    </Routes>
  );
}
