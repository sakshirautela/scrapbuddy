import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import FormInput from '../../common/FormInput/FormInput';
import Button from '../../common/Button/Button';
import Alert from '../../common/Alert/Alert';
import { validateRegisterForm, getPasswordStrength } from '../../../utils/validators';
import authApi from '../../../api/authApi';
import './Register.css';

function Register() {
  const [step, setStep] = useState('register'); // 'register' or 'verify-otp'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Update password strength
    if (name === 'password') {
      const strength = getPasswordStrength(value);
      setPasswordStrength(strength.strength);
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateRegisterForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // First, send registration request and get OTP
      await authApi.register(formData);
      setStep('verify-otp');
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Registration failed';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setErrors({ otp: 'OTP is required' });
      return;
    }

    setLoading(true);
    try {
      await authApi.verifyOtp(formData.email, otp);
      // OTP verified, now register the user
      const response = await register(formData);
      
      // Redirect based on user role
      const userRole = response.user?.role?.toLowerCase() || '';
      if (userRole === 'admin' || userRole === 'superadmin' || userRole === 'super_admin') {
        navigate('/admin');
      } else if (userRole === 'user') {
        navigate('/user');
      } else {
        // Default redirect
        navigate('/');
      }
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'OTP verification failed';
      setErrors({ otp: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRegister = () => {
    setStep('register');
    setOtp('');
    setErrors({});
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">
            {step === 'register' ? 'Join us today' : 'Verify your email'}
          </p>
        </div>

        <form className="register-form" onSubmit={step === 'register' ? handleRegister : handleVerifyOtp}>
          {errors.submit && (
            <Alert
              type="error"
              message={errors.submit}
              onClose={() => setErrors(prev => ({ ...prev, submit: '' }))}
            />
          )}

          {step === 'register' ? (
            <>
              <FormInput
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                error={errors.name}
                required
                disabled={loading}
              />

              <FormInput
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                error={errors.email}
                required
                disabled={loading}
              />

              <div>
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
                {formData.password && (
                  <div className="password-strength">
                    <div className={`strength-bar strength-${passwordStrength}`}></div>
                    <span className={`strength-text strength-${passwordStrength}`}>
                      {['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][
                        passwordStrength
                      ] || 'Very Weak'}
                    </span>
                  </div>
                )}
              </div>

              <FormInput
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                error={errors.confirmPassword}
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </>
          ) : (
            <>
              <div className="otp-info">
                <p>We've sent a verification code to <strong>{formData.email}</strong></p>
              </div>

              <FormInput
                label="Verification Code"
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  if (errors.otp) setErrors(prev => ({ ...prev, otp: '' }));
                }}
                placeholder="000000"
                error={errors.otp}
                required
                disabled={loading}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
              >
                {loading ? 'Verifying...' : 'Verify & Complete'}
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="lg"
                fullWidth
                onClick={handleBackToRegister}
                disabled={loading}
              >
                Back to Registration
              </Button>
            </>
          )}
        </form>

        <div className="register-footer">
          <p>
            Already have an account?{' '}
            <a href="/login" className="link link-primary">
              Sign in
            </a>
          </p>
        </div>
      </div>

      <div className="register-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>
    </div>
  );
}

export default Register;