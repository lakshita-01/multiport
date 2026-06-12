# Unified Portal - Multi-Module Application

A comprehensive full-stack web application that combines three main modules: Property Purchase, Matrimonial Services, and E-Commerce - all under a single unified portal.

## Features

### 1. Property Purchase Module
- **Buyer Registration**: Register as a buyer with property preferences
- **Seller Registration**: List properties for sale with images and videos
- **Property Browsing**: Search and filter properties by location, type, price, and size
- **Media Support**: Upload and view property images and videos stored in Supabase Storage

### 2. Matrimonial Site Module
- **Profile Registration**: Create detailed matrimonial profiles
- **Payment Integration**: ₹500 registration fee via Razorpay
- **Profile Activation Flow**: Profile created → Payment → Activation
- **Swipe Functionality**: Tinder-style swipe interface
  - Swipe Right (❤️): Add profile to "My Choices"
  - Swipe Left (❌): Skip profile
- **Browse Profiles**: View active profiles with complete details
- **My Choices**: Saved list of liked profiles

### 3. E-Commerce Module
- **Product Catalog**: Browse premium quality pulses
- **Shopping Cart**: Add, update, and remove items
- **Checkout Process**: Complete address and payment flow
- **Payment Gateway**: Secure payments via Razorpay
- **Order Management**: Track orders and payment confirmations

### 4. Admin Dashboard
- View statistics across all modules
- Monitor registrations, orders, and revenue
- Quick access to manage all modules

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password)
- **Storage**: Supabase Storage (Images & Videos)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Payment Gateway**: Razorpay

## Database Schema

### Property Module
- `buyers` - Buyer registrations with preferences
- `sellers` - Seller information
- `properties` - Property listings with media URLs

### Matrimonial Module
- `matrimonial_profiles` - User profiles with status tracking
- `matrimonial_payments` - Payment records
- `profile_choices` - Liked profiles (swipe right)

### E-Commerce Module
- `categories` - Product categories
- `products` - Product catalog (pulses)
- `cart` - User shopping carts
- `orders` - Order records
- `order_items` - Individual order items

## Setup Instructions

### 1. Environment Variables

The `.env` file contains:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
The development server starts automatically.

### 4. Build for Production
```bash
npm run build
```

## Key Features

### Security
- Row Level Security (RLS) enabled on all tables
- Secure authentication with Supabase Auth
- Protected routes for authenticated users
- Secure file uploads to Supabase Storage

### Payment Integration
- Razorpay integration for:
  - Matrimonial profile registration (₹500)
  - E-commerce order payments
- Payment status tracking in database
- Secure payment flow with confirmation

### User Experience
- Responsive design for all screen sizes
- Intuitive navigation with module-specific sections
- Real-time cart updates
- Smooth swipe animations for matrimonial browsing
- Loading states and error handling throughout

### File Organization
- Modular component structure
- Separate pages for each module
- Centralized authentication context
- Reusable UI components (Navbar, Footer)

## Routes

### Main Routes
- `/` - Home page with module cards
- `/auth` - Sign in/Sign up
- `/admin` - Admin dashboard

### Property Module
- `/property` - Property home
- `/property/buyer-register` - Buyer registration
- `/property/seller-register` - Seller registration & property listing
- `/property/browse` - Browse properties

### Matrimonial Module
- `/matrimonial` - Matrimonial home
- `/matrimonial/register` - Profile registration
- `/matrimonial/browse` - Browse profiles (swipe interface)
- `/matrimonial/my-choices` - View liked profiles

### E-Commerce Module
- `/ecommerce` - Product catalog
- `/ecommerce/cart` - Shopping cart & checkout

## Payment Flow

### Matrimonial Registration
1. User fills profile form
2. Profile created with status "PENDING"
3. Payment page shown (₹500)
4. Upon successful payment:
   - Payment record created
   - Profile status changed to "ACTIVE"
5. Redirect to browse profiles

### E-Commerce Checkout
1. User adds products to cart
2. Proceeds to cart/checkout
3. Fills shipping/billing address
4. Makes payment via Razorpay
5. Upon success:
   - Order created
   - Order items recorded
   - Product stock updated
   - Cart cleared
6. Confirmation shown

## Database Policies

All tables have Row Level Security (RLS) enabled with appropriate policies:
- Users can view their own data
- Users can insert their own records
- Proper authentication checks on all operations
- Read access for browsing features

## Storage Buckets

- `property-images` - Property photos
- `property-videos` - Property videos
- `matrimonial-profiles` - Profile images
- `matrimonial-biodatas` - Biodata PDFs
- `product-images` - Product photos

All buckets have public read access for authenticated users and authenticated write access.

## Notes

- The application requires active Supabase and Razorpay accounts
- Update `.env` file with actual credentials before deployment
- Razorpay script is loaded from CDN in `index.html`
- All file uploads are stored in Supabase Storage
- Database migrations are applied via Supabase SQL editor

## Support

For issues or questions, please refer to the respective documentation:
- [Supabase Docs](https://supabase.com/docs)
- [Razorpay Docs](https://razorpay.com/docs)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
