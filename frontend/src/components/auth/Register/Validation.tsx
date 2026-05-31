// @ts-nocheck
export default function validateRegistration(data = {}) {
  const errors = {};

  if (!data.email) {
    errors.email = "Email is required";
  }

  if (!data.otp) {
    errors.otp = "OTP is required";
  }

  return errors;
}
