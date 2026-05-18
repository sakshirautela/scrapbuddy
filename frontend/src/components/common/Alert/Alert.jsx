import './Alert.css';

function Alert({ type = 'info', message, onClose, dismissible = true }) {
  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        {type === 'error' && <span className="alert-icon">⚠️</span>}
        {type === 'success' && <span className="alert-icon">✓</span>}
        {type === 'warning' && <span className="alert-icon">⚡</span>}
        {type === 'info' && <span className="alert-icon">ℹ️</span>}
        <span className="alert-message">{message}</span>
      </div>
      {dismissible && onClose && (
        <button className="alert-close" type="button" onClick={onClose} aria-label="Close alert">
          ×
        </button>
      )}
    </div>
  );
}

export default Alert;
