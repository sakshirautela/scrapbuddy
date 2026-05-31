// @ts-nocheck
// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation - min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Get password strength
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: 'None', color: 'gray' };
  
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  const strengthMap = {
    0: { label: 'Very Weak', color: '#ef4444' },
    1: { label: 'Weak', color: '#f97316' },
    2: { label: 'Fair', color: '#eab308' },
    3: { label: 'Good', color: '#84cc16' },
    4: { label: 'Strong', color: '#22c55e' },
    5: { label: 'Very Strong', color: '#16a34a' }
  };

  return { strength, ...strengthMap[Math.min(strength, 5)] };
};

// Name validation
export const isValidName = (name) => {
  return name.trim().length >= 2;
};

// Validate form data
export const validateLoginForm = (email, password) => {
  const errors = {};
  
  if (!email) errors.email = 'Email is required';
  else if (!isValidEmail(email)) errors.email = 'Invalid email address';
  
  if (!password) errors.password = 'Password is required';
  
  return errors;
};

export const validateRegisterForm = (formData) => {
  const errors = {};
  
  if (!formData.firstName) errors.firstName = 'First name is required';
  else if (!isValidName(formData.firstName)) errors.firstName = 'First name must be at least 2 characters';
  if (!formData.lastName) errors.lastName = 'Last name is required';
  else if (!isValidName(formData.lastName)) errors.lastName = 'Last name must be at least 2 characters';
  if (!formData.email) errors.email = 'Email is required';
  else if (!isValidEmail(formData.email)) errors.email = 'Invalid email address';
  if (!formData.password) errors.password = 'Password is required';
  else if (!isValidPassword(formData.password)) {
    errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and numbers';
  }
  if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm password';
  else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return errors;
};
