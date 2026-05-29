import { useEffect, useState } from 'react';
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
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpMessage, setOtpMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register } = useAuth();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'password') {
      const strength = getPasswordStrength(value);
      setPasswordStrength(strength.strength);
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const validationErrors = validateRegisterForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await authApi.sendRegistrationOtp(formData.email);
      setStep('verify-otp');
      setOtpMessage('Verification code sent.');
      startResendCooldown();
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Failed to send verification code';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resendingOtp) {
      return;
    }

    setResendingOtp(true);
    setErrors((current) => ({ ...current, otp: '', submit: '' }));
    setOtpMessage('');

    try {
      await authApi.sendRegistrationOtp(formData.email);
      setOtp('');
      setOtpMessage('A new verification code has been sent.');
      startResendCooldown();
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Failed to resend verification code';
      setErrors({ otp: errorMessage });
    } finally {
      setResendingOtp(false);
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
      await authApi.verifyRegistrationOtp(formData.email, otp);
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'OTP verification failed';
      setErrors({ otp: errorMessage });
      setLoading(false);
      return;
    }

    try {
      const response = await register(formData);
      
      const userRole = (response.user?.role || response.role || '').toLowerCase();
      if (userRole === 'admin' || userRole === 'superadmin' || userRole === 'super_admin') {
        navigate('/AdminDashboard');
      } else if (userRole === 'user') {
        navigate('/DefaultDashboard');
      } else {
        // Default redirect
        navigate('/DefaultDashboard');
      }
    } catch (err) {
      const errorMessage = typeof err === 'string' ? err : err.message || 'Registration failed';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRegister = () => {
    setStep('register');
    setOtp('');
    setOtpMessage('');
    setResendCooldown(0);
    setErrors({});
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Create your Scrapify account</h1>
          <p className="register-subtitle">
            {step === 'register' ? 'Save addresses and track every scrap pickup.' : 'Verify your email to continue.'}
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
                label="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Sakshi"
              />

              <FormInput
                label="Last Name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Rautela"
              />

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
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 mobile number"
                error={errors.phone}
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
                {otpMessage ? <small>{otpMessage}</small> : null}
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
                onClick={handleResendOtp}
                loading={resendingOtp}
                disabled={loading || resendCooldown > 0}
              >
                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
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
