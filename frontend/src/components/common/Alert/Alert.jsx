import './Alert.css';
import { X } from 'lucide-react';

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
        <button className="alert-close" onClick={onClose}>
          <X size={18} />
        </button>
      )}
    </div>
  );
}

export default Alert;
