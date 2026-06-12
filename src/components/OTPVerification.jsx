import { useState } from 'react';
import { sendEmailOTP, sendPhoneOTP, verifyOTP } from '../utils/otpService';
import { CheckCircle, Send } from 'lucide-react';

const OTPVerification = ({ type, value, onVerified, label }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendOTP = () => {
    if (!value) {
      setError(`Please enter ${label} first`);
      return;
    }
    setSending(true);
    setError('');
    try {
      if (type === 'email') sendEmailOTP(value);
      else sendPhoneOTP(value);
      setOtpSent(true);
    } catch {
      setError('Failed to send OTP');
    } finally {
      setSending(false);
    }
  };

  const handleVerify = () => {
    const result = verifyOTP(type, value, otp);
    if (result.success) {
      setVerified(true);
      setError('');
      onVerified(type);
    } else {
      setError(result.message);
    }
  };

  if (verified) {
    return (
      <div className="flex items-center text-green-600 text-sm mt-1">
        <CheckCircle className="w-4 h-4 mr-1" />
        {label} verified
      </div>
    );
  }

  return (
    <div className="mt-1">
      {!otpSent ? (
        <button
          type="button"
          onClick={handleSendOTP}
          disabled={sending || !value}
          className="text-sm text-blue-600 hover:text-blue-700 underline disabled:opacity-50"
        >
          <Send className="w-3 h-3 inline mr-1" />
          {sending ? 'Sending...' : `Send OTP to ${label}`}
        </button>
      ) : (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="button"
            onClick={handleVerify}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Verify
          </button>
          <button
            type="button"
            onClick={handleSendOTP}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            Resend
          </button>
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default OTPVerification;
