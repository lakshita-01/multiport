const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Unified Portal</h3>
            <p className="text-gray-400">
              Your one-stop solution for property purchase, matrimonial services, and e-commerce.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/property" className="hover:text-white transition">Property Purchase</a></li>
              <li><a href="/matrimonial" className="hover:text-white transition">Matrimonial Site</a></li>
              <li><a href="/ecommerce" className="hover:text-white transition">E-Commerce</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@unifiedportal.com</li>
              <li>Phone: +91 1234567890</li>
              <li>Address: 123 Main Street, City</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2024 Unified Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
