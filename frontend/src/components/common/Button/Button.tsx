// @ts-nocheck
import './Button.css';
import Loader from '../Loader/Loader';

function Button({
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  children,
  onClick,
  className = ''
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-fullwidth' : ''} ${className}`}
    >
      {loading ? (
        <>
          <Loader size="sm" inline />
          <span className="ml-2">Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
