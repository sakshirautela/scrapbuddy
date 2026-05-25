import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import FormInput from '../../common/FormInput/FormInput';
import Button from '../../common/Button/Button';
import Alert from '../../common/Alert/Alert';
import { validateLoginForm } from '../../../utils/validators';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateLoginForm(formData.email, formData.password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await login(formData.email, formData.password);
      
      // Redirect based on user role
      const userRole = response.user?.role?.toLowerCase() || '';
      if (userRole === 'admin' || userRole === 'superadmin' || userRole === 'super_admin') {
        navigate('/admin');
      } else if (userRole === 'user') {
        navigate('/');
      } else {
        // Default redirect if role is not recognized
        navigate('/');
      }
    } catch (err) {
      setErrors({ submit: err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Welcome back to Scrapify</h1>
          <p className="login-subtitle">Manage pickups, saved addresses, and order updates.</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          {errors.submit && (
            <Alert type="error" message={errors.submit} onClose={() => setErrors(prev => ({ ...prev, submit: '' }))} />
          )}

          <FormInput
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            error={errors.email}
            required
            disabled={loading}
          />

          <FormInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.password}
            required
            disabled={loading}
            showPasswordToggle
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="login-links">
          <Link to="/forget-password" className="link link-secondary">
            Forgot password?
          </Link>
          <span className="divider">•</span>
          <Link to="/signup" className="link link-secondary">
            Create account
          </Link>
        </div>
      </div>

      <div className="login-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>
    </div>
  );
}

export default Login;
