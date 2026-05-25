import React, { useState } from "react";
import {
  defaultSupportSettings,
  getSupportSettings,
  saveSupportSettings,
} from "../../utils/supportSettings";

const SupportSettings = () => {
  const [settings, setSettings] = useState(getSupportSettings);
  const [message, setMessage] = useState("");

  const updateField = (name, value) => {
    setSettings((current) => ({
      ...current,
      [name]: value,
    }));
    setMessage("");
  };

  const handleSave = () => {
    if (!settings.phone.trim() || !settings.email.trim()) {
      setMessage("Phone and email are required.");
      return;
    }

    setSettings(saveSupportSettings(settings));
    setMessage("Support details updated.");
  };

  const handleReset = () => {
    setSettings(saveSupportSettings(defaultSupportSettings));
    setMessage("Support details reset.");
  };

  return (
    <section className="admin-card support-settings-card">
      <div className="table-title-row">
        <div>
          <h2>Support Details</h2>
          <p>Edit the support phone, email, address, and help card text shown to users.</p>
        </div>
      </div>

      <div className="support-settings-grid">
        <label>
          Phone
          <input
            type="tel"
            value={settings.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            placeholder="+91 98765 43210"
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={settings.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="hello@scrapify.in"
          />
        </label>
        <label className="full">
          Address
          <input
            type="text"
            value={settings.address}
            onChange={(event) => updateField("address", event.target.value)}
            placeholder="Greater Noida, Uttar Pradesh"
          />
        </label>
        <label>
          Help Title
          <input
            type="text"
            value={settings.helpTitle}
            onChange={(event) => updateField("helpTitle", event.target.value)}
          />
        </label>
        <label>
          Button Text
          <input
            type="text"
            value={settings.buttonText}
            onChange={(event) => updateField("buttonText", event.target.value)}
          />
        </label>
        <label className="full">
          Help Message
          <textarea
            value={settings.helpMessage}
            onChange={(event) => updateField("helpMessage", event.target.value)}
            rows="4"
          />
        </label>
      </div>

      {message ? <p className="support-settings-message">{message}</p> : null}

      <div className="support-settings-actions">
        <button className="admin-primary" type="button" onClick={handleSave}>
          Save Support Details
        </button>
        <button className="admin-secondary" type="button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </section>
  );
};

export default SupportSettings;
