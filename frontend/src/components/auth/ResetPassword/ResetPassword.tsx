// @ts-nocheck
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authApi from '../../../api/authApi';
import './ResetPassword.css';

function ResetPassword() {

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const token = location.state?.token;

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
const handleNavigate = () => {
 localStorage.clear();
  navigate('/login');
};
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!token) {
      setError('Reset session expired. Please request a new OTP.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {

      await authApi.setPassword(email, formData.password, token);

      setMessage('Password reset successfully');

      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">

      <form
        className="reset-password-form"
        onSubmit={handleSubmit}
      >
        <h2>Reset Password</h2>

        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}

        <input
          type="password"
          name="password"
          placeholder="New Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading} onClick={handleNavigate}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

      </form>

    </div>
  );
}

export default ResetPassword;
