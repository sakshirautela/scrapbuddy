// @ts-nocheck
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import "./Alert.css";

const AlertContext = createContext(null);

const alertIcons = {
  success: "✓",
  error: "!",
  warning: "!",
  info: "i",
};

const getAlertType = (message, explicitType) => {
  if (explicitType) {
    return explicitType;
  }

  const normalizedMessage = String(message || "").toLowerCase();

  if (
    normalizedMessage.includes("failed") ||
    normalizedMessage.includes("error") ||
    normalizedMessage.includes("invalid") ||
    normalizedMessage.includes("required") ||
    normalizedMessage.includes("please ")
  ) {
    return "error";
  }

  if (
    normalizedMessage.includes("success") ||
    normalizedMessage.includes("saved") ||
    normalizedMessage.includes("sent") ||
    normalizedMessage.includes("updated")
  ) {
    return "success";
  }

  return "info";
};

export const useAlert = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("useAlert must be used within AlertProvider");
  }

  return context;
};

const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const dismissAlert = useCallback((id) => {
    setAlerts((current) => current.filter((alert) => alert.id !== id));
  }, []);

  const showAlert = useCallback((message, options = {}) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const type = getAlertType(message, options.type);
    const duration = options.duration ?? 4200;

    setAlerts((current) => [
      ...current.slice(-3),
      {
        id,
        type,
        title: options.title,
        message: String(message || ""),
      },
    ]);

    if (duration > 0) {
      window.setTimeout(() => dismissAlert(id), duration);
    }

    return id;
  }, [dismissAlert]);

  useEffect(() => {
    const nativeAlert = window.alert;

    window.alert = (message) => {
      showAlert(message);
    };

    return () => {
      window.alert = nativeAlert;
    };
  }, [showAlert]);

  const contextValue = useMemo(() => ({
    showAlert,
    dismissAlert,
  }), [dismissAlert, showAlert]);

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      <div className="toast-region" role="region" aria-label="Notifications">
        {alerts.map((alert) => (
          <div className={`toast-card toast-${alert.type}`} key={alert.id} role="status">
            <div className="toast-icon" aria-hidden="true">
              {alertIcons[alert.type] || alertIcons.info}
            </div>
            <div className="toast-copy">
              <strong>{alert.title || (alert.type === "success" ? "Success" : alert.type === "error" ? "Action needed" : "Notice")}</strong>
              <span>{alert.message}</span>
            </div>
            <button type="button" className="toast-close" onClick={() => dismissAlert(alert.id)} aria-label="Dismiss notification">
              ×
            </button>
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};

export default AlertProvider;
