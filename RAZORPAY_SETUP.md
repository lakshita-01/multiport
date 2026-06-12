# Razorpay Setup Instructions

To enable payment functionality in the Matrimonial and E-Commerce modules, you need to set up Razorpay.

## Steps to Get Razorpay API Key

### 1. Create a Razorpay Account
- Go to [https://razorpay.com](https://razorpay.com)
- Click on "Sign Up" and create your account
- Complete the verification process

### 2. Access the Dashboard
- Log in to your Razorpay Dashboard
- Navigate to Settings → API Keys

### 3. Generate API Keys
- Click on "Generate Test Key" for testing (or "Generate Live Key" for production)
- You'll receive two keys:
  - **Key ID** (starts with `rzp_test_` or `rzp_live_`)
  - **Key Secret** (keep this confidential)

### 4. Update Environment Variables
- Open the `.env` file in your project root
- Replace `your_razorpay_key_id` with your actual Key ID:
  ```
  VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
  ```

## Testing Payments

When using Test Mode:
- Razorpay provides test card details for testing
- No real money is charged
- Use test cards from: [https://razorpay.com/docs/payments/payments/test-card-details](https://razorpay.com/docs/payments/payments/test-card-details)

### Test Card Details
```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry Date: Any future date
```

## Payment Flows in the Application

### 1. Matrimonial Registration (₹500)
- User creates profile
- Redirected to payment page
- Completes payment via Razorpay
- Profile activated on successful payment

### 2. E-Commerce Orders (Variable Amount)
- User adds products to cart
- Proceeds to checkout
- Enters shipping/billing address
- Completes payment via Razorpay
- Order confirmed on successful payment

## Important Notes

1. **Test vs Live Mode**
   - Use Test Keys during development
   - Switch to Live Keys only when ready for production

2. **Key Security**
   - Never commit your Key Secret to version control
   - Only use Key ID in frontend code
   - Key Secret should only be used in backend/server code

3. **Webhook Setup (Optional)**
   - For production, configure webhooks in Razorpay Dashboard
   - This ensures payment verification even if user closes the window

4. **Production Checklist**
   - Complete KYC verification in Razorpay
   - Switch from Test to Live keys
   - Test with small amounts first
   - Enable 2-factor authentication

## Support

For Razorpay-specific issues:
- [Razorpay Documentation](https://razorpay.com/docs)
- [Razorpay Support](https://razorpay.com/support)
- [Integration Guide](https://razorpay.com/docs/payments/payment-gateway/web-integration)

## Current Implementation

The application uses Razorpay's Standard Checkout:
- Loads via CDN (`checkout.razorpay.com`)
- Handles payment UI automatically
- Returns payment confirmation
- Stores transaction details in database
