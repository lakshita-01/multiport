import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Auth from './pages/Auth';
import Admin from './pages/Admin';

import PropertyHome from './pages/property/PropertyHome';
import BuyerRegister from './pages/property/BuyerRegister';
import SellerRegister from './pages/property/SellerRegister';
import BrowseProperties from './pages/property/BrowseProperties';

import MatrimonialHome from './pages/matrimonial/MatrimonialHome';
import ProfileRegister from './pages/matrimonial/ProfileRegister';
import BrowseProfiles from './pages/matrimonial/BrowseProfiles';
import MyChoices from './pages/matrimonial/MyChoices';

import EcommerceHome from './pages/ecommerce/EcommerceHome';
import Cart from './pages/ecommerce/Cart';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />

              <Route path="/property" element={<PropertyHome />} />
              <Route path="/property/buyer-register" element={<BuyerRegister />} />
              <Route path="/property/seller-register" element={<SellerRegister />} />
              <Route path="/property/browse" element={<BrowseProperties />} />

              <Route path="/matrimonial" element={<MatrimonialHome />} />
              <Route path="/matrimonial/register" element={<ProfileRegister />} />
              <Route path="/matrimonial/browse" element={<BrowseProfiles />} />
              <Route path="/matrimonial/my-choices" element={<MyChoices />} />

              <Route path="/ecommerce" element={<EcommerceHome />} />
              <Route path="/ecommerce/cart" element={<Cart />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
