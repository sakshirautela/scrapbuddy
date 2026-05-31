// @ts-nocheck
import { useEffect, useState } from 'react';
import authApi from '../../../api/authApi';
import './ForwardPassword.css';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isLinkSent, setIsLinkSent] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (resendCooldown <= 0) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  const startResendCooldown = () => {
    setResendCooldown(30);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');
    setLoading(true);

    try {

      await authApi.forgotPassword(email);

      setMessage('OTP sent successfully to your email');
      setIsLinkSent(true);
      startResendCooldown();

    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendingOtp || resendCooldown > 0) {
      return;
    }

    setError('');
    setMessage('');
    setResendingOtp(true);

    try {
      await authApi.forgotPassword(email);
      setOtp('');
      setMessage('A new OTP has been sent to your email');
      startResendCooldown();
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setResendingOtp(false);
    }
  };

  const handleNavigate = async () => {
    try {

      await authApi.verifyOtp(email, otp);

      navigate('/reset-password', {
        state: { email, token: otp }
      });

    } catch (err) {
      setError(err.message || 'Invalid OTP');
    }
  };

  return (
    <div className="forgot-password-container">

      <form
        className="forgot-password-form"
        onSubmit={handleSubmit}
      >
        <h2>Forgot Password</h2>

        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send OTP'}
        </button>

        {isLinkSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="otp-input"
            />

            <button
              type="button"
              onClick={handleNavigate}
              className="verify-btn"
            >
              Verify OTP
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              className="resend-otp-btn"
              disabled={loading || resendingOtp || resendCooldown > 0}
            >
              {resendingOtp
                ? 'Resending...'
                : resendCooldown > 0
                  ? `Resend OTP in ${resendCooldown}s`
                  : 'Resend OTP'}
            </button>
          </>
        )}

      </form>

    </div>
  );
}

export default ForgotPassword;
