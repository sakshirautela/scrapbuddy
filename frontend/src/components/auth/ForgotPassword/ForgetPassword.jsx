import { useState } from 'react';
import authApi from '../../../api/authApi';
import './ForwardPassword.css';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLinkSent, setIsLinkSent] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');
    setLoading(true);

    try {

      await authApi.forgotPassword(email);

      setMessage('OTP sent successfully to your email');
      setIsLinkSent(true);

    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
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
          </>
        )}

      </form>

    </div>
  );
}

export default ForgotPassword;
