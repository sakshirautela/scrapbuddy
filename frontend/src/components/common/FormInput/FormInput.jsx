import './FormInput.css';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

function FormInput({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  showPasswordToggle = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === 'password' && showPasswordToggle
      ? showPassword
        ? 'text'
        : 'password'
      : type;

  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`form-input ${error ? 'error' : ''}`}
          {...props}
        />
        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

export default FormInput;
