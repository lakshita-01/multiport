// OTP Service - stores OTPs in memory (browser session)
// Production: replace sendEmailOTP/sendPhoneOTP with real API calls to Twilio/SendGrid

const otpStore = new Map();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendEmailOTP = (email) => {
  const otp = generateOTP();
  otpStore.set(`email:${email}`, { otp, expiry: Date.now() + 5 * 60 * 1000 });
  // DEV: OTP printed to console — replace with real email API in production
  console.log(`📧 Email OTP for ${email}: ${otp}`);
  alert(`[DEV MODE] Email OTP for ${email}: ${otp}\n(In production, this would be sent via email)`);
  return { success: true };
};

export const sendPhoneOTP = (phone) => {
  const otp = generateOTP();
  otpStore.set(`phone:${phone}`, { otp, expiry: Date.now() + 5 * 60 * 1000 });
  // DEV: OTP printed to console — replace with Twilio in production
  console.log(`📱 Phone OTP for ${phone}: ${otp}`);
  alert(`[DEV MODE] Phone OTP for ${phone}: ${otp}\n(In production, this would be sent via SMS)`);
  return { success: true };
};

export const verifyOTP = (type, contact, otp) => {
  const key = `${type}:${contact}`;
  const stored = otpStore.get(key);
  if (!stored) return { success: false, message: 'OTP not found. Please request a new one.' };
  if (Date.now() > stored.expiry) {
    otpStore.delete(key);
    return { success: false, message: 'OTP expired. Please request a new one.' };
  }
  if (stored.otp !== otp) return { success: false, message: 'Invalid OTP.' };
  otpStore.delete(key);
  return { success: true };
};
