// @ts-nocheck
import './Loader.css';

function Loader({ size = 'md', fullScreen = false, label = '', inline = false }) {
  const spinner = (
    <div className={`loader-wrap${inline ? ' loader-inline' : ''}`}>
      <div className={`loader loader-${size}`} aria-hidden="true"></div>
      {label ? <span>{label}</span> : null}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loader-fullscreen" role="status" aria-live="polite">
        {spinner}
      </div>
    );
  }

  if (inline) {
    return spinner;
  }

  return (
    <div className="loader-region" role="status" aria-live="polite">
      {spinner}
    </div>
  );
}

export default Loader;
